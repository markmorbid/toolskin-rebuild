# S3 — Component Registry + Block Prioritization Spec

**Sub-agent:** S3 — Component Registry + Block Prioritization
**Wave:** 2.3 (parallel with S4, S5, S6)
**Session:** 1
**Authored:** 2026-05-19
**Status:** SPEC — Wave 2 deliverable, feeds Sessions 4+ block sandbox execution
**Binding rules consumed:** Rules 1-15 + file 05 tier hierarchy + file 07 repo isolation
**Wave 1 inputs consumed:** T1 `_rebuild-block-typology.md` (full); T2 `_rebuild-base-context-spec.md` §6 + §8.1; T3 `_rebuild-adaptive-integration-spec.md` §5 + §7
**Wave 2.1/2.2 inputs consumed:** S1 `_rebuild-primitives-spec.md` color contract; S2 `_rebuild-system-spec.md` §7 5-state pattern + §9 shared-tokens/ layer
**Synthesis input consumed:** `_wave-1-synthesis.md` Appendix A1-Council + Appendix A1-Resolution (owner picks LOCKED)
**Gate 4 / 4.5 locks honored:** D1 `assets/js/next/`; D5 modal split; D6 surface-N split; A1 owner picks (Q1-Q4: `@ts-deps` headers + per-block emission + full pre-commit hook + commit `dist/`)
**Restrictions:** SPEC ONLY. No actual `_block-spec--<name>.md` files written. No `sandbox/`, `assets/`, `tools/` writes. Markdown only. No reads or writes to `../toolskin-showcase/**` beyond what was already in upstream Wave 1 specs.

---

## §1 — SCOPE

S3 produces the canonical **component registry** — one row per block family from T1 §2 (~128 families), declaring tier, selectors, folder location, `@ts-deps` dependency list, color-contract behavior, surface-superposition behavior, block-spec filename for Session 4+, and notes. **Plus 5 sketch block-specs inline** (`.ts-btn`, `.ts-input`, `.ts-chip`, `.ts-badge`, `.ts-toggle`).

### §1.1 — Who consumes this spec

| Downstream | What it consumes |
|---|---|
| **S4 Build Pipeline** | `@ts-deps:` lists from every registry row → feeds the topo-sort + cascade-order manifest. The §11 dependency parser contract is shared between S3-produced headers and S4's bundler. |
| **S5 Autonomous Protocol** | Tier column (PERMISSIVE / STRICT / ALWAYS STRICT) per block → drives auto-progress vs halt-for-approval gates. |
| **S6 Repo Governance** | Block-name + tier list → feeds commit-tag validation (`feat(rebuild-atomic):` vs `feat(rebuild-molecular):` vs `feat(rebuild-layout):`), refusal patterns, and shared parser module with S4. |
| **Wave 1.5 Design DNA Extractor** | Augments Notes column with visual identity criteria when its output (`_rebuild-design-dna.md`) lands. Each row's Notes column is left amendable. |
| **Sessions 4+ block sandboxes** | Every block sandbox reads its registry row first to know: tier, deps, sandbox folder, color contract, surface behavior, and which block-spec file to produce. |

### §1.2 — What S3 explicitly does NOT do

- S3 does **not** write actual `_block-spec--<name>.md` files — sketches (§7) live inside this doc only.
- S3 does **not** override tier assignments from T1 §2 unless T1 §8 explicitly flagged the row for resolution (D5 modal split, D6 surface-N split, A6 UIKit aliasing — see §3-§5).
- S3 does **not** redesign block selectors. Selectors come verbatim from T1 §2.
- S3 does **not** specify color values, primitives, or system tokens — those live in S1/S2.

---

## §2 — COMPONENT REGISTRY TABLE (all ~128 families)

**Reading conventions:**

- **Tier:** PERMISSIVE (atomic, auto-progress per S5), STRICT (molecular, halt-for-owner), ALWAYS STRICT (layout, owner-at-every-step).
- **Sandbox folder:** Per T2 §8.1 — `sandbox/00-foundation/<name>/`, `sandbox/01-atomic/<name>/`, `sandbox/02-molecular/<name>/`, `sandbox/03-layout/<name>/`.
- **`@ts-deps:` list:** Upstream blocks/primitives/system layers/shared-tokens this block consumes. Per A1 Resolution Q1, declared in the block's CSS file as `/* @ts-deps: <comma-separated names> */` comment header. The build pipeline (S4) parses it for topo-sort.
- **Color contract:** Whether the block consumes `--ts-this-*` derivatives only (per Rule 15 + T1 §3 + S1/S2 contract). All blocks must comply; the column flags any block-specific tokens (`--ts-this-accent-glow` for marquee, etc.).
- **Surface re-scope:** Whether the block sets `--ts-this-bg: var(--ts-bg-N)` for descendants. ATOMIC blocks NEVER re-scope (they consume parent). MOLECULAR blocks MAY re-scope inward (per T1 §1.2 criterion 4). LAYOUT blocks ALWAYS re-scope (per T1 §1.3 criterion 2 — they set surface tier for descendant subtrees).
- **Block-spec filename:** `_block-spec--<canonical-name>.md` lands in Sessions 4+. The naming uses the block's canonical lowercase-kebab name without the `ts-` prefix.

### §2.1 — ATOMIC tier (PERMISSIVE)

Folder root: `sandbox/01-atomic/`. Color-contract default: consumes `--ts-this-bg`, `--ts-this-color`, `--ts-this-bg-border` + state derivatives. Surface re-scope: **NO** unless flagged.

