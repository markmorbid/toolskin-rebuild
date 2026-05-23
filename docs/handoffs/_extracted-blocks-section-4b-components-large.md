# Extracted Blocks Catalog — Section 4b: Components (large, 19KB–87KB)

**Sub-agent:** 4b  ·  **Chunk:** components/ large files  ·  **Files:** 11  ·  **Total lines:** 12,874  ·  **Total bytes:** ~398KB

Scope: the 11 largest component files under `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/`. Discipline was GREP-FIRST per the dispatch brief — the 87KB `headermenu-…-sidebarnav.css` file alone is 2,544 lines and was never read whole. Companion chunk: `_extracted-blocks-section-4a-components-small.md`.

## Files in this chunk

| File | Lines | Bytes | Block type |
|---|---|---|---|
| ts-masonry+layout-priitives.css | 642 | 19,119 | layout engine — `.ts-masonry` v5 (container queries) + auxiliary layout primitives (`.ts-stack`/`.ts-cluster`/`.ts-grid--auto`/`.ts-sidebar`/`.ts-split`/`.ts-frame`/`.ts-center`); 7 media-query overrides for `.ts-section:has(.ts-marquee)` flagged TEMPORARY |
| footer-component.css | 861 | 19,584 | layout block — `footer.ts-footer` + 5 widgets (`.ts-footer-row`/`-column`/`-columns`/`-widget`/`-socket`) + `.ts-footer--dark` variant + responsive collapse |
| ts-checkbox-radio.css | 803 | 24,227 | dedupe-target — `.ts-checkbox-row` + `.ts-checkbox` + `.ts-control--checkbox`/`--radio` + sizes (sm/md/lg/xl) + `.ts-radio-group` + duplicated `.ts-ui-control--*` family + light-theme styles; flagged `@ts-inputs-refactor-dedupe #START_DEDUPE` |
| ts-patterns.css | 515 | 25,367 | imported asset (MagicPattern-adapted) — `[class*="ts-pattern-"]` 12-ish pattern families (`-dots`/`-grid`/`-cross`/`-wtf`/`-zigzag`/`-checkerboard`/`-diagonal-stripes`/`-dots-dense` etc.) + size/opacity modifiers + animation keyframes |
| iconlist+featlist-allvariants-component.css | 671 | 26,242 | **canonical three-tier component** — §6c v2 `.ts-list` + `.ts-feat-list` rebuild w/ LAYER-1/LAYER-2 architecture + clamp icon engine + custom `--ts-this-bg-border` derivative recipe |
| ts-panel+root-debugger-component.css | 1,091 | 32,380 | compound — §6c `.ts-panel`/`.ts-ui-panel` panel system (declared TWICE: L6–280 + L877–1091) + §6d `--ts-nest-radius`/`--ts-nest-pad` NEW-B16 nest-reduction system + `#ts-debug-root` dev-only debugger widget (L301–500) + scoped `.ts-ui-select` rules (L594–855) |
| inputs-global-nested-design-pattern.css | 1,493 | 38,203 | **the canonical "nested design pattern" reference (Rule 4 surface superposition)** — §6e inputs base + §6f range slider (+ `@property --ts-range-val`) + §6g chips/tags + §6h tabs + §6i badges/status + §6j navigation + §6k modal/overlay + §6l tables stub; 5 `@keyframes`, 1 `@property` |
| ts-card-flip-swipe-interactive-component.css | 1,392 | 41,076 | compound — §6b `.ts-card` base + §6q `.ts-flip-card` 3D + §6q.2 `.ts-swipe-card` non-3D + §6r `.ts-pricing-card` + text-shadow engine (`--ts-shadow-*`) + §6s `.ts-testimonial`; @property for shadow-blur/offset/opacity |
| ts-card-flip-swipe-interactive-component2.css | 1,392 | 41,076 | **EXACT BIT-FOR-BIT DUPLICATE of #8** — `diff -q` returns no output. See "Card-flip duplicate verdict" below. |
| ts-ui-select-variants(disordered).css | 1,470 | 44,097 | dropdown engine (owner-acknowledged "disordered" structure) — `.ts-ui-select__dropdown`/`__trigger`/`__option` + `.ts-icon-dd-list` icon-picker variant + `.ts-icon-selected-row` w/ search overlay + scoped overrides for `.ts-banner-generator-app`/`.ts-card-col-half`/`.ts-modal` + JS-driven `--ts-ui-select-trigger-min-height` |
| headermenu-topnav-fixednav-mobilemenu-sidebarnav.css | 2,544 | 86,627 | **THE BIG ONE** — 5 logical components compounded (top-nav, fixed-nav, mobile-menu, sidebar-nav, header-menu/burger) + 2 dev-only floating fixed buttons (`#ts-top-btn`/`.ts-back_top-nav`/`.ts-nav-more`). See "headermenu split" section below. |

---

## Special case: card-flip #8 vs #9 — duplicate verdict

Verdict: **EXACT bit-for-bit duplicate.** `diff -q ts-card-flip-swipe-interactive-component.css ts-card-flip-swipe-interactive-component2.css` returns NO output (both 41,076 bytes, both 1,392 lines, identical token declarations on identical line numbers). Not an alternate, not a revision — a literal copy. Owner action recommended: **DELETE `…component2.css`** unless the duplicate is acting as a snapshot-for-comparison sentinel; if so, rename it `…component.SNAPSHOT-YYYY-MM-DD.css` to make the intent explicit. Catalog body below treats them as ONE file.

## Special case: ts-ui-select-variants `(disordered)` — what the owner meant

The `(disordered)` parenthetical in the filename is an owner self-flag: the file's selectors are NOT grouped by component layer, NOT grouped by state, and inline structural CSS is interleaved with theming overrides. The L9 `@ts-component-consolidate` opening tag and the four large embedded refactor briefs (L10–53 dropdown SCOPE CONSOLIDATION, L206–271 ts-card-col-half CRITICAL LAYOUT OVERRIDE — DO NOT CONSOLIDATE, L857–1058 ICON SELECTOR REQUIRED REFACTOR, L1257–1340 cascade-abuse note) constitute the structural reorganisation plan the owner already wrote against this file. Recommended structural reorg (lifted from the embedded briefs verbatim where possible):

1. **Hoist all `--ts-input-*`/`--ts-select-item-bg*`/`--ts-input-border*`/`--ts-shadow-accent` token declarations to a single `.ts-ui-select` component root.** Dropdown, trigger and option layers MUST only CONSUME tokens, never re-declare them.
2. **Split responsibilities per layer:** structure→`__dropdown`; shape→component root; theme tokens→component root; ICON variant→`.ts-ui-select--icon` modifier (NOT a separate selector tree using `.ts-icon-dd-list`/`.ts-fullselector-wrapper`).
3. **Collapse state model** to {idle, hover, open, selected}. Remove chained `:has()` state derivations; move open/has-value/search-active to JS.
4. **Quarantine `.ts-banner-generator-app` overrides** to TOKEN-OVERRIDES ONLY — no structural rules, no state logic.
5. **Keep `.ts-card-col-half`-scoped width override (L206–271) AS-IS** — explicitly flagged DO NOT CONSOLIDATE; it's a layout-context fix, not reusable behaviour.
6. **Replace "NONE" state pseudo-element hack** (`✖` glyph via `::after`, L1453+) with a JS data-attribute (`data-state="empty"`).
7. **CSS-driven logic that should be JS:** icon "none" rendering, conditional visibility hacks, search/input overlay opacity transitions tied to hover.

## Special case: ts-panel+root-debugger — separate panel vs debugger concerns

This is two unrelated components shoehorned into one file. The catalog separates them:

- **Panel (`.ts-panel` + `.ts-ui-panel` alias)** — L1–280 (and DUPLICATED L874–1091): production component, ships. Carries the §6d NEW-B16 `--ts-nest-radius`/`--ts-nest-pad` nest-reduction system (the only place this is defined). The L282–299 `@ts-panel--refactor-plan` block explicitly states: *"ts-ui-panel is currently added as an alias due to #ts-debug-root requirements; the debugger widget layout needs different settings than the original ts/panel showcase, so dedicated rules and some #ts-debug-root–scoped overrides were introduced to avoid breaking the demo. INTENT: unify ts/panel and ts-ui-panel into a single system after refactor."*
- **`#ts-debug-root` debugger (L301–500)** — DEV-ONLY widget. Floats a debug panel via `--ts--debug-root-offset-y` calc. **This should NOT ship in the production bundle.** Recommend gating behind a `dev`/`debug` build flag or stripping at bundle time. Owner has not yet annotated this.
- **Scoped `.ts-ui-select` re-styling at L594–855** — bleeds an entire select restyle into the panel file. Belongs in `ts-ui-select-variants(disordered).css` and should be lifted out.
- **Panel rules duplicated TWICE** — L6–280 and L874–1091 are near-identical copies of `.ts-panel` declarations. Pure dead code in the second half; collapse to one.

## Special case: inputs-global-nested-design-pattern — the "nested design pattern" reference

Per Rule 4 (surface superposition), this is the canonical reference. The pattern is:

1. **Token resolution layer** (`.ts-input:not(.ts-resizable), .ts-select, .ts-textarea:not(.ts-resizable), .ts-ui-select__trigger, .ts-input-group, .ts-input-group.ts-input-inset-button, .ts-resizable-wrap` at L101–136): declares local `--_input-accent`/`--_input-focus`/`--_input-color`/`--_input-bg`/`--_input-border` PRIVATE tokens prefixed `--_` (underscore = local-only), THEN maps them to public `--ts-input-*` tokens. Consumer rules read `--ts-input-*`, never `--_input-*`.
2. **Surface re-anchoring** (L147 `.ts-input` family sets `--ts-this-bg: var(--ts-input-bg);`) — the input REWRITES `--ts-this-bg` so the whole surface-derivative chain inside the input is re-anchored to the input's own background.
3. **Cascading variant overrides** consume the same public tokens, never the privates — see `.ts-modal__body .ts-input` (L331–354) which overrides `--ts-input-bg` and the `--ts-this-bg`/`--ts-this-bg-border` pair cascades.
4. **Component-level overrides** (badges L1025–1027, chips L686–688, banner-generator L1191+) follow the same protocol — set `--ts-this-bg`, set `--ts-this-bg-mix`, all derivative properties recompute automatically.

This is the pattern Session 3 `surfaces.css` should formalise. The chips block (L660–780) is the cleanest example: 4 declarations on `.ts-chip:not(.ts-align-anchor-btn)` set `--ts-this-bg-dim`/`--ts-accent-bright`/`--ts-this-bg-mix` and the entire visual variant (idle, hover, active, success/warning/danger/accent) cascades from there.

## Special case: headermenu — split into 5 logical components

The 2,544-line `headermenu-topnav-fixednav-mobilemenu-sidebarnav.css` file is FIVE compound components plus floating UI helpers. Logical split:

### COMPONENT A — header-level token cartel (L1–225)
- **Selector signature:** `:root .ts-modal, :root .ts-modal *, :root .ts-topbar, :root .ts-topbar *, :root .ts-footer, :root .ts-footer *, :root .ts-mobile-menu *, :root .ts-nav-static, :root .ts-nav-static *, :root .ts-nav-fixed, :root .ts-nav-fixed *` (L19–29) — the substring-distribution token cartel for the entire header family. **R-cascade violation** (Rule 8) — this is exactly the `:root [class*=...]` substring-distribution pattern the rebuild forbids.
- Declares the entire `--ts-navlink-*` / `--ts-header-*` / `--ts-burger-*` / `--ts-menu-burger-*` / `--ts-shadow-bold*` / `--ts-fs-base` (0.68rem scoped) / `--ts-fs`/`--ts-fs-xs` recomputation / `--ts-topbar-h` / `--ts-nav-btn-h` token surface.
- Carries 4 large embedded `REFACTOR NOTE crucial:` briefs (L10, L93, L128, L151) — see annotations below.

