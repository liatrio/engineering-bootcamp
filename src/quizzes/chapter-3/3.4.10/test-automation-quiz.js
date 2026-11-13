const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# A pull request changes only \`web/\`. The \`employees\` job, which is required by the ruleset, is skipped by its path filter. Can the pull request merge?

- [x] Yes, a job skipped by its condition counts as passing
  > A job skipped through \`if:\` reports success, so required checks still work with path filters.
- [ ] No, every required check must actually run and pass first
  > Skipped jobs satisfy required checks; otherwise path filtering and branch rules couldn't be combined.
- [ ] Only after someone reruns the skipped job by hand
  > No rerun is needed: the skip itself reports a passing status.
- [ ] Only if an admin bypasses the ruleset to merge it
  > No bypass is needed, because the skipped job counts as passing.

# Why does the \`e2e\` job run on every pull request, with no path filter?

- [x] A change in one service can break a journey across several
  > Only the end-to-end job exercises the whole app together, so it runs whatever changed.
- [ ] Path filters can't be used on jobs that start Docker
  > Path filters work on any job. Leaving it unfiltered is a choice about safety.
- [ ] Playwright refuses to start when a path filter skipped a job
  > Playwright knows nothing about other jobs. The choice is about what could break.
- [ ] It's the fastest job, so filtering it gains nothing
  > It's the slowest job. It runs anyway because nothing else tests the services together.

# Why does the workflow use \`actions/checkout@3d3c42e... # v7.0.1\` instead of \`actions/checkout@v7\`?

- [x] A tag can be moved to other code, a commit SHA can't
  > Pinning to a SHA means the code that runs is the code you reviewed, even if a tag is moved.
- [ ] GitHub no longer supports version tags for actions
  > Tags still work. They're mutable, which is the risk the page describes.
- [ ] SHAs download faster than version tags on GitHub runners
  > Download speed is the same. The reason is that a SHA can't change.
- [ ] The comment is what tells the runner which version
  > The runner ignores the comment. It's there so people can read the version.

# In the \`assignments\` job, the last test step runs \`git diff --exit-code -- pacts/\`. What does a failure mean?

- [x] The tests rewrote a pact file nobody committed
  > The contract changed, and the providers' CI hasn't verified the new version.
- [ ] A provider failed to verify the consumer pacts
  > Provider verification runs in the employees and projects jobs, not here.
- [ ] The pacts folder is missing from the repository
  > A missing folder produces new untracked files, not a diff on committed ones.
- [ ] Someone edited a pact file by hand on main
  > Hand edits that were committed show no diff. The check compares the tests' output with the commit.

# In the Practice, a test fails on a pull request. What stops the pull request from merging?

- [x] The ruleset makes the \`projects\` check required
  > A required status check keeps the Merge button disabled until that check passes.
- [ ] GitHub Actions blocks merges whenever a job fails
  > Without a branch rule, a failed check is only a red mark. The rule makes it a gate.
- [ ] The workflow's \`permissions: contents: read\` block
  > Permissions limit what the workflow can do to the repository, not who can merge.
- [ ] The \`concurrency\` block cancels the merge request
  > Concurrency only cancels older runs on the same branch.
`;

export { rawQuizdown }
