const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# A teammate registers a new \`AllocationCache\` with \`AddSingleton\`. Its constructor takes \`AssignmentsDbContext\`. What happens?

- [x] It would keep the first request's DbContext forever, so .NET refuses it in Development
  > A singleton can't depend on something scoped. Scope validation reports "Cannot consume scoped service ... from singleton".
- [ ] Each request gets a fresh DbContext inside the cache
  > A singleton is constructed once, so its constructor arguments are resolved once too.
- [ ] The container quietly makes the cache scoped to match
  > The container never changes a registration's lifetime. It either builds the graph or reports the problem.
- [ ] It works, because a DbContext is safe to share between threads
  > A DbContext is not thread-safe, and it tracks one request's changes. Sharing one is exactly the bug.

# Why is \`RabbitMqConnection\` registered as a singleton?

- [x] Connections are expensive, and RabbitMQ expects one per process
  > A connection is a TCP connection plus a handshake. Sharing one means it must be safe for concurrent use, which is why it guards its channel.
- [ ] Every request needs its own connection to keep messages apart
  > That would open and close a connection per request, which is slow and is what RabbitMQ asks clients not to do.
- [ ] Singletons are faster to resolve than scoped services
  > The difference in resolve time is negligible. The lifetime follows from who may share the object.
- [ ] The RabbitMQ client throws if it's created more than once
  > The client allows many connections. The choice is about cost and RabbitMQ's guidance, not a client limit.

# \`InMemoryEmployeeStore\` lets tests save two employees with the same email. Which principle does that break?

- [x] Liskov Substitution
  > The interface promises a ConflictException for a taken email. A stand-in that skips it can't replace the real store, and tests that pass prove nothing.
- [ ] Interface Segregation
  > Interface Segregation is about the size of an interface. The problem here is an implementation that doesn't keep the interface's promise.
- [ ] Single Responsibility
  > The fake still has one job. It just does that job differently from the real store.
- [ ] Open/Closed
  > Nothing had to be edited to add the fake. The issue is its behavior once it's substituted.

# A service calls \`DateTime.UtcNow\` directly. What does injecting a \`TimeProvider\` change?

- [x] Tests can set the clock and assert exact timestamps
  > The service asks the injected clock for the time. Production passes the system clock, tests pass a fake one.
- [ ] Timestamps become more precise than \`DateTime.UtcNow\`
  > The system TimeProvider reads the same clock. Precision is unchanged.
- [ ] The service no longer needs to store timestamps in UTC
  > TimeProvider changes where "now" comes from, not which time zone you store.
- [ ] The database can fill in timestamps instead of the service
  > Who generates timestamps is a separate decision. In the Company app the service still sets them.

# Which class in assignments-service needs an interface the least?

- [x] \`AssignmentRequest\`, the DTO bound from the request body
  > A DTO is plain data with no behavior or I/O, so there is nothing a test would replace.
- [ ] \`AssignmentStore\`, which talks to PostgreSQL
  > Storage is I/O. Tests replace it with an in-memory fake, so it sits behind IAssignmentStore.
- [ ] \`EmployeesClient\`, which calls employees-service
  > Another service is a seam: tests and contract tests replace it, so it sits behind IEmployeesClient.
- [ ] \`RabbitMqEventPublisher\`, which talks to RabbitMQ
  > The broker is a seam. Tests swap in a fake publisher through IEventPublisher.
`;

export { rawQuizdown }
