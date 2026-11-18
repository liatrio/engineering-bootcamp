//go:build integration

// Run with: go test -tags integration ./internal/consumer/
// Needs Docker: Testcontainers starts a real RabbitMQ for each test.
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
	url, s := startConsumer(t)
	ch := openChannel(t, url)

	// Publish like the .NET employees-service does: traceparent as bytes.
	publish(t, ch, "employee.updated", amqp.Table{"traceparent": []byte(testTraceparent)},
		`{"eventId":"0b7c5c1e-3c1a-4a8e-9a0e-0d6f1f6f0a11","type":"employee.updated",
		"occurredAt":"2026-01-05T10:00:00Z","source":"employees-service","data":{"name":"Grace Hopper"}}`)

	waitFor(t, "notification stored", func() bool { return len(s.List()) == 1 })
	n := s.List()[0]
	if n.Message != "Employee Grace Hopper was updated" || n.TraceID != testTraceID {
		t.Fatalf("unexpected notification %+v", n)
	}
}

// A unit test with a fake acknowledger shows that Handle calls Nack. Only a
// real broker shows the whole path: the exchange routes the event to our
// queue, the bad message really leaves the queue, and the consumer keeps going.
func TestDropsMalformedMessagesAndKeepsConsuming(t *testing.T) {
	url, s := startConsumer(t)
	ch := openChannel(t, url)

	publish(t, ch, "employee.created", nil, `{not json`)
	publish(t, ch, "assignment.created", nil,
		`{"eventId":"5d2c1a7e-8f3b-4c6d-9e1a-2b3c4d5e6f70","type":"assignment.created",
		"occurredAt":"2026-01-05T10:00:00Z","source":"assignments-service",
		"data":{"employeeId":"11111111-1111-4111-8111-111111111111",
		"projectId":"aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa","role":"Tech lead"}}`)

	// RabbitMQ delivers in order, so once the assignment is stored, the bad
	// message has already been handled.
	waitFor(t, "assignment notification stored", func() bool {
		for _, n := range s.List() {
			if n.Type == "assignment.created" {
				return true
			}
		}
		return false
	})
	if got := s.List(); len(got) != 1 {
		t.Fatalf("want only the assignment stored, got %d notifications: %+v", len(got), got)
	}

	q, err := ch.QueueDeclarePassive(Queue, true, false, false, false, nil)
	if err != nil {
		t.Fatal(err)
	}
	if q.Messages != 0 {
		t.Fatalf("want an empty queue, got %d messages waiting", q.Messages)
	}
}

// startConsumer starts RabbitMQ in a throwaway container and runs a Consumer
// against it until the test ends. It returns the broker's URL and the store
// the consumer writes to.
func startConsumer(t *testing.T) (string, *store.Store) {
	t.Helper()
	ctx, cancel := context.WithTimeout(t.Context(), 2*time.Minute)
	t.Cleanup(cancel)

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
	go c.Run(ctx) // stops when the test ends and its context is cancelled
	waitFor(t, "consumer ready", c.Ready)
	return url, s
}

func openChannel(t *testing.T, url string) *amqp.Channel {
	t.Helper()
	conn, err := amqp.Dial(url)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = conn.Close() })
	ch, err := conn.Channel()
	if err != nil {
		t.Fatal(err)
	}
	return ch
}

// publish sends one persistent JSON message to the company.events exchange.
func publish(t *testing.T, ch *amqp.Channel, routingKey string, headers amqp.Table, body string) {
	t.Helper()
	err := ch.PublishWithContext(t.Context(), Exchange, routingKey, false, false, amqp.Publishing{
		ContentType:  "application/json",
		DeliveryMode: amqp.Persistent,
		Headers:      headers,
		Body:         []byte(body),
	})
	if err != nil {
		t.Fatal(err)
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
