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

Compose also sets `SEED_DATA=false` (there is no seed data) and `FLAGD_HOST`, used from Chapter 3.6.

## Behaviour

| Request | Result |
| --- | --- |
| `GET /api/assignments?employeeId=&projectId=` | 200; both filters optional |
| `GET /api/assignments/{id}` | 200, or 404 |
| `POST /api/assignments` | 201 with `Location`. 400 for an invalid body or an `employeeId` / `projectId` that doesn't exist (`errors.employeeId`, `errors.projectId`). 409 if that employee is already on that project. 503 if employees-service or projects-service can't answer. |
| `PUT /api/assignments/{id}` | 200; the same checks as `POST`, plus 404 |
| `DELETE /api/assignments/{id}` | 204, or 404 |
| `GET /healthz` / `GET /readyz` | Alive / ready (PostgreSQL and RabbitMQ reachable) |

Events: `assignment.created` (data: the assignment) after each insert commits. The service consumes `employee.deleted` from the durable queue `assignments.employee-deleted` and deletes that employee's assignments.

Calls to the other services go through typed `HttpClient`s (`Infrastructure/Clients/`) with the standard resilience handler: 2 seconds per attempt, 2 retries with backoff, 5 seconds in total, and a circuit breaker.

## Layout

```text
assignments-service/
├── AssignmentsService.slnx
├── Dockerfile                      copied from employees-service
├── openapi.yaml                    saved copy of /openapi/v1.yaml
└── src/AssignmentsService/
    ├── Program.cs
    ├── Features/Assignments/       entity, configuration, DTOs, service, controller, store, employee.deleted consumer
    ├── Infrastructure/
    │   ├── Auth/ Configuration/ Data/ Errors/ Health/ Messaging/   as in employees-service
    │   └── Clients/                typed clients for employees-service and projects-service
    └── Migrations/
```

## Not yet

No tests (Chapter 3.4) and no OpenTelemetry (Chapter 3.5).
