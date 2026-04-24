# Task 5.0 Proof Artifacts: Restructure Exercises with SDD Workflow

## Git Diff Evidence

The following git diff demonstrates the transformation of exercises from informal "vibing" to structured SDD methodology:

```diff
diff --git a/docs/3-AI-Engineering/3.3.2-agentic-ide.md b/docs/3-AI-Engineering/3.3.2-agentic-ide.md
index f39526d..af8964f 100644
--- a/docs/3-AI-Engineering/3.3.2-agentic-ide.md
+++ b/docs/3-AI-Engineering/3.3.2-agentic-ide.md
@@ -160,30 +160,165 @@ prompt: |

 Workflows can be triggered through command palettes or custom keybindings, making complex AI-assisted patterns accessible to the entire team. This approach moves beyond one-off prompts to create reusable, maintainable AI interaction patterns that grow with your codebase.

-## Exercise 1 - VSCode Vibing
+## Exercise 1 - Structured MCP Server Development with SDD

-Let's give agentic development a spin In this exercise we are going to put into practice what we have learned and build an MCP server with AI. AI writing tools to interface with AI whoa.
+This exercise applies the SDD (Spec-Driven Development) methodology you learned in [3.3.1 AI Development for Software Engineers](3.3.1-agentic-best-practices.md) to build an MCP server with AI assistance. Rather than exploratory "vibing," you'll follow a structured four-stage workflow: Generate Specification → Task Breakdown → Execute with Management → Validate Implementation.
+
+This structured approach helps you manage complexity, track progress, prevent context rot, and create verifiable proof of functionality at each stage.
```

**Key Changes:**
- Exercise 1 renamed from "VSCode Vibing" to "Structured MCP Server Development with SDD"
- Exercise 2 renamed from "Windsurf" to "Structured MCP Server Development with Windsurf IDE"
- Added comprehensive introduction referencing SDD methodology from 3.3.1
- Added "Context Management Tips" section with monitoring and compaction guidance
- Added "Proof Artifacts" section explaining what they are and why they matter

## Documentation Review: SDD Four-Stage Workflow

Both exercises now include comprehensive four-stage SDD structure:

### Stage 1: Generate Specification (SDD Stage 1)
- Set up environment
- Brainstorm spec using MCP resources
- Ask clarifying questions
- Create developer-ready specification
- **Checkpoint**: Written specification before proceeding

### Stage 2: Task Breakdown (SDD Stage 2)
- Break down into parent tasks (demoable units)
- Identify relevant files
- Create sub-tasks with proof artifacts
- **Examples provided**: "Create server.py" → Proof: CLI output showing startup
- **Checkpoint**: Structured task list with proof artifacts defined

### Stage 3: Execute with Management (SDD Stage 3)
- Implement incrementally (start small, add functionality)
- Test frequently with MCP Inspector
- Commit after each parent task
- Monitor context utilization (aim below 60%)
- Trigger compaction at 60%+ utilization
- Use progressive disclosure for documentation
- **Checkpoint**: Working, tested MCP server with commits

### Stage 4: Validate Implementation (SDD Stage 4)
- Test against original spec
- Register and integration test with MCP client
- Review proof artifacts
- Document learnings
- **Checkpoint**: Fully functional, validated MCP server

## Documentation Review: Context Management Practices

Context management guidance integrated throughout exercises:

```markdown
### Context Management Tips

Before diving into the exercise, keep these context management practices in mind:

- **Monitor Context Utilization**: Use `/context` (in Claude Code) or similar features in your AI assistant to track context window usage
- **Trigger Compaction at 60%**: When context utilization exceeds 60%, trigger intentional compaction by summarizing completed work and starting fresh
- **Progressive Disclosure**: Load MCP documentation on-demand rather than front-loading everything. Reference the [MCP Full Text](https://modelcontextprotocol.io/llms-full.txt) and [Python MCP SDK](https://raw.githubusercontent.com/modelcontextprotocol/python-sdk/refs/heads/main/README.md) as needed during development
- **Avoid Context Rot**: The 40%+ utilization "dumb zone" causes performance degradation. Stay aware of this threshold and compact proactively

For detailed coverage of these concepts, see [3.1.4 AI Best Practices](3.1.4-ai-best-practices.md#understanding-context-windows).
```

