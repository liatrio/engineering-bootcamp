---
name: new-exercise
description: Add a new exercise to an existing bootcamp section, including its front-matter entry. Use when asked to create, add, or write an exercise for a docs section.
---

# New bootcamp exercise

- Prompt the user for the exercise name if one is not provided.
- Append a new exercise at the end of the current section file, matching this template:

```markdown
## <Exercise Name>

### Overview
<generated exercise overview>

#### Steps
<Series of vague high level steps to complete the exercise>
```

- Every exercise needs a matching entry in the section's front-matter at the top of the file:

```yaml
---
docs/6-release-management/6.3.2-helm.md:
  category: Container Orchestration
  estReadingMinutes: 15
  exercises:
    -
      name: <Exercise Name>
      description: <generated exercise overview>
      estMinutes: <estimated time to complete the exercise in minutes>
      technologies:
      - <Array of key technologies>
---
```

- Reuse existing `category` and `technologies` strings from `docs/README.md`. Do not invent variants (e.g. "K8s" vs "Kubernetes"); the visualizations aggregate by exact match.
- Afterwards run `npm run refresh-front-matter` and `npm run lint`.
