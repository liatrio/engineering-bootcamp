using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace AssignmentsService.Infrastructure.Health;

public static class HealthEndpoints
{
    public const string ReadyTag = "ready";

    /// <summary>
    /// /healthz (liveness) runs no checks: if the process can answer, it is alive.
    /// /readyz (readiness) runs every check tagged "ready" (database, RabbitMQ)
    /// and returns 503 if any fails, so the platform stops sending traffic
    /// without restarting the container.
    /// </summary>
    public static IEndpointRouteBuilder MapHealthEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapHealthChecks("/healthz", new HealthCheckOptions
        {
            Predicate = _ => false,
            ResponseWriter = WriteStatusAsync,
        });

        app.MapHealthChecks("/readyz", new HealthCheckOptions
        {
            Predicate = check => check.Tags.Contains(ReadyTag),
            ResponseWriter = WriteStatusAsync,
        });

        return app;
    }

    private static Task WriteStatusAsync(HttpContext http, HealthReport report)
    {
        var status = report.Status == HealthStatus.Healthy ? "ok" : "unavailable";
        if (report.Entries.Count == 0)
        {
            return http.Response.WriteAsJsonAsync(new { status });
        }

        // Check names and states only, never exception messages: probes are unauthenticated.
        var checks = report.Entries.ToDictionary(e => e.Key, e => e.Value.Status.ToString().ToLowerInvariant());
        return http.Response.WriteAsJsonAsync(new { status, checks });
    }
}
