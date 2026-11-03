---
name: move-chapter
description: Renumber a bootcamp chapter (e.g. "move chapter 9 to chapter 10"), updating folders, filenames, front-matter, images, quizzes, links, and the sidebar. Use when asked to move or renumber a chapter in docs/.
---

# Move a chapter

Each `docs/N-<name>/` folder is a chapter. It holds `N.X-*.md` section files. Navigation lives in `docs/_sidebar.md` and must match the `.md` file paths.

The steps below use "move chapter 9 to chapter 10" as the example.

<!-- markdownlint-disable MD033 -->
1. Move `docs/9-<chapter-name>` to `docs/10-<chapter-name>` (use `git mv`).
2. Rename all `9.*.md` files in the new folder, e.g. `for f in docs/10-<chapter-name>/9.*.md; do mv "$f" "${f/9./10.}"; done`.
3. Search the new folder for links to `.md` files and images in the old location (e.g. `docs/9-<chapter-name>/9.1-overview.md`) and update them to chapter 10. Images live in root `img/`; update their paths only if they are named after the chapter.
4. Update the front-matter key of every section file to its new path. Before:

   ```yaml
   ---
   docs/9-kubernetes-container-orchestration/9.3-probes.md:
     category: Container Orchestration
     estReadingMinutes: 10
   ---
   ```

   After:

   ```yaml
   ---
   docs/10-kubernetes-container-orchestration/10.3-probes.md:
     category: Container Orchestration
     estReadingMinutes: 10
   ---
   ```

5. `examples/` is flat and not chapter-scoped. Do not move it; only update links in the chapter that point to it.
6. Move quiz sources from `src/quizzes/chapter-9` to `src/quizzes/chapter-10`, renaming inner folders to match (e.g. `9.3.1` to `10.3.1`).
7. Update quiz embeds in the moved `.md` files. Before:

   ```html
   <div class="quizdown">
       <div id="chapter-9/9.1.4/end-of-engineer-checkpoint.js" ></div>
   </div>
   ```

   After:

   ```html
   <div class="quizdown">
       <div id="chapter-10/10.1.4/end-of-engineer-checkpoint.js" ></div>
   </div>
   ```

8. Update the chapter 9 section of `docs/_sidebar.md` to point at chapter 10.
9. Double check the sidebar entries now point to chapter 10. This step is missed frequently.
10. Grep the whole repo for stale references: `grep -rnE '9-<chapter-name>|chapter-9/' . --exclude-dir=node_modules --exclude-dir=.git`. Fix every cross-link.
11. Run `npm run refresh-front-matter` and `npm run lint`.
<!-- markdownlint-enable MD033 -->
