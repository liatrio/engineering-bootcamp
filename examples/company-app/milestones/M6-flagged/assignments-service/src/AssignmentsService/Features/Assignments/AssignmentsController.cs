using Microsoft.AspNetCore.Mvc;

namespace AssignmentsService.Features.Assignments;

/// <summary>
/// HTTP in, HTTP out. Validation runs before an action ([ApiController]);
/// exceptions from the service become Problem Details in GlobalExceptionHandler.
/// </summary>
[ApiController]
[Route("api/assignments")]
public sealed class AssignmentsController(IAssignmentService assignments) : ControllerBase
{
    /// <summary>
    /// Optional: who is making the change. Feature flags use it as the
    /// targeting key for percentage rollouts. It is not authentication.
    /// </summary>
    public const string UserIdHeader = "X-User-Id";

    /// <summary>Lists assignments, optionally for one employee and/or one project.</summary>
    [HttpGet]
    [ProducesResponseType<IReadOnlyList<AssignmentResponse>>(StatusCodes.Status200OK, "application/json")]
    public Task<IReadOnlyList<AssignmentResponse>> List(
        [FromQuery] Guid? employeeId, [FromQuery] Guid? projectId, CancellationToken ct) =>
        assignments.ListAsync(employeeId, projectId, ct);

    [HttpGet("{id:guid}")]
    [ProducesResponseType<AssignmentResponse>(StatusCodes.Status200OK, "application/json")]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound, "application/problem+json")]
    public Task<AssignmentResponse> Get(Guid id, CancellationToken ct) => assignments.GetAsync(id, ct);

    [HttpPost]
    [Consumes("application/json")]
    [ProducesResponseType<AssignmentResponse>(StatusCodes.Status201Created, "application/json")]
    [ProducesResponseType<HttpValidationProblemDetails>(StatusCodes.Status400BadRequest, "application/problem+json")]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict, "application/problem+json")]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status503ServiceUnavailable, "application/problem+json")]
    public async Task<ActionResult<AssignmentResponse>> Create(
        AssignmentRequest request, [FromHeader(Name = UserIdHeader)] string? userId, CancellationToken ct)
    {
        var created = await assignments.CreateAsync(request, userId, ct);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    [Consumes("application/json")]
    [ProducesResponseType<AssignmentResponse>(StatusCodes.Status200OK, "application/json")]
    [ProducesResponseType<HttpValidationProblemDetails>(StatusCodes.Status400BadRequest, "application/problem+json")]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound, "application/problem+json")]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict, "application/problem+json")]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status503ServiceUnavailable, "application/problem+json")]
    public Task<AssignmentResponse> Update(
        Guid id, AssignmentRequest request, [FromHeader(Name = UserIdHeader)] string? userId, CancellationToken ct) =>
        assignments.UpdateAsync(id, request, userId, ct);

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound, "application/problem+json")]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status503ServiceUnavailable, "application/problem+json")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await assignments.DeleteAsync(id, ct);
        return NoContent();
    }
}
