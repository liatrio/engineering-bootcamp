# 01-spec-keda-exercise.md

## Introduction / Overview

This spec covers the design and implementation of a companion example application and a new bootcamp exercise page for Chapter 9. The example is a minimal faux e-commerce order processing system built around a producer/consumer pattern: a `checkout-service` enqueues orders into Redis, and an `order-processor` consumes them. The system exists to expose a concrete failure mode — queue depth growing faster than a CPU-triggered HPA can react — and to demonstrate how KEDA resolves it by scaling on the queue depth itself.

The deliverable is two things: (1) a self-contained, Taskfile-driven example in `examples/ch9/keda/` deployable to a local k3d cluster, and (2) a new docs page `docs/9-kubernetes-container-orchestration/9.6-keda.md` structured as six progressive exercises. All existing docs pages currently numbered `9.6` and above must be renumbered `+1` and the sidebar updated accordingly.

---

## Goals

- Provide a working producer/consumer system that visibly degrades under flash-sale load without autoscaling.
- Demonstrate that a CPU-based HPA reacts too slowly to prevent queue buildup under a sudden surge.
- Demonstrate that a KEDA `ScaledObject` keyed on Redis list length scales the `order-processor` proactively, keeping the queue shallow under the same load.
- Keep application code simple enough that students can read and understand it in under five minutes — the architecture is the lesson, not the business logic.
- Produce a docs page that follows the established bootcamp exercise format (front-matter, H2 sections, step-by-step kubectl/task commands, deliverables).

---

## User Stories

**As a bootcamp student**, I want to deploy a working order processing system with a single command so that I can start the KEDA exercises without spending time on infrastructure setup.

**As a bootcamp student**, I want to watch the system visibly fail under load and then visibly recover after applying KEDA so that the difference between a reactive (CPU-based) and a proactive (queue-depth-based) autoscaling signal is concrete and observable, not theoretical.

**As a bootcamp student**, I want to write the `ScaledObject` myself by consulting the KEDA documentation so that I practice the skill of reading vendor docs and translating them into Kubernetes resources.

**As a bootcamp instructor**, I want the example to be self-contained and driven by a Taskfile so that I can reset and re-run the demo between cohorts without memorizing a sequence of commands.

---

## Demoable Units of Work

### Unit 1: Core Application Stack Running in k3d

**Purpose:** Both services and Redis are deployed to a local k3d cluster. A checkout request can be sent, the order message appears in Redis, and the order-processor consumes and logs it. The end-to-end data path works.

**Functional Requirements:**
- The `checkout-service` shall expose a `POST /checkout` endpoint that accepts a JSON body with at minimum an `order_id` and `items` array, pushes a serialized message to a Redis list key (`orders:queue`), and returns `HTTP 202 Accepted`.
- The `order-processor` shall continuously pop messages from `orders:queue` using a blocking Redis pop, simulate work for a configurable duration (`PROCESS_DELAY_MS` env var, default `500`), and log the completed order ID.
- The simulated work shall include both a sleep and a small tight CPU loop so that sustained load produces both latency and measurable CPU pressure, making the HPA exercise believable.
- Both services shall read the Redis address from a `REDIS_ADDR` environment variable sourced from a Kubernetes Secret; no credentials shall be hardcoded in source code or container images.
- Both services shall be written in Go and produce minimal, single-stage Docker images using a multi-stage build (builder → `scratch` or `alpine`).
- The `deps:check` Taskfile task shall verify that k3d, Docker, Go, k6, and `watch` are installed, print the missing tool names and a brief installation hint for each, and exit non-zero if any are absent.
- The `cluster:create` Taskfile task shall create a k3d cluster named `keda-demo`.
- The `images:build` task shall build both Docker images.
- The `images:load` task shall import both images into the k3d cluster so no registry is required.
- The `deploy:all` task shall apply the full Kustomize stack (queue + app) in the correct order.

