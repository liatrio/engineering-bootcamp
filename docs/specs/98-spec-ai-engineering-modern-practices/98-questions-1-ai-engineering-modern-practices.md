# 98 Questions Round 1 - AI Engineering Modern Practices

Please answer each question below (select one or more options, or add your own notes). Feel free to add additional context under any question.

## 1. Scope and Depth of SDD Integration

How deeply should Spec-Driven Development (SDD) concepts be integrated into the AI Engineering chapter?

- [ ] (A) Deep integration - Add a dedicated subsection (e.g., 3.3.3) covering all four SDD stages (Generate Spec, Task Breakdown, Execute with Management, Validate) with detailed explanations and examples
- [ ] (B) Moderate integration - Integrate SDD principles into existing sections (3.3.1 and 3.3.2) without creating a new dedicated subsection
- [ ] (C) Light integration - Briefly introduce SDD concepts with links to external resources for participants who want to learn more
- [x] (D) Full replacement - Replace the existing Harper Reed workflow in 3.3.1 with the complete SDD methodology
- [ ] (E) Other (describe)

**Additional context:**

## 2. Context Engineering Coverage Approach

How should Context Engineering, Context Rot, and intentional compaction be presented to participants?

- [ ] (A) Dedicated section - Create a new subsection (e.g., 3.3.4) focused entirely on context engineering principles and practices
- [ ] (B) Integrated throughout - Weave context engineering concepts throughout existing sections where relevant (best practices, agentic IDEs, etc.)
- [x] (C) Expanded best practices - Significantly expand 3.1.4-ai-best-practices.md to include deep coverage of context management
- [ ] (D) Practical focus only - Focus on actionable techniques (intentional compaction, progressive disclosure) without deep theoretical explanation
- [ ] (E) Other (describe)

**Additional context:**

## 3. Research-Plan-Implement (RPI) Workflow Integration

The RPI workflow from HumanLayer shares similarities with the existing Harper Reed workflow but adds context engineering rigor. How should we handle this?

- [ ] (A) Replace existing - Completely replace the Harper Reed workflow with the RPI workflow, emphasizing context engineering throughout
- [ ] (B) Merge approaches - Combine the best of both workflows into a unified methodology that includes context management
- [ ] (C) Present both - Show both workflows as alternative approaches, explaining when to use each
- [ ] (D) Keep Harper Reed, add RPI as advanced - Maintain the simpler Harper Reed workflow as primary, present RPI as an advanced technique
- [x] (E) Other (describe) - Leverage the wisdom of context management from HumanLayer while favoring liatrios sdd approach over the Harper Reed workflow.

**Additional context:**

## 4. Modern Tool Coverage

Which modern agentic development tools should receive coverage in the updated documentation?

- [x] (A) Claude Code - Add comprehensive coverage as a primary tool with examples
- [ ] (B) Cursor - Add or expand coverage as a major agentic IDE
- [x] (C) Windsurf - Maintain current coverage (already included in 3.3.2)
- [x] (D) GitHub Copilot - Maintain current coverage (already mentioned)
- [ ] (E) Zed - Maintain current coverage (already mentioned)
- [ ] (F) CodeLayer - Introduce as an advanced tool for context engineering
- [ ] (G) Cline (formerly Claude Dev) - Add as a VSCode extension option
- [ ] (H) Other tools (describe)

**Note:** Select all that should be included.

**Additional context:**

## 5. Exercise Structure and Rigor

The current 3.3.2 exercises are titled "VSCode Vibing" which contradicts structured methodology. How should the exercises be restructured?

- [x] (A) SDD-based exercises - Restructure exercises to follow the complete SDD workflow (spec → tasks → implementation → validation) with proof artifacts
- [ ] (B) RPI-based exercises - Restructure exercises to follow the Research-Plan-Implement workflow with intentional compaction
- [ ] (C) Hybrid structured approach - Create exercises that incorporate best practices from both SDD and RPI without strict adherence to either
- [ ] (D) Maintain flexibility - Update exercises to be more structured but allow for exploratory "vibing" as a learning tool
- [ ] (E) Progressive complexity - Start with simpler guided exercises, progress to full SDD/RPI workflows in advanced exercises
- [ ] (F) Other (describe)

**Additional context:**

