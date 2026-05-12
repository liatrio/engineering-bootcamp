# 01-tasks-keda-exercise.md

## Relevant Files

### New Files to Create

- `examples/ch9/keda/checkout-service/main.go` — HTTP server exposing `POST /checkout`; pushes orders to Redis list `orders:queue`
- `examples/ch9/keda/checkout-service/go.mod` — Go module file for checkout-service
- `examples/ch9/keda/checkout-service/Dockerfile` — Multi-stage build: Go builder → scratch/alpine final image
- `examples/ch9/keda/order-processor/main.go` — Blocking Redis pop consumer; sleeps `PROCESS_DELAY_MS` ms + runs a small CPU loop per message
- `examples/ch9/keda/order-processor/go.mod` — Go module file for order-processor
- `examples/ch9/keda/order-processor/Dockerfile` — Multi-stage build matching checkout-service pattern
- `examples/ch9/keda/k8s/base/kustomization.yaml` — Kustomize base listing all resources
- `examples/ch9/keda/k8s/base/namespace.yaml` — Namespace `keda-demo`
- `examples/ch9/keda/k8s/base/redis.yaml` — Redis Deployment + Service (redis:7-alpine)
- `examples/ch9/keda/k8s/base/redis-secret.yaml` — Secret with `REDIS_ADDR=redis:6379`
- `examples/ch9/keda/k8s/base/checkout-service.yaml` — Deployment + ClusterIP Service for checkout-service
- `examples/ch9/keda/k8s/base/order-processor.yaml` — Deployment for order-processor (CPU resources set so HPA works)
- `examples/ch9/keda/k8s/base/hpa.yaml` — CPU-based HPA targeting order-processor (min 1, max 10, target 50%)
- `examples/ch9/keda/k8s/base/keda-trigger-auth.yaml` — KEDA `TriggerAuthentication` referencing `redis-secret`
- `examples/ch9/keda/k8s/overlays/local/kustomization.yaml` — Local overlay referencing base, applying image pull policy patch
- `examples/ch9/keda/k8s/overlays/local/image-pull-policy-patch.yaml` — Strategic merge patch setting `imagePullPolicy: Never` on both service Deployments
- `examples/ch9/keda/load/flash-sale.js` — k6 load test script; accepts `CHECKOUT_URL`, `VUS`, `DURATION` env overrides
- `examples/ch9/keda/Taskfile.yml` — Taskfile v3 with all required tasks
- `docs/9-kubernetes-container-orchestration/9.6-keda.md` — New bootcamp exercise page

### Files to Modify

- `docs/_sidebar.md` — Add `9.6-keda.md` entry between 9.5-hpas and the current 9.6-webhooks entries
- `docs/9-kubernetes-container-orchestration/9.5-hpas.md` — Add forward-reference note pointing to 9.6-keda.md
- `docs/README.md` — Updated automatically by `npm run refresh-front-matter`

### Notes

- Both Go services live in their own subdirectory with their own `go.mod`; no shared workspace.
- Kubernetes manifests use namespace `keda-demo` consistently across all resources.
- The local Kustomize overlay patches `imagePullPolicy: Never` so k3d does not attempt remote pulls.
- The `_sidebar.md` change will temporarily show two `9.6` entries (keda + webhooks) until the author handles renumbering per Resolved Decision #3 — this is expected and acceptable.
- Run `npm run refresh-front-matter` after creating `9.6-keda.md` and before committing to satisfy the Husky pre-commit hook.
- Run `npm run lint` after all doc changes and fix any markdown style violations before committing.

---

## Tasks

### [x] 1.0 Go Application Services

Build the two Go microservices (`checkout-service` and `order-processor`) with multi-stage Dockerfiles. This is the core application layer that everything else depends on.

#### 1.0 Proof Artifact(s)

- CLI: `docker build -t checkout-service:local ./checkout-service` exits 0 demonstrates checkout-service image builds successfully
- CLI: `docker build -t order-processor:local ./order-processor` exits 0 demonstrates order-processor image builds successfully
- CLI: `curl -s -X POST http://localhost:8080/checkout -d '{"order_id":"test-1","items":[{"sku":"ABC","qty":1}]}' -w "%{http_code}"` returns `202` demonstrates checkout endpoint is live
- Log: `kubectl logs -n keda-demo deploy/order-processor` showing `completed order test-1` demonstrates end-to-end message flow through Redis

