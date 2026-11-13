using Npgsql;
using OpenTelemetry;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

namespace AssignmentsService.Infrastructure.Telemetry;

public static class TelemetryExtensions
{
    /// <summary>
    /// Traces, metrics, and logs through the OpenTelemetry SDK, exported over
    /// OTLP. The exporter reads the standard variables itself:
    /// OTEL_EXPORTER_OTLP_ENDPOINT and OTEL_EXPORTER_OTLP_PROTOCOL
    /// (http/protobuf in compose).
    /// </summary>
    public static WebApplicationBuilder AddTelemetry(this WebApplicationBuilder builder)
    {
        var serviceName = builder.Configuration["OTEL_SERVICE_NAME"] ?? "assignments-service";

        var otel = builder.Services.AddOpenTelemetry()
            .ConfigureResource(resource => resource.AddService(serviceName))
            .WithTracing(tracing => tracing
                .AddAspNetCoreInstrumentation(options =>
                {
                    // Health probes run every few seconds; tracing them buries real traffic.
                    options.Filter = http =>
                        !http.Request.Path.StartsWithSegments("/healthz")
                        && !http.Request.Path.StartsWithSegments("/readyz");
                })
                .AddHttpClientInstrumentation()     // calls to employees and projects, carrying traceparent
                .AddNpgsql()                        // a span per SQL command
                .AddSource("RabbitMQ.Client.*")     // publish and consume spans; traceparent travels in message headers
                .AddSource(ServiceTelemetry.Name))  // our manual spans
            .WithMetrics(metrics => metrics
                .AddAspNetCoreInstrumentation()
                .AddHttpClientInstrumentation()
                .AddRuntimeInstrumentation()
                .AddMeter(ServiceTelemetry.Name))   // company.assignments.created
            .WithLogging(logging => { }, options =>
            {
                options.IncludeScopes = true;
                options.IncludeFormattedMessage = true;
            });

        // No endpoint configured (unit tests, a quick `dotnet run`): skip the
        // exporter rather than retrying a collector that isn't there.
        if (!string.IsNullOrWhiteSpace(builder.Configuration["OTEL_EXPORTER_OTLP_ENDPOINT"]))
        {
            otel.UseOtlpExporter();
        }

        // Console logs as JSON, one object per line. Scopes carry the TraceId and
        // SpanId of the current request, so a log line can be matched to its trace.
        builder.Logging.AddJsonConsole(options => options.IncludeScopes = true);

        return builder;
    }
}
