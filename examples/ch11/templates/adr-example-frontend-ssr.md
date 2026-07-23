# ADR 2: Server-Side Render the Storefront Frontend

> Example ADR written by analyzing the OpenTelemetry Demo Application. This is a worked example showing the level of detail expected in Exercise 3 — not an official OTel Demo document.

## Status

Accepted

## Context

The frontend is the demo's storefront: a product catalog, product detail pages, and a checkout flow — the kind of application a real e-commerce team would want to load fast and be crawlable by search engines. It also needs to aggregate data from several backend gRPC services (product catalog, currency, recommendations, ads) before it can render a single page, and it needs to demonstrate distributed tracing across a "browser to backend" boundary, not just service-to-service.

## Decision

Build the frontend with Next.js, using server-side rendering (SSR): each page request is rendered on the frontend's own server (calling the necessary backend gRPC services during that render), and HTML is sent to the browser rather than shipping a client-side app shell that fetches data after load.

## Consequences

**Positive:**

- First page load is fast and produces immediately-crawlable, fully-formed HTML — good for both real-world SEO and for the demo's own usability.
- Backend gRPC calls happen server-side, colocated with the other backend services, avoiding the need to expose every internal gRPC service directly to untrusted browser traffic.
- SSR naturally produces a clean "frontend server as an orchestrator" hop that's easy to instrument and trace — the frontend's server-side request handler is a single place where multiple backend calls fan out, which is pedagogically useful for a tracing demo.

**Negative:**

- The frontend server becomes a synchronous aggregation point: if one backend call it depends on is slow, the whole page render is slow (there's no independent client-side loading state per section unless explicitly built).
- Running a Node.js SSR server is an additional operational component compared to serving a static single-page app from a CDN — it needs its own scaling, health checks, and monitoring.
- Local development requires running the frontend's own server (not just a static file server), adding a small amount of setup overhead.

## Alternatives Considered

- **Client-side rendered SPA (e.g. plain React + client-side data fetching):** simpler infrastructure (static hosting), but loses SEO benefits and pushes multiple parallel API calls to the browser, which is less representative of how many real storefronts are built and less useful for demonstrating a clean server-side trace.
- **Static site generation (SSG):** would be fast, but product/cart data is inherently dynamic and per-user, so full static generation doesn't fit this use case.

## References

- [Next.js Server-Side Rendering documentation](https://nextjs.org/docs)