**Proof Artifacts:**
- `kubectl get pods -n keda-demo` output showing `checkout-service`, `order-processor`, and `redis` pods all in `Running` state demonstrates the stack is up.
- `curl -s -X POST http://localhost:<port>/checkout -d '{"order_id":"test-1","items":[{"sku":"ABC","qty":1}]}'` returning `202` demonstrates the checkout endpoint is live.
- `kubectl logs -n keda-demo deploy/order-processor` showing `completed order test-1` demonstrates the end-to-end flow.

---

### Unit 2: k6 Flash Sale Load Test Demonstrating Failure Modes

**Purpose:** A k6 script fires a configurable burst of checkout requests. Under baseline conditions (no autoscaling), the queue grows and order processing falls behind. After adding a CPU HPA, the system still degrades — just more slowly. Students observe both failure modes using `kubectl` commands.

**Functional Requirements:**
- A `load/flash-sale.js` k6 script shall be included that sends concurrent `POST /checkout` requests at a rate and concurrency level sufficient to outpace a single `order-processor` replica within ~30 seconds.
- The script shall accept k6 environment variable overrides for `CHECKOUT_URL`, `VUS` (virtual users), and `DURATION` so instructors can tune load without editing the file.
- The `load:run` Taskfile task shall invoke k6 with default parameters that produce visible queue growth.
- The `observe` Taskfile task shall run a watch loop that prints, every 2 seconds: current Redis list length (`LLEN orders:queue`) and current `order-processor` pod count. This is the primary observable artifact for all three load test runs.
- A `k8s/base/hpa.yaml` manifest shall define a CPU-based HPA targeting the `order-processor` Deployment with min `1`, max `10`, and target CPU `50%`. Students apply this in Exercise 3 and delete it in Exercise 4.

**Proof Artifacts:**
- Terminal output of `observe` task during Exercise 2 showing `queue depth` climbing (e.g., 50 → 200 → 500) with pod count stuck at `1` demonstrates the baseline failure.
- Terminal output of `observe` task during Exercise 3 showing pod count eventually increasing but queue depth still spiking before scale-out demonstrates the HPA lag.

---

### Unit 3: KEDA ScaledObject — Queue-Depth-Based Scaling

**Purpose:** Students install KEDA, write a `ScaledObject` themselves using the KEDA docs, apply it, and re-run the load test. The queue stays shallow and orders process without degradation.

**Functional Requirements:**
- A `k8s/base/redis-secret.yaml` manifest shall provide the Redis connection string as a Kubernetes Secret that the KEDA `TriggerAuthentication` resource references; no credentials shall be hardcoded in the `ScaledObject` or application manifests.
- A `k8s/base/keda-trigger-auth.yaml` manifest shall define a `TriggerAuthentication` resource that reads Redis credentials from the Secret above.
- The `ScaledObject` targeting `order-processor` shall **not** be provided in the repo — students write it themselves, referencing the KEDA docs for the `redis-lists` scaler.
- The docs page shall include a description of every required field a valid `ScaledObject` must have for this setup (target deployment, scaler type, Redis list key, threshold, min/max replicas), without providing the YAML directly.
- The `deploy:all` task shall **not** apply the ScaledObject; students apply it manually as part of Exercise 5.
- After applying the student-written ScaledObject, `kubectl get scaledobject -n keda-demo` shall show `READY: True`.

**Proof Artifacts:**
- `kubectl get scaledobject -n keda-demo` showing `READY: True` demonstrates KEDA accepted the student's ScaledObject.
- Terminal output of `observe` task during Exercise 6 showing queue depth staying below the scaling threshold (e.g., ≤ 5) while pod count grows demonstrates proactive scaling.
- Comparison of queue depth peaks across all three load test runs (Exercise 2: no autoscaling, Exercise 3: CPU HPA, Exercise 6: KEDA) makes the KEDA advantage visible.

---

### Unit 4: Bootcamp Docs Page `9.6-keda.md`

**Purpose:** A complete, publishable exercise page in the bootcamp's existing format that walks students through all six exercises using the example repo. Includes front-matter, intro, exercise sections, and deliverable questions.

