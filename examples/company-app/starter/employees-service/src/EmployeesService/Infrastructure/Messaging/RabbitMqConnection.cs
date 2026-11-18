using EmployeesService.Infrastructure.Configuration;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;

namespace EmployeesService.Infrastructure.Messaging;

/// <summary>
/// One long-lived RabbitMQ connection and publishing channel for the whole app.
/// </summary>
/// <remarks>
/// Connections are expensive (a TCP connection plus a handshake), so RabbitMQ
/// expects one per process, not one per request: register this as a singleton.
/// It connects lazily, on first use, so the app can start (and report "not
/// ready" on /readyz) while RabbitMQ is still booting.
/// </remarks>
public sealed class RabbitMqConnection(IOptions<ServiceOptions> options) : IAsyncDisposable
{
    public const string Exchange = "company.events";

    private readonly SemaphoreSlim _gate = new(1, 1);
    private IConnection? _connection;
    private IChannel? _channel;

    public bool IsOpen => _connection?.IsOpen == true && _channel?.IsOpen == true;

    /// <summary>Publishes one message and waits for the broker to confirm it.</summary>
    public async Task PublishAsync(string routingKey, BasicProperties properties, ReadOnlyMemory<byte> body, CancellationToken ct)
    {
        // A channel must not be used by two publishers at once; the gate serializes them.
        await _gate.WaitAsync(ct);
        try
        {
            var channel = await GetChannelAsync(ct);
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
            await GetChannelAsync(ct);
        }
        finally
        {
            _gate.Release();
        }
    }

    // Callers must hold _gate.
    private async Task<IChannel> GetChannelAsync(CancellationToken ct)
    {
        if (_channel is { IsOpen: true })
        {
            return _channel;
        }

        if (_connection is not { IsOpen: true })
        {
            if (_connection is not null)
            {
                await _connection.DisposeAsync();
            }
            var factory = new ConnectionFactory
            {
                Uri = new Uri(options.Value.RabbitMqUrl),
                ClientProvidedName = "employees-service",
            };
            _connection = await factory.CreateConnectionAsync(ct);
        }

        // Publisher confirms: BasicPublishAsync only returns once the broker has
        // taken responsibility for the message (or throws if it refused it).
        _channel = await _connection.CreateChannelAsync(
            new CreateChannelOptions(publisherConfirmationsEnabled: true, publisherConfirmationTrackingEnabled: true),
            ct);

        // Declaring is idempotent: it creates the exchange if missing and is a no-op otherwise.
        await _channel.ExchangeDeclareAsync(Exchange, ExchangeType.Topic, durable: true, cancellationToken: ct);
        return _channel;
    }

    public async ValueTask DisposeAsync()
    {
        if (_channel is not null)
        {
            await _channel.DisposeAsync();
        }
        if (_connection is not null)
        {
            await _connection.DisposeAsync();
        }
        _gate.Dispose();
    }
}
