---
name: dead-link-check
description: Audit external links in docs/ for dead, redirected, or migrated URLs, then propose or apply fixes. Read whenever the user asks to check for dead links or broken sources.
---

# Dead Link Check

## When to read this skill

Read this skill whenever the user asks to scan for dead/broken links, or audit the references in a section.

## The core problem this skill solves

A naive link check treats "curl didn't return 200" as "dead link." That's wrong often enough to make the naive approach actively harmful: it "fixes" links that were never broken, and it can miss the actual signal (a systematic migration) hiding among the noise. The whole value of this skill is one judgment call, applied consistently:

**A non-200 result is a lead, not a verdict. Find out *why* before you act.**

## Procedure

1. **Extract.** `grep -rohE 'https?://[^)"'"'"'[:space:]>]+' docs --include='*.md' | sort -u`. Scope to a single chapter (`docs/N-*/`) when asked; skip `docs/README.md` (auto-generated). Check `examples/` only if asked. Internal links follow the cross-link rule in AGENTS.md (relative paths, not `#/` hashes).
2. **Check.** `curl -s -o /dev/null -w "%{http_code}\n" -A "<browser UA>" -L --max-time 10 "$URL"` for each. Batch it; resume from where a long run stops rather than restarting.
3. **Diagnose every non-200 before deciding it's dead:**
   - `403`/`503` from academic/API/publisher sites (ACM, DOI, university, OpenAI, Google AI docs, etc.) is usually an anti-bot challenge a real browser would pass — not proof of death. Cross-check with `WebFetch` before concluding either way.
   - A block page from a network filter or TLS-intercepting proxy is the *network's* verdict, not the site's. Get the real answer with `curl -v` and read the actual TLS/HTTP handshake.
   - `404`, DNS failure (`Could not resolve host`), or a TLS cert issued for a *different* domain than requested — these are real. Confirm with `curl -v`, then treat as genuinely dead.
   - A `3xx` that redirects to a sane new URL isn't dead at all — but if the *same* redirect shows up across many files, that's a migration in progress. Flag it and offer to fix all instances now, before the old domain's redirect gets retired.
4. **Report before fixing.** Group findings: fine / likely-false-positive-not-fixed / genuinely-dead / migration-pattern. Never silently "fix" something that was only a bot-blocking false positive.
5. **Replace carefully, if asked to fix.** Prefer the vendor's current page > a Wayback Machine snapshot > an independently-verified alternative mirror (e.g. confirm a DOI via the Crossref API, don't just pattern-match on title). Verify the replacement resolves before writing it.
6. **A verified replacement can still fail for this user specifically.** If the user reports a fix you already verified is blocked on their end (their IT blocks `web.archive.org`, a TLD, etc.), don't just re-confirm it works from your side — get a different replacement that isn't on the blocked host, and independently verify *that* one's identity too.
