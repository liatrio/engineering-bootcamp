using System.Text.Json;
using AssignmentsService.Infrastructure.Messaging;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace AssignmentsService.Features.Assignments;

/// <summary>
/// Listens for employee.deleted and removes that employee's assignments, so
/// nobody stays assigned after leaving. This is how services stay consistent
/// without reading each other's databases: the owner announces, others react.
/// </summary>
public sealed class EmployeeDeletedConsumer(
    RabbitMqConnection rabbit,
    IServiceScopeFactory scopes,
    ILogger<EmployeeDeletedConsumer> logger) : BackgroundService
{
    public const string Queue = "assignments.employee-deleted";
    private const string RoutingKey = "employee.deleted";
    private static readonly JsonSerializerOptions Json = new(JsonSerializerDefaults.Web);

    private IChannel? _channel;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // RabbitMQ may still be starting. Keep trying; once connected, the
        // client's automatic recovery handles later disconnects by itself.
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await StartConsumingAsync(stoppingToken);
                logger.LogInformation("Consuming {RoutingKey} from queue {Queue}", RoutingKey, Queue);
                return;
            }
            catch (Exception ex) when (!stoppingToken.IsCancellationRequested)
            {
                logger.LogWarning(ex, "Could not start consuming {Queue}; retrying in 5 seconds", Queue);
                await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
            }
        }
    }

    private async Task StartConsumingAsync(CancellationToken ct)
    {
        _channel = await rabbit.CreateChannelAsync(ct);

        // A durable queue survives broker restarts, so deletions announced while
        // this service is down are waiting for it when it comes back.
        await _channel.QueueDeclareAsync(Queue, durable: true, exclusive: false, autoDelete: false, cancellationToken: ct);
        await _channel.QueueBindAsync(Queue, RabbitMqConnection.Exchange, RoutingKey, cancellationToken: ct);
        await _channel.BasicQosAsync(prefetchSize: 0, prefetchCount: 10, global: false, ct);

        var consumer = new AsyncEventingBasicConsumer(_channel);
        consumer.ReceivedAsync += HandleAsync;
        await _channel.BasicConsumeAsync(Queue, autoAck: false, consumer, ct);
    }

    private async Task HandleAsync(object sender, BasicDeliverEventArgs delivery)
    {
        var channel = ((AsyncEventingBasicConsumer)sender).Channel;
        EmployeeDeletedEvent? message;
        try
        {
            message = JsonSerializer.Deserialize<EmployeeDeletedEvent>(delivery.Body.Span, Json);
        }
        catch (JsonException ex)
        {
            // Retrying a message we can't read would fail forever. Drop it, loudly.
            logger.LogError(ex, "Discarding unreadable {RoutingKey} message", RoutingKey);
            await channel.BasicNackAsync(delivery.DeliveryTag, multiple: false, requeue: false);
            return;
        }

        if (message?.Data is not { Id: var employeeId } || employeeId == Guid.Empty)
        {
            logger.LogError("Discarding {RoutingKey} message without data.id", RoutingKey);
            await channel.BasicNackAsync(delivery.DeliveryTag, multiple: false, requeue: false);
            return;
        }

        try
        {
            await using var scope = scopes.CreateAsyncScope();
            var service = scope.ServiceProvider.GetRequiredService<IAssignmentService>();
            var removed = await service.RemoveForEmployeeAsync(employeeId, CancellationToken.None);
            logger.LogInformation("Employee {EmployeeId} was deleted; removed {Count} assignments", employeeId, removed);

            // Ack only after the delete committed. Deleting nothing is fine, so
            // handling the same message twice is harmless (idempotent).
            await channel.BasicAckAsync(delivery.DeliveryTag, multiple: false);
        }
        catch (Exception ex)
        {
            // Probably the database. Put it back once for another try; if the
            // redelivery fails too, drop it rather than loop forever.
            logger.LogError(ex, "Failed to remove assignments for employee {EmployeeId}", employeeId);
            await channel.BasicNackAsync(delivery.DeliveryTag, multiple: false, requeue: !delivery.Redelivered);
        }
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        await base.StopAsync(cancellationToken);
        if (_channel is not null)
        {
            await _channel.DisposeAsync();
        }
    }

    private sealed record EmployeeDeletedEvent(string? Type, EmployeeDeletedData? Data);

    private sealed record EmployeeDeletedData(Guid Id);
}
