# T2 — Reusable HTML Base Context Spec (`sandbox/_base.html`)

**Sub-agent:** T2 — Block Composition + Reusable HTML Base Designer
**Wave:** 1 (Block Layer Type Engineering Team)
**Session:** 1
**Authored:** 2026-05-19
**Output of:** Phase D Wave 1 of orchestration brief v5 (`docs/session-1-bootstrap/01-orchestration-brief-v5.md`)
**Binding rules:** Conversation Rules 1–15 (see `_session-1-rebuild-queue.md`)
**Restrictions:** **Spec only.** No `sandbox/_base.html` written this session. Spec is markdown only. No CSS/JS files written. No reads or writes to `../toolskin-showcase/**` other than read-only references.

---

## 0. Quick Map (TL;DR for orchestrator synthesis)

- **One file**, `sandbox/_base.html`, shared across every block — per Rule 7.
- **Delta per block** is small: page `<title>`, one CSS `<link>` for that block, one markup slot's contents. Everything else identical.
- **CSS load order is rigid**: primitives → system → utilities → block CSS. The cascade is the contract (Rule 8).
- **The old `toolskin-showcase/assets/css/toolskin.css` is loaded ONLY inside the parity-rig `<iframe>`**, never in the host document. Strict isolation (Rule 6, Rule 12).
- **No build step required to view** a sandbox — `python -m http.server` (or any static server) suffices. Apcach is build-time only (Rule 13).
- **Theme switcher** + accent-hue input are part of the base, proving Rule 5 in the smallest possible surface area.

---

## 1. Purpose of `sandbox/_base.html`

### 1.1 What it is

`sandbox/_base.html` is the **single reusable HTML host file** for every block sandbox in the rebuild. Each Session 4+ block-sandbox session copies (or symlinks via path convention — see §8.2) this base into a per-block sandbox folder and customizes ONE block-specific markup slot plus ONE block-specific CSS `<link>`. Nothing else changes.

### 1.2 Why one base, not per-block bespoke HTML

- **Rule 7 verbatim:** *"Module by module, new file to test-drive each one. Same HTML base context reusable. Everything that is not the CSS and assets type must be efficiently reusable."* This is the operational binding.
- **Forcing reusability prevents drift.** If every sandbox author re-writes their own `<head>`, the cascade, the typography baseline, the preloader, the theme toggle — the design system "tests" different framings of itself in every block, and the rebuild becomes a thousand microcosms.
- **The base IS the integration contract.** If the base renders correctly with new primitives + system + components, then any consumer using equivalent CSS load order will render correctly too. This is the smallest, cleanest demonstration of Rule 5.

### 1.3 What this means for the rebuild workflow

Every block sandbox session (Session 4+) does:

1. Copy `sandbox/_base.html` to `sandbox/<block-name>/index.html` (or follow `sandbox/<block-tier>/<block-name>/index.html` convention — see §8.1).
2. Edit the `<title>` to include the block name.
3. Edit the SINGLE block-CSS `<link>` line to point at `assets/css/next/components/<block-name>.css`.
4. Replace the contents of the `<main id="block-slot">` element with that block's markup.
5. NOTHING ELSE CHANGES. Not the cascade order, not the script chain, not the preloader, not the theme toggle, not the parity-rig iframe.

That's the discipline. The base file's structure IS the per-block diff floor.

---

## 2. HTML Structure (described — not written)

The file structure described below corresponds to what `sandbox/_base.html` will contain when committed in a later session. This spec describes contents in markdown; no HTML file is created in this session.

### 2.1 Document shell

