# syntax=docker/dockerfile:1

# ---- build: resolve dependencies with uv into /app/.venv ----
FROM ghcr.io/astral-sh/uv:0.12.19 AS uv
FROM python:3.13.15-slim AS build
COPY --from=uv /uv /usr/local/bin/uv
ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    UV_PYTHON_DOWNLOADS=never
WORKDIR /app
# Dependencies first, so code changes don't invalidate this layer.
COPY pyproject.toml uv.lock ./
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-dev --no-install-project

# ---- runtime: just Python, the venv, and the code ----
FROM python:3.13.15-slim AS runtime
RUN useradd --system --uid 10001 --no-create-home app
WORKDIR /app
COPY --from=build /app/.venv /app/.venv
COPY alembic.ini ./
COPY migrations ./migrations
COPY app ./app
ENV PATH="/app/.venv/bin:$PATH" \
    PYTHONUNBUFFERED=1 \
    PORT=8000 \
    OTEL_SERVICE_NAME=projects-service \
    OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf \
    OTEL_TRACES_EXPORTER=otlp \
    OTEL_METRICS_EXPORTER=otlp \
    OTEL_LOGS_EXPORTER=otlp
USER 10001
EXPOSE 8000
# Zero-code instrumentation wraps the process. One process, no --reload, no
# extra workers: see the README for why.
ENTRYPOINT ["opentelemetry-instrument", "python", "-m", "app"]
