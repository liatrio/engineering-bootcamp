#!/usr/bin/env node
// Checks internal links in docs/**/*.md the way Docsify resolves them.
//
// Docsify (index.html: basePath "/docs/", no relativePath) resolves every page
// link from the docs root, NOT from the current page. So a link written as
// `<section>.md` or `../<chapter>/<section>.md` 404s on the site even though
// the file exists next to the page on disk.
//
// Rules enforced:
//   - Page links must be root-relative: `<chapter>/<section>.md`.
//   - Heading anchors (`page.md#heading`, `#heading`, `page?id=heading`) must match
//     a heading slug, computed with Docsify's own slugify rules.
//   - Inline links and reference-style definitions (`[label]: page.md`) are checked;
//     fenced code blocks (backtick or tilde) and inline code are skipped.
//   - Links into the repo outside docs/ (e.g. examples/) must be full GitHub URLs.
//   - Images and other assets live in the page's own chapter img/ folder
//     (`img/<descriptive_image_name>.svg`), or in the root img/ folder when several
//     chapters use them (`../../img/<descriptive_image_name>.svg`). Another chapter's
//     img/ folder is rejected. Paths are page-relative because Docsify resolves
//     asset paths from the page's folder.
//   - Local files are only embedded as images (`![alt](img/...)`). A plain link to
//     one (`[report](img/x.pdf)`) is routed by Docsify as a page and 404s, so link
//     to a public URL instead.
//
// Usage: node .husky/check-docsify-links.js   (exits 1 on any problem)

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

