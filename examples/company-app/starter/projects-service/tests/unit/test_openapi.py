from pathlib import Path

import yaml

from app.main import app

OPENAPI_YAML = Path(__file__).resolve().parents[2] / "openapi.yaml"


def test_committed_openapi_matches_the_code():
    committed = yaml.safe_load(OPENAPI_YAML.read_text())

    assert committed == app.openapi(), (
        "openapi.yaml is stale: run `uv run python scripts/export_openapi.py`"
    )
