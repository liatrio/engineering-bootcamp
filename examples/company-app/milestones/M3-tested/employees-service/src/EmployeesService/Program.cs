using EmployeesService.Features.Employees;
using EmployeesService.Infrastructure.Auth;
using EmployeesService.Infrastructure.Configuration;
using EmployeesService.Infrastructure.Data;
using EmployeesService.Infrastructure.Errors;
using EmployeesService.Infrastructure.Health;
using EmployeesService.Infrastructure.Messaging;
using EmployeesService.Infrastructure.Telemetry;
using Microsoft.AspNetCore.Mvc.ModelBinding.Metadata;
using Microsoft.EntityFrameworkCore;

// Program.cs is the foundation's table of contents. Everything above
// builder.Build() registers a capability; everything below puts it in the
// request pipeline. Nothing here contains feature logic.

var builder = WebApplication.CreateBuilder(args);

// Listen on PORT (SPEC default 8080). Configuration comes from environment variables only.
builder.WebHost.UseSetting(WebHostDefaults.HttpPortsKey, builder.Configuration["PORT"] ?? "8080");

// Configuration: typed options, checked at startup so a missing variable fails fast.
builder.Services.AddOptions<ServiceOptions>()
    .Bind(builder.Configuration)
    .ValidateDataAnnotations()
    .ValidateOnStart();

// Routing + validation: [ApiController] returns a 400 Problem Details for an
// invalid body. The metadata provider makes "errors" keys use the JSON
// (camelCase) names, so a client sees "email", not "Email".
builder.Services.AddControllers(options =>
    options.ModelMetadataDetailsProviders.Add(new SystemTextJsonValidationMetadataProvider()));
builder.Services.AddOpenApi(options => options.AddDocumentTransformer((document, _, _) =>
{
    document.Info.Title = "Employees API";
    document.Info.Description = "Part of the Company app. See SPEC.md for the contract.";
    document.Servers = [];   // clients call whichever host served the document
    return Task.CompletedTask;
}));

// Error handling: one handler turns exceptions into RFC 9457 Problem Details.
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

// Data access: one DbContext, scoped per request, connection string from
// ConnectionStrings__Default. Migrations run before the app takes traffic.
builder.Services.AddDbContext<EmployeesDbContext>((services, options) =>
    options.UseNpgsql(services.GetRequiredService<IConfiguration>().GetConnectionString("Default")
        ?? throw new InvalidOperationException("ConnectionStrings__Default must be set.")));
builder.Services.AddHostedService<DatabaseInitializer>();

// Messaging: one RabbitMQ connection for the app; services see only IEventPublisher.
builder.Services.AddSingleton<RabbitMqConnection>();
builder.Services.AddSingleton<IEventPublisher, RabbitMqEventPublisher>();

// Observability: OpenTelemetry traces, metrics, and logs; readiness checks.
builder.AddTelemetry();
builder.Services.AddHealthChecks()
    .AddDbContextCheck<EmployeesDbContext>("postgres", tags: [HealthEndpoints.ReadyTag])
    .AddCheck<RabbitMqHealthCheck>("rabbitmq", tags: [HealthEndpoints.ReadyTag]);

// Time: one clock for the app, injected wherever "now" matters. Tests swap in a fake.
builder.Services.AddSingleton(TimeProvider.System);

// Features: one or two lines each.
builder.Services.AddScoped<IEmployeeStore, EmployeeStore>();
builder.Services.AddScoped<IEmployeeService, EmployeeService>();

var app = builder.Build();

// The pipeline. Order matters: the exception handler goes first so it wraps everything.
app.UseExceptionHandler();
app.UseStatusCodePages();              // empty 4xx responses (unknown route, 405) get a Problem Details body too
app.UseMiddleware<BearerTokenMiddleware>();

app.MapOpenApi();                      // live document at /openapi/v1.json
app.MapOpenApi("/openapi/{documentName}.yaml");   // the same as YAML; openapi.yaml is a saved copy
app.MapHealthEndpoints();              // /healthz and /readyz
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
