#!/usr/bin/env node
'use strict';
/*
 * check-links.js - deterministic external-link audit for the bootcamp docs.
 * Run from the repo root. Read-only: never edits docs. Output is a LEAD for the
 * agent (see SKILL.md), not a verdict.
 *
 *   node .agents/skills/dead-link-check/scripts/check-links.js [paths...] [options]
 *
 * paths            files or directories (default: docs). Use docs/N-* for one chapter.
 * --examples       also scan examples/ (off by default)
 * --include-local  also check localhost/127.0.0.1/::1 URLs (skipped by default: they are
 *                  tutorial targets that are only reachable while a demo is running)
 * --results FILE   JSONL results file; URLs already recorded in it are skipped (resume)
 * --concurrency N  parallel curl processes (default 8)
 * --timeout S      curl --max-time seconds (default 10)
 * --json           emit JSON instead of TSV + summary
 */
const fs = require('fs');
const path = require('path');
const net = require('net');
const { spawn } = require('child_process');

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const MIGRATION_MIN_FILES = 3;

function parseArgs(argv) {
  const o = { paths: [], examples: false, includeLocal: false, results: null, concurrency: 8, timeout: 10, json: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--examples') o.examples = true;
    else if (a === '--include-local') o.includeLocal = true;
    else if (a === '--json') o.json = true;
    else if (a === '--results') o.results = argv[++i];
    else if (a === '--concurrency') o.concurrency = Math.max(1, parseInt(argv[++i], 10));
    else if (a === '--timeout') o.timeout = Math.max(1, parseInt(argv[++i], 10));
    else if (a.startsWith('--')) { console.error(`unknown option ${a}`); process.exit(2); }
    else o.paths.push(a);
  }
  if (!o.paths.length) o.paths.push('docs');
  if (o.examples) o.paths.push('examples');
  return o;
}

function walk(p, out) {
  const st = fs.statSync(p);
  if (st.isDirectory()) {
    for (const e of fs.readdirSync(p).sort()) {
      if (e === 'node_modules' || e === '.git') continue;
      walk(path.join(p, e), out);
    }
  } else if (p.endsWith('.md')) out.push(p);
}

function collectFiles(paths) {
  const out = [];
  for (const p of paths) {
    if (!fs.existsSync(p)) { console.error(`path not found: ${p}`); process.exit(2); }
    walk(p, out);
  }
  const readme = path.resolve('docs', 'README.md');
  return [...new Set(out.map((f) => path.normalize(f)))].filter((f) => path.resolve(f) !== readme);
}

// Blank out front-matter but keep its newlines so line numbers stay true.
function stripFrontMatter(src) {
  const m = /^---\r?\n[\s\S]*?\r?\n---[ \t]*(\r?\n|$)/.exec(src);
  return m ? m[0].replace(/[^\n]/g, '') + src.slice(m[0].length) : src;
}

const isHttp = (u) => /^https?:\/\//i.test(u);
const PRIVATE_RANGES = new net.BlockList();
for (const [addr, bits] of [['0.0.0.0', 8], ['10.0.0.0', 8], ['127.0.0.0', 8], ['169.254.0.0', 16], ['172.16.0.0', 12], ['192.168.0.0', 16]]) PRIVATE_RANGES.addSubnet(addr, bits, 'ipv4');
for (const [addr, bits] of [['::', 128], ['::1', 128], ['fc00::', 7], ['fe80::', 10]]) PRIVATE_RANGES.addSubnet(addr, bits, 'ipv6');