### COMPONENT B — top-nav (`.ts-nav-static`)
- Selectors: `.ts-nav-static`, scattered, mostly token-cartel inherited. **Lowest specificity, fewest overrides.**

### COMPONENT C — fixed-nav (`.ts-nav-fixed`) — DOMINANT
- ~70% of the file. Selectors: `.ts-nav-fixed`, `.ts-nav-fixed__links`, `.ts-nav-fixed__links.ts-nav-truncate`, `.ts-nav-more`, `.ts-nav-more.hasItems`, `.ts-nav-dropdown`, `.ts-nav-fixed:before`, `.ts-nav-fixed.spaced`, `.ts-nav-fixed.ts-nav--spaced`, `.ts-nav-fixed.ts-nav--icon-only`, `.ts-nav-fixed:has(.ts-nav-fixed__links.ts-icon-only-nav) …` (L675–679), `.ts-nav-fixed:has(button.ts-menu-burger.active) …` (L2216, L2223 — burger-open sibling collapse).
- `.ts-nav-fixed { .ts-ui-select { .ts-ui-select__trigger { … } } }` nested at L2525–2544 — the OWNER FIX & REFACTOR NOTES (L2499) cascade pattern.
- `--ts-nav-items-spacing` modal-mode override (L505–511).

### COMPONENT D — mobile-menu (`.ts-mobile-menu`, `.ts-mobile-menu-items`)
- Selectors: `.ts-mobile-menu`, `.ts-mobile-menu-items > *`, `.ts-mobile-menu-items a`, breakpoint `@media (max-width: 868px)` at L1964 + `@media (max-width: 420px)` at L2232.
- The L1967 embedded REFACTOR NOTE confesses the mobile↔desktop transition is "heavily patched."

### COMPONENT E — sidebar-nav (`.ts-sidebar-menu`, `aside.ts-sidebar-menu.ts-ui-panel`, `.ts-sidenav`, `.ts-sidenav__btn-row`)
- L2253–2496. **The grid-template `body:has(aside.ts-sidebar-menu…)` rule at L2253** sets `grid-template-columns: var(--ts-sidebar-nav-w) 1fr` on `body` — pushes content rather than overlaying. Uses CSS Nesting throughout (`& :hover`, `& .ts-ui-select`, `& .ts-ui-select__option`).
- `--ts-sidebar-nav-w: 200px`, `--ts-grid-bg-pattern`, `--ts-grid-line-color` declared HERE (sidebar-nav uniquely owns the background-grid texture).
- This component pushes content into a grid layout — explicitly the "must-have alternative layout" called out in the L1 §6 wishlist.

### COMPONENT F — header-menu / burger (`.ts-menu-burger`, `.theme-toggle`)
- L1700–1820 (burger lines + active/inactive transforms).
- Token cartel: `--ts-burger-line-h: 2px`, `--ts-burger-line-distance: calc(--ts-burger-line-h * 4)`, `--ts-burger-line-dist-offset` derived. Burger-active state at L1783 transforms inner lines into an "X".
- The `.ts-nav-fixed:has(.ts-menu-burger.active)` cascade at L1953–1961 + L2216–2229 hides everything else when burger opens.

### COMPONENT G — floating UI helpers (NOT a nav)
- `#ts-top-btn`, `.ts-back_top-nav` (scroll-to-top), `.ts-fixed-btn`. L1803–1949 + L2008–2069.
- Tightly bound to nav layout. Owner annotations explicitly state these "have been required multiple patches and workarounds (marked as #CRAZY_FIX_RULES across the stylesheet)."

