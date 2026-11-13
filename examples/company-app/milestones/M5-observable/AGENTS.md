# Company App

Employees, projects, and who is assigned to what. A React web app in front of
four backend services, each with its own data, talking over HTTP and RabbitMQ.
`assignments-service` is the one we built.

Read this file before changing anything. Humans read it on day one; coding
agents read it on every task. Keep it current: when a decision changes, change
this file in the same pull request.

## Layout

| Path | What it is | Stack |
| --- | --- | --- |
| `employees-service/` | Employees API, `/api/employees`, port 5101 | .NET 10, ASP.NET Core controllers, EF Core, PostgreSQL |
| `projects-service/` | Projects API, `/api/projects`, port 5102 | Python 3.13, FastAPI, SQLAlchemy 2, PostgreSQL |
| `assignments-service/` | Assignments API, `/api/assignments`, port 5103 (**ours**) | .NET 10, same patterns as employees-service |
| `notifications-service/` | Reads every event, serves `/api/notifications`, port 5104 | Go, `net/http`, RabbitMQ |
| `web/` | The UI | React + TypeScript (Vite), TanStack Query |
| `infra/` | Proxy, PostgreSQL init, flagd flags, k6 load script | nginx, flagd, k6 |
| `compose.yaml` | The whole app on one machine: `docker compose up --build -d`, then http://localhost:8080 | Docker Compose |

`SPEC.md` (in the bootcamp repo) is the contract: endpoints, JSON shapes,
errors, events, ports, environment variables, and seed data. When code and the
spec disagree, fix one of them in the same change.

## Foundation decisions

The .NET column applies to `employees-service` and `assignments-service`.
`employees-service` is the reference: when in doubt, do what it does.

| Concern | .NET services | Web | Why |
| --- | --- | --- | --- |
| Routing | Controllers, `[ApiController]`, attribute routes `api/<plural-noun>`; OpenAPI at `/openapi/v1.json`, committed as `openapi.yaml` | One router in `app/router.tsx`; features export routes | Every service serves its full path, so the proxy passes requests through unchanged and a service works the same called directly. |
| Auth | Optional shared bearer token (`AUTH_TOKEN`) checked by middleware on `/api/*`; health and OpenAPI stay open | The API client attaches the token when configured | Off in Chapter 3 so nothing gets in the way of learning; the seam exists for Chapter 7. |
| Validation | Data annotations on request DTOs; `[ApiController]` returns 400 Problem Details with camelCase `errors` keys | react-hook-form + zod | The UI can show each server error next to the right field. |
| Error handling | One `IExceptionHandler`: `NotFoundException` → 404, `ConflictException` → 409, everything else → 500 with no stack trace | One `api()` client throws `ApiError` from Problem Details | Features throw; one place decides the status code, so every error has the same RFC 9457 shape. |
| Data access | One `DbContext` per service, EF Core migrations committed and applied on startup; services use a thin store interface | `api()` + TanStack Query | Each service owns its database. Nobody reads another service's tables; they call its API. |
| Messaging | RabbitMQ topic exchange `company.events`; publish after the database commit through `IEventPublisher` | — | Services learn about changes without calling each other, and tests swap in a fake publisher. |
| Observability & config | Environment variables only, bound with the options pattern; `/healthz` (alive) and `/readyz` (dependencies up); OpenTelemetry over OTLP | `import.meta.env` read once | The same image runs on a laptop, in CI, and in production, with only the environment changing. |
| Testing | xUnit v3 project mirroring `Features/`; unit tests with fakes, component tests with `WebApplicationFactory`, integration tests with Testcontainers PostgreSQL | Vitest + Testing Library; Playwright for journeys | Fast tests for rules, real infrastructure only where fakes would lie. |
| Conventions | `Features/<Name>/` vertical slices; foundation code in `Infrastructure/`; `Async` suffix | `src/features/<name>/` per feature; shared code (API client, telemetry, UI helpers) in `src/lib/`; app shell and router in `src/app/` | A new feature is "copy the closest folder", for people and agents alike. |

## Rules

- Controllers never catch exceptions and never build error responses. Throw
  `NotFoundException`, `ConflictException`, or another exception the handler
  maps, and let `GlobalExceptionHandler` respond.
- Validation of the request shape is data annotations on the DTO. Business
  rules (uniqueness, things that must exist) live in the service.
- Only `Program.cs` and options classes read configuration. No URLs, ports, or
  credentials in code.
- A service never touches another service's database. To know whether an
  employee or project exists, call its API through a typed `HttpClient`.
- Publish events only after `SaveChanges` succeeds, through `IEventPublisher`.
- Every endpoint change updates `openapi.yaml` in the same commit.
- Every feature ships with tests in the mirrored test folder. New business
  rules are written test-first: a failing test, then the code.
- Tests never share mutable state. Each test builds its own fakes or app.
- Inject `TimeProvider` wherever "now" matters; tests use `FakeTimeProvider`.
- A change to what a service returns must keep its provider contract test
  green. If a consumer's pact breaks, talk to that consumer first.
- New .NET code copies `employees-service`: same folder names, same
  foundation classes, same Dockerfile shape.
