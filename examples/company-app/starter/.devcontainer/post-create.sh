#!/usr/bin/env bash
# Restore every service's dependencies once, so the first build is fast.
set -euo pipefail
# uv manages the Python service's dependencies.
pipx install uv
(cd employees-service && dotnet restore)
[ -d assignments-service ] && (cd assignments-service && dotnet restore) || true
(cd projects-service && uv sync)
(cd notifications-service && go mod download)
(cd web && npm ci && npx playwright install --with-deps chromium)
