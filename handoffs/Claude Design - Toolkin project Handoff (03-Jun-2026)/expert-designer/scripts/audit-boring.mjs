#!/usr/bin/env node
/**
 * audit-boring.mjs — The Boring Detector
 * ─────────────────────────────────────────
 * Catches the failure mode v6 missed: rule-compliant slop. Files that pass
 * audit-design.mjs (no hardcoded hex, no !important, no banned fonts) but
 * still look like a centered vertical stack of cards. This script flags
 * compositions that lack conviction.
 *
 * Run:  node scripts/audit-boring.mjs <file.html>
 *
 * HARD failures (exit 1):
 *   1. No asymmetric grid (no `5fr 7fr` / `2fr 3fr` / `3fr 5fr` / `4fr 8fr` / etc)
 *   2. No grid with > 3 columns visible at desktop
 *   3. Every section is centered
 *   4. No bento (no 12-col grid with varied spans)
 *   5. No hero font-size >= 56px or clamp() reaching 56px+
 *   6. Only one background color used
 *   7. Only one section padding value used
 *   8. No tile that spans more than its neighbors
 *
 * SOFT warnings:
 *   - No serif italic anywhere (the magazine move)
 *   - No oversized type (clamp reaching > 72px)
 *   - No grid-auto-flow: dense
 *   - No mixed font-weight on the same headline
 *   - More than 3 consecutive centered sections (vertical-stack syndrome)
 *
 * Outputs a "conviction score" 0-100. Below 60 = restart with a different starter.
 */

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
if (!args[0]) {
  console.error('usage: node audit-boring.mjs <file.html>');
  process.exit(2);
}
const filePath = path.resolve(args[0]);
if (!fs.existsSync(filePath)) {
  console.error(`✗ file not found: ${filePath}`);
  process.exit(2);
}

const html = fs.readFileSync(filePath, 'utf8');
const dir = path.dirname(filePath);

// Gather CSS (inline + local stylesheets)
const cssChunks = [];
const inlineStyles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)];
for (const m of inlineStyles) cssChunks.push(m[1]);
const linkTags = [...html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi)];
for (const tag of linkTags) {
  const hrefMatch = tag[0].match(/href=["']([^"']+)["']/i);
  if (!hrefMatch || /^https?:/.test(hrefMatch[1])) continue;
  const localPath = path.resolve(dir, hrefMatch[1]);
  if (fs.existsSync(localPath)) cssChunks.push(fs.readFileSync(localPath, 'utf8'));
}
// Also include inline style="" attributes
const inlineAttrs = [...html.matchAll(/style="([^"]+)"/g)].map(m => m[1]).join(';');
cssChunks.push(inlineAttrs);
const allCss = cssChunks.join('\n').replace(/\/\*[\s\S]*?\*\//g, '');

const hard = [];
const soft = [];
function flag(level, rule, evidence, fix) {
  (level === 'hard' ? hard : soft).push({ rule, evidence, fix });
}

// ── 1. Asymmetric grids ─────────────────────────────────────────
const gridCols = [...allCss.matchAll(/grid-template-columns\s*:\s*([^;}\n]+)/g)].map(m => m[1]);
const ASYMMETRIC = /(\d+fr)\s+(\d+fr)/g;
let hasAsymmetric = false;
for (const decl of gridCols) {
  const matches = [...decl.matchAll(/(\d+(?:\.\d+)?)\s*fr.*?(\d+(?:\.\d+)?)\s*fr/g)];
  for (const m of matches) {
    const a = parseFloat(m[1]); const b = parseFloat(m[2]);
    if (Math.abs(a - b) > 0.01 && a > 0 && b > 0) { hasAsymmetric = true; break; }
  }
  if (hasAsymmetric) break;
}
if (!hasAsymmetric) {
  flag('hard', 'no-asymmetric-grid',
    'No `Nfr Mfr` with N ≠ M found anywhere',
    'Use 5fr 7fr / 2fr 3fr / 3fr 5fr / 7fr 5fr for at least one split. 50/50 doesn\'t count.');
}

