import os

# app.main builds the app at import time, and Settings needs a DATABASE_URL.
# Unit tests never connect; integration tests pass their own Settings.
os.environ.setdefault("DATABASE_URL", "postgresql://unused:unused@localhost:1/unused")

# Testcontainers mounts the Docker socket into its cleanup container (Ryuk).
# Docker Desktop on macOS reports a socket path inside your home directory that
# can't be mounted, so point it at the standard path the VM exposes. Set the
# variable yourself to override (Colima, Podman, remote Docker).
os.environ.setdefault("TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE", "/var/run/docker.sock")