#### 1.0 Tasks

- [x] 1.1 Create `examples/ch9/keda/checkout-service/go.mod` with module path `github.com/liatrio/engineering-bootcamp/examples/ch9/keda/checkout-service` and Go 1.22+; run `go get github.com/redis/go-redis/v9` to add the Redis client dependency
- [x] 1.2 Write `examples/ch9/keda/checkout-service/main.go`: HTTP server (default port `8080`, overridable via `PORT` env) with a single `POST /checkout` handler that decodes a JSON body containing at minimum `order_id` (string) and `items` (array), uses `RPUSH` to push the serialized JSON to the Redis list key `orders:queue`, and returns `HTTP 202`; read `REDIS_ADDR` from env (fail fast with a clear error if unset)
- [x] 1.3 Create `examples/ch9/keda/order-processor/go.mod` with its own module path and Go 1.22+; run `go get github.com/redis/go-redis/v9` to add the Redis client dependency
- [x] 1.4 Write `examples/ch9/keda/order-processor/main.go`: infinite loop using `BLPOP orders:queue 0` (blocking, no timeout) to pop messages one at a time; for each message, sleep `PROCESS_DELAY_MS` milliseconds (default `500`, read from env) then run a small tight CPU loop (e.g., 1 million iterations of integer math) to produce measurable CPU pressure; log `completed order <order_id>` to stdout; read `REDIS_ADDR` from env (fail fast if unset)
- [x] 1.5 Create `examples/ch9/keda/checkout-service/Dockerfile`: multi-stage build with a `golang:1.22-alpine` builder stage (`COPY go.mod go.sum`, `go mod download`, `COPY . .`, `go build -o /checkout-service`) and a minimal final stage (`FROM scratch` or `FROM alpine:3.19`) that copies only the binary, exposes port `8080`, and sets the binary as `ENTRYPOINT`
- [x] 1.6 Create `examples/ch9/keda/order-processor/Dockerfile`: same multi-stage pattern as checkout-service Dockerfile, building the order-processor binary

---

### [ ] 2.0 Kubernetes Manifests (Kustomize)

Create all Kubernetes YAML for the full stack: Redis, both services, the Secret, the CPU HPA, and the KEDA TriggerAuthentication resource. Organized as Kustomize base + local overlay with imagePullPolicy patch for k3d.

#### 2.0 Proof Artifact(s)

- CLI: `kubectl apply -k k8s/overlays/local` exits 0 demonstrates manifests are valid and apply cleanly
- CLI: `kubectl get pods -n keda-demo` showing `checkout-service`, `order-processor`, and `redis` pods all in `Running` state demonstrates the full stack is up
- CLI: `kubectl get secret -n keda-demo redis-secret` exits 0 demonstrates Secret exists for KEDA TriggerAuthentication
- CLI: `kubectl get triggerauthentication -n keda-demo` exits 0 demonstrates KEDA auth resource is present

#### 2.0 Tasks

