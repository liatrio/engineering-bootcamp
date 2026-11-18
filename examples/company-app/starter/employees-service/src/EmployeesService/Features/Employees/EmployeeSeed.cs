namespace EmployeesService.Features.Employees;

/// <summary>
/// The fixed seed rows from SPEC.md. Tests, Pact provider states, and E2E tests
/// rely on these exact IDs, so never change them.
/// </summary>
public static class EmployeeSeed
{
    public static readonly Guid AdaId = Guid.Parse("11111111-1111-4111-8111-111111111111");
    public static readonly Guid GraceId = Guid.Parse("22222222-2222-4222-8222-222222222222");
    public static readonly Guid AlanId = Guid.Parse("33333333-3333-4333-8333-333333333333");

    public static IReadOnlyList<Guid> Ids { get; } = [AdaId, GraceId, AlanId];

    // A fixed timestamp keeps seed rows identical on every run, which makes
    // contract tests and snapshots stable.
    private static readonly DateTime SeededAt = new(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);

    /// <summary>Returns new instances every call, so callers can't mutate a shared copy.</summary>
    public static IReadOnlyList<Employee> Create() =>
    [
        Row(AdaId, "Ada Lovelace", "ada@example.com", "Principal Engineer", "Engineering"),
        Row(GraceId, "Grace Hopper", "grace@example.com", "Engineering Manager", "Engineering"),
        Row(AlanId, "Alan Turing", "alan@example.com", "Data Scientist", "Research"),
    ];

    private static Employee Row(Guid id, string name, string email, string title, string department) => new()
    {
        Id = id,
        Name = name,
        Email = email,
        Title = title,
        Department = department,
        CreatedAt = SeededAt,
        UpdatedAt = SeededAt,
    };
}
