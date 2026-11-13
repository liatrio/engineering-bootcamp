"""Custom business metrics, on top of what zero-code instrumentation already records.

`opentelemetry-instrument` installs the global MeterProvider before the app is
imported, so `metrics.get_meter()` here exports through the same OTLP pipeline
as the automatic HTTP and database metrics. Without it (plain `uvicorn`, unit
tests) the API hands back a no-op meter and counting costs nothing.
"""

from opentelemetry import metrics
from opentelemetry.metrics import Meter

METER_NAME = "projects-service"


class ProjectMetrics:
    def __init__(self, meter: Meter | None = None) -> None:
        meter = meter or metrics.get_meter(METER_NAME)
        self._created = meter.create_counter(
            "company.projects.created",
            unit="{project}",
            description="Projects created through the API",
        )

    def project_created(self, status: str) -> None:
        # The status is a small, fixed set, so it's safe as an attribute (low cardinality).
        self._created.add(1, {"project.status": status})
