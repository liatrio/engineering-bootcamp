const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# Which journeys belong in an end-to-end suite?

- [x] A few critical journeys, such as sign-up and checkout
  > Keep the suite small and push everything else down to faster tests.
- [ ] Every journey a user can take, so that no regression slips through
  > Covering everything end to end makes the suite slow, brittle, and hard to debug.
- [ ] Every form's validation rules, as users see them
  > Validation rules are cheaper and more reliable to test lower down.
- [ ] The journeys most likely to change in each release
  > Choose by importance to users. Journeys that change often make for brittle tests.

# A test waits 3 seconds for a page to load before it clicks a button. It fails now and then on a busy CI server. What should you change?

- [x] Wait for the page to reach the expected state instead
  > Fixed sleeps are the most common cause of flaky tests.
- [ ] Raise the wait to 10 seconds to allow for slow servers
  > That makes every run slower, and still fails when the server is slow enough.
- [ ] Retry failed tests automatically up to three times
  > Retries hide the flakiness rather than fixing its cause.
- [ ] Move the test to run only on a dedicated CI server
  > Any server can be slow sometimes. The fixed wait is the problem.

# How should an end-to-end test find the elements it interacts with?

- [x] By role, label, or test ID
  > These survive cosmetic changes to the page.
- [ ] By CSS class names
  > Classes change with styling, so tests break on cosmetic changes.
- [ ] By position in the page layout
  > Layout changes whenever the design changes.
- [ ] By XPath from the document root
  > A full path breaks when anything above the element moves.

# Why are end-to-end test failures hard to debug?

- [x] The cause could be anywhere in the system or its environment
  > That's the cost of testing everything together.
- [ ] They use test doubles that can hide the real error
  > End-to-end tests run against the real, fully deployed system.
- [ ] They only report a pass or fail, with no details
  > They report errors. The hard part is finding which part of the system caused them.
- [ ] They run too fast to see what the browser was doing when they failed
  > End-to-end tests are the slowest kind, not the fastest.
`;

export { rawQuizdown }
