using Microsoft.AspNetCore.Mvc;

namespace EmployeesService.Features.Employees;

/// <summary>
/// HTTP in, HTTP out. No rules, no try/catch: validation happens before an
/// action runs ([ApiController]), and errors thrown by the service become
/// Problem Details in GlobalExceptionHandler.
/// </summary>
[ApiController]
[Route("api/employees")]
public sealed class EmployeesController(IEmployeeService employees) : ControllerBase
{
    /// <summary>Lists employees, optionally only those in one department.</summary>
    [HttpGet]
    [ProducesResponseType<IReadOnlyList<EmployeeResponse>>(StatusCodes.Status200OK, "application/json")]
    public Task<IReadOnlyList<EmployeeResponse>> List([FromQuery] string? department, CancellationToken ct) =>
        employees.ListAsync(department, ct);

    [HttpGet("{id:guid}")]
    [ProducesResponseType<EmployeeResponse>(StatusCodes.Status200OK, "application/json")]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound, "application/problem+json")]
    public Task<EmployeeResponse> Get(Guid id, CancellationToken ct) => employees.GetAsync(id, ct);

    [HttpPost]
    [Consumes("application/json")]
    [ProducesResponseType<EmployeeResponse>(StatusCodes.Status201Created, "application/json")]
    [ProducesResponseType<HttpValidationProblemDetails>(StatusCodes.Status400BadRequest, "application/problem+json")]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict, "application/problem+json")]
    public async Task<ActionResult<EmployeeResponse>> Create(EmployeeRequest request, CancellationToken ct)
    {
        var created = await employees.CreateAsync(request, ct);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    [Consumes("application/json")]
    [ProducesResponseType<EmployeeResponse>(StatusCodes.Status200OK, "application/json")]
    [ProducesResponseType<HttpValidationProblemDetails>(StatusCodes.Status400BadRequest, "application/problem+json")]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound, "application/problem+json")]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict, "application/problem+json")]
    public Task<EmployeeResponse> Update(Guid id, EmployeeRequest request, CancellationToken ct) =>
        employees.UpdateAsync(id, request, ct);

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound, "application/problem+json")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await employees.DeleteAsync(id, ct);
        return NoContent();
    }
}
