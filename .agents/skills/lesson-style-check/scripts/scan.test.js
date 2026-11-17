#!/usr/bin/env node
'use strict';
// Fixture test for scan.js. Run from the repo root:
//   node .agents/skills/lesson-style-check/scripts/scan.test.js
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const SCRIPT = path.join(__dirname, 'scan.js');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'scan-'));
const file = path.join(tmp, 'section.md');
fs.writeFileSync(file, [
  '---',
  'category: X',
  '---',
  '### Some Title Case Heading',
  '',
  '**Pods are the smallest unit.** More text.',
  '',
  '**Where is the data?** A bold question is not a lead-in sentence.',
  '',
  'The build is fast — usually under a minute.',
  '',
  '```sh',
  'ls --all — not prose',
  '```',
  '',
  'Use `--flag` here, it is genuinely useful.',
  '',
].join('\n'));

const run = (...args) => spawnSync('node', [SCRIPT, ...args], { encoding: 'utf8' });
try {
  const r = run(file);
  assert.strictEqual(r.status, 0);
  const lines = r.stdout.trim().split('\n').map((l) => l.split(':').slice(-4, -1).join(':'));
  const has = (line, pattern) => r.stdout.split('\n').some((l) => l.includes(`:${line}:${pattern}:`));
  assert.ok(has(6, 1), 'bold lead-in sentence (trailing period) reported');
  assert.ok(!r.stdout.split('\n').some((l) => l.includes(':8:1:')), 'bold question is not a lead-in');
  assert.ok(has(10, 4), 'prose em dash reported');
  assert.ok(!r.stdout.split('\n').some((l) => /:(12|13|14):4:/.test(l)), 'code fence dash ignored');
  assert.ok(has(16, 13), 'hollow intensifier reported');
  assert.ok(!r.stdout.split('\n').some((l) => l.includes(':4:6:')), 'Title Case advisory is off by default');
  assert.ok(run('--headings', file).stdout.split('\n').some((l) => l.includes(':4:6:advisory')), '--headings enables it');
  assert.strictEqual(lines.length > 0, true);
  const missing = run(path.join(tmp, 'nope.md'));
  assert.strictEqual(missing.status, 0, 'missing file is skipped, not a crash');
  console.log('all scan tests passed');
} catch (e) {
  console.error(e);
  process.exitCode = 1;
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
