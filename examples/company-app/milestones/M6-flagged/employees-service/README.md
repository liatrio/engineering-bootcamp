# employees-service

The Company app's Employees API: create, read, update, and delete employees, and announce every change on RabbitMQ. It is a .NET 10 ASP.NET Core service with controllers, EF Core, and PostgreSQL, and it is the example to copy when you build your own .NET service (assignments) later in Chapter 3.

The contract (endpoints, JSON, errors, events, seed data) lives in [`../../SPEC.md`](../../SPEC.md). The committed [`openapi.yaml`](openapi.yaml) describes the HTTP API, and the running service serves the same document at `/openapi/v1.json` (and `/openapi/v1.yaml`).

## Run it

**With the whole app (recommended).** From `starter/`:

```sh
docker compose up --build -d
curl http://localhost:5101/api/employees
```

**On its own with Docker.** Build the image, then point it at a PostgreSQL and a RabbitMQ you already have:

```sh
docker build -t employees-service .
docker run --rm -p 5101:8080 \
  -e ConnectionStrings__Default="Host=host.docker.internal;Port=5433;Database=employees;Username=postgres;Password=postgres" \
  -e RABBITMQ_URL="amqp://guest:guest@host.docker.internal:5672/" \
  employees-service
```

**With the .NET SDK.** Start the compose `postgres` and `rabbitmq` services, then:

```sh
dotnet run --project src/EmployeesService      # uses Properties/launchSettings.json: port 5101
```

On startup the service applies EF Core migrations and, if `SEED_DATA` is on and the table is empty, inserts the three seed employees.

## Environment variables

| Variable | Meaning | Default |
| --- | --- | --- |
| `PORT` | Listen port | `8080` |
| `ConnectionStrings__Default` | PostgreSQL connection string (Npgsql format) | required |
| `RABBITMQ_URL` | RabbitMQ URL | required |
| `SEED_DATA` | Insert seed rows on startup when the table is empty | `true` |
| `ENABLE_PROVIDER_STATES` | Expose `POST /_pact/provider-states` for Pact verification | `false` |
| `AUTH_TOKEN` | When set, `/api/*` needs `Authorization: Bearer <token>` | unset (no auth) |
| `FLAGD_HOST` / `FLAGD_PORT` | flagd, for feature flags. If it can't be reached, flags use their defaults in code. | `flagd` / `8013` |
| `OTEL_SERVICE_NAME` | Service name on telemetry | `employees-service` |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OTLP collector, for example `http://otel-lgtm:4318`. Unset means no export. | unset |
| `OTEL_EXPORTER_OTLP_PROTOCOL` | `http/protobuf` in compose | SDK default |

A missing required variable stops the service at startup with a message naming it.

## Endpoints

| Method and path | Result |
| --- | --- |
| `GET /api/employees?department=` | 200, list ordered by name; `department` is an exact match |
| `GET /api/employees/{id}` | 200, or 404 |
| `POST /api/employees` | 201 with `Location`; 400 invalid; 409 duplicate email (any case) |
| `PUT /api/employees/{id}` | 200; 400, 404, or 409 |
| `DELETE /api/employees/{id}` | 204, or 404 |
| `GET /healthz` | 200 `{"status":"ok"}` while the process is up |
| `GET /readyz` | 200 when PostgreSQL and RabbitMQ are reachable, else 503 |

Errors are RFC 9457 Problem Details (`application/problem+json`). Each change publishes `employee.created`, `employee.updated`, or `employee.deleted` to the `company.events` topic exchange after the database commit.

## Feature flags

`employee-events` (in `../infra/flagd/flags.flagd.json`, default `on`) is an ops kill switch: turn it off and employees are still saved, but `employee.created`, `employee.updated`, and `employee.deleted` are not published. flagd watches the file, so the change takes effect within seconds, without a restart. Flags are read through OpenFeature (`IFeatureClient`); tests use OpenFeature's in-memory provider (`tests/EmployeesService.Tests/Fakes/TestFlags.cs`).

## Tests

.NET is not required on your machine; the SDK image works. From this folder:

```sh
# Unit and component tests (no Docker needed inside)
docker run --rm -v "$PWD":/src -w /src mcr.microsoft.com/dotnet/sdk:10.0.404 \
  dotnet test --filter-not-trait "Category=Integration"

# Everything, including the integration tests, which start PostgreSQL with Testcontainers
docker run --rm -v "$PWD":/src -w /src \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -e TESTCONTAINERS_HOST_OVERRIDE=host.docker.internal \
  mcr.microsoft.com/dotnet/sdk:10.0.404 dotnet test
```

The second command lets Testcontainers inside the SDK container start a sibling PostgreSQL container through your Docker socket. `TESTCONTAINERS_HOST_OVERRIDE` tells it to reach that container through the host, which works on Docker Desktop for macOS and Windows. On Linux, add `--add-host=host.docker.internal:host-gateway`. With the .NET SDK installed locally, plain `dotnet test` works and needs neither setting.

The tests use xUnit v3 on Microsoft.Testing.Platform (opted in by `global.json`), so filters are xUnit options such as `--filter-not-trait` and `--filter-method`, not the older `--filter "Category!=Integration"`.

