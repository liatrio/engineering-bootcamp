const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# With feature flags, what is the difference between deploying and releasing?

- [x] Deploying ships the code; releasing turns the feature on
  > With the flag off, a deployment makes no visible difference. You release when you're ready.
- [ ] Deploying turns the feature on; releasing ships the code
  > It's the other way around: code has to be deployed before a flag can turn it on.
- [ ] Deploying goes to staging; releasing goes to production
  > With flags, deploying puts code into production, switched off.
- [ ] Deploying is automated; releasing needs a code review
  > Changing a flag doesn't go through code review, which is why you need to control who can change flags.

# In \`flags.GetBooleanValueAsync("assignment-notifications", false)\`, when is \`false\` used?

- [x] When the flag can't be evaluated, such as when flagd is down
  > The default runs whenever evaluation fails, so choose it deliberately.
- [ ] When the flag is enabled but its default variant is \`off\`
  > Then flagd returns the \`off\` variant's value. The code default isn't involved.
- [ ] When no targeting rule matches the current user
  > Then the flag's default variant is used, which comes from flagd, not the code.
- [ ] When the code runs in automated tests instead of in production
  > The default is used in production whenever the flag can't be evaluated.

# How do flags help teams practicing trunk-based development?

- [x] Unfinished work can be merged and deployed switched off
  > The main branch can always deploy, even when a feature isn't ready.
- [ ] Each feature can live on its own branch until it's ready
  > Trunk-based development avoids long-lived feature branches.
- [ ] Merges skip code review while the flag is still off
  > Flags change who sees a feature, not how code is reviewed.
- [ ] Code behind a flag doesn't need tests until it's released
  > Flags *add* paths that need testing.

# Which of these are costs of feature flags? Select all that apply.

- [x] Every flag adds another branch to the code
  > More paths to understand and maintain.
- [x] Combinations of flags need testing too
  > The combinations grow quickly as flags pile up.
- [x] Old flags pile up as code nobody deletes
  > That's flag debt.
- [ ] Turning a feature off takes a redeploy
  > Turning a flag off takes seconds, with no redeploy.
`;

export { rawQuizdown }
