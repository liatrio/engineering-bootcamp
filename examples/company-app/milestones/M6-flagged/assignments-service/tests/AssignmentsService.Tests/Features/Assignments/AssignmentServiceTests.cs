using AssignmentsService.Infrastructure.Errors;

namespace AssignmentsService.Tests.Features.Assignments;

/// <summary>Unit tests: AssignmentService with fakes for storage, the other services, RabbitMQ, and the clock.</summary>
public sealed class AssignmentServiceTests : ServiceTestContext
{
    [Fact]
    public async Task Create_saves_the_assignment_with_the_current_time()
    {
        var created = await Service.CreateAsync(Request(), null, Ct);

        Assert.NotEqual(Guid.Empty, created.Id);
        Assert.Equal(TestData.Now.UtcDateTime, created.CreatedAt);
        Assert.Equal(TestData.Now.UtcDateTime, created.UpdatedAt);
        Assert.NotNull(await Store.FindAsync(created.Id, Ct));
    }

    [Fact]
    public async Task Create_publishes_assignment_created_with_the_assignment()
    {
        var created = await Service.CreateAsync(Request(), null, Ct);

        var (type, data) = Assert.Single(Events.Published);
        Assert.Equal("assignment.created", type);
        Assert.Equal(created, data);
    }

    [Fact]
    public async Task Create_for_an_unknown_employee_reports_the_employeeId_field()
    {
        var ex = await Assert.ThrowsAsync<RequestValidationException>(
            () => Service.CreateAsync(Request(employeeId: Guid.NewGuid()), null, Ct));

        Assert.Equal(["employeeId"], ex.Errors.Keys);
        Assert.Equal(0, Store.Count);
    }

    [Fact]
    public async Task Create_with_unknown_employee_and_project_reports_both_fields()
    {
        var ex = await Assert.ThrowsAsync<RequestValidationException>(
            () => Service.CreateAsync(Request(Guid.NewGuid(), Guid.NewGuid()), null, Ct));

        Assert.Equal(["employeeId", "projectId"], ex.Errors.Keys.Order());
    }

    [Fact]
    public async Task Create_when_employees_service_is_down_saves_nothing()
    {
        Employees.IsDown = true;

        await Assert.ThrowsAsync<DependencyUnavailableException>(() => Service.CreateAsync(Request(), null, Ct));

        Assert.Equal(0, Store.Count);
        Assert.Empty(Events.Published);
    }

    [Fact]
    public async Task Create_twice_for_the_same_employee_and_project_is_a_conflict()
    {
        await Service.CreateAsync(Request(allocation: 20), null, Ct);

        await Assert.ThrowsAsync<ConflictException>(() => Service.CreateAsync(Request(allocation: 20), null, Ct));
        Assert.Single(Events.Published);
    }

    [Fact]
    public async Task Update_replaces_the_fields_and_moves_updatedAt()
    {
        var created = await Service.CreateAsync(Request(), null, Ct);
        Clock.Advance(TimeSpan.FromHours(1));

        var updated = await Service.UpdateAsync(created.Id, Request(projectId: TestData.Portal, allocation: 30), null, Ct);

        Assert.Equal((TestData.Portal, 30), (updated.ProjectId, updated.AllocationPercent));
        Assert.Equal(TestData.Now.UtcDateTime, updated.CreatedAt);
        Assert.Equal(TestData.Now.UtcDateTime.AddHours(1), updated.UpdatedAt);
    }

    [Fact]
    public async Task Update_to_a_pair_that_already_exists_is_a_conflict()
    {
        await Service.CreateAsync(Request(projectId: TestData.Platform, allocation: 20), null, Ct);
        var other = await Service.CreateAsync(Request(projectId: TestData.Portal, allocation: 20), null, Ct);

        await Assert.ThrowsAsync<ConflictException>(
            () => Service.UpdateAsync(other.Id, Request(projectId: TestData.Platform, allocation: 20), null, Ct));
    }

    [Fact]
    public async Task Update_of_an_unknown_id_is_not_found()
    {
        await Assert.ThrowsAsync<NotFoundException>(() => Service.UpdateAsync(Guid.NewGuid(), Request(), null, Ct));
    }

    [Fact]
    public async Task Delete_of_an_unknown_id_is_not_found()
    {
        await Assert.ThrowsAsync<NotFoundException>(() => Service.DeleteAsync(Guid.NewGuid(), Ct));
    }

    [Fact]
    public async Task RemoveForEmployee_deletes_only_that_employees_assignments()
    {
        await Service.CreateAsync(Request(TestData.Ada, TestData.Platform), null, Ct);
        await Service.CreateAsync(Request(TestData.Ada, TestData.Portal), null, Ct);
        var grace = await Service.CreateAsync(Request(TestData.Grace, TestData.Platform), null, Ct);

        var removed = await Service.RemoveForEmployeeAsync(TestData.Ada, Ct);

        Assert.Equal(2, removed);
        Assert.Equal([grace.Id], (await Service.ListAsync(null, null, Ct)).Select(a => a.Id));
    }

    [Fact]
    public async Task List_filters_by_employee_and_project()
    {
        await Service.CreateAsync(Request(TestData.Ada, TestData.Platform), null, Ct);
        await Service.CreateAsync(Request(TestData.Ada, TestData.Portal), null, Ct);
        await Service.CreateAsync(Request(TestData.Grace, TestData.Platform), null, Ct);

        Assert.Equal(2, (await Service.ListAsync(TestData.Ada, null, Ct)).Count);
        Assert.Equal(2, (await Service.ListAsync(null, TestData.Platform, Ct)).Count);
        Assert.Single(await Service.ListAsync(TestData.Ada, TestData.Portal, Ct));
    }
}
