const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# Which structured log line follows the advice on this page?

- [x] \`{"level": "WARN", "message": "user rejected", "reason": "name_required", "trace_id": "0018e0..."}\`
  > A short, constant message, with the variable parts in fields you can filter on.
- [ ] \`{"level": "WARN", "message": "Rejected user create from 10.0.0.7: name required"}\`
  > The variable parts are buried in the message, so you'd need a regular expression to search them.
- [ ] \`WARNING Rejected user create from 10.0.0.7: name required\`
  > That's free-form text: easy to read, hard to search.
- [ ] \`{"message": "user rejected"}\`
  > It's missing the level, the reason, and the trace ID needed to filter and correlate.

# Your service rejects a request because the name is missing, and responds with \`400\`. Which level fits?

- [x] \`WARNING\`
  > Something unexpected that the application handled.
- [ ] \`ERROR\`
  > Nothing failed that needs someone's attention. Overusing ERROR trains people to ignore it.
- [ ] \`CRITICAL\`
  > The application can continue.
- [ ] \`DEBUG\`
  > A rejected request is a significant event, and DEBUG is usually off in production.

# Which of these should you avoid writing to logs? Select all that apply.

- [x] A user's password
  > Logs are copied, shipped, and retained far more widely than databases.
- [x] An access token
  > Anyone who can read the logs could use it.
- [x] A session ID
  > It can be used to hijack the session.
- [ ] The request's trace ID
  > Including it lets you move between logs and traces.
- [ ] The HTTP route
  > Routes aren't sensitive and help you understand the event.

# Where should a containerized application write its logs?

- [x] To standard output, letting the platform collect them
  > Containers, Kubernetes, and log agents all expect this.
- [ ] To a file inside the container
  > The file disappears with the container, and the platform can't collect it.
- [ ] Directly to the log database from application code
  > That couples the application to one backend. Let the platform handle shipping.
- [ ] Nowhere; use traces instead
  > Logs carry detail about individual events that other signals don't.

# You want to know how many times users were rejected each minute. What's the best tool?

- [x] A metric
  > Counting with a metric is far cheaper than searching millions of log lines.
- [ ] A log line per rejection, counted at query time
  > It works, but it's expensive at scale.
- [ ] A trace per rejection
  > Traces show the path of one request, not counts over time.
- [ ] An \`ERROR\` log for each rejection
  > A rejection isn't an error, and logs are the expensive way to count.
`;

export { rawQuizdown }
