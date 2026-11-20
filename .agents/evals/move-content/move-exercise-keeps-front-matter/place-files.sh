#!/usr/bin/env bash
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
. "$HERE/../../_lib/lib.sh"
copy_case_files "$HERE"
install_skill_scripts move-content
init_fixture_repo
