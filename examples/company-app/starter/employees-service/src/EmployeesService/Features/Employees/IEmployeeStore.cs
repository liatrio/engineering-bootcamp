namespace EmployeesService.Features.Employees;

/// <summary>
/// Persistence for employees: the only thing EmployeeService knows about storage.
/// </summary>
/// <remarks>
/// app-dev-forge usually has services query the DbContext directly, and that is
/// the right default. This service adds one small seam because the bootcamp's
/// component tests (Chapter 3.4.4) run the whole HTTP stack against an
/// in-memory fake instead of PostgreSQL. A fake behind an interface we own is
/// more honest than EF Core's in-memory provider, which silently ignores
/// things a real database enforces (like our unique email index).
///
/// Keep it this thin: methods named after what the service needs, no generic
/// <c>IRepository&lt;T&gt;</c>, no query builders.
/// </remarks>
public interface IEmployeeStore
{
    /// <summary>All employees ordered by name, optionally only one department (exact match).</summary>
    Task<IReadOnlyList<Employee>> ListAsync(string? department, CancellationToken ct);

    Task<Employee?> FindAsync(Guid id, CancellationToken ct);

    /// <summary>True when another employee already uses this email, ignoring case.</summary>
    Task<bool> EmailInUseAsync(string email, Guid? exceptId, CancellationToken ct);

    /// <summary>Saves a new employee. Throws ConflictException if the email is taken.</summary>
    Task AddAsync(Employee employee, CancellationToken ct);

    /// <summary>Saves changes to an employee returned by FindAsync. Throws ConflictException if the email is taken.</summary>
    Task UpdateAsync(Employee employee, CancellationToken ct);

    /// <summary>Deletes by ID. Returns false when there was nothing to delete.</summary>
    Task<bool> DeleteAsync(Guid id, CancellationToken ct);

    /// <summary>Replaces every row with the given employees. Used by Pact provider states.</summary>
    Task ResetAsync(IEnumerable<Employee> employees, CancellationToken ct);
}
