const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# What makes a system observable rather than just monitored?

- [x] You can answer new questions about its behavior, ones nobody anticipated, without shipping new code
  > Monitoring answers questions you thought to ask in advance. Observability needs richer, connected telemetry.
- [ ] It has dashboards and alerts for CPU and disk usage
  > That's monitoring: watching for problems you already know about.
- [ ] It has more log lines
  > Volume alone doesn't let you answer new questions. The telemetry has to be rich and connected.
- [ ] It never needs alerts
  > Observable systems still alert on known problems.

# Requests to your checkout page are slow, and the request passes through five services. Which signal shows where the time went?

- [x] Traces
  > A trace shows the path of one request through the system as a tree of timed operations.
- [ ] Metrics
  > Metrics show *that* latency is high, but not which operation in a request caused it.
- [ ] Logs
  > Logs describe individual events, without the timing structure across services.
- [ ] None; you need to add print statements
  > Traces answer this without new code, as long as the services are instrumented.

# What does the RED method measure for a request-driven service?

- [x] Rate, errors, and duration
  > RED describes the service from the outside, as its users experience it.
- [ ] Resources, events, and dependencies
  > These aren't the RED signals.
- [ ] Utilization, saturation, and errors
  > That's the USE method, for resources such as CPUs and disks.
- [ ] Latency, traffic, errors, and saturation
  > Those are Google's four golden signals.

# Your SLO is 99.9% of requests succeeding over 30 days. What is your error budget, and what happens when it runs out?

- [x] 0.1% of requests; reliability work takes priority over shipping changes
  > While budget remains, the team can ship quickly. When it's gone, reliability comes first.
- [ ] 99.9% of requests; the team ships faster
  > The budget is the gap between the SLO and perfection.
- [ ] 0.1% of requests; the SLO is lowered automatically
  > The SLO is a deliberate target. Running out of budget changes priorities, not the target.
- [ ] 30 days; the service is turned off
  > The budget is measured in requests, not days.

# Which of these should page an on-call engineer?

- [x] The checkout error rate is above 2% for 5 minutes
  > That's a symptom users feel. Alert on symptoms, so every page means users are affected.
- [ ] A database server's CPU is at 85%
  > That's a possible cause. Users may not be affected, so use it to diagnose, not to page.
- [ ] A disk is 70% full
  > A cause worth watching, but not a symptom users feel.
- [ ] A deployment finished
  > That's an event, not a problem.
`;

export { rawQuizdown }
