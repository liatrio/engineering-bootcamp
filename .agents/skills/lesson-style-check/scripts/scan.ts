#!/usr/bin/env node
/*
 * lesson-style-check mechanical scanner (read-only reporter). Exits 0 whether or not it
 * finds anything; exits 2 if it crashes, so a broken scan is never mistaken for a clean one.
 *
 * Usage (from repo root):
 *   node .agents/skills/lesson-style-check/scripts/scan.ts [--json] [--headings] [files...]
 *
 * With no files, scans markdown changed on the current branch versus master
 * plus untracked markdown under docs/. docs/README.md is always skipped.
 *
 * --headings turns on the pattern 6 Title Case advisory (off by default: existing
 * headings mix styles, so it is noisy outside new files).
 *
 * Output: one line per finding, `file:line:pattern:kind:text`
 *   kind = hit | candidate | advisory
 * Patterns implemented: 1, 4, 6, 9, 10, 11, 12, 13, 14.
 * Patterns 2, 3, 5, 7, 8 are judgment-only and intentionally not attempted.
 * Matching is done on markdown text nodes only, so code fences, inline code,
 * HTML, link URLs, and front-matter are never matched.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
let matter: typeof import('gray-matter');
try { matter = (await import('gray-matter')).default; } catch {
  process.stderr.write('scan.ts: missing dependency gray-matter; run npm install from the repo root\n');
  process.exit(2);
}

const argv = process.argv.slice(2);
const asJson = argv.includes('--json');
const withHeadings = argv.includes('--headings');
const fileArgs = argv.filter((a) => !a.startsWith('--'));

function git(args: string[]) {
  try {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
      .split('\n')
      .filter(Boolean);
  } catch {
    process.stderr.write(`scan.ts: git ${args[0]} failed; no branch scope available\n`);
    return [];
  }
}

function resolveScope() {
  let files = fileArgs;
  if (files.length === 0) {
    files = [
      ...git(['diff', '--name-only', '--diff-filter=d', 'master...HEAD', '--', 'docs/**/*.md']),
      ...git(['ls-files', '--others', '--exclude-standard', '--', 'docs/**/*.md']),
    ];
  }
  const readme = path.resolve('docs/README.md');
  const seen = new Set();
  const out = [];
  for (const f of files) {
    const abs = path.resolve(f);
    if (abs === readme || !f.endsWith('.md') || seen.has(abs)) continue;
    seen.add(abs);
    if (!fs.existsSync(abs)) {
      process.stderr.write(`scan.ts: skipping missing file ${f}\n`);
      continue;
    }
    out.push(f);
  }
  return out;
}

// ---- pattern tables (text-node regexes) ----------------------------------
const IDIOMS =
  /\b(in anger|come good|hits? the ground running|at the end of the day|raise the bar|move the needle|low.hanging fruit|boil(s|ing)? the ocean)\b/gi;
const FLAG_ON_SIGHT =
  /\b(delv\w*|tapestry|realm|paradigm|embark\w*|beacon|testament to|game.?changer|pivotal|meticulous|cutting.?edge|underscores|myriad)\b/gi;
const FLOURISH =
  /\b(harness|ecosystem|leverag\w*|robust|comprehensive|seamless|facilitat\w*|streamlin\w*|underpin\w*)\b/gi;
const COPULA = /\b(serves as|boasts|presents itself as)\b/gi;
const VAGUE = /\b(experts (believe|say|agree)|studies show|research suggests|industry leaders)\b/gi;
const INTENSIFIER = /\b(genuinely|truly|quite frankly|to be honest|it.s worth noting that)\b/gi;
const ANNOUNCER = /(^|[.!?]\s+)(Notably|Interestingly|Importantly|Significantly),/g;

const MINOR = new Set(
  'a an the and but or nor for at by in of on to up as is vs via with from into over per not'.split(' '),
);
const HEADING_ALLOW = new Set(['learning objectives', 'deliverables']);

// ---- helpers --------------------------------------------------------------
interface MdNode {
  type: string;
  value: string;
  depth: number;
  children?: MdNode[];
  position: { start: { line: number } };
}
interface Finding { file: string; line: number; pattern: number; kind: string; text: string }

function textOf(node: MdNode): string {
  if (node.type === 'text' || node.type === 'inlineCode') return node.value;
  return (node.children || []).map(textOf).join('');
}

function headingText(node: MdNode): string {
  // text nodes only: inline code and HTML are ignored
  if (node.type === 'text') return node.value;
  if (node.type === 'inlineCode' || node.type === 'html') return '';
  return (node.children || []).map(headingText).join('');
}

function excerpt(value: string, idx: number, len: number) {
  const from = Math.max(0, idx - 30);
  const to = Math.min(value.length, idx + len + 30);
  return (
    (from > 0 ? '...' : '') +
    value.slice(from, to).replace(/\s+/g, ' ').trim() +
    (to < value.length ? '...' : '')
  );
}

