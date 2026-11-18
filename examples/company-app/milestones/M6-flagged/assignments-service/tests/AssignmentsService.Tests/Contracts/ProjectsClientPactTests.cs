using System.Net;
using AssignmentsService.Infrastructure.Clients;

namespace AssignmentsService.Tests.Contracts;

/// <summary>
/// Consumer contract: what assignments-service needs from projects-service.
/// Each test runs our real ProjectsClient against a Pact mock server and
/// records the interaction in pacts/assignments-service-projects-service.json.
/// projects-service then replays that file against itself (provider verification).
/// </summary>
/// <remarks>
/// Ask only for what the client uses. It reads the status code and nothing
/// else, so the contract pins the status and the id, and leaves the provider
/// free to change every other field.
/// </remarks>
public sealed class ProjectsClientPactTests
{
    private static readonly Guid Missing = Guid.Parse("99999999-9999-4999-8999-999999999999");

    [Fact]
    public async Task An_existing_project_is_reported_as_existing()
    {
        var pact = PactSetup.For("projects-service");
        pact.UponReceiving("a request for a project that exists")
                .Given("projects exist")
                .WithRequest(HttpMethod.Get, $"/api/projects/{TestData.Platform}")
            .WillRespond()
                .WithStatus(HttpStatusCode.OK)
                .WithJsonBody(new { id = TestData.Platform.ToString() });

        await pact.VerifyAsync(async ctx =>
        {
            var client = new ProjectsClient(new HttpClient { BaseAddress = ctx.MockServerUri });
            Assert.True(await client.ExistsAsync(TestData.Platform, TestContext.Current.CancellationToken));
        });
    }

    [Fact]
    public async Task A_missing_project_is_reported_as_missing()
    {
        var pact = PactSetup.For("projects-service");
        pact.UponReceiving("a request for a project that does not exist")
                .Given("no project with id {id} exists", new Dictionary<string, string> { ["id"] = Missing.ToString() })
                .WithRequest(HttpMethod.Get, $"/api/projects/{Missing}")
            .WillRespond()
                .WithStatus(HttpStatusCode.NotFound);

        await pact.VerifyAsync(async ctx =>
        {
            var client = new ProjectsClient(new HttpClient { BaseAddress = ctx.MockServerUri });
            Assert.False(await client.ExistsAsync(Missing, TestContext.Current.CancellationToken));
        });
    }
}
