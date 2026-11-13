using AssignmentsService.Infrastructure.Data;
using AssignmentsService.Infrastructure.Errors;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace AssignmentsService.Features.Assignments;

/// <summary>The real IAssignmentStore: EF Core over PostgreSQL.</summary>
public sealed class AssignmentStore(AssignmentsDbContext db) : IAssignmentStore
{
    public async Task<IReadOnlyList<Assignment>> ListAsync(Guid? employeeId, Guid? projectId, CancellationToken ct)
    {
        var query = db.Assignments.AsNoTracking();
        if (employeeId is not null)
        {
            query = query.Where(a => a.EmployeeId == employeeId);
        }
        if (projectId is not null)
        {
            query = query.Where(a => a.ProjectId == projectId);
        }
        return await query.OrderBy(a => a.StartDate).ThenBy(a => a.Id).ToListAsync(ct);
    }

    // Tracked on purpose: UpdateAsync saves whatever the service changed on it.
    public Task<Assignment?> FindAsync(Guid id, CancellationToken ct) =>
        db.Assignments.FirstOrDefaultAsync(a => a.Id == id, ct);

    public Task<bool> PairExistsAsync(Guid employeeId, Guid projectId, Guid? exceptId, CancellationToken ct) =>
        db.Assignments.AnyAsync(a => a.EmployeeId == employeeId && a.ProjectId == projectId && a.Id != exceptId, ct);

    public async Task AddAsync(Assignment assignment, CancellationToken ct)
    {
        db.Assignments.Add(assignment);
        await SaveAsync(ct);
    }

    public Task UpdateAsync(Assignment assignment, CancellationToken ct) => SaveAsync(ct);

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct) =>
        await db.Assignments.Where(a => a.Id == id).ExecuteDeleteAsync(ct) > 0;

    public Task<int> DeleteForEmployeeAsync(Guid employeeId, CancellationToken ct) =>
        db.Assignments.Where(a => a.EmployeeId == employeeId).ExecuteDeleteAsync(ct);

    private async Task SaveAsync(CancellationToken ct)
    {
        try
        {
            await db.SaveChangesAsync(ct);
        }
        catch (DbUpdateException ex) when (ex.InnerException is PostgresException { SqlState: PostgresErrorCodes.UniqueViolation })
        {
            // AssignmentService checks first, but two requests can pass that
            // check at the same moment. The unique index is the real guarantee.
            throw new ConflictException("That employee is already assigned to that project.");
        }
    }
}
