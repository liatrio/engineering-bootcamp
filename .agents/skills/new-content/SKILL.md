---
name: new-content
description: Add new bootcamp content (an intro lesson, an intro exercise, or a challenge exercise) by interviewing the user first, then placing and drafting it with them. Use when asked to create, add, or write a section, page, lesson, or exercise in docs/.
---

# New bootcamp content

This skill is interactive. Do not draft anything until discovery is done and the user has agreed on placement and format.

## Flow

1. **Discover.** Read `references/discovery-questions.md` and ask the user those questions, a few at a time. Do not draft yet.
2. **Locate.** Read `docs/_sidebar.md` and search `docs/` by topic. Propose a placement and confirm it. Never default to the end of a chapter or section.
3. **Categorize.** Pick one format from the table, say which and why. The user can override.
4. **Draft with the user.** Open only that format's reference and its golden example. Propose an outline or exercise ideas first, get feedback, then write.
5. **Mechanics.** Read `references/mechanics.md`: front-matter, sidebar, quiz embed, `npm run refresh-front-matter`, `npm run lint`, then the `lesson-style-check` skill.

## Formats

All three keep detailed explanation to a minimum and send learners to official docs. They differ in how much context and guidance they give.

| Format | What it is | Explanation | Guidance | Reference |
| --- | --- | --- | --- | --- |
| Intro lesson | Reading with no exercise | Beginner friendly, tied to earlier lessons | n/a, learners read and discuss | `references/writing-intro-lesson.md` |
| Intro exercise | First hands-on contact | Same beginner framing | Hand-holding: numbered steps, named commands, expected results, `?>` hints | `references/writing-intro-exercise.md` |
| Challenge exercise | Open-ended scenario | Almost none beyond the goal | A goal and vague instructions; learners research and experiment | `references/writing-challenge-exercise.md` |

A page can combine formats, such as an intro lesson followed by an intro exercise. Load each reference as you reach that part.

## Golden examples

Each reference names its golden examples by article title with a `grep` command to find them. Numbered paths go stale when content is reorganized, so trust the title and grep over the "last known path".
