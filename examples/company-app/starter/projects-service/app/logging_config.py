"""Structured JSON logs on stdout, each line carrying the current trace and span IDs."""

import logging
import sys

from opentelemetry import trace
from pythonjsonlogger.json import JsonFormatter


class TraceContextFilter(logging.Filter):
    """Adds trace_id / span_id from the active OpenTelemetry span (empty when there is none)."""

    def filter(self, record: logging.LogRecord) -> bool:
        ctx = trace.get_current_span().get_span_context()
        record.trace_id = format(ctx.trace_id, "032x") if ctx.is_valid else ""
        record.span_id = format(ctx.span_id, "016x") if ctx.is_valid else ""
        # Uvicorn adds an ANSI-coloured copy of the message; it is noise in JSON.
        record.__dict__.pop("color_message", None)
        return True


def configure_logging(level: str = "INFO") -> None:
    handler = logging.StreamHandler(sys.stdout)
    handler.addFilter(TraceContextFilter())
    handler.setFormatter(
        JsonFormatter(
            "%(asctime)s %(levelname)s %(name)s %(message)s %(trace_id)s %(span_id)s",
            rename_fields={"asctime": "timestamp", "levelname": "level", "name": "logger"},
            datefmt="%Y-%m-%dT%H:%M:%S%z",
        )
    )
    root = logging.getLogger()
    # Add our handler without removing others: `opentelemetry-instrument` has
    # already attached the handler that ships logs over OTLP.
    root.handlers = [h for h in root.handlers if type(h) is not logging.StreamHandler]
    root.addHandler(handler)
    root.setLevel(level.upper())
    # Uvicorn's loggers propagate to the root logger (we start it with log_config=None).
    for name in ("uvicorn", "uvicorn.error", "uvicorn.access"):
        logging.getLogger(name).handlers = []
        logging.getLogger(name).propagate = True
    # Alembic announces every plugin it loads at INFO.
    logging.getLogger("alembic.runtime.plugins").setLevel(logging.WARNING)
