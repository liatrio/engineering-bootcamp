'use strict';
// Offline test: node .agents/skills/dead-link-check/scripts/check-links.test.js
// Serves fixtures from a local http server; needs only node and curl.
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const assert = require('assert');
const { execFile } = require('child_process');
const { promisify } = require('util');
const execFileP = promisify(execFile);

const SCRIPT = path.join(__dirname, 'check-links.js');
const FIX = path.join(__dirname, 'fixtures');

const server = http.createServer((req, res) => {
  const u = req.url;
  const port = server.address().port;
  const send = (code, headers = {}) => { res.writeHead(code, headers); res.end('x'); };
  if (['/ok', '/wiki/Foo_(bar)', '/img.png', '/ref', '/html-href', '/new', '/bare', '/q?a=1&b=2'].includes(u)) return send(200);
  if (u === '/gone') return send(404);
  if (u === '/blocked') return send(403);
  if (u === '/found') return send(302, { Location: `/ok` });
  if (u.startsWith('/old/')) return send(301, { Location: `http://127.0.0.1:${port}/new` });
  if (u === '/slow') return setTimeout(() => send(200), 3000);
  return send(404);
});

// Async on purpose: a sync spawn would block this process's event loop and starve the test server.
async function run(cwd, args) {
  return (await execFileP('node', [SCRIPT, '--include-local', ...args], { cwd, encoding: 'utf8' })).stdout;
}

server.listen(0, '127.0.0.1', async () => {
  const port = server.address().port;
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'dlc-'));
  fs.cpSync(FIX, tmp, { recursive: true });
  for (const f of fs.readdirSync(path.join(tmp, 'docs'))) {
    // Fixtures ship as .md.tmpl so `npm run lint` does not scan their deliberate HTML and unused refs.
    const p = path.join(tmp, 'docs', f);
    fs.writeFileSync(p.replace(/\.tmpl$/, ''), fs.readFileSync(p, 'utf8').replace(/__PORT__/g, port));
    fs.rmSync(p);
  }
  fs.writeFileSync(path.join(tmp, 'docs', 'slow.md'), `[slow](http://127.0.0.1:${port}/slow)\n[tls](https://127.0.0.1:${port}/x)\n`);
  fs.writeFileSync(path.join(tmp, 'docs', 'extra.md'), `See http://127.0.0.1:${port}/bare.\n\n<a href="http://127.0.0.1:${port}/q?a=1&amp;b=2">q</a>\n`);
  const results = path.join(tmp, 'results.jsonl');
  try {
    const out = await run(tmp, ['docs', '--results', results, '--timeout', '1']);
    const rows = {};
    for (const l of out.split('\n').slice(1)) {
      if (!l || l.startsWith('#')) break;
      const c = l.split('\t');
      rows[c[0]] = { status: c[1], redirects: c[2], final: c[3], class: c[4], where: c[5] };
    }
    const at = (p) => rows[`http://127.0.0.1:${port}${p}`];
    assert.strictEqual(at('/ok').class, 'ok');
    assert.strictEqual(at('/wiki/Foo_(bar)').class, 'ok', 'parenthesised URL kept whole');
    assert.strictEqual(at('/wiki/Foo_(bar)').where, 'docs/page.md:8');
    assert.strictEqual(at('/gone').status, '404');
    assert.strictEqual(at('/gone').class, 'likely-dead');
    assert.strictEqual(at('/blocked').class, 'needs-browser-check');
    assert.strictEqual(at('/found').class, 'redirect');
    assert.strictEqual(at('/img.png').class, 'ok', 'image node extracted');
    assert.strictEqual(at('/ref').class, 'ok', 'definition node extracted');
    assert.strictEqual(at('/html-href').where, 'docs/page.md:17', 'raw html href extracted with line');
    assert.ok(!at('/never-extracted'), 'front-matter skipped');
    assert.ok(!at('/readme-should-be-skipped'), 'docs/README.md skipped');
    assert.strictEqual(rows['http://no-such-host.invalid/x'].status, 'dns');
    assert.strictEqual(rows['http://no-such-host.invalid/x'].class, 'likely-dead');
    assert.strictEqual(at('/slow').status, 'timeout');
    assert.strictEqual(rows[`https://127.0.0.1:${port}/x`].status, 'tls');
    assert.ok(/localhost -> 127\.0\.0\.1: 3 url\(s\) in 3 file\(s\)\s+\[migration-pattern\]/.test(out), 'migration pattern flagged');
    assert.ok(!/127\.0\.0\.1 -> 127\.0\.0\.1.*migration/.test(out), 'same-host redirect is not a migration');

    assert.strictEqual(at('/bare').class, 'ok', 'bare URL in prose extracted, trailing period trimmed');
    assert.strictEqual(at('/q?a=1&b=2').class, 'ok', 'HTML entities decoded in href');

    // resume: definitive results are skipped, timeouts and TLS errors are re-checked
    const count = (txt, p) => txt.split('\n').filter((l) => l.includes(`"url":"http://127.0.0.1:${port}${p}"`)).length;
    const before = fs.readFileSync(results, 'utf8');
    const second = await run(tmp, ['docs', '--results', results]);
    const after = fs.readFileSync(results, 'utf8');
    assert.strictEqual(count(after, '/gone'), count(before, '/gone'), 'definitive row not re-checked');
    assert.strictEqual(count(after, '/slow'), count(before, '/slow') + 1, 'timeout row re-checked');
    assert.ok(second.includes('/gone'));

    const m = require('./check-links.js');
    for (const h of ['127.0.0.1', '10.1.2.3', '172.16.0.1', '192.168.1.1', '169.254.169.254', '[::1]', 'localhost', 'fd00::1', 'fe80::1']) assert.ok(m.isPrivateHost(h), h);
    for (const h of ['8.8.8.8', '172.32.0.1', 'example.com', '1.2.3.4']) assert.ok(!m.isPrivateHost(h), h);
    assert.strictEqual(m.decodeEntities('a=1&amp;b=2&#38;c&#x26;d'), 'a=1&b=2&c&d');
    assert.strictEqual(m.trimBare('https://x.io/a_(b))'), 'https://x.io/a_(b)');
    assert.ok(!m.isDefinitive({ status: 'timeout' }) && !m.isDefinitive({ status: 'tls', class: 'needs-browser-check' }) && m.isDefinitive({ status: '404' }));

    // json + file arg scope
    const j = JSON.parse(await run(tmp, ['docs/mig-a.md', '--json']));
    assert.strictEqual(j.results.length, 1);
    assert.strictEqual(j.results[0].class, 'redirect');
    // local URLs are skipped unless --include-local is passed
    const { stdout: noLocal } = await execFileP('node', [SCRIPT, 'docs', '--json'], { cwd: tmp, encoding: 'utf8' });
    assert.ok(JSON.parse(noLocal).results.every((r) => !/127\.0\.0\.1|localhost/.test(r.url)), 'localhost URLs skipped by default');
    console.log('all check-links tests passed');
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  } finally {
    server.close();
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
