# notifications-service

Consumes every event on the `company.events` RabbitMQ exchange and serves the latest 100 as `GET /api/notifications`, newest first. Part of the Company app; the binding contract is [`SPEC.md`](../../SPEC.md).

```json
[{ "id": "5d2c1f0e-8a4b-4c1d-9e2f-3a4b5c6d7e8f", "type": "employee.created",
   "message": "Employee Ada Lovelace was created",
   "occurredAt": "2026-11-13T09:00:00Z", "traceId": "0af7651916cd43dd8448eb211c80319c" }]
```

## Why in-memory is fine here

This service is a **read model**: a view built from events whose source of truth lives elsewhere (the employees and assignments databases). If the process restarts, the list starts empty and fills up again as new events arrive. Nothing is lost that matters, so a fixed-size ring buffer (`internal/store`) is enough, and the service needs no database. If losing the list ever became a problem, you'd add a store, not change the design.

## Layout

| Path | What it does |
| --- | --- |
| `main.go` | Wiring: config, telemetry, store, consumer, HTTP server, graceful shutdown on SIGINT/SIGTERM |
| `internal/config` | Reads environment variables |
| `internal/store` | Thread-safe ring buffer of the latest 100 notifications |
| `internal/events` | Event envelope and the event → message text mapping |
| `internal/consumer` | RabbitMQ topology, reconnect loop, per-message handling, and the AMQP header carrier for trace context |
| `internal/httpapi` | `GET /api/notifications`, `/healthz`, `/readyz`, optional bearer auth |
| `internal/telemetry` | OpenTelemetry traces, metrics, and logs; JSON logs with `trace_id` / `span_id` |
| `openapi.yaml` | The HTTP contract |

## Environment variables

| Variable | Meaning | Default |
| --- | --- | --- |
| `RABBITMQ_URL` | AMQP connection string | **required** |
| `PORT` | HTTP listen port | `8080` |
| `AUTH_TOKEN` | When set, `/api/*` needs `Authorization: Bearer <token>`. Health endpoints never need it. | unset (no auth) |
| `OTEL_SERVICE_NAME` | Service name in telemetry | `notifications-service` |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OTLP/HTTP collector, e.g. `http://otel-lgtm:4318`. When unset, nothing is exported, but trace IDs are still generated and logged. | unset |

Other standard `OTEL_*` variables (`OTEL_EXPORTER_OTLP_HEADERS`, `OTEL_RESOURCE_ATTRIBUTES`, `OTEL_METRIC_EXPORT_INTERVAL`, ...) work too, because the SDK reads them directly. Only OTLP over HTTP is supported, matching `OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf`.

## Run it

Locally (Go 1.27+), with RabbitMQ from the app's compose file or a one-off container:

```sh
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4-management
RABBITMQ_URL=amqp://guest:guest@localhost:5672/ go run .
curl localhost:8080/api/notifications
```

The service starts even if RabbitMQ is down: `/healthz` returns 200 straight away, and `/readyz` returns 503 until the consumer connects. It retries with exponential backoff (1s, doubling, capped at 30s) and reconnects the same way if the broker restarts.

With Docker:

```sh
docker build -t notifications-service .
docker run --rm -p 5104:8080 -e RABBITMQ_URL=amqp://guest:guest@host.docker.internal:5672/ notifications-service
```

The image is distroless (no shell) and runs as a non-root user.

