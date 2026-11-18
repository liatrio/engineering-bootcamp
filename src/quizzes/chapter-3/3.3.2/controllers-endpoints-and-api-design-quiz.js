const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# A client creates an assignment for Ada on Platform Modernization, but Ada is already on that project. Which status code fits?

- [x] 409 Conflict
  > The request is well formed and could succeed, but it clashes with data that already exists.
- [ ] 400 Bad Request
  > 400 is for requests that could never succeed as written, such as a missing field or an allocation of 0.
- [ ] 404 Not Found
  > 404 means the resource in the path doesn't exist. Both the employee and the project exist here.
- [ ] 500 Internal Server Error
  > Nothing went wrong in the server. A duplicate is an expected outcome with its own status code.

# A teammate wants the controller to catch \`ConflictException\` and return \`Conflict()\`. Why does the Company app not do that?

- [x] One handler maps all exceptions, so errors stay consistent
  > \`GlobalExceptionHandler\` is the only place that turns exceptions into status codes, so every endpoint returns the same Problem Details shape.
- [ ] ASP.NET Core can't catch exceptions inside controller actions
  > It can. The choice is about keeping one mapping in one place, not about what the framework allows.
- [ ] \`Conflict()\` returns a 400 instead of a 409 in ASP.NET Core
  > \`Conflict()\` does return 409. The problem is duplicating error handling in every controller.
- [ ] Catching exceptions makes the controller too slow under load
  > The cost of a try/catch is negligible here. The concern is design, not speed.

# \`AllocationPercent\` is declared as \`int?\` with \`[Required, Range(1, 100)]\`. What would change if it were a plain \`int\`?

- [x] A missing field would become 0 and fail with a range error
  > A non-nullable int defaults to 0, so \`[Required]\` can never fire. The client gets a confusing range message instead of "required".
- [ ] The service would fail to compile because Range needs a nullable type
  > \`[Range]\` works on plain ints. The difference shows up at runtime, in the error the client sees.
- [ ] A missing field would be rejected as required, exactly as before
  > That's the misconception the nullable type fixes: a missing value type is filled with its default, which satisfies \`[Required]\`.
- [ ] The JSON would use \`AllocationPercent\` instead of \`allocationPercent\`
  > Casing comes from the JSON serializer settings, not from whether the type is nullable.

# Where should the filter for "assignments of one employee" go in the API?

- [x] \`GET /api/assignments?employeeId={id}\`
  > It narrows a collection, so it's a query parameter. The resource stays the same.
- [ ] \`GET /api/assignments/{employeeId}\`
  > The path segment after the collection identifies one assignment. An employee ID there would be read as an assignment ID.
- [ ] \`POST /api/assignments/search\` with the ID in the body
  > A read that changes nothing should be a GET. Searching with POST also loses caching and readable URLs.
- [ ] \`GET /api/getAssignmentsByEmployee?id={id}\`
  > URLs name resources, and the HTTP method is the verb. This invents a new URL for every query.

# Why does the Company app commit \`openapi.yaml\` even though the service serves the document live?

- [x] API changes show up in pull request diffs for reviewers
  > Reviewers, Backstage, and client generators can read the contract without running the service.
- [ ] The service reads the file at startup to configure its routes
  > The routes come from the controllers. The document is generated from them, not the other way around.
- [ ] The proxy needs the file to know which paths to forward
  > The proxy routes by path prefix in \`nginx.conf\`. It never reads OpenAPI documents.
- [ ] The live document only works while the app runs in Development
  > The Company app maps OpenAPI in every environment. The committed copy is for people and tools that don't run the service.
`;

export { rawQuizdown }
