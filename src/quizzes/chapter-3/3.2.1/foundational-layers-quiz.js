const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# A new endpoint in employees-service must return 404 when an employee doesn't exist. Following the starter's foundation, what does the feature code do?

- [x] Throw \`NotFoundException\` and let the handler respond
  > \`GlobalExceptionHandler\` is the one place that maps exceptions to status codes, so every 404 has the same Problem Details shape.
- [ ] Check for the row in the controller and return \`NotFound()\`
  > That works once, but it starts a second way of producing errors. Controllers in the starter never build error responses.
- [ ] Return \`null\` from the service and check for it in the controller
  > That pushes an HTTP decision into every controller, which is what the foundation exists to avoid.
- [ ] Add a status code check to \`GlobalExceptionHandler\` for this route
  > The handler must never know about a specific feature. It maps exception types, not routes.

# A request to \`POST /api/employees\` has an invalid email. Which part of employees-service rejects it?

- [x] \`[ApiController]\`, from the annotations on the DTO
  > The framework validates the body before the action runs and returns a 400 Problem Details with an \`errors\` map.
- [ ] \`EmployeeService\`, which checks it before saving
  > The service owns business rules such as uniqueness. Shape checks like a valid email happen before it is called.
- [ ] The unique index on the email column in PostgreSQL
  > The index enforces uniqueness, not format. An invalid email never gets that far.
- [ ] \`GlobalExceptionHandler\`, when the email fails to parse
  > The handler turns thrown exceptions into responses. Validation failures don't throw.

# employees-service validates its settings with \`ValidateOnStart()\`. What does that buy you on a platform?

- [x] A missing variable fails the deploy, not later traffic
  > A failed start shows up at deploy time, where a rollout can stop, instead of as errors in production later.
- [ ] Settings reload automatically when a variable changes
  > Environment variables are read when the process starts. Changing them needs a restart either way.
- [ ] Secrets stay encrypted in memory once they are checked
  > Validation checks that values are present and well-formed. It doesn't protect them.
- [ ] Replicas compare their settings with each other at start
  > Each process validates only its own configuration.

# Both the .NET and Python services return 400 Problem Details with an \`errors\` map for a bad body. Why does the web app depend on this?

- [x] One \`ApiError\` type can map messages onto form fields
  > Because every service uses the same error contract, the UI handles errors once, in \`src/lib/api.ts\`, for all of them.
- [ ] TanStack Query only retries requests that fail with Problem Details
  > The retry rules in \`providers.tsx\` look at the status code, not the body format.
- [ ] Browsers refuse to read error bodies that aren't Problem Details
  > Browsers read any body. The shared shape is a contract the team chose.
- [ ] The proxy rewrites non-standard errors into Problem Details first
  > The proxy only routes. Each service produces its own Problem Details.

# Your team is about to add a cache. Only one feature needs it today. Where should the code go?

- [x] In that feature's folder, promoted when a second feature needs it
  > Abstractions built from one example are usually wrong. A second use shows what the shared version really needs.
- [ ] In \`Infrastructure/\` now, so every future feature can reuse it
  > Building a generic helper for one caller usually produces the wrong abstraction.
- [ ] In a separate shared library, versioned so other services can adopt it too
  > That adds the cost of a library before anyone knows whether the cache is right.
- [ ] Nowhere until most features need it, so the foundation stays small
  > Leaving out what one feature needs today only delays the work that feature is blocked on.
`;

export { rawQuizdown }