To see a notification, publish to the `company.events` exchange in the management UI (http://localhost:15672, guest/guest) with routing key `employee.created` and a body such as `{"eventId":"5d2c1f0e-8a4b-4c1d-9e2f-3a4b5c6d7e8f","type":"employee.created","occurredAt":"2026-11-13T09:00:00Z","source":"employees-service","data":{"name":"Ada Lovelace"}}`.

## Message handling

| Event type | Message |
| --- | --- |
| `employee.created` | `Employee {name} was created` |
| `employee.updated` | `Employee {name} was updated` |
| `employee.deleted` | `Employee {id} was deleted` |
| `assignment.created` | `Employee {employeeId} was assigned to project {projectId} as {role}` |
| anything else | `Received {type}` |

The consumer acks a message only after storing it. A body that isn't valid JSON is logged and nacked without requeue, so it can't loop forever. Each notification's `id` is the event's `eventId` when it's a valid UUID; otherwise the service generates one.

## How trace context crosses RabbitMQ

HTTP gets distributed tracing for free from `otelhttp`, which reads the `traceparent` request header. A message queue has no HTTP headers, so the publisher puts `traceparent` into the **AMQP message headers** instead. The .NET employees-service does this automatically through RabbitMQ.Client 7.x's built-in instrumentation.

On this side, nobody publishes OpenTelemetry instrumentation for `amqp091-go`, so extraction is written by hand. It's a good way to see that propagation is just "copy a header across a boundary":

1. `internal/consumer/carrier.go`: `HeaderCarrier` adapts `amqp.Table` to OpenTelemetry's `propagation.TextMapCarrier` interface (`Get`, `Set`, `Keys`). `Get` accepts **both `string` and `[]byte`**: RabbitMQ.Client writes header values as byte arrays, and `amqp091-go` hands those back as `[]byte`. Without that case, `traceparent` would read as empty and every message would start a new, disconnected trace.
2. `internal/consumer/consumer.go` (`Handle`): `otel.GetTextMapPropagator().Extract(ctx, HeaderCarrier(d.Headers))` reads the W3C `traceparent` and `baggage`.
3. A span named `process company.events` with `SpanKindConsumer` starts from that context, so it becomes a child of the publisher's span. It carries `messaging.system=rabbitmq`, `messaging.operation.type=process`, `messaging.destination.name`, `messaging.rabbitmq.destination.routing_key`, and `event.type`.
4. The span's trace ID is stored as the notification's `traceId`, so you can paste it into Grafana (Explore → Tempo) and see the whole path: browser → proxy → employees-service → RabbitMQ → notifications-service.

## Telemetry

- **Traces:** server spans from `otelhttp` (named after the route, e.g. `GET /api/notifications`; health checks are not traced) and consumer spans per message.
- **Metrics:** `company.notifications.received` (counter, attribute `event.type`), plus the HTTP server metrics from `otelhttp`.
- **Logs:** JSON on stdout with `trace_id` and `span_id`, and the same records over OTLP when an endpoint is configured.

## Tests

```sh
go vet ./...
go test -race ./...                                    # unit + handler tests, no Docker needed
go test -tags integration ./internal/consumer/         # real RabbitMQ via Testcontainers (needs Docker)
```

The unit tests cover the store (ordering, eviction, concurrency), the message mapping, the header carrier (`string`, `[]byte`, missing keys, extraction), message handling (ack, nack, trace parentage), and the HTTP handlers with `httptest`.

## Versions

| Component | Version |
| --- | --- |
| Go | 1.27.1 (`golang:1.27.1-alpine` build image) |
| Runtime image | `gcr.io/distroless/static-debian13:nonroot` |
| `github.com/rabbitmq/amqp091-go` | v1.16.0 |
| `go.opentelemetry.io/otel`, `otel/sdk`, `otel/sdk/log`, OTLP trace/metric exporters | v1.47.0 |
| `go.opentelemetry.io/otel/exporters/otlp/otlplog/otlploghttp` | v0.23.0 |
| `go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp` | v0.72.0 |
| `go.opentelemetry.io/contrib/bridges/otelslog` | v0.21.0 |
| `github.com/google/uuid` | v1.6.0 |
| `github.com/testcontainers/testcontainers-go/modules/rabbitmq` (integration tests) | v0.45.0 |

Exact versions of everything, including transitive modules, are pinned in `go.mod` and `go.sum`.
