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

# A teammate wants to add an \`employee.id\` attribute to \`company.assignments.created\` so they can see assignments per employee. What is the problem?

- [x] Each user would become a separate time series
  > That's high cardinality, and it can overwhelm the metrics backend. Put unbounded values in logs and traces instead.
- [ ] Counters can only carry semantic-convention attributes
  > Counters can carry any attributes. The number of distinct values is the problem.
- [ ] Employee IDs would make the counter go down
  > Attributes don't change whether a counter can decrease.
- [ ] The counter would need a histogram instead
  > The kind of metric doesn't matter. Any metric with this attribute has the problem.

# Following OpenTelemetry's naming guidelines, which name and unit should a counter of timesheets submitted in the Company app have?

- [x] \`company.timesheets.submitted\`, unit \`{timesheet}\`
  > Dot-separated namespaces under the app's own prefix, and the unit on the instrument.
- [ ] \`company.timesheets.submitted_total\`, unit \`{timesheet}\`
  > The guidelines say not to add a \`_total\` suffix. The instrument type already marks a counter.
- [ ] \`company.timesheets.submitted\`, unit \`timesheet\`
  > Counts of things use a curly-brace unit, such as \`{timesheet}\`.
- [ ] \`timesheets.submitted\`, unit \`{timesheet}\`
  > Without the app's own prefix, it could clash with a semantic convention added later.

# Prometheus receives the OpenTelemetry counter \`company.projects.created\` with unit \`{project}\`. What name do you use in PromQL?

- [x] \`company_projects_created_total\`
  > Dots become underscores, the curly-brace unit is dropped, and counters gain \`_total\`.
- [ ] \`company_projects_created_project_total\`
  > A curly-brace unit is dropped rather than appended.
- [ ] \`company_projects_created\`
  > Counters gain a \`_total\` suffix in Prometheus.
- [ ] \`company.projects.created_total\`
  > Prometheus replaces the dots with underscores.
`;

export { rawQuizdown }
