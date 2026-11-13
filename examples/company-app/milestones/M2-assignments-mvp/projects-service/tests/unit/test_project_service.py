import uuid
from datetime import UTC, date, datetime

import pytest

from app.errors import ConflictError, NotFoundError, ValidationFailedError
from app.schemas import ProjectStatus, ProjectWrite
from app.services.project_service import ProjectService
from app.services.seed import seed_projects
from tests.fakes import FakeFlags, FakeProjectRepository

FIXED_NOW = datetime(2026, 11, 13, 9, 30, tzinfo=UTC)
PLATFORM_ID = uuid.UUID("aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa")


def make_service(
    repository: FakeProjectRepository | None = None, description_required: bool = False
) -> tuple[ProjectService, FakeProjectRepository]:
    repository = repository or FakeProjectRepository(seed_projects())
    service = ProjectService(repository, FakeFlags(description_required), clock=lambda: FIXED_NOW)
    return service, repository


def write(**overrides) -> ProjectWrite:
    data = {"name": "Mobile App", "startDate": "2026-04-01", "status": "planned"}
    data.update(overrides)
    return ProjectWrite.model_validate(data)


def test_list_returns_projects_sorted_by_name():
    service, _ = make_service()

    names = [p.name for p in service.list_projects()]

    assert names == ["Customer Portal", "Data Warehouse", "Platform Modernization"]


def test_list_filters_by_status():
    service, _ = make_service()

    names = [p.name for p in service.list_projects(ProjectStatus.ACTIVE)]

    assert names == ["Platform Modernization"]


def test_get_unknown_id_raises_not_found():
    service, _ = make_service()

    with pytest.raises(NotFoundError):
        service.get_project(uuid.uuid4())


def test_create_assigns_id_and_timestamps():
    service, repository = make_service()

    project = service.create_project(write(description="Field app"))

    assert project.id in repository.projects
    assert project.created_at == project.updated_at == FIXED_NOW
    assert project.start_date == date(2026, 4, 1)
    assert project.status == "planned"


def test_create_duplicate_name_ignores_case():
    service, _ = make_service()

    with pytest.raises(ConflictError):
        service.create_project(write(name="customer PORTAL"))


def test_create_maps_database_duplicate_to_conflict():
    service, repository = make_service()
    repository.fail_next_write_with_duplicate = True

    with pytest.raises(ConflictError):
        service.create_project(write())


def test_description_optional_when_flag_off():
    service, _ = make_service(description_required=False)

    assert service.create_project(write(description="")).description == ""


def test_description_required_when_flag_on():
    service, _ = make_service(description_required=True)

    with pytest.raises(ValidationFailedError) as excinfo:
        service.create_project(write(description=""))

    assert "description" in excinfo.value.errors


def test_description_flag_accepts_a_description():
    service, _ = make_service(description_required=True)

    assert service.create_project(write(description="Has one")).description == "Has one"


def test_update_replaces_fields_and_touches_updated_at():
    service, _ = make_service()

    project = service.update_project(
        PLATFORM_ID, write(name="Platform 2.0", status="completed", description="")
    )

    assert project.name == "Platform 2.0"
    assert project.status == ProjectStatus.COMPLETED
    assert project.description == ""
    assert project.updated_at == FIXED_NOW
    assert project.created_at != FIXED_NOW


def test_update_can_keep_its_own_name():
    service, _ = make_service()

    project = service.update_project(PLATFORM_ID, write(name="platform modernization"))

    assert project.name == "platform modernization"


def test_update_maps_database_duplicate_to_conflict():
    service, repository = make_service()
    repository.fail_next_write_with_duplicate = True

    with pytest.raises(ConflictError):
        service.update_project(PLATFORM_ID, write())


def test_update_unknown_id_raises_not_found():
    service, _ = make_service()

    with pytest.raises(NotFoundError):
        service.update_project(uuid.uuid4(), write())


def test_delete_removes_project():
    service, repository = make_service()

    service.delete_project(PLATFORM_ID)

    assert PLATFORM_ID not in repository.projects


def test_delete_unknown_id_raises_not_found():
    service, _ = make_service()

    with pytest.raises(NotFoundError):
        service.delete_project(uuid.uuid4())
