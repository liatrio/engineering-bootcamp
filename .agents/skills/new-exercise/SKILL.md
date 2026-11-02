---
name: new-exercise
description: Add a new exercise to an existing bootcamp section, including its front-matter entry. Use when asked to create, add, or write an exercise for a docs section.
---

# New bootcamp exercise

Golden examples to replicate. Files get renumbered, so each is named by article title first; search `docs/` for the title if the path is stale.

- "Exercise 2 - HPAs" in the article "9.6 KEDA" (`docs/9-kubernetes-container-orchestration/9.6-keda.md`), plus its front-matter entries: scenario-driven, goal-level steps.
- The exercise in the article "ECS" (`docs/5-cloud-computing/5.2.6-ecs.md`): brief explanation, with links to official docs and `?>` hints instead of walkthroughs.

Read both before drafting.

What makes it the model:

- A `## Exercise N - <Name>` heading that continues the section's scenario.
- Short context first (why the exercise matters), then numbered steps.
- Steps state the goal and ask what the learner observes, without spelling out every command.
- Ends on a question that forces the learner to name the limitation or tradeoff they just saw.
- Code and manifests live under `examples/`, linked from the exercise.
- Links to official external docs (or relevant blogs the author finds) are used often instead of explaining what a thing is in detail. Letting learners explore on their own is a key part of the experience.
- Gotchas go in short `?>` hints so the numbered steps stay terse.

The page uses an em dash in the heading; use a hyphen or colon in new content, per `lesson-style-check`.

## Steps

1. Ask for the exercise name and target section if not given.
2. Append the exercise to the end of the section, before `### Deliverables` if one exists.
3. Add a matching entry to the section's front-matter `exercises` list:

   ```yaml
   - name: <Exercise Name>
     description: <one-sentence summary>
     estMinutes: <minutes>
     technologies:
     - <existing technology string>
   ```

4. Reuse `category` and `technologies` strings from `docs/README.md`. Novel spellings fragment the visualizations, which aggregate by exact match.
5. Run `npm run refresh-front-matter` and `npm run lint`.
