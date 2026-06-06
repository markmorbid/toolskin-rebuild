# Toolskin Nav/Header — Pattern Report v3
**Owner:** Satoshi · **Analyst:** Claude Design · **Date:** 2026-05-31

> This report names every design technique extracted from the v2.3 nav CSS as a **reusable, documented pattern** — not as a description of the nav. Each pattern is the template that teaches downstream agents how to build at this level.

---

## Diff Summary: backup (abd5a316) → v2.3

| Area | Change |
|---|---|
| `at-top` block | Expanded from 1 token to full cascade: alpha, text-muted, burger color, icon rotation, per-child backdrop resets |
| Nested `&` discipline | Flat multi-selector rules converted to nested blocks throughout |
| `.ts-tabbed` variant | New sub-variant inside `.spaced` block |
| `--ts-nav-border-active` | New token: accent-on-surface border for active states |
| `--ts-nav-btn-radius` | Now `calc(var(--ts-nav-ui-radius) * 0.85)` — tighter than ui-radius, separate from header-ui-rad |
| Floating back-to-top | New desktop fixed variant with rotation animation |
| Mobile icon-reveal transition | `.ts-ui-select` gains `transition-property`, `transition-behavior: allow-discrete` |
| Top-arrow rotation | `at-top` block: `.ts-back_top-nav .ts-icon { transform: rotate(270deg) }` |
| Icon-item hover | Now uses `--ts-navlink-color: var(--ts-navlink-color-active)` via token override, not direct color |
| Button smart spacing | `:not(:has(+.ts-btn))` pattern for last-button end margin |
| Mobile back-to-top | Always rendered inline (`opacity: 1; pointer-events: all; transform: translateX(0)`) vs. backup's slide-in |
| Burger-open state | Deeper `.ts-nav-fixed:has(.ts-menu-burger.active)` block with select collapse |

---

## Pattern 1 — Single-Knob Color Dimming

**Token:** `--ts-nav-text-alpha`

One percentage controls every nav ink value. Change the knob; all nav text, icons, and borders re-tint simultaneously.

```css
--ts-nav-text-alpha: 50%;
--ts-text-primary-dim-nav: color-mix(in oklab, var(--ts-text-primary), transparent var(--ts-nav-text-alpha));
--ts-navlink-color: var(--ts-text-primary-dim-nav);
```

**How to apply to other components:**
Define `--ts-{component}-text-alpha` at component scope. Derive all ink from it with `color-mix`. Never hardcode a secondary/muted color — derive it from primary + alpha.

**At-top uses this pattern:**
```css
.ts-nav-fixed.ts-nav--transparent.at-top {
  --ts-nav-text-alpha: 0%; /* 0% = fully transparent → text = --ts-text-primary */
}
```

---

## Pattern 2 — Harmonic Icon-Item Sizing

**Token family:** `--ts-nav-icon-item-w / -h / -icon`

Toggle, burger, and back-to-top derive ONE width + height from `--ts-topbar-h`. Three sub-tokens; one anchor:

```css
--ts-nav-icon-item-w:    calc(var(--ts-topbar-h) - var(--ts-navlink-pad-x-mult));
--ts-nav-icon-item-h:    calc(var(--ts-topbar-h) - 1px);   /* -1px: divider never overlaps border */
--ts-nav-icon-item-icon: calc(var(--ts-nav-icon-item-w) * 0.5); /* glyph = 50% of cell */
```

**Rule:** height = topbar − 1px so the left-border divider never overlaps the header's bottom border. Glyph = cell-width × 0.5 for optical balance.

**How to apply to other components:**
Any full-height cell in a fixed bar uses this formula. The 1px subtraction is the divider clearance pattern — use it wherever a border cell sits adjacent to a container border.

---

## Pattern 3 — Auto-Inverting Border via `--ts-on-surface-auto`

**Token:** `--ts-nav-border`

The border resolves correctly on ANY surface — dark, light, accent — with zero per-surface overrides:

```css
--ts-nav-border: color-mix(in oklab, var(--ts-on-surface-auto), transparent var(--ts-nav-border-alpha));
```

