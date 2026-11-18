using AssignmentsService.Features.Assignments;
using AssignmentsService.Infrastructure.Clients;
using AssignmentsService.Infrastructure.Data;
using AssignmentsService.Infrastructure.Messaging;
using AssignmentsService.Tests.Fakes;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace AssignmentsService.Tests;

/// <summary>
/// Boots the real app in memory with fakes at every edge: storage, the two
/// services it calls, and RabbitMQ. Each test gets a fresh factory (see
/// AssignmentsApiTests), so no state leaks between tests: the lesson of 3.4.4.
/// </summary>
public sealed class ComponentTestApp : WebApplicationFactory<Program>
{
    public InMemoryAssignmentStore Store { get; } = new();
    public FakeEmployeesClient Employees { get; } = new();
    public FakeProjectsClient Projects { get; } = new();
    public FakeEventPublisher Events { get; } = new();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        // Required settings. Nothing connects to them, because everything is faked below.
        builder.UseSetting("ConnectionStrings:Default", "Host=not-used");
        builder.UseSetting("RABBITMQ_URL", "amqp://not-used/");
        builder.UseSetting("EMPLOYEES_URL", "http://employees.not-used");
        builder.UseSetting("PROJECTS_URL", "http://projects.not-used");

        builder.ConfigureTestServices(services =>
        {
            // No database to migrate, no queue to consume.
            services.Remove(services.Single(d => d.ImplementationType == typeof(DatabaseInitializer)));
            services.Remove(services.Single(d => d.ImplementationType == typeof(EmployeeDeletedConsumer)));

            services.RemoveAll<IAssignmentStore>();
            services.AddSingleton<IAssignmentStore>(Store);
            services.RemoveAll<IEmployeesClient>();
            services.AddSingleton<IEmployeesClient>(Employees);
            services.RemoveAll<IProjectsClient>();
            services.AddSingleton<IProjectsClient>(Projects);
            services.RemoveAll<IEventPublisher>();
            services.AddSingleton<IEventPublisher>(Events);
        });
    }
}
