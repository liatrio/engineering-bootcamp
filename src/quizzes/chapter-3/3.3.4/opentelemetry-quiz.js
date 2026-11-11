const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# What does OpenTelemetry standardize?

- [x] How telemetry is produced and transported
  > OpenTelemetry is not an observability backend. Storing, querying, and visualizing are left to other tools.
- [ ] How telemetry is stored and queried
  > That's the job of backends such as Prometheus, Loki, and Tempo.
- [ ] How dashboards are drawn
  > Visualization tools like Grafana handle dashboards.
- [ ] Which observability vendor you must use
  > Because every backend accepts the same format, you can change backends without touching your code.

# A library calls the OpenTelemetry API to create spans, but the application using it hasn't configured an SDK. What happens?

- [x] The calls do nothing
  > That's why the API is safe to call from libraries.
- [ ] The application crashes
  > The API is designed so libraries can instrument themselves without forcing a setup on applications.
- [ ] The spans are sent to a default backend
  > Without an SDK, there's no exporter to send them anywhere.
- [ ] The spans are written to a local file
  > Nothing is exported without an SDK.

# Why do most production setups send telemetry to a collector instead of straight to a backend?

- [x] Routing, filtering, and vendor choices live in one place operators can change without redeploying applications
  > Applications only speak OTLP to a nearby collector.
- [ ] Applications can't export directly to a backend
  > They can. The collector is about keeping applications simple.
- [ ] The collector stores telemetry long term
  > A collector receives, processes, and exports. Backends store.
- [ ] Collectors make metrics more accurate
  > Metrics are aggregated in the SDK, so accuracy doesn't depend on the collector.

# You want to keep every trace that has an error or is slow, plus a sample of the rest. Which sampling do you need, and where does it run?

- [x] Tail sampling, in a collector
  > Tail sampling decides after the trace is complete, which needs to see whole traces.
- [ ] Head sampling, in the SDK
  > Head sampling decides when a trace starts, before anyone knows whether it will fail.
- [ ] Head sampling, in the collector
  > Wherever it runs, head sampling decides before the outcome is known.
- [ ] No sampling; keep everything
  > That works, but storing every trace from a busy service is expensive.

# You sample 10% of traces. What happens to your request-rate metrics?

- [x] They still count every request, because metrics are aggregated in the SDK before export
  > You can sample traces aggressively while keeping accurate rates and percentiles.
- [ ] They show 10% of the real rate
  > Sampling applies to traces, not metrics.
- [ ] They stop being exported
  > Metrics are exported as usual.
- [ ] They're multiplied by 10 to compensate
  > No correction is needed, because metrics were never sampled.

# You want to filter errors by service version. How do you attach the version to all of the service's telemetry?

- [x] Set it as a resource attribute, for example with \`OTEL_RESOURCE_ATTRIBUTES\`
  > Resource attributes are attached to every span, metric, and log the process emits.
- [ ] Add it as an attribute to each span by hand
  > It works for spans, but misses metrics and logs, and is easy to forget.
- [ ] Put it in the service name
  > \`service.name\` should stay stable across versions. The version has its own attribute.
- [ ] Log it once at startup
  > That only puts it in one log line, not on the rest of the telemetry.
`;

export { rawQuizdown }
