"""Business rules for projects. No HTTP and no SQL in here."""

import uuid
from collections.abc import Callable, Sequence
from datetime import UTC, datetime

from app.errors import ConflictError, NotFoundError, ValidationFailedError
from app.flags import FeatureFlags
from app.models import Project
from app.repositories.project_repository import DuplicateNameError, ProjectRepository
from app.schemas import ProjectStatus, ProjectWrite

# A project only moves forward, one step at a time: planned -> active -> completed.
# Keeping its current status is always allowed, so PUT can change other fields.
ALLOWED_TRANSITIONS: dict[ProjectStatus, set[ProjectStatus]] = {
    ProjectStatus.PLANNED: {ProjectStatus.PLANNED, ProjectStatus.ACTIVE},
    ProjectStatus.ACTIVE: {ProjectStatus.ACTIVE, ProjectStatus.COMPLETED},
    ProjectStatus.COMPLETED: {ProjectStatus.COMPLETED},
}


def utc_now() -> datetime:
    return datetime.now(UTC)


class ProjectService:
    def __init__(
        self,
        repository: ProjectRepository,
        flags: FeatureFlags,
        clock: Callable[[], datetime] = utc_now,
    ) -> None:
        self._repository = repository
        self._flags = flags
        self._clock = clock

    def list_projects(self, status: ProjectStatus | None = None) -> Sequence[Project]:
        return self._repository.list(status.value if status else None)

    def get_project(self, project_id: uuid.UUID) -> Project:
        project = self._repository.get(project_id)
        if project is None:
            raise NotFoundError(f"Project {project_id} was not found.")
        return project

    def create_project(self, data: ProjectWrite) -> Project:
        if self._flags.project_description_required() and not data.description:
            raise ValidationFailedError({"description": ["A description is required."]})
        if self._repository.name_taken(data.name):
            raise _duplicate_name(data.name)

        now = self._clock()
        project = Project(
            id=uuid.uuid4(),
            name=data.name,
            description=data.description,
            start_date=data.start_date,
            status=data.status.value,
            created_at=now,
            updated_at=now,
        )
        try:
            return self._repository.add(project)
        except DuplicateNameError:
            raise _duplicate_name(data.name) from None

    def update_project(self, project_id: uuid.UUID, data: ProjectWrite) -> Project:
        project = self.get_project(project_id)
        current = ProjectStatus(project.status)
        if data.status not in ALLOWED_TRANSITIONS[current]:
            raise ConflictError(
                f"A project's status can't change from {current} to {data.status}. "
                "It moves planned -> active -> completed, one step at a time."
            )
        if self._repository.name_taken(data.name, exclude_id=project_id):
            raise _duplicate_name(data.name)

        project.name = data.name
        project.description = data.description
        project.start_date = data.start_date
        project.status = data.status.value
        project.updated_at = self._clock()
        try:
            return self._repository.save(project)
        except DuplicateNameError:
            raise _duplicate_name(data.name) from None

    def delete_project(self, project_id: uuid.UUID) -> None:
        project = self.get_project(project_id)
        self._repository.delete(project)


def _duplicate_name(name: str) -> ConflictError:
    return ConflictError(f"A project named '{name}' already exists.")
