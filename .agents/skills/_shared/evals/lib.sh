#!/usr/bin/env bash
# Shared helpers for eval scaffold scripts. Source it from a case's place-files.sh:
#
#   . "$(dirname "$0")/../../../_shared/evals/lib.sh"
#
# `claude plugin eval --scaffold` runs the scaffold in a fresh empty temp dir. It does
# not pass the case dir, so each case keeps a small stub that passes its own dir here.
# Case dirs are `.agents/skills/<skill>/evals/<case>/`.
set -euo pipefail

SHARED_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
REPO_ROOT="$(cd "$SHARED_DIR/../../../.." && pwd -P)"

# Refuses to run anywhere that could hold real work: the repo checkout, an existing git
# repo, or any non-empty directory.
scaffold_guard() {
  local here
  here="$(pwd -P)"
  if [ "$here" = "$REPO_ROOT" ] || [ "$here" = "$REPO_ROOT/.agents/skills" ]; then
    echo "scaffold refused: cwd is the repo checkout ($here)" >&2
    exit 1
  fi
  if [ -e .git ] || [ -n "$(ls -A .)" ]; then
    echo "scaffold refused: cwd is not an empty scratch directory ($here)" >&2
    exit 1
  fi
}

# copy_case_files CASE_DIR: copies CASE_DIR/files/ into the scratch dir.
copy_case_files() {
  local case_dir="$1"
  scaffold_guard
  cp -R "$case_dir/files/." .
}

# init_fixture_repo: commits the scratch dir as a baseline in a repo that lives only here.
init_fixture_repo() {
  export GIT_DIR="$PWD/.git" GIT_WORK_TREE="$PWD"
  git init -q
  git add -A
  git -c user.email=eval@example.com -c user.name=eval commit -qm fixture
}

# mk FILE TITLE BODY: writes a page whose front-matter is keyed by its own path.
mk() {
  printf -- '---\n%s:\n  category: Demo\n  estReadingMinutes: 5\n---\n\n# %s\n\n%s\n' "$1" "$2" "$3" > "$1"
}

# build_move_fixture CASE_DIR: mini docs/ + sidebar + quizzes in a git repo, with the
# move-content scripts installed. CASE_DIR is a move-content case dir.
build_move_fixture() {
  local case_dir="$1"
  scaffold_guard
  install_move_scripts "$case_dir"
  mkdir -p docs/3-demo src/quizzes/chapter-3/3.2 src/quizzes/chapter-3/3.3

  mk docs/3-demo/3.0-overview.md "Overview" "Intro."
  mk docs/3-demo/3.1-first.md "First" "First section."
  mk docs/3-demo/3.2-second.md "Second" '<div class="quizdown">
  <div id="chapter-3/3.2/second-quiz.js"></div>
</div>'
  mk docs/3-demo/3.3-third.md "Third" '<div class="quizdown">
  <div id="chapter-3/3.3/third-quiz.js"></div>
</div>'
  mk docs/3-demo/3.3.1-third-deep.md "Third deep" "Deep dive."
  echo 'const rawQuizdown = `# Q2`;' > src/quizzes/chapter-3/3.2/second-quiz.js
  echo 'const rawQuizdown = `# Q3`;' > src/quizzes/chapter-3/3.3/third-quiz.js
  cat > docs/_sidebar.md <<'SB'
- [Welcome](/)

- **Chapter 3**

- [3.0 - Overview](3-demo/3.0-overview.md)
- [3.1 - First](3-demo/3.1-first.md)
- [3.2 - Second](3-demo/3.2-second.md)
- [3.3 - Third](3-demo/3.3-third.md)
  - [3.3.1 - Third deep](3-demo/3.3.1-third-deep.md)
SB
  init_fixture_repo
}

# seed_repo_copy: copies the tracked text content of the real checkout into the scratch
# dir, minus images, so a scaffold can edit a private copy instead of the checkout.
seed_repo_copy() {
  scaffold_guard
  (cd "$REPO_ROOT" && tar -c \
    --exclude='img*' --exclude='node_modules' --exclude='.git' \
    --exclude='*.png' --exclude='*.jpg' --exclude='*.gif' \
    docs src examples .husky package.json AGENTS.md STYLE.md .markdownlint.json .cspell.json 2>/dev/null) | tar -x
}

