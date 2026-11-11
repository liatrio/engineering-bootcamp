const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# What should you use as an evaluation context's targeting key?

- [x] A stable identifier, usually the user ID
  > It has to stay the same across requests, so the same user gets the same answer.
- [ ] The session ID of the current login
  > A new session would give the same user a new answer.
- [ ] The client's IP address, read from each request
  > IP addresses change, and many users can share one.
- [ ] The user's plan, such as free or beta
  > Many users share a plan. Plan is an attribute that rules can use.

# Why must a percentage rollout be sticky?

- [x] So each user gets the same answer on every request
  > Otherwise they'd see the feature appear and disappear. flagd's \`fractional\` hashes the flag key and targeting key into a bucket.
- [ ] So the percentage can't change during the rollout
  > You can raise it. Stickiness means raising it adds users without removing any.
- [ ] So flagd can cache each result in the application
  > Stickiness comes from hashing, not caching.
- [ ] So each user's group is recorded for the experiment
  > Recording variants is a separate step. Stickiness is about consistency.

# What does Hodgson call releasing to internal users first?

- [x] A champagne brunch
  > For drinking your own champagne.
- [ ] A canary release
  > A canary release goes to a random group of users.
- [ ] A dark launch
  > A dark launch deploys the code with the flag off for everyone.
- [ ] A percentage rollout
  > A percentage rollout goes to a growing share of all users, not to staff first.

# You're running an A/B test on a new sign-up form. What should you decide before it starts?

- [x] The metric to compare, and when to stop
  > Otherwise it's tempting to stop when the numbers happen to look good.
- [ ] Which variant should win, and by how much
  > That's what the experiment is for.
- [ ] Which users get which form, by hand
  > Users are split by the flag system, not chosen by hand.
- [ ] How to keep the variant out of your records
  > Record it instead, so you can join flag decisions to outcomes.

# A flagd targeting rule's \`if\` returns \`null\` for a user. What do they get?

- [x] The flag's default variant
  > The rule on the page uses this to give beta users \`on\` and everyone else the default.
- [ ] The default value set in the code
  > The code default is for when the flag can't be evaluated at all. Here it was evaluated.
- [ ] The \`off\` variant
  > They get whichever variant \`defaultVariant\` names, which may not be \`off\`.
- [ ] An evaluation error
  > A \`null\` result is the normal way to fall back to the default variant.
`;

export { rawQuizdown }