- [ ] 2.1 Create `examples/ch9/keda/k8s/base/namespace.yaml`: `Namespace` resource named `keda-demo`
- [ ] 2.2 Create `examples/ch9/keda/k8s/base/redis-secret.yaml`: `Secret` named `redis-secret` in namespace `keda-demo` with a `stringData` entry `REDIS_ADDR: redis:6379` (no password — teaching the pattern, not securing a real credential)
- [ ] 2.3 Create `examples/ch9/keda/k8s/base/redis.yaml`: `Deployment` named `redis` in namespace `keda-demo` using image `redis:7-alpine`, single replica, port `6379`, no resource limits needed; and a `ClusterIP` `Service` named `redis` exposing port `6379` targeting the same pod
- [ ] 2.4 Create `examples/ch9/keda/k8s/base/checkout-service.yaml`: `Deployment` named `checkout-service` in namespace `keda-demo`, one replica, container port `8080`; inject `REDIS_ADDR` from `redis-secret` via `secretKeyRef`; set CPU `requests: 100m` and `limits: 250m`; include a `ClusterIP` `Service` named `checkout-service` on port `8080`
- [ ] 2.5 Create `examples/ch9/keda/k8s/base/order-processor.yaml`: `Deployment` named `order-processor` in namespace `keda-demo`, one replica; inject `REDIS_ADDR` from `redis-secret` and set `PROCESS_DELAY_MS: "500"` as a plain env var; set CPU `requests: 100m` and `limits: 500m` (CPU limits are required for the HPA exercise to show meaningful CPU utilization); no Service needed
- [ ] 2.6 Create `examples/ch9/keda/k8s/base/hpa.yaml`: `HorizontalPodAutoscaler` named `order-processor-hpa` in namespace `keda-demo`; target the `order-processor` Deployment; `minReplicas: 1`, `maxReplicas: 10`; metric: `Resource` type `cpu`, target `Utilization: 50`
- [ ] 2.7 Create `examples/ch9/keda/k8s/base/keda-trigger-auth.yaml`: `TriggerAuthentication` (apiVersion `keda.sh/v1alpha1`) named `redis-trigger-auth` in namespace `keda-demo`; `spec.secretTargetRef` referencing key `REDIS_ADDR` from Secret `redis-secret` as parameter `address`
- [ ] 2.8 Create `examples/ch9/keda/k8s/base/kustomization.yaml`: list all base resources in dependency order — `namespace.yaml`, `redis-secret.yaml`, `redis.yaml`, `checkout-service.yaml`, `order-processor.yaml`, `hpa.yaml`, `keda-trigger-auth.yaml`; **do not include a ScaledObject** (students write that themselves)
- [ ] 2.9 Create `examples/ch9/keda/k8s/overlays/local/kustomization.yaml`: reference `../../base`, list `image-pull-policy-patch.yaml` as a `patches` entry
- [ ] 2.10 Create `examples/ch9/keda/k8s/overlays/local/image-pull-policy-patch.yaml`: strategic merge patches for both `checkout-service` and `order-processor` Deployments setting `imagePullPolicy: Never` on their containers so k3d uses the locally imported images without attempting a registry pull

---

### [ ] 3.0 Taskfile and k6 Load Test Script

Write the `Taskfile.yml` with all required tasks and the `load/flash-sale.js` k6 script. This is the primary operator interface students use throughout all six exercises.

#### 3.0 Proof Artifact(s)

- CLI: `task deps:check` prints a missing-tool hint and exits non-zero when a dependency (e.g., k6) is absent demonstrates dependency checking works
- CLI: `task cluster:create` creates a k3d cluster named `keda-demo` (verified with `k3d cluster list`) demonstrates cluster provisioning task works
- CLI: `task images:build && task images:load` succeeds and both images appear in the k3d cluster demonstrates the full image pipeline task works
- CLI: `task deploy:all` applies manifests and all pods reach `Running` demonstrates the one-shot deploy task works
- CLI: `task load:run` triggers k6 and shows checkout requests being sent demonstrates load test task works
- CLI: `task observe` prints Redis `LLEN orders:queue` and pod count every 2 seconds demonstrates the observe loop task works
- CLI: During `task load:run` with no autoscaling, `LLEN orders:queue` reaches ≥ 50 within 30 seconds demonstrates the load is sufficient to expose the failure mode

#### 3.0 Tasks

