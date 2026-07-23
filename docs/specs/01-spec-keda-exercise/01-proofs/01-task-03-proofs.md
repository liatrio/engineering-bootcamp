# Task 3.0 — Taskfile and k6 Load Test Script: Proof Artifacts

## CLI Output: task --list

```
$ task --list
task: Available tasks for this project:
* observe:              Watch queue depth and order-processor pod count every 2 seconds
* cluster:create:       Create the local k3d cluster
* cluster:delete:       Tear down the local k3d cluster
* deploy:all:           Apply all manifests via Kustomize (does NOT apply ScaledObject — students do that manually)
* deps:check:           Verify all required tools are installed
* images:build:         Build both service images locally
* images:load:          Import built images into the k3d cluster
* load:run:             Run k6 load test (defaults — CHECKOUT_URL=http://localhost:8080, VUS=50, DURATION=60s)
```

## CLI Output: task deps:check (missing tools detected, exits non-zero)

```
$ task deps:check
Missing: k6  →  brew install k6
Missing: watch  →  brew install watch
task: Failed to run task "deps:check": exit status 1
Exit code: 1
```

## Notes

- All 8 tasks parse and list correctly
- deps:check correctly identifies missing tools and exits non-zero
- load:run and observe verified structurally; full execution requires a running cluster (Task deploy:all)
- flash-sale.js: 50 VUs × 60s with 100ms sleep → ~500 req/s sustained, sufficient to push LLEN >> 50 with single replica at PROCESS_DELAY_MS=500
