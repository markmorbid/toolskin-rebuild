# Toolskin · Type Scale v2 — Handoff Package

> A single-source, governed type system for the Toolskin design system. Replaces the legacy 8-step scale and the broken "harmonic" extras scale with one honest, rem-based modular ladder, content-aware hero methods, and a composable text-management layer. Drops in on top of the existing `toolskin.css` base.

---

## Package contents

```
toolskin.css                  ← base tokens & fonts (existing; NOT modified)
toolskin-type-v2.css          ← the type system: scale + flex heroes + text utils
Toolskin Type Scale v2.html   ← interactive showcase + live reference
TYPE-HANDOFF.md               ← (this file) — start here
fonts/                        ← Space Grotesk + JetBrains Mono (variable, OFL)
```

Everything uses the `--ts-*` token prefix and `.ts-*` class prefix. The package introduces **no new fonts, colors, or measurement primitives** — it only governs type.

---

## Load order  ·  GLOBAL RULE #1

```html
<!-- 1. base — colors, fonts, neutrals (existing) -->
<link rel="stylesheet" href="toolskin.css">

<!-- 2. type v2 — OVERRIDES the legacy --ts-fs-* scale. Must come AFTER base. -->
<link rel="stylesheet" href="toolskin-type-v2.css">

<!-- 3…n. engines & components (surface, gradients, button) load after. -->
<link rel="stylesheet" href="toolskin-this-bg-v2.css">
<link rel="stylesheet" href="toolskin-gradients-v3.css">
<link rel="stylesheet" href="ts-button.css">
```

`toolskin-type-v2.css` **must** load after `toolskin.css` — it redefines the same `--ts-fs-*` token names with corrected values. Load it before any component CSS so components inherit the corrected scale. The buttons / gradient / surface showcases in this repo have all been updated to this order.

---

## Governance — the global rules

These are binding for every consumer of the design system. They exist because v1 broke each one.

1. **One base, one knob.** Every size derives from `--ts-fs` (the body anchor) and scales through `--ts-type-scale`. Never introduce a second base or a parallel scale.
2. **Name by role, never by raw step.** In product code reach for `--ts-fs-h2`, `--ts-fs-body`, `--ts-fs-caption` — not `--ts-fs-3xl`. Raw steps are the implementation; roles are the contract.
3. **Everything is `rem`.** Never set `html { font-size: <px> }` — it disables browser zoom and OS accessibility text scaling. Drive density through `--ts-type-scale` (`0.92` compact … `1.08` comfortable) on any scope.
4. **Comments must match computed values.** If you change a token, verify its resolved px against `getComputedStyle` and update the comment. No lying comments. (v1 shipped a dozen.)
5. **Every `clamp()` is verified `min < max`.** An inverted clamp silently pins to the min and is invisible in review. The showcase reads live px so inversions surface immediately.
6. **Heroes that fill an area use a flex method, not a bigger step.** The fixed ladder caps at `--ts-fs-display-xl` (76px). Above that, use `--ts-fs-flex-*` (viewport-fill) or `--ts-fs-cq-*` (container-aware) — both clamped.
7. **Truncation is a utility, never an inline hack.** Use the `.ts-truncate` / `.ts-clamp` / `.ts-fade-r` layer. Don't hand-write `-webkit-box` per component.

---

## The scale

Two zones, each with the right job. Resolved px assume root = 16px, `--ts-type-scale: 1`.

### UI zone — px-snapped, functional text

| Token | px | rem | Role |
|---|---|---|---|
| `--ts-fs-4xs` | 10 | 0.625 | Fine print · legibility floor |
| `--ts-fs-3xs` | 11 | 0.6875 | Micro label · eyebrow |
| `--ts-fs-2xs` | 12 | 0.75 | Caption · badge · chip |
| `--ts-fs-xs`  | 13 | 0.8125 | Dense secondary · table cell |
| `--ts-fs-sm`  | 14 | 0.875 | Small body · secondary UI |
| `--ts-fs-md`  | **15** | 0.9375 | **Body / base UI label** ★ |
| `--ts-fs-lg`  | 17 | 1.0625 | Lead paragraph · large UI |
| `--ts-fs-xl`  | 20 | 1.25 | Subhead / h4 · UI→display bridge |

