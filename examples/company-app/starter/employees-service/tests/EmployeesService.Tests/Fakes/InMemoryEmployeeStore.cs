using EmployeesService.Features.Employees;
using EmployeesService.Infrastructure.Errors;

namespace EmployeesService.Tests.Fakes;

/// <summary>
/// A dictionary-backed IEmployeeStore that behaves like the database where it
/// matters to the service: unique emails ignoring case, name ordering, and
/// copies in and out (so changing an object doesn't change what is "stored"
/// until UpdateAsync, just as with a real database).
/// </summary>
public sealed class InMemoryEmployeeStore : IEmployeeStore
{
    private readonly Dictionary<Guid, Employee> _rows = [];
    private readonly Lock _lock = new();

    public InMemoryEmployeeStore(IEnumerable<Employee>? employees = null)
    {
        foreach (var employee in employees ?? [])
        {
            _rows[employee.Id] = Copy(employee);
        }
    }

    public Task<IReadOnlyList<Employee>> ListAsync(string? department, CancellationToken ct)
    {
        lock (_lock)
        {
            IReadOnlyList<Employee> result = [.. _rows.Values
                .Where(e => string.IsNullOrWhiteSpace(department) || e.Department == department)
                .OrderBy(e => e.Name, StringComparer.Ordinal)
                .ThenBy(e => e.Id)
                .Select(Copy)];
            return Task.FromResult(result);
        }
    }

    public Task<Employee?> FindAsync(Guid id, CancellationToken ct)
    {
        lock (_lock)
        {
            return Task.FromResult(_rows.TryGetValue(id, out var e) ? Copy(e) : null);
        }
    }

    public Task<bool> EmailInUseAsync(string email, Guid? exceptId, CancellationToken ct)
    {
        lock (_lock)
        {
            return Task.FromResult(EmailTaken(email, exceptId));
        }
    }

    public Task AddAsync(Employee employee, CancellationToken ct) => SaveAsync(employee);

    public Task UpdateAsync(Employee employee, CancellationToken ct) => SaveAsync(employee);

    public Task<bool> DeleteAsync(Guid id, CancellationToken ct)
    {
        lock (_lock)
        {
            return Task.FromResult(_rows.Remove(id));
        }
    }

    public Task ResetAsync(IEnumerable<Employee> employees, CancellationToken ct)
    {
        lock (_lock)
        {
            _rows.Clear();
            foreach (var employee in employees)
            {
                _rows[employee.Id] = Copy(employee);
            }
        }
        return Task.CompletedTask;
    }

    private Task SaveAsync(Employee employee)
    {
        lock (_lock)
        {
            // Mirrors the unique index on the lower-cased email column.
            if (EmailTaken(employee.Email, employee.Id))
            {
                throw new ConflictException("An employee with that email already exists.");
            }
            _rows[employee.Id] = Copy(employee);
        }
        return Task.CompletedTask;
    }

    private bool EmailTaken(string email, Guid? exceptId) =>
        _rows.Values.Any(e => e.Id != exceptId && string.Equals(e.Email, email, StringComparison.OrdinalIgnoreCase));

    private static Employee Copy(Employee e) => new()
    {
        Id = e.Id,
        Name = e.Name,
        Email = e.Email,
        Title = e.Title,
        Department = e.Department,
        CreatedAt = e.CreatedAt,
        UpdatedAt = e.UpdatedAt,
    };
}