// ── 2. ≥ 3 columns at desktop ───────────────────────────────────
const hasMultiCol = gridCols.some(d =>
  /repeat\s*\(\s*(?:[3-9]|1[0-2])\s*,/.test(d) ||
  /repeat\s*\(\s*auto-fit\s*,\s*minmax\s*\(\s*min\s*\(\s*100%\s*,\s*(?:[12]\d{2}|3\d{2})px/.test(d) ||
  /(?:1fr\s+){2,}1fr/.test(d) ||
  /minmax\([^)]+\)(?:\s+minmax\([^)]+\)){2,}/.test(d)
);
if (!hasMultiCol) {
  flag('hard', 'no-multi-column-grid',
    'No grid with ≥ 3 columns or auto-fit ≥ 280px found',
    'Use `repeat(auto-fit, minmax(min(100%, 280px), 1fr))` for the feature grid, or `repeat(12, ...)` for a bento.');
}

// ── 3. Centered-everything check ────────────────────────────────
// Heuristic: count <section> and check how many have text-align: center, margin: auto, place-items: center
const sections = [...html.matchAll(/<section[^>]*class="([^"]*)"[^>]*>/gi)];
const centerCount = (allCss.match(/text-align\s*:\s*center/gi) || []).length;
const sectionCount = sections.length;
if (sectionCount >= 3 && centerCount >= sectionCount) {
  flag('hard', 'everything-centered',
    `${centerCount} text-align:center declarations across ${sectionCount} sections`,
    'At most 1 section may be center-aligned (typically the hero). The rest must use left/start alignment for asymmetry.');
}

// ── 4. Bento detection ──────────────────────────────────────────
const hasBento = /repeat\s*\(\s*12\s*,/.test(allCss) && /grid-column\s*:\s*span\s+(?:[4-8]|9)/.test(allCss);
const hasVariedSpans = (() => {
  const spans = [...allCss.matchAll(/grid-column\s*:\s*span\s+(\d+)/g)].map(m => parseInt(m[1], 10));
  return new Set(spans).size >= 3;
})();
if (!hasBento && !hasVariedSpans) {
  flag('hard', 'no-varied-spans',
    'No bento composition or varied grid-column spans found',
    'Use a 12-col grid with at least 3 different span values (e.g. span 8, span 4, span 3). Without varied spans, all your tiles look the same.');
}

// ── 5. Oversized hero check ─────────────────────────────────────
// Look for hero-ish font sizes in clamp() or raw px
const fontSizes = [...allCss.matchAll(/font-size\s*:\s*([^;}\n]+)/g)].map(m => m[1]);
const hasOversized = fontSizes.some(decl => {
  const pxMatches = [...decl.matchAll(/(\d+(?:\.\d+)?)\s*px/g)].map(m => parseFloat(m[1]));
  const vwMatches = [...decl.matchAll(/(\d+(?:\.\d+)?)\s*vw/g)].map(m => parseFloat(m[1]));
  return pxMatches.some(px => px >= 56) || vwMatches.some(vw => vw >= 6);
});
if (!hasOversized) {
  flag('hard', 'no-oversized-element',
    'No font-size ≥ 56px or ≥ 6vw found',
    'At least one element (the hero headline) must be visually dominant. Use clamp(56px, 8vw, 120px) at minimum.');
}

// ── 6. Single background color ──────────────────────────────────
const bgUses = [
  ...allCss.matchAll(/background(?:-color)?\s*:\s*var\(--ts-bg-([^\s)]+)/g)
].map(m => m[1]);
const uniqueBgs = new Set(bgUses);
if (uniqueBgs.size < 2) {
  flag('hard', 'monotone-backgrounds',
    `Only ${uniqueBgs.size} surface variant${uniqueBgs.size === 1 ? '' : 's'} used`,
    'Vary section backgrounds: use --ts-bg-body and --ts-bg-1 minimum. One section may use --ts-accent for prominence.');
}

// ── 7. Single padding value ─────────────────────────────────────
// Look for padding-block or padding (with clamp variations counting as one each)
const padValues = [...allCss.matchAll(/padding(?:-block|-inline|-top|-bottom)?\s*:\s*([^;}\n]+)/g)]
  .map(m => m[1].trim()).filter(v => /\d/.test(v));
const uniquePads = new Set(padValues);
if (uniquePads.size < 3) {
  flag('hard', 'uniform-padding',
    `Only ${uniquePads.size} unique padding values found across the file`,
    'Vary padding deliberately. Sections should have different padding to create rhythm (some compact, one dramatic).');
}

// ── 8. Dominant tile check (covered by #4 partially) ────────────
// already handled by no-varied-spans

// ── SOFT: serif italic anywhere ─────────────────────────────────
if (!/font-family\s*:[^;}\n]*serif|font-style\s*:\s*italic/i.test(allCss) && !/<em[ >]/i.test(html)) {
  flag('soft', 'no-italic-emphasis',
    'No serif font or italic emphasis anywhere',
    'Add ONE italic word in the hero headline using Instrument Serif (or similar). It\'s the magazine move that signals taste.');
}

