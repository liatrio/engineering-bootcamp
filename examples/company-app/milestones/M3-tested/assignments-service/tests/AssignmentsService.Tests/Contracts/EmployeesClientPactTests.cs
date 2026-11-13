using System.Net;
using AssignmentsService.Infrastructure.Clients;

namespace AssignmentsService.Tests.Contracts;

/// <summary>
/// Consumer contract: what assignments-service needs from employees-service.
/// Each test runs our real EmployeesClient against a Pact mock server and
/// records the interaction in pacts/assignments-service-employees-service.json.
/// employees-service then replays that file against itself (provider verification).
/// </summary>
/// <remarks>
/// Ask only for what the client uses. It reads the status code and nothing
/// else, so the contract pins the status and the id, and leaves the provider
/// free to change every other field.
/// </remarks>
public sealed class EmployeesClientPactTests
{
    private static readonly Guid Missing = Guid.Parse("99999999-9999-4999-8999-999999999999");

    [Fact]
    public async Task An_existing_employee_is_reported_as_existing()
    {
        var pact = PactSetup.For("employees-service");
        pact.UponReceiving("a request for an employee that exists")
                .Given("employees exist")
                .WithRequest(HttpMethod.Get, $"/api/employees/{TestData.Ada}")
            .WillRespond()
                .WithStatus(HttpStatusCode.OK)
                .WithJsonBody(new { id = TestData.Ada.ToString() });

        await pact.VerifyAsync(async ctx =>
        {
            var client = new EmployeesClient(new HttpClient { BaseAddress = ctx.MockServerUri });
            Assert.True(await client.ExistsAsync(TestData.Ada, TestContext.Current.CancellationToken));
        });
    }

    [Fact]
    public async Task A_missing_employee_is_reported_as_missing()
    {
        var pact = PactSetup.For("employees-service");
        pact.UponReceiving("a request for an employee that does not exist")
                .Given("no employee with id {id} exists", new Dictionary<string, string> { ["id"] = Missing.ToString() })
                .WithRequest(HttpMethod.Get, $"/api/employees/{Missing}")
            .WillRespond()
                .WithStatus(HttpStatusCode.NotFound);

        await pact.VerifyAsync(async ctx =>
        {
            var client = new EmployeesClient(new HttpClient { BaseAddress = ctx.MockServerUri });
            Assert.False(await client.ExistsAsync(Missing, TestContext.Current.CancellationToken));
        });
    }
}
