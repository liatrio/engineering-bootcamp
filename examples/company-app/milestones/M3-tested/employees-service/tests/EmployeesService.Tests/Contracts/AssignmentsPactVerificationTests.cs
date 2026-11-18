using System.Net;
using System.Net.Sockets;
using Microsoft.AspNetCore.Hosting;
using PactNet;
using PactNet.Verifier;

namespace EmployeesService.Tests.Contracts;

/// <summary>
/// Provider verification: replays every interaction assignments-service
/// recorded in its pact file against this service, and fails if our answers
/// no longer match what that consumer depends on. Change a response shape here,
/// and this test tells you which consumer you'd break before you ship it.
/// </summary>
/// <remarks>
/// The Pact verifier is native code making real HTTP calls, so the app must
/// listen on a real port: WebApplicationFactory's UseKestrel does that. Storage
/// and messaging are the same fakes as the component tests; the contract is
/// about HTTP behaviour, not PostgreSQL. ENABLE_PROVIDER_STATES turns on
/// POST /_pact/provider-states, which the verifier calls to set up each
/// interaction's state ("employees exist", "no employee with id {id} exists").
/// </remarks>
public sealed class AssignmentsPactVerificationTests
{
    [Fact]
    public void Employees_service_honours_the_assignments_service_contract()
    {
        var port = FreePort();
        using var app = new ComponentTestApp();
        using var provider = app.WithWebHostBuilder(b => b
            .UseSetting("ENABLE_PROVIDER_STATES", "true")
            .UseSetting("PORT", port.ToString(System.Globalization.CultureInfo.InvariantCulture)));
        provider.UseKestrel();
        provider.StartServer();
        var baseUri = new Uri($"http://127.0.0.1:{port}");

        using var verifier = new PactVerifier("employees-service", new PactVerifierConfig { LogLevel = PactLogLevel.Warn });
        verifier
            .WithHttpEndpoint(baseUri)
            .WithFileSource(new FileInfo(PactFile("assignments-service-employees-service.json")))
            .WithProviderStateUrl(new Uri(baseUri, "/_pact/provider-states"))
            .Verify();
    }

    private static int FreePort()
    {
        using var listener = new TcpListener(IPAddress.Loopback, 0);
        listener.Start();
        return ((IPEndPoint)listener.LocalEndpoint).Port;
    }

    // The consumer commits its pacts in its own folder: ../assignments-service/pacts
    // from this service's root. Walk up from bin/ to find it.
    private static string PactFile(string name)
    {
        for (var dir = new DirectoryInfo(AppContext.BaseDirectory); dir is not null; dir = dir.Parent)
        {
            var candidate = Path.Combine(dir.FullName, "assignments-service", "pacts", name);
            if (File.Exists(candidate))
            {
                return candidate;
            }
        }
        throw new FileNotFoundException($"Could not find assignments-service/pacts/{name} above {AppContext.BaseDirectory}");
    }
}
