"""HTTP endpoints for /api/projects. Thin: parse, call the service, shape the response."""

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, Query, Request, Response, status
from sqlalchemy.orm import Session

from app.auth import require_token
from app.db import get_session
from app.errors import problem_doc
from app.flags import FeatureFlags
from app.repositories.project_repository import SqlAlchemyProjectRepository
from app.schemas import ProjectRead, ProjectStatus, ProjectWrite
from app.services.project_service import ProjectService


def get_flags(request: Request) -> FeatureFlags:
    return request.app.state.flags


def get_project_service(
    request: Request,
    session: Annotated[Session, Depends(get_session)],
    flags: Annotated[FeatureFlags, Depends(get_flags)],
) -> ProjectService:
    return ProjectService(
        SqlAlchemyProjectRepository(session), flags, metrics=request.app.state.metrics
    )


Service = Annotated[ProjectService, Depends(get_project_service)]


router = APIRouter(
    prefix="/api/projects",
    tags=["projects"],
    dependencies=[Depends(require_token)],
    responses={401: problem_doc("Missing or invalid bearer token (only when AUTH_TOKEN is set)")},
)


@router.get("", response_model=list[ProjectRead], summary="List projects")
def list_projects(
    service: Service,
    # `status` is the public name; the parameter is renamed so it doesn't shadow fastapi.status.
    project_status: Annotated[
        ProjectStatus | None, Query(alias="status", description="Only projects with this status")
    ] = None,
):
    return service.list_projects(project_status)


@router.get(
    "/{project_id}",
    response_model=ProjectRead,
    summary="Get a project",
    responses={404: problem_doc("Unknown project ID")},
)
def get_project(project_id: uuid.UUID, service: Service):
    return service.get_project(project_id)


@router.post(
    "",
    response_model=ProjectRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create a project",
    responses={400: problem_doc("Validation failure"), 409: problem_doc("Duplicate name")},
)
def create_project(body: ProjectWrite, request: Request, response: Response, service: Service):
    project = service.create_project(body)
    response.headers["Location"] = str(request.url_for("get_project", project_id=project.id).path)
    return project


@router.put(
    "/{project_id}",
    response_model=ProjectRead,
    summary="Replace a project",
    responses={
        400: problem_doc("Validation failure"),
        404: problem_doc("Unknown project ID"),
        409: problem_doc(
            "Duplicate name, or a status change other than planned -> active -> completed"
        ),
    },
)
def update_project(project_id: uuid.UUID, body: ProjectWrite, service: Service):
    return service.update_project(project_id, body)


@router.delete(
    "/{project_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a project",
    responses={404: problem_doc("Unknown project ID")},
)
def delete_project(project_id: uuid.UUID, service: Service) -> Response:
    service.delete_project(project_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
