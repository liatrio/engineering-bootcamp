"""Pact provider-state endpoint. Only mounted when ENABLE_PROVIDER_STATES=true.

Never enable this in production: it wipes the projects table.
"""

import re
import uuid
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_session
from app.errors import ValidationFailedError
from app.repositories.project_repository import SqlAlchemyProjectRepository
from app.schemas import ProviderStateRequest
from app.services.seed import reset_to_seed

router = APIRouter(prefix="/_pact", tags=["pact"], include_in_schema=False)

_NO_PROJECT = re.compile(r"^no project with id (?P<id>\S+) exists$")


def _id_to_remove(body: ProviderStateRequest) -> uuid.UUID | None:
    if body.state == "projects exist":
        return None
    match = _NO_PROJECT.match(body.state)
    if match is None:
        raise ValidationFailedError({"state": [f"Unknown provider state '{body.state}'."]})
    # The ID comes from params when the consumer used a template ("{id}"),
    # otherwise from the state text itself.
    raw = str(body.params.get("id", match["id"]))
    try:
        return uuid.UUID(raw)
    except ValueError:
        raise ValidationFailedError({"params.id": [f"'{raw}' is not a UUID."]}) from None


@router.post("/provider-states")
def provider_states(
    body: ProviderStateRequest, session: Annotated[Session, Depends(get_session)]
) -> dict:
    if body.action != "setup":
        return {}
    remove = _id_to_remove(body)
    reset_to_seed(SqlAlchemyProjectRepository(session), [remove] if remove else [])
    return {}
