using System.Net;
using AssignmentsService.Infrastructure.Clients;
using AssignmentsService.Infrastructure.Configuration;
using AssignmentsService.Infrastructure.Errors;
using Microsoft.Extensions.Options;

namespace AssignmentsService.Tests.Infrastructure;

/// <summary>
/// Unit tests for how the typed clients read another service's answer. A stub
/// HttpMessageHandler plays the other service, so no network is involved.
/// </summary>
public sealed class DependencyClientTests
{
    private static CancellationToken Ct => TestContext.Current.CancellationToken;

    private static EmployeesClient ClientReturning(Func<HttpRequestMessage, HttpResponseMessage> respond) =>
        new(new HttpClient(new StubHandler(respond)) { BaseAddress = new Uri("http://employees") });

    [Fact]
    public async Task Ok_means_the_employee_exists()
    {
        var client = ClientReturning(_ => new HttpResponseMessage(HttpStatusCode.OK));

        Assert.True(await client.ExistsAsync(TestData.Ada, Ct));
    }

    [Fact]
    public async Task Not_found_means_the_employee_does_not_exist()
    {
        var client = ClientReturning(_ => new HttpResponseMessage(HttpStatusCode.NotFound));

        Assert.False(await client.ExistsAsync(TestData.Ada, Ct));
    }

    [Theory]
    [InlineData(HttpStatusCode.InternalServerError)]
    [InlineData(HttpStatusCode.Unauthorized)]
    public async Task Any_other_status_means_we_cannot_tell(HttpStatusCode status)
    {
        var client = ClientReturning(_ => new HttpResponseMessage(status));

        var ex = await Assert.ThrowsAsync<DependencyUnavailableException>(() => client.ExistsAsync(TestData.Ada, Ct));
        Assert.Equal("employees-service", ex.Service);
    }

    [Fact]
    public async Task A_connection_failure_means_we_cannot_tell()
    {
        var client = ClientReturning(_ => throw new HttpRequestException("Connection refused"));

        await Assert.ThrowsAsync<DependencyUnavailableException>(() => client.ExistsAsync(TestData.Ada, Ct));
    }

    [Fact]
    public async Task The_projects_client_asks_projects_service()
    {
        Uri? asked = null;
        var client = new ProjectsClient(new HttpClient(new StubHandler(r =>
        {
            asked = r.RequestUri;
            return new HttpResponseMessage(HttpStatusCode.OK);
        }))
        { BaseAddress = new Uri("http://projects") });

        await client.ExistsAsync(TestData.Platform, Ct);

        Assert.Equal($"http://projects/api/projects/{TestData.Platform}", asked?.ToString());
    }

    [Theory]
    [InlineData("s3cret", "Bearer s3cret")]
    [InlineData(null, null)]
    public async Task The_auth_token_is_forwarded_only_when_configured(string? token, string? expectedHeader)
    {
        string? sent = null;
        var handler = new ForwardAuthTokenHandler(Options.Create(new ServiceOptions { AuthToken = token }))
        {
            InnerHandler = new StubHandler(r =>
            {
                sent = r.Headers.Authorization?.ToString();
                return new HttpResponseMessage(HttpStatusCode.OK);
            }),
        };

        using var http = new HttpClient(handler);
        await http.GetAsync(new Uri("http://employees/api/employees"), Ct);

        Assert.Equal(expectedHeader, sent);
    }

    private sealed class StubHandler(Func<HttpRequestMessage, HttpResponseMessage> respond) : HttpMessageHandler
    {
        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken) =>
            Task.FromResult(respond(request));
    }
}
