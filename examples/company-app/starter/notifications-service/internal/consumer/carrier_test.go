package consumer

import (
	"context"
	"slices"
	"testing"

	amqp "github.com/rabbitmq/amqp091-go"
	"go.opentelemetry.io/otel/propagation"
	"go.opentelemetry.io/otel/trace"
)

const (
	testTraceparent = "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01"
	testTraceID     = "4bf92f3577b34da6a3ce929d0e0e4736"
)

func TestCarrierGet(t *testing.T) {
	c := HeaderCarrier(amqp.Table{
		"as-string":  "hello",
		"as-bytes":   []byte("hello"),
		"as-int":     int32(7),
		"Mixed-Case": "found",
	})
	tests := map[string]string{
		"as-string":  "hello", // pika, amqp091-go
		"as-bytes":   "hello", // RabbitMQ.Client 7.x
		"as-int":     "",      // not text
		"missing":    "",
		"mixed-case": "found", // case-insensitive fallback
	}
	for key, want := range tests {
		if got := c.Get(key); got != want {
			t.Errorf("Get(%q) = %q, want %q", key, got, want)
		}
	}
}

func TestCarrierGetOnNilTable(t *testing.T) {
	if got := HeaderCarrier(nil).Get("traceparent"); got != "" {
		t.Fatalf("got %q", got)
	}
}

func TestCarrierSetAndKeys(t *testing.T) {
	c := HeaderCarrier(amqp.Table{})
	c.Set("traceparent", testTraceparent)
	c.Set("baggage", "k=v")
	keys := c.Keys()
	slices.Sort(keys)
	if !slices.Equal(keys, []string{"baggage", "traceparent"}) {
		t.Fatalf("keys = %v", keys)
	}
	if c.Get("traceparent") != testTraceparent {
		t.Fatal("Set value not readable by Get")
	}
}

// The real point of the carrier: a traceparent written as bytes by the .NET
// client must come out as the same trace on our side.
func TestExtractFromByteHeaders(t *testing.T) {
	prop := propagation.NewCompositeTextMapPropagator(propagation.TraceContext{}, propagation.Baggage{})
	headers := amqp.Table{
		"traceparent": []byte(testTraceparent),
		"baggage":     []byte("tenant=acme"),
	}
	ctx := prop.Extract(context.Background(), HeaderCarrier(headers))

	sc := trace.SpanContextFromContext(ctx)
	if !sc.IsRemote() || sc.TraceID().String() != testTraceID {
		t.Fatalf("extracted %v (remote=%v), want trace %s", sc.TraceID(), sc.IsRemote(), testTraceID)
	}
}

func TestExtractWithoutHeadersLeavesContextEmpty(t *testing.T) {
	ctx := propagation.TraceContext{}.Extract(context.Background(), HeaderCarrier(nil))
	if trace.SpanContextFromContext(ctx).IsValid() {
		t.Fatal("expected no span context")
	}
}