| # | Block name | Primary selector(s) | Tier | Sandbox folder | `@ts-deps:` | Color contract | Surface re-scope | Block-spec filename | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 1 | button | `.ts-btn`, `.ts-btn--sm/md/lg/xl/full`, `.ts-btn--accent/alt/danger/success` | PERMISSIVE | `sandbox/01-atomic/button/` | primitives/colors, primitives/spacing, primitives/typography, primitives/radius, system/surfaces, system/text, system/states | `--ts-this-*` derivatives only; consumes `--ts-accent` + `--ts-accent-hover/-active/-focus/-disabled` for `--accent` variants | NO | `_block-spec--button.md` | Canonical 5-state pattern exemplar per S2 §7. See §7.1 sketch |
| 2 | button-group | `.ts-btn-group` | PERMISSIVE | `sandbox/01-atomic/button-group/` | primitives/spacing, components/button | Inherits from parent surface | NO | `_block-spec--button-group.md` | Pure flex wrapper for buttons; consumes button block |
| 3 | input | `.ts-input`, `.ts-input--mono` | PERMISSIVE | `sandbox/01-atomic/input/` | primitives/colors, primitives/spacing, primitives/typography, primitives/radius, system/surfaces, system/text, system/states | `--ts-this-*` + state-token derivatives (border-active/disabled/focus) | NO | `_block-spec--input.md` | See §7.2 sketch |
| 4 | textarea | `.ts-textarea` | PERMISSIVE | `sandbox/01-atomic/textarea/` | primitives/colors, primitives/spacing, primitives/typography, primitives/radius, system/surfaces, system/text, system/states, components/input | Same as input | NO | `_block-spec--textarea.md` | Multiline input variant; consumes input contract |
| 5 | select | `.ts-select`, `.ts-select-wrap` | PERMISSIVE | `sandbox/01-atomic/select/` | primitives/colors, primitives/spacing, primitives/typography, primitives/radius, system/surfaces, system/text, system/states, components/input | Same as input + caret token | NO | `_block-spec--select.md` | Native select + chrome wrapper; UIKit custom select (`.ts-ui-select`) is separate molecular block (§3, §5) |
| 6 | input-group | `.ts-input-group`, `.ts-input-group .ts-input-icon/action` | PERMISSIVE | `sandbox/01-atomic/input-group/` | primitives/colors, primitives/spacing, primitives/radius, system/surfaces, components/input | Inherits input | NO | `_block-spec--input-group.md` | Atomic-aggregate; no JS coordination |
| 7 | range | `.ts-range`, `.ts-range-row`, `.ts-range-val` | PERMISSIVE | `sandbox/01-atomic/range/` | primitives/colors, primitives/spacing, primitives/radius, system/surfaces, system/text, system/states | `--ts-this-*` + accent track | NO | `_block-spec--range.md` | Native range styling + value readout |
| 8 | toggle | `.ts-toggle`, `.ts-toggle--sm/lg/xl` | PERMISSIVE | `sandbox/01-atomic/toggle/` | primitives/colors, primitives/spacing, primitives/radius, system/surfaces, system/states | `--ts-this-bg` (off state), `--ts-accent` (on state) | NO | `_block-spec--toggle.md` | See §7.5 sketch |
| 9 | checkbox | `.ts-checkbox`, `.ts-checkbox--md/lg/xl` | PERMISSIVE | `sandbox/01-atomic/checkbox/` | primitives/colors, primitives/spacing, primitives/radius, system/surfaces, system/states | `--ts-this-bg` (off), `--ts-accent` (on) | NO | `_block-spec--checkbox.md` | |
| 10 | radio | `.ts-radio`, `.ts-radio--md/lg/xl` | PERMISSIVE | `sandbox/01-atomic/radio/` | primitives/colors, primitives/spacing, primitives/radius, system/surfaces, system/states | `--ts-this-bg` (off), `--ts-accent` (on) | NO | `_block-spec--radio.md` | |
| 11 | chip | `.ts-chip`, `.ts-chip--accent/success/warning/danger`, `.ts-chip--active`, `[aria-selected]` | PERMISSIVE | `sandbox/01-atomic/chip/` | primitives/colors, primitives/spacing, primitives/typography, primitives/radius, system/surfaces, system/text, system/states, shared-tokens/strip-layout | `--ts-this-*` + variant accent map | NO | `_block-spec--chip.md` | See §7.3 sketch. Chip strip (molecular) consumes this |
| 12 | badge | `.ts-badge`, `.ts-badge--accent/success/warning/danger/alt/purple/cyan`, `.ts-badge-color` | PERMISSIVE | `sandbox/01-atomic/badge/` | primitives/colors, primitives/spacing, primitives/typography, primitives/radius, system/surfaces, system/text | `--ts-this-*` + status-color variants | NO | `_block-spec--badge.md` | See §7.4 sketch |
| 13 | dot | `.ts-dot`, `.ts-dot--accent/success/warning/danger/pulse/pulse-2`, `.ts-status-dot` | PERMISSIVE | `sandbox/01-atomic/dot/` | primitives/colors, primitives/spacing, system/surfaces, system/text, primitives/motion | `--ts-this-*` + status-color + glow accent | NO | `_block-spec--dot.md` | Pulse variants use `--ts-dur-*` + `--ts-ease-*` from primitives/motion |
| 14 | swatch | `.ts-swatch`, `.ts-swatch--sm/lg/accent/accent-dim/alt/success/warning/danger`, `.ts-grad-swatch` | PERMISSIVE | `sandbox/01-atomic/swatch/` | primitives/colors, primitives/spacing, primitives/radius, system/surfaces | `--ts-this-bg` + status-color + accent ramp | NO | `_block-spec--swatch.md` | Palette unit; gradient variant uses surface gradient tokens |
| 15 | progress | `.ts-progress`, `.ts-progress--sm/lg` | PERMISSIVE | `sandbox/01-atomic/progress/` | primitives/colors, primitives/spacing, primitives/radius, system/surfaces, primitives/motion | `--ts-this-bg-dark` (track), `--ts-accent` (fill) | NO | `_block-spec--progress.md` | Single bar; progress-row is molecular |
| 16 | spinner | `.ts-ui-spinner` | PERMISSIVE | `sandbox/01-atomic/spinner/` | primitives/colors, primitives/spacing, primitives/motion | `--ts-accent` (rotor), `--ts-this-bg-border` (track) | NO | `_block-spec--spinner.md` | UIKit single-spinner is atomic (no JS coordination) |
| 17 | icon | `.ts-icon`, `.ts-icon-dot/tiny/mr` | PERMISSIVE | `sandbox/01-atomic/icon/` | primitives/colors, primitives/spacing, primitives/typography | `--ts-this-color` (currentColor) | NO | `_block-spec--icon.md` | Visual primitive; size variants use `--ts-fs-*` + `--ts-sp-*` |
| 18 | label | `.ts-label`, `.ts-caption`, `.ts-section-label`, `.ts-overline`, `.ts-accent-label`, `.ts-toggle-label`, `.ts-progress-label/value` | PERMISSIVE | `sandbox/01-atomic/label/` | primitives/typography, primitives/spacing, system/text | `--ts-this-color`, `--ts-this-color-muted`, `--ts-accent` (accent label) | NO | `_block-spec--label.md` | Type primitive — no surface |
| 19 | type-primitives | `.ts-h1`–`.ts-h6`, `.ts-display-xl/lg/md`, `.ts-body`, `.ts-lead`, `.ts-body-sm`, `.ts-small`, `.ts-mono`, `.ts-text-*`, `.ts-fs-*`, `.ts-fw-*`, `.ts-lh-*`, `.ts-ls-*`, `.ts-font-display/body` | PERMISSIVE | `sandbox/01-atomic/type-primitives/` | primitives/typography, system/text | `--ts-this-color` + `--ts-this-color-muted`; consumes `--ts-font-*` tokens from primitives/typography | NO | `_block-spec--type-primitives.md` | Heading/body/mono atomics. Cross-references typography-master skill. **Bulk family** — many selectors, one block-spec |
| 20 | headline-presets | `.ts-hero-title`, `.ts-display-title`, `.ts-section-title`, `.ts-stat-value`, `.ts-subtitle`, `.ts-display-editorial`, `.ts-gradient-text`, `.ts-text-accent-line`, `.ts-preset-hero-label/section-header/stat-value/meta/body-secondary/nav-link` | PERMISSIVE | `sandbox/01-atomic/headline-presets/` | primitives/typography, system/text, components/type-primitives | Same as type-primitives + `--ts-accent` for gradient/accent-line variants | NO | `_block-spec--headline-presets.md` | Type-layer presets |
| 21 | code-label | `.ts-code-label`, `.ts-code-dotbtn`, `.ts-code-copy` | PERMISSIVE | `sandbox/01-atomic/code-label/` | primitives/colors, primitives/spacing, primitives/typography, primitives/radius, system/surfaces, system/text, shared-tokens/code-block | `--ts-this-*` + mono font | NO | `_block-spec--code-label.md` | Small inline atoms inside code window |
| 22 | slider-dot | `.ts-slider-dot`, `.ts-slider-dots` | PERMISSIVE | `sandbox/01-atomic/slider-dot/` | primitives/colors, primitives/spacing, primitives/motion | `--ts-this-bg-dark` (inactive), `--ts-accent` (active) | NO | `_block-spec--slider-dot.md` | Pagination indicator |
| 23 | theme-toggle | `.ts-theme-toggle` | PERMISSIVE | `sandbox/01-atomic/theme-toggle/` | primitives/colors, primitives/spacing, primitives/motion, components/button | `--ts-this-*`; consumes `Toolskin.setTheme()` engine API (per D8 if owner approves) | NO | `_block-spec--theme-toggle.md` | Single binary control; engine implementation is infrastructure (D7) |
| 24 | menu-burger | `.ts-menu-burger`, `.ts-menu-burger-inner` | PERMISSIVE | `sandbox/01-atomic/menu-burger/` | primitives/colors, primitives/spacing, primitives/motion | `--ts-this-color` | NO | `_block-spec--menu-burger.md` | Pure-CSS icon transitions; menu it opens is layout |
| 25 | social-link | `.ts-social-link` | PERMISSIVE | `sandbox/01-atomic/social-link/` | primitives/colors, primitives/spacing, system/text, system/states, components/icon | `--ts-this-color` + hover/focus derivatives | NO | `_block-spec--social-link.md` | Inline icon link |
| 26 | newsletter-input-piece | `.ts-newsletter-input`, `.ts-newsletter-btn` | PERMISSIVE | `sandbox/01-atomic/newsletter-input-piece/` | components/input, components/button | Inherits input + button | NO | `_block-spec--newsletter-input-piece.md` | Standalone atoms; `.ts-newsletter-input-group` is molecular |
| 27 | hint | `.ts-hint` | PERMISSIVE | `sandbox/01-atomic/hint/` | primitives/typography, primitives/spacing, system/text | `--ts-this-color-muted` | NO | `_block-spec--hint.md` | Inline helper text |
| 28 | number-input-btn | `.ts-ui-number-btn` | PERMISSIVE | `sandbox/01-atomic/number-input-btn/` | components/button | Inherits button | NO | `_block-spec--number-input-btn.md` | Stepper button atom; wrapper is molecular |
| 29 | bulk-bar-row-checkbox | `.ts-ui-row-checkbox`, `.ts-ui-checkbox-cell` | PERMISSIVE | `sandbox/01-atomic/bulk-bar-row-checkbox/` | components/checkbox | Inherits checkbox | NO | `_block-spec--bulk-bar-row-checkbox.md` | Inline cell control |
| 30 | accent-text | `.ts-accent-text` | PERMISSIVE | `sandbox/01-atomic/accent-text/` | primitives/colors, primitives/typography, system/text | `--ts-accent` | NO | `_block-spec--accent-text.md` | Inline emphasis token |
| 31 | shadow-utilities | `.ts-shadow-xs/sm/md/lg/xl/low/mid/high/br/bl/tr/tl/soft/normal/strong/accent/surface` | PERMISSIVE | `sandbox/01-atomic/shadow-utilities/` | primitives/colors | `--ts-this-shadow-*` (S2 to define) or composes from primitives | NO | `_block-spec--shadow-utilities.md` | Pure effect tokens. **Utility family**; bulk-counted |
| 32 | spacing-utilities | `.ts-mt-*`, `.ts-mb-*`, `.ts-mt-auto`, `.ts-mr-auto`, `.ts-ml-auto`, `.ts-mx-auto`, `.ts-p-*`, `.ts-pt/pb/pr/pl/px/py-*` | PERMISSIVE | `sandbox/01-atomic/spacing-utilities/` | primitives/spacing | N/A — no color | NO | `_block-spec--spacing-utilities.md` | Utility family; uses `--ts-sp-*` |
| 33 | display-utilities | `.ts-hidden`, `.ts-visible`, `.ts-invisible`, `.ts-sr-only`, `.ts-truncate`, `.ts-line-clamp-2`, `.ts-cursor-pointer`, `.ts-select-none`, `.ts-no-events`, `.ts-w-*`, `.ts-h-*`, `.ts-max-w-*` | PERMISSIVE | `sandbox/01-atomic/display-utilities/` | (none — pure utility) | N/A | NO | `_block-spec--display-utilities.md` | Utility family |
| 34 | border-utilities | `.ts-border`, `.ts-border-t/b/accent`, `.ts-rounded`, `.ts-rounded-full` | PERMISSIVE | `sandbox/01-atomic/border-utilities/` | primitives/colors, primitives/radius, system/surfaces | `--ts-this-bg-border` + `--ts-accent` | NO | `_block-spec--border-utilities.md` | Utility family |
| 35 | reveal-animations | `.ts-reveal`, `.ts-fade-in/up/left/right`, `.ts-zoom-in/out`, `.ts-slide-up/left/right`, `.ts-flip-up`, `.ts-bounce-in`, `.ts-delay-1/.../6` | PERMISSIVE | `sandbox/01-atomic/reveal-animations/` | primitives/motion | N/A — pure animation | NO | `_block-spec--reveal-animations.md` | Pure CSS animations; the IntersectionObserver engine is INFRASTRUCTURE (D7, owned by S4). Per T1 §8.4: CSS atomic, engine separate |
| 36 | skeleton | `.ts-skeleton`, `.ts-skeleton--loaded` | PERMISSIVE | `sandbox/01-atomic/skeleton/` | primitives/colors, primitives/radius, primitives/motion, system/surfaces | `--ts-this-bg-dark-1` (base), `--ts-this-bg-dark-2` (shimmer) | NO | `_block-spec--skeleton.md` | Single placeholder primitive |
| 37 | frame | `.ts-frame`, `.ts-frame--square/video/photo/phone` | PERMISSIVE | `sandbox/01-atomic/frame/` | primitives/spacing | N/A — aspect-ratio wrapper | NO | `_block-spec--frame.md` | Pure aspect-ratio wrapper |
| 38 | glow-shimmer-scanline | `.ts-glow`, `.ts-glow-success/danger/info`, `.ts-shimmer`, `.ts-scanline`, `.ts-headline-sweep`, `.ts-neon-accent` | PERMISSIVE | `sandbox/01-atomic/glow-shimmer-scanline/` | primitives/colors, primitives/motion, system/surfaces | `--ts-accent-glow`, status-color glow variants | NO | `_block-spec--glow-shimmer-scanline.md` | Decoration primitives |
| 39 | grain-layers | `.ts-grain`, `.ts-grain--subtle/medium/strong/fast/slow`, `.ts-grain-layer` | PERMISSIVE | `sandbox/01-atomic/grain-layers/` | primitives/motion, primitives/colors | `--ts-this-color` alpha overlay | NO | `_block-spec--grain-layers.md` | Decorative texture layer (always behind content) |
| 40 | effects-layer | `.ts-effects-layer`, `.ts-color-overlay-layer` | PERMISSIVE | `sandbox/01-atomic/effects-layer/` | primitives/colors, system/surfaces | `--ts-this-bg` alpha overlay | NO | `_block-spec--effects-layer.md` | Decorative overlay |
| 41 | glass-surface | `.ts-glass`, `.ts-glass--light/accent` | PERMISSIVE | `sandbox/01-atomic/glass-surface/` | primitives/colors, system/surfaces | `--ts-this-bg` + backdrop-filter | NO | `_block-spec--glass-surface.md` | Atomic when applied to small surfaces. Promotes to LAYOUT when used as section bg — but per D6, that's `.ts-section.ts-glass` which is a layout composition; this row is the atomic utility |
| 42a | surface-n (atomic) | `.ts-surface-0/1/2/3/4/5`, `.ts-surface`, `.ts-surface-glass/gradient/mesh/grid` | PERMISSIVE | `sandbox/01-atomic/surface-n/` | primitives/colors, system/surfaces | `--ts-this-bg` direct setter via `--ts-bg-N` | NO (atomic variant does NOT propagate downward — its only purpose is to set the surface ON ITSELF) | `_block-spec--surface-n.md` | **D6 LOCKED — atomic utility**. See §4. The layout-composition variant lives in §2.3 row 42b. |
| 43 | bg-utilities | `.ts-bg-grad-surface-0/2/radial-soft`, `.ts-bg-engine/gradient-radial/gradient-linear/gradient-accent/mesh/flat/pattern/pattern-dots/pattern-grid/pattern-lines/pattern-noise/pattern-custom/interactive/interactive-grid/parallax/image/motion/motion-reveal/motion-slide/motion-fade/motion-zoom/slider/overlay/radial/glow/accent/accent-dim/grid/stripes` | PERMISSIVE | `sandbox/01-atomic/bg-utilities/` | primitives/colors, primitives/motion, system/surfaces | `--ts-this-bg-grad`, `--ts-accent-glow`, status-color variants | NO | `_block-spec--bg-utilities.md` | Decorative bg primitives. Many selectors — single block-spec covers all |
| 44 | pattern-size | `.ts-pattern--xs/sm/lg/xl/2xl` | PERMISSIVE | `sandbox/01-atomic/pattern-size/` | components/bg-utilities | N/A — sizing tokens for bg-pattern-* | NO | `_block-spec--pattern-size.md` | Sizing tokens for `.ts-bg-pattern-*` |

**Atomic count: 44 families (rows 1-44; row 42 split into 42a/42b per D6 — the layout half lives at §2.3 row 109b).**

### §2.2 — MOLECULAR tier (STRICT)

Folder root: `sandbox/02-molecular/`. Color-contract default: consumes `--ts-this-*` derivatives. Surface re-scope: **MAY** re-scope inward (per T1 §1.2). The block sets `--ts-this-bg: var(--ts-bg-N)` at its own root so descendants resolve their derivative chain against the right tier — surfaces do NOT propagate outward.

