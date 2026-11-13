"""API tests against a real PostgreSQL 17 in a throwaway container (Testcontainers)."""

from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient
from testcontainers.community.postgres import PostgresContainer

from app.config import Settings
from app.main import create_app
from app.repositories.project_repository import SqlAlchemyProjectRepository
from app.services.seed import reset_to_seed
from tests.fakes import FakeFlags

pytestmark = pytest.mark.integration


@pytest.fixture(scope="session")
def database_url() -> Iterator[str]:
    with PostgresContainer("postgres:17", driver="psycopg") as postgres:
        yield postgres.get_connection_url()


@pytest.fixture(scope="session")
def flags() -> FakeFlags:
    return FakeFlags()


def build_client(database_url: str, flags: FakeFlags, **overrides) -> TestClient:
    settings = Settings(
        **{"database_url": database_url, "enable_provider_states": True, **overrides}
    )
    return TestClient(create_app(settings, flags=flags))


@pytest.fixture(scope="session")
def app_client(database_url: str, flags: FakeFlags) -> Iterator[TestClient]:
    # Entering the client runs the lifespan: migrations, then seed data.
    with build_client(database_url, flags) as client:
        yield client


@pytest.fixture
def client(app_client: TestClient, flags: FakeFlags) -> TestClient:
    """Each test starts from the seed rows with every flag off."""
    flags.description_required = False
    with app_client.app.state.session_factory() as session:
        reset_to_seed(SqlAlchemyProjectRepository(session))
    return app_client