**Context references in Stage 3:**
- "Check context utilization regularly (aim to stay below 60%)"
- "When approaching 60%, trigger intentional compaction: summarize completed work, document remaining tasks, start fresh conversation"
- "Use progressive disclosure: load documentation snippets only when needed"

**Cross-reference**: Links to 3.1.4-ai-best-practices.md for detailed context engineering concepts

## Documentation Review: Proof Artifacts Introduction

Proof artifacts concept introduced and explained in both exercises:

```markdown
### Proof Artifacts

While proof artifacts are optional for this exercise, creating them is excellent practice for real-world development:

- **What They Are**: Evidence demonstrating your implementation works (screenshots, CLI output, test results, configuration examples)
- **Why They Matter**: Provide verification checkpoints, enable troubleshooting, and support validation against your original spec
- **What to Collect**: Screenshots of your MCP server running, CLI output from MCP Inspector tests, configuration files showing client registration, examples of successful tool invocations

These artifacts become invaluable when debugging issues or demonstrating functionality to stakeholders.
```

**Proof artifacts referenced in Stage 2:**
- "Define what proof artifacts will demonstrate completion"
- Examples: "Create server.py with protocol initialization" → Proof: CLI output showing successful server startup

**Proof artifacts referenced in Stage 3:**
- "Collect proof artifacts as you go (screenshots, CLI output, test results)"
- "Review proof artifacts to confirm requirements met"

**Proof artifacts referenced in Stage 4:**
- "Review Proof Artifacts: If you collected proof artifacts, review them to ensure they demonstrate all required functionality"

## Test Output: Front-matter Validation

```bash
$ npm run refresh-front-matter

> devops-bootcamp@1.0.0 refresh-front-matter
> node ./.husky/front-matter-condenser update

No changes to master record, proceeding with commit.
```

**Verification**: Front-matter metadata validated successfully:
- Exercise 1: name: "VSCode MCP Server", estMinutes: 240
- Exercise 2: name: "Windsurf MCP Server", estMinutes: 180

## Test Output: Markdown Linting

```bash
$ npm run lint docs/3-AI-Engineering/3.3.2-agentic-ide.md

> devops-bootcamp@1.0.0 lint
> markdownlint-cli2 "**/*.md" "!**/node_modules/**" "!**/.venv/**" "!**/specs/**" docs/3-AI-Engineering/3.3.2-agentic-ide.md

markdownlint-cli2 v0.20.0 (markdownlint v0.40.0)
Finding: **/*.md !**/node_modules/** !**/.venv/** !**/specs/** docs/3-AI-Engineering/3.3.2-agentic-ide.md
Linting: 166 file(s)
Summary: 0 error(s)
```

**Verification**: All markdown linting checks passed successfully.

## Documentation Review: Updated Deliverables

Deliverables section now includes SDD-focused questions:

```markdown
## Deliverables

- What worked well when applying the SDD workflow to MCP server development?
- How did following the four-stage methodology (Generate Spec → Task Breakdown → Execute → Validate) compare to exploratory development?
- Did you experience context rot during the exercise? How did you manage it?
- What proof artifacts did you collect, and how did they help verify your implementation?
- Which Agentic IDE did you prefer, and why?
- How did monitoring context utilization affect your development process?
- What challenges did you encounter when breaking down your spec into tasks with proof artifacts?
- What would you do differently if you were to repeat this exercise?
```

**Key additions:**
- Questions about SDD workflow application and comparison to exploratory development
- Questions about context rot experience and management
- Questions about proof artifacts collection and utility
- Questions about context utilization monitoring impact
- Questions about task breakdown challenges

## Verification Summary

All proof artifact requirements met:

✅ **Exercise titles renamed**: Both exercises now reference "Structured MCP Server Development with SDD"
✅ **SDD four-stage workflow**: Comprehensive coverage of Generate Spec → Task Breakdown → Execute → Validate
✅ **Context management practices**: Dedicated section with monitoring, compaction, progressive disclosure, and context rot guidance
✅ **Proof artifacts concept**: Introduced and explained with concrete examples
✅ **Cross-references**: Links to 3.3.1 (SDD methodology) and 3.1.4 (context engineering)
✅ **Front-matter validation**: Metadata validated successfully
✅ **Markdown linting**: All checks passed with 0 errors
✅ **Updated deliverables**: Questions cover SDD application, context management, and proof artifacts
✅ **Beginner-friendly**: Clear explanations, structured approach, checkpoints throughout
