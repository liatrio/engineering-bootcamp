"""Data access for projects. The service layer only sees the `ProjectRepository` protocol."""

import uuid
from collections.abc import Sequence
from typing import Protocol

from sqlalchemy import delete, func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models import Project


class DuplicateNameError(Exception):
    """The database rejected a second project with the same (case-insensitive) name."""


class ProjectRepository(Protocol):
    def list(self) -> Sequence[Project]: ...
    def get(self, project_id: uuid.UUID) -> Project | None: ...
    def name_taken(self, name: str, exclude_id: uuid.UUID | None = None) -> bool: ...
    def add(self, project: Project) -> Project: ...
    def save(self, project: Project) -> Project: ...
    def delete(self, project: Project) -> None: ...


class SqlAlchemyProjectRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    def list(self) -> Sequence[Project]:
        return self._session.scalars(select(Project).order_by(Project.name)).all()

    def get(self, project_id: uuid.UUID) -> Project | None:
        return self._session.get(Project, project_id)

    def name_taken(self, name: str, exclude_id: uuid.UUID | None = None) -> bool:
        query = select(Project.id).where(func.lower(Project.name) == name.lower())
        if exclude_id is not None:
            query = query.where(Project.id != exclude_id)
        return self._session.scalar(query.limit(1)) is not None

    def add(self, project: Project) -> Project:
        self._session.add(project)
        return self.save(project)

    def save(self, project: Project) -> Project:
        try:
            self._session.commit()
        except IntegrityError as exc:
            # The unique index catches the race the name_taken() check can't.
            self._session.rollback()
            raise DuplicateNameError(project.name) from exc
        return project

    def delete(self, project: Project) -> None:
        self._session.delete(project)
        self._session.commit()

    def replace_all(self, projects: Sequence[Project]) -> None:
        """Delete every row and insert `projects`. Used by seeding and Pact provider states."""
        self._session.execute(delete(Project))
        self._session.add_all(projects)
        self._session.commit()

    def count(self) -> int:
        return self._session.scalar(select(func.count()).select_from(Project)) or 0
