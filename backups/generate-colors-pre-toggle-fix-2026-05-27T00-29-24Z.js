/**
 * generate-colors.js — Toolskin color primitive build script
 * ===========================================================
 * RULING 1 (surface architecture): surfaces are NOT apcach-derived. They ARE the
 * hand-curated TOOLSKIN_SURFACE_PRESETS palettes. apcach's role here is the CONTRAST
 * LAYER — it VERIFIES the curated text/surface pairs against APCA targets; it does
 * not generate surface values. culori converts the curated hex to OKLCH for the
 * dual-emission CSS.
 *
 * Run:   node tools/color-engine/generate-colors.js   (cwd-independent)
 * Emits (deterministic — no timestamps, no randomness, fixed-precision rounding):
 *   assets/css/next/primitives/colors.css        — :root/dark + light + 10 preset classes
 *   docs/handoffs/colors-contrast-report.md      — APCA verification table (HALT gate)
 *   docs/references/surface-presets-catalog.json — TOOLSKIN_SURFACE_PRESETS verbatim
 * Exit code: 0 if every preset meets its APCA targets, 1 if any pair fails.
 */

import { calcContrast } from 'apcach';
import { converter } from 'culori';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..', '..');

// ── APCA verification targets — text on bg-body ──
// Role-calibrated floors (Option 4 ruling, 2026-05-21): these verify the *pre-tuner*
// curated base values. secondary/muted are intentionally lower-emphasis text, and the
// running _toolskinApplyContrastToTokenMap tuner nudges them further at runtime — so the
// earlier 90/60/45 targets were too strict for these roles.
const APCA_TARGET = { primary: 75, secondary: 45, muted: 25 };

// ── Brand accent + on-accent auto-contrast threshold ──
// #ff5500 per the Session 2 rescope; threshold 0.75 per RULING 4 (running toolskin.css).
const BRAND_ACCENT = '#ff5500';
const ON_ACCENT_THRESHOLD = 0.75;