function lineAt(node: MdNode, value: string, idx: number) {
  let line = node.position.start.line;
  for (let i = 0; i < idx; i++) if (value[i] === '\n') line++;
  return line;
}

function isTitleCase(text: string) {
  const words = text.trim().split(/\s+/).filter((w: string) => /[A-Za-z]/.test(w));
  if (words.length < 2) return false;
  const content = words.filter((w: string, i: number) => i === 0 || !MINOR.has(w.toLowerCase()));
  const rest = content.slice(1);
  if (rest.length === 0) return false;
  const cap = (w: string) => /^[^A-Za-z]*[A-Z]/.test(w);
  if (!content.every(cap)) return false;
  // need at least one non-first word that is a Capitalized word (not an ALL-CAPS acronym)
  return rest.some((w: string) => /^[^A-Za-z]*[A-Z][a-z]/.test(w));
}

// Replace the front-matter block with bare newlines so line numbers stay correct.
function blankFrontMatter(src: string) {
  if (!src.startsWith('---')) return src;
  let parsed: ReturnType<typeof matter>;
  try {
    parsed = matter(src);
  } catch {
    return src;
  }
  if (typeof parsed.matter !== 'string') return src;
  const start = src.indexOf(parsed.matter);
  const close = src.indexOf('---', start + parsed.matter.length);
  if (close === -1) return src;
  let end = src.indexOf('\n', close);
  end = end === -1 ? src.length : end;
  return src.slice(0, end).replace(/[^\n]/g, '') + src.slice(end);
}

async function main() {
  let remark: typeof import('remark').remark;
  try { ({ remark } = await import('remark')); } catch {
    process.stderr.write('scan.ts: missing dependency remark; run npm install from the repo root\n');
    process.exit(2);
  }
  const processor = remark();
  const files = resolveScope();
  const findings: Finding[] = [];

  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8');
    const tree = processor.parse(blankFrontMatter(src));
    let section = 0;
    const announcers = new Map<number, { line: number; text: string }[]>(); // section index -> openers found

    const add = (line: number, pattern: number, kind: string, text: string) => findings.push({ file, line, pattern, kind, text });

    const scanText = (node: MdNode, parent?: MdNode | null) => {
      const v = node.value;
      const run = (re: RegExp, pattern: number, kind: string) => {
        re.lastIndex = 0;
        for (let m = re.exec(v); m; m = re.exec(v)) {
          add(lineAt(node, v, m.index), pattern, kind, excerpt(v, m.index, m[0].length));
        }
      };
      run(/—| -- /g, 4, 'hit');
      run(IDIOMS, 9, 'hit');
      run(FLAG_ON_SIGHT, 10, 'hit');
      run(FLOURISH, 10, 'candidate');
      run(COPULA, 11, 'hit');
      run(VAGUE, 12, 'hit');
      run(INTENSIFIER, 13, 'hit');
      // 14: collect per section, report only when 2+ share a section
      ANNOUNCER.lastIndex = 0;
      for (let m = ANNOUNCER.exec(v); m; m = ANNOUNCER.exec(v)) {
        const opens = m[1] === '' ? parent && parent.children![0] === node : true;
        if (!opens) continue;
        const idx = m.index + m[1].length;
        if (!announcers.has(section)) announcers.set(section, []);
        announcers.get(section)!.push({ line: lineAt(node, v, idx), text: excerpt(v, idx, m[2].length + 1) });
      }
    };

    const walk = (node: MdNode, parent?: MdNode | null) => {
      if (node.type === 'heading') {
        section++;
        if (node.depth <= 3) {
          const t = headingText(node).trim();
          if (withHeadings && !HEADING_ALLOW.has(t.toLowerCase()) && isTitleCase(t)) {
            add(node.position.start.line, 6, 'advisory', t);
          }
        }
      }
      if (node.type === 'paragraph' && node.children![0] && node.children![0].type === 'strong') {
        const s = node.children![0];
        const t = textOf(s).trim();
        if (/^[A-Z]/.test(t) && /\.$/.test(t)) add(s.position.start.line, 1, 'hit', t);
      }
      if (node.type === 'text') scanText(node, parent);
      for (const c of node.children || []) walk(c, node);
    };
    walk(tree as unknown as MdNode, null);

    for (const list of announcers.values()) {
      if (list.length >= 2) for (const a of list) add(a.line, 14, 'hit', a.text);
    }
  }

  findings.sort((a, b) =>
    a.file === b.file ? a.line - b.line || a.pattern - b.pattern : a.file < b.file ? -1 : 1,
  );
  if (asJson) {
    process.stdout.write(JSON.stringify(findings, null, 2) + '\n');
  } else {
    for (const f of findings) {
      process.stdout.write(`${f.file}:${f.line}:${f.pattern}:${f.kind}:${f.text.replace(/\n/g, ' ')}\n`);
    }
  }
  process.stderr.write(`scan.ts: ${files.length} file(s), ${findings.length} finding(s)\n`);
}

main()
  .catch((e) => {
    process.stderr.write(`scan.ts: error: ${e?.message}\n`);
    process.exitCode = 2;
  });
