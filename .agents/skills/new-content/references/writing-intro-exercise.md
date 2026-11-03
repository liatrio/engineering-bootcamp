# Writing an intro exercise

## What it is

A learner's first hands-on contact with a tool. Same beginner-friendly framing as an intro lesson, but with hand-holding: numbered steps, named commands, expected results, and `?>` hints.

## Golden examples

Files get renumbered. Find them by title; the path is only a convenience.

- "Git Basics", Exercise "The Basics". Locate: `grep -rl '^# Git Basics' docs/`
  Last known path: @docs/2-version-control/2.1.1-git-basics.md
- "Containers", Exercise 1. The title matches two pages; use the one with the exercise: `grep -rl '^## Exercise 1' docs/ | xargs grep -l '^# Containers'`
  Last known path: @docs/4-virtual-machines-containers/4.4-containers.md

Read one before drafting.

## Rules

- Start with one or two sentences on what the learner will do and why.
- Number the steps. Name the command or instruction for each, and say what the learner should see.
- Put gotchas in `?>` hints and link official docs for anything deeper.
- Keep explanation minimal and beginner friendly. Tie new ideas to earlier lessons.
- Keep steps few. Split into a second exercise rather than padding one.
- Optional stretch goals go under a labeled extra-credit or deep-dive paragraph.

## Known gaps in the golden examples

Do not copy these.

- "Git Basics" has no scenario and ends on a deliverable that says "be familiar with...". Give the exercise a small scenario and end on a question that makes the learner name something they observed.
- "Containers" Exercise 1 has 13 steps. That length is not a target. Aim for the fewest steps that teach the idea.
- Both may use patterns `lesson-style-check` forbids. Follow the style check, not the example.

## Language patterns

- "Run `[command]`. You should see [result]."
- "Use `[command]` to confirm [state]."
- `?>` hint: "[Gotcha]. See [link]."

## You're drifting if

- Steps say "figure out how to..." instead of naming the command. That is a challenge exercise.
- A step has no observable result.
- You are explaining a concept for a paragraph instead of linking to docs.
- The step list keeps growing past what one sitting can hold.

## Checklist

- [ ] One-or-two-sentence setup
- [ ] Every step names a command and an expected result
- [ ] `?>` hints for gotchas
- [ ] Ends on a question or discussion point, not "be familiar with"
- [ ] Front-matter `exercises` entry added (see `mechanics.md`)
