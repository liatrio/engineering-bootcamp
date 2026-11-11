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
- [ ] Log
  > A log isn't a kind of metric.

# Why look at p99 latency instead of the average?

- [x] The average hides your slowest requests; p99 shows what your unhappiest users experience
  > A few very slow requests barely move the average.
- [ ] p99 is cheaper to calculate
  > Percentiles come from histograms. The reason is what they show, not their cost.
- [ ] The average includes errors and p99 doesn't
  > Neither is defined by whether requests succeeded.
- [ ] p99 is always lower than the average
  > p99 is usually much higher than the average.

# A teammate wants to add a \`user_id\` attribute to the request counter so they can see requests per user. What is the problem?

- [x] Each distinct value creates a separate time series, so an unbounded set like user IDs can overwhelm the metrics backend
  > That's high cardinality. Put unbounded values in logs and traces, where each event is stored individually anyway.
- [ ] Counters can't have attributes
  > They can. Method, route, and status code are common attributes.
- [ ] User IDs are numbers, and attributes must be strings
  > Type isn't the issue. The number of distinct values is.
- [ ] There's no problem
  > This is the case the Prometheus naming guide warns about.

# Following OpenTelemetry's naming guidelines, which name and unit should a counter of users created by the \`user-api\` application have?

- [x] \`user_api.user.created\`, unit \`{user}\`
  > Dot-separated namespaces prefixed with the app name, and the unit on the instrument.
- [ ] \`user_api_users_created_total\`, no unit
  > That's Prometheus style: underscores, and a \`_total\` suffix the OpenTelemetry guidelines say not to add.
- [ ] \`usersCreatedCount\`, unit \`count\`
  > OpenTelemetry uses dot-separated namespaces, and curly-brace units for counts of things.
- [ ] \`user.created\`, unit \`users\`
  > Without an application prefix, it could clash with a semantic convention added later.

# Prometheus receives the OpenTelemetry counter \`user_api.user.created\` with unit \`{user}\`. What name do you use in PromQL?

- [x] \`user_api_user_created_total\`
  > Dots become underscores, the curly-brace unit is dropped, and counters gain \`_total\`.
- [ ] \`user_api.user.created\`
  > Prometheus translates the name. Your code uses the OpenTelemetry name; PromQL uses the Prometheus one.
- [ ] \`user_api_user_created_user\`
  > A curly-brace unit is dropped rather than appended.
- [ ] \`user_api_user_created\`
  > Counters gain a \`_total\` suffix in Prometheus.
`;

export { rawQuizdown }
