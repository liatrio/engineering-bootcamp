# projects-service

The Projects API for the Company app: create, read, update, and delete projects. It's a Python 3.13 FastAPI service with SQLAlchemy 2 on PostgreSQL. It serves `/api/projects` on port **8000** (host port 5102 in compose). `examples/company-app/SPEC.md` defines the contract, and this README only describes how the service is built.

## Run it

### With the whole app (recommended)

From `examples/company-app/starter/`, run `docker compose up -d`. Then open http://localhost:8080/api/projects through the proxy, or http://localhost:5102/api/projects directly.

### On your machine

You need [uv](https://docs.astral.sh/uv/) and a PostgreSQL database. flagd is optional: without it, every flag uses its default in code.

```bash
uv sync
export DATABASE_URL=postgresql://postgres:postgres@localhost:5433/projects
uv run python -m app            # http://localhost:8000/docs
```

On startup, the service runs the Alembic migrations and inserts the seed rows if the table is empty. In production you would run migrations as a separate step, such as a job or init container, so that replicas never race each other. See `app/db.py`.

### In Docker

```bash
docker build -t projects-service .
docker run --rm -p 5102:8000 \
  -e DATABASE_URL=postgresql://postgres:postgres@host.docker.internal:5433/projects \
  -e OTEL_SDK_DISABLED=true \
  projects-service
```

The image runs as a non-root user (uid 10001) and has no `HEALTHCHECK`, because compose defines health checks. Set `OTEL_SDK_DISABLED=true` when no OTLP collector is running, or the exporter will log connection errors.

## Configuration

All configuration comes from environment variables, read by `app/config.py`.

| Variable | Default | Meaning |
| --- | --- | --- |
| `DATABASE_URL` | required | `postgresql://user:pass@host:5432/projects`. The service adds the psycopg 3 driver itself. |
| `PORT` | `8000` | Listen port |
| `FLAGD_HOST` / `FLAGD_PORT` | `flagd` / `8013` | flagd gRPC (RPC resolver) |
| `SEED_DATA` | `true` | Insert the three seed projects when the table is empty |
| `ENABLE_PROVIDER_STATES` | `false` | Mount `POST /_pact/provider-states`. **It wipes the table, so never enable it in production.** |
| `AUTH_TOKEN` | unset | When set, `/api/*` requires `Authorization: Bearer <token>`. Health and `/_pact` are exempt. |
| `LOG_LEVEL` | `INFO` | Root log level |
| `OTEL_SERVICE_NAME` | `projects-service` (image) | Read by `opentelemetry-instrument` |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | — | For example `http://otel-lgtm:4318` |
| `OTEL_EXPORTER_OTLP_PROTOCOL` | `http/protobuf` (image) | |

## API

| Method and path | Success | Errors |
| --- | --- | --- |
| `GET /api/projects` (optional `?status=planned\|active\|completed`) | 200, list sorted by name | 400 for an unknown status |
| `GET /api/projects/{id}` | 200 | 404 |
| `POST /api/projects` | 201, with `Location` | 400, 409 (duplicate name, case-insensitive) |
| `PUT /api/projects/{id}` | 200 (replaces every writable field) | 400, 404, 409 (duplicate name, or a status move other than `planned` → `active` → `completed`) |
| `DELETE /api/projects/{id}` | 204 | 404 |
| `GET /healthz` | 200 `{"status":"ok"}` | |
| `GET /readyz` | 200 when the database answers | 503 |

`POST` and `PUT` take the same body: `name` (1–100, required), `description` (0–500, default `""`), `startDate` (`YYYY-MM-DD`, required), and `status` (`planned`, `active`, or `completed`; default `planned`). Every error is `application/problem+json`. Validation failures include an `errors` map from field name to messages.

The live document is at `/openapi.json` and `/docs`. The committed copy is `openapi.yaml`. After you change the API, regenerate it with `uv run python scripts/export_openapi.py`. A unit test fails if the committed copy is stale.

### Feature flag

`project-description-required` (boolean, default `off`, in `../infra/flagd/flags.flagd.json`): when it's on, `POST /api/projects` without a non-empty `description` returns 400. flagd watches the file, so edit `defaultVariant` and the next request picks up the change. The provider connects in the background, and if flagd is down the service still starts and uses the default `false`.

## Telemetry

The container's entrypoint is `opentelemetry-instrument python -m app`, which is zero-code instrumentation. The FastAPI, SQLAlchemy, psycopg, and logging instrumentations send traces, metrics, and logs over OTLP/HTTP. Logs on stdout are JSON, and each line carries `trace_id` and `span_id` (`app/logging_config.py`).

**Never run it with `--reload` or several workers.** `opentelemetry-instrument` sets up the SDK and patches libraries in the process it starts. Uvicorn's reloader and its `--workers` start new child processes. Those children either miss the instrumentation or inherit exporter threads that don't survive the fork, and telemetry quietly disappears. To scale, run more containers. For hot reload during development, run `uv run uvicorn app.main:app --reload` without `opentelemetry-instrument`.

## Tests and lint

```bash
uv run pytest            # unit + integration tests, with a coverage gate (80%)
uv run pytest tests/unit --no-cov   # unit tests only, no Docker needed (the coverage gate counts the full suite)
uv run ruff check
```

- `tests/unit/` tests the service layer against the hand-written fakes in `tests/fakes.py`. It also checks schemas, config, and that `openapi.yaml` is current.
- `tests/integration/` is marked `integration`. These tests drive the real app through FastAPI's `TestClient` against PostgreSQL 17, which Testcontainers starts. They need Docker. `tests/conftest.py` points Testcontainers at `/var/run/docker.sock`, which fixes Docker Desktop on macOS. Set `TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE` yourself for Colima or Podman.

The coverage gate lives in `[tool.coverage.report]` in `pyproject.toml`. The gate only works when you run the whole suite, so the unit-only command above may report a coverage failure. ruff runs `E`, `F`, `I`, and `B` (flake8-bugbear, which catches likely bugs such as mutable default arguments).

## Layout

```text
app/
  __main__.py           entry point: logging, then uvicorn (one process)
  main.py               create_app(): lifespan (flags, migrations, seed), routers, error handlers
  config.py             Settings (pydantic-settings)
  models.py             SQLAlchemy model
  schemas.py            Pydantic request/response models (camelCase JSON), ProblemDetails
  errors.py             domain errors + handlers -> Problem Details
  db.py                 engine, per-request session, run_migrations()
  flags.py              OpenFeature + flagd provider behind a small FeatureFlags protocol
  auth.py               optional bearer token
  logging_config.py     JSON logs with trace IDs
  routers/              projects.py, health.py, provider_states.py
  services/             project_service.py (business rules), seed.py
  repositories/         project_repository.py (SQLAlchemy queries)
migrations/             Alembic (env.py + versions/)
scripts/export_openapi.py
tests/                  unit/, integration/, fakes.py
openapi.yaml            committed OpenAPI document
```

## Versions

Python 3.13.15 (`python:3.13.15-slim`) and uv 0.12.19. Runtime dependencies: FastAPI 0.162.7, uvicorn 0.54.0, SQLAlchemy 2.0.57, psycopg 3.3.9, Alembic 1.20.1, pydantic 2.14.3, pydantic-settings 2.16.3, OpenFeature SDK 0.10.0, openfeature-provider-flagd 0.6.1, OpenTelemetry SDK 1.45.2 / instrumentation 0.66b2, and python-json-logger 4.2.0. Dev dependencies: pytest 9.2.0, pytest-cov 7.1.0, testcontainers 4.15.0, httpx2 2.16.0, ruff 0.17.5, and PyYAML 6.0.3. `uv.lock` pins everything else.

SQLAlchemy stays on 2.0.x because `opentelemetry-instrumentation-sqlalchemy` 0.66b2 supports `< 2.1`.
