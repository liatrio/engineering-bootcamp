namespace AssignmentsService.Infrastructure.Clients;

/// <summary>What this service needs to know from projects-service.</summary>
public interface IProjectsClient
{
    /// <summary>
    /// True if the project exists, false if projects-service says 404.
    /// Throws DependencyUnavailableException if it can't tell.
    /// </summary>
    Task<bool> ExistsAsync(Guid id, CancellationToken ct);
}

public sealed class ProjectsClient(HttpClient http) : IProjectsClient
{
    public Task<bool> ExistsAsync(Guid id, CancellationToken ct) =>
        http.ResourceExistsAsync($"/api/projects/{id}", "projects-service", ct);
}
