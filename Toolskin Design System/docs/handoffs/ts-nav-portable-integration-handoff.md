# ts-nav Portable Integration Handoff

**Project:** Toolskin Design System · `portable-02-components`
**Date:** 2026-06-03
**Status:** Design-complete — ready for Claude Code integration

---

## What's done (design-complete)

- [x] **`ts-topbar-nav.html` (v1)** — owner-tuned baseline. Read-only reference. All patterns proven.
- [x] **`ts-topbar-nav-v3.html`** — brought to full v1 parity. All Tasks 2a–2h applied:
  - **2a** — All nav links carry `ts-nav-item ts-nav-item--text/icon/button` classes; text is wrapped in `<span class="ts-menu-text">`.
  - **2b** — Overflow dropdown uses `ul.ts-nav-dropdown > li.ts-nav-item > a` structure with `id="navbar-collapse"` / `id="navbar-extend"`.
  - **2c** — Icon items carry `data-ts-icon`; mobile container has `ts-auto-icon` class for `ts-nav-auto-icons.js`.
  - **2d** — Logo SVG symbol: **staged for Claude Code** (requires SVG source, see §What needs Claude Code below).
  - **2e** — Theme toggle: exact SVG expand variant, `theme-toggle--force-motion`, `data-theme-toggle`, unique `clipPath id="tt-v3-main"`.
  - **2f** — Back-to-top: `ts-btn ts-btn--icon ts-back_top-nav` in-nav pattern; `ts-nav.js` reveals `.active` past 300 px scroll.
  - **2g** — Modifier option switcher panel (`#ts-switcher`) **removed**.
  - **2h** — Surface tokens: `--ts-this-bg` propagation via `ts-nav-header.css` Layer 2 (already correct in canonical CSS).
- [x] **`assets/js/next/ts-nav-auto-icons.js`** — staging addon written (Task 4). Load after `ts-icons.js`. Activated by uncommenting its `<script>` tag in the harness.
- [x] **`index.html`** — CSS load order updated: `ts-btn_v3.1.css` + `ts-nav-header.css` added before `harness.css`. Unified controls provided by `harness-tester.js` (theme, accent, surface presets — no nav-specific modifier toggles).

---

## What needs Claude Code

### 1 · `ts-nav.js` — `.ts-menu-text` auto-wrap
**File:** `assets/js/next/ts-nav.js`
**Ticket ref:** TASK-nav-unification

Every `<a>` processed by nav init must get its raw text node(s) wrapped in `<span class="ts-menu-text">`. Idempotent — skip anchors already containing a `.ts-menu-text`.

```js
function wrapMenuText(container) {
  container.querySelectorAll('a:not([data-menu-text-wrapped])').forEach(function (a) {
    Array.from(a.childNodes)
      .filter(function (n) { return n.nodeType === 3 && n.textContent.trim(); })
      .forEach(function (n) {
        var span = document.createElement('span');
        span.className = 'ts-menu-text';
        span.textContent = n.textContent;
        n.parentNode.replaceChild(span, n);
      });
    a.setAttribute('data-menu-text-wrapped', '1');
  });
}
```

### 2 · `ts-nav.js` — Approach B `ul > li` auto-wrap
**File:** `assets/js/next/ts-nav.js`

Scan `.ts-nav-fixed__links` children. If a direct child is a bare `<a>` (not inside an `li.ts-nav-item`), wrap it. Idempotent.

```js
function wrapNavLinks(linksEl) {
  Array.from(linksEl.children).forEach(function (child) {
    if (child.tagName !== 'A') return;
    if (child.closest('li.ts-nav-item')) return;
    var li = document.createElement('li');
    li.className = 'ts-nav-item';
    linksEl.insertBefore(li, child);
    li.appendChild(child);
  });
}
```

Mobile menu must clone from the **processed** DOM (after both wraps), not the raw source.

### 3 · `ts-nav-auto-icons.js` → merge into `ts-nav.js`
After staging validation:
1. Copy `NAV_AUTO_ICONS` lookup table into `ts-nav.js`.
2. Fold `autoInjectIcons()` into `ToolskinDynamicNav.init()`.
3. Delete `ts-nav-auto-icons.js`.

### 4 · Logo SVG symbol (Task 2d)
**Source:** `docs/references/branding/logos/toolskin-icon.svg`

