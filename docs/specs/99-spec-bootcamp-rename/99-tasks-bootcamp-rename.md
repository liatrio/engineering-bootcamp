# 99-tasks-bootcamp-rename.md

## Relevant Files

- `index.html` - Main HTML file containing page title, Docsify configuration, and meta description
- `package.json` - Node.js package configuration with name and description fields
- `CLAUDE.md` - Project documentation containing overview and Docker command examples
- `STYLE.md` - Style guide documentation with project header
- `docs/1-introduction/1.0-overview.md` - Introduction chapter overview with chapter goals
- `.github/prompts/new-section.prompt.md` - GitHub prompts that may reference the bootcamp
- `docs/1-introduction/1.1-devops-defined.md` - DevOps definitions (review for context preservation)
- `docs/1-introduction/1.3-basics.md` - Basics section (review for references)
- `docs/README.md` - Master front-matter record (may contain references)
- Various documentation files in `docs/` - Files containing "DevOps Bootcamp" that need selective updates

### Notes

- Use case-sensitive search for exact "DevOps Bootcamp" matches to avoid inadvertently changing technical content
- Manual review of context is required to determine if "DevOps" should be retained in each location
- Follow the repository's existing markdown formatting and structure (H2/H3 headers)
- Ensure changes pass front-matter validation and markdown linting (`npm run lint`)
- Verify that `npm start` and Docker commands work after changes
- Preserve "DevOps" terminology in chapter content where it is technically accurate (e.g., "DevOps practices", "DevOps principles")

## Tasks

### [x] 1.0 Update User-Facing Branding in HTML and Configuration

Update all user-visible branding elements in index.html from "DevOps Bootcamp" to "Engineering Bootcamp" while preserving "DevOps" terminology in technical contexts throughout documentation content.

#### 1.0 Proof Artifact(s)

- Screenshot: Browser showing `http://localhost:3000` with "Liatrio's Engineering Bootcamp" in page title and header demonstrates user-facing branding is updated
- CLI: `npm start` successfully serves site demonstrates changes don't break build
- Grep output: `grep -ri "DevOps Bootcamp" docs/ --exclude-dir=specs` showing remaining occurrences are only in appropriate technical contexts demonstrates selective replacement

#### 1.0 Tasks

- [x] 1.1 Read `index.html` to understand current page title, Docsify configuration, and meta description structure
- [x] 1.2 Update page `<title>` tag in `index.html` from "Liatrio's DevOps Bootcamp" to "Liatrio's Engineering Bootcamp"
- [x] 1.3 Update `window.$docsify.name` in `index.html` from "Liatrio's DevOps Bootcamp" to "Liatrio's Engineering Bootcamp"
- [x] 1.4 Update meta description in `index.html` to reference "Engineering Bootcamp" instead of "DevOps Bootcamp" (e.g., "Learn the basics of DevOps, CI/CD, Containerization, and Cloud Computing with Liatrio's Engineering Bootcamp.")
- [x] 1.5 Search for all occurrences of "DevOps Bootcamp" in documentation files using `grep -ri "DevOps Bootcamp" docs/ --exclude-dir=specs`
- [x] 1.6 Review each occurrence and determine if it should be updated to "Engineering Bootcamp" or preserved as "DevOps" in technical context (e.g., keep "DevOps practices" but change "complete DevOps Bootcamp")
- [x] 1.7 Update appropriate references in documentation files from "DevOps Bootcamp" to "Engineering Bootcamp" (files may include: docs/1-introduction/1.0-overview.md, docs/1-introduction/1.3-basics.md, docs/README.md, various chapter files)
- [x] 1.8 Run `npm start` to build and serve the site locally
- [x] 1.9 Open browser to `http://localhost:3000` and verify "Liatrio's Engineering Bootcamp" appears in page title and site header
- [x] 1.10 Take screenshot of homepage showing updated branding
- [x] 1.11 Run `grep -ri "DevOps Bootcamp" docs/ --exclude-dir=specs` and verify remaining occurrences are only in appropriate technical contexts
- [x] 1.12 Stop the local server (Ctrl+C)

### [~] 2.0 Update Technical Identifiers in Package Configuration

Update package.json name and description fields, and update all Docker-related documentation from "devops-bootcamp" to "engineering-bootcamp".

#### 2.0 Proof Artifact(s)

- CLI: `cat package.json | grep -E '(name|description)'` shows "engineering-bootcamp" and "Liatrio Engineering Bootcamp" demonstrates package metadata is updated
- CLI: `npm install` completes successfully demonstrates package changes are valid
- File content: CLAUDE.md showing Docker commands with "engineering-bootcamp" demonstrates documentation reflects new naming

#### 2.0 Tasks

