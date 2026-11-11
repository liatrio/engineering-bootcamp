const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# What separates a component test from an integration test?

- [x] Whether the dependencies outside the component are real
  > A component test replaces them with test doubles. An integration test uses a real one, such as a database.
- [ ] Whether the test drives the code through its interface
  > Both can drive a public interface. The difference is the dependencies.
- [ ] Whether more than one unit runs during the test
  > Both exercise many units working together.
- [ ] Whether the test runs inside the same process
  > Integration tests can run in-process too. What matters is whether the dependency is real.

# Why should a component test drive a web service through its HTTP endpoints rather than its internal classes?

- [x] Internal classes can change without breaking the tests
  > The tests drive the component the way real callers do, so they survive refactoring.
- [ ] It removes the need for any test doubles in the test
  > Dependencies outside the component are still replaced with doubles.
- [ ] HTTP requests run faster than calling the class methods directly
  > They don't. The benefit is stability, not speed.
- [ ] It exercises the real database behind the service
  > The database is outside the component, so a component test replaces it.

# In a component test of a web service, which of these should you replace with test doubles? Select all that apply.

- [x] The database the service stores users in
  > It's outside the component.
- [x] A payment service it calls over HTTP
  > It's outside the component.
- [ ] The service's own request validation
  > The component's own layers run for real. That's where bugs in how units fit together hide.
- [ ] The service's own JSON serialization
  > Serialization is part of the component and should run for real.

# Your component tests pass when run one at a time but fail when the whole suite runs. What is the most likely cause?

- [x] State shared between tests, so the run order matters
  > Each test should start from a known state.
- [ ] Test doubles that don't behave like the real service
  > That would make tests fail (or pass) consistently, not only when run together.
- [ ] Tests that check internal methods, not behavior
  > That makes tests brittle under refactoring, not order-dependent.
- [ ] A suite too large to run in a single process
  > Size alone doesn't make one test's result depend on another.
`;

export { rawQuizdown }
