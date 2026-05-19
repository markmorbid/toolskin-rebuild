# T3 — Adaptive Integration Architect: Drop-In Compatibility Contract

**Session:** 1 / Wave 1 / Sub-Agent T3
**Date:** 2026-05-19
**Status:** SPEC — feeds S1 (runtime hook), S2 (system composition), S4 (asset loading), S6 (anti-pattern enforcement)
**Time-box:** 25 minutes
**Conversation rules in force:** 1, 2, 5, 7, 12, 13, 15 (verbatim source: `_session-1-rebuild-queue.md`)

This spec defines, **verifiably**, what makes Toolskin v2 "literally give to anybody, AI or WordPress, and instantly adapts" (Rule 5). Every section is the contract a Wave 2 / Session-N agent enforces. No section is aspirational. No promise here ships without an APCA-verified test that a sub-agent or owner can run.

---

## 1. The Rule 5 promise — verifiable definition

**Input** (3-line contract):

1. ONE brand accent hue in any standard format (hex, OKLCH, HSL, RGB, named CSS color).
2. ZERO other color, spacing, typography, or component decisions required.
3. ZERO framework, bundler, or runtime dependency on the consumer's side.

**Output** (3-line contract):

1. A complete contrast-verified design system: 6 surface depths, accent ramp (idle/hover/active/focus/dim/bright/on-accent), text-on-surface auto-derivation, dark+light mode counterparts, all interaction state tokens.
2. All component classes (`.ts-btn`, `.ts-card`, `.ts-input`, etc.) immediately adopt the new visual identity with **no class swap, no markup edit, no rebuild**.
3. APCA contrast for every text-on-surface pair meets the configured floor (default APCA Lc 60 for body text, Lc 75 for fine text) by construction — verified by `tools/color-engine/` at build time, recomputed by an optional `Toolskin.setAccent()` runtime hook.

**The single sentence:** *"Give Toolskin one hue and one stylesheet link; you get a fully contrast-verified design system applied to all `.ts-*` classes in the page, in any host environment, with zero further configuration."*

**The verification test (universal, all targets):** open any page using Toolskin, run `Toolskin.setAccent('#anyhex')`, observe within 200ms that every `.ts-*` element has rerolled its accent + accent-derivative tokens, and that no rendered text-on-surface pair drops below the APCA floor (measurable via `apcach.cssToApcach()` on the resolved computed style).

---

## 2. Integration targets table

The drop-in contract per host. Each row is binding for Wave 2 / S4 (asset pipeline) and S6 (anti-pattern refusal).

