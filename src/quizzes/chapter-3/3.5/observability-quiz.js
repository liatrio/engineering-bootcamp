const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# What makes a system observable rather than just monitored?

- [x] You can answer questions nobody planned for, without new code
  > Monitoring answers questions you thought to ask in advance. Observability needs richer, connected telemetry.
- [ ] It has dashboards and alerts for every known failure mode
  > That's thorough monitoring: watching for problems you already know about.
- [ ] It records all three signals: logs, metrics, and traces, for every request
  > Having the signals helps, but they also need to be rich and connected enough to answer new questions.
- [ ] It alerts on symptoms users feel, not on internal causes
  > That's good alerting practice, but it's still monitoring.

# Requests to your checkout page are slow, and each request passes through five services. Which signal shows where the time went?

- [x] Traces
  > A trace shows the path of one request through the system as a tree of timed operations.
- [ ] Metrics
  > Metrics show *that* latency is high, but not which operation in a request caused it.
- [ ] Logs
  > Logs describe individual events, without the timing structure across services.
- [ ] Resources
  > Resources describe which service produced telemetry. They aren't a signal.

# What does the RED method measure for a request-driven service?

- [x] Rate, errors, and duration
  > RED describes the service from the outside, as its users experience it.
- [ ] Utilization, saturation, and errors
  > That's the USE method, for resources such as CPUs and disks.
- [ ] Latency, traffic, errors, and saturation
  > Those are Google's four golden signals.
- [ ] Requests, exceptions, and dependencies
  > These aren't the RED signals.

# Your SLO is 99.9% of requests succeeding over 30 days. What is your error budget, and what happens when it runs out?

- [x] 0.1% of requests; reliability work comes first
  > While budget remains, the team can ship quickly. When it's gone, reliability comes first.
- [ ] 0.1% of requests; the SLO is lowered to match the service
  > The SLO is a deliberate target. Running out of budget changes priorities, not the target.
- [ ] 99.9% of requests; deployments are frozen
  > The budget is the gap between the SLO and perfection, here 0.1%.
- [ ] 0.1% of requests; alerts are turned off
  > Alerts matter more, not less, when the budget is gone.

# Which of these should page an on-call engineer?

- [x] The checkout error rate is above 2% for 5 minutes
  > That's a symptom users feel. Alert on symptoms, so every page means users are affected.
- [ ] A database server's CPU is above 90% for 5 minutes
  > That's a possible cause. Users may not be affected, so use it to diagnose, not to page.
- [ ] A log disk has passed 90% of its capacity
  > A cause worth watching, but not a symptom users feel.
- [ ] Memory use on one instance doubled in an hour
  > Also a possible cause, not a symptom users feel.
`;

export { rawQuizdown }
