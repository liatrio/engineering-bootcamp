using EmployeesService.Features.Employees;
using EmployeesService.Infrastructure.Errors;
using EmployeesService.Tests.Fakes;
using Microsoft.Extensions.Time.Testing;

namespace EmployeesService.Tests.Features.Employees;

/// <summary>
/// Unit tests: EmployeeService on its own, with a fresh fake store, a fake
/// publisher, and a fake clock per test. No HTTP, no database, no RabbitMQ;
/// each runs in microseconds.
/// </summary>
public sealed class EmployeeServiceTests : IAsyncLifetime
{
    private readonly InMemoryEmployeeStore _store = new(EmployeeSeed.Create());
    private readonly FakeEventPublisher _events = new();

    // The clock stands still at a known instant until a test advances it, so
    // timestamps can be asserted exactly instead of "somewhere around now".
    private static readonly DateTimeOffset Now = new(2026, 3, 1, 9, 0, 0, TimeSpan.Zero);
    private readonly FakeTimeProvider _clock = new(Now);
    private readonly TestFlags _flags = new();
    private EmployeeService _service = null!;

    // Binding the in-memory flag provider is asynchronous, so the service is built here.
    public async ValueTask InitializeAsync() =>
        _service = new EmployeeService(_store, _events, await _flags.CreateClientAsync(), _clock);

    public ValueTask DisposeAsync() => ValueTask.CompletedTask;

    private static EmployeeRequest NewRequest(string email = "katherine@example.com", string department = "Research") => new()
    {
        Name = "Katherine Johnson",
        Email = email,
        Title = "Mathematician",
        Department = department,
    };

    private static CancellationToken Ct => TestContext.Current.CancellationToken;

    [Fact]
    public async Task Create_assigns_an_id_and_saves_the_employee()
    {
        var created = await _service.CreateAsync(NewRequest(), Ct);

        Assert.NotEqual(Guid.Empty, created.Id);
        var saved = await _store.FindAsync(created.Id, Ct);
        Assert.NotNull(saved);
        Assert.Equal("katherine@example.com", saved.Email);
    }

    [Fact]
    public async Task Create_sets_created_and_updated_timestamps_to_now()
    {
        var created = await _service.CreateAsync(NewRequest(), Ct);

        Assert.Equal(Now.UtcDateTime, created.CreatedAt);
        Assert.Equal(Now.UtcDateTime, created.UpdatedAt);
    }

    [Fact]
    public async Task Create_publishes_employee_created_with_the_employee()
    {
        var created = await _service.CreateAsync(NewRequest(), Ct);

        var (type, data) = Assert.Single(_events.Published);
        Assert.Equal("employee.created", type);
        Assert.Equal(created, data);
    }

    [Fact]
    public async Task Create_trims_whitespace_from_fields()
    {
        var request = new EmployeeRequest
        {
            Name = "  Katherine Johnson ",
            Email = " katherine@example.com ",
            Title = "Mathematician ",
            Department = " Research",
        };

        var created = await _service.CreateAsync(request, Ct);

        Assert.Equal("Katherine Johnson", created.Name);
        Assert.Equal("katherine@example.com", created.Email);
    }

    [Theory]
    [InlineData("ada@example.com")]
    [InlineData("ADA@Example.com")]
    public async Task Create_with_an_email_already_in_use_throws_conflict_and_publishes_nothing(string email)
    {
        await Assert.ThrowsAsync<ConflictException>(() => _service.CreateAsync(NewRequest(email), Ct));

        Assert.Empty(_events.Published);
    }

    [Fact]
    public async Task Update_replaces_every_writable_field()
    {
        var request = new EmployeeRequest
        {
            Name = "Ada King",
            Email = "ada.king@example.com",
            Title = "Countess",
            Department = "Research",
        };

        var updated = await _service.UpdateAsync(EmployeeSeed.AdaId, request, Ct);

        Assert.Equal(("Ada King", "ada.king@example.com", "Countess", "Research"),
            (updated.Name, updated.Email, updated.Title, updated.Department));
    }

    [Fact]
    public async Task Update_keeps_created_at_and_moves_updated_at_forward()
    {
        var original = await _service.GetAsync(EmployeeSeed.AdaId, Ct);
        _clock.Advance(TimeSpan.FromMinutes(5));

        var updated = await _service.UpdateAsync(EmployeeSeed.AdaId, NewRequest(), Ct);

        Assert.Equal(original.CreatedAt, updated.CreatedAt);
        Assert.Equal(Now.UtcDateTime.AddMinutes(5), updated.UpdatedAt);
    }

    [Fact]
    public async Task Update_can_keep_the_same_email()
    {
        var updated = await _service.UpdateAsync(EmployeeSeed.AdaId, NewRequest("ada@example.com"), Ct);

        Assert.Equal("ada@example.com", updated.Email);
    }

    [Fact]
    public async Task Update_to_another_employees_email_throws_conflict()
    {
        await Assert.ThrowsAsync<ConflictException>(
            () => _service.UpdateAsync(EmployeeSeed.AdaId, NewRequest("Grace@example.com"), Ct));
    }

    [Fact]
    public async Task Update_publishes_employee_updated()
    {
        await _service.UpdateAsync(EmployeeSeed.AdaId, NewRequest(), Ct);

        Assert.Equal("employee.updated", Assert.Single(_events.Published).Type);
    }

    [Fact]
    public async Task Update_of_an_unknown_id_throws_not_found()
    {
        await Assert.ThrowsAsync<NotFoundException>(() => _service.UpdateAsync(Guid.NewGuid(), NewRequest(), Ct));
    }

    [Fact]
    public async Task Delete_removes_the_employee_and_publishes_its_id()
    {
        await _service.DeleteAsync(EmployeeSeed.AlanId, Ct);

        Assert.Null(await _store.FindAsync(EmployeeSeed.AlanId, Ct));
        var (type, data) = Assert.Single(_events.Published);
        Assert.Equal("employee.deleted", type);
        Assert.Equal(EmployeeSeed.AlanId, data.GetType().GetProperty("id")!.GetValue(data));
    }

    [Fact]
    public async Task Delete_of_an_unknown_id_throws_not_found_and_publishes_nothing()
    {
        await Assert.ThrowsAsync<NotFoundException>(() => _service.DeleteAsync(Guid.NewGuid(), Ct));

        Assert.Empty(_events.Published);
    }

    [Fact]
    public async Task With_the_employee_events_kill_switch_off_changes_are_saved_but_not_published()
    {
        await _flags.SetAsync(EmployeeFlags.Events, on: false);

        var created = await _service.CreateAsync(NewRequest(), Ct);
        await _service.UpdateAsync(created.Id, NewRequest(), Ct);
        await _service.DeleteAsync(created.Id, Ct);

        Assert.Empty(_events.Published);
        Assert.Null(await _store.FindAsync(created.Id, Ct));
    }

    [Fact]
    public async Task Get_of_an_unknown_id_throws_not_found()
    {
        await Assert.ThrowsAsync<NotFoundException>(() => _service.GetAsync(Guid.NewGuid(), Ct));
    }

    [Fact]
    public async Task List_filters_by_department_and_orders_by_name()
    {
        var engineering = await _service.ListAsync("Engineering", Ct);

        Assert.Equal(["Ada Lovelace", "Grace Hopper"], engineering.Select(e => e.Name));
    }
}
