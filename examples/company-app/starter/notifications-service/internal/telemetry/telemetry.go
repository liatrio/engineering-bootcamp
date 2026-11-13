// Package telemetry sets up OpenTelemetry traces, metrics, and logs.
//
// The OTLP exporters read the standard environment variables themselves
// (OTEL_EXPORTER_OTLP_ENDPOINT, OTEL_EXPORTER_OTLP_HEADERS, ...), and the
// resource reads OTEL_SERVICE_NAME and OTEL_RESOURCE_ATTRIBUTES, so nothing
// here is hard-coded.
package telemetry

import (
	"context"
	"errors"
	"io"
	"log/slog"
	"os"

	"go.opentelemetry.io/contrib/bridges/otelslog"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/otlp/otlplog/otlploghttp"
	"go.opentelemetry.io/otel/exporters/otlp/otlpmetric/otlpmetrichttp"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracehttp"
	"go.opentelemetry.io/otel/propagation"
	sdklog "go.opentelemetry.io/otel/sdk/log"
	sdkmetric "go.opentelemetry.io/otel/sdk/metric"
	"go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.43.0"
	"go.opentelemetry.io/otel/trace"
)

// Setup installs the global tracer provider, meter provider, and W3C
// propagator, and returns a logger plus a shutdown function that flushes
// pending telemetry.
//
// When no OTLP endpoint is configured (e.g. `go run .` on a laptop), the SDK
// still runs, so trace IDs appear in logs and notifications, but nothing is
// exported.
func Setup(ctx context.Context, serviceName string, stdout io.Writer) (*slog.Logger, func(context.Context) error, error) {
	// W3C traceparent + baggage: the format every Company service speaks.
	otel.SetTextMapPropagator(propagation.NewCompositeTextMapPropagator(
		propagation.TraceContext{}, propagation.Baggage{}))

	res, err := resource.Merge(
		resource.Default(), // includes OTEL_SERVICE_NAME / OTEL_RESOURCE_ATTRIBUTES
		resource.NewSchemaless(semconv.ServiceName(serviceName)),
	)
	if err != nil {
		return nil, nil, err
	}

	exporting := os.Getenv("OTEL_EXPORTER_OTLP_ENDPOINT") != "" ||
		os.Getenv("OTEL_EXPORTER_OTLP_TRACES_ENDPOINT") != ""

	var shutdowns []func(context.Context) error
	shutdown := func(ctx context.Context) error {
		var errs []error
		for _, fn := range shutdowns {
			errs = append(errs, fn(ctx))
		}
		return errors.Join(errs...)
	}

	// Traces.
	tpOpts := []sdktrace.TracerProviderOption{sdktrace.WithResource(res)}
	if exporting {
		exp, err := otlptracehttp.New(ctx)
		if err != nil {
			return nil, nil, err
		}
		tpOpts = append(tpOpts, sdktrace.WithBatcher(exp))
	}
	tp := sdktrace.NewTracerProvider(tpOpts...)
	otel.SetTracerProvider(tp)
	shutdowns = append(shutdowns, tp.Shutdown)

	// JSON logs on stdout, with trace_id and span_id added from the context.
	var handler slog.Handler = traceHandler{slog.NewJSONHandler(stdout, nil)}

	if exporting {
		// Metrics, pushed every 60s by default (OTEL_METRIC_EXPORT_INTERVAL).
		mexp, err := otlpmetrichttp.New(ctx)
		if err != nil {
			return nil, nil, err
		}
		mp := sdkmetric.NewMeterProvider(sdkmetric.WithResource(res),
			sdkmetric.WithReader(sdkmetric.NewPeriodicReader(mexp)))
		otel.SetMeterProvider(mp)
		shutdowns = append(shutdowns, mp.Shutdown)

		// Logs: the otelslog bridge sends the same records over OTLP, where
		// Grafana links each log line to its trace.
		lexp, err := otlploghttp.New(ctx)
		if err != nil {
			return nil, nil, err
		}
		lp := sdklog.NewLoggerProvider(sdklog.WithResource(res),
			sdklog.WithProcessor(sdklog.NewBatchProcessor(lexp)))
		shutdowns = append(shutdowns, lp.Shutdown)
		handler = slog.NewMultiHandler(handler,
			otelslog.NewHandler(serviceName, otelslog.WithLoggerProvider(lp)))
	}

	return slog.New(handler), shutdown, nil
}

// traceHandler adds trace_id and span_id to every record logged with a
// context that carries a span (logger.InfoContext(ctx, ...)).
type traceHandler struct{ slog.Handler }

func (h traceHandler) Handle(ctx context.Context, r slog.Record) error {
	if sc := trace.SpanContextFromContext(ctx); sc.IsValid() {
		r.AddAttrs(
			slog.String("trace_id", sc.TraceID().String()),
			slog.String("span_id", sc.SpanID().String()),
		)
	}
	return h.Handler.Handle(ctx, r)
}

func (h traceHandler) WithAttrs(attrs []slog.Attr) slog.Handler {
	return traceHandler{h.Handler.WithAttrs(attrs)}
}

func (h traceHandler) WithGroup(name string) slog.Handler {
	return traceHandler{h.Handler.WithGroup(name)}
}
