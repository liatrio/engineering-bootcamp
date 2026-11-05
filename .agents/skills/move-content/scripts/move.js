#!/usr/bin/env node
'use strict';
/*
 * move.js <old> <new> [--dry-run]
 * move.js --exercise "<exercise name>" <old-section> <new-section> [--dry-run]
 *
 * <old>/<new> are numeric ids: a chapter (3), a section (3.2) or a sub-section (3.2.1).
 * Run from the repo root. Only Node built-ins plus git are used.
 * See ../SKILL.md. Does not commit and never touches docs/README.md.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = process.cwd();
const DOCS = 'docs';
const QUIZ = 'src/quizzes';
const SIDEBAR = 'docs/_sidebar.md';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const exIdx = args.indexOf('--exercise');
let exerciseName = null;
if (exIdx >= 0) { exerciseName = args[exIdx + 1]; args.splice(exIdx, 2); }
const pos = args.filter(a => !a.startsWith('--'));

function die(msg) { console.error(`error: ${msg}`); process.exit(1); }
if (pos.length !== 2) die('usage: move.js <old> <new> [--dry-run]  |  move.js --exercise "<name>" <old-section> <new-section> [--dry-run]');
const [OLD, NEW] = pos;
for (const id of [OLD, NEW]) if (!/^\d+(\.\d+){0,2}$/.test(id)) die(`"${id}" is not a chapter/section id like 3, 3.2 or 3.2.1`);

const git = (...a) => execFileSync('git', a, { cwd: ROOT, encoding: 'utf8' });
const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
const exists = p => fs.existsSync(path.join(ROOT, p));
const tracked = dir => git('ls-files', dir).split('\n').filter(Boolean);
const natCmp = (a, b) => a.localeCompare(b, undefined, { numeric: true });
function cmpId(a, b) {
  const x = a.split('.').map(Number), y = b.split('.').map(Number);
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    if (x[i] === undefined) return -1;
    if (y[i] === undefined) return 1;
    if (x[i] !== y[i]) return x[i] - y[i];
  }
  return 0;
}
const entryId = name => { const m = name.match(/^(\d+(?:\.\d+)*)(?=[-.])/); return m ? m[1] : null; };

// ---------------------------------------------------------------- exercise move
if (exerciseName !== null) {
  if (!exerciseName) die('--exercise needs a name');
  const findSection = id => tracked(DOCS).find(f => {
    const parts = f.split('/');
    return parts.length === 3 && parts[2].endsWith('.md') && parts[2].startsWith(id + '-') && /^\d+-/.test(parts[1]);
  });
  const src = findSection(OLD), dst = findSection(NEW);
  if (!src) die(`no section file for ${OLD}`);
  if (!dst) die(`no section file for ${NEW}`);
  if (src === dst) die('source and target are the same section');
  const fmEnd = ls => { let n = 0; for (let i = 0; i < ls.length; i++) if (ls[i] === '---' && ++n === 2) return i; return -1; };
  const srcLines = read(src).split('\n');
  const sEnd = fmEnd(srcLines);
  const esc = exerciseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const start = srcLines.findIndex((l, i) => i < sEnd && new RegExp(`^ {4}- name: ["']?${esc}["']?\\s*$`).test(l));
  if (start < 0) die(`exercise "${exerciseName}" not found in the front-matter of ${src}`);
  let end = start + 1;
  while (end < sEnd && (srcLines[end].trim() === '' || /^ {5,}/.test(srcLines[end]) || /^ {4}[^- ]/.test(srcLines[end]))) end++;
  const block = srcLines.slice(start, end);
  const newSrc = srcLines.slice();
  newSrc.splice(start, end - start);
  const exLine = newSrc.findIndex((l, i) => i < fmEnd(newSrc) && l === '  exercises:');
  if (exLine >= 0 && !/^ {4}- /.test(newSrc[exLine + 1] || '')) newSrc.splice(exLine, 1); // list is now empty
  const dstLines = read(dst).split('\n');
  const dEnd = fmEnd(dstLines);
  if (dEnd < 0) die(`${dst} has no front-matter`);
  const dEx = dstLines.findIndex((l, i) => i < dEnd && l === '  exercises:');
  const newDst = dstLines.slice();
  if (dEx < 0) newDst.splice(dEnd, 0, '  exercises:', ...block);
  else {
    let ins = dEx + 1;
    while (ins < dEnd && (/^ {4}/.test(newDst[ins]) || newDst[ins].trim() === '')) ins++;
    newDst.splice(ins, 0, ...block);
  }
  console.log(`${dryRun ? '[dry-run] ' : ''}exercise "${exerciseName}": ${src} -> ${dst}`);
  console.log('front-matter block moved:\n' + block.map(l => '  | ' + l).join('\n'));
  console.log('NOTE: only the front-matter entry moves. Move the exercise body text between the two pages by hand, then run check-refs.js and npm run refresh-front-matter.');
  if (!dryRun) {
    fs.writeFileSync(path.join(ROOT, src), newSrc.join('\n'));
    fs.writeFileSync(path.join(ROOT, dst), newDst.join('\n'));
  }
  process.exit(0);
}

// ---------------------------------------------------------------- node mappings
const docFiles = tracked(DOCS);
const folderByNum = {};
for (const f of docFiles) {
  const p = f.split('/');
  const m = p.length > 2 && p[1].match(/^(\d+)-/);
  if (m) folderByNum[m[1]] = p[1];
}
const idSet = new Set(Object.keys(folderByNum));
for (const f of docFiles) {
  const p = f.split('/');
  if (p.length < 3 || !/^\d+-/.test(p[1])) continue;
  const id = entryId(p[2]);
  if (!id) continue;
  const c = id.split('.');
  for (let i = 2; i <= c.length; i++) idSet.add(c.slice(0, i).join('.'));
}
const depth = id => id.split('.').length;
if (depth(OLD) !== depth(NEW)) die('old and new must be the same level (chapter, section or sub-section)');
if (OLD === NEW) die('old and new are the same');
if (NEW.startsWith(OLD + '.')) die('cannot move into itself');
if (!idSet.has(OLD)) die(`${OLD} does not exist under docs/`);
const parentOf = id => id.split('.').slice(0, -1).join('.');
const lastOf = id => Number(id.split('.').pop());
if (depth(OLD) > 1 && !idSet.has(parentOf(NEW))) die(`destination parent ${parentOf(NEW)} does not exist`);

const maps = [{ old: OLD, new: NEW, role: 'moved' }];
{
  // shift the contiguous run of occupied sibling slots starting at NEW (insert semantics)
  const par = parentOf(NEW);
  const mk = k => (par ? par + '.' : '') + k;
  let n = lastOf(NEW);
  while (idSet.has(mk(n)) && mk(n) !== OLD) {
    maps.push({ old: mk(n), new: mk(n + 1), role: 'renumbered neighbour' });
    n++;
  }
}
function mapId(id) {
  for (const m of maps) if (id === m.old || id.startsWith(m.old + '.')) return m.new + id.slice(m.old.length);
  return id;
}

// ---------------------------------------------------------------- docs file map
const fileMap = {}; // docs-relative old -> new
for (const f of docFiles) {
  const rel = f.slice(DOCS.length + 1);
  const parts = rel.split('/');
  const cm = parts[0].match(/^(\d+)-(.+)$/);
  if (!cm || parts.length < 2) continue;
  const c = cm[1];
  const id = entryId(parts[1]);
  const newId = id ? mapId(id) : null;
  const newChap = newId ? newId.split('.')[0] : mapId(c);
  let folder = parts[0];
  if (newChap !== c) {
    folder = maps.some(m => m.old === c) ? `${newChap}-${cm[2]}` : folderByNum[newChap];
    if (!folder) die(`destination chapter ${newChap} has no folder in docs/`);
  }
  const entry = id ? newId + parts[1].slice(id.length) : parts[1];
  const np = [folder, entry, ...parts.slice(2)].join('/');
  if (np !== rel) fileMap[rel] = np;
}
if (!Object.keys(fileMap).length) die('nothing to move');

// ---------------------------------------------------------------- quiz map
const quizMap = {}; // quiz-relative old -> new
for (const f of tracked(QUIZ)) {
  const rel = f.slice(QUIZ.length + 1);
  const parts = rel.split('/');
  const cm = parts[0].match(/^chapter-(\d+)$/);
  if (!cm) continue;
  const id = parts[1] && /^\d+(\.\d+)*$/.test(parts[1]) ? parts[1] : null;
  const newId = id ? mapId(id) : mapId(cm[1]);
  const np = [`chapter-${newId.split('.')[0]}`, ...(id ? [newId] : []), ...parts.slice(id ? 2 : 1)].join('/');
  if (np !== rel) quizMap[rel] = np;
}

// ---------------------------------------------------------------- ordered git mv plan
function orderMoves(pairs, prefix) {
  const pending = pairs.map(([a, b]) => ({ from: prefix + a, to: prefix + b })).sort((x, y) => natCmp(y.from, x.from));
  const occupied = new Set(pending.map(p => p.from));
  const vacated = new Set(); // sources already planned away; the disk still shows them as existing
  const out = [];
  let tmp = 0;
  while (pending.length) {
    const i = pending.findIndex(p => !occupied.has(p.to));
    if (i < 0) { // cycle: park the first one under a temporary name
      const p = pending[0];
      const t = `${p.from}.mvtmp${tmp++}`;
      out.push({ from: p.from, to: t });
      occupied.delete(p.from); occupied.add(t); vacated.add(p.from);
      p.from = t;
      continue;
    }
    const p = pending.splice(i, 1)[0];
    if (exists(p.to) && !occupied.has(p.to) && !vacated.has(p.to)) die(`destination already exists and is not part of the move: ${p.to}`);
    out.push(p);
    occupied.delete(p.from); occupied.add(p.to);
    vacated.add(p.from); vacated.delete(p.to);
  }
  return out;
}
const gitMoves = [
  ...orderMoves(Object.entries(fileMap), DOCS + '/'),
  ...orderMoves(Object.entries(quizMap), QUIZ + '/'),
];

// ---------------------------------------------------------------- text edits (computed from OLD paths)
const edits = []; // {file (new path), content, notes[]}

function relLink(fromNewRel, targetNewRel, style) {
  if (style.abs) return '/' + targetNewRel;
  let r = path.posix.relative(path.posix.dirname(fromNewRel), targetNewRel);
  if (style.dot && !r.startsWith('.')) r = './' + r;
  return r;
}

for (const f of docFiles.filter(f => f.endsWith('.md') && f !== SIDEBAR)) {
  const oldRel = f.slice(DOCS.length + 1);
  const newRel = fileMap[oldRel] || oldRel;
  const orig = read(f);
  const lines = orig.split('\n');
  const notes = [];
  if (fileMap[oldRel]) { // front-matter key: line-level replace, never re-serialise the YAML
    let n = 0;
    for (let i = 0; i < lines.length && n < 2; i++) {
      if (lines[i] === '---') { n++; continue; }
      if (n === 1 && lines[i] === `docs/${oldRel}:`) {
        lines[i] = `docs/${newRel}:`;
        notes.push(`front-matter key line ${i + 1}: docs/${oldRel}: -> docs/${newRel}:`);
      }
    }
  }
  for (let i = 0; i < lines.length; i++) {
    lines[i] = lines[i].replace(/(<div id=")([^"]+)(">)/g, (m, a, id, c) => {
      if (!quizMap[id]) return m;
      notes.push(`quiz embed line ${i + 1}: ${id} -> ${quizMap[id]}`);
      return a + quizMap[id] + c;
    });
    lines[i] = lines[i].replace(/\]\(([^)\s]+)((?:\s+"[^"]*")?)\)/g, (m, target, title) => {
      if (/^(https?:|mailto:|tel:|data:)/.test(target)) return m;
      let t = target, hashRoute = false;
      if (t.startsWith('#/')) { hashRoute = true; t = t.slice(1); } else if (t.startsWith('#')) return m;
      const si = t.search(/[?#]/);
      const base = si >= 0 ? t.slice(0, si) : t;
      const suffix = si >= 0 ? t.slice(si) : '';
      const abs = base.startsWith('/');
      const resolved = abs ? base.slice(1) : path.posix.normalize(path.posix.join(path.posix.dirname(oldRel), base));
      const hit = fileMap[resolved] ? resolved : (fileMap[resolved + '.md'] ? resolved + '.md' : null);
      if (!hit) return m;
      const targetNew = hit !== resolved ? fileMap[hit].replace(/\.md$/, '') : fileMap[hit];
      const out = hashRoute ? '#/' + targetNew : relLink(newRel, targetNew, { abs, dot: base.startsWith('./') });
      notes.push(`link line ${i + 1}: ${target} -> ${out + suffix}`);
      return `](${out}${suffix}${title})`;
    });
  }
  const content = lines.join('\n');
  if (content !== orig) edits.push({ file: DOCS + '/' + newRel, content, notes });
}

// ---------------------------------------------------------------- sidebar
function rewriteSidebar(text) {
  const notes = [];
  const touched = new Set();
  let lines = text.split('\n').map(l => {
    const h = l.match(/^(- \*\*Chapter )(\d+)(\*\*\s*)$/);
    if (h) {
      const n = mapId(h[2]);
      if (n !== h[2]) { touched.add(n); touched.add(h[2]); return `${h[1]}${n}${h[3]}`; }
      return l;
    }
    return l.replace(/^(\s*- \[)([^\]]*)(\]\()(\/?)([^)]+\.md)(\))/, (m, a, label, b, slash, p, c) => {
      if (!fileMap[p]) return m;
      const oid = entryId(p.split('/')[1] || '');
      const nid = oid ? mapId(oid) : null;
      if (oid) { touched.add(oid.split('.')[0]); touched.add(nid.split('.')[0]); }
      let nl = label;
      if (oid && label.startsWith(oid) && !/^[\d.]/.test(label.slice(oid.length))) nl = nid + label.slice(oid.length);
      return `${a}${nl}${b}${slash}${fileMap[p]}${c}`;
    });
  });
  const headIdx = lines.map((l, i) => (/^- \*\*(Chapter \d+|Addendum)\*\*\s*$/.test(l) ? i : -1)).filter(i => i >= 0);
  const pre = lines.slice(0, headIdx[0]);
  const blocks = headIdx.map((s, k) => ({ lines: lines.slice(s, k + 1 < headIdx.length ? headIdx[k + 1] : lines.length) }));
  const chapOf = b => { const m = b.lines[0].match(/Chapter (\d+)/); return m ? m[1] : null; };
  const entryRe = /^(\s*)- \[([^\]]*)\]\(\/?([^)]+\.md)\)/;
  const pool = [];
  for (const b of blocks) {
    const c = chapOf(b);
    if (!c || !touched.has(c)) continue;
    const body = b.lines.slice(1);
    if (body.some(l => l.trim() && !entryRe.test(l))) {
      notes.push(`WARNING: Chapter ${c} block has non-entry lines; left unsorted, check the order by hand`);
      continue;
    }
    b.lead = []; b.trail = [];
    let i = 0;
    while (i < body.length && !body[i].trim()) b.lead.push(body[i++]);
    let j = body.length;
    while (j > i && !body[j - 1].trim()) b.trail.unshift(body[--j]);
    b.entries = body.slice(i, j);
    for (const l of b.entries) {
      const m = l.match(entryRe);
      pool.push({ line: l, id: entryId(m[3].split('/')[1] || ''), indent: m[1], block: b });
    }
  }
  const placed = new Set();
  for (const b of blocks) {
    if (!b.entries) continue;
    const c = chapOf(b);
    const mine = pool.filter(e => e.id && e.id.split('.')[0] === c).sort((x, y) => cmpId(x.id, y.id));
    const noId = pool.filter(e => !e.id && e.block === b);
    b.entries = [...mine, ...noId].map(e => {
      if (!e.id) return e.line;
      const want = depth(e.id) - 2;
      return Math.round(e.indent.length / 2) === want ? e.line : '  '.repeat(want) + e.line.trimStart();
    });
    [...mine, ...noId].forEach(e => placed.add(e));
  }
  const lost = pool.filter(e => !placed.has(e));
  if (lost.length) notes.push(`WARNING: sidebar entries with no chapter block to live in: ${lost.map(e => e.id).join(', ')}`);
  if (maps.some(m => depth(m.old) === 1)) {
    const sorted = blocks.filter(chapOf).sort((a, b) => Number(chapOf(a)) - Number(chapOf(b)));
    let k = 0;
    for (let i = 0; i < blocks.length; i++) if (chapOf(blocks[i])) blocks[i] = sorted[k++];
  }
  const out = [...pre];
  for (const b of blocks) {
    out.push(b.lines[0]);
    if (b.entries) out.push(...b.lead, ...b.entries, ...b.trail); else out.push(...b.lines.slice(1));
  }
  return { content: out.join('\n'), notes };
}
{
  const orig = read(SIDEBAR);
  const r = rewriteSidebar(orig);
  if (r.content !== orig) edits.push({ file: SIDEBAR, content: r.content, notes: r.notes, sidebar: true, orig });
  else if (r.notes.length) console.error(r.notes.join('\n'));
}

// ---------------------------------------------------------------- report
console.log(`${dryRun ? 'PLAN (dry-run, nothing changed)' : 'PLAN'}: ${OLD} -> ${NEW}`);
console.log('\nNode renumbering (listed last to first):');
for (const m of maps.slice().sort((a, b) => cmpId(b.old, a.old))) console.log(`  ${m.old} -> ${m.new}   (${m.role})`);
console.log(`\ngit mv, in execution order (${gitMoves.length}):`);
for (const m of gitMoves) console.log(`  git mv ${m.from} ${m.to}`);
console.log('\nText edits:');
for (const e of edits) {
  if (e.sidebar) continue;
  console.log(`  ${e.file}`);
  for (const n of e.notes) console.log(`    ${n}`);
}
const sb = edits.find(e => e.sidebar);
if (sb) {
  console.log(`  ${SIDEBAR} (diff)`);
  const a = path.join(os.tmpdir(), `sb-old-${process.pid}`), b = a + '-new';
  fs.writeFileSync(a, sb.orig); fs.writeFileSync(b, sb.content);
  try { execFileSync('diff', ['-u', a, b], { encoding: 'utf8' }); } catch (e) { console.log((e.stdout || '').split('\n').slice(2).map(l => '    ' + l).join('\n')); }
  fs.unlinkSync(a); fs.unlinkSync(b);
  for (const n of sb.notes) console.log('    ' + n);
}
console.log('\nNot touched: docs/README.md (run npm run refresh-front-matter), examples/, img/ (check image filenames that carry chapter numbers by hand).');
if (dryRun) process.exit(0);

// ---------------------------------------------------------------- apply
for (const m of gitMoves) {
  fs.mkdirSync(path.join(ROOT, path.dirname(m.to)), { recursive: true });
  git('mv', m.from, m.to);
}
for (const m of gitMoves) { // drop emptied directories
  let d = path.dirname(m.from);
  while (d && d !== '.' && d !== DOCS && d !== 'src' && d !== QUIZ) {
    try { fs.rmdirSync(path.join(ROOT, d)); } catch (e) { break; }
    d = path.dirname(d);
  }
}
for (const e of edits) fs.writeFileSync(path.join(ROOT, e.file), e.content);
console.log('\nDone. Next: check-refs.js --old <old paths>, npm run refresh-front-matter, npm run compare-front-matter, npm run lint');
