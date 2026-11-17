# Repo skills

Canonical skills for this repo. `.claude/skills` and `.github/skills` are symlinks to this directory; add new skills here only.

On Windows, enable symlinks before cloning (`git config --global core.symlinks true`, plus Developer Mode or an elevated shell). Without them `.claude/skills` and `.github/skills` check out as plain text files and skills are not discovered.

## new-content

Adds new bootcamp content: an intro lesson (reading only), an intro exercise (hand-held, with numbered steps and hints), or a challenge exercise (open-ended scenario). It is interactive and does not draft until it has interviewed you about the topic, agreed a placement in the sidebar, and picked a format. It then drafts from a golden example and handles the mechanics: front-matter, sidebar, quiz embed, `npm run refresh-front-matter`, `npm run lint`, and a `lesson-style-check` pass.

Example prompts:

- "Add a new section on Kubernetes network policies to the containers chapter."
- "Write an intro exercise where learners deploy a container to ECS."
- "Create a challenge exercise on debugging a failing CI pipeline."

## move-content

Moves or renumbers a chapter, section, or exercise. It confirms the plan first with a dry run, then `scripts/move.js` does the `git mv` and updates front-matter keys, quiz sources and embed ids, neighbor numbering, cross-links, and `docs/_sidebar.md`. `scripts/check-refs.js` then checks quiz ids, front-matter keys and leftover references.

Example prompts:

- "Move the version control section to chapter 1 as section 1.3."
- "Insert a new chapter after chapter 4 and renumber everything after it."
- "Move the Docker Compose exercise from 2.2 into 2.3."

## lesson-style-check

Scans section markdown for 14 recurring AI-writing patterns, such as bolded lead-in sentences, em dashes, Title Case headings, negate-then-restate, and vague attributions. A script (`scripts/scan.js`) does the mechanical matching on markdown text only, so code and front-matter are ignored, and the skill reads the file for the patterns that need judgment. It reports hits. It does not rewrite existing content unprompted.

Example prompts:

- "Run lesson-style-check on docs/3-ci-cd/."
- "Check the section I just wrote for AI-isms before I open a PR."
- "Scan chapter 5 for em dashes and bolded lead-ins, and just report them."

## dead-link-check

Audits external URLs in `docs/` with `scripts/check-links.js`, which extracts links from the markdown AST and checks them with `curl`. A non-200 is treated as a lead rather than a verdict: 403 or 503 from publisher sites is often anti-bot blocking, so each failure is diagnosed before fixes are proposed or applied. It looks for redirects and systematic migrations.

Example prompts:

- "Check all external links in docs/ and tell me which are actually dead."
- "Run dead-link-check on chapter 7 and apply the fixes for moved URLs."
- "Several links to the AWS docs are failing. Are they dead or just blocking curl?"

## Evals

Each skill keeps eval cases under `<skill>/evals/<case>/` (`case.yaml`, `prompt.md`, `graders/`, optional `files/` and a scaffold script). Run them with `claude plugin eval <path> --scaffold --model <model> --max-cost-usd <usd>`.

- Scaffold scripts run in a fresh empty temp dir, not in your checkout. Each case's `place-files.sh` is a short stub that sources `_shared/evals/lib.sh`, because the eval runner rejects scaffold paths outside the case dir and does not tell the script which case it is running. The library refuses to run in the repo checkout, in an existing git repo, or in a non-empty dir.
- `prompt.md` frontmatter sets `max_turns`, `timeout_seconds`, `allowed_tools` and `disallowed_tools`. Give a case only the tools it needs: answer-only cases get read tools, script cases get a `Bash(node .agents/skills/<skill>/scripts/*:*)` pattern, and only cases that expect a file change get `Write` or `Edit`.
- The model is not set in the case. Pass `--model` so results are comparable between runs.
