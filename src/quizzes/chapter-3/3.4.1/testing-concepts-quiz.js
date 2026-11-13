const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# A test sends \`POST /users\` with no name to the service running in the test process, with its database replaced by an in-memory fake, and checks for a \`400\` response. What kind of test is it?

- [x] Component test
  > It drives one service through its public interface, with its external dependencies replaced by test doubles.
- [ ] Sociable unit test
  > A sociable unit test checks one unit with its real collaborators. This drives the whole service through HTTP.
- [ ] Narrow integration test
  > An integration test uses a *real* dependency. This database is a fake.
- [ ] End-to-end test
  > An end-to-end test drives the whole deployed application, with its real database and services.

# A team's test suite is mostly manual and UI-driven tests, with few unit tests underneath. What is this shape called, and what usually follows?

- [x] An ice-cream cone; tests run rarely and bugs show up late
  > Fowler notes that UI tests tend to be brittle, expensive to write, and time consuming to run.
- [ ] A testing trophy; most confidence for the least time
  > The trophy is weighted toward integration tests, not manual or UI tests.
- [ ] An inverted pyramid; it suits front-end projects best
  > The page calls this anti-pattern the ice-cream cone, and doesn't recommend it anywhere.
- [ ] A testing honeycomb; it suits microservices architectures best
  > The honeycomb focuses on integration tests, not manual UI testing.

# Which layer is the widest part of Kent C. Dodds' testing trophy?

- [x] Integration
  > Integration tests exercise code the way it's actually used, without the cost of full end-to-end tests.
- [ ] Unit
  > Unit tests are the wide base of the *pyramid*. In the trophy they're a narrow stem.
- [ ] Static
  > Static analysis is the trophy's base, but integration is its widest layer.
- [ ] End-to-end
  > End-to-end is a small cap at the top of the trophy.

# Martin Fowler argues that most of the disagreement between the pyramid and the trophy is about what?

- [x] What the words "unit" and "integration" mean
  > A fast, sociable test the trophy calls "integration" is often what the pyramid calls "unit".
- [ ] How many end-to-end tests a project really needs
  > Both models agree end-to-end tests should be few.
- [ ] Whether static analysis belongs in a suite
  > Both treat static analysis as cheap and worth using.
- [ ] Whether tests should run on every change
  > Both expect most tests to be fast enough to run on every change.

# Your code coverage is 95%, but you suspect the tests wouldn't catch a \`<\` changed to \`<=\`. Which technique checks the quality of the tests themselves?

- [x] Mutation testing
  > It makes small changes to your code and checks that some test fails. A surviving mutant shows a gap coverage can't.
- [ ] Property-based testing
  > It generates many inputs to break a property of your *code*, not to check your existing tests.
- [ ] Fuzz testing
  > Fuzzing looks for crashes and security holes with random inputs, not gaps in your tests.
- [ ] Snapshot testing
  > Snapshot tests catch changes in output, not weaknesses in other tests.
`;

export { rawQuizdown }
