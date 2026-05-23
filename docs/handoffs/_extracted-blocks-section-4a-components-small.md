# Extracted Blocks Catalog — Section 4a: Components (small, ≤17KB)

**Sub-agent:** 4a  ·  **Chunk:** components/ small files  ·  **Files:** 16  ·  **Total bytes:** ~155,945

Scope: the 16 smallest files under `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/` (each ≤17KB). Larger component files (footer, headermenu, inputs, ts-card-flip variants, ts-checkbox-radio, ts-panel, ts-patterns, ts-ui-select-variants, iconlist+featlist, masonry) are deferred to chunks 4b/4c.

## Files in this chunk

| File | Lines | Bytes | Block type |
|---|---|---|---|
| log-component.css | 119 | 2,503 | leaf component — `.ts-log` terminal block (§6m) + `.ts-progress` bar (§6n) |
| ts-notif-banner-component(COLOR-INVERSION-HERE).css | 128 | 3,656 | **canonical color-inversion specimen** — `.ts-banner` fixed top strip with `--ts-this-bg-inverse` + `--ts-this-fg-inverse` auto-inversion engine and `&` nested variants |
| theme-toggle-switch-animation-component.css | 99 | 3,801 | imported asset — toggles.dev v4.10.1 SVG day/night animation; non-Toolskin namespace (`--theme-toggle__expand--duration`) |
| marquee-component.css | 150 | 3,942 | leaf component — `.ts-marquee-container`/`-text-wrap`/`-text-text` self-contained marquee w/ duplicate-strip-via-::before loop |
| hero-section.css | 138 | 4,226 | section block (§8a) — `.ts-hero` fullscreen, badge, actions, light-theme fork |
| ts-ui-select-dropdown-max-height-calc.css | 126 | 5,628 | scoped utility (v3) — context-aware dropdown max-height formula re-declared per scope (page, oce-panel, modal, banner-generator-app) |
| tooltips-styles.css | 212 | 6,330 | leaf component — `#ts-tooltip-container.ts-tooltip` placement engine (top/bottom/left/right), forced-dark surface in both themes |
| code-window-component.css | 274 | 6,885 | leaf component — `.ts-code-window` w/ traffic-light dot pseudo-element trick (single dot renders 3 via ::before + ::after) |
| header-promobanner.css | 339 | 8,286 | layout-coupled component — `.ts-promo-banner` dismissable top bar + body-level `:has()` offset cascade for `.ts-nav-fixed` |
| ta-ui-table-component.css | 271 | 8,744 | leaf component — `.ts-ui-table--sortable` + sticky thead + striped + selected-row + bulk-bar (`.ts-ui-bulk-bar` floating action bar) |
| ts-btn-component(basic-ref).css | 447 | 14,601 | **canonical reference** — `.ts-btn` base + primary/outline/ghost/danger/success/alt/secondary/tertiary variants + sm/md/lg/xl scale tokens + counter badge |
| ts-gallery-component+lightbox.css | 538 | 16,357 | **exemplary three-tier component** — `.ts-gallery` float-asymmetric + size mods (full/two-third/half/third/quarter) + container queries + `.ts-gallery-lightbox` |
| toast+ts-ui-toast-component.css | 492 | 16,735 | dual-implementation file — legacy `.ts-toast` (§6o) + current `.ts-ui-toast` with track-bar gradient animation + auto-invert variants |
| ui-kit-spinner+sortable+draggable+enhancednumberinput.css | 517 | 16,825 | multi-component blob — `.ts-ui-spinner`, `.ts-ui-resizable`, `.ts-ui-sortable` (FLIP-ready), `.ts-ui-number-input-wrapper` |
| ts-ui-accordion-component.css | 449 | 17,141 | leaf component — `.ts-ui-accordion` (+ `.ts-accordion` alias) base / `--separated` / `--dual-icon` / `--toggle-plus` (chevron OR plus-minus indicator) |
| custom-cursor-component.css | 392 | 17,285 | special component — `body.has-ts-cursor` SVG data-URL crosshair (§11.1) + `.custom-cursor` JS-driven follower element (§11.2 A/B/C/D/E) with perf contract |

---

## Per-file catalog

