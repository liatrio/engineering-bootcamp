const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# Which bug would an integration test catch that a unit test with a test double would miss?

- [x] The database rejects a duplicate key that your code assumed it would accept
  > A double only behaves the way you programmed it to. Only the real database enforces its constraints.
- [ ] A validation rule allows an empty name
  > Business rules like this belong in faster unit and component tests.
- [ ] A function returns the wrong total for two numbers
  > That's a unit test's job.
- [ ] A variable is misspelled
  > Static analysis catches this instantly, without running anything.

# What is a narrow integration test?

- [x] A test of only the code that talks to one external system, against a real instance of that system
  > For example, a repository against its database, and nothing else.
- [ ] A test that needs live versions of every service
  > That's a broad integration test, which behaves much like an end-to-end test.
- [ ] A test with every dependency replaced by a mock
  > That's a unit or component test.
- [ ] A test that covers only one line of code
  > "Narrow" refers to one external boundary, not one line.

# Production runs PostgreSQL. Why is testing your repository against SQLite risky?

- [x] The two differ in SQL syntax, types, and locking, so a test can pass on one while production fails on the other
  > Use the same technology as production. Testcontainers can start a real PostgreSQL in a throwaway container.
- [ ] SQLite is too slow for tests
  > Speed isn't the issue. Behavioral differences are.
- [ ] SQLite can't run inside a test process
  > It can, which is why it's tempting.
- [ ] There's no risk as long as both use SQL
  > SQL dialects differ enough to hide real bugs.

# Your integration suite is slow because it starts a database container for every test. What does the page recommend?

- [x] Start containers once per test run, and give each test a known starting state
  > For example, roll back a transaction after each test, or give each test its own data.
- [ ] Replace the database with a mock
  > That turns it back into a unit test and loses what the integration test was for.
- [ ] Stop resetting state between tests
  > Tests would then depend on each other and on the order they run in.
- [ ] Move the business-logic tests into the integration suite
  > Business logic belongs in faster unit and component tests. That would make the suite slower.
`;

export { rawQuizdown }
