const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# Your team moves from flagd to a commercial flag vendor. With OpenFeature, what has to change in the application?

- [x] The provider
  > The provider is the adapter between the OpenFeature API and the flag system. The flag checks stay the same.
- [ ] Every flag check
  > Flag checks call the vendor-neutral API, so they don't change.
- [ ] The evaluation context
  > The context describes the request, whichever system evaluates the flags.
- [ ] Nothing, not even configuration
  > You still have to set the new vendor's provider.

# One flag returns the reason \`STATIC\` and another \`TARGETING_MATCH\`. What's the difference?

- [x] \`STATIC\` means the flag has no targeting rules; \`TARGETING_MATCH\` means a rule chose the variant
  > Call \`get_boolean_details(...)\` to see the reason.
- [ ] \`STATIC\` means the flag is switched off
  > A flag that's off can still be static.
- [ ] \`TARGETING_MATCH\` means the evaluation failed
  > Failures are reported with the reason \`ERROR\`.
- [ ] \`STATIC\` means the value came from the code's default
  > A code default is reported with a different reason.

# What are OpenFeature hooks for?

- [x] Code that runs before and after every evaluation, for cross-cutting concerns such as logging or telemetry
  > The OpenTelemetry hook adds a \`feature_flag.evaluation\` event to the current span after each evaluation.
- [ ] Choosing which variant a user gets
  > That's what targeting rules do.
- [ ] Connecting to a flag management system
  > That's the provider's job.
- [ ] Storing flag definitions
  > The flag management system stores them.

# How does flagd's in-process mode differ from RPC mode?

- [x] flagd sends the flag definitions to the application, which evaluates them locally with no network call per evaluation
  > Set \`FLAGD_RESOLVER=in-process\` to use it.
- [ ] The application asks flagd for every evaluation over the network
  > That's RPC mode, though flags without targeting rules are cached.
- [ ] flagd runs inside the application's container
  > The definitions come to the application. flagd still runs separately.
- [ ] Flags can't change without restarting the application
  > flagd still sends changes to the application.

# Why reset the in-memory provider after each test?

- [x] The provider is global state, so one test's flags would leak into the next
  > Otherwise results depend on the order the tests run in.
- [ ] The in-memory provider only works once
  > It can be set as many times as you like.
- [ ] To reconnect to flagd between tests
  > Tests shouldn't depend on a running flag service at all.
- [ ] To clear the flag cache in flagd
  > The in-memory provider doesn't use flagd.
`;

export { rawQuizdown }