- [ ] 3.1 Create `examples/ch9/keda/Taskfile.yml` with `version: "3"` schema; add a top-level `vars` block defining `CLUSTER_NAME: keda-demo`, `NAMESPACE: keda-demo`, `CHECKOUT_IMAGE: checkout-service:local`, `ORDER_IMAGE: order-processor:local`; use the `namespace:verb` naming convention for all tasks
- [ ] 3.2 Implement the `deps:check` task: for each required tool (`k3d`, `docker`, `go`, `k6`, `watch`), test presence with `command -v <tool>`; if any are missing, print the tool name and a one-line `brew install <tool>` / package-manager hint; exit non-zero if at least one tool is absent; list this as a dependency of `cluster:create`
- [ ] 3.3 Implement the `cluster:create` task: run `k3d cluster create {{.CLUSTER_NAME}}`; document in task `desc` that it creates the local k3d cluster; add `deps: [deps:check]`
- [ ] 3.4 Implement the `cluster:delete` task: run `k3d cluster delete {{.CLUSTER_NAME}}` to allow clean teardown between exercise runs
- [ ] 3.5 Implement the `images:build` task: run `docker build -t {{.CHECKOUT_IMAGE}} ./checkout-service` and `docker build -t {{.ORDER_IMAGE}} ./order-processor`; both build commands must complete before the task is considered done
- [ ] 3.6 Implement the `images:load` task: run `k3d image import {{.CHECKOUT_IMAGE}} {{.ORDER_IMAGE}} -c {{.CLUSTER_NAME}}` to push both images into the k3d cluster nodes; add `deps: [images:build]`
- [ ] 3.7 Implement the `deploy:all` task: run `kubectl apply -k k8s/overlays/local`; add `deps: [images:load]`; include a brief `desc` noting it does NOT apply the ScaledObject (students do that manually)
- [ ] 3.8 Implement the `load:run` task: run `k6 run -e CHECKOUT_URL=${CHECKOUT_URL:-http://localhost:8080} -e VUS=${VUS:-50} -e DURATION=${DURATION:-60s} load/flash-sale.js`; the env-var syntax allows overrides without editing the file; add a `desc` explaining the defaults
- [ ] 3.9 Implement the `observe` task: run `watch -n2 'echo "=== Queue depth ===" && kubectl exec -n {{.NAMESPACE}} deploy/redis -- redis-cli llen orders:queue && echo "=== order-processor pods ===" && kubectl get pods -n {{.NAMESPACE}} -l app=order-processor --no-headers | wc -l'`; this is the primary observable artifact for all three load test runs
- [ ] 3.10 Create `examples/ch9/keda/load/flash-sale.js`: k6 script that reads `CHECKOUT_URL` (default `http://localhost:8080`), `VUS` (default `50`), and `DURATION` (default `60s`) from `__ENV`; in the `options` block set `vus` and `duration` from those env vars; the default scenario (50 VUs × 60s) must be sufficient to push `LLEN orders:queue` above 50 within ~30s with a single order-processor replica at `PROCESS_DELAY_MS=500`; each VU runs `POST /checkout` in a tight loop with a minimal sleep (e.g., 100ms) between iterations; validate that the response status is `202`

---

### [ ] 4.0 Bootcamp Docs Page

Create `docs/9-kubernetes-container-orchestration/9.6-keda.md` with valid front-matter, introduction, six exercise sections, and deliverables. Update `_sidebar.md` and `9.5-hpas.md`. Renumbering existing `9.6+` pages is out of scope per Resolved Decision #3.

#### 4.0 Proof Artifact(s)

- CLI: `npm run refresh-front-matter` exits 0 demonstrates front-matter metadata is valid and consolidated into the master record
- CLI: `npm run lint` exits 0 demonstrates markdown passes style linting
- Diff: `docs/_sidebar.md` contains a `9.6-keda.md` entry between the `9.5-hpas.md` and `9.6-webhooks.md` lines demonstrates the page is wired into site navigation
- Diff: `docs/9-kubernetes-container-orchestration/9.5-hpas.md` contains a forward-reference link to `9.6-keda.md` demonstrates cross-page continuity

#### 4.0 Tasks

