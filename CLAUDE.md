# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Liatrio's Engineering Bootcamp — a Docsify-powered static documentation site teaching engineering fundamentals with a DevOps focus. Content lives in `docs/` as markdown with YAML front-matter that drives learning-metric visualizations. A small webpack bundle powers interactive elements (charts, word clouds, quizzes); everything else is served statically by Docsify.

## Commands

| Command | What it does |
| --- | --- |
| `npm start` | `build:dev` then `docsify serve --port 3000` (local dev at http://localhost:3000) |
| `npm run build:dev` / `build:prod` | Webpack bundle `src/index.js` → `dist/main.js` (dev = source maps, prod = minified) |
| `npm run lint` | `markdownlint-cli2` over all `**/*.md` (excludes `node_modules/`, `.venv/`, `specs/`) |
| `npm run lint <file.md>` | Lint a single file (still respects global config/excludes) |
| `npm run compare-front-matter` | Dry-run check that front-matter matches `docs/README.md`; exits non-zero if drifted (used in CI) |
| `npm run refresh-front-matter` | Rebuild `docs/README.md` master record from all front-matter |

There is no unit-test suite for the site itself. Runnable code examples under `examples/` have their own tooling (e.g. `examples/ch8/devops-api` uses a Go `Makefile`).

## Architecture

### Docsify site

- `index.html` is the app shell: configures `$docsify` with `basePath: /docs/`, sidebar loading, search, pagination, and edit-on-GitHub. Loads Docsify + plugins from CDN, and quizdown from CDN.
- `docs/_sidebar.md` is the single source of navigation. **Adding a page requires adding its `_sidebar.md` entry** — the front-matter condenser reads `_sidebar.md` to discover files, so an unlisted page is invisible to both nav and metadata.
- `css/`, `img/`, `fontawesome/` are static assets served as-is.

### Webpack bundle (`src/`)

`src/index.js` is the webpack entry (charts via `chart.js` + `chartjs-chart-wordcloud`, quiz modules, sidebar helpers), bundled to `dist/main.js` with babel + `node-stdlib-browser` polyfills (`Buffer`/`process`). Quiz sources live in `src/quizzes/chapter-<N>/<N.X>/<name>.js`. The site loads the built `dist/main.js`, so JS changes require a rebuild (`npm run build:dev`).

### Front-matter metadata system

Each content page carries YAML front-matter keyed by its own path. `.husky/front-matter-condenser.js` walks the files listed in `_sidebar.md`, merges every page's front-matter into one alphabetically-sorted master object, and writes it to the front-matter of `docs/README.md`.

- `docs/README.md` is **generated** — never hand-edit its front-matter; run `npm run refresh-front-matter`.
- The condenser compares sorted JSON; if the master is stale it exits non-zero (blocking commit) and tells you to refresh.
- **Reuse existing `category` and `technologies` values** from `docs/README.md`. These strings are aggregated into word clouds and charts — inconsistent naming fragments the visualizations.

Front-matter template (see `STYLE.md`):

```yaml
---
docs/path/to/file.md:
  category: <reuse an existing category, e.g. Fundamentals, Containerization, CI/CD>
  estReadingMinutes: <integer>
  exercises:              # optional
    - name: <string>
      description: <string>
      estMinutes: <integer>
      technologies: [<reuse existing names>]
---
```

### Spec-Driven Development (`docs/specs/`)

Larger content additions are planned as specs before writing. Each spec is a directory `docs/specs/<NN>-spec-<slug>/` containing a main spec file plus optional `-tasks-`, `-questions-`, `-validation-`, and `-proofs/` files. Spec docs typically cover: Goals, User Stories, Demoable Units of Work (with Functional Requirements + Proof Artifacts), Non-Goals, Design/Repository/Technical Considerations, and Success Metrics. `specs/` is deliberately **excluded from linting** so specs can use freer formatting during design. The `sdd` skill drives this workflow when explicitly invoked.

## Pre-commit hooks (`.husky/pre-commit`)

Runs in order, all must pass:

1. **cspell** — spell-checks staged files (`git diff --cached | npx cspell`)
2. **front-matter condenser** — `node .husky/front-matter-condenser.js update`; fails if `docs/README.md` needs refreshing
3. **markdownlint** — `npm run lint`

If a hook blocks the commit: run `npm run refresh-front-matter` and re-stage `docs/README.md`, fix lint errors, or correct spelling.

## CI/CD (`.github/workflows/`)

- `markdown-linter.yml` — markdownlint on PRs to `master` (excludes `specs/`; skips drafts).
- `test-front-matter.yml` — runs `npm run compare-front-matter` on PRs; fails if front-matter is out of sync.
- `static.yml` — on push to `master`, runs `webpack --config webpack.prod.js` and deploys the repo to GitHub Pages.

## Content authoring rules

- **Headers**: H3 (`###`) is the default in-page level; H2 (`##`) appears as the page's table of contents in nav. See `STYLE.md`.
- **Images**: use HTML `<img>` tags; store in the root `img/` folder. Leave a blank line between HTML blocks and adjacent markdown.
- **Multi-column layouts**: wrap in `<div class="grid2|grid3|grid4">` with inner `<div class="col">` per column.
- **Quizzes**: add the quiz source under `src/quizzes/chapter-<N>/<N.X>/`, embed with a `quizdown` block, and rebuild. The `adding-quiz` skill documents the exact embed markup.
- **Allowed inline HTML** is restricted by `.markdownlint.json` (e.g. `canvas`, `details`, `div`, `span`, `script`, `style`, `quizdown`); tags outside that list will fail lint.

## Key files

- `docs/README.md` — generated master record of all front-matter (do not hand-edit front-matter).
- `docs/_sidebar.md` — navigation + the list the condenser scans.
- `.husky/front-matter-condenser.js` — front-matter merge/validation logic.
- `index.html` — Docsify runtime config and CDN plugins.
- `webpack.common.js` / `webpack.dev.js` / `webpack.prod.js` — bundle config.
- `.markdownlint.json` — lint rules and allowed inline HTML.
- `STYLE.md` — full content style guide.

## Development Workflow

1. Make content changes in appropriate `docs/` subdirectories
2. Test locally with `npm start`
3. Lint content with `npm run lint`
4. Commit changes (pre-commit hooks will validate front-matter)
5. The front-matter condenser automatically updates the master record if needed
