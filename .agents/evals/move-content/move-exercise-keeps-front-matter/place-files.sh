#!/usr/bin/env bash
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
. "$HERE/../../_lib/lib.sh"
copy_case_files "$HERE"
install_move_scripts "$HERE"
init_fixture_repo
