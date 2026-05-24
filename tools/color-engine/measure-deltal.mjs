/**
 * measure-deltal.mjs — Task 2 / RULING 7 sub-floor ΔL measurement
 * ================================================================
 * Reads the OLD repo derivation formulas (extracted at
 * docs/references/toolskin.css_extracted-core-blocks-to-refactor/
 * root-tokens-blocks-reference.css L892–953), replays them against each
 * of the 10 TOOLSKIN_SURFACE_PRESETS (5 dark + 5 light) and measures the
 * OKLCH lightness produced by each formula on the preset's --ts-bg-1
 * anchor. These measured ΔL values are the canonical sub-floor constants
 * per RULING 7 + the APCA loClip finding (Lc < 10 unreachable by APCA;
 * use culori OKLCH ΔL instead).
 *
 * Run:  node tools/color-engine/measure-deltal.mjs
 * Emits a Markdown table to stdout — DOES NOT write any files.
 *
 * The canonical winning formulas from root-tokens-blocks-reference.css
 * (cascade last-write-wins):
 *
 *   --ts-this-bg-bright: color-mix(in srgb, base, #ffffff 6%)         L905+L906
 *   --ts-this-bg-bright-1: color-mix(in srgb, base, #ffffff 4%)        L907
 *   --ts-this-bg-bright-2: color-mix(in srgb, base, #ffffff 8%)        L908
 *   --ts-this-bg-bright-3: color-mix(in srgb, base, #ffffff 14%)       L909
 *   --ts-this-bg-dark:   color-mix(in srgb, base, #000000 14%)         L910+L911
 *   --ts-this-bg-dark-1: color-mix(in srgb, base, #000000 2%)          L912
 *   --ts-this-bg-dark-2: color-mix(in srgb, base, #000000 12%)         L913
 *   --ts-this-bg-active: color-mix(in srgb, base, #000000 15%)         L947
 *   --ts-this-bg-hover:  color-mix(in srgb, base, text-primary 30%)    L946
 *
 * For each preset:
 *   base = ts-bg-1 (the default --ts-this-bg anchor in surfaces.css)
 *   floor = ts-bg-body
 *   text  = ts-text-primary
 */

import { converter, formatHex, parse } from 'culori';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const toOklch = converter('oklch');

// Replay generate-colors.js' SURFACE_PRESETS — verbatim mirror
const SURFACE_PRESETS = JSON.parse(
  fs.readFileSync(
    path.resolve(SCRIPT_DIR, '..', '..', 'docs', 'references', 'surface-presets-catalog.json'),
    'utf8'
  )
);

const ALL_PRESETS = [...SURFACE_PRESETS.dark, ...SURFACE_PRESETS.light];

// ── sRGB color-mix helper — linear interpolation in gamma-encoded sRGB ──
// CSS color-mix(in srgb, A, B p%) = (1-p) * A + p * B in sRGB space (per CSS Color Level 5).
function parseHex(hex) {
  // returns {r,g,b} 0–255
  const h = hex.replace('#', '');
  const expand = h.length === 3 ? h.split('').map(c => c + c).join('') : h.slice(0, 6);
  return {
    r: parseInt(expand.slice(0, 2), 16),
    g: parseInt(expand.slice(2, 4), 16),
    b: parseInt(expand.slice(4, 6), 16),
  };
}
function mixSrgb(hexA, hexB, pctB) {
  const A = parseHex(hexA), B = parseHex(hexB);
  const p = pctB / 100;
  const r = Math.round(A.r * (1 - p) + B.r * p);
  const g = Math.round(A.g * (1 - p) + B.g * p);
  const b = Math.round(A.b * (1 - p) + B.b * p);
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}
function lOf(hex) {
  return toOklch(hex).l * 100; // percent
}

// ── derivations replayed verbatim from root-tokens-blocks-reference.css ──
function derive(base, floor, text) {
  return {
    bright:   mixSrgb(base, '#ffffff', 6),
    bright1:  mixSrgb(base, '#ffffff', 4),
    bright2:  mixSrgb(base, '#ffffff', 8),
    bright3:  mixSrgb(base, '#ffffff', 14),
    dark:     mixSrgb(base, '#000000', 14),
    dark1:    mixSrgb(base, '#000000', 2),
    dark2:    mixSrgb(base, '#000000', 12),
    active:   mixSrgb(base, '#000000', 15),
    hover:    mixSrgb(base, text,      30),
  };
}

