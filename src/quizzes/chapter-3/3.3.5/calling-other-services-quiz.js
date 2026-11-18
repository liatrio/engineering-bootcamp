const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# employees-service answers 404 when assignments-service checks an employee ID. What should assignments return to its own caller?

- [x] 400, with an error on \`employeeId\`
  > The request referred to an employee that doesn't exist, so the caller has to fix it. The assignment itself wasn't "not found".
- [ ] 404, passing the dependency's answer through
  > A 404 would tell the client the assignment URL doesn't exist, which isn't what happened.
- [ ] 503, because a dependency returned an error
  > employees-service answered correctly. 503 is for when it can't answer at all.
- [ ] 201, and save the assignment so it can be fixed later
  > Saving a reference you know is wrong breaks the rule that both IDs must exist.

# projects-service is paused: it accepts connections but never answers. Without any timeout, what happens to assignments-service?

- [x] Requests pile up waiting, until assignments slows down too
  > Each waiting request holds a connection and memory. A hung dependency spreads its failure to every caller with no timeout.
- [ ] Requests fail at once with a refused connection
  > That's what a stopped service does. A paused one keeps the port open, so the connection succeeds and then nothing happens.
- [ ] The circuit breaker opens on the first request and fails fast
  > A circuit breaker opens only after enough failures in its sampling window, and without a timeout nothing ever fails.
- [ ] The proxy notices and routes requests to another projects-service
  > There is only one projects-service, and the proxy isn't in the path between assignments and projects.

# Why does the resilience handler retry a 503 from projects-service but not a 404?

- [x] A 503 may be a passing blip; a 404 will give the same answer again
  > Retries help only with transient failures. Asking again for a missing project just repeats the 404.
- [ ] Retrying a 404 could create a duplicate project in projects-service
  > The check is a GET, which creates nothing. The reason is that a 404 won't change by itself.
- [ ] The HTTP standard forbids clients from repeating a request that got a 404
  > Clients may repeat any GET. The handler simply knows it would be pointless.
- [ ] A 404 means the circuit breaker is open, so retrying is blocked
  > An open circuit fails calls without sending them. A 404 is a real answer from the service.

# Why is \`projects-service\` left out of assignments-service's \`/readyz\`?

- [x] If it were in, a projects outage would also stop reads that don't need it
  > Unready means no traffic at all. Leaving it out keeps listing and deleting assignments working, while creates get a clear 503.
- [ ] Health checks can't make HTTP calls to other services
  > A health check can run any code, including an HTTP call. Leaving it out is a design decision.
- [ ] projects-service has no \`/readyz\` endpoint for assignments to call
  > Every Company app service has \`/readyz\`. The question is whether assignments should depend on it.
- [ ] The resilience handler already makes the service unready when projects fails
  > The resilience handler shapes individual calls. It never changes the service's readiness.

# A teammate suggests giving each typed client a static \`HttpClient\` created once with \`new\`. What goes wrong?

- [x] Its connections live forever and miss DNS changes
  > IHttpClientFactory recycles handlers so connections pick up new addresses. A static client never does.
- [ ] It opens a new socket for every request until the machine runs out
  > That's the bug of creating an HttpClient per call. A static one reuses its connections, too long.
- [ ] Static clients can't send JSON bodies or custom headers
  > A static client can send anything. The problem is how long its connections live.
- [ ] The compiler rejects static fields inside classes registered for DI
  > Static fields compile fine in any class. The issue only shows at runtime, when addresses change.
`;

export { rawQuizdown }
