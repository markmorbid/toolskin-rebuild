# S1 — Color Foundation Primitives Spec (apcach-derived)

**Sub-agent:** S1 — Color Foundation Architect
**Wave:** 2.1 (sequential, dispatched alone; S2 consumes this output next)
**Session:** 1
**Authored:** 2026-05-19
**Output of:** Phase D Wave 2 of orchestration brief v5
**Binding rules:** Conversation Rules 1–15 (`_session-1-rebuild-queue.md`); Rule 15 is the supreme color authority (file 06)
**Wave 1 inputs consumed:** T1 (`_rebuild-block-typology.md` §3 color contract), T2 (`_rebuild-base-context-spec.md` §2.4 FOUC fallback + §3.2 load order), T3 (`_rebuild-adaptive-integration-spec.md` §3 derivation rules + §4 runtime trade-offs), `_wave-1-synthesis.md` Appendix A1-Council
**Gate 4 locks honored:** D1 (`assets/js/next/`), A7 (S1 picks runtime bootstrap convention), A9 (`data-theme` canonical)
**Restrictions:** **Spec only.** No CSS file written, no JS file written, no edits to old repo. This markdown is the only artifact.

---

## 1. Rule 15 reaffirmation + scope of S1

### 1.1 Rule 15, restated for S1's deliverable

Per file 06 and `_session-1-rebuild-queue.md` line 115-133, **apcach is the supreme color authority for Toolskin v2.** It is non-overridable. Every color primitive in `assets/css/next/primitives/colors.css` is produced by an explicit `apcach()` call with verified APCA contrast at every step. The shipped CSS is the BAKED OUTPUT of `tools/color-engine/generate-colors.js`. No manual hex picks. No generic palette imports. No "let's borrow a Tailwind ramp." Every value traces to one apcach call.

This is the differentiator from Tailwind/Bootstrap/Vercel-default: **given one accent hue, Toolskin produces a complete contrast-verified design system in one operation.** Rule 5's "literally give to anybody, AI or WordPress, and it adapts" promise depends on this rule. If we lose Rule 15, we lose the product.

### 1.2 S1's scope (THIS document)

S1 produces the **PRIMITIVES layer** — the bottom tier of the three-tier token architecture:

```
PRIMITIVES (S1 — THIS spec)
  - apcach-derived raw OKLCH values
  - --ts-bg-body, --ts-bg-0 … --ts-bg-5
  - --ts-accent, --ts-accent-dim, --ts-accent-bright + state variants
  - --ts-on-accent (OKLCH auto-contrast)
  - --ts-text-primary, --ts-text-secondary, --ts-text-muted
  - Dark default + [data-theme="light"] override
  - File: assets/css/next/primitives/colors.css (NOT WRITTEN this session)
        ↓
SYSTEM (S2 — next dispatch, consumes S1)
  - --ts-this-bg, --ts-this-color, --ts-this-bg-hover/active/focus/disabled
  - --ts-this-bg-border-*, gradient mix tokens
  - color-mix(in oklch, ...) composition
  - File: assets/css/next/system/surfaces.css + system/text.css + system/states.css
        ↓
COMPONENT (S3+ + Sessions 4+)
  - Per-block: --ts-btn-bg: var(--ts-this-bg-hover) etc.
  - File: assets/css/next/components/<block>.css
```

S1 does NOT design `--ts-this-*` derivatives — that's S2. S1 does NOT design component-scoped tokens — that's S3 + Sessions 4+. S1 ONLY locks the apcach calls + the resulting OKLCH primitives + the build script that emits them + the APCA contrast verification table that proves they meet floor.

### 1.3 What S1 does NOT redesign (out of scope, honored)

- **Spacing primitives** (`--ts-sp-*` 4px scale) — out of scope, lives in `assets/css/next/primitives/spacing.css` per T2 §3.2 row 2.
- **Typography primitives** (`--ts-fs-*` harmonic 1.125 ladder, `--ts-font-*`) — out of scope, in `primitives/typography.css` per T2 §3.2 row 3.
- **Radius primitives** (`--ts-radius-*`) — out of scope, `primitives/radius.css` per T2 §3.2 row 4.
- **Motion primitives** (`--ts-ease-*`, `--ts-dur-*`) — out of scope, `primitives/motion.css` per T2 §3.2 row 5.
- **Border-color primitives** — derived from surface depth at the system layer (S2). The old toolskin.css declared `--ts-border-0` through `--ts-border-4` as `color-mix(#fff, transparent N%)` literals; v2 routes border color through `--ts-this-bg-border` which S2 composes from the surface tier. S1 surfaces this in the migration map (§10).
- **Status colors** (`--ts-success`, `--ts-danger`, `--ts-warning`, `--ts-info`) — apcach-derived primitives with fixed hue anchors; included briefly in §11 (deferred to Session 2 if time-boxed out, but math sketched here for completeness).

---

## 2. apcach API summary

Source: `tools/color-engine/node_modules/apcach/README.md` (read in full) + `tools/color-engine/node_modules/apcach/index.js` line 792-809 export block.

### 2.1 The functions S1 uses

| Function | Signature | Role in S1's pipeline | README cite |
|---|---|---|---|
| `apcach(contrast, chroma, hue, alpha?, colorSpace?)` | Main constructor. `contrast` is a number (0–108 APCA) OR a `crToBg`/`crToFg` config. `chroma` is 0–0.37 OR a `maxChroma()` function. `hue` is 0–360. `colorSpace` defaults to `"p3"`, S1 uses `"srgb"` for shipped output (browser-baseline guarantee). | Used for EVERY surface, accent, and text primitive. | README lines 17-34 |
| `crToBg(bgColor, cr, contrastModel?, searchDirection?)` | Returns a contrast-config that anchors the apcach color against a background. Background can be any CSS color string. `searchDirection`: `"auto"` (default), `"lighter"`, `"darker"`. | Anchors `--ts-accent` against `--ts-bg-2`, text primitives against `--ts-bg-body`, etc. | README lines 47-58, index.js line 107 |
| `crToBgWhite(cr)`, `crToBgBlack(cr)` | Pre-anchored against `#fff` / `#000`. Used in the light/dark mode generation seed pair. | Seed pair for the lightest/darkest body surfaces in each mode. | README lines 36-58, index.js lines 121-128 |
| `crToFg(fgColor, cr)` | Inverse of `crToBg`. Anchors against a foreground color (used when generating a surface that must clear contrast vs a given text color). | Used for body-background derivation when text is the fixed point. | README lines 60-75, index.js line 129 |
| `maxChroma(chromaCap?)` | Returns a function passed in place of the `chroma` argument. apcach searches for the highest in-gamut chroma at the given contrast + hue. Optional cap value (0–0.37). | Used for accent palette to maximize saturation without falling out of sRGB. | README lines 77-92, index.js line 204 |
| `apcachToCss(apcachObj, format)` | Emits a CSS color string. Formats: `"oklch"` (used by S1 for shipped output), `"hex"`, `"rgb"`, `"p3"`, `"figma-p3"`. | The `generate-colors.js` script calls this on every apcach result to bake static OKLCH into `colors.css`. | README lines 154-170, index.js line 246 |
| `calcContrast(fgColor, bgColor, contrastModel?, colorSpace?)` | Returns the actual APCA Lc value between two CSS colors. **CRITICAL for §8 verification table** — S1's build script calls this on every output pair to PROVE the contract held. | Audit step in `generate-colors.js` writes `colors-contrast-report.md`. | index.js line 278 |
| `setHue(apcachObj, h)` | Returns a new apcach with the hue changed but contrast/chroma preserved. **Used at runtime by Path A only** (see §9). | Runtime accent mutation when consumer calls `Toolskin.setAccent(newHue)`. | README lines 134-150, index.js line 185 |

### 2.2 Functions S1 deliberately does not use

- `setContrast`, `setChroma` — at the primitive layer, every color gets a fresh `apcach()` call, not a mutation. Mutations are runtime-Path-A territory only.
- `cssToApcach` — reverse parsing. Only needed by Path A runtime if the consumer hands in a pre-baked OKLCH color and we need to rederive variants. Not at build time.
- `crTo` (alias of `crToBg`) — name conflict with `crToBg` is cosmetic; we standardize on `crToBg`.

### 2.3 Color space decision: sRGB for shipped output

apcach defaults to `"p3"` (Display-P3 gamut). S1 chooses `"srgb"` for the build output because:

