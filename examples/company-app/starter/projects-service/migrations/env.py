"""Alembic environment.

The app calls `run_migrations()` on startup and hands us an open connection.
From the command line (`uv run alembic upgrade head`) we connect with
DATABASE_URL instead.
"""

from alembic import context
from sqlalchemy import create_engine

from app.config import Settings
from app.models import Base

target_metadata = Base.metadata


def run_migrations_online() -> None:
    connection = context.config.attributes.get("connection")
    if connection is not None:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()
        return

    engine = create_engine(Settings().database_url)
    with engine.connect() as conn:
        context.configure(connection=conn, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


run_migrations_online()
