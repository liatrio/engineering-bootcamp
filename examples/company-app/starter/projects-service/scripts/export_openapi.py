"""Write the live OpenAPI document to openapi.yaml.

uv run python scripts/export_openapi.py          # rewrite openapi.yaml
uv run python scripts/export_openapi.py --check  # fail if it is out of date (CI)
"""

import os
import sys
from pathlib import Path

import yaml

os.environ.setdefault("DATABASE_URL", "postgresql://unused:unused@localhost:1/unused")
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.main import app  # noqa: E402

TARGET = Path(__file__).resolve().parent.parent / "openapi.yaml"


def main() -> int:
    document = yaml.safe_dump(app.openapi(), sort_keys=False, allow_unicode=True)
    if "--check" in sys.argv:
        if not TARGET.exists() or TARGET.read_text() != document:
            print("openapi.yaml is out of date: run `uv run python scripts/export_openapi.py`")
            return 1
        print("openapi.yaml is up to date")
        return 0
    TARGET.write_text(document)
    print(f"Wrote {TARGET.name}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
