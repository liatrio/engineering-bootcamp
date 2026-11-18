using System.ComponentModel.DataAnnotations;

namespace EmployeesService.Features.Employees;

/// <summary>
/// The body of POST and PUT. PUT replaces every writable field, so create and
/// update accept exactly the same shape and share one request type.
/// </summary>
/// <remarks>
/// [ApiController] checks these attributes before the action runs and returns
/// a 400 Problem Details with an "errors" map when any of them fail.
/// </remarks>
public sealed class EmployeeRequest
{
    [Required, StringLength(100, MinimumLength = 1)]
    public string Name { get; init; } = "";

    [Required, EmailAddress, StringLength(254, MinimumLength = 3)]
    public string Email { get; init; } = "";

    [Required, StringLength(100, MinimumLength = 1)]
    public string Title { get; init; } = "";

    [Required, StringLength(100, MinimumLength = 1)]
    public string Department { get; init; } = "";
}

/// <summary>What the API returns, and the "data" of employee.created / employee.updated events.</summary>
public sealed record EmployeeResponse(
    Guid Id,
    string Name,
    string Email,
    string Title,
    string Department,
    DateTime CreatedAt,
    DateTime UpdatedAt)
{
    public static EmployeeResponse From(Employee e) =>
        new(e.Id, e.Name, e.Email, e.Title, e.Department, e.CreatedAt, e.UpdatedAt);
}
