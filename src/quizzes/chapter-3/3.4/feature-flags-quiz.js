const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# With feature flags, what is the difference between deploying and releasing?

- [x] Deploying puts new code into production; releasing turns the feature on for users
  > With the flag off, a deployment makes no visible difference. You release when you're ready.
- [ ] Deploying is for servers; releasing is for mobile apps
  > The distinction is about code versus features, not platforms.
- [ ] They're the same event
  > Without flags they are. Flags separate the two.
- [ ] Releasing comes first, then deploying
  > Code has to be deployed before a flag can turn it on.

# In \`client.get_boolean_value("sorted-users", False)\`, when is \`False\` used?

- [x] When the flag can't be evaluated, for example because the flag service is down or the flag doesn't exist
  > The default runs whenever evaluation fails, so choose it deliberately.
- [ ] Whenever the flag is switched off
  > When the flag is off, flagd returns the \`off\` variant's value, not the code's default.
- [ ] Only during tests
  > The default is used in production whenever the flag can't be evaluated.
- [ ] On the first request after a restart
  > The default only applies if the flag can't be evaluated.

# How do flags help teams practicing trunk-based development?

- [x] Unfinished work can be merged into the main branch and deployed switched off
  > The main branch can always deploy, even when a feature isn't ready.
- [ ] Flags replace code review
  > Flags change who sees a feature, not how code is reviewed.
- [ ] Flags let each developer keep a long-lived branch
  > Trunk-based development avoids long-lived branches.
- [ ] Flags make tests unnecessary
  > Flags *add* paths that need testing.

# Which of these are costs of feature flags? Select all that apply.

- [x] Every flag adds a branch to the code
  > More paths to understand and maintain.
- [x] Every combination of flags is a configuration you might have to test
  > The combinations grow quickly as flags pile up.
- [x] Flags that outlive their purpose become dead code that nobody dares delete
  > That's flag debt.
- [ ] Flags make rollbacks slower
  > Turning a flag off takes seconds, much faster than rolling back a deployment.
`;

export { rawQuizdown }
