namespace AssignmentsService.Infrastructure.Messaging;

/// <summary>The wrapper around every event on company.events (see SPEC.md, "Events").</summary>
public sealed record EventEnvelope(
    Guid EventId,
    string Type,
    DateTime OccurredAt,
    string Source,
    object Data);
