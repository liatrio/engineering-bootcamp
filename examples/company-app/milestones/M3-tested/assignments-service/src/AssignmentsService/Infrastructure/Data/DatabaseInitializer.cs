using Microsoft.EntityFrameworkCore;

namespace AssignmentsService.Infrastructure.Data;

/// <summary>
/// Applies EF Core migrations once, before the app starts taking requests.
/// There is no seed data: assignments start empty.
/// </summary>
/// <remarks>
/// Migrating on startup keeps a teaching app to one command. In production you
/// would run migrations as a separate, deliberate step so several replicas
/// starting at once don't race each other.
/// </remarks>
public sealed class DatabaseInitializer(IServiceScopeFactory scopes) : IHostedService
{
    public async Task StartAsync(CancellationToken cancellationToken)
    {
        // Hosted services are singletons; the DbContext is scoped.
        await using var scope = scopes.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<AssignmentsDbContext>();
        await db.Database.MigrateAsync(cancellationToken);
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
