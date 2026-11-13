"""Application factory. `app` at the bottom is what uvicorn serves."""

import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app import flags as flag_module
from app.config import Settings, get_settings
from app.db import make_engine, make_session_factory, run_migrations
from app.errors import register_exception_handlers
from app.flags import FeatureFlags, OpenFeatureFlags
from app.repositories.project_repository import SqlAlchemyProjectRepository
from app.routers import health, projects, provider_states
from app.schemas import ProblemDetails
from app.services.seed import seed_if_empty
from app.telemetry import ProjectMetrics

logger = logging.getLogger(__name__)


def create_app(settings: Settings | None = None, flags: FeatureFlags | None = None) -> FastAPI:
    """Build the app. Tests pass their own settings and a fake `flags`."""
    settings = settings or get_settings()
    use_flagd = flags is None

    @asynccontextmanager
    async def lifespan(app: FastAPI) -> AsyncIterator[None]:
        if use_flagd:
            flag_module.init_flagd(settings.flagd_host, settings.flagd_port)
        run_migrations(app.state.engine)
        if settings.seed_data:
            with app.state.session_factory() as session:
                if seed_if_empty(SqlAlchemyProjectRepository(session)):
                    logger.info("Inserted seed projects")
        logger.info("projects-service ready")
        yield
        if use_flagd:
            flag_module.shutdown_flags()
        app.state.engine.dispose()

    app = FastAPI(
        title="Projects API",
        version="1.0.0",
        description="Projects in the Company app. Errors are RFC 9457 Problem Details.",
        lifespan=lifespan,
        # operationId = function name (list_projects, get_project, ...), friendlier for clients.
        generate_unique_id_function=lambda route: route.name,
    )
    app.state.settings = settings
    app.state.engine = make_engine(settings.database_url)
    app.state.session_factory = make_session_factory(app.state.engine)
    app.state.flags = flags or OpenFeatureFlags()
    # Created once: instruments are meant to live as long as the process.
    app.state.metrics = ProjectMetrics()

    register_exception_handlers(app)
    app.include_router(health.router)
    app.include_router(projects.router)
    if settings.enable_provider_states:
        app.include_router(provider_states.router)

    _customize_openapi(app)
    return app


def _customize_openapi(app: FastAPI) -> None:
    """Document Problem Details, and drop the 422 FastAPI adds (this service answers 400)."""
    original = app.openapi

    def openapi() -> dict:
        if app.openapi_schema:
            return app.openapi_schema
        schema = original()
        for path in schema.get("paths", {}).values():
            for operation in path.values():
                operation.get("responses", {}).pop("422", None)
        for name in ("HTTPValidationError", "ValidationError"):
            schema["components"]["schemas"].pop(name, None)
        schema["components"]["schemas"]["ProblemDetails"] = ProblemDetails.model_json_schema(
            by_alias=True
        )
        app.openapi_schema = schema
        return schema

    app.openapi = openapi


app = create_app()
