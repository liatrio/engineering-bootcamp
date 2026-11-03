---
name: new-section
description: Create a new section page in a bootcamp chapter (content, deliverables, optional exercises) with front-matter and a sidebar entry. Use when asked to add or write a section such as "section 2.6 Runners".
---

# New bootcamp section

Golden examples to replicate. Files get renumbered, so each is named by article title first; search `docs/` for the title if the path is stale.

- "9.6 KEDA" (`docs/9-kubernetes-container-orchestration/9.6-keda.md`): structure, narrative, and front-matter shape.
- "ECS" (`docs/5-cloud-computing/5.2.6-ecs.md`): linking out to documentation instead of explaining it.

Read both before drafting. Both pages use patterns `lesson-style-check` forbids (em dashes, `Exercise N —` headings); use a hyphen or colon in new content.

A section has content, deliverables, and optionally exercises.

## Front-matter

- List each exercise with `name`, `description`, `estMinutes`, and `technologies`.
- Reuse `category` and `technologies` strings from `docs/README.md`.

## Content

- Use a `# N.X Title` heading, then a short paragraph defining the tool and the problem it solves.
- Cover fact and opinion on how the topic relates to DevOps and enterprise software delivery.
- Keep explanations of what things do brief. Link to official docs, or relevant blogs you find, instead of explaining what a thing is in detail. Letting learners explore on their own is a key part of the experience.
- Quote or link the vendor's own description of the tool, and link a good external explanation of tricky concepts.
- Images live in the root `img/` folder and use HTML `<img>` references.

## Exercises

- Exercises are hands-on, intentionally open-ended, and done in groups. Follow the `new-exercise` skill for each one.
- Build exercises around one scenario (a startup, a failing system), with runnable code under `examples/`.
- Later exercises give goals and questions rather than exact commands, so groups have to investigate.
- Put gotchas and pointers in short `?>` hints so numbered steps stay terse.

## Deliverables

- End with `### Deliverables`: higher-level questions participants should be able to discuss afterwards, not tasks.
- Add a quiz embed after the deliverables.

## Steps

1. Get the chapter and section number ("section 2.6 Runners" is chapter 2, `docs/2-<chapter-name>/2.6-runners.md`). If the seed content lacks content, deliverables, or exercises, ask the user for what is missing.
2. Lightly edit the seed content for clarity and concision. Keep its personality and tone.
3. Create the file in the chapter folder, following the golden examples.
4. Write the front-matter.
5. Add the section to `docs/_sidebar.md` in the same change.
6. Run `npm run refresh-front-matter` and `npm run lint`.
7. Run the `lesson-style-check` skill on the new file.
