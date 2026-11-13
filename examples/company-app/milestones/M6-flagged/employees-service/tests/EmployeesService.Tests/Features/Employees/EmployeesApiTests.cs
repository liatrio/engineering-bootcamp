using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using EmployeesService.Features.Employees;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Testing;

namespace EmployeesService.Tests.Features.Employees;

/// <summary>
/// Component tests: real HTTP requests through the whole ASP.NET Core pipeline,
/// with the persistence and messaging edges faked (see ComponentTestApp).
/// </summary>
/// <remarks>
/// No IClassFixture: xUnit creates this class once per test, so each test gets
/// its own app and its own freshly seeded store, and can run in any order.
/// </remarks>
public sealed class EmployeesApiTests : IAsyncDisposable
{
    private readonly ComponentTestApp _app = new();
    private readonly HttpClient _client;

    public EmployeesApiTests() => _client = _app.CreateClient();

    public ValueTask DisposeAsync() => _app.DisposeAsync();

    private static CancellationToken Ct => TestContext.Current.CancellationToken;

    private static object NewEmployee(string email) => new
    {
        name = "Katherine Johnson",
        email,
        title = "Mathematician",
        department = "Engineering",
    };

    [Fact]
    public async Task Get_returns_a_seeded_employee_as_camelCase_json()
    {
        var response = await _client.GetAsync($"/api/employees/{EmployeeSeed.AdaId}", Ct);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        using var json = JsonDocument.Parse(await response.Content.ReadAsStringAsync(Ct));
        Assert.Equal("Ada Lovelace", json.RootElement.GetProperty("name").GetString());
        Assert.Equal("ada@example.com", json.RootElement.GetProperty("email").GetString());
        Assert.True(json.RootElement.TryGetProperty("createdAt", out _));
    }

    [Fact]
    public async Task Get_of_an_unknown_id_returns_404_problem_details()
    {
        var response = await _client.GetAsync($"/api/employees/{Guid.NewGuid()}", Ct);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);
        var problem = await response.Content.ReadFromJsonAsync<ProblemDetails>(Ct);
        Assert.Equal(404, problem!.Status);
    }

    [Fact]
    public async Task List_filters_by_department()
    {
        var engineering = await _client.GetFromJsonAsync<List<EmployeeResponse>>("/api/employees?department=Engineering", Ct);

        Assert.All(engineering!, e => Assert.Equal("Engineering", e.Department));
        Assert.Contains(engineering!, e => e.Id == EmployeeSeed.AdaId);
    }

    [Fact]
    public async Task Create_returns_201_with_a_location_header_and_the_employee()
    {
        var response = await _client.PostAsJsonAsync("/api/employees", NewEmployee("katherine@example.com"), Ct);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var created = await response.Content.ReadFromJsonAsync<EmployeeResponse>(Ct);
        Assert.EndsWith($"/api/employees/{created!.Id}", response.Headers.Location?.ToString());
        Assert.Contains(_app.Events.Published, e => e.Type == "employee.created");
    }

    [Fact]
    public async Task Create_with_an_invalid_body_returns_400_with_field_errors()
    {
        var response = await _client.PostAsJsonAsync("/api/employees",
            new { name = "", email = "not-an-email", title = "Engineer", department = "Engineering" }, Ct);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var problem = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>(Ct);
        Assert.Contains("name", problem!.Errors.Keys);
        Assert.Contains("email", problem.Errors.Keys);
    }

    [Fact]
    public async Task Create_with_a_duplicate_email_in_any_case_returns_409()
    {
        var response = await _client.PostAsJsonAsync("/api/employees", NewEmployee("ADA@example.com"), Ct);

        Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
    }

    [Fact]
    public async Task Update_returns_200_with_the_new_values()
    {
        var response = await _client.PutAsJsonAsync($"/api/employees/{EmployeeSeed.GraceId}", new
        {
            name = "Grace Hopper",
            email = "grace@example.com",
            title = "Rear Admiral",
            department = "Engineering",
        }, Ct);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var updated = await response.Content.ReadFromJsonAsync<EmployeeResponse>(Ct);
        Assert.Equal("Rear Admiral", updated!.Title);
    }

    [Fact]
    public async Task Delete_returns_204_and_the_employee_is_gone()
    {
        var response = await _client.DeleteAsync($"/api/employees/{EmployeeSeed.AlanId}", Ct);

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        var after = await _client.GetAsync($"/api/employees/{EmployeeSeed.AlanId}", Ct);
        Assert.Equal(HttpStatusCode.NotFound, after.StatusCode);
    }

    [Fact]
    public async Task Delete_of_an_unknown_id_returns_404_problem_details()
    {
        var response = await _client.DeleteAsync($"/api/employees/{Guid.NewGuid()}", Ct);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);
        Assert.Empty(_app.Events.Published);
    }

    [Fact]
    public async Task Healthz_returns_ok_without_auth()
    {
        var response = await _client.GetStringAsync("/healthz", Ct);

        Assert.Equal("""{"status":"ok"}""", response);
    }

    [Fact]
    public async Task With_AUTH_TOKEN_set_api_requests_need_the_bearer_token()
    {
        await using var securedApp = _app.WithWebHostBuilder(b => b.UseSetting("AUTH_TOKEN", "s3cret"));
        var client = securedApp.CreateClient();

        var anonymous = await client.GetAsync("/api/employees", Ct);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "s3cret");
        var authorized = await client.GetAsync("/api/employees", Ct);

        Assert.Equal(HttpStatusCode.Unauthorized, anonymous.StatusCode);
        Assert.Equal(HttpStatusCode.OK, authorized.StatusCode);
    }
}
