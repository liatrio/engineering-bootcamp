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
using OpenFeature;

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
    public TestFlags Flags { get; } = new();

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

            UseInMemoryFlags(services, Flags);
        });
    }

    /// <summary>
    /// Swaps the flagd provider for an in-memory one, so tests neither need
    /// flagd nor depend on what the shared flag file says today.
    /// </summary>
    public static void UseInMemoryFlags(IServiceCollection services, TestFlags flags)
    {
        // AddOpenFeature registered the flagd provider under a service key.
        // Replace that one registration, keeping the key, so OpenFeature's own
        // wiring (lifecycle, hooks, IFeatureClient) stays exactly as in production.
        var registration = services.Single(d => d.ServiceType == typeof(FeatureProvider));
        services.Remove(registration);
        services.AddKeyedSingleton<FeatureProvider>(registration.ServiceKey, (_, _) => flags.NewProvider());
    }
}
