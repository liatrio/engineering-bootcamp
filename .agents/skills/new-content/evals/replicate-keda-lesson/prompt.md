---
tags: [engineering-bootcamp, on-demand]
max_turns: 45
timeout_seconds: 1200
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash(ls:*), Bash(cat:*), Bash(grep:*), Bash(npm run:*), Bash(node .agents/skills/*/scripts/*:*)]
disallowed_tools: [WebFetch, Agent]
---

Add a KEDA section to chapter 9, right after the HPAs section (9.5). Don't ask me questions, here is everything:

- Audience: learners who just finished the HPAs section and know basic Kubernetes.
- Outcome: they can explain why a CPU-based HPA fails to protect a queue consumer under a sudden surge, and they can scale on queue depth with KEDA instead.
- Format: challenge exercise built around one scenario. A cash-strapped e-commerce startup with a flash sale next week, and a Redis database that can only hold so many queued orders before it drops them. They also need to scale back down afterwards.
- The system already exists under examples/keda (checkout-service, order-processor, Redis, a k6 load test, a Taskfile that stands up k3d). Use it, don't rebuild it.
- Progression: stand the system up, run the flash sale load test and watch the consumer fall behind, try fixing it with a CPU-based HPA, remove the HPA and install KEDA, write a ScaledObject on Redis queue depth, rerun the load test and compare the three runs.
- Keep explanations short and link the official docs. Pick the section number, front-matter, estimated times and everything else yourself, and draft the whole page.

The files to work on are in the current directory, including .agents/skills/.
