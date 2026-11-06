#!/usr/bin/env bash
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
. "$HERE/../../../_shared/evals/lib.sh"
build_move_fixture "$HERE"
