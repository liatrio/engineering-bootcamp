using System.Net;
using AssignmentsService.Infrastructure.Errors;
using Polly;

namespace AssignmentsService.Infrastructure.Clients;

internal static class HttpClientExtensions
{
    /// <summary>
    /// GETs a resource and reports whether it exists. 200 means yes and 404
    /// means no. Anything else (a 5xx, a timeout, a refused connection, an open
    /// circuit breaker) means we don't know, which becomes a 503 for our caller.
    /// </summary>
    public static async Task<bool> ResourceExistsAsync(
        this HttpClient http, string path, string service, CancellationToken ct)
    {
        try
        {
            using var response = await http.GetAsync(path, ct);
            if (response.StatusCode == HttpStatusCode.NotFound)
            {
                return false;
            }
            response.EnsureSuccessStatusCode();
            return true;
        }
        catch (Exception ex) when (IsUnavailable(ex, ct))
        {
            throw new DependencyUnavailableException(service, ex);
        }
    }

    private static bool IsUnavailable(Exception ex, CancellationToken ct) => ex switch
    {
        HttpRequestException => true,          // connection refused, DNS failure, non-success status
        ExecutionRejectedException => true,    // Polly gave up: timeout or open circuit breaker
        TaskCanceledException => !ct.IsCancellationRequested,   // HttpClient's own timeout, not our caller leaving
        _ => false,
    };
}
