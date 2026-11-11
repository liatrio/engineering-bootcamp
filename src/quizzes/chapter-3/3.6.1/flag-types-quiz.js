const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# A flag gives customers on the premium plan an advanced search page, and will stay as long as the plan exists. Which category is it?

- [x] Permission
  > It gives some users features others don't have, can last years, and decides per user on every request.
- [ ] Release
  > Release flags hide unfinished work and are removed after the release.
- [ ] Experiment
  > Experiments compare groups to answer a question, then end.
- [ ] Ops
  > Ops flags control operational behavior, such as shedding load.

# A flag hides a half-built checkout page so the main branch can keep deploying. Which category is it, and how long should it live?

- [x] Release; until the feature is released
  > Days or weeks. A release flag should have a removal date.
- [ ] Release; for as long as the page exists
  > Once the page is released, the flag is debt.
- [ ] Ops; until the page has proven stable
  > It isn't controlling operational behavior. It's hiding unfinished work.
- [ ] Permission; until every user has access
  > Nobody is meant to have access to a half-built page.

# A kill switch turns off an expensive recommendation feature under heavy load. What default should the flag check in the code use?

- [x] Feature on, so a flag-system failure doesn't cause an outage
  > The default is the behavior you'd want if the flag system failed.
- [ ] Feature off, so a flag-system failure sheds the extra load
  > Then any flag-system failure would switch the feature off for everyone.
- [ ] Whichever value the flag file had when the app was last deployed
  > The code default is fixed in the code. It's used when the flag file can't be read.
- [ ] Feature off, matching the release-flag rule for safety
  > Release flags default to the old behavior. Kill switches usually default to the feature being available.

# The flagd provider keeps the last values it received. When does a flag's code default matter most?

- [x] When the app starts while flagd is unavailable
  > A running app keeps its cached values, but a new one has nothing to fall back on except the defaults.
- [ ] When flagd goes down while the app is running
  > A running app keeps its last values through an outage.
- [ ] When a flag's default variant changes in flagd
  > A change delivers a new value from flagd, not the code default.
- [ ] When flagd comes back after a long outage
  > Once flagd is back, the app picks up its values again.

# Which practices help keep flag debt low? Select all that apply.

- [x] Add a removal task to the backlog with each release flag
  > Removal becomes planned work, not a favor.
- [x] Record an owner and an expiry date for each flag
  > Someone is responsible, and everyone knows when it should go.
- [x] Limit how many flags a service may have at once
  > Adding a flag means removing another.
- [ ] Delete a flag from flagd before removing its check
  > Remove the code first. Otherwise the running code falls back to its default the moment the flag disappears.
`;

export { rawQuizdown }
