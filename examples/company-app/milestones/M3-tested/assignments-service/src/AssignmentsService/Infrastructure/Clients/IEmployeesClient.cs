namespace AssignmentsService.Infrastructure.Clients;

/// <summary>What this service needs to know from employees-service: nothing more.</summary>
public interface IEmployeesClient
{
    /// <summary>
    /// True if the employee exists, false if employees-service says 404.
    /// Throws DependencyUnavailableException if it can't tell.
    /// </summary>
    Task<bool> ExistsAsync(Guid id, CancellationToken ct);
}

public sealed class EmployeesClient(HttpClient http) : IEmployeesClient
{
    public Task<bool> ExistsAsync(Guid id, CancellationToken ct) =>
        http.ResourceExistsAsync($"/api/employees/{id}", "employees-service", ct);
}
