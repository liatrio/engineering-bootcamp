const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# A test calls \`update_project\` with a valid body and asserts nothing about the result. Coverage for the method goes up. What has the test proved?

- [x] Only that those lines ran without raising
  > Coverage records execution, not verification. With no assertion, a wrong result would pass too.
- [ ] That the update logic returns correct data
  > Nothing checks the returned project, so a bug in the fields it sets would go unnoticed.
- [ ] That every branch of the method is tested
  > One valid call takes one path. The conflict and not-found branches still never run.
- [ ] That the method is safe to refactor freely
  > A refactor that broke the result would still pass, because the test checks nothing.

# A function has one \`if\` with no \`else\`, and the only test passes a value that makes the condition true. What do line and branch coverage report?

- [x] Every line covered, half the branches
  > Every line runs, but the "false" outcome of the decision is never taken.
- [ ] Half the lines covered, every branch
  > The body of the \`if\` runs, so no line is missed. It's the false outcome that is missing.
- [ ] Every line and every branch covered
  > Branch coverage counts both outcomes of the decision, and only one of them ran.
- [ ] Neither number can be known in advance
  > Both follow from which outcomes ran: one of the two branches, and every line.

# projects-service passes its 80% gate when you run \`uv run pytest\`, but fails it when you run \`uv run pytest tests/unit\`. Why?

- [x] The gate measures the suite that ran, and unit tests skip the routers
  > The routers and the SQLAlchemy repository only run in the integration tests, so a unit-only run covers less.
- [ ] Unit tests are excluded from coverage measurement by \`pyproject.toml\`
  > \`--cov=app\` measures every run. Nothing in the configuration excludes unit tests.
- [ ] The integration tests raise the threshold to 80% only when Docker is up
  > \`fail_under = 80\` is fixed in \`pyproject.toml\`. Docker changes which tests run, not the threshold.
- [ ] pytest-cov gives each test file its own report and its own separate gate
  > The gate applies to the total for the whole run, not to each test file.

# Coverage sits at 79% and the gate is 80%. Which fix would a reviewer accept most readily?

- [x] Test the riskiest uncovered code in the report
  > The gate is a floor; the report shows where a missing test would hurt most.
- [ ] Lower the gate to 78% just for this pull request
  > Lowering the floor to get a change through defeats the ratchet the gate exists for.
- [ ] Add tests that call getters with no assertions
  > Those move the number without protecting anything, the distortion the page warns about.
- [ ] Exclude the uncovered files from the measurement
  > Exclusions are for generated code like migrations, not for hand-written code that lacks tests.

# \`dotnet test\` with the coverlet gate exits with code 14, prints \`error: 1\`, and every test passed. What is the most likely cause?

- [x] Line coverage fell below \`--coverlet-threshold\`
  > A missed threshold shows only as \`error: 1\` and exit code 14. The message is in the diagnostic log.
- [ ] A test was skipped because Docker wasn't running
  > Skipped tests are counted as skipped, not as an error. They would lower coverage, though.
- [ ] coverlet.MTP isn't compatible with xUnit v3 projects
  > coverlet.MTP is the coverlet package built for Microsoft.Testing.Platform, which xUnit v3 uses.
- [ ] The migrations folder failed to compile during the test run
  > A compile error stops the build before any test runs, so nothing would have passed.
`;

export { rawQuizdown }
