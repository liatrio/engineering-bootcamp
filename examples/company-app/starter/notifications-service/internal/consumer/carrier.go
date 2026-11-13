package consumer

import (
	"strings"

	amqp "github.com/rabbitmq/amqp091-go"
	"go.opentelemetry.io/otel/propagation"
)

// HeaderCarrier lets an OpenTelemetry propagator read and write W3C trace
// context (traceparent, tracestate, baggage) in AMQP message headers.
//
// There is no ready-made OpenTelemetry instrumentation for amqp091-go, so we
// write the adapter ourselves. It is small: a propagator only needs Get, Set
// and Keys.
//
// The one surprise is the value type. AMQP header tables are typed, and the
// RabbitMQ .NET client (7.x) writes string headers as byte arrays. amqp091-go
// decodes those as []byte, not string, so Get accepts both.
type HeaderCarrier amqp.Table

// Compile-time check that HeaderCarrier satisfies the interface.
var _ propagation.TextMapCarrier = HeaderCarrier(nil)

// Get returns the header value for key as a string, or "" when the header is
// missing or has a type that can't hold text.
func (c HeaderCarrier) Get(key string) string {
	v, ok := c[key]
	if !ok {
		// Propagators ask for lowercase keys ("traceparent"). Fall back to a
		// case-insensitive match in case a publisher capitalised the name.
		for k, val := range c {
			if strings.EqualFold(k, key) {
				v, ok = val, true
				break
			}
		}
	}
	if !ok {
		return ""
	}
	switch val := v.(type) {
	case string: // written by amqp091-go, pika, and most other clients
		return val
	case []byte: // written by RabbitMQ.Client 7.x (.NET)
		return string(val)
	default:
		return ""
	}
}

// Set stores a header value as a string (used when injecting, e.g. in tests
// or if this service ever publishes).
func (c HeaderCarrier) Set(key, value string) {
	c[key] = value
}

// Keys lists the header names.
func (c HeaderCarrier) Keys() []string {
	keys := make([]string, 0, len(c))
	for k := range c {
		keys = append(keys, k)
	}
	return keys
}
