using AssignmentsService.Infrastructure.Clients;
using AssignmentsService.Infrastructure.Errors;
using AssignmentsService.Infrastructure.Messaging;

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
/// The assignment rules: the employee and the project must exist (asked of
/// their own services), and an employee is on a project at most once.
/// </summary>
public sealed class AssignmentService(
    IAssignmentStore store,
    IEmployeesClient employees,
    IProjectsClient projects,
    IEventPublisher events,
    TimeProvider time) : IAssignmentService
{
    public const string CreatedEvent = "assignment.created";

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
        await EnsureReferencesExistAsync(request, ct);
        await EnsureNotAlreadyAssignedAsync(request, exceptId: null, ct);

        var now = time.GetUtcNow().UtcDateTime;
        var assignment = new Assignment { Id = Guid.NewGuid(), CreatedAt = now, UpdatedAt = now };
        Apply(request, assignment);
        await store.AddAsync(assignment, ct);

        var response = AssignmentResponse.From(assignment);
        // The row is committed. Publishing ignores the request's cancellation
        // token so a client hanging up now can't suppress the event.
        await events.PublishAsync(CreatedEvent, response, CancellationToken.None);
        return response;
    }

    public async Task<AssignmentResponse> UpdateAsync(Guid id, AssignmentRequest request, CancellationToken ct)
    {
        var assignment = await store.FindAsync(id, ct) ?? throw new NotFoundException(nameof(Assignment), id);
        await EnsureReferencesExistAsync(request, ct);
        await EnsureNotAlreadyAssignedAsync(request, exceptId: id, ct);

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

    // Ask the owning services. A 404 from either is the caller's mistake (400,
    // reported per field); no answer at all is DependencyUnavailableException (503).
    private async Task EnsureReferencesExistAsync(AssignmentRequest request, CancellationToken ct)
    {
        var errors = new Dictionary<string, string[]>();
        if (!await employees.ExistsAsync(request.EmployeeId!.Value, ct))
        {
            errors["employeeId"] = [$"Employee '{request.EmployeeId}' does not exist."];
        }
        if (!await projects.ExistsAsync(request.ProjectId!.Value, ct))
        {
            errors["projectId"] = [$"Project '{request.ProjectId}' does not exist."];
        }
        if (errors.Count > 0)
        {
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