# build_chapter_fixture CASE_DIR: three chapters (2-aa, 3-bb, 4-cc) with nested pages and
# one quiz, in a git repo, with the move-content scripts installed.
build_chapter_fixture() {
  local case_dir="$1"
  scaffold_guard
  install_move_scripts "$case_dir"
  mkdir -p docs/2-aa docs/3-bb docs/4-cc src/quizzes/chapter-4/4.1

  mk docs/2-aa/2.1-a.md "A" "Chapter 2."
  mk docs/3-bb/3.1-b.md "B" "Chapter 3."
  mk docs/3-bb/3.1.1-b-deep.md "B deep" "Deep dive."
  mk docs/4-cc/4.1-c.md "C" '<div class="quizdown">
  <div id="chapter-4/4.1/q.js"></div>
</div>'
  mk docs/4-cc/4.1.1-c-deep.md "C deep" "Deep dive."
  echo 'const rawQuizdown = `# Q`;' > src/quizzes/chapter-4/4.1/q.js
  cat > docs/_sidebar.md <<'SB'
- [Welcome](/)

- **Chapter 2**

- [2.1 - A](2-aa/2.1-a.md)

- **Chapter 3**

- [3.1 - B](3-bb/3.1-b.md)
  - [3.1.1 - B deep](3-bb/3.1.1-b-deep.md)

- **Chapter 4**

- [4.1 - C](4-cc/4.1-c.md)
  - [4.1.1 - C deep](4-cc/4.1.1-c-deep.md)
SB
  init_fixture_repo
}

# install_move_scripts CASE_DIR: installs the move-content scripts, for a move-content case dir.
install_move_scripts() {
  mkdir -p .agents/skills/move-content
  cp -R "$1/../../scripts" .agents/skills/move-content/scripts
}

# install_link_checker CASE_DIR: installs check-links.js (no tests or fixtures) and a copy of the
# `remark` dependency closure from the checkout's node_modules into the scratch dir, so the
# script runs there. CASE_DIR is a dead-link-check case dir. Reads the checkout, writes only here.
install_link_checker() {
  local case_dir="$1" list here
  here="$(pwd -P)"
  # Runs after copy_case_files, so the dir is not empty; refuse only the places that hold real work.
  if [ "$here" = "$REPO_ROOT" ] || [ "$here" = "$REPO_ROOT/.agents/skills" ] || [ -e .git ]; then
    echo "scaffold refused: cwd is the checkout or a git repo ($here)" >&2
    exit 1
  fi
  if [ ! -d "$REPO_ROOT/node_modules/remark" ]; then
    echo "scaffold needs node_modules/remark in the checkout; run npm install" >&2
    exit 1
  fi
  mkdir -p .agents/skills/dead-link-check/scripts
  cp "$case_dir/../../scripts/check-links.js" .agents/skills/dead-link-check/scripts/
  list="$(cd "$REPO_ROOT" && node -e '
    const fs = require("fs"), path = require("path");
    const seen = new Set();
    const walk = (name, from) => {
      for (let dir = from; ; dir = path.dirname(dir)) {
        const p = path.join(dir, "node_modules", name);
        if (fs.existsSync(path.join(p, "package.json"))) {
          if (seen.has(p)) return;
          seen.add(p);
          const deps = JSON.parse(fs.readFileSync(path.join(p, "package.json"), "utf8")).dependencies || {};
          for (const d of Object.keys(deps)) walk(d, p);
          return;
        }
        if (path.dirname(dir) === dir) throw new Error("unresolved " + name);
      }
    };
    walk("remark", process.cwd());
    for (const p of seen) console.log(path.relative(process.cwd(), p));
  ')"
  (cd "$REPO_ROOT" && printf '%s\n' "$list" | xargs tar -c) | tar -x
}
