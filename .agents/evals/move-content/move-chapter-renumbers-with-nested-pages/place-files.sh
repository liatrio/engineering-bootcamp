#!/usr/bin/env bash
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
. "$HERE/../../_lib/lib.sh"
build_chapter_fixture "$HERE"
