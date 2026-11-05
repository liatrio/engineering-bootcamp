#!/usr/bin/env node
'use strict';
/*
 * check-refs.js [--old <path>]...
 * Run from the repo root. Exit 1 if any check fails.
 *  (a) every quizdown embed id in docs/ resolves to a file under src/quizzes/
 *  (b) every sidebar-linked section has a front-matter key equal to its own path
 *  (c) with --old, no docs/ or src/ file still mentions that old path (file:line)
 * Sidebar-target existence and README sync are left to npm run compare-front-matter.
 */
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const olds = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--old') {
    if (!args[i + 1]) { console.error('--old needs a value'); process.exit(2); }
    olds.push(args[++i]);
  } else {
    console.error('usage: check-refs.js [--old <path>]...');
    process.exit(2);
  }
}

const problems = [];
const walk = (dir, out = []) => {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === '.git') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
};
const docsMd = walk('docs').filter(f => f.endsWith('.md'));

// (a) quizdown embeds
for (const f of docsMd) {
  const lines = fs.readFileSync(f, 'utf8').split('\n');
  lines.forEach((l, i) => {
    if (!/<div class="quizdown">/.test(l) && !(i > 0 && /<div class="quizdown">/.test(lines[i - 1]))) return;
    const m = l.match(/<div id="([^"]+)"/);
    if (m && !fs.existsSync(path.join('src/quizzes', m[1]))) {
      problems.push(`${f}:${i + 1}: quiz embed id "${m[1]}" has no file under src/quizzes/`);
    }
  });
}

// (b) front-matter key == own path
const sidebar = fs.readFileSync('docs/_sidebar.md', 'utf8');
const links = (sidebar.match(/\([^)]+\.md\)/g) || []).map(s => s.slice(1, -1)).filter(s => !s.startsWith('addendum'));
for (const link of links) {
  const rel = path.posix.normalize(link.replace(/^\//, ''));
  const file = path.join('docs', rel);
  if (!fs.existsSync(file)) continue; // compare-front-matter reports missing targets
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  if (lines[0] !== '---') continue; // many sections have no front-matter; nothing to check
  const end = lines.indexOf('---', 1);
  const keys = [];
  for (let i = 1; i < end; i++) if (/^\S.*:\s*$/.test(lines[i])) keys.push({ k: lines[i].replace(/:\s*$/, ''), line: i + 1 });
  const own = `docs/${rel}`;
  if (!keys.some(x => x.k === own)) {
    const found = keys.length ? `"${keys.map(x => x.k).join(', ')}"` : 'missing';
    problems.push(`${file}:${keys.length ? keys[0].line : 1}: front-matter key is ${found}, expected "${own}"`);
  }
}

// (c) stale references
if (olds.length) {
  const files = [...walk('docs'), ...walk('src')].filter(f => /\.(md|js|json|html|ya?ml|css)$/.test(f));
  for (const f of files) {
    const lines = fs.readFileSync(f, 'utf8').split('\n');
    lines.forEach((l, i) => {
      for (const old of olds) {
        const variants = [old, old.replace(/\.md$/, '')];
        if (variants.some(v => v && l.includes(v))) problems.push(`${f}:${i + 1}: stale reference to "${old}"`);
      }
    });
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  console.error(`\n${problems.length} problem(s)`);
  process.exit(1);
}
console.log('check-refs: ok');
