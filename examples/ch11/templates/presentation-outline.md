# Architecture Walkthrough Presentation Outline

A suggested structure for a 10-15 minute technical walkthrough of a system you've analyzed. Adjust timing to fit your material, but keep the whole thing inside the 10-15 minute target — see the [presentation rubric](presentation-rubric.md) for how this gets evaluated.

## 1. Introduction (1-2 min)

- What system or feature are you presenting?
- Why does it matter / what problem does it solve for the user?

## 2. System Overview (2-3 min)

- Show your **component diagram**
- Explain the high-level architecture: what are the major pieces, and what does each one own?

## 3. Deep Dive (5-7 min)

- Show your **sequence diagram**
- Walk through one complete transaction, step by step, service by service
- Call out the interesting parts: an unexpected hop, an async boundary, a data transformation, a place where things could fail

## 4. Trade-offs and Alternatives (2-3 min)

- What are the pros and cons of how this was built?
- What else could have been done instead, and why wasn't it?
- Reference an ADR if you wrote one for this system

## 5. Q&A (2-3 min)

- Be ready for follow-up questions about decisions and details
- It's fine to say "I don't know, but here's how I'd find out" — that's often a stronger answer than a guess

## Delivery Tips

- **Know your audience.** Presenting to engineers who'll work in this codebase is different from presenting to a manager who wants the executive summary — adjust depth accordingly.
- **Tell a story, not a file listing.** "Here's what happens when a user clicks X" is more engaging (and more useful) than "here are all the services."
- **Use your diagrams as the spine of the talk.** Don't just show them — point at specific parts while you talk through them.
- **Practice against a clock once** before presenting or recording, so you know whether you're going to run long.
