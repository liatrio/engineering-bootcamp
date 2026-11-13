package consumer

import (
	"context"
	"io"
	"log/slog"
	"os"
	"sync"
	"testing"

	amqp "github.com/rabbitmq/amqp091-go"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/propagation"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	"go.opentelemetry.io/otel/sdk/trace/tracetest"
	"go.opentelemetry.io/otel/trace"

	"github.com/liatrio/engineering-bootcamp/examples/company-app/starter/notifications-service/internal/store"
)

var spans = tracetest.NewSpanRecorder()

func TestMain(m *testing.M) {
	// Install a real SDK tracer (recording spans in memory) and the W3C
	// propagator, as main.go does.
	otel.SetTracerProvider(sdktrace.NewTracerProvider(sdktrace.WithSpanProcessor(spans)))
	otel.SetTextMapPropagator(propagation.NewCompositeTextMapPropagator(propagation.TraceContext{}, propagation.Baggage{}))
	os.Exit(m.Run())
}

// fakeAck records what Handle did with a delivery.
type fakeAck struct {
	mu                     sync.Mutex
	acked, nacked, requeue bool
}

func (f *fakeAck) Ack(uint64, bool) error {
	f.mu.Lock()
	defer f.mu.Unlock()
	f.acked = true
	return nil
}
func (f *fakeAck) Nack(_ uint64, _ bool, requeue bool) error {
	f.mu.Lock()
	defer f.mu.Unlock()
	f.nacked, f.requeue = true, requeue
	return nil
}
func (f *fakeAck) Reject(_ uint64, requeue bool) error { return f.Nack(0, false, requeue) }

func newTestConsumer() (*Consumer, *store.Store) {
	s := store.New(10)
	return New("amqp://unused", s, slog.New(slog.NewTextHandler(io.Discard, nil))), s
}

func delivery(ack amqp.Acknowledger, body string, headers amqp.Table) amqp.Delivery {
	return amqp.Delivery{
		Acknowledger: ack,
		Exchange:     Exchange,
		RoutingKey:   "employee.created",
		Headers:      headers,
		Body:         []byte(body),
	}
}

const validBody = `{"eventId":"0b7c5c1e-3c1a-4a8e-9a0e-0d6f1f6f0a11","type":"employee.created",
  "occurredAt":"2026-01-05T10:00:00Z","source":"employees-service",
  "data":{"id":"11111111-1111-4111-8111-111111111111","name":"Ada Lovelace"}}`

func TestHandleStoresAndAcks(t *testing.T) {
	c, s := newTestConsumer()
	ack := &fakeAck{}
	spans.Reset()

	c.Handle(context.Background(), delivery(ack, validBody, amqp.Table{"traceparent": []byte(testTraceparent)}))

	if !ack.acked || ack.nacked {
		t.Fatalf("want ack only, got %+v", ack)
	}
	got := s.List()
	if len(got) != 1 {
		t.Fatalf("want 1 notification, got %d", len(got))
	}
	n := got[0]
	if n.ID != "0b7c5c1e-3c1a-4a8e-9a0e-0d6f1f6f0a11" || n.Type != "employee.created" ||
		n.Message != "Employee Ada Lovelace was created" || n.OccurredAt.Format("2006-01-02") != "2026-01-05" {
		t.Fatalf("unexpected notification %+v", n)
	}
	if n.TraceID != testTraceID {
		t.Fatalf("traceId = %q, want the publisher's %q", n.TraceID, testTraceID)
	}

	ended := spans.Ended()
	if len(ended) != 1 {
		t.Fatalf("want 1 span, got %d", len(ended))
	}
	sp := ended[0]
	if sp.Name() != "process company.events" || sp.SpanKind() != trace.SpanKindConsumer {
		t.Fatalf("span %q kind %v", sp.Name(), sp.SpanKind())
	}
	if sp.Parent().SpanID().String() != "00f067aa0ba902b7" {
		t.Fatalf("span parent = %s, want the publisher's span", sp.Parent().SpanID())
	}
}

func TestHandleWithoutTraceparentStartsNewTrace(t *testing.T) {
	c, s := newTestConsumer()
	c.Handle(context.Background(), delivery(&fakeAck{}, validBody, nil))
	n := s.List()[0]
	if len(n.TraceID) != 32 || n.TraceID == testTraceID {
		t.Fatalf("want a fresh 32-hex trace id, got %q", n.TraceID)
	}
}

func TestHandleNacksMalformedJSONWithoutRequeue(t *testing.T) {
	c, s := newTestConsumer()
	ack := &fakeAck{}
	c.Handle(context.Background(), delivery(ack, `{not json`, nil))
	if ack.acked || !ack.nacked || ack.requeue {
		t.Fatalf("want nack without requeue, got %+v", ack)
	}
	if len(s.List()) != 0 {
		t.Fatal("malformed message must not be stored")
	}
}

func TestHandleFillsMissingFields(t *testing.T) {
	c, s := newTestConsumer()
	d := delivery(&fakeAck{}, `{"data":{}}`, nil)
	d.RoutingKey = "project.archived"
	c.Handle(context.Background(), d)
	n := s.List()[0]
	if n.Type != "project.archived" || n.Message != "Received project.archived" || len(n.ID) != 36 || n.OccurredAt.IsZero() {
		t.Fatalf("unexpected notification %+v", n)
	}
}
