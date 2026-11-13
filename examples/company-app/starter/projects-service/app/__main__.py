"""Entry point: `python -m app` (wrapped by `opentelemetry-instrument` in the container).

One process, one worker, no --reload. The OpenTelemetry auto-instrumentation
patches libraries in the process it starts; uvicorn's reloader and worker
processes are forked children that would run without that setup (or break
the exporters), so telemetry silently goes missing.
"""

import uvicorn

from app.config import get_settings
from app.logging_config import configure_logging


def main() -> None:
    settings = get_settings()
    configure_logging(settings.log_level)
    from app.main import app  # import after logging is set up

    # log_config=None keeps uvicorn from replacing our JSON logging.
    uvicorn.run(app, host="0.0.0.0", port=settings.port, log_config=None)


if __name__ == "__main__":
    main()
