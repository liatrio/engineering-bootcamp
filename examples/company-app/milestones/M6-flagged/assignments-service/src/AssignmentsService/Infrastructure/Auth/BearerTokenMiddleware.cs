using System.Security.Cryptography;
using System.Text;
using AssignmentsService.Infrastructure.Configuration;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace AssignmentsService.Infrastructure.Auth;

/// <summary>
/// A shared-secret check for /api/*: when AUTH_TOKEN is set, requests need
/// "Authorization: Bearer {AUTH_TOKEN}" or get a 401. When it is unset (all
/// of Chapter 3), the middleware lets everything through. Copied from
/// employees-service.
/// </summary>
/// <remarks>
/// Only /api/* is protected. Health probes and OpenAPI stay open because
/// the platform and tools call them without credentials. A real system would use
/// ASP.NET Core authentication with JWTs; a static token is enough to show
/// where auth sits in the pipeline (Chapter 7.3 switches it on).
/// </remarks>
public sealed class BearerTokenMiddleware(RequestDelegate next, IOptions<ServiceOptions> options)
{
    public async Task InvokeAsync(HttpContext http, IProblemDetailsService problemDetails)
    {
        var token = options.Value.AuthToken;
        if (string.IsNullOrEmpty(token) || !http.Request.Path.StartsWithSegments("/api") || IsAuthorized(http, token))
        {
            await next(http);
            return;
        }

        http.Response.StatusCode = StatusCodes.Status401Unauthorized;
        http.Response.Headers.WWWAuthenticate = "Bearer";
        await problemDetails.WriteAsync(new ProblemDetailsContext
        {
            HttpContext = http,
            ProblemDetails = new ProblemDetails
            {
                Status = StatusCodes.Status401Unauthorized,
                Detail = "Send the header 'Authorization: Bearer <token>'.",
            },
        });
    }

    private static bool IsAuthorized(HttpContext http, string token)
    {
        const string prefix = "Bearer ";
        var header = http.Request.Headers.Authorization.ToString();
        if (!header.StartsWith(prefix, StringComparison.OrdinalIgnoreCase))
        {
            return false;
        }

        // Constant-time comparison, so response timing can't reveal how many
        // leading characters of a guess were right.
        var presented = Encoding.UTF8.GetBytes(header[prefix.Length..].Trim());
        var expected = Encoding.UTF8.GetBytes(token);
        return CryptographicOperations.FixedTimeEquals(presented, expected);
    }
}
