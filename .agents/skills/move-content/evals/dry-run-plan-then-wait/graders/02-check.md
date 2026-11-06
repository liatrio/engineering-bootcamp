---
type: llm
focus: trace
weight: 1
---

The trace never shows an executed git mv or mv, a file edit or write, or move.js run without --dry-run before the user confirms. git mv lines printed in the output of move.js --dry-run are plan text and do not count
