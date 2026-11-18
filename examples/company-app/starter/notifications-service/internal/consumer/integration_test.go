//go:build integration

// Run with: go test -tags integration ./internal/consumer/
// Needs Docker: Testcontainers starts a real RabbitMQ for the test.
package consumer

import (
	"context"
	"io"
	"log/slog"
	"testing"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
	tcrabbit "github.com/testcontainers/testcontainers-go/modules/rabbitmq"

	"github.com/liatrio/engineering-bootcamp/examples/company-app/starter/notifications-service/internal/store"
)

func TestConsumesFromRealRabbitMQ(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
	defer cancel()

	rabbit, err := tcrabbit.Run(ctx, "rabbitmq:4-management")
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = rabbit.Terminate(context.Background()) })
	url, err := rabbit.AmqpURL(ctx)
	if err != nil {
		t.Fatal(err)
	}

	s := store.New(10)
	c := New(url, s, slog.New(slog.NewTextHandler(io.Discard, nil)))
	runCtx, stop := context.WithCancel(ctx)
	defer stop()
	go c.Run(runCtx)

	waitFor(t, "consumer ready", c.Ready)

	// Publish like the .NET employees-service does: traceparent as bytes.
	conn, err := amqp.Dial(url)
	if err != nil {
		t.Fatal(err)
	}
	defer conn.Close()
	ch, err := conn.Channel()
	if err != nil {
		t.Fatal(err)
	}
	err = ch.PublishWithContext(ctx, Exchange, "employee.updated", false, false, amqp.Publishing{
		ContentType:  "application/json",
		DeliveryMode: amqp.Persistent,
		Headers:      amqp.Table{"traceparent": []byte(testTraceparent)},
		Body: []byte(`{"eventId":"0b7c5c1e-3c1a-4a8e-9a0e-0d6f1f6f0a11","type":"employee.updated",
			"occurredAt":"2026-01-05T10:00:00Z","source":"employees-service","data":{"name":"Grace Hopper"}}`),
	})
	if err != nil {
		t.Fatal(err)
	}

	waitFor(t, "notification stored", func() bool { return len(s.List()) == 1 })
	n := s.List()[0]
	if n.Message != "Employee Grace Hopper was updated" || n.TraceID != testTraceID {
		t.Fatalf("unexpected notification %+v", n)
	}
}

func waitFor(t *testing.T, what string, cond func() bool) {
	t.Helper()
	deadline := time.Now().Add(30 * time.Second)
	for !cond() {
		if time.Now().After(deadline) {
			t.Fatalf("timed out waiting for %s", what)
		}
		time.Sleep(100 * time.Millisecond)
	}
}
