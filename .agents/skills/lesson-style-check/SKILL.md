---
name: lesson-style-check
description: Scan bootcamp section markdown in docs/ for the specific rhetorical AI-isms that recur in AI-assisted course content (bolded lead-in sentences, negate-then-restate, personification, em dashes, Title Case headings, rule-of-three padding, throat-clearing meta-commentary, unsourced claims, off-register idioms, banned vocabulary, copula avoidance, vague attributions, hollow intensifiers, confidence-calibration announcers). Use when checking section style, scanning for AI-isms, or reviewing a new section before merge.
---

# Section Style Check

## Why this exists

A fast, cheap check for the specific patterns that recur in AI-assisted course prose, so a scan doesn't require re-deriving the list. It is not a full editorial pass. Ported from a sibling course-content repo, where the list was built from manual review; the patterns are generic, but expect some to hit existing content here. Report hits on untouched content rather than rewriting it unprompted.

Bootcamp conventions take precedence over this list: `STYLE.md` and `AGENTS.md` (H3 default heading level, HTML-in-markdown rules, `Deliverables` sections).

## Mechanical scan

Run from the repo root:

```bash
node .agents/skills/lesson-style-check/scripts/scan.js [--json] [--headings] [files...]
```

With no files it scans markdown changed on the current branch versus `master` plus untracked markdown under `docs/`, and always skips `docs/README.md`. It is a read-only reporter: it exits 0 whether or not it finds anything, and exits 2 if it crashes. Each finding is one line, `file:line:pattern:kind:text`, where `kind` is:

- `hit`: report it. Patterns 1, 4, 9, 11, 12, 13, the flag-on-sight words of 10, and pattern 14 once 2+ openers share a section.
- `candidate`: needs a context read before reporting (the flourish-or-literal words of pattern 10).
- `advisory`: pattern 6 Title Case headings, only when `--headings` is passed (use it for new files; existing headings mix styles and the advisory is mostly noise there). Report as borderline, never auto-fix.

The script matches text nodes only, so code fences, inline code, HTML, and front-matter are never matched. Prefer the script over ad-hoc `grep` for the mechanical patterns, because grep also matches inside code fences and front-matter. If the script is missing or exits non-zero, say so, then check the same patterns with `grep -n` on the words and phrases listed below and read the hits in context, treating anything inside a code fence as a false positive. Read the file yourself for the judgment patterns (2, 3, 5, 7, 8) and for the context checks below.

## The 14 patterns

1. **Bolded lead-in sentence opening a paragraph or list item** - `**Do X.** Explanation follows.` The bold is doing the job a real list item or a plain sentence should do.
   - Mechanical (scan.js): the first child of a paragraph is bold, starts with a capital, and ends in a period. A bold question (`**Where is the data?**`) or a bolded title is not a lead-in and is not reported.
   - Exception: a bolded *term* mid-sentence defining jargon (`A **tool execution error** is...`) is glossary style, not this pattern - only flag when the bold spans a complete sentence AND sits at the start of a paragraph/bullet.

2. **"It's not X, it's Y" / negate-then-restate**, including the split-sentence form across two sentences ("X is not a fixture. It is an application.").
   - Judgment only. Read the surrounding sentence - the joined and split forms both count.

3. **Personification of code or systems** ("the data model fights you," "the server insists," "the schema wants").
   - Judgment only. Read for a system/abstraction given a human disposition or intent it doesn't have.

4. **Em dashes (—) or double-hyphen substitutes (--) mid-sentence.**
   - Mechanical (scan.js, prose only; `--flag` in code is ignored). Target is zero in new prose. About a dozen existing files contain em dashes, so report those but don't rewrite them unprompted.

5. **Throat-clearing meta-commentary before a list or example** ("One trap, and it is a test:", "Everything above compresses to four mistakes:").
   - Judgment only. Read the sentence immediately before any list/table/code block and ask whether it adds information or just announces that information is coming.

6. **Title Case headings** instead of sentence case.
   - Mechanical, advisory (scan.js): a heading where every content word is capitalized (`## What Kubernetes Is at the Protocol Level`) is the tell; a proper noun with lowercase connectors is fine.
   - Advisory only: existing bootcamp headings mix Title Case and sentence case (`## LLM Capabilities`). Match the surrounding file, and don't flag recurring names such as `Learning Objectives` and `Deliverables`. Never mass-convert headings in existing files. The script cannot tell proper nouns (`Docker Compose`) from Title Case, so read each advisory.

7. **Rule-of-three padding** ("fast, reliable, and scalable") where two items or a plain sentence carries the same information.
   - Judgment only. Read any comma-separated adjective or short-phrase list of exactly three and ask whether the third item earns its place or just completes the triad.

8. **Unsourced confident claims about tool/API behavior** that aren't traceable to a linked doc or the sample code under `examples/` referenced in the section.
   - Judgment only. Cross-check claims against the section's inline links or the `examples/` code it points to.