## 6. Content Removal and Revision

Based on the research, which existing content should be flagged for removal or significant revision?

- [x] (A) "VSCode Vibing" title and framing - Replace with structured approach language
- [x] (B) Long chat warnings - Keep the warning but expand with context rot explanations
- [x] (C) Oversimplified best practices - Expand sections that lack depth on modern practices
- [x] (D) Outdated tool recommendations - Update or remove tools that have been superseded
- [ ] (E) None - All existing content is valuable and should be preserved
- [ ] (F) Other specific content (describe)

**Note:** Select all that apply.

**Additional context:**

## 7. Proof Artifacts and Validation

Should the concept of proof artifacts and validation gates from SDD be integrated into exercises and best practices?

- [ ] (A) Yes, comprehensive - Require participants to create proof artifacts (screenshots, CLI output, test results) for all exercises demonstrating completion
- [ ] (B) Yes, selective - Require proof artifacts only for major exercises or milestones
- [x] (C) Introduce concept only - Explain proof artifacts and validation gates as best practices without requiring them in exercises
- [ ] (D) No - Keep exercises focused on learning without formal proof requirements
- [ ] (E) Other (describe)

**Additional context:**

## 8. Target Audience and Learning Objectives

Who is the primary audience for these updates, and what should they be able to do after completing the updated chapter?

- [x] (A) Beginners - Developers new to AI-assisted development who need foundational knowledge and structured workflows
- [ ] (B) Intermediate - Developers with some AI tool experience who want to level up with professional practices
- [ ] (C) Advanced - Experienced AI-assisted developers looking to adopt cutting-edge methodologies
- [ ] (D) Mixed - Content should serve multiple levels with clear progressive complexity
- [ ] (E) Other (describe)

**Expected outcomes after completing this chapter (select all that apply):**
- [x] Understand fundamental AI concepts and tools
- [x] Apply structured workflows (SDD/RPI) to development tasks
- [x] Manage context windows effectively to prevent degradation
- [ ] Use proof artifacts and validation gates for quality assurance
- [x] Select appropriate tools and models for different tasks
- [x] Implement intentional compaction and progressive disclosure
- [x] Build and integrate MCP servers
- [x] Work effectively with agentic IDEs
- [ ] Other (describe)

**Additional context:**

## 9. 12-Factor Agents Integration

The 12-Factor Agents methodology from HumanLayer provides architectural principles for building reliable AI applications. Should this be included?

- [ ] (A) Yes, dedicated coverage - Create a section explaining relevant factors (Own Your Context Window, Compact Errors, Small Focused Agents, etc.)
- [ ] (B) Yes, integrated references - Reference specific factors throughout the chapter where relevant
- [x] (C) Brief mention only - Include 12-Factor Agents in resources/further reading without detailed coverage
- [ ] (D) No - Keep focus on practical workflows rather than architectural principles
- [ ] (E) Other (describe)

**Additional context:**

## 10. Documentation Standards and Repository Patterns

Should the updates follow existing repository standards for the DevOps Bootcamp (front-matter, exercise structure, quiz format)?

- [x] (A) Yes, strictly - Maintain all existing patterns (front-matter metadata, quiz components, deliverables sections, etc.)
- [ ] (B) Yes, with exceptions - Follow standards but propose modifications where modern practices require different approaches
- [ ] (C) Evolve standards - Use this update as an opportunity to establish new patterns for SDD/context engineering content
- [ ] (D) Other (describe)

**Additional context:**

## 11. Critical Thresholds and Metrics

Should the documentation include specific metrics and thresholds from the research (e.g., context window "dumb zone" at 40%+, ~150-200 instruction limit)?

- [x] (A) Yes, include all relevant metrics - Help participants understand concrete performance boundaries. Also mention where appropraite how to track context (ie /context in claude code)
- [ ] (B) Yes, but as guidelines - Present metrics as approximate guidelines rather than hard rules
- [ ] (C) Avoid specific numbers - Focus on principles without committing to specific thresholds that may vary by model
- [ ] (D) Reference external research - Point to research papers and articles for specific metrics
- [ ] (E) Other (describe)

**Additional context:**

## 12. Open Questions and Concerns

Are there any specific concerns, constraints, or additional requirements for this update that haven't been covered above?

**Your response:**
