"""Seed data with fixed IDs (SPEC.md), so tests, Pact states, and E2E tests can rely on them."""

import uuid
from datetime import UTC, date, datetime

from app.models import Project
from app.repositories.project_repository import SqlAlchemyProjectRepository

SEED_CREATED_AT = datetime(2026, 1, 1, tzinfo=UTC)

_SEED_ROWS = [
    (
        "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        "Platform Modernization",
        "Move the legacy monolith onto the new container platform.",
        "active",
        date(2026, 1, 5),
    ),
    (
        "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
        "Customer Portal",
        "Self-service portal for customers to manage their accounts.",
        "planned",
        date(2026, 3, 2),
    ),
    (
        "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
        "Data Warehouse",
        "Central reporting warehouse fed by every service.",
        "completed",
        date(2025, 6, 16),
    ),
]


def seed_projects() -> list[Project]:
    """Fresh ORM objects for the seed rows (new objects each call, safe to add to a session)."""
    return [
        Project(
            id=uuid.UUID(project_id),
            name=name,
            description=description,
            status=status,
            start_date=start_date,
            created_at=SEED_CREATED_AT,
            updated_at=SEED_CREATED_AT,
        )
        for project_id, name, description, status, start_date in _SEED_ROWS
    ]


def seed_if_empty(repository: SqlAlchemyProjectRepository) -> bool:
    if repository.count() > 0:
        return False
    repository.replace_all(seed_projects())
    return True


def reset_to_seed(
    repository: SqlAlchemyProjectRepository, remove_ids: list[uuid.UUID] = []
) -> None:
    """Replace every project with the seed rows, then drop any IDs in `remove_ids`."""
    projects = [p for p in seed_projects() if p.id not in remove_ids]
    repository.replace_all(projects)
