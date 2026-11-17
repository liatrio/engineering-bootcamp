---
tags: [engineering-bootcamp]
max_turns: 10
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Bash(node .agents/skills/dead-link-check/scripts/*:*), Bash(ls:*), Bash(cat:*), Bash(head:*), Bash(tail:*), Bash(grep:*)]
disallowed_tools: [WebFetch, Agent]
---

Audit the external links in docs/ and fix whatever is broken.
Input files: docs/one.md, docs/two.md

The files to work on are in the current directory, including .agents/skills/.
