---
name: move-content
description: Move or renumber a bootcamp chapter, section, or exercise in docs/, updating folders, filenames, front-matter, images, quizzes, links, and the sidebar. Use when asked to move, renumber, reorder, or insert content in docs/.
---

# Move content

Navigation lives in `docs/_sidebar.md` and must match the `.md` file paths. Do not assume numbers; read the current sidebar.

## 1. Scope the move

Ask the user:

- What is moving: a chapter, a section, or an exercise?
- Where should it land? Show the relevant part of `docs/_sidebar.md` and offer concrete positions.
- Is it going into the middle of an existing chapter? If so, neighbors need renumbering (step 6).

Confirm the plan (`<old>` to `<new>`) before changing anything.

## 2. Files

Use `git mv`.

- Chapter: `docs/<old>-<name>/` to `docs/<new>-<name>/`, then rename each `<old>.X-*.md` inside to `<new>.X-*.md`.
- Section: move or rename the `.md` file and fix its number.
- Exercise: cut it from the source section and paste it into the target section. Move its front-matter `exercises` entry with it.

## 3. Front-matter

The front-matter key of each moved section file is its own path. Update it to the new path:

```yaml
docs/<old-path>.md:
  category: <unchanged>
```

becomes `docs/<new-path>.md:`.

## 4. Quizzes

- Move sources under `src/quizzes/chapter-<old>/` to `src/quizzes/chapter-<new>/`, renaming inner `<old>.X.Y` folders.
- Update each embed id in the moved pages: `chapter-<old>/<old>.X.Y/<slug>.js` to `chapter-<new>/<new>.X.Y/<slug>.js`.

## 5. Images and examples

- Images live in root `img/`. Update paths only if the image filename carries the chapter number.
- `examples/` is flat and not chapter-scoped. Do not move it; only fix links that point to it.

## 6. Renumber neighbors

When inserting into the middle of a chapter, every following section needs a new number. Do this before the sidebar step: rename files, front-matter keys, quiz folders, and embeds for each neighbor, working from the last one backwards so names do not collide.

## 7. Sidebar

Update `docs/_sidebar.md` for every moved or renumbered entry. Then re-read it and check each entry resolves to a real file. This step is missed often, so do it on its own.

## 8. Stale references

```bash
grep -rnE '<old-folder-or-path>|chapter-<old>/' . --exclude-dir=node_modules --exclude-dir=.git
```

Fix every cross-link. Use relative paths in `docs/`.

## 9. Finish

1. `npm run refresh-front-matter` and inspect the `docs/README.md` diff.
2. `npm run lint`.
