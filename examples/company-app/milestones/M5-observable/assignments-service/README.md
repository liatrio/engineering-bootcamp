# assignments-service

The Company app's Assignments API: which employee works on which project, in what role, and for how much of their time. It is a .NET 10 ASP.NET Core service with controllers, EF Core, and PostgreSQL, built by copying the patterns in `employees-service`.

It is the only service that relates the others: before it saves an assignment it asks employees-service and projects-service whether the IDs exist. The contract is in `SPEC.md`, the design in [`../docs/assignments-design.md`](../docs/assignments-design.md), and the HTTP API in [`openapi.yaml`](openapi.yaml) (live at `/openapi/v1.json` and `/openapi/v1.yaml`).

## Run it

With the whole app, from the repository root:

```sh
docker compose up --build -d
curl http://localhost:5103/api/assignments
```

With the .NET SDK, start the rest of the app with compose, stop the compose copy of this service (`docker compose stop assignments-service`), then:

```sh
dotnet run --project src/AssignmentsService      # Properties/launchSettings.json: port 5103
```

`src/AssignmentsService/AssignmentsService.http` has example requests.

## Environment variables

| Variable | Meaning | Default |
| --- | --- | --- |
| `PORT` | Listen port | `8080` |
| `ConnectionStrings__Default` | PostgreSQL connection string | required |
| `RABBITMQ_URL` | RabbitMQ URL | required |
| `EMPLOYEES_URL` | employees-service base URL | required |
| `PROJECTS_URL` | projects-service base URL | required |
| `AUTH_TOKEN` | When set, `/api/*` needs `Authorization: Bearer <token>`, and calls to the other services send it | unset |
| `OTEL_SERVICE_NAME` | Service name on telemetry | `assignments-service` |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OTLP collector, for example `http://otel-lgtm:4318`; unset means no export | unset |
| `OTEL_EXPORTER_OTLP_PROTOCOL` | `http/protobuf` in compose | SDK default |

Compose also sets `SEED_DATA=false` (there is no seed data) and `FLAGD_HOST`, used from Chapter 3.6.

## Behaviour

| Request | Result |
| --- | --- |
| `GET /api/assignments?employeeId=&projectId=` | 200; both filters optional |
| `GET /api/assignments/{id}` | 200, or 404 |
| `POST /api/assignments` | 201 with `Location`. 400 for an invalid body, an `endDate` that isn't after `startDate` (`errors.endDate`), or an `employeeId` / `projectId` that doesn't exist (`errors.employeeId`, `errors.projectId`). 409 if that employee is already on that project, or if their overlapping assignments would add up to more than 100%. 503 if employees-service or projects-service can't answer. |
| `PUT /api/assignments/{id}` | 200; the same checks as `POST`, plus 404 |
| `DELETE /api/assignments/{id}` | 204, or 404 |
| `GET /healthz` / `GET /readyz` | Alive / ready (PostgreSQL and RabbitMQ reachable) |

Events: `assignment.created` (data: the assignment) after each insert commits. The service consumes `employee.deleted` from the durable queue `assignments.employee-deleted` and deletes that employee's assignments.

Calls to the other services go through typed `HttpClient`s (`Infrastructure/Clients/`) with the standard resilience handler: 2 seconds per attempt, 2 retries with backoff, 5 seconds in total, and a circuit breaker.

## Layout

```text
assignments-service/
├── AssignmentsService.slnx
├── Directory.Build.props           analyzers on; warnings are errors in CI
├── .editorconfig                   code style, checked by dotnet format
├── Dockerfile                      copied from employees-service
├── openapi.yaml                    saved copy of /openapi/v1.yaml
├── pacts/                          consumer contracts, written by the Pact tests
├── tests/AssignmentsService.Tests/ unit, component, integration, and contract tests
└── src/AssignmentsService/
    ├── Program.cs
    ├── Features/Assignments/       entity, configuration, DTOs, service, controller, store, employee.deleted consumer
    ├── Infrastructure/
    │   ├── Auth/ Configuration/ Data/ Errors/ Health/ Messaging/ Telemetry/   as in employees-service
    │   └── Clients/                typed clients for employees-service and projects-service
    └── Migrations/
```

## Tests

```sh
dotnet test                                              # all, needs Docker for Testcontainers
dotnet test --filter-not-trait "Category=Integration"    # no Docker needed
```

Without the .NET SDK, run them in the SDK image (the socket mount and host override let Testcontainers start PostgreSQL next to it; on Linux add `--add-host=host.docker.internal:host-gateway`):

```sh
docker run --rm -v "$PWD":/src -w /src -v /var/run/docker.sock:/var/run/docker.sock \
  -e TESTCONTAINERS_HOST_OVERRIDE=host.docker.internal mcr.microsoft.com/dotnet/sdk:10.0.404 dotnet test
```

CI also enforces a coverage gate, analyzers, and formatting:

```sh
dotnet format --verify-no-changes
dotnet test --coverlet --coverlet-output-format cobertura --coverlet-include "[AssignmentsService]*" \
  --coverlet-exclude-by-file "**/Migrations/*.cs" --coverlet-threshold 80 --coverlet-threshold-type line
```

A missed threshold fails with exit code 14 and only `error: 1` in the summary. Add `--diagnostic --diagnostic-output-directory TestResults/diag` to see "Coverage thresholds not met" in the `.diag` log, and open the Cobertura report to find the uncovered lines.

`Directory.Build.props` turns on the `latest-recommended` analyzers for every project here and makes warnings errors when `CI=true` (as on GitHub Actions). `.editorconfig` holds the code-style rules. Coverage reports land in `TestResults/`.

What each kind of test covers, and why, is in [`../docs/assignments-test-plan.md`](../docs/assignments-test-plan.md). The Pact consumer tests write `pacts/assignments-service-employees-service.json` and `pacts/assignments-service-projects-service.json`. Commit them: employees-service and projects-service verify them in their own test suites.

## Telemetry

The same OpenTelemetry setup as employees-service (`Infrastructure/Telemetry/`): traces, metrics, and logs over OTLP to `OTEL_EXPORTER_OTLP_ENDPOINT` (compose sends them to Grafana at http://localhost:3001).

- **Traces:** ASP.NET Core server spans, `HttpClient` spans for the calls to employees-service and projects-service (which carry `traceparent`, so their spans join the same trace), Npgsql database spans, and RabbitMQ.Client publish and consume spans. One manual span, `validate employee and project`, wraps the two existence checks and records the outcome in `validation.result`.
- **Metrics:** the custom counter `company.assignments.created`, plus ASP.NET Core, `HttpClient`, and runtime metrics.
- **Logs:** JSON on stdout with `TraceId` and `SpanId` in each line's scopes, and the same records over OTLP.

To follow one request, create an assignment in the UI, copy the `traceId` from the Notifications page, and open it in Grafana (Explore → Tempo): web → proxy → assignments-service → employees-service and projects-service → PostgreSQL → RabbitMQ → notifications-service.