- [ ] 4.1 Read `docs/README.md` to check which technologies are already in the master record; `KEDA`, `Redis`, and `k6` are likely absent — note which are missing so they can be added in the front-matter of the new page (the `refresh-front-matter` script will merge them into `README.md`)
- [ ] 4.2 Create `docs/9-kubernetes-container-orchestration/9.6-keda.md` with YAML front-matter following the exact key structure from `9.5-hpas.md` (key is the file path `docs/9-kubernetes-container-orchestration/9.6-keda.md:`); set `category: Container Orchestration`, `estReadingMinutes: 20`; define six `exercises` entries — one per exercise — each with `name`, `description`, `estMinutes`, and `technologies` (use `Docker`, `Kubernetes`, `KEDA`, `Redis`, `k6` as appropriate; reuse existing values where they match)
- [ ] 4.3 Write the `# 9.6 KEDA` H1 heading and a 2–3 paragraph introduction covering: what KEDA is (event-driven autoscaler for Kubernetes), why queue depth is a better scaling signal than CPU for bursty workloads, and how KEDA differs from the HPA covered in 9.5 (reactive vs. proactive); reference `examples/ch9/keda/` as the companion directory
- [ ] 4.4 Write `## Exercise 1 — Deploy the System` (H2): numbered steps to run `task deps:check`, `task cluster:create`, `task images:build`, `task images:load`, `task deploy:all`; verify with `kubectl get pods -n keda-demo`; observation prompt: all three pods should reach `Running` before continuing
- [ ] 4.5 Write `## Exercise 2 — Observe the Failure` (H2): steps to open a second terminal and run `task observe`, then `task load:run` in the first terminal; observation prompt: watch `LLEN orders:queue` climb while pod count stays at `1`, illustrating the baseline failure mode with no autoscaling
- [ ] 4.6 Write `## Exercise 3 — Add a CPU HPA` (H2): steps to apply `k8s/base/hpa.yaml` with `kubectl apply -f`, re-run the load test, and observe via `task observe`; observation prompt: pod count eventually increases but queue still spikes before scale-out, demonstrating HPA lag
- [ ] 4.7 Write `## Exercise 4 — Install KEDA` (H2): steps to (1) delete the manually applied HPA (`kubectl delete -f k8s/base/hpa.yaml`) — explain why this is required before KEDA to avoid two HPAs targeting the same Deployment; (2) install KEDA via Helm, pinning version `2.16`: `helm repo add kedacore https://kedacore.github.io/charts && helm repo update && helm install keda kedacore/keda --namespace keda --create-namespace --version 2.16.0`; verify with `kubectl get pods -n keda`
- [ ] 4.8 Write `## Exercise 5 — Write the ScaledObject` (H2): describe every required field a valid `ScaledObject` must have for this setup — `apiVersion: keda.sh/v1alpha1`, `kind: ScaledObject`, `metadata.name`, `metadata.namespace`, `spec.scaleTargetRef.name` (target Deployment), `spec.minReplicaCount`, `spec.maxReplicaCount`, and one trigger of type `redis` with `metadata.listName: orders:queue`, `metadata.listLength` (threshold per replica), and `authenticationRef.name: redis-trigger-auth` — direct students to the KEDA docs for the `redis` scaler without providing the YAML; instruct students to apply their ScaledObject with `kubectl apply -f` and verify with `kubectl get scaledobject -n keda-demo`; the `READY` column must show `True`
- [ ] 4.9 Write `## Exercise 6 — KEDA in Action` (H2): steps to re-run `task load:run` while `task observe` is running; observation prompt: queue depth should stay below the ScaledObject threshold (e.g., ≤ 10–20) while pod count grows; instruct students to compare queue depth peaks across Exercises 2, 3, and 6 to make the KEDA advantage visible
- [ ] 4.10 Write `### Deliverables` (H3) under Exercise 6 with these three reflection questions: (1) "What was the peak queue depth during Exercise 2 (no autoscaling) vs. Exercise 6 (KEDA)? What does this difference tell you about reactive vs. proactive scaling signals?"; (2) "Why must the CPU HPA be deleted before applying the KEDA ScaledObject?"; (3) "What would you change about the ScaledObject configuration if order processing time increased to 2 seconds per message? Explain your reasoning."
- [ ] 4.11 Add a forward-reference note at the bottom of `docs/9-kubernetes-container-orchestration/9.5-hpas.md`: a short paragraph or blockquote noting that the next section (`9.6-keda.md`) extends HPA concepts with KEDA's event-driven autoscaling and provides a link
- [ ] 4.12 Edit `docs/_sidebar.md`: add `- [9.6 - KEDA](9-kubernetes-container-orchestration/9.6-keda.md)` on a new line immediately after the `9.5-hpas.md` entry and before the existing `9.6-webhooks.md` entry; leave a comment or note in the task that the duplicate `9.6` prefix is a known temporary state pending the author's manual renumbering
- [ ] 4.13 Run `npm run refresh-front-matter` from the repo root; fix any validation errors; then run `npm run lint` and fix any markdown style violations (common issues: trailing spaces, blank lines around headings, fenced code block languages)
