# 98-tasks-ai-engineering-modern-practices.md

## Relevant Files

- `docs/3-AI-Engineering/3.1.4-ai-best-practices.md` - Best practices documentation that will be significantly expanded with context engineering coverage
- `docs/3-AI-Engineering/3.3.1-agentic-best-practices.md` - Advanced best practices that will have Harper Reed workflow replaced with SDD methodology
- `docs/3-AI-Engineering/3.1.2-ai-agents.md` - AI agents documentation where Claude Code will be added to the Agent Tools section
- `docs/3-AI-Engineering/3.3.2-agentic-ide.md` - Agentic IDE documentation where exercises will be restructured and Claude Code coverage added
- `src/quizzes/chapter-3/3.3/agentic-best-practices-quiz.js` - Quiz file that will be updated with SDD and context engineering questions

### Notes

- All documentation files use Docsify markdown format with front-matter YAML metadata
- Front-matter must include `category`, `estReadingMinutes`, and optionally `exercises` array
- Use H3 headers (`###`) as default within pages; H2 headers (`##`) for navigation
- Deliverables sections must remain at the end of each document with bulleted questions
- Quiz files use `rawQuizdown` format with correct answer markers `[x]` and explanations prefixed with `>`
- Use repository's established markdown linting: `npm run lint [file]`
- Validate front-matter with: `npm run refresh-front-matter`
- Follow CLAUDE.md and STYLE.md conventions for all content updates
- YouTube videos should be embedded using Docsify video syntax: `[video](URL)` or iframe if needed

## Tasks

### [x] 1.0 Expand Context Engineering Coverage in Best Practices

**Purpose:** Establish foundational understanding of context engineering by significantly expanding 3.1.4-ai-best-practices.md with comprehensive coverage of context windows, context rot, intentional compaction, and progressive disclosure techniques.

#### 1.0 Proof Artifact(s)

- Git diff: `docs/3-AI-Engineering/3.1.4-ai-best-practices.md` demonstrates new sections on context windows, context rot (40%+ "dumb zone"), intentional compaction techniques, and progressive disclosure patterns
- Documentation review: Updated content includes specific metrics (40%+ context utilization degradation, ~150-200 instruction limit) and practical tracking guidance across multiple tools (/context in Claude Code, similar features in VSCode AI tools)
- Documentation review: Links to HumanLayer resources (12-Factor Agents, Advanced Context Engineering) appear in resources/further reading sections
- Documentation review: "Don't depend on long lived chats" warning expanded with WHY (context rot) and HOW (compaction techniques) explanations
- Test output: `npm run lint docs/3-AI-Engineering/3.1.4-ai-best-practices.md` passes
- Test output: `npm run refresh-front-matter` completes successfully with updated front-matter

#### 1.0 Tasks

