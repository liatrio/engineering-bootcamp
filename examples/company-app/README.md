# Company App (bootcamp reference code)

The Company app is the application apprentices build on throughout [Chapter 3: Application Development](https://liatrio.github.io/engineering-bootcamp/#/3-application-development/3.0-overview) and later chapters.

| Path | What it is |
| --- | --- |
| [`starter/`](starter/) | The complete starter app. Teams copy this into their own repository at the start of Chapter 3.2. |
| [`milestones/`](milestones/) | Reference code for the end of each section, applied on top of the starter. |
| [`SPEC.md`](SPEC.md) | The contract every service follows: APIs, events, ports, configuration, seed data, and the deliberate gaps that the exercises close. |
| [`MILESTONES.md`](MILESTONES.md) | What each milestone contains and how milestones are built. |

## Milestones

| Milestone | End of section | Adds |
| --- | --- | --- |
| [M1-design](milestones/M1-design/) | 3.2 Application Architecture | The team's `AGENTS.md` and the Assignments design |
| [M2-assignments-mvp](milestones/M2-assignments-mvp/) | 3.3 Building a Service | A working `assignments-service` |
| [M3-tested](milestones/M3-tested/) | 3.4.1–3.4.7 | Unit, component, integration, contract, and end-to-end tests |
| [M4-quality-automation](milestones/M4-quality-automation/) | 3.4.8–3.4.13 | Coverage, linting, CI, pre-commit, and code review setup |
| [M5-observable](milestones/M5-observable/) | 3.5 Observability | OpenTelemetry in `assignments-service` |
| [M6-flagged](milestones/M6-flagged/) | 3.6 Feature Flags | OpenFeature and flagd in `assignments-service` |

### Catching up

If your team falls behind or breaks something, a milestone gets you back to a known-good state:

1. Replace your `assignments-service/` folder with the milestone's.
2. For every other file in the milestone, **compare** it with yours (for example with `git diff --no-index`) rather than copying it over. Your own exercise work and CI files will differ, and that's fine.

A milestone is always applied on top of the starter: `starter/` + `milestones/Mn/` is a complete repository. CI checks this for every milestone ([`company-app.yml`](../../.github/workflows/company-app.yml)).
