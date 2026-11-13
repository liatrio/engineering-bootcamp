using AssignmentsService.Infrastructure.Errors;

namespace AssignmentsService.Tests.Features.Assignments;

/// <summary>
/// The two rules added in Chapter 3.4.2, written test-first: each test here was
/// red before the code in AssignmentService made it green.
/// </summary>
public sealed class AssignmentRulesTests : ServiceTestContext
{
    // Rule: an employee's overlapping assignments add up to 100% at most.

    [Fact]
    public async Task Overlapping_assignments_can_add_up_to_exactly_100_percent()
    {
        await Service.CreateAsync(Request(projectId: TestData.Platform, allocation: 60), null, Ct);

        var second = await Service.CreateAsync(Request(projectId: TestData.Portal, allocation: 40), null, Ct);

        Assert.Equal(40, second.AllocationPercent);
    }

    [Fact]
    public async Task Overlapping_assignments_over_100_percent_are_a_conflict()
    {
        await Service.CreateAsync(Request(projectId: TestData.Platform, allocation: 60), null, Ct);

        await Assert.ThrowsAsync<ConflictException>(
            () => Service.CreateAsync(Request(projectId: TestData.Portal, allocation: 41), null, Ct));
    }

    [Fact]
    public async Task Assignments_that_do_not_overlap_do_not_count_against_each_other()
    {
        await Service.CreateAsync(Request(projectId: TestData.Platform, allocation: 100, start: "2026-01-01", end: "2026-03-31"), null, Ct);

        var next = await Service.CreateAsync(Request(projectId: TestData.Portal, allocation: 100, start: "2026-04-01"), null, Ct);

        Assert.Equal(100, next.AllocationPercent);
    }

    [Fact]
    public async Task Date_ranges_are_inclusive_so_sharing_one_day_is_an_overlap()
    {
        await Service.CreateAsync(Request(projectId: TestData.Platform, allocation: 100, start: "2026-01-01", end: "2026-03-31"), null, Ct);

        await Assert.ThrowsAsync<ConflictException>(
            () => Service.CreateAsync(Request(projectId: TestData.Portal, allocation: 10, start: "2026-03-31"), null, Ct));
    }

    [Fact]
    public async Task An_open_ended_assignment_overlaps_everything_after_it_starts()
    {
        await Service.CreateAsync(Request(projectId: TestData.Platform, allocation: 80, start: "2026-01-01"), null, Ct);

        await Assert.ThrowsAsync<ConflictException>(
            () => Service.CreateAsync(Request(projectId: TestData.Portal, allocation: 30, start: "2030-01-01"), null, Ct));
    }

    [Fact]
    public async Task Other_employees_allocations_do_not_count()
    {
        await Service.CreateAsync(Request(employeeId: TestData.Grace, allocation: 100), null, Ct);

        var ada = await Service.CreateAsync(Request(employeeId: TestData.Ada, allocation: 100), null, Ct);

        Assert.Equal(100, ada.AllocationPercent);
    }

    [Fact]
    public async Task Updating_an_assignment_does_not_count_its_own_old_allocation()
    {
        var created = await Service.CreateAsync(Request(allocation: 70), null, Ct);

        var updated = await Service.UpdateAsync(created.Id, Request(allocation: 90), null, Ct);

        Assert.Equal(90, updated.AllocationPercent);
    }

    // Rule: endDate, when set, comes after startDate.

    [Theory]
    [InlineData("2026-02-28")]   // before
    [InlineData("2026-03-01")]   // same day
    public async Task An_endDate_not_after_startDate_reports_the_endDate_field(string end)
    {
        var ex = await Assert.ThrowsAsync<RequestValidationException>(
            () => Service.CreateAsync(Request(start: "2026-03-01", end: end), null, Ct));

        Assert.Equal(["endDate"], ex.Errors.Keys);
    }

    [Fact]
    public async Task An_endDate_after_startDate_is_accepted()
    {
        var created = await Service.CreateAsync(Request(start: "2026-03-01", end: "2026-03-02"), null, Ct);

        Assert.Equal(new DateOnly(2026, 3, 2), created.EndDate);
    }

    [Fact]
    public async Task The_endDate_rule_applies_to_updates_too()
    {
        var created = await Service.CreateAsync(Request(), null, Ct);

        await Assert.ThrowsAsync<RequestValidationException>(
            () => Service.UpdateAsync(created.Id, Request(start: "2026-03-01", end: "2026-01-01"), null, Ct));
    }
}
