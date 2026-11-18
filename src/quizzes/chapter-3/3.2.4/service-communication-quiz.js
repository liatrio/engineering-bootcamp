const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# Before saving, assignments-service must know that a project exists. Which style of communication fits?

- [x] A synchronous HTTP call to projects-service
  > The service needs the answer to continue, so it asks and waits. "Ask with a request, announce with an event."
- [ ] Publishing a \`project.check\` event and waiting
  > Events don't return answers, and turning one into a request and reply adds a broker without removing the wait.
- [ ] Reading the project from a nightly file export
  > A nightly export is stale for up to a day, so a project created this morning would be rejected.
- [ ] Trusting the ID the web app sends in the body
  > The service would save assignments for projects that don't exist. Each service enforces its own rules.

# RabbitMQ is down when a user creates an employee. What happens in the starter?

- [x] The employee is saved, and the lost event is logged
  > The row is already committed, so failing the request would be a lie. This is the dual-write gap that the outbox pattern fixes.
- [ ] The request fails with 503, and the row is rolled back first
  > Publishing happens after the commit, so there is nothing left to roll back.
- [ ] The event is kept in memory and sent once RabbitMQ is back
  > The starter has no such buffer. A restart would lose it anyway, which is why the outbox stores events in the database.
- [ ] The proxy holds the request until the broker is reachable
  > The proxy only routes HTTP. It knows nothing about RabbitMQ.

# notifications-service was stopped for ten minutes. When it starts again, it shows employees created while it was down. Why?

- [x] Its durable queue kept the messages until it consumed them
  > The \`notifications\` queue is durable and the messages are persistent, so they waited in RabbitMQ.
- [ ] employees-service resent every event it had published
  > Publishers don't track consumers. employees-service doesn't know notifications-service exists.
- [ ] It read the new rows from the employees database on start
  > It has no access to that database. It only learns about employees from events.
- [ ] The web app replayed the requests it made while it was down
  > The web app never talks to notifications-service about employees. It only reads the feed.

# Both employees-service (.NET) and projects-service (Python) return Problem Details. What does that give their clients?

- [x] One error-handling path that works for every service
  > The web app's \`api()\` reads \`status\`, \`title\`, \`detail\`, and \`errors\` the same way, whichever language answered.
- [ ] Error messages that are translated for each user's language
  > Problem Details defines a structure, not translation. The text is whatever the service writes.
- [ ] Automatic retries for every error returned with a 409 status
  > Retrying a conflict gives the same conflict. Retry rules depend on the status code, not the format.
- [ ] Stack traces in the body, so client teams can debug faster
  > The services deliberately never send stack traces; they can leak internals.

# Your team writes \`assignments-service/openapi.yaml\` before any code exists. What is the main benefit?

- [x] Endpoints and status codes get decided while change is cheap
  > A design sketch surfaces disagreements in a pull request instead of in code that already depends on them.
- [ ] The file proves that the web app and the service agree in production
  > OpenAPI says what a provider offers. Contract tests check what each consumer actually relies on.
- [ ] ASP.NET Core generates the controllers and services from the file
  > The team writes the service by hand in 3.3. The sketch guides the code; it doesn't produce it.
- [ ] The proxy reads it to decide which requests to forward to assignments
  > The proxy routes by path prefix in \`nginx.conf\`. It never reads OpenAPI documents.
`;

export { rawQuizdown }
