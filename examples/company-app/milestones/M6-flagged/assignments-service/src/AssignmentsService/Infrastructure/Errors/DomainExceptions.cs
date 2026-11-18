namespace AssignmentsService.Infrastructure.Errors;

// A small vocabulary of failures that mean something in HTTP terms.
// Services throw these; GlobalExceptionHandler is the only place that knows
// which status code each one becomes.

public sealed class NotFoundException(string entity, object key)
    : Exception($"{entity} '{key}' was not found.");

public sealed class ConflictException(string message) : Exception(message);

/// <summary>
/// The request was well formed but refers to something that isn't valid, such
/// as an employee that doesn't exist. Becomes a 400 with field-level errors, in
/// the same shape [ApiController] uses for data-annotation failures.
/// </summary>
public sealed class RequestValidationException(IDictionary<string, string[]> errors)
    : Exception("One or more fields are invalid.")
{
    public IDictionary<string, string[]> Errors { get; } = errors;

    public RequestValidationException(string field, string message)
        : this(new Dictionary<string, string[]> { [field] = [message] })
    {
    }
}

/// <summary>
/// An operator switched this capability off with a kill-switch flag. Becomes a
/// 503: the service is up, but this part of it is deliberately unavailable.
/// </summary>
public sealed class FeatureSwitchedOffException(string message) : Exception(message);

/// <summary>
/// Another service we depend on didn't answer (or answered with an error)
/// even after retries. Becomes a 503: we can't decide, so we say so.
/// </summary>
public sealed class DependencyUnavailableException(string service, Exception? inner = null)
    : Exception($"{service} is unavailable. Try again shortly.", inner)
{
    public string Service { get; } = service;
}
