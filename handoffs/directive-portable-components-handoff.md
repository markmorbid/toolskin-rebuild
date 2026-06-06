# DIRECTIVE — Portable Components Index: Nav Unification + Claude Code Handoff
**Primary target:** `portable-02-components/index.html`
**Nav target:** `portable-02-components/ts-topbar-nav.html` (v1 — owner-tuned baseline)
**v3 target:** `portable-02-components/ts-topbar-nav-v3.html` (bring to parity with v1)
**CSS reference (read-only):** `ts-nav-header_2_3_4.css` — the canonical nav CSS. Do NOT rewrite it. Use it as the source of truth. If something needs staging, add a `ts-nav-header-staging.css` addon only.
**Design reference:** https://satsea.io/toolskin-showcase/ — the visual and functional target.

---

## ABSOLUTE RULES (from owner handoff doc — binding)

1. **DO NOT DELETE anything.** Study, compare, document, add, extend, integrate only.
2. **Zero `!important` in final output.** Specificity via layer order + scope.
3. **Zero hardcoded hex.** All colors via tokens. `oklab` for color-mix except owner's srgb border system.
4. **Zero `[data-theme]` branches in nav CSS.** Surface tokens handle it automatically.
5. **`ts-nav-header_2_3_4.css` is the core nav CSS.** Do not run or rewrite it — extend via staging addon if needed.
6. **All shared assets (CSS, JS, tokens) live once.** No per-file duplication.
7. **v1 is the owner-tuned baseline.** Every change Satoshi made is deliberate. v3 must reach parity — not redesign v1.

---

## CONTEXT — What you're working with

**`ts-nav-header_2_3_4.css`** is a 3240-line clean reconstruction of the nav system. It has:
- 7 architectural layers (primitives → tokens → structure → selectors → variants → sub-elements → utilities)
- Scoped tokens via `:where(.ts-nav-fixed, .ts-nav-fixed *, ...)` — not `:root *`
- Glass via `::before` pseudo-element so dropdowns keep independent backdrop-filter context
- `--ts-on-surface-auto` drives all border/text auto-inversion
- `--ts-this-bg` set once per shell, derivatives cascade
- `ul > li > .ts-nav-item > a` selector contract already in place: `.ts-nav-fixed__links > :is(a, li, button, .ts-nav-item):not(.ts-btn)`

**`ts-topbar-nav.html` (v1)** is the owner-tuned visual reference. Its DOM structure, JS wiring, and design decisions ARE the spec for v3.

**`ts-btn_v3.1.css`** must be imported in the shared asset index — it is required for nav button styling to work correctly.

---

## TASK 1 — READ v1 COMPLETELY BEFORE TOUCHING v3

Open `ts-topbar-nav.html`. Catalog:
- Every CSS file linked (in order)
- Every JS file linked (in order)
- The exact DOM structure of the nav (logo, links, dropdown, controls)
- The icon injection pattern (`data-ts-icon`, `.ts-icon`, `auto-icons` class if present)
- The theme toggle markup (toggles.dev `expand` variant — see CSS lines 1521–1600)
- The top/back button markup and JS scroll trigger
- The burger markup and mobile menu DOM
- The variant classes applied to each showcase nav instance

That catalog IS the spec for v3. Implement from it, not from memory.

---

## TASK 2 — BRING v3 TO FULL PARITY WITH v1

Apply every pattern from the v1 catalog to v3. Specific known gaps:

### 2a — DOM structure: ul > li > a
The nav links must use `ul.ts-nav-fixed__links > li.ts-nav-item > a` structure.
CSS already supports `:is(a, li, button, .ts-nav-item)` — the selector is ready.
Approach B (JS auto-wrap) is preferred per the handoff doc:
- `ts-nav.js` wraps bare `<a>` children into `<li class="ts-nav-item"><a>` automatically
- Idempotent (running twice does not double-wrap)
- Mobile menu clones from the processed DOM, not the raw source
- Write precise JS dev notes if not fully implementable in design phase

