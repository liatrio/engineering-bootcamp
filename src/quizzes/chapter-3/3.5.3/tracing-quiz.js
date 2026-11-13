const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# What turns a trace's spans into a tree?

- [x] Each span records its parent span's ID
  > The parent links give the tree, which tools draw as a waterfall.
- [ ] Each span records the trace ID it belongs to
  > The trace ID groups spans into one trace, but doesn't say which is whose parent.
- [ ] The backend nests spans by start and end time
  > Tools position bars by time, but the structure comes from the parent links.
- [ ] Each span records the names of its child spans
  > Children point to their parent, not the other way around.

# A request goes from service A to service B over HTTP. How does service B continue the same trace?

- [x] A sends a \`traceparent\` header with the trace context
  > The W3C Trace Context header carries the trace ID and parent span ID. OpenTelemetry's HTTP instrumentation sends and reads it for you.
- [ ] B looks up A's active trace in the tracing backend
  > The context travels with the request, not through the backend.
- [ ] Both services share the same \`service.name\` resource
  > Each service has its own name. The header carries the trace context.
- [ ] The backend joins the two traces later, by matching their timestamps
  > Without propagation, you get two unrelated traces.

# You have automatic spans for incoming HTTP requests and database queries. Where should you add manual spans?

- [x] Around validation and business rules in your code
  > Add attributes that help you search too, such as an order ID or customer tier.
- [ ] Around each outgoing HTTP call your service makes
  > Instrumentation libraries already create spans for outgoing HTTP calls.
- [ ] Around every function, so nothing is ever missed
  > A span per function or line is noise. Keep spans to significant operations.
- [ ] Around the request handler, to time the whole request
  > The incoming request already has an automatic span.

# Which of these does a span record? Select all that apply.

- [x] Its start and end times
  > Every span is a timed operation.
- [x] Attributes, such as \`http.route\`
  > Key-value details that help you search and understand the operation.
- [x] Events, such as an exception
  > Events mark things that happened during the operation.
- [ ] The IDs of all its child spans
  > Each span records its *parent's* ID. Children aren't listed on the parent.
`;

export { rawQuizdown }
