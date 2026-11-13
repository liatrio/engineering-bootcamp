using AssignmentsService.Features.Assignments;
using AssignmentsService.Infrastructure.Clients;
using AssignmentsService.Infrastructure.Messaging;
using AssignmentsService.Tests.Fakes;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Testcontainers.PostgreSql;

namespace AssignmentsService.Tests;

/// <summary>
/// The real app against a throwaway PostgreSQL in Docker. The app's own startup
/// applies the migrations. The other services and RabbitMQ are faked: these
/// tests are about our database, not theirs.
/// </summary>
public sealed class PostgresTestApp : WebApplicationFactory<Program>, IAsyncLifetime
{
    private readonly PostgreSqlContainer _postgres = new PostgreSqlBuilder("postgres:17-alpine").Build();

    public FakeEmployeesClient Employees { get; } = new();
    public FakeProjectsClient Projects { get; } = new();

    public async ValueTask InitializeAsync()
    {
        await _postgres.StartAsync();
        _ = Services;   // build the host now, so migrations have run before the first test
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseSetting("ConnectionStrings:Default", _postgres.GetConnectionString());
        builder.UseSetting("RABBITMQ_URL", "amqp://not-used/");
        builder.UseSetting("EMPLOYEES_URL", "http://employees.not-used");
        builder.UseSetting("PROJECTS_URL", "http://projects.not-used");

        builder.ConfigureTestServices(services =>
        {
            services.Remove(services.Single(d => d.ImplementationType == typeof(EmployeeDeletedConsumer)));
            services.RemoveAll<IEmployeesClient>();
            services.AddSingleton<IEmployeesClient>(Employees);
            services.RemoveAll<IProjectsClient>();
            services.AddSingleton<IProjectsClient>(Projects);
            services.RemoveAll<IEventPublisher>();
            services.AddSingleton<IEventPublisher>(new FakeEventPublisher());
        });
    }

    public override async ValueTask DisposeAsync()
    {
        await base.DisposeAsync();
        await _postgres.DisposeAsync();
    }
}
