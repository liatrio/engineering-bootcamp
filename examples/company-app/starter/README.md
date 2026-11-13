# Company App

A small company directory, built as several services in different languages:

| Service | Language | What it does | Run on its own |
| --- | --- | --- | --- |
| [`web`](web/) | React + TypeScript | The UI | http://localhost:8080 (through the proxy) |
| [`employees-service`](employees-service/) | .NET 10 | Employees, publishes `employee.*` events | http://localhost:5101/api/employees |
| [`projects-service`](projects-service/) | Python (FastAPI) | Projects | http://localhost:5102/api/projects |
| [`notifications-service`](notifications-service/) | Go | Listens to events and shows a feed | http://localhost:5104/api/notifications |
| `assignments-service` | .NET 10 | **You build this one** in Chapter 3.3 of the bootcamp | http://localhost:5103/api/assignments |

Supporting pieces, all in [`compose.yaml`](compose.yaml): PostgreSQL (one database per service), RabbitMQ, flagd (feature flags), Grafana's `otel-lgtm` stack (logs, metrics, traces), and an nginx `frontend-proxy` that puts everything behind one address.

## Run it

You need Docker. Then:

```bash
docker compose up --build -d
```

| Open | For |
| --- | --- |
| http://localhost:8080 | The app |
| http://localhost:3001 | Grafana: logs, metrics, traces |
| http://localhost:15672 | RabbitMQ (guest / guest) |

The Assignments page says the service isn't running until you build `assignments-service`. Stop everything with `docker compose down`; add `-v` to also delete the database.

Optional extras:

- `docker compose --profile load up -d load` starts steady background traffic (k6), handy for dashboards.
- `docker compose --profile broker up -d pact-broker` starts a Pact Broker on http://localhost:9292.

## Work on it

Each service's README explains how to run, test, and lint it on its own. To get every toolchain at once (.NET, Python + uv, Go, Node, Docker CLI), open this folder in the [dev container](.devcontainer/devcontainer.json), for example with VS Code's Dev Containers extension or GitHub Codespaces.

Every backend service follows the same conventions: configuration only from environment variables, `/healthz` and `/readyz`, Problem Details errors, a committed `openapi.yaml`, and OpenTelemetry sent to `otel-lgtm`.
