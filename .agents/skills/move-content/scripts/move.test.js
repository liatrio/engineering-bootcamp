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
const tmps = [];
let tmp;
const fresh = () => { tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'move-')); tmps.push(tmp); sh('git', ['init', '-q']); };
const commit = () => { sh('git', ['add', '-A']); sh('git', ['-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '-qm', 'fixture']); };
const exists = (p) => fs.existsSync(path.join(tmp, p));
const read = (p) => fs.readFileSync(path.join(tmp, p), 'utf8');
const sh = (cmd, args) => spawnSync(cmd, args, { cwd: tmp, encoding: 'utf8' });
const node = (script, ...args) => sh('node', [script, ...args]);
const write = (p, s) => { fs.mkdirSync(path.dirname(path.join(tmp, p)), { recursive: true }); fs.writeFileSync(path.join(tmp, p), s); };
const page = (file, title, body) =>
  write(file, `---\n${file}:\n  category: Demo\n  estReadingMinutes: 5\n---\n\n# ${title}\n\n${body}\n`);
const quiz = (id) => `<div class="quizdown">\n  <div id="chapter-3/${id}/q.js"></div>\n</div>`;

try {
  fresh();
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
  commit();
  assert.strictEqual(node(REFS).status, 0, 'fixture starts consistent');

  // dry run changes nothing
  const dry = node(MOVE, '3.2', '3.3', '--dry-run');
  assert.strictEqual(dry.status, 0, dry.stderr);
  assert.strictEqual(sh('git', ['status', '--porcelain']).stdout, '', 'dry run leaves the tree clean');

  // --insert: 3.2 -> 3.3 makes room, pushing 3.3 and 3.3.1 to 3.4 and 3.4.1 and leaving a gap at 3.2
  const real = node(MOVE, '3.2', '3.3', '--insert');
  assert.strictEqual(real.status, 0, real.stderr);
  assert.ok(exists('docs/3-demo/3.3-second.md'), 'moved section renamed');
  assert.ok(exists('docs/3-demo/3.4-third.md') && exists('docs/3-demo/3.4.1-third-deep.md'), 'neighbours renumbered');
  assert.ok(!exists('docs/3-demo/3.2-second.md'), 'old name gone');
  assert.ok(exists('src/quizzes/chapter-3/3.3/q.js') && exists('src/quizzes/chapter-3/3.4/q.js'), 'quiz folders follow');
  assert.ok(read('docs/3-demo/3.4-third.md').startsWith('---\ndocs/3-demo/3.4-third.md:'), 'front-matter key rewritten');
  assert.ok(read('docs/3-demo/3.4-third.md').includes('chapter-3/3.4/q.js'), 'quiz embed id rewritten');
  assert.ok(read('docs/_sidebar.md').includes('(3-demo/3.3-second.md)'), 'sidebar rewritten');
  const refs = node(REFS);
  assert.strictEqual(refs.status, 0, 'check-refs passes after the move:\n' + refs.stdout + refs.stderr);

  // check-refs catches a front-matter key that no longer matches its path
  const f = 'docs/3-demo/3.1-first.md';
  write(f, read(f).replace(`${f}:`, 'docs/3-demo/3.9-wrong.md:'));
  assert.strictEqual(node(REFS).status, 1, 'check-refs flags a mismatched key');

  // plain move down closes the gap: 3.2 -> 3.3 swaps with 3.3 (and 3.3.1 follows to 3.2.1)
  fresh();
  page('docs/3-demo/3.1-first.md', 'First', 'First.');
  page('docs/3-demo/3.2-second.md', 'Second', quiz('3.2'));
  page('docs/3-demo/3.3-third.md', 'Third', quiz('3.3'));
  page('docs/3-demo/3.3.1-third-deep.md', 'Third deep', 'Deep.');
  write('src/quizzes/chapter-3/3.2/q.js', 'x\n');
  write('src/quizzes/chapter-3/3.3/q.js', 'x\n');
  write('docs/_sidebar.md', '- **Chapter 3**\n\n- [3.1 - First](3-demo/3.1-first.md)\n- [3.2 - Second](3-demo/3.2-second.md)\n- [3.3 - Third](3-demo/3.3-third.md)\n  - [3.3.1 - Third deep](3-demo/3.3.1-third-deep.md)\n');
  commit();
  let r = node(MOVE, '3.2', '3.3');
  assert.strictEqual(r.status, 0, r.stderr);
  assert.ok(exists('docs/3-demo/3.2-third.md') && exists('docs/3-demo/3.2.1-third-deep.md') && exists('docs/3-demo/3.3-second.md'), 'moving down shifts siblings down');
  assert.ok(!exists('docs/3-demo/3.4-third.md'), 'no sibling pushed past NEW');
  assert.strictEqual(node(REFS).status, 0, 'check-refs ok after plain move down');

  // links: root-relative targets follow the move; :ignore / :class attrs and /docs/ prefixes survive;
  // a page-relative link in a moved page becomes docs-root-relative
  fresh();
  page('docs/3-demo/3.1-a.md', 'A', '[b](3-demo/3.2-b.md) [c](/docs/3-demo/3.2-b.md ":ignore") [d](3-demo/3.2-b.md#h ":class=btn") [e](3-demo/3.2-b.md \'t\')');
  page('docs/3-demo/3.2-b.md', 'B', '[a](3.1-a.md) [self](3-demo/3.1-a.md)');
  write('docs/_sidebar.md', '- **Chapter 3**\n\n- [3.1 - A](3-demo/3.1-a.md)\n- [3.2 - B](3-demo/3.2-b.md)\n');
  commit();
  r = node(MOVE, '3.2', '3.1');
  assert.strictEqual(r.status, 0, r.stderr);
  const a = read('docs/3-demo/3.2-a.md');
  assert.ok(a.includes('[b](3-demo/3.1-b.md)') && a.includes('[c](/docs/3-demo/3.1-b.md ":ignore")') && a.includes('3-demo/3.1-b.md#h ":class=btn"') && a.includes("3-demo/3.1-b.md 't'"), 'links rewritten, attrs kept:\n' + a);
  assert.ok(read('docs/3-demo/3.1-b.md').includes('[a](3-demo/3.2-a.md)'), 'page-relative link in a moved page rewritten to docs-root-relative');

  // cross-chapter move: the page's own image follows it into the new chapter's img/
  fresh();
  page('docs/2-one/2.1-a.md', 'A', '![p](img/pic.png) <img src="img/gone.png">');
  page('docs/2-one/2.2-keep.md', 'Keep', '![s](img/shared.png)');
  page('docs/3-two/3.1-x.md', 'X', 'x');
  page('docs/3-two/3.2-y.md', 'Y', '![s](../2-one/img/shared.png)');
  write('docs/2-one/img/pic.png', 'p'); write('docs/2-one/img/gone.png', 'g'); write('docs/2-one/img/shared.png', 's');
  write('docs/_sidebar.md', '- **Chapter 2**\n\n- [2.1 - A](2-one/2.1-a.md)\n- [2.2 - Keep](2-one/2.2-keep.md)\n\n- **Chapter 3**\n\n- [3.1 - X](3-two/3.1-x.md)\n- [3.2 - Y](3-two/3.2-y.md)\n');
  commit();
  r = node(MOVE, '2.1', '3.3');
  assert.strictEqual(r.status, 0, r.stderr);
  assert.ok(exists('docs/3-two/img/pic.png') && exists('docs/3-two/img/gone.png') && !exists('docs/2-one/img/pic.png'), 'sole-user images move with the page');
  assert.ok(read('docs/3-two/3.3-a.md').includes('![p](img/pic.png)'), 'image ref unchanged');

  // shared image is reported, not moved
  fresh();
  page('docs/2-one/2.1-a.md', 'A', '![p](img/pic.png)');
  page('docs/2-one/2.2-b.md', 'B', '![p](img/pic.png)');
  page('docs/3-two/3.1-x.md', 'X', 'x');
  write('docs/2-one/img/pic.png', 'p');
  write('docs/_sidebar.md', '- **Chapter 2**\n\n- [2.1 - A](2-one/2.1-a.md)\n- [2.2 - B](2-one/2.2-b.md)\n\n- **Chapter 3**\n\n- [3.1 - X](3-two/3.1-x.md)\n');
  commit();
  r = node(MOVE, '2.1', '3.2', '--dry-run');
  assert.ok(/WARNING: .*shares .*pic\.png/.test(r.stdout), 'shared image warned:\n' + r.stdout);

  // chapter move renames nested pages and the chapter folder (item: chapter-level insert)
  fresh();
  page('docs/2-aa/2.1-a.md', 'A', 'a');
  page('docs/3-bb/3.1-b.md', 'B', 'b');
  page('docs/3-bb/3.1.1-b-deep.md', 'Bd', 'bd');
  page('docs/4-cc/4.1-c.md', 'C', quiz('4.1').replace('chapter-3', 'chapter-4'));
  page('docs/4-cc/4.1.1-c-deep.md', 'Cd', 'cd');
  write('src/quizzes/chapter-4/4.1/q.js', 'x\n');
  write('docs/_sidebar.md', '- **Chapter 2**\n\n- [2.1 - A](2-aa/2.1-a.md)\n\n- **Chapter 3**\n\n- [3.1 - B](3-bb/3.1-b.md)\n  - [3.1.1 - Bd](3-bb/3.1.1-b-deep.md)\n\n- **Chapter 4**\n\n- [4.1 - C](4-cc/4.1-c.md)\n  - [4.1.1 - Cd](4-cc/4.1.1-c-deep.md)\n');
  commit();
  r = node(MOVE, '4', '2', '--insert');
  assert.strictEqual(r.status, 0, r.stderr);
  assert.ok(exists('docs/2-cc/2.1-c.md') && exists('docs/2-cc/2.1.1-c-deep.md') && exists('docs/3-aa/3.1-a.md') && exists('docs/4-bb/4.1.1-b-deep.md'), 'chapter renumber covers nested pages');
  assert.ok(exists('src/quizzes/chapter-2/2.1/q.js') && read('docs/2-cc/2.1-c.md').includes('chapter-2/2.1/q.js'), 'quiz follows chapter');
  const sb = read('docs/_sidebar.md');
  assert.ok(sb.indexOf('Chapter 2') < sb.indexOf('2-cc/2.1-c.md') && sb.indexOf('2-cc/2.1-c.md') < sb.indexOf('Chapter 3'), 'sidebar chapters in order');
  assert.strictEqual(node(REFS).status, 0, 'check-refs ok after chapter move');

  // exercise move accepts the "-" on its own line (STYLE.md template)
  fresh();
  write('docs/3-demo/3.1-a.md', '---\ndocs/3-demo/3.1-a.md:\n  category: Demo\n  estReadingMinutes: 5\n  exercises:\n    -\n      name: Hello EC2\n      estMinutes: 10\n      technologies:\n      - AWS\n    -\n      name: Other\n      estMinutes: 5\n---\n\n# A\n');
  page('docs/3-demo/3.2-b.md', 'B', 'b');
  write('docs/_sidebar.md', '- **Chapter 3**\n\n- [3.1 - A](3-demo/3.1-a.md)\n- [3.2 - B](3-demo/3.2-b.md)\n');
  commit();
  r = node(MOVE, '--exercise', 'Hello EC2', '3.1', '3.2');
  assert.strictEqual(r.status, 0, r.stderr + r.stdout);
  assert.ok(read('docs/3-demo/3.2-b.md').includes('name: Hello EC2') && !read('docs/3-demo/3.1-a.md').includes('Hello EC2') && read('docs/3-demo/3.1-a.md').includes('name: Other'), 'exercise block moved');

  // check-refs: path-boundary matching, docs/README.md exempt
  fresh();
  page('docs/3-demo/3.1-x-extended.md', 'E', 'mentions chapter-10/ and 3-demo/3.1-x-extended.md');
  page('docs/3-demo/3.2-y.md', 'Y', 'y');
  write('docs/README.md', 'old 3-demo/3.1-x.md\n');
  write('docs/_sidebar.md', '- **Chapter 3**\n\n- [3.1 - E](3-demo/3.1-x-extended.md)\n- [3.2 - Y](3-demo/3.2-y.md)\n');
  commit();
  r = node(REFS, '--old', '3-demo/3.1-x.md', '--old', 'chapter-1/');
  assert.ok(!/stale reference/.test(r.stderr), 'no false stale hits:\n' + r.stderr);
  r = node(REFS, '--old', '3-demo/3.1-x-extended.md');
  assert.ok(/stale reference/.test(r.stderr), 'real stale ref still found');
  console.log('all move tests passed');
} catch (e) {
  console.error(e);
  process.exitCode = 1;
} finally {
  for (const t of tmps) fs.rmSync(t, { recursive: true, force: true });
}
