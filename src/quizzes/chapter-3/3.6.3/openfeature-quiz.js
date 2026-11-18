const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# Your team moves from flagd to a commercial flag vendor. With OpenFeature, what has to change in the application?

- [x] The provider
  > The provider is the adapter between the OpenFeature API and the flag system. The flag checks stay the same.
- [ ] The flag checks
  > Flag checks call the vendor-neutral API, so they don't change.
- [ ] The hooks
  > Hooks such as the OpenTelemetry hook work with any provider.
- [ ] The context
  > The evaluation context describes the request, whichever system evaluates the flags.

# One flag returns the reason \`STATIC\` and another \`TARGETING_MATCH\`. What's the difference?

- [x] \`STATIC\` flags have no rules; for the other, a rule chose
  > In .NET, call \`GetBooleanDetailsAsync(...)\` to see the reason.
- [ ] \`STATIC\` flags are off; for the other, a rule turned it on
  > A static flag can return any of its variants. It just has no targeting rules.
- [ ] \`STATIC\` values are cached; the other came from flagd
  > Caching is reported with its own reason, \`CACHED\`.
- [ ] \`STATIC\` used the code default; the other used flagd
  > When evaluation fails and the code default is used, the reason is \`ERROR\`.

# What are OpenFeature hooks for?

- [x] Running code before and after every flag evaluation
  > For cross-cutting concerns such as logging or telemetry. The OpenTelemetry hook adds a span event after each evaluation.
- [ ] Choosing which variant each user should receive, per request
  > That's what targeting rules do.
- [ ] Connecting the API to a flag management system
  > That's the provider's job.
- [ ] Merging the evaluation context from each level
  > The SDK merges context itself before each evaluation.

# How does flagd's in-process mode differ from RPC mode?

- [x] The app evaluates flags locally, with no call per evaluation
  > flagd sends the flag definitions to the application. Set \`FLAGD_RESOLVER=in-process\` to use it.
- [ ] The app calls flagd over the network for every evaluation
  > That's RPC mode. Some providers cache flags without targeting rules, but each uncached evaluation is a call.
- [ ] flagd runs as a library, inside the application's own process
  > The definitions come to the application. flagd still runs separately.
- [ ] The app reads flag changes only when it is restarted
  > flagd still sends changes to the application.

# Why reset the in-memory provider after each test?

- [x] The provider is global, so flags leak into later tests
  > Otherwise results depend on the order the tests run in.
- [ ] The in-memory provider can only be set once per test run
  > It can be set as many times as you like.
- [ ] Each test has to reconnect to flagd before it runs
  > Tests shouldn't depend on a running flag service at all.
- [ ] The provider caches values that would go out of date between tests
  > The problem is shared global state, not stale caching.
`;

export { rawQuizdown }
