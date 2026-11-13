using System.Net;
using System.Net.Http.Json;
using EmployeesService.Features.Employees;
using EmployeesService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;

namespace EmployeesService.Tests.Features.Employees;

/// <summary>
/// Integration tests: the HTTP API over EF Core and a real PostgreSQL. These
/// catch what fakes can't: mapping mistakes, migrations that don't apply, SQL
/// the provider can't translate. They need Docker, so they carry a trait you
/// can filter on: dotnet test --filter-not-trait "Category=Integration".
/// </summary>
[Trait("Category", "Integration")]
public sealed class EmployeesDatabaseTests(PostgresTestApp app) : IClassFixture<PostgresTestApp>
{
    private readonly HttpClient _client = app.CreateClient();

    private static CancellationToken Ct => TestContext.Current.CancellationToken;

    [Fact]
    public async Task Startup_applies_every_migration()
    {
        await using var scope = app.Services.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<EmployeesDbContext>();

        Assert.Empty(await db.Database.GetPendingMigrationsAsync(Ct));
        Assert.NotEmpty(await db.Database.GetAppliedMigrationsAsync(Ct));
    }

    [Fact]
    public async Task Startup_seeds_the_fixed_employees()
    {
        var employees = await _client.GetFromJsonAsync<List<EmployeeResponse>>("/api/employees", Ct);

        Assert.Subset(employees!.Select(e => e.Id).ToHashSet(), EmployeeSeed.Ids.ToHashSet());
    }

    [Fact]
    public async Task An_employee_can_be_created_read_updated_and_deleted()
    {
        // Create
        var create = await _client.PostAsJsonAsync("/api/employees", new
        {
            name = "Margaret Hamilton",
            email = "margaret@example.com",
            title = "Director of Software Engineering",
            department = "Engineering",
        }, Ct);
        Assert.Equal(HttpStatusCode.Created, create.StatusCode);
        var created = (await create.Content.ReadFromJsonAsync<EmployeeResponse>(Ct))!;

        // Read: what came back from PostgreSQL matches what was sent, timestamps included.
        var read = await _client.GetFromJsonAsync<EmployeeResponse>($"/api/employees/{created.Id}", Ct);
        Assert.Equal(created.Email, read!.Email);
        Assert.Equal(created.CreatedAt, read.CreatedAt, TimeSpan.FromMilliseconds(1));

        // Update
        var update = await _client.PutAsJsonAsync($"/api/employees/{created.Id}", new
        {
            name = "Margaret Hamilton",
            email = "margaret@example.com",
            title = "CEO",
            department = "Leadership",
        }, Ct);
        Assert.Equal(HttpStatusCode.OK, update.StatusCode);
        var leadership = await _client.GetFromJsonAsync<List<EmployeeResponse>>("/api/employees?department=Leadership", Ct);
        Assert.Equal("CEO", Assert.Single(leadership!).Title);

        // Delete
        var delete = await _client.DeleteAsync($"/api/employees/{created.Id}", Ct);
        Assert.Equal(HttpStatusCode.NoContent, delete.StatusCode);
        var gone = await _client.GetAsync($"/api/employees/{created.Id}", Ct);
        Assert.Equal(HttpStatusCode.NotFound, gone.StatusCode);
    }

    [Fact]
    public async Task The_database_rejects_an_email_that_differs_only_in_case()
    {
        // Straight to the DbContext, past EmployeeService's own check: this
        // proves the unique index on the lower-cased email exists, so the rule
        // holds even when two requests race past the service's check.
        await using var scope = app.Services.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<EmployeesDbContext>();
        db.Employees.AddRange(Row("Hedy@example.com"), Row("hedy@EXAMPLE.com"));

        var ex = await Assert.ThrowsAsync<DbUpdateException>(() => db.SaveChangesAsync(Ct));

        Assert.Equal(PostgresErrorCodes.UniqueViolation, Assert.IsType<PostgresException>(ex.InnerException).SqlState);
    }

    [Fact]
    public async Task The_api_returns_409_for_a_duplicate_email_in_another_case()
    {
        var first = await _client.PostAsJsonAsync("/api/employees", NewEmployee("Mary@example.com"), Ct);
        var second = await _client.PostAsJsonAsync("/api/employees", NewEmployee("mary@example.com"), Ct);

        Assert.Equal(HttpStatusCode.Created, first.StatusCode);
        Assert.Equal(HttpStatusCode.Conflict, second.StatusCode);
    }

    private static object NewEmployee(string email) => new
    {
        name = "Mary Jackson",
        email,
        title = "Engineer",
        department = "Engineering",
    };

    private static Employee Row(string email) => new()
    {
        Id = Guid.NewGuid(),
        Name = "Hedy Lamarr",
        Email = email,
        Title = "Inventor",
        Department = "Research",
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow,
    };
}
