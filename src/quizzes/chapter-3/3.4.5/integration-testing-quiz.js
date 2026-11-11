const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# Which bug would an integration test catch that a unit test with a test double would miss?

- [x] The database rejects a duplicate key your code tried to save
  > A double only behaves the way you programmed it to. Only the real database enforces its constraints.
- [ ] A validation rule accepts a name that's only whitespace
  > Business rules like this belong in faster unit and component tests.
- [ ] A route returns \`200\` where the spec requires \`201\`
  > A component test with doubles catches this. No real dependency is needed.
- [ ] A refactor breaks a calculation in one of the service's helper functions
  > A unit test catches this without any external system.

# What is a narrow integration test?

- [x] A test of the code that talks to one real external system
  > For example, a repository against a real database, and nothing else.
- [ ] A test of one service with every dependency faked out
  > That's a component test. Integration tests use a real dependency.
- [ ] A test that runs against live versions of every service
  > That's a broad integration test, which behaves much like an end-to-end test.
- [ ] A test that checks a double still behaves like the real thing
  > Fowler calls that a contract test.

# Production runs PostgreSQL. Why is testing your repository against SQLite risky?

- [x] The two differ in SQL syntax, types, and locking
  > A test can pass on one while production fails on the other. Testcontainers can start a real PostgreSQL instead.
- [ ] SQLite can't run inside the same process as tests
  > It can, which is what makes it tempting.
- [ ] SQLite is much slower to start than a container
  > Speed isn't the risk. Behavioral differences are.
- [ ] SQLite tests can't start from a known state
  > You can reset SQLite as easily as any other database.

# Your integration suite is slow because it starts a new database container for every test. What does the page recommend?

- [x] Start containers once per run, and reset state between tests
  > For example, roll back a transaction after each test, or give each test its own data.
- [ ] Start containers once per run, and keep state between tests
  > Tests would then depend on each other and on the order they run in.
- [ ] Swap the container for an in-memory fake in most tests
  > That loses the real-dependency check that the integration test exists for.
- [ ] Move the validation tests into the integration suite
  > Business logic belongs in faster unit and component tests. That would make the suite slower.
`;

export { rawQuizdown }
