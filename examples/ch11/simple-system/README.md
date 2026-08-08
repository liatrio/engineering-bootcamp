# Simple System: Task List Application

A minimal 3-component application used in [Chapter 11.3 - System Thinking](../../../docs/11-application-development/11.3-system-thinking.md) as the first target for system analysis. It's intentionally small enough to read end-to-end in a few minutes, so you can focus on learning to *diagram* and *document* architecture rather than on understanding complex business logic.

## What It Does

A web-based task list: add a task, view the list, and toggle a task done/not-done. Nothing more.

## Architecture

Three components, each with a single clear responsibility:

| Component | Responsibility | Technology | Port |
|---|---|---|---|
| **Frontend** | Renders HTML UI, handles form submissions, calls the backend over HTTP | Flask (Python) | 8080 (host) → 5000 (container) |
| **Backend** | Exposes a REST API, owns business logic and data access | Flask (Python) | 5001 |
| **Database** | Persists tasks | SQLite (file, owned by the backend) | n/a |

```text
Browser --> Frontend (Flask) --> Backend API (Flask) --> SQLite
```

> **Note:** The frontend container listens on port 5000 internally (matching the diagrams below), but is published to host port **8080**. On macOS, port 5000 is often already bound by the built-in AirPlay Receiver (ControlCenter), which silently returns `403 Forbidden` instead of a connection error — see [Troubleshooting](#troubleshooting).

The frontend never talks to the database directly — it only knows about the backend's HTTP API. This separation is what you'll be diagramming in Exercise 1.

## Running It

Requires Docker and Docker Compose.

```bash
cd examples/ch11/simple-system
docker compose up --build
```

Once both services report healthy, open <http://localhost:8080> in a browser, or exercise the API directly:

```bash
# View the UI
open http://localhost:8080

# Talk to the backend API directly
curl http://localhost:5001/tasks
curl -X POST http://localhost:5001/tasks -H "Content-Type: application/json" -d '{"title": "Learn system thinking"}'
curl -X POST http://localhost:5001/tasks/1/toggle
```

Stop and clean up:

```bash
docker compose down -v
```

## Troubleshooting

**`curl http://localhost:5000` returns `403 Forbidden` with `Server: AirTunes`**: macOS's built-in AirPlay Receiver (System Settings → General → AirDrop & Handoff) listens on port 5000 by default and will silently intercept the request before Docker ever sees it. This is why the frontend is published on host port **8080** instead of 5000 — use `http://localhost:8080`, or disable AirPlay Receiver if you'd rather free up port 5000.

## Backend API Reference

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Liveness check |
| GET | `/tasks` | List all tasks |
| POST | `/tasks` | Create a task (`{"title": "..."}`) |
| POST | `/tasks/<id>/toggle` | Flip a task's done state |

## Diagrams

PlantUML source for this system's sequence, component, and data flow diagrams lives in [`diagrams/`](diagrams/). Rendered PNGs are embedded in the chapter content at `docs/11-application-development/img11/simple-system-*.png`.