// Blanks fenced code blocks. A fence opens with 3+ backticks or tildes and only
// closes on a fence of the same character that is at least as long (CommonMark).
function stripFences(text) {
    let open = null;
    return text
        .split('\n')
        .map((line) => {
            const m = line.match(/^ {0,3}(`{3,}|~{3,})/);
            if (!open) {
                if (m) open = m[1];
                return m ? '' : line;
            }
            if (m && m[1][0] === open[0] && m[1].length >= open.length && !line.slice(m[0].length).trim()) open = null;
            return '';
        })
        .join('\n');
}
const stripCode = (text) => stripFences(text).replace(/`[^`\n]*`/g, '');

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
    const text = stripFences(fs.readFileSync(file, 'utf8'));
    for (const [, raw] of text.matchAll(/^#{1,6}\s+(.+?)\s*$/gm)) {
        const custom = raw.match(/:id=(\S+)/);
        // Docsify slugs the rendered heading, so a link contributes only its text.
        const plain = raw.replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1');
        let slug = custom ? custom[1] : slugify(plain);
        const count = slug in seen ? seen[slug] + 1 : 0;
        seen[slug] = count;
        if (count) slug = `${slug}-${count}`;
        slugs.add(slug);
    }
    slugCache.set(file, slugs);
    return slugs;
}

const problems = [];

// Returns the suggestion for the first candidate path that exists, or ''.
// Each candidate is [path, (path) => suggestion].
function hint(candidates) {
    const hit = candidates.find(([p]) => fs.existsSync(p));
    return hit ? hit[1](hit[0]) : '';
}

// Images and other assets (pdf, svg...). Docsify prefixes any path without a
// protocol with the current page's folder, so `/img/<name>.svg` becomes
// `/docs/<chapter>/img/<name>.svg`. Assets must be page-relative: `img/<name>.svg`.
function checkAsset(file, rel, href) {
    if (/^(https?:|data:|\/\/)/.test(href)) return;
    const dir = path.dirname(file);
    if (href.startsWith('/')) {
        const fix = path.relative(dir, path.join(ROOT, href));
        problems.push(`${rel}: "${href}" — Docsify resolves asset paths from the page's folder, use "${fix}"`);
        return;
    }
    const resolved = path.join(dir, href);
    if (!fs.existsSync(resolved)) {
        const fix = hint([[path.join(dir, 'img', path.basename(href)), (p) => `, use "${path.relative(dir, p)}"`]]);
        problems.push(`${rel}: missing asset "${href}"${fix}`);
    } else if (![path.join(dir, 'img'), path.join(ROOT, 'img')].includes(path.dirname(resolved))) {
        problems.push(
            `${rel}: asset "${href}" is not in this chapter's img/ folder or the root img/ — ` +
                `move it to this chapter's img/, or to the root img/ if several chapters use it`,
        );
    }
}

// Page links, resolved from the docs root the way Docsify does.
function checkPage(file, rel, href) {
    if (href.startsWith('#/')) {
        const [route, query = ''] = href.slice(2).split('?');
        const id = new URLSearchParams(query).get('id');
        const fix = `${route.replace(/\.md$/, '')}.md${id ? `#${id}` : ''}`;
        problems.push(`${rel}: "${href}" is a Docsify hash link — write the path from docs/ instead: "${fix}"`);
        return;
    }
    const [target, hashAnchor] = href.split('#');
    const [page, query = ''] = target.split('?');
    // Docsify writes heading links as `page?id=slug`; treat id like a #anchor.
    const anchor = hashAnchor || new URLSearchParams(query).get('id');

    let resolved = file;
    if (page) {
        resolved = path.normalize(path.join(DOCS, page.replace(/^\//, '')));
        if (resolved !== DOCS && !resolved.startsWith(DOCS + path.sep)) {
            problems.push(`${rel}: "${href}" points outside docs/ — use a full GitHub URL (${REPO_TREE_URL}...)`);
            return;
        }
        if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
            resolved = path.join(resolved, 'README.md');
        } else if (!resolved.endsWith('.md')) {
            resolved += '.md';
        }
        if (!fs.existsSync(resolved)) {
            const fix = hint([
                [path.join(path.dirname(file), page), (p) => ` — links resolve from docs/, use "${path.relative(DOCS, p)}"`],
                [path.join(ROOT, page.replace(/^\//, '')), (p) => ` — not under docs/, use ${REPO_TREE_URL}${path.relative(ROOT, p)}`],
            ]);
            problems.push(`${rel}: dead link "${href}"${fix}`);
            return;
        }
    }
    if (anchor && !slugsFor(resolved).has(anchor)) {
        problems.push(`${rel}: no heading for anchor "#${anchor}" in ${path.relative(ROOT, resolved)}`);
    }
}

for (const file of walk(DOCS)) {
    const rel = path.relative(ROOT, file);
    const text = stripCode(fs.readFileSync(file, 'utf8'));

    for (const [, src] of text.matchAll(/<img[^>]*\ssrc=["']([^"']+)["']/g)) checkAsset(file, rel, src);

    const links = [
        // inline: [text](href 'title') or ![alt](src 'title'); group 1 is the "!" of an image
        ...text.matchAll(/(!?)\[[^\]]*\]\(\s*<?([^)\s>'"]+)[^)]*\)/g),
        // reference definition: [label]: href. It may back an image (![alt][label]),
        // so it is checked as one.
        ...[...text.matchAll(/^ {0,3}\[[^\]]+\]:\s*<?([^\s>]+)>?.*$/gm)].map((m) => [m[0], '!', m[1]]),
    ];
    for (const [, bang, href] of links) {
        if (/^(https?:|mailto:|\/\/)/.test(href)) continue;
        const target = href.split(/[?#]/)[0];
        if (ASSET.test(target)) {
            if (bang) checkAsset(file, rel, target);
            else problems.push(`${rel}: "${href}" links to a local file, which Docsify routes as a page and 404s — embed it as an image or link to a public URL`);
        } else {
            checkPage(file, rel, href);
        }
    }
}

if (problems.length) {
    console.error(problems.join('\n'));
    console.error(`\n\x1b[31m${problems.length} broken Docsify link(s).\x1b[0m`);
    process.exit(1);
}
console.log('\x1b[32mAll Docsify links resolve.\x1b[0m');
