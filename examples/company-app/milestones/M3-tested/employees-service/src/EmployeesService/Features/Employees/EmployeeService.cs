using System.Diagnostics.Metrics;
using EmployeesService.Infrastructure.Errors;
using EmployeesService.Infrastructure.Messaging;
using EmployeesService.Infrastructure.Telemetry;

namespace EmployeesService.Features.Employees;

public interface IEmployeeService
{
    Task<IReadOnlyList<EmployeeResponse>> ListAsync(string? department, CancellationToken ct);
    Task<EmployeeResponse> GetAsync(Guid id, CancellationToken ct);
    Task<EmployeeResponse> CreateAsync(EmployeeRequest request, CancellationToken ct);
    Task<EmployeeResponse> UpdateAsync(Guid id, EmployeeRequest request, CancellationToken ct);
    Task DeleteAsync(Guid id, CancellationToken ct);
}

/// <summary>
/// The employee rules: emails are unique, IDs and timestamps come from the
/// service, and every change is announced on company.events after it is saved.
/// </summary>
/// <remarks>
/// The current time comes from an injected <see cref="TimeProvider"/>, not the
/// system clock directly, so a test can set the clock and assert exact timestamps.
/// </remarks>
public sealed class EmployeeService(IEmployeeStore store, IEventPublisher events, TimeProvider time) : IEmployeeService
{
    public const string CreatedEvent = "employee.created";
    public const string UpdatedEvent = "employee.updated";
    public const string DeletedEvent = "employee.deleted";

    // A business metric: how many employees were hired, by department.
    // Department has a handful of values, so it is safe as a metric attribute.
    private static readonly Counter<long> EmployeesCreated = ServiceTelemetry.Meter.CreateCounter<long>(
        "company.employees.created", unit: "{employee}", description: "Employees created through the API");

    public async Task<IReadOnlyList<EmployeeResponse>> ListAsync(string? department, CancellationToken ct)
    {
        var employees = await store.ListAsync(department, ct);
        return [.. employees.Select(EmployeeResponse.From)];
    }

    public async Task<EmployeeResponse> GetAsync(Guid id, CancellationToken ct)
    {
        var employee = await store.FindAsync(id, ct) ?? throw new NotFoundException(nameof(Employee), id);
        return EmployeeResponse.From(employee);
    }

    public async Task<EmployeeResponse> CreateAsync(EmployeeRequest request, CancellationToken ct)
    {
        await EnsureEmailIsFreeAsync(request.Email, exceptId: null, ct);

        var now = time.GetUtcNow().UtcDateTime;
        var employee = new Employee
        {
            Id = Guid.NewGuid(),   // a random (version 4) GUID
            CreatedAt = now,
            UpdatedAt = now,
        };
        Apply(request, employee);
        await store.AddAsync(employee, ct);

        EmployeesCreated.Add(1, new KeyValuePair<string, object?>("department", employee.Department));

        var response = EmployeeResponse.From(employee);
        using (var activity = ServiceTelemetry.ActivitySource.StartActivity("publish " + CreatedEvent))
        {
            activity?.SetTag("employee.id", employee.Id);
            await PublishAsync(CreatedEvent, response);
        }
        return response;
    }

    public async Task<EmployeeResponse> UpdateAsync(Guid id, EmployeeRequest request, CancellationToken ct)
    {
        var employee = await store.FindAsync(id, ct) ?? throw new NotFoundException(nameof(Employee), id);
        await EnsureEmailIsFreeAsync(request.Email, exceptId: id, ct);

        Apply(request, employee);
        employee.UpdatedAt = time.GetUtcNow().UtcDateTime;
        await store.UpdateAsync(employee, ct);

        var response = EmployeeResponse.From(employee);
        using (var activity = ServiceTelemetry.ActivitySource.StartActivity("publish " + UpdatedEvent))
        {
            activity?.SetTag("employee.id", employee.Id);
            await PublishAsync(UpdatedEvent, response);
        }
        return response;
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct)
    {
        if (!await store.DeleteAsync(id, ct))
        {
            throw new NotFoundException(nameof(Employee), id);
        }

        await PublishAsync(DeletedEvent, new { id });
    }

    private async Task EnsureEmailIsFreeAsync(string email, Guid? exceptId, CancellationToken ct)
    {
        // Checking first gives a clear 409 message in the common case. The
        // database's unique index still catches the race where two requests
        // pass this check at the same time.
        if (await store.EmailInUseAsync(email, exceptId, ct))
        {
            throw new ConflictException($"An employee with email '{email}' already exists.");
        }
    }

    // PUT replaces every writable field, so create and update share this.
    private static void Apply(EmployeeRequest request, Employee employee)
    {
        employee.Name = request.Name.Trim();
        employee.Email = request.Email.Trim();
        employee.Title = request.Title.Trim();
        employee.Department = request.Department.Trim();
    }

    // The row is already committed. Publishing ignores the request's
    // cancellation token on purpose: a client that hangs up now must not
    // stop the event that announces a change that really happened.
    private Task PublishAsync(string type, object data) => events.PublishAsync(type, data, CancellationToken.None);
}
