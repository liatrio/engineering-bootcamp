# Milestones: Build Rules

These are the rules for building `examples/company-app/milestones/`, used together with `SPEC.md`.

## The overlay rule

`starter/` + `milestones/Mn/` = the team's complete, working repository at the end of that milestone's section.

- **Same layout as the repo root.** Each milestone mirrors the repo-root layout (the same layout as `starter/`): `assignments-service/`, `employees-service/`, `projects-service/`, `web/`, `notifications-service/`, `infra/`, `compose.yaml`, and so on.
- **The whole new service.** A milestone holds **the whole `assignments-service/`** as it stands at the end of that milestone. M1 is the exception: it has no service code yet.
- **Changed starter files only.** A milestone also holds **every starter file changed by this milestone or any earlier one**, so milestones are cumulative. Copy the whole changed file, never a patch. Leave out starter files that no milestone up to this one has touched. If a milestone adds a new file to a starter service, such as a new test file, include it. If it deletes one, list it in `DELETED.txt` at the milestone root, one path per line.
- **No generated files.** Never include build output, `node_modules`, `.venv`, `bin/`, `obj/`, `__pycache__`, coverage reports, or test results. Generated contract files under `pacts/` are the exception: include them.
- **CI test.** CI applies each milestone with `rsync -a starter/ tmp/ && rsync -a milestones/Mn/ tmp/` (then removes the paths listed in `DELETED.txt`). It runs every service's tests and lints in `tmp/`, then brings up `docker compose` and runs the E2E tests.

## What each milestone contains

The **Apply** work goes in `assignments-service/`. The **Practice** work changes starter files, and each Practice step closes one of the deliberate gaps listed in `SPEC.md`.

| Milestone | Section | Apply: assignments-service | Practice: starter changes |
| --- | --- | --- | --- |
| **M1-design** | 3.2 | No code. `AGENTS.md` at the repo root (stack, decisions, conventions, planned features table with the Assignments row filled in, following app-dev-forge's `lab-setup-foundations` and `lab-plan-slices`); `docs/assignments-design.md` (slices, endpoints, data, which services it calls, events); `assignments-service/openapi.yaml` (the design sketch) | none |
| **M2-assignments-mvp** | 3.3 | Scaffolded the way `dotnet new webapi --use-controllers` scaffolds it, then built out to `SPEC.md`: CRUD, EF Core + migrations, typed `HttpClient`s with resilience (`Microsoft.Extensions.Http.Resilience`) for Employees and Projects, 400 for unknown IDs, 409 for duplicates, 503 when a dependency is down, publishing `assignment.created` after commit, consuming `employee.deleted`, `/healthz`, `/readyz`, configuration from env, optional `AUTH_TOKEN`, Problem Details, `openapi.yaml`, and a Dockerfile copied from employees with a header comment ("Copied from employees-service; you'll write your own in Chapter 4.4"). **No tests and no OpenTelemetry yet**; those come in M3 and M5. `compose.yaml` adds the `assignments-service` block. | 3.3.2: `?status=` filter on projects. 3.3.3: employees uses an injected `TimeProvider` |
| **M3-tested** | 3.4.1–3.4.7 | `tests/AssignmentsService.Tests`: unit tests; **the allocation and endDate rules, added test-first** (SPEC); fakes for the Employees and Projects clients; component tests (`WebApplicationFactory` + a fake store); integration tests (Testcontainers PostgreSQL); **PactNet 5 consumer tests** for assignments → employees and assignments → projects, with pact files written to `assignments-service/pacts/` (provider states from SPEC); `docs/assignments-test-plan.md` | 3.4.2: projects status-transition rule and its tests. 3.4.3: employees tests use `FakeTimeProvider`. 3.4.4: employees component tests get a fresh store per test, plus a test for DELETE of an unknown ID. 3.4.5: employees integration test for the unique-email constraint. 3.4.6: web Pact test adds the `POST /api/projects` interaction; projects provider verification also verifies `../assignments-service/pacts`; **employees gets a PactNet provider verification test** for `../assignments-service/pacts`. 3.4.7: web Playwright adds create-a-project **and** create-an-assignment journeys |
| **M4-quality-automation** | 3.4.8–3.4.13 | Coverage with a threshold (coverlet), `dotnet format` check, analyzers on (`<AnalysisLevel>latest-recommended</AnalysisLevel>`, `TreatWarningsAsErrors` in CI); repo-root `.github/workflows/ci.yml` with one path-filtered job per service (assignments included) plus an E2E job; `.pre-commit-config.yaml` at the root; `sonar-project.properties` for assignments; `.github/pull_request_template.md` | 3.4.8: projects test for the untested error branch. 3.4.9: projects ruff enables `B` and fixes the B006 finding |
| **M5-observable** | 3.5 | OpenTelemetry like employees-service: traces, metrics, and logs over OTLP; a custom counter `company.assignments.created`; a manual span around validating the employee and the project; trace IDs in logs; publish spans from the RabbitMQ client | 3.5: projects adds a custom counter `company.projects.created` (OpenTelemetry metrics API alongside zero-code). 3.5.3: employees adds a manual span around publishing on DELETE |
| **M6-flagged** | 3.6 | OpenFeature .NET SDK 2.x + flagd provider: `assignment-notifications` (release flag gating the publish), `assignments-writes` (kill switch; off makes POST, PUT, and DELETE return 503), `allocation-check` (fractional rollout on targeting key `X-User-Id`, falling back to the employee ID); the OpenTelemetry hook for flag-evaluation span events; tests using the in-memory provider; `infra/flagd/flags.flagd.json` with all the flags | 3.6: employees ops flag `employee-events` (kill switch on publishing), with a test |

## compose.yaml from M2 on

Add this service, and add `assignments-service` to `frontend-proxy.depends_on`:

```yaml
  assignments-service:
    build: ./assignments-service
    ports: ["5103:8080"]
    environment:
      <<: *otel
      OTEL_SERVICE_NAME: assignments-service
      ConnectionStrings__Default: Host=postgres;Database=assignments;Username=postgres;Password=postgres
      RABBITMQ_URL: amqp://guest:guest@rabbitmq:5672/
      EMPLOYEES_URL: http://employees-service:8080
      PROJECTS_URL: http://projects-service:8000
      FLAGD_HOST: flagd
      SEED_DATA: "false"
      AUTH_TOKEN: ${AUTH_TOKEN:-}
    depends_on:
      postgres: { condition: service_healthy }
      rabbitmq: { condition: service_healthy }
```

## Quality bar

- Each milestone's code is **what a learner following the docs would plausibly end up with**: idiomatic, small, and with comments that explain *why*. Keep it consistent with the employees-service patterns that learners copy.
- Every milestone must pass its own tests and lints when applied with the overlay rule, and the app must work under compose.
