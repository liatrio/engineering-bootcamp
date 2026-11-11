const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# A test sends \`POST /users\` with no name to the service running in the test process, with its database replaced by an in-memory fake, and checks for a \`400\` response. What kind of test is it?

- [x] Component test
  > It drives one service through its public interface, with its external dependencies replaced by test doubles.
- [ ] Unit test
  > It exercises routing, validation, and serialization together, not a single function or class.
- [ ] Integration test
  > An integration test uses a *real* dependency, such as a real database.
- [ ] End-to-end test
  > An end-to-end test drives the whole deployed application, with its real database and services.

# A team's test suite is mostly manual and UI-driven tests, with few unit tests underneath. What is this shape called, and what is the usual consequence?

- [x] The ice-cream cone; tests are slow and brittle, so they're run rarely and bugs are found late
  > Fowler notes that UI tests tend to be brittle, expensive to write, and time consuming to run.
- [ ] The testing trophy; the team gets the most confidence for the least time
  > The trophy is weighted toward integration tests, not manual or UI tests.
- [ ] The testing pyramid; feedback is fast on every change
  > The pyramid has *many* unit tests at the base, the opposite of this suite.
- [ ] The honeycomb; it suits microservices well
  > The honeycomb focuses on integration tests, not manual UI testing.

# Which layer is the widest part of Kent C. Dodds' testing trophy?

- [x] Integration
  > Integration tests exercise code the way it's actually used, without the cost of full end-to-end tests.
- [ ] Unit
  > Unit tests are a narrow stem in the trophy.
- [ ] Static
  > Static analysis is the base, but integration is the widest layer.
- [ ] End-to-end
  > End-to-end is a small cap at the top.

# Martin Fowler argues that most of the disagreement between the pyramid and the trophy is about what?

- [x] Vocabulary: a fast, sociable test the trophy calls "integration" is often what the pyramid calls "unit"
  > When someone talks about unit or integration tests, ask what they mean by the words.
- [ ] Whether end-to-end tests should be the largest group
  > Both models agree end-to-end tests should be few.
- [ ] Whether tests should run in CI
  > Both expect most tests to be fast enough to run on every change, locally and in CI.
- [ ] Whether static analysis is worth using
  > Both treat static analysis as cheap and worth using.

# Your code coverage is 95%, but you suspect the tests wouldn't catch a \`<\` changed to \`<=\`. Which technique checks the quality of the tests themselves?

- [x] Mutation testing
  > It makes small changes to your code and checks that some test fails. A surviving mutant shows a gap coverage can't.
- [ ] Fuzz testing
  > Fuzzing looks for crashes and security holes with random inputs, not gaps in your tests.
- [ ] Load testing
  > Load testing measures behavior under traffic.
- [ ] Snapshot testing
  > Snapshot tests catch changes in output, not weaknesses in other tests.
`;

export { rawQuizdown }
