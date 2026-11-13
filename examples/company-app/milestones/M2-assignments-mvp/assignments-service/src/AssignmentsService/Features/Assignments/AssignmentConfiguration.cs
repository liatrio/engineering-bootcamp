using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AssignmentsService.Features.Assignments;

// Picked up automatically by ApplyConfigurationsFromAssembly in AssignmentsDbContext.
public sealed class AssignmentConfiguration : IEntityTypeConfiguration<Assignment>
{
    public void Configure(EntityTypeBuilder<Assignment> builder)
    {
        builder.HasKey(a => a.Id);
        builder.Property(a => a.Id).ValueGeneratedNever();   // the service generates GUIDs

        builder.Property(a => a.Role).IsRequired().HasMaxLength(100);

        // One assignment per employee per project, enforced by the database so
        // two simultaneous requests can't both get in. It also serves
        // ?employeeId= lookups, because EmployeeId is its first column.
        builder.HasIndex(a => new { a.EmployeeId, a.ProjectId }).IsUnique();
        builder.HasIndex(a => a.ProjectId);   // for ?projectId=

        builder.ToTable(t => t.HasCheckConstraint(
            "CK_Assignments_AllocationPercent", "\"AllocationPercent\" BETWEEN 1 AND 100"));
    }
}
