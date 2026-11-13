import uuid

import pytest

pytestmark = pytest.mark.integration

PLATFORM_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa"
NEW_PROJECT = {
    "name": "Mobile App",
    "description": "Native app for field staff",
    "startDate": "2026-04-01",
    "status": "planned",
}


def assert_problem(response, status):
    assert response.status_code == status
    assert response.headers["content-type"] == "application/problem+json"
    body = response.json()
    assert body["status"] == status
    assert body["title"]
    return body


def test_list_returns_seed_projects_in_camel_case(client):
    response = client.get("/api/projects")

    assert response.status_code == 200
    projects = {p["id"]: p for p in response.json()}
    assert set(projects) == {
        PLATFORM_ID,
        "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
        "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
    }
    platform = projects[PLATFORM_ID]
    assert platform["startDate"] == "2026-01-05"
    assert platform["status"] == "active"
    assert platform["createdAt"].endswith("Z")
    assert set(platform) == {
        "id",
        "name",
        "description",
        "startDate",
        "status",
        "createdAt",
        "updatedAt",
    }


@pytest.mark.parametrize(
    ("status", "expected"),
    [
        ("planned", ["Customer Portal"]),
        ("active", ["Platform Modernization"]),
        ("completed", ["Data Warehouse"]),
    ],
)
def test_list_filters_by_status(client, status, expected):
    response = client.get("/api/projects", params={"status": status})

    assert response.status_code == 200
    assert [p["name"] for p in response.json()] == expected


def test_list_with_unknown_status_is_400(client):
    body = assert_problem(client.get("/api/projects", params={"status": "paused"}), 400)

    assert "status" in body["errors"]


def test_get_by_id(client):
    response = client.get(f"/api/projects/{PLATFORM_ID}")

    assert response.status_code == 200
    assert response.json()["name"] == "Platform Modernization"


def test_get_unknown_id_is_404_problem(client):
    body = assert_problem(client.get(f"/api/projects/{uuid.uuid4()}"), 404)

    assert "not found" in body["detail"]


def test_create_returns_201_with_location(client):
    response = client.post("/api/projects", json=NEW_PROJECT)

    assert response.status_code == 201
    created = response.json()
    uuid.UUID(created["id"], version=4)
    assert response.headers["location"] == f"/api/projects/{created['id']}"
    assert client.get(response.headers["location"]).json() == created


def test_create_duplicate_name_is_409_regardless_of_case(client):
    response = client.post("/api/projects", json={**NEW_PROJECT, "name": "CUSTOMER portal"})

    assert_problem(response, 409)


def test_create_validation_failure_is_400_with_field_errors(client):
    response = client.post(
        "/api/projects",
        json={"name": "", "description": "x" * 501, "startDate": "soon", "status": "done"},
    )

    body = assert_problem(response, 400)
    assert set(body["errors"]) == {"name", "description", "startDate", "status"}


def test_malformed_json_is_400(client):
    response = client.post(
        "/api/projects", content="{not json", headers={"content-type": "application/json"}
    )

    assert_problem(response, 400)


def test_description_required_flag(client, flags):
    flags.description_required = True

    missing = client.post("/api/projects", json={**NEW_PROJECT, "description": "  "})
    present = client.post("/api/projects", json=NEW_PROJECT)

    assert assert_problem(missing, 400)["errors"] == {"description": ["A description is required."]}
    assert present.status_code == 201


def test_put_replaces_every_writable_field(client):
    body = {"name": "Platform 2.0", "startDate": "2026-02-01", "status": "completed"}

    response = client.put(f"/api/projects/{PLATFORM_ID}", json=body)

    assert response.status_code == 200
    updated = response.json()
    assert updated["name"] == "Platform 2.0"
    assert updated["description"] == ""
    assert updated["status"] == "completed"
    assert updated["updatedAt"] > updated["createdAt"]


def test_put_moving_status_backwards_is_409(client):
    body = {"name": "Platform Modernization", "startDate": "2026-01-05", "status": "planned"}

    response = client.put(f"/api/projects/{PLATFORM_ID}", json=body)

    assert "active to planned" in assert_problem(response, 409)["detail"]
    assert client.get(f"/api/projects/{PLATFORM_ID}").json()["status"] == "active"


def test_put_renaming_to_an_existing_name_is_409(client):
    body = {"name": "customer portal", "startDate": "2026-01-05", "status": "active"}

    response = client.put(f"/api/projects/{PLATFORM_ID}", json=body)

    assert_problem(response, 409)


def test_put_unknown_id_is_404(client):
    response = client.put(f"/api/projects/{uuid.uuid4()}", json=NEW_PROJECT)

    assert_problem(response, 404)


def test_delete_returns_204_then_404(client):
    first = client.delete(f"/api/projects/{PLATFORM_ID}")
    second = client.delete(f"/api/projects/{PLATFORM_ID}")

    assert first.status_code == 204
    assert first.content == b""
    assert_problem(second, 404)


def test_invalid_uuid_in_path_is_400(client):
    body = assert_problem(client.get("/api/projects/not-a-uuid"), 400)

    assert "projectId" in body["errors"]


def test_unknown_route_is_404_problem(client):
    assert_problem(client.get("/api/nothing-here"), 404)