### 2b — Dropdown: ul/li nested sub-items, interactive
The dropdown uses `.ts-nav-more` + `.ts-nav-dropdown` pattern from `ts-nav-header_2_3_4.css` §4.4.
- Hidden by default (`opacity:0; visibility:hidden; pointer-events:none`)
- Revealed on hover OR `.is-open` OR `aria-expanded="true"` — already in CSS
- The `<ul.ts-nav-dropdown>` is inside `.ts-nav-more`
- Sub-items: `<li class="ts-nav-item"><a>` structure
- Chevron: CSS-drawn `::after` or inline SVG — not a font icon (avoids FA dependency)
- Parent active state: `:has(a.active)` already wired in CSS §4.2

### 2c — Icon injection: auto-icons
The original showcase uses `ToolskinIcons.inject()` from `toolskin.js`.
Pattern: elements with `data-ts-icon="fa-solid fa-house"` get a `.ts-icon` span prepended.
For the `auto-icons` class behavior (keyword-based icon assignment):
- JS reads `.ts-menu-text` content
- Matches keywords against a lookup table (from FA metadata JSON + ionicons examples)
- Prepends matching `.ts-icon[data-ts-icon="..."]` as sibling of `.ts-menu-text`
- Write the lookup table and JS as a staging addon (`ts-nav-auto-icons.js`) if not already in `ts-nav.js`

### 2d — Logo: inline SVG symbol
Logo must use the inline SVG `<use href="#ts-logo-symbol">` pattern — not `<img>` with relative path.
The symbol `<defs>` block must be at the top of each portable HTML file.
Source: `docs/references/branding/logos/toolskin-icon.svg`

### 2e — Theme toggle: toggles.dev expand variant
Exact markup from CSS lines 1528–1540:
```html
<label class="theme-toggle theme-toggle--force-motion" data-tooltip="Switch Dark/Light Mode" data-tooltip-pos="bottom" data-theme-toggle>
  <input type="checkbox" />
  <span class="theme-toggle-sr">Toggle theme</span>
  <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="1em" height="1em" fill="currentColor" class="theme-toggle__expand ts-icon ts-btn-icon" viewBox="0 0 32 32">
    <clipPath id="theme-toggle__expand__cutout">
      <path d="M0-11h25a1 1 0 0017 13v30H0Z"/>
    </clipPath>
    <g clip-path="url(#theme-toggle__expand__cutout)">
      <circle cx="16" cy="16" r="8.4"/>
      <path d="M18.3 3.2c0 1.3-1 2.3-2.3 2.3s-2.3-1-2.3-2.3S14.7.9 16 .9s2.3 1 2.3 2.3zm-4.6 25.6c0-1.3 1-2.3 2.3-2.3s2.3 1 2.3 2.3-1 2.3-2.3 2.3-2.3-1-2.3-2.3zm15.1-10.5c-1.3 0-2.3-1-2.3-2.3s1-2.3 2.3-2.3 2.3 1 2.3 2.3-1 2.3-2.3 2.3zM3.2 13.7c1.3 0 2.3 1 2.3 2.3s-1 2.3-2.3 2.3S.9 17.3.9 16s1-2.3 2.3-2.3zm5.8-7C9 7.9 7.9 9 6.7 9S4.4 8 4.4 6.7s1-2.3 2.3-2.3S9 5.4 9 6.7zm16.3 21c-1.3 0-2.3-1-2.3-2.3s1-2.3 2.3-2.3 2.3 1 2.3 2.3-1 2.3-2.3 2.3zm2.4-21c0 1.3-1 2.3-2.3 2.3S23 7.9 23 6.7s1-2.3 2.3-2.3 2.4 1 2.3 2.3zM6.7 23C8 23 9 24 9 25.3s-1 2.3-2.3 2.3-2.3-1-2.3-2.3 1-2.3 2.3-2.3z"/>
    </g>
  </svg>
</label>
```
JS wires `data-theme-toggle` to toggle `[data-theme]` on `<html>` and sync the checkbox state.

### 2f — Top/back button: in-nav, full-height icon-item pattern
The top button lives INSIDE the nav bar (not floating). It uses the `@icontype-topnav-tokens` pattern:
- `align-self: stretch`, `min-width: var(--ts-nav-icon-item-w)`, `height: 100%`
- `border-left: 1px solid var(--ts-nav-border)`
- Hidden by default; `ts-nav.js` adds/removes `.visible` class on scroll
- On mobile: rotates to signal "scroll to next section" when at top
- Icon: chevron/arrow, `transform: rotate(270deg)` = pointing up