// ── TOOLSKIN_SURFACE_PRESETS ──────────────────────────────────────────────
// Verbatim from ../toolskin-showcase/assets/js/toolskin.js:791 (code-audit catalog §6.1).
// 10 curated palettes (5 dark + 5 light). The 2 `recommended` entries are the
// factory defaults: dark-practical-neutral-v1 + light-practical-clean-v1.
const SURFACE_PRESETS = {
  meta: {
    deliveryNotes:
      'Classic = earlier Neutral Cool / Clean family (rollback). Practical = measured ~12–15% luminance steps, production-friendly contrast. Defaults use Practical · Neutral + Clean neutral. Softer hairline borders in CSS; OKLCh text tuner (colorjs.io) still nudges secondary/muted.',
  },
  dark: [
    {
      id: 'dark-neutral-cool-v1',
      label: 'Classic · V1 Neutral Cool',
      shortLabel: 'Classic Neutral',
      recommended: false,
      contrast: 'Primary ~14.2:1 · Secondary ~6.8:1 · Muted ~4.2:1',
      description: 'Original cool-neutral charcoal ramp — the earlier “best” default before extreme HC tests.',
      tokens: {
        'ts-bg-body': '#0a0b0f', 'ts-bg-0': '#0e0f14', 'ts-bg-1': '#13151b',
        'ts-bg-2': '#191c24', 'ts-bg-3': '#20242e', 'ts-bg-4': '#282d39', 'ts-bg-5': '#323844',
        'ts-text-primary': '#f4f5f9', 'ts-text-secondary': '#a8adb9', 'ts-text-muted': '#70758a',
      },
    },
    {
      id: 'dark-warm-slate-v2',
      label: 'Classic · V2 Warm Slate',
      shortLabel: 'Classic Warm',
      recommended: false,
      contrast: 'Primary ~13.8:1 · Secondary ~6.5:1 · Muted ~4.1:1',
      description: 'Warm stone undertone — pairs well with orange accent without a cold cast.',
      tokens: {
        'ts-bg-body': '#0b0a0d', 'ts-bg-0': '#0f0e12', 'ts-bg-1': '#151419',
        'ts-bg-2': '#1c1b22', 'ts-bg-3': '#24232c', 'ts-bg-4': '#2d2c37', 'ts-bg-5': '#383743',
        'ts-text-primary': '#f3f4f8', 'ts-text-secondary': '#a5aab7', 'ts-text-muted': '#6e7485',
      },
    },
    {
      id: 'dark-blue-tinted-v3',
      label: 'Classic · V3 Blue-Tinted Professional',
      shortLabel: 'Classic Blue',
      recommended: false,
      contrast: 'Primary ~14.5:1 · Secondary ~7.1:1 · Muted ~4.3:1',
      description: 'Cool slate-blue surfaces for data-heavy / dashboard layouts.',
      tokens: {
        'ts-bg-body': '#090a0e', 'ts-bg-0': '#0d0e13', 'ts-bg-1': '#12141a',
        'ts-bg-2': '#181b23', 'ts-bg-3': '#1f232d', 'ts-bg-4': '#272c38', 'ts-bg-5': '#313744',
        'ts-text-primary': '#f5f6fa', 'ts-text-secondary': '#aab0bc', 'ts-text-muted': '#737991',
      },
    },
    {
      id: 'dark-practical-neutral-v1',
      label: 'Practical · Neutral with proper steps (recommended)',
      shortLabel: 'Practical Neutral',
      recommended: true,
      contrast: 'Primary ~12.8:1 · Secondary ~6.2:1 · Muted ~4.1:1 vs bg-body',
      description:
        'Conservative, tested steps — readable type without harsh extremes; default production pair (with Practical Clean light).',
      tokens: {
        'ts-bg-body': '#0c0d0f', 'ts-bg-0': '#111214', 'ts-bg-1': '#17181b',
        'ts-bg-2': '#1f2024', 'ts-bg-3': '#28292e', 'ts-bg-4': '#323439', 'ts-bg-5': '#3e4045',
        'ts-text-primary': '#e8e9ea', 'ts-text-secondary': '#9ea0a5', 'ts-text-muted': '#6d6f74',
      },
    },
    {
      id: 'dark-practical-cool-v2',
      label: 'Practical · Slightly cool',
      shortLabel: 'Practical Cool',
      recommended: false,
      contrast: 'Cool-tinted ramp; balanced secondary/muted on slate surfaces',
      description: 'Alternative cool stack — distinct from practical neutral, still UI-safe.',
      tokens: {
        'ts-bg-body': '#0b0c0e', 'ts-bg-0': '#101214', 'ts-bg-1': '#16181c',
        'ts-bg-2': '#1e2025', 'ts-bg-3': '#272930', 'ts-bg-4': '#31343c', 'ts-bg-5': '#3d4048',
        'ts-text-primary': '#e7e8eb', 'ts-text-secondary': '#9da0a8', 'ts-text-muted': '#6c6f77',
      },
    },
  ],
  light: [
    {
      id: 'light-neutral-clean-v1',
      label: 'Classic · V1 Neutral Clean',
      shortLabel: 'Classic Clean',
      recommended: false,
      contrast: 'Primary ~15.1:1 · Secondary ~9.2:1 · Muted ~5.1:1',
      description: 'Cool off-white base with neutral greys — earlier tuned light palette.',
      tokens: {
        'ts-bg-body': '#f8f9fb', 'ts-bg-0': '#ffffff', 'ts-bg-1': '#fafbfc',
        'ts-bg-2': '#f3f4f7', 'ts-bg-3': '#e8eaef', 'ts-bg-4': '#d8dce3', 'ts-bg-5': '#c5cbd4',
        'ts-text-primary': '#0d0e12', 'ts-text-secondary': '#2b2f3d', 'ts-text-muted': '#656b7d',
      },
    },
    {
      id: 'light-warm-paper-v2',
      label: 'Classic · V2 Warm Paper',
      shortLabel: 'Classic Paper',
      recommended: false,
      contrast: 'Primary ~14.8:1 · Secondary ~8.9:1 · Muted ~4.9:1',
      description: 'Slightly warmer greys for editorial / long-form feel.',
      tokens: {
        'ts-bg-body': '#f7f8fa', 'ts-bg-0': '#ffffff', 'ts-bg-1': '#fafbfc',
        'ts-bg-2': '#f2f4f6', 'ts-bg-3': '#e7e9ed', 'ts-bg-4': '#d7dbe2', 'ts-bg-5': '#c4c9d3',
        'ts-text-primary': '#0e0f13', 'ts-text-secondary': '#2d313f', 'ts-text-muted': '#68707f',
      },
    },
    {
      id: 'light-cool-professional-v3',
      label: 'Classic · V3 Cool Professional',
      shortLabel: 'Classic Cool Pro',
      recommended: false,
      contrast: 'Primary ~15.3:1 · Secondary ~9.5:1 · Muted ~5.2:1',
      description: 'Cool-tinted light chrome for dashboards and dense tables.',
      tokens: {
        'ts-bg-body': '#f9fafb', 'ts-bg-0': '#ffffff', 'ts-bg-1': '#fbfcfd',
        'ts-bg-2': '#f4f5f8', 'ts-bg-3': '#e9ebef', 'ts-bg-4': '#d9dde4', 'ts-bg-5': '#c6ccd5',
        'ts-text-primary': '#0c0d11', 'ts-text-secondary': '#2a2e3c', 'ts-text-muted': '#636a7b',
      },
    },
    {
      id: 'light-practical-clean-v1',
      label: 'Practical · Clean neutral (recommended)',
      shortLabel: 'Practical Clean',
      recommended: true,
      contrast: 'Primary ~13.2:1 · Secondary ~7.8:1 · Muted ~4.5:1 vs bg-body',
      description: 'Measured light ramp with confident ink — default with Practical Neutral dark.',
      tokens: {
        'ts-bg-body': '#f7f8f9', 'ts-bg-0': '#ffffff', 'ts-bg-1': '#f4f5f6',
        'ts-bg-2': '#ecedef', 'ts-bg-3': '#e1e3e6', 'ts-bg-4': '#d4d7db', 'ts-bg-5': '#c5c9ce',
        'ts-text-primary': '#0f1012', 'ts-text-secondary': '#404347', 'ts-text-muted': '#5f6266',
      },
    },
    {
      id: 'light-practical-cool-v2',
      label: 'Practical · Slightly cool',
      shortLabel: 'Practical Cool',
      recommended: false,
      contrast: 'Cool-tinted surfaces; secondary/muted tuned for light chrome',
      description: 'Slightly cooler than clean neutral — good for analytics UIs.',
      tokens: {
        'ts-bg-body': '#f6f7f9', 'ts-bg-0': '#ffffff', 'ts-bg-1': '#f3f4f6',
        'ts-bg-2': '#ebedef', 'ts-bg-3': '#e0e3e7', 'ts-bg-4': '#d3d7dc', 'ts-bg-5': '#c4c9cf',
        'ts-text-primary': '#0e0f12', 'ts-text-secondary': '#3f4246', 'ts-text-muted': '#6a6d72',
      },
    },
  ],
};

