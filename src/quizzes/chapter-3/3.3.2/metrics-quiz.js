const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# Which kind of metric fits the number of messages currently waiting in a queue?

- [x] Gauge
  > It goes up and down, and you measure it at a point in time.
- [ ] Counter
  > A counter only goes up.
- [ ] Histogram
  > A histogram records the distribution of many measurements, such as request durations.
- [ ] Rate
  > A rate is something you calculate from a counter, not a kind of metric.

# Why look at p99 latency instead of the average?

- [x] The average hides the slowest requests
  > A few very slow requests barely move the average. p99 shows what your unhappiest users experience.
- [ ] p99 leaves out requests that failed
  > Percentiles aren't defined by whether requests succeeded.
- [ ] p99 needs less storage than an average
  > Percentiles come from histograms. The reason is what they show, not their cost.
- [ ] The average can't be split by route
  > Both can be broken down by attributes.

# A teammate wants to add a \`user_id\` attribute to the request counter so they can see requests per user. What is the problem?

- [x] Each user would become a separate time series
  > That's high cardinality, and it can overwhelm the metrics backend. Put unbounded values in logs and traces instead.
- [ ] Counters can only carry the standard HTTP attributes
  > Counters can carry any attributes. The number of distinct values is the problem.
- [ ] User IDs would make the counter go down
  > Attributes don't change whether a counter can decrease.
- [ ] The counter would need a histogram instead
  > The kind of metric doesn't matter. Any metric with this attribute has the problem.

# Following OpenTelemetry's naming guidelines, which name and unit should a counter of users created by the \`user-api\` application have?

- [x] \`user_api.user.created\`, unit \`{user}\`
  > Dot-separated namespaces prefixed with the app name, and the unit on the instrument.
- [ ] \`user_api.user.created_total\`, unit \`{user}\`
  > The guidelines say not to add a \`_total\` suffix. The instrument type already marks a counter.
- [ ] \`user_api.users.created\`, unit \`user\`
  > Counts of things use a curly-brace unit, such as \`{user}\`.
- [ ] \`user.created\`, unit \`{user}\`
  > Without an application prefix, it could clash with a semantic convention added later.

# Prometheus receives the OpenTelemetry counter \`user_api.user.created\` with unit \`{user}\`. What name do you use in PromQL?

- [x] \`user_api_user_created_total\`
  > Dots become underscores, the curly-brace unit is dropped, and counters gain \`_total\`.
- [ ] \`user_api_user_created_user_total\`
  > A curly-brace unit is dropped rather than appended.
- [ ] \`user_api_user_created\`
  > Counters gain a \`_total\` suffix in Prometheus.
- [ ] \`user_api.user.created_total\`
  > Prometheus replaces the dots with underscores.
`;

export { rawQuizdown }