| # | Block name | Primary selector(s) | Tier | Sandbox folder | `@ts-deps:` | Color contract | Surface re-scope | Block-spec filename | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 45 | card | `.ts-card`, `.ts-card-header`, `.ts-card--accent/featured/glass/accent-bar`, `.ts-card-row/col-full/half/third/auto`, `.ts-card-rows` | STRICT | `sandbox/02-molecular/card/` | primitives/colors, primitives/spacing, primitives/typography, primitives/radius, system/surfaces, system/text, system/states | `--ts-this-*` + `--ts-accent` for accent variant | YES (inward — sets `--ts-this-bg: var(--ts-bg-2)` typical) | `_block-spec--card.md` | Composes button, label, type-primitives; slot layout |
| 46 | field | `.ts-field`, `.ts-field-label`, `.ts-field-row-2/3`, `.ts-field-group`, `.ts-form-column-group`, `.ts-form-column`, `.ts-group-title-label` | STRICT | `sandbox/02-molecular/field/` | components/input, components/label, primitives/spacing, shared-tokens/form-row | `--ts-this-color-muted` for label, input/label derivatives | NO (composes input which has its own surface) | `_block-spec--field.md` | Label + input + helper composition |
| 47 | toggle-row | `.ts-toggle-row`, `.ts-toggle-label` | STRICT | `sandbox/02-molecular/toggle-row/` | components/toggle, components/label, shared-tokens/form-row | Inherits toggle + label | NO | `_block-spec--toggle-row.md` | Label + toggle alignment |
| 48 | checkbox-row | `.ts-checkbox-row`, `.ts-checkbox-group`, `.ts-checkbox-container` | STRICT | `sandbox/02-molecular/checkbox-row/` | components/checkbox, components/label, shared-tokens/form-row | Inherits checkbox + label | NO | `_block-spec--checkbox-row.md` | Group composition |
| 49 | radio-group | `.ts-radio-group`, `.ts-radio-group--compact`, `.ts-radio-item` | STRICT | `sandbox/02-molecular/radio-group/` | components/radio, components/label, shared-tokens/form-row | Inherits radio + label | NO | `_block-spec--radio-group.md` | Group + one-of-N coordination |
| 50 | chips | `.ts-chips`, `.ts-chips:not(.ts-align-anchor-grid)` | STRICT | `sandbox/02-molecular/chips/` | components/chip, components/button, primitives/motion, system/surfaces, system/states, shared-tokens/strip-layout | `--ts-this-bg-dark/dark-1/dark-2/border` per @taxonomy_chips_strip §6 | **YES (inward)** — `--ts-this-bg: var(--ts-bg-1)` is part of the locked design contract | `_block-spec--chips.md` | **Rule 9 LOCKED — 10 KEY STYLE FACTORS reproduced verbatim in §6.** Refactor requirements per T1 §6.3: scoped root token setup, replace horizontal scroll method, truncation dropdown, row sibling shrink |
| 51 | number-input-wrapper | `.ts-ui-number-input-wrapper`, `.ts-ui-number-input-controls`, `.ts-ui-number-btn` | STRICT | `sandbox/02-molecular/number-input-wrapper/` | components/input, components/number-input-btn | Inherits | NO | `_block-spec--number-input-wrapper.md` | Input + stepper composition |
| 52 | color-row | `.ts-color-row`, `.ts-color-preset` | STRICT | `sandbox/02-molecular/color-row/` | components/swatch, primitives/spacing, system/states | Swatch + selection state | NO | `_block-spec--color-row.md` | Multiple swatches + selection |
| 53 | icon-dropdown | `.ts-icon-dd-wrap`, `.ts-icon-dd-list`, `.ts-icon-option`, `.ts-icon-search-input`, `.ts-icon-search-icon`, `.ts-icon-selected-row` | STRICT | `sandbox/02-molecular/icon-dropdown/` | components/icon, components/input, components/menu-list, shared-tokens/menu-popover | `--ts-this-*` + popover-shadow | YES (inward; dropdown list re-scopes) | `_block-spec--icon-dropdown.md` | Search input + dropdown list + selected display |
| 54 | ui-select | `.ts-ui-select` | STRICT | `sandbox/02-molecular/ui-select/` | components/select, shared-tokens/menu-popover, primitives/motion | `--ts-this-*` + accent on selected | YES (inward; dropdown re-scopes) | `_block-spec--ui-select.md` | UIKit custom dropdown with JS controller. **A6: separate from `.ts-select`** (genuine behavior — see §5) |
| 55 | tabs | `.ts-tabs`, `.ts-tab`, `.ts-tab--active`, `.ts-tab-pane`, `.ts-tabs--pill`, `.ts-tabs--pill-rounded` | STRICT | `sandbox/02-molecular/tabs/` | components/button, primitives/motion, system/surfaces, system/states | `--ts-this-*` + `--ts-accent` for active tab | NO | `_block-spec--tabs.md` | Tab triggers + panes + JS coordination |
| 56 | accordion | `.ts-accordion`, `.ts-accordion-body` | STRICT | `sandbox/02-molecular/accordion/` | primitives/motion, primitives/spacing, system/surfaces, system/text, system/states | `--ts-this-*` | YES (inward optional) | `_block-spec--accordion.md` | Item rows + content panels |
| 57 | ui-accordion | `.ts-ui-accordion`, `.ts-ui-accordion--separated/dual-icon` | STRICT | `sandbox/02-molecular/ui-accordion/` | components/accordion, primitives/motion | Inherits accordion + variants | YES (inward optional) | `_block-spec--ui-accordion.md` | **A6: separate from `.ts-accordion`** (UIKit variants add `--separated/dual-icon` behaviors) |
| 58 | modal | `.ts-modal`, `.ts-modal--sm/lg/xl` | STRICT | `sandbox/02-molecular/modal/` | primitives/colors, primitives/spacing, primitives/radius, system/surfaces, system/text, system/states, components/button | `--ts-this-*` | YES (inward — modal content shell re-scopes for its descendants) | `_block-spec--modal.md` | **D5 LOCKED — content shell only.** Overlay is separate layout block (§4, §2.3 row 109a). See §3 |
| 59 | toast | `.ts-toast`, `.ts-toast--success/warning/error/info`, `.ts-ui-toast`, `.ts-ui-toast--in/out` | STRICT | `sandbox/02-molecular/toast/` | primitives/colors, primitives/spacing, primitives/radius, primitives/motion, system/surfaces, system/text, components/icon, components/button | `--ts-this-*` + status-color variants | YES (inward) | `_block-spec--toast.md` | Single toast + enter/exit animation; container is layout |
| 60 | tree-popover | `.ts-tree-popover`, `.ts-tree-popover__item`, `.ts-tree-popover__sep` | STRICT | `sandbox/02-molecular/tree-popover/` | primitives/colors, primitives/radius, system/surfaces, system/states, shared-tokens/menu-popover | `--ts-this-*` + popover-shadow | YES (inward) | `_block-spec--tree-popover.md` | Positioned menu + item rows + separators |
| 61 | marquee | `.ts-marquee-container`, `.ts-marquee-text-wrap/content/text`, `.ts-marquee.fullwidth.ts-marquee-container` (standard variant) | STRICT | `sandbox/02-molecular/marquee/` | primitives/colors, primitives/typography, primitives/motion, system/surfaces, system/text | `--ts-this-bg` re-scope per T1 §4 (single declaration, NO `pointer-events: none` patch); consumes `--ts-this-accent-glow` for glow variant | YES (inward) | `_block-spec--marquee.md` | Standard variant only. **Fullwidth variant promotes to LAYOUT — see §2.3 row 119.** Per T1 §4 resolution: single declaration of `--ts-marquee-bg` + `--ts-marquee-font-size`; engine fix accompanies (A8 deferred to S4 infrastructure) |
| 62 | list | `.ts-feat-list`, `.ts-feat-item`, `.ts-list`, `.ts-menu-list`, `.ts-menu-item`, `.ts-menu-link` (in footer/sidebar context) | STRICT | `sandbox/02-molecular/list/` | components/icon, primitives/spacing, primitives/typography, system/surfaces, system/text, system/states | `--ts-this-*` | NO | `_block-spec--list.md` | Item rows + dividers + hover states |
| 63 | code-block | `.ts-code-block` | STRICT | `sandbox/02-molecular/code-block/` | primitives/typography, primitives/spacing, primitives/radius, system/surfaces, system/text, components/code-label, shared-tokens/code-block | `--ts-this-*` + mono font | YES (inward — mono surface tier) | `_block-spec--code-block.md` | Mono surface + code formatting |
| 64 | code-window | `.ts-code-window`, `.ts-code-header`, `.ts-code-content` | STRICT | `sandbox/02-molecular/code-window/` | components/code-block, components/code-label, components/button, shared-tokens/code-block | Inherits code-block | YES (inward) | `_block-spec--code-window.md` | Window chrome + content + copy actions |
| 65 | table | `.ts-table`, `.ts-table-wrap`, `.ts-log`, `.ts-table-wrapper` | STRICT | `sandbox/02-molecular/table/` | primitives/colors, primitives/spacing, primitives/typography, system/surfaces, system/text, system/states, shared-tokens/table-layout | `--ts-this-*` + row-hover derivative | YES (inward) | `_block-spec--table.md` | Header + rows; sort/bulk variants are separate UIKit |
| 66 | ui-table-sortable-bulk | `.ts-ui-table--sortable`, `.ts-ui-table--bulk`, `.ts-ui-table-scroll`, `.ts-ui-table-bulk-wrap` | STRICT | `sandbox/02-molecular/ui-table-sortable-bulk/` | components/table, components/checkbox, components/icon, shared-tokens/table-layout | Inherits table | YES (inward) | `_block-spec--ui-table-sortable-bulk.md` | **A6: separate from `.ts-table`** (sortable + bulk-select add JS coordination) |
| 67 | bulk-bar | `.ts-ui-bulk-bar` | STRICT | `sandbox/02-molecular/bulk-bar/` | components/button, components/bulk-bar-row-checkbox, primitives/spacing | `--ts-this-*` | YES (inward) | `_block-spec--bulk-bar.md` | Surface + buttons + selection count |
| 68 | progress-row | `.ts-progress-row`, `.ts-progress-label`, `.ts-progress-value` | STRICT | `sandbox/02-molecular/progress-row/` | components/progress, components/label | Inherits | NO | `_block-spec--progress-row.md` | Label + bar + value composition |
| 69 | pricing-card | `.ts-pricing-card`, `.ts-pricing-card--featured` | STRICT | `sandbox/02-molecular/pricing-card/` | components/card, components/button, components/badge, components/list | `--ts-this-*` + accent (featured variant) | YES (inward) | `_block-spec--pricing-card.md` | Card composition with header/features/CTA slots |
| 70 | testimonial | `.ts-testimonial` | STRICT | `sandbox/02-molecular/testimonial/` | components/card, components/label, primitives/typography | Inherits card | YES (inward) | `_block-spec--testimonial.md` | Quote + avatar + attribution |
| 71 | flip-card | `.ts-flip-card`, `.ts-card-face`, `.ts-flip-card--depth-sm/md/lg` | STRICT | `sandbox/02-molecular/flip-card/` | components/card, primitives/motion | Inherits card | YES (inward) | `_block-spec--flip-card.md` | Two faces + 3D flip + JS toggle |
| 72 | swipe-card | `.ts-swipe-card` | STRICT | `sandbox/02-molecular/swipe-card/` | components/card, primitives/motion | Inherits card | YES (inward) | `_block-spec--swipe-card.md` | Card + JS swipe gesture |
| 73 | portfolio-icon | `.ts-portfolio-icon` | STRICT | `sandbox/02-molecular/portfolio-icon/` | components/icon, components/badge, components/label | `--ts-this-*` + hover state | NO | `_block-spec--portfolio-icon.md` | Composite badge + label + hover |
| 74 | control-chip | `.ts-control-chip` | STRICT | `sandbox/02-molecular/control-chip/` | components/chip, components/label | Inherits chip | NO | `_block-spec--control-chip.md` | Chip variant with internal label + value pair |
| 75 | control-surface | `.ts-control-surface--glass/accent-gradient/light` | STRICT | `sandbox/02-molecular/control-surface/` | components/card, components/glass-surface, system/surfaces | Surface composition with state controls | YES (inward) | `_block-spec--control-surface.md` | Surface composition with internal state controls |
| 76 | banner-promo | `.ts-banner`, `.ts-promo-banner` | STRICT | `sandbox/02-molecular/banner-promo/` | primitives/colors, primitives/spacing, primitives/radius, components/button, components/icon, system/surfaces | `--ts-this-*` + `--ts-accent` | YES (inward) | `_block-spec--banner-promo.md` | Surface + message + dismiss |
| 77 | hero-lead-image | `.ts-hero-lead`, `.ts-hero-image` | STRICT | `sandbox/02-molecular/hero-lead-image/` | components/type-primitives, components/headline-presets, primitives/spacing | `--ts-this-*` | NO | `_block-spec--hero-lead-image.md` | Hero internals; hero SECTION is layout |
| 78 | split-feature-item | `.ts-split-feature` (item) | STRICT | `sandbox/02-molecular/split-feature-item/` | components/card, components/headline-presets, primitives/spacing | Inherits card | YES (inward) | `_block-spec--split-feature-item.md` | Two-side item composition; SECTION variant is layout |
| 79 | newsletter-input-group | `.ts-newsletter-input-group`, `.ts-newsletter-form`, `.ts-footer-newsletter`, `.ts-footer-newsletter-desc` | STRICT | `sandbox/02-molecular/newsletter-input-group/` | components/newsletter-input-piece, components/input, components/button, components/label | Inherits parts | NO | `_block-spec--newsletter-input-group.md` | Input + button + description composition |
| 80 | footer-widget | `.ts-footer-widget`, `.ts-footer-widget-title` | STRICT | `sandbox/02-molecular/footer-widget/` | components/headline-presets, primitives/spacing | `--ts-this-color` | NO | `_block-spec--footer-widget.md` | Title + content slot inside footer column |
| 81 | footer-menu | `.ts-footer-menu` | STRICT | `sandbox/02-molecular/footer-menu/` | components/list, system/states | Inherits list | NO | `_block-spec--footer-menu.md` | Menu list inside footer column |
| 82 | footer-copyright | `.ts-footer-copyright`, `.ts-footer-socket-row` | STRICT | `sandbox/02-molecular/footer-copyright/` | primitives/typography, system/text | `--ts-this-color-muted` | NO | `_block-spec--footer-copyright.md` | Composition inside socket layout |
| 83 | social-links-group | `.ts-social-links` | STRICT | `sandbox/02-molecular/social-links-group/` | components/social-link, primitives/spacing | Inherits | NO | `_block-spec--social-links-group.md` | Container for multiple social-link atoms |
| 84 | toast-stack | `.ts-toast-container`, `.ts-ui-toast-stack`, `.ts-ui-toast-display` | STRICT | `sandbox/02-molecular/toast-stack/` | components/toast, primitives/motion, primitives/spacing | Inherits toast | YES (inward) | `_block-spec--toast-stack.md` | Stack is viewport-positioned but logically a molecular grouping per T1 |
| 85 | tree-node | `.ts-tree__node`, `.ts-tree__row`, `.ts-tree__twist`, `.ts-tree__icon`, `.ts-tree__label`, `.ts-tree__meta`, `.ts-tree__children` | STRICT | `sandbox/02-molecular/tree-node/` | components/icon, components/label, primitives/spacing, system/states | `--ts-this-*` | YES (inward) | `_block-spec--tree-node.md` | Row composition + expand/collapse |
| 86 | tree | `.ts-tree`, `.ts-tree .ts-node`, `.ts-tree__children` (recursive) | STRICT | `sandbox/02-molecular/tree/` | components/tree-node, system/surfaces, system/states | `--ts-this-*` + may use `:root [class*="ts-tree"]` SCOPED DISTRIBUTION LAYER per T1 §5 / Rule 8 (tokens only, NEVER state) | YES (inward) | `_block-spec--tree.md` | Recursive tree; explorer SHELL is layout. **Rule 8 distribution-layer comment required** |
| 87 | ide-demo | `.ts-ide-demo` | STRICT | `sandbox/02-molecular/ide-demo/` | components/code-window, components/tabs, primitives/spacing | Inherits code-window | YES (inward) | `_block-spec--ide-demo.md` | Editor-mock composition |
| 88 | gallery | `.ts-gallery`, `.ts-gallery--uniform` | STRICT | `sandbox/02-molecular/gallery/` | components/frame, primitives/spacing | `--ts-this-*` | NO | `_block-spec--gallery.md` | Grid of media items; lightbox variant is layout |
| 89 | logo-text | `.ts-logo-text` | STRICT | `sandbox/02-molecular/logo-text/` | components/icon, components/type-primitives | `--ts-accent` for mark | NO | `_block-spec--logo-text.md` | Mark + text composition |
| 90 | generator-internals | `.ts-generator-color-row`, `.ts-generator-swatch`, `.ts-generator-select-wrap`, `.ts-generator-select`, `.ts-generator-code-export`, `.ts-generator-animation-controls`, `.ts-generator-tab`, `.ts-generator-tab-pane`, `.ts-generator-canvas-info`, `.ts-generator-canvas-badge`, `.ts-generator-logo`, `.ts-generator-logo-sub`, `.ts-generator-tabs`, `.ts-generator-panel-body` | STRICT | `sandbox/02-molecular/generator-internals/` | components/swatch, components/select, components/tabs, components/code-block, components/button, primitives/spacing | `--ts-this-*` | YES (inward) | `_block-spec--generator-internals.md` | Generator-app internal compositions; SHELL is layout |
| 91 | oce-internals | `.ts-oce-field`, `.ts-oce-tab`, `.ts-oce-conditional`, `.ts-oce-close`, `.ts-oce-fab`, `.ts-oce-hidden`, `.ts-color-preset`, `.ts-range-value` | STRICT | `sandbox/02-molecular/oce-internals/` | components/field, components/tabs, components/button, components/range, components/swatch | `--ts-this-*` | YES (inward) | `_block-spec--oce-internals.md` | Offcanvas editor internal compositions |
| 92 | promo-tab | `.ts-ptab` | STRICT | `sandbox/02-molecular/promo-tab/` | components/tabs, components/card | Inherits | YES (inward) | `_block-spec--promo-tab.md` | Promo carousel tab composition |
| 93 | row | `.ts-row-2`, `.ts-row` | STRICT | `sandbox/02-molecular/row/` | primitives/spacing | N/A | NO | `_block-spec--row.md` | Reusable row composition |

