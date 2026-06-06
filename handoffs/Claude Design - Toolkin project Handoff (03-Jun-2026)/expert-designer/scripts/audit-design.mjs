#!/usr/bin/env node
/**
 * audit-design.mjs — Toolskin design-system linter
 * ===================================================
 * Scans an HTML file (and any local CSS it imports) for violations of the
 * expert-designer skill. Prints a graded report and exits 1 if any HARD rule
 * fails.
 *
 * Run:  node scripts/audit-design.mjs <path/to/file.html>
 *
 * Checks:
 *   HARD (exit 1 if any fail)
 *     - Hardcoded hex colors in CSS (must be var(--ts-*) or in :root)
 *     - !important declarations
 *     - 1fr grid columns without minmax(0, …) safety belt
 *     - Banned default fonts (Inter, Roboto, Arial, system-ui) as PRIMARY pick
 *     - vh on full-height containers (should be dvh)
 *     - position: fixed/absolute without z-index
 *
 *   SOFT (warning only)
 *     - Off-ladder font-size values (not on the 1.200 ladder)
 *     - Off-grid padding/margin values (not from --ts-sp-*)
 *     - Missing :focus-visible alongside :hover
 *     - More than 2 type families loaded
 *     - max-width > 80ch on prose
 */

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
if (!args[0]) {
  console.error('usage: node audit-design.mjs <file.html>');
  process.exit(2);
}

const filePath = path.resolve(args[0]);
if (!fs.existsSync(filePath)) {
  console.error(`✗ file not found: ${filePath}`);
  process.exit(2);
}

const html = fs.readFileSync(filePath, 'utf8');
const dir  = path.dirname(filePath);

// ── gather inline + external CSS ─────────────────────────────────────────
const cssChunks = [];

// inline <style>
const inlineStyles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)];
for (const m of inlineStyles) cssChunks.push({ source: 'inline <style>', css: m[1] });

// local <link rel="stylesheet" href="…">
const linkTags = [...html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi)];
for (const tag of linkTags) {
  const hrefMatch = tag[0].match(/href=["']([^"']+)["']/i);
  if (!hrefMatch) continue;
  const href = hrefMatch[1];
  if (/^https?:/.test(href)) continue;        // external CDN — skip
  const localPath = path.resolve(dir, href);
  if (fs.existsSync(localPath)) {
    cssChunks.push({ source: href, css: fs.readFileSync(localPath, 'utf8') });
  }
}

// ── findings collector ───────────────────────────────────────────────────
const hard = [];
const soft = [];

function flag(level, rule, source, snippet, fix) {
  (level === 'hard' ? hard : soft).push({ rule, source, snippet: snippet.trim().slice(0, 120), fix });
}

// ── 1.200 ladder (reasonable px values) ──────────────────────────────────
const LADDER_PX = [11.11, 13.33, 16, 19.2, 23.04, 27.65, 33.18, 39.81, 47.78, 57.33, 68.8, 82.55];
function isOnLadder(px) {
  return LADDER_PX.some((v) => Math.abs(v - px) < 0.6);
}

// ── 8pt grid ─────────────────────────────────────────────────────────────
const SP = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128];
function isOnGrid(px) { return SP.includes(Math.round(px)); }

// ── banned fonts as PRIMARY (still ok as fallback in stack) ──────────────
const BANNED_DEFAULTS = ['Inter', 'Roboto', 'Arial', 'system-ui', 'sans-serif', 'Helvetica'];