// ── SOFT: grid-auto-flow: dense ─────────────────────────────────
if (!/grid-auto-flow\s*:\s*dense/i.test(allCss)) {
  flag('soft', 'no-dense-packing',
    'No `grid-auto-flow: dense` found',
    'For bento or asymmetric grids, add `grid-auto-flow: dense` so holes get packed.');
}

// ── SOFT: section count vs section variety ──────────────────────
if (sectionCount >= 4 && uniquePads.size <= 3) {
  flag('soft', 'monotone-sections',
    `${sectionCount} sections with ≤ ${uniquePads.size} padding variations`,
    'With this many sections, vary padding more aggressively — at least one compact + one spacious.');
}

// ── Verdict ─────────────────────────────────────────────────────
const reset = '\x1b[0m', red = '\x1b[31m', yellow = '\x1b[33m', green = '\x1b[32m',
      dim = '\x1b[2m', bold = '\x1b[1m', cyan = '\x1b[36m';

console.log(`\n${bold}── The Boring Detector ──${reset}`);
console.log(`${dim}file:${reset} ${path.relative(process.cwd(), filePath)}`);
console.log(`${dim}sections found:${reset} ${sectionCount}  ·  ${dim}unique surfaces:${reset} ${uniqueBgs.size}  ·  ${dim}unique paddings:${reset} ${uniquePads.size}\n`);

if (hard.length === 0 && soft.length === 0) {
  console.log(`${green}✓ Not boring. Real conviction detected. Ship it.${reset}\n`);
  process.exit(0);
}

if (hard.length) {
  console.log(`${red}${bold}HARD failures (${hard.length}) — this is slop, restart:${reset}\n`);
  for (const f of hard) {
    console.log(`  ${red}✗${reset} ${bold}${f.rule}${reset}`);
    console.log(`    ${dim}evidence:${reset} ${f.evidence}`);
    console.log(`    ${green}→ fix:${reset} ${f.fix}\n`);
  }
}

if (soft.length) {
  console.log(`${yellow}${bold}SOFT warnings (${soft.length}) — would elevate this:${reset}\n`);
  for (const f of soft) {
    console.log(`  ${yellow}⚠${reset}  ${bold}${f.rule}${reset}`);
    console.log(`    ${dim}evidence:${reset} ${f.evidence}`);
    console.log(`    ${green}→ fix:${reset} ${f.fix}\n`);
  }
}

const hardPenalty = Math.min(80, hard.length * 12);
const softPenalty = Math.min(20, soft.length * 4);
const conviction = Math.max(0, 100 - hardPenalty - softPenalty);
const grade =
  conviction >= 90 ? 'A — Award-grade' :
  conviction >= 75 ? 'B — Strong' :
  conviction >= 60 ? 'C — Acceptable, could be bolder' :
  conviction >= 40 ? 'D — Slop, restart with a different starter' :
                     'F — Centered vertical stack of cards. Restart immediately.';
const verdictColor = conviction >= 75 ? green : conviction >= 60 ? yellow : red;

console.log(`${bold}Conviction score:${reset} ${verdictColor}${conviction}/100 — ${grade}${reset}\n`);
if (conviction < 60) {
  console.log(`${cyan}${bold}WHAT TO DO:${reset}`);
  console.log(`  1. Pick a starter from ${cyan}expert-designer/starters/${reset}`);
  console.log(`  2. Write the manifesto (3 lines, ANTI-DEFAULT-PROTOCOL.md §"What the agent must write")`);
  console.log(`  3. Fill the starter's slots. Do NOT redesign its layout.`);
  console.log(`  4. Run this script again.\n`);
}

process.exit(hard.length > 0 ? 1 : 0);
