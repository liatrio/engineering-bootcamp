using EmployeesService.Infrastructure.Data;
using EmployeesService.Infrastructure.Errors;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace EmployeesService.Features.Employees;

/// <summary>The real IEmployeeStore: EF Core over PostgreSQL.</summary>
public sealed class EmployeeStore(EmployeesDbContext db) : IEmployeeStore
{
    public async Task<IReadOnlyList<Employee>> ListAsync(string? department, CancellationToken ct)
    {
        var query = db.Employees.AsNoTracking();
        if (!string.IsNullOrWhiteSpace(department))
        {
            query = query.Where(e => e.Department == department);
        }
        return await query.OrderBy(e => e.Name).ThenBy(e => e.Id).ToListAsync(ct);
    }

    // Tracked on purpose: UpdateAsync saves whatever the service changed on it.
    public Task<Employee?> FindAsync(Guid id, CancellationToken ct) =>
        db.Employees.FirstOrDefaultAsync(e => e.Id == id, ct);

    public Task<bool> EmailInUseAsync(string email, Guid? exceptId, CancellationToken ct)
    {
        var normalized = email.ToLowerInvariant();
        return db.Employees.AnyAsync(e =>
            EF.Property<string>(e, EmployeeConfiguration.NormalizedEmail) == normalized
            && e.Id != exceptId, ct);
    }

    public async Task AddAsync(Employee employee, CancellationToken ct)
    {
        db.Employees.Add(employee);
        await SaveAsync(ct);
    }

    public Task UpdateAsync(Employee employee, CancellationToken ct) => SaveAsync(ct);

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct) =>
        await db.Employees.Where(e => e.Id == id).ExecuteDeleteAsync(ct) > 0;

    public async Task ResetAsync(IEnumerable<Employee> employees, CancellationToken ct)
    {
        // One transaction, so a provider-state call never leaves the table half reset.
        await using var transaction = await db.Database.BeginTransactionAsync(ct);
        await db.Employees.ExecuteDeleteAsync(ct);
        db.Employees.AddRange(employees);
        await db.SaveChangesAsync(ct);
        await transaction.CommitAsync(ct);
    }

    private async Task SaveAsync(CancellationToken ct)
    {
        try
        {
            await db.SaveChangesAsync(ct);
        }
        catch (DbUpdateException ex) when (ex.InnerException is PostgresException { SqlState: PostgresErrorCodes.UniqueViolation })
        {
            // EmployeeService checks for a duplicate email first, but two requests
            // can pass that check at the same moment. The unique index is the
            // real guarantee; this turns its error into the same 409.
            throw new ConflictException("An employee with that email already exists.");
        }
    }
}
