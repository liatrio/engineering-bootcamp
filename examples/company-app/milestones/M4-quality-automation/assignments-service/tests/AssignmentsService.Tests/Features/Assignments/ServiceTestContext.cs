using AssignmentsService.Features.Assignments;
using AssignmentsService.Tests.Fakes;
using Microsoft.Extensions.Time.Testing;

namespace AssignmentsService.Tests.Features.Assignments;

/// <summary>
/// An AssignmentService wired to fresh fakes. Each test class creates its own,
/// and xUnit creates a new test class instance per test, so no state is shared.
/// </summary>
public abstract class ServiceTestContext
{
    protected InMemoryAssignmentStore Store { get; } = new();
    protected FakeEmployeesClient Employees { get; } = new();
    protected FakeProjectsClient Projects { get; } = new();
    protected FakeEventPublisher Events { get; } = new();
    protected FakeTimeProvider Clock { get; } = new(TestData.Now);
    protected AssignmentService Service { get; }

    protected ServiceTestContext() => Service = new AssignmentService(Store, Employees, Projects, Events, Clock);

    protected static CancellationToken Ct => TestContext.Current.CancellationToken;

    protected static AssignmentRequest Request(
        Guid? employeeId = null,
        Guid? projectId = null,
        int allocation = 50,
        string start = "2026-03-01",
        string? end = null) => new()
        {
            EmployeeId = employeeId ?? TestData.Ada,
            ProjectId = projectId ?? TestData.Platform,
            Role = "Developer",
            AllocationPercent = allocation,
            StartDate = DateOnly.Parse(start),
            EndDate = end is null ? null : DateOnly.Parse(end),
        };
}
