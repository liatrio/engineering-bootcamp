"""Provider verification: does projects-service honour the contracts its consumers wrote?

Two consumers record what they expect from this service:

- the web app (web/src/features/projects/api.pact.test.ts) in web/pacts/
- assignments-service (its PactNet consumer tests) in assignments-service/pacts/

This test starts the real
service on a free port, against a real database, and replays every recorded
interaction. Before each one, Pact calls our provider-state endpoint so the
data matches what the consumer assumed ("projects exist", "no project with id
{id} exists").
"""

import json
import socket
import threading
import time
from collections.abc import Iterator
from pathlib import Path

import pytest
import uvicorn
from pact import Verifier

from app.config import Settings
from app.main import create_app
from tests.fakes import FakeFlags

REPO_ROOT = Path(__file__).resolve().parents[3]
PACT_DIRS = [REPO_ROOT / "web" / "pacts", REPO_ROOT / "assignments-service" / "pacts"]
PROVIDER = "projects-service"

pytestmark = pytest.mark.contract


def _pacts_for_this_provider() -> list[Path]:
    """Every pact file next to us whose provider is projects-service.

    assignments-service/pacts/ also holds its contract with employees-service,
    so files are picked by the provider name inside them. A consumer that
    hasn't written pacts yet (no directory) is simply skipped.
    """
    return sorted(
        path
        for directory in PACT_DIRS
        if directory.is_dir()
        for path in directory.glob("*.json")
        if json.loads(path.read_text())["provider"]["name"] == PROVIDER
    )


def _free_port() -> int:
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        return sock.getsockname()[1]


@pytest.fixture(scope="module")
def provider_url(database_url: str) -> Iterator[str]:
    settings = Settings(database_url=database_url, enable_provider_states=True)
    port = _free_port()
    server = uvicorn.Server(
        uvicorn.Config(create_app(settings, flags=FakeFlags()), port=port, log_level="warning")
    )
    thread = threading.Thread(target=server.run, daemon=True)
    thread.start()
    while not server.started:
        time.sleep(0.05)
    yield f"http://localhost:{port}"
    server.should_exit = True
    thread.join(timeout=5)


@pytest.mark.skipif(not _pacts_for_this_provider(), reason="no consumer pacts found")
def test_projects_service_honours_consumer_contracts(provider_url: str) -> None:
    verifier = Verifier(PROVIDER).add_transport(url=provider_url)
    for pact_file in _pacts_for_this_provider():
        verifier.add_source(str(pact_file))
    verifier.state_handler(f"{provider_url}/_pact/provider-states", body=True, teardown=True)
    verifier.verify()
