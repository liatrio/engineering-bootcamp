# Mechanics

Run these after the content is drafted and the user is happy with it.

## Front-matter

- Every page linked from `docs/_sidebar.md` carries a front-matter block matching the template in `STYLE.md`.
- Add one `exercises` entry per exercise:

  ```yaml
  - name: <Exercise Name>
    description: <one-sentence summary>
    estMinutes: <minutes>
    technologies:
    - <existing technology string>
  ```

- Reuse `category` and `technologies` strings from `docs/README.md`. Visualizations aggregate by exact match, so new spellings fragment the data. If no existing string fits, use one new canonical label in the standard casing, and let `npm run refresh-front-matter` add it to `docs/README.md`.
- List the existing strings with this command (run from the repo root) and pick from them:

  ```bash
  node -e "const m=require('gray-matter')(require('fs').readFileSync('docs/README.md','utf8')).data;const c=new Set(),t=new Set();for(const e of Object.values(m)){c.add(e.category);for(const x of e.exercises||[])for(const y of x.technologies||[])t.add(y)}console.log([...c].sort().join('\n')+'\n--\n'+[...t].sort().join('\n'))"
  ```

- Never hand-edit the front-matter block in `docs/README.md`.

## Sidebar

- Add a new page to `docs/_sidebar.md` in the same change that creates the file. The pre-commit hook builds `docs/README.md` from sidebar links only, so an unlinked page is left out of the master record, and a sidebar link to a missing file fails the hook.

## Content conventions

- Default heading level inside a page is `###`.
- Images live in root `img/` and use HTML `<img>`, never Markdown `![]()` or a path next to the page.
- Put a blank line between adjacent HTML and Markdown blocks.
- Put gotchas and pointers in short `?>` hints so numbered steps stay terse.
- Keep code fences to 10 lines or fewer. Longer code lives under `examples/` and is linked.
- Link to other pages with paths from the `docs/` root (`3-.../3.2-foo.md`), even within the same chapter, not page-relative paths or Docsify hash paths. Docsify resolves links from `/docs/`, not from the current page.
- Use `docker compose` (v2), not `docker-compose`.
- Link to official docs instead of explaining a tool in detail.

## Quiz embed

Source goes in `src/quizzes/chapter-N/N.X/<slug>.js`. Embed it after the deliverables:

```html
<div class="quizdown">
  <div id="chapter-N/N.X/<slug>.js"></div>
</div>
```

Do not inline `<script>` tags or `import` statements.

## Finish

1. `npm run refresh-front-matter`, then inspect the `docs/README.md` diff.
2. `npm run lint`.
3. Run the `lesson-style-check` skill on the new or changed file.
