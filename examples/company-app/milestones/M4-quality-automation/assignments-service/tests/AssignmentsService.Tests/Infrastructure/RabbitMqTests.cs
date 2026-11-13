using System.Text.Json;
using AssignmentsService.Features.Assignments;
using AssignmentsService.Infrastructure.Configuration;
using AssignmentsService.Infrastructure.Health;
using AssignmentsService.Infrastructure.Messaging;
using AssignmentsService.Tests.Fakes;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Time.Testing;
using RabbitMQ.Client;
using Testcontainers.RabbitMq;

namespace AssignmentsService.Tests.Infrastructure;

/// <summary>A throwaway RabbitMQ broker in Docker, shared by the tests in one class.</summary>
public sealed class RabbitMqFixture : IAsyncLifetime
{
    private readonly RabbitMqContainer _broker = new RabbitMqBuilder("rabbitmq:4-management-alpine").Build();

    public RabbitMqConnection Connection { get; private set; } = null!;

    public async ValueTask InitializeAsync()
    {
        await _broker.StartAsync();
        Connection = new RabbitMqConnection(Options.Create(new ServiceOptions { RabbitMqUrl = _broker.GetConnectionString() }));
    }

    public async ValueTask DisposeAsync()
    {
        await Connection.DisposeAsync();
        await _broker.DisposeAsync();
    }
}

/// <summary>
/// Integration tests for the messaging edge against a real broker: what we
/// publish, what we consume, and the readiness check. Fakes can't tell us
/// whether the exchange, queue, and binding are declared correctly; this can.
/// </summary>
[Trait("Category", "Integration")]
public sealed class RabbitMqTests(RabbitMqFixture rabbit) : IClassFixture<RabbitMqFixture>
{
    private static CancellationToken Ct => TestContext.Current.CancellationToken;

    [Fact]
    public async Task The_health_check_is_healthy_when_the_broker_is_up()
    {
        var result = await new RabbitMqHealthCheck(rabbit.Connection).CheckHealthAsync(new HealthCheckContext(), Ct);

        Assert.Equal(HealthStatus.Healthy, result.Status);
    }

    [Fact]
    public async Task Published_events_are_persistent_json_envelopes_routed_by_type()
    {
        await using var channel = await rabbit.Connection.CreateChannelAsync(Ct);
        var queue = (await channel.QueueDeclareAsync(cancellationToken: Ct)).QueueName;
        await channel.QueueBindAsync(queue, RabbitMqConnection.Exchange, "assignment.created", cancellationToken: Ct);

        var publisher = new RabbitMqEventPublisher(rabbit.Connection, NullLogger<RabbitMqEventPublisher>.Instance);
        await publisher.PublishAsync("assignment.created", new { id = TestData.Ada }, Ct);

        var message = await GetOneAsync(channel, queue);
        Assert.Equal("application/json", message.BasicProperties.ContentType);
        Assert.Equal(DeliveryModes.Persistent, message.BasicProperties.DeliveryMode);
        using var json = JsonDocument.Parse(message.Body);
        Assert.Equal("assignment.created", json.RootElement.GetProperty("type").GetString());
        Assert.Equal("assignments-service", json.RootElement.GetProperty("source").GetString());
        Assert.Equal(TestData.Ada, json.RootElement.GetProperty("data").GetProperty("id").GetGuid());
    }

    [Fact]
    public async Task An_employee_deleted_event_removes_that_employees_assignments()
    {
        var store = new InMemoryAssignmentStore();
        var service = new AssignmentService(store, new FakeEmployeesClient(), new FakeProjectsClient(),
            new FakeEventPublisher(), new FakeTimeProvider(TestData.Now));
        await service.CreateAsync(new AssignmentRequest
        {
            EmployeeId = TestData.Grace,
            ProjectId = TestData.Platform,
            Role = "Developer",
            AllocationPercent = 50,
            StartDate = new DateOnly(2026, 3, 1),
        }, Ct);

        var services = new ServiceCollection().AddScoped<IAssignmentService>(_ => service).BuildServiceProvider();
        using var consumer = new EmployeeDeletedConsumer(rabbit.Connection,
            services.GetRequiredService<IServiceScopeFactory>(), NullLogger<EmployeeDeletedConsumer>.Instance);
        await consumer.StartAsync(Ct);
        await WaitUntilAsync(async () => await QueueExistsAsync(EmployeeDeletedConsumer.Queue));

        await using var channel = await rabbit.Connection.CreateChannelAsync(Ct);
        var body = JsonSerializer.SerializeToUtf8Bytes(new { type = "employee.deleted", data = new { id = TestData.Grace } });
        await channel.BasicPublishAsync(RabbitMqConnection.Exchange, "employee.deleted", body, Ct);

        await WaitUntilAsync(async () => store.Count == 0);
        await consumer.StopAsync(Ct);
    }

    private async Task<bool> QueueExistsAsync(string queue)
    {
        await using var channel = await rabbit.Connection.CreateChannelAsync(Ct);
        try
        {
            await channel.QueueDeclarePassiveAsync(queue, Ct);
            return true;
        }
        catch (RabbitMQ.Client.Exceptions.OperationInterruptedException)
        {
            return false;
        }
    }

    private static async Task<BasicGetResult> GetOneAsync(IChannel channel, string queue)
    {
        BasicGetResult? result = null;
        await WaitUntilAsync(async () => (result = await channel.BasicGetAsync(queue, autoAck: true, Ct)) is not null);
        return result!;
    }

    // Messaging is asynchronous: poll briefly instead of sleeping a fixed time.
    private static async Task WaitUntilAsync(Func<Task<bool>> condition)
    {
        for (var i = 0; i < 50; i++)
        {
            if (await condition())
            {
                return;
            }
            await Task.Delay(100, Ct);
        }
        Assert.Fail("Condition was not met within 5 seconds.");
    }
}
