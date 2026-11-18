const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# A test needs \`ExistsAsync\` to return \`true\` for any ID, and checks nothing about how it was called. Which kind of double is that?

- [x] A stub, which returns canned answers
  > It answers the calls the test makes with fixed values, and records nothing.
- [ ] A spy, which records the calls it gets
  > A spy also keeps a record of its calls for the test to check afterwards. This one doesn't.
- [ ] A fake, a simplified working version
  > A fake has real behavior, such as a set of known IDs. Answering \`true\` to everything is a canned reply.
- [ ] A dummy, passed in but never used at all
  > A dummy is never called. This one is called, and its answer matters.

# \`FakeEventPublisher\` sends nothing and keeps every event in \`Published\`, and a test asserts \`employee.created\` is in that list. What style of verification is that?

- [x] Interaction: it checks which call the code made
  > Publishing an event is an outcome only visible as a call, so a spy-style double is the right tool.
- [ ] State: it checks what a method returned
  > The test doesn't look at the return value. It looks at the record of calls.
- [ ] Integration: it checks a real RabbitMQ broker
  > Nothing reaches RabbitMQ. The publisher is a double.
- [ ] Contract: it checks the event's shape for consumers
  > A contract test checks agreement with another service. This only checks a call was made.

# A class calls \`new RabbitMqEventPublisher()\` and \`DateTime.UtcNow\` inside its methods. Why is it hard to give it test doubles?

- [x] It has no seam where a test can hand in a double
  > Doubles need the code to receive its dependencies, which is what dependency injection provides.
- [ ] RabbitMQ clients can't be replaced by any double
  > They can, once the class depends on an interface such as \`IEventPublisher\`.
- [ ] Time values are too unpredictable to fake well
  > \`FakeTimeProvider\` fakes time exactly. The problem is that the class never takes a clock.
- [ ] Mocking libraries only work with abstract classes
  > The Company app uses no mocking library, and doubles work with interfaces too.

# Every unit test using \`InMemoryEmployeeStore\` passes, but production rejects two employees whose emails differ only in case. What went wrong?

- [x] The fake doesn't copy a real database rule
  > A double only behaves as you wrote it. Copy rules like unique keys into fakes, and test the real database too.
- [ ] The tests verified state instead of interactions
  > State checks are fine here. The fake gave them the wrong state to check.
- [ ] Unit tests should have used the real database
  > That makes them slow integration tests. Keep fakes fast but honest, and add integration tests.
- [ ] The fake should have been a mock with expectations
  > A mock set up wrongly would hide the same bug. The issue is fidelity to the real rule.

# A test asserts \`createdAt\` is between two readings of \`DateTime.UtcNow\`. What does switching to \`FakeTimeProvider\` let it do instead?

- [x] Assert the exact timestamp, and advance it
  > The fake clock starts where you set it and only moves when the test calls \`Advance\`.
- [ ] Run faster, because reading the clock is slow
  > Speed isn't the gain. Reading the system clock is cheap; its value just changes.
- [ ] Skip timestamp checks entirely in unit tests
  > The point is to check timestamps precisely, not to stop checking them.
- [ ] Use the time zone of the machine running CI
  > The services store UTC. A fake clock removes the machine's clock from the test.
`;

export { rawQuizdown }
