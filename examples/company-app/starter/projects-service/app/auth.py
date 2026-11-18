"""Optional bearer-token check for /api/* (off unless AUTH_TOKEN is set)."""

import secrets
from typing import Annotated

from fastapi import Depends, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.errors import UnauthorizedError

# auto_error=False: we raise our own error so the body is Problem Details.
_bearer = HTTPBearer(auto_error=False, description="Only enforced when AUTH_TOKEN is set.")


def require_token(
    request: Request,
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(_bearer)],
) -> None:
    expected = request.app.state.settings.auth_token
    if not expected:
        return
    if credentials is None or not secrets.compare_digest(
        credentials.credentials.encode(), expected.encode()
    ):
        raise UnauthorizedError("A valid bearer token is required.")