### Display zone — true Major Third (1.25), fluid `clamp()`

| Token | px (min→max) | Role |
|---|---|---|
| `--ts-fs-2xl` | 20 → 24 | h3 |
| `--ts-fs-3xl` | 24 → 30 | h2 |
| `--ts-fs-4xl` | 30 → 38 | h1 |
| `--ts-fs-display-md` | 38 → 48 | Display · pricing |
| `--ts-fs-display-lg` | 48 → 60 | Display large |
| `--ts-fs-display-xl` | 60 → 76 | Hero display |

### Semantic aliases (use these in code)

```
--ts-fs-h1 … --ts-fs-h6   headings (h3/h2/h1 ride the fluid display steps)
--ts-fs-body   --ts-fs-body-sm   --ts-fs-lead
--ts-fs-caption   --ts-fs-small   --ts-fs-eyebrow
```

### Companion tokens

```
--ts-lh-display 1.05 · -tight 1.1 · -snug 1.25 · -normal 1.5 · -relaxed 1.65 · -loose 1.8
--ts-tracking-tightest -0.04em … -normal 0 … -widest 0.14em
--ts-font-weight-thin 300 … -bold 700   (Space Grotesk axis caps at 700)
```

### Utility classes

```
.ts-display-xl .ts-display .ts-h1–.ts-h4 .ts-lead .ts-body .ts-body-sm
.ts-caption .ts-eyebrow .ts-label .ts-mono
```

---

## Flex & content-aware heroes

For type that must **fill its area** at any aspect ratio — the one thing the fixed ladder can't do.

### Viewport-fill · `vw + vh + vmin`

```css
.hero-title { font-size: var(--ts-fs-flex-hero); }   /* clamp(2.75rem, 4vw+4vh+2vmin, 8.5rem) */
```

Tracks the viewport **area** at any ratio. `vw` over-grows on wide screens and under-grows on tall ones; `vh` is the inverse; `vmin` corrects the diagonal. The scalars sum to a "fill budget" — more on `vmin` = steadier across extreme ratios. Always clamped. Tiers: `--ts-fs-flex-hero` · `-display` · `-title`. Classes: `.ts-flex-hero` · `.ts-flex-display` · `.ts-flex-title` (all set `text-wrap: balance`).

### Container-aware · `cqi`

```css
.card { container-type: inline-size; }     /* or add class .ts-cq */
.card .title { font-size: var(--ts-fs-cq-hero); }   /* clamp(2rem, 12cqi, 7rem) */
```

Sizes to the nearest **inline-size container**, not the viewport — so a hero inside a card, split layout, or sidebar scales to *its* box. `cqi` = 1% of the query container's inline size. Requires an ancestor with `container-type: inline-size` (use `.ts-cq`). Tiers: `--ts-fs-cq-hero` · `-display` · `-title`. Classes: `.ts-cq` (the container marker) + `.ts-cq-hero` · `-display` · `-title`.

| Use when… | Method |
|---|---|
| Full-bleed landing hero, splash, full-screen wordmark | `.ts-flex-*` (viewport) |
| Hero inside a card / panel / split / sidebar | `.ts-cq` + `.ts-cq-*` (container) |
| Heading in a normal document flow | the fixed ladder (`--ts-fs-h1` …) |

---

## Text management

Composable single-purpose utilities. Stack them: `class="ts-clamp ts-clamp-3 ts-pretty"`.

