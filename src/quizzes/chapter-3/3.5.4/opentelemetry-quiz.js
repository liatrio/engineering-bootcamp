const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# Which of these is OpenTelemetry responsible for?

- [x] Producing telemetry and sending it to a backend
  > OpenTelemetry is not an observability backend. Storing, querying, and visualizing are left to other tools.
- [ ] Storing telemetry and answering queries about it
  > That's the job of backends such as Prometheus, Loki, and Tempo.
- [ ] Turning stored telemetry into dashboards and alerts
  > Tools like Grafana handle dashboards and alerts.
- [ ] Defining a query language that every backend uses
  > Each backend has its own query language, such as PromQL or TraceQL.

# A library calls the OpenTelemetry API to create spans, but the application using it hasn't configured an SDK. What happens?

- [x] The calls do nothing
  > That's why the API is safe to call from libraries.
- [ ] The calls raise an error
  > The API is designed so libraries can instrument themselves without forcing a setup on applications.
- [ ] Spans go to a local collector
  > Without an SDK, there's no exporter to send them anywhere.
- [ ] Spans print to the console
  > The console exporter is part of the SDK, which isn't configured.

# Why do most production setups send telemetry to a collector instead of straight to a backend?

- [x] Operators can change routing without redeploying apps
  > Applications only speak OTLP to a nearby collector, and decisions about routing, filtering, and vendors live in one place.
- [ ] Applications have no exporters for sending to backends
  > They do. The collector is about keeping applications simple.
- [ ] The collector stores telemetry until it's queried
  > A collector receives, processes, and exports. Backends store.
- [ ] Metrics are aggregated in the collector, not the SDK
  > Metrics are aggregated in the SDK, before export.

# You want to keep every trace that has an error or is slow, plus a sample of the rest. Which sampling do you need, and where does it run?

- [x] Tail sampling, in a collector
  > Tail sampling decides after the trace is complete, which needs a component that sees whole traces.
- [ ] Tail sampling, in each application's SDK
  > A single application doesn't see whole traces that cross services. Tail sampling runs in a collector.
- [ ] Head sampling, in each application's SDK
  > Head sampling decides when a trace starts, before anyone knows whether it will fail.
- [ ] Head sampling, in a collector
  > Wherever it runs, head sampling decides before the outcome is known.

# You sample 10% of traces. What happens to your request-rate metrics?

- [x] They still count every request
  > Metrics are aggregated in the SDK before export, so you can sample traces while keeping accurate rates.
- [ ] They show 10% of the real rate
  > Sampling applies to traces, not metrics.
- [ ] They're scaled up by 10 to match
  > No correction is needed, because metrics were never sampled.
- [ ] They only count the sampled requests
  > Metrics count every request, sampled or not.

# You want to filter errors by service version. How do you attach the version to all of the service's telemetry?

- [x] As a resource attribute, in \`OTEL_RESOURCE_ATTRIBUTES\`
  > Resource attributes are attached to every span, metric, and log the process emits.
- [ ] As a span attribute, set in each request handler
  > That covers spans but misses metrics and logs, and it's easy to forget.
- [ ] As part of the service name, set in \`OTEL_SERVICE_NAME\` at startup
  > \`service.name\` should stay stable across versions. The version has its own attribute.
- [ ] As a metric attribute, on the request counter only
  > That only covers one metric, not traces and logs.

# employees-service samples 25% of root traces and calls projects-service over HTTP. projects-service uses \`parentbased_always_on\`. What fraction of those calls does projects-service keep?

- [x] About 25%, because it follows the \`sampled\` flag it receives
  > A parent-based sampler only decides for root spans. Otherwise it follows the decision in \`traceparent\`.
- [ ] All of them, because its own sampler keeps every trace
  > "Always on" applies only to traces it starts itself. These calls arrive with a parent.
- [ ] Only the ones that fail, because errors are always kept
  > Head sampling decides before anyone knows the outcome. Keeping every error needs tail sampling.
- [ ] None of them, because it can't see employees-service's sampler
  > It doesn't need to. The decision travels in the \`traceparent\` header.
`;

export { rawQuizdown }
