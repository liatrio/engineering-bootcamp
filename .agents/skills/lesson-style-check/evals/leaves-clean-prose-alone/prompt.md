---
tags: [engineering-bootcamp]
max_turns: 10
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Bash(node .agents/skills/lesson-style-check/scripts/*:*)]
disallowed_tools: [WebFetch, Agent]
---

Check clean.md against the style list. If it's fine, just say so.
Input files: clean.md
