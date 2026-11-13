namespace AssignmentsService.Tests;

/// <summary>
/// IDs the tests share. They match the seed data in employees-service and
/// projects-service (SPEC.md), so the same IDs work in contract tests too.
/// </summary>
public static class TestData
{
    public static readonly Guid Ada = Guid.Parse("11111111-1111-4111-8111-111111111111");
    public static readonly Guid Grace = Guid.Parse("22222222-2222-4222-8222-222222222222");
    public static readonly Guid Platform = Guid.Parse("aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa");
    public static readonly Guid Portal = Guid.Parse("bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb");
    public static readonly Guid Warehouse = Guid.Parse("cccccccc-cccc-4ccc-8ccc-cccccccccccc");

    /// <summary>A fixed "now" for FakeTimeProvider, so timestamps can be asserted exactly.</summary>
    public static readonly DateTimeOffset Now = new(2026, 3, 1, 9, 0, 0, TimeSpan.Zero);
}