### Shared tokens vs component-private (headermenu)
- **Shared (declared in COMPONENT A's token cartel L19–219)** — `--ts-navlink-color`/`-hover`/`-active`, `--ts-navlink-fs`, `--ts-navlink-gap`, `--ts-navlink-pad-x`/`-y`/`-x-mult`/`-y-mult`, `--ts-navlink-mult-{lg,md,sm,xs}`, `--ts-navlink-bg`/`-bg-hover`/`-bg-active`, `--ts-navlink-btn-max-h`, `--ts-navlink-select-min-w`/`-max-w`/`-width`, `--ts-header-bg`/`-border`/`-blur`/`-bg-alpha`/`-border-alpha`/`-logo-w`/`-logo-h`/`-logo-pad`/`-logo-fs`/`-logo-color`/`-logo-subtext-color`/`-logo-fs-adjust`/`-ui-rad`/`-btn-rad`, `--ts-burger-*` family, `--ts-menu-burger-*` family, `--ts-shadow-bold*`, `--ts-fs-base: 0.68rem`/`-fs`/`-fs-xs` recomputed-at-nav-scope, `--ts-btn-h: var(--ts-nav-btn-h)`, `--ts-icon: calc(--ts-navlink-fs * 1.2)`.
- **Component-C-private (fixed-nav)** — `--ts-header-border-alpha: 22%/32%/60%/65%` per-state, `--ts-nav-items-spacing`, `--ts-navlink-fs-text-icon: var(--ts-icon-only-fs)`, `--ts-input-fs: calc(--ts-navlink-fs * 1)`.
- **Component-E-private (sidebar)** — `--ts-sidebar-nav-w`, `--ts-grid-line-color`, `--ts-grid-line-mix`, `--ts-grid-bg-pattern`, `--ts-grid-s`, `--base-size: 100dvw` (note no `--ts-` prefix — namespace violation).
- **Component-G-private (floating buttons)** — `--ts--btn-fixed-offset` (DOUBLE-DASH prefix — namespace violation pattern), `--ts--debug-root-offset-y` (same).

### Notable headermenu structural facts
- 3 `@media` queries: `min-width: 867px` (L1821), `max-width: 868px` (L1964), `max-width: 420px` (L2232). The 867↔868 hairline split is intentional — strict-less-than vs strict-greater-than to avoid double-application at exact boundary.
- 4 occurrences of `:has(button.ts-menu-burger.active)` — burger-active cascades affect sibling nav links, parent `.ts-nav-fixed`, and `html` (sticky z-index bump).
- 16 owner-annotated REFACTOR / CRAZY_FIX / OWNER FIX blocks (see annotation index below).
- ONLY ONE hex literal in the entire 86KB file (L369 `rgba(0, 0, 0, 0.1)` in a shadow). Excellent OKLCH compliance.

---

## Per-file catalog (essentials)

### ts-masonry+layout-priitives.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/ts-masonry+layout-priitives.css`  ·  **Lines:** 642  ·  **Bytes:** 19,119
- **Filename typo:** `priitives` (missing `m`) — owner has not corrected; preserve until rename pass.
- **Block type:** layout engine "Integration v5" header (L3–13) — `.ts-masonry` flexbox masonry with container queries + `.ts-stack`/`.ts-cluster`/`.ts-grid--auto`/`.ts-sidebar`/`.ts-split`/`.ts-frame`/`.ts-center` primitives.
- **Tokens declared:** see grep. Highlights — `--ts-masonry-cols-target: 5` (L46), `--ts-masonry-col-min: 10rem` (L47), `--ts-masonry-row-h: 7.5rem` (L49), `--_ts-basis-{5,4,3,2,1}` private grid-track formulae (L51–55), `--ts-masonry-tall-multiplier: 2`, `--ts-masonry-hover-{scale,duration,ease}` (L31–33), `--ts-masonry-image-{aspect,radius,bg,border}` (L24–27). Nested override `.ts-masonry-item .ts-marquee.fullwidth.ts-marquee-container` sets `--ts-masonry-row-h: var(--ts-flip-card-h) !important`.
- **`--ts-bg-N` direct references:** L26 (`--ts-masonry-image-bg: var(--ts-bg-1)`), L619 (`.ts-masonry .ts-marquee-container { background: var(--ts-bg-1) }`). **2 direct references.**
- **Selectors of interest:** `:root .ts-masonry:not(.ts-portfolio-grid, :has(.ts-marquee))` (substring-distribution-adjacent, L22–23 — R-cascade concern); `.ts-masonry:not(:has(.ts-marquee))` (L45 — variant excludes marquee contexts); `.ts-masonry > *` (L67 — universal child sizing); `.ts-masonry:has(> :only-child) > *` (L92 — single-child fallback).
- **At-rules:** 3× `@container ts-masonry` queries (L74, L80, L86) + 7× `@media` queries (L381–609).
- **Owner annotation VERBATIM (L372–375 — the load-bearing one):** `/*THIS ARE  HARDFIXES   CODE  PATCHES THAT ARE KEOPT TO KEEP THE LAYOUT  STABLE ON THE SHOWCASE BLOCK FOR THE MARQUEE GRID, BECASUE THE NEW REFACTORED MASONRY DOENST HAS SUPPORT FOR THAT   IRRATIONAL BUILT LAYOUT. SO ONCE REFACTORED, REBUILD THE MARQUEE  DISPLAY LAYOUT.  THIS CODE IS ONLY TEMPORARY.*/` — explicitly marks L381–511 (six media queries + grid-template overrides for `.ts-section:has(.ts-marquee) .ts-masonry`) as TEMPORARY HARDFIXES to be deleted once the marquee layout is rebuilt.
- **Refactor flags:** (a) the `.ts-masonry--grid` variant is reserved but not implemented — L7 promises it, L366–367 comments it out as `TBD`; (b) the file mixes display:flex (L58, L444) and display:grid (L503, L510) within the same `.ts-masonry` selector tree — switches between layout engines based on context, fragile; (c) L51–55 `--_ts-basis-N` formulae assume 5 columns at root then container queries cascade DOWN; the formulae `(100% - N*gap)/N - 1px` have hardcoded `- 1px` for fractional-pixel rounding (undocumented why); (d) container queries are used correctly (L63 `container-type: inline-size; container-name: ts-masonry`); (e) **`.ts-masonry--grid` was the v5 promised migration target** — not delivered.
- **Session 3/4 relationship:** masonry layout is self-contained. The L372 owner annotation is a HARD GATE — temporary hardfixes must be REMOVED in the rebuild, not migrated. The layout primitives (L515+ `.ts-stack`/`.ts-cluster`/etc.) are atomic and should map cleanly to the rebuild's layout-utility block.
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-masonry*` is in catalog §4.10 layout. (b) NEW: the `.ts-section:has(.ts-marquee)` hardfix block is undocumented; the L372 owner annotation marks it as deletable. The `--ts-masonry-grid` reservation is undocumented. (c) No contradictions.

---

### footer-component.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/footer-component.css`  ·  **Lines:** 861  ·  **Bytes:** 19,584
- **Block type:** Layout block — `footer.ts-footer` + 5 widget families.
- **Tokens declared:** L214 `--ts-navlink-color: var(--ts-navlink-color-hover)`, L253 `--ts-this-bg: var(--ts-bg-1-t)`, L267–278 the full input cartel re-declared for footer-scoped inputs (`--ts-input-color`/`-hover`/`-focus`, `--ts-input-bg`/`-hover`/`-focus`, `--ts-input-border`/`-hover`/`-focus`), L280 `--ts-input-radius: var(--ts-btn-radius)`, L660–662 light-theme footer-dark variant (`--ts-text-primary: white`, `--ts-text-secondary: #6f6f6f`, `--ts-bg-2: #ffffff14`), L772–774 dark-variant `--ts-border-1: var(--ts-text-muted-dim)`, `--ts-border-0: rgba(255,255,255,0.05)`, `--ts-btn-h: 50px`. L830–831 `--ts-this-bg: var(--ts-text-muted-dim); --ts-bg-1: var(--ts-this-bg-dim-4)` — **the file REDEFINES `--ts-bg-1` as a derivative of the surface chain. Architectural inversion.**
- **`--ts-bg-N` direct references:** L13, L253, L278, L294, L371, L417, L434, L451, L463, L468, L473, L479, L492, L508, L569, L650, L662 (declares `--ts-bg-2`), L831 (declares `--ts-bg-1`). **17 direct references including 2 REDECLARATIONS of `--ts-bg-N` primitives at component scope** — the worst Rule 15 / R-rule-15 violator in chunk 4b.
- **Selectors of interest:** `footer.ts-footer`, `footer.ts-footer .ts-container`, `.ts-footer-row`/`-column`/`-columns`/`-widget`/`-socket`/`-socket-row`/`-copyright`/`-widget-title`, `.ts-newsletter-input`/`-input-group`/`-btn`/`-desc`, `.ts-social-links`/`-link`, `.ts-portfolio-grid`, `.ts-split-feature__content .ts-feat-list`, `[data-theme="light"] footer.ts-footer.ts-footer--dark` (L654 — paradox: light THEME, dark VARIANT, forced-dark resolution).
- **Keyframes:** none.  **At-rules:** `@media (max-width: 768px)` at L691.
- **Hardcoded literals:** L657 `#08090c`, L658 `rgb(255 255 255 / 8%)`, L659 `#f2f3f7`, L660 `white`, L661 `#6f6f6f`, L662 `#ffffff14`, L769 `#08090c`, L771 `#f2f3f7`, L773 `rgba(255, 255, 255, 0.05)`, L790 `#f2f3f78a`, L857 `#f2f3f7`. The `--ts-footer-dark, #08090c` fallback (L657) and `--ts-footer-dark-border` are exposed as overridable tokens but with hex literal fallbacks.
- **Owner annotations:** none explicit (no `REFACTOR NOTE`/`CRAZY_FIX`/`OWNER FIX` markers). Block is mostly silent — telling, because the architecture is bad (L13 raw `--ts-bg-0`, L831 `--ts-bg-1` REDEFINITION) and lacks the embedded refactor docs that other large files have.
- **Refactor flags:** (a) `footer.ts-footer.ts-footer--dark` declared THREE times (L654–663, L768–775, L814–818) — fragments rather than one consolidated rule; (b) L831 REDEFINES `--ts-bg-1` as a derivative — breaks the primitive→system→component contract violently (a component reaches back into the primitive layer and overwrites it for descendants); (c) responsive collapse `@media (max-width: 768px)` declares `padding-block: var(--ts-sp-13)` then immediately L752 declares `padding-block: var(--ts-sp-11)` for the SAME selector — second wins, first is dead code; (d) hardcoded `#08090c` deep-dark `--ts-footer-dark` is exactly the kind of "always-dark-regardless-of-theme" surface that should be tokenized via `--ts-surface-strong`/`--ts-surface-inverted` (same gap flagged on tooltips in chunk 4a); (e) L13 `background: var(--ts-bg-0)` and L650 `.ts-footer-socket { background-color: var(--ts-bg-0) }` are the most surface-y of the violations.
- **Session 3/4 relationship:** Footer must be torn down and rebuilt entirely on the `--ts-this-bg` derivative chain. The `--ts-bg-1` redeclaration at L831 is the highest-priority repair in chunk 4b — it's a back-pollution that breaks the surface-superposition contract.
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-footer*` family in catalog §4.10. (b) NEW: the L831 primitive REDEFINITION at component scope is not in the catalog and is the worst Rule 15 violation we've seen in chunk 4b. The triple-declaration of `.ts-footer--dark` is undocumented. (c) No contradictions.

---

### ts-checkbox-radio.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/ts-checkbox-radio.css`  ·  **Lines:** 803  ·  **Bytes:** 24,227
- **Block type:** dedupe-target. L1 owner header `/* ── !!!!! @ts-inputs-refactor-dedupe #START_DEDUPE Checkbox / Radio /INPUTS ─ */` confirms this block was MOVED from elsewhere in the master sheet (`~line 6500`) and the markers `#START_DEDUPE`/`#END_DEDUPE` + tag `@ts-inputs-refactor-dedupe` are owner-instituted bookmarks for the merge.
- **Tokens declared:** see grep. Notable: `--ts-checkbox-size: 1rem`/`1.125rem`/`1.375rem`/`1.625rem` (sm→md→lg→xl ladder at L58/63/250/270/276), `--ts-checkbox-mark-inset` matching ladder (22→22→26→28%), `--ts-radio-group-item-py/-px/-compact-padding` (L345–347), parallel `--ts-ui-control-*` family (L408–414, L597–624) and parallel `--ts-ui-radio-group-*` family (L692–694) — exactly the duplication the file flags as `#START_DEDUPE`. Light-theme `--ts-accent-border: color-mix(in srgb, var(--ts-accent), var(--ts-text-primary) 18%)` (L142) + dark-theme `… 22%` (L189) — mixing constants ARE hand-tuned per theme. **R-rule-15 violation against the apcach mixing-constant principle** (Resolution #1 — engine-derived only).
- **`--ts-bg-N` direct references:** L94, L100, L101 (`--ts-this-bg: var(--ts-bg-3)`), L129, L158, L191, L224, L321, L331, L366, L450, L470, L490, L526, L546, L580, L586, L668, L678, L713, L750, L763, L776, L788, L789, L790, L795, L803. **28 direct references** — highest count in chunk 4b after the inputs file. Also embeds three `#ffffff` and `#000000` and `#1a1a1a` literals (L499, L524, L788, L790, L803).
- **Selectors of interest:** `.ts-checkbox-row input[type="checkbox"]/[type="radio"]`, `.ts-control--checkbox input`/`.ts-control--radio input`, `.ts-checkbox`, `.ts-field-group`, `.ts-table--bulk`, `.ts-radio-group`/`__item`, parallel `.ts-ui-control--checkbox`/`--radio`, `.ts-ui-radio-group`/`__item`.
- **Keyframes:** none. **At-rules:** none.
- **Hardcoded literals:** L499 `#ffffff` in `color-mix(…)`, L524 `#ffffff`, L788 `#ffffff`, L789 hardcoded `var(--ts-border-strong)` (referencing a token that may not exist), L790 `#000000`, L803 `#1a1a1a`. All inside light-theme variants — the light-theme path is hardcoded, dark-theme path is token-derived. **Asymmetric Rule 15 violation: light-mode hardcoded, dark-mode tokenized.**
- **Owner annotations VERBATIM:** L1 `/* ── !!!!! @ts-inputs-refactor-dedupe #START_DEDUPE Checkbox / Radio /INPUTS ─ */`; L3–25 the full REFACTOR NOTES (Task: merge migrated block with redefined-with-updated-rules block; Constraints: use `#START_DEDUPE`/`#END_DEDUPE` markers; Refactor requirements: tokenize, eliminate redundant declarations, ensure variant parity; Goal: clean, deduplicated, token-driven implementation); L766–769 the standard `@refactor:backdrop-critical` / `@refactor:glass-dependent` / `@refactor:needs-solid-fallback` / `@refactor:token-dependency` tag stack (only one instance — light-theme bulk-bar context).
- **Refactor flags:** (a) `.ts-checkbox` and `.ts-ui-control--checkbox` are duplicate families — must be unified; (b) the `--ts-checkbox-*` and `--ts-ui-control-*` token ladders carry identical values — clearly mid-migration; (c) light-theme rules at L788–803 use hardcoded hex which DEFEATS the apcach engine — light-theme inversion should re-run the same math, not declare different colors; (d) `accent-color: var(--ts-accent)` at L38 — native browser accent on `<input>` element, can't be tokenized further; (e) `border-radius: var(--ts-radius-xss, 3px) !important` at L72 — `--ts-radius-xss` token doesn't exist in canonical ladder (4/6/8/10/16), likely meant `--ts-radius-xs`.
- **Session 3/4 relationship:** This file is the canonical TEST CASE for the `@ts-inputs-refactor-dedupe` workflow. Successfully consolidating it = the rebuild's dedupe pattern works. The asymmetric light/dark hex problem is a Tier-1 apcach-engine concern.
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-checkbox*`/`.ts-control--*`/`.ts-ui-control--*` in catalog §4.10. (b) NEW: the asymmetric light-mode-hardcoded-vs-dark-mode-tokenized split is undocumented; the `--ts-radius-xss` invalid token reference is undocumented; the missing `#END_DEDUPE` marker (search returns no result) means the dedupe window was never closed — file boundary IS the implicit close. (c) No contradictions.

---

### ts-patterns.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/ts-patterns.css`  ·  **Lines:** 515  ·  **Bytes:** 25,367
- **Block type:** Imported third-party asset adapted to Toolskin namespace. L3 marker `/* ═══ MERGED BLOCK: ts-patterns.css (source: assets/css/ts-patterns.css) ═══ */`. Provenance L9: "Generated from MagicPattern · Adapted for Toolskin tokens." Documents usage at top (L12–48) with size modifiers (`--xs`/`--sm`/default/`--lg`/`--xl`/`--2xl`), opacity modifiers (`--subtle`/`--faint`/default/`--medium`/`--strong`), inline custom-property overrides, and an explicit "NON-ANIMATABLE PATTERNS" list (`-zigzag`, `-checkerboard`, `-diagonal-stripes`, `-dots-dense`).
- **Tokens declared:** `--ts-pattern-scale` per modifier (L88/92/96/100/104), `--ts-pattern-line-perc: 80%` (L280), `--ts-cross-size`/`-angle`/`-factor`/`-factor-neg`/`-w`/`-bg-perc`/`-color-perc`/`-gutter` (L322–346, the cross-pattern token family), `--ts-wtf-size`/`-angle` (L376–377, the "wtf" pattern), `--ts-pattern-animation-duration: var(--ts-pattern-anim-duration, 30s)` (L469). Also declares NON-PREFIXED tokens (`--pattern-scale`, `--pattern-color`, `--pattern-color-alpha`, `--pattern-bg`) — **namespace violation, multiple instances at L68, L71–73, L326, L342, L378.**
- **`--ts-bg-N` direct references:** L326, L342, L378 — `--pattern-bg: var(--ts-bg-0)` (in three pattern variants). **3 direct references.**
- **Selectors of interest:** `[class*="ts-pattern-"]` (L54 — substring-distribution selector, R-cascade flag), `[class*="ts-pattern-"]::before`, `.ts-pattern--{xs,sm,lg,xl,2xl}` size, `.ts-pattern--{subtle,faint,medium,strong}` opacity, plus the actual pattern classes (`.ts-pattern-dots`, `.ts-pattern-grid`, `.ts-pattern-cross`, `.ts-pattern-wtf`, `.ts-pattern-zigzag`, `.ts-pattern-checkerboard`, `.ts-pattern-diagonal-stripes`, `.ts-pattern-dots-dense`, etc.).
- **Keyframes:** `ts-pattern-drift` (L428), `ts-pattern-drift-reverse` (L438), `ts-pattern-drift-horizontal` (L448), `ts-pattern-drift-vertical` (L458). **At-rules:** `@media (max-width: 768px)` at L502.
- **Hardcoded literals:** L39 `#00e5ff` in docstring example (NOT real code); L71 `var(--ts-accent, #ff540a)` fallback (Rule 15 — should not have a hex fallback for accent).
- **Owner annotations:** none beyond the L5–48 docstring; the file is largely self-explanatory.
- **Refactor flags:** (a) `[class*="ts-pattern-"]` is a substring-distribution selector — R-cascade pattern (Rule 8) — REWRITE to explicit `:is(.ts-pattern-dots, .ts-pattern-grid, …)` enumeration; (b) the L68/L71/L73 non-`--ts-` namespace tokens (`--pattern-scale`, `--pattern-color`, `--pattern-color-alpha`) are scoped inside `::before` but breach the namespace contract — either prefix to `--ts-pattern-*` or document as deliberate "private" namespace; (c) L88 `--ts-pattern-scale: max(1, 0.5)` is a NO-OP — `max(1, 0.5) === 1`, the modifier does nothing; same for L92 (`max(1, 0.75)`) — the L67 comment "enforce minimum of 1 to prevent breaking" applies the floor in the consumer instead, making these modifier declarations dead; (d) the "NON-ANIMATABLE PATTERNS" list at L43–48 is documentation-only — no enforcement; (e) L72–73 `--pattern-color-alpha: var(--ts-pattern-color-alpha, color-mix(in srgb, var(--pattern-color) 50%, transparent))` uses a default that consumes itself (recursive-ish via `var(--pattern-color)` which is `var(--ts-pattern-color, var(--ts-accent, #ff540a))`); valid but fragile.
- **Session 3/4 relationship:** Pattern system is self-contained. The substring-distribution rewrite to `:is(...)` is the major Session 4 task. Move the `--pattern-*` private tokens under `--ts-pattern-*` namespace. Keyframes can ship as-is.
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-pattern-*` family in catalog §4.10. (b) NEW: the four drift keyframes and the explicit non-animatable list are not in catalog; the `max(1, X)` no-op modifiers are undocumented; the MagicPattern provenance is not in catalog. (c) No contradictions.

---

### iconlist+featlist-allvariants-component.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/iconlist+featlist-allvariants-component.css`  ·  **Lines:** 671  ·  **Bytes:** 26,242
- **Block type:** **CANONICAL THREE-TIER COMPONENT REBUILD (§6c v2).** L1–39 lays out a token-driven LAYER-1/LAYER-2 architecture in explicit prose: LAYER 1 = component-scoped root declares tokens once inside `:root .ts-list, :root .ts-list *, :root .ts-feat-list, :root .ts-feat-list *`; LAYER 2 = element rules consume tokens, variants override TOKENS only. Includes clamp icon engine, derivative-spacing chain (`--ts-feat-pad-base` → 4 derivative tokens), surface model via `--ts-this-bg` derivatives, auto-fit grid w/ no media queries. **This is the model for the rebuild.**
- **Tokens declared:** see grep — full LAYER-1 token surface at L56–158. Notable: icon ladder `--ts-feat-mult-xs/sm/md/lg/xl` (L63–71, values 0.35/0.8/0.9/1.10/1.25), `--ts-feat-icon-size: clamp(min, base*mult, max)` (L78–80), `--ts-feat-pad-base` derivative chain (L85–89), grid auto-fit `--ts-feat-col-min: 200px`, typography `--ts-feat-fs-base`/`-fs-scale`/`-fs`/`-title-fs`/`-title-weight: 600`/`-line-height`, surface `--ts-feat-surface`/`-bg`/`-bg-color`/`-bg-grad`/`-bg-grad-hover`/`-border`, color `--ts-feat-icon-color: var(--ts-accent)`/`-text`/`-title-color`, hover `--ts-feat-bg-hover`/`-border-hover`, accent-tint hover `--ts-feat-bg-hover-accent`/`-border-hover-accent`/`-icon-hover-accent`/`-text-hover-accent`, transition `--ts-feat-transition`. **Most importantly L139–158: REDECLARES `--ts-this-bg-border` and `--ts-this-bg-border-hover` using a custom `color-mix` recipe with `--ts-mix-perc` parameter (10% default, 7% in light theme variant) + `--ts-this-bg-grad-bright-pct: 6%`/`-dark-pct: 7%`.** This is THE custom-derivative-recipe specimen.
- **`--ts-bg-N` direct references:** L109 only — `--ts-feat-surface: var(--ts-this-bg-surface, var(--ts-bg-2))`. **1 direct reference, and it's a FALLBACK only.** Cleanest Rule 15 compliance in chunk 4b.
- **Selectors of interest:** `:root .ts-list, :root .ts-list *, :root .ts-feat-list, :root .ts-feat-list *, :root .ts-list *:after, :root .ts-feat-list *:before` (L47–52 — explicit substring-style enumeration limited to two component families, less bad than wildcard substring; still R-cascade-adjacent), `.ts-feat-list`, `.ts-feat-item`, `.ts-feat-icon`, `.ts-feat-item__title`, `.ts-list` BEM, `.ts-feat-list.ts-feat-cards` variant, `.ts-feat-list.hover-accent` variant, `.ts-feat-list.ts-feat-list--lg/--sm/--xl` size variants.
- **Keyframes:** none. **At-rules:** none.
- **Owner annotations VERBATIM (selected):** L2–39 the LAYER-1/LAYER-2 architecture brief (full quoted above); L169–215 `OWNER NOTES: GENERIC LIST VARIANT` (`<ul>` + `::before` icon variant explanation); L217–251 `REFACTOR NOTE: @ts-list-refactor` (cross-referenced tag); L254–262 `OWNER FIX NOTES: LIST ITEM CONTENT ISOLATION`; L262 `REFACTOR NOTE:`; L362 `OWNER NOTES: content box is neccesary here so the icon sizes properly with the padding nad the icon size without shrinking. keep it.`; L395 `OWNER NOTE:`; L437 `OWNER NOTE: deprecated`; L515 `OWNER REFACTOR FIX:`; L602 `OWNER NOTE. check what i did with the background  styling. i separated backgroudn color from image becuse i need to separat those properties in roder to be able to set the gradient styling from the rest of the default styling.`; L609 `REFACTOR NOTE: GLOBAL BACKGROUND IMAGE SYSTEM`.
- **Refactor flags:** (a) the LAYER-1 token block AT L47–159 contains **DOUBLE-DECLARED `--ts-feat-bg-hover` / `-border-hover` / `-bg-hover-accent` / `-border-hover-accent` / `-icon-hover-accent` / `-text-hover-accent` / `-transition` / `--ts-this-bg-border` / `--ts-mix-perc` / `--ts-this-bg-grad-bright-pct` / `--ts-this-bg-grad-dark-pct`** (L122–137 first, L144–157 second, with DIFFERENT values: hover-accent goes from `--ts-accent-bright`/`-border` to `--ts-accent-dim`/`-border`, mix-perc goes 10%→7%). Second wins — first declaration is dead code or evolution-in-progress; (b) the L47 `:root .ts-list, :root .ts-list *, …` distribution still pollutes the cascade (every descendant gets the token surface) — explicit `:is(.ts-list, .ts-feat-list) *` enumeration would be marginally cleaner; (c) variant overrides at L411–665 set `--ts-feat-icon-mult` and `--ts-feat-bg`/`-border` — correct LAYER-2 pattern; (d) `.ts-feat-list.hover-accent` (L642) sets `--ts-this-bg: var(--ts-accent-dim-2)` and propagates — exact surface-superposition contract; (e) the `--ts-feat-pad-base → -icon-pad → -icon-gap → -item-pad → -item-gap` chain (L85–89) is the canonical derivative-spacing pattern; (f) the deprecated variant at L437 (`OWNER NOTE: deprecated`) is still in the file — should be deleted.
- **Session 3/4 relationship:** **THIS IS THE TEMPLATE for every Session 4 component.** The LAYER-1/LAYER-2 architecture comment at L1–39 should be lifted verbatim into the `design-tokens-2.0` skill as the canonical example. The clamp-icon ladder + multiplier-override pattern (L63–80) is reusable. The `--ts-feat-pad-base` derivative chain is reusable. The `:root .ts-X, :root .ts-X *` scoped-distribution pattern (limited to the two component families) is the SOFTER alternative to wildcard substring — worth documenting as the rebuild's "scoped distribution" pattern when explicit `:is(...)` enumeration is impractical.
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-feat-list*`/`.ts-list*` in catalog §4.10. (b) NEW: the LAYER-1/LAYER-2 architecture brief is the most important undocumented design intelligence in chunk 4b; the double-declared LAYER-1 token block is undocumented; the custom `--ts-this-bg-border` recipe via `--ts-mix-perc` is a NEW derivative pattern not in `surfaces.css`. (c) No contradictions.

---

### ts-panel+root-debugger-component.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/ts-panel+root-debugger-component.css`  ·  **Lines:** 1,091  ·  **Bytes:** 32,380
- **Block type:** Compound (panel + debugger + scoped select). See "Special case" section above for the split.
- **Tokens declared:** see grep. Panel scope (L9–22): `--ts-this-bg: var(--ts-bg-1)`, `--ts-panel-bg: var(--ts-this-bg)`, `--ts-panel-border: var(--ts-this-bg-border-hover)`. Nest-reduction (L75–90): `--ts-nest-radius: calc(var(--ts-card-radius) - (N * var(--ts-radius-nest-reduction)))`, `--ts-nest-pad: calc(var(--ts-card-pad, var(--ts-panel-pad)) - (N * var(--ts-pd-nest-reduction)))` for N=1 (single-nested) and N=2 (double-nested). `--ts-sb-size: 8px` scrollbar. Floating-panel variant at L159+. Debug-root scope (L301–500): `--ts--debug-root-offset-y: calc(var(--ts--btn-fixed-offset) + var(--ts-sp-2) + var(--ts-btn-h, 45px))`, `--ts--btn-fixed-offset: var(--ts-sp-5)`, btn-swatch privates `--_btn-swatch: #111214` (HARDCODED HEX), `--_btn-bg`, `--_btn-bg-grad`, `--_btn-bg-grad-hover`, `--_btn-border`, `--_btn-border-hover`, `--_btn-border-active`. Scoped select (L377–408): `--ts-ui-select-dd-min: 200px`, `--ts-ui-select-dd-runway: 15dvh`, `--ts-ui-select-dd-max-abs: 15dvh`, `--ts-ui-select-dd-max-rel: 10dvh`, `--ts-ui-select-dd-max-h: clamp(...)`, `--ts-shadow-accent: inset 0 0 0px 1px var(--ts-accent-border), 0 4px 15px color-mix(in srgb, var(--ts-accent-border-hover), transparent 79%)`, `--ts-select-item-bg`/`-hover`/`-active` derivative quartet, `--ts-input-border`/`-active` pair, `--ts-root-btn-h: calc(var(--ts-btn-h, 45px)*.65)`.
- **`--ts-bg-N` direct references:** L9, L398, L425, L468, L594 (`var(--ts-bg-1, #1a1b1e)`), L695, L879. **7 direct references including 1 hex fallback (`#1a1b1e`).** Also L102, L962 use `--ts-bg-4` inside `color-mix`.
- **At-rules:** `@property --ts-nest-radius` and `@property --ts-nest-pad` (L48, L55 — and DUPLICATED at L916, L923 because the file has the entire panel block declared twice).
- **Selectors of interest:** `.ts-panel, .ts-ui-panel` (L6–7, L877), nested `.ts-card .ts-card`/`.ts-panel .ts-panel`/cross combinations (L68–88, L936–951 — DUPLICATED), `.ts-panel__header`/`__title`/`__title strong`/`__header-actions`/`__body`/`__row`/`__group`/`__status`/`__status-item`/`__status-item i` BEM family, `.ts-panel--collapsed`/`--docked`/`--float`, `.ts-ui-panel.ts-ui-panel--collapsed`/`__header`/`__body`/`__status` parallel alias family, `#ts-debug-root` + `#ts-debug-root > .ts-btn` (L301–349, the dev-only widget), `#ts-debug-root [data-ts-panel]` (L363–500). **Critically:** `#ts-debug-root .ts-btn:hover/:focus` uses CSS Nesting (L339, the `&:hover,&:focus { … }` pattern — modern syntax).
- **Owner annotations VERBATIM:** L25–43 `§6d NEST-REDUCTION SYSTEM (NEW-B16)` explainer block; L282–299 `@refactor_note @owner_alias_addition / @ts-panel--refactor-plan / @ts-panel-expansion / @component-consolidation / # CLARIFICATION / # INTENT` — the panel/debugger unification plan; multiple `§6c PANELS` headers (L3, L874 — duplicated); `§6d` repeat. L1013 commented-out scrollbar `scrollbar-color: var(--ts-bg-5) transparent;*/` — legacy `--ts-bg-5` reference, dead.
- **Refactor flags:** (a) **ENTIRE PANEL BLOCK IS DUPLICATED** L6–280 ≈ L874–1091. Pure dead code in the second half — fixed by collapsing to one. The `@property` decls at L48/L55 are similarly duplicated at L916/L923; (b) `#ts-debug-root` is DEV-ONLY and should not ship in the production bundle; (c) the `.ts-ui-select` re-styling at L594–855 belongs in the select file, not the panel file; (d) `--_btn-swatch: #111214` (L315) — hardcoded debugger swatch, Rule 15 violation; (e) `--ts-this-bg-2-t: color-mix(in srgb, var(--ts-this-bg), transparent 12%)` (L596) — invents a new `-2-t` derivative variant at component scope rather than consuming the system layer; (f) `--ts--btn-fixed-offset` and `--ts--debug-root-offset-y` use the double-dash prefix anti-pattern; (g) the `revert-layer` use at L355 (`box-shadow: revert-layer`) and nested `&:hover,&:focus` syntax are the modern features in play.
- **Session 3/4 relationship:** The panel system is the proving ground for the §6d NEST-REDUCTION SYSTEM. Once the duplicate halves are merged and the debugger lifted to a separate dev-only file, what remains is a clean two-tier (panel base + nested-panel/nested-card variants) consumer of the surface chain. The `--ts-nest-radius`/`-pad` calc system is novel and should be documented in design-tokens-2.0 as the canonical pattern for visually-distinguishing nested instances of the same component.
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-panel*`/`.ts-ui-panel*`/`#ts-debug-root` in catalog §4.10. (b) NEW: the bit-identical duplication of the entire panel block is undocumented; the dev-only debugger lacks an explicit production-bundle exclusion; the `--_btn-swatch: #111214` hex literal is not in catalog; the `--ts-this-bg-2-t` invented derivative is not in catalog. (c) No contradictions.

---

### inputs-global-nested-design-pattern.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/inputs-global-nested-design-pattern.css`  ·  **Lines:** 1,493  ·  **Bytes:** 38,203
- **Block type:** **THE CANONICAL "NESTED DESIGN PATTERN" REFERENCE (Rule 4).** See "Special case" section above. Multi-component blob: §6e inputs + §6f range slider + §6f.1 advanced range + §6g chips/tags + §6h tabs + §6i badges/status + §6j navigation + §6k modal/overlay + §6l tables stub.
- **Tokens declared:** see grep (massive). Private `--_input-*` quartet (L108–114), public `--ts-input-*` token surface, surface re-anchoring `--ts-this-bg: var(--ts-input-bg)` (L147, L170, L180, L185, L194, L204, L339, L352, L380, L383), range slider full token surface (L500–518), chips/tags scoped surface (L685–688), badges (L1025–1027), modal token surface L1239–1256 (`--ts-modal-surface`, `-surface-2`, `-surface-3`, `-bg`, `-border`, `-gap`, `-pad`, `-radius`, `-header-btn-h`, `-header-h: 40px`, `-header-fs: var(--ts-fs-h6)`), tab-pane (L893–894, L930–931).
- **`--ts-bg-N` direct references:** L130 (commented), L284, L335, L337 (commented), L350, L382 (commented), L383, L574 (commented), L678, L694, L838, L877, L881, L893, L894, L922 (commented), L930, L931, L949, L966, L985, L1203, L1239, L1240, L1241, L1266, L1286, L1298, L1468, L1491. **23 LIVE direct references + 6 commented-out** — second-highest after checkbox-radio.
- **Selectors of interest:** see grep. The §6g chips block at L660–780 is the cleanest specimen of token-driven variant routing. The §6k modal block at L1233–1340 uses scoped surfaces `--ts-modal-surface`/`-2`/`-3` derived from `--ts-bg-0`/`-1`/`-1-t`. Tab-pane variants at L893–966 show explicit `--ts-tab-pane-foreground-color`/`-background-color` per state.
- **Keyframes:** `ts-pulse` (L1139), `ts-pulse-2` (L1153), `ts-modal-in` (L1432). **At-rules:** `@property --ts-range-val` (L481 — registered for the gradient-fill % calc).
- **Hardcoded literals:** L293 `#191b22` (chip variant), L732 `#000000bd` (warning on-accent), L994 `#fff !important` (text-primary override in tab-pane), L1090 `#c084fc` (purple badge), L1095 `#67e8f9` (cyan badge). All within the badges/chips families.
- **Owner annotations VERBATIM (selected):** L1–97 the FULL REFACTOR NOTES block (ARCHITECTURE REORGANIZATION 3-scope plan, TOKENIZATION LAYERS 3-layer scheme: GLOBAL→COMPONENT→VARIANT, DISPLAY/VARIANT LOGIC, REFACTOR REQUIREMENTS, GOAL) — verbatim ABOVE in special case section; §-headers `§6f RANGE SLIDER` (L432), `§6f.1 ADVANCED RANGE SLIDER` (L478), `§6g CHIPS / TAGS` (L656), `§6h TABS` (L782), `§6i BADGES & STATUS INDICATORS` (L1004), `§6j NAVIGATION` (L1177), `§6k MODAL / OVERLAY` (L1233), `§6l TABLES` (L1453); structured `@refactor:backdrop-critical / glass-dependent / needs-solid-fallback / token-dependency` tag stack at modal scope (L1271–1274, L1288–1291, L1300–1303, L1312–1326).
- **Refactor flags:** (a) the file IS the canonical nested-design pattern but ITS OWN HEADER says it must be DEDUPED (L5–8 mentions "duplicated input-related blocks currently distributed in the cascade from ~line 6500"); (b) multiple `--ts-input-bg` declarations per scope (L130 commented, L284, L335, L350 — the "first-declaration-is-intent, last-wins" antipattern repeats); (c) hardcoded badge colors at L1090/L1095 break the apcach pipeline — `--ts-this-bg: #c084fc`/`#67e8f9` are inert against theme inversion; (d) L994 `--ts-text-primary: #fff !important` inside a tab-pane is a brutal cascade override — should derive from `--ts-on-surface` instead; (e) `@property --ts-range-val { syntax: "<number>"; inherits: true; initial-value: 0 }` (L481) is **the only registered property in this file** — gradient fill calc depends on it; should be moved to a central `@property` registration file in the rebuild.
- **Session 3/4 relationship:** This file IS the source-of-truth for the rebuild's surface-superposition contract. The 4-layer protocol (private `--_x` → public `--ts-input-*` → surface re-anchor `--ts-this-bg` → variant overrides) must be lifted verbatim into the `design-tokens-2.0` skill as the canonical Rule 4 reference. The §6g chips block (L660–780) is the shortest cleanest specimen.
- **Gap vs `_code-audit-catalog.md`:** (a) inputs/range/chips/tabs/badges/modal families in catalog §4.10. (b) NEW: the explicit 3-layer TOKENIZATION LAYERS scheme at L42–58 is the foundational design intelligence the rebuild MUST adopt; the 4-layer surface re-anchor protocol is undocumented; the `@property --ts-range-val` registration pattern is novel. (c) No contradictions.

---

### ts-card-flip-swipe-interactive-component.css  (and the bit-identical `…component2.css`)

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/ts-card-flip-swipe-interactive-component.css`  ·  **Lines:** 1,392  ·  **Bytes:** 41,076
- **DUPLICATE NOTE:** `ts-card-flip-swipe-interactive-component2.css` is BIT-IDENTICAL (diff returns no output). Same line numbers, same tokens, same selectors. Treat as ONE file.
- **Block type:** Compound — §6b `.ts-card` base + §6q `.ts-flip-card` 3D + §6q.2 `.ts-swipe-card` non-3D + §6r `.ts-pricing-card` + a TEXT-SHADOW ENGINE (`--ts-shadow-*` ~20-token family at L1042–1119) + §6s `.ts-testimonial`.
- **Tokens declared:** card base (L5–13): `--ts-this-bg: var(--ts-bg-1)`, `--ts-card-bg: var(--ts-this-bg)`-equivalent, `--ts-card-pad: var(--ts-sp-8)`. `.ts-card.gradient` (L33–35): `--ts-card-bg: linear-gradient(180deg, var(--ts-bg-2) 0%, var(--ts-bg-1) 100%)`. Dashboard scope (L59–66): `--ts-dashboard-pad/-gap/-card-pad/-card-gap/-header-pad/-sidenav-pad/-body-pad/-body-gap`. Flip-card (L679–700): `--ts-flip-perspective: 1400px`, `--ts-flip-duration: 0.6s`, `--ts-flip-easing`, `--ts-flip-depth: 0px`, `--ts-flip-card-h: 320px`, `--ts-flip-card-pad/-gap`, `--ts-flip-border-w: 1px`, `--ts-flip-card-radius`, `--ts-flip-bg-front/-back/-grad/-grad-hover/-grad-back`, `--ts-flip-border/-border-hover/-bg-hover`. Swipe-card (L879–904): parallel `--ts-swipe-*` family with `--ts-swipe-card-h: 320px`, `--ts-swipe-duration: var(--ts-dur-slow, 300ms)`, `--ts-swipe-offset`, `--ts-swipe-bg-front: var(--ts-bg-2)`, `--ts-swipe-bg-back: var(--ts-bg-3)`. **TEXT-SHADOW ENGINE (L1042–1219):** `--ts-shadow-color-a`/`-b` (A/B color system), `--ts-shadow-scale-factor: 0.16`, `--ts-shadow-depth: calc(1em * scale-factor)`, `--ts-shadow-steps: 15`, `--ts-shadow-angle-x/-y: 1`, `--ts-shadow-step` derivative, `--ts-shadow-color-base` (75/25 mix of A/B), `--ts-shadow-contrast-strength: 0.23`, `--ts-shadow-color` (color-mix to black), `--ts-shadow-soft-accent`/`-soft`, the FINAL `--ts-shadow` 6-step+soft-tail composite text-shadow value, plus presets `--ts-shadow-depth-{xs,sm,md,lg,xl}` (0.02 → 0.1), `--ts-shadow-steps-{low,mid,high}` (4 → 10), `--ts-shadow-contrast-{soft,normal,strong}` (0.1 → 0.28). Then utility classes `.ts-shadow-{xs,sm,md,lg,xl}` / `-{low,mid,high}` / `-{br,bl,tr,tl}` / `-{soft,normal,strong}` / `-{accent,surface}` apply via single token override.
- **`--ts-bg-N` direct references:** L5, L34–35, L49, L92, L122, L203, L250, L327, L348, L362, L691–692, L895–896, L1243, L1252, L1349. **17 direct references** (live; +0 commented).
- **At-rules:** 3× `@property` registrations (L307 `--shadow-blur`, L313 `--shadow-offset`, L319 `--shadow-opacity` — namespace violation, should be `--ts-shadow-*`).
- **Selectors of interest:** `.ts-card`, `.ts-card.gradient`, `.ts-dashboard *`, `.ts-flip-card`, `.ts-flip-card__inner`, `.ts-flip-card__front`/`__back`, `.ts-flip-card--flipped`, `.ts-card.ts-flip-card` (variant compound), `.ts-flip-card .ts-btn`, `.ts-swipe-card`, `.ts-swipe-card__inner`/`__front`/`__back`, `.ts-swipe-card--vertical`, `.ts-swipe-card--swiped`, `.ts-swipe-card--vertical:hover .ts-swipe-card__back`, `.ts-pricing-card`, `.ts-pricing-card--featured`, `.ts-pricing-card__price`, `.ts-testimonial`, `.ts-shadow-*` utility family.
- **Owner annotations VERBATIM (selected):** §6b CARDS header L2; §6d NEW-B16 nest-radius comment L6–8; **L607–676 the §6q OWNER REFACTOR FIXES brief** — confirms the flip-card system is fully tokenized and exemplary, ships the canonical HTML structure inside the comment block; **L746–747 REFACTOR NOTE + #CRAZY_FIX_RULES on the 3D drop-shadow** — the `::before` shadow at L749+ works but needs to become a token-controlled helper class; L1030 `END OF UPDATED REFACTORED SWIPE AND FLIP CARDS TOKENIZED`; L1032 the TEXT SHADOW ENGINE banner with explicit feature checklist (✔ Token-driven, ✔ A/B color system, ✔ Font-scale aware, ✔ No invalid CSS, ✔ Safe color pipeline — no fragile `oklch(from)`).
- **Refactor flags:** (a) the entire 41KB file exists TWICE on disk; (b) `@property --shadow-blur`/`--shadow-offset`/`--shadow-opacity` (L307–325) drop the `--ts-` namespace prefix — must rename; (c) **the text-shadow engine declares its tokens at `:root` (L1042+)** — this is a COMPONENT file declaring root-level tokens, breaks the file-boundary discipline; should be lifted to `system/typography.css` or similar; (d) `--ts-flip-bg-front: var(--ts-bg-1-t)`/`--ts-flip-bg-back: var(--ts-bg-2-t)` are Rule 15 — should derive from `--ts-this-bg-dim`/`-dim-2`; (e) `.ts-card.gradient` (L20–43) declares `transition` then immediately re-declares it with `!important` at L31 — dead first declaration; (f) L36 commented-out `mask: linear-gradient(...)` and L39–42 commented-out `box-shadow: rgba(0,0,0,0.05)...` are dead but signal previous design attempts; (g) `--ts-text-muted: color-mix(in srgb, currentcolor, var(--ts-text-primary) 40%) !important` (L946, L962) overrides text-muted from within a card variant — leaks; (h) `.ts-pricing-card { --ts-card-bg: var(--ts-this-bg-grad-4) }` (L1244) — `--ts-this-bg-grad-4` may not exist (verify against surfaces.css).
- **Session 3/4 relationship:** The flip+swipe cards ARE the success case the owner cites at L613–622: *"This component has been refactored and fully tokenized. No further changes have been required in this area so far. This section demonstrates a clear, step-by-step refactoring process: Defining tokens, Applying and distributing them across the component, Minimizing CSS declarations by relying primarily on token values, Driving all states and variants through tokens instead of hardcoded rules. This serves as a reference implementation for systematic refactoring within the design system."* The text-shadow engine is similarly self-contained and proves the rebuild can do composite-token engines. Lift both as exemplars. Delete the `…component2.css` duplicate.
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-flip-card*`/`.ts-swipe-card*`/`.ts-pricing-card*`/`.ts-card*` in catalog §4.10. (b) NEW: the bit-identical second file copy is undocumented; the text-shadow engine A/B color system + utility-class composition is novel design intelligence; the @property namespace violation is undocumented; the L613–622 owner exemplar declaration is undocumented. (c) No contradictions.

---

### ts-ui-select-variants(disordered).css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/ts-ui-select-variants(disordered).css`  ·  **Lines:** 1,470  ·  **Bytes:** 44,097
- **Block type:** Dropdown/select compound — see "Special case" section. Multiple variants (icon picker, font picker, search overlay, banner-generator scope, card-half scope).
- **Tokens declared:** see grep. Dropdown scope (L68–75): same `--ts-shadow-accent`/`--ts-input-color`/`-hover`/`--ts-select-item-bg`/`-hover`/`-active`/`--ts-input-border`/`-active` quartet seen elsewhere. Icon-dd-list (L91, L98, L136): `--ts-this-bg: var(--ts-bg-0)` (3× redeclaration). Trigger (L312–340): `--ts-ui-select-trigger-min-height: 2.75rem`, `--ts-this-bg: var(--ts-bg-1-t)`, `--ts-input-bg-grad: var(--ts-accent-glow-bg-2)`, `--ts-input-border: color-mix(in srgb, var(--ts-input-color), transparent 80%)`. State variants (L394–418): `--ts-input-color: var(--ts-text-primary-dim)`, `--ts-input-color: var(--ts-text-accent)` for active. Accent-shadow override (L432–437): `--ts-input-border: var(--ts-accent-border)`, `--ts-shadow-3: var(--ts-shadow-accent)`. Hover/active variants L731–812. Scrollbar (L524, L530): `--ts-ui-scrollbar-size: 6px/7px`. Font selector scope (L682): `--ts-this-bg: #47474720` (HARDCODED HEX + alpha). Banner-generator app scope (L1188–1215): `--ts-input-color`/`-active`/`-bg`/`-border` overrides w/ `--ts-this-bg: var(--ts-accent-glow-bg-2)`/`--ts-this-bg: var(--ts-accent)`. Icon sizing (L1284–1304): `--ts-input-icon-pad/-icon-size/-icon-fs` derivative chain.
- **`--ts-bg-N` direct references:** L91, L98, L136, L265 (commented), L336, L341 (fallback only), L418, L497, L579, L634 (commented), L831, L843, L1191, L1353, L1439. **13 LIVE + 2 commented.**
- **Selectors of interest:** `.ts-ui-select__dropdown, .ts-icon-dd-list` (L54, the inelegant union), `.ts-icon-dd-list` standalone (L78), `.ts-ui-select .ts-ui-select__list` (L96), `.ts-ui-select[data-ts-ui-select-placeholder*="fonts"] .ts-ui-select__option` (L118 — the FONT VARIANT distinguished by data-attr substring), `.ts-icon-dd-list .ts-icon-option`, `.ts-card .ts-ui-select .ts-ui-select__option`, `.ts-ui-select__option:hover/--selected`, `.ts-banner-generator-app .ts-card:has(.ts-ui-select--open, .ts-icon-dd-list.open)` (L178), `.ts-icon-selected-row.ts-fullselector-wrapper` (L1060+), state classes `.ts-ui-select--open`, hover, `.ts-ui-select__option--selected`, `.ts-ui-select__trigger`.
- **Keyframes:** none. **At-rules:** none.
- **Hardcoded literals:** L682 `#47474720` (font-picker dark-tint).
- **Owner annotations VERBATIM (selected):** L9 `@ts-component-consolidate`; L10–53 the SCOPE CONSOLIDATION brief (Hoist tokens to `.ts-ui-select` root); L134, L174, L182, L189 `@ts-component-consolidate` repeats with prose; L204 `@ts-component-exception`; L206–271 CRITICAL LAYOUT OVERRIDE — DO NOT CONSOLIDATE; L616–637 REFACTOR NOTES AND HIGHLIGHTS (4× repeat "Tokens that needs to be centralized"); **L679 #NEW REFACTOR NOTES: "Lush Mode"** — proposes a new global styling mode that enables background-images for inputs that already have `--ts-this-bg` set; L727 OWNER FIXES & AUDIT (definitive state/color solving in single nested blocks); L857–1058 the ICON SELECTOR full refactor brief; L1057 `NEW NOTE: PLESE GREP THE  BLOCK FOUND  BY SEARCHING FOR @consolidate_select_component` — owner-instituted grep tag; L1195 `#CRAZY_FIX_RULES`; L1257 `@ts-component-consolidate`; L1262 CRITICAL duplication note; L1319 REMOVE CASCADE ABUSE (CRITICAL); **L1453 `#CRAZY_FIX_RULES: added a hardcoded css placehoplder replacement for the icon when theresno icon selected. this should be done with js instead of this.`**
- **Refactor flags:** (a) the file is owner-acknowledged-disordered; see "Special case" section for the 7-step reorg plan; (b) `--ts-this-bg: var(--ts-bg-0)` declared 3× in 50 lines (L91/L98/L136) — extreme redundancy; (c) `#47474720` font-selector tint is hardcoded; (d) **the `[data-ts-ui-select-placeholder*="fonts"]` selector** (L118) uses substring matching on a data-attribute to identify the font variant — should be a clean modifier class `.ts-ui-select--font-picker`; (e) the L857–1058 ICON SELECTOR refactor brief explicitly enumerates 7 things to fix — should be the rebuild's select-component checklist; (f) the L1453 `#CRAZY_FIX_RULES` icon-placeholder hack should move to JS; (g) the `.ts-banner-generator-app .ts-card:has(.ts-ui-select--open, .ts-icon-dd-list.open) { z-index: 200 !important; backdrop-filter: none !important; }` (L178) is a z-index escape hatch that the owner annotates "this fix is already aknowledged and needs to eprsist."
- **Session 3/4 relationship:** select system is the chunk's largest active refactor target. The L857–1058 refactor brief should drive the Session 4+ select sandbox. The `--ts-ui-select-trigger-min-height` JS-coupled token (L312) is the model for JS-driven sizing.
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-ui-select*` in catalog §4.10. (b) NEW: the "Lush Mode" proposal at L679 is design intelligence not in catalog; the `@consolidate_select_component` grep tag is novel; the L1453 JS-replacement candidate is undocumented. (c) No contradictions.

---

### headermenu-topnav-fixednav-mobilemenu-sidebarnav.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/headermenu-topnav-fixednav-mobilemenu-sidebarnav.css`  ·  **Lines:** 2,544  ·  **Bytes:** 86,627
- **Block type:** 5-component compound (top-nav / fixed-nav / mobile-menu / sidebar-nav / header-menu-burger) + 2 floating UI helpers — see "headermenu split" section above for the per-component breakdown, shared vs private tokens, and structural facts.
- **Tokens declared:** see grep (massive). Shared at L19–219 (the token cartel), per-component overrides scattered, sidebar-private at L2261+, mobile-menu at L1188+.
- **`--ts-bg-N` direct references:** L1564, L1807, L1839, L2020, L2369 (`--ts-this-bg-hover`), L2437 (commented), L2542. **6 live direct references** — astonishingly low given the file size; the token cartel does most of the work via `--ts-this-bg: var(--ts-bg-body)`.
- **At-rules:** 3× `@media`: `min-width: 867px` (L1821), `max-width: 868px` (L1964 — the strict-less-than vs strict-greater-than hairline split is deliberate), `max-width: 420px` (L2232).
- **Selectors of interest:** see headermenu split. Substring-distribution at L19–29 is the major R-cascade pattern that must be rewritten. The 4× `:has(button.ts-menu-burger.active)` cascades coordinate burger-open state across siblings.
- **Hardcoded literals:** L369 `rgba(0, 0, 0, 0.1)` — ONE literal in 86KB. Excellent.
- **Owner annotations VERBATIM (the 16 load-bearing ones):**
  - L1–9 `@implementation_note#3` — 7-point header-system wishlist (transparent header w/ scrollspy, mobile-menu activation flexibility variable, duplicate icons script bug, auto-inject icon fallback expansion, custom logo brand uploadable, mobile-only / floating-sidebar layout MUST-HAVE, ul>li>ul sub-nav structure).
  - L10 `REFACTOR NOTE crucial: WE NEED TO ALLOCATE THESE CLASSES TO THE SPECIFIC SCOPE OF THE NA TOPNAV, …` — the substring-distribution performance complaint.
  - L11–18 `Docs: nav typography & sizing chain (B23 R-NAV Phase B)` — the documented sizing chain incl. `--ts-topbar-h 58px`, `--ts-fs-base 0.7rem`, `--ts-nav-btn-h ≈ 41.4px @ 65px topbar`.
  - L35–47, L55, L59–61, L214, L217 — `B23 R-NAV Phase B / R3.5 / Wave 2 / R-CLEANUP-1` build-log cross-references.
  - L48 `OWNER FIXES: now the button heigh is working right with this local calculation using the multiplier padding type and adjusting the mult value a bit. this should be re analyzed and centralized.`
  - L93–123 `REFACTOR NOTE crucial: NAVLINK CONTROL TOKENS — Sizing Constraints & Select Behavior` — explains `--ts-navlink-btn-max-h` constraint-vs-natural-sizing trade.
  - L128–145 `REFACTOR NOTE crucial: --ts-navlink-select-min-w` — 3x button-height multiplier is arbitrary.
  - L151–185 `REFACTOR NOTE crucial: --ts-navlink-select-max-w` — 4x multiplier causes text truncation; recommends clamp(12ch, 20ch, 28ch) (now applied at L187).
  - L246 `#CRAZY_FIX rule must be removed once the design system functions properly`.
  - L668–700 `#CRAZY_FIXES_CODE` blocks.
  - L1029 `#CRAZY_FIX_RULES: if we w ant to add backghround colors to the items on other states`.
  - L1132–1149 the CRITICAL REFACTORING + `@refactor:backdrop-critical/glass-dependent/needs-solid-fallback/token-dependency/container-review` 5-tag stack.
  - L1358 `#OWNER FIX UPGRADES — Header Select Integration`.
  - L1419 `REFACTOR NOTE crucial from the root variable declared for this. we need to organize the css styles. his rule fixed partially the width of the select.`
  - L1794–1802 REFACTOR NOTES (icon sizing pure overrides, fragile).
  - L1967–1992 REFACTOR NOTE (mobile/desktop menu transition is heavily patched; mark as global refactoring rule).
  - L1985 the meta-observation: "We need a more robust strategy to support button components within the header without breaking them, as they have already required multiple patches and workarounds (marked as #CRAZY_FIX_RULES across the stylesheet)."
  - L2001–2007 `#CRAZY_FIX_RULES`.
  - L2046 `#CRAZY_FIX_RULES`.
  - L2196–2214 `#CRAZY_FIX_RULES: This has been defined multiple times, so we need a single general rule` — the burger-open coordinated-cascade requirements.
  - L2499–2524 OWNER FIX & REFACTOR NOTES — the nested asset-scoped token-driven approach with surface mixing for theme-consistent results.
- **Refactor flags:** (a) the L19–29 substring-distribution selector is R-cascade and HAS to be rewritten to explicit `:is(.ts-modal, .ts-topbar, .ts-footer, .ts-mobile-menu, .ts-nav-static, .ts-nav-fixed)` enumeration (note: NOT `:where(...)` because we DO want specificity); (b) `--ts--btn-fixed-offset` and `--ts--debug-root-offset-y` (double-dash prefix) violate namespace; (c) the file confesses to multiple `#CRAZY_FIX_RULES` patches around floating-buttons + burger + mobile-desktop transition — these must be REBUILT, not migrated; (d) `--ts-fs-base: 0.68rem` (L39) hand-tuned per nav scope — this is the Wave 1.6 ladder-recomputation pattern (Resolution #1: keep the math, override only the base); (e) sidebar-nav at L2253+ uses CSS Nesting heavily — modern syntax, ensure consumers support it; (f) **`--base-size: 100dvw` (L2262) is a non-`--ts-` namespaced token** — flag for prefix or removal; (g) the `body:has(aside.ts-sidebar-menu.ts-ui-panel:not(.fixed)):not(:has(.ts-showcase,.ts-wireframe))` (L2253) is the most complex single selector in the chunk — five `:has()` and `:not()` clauses combined.
- **Session 3/4 relationship:** **ALWAYS STRICT autonomy tier** (layout component). The file is a 5-component compound that should be SPLIT into 5 sandbox files in the rebuild — DO NOT migrate as one block. The 1-literal-in-86KB stat shows the apcach pipeline IS working for the nav system; the cascade strategy (substring-distribution) is the violation, not the token discipline.
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-nav-fixed*`/`.ts-mobile-menu*`/`.ts-menu-burger*`/`.ts-sidebar-menu*` in catalog §4.10. (b) NEW: the 7-point `@implementation_note#3` wishlist at L1–9 is the rebuild's nav-system spec; the B23 R-NAV build-log cross-references at L11–18/L35–47 are novel provenance; the sidebar-nav grid-push (vs overlay) layout at L2253+ is the "must-have alternative layout" called for in the wishlist; the `@refactor:backdrop-critical/...` 5-tag system is reused here. (c) No contradictions.

---

## Annotation index

### Section header markers (§ numbering)
- inputs-global-nested-design-pattern.css: §6f RANGE SLIDER (L432), §6f.1 ADVANCED RANGE SLIDER (L478), §6g CHIPS / TAGS (L656), §6h TABS (L782), §6i BADGES & STATUS INDICATORS (L1004), §6j NAVIGATION (L1177), §6k MODAL / OVERLAY (L1233), §6l TABLES (L1453)
- ts-panel+root-debugger-component.css: §6c PANELS (L3, L874), §6d NEST-REDUCTION SYSTEM (L25, L893)
- ts-card-flip-swipe-interactive-component.css: §6b CARDS (L2), §6q Universal 3D Flip Cards (L608), §6q.2 SWIPE CARD VARIANT (L877), §6r PRICING CARDS (L1032), §6s TESTIMONIAL BLOCK (L1344)
- iconlist+featlist-allvariants-component.css: §6c FEATURE LIST + LIST COMPONENT v2 (L2)

### CRAZY_FIX_RULES markers in chunk 4b
- headermenu: L246, L668, L686, L837, L1029, L1041, L1053, L1101, L1166, L1195, L2001, L2046, L2196 (**13 occurrences in headermenu alone**)
- ts-ui-select-variants(disordered): L910 ("CRAZY_FIX_RULES" in brief), L1195, L1453

### CRITICAL / REFACTOR NOTE / OWNER FIX markers (selected, chunk 4b)
- headermenu: 16 distinct blocks (see file entry above)
- ts-ui-select-variants(disordered): 9 distinct blocks (see file entry)
- iconlist+featlist-allvariants-component: 9 distinct blocks (LAYER-1/LAYER-2 brief, GENERIC LIST VARIANT, list-refactor, LIST ITEM CONTENT ISOLATION, content-box necessity, deprecated variant, OWNER REFACTOR FIX, background styling separation, GLOBAL BACKGROUND IMAGE SYSTEM)
- inputs-global-nested-design-pattern: 1 large block (L1–97 REFACTOR NOTES INPUTS BASE SYSTEM)
- ts-card-flip-swipe-interactive-component: 4 blocks (§6q owner refactor exemplar L607–676, REFACTOR NOTES 3D drop-shadow L746–747, TEXT SHADOW ENGINE banner L1032+, END OF UPDATED REFACTORED L1030)
- ts-panel+root-debugger-component: 1 large block (L282–299 panel-debugger unification plan)
- ts-checkbox-radio: 1 block (L3–25 dedupe brief)
- footer-component: NONE explicit
- ts-patterns: NONE
- ts-masonry: 1 (L372 HARDFIXES TEMPORARY annotation)

### `@refactor:*` structured machine-readable tags (chunk 4b)
- ts-checkbox-radio:L766–769 (4-tag stack on light-theme bulk-bar)
- inputs-global-nested-design-pattern:L1271–1274, L1288–1291, L1300–1303, L1312–1326 (4-tag stack repeated 4× on modal-scope rules)
- ts-card-flip-swipe-interactive-component:L373–374 (2-tag stack on `.ts-card.gradient`)
- ts-ui-select-variants(disordered):L66–67, L89–90, L626–629, L1174–1177 (2 to 4-tag stacks)
- headermenu:L379–382, L525–530, L1145–1149, L1199–1204 (5-tag stack INCLUDING `container-review`)

### `@ts-*` structured tags
- ts-panel+root-debugger-component:L282 `@refactor_note @owner_alias_addition @ts-panel--refactor-plan @ts-panel-expansion @component-consolidation`
- ts-ui-select-variants(disordered):L9/L134/L174/L182/L189/L857/L1257 `@ts-component-consolidate`; L204 `@ts-component-exception`; L1057 `@consolidate_select_component` (owner-instituted grep tag)
- ts-checkbox-radio:L1 `@ts-inputs-refactor-dedupe #START_DEDUPE`
- inputs-global-nested-design-pattern:L7 `@ts-inputs-refactor-dedupe`
- iconlist+featlist-allvariants:L217 `@ts-list-refactor`

### `@implementation_note` / `@perf` / other tags
- headermenu:L1 `@implementation_note#3` (7-point wishlist)
- headermenu:L11 build-log cross-references (`B23 R-NAV Phase B`, `R3.5 batch entries`, `R-CLEANUP-1`)

---

## Cross-chunk synthesis

### Running `--ts-bg-N` direct-reference count (CHUNK 4b CONTRIBUTION)

| File | Direct refs (live) | Notes |
|---|---|---|
| ts-masonry+layout-priitives | 2 | L26, L619 |
| footer-component | 17 | includes REDECLARATION of `--ts-bg-1` and `--ts-bg-2` at component scope (L662, L831) |
| ts-checkbox-radio | 28 | asymmetric light-vs-dark hex problem |
| ts-patterns | 3 | L326, L342, L378 |
| iconlist+featlist | 1 | fallback-only at L109 — **cleanest in chunk** |
| ts-panel+root-debugger | 7 | includes hex fallback `#1a1b1e` and dev-only `#111214` |
| inputs-global-nested-design-pattern | 23 | + 6 commented-out |
| ts-card-flip-swipe-interactive (counted ONCE; #2 is a duplicate) | 17 | |
| ts-ui-select-variants(disordered) | 13 | + 2 commented-out + 1 hex `#47474720` |
| headermenu-topnav-…-sidebarnav | 6 | + 1 commented-out — **astonishingly clean for 86KB** |
| **TOTAL CHUNK 4b** | **117 live direct references** | (+8 commented-out; +1 from card-flip duplicate if double-counted = 134) |

Combined with chunk 4a's ~25 violations, the COMPONENTS folder contributes ~142 Rule 15 / R-rule-15 violations. The `inputs-global` + `ts-checkbox-radio` + `footer-component` + `ts-card-flip` files alone account for 85 of them (60%) — these are the priority refactor targets.

### Files with declared-and-redeclared `--ts-bg-N` primitives at component scope (most severe)
- **footer-component.css:L662** `--ts-bg-2: #ffffff14` (light-theme footer-dark variant primitive REDECLARATION)
- **footer-component.css:L831** `--ts-bg-1: var(--ts-this-bg-dim-4)` (REVERSE derivative — sets a primitive FROM a derivative; architectural inversion)
- These are the only files in BOTH chunk 4a AND 4b that redeclare primitives at component scope. **PRIORITY P0 fix.**

### Hardcoded color literals in chunk 4b (color-mix and standalone)
- ts-panel+root-debugger:L315 `#111214` (dev-only debug-btn swatch), L594 `#1a1b1e` (fallback)
- ts-checkbox-radio:L499/L524 `#ffffff` (in color-mix for accent-border), L788 `#ffffff` (in color-mix), L790 `#000000` (in color-mix), L803 `#1a1a1a` (in color-mix)
- ts-patterns:L71 `#ff540a` (accent fallback in `var(--ts-accent, #ff540a)`)
- ts-ui-select-variants(disordered):L682 `#47474720` (font-picker tint)
- inputs-global-nested-design-pattern:L293 `#191b22` (chip variant fallback), L732 `#000000bd` (warning on-accent), L994 `#fff !important`, L1090 `#c084fc` (purple badge), L1095 `#67e8f9` (cyan badge)
- footer-component:L657 `#08090c`, L658 `rgb(255 255 255 / 8%)`, L659 `#f2f3f7`, L660 `white`, L661 `#6f6f6f`, L662 `#ffffff14`, L769 `#08090c`, L773 `rgba(255, 255, 255, 0.05)`, L790 `#f2f3f78a`, L857 `#f2f3f7` (deep-dark footer-dark variant — 10 literals)
- headermenu:L369 `rgba(0, 0, 0, 0.1)` (ONE literal in 86KB — exemplary OKLCH compliance)
- ts-card-flip:L946/L962 inside `color-mix(in srgb, currentcolor, var(--ts-text-primary) 40%) !important` — no hex but `currentcolor` short-circuit
- ts-masonry: none (clean)
- iconlist+featlist: none (clean)

### Files that touch `--ts-this-bg` derivatives correctly (GOOD specimens, chunk 4b)
- **iconlist+featlist-allvariants** — declares its OWN derivative `--ts-this-bg-border` recipe via `--ts-mix-perc` parameter — sub-derivative innovation
- **inputs-global-nested-design-pattern** — 23 surface re-anchorings via `--ts-this-bg: var(--ts-input-bg)` pattern is the canonical Rule 4 reference
- **ts-card-flip-swipe-interactive** — `--ts-flip-bg`/`--ts-swipe-bg` chains all derive from `--ts-this-bg-dim`/`-grad`/`-border` family
- **headermenu** — entire 86KB compound uses `--ts-this-bg: var(--ts-bg-body)` once and everything derives — exemplary token discipline (cascade discipline is the violation, not token discipline)
- **ts-panel+root-debugger** — panel system uses derivatives correctly; debugger introduces hex literals
- **ts-checkbox-radio** — uses `--ts-this-bg: var(--ts-bg-3)`/`--ts-bg-2-t`/`--ts-bg-4-t` then derives — pattern OK but the source primitives are Rule 15 violations

### Files using CSS Nesting (`&` or nested selectors) in chunk 4b
- headermenu:L2253–2496 (sidebar-nav block — extensive native CSS nesting), L2447 (`&:hover`), L2374 (`&:hover` inside option), L2313 (`&:has(.ts-ui-select--open)`), L2379 (`&:not(:last-child)`), L1953 (`.ts-nav-fixed:has(.ts-menu-burger.active) { .ts-theme-toggle, .theme-toggle, .ts-topbar__logo { ... } }`)
- ts-panel+root-debugger:L339 (`&:hover,&:focus` inside debug-btn)
- ts-card-flip-swipe-interactive: none material

### Files using modern features (2024–2026) in chunk 4b
- **Container queries:** ts-masonry (L74/L80/L86 — `container-name: ts-masonry`)
- **@property registration:** inputs-global (L481 `--ts-range-val`), ts-panel+root-debugger (L48/L55 `--ts-nest-radius`/`--ts-nest-pad`, duplicated L916/L923), ts-card-flip-swipe (L307/L313/L319 `--shadow-blur`/`--shadow-offset`/`--shadow-opacity` — namespace violation)
- **`:has()`:** headermenu (extensive — burger-active cascades, sidebar-menu body grid trigger), inputs-global (modal-input has), ts-ui-select-variants(disordered) (z-index escape hatch L178), ts-panel+root-debugger (L142, L350)
- **`revert-layer`:** ts-panel+root-debugger:L355
- **CSS Nesting (native):** see above
- **`allow-discrete`/`@starting-style`:** ts-panel+root-debugger:L278 (`transition: display .5ms allow-discrete, opacity .3ms`)
- **`color-mix(in srgb, …)`:** ubiquitous (all 11 files); modal-srgb-mix recipes drive the entire surface chain
- **`:where()` (zero-specificity selector):** inputs-global:L138, headermenu (none material)
- **`@container ts-masonry`:** ts-masonry only

### Real bugs surfaced in chunk 4b (silent rendering / parser failures)
1. **ts-card-flip-swipe-interactive-component.css** AND ts-card-flip-swipe-interactive-component2.css are bit-identical duplicates — wasted disk + risk of divergent edits.
2. **footer-component.css:L831** — `--ts-bg-1: var(--ts-this-bg-dim-4)` REDEFINES a primitive token using a system-layer derivative. Catastrophic architectural inversion.
3. **footer-component.css:L662** — `--ts-bg-2: #ffffff14` REDEFINES a primitive at component scope. Same problem.
4. **ts-patterns.css:L88/L92** — `--ts-pattern-scale: max(1, 0.5)` and `max(1, 0.75)` are NO-OPS (max always returns 1).
5. **ts-panel+root-debugger-component.css** — ENTIRE PANEL BLOCK DUPLICATED L6–280 ≈ L874–1091; `@property` declarations duplicated L48/L55 ≈ L916/L923.
6. **ts-card-flip-swipe-interactive:L307/L313/L319** — `@property --shadow-blur`/`--shadow-offset`/`--shadow-opacity` drop `--ts-` namespace prefix.
7. **iconlist+featlist-allvariants:L122–158** — LAYER-1 hover-accent token quartet declared TWICE with different values (`--ts-accent-bright`/`-border` then `--ts-accent-dim`/`-border`). Second wins.
8. **inputs-global-nested-design-pattern:L284/L335/L350** — `--ts-input-bg` declared multiple times in the same scope.
9. **ts-ui-select-variants(disordered):L91/L98/L136** — `--ts-this-bg: var(--ts-bg-0)` declared 3× in 50 lines.
10. **ts-checkbox-radio:L72** — `border-radius: var(--ts-radius-xss, 3px) !important` — `--ts-radius-xss` is not in canonical ladder (4/6/8/10/16); likely typo for `--ts-radius-xs`.
11. **headermenu:L19–29** — substring-distribution `:root .ts-modal, :root .ts-modal *, …` declares the entire nav token cartel on every descendant of every nav family. Performance + R-cascade violation. Owner explicitly complains at L10.
12. **ts-ui-select-variants(disordered):L1453** — `#CRAZY_FIX_RULES` icon-placeholder rendered via `::after` content hack; owner notes "this should be done with js instead of this."

### NEW design intelligence to lift into permanent skill references (chunk 4b)

1. **The 3-LAYER TOKENIZATION scheme from inputs-global L42–58** — `1. GLOBAL TOKENS (shared) → 2. COMPONENT TOKENS (asset-level) → 3. VARIANT TOKENS (local)`. This is the canonical Toolskin token hierarchy and should be the opening paragraph of design-tokens-2.0. The 3-scope ARCHITECTURE REORGANIZATION at L20–38 (ROOT/GLOBAL → ASSET → IMPLEMENTATION TYPE) is the file-organisation pattern.
2. **The 4-LAYER NESTED DESIGN PATTERN from inputs-global** — `private --_x → public --ts-input-* → surface re-anchor --ts-this-bg → variant overrides cascade automatically`. The §6g chips block (L660–780) is the shortest specimen. Lift verbatim as the Rule 4 surface-superposition canonical reference.
3. **The LAYER-1/LAYER-2 architecture brief from iconlist+featlist L1–39** — "LAYER 1 declares tokens ONCE in component-scoped root, LAYER 2 element rules consume tokens, variants override TOKENS only, never redeclare properties." This is the rebuild's per-component file template.
4. **The CLAMP ICON ENGINE from iconlist+featlist L63–80** — `--ts-feat-icon-base × --ts-feat-icon-mult` ladder (xs=0.35, sm=0.8, md=0.9, lg=1.10, xl=1.25) inside `clamp(min, base*mult, max)`. Variants override ONLY `--ts-feat-icon-mult`. Reusable for any sized-element family.
5. **The DERIVATIVE SPACING CHAIN from iconlist+featlist L85–89** — `--ts-feat-pad-base → -icon-pad (×0.98) → -icon-gap (-icon-pad×0.75) → -item-pad (-icon-pad×0.75) → -item-gap (-item-pad×0.5)`. Override one root, the rest rescales. Canonical pattern.
6. **The §6d NEST-REDUCTION SYSTEM from ts-panel L25–43, L48–55** — `@property --ts-nest-radius` / `--ts-nest-pad` registered as `<length>` so calc()s of `(var(--ts-card-radius) - N * var(--ts-radius-nest-reduction))` actually interpolate. Lift as the canonical pattern for visually-distinguishing nested instances of the same component.
7. **The TEXT-SHADOW A/B COLOR ENGINE from ts-card-flip L1042–1219** — A/B color inputs, font-aware scaling (`calc(1em * --ts-shadow-scale-factor)`), step-count + angle direction + contrast strength, composite final `--ts-shadow` value, utility classes (`.ts-shadow-{xs|sm|md|lg|xl}` / `-{low|mid|high}` / `-{br|bl|tr|tl}` / `-{soft|normal|strong}`) compose. Proves the rebuild can do multi-axis composite-token engines without fragile `oklch(from)`.
8. **The custom `--ts-this-bg-border` recipe via `--ts-mix-perc` from iconlist+featlist L139–158** — components can extend the surface-derivative chain by REDEFINING `--ts-this-bg-border` with a custom mixing percentage (`var(--ts-mix-perc)`). Light theme uses 7%, dark uses 10%. Engine-mediated per-theme variation without per-theme hardcoded values.
9. **The Tokenization-knobs-plus-formula-in-each-context pattern from inputs-global modal L1239–1256** — repeats the v3 pattern from chunk 4a's ts-ui-select-dropdown: each scope (modal, oce-panel, banner-generator) declares BOTH the knob tokens AND the consumer formula in its own scope. Confirmed canonical workaround for custom-property cascade short-circuits.
10. **The owner-instituted REBUILD METHODOLOGY tags** — `@ts-inputs-refactor-dedupe` + `#START_DEDUPE`/`#END_DEDUPE` markers (chunk 4a + 4b checkbox-radio + inputs-global), `@ts-component-consolidate` (ts-ui-select-variants), `@ts-component-exception` (deliberate NON-consolidation marker), `@consolidate_select_component` (cross-file grep tag). Adopt as the rebuild's CONVENTIONS doc.
11. **The B23 R-NAV BUILD-LOG cross-reference convention** (headermenu L11–47) — comments reference external build-log files (`B17-autopilot-log.md`, `B23 Phase B`, `R-CLEANUP-1 Wave 2`) so future audits can trace why a token has its current value. Lift as the "decision provenance" convention.
12. **The owner-acknowledged "Lush Mode" proposal** (ts-ui-select-variants L679) — a global styling mode that opts-in background images for inputs that already have `--ts-this-bg` set. Captures the gradient-vs-flat surface decision as a mode toggle rather than per-variant class. Architectural input for the rebuild's variant system.
13. **The headermenu sidebar-nav grid-push (vs overlay) layout** (L2253+) — `body:has(aside.ts-sidebar-menu) { display: grid; grid-template-columns: var(--ts-sidebar-nav-w) 1fr }` PUSHES content rather than overlaying. Implements the L6 wishlist's "must-have alternative layout."
14. **The card-flip OWNER EXEMPLAR DECLARATION** (ts-card-flip L613–622) — "*This component has been refactored and fully tokenized. No further changes have been required in this area so far. This serves as a reference implementation for systematic refactoring within the design system.*" Use as the QC target for every Session 4 block.
15. **The `@refactor:backdrop-critical | glass-dependent | needs-solid-fallback | token-dependency | container-review` 5-tag system** — emerged in chunk 4a, fully institutionalised in chunk 4b. Adopt as the rebuild's machine-readable refactor flag taxonomy.

---
