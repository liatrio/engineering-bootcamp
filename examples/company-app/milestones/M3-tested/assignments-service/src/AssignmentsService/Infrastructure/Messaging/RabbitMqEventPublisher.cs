using System.Diagnostics;
using System.Text.Json;
using RabbitMQ.Client;

namespace AssignmentsService.Infrastructure.Messaging;

/// <summary>Publishes events as persistent JSON messages, routing key = event type.</summary>
public sealed class RabbitMqEventPublisher(
    RabbitMqConnection rabbit,
    ILogger<RabbitMqEventPublisher> logger) : IEventPublisher
{
    private const string Source = "assignments-service";
    private static readonly JsonSerializerOptions Json = new(JsonSerializerDefaults.Web);

    public async Task PublishAsync(string type, object data, CancellationToken ct)
    {
        var envelope = new EventEnvelope(Guid.NewGuid(), type, DateTime.UtcNow, Source, data);
        var body = JsonSerializer.SerializeToUtf8Bytes(envelope, Json);
        var properties = new BasicProperties
        {
            ContentType = "application/json",
            DeliveryMode = DeliveryModes.Persistent,   // survives a broker restart
            MessageId = envelope.EventId.ToString(),
            Type = type,
        };

        try
        {
            await rabbit.PublishAsync(routingKey: type, properties, body, ct);
            logger.LogInformation("Published {EventType} {EventId}", type, envelope.EventId);
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            // The database change is already committed, so failing the request
            // now would tell the client "it didn't work" when it did. Instead the
            // event is lost, loudly. This is the dual-write problem (Chapter
            // 3.3.6); the transactional outbox pattern is the real fix.
            Activity.Current?.SetStatus(ActivityStatusCode.Error, ex.Message);
            logger.LogError(ex, "Failed to publish {EventType} {EventId}; the event was lost", type, envelope.EventId);
        }
    }
}
