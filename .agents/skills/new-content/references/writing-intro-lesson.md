# Writing an intro lesson

## What it is

Reading content with no exercise. It introduces a concept to a beginner and sets up discussion. Learners read and talk; they do not run commands.

## Golden examples

Files get renumbered. Find them by title; the path is only a convenience.

- "Branching" (the reading before its exercise). Locate: `grep -rl '^# Branching' docs/`
  Last known path: @docs/2-version-control/2.1.2-branching.md
- "AI Agents". Locate: `grep -rl '^# AI Agents' docs/`
  Last known path: @docs/3-AI-Engineering/3.1.2-ai-agents.md

Read one before drafting.

## Rules

- Open with a short paragraph defining the concept and the problem it solves.
- Use simple terms. Tie each new idea to something learners already met.
- Keep explanation brief. Quote or link the vendor's own description and link a good external explainer for tricky parts.
- Relate the topic to DevOps and enterprise software delivery, separating fact from opinion.
- End with `### Deliverables`: questions learners should be able to discuss afterwards, not tasks.

## Language patterns

- "This differs from X, which you already know, in that..."
- "[Vendor] describes it as: ..." followed by a quote and link.
- "For a deeper look, see [link]."

## You're drifting if

- You are explaining something in detail that official docs already cover.
- A learner would need to run a command to follow along. That is an exercise.
- You introduce a term without tying it to earlier content or defining it.
- The deliverables read as steps instead of discussion questions.

## Checklist

- [ ] Opening paragraph names the concept and the problem
- [ ] Links back to prerequisite content
- [ ] External links for depth
- [ ] Deliverables are discussion questions
- [ ] No exercise section
