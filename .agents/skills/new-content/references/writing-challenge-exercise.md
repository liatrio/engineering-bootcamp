# Writing a challenge exercise

## What it is

An open-ended scenario. Almost no explanation beyond the goal. The instructions are relatively vague, so learners research and experiment to get there, usually in groups.

## Golden examples

Files get renumbered. Find them by title; the path is only a convenience.

- "KEDA", Exercises "HPAs" and "KEDA": scenario-driven, goal-level steps. Locate: `grep -rl '^# .*KEDA' docs/`
  Last known path: @docs/9-kubernetes-container-orchestration/9.6-keda.md
- "ECS", its exercise: brief explanation, links to official docs, `?>` hints instead of walkthroughs. Locate: `grep -rl '^# ECS' docs/`
  Last known path: @docs/5-cloud-computing/5.2.6-ecs.md
- "Platforms", Exercise 1: a goal list with nested sub-goals. Locate: `grep -rl '^# Platforms' docs/`
  Last known path: @docs/10-platform-engineering/10.2-platforms.md

Read one before drafting.

## Rules

- Build around one scenario (a startup, a failing system). Later exercises continue it.
- State the goal and what must be true at the end. Do not list every command.
- Ask what the learner observes, not what to type.
- Put runnable code and manifests under `examples/` and link them.
- Link official docs instead of explaining. Letting learners explore is the point.
- Use short `?>` hints for gotchas and nudges so the goal list stays terse.
- End on a question that forces the learner to name the limitation or tradeoff they just saw.

## When the user says "a goal and nothing else"

Honor it. The page is the scenario, one line saying where to put the starting files, the goal with its verifiable end state, and the closing question. Leave out `?>` hints, a Deliverables section, constraints lists, and numbered setup. The user's constraint beats the defaults above; offer hints or a facilitator file afterwards instead of adding them unasked.

## Language patterns

- "Your goal is to [outcome]. How do you know it worked?"
- "What happens when [condition]? Why?"
- `?>` hint: "Look into [link]. [One-line pointer]."

## Known gaps in the golden examples

Do not copy these. KEDA and ECS use em dashes and `Exercise N -` style headings that `lesson-style-check` forbids. Use a hyphen or colon.

## You're drifting if

- You are spelling out commands step by step. That is an intro exercise.
- The learner cannot tell when they are done. Add a verifiable end state.
- A hint gives away the answer instead of a direction.
- There is no closing question about the limitation or tradeoff.

## Checklist

- [ ] One scenario, stated up front
- [ ] Goals and observations, not command lists
- [ ] Code under `examples/`, linked
- [ ] External docs linked
- [ ] `?>` hints for gotchas
- [ ] Closing tradeoff question
- [ ] Front-matter `exercises` entry added (see `mechanics.md`)
