const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# A team asks you to scale their API from 2 to 10 replicas. What do you most need to know about the application first?

- [x] Whether it keeps session or cache state in memory
  > State held in one replica's memory is invisible to the others, so requests that land on a different replica behave differently.
- [ ] Which web framework and language it is written in
  > The framework rarely decides whether scaling out is safe. Where the state lives does.
- [ ] How many endpoints its OpenAPI document lists
  > The size of the API doesn't change whether replicas can share the work.
- [ ] Whether its container image runs as a non-root user
  > That is a security property worth checking, but it doesn't affect whether the app scales out correctly.

# After a rolling deploy, old and new pods briefly share one database. Which change is most likely to cause an outage?

- [x] A migration drops a column the old version still reads
  > The old pods keep serving traffic during the rollout and fail when the column disappears.
- [ ] A migration adds a nullable column the new version reads
  > The old version ignores a column it doesn't know about, so adding one is backward compatible.
- [ ] The new version logs at a more detailed level than before
  > Noisier logs cost storage, but they don't break requests to the old pods.
- [ ] The new version adds an index to a frequently queried table
  > Building an index can slow writes for a while, but the old version keeps working.

# In the Company app, why does the browser send every request to the frontend-proxy instead of calling each service's port?

- [x] One origin means no CORS setup, and services can move freely
  > The proxy routes /api/<name> to the right service, so the browser never needs to know where each one runs.
- [ ] The proxy validates each request body before a service sees it
  > Validation happens inside each service. The proxy only routes.
- [ ] The proxy merges the responses from all services into one
  > Each request goes to exactly one service. The web app combines data itself.
- [ ] Services refuse any request that doesn't come through the proxy
  > Every service also answers on its own host port, such as 5102 for projects.

# Your team wants an app that one small team will build and run. Requirements are still changing weekly. Which starting point does Martin Fowler's MonolithFirst advice point to?

- [x] A modular monolith, split later along boundaries that hold
  > Fowler observes that most successful microservice systems began as a monolith that got too big and was then broken up.
- [ ] Microservices from day one, so the boundaries are fixed early
  > Boundaries drawn before the domain is understood are usually wrong, and moving them between services is expensive.
- [ ] One service per database table, so each can scale alone
  > Splitting by table produces services that must call each other for almost every request.
- [ ] A monolith that splits once it reaches a set number of endpoints
  > The size of the API isn't the signal. Stable boundaries and real scaling or team needs are.

# A teammate's coding agent generates a new service that works in every local test. What is the most valuable thing you bring to reviewing it?

- [x] Spotting platform risks, such as state kept in memory
  > Generating code is cheap. Judging whether it opens a connection per request or loses state on restart still needs fundamentals.
- [ ] Rewriting it by hand so the team knows it isn't generated
  > Who typed the code doesn't matter. Whether it behaves correctly does.
- [ ] Checking that it follows the agent's default project layout
  > The team's own conventions matter more than any tool's default layout.
- [ ] Confirming the tests pass again on your own machine
  > The tests already pass. The risks are the behaviors those tests don't cover.
`;

export { rawQuizdown }