- `<!DOCTYPE html>` declaration on line 1.
- `<html lang="en">` root element. Attributes:
  - `lang="en"` for accessibility.
  - **No** `data-ts-offcanvas-editor` (old showcase used this; sandbox doesn't need it).
  - **No** `data-theme` attribute hardcoded — the FOUC-prevention inline script applies it from localStorage (see §2.3).

### 2.2 `<head>` contents — in this exact order

1. **Meta charset** — `<meta charset="UTF-8" />`. First child of `<head>`. Mandatory.
2. **FOUC-prevention inline script** — applies `data-theme` from `localStorage["ts-theme-mode"]` BEFORE any external CSS parses (see §2.3 for full content).
3. **Viewport meta** — `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`. Standard responsive base.
4. **Title** — `<title>Toolskin Sandbox · <BLOCK_NAME></title>`. The `<BLOCK_NAME>` is the only per-block edit here.
5. **Favicon** — `<link rel="icon" href="../../assets/img/favicon.ico" sizes="any">` and `<link rel="icon" href="../../assets/img/icon.svg" type="image/svg+xml">`. Relative path `../../` depends on sandbox depth (see §8.1). Optional `apple-touch-icon`.
6. **Font preconnects** (matches old showcase, render-blocking critical):
   - `<link rel="preconnect" href="https://fonts.googleapis.com" />`
   - `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />`
7. **Google Fonts** — render-blocking, critical for body text and preventing FOUT:
   - `<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />`
   - Rationale: typography-master skill anchors Space Grotesk + JetBrains Mono as Toolskin's brand pairing.
8. **Inline FOUC guard CSS** — `<style id="ts-fouc-guard">` block locks `body { background-color: <bg-body-default>; }` and `html, body { overflow: hidden; }` while CSS is loading. Removed by JS after primitives load. See §2.4 for full content.
9. **CSS load order** (the cascade — see §3 for full specification):
   - `assets/css/next/primitives/colors.css` (apcach-derived OKLCH)
   - `assets/css/next/primitives/spacing.css`
   - `assets/css/next/primitives/typography.css`
   - `assets/css/next/primitives/radius.css`
   - `assets/css/next/primitives/motion.css`
   - `assets/css/next/system/surfaces.css` (`--ts-this-bg-*` chain)
   - `assets/css/next/system/text.css` (`--ts-this-color-*` chain)
   - `assets/css/next/system/states.css` (hover/active/focus/disabled tokens)
   - `assets/css/next/utilities/*.css` (if any — composition utilities only)
   - `assets/css/next/components/<block-name>.css` (THE block under test — only edit per block)
10. **JS scaffolding** — minimal, see §4. All scripts are `defer`-loaded:
    - `assets/js/next/toolskin.core.js` (minimal init, theme, accent hook)
    - `assets/js/next/toolskin-uikit.js` (loaded conditionally — see §4.3)
11. **No CDN asset pipeline loader in `_base.html`** by default. The rebuild ships pure CSS + minimal JS (Rule 13). If a specific block requires FA icons or Ionicons during sandbox QA, the block's per-block-sandbox `index.html` may include the `toolskin-assets.js` script — but the BASE doesn't include it (keeps the base minimal and prevents accidental dependency drift).

### 2.3 FOUC theme-application inline script (exact content)

Placed immediately after `<meta charset>`. Reads localStorage and applies `data-theme` to `<html>` BEFORE the browser begins parsing the stylesheets, preventing flash of wrong theme. Mirrors the old showcase pattern (`../toolskin-showcase/index.html:7-22`):

```js
(function () {
  try {
    var key = 'ts-theme-mode';
    var m = localStorage.getItem(key);
    if (!m) {
      // Default: respect prefers-color-scheme
      m = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else if (m === 'auto') {
      m = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    if (m === 'dark' || m === 'light') {
      document.documentElement.setAttribute('data-theme', m);
    }
  } catch (e) { /* ignore */ }
})();
```

Note vs old showcase: drop the dual `data-ts-theme` attribute — rebuild uses single `data-theme` source-of-truth. Document this in the rebuild migration map.

### 2.4 FOUC guard inline CSS (exact content)

Mirrors the old showcase preloader-lock pattern (`../toolskin-showcase/index.html:47-83`) but simplified — sandboxes don't have a branded preloader, just a guard that prevents the white-flash before primitives load:

```css
/* Locks body background to a primitive-derived value before external CSS parses.
   Prevents white flash on cold loads. Removed by toolskin.core.js after primitives apply. */
html.ts-boot-lock body {
  background-color: oklch(0.18 0.012 250);   /* fallback approximate to --ts-bg-body dark */
  overflow: hidden;
}
[data-theme="light"] html.ts-boot-lock body {
  background-color: oklch(0.98 0.005 250);   /* fallback approximate to light bg */
}
html.ts-boot-lock #block-slot {
  visibility: hidden;
}
```

The exact OKLCH fallback values must be confirmed against S1's apcach-derived primitives once Wave 2 lands. For Session 1 SPEC, the placeholder is acceptable. S1 reviews and locks the exact fallbacks at Wave 2.

### 2.5 `<body>` contents — top to bottom

1. **Class on `<html>`:** `class="ts-boot-lock"` added inline immediately after `<head>`'s last child via a tiny inline script. Removed by `toolskin.core.js` once primitives + system layers have applied.
2. **Sandbox toolbar** — single `<div class="ts-sandbox-toolbar">` at the top with:
   - Theme switcher button (`data-theme-toggle` attribute, hooks into `toolskin.core.js`).
   - Accent-hue input field (`<input type="text" data-accent-input placeholder="#ff540a or oklch(0.7 0.18 35)">`) — see §7.
   - Parity-rig toggle button (`<button data-parity-rig-toggle>Compare with v1</button>`) — see §5.
   - Block-name label (auto-pulled from `<title>` or `data-block` attribute on `<main>`).
3. **Block markup slot** — `<main id="block-slot" data-block="<block-name>">` (see §6 for slot pattern). This is THE only structural element a block-sandbox session edits.
4. **Parity-rig iframe** — `<iframe class="ts-parity-rig" hidden src="_parity-rig.html?block=<block-name>">` (see §5). Hidden by default; shown when toggle is activated.
5. **Script tags** at the very end of `<body>`, in this order:
   - `<script src="../../assets/js/next/toolskin.core.js" defer></script>`
   - `<script src="../../assets/js/next/toolskin-uikit.js" defer></script>` (only when block tier ≥ molecular per T1 typology)
   - `<script src="../../assets/js/next/sandbox.runtime.js" defer></script>` (handles theme toggle wiring, accent input, parity-rig toggle, boot-lock removal)

Path prefix `../../` reflects sandbox depth `sandbox/<tier>/<block-name>/index.html`. Confirmed in §8.1.

---

## 3. CSS Load Order (the cascade contract)

### 3.1 Why the order matters

Per Rule 8 (cascade-sensitivity discovery, May 17): the rebuild uses **explicit `:is(...)` enumeration** at the component layer. Primitives and system layers do NOT use scoped distribution selectors. The cascade therefore depends on:

1. Primitives declare `:root` custom properties — these must land FIRST so every subsequent rule resolves them.
2. System layer declares `--ts-this-*` derivative variables — these must land BEFORE components reference them.
3. Components consume `--ts-this-*` exclusively (per Rule 4 surface superposition + system-layer design). Components must land LAST.

### 3.2 Full load order (locked)

| Order | File | Layer | Role | Per-block edit? |
|---|---|---|---|---|
| 1 | `assets/css/next/primitives/colors.css` | Primitive | apcach-derived OKLCH primitives: `--ts-bg-*`, `--ts-accent-*`, `--ts-on-*`. Rule 15 binding. | No |
| 2 | `assets/css/next/primitives/spacing.css` | Primitive | `--ts-sp-*` 4px-base scale | No |
| 3 | `assets/css/next/primitives/typography.css` | Primitive | `--ts-fs-*` harmonic 1.125 ladder, `--ts-font-*`, line-height tokens | No |
| 4 | `assets/css/next/primitives/radius.css` | Primitive | `--ts-radius-*` | No |
| 5 | `assets/css/next/primitives/motion.css` | Primitive | `--ts-ease-*`, `--ts-dur-*` | No |
| 6 | `assets/css/next/system/surfaces.css` | System | `--ts-this-bg-*` derivative chain + surface superposition rules (Rule 4) | No |
| 7 | `assets/css/next/system/text.css` | System | `--ts-this-color-*` + auto-contrast (OKLCH-derived per Rule 15) | No |
| 8 | `assets/css/next/system/states.css` | System | `--ts-this-bg-border-active/disabled/focus`, hover/active states | No |
| 9 | `assets/css/next/system/reset.css` | System | Minimal CSS reset + body baseline (font-family, color, background using `--ts-this-*` tokens) | No |
| 10 | `assets/css/next/utilities/*.css` | Utility | Layout composition utilities (`.ts-stack`, `.ts-cluster`, etc.) — IF any are introduced. Otherwise omit. | No |
| 11 | `assets/css/next/components/<block-name>.css` | Component | THE block under test | **Yes — one edit per block** |

### 3.3 What MUST NOT appear in `<head>` of `_base.html`

- **`../toolskin-showcase/assets/css/toolskin.css`** — the old monolith is the parity-rig reference target ONLY. It loads exclusively inside `_parity-rig.html` (see §5). If the old CSS ever leaks into the host document, the rebuild's CSS gets overridden by old rules and the sandbox tests the wrong system.
- **Any CDN-hosted CSS** — Toolskin v2 is pure local CSS. No CDN dependency in the shipped product (Rule 13). The base reflects this.
- **Inline `<style>` declaring `--ts-*` tokens** — only the FOUC guard inline `<style>` is permitted, and it only declares fallback `background-color` values (not `--ts-*` tokens).
- **Block-specific CSS path-mangled differently than the table above** — every block-sandbox session uses the exact path pattern `assets/css/next/components/<block-name>.css`.

### 3.4 Light/dark theme handling

- Primitives define BOTH dark (default) and `[data-theme="light"]` variants in `colors.css`. The system layer's `--ts-this-*` chain resolves automatically based on `data-theme`.
- No theme-specific stylesheet load. One `colors.css` file handles both modes via OKLCH primitives + `[data-theme="light"] :root { ... }` overrides.
- This matches the old `toolskin.css` pattern at lines 1310+ (`[data-theme="light"]` overrides). Confirms Rule 4 surface superposition awareness extends to theme-mode awareness by construction.

---

## 4. JS Scaffolding (minimal)

### 4.1 Where the rebuild's JS lives

Open question (see §10): the rebuild has not yet established `assets/js/next/` as a folder. This spec assumes the convention `assets/js/next/<file>.js` to mirror `assets/css/next/<layer>/<file>.css`. Recommended for orchestrator to approve at Gate 4.

### 4.2 Three scripts the base loads

#### `toolskin.core.js` (loaded for EVERY block)

Minimum surface area:
- **Theme toggle.** Reads/writes `localStorage["ts-theme-mode"]`, toggles `data-theme` on `<html>`. Mirror of `ToolskinTheme` from old `toolskin.js` (see `../toolskin-showcase/assets/js/toolskin.js:1293-1320` for the existing API).
- **`Toolskin.setAccent(h, s, l)` / `Toolskin.setAccentHex(hex)`.** Public API the apcach runtime hook plugs into. The default implementation in `toolskin.core.js` simply writes `--ts-accent-h/s/l` to `<html>` style. The apcach-enhanced implementation (optional runtime, see §4.4) overrides this to compute the full OKLCH derivative chain.
- **Boot-lock release.** Removes `class="ts-boot-lock"` from `<html>` once `DOMContentLoaded` fires AND primitives stylesheet has loaded. Two-condition gate prevents premature unlock during slow networks.
- **`ts:ready` CustomEvent dispatch.** Matches old API (`../toolskin-showcase/assets/js/toolskin.js:5560`). Block sandboxes can hook this for per-block init.

The old `toolskin.js` is **8,143 lines**. The rebuild's `toolskin.core.js` should target **≤500 lines initially**, then grow only as block sandboxes prove specific runtime needs (Rule 1 zero-framework, Rule 13 minimal JS).

#### `toolskin-uikit.js` (loaded conditionally — molecular+ blocks)

Loaded only when block tier per T1 typology is **molecular** or **layout**. Atomic blocks (button, input, chip) don't need it. Spec defers list of "needs UIKit" blocks to T1's typology output.

Surface area mirrors old `ToolskinUIKit` (see `../toolskin-showcase/assets/js/toolskin-uikit.js:1144-1181`): accordion, select, table sort/bulk, draggable, resizable, sortable, masonry. The rebuild iteratively rebuilds each of these in sync with the corresponding block sandbox.

#### `sandbox.runtime.js` (loaded for EVERY block)

**Sandbox-only.** Not shipped. Lives at `assets/js/next/sandbox.runtime.js`.

Responsibilities:
- Wire up sandbox toolbar (theme toggle button, accent-hue input, parity-rig toggle).
- Pipe accent-hue input → `Toolskin.setAccentHex(value)` or `Toolskin.setAccentOklch(value)`.
- Toggle parity-rig iframe visibility on button click.
- Auto-resize parity-rig iframe to match host content height (for side-by-side mode).
- Log block name + parity status to console for sandbox-author convenience.

### 4.3 Auto-init pattern (Rule 3 echo)

Per Rule 3 (ts-marquee canonical pattern: one-liner setup, data attributes, JS builds DOM, CSS styles via tokens), the rebuild's JS should auto-init on `DOMContentLoaded` with NO manual `Toolskin.init()` call required. Mirrors old `toolskin.js:5882-5890`:

```js
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Toolskin.init(__tsBoot));
} else {
  Toolskin.init(__tsBoot);
}
```

### 4.4 Apcach runtime hook (Rule 13 + Rule 15)

**Build-time (default):** `tools/color-engine/generate-colors.js` runs apcach, emits `assets/css/next/primitives/colors.css` with static OKLCH values. Shipped product has no apcach dep at runtime.

**Optional runtime (white-label / AI demos):** if the consumer wants live accent recompute, they load an additional `assets/js/next/toolskin.apcach-runtime.js` AFTER `toolskin.core.js`. This script:
- Imports a minimal apcach subset (or bundles it as ES module).
- Overrides `Toolskin.setAccentHex` / `Toolskin.setAccent` / introduces `Toolskin.setAccentOklch` to recompute the entire derivative chain via apcach and write the new primitives to `<html>` inline `style`.
- Re-dispatches `ts:ready` with updated config.

The base `_base.html` should **conditionally load** the apcach runtime when a `?apcach=runtime` query param is on the URL, OR when `data-apcach-runtime` is set on `<html>`. This lets sandbox sessions demo Rule 5 + Rule 15 without forcing the runtime dep on every block test.

**Rule 13 enforcement:** the runtime is opt-in. Shipped product = static primitives + theme toggle + accent setter writing HSL primitives. No Node deps cross over.

---

## 5. Parity-Rig Iframe Spec

### 5.1 Purpose

Side-by-side visual comparison: new rebuild rendering of a block (left/host) vs. old `toolskin.css` rendering of the SAME block markup (right/iframe). Lets the sandbox author verify visual parity before committing the new component CSS.

### 5.2 Layout

Two modes, toggled by the `[data-parity-rig-toggle]` button:

**Mode A — Side-by-side (default when toggle is ON):**
- Host document split 50/50 via flexbox. Left half = host's `#block-slot`. Right half = `<iframe class="ts-parity-rig">`.
- Both halves show the SAME block markup with their respective CSS.
- Sandbox toolbar spans full width above the split.

**Mode B — Overlay (alt mode, hold Alt key while clicking toggle):**
- Host `#block-slot` and iframe stack at the same position, iframe at 50% opacity. Manual visual diff by eye.

**Mode C — Toggle / hidden (default, toggle OFF):**
- iframe hidden via `hidden` attribute. Host fills full viewport. This is the default — parity is opt-in, not always-on, to avoid CDN spam from old `toolskin.css` (which pulls dynamic CDN assets via `toolskin-assets.js`).

### 5.3 The parity-rig host file

A SECOND file at `sandbox/_parity-rig.html`. Loaded ONLY inside the iframe. Contents:

- Minimal `<head>`:
  - `<meta charset="UTF-8" />`
  - `<title>v1 reference</title>`
  - **`<link rel="stylesheet" href="../../toolskin-showcase/assets/css/toolskin.css" />`** — the ONLY place the old CSS appears in the entire rebuild. Relative path via `../` traverses out of `toolskin-rebuild/` into the sibling `toolskin-showcase/` repo. **Read-only static load — never written to.**
  - Optional: `<link>` to Google Fonts (Space Grotesk, JetBrains Mono) so the old CSS's font tokens resolve.
- `<body>`: an empty `<div id="parity-slot">` that the parent window POSTs the SAME block markup into via `postMessage` (cross-frame messaging, since the iframe is technically same-origin only when served from the same dev server).

### 5.4 How the iframe receives the block markup

Two patterns, sandbox session chooses:

**Pattern 1 — Markup duplication (simpler):**
- The block sandbox `index.html` includes a `<template id="block-markup">` containing the block's markup once.
- The host (`#block-slot`) renders the markup directly.
- `sandbox.runtime.js` reads the `<template>`, sends `{ markup: template.innerHTML }` via `iframe.contentWindow.postMessage()` to the parity-rig iframe.
- `_parity-rig.html` listens for the message, inserts into `#parity-slot`.

**Pattern 2 — Query param (simplest, for static blocks):**
- Block sandbox URL: `?block=button-primary&markup=<encoded markup>`.
- Iframe reads its own `?block=...&markup=...` from `location.search` and renders.
- Falls back gracefully for static blocks with no JS state. Best for atomic blocks.

Pattern 1 is the default. Pattern 2 is a convenience for atomic blocks with trivial markup.

### 5.5 How the parity-rig loads the old CSS without modifying the old repo

The relative href `../../toolskin-showcase/assets/css/toolskin.css` is a **read-only static asset reference**. The browser fetches it via the static file server. **No write occurs.** Per Rule 6, Rule 12, and the file 07 isolation rules:
- The file is never `vim`'d, `Edit`'d, `Write`'d, or `mv`'d.
- The agent never `cd`s into `../toolskin-showcase/`.
- No `git` operations are run against the old repo.
- The path is literal — no symlinks, no junctions.

The dev server (e.g. `python -m http.server` run from `D:\Mis Documentos\Projects\Toolskin Framework\`) sees both folders as siblings under the same root, and serves both as static assets. Browsers fetch from `http://localhost:8000/toolskin-rebuild/sandbox/<block>/index.html` and the iframe fetches `http://localhost:8000/toolskin-showcase/assets/css/toolskin.css`. Pure read.

If a sandbox author runs a server rooted at `toolskin-rebuild/`, the iframe path won't resolve (escapes server root). In that case, document an alternative: serve the parent dir, or use `python -m http.server` from one level up. This is captured in `_base.html`'s top comment block.

### 5.6 Image-diff hooks (manual this session)

Out of Session 1 scope. The parity-rig provides the visual comparison surface; auto-image-diff (pixelmatch, looks-same, etc.) is a Session 4+ optimization. Manual screenshot comparison is sufficient for now.

**Spec marker:** `[ ] TODO — Session N: integrate pixelmatch or playwright visual regression for atomic blocks (PERMISSIVE tier auto-progress depends on parity threshold).` This is a feeder note for S5's autonomous protocol.

### 5.7 When the parity-rig is shown vs hidden

| State | When |
|---|---|
| **Hidden (default)** | First load of a sandbox. Author reviews the new rebuild rendering alone. Default state preserves visual focus + avoids CDN dependency spam from old `toolskin.css`. |
| **Shown (side-by-side)** | Author clicks "Compare with v1". Iframe loads, postMessage sends markup, side-by-side appears. |
| **Shown (overlay)** | Author Alt+clicks toggle. Overlay at 50% opacity for fine-grained visual diff. |
| **Hidden again** | Author clicks toggle once more, OR navigates away. |

The hidden default is important: a sandbox author starts a session WITHOUT pulling 8MB of FA + Ionicons + GSAP + Lenis via `toolskin-assets.js` in the iframe. They only pull it when they explicitly want the comparison.

---

## 6. Block Markup Slot Pattern

### 6.1 Exact pattern

```html
<main id="block-slot" data-block="<block-name>" data-block-tier="<atomic|molecular|layout>">
  <!-- BEGIN PER-BLOCK MARKUP — this is the only structural region a sandbox session edits -->

  <!-- Block markup goes here -->

  <!-- END PER-BLOCK MARKUP -->
</main>
```

### 6.2 Why `<main>` not `<div>`

- Semantic root for the page's primary content. Screen readers and dev tools recognize it.
- Matches the old showcase's `<main id="ts-main">` (`../toolskin-showcase/index.html:153`).
- Single `<main>` per page is the HTML spec recommendation.

### 6.3 Attributes

- **`id="block-slot"`** — JS hook for sandbox.runtime.js + parity-rig postMessage target.
- **`data-block="<block-name>"`** — machine-readable block identifier (e.g. `button`, `card`, `tree-explorer`). Used by `sandbox.runtime.js` to label the console and toolbar.
- **`data-block-tier="<atomic|molecular|layout>"`** — pulled from T1 typology. Used by `sandbox.runtime.js` to decide whether to load `toolskin-uikit.js`. Also used by S5 protocol to know which tier gate applies.

### 6.4 What the slot does NOT contain

- No sandbox-specific wrapper divs (`.demo-frame`, `.test-zone`, etc.). The block markup is pure.
- No `<section>` or `<article>` wrappers UNLESS the block ITSELF uses those (e.g. a `<section>` block sandbox naturally uses `<section>` as its top-level).
- No inline `<style>` overrides. If a block needs sandbox-only styles, they go in `assets/css/next/components/<block-name>.css` with a `.sandbox-only` scope class, OR (better) the block's own CSS is sufficient.

### 6.5 Composition vs isolation

Per Rule 7 ("block-by-block"), each sandbox tests ONE block in isolation. But many blocks are compositional (a `.ts-card` may contain `.ts-button`s; a `.ts-modal` may contain `.ts-input`s). The slot pattern supports this:
- The block under test is the OUTERMOST structural element in the slot.
- Inner composed blocks rely on their own (already-built) component CSS being loaded.
- Per S4 build-pipeline spec (forthcoming), the slot may load multiple `components/<name>.css` files when testing a compositional block. The base file's load order rule (§3.2 row 11) becomes "one or more component CSS files in dependency order, block under test loaded LAST."

T2 flags this as a contact point — S4 must define the load-order resolution for compositional blocks. See §9.

---

## 7. Theme Switcher in Base

### 7.1 What the base provides

Three controls in `<div class="ts-sandbox-toolbar">`:

1. **Theme toggle button** — `<button data-theme-toggle aria-label="Toggle theme">`. Sun/moon icon (rebuild uses inline SVG since CDN icons are off-base). Toggles `data-theme` on `<html>`, persists via `localStorage["ts-theme-mode"]`.

2. **Accent-hue input field** — `<input type="text" data-accent-input placeholder="#ff540a or 35 (hue degrees)" />`. Plus a sibling color-picker `<input type="color" data-accent-color-picker />` for owners who prefer GUI.
   - Text input accepts: hex (`#ff540a`), hue degrees (`35`), OKLCH (`oklch(0.7 0.18 35)`), or HSL (`hsl(18, 100%, 52%)`).
   - On change/blur, calls `Toolskin.setAccentHex(value)` (or appropriate variant per format detection).
   - If `?apcach=runtime` is enabled, the call routes through the apcach runtime; otherwise it writes basic HSL primitives.

3. **Parity-rig toggle** — `<button data-parity-rig-toggle>v1 parity</button>`. Per §5.

### 7.2 What this verifies (Rule 5)

The accent-hue input is the **smallest possible surface area** for the Rule 5 promise: *"give to anybody, AI or WordPress, and instantly adapts and merges to any convention because the tokens makes that possible."*

When an author types `30` (or `#33cc99`, or AI emits a hue) into the input:
- `Toolskin.setAccentHex` fires.
- Apcach (if runtime is loaded) recomputes the complete OKLCH primitive ramp + derivative chain.
- The block under test re-paints with the new accent, every contrast pair preserved, no manual intervention.
- The parity-rig iframe ALSO updates (since the old `toolskin.css` uses `--ts-accent-h/s/l` primitives too), letting the author confirm the new system reaches visual parity at any accent.

This is the demo. Rule 5 in 200 lines of HTML.

### 7.3 Rule 15 compliance

- The accent input does NOT write hex colors directly into component CSS.
- The accent input writes ONLY primitive values (`--ts-accent-h/s/l` HSL, OR `--ts-accent` OKLCH).
- The derivative chain (system layer) handles the recompute from those primitives.
- When apcach runtime is loaded, the apcach module replaces the chain's outputs with mathematically-verified contrast-preserving values. No manual hex picks ever leak in.

---

## 8. Reusability Guarantees (per Rule 7)

### 8.1 Sandbox folder structure (proposed)

```
sandbox/
├── _base.html                    # The single reusable base — locked at Session 2+ commit
├── _parity-rig.html              # Iframe target — also locked
├── 00-foundation/                # Foundation-tier sandboxes (color-lab, type-scale, surface-grid, etc.)
│   └── <subblock>/index.html     # Copy of _base.html with one block CSS + slot
├── 01-atomic/                    # Atomic-tier blocks (button, input, chip, ...)
│   └── <block-name>/index.html
├── 02-molecular/                 # Molecular-tier blocks (card, modal, accordion, ...)
│   └── <block-name>/index.html
├── 03-layout/                    # Layout-tier blocks (section, grid, panel, ...)
│   └── <block-name>/index.html
└── _template/                    # Reserved — Session 4 may put a "fill these markers" scaffolded base here
```

Tier prefixes (`00-` to `03-`) match T1 typology output (assumed — see §9 for T1 dependency). Sandbox depth from `_base.html` to its per-block instance is 3 levels deep, hence asset paths use `../../` prefix (§2.2 #5, §2.5 #5).

### 8.2 Copy vs symlink vs include

**Recommended: copy.** Each block sandbox session physically copies `_base.html` to `sandbox/<tier>/<block-name>/index.html`. Reasons:
- Diff visibility: git diff against `_base.html` shows the per-block delta cleanly.
- No symlink path issues on Windows (the canonical OS per project).
- Each block file is self-contained — no fragile linkage.

**Rejected: symlink.** Windows symlinks require admin or Developer Mode. Path resolution flaky.

**Rejected: server-side include.** Requires Node/PHP/etc. — violates Rule 13 (no runtime deps).

**Future-watch: HTML `<template>` import or Web Components.** Possible Session N optimization if reuse becomes onerous. Not in scope for Session 1.

### 8.3 What changes per block (the delta — MUST be small)

| Element | Edit per block? | Source of edit |
|---|---|---|
| `<title>` text | Yes | Block name |
| `<link>` to `components/<block-name>.css` | Yes (path swap) | Block CSS path |
| `<main id="block-slot">` contents | Yes | Block markup |
| `data-block` attribute on `<main>` | Yes | Block name |
| `data-block-tier` attribute on `<main>` | Yes | T1 typology |
| Asset path prefix `../../` | Sometimes | Only if sandbox depth changes from default 3 |
| Optional `<script>` for block-specific runtime hook | Rare | Only if block has unique JS (e.g. ts-marquee animation start hook) |

### 8.4 What stays identical across every block

- DOCTYPE + `<html lang>` line
- `<meta charset>` + FOUC theme inline script
- Viewport meta
- Favicon links
- Font preconnects + Google Fonts `<link>`
- FOUC guard inline `<style>`
- CSS load order 1–10 (everything before the component file)
- Sandbox toolbar (theme toggle, accent input, parity-rig toggle)
- `<iframe class="ts-parity-rig">` markup
- `<script>` tags for `toolskin.core.js` + (conditional) `toolskin-uikit.js` + `sandbox.runtime.js`
- `</body></html>` closing tags

The delta floor is ≤6 edits per block. Anything more = reusability violation.

### 8.5 Forbidden per-block edits

- DO NOT edit the cascade order (CSS load lines 1–10). The cascade IS the contract.
- DO NOT add new `<link rel="stylesheet">` in the per-block file unless the block has documented multi-CSS composition (rare; goes through S4 build-pipeline approval).
- DO NOT add inline `<style>` for "just this one block's quirk." If the block needs CSS, it goes in `components/<block-name>.css`.
- DO NOT remove the parity-rig iframe markup, even for atomic blocks where parity is trivial. Hidden ≠ removed.
- DO NOT modify the FOUC guard inline `<style>` per block. Once S1 locks the fallback OKLCH values, they apply universally.

---

## 9. Contact Points for Wave 2 + Later Sessions

### 9.1 Wave 2 consumers of this spec

| Sub-agent | Consumes from this spec | Action |
|---|---|---|
| **S1 Color Foundation Architect** | §2.4 FOUC guard fallback OKLCH values | S1 locks the exact OKLCH for `--ts-bg-body` dark + light fallbacks. T2 placeholders are approximations. |
| **S2 System Layer Architect** | §3.2 cascade contract, §4.3 OKLCH-derivative resolution | S2 confirms the system layer doesn't introduce ordering surprises that break the cascade. |
| **S3 Component Registry + Block Prioritization** | §6 slot pattern, §8.1 tier folder structure | S3's per-block sketch `block-spec.md` files (first 5 blocks) follow this slot pattern. S3 confirms tier folder names match T1 typology. |
| **S4 Build Pipeline Architect** | §3.2 load order, §6.5 compositional blocks open question, §8.3 delta floor | S4 spec must reconcile compositional-block multi-CSS loading. S4 also produces the dev-server convention (`python -m http.server` from parent dir vs in-repo) so the parity-rig path resolves. |
| **S5 Autonomous Execution Protocol Architect** | §6.3 `data-block-tier`, §5.6 parity-rig image-diff TODO | S5 defines what "parity threshold met" means for PERMISSIVE tier auto-progress. Likely uses the parity-rig + manual screenshot for Session 1–N; auto-diff for Session N+. |
| **S6 Repo Governance + Refusal Patterns Author** | §3.3 "MUST NOT appear in `<head>`", §5.5 read-only static load | S6's pre-commit hook can scan `sandbox/**/*.html` for forbidden patterns (e.g. `<link>` to `../toolskin-showcase/`) outside the parity-rig file. Defense-in-depth. |

### 9.2 Block sandbox session consumers (Session 4+)

Every block-sandbox session (per S5 protocol's tiered execution):
1. Reads this spec to understand the base.
2. Copies `sandbox/_base.html` to `sandbox/<tier>/<block-name>/index.html`.
3. Applies the small delta per §8.3.
4. Runs `python -m http.server` from one dir above the rebuild repo.
5. Opens `http://localhost:8000/toolskin-rebuild/sandbox/<tier>/<block-name>/`.
6. Iterates on block CSS, optionally toggles parity-rig for visual comparison.
7. Commits per S5 tier gate.

### 9.3 Dependencies on T1 / T3 (sibling Wave 1 sub-agents)

Because T1, T2, T3 wrote in parallel WITHOUT seeing each other's work, the following assumptions in this spec might collide with T1/T3 outputs. Orchestrator resolves at Gate 4 synthesis:

| Assumption | Source | If T1/T3 disagree, T2 yields on |
|---|---|---|
| Sandbox folder is `sandbox/<tier>/<block-name>/` with tier names `00-foundation / 01-atomic / 02-molecular / 03-layout` | §8.1 | T1's authoritative tier names. T2 happily renames folders to match T1. |
| Atomic blocks don't need `toolskin-uikit.js`; molecular+ do | §4.2 | T1's per-tier runtime-dep list. If T1 specifies a different boundary, T2's conditional load line shifts. |
| `data-block-tier` attribute exists | §6.3 | T1's preferred attribute naming. T2 yields on attribute name. |
| Apcach runtime is opt-in via `?apcach=runtime` or `data-apcach-runtime` | §4.4 | T3's adaptive integration contract may have a different bootstrap convention (e.g. `<html data-toolskin-config="apcach">`). T2 yields to T3's convention. |
| The accent-hue input is the canonical Rule 5 demo surface | §7.2 | T3's adaptive integration spec is THE authority on Rule 5 verification. If T3 specifies a different demo surface (e.g. white-label palette generator UI), T2 either adopts or adds a second toolbar control. |
| `assets/js/next/` is the JS sibling to `assets/css/next/` | §4.1 | Orchestrator approval at Gate 4 (S4 build pipeline also touches this). |

### 9.4 Skill consumers (Tier 1 — encoded in toolskin-architecture skill at Phase E)

This spec feeds Phase E's `SKILL.md` section 5 "Reusable HTML base context" verbatim. The Phase E author should:
- Copy §1 + §2 verbatim into SKILL.md.
- Reference §3 cascade contract from the cascade section of SKILL.md.
- Surface §8.5 "Forbidden per-block edits" as a refusal-pattern feeder for S6.

---

## 10. Open Questions / Contradictions Flagged

| # | Question | Why it matters | Recommended resolution |
|---|---|---|---|
| OQ1 | Does the rebuild use `assets/js/next/` or a flat `assets/js/`? | Affects script paths in §2.5 / §4.1. The new repo only has `assets/css/next/` scaffolded — no JS folder yet. | Orchestrator approves convention at Gate 4. Default proposal: `assets/js/next/` for symmetry. |
| OQ2 | Compositional blocks need multi-CSS loading. How is dependency order resolved? | §3.2 row 11 currently says "ONE block CSS." A `card` containing a `button` needs both. | S4 build-pipeline spec addresses. T2 spec captures the open question explicitly. |
| OQ3 | Does the parity-rig iframe need same-origin to use `postMessage`? Cross-origin loads OK? | If browsers treat the iframe as cross-origin, postMessage still works (it's designed for cross-origin), but the iframe DOM cannot be inspected from the host devtools easily. | Dev-server tip in §5.5: serve from parent of both repos. Documented in `_base.html` top comment. |
| OQ4 | Should `_parity-rig.html` itself live in the OLD repo as a "compatibility shim"? | Currently §5.3 puts it in `sandbox/_parity-rig.html` in the NEW repo. It only loads the OLD CSS — no edits. Some might argue it belongs near the OLD CSS. | **NO.** Rule 12 NEW REPO ONLY. The parity-rig is a sandbox tool of the rebuild. Lives in `sandbox/`. Loads the old CSS via relative `<link>`. T2 confident here. |
| OQ5 | Should atomic-tier blocks load `sandbox.runtime.js`? It's overhead for a button. | The toolbar (theme toggle + accent input) is the runtime's main job. Atomic blocks STILL benefit from theme + accent verification. | YES — load for every block. Cost is ~5KB minified. The discipline pays for itself. |
| OQ6 | The old showcase loads `toolskin-assets.js` for CDN deps (FA, Ionicons, GSAP, Lenis, Color.js). The rebuild has none of these in `_base.html` by default. What if a block sandbox NEEDS FA for icon rendering? | Atomic blocks like `icon` literally test FA-rendered glyphs. If FA isn't loaded, the sandbox can't render the icon. | **Per-block exception:** the block's sandbox `index.html` (NOT the base) can add a `<script src="../../assets/js/toolskin-assets.js" defer></script>` if needed. Document this in §8.3's "Sometimes" edit row. S6 governance can warn on this pattern but not block it. |
| OQ7 | `data-theme` vs `data-ts-theme` — the old showcase used both. The rebuild should use one. | Inline FOUC script (§2.3) currently uses `data-theme`. | **Confirm `data-theme` as canonical**, drop `data-ts-theme`. Captured in migration map (S1 / S2 to confirm). |

---

## 11. Status

**Status:** `DONE_WITH_CONCERNS`

**Concerns:**
- Multiple `[ ] TODO` and "Open Question" markers above. These require Wave 1 synthesis + Wave 2 specs (S1, S4 especially) to lock.
- The fallback OKLCH values in §2.4 are placeholders pending S1's apcach-derived primitive lock.
- The `assets/js/next/` folder convention is proposed but not yet ratified.
- Compositional-block multi-CSS loading (OQ2) is the largest open architectural question — must be resolved before Session 4+ block sandboxes begin.

**Completion:** The spec covers every required section (1-9 per brief). The `sandbox/_base.html` file itself is NOT written this session — spec only, per Rule 12 + spec restrictions. When Session 2+ creates the actual file, this spec is the source-of-truth.

---

## Footer — Conflicts with external skill flags (per file 06 / Rule 15)

None encountered. This spec is HTML/structure-focused and does not propose color values, palette logic, or contrast methodology. Rule 15's color authority remains intact via §4.4 (apcach runtime hook spec) and §7.3 (Rule 15 compliance of the accent input).
