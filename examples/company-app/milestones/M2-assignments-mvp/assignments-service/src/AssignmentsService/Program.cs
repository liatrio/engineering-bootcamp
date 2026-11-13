using AssignmentsService.Features.Assignments;
using AssignmentsService.Infrastructure.Auth;
using AssignmentsService.Infrastructure.Clients;
using AssignmentsService.Infrastructure.Configuration;
using AssignmentsService.Infrastructure.Data;
using AssignmentsService.Infrastructure.Errors;
using AssignmentsService.Infrastructure.Health;
using AssignmentsService.Infrastructure.Messaging;
using Microsoft.AspNetCore.Mvc.ModelBinding.Metadata;
using Microsoft.EntityFrameworkCore;

// Same shape as employees-service: registrations above builder.Build(), the
// request pipeline below it, no feature logic in this file.

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.UseSetting(WebHostDefaults.HttpPortsKey, builder.Configuration["PORT"] ?? "8080");

// Configuration: typed options, validated at startup so a missing variable fails fast.
builder.Services.AddOptions<ServiceOptions>()
    .Bind(builder.Configuration)
    .ValidateDataAnnotations()
    .ValidateOnStart();

// Routing + validation, with camelCase keys in "errors".
builder.Services.AddControllers(options =>
    options.ModelMetadataDetailsProviders.Add(new SystemTextJsonValidationMetadataProvider()));
builder.Services.AddOpenApi(options => options.AddDocumentTransformer((document, _, _) =>
{
    document.Info.Title = "Assignments API";
    document.Info.Description = "Part of the Company app. See SPEC.md for the contract.";
    document.Servers = [];
    return Task.CompletedTask;
}));

// Error handling: one handler turns exceptions into Problem Details.
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

// Data access.
builder.Services.AddDbContext<AssignmentsDbContext>((services, options) =>
    options.UseNpgsql(services.GetRequiredService<IConfiguration>().GetConnectionString("Default")
        ?? throw new InvalidOperationException("ConnectionStrings__Default must be set.")));
builder.Services.AddHostedService<DatabaseInitializer>();

// Other services: typed HttpClients with timeouts, retries, and a circuit breaker.
builder.Services.AddDependencyClients();

// Messaging: publish through IEventPublisher; consume employee.deleted in the background.
builder.Services.AddSingleton<RabbitMqConnection>();
builder.Services.AddSingleton<IEventPublisher, RabbitMqEventPublisher>();
builder.Services.AddHostedService<EmployeeDeletedConsumer>();

// Readiness covers what this service owns. employees-service and
// projects-service are deliberately left out: if they were in, one of them
// going down would mark this service unready too, and reads that don't need
// them would stop working. Requests that do need them get a 503 instead.
builder.Services.AddHealthChecks()
    .AddDbContextCheck<AssignmentsDbContext>("postgres", tags: [HealthEndpoints.ReadyTag])
    .AddCheck<RabbitMqHealthCheck>("rabbitmq", tags: [HealthEndpoints.ReadyTag]);

// Time comes from a TimeProvider so tests can control it (Chapter 3.3.3).
builder.Services.AddSingleton(TimeProvider.System);

// Features.
builder.Services.AddScoped<IAssignmentStore, AssignmentStore>();
builder.Services.AddScoped<IAssignmentService, AssignmentService>();

var app = builder.Build();

app.UseExceptionHandler();
app.UseStatusCodePages();
app.UseMiddleware<BearerTokenMiddleware>();

app.MapOpenApi();
app.MapOpenApi("/openapi/{documentName}.yaml");
app.MapHealthEndpoints();
app.MapControllers();

// If startup fails (for example a required variable is missing), the host has
// logged why. Return a non-zero exit code instead of letting the
// exception escape: in a container this process is PID 1, which ignores the
// abort signal an unhandled exception raises, so it would hang instead of exiting.
try
{
    await app.RunAsync();
    return 0;
}
catch (Exception ex)
{
    Console.Error.WriteLine($"Fatal: {ex.Message}");
    return 1;
}