| Kind | File | What it runs against |
| --- | --- | --- |
| Unit | `Features/Employees/EmployeeServiceTests.cs` | `EmployeeService` alone, with a fresh fake store and fake publisher per test |
| Component | `Features/Employees/EmployeesApiTests.cs` | The whole HTTP pipeline in memory (`ComponentTestApp`), with the store and publisher faked |
| Integration | `Features/Employees/EmployeesDatabaseTests.cs` | The HTTP API over EF Core and a real PostgreSQL 17 (`PostgresTestApp`) |

## A tour of the code

The layout follows app-dev-forge: one folder per feature (a *vertical slice*), and shared foundation code under `Infrastructure/`.

```text
employees-service/
├── EmployeesService.slnx
├── global.json                   SDK version, and the test runner opt-in
├── Dockerfile                    multi-stage build, runs as a non-root user
├── openapi.yaml                  saved copy of /openapi/v1.yaml
├── src/EmployeesService/
│   ├── Program.cs                the foundation's table of contents: registrations, then the pipeline
│   ├── Features/Employees/       everything about employees
│   │   ├── Employee.cs                 the entity
│   │   ├── EmployeeConfiguration.cs    table mapping, including the case-insensitive unique email index
│   │   ├── EmployeeDtos.cs             request (with validation attributes) and response
│   │   ├── EmployeeService.cs          the rules, events, the custom metric, manual spans
│   │   ├── EmployeesController.cs      HTTP only
│   │   ├── IEmployeeStore.cs           the persistence seam (why it exists is explained inside)
│   │   ├── EmployeeStore.cs            EF Core implementation of it
│   │   ├── EmployeeSeed.cs             the fixed seed rows from SPEC.md
│   │   └── ProviderStatesController.cs Pact provider states (off by default)
│   ├── Infrastructure/
│   │   ├── Auth/                 optional bearer-token check for /api/*
│   │   ├── Configuration/        ServiceOptions, bound from environment variables
│   │   ├── Data/                 EmployeesDbContext; migrate and seed on startup
│   │   ├── Errors/               NotFound/Conflict exceptions and the one exception handler
│   │   ├── Health/               /healthz, /readyz, the RabbitMQ check
│   │   ├── Messaging/            IEventPublisher, the envelope, the RabbitMQ connection
│   │   └── Telemetry/            OpenTelemetry setup, our ActivitySource and Meter
│   └── Migrations/               EF Core migrations (committed)
└── tests/EmployeesService.Tests/
    ├── ComponentTestApp.cs       WebApplicationFactory with fakes
    ├── PostgresTestApp.cs        WebApplicationFactory with Testcontainers PostgreSQL
    ├── Fakes/                    InMemoryEmployeeStore, FakeEventPublisher
    └── Features/Employees/       unit, component, and integration tests
```

Follow one request: `EmployeesController` receives it (already validated), calls `EmployeeService`, which applies the rules, saves through `IEmployeeStore`, and publishes through `IEventPublisher`. Anything thrown becomes Problem Details in `GlobalExceptionHandler`.

### Changing the schema

Edit the entity or its configuration, then add a migration. `dotnet restore` comes first because `dotnet-ef` needs the restored project (`obj/project.assets.json`), which a fresh clone doesn't have. The connection string only needs to parse; nothing connects:

```sh
docker run --rm -v "$PWD":/src -w /src/src/EmployeesService \
  -e ConnectionStrings__Default="Host=localhost" -e RABBITMQ_URL="amqp://localhost/" \
  mcr.microsoft.com/dotnet/sdk:10.0.404 bash -c \
  'dotnet restore && dotnet tool install --tool-path /tmp/tools dotnet-ef --version 10.0.15 && /tmp/tools/dotnet-ef migrations add <Name>'
```

### Refreshing openapi.yaml

After changing the API, run the service and save the live document: `curl -s localhost:5101/openapi/v1.yaml > openapi.yaml`.

## Versions

| Component | Version |
| --- | --- |
| .NET SDK / ASP.NET Core runtime images | `sdk:10.0.404` / `aspnet:10.0.15` |
| Microsoft.AspNetCore.OpenApi | 10.0.15 |
| Microsoft.EntityFrameworkCore (+ .Design) | 10.0.15 |
| Microsoft.Extensions.Diagnostics.HealthChecks.EntityFrameworkCore | 10.0.15 |
| Npgsql.EntityFrameworkCore.PostgreSQL | 10.0.3 |
| Npgsql.OpenTelemetry | 10.0.3 |
| RabbitMQ.Client | 7.2.2 |
| OpenFeature, OpenFeature.Hosting / OpenFeature.Providers.Flagd | 2.14.1 / 0.8.0 |
| Microsoft.Extensions.TimeProvider.Testing, PactNet (tests) | 10.11.0, 5.0.1 |
| OpenTelemetry.Extensions.Hosting, .Exporter.OpenTelemetryProtocol | 1.21.0 |
| OpenTelemetry.Instrumentation.AspNetCore, .Http, .Runtime | 1.21.0 |
| xunit.v3 | 4.0.3 |
| Microsoft.AspNetCore.Mvc.Testing | 10.0.15 |
| Testcontainers.PostgreSql | 4.16.0 |
