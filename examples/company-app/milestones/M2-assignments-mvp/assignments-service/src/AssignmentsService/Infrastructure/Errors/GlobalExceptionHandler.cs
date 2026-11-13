using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AssignmentsService.Infrastructure.Errors;

/// <summary>
/// Turns every exception that escapes a controller into an RFC 9457 Problem
/// Details response. Copied from employees-service, plus two mappings this
/// service needs: field errors from business checks (400) and an unavailable
/// dependency (503).
/// </summary>
public sealed class GlobalExceptionHandler(
    IProblemDetailsService problemDetails,
    ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        ProblemDetails problem = exception switch
        {
            RequestValidationException e => new HttpValidationProblemDetails(e.Errors) { Status = StatusCodes.Status400BadRequest },
            NotFoundException e => new ProblemDetails { Status = StatusCodes.Status404NotFound, Detail = e.Message },
            ConflictException e => new ProblemDetails { Status = StatusCodes.Status409Conflict, Detail = e.Message },
            DependencyUnavailableException e => new ProblemDetails { Status = StatusCodes.Status503ServiceUnavailable, Detail = e.Message },
            // Never echo an unexpected exception's message: it can leak
            // table names, connection strings, or stack frames.
            _ => new ProblemDetails { Status = StatusCodes.Status500InternalServerError },
        };

        if (exception is DependencyUnavailableException unavailable)
        {
            // Not our bug, but worth seeing: an operator wants to know which
            // dependency is failing and why.
            logger.LogWarning(exception, "Dependency {Service} unavailable for {Method} {Path}",
                unavailable.Service, httpContext.Request.Method, httpContext.Request.Path);
        }
        else if (problem.Status == StatusCodes.Status500InternalServerError)
        {
            logger.LogError(exception, "Unhandled exception for {Method} {Path}",
                httpContext.Request.Method, httpContext.Request.Path);
        }

        httpContext.Response.StatusCode = problem.Status!.Value;
        return await problemDetails.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = httpContext,
            Exception = exception,
            ProblemDetails = problem,
        });
    }
}