| Class | Effect |
|---|---|
| `.ts-truncate` | single-line ellipsis (needs constrained width) |
| `.ts-clamp` + `.ts-clamp-1…6` | multi-line clamp with ellipsis; lines via `--ts-clamp-lines` |
| `.ts-balance` | `text-wrap: balance` — even ragged lines for headlines (≤6 lines) |
| `.ts-pretty` | `text-wrap: pretty` — no orphan word on the last body line |
| `.ts-nowrap` | prevent wrapping |
| `.ts-break` | force-wrap long URLs / IDs / code (`overflow-wrap: anywhere`) |
| `.ts-hyphens` | `hyphens: auto` (needs `lang=""` on an ancestor) |
| `.ts-fade-r` | soft trailing-edge mask — alternative to a hard ellipsis (`--ts-fade-length`) |
| `.ts-tnum` / `.ts-onum` | tabular / oldstyle numerals (align digits in tables, counters) |
| `.ts-caps` / `.ts-smallcaps` | uppercase tracked / small-caps |
| `.ts-text-accent` | accent-tinted display ink (clip-path gradient, no new color) |

---

## Tuning cheat sheet

| You want | Change |
|---|---|
| Compact UI density (one scope) | `--ts-type-scale: 0.92` |
| Comfortable density | `--ts-type-scale: 1.08` |
| Bigger / smaller body everywhere | `--ts-fs: calc(<rem> * var(--ts-type-scale))` |
| More dramatic headings | `--ts-ratio-display: 1.333` (Perfect Fourth) |
| Calmer headings | `--ts-ratio-display: 1.2` (Minor Third) |
| A hero that fills the screen | `.ts-flex-hero` |
| A hero that fills its card | `.ts-cq` on the card + `.ts-cq-hero` on the title |
| Clamp a description to N lines | `.ts-clamp` + `--ts-clamp-lines: N` (or `.ts-clamp-N`) |
| Align numbers in a table | `.ts-tnum` |

---

## Migration from v1 (the harmonic / extras scale)

v2 is a **drop-in**: every public token name is preserved, so existing markup keeps rendering. What changed under the hood:

- **`--ts-fs-md` body: 13/14px → 15px.** The old files disagreed; 15 is the reconciled anchor.
- **`--ts-fs-h3` fixed.** Was an inverted clamp (pinned to min). Now a valid 20→24px fluid step.
- **`--ts-fs-eyebrow`: 9px → 11px** for legibility.
- **`--ts-fs-ratio` removed as decorative** — the display ladder now genuinely computes on `--ts-ratio-display: 1.25`.
- **`--ts-fs-hero` preserved** as the oversized wordmark clamp (outside the ladder, on purpose).

If a layout depended on the old 13px body, set `--ts-fs: calc(0.8125rem * var(--ts-type-scale))` on that scope.

---

## Browser support

- **Chrome 119+ · Safari 17.4+ · Firefox 121+** — full support.
- Feature requirements:
  - `clamp()`, `rem`, `vmin` — universal.
  - `cqi` + `container-type` (container-aware heroes) — Chrome 105+ / Safari 16+ / Firefox 110+.
  - `text-wrap: balance` — Chrome 114+ / Firefox 121+; `pretty` — Chrome 117+. Both degrade gracefully to normal wrapping.
  - `line-clamp` standard form behind `-webkit-line-clamp` fallback (shipped in both).

---

## Verification checklist

Before shipping a type change, confirm:

- [ ] `toolskin-type-v2.css` loads **after** `toolskin.css`
- [ ] New sizes reach through a `--ts-fs-*` role token, not a raw px or a raw step
- [ ] `html` font-size is **not** overridden in px; density uses `--ts-type-scale`
- [ ] Every new `clamp()` verified `min < max` (the showcase reads live px)
- [ ] Comments match computed px values
- [ ] Heroes that fill an area use `.ts-flex-*` or `.ts-cq-*`, both clamped
- [ ] Truncation uses the `.ts-clamp` / `.ts-truncate` layer, not inline `-webkit-box`

---

*Type Scale v2 · single source · rem-based · content-aware heroes · governed text management · clean `.ts-` namespace.*
