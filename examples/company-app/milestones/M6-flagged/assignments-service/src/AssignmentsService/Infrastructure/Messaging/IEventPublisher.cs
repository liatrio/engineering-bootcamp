namespace AssignmentsService.Infrastructure.Messaging;

/// <summary>Publishes domain events to the company.events exchange.</summary>
/// <remarks>
/// Services depend on this interface, not on RabbitMQ, so unit and component
/// tests can pass a fake that just records what was published.
/// </remarks>
public interface IEventPublisher
{
    /// <param name="type">The event type, also used as the routing key (for example "employee.created").</param>
    /// <param name="data">The event payload; serialized as camelCase JSON into the envelope's "data".</param>
    /// <param name="ct">Cancels the publish.</param>
    Task PublishAsync(string type, object data, CancellationToken ct);
}
