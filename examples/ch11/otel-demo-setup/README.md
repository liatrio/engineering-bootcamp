# OTel Demo Setup Guide

This guide gets the [OpenTelemetry Demo Application](https://github.com/open-telemetry/opentelemetry-demo) ("Astronomy Shop") running locally so you can complete Exercise 2 (Transaction Tracing) and Exercise 4 (Integration Exercise) in [Chapter 11.3](/docs/11-application-development/11.3-system-thinking.md).

## What It Is

The OTel Demo is a realistic e-commerce microservices application — an online astronomy shop — built by the OpenTelemetry project specifically to demonstrate distributed tracing, metrics, and logs across services written in more than a dozen languages (Go, Java, .NET, Python, Node.js, Rust, PHP, and more). Unlike the [simple-system](/examples/ch11/simple-system) app from Exercise 1, it has real service-to-service communication (HTTP and gRPC), a message queue, multiple datastores, and a working Jaeger UI for viewing traces — making it a good target for practicing transaction tracing on something closer to a production system.

We're using it here instead of building a custom multi-service app because reproducing this much realistic complexity from scratch wouldn't be a good use of bootcamp time, and because it's already fully instrumented with OpenTelemetry, which you'll build on again in Chapter 11.7 (Debugging & Observability).

## Pinned Version

This guide is written against **release `2.1.3`** (published 2025-09-26) of the [opentelemetry-demo repository](https://github.com/open-telemetry/opentelemetry-demo). Pinning avoids surprises from upstream changes — later releases (starting with `2.2.0`) add an optional Product Review service that calls the OpenAI API and can incur real cost, which we're intentionally avoiding here since no bootcamp exercise should require a paid API key.

## System Requirements

- **RAM:** 6 GB free for the full application, or ~3 GB in minimal mode (see [Reducing Resource Usage](#reducing-resource-usage) below)
- **Disk:** 14 GB free (container images plus build layers)
- **CPU:** no hard minimum documented upstream, but expect the full stack (~26 containers) to be noticeably heavier than the 2-container simple-system app from Exercise 1
- **Docker Compose:** v2.0.0 or newer (check with `docker compose version`)
- **Docker/OrbStack:** must be running before any of the commands below

## Setup Instructions

1. **Clone the pinned release** (not `main`, so your setup matches this guide):

   ```bash
   git clone --branch 2.1.3 --depth 1 https://github.com/open-telemetry/opentelemetry-demo.git
   cd opentelemetry-demo
   ```

   Then pin the **runtime images** to the same release too — cloning the `2.1.3` tag only pins the source checkout. The shipped `.env` separately sets `DEMO_VERSION=latest`, which is what every service's `image:` tag is actually built from (`${IMAGE_NAME}:${DEMO_VERSION}-<service>`), so `docker compose up` pulls the unpinned, continuously-moving `latest-*` tags regardless of which git tag you checked out. `latest` tracks upstream `main` and can be broken at any given moment — during validation of this guide, `latest-product-catalog` crashed on start (exited immediately, no log output) while `2.1.3-product-catalog` ran fine. Pin it before starting:

   ```bash
   echo "DEMO_VERSION=2.1.3" >> .env
   ```

2. **Start the full application:**

   ```bash
   docker compose up --force-recreate --remove-orphans --detach
   ```

   This pulls prebuilt images from `ghcr.io/open-telemetry/demo` for all ~26 services on first run — expect it to take several minutes depending on your connection.

3. **Verify the services are healthy:**

   ```bash
   docker compose ps
   ```

   Look for all services in a `running` (or `healthy`, where a healthcheck is defined) state. A few restarts during the first 30-60 seconds while services wait on their dependencies (e.g., Kafka) are normal.

   If the very first `up` prints `Error dependency opensearch failed to start` and exits, opensearch just hadn't finished its health check the instant Compose checked it — it typically becomes healthy a few seconds later. Simply re-run the same `docker compose up --force-recreate --remove-orphans --detach` command; it resumes and starts the remaining containers rather than starting over.

4. **Open the storefront** at <http://localhost:8080/>. You should see the astronomy shop homepage with a product grid. From the same base URL, everything else is reachable behind the frontend proxy:

   | UI | Path |
   |---|---|
   | Web store | `/` |
   | Jaeger (trace explorer) | `/jaeger/ui/` |
   | Grafana (metrics dashboards) | `/grafana/` |
   | Load generator | `/loadgen/` |
   | Feature flag UI (flagd) | `/feature` |

   The base port is configurable — set `ENVOY_PORT=8081` (or any free port) before `docker compose up` if 8080 is already taken on your machine.

5. **Generate some traffic** by clicking through the store yourself (add a product to cart, proceed toward checkout), or let the built-in load generator run in the background — it's started automatically and continuously exercises the storefront, which is useful for Exercise 2 since you'll have traces to inspect in Jaeger without manually reproducing every flow.

6. **Tear down** when you're done:

   ```bash
   docker compose down --volumes
   ```

## Reducing Resource Usage

If 6 GB of RAM for the full stack is more than your machine can spare, the repository ships a **minimal mode** that excludes the `accounting`, `fraud-detection`, `kafka`, and `postgresql` services (the async fraud-detection/accounting pipeline isn't needed for the exercises in this chapter):

```bash
docker compose -f docker-compose.minimal.yml up --force-recreate --remove-orphans --detach
```

This drops resource usage to roughly 3 GB of RAM. Everything in the setup and verification steps above still applies — only the compose file changes.

For an even smaller footprint scoped to exactly the "Add to Cart" worked example in this chapter, see the optional [`docker-compose-subset.yml`](docker-compose-subset.yml) in this directory.

## Troubleshooting

**Services stuck restarting / never become healthy.** Check logs for the specific service: `docker compose logs -f <service-name>`. Most commonly this is Kafka (in full mode) taking longer than its dependents expect on first boot — give it another minute and re-check `docker compose ps`.

**Port already in use.** The frontend proxy binds `${ENVOY_PORT}` (default `8080`) and `${ENVOY_ADMIN_PORT}` (default `8081`) on the host. If either is taken by something else on your machine, set `ENVOY_PORT=<free-port>` (and/or `ENVOY_ADMIN_PORT`) as an environment variable before running `docker compose up`.

**Insufficient RAM / Docker Desktop OOM-killing containers.** Increase Docker's memory allocation (Docker Desktop/OrbStack → Settings → Resources) to at least 6 GB (3 GB if using minimal mode), or switch to minimal mode above.

**ARM compatibility (Apple Silicon: M1/M2/M3/M4).** All services in this release publish multi-arch images, so `docker compose up` works out of the box on ARM — but some JIT-heavy services have hit a known issue on Apple Silicon related to SVE (Scalable Vector Extension) support. The repository ships a workaround as `.env.arm64`, which disables the problematic JIT optimization. Pass it **in addition to** `.env`, not instead of it — `--env-file` replaces Compose's implicit `.env` load rather than merging with it, and `.env.arm64` alone is missing required variables (`HOST_FILESYSTEM`, `DOCKER_SOCK`, etc.), which fails immediately with `invalid spec: :/hostfs:ro: empty section between colons`:

```bash
docker compose --env-file .env --env-file .env.arm64 up --force-recreate --remove-orphans --detach
```

Use this on Apple Silicon if you see Java services crash-looping in `docker compose ps`.

**Slow first `docker compose up`.** This is expected — the first run pulls ~26 images from `ghcr.io`. Subsequent runs reuse cached layers and start in seconds.

**Local ARM validation: done (2026-07-23, Apple M5 Max, macOS 26.6, OrbStack, Docker 29.4.0 / Compose v5.1.2, 64 GB host RAM, no fixed memory limit).** Following the setup steps above (including `DEMO_VERSION=2.1.3` and the merged `--env-file .env --env-file .env.arm64`), all 26 containers reached a stable `running`/`healthy` state with no further restarts, and the storefront, Jaeger, Grafana, load generator, and feature-flag UI all returned HTTP 200 through `http://localhost:8080`. Container creation/start itself took under a minute once images were cached; the ~3 GB of unique images is the dominant cost on a cold pull. Steady-state RAM across all 26 containers was **~3.5 GB** shortly after startup (heaviest: opensearch ~790 MB, load-generator ~610 MB, kafka ~505 MB) — comfortably under the documented 6 GB budget. Two ARM/OrbStack-specific issues turned up beyond the `.env.arm64` SVE workaround, both now folded into the steps above:

- The `DEMO_VERSION=2.1.3` pin (see step 1) was the fix for `product-catalog` — without it, `latest-product-catalog` (upstream's moving `main` tag) crashed on start with no log output during this validation run.
- `otel-collector` crash-looped with `client version 1.25 is too old. Minimum supported API version is 1.40` from its `docker_stats` receiver. This is an OrbStack-specific Docker API version-negotiation issue, not a SVE/ARM CPU problem — OrbStack's daemon enforces `MinAPIVersion 1.40`, and the receiver's default client falls back to 1.25. Fix by adding `api_version: "1.41"` to the `docker_stats` receiver in the cloned repo's `src/otel-collector/otelcol-config.yml`:

  ```yaml
  receivers:
    docker_stats:
      endpoint: unix:///var/run/docker.sock
      api_version: "1.41"
  ```

  Then `docker compose up -d --force-recreate otel-collector` to pick it up. If you're on Docker Desktop rather than OrbStack, you likely won't hit this at all.

## Next Steps

Once the application is running and you can browse the storefront, continue to [Exercise 2: Transaction Tracing in OTel Demo](/docs/11-application-development/11.3-system-thinking.md#exercise-2-transaction-tracing-in-otel-demo).
