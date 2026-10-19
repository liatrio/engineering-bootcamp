---
name: lesson-style-check
description: Scan bootcamp section markdown in docs/ for the specific rhetorical AI-isms that recur in AI-assisted course content (bolded lead-in sentences, negate-then-restate, personification, em dashes, Title Case headings, rule-of-three padding, throat-clearing meta-commentary, unsourced claims, off-register idioms, banned vocabulary, copula avoidance, vague attributions, hollow intensifiers, confidence-calibration announcers). Read when the user asks to check section style, scan for AI-isms in bootcamp content, or reviews a new section before merge.
---

# Section Style Check

## When to read this skill

Read this whenever the user asks to audit section prose for AI-sounding writing, or check one or more `docs/N-*/N.X-*.md` section files before merging.

## Why this exists

A fast, cheap check for the specific patterns that recur in AI-assisted course prose, so a scan doesn't require re-deriving the list. It is not a full editorial pass. Ported from a sibling course-content repo, where the list was built from manual review; the patterns are generic, but expect some to hit existing content here. Report hits on untouched content rather than rewriting it unprompted.

Bootcamp conventions take precedence over this list: `STYLE.md` and `AGENTS.md` (H3 default heading level, HTML-in-markdown rules, `Deliverables` sections).

## The 14 patterns

1. **Bolded lead-in sentence opening a paragraph or list item** - `**Do X.** Explanation follows.` The bold is doing the job a real list item or a plain sentence should do.
   - Detect: `grep -n '^\*\*[A-Z][^*]*\.\*\*' <file>` and `grep -n '^- \*\*[A-Z][^*]*\.\*\*' <file>` (bolded imperative/declarative sentence, full stop inside the bold, at the start of a line or list item).
   - Exception: a bolded *term* mid-sentence defining jargon (`A **tool execution error** is...`) is glossary style, not this pattern - only flag when the bold spans a complete sentence AND sits at the start of a paragraph/bullet.

2. **"It's not X, it's Y" / negate-then-restate**, including the split-sentence form across two sentences ("X is not a fixture. It is an application.").
   - Detect: `grep -n "is not .*\. It is\|isn't .*\. It's" <file>` as a starting point, then read the surrounding sentence - the joined and split forms both count.

3. **Personification of code or systems** ("the data model fights you," "the server insists," "the schema wants").
   - No reliable grep; read for a system/abstraction given a human disposition or intent it doesn't have.

4. **Em dashes (—) or double-hyphen substitutes (--) mid-sentence.**
   - Detect: `grep -n '—' <file>` and `grep -n ' -- ' <file>`. Target is zero in new prose. About a dozen existing files contain em dashes, so report those but don't rewrite them unprompted.

5. **Throat-clearing meta-commentary before a list or example** ("One trap, and it is a test:", "Everything above compresses to four mistakes:").
   - No reliable grep; read the sentence immediately before any list/table/code block and ask whether it adds information or just announces that information is coming.

6. **Title Case headings** instead of sentence case.
   - Detect: `grep -n '^#\{1,3\} ' <file>` then eyeball each - a heading where every content word is capitalized (`## What Kubernetes Is at the Protocol Level`) is the tell; a proper noun with lowercase connectors is fine.
   - Advisory only: existing bootcamp headings mix Title Case and sentence case (`## LLM Capabilities`). Match the surrounding file, and don't flag recurring names such as `Learning Objectives` and `Deliverables`. Never mass-convert headings in existing files.

7. **Rule-of-three padding** ("fast, reliable, and scalable") where two items or a plain sentence carries the same information.
   - No reliable grep; read any comma-separated adjective or short-phrase list of exactly three and ask whether the third item earns its place or just completes the triad.

8. **Unsourced confident claims about tool/API behavior** that aren't traceable to a linked doc or the sample code under `examples/` referenced in the section.
   - No reliable grep; cross-check claims against the section's inline links or the `examples/` code it points to.

