---
name: expert-designer
version: 8.1.0
priority: 100
scope: design
description: >
  **AUTHORITATIVE DESIGN SKILL.** v8.1 adds CSS Component Discipline (§17),
  JS/CSS State Sync contract (§18), and the CSS Refactor Tag taxonomy (§19)
  extracted from the owner's hand-annotated nav CSS work. All other content
  from v8 is preserved verbatim.
license: MIT
---

# Expert Designer — Toolskin (v8.1)

> **Changelog from v8.0:** §14–§16 unchanged. Added §17 (CSS component discipline
> — 10 patterns from owner work report), §18 (JS↔CSS state-class sync contract),
> §19 (refactor tag taxonomy). Updated §8 hard guardrails (#16–#19). Updated §9
> checklist.

---

<!-- ═══════════════════════════════════════════════════════════════════════
     SECTIONS 0–16 ARE IDENTICAL TO v8.0
     See docs/skills/expert-designer-v8.md for the full text.
     This file records only the DELTA (new sections + updated guardrail list).
     ═══════════════════════════════════════════════════════════════════════ -->

## 8 · Hard guardrails (v8.1 additions — #16–#19)

These four rules were extracted from the owner's hand-annotated `ts-nav-header.css`
work report (2026-06-06) and are now binding on all ATOMIC and CHROME tasks.

| # | Violation | Replacement |
|---|---|---|
| 16 | `background:` set to `var(--ts-accent)` or any color token directly | `--ts-this-bg: var(--ts-accent); background: var(--ts-this-bg);` |
| 17 | `oklch(from …)`, `color-mix(…)`, or auto-resolution formula present in component CSS | Move to L2/L3 system layer; component reads resolved token only |
| 18 | Hardcoded `z-index: <number>` literal | Use `--ts-z-*` token from `primitives/z-index.css` |
| 19 | Reset rules inside a component file | Move to `core/reset.css` in `@layer base` |

*(Rules #1–#15 from v8.0 remain in force — see `docs/skills/expert-designer-v8.md` §8.)*

---

## 9 · Verification (v8.1 additions to checklist)

Additional items for ATOMIC and CHROME tasks:

- [ ] No `background: var(--ts-accent)` direct bypass (guardrail #16).
- [ ] No formula (`oklch`, `color-mix`) in component CSS (guardrail #17).
- [ ] No `z-index: <number>` literal (guardrail #18) — all through `--ts-z-*`.
- [ ] No reset rules in component CSS (guardrail #19).
- [ ] CSS↔JS state class sync verified (§18 contract).
- [ ] Conditional refactor patches NOT removed before removal condition is met (§19 tag taxonomy).

*(Full v8.0 checklist items still apply — see §9 in expert-designer-v8.md.)*

---

## 17 · CSS Component Discipline — Owner Work Report Patterns

> Extracted from the owner's hand-annotated refactor of `ts-nav-header.css`
> (2026-06-06). These encode what the owner found broken in the prior approach
> and what they enforced during the rebuild. For CHROME tasks, check each
> pattern before writing a line of CSS.

---

### OWP-01 · Reset layer belongs in core, never in a component

```
✓ core/reset.css — @layer base { ... }
✗ components/ts-nav-header.css — lines 9-257 (being relocated)
```

**Rule:** Any normalization/reset block found in a component file must be relocated
to `core/reset.css`. It must load BEFORE all primitive CSS. It must NOT be inlined
or duplicated into other files.

---

### OWP-02 · Token DEFINITIONS belong in their layer; components CONSUME only

Three token types must never be defined inside a component file:

| Token type | Correct layer | WRONG location |
|---|---|---|
| Z-index stack (`--ts-z-*`) | `primitives/z-index.css` | Inside any component |
| Animation presets | `primitives/motion.css` or `primitives/animation.css` | Inside any component |
| Border smart tokens (light/dark alpha dims) | `system/on-surface.css` or `system/borders.css` | Inside any component |

**Rule:** If you find a token DEFINITION of any of these types inside a component,
move it to the correct layer. Component files only use `var(--ts-*)` references.

---

### OWP-03 · Five architectural invariants — never violate

These are the owner's settled decisions. Any refactor that breaks one is a regression.

1. **Scoped tokenization:** Layer-2 tokens on `:where(<nav scopes>)` — NOT `:root *`.
   Reason: performance. Never flood the whole page with component tokens.

2. **Glass via `::before`:** Glass/backdrop-filter always on the pseudo-element,
   never on the parent. Reason: dropdowns need independent backdrop-filter contexts.

3. **Engine-true color:** Every surface/border/ink reads a primitive or oklab
   `--ts-this-bg-*` derivative. Zero sRGB mixes, zero hardcoded hex in components.

4. **Zero `!important`:** Specificity solved by layer order + scope, not overrides.
   Exception: owner-flagged conditional patches (see OWP-10) which carry a removal
   condition and must be removed when that condition is met.

5. **Load order:** `primitives/* → system/* → components/ts-btn_v3.1.css →
   components/ts-nav-header.css → harness.css`. Never deviate.

---

### OWP-04 · Color and radius engine MUST leave the component

**Color engine** (L608): Remove `oklch(from …)` and `color-mix` formulas from the nav
component → relocate to `system/on-surface.css`. The component reads resolved tokens.

**Radius constraint system** (L636, L655): The chain
`--ts-radius-cap-raw → --ts-radius-constrained → --ts-header-ui-rad → --ts-nav-ui-radius → --ts-nav-btn-radius → --ts-nav-dropdown-radius`
must move to `system/radius-engine.css` (new) OR be extended in `primitives/radius.css`.
`--ts-radius-cap-raw` is a **user-overridable** setting; it must have a base default
in the system layer and be overridable per-nav via a scoped token.

**Rule:** After extraction, the nav file uses only the terminal token
(e.g. `border-radius: var(--ts-nav-btn-radius)`). No intermediate math.

---

### OWP-05 · Separators — variant-gated, not global

Separators between nav items are only valid in **flat/non-pill** variants.
Hard exclusions:
- NEVER in `.ts-tabbed`
- NEVER in `.ts-nav--full-height`
- NEVER in `.ts-nav--icon-only`
- NEVER adjacent to `.active` / `.ts-active` items

**Implementation rule:** Gate the separator display with:
```css
.ts-nav-fixed:not(.ts-tabbed):not(.ts-nav--full-height):not(.ts-nav--icon-only)
  .ts-nav-item:not(.ts-active):not(:has(+ .ts-active))::after { ... }
```
Never use complex adjacency chains that break on variant switches.

---

### OWP-06 · Surface switching via attributes, not style strings

Prefer `data-ts-surface-variant="accent"` over `[style*="--ts-this-bg: var(--ts-accent)"]`.

```css
/* ✓ Attribute-driven (Phase 5 target) */
[data-ts-surface-variant="accent"] { --ts-this-bg: var(--ts-accent); }

/* ✗ String-matching style attribute (current — being migrated) */
[style*="--ts-this-bg: var(--ts-accent)"] { ... }
```

**Rule:** All NEW surface-switching code uses the attribute system.
Existing `[style*=…]` selectors are migrated in Phase 5 — do not add more.

---

### OWP-07 · Conditional patches have a removal condition — respect it

Some CSS patches use `!important` because the source of the problem is not yet fixed.
These are tagged `[harness-fix]` in the owner's taxonomy. Each one carries:
1. A comment stating what it patches
2. The condition under which it must be removed

```css
/* HARNESS FIX — remove once ts-topbar-nav-v3.html no longer injects background */
.ts-harness-stage { background: transparent !important; }
```

**Rule:** NEVER remove a `[harness-fix]` patch until its stated removal condition is
confirmed met. Check the CSS refactor tracker (`docs/handoffs/css-refactor-tracker.md`)
before touching any `!important` in the nav file.

---

### OWP-08 · Raw accent color assignment is a production bug

```css
/* ✗ PRODUCTION BUG — bypasses --ts-this-bg engine */
background: var(--ts-accent);

/* ✓ Correct — routes through the engine */
--ts-this-bg: var(--ts-accent);
background: var(--ts-this-bg);
```

**Rule:** Applies to ALL background assignments everywhere — not just nav.
`on-accent` and `on-surface-auto` are separate resolution paths; setting
`--ts-this-bg` to the accent triggers the correct `on-surface-auto` path.
Never conflate them.

---

### OWP-09 · Top-offset is a global layout system, not a per-component concern

The fixed-nav + promo-banner offset stack is computed as:
```css
--ts-layout-offset-top: calc(var(--ts-topbar-h) + var(--ts-promo-banner-visible-h, 0px));
```
Applied ONCE on `<body>`. Never split across multiple `:has()` selectors in
different components. Never mix padding and negative margin for the same offset.

Four normalized states:
- **A:** nav only
- **B:** nav + banner visible
- **C:** nav + banner dismissed
- **D:** no fixed nav

Each state sets `--ts-layout-offset-top` once. Every component reads it.

---

### OWP-10 · Full-height icon controls — three design rules

From owner notes at L1331 (theme toggle) and L1436 (burger):

1. **Theme toggle:** Full-height mode is ALWAYS enabled EXCEPT when
   `.ts-nav-item--button` variant is active. Never add full-height to button-type items.

2. **Burger:** The original exact design is the reference. Implement on the current
   code basis AND incorporate improvements + tokens — do not redesign the layout.

3. **Mobile borders:** On mobile (`.is-collapsed` / `@media max-width`), border-width
   on full-height icon controls must be `0px`. They show dividers on desktop,
   none on mobile.

---

## 18 · JS↔CSS State Class Sync Contract

> Every state class the JS emits must match a CSS rule that consumes it.
> Every CSS rule keyed on a state class must be listed in `TS_STATE` in `ts-nav.js`.
> Mismatches silently break layouts without console errors — catch them here.

### The canonical class registry (`TS_STATE` in `ts-nav.js`)

| Key | Class emitted | Where | CSS consumer |
|---|---|---|---|
| `htmlAtTop` | `is-at-top` | `html` | `html.is-at-top .ts-nav-fixed` (glass, border) |
| `htmlScrolled` | `has-scrolled` | `html` | `html.has-scrolled .ts-nav-fixed` |
| `navAtTop` | `at-top` | nav shell | `.ts-nav-fixed.at-top` (legacy alias) |
| `topVisible` | `is-visible` | `#ts-top-btn` | `#ts-top-btn.is-visible` |
| `topVisibleAlt` | `active` | `#ts-top-btn` | `#ts-top-btn.active` (legacy alias) |
| `htmlMobileOpen` | `ts-nav-mobile-open` | `html` | `html.ts-nav-mobile-open` |
| `navMobile` | `ts-nav--mobile` | nav shell | `.ts-nav-fixed.ts-nav--mobile` |
| `hasItems` | `hasItems` | `#navbar-collapse` | `.ts-nav-more.hasItems` |
| `activeDrawer` | `active` | burger, overlay, drawer | `.ts-menu-burger.active`, etc. |
| `collapsed` | `is-collapsed` | nav shell | `.ts-nav-fixed.is-collapsed` (bridge CSS) |
| `narrow` | `is-narrow` | nav shell | `.ts-nav-fixed.is-narrow` (bridge CSS) |

**Sync rule:** When adding a new JS-emitted class, ALSO add a CSS rule for it
before committing. When renaming a CSS class, ALSO update `TS_STATE`. Both
changes must go in the same commit — never one without the other.

**Thresholds that matter:**
- `scrollThreshold: 80px` (new — `htmlAtTop`/`htmlScrolled`/`topVisible`)
- `legacyAtTopMax: 10px` (old — `navAtTop`)
- `legacyTopShow: 300px` (old — `topVisibleAlt`)
These are migration aliases. Both sets of classes must work until the CSS is
updated to use only the new classes.

---

## 19 · CSS Refactor Tag Taxonomy

Used in `ts-nav-header.css` owner annotations. Any agent editing the nav CSS must
understand what these tags mean before removing or modifying tagged blocks.

| Tag | Meaning | Action rule |
|---|---|---|
| `[layout-offset]` | Block is part of the fixed-nav+banner offset system; must be unified into `--ts-layout-offset-top` at body | Do NOT simplify individually; wait for the full §B-9 refactor |
| `[harness-fix]` | `!important` patch for a harness-injection bug; NOT for production | Do NOT remove until injection source is blocked (see css-refactor-tracker.md §B-7) |
| `[separators]` | Separator system block; over-complex; only valid in flat variant | Do NOT add complexity; simplify per §B-5 when authorized |
| `[icon-align]` | `.ts-icon` subpixel misalignment fallback | Targeted fix only — `display:inline-block` on the specific element; never a layout system change |

---

## 20 · ts-nav.js → toolskin.js migration map (HANDOFF-ts-nav-consolidation.md)

> When folding `ts-nav.js` into the canonical `toolskin.js` engine, follow this
> exact rename/action map. The standalone file was built to be engine-portable.

| Standalone | Library target | Action |
|---|---|---|
| `TSDynamicNav` | `ToolskinDynamicNav` | Drop-in replace; statics/methods already match |
| `TSMobileMenu` | `ToolskinMobileMenu` | Replace; **keep static-first adoption** (it's a superset) |
| `TSTheme` | `ToolskinTheme` (full engine) | **Delete** TSTheme — engine owns this |
| `TSNavCollapse` | `ToolskinNavCollapse` | Move; reuses shared registry/config |
| `fitLogoSubtitles` | `ToolskinLogoLockup` (new module) | Promote as own module reading config flags |
| `TSIcons` (shim) | `ToolskinIcons` (real) | **Delete** — ToolskinIcons is global |
| `isShowcase` | shared engine predicate | Keep; share across modules |
| `resolveLengthPx` / `readTokenPx` | engine shared utils | Move to utils |
| `ready()` + bottom `init()` | `Toolskin.init()` lifecycle | Replace bootstrap with engine lifecycle |

**Hoist first (before any rename):**
1. `TS_SELECTORS` + `TS_IDS` + `TS` helper → `Toolskin.selectors`
2. `TS_STATE` → `Toolskin.stateClasses`
3. `TS_TOKENS` + `TS_TOKEN_DEFAULTS` → `Toolskin.tokens`
4. `TS_CONFIG_DEFAULTS` + `resolveConfig` → `Toolskin.config`

**Search anchor:** Every module carries a `MIGRATION:` comment. Grep `MIGRATION` in
`ts-nav.js` and follow each annotation in place.

**Acceptance checks (must all pass before merge):**
- [ ] No duplicate burger/overlay/drawer when static markup exists
- [ ] `--ts-nav-collapse-at` set inline moves THAT nav's breakpoint only
- [ ] `@media` px track the token at runtime (verify via DevTools `mediaText`)
- [ ] `1140px`/`min-width` rules unchanged
- [ ] `ul>li` dropdown showcases and `.ts-nav--static` navs render unchanged
- [ ] Logo subtitle width-match on live header AND harness examples
- [ ] `window.TSNavConfig` (global) and `Toolskin.init({…})` (local) both override
- [ ] Legacy `TS_NAV_DISABLE_*` flags still work
- [ ] Scroll state sets both `.at-top` + `.is-at-top`/`.has-scrolled`
- [ ] Top button gets both `.is-visible` + `.active`

---

## v8.1 changelog vs v8.0

| Change | Why |
|---|---|
| Added §17: 10 CSS Component Discipline patterns (OWP-01–OWP-10) | Extracted from owner's hand-annotated nav CSS refactor (2026-06-06) — encodes what the owner actually enforces |
| Added §18: JS↔CSS State Class Sync Contract | Canonical TS_STATE registry + sync rule to prevent silent class mismatches |
| Added §19: CSS Refactor Tag Taxonomy | 4 owner tags ([layout-offset], [harness-fix], [separators], [icon-align]) agents must recognize |
| Added §20: ts-nav.js → toolskin.js migration map | Verbatim from HANDOFF-ts-nav-consolidation.md; agents can execute the migration from the skill |
| Added guardrails #16–#19 to §8 | Formalizes the 4 new invariants |
| Updated §9 checklist | Added 6 new v8.1 items |
