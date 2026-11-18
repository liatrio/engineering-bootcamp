using AssignmentsService.Infrastructure.Configuration;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;

namespace AssignmentsService.Infrastructure.Messaging;

/// <summary>
/// One long-lived RabbitMQ connection for the whole app, with one channel for
/// publishing. Consumers ask for channels of their own.
/// </summary>
/// <remarks>
/// Copied from employees-service, plus <see cref="CreateChannelAsync"/> because
/// this service also consumes. RabbitMQ expects one connection per process and
/// one channel per concurrent activity, so publishing and consuming never share
/// a channel. It connects lazily, so the app starts (and reports "not ready" on
/// /readyz) while RabbitMQ is still booting.
/// </remarks>
public sealed class RabbitMqConnection(IOptions<ServiceOptions> options) : IAsyncDisposable
{
    public const string Exchange = "company.events";

    private readonly SemaphoreSlim _gate = new(1, 1);
    private IConnection? _connection;
    private IChannel? _publishChannel;

    /// <summary>Publishes one message and waits for the broker to confirm it.</summary>
    public async Task PublishAsync(string routingKey, BasicProperties properties, ReadOnlyMemory<byte> body, CancellationToken ct)
    {
        // A channel must not be used by two publishers at once; the gate serializes them.
        await _gate.WaitAsync(ct);
        try
        {
            var channel = await GetPublishChannelAsync(ct);
            await channel.BasicPublishAsync(Exchange, routingKey, mandatory: false, properties, body, ct);
        }
        finally
        {
            _gate.Release();
        }
    }

    /// <summary>Opens the connection if needed. Used by the readiness check.</summary>
    public async Task EnsureConnectedAsync(CancellationToken ct)
    {
        await _gate.WaitAsync(ct);
        try
        {
            await GetPublishChannelAsync(ct);
        }
        finally
        {
            _gate.Release();
        }
    }

    /// <summary>
    /// A new channel on the shared connection, with the exchange declared. The
    /// caller owns it. Automatic recovery reopens it, and its consumers, if the
    /// connection drops.
    /// </summary>
    public async Task<IChannel> CreateChannelAsync(CancellationToken ct)
    {
        await _gate.WaitAsync(ct);
        try
        {
            var channel = await (await GetConnectionAsync(ct)).CreateChannelAsync(cancellationToken: ct);
            await DeclareExchangeAsync(channel, ct);
            return channel;
        }
        finally
        {
            _gate.Release();
        }
    }

    // Callers must hold _gate.
    private async Task<IConnection> GetConnectionAsync(CancellationToken ct)
    {
        if (_connection is { IsOpen: true })
        {
            return _connection;
        }

        if (_connection is not null)
        {
            await _connection.DisposeAsync();
        }
        var factory = new ConnectionFactory
        {
            Uri = new Uri(options.Value.RabbitMqUrl),
            ClientProvidedName = "assignments-service",
        };
        _connection = await factory.CreateConnectionAsync(ct);
        return _connection;
    }

    // Callers must hold _gate.
    private async Task<IChannel> GetPublishChannelAsync(CancellationToken ct)
    {
        if (_publishChannel is { IsOpen: true })
        {
            return _publishChannel;
        }

        // Publisher confirms: BasicPublishAsync only returns once the broker has
        // taken responsibility for the message (or throws if it refused it).
        _publishChannel = await (await GetConnectionAsync(ct)).CreateChannelAsync(
            new CreateChannelOptions(publisherConfirmationsEnabled: true, publisherConfirmationTrackingEnabled: true),
            ct);
        await DeclareExchangeAsync(_publishChannel, ct);
        return _publishChannel;
    }

    // Idempotent: creates the exchange if missing and is a no-op otherwise.
    private static Task DeclareExchangeAsync(IChannel channel, CancellationToken ct) =>
        channel.ExchangeDeclareAsync(Exchange, ExchangeType.Topic, durable: true, cancellationToken: ct);

    public async ValueTask DisposeAsync()
    {
        if (_publishChannel is not null)
        {
            await _publishChannel.DisposeAsync();
        }
        if (_connection is not null)
        {
            await _connection.DisposeAsync();
        }
        _gate.Dispose();
    }
}
