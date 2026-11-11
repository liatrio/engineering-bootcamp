const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# What turns a trace's spans into a tree?

- [x] Each span records its parent span's ID
  > The parent links give the tree, which tools draw as a waterfall.
- [ ] Spans are sorted by start time
  > Visualization tools position bars by time, but the parent links give the structure.
- [ ] Each span has a unique name
  > Names don't need to be unique, and they don't define relationships.
- [ ] The backend guesses from the span names
  > The relationships are recorded explicitly, not inferred.

# A request goes from service A to service B over HTTP. How does service B continue the same trace?

- [x] Service A sends a W3C \`traceparent\` header with the trace ID and parent span ID
  > This is context propagation. OpenTelemetry's HTTP instrumentation sends and reads the header for you.
- [ ] Service B looks up the trace in the tracing backend
  > The context travels with the request, not through the backend.
- [ ] Both services use the same service name
  > Services have their own names. The header carries the trace context.
- [ ] Service B starts a new trace, and the backend joins them by timestamp
  > Without propagation, you get two unrelated traces.

# You have automatic spans for incoming HTTP requests and database queries. Where should you add manual spans?

- [x] Operations that matter to your application, such as validation or business rules
  > Add attributes that help you search too, such as an order ID or customer tier.
- [ ] Around every line of code
  > A span per line is noise.
- [ ] Around the incoming HTTP request
  > The instrumentation library already creates that span.
- [ ] Nowhere; automatic spans are always enough
  > They give you the skeleton, but not the operations specific to your application.

# Which of these does a span record? Select all that apply.

- [x] Start and end times
  > Every span is a timed operation.
- [x] Attributes, such as \`http.route\`
  > Key-value details that help you search and understand the operation.
- [x] A status: unset, OK, or error
  > It marks whether the operation failed.
- [ ] Every log line in the application
  > Logs are a separate signal, though they can carry the trace ID to link them.
`;

export { rawQuizdown }