// ── emit the measurement table ──
const rows = [];
for (const preset of ALL_PRESETS) {
  const base = preset.tokens['ts-bg-1'];
  const floor = preset.tokens['ts-bg-body'];
  const text = preset.tokens['ts-text-primary'];
  const baseL = lOf(base);
  const d = derive(base, floor, text);

  for (const [name, hex] of Object.entries(d)) {
    const L = lOf(hex);
    const deltaL = L - baseL;
    rows.push({
      preset: preset.id,
      derivative: name,
      baseHex: base,
      derivedHex: hex,
      baseL: baseL.toFixed(2),
      derivedL: L.toFixed(2),
      deltaL: deltaL.toFixed(4),
    });
  }
}

// ── per-preset summary first (the canonical constants) ──
console.log('# RULING 7 — Sub-floor ΔL measurement (canonical constants per preset)\n');
console.log('Source: docs/references/toolskin.css_extracted-core-blocks-to-refactor/root-tokens-blocks-reference.css L892–953');
console.log('Base anchor: each preset\'s `--ts-bg-1` (matches surfaces.css default `--ts-this-bg`).');
console.log('Measurement: OKLCH lightness via culori, on color-mix(in srgb, …) replay.\n');

console.log('## ΔL per preset × derivative (signed, OKLCH lightness percentage points)\n');
console.log('| Preset | base L | bright +%6 | bright-1 +%4 | bright-2 +%8 | bright-3 +%14 | dark −%14 | dark-1 −%2 | dark-2 −%12 | active −%15 | hover +text%30 |');
console.log('|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|');
for (const preset of ALL_PRESETS) {
  const presetRows = rows.filter(r => r.preset === preset.id);
  const cells = presetRows.map(r => r.deltaL.padStart(7));
  const baseL = presetRows[0].baseL;
  console.log(`| \`${preset.id}\` | ${baseL} | ${cells.join(' | ')} |`);
}

// ── cross-preset stability (the rebuild's per-preset bake amounts) ──
console.log('\n## Aggregate ΔL by derivative — min / mean / max across all 10 presets\n');
console.log('| Derivative | min ΔL | mean ΔL | max ΔL | spread |');
console.log('|---|--:|--:|--:|--:|');
const derivNames = ['bright', 'bright1', 'bright2', 'bright3', 'dark', 'dark1', 'dark2', 'active', 'hover'];
for (const dn of derivNames) {
  const vals = rows.filter(r => r.derivative === dn).map(r => parseFloat(r.deltaL));
  const min = Math.min(...vals), max = Math.max(...vals);
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  console.log(`| ${dn.padEnd(8)} | ${min.toFixed(3)} | ${mean.toFixed(3)} | ${max.toFixed(3)} | ${(max - min).toFixed(3)} |`);
}

// ── canonical RULING 7 sub-floor table — what generate-colors.js will bake ──
console.log('\n## RULING 7 canonical sub-floor constants (per-preset OKLCH ΔL targets)\n');
console.log('These are the values that generate-colors.js MUST bake per preset.');
console.log('In surfaces.css the formula becomes `color-mix(in oklch, base, tone-X, var(--ts-this-bg-grad-Y-pct))`');
console.log('where the percentage is engine-derived to hit the measured ΔL on each preset.\n');
console.log('Targets (per RULING 7 constant table):');
console.log('  --ts-this-bg-grad-bright-pct  → Lc 6 (sub-floor) — measured `bright` (+%6 white)');
console.log('  --ts-this-bg-grad-dark-pct    → Lc 8 (sub-floor) — measured `dark` (−%14 black)');
console.log('  --ts-mix-perc-active-surface  → Lc 8 — measured `active` (−%15 black)');
console.log('  --ts-mix-perc-hover-surface   → Lc 12 — APCA range; calculate separately\n');

console.log('## Detailed measurements (full table)\n');
console.log('| Preset | Derivative | base hex | derived hex | base L% | derived L% | ΔL |');
console.log('|---|---|---|---|--:|--:|--:|');
for (const r of rows) {
  console.log(`| \`${r.preset}\` | ${r.derivative.padEnd(8)} | \`${r.baseHex}\` | \`${r.derivedHex}\` | ${r.baseL} | ${r.derivedL} | ${r.deltaL} |`);
}
