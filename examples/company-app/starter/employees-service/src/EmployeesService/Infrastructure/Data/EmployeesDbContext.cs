using EmployeesService.Features.Employees;
using Microsoft.EntityFrameworkCore;

namespace EmployeesService.Infrastructure.Data;

/// <summary>
/// The one DbContext for this service. Registered with AddDbContext, so it is
/// scoped to a single HTTP request: one unit of work per request.
/// </summary>
public sealed class EmployeesDbContext(DbContextOptions<EmployeesDbContext> options) : DbContext(options)
{
    public DbSet<Employee> Employees => Set<Employee>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Picks up every IEntityTypeConfiguration<T> in this assembly, including
        // the ones that live next to their feature (Features/*/...Configuration.cs).
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(EmployeesDbContext).Assembly);
    }
}
