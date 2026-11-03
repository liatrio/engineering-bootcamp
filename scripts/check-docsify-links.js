#!/usr/bin/env node
// Checks internal links in docs/**/*.md the way Docsify resolves them.
//
// Docsify (index.html: basePath "/docs/", no relativePath) resolves every page
// link from the docs root, NOT from the current page. So a link written as
// `1.1.6-sizing.md` or `../2-version-control/2.0-overview.md` 404s on the site
// even though the file exists next to the page on disk.
//
// Rules enforced:
//   - Page links must be root-relative: `1-ways-of-working/1.1.6-sizing.md`.
//   - Heading anchors (`page.md#heading`, `#heading`) must match a heading slug,
//     computed with Docsify's own slugify rules.
//   - Links into the repo outside docs/ (e.g. examples/) must be full GitHub URLs.
//   - Images and other assets live in the chapter's img/ folder (`img/x.svg`), or
//     in the root img/ folder for site-wide assets (`../../img/x.svg`). Paths are
//     page-relative because Docsify resolves asset paths from the page's folder.
//     Root paths (`/img/x.svg`) only work on ':ignore' links.
//
// Usage: node scripts/check-docsify-links.js   (exits 1 on any problem)

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DOCS = path.join(ROOT, 'docs');
const REPO_TREE_URL = 'https://github.com/liatrio/engineering-bootcamp/tree/master/';
const ASSET = /\.(png|svg|webp|jpe?g|gif|pdf|ico)$/i;

function walk(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) return walk(p);
        return e.name.endsWith('.md') ? [p] : [];
    });
}

const stripCode = (text) => text.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');

// Mirrors slugify() in node_modules/docsify/lib/docsify.js.
const SLUG_STRIP = /[ -⁯⸀-⹿\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g;
function slugify(str) {
    return str
        .trim()
        .toLowerCase()
        .replace(/<[^>]+>/g, '')
        .replace(SLUG_STRIP, '')
        .replace(/\s/g, '-')
        .replace(/-+/g, '-')
        .replace(/^(\d)/, '_$1');
}

const slugCache = new Map();
function slugsFor(file) {
    if (slugCache.has(file)) return slugCache.get(file);
    const seen = {};
    const slugs = new Set();
    const text = fs.readFileSync(file, 'utf8').replace(/```[\s\S]*?```/g, '');
    for (const [, raw] of text.matchAll(/^#{1,6}\s+(.+?)\s*$/gm)) {
        const custom = raw.match(/:id=(\S+)/);
        let slug = custom ? custom[1] : slugify(raw);
        const count = slug in seen ? seen[slug] + 1 : 0;
        seen[slug] = count;
        if (count) slug = `${slug}-${count}`;
        slugs.add(slug);
    }
    slugCache.set(file, slugs);
    return slugs;
}

const problems = [];

// Images and other assets (pdf, svg...). Docsify prefixes any path without a
// protocol with the current page's folder, so `/img/x.svg` becomes
// `/docs/<chapter>/img/x.svg`. Assets must be page-relative: `img/x.svg`.
// Exception: links marked ':ignore' are served as written, from the site root.
function checkAsset(file, rel, href, ignored = false) {
    if (/^(https?:|data:|\/\/)/.test(href)) return;
    if (href.startsWith('/')) {
        if (ignored && fs.existsSync(path.join(ROOT, href))) return;
        const fix = path.relative(path.dirname(file), path.join(ROOT, href));
        problems.push(`${rel}: "${href}" — Docsify resolves asset paths from the page's folder, use "${fix}"`);
        return;
    }
    const resolved = path.join(path.dirname(file), href);
    if (!fs.existsSync(resolved)) {
        const inImg = path.join(path.dirname(file), 'img', path.basename(href));
        const hint = fs.existsSync(inImg) ? `, use "${path.relative(path.dirname(file), inImg)}"` : '';
        problems.push(`${rel}: missing asset "${href}"${hint}`);
    } else if (path.basename(path.dirname(resolved)) !== 'img') {
        problems.push(`${rel}: asset "${href}" is not in an img/ folder — move it to the chapter's img/ folder`);
    }
}

for (const file of walk(DOCS)) {
    const relFile = path.relative(ROOT, file);
    const raw = stripCode(fs.readFileSync(file, 'utf8'));
    for (const [, src] of raw.matchAll(/<img[^>]*\ssrc=["']([^"']+)["']/g)) checkAsset(file, relFile, src);
}

for (const file of walk(DOCS)) {
    const rel = path.relative(ROOT, file);
    const text = stripCode(fs.readFileSync(file, 'utf8'));
    for (const [, href, rest] of text.matchAll(/\]\(\s*<?([^)\s>'"]+)([^)]*)\)/g)) {
        if (/^(https?:|mailto:|\/\/)/.test(href)) continue;
        const [target, anchor] = href.split('#');
        const page = target.split('?')[0];
        if (ASSET.test(page)) {
            checkAsset(file, rel, page, rest.includes(':ignore'));
            continue;
        }

        let resolved = file;
        if (page) {
            resolved = path.normalize(path.join(DOCS, page.replace(/^\//, '')));
            if (resolved !== DOCS && !resolved.startsWith(DOCS + path.sep)) {
                problems.push(`${rel}: "${href}" points outside docs/ — use a full GitHub URL (${REPO_TREE_URL}...)`);
                continue;
            }
            if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
                resolved = path.join(resolved, 'README.md');
            } else if (!resolved.endsWith('.md')) {
                resolved += '.md';
            }
            if (!fs.existsSync(resolved)) {
                const local = path.join(path.dirname(file), page);
                const repoPath = path.join(ROOT, page.replace(/^\//, ''));
                let hint = '';
                if (fs.existsSync(local)) {
                    hint = ` — links resolve from docs/, use "${path.relative(DOCS, local)}"`;
                } else if (fs.existsSync(repoPath)) {
                    hint = ` — not under docs/, use ${REPO_TREE_URL}${path.relative(ROOT, repoPath)}`;
                }
                problems.push(`${rel}: dead link "${href}"${hint}`);
                continue;
            }
        }
        if (anchor && !slugsFor(resolved).has(anchor)) {
            problems.push(`${rel}: no heading for anchor "#${anchor}" in ${path.relative(ROOT, resolved)}`);
        }
    }
}

if (problems.length) {
    console.error(problems.join('\n'));
    console.error(`\n\x1b[31m${problems.length} broken Docsify link(s).\x1b[0m`);
    process.exit(1);
}
console.log('\x1b[32mAll Docsify links resolve.\x1b[0m');
