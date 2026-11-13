"""Domain errors and the handlers that turn every error into RFC 9457 Problem Details."""

import logging
from http import HTTPStatus

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from opentelemetry import trace
from pydantic.alias_generators import to_camel
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.schemas import ProblemDetails

logger = logging.getLogger(__name__)

PROBLEM_JSON = "application/problem+json"

# Same type URIs ASP.NET Core uses, so every service in the app looks alike.
_TYPES = {
    400: "https://tools.ietf.org/html/rfc9110#section-15.5.1",
    401: "https://tools.ietf.org/html/rfc9110#section-15.5.2",
    404: "https://tools.ietf.org/html/rfc9110#section-15.5.5",
    405: "https://tools.ietf.org/html/rfc9110#section-15.5.6",
    409: "https://tools.ietf.org/html/rfc9110#section-15.5.10",
    500: "https://tools.ietf.org/html/rfc9110#section-15.6.1",
    503: "https://tools.ietf.org/html/rfc9110#section-15.6.4",
}

VALIDATION_TITLE = "One or more validation errors occurred."


class AppError(Exception):
    status: int = 500
    title: str = "An unexpected error occurred."

    def __init__(self, detail: str | None = None) -> None:
        super().__init__(detail or self.title)
        self.detail = detail


class NotFoundError(AppError):
    status = 404
    title = "Not Found"


class ConflictError(AppError):
    status = 409
    title = "Conflict"


class UnauthorizedError(AppError):
    status = 401
    title = "Unauthorized"


class ValidationFailedError(AppError):
    status = 400
    title = VALIDATION_TITLE

    def __init__(self, errors: dict[str, list[str]], detail: str | None = None) -> None:
        super().__init__(detail)
        self.errors = errors


def problem_doc(description: str) -> dict:
    """OpenAPI `responses` entry for a Problem Details error."""
    return {
        "description": description,
        "content": {PROBLEM_JSON: {"schema": {"$ref": "#/components/schemas/ProblemDetails"}}},
    }


def _current_trace_id() -> str | None:
    ctx = trace.get_current_span().get_span_context()
    return format(ctx.trace_id, "032x") if ctx.is_valid else None


def problem_response(
    request: Request,
    status: int,
    title: str | None = None,
    detail: str | None = None,
    errors: dict[str, list[str]] | None = None,
    headers: dict[str, str] | None = None,
) -> JSONResponse:
    body = ProblemDetails(
        type=_TYPES.get(status, "about:blank"),
        title=title or HTTPStatus(status).phrase,
        status=status,
        detail=detail,
        instance=request.url.path,
        errors=errors,
        trace_id=_current_trace_id(),
    )
    return JSONResponse(
        body.model_dump(by_alias=True, exclude_none=True),
        status_code=status,
        media_type=PROBLEM_JSON,
        headers=headers,
    )


def _field_name(loc: tuple[int | str, ...]) -> str:
    """('body', 'startDate') -> 'startDate'; ('path', 'project_id') -> 'projectId'."""
    parts = [str(p) for p in loc[1:]] or [str(loc[0])]
    return ".".join(to_camel(p) if "_" in p else p for p in parts)


async def _handle_app_error(request: Request, exc: AppError) -> JSONResponse:
    errors = exc.errors if isinstance(exc, ValidationFailedError) else None
    headers = {"WWW-Authenticate": "Bearer"} if exc.status == 401 else None
    return problem_response(request, exc.status, exc.title, exc.detail, errors, headers)


async def _handle_validation_error(request: Request, exc: RequestValidationError) -> JSONResponse:
    errors: dict[str, list[str]] = {}
    for error in exc.errors():
        errors.setdefault(_field_name(tuple(error["loc"])), []).append(error["msg"])
    return problem_response(request, 400, VALIDATION_TITLE, errors=errors)


async def _handle_http_exception(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    detail = exc.detail if isinstance(exc.detail, str) else None
    if detail == HTTPStatus(exc.status_code).phrase:
        detail = None
    return problem_response(request, exc.status_code, detail=detail, headers=exc.headers)


async def _handle_unexpected(request: Request, exc: Exception) -> JSONResponse:
    # Log the stack trace; never return it to the caller.
    logger.exception("Unhandled error on %s %s", request.method, request.url.path)
    return problem_response(request, 500, "An unexpected error occurred.")


def register_exception_handlers(app: FastAPI) -> None:
    app.add_exception_handler(AppError, _handle_app_error)
    app.add_exception_handler(RequestValidationError, _handle_validation_error)
    app.add_exception_handler(StarletteHTTPException, _handle_http_exception)
    app.add_exception_handler(Exception, _handle_unexpected)
