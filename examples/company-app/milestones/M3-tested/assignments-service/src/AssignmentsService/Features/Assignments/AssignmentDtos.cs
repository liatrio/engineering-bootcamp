using System.ComponentModel.DataAnnotations;

namespace AssignmentsService.Features.Assignments;

/// <summary>
/// The body of POST and PUT (PUT replaces every writable field, so they share it).
/// </summary>
/// <remarks>
/// The value types are nullable so that a missing field fails [Required]
/// instead of quietly becoming Guid.Empty, 0, or 0001-01-01. After validation
/// the service can safely use <c>.Value</c>.
/// </remarks>
public sealed class AssignmentRequest
{
    [Required]
    public Guid? EmployeeId { get; init; }

    [Required]
    public Guid? ProjectId { get; init; }

    [Required, StringLength(100, MinimumLength = 1)]
    public string Role { get; init; } = "";

    [Required, Range(1, 100)]
    public int? AllocationPercent { get; init; }

    [Required]
    public DateOnly? StartDate { get; init; }

    public DateOnly? EndDate { get; init; }
}

/// <summary>What the API returns, and the "data" of assignment.created.</summary>
public sealed record AssignmentResponse(
    Guid Id,
    Guid EmployeeId,
    Guid ProjectId,
    string Role,
    int AllocationPercent,
    DateOnly StartDate,
    DateOnly? EndDate,
    DateTime CreatedAt,
    DateTime UpdatedAt)
{
    public static AssignmentResponse From(Assignment a) =>
        new(a.Id, a.EmployeeId, a.ProjectId, a.Role, a.AllocationPercent, a.StartDate, a.EndDate, a.CreatedAt, a.UpdatedAt);
}
