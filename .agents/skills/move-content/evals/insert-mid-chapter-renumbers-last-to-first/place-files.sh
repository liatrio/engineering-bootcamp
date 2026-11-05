#!/usr/bin/env bash
# Builds a mini docs/ + sidebar + quizzes fixture in a git repo, and installs the skill scripts.
set -eu
HERE="$(cd "$(dirname "$0")" && pwd)"
mkdir -p .agents/skills/move-content
cp -R "$HERE/../../scripts" .agents/skills/move-content/scripts
mkdir -p docs/3-demo src/quizzes/chapter-3/3.2 src/quizzes/chapter-3/3.3

mk() { # file title body
  printf -- '---\n%s:\n  category: Demo\n  estReadingMinutes: 5\n---\n\n# %s\n\n%s\n' "$1" "$2" "$3" > "$1"
}
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
git init -q
git add -A
git -c user.email=eval@example.com -c user.name=eval commit -qm fixture
