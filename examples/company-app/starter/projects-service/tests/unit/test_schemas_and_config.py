import pytest
from pydantic import ValidationError

from app.config import Settings
from app.schemas import ProjectWrite


@pytest.mark.parametrize(
    ("given", "expected"),
    [
        ("postgresql://u:p@db:5432/projects", "postgresql+psycopg://u:p@db:5432/projects"),
        ("postgres://u:p@db/projects", "postgresql+psycopg://u:p@db/projects"),
        ("postgresql+psycopg://u:p@db/projects", "postgresql+psycopg://u:p@db/projects"),
    ],
)
def test_database_url_uses_psycopg(given, expected):
    assert Settings(database_url=given).database_url == expected


def test_project_write_trims_and_defaults():
    body = ProjectWrite.model_validate({"name": "  Mobile  ", "startDate": "2026-04-01"})

    assert body.name == "Mobile"
    assert body.description == ""
    assert body.status == "planned"


def test_project_write_rejects_blank_name_and_unknown_status():
    with pytest.raises(ValidationError) as excinfo:
        ProjectWrite.model_validate({"name": "   ", "startDate": "2026-04-01", "status": "done"})

    fields = {e["loc"][0] for e in excinfo.value.errors()}
    assert fields == {"name", "status"}
