using System.Text.Json;
using System.Text.RegularExpressions;
using EmployeesService.Infrastructure.Configuration;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace EmployeesService.Features.Employees;

/// <summary>
/// Test support for Pact provider verification (Chapter 3.4.6). The Pact
/// verifier calls this before each interaction to put the service into the
/// state the consumer's contract assumes. Off unless ENABLE_PROVIDER_STATES=true,
/// because an endpoint that wipes the table must never be reachable in production.
/// </summary>
[ApiController]
[Route("_pact/provider-states")]
[ApiExplorerSettings(IgnoreApi = true)]   // test plumbing, not part of the public API
public sealed partial class ProviderStatesController(IEmployeeStore store, IOptions<ServiceOptions> options) : ControllerBase
{
    public sealed record ProviderStateRequest(string State, Dictionary<string, JsonElement>? Params, string? Action);

    [HttpPost]
    public async Task<IActionResult> Post(ProviderStateRequest request, CancellationToken ct)
    {
        if (!options.Value.EnableProviderStates)
        {
            return NotFound();
        }

        // Teardown has nothing to undo: every setup starts from a clean reset.
        if (string.Equals(request.Action, "teardown", StringComparison.OrdinalIgnoreCase))
        {
            return Ok();
        }

        var rows = EmployeeSeed.Create().ToList();

        if (request.State == "employees exist")
        {
            // Seed data only.
        }
        else if (NoEmployeeWithId().Match(request.State) is { Success: true } match)
        {
            // The ID can arrive as a parameter or inside the state text itself.
            var raw = request.Params?.TryGetValue("id", out var id) == true ? id.ToString() : match.Groups["id"].Value;
            if (!Guid.TryParse(raw, out var absentId))
            {
                return Problem(statusCode: StatusCodes.Status400BadRequest, detail: $"'{raw}' is not a GUID.");
            }
            rows.RemoveAll(e => e.Id == absentId);
        }
        else
        {
            return Problem(statusCode: StatusCodes.Status400BadRequest, detail: $"Unknown provider state '{request.State}'.");
        }

        await store.ResetAsync(rows, ct);
        return Ok();
    }

    [GeneratedRegex(@"^no employee with id (?<id>\S+) exists$")]
    private static partial Regex NoEmployeeWithId();
}
