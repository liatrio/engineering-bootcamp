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

- Reuse `category` and `technologies` strings from `docs/README.md`. Visualizations aggregate by exact match, so new spellings fragment the data.
- Never hand-edit the front-matter block in `docs/README.md`.

## Sidebar

- Add a new page to `docs/_sidebar.md` in the same change that creates the file. The pre-commit hook fails otherwise.

## Content conventions

- Default heading level inside a page is `###`.
- Images live in root `img/` and use HTML `<img>`, never Markdown `![]()` or a path next to the page.
- Put a blank line between adjacent HTML and Markdown blocks.
- Put gotchas and pointers in short `?>` hints so numbered steps stay terse.
- Keep code fences to 10 lines or fewer. Longer code lives under `examples/` and is linked.
- Link to other pages with relative paths (`../3-.../3.2-foo.md`), not Docsify hash paths.
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
