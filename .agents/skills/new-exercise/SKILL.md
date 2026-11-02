---
name: new-exercise
description: Add a new exercise to an existing bootcamp section, including its front-matter entry. Use when asked to create, add, or write an exercise for a docs section.
---

# New bootcamp exercise

Golden example to replicate: "Exercise 2 - HPAs" in `docs/9-kubernetes-container-orchestration/9.6-keda.md`, plus the matching entries in that file's front-matter. Read both before drafting.

What makes it the model:

- A `## Exercise N - <Name>` heading that continues the section's scenario.
- Short context first (why the exercise matters), then numbered steps.
- Steps state the goal and ask what the learner observes, without spelling out every command.
- Ends on a question that forces the learner to name the limitation or tradeoff they just saw.
- Code and manifests live under `examples/`, linked from the exercise.

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
