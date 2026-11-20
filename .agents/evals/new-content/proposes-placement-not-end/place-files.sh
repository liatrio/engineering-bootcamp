#!/usr/bin/env bash
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
. "$HERE/../../_lib/lib.sh"
copy_case_files "$HERE"
init_fixture_repo
