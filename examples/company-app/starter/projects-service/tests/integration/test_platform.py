"""Health, auth, Pact provider states, and the error handler for unexpected failures."""

import pytest
from fastapi.testclient import TestClient

from app.repositories.project_repository import SqlAlchemyProjectRepository
from tests.integration.conftest import build_client

pytestmark = pytest.mark.integration

PLATFORM_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa"


def test_healthz(client):
    response = client.get("/healthz")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_readyz_when_database_is_up(client):
    assert client.get("/readyz").json() == {"status": "ok"}


def test_readyz_is_503_when_database_is_down(flags):
    client = build_client("postgresql://nobody:nothing@127.0.0.1:1/none", flags)

    # Not entering the client skips the lifespan, so no migrations are attempted.
    response = client.get("/readyz")

    assert response.status_code == 503
    assert response.headers["content-type"] == "application/problem+json"


def test_openapi_is_served(client):
    paths = client.get("/openapi.json").json()["paths"]

    assert "/api/projects/{project_id}" in paths
    assert "/_pact/provider-states" not in paths


class TestAuth:
    @pytest.fixture
    def secured(self, database_url, flags):
        return build_client(database_url, flags, auth_token="s3cret")

    def test_missing_token_is_401(self, secured: TestClient):
        response = secured.get("/api/projects")

        assert response.status_code == 401
        assert response.headers["www-authenticate"] == "Bearer"
        assert response.headers["content-type"] == "application/problem+json"

    def test_wrong_token_is_401(self, secured: TestClient):
        response = secured.get("/api/projects", headers={"Authorization": "Bearer nope"})

        assert response.status_code == 401

    def test_valid_token_is_accepted(self, secured: TestClient):
        response = secured.get("/api/projects", headers={"Authorization": "Bearer s3cret"})

        assert response.status_code == 200

    def test_health_needs_no_token(self, secured: TestClient):
        assert secured.get("/healthz").status_code == 200


class TestProviderStates:
    def test_projects_exist_resets_to_seed(self, client):
        client.post("/api/projects", json={"name": "Extra", "startDate": "2026-01-01"})

        response = client.post("/_pact/provider-states", json={"state": "projects exist"})

        assert response.status_code == 200
        assert len(client.get("/api/projects").json()) == 3

    def test_no_project_with_id_from_state_text(self, client):
        state = f"no project with id {PLATFORM_ID} exists"

        client.post("/_pact/provider-states", json={"state": state, "action": "setup"})

        assert client.get(f"/api/projects/{PLATFORM_ID}").status_code == 404
        assert len(client.get("/api/projects").json()) == 2

    def test_no_project_with_id_from_params(self, client):
        client.post(
            "/_pact/provider-states",
            json={"state": "no project with id {id} exists", "params": {"id": PLATFORM_ID}},
        )

        assert client.get(f"/api/projects/{PLATFORM_ID}").status_code == 404

    def test_teardown_is_a_no_op(self, client):
        response = client.post(
            "/_pact/provider-states", json={"state": "projects exist", "action": "teardown"}
        )

        assert response.status_code == 200

    def test_unknown_state_is_400(self, client):
        response = client.post("/_pact/provider-states", json={"state": "the moon is cheese"})

        assert response.status_code == 400
        assert "state" in response.json()["errors"]

    def test_bad_id_is_400(self, client):
        response = client.post(
            "/_pact/provider-states", json={"state": "no project with id 42 exists"}
        )

        assert response.status_code == 400

    def test_not_mounted_by_default(self, database_url, flags):
        client = build_client(database_url, flags, enable_provider_states=False)

        response = client.post("/_pact/provider-states", json={"state": "projects exist"})

        assert response.status_code == 404


def test_unexpected_error_is_500_without_stack_trace(database_url, flags, monkeypatch):
    def explode(self):
        raise RuntimeError("secret internals")

    monkeypatch.setattr(SqlAlchemyProjectRepository, "list", explode)
    client = build_client(database_url, flags)
    client_no_raise = TestClient(client.app, raise_server_exceptions=False)

    response = client_no_raise.get("/api/projects")

    assert response.status_code == 500
    assert "secret internals" not in response.text
    assert response.headers["content-type"] == "application/problem+json"
