const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# Which structured log line follows the advice on this page?

- [x] \`{"level": "WARN", "message": "user rejected", "reason": "name_required"}\`
  > A short, constant message, with the variable parts in fields you can filter on.
- [ ] \`{"level": "WARN", "message": "user rejected: name required by validator"}\`
  > The reason is buried in the message, so you'd need a regular expression to search for it.
- [ ] \`{"level": "WARN", "message": "Rejected user from 10.0.0.7", "reason": "name"}\`
  > The message varies with the IP address. Keep it constant and put variable parts in fields.
- [ ] \`{"level": "ERROR", "message": "user rejected", "reason": "name_required"}\`
  > The structure is right, but a handled rejection isn't an error.

# Your service rejects a request because the name is missing, and responds with \`400\`. Which level fits?

- [x] \`WARNING\`
  > Something unexpected that the application handled.
- [ ] \`ERROR\`
  > Nothing failed that needs someone's attention. Overusing ERROR trains people to ignore it.
- [ ] \`CRITICAL\`
  > The application can continue. CRITICAL is for when it can't.
- [ ] \`DEBUG\`
  > A rejected request is a significant event, and DEBUG is usually off in production.

# Which of these should you avoid writing to logs? Select all that apply.

- [x] A user's session ID
  > It can be used to hijack the session.
- [x] An API access token
  > Anyone who can read the logs could use it.
- [x] A database connection string
  > It often contains credentials.
- [ ] The request's trace ID
  > Including it lets you move between logs and traces.
- [ ] The response status code
  > Status codes aren't sensitive and help you understand the event.

# Where should a containerized application write its logs?

- [x] To standard output, for the platform to collect
  > Containers, Kubernetes, and log agents all expect this.
- [ ] To a log file on a volume mounted in the container
  > The platform's log collection expects standard output, not files.
- [ ] Straight to the log backend, from application code
  > That couples the application to one backend. Let the platform handle shipping.
- [ ] To standard error only, so they're kept apart from output
  > The Twelve-Factor App says to write the event stream to standard output.

# You want to know how many users were rejected each minute. What's the best tool?

- [x] A counter metric
  > Counting with a metric is far cheaper than searching millions of log lines.
- [ ] A log line per rejection, counted with a query
  > It works, but searching log lines is expensive at scale.
- [ ] A span event on each rejected request
  > Traces show individual requests, not counts over time.
- [ ] A gauge set to the current rejection total
  > A total that only goes up is a counter. Gauges are for values that go up and down.
`;

export { rawQuizdown }
