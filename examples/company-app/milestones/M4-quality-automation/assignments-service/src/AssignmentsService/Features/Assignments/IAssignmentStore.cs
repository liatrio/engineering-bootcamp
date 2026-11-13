namespace AssignmentsService.Features.Assignments;

/// <summary>
/// Persistence for assignments: the only thing AssignmentService knows about storage.
/// </summary>
/// <remarks>
/// Same seam as employees-service's IEmployeeStore, for the same reason: tests
/// can swap in an in-memory fake that still behaves like the database
/// (including the one-per-employee-per-project rule).
/// </remarks>
public interface IAssignmentStore
{
    /// <summary>Assignments ordered by start date, optionally filtered by employee and/or project.</summary>
    Task<IReadOnlyList<Assignment>> ListAsync(Guid? employeeId, Guid? projectId, CancellationToken ct);

    Task<Assignment?> FindAsync(Guid id, CancellationToken ct);

    /// <summary>True when an assignment other than <paramref name="exceptId"/> already links this employee and project.</summary>
    Task<bool> PairExistsAsync(Guid employeeId, Guid projectId, Guid? exceptId, CancellationToken ct);

    /// <summary>Saves a new assignment. Throws ConflictException if the pair already exists.</summary>
    Task AddAsync(Assignment assignment, CancellationToken ct);

    /// <summary>Saves changes to an assignment returned by FindAsync. Throws ConflictException if the pair already exists.</summary>
    Task UpdateAsync(Assignment assignment, CancellationToken ct);

    /// <summary>Deletes by ID. Returns false when there was nothing to delete.</summary>
    Task<bool> DeleteAsync(Guid id, CancellationToken ct);

    /// <summary>Deletes every assignment for one employee. Returns how many were deleted.</summary>
    Task<int> DeleteForEmployeeAsync(Guid employeeId, CancellationToken ct);
}
