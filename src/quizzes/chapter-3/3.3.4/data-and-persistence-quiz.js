const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# \`AssignmentService\` already checks for a duplicate employee and project pair. Why does the table also need a unique index on them?

- [x] Two requests can pass the check at once; only the index sees both
  > The C# check gives a clear message in the common case. The index is the guarantee, for races and for writers that bypass the service.
- [ ] EF Core won't save an entity unless every lookup column is indexed
  > EF Core saves entities without any index. Indexes are a database decision you make for speed and correctness.
- [ ] The index makes the C# check unnecessary, so it can be deleted
  > Without the check, a duplicate still gets a 409 via the store, but the message is less specific. The two work together.
- [ ] PostgreSQL needs it to generate GUIDs for the primary key
  > The service generates IDs itself. Uniqueness of the pair has nothing to do with the key.

# Why does the \`Assignments\` table have no foreign key to the \`Employees\` table?

- [x] Employees live in another service's database
  > Each service owns its database. assignments-service checks IDs over HTTP and reacts to \`employee.deleted\` instead.
- [ ] Foreign keys don't work with GUID primary keys in PostgreSQL
  > Foreign keys work with any key type. The obstacle is that the referenced table is in a different database.
- [ ] EF Core can only create foreign keys between entities in one folder
  > Folders don't matter to EF Core. Entities in the same DbContext can reference each other wherever they live.
- [ ] Foreign keys slow down inserts too much for a busy service
  > Foreign key checks are cheap and usually worth it. Inside one service the Company app would use them.

# Two teammates generate migrations on separate branches. What does the \`ModelSnapshot.cs\` file do that makes them conflict?

- [x] It records the whole model to compute the next migration
  > Each migration rewrites the snapshot. Two branches that both rewrite it conflict, and the fix is to regenerate after rebasing.
- [ ] It stores the rows that the migration inserts as seed data
  > Seed data is code in the initializer here. The snapshot describes the schema, not the rows.
- [ ] It lists which migrations the database has already applied
  > That's the \`__EFMigrationsHistory\` table in the database, not a file in the repository.
- [ ] It caches the SQL so migrations run faster on startup
  > Migrations are compiled C#. The snapshot isn't used at runtime at all.

# \`ListAsync\` uses \`AsNoTracking()\`, but \`FindAsync\` doesn't. Why?

- [x] Listed rows are never saved, but a found row may be changed and saved
  > Tracking lets \`SaveChangesAsync()\` see which properties changed. Reads that won't be saved skip that cost.
- [ ] Untracked queries can't use a WHERE clause on an indexed column
  > Tracking has no effect on the SQL's WHERE clause or on index use.
- [ ] Tracking is required for any query that returns a single row
  > A single-row query can be untracked too. FindAsync is tracked because the update path saves what it returns.
- [ ] Untracked queries return copies that are safe to share between requests
  > Entities are never shared between requests either way. Each request has its own DbContext.

# Your team considers a generic \`IRepository<T>\` with \`GetAll\`, \`Add\`, and \`Update\`. What's the main argument against it here?

- [x] DbSet already does that; a narrow, named store says more
  > A generic wrapper duplicates EF Core without adding meaning. \`PairExistsAsync\` says what the service needs.
- [ ] Generic interfaces can't be registered in the .NET container
  > The container supports open generics. The objection is about design, not capability.
- [ ] Repositories make the rules impossible to test with a fake
  > Repositories exist partly to make faking easy. That's an argument for a seam, not against one.
- [ ] Active Record is required when the service uses PostgreSQL
  > The database doesn't dictate the pattern. EF Core works well without Active Record.
`;

export { rawQuizdown }
