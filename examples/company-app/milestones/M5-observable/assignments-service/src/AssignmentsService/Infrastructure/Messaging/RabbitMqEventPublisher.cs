using System.Diagnostics;
using System.Text.Json;
using RabbitMQ.Client;

namespace AssignmentsService.Infrastructure.Messaging;

/// <summary>Publishes events as persistent JSON messages, routing key = event type.</summary>
public sealed partial class RabbitMqEventPublisher(
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
            Log.Published(logger, type, envelope.EventId);
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            // The database change is already committed, so failing the request
            // now would tell the client "it didn't work" when it did. Instead the
            // event is lost, loudly. This is the dual-write problem (Chapter
            // 3.3.6); the transactional outbox pattern is the real fix.
            Activity.Current?.SetStatus(ActivityStatusCode.Error, ex.Message);
            Log.PublishFailed(logger, ex, type, envelope.EventId);
        }
    }

    // [LoggerMessage] generates the logging code at compile time: no boxing,
    // no parsing the template on every call, and nothing evaluated when the
    // level is switched off. The analyzers (CA1848) ask for it.
    private static partial class Log
    {
        [LoggerMessage(Level = LogLevel.Information, Message = "Published {EventType} {EventId}")]
        public static partial void Published(ILogger logger, string eventType, Guid eventId);

        [LoggerMessage(Level = LogLevel.Error, Message = "Failed to publish {EventType} {EventId}; the event was lost")]
        public static partial void PublishFailed(ILogger logger, Exception exception, string eventType, Guid eventId);
    }
}
