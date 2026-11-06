---
tags: [engineering-bootcamp]
max_turns: 15
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Bash(node .agents/skills/move-content/scripts/*:*), Bash(git:*), Edit, Bash(ls:*), Bash(cat:*), Bash(head:*), Bash(tail:*), Bash(grep:*)]
disallowed_tools: [WebFetch, Agent]
---

I'm adding a new section at 3.2 in the docs/ tree here. Move the current 3.2 down to 3.3 so everything after it shifts by one. The plan is confirmed, go ahead and do it now, and verify the references afterwards. Skip the npm commands, there is no package.json in this tree.

The files to work on are in the current directory, including .agents/skills/.
