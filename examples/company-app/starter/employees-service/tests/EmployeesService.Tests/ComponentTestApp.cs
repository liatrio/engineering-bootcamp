using EmployeesService.Features.Employees;
using EmployeesService.Infrastructure.Data;
using EmployeesService.Infrastructure.Messaging;
using EmployeesService.Tests.Fakes;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace EmployeesService.Tests;

/// <summary>
/// Boots the real app in memory (routing, validation, error handling, auth,
/// controllers, EmployeeService) with fakes in place of PostgreSQL and RabbitMQ.
/// </summary>
public sealed class ComponentTestApp : WebApplicationFactory<Program>
{
    // Shared by every component test.
    public static readonly InMemoryEmployeeStore Store = new(EmployeeSeed.Create());

    public FakeEventPublisher Events { get; } = new();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        // Required settings. Nothing connects to these, because both are faked below.
        builder.UseSetting("ConnectionStrings:Default", "Host=not-used");
        builder.UseSetting("RABBITMQ_URL", "amqp://not-used/");

        builder.ConfigureTestServices(services =>
        {
            // No database, so nothing to migrate.
            services.Remove(services.Single(d => d.ImplementationType == typeof(DatabaseInitializer)));

            services.RemoveAll<IEmployeeStore>();
            services.AddSingleton<IEmployeeStore>(Store);

            services.RemoveAll<IEventPublisher>();
            services.AddSingleton<IEventPublisher>(Events);
        });
    }

}
