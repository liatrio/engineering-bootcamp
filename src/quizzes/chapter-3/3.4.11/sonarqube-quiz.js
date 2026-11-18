const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# SonarQube shows 0% coverage for assignments-service, although coverlet reports about 90% in the same CI job. What's the most likely cause?

- [x] The scanner didn't find the coverage report file
  > Sonar never runs tests. If the report path matches nothing, every line counts as uncovered.
- [ ] SonarQube runs its own copy of the tests and they failed
  > SonarQube doesn't run tests at all. It only imports reports.
- [ ] Sonar can't read coverage for C# projects
  > Sonar reads OpenCover reports for C#, through \`sonar.cs.opencover.reportsPaths\`.
- [ ] The quality gate resets coverage on new code
  > The gate judges coverage; it doesn't change what was measured.

# The report path is \`TestResults/*.opencover.xml\`, and coverlet wrote \`TestResults/coverage.opencover.131126193755869.xml\`. What happens?

- [x] Nothing matches, and Sonar shows 0% with no error
  > The file name has an ID before \`.xml\`, so the pattern needs \`coverage.opencover.*.xml\`.
- [ ] Sonar matches it, since \`*\` covers any characters
  > \`*\` stands in for the part before \`.opencover\`, but the ID after it still doesn't match.
- [ ] The scanner fails the build with a missing-file error
  > A path that matches nothing is silent, which is why the 0% surprises people.
- [ ] coverlet renames the file once the analysis begins
  > coverlet has no option to drop the ID, and nothing renames the file.

# What does the default *Sonar way* quality gate judge?

- [x] Only code changed since a baseline, "new code"
  > Clean as you code: new code must meet the conditions, and old code doesn't block you.
- [ ] Every line in the project, from the first commit
  > The default gate looks at new code, so existing issues don't block a change.
- [ ] Only files that have a unit test next to them
  > The gate applies to all new code, tested or not; coverage is one of its conditions.
- [ ] Only the security hotspots that need a review
  > Hotspots are one part. The gate also checks issues, coverage, and duplication.

# Why does the C# analysis wrap the build in \`dotnet sonarscanner begin\` and \`end\`, instead of using the generic SonarScanner CLI?

- [x] It needs the compiler's view of the code during a build
  > The .NET scanner observes \`dotnet build\`, then analyzes and uploads in \`end\`.
- [ ] The CLI can only read a \`sonar-project.properties\` file
  > The CLI also takes \`-D\` options. The difference is that C# analysis needs the build.
- [ ] Sonar runs the C# tests between \`begin\` and \`end\`
  > Sonar never runs tests. The step between them is the build.
- [ ] It's how Sonar keeps the token out of the logs
  > Masking secrets is GitHub's job. The wrapping is about observing the build.

# Why does the analysis step run only \`if: env.SONAR_TOKEN != ''\`?

- [x] Builds without the secret, such as forks, still pass
  > Without the secret the step is skipped instead of failing the whole job.
- [ ] Sonar charges the team for every analysis run with a token
  > The condition is about secret availability, not billing.
- [ ] The token is only needed for the \`begin\` command
  > Both \`begin\` and \`end\` use the token. The condition skips the whole step without it.
- [ ] GitHub forbids secrets in a step's \`env\` block
  > Reading a secret into a step's \`env\` is the recommended way to use it.
`;

export { rawQuizdown }
