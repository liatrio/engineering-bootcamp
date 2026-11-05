---
name: move-content
description: Move or renumber a bootcamp chapter, section, or exercise in docs/, updating folders, filenames, front-matter, images, quizzes, links, and the sidebar. Use when asked to move, renumber, reorder, or insert content in docs/.
---

# Move content

Navigation lives in `docs/_sidebar.md` and must match the `.md` file paths. Do not assume numbers; read the current sidebar. The mechanical work is done by two scripts in this skill. Run them from the repo root instead of renaming, rewriting or grepping by hand. If `move.js` is missing, or refuses with an error (it changes nothing when it refuses, for example when a destination already exists outside the move), report the error to the user. If it cannot handle the case, do the same steps by hand: `git mv` files and folders last to first, rewrite each front-matter key, quiz folder and embed id, fix the sidebar, then run `grep -rnE '<old-path>' docs src` for leftovers.

## 1. Scope the move

Ask the user:

- What is moving: a chapter, a section, or an exercise?
- Where should it land? Show the relevant part of `docs/_sidebar.md` and offer concrete positions.
- Is it going into the middle of an existing chapter? If so, neighbors are renumbered (the script does it).

Pick `<old>` and `<new>` as ids: a chapter (`3`), a section (`3.2`) or a sub-section (`3.2.1`), same level on both sides. Confirm the plan (`<old>` to `<new>`) before changing anything.

## 2. Show the plan

```bash
node .agents/skills/move-content/scripts/move.js <old> <new> --dry-run
```

This changes nothing. It prints every `git mv` in execution order, each front-matter key, quiz embed id and link rewrite, and a diff of `docs/_sidebar.md`. Show the user the plan and wait for confirmation. Do not run the real move before they confirm.

If `<new>` is already occupied, the occupied run of sibling numbers is shifted up by one, last to first, so names never collide. When you walk the user through an insert or move, state that order explicitly ("renamed last to first so no filename collides"). Gaps left at `<old>` are not closed; mention that to the user.

## 3. Move

```bash
node .agents/skills/move-content/scripts/move.js <old> <new>
```

It does, in one pass: `git mv` of folders, files and inner `<old>.X-*` renames; the front-matter key of each moved section (its own path, updated by a line-level text replace so the YAML is not reformatted); `src/quizzes/chapter-N/N.X.Y` folders and the `quizdown` embed ids; renumbering of neighbors; relative links between pages; and `docs/_sidebar.md` entries, labels, chapter headings and order. It does not commit.

### Exercise

An exercise is not a path. To move one between sections:

```bash
node .agents/skills/move-content/scripts/move.js --exercise "<exercise name>" <old-section> <new-section> --dry-run
```

Drop `--dry-run` after confirmation. This moves only the `exercises` entry in the front-matter. Cut the exercise body from the source page and paste it into the target page yourself. If the user names an exercise loosely ("the Dockerfile exercise"), search `docs/` front-matter for matching exercise names, offer the real candidates by path and name, and when you confirm the plan say that you will finish with `npm run refresh-front-matter` and `npm run lint` (section 5).

## 4. Images and examples

- Images live in root `img/`. Update paths only if the image filename carries the chapter number. The scripts do not rename images.
- `examples/` is flat and not chapter-scoped. Do not move it; only fix links that point to it.

## 5. Verify

Run in this order:

1. `node .agents/skills/move-content/scripts/check-refs.js --old <old-folder-or-path>` (repeat `--old` for each old path or `chapter-<old>/`). It checks that every quiz embed id resolves under `src/quizzes/`, that each sidebar-linked section's front-matter key equals its own path, and that nothing in `docs/` or `src/` still mentions the old path (`file:line`). Fix every hit by hand, using relative paths in `docs/`. It exits 1 on any failure.
2. `npm run refresh-front-matter`. It exits 1 by design when it rewrites `docs/README.md`: inspect the diff, then run it again until it exits 0. Never hand-edit `docs/README.md`.
3. `npm run compare-front-matter` (checks sidebar targets exist and the master record is in sync).
4. `npm run lint`.

Pre-existing mismatches that check-refs reports in files you did not touch are not part of this move; tell the user rather than fixing them.
