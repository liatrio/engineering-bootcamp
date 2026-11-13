"""Liveness and readiness probes. No auth."""

import logging

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

from app.db import ping
from app.errors import problem_doc, problem_response
from app.schemas import HealthStatus

logger = logging.getLogger(__name__)

router = APIRouter(tags=["health"])


@router.get("/healthz", response_model=HealthStatus, summary="Liveness: the process is up")
def healthz() -> HealthStatus:
    return HealthStatus()


@router.get(
    "/readyz",
    response_model=HealthStatus,
    summary="Readiness: the database is reachable",
    responses={503: problem_doc("Database unreachable")},
)
def readyz(request: Request) -> HealthStatus | JSONResponse:
    try:
        ping(request.app.state.engine)
    except Exception:
        logger.warning("Readiness check failed: database unreachable", exc_info=True)
        return problem_response(request, 503, detail="The database is unreachable.")
    return HealthStatus()
