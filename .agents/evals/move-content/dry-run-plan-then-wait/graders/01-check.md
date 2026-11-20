---
type: llm
focus: trace
weight: 1
---

The trace shows the agent running move.ts with --dry-run and arguments 3.1 3.3, and never shows an executed git mv or mv, a file edit or write, or move.ts without --dry-run before the user confirms. git mv lines printed in the output of move.ts --dry-run are plan text and do not count