const DEFAULT_DARK = SURFACE_PRESETS.dark.find((p) => p.recommended);
const DEFAULT_LIGHT = SURFACE_PRESETS.light.find((p) => p.recommended);
const ALL_PRESETS = [...SURFACE_PRESETS.dark, ...SURFACE_PRESETS.light];
const TOKEN_ORDER = [
  'ts-bg-body', 'ts-bg-0', 'ts-bg-1', 'ts-bg-2', 'ts-bg-3', 'ts-bg-4', 'ts-bg-5',
  'ts-text-primary', 'ts-text-secondary', 'ts-text-muted',
];

// ── helpers ───────────────────────────────────────────────────────────────
const toOklch = converter('oklch');

/** Curated hex → CSS oklch() string, fixed precision (deterministic). */
function oklchCss(hex) {
  const o = toOklch(hex);
  const L = (o.l * 100).toFixed(2);
  const C = (o.c ?? 0).toFixed(5);
  const H = (o.h ?? 0).toFixed(2); // achromatic colors have no hue → 0
  return `oklch(${L}% ${C} ${H})`;
}

/** Dual-emission token pair: #hex sRGB fallback THEN oklch() (R-D3-dual-emit). */
function dualEmit(prop, hex, indent) {
  return `${indent}--${prop}: ${hex};\n${indent}--${prop}: ${oklchCss(hex)};`;
}

/** Emit all 10 surface+text tokens of a preset, dual-emission. */
function presetBlock(preset, indent) {
  return TOKEN_ORDER.map((k) => dualEmit(k, preset.tokens[k], indent)).join('\n');
}

