# Task 2.0 Proof Artifacts - Replace Harper Reed Workflow with SDD Methodology

## Git Diff Summary

The file `docs/3-AI-Engineering/3.3.1-agentic-best-practices.md` has been transformed with complete SDD workflow replacing Harper Reed workflow:

- Updated front-matter: `estReadingMinutes` increased from 30 to 40 minutes
- Replaced introduction section with SDD methodology references and links to Liatrio spec-driven-workflow repository
- Added "No Vibes Allowed" video embedding subsection with primary and alternative recordings
- Replaced 3 workflow sections (Brainstorm Spec, Planning, Execution) with 4 SDD stages
- Added cross-references to context engineering concepts from 3.1.4
- Updated Deliverables with 6 SDD-focused questions
- Maintained "Other Practical AI Techniques" section unchanged

## Documentation Review - SDD Workflow Sections

### Introduction Updates (lines 13-27)

**Original**: Referenced Harper Reed's LLM Codegen Workflow

**New**:
- Introduces Spec-Driven Development (SDD) as structured four-stage workflow
- Links to [Liatrio Spec-Driven Workflow](https://github.com/liatrio-labs/spec-driven-workflow)
- Links to HumanLayer's "No Vibes Allowed" principles
- Embedded primary video: [https://www.youtube.com/watch?v=IS_y40zY-hc](https://www.youtube.com/watch?v=IS_y40zY-hc)
- Referenced alternative recording: [https://www.youtube.com/watch?v=rmvDxxNubIg](https://www.youtube.com/watch?v=rmvDxxNubIg)
- Describes transformation from "vibe-based" to disciplined engineering practices

### Stage 1: Generate Specification (SDD Stage 1) - lines 29-98

**Replaced**: "Brainstorm Spec" section

**New Content**:
- Purpose statement emphasizing developer-ready specifications
- Clarifying questions process with iterative refinement
- Example prompt adapted for DevOps Bootcamp context
- Structured specification components:
  - Executive summary
  - Goals and non-goals
  - User stories
  - Demoable units of work with proof artifacts
  - Technical considerations
  - Security and compliance
  - Success metrics
- Save and commit guidance with example commit message
- Resources link to Liatrio Spec-Driven Workflow repository

### Stage 2: Task Breakdown (SDD Stage 2) - lines 100-187

**Replaced**: "Planning" section

**New Content**:
- Purpose statement on transforming specs into executable plans
- Breaking specs into demoable units guidance:
  - Parent tasks deliver working functionality
  - 2-8 hours focused implementation time
  - Clear verifiable proof artifacts
- Creating parent tasks with proof artifacts:
  - CLI output, test results, screenshots, configuration, metrics
- Example task breakdown prompt
- Complete task structure example showing:
  - Purpose statement
  - Proof artifacts list
  - Relevant files
  - Sub-tasks breakdown (6 sub-tasks shown)
- Save and commit guidance
- Alternative tools reference (TaskMaster AI)

### Stage 3: Execute with Management (SDD Stage 3) - lines 189-280

**Replaced**: "Execution" section

**New Content**:
- Purpose statement emphasizing single-threaded execution and context management
- Single-threaded execution rationale
- Verification checkpoints (4-step process after each sub-task)
- **Context management during implementation** (lines 216-233):
  - References [AI Best Practices](3.1.4-ai-best-practices.md#context-rot-and-performance-degradation)
  - Monitor context using `/context` in Claude Code
  - Watch for 40%+ utilization
  - Trigger compaction at 60%+
  - Phase transitions as natural compaction points
- Compaction workflow (5-step process)
- Committing after each parent task with example commit message
- Maintaining proof artifacts guidance
- Leveraging IDE agentic capabilities (CLAUDE.md, MCP servers, web docs)
- Adapting for existing codebases (4-point guidance)

### Stage 4: Validate Implementation (SDD Stage 4) - lines 282-343

**New Section** (did not exist before):
- Purpose statement on validating against original spec
- Validating against specification (4-point process)
- Reviewing proof artifacts (4 categories of proof)
- Coverage matrix example showing requirement → implementation → proof mapping
- Final validation checklist (8 items)
- Addressing gaps process (5 steps)

## Documentation Review - "No Vibes Allowed" Video Integration

### Primary Video Embedding (line 23)

```markdown
[video](https://www.youtube.com/watch?v=IS_y40zY-hc)
```

**Verification**: Docsify video syntax used correctly for embedding

### Alternative Recording Reference (line 25)

```markdown
For an alternative recording with additional perspectives, see [this version](https://www.youtube.com/watch?v=rmvDxxNubIg) of the same talk.
```

**Verification**: Link provided as specified in requirements

## Documentation Review - Context Engineering Cross-References

### Execute with Management Section (lines 216-233)

**Cross-reference to 3.1.4**:
```markdown
As you work through tasks, actively manage context utilization to maintain AI effectiveness (see [AI Best Practices](3.1.4-ai-best-practices.md#context-rot-and-performance-degradation) for detailed coverage):
```

**Context management guidance includes**:
- Monitor context tools (`/context` in Claude Code)
- 40%+ utilization threshold
- 60%+ compaction trigger
- Phase transitions as natural compaction points
- 5-step compaction workflow

**Verification**: ✅ Context engineering concepts from 3.1.4 integrated appropriately

## Documentation Review - Other Sections Maintained

### "Other Practical AI Techniques" Section (lines 345-479)

**Maintained unchanged**:
- The "Second Opinion" Technique
- The "Throwaway Debugging Scripts" Technique
- Plugging Technical Gaps
- Documenting Your Prompts
- Maintaining the "Dumb Tool" Perspective

**Verification**: ✅ Section preserved as specified in task requirements

### Deliverables Section Updates (lines 485-492)

**Original Questions**:
- Which of these techniques have you used before?
- Have you found any other techniques that you have found helpful?

**New Questions**:
- Describe the four stages of the SDD workflow and what each stage produces.
- How does the SDD approach differ from "vibe-based" AI development?
- What are proof artifacts, and why are they important in the SDD workflow?
- When would you trigger intentional compaction during the Execute with Management stage?
- How would you adapt the SDD workflow for a brownfield (existing codebase) project versus a greenfield (new) project?
- Which of the "Other Practical AI Techniques" (Second Opinion, Throwaway Debugging Scripts, Plugging Technical Gaps) have you used before, and in what contexts?

**Verification**: ✅ Deliverables reference SDD workflow stages while maintaining connection to "Other Practical AI Techniques"

## Test Output - Markdown Linting

```bash
$ npm run lint docs/3-AI-Engineering/3.3.1-agentic-best-practices.md

> devops-bootcamp@1.0.0 lint
> markdownlint-cli2 "**/*.md" "!**/node_modules/**" "!**/.venv/**" "!**/specs/**" docs/3-AI-Engineering/3.3.1-agentic-best-practices.md

markdownlint-cli2 v0.20.0 (markdownlint v0.40.0)
Finding: 166 file(s)
Summary: 0 error(s)
```

**Result**: ✅ PASS - No linting errors (fixed unordered list style from asterisks to dashes)

## Verification Checklist

✅ Introduction section updated to reference SDD methodology instead of Harper Reed workflow
✅ Link to Liatrio spec-driven-workflow repository added
✅ "No Vibes Allowed" primary video embedded using Docsify syntax
✅ "No Vibes Allowed" alternative recording referenced
✅ "Brainstorm Spec" replaced with "Generate Specification (SDD Stage 1)"
✅ Example spec generation prompt adapted for DevOps Bootcamp
✅ "Planning" replaced with "Task Breakdown (SDD Stage 2)"
✅ Example task breakdown shows parent task → sub-tasks → proof artifacts structure
✅ "Execution" replaced with "Execute with Management (SDD Stage 3)"
✅ New "Validate Implementation (SDD Stage 4)" section added
✅ Cross-references to context engineering (3.1.4) added in Stage 3
✅ Context management guidance includes 40%+ and 60%+ thresholds, `/context` command
✅ Front-matter estReadingMinutes updated from 30 to 40
✅ "Other Practical AI Techniques" section maintained unchanged
✅ Deliverables section updated with 6 SDD-focused questions
✅ Markdown linting passes (0 errors)
✅ Content appropriate for beginner audience with clear explanations
✅ Logical flow from Stage 1 → Stage 2 → Stage 3 → Stage 4
✅ Repository standards maintained (H2/H3 headers, bullet formatting, consistent style)
