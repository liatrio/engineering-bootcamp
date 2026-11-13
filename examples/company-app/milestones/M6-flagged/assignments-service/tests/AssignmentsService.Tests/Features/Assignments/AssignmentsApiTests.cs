using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using AssignmentsService.Features.Assignments;
using Microsoft.AspNetCore.Mvc;

namespace AssignmentsService.Tests.Features.Assignments;

/// <summary>
/// Component tests: real HTTP through the whole pipeline (routing, validation,
/// error handling, auth) with every edge faked.
/// </summary>
/// <remarks>
/// No IClassFixture: each test builds its own ComponentTestApp, so each starts
/// from an empty store. Booting the in-memory app takes milliseconds, which is
/// a small price for tests that can run in any order.
/// </remarks>
public sealed class AssignmentsApiTests : IAsyncDisposable
{
    private readonly ComponentTestApp _app = new();
    private readonly HttpClient _client;

    public AssignmentsApiTests() => _client = _app.CreateClient();

    public ValueTask DisposeAsync() => _app.DisposeAsync();

    private static CancellationToken Ct => TestContext.Current.CancellationToken;

    private static object Body(Guid? employeeId = null, Guid? projectId = null, int allocation = 50) => new
    {
        employeeId = employeeId ?? TestData.Ada,
        projectId = projectId ?? TestData.Platform,
        role = "Developer",
        allocationPercent = allocation,
        startDate = "2026-03-01",
        endDate = (string?)null,
    };

    [Fact]
    public async Task Post_returns_201_with_location_and_the_assignment()
    {
        var response = await _client.PostAsJsonAsync("/api/assignments", Body(), Ct);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var created = await response.Content.ReadFromJsonAsync<AssignmentResponse>(Ct);
        Assert.EndsWith($"/api/assignments/{created!.Id}", response.Headers.Location?.ToString());
        Assert.Equal(new DateOnly(2026, 3, 1), created.StartDate);
    }

    [Fact]
    public async Task Dates_are_plain_yyyy_mm_dd_strings_in_json()
    {
        var response = await _client.PostAsJsonAsync("/api/assignments", Body(), Ct);

        var json = await response.Content.ReadAsStringAsync(Ct);
        Assert.Contains("\"startDate\":\"2026-03-01\"", json);
        Assert.Contains("\"endDate\":null", json);
    }

    [Fact]
    public async Task Posting_the_same_employee_and_project_twice_returns_409()
    {
        await _client.PostAsJsonAsync("/api/assignments", Body(allocation: 10), Ct);

        var second = await _client.PostAsJsonAsync("/api/assignments", Body(allocation: 10), Ct);

        Assert.Equal(HttpStatusCode.Conflict, second.StatusCode);
    }

    [Fact]
    public async Task An_unknown_employee_returns_400_with_an_employeeId_error()
    {
        var response = await _client.PostAsJsonAsync("/api/assignments", Body(employeeId: Guid.NewGuid()), Ct);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var problem = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>(Ct);
        Assert.Equal(["employeeId"], problem!.Errors.Keys);
    }

    [Fact]
    public async Task A_dependency_that_is_down_returns_503_problem_details()
    {
        _app.Projects.IsDown = true;

        var response = await _client.PostAsJsonAsync("/api/assignments", Body(), Ct);

        Assert.Equal(HttpStatusCode.ServiceUnavailable, response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);
        var problem = await response.Content.ReadFromJsonAsync<ProblemDetails>(Ct);
        Assert.Contains("projects-service", problem!.Detail);
    }

    [Fact]
    public async Task An_invalid_body_returns_400_with_camelCase_field_errors()
    {
        var response = await _client.PostAsJsonAsync("/api/assignments",
            new { role = "", allocationPercent = 0 }, Ct);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var problem = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>(Ct);
        Assert.Superset(new HashSet<string> { "employeeId", "projectId", "role", "allocationPercent", "startDate" },
            problem!.Errors.Keys.ToHashSet());
    }

    [Fact]
    public async Task List_filters_by_employee()
    {
        await _client.PostAsJsonAsync("/api/assignments", Body(TestData.Ada, TestData.Platform), Ct);
        await _client.PostAsJsonAsync("/api/assignments", Body(TestData.Grace, TestData.Platform), Ct);

        var ada = await _client.GetFromJsonAsync<List<AssignmentResponse>>($"/api/assignments?employeeId={TestData.Ada}", Ct);

        Assert.Equal(TestData.Ada, Assert.Single(ada!).EmployeeId);
    }

    [Fact]
    public async Task Get_of_an_unknown_id_returns_404()
    {
        var response = await _client.GetAsync($"/api/assignments/{Guid.NewGuid()}", Ct);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Put_replaces_the_assignment()
    {
        var created = await (await _client.PostAsJsonAsync("/api/assignments", Body(), Ct))
            .Content.ReadFromJsonAsync<AssignmentResponse>(Ct);

        var response = await _client.PutAsJsonAsync($"/api/assignments/{created!.Id}", Body(allocation: 25), Ct);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal(25, (await response.Content.ReadFromJsonAsync<AssignmentResponse>(Ct))!.AllocationPercent);
    }

    [Fact]
    public async Task Delete_returns_204_then_404()
    {
        var created = await (await _client.PostAsJsonAsync("/api/assignments", Body(), Ct))
            .Content.ReadFromJsonAsync<AssignmentResponse>(Ct);

        var first = await _client.DeleteAsync($"/api/assignments/{created!.Id}", Ct);
        var second = await _client.DeleteAsync($"/api/assignments/{created.Id}", Ct);

        Assert.Equal(HttpStatusCode.NoContent, first.StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, second.StatusCode);
    }

    [Fact]
    public async Task With_the_writes_kill_switch_off_changes_return_503_but_reads_work()
    {
        await _app.Flags.SetAsync(AssignmentFlags.Writes, on: false);

        var post = await _client.PostAsJsonAsync("/api/assignments", Body(), Ct);
        var get = await _client.GetAsync("/api/assignments", Ct);

        Assert.Equal(HttpStatusCode.ServiceUnavailable, post.StatusCode);
        Assert.Equal(HttpStatusCode.OK, get.StatusCode);
    }

    [Fact]
    public async Task The_X_User_Id_header_is_the_targeting_key_for_the_allocation_rollout()
    {
        using var request = new HttpRequestMessage(HttpMethod.Post, "/api/assignments") { Content = JsonContent.Create(Body()) };
        request.Headers.Add("X-User-Id", "manager-42");

        await _client.SendAsync(request, Ct);

        Assert.Equal("manager-42", _app.Flags.LastTargetingKey);
    }

    [Fact]
    public async Task With_AUTH_TOKEN_set_api_requests_need_the_bearer_token()
    {
        await using var secured = _app.WithWebHostBuilder(b => b.UseSetting("AUTH_TOKEN", "s3cret"));
        var client = secured.CreateClient();

        var anonymous = await client.GetAsync("/api/assignments", Ct);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "s3cret");
        var authorized = await client.GetAsync("/api/assignments", Ct);

        Assert.Equal(HttpStatusCode.Unauthorized, anonymous.StatusCode);
        Assert.Equal(HttpStatusCode.OK, authorized.StatusCode);
    }
}
