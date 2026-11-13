using AssignmentsService.Features.Assignments;
using Microsoft.EntityFrameworkCore;

namespace AssignmentsService.Infrastructure.Data;

/// <summary>
/// The one DbContext for this service, scoped to a single HTTP request.
/// It knows only this service's tables: employees and projects live in other
/// services' databases, reached through their APIs.
/// </summary>
public sealed class AssignmentsDbContext(DbContextOptions<AssignmentsDbContext> options) : DbContext(options)
{
    public DbSet<Assignment> Assignments => Set<Assignment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder) =>
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AssignmentsDbContext).Assembly);
}
