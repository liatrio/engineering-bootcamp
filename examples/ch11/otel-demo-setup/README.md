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

**ARM compatibility (Apple Silicon: M1/M2/M3/M4).** All services in this release publish multi-arch images, so `docker compose up` works out of the box on ARM — but the Java-based `otel-collector` build and some JIT-heavy services have hit a known issue on Apple Silicon related to SVE (Scalable Vector Extension) support. The repository ships a workaround as `.env.arm64`, which disables the problematic JIT optimization:

```bash
docker compose --env-file .env.arm64 up --force-recreate --remove-orphans --detach
```

Use this env file on Apple Silicon if you see Java services crash-looping in `docker compose ps`.

**Slow first `docker compose up`.** This is expected — the first run pulls ~26 images from `ghcr.io`. Subsequent runs reuse cached layers and start in seconds.

**"Local ARM validation: pending."** This guide's ARM instructions are sourced from the upstream repository's documented `.env.arm64` workaround, but have not yet been exercised end-to-end on Apple Silicon hardware in this bootcamp environment. If you hit an ARM-specific issue not covered above, please note it so this guide can be updated with a verified fix.

## Next Steps

Once the application is running and you can browse the storefront, continue to [Exercise 2: Transaction Tracing in OTel Demo](/docs/11-application-development/11.3-system-thinking.md#exercise-2-transaction-tracing-in-otel-demo).