### log-component.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/log-component.css`
- **Lines:** 119  ·  **Bytes:** 2,503
- **Block type:** Two leaf components in one file under section headers `§6m LOG / TERMINAL BLOCK` (L2) and `§6n PROGRESS BAR` (L65). No `:root` declarations; pure consumer.
- **Key `--ts-*` tokens declared:** none (component classes don't redeclare anything; everything flows from the system layer).
- **Key `--ts-*` tokens referenced:**
  - Surface chain (legacy): `--ts-bg-3` (L70)
  - Component surface: `--ts-log-bg` (L5, L22), `--ts-panel-border` (L6, L19)
  - Color: `--ts-text-secondary` (L21, L32, L111), `--ts-text-muted` (L36), `--ts-success` (L40), `--ts-warning` (L44), `--ts-danger` (L48), `--ts-accent` (L52, L117)
  - Geometry: `--ts-radius-md` (L7), `--ts-radius-full` (L71, L78), `--ts-log-sp` (L16, L20), `--ts-log-gap` (L57–58), `--ts-log-pad-small` (L61), `--ts-sp-3` (L105), `--ts-modal-gap--ts-sp-2` (L106), `--ts-fs-sm` (L110, L115)
  - Type: `--ts-font-mono` (L17, L118), `--ts-log-fs` (L18)
  - Effects: `--ts-accent-grad` (L77), `--ts-dur-slow` + `--ts-ease-out` (L79)
- **Key classes:** `.ts-log`, `.ts-log__entry` (+ `--info/--debug/--success/--warning/--error/--accent` BEM variants), `.ts-log__entry:first-child`, `.ts-log__actions`, `.ts-progress`, `.ts-progress__bar`, `.ts-progress--sm`/`--lg`/`--striped`, `.ts-progress-row`, `.ts-progress-label`, `.ts-progress-value`
- **Keyframes:** none.
- **Owner annotations:**
  - L2: `/* ─── §6m  LOG / TERMINAL BLOCK ─────────────────────────────────────── */`
  - L10–11 (commented-out): `/*scrollbar-width: thin; scrollbar-color: var(--ts-bg-5) transparent;*/` — confirms an abandoned scrollbar styling that referenced legacy `--ts-bg-5`.
  - L65: `/* ─── §6n  PROGRESS BAR ─── */`
  - L100: `/* Progress label row */`
- **Refactor flags:**
  - **Legacy `--ts-bg-3` on `.ts-progress`** (L70) — Rule 15 violation; must move to `--ts-this-bg-dim-N` derivative.
  - **`--ts-modal-gap--ts-sp-2`** (L106) is a clearly malformed token name (double `--`) — almost certainly a copy-paste typo for either `--ts-modal-gap` or `--ts-sp-2`. The CSS parser will read it as a single token name and fail silently; effective margin-bottom = 0.
  - **Hardcoded `color-mix(in srgb, #fff, transparent 82%)`** (L95–96) inside `.ts-progress--striped` — hardcoded white literal, bypasses theme awareness; light-mode stripes will render the same as dark, which is wrong on a light bar.
  - **Hardcoded `12px` / `5px` / `18px` heights** (L69, L84, L88) — should flow through a `--ts-progress-h-*` token family.
- **Session 3/4 relationship:** Pure leaf consumer of the system layer. Once `surfaces.css` derivative chain is canonical, only the L70 `--ts-bg-3` reference needs migration. The `--ts-accent-grad` reference at L77 ties this file to whatever gradient token the accent engine exposes — verify it exists in the new system layer.
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-log*` and `.ts-progress*` families are surfaced at catalog §4.10. (b) NEW: the malformed `--ts-modal-gap--ts-sp-2` typo is not in the catalog and is a silent rendering bug. The commented-out scrollbar block at L10–11 reveals legacy `--ts-bg-5` usage history. (c) No contradictions.

---

### ts-notif-banner-component(COLOR-INVERSION-HERE).css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/ts-notif-banner-component(COLOR-INVERSION-HERE).css`
- **Lines:** 128  ·  **Bytes:** 3,656
- **Block type:** **CANONICAL COLOR-INVERSION SPECIMEN.** The `(COLOR-INVERSION-HERE)` filename annotation flags this as the reference pattern for the rebuild's auto-inverting child elements. `.ts-banner` is a fixed top strip with a 4-token contract: `--ts-this-bg-surface` and `--ts-this-surface-text` are the only source tokens variants override; everything else (foreground, inverse pair, child background) auto-derives. Uses CSS nested `&` syntax (modern Chromium/Safari/Firefox).
- **Key `--ts-*` tokens declared (inside `.ts-banner` scope, L32–67):**
  - **Token resolution layer:** `--ts-this-bg: var(--ts-this-bg-surface)` (L32), `--ts-this-fg: var(--ts-this-surface-text)` (L33)
  - **Inversion pair:** `--ts-this-bg-inverse: var(--ts-this-fg)` (L36), `--ts-this-fg-inverse: var(--ts-this-bg)` (L37) — this is the canonical inversion engine: foreground becomes background of children, and vice versa.
  - **Default surface:** `--ts-this-bg-surface: var(--ts-bg-2, #1a1c20)` (L40), `--ts-this-surface-text: var(--ts-text-primary, #e8eaed)` (L41)
  - **Variant overrides (only the surface tokens swap):**
    - `&.ts-banner--info`: `--ts-this-bg-surface: var(--ts-info, #3b82f6)` + text `#fff` (L49–52)
    - `&.ts-banner--success`: `var(--ts-success, #10b981)` + `#fff` (L54–57)
    - `&.ts-banner--warning`: `var(--ts-warning, #fbbf24)` + `#1a1c20` (L59–62)
    - `&.ts-banner--danger`: `var(--ts-danger, #ef4444)` + `#fff` (L64–67)
- **Key `--ts-*` tokens referenced:** `--ts-z-banner` w/ literal fallback `2147483645` (L15), `--ts-sp-3/2/4` (L19–20), `--ts-font-body` (L22), `--ts-promo-banner-h` (L26–27), `--ts-this-bg-border` (L46), `--ts-font-mono` (L86, L95), `--ts-bg-2` (L40), `--ts-text-primary` (L41), `--ts-info/success/warning/danger` (L50, L55, L60, L65)
- **Key classes:** `.ts-banner` (+ variants `--info/--success/--warning/--danger`), `.ts-banner__label`, `.ts-banner__tag`, `.ts-banner__file`, `.ts-banner__meta`, `.ts-banner__action`, `.ts-banner__dismiss`
- **Keyframes:** none.
- **Owner annotations VERBATIM:**
  - L3–8 (block comment): `/* ═══════════════════════════════════════════════════════════════════` / `COMPONENT: ts-banner` / `Full-width strip used for surfacing system overrides (e.g., debug` / `stylesheet swap), maintenance notices, etc. Variants: --info,` / `--success, --warning, --danger. Uses fixed positioning at top.` / `═══════════════════════════════════════════════════════════════════ */`
  - L31: `/* ── TOKEN RESOLUTION ───────────────────────────── */`
  - L35: `/* ── AUTO INVERSION ─────────────────────────────── */`
  - L39: `/* ── DEFAULT SURFACE ────────────────────────────── */`
  - L48: `/* ── VARIANTS (ONLY SOURCE TOKENS) ───────────────── */`
  - L69: `/* ── CHILD AUTO-INVERSION ───────────────────────── */`
- **What `(COLOR-INVERSION-HERE)` means:** the filename's parenthetical tag marks this file as the canonical exemplar of Toolskin's color-inversion contract. The pattern is: a parent component declares `--ts-this-bg` and `--ts-this-fg`, then `--ts-this-bg-inverse: var(--ts-this-fg)` and `--ts-this-fg-inverse: var(--ts-this-bg)`. Child elements (here, `.ts-banner__tag` and `.ts-banner__action` at L70–74) then consume the `-inverse` pair to render in the inverted palette automatically — no theme variant rules, no JS, no per-child overrides. This is the model the rebuild should propagate to every component family that contains "chip-on-surface" or "tag-on-background" patterns.
- **Refactor flags:**
  - **Hardcoded hex fallbacks in token defaults** (L40 `#1a1c20`, L41 `#e8eaed`, L50 `#3b82f6`, L51 `#fff`, L55 `#10b981`, L56 `#fff`, L60 `#fbbf24`, L61 `#1a1c20`, L65 `#ef4444`, L66 `#fff`) — Rule 15 / RULING 7 violation. These were inserted as a "belt-and-suspenders" fallback in case the system tokens fail to resolve. The rebuild should rely on the apcach engine generating valid values 100% of the time and remove the literal fallbacks. Today they make the OKLCH governance leak — a yellow `#fbbf24` and a blue `#3b82f6` are NOT apcach-derived from `--ts-accent`.
  - **`z-index: 2147483645`** (L15 fallback) is the max-int "ham-fisted overlay z" pattern — should be tokenized via `--ts-z-banner` exclusively.
  - **Hardcoded sizes:** `12px` font-size (L23), `11px` tag font-size (L87), `10px` arrow-emoji font-size, `0.04em` letter-spacing (L88), `5px` radius (L90), `1.5` line-height — should flow through `--ts-banner-*` tokens.
  - **`box-shadow: 0 2px 8px rgba(0, 0, 0, 0)`** (L29) is zero-alpha — effectively no shadow. Either delete or replace with a tokenized shadow.
- **Session 3/4 relationship:** This file is the **template** for how Session 4 components should declare their surface tokens. The `--ts-this-bg-surface` / `--ts-this-surface-text` / `--ts-this-bg-inverse` / `--ts-this-fg-inverse` quartet should be lifted into a documented pattern in the design-tokens-2.0 skill. `surfaces.css` (Session 3, commit `a0ea9e4`) defines `--ts-this-bg` derivatives but does NOT define the inversion pair — adding `--ts-this-bg-inverse`/`--ts-this-fg-inverse` to the system layer would let every component get this for free instead of redeclaring it.
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-banner*` family is mentioned in the catalog's debug-bar inventory. (b) NEW: the explicit four-step inversion pattern (TOKEN RESOLUTION → AUTO INVERSION → DEFAULT SURFACE → VARIANTS) with verbatim section headers is undocumented and should be lifted into a permanent skill reference. The `&`-nested variant pattern using CSS Nesting is new and worth flagging — this is the only file in the chunk that uses native CSS nesting at component scope. (c) Contradiction: the `(COLOR-INVERSION-HERE)` filename promises a "real" inversion engine, but the hardcoded hex fallbacks at L50–66 mean the variants do NOT route through the apcach pipeline. The rebuild must reconcile: either lift the inversion pair into surfaces.css and let `--ts-info/--ts-success/--ts-warning/--ts-danger` come from the status token chain, or document that this file's variants are intentionally "raw color" overrides outside the apcach contract.

---

### theme-toggle-switch-animation-component.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/theme-toggle-switch-animation-component.css`
- **Lines:** 99  ·  **Bytes:** 3,801
- **Block type:** Imported third-party animation asset (toggles.dev v4.10.1 "expand" variant) integrated into Toolskin. Pure CSS clip-path + `d:path()` transition for day-to-night SVG icon morph. **No `--ts-*` token participation at all** — this file lives entirely in the `--theme-toggle__expand--*` private namespace.
- **Key `--ts-*` tokens declared:** none.
- **Key non-`--ts-*` tokens declared:** `--theme-toggle__expand--duration: 1500ms` (L28)
- **Key `--ts-*` tokens referenced:** none.
- **Key classes:** `.theme-toggle`, `.theme-toggle--reversed`, `.theme-toggle--force-motion`, `.theme-toggle__expand` (+ children `g circle`, `g path`, `:first-child path`), `.theme-toggle--toggled`, `.theme-toggle-sr` (screen-reader label, set `display: none` — see flag), `.theme-toggle input[type=checkbox]:checked~.theme-toggle__expand`
- **Keyframes:** none (pure transition).
- **Owner annotations VERBATIM:**
  - L1–21: full HTML usage example as a block comment, including the source URL `https://toggles.dev/expand` and CDN link `https://cdn.jsdelivr.net/npm/theme-toggles@4.10.1/css/expand.min.css` and the canonical markup for the `<label class="theme-toggle theme-toggle--force-motion">…</label>` structure.
- **Refactor flags:**
  - **Foreign namespace** — `--theme-toggle__expand--duration` uses `--` separators in the toggles.dev convention, NOT `--ts-*`. Per the rebuild's namespace contract, either alias it (`--ts-theme-toggle-duration: 1500ms` → consumed inside, or wrap the imported CSS) or accept the foreign namespace as an explicit exception for imported assets and document the carve-out.
  - **`.theme-toggle-sr` display: none** (L82) — the screen-reader label is killed visually with `display: none`, which removes it from the accessibility tree. The recommended pattern is `clip: rect(0,0,0,0); position: absolute; …` (already present at L73–81). The `display: none` at L82 overrides the entire sr-only pattern above it and breaks screen-reader announcement of the toggle action. Flag for the `accessibility` skill — this is a real WCAG regression.
  - **`prefers-reduced-motion` honors `theme-toggle--force-motion` opt-out** (L93–97) — this is the correct opt-out pattern. Compare to `effects-layers-special-sections-css.css` where the entire `prefers-reduced-motion` block was commented out. This file gets it right.
  - **`@supports not (d:path(""))` fallback** (L85–91) — graceful degradation to `translate3d` when CSS path animation is unsupported. Good pattern.
  - **`1500ms` hardcoded** — could route through `--ts-dur-slow`/`--ts-dur-slower` but the entire file is foreign-namespaced so it would break the import contract.
- **Session 3/4 relationship:** Effectively isolated from the rebuild's token system. Decide whether to (a) leave it as a vendored asset with foreign namespace, (b) wrap it in a `.ts-theme-toggle` host that maps `--ts-*` tokens onto `--theme-toggle__expand--*` inside that scope, or (c) reimplement from scratch in `--ts-*` namespace. The `accessibility` regression at L82 is the highest-priority fix regardless of which path.
- **Gap vs `_code-audit-catalog.md`:** (a) Theme-toggle is mentioned in catalog L590 utility class index. (b) NEW: the `display: none` on `.theme-toggle-sr` masking the sr-only pattern is an undocumented a11y bug. The source URL + version pin (toggles.dev v4.10.1) is useful provenance not in the catalog. (c) No contradictions.

---

### marquee-component.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/marquee-component.css`
- **Lines:** 150  ·  **Bytes:** 3,942
- **Block type:** Self-contained leaf component. Owner header L1: `/* === Marquee Component (self-contained) === */`. Declares its own component tokens at the top of `.ts-marquee-container` (L3–19) and consumes them downstream.
- **Key `--ts-*` tokens declared (inside `.ts-marquee-container`, L4–19):**
  - `--ts-marquee-border-color: var(--ts-border-0)`
  - **`--ts-marquee-bg` declared twice** (L5: `var(--ts-bg-1)`, L6: `var(--ts-accent-glow-bg-2)`) — the second wins; the first is dead code.
  - `--ts-marquee-color: var(--ts-text-primary)`
  - **`--ts-marquee-font-size` declared twice** (L8: `var(--ts-fs-4xl)`, L9: `var(--ts-fs-hero)`) — second wins.
  - `--ts-marquee-speed: 45s` (hardcoded)
  - `--ts-marquee-radius: var(--ts-radius-lg)`
  - **`--ts-marquee-pad` declared twice** (L12: `var(--ts-section-pad)`, L13: `var(--ts-sp-8)`) — second wins.
  - `--ts-marquee-border: 1px` (hardcoded)
  - `--ts-marquee-separator: calc(var(--ts-marquee-font-size) / 2)` — derivative
  - `--ts-marquee-gutter: var(--ts-sp-6)`
  - `--ts-marquee-height: 100%`, `--ts-marquee-width: 100%`, `--ts-marquee-weight: 600`
- **Key `--ts-*` tokens referenced:** see above — all consumed within the file.
- **Key classes:** `.ts-marquee-container`, `.ts-marquee.fullwidth.ts-marquee-container`, `.ts-masonry-item .ts-marquee.fullwidth.ts-marquee-container` (scoped exception), `.ts-marquee-text-wrap`, `.ts-marquee-text-content`, `.ts-marquee-text-text`, `.ts-marquee-text-text br` (guard), `.ts-marquee[data-mq-direction="right"] .ts-marquee-text-text` (reverse), `.ts-marquee-container .ts-marquee-text-text[data-text-content]` + `::before` (seamless loop duplicate)
- **Keyframes:** `ts-marquee-text-animation` (declared TWICE — `@-webkit-keyframes` L120–128 AND `@keyframes` L130–138, identical) and `ts-marquee-loop` (L140–148). The non-prefixed `ts-marquee-text-animation` is **declared but never consumed** in this file — the actual `.ts-marquee-text-text` animation references `ts-marquee-loop` at L77. Dead code.
- **Owner annotations VERBATIM:**
  - L1: `/* === Marquee Component (self-contained) === */`
  - L21: `/* OWNER FIXES: i added poinet event none to avoid the animation stop on hover. tis shoud be removed whenthe behaviour is removed from the defaults. this is a hardcoded tmeporary fix. */`
  - L72: `/* Automatically fits the text exactly */`
  - L91: `/* Guard: <br> from innerText ignores white-space:nowrap — hide them */`
  - L96: `/* Right direction (reverse animation) */`
  - L101–106 (commented-out): `/* === responsive: hide below 700px (matches original) === @media (max-width: 700px) { .ts-marquee-container { display: none; } } */`
  - L108: `/* Marquee only: duplicate strip via ::before so translateX(-50%) loops seamlessly */`
  - L149: `/* Moves text by exactly half its width, creating seamless loop */`
- **Refactor flags:**
  - **Triple-declared override pattern** (`--ts-marquee-bg`, `-font-size`, `-pad`) is a known anti-pattern — the first declaration is intent, the second is "actually use this". Council should pick one and delete the other. The "winning" values are all the more progressive choices (`--ts-accent-glow-bg-2`, `--ts-fs-hero`, `--ts-sp-8`).
  - **`pointer-events: none`** at L20 with the L21 owner note flags this as a known regression-mitigation; the marquee can never be hovered, clicked, or interacted with until the upstream "stop-on-hover" default behavior is removed elsewhere.
  - **Dead keyframes** `ts-marquee-text-animation` (L120–138) — never referenced. Delete.
  - **`-webkit-` prefix on keyframes/animation properties** (L77, L79, L81, L120) is legacy; modern Chrome/Safari don't need them. Strip.
  - **`45s` hardcoded marquee speed** — should align with `--ts-dur-*` family or a new `--ts-marquee-speed` knob.
  - **`translateX(-50%)` + `left: 50%`** trick at L47–48 for fullwidth marquee inside narrower containers is fragile; flag for re-engineering.
- **Session 3/4 relationship:** Consumes `--ts-bg-1` (in dead declaration L5) and `--ts-accent-glow-bg-2` (live, L6). `--ts-bg-1` is a legacy primitive; once the surface chain finalizes, the L5 dead declaration should die alongside it. `--ts-accent-glow-bg-2` references the effects system — verify it survives the Session 3+ migration.
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-marquee*` and `@keyframes ts-marquee-loop` appear in catalog §4.8 (keyframes inventory) and §4.10 (component families). (b) NEW: the dead `ts-marquee-text-animation` keyframes are not catalogued. The triple-declared token pattern is not surfaced in the catalog. The hover-disable `pointer-events: none` workaround is undocumented. (c) No contradictions.

---

### hero-section.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/hero-section.css`
- **Lines:** 138  ·  **Bytes:** 4,226
- **Block type:** Section block under header `§8a Hero Section` (L2). Declares one private variable `--_ts-hero-offset` (underscore prefix denotes local) and a light-theme fork for `.ts-hero__badge`.
- **Key `--ts-*` tokens declared:** `--_ts-hero-offset` (L6, recomputed L23) — local-scoped private variable.
- **Key `--ts-*` tokens referenced:**
  - Surface chain (legacy): `--ts-bg-0` (L16)
  - Spacing/sizing: `--ts-topbar-h` (L6, L23), `--ts-sp-14` (L11–12, L18, L23, L25), `--ts-container-pad` (L13), `--ts-promo-banner-h` (L23), `--ts-sp-8` (L34, L82), `--ts-sp-2` (L68, L100, L117), `--ts-sp-4` (L101, L118, L135), `--ts-sp-5` (L111, L128), `--ts-sp-1` (gap)
  - Accent chain: `--ts-accent-dim-2` (L102), `--ts-accent-bright` (L103, L109), `--ts-accent-dim-3` (L119), `--ts-accent-dark` (L120, L126), `--ts-accent-dark-2` (L129)
  - Type: `--ts-fs-xs` (L105, L123), `--ts-radius-full` (L104, L121)
- **Key classes:** `.ts-hero`, `body:has(.ts-promo-banner:not(.ts-dismissed)) .ts-hero` (offset override via `:has()`), `.ts-container.ts-flex-row.ts-fullwidth`, `.ts-container.ts-flex-row:has(.ts-hero-content)`, `.ts-hero.ts-hero-centered .ts-hero-content.ts-flex-col`, `canvas` (unscoped — see flag), `.ts-hero-image`, `.ts-hero-content.ts-flex-col`, `.ts-hero__badge`, `[data-theme="light"] .ts-hero__badge`, `.ts-hero__actions`
- **Keyframes:** none.
- **Owner annotations VERBATIM:**
  - L2: `/* ─── §8a  Hero Section ─── */`
  - L5: `/* Account for fixed header elements (topbar + optional promo banner) */`
  - L17: `/* Opaque fallback — ensures blend modes work */`
  - L21: `/* When promo banner is visible, double the offset (banner + nav both use --ts-topbar-h) */`
  - L38–56 (LARGE REFACTOR NOTE block): `/* REFACTOR NOTES:` / blank / `Here I added a necessary variant for the hero section, and likely for any content-based section such as parallax or CTA blocks.` / blank / `We need to handle variants and tokens intelligently so that, with just a single class, all inner elements automatically arrange themselves correctly:` / blank / `1. The block should be properly structured and responsive by default, without requiring additional setup.` / blank / `2. These options—and other layout variants—should be easily configurable within the hero editor section in the ts-oce-panel. We should also enable layered animations for different parts of the hero content. Currently, only a single block animation exists, which is too limited. The hero is a primary asset and needs more flexibility.` / blank / `3. There is currently no way to control button presence, quantity, or individual styles.` / blank / `4. The hero (or any featured fullscreen section) should include an option for a "next section" animated arrow at the bottom, indicating that the user can scroll or navigate further.` / blank / `5. We already added support in core toolskin.js for scrollspy and tracking user scroll state. It correctly applies classes and attributes to the main HTML scope. This should be leveraged to apply dynamic styles to the main navigation.` / blank / `Refer to @implementation_note#3.` / blank / `*/`
  - L57: `/* #CRAZY_FIX_RULES */`
- **Refactor flags:**
  - **`background-color: var(--ts-bg-0)`** (L16) — Rule 15 violation; legacy primitive, must move to `--ts-this-bg` derivative chain.
  - **`canvas` selector (unscoped)** at L72 — this rule applies `min-width: 100%; min-height: 100%; object-fit: cover` to **every `<canvas>` in the document**, not just hero canvases. Highly likely to bleed into chart/visualization canvases. Must scope to `.ts-hero canvas`.
  - **`padding-bottom: var(--ts-sp-14)`** declared twice in `.ts-hero` (L12 and L18) — duplicate, second is no-op but adds parse cost.
  - **`!important` on padding-top** in the body-has() rule (L24) — single `!important` to win over base `.ts-hero` padding-top. Brittle.
  - **Light-theme fork at L114–130 duplicates the entire `.ts-hero__badge` rule** instead of overriding only the divergent properties. Also declares `color` TWICE (L126, L129) — last wins. Refactor to override only `background`, `border`, `color`, `font-weight`, `letter-spacing` deltas.
  - **`clamp(285px, 90vw, 200px)`** on `.ts-hero-image` (L86) — **invalid clamp**: max (200px) < min (285px). CSS will silently swap and clamp to 285px. Bug.
- **Session 3/4 relationship:** `--ts-bg-0` consumer flags this for surface migration. The `:has()` cascade for promo-banner offset is sound but couples hero to a sibling component — when the layout system gets a proper variable-height topbar, this can simplify. The badge variants are some of the few light-theme forks in this chunk — they're a good test specimen for the light-mode auto-derive engine.
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-hero*` family is mentioned in catalog §4.10. (b) NEW: the unscoped `canvas` selector bleed is a real bug not flagged. The invalid clamp at L86 is undocumented. The REFACTOR NOTES block (L38–56) is high-value design intelligence — five enumerated requirements for the hero variant system that should drive the rebuild's hero spec. (c) No direct contradictions.

---

### ts-ui-select-dropdown-max-height-calc.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/ts-ui-select-dropdown-max-height-calc.css`
- **Lines:** 126  ·  **Bytes:** 5,628
- **Block type:** Scoped utility (v3). Solves a custom-property inheritance bug where v2's `:root`-declared formula would short-circuit when the same class (e.g. `.ts-banner-generator-app`) appeared on both `:root` and a descendant panel. **v3 fix:** re-declare BOTH the knobs AND the formula in each context — formula resolves at the context root, dropdown inherits a fully-resolved value.
- **Key `--ts-*` tokens declared (in 5 separate scopes):**
  - **`:root`** (L24–33): `--ts-ui-select-dd-min: 12rem`, `--ts-ui-select-dd-runway: 14rem`, `--ts-ui-select-dd-max-abs: 28rem`, `--ts-ui-select-dd-max-rel: 70dvh`, `--ts-ui-select-dd-max-h: clamp(…)` formula
  - **`.ts-oce-panel, .ts-oce-panel__inner, .ts-oce-panel .ts-card, .ts-oce-panel .ts-tab-pane`** (L40–54): `--ts-ui-select-dd-min: 7rem`, `-runway: 22rem`, `-max-abs: 16rem` (256px hard cap), `-max-rel: 45dvh` + formula
  - **`.ts-modal, .ts-modal__body`** (L57–67): `-min: 10rem`, `-runway: 18rem`, `-max-abs: 22rem`, `-max-rel: 55dvh` + formula
  - **`:root.ts-banner-generator-app`** (L70–79): `-min: 10rem`, `-runway: 16rem`, `-max-abs: 22rem`, `-max-rel: 60dvh` + formula
  - **`.ts-banner-generator-app.ts-oce-panel` (+ children)** (L85–96): same as oce-panel — belt-and-suspenders override.
- **Key `--ts-*` tokens referenced:** `--ts-ui-select-dd-min/-runway/-max-abs/-max-rel/-max-h` (self), `--ts-ui-select-trigger-min-height` w/ fallback `2.75rem` (L109)
- **Key classes:** `.ts-ui-select__dropdown` (L101–106 — applies max-height + flex layout), `.ts-ui-select__list` (L108–113 — list overflow scrolling within dropdown), `.ts-ui-select--no-search .ts-ui-select__list` (L115–117 — full-height variant when no search input)
- **Keyframes:** none.
- **At-rules:** `@supports (anchor-name: --foo) and (position-try-fallbacks: flip-block)` (L121–125) — progressive enhancement for CSS anchor positioning.
- **Owner annotations VERBATIM:**
  - L1–2: `/* OWNER's FIX:  enhanced dropdown mac heigh system .` / `NEW Refactor Note URGENT: we need to merge and unify all the  spared  code  from the assets to one place ,,  except for the scoped sepcific isolated rules inside bannergenertor.  or other isolated nested scopes. but this al l the cascade inherited  styles must be grouped. move this and all the other inheritanee styles and  all other cases to  unify and clean up the  code.  */`
  - L4–19: full v3 architectural comment explaining why v2 failed and how v3 fixes it (verbatim above)
  - L21–23: `/* ── 1. PAGE-LEVEL DEFAULT` / `NEW REFACTOR NOTE:` / `MOVE TO MAIN ROOT  VARS AND GROPU WIOTH COMPONENT SELECT   ASSET VARS.  DO THE SDAME WITH ALL OTHER DISPERSED NON-SCOPED VARIABLES AROUND THE SHEET AND CHECK THEY ARE STILL APPLIEDON EACH MIGRATION.. ───────────────────────────────────────── */`
  - L35: `/* ── 2. CONSTRAINED CONTEXTS — knobs AND formula re-declared ─────── */`
  - L37–39: `/* Offcanvas editor: dropdown is clipped by .ts-oce-panel__inner's overflow:auto. We size it to fit comfortably WITHIN the panel viewport, never trespassing past the sticky footer. */`
  - L46: `/* tabs + open accordion + footer */`
  - L48: `/* hard cap: 256px inside panel */`
  - L56: `/* Modal body */`
  - L69: `/* Banner generator app (class lives on :root in this app) */`
  - L81–84: `/* Belt-and-suspenders: when the offcanvas panel ALSO has the banner-generator-app class on it (image 3 shows this is real), the panel's offcanvas knobs must win over the app-level knobs. Higher specificity selector for the win. */`
  - L99: `/* ── 3. APPLY TO THE DROPDOWN ────────────────────────────────────── */`
  - L120: `/* ── 4. ANCHOR POSITIONING (progressive enhancement) ─────────────── */`
- **Refactor flags:**
  - **Formula declared 5 times** — exemplifies the "knob and formula together" v3 fix but creates 5 maintenance points. Council should consider whether a CSS `@property` + scoped sub-property could collapse this.
  - **L1 typos** ("mac heigh") and L2/L22 typos ("sdame", "spared", "iotneractiver", "implementastions") — owner's documented refactor stress. Don't fix; preserve as evidence of urgency level.
  - **`+ 1px` adjustment** in `.ts-ui-select__dropdown max-height` (L102) — magic number to account for fractional pixel rounding. Should comment why.
  - **`@supports (anchor-name: --foo)`** at L121 — checks support but `--foo` is a placeholder, not the actual anchor name used. Standard pattern, but worth confirming it actually gates the feature correctly (Chrome 125+, no Firefox/Safari as of early 2026).
- **Session 3/4 relationship:** Pure scoped-utility file, no surface-chain coupling. The pattern (declare knobs + formula in every context that overrides them) is a powerful one and should be cited in the design-tokens-2.0 skill as a known-good workaround for CSS custom property cascade short-circuits. The L2 + L22 NEW Refactor Notes flag that the owner wants ALL similar "dispersed non-scoped variables" centralized.
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-ui-select*` and `--ts-ui-select-*` token family appear in catalog §4.10. (b) NEW: the v2→v3 architectural lesson at L4–19 is undocumented in the catalog and is high-value design intelligence the rebuild MUST preserve. The 5-context override pattern is novel. The `@supports anchor-name` feature gate is undocumented. The "belt-and-suspenders" .ts-banner-generator-app.ts-oce-panel override (L81–96) reveals real-world specificity conflict resolution. (c) No contradictions.

---

### tooltips-styles.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/tooltips-styles.css`
- **Lines:** 212  ·  **Bytes:** 6,330
- **Block type:** Leaf component — `#ts-tooltip-container.ts-tooltip` (ID-scoped) with full placement engine (top/bottom/left/right) for `ToolskinTooltip` (`Toolskin.initTooltips`), YSS `TooltipManager` parity.
- **Key `--ts-*` tokens declared (inside `#ts-tooltip-container.ts-tooltip`, L4–23):**
  - `--ts-tooltip-bg: var(--ts-this-bg)` (L5) → then immediately `--ts-this-bg: #1a1b1e` (L6) → then **`--ts-this-bg: #0c0c0d`** (L8, wins)
  - `--ts-tooltip-border: var(--ts-this-bg-border-hover)` (L10)
  - `--ts-tooltip-color: #e8e9eac9` (L11 — hardcoded with alpha)
  - **`--ts-tooltip-font-size` declared twice** (L12: `var(--ts-fs-2xs, 0.7rem)`, L13: `10px`) — second wins.
  - `--ts-tooltip-arrow-size: 5px`, `--ts-tooltip-duration: 120ms`, `--ts-tooltip-border-radius: 5px`, `--ts-tooltip-max-width: 200px`, `--ts-tooltip-min-width: 40px`
  - `--ts-tooltip-pad-y: var(--ts-sp-3)`, `--ts-tooltip-pad-x: calc(var(--ts-tooltip-pad-y)*1.1)`, `--ts-tooltip-padding`, `--ts-tooltip-lh-factor: 1.45`, `--ts-tooltip-line-height` (derivative)
- **In light-theme override** (L51–58): `--ts-this-bg: #1a1b1e` (different from dark!), `--ts-this-bg-border: color-mix(in srgb, var(--ts-this-bg), white 14%)`
- **Key `--ts-*` tokens referenced:** `--ts-this-bg`, `--ts-this-bg-border-hover`, `--ts-this-bg-border` (consumed via mix), `--ts-font-mono` (L40), `--ts-sp-3` (L19), `--ts-accent` (L205, L211), `--ts-index-bar-height` (L195 — likely wrong reference, see flag)
- **Key classes/selectors:** `#ts-tooltip-container.ts-tooltip` (+ `--visible`), `[data-theme="light"] #ts-tooltip-container.ts-tooltip` + `[data-ts-theme="light"]` (forced-dark even in light mode), `#ts-tooltip-content`, `#ts-tooltip-arrow` + `::before`, placement variants `.ts-placement-top`/`-bottom`/`-left`/`-right` each with `#ts-tooltip-arrow` and `::before` positioning rules, `#ts-tooltip-content ul/ol/li/a`
- **Keyframes:** none.
- **Owner annotations VERBATIM:**
  - L2: `/* ── ToolskinTooltip (Toolskin.initTooltips) — YSS TooltipManager parity: placement + arrow + tokens ── */`
  - L3: `/* Tooltip: ALWAYS dark surface + light text regardless of page theme */`
  - L9 (commented-out): `/*--ts-tooltip-border: rgba(255, 255, 255, 0.08);*/`
  - L50: `/* Light theme: force same dark tooltip */`
  - L97: `/* Placement: arrow + alignment (JS sets .ts-placement-*) */`
  - L103–104 (commented-out): `/*bottom: calc(var(--ts-tooltip-arrow-size) * -2 + 1px); height: calc(var(--ts-tooltip-arrow-size) * 2 + 1px);*/`
  - L122–123, L173–174 (similar commented-out alt-arrow-positioning blocks)
- **Refactor flags:**
  - **`#ts-tooltip-container` ID selector** — high specificity, hard to override. Should this be a class for theming flexibility? Council call.
  - **Hardcoded hex colors:** `#1a1b1e`, `#0c0c0d`, `#e8e9eac9` (L6, L8, L11, L54) — Rule 15 violations. The tooltip is explicitly "always dark" but should derive from a dark-surface token (`--ts-surface-strong`?) rather than literals.
  - **`line-height: vr(--ts-tooltip-line-height)`** at L39 — **TYPO**: `vr(` instead of `var(`. The line-height declaration is silently invalid; falls back to the L73 `line-height: var(--ts-tooltip-line-height)` on `#ts-tooltip-content`. Real bug.
  - **`pointer-events: none !important`** declared 3× (L43, L65, L76) — overkill. Single declaration on parent suffices.
  - **Tooltip overrides `--ts-this-bg` then derives `--ts-tooltip-bg` from it** (L5–8) — clever but the redeclaration ordering means `--ts-tooltip-bg` resolves to `#0c0c0d` (the L8 value), not `#1a1b1e` (L6). Either intentional or accidental — surface to council.
  - **`--ts-index-bar-height`** at L195 used as `margin-top` for `ul/ol` lists inside tooltips — almost certainly wrong reference. `--ts-index-bar-height` is for index/sidebar UI, not tooltip-list spacing. Probably should be `--ts-sp-2` or similar.
  - **`text-wrap: pretty`** (modern feature) at L75, L143, L164, L169 — Chrome 117+. No fallback needed; degrades to default wrap.
  - **`box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4)`** (L47) hardcoded — should tokenize.
  - **Differential `--ts-this-bg` between dark (`#0c0c0d`) and light (`#1a1b1e`) modes** (L8 vs L54) — semi-intentional ("force dark in light theme"), but inconsistent: light-mode is LESS dark than dark-mode. That's wrong — should be equally dark or darker.
- **Session 3/4 relationship:** Consumes `--ts-this-bg-border` and `--ts-this-bg-border-hover` from the surface-derivative chain — good, this file shows the chain at work. The dark-only forced surface conflicts with the surface engine's theme-aware derivation; the rebuild should formalize a `--ts-surface-strong` or `--ts-surface-inverted` token that's always-dark-regardless-of-theme rather than hardcoding `#0c0c0d`.
- **Gap vs `_code-audit-catalog.md`:** (a) Tooltip/`TooltipManager` is in catalog §1. (b) NEW: the `vr(...)` typo at L39, the `--ts-index-bar-height` misuse at L195, the dark-vs-light hex inconsistency (L8 vs L54), and the "force dark in light theme" pattern are all undocumented bugs/intent. (c) No direct contradictions.

---

### code-window-component.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/code-window-component.css`
- **Lines:** 274  ·  **Bytes:** 6,885
- **Block type:** Leaf component — `.ts-code-window` macOS-style window-chrome wrapper for code blocks. Header (with traffic-light dots), content area, and copy button.
- **Key `--ts-*` tokens declared (inside `.ts-code-window`, L10–14):**
  - `--ts-card-border: var(--ts-border-1)`
  - `--ts-card-bg: var(--ts-bg-1-t)`, `--ts-card-bg-2: var(--ts-bg-2-t)`
  - `--ts-card-header-text-fs: calc(var(--ts-card-fs)*1.01)`
  - `--ts-card-code-fs: calc(var(--ts-card-fs, 1em)*1)`
- **Declared inside `.ts-code-dotbtn`** (L134–139):
  - `--ts-code-dotsize: 12px`, `--ts-code-dot-border-color: var(--ts-card-border)`, `--ts-code-dot-radius: 100px`
  - **Hardcoded hex traffic-light colors:** `--ts-code-dot-color-red: #ef4444`, `--ts-code-dot-color-green: #22c55e`, `--ts-code-dot-color-yellow: #eab308`
- **Declared inside `.ts-code-content`** (L243): `--ts-this-bg: var(--ts-bg-0)` — used to drive `--ts-this-bg-dim-3` derivative for the code-block background (L245).
- **Key `--ts-*` tokens referenced:** `--ts-input-radius`, `--ts-card-radius`, `--ts-radius-sm`, `--ts-font-mono` (L9, L244, L259), `--ts-font-body` (L34), `--ts-card-fs`, `--ts-text-secondary` (L40, L192), `--ts-text-primary` (L202, L220), `--ts-text-primary-dim-2` (L176), `--ts-this-bg-dim-3` (L245), `--ts-this-bg-dim-4` (L46), `--ts-card-gap` (L177), `--ts-font-weight-normal` (L179), `--ts-bg-3` (L219), `--ts-fs-xs` (L223), `--ts-border-1` (L228), `--ts-sp-6` (L240)
- **Key classes:** `.ts-code-window`, `.ts-code-window .ts-code-copy` (L18-59 + L183-211 — **declared twice with different styles**), `.ts-code-window .ts-code-copy svg`, `.ts-code-header` (declared twice L69–71 and L73–85), `.ts-code-dotbtn` (declared twice L87–96 and L113–140), `.ts-code-dotbtn.red/.yellow/.green`, `.ts-code-dotbtn:nth-child(2)/(3)/:not(:first-child)`, `.ts-code-dotbtn::before/::after` (the trick), `.ts-code-label`, `.ts-code-copy:hover/:active/i`, `.ts-code-copy::after` (copied tooltip), `.ts-code-copy.copied::after`, `.ts-code-content` + `pre`/`code`
- **Keyframes:** none.
- **Owner annotations VERBATIM:**
  - L1: `/*Imported Code Window Component*/`
  - L32 (commented-out): `/* font-size: var(--ts-btn-icon) !important; */`
  - L162: `/* The first dot (e.g., red) */`
  - L165: `/* Position to the left of the main dot */`
  - L169: `/* The third dot (e.g., green) */`
  - L172: `/* Position to the left of the main dot */`
  - L213: `/* Copy tooltip */`
  - L237 (commented-out): `/* color: var(--ts-text-primary); */`
  - L265 (commented-out): `/* color: inherit; */`
- **Refactor flags:**
  - **`.ts-code-window .ts-code-copy` declared twice** (L18–59 AND L183–211) with totally different rule sets. Last rule wins for non-overridden properties; but L18–59 uses `!important` everywhere (border, outline, border-radius, padding, display, pointer-events, background, background-color, top, right, bottom, position, left, width, border-left, transform, margin, font-size-impl-via-line-height) which means it stomps L183–211 for those properties. Result: visual logic is split across two rules — high refactor priority.
  - **`.ts-code-header` declared twice** (L69–71 single-prop position; L73–85 full styling). Should consolidate.
  - **`.ts-code-dotbtn` declared twice** (L87–96 and L113–140) — the second redefines variables AND re-applies most properties. Last wins for non-`!important` properties; clearer pattern is one block.
  - **`!important` ladder** throughout (~25 instances). Single biggest `!important` density in this chunk.
  - **Hardcoded RGB traffic-light colors** in `.ts-code-dotbtn.red/.yellow/.green` (L99–110) — `rgb(239, 68, 68)`, `rgb(234, 179, 8)`, `rgb(34, 197, 94)` AND ALSO hardcoded as hex tokens `#ef4444`, `#22c55e`, `#eab308` (L137–139). Two parallel hardcoded palettes for the same dots. Pick one.
  - **`.ts-code-dotbtn:nth-child(2), :nth-child(3), :not(:first-child) { display: none !important }`** (L142–146) — only ONE dot is rendered in the DOM; the other two "dots" are `::before`/`::after` pseudo-elements faked into looking like additional dots. Clever trick but fragile — adding a fourth dot or restructuring DOM breaks it. Document this as a known constraint.
  - **`border-radius: var(--ts-input-radius, var(--ts-card-radius), var(--ts-radius-sm))`** at L7 — INVALID syntax. `var()` accepts only ONE fallback, not a chain. Should be `var(--ts-input-radius, var(--ts-card-radius, var(--ts-radius-sm)))`. Currently `--ts-card-radius` is silently ignored.
  - **`--ts-this-bg: var(--ts-bg-0)` inside `.ts-code-content`** (L243) — Rule 15 violation; consuming legacy primitive directly to seed the surface chain. Should use a `--ts-this-bg-dim-N` from the parent or a surface contract.
- **Session 3/4 relationship:** `--ts-this-bg-dim-3` (L245) and `--ts-this-bg-dim-4` (L46) consumption confirms the file uses the derivative chain — but L243's seeding from `--ts-bg-0` breaks the chain at the top. Once `surfaces.css` exposes a proper code-block surface token, this file can drop the primitive reference.
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-code-*` family appears in catalog §4.10. (b) NEW: the duplicate-rule problem for `.ts-code-copy`, `.ts-code-header`, `.ts-code-dotbtn` is not flagged. The invalid `var()` 3-arg syntax at L7 is a real bug. The single-DOM-node-three-rendered-dots pseudo-element trick is undocumented architectural cleverness. (c) No contradictions.

---

### header-promobanner.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/header-promobanner.css`
- **Lines:** 339  ·  **Bytes:** 8,286
- **Block type:** Layout-coupled component — `.ts-promo-banner` dismissable top bar. The file is half component, half global body-level `:has()` offset cascade that re-positions `.ts-nav-fixed` and the first `.ts-section`. Includes responsive media-query stack for ≤720px and ≤480px.
- **Key `--ts-*` tokens declared:**
  - **`--ts-accent: black`** inside `.ts-promo-banner__cta` (L109) — local override (Rule 15 violation — hardcoded color literal)
  - **`--ts-accent: black`** inside `.ts-promo-banner__close` (L136) — same
  - In media `(max-width: 720px)`:
    - `:root { --ts-promo-banner-h: calc(var(--ts-topbar-h)*.75) }` (L209) — overrides global at small viewports
    - Inside `.ts-promo-banner .ts-promo-banner__cta:hover`: `--ts-input-btn-bg-accent: var(--ts-on-accent)` (L240), `--ts-input-btn-bg-accent-color: var(--ts-accent)` (L241)
- **Key `--ts-*` tokens referenced:** `--ts-accent` (L5, L141, L241), `--ts-accent-dark` (L5), `--ts-accent-dim-0` (L93, L123), `--ts-on-accent` (L58, L94, L114, L124, L140, L240), `--ts-promo-banner-h` (L13, L18, L30–31, L148, L156, L159–160, L165–166, L209, L227, L273, L285, L320, L331), `--ts-z-offcanvas` (L29), `--ts-sp-4` (L10, L119), `--ts-ease-in-out` (L15–17), `--ts-font-body` (L55), `--ts-font-display` (L75), `--ts-fs-body-sm` (L56), `--ts-fs-2xs` (L96), `--ts-fs-xs` (L304), `--ts-fs-xl` (L261, L281, L316), `--ts-radius-full` (L90), `--ts-btn-base-transitions` (L100), `--ts-dur-fast` (L110), `--ts-topbar-h` (L155, L160, L165–166, L209), `--ts-on-surface-muted` (L249), `--ts-input-btn-bg-accent` (L234), `--ts-input-btn-bg-accent-color` (L235)
- **Key classes/selectors:** `.ts-promo-banner` (+ `:not(.ts-dismissed)`, `::before`, `.ts-dismissed`), `.ts-promo-banner__text` (+ `strong`, `strong:has(.ts-icon)`), `.ts-promo-banner__cta` (+ `:hover`), `.ts-promo-banner__close` (+ `:hover`), then a long `:has()` cascade: `body:has(.ts-promo-banner:not(.ts-dismissed)) nav.ts-nav-fixed` (L147–149), `body:has(.ts-nav-fixed):has(.ts-promo-banner.ts-dismissed) #ts-main .ts-section:first-of-type` (L154–156), `body:has(.ts-nav-fixed):has(.ts-promo-banner:not(.ts-dismissed)) #ts-main .ts-section:first-of-type` (L158–161, L164–168 — declared twice for padding-top AND margin-top, see flag)
- **Keyframes:** none.
- **Owner annotations VERBATIM:**
  - L3: `/* ── PROMO BANNER (dismissable top bar) ──────────────────── */`
  - L21 (commented-out): `/* position: sticky; */`
  - L146: `/* #CRAZY_FIX_RULES */`
  - L153: `/* Fixed header body offset */`
  - L163: `/* Fixed header body offset */`
  - L175–203 (LARGE REFACTOR BLOCK): `/* #CRAZY_FIX_RULES` / blank / `A complex media-query-based ruleset was introduced to stabilize a poorly structured banner in mobile scenarios.` / blank / `Current behavior:` / `- The primary button switches to an overlay-style button on mobile` / `- The banner is forced to avoid wrapping when the sidebar opens` / `- Visual result is acceptable, but the implementation is fragile` / blank / `Problems:` / `- Text wrapping logic is inconsistent and unpredictable` / `- Layout behavior is tightly coupled to edge-case conditions (e.g. sidebar state)` / `- Heavy reliance on ad hoc media queries instead of system-driven responsiveness` / `- Low maintainability and poor scalability` / blank / `Required improvements:` / `- Replace conditional layout hacks with pattern-based, token-driven layout logic` / `- Use intrinsic layout techniques (flex/grid, min/max constraints, clamp) instead of forced no-wrap rules` / `- Decouple banner behavior from external UI states (like sidebar open/close)` / `- Define a reusable responsive pattern for "banner with action" components` / `- Introduce tokenized rules for:` / `  - Button placement (inline / stacked / overlay)` / `  - Text wrapping thresholds` / `  - Container constraints (max-width, safe areas, padding)` / blank / `Goal:` / `A deterministic, system-driven banner behavior that adapts automatically across breakpoints without fragile overrides or special-case media queries.` / blank / `*/`
- **Refactor flags:**
  - **`#CRAZY_FIX_RULES` marker** appears 2× (L146, L175) — these are the owner's explicit "this is fragile, fix later" flags. High-priority refactor candidates.
  - **`--ts-accent: black` hardcoded** in `.ts-promo-banner__cta` (L109) and `.ts-promo-banner__close` (L136) — Rule 15 violation, plus the variable name is `--ts-accent` but the value is the polar opposite. Naming lies. Should be a separate `--ts-promo-cta-on-color` token.
  - **`rgba(255, 255, 255, 0.04)` hardcoded** in `::before` pinstripe (L39, L41) — Rule 15.
  - **`rgba(0, 0, 0, 0.32)` text-shadow** (L59) — Rule 15.
  - **`rgba(0, 0, 0, 0.35)` background** at L91 then immediately overridden by `var(--ts-accent-dim-0)` at L93 — dead declaration.
  - **`!important` ladder** — `transform`, `padding-top`, `opacity` etc.
  - **Duplicate `padding-top` declaration** at L154–156 (dismissed branch) and L158–161 + L164–168 — the not-dismissed branch declares padding-top twice (L159 raw `--ts-promo-banner-h`, L160 calc combining topbar+promo) and margin-top twice (L165, L166). Second wins both times; first is dead code.
  - **`@media (max-width: 480px)` line-clamp on `__text`** uses both modern `line-clamp` (L308) AND `-webkit-line-clamp: 2 !important` (L309) — fine pattern for compatibility.
  - **Body-level `:has()` cascade** is brittle: any new fixed-position element (e.g., a second promo banner, an A/B test bar) breaks the formula. Owner's L175–203 note explicitly calls this out.
- **Session 3/4 relationship:** Heavy consumer of accent chain (`--ts-accent`, `--ts-accent-dark`, `--ts-accent-dim-0`, `--ts-on-accent`) — verify these all exist in `surfaces.css`/accent engine. The L209 media-query `:root` override of `--ts-promo-banner-h` is a global side effect that other components (`.ts-banner` at `ts-notif-banner-component`, `.ts-hero` at `hero-section.css`) depend on. This is a load-order hazard: if this file loads after a component that already used the larger value, the new value won't recompute. Probably needs to move to a global responsive layer.
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-promo-banner*` family appears in catalog §4.10. (b) NEW: the `--ts-accent: black` local override pattern is undocumented; this is a Rule 15 anti-pattern that may exist in other components too. The body `:has()` offset cascade detail is undocumented. The 720/480 media-query patches are not in the catalog. The L175–203 refactor block is a high-value owner spec for the rebuild's "banner with action" pattern. (c) No contradictions.

---

### ta-ui-table-component.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/ta-ui-table-component.css`
- **Lines:** 271  ·  **Bytes:** 8,744
- **Block type:** Leaf component — `.ts-ui-table--sortable` + scroll container + sticky thead + striped rows + row selection + floating bulk-action bar.
- **Key `--ts-*` tokens declared (inside `.ts-ui-table--sortable, .ts-ui-table-scroll, .ts-ui-bulk-bar`, L9–19):**
  - `--ts-table-border: var(--ts-border-1)`
  - `--ts-table-cell-border: color-mix(in srgb, var(--ts-table-border), transparent 40%)`
  - `--ts-table-head-border: color-mix(in srgb, var(--ts-table-border), transparent 50%)`
  - `--ts-table-bg-th: var(--ts-bg-0)` (Rule 15 violation)
  - `--ts-table-bg-1: var(--ts-bg-1)` (Rule 15)
  - `--ts-table-bg-2: var(--ts-bg-2)` (Rule 15)
  - `--ts-table-cell-pad: var(--ts-sp-3)`, `--ts-table-cb-size: 1.2rem`
  - `--ts-table-cell-fs: var(--ts-fs-sm)`, `--ts-table-th-fs: calc(var(--ts-table-cell-fs)*.9)`
- **Declared inside `.ts-ui-row--selected td`** (L89–90): `--ts-table-select-accent: color-mix(in srgb, var(--ts-accent), var(--ts-table-bg-1) 72%)`, `--ts-this-bg: var(--ts-table-select-accent)` — surface override on selection.
- **Key `--ts-*` tokens referenced:** `--ts-border-1`, `--ts-bg-0/-1/-2` (legacy primitives — flag), `--ts-sp-3/4`, `--ts-fs-sm/lg/2xs`, `--ts-radius-md/base/sm`, `--ts-text-primary/secondary` (L48, L70, L240), `--ts-accent`, `--ts-accent-bright-2` (L88), `--ts-this-bg`, `--ts-this-bg-dim-2/-4` (L85, L109, L114), `--ts-panel-ease-out` (L216), `--ts-border-0` (L268), `--ts-btn-radius`, `--ts-btn-fs`
- **Key classes:** `.ts-ui-table--sortable` (+ `.ts-ui-table--striped`, `.ts-ui-table--grid`), `.ts-ui-table-scroll`, `.ts-ui-table-bulk-wrap`, `thead th` (sticky + sort-key/ts-ui-sort), `tbody td/tr/.ts-ui-row--selected`, `.ts-ui-th--sortable::after` (sort arrow), `.ts-ui-th--active::after` (asc/desc), `.ts-ui-table__select-all`, `.ts-ui-row-checkbox`, `.ts-ui-checkbox-cell`, `.ts-ui-bulk-bar` (+ `:not([hidden])` + `[hidden]/[style*="display: none"]` variants), `.ts-ui-bulk-bar__count`, `.ts-ui-bulk-bar__actions`, `.ts-ui-bulk-bar__actions .ts-btn`, `.ts-ui-draggable-bounds`
- **Keyframes:** none.
- **Owner annotations VERBATIM:**
  - L2 (LARGE INLINE CRAZY_FIX): `/* #CRAZY_FIX_RULES: HERE THE TABLES WORKS GOOD BUT HAS REDUNDANCIES AND LACKS SMART FLEXIBILITY AND STULING  TO BE RESPONSIVE AND AVOIDING BREALING USING MODERN TABLE LAYOUT IMPLEMENTATION. ALSO THE   CELLS WITH ACTIONS DOESN T HAS INNER WRAPPERS FOR BUTTONS CELLS  AND  THERE IS NO REAL SUPPORT FOR IMAGE CELLS, OR PADING FLEXIBILOITY OR  COLUMN SIZING  PROPERLY. WE NEED  TO BE ABLE TO HANDLE GRIDS BETTER  AND THE PARAMETERS.. THE INNER ELEMENTS OF A TABLE ARE RTEALLY DIFFICULT AND STANDARD TO HANDLE.  I MANAGED TO IMPROVE THE CHECKBOXES AND SELECTED STATUSES. AND THE BULK SELECTION  ASSET LOOKS BETTER NOW.  BUT THE SACRIPT FOR BULK MENU  REVEAL AND THE LOGICS FOR TOOLK  DESIGN IS NOT ON MAIN CORE  JS, IS ON ANOTHER JS FOR SHOWECASE. IT MUST BE  MERGED.  */`
  - L3: `/* ── Table sort + scroll + sticky thead + bulk bar ─────────────── */`
  - L40 (commented-out): `/*padding-bottom: 4.5rem;*/`
  - L125: `/* REFACTOR NOTES: HERE  the component has two conflitive  implementastions at the same time: IT has the icon implemented a ijected  on the sortable header,s bitt istill has the  generated asccii char arrows that works pretty good. the problem is that the fotnaWESOME  injected ones ar enot styled and not working. and th e current bhelow yes. sao let's   deciede and  merge both versions to keep the most solid one with proper icons and statesd. */`
  - L207–210 (`@refactor:` tags): `/* @refactor:backdrop-critical */`, `/* @refactor:glass-dependent */`, `/* @refactor:needs-solid-fallback */`, `/* @refactor:token-dependency */` — structured machine-readable tags on the bulk-bar `backdrop-filter`.
  - L212 (commented-out): `/* margin-right: var(--ts-ui-scrollbar-size); */`
- **Refactor flags:**
  - **Multiple legacy primitive references** (`--ts-bg-0/-1/-2` at L12–14) declared INTO component tokens — Rule 15 chain violation. Must rewire to `--ts-this-bg-*` derivatives.
  - **Dual sort-arrow implementation** (L125 owner note + L130–174): ASCII chars `⇅`/`▲`/`▼` AND Font Awesome injection via JS. Owner says FA is "not working" and ASCII is "working pretty good" — kill the FA path.
  - **Heavy `!important`** on `.ts-ui-bulk-bar` reveal/hide logic (L221–235) — to override inline `display:none`/`style` attribute combinations. The L228–230 selector `[hidden], [style*="display: none"], [style*="display:none"]` is a known-fragile pattern; flag.
  - **`backdrop-filter: blur(4px) grayscale(0)`** on bulk-bar (L206) — `@refactor:backdrop-critical` per L207 tag. No solid fallback for unsupported browsers.
  - **Dual surface tokens for selected rows** (L84, L85, L86, L87 — 4 background/border declarations in one selector with the second overriding the first) — pick one.
  - **Hardcoded shadow** `2px 5px 11px rgba(0, 0, 0, 0.21)` (L211) — Rule 15.
  - **Hardcoded `420px` max-height** (L30) on scroll container.
  - **`color-mix(in srgb, var(--ts-table-border), var(--ts-text-primary) 4%)`** on L204 — using text-primary as a border tint contributor. Unusual but intentional.
- **Session 3/4 relationship:** This is one of the worst surface-chain offenders in the chunk — declares `--ts-table-bg-th`/`-1`/`-2` directly from legacy primitives. When `surfaces.css` becomes canonical, every consumer of `--ts-table-bg-*` will paint with stale colors unless this file's L9–19 declarations migrate to derivatives. Also, `--ts-this-bg` IS consumed via L87 + L109/L114 (`--ts-this-bg-dim-2/-4`) — but seeded from L90 which routes through a legacy mix. Inconsistent surface treatment.
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-ui-table*`, `.ts-ui-bulk-bar` are in catalog §4.10. (b) NEW: the `@refactor:*` structured tag system (L207–210) is a useful machine-parseable annotation convention — should be lifted into a refactor-tag inventory across all files. The dual sort-arrow implementation conflict is undocumented design intelligence. The selected-row 4-declaration mess is a real bug. (c) No contradictions.

---

### ts-btn-component(basic-ref).css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/ts-btn-component(basic-ref).css`
- **Lines:** 447  ·  **Bytes:** 14,601
- **Block type:** **CANONICAL REFERENCE** — the filename `(basic-ref)` annotation flags this as Toolskin's authoritative button reference. Establishes the `.ts-btn` base + variants + sizes + icon-host pattern. This file is the model the rebuild's button system MUST match.
- **What `(basic-ref)` means:** "basic reference" — the file documents the agreed-upon canonical button architecture as it exists today, *despite* including TEMP fixes. Per the L1–39 master comment, the architecture is a transitional state with explicit removal conditions ("MUST be removed once SmartButton builder enforces consistent structure"). The file is reference for "what IS today" not "what should be" — but the design contract (button system) IS the target.
- **Key `--ts-*` tokens declared:**
  - **Inside `.ts-btn`** (L42–47):
    - `--_btn-accent: var(--ts-accent)`
    - `--_btn-bg: var(--ts-bg-3)` (legacy primitive — flag)
    - `--_btn-color: var(--ts-text-primary)`
    - `--_btn-border: var(--ts-border-1)` then immediately `--_btn-border: var(--ts-this-bg-border)` (last wins — good, but L45 dead)
    - `--ts-this-bg: var(--_btn-bg)` — seeds the surface chain FROM the button background
  - **Inside `.ts-btn--primary`** (L228–232): consumes `--_btn-bg/border/color` — no new tokens.
  - **Inside `.ts-btn--outline`** (L257–272): full local token kit — `--_btn-bg/-hover/-accent/-border/-border-accent/-border-hover/-color/-color-hover` (8 locals) + `--ts-this-bg: var(--ts-text-secondary)` (Rule 15 hazard — text token used as surface seed).
  - **Inside `.ts-btn--ghost`** (L286–295): `--_btn-bg: color-mix(--ts-this-bg, transparent 98%)`, `--ts-this-bg: var(--ts-bg-1-t)` (legacy primitive — flag), local borders, **`--glow: color-mix(in srgb, var(--_btn-border), transparent 78%)`** and **`--ts-btn-ghost-glow`** composite shadow.
  - **Variants** `--danger/--success/--alt`: `--_btn-bg/-border` from `--ts-danger/--ts-success/--ts-accent-alt`, color `#fff` hardcoded (L330, L336, L342).
  - **Inside `.ts-btn--sm/md/lg/xl`** (L349–379): only `--ts-btn-scale`, `--ts-btn-h-ratio`, `--ts-btn-fs-ratio` — pure ratio-based size system. **EXEMPLARY pattern** — comment at L347 confirms intent: "SIZE VARIANTS — change ONLY the scale + ratios you want to differ. Everything else auto-derives from the ratio chain."
  - **Inside `.ts-btn--secondary/--tertiary`**: `--_btn-bg: var(--ts-bg-2-t)/-5` (legacy primitives — flag).
  - **Inside `.ts-btn__counter`** (L400–425): `--ts-on-accent: var(--ts-on-surface-dim)`, `--ts-accent: var(--ts-on-accent-dim)`, `--ts-this-bg-border: color-mix(--ts-this-bg-dim-4, --ts-on-accent-dim 75%)`.
- **Key `--ts-*` tokens referenced:** vast — every accent/text/surface/border/spacing/radius/duration/easing token family. Specifically `--ts-accent`, `--ts-accent-bright-2`, `--ts-accent-dim-2/--ts-accent-grad`, `--ts-accent-glow-bg-3`, `--ts-accent-shadow-glow`, `--ts-accent-border`/`--ts-accent-border-hover`, `--ts-on-accent`, `--ts-on-accent-dim`/`-1`/`-2`, `--ts-on-surface-dim`, `--ts-text-primary`/`-secondary`/`-secondary-dim-2`, `--ts-border-1`, `--ts-bg-1-t`/`-2-t`/`-3`/`-5` (legacy), `--ts-danger`/`-success`/`-accent-alt`, `--ts-this-bg`/`-active`/`-border`/`-border-active`/`-border-hover`/`-dim`/`-dim-4`/`-dim-6`/`-grad`/`-grad-2`/`-grad-3`, `--ts-btn-h`/`-pad-x`/`-pad-y`/`-fs`/`-fw`/`-ls`/`-radius`/`-dur`/`-icon-size`/`-scale`/`-h-ratio`/`-fs-ratio`, `--ts-fs-xl`, `--ts-icon`, `--ts-radius-full`, `--ts-shadow-accent-sm`, `--ts-sp-1`, `--ts-ease-out`
- **Key classes/selectors:** `.ts-btn` (base + `:hover:not(:disabled)`, `:disabled`), variants `.ts-btn--primary/-outline/-ghost/-danger/-success/-alt/-secondary/-tertiary/-sm/-md/-lg/-xl/-full`, `.ts-btn--ghost:active/-focus`, `.ts-topbar__actions .ts-btn--ghost.ts-btn--icon` (scoped exception), `.ts-btn__counter`, `.ts-icon`/`-> i/svg/ion-icon`, `.ts-icon:not(.ts-icon-dot):not(.ts-icon-tiny) > i`. Inside the `.ts-btn { … }` rule are NESTED selectors (CSS Nesting): `.ts-icon:not(…)` (L93–137) and `span:not(…), .ts-btn-text, .ts-menu-text` (L139–153) — modern CSS nesting at component scope.
- **Keyframes:** none.
- **Owner annotations VERBATIM:**
  - L2: `/* ─── §6a  BUTTONS ──────── */`
  - L4–39 (MASTER REFACTOR BRIEF — the canonical authoring note): `/*#OWNER REFACTOR NOTES:  @ts-smart_button_system. +  style  migration and centralization  v2: centralize SmartButton system as single core class builder. eliminate overlapping button implementations and enforce one construction pattern for all buttons across scopes. buttons must be fully adaptive, environment-agnostic, and extensible without breaking layout or behavior. JS must handle automatic construction: always wrap text in a dedicated span (.ts-btn-text), inject icons, counters, tooltips, and state layers consistently. CURRENT STATUS: - partial centralization achieved via core button attributes - vertical icon alignment patched via nested rules due to inconsistent font-size inheritance across legacy implementations - icon sizing recalculated multiple times across scopes → causes misalignment TEMP FIX (TO REMOVE): - nested icon normalization rules + margin-top hack applied - MUST be removed once SmartButton builder enforces consistent structure and sizing BLOCKERS: - SmartButton auto-construction class not implemented yet - missing guaranteed internal structure (icon + text span + helpers not consistent) - span class standardization (.ts-btn-text) not enforced TARGET ARCHITECTURE: - single SmartButton JS factory builds all buttons - guaranteed DOM structure: [button] [i.ts-btn-icon] [span.ts-btn-text] [span.ts-btn-counter?] [tooltip/helper nodes?] - CSS becomes token-driven only (no structural fixes) HARD RULES: - no manual button composition outside SmartButton system - no duplicated sizing logic across scopes - no hardcoded alignment fixes once system is stable - all variants must derive from token styling only MIGRATION: - mark current fixes as @temporary_alignment_patch - replace once SmartButton class is fully implemented and stable across all scopes */`
  - L48 (commented-out): `/* --ts-btn-icon-size: calc(var(--ts-btn-fs)*1); */`
  - L63 (commented-out): `/* background-image: var(--ts-this-bg-grad-2); */`
  - L100 (commented-out): `/* margin-top: -1%!important; */`
  - L101–136 (LARGE INLINE TEMP FIX BLOCK with `@ts-component-consolidate @temporary_alignment_patch` tag): full removal-conditions document for the icon alignment hack — verbatim available in the file, key text: `ICON ALIGNMENT FIX (CRITICAL / TEMPORARY): … REMOVAL CONDITIONS: - SmartButton system enforces strict DOM structure: .ts-btn-icon + .ts-btn-text - icon sizing defined once at root/token level - no nested/legacy icon rules affecting layout - consistent line-height across all button elements HARD RULE: this patch MUST be removed once button construction is fully centralized and no longer depends on inherited/legacy sizing behavior. NO MODIFICATIONS allowed unless part of full button system refactor.`
  - L161–162 (commented-out): `/*@ts-smart_button_system*/`, `/*@color_bg_surface_refactor*/`
  - L167–170 (commented-out block): `/*.ts-btn:active:not(:disabled) { transform: translateY(0) scale(0.98); } */`
  - L176–226 (LARGE REFACTOR NOTE v1 — outline-variant token-system): `/*#REFACTOR_NOTES v1: button token system + outline pattern (stage 1) CORE CONCEPT: establish a token-driven button system where --ts-this-bg acts as the base semantic color source for each button instance. all visual states derive from this value through mapped local tokens. PATTERN (CURRENT IMPLEMENTATION - OUTLINE VARIANT): - --ts-this-bg → semantic base (context-aware color token) - --_btn-bg → actual background (set to transparent for outline) - --_btn-bg-hover → subtle hover surface (mapped to dim variant) - --_btn-bg-accent → optional accent override for interactive states - --_btn-color → text color derived directly from --ts-this-bg STATE STRATEGY: - default: background = --_btn-bg - hover: background swaps to --_btn-bg-hover OR --_btn-bg-accent - no additional rules → only token reassignment - inheritance-driven updates must propagate automatically INSIGHT: this approach allows state changes by reassigning token values only, avoiding redundant selectors and enabling scalable theming. ISSUES DETECTED: - inconsistent naming (local --_btn-* vs global --ts-*) - cascade failures forcing use of !important - duplicated logic across button variants - unclear mapping between semantic tokens and implementation tokens REFACTOR TARGET: - unify naming convention (prefer ts-scoped or structured hybrid) - enforce single mapping layer: --ts-this-bg → --_btn-* → applied properties - eliminate !important via cascade normalization - standardize state tokens: --ts-this-bg-hover --ts-this-bg-active --ts-this-bg-accent HARD RULES: - no direct color values in components (tokens only) - no new selectors for states (token swap only) - all variants must follow same token contract MIGRATION NOTE: current structure is valid as a transitional model but must be normalized and tokenized further to support full automation via SmartButton system and global theming layer. */`
  - L227: `/* Variants */`
  - L237, L243: `/*@ts-smart_button_system*/`
  - L345: `/* ✅ SCALABLE SIZES: Only change scale, everything else auto-calculates */`
  - L346–348: `/* SIZE VARIANTS — change ONLY the scale + ratios you want to differ. Everything else auto-derives from the ratio chain. */`
  - L351: `/* dampen height: 1.3 × 0.88 = 1.14 effective h-scale */`
  - L353: `/* slightly tighter text:height ratio */`
  - L388, L395: `/*#NEW REFACTOR NOTES:  All the inputs that has gradients  by default must be removed and be delegated globally to a  global button and input styling mode "Lush Mode". WHICH SHOULD NABLE THE BACKGRUND IMAGES FOR THE INPUTS that has already the ts-this-bg built and only needs the image  set to work. the hover state should support it too. */`
  - L399: `/* Button with counter badge */`
  - L427: `/* Icon host for ToolskinIcons (data-icon / data-ts-icon) */`
- **Refactor flags (critical because this is canonical):**
  - **Legacy `--ts-bg-3/-1-t/-2-t/-5`** consumed at L43, L288, L389, L396 — even the canonical button file violates Rule 15.
  - **`color: #fff` hardcoded** at L232 (`--ts-btn--primary --_btn-color`), L252, L330, L336, L342 — Rule 15. Should be `--ts-on-accent` consistently.
  - **`--ts-this-bg: var(--ts-text-secondary)`** in `.ts-btn--outline` (L271) — using a TEXT token as the surface seed. The outline variant's text-color is then `var(--ts-this-bg)` (L264, L277) — clever but inverts the chain. Council should validate.
  - **`!important` ladder** across L266–270, L296–300, L306–308, L316–318 — owner's REFACTOR_NOTES v1 (L200) explicitly identifies this as a known refactor target.
  - **`--_btn-*` (single-underscore) namespace** mixed with `--ts-*` — owner's L201 acknowledges this is an inconsistency. The rebuild must pick one convention.
  - **Vast space-eating empty lines L82–92** (10 blank lines inside `.ts-btn`) — accidental editor scroll? Strip.
  - **CSS Nesting at component scope** (L93–153) — modern feature, fine in 2026 but flag for transpilation/build-step compatibility.
  - **`.ts-topbar__actions .ts-btn--ghost.ts-btn--icon`** (L322–325) — scoped exception with `!important`. Architectural debt.
  - **`text-shadow: 0px 0px 10px var(--glow)`** (L314) on focus/active — accessibility check: text-shadow can reduce contrast and trigger reduced-motion sensitivity.
- **Session 3/4 relationship:** This file IS the test specimen for Session 3's surface chain. `--ts-this-bg-active/-border/-border-active/-border-hover/-dim/-dim-4/-dim-6/-grad/-grad-2/-grad-3` are ALL consumed here — if ANY of those are missing from `surfaces.css`, this button's variants paint wrong. Conversely, every `--ts-bg-N` reference here (L43, L288, L389, L396) is a known migration target that the rebuild's `.ts-btn` MUST resolve. Owner's L4–39 SmartButton brief is the spec for the JS half of the rebuild.
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-btn*` family is in catalog §4.10 and `--ts-btn-*` tokens in §4.6/4.7. The `--ts-btn-scale` ratio chain is mentioned in §1i. (b) NEW: the SmartButton master brief (L4–39), the temporary alignment patch (L101–136), and the REFACTOR_NOTES v1 outline-variant spec (L176–226) are the three most important authoring documents in this entire chunk and MUST be lifted into the rebuild's button spec. The "Lush Mode" gradient-mode concept (L388, L395) is a NEW design feature not in any catalog. (c) Contradictions: the catalog's button-token inventory does not surface the `--_btn-*` local token convention; the rebuild needs to decide whether locals are first-class architecture or a transitional anti-pattern.

---

### ts-gallery-component+lightbox.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/ts-gallery-component+lightbox.css`
- **Lines:** 538  ·  **Bytes:** 16,357
- **Block type:** **EXEMPLARY THREE-TIER COMPONENT.** Self-documented at L4–24 as the canonical Design Tokens 2.0 reference: "Tier 1 PRIMITIVE (—ts-bg-N, —ts-sp-N, —ts-radius-*) :root only / Tier 2 SYSTEM (—ts-this-bg, —ts-this-bg-border, …) set by component / Tier 3 COMPONENT (—ts-gallery-*) references Tier 2". This is the model for how component CSS should be structured.
- **Key `--ts-*` tokens declared (inside `.ts-gallery`, L30–57):**
  - **Surface seed:** `--ts-this-bg: var(--ts-bg-1)` (L32 + L73 `!important` — Rule 15)
  - **Component tokens (Tier 3):** `--ts-gallery-row-h: 18rem`, `-gap: var(--ts-sp-2)`, `-radius: var(--ts-radius-md)`, `-tall-mult: 2`
  - **Surface derivatives (Tier 2 routed):** `--ts-gallery-tile-bg: var(--ts-this-bg)`, `-tile-border: 1px solid var(--ts-this-bg-border)`, `-tile-shadow: 0 1px 0 0 var(--ts-this-bg-bright) inset`, `-overlay-bg: linear-gradient(to top, color-mix(var(--ts-this-bg) 88%, transparent) 0%, color-mix(var(--ts-this-bg) 0%, transparent) 60%)`, `-caption-color: var(--ts-text-primary)`
  - **Motion:** `--ts-gallery-hover-scale: 1.06`, `-hover-duration: var(--ts-dur-slow)`, `-hover-ease: var(--ts-ease-out)`, `-fade-duration: var(--ts-dur-slower)`
  - **Focus ring (accent-derived):** `--ts-gallery-focus-ring: 0 0 0 3px color-mix(in srgb, var(--ts-accent) 55%, transparent)`
- **Declared inside `.ts-gallery-lightbox`** (L385–388):
  - `--ts-this-bg: var(--ts-bg-0)` (Rule 15 — `--ts-bg-0` legacy)
  - `--ts-glb-overlay: color-mix(var(--ts-this-bg) 88%, transparent)`
  - `--ts-glb-control-size: 2.75rem`, `--ts-glb-pad: var(--ts-sp-4)`
- **Key `--ts-*` tokens referenced:** `--ts-bg-0`/`-1` (legacy), `--ts-this-bg`/`-border`/`-bright`/`-hover`, `--ts-sp-2`/`-4`, `--ts-radius-md`/`-sm`/`-full`, `--ts-text-primary`/`-secondary`, `--ts-accent`, `--ts-dur-slow`/`-slower`/`-base`/`-fast`, `--ts-ease-out`/`-snap`/`-spring`, `--ts-fs-sm`
- **Key classes/selectors:** `.ts-gallery` (base + `::after` clearfix), items `> li, > .ts-gallery__item` (+ `:focus-visible`), size mods `.full/--full`, `.two-third/--two-third`, `.half/--half`, `.third/--third`, `.quarter/--quarter`, `.double-height/--double-height`, `.float-right/--float-right`, `.ts-gallery__media` (+ `--loaded`, `:not(.ts-gallery__media--loaded)`), `.ts-gallery__skeleton`, `.ts-gallery__item--loaded .ts-gallery__skeleton`, `.ts-gallery__seo-img`, hover/focus `.ts-gallery__overlay`, `.ts-gallery__caption`, variants `.ts-gallery--uniform`, `.ts-gallery--sortable` + `.ts-ui-sortable__item--dragging`, lightbox `.ts-gallery-lightbox` (+ `--open`, `__stage/__img/__caption/__btn/--close/--prev/--next/__counter`), body lock `.ts-gallery-lightbox-open`.
- **Keyframes:** `ts-gallery-shimmer` (L211–214 — 400px-step gradient slide).
- **At-rules:** `@container ts-gallery (max-width: 900px / 600px / 400px)` (L321–349) for container-query responsive layout; `@supports not (container-type: inline-size)` (L352–375) viewport-media fallback; `@media (prefers-reduced-motion: reduce)` (L520–537) — correctly retained (unlike the disabled block in effects-layers).
- **Owner annotations VERBATIM:**
  - L4–24 (LARGE TIER ARCHITECTURE COMMENT): `/* ═══════════════════════════════════════════════════════════════════════ TS-GALLERY  ·  Float-based asymmetric image gallery ─────────────────────────────────────────────────────────────────────── Sibling to .ts-masonry — different mechanics, different use case. .ts-masonry  → flex + clamp,  responsive auto-layout for cards .ts-gallery  → float + %s,    authored asymmetric layout for images Architecture: Design Tokens 2.0 three-tier Tier 1 PRIMITIVE   (--ts-bg-N, --ts-sp-N, --ts-radius-*)  — :root only Tier 2 SYSTEM      (--ts-this-bg, --ts-this-bg-border, …)  — set by component Tier 3 COMPONENT   (--ts-gallery-*)                        — references Tier 2 Markup contract (JS-hydrated): <ul class="ts-gallery" data-ts-gallery> <li class="quarter double-height" data-src="…" data-caption="…"></li> <li class="half" data-src="…"></li> </ul> Sizes:  full · two-third · half · third · quarter Mods:   double-height · float-right · responsive-half ════════════════════════════════════════════════════════════════════════ */`
  - L28: `/* ─── §1  COMPONENT TOKENS (Tier 3 → Tier 2 only) ─────────────────────── */`
  - L31: `/* Set the surface this component sits on → Tier 2 derivatives compute */`
  - L34: `/* Layout base — derivative chain: change --ts-gallery-row-h, everything scales */`
  - L40: `/* Surfaces — every value routes through Tier 2 */`
  - L49: `/* Motion — references global timing tokens */`
  - L55: `/* Focus ring — derives from accent */`
  - L60: `/* ─── §2  CONTAINER ───────────────────────────────────────────────────── */`
  - L83: `/* ─── §3  ITEMS ───────────────────────────────────────────────────────── */`
  - L92: `/* default: half */`
  - L108: `/* Apply gap as inset padding-style border (avoids margin-collapsing on floats) */`
  - L114: `/* the "gap" is transparent border */`
  - L118: `/* Keyboard focus — accent ring through the transparent border */`
  - L126: `/* ─── §4  SIZE MODIFIERS ──────────────────────────────────────────────── */`
  - L164: `/* ─── §5  MEDIA LAYER (the actual image) ──────────────────────────────── */`
  - L181: `/* Pre-load state — skeleton shimmer (reuses existing --ts-skeleton primitive) */`
  - L189–190: `/* Shimmer steps route through Tier 2 (--ts-this-bg derivatives), so the shimmer auto-adapts to whatever surface the gallery sits on. */`
  - L216: `/* Hidden <img> kept in DOM for SEO / a11y — never visible */`
  - L230: `/* ─── §6  HOVER + CAPTION OVERLAY ─────────────────────────────────────── */`
  - L273: `/* ─── §7  VARIANT — UNIFORM GRID (square tiles, equal sizes) ──────────── */`
  - L286: `/* kill inline-block whitespace */`
  - L291: `/* restore */`
  - L295–296: `/* ─── §8  VARIANT — SORTABLE (flex-based for FLIP support) ────────────── */ /*  Use --uniform for best sortable UX; float layouts don't reorder smoothly. */`
  - L314–319: `/* ─── §9  RESPONSIVE — container queries first, viewport fallback ─────── */ /* Container queries let the gallery respond to its own width, not the viewport — so a sidebar gallery and a full-width gallery rebreak independently. Viewport @media is fallback for older browsers. */`
  - L351: `/* Viewport fallback for browsers without container query support */`
  - L378–382: `/* ─── §10  LIGHTBOX  ·  .ts-gallery-lightbox ──────────────────────────── */ /* Namespaced .ts-gallery-lightbox so it does NOT collide with #ts-lightbox (the Three.js phantom-gallery lightbox). Token-styled, generic. */`
  - L513: `/* Body lock when lightbox open — prevents scroll bleed */`
  - L518: `/* ─── §11  REDUCED MOTION ─────────────────────────────────────────────── */`
- **Refactor flags:**
  - **L32 + L73 `--ts-this-bg: var(--ts-bg-1)`** + L385 `--ts-this-bg: var(--ts-bg-0)` — seeds from legacy primitives. Even the exemplary tier-architecture file uses `--ts-bg-N` as the seed because surfaces.css doesn't yet expose a surface-typed entry token. Rule 15 violation — but the violation is unavoidable today; the rebuild's surfaces.css must expose a token like `--ts-surface-base` so this seeds correctly.
  - **L73 `!important` on `--ts-this-bg`** — fights with L32 declaration (literally the same property in the same selector, just `!important` later). Dead-pattern.
  - **L77–80 `!important` on `::after` clearfix** — for content/display/clear. Modest, but flag.
  - **Container query support is excellent** — but the `@supports not (container-type: inline-size)` fallback duplicates the `@container` rules. Two truth-sources.
  - **`backdrop-filter: blur(14px) saturate(1.1)`** on lightbox (L395–396) and `blur(6px)` on buttons (L464, L508) — no solid fallback. Should use `@refactor:backdrop-critical` tag pattern from `ta-ui-table-component.css`.
  - **Hardcoded `400px 100%` background-size** in shimmer (L197) and `1.4s ease-in-out infinite` animation duration — should tokenize.
  - **`max-height: calc(100vh - 8rem)`** on lightbox img (L422) — hardcoded `8rem`.
  - **Reduced motion correctly preserved** (L520–537) — explicitly disables transitions but NOT layout. This is the right pattern. Compare to `effects-layers-special-sections-css.css` which commented out reduced-motion entirely.
- **Session 3/4 relationship:** This file IS the visual exemplar for the rebuild's component spec. The L4–24 architecture comment should be lifted verbatim into the design-tokens-2.0 skill as the "canonical example of three-tier execution". The `--ts-this-bg-border`, `--ts-this-bg-bright`, `--ts-this-bg-hover` references (L42, L43, L194, L457, L469) confirm the surfaces.css derivative chain has been adopted by at least one component family — verify those derivatives all exist in the new system. The L189–190 comment "shimmer auto-adapts to whatever surface the gallery sits on" is the design promise the surface engine must keep.
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-gallery*` and `.ts-gallery-lightbox*` are in catalog §4.10. `@keyframes ts-gallery-shimmer` is in §4.8. (b) NEW: the full tier-architecture comment (L4–24) is the most important design intelligence in this entire chunk and is NOT in the catalog. The `@container ts-gallery` container-query usage is undocumented — this is the FIRST component to use container queries in this chunk and sets a precedent. The lightbox-namespace separation from `#ts-lightbox` (Three.js) at L378–382 is critical to avoid collision and isn't catalogued. (c) Contradictions: catalog Section 1i mentions `--ts-skeleton` exists but this file says "reuses existing --ts-skeleton primitive" (L181 comment) yet then defines its own `ts-gallery-shimmer` keyframes — the actual integration is not "reuses" but "reimplements with `--ts-this-bg` derivatives". Comment is misleading.

---

### toast+ts-ui-toast-component.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/toast+ts-ui-toast-component.css`
- **Lines:** 492  ·  **Bytes:** 16,735
- **Block type:** Dual-implementation file. Top half (L1–80) is the legacy `.ts-toast` from §6o; bottom half (L93–end) is the current `.ts-ui-toast` system. Owner explicitly flags at L87 that the legacy block is kept "as utilkkitary only" and the new system is "the real toast in use".
- **Key `--ts-*` tokens declared (in `:root .ts-ui-toast-display, :root .ts-ui-toast-stack` scope, L101–147):**
  - **Borders/surfaces:** `--ts-toast-border: var(--ts-this-bg-border)` (L105), `--ts-toast-bg: color-mix(in srgb, var(--ts-this-bg), var(--ts-on-surface-dim) var(--ts-this-bg-mix))` (L107) using two mix-percentage tokens `--ts-this-bg-mix: 2%` (L108) and `--ts-this-border-mix: 20%` (L109)
  - `--ts-toast-blur: 4px`, `--ts-toast-shadow: var(--ts-shadow-1)`
  - **`--ts-this-bg` declared twice** (L112: `var(--ts-bg-0-t)` legacy, L113: `var(--ts-bg-0)` legacy — second wins, both Rule 15)
  - **Type system:** `--ts-toast-fs: var(--ts-fs-xs)`, `--ts-toast-title-fs: calc(*1.1)`, two `--ts-toast-icon-fs` declarations (L118 `var(--ts-fs-md)`, L119 `calc(*1.01)` — second wins), `--ts-toast-icon-size-2: calc(*1.5)`, `--ts-toast-icon-size: calc(*1.75)`
  - **Text/color:** `--ts-toast-text/-2/-3`, `--ts-toast-accent: var(--ts-accent)` (L128 root + L232 re-declared inside `.ts-ui-toast`)
  - **Geometry:** `--ts-toast-rad: var(--ts-card-radius)`, padding family (`--ts-toast-pad-y/x/pad`), two `--ts-toast-gap` declarations (L134 `var(--ts-sp-3)`, L136 `calc(--ts-toast-pad-y * .5)` — second wins)
  - **Animation:** `--ts-toast-anim: ts-ui-toast-in 0.35s var(--ts-ease-out) both`, `--ts-toast-offset-pos: var(--ts-sp-5)`, `--ts-toast-duration: 4s` (with L141–142 comment marking it as the runtime source of truth read by JS via `getComputedStyle`)
  - **Width/track:** `--ts-toast-min-w: clamp(220px, 50vw, 18rem)`, `--ts-toast-max-w: min(...)`, `--ts-toast-track-h: 7px`, `--ts-toast-track-bg: linear-gradient(90deg, var(--ts-toast-accent), color-mix(var(--ts-toast-accent), #fff 10%), var(--ts-toast-accent))` (Rule 15 — `#fff` literal)
  - **Inside `.ts-ui-toast`** (L232): `--ts-toast-accent: var(--ts-accent)` re-declared.
  - **Inside `.ts-ui-toast.default .ts-ui-toast__track`** (L338): `--ts-toast-current-accent: var(--ts-accent)` — the runtime "currently animated color" token.
  - **In nested ruleset L441–476:** the inversion magic: `--ts-toast-accent: var(--ts-toast-current-accent)` (L447), `--ts-toast-current-accent: currentcolor` (L448) — this is the "currentColor trick" that makes background-image gradients animate by routing through `color` + `currentColor`. See owner note L435–440.
- **Key `--ts-*` tokens referenced (selected):** `--ts-this-bg`/`-border`, `--ts-on-surface-dim`, `--ts-bg-0`/`-0-t` (legacy), `--ts-fs-xs/md/sm`, `--ts-text-primary/secondary/secondary-dim-2`, `--ts-accent`/`-alt`, `--ts-success`/`-warning`/`-danger`, `--ts-shadow-1/3`, `--ts-card-radius`, `--ts-sp-2/3/5`, `--ts-ease-out`/`-in-slow`, `--ts-dur-med`/`-slow`, `--ts-z-toast`, `--ts-border-1`, `--ts-bg-2-t`/`-3`, `--ts-radius-md/full`, `--ts-index-bar-height`, `--ts-icon-pulse`
- **Key classes:** `.ts-toast-container`, `.ts-toast` (+ variants `--success/-warning/-error/-info` and children `__icon/__body/__title/__msg`) — LEGACY block. Then `.ts-ui-toast-stack`, `.ts-ui-toast-display`, `.ts-ui-toast` (+ `--in/-out/.default/-success/-warning/-error/-info`), `.ts-ui-toast__row` (+ `:has(.ts-ui-toast__icon)`), `.ts-ui-toast__title/__msg/__close/__close:hover/__body/__icon` (+ `:after` for vertical separator), `.ts-ui-toast__track` (`.default` and `:not(.default)` branches), `.ts-ui-toast__track--animate`, `.ts-ui-toast-display .ts-ui-toast__track--animate` (paused-until-hover demo variant)
- **Keyframes:** `ts-toast-in` (L32–42, for legacy `.ts-toast`), `ts-ui-toast-in` (L156–166), `ts-ui-toast-out` (L170–175), `ts-ui-toast-load` (L479–491, the track-fill animation).
- **Owner annotations VERBATIM:**
  - L1: `/* ─── §6o  TOAST NOTIFICATIONS ──────────────────────────────────────── */`
  - L8: `/* Offset when offcanvas panel is open */`
  - L87: `/* fro here  is placed the actual toast used on the final version of  the topolskion showcase, the previous code was the old versin of toast and is kept as utilkkitary only  this si the real toast in use */`
  - L93: `/* ── Toast (enhanced) ──────────────────────────────────────────── */`
  - L96–100: `/* #CRAZY_FIX_RULES REFACTOR NOTES AND MUST FIX: - the toast needs  colnfirmation buttons and be sitewide auto-implemented  when toolskin is enabled . no need to set it on a mnanula cvall. thos shopuld replace with js the default alerts and confirmations with itneractiver themed elements. 1- The toast is now set as a one-style   persistent design i improived.  the covnersdion on light asnd dark mode was problematic on legibility.  biut its really   patched.  we need a more consistewnt and  páttern general based designable  implementation wirh the glassy mode,  and other positioning settupts with classesd.  and now the progressbar animation stiopped working.  also, the class with the alert adn error and info mdoes should apply ther accent color to the gradient on the  progressbar tyo make it more coherent.  and also, on the sidebar when the toast are bieng called, the layout is noit the same as it should be, the  ui of the toast lacks title and it looks broken. pleAS EIMPLEMENT IT SOLIDLY. 2- her ei tokenized all the parameters i could to get the bets design posible on this componenty  mnake this same process sive been doing on all the components following the sdame pattern */`
  - L106 (commented-out): `/* --ts-toast-border: color-mix(in srgb, var(--ts-this-bg-border-0), var(--ts-on-surface-dim) var(--ts-this-border-mix)); */`
  - L115, L117, L120: `/* Font side for msg (base font size)*/`, `/* Font side for title (slightly bigger)*/`, `/* Font side for icon (slightly bigger but can be the same)*/`
  - L123: `/* Dimensions of the icon  for width and size and paddign scaling props */`
  - L130 (commented-out): `/*--ts-toast-pad: var(--ts-sp-6);*/`
  - L141–142: `/* Source of truth for auto-dismiss + progress-bar runtime. Override via :root, .ts-ui-toast-stack, or inline --ts-toast-duration on the toast element. JS reads this via getComputedStyle at dispatch. */`
  - L194–209 (commented-out): the entire `.ts-ui-toast-display { position:fixed; … }` block AND a `body:has(.ts-oce-panel.ts-oce--open) .ts-ui-toast-display` offset rule
  - L227–230: `/* @refactor:backdrop-critical */ /* @refactor:glass-dependent */ /* @refactor:needs-solid-fallback */ /* @refactor:token-dependency */` — same structured tag system as the table file
  - L234: `/* CRITICAL REFACTORING: THIS IS THE MAIN NAVIGATION.  rgeardless the glass enabling the component like this both should share thew ame seting and both   should have its owntoggling  backdrop glass  setup with the  opacity glass backdrop effects pairing.  fallback is plain surface backgroun dwith no alpha. currently it has legibility issues ecause of  the alpha but backdrop works good. it snot customizable */`
  - L241: `/* #CRAZY_FIX_RULES: juts fixed the reveal in and out animation, but is precarious... needs better suppoort.  */`
  - L263–264: `/* #CRAZY_FIX_RULES: !!!STILL PENDING ONREFACTOR. ISSUE: the component itself  needs support for button rows and actions.  using the same button component, not custom ones. so inside .ts-ui-toast__body  append and create a conditional block  that holds  as a row flex two buttons  t-btn--sm or ts-btn--xs(create it if it doenst exists, is ust scaling down). two buttons available, one primary other outline. no icons. for confirm actions.  the flexbox ro must be wrap, so the buttons  collapses if responsive requires on component container width. or button text size width length. te actions should be  submittable and effective like the confirm system defaut  andnon UI breaking. the toasts should replace alerts with a gplobal function and this other replacement should be used on  speciic cases to replace the confirm to avoid using the default system notification   warn with buttons.*/`
  - L327–328: `/* #CRAZY_FIX_RULES:  OWNER FIX UPDATE: the track bar animatin now works fluently, and also has a color system functional wit transitions on gradients.  */`
  - L355–356, L359, L372, L384, L391: comments explaining the track architecture
  - L413–414: `/* #CRAZY_FIX_RULES */ /* this was the only way i could find to make a vertical separator minimal style to  design the toast. without breaking it. is a    subtile  vertical line with opacoty thats eparates the  icon from the  msg content. the problem is that i had to make a lot of calc  styles to  achieve the resutl  and thats not ideal. the toast needs to be reimplemented with a proper ui layout row and columns and better flexible design pattern  to hold many differetn  layout and designs using toolskin design system.  and be able to gold a row of buttons. is impossible to debugf or desighn this asset becaseiuye it dismisses and removes form the dom. i have almost no mock to use.  */`
  - L435–440 (the currentColor trick documentation): `/* OWNER FIXES: i managed to make possible the animation work and also assign dynamic  coloring to the gradient of the progressbar usign the color properlty and 2 sub delegation tokens for the object states. this is the only wy to animate background image based gradients... this is certaintly a discovery to add to the records... until now background images werree not animatable. adn nw using the color properlty and the accent token subtokenized, the background gradient aimates perfectly on hover or animation states. in th trac element, the --ts-toast-accent uses a  partial mid value for the variants of toast to hold the currentcolor value from each variant instead o f using direct tokens, as the tokens are not animatable. and currenColor and color properties are. --ts-toast-accent: var(--ts-toast-current-accent); --ts-toast-current-accent: currentcolor; */`
- **Refactor flags:**
  - **Legacy `.ts-toast` block (L1–80)** — owner says it's kept as utility only but it's still parsed and the rules still apply to anything with class `.ts-toast`. Decide: delete or namespace as `.ts-toast--legacy`.
  - **Legacy primitive `--ts-bg-3/-0/-0-t/-2-t`** consumed at L21, L112, L113, L306 — Rule 15.
  - **Hardcoded `#fff`** in `--ts-toast-track-bg` linear-gradient (L146) — Rule 15.
  - **`#CRAZY_FIX_RULES` marker** 4× (L96, L241, L263, L413) — high refactor count.
  - **CSS Property animation via `allow-discrete`** (L350–352, L379–381) is bleeding-edge — `--ts-toast-accent`, `--ts-toast-current-accent`, `--ts-accent` declared as animatable via `transition-property` with `allow-discrete`. Requires `@property` registration to actually interpolate; without it, just swaps at the midpoint. Not registered here — bug.
  - **`backdrop-filter: blur(4px) saturate(3.5)`** (L226) — `@refactor:backdrop-critical` tag at L227–230 acknowledges. `saturate(3.5)` is unusually aggressive.
  - **The currentColor trick (L435–440 + L447–448)** is brilliant and worth documenting as a permanent pattern in the design-tokens-2.0 skill. The lesson: tokens are not animatable, but `color` and `currentColor` are; route gradient color stops through `currentColor` to animate them. Encode as a "Toolskin animatable-gradient pattern".
  - **CSS Nesting at L441–476** — modern. The 4-variant color routing (default/success/warning/error/info → accent/success/warning/danger/accent-alt) is clean.
  - **`background-color: var(--ts-this-bg-border)`** on `.ts-ui-toast__track` (L336, L364) — using border token as background. Semantic mismatch.
  - **`z-index: -1` on `.ts-ui-toast__icon:after`** (L424, L431) — relies on the toast itself having `isolation` or a stacking context; otherwise the separator line will go behind the toast itself.
- **Session 3/4 relationship:** Heavy consumer of `--ts-this-bg`/`-border` derivatives — good. The `--ts-this-bg-mix` and `--ts-this-border-mix` percentage tokens (L108–109) introduce a NEW pattern: "amount of on-surface-dim to mix into the surface for a soft tint". Could be lifted into the surface engine as standard derivative knobs. The currentColor trick is THE most reusable piece of architectural intelligence in this file.
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-toast*`, `.ts-ui-toast*` and `@keyframes ts-ui-toast-in/out/load` are in catalog §4.10 and §4.8. (b) NEW: The currentColor animatable-gradient discovery (L435–440) is a permanent architectural lesson NOT in the catalog and MUST be lifted. The four-tag `@refactor:` system (L227–230) reappears here, confirming it's an emerging convention. The dual-implementation pattern (legacy + new in one file) is undocumented; catalog should flag all such dual-block files. (c) No direct contradictions.

---

### ui-kit-spinner+sortable+draggable+enhancednumberinput.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/ui-kit-spinner+sortable+draggable+enhancednumberinput.css`
- **Lines:** 517  ·  **Bytes:** 16,825
- **Block type:** Four-in-one multi-component blob: `.ts-ui-spinner` (numeric input + chevron controls), `.ts-ui-draggable--dragging` + `.ts-ui-resizable` (drag/resize utilities), `.ts-ui-sortable` (FLIP-ready drag-to-reorder list — the bulk of the file), `.ts-ui-number-input-wrapper` (duplicate spinner system).
- **Key `--ts-*` tokens declared:**
  - **`:root` block (L105–133)** for sortable:
    - **Core dimensions:** `--ts-ui-sortable-item-h: 50px`, `-item-pad-x: calc(*.5)`, `-item-pad-y: calc(pad-x *.78)`, `-item-pad`, `-item-gap: calc(pad-y *.54)`, `-item-rad: var(--ts-input-radius)`, `-item-spacing: calc(gap *.7)`
    - **Type:** `--ts-ui-sortable-item-fs: calc(item-h * .24444)`
    - **Handle:** `--ts-ui-sortable-handle-icon: calc(item-fs * 1.4)`, `-border: var(--ts-this-bg-border)`, `-border-active: var(--ts-this-bg-focus-outline)`, `--ts-this-bg-border-hover: var(--ts-ui-sortable-border-active)` (re-assigns a system-tier token from inside a component scope — flag), `-bg-hover: var(--ts-bg-4)` (Rule 15)
    - **Handle bg:** `--ts-ui-sortable-handle-bg: var(--ts-bg-3)` (Rule 15), `-card-bg: var(--ts-bg-2)` (Rule 15)
    - **Displacement:** `--ts-ui-sortable-displace-duration: 200ms`, `-displace-ease: cubic-bezier(0.2, 0, 0, 1)` (hardcoded bezier — should reference `--ts-ease-*`)
  - **Inside `.ts-ui-sortable__item`** (L162–164): `--ts-input-h: 50px !important`, `--ts-input-pad-x: var(--ts-ui-sortable-item-pad) !important`, `--ts-this-bg: var(--ts-ui-sortable-handle-bg)` — surface override.
  - **Inside `.ts-ui-sortable__ghost`** (L325–330): `--ts-ui-sortable-item-h: 58px` (overrides root), `--ts-ui-sortable-title-icon`, `-title-icon-hov`, `--ts-this-bg: var(--ts-ui-sortable-card-bg)` — surface override on the ghost element.
- **Key `--ts-*` tokens referenced:** `--ts-radius-md`, `--ts-border-1`, `--ts-bg-1/-2/-3/-4` (legacy), `--ts-text-primary/secondary/muted`, `--ts-fs-sm`, `--ts-dur-fast`, `--ts-shadow-1/3`, `--ts-this-bg/-border/-border-hover/-focus-outline/-dim/-dim-2/-dim-3/-dim-4/-grad`, `--ts-accent/-bright/-bright-2/-border/-dim/-dim-3`, `--ts-on-accent`, `--ts-input-radius/-gap`, `--ts-ease-out`
- **Key classes:** `.ts-ui-spinner` (+ `input[type='number']`, `::-webkit-outer-spin-button`, `::-webkit-inner-spin-button`, `__controls/__dec/__inc`, `__dec+__inc/__inc+__dec`), `.ts-ui-draggable--dragging`, `.ts-ui-resizable` (+ `__handle/:hover`), `.ts-ui-sortable` + `__item` (idle/hover/active/dragging/source/ghost/placeholder) + `--sorting` state class + `[data-ts-ui-sort-handle-only]` mode + `__handle` + `__title` + `__placeholder`, `.ts-ui-number-input-wrapper` (+ input + spin-buttons + controls + `__btn`)
- **Keyframes:** none.
- **Owner annotations VERBATIM:**
  - L2: `/* ── Spinner (input + stacked chevrons on the right, YSS-style) ─── */`
  - L69: `/* ── Draggable / Resizable ───────────────────────────────────────── */`
  - L99: `/* ── Sortable ───────── */`
  - L101–103: `/* ── Tokens ── Naming: --ts-ui-sortable-{part}-{property} Parts: item, handle, title, drag, placeholder */`
  - L107: `/* ─ Core dimensions ─ */`
  - L116: `/* ─ Typography ─ */`
  - L119: `/* ─ Handle ─ */`
  - L129: `/* ─ Displacement animation ─ */`
  - L135: `/* ── List reset ── */`
  - L144–146: `/* ── Sortable Item ── States: idle → hover → active (mousedown) → dragging (in flight) Uses --ts-this-bg cascade for theme-adaptive backgrounds. */`
  - L171: `/* ─ First child: kill top margin to prevent gap doubling ─ */`
  - L177–179: `/* ─ Displacement transition on siblings while sorting is active ─ JS adds .ts-ui-sortable--sorting to the container on pointerdown. transform is the primary FLIP vehicle (GPU-composited, no reflow). */`
  - L188: `/* Hover: brighten + subtle border highlight */`
  - L198: `/* Active (mousedown): accent border flash — signals "I'm grabbed" */`
  - L208: `/* ── Handle-only mode ── */`
  - L230: `/* ── Handle (shared base) ── */`
  - L257: `/* Handle hover: accent tint signals "drag from here" */`
  - L276: `/* ── Dragging state: visual lift ── */`
  - L296: `/* Source: fully collapsed via CSS — JS no longer needs inline style overrides */`
  - L312: `/* Ghost clone: visual lift with accent glow */`
  - L334: `/* Drop target placeholder: dashed accent outline */`
  - L350: `/* ── Title strip ── */`
  - L456: `/* ── Number input auto-wrap (chevrons) ─────────────────────────── */`
- **Refactor flags:**
  - **Two parallel spinner implementations** — `.ts-ui-spinner` (L3–67) and `.ts-ui-number-input-wrapper` (L457–517) are functionally identical (numeric input + stacked +/- chevrons). Pick one and delete the other.
  - **Heavy `!important`** on sortable item — L149–161 has 8 `!important`s, hover/active states add more. The `--ts-input-h: 50px !important` (L162) is particularly aggressive because it changes a SYSTEM-tier token from inside a component, fighting against any sibling input.
  - **Legacy primitives** `--ts-bg-1/-2/-3/-4` consumed at L12, L50, L61, L124, L126, L127, L194, L467, L503, L512 — multiple Rule 15 violations.
  - **Local `--ts-this-bg-border-hover` reassignment** (L123, L191, L263, L416) — a component declares ITS handle border as `--ts-this-bg-border-hover` AND reassigns the system token to its own value. Breaks the system contract: any other consumer of `--ts-this-bg-border-hover` within the sortable scope gets the sortable's value, not the surface's.
  - **`transform: scale(1.02), translateZ(0)`** at L290 — **INVALID syntax**: comma inside `transform` is wrong; should be space-separated. Currently the entire transform is silently invalid, dragging item won't scale. Bug.
  - **`--ts-ui-sortable-displace-ease: cubic-bezier(0.2, 0, 0, 1)`** (L131) — hardcoded bezier; should reference `--ts-ease-snap` or similar.
  - **`--ts-ui-sortable-item-fs: calc(... * .24444)`** (L117) — magic number `.24444`; almost certainly a "ratio that worked" without rationale. Should document or tokenize.
  - **`flex: 0 1` (no third arg)** at L364 — defaults to `flex-basis: 0%`. Probably fine but worth verifying intent.
  - **`backdrop-filter` not present** here (unlike toast/table) but `box-shadow: 0 0 24px color-mix(...)` glow patterns at L289, L316, L398, L407 are heavy.
- **Session 3/4 relationship:** Consumes `--ts-this-bg` derivatives correctly (L155, L158, L190, L194, L200, L222) BUT seeds the chain from legacy `--ts-bg-N` (L124, L126, L127). The handle-bg overrides via `--ts-ui-sortable-handle-bg`/`-card-bg` reflect a pattern: declare a component-tier surface token that maps to a legacy primitive today, then swap that mapping when surfaces.css matures. Useful pattern; document as "indirection layer for legacy migration".
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-ui-sortable*`, `.ts-ui-spinner*`, `.ts-ui-number-input*` families are in catalog §4.10. (b) NEW: the invalid `transform: scale(1.02), translateZ(0)` syntax at L290 is a real bug. The dual spinner implementation is undocumented. The `--ts-this-bg-border-hover` reassignment from component scope is an architecture violation pattern that may exist in other files. (c) No direct contradictions.

---

### ts-ui-accordion-component.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/ts-ui-accordion-component.css`
- **Lines:** 449  ·  **Bytes:** 17,141
- **Block type:** Leaf component — `.ts-ui-accordion` (+ `.ts-accordion` alias) with variants `--separated`, `--dual-icon`, `--toggle-plus` and a comprehensive token system for header/panel/toggle/indicator/icon dimensions and colors. Uses `:has()`, `[aria-expanded]`, modern `allow-discrete` transitions for entrance/exit animation.
- **Key `--ts-*` tokens declared:**
  - **`:root` block (L15–23)** — for ts-ui-control (checkbox/radio defaults):
    - `--ts-ui-control-size: 1.125rem`, `-mark-inset: 22%`, `-checkbox-mark: polygon(...)` (SVG-like polygon for the check), `-mark-size: 0.5rem`, `-mark-color: var(--ts-accent)`, `-mark-bg: var(--ts-accent-dim)`
  - **Inside `.ts-ui-accordion, .ts-ui-accordion--separated, .ts-ui-accordion--dual-icon, .ts-accordion`** (L29–83) — massive token kit (~40 tokens):
    - **Header dimensions:** `--ts-ui-accordion-header-min-h` declared TWICE (L30: `var(--ts-input-h)`, L31: `50px` — second wins; hardcoded), `-pad-y: calc(pad-x*.78)`, `-pad-x: calc(min-h*.5)`, `-pad`, `-gap`, `-fs: calc(panel-fs*1.1)`
    - **Header colors:** `-bg: var(--ts-this-bg-dim)`, `-bg-hover: var(--ts-this-bg-dark-1)`, `-bg-active: var(--ts-this-bg-dark)` then immediately reassigned to `var(--ts-ui-accordion-header-bg-hover)` (L41 — overrides L39 dead).
    - **Header text:** `-color: var(--ts-text-secondary)`, `-color-hover: var(--ts-text-primary)`
    - **Panel:** `-panel-pad: var(--ts-ui-accordion-header-pad-x)`, two `--ts-ui-accordion-panel-fs` declarations (L45 derived from min-h, L46 `var(--ts-fs-body-sm)` — second wins), two `-panel-lh` declarations (L48 `1.45`, L49 derived from fs — second wins), `-panel-color: var(--ts-text-primary-dim-2)`, two `-gap` declarations (L51 `var(--ts-sp-2)`, L52 derived — second wins), `-panel-bg: var(--ts-this-bg)`
    - **Toggle indicator (plus/minus button):** `-toggle-color/-color-hover/-bg/-bg-hover`, two `-toggle-border` declarations (L58: `var(--ts-this-bg-border)`, L59: `var(--ts-border-2)` — second wins, Rule 15), `-toggle-rad: var(--ts-radius-md)`, `-toggle-pad: 1px`, `-toggle-stroke: 1px`, `-toggle-stroke-l: 1rem`, `-toggle-btn-h: 1.25rem`
    - **Chevron:** `--ts-accordion-toggle-chevron-size` declared THREE TIMES (L62: `0.5rem`, L63: calc derived from min-h, L64: calc derived from icon-size — third wins; the only one that's tier-architected)
    - **Arrow:** `-arrow-color: var(--ts-ui-accordion-panel-color)`, `-arrow-color-hover: var(--ts-accent)`, `-arrow-w: var(--ts-ui-accordion-toggle-stroke)`
    - **Icon:** `-icon-base: var(--ts-ui-accordion-header-fs)`, `-icon-grow: 1.1`, `-icon-size: calc(base*grow)`
    - **Chevron offsets:** `-chevron-offset/-offset-2` (calc derived)
    - **Category (dual-icon) variant:** `-category-icon-size`, `-category-gap`
    - **Surface seed:** `--ts-this-bg: var(--ts-bg-2-t)` (L81 — Rule 15)
  - **Inside `.ts-ui-accordion--dual-icon`** (L212–215): `-category-sep-width/-height/-header-radius`.
  - **Inside `.ts-ui-accordion__indicator`** (L329–330): `--ts-ui-accordion-toggle-bg: transparent`, `-toggle-bg-hover: transparent` — local override.
- **Key `--ts-*` tokens referenced:** `--ts-input-h`, `--ts-this-bg`/`-dim`/`-dark`/`-dark-1`/`-border`, `--ts-text-secondary/-primary/-primary-dim-2/-muted`, `--ts-fs-body-sm`, `--ts-sp-2`, `--ts-bg-2-t` (legacy), `--ts-border-2`, `--ts-radius-md`, `--ts-accent`, `--ts-accent-dim`, `--ts-dur-base/-slow/-slower/-fast`, `--ts-ease-out`, `--ts-panel-ease-in/-out`
- **Key classes:** `.ts-ui-accordion`/`.ts-accordion` (+ `--separated`/`--dual-icon`/`--toggle-plus` variants), `__item`, `__header` (+ `[aria-expanded="true"]`, `:hover`, `--active`, `:not(:has(__category-icon))`), `__header-main`, `__icon`, `__category-icon` (dual-icon only), `__category-sep`, `__header::after` (chevron) / `__indicator` (plus/minus, with `::before`/`::after` for the cross-bars), `__panel` (+ `[hidden]`), `__panel *` (revert-layer trick at L424–433)
- **Keyframes:** none.
- **Owner annotations VERBATIM:**
  - L2: `/* ═══ MERGED BLOCK: toolskin-uikit.css (source: assets/css/toolskin-uikit.css) ═══ */`
  - L4–12 (PROVENANCE comment): `/*! * Toolskin UI Kit — companion to toolskin-uikit.js * Uses design tokens (--ts-*) from toolskin.css; prefix ts-ui-* (no collisions with core). * Naming: *   - ts-ui-* : UI kit components (accordion, table, masonry, …) *   - ts-*      : Core-friendly aliases for form controls (checkbox/radio/groups) — mirror ts-ui-control-* where noted. * Aliases: .ts-accordion ↓ .ts-ui-accordion; .ts-checkbox/.ts-radio wrappers ↓ .ts-ui-control--checkbox/--radio inputs. * Scrollbar: <html> gets .ts-env-moz in Firefox only; .ts-ui-scrollbar--moz rules apply there so Chromium keeps ::-webkit-scrollbar. */`
  - L14: `/* Defaults so native checkbox/radio inputs keep size even without a wrapper (inherits from :root). */`
  - L25: `/* ── Accordion ─────── */`
  - L107 (commented-out): `/* box-shadow: 0 1px 2px color-mix(in srgb, var(--ts-border-1), transparent 55%); */`
  - L208: `/* Dual icon: category column + separator + header-main (item icon + label) */`
  - L279: `/* Chevron (default): not when using plus/minus indicator */`
  - L307: `/* Plus / minus (CSS lines) */`
- **Refactor flags:**
  - **Multi-declared tokens** (`-header-min-h`, `-panel-fs`, `-panel-lh`, `-gap`, `-toggle-border`, `-chevron-size`) — same "first declaration is intent, second/third is what's actually used" anti-pattern as marquee/tooltips. Each set needs a council pass to pick one.
  - **`.ts-accordion__heade[aria-expanded="true"]`** at L139 — **TYPO**: missing `r` (`__heade` not `__header`). The selector is invalid for the aliased class. Bug.
  - **`backgroun-color`** at L358 — **TYPO** in transition-property list (`backgroun-color` not `background-color`). The transition skips background-color silently.
  - **`color: revert-layer !important`** inside `__panel *` (L427) — uses CSS Cascade Layers feature to revert all panel-child colors. Modern (Chrome 99+, Safari 15.4+). Owner intent: panel content keeps its own colors regardless of accordion theming. Document this as a deliberate escape hatch.
  - **`font-weight: revert-layer !important`** (L429) and `font-size: var(--ts-ui-accordion-panel-fs)` (L428) — interesting mix: font-weight reverts, font-size hard-locks. Inconsistent but intentional.
  - **`overflow: hidden`** with `max-height: 4000px` (L411) for the open panel — magic number 4000px ceiling. Any panel taller than 4000px is silently clipped. Use `max-height: none` or token.
  - **`transition: max-height var(--ts-dur-base) var(--ts-panel-ease-in) allow-discrete, padding-block ... allow-discrete, opacity ... allow-discrete, display ... .12s allow-discrete`** (L405–408) — modern `allow-discrete` for the panel collapse animation. Requires `@property` for max-height/padding-block to actually interpolate; otherwise discrete swap. Not registered — likely jumps, doesn't smooth.
  - **`--ts-this-bg: var(--ts-bg-2-t)`** (L81) — Rule 15.
  - **`border: 1px solid var(--ts-ui-accordion-toggle-border)` declared 2× on `--separated__item`** (once in base L78, once in `.ts-ui-accordion--separated .ts-ui-accordion__item` L104) — fine since the second narrows.
  - **`!important` on hover** (L159–161) and on `position: relative` (L133, L258) and `outline: none` (L135, L260) — pattern: to override third-party reset stylesheets like Normalize. Document.
- **Session 3/4 relationship:** Heavy consumer of `--ts-this-bg-dim`/`-dark`/`-dark-1`/`-border` derivatives — verify ALL of these are exposed by `surfaces.css`. `-dim` and `-dark` aren't standard derivative names (compared to `-dim-N` numbered series). Might be aliases or might be missing. The `revert-layer` pattern at L424–433 is a clever escape hatch worth documenting in the design-tokens-2.0 skill for "components that host arbitrary content".
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-ui-accordion*` family is in catalog §4.10. (b) NEW: the L139 typo (`__heade`), the L358 typo (`backgroun-color`), the `revert-layer` cascade-layer usage, the unregistered `@property` for `allow-discrete` transitions, and the `4000px` max-height ceiling are all undocumented. The provenance comment (L2 "MERGED BLOCK: toolskin-uikit.css") is useful history. (c) No direct contradictions.

---

### custom-cursor-component.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/custom-cursor-component.css`
- **Lines:** 392  ·  **Bytes:** 17,285
- **Block type:** Special component with a documented performance contract. Two modes: §11.1 SVG-data-URL crosshair (pure CSS, no DOM, no JS) and §11.2 `.custom-cursor` DOM element followed by JS lerp (CSS owns appearance, JS owns position). Includes inline `@todo` markers for next-pass shape registry (§11.3).
- **Key `--ts-*` tokens declared:**
  - **Inside `.custom-cursor`** (L86–89): `--cursor-offset: 50% + var(--ts-cursor-size)` (note: NO `--ts-` prefix — local), `--cursor-offset-n: calc(--cursor-offset * -1)` (local), `--ts-z-cursor: var(--ts-z-offcanvas-panel)`, `--ts-cursor-transition-dur: .3s`
- **Key `--ts-*` tokens referenced:** `--ts-cursor-color` w/ fallback `var(--ts-accent)` (L96, L168, L214, L233, L251, L272, L280) — primary fill/stroke, `--ts-cursor-size` (L86, L93–94, L100, L166–167, L170, L211–212, L230–231, L322), `--ts-cursor-grow` (L211, L230), `--ts-cursor-arrow-size` (L262–263, L272–273, L280–281), `--ts-cursor-follower-dur` (L189–192), `--ts-z-offcanvas-panel`, `--ts-ease-out`, `--ts-on-accent` (L304), `--ts-on-surface-muted` (L308), `--ts-sp-2/-4` (L309), `--ts-radius-full` (L310), `--ts-accent` (L351 — fallback for the empty-label crosshair bars)
- **Key classes/selectors:** `body.has-ts-cursor` (+ `:where(*)`), `[data-theme="light"] body.has-ts-cursor`, `body.has-ts-cursor a:hover`/`button:hover`/`.ts-btn:hover`/`[role="button"]:hover`/`input:hover`/`select:hover`/`textarea:hover`/`[data-cursor]:hover`, light-theme hover variant, `.custom-cursor` (+ `.cursor--no-follower`/`.cursor--simple`/`.cursor--tooltip` modes), `.custom-cursor.active`, `.custom-cursor::before` (follower), `.custom-cursor::after` (tooltip arrow), `.custom-cursor.cursor--tooltip.active[data-pointer-direction="up"|"down"]`, `.custom-cursor.cursor--tooltip::after`, `.custom-cursor .cursor-inner`, `.custom-cursor .cursor-label` (+ `:empty::before/::after`), `[data-theme="light"] .custom-cursor:not(.active)` (filter:invert).
- **Keyframes:** none.
- **At-rules:** `@starting-style` (L331–334) inside `.custom-cursor.active .cursor-label` — modern view-transitions/discrete-animation initial state declaration. Chrome 117+, Safari 17.4+.
- **Owner annotations VERBATIM:**
  - L2–15 (§11.1 + multiple `@todo` markers): `/* ─── §11.1  SVG Crosshair Cursor (native, adaptive color) ──────────── Lightweight 1px "+" cursor. No element, no JS, just a `cursor:` URL. Filled rects (not strokes) avoid AA halos at sub-pixel positions. Idle 21×21, hover 31×31 with accent. @todo @cursor-tag:hairline-only — when standalone hairline mode lands, body.has-ts-cursor.cursor--hairline-only should suppress .custom-cursor rendering entirely and rely solely on §11.1. @todo @cursor-tag:tokenize-controls — colors and sizes are inlined in the data-URL strings. Lift into tokens once we figure out a reasonable encoding (CSS doesn't allow var() inside data URLs; options: build the SVG via JS once, or ship size/color presets via class modifiers like .cursor--size-sm / .cursor--accent-warn). ──────────────────────────────────────────────────────────────────── */`
  - L17–19: `/* Default crosshair — 21×21 :where(*) ensures children inherit the crosshair even when they have cursor:pointer — zero specificity so hover accent rules still override. */`
  - L26: `/* Light theme — dark crosshair 21×21 */`
  - L33: `/* Hover: accent crosshair — 31×31 (physically larger lines) */`
  - L46–47: `/* Light theme hover: accent crosshair — 31×31 Same accent as dark; orange reads on both backgrounds. */`
  - L61–81 (§11.2 PERFORMANCE CONTRACT — critical engineering doc): `/* ═══════════════════════════════════════════════════════════════════════ §11.2  CUSTOM CURSOR ELEMENT ─────────────────────────────────────────────────────────────────────── A real DOM element follows the pointer. JS owns position (lerp on rAF); CSS owns appearance, hover state, and the discrete transitions on properties that change rarely (size, opacity, color). PERFORMANCE CONTRACT (do not violate):   • CSS NEVER transitions `transform` or `translate` on this element. Position is driven by JS at 60Hz; layering a CSS transition on top creates a feedback loop that never settles.   • JS lerp must stop its rAF when the cursor settles within ~0.1px of the target. Idle cursor = zero per-frame work.   • `will-change: transform` reserves a GPU layer to keep paints off the main thread. Applied once on parent, NOT also on ::before.   • `contain: layout paint` isolates this element's repaints from the document — cheap and high-leverage. @todo @cursor-tag:perf-audit — verify in DevTools Performance panel that idle cursor produces 0 paints/frame and 0 rAF callbacks. ═══════════════════════════════════════════════════════════════════════ */`
  - L83: `/* ─── Base cursor (shared by SIMPLE + TOOLTIP modes) ────────────────── */`
  - L85 (commented-out): `/* --follower-transform: translate3d(0px, 0px, 0); */`
  - L104–105: `/* @perf — JS writes `transform` every frame. Do NOT put `transform` in the transition list below. */`
  - L110–113: `/* @perf-history: mix-blend-mode: difference removed — extremely expensive GPU compositing every frame. Opacity-based contrast via filter:invert in light mode is also costly (see @todo below) but only applies in idle state. */`
  - L114 (commented-out): `/* mix-blend-mode: difference; */`
  - L116–117: `/* Only properties that change rarely (hover state in/out, theme swap) belong in this transition list. Transform/translate are JS-owned. */`
  - L124–125: `/* @perf — paint isolation. The cursor's repaints don't invalidate the document below it. */`
  - L130–131: `/* @todo @cursor-tag:isolation — `isolation: isolate` removed; we already have z-index, the new stacking context was redundant. */`
  - L134–137: `/* @todo @cursor-tag:light-theme-cost — `filter: invert(100%)` triggers a separate composite layer and a paint per state change. Replace with a token swap: define --ts-cursor-color light/dark per theme, delete the filter rules. Same visual, fraction of the cost. */`
  - L157–160: `/* ─── Follower (::before) ────────────────────────────────────────────── Soft-trail dot. Optional; opt out with `.cursor--no-follower`. Position driven by --follower-transform (JS lerp). ──────────────────────────────────────────────────────────────────── */`
  - L173–175: `/* Two translates split across `translate` (centering, static) and `transform` (JS-driven lerp). Cleaner than chaining two translates inside one transform. */`
  - L182–187: `/* @perf — Transform is updated every frame by JS lerp. CSS transitioning it too creates a feedback loop: JS sets new target, CSS interpolates, JS sets newer target before CSS finishes, repeat forever. Easing is JS-side (the lerp factor IS the easing). CSS only transitions the visual properties that change on hover/active state, not per-frame. */`
  - L194–196: `/* @perf — only one will-change layer needed for the cursor. The parent already owns the GPU layer; ::before composites within it. Removed from here. */`
  - L199: `/* No-follower opt-out */`
  - L206–209: `/* ─── §11.2.A  SIMPLE MODE (.cursor--simple) ────────────────────────── Circle at center. Filled idle, outlined on hover. Optional follower. No label, no arrow, no smart positioning. ──────────────────────────────────────────────────────────────────── */`
  - L219: `/* Follower fades out on active in simple mode */`
  - L225–228: `/* ─── §11.2.B  TOOLTIP MODE (.cursor--tooltip) ──────────────────────── Full-featured: label, directional arrow, smart positioning. Follower collapses (width/height 0) on active so the label dominates. ──────────────────────────────────────────────────────────────────── */`
  - L256: `/* ─── §11.2.C  Pointer arrow (::after) — tooltip mode only ──────────── */`
  - L288: `/* ─── §11.2.D  Inner helper element ─────────────────────────────────── */`
  - L302: `/* ─── §11.2.E  Label (tooltip mode only) ────────────────────────────── */`
  - L337: `/* Empty label shows crosshair lines — visual fallback for unlabeled active state */`
  - L356–391 (§11.3 SHAPE REGISTRY — TODO spec for next refactor pass, includes full proposed token surface for cursor): see file for full text — proposes 8 shape modifier classes (`circle/hairline/text/resize-h/-v/-d/grab/grabbing`) and a complete `--ts-cursor-*` token surface (`-size/-grow/-color/-color-light/-transition-dur/-follower-dur/-arrow-size/-hairline-size/-hairline-grow-size/-hairline-stroke/-shape`).
- **Refactor flags:**
  - **Hardcoded rgba colors inside data-URL SVG cursors** (L22, L29, L42, L56) — `rgba(255,255,255,0.85)`, `rgba(0,0,0,0.65)`, `rgba(255,100,50,1)` — Rule 15 violations. Owner explicitly acknowledges at L10–14 that this is the known constraint (CSS doesn't allow `var()` inside data URLs) and proposes either JS-built SVG or class-modifier presets. Best-in-chunk example of a constraint-driven Rule 15 violation with a documented mitigation plan.
  - **`mix-blend-mode: difference`** on `.custom-cursor:not(.active)` (L148) and `::before` (L153) — owner removed from base (L110–113 history note) but kept on the non-active state. Performance cost reduced but still applies during idle. Owner's `@todo @cursor-tag:light-theme-cost` (L134–137) flags the related `filter: invert(100%)` cost. Both should be tokenized away in the cursor refactor.
  - **`--cursor-offset` / `--cursor-offset-n` use non-`--ts-` namespace** (L86–87) — local variables but break the namespace contract. Should be `--ts-cursor-offset`/`-offset-n` or moved into `:root` with `--ts-` prefix.
  - **`--cursor-offset: 50% + var(--ts-cursor-size)`** at L86 — INVALID CSS: `50% + var(...)` outside `calc()` is invalid; CSS parser drops the value. The `--cursor-offset-n: calc(var(--cursor-offset)*-1)` at L87 then computes against an invalid input — undefined behavior. Real bug. Should be `--cursor-offset: calc(50% + var(--ts-cursor-size))`.
  - **`font-size: round(calc(var(--ts-cursor-size) / 2), 10px)`** (L305) — uses `round()` math function (CSS Values 4). Chrome 125+, Safari 18.4+. No fallback.
  - **`@starting-style`** (L331–334) — modern progressive enhancement; degrades to no entrance animation on unsupported browsers. Fine.
  - **`scale: 0` standalone property** (L319, L334) — CSS Transforms Module L2 (not `transform: scale(0)`). Chrome 104+, Safari 14.1+. Fine for 2026.
  - **`transition: opacity 0.5s, scale 0.5s .23s allow-discrete, display 0.5s allow-discrete`** (L321) — uses `allow-discrete` for `display`. Requires `display: none` ↔ `display: flex` swap to actually animate; `@starting-style` companion is at L331–334. Good modern pattern.
  - **The §11.3 TODO at L356–391** is a complete refactor spec — should be lifted into the rebuild's cursor component spec verbatim.
- **Session 3/4 relationship:** Mostly self-contained except for `--ts-accent`/`--ts-on-accent`/`--ts-z-offcanvas-panel`/`--ts-on-surface-muted` consumption. Decoupled from the surface chain (no `--ts-this-bg-*` references). Good architecture — cursor sits ABOVE the surface system. The performance contract (L61–81) and the `@perf` / `@perf-history` annotation conventions are valuable engineering culture artifacts and should be preserved as a permanent reference for how to author GPU-cheap CSS+JS hybrid components.
- **Gap vs `_code-audit-catalog.md`:** (a) `.custom-cursor` is in catalog §4.10. (b) NEW: the entire PERFORMANCE CONTRACT (L61–81), the §11.3 SHAPE REGISTRY spec (L356–391), the `@todo @cursor-tag:*` structured tag system, and the `@perf-history` annotation about removing `mix-blend-mode: difference` are all engineering intelligence that MUST be lifted into a permanent skill or the cursor component spec. The invalid `--cursor-offset` formula at L86 is a real bug. (c) No direct contradictions.

---

## Annotation index

### Section header markers (§ numbering)
- log-component.css:L2 `§6m LOG / TERMINAL BLOCK`; L65 `§6n PROGRESS BAR`
- hero-section.css:L2 `§8a Hero Section`
- toast+ts-ui-toast-component.css:L1 `§6o TOAST NOTIFICATIONS`
- ts-btn-component(basic-ref).css:L2 `§6a BUTTONS`
- ts-gallery-component+lightbox.css: §1 (component tokens) / §2 (container) / §3 (items) / §4 (size modifiers) / §5 (media layer) / §6 (hover + caption) / §7 (uniform variant) / §8 (sortable variant) / §9 (responsive) / §10 (lightbox) / §11 (reduced motion)
- custom-cursor-component.css: §11.1 (SVG crosshair) / §11.2 (cursor element) / §11.2.A (simple mode) / §11.2.B (tooltip mode) / §11.2.C (pointer arrow) / §11.2.D (inner helper) / §11.2.E (label) / §11.3 (shape registry — TODO)

### CRAZY_FIX_RULES markers
- hero-section.css:L57
- header-promobanner.css:L146, L175
- ta-ui-table-component.css:L2
- toast+ts-ui-toast-component.css:L96, L241, L263, L413
- (none in: log, notif-banner, theme-toggle, marquee, tooltips, code-window, btn, gallery, table-other-than-main, spinner-sortable, accordion, cursor)

### CRITICAL / REFACTOR NOTE / OWNER FIX markers (selected)
- marquee-component.css:L21 (OWNER FIXES — pointer-events hack)
- hero-section.css:L38–56 (large REFACTOR NOTES — 5-point hero variant spec)
- ts-ui-select-dropdown-max-height-calc.css:L1–2 (OWNER's FIX + NEW Refactor Note URGENT), L22–23 (NEW REFACTOR NOTE — move dispersed vars)
- header-promobanner.css:L175–203 (Required improvements / Goal block)
- ta-ui-table-component.css:L125 (REFACTOR NOTES — dual sort-arrow conflict)
- ts-btn-component(basic-ref).css:L4–39 (master SmartButton brief), L101–136 (alignment temp fix removal conditions), L176–226 (REFACTOR_NOTES v1 outline-variant token system), L388/L395 (Lush Mode notes)
- toast+ts-ui-toast-component.css:L87 (legacy block kept as utility only), L96–100 (REFACTOR NOTES AND MUST FIX list), L234 (CRITICAL REFACTORING), L263–264 (button-row addition spec), L327–328 (OWNER FIX UPDATE), L414 (vertical separator hack), L435–440 (currentColor trick discovery)
- ts-ui-accordion-component.css:L2 (MERGED BLOCK provenance)
- custom-cursor-component.css:L2–15 (§11.1 + @todo hairline-only/tokenize-controls), L61–81 (PERFORMANCE CONTRACT), L104–105/L110–113/L116–117/L124–125/L130–131/L134–137/L182–187/L194–196 (@perf and @todo comment stream), L356–391 (§11.3 SHAPE REGISTRY TODO with full proposed token surface)

### `@refactor:*` structured machine-readable tags
- ta-ui-table-component.css:L207–210 (`backdrop-critical`, `glass-dependent`, `needs-solid-fallback`, `token-dependency`) — on bulk-bar
- toast+ts-ui-toast-component.css:L227–230 (same four tags) — on toast `backdrop-filter`
- ts-btn-component(basic-ref).css:L101 `@ts-component-consolidate @temporary_alignment_patch`; multiple `/*@ts-smart_button_system*/` and `/*@color_bg_surface_refactor*/`
- custom-cursor-component.css: `@perf`, `@perf-history`, `@todo @cursor-tag:hairline-only`, `@todo @cursor-tag:tokenize-controls`, `@todo @cursor-tag:perf-audit`, `@todo @cursor-tag:isolation`, `@todo @cursor-tag:light-theme-cost`, `@cursor-tag:auto-init`

---

## Cross-chunk synthesis

### Legacy `--ts-bg-N` consumers in this chunk (Rule 15 violations)
- log-component.css:L70 (`--ts-bg-3`); L11 commented-out (`--ts-bg-5`)
- ts-notif-banner-component.css:L40 (`--ts-bg-2` as default surface)
- marquee-component.css:L5 (`--ts-bg-1` dead-code)
- hero-section.css:L16 (`--ts-bg-0`)
- code-window-component.css:L11 (`--ts-bg-1-t`), L12 (`--ts-bg-2-t`), L243 (`--ts-bg-0`), L219 (`--ts-bg-3`)
- ta-ui-table-component.css:L12 (`--ts-bg-0`), L13 (`--ts-bg-1`), L14 (`--ts-bg-2`), L269 (`--ts-bg-0`)
- ts-btn-component(basic-ref).css:L43 (`--ts-bg-3`), L288 (`--ts-bg-1-t`), L389 (`--ts-bg-2-t`), L396 (`--ts-bg-5`)
- ts-gallery-component+lightbox.css:L32+L73 (`--ts-bg-1`), L385 (`--ts-bg-0`)
- toast+ts-ui-toast-component.css:L21 (`--ts-bg-3`), L112 (`--ts-bg-0-t`), L113 (`--ts-bg-0`), L306 (`--ts-bg-2-t`)
- ui-kit-spinner+sortable+draggable+enhancednumberinput.css:L12 (`--ts-bg-1`), L50 (`--ts-bg-2`), L61 (`--ts-bg-3`), L124 (`--ts-bg-4`), L126 (`--ts-bg-3`), L127 (`--ts-bg-2`), L194 (`--ts-bg-4`), L467 (`--ts-bg-1`), L503 (`--ts-bg-2`), L512 (`--ts-bg-3`)
- ts-ui-accordion-component.css:L81 (`--ts-bg-2-t`)
- tooltips-styles.css: indirect — uses hardcoded hex (`#1a1b1e`, `#0c0c0d`, `#e8e9eac9`) for its forced-dark surface instead of `--ts-bg-N`
- hero-section.css badge variants: no `--ts-bg-N` but uses `--ts-accent-dim-2/-3`/`--ts-accent-dark/-2` which are accent-chain derivatives, fine.

**Total files with Rule 15 violations:** 12 of 16. **Files clean:** theme-toggle (foreign-namespaced), ts-ui-select-dropdown-max-height-calc (pure utility), custom-cursor (consumes accent only).

### Hardcoded color literals (hex / rgb / named) in this chunk
- ts-notif-banner-component.css:L40 `#1a1c20`, L41 `#e8eaed`, L50 `#3b82f6`, L51/L56/L66 `#fff`, L55 `#10b981`, L60 `#fbbf24`, L61 `#1a1c20`, L65 `#ef4444` (token defaults)
- tooltips-styles.css:L6 `#1a1b1e`, L8 `#0c0c0d`, L11 `#e8e9eac9`, L54 `#1a1b1e`
- code-window-component.css:L99 `rgb(239, 68, 68)`, L104 `rgb(234, 179, 8)`, L109 `rgb(34, 197, 94)`, L100/L105/L110 `rgb(229, 231, 235)` borders, L137–139 `#ef4444/#22c55e/#eab308`
- header-promobanner.css:L39/L41 `rgba(255,255,255,0.04)`, L59 `rgba(0,0,0,0.32)`, L91 `rgba(0,0,0,0.35)`, L109/L136 `black`
- log-component.css:L95–96 `#fff` in stripe pattern
- ts-btn-component(basic-ref).css:L232/L252/L330/L336/L342 `#fff`
- toast+ts-ui-toast-component.css:L146 `#fff` in track gradient
- custom-cursor-component.css:L22/L29/L42/L56 `rgba(255,255,255,0.85)` / `rgba(0,0,0,0.65)` / `rgba(255,100,50,1)` inside data-URL SVG (constraint-driven, documented mitigation)
- ta-ui-table-component.css:L211 `rgba(0,0,0,0.21)`

### Files that touch `--ts-this-bg` derivatives correctly (GOOD specimens to preserve)
- **ts-notif-banner-component.css** — canonical inversion engine (`--ts-this-bg-inverse`/`--ts-this-fg-inverse`)
- **ts-gallery-component+lightbox.css** — explicit three-tier architecture, uses `--ts-this-bg-border`/`-bright`/`-hover`
- **ts-btn-component(basic-ref).css** — `--ts-this-bg-active/-border/-border-active/-border-hover/-dim/-dim-4/-dim-6/-grad/-grad-2/-grad-3` (most extensive derivative consumption in chunk)
- **ts-ui-accordion-component.css** — `-dim/-dark/-dark-1/-border` (verify these derivative names exist in surfaces.css)
- **toast+ts-ui-toast-component.css** — `-border`, plus introduces `--ts-this-bg-mix`/`-border-mix` percentage tokens (new pattern)
- **code-window-component.css** — `-dim-3/-dim-4`
- **ta-ui-table-component.css** — `-dim-2/-dim-4` on selected rows
- **ui-kit-spinner+sortable+draggable+enhancednumberinput.css** — `-border/-border-hover/-focus-outline/-dim/-dim-2/-dim-3/-dim-4/-grad`

### Files using CSS Nesting (`&` or nested selectors)
- ts-notif-banner-component.css:L49/L54/L59/L64/L70 (`&.ts-banner--info` etc + child auto-inversion)
- ts-btn-component(basic-ref).css:L93–137/L139–153 (nested `.ts-icon` and `span:not(...)`)
- toast+ts-ui-toast-component.css:L441–476 (nested variant routing)
- ts-ui-accordion-component.css:L197–206 (nested `__icon` inside `__header--active`)

### Files using modern features (2024–2026)
- **Container queries:** ts-gallery-component (`@container ts-gallery (max-width: …)`)
- **`@supports (anchor-name: ...)`**: ts-ui-select-dropdown-max-height-calc (progressive enhancement)
- **`allow-discrete` transitions:** toast (L350–352, L379–381), accordion (L405–408, L444–447), custom-cursor (L321)
- **`@starting-style`:** custom-cursor (L331–334)
- **`revert-layer`:** accordion (L427, L429)
- **`round()` math:** custom-cursor (L305)
- **`d:path()` SVG path transition:** theme-toggle (L37–60)
- **`:has()`:** hero (L22), header-promobanner (L147, L154, L158, L164), accordion (L146, L221, L258, L351, L398, L403, L414), gallery (none — uses `>`)
- **`text-wrap: pretty`:** tooltips (L75, L143, L164, L169)

### Real bugs surfaced in this chunk (silent rendering / parser failures)
1. `code-window-component.css:L7` — invalid `var(a, var(b), var(c))` 3-arg syntax; middle fallback silently ignored.
2. `tooltips-styles.css:L39` — `line-height: vr(--ts-tooltip-line-height)` typo (`vr` not `var`); invalid declaration.
3. `tooltips-styles.css:L195` — `margin: var(--ts-index-bar-height) 3px 20px` on tooltip lists — wrong token reference.
4. `hero-section.css:L86` — `clamp(285px, 90vw, 200px)` invalid clamp (max < min).
5. `hero-section.css:L72` — unscoped `canvas` selector bleeds globally.
6. `log-component.css:L106` — `--ts-modal-gap--ts-sp-2` malformed token name; effective margin = 0.
7. `ui-kit-spinner+sortable…css:L290` — `transform: scale(1.02), translateZ(0)` invalid comma syntax; dragging item won't scale.
8. `ts-ui-accordion-component.css:L139` — `.ts-accordion__heade[aria-expanded="true"]` typo selector (missing `r`).
9. `ts-ui-accordion-component.css:L358` — `backgroun-color` typo in transition-property list.
10. `custom-cursor-component.css:L86` — `--cursor-offset: 50% + var(--ts-cursor-size)` missing `calc()`; value silently invalid.
11. `theme-toggle-switch-animation-component.css:L82` — `.theme-toggle-sr { display: none }` defeats sr-only pattern at L73–81; a11y regression.

### NEW design intelligence to lift into permanent skill references
1. **ts-notif-banner inversion engine** (4-token contract: `--ts-this-bg-surface`/`--ts-this-surface-text`/`--ts-this-bg-inverse`/`--ts-this-fg-inverse`) → lift into design-tokens-2.0 skill as the canonical color-inversion pattern.
2. **ts-gallery three-tier architecture comment (L4–24)** → lift verbatim as the canonical three-tier example.
3. **ts-btn SmartButton master brief (L4–39) + REFACTOR_NOTES v1 (L176–226) + alignment temp fix removal conditions (L101–136)** → lift into rebuild's button spec.
4. **ts-ui-select dropdown v3 "declare knobs AND formula in each context" pattern (L4–19)** → lift into design-tokens-2.0 as a known cascade-short-circuit workaround.
5. **toast currentColor animatable-gradient trick (L435–440)** → lift as a permanent pattern: route gradient color stops through `currentColor` to enable animation.
6. **custom-cursor PERFORMANCE CONTRACT (L61–81) + §11.3 SHAPE REGISTRY spec (L356–391) + `@perf` annotation system** → lift into a permanent reference for GPU-cheap CSS+JS hybrid components.
7. **The `@refactor:backdrop-critical|glass-dependent|needs-solid-fallback|token-dependency` tag system** (table L207–210, toast L227–230) → adopt as an emerging convention for machine-parseable refactor flags.
8. **accordion `revert-layer` escape hatch (L424–433)** → document as the canonical pattern for "components that host arbitrary content".
9. **hero REFACTOR NOTES 5-point hero variant spec (L38–56)** → lift into rebuild's hero/section spec.
10. **header-promobanner "banner with action" responsive pattern requirements (L175–203)** → lift into rebuild's banner component spec.

---
