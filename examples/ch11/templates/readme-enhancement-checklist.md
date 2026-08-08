# README Enhancement Checklist

Use this checklist when documenting (or reviewing) an application's architecture in a README. Check off each section as you complete it — a good architecture README covers all of these, even briefly.

- [ ] **System Overview** — a 1-2 paragraph description a new teammate could read in 30 seconds and understand what the system does
- [ ] **Architecture Diagram** — a component or system diagram showing the major pieces and how they connect
- [ ] **Service Responsibilities** — what does each service/component actually do? (one line each is fine)
- [ ] **Communication Patterns** — how do services talk to each other? (HTTP/REST, gRPC, message queue, sync vs. async)
- [ ] **Data Storage** — what databases, caches, or message queues exist, what lives in each, and who owns them
- [ ] **Technology Stack** — languages, frameworks, and key libraries per component
- [ ] **Key Architectural Decisions** — link to ADRs, or briefly explain the "why" behind non-obvious choices
- [ ] **Setup and Running** — how does someone get this running locally, from a clean checkout, with actual commands

## What "Good" Looks Like

- Each section is **accurate** — verified against the code, not guessed from the UI or remembered from a meeting
- Each section is **current** — a README describing a system as it was six months ago is worse than no README, because it actively misleads
- The **audience** is a competent engineer who has never seen this system before — not a co-author who already knows the context
