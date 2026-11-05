#!/usr/bin/env node
'use strict';
// Smoke test for move.js and check-refs.js on a throwaway git repo. Run from the repo root:
//   node .agents/skills/move-content/scripts/move.test.js
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const MOVE = path.join(__dirname, 'move.js');
const REFS = path.join(__dirname, 'check-refs.js');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'move-'));
const sh = (cmd, args) => spawnSync(cmd, args, { cwd: tmp, encoding: 'utf8' });
const node = (script, ...args) => sh('node', [script, ...args]);
const write = (p, s) => { fs.mkdirSync(path.dirname(path.join(tmp, p)), { recursive: true }); fs.writeFileSync(path.join(tmp, p), s); };
const page = (file, title, body) =>
  write(file, `---\n${file}:\n  category: Demo\n  estReadingMinutes: 5\n---\n\n# ${title}\n\n${body}\n`);
const quiz = (id) => `<div class="quizdown">\n  <div id="chapter-3/${id}/q.js"></div>\n</div>`;

try {
  page('docs/3-demo/3.1-first.md', 'First', 'First.');
  page('docs/3-demo/3.2-second.md', 'Second', quiz('3.2'));
  page('docs/3-demo/3.3-third.md', 'Third', quiz('3.3'));
  page('docs/3-demo/3.3.1-third-deep.md', 'Third deep', 'Deep.');
  write('src/quizzes/chapter-3/3.2/q.js', 'const rawQuizdown = `# Q2`;\n');
  write('src/quizzes/chapter-3/3.3/q.js', 'const rawQuizdown = `# Q3`;\n');
  write('docs/_sidebar.md', [
    '- [Welcome](/)', '', '- **Chapter 3**', '',
    '- [3.1 - First](3-demo/3.1-first.md)',
    '- [3.2 - Second](3-demo/3.2-second.md)',
    '- [3.3 - Third](3-demo/3.3-third.md)',
    '  - [3.3.1 - Third deep](3-demo/3.3.1-third-deep.md)', '',
  ].join('\n'));
  sh('git', ['init', '-q']);
  sh('git', ['add', '-A']);
  sh('git', ['-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '-qm', 'fixture']);
  assert.strictEqual(node(REFS).status, 0, 'fixture starts consistent');

  // dry run changes nothing
  const dry = node(MOVE, '3.2', '3.3', '--dry-run');
  assert.strictEqual(dry.status, 0, dry.stderr);
  assert.strictEqual(sh('git', ['status', '--porcelain']).stdout, '', 'dry run leaves the tree clean');

  // real move: 3.2 -> 3.3 pushes 3.3 and 3.3.1 to 3.4 and 3.4.1
  const real = node(MOVE, '3.2', '3.3');
  assert.strictEqual(real.status, 0, real.stderr);
  const exists = (p) => fs.existsSync(path.join(tmp, p));
  assert.ok(exists('docs/3-demo/3.3-second.md'), 'moved section renamed');
  assert.ok(exists('docs/3-demo/3.4-third.md') && exists('docs/3-demo/3.4.1-third-deep.md'), 'neighbours renumbered');
  assert.ok(!exists('docs/3-demo/3.2-second.md'), 'old name gone');
  assert.ok(exists('src/quizzes/chapter-3/3.3/q.js') && exists('src/quizzes/chapter-3/3.4/q.js'), 'quiz folders follow');
  const read = (p) => fs.readFileSync(path.join(tmp, p), 'utf8');
  assert.ok(read('docs/3-demo/3.4-third.md').startsWith('---\ndocs/3-demo/3.4-third.md:'), 'front-matter key rewritten');
  assert.ok(read('docs/3-demo/3.4-third.md').includes('chapter-3/3.4/q.js'), 'quiz embed id rewritten');
  assert.ok(read('docs/_sidebar.md').includes('(3-demo/3.3-second.md)'), 'sidebar rewritten');
  const refs = node(REFS);
  assert.strictEqual(refs.status, 0, 'check-refs passes after the move:\n' + refs.stdout + refs.stderr);

  // check-refs catches a front-matter key that no longer matches its path
  const f = 'docs/3-demo/3.1-first.md';
  write(f, read(f).replace(`${f}:`, 'docs/3-demo/3.9-wrong.md:'));
  assert.strictEqual(node(REFS).status, 1, 'check-refs flags a mismatched key');
  console.log('all move tests passed');
} catch (e) {
  console.error(e);
  process.exitCode = 1;
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
