package telemetry

import (
	"bytes"
	"context"
	"encoding/json"
	"testing"

	"go.opentelemetry.io/otel"
)

func TestLogsIncludeTraceIDs(t *testing.T) {
	t.Setenv("OTEL_EXPORTER_OTLP_ENDPOINT", "") // no exporters in tests
	var buf bytes.Buffer
	log, shutdown, err := Setup(context.Background(), "test", &buf)
	if err != nil {
		t.Fatal(err)
	}
	defer shutdown(context.Background())

	ctx, span := otel.Tracer("test").Start(context.Background(), "op")
	log.InfoContext(ctx, "hello")
	span.End()

	var rec map[string]any
	if err := json.Unmarshal(buf.Bytes(), &rec); err != nil {
		t.Fatalf("log line is not JSON: %v (%s)", err, buf.String())
	}
	if rec["trace_id"] != span.SpanContext().TraceID().String() || rec["span_id"] != span.SpanContext().SpanID().String() {
		t.Fatalf("log record %v lacks the span's ids", rec)
	}
}
