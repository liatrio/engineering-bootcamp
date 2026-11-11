const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# Which journeys belong in an end-to-end suite?

- [x] A few critical journeys, such as signing up, logging in, and checking out
  > Keep the suite small and push everything else down to faster tests.
- [ ] Every edge case of every form
  > Edge cases are cheaper and more reliable to test lower down.
- [ ] Every validation rule
  > Validation rules belong in unit and component tests.
- [ ] Only journeys that have never had a bug
  > The choice is based on importance, not bug history.

# A test waits 3 seconds for a page to load before it clicks a button. It fails now and then on a busy CI server. What should you change?

- [x] Wait for the page to reach the expected state instead of sleeping for a fixed time
  > Fixed sleeps are the most common cause of flaky tests.
- [ ] Increase the sleep to 10 seconds
  > That makes the test slower and still fails when the server is slow enough.
- [ ] Retry the test automatically until it passes
  > That hides the flakiness rather than fixing it.
- [ ] Remove the test
  > A flaky critical journey is worth fixing, not deleting.

# How should an end-to-end test find the elements it interacts with?

- [x] By role, label, or test ID
  > These survive cosmetic changes to the page.
- [ ] By CSS layout, such as the third \`div\` inside the header
  > Layout selectors break whenever the design changes.
- [ ] By the element's screen coordinates
  > Coordinates change with screen size and layout.
- [ ] By the text of the surrounding paragraph
  > Surrounding text changes often and isn't tied to the element.

# Why are end-to-end test failures hard to debug?

- [x] A failure could come from any part of the system, or from the environment itself
  > That's the cost of testing everything together.
- [ ] End-to-end tests don't produce error messages
  > They do. The hard part is finding which part of the system caused the failure.
- [ ] End-to-end tests can only be run manually
  > Tools like Selenium automate them.
- [ ] End-to-end tests use test doubles that hide errors
  > End-to-end tests run against the real, fully deployed system.
`;

export { rawQuizdown }
