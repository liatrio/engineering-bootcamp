# 01 Questions Round 1 - KEDA Exercise

Please answer each question below (select one or more options, or add your own notes). Feel free to add additional context under any question.

## 1. Message Queue Technology

Which queue should the system use? This affects the KEDA scaler type, the complexity of the manifests, and how familiar the technology feels to students.

- [x] (A) **Redis (Lists)** — Simple, widely known, minimal setup. KEDA's `redis-lists` scaler is well-documented. Students likely already know Redis from other chapters. Recommended for keeping the focus on KEDA rather than the queue itself.
- [ ] (B) **RabbitMQ** — More realistic for e-commerce. Richer KEDA scaler (messages ready in queue). Adds ~1 Helm chart dependency and a bit more config overhead.
- [ ] (C) **NATS JetStream** — Lightweight and modern, but less familiar to most bootcamp students.
- [ ] (D) Other (describe)

## 2. Application Language

Which language for `checkout-service` and `order-processor`? This affects how approachable the code is for students who may read it.

- [x] (A) **Go** — Fast startup, single binary, tiny Docker images, idiomatic for Kubernetes tooling. Slightly higher barrier if students aren't Go-familiar, but the code will be short enough that language isn't a blocker. Recommended.
- [ ] (B) **Python** — Very readable for beginners, familiar to most. Slightly heavier images and slower startup than Go.
- [ ] (C) **Node.js** — Familiar to many, async-friendly for the HTTP layer.
- [ ] (D) Other (describe)

## 3. Load Generator

How should the flash sale simulation be run? This is what students trigger in Exercises 2, 3, and 6 to observe queue buildup.

- [ ] (A) **Shell script (`load/run.sh`)** — Uses `curl` in a loop with configurable concurrency (e.g., `xargs` or background jobs). Zero extra dependencies. Students can read and understand it easily.
- [x] (B) **k6 script** — Industry-standard load testing tool, great learning artifact. Adds one CLI dependency (`k6`).
- [ ] (C) **`hey` one-liner** — Single binary, clean output. One extra install but minimal.
- [ ] (D) Other (describe)

## 4. Simulated Processing Delay

The `order-processor` needs to do "fake" CPU-bound work so the queue backs up visibly under load. How should this be simulated?

- [ ] (A) **Fixed sleep (e.g., 500ms per order)** — Simple and predictable. Queue depth becomes purely a function of arrival rate vs. worker count. Easy to reason about for students.
- [ ] (B) **Sleep + tight CPU loop (math/hashing)** — More realistic CPU spike that makes the HPA exercise (Exercise 3) more convincing. Slightly harder to tune.
- [x] (C) **Configurable via env var** — Let the sleep/work duration be set at deploy time so instructors can tune the demo without rebuilding images.
- [ ] (D) Other (describe)

## 5. Reference ScaledObject

In Exercise 5, students write the ScaledObject themselves. Should the repo include a reference solution?

- [ ] (A) **Yes, in a `solutions/` subdirectory** — Students can check their work. Instructors can use it to reset state between cohorts.
- [ ] (B) **Yes, but commented out in the main manifests** — Lower friction, but risks students skipping the exercise.
- [x] (C) **No reference solution** — Students must figure it out from the KEDA docs. More authentic discovery, but could create frustrating dead ends.
- [ ] (D) Other (describe)

## 6. Kustomize Structure

How should the Kubernetes manifests be organized?

- [ ] (A) **Base only** — Single set of manifests in `k8s/base/`. Simple, no overlays. Good for a learning example where there's only one target environment (local k3d).
- [x] (B) **Base + `local` overlay** — Follows Kustomize best practices more closely. Slightly more files but teaches the pattern students will see in real projects.
- [ ] (C) Other (describe)

## 7. Sidebar / Navigation

The existing bootcamp sidebar at `docs/_sidebar.md` will need an entry for the new `9.6-keda.md` page. Should we also update the HPA page (`9.5-hpas.md`) to link forward to this new exercise as a "next steps" or "what's next" pointer?

- [ ] (A) **Yes** — Add a brief forward reference at the bottom of 9.5-hpas.md pointing to the KEDA exercise.
- [ ] (B) **No** — Keep the pages self-contained; the sidebar is sufficient navigation.
- [x] (C) Other (describe) Yes to (A), we will also need to increment all subsequent 9.* sections by 1.