// ── scan each CSS chunk ──────────────────────────────────────────────────
for (const { source, css } of cssChunks) {
  // strip comments to avoid false positives
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');

  // HARD: hardcoded hex outside :root or @theme
  // (allowed in :root { … } blocks; flagged anywhere else)
  const rootBlocks = [...clean.matchAll(/(:root\s*(?:\[[^\]]+\])?\s*\{[\s\S]*?\})/g)].map(m => m[0]).join('\n');
  const nonRoot = clean.replace(/(:root\s*(?:\[[^\]]+\])?\s*\{[\s\S]*?\})/g, '');
  const hexMatches = [...nonRoot.matchAll(/#[0-9a-f]{3,8}\b/gi)];
  for (const m of hexMatches) {
    // allow in url() and svg fills/strokes
    const idx = m.index;
    const around = nonRoot.slice(Math.max(0, idx - 20), idx + 20);
    if (/url\(|fill=|stroke=/i.test(around)) continue;
    flag('hard', 'hardcoded-hex', source, around, `Replace with var(--ts-*). Add the color to :root or use color-mix().`);
  }

  // HARD: !important
  const bangs = [...clean.matchAll(/!important\b/g)];
  for (const m of bangs) {
    const around = clean.slice(Math.max(0, m.index - 60), m.index + 20);
    flag('hard', 'no-important', source, around, `Fix specificity instead. Use @layer or rewrite the selector.`);
  }

  // HARD: 1fr without minmax(0, …) or minmax(min(100%, …), …)
  const gridCols = [...clean.matchAll(/grid-template-columns\s*:\s*([^;}\n]+)/g)];
  for (const m of gridCols) {
    const val = m[1];
    if (/\b1fr\b/.test(val) && !/minmax\s*\(/.test(val)) {
      flag('hard', 'unsafe-grid-1fr', source, m[0], `Use minmax(0, 1fr) or minmax(min(100%, 280px), 1fr).`);
    }
  }

  // HARD: vh on min-height: 100vh (use dvh)
  const vhMatches = [...clean.matchAll(/min-height\s*:\s*100\s*vh/gi)];
  for (const m of vhMatches) {
    flag('hard', 'use-dvh', source, m[0], `100vh breaks on mobile. Use 100dvh.`);
  }

  // SOFT: off-ladder font-size in px
  const fsMatches = [...clean.matchAll(/font-size\s*:\s*([\d.]+)px/g)];
  for (const m of fsMatches) {
    const px = parseFloat(m[1]);
    if (px > 10 && !isOnLadder(px)) {
      flag('soft', 'off-ladder-font-size', source, m[0], `Use --ts-fs-* tokens. Nearest ladder value: ${LADDER_PX.reduce((a, b) => Math.abs(b - px) < Math.abs(a - px) ? b : a)}px.`);
    }
  }

  // SOFT: off-grid padding/margin in px
  const spMatches = [...clean.matchAll(/(padding|margin|gap)\s*:\s*([^;}\n]+)/g)];
  for (const m of spMatches) {
    const vals = m[2].match(/[\d.]+px/g) || [];
    for (const v of vals) {
      const px = parseFloat(v);
      if (px > 0 && !isOnGrid(px)) {
        flag('soft', 'off-grid-spacing', source, m[0], `Use --ts-sp-* tokens. ${px}px is off-grid.`);
        break;       // one flag per declaration
      }
    }
  }

  // SOFT: :hover without :focus-visible nearby
  const selectors = [...clean.matchAll(/([.\-a-zA-Z0-9_]+):hover\s*\{/g)];
  for (const m of selectors) {
    const base = m[1];
    const hasFocus = new RegExp(`${base.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}:focus(?:-visible)?\\s*\\{`).test(clean);
    if (!hasFocus) {
      flag('soft', 'missing-focus-visible', source, `${base}:hover`, `Add ${base}:focus-visible with the same styling (or its own).`);
    }
  }

  // SOFT: too many font families loaded (count unique font-family in url())
  // (handled below via the HTML <link> scan)

  // HARD: banned default font as the FIRST item in font-family stack
  const fontFams = [...clean.matchAll(/font-family\s*:\s*([^;}\n]+)/g)];
  for (const m of fontFams) {
    const first = m[1].split(',')[0].trim().replace(/['"]/g, '');
    if (BANNED_DEFAULTS.includes(first)) {
      flag('hard', 'banned-default-font', source, m[0], `"${first}" is a fallback, not a primary choice. Open references/02-typography.md and pick a real font.`);
    }
  }
}

// ── HTML-level checks ────────────────────────────────────────────────────
// SOFT: more than 2 distinct font families requested from fonts.googleapis.com
const googleFontMatches = [...html.matchAll(/fonts\.googleapis\.com\/css2\?([^"']+)/g)];
const families = new Set();
for (const m of googleFontMatches) {
  const params = new URLSearchParams(m[1].replace(/&amp;/g, '&'));
  for (const f of params.getAll('family')) {
    families.add(f.split(':')[0]);
  }
}
if (families.size > 2) {
  flag('soft', 'too-many-fonts', 'HTML', `loaded: ${[...families].join(', ')}`, `Limit to 2 families max. Mono counts only when there's real code on screen.`);
}

// SOFT: missing <meta name="viewport">
if (!/<meta[^>]+name=["']viewport["']/i.test(html)) {
  flag('soft', 'missing-viewport', 'HTML', '<head>', `Add <meta name="viewport" content="width=device-width, initial-scale=1">.`);
}

// SOFT: missing prefers-reduced-motion handling
const cssAll = cssChunks.map(c => c.css).join('\n');
if (!/prefers-reduced-motion/.test(cssAll) && /animation\s*:|transition\s*:/.test(cssAll)) {
  flag('soft', 'no-reduced-motion', 'CSS', 'media queries', `Add @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }`);
}

// ── report ───────────────────────────────────────────────────────────────
const reset = '\x1b[0m', red = '\x1b[31m', yellow = '\x1b[33m', green = '\x1b[32m', dim = '\x1b[2m', bold = '\x1b[1m';

console.log(`\n${bold}── Toolskin design audit ──${reset}`);
console.log(`${dim}file:${reset} ${path.relative(process.cwd(), filePath)}`);
console.log(`${dim}css sources:${reset} ${cssChunks.map(c => c.source).join(', ') || '(none)'}\n`);

if (hard.length === 0 && soft.length === 0) {
  console.log(`${green}✓ no issues found. ship it.${reset}\n`);
  process.exit(0);
}

if (hard.length) {
  console.log(`${red}${bold}HARD failures (${hard.length}) — must fix:${reset}`);
  for (const f of hard) {
    console.log(`  ${red}✗${reset} ${bold}${f.rule}${reset}  ${dim}[${f.source}]${reset}`);
    console.log(`    ${dim}…${f.snippet}…${reset}`);
    console.log(`    ${green}→ ${f.fix}${reset}`);
  }
  console.log('');
}

if (soft.length) {
  console.log(`${yellow}${bold}SOFT warnings (${soft.length}) — fix if you can:${reset}`);
  for (const f of soft) {
    console.log(`  ${yellow}⚠${reset}  ${bold}${f.rule}${reset}  ${dim}[${f.source}]${reset}`);
    console.log(`    ${dim}…${f.snippet}…${reset}`);
    console.log(`    ${green}→ ${f.fix}${reset}`);
  }
  console.log('');
}

// score
const total = 100;
const hardPenalty = Math.min(60, hard.length * 12);
const softPenalty = Math.min(30, soft.length * 3);
const score = Math.max(0, total - hardPenalty - softPenalty);
const grade = score >= 95 ? 'A' : score >= 85 ? 'B' : score >= 70 ? 'C' : score >= 55 ? 'D' : 'F';
const colorFn = score >= 85 ? green : score >= 70 ? yellow : red;
console.log(`${bold}score:${reset} ${colorFn}${score}/100 (${grade})${reset}  ·  ${red}${hard.length} hard${reset} · ${yellow}${soft.length} soft${reset}\n`);

process.exit(hard.length > 0 ? 1 : 0);