### 2g — Remove modifier option controls
Per owner directive: "eliminate the modifier options as they are useless and break the color logic."
Remove the variant toggle controls panel from v3. The variants are demonstrated by separate static nav instances on the page, not by runtime JS toggles.

### 2h — Surface tokens: --ts-this-bg propagation
Every nav background reference must be:
```css
background: color-mix(in oklab, var(--ts-this-bg), transparent var(--ts-nav-bg-alpha));
```
Set `--ts-this-bg: var(--ts-bg-body)` once on `.ts-nav-fixed`. All derivatives cascade.
Surface preset and accent preset controls write to `:root` via `Toolskin.setAccentHex()` or direct CSS property write on `document.documentElement`. No scoped overrides.

---

## TASK 3 — UNIFY index.html: shared assets, unified controls

All portable component files share one asset set. `index.html` is the host.

### Shared CSS load order (exactly this):
```html
<!-- 1. Primitives -->
<link rel="stylesheet" href="../assets/css/next/primitives/colors.css">
<link rel="stylesheet" href="../assets/css/next/primitives/typography.css">
<link rel="stylesheet" href="../assets/css/next/primitives/spacing.css">
<link rel="stylesheet" href="../assets/css/next/primitives/radius.css">
<link rel="stylesheet" href="../assets/css/next/primitives/motion.css">
<!-- 2. System -->
<link rel="stylesheet" href="../assets/css/next/system/surfaces.css">
<!-- 3. Components -->
<link rel="stylesheet" href="../assets/css/next/components/ts-btn_v3.1.css">
<link rel="stylesheet" href="../assets/css/next/components/ts-nav-header.css">
<!-- 4. Staging addon (if needed) -->
<!-- <link rel="stylesheet" href="../assets/css/next/components/ts-nav-header-staging.css"> -->
```

### Shared JS load order:
```html
<script src="../assets/js/toolskin.js" defer></script>
<script src="../assets/js/ts-nav.js" defer></script>
<!-- staging addon -->
<!-- <script src="../assets/js/ts-nav-auto-icons.js" defer></script> -->
```

### Unified controls (one panel, affects all nav instances):
- Theme toggle (dark/light) — writes `data-theme` on `<html>`
- Accent color picker — calls `Toolskin.setAccentHex()`
- Surface preset selector — calls `Toolskin.applySurfacePreset()` or writes tokens to `:root`
- **No variant modifier toggles** — removed per owner directive

---

## TASK 4 — ICON AUTO-INJECTION (staging addon)

Write `ts-nav-auto-icons.js` as a staging file (not merged into toolskin.js yet).

**Behavior:**
- On DOMContentLoaded, scan all `.auto-icons` nav containers
- For each `<a>` or `<li> > <a>` without an existing `.ts-icon` sibling:
  - Read `.ts-menu-text` content (or `<a>` text)
  - Normalize: lowercase, strip punctuation, split words
  - Match against keyword lookup table
  - If match found: prepend `<span class="ts-icon" data-ts-icon="[matched-icon]" aria-hidden="true"></span>` before `.ts-menu-text`
- Call `ToolskinIcons.inject()` on the container after prepending

**Lookup table structure:**
```js
const NAV_AUTO_ICONS = {
  // FontAwesome
  home: 'fa-solid fa-house',
  dashboard: 'fa-solid fa-gauge',
  about: 'fa-solid fa-circle-info',
  contact: 'fa-solid fa-envelope',
  docs: 'fa-solid fa-book',
  blog: 'fa-solid fa-rss',
  pricing: 'fa-solid fa-tag',
  settings: 'fa-solid fa-gear',
  profile: 'fa-solid fa-user',
  login: 'fa-solid fa-right-to-bracket',
  logout: 'fa-solid fa-right-from-bracket',
  search: 'fa-solid fa-magnifying-glass',
  products: 'fa-solid fa-box',
  services: 'fa-solid fa-wrench',
  portfolio: 'fa-solid fa-briefcase',
  // Ionicons (for environments with ionicons loaded)
  // 'analytics': 'ion:analytics-outline',
};
```

Extend from FA JSON metadata file if provided. The table is the minimum viable set — engineer extends it.

---

