const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# A teammate opens a 1,200-line pull request that adds a feature and refactors the store. What does the page suggest?

- [x] Split it: the refactor and the feature as two pull requests
  > Small pull requests get thorough reviews, and a refactor is easier to check on its own terms.
- [ ] Approve it quickly so the branch doesn't drift from \`main\`
  > Large changes get skimmed and approved, which is the problem the page describes.
- [ ] Ask two reviewers so each of them reads exactly half of the diff
  > Two half-reviews still miss how the parts interact. Splitting the change fixes the cause.
- [ ] Review only the tests and trust the rest of the change
  > Tests matter, but the design and behavior changes need review too.

# You prefer a different loop style in a teammate's code, and it doesn't affect behavior. Which comment fits the page's guidance?

- [x] "nitpick: a \`foreach\` might read more clearly here, your call."
  > The label says it's a matter of taste and doesn't block the merge.
- [ ] "issue (blocking): use a \`foreach\`, the loop is written wrong."
  > Calling a style preference blocking makes the author fix something that isn't a problem.
- [ ] "You always write loops like this, please change your habit."
  > The comment is about the developer, not the code.
- [ ] "Changed it to a \`foreach\` myself and pushed it to your branch."
  > Pushing to someone else's branch without asking skips the conversation the review is for.

# CI, the linters, and SonarQube all pass on a pull request. Where should the reviewer spend most attention?

- [x] Whether the change does what the issue asked, and fits the design
  > Tools already check style, formatting, and coverage. People judge intent and design.
- [ ] Indentation, import order, and the length of each line
  > The formatter and linters already enforce these.
- [ ] Whether coverage reaches the 80% gate on every changed file
  > The coverage gate already runs in CI.
- [ ] Re-running the whole test suite locally to confirm CI's green result
  > CI already ran it on a clean machine. Spot-checking a test is useful; repeating all of it isn't.

# The team turns on "Dismiss stale pull request approvals when new commits are pushed". What problem does it prevent?

- [x] Merging code that nobody reviewed after an approval
  > Any push after an approval needs a new one, so the merged code is the reviewed code.
- [ ] Reviewers approving their own pull requests by mistake
  > Self-approval is prevented by GitHub itself, not by this setting.
- [ ] Pull requests staying open for too long without review
  > The setting doesn't affect how fast anyone reviews.
- [ ] Merging while a required CI check is still failing
  > Required status checks handle that. This setting is about approvals.

# What is the main benefit of a pull request template?

- [x] Every author answers the same questions before review
  > What and why, how to check it, and the checklist items reviewers always ask about.
- [ ] GitHub blocks the merge until every checklist box is ticked
  > Checkboxes in a template are not enforced. They're prompts for the author.
- [ ] It replaces the need for a linked issue or ticket
  > The template asks for the issue link; it doesn't replace it.
- [ ] It assigns a reviewer from the team automatically
  > Templates fill in the description. Code owners or settings assign reviewers.
`;

export { rawQuizdown }
