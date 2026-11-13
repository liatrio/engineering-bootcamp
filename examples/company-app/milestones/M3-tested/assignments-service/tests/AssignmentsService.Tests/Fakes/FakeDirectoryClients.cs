using AssignmentsService.Infrastructure.Clients;
using AssignmentsService.Infrastructure.Errors;

namespace AssignmentsService.Tests.Fakes;

/// <summary>
/// Stands in for another service's API: it knows a set of IDs, and can be
/// switched to "down" to simulate the service being unreachable.
/// </summary>
public abstract class FakeDirectory(string service, IEnumerable<Guid> known)
{
    private readonly HashSet<Guid> _known = [.. known];

    public bool IsDown { get; set; }

    public void Add(Guid id) => _known.Add(id);

    public Task<bool> ExistsAsync(Guid id, CancellationToken ct) =>
        IsDown
            ? throw new DependencyUnavailableException(service)
            : Task.FromResult(_known.Contains(id));
}

public sealed class FakeEmployeesClient()
    : FakeDirectory("employees-service", [TestData.Ada, TestData.Grace]), IEmployeesClient;

public sealed class FakeProjectsClient()
    : FakeDirectory("projects-service", [TestData.Platform, TestData.Portal, TestData.Warehouse]), IProjectsClient;
