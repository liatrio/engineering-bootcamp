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
/// <remarks>
/// Each instance has its own store, seeded fresh. The store used to be one
/// static instance shared by every test, so one test's DELETE could break
/// another test depending on which ran first (Chapter 3.4.4).
/// </remarks>
public sealed class ComponentTestApp : WebApplicationFactory<Program>
{
    public InMemoryEmployeeStore Store { get; } = new(EmployeeSeed.Create());

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
