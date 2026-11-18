const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# Prettier reflows a long line, and ESLint reports a variable that is never used. Which description fits each tool?

- [x] Prettier formats layout; ESLint reports problems
  > A formatter rewrites layout without changing behavior. A linter reads code and reports probable mistakes.
- [ ] Both are linters; Prettier just has fewer rules
  > Prettier isn't a linter. It has no rules about correctness, only a canonical layout.
- [ ] ESLint formats layout; Prettier reports problems
  > It's the other way round: ESLint finds problems such as unused variables, and Prettier formats.
- [ ] Both are formatters that apply different house styles
  > ESLint's job here is finding a probable bug, which no formatter does.

# ruff reports B006 on \`def reset_to_seed(repository, remove_ids: list[uuid.UUID] = [])\`. The code never appends to \`remove_ids\`. Why is it still worth fixing?

- [x] The default list is created once and shared by every call
  > Python evaluates defaults when the function is defined. Any future append would leak into later calls.
- [ ] An empty list default makes every single call measurably slower
  > Performance isn't the issue. The risk is one shared, mutable object across calls.
- [ ] Type checkers reject list defaults on typed parameters
  > \`list[uuid.UUID] = []\` type-checks fine. B006 is about shared mutable state, not types.
- [ ] Lists can't hold UUIDs in a default argument value
  > Lists can hold anything. The problem is that the one default list is reused.

# Why does assignments-service set \`TreatWarningsAsErrors\` only when \`CI\` is \`true\`?

- [x] Warnings block merges but not local experiments
  > GitHub Actions sets \`CI=true\`, so CI fails on any warning while you can still try things locally.
- [ ] Analyzers don't run at all outside of CI builds
  > \`AnalysisLevel\` applies to every build. Locally the findings appear as warnings instead of errors.
- [ ] dotnet format can't fix warnings on a laptop
  > \`dotnet format\` works the same locally. The condition only controls whether warnings fail the build.
- [ ] GitHub requires it to show annotations on pull requests
  > Warnings show as annotations too. The setting decides whether they fail the build.

# After enabling \`latest-recommended\` analyzers, the team runs \`dotnet format\`. Which findings are still left on the reference code?

- [x] CA1848 and CA1873 on the logging calls
  > They need \`[LoggerMessage]\` methods written by hand; \`dotnet format\` has no automatic fix for them.
- [ ] IDE0005 unused usings in several files
  > \`dotnet format\` removes unused usings itself.
- [ ] Whitespace and indentation in the test helpers
  > Whitespace is exactly what \`dotnet format\` fixes first.
- [ ] CS1573 on the undocumented \`ct\` parameter
  > \`dotnet format\` added the missing \`<param>\` tag on the reference code.

# A teammate thinks rule CA1861 is wrong for the tests. What does the page recommend?

- [x] Set its severity in \`.editorconfig\` with a comment saying why
  > A severity change in \`.editorconfig\` is visible, reviewed, and explained in one place.
- [ ] Add \`#pragma warning disable\` above each line that triggers it
  > The page says not to suppress in place: scattered suppressions hide the decision.
- [ ] Remove \`AnalysisLevel\` so the rule set falls back to defaults
  > That turns off every recommended rule to get rid of one.
- [ ] Leave it as a warning and ignore it during code review
  > With warnings as errors in CI, an ignored warning still fails the build.
`;

export { rawQuizdown }
