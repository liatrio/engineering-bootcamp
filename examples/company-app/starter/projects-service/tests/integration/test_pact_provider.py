"""Provider verification: does projects-service honour the contracts its consumers wrote?

The web app's consumer tests (web/src/features/projects/api.pact.test.ts) record
what the UI expects from this service in web/pacts/. This test starts the real
service on a free port, against a real database, and replays every recorded
interaction. Before each one, Pact calls our provider-state endpoint so the
data matches what the consumer assumed ("projects exist").
"""

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

PACT_DIR = Path(__file__).resolve().parents[3] / "web" / "pacts"

pytestmark = pytest.mark.contract


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


@pytest.mark.skipif(not PACT_DIR.exists(), reason="no consumer pacts found next to this service")
def test_projects_service_honours_consumer_contracts(provider_url: str) -> None:
    verifier = (
        Verifier("projects-service")
        .add_transport(url=provider_url)
        .add_source(str(PACT_DIR))
        .state_handler(f"{provider_url}/_pact/provider-states", body=True, teardown=True)
    )
    verifier.verify()
