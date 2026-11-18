const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# assignments-service needs to know whether an employee exists before saving. Which approach keeps the employees boundary intact?

- [x] Call \`GET /api/employees/{id}\` and treat a 404 as invalid
  > The employees API is the deliberate interface. Its database stays private, so its schema can change freely.
- [ ] Query the \`Employees\` table with a read-only database user
  > Read-only still couples assignments to the employees schema. Renaming a column would break another team's service.
- [ ] Add a foreign key from assignments to the employees database
  > PostgreSQL can't reference a table in another database, and the rule is about ownership even on one server.
- [ ] Copy every employee into assignments once a night with a job
  > A nightly copy is stale for up to a day, and it still reads the employees database directly.

# Grace Hopper is deleted. For a short time, the assignments database still has rows with her ID. What is this called?

- [x] Eventual consistency
  > The services agree once every event has been handled. Until \`employee.deleted\` is processed, the data briefly disagrees.
- [ ] A distributed transaction
  > A distributed transaction would avoid the gap by committing both changes together. The Company app doesn't use one.
- [ ] A dual-write failure
  > A dual write fails when the event is lost after the commit. Here the event exists and simply hasn't been handled yet.
- [ ] A cascading delete
  > A cascading delete happens inside one database, through a foreign key. There is none across services.

# RabbitMQ may deliver the same \`employee.deleted\` event to assignments-service twice. What makes that safe?

- [x] Deleting an employee's assignments is idempotent
  > Running it a second time finds nothing left to delete, so the result is the same as running it once.
- [ ] The publisher sends every event exactly once
  > Brokers such as RabbitMQ guarantee at-least-once delivery, so consumers must cope with repeats.
- [ ] The queue drops a message once anyone has read it
  > A message is removed after it is acknowledged, and a crash before the ack means it is delivered again.
- [ ] The consumer keeps a lock on the employee row
  > assignments-service has no access to the employee row, which lives in another service's database.

# A three-person team is starting a new internal product whose requirements are still settling. Which structure does MonolithFirst point them to?

- [x] One deployable, with strong internal module boundaries
  > A modular monolith keeps boundaries clean while they are still being discovered, and splitting later is a deployment change.
- [ ] One service per entity, each with its own database
  > Splitting by entity before the domain is understood creates chatty services that change together.
- [ ] Separate services for the UI, the logic, and the database
  > That splits by technical layer, not by business boundary, so every feature touches every service.
- [ ] A shared database, with a separate service per team
  > A shared database couples every service to every schema change, which undoes the point of separate services.

# Which of these is a cost of microservices that the Company app's design accepts on purpose?

- [x] A dependency being down can fail assignments' writes
  > Checking IDs over HTTP at write time means writes return 503 when employees or projects is unreachable.
- [ ] Every service must be written in the same language
  > The Company app uses four languages. Independent technology choice is a benefit of services, not a cost.
- [ ] Two services can't run on the same PostgreSQL server
  > They can. The Company app puts one database per service on a single server for convenience.
- [ ] Each service must have its own UI and its own proxy
  > The app has one web UI and one proxy in front of every service.
`;

export { rawQuizdown }
