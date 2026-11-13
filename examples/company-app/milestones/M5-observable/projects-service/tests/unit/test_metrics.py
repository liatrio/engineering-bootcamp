import pytest
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.sdk.metrics.export import InMemoryMetricReader

from app.errors import ConflictError
from app.schemas import ProjectWrite
from app.services.project_service import ProjectService
from app.services.seed import seed_projects
from app.telemetry import ProjectMetrics
from tests.fakes import FakeFlags, FakeProjectRepository


def make_service() -> tuple[ProjectService, InMemoryMetricReader]:
    # A private MeterProvider with an in-memory reader: no global state, no exporter.
    reader = InMemoryMetricReader()
    meter = MeterProvider(metric_readers=[reader]).get_meter("test")
    service = ProjectService(
        FakeProjectRepository(seed_projects()), FakeFlags(), metrics=ProjectMetrics(meter)
    )
    return service, reader


def created_points(reader: InMemoryMetricReader) -> list:
    data = reader.get_metrics_data()
    if data is None:
        return []
    return [
        point
        for resource_metrics in data.resource_metrics
        for scope_metrics in resource_metrics.scope_metrics
        for metric in scope_metrics.metrics
        if metric.name == "company.projects.created"
        for point in metric.data.data_points
    ]


def write(name: str, status: str = "planned") -> ProjectWrite:
    return ProjectWrite.model_validate({"name": name, "startDate": "2026-04-01", "status": status})


def test_creating_a_project_increments_the_counter():
    service, reader = make_service()

    service.create_project(write("Mobile App"))
    service.create_project(write("Billing", status="active"))
    service.create_project(write("Search"))

    counts = {p.attributes["project.status"]: p.value for p in created_points(reader)}
    assert counts == {"planned": 2, "active": 1}


def test_a_failed_create_is_not_counted():
    service, reader = make_service()

    with pytest.raises(ConflictError):
        service.create_project(write("Customer Portal"))  # duplicate of a seed project

    assert created_points(reader) == []
