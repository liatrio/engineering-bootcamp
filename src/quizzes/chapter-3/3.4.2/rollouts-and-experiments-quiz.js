const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# What should you use as an evaluation context's targeting key?

- [x] A stable identifier for the subject of the evaluation, usually a user ID
  > It has to stay the same across requests, so the same user gets the same answer.
- [ ] A random number generated per request
  > Then each request could get a different answer.
- [ ] The current timestamp
  > It changes on every request.
- [ ] The user's full profile
  > The targeting key is a single identifier. Only add attributes that your rules need.

# Why must a percentage rollout be sticky?

- [x] So the same user gets the same answer on every request, rather than seeing the feature appear and disappear
  > flagd's \`fractional\` operation hashes the flag key and the targeting key into a bucket, so a user always lands in the same one.
- [ ] So the percentage can't be changed after the rollout starts
  > You can raise it. Stickiness means raising it adds users without removing any.
- [ ] So that flagd can cache the result
  > Stickiness comes from the hash, not from caching.
- [ ] So that every user eventually gets the feature
  > That depends on reaching 100%, not on stickiness.

# What does Hodgson call releasing to internal users first?

- [x] A champagne brunch
  > For drinking your own champagne.
- [ ] A canary release
  > A canary release goes to a random group of users.
- [ ] A dark launch
  > A dark launch deploys the code with the flag off for everyone.
- [ ] A kill switch
  > A kill switch turns a feature off.

# You're running an A/B test on a new sign-up form. What should you decide before it starts?

- [x] The metric you'll compare and when you'll stop
  > Otherwise it's tempting to stop when the numbers happen to look good.
- [ ] Which variant will win
  > That's what the experiment is for.
- [ ] Nothing; stop as soon as one variant is ahead
  > Stopping on a good-looking moment leads to false conclusions.
- [ ] How to hide which variant each user got
  > Record it instead, so you can join flag decisions to outcomes.

# A flagd targeting rule's \`if\` returns \`null\` for a user. What do they get?

- [x] The flag's default variant
  > The rule on the page uses this to give beta users \`on\` and everyone else the default.
- [ ] An error
  > A \`null\` result is a normal way to fall back.
- [ ] The \`off\` variant, always
  > They get whichever variant \`defaultVariant\` names.
- [ ] The code's default value
  > The code default is for when the flag can't be evaluated at all. Here it was evaluated.
`;

export { rawQuizdown }
