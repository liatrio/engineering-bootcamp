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

- [x] Release; days or weeks, until the feature is released
  > A release flag should have a removal date.
- [ ] Permission; as long as the product exists
  > Nobody is meant to have permanent access to a half-built page.
- [ ] Ops; years, as a kill switch
  > It isn't controlling operational behavior.
- [ ] Experiment; until the results are in
  > Nothing is being compared between groups.

# A kill switch turns off an expensive recommendation feature under heavy load. What default should the flag check in the code use?

- [x] Feature available, so a failure in the flag system doesn't cause an outage of its own
  > The default is the behavior you'd want if the flag system failed.
- [ ] Feature off, to be safe
  > Then any flag-system failure would switch the feature off for everyone.
- [ ] It doesn't matter, because the flag service is always available
  > Flag services fail, and flags get deleted or misspelled.
- [ ] Whatever the flag file currently says
  > The default is used precisely when the flag file can't be read.

# The flagd provider keeps the last values it received. When does a flag's code default matter most?

- [x] When an application starts while the flag service is unavailable
  > A running application keeps its cached values, but a new one has nothing to fall back on except the defaults.
- [ ] Whenever the flag service restarts
  > A running application keeps its last values through a short outage.
- [ ] Every time a flag changes
  > A change delivers a new value, not the default.
- [ ] Never, because of the cache
  > The cache only helps applications that were already running.

# Which practices help keep flag debt low? Select all that apply.

- [x] Add a removal task to the backlog when you create a release flag
  > Removal becomes planned work, not a favor.
- [x] Record an owner and an expiry date with each flag
  > Someone is responsible, and everyone knows when it should go.
- [x] Limit how many flags a service may have at once
  > Adding a flag means removing another.
- [ ] Keep released flags in place in case you need them again
  > Flags that have done their job become dead code and confusion.
`;

export { rawQuizdown }
