using System.Globalization;
using AssignmentsService.Features.Assignments;
using AssignmentsService.Infrastructure.Auth;
using AssignmentsService.Infrastructure.Clients;
using AssignmentsService.Infrastructure.Configuration;
using AssignmentsService.Infrastructure.Data;
using AssignmentsService.Infrastructure.Errors;
using AssignmentsService.Infrastructure.Health;
using AssignmentsService.Infrastructure.Messaging;
using AssignmentsService.Infrastructure.Telemetry;
using Microsoft.AspNetCore.Mvc.ModelBinding.Metadata;
using Microsoft.EntityFrameworkCore;
using OpenFeature;
using OpenFeature.DependencyInjection.Providers.Flagd;
using OpenFeature.Hooks;

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

// Observability: OpenTelemetry traces, metrics, and logs over OTLP, the same
// setup as employees-service. Logs are JSON with the trace ID in each line.
builder.AddTelemetry();

// Readiness covers what this service owns. employees-service and
// projects-service are deliberately left out: if they were in, one of them
// going down would mark this service unready too, and reads that don't need
// them would stop working. Requests that do need them get a 503 instead.
builder.Services.AddHealthChecks()
    .AddDbContextCheck<AssignmentsDbContext>("postgres", tags: [HealthEndpoints.ReadyTag])
    .AddCheck<RabbitMqHealthCheck>("rabbitmq", tags: [HealthEndpoints.ReadyTag]);

// Feature flags: OpenFeature with the flagd provider at FLAGD_HOST:FLAGD_PORT.
// Code asks IFeatureClient, never flagd directly, so the
// provider can change (tests use an in-memory one) without touching features.
// TraceEnricherHook adds a "feature_flag.evaluation" event to the current span
// for every evaluation, so a trace shows which flags shaped the request.
builder.Services.AddOpenFeature(features => features
    .AddFlagdProvider(flagd =>
    {
        // Set explicitly: when registered through dependency injection the
        // provider uses its own defaults (localhost), not FLAGD_HOST/FLAGD_PORT.
        flagd.Host = builder.Configuration["FLAGD_HOST"] ?? "flagd";
        flagd.Port = int.Parse(builder.Configuration["FLAGD_PORT"] ?? "8013", CultureInfo.InvariantCulture);
    })
    .AddHook(_ => new TraceEnricherHook()));
// Shut OpenFeature down as soon as the app starts stopping. The default (after
// it has stopped) can overlap with the container disposing services and throw
// on shutdown, which shows up in tests that start and stop the app quickly.
builder.Services.Configure<FeatureLifecycleStateOptions>(o => o.StopState = FeatureStopState.Stopping);

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