`--ts-on-surface-auto` is the seed of the on-surface inversion system: it resolves to dark ink on light surfaces, light ink on dark surfaces. The alpha knob (`--ts-nav-border-alpha: 90%`) keeps it subtle.

**On accent surfaces:** the `ts-on-accent` rule overrides `--ts-nav-border` with srgb (owner exception):
```css
--ts-nav-border: color-mix(in srgb, var(--ts-on-accent), transparent 72%);
```

**How to apply to other components:**
Every component border should be `color-mix(in oklab, var(--ts-on-surface-auto), transparent N%)`. Never `rgba(255,255,255,N)` or `rgba(0,0,0,N)` — those break on the wrong surface.

---

## Pattern 4 — Constrained Radius Cap

**Token:** `--ts-radius-constrained`

Stops a large `--ts-radius-base` from breaking header UI. Caps the radius so pill inputs never look ridiculous in a dense bar:

```css
--ts-radius-cap-raw:    var(--ts-radius-md);
--ts-radius-constrained: min(var(--ts-card-radius, var(--ts-radius-sm)), var(--ts-radius-cap-raw));
--ts-header-ui-rad:     var(--ts-radius-constrained);
```

**Rule:** full-height controls (divider cells) keep `border-radius: 0`. Non-full-height pill controls (buttons, select trigger) use `--ts-header-ui-rad`. Sub-variants get `* 0.85`.

**How to apply to other components:**
Any compact UI bar (toolbar, chip row, tab strip) needs a constrained radius token. Use `min(var(--ts-radius-desired), var(--ts-cap))` to prevent the user's global radius token from breaking dense UI.

---

## Pattern 5 — Derivative Spacing Chain

**Token family:** `--ts-navlink-mult-*`

One multiplier set rescales the entire nav density:

```css
--ts-navlink-mult-lg: 1.5;
--ts-navlink-mult-md: 1.25;
--ts-navlink-mult-sm: 0.9;
--ts-navlink-mult-xs: 0.65;
--ts-navlink-gap:        calc(var(--ts-navlink-fs) * var(--ts-navlink-mult-xs));
--ts-navlink-pad-x-mult: calc(var(--ts-navlink-pad-x) * var(--ts-navlink-mult-lg));
--ts-navlink-pad-y-mult: calc(var(--ts-navlink-pad-y) * var(--ts-navlink-mult-sm));
```

Change `--ts-navlink-mult-lg` from 1.5 to 1.0 → every horizontal padding tightens. No value hunting.

**How to apply to other components:**
Every dense component (tabs, chips, table cells, toolbar buttons) should define a `--{component}-mult-*` set and derive all paddings/gaps from it. Change one multiplier → whole component rescales.

---

## Pattern 6 — Smart First/Last Button Spacing

Uses `:first-child`, `:not(.ts-btn)+.ts-btn`, and `:not(:has(+.ts-btn))` to give buttons correct breathing room when mixed with nav-links in the same flex row:

```css
/* Base: every button gets small gap */
&>.ts-btn { margin-left: var(--ts-navlink-gap); }

/* First button after non-button: larger entry margin */
&>:not(.ts-btn)+.ts-btn,
&>.ts-btn:first-child { margin-left: var(--ts-navlink-pad-x); }

/* Last button: end margin so it's not flush against the wall */
&>.ts-btn:not(:has(+.ts-btn)),
&>.ts-btn:last-child { margin-right: var(--ts-navlink-pad-x); }
```

**How to apply:** same pattern works in any toolbar or action bar where buttons and non-button items coexist.

---

## Pattern 7 — Nav-Scoped Motion Override

Motion tokens are scoped to `.ts-nav-fixed *` etc., NOT `:root`. This prevents the nav's timing presets from overriding `primitives/motion.css` globally:

```css
:where(.ts-nav-fixed, .ts-nav-fixed *, .ts-topbar, .ts-topbar *, ...) {
  --ts-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ts-dur-fast: 220ms;
  /* ... */
}
```

**Rule:** Never set motion tokens on `:root` from a component file. Scope them to the component's subtree via `:where()` (zero specificity — primitives can still override).

---

## Pattern 8 — Surface Re-anchor (`--ts-this-bg` set once, cascade everything)

