namespace EmployeesService.Infrastructure.Errors;

// A small vocabulary of failures that mean something in HTTP terms.
// Services throw these; GlobalExceptionHandler is the only place that knows
// which status code each one becomes.

public sealed class NotFoundException(string entity, object key)
    : Exception($"{entity} '{key}' was not found.");

public sealed class ConflictException(string message) : Exception(message);
