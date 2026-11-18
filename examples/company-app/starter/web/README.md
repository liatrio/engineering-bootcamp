# web

The Company app's UI: a React + TypeScript single-page app for employees, projects,
assignments, and notifications. In compose it is served by nginx behind the
`frontend-proxy`, which also routes `/api/*` to the services and `/otlp/*` to otel-lgtm.
The contract for every API it calls is in [`../../SPEC.md`](../../SPEC.md).

## Run it

Start the rest of the app first, from `examples/company-app`:

```sh
docker compose up -d
```

Then either use the built UI at <http://localhost:8080>, or run the dev server for hot reload:

```sh
npm ci
npm run dev          # http://localhost:5173
```

The dev server proxies `/api` and `/otlp` to `http://localhost:8080` (the compose
frontend-proxy), so the browser talks to one origin just as it does in production. Point
it elsewhere with `API_PROXY_TARGET` (see `.env.example`). If nothing answers there, the
dev proxy returns 502, the same as the real proxy.

The **Assignments** page says _"The Assignments service isn't running yet"_ until you
build `assignments-service` in Chapter 3.3. It needs no changes once the service is up.

## Checks

| Command             | What it runs                                                                       |
| ------------------- | ---------------------------------------------------------------------------------- |
| `npm run lint`      | ESLint (flat config, typescript-eslint strict, React hooks) and Prettier `--check` |
| `npm run typecheck` | `tsc -b` over the app, config, and E2E code (strict)                               |
| `npm test`          | Vitest component tests, then the Pact consumer tests                               |
| `npm run build`     | Type-check and Vite production build into `dist/`                                  |
| `npm run test:e2e`  | Playwright, against a running app                                                  |

### Component tests

Vitest + React Testing Library + [MSW](https://mswjs.io). Each feature has a
`*Page.test.tsx` that renders the real route table with `renderWithProviders(path)`
(`src/test/renderWithProviders.tsx`) and answers API calls with MSW handlers. Fixtures use
the seed rows from SPEC.md.

### Pact consumer tests

`src/features/projects/api.pact.test.ts` runs the real `listProjects` and `getProject`
functions against a Pact mock server and writes `pacts/web-projects-service.json`
(consumer `web`, provider `projects-service`, provider state `projects exist`). The file is
committed: `projects-service` verifies it in its own test suite. Each run deletes and
rewrites it, so commit the regenerated file whenever you change an interaction.

### End-to-end tests

```sh
npx playwright install chromium     # once
BASE_URL=http://localhost:8080 npm run test:e2e
```

`e2e/` drives the real UI through the proxy to the services and database. `BASE_URL`
defaults to `http://localhost:8080`. `npx playwright test --list` works without the app.

## Telemetry

`src/lib/telemetry.ts` starts browser tracing once, before React renders. The fetch
instrumentation creates a client span for every `/api/*` call and adds a W3C `traceparent`
header, so a trace starts in the browser and continues through each service. Spans are
exported over OTLP/HTTP to `/otlp/v1/traces` on the same origin with `service.name=web`.
Set `VITE_OTEL_ENABLED=false` at build time to turn it off.

## Container

```sh
docker build -t company-web .
docker run --rm -p 8081:8080 company-web
```

A multi-stage build: Node builds `dist/`, then `nginxinc/nginx-unprivileged` serves it as a
non-root user on port 8080. Unknown paths fall back to `index.html` so deep links work.
There is no `HEALTHCHECK`; compose defines health checks.

## Layout

```text
src/
├── main.tsx                 entry: start telemetry, render <App/>
├── index.css                the whole stylesheet (no UI library)
├── app/                     composition
│   ├── App.tsx              router + providers
│   ├── router.tsx           the one route table; each feature adds its routes with a spread
│   ├── providers.tsx        TanStack Query client and its retry policy
│   ├── RootLayout.tsx       header, nav, <main>
│   └── RouteError.tsx       one error screen for every route
├── lib/                     foundation every feature uses
│   ├── api.ts               api(): relative /api paths, Problem Details → ApiError
│   ├── telemetry.ts         browser tracing
│   └── ui/                  labelled form fields, FormError, server-error mapping, status views
├── features/                one folder per vertical slice
│   ├── employees/           api.ts, types.ts, pages, routes.tsx, component test
│   ├── projects/            … plus api.pact.test.ts
│   ├── assignments/         … plus the "service isn't running yet" state
│   └── notifications/       polls every 5 s
└── test/                    renderWithProviders, MSW server, seed fixtures, Pact setup
e2e/                         Playwright specs
pacts/                       generated consumer contract (committed)
```

A feature folder owns its calls (`api.ts`: one line per endpoint plus TanStack Query
hooks), its types, its screens (react-hook-form + zod), and its routes. Forms show zod
errors immediately and copy Problem Details `errors` from a 400 onto the matching fields;
other failures (409, 500) appear as a form-level message.

## Versions

Pinned exactly in `package.json`. Key ones: Node 24 (image `node:24.22.3-alpine`), React
19.3.1, TypeScript 6.0.3, Vite 8.3.8, React Router 8.5.1, TanStack Query 5.107.1,
react-hook-form 7.92.0, zod 4.6.7, Vitest 5.1.0, MSW 3.0.5, `@pact-foundation/pact` 17.1.4,
Playwright 1.65.0, ESLint 10.14.0, typescript-eslint 8.72.2, OpenTelemetry JS
(`@opentelemetry/sdk-trace` 3.1.1, `instrumentation-fetch` and `exporter-trace-otlp-http`
0.301.2), nginx 1.29.8 (`nginxinc/nginx-unprivileged:1.29.8-alpine`).

TypeScript is held at 6.0.x because typescript-eslint 8 supports `<6.1`.
`@opentelemetry/sdk-trace-web` is deprecated in favor of `@opentelemetry/sdk-trace`, whose
`TracerProvider` covers the browser.
