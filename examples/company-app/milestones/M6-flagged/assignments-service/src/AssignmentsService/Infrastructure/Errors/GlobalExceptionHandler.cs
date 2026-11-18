using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace AssignmentsService.Infrastructure.Errors;

/// <summary>
/// Turns every exception that escapes a controller into an RFC 9457 Problem
/// Details response. Copied from employees-service, plus two mappings this
/// service needs: field errors from business checks (400) and an unavailable
/// dependency (503).
/// </summary>
public sealed partial class GlobalExceptionHandler(
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
            FeatureSwitchedOffException e => new ProblemDetails { Status = StatusCodes.Status503ServiceUnavailable, Detail = e.Message },
            // Never echo an unexpected exception's message: it can leak
            // table names, connection strings, or stack frames.
            _ => new ProblemDetails { Status = StatusCodes.Status500InternalServerError },
        };

        if (exception is DependencyUnavailableException unavailable)
        {
            // Not our bug, but worth seeing: an operator wants to know which
            // dependency is failing and why.
            Log.DependencyUnavailable(logger, exception, unavailable.Service, httpContext.Request.Method, httpContext.Request.Path);
        }
        else if (problem.Status == StatusCodes.Status500InternalServerError)
        {
            Log.Unhandled(logger, exception, httpContext.Request.Method, httpContext.Request.Path);
        }

        httpContext.Response.StatusCode = problem.Status!.Value;
        return await problemDetails.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = httpContext,
            Exception = exception,
            ProblemDetails = problem,
        });
    }

    // Compile-time logging methods (see RabbitMqEventPublisher for why).
    private static partial class Log
    {
        [LoggerMessage(Level = LogLevel.Warning, Message = "Dependency {Service} unavailable for {Method} {Path}")]
        public static partial void DependencyUnavailable(ILogger logger, Exception exception, string service, string method, PathString path);

        [LoggerMessage(Level = LogLevel.Error, Message = "Unhandled exception for {Method} {Path}")]
        public static partial void Unhandled(ILogger logger, Exception exception, string method, PathString path);
    }
}
