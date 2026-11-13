using PactNet;

namespace AssignmentsService.Tests.Contracts;

/// <summary>Shared Pact settings for the consumer tests.</summary>
public static class PactSetup
{
    public const string Consumer = "assignments-service";

    /// <summary>
    /// assignments-service/pacts: committed, so the provider teams can verify
    /// these contracts from their own test suites (employees-service and
    /// projects-service read ../assignments-service/pacts).
    /// </summary>
    public static string PactDir { get; } = FindPactDir();

    public static IPactBuilderV4 For(string provider) =>
        Pact.V4(Consumer, provider, new PactConfig { PactDir = PactDir, LogLevel = PactLogLevel.Warn })
            .WithHttpInteractions();

    // Walk up from bin/Debug/net10.0 to the service folder, wherever the repo is checked out.
    private static string FindPactDir()
    {
        for (var dir = new DirectoryInfo(AppContext.BaseDirectory); dir is not null; dir = dir.Parent)
        {
            if (File.Exists(Path.Combine(dir.FullName, "AssignmentsService.slnx")))
            {
                return Path.Combine(dir.FullName, "pacts");
            }
        }
        throw new InvalidOperationException("Could not find AssignmentsService.slnx above " + AppContext.BaseDirectory);
    }
}