- [x] 2.1 Read `package.json` to understand current name and description fields
- [x] 2.2 Update `package.json` "name" field from "devops-bootcamp" to "engineering-bootcamp"
- [x] 2.3 Update `package.json` "description" field from "Liatrio DevOps Bootcamp" to "Liatrio Engineering Bootcamp"
- [x] 2.4 Run `cat package.json | grep -E '(name|description)'` to verify updates
- [x] 2.5 Run `npm install` to verify package changes are valid and don't break dependencies
- [x] 2.6 Read `CLAUDE.md` to locate all Docker command examples
- [x] 2.7 Update Docker commands in CLAUDE.md from "devops-bootcamp" to "engineering-bootcamp" (e.g., `docker build . -t devops-bootcamp` becomes `docker build . -t engineering-bootcamp`)
- [x] 2.8 Update Docker run commands in CLAUDE.md from "devops-bootcamp" to "engineering-bootcamp" (e.g., `docker run -d -p 3000:3000 --name devops-bootcamp devops-bootcamp` becomes `docker run -d -p 3000:3000 --name engineering-bootcamp engineering-bootcamp`)
- [x] 2.9 Verify all Docker command references in CLAUDE.md have been updated by searching for "devops-bootcamp" in the file
- [x] 2.10 Read updated sections of CLAUDE.md to confirm Docker commands are accurate

### [ ] 3.0 Update Introductory and Project Documentation Content

Revise STYLE.md, CLAUDE.md, and docs/1-introduction/1.0-overview.md to introduce "Liatrio Engineering Bootcamp" concept and explain the broader engineering scope while maintaining DevOps focus.

#### 3.0 Proof Artifact(s)

- File content: Updated STYLE.md header showing "Liatrio's Engineering Bootcamp" demonstrates style guide is updated
- File content: Updated CLAUDE.md project overview explaining Engineering Bootcamp concept demonstrates documentation reflects new framing
- File content: Updated docs/1-introduction/1.0-overview.md with revised chapter goals demonstrates introduction is updated
- CLI: `npm run lint` passes demonstrates all markdown changes follow formatting standards

#### 3.0 Tasks

- [ ] 3.1 Read `STYLE.md` header section
- [ ] 3.2 Update STYLE.md header from "# Liatrio's DevOps Bootcamp" to "# Liatrio's Engineering Bootcamp"
- [ ] 3.3 Read `CLAUDE.md` project overview section
- [ ] 3.4 Update CLAUDE.md project overview from "This is Liatrio's DevOps Bootcamp" to "This is Liatrio's Engineering Bootcamp - a comprehensive educational resource built with Docsify that covers engineering fundamentals with a focus on DevOps practices and tools"
- [ ] 3.5 Review CLAUDE.md for any other references to "DevOps Bootcamp" in descriptive text and update to "Engineering Bootcamp" where appropriate
- [ ] 3.6 Read `docs/1-introduction/1.0-overview.md`
- [ ] 3.7 Update docs/1-introduction/1.0-overview.md chapter title if needed (may remain "Introduction to DevOps" as this is technically accurate)
- [ ] 3.8 Update docs/1-introduction/1.0-overview.md chapter goal #3 from "Familiarize yourself with tools needed to successfully complete DevOps Bootcamp" to "Familiarize yourself with tools needed to successfully complete Liatrio's Engineering Bootcamp"
- [ ] 3.9 Read `.github/prompts/new-section.prompt.md`
- [ ] 3.10 Update .github/prompts/new-section.prompt.md line 4 from "You are an DevOps consulting expert that designs content for a college level DevOps bootcamp" to "You are a DevOps consulting expert that designs content for a college level engineering bootcamp with a focus on DevOps" (note: also fixes grammar "an DevOps" to "a DevOps")
- [ ] 3.11 Run `npm run lint` to verify all markdown changes pass linting
- [ ] 3.12 If lint errors occur, fix them and re-run `npm run lint` until it passes

### [ ] 4.0 Document GitHub Repository URL References

Use a sub-agent to comprehensively search for all `github.com/liatrio/devops-bootcamp` URL references and create a GitHub issue documenting all locations for future updates after repository rename.

#### 4.0 Proof Artifact(s)

- GitHub issue: Created issue contains complete list of all repository URL references organized by file type with file paths and line numbers demonstrates comprehensive enumeration
- CLI: `gh issue view <issue-number>` displays the created issue with actionable update list demonstrates issue was successfully created
- Grep output: Search results confirming 26+ locations were identified and documented demonstrates completeness

#### 4.0 Tasks

- [ ] 4.1 Use Task tool with subagent_type="general-purpose" to search the entire codebase for all occurrences of "github.com/liatrio/devops-bootcamp" using grep and enumerate all file paths and line numbers
- [ ] 4.2 Review the sub-agent's findings and organize results by file type/category (e.g., Configuration Files: package.json; Documentation: docs/*.md; Code Examples: examples/*)
- [ ] 4.3 Draft GitHub issue content with title "Update GitHub repository URLs after rename to liatrio/engineering-bootcamp"
- [ ] 4.4 Include issue body with: (1) Context explaining these URLs need updating after repository rename, (2) Comprehensive categorized list of all files and line numbers with repository URLs, (3) Action items for updating each reference after repo rename
- [ ] 4.5 Create GitHub issue using `gh issue create --title "Update GitHub repository URLs after rename to liatrio/engineering-bootcamp" --body "<issue-body-content>"`
- [ ] 4.6 Capture the issue number from the creation output
- [ ] 4.7 Run `gh issue view <issue-number>` to verify issue was created successfully and contains all expected content
- [ ] 4.8 Run `grep -r "github.com/liatrio/devops-bootcamp" . --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=specs` to confirm all locations were documented (should match 26+ files)
- [ ] 4.9 Compare grep results with issue content to ensure completeness