9. **Idioms and colloquialisms - zero tolerance, no judgment call.** Any figurative phrase that isn't literal technical language: "so they come good last," "hits the ground running," "at the end of the day," "running it in anger," "raise the bar," "move the needle." These aren't AI-generated - they're a stray reach for color in an otherwise flat register - but they're confusing (regional/generational idioms don't land the same for every reader), unclear to non-native English speakers, and inconsistent with this course's plain, direct voice. There is no "this one is fine, it's earning its place" exception: every idiom gets replaced with the literal statement, full stop.
   - scan.js catches a short deny-list of recurring offenders (in anger, come good, hits the ground running, at the end of the day, raise the bar, move the needle, low-hanging fruit, boil the ocean). That list is necessarily incomplete - also read every sentence and ask "would a non-native English speaker understand this literally?" If not, it's an idiom; replace it.

10. **Banned vocabulary, with domain-specific carve-outs.** This course covers AI engineering, containers and Kubernetes, so a flat ban would flag correct technical usage ("ecosystem", "harness"). Split by risk:
    - **Flag on sight, no carve-out** (no legitimate technical sense in this domain): `delve`/`delve into`, `tapestry`, `realm`, `paradigm`, `embark`, `beacon`, `testament to`, `game-changer`, `pivotal`, `meticulous`, `cutting-edge`, `underscores`, `myriad`. scan.js reports these as `hit`.
    - **Flag the flourish use, don't flag the literal domain use** - read each hit in context before deciding. scan.js reports these as `candidate`:

      | Word | Flag | Don't flag |
      |---|---|---|
      | harness | "harness the power of AI" | "test harness," "agent harness," "the harness executes" |
      | ecosystem | "a thriving ecosystem" | "the Kubernetes ecosystem," "npm ecosystem" (naming an actual defined system) |
      | leverage | "leverage this to..." (→ "use") | "leverage the API's caching" (a real platform capability) |
      | robust / comprehensive / seamless | vague praise with nothing specific behind it | describing an actual measured property ("a robust retry policy with exponential backoff") |
      | facilitate / streamline / underpin | filler for "help"/"support" adding no meaning | precise technical description where the word does real work |

11. **Copula avoidance** - substituting "is"/"has" with an inflated verb: `serves as`, `features`, `boasts`, `presents`, `represents`.
    - scan.js catches `serves as`, `boasts`, `presents itself as`. `features`/`represents` are too common in their literal senses (a tool's "features," a value that "represents" an id) to match reliably - read for the substitution pattern instead of trusting a blind match.
    - Fix: default to "is" or "has" unless the fancier verb genuinely adds meaning.

12. **Vague attributions** without a named source: "Experts believe," "Studies show," "Research suggests," "Industry leaders agree." Higher stakes than in a blog post: these sections make factual claims about tools and platforms.
    - Mechanical (scan.js).
    - Fix: name the actual source (the doc page, the tool version, the example file) or cut the claim.

13. **Hollow intensifiers**: `genuinely`, `truly`, `quite frankly`, `to be honest`, `it's worth noting that`.
    - Mechanical (scan.js).
    - Fix: cut the intensifier and state the fact plainly.

14. **Confidence-calibration announcers** used to signal importance instead of showing it: `Notably`, `Interestingly`, `Importantly`, `Significantly` as a sentence opener.
    - Density-gated, not zero-tolerance: one in a long section is fine. scan.js reports openers only when 2+ appear under the same heading. Also flag a single one when the sentence it opens restates something already obvious rather than a genuine surprise (judgment).

## Procedure

1. **Scope.** Default to the files the user names. If none are named, run `scan.js` with no arguments (it uses files changed on the current branch plus untracked `docs/` markdown); sweep a whole chapter or all of `docs/` only if asked. `docs/README.md` is auto-generated and always skipped.
2. **Run the mechanical scan first** (`node .agents/skills/lesson-style-check/scripts/scan.js [--headings] [files]`, as one plain command with no `;`, `&&` or pipes) for patterns 1, 4, 6, 9, 10, 11, 12, 13, 14. Resolve every `candidate` (pattern 10 flourish words) and every `advisory` (pattern 6) with a context read; they are not automatic hits.
3. **Read each file for the judgment-only patterns** (2, 3, 5, 7, 8) and for idioms and inflated verbs the script cannot match (9, 11) - these need the sentence in context, not a regex.
4. **Report before fixing.** List every hit with file:line and the offending text, grouped by pattern number. Note any pattern that's borderline (e.g. bold-on-a-term vs bold-on-a-sentence, or a domain-legitimate use of a pattern-10 word) rather than silently deciding either way.
5. **Fix only if asked**, or if the invocation already implied fix-in-place (e.g. "clean up X"). Fix style: drop the bold rather than restructuring the sentence, state negations as one direct positive clause, cut personification for a literal description, replace em dashes with a period/comma/"and", swap an idiom for the plain word it stands in for, swap a banned/flourish word for its plain replacement, swap an inflated verb for "is"/"has", name the source or cut the claim, cut the intensifier.
6. **Verify.** After any fix, re-run `scan.js` on the touched files, re-read the touched section, and confirm the specific pattern is gone and no new one was introduced (a common failure mode: fixing pattern 1 by adding a new personification while rewording).
