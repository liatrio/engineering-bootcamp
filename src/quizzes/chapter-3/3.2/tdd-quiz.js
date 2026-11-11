const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# In the red, green, refactor cycle, what do you do first?

- [x] Write a test for the next small piece of behavior and watch it fail
  > Red comes first. Seeing the test fail proves it can fail, and that it fails for the reason you expect.
- [ ] Write the simplest code that could possibly work
  > That's the green step, which comes after you have a failing test.
- [ ] Clean up the code around the area you're about to change
  > That's the refactor step, done once the tests are passing.
- [ ] Write tests for every scenario on your test list
  > Kent Beck warns against this. Turn one item at a time into a test, because each test you make pass can change how you approach the next.

# A test you just wrote passes the first time you run it, before you've written any code. What should you suspect?

- [x] The test may not be testing anything
  > A test you've never seen fail gives no evidence it can catch a bug. Check that it fails when the behavior is missing.
- [ ] The feature was simple enough not to need code
  > If the behavior didn't exist yet, a correct test should have failed.
- [ ] You've finished the green step early and can move on
  > Green means making a *failing* test pass. A test that never failed skipped red.
- [ ] Nothing: a passing test is always a good sign
  > A passing test only means something if it could have failed.

# According to Martin Fowler, what is the most common way to get TDD wrong?

- [x] Skipping the refactor step
  > Without refactoring, the code works but its design gets steadily worse.
- [ ] Writing tests that are too small
  > Small steps are encouraged. Taking steps that are too *big* is the pitfall.
- [ ] Running the tests too often
  > Fast, frequent feedback is the point of TDD.
- [ ] Writing the test before the code
  > That is TDD itself, not a mistake.

# Your tests break every time you rename a private helper function, even though the behavior hasn't changed. What is the likely cause?

- [x] The tests check implementation details instead of behavior through the public interface
  > Tests that assert *how* the code works break whenever you refactor. Test *what* it does.
- [ ] The tests aren't run often enough
  > Running them less often would only hide the breakage for longer.
- [ ] The tests were written before the code
  > Test-first doesn't cause this. What the tests assert does.
- [ ] Private functions should have more tests
  > More tests on internals would make the problem worse.

# You need to try an unfamiliar library before you know how to use it. What does the page recommend?

- [x] A time-boxed spike without tests, thrown away once you've learned enough, then building the real thing test-first
  > TDD works best when you know the behavior you want. A spike is faster for exploring, but its code shouldn't become the implementation.
- [ ] Write the tests against the library's internals first
  > That tests implementation details and doesn't help you learn how to use the library.
- [ ] Skip tests for any code that uses the library
  > After the spike, the real implementation is built test-first like everything else.
- [ ] Keep the spike code and add tests to it afterwards
  > The spike is thrown away. Tests written after the fact are easy to skip and tend to mirror the code rather than the behavior.
`;

export { rawQuizdown }
