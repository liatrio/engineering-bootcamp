# 99-spec-bootcamp-rename.md

## Introduction/Overview

This specification defines the rename of the project from "DevOps Bootcamp" to "Liatrio Engineering Bootcamp". This rebranding reflects the expansion of content to include broader engineering topics while maintaining the core DevOps focus. The rename encompasses user-facing text, technical identifiers (package name, Docker images), and introductory content that frames the bootcamp in a broader engineering context.

## Goals

- Rebrand all user-facing elements from "DevOps Bootcamp" to "Liatrio Engineering Bootcamp"
- Update technical identifiers (package.json name, Docker image names) to reflect new branding
- Update introductory content to explain the broader "Engineering Bootcamp" concept while maintaining DevOps focus
- Create a GitHub issue documenting all repository URL references that need updating (after planned repository rename)
- Maintain content quality and accuracy - keep "DevOps" terminology where technically appropriate in chapter content

## User Stories

- **As a bootcamp user**, I want to see the updated "Liatrio Engineering Bootcamp" branding throughout the site so that I understand this is a comprehensive engineering resource, not just DevOps-specific.
- **As a developer**, I want consistent technical naming (package name, Docker images) so that I can easily identify and work with the updated project.
- **As a content maintainer**, I want clear documentation of all GitHub URL references that need updating so that I can coordinate the repository rename without missing any locations.
- **As a new user**, I want updated introductory content that explains the broader engineering scope so that I understand what topics are covered beyond traditional DevOps.

## Demoable Units of Work

### Unit 1: Update User-Facing Branding

**Purpose:** Replace all visible "DevOps Bootcamp" text with "Liatrio Engineering Bootcamp" in user-facing elements (HTML, page titles, main navigation) while preserving "DevOps" where technically accurate in content.

**Functional Requirements:**
- The system shall update the page title in index.html from "Liatrio's DevOps Bootcamp" to "Liatrio's Engineering Bootcamp"
- The system shall update the window.$docsify.name in index.html from "Liatrio's DevOps Bootcamp" to "Liatrio's Engineering Bootcamp"
- The system shall update the meta description in index.html to reference "Engineering Bootcamp" instead of "DevOps Bootcamp"
- The system shall preserve "DevOps" terminology in chapter content where it is technically accurate (e.g., "DevOps practices", "DevOps principles")
- The system shall update CLAUDE.md project overview from "Liatrio's DevOps Bootcamp" to "Liatrio's Engineering Bootcamp"

**Proof Artifacts:**
- Screenshot: index.html rendered in browser showing "Liatrio's Engineering Bootcamp" in title and header demonstrates user-facing branding is updated
- Grep output: Search results showing remaining "DevOps" occurrences are only in appropriate technical contexts demonstrates selective replacement

### Unit 2: Update Technical Identifiers

**Purpose:** Update package.json name, description, and Docker-related naming from "devops-bootcamp" to "engineering-bootcamp" to align technical identifiers with the new branding.

**Functional Requirements:**
- The system shall update package.json "name" field from "devops-bootcamp" to "engineering-bootcamp"
- The system shall update package.json "description" field to reference "Liatrio Engineering Bootcamp"
- The system shall update CLAUDE.md Docker commands from "devops-bootcamp" to "engineering-bootcamp" in all examples
- The system shall update CLAUDE.md development commands documentation to reference "Engineering Bootcamp" where appropriate
- The user shall be able to run `npm install` and `npm start` successfully after changes

**Proof Artifacts:**
- CLI output: `cat package.json | grep -E '(name|description)'` shows updated fields demonstrates package metadata is updated
- CLI output: `npm install && npm start` runs successfully demonstrates package changes don't break functionality
- File content: CLAUDE.md showing updated Docker commands demonstrates documentation reflects new naming

### Unit 3: Update Introductory Content

**Purpose:** Revise introductory sections to explain the broader "Engineering Bootcamp" concept, framing DevOps content within a larger engineering context and acknowledging the expansion into software development topics.

**Functional Requirements:**
- The system shall update the main docs/README.md or docs/1-introduction section to introduce "Liatrio Engineering Bootcamp"
- The content shall explain that the bootcamp covers engineering fundamentals with a focus on DevOps practices
- The content shall acknowledge the expansion into software development topics
- The content shall maintain existing learning paths and chapter structure
- The updated content shall be clear to both new users and existing users familiar with the previous "DevOps Bootcamp" branding

