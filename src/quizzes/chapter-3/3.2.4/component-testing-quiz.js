const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# What separates a component test from an integration test?

- [x] A component test replaces everything outside the component with test doubles; an integration test uses a real dependency
  > Both can exercise many units together. The difference is whether the external dependency is real.
- [ ] A component test checks a single function; an integration test checks a whole service
  > A component test checks many units working together, not a single function.
- [ ] A component test runs in a browser; an integration test runs on a server
  > Neither definition depends on where the test runs.
- [ ] A component test is slower because it starts the whole service
  > Component tests stay in-process with no real dependencies, so they're fast.

# Why should a component test drive the service through its HTTP endpoints rather than calling its internal classes?

- [x] The tests drive the component the way real callers do, so they survive refactoring
  > Internal classes can be renamed and restructured freely as long as the public interface behaves the same.
- [ ] HTTP calls are faster than function calls
  > They're not. The benefit is stability, not speed.
- [ ] Internal classes can't be imported from test code
  > They usually can. Doing so ties the tests to implementation details.
- [ ] It removes the need for test doubles
  > Dependencies outside the component are still replaced with doubles.

# In a component test of a web service, which of these should you replace with test doubles? Select all that apply.

- [x] The database
  > It's outside the component.
- [x] Another service the component calls over HTTP
  > It's outside the component.
- [ ] The component's own validation layer
  > The component's own layers run for real. That's where bugs in how units fit together hide.
- [ ] The component's routing
  > Routing is part of the component and should run for real.

# Your component tests pass when run one at a time but fail when the whole suite runs. What is the most likely cause?

- [x] Tests share state, so the results depend on the order they run in
  > Each test should start from a known state.
- [ ] The tests run too fast
  > Speed doesn't cause order-dependent failures.
- [ ] The tests drive the public interface
  > That's good practice and doesn't make tests depend on each other.
- [ ] The test doubles are too simple
  > Simple doubles are fine. Shared state between tests is the problem.
`;

export { rawQuizdown }