// Hostnames that merely resolve to private addresses are not detected.
function isPrivateHost(host) {
  const h = host.replace(/^\[|\]$/g, '').toLowerCase();
  const family = net.isIP(h);
  return h === 'localhost' || (family !== 0 && PRIVATE_RANGES.check(h, family === 4 ? 'ipv4' : 'ipv6'));
}
const isLocal = (u) => { try { return isPrivateHost(new URL(u).hostname); } catch (e) { return false; } };

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };
const decodeEntities = (s) => s.replace(/&(?:#x([0-9a-f]+)|#(\d+)|(amp|lt|gt|quot|apos));/gi, (_, hex, dec, name) =>
  name ? ENTITIES[name.toLowerCase()] : String.fromCodePoint(parseInt(hex || dec, hex ? 16 : 10)));
const BARE_URL = /https?:\/\/[^\s<>"'\]]+/g;
// GFM autolink literal rules: trailing punctuation and an unbalanced ")" are not part of the URL.
function trimBare(u) {
  for (;;) {
    const t = u.replace(/[?!.,:;*_~'"]+$/, '');
    if (t.endsWith(')') && (t.match(/\)/g) || []).length > (t.match(/\(/g) || []).length) { u = t.slice(0, -1); continue; }
    if (t === u) return u;
    u = t;
  }
}

// Depth-first walk over an mdast tree; avoids a direct dependency on unist-util-visit.
function walkTree(node, fn, inLink = false) {
  fn(node, inLink);
  const link = inLink || node.type === 'link';
  for (const child of node.children || []) walkTree(child, fn, link);
}
const HTML_ATTR = /\b(?:href|src)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/gi;

async function extract(files, includeLocal) {
  let remark;
  try { ({ remark } = await import('remark')); } catch (e) {
    process.stderr.write('check-links.js: missing dependency remark; run npm install from the repo root\n');
    process.exit(2);
  }
  const processor = remark();
  const uses = [];
  for (const file of files) {
    const src = stripFrontMatter(fs.readFileSync(file, 'utf8'));
    const tree = processor.parse(src);
    walkTree(tree, (node, inLink) => {
      const line = node.position && node.position.start.line;
      if (node.type === 'text' && !inLink) {
        let m;
        BARE_URL.lastIndex = 0;
        while ((m = BARE_URL.exec(node.value))) {
          const u = trimBare(m[0]);
          if (isHttp(u) && (includeLocal || !isLocal(u))) uses.push({ url: u, file, line: line + node.value.slice(0, m.index).split('\n').length - 1 });
        }
      } else if (['link', 'definition', 'image'].includes(node.type)) {
        if (node.url && isHttp(node.url) && (includeLocal || !isLocal(node.url))) uses.push({ url: node.url, file, line });
      } else if (node.type === 'html') {
        let m;
        HTML_ATTR.lastIndex = 0;
        while ((m = HTML_ATTR.exec(node.value))) {
          const u = decodeEntities(m[1] || m[2] || m[3] || '').trim();
          if (!isHttp(u) || (!includeLocal && isLocal(u))) continue;
          const extra = node.value.slice(0, m.index).split('\n').length - 1;
          uses.push({ url: u, file, line: line + extra });
        }
      }
    });
  }
  return uses;
}

const MAX_REDIRS = 10;

// Follows redirects by hand (not curl -L) so a redirect into a private, loopback or
// link-local IP literal is refused before it is requested.
async function runCurl(url, timeout) {
  let cur = url;
  for (let hops = 0; ; hops++) {
    const r = await curlOnce(cur, timeout);
    if (r.exit !== 0) return { exit: r.exit, out: '' };
    const [code, next] = [r.out.split(' ')[0], r.out.split(' ').slice(1).join(' ')];
    if (!/^3\d\d$/.test(code) || !next) return { exit: 0, out: `${code} ${hops} ${cur}` };
    if (isLocal(next) && !isLocal(url)) return { exit: 0, out: `blocked ${hops + 1} ${next}` };
    if (hops + 1 > MAX_REDIRS) return { exit: 47, out: '' };
    cur = next;
  }
}

function curlOnce(url, timeout) {
  return new Promise((resolve) => {
    const args = ['-s', '-o', '/dev/null', '-w', '%{http_code} %{redirect_url}\n',
      '-A', UA, '--max-time', String(timeout), '--noproxy', '127.0.0.1,localhost', '--', url];
    const p = spawn('curl', args);
    let out = '';
    p.stdout.on('data', (d) => (out += d));
    p.on('error', () => resolve({ exit: -1, out: '' }));
    p.on('close', (code) => resolve({ exit: code, out: out.trim() }));
  });
}

function hostOf(u) { try { return new URL(u).hostname; } catch (e) { return ''; } }

function classify(url, exit, out) {
  const [code = '000', redirects = '0', ...rest] = out.split(' ');
  const finalUrl = rest.join(' ') || url;
  if (code === 'blocked') return { url, exit, code: 0, redirects: parseInt(redirects, 10) || 0, final: finalUrl, status: 'blocked-redirect', class: 'needs-browser-check' };
  const r = { url, exit, code: parseInt(code, 10) || 0, redirects: parseInt(redirects, 10) || 0, final: finalUrl };
  if (exit === 6) { r.status = 'dns'; r.class = 'likely-dead'; }
  else if (exit === 51) { r.status = 'tls'; r.class = 'likely-dead'; } // cert issued for a different host
  else if (exit === 35 || exit === 60) { r.status = 'tls'; r.class = 'needs-browser-check'; } // may be a TLS-intercepting proxy
  else if (exit === 47) { r.status = 'error'; r.class = 'needs-browser-check'; } // too many redirects
  else if (exit === 28) { r.status = 'timeout'; r.class = 'needs-browser-check'; }
  else if (exit !== 0) { r.status = 'error'; r.class = 'needs-browser-check'; }
  else {
    r.status = String(r.code);
    if (r.code === 404 || r.code === 410) r.class = 'likely-dead';
    else if (r.code >= 200 && r.code < 300) r.class = r.redirects > 0 ? 'redirect' : 'ok';
    else if (r.code >= 300 && r.code < 400) r.class = 'redirect';
    else r.class = 'needs-browser-check'; // 403/503 and any other 4xx/5xx
  }
  return r;
}

async function pool(items, n, fn) {
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) await fn(items[i++]);
  }));
}

