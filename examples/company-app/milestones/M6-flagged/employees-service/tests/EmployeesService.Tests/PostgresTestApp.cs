using EmployeesService.Infrastructure.Messaging;
using EmployeesService.Tests.Fakes;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Testcontainers.PostgreSql;

namespace EmployeesService.Tests;

/// <summary>
/// Boots the real app against a real, throwaway PostgreSQL in Docker
/// (Testcontainers). The app's own startup applies the migrations and seeds the
/// table, exactly as it does in compose. Only RabbitMQ is faked.
/// </summary>
public sealed class PostgresTestApp : WebApplicationFactory<Program>, IAsyncLifetime
{
    // Same major version as compose, so the tests exercise the database we ship on.
    private readonly PostgreSqlContainer _postgres = new PostgreSqlBuilder("postgres:17-alpine").Build();

    public FakeEventPublisher Events { get; } = new();

    public string ConnectionString => _postgres.GetConnectionString();

    public async ValueTask InitializeAsync()
    {
        await _postgres.StartAsync();
        // Build the host now, so migrations have run before the first test.
        _ = Services;
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseSetting("ConnectionStrings:Default", _postgres.GetConnectionString());
        builder.UseSetting("RABBITMQ_URL", "amqp://not-used/");
        builder.UseSetting("SEED_DATA", "true");

        builder.ConfigureTestServices(services =>
        {
            services.RemoveAll<IEventPublisher>();
            services.AddSingleton<IEventPublisher>(Events);

            ComponentTestApp.UseInMemoryFlags(services, new TestFlags());
        });
    }

    public override async ValueTask DisposeAsync()
    {
        await base.DisposeAsync();
        await _postgres.DisposeAsync();
    }
}
