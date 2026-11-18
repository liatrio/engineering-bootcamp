using AssignmentsService.Features.Assignments;
using AssignmentsService.Infrastructure.Errors;

namespace AssignmentsService.Tests.Features.Assignments;

/// <summary>
/// What each feature flag changes. The flags come from OpenFeature's in-memory
/// provider (TestFlags), so these tests need no flagd and can't be broken by
/// someone editing the shared flag file.
/// </summary>
public sealed class AssignmentFlagTests : ServiceTestContext
{
    [Fact]
    public async Task With_notifications_off_an_assignment_is_saved_but_not_announced()
    {
        await Flags.SetAsync(AssignmentFlags.Notifications, on: false);

        var created = await Service.CreateAsync(Request(), null, Ct);

        Assert.NotNull(await Store.FindAsync(created.Id, Ct));
        Assert.Empty(Events.Published);
    }

    [Fact]
    public async Task With_writes_off_create_update_and_delete_are_refused()
    {
        var existing = await Service.CreateAsync(Request(), null, Ct);
        await Flags.SetAsync(AssignmentFlags.Writes, on: false);

        await Assert.ThrowsAsync<FeatureSwitchedOffException>(() => Service.CreateAsync(Request(projectId: TestData.Portal), null, Ct));
        await Assert.ThrowsAsync<FeatureSwitchedOffException>(() => Service.UpdateAsync(existing.Id, Request(), null, Ct));
        await Assert.ThrowsAsync<FeatureSwitchedOffException>(() => Service.DeleteAsync(existing.Id, Ct));
    }

    [Fact]
    public async Task With_writes_off_reads_and_employee_cleanup_still_work()
    {
        await Service.CreateAsync(Request(), null, Ct);
        await Flags.SetAsync(AssignmentFlags.Writes, on: false);

        Assert.Single(await Service.ListAsync(null, null, Ct));
        Assert.Equal(1, await Service.RemoveForEmployeeAsync(TestData.Ada, Ct));
    }

    [Fact]
    public async Task With_the_allocation_check_off_overbooking_is_allowed()
    {
        await Flags.SetAsync(AssignmentFlags.AllocationCheck, on: false);
        await Service.CreateAsync(Request(projectId: TestData.Platform, allocation: 80), null, Ct);

        var second = await Service.CreateAsync(Request(projectId: TestData.Portal, allocation: 80), null, Ct);

        Assert.Equal(80, second.AllocationPercent);
    }

    [Fact]
    public async Task The_allocation_rollout_is_targeted_by_user_when_known()
    {
        await Service.CreateAsync(Request(), "manager-42", Ct);

        Assert.Equal("manager-42", Flags.LastTargetingKey);
    }

    [Fact]
    public async Task The_allocation_rollout_falls_back_to_the_employee_id()
    {
        await Service.CreateAsync(Request(employeeId: TestData.Grace), null, Ct);

        Assert.Equal(TestData.Grace.ToString(), Flags.LastTargetingKey);
    }
}
