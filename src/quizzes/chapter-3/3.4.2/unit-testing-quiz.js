const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# A unit test creates a service with a real HTTP client that calls a staging API. It passes on your laptop but fails in CI about once a week. What is the best fix?

- [x] Replace the HTTP call with a double
  > Unit tests should run in isolation, so they give the same result on every machine. A double makes the answer predictable.
- [ ] Add retries around the failing assertion
  > Retries hide the flakiness without removing its cause: a dependency the test doesn't control.
- [ ] Move the test to a nightly CI job
  > It still fails at random, just less visibly. Slow, flaky feedback is what discourages people from running tests.
- [ ] Point it at a more reliable API host
  > Any real network call can be slow or down. The unit test still depends on something outside the code under test.

# A test builds a fresh \`EmployeeService\` with fakes, then calls \`CreateAsync\`, then checks the saved email. Which step is the "Act"?

- [x] The single call to \`CreateAsync\`
  > Act is the one method under test. Building the service is Arrange, and checking the email is Assert.
- [ ] Building the service and its fakes
  > That is Arrange: setting up the system under test and its inputs.
- [ ] Checking that the saved email matches
  > That is Assert: checking the result or the one side effect that matters.
- [ ] Reading the saved row back from the store
  > Reading back is part of checking the outcome, so it belongs to Assert.

# You write a new test-first test for the allocation rule, run it, and it passes before you've changed any code. What should you do?

- [x] Break the code briefly and check the test fails
  > A test you've never seen fail may not test anything. Seeing it fail proves it can catch the bug.
- [ ] Delete it, because a passing test adds nothing new
  > Boundary tests, such as "exactly 100% is fine", often pass at once and are still worth keeping.
- [ ] Commit it, since green means the rule already works
  > Green alone doesn't prove the test checks the rule. It may pass for the wrong reason.
- [ ] Rewrite the code until the test turns red again
  > TDD writes code to make tests pass, not fail. Break it only temporarily to check the test.

# After adding the status rule, \`test_update_maps_database_duplicate_to_conflict\` still passes. Why might that be a problem?

- [x] The status rule now raises before the duplicate
  > Both paths raise \`ConflictError\`, so the test passes even if the duplicate handling is never exercised.
- [ ] Unit tests should never expect an exception to be raised
  > Asserting on an exception is a normal and useful unit test, as \`pytest.raises\` shows.
- [ ] The fake repository can't simulate a duplicate write
  > It can: \`fail_next_write_with_duplicate\` makes it fail the way the database would.
- [ ] Passing tests must be rerun against a real database
  > Unit tests use fakes on purpose. The issue is what this test actually exercises.

# Which test name best follows the page's advice on naming?

- [x] \`Update_of_an_unknown_id_throws_not_found\`
  > It names the behavior and the expected outcome, so a failure explains itself.
- [ ] \`Test_update_method_works_correctly_case_3\`
  > "Works correctly" and a case number say nothing about which rule broke.
- [ ] \`UpdateAsync_calls_FindAsync_then_SaveAsync\`
  > This describes implementation steps, so it breaks on refactoring and hides the behavior.
- [ ] \`Update_checks_everything_about_an_employee\`
  > One behavior per test keeps failures precise. "Everything" means many behaviors.
`;

export { rawQuizdown }
