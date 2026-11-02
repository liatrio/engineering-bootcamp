---
name: new-section
description: Create a new section page in a bootcamp chapter (content, deliverables, optional exercises) with front-matter and a sidebar entry. Use when asked to add or write a section such as "section 2.6 Runners".
---

# New bootcamp section

Golden example to replicate: `docs/9-kubernetes-container-orchestration/9.6-keda.md`. Read it before drafting and match its structure, tone, and front-matter shape.

What makes it the model:

- Front-matter lists each exercise step with `name`, `description`, `estMinutes`, and `technologies`, reusing strings from `docs/README.md`.
- `# N.X Title` heading, then a short paragraph defining the tool and the problem it solves.
- Exercises are `## Exercise N - <Name>` sections that build on each other around one scenario (a startup, a failing system) with runnable code under `examples/`.
- Later exercises give goals and questions rather than exact commands, so groups have to investigate.
- Images live in the chapter's `imgN/` folder and use the `:class=img-center :alt=` Docsify syntax.
- Ends with `### Deliverables` (discussion questions, not tasks) and a quiz embed.

The page uses em dashes and an `Exercise N —` heading; use a hyphen or colon in new content, per `lesson-style-check`.

## Section parts

- Content: fact and opinion on how the topic relates to DevOps and enterprise software delivery.
- Deliverables: higher-level questions participants should be able to discuss afterwards.
- Exercises (optional): hands-on, intentionally open-ended, done in groups. See the `new-exercise` skill.

## Steps

1. Get the chapter and section number ("section 2.6 Runners" is chapter 2, `docs/2-<chapter-name>/2.6-runners.md`). If the seed content lacks content, deliverables, or exercises, ask the user for what is missing.
2. Lightly edit the seed content for clarity and concision. Keep its personality and tone.
3. Create the file in the chapter folder, following the golden example.
4. Write the front-matter, reusing `category` and `technologies` strings from `docs/README.md`.
5. Add the section to `docs/_sidebar.md` in the same change.
6. Run `npm run refresh-front-matter` and `npm run lint`.
7. Run the `lesson-style-check` skill on the new file.
