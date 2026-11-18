namespace AssignmentsService.Features.Assignments;

/// <summary>
/// The feature flags this feature reads, defined in infra/flagd/flags.flagd.json.
/// Each default below is what the code does when flagd can't be reached, so it
/// is chosen to be the safe answer, not the usual one.
/// </summary>
public static class AssignmentFlags
{
    /// <summary>
    /// Release flag: publish assignment.created. Off by default (unfinished
    /// work stays dark), so if flagd is down, nothing is published.
    /// </summary>
    public const string Notifications = "assignment-notifications";
    public const bool NotificationsDefault = false;

    /// <summary>
    /// Ops kill switch: off makes POST, PUT, and DELETE return 503 while reads
    /// keep working. On by default, so a flagd outage doesn't stop the business.
    /// </summary>
    public const string Writes = "assignments-writes";
    public const bool WritesDefault = true;

    /// <summary>
    /// Percentage rollout of the 100% allocation rule. flagd buckets callers by
    /// targeting key (the X-User-Id header, or the employee ID), so each person
    /// gets the same answer every time. Off by default until the rollout says otherwise.
    /// </summary>
    public const string AllocationCheck = "allocation-check";
    public const bool AllocationCheckDefault = false;
}
