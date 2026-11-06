#!/usr/bin/env bash
# Seeds the scratch dir with a copy of the repo, then removes the KEDA lesson and every
# file that would leak it, so the run has to write the lesson from scratch.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
. "$HERE/../../../_shared/evals/lib.sh"
seed_repo_copy
[ -f docs/9-kubernetes-container-orchestration/9.6-keda.md ] || { echo "seed copy is missing the KEDA page" >&2; exit 1; }
rm -f docs/9-kubernetes-container-orchestration/9.6-keda.md
rm -rf src/quizzes/chapter-9/9.6
rm -f docs/9-kubernetes-container-orchestration/img/producer-consumer.jpg \
      docs/9-kubernetes-container-orchestration/img/dank-hpa-meme.jpg
sed -i.bak '/9.6-keda.md/d' docs/_sidebar.md && rm docs/_sidebar.md.bak
python3 - <<'PY'
import re
p = "docs/README.md"
s = open(p).read()
s = re.sub(r"(?m)^docs/9-kubernetes-container-orchestration/9\.6-keda\.md:\n(?:[ \t].*\n)*", "", s)
open(p, "w").write(s)
PY
