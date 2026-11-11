const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# In the red, green, refactor cycle, what do you do first?

- [x] Write a test for one small behavior and watch it fail
  > Red comes first. Seeing the test fail proves it can fail, and that it fails for the reason you expect.
- [ ] Write the simplest code that the next behavior on the list needs
  > That's the green step. It comes after you have a failing test.
- [ ] Turn every scenario on your test list into a test
  > Kent Beck warns against this. Turn one item at a time into a test, because each test you make pass can change how you approach the next.
- [ ] Refactor the existing code so the change is easy
  > Refactoring happens once the tests pass, not before you have a failing test.

# A test you just wrote passes the first time you run it, before you've written any code for it. What should you suspect?

- [x] The test may not be checking the behavior at all
  > A test you've never seen fail gives no evidence it can catch a bug. Check that it fails when the behavior is missing.
- [ ] You've reached green early and can start refactoring
  > Green means making a *failing* test pass. A test that never failed skipped red.
- [ ] The step was too small and should be combined
  > Small steps are encouraged. The problem is that the test never failed.
- [ ] The test is too slow to catch the real failure
  > Speed doesn't explain a test passing before the code exists.

# According to Martin Fowler, what is the most common way to get TDD wrong?

- [x] Skipping the refactor step once the tests pass
  > Without refactoring, the code works but its design gets steadily worse.
- [ ] Writing a test list before writing any of the tests
  > Canon TDD starts with a test list. It's turning the *whole* list into tests up front that Beck warns against.
- [ ] Making each test pass with the simplest code
  > That's the green step, done as intended.
- [ ] Testing through the public interface only
  > That's recommended. Testing implementation details is the pitfall.

# Your tests break every time you rename a private helper function, even though the behavior hasn't changed. What is the likely cause?

- [x] The tests check how the code works, not what it does
  > Tests of implementation details break whenever you refactor. Test behavior through the public interface.
- [ ] The tests were written after the code instead of before
  > Test-first doesn't prevent this by itself. What the tests assert does.
- [ ] The refactoring steps are too big to be safe
  > A rename is a small step. The tests shouldn't depend on private names at all.
- [ ] The private helpers don't have tests of their own
  > More tests on internals would make the problem worse.

# You need to try an unfamiliar library before you know how to use it. What does the page recommend?

- [x] A time-boxed spike, thrown away before building test-first
  > TDD works best when you know the behavior you want. A spike is faster for exploring, but its code shouldn't become the implementation.
- [ ] A spike, with tests added afterwards so it can be kept
  > The spike is thrown away. Tests added afterwards tend to mirror the code rather than the behavior.
- [ ] Test-first from the start, with smaller steps than usual
  > When you don't yet know what behavior you want, a spike is often faster.
- [ ] Tests against the library's code before writing your own
  > That tests someone else's implementation details, and doesn't decide your design.
`;

export { rawQuizdown }
