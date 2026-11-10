---
name: move-content
description: Move or renumber a bootcamp chapter, section, or exercise in docs/, updating folders, filenames, front-matter, images, quizzes, links, and the sidebar. Use when asked to move, renumber, reorder, or insert content in docs/.
---

# Move content

Navigation lives in `docs/_sidebar.md` and must match the `.md` file paths. Do not assume numbers; read the current sidebar. The mechanical work is done by two scripts in this skill. Run them from the repo root instead of renaming, rewriting or grepping by hand. Run each script as its own plain command, never chained with `;`, `&&` or pipes: compound lines are denied under restrictive permission modes, and a chained failure hides which step failed. If `move.js` is missing, or refuses with an error (it changes nothing when it refuses, for example when a destination already exists outside the move), report the error to the user. If it cannot handle the case, do the same steps by hand: `git mv` files and folders last to first, rewrite each front-matter key, quiz folder and embed id, fix the sidebar, then run `grep -rnE '<old-path>' docs src` for leftovers.

## 1. Scope the move

Ask the user:

- What is moving: a chapter, a section, or an exercise?
- Where should it land? Show the relevant part of `docs/_sidebar.md` and offer concrete positions.
- Is it going into the middle of an existing chapter? If so, neighbors are renumbered (the script does it).
- Is a new page about to be written at the old position? Then the user wants to open a gap, not move a page.

Pick `<old>` and `<new>` as ids: a chapter (`3`), a section (`3.2`) or a sub-section (`3.2.1`), same level on both sides. Chapters work the same way as sections: folders, nested `N.X.Y-*` pages, quiz folders and the sidebar chapter order are renumbered together. Confirm the plan (`<old>` to `<new>`) before changing anything.

Two modes, both renamed last to first so no filename collides:

- Move (default). Within one parent the move closes the gap it leaves: `3.1` to `3.3` makes `3.2` become `3.1` and `3.3` become `3.2`. Moving to a different parent shifts the occupied run at `<new>` up by one and leaves a gap at `<old>`; say so.
- Open a gap (`--insert`). `move.js 3.3 3.4 --insert` renames `3.3` and everything after it up by one, so a new page can be written at `3.3`. The same flag with `<old>` below `<new>` shifts the occupied run from `<new>` up instead of closing the gap.

## 2. Show the plan

```bash
node .agents/skills/move-content/scripts/move.js <old> <new> --dry-run
```

This changes nothing. It prints every `git mv` in execution order, each front-matter key, quiz embed id and link rewrite, and a diff of `docs/_sidebar.md`. Show the user the plan and wait for confirmation. Do not run the real move before they confirm.

When you walk the user through an insert or move, state the rename order explicitly ("renamed last to first so no filename collides") and list the real old-to-new mappings from the plan, including sub-sections. Say whether a gap is left at `<old>`.

## 3. Move

```bash
node .agents/skills/move-content/scripts/move.js <old> <new>
```

It does, in one pass: `git mv` of folders, files and nested `<old>.X.Y-*` pages; the front-matter key of each moved section (its own path, updated by a line-level text replace so the YAML is not reformatted); `src/quizzes/chapter-N/N.X.Y` folders and the `quizdown` embed ids; renumbering of neighbors; links between pages; and `docs/_sidebar.md` entries, labels, chapter headings and order. Page links follow the repo convention, written from `docs/` (`3-demo/3.1-first.md`); the script rewrites links to moved pages, keeps Docsify attributes such as `":ignore"` and `":class=x"`, and rewrites a page-relative link in a moved page to the docs-root form. It does not commit.

### Exercise

An exercise is not a path. To move one between sections:

```bash
node .agents/skills/move-content/scripts/move.js --exercise "<exercise name>" <old-section> <new-section> --dry-run
```

Drop `--dry-run` after confirmation. This moves only the `exercises` entry in the front-matter. Cut the exercise body from the source page and paste it into the target page yourself. If the user names an exercise loosely ("the Dockerfile exercise"), search `docs/` front-matter for matching exercise names, offer the real candidates by path and name, and when you confirm the plan say that you will finish with `npm run refresh-front-matter` and `npm run lint` (section 5).

## 4. Images and examples

- Images live in the chapter's own `img/` folder (`docs/N-name/img/`), or in the root `img/` when several chapters use them, and pages refer to them page-relative (`img/x.svg`, `../../img/x.svg`). A chapter move carries its `img/` folder along. When a section moves to another chapter, `move.js` moves an image from the old chapter's `img/` only if every page that uses it moves too, and the dry-run plan lists those `git mv` lines. If the plan prints a `WARNING` about a shared image, ask the user whether to copy it or put it in the root `img/`. After the move, check image references in the moved pages and rename images whose filename carries a chapter number by hand.
- `examples/` is flat and not chapter-scoped. Do not move it; only fix links that point to it.

## 5. Verify

Run in this order:

1. `node .agents/skills/move-content/scripts/check-refs.js --old <old-folder-or-path>` (repeat `--old` for each old path or `chapter-<old>/`). It checks that every quiz embed id resolves under `src/quizzes/`, that each sidebar-linked section's front-matter key equals its own path, that nothing in the repo still mentions the old path (`file:line`, matched on path boundaries; `docs/README.md` is skipped because `npm run refresh-front-matter` regenerates it, so never hand-edit it). Fix every hit by hand. It exits 1 on any failure. Then run `npm run lint:links`, which checks that page links (written from the `docs/` root) and page-relative images resolve.
2. `npm run refresh-front-matter`. It exits 1 by design when it rewrites `docs/README.md`: inspect the diff, then run it again until it exits 0. Never hand-edit `docs/README.md`.
3. `npm run compare-front-matter` (checks sidebar targets exist and the master record is in sync).
4. `npm run lint`.

Pre-existing mismatches that check-refs reports in files you did not touch are not part of this move; tell the user rather than fixing them.