**Functional Requirements:**
- The docs page shall include YAML front-matter with `category: Container Orchestration`, `estReadingMinutes`, and an `exercises` array with six entries matching the structure of `9.5-hpas.md` (name, description, estMinutes, technologies).
- The page shall open with a 2–3 paragraph introduction explaining what KEDA is, why event-driven autoscaling matters, and how it differs from the HPA covered in the previous section.
- Each of the six exercises shall be an H2 section (`##`) with numbered steps, inline code blocks for all commands, and an observation prompt telling students what to look for.
- The page shall reference `examples/ch9/keda/` as the companion repo location, consistent with how `9.5-hpas.md` references `examples/ch9/hpas/`.
- The page shall close with a `### Deliverables` section containing the three reflection questions from Josh's spec.
- All existing docs pages currently at `9.6` and above shall be renumbered `+1` (filenames, front-matter, H1 titles, and sidebar entries).
- A forward-reference note shall be added at the bottom of `9.5-hpas.md` pointing to the new `9.6-keda.md` page.
- `docs/_sidebar.md` shall be updated to include `9.6-keda.md` and all renumbered entries.

**Proof Artifacts:**
- `npm start` renders the new page at `/9-kubernetes-container-orchestration/9.6-keda` without 404 or broken sidebar links demonstrates the page is wired into the site.
- Front-matter validation passes (`npm run refresh-front-matter` exits 0) demonstrates metadata is well-formed.

---

## Non-Goals (Out of Scope)

1. **Cloud deployment or public exposure**: The example targets local k3d only. No Ingress, LoadBalancer services, DNS, or TLS.
2. **Persistent storage**: Orders are ephemeral. Redis runs without a PersistentVolume; data is lost on pod restart. This is intentional and acceptable for a demo.
3. **Service-to-service authentication**: No mTLS, API keys, or auth tokens between `checkout-service`, Redis, and `order-processor`.
4. **Monitoring dashboards**: No Prometheus, Grafana, or Loki. Observability is kubectl-native (`logs`, `get pods --watch`, `redis-cli llen`).
5. **Reference ScaledObject solution**: Students write the ScaledObject from scratch using KEDA docs. No solution file is provided.
6. **Production security hardening**: No Pod Security Standards enforcement, NetworkPolicies, or non-root user enforcement beyond what's trivially easy to include.
7. **Multiple Kustomize overlays beyond `local`**: Only a `base` and a `local` overlay. No `staging` or `prod`.

---

## Design Considerations

No UI. The "interface" students interact with is:
- `task <command>` invocations from the terminal
- `kubectl` commands for observation
- A text editor for writing the `ScaledObject` YAML
- k6 terminal output for load test results

The docs page should use the same visual conventions as `9.5-hpas.md`: fenced code blocks for all commands, inline `code` spans for file paths and resource names, no diagrams required (but a simple ASCII flow diagram of `checkout-service → Redis list → order-processor` would be a nice addition if it fits naturally).

---

## Repository Standards

- **Exercise front-matter**: Must follow the YAML template established in `docs/README.md`. Reuse existing categories (`Container Orchestration`) and technologies (`Docker`, `Kubernetes`) rather than introducing new ones. Add `KEDA`, `Redis`, and `k6` only if they do not already exist in the master record; check `docs/README.md` before adding.
- **Example directory layout**: Follow the pattern of `examples/ch9/hpas/` — flat structure, no nested sub-repos, manifests in a dedicated subdirectory.
- **Commit hygiene**: Pre-commit hooks run `front-matter-condenser.js`. After adding the new page, run `npm run refresh-front-matter` before committing to avoid hook failures.
- **Markdown style**: H3 (`###`) as default within pages; H2 (`##`) for top-level exercise sections (these appear in the Docsify table of contents). Images in `/img/`, referenced with HTML `<img>` tags.
- **Taskfile**: Use `task` (Taskfile v3 schema). Task names should use the `namespace:verb` convention (e.g., `cluster:create`, `images:build`).

