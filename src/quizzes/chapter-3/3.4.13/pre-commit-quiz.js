const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# The team has pre-commit hooks and CI that run the same linters. Why keep both?

- [x] Hooks warn early; CI is the gate nobody can skip
  > Anyone can skip hooks with \`--no-verify\` or never install them. CI always runs.
- [ ] Hooks run the tests, while CI only runs the formatters
  > It's the other way round: hooks stay fast, and tests belong in CI.
- [ ] CI can't run linters on files changed in a commit
  > CI can run any linter. The difference is when the feedback arrives, and whether it can be skipped.
- [ ] Hooks are versioned, while CI workflows are not
  > Both the pre-commit config and the workflows are versioned files in the repository.

# A teammate proposes a pre-commit hook that runs the full test suite with Testcontainers. What's the page's objection?

- [x] A slow hook gets skipped with \`--no-verify\`
  > Then it checks nothing. Keep hooks to seconds and leave tests to CI.
- [ ] pre-commit can't start Docker containers at all
  > A local hook can run any command. The problem is speed.
- [ ] Tests can only run once a commit already exists
  > Tests run against the working tree. The issue is how long they take.
- [ ] Hooks can't read files outside the staged set
  > Hooks can read any file. Speed is what makes this hook a bad idea.

# The trailing-whitespace hook fails and changes a file. What do you do next?

- [x] Stage the fixed file and commit again
  > Fixing hooks edit the working tree, not the staged copy, so you add the fix and retry.
- [ ] Commit with \`--no-verify\`, since it's fixed
  > The fix isn't staged, so you'd commit the unfixed version and skip every other check.
- [ ] Run \`pre-commit install\` again, then commit
  > The hooks are already installed. They ran and fixed the file.
- [ ] Revert the hook's change and fix it by hand
  > The hook's fix is the correct one; just stage it.

# Why does the ruff hook's \`rev\` match the ruff version in \`projects-service/pyproject.toml\`?

- [x] So the hook and CI give the same result
  > When a hook and CI disagree, people stop trusting both. Same version, same configuration.
- [ ] pre-commit only installs versions a project lists
  > pre-commit installs whatever \`rev\` says, whatever the project lists.
- [ ] Newer ruff releases can't read \`pyproject.toml\`
  > Newer releases read it fine, but they may have different rules.
- [ ] uv refuses to run two versions of the same tool
  > pre-commit installs hooks in its own environments, separate from uv.

# Why does the M4 configuration exclude \`pacts/*.json\` from \`end-of-file-fixer\`?

- [x] Pact rewrites them on each test run, undoing fixes
  > The files are generated, so the fix would flip back and forth.
- [ ] JSON files can't legally end with a newline character
  > JSON allows a trailing newline. The issue is who writes the file.
- [ ] gitleaks already checks the pact files for secrets
  > Secret scanning and end-of-file fixing are unrelated checks.
- [ ] Pact files are too large for the hook to process
  > They're small. They're excluded because a tool regenerates them.
`;

export { rawQuizdown }
