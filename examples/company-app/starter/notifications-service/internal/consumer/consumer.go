// Package consumer reads Company events from RabbitMQ and turns each one
// into a notification.
package consumer

import (
	"context"
	"encoding/json"
	"errors"
	"log/slog"
	"sync/atomic"
	"time"

	"github.com/google/uuid"
	amqp "github.com/rabbitmq/amqp091-go"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/codes"
	"go.opentelemetry.io/otel/metric"
	semconv "go.opentelemetry.io/otel/semconv/v1.43.0"
	"go.opentelemetry.io/otel/trace"

	"github.com/liatrio/engineering-bootcamp/examples/company-app/starter/notifications-service/internal/events"
	"github.com/liatrio/engineering-bootcamp/examples/company-app/starter/notifications-service/internal/store"
)

// Names fixed by SPEC.md. Every service declares the same exchange with the
// same settings, so whichever starts first creates it.
const (
	Exchange   = "company.events"
	Queue      = "notifications"
	BindingKey = "#" // every routing key, i.e. every event type
)

// instrumentationName identifies this package as the source of its spans
// and metrics.
const instrumentationName = "github.com/liatrio/engineering-bootcamp/examples/company-app/starter/notifications-service/internal/consumer"

// Adder is the part of the store the consumer needs.
type Adder interface {
	Add(store.Notification)
}

// Consumer owns the RabbitMQ connection and the processing of deliveries.
type Consumer struct {
	url    string
	store  Adder
	log    *slog.Logger
	ready  atomic.Bool
	tracer trace.Tracer
	count  metric.Int64Counter

	// Backoff between reconnect attempts: starts at minBackoff, doubles on
	// each failure, and is capped at maxBackoff.
	minBackoff, maxBackoff time.Duration
}

// New creates a consumer. Call Run to start it.
func New(url string, s Adder, log *slog.Logger) *Consumer {
	counter, err := otel.Meter(instrumentationName).Int64Counter(
		"company.notifications.received",
		metric.WithDescription("Events received from company.events and stored as notifications"),
		metric.WithUnit("{notification}"),
	)
	if err != nil {
		log.Error("creating counter failed; continuing without it", "error", err)
	}
	return &Consumer{
		url:        url,
		store:      s,
		log:        log,
		tracer:     otel.Tracer(instrumentationName),
		count:      counter,
		minBackoff: time.Second,
		maxBackoff: 30 * time.Second,
	}
}

// Ready reports whether the consumer is connected to RabbitMQ and consuming.
// GET /readyz uses it.
func (c *Consumer) Ready() bool { return c.ready.Load() }

// Run connects, consumes, and reconnects with exponential backoff until ctx
// is cancelled. RabbitMQ being down at startup is normal in docker compose,
// so Run never gives up; the service stays alive (healthz 200) but not
// ready (readyz 503) until it connects.
func (c *Consumer) Run(ctx context.Context) {
	backoff := c.minBackoff
	for ctx.Err() == nil {
		err := c.consume(ctx)
		c.ready.Store(false)
		if ctx.Err() != nil {
			return
		}
		if errors.Is(err, errConnectionLost) {
			// The connection worked before it dropped, so retry quickly.
			backoff = c.minBackoff
		}
		c.log.Warn("rabbitmq unavailable, retrying", "error", err, "retry_in", backoff.String())
		select {
		case <-ctx.Done():
			return
		case <-time.After(backoff):
		}
		backoff = min(backoff*2, c.maxBackoff)
	}
}

// errConnectionLost marks a connection that worked and later dropped.
var errConnectionLost = errors.New("connection to rabbitmq lost")