**Molecular count: 49 families (rows 45-93, with row 50 carrying the chips contract per Rule 9 + §6).**

### §2.3 — LAYOUT tier (ALWAYS STRICT)

Folder root: `sandbox/03-layout/`. Color-contract default: consumes `--ts-this-*` derivatives + sets surface tier for descendant subtree. Surface re-scope: **YES** (per T1 §1.3 — sets surface tier for descendants).

| # | Block name | Primary selector(s) | Tier | Sandbox folder | `@ts-deps:` | Color contract | Surface re-scope | Block-spec filename | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 94 | app-shell | `.ts-app-shell`, `.ts-app-shell--no-sidebar` | ALWAYS STRICT | `sandbox/03-layout/app-shell/` | primitives/spacing, system/surfaces, shared-tokens/grid-system | `--ts-this-bg: var(--ts-bg-body)` page floor | YES (page-level) | `_block-spec--app-shell.md` | Defines page-level grid: sidebar + main |
| 95 | container | `.ts-container`, `.ts-container--sm/md/xl/full/content` | ALWAYS STRICT | `sandbox/03-layout/container/` | primitives/spacing | N/A — defines extent only | NO (extent only; doesn't change surface tier) | `_block-spec--container.md` | Defines horizontal extent for content branch |
| 96 | section | `.ts-section`, `.ts-section--alt/alt-2/dark/accent-band/glow/glow-center/overlay/phone` | ALWAYS STRICT | `sandbox/03-layout/section/` | primitives/colors, primitives/spacing, system/surfaces, system/text | `--ts-this-bg: var(--ts-bg-N)` per variant; **Rule 4 surface superposition** | **YES (always — section is the canonical surface-tier setter)** | `_block-spec--section.md` | Surface tier setter for entire descendant subtree. Variants change `--ts-bg-N` consumed |
| 97 | section-divider | `.ts-section-divider` | ALWAYS STRICT | `sandbox/03-layout/section-divider/` | primitives/colors, primitives/spacing, system/surfaces | `--ts-this-bg-border` | NO | `_block-spec--section-divider.md` | Visual page-break primitive |
| 98 | hero | `.ts-hero` | ALWAYS STRICT | `sandbox/03-layout/hero/` | components/section, components/hero-lead-image, components/headline-presets, components/button, primitives/motion | Inherits section + variants | YES | `_block-spec--hero.md` | Top-of-page primary layout slot |
| 99 | topbar | `.ts-topbar`, `.ts-topbar-static` | ALWAYS STRICT | `sandbox/03-layout/topbar/` | components/nav-fixed, components/menu-burger, components/theme-toggle, system/surfaces | `--ts-this-bg: var(--ts-bg-2)` typical (re-scoped, sticky) | YES | `_block-spec--topbar.md` | Sticky/fixed top-of-viewport nav |
| 100 | nav-fixed | `.ts-nav`, `.ts-nav-fixed`, `.ts-nav-more`, `.ts-more-trigger`, `.ts-nav-dropdown` | ALWAYS STRICT | `sandbox/03-layout/nav-fixed/` | components/list, components/button, components/menu-burger, primitives/motion, system/states | `--ts-this-*` + accent on active | YES | `_block-spec--nav-fixed.md` | Nav coordination at viewport level |
| 101 | sidenav | `.ts-sidenav` | ALWAYS STRICT | `sandbox/03-layout/sidenav/` | components/list, components/icon, components/button, system/surfaces | `--ts-this-bg: var(--ts-bg-1/2)` re-scoped | YES | `_block-spec--sidenav.md` | Left/right viewport rail |
| 102 | mobile-menu | `.ts-mobile-menu`, `.ts-mobile-menu-items`, `.ts-mobile-menu-overlay` | ALWAYS STRICT | `sandbox/03-layout/mobile-menu/` | components/list, components/button, components/menu-burger, primitives/motion, system/surfaces | `--ts-this-bg: var(--ts-bg-1)` re-scoped | YES (full-viewport overlay) | `_block-spec--mobile-menu.md` | Full-viewport mobile nav overlay |
| 103 | page-footer | `.ts-page-footer`, `.ts-footer-row`, `.ts-footer-column`, `.ts-footer-columns`, `.ts-footer-socket` | ALWAYS STRICT | `sandbox/03-layout/page-footer/` | components/footer-widget, components/footer-menu, components/footer-copyright, components/social-links-group, components/newsletter-input-group, shared-tokens/grid-system | `--ts-this-bg: var(--ts-bg-2)` typical | YES | `_block-spec--page-footer.md` | Bottom-of-page structural block |
| 104 | grid | `.ts-grid`, `.ts-grid--1/2/3/4`, `.ts-grid--auto-sm/md/lg`, `.ts-grid--sidebar/panel/thirds/auto-fit`, responsive `-d/-t/-m-*`, `.ts-grid--start`, `.ts-grid-responsive`, `.ts-col`, `.ts-col-span-2/3/full`, `.ts-col--safe`, `.ts-span-2/3/full`, `.ts-grid-cols-d/t/m-*` | ALWAYS STRICT | `sandbox/03-layout/grid/` | primitives/spacing, shared-tokens/grid-system | N/A — layout primitive | NO | `_block-spec--grid.md` | Page-level column definition |
| 105 | flex | `.ts-flex`, `.ts-flex-row/col/wrap/nowrap/center/between/around/evenly/start/end/responsive`, `.ts-items-*`, `.ts-justify-*`, `.ts-gap-*`, `.ts-gap-x-*`, `.ts-gap-y-*`, `.ts-flex-d-row`, `.ts-flex-t-col`, `.ts-flex-m-col`, `.ts-flex-1/none/shrink-0`, `.ts-row` | ALWAYS STRICT | `sandbox/03-layout/flex/` | primitives/spacing | N/A | NO | `_block-spec--flex.md` | Page-composition primitives. Per T1: "atomic-looking but mistakes cascade across every consumer" → ALWAYS STRICT |
| 106 | layout-helpers | `.ts-stack`, `.ts-stack--tight/loose/xl`, `.ts-cluster`, `.ts-cluster--end/between`, `.ts-grid--auto/2/3/4`, `.ts-split`, `.ts-center` | ALWAYS STRICT | `sandbox/03-layout/layout-helpers/` | primitives/spacing, shared-tokens/grid-system | N/A | NO | `_block-spec--layout-helpers.md` | One-axis layout primitives |
| 107 | main-wrap | `.ts-main-wrap-offset-rounded-bg`, `.ts-main` | ALWAYS STRICT | `sandbox/03-layout/main-wrap/` | components/section, components/container, primitives/radius, system/surfaces | `--ts-this-bg` rounded inset | YES | `_block-spec--main-wrap.md` | Page-wrap composition |
| 108 | widget-wide | `.ts-widget--wide` | ALWAYS STRICT | `sandbox/03-layout/widget-wide/` | components/container, primitives/spacing | N/A | NO | `_block-spec--widget-wide.md` | Section-spanning widget container |
| 109a | modal-overlay | `.ts-modal-overlay` | ALWAYS STRICT | `sandbox/03-layout/modal-overlay/` | primitives/colors, primitives/motion, system/surfaces, components/modal | `--ts-this-bg-overlay` (transparent backdrop); contains `.ts-modal` content slot | YES (full-viewport overlay + scroll lock) | `_block-spec--modal-overlay.md` | **D5 LOCKED — layout positioning + scroll lock + focus trap.** Composition: `.ts-modal-overlay > .ts-modal`. See §3 |
| 109b | section-surface-n | `.ts-section.ts-surface-N` (composition) | ALWAYS STRICT | `sandbox/03-layout/section-surface-n/` | components/section, components/surface-n, system/surfaces | `--ts-this-bg: var(--ts-bg-N)` set on section → propagates to subtree | **YES (always — section + surface utility = canonical surface tier setter)** | `_block-spec--section-surface-n.md` | **D6 LOCKED — layout composition.** The atomic utility lives at §2.1 row 42a. See §4 |
| 110 | overlay | `.ts-overlay`, `.ts-section--overlay` | ALWAYS STRICT | `sandbox/03-layout/overlay/` | primitives/colors, system/surfaces | `--ts-this-bg` alpha (transparent overlay) | YES (full-section overlay) | `_block-spec--overlay.md` | Full-section overlay |
| 111 | panel | `.ts-panel`, `.ts-panel--docked`, `.ts-panel--float`, `.ts-ui-panel`, `.ts-ui-panel--docked`, `.ts-ui-panel--float` | ALWAYS STRICT | `sandbox/03-layout/panel/` | primitives/spacing, primitives/radius, system/surfaces, system/text | `--ts-this-bg: var(--ts-bg-2)` re-scoped | YES (viewport-anchored) | `_block-spec--panel.md` | Docked or floating panels; collapse UIKit and core variants — same component family |
| 112 | oce-shell | `.ts-oce-overlay`, `.ts-oce-panel` | ALWAYS STRICT | `sandbox/03-layout/oce-shell/` | components/oce-internals, components/panel, primitives/motion, system/surfaces | `--ts-this-bg: var(--ts-bg-1)` re-scoped | YES (full-viewport offcanvas) | `_block-spec--oce-shell.md` | Full-viewport offcanvas shell |
| 113 | tree-explorer | `.ts-tree-explorer`, `.ts-tree-explorer__bar`, `.ts-tree-explorer__brand`, `.ts-tree-explorer__brand-mark`, `.ts-tree-explorer__brand-text`, `.ts-tree-explorer__title`, `.ts-tree-explorer__path`, `.ts-tree-explorer__tools`, `.ts-tree-explorer__search`, `.ts-tree-explorer__stats`, `.ts-tree-explorer__actionbar-stats`, `.ts-tree-explorer__body`, `.ts-tree-explorer.boxed`, `.ts-tree-explorer[data-tree-variant="curved"]` | ALWAYS STRICT | `sandbox/03-layout/tree-explorer/` | components/tree, components/chips, components/button, components/input, components/badge, system/surfaces, shared-tokens/strip-layout | `--ts-this-bg: var(--ts-bg-1)` re-scoped | YES | `_block-spec--tree-explorer.md` | Full-app shell hosting tree molecule + actionbar |
| 114 | banner-generator-shell | `.ts-banner-generator-app`, `.ts-generator-app`, `.ts-generator-topbar`, `.ts-generator-topbar-sep`, `.ts-generator-topbar-right`, `.ts-generator-canvas`, `.ts-generator-panel` | ALWAYS STRICT | `sandbox/03-layout/banner-generator-shell/` | components/generator-internals, components/topbar, components/panel | `--ts-this-bg: var(--ts-bg-1)` re-scoped | YES | `_block-spec--banner-generator-shell.md` | Full-app shell |
| 115 | dashboard | `.ts-dashboard` | ALWAYS STRICT | `sandbox/03-layout/dashboard/` | components/grid, components/card, shared-tokens/grid-system | `--ts-this-bg` | YES | `_block-spec--dashboard.md` | Page-level dashboard grid |
| 116 | split-feature-section | `.ts-split-feature` (as section composition) | ALWAYS STRICT | `sandbox/03-layout/split-feature-section/` | components/section, components/split-feature-item, shared-tokens/grid-system | `--ts-this-bg` per section variant | YES | `_block-spec--split-feature-section.md` | Section-level two-side layout |
| 117 | portfolio-section | `.ts-portfolio-section`, `.ts-portfolio-grid` | ALWAYS STRICT | `sandbox/03-layout/portfolio-section/` | components/section, components/portfolio-icon, components/grid | `--ts-this-bg` per variant | YES | `_block-spec--portfolio-section.md` | Portfolio listing section |
| 118 | gallery-lightbox | `.ts-gallery-lightbox`, `.ts-gallery-lightbox--open` | ALWAYS STRICT | `sandbox/03-layout/gallery-lightbox/` | components/gallery, primitives/motion, system/surfaces | `--ts-this-bg-overlay` | YES (full-viewport) | `_block-spec--gallery-lightbox.md` | Full-viewport lightbox overlay |
| 119 | marquee-fullwidth | `.ts-marquee.fullwidth.ts-marquee-container` | ALWAYS STRICT | `sandbox/03-layout/marquee-fullwidth/` | components/marquee, primitives/motion, system/surfaces | Inherits marquee + viewport-width treatment | YES (spans viewport) | `_block-spec--marquee-fullwidth.md` | LAYOUT promotion of the molecular marquee. Per T1 §8.2: A3 deferred to S5 for tier-promotion mechanism (modifier flag on single block-spec vs two block-specs). **S3 picks: two block-specs.** Cleaner per S5 protocol — sandbox + parity rig + audit run separately |
| 120 | preloader | `.ts-preloader`, `.ts-preloader--minimal-bar` | ALWAYS STRICT | `sandbox/03-layout/preloader/` | primitives/colors, primitives/motion, system/surfaces | `--ts-this-bg: var(--ts-bg-body)` page floor | YES (full-viewport) | `_block-spec--preloader.md` | Full-viewport boot screen + FOUC guard |
| 121 | effects-parallax | `.ts-parallax`, `.ts-bg-parallax` | ALWAYS STRICT | `sandbox/03-layout/effects-parallax/` | primitives/motion, system/surfaces | Inherits bg | YES (section-scope) | `_block-spec--effects-parallax.md` | Default LAYOUT per T1 tie-breaker rule 1 |
| 122 | section-accent-band | `.ts-section--accent-band` + variants | ALWAYS STRICT | `sandbox/03-layout/section-accent-band/` | components/section, components/glow-shimmer-scanline | `--ts-this-bg-accent-glow` | YES | `_block-spec--section-accent-band.md` | Section with multi-layer surface compositions |
| 123 | lush-mode-wrapper | `.ts-lush-mode`, `.ts-gradient-ui` | ALWAYS STRICT | `sandbox/03-layout/lush-mode-wrapper/` | system/surfaces, primitives/motion | Surface-swap globally | YES (page-wide) | `_block-spec--lush-mode-wrapper.md` | Page-mode wrappers |
| 124 | viewport-paused | `.ts-viewport-paused` | ALWAYS STRICT | `sandbox/03-layout/viewport-paused/` | primitives/motion | N/A | YES (page-state) | `_block-spec--viewport-paused.md` | Page-state affecting all animation engines |
| 125 | masonry-hero | `.ts-masonry-hero-bg`, `.ts-masonry-hero-text`, `.ts-ui-masonry--v2/lanes/grid` | ALWAYS STRICT | `sandbox/03-layout/masonry-hero/` | components/grid, components/headline-presets, primitives/spacing | `--ts-this-bg` per variant | YES | `_block-spec--masonry-hero.md` | Section-level masonry layout |
| 126 | bg-slider | `.ts-bg-slider` | ALWAYS STRICT | `sandbox/03-layout/bg-slider/` | primitives/motion, components/slider-dot, components/bg-utilities | `--ts-this-bg` per slide | YES (section-scope) | `_block-spec--bg-slider.md` | Section-level slideshow bg |
| 127 | footer-socket | `.ts-footer-socket` | ALWAYS STRICT | `sandbox/03-layout/footer-socket/` | components/footer-copyright, components/social-links-group, primitives/spacing | `--ts-this-bg: var(--ts-bg-2/3)` | YES | `_block-spec--footer-socket.md` | Bottom-most footer band. Note: also referenced at row 103 page-footer — this is the SOCKET sub-layout |
| 128 | resizable-container | `.ts-resizable-wrap`, `.ts-resizable`, `.ts-ui-resizable`, `.ts-ui-draggable--dragging`, `.ts-ui-draggable-bounds`, `.ts-ui-sortable` | ALWAYS STRICT | `sandbox/03-layout/resizable-container/` | primitives/motion, system/states | `--ts-this-bg-border` (drag bounds) | YES (layout wrappers) | `_block-spec--resizable-container.md` | Layout-wrapper behaviors with bounds + global mouse events |

**Layout count: 35 families (rows 94-128, with row 42b promoted from atomic-half of D6 and row 109a from D5 split).**

### §2.4 — TOTAL classification (post-D5/D6 splits)

| Tier | Pre-split count (T1 §2.4) | Post-split count (S3) | Autonomous behavior |
|---|---|---|---|
| ATOMIC / PERMISSIVE | 44 | 44 (row 42 stays atomic at 42a; new layout 42b adds to layout) | Auto-progress overnight; PR opens, owner reviews next morning |
| MOLECULAR / STRICT | 49 | 49 (row 58 modal stays molecular; D5 adds new layout 109a modal-overlay) | Sub-agent completes, halts for owner approval before commit |
| LAYOUT / ALWAYS STRICT | 35 | 37 (D5 adds row 109a modal-overlay; D6 adds row 109b section-surface-n) | Owner approves every step |
| **TOTAL** | **128** | **130** | |

**The D5 + D6 splits add 2 rows to LAYOUT tier (not pulling from atomic/molecular — both halves of each split remain registered).**

---

## §3 — D5 MODAL SPLIT (locked architecture, two-row registration)

D5 LOCKED at Gate 4: modal splits into two block-specs. Mirrors `.ts-oce-overlay` + `.ts-oce-panel` pattern from the offcanvas editor.

| # | Block name | Selector | Tier | Sandbox folder | Role | `@ts-deps:` | Surface re-scope |
|---|---|---|---|---|---|---|---|
| **109a** | `modal-overlay` | `.ts-modal-overlay` | **ALWAYS STRICT (LAYOUT)** | `sandbox/03-layout/modal-overlay/` | Viewport positioning, scroll lock, focus trap, transparent backdrop. Contains a `.ts-modal` content slot | primitives/colors, primitives/motion, system/surfaces, components/modal | YES (full-viewport overlay) |
| **58** | `modal` | `.ts-modal`, `.ts-modal--sm/lg/xl` | **STRICT (MOLECULAR)** | `sandbox/02-molecular/modal/` | Content shell — header/body/footer slots, close button, surface, radius, inner padding | primitives/colors, primitives/spacing, primitives/radius, system/surfaces, system/text, system/states, components/button | YES (inward — content shell re-scopes for its descendants) |

### §3.1 — Composition

```html
<div class="ts-modal-overlay" aria-modal="true" role="dialog">
  <div class="ts-modal ts-modal--md">
    <!-- modal-overlay handles backdrop + focus trap + scroll lock -->
    <!-- modal handles content shell, surface, padding, close button -->
    ...
  </div>
</div>
```

### §3.2 — Why split

- **Different concerns:** overlay owns viewport-level behavior (scroll lock, focus trap, backdrop click-to-dismiss). Modal owns content-level styling (surface tier, padding, radius, slot layout).
- **Different tier:** overlay touches every page that uses a modal — ALWAYS STRICT; content shell is one of many molecular blocks — STRICT.
- **Reusable shell:** non-modal use cases (drawer, sheet, fullscreen-takeover) could compose the overlay with a different content block.
- **Mirrors offcanvas pattern:** the offcanvas editor at row 112 already uses `.ts-oce-overlay` + `.ts-oce-panel`. Modal follows the same convention.

### §3.3 — Building order

Sessions 4+: build `.ts-modal` (molecular, STRICT) FIRST, then `.ts-modal-overlay` (layout, ALWAYS STRICT). Overlay consumes modal — `@ts-deps: components/modal`.

---

## §4 — D6 SURFACE-N SPLIT (locked architecture, two-row registration)

D6 LOCKED at Gate 4: surface-N splits into atomic utility + layout composition.

| # | Block name | Selector | Tier | Sandbox folder | Role | `@ts-deps:` | Surface re-scope |
|---|---|---|---|---|---|---|---|
| **42a** | `surface-n` (atomic) | `.ts-surface-0/1/2/3/4/5`, `.ts-surface`, `.ts-surface-glass/gradient/mesh/grid` | **PERMISSIVE (ATOMIC)** | `sandbox/01-atomic/surface-n/` | Pure utility class: sets surface tier on the element it's applied to. No descendant propagation (the element is small — a card, an inset, a small container). | primitives/colors, system/surfaces | NO (utility variant applies to the element only; surface tier is consumed via `--ts-this-bg` direct mapping but does NOT propagate downstream automatically — only when on a section) |
| **109b** | `section-surface-n` | `.ts-section.ts-surface-N` (composition) | **ALWAYS STRICT (LAYOUT)** | `sandbox/03-layout/section-surface-n/` | Layout composition: applied to `.ts-section`, sets surface tier for entire descendant subtree per Rule 4. | components/section, components/surface-n, system/surfaces | YES (always — section is the canonical surface-tier setter; the combination becomes a propagating layout primitive) |

### §4.1 — Composition contract

```html
<!-- Atomic utility — applies to one element, NO descendant propagation -->
<div class="ts-card ts-surface-2">
  <p>Card with surface-2 background; this paragraph still resolves against parent context unless card sets --ts-this-bg explicitly</p>
</div>

<!-- Layout composition — applies to section, PROPAGATES surface tier -->
<section class="ts-section ts-surface-2">
  <!-- All descendants resolve --ts-this-bg-* derivative chain against bg-2 -->
  <p>Paragraph inherits surface-2 context</p>
  <div class="ts-card">Card inherits surface-2 base — its own re-scope still applies inward</div>
</section>
```

### §4.2 — Why split

- **Avoid context-dependent typology** (T1 §8.3 originally flagged the issue).
- **Atomic utility** = paint-yourself-only, sub-agent auto-progress safe.
- **Layout composition** = sets tier for subtree → mistakes cascade → ALWAYS STRICT.
- **Cleaner block-spec authoring:** each spec has one job. The atomic spec doesn't need to reason about subtree propagation; the layout spec doesn't need to reason about standalone usage.

### §4.3 — How the split distinguishes at consumption time

S6 governance enforces: if a sandbox HTML uses `.ts-section.ts-surface-N` it MUST load BOTH the atomic and layout CSS blocks via `@ts-deps:` (the layout block's deps include `components/section, components/surface-n`). If a sandbox uses `.ts-surface-N` alone on a non-section element, only the atomic block CSS loads.

---

## §5 — A6 UIKIT ALIASING DECISIONS

A6 LOCKED to S3 case-by-case decision per T1 §8.6. The rule: a UIKit `ts-ui-*` selector gets a **separate block** if it adds genuine behavior or visual distinction; it **collapses into the core block** if it's a pure alias. Documentation includes rationale per case.

| `ts-ui-*` selector | Decision | Core block (if collapsed) OR Separate block name (if separate) | Rationale |
|---|---|---|---|
| `.ts-ui-spinner` | **SEPARATE → atomic block 16** (§2.1) | `spinner` (atomic, row 16) | The only UIKit spinner; no core `.ts-spinner` exists. The `ts-ui-*` prefix is historical only; the rebuild gives it its own atomic block-spec |
| `.ts-ui-select` | **SEPARATE → molecular block 54** (§2.2) | `ui-select` (molecular, row 54) | Custom dropdown with JS controller — genuine behavior unique to UIKit. Native `.ts-select` (atomic, row 5) coexists |
| `.ts-ui-accordion`, `.ts-ui-accordion--separated/dual-icon` | **SEPARATE → molecular block 57** (§2.2) | `ui-accordion` (molecular, row 57) | UIKit variants add `--separated` (gap-spacing variant) and `--dual-icon` (twist + chevron) behaviors. Core `.ts-accordion` (row 56) is the baseline |
| `.ts-ui-table--sortable`, `.ts-ui-table--bulk`, `.ts-ui-table-scroll`, `.ts-ui-table-bulk-wrap` | **SEPARATE → molecular block 66** (§2.2) | `ui-table-sortable-bulk` (molecular, row 66) | Sortable header click handlers + bulk-select coordination + scroll wrapper. Core `.ts-table` (row 65) is the baseline |
| `.ts-ui-bulk-bar` | **SEPARATE → molecular block 67** (§2.2) | `bulk-bar` (molecular, row 67) | No core `.ts-bulk-bar`; UIKit-exclusive feature for tables |
| `.ts-ui-number-btn`, `.ts-ui-number-input-wrapper`, `.ts-ui-number-input-controls` | **SEPARATE → atomic 28 + molecular 51** (§2.1, §2.2) | `number-input-btn` (atomic 28); `number-input-wrapper` (molecular 51) | No core variants; UIKit-exclusive |
| `.ts-ui-row-checkbox`, `.ts-ui-checkbox-cell` | **SEPARATE → atomic block 29** (§2.1) | `bulk-bar-row-checkbox` (atomic, row 29) | Inline cell controls for bulk-table; UIKit-exclusive variant of checkbox |
| `.ts-ui-toast`, `.ts-ui-toast--in/out`, `.ts-ui-toast-stack`, `.ts-ui-toast-display` | **MERGED INTO CORE → molecular block 59 + 84** (§2.2) | `toast` (row 59); `toast-stack` (row 84) | UIKit toast tokens (`--in/--out`) are animation variants of the same toast block. Collapse `ts-ui-toast` to `ts-toast` at the rebuild block-spec level; aliases preserved via legacy selectors in the CSS rule body if needed for compat |
| `.ts-ui-panel`, `.ts-ui-panel--docked`, `.ts-ui-panel--float` | **MERGED INTO CORE → layout block 111** (§2.3) | `panel` (row 111) | UIKit panels are docked/floating variants of the same panel layout. Collapse to single block; aliases preserved |
| `.ts-ui-masonry--v2/lanes/grid` | **MERGED INTO LAYOUT → layout block 125** (§2.3) | `masonry-hero` (row 125) | UIKit masonry variants compose into the section-level masonry layout. The non-hero masonry usage joins the same block-spec |
| `.ts-ui-resizable`, `.ts-ui-draggable--dragging`, `.ts-ui-draggable-bounds`, `.ts-ui-sortable` | **MERGED INTO CORE → layout block 128** (§2.3) | `resizable-container` (row 128) | UIKit drag/resize/sort behaviors collapse into one layout-wrapper block. Aliases preserved in CSS rule body |
| `.ts-ui-checkbox-group` (pure alias of `.ts-checkbox-group`) | **MERGED INTO CORE → molecular block 48** (§2.2) | `checkbox-row` (row 48) | Pure visual alias; same rule body. The block-spec CSS includes both selectors via `:is(.ts-checkbox-group, .ts-ui-checkbox-group)` per T1 §5.2 |

### §5.1 — Aliasing summary

- **6 separate UIKit blocks** (rows 16, 28, 29, 51, 54, 57, 66, 67 — atomic 28/29, molecular 51/54/57/66/67, plus atomic 16 spinner): genuine behavioral/visual differentiation
- **5 merged into core**: toast/panel/masonry/resizable/checkbox-group — pure aliases or unified variants
- **Convention going forward:** new `ts-ui-*` selectors entering the codebase get an A6 ruling at registration time. S6 governance flags any new `ts-ui-*` without an A6 entry

### §5.2 — Selector-fold rule

When merging UIKit alias into core (`.ts-ui-checkbox-group` → `.ts-checkbox-group`), the block-spec CSS preserves backward compat via `:is(...)` enumeration:

```css
:is(.ts-checkbox-group, .ts-ui-checkbox-group) {
  /* rule body */
}
```

Per T1 §5.2 explicit enumeration over substring-match.

---

## §6 — `@taxonomy_chips_strip` DESIGN CONTRACT (Rule 9 — locked carrier)

This section carries the 10 KEY STYLE FACTORS for the `.ts-chips` molecular block (registry row 50, §2.2). Verbatim from T1 §6.1. **Every Session 4+ sub-agent building the chips block MUST satisfy all 10.**

### §6.1 — Verbatim contract (from T1 §6.1, source `../toolskin-showcase/assets/css/toolskin.css:33986-34032`)

> **@taxonomy_chips_strip — KEEP design output identical; refactor structure only**
>
> THIS IS A PERSONALIZED, PERFECTED DESIGN. Visual output must remain pixel-identical. Only improve token usage, scoping, and reusability — do not redesign.
>
> **KEY STYLE FACTORS TO PRESERVE (must survive any refactor):**
>
> 1. **Border-inline frame + bordered surface using `--ts-this-bg-border`.**
> 2. **Horizontal flex strip**, `flex-wrap: nowrap`, `min-width: 0`, single-row.
> 3. **Height locked to `calc(var(--ts-tree-actionbar-h) - 2px)`** so the strip aligns to the action-bar row without overflowing it.
> 4. **The two edge-fade gradients (left/right)** that signal scrollable content:
>    - `--_grad_dark` = color-mix of `--ts-this-bg-dark-2` + 30% transparent
>    - `--_grad_bg` = color-mix of `--ts-this-bg-dark-1` + 90% transparent
>    - Fade width tokenized via `--_-grad-w` (currently 25px)
>    - `--ts-this-bg-grad-dark-pct: 2%` — global dark-variant intensity knob. This is a well-built global token that scales the `--ts-this-bg-dark-*` family in both light and dark mode without spawning new rules or variant tokens. KEEP IT — do not refactor away as "unused"; its effect lands through the global dark-variant pipeline, not through a direct reference in this rule.
>    - These are the visual cue that the strip is scrollable. Do not remove.
> 5. **`--ts-this-bg: var(--ts-bg-1)` surface re-scoping** so children inherit the correct contextual background.
> 6. **Width-priority:** `flex: 1 1 var(--_chips-max-w)` so the strip claims the row's available space ahead of its siblings.
> 7. **`--_chips-max-w: calc(100% - (var(--ts-chip-size, var(--ts-btn-h)*2)*1))`** — The fallback math is intentional. `--ts-chip-size` is defined on other scopes but not on this one — for this strip, the fallback expression `var(--ts-btn-h)*2` evaluates to the equivalent value. Leave the expression as written. Do not "simplify" the `*1`, do not collapse the fallback, do not pull `--ts-chip-size` onto this scope.
>
> **COLOR USAGE — WHY THESE TOKENS:**
>
> 8. **`--ts-this-bg-dark`** → base surface, one step darker than the action bar to recess the strip visually.
> 9. **`--ts-this-bg-dark-1/2`** → gradient stops; -1 is the near-transparent interior, -2 is the opaque edge fade. Mixed with `transparent` so the fade reads against whatever the parent surface is (no hardcoded color baked in).
> 10. **`--ts-this-bg-border`** → frame matches every other tokenized container in the system; do not swap for a literal.

### §6.2 — Refactor requirements (from T1 §6.3, locked carrier for Sessions 4+)

Beyond preserving the 10 factors, the chips block-spec must include:

1. **SCOPED ROOT TOKEN SETUP (chips variant)** — wrap variant overrides into a scoped root token block. Tokenized VARIANT pattern.
2. **HORIZONTAL SCROLL — REPLACE THE CURRENT METHOD** — native `overflow-x: auto` is not intuitively scrollable. Solve with better CSS-only method OR small JS module (drag-to-scroll + edge buttons). Expose as GLOBAL reusable asset — `.ts-scrollstrip` or `.ts-actionbar-scroll` — usable elsewhere.
3. **TRUNCATION DROPDOWN (accessibility companion)** — `toolskin.js` already ships a truncation-dropdown helper. Wire it in so a "more filters" / overflow trigger appears beside the scrollable region.
4. **ROW SIBLING SHRINK / COLLAPSE PRIORITY** — chips strip needs WIDTH PRIORITY over the other two siblings on its row. Add media queries (or container queries — preferred if the row is a CQ context) so siblings collapse to icon-only mode as the row narrows.

### §6.3 — How this carrier feeds Session 4+ chips block-spec

The Session-4+ `_block-spec--chips.md` will:
1. Reproduce §6.1 + §6.2 verbatim as the block's "DESIGN CONTRACT — DO NOT REFACTOR AWAY" preamble.
2. Acceptance criteria includes pixel-parity audit + presence of all 10 factors verified via cascade probe (per A1 R2 — render fixture, diff against sandbox snapshot).
3. Any sub-agent proposal violating any of the 10 factors HALTS per Rule 11 and surfaces to owner.

---

## §7 — FIVE SKETCH BLOCK-SPECS (inline; do not write actual files)

These are sketches of what `_block-spec--<name>.md` will look like in Sessions 4+. Per orchestration brief restrictions: **no actual block-spec files are written this session.** These sketches inform S5 protocol design and provide concrete examples for Session 4 dispatch.

All five are ATOMIC / PERMISSIVE tier. They demonstrate the auto-progress flow.

### §7.1 — Sketch: `_block-spec--button.md`

```markdown
# Button — Block Spec

**Block:** button
**Tier:** PERMISSIVE (atomic)
**Sandbox:** sandbox/01-atomic/button/
**Selectors:** .ts-btn, .ts-btn--sm/md/lg/xl/full, .ts-btn--accent/alt/danger/success
**Block-spec filename:** _block-spec--button.md

## @ts-deps (header in components/button.css)

/* @ts-deps: primitives/colors, primitives/spacing, primitives/typography, primitives/radius, system/surfaces, system/text, system/states */

## Color contract

- Surface: `--ts-this-bg` (idle), `--ts-this-bg-dark` (hover via S2 §3.5), `--ts-this-bg-active` (active), `--ts-this-bg-disabled` (disabled).
- Text: `--ts-this-color` (idle), `--ts-this-color-muted` (disabled).
- Border: `--ts-this-bg-border`, `--ts-this-bg-border-active`, `--ts-this-bg-border-focus`, `--ts-this-bg-border-disabled`.
- Accent variant: consumes `--ts-accent` + `--ts-accent-hover/-active/-focus/-disabled` from S2 §8.
- NEVER raw colors. NEVER filter: brightness(). NEVER rgba() overlays.

## State coverage (S2 §7 5-state pattern — REQUIRED)

| State | Selector | Background | Border | Color |
|---|---|---|---|---|
| Idle | `.ts-btn` | `--ts-this-bg-grad` | `--ts-this-bg-border` | `--ts-on-surface` |
| Hover | `.ts-btn:hover` | `--ts-this-bg-hover-grad` | `--ts-this-bg-border-hover` | (inherits idle) |
| Active | `.ts-btn:active` | `--ts-this-bg-active-grad` | `--ts-this-bg-border-active` | (inherits idle) |
| Focus | `.ts-btn:focus-visible` | (inherits idle) | `--ts-this-bg-border-focus` + outline `--ts-this-bg-focus-outline` | (inherits idle) |
| Disabled | `.ts-btn:disabled, .ts-btn[aria-disabled="true"]` | `--ts-this-bg-disabled` | `--ts-this-bg-border-disabled` | `--ts-this-color-muted` |

## HTML structure example

```html
<main id="block-slot" data-block="button" data-block-tier="atomic">
  <button class="ts-btn">Default button</button>
  <button class="ts-btn ts-btn--accent">Accent button</button>
  <button class="ts-btn ts-btn--lg">Large button</button>
  <button class="ts-btn" disabled>Disabled</button>
</main>
```

## Acceptance criteria (PERMISSIVE auto-progress per S5)

1. **Parity threshold:** parity-rig iframe (T2 §5) shows pixel match ≥ 98% against `.ts-btn` in `../toolskin-showcase/assets/css/toolskin.css`. Manual diff this session; auto-diff Session N (T2 §5.6 TODO).
2. **All 5 states declared.** S6 lint verifies presence.
3. **No `!important`.** S6 pre-commit hook enforces (per file 01 hard constraint).
4. **No raw colors.** S6 audit greps for `#[0-9a-fA-F]{3,8}` or `rgb`/`oklch(<literal>` in components/button.css. Must be ZERO matches.
5. **APCA contrast passes** for `--ts-this-color` on every state's `--ts-this-bg-*` per S1 §8 contrast table.
6. **Cascade probe** (per A1 R2) renders sandbox fixture, diffs against bundler-emitted output. Must match.
7. **Topo-sort succeeds** (per A1 Q3) — `@ts-deps` resolves, no cycles, no missing deps.

## On pass
Sub-agent opens PR, advances to next atomic block, owner reviews PR at next sit-down.

## On fail
HALT, write diagnostic report, surface to owner per Rule 11.
```

### §7.2 — Sketch: `_block-spec--input.md`

```markdown
# Input — Block Spec

**Block:** input
**Tier:** PERMISSIVE (atomic)
**Sandbox:** sandbox/01-atomic/input/
**Selectors:** .ts-input, .ts-input--mono

## @ts-deps

/* @ts-deps: primitives/colors, primitives/spacing, primitives/typography, primitives/radius, system/surfaces, system/text, system/states */

## Color contract

- Surface: `--ts-this-bg-dark` (input recessed below parent surface), `--ts-this-bg-dark-1` (focus state lift).
- Text: `--ts-this-color` (entered text), `--ts-this-color-muted` (placeholder).
- Border: `--ts-this-bg-border`, `--ts-this-bg-border-focus`, `--ts-this-bg-border-disabled`.
- Mono variant: `--ts-input--mono` consumes `--ts-font-mono` from primitives/typography.

## State coverage (5-state pattern — REQUIRED)

| State | Selector | Border | Background | Caret |
|---|---|---|---|---|
| Idle | `.ts-input` | `--ts-this-bg-border` | `--ts-this-bg-dark` | currentColor |
| Hover | `.ts-input:hover` | `--ts-this-bg-border-hover` | `--ts-this-bg-dark` | currentColor |
| Focus | `.ts-input:focus-visible` | `--ts-this-bg-border-focus` (2px) | `--ts-this-bg-dark-1` (subtle lift) | `--ts-accent` |
| Disabled | `.ts-input:disabled` | `--ts-this-bg-border-disabled` | `--ts-this-bg-disabled` | n/a |
| Placeholder | `.ts-input::placeholder` | (inherits idle) | (inherits idle) | n/a (color: `--ts-this-color-muted`) |

## HTML structure example

```html
<main id="block-slot" data-block="input" data-block-tier="atomic">
  <input type="text" class="ts-input" placeholder="Default input" />
  <input type="text" class="ts-input ts-input--mono" placeholder="Mono input" value="0xABC123" />
  <input type="email" class="ts-input" placeholder="Email" disabled />
</main>
```

## Acceptance criteria

(Same 7-point checklist as button — parity, 5 states, no `!important`, no raw colors, APCA contrast, cascade probe, topo-sort.)
```

### §7.3 — Sketch: `_block-spec--chip.md`

```markdown
# Chip — Block Spec

**Block:** chip
**Tier:** PERMISSIVE (atomic)
**Sandbox:** sandbox/01-atomic/chip/
**Selectors:** .ts-chip, .ts-chip--accent/success/warning/danger, .ts-chip--active, [aria-selected]
**Note:** The CHIPS STRIP (.ts-chips, molecular row 50) consumes this atom and is GOVERNED BY §6 (Rule 9 contract). The chip atom itself is NOT subject to the 10 factors — only the strip is.

## @ts-deps

/* @ts-deps: primitives/colors, primitives/spacing, primitives/typography, primitives/radius, system/surfaces, system/text, system/states, shared-tokens/strip-layout */

## Color contract

- Surface: `--ts-this-bg` (idle, but typically inside strip context which re-scopes to `--ts-bg-1`); accent variant consumes `--ts-accent` for fill.
- Text: `--ts-this-color`; accent variant uses `--ts-on-accent` for legibility.
- Border: `--ts-this-bg-border`, `--ts-this-bg-border-active` (selected), `--ts-this-bg-border-focus`.
- Status variants (success/warning/danger) consume status-color tokens from S1.
- The `--active` and `[aria-selected]` selected states share styling (consume `--ts-accent` + `--ts-on-accent`).

## State coverage

| State | Selector | Background | Color |
|---|---|---|---|
| Idle | `.ts-chip` | `--ts-this-bg-1` (within strip) | `--ts-this-color` |
| Hover | `.ts-chip:hover` | `--ts-this-bg-hover-grad` | (inherits idle) |
| Active/Selected | `.ts-chip--active, .ts-chip[aria-selected="true"]` | `--ts-accent` | `--ts-on-accent` |
| Focus | `.ts-chip:focus-visible` | (inherits idle) | (outline `--ts-accent`) |
| Status variants | `.ts-chip--accent/success/warning/danger` | status-color tinted derivative | computed `--ts-on-<status>` |

## HTML structure example

```html
<main id="block-slot" data-block="chip" data-block-tier="atomic">
  <span class="ts-chip">Default</span>
  <span class="ts-chip ts-chip--active">Selected</span>
  <span class="ts-chip ts-chip--accent">Accent</span>
  <span class="ts-chip ts-chip--success">Success</span>
  <span class="ts-chip ts-chip--danger">Danger</span>
</main>
```

## Acceptance criteria

(Standard 7-point checklist.)
```

### §7.4 — Sketch: `_block-spec--badge.md`

```markdown
# Badge — Block Spec

**Block:** badge
**Tier:** PERMISSIVE (atomic)
**Sandbox:** sandbox/01-atomic/badge/
**Selectors:** .ts-badge, .ts-badge--accent/success/warning/danger/alt/purple/cyan, .ts-badge-color

## @ts-deps

/* @ts-deps: primitives/colors, primitives/spacing, primitives/typography, primitives/radius, system/surfaces, system/text */

## Color contract

- Surface: tinted derivative of status-color via `color-mix` (S2 system layer composes); idle is `--ts-this-bg` or `--ts-this-bg-1`.
- Text: `--ts-this-color`; status variants resolve their own `--ts-on-<status>` text.
- Status-variant tokens (accent/success/warning/danger/alt/purple/cyan) are from S1 primitives.
- `.ts-badge-color` accepts dynamic color via CSS custom property override at the element level (the only block in the registry that accepts inline-style color input for ad-hoc tinting; documented in block spec).

## State coverage

Badges are non-interactive. ONLY idle state is required.

| State | Selector | Background | Color |
|---|---|---|---|
| Idle | `.ts-badge` | `--ts-this-bg` tinted | `--ts-this-color` |
| Variant — accent | `.ts-badge--accent` | `--ts-accent-tinted` | `--ts-on-accent` |
| Variant — success/warning/danger | `.ts-badge--<status>` | `--ts-<status>-tinted` | `--ts-on-<status>` |
| Variant — alt/purple/cyan | `.ts-badge--<color>` | tinted derivative of named color | computed |

## HTML structure example

```html
<main id="block-slot" data-block="badge" data-block-tier="atomic">
  <span class="ts-badge">Default</span>
  <span class="ts-badge ts-badge--accent">v1.0</span>
  <span class="ts-badge ts-badge--success">Active</span>
  <span class="ts-badge ts-badge--danger">Critical</span>
  <span class="ts-badge ts-badge--alt">Alt</span>
</main>
```

## Acceptance criteria

(Standard 7-point checklist, modified: only idle state required since badge is non-interactive.)
```

### §7.5 — Sketch: `_block-spec--toggle.md`

```markdown
# Toggle — Block Spec

**Block:** toggle
**Tier:** PERMISSIVE (atomic)
**Sandbox:** sandbox/01-atomic/toggle/
**Selectors:** .ts-toggle, .ts-toggle--sm/lg/xl

## @ts-deps

/* @ts-deps: primitives/colors, primitives/spacing, primitives/radius, system/surfaces, system/states */

## Color contract

- Off state surface: `--ts-this-bg-dark` (track), `--ts-this-color-muted` (knob).
- On state surface: `--ts-accent` (track), `--ts-on-accent` (knob).
- Border: `--ts-this-bg-border` idle, `--ts-this-bg-border-focus` on `:focus-visible`.
- Transition: `--ts-dur-fast` from primitives/motion (S1 token).

## State coverage (interactive — 5 states + on/off binary)

| State | Selector | Track | Knob |
|---|---|---|---|
| Off — idle | `.ts-toggle` (default) | `--ts-this-bg-dark` | `--ts-this-color-muted` |
| Off — hover | `.ts-toggle:hover` | `--ts-this-bg-dark-1` | (inherits) |
| Off — focus | `.ts-toggle:focus-visible` | `--ts-this-bg-dark` | outline `--ts-this-bg-border-focus` |
| Off — disabled | `.ts-toggle:disabled` | `--ts-this-bg-disabled` | `--ts-this-color-muted` (60% alpha) |
| On — idle | `.ts-toggle[aria-checked="true"]` | `--ts-accent` | `--ts-on-accent` |
| On — hover | `.ts-toggle[aria-checked="true"]:hover` | `--ts-accent-hover` | `--ts-on-accent` |
| On — active | `.ts-toggle[aria-checked="true"]:active` | `--ts-accent-active` | `--ts-on-accent` |
| On — focus | `.ts-toggle[aria-checked="true"]:focus-visible` | `--ts-accent` | outline `--ts-accent` |
| On — disabled | `.ts-toggle[aria-checked="true"]:disabled` | `--ts-accent-disabled` | (50% alpha) |

## HTML structure example

```html
<main id="block-slot" data-block="toggle" data-block-tier="atomic">
  <button type="button" class="ts-toggle" role="switch" aria-checked="false" aria-label="Toggle off"></button>
  <button type="button" class="ts-toggle ts-toggle--lg" role="switch" aria-checked="true" aria-label="Toggle on"></button>
  <button type="button" class="ts-toggle" role="switch" aria-checked="false" aria-label="Disabled" disabled></button>
</main>
```

## Acceptance criteria

(Standard 7-point checklist + verify aria-checked transitions trigger correct visual state. Transition timing uses --ts-dur-fast.)
```

---

## §8 — STANDARD `_block-spec.md` TEMPLATE (every Session 4+ block-spec follows this)

```markdown
# <Block Name> — Block Spec

**Block:** <canonical-kebab-name>
**Tier:** <PERMISSIVE | STRICT | ALWAYS STRICT>
**Sandbox:** sandbox/<00-foundation|01-atomic|02-molecular|03-layout>/<block-name>/
**Selectors:** <primary selector(s) verbatim from registry §2>
**Block-spec filename:** _block-spec--<name>.md
**Registry row:** §2.<1|2|3> row #<N>
**Wave 1.5 Design DNA pointer:** <reference to relevant section in _rebuild-design-dna.md when Wave 1.5 lands>

## 1. @ts-deps (header in components/<name>.css)

/* @ts-deps: <comma-separated dep list from registry §2 row> */

## 2. Color contract

- Surface: <which --ts-this-bg-* tokens this block consumes>
- Text: <which --ts-this-color-* tokens>
- Border: <which --ts-this-bg-border-* tokens>
- Accent: <if applicable, which --ts-accent-* tokens>
- Surface re-scope behavior: <NO | YES INWARD | YES OUTWARD (layout-only)>
- Status-color tokens consumed: <list, if any>
- Forbidden: NEVER raw colors, NEVER filter: brightness(), NEVER rgba() overlays, NEVER hex/rgb/oklch() literals in component CSS.

## 3. State coverage (5-state pattern per S2 §7 — REQUIRED if interactive)

| State | Selector | Background | Border | Color |
|---|---|---|---|---|
| Idle | <selector> | <token> | <token> | <token> |
| Hover | <selector> | <token> | <token> | <token> |
| Active | <selector> | <token> | <token> | <token> |
| Focus | <selector> | <token> | <token> | <token> |
| Disabled | <selector> | <token> | <token> | <token> |

Non-interactive blocks: only idle state required. Justify in this section.

## 4. HTML structure

```html
<main id="block-slot" data-block="<name>" data-block-tier="<tier>">
  <!-- Block markup -->
</main>
```

(Per T2 §6 slot pattern — the only structural region a sandbox session edits.)

## 5. CSS scaffold

(Sub-agent fills this with the actual rule body conforming to color contract + state coverage + surface re-scope behavior. Per A1 Resolution: file begins with `@ts-deps` comment header.)

```css
/* @ts-deps: <deps> */

.ts-<name> {
  /* idle state — uses --ts-this-bg + var() consumption only */
}

/* state rules per §3 */
```

## 6. Acceptance criteria

(Per S5 protocol tier — full criteria expanded based on tier.)

1. Parity threshold: pixel match ≥ <T1-derived threshold> against `../toolskin-showcase/assets/css/toolskin.css` reference rendered in T2 parity-rig iframe.
2. All required states declared (per §3 above).
3. No `!important` (S6 pre-commit hook).
4. No raw colors (S6 audit).
5. APCA contrast passes for every text-on-surface pair (S1 §8 contrast table).
6. Cascade probe passes — sandbox fixture renders identical when assembled by S4 bundler.
7. Topo-sort succeeds — `@ts-deps` resolves, no cycles, no missing deps.
8. <tier-specific criteria — see S5 protocol spec for STRICT halt-conditions, ALWAYS STRICT owner-checkpoint conditions>

## 7. Parity check

(How to run the visual comparison vs reference.)

1. `python -m http.server` from one level above the rebuild repo.
2. Open `http://localhost:8000/toolskin-rebuild/sandbox/<tier>/<name>/`.
3. Click "Compare with v1" parity-rig toggle.
4. Manual eye diff OR (Session N+) auto-pixelmatch.

## 8. On pass / On fail

- **Pass (PERMISSIVE):** Sub-agent opens PR, advances to next block per S5 priority queue.
- **Pass (STRICT):** Sub-agent HALTS for owner approval before commit. Diff + audit + screenshots surfaced.
- **Pass (ALWAYS STRICT):** Sub-agent presented work to owner at every checkpoint; this is the final-step approval gate.
- **Fail (any tier):** HALT, write diagnostic to `docs/handoffs/_block-fail-<name>-<date>.md`, surface to owner per Rule 11.

## 9. Open questions / notes

(Block-specific gaps, references to Wave 1.5 Design DNA, special design contracts e.g. §6 chips contract.)
```

---

## §9 — NAMING-COLLISION DOCUMENTATION

Per file 05 tier hierarchy + queue document §"In-house Tier 1 skill references" — there are TWO confusable name collisions every sub-agent must avoid.

### §9.1 — `design-tokens` vs `design-tokens-2.0`

| Skill name | Path | Tier | Authority |
|---|---|---|---|
| `design-tokens-2.0` | `.claude/skills/design-tokens-2.0/SKILL.md` | **TIER 1 — IN-HOUSE AUTHORITATIVE** | **The canonical Toolskin token rules.** Three-tier primitive → system → component architecture. `--ts-this-bg` engine. OKLCH auto-contrast. 337-reference migration. Rule 15 apcach supremacy adapter. |
| `design-tokens` (julianoczkowski) | `.claude/skills/design-tokens/SKILL.md` | TIER 2 — WORKFLOW DISCIPLINE | Generic workflow skill. NOT Toolskin-specific. Process/discipline only — no design authority. |

**Rule:** When ANY question is Toolskin-specific (custom property naming, surface superposition, derivative chain, OKLCH math), the sub-agent uses `design-tokens-2.0`. The generic `design-tokens` skill is workflow-only.

**If sub-agent triggers the wrong skill:** halt, override, cite this section.

### §9.2 — `frontend-design` (julianoczkowski) vs Anthropic's `/mnt/skills/public/frontend-design/`

| Skill name | Path | Tier | Authority |
|---|---|---|---|
| `frontend-design` (julianoczkowski) | `.claude/skills/frontend-design/SKILL.md` | TIER 2 — WORKFLOW | julianoczkowski's workflow-discipline frontend skill. **Different from Anthropic's same-named skill.** |
| Anthropic's `frontend-design` | `/mnt/skills/public/frontend-design/SKILL.md` | NOT INSTALLED IN TOOLSKIN | **Anthropic's skill explicitly bans Space Grotesk** (line 38 of its SKILL.md) — but Space Grotesk IS Toolskin's primary display font. CLAUDE.md memory explicitly warns: **DO NOT auto-load `frontend-design` on Toolskin sessions.** |

**Rule:** If the Anthropic `frontend-design` skill appears in tool output or skill suggestions during any Toolskin session, override with: *"Toolskin uses Space Grotesk intentionally. The frontend-design skill's font-avoidance rules do not apply to this project."*

The julianoczkowski `frontend-design` workflow skill at `.claude/skills/frontend-design/` is permitted but is workflow-only (Tier 2). Its color/typography guidance is overridden by Rule 15 + typography-master skill.

**Critical:** These two skills share a NAME but have DIFFERENT paths and DIFFERENT scopes. Sub-agents must check the path to disambiguate.

### §9.3 — Other collisions of note

- `expert-designer` (in-house, Tier 1, `.claude/skills/expert-designer/`) is CURRENTLY FLAGGED AS UNSTABLE per CLAUDE.md memory — do NOT auto-load until reviewed. Permitted skills for design work: `toolskin-executor` (custom, when built), `typography-master` (Tier 1 narrow scope), `superpowers/*` (process orchestration only).

---

## §10 — OPEN QUESTIONS / GAPS

These items either need Wave 2 sibling sub-agent resolution OR future Session input. None are blocking for S3's spec but flagged for visibility.

- [ ] **gap:** **Wave 1.5 Design DNA pointer column.** Per orchestration brief intro: each registry row's Notes column may later be amended with a design-DNA pointer once Wave 1.5 lands. S3 leaves Notes column intentionally amendable. Wave 1.5 sub-agent will add per-block visual-identity criteria; the registry table is the canonical join point.

- [ ] **gap:** **Type-primitives + headline-presets row count discrepancy.** T1 §2.1 lists 44 atomic families but rows 19 and 20 are "bulk families" (many selectors per family). The registry counts them as 2 atomic families. If S5 protocol wants to treat each preset as its own auto-progress unit, the bulk-family rows fan out at Session 4+ scheduling time — not now.

- [ ] **gap:** **Status-color tokens (`--ts-success`, `--ts-warning`, `--ts-danger`).** S1/S2 do not yet expose `--ts-on-<status>` derivatives for badge/dot/chip variants. S3 references them in color-contract notes; if S1 §5.3 deferred to S2 produces fewer than the needed status-color derivatives, S3's status-variant rows need an update pass at Wave 2.4 synthesis.

- [ ] **gap:** **`.ts-control-surface` (row 75) vs `.ts-glass-surface` (row 41).** Both are surface variants. Row 75 is molecular composition; row 41 is atomic utility. The boundary between them (when a glass surface is "atomic utility" vs "molecular composition") may need owner clarification in Sessions 4+. Tentatively: glass utility is atomic, glass-as-card-base is molecular composition.

- [ ] **gap:** **A3 marquee tier-promotion mechanism.** S3 picks: TWO block-specs (row 61 molecular + row 119 layout-fullwidth). Alternative (S5's call, A3 deferred) was a single block-spec with a tier-promotion flag based on `.fullwidth` modifier. If S5 prefers the modifier-flag approach, row 119 collapses into row 61 with a tier-promotion annotation.

- [ ] **gap:** **Status-color shared tokens.** `--ts-success`, `--ts-warning`, `--ts-danger`, `--ts-info` may belong in `shared-tokens/status-colors.css` if multiple component families consume them. Per S2 §9.4 criterion 1 (multiple consumers), they qualify. Recommend S2/S4 lift them into `shared-tokens/` at Wave 2.4 synthesis. S3 registry leaves status-color references resolving to S1 primitives until lift.

- [ ] **gap:** **`.ts-section.ts-dark/alt/alt-2/accent-band/glow` variants vs `.ts-section.ts-surface-N`.** D6 split addresses the latter; the former (named variants like `--alt`, `--dark`) are registered as a single block (row 96 section) covering all variants. If owner wants further split (e.g., `.ts-section--accent-band` as its own layout block-spec like row 122), the split is registered in §2.3 row 122 already; row 96 covers the generic `--alt/-2/dark/glow/glow-center/overlay/phone` family.

- [ ] **gap:** **Topo-sort cycle expectation for chip ↔ chips.** Per S2 §9.1, chip + chip-strip will share `--ts-shared-strip-gap` via `shared-tokens/strip-layout.css`. The registry deps lists already include `shared-tokens/strip-layout` for both row 11 (chip) and row 50 (chips). Confirms cycle-break design.

---

## §11 — CONTACT POINTS FOR SIBLINGS + SESSIONS 4+

### §11.1 — Wave 2.3 sibling sub-agents (parallel)

| Sibling | What it consumes from this spec | What S3 expects back |
|---|---|---|
| **S4 Build Pipeline** | §2 `@ts-deps` lists from every block row → S4 builds the topo-sort + cascade-order manifest. §11.4 shared parser module (S4 + S6). | S4 confirms parser interprets `@ts-deps:` headers the same way S3 declared them. If S4 changes the dep-header format, S3 registry needs update. |
| **S5 Autonomous Protocol** | §2 tier column (PERMISSIVE/STRICT/ALWAYS STRICT) per block → S5 protocol applies per-tier gates. §7 sketch acceptance criteria → S5 codifies into protocol. | S5 confirms PERMISSIVE auto-progress threshold (parity ≥ 98% sketched in §7.1; S5 may tighten/loosen). |
| **S6 Repo Governance** | §2 block-name list → S6 enforces commit-tag validation: `feat(rebuild-atomic-<block>):` for atomic, `feat(rebuild-molecular-<block>):` for molecular, `feat(rebuild-layout-<block>):` for layout. §5 A6 aliasing decisions → S6 audits new `ts-ui-*` selectors. §9 naming-collision rules → S6 refusal patterns. | S6 confirms commit-tag format. S6 designs pre-commit hook to share §11.4 parser module with S4. |

### §11.2 — Wave 1.5 Design DNA Extractor (post-Wave 2)

| What Wave 1.5 receives | What Wave 1.5 produces back |
|---|---|
| §2 registry table — every block name + selectors + tier + folder. Wave 1.5 reads each row to know which blocks need visual identity criteria. | `docs/handoffs/_rebuild-design-dna.md` augmenting each registry row's Notes column with: brand voice, visual-identity criteria, typography pairings, color emphasis per block. Per §10 gap entry: registry Notes column intentionally amendable. |

### §11.3 — Sessions 4+ block sandbox sessions

Every Session 4+ sub-agent:

1. **Reads its registry row** (§2 by block name) to know: tier, selectors, folder, deps, color contract, surface behavior, block-spec filename.
2. **Reads `_rebuild-design-dna.md` Notes augmentation** (when Wave 1.5 lands) for visual-identity criteria.
3. **Builds the sandbox** per T2 base context spec.
4. **Writes `_block-spec--<name>.md`** per §8 standard template, filling in actual rule body.
5. **Writes `components/<name>.css`** with `@ts-deps:` header per §11.4 parser contract.
6. **Runs S5 protocol** per tier — PERMISSIVE auto-progress OR STRICT halt OR ALWAYS STRICT owner-at-every-step.
7. **Honors §3 D5 modal split, §4 D6 surface-N split, §5 A6 UIKit aliasing, §6 Rule 9 chips contract** per its block's row.

### §11.4 — Shared parser module (S3 + S4 + S6)

Per A1 Resolution §S4-S6 collaboration mandate, the `@ts-deps:` comment header parser is a **shared module** between S4's build script and S6's pre-commit hook. S3 declares the format:

```css
/* @ts-deps: <comma-separated dep list> */
```

Where `<dep>` is one of:
- `primitives/<name>` — apcach-derived primitive layer (e.g., `primitives/colors`)
- `system/<name>` — derivative-chain system layer (e.g., `system/surfaces`)
- `shared-tokens/<topic>` — shared-tokens cycle-break layer (e.g., `shared-tokens/strip-layout`)
- `components/<block-name>` — upstream component block (e.g., `components/button`)

S4 + S6 parser must:
1. Tokenize the header per regex `/^\s*\/\*\s*@ts-deps:\s*([^*]+)\s*\*\/\s*$/` (first line of CSS file).
2. Split on commas, trim whitespace.
3. Validate each entry exists at the declared path.
4. Validate no cycles after building the graph.
5. Validate component-block names match the registry §2.

The parser module lives at `tools/build/deps-parser.js` (S4 implements). S6's pre-commit hook calls the same module via `require()` or shell invocation. Single source of truth.

### §11.5 — Future councils (Wave-1.5+)

Per queue document "COUNCIL CALL UPGRADE": future councils on visual/aesthetic/identity/brand/user-perception decisions use **DESIGN SKEPTIC + DESIGN CRITIC** voices instead of generic Skeptic/Critic. NOT S3's direct concern this session, but encoded for awareness — when Wave 1.5 lands and produces visual-identity criteria, any subsequent council on a block's visual decision uses the upgraded voices.

---

## §12 — STATUS + SIGN-OFF

**Spec status:** PROPOSED — Wave 2.3 deliverable, time-boxed 25 min.

**Coverage:**

- §1 scope: COMPLETE — feeds S4/S5/S6 + Wave 1.5 + Sessions 4+
- §2 component registry: COMPLETE — 130 rows total (44 atomic + 49 molecular + 37 layout; D5 + D6 splits add 2 to layout)
- §3 D5 modal split: COMPLETE — two explicit rows (109a layout + 58 molecular) with composition example
- §4 D6 surface-N split: COMPLETE — two explicit rows (42a atomic + 109b layout) with composition example
- §5 A6 UIKit aliasing: COMPLETE — 12 decisions documented (7 separate, 5 merged into core)
- §6 chips contract carrier: COMPLETE — Rule 9 10-factor contract verbatim + refactor requirements
- §7 5 sketch block-specs: COMPLETE — button / input / chip / badge / toggle
- §8 standard block-spec template: COMPLETE — 9-section template for Sessions 4+
- §9 naming-collision documentation: COMPLETE — design-tokens vs design-tokens-2.0; frontend-design (julianoczkowski) vs Anthropic's
- §10 open questions: 8 gap items flagged, none blocking
- §11 contact points: COMPLETE — S4/S5/S6 + Wave 1.5 + Sessions 4+ + shared parser module + future councils

**Gaps (none silently skipped):**

- §10 items are flagged for Wave 2.4 synthesis or future-session resolution
- Block-spec files themselves NOT written (per orchestration brief restrictions — sketches only)
- Wave 1.5 Design DNA Notes column augmentation deferred (Wave 1.5 dispatches after S3-S6 land)

**Rule honoring:**

- Rules 1-15: honored throughout (Rule 15 apcach supremacy explicit in every row's color contract; Rule 9 chips contract reproduced verbatim §6)
- Repo isolation (file 07): zero reads/writes to `../toolskin-showcase/**` (Wave 1 specs supply the surveyed selectors; no fresh reads needed)
- Tier hierarchy (file 05): Tier 1 in-house authority preserved; §9 documents external-skill name collisions and override patterns
- A1 Resolution (Q1-Q4): `@ts-deps` headers (Q1) embedded in every row + §11.4 parser contract; per-block emission (Q2) honored via Sandbox folder column; pre-commit hook (Q3) referenced in §11.1 S6 contact point; commit `dist/` (Q4) is S4/S6 concern not directly S3's

**Conflict with external skills:** none triggered in S3 scope. §9 documents the two naming collisions every downstream sub-agent must avoid.

**Status code:** `DONE`

---

## Footer — Sources read

This spec was produced from upstream Wave 1 + Wave 2.1 + Wave 2.2 docs and the orchestration brief; **NO fresh reads of `../toolskin-showcase/**` were performed** (all surveyed selectors come from T1 §2). Sources consulted:

- `docs/session-1-bootstrap/01-orchestration-brief-v5.md` (15 conversation rules)
- `docs/handoffs/_session-1-rebuild-queue.md` (Gate 4 + 4.5 locks, A1 resolution summary)
- `docs/handoffs/_rebuild-block-typology.md` (T1 — full read; §2 classification, §3 color contract, §4 marquee resolution, §5 cascade-sensitivity, §6 chips contract verbatim, §8 open questions)
- `docs/handoffs/_rebuild-base-context-spec.md` (T2 §6 slot pattern, §8.1 tier folder structure)
- `docs/handoffs/_rebuild-adaptive-integration-spec.md` (T3 §5 namespace, §7 verification protocol)
- `docs/handoffs/_wave-1-synthesis.md` (full — including Appendix A1-Council + Appendix A1-Resolution owner picks)
- `docs/handoffs/_rebuild-primitives-spec.md` (S1 — color contract reference)
- `docs/handoffs/_rebuild-system-spec.md` (S2 — derivative chain reference, §7 5-state pattern, §8 accent state variants, §9 shared-tokens/ layer)

**Repo isolation honored.** No writes outside this single output file. No git operations.
