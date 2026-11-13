using System.Net;
using System.Net.Http.Json;
using AssignmentsService.Features.Assignments;
using AssignmentsService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;

namespace AssignmentsService.Tests.Features.Assignments;

/// <summary>
/// Integration tests: EF Core and a real PostgreSQL. They catch what fakes
/// can't (mapping, migrations, constraints, SQL translation) and need Docker:
/// dotnet test --filter-not-trait "Category=Integration" skips them.
/// </summary>
/// <remarks>
/// The database is shared by the tests in this class, so each test uses its
/// own employee ID and never depends on rows another test created.
/// </remarks>
[Trait("Category", "Integration")]
public sealed class AssignmentsDatabaseTests(PostgresTestApp app) : IClassFixture<PostgresTestApp>
{
    private readonly HttpClient _client = app.CreateClient();

    private static CancellationToken Ct => TestContext.Current.CancellationToken;

    private Guid NewEmployee()
    {
        var id = Guid.NewGuid();
        app.Employees.Add(id);
        return id;
    }

    private static object Body(Guid employeeId, Guid projectId, int allocation = 50, string? end = null) => new
    {
        employeeId,
        projectId,
        role = "Developer",
        allocationPercent = allocation,
        startDate = "2026-03-01",
        endDate = end,
    };

    [Fact]
    public async Task Startup_applies_every_migration()
    {
        await using var scope = app.Services.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<AssignmentsDbContext>();

        Assert.Empty(await db.Database.GetPendingMigrationsAsync(Ct));
    }

    [Fact]
    public async Task An_assignment_can_be_created_read_updated_and_deleted()
    {
        var employee = NewEmployee();
        var create = await _client.PostAsJsonAsync("/api/assignments", Body(employee, TestData.Platform, end: "2026-12-31"), Ct);
        Assert.Equal(HttpStatusCode.Created, create.StatusCode);
        var created = (await create.Content.ReadFromJsonAsync<AssignmentResponse>(Ct))!;

        var read = await _client.GetFromJsonAsync<AssignmentResponse>($"/api/assignments/{created.Id}", Ct);
        Assert.Equal(new DateOnly(2026, 12, 31), read!.EndDate);   // DateOnly round-trips through a "date" column

        var update = await _client.PutAsJsonAsync($"/api/assignments/{created.Id}", Body(employee, TestData.Portal, 30), Ct);
        Assert.Equal(HttpStatusCode.OK, update.StatusCode);
        var byProject = await _client.GetFromJsonAsync<List<AssignmentResponse>>(
            $"/api/assignments?employeeId={employee}&projectId={TestData.Portal}", Ct);
        Assert.Equal(30, Assert.Single(byProject!).AllocationPercent);

        Assert.Equal(HttpStatusCode.NoContent, (await _client.DeleteAsync($"/api/assignments/{created.Id}", Ct)).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await _client.GetAsync($"/api/assignments/{created.Id}", Ct)).StatusCode);
    }

    [Fact]
    public async Task The_database_rejects_a_second_row_for_the_same_employee_and_project()
    {
        // Straight to the DbContext, past the service's own check: this proves
        // the unique index is there for the race the service can't see.
        var employee = NewEmployee();
        await using var scope = app.Services.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<AssignmentsDbContext>();
        db.Assignments.AddRange(Row(employee), Row(employee));

        var ex = await Assert.ThrowsAsync<DbUpdateException>(() => db.SaveChangesAsync(Ct));

        Assert.Equal(PostgresErrorCodes.UniqueViolation, Assert.IsType<PostgresException>(ex.InnerException).SqlState);
    }

    [Fact]
    public async Task Removing_an_employees_assignments_deletes_only_theirs()
    {
        var leaving = NewEmployee();
        var staying = NewEmployee();
        await _client.PostAsJsonAsync("/api/assignments", Body(leaving, TestData.Platform), Ct);
        await _client.PostAsJsonAsync("/api/assignments", Body(leaving, TestData.Portal), Ct);
        await _client.PostAsJsonAsync("/api/assignments", Body(staying, TestData.Platform), Ct);

        await using var scope = app.Services.CreateAsyncScope();
        var removed = await scope.ServiceProvider.GetRequiredService<IAssignmentService>().RemoveForEmployeeAsync(leaving, Ct);

        Assert.Equal(2, removed);
        var left = await _client.GetFromJsonAsync<List<AssignmentResponse>>($"/api/assignments?employeeId={staying}", Ct);
        Assert.Single(left!);
    }

    private static Assignment Row(Guid employeeId) => new()
    {
        Id = Guid.NewGuid(),
        EmployeeId = employeeId,
        ProjectId = TestData.Platform,
        Role = "Developer",
        AllocationPercent = 10,
        StartDate = new DateOnly(2026, 3, 1),
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow,
    };
}
