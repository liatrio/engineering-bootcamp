namespace AssignmentsService.Features.Assignments;

/// <summary>An employee working on a project. Plain data: the rules live in AssignmentService.</summary>
public sealed class Assignment
{
    public Guid Id { get; set; }

    // IDs owned by other services. There is no foreign key: those tables live
    // in other databases, so AssignmentService checks them over HTTP instead.
    public Guid EmployeeId { get; set; }
    public Guid ProjectId { get; set; }

    public string Role { get; set; } = "";
    public int AllocationPercent { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly? EndDate { get; set; }   // null: open-ended

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
