using AssignmentsService.Features.Assignments;
using AssignmentsService.Infrastructure.Errors;

namespace AssignmentsService.Tests.Fakes;

/// <summary>
/// A dictionary-backed IAssignmentStore that behaves like the database where it
/// matters: one assignment per employee and project, ordering, and copies in
/// and out so callers can't change "stored" rows by accident.
/// </summary>
public sealed class InMemoryAssignmentStore : IAssignmentStore
{
    private readonly Dictionary<Guid, Assignment> _rows = [];
    private readonly Lock _lock = new();

    public int Count
    {
        get { lock (_lock) { return _rows.Count; } }
    }

    public Task<IReadOnlyList<Assignment>> ListAsync(Guid? employeeId, Guid? projectId, CancellationToken ct)
    {
        lock (_lock)
        {
            IReadOnlyList<Assignment> result = [.. _rows.Values
                .Where(a => (employeeId is null || a.EmployeeId == employeeId) && (projectId is null || a.ProjectId == projectId))
                .OrderBy(a => a.StartDate).ThenBy(a => a.Id)
                .Select(Copy)];
            return Task.FromResult(result);
        }
    }

    public Task<Assignment?> FindAsync(Guid id, CancellationToken ct)
    {
        lock (_lock)
        {
            return Task.FromResult(_rows.TryGetValue(id, out var a) ? Copy(a) : null);
        }
    }

    public Task<bool> PairExistsAsync(Guid employeeId, Guid projectId, Guid? exceptId, CancellationToken ct)
    {
        lock (_lock)
        {
            return Task.FromResult(PairTaken(employeeId, projectId, exceptId));
        }
    }

    public Task AddAsync(Assignment assignment, CancellationToken ct) => SaveAsync(assignment);

    public Task UpdateAsync(Assignment assignment, CancellationToken ct) => SaveAsync(assignment);

    public Task<bool> DeleteAsync(Guid id, CancellationToken ct)
    {
        lock (_lock)
        {
            return Task.FromResult(_rows.Remove(id));
        }
    }

    public Task<int> DeleteForEmployeeAsync(Guid employeeId, CancellationToken ct)
    {
        lock (_lock)
        {
            var ids = _rows.Values.Where(a => a.EmployeeId == employeeId).Select(a => a.Id).ToList();
            ids.ForEach(id => _rows.Remove(id));
            return Task.FromResult(ids.Count);
        }
    }

    private Task SaveAsync(Assignment assignment)
    {
        lock (_lock)
        {
            // Mirrors the unique index on (EmployeeId, ProjectId).
            if (PairTaken(assignment.EmployeeId, assignment.ProjectId, assignment.Id))
            {
                throw new ConflictException("That employee is already assigned to that project.");
            }
            _rows[assignment.Id] = Copy(assignment);
        }
        return Task.CompletedTask;
    }

    private bool PairTaken(Guid employeeId, Guid projectId, Guid? exceptId) =>
        _rows.Values.Any(a => a.Id != exceptId && a.EmployeeId == employeeId && a.ProjectId == projectId);

    private static Assignment Copy(Assignment a) => new()
    {
        Id = a.Id,
        EmployeeId = a.EmployeeId,
        ProjectId = a.ProjectId,
        Role = a.Role,
        AllocationPercent = a.AllocationPercent,
        StartDate = a.StartDate,
        EndDate = a.EndDate,
        CreatedAt = a.CreatedAt,
        UpdatedAt = a.UpdatedAt,
    };
}
