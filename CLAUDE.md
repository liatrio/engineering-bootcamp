# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Liatrio's Engineering Bootcamp - a comprehensive educational resource built with Docsify that covers engineering fundamentals with a focus on DevOps practices and tools. The bootcamp is structured as a static documentation site with interactive elements, exercises, and front-matter metadata for tracking learning metrics.

## Development Commands

### Essential Commands

- `npm install` - Install dependencies
- `npm start` - Build development version and serve with Docsify on port 3000
- `npm run serve:docsify` - Serve the documentation site locally
- `npm run build:dev` - Build development version using webpack
- `npm run build:prod` - Build production version using webpack
- `npm run lint` - Run markdown linting across all .md files
- `npm run refresh-front-matter` - Update the master record with new front-matter from exercises

### Docker Development

- `docker build . -t engineering-bootcamp` - Build Docker image
- `docker run -d -p 3000:3000 --name engineering-bootcamp engineering-bootcamp` - Run container
- `docker compose up -d` - Start with Docker Compose
- `docker compose down` - Stop Docker Compose

## Architecture & Structure

### Content Organization

- **docs/** - Main documentation content organized by chapters (1-10)
  - Each chapter covers specific DevOps topics (fundamentals, virtualization, containerization, etc.)
  - Exercises include front-matter metadata with categories, technologies, and time estimates
- **src/** - Source code for Docsify plugins and JavaScript functionality
- **img/** - Static images and assets
- **examples/** - Code examples referenced in exercises

### Key Components

- **Docsify Configuration**: Uses docsify-cli for serving and building
- **Webpack**: Handles bundling of JavaScript components
- **Front-matter System**: YAML metadata in exercises for tracking learning analytics
- **Interactive Elements**: Quiz components and visualizations using Chart.js

### Front-matter Metadata System

The bootcamp uses a sophisticated front-matter system to track learning metrics:
- Each exercise has metadata including category, reading time, technologies, and exercises
- Front-matter is automatically consolidated into `docs/README.md` by a pre-commit hook
- The system generates statistics and visualizations from this metadata
- **IMPORTANT**: When adding new exercises, minimize the number of categories and technologies by reusing existing ones from the master record in `docs/README.md`. This ensures meaningful aggregations and consistent data visualization.

## Important Files

- `docs/README.md` - Master record containing all consolidated front-matter data
- `docs/_sidebar.md` - Navigation structure for the documentation
- `.husky/front-matter-condenser.js` - Script that manages front-matter consolidation
- `STYLE.md` - Style guide for content contributors

## Content Guidelines

- Use H3 headers (`###`) as default within pages
- H2 headers (`##`) appear in navigation as table of contents
- Images should use HTML `<img>` tags and be placed in the root `img/` folder
- Front-matter must follow the specified YAML template for exercises
- Multi-column layouts available using `grid2`, `grid3`, `grid4` CSS classes

### Adding Quizzes

Quiz files go in `src/quizzes/chapter-N/N.X/quiz-name.js`. To embed a quiz in markdown:

```html
<div class="quizdown">
  <div id="chapter-N/N.X/quiz-name.js"></div>
</div>
```

The `id` attribute should match the path relative to `src/quizzes/`. Do NOT use inline scripts or import statements.

## Pre-commit Hooks

- Husky is configured to run front-matter validation before commits
- The system ensures all exercise metadata is properly consolidated
- Run `npm run refresh-front-matter` if front-matter validation fails

## Development Workflow

1. Make content changes in appropriate `docs/` subdirectories
2. Test locally with `npm start`
3. Lint content with `npm run lint`
4. Commit changes (pre-commit hooks will validate front-matter)
5. The front-matter condenser automatically updates the master record if needed
