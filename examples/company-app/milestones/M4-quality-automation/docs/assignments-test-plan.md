# Assignments test plan

**Status:** written in 3.4, kept current with the code. **Owner:** the team.

What we test in `assignments-service`, at which level, and why there. The
levels follow the test pyramid: many fast tests for rules, fewer slow ones for
wiring and real infrastructure.

## Levels

| Level | File(s) | Runs against | Proves | Speed |
| --- | --- | --- | --- | --- |
| Unit | `Features/Assignments/AssignmentServiceTests.cs` | `AssignmentService` with fakes for the store, both clients, the publisher, and the clock | CRUD rules, 400 / 409 / 503 decisions, events published (or not), exact timestamps | ms |
| Unit, test-first | `Features/Assignments/AssignmentRulesTests.cs` | Same | The allocation rule and the endDate rule, edge cases included | ms |
| Component | `Features/Assignments/AssignmentsApiTests.cs` | The whole HTTP pipeline in memory (`ComponentTestApp`), every edge faked, a fresh app per test | Status codes, Problem Details shape, camelCase `errors`, JSON date format, `Location`, auth | ~100 ms |
| Integration | `Features/Assignments/AssignmentsDatabaseTests.cs` | The app on a real PostgreSQL 17 (Testcontainers) | Migrations apply, mapping round-trips (`date` columns), the unique (employee, project) index, bulk delete | seconds; needs Docker |
| Unit | `Infrastructure/DependencyClientTests.cs` | The typed clients with a stub `HttpMessageHandler` | How 200 / 404 / anything else / connection failures are read; the auth token is forwarded | ms |
| Integration | `Infrastructure/RabbitMqTests.cs` | A real RabbitMQ 4 (Testcontainers) | Published envelopes (persistent JSON, routing key), the `employee.deleted` consumer, the readiness check | seconds; needs Docker |
| Contract (consumer) | `Contracts/EmployeesClientPactTests.cs`, `Contracts/ProjectsClientPactTests.cs` | Our real typed clients against Pact mock servers | What we need from employees-service and projects-service, written to `pacts/` | ms |
| Contract (provider) | in employees-service and projects-service | Their apps, replaying our pact files | They still give us what we need | seconds |
| End to end | `web/e2e/` (Playwright) | The whole app under compose | A person can create an assignment in the UI | tens of seconds |

## The rules and where each is tested

| Rule | Unit | Component | Integration | Contract |
| --- | --- | --- | --- | --- |
| Employee and project must exist (400 per field) | ✓ | ✓ | | ✓ (404 means "missing") |
| A dependency that can't answer gives 503, and nothing is saved | ✓ | ✓ | | |
| One assignment per employee per project (409) | ✓ | ✓ | ✓ (database index) | |
| Overlapping allocations ≤ 100% (409) | ✓ | | | |
| `endDate` after `startDate` (400) | ✓ | | | |
| `assignment.created` published after commit | ✓ | | | |
| `employee.deleted` removes that employee's assignments | ✓ (service) | | ✓ (store, and the consumer on a real broker) | |

## Fakes

- `InMemoryAssignmentStore`: behaves like the table, including the unique pair.
- `FakeEmployeesClient`, `FakeProjectsClient`: a set of known IDs, plus
  `IsDown` to simulate an outage.
- `FakeEventPublisher`: records events.
- `FakeTimeProvider`: a clock that only moves when a test says so.

Fakes are only trustworthy if they behave like the real thing. The integration
and contract tests are what keep them honest.

## How to run

```sh
dotnet test                                              # everything (Docker needed for integration)
dotnet test --filter-not-trait "Category=Integration"    # no Docker
```

Pact files are written in merge mode. If you rename or remove an interaction,
delete `pacts/*.json` and rerun the tests, then commit the regenerated files.

## Quality gates (CI)

- **Coverage:** at least 80% of lines in `AssignmentsService` (migrations
  excluded), measured by coverlet. The gate exists to stop coverage sliding,
  not to chase 100%: untested code shows up in review as a number.
- **Analyzers and style:** `latest-recommended` .NET analyzers and the
  `.editorconfig` rules; warnings are errors in CI.
- **Formatting:** `dotnet format --verify-no-changes`.
- **Pact files:** CI fails if the tests changed them and the change wasn't committed.

## Known gaps

- Unreadable or redelivered `employee.deleted` messages are not tested.
- The resilience settings (timeouts, retries, circuit breaker) are not tested
  directly; stopping employees-service under compose shows the 503.