// ── on-accent: evaluate the CSS clamp at build time for the static fallback ──
const accentL = toOklch(BRAND_ACCENT).l;
const clampResolved = Math.min(1, Math.max(0, (ON_ACCENT_THRESHOLD - accentL) * 999));
const onAccentInk = clampResolved >= 0.5 ? '#ffffff' : '#000000';

// ════════════════════════════════════════════════════════════════════════
// 1. Emit colors.css
// ════════════════════════════════════════════════════════════════════════
let css = `/* ============================================================================
 * colors.css — Toolskin color primitives  ·  AUTOGENERATED — DO NOT EDIT BY HAND
 * Regenerate: node tools/color-engine/generate-colors.js
 * ----------------------------------------------------------------------------
 * Surfaces + text = the curated TOOLSKIN_SURFACE_PRESETS (RULING 1 — not engine-
 * derived). apcach is the contrast layer; culori does hex→OKLCH. Every color token
 * is dual-emitted: #hex sRGB fallback first, then oklch() for modern browsers.
 * Default pair: ${DEFAULT_DARK.id} (dark) + ${DEFAULT_LIGHT.id} (light).
 * ========================================================================== */

/* ── Brand accent + auto-contrast ink (theme-independent) ── */
:root {
${dualEmit('ts-accent', BRAND_ACCENT, '  ')}
  /* --ts-on-accent: CSS-native relative-color auto-ink (RULING 4 threshold 0.75).
     Static ${onAccentInk} fallback for browsers without relative-color syntax. */
  --ts-on-accent: ${onAccentInk};
  --ts-on-accent: oklch(from var(--ts-accent) clamp(0, (${ON_ACCENT_THRESHOLD} - l) * 999, 1) 0 0);
}

/* ── Default surfaces + text — dark (${DEFAULT_DARK.id}) ──
 * :root prefix — owner's manual specificity fix; preserved through regeneration (Commit 2)
 * :not(button[data-theme]) — theme-toggle buttons must not inherit the theme they switch (Commit 2 toggle-fix)
 */
:root,
:root[data-theme="dark"]:not(button[data-theme]) {
${presetBlock(DEFAULT_DARK, '  ')}
}

/* ── Default surfaces + text — light (${DEFAULT_LIGHT.id}) ──
 * :root prefix — owner's manual specificity fix; preserved through regeneration (Commit 2)
 * :not(button[data-theme]) — theme-toggle buttons must not inherit the theme they switch (Commit 2 toggle-fix)
 */
:root[data-theme="light"]:not(button[data-theme]) {
${presetBlock(DEFAULT_LIGHT, '  ')}
}

/* ── All 10 surface presets as scoped classes ──
 * Apply on any subtree to switch its surface palette, e.g.
 * <div class="ts-preset-dark-warm-slate-v2"> … </div>
 */
`;

for (const preset of ALL_PRESETS) {
  css += `\n/* ${preset.label}${preset.recommended ? '  (recommended default)' : ''} */\n`;
  css += `.ts-preset-${preset.id} {\n${presetBlock(preset, '  ')}\n}\n`;
}

const colorsCssPath = path.join(REPO_ROOT, 'assets', 'css', 'next', 'primitives', 'colors.css');
fs.mkdirSync(path.dirname(colorsCssPath), { recursive: true });
fs.writeFileSync(colorsCssPath, css, 'utf8');

// ════════════════════════════════════════════════════════════════════════
// 2. APCA contrast verification — VERIFY curated values, do not regenerate
// ════════════════════════════════════════════════════════════════════════
const rows = [];
let failCount = 0;

for (const preset of ALL_PRESETS) {
  const bg = preset.tokens['ts-bg-body'];
  const checks = [
    ['text-primary', preset.tokens['ts-text-primary'], APCA_TARGET.primary],
    ['text-secondary', preset.tokens['ts-text-secondary'], APCA_TARGET.secondary],
    ['text-muted', preset.tokens['ts-text-muted'], APCA_TARGET.muted],
  ];
  for (const [label, fg, target] of checks) {
    const lc = Math.abs(calcContrast(fg, bg, 'apca'));
    const pass = lc >= target;
    if (!pass) failCount++;
    rows.push({ preset: preset.id, pair: `${label} on bg-body`, fg, bg, lc, target, pass });
  }
}