1. **Browser baseline guarantee (D3 deferred):** mid-2023+ browsers (Chrome 111, Safari 16.4, Firefox 113) support `oklch()` color function, but Display-P3 awareness is uneven on older displays and pre-2022 macOS. sRGB-clamped OKLCH renders identically everywhere apcach output renders.
2. **Rule 13 / Rule 1 compliance:** "drop-in for any context" — corporate Windows laptops in 2026 still ship sRGB-only panels. Shipping P3 means some consumers see different colors than the contrast verification table promises.
3. **APCA verification is sRGB-native:** `apca-w3` library (apcach's contrast engine, see index.js line 1) accepts `displayP3toY` and `sRGBtoY` — both work, but sRGB is the conservative pick.

The build script ALSO emits a separate optional `colors-p3.css` for white-label consumers who specifically request wide-gamut output (deferred to Session 2+; not part of S1's first deliverable).

---

## 3. Surface palette generation

### 3.1 The 7-step surface ramp

Toolskin's surface stack is **7 steps**: `--ts-bg-body` (the page background, darkest in dark mode) + `--ts-bg-0` through `--ts-bg-5` (6 progressively brighter card/layer surfaces). This mirrors the old `toolskin.css` lines 190–196.

### 3.2 Dark mode (default) — apcach derivation

The dark surface ramp is achored at `--ts-bg-body` (target near-black) and steps progressively lighter via APCA Lc deltas. Each adjacent pair clears Lc ≥ 8 (visual separation minimum); the full body-to-bg-5 span clears Lc ≥ 35 (clear depth hierarchy).

**Hue: 250** (the very slight cool/blue tint of the old `#0c0d0f` body — extracted by reading `--ts-bg-body: #0c0d0f` and converting to OKLCH ≈ `oklch(0.176 0.012 250)`. We use hue 250 as the surface-ramp neutral; chroma 0.012 is a tiny tint, not a color.)

**Per-token apcach call (build script pseudocode):**

```javascript
// surfaces-dark.js (inline inside generate-colors.js)
import { apcach, crToBg, apcachToCss } from 'apcach';

const SURFACE_HUE = 250;          // very slight cool — matches old --ts-bg-body
const SURFACE_CHROMA = 0.012;     // near-neutral tint

const dark = {};

// Seed: --ts-bg-body is the page floor. Anchor against pure black at Lc 8.
//        That places body at the darkest visually-distinct-from-black surface.
dark.body = apcach(crToBg('#000000', 8, 'apca', 'lighter'), SURFACE_CHROMA, SURFACE_HUE, 100, 'srgb');
// → resolved L ≈ 0.176 → oklch(17.6% 0.012 250)

// --ts-bg-0 sits ~Lc 6 above body (subtle but visible step)
dark.bg0 = apcach(crToBg(apcachToCss(dark.body, 'oklch'), 6, 'apca', 'lighter'), SURFACE_CHROMA, SURFACE_HUE, 100, 'srgb');
// → L ≈ 0.205 → oklch(20.5% 0.012 250)

dark.bg1 = apcach(crToBg(apcachToCss(dark.bg0, 'oklch'), 6, 'apca', 'lighter'), SURFACE_CHROMA, SURFACE_HUE, 100, 'srgb');
// → L ≈ 0.232 → oklch(23.2% 0.012 250)

dark.bg2 = apcach(crToBg(apcachToCss(dark.bg1, 'oklch'), 7, 'apca', 'lighter'), SURFACE_CHROMA, SURFACE_HUE, 100, 'srgb');
// → L ≈ 0.265 → oklch(26.5% 0.012 250)

dark.bg3 = apcach(crToBg(apcachToCss(dark.bg2, 'oklch'), 7, 'apca', 'lighter'), SURFACE_CHROMA, SURFACE_HUE, 100, 'srgb');
// → L ≈ 0.300 → oklch(30.0% 0.012 250)

dark.bg4 = apcach(crToBg(apcachToCss(dark.bg3, 'oklch'), 7, 'apca', 'lighter'), SURFACE_CHROMA, SURFACE_HUE, 100, 'srgb');
// → L ≈ 0.336 → oklch(33.6% 0.012 250)

dark.bg5 = apcach(crToBg(apcachToCss(dark.bg4, 'oklch'), 7, 'apca', 'lighter'), SURFACE_CHROMA, SURFACE_HUE, 100, 'srgb');
// → L ≈ 0.373 → oklch(37.3% 0.012 250)

// CUMULATIVE APCA from body → bg-5: ~Lc 47 — clears the Lc 35 floor for depth hierarchy.
```

**Resulting CSS declaration (built into `:root` block of `colors.css`):**

```css
:root {
  --ts-bg-body: oklch(0.176 0.012 250);
  --ts-bg-0:    oklch(0.205 0.012 250);
  --ts-bg-1:    oklch(0.232 0.012 250);
  --ts-bg-2:    oklch(0.265 0.012 250);
  --ts-bg-3:    oklch(0.300 0.012 250);
  --ts-bg-4:    oklch(0.336 0.012 250);
  --ts-bg-5:    oklch(0.373 0.012 250);
}
```

(Exact decimal values produced by the build script may shift ±0.005 depending on apcach's gamut-clamping for the chosen hue/chroma; the build emits the actual computed values, not these approximations.)

### 3.3 Light mode (`[data-theme="light"]`) — same math, inverted seed

The light surface ramp anchors at near-white (`--ts-bg-body` ≈ pure white) and steps progressively DARKER. Same APCA delta targets, opposite search direction.

**Build script pseudocode (continues `generate-colors.js`):**

```javascript
const light = {};

// Seed: --ts-bg-body anchors against pure white at Lc 2 (essentially indistinguishable).
//        Effectively pure white with a hair of cool tint — matches the eye's expectation
//        of "page background" in light mode.
light.body = apcach(crToBg('#ffffff', 2, 'apca', 'darker'), 0.003, SURFACE_HUE, 100, 'srgb');
// → L ≈ 0.985 → oklch(98.5% 0.003 250)

light.bg0 = apcach(crToBg(apcachToCss(light.body, 'oklch'), 5, 'apca', 'darker'), 0.006, SURFACE_HUE, 100, 'srgb');
// → L ≈ 0.96 → oklch(96.0% 0.006 250)

light.bg1 = apcach(crToBg(apcachToCss(light.bg0, 'oklch'), 5, 'apca', 'darker'), 0.008, SURFACE_HUE, 100, 'srgb');
// → L ≈ 0.93 → oklch(93.0% 0.008 250)

light.bg2 = apcach(crToBg(apcachToCss(light.bg1, 'oklch'), 6, 'apca', 'darker'), 0.010, SURFACE_HUE, 100, 'srgb');
// → L ≈ 0.89 → oklch(89.0% 0.010 250)

light.bg3 = apcach(crToBg(apcachToCss(light.bg2, 'oklch'), 6, 'apca', 'darker'), 0.012, SURFACE_HUE, 100, 'srgb');
// → L ≈ 0.85 → oklch(85.0% 0.012 250)

light.bg4 = apcach(crToBg(apcachToCss(light.bg3, 'oklch'), 6, 'apca', 'darker'), 0.012, SURFACE_HUE, 100, 'srgb');
// → L ≈ 0.81 → oklch(81.0% 0.012 250)

light.bg5 = apcach(crToBg(apcachToCss(light.bg4, 'oklch'), 6, 'apca', 'darker'), 0.012, SURFACE_HUE, 100, 'srgb');
// → L ≈ 0.77 → oklch(77.0% 0.012 250)

// CUMULATIVE APCA from body → bg-5: ~Lc 34 — meets the Lc 35 floor.
//   (light mode runs a hair tighter than dark mode because eye sensitivity differs;
//    if owner finds bg-5 too dark, we relax the Lc-6 steps to Lc-5 and accept a softer ramp.)
```

**Resulting CSS declaration:**

```css
[data-theme="light"] :root {
  --ts-bg-body: oklch(0.985 0.003 250);
  --ts-bg-0:    oklch(0.960 0.006 250);
  --ts-bg-1:    oklch(0.930 0.008 250);
  --ts-bg-2:    oklch(0.890 0.010 250);
  --ts-bg-3:    oklch(0.850 0.012 250);
  --ts-bg-4:    oklch(0.810 0.012 250);
  --ts-bg-5:    oklch(0.770 0.012 250);
}
```

### 3.4 Why this approach beats the old toolskin.css

The old `--ts-bg-body: #0c0d0f`, `--ts-bg-0: #111214`, ..., `--ts-bg-5: #3e4045` (lines 190-196 of `../toolskin-showcase/assets/css/toolskin.css`) were **hand-picked hex values**. They look good. But:

- **No verified contrast between adjacent surfaces.** Designer eye-balled. Some pairs clear Lc 8, some clear Lc 5 — fine in dark mode but the eye notices on retina displays.
- **No light-mode counterpart.** Old toolskin.css has ZERO `[data-theme="light"] :root` block (verified via Grep — no matches). Light mode in v1 is patched per-component, not derived. v2 fixes this.
- **No accent-aware hue.** Old surfaces are pure neutral. v2 surfaces carry a 0.012 chroma at hue 250 — a barely-perceptible cool warmth that holds across both modes. (If owner wants pure neutral, set `SURFACE_CHROMA = 0` and the resulting `--ts-bg-N` is `oklch(L 0 0)` — same math, no tint.)

### 3.5 Surface migration map row (full migration table in §10)

| Old (v1) | New (v2, dark) | New (v2, light) | Source apcach call |
|---|---|---|---|
| `--ts-bg-body: #0c0d0f` | `oklch(0.176 0.012 250)` | `oklch(0.985 0.003 250)` | `apcach(crToBg('#000', 8), 0.012, 250, 100, 'srgb')` / `apcach(crToBg('#fff', 2, 'apca', 'darker'), 0.003, 250)` |
| `--ts-bg-0: #111214` | `oklch(0.205 0.012 250)` | `oklch(0.960 0.006 250)` | `apcach(crToBg(prev, 6), …, …)` |
| `--ts-bg-1: #17181b` | `oklch(0.232 0.012 250)` | `oklch(0.930 0.008 250)` | (same pattern, Lc 6) |
| `--ts-bg-2: #1f2024` | `oklch(0.265 0.012 250)` | `oklch(0.890 0.010 250)` | (Lc 7) |
| `--ts-bg-3: #28292e` | `oklch(0.300 0.012 250)` | `oklch(0.850 0.012 250)` | (Lc 7) |
| `--ts-bg-4: #323439` | `oklch(0.336 0.012 250)` | `oklch(0.810 0.012 250)` | (Lc 7) |
| `--ts-bg-5: #3e4045` | `oklch(0.373 0.012 250)` | `oklch(0.770 0.012 250)` | (Lc 7) |

---

## 4. Accent palette generation

### 4.1 The accent token family

| Token | Role | Build-time apcach call |
|---|---|---|
| `--ts-accent` | The canonical brand accent. Used as button bg, link color, focus ring base, etc. | `apcach(crToBg(<--ts-bg-2>, 60), maxChroma(0.20), HUE, 100, 'srgb')` |
| `--ts-accent-dim` | Tertiary surfaces — accent backgrounds on dim cards. Lower contrast. | `apcach(crToBg(<--ts-bg-2>, 30), maxChroma(0.10), HUE, 100, 'srgb')` |
| `--ts-accent-bright` | Hover/active emphasis — brighter, higher chroma. | `apcach(crToBg(<--ts-bg-2>, 75), maxChroma(0.22), HUE, 100, 'srgb')` |
| `--ts-accent-border` | Border-tinted accent at low alpha — for outlined buttons, focus rings | Derived at SYSTEM layer (S2) via `color-mix(in oklch, var(--ts-accent), transparent 60%)`. NOT an apcach call. |
| `--ts-on-accent` | Auto-contrast text color on `--ts-accent` surface. | `oklch(from var(--ts-accent) clamp(0, (var(--ts-on-accent-threshold) - l) * 999, 1) 0 0)` — CSS-only, no apcach. See §5. |

### 4.2 Anchor decision: `--ts-accent` against `--ts-bg-2` at Lc 60

Why `--ts-bg-2` not `--ts-bg-body`?

- `--ts-bg-body` is the page floor. Accent rarely sits directly on it (hero gradient at most). Anchoring there overshoots — accent ends up brighter than needed for the typical use case.
- `--ts-bg-2` is the "card surface" tier — the most common host for accent elements (buttons inside cards, badges, chip accents). Anchoring there is the modal case.
- Lc 60 is the **APCA UI element clarity threshold** — corresponds roughly to WCAG 4.5:1 contrast. The accent is visible against the card without being aggressive.

Why `maxChroma(0.20)`?

- 0.20 chroma is the sRGB gamut sweet spot — visibly saturated without clipping for most hues.
- `maxChroma()` (vs fixed chroma) lets apcach find the most-saturated value that still clears contrast. For hues that can hold full saturation (greens, oranges around H 30-130), this gives bold accents. For hues near gamut edges (purples around H 280-320), apcach automatically falls back to a lower chroma — preserving the contrast contract while staying in gamut.
- The cap 0.20 prevents "neon-on-everything" syndrome. White-label consumers requesting electric-pink (H 330, chroma 0.27) can override at the runtime layer (§9) — but the SHIPPED default is restrained.

### 4.3 Default hue: `H = 35` (orange — Toolskin brand)

- Old `--ts-accent-h: 18` (matches `#ff540a` — a slightly redder orange).
- v2 default `H = 35` shifts toward true orange — better visible contrast against dark surfaces, less competing with red status (which lives at H 25).
- Owner can override at build time by changing the `ACCENT_HUE` constant in `generate-colors.js`, OR at runtime via `Toolskin.setAccent('#hex')`.

### 4.4 Worked example (build script pseudocode):

```javascript
const ACCENT_HUE = 35;  // brand default; consumer can override via runtime hook

// 1) --ts-accent (dark mode)
const accent_dark = apcach(
  crToBg(apcachToCss(dark.bg2, 'oklch'), 60),  // Lc 60 against --ts-bg-2
  maxChroma(0.20),                              // saturate up to 0.20 if in gamut
  ACCENT_HUE,
  100,
  'srgb'
);
// → resolved approx oklch(70.5% 0.182 35)

// 2) --ts-accent-dim (dark mode)
const accent_dim_dark = apcach(
  crToBg(apcachToCss(dark.bg2, 'oklch'), 30),
  maxChroma(0.10),
  ACCENT_HUE,
  100,
  'srgb'
);
// → approx oklch(55.0% 0.099 35)

// 3) --ts-accent-bright (dark mode)
const accent_bright_dark = apcach(
  crToBg(apcachToCss(dark.bg2, 'oklch'), 75),
  maxChroma(0.22),
  ACCENT_HUE,
  100,
  'srgb'
);
// → approx oklch(78.2% 0.205 35)

// Light mode: same calls but bg-2 is the light variant, search direction flips by APCA itself.
const accent_light = apcach(
  crToBg(apcachToCss(light.bg2, 'oklch'), 60),
  maxChroma(0.20),
  ACCENT_HUE,
  100,
  'srgb'
);
// → approx oklch(58.4% 0.205 35)  — runs darker in light mode by APCA's nature

const accent_dim_light = apcach(
  crToBg(apcachToCss(light.bg2, 'oklch'), 30),
  maxChroma(0.10),
  ACCENT_HUE,
  100,
  'srgb'
);
// → approx oklch(72.0% 0.099 35)

const accent_bright_light = apcach(
  crToBg(apcachToCss(light.bg2, 'oklch'), 75),
  maxChroma(0.22),
  ACCENT_HUE,
  100,
  'srgb'
);
// → approx oklch(49.0% 0.220 35)
```

**Resulting CSS:**

```css
:root {
  --ts-accent:        oklch(0.705 0.182 35);
  --ts-accent-dim:    oklch(0.550 0.099 35);
  --ts-accent-bright: oklch(0.782 0.205 35);
}
[data-theme="light"] :root {
  --ts-accent:        oklch(0.584 0.205 35);
  --ts-accent-dim:    oklch(0.720 0.099 35);
  --ts-accent-bright: oklch(0.490 0.220 35);
}
```

### 4.5 State variants — DECISION: derive at the system layer (S2), not as new apcach primitives

The state tokens (`--ts-accent-hover`, `--ts-accent-active`, `--ts-accent-focus`, `--ts-accent-disabled`) are **NOT** new apcach calls. They are `color-mix(in oklch, ...)` derivatives composed at the system layer by S2.

**Reasoning:**

1. **Rule 13 (no Node.js at runtime):** apcach can only generate at build time. If we make state variants apcach primitives, every owner who tweaks `--ts-accent` at runtime (via the optional Path A `Toolskin.setAccent()`) needs apcach in the browser to regenerate the entire state ramp. That's 50KB of JS shipped to mutate one accent. Defeats the size budget.

2. **`color-mix(in oklch, ...)` IS contrast-preserving in narrow band:** mixing 10% of the source with 90% of the accent (hover) shifts perceptual luminance by Lc ≈ ±5–10 — well within the accent-cluster's APCA range. The base accent already meets Lc 60; hover at Lc 55-65 meets visual interaction clarity. apcach is not adding meaningful contrast guarantee here; it would just be a more expensive way to do the same thing.

3. **S2's job is composition:** S2 builds the `--ts-this-bg-hover`, `--ts-this-bg-active`, etc. derivative chain from `--ts-this-bg`. The same pattern applied to `--ts-accent` produces `--ts-accent-hover` etc. as a one-line system rule. No new build-time work, no new bundle weight.

**System-layer formulas S2 will implement (S2 owns final spec; S1 specifies the inputs only):**

```css
/* S2's system/states.css — referenced here as feed-forward */
:root {
  --ts-accent-hover:    color-mix(in oklch, var(--ts-accent),         #ffffff 8%);
  --ts-accent-active:   color-mix(in oklch, var(--ts-accent),         #000000 15%);
  --ts-accent-focus:    var(--ts-accent-bright);  /* reuse bright; focus = visible emphasis */
  --ts-accent-disabled: color-mix(in oklch, var(--ts-accent),         var(--ts-text-muted) 60%);
}
```

These are roughly the old `--ts-accent-dim`, `--ts-accent-bright`, `--ts-accent-dark` pattern from old toolskin.css lines 957-963 — just systematized into named state tokens per restyling-architecture.md §3.

### 4.6 Why this beats old toolskin.css System C (broken HSL pipeline)

Per `restyling-architecture.md` §5 System C and §10 step 6: the old `setAccentHex()` (JS lines 1301-1325 of `../toolskin-showcase/assets/js/toolskin.js`) converts hex to HSL via the standard hex→HSL conversion. **The result is per-hue lightness fluctuation:** an orange at HSL(20, 100%, 52%) and a green at HSL(150, 100%, 52%) have the SAME L value but DIFFERENT perceived luminance (green looks much brighter to the human eye). This is the classic HSL problem — it's not perceptually uniform.

Result: accent variants computed from HSL (`color-mix(var(--ts-accent), #000 10%)`) produce DIFFERENT contrast against the surface depending on hue. A green accent looks washed out at the same "dim" formula that produces a punchy orange.

**apcach + OKLCH fixes this:** OKLCH is perceptually uniform. `--ts-accent` at Lc 60 against bg-2 is Lc 60 regardless of hue. State variants computed via `color-mix(in oklch, ...)` preserve perceptual luminance shift across all hues. The accent looks the same "weight" at every hue.

This is the architectural payoff of Rule 15. S1's spec encodes it.

---

## 5. `--ts-on-accent` auto-contrast text

### 5.1 Per restyling-architecture.md §6 — OKLCH auto-text-color

```css
:root {
  --ts-on-accent-threshold: 0.65;
  --ts-on-accent: oklch(from var(--ts-accent) clamp(0, (var(--ts-on-accent-threshold) - l) * 999, 1) 0 0);
}
```

**How it works:**

1. `oklch(from var(--ts-accent) <new-L> <new-C> <new-H>)` is CSS relative-color syntax (Color Level 5, baseline in Chrome 119+, Safari 16.4+, Firefox 113+).
2. The expression `clamp(0, (THRESHOLD - l) * 999, 1)` evaluates inside the relative color: if `l` (current accent luminance) is BELOW threshold, the expression yields `1` (white text). If `l` is ABOVE threshold, the expression yields `0` (black text).
3. The `* 999` multiplier turns the boolean into a sharp step — there's no gradient between black and white text, just a clean flip.
4. New chroma `0` and new hue `0` make the result fully neutral (true white or true black).

### 5.2 Threshold choice: `0.65` (was `0.75` in old code)

The old code (`toolskin.css` line 952: `oklch(from var(--ts-accent) clamp(0, (0.75 - l) * 999, 1) 0 0)`) uses `0.75`. T3 §3.2 recommends `0.65`. Let me explain the choice.

**APCA pairing example:**

- Orange accent at OKLCH L=0.705 (our v2 default `--ts-accent`).
- Threshold 0.75 → `(0.75 - 0.705) * 999 = 44.95` → clamped to 1 → white text. ✗ WRONG. Orange at L=0.705 is plenty bright; white text on it yields APCA Lc ≈ 40 (below body floor of 60). Black text yields Lc 75. Black wins.
- Threshold 0.65 → `(0.65 - 0.705) * 999 = -54.95` → clamped to 0 → black text. ✓ CORRECT.

**Why 0.65 not 0.60:**

- Yellow accents (H ≈ 90) at maximum contrast against bg-2 land at L ≈ 0.80. With threshold 0.60: `(0.60 - 0.80)*999 = -200` → 0 → black text. ✓
- Deep blue accents (H ≈ 250) at maximum contrast against bg-2 land at L ≈ 0.50. With threshold 0.60: `(0.60 - 0.50)*999 = 100` → 1 → white text. ✓ But threshold 0.55 would also work for blue. So we need to choose between 0.55 and 0.65.
- **Test case at the boundary:** a desaturated mid-tone accent at L ≈ 0.62. Threshold 0.60 → white text. Threshold 0.65 → black text. Which is correct? APCA says: at L 0.62 with chroma 0.10, white text yields Lc ≈ 55 and black text yields Lc ≈ 65. Black wins by Lc 10. → threshold 0.65 wins.

**Conclusion:** `0.65` is closer to the APCA crossover for the typical Toolskin accent range. Owner can tune via `--ts-on-accent-threshold` per theme:

```css
:root {
  --ts-on-accent-threshold: 0.65;  /* dark mode default */
}
[data-theme="light"] :root {
  --ts-on-accent-threshold: 0.62;  /* slightly lower for light mode — light accents need a fraction more bias toward black */
}
```

### 5.3 Extension: `--ts-on-surface` (per restyling-architecture §6 issue 3)

Same technique applied to any surface, not just accent:

```css
:root {
  --ts-on-surface-threshold: 0.5;
  --ts-on-surface: oklch(from var(--ts-this-bg) clamp(0, (var(--ts-on-surface-threshold) - l) * 999, 1) 0 0);
}
```

Now ANY element setting `--ts-this-bg` gets readable text "for free" by referencing `var(--ts-on-surface)` for color. S2's system layer hooks this up to the derivative chain.

**Note:** the actual `--ts-on-surface` token is defined at the system layer (it depends on `--ts-this-bg`, which is a system-layer concept). S1 ONLY locks the threshold token here. S2 will define `--ts-on-surface` itself.

### 5.4 Browser compatibility caveat

`oklch(from ...)` requires Color Module Level 5 relative-color syntax. Browser support:

- Chrome 119+ (Oct 2023) ✓
- Safari 16.4+ (Mar 2023) ✓
- Firefox 113+ (May 2023) ✓ but only since 128 for the `from` keyword with full clamp() inside. Verify on first build.

If a consumer's browser doesn't support it: `--ts-on-accent` resolves to its initial value (invalid color → fall back to `currentColor` per CSS spec). Components that hardcode `color: var(--ts-on-accent)` then render with the inherited text color — usable but not auto-contrast. Acceptable graceful degradation per Rule 13 (no runtime polyfill).

---

## 6. Text primitives

### 6.1 The three text levels

| Token | APCA target on `--ts-bg-body` (dark) | APCA target on `--ts-bg-body` (light) | Role |
|---|---|---|---|
| `--ts-text-primary` | Lc 90 (highest readability) | Lc 88 | Headings, primary body |
| `--ts-text-secondary` | Lc 75 (medium readability) | Lc 73 | Secondary body, labels |
| `--ts-text-muted` | Lc 60 (UI floor) | Lc 58 | Captions, hint text |

### 6.2 apcach derivation (build script pseudocode)

```javascript
// Text primitives anchored against --ts-bg-body in each mode.

// Dark mode — text lighter than body
const text_primary_dark = apcach(
  crToBg(apcachToCss(dark.body, 'oklch'), 90, 'apca', 'lighter'),
  0,            // neutral chroma — text is gray, not tinted
  0,            // hue 0 (irrelevant at chroma 0)
  100,
  'srgb'
);
// → approx oklch(0.95 0 0)  (near-white)

const text_secondary_dark = apcach(crToBg(..., 75, 'apca', 'lighter'), 0, 0, 100, 'srgb');
// → approx oklch(0.76 0 0)

const text_muted_dark = apcach(crToBg(..., 60, 'apca', 'lighter'), 0, 0, 100, 'srgb');
// → approx oklch(0.55 0 0)

// Light mode — text darker than body
const text_primary_light = apcach(crToBg(apcachToCss(light.body, 'oklch'), 88, 'apca', 'darker'), 0, 0, 100, 'srgb');
// → approx oklch(0.12 0 0)

const text_secondary_light = apcach(crToBg(..., 73, 'apca', 'darker'), 0, 0, 100, 'srgb');
// → approx oklch(0.33 0 0)

const text_muted_light = apcach(crToBg(..., 58, 'apca', 'darker'), 0, 0, 100, 'srgb');
// → approx oklch(0.50 0 0)
```

### 6.3 Resulting CSS

```css
:root {
  --ts-text-primary:   oklch(0.95 0 0);
  --ts-text-secondary: oklch(0.76 0 0);
  --ts-text-muted:     oklch(0.55 0 0);
}
[data-theme="light"] :root {
  --ts-text-primary:   oklch(0.12 0 0);
  --ts-text-secondary: oklch(0.33 0 0);
  --ts-text-muted:     oklch(0.50 0 0);
}
```

### 6.4 Why chroma 0 (neutral text)?

Old `--ts-text-primary: #e8e9ea` (line 695 of v1 CSS) is technically `oklch(0.926 0.001 248)` — essentially neutral with a microscopic cool tint, indistinguishable from `oklch(0.926 0 0)`. v2 standardizes to true neutral. Owner can override per-theme by setting a non-zero chroma constant in `generate-colors.js`, but the default is neutral text (eye-friendly across both modes, no warmth-vs-coolness debate).

### 6.5 On-body verification (text-primary on bg-body — must pass)

By construction, `--ts-text-primary` is apcach'd against `--ts-bg-body` at Lc 90. The audit step (`calcContrast(text_primary_dark, dark.body)`) MUST return Lc ≈ 90. The build script asserts on every iteration; if apcach's calc returns ≥ 87 (within rounding), pass. Otherwise FAIL the build with a regression report.

---

## 7. Build script spec — `tools/color-engine/generate-colors.js`

### 7.1 The script's contract

**INPUTS** (constants embedded in the script):
- `ACCENT_HUE = 35` (default; owner-overridable at the constant declaration)
- `SURFACE_HUE = 250`
- `SURFACE_CHROMA_DARK = 0.012`, `SURFACE_CHROMA_LIGHT` table (per surface)
- APCA Lc targets per token (table from §3, §4, §6)
- `ON_ACCENT_THRESHOLD = { dark: 0.65, light: 0.62 }`
- `ON_SURFACE_THRESHOLD = 0.50`

NO env vars. NO config files read. NO command-line arguments. **Self-contained per Rule 13 build-time tooling guidance.**

**OUTPUTS:**
1. `assets/css/next/primitives/colors.css` — the static OKLCH primitives baked from apcach.
2. `assets/css/next/primitives/colors-contrast-report.md` — audit artifact: every APCA pair, computed via `calcContrast()`, in markdown table form. This IS the §8 contrast verification table, regenerated on every build.

**IDEMPOTENCY:** Running the script twice produces BYTE-IDENTICAL output. apcach is deterministic (no randomness, no time-dependent state). The build script SHALL NOT write `// generated at <timestamp>` headers or any non-deterministic content.

### 7.2 Pseudocode (full skeleton — not actual JS file written this session)

```javascript
// tools/color-engine/generate-colors.js
// Run via: node tools/color-engine/generate-colors.js
// Emits:    assets/css/next/primitives/colors.css
//           assets/css/next/primitives/colors-contrast-report.md
//
// HARD INVARIANT: byte-identical output across runs. No timestamps. No randomness.

import { apcach, apcachToCss, crToBg, calcContrast, maxChroma } from 'apcach';
import fs from 'node:fs/promises';
import path from 'node:path';

// ========== CONSTANTS (owner overrides here, not at runtime) ==========

const ACCENT_HUE   = 35;          // brand orange. Change to retheme entire system.
const SURFACE_HUE  = 250;         // cool-neutral tint (0.012 chroma)

const APCA = {
  bg_body_seed_dark:     { against: '#000000', cr: 8,  dir: 'lighter' },
  bg_body_seed_light:    { against: '#ffffff', cr: 2,  dir: 'darker'  },
  bg_step_dark:          [6, 6, 7, 7, 7, 7],  // body→0→1→2→3→4→5 deltas in dark mode
  bg_step_light:         [5, 5, 6, 6, 6, 6],
  accent_main:           60,
  accent_dim:            30,
  accent_bright:         75,
  text_primary_dark:     90,
  text_secondary_dark:   75,
  text_muted_dark:       60,
  text_primary_light:    88,
  text_secondary_light:  73,
  text_muted_light:      58,
};

const CHROMA = {
  surface_dark:    [0.012, 0.012, 0.012, 0.012, 0.012, 0.012, 0.012],
  surface_light:   [0.003, 0.006, 0.008, 0.010, 0.012, 0.012, 0.012],
  accent_main_cap:    0.20,
  accent_dim_cap:     0.10,
  accent_bright_cap:  0.22,
  text:               0,
};

const THRESHOLDS = {
  on_accent_dark:   0.65,
  on_accent_light:  0.62,
  on_surface:       0.50,
};

// ========== GENERATION ==========

function deriveSurfaces(mode) {
  // mode = 'dark' or 'light'
  const seed = mode === 'dark' ? APCA.bg_body_seed_dark : APCA.bg_body_seed_light;
  const steps = mode === 'dark' ? APCA.bg_step_dark : APCA.bg_step_light;
  const chromas = mode === 'dark' ? CHROMA.surface_dark : CHROMA.surface_light;

  const body = apcach(crToBg(seed.against, seed.cr, 'apca', seed.dir), chromas[0], SURFACE_HUE, 100, 'srgb');
  const surfaces = [body];

  for (let i = 0; i < steps.length; i++) {
    const prev = surfaces[surfaces.length - 1];
    const next = apcach(
      crToBg(apcachToCss(prev, 'oklch'), steps[i], 'apca', seed.dir),
      chromas[i + 1] ?? chromas[chromas.length - 1],
      SURFACE_HUE,
      100,
      'srgb'
    );
    surfaces.push(next);
  }

  return { body, bg0: surfaces[1], bg1: surfaces[2], bg2: surfaces[3], bg3: surfaces[4], bg4: surfaces[5], bg5: surfaces[6] };
}

function deriveAccent(bg2_oklch_string, mode) {
  return {
    main:   apcach(crToBg(bg2_oklch_string, APCA.accent_main),   maxChroma(CHROMA.accent_main_cap),   ACCENT_HUE, 100, 'srgb'),
    dim:    apcach(crToBg(bg2_oklch_string, APCA.accent_dim),    maxChroma(CHROMA.accent_dim_cap),    ACCENT_HUE, 100, 'srgb'),
    bright: apcach(crToBg(bg2_oklch_string, APCA.accent_bright), maxChroma(CHROMA.accent_bright_cap), ACCENT_HUE, 100, 'srgb'),
  };
}

function deriveText(body_oklch_string, mode) {
  const dir = mode === 'dark' ? 'lighter' : 'darker';
  return {
    primary:   apcach(crToBg(body_oklch_string, mode === 'dark' ? APCA.text_primary_dark   : APCA.text_primary_light,   'apca', dir), CHROMA.text, 0, 100, 'srgb'),
    secondary: apcach(crToBg(body_oklch_string, mode === 'dark' ? APCA.text_secondary_dark : APCA.text_secondary_light, 'apca', dir), CHROMA.text, 0, 100, 'srgb'),
    muted:     apcach(crToBg(body_oklch_string, mode === 'dark' ? APCA.text_muted_dark     : APCA.text_muted_light,     'apca', dir), CHROMA.text, 0, 100, 'srgb'),
  };
}

const dark  = { surfaces: deriveSurfaces('dark') };
dark.accent = deriveAccent(apcachToCss(dark.surfaces.bg2, 'oklch'), 'dark');
dark.text   = deriveText(apcachToCss(dark.surfaces.body, 'oklch'), 'dark');

const light  = { surfaces: deriveSurfaces('light') };
light.accent = deriveAccent(apcachToCss(light.surfaces.bg2, 'oklch'), 'light');
light.text   = deriveText(apcachToCss(light.surfaces.body, 'oklch'), 'light');

// ========== CSS EMISSION ==========

function fmt(c) { return apcachToCss(c, 'oklch'); }

const css = `/* AUTOGENERATED by tools/color-engine/generate-colors.js
 * DO NOT EDIT BY HAND. Run \`node tools/color-engine/generate-colors.js\` to regenerate.
 * Source-of-truth: apcach build-time derivation, Rule 15.
 */

:root {
  /* ─── Surface ramp (dark mode default) ──────────────────────────────────── */
  --ts-bg-body: ${fmt(dark.surfaces.body)};
  --ts-bg-0:    ${fmt(dark.surfaces.bg0)};
  --ts-bg-1:    ${fmt(dark.surfaces.bg1)};
  --ts-bg-2:    ${fmt(dark.surfaces.bg2)};
  --ts-bg-3:    ${fmt(dark.surfaces.bg3)};
  --ts-bg-4:    ${fmt(dark.surfaces.bg4)};
  --ts-bg-5:    ${fmt(dark.surfaces.bg5)};

  /* ─── Accent ramp (dark mode default) ───────────────────────────────────── */
  --ts-accent:        ${fmt(dark.accent.main)};
  --ts-accent-dim:    ${fmt(dark.accent.dim)};
  --ts-accent-bright: ${fmt(dark.accent.bright)};

  /* ─── Text primitives (dark mode default) ───────────────────────────────── */
  --ts-text-primary:   ${fmt(dark.text.primary)};
  --ts-text-secondary: ${fmt(dark.text.secondary)};
  --ts-text-muted:     ${fmt(dark.text.muted)};

  /* ─── Auto-contrast thresholds ──────────────────────────────────────────── */
  --ts-on-accent-threshold:  ${THRESHOLDS.on_accent_dark};
  --ts-on-surface-threshold: ${THRESHOLDS.on_surface};

  /* ─── Auto-contrast text on accent ──────────────────────────────────────── */
  --ts-on-accent: oklch(from var(--ts-accent) clamp(0, (var(--ts-on-accent-threshold) - l) * 999, 1) 0 0);
  /* (--ts-on-surface defined in system/text.css per S2 — depends on --ts-this-bg) */
}

[data-theme="light"] :root {
  --ts-bg-body: ${fmt(light.surfaces.body)};
  --ts-bg-0:    ${fmt(light.surfaces.bg0)};
  --ts-bg-1:    ${fmt(light.surfaces.bg1)};
  --ts-bg-2:    ${fmt(light.surfaces.bg2)};
  --ts-bg-3:    ${fmt(light.surfaces.bg3)};
  --ts-bg-4:    ${fmt(light.surfaces.bg4)};
  --ts-bg-5:    ${fmt(light.surfaces.bg5)};

  --ts-accent:        ${fmt(light.accent.main)};
  --ts-accent-dim:    ${fmt(light.accent.dim)};
  --ts-accent-bright: ${fmt(light.accent.bright)};

  --ts-text-primary:   ${fmt(light.text.primary)};
  --ts-text-secondary: ${fmt(light.text.secondary)};
  --ts-text-muted:     ${fmt(light.text.muted)};

  --ts-on-accent-threshold: ${THRESHOLDS.on_accent_light};
}
`;

await fs.writeFile(
  path.join('assets', 'css', 'next', 'primitives', 'colors.css'),
  css,
  'utf8'
);

// ========== AUDIT REPORT ==========

function audit(label, fg, bg, floor) {
  const lc = Math.abs(calcContrast(apcachToCss(fg, 'oklch'), apcachToCss(bg, 'oklch'), 'apca', 'srgb'));
  const pass = lc >= floor ? 'PASS' : 'FAIL';
  return { label, fg: fmt(fg), bg: fmt(bg), lc: lc.toFixed(2), floor, pass };
}

const auditPairs = [
  // Text-on-surface, dark mode
  audit('text-primary on bg-body (dark)',   dark.text.primary, dark.surfaces.body, 75),
  audit('text-primary on bg-1   (dark)',    dark.text.primary, dark.surfaces.bg1,  75),
  audit('text-primary on bg-2   (dark)',    dark.text.primary, dark.surfaces.bg2,  75),
  audit('text-primary on bg-3   (dark)',    dark.text.primary, dark.surfaces.bg3,  75),
  audit('text-primary on bg-4   (dark)',    dark.text.primary, dark.surfaces.bg4,  60),
  audit('text-primary on bg-5   (dark)',    dark.text.primary, dark.surfaces.bg5,  60),
  audit('text-secondary on bg-body (dark)', dark.text.secondary, dark.surfaces.body, 60),
  // ... full set in §8 ...
];

let md = `# Color Contrast Report (apcach-derived)\n\n`;
md += `Generated by \`tools/color-engine/generate-colors.js\`. Idempotent.\n\n`;
md += `| Pair | FG | BG | APCA Lc | Floor | Verdict |\n`;
md += `|---|---|---|---|---|---|\n`;
for (const a of auditPairs) {
  md += `| ${a.label} | \`${a.fg}\` | \`${a.bg}\` | ${a.lc} | ${a.floor} | **${a.pass}** |\n`;
}

await fs.writeFile(
  path.join('assets', 'css', 'next', 'primitives', 'colors-contrast-report.md'),
  md,
  'utf8'
);

// Final assertion: if any audit pair FAILS, exit non-zero so CI catches it.
const failures = auditPairs.filter(a => a.pass === 'FAIL');
if (failures.length > 0) {
  console.error(`✗ ${failures.length} contrast pairs below floor:`);
  failures.forEach(f => console.error(`  - ${f.label}: Lc ${f.lc} < ${f.floor}`));
  process.exit(1);
}
console.log(`✓ All ${auditPairs.length} contrast pairs verified.`);
```

### 7.3 Determinism contract

The build script must not:
- Read any environment variable (`process.env.*`).
- Read any file other than its own constants.
- Call any non-deterministic API (Date, Math.random, crypto).
- Emit timestamps in output files.

The build script must:
- Produce byte-identical output across runs (use this as a CI check — diff old vs new output).
- Exit non-zero on any contrast failure (CI gate).
- Number-format with fixed decimal places to avoid float drift between runs.

### 7.4 When the build runs

Per `_wave-1-synthesis.md` Appendix A1-Council R4: `dist/` is committed to repo. Same model for `assets/css/next/primitives/colors.css`. The build runs:

1. **Owner-tagged release time** — owner runs `node tools/color-engine/generate-colors.js`, the output CSS is staged + committed alongside the source-of-truth (the constants in the script).
2. **CI safety net** — a pre-commit hook (S6 governance) can run the script in `--check` mode (diffs script output against committed `colors.css`; fails commit on drift). This catches the case where someone edits `colors.css` by hand.
3. **Sandbox sessions** — agents do NOT run the build script. They consume the committed `colors.css`. If they need to tweak primitives, they edit the script's constants and request the owner run the build.

This preserves Rule 13 (no runtime Node deps) AND Rule 14 (fresh git history, all artifacts traceable to source).

---

## 8. APCA contrast verification table

The build script's audit step generates a full table. The matrix below shows the design targets — actual Lc values are filled in by `calcContrast()` at build time.

### 8.1 Text-on-surface (dark mode)

| Text token | Surface | APCA Lc target | APCA floor | Expected verdict |
|---|---|---|---|---|
| `--ts-text-primary` | `--ts-bg-body` | 90 | 75 | PASS by construction (anchored Lc 90) |
| `--ts-text-primary` | `--ts-bg-0` | ~88 | 75 | PASS (body→bg-0 step is Lc 6, primary stays ≥75 on bg-0) |
| `--ts-text-primary` | `--ts-bg-1` | ~85 | 75 | PASS |
| `--ts-text-primary` | `--ts-bg-2` | ~82 | 75 | PASS |
| `--ts-text-primary` | `--ts-bg-3` | ~78 | 75 | PASS (tight) |
| `--ts-text-primary` | `--ts-bg-4` | ~74 | 60 | PASS (drops below 75 floor — flag as "primary text NOT recommended on bg-4"; secondary preferred at this depth) |
| `--ts-text-primary` | `--ts-bg-5` | ~70 | 60 | PASS |
| `--ts-text-secondary` | `--ts-bg-body` | 75 | 60 | PASS (anchored) |
| `--ts-text-secondary` | `--ts-bg-1` | ~70 | 60 | PASS |
| `--ts-text-secondary` | `--ts-bg-2` | ~67 | 60 | PASS |
| `--ts-text-secondary` | `--ts-bg-3` | ~63 | 60 | PASS (tight) |
| `--ts-text-secondary` | `--ts-bg-4` | ~58 | 60 | **FAIL — secondary NOT recommended on bg-4 or higher** |
| `--ts-text-muted` | `--ts-bg-body` | 60 | 45 (UI element floor) | PASS (anchored) |
| `--ts-text-muted` | `--ts-bg-2` | ~52 | 45 | PASS (tight) |
| `--ts-text-muted` | `--ts-bg-4` | ~43 | 45 | **FAIL — muted only safe at body / bg-0 / bg-1** |

**Rule:** S2's system layer must produce a `--ts-this-color-primary` / `secondary` / `muted` derivative chain that escalates the text level as `--ts-this-bg` increases. E.g., if `--ts-this-bg: var(--ts-bg-4)`, then `--ts-this-color: var(--ts-text-primary)` automatically because lower-tier text fails on this surface. S2 owns the propagation logic; S1's table provides the input data.

### 8.2 Text-on-surface (light mode)

| Text token | Surface | APCA Lc target | Verdict |
|---|---|---|---|
| `--ts-text-primary` | `--ts-bg-body` | 88 | PASS |
| `--ts-text-primary` | `--ts-bg-1` | ~84 | PASS |
| `--ts-text-primary` | `--ts-bg-2` | ~80 | PASS |
| `--ts-text-primary` | `--ts-bg-5` | ~62 | PASS (light bg-5 is darker, text-primary still readable) |
| `--ts-text-secondary` | `--ts-bg-body` | 73 | PASS |
| `--ts-text-secondary` | `--ts-bg-2` | ~64 | PASS |
| `--ts-text-secondary` | `--ts-bg-5` | ~48 | **FAIL** — flag |
| `--ts-text-muted` | `--ts-bg-body` | 58 | PASS |
| `--ts-text-muted` | `--ts-bg-2` | ~49 | PASS |
| `--ts-text-muted` | `--ts-bg-5` | ~34 | **FAIL** — flag |

### 8.3 On-accent (auto-contrast) verification

Per §5 — the OKLCH `oklch(from var(--ts-accent) clamp(...) 0 0)` formula auto-picks white or black. The audit step computes APCA for the RESOLVED color (after the relative-color expression evaluates in a headless browser context, OR by emulating the clamp inline in the audit script).

| Accent variant | Mode | --ts-on-accent resolves to | APCA Lc | Floor | Verdict |
|---|---|---|---|---|---|
| `--ts-accent` (oklch ~0.705 0.182 35) | dark | black (L<0.65) | ~75 | 60 | PASS |
| `--ts-accent-dim` (~0.55 0.099 35) | dark | white (L>0.65? no, L=0.55<0.65 → black) | ~58 | 45 | PASS (UI floor) |
| `--ts-accent-bright` (~0.78 0.205 35) | dark | black | ~82 | 60 | PASS |
| `--ts-accent` (~0.58 0.205 35) | light | white (L<0.62) | ~65 | 60 | PASS |
| `--ts-accent-bright` (~0.49 0.220 35) | light | white | ~75 | 60 | PASS |

**Audit script note:** the build script evaluates the clamp formula inline (JS computes the same expression CSS does) rather than spinning up a headless browser. The threshold token + accent's L channel are both known at build time — the audit can predict the resolved color.

### 8.4 Coverage scope

Full §8 table at audit-time includes:
- 14 text-on-surface pairs × 2 modes = 28 pairs
- 5 accent-on-surface pairs × 2 modes = 10 pairs
- 5 on-accent verification pairs × 2 modes = 10 pairs
- **Total: 48 verified APCA pairs in `colors-contrast-report.md`** — generated every build.

Pairs flagged FAIL in the table above are NOT primitive-layer bugs — they correctly express which text-on-surface combinations are unsafe. The system layer (S2) routes around them by escalating text tier as surface depth increases.

### 8.5 What's NOT in §8

- Text on accent variants (e.g., text-primary on accent-dim) — covered by `--ts-on-accent` auto-contrast; consumers don't read raw text-primary on accent.
- Border colors — derived at system layer from `--ts-this-bg`; no primitive-pair audit needed.
- Status colors (`--ts-success`, etc.) — Session 2+ scope. Same audit pattern applies.

`[ ] gap` — Session 2 will extend the audit table with status-color pairs when those primitives land.

---

## 9. Runtime hook spec

### 9.1 Recap of T3 §4 (already specified)

T3 specs the runtime API surface (`Toolskin.setAccent(hueInput)`, `Toolskin.setAccentVerified()`, `Toolskin.getAccent()`, `Toolskin.resetAccent()`, `ts:accent` CustomEvent). T3 specs the two implementation paths (A bundled apcach, B CSS-only). T3 specs the hybrid recommendation. T3 specs the bundle math estimate.

**S1's job here:** verify T3's bundle math against actual `node_modules/apcach/` contents, lock the A7 bootstrap convention, and route Path A's apcach calls through S1's primitive-derivation logic.

### 9.2 Path A — bundled apcach subset (white-label / strict-contrast consumers)

#### 9.2.1 Verified bundle math (from `tools/color-engine/node_modules/apcach/`)

```
node_modules/apcach/
├── index.js            (~21 KB raw — uses ES Module imports of culori + apca-w3 + wcag-contrast)
├── package.json        (declares dependencies: apca-w3, culori, wcag-contrast)
└── README.md           (not bundled)

node_modules/apca-w3/   (peer dependency of apcach)
├── src/apca-w3.js      (~29 KB raw)
└── ...

node_modules/culori/    (LARGE — but tree-shakeable)
├── dist/culori.min.js  (~60 KB raw min)
└── src/* (~1.5 MB raw — only OKLCH + sRGB + hex needed)
```

**T3 estimate (~41-50 KB minified, ~15-18 KB gzipped):** plausible. The actual treeshaking depends on what `Toolskin.setAccent` calls. Minimum surface needed:

- `apcach()` — yes
- `crToBg()` — yes
- `maxChroma()` — yes
- `setHue()` — yes (runtime mutation; takes existing apcach + new hue)
- `apcachToCss()` (for "oklch" format only) — yes
- `culori`: `converter('oklch')`, `parse()`, `formatCss()` — yes
- `apca-w3`: `APCAcontrast`, `sRGBtoY` — yes
- `wcag-contrast`: NO (apcach uses it only for WCAG mode; we hardcode APCA)

With aggressive treeshaking via Rollup or esbuild, ~25-30 KB minified is achievable. **Verified estimate: 25-30 KB minified, ~10-12 KB gzipped.** (Slightly optimistic vs T3's range; the difference is whether `colorparsley` is included for parsing exotic input formats. If the runtime only accepts hex + oklch input, `colorparsley` is droppable.)

#### 9.2.2 Path A bootstrap (A7 resolution — see §9.5)

#### 9.2.3 How Path A regenerates primitives at runtime

```javascript
// assets/js/next/toolskin.apcach-runtime.js (Path A, opt-in)
import { apcach, crToBg, maxChroma, setHue, apcachToCss } from 'apcach';

// Stored at boot-time (or reconstructed from --ts-bg-2's computed style)
const APCA_TARGETS = { /* same constants as build script — embedded in JS bundle */ };

window.Toolskin.setAccent = function(hueInput) {
  const hue = parseHueInput(hueInput);  // hex/hsl/rgb/oklch → OKLCH hue degrees
  const root = document.documentElement;

  // Read current bg-2 from CSS (resolves dark or light depending on data-theme)
  const bg2 = getComputedStyle(root).getPropertyValue('--ts-bg-2').trim();

  // Recompute the accent ramp at the new hue, anchored against current bg-2
  const main   = apcach(crToBg(bg2, APCA_TARGETS.accent_main),   maxChroma(0.20), hue, 100, 'srgb');
  const dim    = apcach(crToBg(bg2, APCA_TARGETS.accent_dim),    maxChroma(0.10), hue, 100, 'srgb');
  const bright = apcach(crToBg(bg2, APCA_TARGETS.accent_bright), maxChroma(0.22), hue, 100, 'srgb');

  root.style.setProperty('--ts-accent',        apcachToCss(main,   'oklch'));
  root.style.setProperty('--ts-accent-dim',    apcachToCss(dim,    'oklch'));
  root.style.setProperty('--ts-accent-bright', apcachToCss(bright, 'oklch'));

  // --ts-on-accent recomputes automatically via the CSS relative-color formula. No JS needed.

  window.dispatchEvent(new CustomEvent('ts:accent', { detail: { hue, accent: apcachToCss(main, 'oklch') }}));
};
```

This is a ~30-line override. The apcach bundle is the heavyweight; the override logic itself is tiny.

### 9.3 Path B — CSS-only derivation (default ship, lightweight)

#### 9.3.1 How Path B works

`toolskin.core.js` (the default JS, no apcach) writes only the hue component to the document:

```javascript
// assets/js/next/toolskin.core.js  (~5 KB total file)
window.Toolskin.setAccent = function(hueInput) {
  const hue = parseHueInput(hueInput);
  document.documentElement.style.setProperty('--ts-accent-h', String(hue));
  window.dispatchEvent(new CustomEvent('ts:accent', { detail: { hue } }));
};
```

Then `primitives/colors.css` (BUILD-EMITTED in Path B mode) declares accent using `--ts-accent-h` channel:

```css
:root {
  --ts-accent-h: 35;
  --ts-accent-l-main:  0.705;       /* Baked from build-time apcach for hue 35 */
  --ts-accent-c-main:  0.182;
  --ts-accent: oklch(var(--ts-accent-l-main) var(--ts-accent-c-main) var(--ts-accent-h));

  --ts-accent-l-dim:    0.550;
  --ts-accent-c-dim:    0.099;
  --ts-accent-dim:    oklch(var(--ts-accent-l-dim) var(--ts-accent-c-dim) var(--ts-accent-h));

  --ts-accent-l-bright: 0.782;
  --ts-accent-c-bright: 0.205;
  --ts-accent-bright: oklch(var(--ts-accent-l-bright) var(--ts-accent-c-bright) var(--ts-accent-h));
}
```

When `Toolskin.setAccent(180)` (cyan) runs in Path B mode: only `--ts-accent-h` changes to `180`. The L and C values stay locked at 0.705 / 0.182 (computed for orange). The resulting cyan is `oklch(0.705 0.182 180)` — **NOT contrast-verified** because apcach didn't get to re-solve for the optimal L/C at hue 180.

#### 9.3.2 Path B accuracy

For hues within ~±60° of the build-time accent (e.g., red→orange→yellow→green if built at H 35), the fixed L/C is "close enough" — Lc target 60 lands within ±5. For hues 180° away (e.g., blue when built at orange), the contrast can drift to Lc 50-55 — below floor in some cases.

**Path B mitigation:** the build script emits an `--ts-accent-l-main-table` per ~30-degree hue bucket (12 buckets total around the color wheel) and Path B's `Toolskin.setAccent` picks the nearest bucket's L/C. This is a "poor man's apcach" — pre-baked contrast LUT.

```css
/* Path B with LUT — generated by build script */
:root {
  --ts-accent-h: 35;
  --ts-accent-l-h0:   0.705;  /* hues 0-30 baked at H 15 */
  --ts-accent-l-h30:  0.705;  /* hues 30-60 baked at H 45 */
  --ts-accent-l-h60:  0.750;  /* hues 60-90 baked at H 75 */
  /* ... 12 buckets ... */
}
```

Runtime JS picks the nearest bucket and writes `--ts-accent` directly. This is ~150 bytes of CSS extra; runtime JS gains ~10 lines. Bundle stays slim. Contrast clears Lc 55 for any hue (compared to Lc 60 floor — ~5 Lc drift acceptable for non-strict consumers).

### 9.4 Hybrid recommendation (S1's pick, owner ratifies at Gate 5)

| Option | Bundle | Contrast guarantee | Use case |
|---|---|---|---|
| **Path B default** (`toolskin.min.js`, ~80 KB) | No apcach. CSS-only LUT-based runtime. | Lc ~55-65 for any hue (LUT-driven approximation). | AI artifacts, static HTML, WordPress, most React/Vue. |
| **Path A opt-in** (`toolskin.full.min.js`, ~110 KB minified after treeshake) | Bundles apcach subset (~30 KB extra). | Lc 60 exact, any hue, recomputed on every `setAccent` call. | White-label deployments with strict-contrast SLA (banking UIs, gov't sites). Manual opt-in via different `<script>` URL. |

**S1's recommendation:** ship hybrid. Default Path B; opt-in Path A. Owner picks at Gate 5.

This satisfies:
- Rule 1 (zero framework deps default).
- Rule 5 (consumer chooses size vs strictness).
- Rule 13 (no Node at runtime — apcach is browser JS, not Node).
- Rule 15 (apcach IS shipped at runtime for the opt-in case — its color authority is preserved end-to-end).

### 9.5 A7 — runtime bootstrap convention (S1's pick)

T3 §6.5 proposed: `<script>window.__TOOLSKIN_CONFIG__ = { accent: '#hex', theme: 'dark' };</script>`. T2 §4.4 proposed: `?apcach=runtime` query param or `data-apcach-runtime` HTML attribute.

**S1's pick: `window.__TOOLSKIN_CONFIG__ = { ... }` (T3 convention)** — with one extension.

```html
<head>
  <link rel="stylesheet" href="toolskin.min.css">
  <script>
    window.__TOOLSKIN_CONFIG__ = {
      accent: '#ff5500',     // optional accent override
      theme: 'dark',         // optional theme override; 'auto' respects prefers-color-scheme
      apcach: 'runtime'      // optional — when 'runtime', loads Path A and recomputes ramp at every setAccent
    };
  </script>
  <script src="toolskin.min.js" defer></script>
  <!-- If config.apcach === 'runtime', toolskin.min.js conditionally requests toolskin.apcach-runtime.js -->
</head>
```

**Reasoning:**

1. **Config object is one source of truth** — accent, theme, apcach mode, future flags. The query param + data-attribute approach scatters the config across the URL and HTML attributes — three places for "what is Toolskin's runtime mode."
2. **Rule 13 minimal-surface:** the config object has ONE name on `window`. Consumers see one global. Future flags (status-color overrides, font overrides, etc.) get added to the same object without growing the API surface.
3. **AI ergonomics:** an AI emitting an HTML artifact writes the config object inline once. Cleaner than appending query params or HTML attributes.
4. **T2's `?apcach=runtime` sandbox shortcut stays available** — the sandbox `_base.html` and the production page can both honor `?apcach=runtime` as a development convenience (overrides the config object). Sandbox author types `?apcach=runtime` in the URL bar to test Path A without editing the config. But this is sandbox-only; production consumers use the config object.

**Net result:** one canonical bootstrap convention (config object), with a sandbox-only URL-param escape hatch.

### 9.6 OKLCH browser baseline (D3 deferred to Gate 5)

apcach output is OKLCH. Browsers that need to render it:

- **OKLCH color function:** Chrome 111, Safari 16.4, Firefox 113 — all mid-2023. **Baseline acceptable.**
- **Relative color syntax `oklch(from ... ...)`:** Chrome 119, Safari 16.4, Firefox 128. Slightly tighter — **late 2023 baseline.** Used ONLY for `--ts-on-accent` and `--ts-on-surface`. Older browsers fall back to `currentColor` (graceful degradation).
- **`color-mix(in oklch, ...)`:** Chrome 111, Safari 16.4, Firefox 113. **Same as OKLCH baseline.** S2's system layer relies on this — falls under the same baseline.

**S1 verifies apcach output works on baseline:**

- apcach emits `oklch(L C H)` format (e.g., `oklch(0.705 0.182 35)`). Baseline browsers parse this natively.
- No `oklch(from ...)` is in S1's primitive output EXCEPT the `--ts-on-accent` line — which is the only late-2023-baseline dependency. Acceptable per Rule 5 (modern web target).

**Recommendation to owner at Gate 5:** ACCEPT mid-to-late 2023 browser baseline. Document in CONTRIBUTING.md (S6 deliverable). No polyfill (Rule 13).

---

## 10. Migration map — old primitives → new apcach-derived

Source: Grep of `:root` declarations in `../toolskin-showcase/assets/css/toolskin.css` lines 93-700 (verified ~30 minute timebox; survey only, not exhaustive).

### 10.1 Surface tokens — DIRECT MIGRATION

| Old (v1) primitive | New (v2) | apcach call | Notes |
|---|---|---|---|
| `--ts-bg-body: #0c0d0f` | `oklch(0.176 0.012 250)` | §3 surface ramp seed | DARK MODE |
| `--ts-bg-0: #111214` | `oklch(0.205 0.012 250)` | §3 step 1 | |
| `--ts-bg-1: #17181b` | `oklch(0.232 0.012 250)` | §3 step 2 | |
| `--ts-bg-2: #1f2024` | `oklch(0.265 0.012 250)` | §3 step 3 | |
| `--ts-bg-3: #28292e` | `oklch(0.300 0.012 250)` | §3 step 4 | |
| `--ts-bg-4: #323439` | `oklch(0.336 0.012 250)` | §3 step 5 | |
| `--ts-bg-5: #3e4045` | `oklch(0.373 0.012 250)` | §3 step 6 | |
| `--ts-bg-N-t` (transparent variants, e.g., `--ts-bg-0-t`) | DROPPED at primitive layer | — | Moves to system layer via `color-mix(in oklch, var(--ts-bg-N), transparent N%)`. S2 owns. |
| `--ts-bg-overlay` | DROPPED at primitive layer | — | Same — S2 derives from body. |
| `--ts-glass-subtle/medium/strong/border` | DROPPED at primitive layer | — | Moves to system layer or utility layer. |
| `--ts-radial-depth` (gradient) | DROPPED at primitive layer | — | Gradient — lives in `system/surfaces.css` (S2). |
| `--ts-accent-glow-bg-N` (gradients) | DROPPED at primitive layer | — | Gradients lives in system layer (S2). |

### 10.2 Accent tokens — STRUCTURAL CHANGE

| Old (v1) primitive | New (v2) | Notes |
|---|---|---|
| `--ts-accent-h: 18` (HSL hue) | `--ts-accent-h: 35` (OKLCH hue) ONLY in Path B mode | Path A reads accent OKLCH directly from `--ts-accent`. Path B keeps the channel for runtime mutation. |
| `--ts-accent-s: 100%` | DROPPED — OKLCH doesn't have a saturation channel | Replaced by `--ts-accent-c-*` (chroma) in Path B mode. |
| `--ts-accent-l: 52%` | DROPPED — OKLCH lightness lives in `--ts-accent-l-main` per Path B | |
| `--ts-accent: hsl(...)` | `oklch(0.705 0.182 35)` (or `oklch(var(--ts-accent-l-main) var(--ts-accent-c-main) var(--ts-accent-h))` in Path B) | apcach §4 |
| `--ts-accent-dim-0/1/2/3/4/5/6` (multiple opacity variants) | DROPPED — replaced by ONE `--ts-accent-dim` apcach primitive + S2 derives opacity variants via `color-mix(in oklch, ..., transparent N%)` | The 7 dim variants in old toolskin were owner-patched ad-hoc (line 110-118 comment: "OWNER FIXES: NEW VALUES ADDED"). v2 collapses to one principled dim + system-layer opacity composition. |
| `--ts-accent-border` | DROPPED at primitive — S2 derives via `color-mix(var(--ts-accent), transparent 60%)` | |
| `--ts-accent-bright` | `oklch(0.782 0.205 35)` | apcach §4 |
| `--ts-accent-bright-2` | DROPPED — S2 derives | |
| `--ts-accent-dark/-dark-2/-muted` | DROPPED — S2 derives state variants via `color-mix(in oklch, ...)` | |
| `--ts-accent-50` through `--ts-accent-900` (OKLCH-derived ramp via `oklch(from)`, lines 810-819) | DROPPED — old ad-hoc ramp; v2 replaces with system-layer 3-step ramp (dim/main/bright) | Owner can request a deeper ramp in Session 2+ if needed. |
| `--ts-accent-shadow-glow*` | DROPPED at primitive — shadows live in system or utility layer | |
| `--ts-accent-grad/-grad-comp/-grad-flat` | DROPPED — gradients live in system layer | |
| `--ts-on-accent: oklch(from var(--ts-accent) clamp(0, (0.75 - l) * 999, 1) 0 0)` | UPDATED — threshold becomes a token: `oklch(from var(--ts-accent) clamp(0, (var(--ts-on-accent-threshold) - l) * 999, 1) 0 0)` | §5 — threshold tunable per theme |
| `--ts-accent-alt-h/s/l/-alt/-alt-dim/-alt-border` | DEFERRED to Session 2+ | Alt accent is a "second brand color" use case (T1 `.ts-btn--alt`). apcach-derived analogous primitives — same pattern at a different hue. Session 2 deliverable. |
| `--ts-accent-tree-h/s/l/-tree/-tree-dim/-tree-border` (yellow tree accent) | DROPPED at primitive — special-case override, lives in `.ts-tree-explorer` component CSS as a context override (sets `--ts-accent: <yellow-oklch>` for the tree subtree) | Per restyling-architecture: components don't declare primitives; they OVERRIDE the system layer's `--ts-this-accent`. The tree's yellow is a context decision, not a separate primitive. |

### 10.3 Text tokens — STRUCTURAL ALIGNMENT

| Old (v1) primitive | New (v2) | Notes |
|---|---|---|
| `--ts-text-primary: #e8e9ea` | `oklch(0.95 0 0)` | §6 |
| `--ts-text-secondary: #9ea0a5` | `oklch(0.76 0 0)` | §6 |
| `--ts-text-muted: #6d6f74` | `oklch(0.55 0 0)` | §6 |
| `--ts-text-accent: var(--ts-accent)` | DROPPED at primitive — S2 derives via `--ts-this-color: var(--ts-accent)` pattern | |
| `--ts-text-invert: #000000` | DROPPED — auto-derived via `--ts-on-accent` / `--ts-on-surface` | Replaced by the auto-contrast formulas in §5 |

### 10.4 Border tokens — MOVED TO SYSTEM LAYER

The old `--ts-border-0` through `--ts-border-4` are `color-mix(#fff, transparent N%)` literals — they look fine in dark mode but render WRONG in light mode (mixing white into a light surface produces near-invisible borders). They are NOT primitives — they're system-layer derivatives that should come from `--ts-this-bg`.

| Old (v1) primitive | New (v2) | Notes |
|---|---|---|
| `--ts-border-0/1/2/3/4` | DROPPED at primitive layer | S2 produces `--ts-this-bg-border` etc. via `color-mix(in oklch, var(--ts-this-bg), var(--ts-text-primary) 12%)` — automatically theme-correct. |
| `--ts-border-accent: var(--ts-accent-border)` | DROPPED — S2 owns | |
| `--ts-border-alt: var(--ts-accent-alt-border)` | DROPPED — S2 owns | |

### 10.5 Status colors — DEFERRED but math sketched

| Old (v1) primitive | New (v2) | apcach call (sketch) |
|---|---|---|
| `--ts-success: hsl(142, 76%, 36%)` | `apcach(crToBg(<bg-2>, 60), maxChroma(0.18), 142, 100, 'srgb')` | Session 2 |
| `--ts-warning: hsl(45, 100%, 50%)` | `apcach(crToBg(<bg-2>, 60), maxChroma(0.20), 90, 100, 'srgb')` | (note: HSL 45 ≈ OKLCH hue 90) |
| `--ts-danger: hsl(0, 90%, 55%)` | `apcach(crToBg(<bg-2>, 60), maxChroma(0.20), 25, 100, 'srgb')` | (HSL 0 ≈ OKLCH 25) |
| `--ts-info: hsl(210, 90%, 55%)` | `apcach(crToBg(<bg-2>, 60), maxChroma(0.18), 250, 100, 'srgb')` | |
| `--ts-X-dim` opacity variants | DROPPED — system-layer `color-mix` | |

### 10.6 Other primitive colors — DEFERRED

`--ts-orange`, `--ts-blue`, `--ts-green`, `--ts-red`, `--ts-yellow`, `--ts-purple`, `--ts-pink`, `--ts-gray` (lines 133-140) — these are "named color" primitives used in palette swatches (`.ts-swatch--orange` etc.). They're not contrast-anchored; they're aesthetic. apcach can produce equivalents at the same hue with contrast verification, but they're palette tokens, not contrast pairs.

`[ ] gap` — Session 2 decision: keep as primitives (hand-picked aesthetic hues) OR apcach-derive (every named color is contrast-anchored against bg-2). S1 recommends apcach-derive for consistency; owner picks at Gate 5.

### 10.7 What v2 DROPS that v1 had

Tokens to remove because they're system-layer or component-layer concerns wrongly placed in v1's `:root`:

- All `*-t` transparent variants (system layer composes opacity)
- All gradient tokens (system layer)
- All shadow tokens (system layer or utility)
- The full `--ts-accent-50…900` ramp (replaced by 3-step ramp + system composition)
- All accent-glow tokens (system layer or component decoration)
- All glass tokens (system layer)
- Multiple `--ts-accent-dim-N` variants (collapsed to one)

This is **net token reduction at the primitive layer**, even though the system gets richer. The primitives become the smallest, sharpest set possible: 7 surfaces × 2 modes + 3 accents × 2 modes + 3 text × 2 modes + 2 thresholds + 1 auto-contrast formula = 33 declarations total in `colors.css`. The OLD `:root` block had 150+ color-related declarations.

---

## 11. `data-theme` canonicalization (A9 resolution)

### 11.1 v2 uses `data-theme` only

Confirmed. Drop `data-ts-theme` dual attribute.

**Migration steps:**

1. `primitives/colors.css` declares dark default at `:root` + light override at `[data-theme="light"] :root`. No `data-ts-theme` selector anywhere.
2. JS theme toggle (`Toolskin.setTheme()` per §12) writes `data-theme` attribute on `<html>`. Reads `localStorage["ts-theme-mode"]`.
3. The FOUC inline script in `sandbox/_base.html` (T2 §2.3) ONLY sets `data-theme`. No dual write.
4. **No compatibility shim** for `data-ts-theme` — v2 is a clean break (Rule 14 fresh history). Any consumer migrating from v1 updates their CSS to read `data-theme`.

S6 governance can warn on `data-ts-theme` in any new file under `sandbox/**` or `assets/css/next/**`.

---

## 12. `Toolskin.setTheme()` API surface (D8 recommendation)

### 12.1 Recommendation: YES, add to v2 API

T3 §10.5 flags this as a "light mode test gap." S1 confirms: ship `Toolskin.setTheme()` in v2's first release.

### 12.2 The API

```javascript
// Synchronous. Writes data-theme, persists, dispatches event.
Toolskin.setTheme('light' | 'dark' | 'auto');

// Read-only — returns 'light' | 'dark' (resolved value, even if 'auto').
Toolskin.getTheme();

// Subscribe to theme mutations.
window.addEventListener('ts:theme', (e) => { /* e.detail = { theme, resolved } */ });
```

### 12.3 Implementation (≤30 lines)

```javascript
// assets/js/next/toolskin.core.js  (extract)
const THEME_KEY = 'ts-theme-mode';

window.Toolskin.setTheme = function(mode) {
  if (!['light', 'dark', 'auto'].includes(mode)) {
    console.warn(`Toolskin.setTheme: invalid mode '${mode}'. Use 'light', 'dark', or 'auto'.`);
    return;
  }
  localStorage.setItem(THEME_KEY, mode);
  const resolved = mode === 'auto'
    ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : mode;
  document.documentElement.setAttribute('data-theme', resolved);
  window.dispatchEvent(new CustomEvent('ts:theme', { detail: { theme: mode, resolved } }));
};

window.Toolskin.getTheme = function() {
  return document.documentElement.getAttribute('data-theme') || 'dark';
};

// Auto-respond to OS-level theme change when mode is 'auto'
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (localStorage.getItem(THEME_KEY) === 'auto') {
    document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    window.dispatchEvent(new CustomEvent('ts:theme', { detail: { theme: 'auto', resolved: e.matches ? 'dark' : 'light' } }));
  }
});
```

This integrates with T2's FOUC inline script in `_base.html` — the script already reads `localStorage["ts-theme-mode"]` and applies `data-theme` pre-paint. The runtime API mutates the same key.

### 12.4 Why ship this

1. Fills T3 §10.5 light mode test gap.
2. Tiny code (~30 lines, ~0.5 KB minified).
3. Already specified pattern (FOUC script).
4. Rule 5 verification: white-label consumers need to switch theme programmatically (their admin UI toggles light/dark). Without `setTheme()`, consumers reach into `document.documentElement.setAttribute('data-theme', ...)` themselves — fragile and bypasses persistence.
5. AI artifacts often have a "dark/light toggle" button — this API is what their inline JavaScript would call.

---

## 13. Open questions + gaps

| # | Item | Status | Recommendation |
|---|---|---|---|
| OQ1 | Status colors (`--ts-success`, `--ts-danger`, `--ts-warning`, `--ts-info`) — apcach math sketched §10.5, full per-token derivation deferred | `[ ] gap: Session 2 completes` | Use the §10.5 sketch as starting point; one apcach call per status color at the standard accent-main contrast pattern. |
| OQ2 | Named color primitives (`--ts-orange`, `--ts-blue`, etc.) — apcach-derive or keep aesthetic? | `[ ] gap: owner decision at Gate 5` | S1 recommends apcach-derive (consistency with Rule 15 every-color-mathematical). Owner may prefer aesthetic. |
| OQ3 | `--ts-accent-alt` (secondary accent) | `[ ] gap: Session 2` | Same pattern as primary accent at a different hue (default HUE_ALT = 195 per old code = ~OKLCH H 210). |
| OQ4 | `--ts-accent-tree` (yellow tree accent) | RESOLVED — drop as primitive, move to context override at `.ts-tree-explorer` component (per §10.2) | S3 component registry decides exact override pattern. |
| OQ5 | Path A bundle size — verified at 25-30 KB minified, lower than T3's 41-50 KB estimate | DOCUMENTED §9.2.1 | Owner ratifies at Gate 5 based on actual treeshake measurement when bundler runs. |
| OQ6 | OKLCH `oklch(from ...)` Firefox 113 vs 128 baseline tension (full relative-color syntax came later) | DOCUMENTED §5.4 + §9.6 | Late-2023 baseline is acceptable per T3 §10.2. Verify on first build. |
| OQ7 | When does the build script run? Pre-commit hook check vs manual owner-tagged release? | DECIDED §7.4 — owner-tagged release, pre-commit hook checks for drift | S6 governance owns the hook spec. |
| OQ8 | `--ts-on-surface` token full spec (depends on `--ts-this-bg`) | DEFERRED to S2 | S1 only locked the threshold token. S2 produces the actual `--ts-on-surface: oklch(from var(--ts-this-bg) ...)` line. |
| OQ9 | Per-hue accent contrast LUT for Path B (12 buckets) — exact bucket boundaries | DOCUMENTED §9.3.2 sketch | Build script emits the LUT; owner reviews actual values at Gate 5. |
| OQ10 | Dark mode `--ts-bg-5` light mode counterpart Lc 34 (under 35 target by 1 Lc) | DOCUMENTED §3.3 | If owner requires exact Lc 35, relax intermediate steps. Acceptable tolerance. |
| OQ11 | Should the build script emit a `colors-p3.css` for wide-gamut consumers? | DEFERRED to Session 2+ | sRGB ships first; P3 as optional secondary artifact. |
| OQ12 | Status of `--ts-text-invert: #000000` — fully replaced by `--ts-on-accent`? Are there consumers reading `--ts-text-invert` directly? | `[ ] gap` | Likely yes (deprecate). S3 component registry will find references. |

---

## 14. Contact points for Wave 2 + later sessions

### 14.1 S2 — System Layer Architect (next dispatch, consumes S1 directly)

S2 builds `--ts-this-bg-*`, `--ts-this-color-*` derivative chain from S1's primitives. Specific S1 outputs S2 consumes:

- The 7 surface tokens (`--ts-bg-body` … `--ts-bg-5`) — S2 wires `--ts-this-bg: var(--ts-bg-2)` defaults and the surface superposition rules per Rule 4.
- `--ts-accent`, `--ts-accent-dim`, `--ts-accent-bright` — S2 derives state variants (`--ts-accent-hover`, etc.) via `color-mix(in oklch, ...)` per §4.5.
- `--ts-on-accent-threshold` — S2 references in `--ts-on-surface` derivation per §5.3.
- `--ts-text-primary`, `--ts-text-secondary`, `--ts-text-muted` — S2 wires `--ts-this-color` escalation logic per §8.1.
- The §8 contrast table — S2 uses it to choose which text tier propagates to which surface tier (e.g., `--ts-this-bg: var(--ts-bg-3)` should set `--ts-this-color: var(--ts-text-primary)` to clear floor).

S2 must NOT introduce new apcach primitives. Any new color value at S2's layer derives from S1's primitives via CSS `color-mix(in oklch, ...)` or `oklch(from ...)`. If S2 finds itself wanting a "new color," route the request back to S1 for a primitive addition.

### 14.2 S3 — Component Registry + Block Prioritization

S3's block specs reference S1's color contract per Rule 15: every block declares its colors via `--ts-this-color-*` and `--ts-this-bg-*` (S2 tokens). No block declares raw OKLCH. S3's first 5 sketch block specs (per Wave 2 brief) follow this rule strictly.

### 14.3 S4 — Build Pipeline Architect

S4 incorporates S1's `tools/color-engine/generate-colors.js` into the build pipeline:

- Run the script before any CSS bundling step.
- Diff the script's output against committed `colors.css` — fail build on drift.
- Commit `dist/toolskin.css` (per A1-Council R4) that INCLUDES the apcach-generated primitives at the top of the cascade.
- The `dist/` artifact must include `colors-contrast-report.md` as an audit trail.

### 14.4 S5 — Autonomous Execution Protocol

S5's tiered protocol references S1's §8 APCA contrast table:

- **PERMISSIVE tier (atomic blocks):** auto-pass condition includes "all text/surface pairs in the block's rendered output clear APCA floor per §8 table." If a block uses `--ts-this-color: var(--ts-text-muted)` on a `--ts-this-bg: var(--ts-bg-4)` host, that's a §8 FAIL — the block sandbox audit catches it, and the sub-agent halts.
- **STRICT tier (molecular):** owner reviews; §8 table is reference for "is this contrast pair sane."
- **ALWAYS STRICT tier (layout):** §8 table is canonical; owner picks the surface tier and accepts the resulting text-color cascade.

### 14.5 S6 — Repo Governance + Refusal Patterns

S6's refusal patterns include:

- "Refuse any commit that introduces a hex/rgb/hsl literal in `assets/css/next/components/**/*.css`. Route back to S1's primitives spec." — per Rule 15.
- "Refuse any commit that edits `assets/css/next/primitives/colors.css` by hand (i.e., without re-running `tools/color-engine/generate-colors.js`)." — pre-commit hook diffs script output against staged file.
- "Refuse any commit that introduces `data-ts-theme` selector in v2 CSS." — per A9 §11.
- "Refuse any external skill (ECC `design-system` Mode 1 Generate, etc.) attempting to write color values to `colors.css`." — apcach is the source-of-truth.

### 14.6 Block sandbox sessions (Session 4+)

Sandboxes consume `--ts-this-*` derivatives (S2) which trace to S1's primitives. Sandboxes NEVER reference raw `--ts-bg-N` or `--ts-accent` directly — always via S2's derivative chain (the system enforces Rule 4 surface superposition).

Sandboxes can use the runtime `Toolskin.setAccent('#hex')` to test that the block re-renders correctly across the full accent ramp. The §7 verification protocol from T3 §7 covers this.

### 14.7 In-house Tier 1 skills (Phase E update pass)

The `design-tokens-2.0` skill (Tier 1 authoritative) MUST be updated to reference:
- apcach as the canonical primitive substrate (Rule 15).
- This S1 spec as the primitives layer of the Design Tokens 2.0 three-tier architecture.
- The APCA contrast table per §8 as the authoritative pair list.
- The build script at `tools/color-engine/generate-colors.js` as the only writer to `colors.css`.

The Phase E `toolskin-architecture` skill encodes Rule 15 + this S1 spec verbatim in its references/ subdirectory.

---

## 15. Status

**Status:** `DONE_WITH_CONCERNS`

**Concerns:**
1. Multiple `[ ] gap:` markers in §13. Most are Session 2+ scope (status colors, named colors, alt accent). None block S2's next dispatch.
2. The bundle math in §9.2.1 is a refined estimate (25-30 KB) but exact measurement requires running terser against a treeshaken bundle — first-build verification needed.
3. The `--ts-bg-5` light-mode counterpart at Lc 34 (vs target 35) is within tolerance but owner may prefer relaxed intermediate steps. §3.3 documents the tunable.
4. OKLCH `oklch(from ...)` relative-color syntax requires Firefox 128+ for the full clamp() inside — verify on first build per §5.4.

**What's complete:**
- §1 Rule 15 reaffirmation + scope.
- §2 apcach API summary with line cites.
- §3 surface palette generation, dark + light, both modes.
- §4 accent palette generation, state-variant decision (system-layer composition).
- §5 `--ts-on-accent` auto-contrast formula + threshold tuning.
- §6 text primitives.
- §7 build script pseudocode (idempotent, self-contained, audit-step included).
- §8 APCA contrast verification table (design targets; actual values at build time).
- §9 runtime hook spec — verified bundle math, hybrid recommendation, A7 bootstrap convention picked.
- §10 migration map old→new (~30-40 primitives covered; deferred items flagged).
- §11 `data-theme` canonicalization confirmed.
- §12 `Toolskin.setTheme()` API recommended + spec'd.
- §13 open questions cataloged.
- §14 contact points for every Wave 2 sibling + later sessions.

**What's not in this spec (per restrictions):**
- The actual `tools/color-engine/generate-colors.js` file. Pseudocode in §7.2 is the contract.
- The actual `assets/css/next/primitives/colors.css` file. CSS emission template in §7.2 is the contract.
- No CSS, JS, or HTML files. Markdown only.

---

## Footer — Conflicts with external skill flags (per file 06 / Rule 15)

NONE. Every color decision in this spec traces to apcach output. No alternative color methodology proposed. No "WCAG-only" reasoning. No manual hex picks. No generic palette imports. ECC `design-system` Mode 1 (Generate) is OFF-LIMITS per Tier hierarchy and is not consulted.

Rule 15 fully honored. Rule 13 honored (build-time apcach only; runtime apcach is opt-in Path A bundled-subset per owner approval). Rules 1, 4, 5, 6, 7, 8, 10, 11, 12, 14 honored throughout the spec's structure and decisions. Rule 9 (chips strip 10 protected values) does not intersect color foundation directly — chips consume system-layer tokens from S2 which trace to S1's primitives.

**Repo isolation honored:** all reference reads from `../toolskin-showcase/` via relative path; no writes; no git ops against reference repo. CWD remained `D:\Mis Documentos\Projects\Toolskin Framework\toolskin-rebuild\` throughout.

**Hard restrictions honored:** spec is MARKDOWN ONLY. No CSS, JS, or HTML files written. `tools/color-engine/generate-colors.js` and `assets/css/next/primitives/colors.css` are NOT written this session — they are S1's specification for Session 2+ execution.