```css
:where(.ts-nav-fixed, .ts-nav-static, .ts-topbar, .ts-mobile-menu, .ts-sidebar-menu) {
  --ts-this-bg: var(--ts-bg-body);
}
```

One assignment. Every `--ts-this-bg-*` derivative (surface, border, hover, focus, dim, bright) resolves from it. To re-theme the entire header: override `--ts-this-bg` on a parent.

**The on-accent variant only needs:**
```css
.ts-nav-fixed.ts-on-accent {
  --ts-this-bg: var(--ts-accent);
  /* → ALL derivatives auto-resolve against the accent surface */
}
```

**How to apply:** ALWAYS set `--ts-this-bg` at the component root. Never set `background-color` directly — set the token, let the engine produce the color.

---

## Pattern 9 — At-Top Refactor (scroll-status signal)

`at-top` is a **scroll-status signal only**. The transparent feature is a separate opt-in class:

```css
/* SIGNAL: applied by JS when scrollY < 10 */
.ts-nav-fixed.at-top {
  /* Only functional signals here */
  .ts-back_top-nav .ts-icon, #ts-top-btn .ts-icon {
    transform: rotate(270deg); /* arrow → "next section" signal */
  }
}

/* FEATURE: transparent header, opt-in */
.ts-nav-fixed.ts-nav--transparent.at-top {
  --ts-nav-bg-alpha: 100%;     /* fully transparent backdrop */
  --ts-nav-border-alpha: 100%; /* border disappears too */
  --ts-nav-text-alpha: 0%;     /* text = full primary (no dimming) */
  --ts-text-muted: var(--ts-on-surface-auto);
  --ts-menu-burger-color: var(--ts-on-surface-auto);
  &::before { backdrop-filter: none; }
}
```

**Rule:** `at-top` alone has no visual effect. Transparent behavior requires BOTH `.ts-nav--transparent` AND `.at-top`. This means a page can use `.at-top` for scroll-spy without activating transparent mode.

---

## Pattern 10 — Mobile Icon-Reveal Transition

When the mobile sidebar opens, the select collapses to zero width via a smooth transition. Uses `transition-behavior: allow-discrete` for `display` changes:

```css
.ts-ui-select {
  transition-property: width, max-width, min-width, overflow, opacity, display, visibility, padding;
  transition-behavior: allow-discrete;
  transition-duration: 300ms;
  transition-timing-function: ease;
  transition-delay: 0.3s;
}
```

**Rule:** when collapsing a flex child to zero, animate `max-width` + `padding` + `overflow: hidden` rather than `display: none` (which is instant). The `allow-discrete` flag enables `display` to participate in the transition timeline.

---

## Pattern 11 — Top-Arrow Rotation Signal

The back-to-top arrow rotates 270° when the user is at the top of the page, signaling "scroll to next section" instead of "return to top":

```css
.ts-nav-fixed.at-top {
  .ts-back_top-nav .ts-icon, #ts-top-btn .ts-icon {
    transform: rotate(270deg);
  }
}
```

**Rule:** the same icon control communicates two states through rotation. The transition (400ms ease) on `.ts-icon` in the base icon-item rule handles the animation automatically.

---

## Nested Structure Inventory

All nested `&` blocks found in v2.3. Pattern is **consistent**: states, variants, and children are INSIDE the parent block.

