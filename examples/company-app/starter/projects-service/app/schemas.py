"""Pydantic models for the HTTP API. JSON is camelCase on the wire."""

import uuid
from datetime import UTC, date, datetime
from enum import StrEnum
from typing import Annotated, Any

from pydantic import BaseModel, ConfigDict, Field, StringConstraints, field_serializer
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        validate_by_name=True,
        validate_by_alias=True,
        from_attributes=True,
    )


class ProjectStatus(StrEnum):
    PLANNED = "planned"
    ACTIVE = "active"
    COMPLETED = "completed"


ProjectName = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=100)]
ProjectDescription = Annotated[str, StringConstraints(strip_whitespace=True, max_length=500)]


class ProjectWrite(CamelModel):
    """Body for POST and PUT. PUT replaces every writable field, so it uses the same shape."""

    name: ProjectName
    description: ProjectDescription = ""
    start_date: date
    status: ProjectStatus = ProjectStatus.PLANNED

    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "name": "Mobile App",
                    "description": "Native app for field staff",
                    "startDate": "2026-04-01",
                    "status": "planned",
                }
            ]
        }
    )


class ProjectRead(CamelModel):
    id: uuid.UUID
    name: str
    description: str
    start_date: date
    status: ProjectStatus
    created_at: datetime
    updated_at: datetime

    @field_serializer("created_at", "updated_at")
    def as_utc(self, value: datetime) -> datetime:
        # Always emit UTC ("...Z"), whatever time zone the database session uses.
        return value.astimezone(UTC)


class ProblemDetails(BaseModel):
    """RFC 9457 Problem Details, served as application/problem+json."""

    type: str = "about:blank"
    title: str
    status: int
    detail: str | None = None
    instance: str | None = None
    errors: dict[str, list[str]] | None = Field(
        default=None, description="Field name to messages; only on validation failures."
    )
    trace_id: str | None = Field(default=None, alias="traceId")

    model_config = ConfigDict(validate_by_name=True)


class HealthStatus(BaseModel):
    status: str = "ok"


class ProviderStateRequest(BaseModel):
    state: str
    params: dict[str, Any] = Field(default_factory=dict)
    action: str = "setup"