**Proof Artifacts:**
- File content: Updated introduction section demonstrates new framing and explanation
- Review: Content review confirms messaging is clear and accurately represents the bootcamp scope

### Unit 4: Document GitHub URL References

**Purpose:** Create a comprehensive GitHub issue documenting all locations where `github.com/liatrio/devops-bootcamp` URLs appear, to be updated after the repository rename to `liatrio/engineering-bootcamp`.

**Functional Requirements:**
- The system shall use a sub-agent to search the entire codebase for all occurrences of `github.com/liatrio/devops-bootcamp`
- The system shall enumerate all file paths and line numbers where repository URLs appear
- The system shall categorize findings by file type (e.g., configuration files, documentation, code examples, package.json)
- The system shall create a GitHub issue using `gh` CLI with a complete list of locations to update
- The issue shall include context that these URLs will be updated after the repository is renamed to `liatrio/engineering-bootcamp`
- The issue shall provide clear action items for updating each reference

**Proof Artifacts:**
- GitHub issue: Created issue shows comprehensive list of all repository URL references with file paths and context demonstrates complete enumeration
- CLI output: `gh issue view <issue-number>` displays the created issue demonstrates issue was successfully created

## Non-Goals (Out of Scope)

1. **GitHub repository rename**: The actual GitHub repository rename from `liatrio/devops-bootcamp` to `liatrio/engineering-bootcamp` is handled separately by the user
2. **Domain cutover**: The domain change from devops-bootcamp.liatr.io to engineering-bootcamp.liatr.io is handled separately by the user
3. **Updating GitHub URLs in code**: Repository URL references will be documented in a GitHub issue but not updated in this spec (deferred until after repository rename)
4. **Content restructuring**: No changes to chapter organization, learning paths, or content structure beyond introductory sections
5. **Comprehensive DevOps terminology replacement**: "DevOps" remains in chapter content where technically appropriate; only branding/title references are changed
6. **README.md updates**: The root README.md file changes are minimal/not in scope for user-facing branding (primarily development docs)

## Design Considerations

No specific design requirements identified. The changes are primarily textual updates to existing UI elements and documentation. The visual design, layout, and styling remain unchanged.

## Repository Standards

Follow established repository patterns and conventions:
- **Content Guidelines**: Use existing markdown formatting and structure (H2/H3 headers, image placement in img/ folder)
- **Documentation Patterns**: Maintain consistency with CLAUDE.md and STYLE.md formatting
- **Commit Conventions**: Follow existing commit message patterns observed in git history
- **Pre-commit Hooks**: Ensure changes pass front-matter validation and markdown linting (`npm run lint`)
- **Testing**: Verify that `npm start` and Docker commands work after changes

## Technical Considerations

**Node.js Package Changes:**
- Changing the package.json "name" field does not affect local development but should be validated with `npm install`
- No dependency changes are required; only metadata updates

**Docker Naming:**
- Docker image name changes only affect local builds and documentation; no changes to Dockerfile itself
- Updated commands in CLAUDE.md should be tested to ensure accuracy

**Docsify Configuration:**
- Changes to window.$docsify.name in index.html affect the displayed site name
- No changes to Docsify plugins or configuration structure

**Search/Replace Strategy:**
- Use case-sensitive search for exact "DevOps Bootcamp" matches to avoid inadvertently changing technical content
- Manual review of context is required to determine if "DevOps" should be retained in each location

## Security Considerations

No specific security considerations identified. This is a text-based rename with no impact on authentication, authorization, data handling, or sensitive information.

## Success Metrics

1. **Branding consistency**: 100% of user-facing "DevOps Bootcamp" references updated to "Engineering Bootcamp" (excluding intentional "DevOps" in technical content)
2. **Technical functionality**: All npm and Docker commands work successfully with updated naming
3. **GitHub URL documentation**: GitHub issue created with complete enumeration of all repository URL references (33+ locations)
4. **Content clarity**: Introductory content clearly explains the broader Engineering Bootcamp concept and expansion into software development topics
5. **Quality assurance**: All changes pass markdown linting (`npm run lint`) and front-matter validation

## Open Questions

No open questions at this time. All requirements have been clarified through the questions process.