| Parent block | Nested children |
|---|---|
| `.ts-topbar__logo` | `& .ts-logo-brand`, `& em`, `& span.ts-logo-sub` |
| `.ts-nav-fixed__links, .ts-nav-dropdown, .ts-mobile-menu-items` (shared) | `&>:is(...)`, `&:hover`, `&:is(.active,...)`, `&::after`, `& .ts-icon` |
| `.ts-nav-fixed__links` (horizontal-specific) | `&>:is(...)` → height/padding/`::after` |
| `.ts-nav-more` | `& .ts-more-trigger` + `:hover`, `&:hover>.ts-nav-dropdown`, `&.is-open>...` |
| `.ts-nav-dropdown` | `&>:is(...)` → padding/border/`::after`/hover, `&>.ts-btn` spacing |
| `.theme-toggle` | `& input`, `& .theme-toggle-sr`, `& .theme-toggle__expand` |
| `#ts-top-btn, .ts-back_top-nav` | `&.active`, `& .ts-icon`, `& i` |
| `.ts-menu-burger` | `& .ts-menu-burger-inner` + `::before/::after` |
| `.ts-nav-fixed.spaced / .ts-nav--spaced` | `.ts-nav-fixed__links` → `gap/align`, `&>:is(...)`, `&>.ts-btn` |
| `.ts-nav-fixed.spaced.ts-tabbed` (sub-variant) | `.ts-nav-fixed__links` → `&>:is(...)` with tab-specific radius/border |
| `.ts-nav-fixed:not(.ts-nav--static)` (in @media) | `.ts-menu-burger`, `.theme-toggle`, `.ts-ui-select`, `#ts-top-btn` |
| `.ts-nav-fixed:has(.ts-menu-burger.active)` | `&::before`, `& :is(links/select/more)`, `.ts-ui-select`, `.ts-ui-select__trigger` |
| `.ts-nav-fixed.at-top` | `&::before`, `.ts-more-trigger`, `.theme-toggle`, `.ts-back_top-nav .ts-icon` |
| `.ts-mobile-menu-items` | `&>:is(...)` → padding/border/`::after`/hover/active, `&>.ts-btn` |
| `.ts-sidebar-menu` | `& .ts-topbar__logo`, `& .ts-nav-fixed__links`, `& .ts-nav-fixed__links>:is(...)` |

**Verdict:** nesting pattern is consistent. The `&` always refers to the parent class. All states (`:hover`, `:is(.active,...)`), all pseudo-elements (`::before`, `::after`), and all sub-elements are nested inside their owner's block.

---

## Pattern 12 — On-Surface Consolidation Path (TASK 4)

The select-trigger token cartel currently requires manual overrides:
```css
/* Current — explicit per-element overrides */
.ts-nav-fixed .ts-ui-select .ts-ui-select__trigger {
  border-color: var(--ts-navlink-input-border);
  background-color: var(--ts-navlink-input-bg);
  --ts-input-bg: color-mix(in srgb, var(--ts-this-bg), var(--ts-on-surface-muted) 8%) !important;
}
```

**Target:** eliminate the cartel by making `--ts-input-bg` a first-class engine derivative:
```css
/* In toolskin-this-bg-v2.css (or ts-input.css) */
--ts-input-bg: color-mix(in oklab, var(--ts-this-bg), var(--ts-on-surface-auto) 5%);
--ts-input-bg-hover: color-mix(in oklab, var(--ts-this-bg), var(--ts-on-surface-auto) 10%);
--ts-input-border: color-mix(in oklab, var(--ts-on-surface-auto), transparent 75%);
```

When `--ts-this-bg` re-anchors (surface, accent, glass), all input derivatives resolve automatically. The nav trigger needs zero overrides — it just re-anchors `--ts-this-bg: var(--ts-input-bg)` as it already does, and the engine handles the rest.

**Implementation:** this is a `ts-ui-select` migration task, not a nav task. The nav can remove the cartel once `ts-input.css` emits these derivatives from the engine.

---

## TASK-nav-unification Requirements

Separate open JS task. Fold into the JS handoff:

1. **`.ts-menu-text` auto-wrap regression** — on narrow viewports, `.ts-menu-text` inside nav items wraps, breaking the single-line layout. Fix: add `white-space: nowrap` to `.ts-menu-text`, or ensure the nav item has `overflow: hidden; text-overflow: ellipsis`.

2. **`data-ts-nav-variant` schema** — JS should read `data-ts-nav-variant` attribute on `.ts-nav-fixed` to apply the correct variant class on init, avoiding a flash of the default variant before JS runs. Schema: `data-ts-nav-variant="spaced tabbed transparent"` → adds `.ts-nav--spaced .ts-tabbed .ts-nav--transparent` on DOMContentLoaded.

3. **Desktop/mobile menu unification** — the desktop nav items and mobile menu items are currently two separate DOM trees (`ts-nav-fixed__links` + `ts-mobile-menu-items`). Unification means JS mirrors the desktop links into the mobile menu, keeping one source of truth in the HTML. The overflow relocation already does this partially for the `•••` dropdown — extend the same pattern to the mobile menu.