// consume runs one connection's lifetime. It returns when the connection
// drops or ctx is cancelled.
func (c *Consumer) consume(ctx context.Context) error {
	conn, err := amqp.DialConfig(c.url, amqp.Config{
		Properties: amqp.Table{"connection_name": "notifications-service"},
	})
	if err != nil {
		return err
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		return err
	}
	defer ch.Close()

	// Topology: a durable topic exchange, a durable queue, and a binding
	// that matches every routing key. Declaring is idempotent.
	if err := ch.ExchangeDeclare(Exchange, "topic", true, false, false, false, nil); err != nil {
		return err
	}
	if _, err := ch.QueueDeclare(Queue, true, false, false, false, nil); err != nil {
		return err
	}
	if err := ch.QueueBind(Queue, BindingKey, Exchange, false, nil); err != nil {
		return err
	}
	// Prefetch limits how many unacknowledged messages RabbitMQ pushes to us.
	if err := ch.Qos(20, 0, false); err != nil {
		return err
	}
	deliveries, err := ch.Consume(Queue, "notifications-service", false, false, false, false, nil)
	if err != nil {
		return err
	}

	closed := conn.NotifyClose(make(chan *amqp.Error, 1))
	c.ready.Store(true)
	c.log.Info("consuming", "exchange", Exchange, "queue", Queue)

	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case amqpErr := <-closed:
			if amqpErr != nil {
				c.log.Warn("rabbitmq connection closed", "error", amqpErr.Error())
			}
			return errConnectionLost
		case d, ok := <-deliveries:
			if !ok {
				return errConnectionLost
			}
			c.Handle(ctx, d)
		}
	}
}

// Handle processes one delivery: extract the trace context, start a consumer
// span, store the notification, and ack. Malformed messages are nacked
// without requeue so they don't loop forever (with a dead-letter exchange
// configured, RabbitMQ would move them there).
func (c *Consumer) Handle(ctx context.Context, d amqp.Delivery) {
	// 1. Continue the publisher's trace. Extract reads traceparent (and
	//    baggage) from the headers through our hand-written carrier. With no
	//    traceparent, ctx is unchanged and the span below starts a new trace.
	ctx = otel.GetTextMapPropagator().Extract(ctx, HeaderCarrier(d.Headers))

	// 2. A consumer span, named "{operation} {destination}" per the
	//    OpenTelemetry messaging semantic conventions.
	ctx, span := c.tracer.Start(ctx, "process "+Exchange,
		trace.WithSpanKind(trace.SpanKindConsumer),
		trace.WithAttributes(
			semconv.MessagingSystemRabbitMQ,
			semconv.MessagingOperationTypeProcess,
			semconv.MessagingOperationName("process"),
			semconv.MessagingDestinationName(d.Exchange),
			semconv.MessagingRabbitMQDestinationRoutingKey(d.RoutingKey),
			semconv.MessagingMessageBodySize(len(d.Body)),
		),
	)
	defer span.End()
	if d.MessageId != "" {
		span.SetAttributes(semconv.MessagingMessageID(d.MessageId))
	}

	var env events.Envelope
	if err := json.Unmarshal(d.Body, &env); err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, "malformed message")
		c.log.ErrorContext(ctx, "dropping malformed message", "error", err,
			"routing_key", d.RoutingKey, "body_size", len(d.Body))
		if err := d.Nack(false, false); err != nil {
			c.log.ErrorContext(ctx, "nack failed", "error", err)
		}
		return
	}

	// The envelope's type is authoritative; the routing key is a fallback.
	eventType := env.Type
	if eventType == "" {
		eventType = d.RoutingKey
	}
	span.SetAttributes(attribute.String("event.type", eventType))

	n := store.Notification{
		ID:         env.EventID,
		Type:       eventType,
		Message:    events.Message(eventType, env.Data),
		OccurredAt: env.OccurredAt.UTC(),
		TraceID:    traceID(span),
	}
	// Reuse the event's ID so a notification can be matched to its event;
	// generate one if the publisher left it out.
	if _, err := uuid.Parse(n.ID); err != nil {
		n.ID = uuid.NewString()
	}
	if env.OccurredAt.IsZero() {
		n.OccurredAt = time.Now().UTC()
	}

	c.store.Add(n)
	if c.count != nil {
		c.count.Add(ctx, 1, metric.WithAttributes(attribute.String("event.type", eventType)))
	}
	c.log.InfoContext(ctx, "notification stored", "event.type", eventType, "notification.id", n.ID)

	// Ack only after the notification is stored, so a crash before this
	// line means RabbitMQ redelivers the message.
	if err := d.Ack(false); err != nil {
		c.log.ErrorContext(ctx, "ack failed", "error", err)
	}
}

// traceID returns the span's trace ID as hex, or "" when there is none.
func traceID(span trace.Span) string {
	sc := span.SpanContext()
	if !sc.HasTraceID() {
		return ""
	}
	return sc.TraceID().String()
}
