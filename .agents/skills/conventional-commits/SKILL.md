---
name: conventional-commits
description: Draft, validate, or rewrite Git commit messages using the Conventional Commits spec and this repo's conventions (lowercase type, issue references, branch naming). Read whenever the user asks for help writing a commit message.
---

# Conventional Commits Skill

## When to read this skill

Read this skill whenever the user asks to "write a commit", "commit this", "help me with a commit message", or pastes a draft message asking for review. This skill is the canonical reference for commit message format and quality standards in this repository.

## Gather context first

Before drafting or validating any commit message, run these read-only commands in order:

```bash
git status --short
git diff --staged
git log --oneline -10
git rev-parse --abbrev-ref HEAD
```

- `git status --short` — shows what is staged versus unstaged.
- `git diff --staged` — shows the exact change. If empty, also run `git diff` to show unstaged changes.
- `git log --oneline -10` — provides style reference from recent history to match tone and type usage.
- `git rev-parse --abbrev-ref HEAD` — branch name often encodes an issue ID or feature context.

**Hard rule:** If `git diff --staged` is empty, stop immediately and ask the user whether to stage specific files first or treat the exercise as a draft-only message (no staged diff). Do not invent a commit message describing non-existent changes.

## Conventional Commits format

```text
<type>(<optional-scope>): <subject>
<BLANK LINE>
<optional body, wrapped at 72 chars>
<BLANK LINE>
<optional footers: BREAKING CHANGE, Closes #N, Refs #N, Co-Authored-By, etc.>
```

### Type table

| Type | Use for |
|------|---------|
| `feat` | New user-visible feature |
| `fix` | Bug fix |
| `docs` | Documentation only (README, AGENTS.md, docs/, code comments only) |
| `style` | Formatting, whitespace, missing semicolons — no code-behavior change |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `build` | Build system, dependencies (`package.json`, `package-lock.json`, `webpack.*.js`) |
| `ci` | CI/CD configuration (`.github/workflows/`) |
| `chore` | Routine maintenance, no production code change (dotfile tweaks, `.gitignore`, agent skills and config) |
| `revert` | Reverts a prior commit (subject becomes `revert: <subject of reverted commit>`, body cites the SHA) |

## Repo-specific scope suggestions

Scopes are optional. Use one only when the change is clearly bounded to a single area. If the change touches more than two scopes, omit the scope entirely.

- **Dependencies:** `deps`, `deps-dev` (Renovate commits are most of the history)
- **Content:** the section filename when the change is bounded to one page, as in `fix(8.1-terraform.md): ...`; or a topic such as `quiz`, `sidebar`, `front-matter`
- **Internal:** `skills`, `husky`, `ci`

This list is non-exhaustive. New scopes are acceptable when the name is self-evident.

## Best-practice checklist (beyond the spec)

- **Imperative mood** — write "add X", not "added X" or "adds X". The subject completes the sentence "If applied, this commit will `<subject>`."
- **Subject ≤ 72 chars** — GitHub truncates longer subjects in list views, PR timelines, and email notifications.
- **No trailing period** on the subject line.
- **Lowercase subject** after the colon — matches this repo's existing history (AGENTS.md requires a lowercase type).
- **Name the artifact and the reason** - AGENTS.md rejects subjects like "update" or "fixes".
- **Reference the GitHub issue in the subject where applicable** - e.g. `docs: update docker-compose v1 syntax to docker compose v2 (#468)`.
- **Never bypass the pre-commit hook** (`--no-verify`). If it fails on front-matter, run `npm run refresh-front-matter` and commit the regenerated `docs/README.md` with the change.
- **Branch names** follow `<type>/<slug>`, e.g. `docs/move-version-control-to-ch1`.
- **Atomic commits** — one logical change per commit. If the diff mixes a feature and an unrelated fix, instruct the user to stage them separately with `git restore --staged <file>` or `git add -p` before committing.
- **Body wraps at 72 chars** — improves `git log` readability in narrow terminals and email clients.
- **Body explains "why", not "what"** — the diff already shows what changed. The body provides reasoning, constraints, or decisions that the diff cannot convey.
- **Issue/PR footers** — use `Closes #123` for issues the commit fully resolves, `Refs #123` for partial work, `Fixes #123` as a GitHub alias for `Closes`. Footers go after the blank line following the body.
- **Breaking changes** — append a `BREAKING CHANGE:` footer, or use `!` after the type/scope (e.g. `feat(api)!: drop legacy quiz schema`). When using `!`, the footer must still describe the migration path.
- **Co-author lines** — follow the attribution instructions of the current harness or the user; don't add or invent trailers beyond that.
- **No secrets in messages** — never paste API keys, tokens, or internal URLs into subject lines, bodies, or footers.
- **One commit, one diff narrative** — if you cannot summarize the change in a single subject line under 72 chars, the commit is probably too large. Consider splitting.

## Validating or rewriting a draft

When the user supplies a draft message (inline or in conversation):

1. Parse the draft against the Conventional Commits format template above.
2. List every violation with its location and the rule it breaks.
3. Offer a rewritten version immediately below the violations list.
4. If the draft is already conformant, say so explicitly and leave it untouched.

## Examples (drawn from this repo's history)

### Good examples

- `docs: move version control section to end of chapter 1 (#911)` - type, artifact and reason, issue reference.
- `fix(8.1-terraform.md): terraform resource names in prose to match those in code blocks` - scope names the page.
- `chore(deps): update dependency webpack to v5.112.0 (#1003)` - dependency bump.

### Bad examples and rewrites

**`update stuff`** - no type, vague verb.
Rewrite: `docs: fix broken image links in chapter 4`

**`Docs(ch3): Added new exercise. closes the bug.`**
Violations: capitalized `Docs`, past-tense "Added", trailing period, `closes the bug` is not a valid footer token.
Rewrite:

```text
docs(3.2-llms.md): add prompt-iteration exercise

Closes #123
```

## Multi-commit recommendations

When the staged diff clearly contains multiple logical changes (e.g. a new feature plus an unrelated dependency bump), propose splitting before drafting any message:

1. Explain which files belong to which logical unit.
2. Provide the exact commands to un-stage the files that belong to the second commit:
   ```bash
   git restore --staged <file>   # or: git reset HEAD <file>
   # — or for partial staging —
   git add -p <file>
   ```
3. Draft a commit message for the first logical unit only.
4. Remind the user to stage the remaining files and ask again for the second commit.