9. **Idioms and colloquialisms - zero tolerance, no judgment call.** Any figurative phrase that isn't literal technical language: "so they come good last," "hits the ground running," "at the end of the day," "running it in anger," "raise the bar," "move the needle." These aren't AI-generated - they're a stray reach for color in an otherwise flat register - but they're confusing (regional/generational idioms don't land the same for every reader), unclear to non-native English speakers, and inconsistent with this course's plain, direct voice. There is no "this one is fine, it's earning its place" exception: every idiom gets replaced with the literal statement, full stop.
   - No reliable grep, though a short deny-list catches recurring offenders: `grep -niE "\b(in anger|come good|hits? the ground running|at the end of the day|raise the bar|move the needle|low.hanging fruit|boil(s|ing)? the ocean)\b" <file>`. That list is necessarily incomplete - also read every sentence and ask "would a non-native English speaker understand this literally?" If not, it's an idiom; replace it.

10. **Banned vocabulary, with domain-specific carve-outs.** This course covers AI engineering, containers and Kubernetes, so a flat ban would flag correct technical usage ("ecosystem", "harness"). Split by risk:
    - **Flag on sight, no carve-out** (no legitimate technical sense in this domain): `delve`/`delve into`, `tapestry`, `realm`, `paradigm`, `embark`, `beacon`, `testament to`, `game-changer`, `pivotal`, `meticulous`, `cutting-edge`, `underscores`, `myriad`.
      - Detect: `grep -niE '\b(delve|tapestry|realm|paradigm|embark|beacon|testament to|game.?changer|pivotal|meticulous|cutting.?edge|underscores|myriad)\b' <file>`
    - **Flag the flourish use, don't flag the literal domain use** - read each hit in context before deciding:

      | Word | Flag | Don't flag |
      |---|---|---|
      | harness | "harness the power of AI" | "test harness," "agent harness," "the harness executes" |
      | ecosystem | "a thriving ecosystem" | "the Kubernetes ecosystem," "npm ecosystem" (naming an actual defined system) |
      | leverage | "leverage this to..." (→ "use") | "leverage the API's caching" (a real platform capability) |
      | robust / comprehensive / seamless | vague praise with nothing specific behind it | describing an actual measured property ("a robust retry policy with exponential backoff") |
      | facilitate / streamline / underpin | filler for "help"/"support" adding no meaning | precise technical description where the word does real work |

      - Detect candidates: `grep -niE '\b(harness|ecosystem|leverage|robust|comprehensive|seamless|facilitate|streamline|underpin)\b' <file>`, then read each hit - this is a candidate list, not an auto-flag.

11. **Copula avoidance** - substituting "is"/"has" with an inflated verb: `serves as`, `features`, `boasts`, `presents`, `represents`.
    - Detect: `grep -niE '\b(serves as|boasts|presents itself as)\b' <file>`. `features`/`represents` are too common in their literal senses (a tool's "features," a value that "represents" an id) to grep reliably - read for the substitution pattern instead of trusting a blind match.
    - Fix: default to "is" or "has" unless the fancier verb genuinely adds meaning.

12. **Vague attributions** without a named source: "Experts believe," "Studies show," "Research suggests," "Industry leaders agree." Higher stakes than in a blog post: these sections make factual claims about tools and platforms.
    - Detect: `grep -niE '\b(experts (believe|say|agree)|studies show|research suggests|industry leaders)\b' <file>`.
    - Fix: name the actual source (the doc page, the tool version, the example file) or cut the claim.

13. **Hollow intensifiers**: `genuinely`, `truly`, `quite frankly`, `to be honest`, `it's worth noting that`.
    - Detect: `grep -niE '\b(genuinely|truly|quite frankly|to be honest|it.s worth noting that)\b' <file>`.
    - Fix: cut the intensifier and state the fact plainly.

14. **Confidence-calibration announcers** used to signal importance instead of showing it: `Notably`, `Interestingly`, `Importantly`, `Significantly` as a sentence opener.
    - Detect: `grep -niE '^(Notably|Interestingly|Importantly|Significantly),' <file>`.
    - Density-gated, not zero-tolerance: one in a long section is fine. Flag when 2+ appear in the same section, or when the sentence it opens is a restatement of something already obvious rather than a genuine surprise.

## Procedure

1. **Scope.** Default to the files the user names. If none are named, default to files changed on the current branch (`git diff --name-only master -- 'docs/**/*.md'`); sweep a whole chapter or all of `docs/` only if asked. Skip `docs/README.md` (auto-generated).
2. **Run the mechanical checks first** (patterns 1, 4, 6, 10, 11, 12, 13, 14 above) - they're grep-able and cheap, and catch the highest-frequency offenders. Patterns 10, 11, and 14 need a context read after the grep, since the match is a candidate list, not an automatic hit.
3. **Read each file for the judgment-only patterns** (2, 3, 5, 7, 8, 9) - these need the sentence in context, not a regex.
4. **Report before fixing.** List every hit with file:line and the offending text, grouped by pattern number. Note any pattern that's borderline (e.g. bold-on-a-term vs bold-on-a-sentence, or a domain-legitimate use of a pattern-10 word) rather than silently deciding either way.
5. **Fix only if asked**, or if the invocation already implied fix-in-place (e.g. "clean up X"). Fix style: drop the bold rather than restructuring the sentence, state negations as one direct positive clause, cut personification for a literal description, replace em dashes with a period/comma/"and", swap an idiom for the plain word it stands in for, swap a banned/flourish word for its plain replacement, swap an inflated verb for "is"/"has", name the source or cut the claim, cut the intensifier.
6. **Verify.** After any fix, re-read the touched section and confirm the specific pattern is gone and no new one was introduced (a common failure mode: fixing pattern 1 by adding a new personification while rewording).