// Accent on-ink check (step 6): confirm the threshold formula picks the better ink.
const onAccentLc = Math.abs(calcContrast(onAccentInk, BRAND_ACCENT, 'apca'));
const altInk = onAccentInk === '#ffffff' ? '#000000' : '#ffffff';
const altLc = Math.abs(calcContrast(altInk, BRAND_ACCENT, 'apca'));

// ════════════════════════════════════════════════════════════════════════
// 3. Emit colors-contrast-report.md
// ════════════════════════════════════════════════════════════════════════
const passCount = rows.length - failCount;
let md = `# Color Contrast Report — APCA verification

Generated by \`tools/color-engine/generate-colors.js\` (deterministic; re-run for byte-identical output).

**Method:** apcach \`calcContrast(fg, bg, 'apca')\` on the curated TOOLSKIN_SURFACE_PRESETS hex values.
This VERIFIES the hand-curated presets against APCA targets — it does not regenerate them.

**Targets (text on \`bg-body\`):** primary ≥ Lc ${APCA_TARGET.primary} · secondary ≥ Lc ${APCA_TARGET.secondary} · muted ≥ Lc ${APCA_TARGET.muted}

Targets are role-calibrated floors for the *pre-tuner* curated base values — secondary and
muted are intentionally lower-emphasis text, and the running \`_toolskinApplyContrastToTokenMap\`
tuner adjusts them further at runtime (Option 4 ruling).

**Result: ${passCount}/${rows.length} pairs pass · ${failCount} fail.**

| Preset | Pair | FG | BG | APCA Lc | Target | Verdict |
|---|---|---|---|--:|--:|:--:|
`;
for (const r of rows) {
  md += `| \`${r.preset}\` | ${r.pair} | \`${r.fg}\` | \`${r.bg}\` | ${r.lc.toFixed(2)} | ${r.target} | ${r.pass ? 'PASS' : '**FAIL**'} |\n`;
}

md += `
## Accent on-ink (\`--ts-on-accent\`)

Brand accent \`${BRAND_ACCENT}\` — OKLCH lightness ${(accentL * 100).toFixed(2)}%.
Threshold ${ON_ACCENT_THRESHOLD} (RULING 4): \`clamp(0, (${ON_ACCENT_THRESHOLD} - l) * 999, 1)\` resolves to **${clampResolved >= 0.5 ? '1 → white ink' : '0 → black ink'}**.

| Ink on accent | APCA Lc | Picked by formula |
|---|--:|:--:|
| \`${onAccentInk}\` | ${onAccentLc.toFixed(2)} | yes |
| \`${altInk}\` | ${altLc.toFixed(2)} | no |

${onAccentLc >= altLc
    ? 'The threshold formula picked the higher-contrast ink.'
    : '⚠️ The alternative ink scores higher APCA Lc — the 0.75 threshold did not pick the optimum for this accent.'}
`;

const reportPath = path.join(REPO_ROOT, 'docs', 'handoffs', 'colors-contrast-report.md');
fs.writeFileSync(reportPath, md, 'utf8');

// ════════════════════════════════════════════════════════════════════════
// 4. Emit surface-presets-catalog.json (verbatim TOOLSKIN_SURFACE_PRESETS)
// ════════════════════════════════════════════════════════════════════════
const jsonPath = path.join(REPO_ROOT, 'docs', 'references', 'surface-presets-catalog.json');
fs.writeFileSync(jsonPath, JSON.stringify(SURFACE_PRESETS, null, 2) + '\n', 'utf8');

// ── summary + exit code ───────────────────────────────────────────────────
console.log('generate-colors.js — emitted:');
console.log('  ' + path.relative(REPO_ROOT, colorsCssPath));
console.log('  ' + path.relative(REPO_ROOT, reportPath));
console.log('  ' + path.relative(REPO_ROOT, jsonPath));
console.log(`APCA verification: ${passCount}/${rows.length} pass · ${failCount} fail.`);
if (failCount > 0) {
  console.error(`\n✗ ${failCount} text/surface pair(s) below APCA target — see colors-contrast-report.md.`);
  for (const r of rows.filter((x) => !x.pass)) {
    console.error(`  - ${r.preset} · ${r.pair}: Lc ${r.lc.toFixed(2)} < ${r.target}`);
  }
  process.exit(1);
}
console.log('✓ All pairs meet APCA targets.');
process.exit(0);
