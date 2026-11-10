---
tags: [engineering-bootcamp]
max_turns: 10
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Bash(node .agents/skills/move-content/scripts/*:*), Bash(ls:*), Bash(cat:*), Bash(head:*), Bash(tail:*), Bash(grep:*)]
disallowed_tools: [WebFetch, Agent]
---

Move section 3.1 in docs/ so it becomes 3.3. Show me what will change first.

The files to work on are in the current directory, including .agents/skills/.
