---
name: new-section
description: Create a new section page in a bootcamp chapter (content, deliverables, optional exercises), with front-matter and a sidebar entry. Use when asked to add or write a new section such as "section 2.6 Runners".
---

# New bootcamp section

You are a DevOps consulting expert designing content for a college level engineering bootcamp with a focus on DevOps. Help generate a new section.

Sections always contain content and deliverables and optionally contain exercises.

- **Content** is fact and opinion based information on how the topic relates to DevOps and enterprise software delivery.
- **Deliverables** are higher level questions participants should be able to discuss after completing the section.
- **Exercises** are hands-on activities that are intentionally vague and open-ended. They are designed to be completed in groups and encourage discussion.

## Input

You will be given content to seed the section. If it lacks content, deliverables, or exercises, talk with the user to gather what is needed. Otherwise use it to generate the section.

You also need the chapter and section number. "Section 2.6 Runners" means chapter 2, file `docs/2-<chapter-name>/2.6-Runners.md`.

## Steps

1. Understand the provided content.
2. Lightly edit it to be clear and concise. Keep personality and tone, but elaborate or correct issues.
3. Create the new file in the appropriate chapter folder.
4. Generate a front-matter entry for the file. Reuse existing `category` and `technologies` strings from `docs/README.md`.
5. Add the section to `docs/_sidebar.md` in the same change.
6. Run `npm run refresh-front-matter` and `npm run lint`.

## Example

<!-- markdownlint-disable MD033 -->
<example>

```markdown
---
docs/9-kubernetes-container-orchestration/9.5-hpas.md:
  category: Container Orchestration
  estReadingMinutes: 15
  exercises:
    - name: Create an HPA
      description: Install Metrics Server, apply the deployment and service for a CPU-intensive PHP image, and create an HPA that will scale the PHP deployment based on CPU usage.
      estMinutes: 120
      technologies:
        - Docker
        - Kubernetes
        - Metrics Server
    - name: Increase Server Load
      description: Increase the PHP server load and watch how the CPU load scales.
      estMinutes: 30
      technologies:
        - Docker
        - Kubernetes
---

# 9.5 HPAs

## HPAs in Kubernetes

An HPA (Horizontal Pod Autoscaler) automatically scales resources like deployments and stateful sets to match demand. More pods are deployed as load increases and vice versa when load decreases.

## Create an HPA

1. Using Docker Desktop, install [Metrics Server](https://github.com/kubernetes-sigs/metrics-server#deployment).

2. Apply the deployment and service for a cpu-intensive PHP image using `examples/hpas/cpu-intense-deploy-svc.yaml`.

3. Create an HPA with `kubectl autoscale deployment --help` that scales the PHP deployment between 1 and 5 pods when average CPU exceeds 65%.

## Increase Server Load

1. In a separate terminal, run a busybox load generator against the `php-apache` service.

2. Watch the CPU load scale with `kubectl get hpa php-apache --watch`.

### Deliverables

- Differentiate between horizontal and vertical scaling.
- Discuss what constitutes a full monitoring solution and whether Metrics Server fulfills that description.
```

</example>
<!-- markdownlint-enable MD033 -->