- [x] 1.1 Read and analyze current 3.1.4-ai-best-practices.md to understand existing structure and identify where to insert new context engineering sections
- [x] 1.2 Update front-matter estReadingMinutes to reflect expanded content (currently ~10 minutes, will increase to ~25-30 minutes)
- [x] 1.3 Expand the existing "Don't depend on long lived chats" bullet (line ~18) into a comprehensive subsection explaining WHY (context rot mechanism, 40%+ degradation zone) and HOW (compaction techniques)
- [x] 1.4 Add new H2 section "## Understanding Context Windows" after existing best practices, covering: what context windows are, token limits, how LLMs process context, and why this matters for AI-assisted development
- [x] 1.5 Add new H2 section "## Context Rot and Performance Degradation" covering: definition of context rot, the 40%+ utilization "dumb zone", ~150-200 instruction limit research, and real-world symptoms participants will encounter
- [x] 1.6 Add new H2 section "## Intentional Compaction Techniques" covering: what compaction is, when to trigger it (60%+ utilization), strategies for distilling context (research → plan → implement phases), and practical examples
- [x] 1.7 Add new H2 section "## Progressive Disclosure Patterns" covering: front-loading vs. on-demand context, how to structure CLAUDE.md files, file:line pointers instead of copying code, and avoiding context bloat
- [x] 1.8 Add new H2 section "## Tracking Context Utilization" covering: practical tools for monitoring context (/context command in Claude Code, token counters, context indicators in various AI assistants)
- [x] 1.9 Add new H2 section "## Resources and Further Reading" with links to HumanLayer resources (12-Factor Agents at https://www.humanlayer.dev/12-factor-agents, Advanced Context Engineering at https://github.com/humanlayer/advanced-context-engineering-for-coding-agents, Chroma Research context rot study)
- [x] 1.10 Update the Deliverables section to include new questions about context engineering concepts, context rot prevention, and when to apply compaction techniques
- [x] 1.11 Run `npm run lint docs/3-AI-Engineering/3.1.4-ai-best-practices.md` and fix any linting errors
- [x] 1.12 Run `npm run refresh-front-matter` and verify front-matter validation passes
- [x] 1.13 Review updated file for clarity, beginner-appropriateness, and consistency with repository standards

### [x] 2.0 Replace Harper Reed Workflow with SDD Methodology

**Purpose:** Transform 3.3.1-agentic-best-practices.md by replacing the existing Harper Reed workflow with Liatrio's complete four-stage SDD workflow, establishing structured AI-assisted development practices for beginners.

#### 2.0 Proof Artifact(s)

- Git diff: `docs/3-AI-Engineering/3.3.1-agentic-best-practices.md` demonstrates complete replacement of Harper Reed workflow (sections 1-3: Brainstorm Spec, Planning, Execution) with four-stage SDD workflow (Generate Spec → Task Breakdown → Execute with Management → Validate)
- Documentation review: Links to Liatrio Labs spec-driven-workflow repository (https://github.com/liatrio-labs/spec-driven-workflow) appear when introducing SDD methodology
- Documentation review: "No Vibes Allowed" primary YouTube video (https://www.youtube.com/watch?v=IS_y40zY-hc) embedded using Docsify video syntax
- Documentation review: Alternative "No Vibes Allowed" video (https://www.youtube.com/watch?v=rmvDxxNubIg) referenced as additional viewing option
- Documentation review: Context engineering concepts from 3.1.4 referenced appropriately in SDD workflow sections
- Test output: `npm run lint docs/3-AI-Engineering/3.3.1-agentic-best-practices.md` passes

#### 2.0 Tasks

- [x] 2.1 Read and analyze current 3.3.1-agentic-best-practices.md to identify sections to replace (lines ~21-91 containing Brainstorm Spec, Planning, Execution sections)
- [x] 2.2 Update the "Thoughtful AI Development" introduction section (lines ~13-19) to reference SDD methodology instead of Harper Reed workflow
- [x] 2.3 Replace "### 1. Brainstorm Spec" section (lines ~21-46) with "### 1. Generate Specification (SDD Stage 1)" covering: purpose of spec generation, clarifying questions process, creating developer-ready specifications, and link to Liatrio spec-driven-workflow repo (https://github.com/liatrio-labs/spec-driven-workflow)
- [x] 2.4 Add example spec generation prompt adapted for DevOps Bootcamp context (similar structure to existing example but emphasizing SDD principles)
- [x] 2.5 Replace "### 2. Planning" section (lines ~48-73) with "### 2. Task Breakdown (SDD Stage 2)" covering: breaking specs into demoable units, creating parent tasks with proof artifacts, identifying relevant files, and generating actionable sub-tasks
- [x] 2.6 Add example task breakdown showing parent task → sub-tasks → proof artifacts structure
- [x] 2.7 Replace "### 3. Execution" section (lines ~75-91) with "### 3. Execute with Management (SDD Stage 3)" covering: single-threaded execution, verification checkpoints, compaction triggers (reference 3.1.4), committing after each task, and maintaining proof artifacts
- [x] 2.8 Add new "### 4. Validate Implementation (SDD Stage 4)" section covering: validating against spec, reviewing proof artifacts, coverage matrix, and ensuring all requirements met
- [x] 2.9 Add new subsection under the SDD introduction embedding the "No Vibes Allowed" YouTube video (https://www.youtube.com/watch?v=IS_y40zY-hc) using Docsify syntax: `[video](https://www.youtube.com/watch?v=IS_y40zY-hc)` or iframe embed
- [x] 2.10 Add reference to alternative "No Vibes Allowed" recording (https://www.youtube.com/watch?v=rmvDxxNubIg) as additional viewing option
- [x] 2.11 Add cross-references to context engineering concepts from 3.1.4 in appropriate SDD stage descriptions (especially in Execute with Management section)
- [x] 2.12 Update front-matter estReadingMinutes to reflect restructured content (may increase from ~30 to ~35-40 minutes)
- [x] 2.13 Keep existing "Other Practical AI Techniques" section (lines ~93-236) unchanged as these complement the SDD workflow
- [x] 2.14 Update Deliverables section questions to reference SDD workflow stages instead of Harper Reed workflow
- [x] 2.15 Run `npm run lint docs/3-AI-Engineering/3.3.1-agentic-best-practices.md` and fix any linting errors
- [x] 2.16 Review for consistency with beginner audience, clarity of SDD concepts, and logical flow

### [ ] 3.0 Update Quiz Content for Modern Practices

**Purpose:** Modernize quiz questions to remove Harper Reed workflow references and add new questions covering SDD methodology, context engineering, context rot, and intentional compaction concepts.

#### 3.0 Proof Artifact(s)

- Git diff: `src/quizzes/chapter-3/3.3/agentic-best-practices-quiz.js` demonstrates removal of Harper Reed workflow question (question 2 about "Idea Honing, Planning, Execution" sequence)
- Git diff: Quiz file demonstrates new questions on SDD four-stage workflow (Generate Spec → Task Breakdown → Execute with Management → Validate)
- Git diff: Quiz file demonstrates new questions on context engineering concepts (context windows, 40%+ dumb zone, intentional compaction, progressive disclosure)
- Documentation review: Quiz maintains existing structure (rawQuizdown format, correct answer markers with [x], explanations with > prefix)
- Test output: Quiz JavaScript syntax validates correctly (no syntax errors when loading page with quiz)

#### 3.0 Tasks

- [ ] 3.1 Read and analyze current quiz file at src/quizzes/chapter-3/3.3/agentic-best-practices-quiz.js to understand existing question structure and format
- [ ] 3.2 Replace question 2 (lines ~13-21 about "Harper Reed's LLM Codegen Workflow") with new question about SDD four-stage workflow sequence, asking participants to identify correct order: Generate Spec → Task Breakdown → Execute with Management → Validate
- [ ] 3.3 Add new question about context rot: "What happens when context window utilization exceeds 40%?" with correct answer explaining the "dumb zone" and performance degradation, and incorrect answers about other issues
- [ ] 3.4 Add new question about intentional compaction: "When should you trigger intentional compaction during development?" with correct answer around 60%+ utilization or when context becomes cluttered, and incorrect answers suggesting other triggers
- [ ] 3.5 Add new question about progressive disclosure: "What is the progressive disclosure pattern in context engineering?" with correct answer about loading context on-demand vs. front-loading everything, and incorrect answers about other patterns
- [ ] 3.6 Add new question about proof artifacts in SDD: "What is the purpose of proof artifacts in SDD?" with correct answer about demonstrating functionality and enabling validation, and incorrect answers about other purposes
- [ ] 3.7 Update question 4 (lines ~33-41 about "dumber than they look") to reference context rot as one reason for AI limitations, adding context window management to the explanation
- [ ] 3.8 Ensure all new questions maintain the rawQuizdown format: question text as H1 (#), options with checkbox format (1. [ ] or 1. [x]), and explanations with > prefix
- [ ] 3.9 Test quiz JavaScript syntax by checking the file loads without errors (open page with quiz embedded and verify no console errors)
- [ ] 3.10 Review quiz for beginner appropriateness, accuracy of technical concepts, and balanced difficulty

### [ ] 4.0 Modernize Tool Coverage with Claude Code and VSCode Balance

**Purpose:** Add comprehensive Claude Code coverage while maintaining VSCode as the primary development environment, providing equal representation of AI assistant options across multiple documentation files.

#### 4.0 Proof Artifact(s)

- Git diff: `docs/3-AI-Engineering/3.1.2-ai-agents.md` demonstrates Claude Code added to Agent Tools section alongside existing tools (Windsurf, GitHub Copilot, Anthropic's Claude)
- Git diff: `docs/3-AI-Engineering/3.3.1-agentic-best-practices.md` demonstrates Claude Code integrated with SDD workflow examples showing both Claude Code and VSCode AI tool usage
- Git diff: `docs/3-AI-Engineering/3.3.2-agentic-ide.md` demonstrates Claude Code added to Popular Examples section with feature descriptions
- Documentation review: Examples demonstrate both Claude Code and VSCode AI tools with equal attention, including context tracking features (/context in Claude Code, similar in VSCode tools)
- Documentation review: VSCode maintained as primary exercise environment throughout 3.3.2-agentic-ide.md
- Test output: `npm run lint` passes for all updated files (3.1.2, 3.3.1, 3.3.2)

#### 4.0 Tasks

- [ ] 4.1 Read 3.1.2-ai-agents.md and locate the "Agent Tools You May Use" section (lines ~33-39)
- [ ] 4.2 Add Claude Code bullet to the Agent Tools section: "**Claude Code**: Command-line AI agent with strong context management features including /context command for monitoring context utilization and structured workflows. Particularly effective for managing context rot through intentional compaction."
- [ ] 4.3 Ensure Claude Code entry maintains equal weight with other tools and highlights context management features relevant to the curriculum
- [ ] 4.4 Read 3.3.1-agentic-best-practices.md and identify where to add Claude Code examples in the SDD workflow sections (created in Task 2.0)
- [ ] 4.5 In the "Execute with Management (SDD Stage 3)" section, add example showing both Claude Code (/context command) and VSCode (GitHub Copilot context indicators) for monitoring context utilization
- [ ] 4.6 Add practical tip about using Claude Code's /context command to track the 40% and 60% thresholds discussed in context engineering sections
- [ ] 4.7 Read 3.3.2-agentic-ide.md and locate the "Popular Examples" list (lines ~36-42)
- [ ] 4.8 Add Claude Code to the Popular Examples list with description: "**[Claude Code](https://claude.ai/code)**: Command-line AI agent from Anthropic featuring robust context management, /context monitoring, structured workflows through slash commands, and integration with development tools"
- [ ] 4.9 Ensure Claude Code entry maintains parallel structure with other tool descriptions and emphasizes context management capabilities
- [ ] 4.10 In the Key Features table (lines ~48-55), verify that context management features are appropriately highlighted (already present, but review for Claude Code relevance)
- [ ] 4.11 Update Exercise 1 and Exercise 2 sections to mention both VSCode and Claude Code as viable options, maintaining VSCode as the primary/default choice for exercises
- [ ] 4.12 Add note in exercises that participants using Claude Code can leverage /context command for monitoring context utilization during SDD workflow
- [ ] 4.13 Run `npm run lint` on all three updated files (3.1.2, 3.3.1, 3.3.2) and fix any linting errors
- [ ] 4.14 Review all three files to ensure VSCode remains primary environment, Claude Code receives equal attention alongside other tools, and context tracking features are emphasized appropriately

### [ ] 5.0 Restructure Exercises with SDD Workflow

**Purpose:** Transform informal "vibing" exercises into structured SDD-based learning experiences that guide participants through the complete specification → task breakdown → implementation → validation workflow.

#### 5.0 Proof Artifact(s)

- Git diff: `docs/3-AI-Engineering/3.3.2-agentic-ide.md` line ~162 demonstrates "Exercise 1 - VSCode Vibing" renamed to "Exercise 1 - Structured MCP Server Development with SDD"
- Documentation review: Exercise 1 instructions include all four SDD stages: (1) Generate specification for MCP server, (2) Break spec into tasks, (3) Implement incrementally with verification, (4) Validate against specification
- Documentation review: Exercise instructions incorporate context management practices (intentional compaction triggers, progressive disclosure, context monitoring guidance)
- Documentation review: Proof artifacts concept introduced in exercise instructions or preceding best practices sections
- Documentation review: Exercise 2 (Windsurf) updated with consistent SDD-based structure and language
- Test output: Front-matter metadata validated correctly (estMinutes: 240 for Exercise 1, estMinutes: 180 for Exercise 2)
- Test output: `npm run lint docs/3-AI-Engineering/3.3.2-agentic-ide.md` passes

#### 5.0 Tasks

- [ ] 5.1 Read 3.3.2-agentic-ide.md and locate Exercise 1 section (starts around line 162)
- [ ] 5.2 Rename "## Exercise 1 - VSCode Vibing" to "## Exercise 1 - Structured MCP Server Development with SDD"
- [ ] 5.3 Update exercise introduction paragraph to explain this exercise applies SDD methodology learned in 3.3.1 to building an MCP server, emphasizing structured approach over exploratory "vibing"
- [ ] 5.4 Restructure "### Steps" section to follow four SDD stages with numbered sub-steps:
  - Stage 1: Generate Specification (steps 1-2 currently, expand with clarifying questions emphasis)
  - Stage 2: Task Breakdown (new step: "Create parent tasks representing demoable units with proof artifacts")
  - Stage 3: Execute with Management (steps 3-5 currently, expand with compaction and verification checkpoints)
  - Stage 4: Validate Implementation (step 6 currently, expand with coverage validation)
- [ ] 5.5 In Stage 1 (Generate Specification), update steps to emphasize brainstorming spec using the resources provided (MCP Full Text, Python SDK) and creating a comprehensive specification before any coding
- [ ] 5.6 Add new Stage 2 (Task Breakdown) step instructing participants to break down their spec into parent tasks, identify relevant files, and create sub-tasks with proof artifacts
- [ ] 5.7 In Stage 3 (Execute with Management), add instruction to monitor context utilization (using /context in Claude Code or similar tools) and trigger intentional compaction when exceeding 60%
- [ ] 5.8 In Stage 3, add guidance on incremental testing and committing after each completed task with appropriate commit messages
- [ ] 5.9 In Stage 4 (Validate Implementation), expand step 6 to include validating implementation against original spec, reviewing proof artifacts, and ensuring all requirements met
- [ ] 5.10 Add subsection "### Context Management Tips" before or within the Steps section covering: monitoring context utilization during development, when to compact (60%+ threshold), progressive disclosure strategies (loading MCP docs on-demand), and avoiding context rot
- [ ] 5.11 Add subsection "### Proof Artifacts" explaining what proof artifacts are, why they matter, and what participants should collect (screenshots, CLI output, test results) - note they're optional for this exercise but good practice
- [ ] 5.12 Locate Exercise 2 section (starts around line 176) and rename "## Exercise 2 - Windsurf" to "## Exercise 2 - Structured MCP Server Development with Windsurf IDE"
- [ ] 5.13 Update Exercise 2 introduction to reference SDD methodology and note that this exercise applies the same structured approach but using Windsurf IDE instead
- [ ] 5.14 Update Exercise 2 steps to match the four-stage SDD structure from Exercise 1 (Generate Spec → Task Breakdown → Execute → Validate)
- [ ] 5.15 Add same context management guidance to Exercise 2 about monitoring utilization and triggering compaction
- [ ] 5.16 Verify front-matter metadata maintains correct exercise information: Exercise 1 (name: "VSCode MCP Server", estMinutes: 240), Exercise 2 (name: "Windsurf MCP Server", estMinutes: 180)
- [ ] 5.17 Update Deliverables section to include questions about applying SDD workflow, managing context during exercises, and using proof artifacts
- [ ] 5.18 Run `npm run lint docs/3-AI-Engineering/3.3.2-agentic-ide.md` and fix any linting errors
- [ ] 5.19 Run `npm run refresh-front-matter` and verify exercise metadata validates correctly
- [ ] 5.20 Review both exercises for clarity, beginner-friendliness, and consistency with SDD methodology taught in 3.3.1

### [ ] 6.0 Integration, Cross-References, and Quality Assurance

**Purpose:** Ensure all updates are cohesive with consistent terminology, valid cross-references between sections, appropriate 12-Factor Agents mentions, and passing all repository validation checks.

#### 6.0 Proof Artifact(s)

- Documentation review: Cross-references verified (3.3.1 references context engineering from 3.1.4, exercises reference SDD workflow from 3.3.1)
- Documentation review: Consistent terminology used across all updated files (context engineering, context rot, intentional compaction, SDD workflow, proof artifacts)
- Documentation review: 12-Factor Agents mentioned in resources/further reading sections with links to HumanLayer resources (https://www.humanlayer.dev/12-factor-agents)
- Documentation review: Content progression flows logically (foundations in 3.1.4 → workflows in 3.3.1 → application in 3.3.2)
- Documentation review: All deliverables sections maintained at end of each document with appropriate questions
- Test output: `npm run lint` passes for ALL updated markdown files
- Test output: `npm run refresh-front-matter` completes successfully, validating all front-matter metadata
- Git log: Commit messages follow repository conventions with clear descriptions (e.g., "docs: expand context engineering coverage in 3.1.4", "docs: replace Harper Reed workflow with SDD in 3.3.1")

#### 6.0 Tasks

- [ ] 6.1 Read through all updated files (3.1.4, 3.3.1, 3.1.2, 3.3.2) and identify all instances where cross-references should be added or verified
- [ ] 6.2 In 3.3.1-agentic-best-practices.md SDD workflow sections, add cross-reference to 3.1.4 context engineering sections: "For detailed coverage of context management, see [AI Best Practices](3.1.4-ai-best-practices.md#understanding-context-windows)"
- [ ] 6.3 In 3.3.2-agentic-ide.md exercise sections, add cross-reference to 3.3.1 SDD workflow: "This exercise applies the SDD methodology covered in [AI Development for Software Engineers](3.3.1-agentic-best-practices.md#thoughtful-ai-development)"
- [ ] 6.4 In 3.1.4-ai-best-practices.md Resources section, add brief mention of 12-Factor Agents with link: "For architectural principles in AI applications, see [12-Factor Agents](https://www.humanlayer.dev/12-factor-agents) methodology"
- [ ] 6.5 Verify consistent terminology across all files: "context engineering" (not "context management" inconsistently), "context rot" (not "context degradation" inconsistently), "intentional compaction" (not just "compaction"), "SDD workflow" (not "SDD methodology" when referring to the four stages)
- [ ] 6.6 Check that "proof artifacts" terminology is consistent across 3.3.1 (SDD workflow) and 3.3.2 (exercises)
- [ ] 6.7 Verify all external links are correctly formatted and functional:
  - Liatrio spec-driven-workflow: https://github.com/liatrio-labs/spec-driven-workflow
  - No Vibes Allowed videos: https://www.youtube.com/watch?v=IS_y40zY-hc and https://www.youtube.com/watch?v=rmvDxxNubIg
  - HumanLayer 12-Factor Agents: https://www.humanlayer.dev/12-factor-agents
  - HumanLayer Advanced Context Engineering: https://github.com/humanlayer/advanced-context-engineering-for-coding-agents
- [ ] 6.8 Verify logical content progression: read 3.1.4 (foundations) → 3.3.1 (workflows) → 3.3.2 (application) in sequence and ensure concepts build appropriately without gaps or contradictions
- [ ] 6.9 Check that all Deliverables sections remain at the end of each document and include updated questions reflecting new content (context engineering in 3.1.4, SDD workflow in 3.3.1, structured exercises in 3.3.2)
- [ ] 6.10 Review quiz questions in src/quizzes/chapter-3/3.3/agentic-best-practices-quiz.js for alignment with updated 3.3.1 content and consistent terminology
- [ ] 6.11 Run `npm run lint` on ALL updated markdown files and fix any remaining linting errors:
  - docs/3-AI-Engineering/3.1.4-ai-best-practices.md
  - docs/3-AI-Engineering/3.3.1-agentic-best-practices.md
  - docs/3-AI-Engineering/3.1.2-ai-agents.md
  - docs/3-AI-Engineering/3.3.2-agentic-ide.md
- [ ] 6.12 Run `npm run refresh-front-matter` and ensure all front-matter metadata validates successfully across all updated files
- [ ] 6.13 Review all git commits made during implementation and verify commit messages follow repository conventions (e.g., "docs: expand context engineering coverage in 3.1.4", "docs: replace Harper Reed workflow with SDD in 3.3.1", "docs: add Claude Code coverage to multiple files", "docs: restructure exercises with SDD workflow in 3.3.2", "test: update quiz with SDD and context engineering questions")
- [ ] 6.14 Perform final read-through of all updated documentation as a beginner would experience it, checking for:
  - Clear explanations without assuming prior knowledge
  - Logical flow from basic to advanced concepts
  - Consistent voice and tone
  - Beginner-appropriate examples
  - No broken internal or external links
- [ ] 6.15 Create a summary document or checklist confirming all proof artifacts from Tasks 1.0-5.0 have been successfully produced and validated