function loadResults(file) {
  const map = new Map();
  if (file && fs.existsSync(file)) {
    for (const l of fs.readFileSync(file, 'utf8').split('\n')) {
      if (!l.trim()) continue;
      try { const r = JSON.parse(l); map.set(r.url, r); } catch (e) { /* partial line from an interrupted run */ }
    }
  }
  return map;
}

// Timeouts, connection errors and possible interception are transient; re-check them on resume.
const isDefinitive = (r) => r.status !== 'timeout' && r.status !== 'error' && !(r.status === 'tls' && r.class === 'needs-browser-check');

function summarize(rows) {
  const groups = new Map();
  for (const r of rows.filter((x) => x.class === 'redirect')) {
    const from = hostOf(r.url), to = hostOf(r.final);
    const key = `${from} -> ${to}`;
    const g = groups.get(key) || { urls: 0, files: new Set(), sameHost: from === to };
    g.urls++;
    r.uses.forEach((u) => g.files.add(u.file));
    groups.set(key, g);
  }
  const redirectGroups = [...groups.entries()].map(([key, g]) => ({
    key, urls: g.urls, files: g.files.size, sameHost: g.sameHost,
    flag: !g.sameHost && g.files.size >= MIGRATION_MIN_FILES ? 'migration-pattern' : '',
  }));
  const counts = {};
  for (const r of rows) counts[r.class] = (counts[r.class] || 0) + 1;
  return { counts, redirectGroups };
}

async function main() {
  const o = parseArgs(process.argv.slice(2));
  const files = collectFiles(o.paths);
  const uses = await extract(files, o.includeLocal);
  const byUrl = new Map();
  for (const u of uses) {
    if (!byUrl.has(u.url)) byUrl.set(u.url, []);
    byUrl.get(u.url).push({ file: u.file, line: u.line });
  }
  const done = loadResults(o.results);
  const todo = [...byUrl.keys()].filter((u) => !done.has(u) || !isDefinitive(done.get(u)));
  console.error(`files=${files.length} urls=${byUrl.size} already-recorded=${byUrl.size - todo.length} to-check=${todo.length}`);
  await pool(todo, o.concurrency, async (url) => {
    const { exit, out } = await runCurl(url, o.timeout);
    const r = classify(url, exit, out);
    done.set(url, r);
    if (o.results) fs.appendFileSync(o.results, JSON.stringify(r) + '\n');
  });
  const rows = [...byUrl.keys()].sort().map((url) => ({ ...done.get(url), uses: byUrl.get(url) }));
  const summary = summarize(rows);
  const fl = (r) => r.uses.map((u) => `${u.file}:${u.line}`).join(',');
  if (o.json) {
    const results = rows.map((r) => ({ url: r.url, status: r.status, redirects: r.redirects, final_url: r.final, class: r.class, uses: r.uses }));
    console.log(JSON.stringify({ results, summary }, null, 2));
    return;
  }
  console.log('url\tstatus\tredirects\tfinal_url\tclass\tfiles:lines');
  for (const r of rows) console.log([r.url, r.status, r.redirects, r.final, r.class, fl(r)].join('\t'));
  console.log('\n# summary (leads, not verdicts)');
  for (const c of ['likely-dead', 'needs-browser-check', 'redirect', 'ok']) {
    const list = rows.filter((r) => r.class === c);
    console.log(`## ${c}: ${list.length}`);
    for (const r of list) console.log(`  ${r.status}\t${r.url}${c === 'redirect' ? ' -> ' + r.final : ''}\t${fl(r)}`);
  }
  if (summary.redirectGroups.length) {
    console.log('## redirects by host');
    for (const g of summary.redirectGroups) {
      console.log(`  ${g.key}: ${g.urls} url(s) in ${g.files} file(s)${g.sameHost ? ' (same host, e.g. http->https)' : ''}${g.flag ? '  [' + g.flag + ']' : ''}`);
    }
  }
}

module.exports = { isPrivateHost, decodeEntities, trimBare, isDefinitive };
if (require.main === module) main().catch((e) => { console.error(e); process.exit(2); });