Pattern:
```html
<!-- At top of each portable HTML, inside <body> before all other content: -->
<svg aria-hidden="true" style="display:none;">
  <defs>
    <symbol id="ts-logo-symbol" viewBox="0 0 …">
      <!-- paths from toolskin-icon.svg -->
    </symbol>
  </defs>
</svg>

<!-- Logo usage: -->
<a class="ts-topbar__logo" href="#">
  <svg class="ts-logo-symbol" aria-hidden="true"><use href="#ts-logo-symbol"></use></svg>
  <span class="ts-logo-brand">TOOL<em>SKIN</em></span>
  <span class="ts-logo-sub">Design System</span>
</a>
```

### 5 · Verify `--ts-on-surface-auto` in `toolskin-this-bg-v2.css`
The nav CSS uses `--ts-on-surface-auto` for border/text auto-inversion. This token must resolve
to a colour legible on `var(--ts-this-bg)` in both modes. If it is missing, nav borders will not
auto-invert in light mode. Add to `system/toolskin-this-bg-v2.css` if absent.

### 6 · Verify `--ts-radius-constrained` in `primitives/radius.css`
Used by `--ts-nav-ui-radius` (Layer 2 of `ts-nav-header.css`). If missing, nav button corners
will fall back to `undefined` and may break to square or 0.

### 7 · `ts-btn_v3.1.css` — confirm no token duplication
File is already in `assets/css/next/components/`. Confirm that none of its token declarations
duplicate variables already defined in `primitives/`. If duplication found, remove from btn file;
primitive wins.

### 8 · Framework select (`ts-ui-select`)
Not integrated in v3 harness. The v1 harness includes a `ts-ui-select` (framework picker).
Add to v3 when `ts-ui-select.css` + its JS initialiser are ready for portable use.

---

## Acceptance criteria

- [ ] All nav instances in `ts-topbar-nav-v3.html` render correctly in dark + light
- [ ] Theme toggle (SVG expand animation), accent, and surface presets all update simultaneously via Variant Tester (bottom-right)
- [ ] Dropdown opens on hover / `.is-open` / `aria-expanded="true"`, closes on mouse-out, not clipped
- [ ] Mobile: burger shows at narrow viewport, menu slides in from right, scrim behind
- [ ] Back-to-top appears on scroll > 300 px, arrow points up
- [ ] Icon injection fires on `.ts-auto-icon` containers (`ts-nav-auto-icons.js` or merged equivalent)
- [ ] No console errors on any harness in dark + light
- [ ] `--ts-on-surface-auto` resolves correctly in both modes
- [ ] `--ts-radius-constrained` resolves correctly

---

## .impeccable.md entries

These patterns are **intentional design decisions** — not bugs. Do not override.

| Pattern | Token / Class | Why intentional |
|---------|--------------|----------------|
| Harmonic icon-item sizing | `--ts-nav-icon-item-w` derived from `--ts-topbar-h` | Creates rhythmic proportions; fixed px would break at custom heights |
| Full-height icon items | `align-self: stretch` on `.ts-back_top-nav`, burger, theme toggle | Full-height tap target + visual divider line |
| Vertical item dividers | `border-left: 1px solid var(--ts-nav-border)` on icon-type items | Intentional separator — not to be removed or merged |
| Transparent at top | `--ts-nav-bg-alpha: 100%` on `.at-top` | Glass fully transparent when page is at y ≈ 0; scroll-spy pattern |
| Burger z-index override | `z-index: 9999` on `.ts-nav-fixed:has(.ts-menu-burger.active)` | Ensures open mobile menu sits above all other fixed layers |
| Unique clipPath IDs | `id="tt-v3-main"`, `id="tt-expand-cutout-main"` etc. per page | SVG clip paths are global; duplicate IDs silently break the wrong instance |
| `ts-nav-truncate` overflow contract | Only `.ts-nav-link` items are truncatable | Non-link items (icons, toggles) must never relocate to dropdown |

---

## File inventory

```
portable-02-components/
  ts-topbar-nav.html              ← v1 baseline (read-only)
  ts-topbar-nav-v3.html           ← v3 (this update — v1 parity)
  index.html                      ← host index (CSS load order updated)
  assets/
    css/next/
      primitives/                 ← unchanged
      system/                     ← unchanged
      components/
        ts-nav-header.css         ← canonical 2.3.4 (read-only)
        ts-btn_v3.1.css           ← required for nav button styles
        ts-promo-banner.css       ← required by v3 promo banner
    js/next/
      ts-icons.js                 ← icon injection shim
      ts-nav.js                   ← nav behaviors (burger/overflow/scroll/theme)
      ts-nav-auto-icons.js        ← NEW: auto-icon staging addon (Task 4)
      harness-tester.js           ← shared Variant Tester
```
