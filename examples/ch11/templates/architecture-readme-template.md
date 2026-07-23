# Architecture: [System or Application Name]

> Copy this template into your project's `README.md` (or a dedicated `ARCHITECTURE.md`) and fill in each section. Delete the guidance text (in blockquotes) as you go.

## Overview

> What does this application do, in 1-2 paragraphs? Write for someone who has never seen it before.

## Architecture

> What are the components (services, processes, databases) and what is each one responsible for? A table works well:

| Component | Responsibility | Technology |
|---|---|---|
| | | |

> Include or link to a component diagram here.

## Communication Patterns

> How do components talk to each other? HTTP/REST? gRPC? Message queue? Synchronous or asynchronous? Note any important conventions (auth headers, retry behavior, timeouts).

## Data Storage

> What data is stored, and where? List each datastore, what lives in it, and which component(s) own it.

## Key Decisions

> Why was it built this way? Call out 2-3 decisions that shaped the architecture and link to an ADR if one exists (see the [ADR template](adr-template.md)).

## Setup and Running

> How does someone get this running locally? Link to or restate the quickstart instructions.