## TASK 5 — INTEGRATION HANDOFF NOTES (for Claude Code)

Write `docs/handoffs/ts-nav-portable-integration-handoff.md` with:

### What's done (design-complete, ready to integrate):
- [ ] `ts-topbar-nav.html` — v1 owner-tuned baseline, all patterns proven
- [ ] `ts-topbar-nav-v3.html` — brought to v1 parity, all tasks above completed
- [ ] `index.html` — unified controls, shared asset load order, no redundant styles

### What needs Claude Code:
1. **`ts-nav.js` — `.ts-menu-text` auto-wrap** (TASK-nav-unification, already filed):
   - Every `<a>` processed by `ToolskinDynamicNav` gets its text wrapped in `<span class="ts-menu-text">`
   - Idempotent
   - Mobile menu clones from the processed DOM
   
2. **`ts-nav.js` — Approach B auto-wrap for ul/li**:
   - Scan `.ts-nav-fixed__links` children
   - Wrap bare `<a>` in `<li class="ts-nav-item">` if not already wrapped
   - Idempotent

3. **`ts-nav-auto-icons.js` → merge into `ts-nav.js`** after staging validation:
   - Move `NAV_AUTO_ICONS` lookup table to `ts-nav.js`
   - Fold `autoInjectIcons()` into `ToolskinDynamicNav.init()`

4. **`ts-btn_v3.1.css` → copy to `assets/css/next/components/`**:
   - Confirm it doesn't duplicate tokens already in primitives
   - Add to shared load order

5. **`ts-nav-header_2_3_4.css` → copy to `assets/css/next/components/ts-nav-header.css`**:
   - This is the canonical nav CSS — it belongs in `next/`
   - Do not modify — it is locked

6. **Verify `--ts-on-surface-auto` is defined** in `system/surfaces.css`:
   - It must resolve to a color that reads legibly on `var(--ts-this-bg)` in both modes
   - If not defined: it's a system layer gap — surface engineer must add it

7. **Verify `--ts-radius-constrained` is defined** in `primitives/radius.css`:
   - Used by nav UI radius tokens — if missing, nav corners will break

8. **`.impeccable.md` entry** for nav patterns:
   - `@icontype-topnav-tokens` harmonic sizing is intentional — not a sizing bug
   - `align-self: stretch` on icon items is intentional full-height design
   - `border-left: 1px` vertical dividers between items are intentional — not to be merged/removed
   - `--ts-nav-bg-alpha: 100%` on `.at-top` (fully transparent) is intentional scroll-spy behavior
   - `z-index: 9999` on `.ts-nav-fixed:has(.ts-menu-burger.active)` is intentional burger-open override

### Acceptance criteria for integration:
- [ ] All nav instances in `index.html` render correctly in dark + light
- [ ] Theme toggle, accent picker, surface presets all update all nav instances simultaneously
- [ ] Dropdown opens on hover, closes on mouse-out, is not clipped
- [ ] Mobile: burger shows, menu slides in from right, overlay scrim behind
- [ ] Top button appears on scroll > 200px, arrow points up, rotates on mobile at-top
- [ ] Icon injection fires on `.auto-icons` containers
- [ ] No console errors
- [ ] `git commit --no-verify` not required (pre-commit hook passes)

---

## EXECUTION ORDER

```
1  Read v1 completely — catalog all assets, DOM, JS, patterns
2  Verify shared asset list and load order for index.html
3  Apply DOM parity to v3 (Tasks 2a–2h)
4  Remove modifier controls from v3 (Task 2g)
5  Write ts-nav-auto-icons.js staging addon (Task 4)
6  Update index.html unified controls + shared imports (Task 3)
7  Visual audit — dark + light — all nav variants — all controls
8  Write integration handoff notes (Task 5)
```

Halt after step 7. Show visual confirmation before writing the handoff.

---

## HARD CONSTRAINTS

- `ts-nav-header_2_3_4.css` is read-only reference — never modify it directly
- Zero redundant styles — if something is already in the canonical CSS, do not re-declare it
- Zero `[data-theme]` branches in component CSS
- Zero hardcoded hex
- Zero `!important` in new output
- Every control must affect all nav instances simultaneously — no per-instance wiring
- No invented layouts — match v1 exactly