---

## Technical Considerations

- **Redis scaler**: KEDA's `redis-lists` scaler uses `LLEN` on the target list key. The `ScaledObject` threshold represents the target number of messages per replica. With `PROCESS_DELAY_MS=500` (2 orders/sec/replica) and a threshold of `10`, KEDA will scale up when there are more than 10 unprocessed orders waiting.
- **k3d image loading**: Because k3d runs nodes inside Docker containers, images built locally must be loaded with `k3d image import` (wrapped in the `images:load` task). The `imagePullPolicy` in the Deployment manifests must be `Never` or `IfNotPresent` — set this in the `local` Kustomize overlay patch.
- **Checkout service exposure**: The `checkout-service` only needs to be reachable by k6 running on the host. Use `kubectl port-forward` (wrapped in a Taskfile task or documented as a prerequisite step) rather than a NodePort or LoadBalancer service.
- **KEDA installation**: Students install KEDA via Helm in Exercise 4. The docs page should pin a specific KEDA version (e.g., `2.16`) to avoid version drift between bootcamp cohorts.
- **HPA + KEDA conflict**: KEDA creates and manages its own HPA under the hood. If the student-created CPU HPA from Exercise 3 is not deleted before applying the ScaledObject, Kubernetes will have two HPAs targeting the same deployment. Exercise 4 must explicitly instruct students to delete the manual HPA before proceeding.
- **Processing delay tuning**: The default `PROCESS_DELAY_MS=500` combined with the default k6 load (e.g., 50 VUs for 60 seconds) should produce a peak queue depth of several hundred messages with one replica, making degradation unmistakable. This should be validated during development and the k6 defaults adjusted if needed.
- **Go modules**: Each service lives in its own subdirectory with its own `go.mod`. No shared module or workspace needed at this scope.

---

## Security Considerations

- **Redis credentials**: Redis will run without a password in the local k3d environment. The `REDIS_ADDR` env var (e.g., `redis:6379`) is not sensitive. A Kubernetes Secret is still used to source it (to teach the pattern), but the value itself is not secret. No password auth is configured on the Redis instance.
- **No hardcoded credentials**: Neither service's source code nor Dockerfile shall contain connection strings, passwords, or tokens. All configuration is injected via environment variables from Kubernetes Secrets or ConfigMaps.
- **Proof artifacts**: No sensitive data should appear in proof artifact screenshots or terminal dumps. Redis list contents may contain fake order payloads — these are not sensitive.

---

## Success Metrics

1. **End-to-end demo reproducibility**: A student following the exercise instructions on a clean macOS or Linux machine with k3d, Docker, Go, and k6 installed can complete all six exercises without undocumented steps.
2. **Visible failure mode**: During Exercise 2, `LLEN orders:queue` must reach at least `50` within 30 seconds of starting the load test with default parameters, making degradation unambiguous.
3. **Visible KEDA recovery**: During Exercise 6, `LLEN orders:queue` must stay below `20` throughout the same load test after a valid student-written ScaledObject is applied.
4. **Docs page integration**: `npm run refresh-front-matter` and `npm run lint` both exit `0` after adding the new page and renumbering existing ones.
5. **Student self-sufficiency on ScaledObject**: The docs page description of the required ScaledObject fields is complete enough that a student can write a valid one from the KEDA docs alone, without needing to ask for help.

---

## Open Questions

No open questions at this time.

---

## Resolved Decisions

1. **`deps:check` task**: Yes — the Taskfile shall include a `deps:check` task that verifies k3d, Docker, Go, k6, and `watch` are installed and prints installation hints for any that are missing.
2. **`observe` task implementation**: Use `watch -n2`. The docs page shall list `watch` as a prerequisite tool and instruct macOS users to install it via `brew install watch`.
3. **Renumbering existing 9.6+ docs pages**: Out of scope — the author will handle renaming manually after this feature is merged.
