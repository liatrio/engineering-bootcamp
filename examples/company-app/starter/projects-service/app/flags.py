"""Feature flags through OpenFeature, with flagd as the provider.

The rest of the app depends on the small `FeatureFlags` protocol, so tests can
swap in a fake without a flagd server.
"""

import logging
from typing import Protocol

from openfeature import api
from openfeature.contrib.provider.flagd import FlagdProvider
from openfeature.contrib.provider.flagd.config import ResolverType

logger = logging.getLogger(__name__)

PROJECT_DESCRIPTION_REQUIRED = "project-description-required"


class FeatureFlags(Protocol):
    def project_description_required(self) -> bool: ...


class OpenFeatureFlags:
    """Reads flags from whatever provider is registered with OpenFeature."""

    def __init__(self) -> None:
        self._client = api.get_client("projects-service")

    def project_description_required(self) -> bool:
        # The default here is what you get if flagd is down or the flag is missing.
        return self._client.get_boolean_value(PROJECT_DESCRIPTION_REQUIRED, False)


def init_flagd(host: str, port: int) -> None:
    """Register the flagd provider without blocking startup.

    `set_provider` connects in the background. Until flagd answers, every
    evaluation returns the code default, so the service starts even when
    flagd is down.
    """
    logger.info("Connecting to flagd at %s:%s", host, port)
    api.set_provider(FlagdProvider(host=host, port=port, resolver_type=ResolverType.RPC))


def shutdown_flags() -> None:
    api.shutdown()