- Use `docker compose` (v2), never `docker-compose`.
- CI must be green before merging, and nobody merges their own pull request
  without a review. Fix analyzer warnings rather than suppressing them; a
  suppression needs a comment saying why.
- Never commit with `--no-verify` to get past a hook. Fix what it found.
- Business events get a custom metric named `company.<entity>.<event>` (for
  example `company.assignments.created`). Metric attributes stay low
  cardinality: never IDs, emails, or free text.
- Work worth seeing in a trace that isn't already an HTTP, database, or
  messaging span gets a manual span from the service's `ActivitySource`.
- Log through `ILogger` with `[LoggerMessage]` methods and message templates,
  never string concatenation, so fields stay structured and carry the trace ID.

## Commands

| Task | Command |
| --- | --- |
| Run everything | `docker compose up --build -d`, then http://localhost:8080 |
| Rebuild one service | `docker compose up --build -d assignments-service` |
| Logs | `docker compose logs -f assignments-service` |
| Build a .NET service | `dotnet build` in its folder (or the `mcr.microsoft.com/dotnet/sdk:10.0` image) |
| Add an EF Core migration | Once: `dotnet tool install --global dotnet-ef --version 10.0.15`. Then in `src/<Project>/`: `dotnet restore && dotnet ef migrations add <Name>` |
| Test a .NET service | `dotnet test` in its folder; add `--filter-not-trait "Category=Integration"` to skip the Docker-based tests |
| Test projects-service | `uv run pytest` in `projects-service/` |
| Test the web app | `npm test` in `web/`; end to end: `docker compose up -d`, then `npm run test:e2e` |
| Regenerate pact files | `dotnet test` in `assignments-service/` (writes `assignments-service/pacts/`) |
| Coverage gate (assignments) | `dotnet test --coverlet --coverlet-include "[AssignmentsService]*" --coverlet-exclude-by-file "**/Migrations/*.cs" --coverlet-threshold 80 --coverlet-threshold-type line` |
| Format .NET code | `dotnet format` in `assignments-service/` (CI runs `--verify-no-changes`) |
| Pre-commit hooks | `pre-commit install` once, then they run on every commit; `pre-commit run --all-files` to check everything |
| Refresh `openapi.yaml` | `curl -s localhost:5103/openapi/v1.yaml > assignments-service/openapi.yaml` |

## Feature folder template

Every feature is one folder on each side. Copy the closest existing feature.

### API: `<service>/src/<Project>/Features/<Name>/`

| File | Contains |
| --- | --- |
| `<Entity>.cs` | The EF Core entity. Properties only. |
| `<Entity>Configuration.cs` | `IEntityTypeConfiguration<T>`: keys, indexes, constraints. |
| `<Entity>Dtos.cs` | `<Entity>Request` (data annotations) and `<Entity>Response`. |
| `<Entity>Service.cs` | `I<Entity>Service` + implementation: the rules. Throws domain exceptions, publishes events. |
| `<Name>Controller.cs` | Thin. Calls the service, returns the result. |
| `I<Entity>Store.cs`, `<Entity>Store.cs` | The persistence seam and its EF Core implementation. |

Tests: `<service>/tests/<Project>.Tests/Features/<Name>/`: a service test
(unit, with fakes), an API test (component), and a database test (integration).

Wiring: `AddScoped` lines for the service and store in `Program.cs`, a
`DbSet<T>` on the `DbContext`, and a migration.

### UI: `web/src/features/<name>/`

Shared building blocks live in `web/src/lib/`: `api.ts` (the `api()` client), `telemetry.ts`, and `ui/`. Use them; don't add a second copy inside a feature.

| File | Contains |
| --- | --- |
| `api.ts` | One function per endpoint using `api()`, plus query hooks. |
| `types.ts` | Request and response types matching the API. |
| `<Name>Page.tsx`, `<Name>Form.tsx` | Screens. |
| `routes.tsx` | Exported routes. |
| `<Name>Page.test.tsx` | Component test. |

## Planned features

| Feature | Service | What it is | Endpoints |
| --- | --- | --- | --- |
| Employees | employees-service (done) | People: name, email, title, department | `GET /api/employees[?department=]`, `GET /api/employees/{id}`, `POST /api/employees`, `PUT /api/employees/{id}`, `DELETE /api/employees/{id}` |
| Projects | projects-service (done) | Work: name, description, start date, status | `GET /api/projects`, `GET /api/projects/{id}`, `POST /api/projects`, `PUT /api/projects/{id}`, `DELETE /api/projects/{id}` |
| Assignments | assignments-service (done, tested) | An employee working on a project: role, allocation %, start and optional end date | `GET /api/assignments[?employeeId=&projectId=]`, `GET /api/assignments/{id}`, `POST /api/assignments`, `PUT /api/assignments/{id}`, `DELETE /api/assignments/{id}` |

**Assignments rules.** Before saving, the service checks with
employees-service and projects-service that both IDs exist; an unknown one is
a 400 with `errors.employeeId` or `errors.projectId`. If either service is
down, the answer is 503, not a guess. The same employee on the same project
twice is a `ConflictException` (409). It publishes `assignment.created`, and
it consumes `employee.deleted` to remove that employee's assignments. The full
design is in `docs/assignments-design.md`, and the API sketch in
`assignments-service/openapi.yaml`.
