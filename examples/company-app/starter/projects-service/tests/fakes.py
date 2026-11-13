"""Hand-written test doubles for the service layer."""

import uuid
from collections.abc import Sequence

from app.models import Project
from app.repositories.project_repository import DuplicateNameError


class FakeFlags:
    def __init__(self, description_required: bool = False) -> None:
        self.description_required = description_required

    def project_description_required(self) -> bool:
        return self.description_required


class FakeProjectRepository:
    """In-memory stand-in for SqlAlchemyProjectRepository. One per test."""

    def __init__(self, projects: Sequence[Project] = ()) -> None:
        self.projects: dict[uuid.UUID, Project] = {p.id: p for p in projects}
        # Set to simulate the database's unique index rejecting a write.
        self.fail_next_write_with_duplicate = False

    def list(self) -> Sequence[Project]:
        return sorted(self.projects.values(), key=lambda p: p.name)

    def get(self, project_id: uuid.UUID) -> Project | None:
        return self.projects.get(project_id)

    def name_taken(self, name: str, exclude_id: uuid.UUID | None = None) -> bool:
        return any(
            p.name.lower() == name.lower() and p.id != exclude_id for p in self.projects.values()
        )

    def add(self, project: Project) -> Project:
        self._maybe_fail(project)
        self.projects[project.id] = project
        return project

    def save(self, project: Project) -> Project:
        self._maybe_fail(project)
        self.projects[project.id] = project
        return project

    def delete(self, project: Project) -> None:
        del self.projects[project.id]

    def _maybe_fail(self, project: Project) -> None:
        if self.fail_next_write_with_duplicate:
            self.fail_next_write_with_duplicate = False
            raise DuplicateNameError(project.name)
