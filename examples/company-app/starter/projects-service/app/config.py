"""Service configuration, read from environment variables only (see SPEC.md)."""

from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    port: int = 8000
    # Required: there is no sensible default for where the database lives.
    database_url: str
    flagd_host: str = "flagd"
    flagd_port: int = 8013
    seed_data: bool = True
    enable_provider_states: bool = False
    # Unset (or empty) means no authentication on /api/*.
    auth_token: str | None = None
    log_level: str = "INFO"

    @field_validator("database_url")
    @classmethod
    def use_psycopg_driver(cls, value: str) -> str:
        """Accept plain postgres URLs and point SQLAlchemy at psycopg 3.

        Compose files and cloud providers usually hand out ``postgresql://`` or
        ``postgres://`` URLs. SQLAlchemy would pick psycopg2 for those, so the
        driver is made explicit here.
        """
        for prefix in ("postgresql://", "postgres://"):
            if value.startswith(prefix):
                return "postgresql+psycopg://" + value.removeprefix(prefix)
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()
