const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# Two teammates are adding Departments and Skills to employees-service at the same time. Why does slicing by feature help them most?

- [x] Each works in their own folder, so their changes rarely conflict
  > With a layer layout both would edit \`Controllers/\`, \`Services/\`, and \`Models/\`, and their pull requests would collide.
- [ ] Each feature gets its own database, so neither waits on migrations
  > Slices share the service's one \`DbContext\`. Migrations are still a shared hotspot that needs one owner.
- [ ] The compiler builds each feature folder separately and in parallel
  > Folders don't change how .NET compiles a project. The benefit is for people, not the build.
- [ ] Feature folders skip the foundation, so there's less to learn first
  > Slices *use* the foundation for everything that isn't specific to them.

# A reviewer finds \`if (path.StartsWith("/api/employees"))\` inside \`GlobalExceptionHandler\`. Which rule does it break?

- [x] The foundation never knows about a specific feature
  > The handler maps exception types to responses. Feature-specific behavior belongs in the feature, as a thrown exception.
- [ ] A slice never reaches into another slice's internals
  > No slice is involved here. The problem is the foundation depending on a feature.
- [ ] Promote code to shared on the second use, not the first
  > That rule is about when to move code into the foundation, not what the foundation may know.
- [ ] Controllers never catch exceptions or set status codes
  > True for controllers, but this code is in the handler, which is meant to set status codes.

# In one API with Employees and Projects slices, Projects needs an employee's name. What fits the slice rules best?

- [x] Call a function the Employees slice deliberately exports
  > A deliberate, public entry point keeps the two features independent of each other's internals.
- [ ] Import the private helper that \`EmployeeService\` already uses
  > Reaching into another slice's internals couples them invisibly, so a refactor of one breaks the other.
- [ ] Copy the Employees query into the Projects slice and adapt it
  > Duplicated logic drifts. Two copies of a rule soon disagree.
- [ ] Move all of the Employees code into the shared foundation instead
  > Code that only Employees uses doesn't belong to everyone, and the foundation would start knowing about features.

# employees-service checks for a duplicate email in \`EmployeeService\` and also has a unique index on the column. Why both?

- [x] The check gives a clear 409; the index stops races
  > Two requests can pass the check at once. The index is the real guarantee, and the store maps its error to the same 409.
- [ ] The check is for tests; the index is for production traffic
  > Both run in every environment. They handle different situations, not different environments.
- [ ] The index speeds up lookups; the check is the actual guarantee
  > The index also speeds up lookups, but a check in code can't stop a race between requests.
- [ ] EF Core needs the check before it will create the index for you
  > The index comes from \`EmployeeConfiguration\` and a migration, independent of any check in the service.

# Your team asks a coding agent to "add Assignments". What makes its output most predictable?

- [x] An \`AGENTS.md\` template and one existing slice to copy
  > An agent, like a new teammate, does best with written rules and one unambiguous example of every decision.
- [ ] A longer prompt that lists every file name and class name
  > That helps once. Written conventions and an example help on every task, for people too.
- [ ] Giving the agent write access to the \`Infrastructure/\` folder
  > Access doesn't tell it what to write. A slice shouldn't need to change the foundation anyway.
- [ ] Letting it choose the layout it was trained on most often
  > Its default may not match your codebase, so every feature risks looking different.
`;

export { rawQuizdown }
