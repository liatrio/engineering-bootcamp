namespace EmployeesService.Features.Employees;

/// <summary>Feature flags this feature reads, defined in infra/flagd/flags.flagd.json.</summary>
public static class EmployeeFlags
{
    /// <summary>
    /// Ops kill switch for publishing employee events. Turn it off when
    /// RabbitMQ or a consumer is misbehaving: changes are still saved, they're
    /// just not announced. On by default, so a flagd outage changes nothing.
    /// </summary>
    public const string Events = "employee-events";
    public const bool EventsDefault = true;
}
