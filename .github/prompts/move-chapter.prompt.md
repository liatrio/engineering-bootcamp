---
mode: 'agent'
---

# Goal

You are a software engineer that manages a Docsify documentation site. This site has chapters located in #file:../../docs Each folder in there corresponds to a chapter. The chapter folder holds the .md files for that chapter. Each chapter keeps its images in its own unnumbered `img/` folder, referenced as `img/...`, so images move with the chapter and need no changes. Navigation is handled by a file called #file:_sidebar.md. Which must match the .md files relative paths.

Your task is to move a chapter from one number to another.

## Steps:

You would conduct the following steps based on a prompt like "Move chapter 9 to chapter 10":

<!-- markdownlint-disable MD033 -->
1) Move #folder:../../docs/9-<chapter-name> to #file:../../docs/10-<chapter-name>
2) Rename all 9-*.md files in the new location (eg: #file:../../docs/10-<chapter-name>/9-overview.md to #file:../../docs/10-<chapter-name>/10-overview.md). Use a command like this to do the rename `for f in docs/10-<chapter-name>/9.*.md; do mv "$f" "${f/9./10.}"; done`
3) Update the relative path in the frontmatter of all 9-*.md files to point to their new relative path in chapter 10.
4) Search the whole #folder:../../docs for links to .md files in the old location (eg: `9-<chapter-name>/9.3-probes.md`) and update them to the new location. Links are written from the docs root, so they look the same from every page.
5) Run `npm run lint` — it fails on any link that no longer resolves.
6) Update the Front Matter of all the *.md files in the new chapter 10 to reflect the new chapter number. For example, if you are moving chapter 9 to chapter 10, you would change the front matter of all .md files in #folder:../../docs/10-<chapter-name> to reflect that they are now part of chapter 10.
<!-- markdownlint-enable MD033 -->

What the front matter might look like:

```yaml
---
docs/9-kubernetes-container-orchestration/9.3-probes.md:
  category: Container Orchestration
  estReadingMinutes: 10
  exercises:
  - name: Setup
    description: Create a service of type NodePort and a deployment for nginx in the default namespace using Docker Desktop.
    estMinutes: 25
    technologies:
    - Docker
    - Kubernetes
---
```

What it should look like after the change:
```yaml
---
docs/10-kubernetes-container-orchestration/10.3-probes.md:
  category: Container Orchestration
  estReadingMinutes: 10
  exercises:
  - name: Setup
    description: Create a service of type NodePort and a deployment for nginx in the default namespace using Docker Desktop.
    estMinutes: 25
    technologies:
    - Docker
    - Kubernetes
---
```
6) Examples under #folder:../../examples are not chapter-scoped (flat layout), so do not move them. Only update links in the chapter that point to them.
7) Update quiz folders found in #folder:../../src/quiz/chapter-9 to #folder:../../src/quiz/chapter-10. This includes renaming the folders inside to match the new chapter number (eg: #folder:../../src/quiz/chapter-9/9.3.1 to #folder:../../src/quiz/chapter-10/10.3.1).
8) Update any reference to these quizes in the chapter 10 .md files to point to the new location. For example you are looking for a block like the following in the *.md files:
```html
<div class="quizdown">
    <div id="chapter-9/9.1.4/end-of-engineer-checkpoint.js" ></div>
</div>
```

This should now point to the new location:
```html
<div class="quizdown">
    <div id="chapter-10/10.1.4/end-of-engineer-checkpoint.js" ></div>
</div>
```
9) Update chapter 9 in the #file:../../docs/_sidebar.md file to point to the new location for chapter 10. So in this case since we moved chapter 9 that section of the sidebar should now point to chapter 10.
10) Double check that the section in the sidebar for chapter 9 is now pointing to chapter 10. You miss this frequently.
