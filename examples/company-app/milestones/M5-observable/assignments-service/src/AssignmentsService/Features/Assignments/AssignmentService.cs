using System.Diagnostics;
using System.Diagnostics.Metrics;
using AssignmentsService.Infrastructure.Clients;
using AssignmentsService.Infrastructure.Errors;
using AssignmentsService.Infrastructure.Messaging;
using AssignmentsService.Infrastructure.Telemetry;

namespace AssignmentsService.Features.Assignments;

public interface IAssignmentService
{
    Task<IReadOnlyList<AssignmentResponse>> ListAsync(Guid? employeeId, Guid? projectId, CancellationToken ct);
    Task<AssignmentResponse> GetAsync(Guid id, CancellationToken ct);
    Task<AssignmentResponse> CreateAsync(AssignmentRequest request, CancellationToken ct);
    Task<AssignmentResponse> UpdateAsync(Guid id, AssignmentRequest request, CancellationToken ct);
    Task DeleteAsync(Guid id, CancellationToken ct);
    Task<int> RemoveForEmployeeAsync(Guid employeeId, CancellationToken ct);
}

/// <summary>
/// The assignment rules: the end date comes after the start date, the employee
/// and the project must exist (asked of their own services), an employee is on
/// a project at most once, and nobody is booked for more than 100% of their time.
/// </summary>
public sealed class AssignmentService(
    IAssignmentStore store,
    IEmployeesClient employees,
    IProjectsClient projects,
    IEventPublisher events,
    TimeProvider time) : IAssignmentService
{
    public const string CreatedEvent = "assignment.created";

    // A business metric: assignments made. No attributes: employee and
    // project IDs are unbounded, and every distinct value would be a new
    // time series in the metrics backend.
    private static readonly Counter<long> AssignmentsCreated = ServiceTelemetry.Meter.CreateCounter<long>(
        "company.assignments.created", unit: "{assignment}", description: "Assignments created through the API");

    public async Task<IReadOnlyList<AssignmentResponse>> ListAsync(Guid? employeeId, Guid? projectId, CancellationToken ct)
    {
        var assignments = await store.ListAsync(employeeId, projectId, ct);
        return [.. assignments.Select(AssignmentResponse.From)];
    }

    public async Task<AssignmentResponse> GetAsync(Guid id, CancellationToken ct)
    {
        var assignment = await store.FindAsync(id, ct) ?? throw new NotFoundException(nameof(Assignment), id);
        return AssignmentResponse.From(assignment);
    }

    public async Task<AssignmentResponse> CreateAsync(AssignmentRequest request, CancellationToken ct)
    {
        EnsureEndDateAfterStartDate(request);
        await EnsureReferencesExistAsync(request, ct);
        await EnsureNotAlreadyAssignedAsync(request, exceptId: null, ct);
        await EnsureAllocationFitsAsync(request, exceptId: null, ct);

        var now = time.GetUtcNow().UtcDateTime;
        var assignment = new Assignment { Id = Guid.NewGuid(), CreatedAt = now, UpdatedAt = now };
        Apply(request, assignment);
        await store.AddAsync(assignment, ct);
        AssignmentsCreated.Add(1);

        var response = AssignmentResponse.From(assignment);
        // The row is committed. Publishing ignores the request's cancellation
        // token so a client hanging up now can't suppress the event.
        await events.PublishAsync(CreatedEvent, response, CancellationToken.None);
        return response;
    }

    public async Task<AssignmentResponse> UpdateAsync(Guid id, AssignmentRequest request, CancellationToken ct)
    {
        var assignment = await store.FindAsync(id, ct) ?? throw new NotFoundException(nameof(Assignment), id);
        EnsureEndDateAfterStartDate(request);
        await EnsureReferencesExistAsync(request, ct);
        await EnsureNotAlreadyAssignedAsync(request, exceptId: id, ct);
        await EnsureAllocationFitsAsync(request, exceptId: id, ct);

        Apply(request, assignment);
        assignment.UpdatedAt = time.GetUtcNow().UtcDateTime;
        await store.UpdateAsync(assignment, ct);
        return AssignmentResponse.From(assignment);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct)
    {
        if (!await store.DeleteAsync(id, ct))
        {
            throw new NotFoundException(nameof(Assignment), id);
        }
    }

    /// <summary>Called when employees-service announces employee.deleted.</summary>
    public Task<int> RemoveForEmployeeAsync(Guid employeeId, CancellationToken ct) =>
        store.DeleteForEmployeeAsync(employeeId, ct);

    // Checked first: it needs no I/O, so a bad request fails fast.
    private static void EnsureEndDateAfterStartDate(AssignmentRequest request)
    {
        if (request.EndDate is { } end && end <= request.StartDate!.Value)
        {
            throw new RequestValidationException("endDate", "endDate must be after startDate.");
        }
    }

    // An employee's assignments that overlap in time can't add up to more than
    // 100%. Assignments that don't overlap don't count against each other, so
    // someone can move from one full-time project to the next.
    private async Task EnsureAllocationFitsAsync(AssignmentRequest request, Guid? exceptId, CancellationToken ct)
    {
        var start = request.StartDate!.Value;
        var existing = await store.ListAsync(request.EmployeeId, projectId: null, ct);
        var alreadyAllocated = existing
            .Where(a => a.Id != exceptId && Overlaps(a.StartDate, a.EndDate, start, request.EndDate))
            .Sum(a => a.AllocationPercent);

        var total = alreadyAllocated + request.AllocationPercent!.Value;
        if (total > 100)
        {
            throw new ConflictException(
                $"Employee '{request.EmployeeId}' would be allocated {total}% during this period; the limit is 100%.");
        }
    }

    // Date ranges are inclusive, and a missing end date means "open-ended".
    private static bool Overlaps(DateOnly startA, DateOnly? endA, DateOnly startB, DateOnly? endB) =>
        startA <= (endB ?? DateOnly.MaxValue) && startB <= (endA ?? DateOnly.MaxValue);

    // Ask the owning services. A 404 from either is the caller's mistake (400,
    // reported per field); no answer at all is DependencyUnavailableException (503).
    // The manual span groups the two HTTP calls (each already has its own
    // client span) under one name, so a trace shows how long validation took
    // in total and what it decided.
    private async Task EnsureReferencesExistAsync(AssignmentRequest request, CancellationToken ct)
    {
        using var activity = ServiceTelemetry.ActivitySource.StartActivity("validate employee and project");
        activity?.SetTag("employee.id", request.EmployeeId);
        activity?.SetTag("project.id", request.ProjectId);

        var errors = new Dictionary<string, string[]>();
        if (!await employees.ExistsAsync(request.EmployeeId!.Value, ct))
        {
            errors["employeeId"] = [$"Employee '{request.EmployeeId}' does not exist."];
        }
        if (!await projects.ExistsAsync(request.ProjectId!.Value, ct))
        {
            errors["projectId"] = [$"Project '{request.ProjectId}' does not exist."];
        }
        activity?.SetTag("validation.result", errors.Count == 0 ? "ok" : string.Join(",", errors.Keys));
        if (errors.Count > 0)
        {
            activity?.SetStatus(ActivityStatusCode.Error, "Unknown employee or project");
            throw new RequestValidationException(errors);
        }
    }

    private async Task EnsureNotAlreadyAssignedAsync(AssignmentRequest request, Guid? exceptId, CancellationToken ct)
    {
        if (await store.PairExistsAsync(request.EmployeeId!.Value, request.ProjectId!.Value, exceptId, ct))
        {
            throw new ConflictException("That employee is already assigned to that project.");
        }
    }

    // PUT replaces every writable field, so create and update share this.
    // [ApiController] has already rejected requests with missing values.
    private static void Apply(AssignmentRequest request, Assignment assignment)
    {
        assignment.EmployeeId = request.EmployeeId!.Value;
        assignment.ProjectId = request.ProjectId!.Value;
        assignment.Role = request.Role.Trim();
        assignment.AllocationPercent = request.AllocationPercent!.Value;
        assignment.StartDate = request.StartDate!.Value;
        assignment.EndDate = request.EndDate;
    }
}