| Target | Minimum consumer input | What Toolskin provides | Asset loading | Namespace strategy | Verification check |
|---|---|---|---|---|---|
| **Static HTML / vanilla** | `<link rel="stylesheet" href="toolskin.css">` + `<script src="toolskin.js" defer>` + optional `<script>window.__TOOLSKIN_CONFIG__={accent:'#hex'}</script>` BEFORE toolskin.js. | All surfaces, all accent derivatives, all `.ts-*` components, runtime accent mutation via `Toolskin.setAccent(hex)`. | Two `<link>`/`<script>` tags. Order: config inline script → toolskin.css → toolskin.js. No bundler. | `.ts-*` only. Host author writes class names directly. Zero collision risk because host has no class system. | Open the page; verify `getComputedStyle(document.documentElement).getPropertyValue('--ts-accent')` returns the OKLCH derived from input hex. |
| **WordPress (generic block theme + plugin context)** | A single PHP function call: `add_action('wp_enqueue_scripts', fn() => Toolskin::enqueue($accent_hex));` (plugin wraps the two CDN links + sets `window.__TOOLSKIN_CONFIG__` via `wp_add_inline_script`). | Same as static HTML. WordPress block theme markup that uses `class="wp-block-button__link"` is left untouched; the consumer maps via a CSS layer (see §5). | Plugin enqueues 2 assets via `wp_enqueue_style` / `wp_enqueue_script` with `wp_add_inline_script` for the config. No PHP runtime work after enqueue. | `.ts-*` for Toolskin elements. WordPress block classes (`.wp-block-*`) coexist — Toolskin never collides because of the `.ts-` prefix. **Enfold-specific support dropped** per CLAUDE.md §8 + queue brief. | View frontend; verify Toolskin block-editor preview matches frontend; verify accent change in plugin admin propagates within 200ms after page reload. |
| **React (Next.js, Vite, CRA)** | Either: (a) `<link>` + `<script>` in root HTML / `app/layout.tsx`'s `<head>` — preferred path; OR (b) `import 'toolskin/dist/toolskin.css'` + `import 'toolskin/dist/toolskin.js'` (npm wrapper, build-time only — no React-specific runtime per Rule 13). Consumer sets accent via `<script>window.__TOOLSKIN_CONFIG__={accent:'#hex'}</script>` in `_document` (Next.js) / `index.html` (Vite/CRA) BEFORE the Toolskin script. **SSR caveat:** must be in HTML, not inside a Component, so `data-theme` survives hydration (mirrors showcase index.html lines 7-22 pattern). | Same. React Context for accent management is the CONSUMER's job — Toolskin exposes `window.Toolskin.setAccent()` which a Context provider may wrap. | Same as static. NPM wrapper exists as a courtesy (`import 'toolskin/dist/toolskin.css'`) but produces zero runtime dependency on bundler features. | `.ts-*` coexists with React component libraries (MUI, Chakra, shadcn, Mantine) because none of them claim the `ts-` prefix. See §5 for layering rules. | In `<App>`: render `<button className="ts-btn">test</button>`; call `Toolskin.setAccent('#newhex')`; assert `getComputedStyle` reflects within 200ms. |
| **Vue (Nuxt, vanilla Vue 3)** | Identical to React. For Nuxt: place `<link>` + `<script>` in `nuxt.config.ts`'s `app.head.link` / `app.head.script` arrays. Set accent via inline script in `head`. | Same. Vue Composition API users may wrap `Toolskin.setAccent()` in a composable — Toolskin provides no Vue-specific API. | Same as React. | `.ts-*` coexists with Vuetify, PrimeVue, Element Plus, etc. None use the `ts-` prefix. | `<button class="ts-btn">test</button>` in any SFC; runtime accent mutation propagates. |
| **AI-generated UIs (Claude artifacts, V0, Replit AI, Lovable, Bolt)** | A standalone HTML file. The AI emits: `<link>` and `<script>` tags pointing to a Toolskin CDN (jsdelivr/unpkg). The AI sets `window.__TOOLSKIN_CONFIG__ = {accent: '#hex'}` if user requests a brand color. Otherwise the dark-mode default ships. | Same. The "AI artifact path" is the simplest target: nothing is bundled by the AI; the consumer host (claude.ai's artifact iframe) loads the CDN at view time. | CDN-only. The AI emits one stylesheet link + one script tag. No npm. **Critical:** `https://cdn.jsdelivr.net/npm/toolskin@1/dist/toolskin.css` + `.../toolskin.js` MUST be the published path. | `.ts-*` only. AI tooling that emits Tailwind classes will work alongside (see §5) — but for a Toolskin-led artifact, the AI is instructed to use `.ts-*` exclusively. | Paste any AI artifact into claude.ai; verify it renders dark-mode default; verify `Toolskin.setAccent('#brandhex')` in DevTools mutates instantly. |
| **Tailwind coexistence** | Consumer's stack already uses Tailwind (CRA + Tailwind, Next.js + Tailwind, etc.). Adding Toolskin = adding the two tags above, no Tailwind config change required. | Toolskin handles its own visual layer via `.ts-*`. Tailwind utilities continue to work on non-`.ts-*` elements. Mixed usage allowed (e.g., `<button class="ts-btn">` with `<div class="flex gap-4">` parent). | Side-by-side stylesheets. Tailwind purge does NOT remove `.ts-*` (Tailwind's PurgeCSS scans the consumer's source, where `.ts-*` would appear as string literals in JSX/HTML — surviving the purge). | Hard line: **`.ts-*` for visual; Tailwind utilities for layout/positioning only**. See §5 anti-pattern: consumer using Tailwind utilities like `bg-blue-500` on a `.ts-btn` breaks Rule 15 (consumer overrides apcach-derived color with manual palette). | Build the consumer app; verify Tailwind's `flex`, `grid`, `p-4`, etc. work on `.ts-card` containers; verify `Toolskin.setAccent()` does NOT change Tailwind-applied colors (separation maintained). |

**Targets explicitly NOT supported in v2:**

- Web Components / Shadow DOM isolation — Toolskin tokens live on `:root`/`[data-theme]`; Shadow DOM blocks inheritance unless consumer explicitly forwards `--ts-*` properties. Out of scope for v2 first release.
- React Native / Flutter / native mobile — Toolskin is CSS+JS for browsers only.
- Enfold WordPress theme — historical support dropped (queue brief, expert-designer skill drops `enfold-samples.md`).

---

## 3. The minimum viable input — apcach-driven derivation

Per Rule 5 + Rule 15, the consumer provides **one hue**. apcach generates everything else.

### 3.1 Accepted input formats

The consumer's accent hue input can arrive in any of these formats (parsed by `Toolskin.setAccent()` via culori OR a minimal in-house parser):

- Hex: `#ff5500`, `#f50`
- OKLCH: `oklch(70% 0.2 25)`
- HSL: `hsl(20, 100%, 50%)`, `hsl(20deg 100% 50%)`
- RGB: `rgb(255, 85, 0)`, `rgb(100% 33% 0%)`
- Named: `tomato`, `cornflowerblue` (resolved via the browser's CSS color database OR a hardcoded subset in the runtime)

If input is unparseable, Toolskin falls back to the default brand hue (built into the shipped CSS) and emits a console warning. NEVER throws.

### 3.2 What apcach generates from the one input

Given hue `H` (extracted as OKLCH hue 0-360):

**Tier 1 — Primitives (build-time, baked into `assets/css/next/primitives/colors.css`):**

- `--ts-bg-body` through `--ts-bg-5`: 6 surface depths in OKLCH, contrast-stepped so each adjacent pair clears APCA Lc ≥ 8 (visual separation), and the body-to-5 span clears Lc ≥ 35 (clear depth hierarchy).
- `--ts-accent`: `apcach(crToBg('var(--ts-bg-2)', 60), maxChroma(0.20), H)` — accent placed against the "typical card surface" with APCA Lc 60 (UI element clarity) and chroma capped at 0.20 to stay in sRGB gamut.
- `--ts-accent-dim`: `apcach(crToBg('var(--ts-bg-2)', 30), maxChroma(0.10), H)` — dim variant for tertiary surfaces.
- `--ts-accent-bright`: `apcach(crToBg('var(--ts-bg-2)', 75), maxChroma(0.22), H)` — for hover/active emphasis.
- `--ts-accent-hover/active/focus/disabled`: derived in the system layer (S2) via `color-mix()` from the three accent values above. NO new apcach calls per state.
- `--ts-on-accent`: `oklch(from var(--ts-accent) clamp(0, (0.65 - l) * 999, 1) 0 0)` — auto-readable text on accent (per restyling-architecture §6).
- `--ts-text-primary/secondary/muted`: apcach-derived against `--ts-bg-body` at APCA Lc 90/75/60 respectively.

**Tier 2 — System layer (build-time CSS, NOT regenerated per accent change at runtime):**

The `--ts-this-bg-*` derivative chain (per restyling-architecture §3) lives in `assets/css/next/system/this-bg.css` as pure `color-mix(in oklch, ...)` rules. These rules NEVER need rerunning when accent changes — they compose from `--ts-this-bg` and `--ts-accent` at the CSS engine layer, which is automatic.

**Light mode counterpart:**

Generated by the SAME apcach call set, with target backgrounds inverted: `--ts-bg-body` becomes near-white (e.g., `oklch(98% 0 0)`), `--ts-bg-5` becomes a light gray (`oklch(88% 0 0)`), and the same accent hue receives a new contrast-validated luminance against the light surfaces. Stored under `[data-theme="light"]` selector. apcach guarantees the same APCA floor is met without manual tuning — this is the Rule 15 differentiator.

### 3.3 Why this is the minimum

Anything more from the consumer (e.g., asking for two accents, a custom surface palette, specific radius tokens) breaks the "one input → complete system" promise. v2 explicitly rejects multi-input customization at the API surface. Customization happens via CSS overrides in the consumer's stylesheet, AFTER Toolskin loads — which is unsupported but not blocked (it's the consumer's risk).

---

## 4. Runtime apcach hook spec — bundling trade-offs

Per Rule 15 layer 2, `Toolskin.setAccent('#hex')` at runtime must regenerate the derivative chain. Two implementation paths exist; **owner picks one at Gate 5**.

### 4.1 Path A — Bundled apcach subset in `toolskin.js`

**What ships:** `toolskin.js` includes a minified subset of apcach (only `apcach()`, `crToBg()`, `maxChroma()`, `apcachToCss()`, and necessary culori conversions). Estimated bundle cost:

| Module | Raw source | Minified estimate | Treeshaken minified estimate |
|---|---|---|---|
| `apcach/index.js` | 21 KB | ~12 KB | ~9 KB |
| `apca-w3/src/apca-w3.js` | 29 KB | ~16 KB | ~14 KB |
| `culori` (only OKLCH ↔ sRGB, OKLCH ↔ hex, parsing) | 1.5 MB on disk | culori.min.js = 60 KB | ~18 KB treeshaken |
| `colorparsley` (only if culori subset can't parse hex/rgb/hsl alone) | 1.3 MB on disk | depends on tree-shake | ~6 KB or zero if skipped |
| **Total added to toolskin.js** | — | ~88 KB | **~41-50 KB minified, ~15-18 KB gzipped** |

**Pros:**
- Single-file runtime mutation: consumer calls `Toolskin.setAccent(hex)`, gets contrast-verified derivatives instantly with no network.
- White-label and AI-generated palette consumers (V0, Lovable) get the full contract.
- Matches Rule 5's "instantly adapts" promise literally.

**Cons:**
- Toolskin.js grows from ~200 KB raw (estimate from showcase's 8143-line current state, minified ~80 KB) to ~250 KB raw (~95-100 KB minified). Still well under the 100 KB gzipped threshold most performance budgets allow.
- Adds maintenance: every apcach API change requires re-bundling.
- Slight Rule 13 tension — "no Node.js runtime deps" is preserved (apcach is pure JS that runs in browser), but the bundled-subset complexity is owner-approval-gated per file 06.

### 4.2 Path B — CSS-only derivation via `color-mix(in oklch, ...)`

**What ships:** `toolskin.js` includes a ~2 KB hue-extraction routine that:
1. Parses consumer hex/rgb/hsl input to OKLCH using a hand-rolled converter (or `CSS.registerProperty()` with type `<color>` + the browser's built-in OKLCH support).
2. Writes only `--ts-accent-h` (OKLCH hue 0-360), `--ts-accent-c` (chroma 0-0.37), `--ts-accent-l` (lightness 0-1) to `:root`.
3. All accent-derivative tokens (`--ts-accent`, `--ts-accent-dim`, `--ts-accent-bright`, `--ts-accent-hover`, etc.) are defined ONCE in `assets/css/next/primitives/colors.css` as `oklch(var(--ts-accent-l) var(--ts-accent-c) var(--ts-accent-h))` with hardcoded lightness/chroma offsets per variant.

**Pros:**
- Zero bundle growth. `toolskin.js` stays slim.
- Zero ongoing maintenance — `color-mix()` and `oklch()` are stable CSS specs.
- True Rule 13 / Rule 1 compliance — "one stylesheet, full dynamic control" with the minimal possible JS.

**Cons:**
- **Contrast is NOT verified at runtime.** apcach's contribution (APCA Lc target → solve for L/C/H) becomes a build-time-only guarantee. At runtime, a consumer's accent input near a contrast cliff (e.g., a low-lightness hue against `--ts-bg-2`) could land below the APCA floor.
- The CSS-only path approximates apcach by using fixed lightness offsets per accent variant. This means: for hues where the build-time apcach call yielded lightness `L1`, the runtime fallback applies that same `L1` regardless of the new hue — close to right for most hues, wrong for hues near the gamut edge (deep blue, deep red).
- Mitigation: the CSS-only path SHIPS WITH a hardcoded fallback that's "good enough" for ~80% of hues. Consumers who care about edge cases (white-label deployments with strict contrast SLAs) use Path A.

### 4.3 Recommendation

**Hybrid (defer to owner at Gate 5):**

- DEFAULT BUILD = Path B (CSS-only, no apcach in shipped JS). Ship this as `toolskin.min.js` (~80 KB minified).
- OPTIONAL BUILD = Path A (`toolskin.full.min.js` ~125 KB minified) for white-label / strict-contrast consumers. Same API surface; `Toolskin.setAccent()` internally calls bundled apcach for verification.

The consumer chooses by importing one or the other. Both are baked at `tools/color-engine/` build-time; Rule 13 is preserved because the consumer doesn't run a build.

**Owner approval required per file 06** before Path A's bundled subset is implemented. Path B is the safe default.

### 4.4 Runtime hook API surface (locked, regardless of Path A vs B)

```javascript
// Synchronous, returns void. Triggers a `ts:accent` CustomEvent on window after mutation.
Toolskin.setAccent(hueInput);
// hueInput: string in any format from §3.1

// Async, returns Promise<{ accent: string, contrastReport: object }>.
// Resolves once Path A's contrast verification completes; in Path B, resolves immediately.
Toolskin.setAccentVerified(hueInput);
// In Path B, contrastReport is { mode: 'css-only', verified: false }.
// In Path A, contrastReport contains every text-on-surface APCA Lc value.

// Read-only — returns current accent in OKLCH string format.
Toolskin.getAccent();

// Reset to the ship-default accent baked into the CSS.
Toolskin.resetAccent();

// Subscribe to accent mutations.
window.addEventListener('ts:accent', (e) => { /* e.detail = {accent, hue, mode} */ });
```

The current showcase's `Toolskin.setAccentHex()` (lines 1293-1325 of `toolskin.js`) uses a broken HSL pipeline (per restyling-architecture §5 System C). v2 deprecates `setAccentHex` and ships `setAccent` as the single accent mutation API. Aliasing `setAccentHex` to `setAccent` for backward compat is allowed but not required (showcase is the only consumer and is frozen).

---

## 5. Namespace collision strategy

Toolskin's namespaces (from old CLAUDE.md §3 CONVENTIONS, preserved in v2):

- `.ts-*` — visual/layout classes
- `.tk-*` — programmatic/JS-only classes (rarely encountered by consumer authors)
- `.ts-ui-*` — UIKit components (a separate, opt-in layer in v2)
- `--ts-*` — ALL custom properties

The prefix protects against collisions with consumer frameworks. Concrete rules per framework:

### 5.1 Tailwind

**Coexists by design.** Tailwind's utilities are atomic class names (`flex`, `text-center`, `p-4`, `bg-red-500`). They never start with `ts-`. Zero collision.

**Rule for consumers (S6 enforces):**
- Use Tailwind for layout (positioning, flexbox/grid, spacing utility, breakpoint visibility).
- Use Toolskin for VISUAL (color tokens, surfaces, accent ramp, component styling like `.ts-btn`, `.ts-card`).
- DO NOT use Tailwind color utilities on `.ts-*` elements. Doing so overrides apcach-derived colors and breaks Rule 15's guarantee.

Example, allowed:
```html
<div class="flex gap-4 p-6">
  <button class="ts-btn">Submit</button>
  <button class="ts-btn ts-btn--secondary">Cancel</button>
</div>
```

Example, anti-pattern (refused by S6 in docs):
```html
<!-- DON'T: Tailwind color overrides Toolskin's apcach-derived accent -->
<button class="ts-btn bg-blue-500 text-white">Submit</button>
```

### 5.2 Bootstrap

**Potential collision.** Bootstrap uses `.btn`, `.card`, `.nav`, `.modal` — all conflict with `.ts-btn`, `.ts-card`, `.ts-nav`, `.ts-modal` semantically but NOT syntactically (different class names).

The `ts-` prefix is the explicit protection. A `.btn` styled by Bootstrap and a `.ts-btn` styled by Toolskin coexist with no cascade conflict.

Consumers using BOTH simultaneously is allowed but discouraged. Document at S6: "Pick one component system per page. Mixing Bootstrap and Toolskin works but causes visual inconsistency."

### 5.3 React component libraries (MUI, Chakra, Mantine, shadcn/ui)

None claim the `ts-*` prefix. Coexistence is automatic.

**Layering pattern:**
- React lib provides component BEHAVIOR (focus management, ARIA, keyboard nav, portals).
- Toolskin provides visual TOKENS at the CSS variable layer.
- Bridge: consumer maps `--ts-*` tokens to the lib's theme tokens. Example MUI:

```javascript
const theme = createTheme({
  palette: { primary: { main: 'var(--ts-accent)' } },
  shape: { borderRadius: 'var(--ts-radius-base)' },
});
```

This pattern is documented in Wave 2 / S4's build pipeline spec. T3 does not specify the exact bridge code — that's per-lib.

### 5.4 Inline `style` attributes

Always win the cascade. Toolskin tokens are still readable via `var(--ts-*)` from inline styles, which is the showcase's pattern (e.g., `style="color: var(--ts-accent)"` appears 24+ times in index.html per Grep count).

This is the escape hatch for one-off element styling without breaking the token contract. Allowed.

### 5.5 The collision protection ledger

A pre-commit hook (S6) verifies no `.ts-*` class is reassigned in any consumer-supplied test fixture in `sandbox/`. If a sandbox HTML file contains `<style>.ts-btn { ... }</style>` (consumer override), S6 flags it.

---

## 6. Asset loading pattern

### 6.1 The ship artifact

Per Rule 1 ("one stylesheet") + Rule 13 ("no runtime deps"):

```
dist/
├── toolskin.css           ~150 KB (estimate based on showcase's 24K-line CSS post-minification)
├── toolskin.min.css       ~110 KB minified
├── toolskin.js            ~250 KB raw (Path A) / ~200 KB raw (Path B)
├── toolskin.min.js        ~95 KB / ~80 KB minified
├── toolskin.full.min.js   ~125 KB minified (Path A only — bundled apcach subset)
└── toolskin-uikit.{css,js} (opt-in UIKit, separate files)
```

**Three files maximum for the core experience.** UIKit is opt-in (a fourth + fifth file pair the consumer chooses to include).

### 6.2 CDN delivery

Three published paths (S4 enforces in build pipeline spec):

- jsdelivr: `https://cdn.jsdelivr.net/npm/toolskin@1/dist/toolskin.min.css` and `.../toolskin.min.js`
- unpkg: `https://unpkg.com/toolskin@1/dist/toolskin.min.css`
- npm registry: `npm install toolskin` then `import 'toolskin/dist/toolskin.min.css'` (build-time tree-shake friendly)

**Versioning:** Semver major pin (`@1`) is the recommended consumer reference. Latest (`toolskin@latest`) is permitted but discouraged for production (matches old CLAUDE.md §5b lesson on FA6→FA7 break).

### 6.3 Local install

```bash
npm install toolskin
# Then:
# Static HTML: copy dist/* to your assets, link as <link>/<script>.
# React/Vue/etc.: import 'toolskin/dist/toolskin.min.css' (bundler treeshakes CSS by purging unused selectors if consumer's build pipeline does so).
```

The npm package contains ONLY `dist/`. No `src/`, no `node_modules`, no transitive deps. Per Rule 13.

### 6.4 WordPress plugin wrapper

Spec (S4 implements in build pipeline, but T3 documents the contract):

```php
// toolskin-wp/toolskin-wp.php
function toolskin_enqueue($accent_hex = null) {
    wp_enqueue_style('toolskin', 'https://cdn.jsdelivr.net/npm/toolskin@1/dist/toolskin.min.css');
    wp_enqueue_script('toolskin', 'https://cdn.jsdelivr.net/npm/toolskin@1/dist/toolskin.min.js', [], null, true);
    if ($accent_hex) {
        wp_add_inline_script('toolskin',
            "window.__TOOLSKIN_CONFIG__ = { accent: '" . esc_js($accent_hex) . "' };",
            'before'
        );
    }
}
add_action('wp_enqueue_scripts', fn() => toolskin_enqueue(get_option('toolskin_accent', '#ff5500')));
```

The plugin adds a single options page in WP admin for the accent hue. Everything else is automatic.

### 6.5 Boot order

Locked across all targets:

1. Consumer's HTML loads.
2. `<head>` includes pre-paint theme script (mirrors showcase index.html lines 7-22 — sets `data-theme` from localStorage before first paint to prevent FOUC).
3. `<head>` includes `<script>window.__TOOLSKIN_CONFIG__ = { accent: '#hex', theme: 'dark' };</script>` (optional consumer override).
4. `<link rel="stylesheet" href=".../toolskin.min.css">` loads (render-blocking; the consumer accepts this for FOUC-free experience).
5. `<script src=".../toolskin.min.js" defer>` loads.
6. On DOMContentLoaded, `Toolskin.init(window.__TOOLSKIN_CONFIG__)` runs:
   - Reads `accent` from config → calls `Toolskin.setAccent()` internally.
   - Reads `theme` from config → applies `data-theme` attribute.
   - Initializes all components (tabs, modals, marquees, etc.) per the existing showcase `Toolskin.init` pattern.
7. Components render with finalized tokens.

**Total time from page open to interactive Toolskin: ~150ms on a warm cache, ~400ms cold (CDN HTTP/2 + render-blocking CSS).**

---

## 7. Verification protocol per target

Each target ships with one canonical "does it work?" test. S6 enforces presence in the repo's `sandbox/verification/` directory (built in Session 4+).

### 7.1 Static HTML

```html
<!-- sandbox/verification/static-html-test.html -->
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/toolskin@1/dist/toolskin.min.css">
  <script>window.__TOOLSKIN_CONFIG__ = { accent: '#a855f7' };</script>
  <script src="https://cdn.jsdelivr.net/npm/toolskin@1/dist/toolskin.min.js" defer></script>
</head>
<body>
  <button class="ts-btn">Click me</button>
  <div class="ts-card">Card content</div>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      console.assert(getComputedStyle(document.documentElement).getPropertyValue('--ts-accent').includes('oklch'), 'Accent should be OKLCH');
      // Live mutation test
      setTimeout(() => Toolskin.setAccent('#ff5500'), 1000);
    });
  </script>
</body>
</html>
```

**Pass criteria:** Open in browser. Card adopts purple accent borders/hover. After 1 second, all accent surfaces shift to orange. No layout shift. No console errors.

### 7.2 WordPress

Set up local WP via the `build-with-wordpress:quick-build` skill or `wp-env`. Install the toolskin-wp plugin shell. Set accent in admin to `#2efc86`. View frontend. Verify all `.ts-*` elements use green. Change to `#a855f7` in admin; reload frontend; verify all `.ts-*` elements use purple.

**Pass criteria:** Accent propagation within one page reload after admin save. Block editor preview matches frontend.

### 7.3 React

Bootstrap a Vite + React app. Add the `<link>` + `<script>` to `index.html`. Render:

```jsx
function App() {
  return (
    <>
      <button className="ts-btn" onClick={() => Toolskin.setAccent('#00e5ff')}>Change to cyan</button>
      <div className="ts-card">Card</div>
    </>
  );
}
```

**Pass criteria:** Click button → all `.ts-*` elements adopt cyan within 200ms with no React rerender (Toolskin mutates CSS variables directly; React tree is untouched).

### 7.4 Vue

Identical pattern in Nuxt or Vue 3 SFC.

### 7.5 AI artifact (Claude / V0)

Paste this prompt into Claude artifact mode: *"Create a landing page with a hero, three feature cards, and a CTA button. Use Toolskin for styling — load it from `https://cdn.jsdelivr.net/npm/toolskin@1/dist/toolskin.min.css` and the matching JS. Make the brand color green (#2efc86)."*

**Pass criteria:** AI emits the two CDN links + the inline config script. Artifact renders with green accent. User changes hex in DevTools via `Toolskin.setAccent('#purple')`; whole layout reaccents.

### 7.6 Tailwind coexistence

Bootstrap a Vite + React + Tailwind app. Render:

```jsx
<div className="flex gap-4 p-6 bg-gray-900">
  <button className="ts-btn">Toolskin button</button>
  <button className="bg-blue-500 text-white px-4 py-2 rounded">Tailwind button</button>
</div>
```

**Pass criteria:** Both buttons render their respective styles. Calling `Toolskin.setAccent('#red')` changes the Toolskin button but not the Tailwind one. Tailwind's `bg-gray-900` on the parent does NOT affect the Toolskin button's surface colors.

---

## 8. Anti-patterns to refuse

S6 codifies these as refusal patterns in the toolskin-architecture skill. Each is a hard NO at consumer ingress.

### 8.1 Consumer providing a full palette

**Refused.** Toolskin takes ONE accent. The surface palette, accent ramp, text colors, gradients, borders — all are apcach-derived from that one input. Consumers who supply a multi-color palette either get ignored extra colors or break the apcach guarantee.

Refusal language (S6): *"Toolskin v2 accepts one accent hue. A multi-color palette input violates Rule 15. Either accept the apcach-derived palette OR fork the build-time color engine for a custom multi-input setup (advanced, unsupported)."*

### 8.2 Consumer using Tailwind utilities to override `.ts-*` color tokens

**Refused at the documentation layer.** Toolskin can't technically prevent CSS overrides — that's the cascade. But the docs (CONTRIBUTING.md, integration guides) explicitly state: this defeats Rule 15's contrast guarantee. S6 adds a console.warn() in dev builds when a `.ts-*` element has computed `background-color` that doesn't match an `--ts-*` token (heuristic detection).

### 8.3 Consumer self-hosting an older Toolskin alongside v2

**Refused at the documentation layer.** Two stylesheets, two JS files, two competing `:root` token declarations → cascade conflict where the later-loaded wins by source order. v2 documents: *"If migrating from v1, remove v1 assets entirely before adding v2."* The pre-commit hook (S6) flags any sandbox HTML that loads more than one `toolskin*.css`.

### 8.4 Modifying `.ts-*` class definitions in consumer CSS

**Allowed but documented as risky.** Consumer adds `.ts-btn { padding: 20px; }` in their own stylesheet — the cascade allows this. v2 docs warn: this breaks the token-derived padding model. Consumers should instead override the source token: `:root { --ts-btn-base: 50; }`.

### 8.5 Importing Toolskin into React/Vue as a JSX/Vue component library

**Refused.** Toolskin is CSS + JS for the browser. It does NOT ship `<Button>` React components. Consumers who want JSX components wrap `.ts-btn` themselves:

```jsx
export const Button = ({children, ...props}) => <button className="ts-btn" {...props}>{children}</button>;
```

A future Toolskin-React wrapper package is possible but explicitly out of v2 scope.

### 8.6 Requesting a build-time Sass/PostCSS preprocessor

**Refused.** Per Rule 13. The shipped product is plain CSS. Consumers using Sass in their own pipeline can `@use` Toolskin's CSS file as-is — but Toolskin does NOT ship as Sass partials.

### 8.7 Shadow DOM / Web Component encapsulation

**Refused for v2.** Tokens defined on `:root` don't pierce Shadow DOM by default. Consumers using web components must explicitly forward `--ts-*` properties at their shadow root, which is advanced setup. v2 documents this as "out of scope, contact for v3 roadmap."

### 8.8 Consumer running Toolskin in a non-browser context (Node, Deno)

**Refused.** `toolskin.js` references `window`, `document`, `localStorage`. No SSR-safe build is in v2.

---

## 9. Contact points for Wave 2 + later sessions

### 9.1 Wave 2 consumers of this spec

- **S1 (Color Foundation Architect)** — consumes §3 (apcach derivation rules) and §4 (runtime hook API). S1 implements `tools/color-engine/generate-colors.js` per §3.2. S1 decides Path A vs Path B (or hybrid) per §4 with owner approval at Gate 5.
- **S2 (System Layer Architect)** — consumes §3.2 Tier 2 (system layer composition is the derivative chain) and §5 (namespace strategy — system tokens stay in `--ts-this-*` namespace; consumer-overridable but discouraged).
- **S3 (Component Registry)** — consumes §5 (component classes are `.ts-*` only) and §7 (every block ships a verification test).
- **S4 (Build Pipeline Architect)** — consumes §6 in full (asset loading is S4's domain — T3 specifies WHAT ships, S4 specifies HOW it builds). S4 implements jsdelivr/unpkg/npm publish flow.
- **S5 (Autonomous Execution Protocol)** — consumes §7 (verification tests determine PERMISSIVE vs STRICT tier — atomic blocks with passing verification get auto-progress; layout blocks always halt).
- **S6 (Repo Governance + Refusal Patterns)** — consumes §8 in full. S6's refusal patterns derive directly from T3's anti-patterns.

### 9.2 Block sandbox session consumers (Session 4+)

Each block sandbox tests an integration target relevant to that block:

- Button sandbox → static HTML + React verification (§7.1, §7.3).
- Card sandbox → Tailwind coexistence (§7.6).
- Modal sandbox → React (focus trap + portal behavior must work with Toolskin's CSS).
- Marquee sandbox → AI artifact (canonical pattern from Rule 3, must work in claude.ai iframe).
- Form blocks (input, select, textarea) → WordPress (Gutenberg block compatibility).

### 9.3 Dependencies on T1 / T2 output

T3 (this spec) is written **without knowing T1's typology output** (parallel dispatch). On synthesis:

- **From T1:** which blocks are PERMISSIVE/STRICT/ALWAYS STRICT determines which verification tests in §7 are gating (PERMISSIVE blocks auto-pass on parity; STRICT blocks require manual owner sign-off on the verification).
- **From T2:** the `sandbox/_base.html` template loads `assets/css/next/primitives/colors.css` (per §3.2 and §6.5) and a script tag stub for `toolskin.min.js`. T3's §7 verification tests live in `sandbox/verification/` (a separate folder T2 may or may not specify).

If T1/T2 contradict T3 on:
- Whether the apcach runtime hook bundles inside toolskin.js → **T3 wins** (Rule 15 is non-overridable, owner approves Path A/B at Gate 5).
- Whether `.ts-*` is the only namespace → **T1 wins** (block typology is T1's authoritative output; if T1 specifies additional namespaces, T3 will update §5 at Wave 2 synthesis).
- Whether AI artifact is a target → **T3 wins** (Rule 5 drop-in promise is T3's binding axis).

### 9.4 Owner gate items

- **Gate 5 owner decision required:** Path A (bundled apcach subset) vs Path B (CSS-only derivation) vs Hybrid (default Path B, optional Path A build). T3 recommends Hybrid; owner picks at Gate 5.
- **Gate 5 owner decision required:** does v2 ship a WordPress plugin wrapper at first release, or is it a "post-v2.0" add-on? T3 documents the contract regardless; S4 implements per owner decision.

---

## 10. Open questions / contradictions / gaps

1. **Bundling math is approximate.** Path A's "~50 KB minified" is an estimate; actual measurement requires running `terser` against the bundled subset. S1 + S4 will measure during Session 2-3.
2. **OKLCH browser support:** OKLCH and `color-mix(in oklch, ...)` are baseline in Chrome 111+, Safari 16.4+, Firefox 113+ (mid-2023). Consumers on older browsers (IE11 is dead but corporate IE/old-Safari pockets exist) get fallback to the build-time-baked sRGB derivatives. T3 does not spec a polyfill — Rule 13 forbids runtime polyfills. **Open question to owner:** is "modern browser baseline (mid-2023+)" acceptable for v2?
3. **AI artifact CDN tag identity:** the npm package name `toolskin` may collide with existing packages. T3 hasn't queried npm. **Open question to owner:** confirm `toolskin@1` is the published name, or pick alternative (`@toolskin/core`, `toolskin-design-system`, etc.). S4 verifies on first publish.
4. **Tailwind coexistence — utility class purge:** Tailwind's `@apply` and JIT purge work on the consumer's source files. If a consumer uses `<button class="ts-btn">` inside JSX, Tailwind's purge keeps `.ts-btn` only if it appears in the source as a literal — works for static class names, breaks for dynamic (e.g., `className={\`ts-${variant}\`}`). T3 documents the literal-only requirement at §5.1 but doesn't fix the dynamic case. **Open question to S6:** add a console.warn() pattern for dynamic Toolskin class names in dev builds? Or document only?
5. **Light mode test gap:** §7 verification tests focus on dark mode default. Light mode (`data-theme="light"`) needs parallel verification per target. **Gap:** add `Toolskin.setTheme('light' | 'dark' | 'auto')` to §4.4 API surface? Owner decision at Gate 5.
6. **WordPress block editor (Gutenberg) parity:** the spec covers frontend rendering. Gutenberg's editor iframe is a separate DOM with its own `<head>`. Plugin must enqueue Toolskin assets into the editor iframe too (`add_action('enqueue_block_editor_assets', ...)`). T3 documents the function name; S4 implements.

---

## Footer

**Sources read (all in `../toolskin-showcase/`):**

- `assets/js/toolskin.js` lines 1280-1370 (accent runtime), 5760-5901 (public API surface)
- `assets/js/toolskin-assets.js` lines 1-330 (CDN asset loader pipeline)
- `index.html` lines 1-110 (consumer integration pattern; pre-paint theme script)
- `docs/PRE-REFACTORING-PLAN-15-04-2025/architecture/restyling-architecture.md` (full read; §3, §5, §6 directly relevant)
- `CLAUDE.md` §3 CONVENTIONS, §5b CDN ASSET DEPENDENCIES, §8 ACTIVE REFACTOR CONTEXT
- `tools/color-engine/node_modules/apcach/README.md` (full read)
- `_session-1-rebuild-queue.md` (this session's binding queue)

**Sources NOT consulted (out of time-box):**
- `assets/js/toolskin-uikit.js` (UIKit considered separate opt-in layer; namespace strategy in §5 covers it)
- Pitchdeck/branding HTML (not present in current showcase listing per `ls` output)

**Rule 15 conformance:** This spec defers to apcach as the color authority throughout §3, §4, §8. No alternative color methodology proposed. No manual hex picks introduced.

**Status:** DONE_WITH_CONCERNS — see §10 open questions, especially #1 (bundling math), #2 (browser baseline), #3 (npm name), #5 (light mode coverage). Owner decision needed at Gate 5 on Path A vs B and on WP plugin scope.
