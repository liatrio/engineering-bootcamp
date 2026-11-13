using EmployeesService.Features.Employees;
using EmployeesService.Infrastructure.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace EmployeesService.Infrastructure.Data;

/// <summary>
/// Applies EF Core migrations, then inserts the seed employees if the table is
/// empty and SEED_DATA is on. Runs once, before the app starts taking requests.
/// </summary>
/// <remarks>
/// Migrating on startup keeps a teaching app to one command. In production you
/// would usually run migrations as a separate, deliberate step (a pipeline job
/// or <c>dotnet ef database update</c>), so several replicas starting at once
/// don't race each other and a bad migration doesn't take every instance down.
/// </remarks>
public sealed class DatabaseInitializer(
    IServiceScopeFactory scopes,
    IOptions<ServiceOptions> options,
    ILogger<DatabaseInitializer> logger) : IHostedService
{
    public async Task StartAsync(CancellationToken cancellationToken)
    {
        // Hosted services are singletons; the DbContext is scoped. A scope of
        // our own avoids holding one DbContext for the life of the app.
        await using var scope = scopes.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<EmployeesDbContext>();

        await db.Database.MigrateAsync(cancellationToken);

        if (options.Value.SeedData && !await db.Employees.AnyAsync(cancellationToken))
        {
            db.Employees.AddRange(EmployeeSeed.Create());
            await db.SaveChangesAsync(cancellationToken);
            logger.LogInformation("Seeded {Count} employees", EmployeeSeed.Ids.Count);
        }
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
