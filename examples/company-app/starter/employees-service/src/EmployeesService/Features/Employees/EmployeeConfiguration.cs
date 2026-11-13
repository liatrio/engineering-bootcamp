using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EmployeesService.Features.Employees;

// Picked up automatically by ApplyConfigurationsFromAssembly in EmployeesDbContext.
public sealed class EmployeeConfiguration : IEntityTypeConfiguration<Employee>
{
    // Name of a column that exists only in the database (an EF "shadow property").
    public const string NormalizedEmail = "NormalizedEmail";

    public void Configure(EntityTypeBuilder<Employee> builder)
    {
        builder.HasKey(e => e.Id);
        // The service generates IDs (GUID v4), so the database never does.
        builder.Property(e => e.Id).ValueGeneratedNever();

        builder.Property(e => e.Name).IsRequired().HasMaxLength(100);
        builder.Property(e => e.Email).IsRequired().HasMaxLength(254);
        builder.Property(e => e.Title).IsRequired().HasMaxLength(100);
        builder.Property(e => e.Department).IsRequired().HasMaxLength(100);

        // Emails are unique regardless of case. A unique index on Email alone
        // would allow Ada@example.com next to ada@example.com, so PostgreSQL
        // keeps a lower-cased copy in a generated column and the unique index
        // goes on that. The database enforces the rule for every writer,
        // not just this service's C# code.
        builder.Property<string>(NormalizedEmail)
            .HasMaxLength(254)
            .HasComputedColumnSql("lower(\"Email\")", stored: true);
        builder.HasIndex(NormalizedEmail).IsUnique();

        // GET /api/employees?department=... filters on this column.
        builder.HasIndex(e => e.Department);
    }
}
