# Rebuild Block Typology — T1 Spec

**Author:** Sub-Agent T1 (Block Typology Architect), Wave 1
**Date:** 2026-05-19
**Status:** PROPOSED — pending Wave 1 synthesis + Owner Gate 4
**Binding rules consumed:** Rules 1-15 (file 01 + file 06)
**Repo isolation honored:** all reads from `../toolskin-showcase/` via relative path, no writes, no git ops
**Output target:** Sessions 2+ block sandbox engineering — every block reads its tier from this doc

═══════════════════════════════════════════════════════════════════════
## §0 — PURPOSE OF THIS SPEC
═══════════════════════════════════════════════════════════════════════

Wave 1's mandate is to classify every Toolskin component family into a typology that drives the **tiered autonomous execution protocol** (S5 deliverable in Wave 2). The protocol governs how Sessions 4+ run: which blocks can auto-progress overnight (PERMISSIVE), which halt for owner approval (STRICT), which require owner at every step (ALWAYS STRICT).

The typology has three categories. Each block is assigned exactly one category. The assignment is **load-bearing for Sessions 4+** — a wrong tier assignment either burns owner attention on trivial work (false STRICT) or lets architectural mistakes ship while the owner sleeps (false PERMISSIVE).

Beyond tier assignment, this spec also:
- Adds the **color contract** field per Rule 15 (apcach supremacy).
- Resolves outstanding architectural questions on `ts-marquee` (duplicate declarations + temporary `pointer-events: none`).
- Documents the **cascade-sensitivity decision criteria** per Rule 8.
- Extracts the **`@taxonomy_chips_strip` 10 KEY STYLE FACTORS** verbatim for downstream sub-agent reference (Rule 9 contract).

═══════════════════════════════════════════════════════════════════════
## §1 — BLOCK TYPOLOGY DEFINITIONS
═══════════════════════════════════════════════════════════════════════

Three categories. Mutually exclusive. Crisp criteria so a sub-agent can classify a never-before-seen block deterministically.

---

### §1.1 — ATOMIC

**Definition:** Self-contained UI primitive that paints itself from tokens alone, has zero structural dependence on any sibling/parent component, and exposes its own state via classes/attributes that the user OR the engine sets directly. No internal layout that affects other blocks. No JS coordination with the rest of the page. No surface re-scoping that propagates outward.

**Inclusion criteria (ALL must hold):**

1. **Self-painted:** all surfaces, colors, borders, radii come from the block's own `--ts-this-*` derivative tokens. No external token swap required to render.
2. **No structural cascade outward:** the block does not change the layout of its siblings or parent. Removing it from the DOM does not reflow anything but its own slot.
3. **State is local:** `:hover`, `:focus`, `:focus-visible`, `:disabled`, `[aria-pressed]`, `[aria-selected]`, `.is-active`, `.is-loading`, etc. State changes do not require JS to coordinate with other blocks (a sibling tab listening to it doesn't count — that's the sibling's responsibility).
4. **Single semantic role:** one ARIA role, one purpose. A button is a button. A chip is a chip. Not a "card containing a button containing a chip."
5. **No surface re-scope:** the block does NOT declare `--ts-this-bg: var(--ts-bg-N)` for downstream consumers. It consumes the parent's surface; it does not redefine it.
6. **Replaceable by a single CSS rule:** a careful designer could re-author the block in one CSS rule block (plus pseudo-classes/states). Even if Toolskin's actual implementation is 40+ rules for variants, the *core* of the block fits in one rule.

**Tier:** **PERMISSIVE**

**Autonomous behavior:** sub-agent builds the block in its sandbox, runs parity check against the reference iframe, runs the design-tokens audit, runs the typography audit if text is involved. If parity meets threshold AND no rule violations AND no `!important` AND tokens resolve cleanly, the sub-agent opens a PR and progresses to the next atomic block. Owner reviews the PR at next sit-down. No mid-session halt.

**Examples (showcase-confirmed):** `.ts-btn`, `.ts-input`, `.ts-select`, `.ts-textarea`, `.ts-chip`, `.ts-badge`, `.ts-dot`, `.ts-toggle`, `.ts-checkbox`, `.ts-radio`, `.ts-range`, `.ts-swatch`, `.ts-progress`, `.ts-spinner`, `.ts-icon`, `.ts-label`, `.ts-kbd`-equivalent (`.ts-code-label`), `.ts-link` (via type styles).

---

### §1.2 — MOLECULAR

**Definition:** Compound block composed of multiple atomic children that coordinate behavior or state internally. Owns its internal layout. May own a tightly scoped JS controller. May re-scope its own surface context (`--ts-this-bg`) so its atomic children resolve their derivatives against the right tier. Visible structural footprint, but NOT a page-level layout primitive.

**Inclusion criteria (ALL must hold):**

1. **Composed of atomics + coordination:** internal structure assembles atomic blocks (chip strip = chips + scroll affordances + overflow trigger; modal = surface + close button + content slot; accordion = item rows + twist icons + content panels).
2. **Owns internal layout:** uses flex/grid/scroll-snap/transform internally. Sibling atomics align/stack/scroll relative to each other.
3. **Coordinated state:** opening/closing, selecting one of N, expanding/collapsing, drag-and-drop. State requires the block's own JS controller OR a `:has()` / `[aria-expanded]` cascade scoped to itself.
4. **Surface re-scope INWARD:** the block MAY declare `--ts-this-bg: var(--ts-bg-N)` at its root so its descendants inherit a coherent context. The re-scope does not leak past the block's boundary.
5. **Reused as a composable unit:** the block is the consumer-facing unit. Consumers drop in `<div class="ts-card">…</div>` and expect a complete, behavior-bundled widget — they don't re-author its internals.
6. **Visible page footprint:** typically 80px–600px in one dimension. Bigger than a single control row, smaller than a section.

**Tier:** **STRICT**

**Autonomous behavior:** sub-agent builds the block in its sandbox, runs full audit suite (parity, design-tokens, typography, cascade-sensitivity check, accessibility), but **HALTS for owner approval before commit**. The sub-agent presents its diff + audit report + parity screenshot diff to the owner. Owner says "ship it" or "fix X." No commit lands without explicit owner approval.

**Why STRICT:** molecular blocks compose atomics + JS. Mistakes here cascade — a broken accordion breaks every page that uses one. The owner's eyes catch what audits miss (subtle motion timing, focus rings inside nested children, ARIA misuses). Cost of one extra owner pause = minutes. Cost of a broken molecular block shipping autonomously = hours of rework.

**Examples (showcase-confirmed):** `.ts-card`, `.ts-modal`, `.ts-accordion`/`.ts-ui-accordion`, `.ts-tabs`, `.ts-popover` / `.ts-tree-popover`, `.ts-tooltip`-equivalent, `.ts-toast`, `.ts-pricing-card`, `.ts-testimonial`, `.ts-flip-card`, `.ts-swipe-card`, `.ts-marquee` (despite simple appearance, owns JS animation + canonical pattern), `.ts-chips` strip (chips + scroll + overflow trigger — see §6), `.ts-feat-list` / `.ts-list`, `.ts-code-block` / `.ts-code-window`, `.ts-table` (sortable + bulk variants in UIKit), `.ts-progress-row`, `.ts-control-chip`, `.ts-control-surface--*`, `.ts-banner`, `.ts-gallery` (non-lightbox variant), `.ts-status-dot` row, `.ts-color-row` palette unit, `.ts-icon-dd-wrap` (icon dropdown picker), `.ts-toggle-row`, `.ts-checkbox-row`, `.ts-radio-group`, `.ts-form-column-group`, `.ts-portfolio-icon`, `.ts-skeleton` set.

---

### §1.3 — LAYOUT

**Definition:** Page-level structural primitive that defines the viewport's organization. Owns horizontal and/or vertical extent that affects siblings AND descendants. Frequently sets surface tier for an entire branch of the page. Typically one-per-page or few-per-page.

**Inclusion criteria (ANY one is sufficient):**

1. **Defines page extent:** spans the viewport horizontally (`100vw`, full-width) OR claims a primary vertical slot (top of page, bottom of page, left rail).
2. **Sets surface tier for descendants:** declares `--ts-this-bg` at a tier that propagates to many nested blocks. Changing this changes how every child resolves its derivative chain.
3. **Holds the page's information architecture:** sections, hero, footer, sidebar, topbar — the blocks the consumer's eye lands on first when assessing page structure.
4. **Composes molecular blocks:** layout blocks host molecular blocks. The layout's job is positioning and surface context; the molecules render the interactive content.
5. **Sticky / fixed / absolutely-positioned at page-level:** topbar sticky to viewport top, modal overlay covering viewport, sidebar fixed to viewport left, footer at document bottom, offcanvas sliding from edge.
6. **Cross-block coordination:** the layout block coordinates with global JS state — scroll position, theme toggle, route change, modal lock — beyond its own internal mechanics.

**Tier:** **ALWAYS STRICT**

**Autonomous behavior:** **NO autonomy.** Owner approves every step. The sub-agent does not commit, does not progress, does not even fully implement without owner check-ins. Layout blocks land in committed CSS only after the owner's eye has been on the work.

**Why ALWAYS STRICT:** layout blocks define the page. A mistake in `.ts-section` cascades into every section across every page. A mistake in `.ts-topbar` ships site-wide nav errors. A mistake in `.ts-sidebar` breaks the offcanvas editor and every WordPress site consuming Toolskin. These are not "blocks that take longer to verify" — they are blocks where verification IS the design process, and the owner is the verifier.

**Examples (showcase-confirmed):** `.ts-section` and all variants (`--alt`, `--alt-2`, `--dark`, `--accent-band`, `--glow`, `--overlay`, `--phone`), `.ts-container` and variants (`--sm/md/xl/full/content`), `.ts-app-shell`, `.ts-hero`, `.ts-topbar`, `.ts-nav` / `.ts-nav-fixed` / `.ts-nav-more` / `.ts-mobile-menu`, `.ts-page-footer` / `.ts-footer-row` / `.ts-footer-columns` / `.ts-footer-widget` / `.ts-footer-socket`, `.ts-sidenav`, `.ts-grid` and variants (`--1/2/3/4`, `--auto-sm/md/lg`, `--sidebar`, `--panel`, `--thirds`, `--auto-fit`, responsive `-d/-t/-m-*`), `.ts-stack` / `.ts-cluster` / `.ts-split` / `.ts-frame` / `.ts-center` (one-axis layout primitives), `.ts-overlay` / `.ts-section--overlay` / `.ts-mobile-menu-overlay` (full-viewport overlays), `.ts-panel` / `.ts-ui-panel` (docked + float variants), `.ts-oce-overlay` / `.ts-oce-panel` (offcanvas editor shell), `.ts-modal` (despite being a molecular composition, it's viewport-overlay-positioned and locks scroll — treat as LAYOUT), `.ts-tree-explorer` (the explorer SHELL — its rows and popovers are molecular but the explorer container itself is layout), `.ts-banner-generator-app` (full-app layout shell), `.ts-generator-app`/`.ts-generator-topbar`/`.ts-generator-canvas`/`.ts-generator-panel` (generator app shells), `.ts-split-feature`, `.ts-portfolio-section` + `.ts-portfolio-grid`, `.ts-dashboard`, `.ts-gallery-lightbox` (full-viewport lightbox overlay).

---

### §1.4 — TIE-BREAKER RULES (when a block looks like two categories)

Some blocks straddle. The rules:

1. **If it sets surface tier for descendants → LAYOUT.** Even small blocks become layout if they're the parent that establishes `--ts-this-bg` for a branch.
2. **If it spans the viewport in any dimension → LAYOUT.** Full-width marquee, full-bleed hero, sticky topbar.
3. **If it has internal JS coordination but does NOT span viewport AND does NOT set surface tier for siblings → MOLECULAR.** Accordion, modal content, tabs.
4. **If it is a single control with state but no internal composition → ATOMIC.** Button, input, chip.
5. **If unclear after rules 1-4, assume MOLECULAR.** The cost of false-STRICT is one owner pause. The cost of false-PERMISSIVE on a layout block is site-wide breakage.

═══════════════════════════════════════════════════════════════════════
## §2 — COMPONENT CLASSIFICATION TABLE
═══════════════════════════════════════════════════════════════════════

Surveyed by grep across `../toolskin-showcase/assets/css/toolskin.css` (34,413 lines) + `../toolskin-showcase/assets/css/toolskin-uikit.css` (1,597 lines). Selectors collapsed to family roots; variants subsumed under their root unless they materially change typology.

> **Reading convention:**
> - "Selector(s)" lists the family root + key modifiers. Pseudo-classes/states omitted for brevity.
> - "Reason" cites the criterion that fixed the typology.
> - PERMISSIVE = atomic = auto-progress. STRICT = molecular = halt for owner. ALWAYS STRICT = layout = owner at every step.

### §2.1 — ATOMIC BLOCKS (Tier: PERMISSIVE)

| # | Component family | Selector(s) | Typology | Tier | Reason |
|---|---|---|---|---|---|
| 1 | Button (core) | `.ts-btn`, `.ts-btn--sm/md/lg/xl/full`, `.ts-btn--accent/alt/danger/success` | atomic | PERMISSIVE | Self-painted, single role, no surface re-scope |
| 2 | Button group | `.ts-btn-group` | atomic | PERMISSIVE | Pure flex wrapper; treated atomic-aggregate |
| 3 | Input (text) | `.ts-input`, `.ts-input--mono` | atomic | PERMISSIVE | Single control, no internal composition |
| 4 | Textarea | `.ts-textarea` | atomic | PERMISSIVE | Same as input, multiline |
| 5 | Select (native) | `.ts-select`, `.ts-select-wrap` | atomic | PERMISSIVE | Native control + chrome wrapper |
| 6 | Input group | `.ts-input-group`, `.ts-input-group .ts-input-icon/action` | atomic | PERMISSIVE | Input + adornment slots; minimal composition (no JS) |
| 7 | Range slider | `.ts-range`, `.ts-range-row`, `.ts-range-val` | atomic | PERMISSIVE | Single native range + value readout |
| 8 | Toggle (switch) | `.ts-toggle`, `.ts-toggle--sm/lg/xl` | atomic | PERMISSIVE | Single binary control |
| 9 | Checkbox | `.ts-checkbox`, `.ts-checkbox--md/lg/xl` | atomic | PERMISSIVE | Single binary control |
| 10 | Radio | `.ts-radio`, `.ts-radio--md/lg/xl` | atomic | PERMISSIVE | Single one-of-N control |
| 11 | Chip (individual) | `.ts-chip`, `.ts-chip--accent/success/warning/danger`, `.ts-chip--active`, `[aria-selected]` | atomic | PERMISSIVE | Self-painted; the *strip* of chips is molecular (see §2.2) |
| 12 | Badge | `.ts-badge`, `.ts-badge--accent/success/warning/danger/alt/purple/cyan`, `.ts-badge-color` | atomic | PERMISSIVE | Inline label, no composition |
| 13 | Dot indicator | `.ts-dot`, `.ts-dot--accent/success/warning/danger/pulse/pulse-2`, `.ts-status-dot` | atomic | PERMISSIVE | Single visual indicator |
| 14 | Swatch (palette unit) | `.ts-swatch`, `.ts-swatch--sm/lg/accent/accent-dim/alt/success/warning/danger`, `.ts-grad-swatch` | atomic | PERMISSIVE | Single color unit |
| 15 | Progress bar | `.ts-progress`, `.ts-progress--sm/lg` | atomic | PERMISSIVE | Single bar |
| 16 | Spinner | `.ts-ui-spinner` | atomic | PERMISSIVE | Single animated indicator |
| 17 | Icon wrapper | `.ts-icon`, `.ts-icon-dot/tiny/mr` | atomic | PERMISSIVE | Visual primitive |
| 18 | Label / caption | `.ts-label`, `.ts-caption`, `.ts-section-label`, `.ts-overline`, `.ts-accent-label`, `.ts-toggle-label`, `.ts-progress-label/value` | atomic | PERMISSIVE | Type primitive |
| 19 | Type primitives | `.ts-h1`–`.ts-h6`, `.ts-display-xl/lg/md`, `.ts-body`, `.ts-lead`, `.ts-body-sm`, `.ts-small`, `.ts-mono`, `.ts-text-*`, `.ts-fs-*`, `.ts-fw-*`, `.ts-lh-*`, `.ts-ls-*`, `.ts-font-display/body` | atomic | PERMISSIVE | Pure type tokens; no surface |
| 20 | Headline presets | `.ts-hero-title`, `.ts-display-title`, `.ts-section-title`, `.ts-stat-value`, `.ts-subtitle`, `.ts-display-editorial`, `.ts-gradient-text`, `.ts-text-accent-line`, `.ts-preset-hero-label/section-header/stat-value/meta/body-secondary/nav-link` | atomic | PERMISSIVE | Type-layer presets |
| 21 | Code label / dotbtn | `.ts-code-label`, `.ts-code-dotbtn`, `.ts-code-copy` | atomic | PERMISSIVE | Small inline atoms inside code window (molecular host — see §2.2) |
| 22 | Slider dot | `.ts-slider-dot`, `.ts-slider-dots` (dots-only container) | atomic | PERMISSIVE | Pagination indicator |
| 23 | Theme toggle | `.ts-theme-toggle` | atomic | PERMISSIVE | Single binary control (consumes `Toolskin.setTheme`) |
| 24 | Menu burger (icon) | `.ts-menu-burger`, `.ts-menu-burger-inner` | atomic | PERMISSIVE | Pure-CSS icon transitions; the MENU it opens is layout |
| 25 | Social link (single) | `.ts-social-link` | atomic | PERMISSIVE | Inline icon link |
| 26 | Newsletter input piece | `.ts-newsletter-input`, `.ts-newsletter-btn` | atomic | PERMISSIVE | Standalone inputs/buttons; the `.ts-newsletter-input-group` is molecular |
| 27 | Hint / tooltip text | `.ts-hint` | atomic | PERMISSIVE | Inline helper text |
| 28 | Number-input controls | `.ts-ui-number-btn` | atomic | PERMISSIVE | Stepper button (the wrapper is molecular) |
| 29 | Bulk-bar row checkbox | `.ts-ui-row-checkbox`, `.ts-ui-checkbox-cell` | atomic | PERMISSIVE | Inline cell control |
| 30 | Tag-style status | `.ts-accent-text` (inline accent emphasis) | atomic | PERMISSIVE | Inline emphasis token |
| 31 | Shadow utilities | `.ts-shadow-xs/sm/md/lg/xl/low/mid/high/br/bl/tr/tl/soft/normal/strong/accent/surface` | atomic | PERMISSIVE | Pure effect tokens |
| 32 | Spacing utilities | `.ts-mt-*`, `.ts-mb-*`, `.ts-mt-auto`, `.ts-mr-auto`, `.ts-ml-auto`, `.ts-mx-auto`, `.ts-p-*`, `.ts-pt/pb/pr/pl/px/py-*` | atomic | PERMISSIVE | Utility tokens |
| 33 | Display utilities | `.ts-hidden`, `.ts-visible`, `.ts-invisible`, `.ts-sr-only`, `.ts-truncate`, `.ts-line-clamp-2`, `.ts-cursor-pointer`, `.ts-select-none`, `.ts-no-events`, `.ts-w-*`, `.ts-h-*`, `.ts-max-w-*` | atomic | PERMISSIVE | Utility tokens |
| 34 | Border utilities | `.ts-border`, `.ts-border-t/b/accent`, `.ts-rounded`, `.ts-rounded-full` | atomic | PERMISSIVE | Utility tokens |
| 35 | Reveal animations | `.ts-reveal`, `.ts-fade-in/up/left/right`, `.ts-zoom-in/out`, `.ts-slide-up/left/right`, `.ts-flip-up`, `.ts-bounce-in`, `.ts-delay-1/.../6` | atomic | PERMISSIVE | Pure CSS animation; observer JS is engine-level not block-level |
| 36 | Skeleton | `.ts-skeleton`, `.ts-skeleton--loaded` | atomic | PERMISSIVE | Single placeholder primitive |
| 37 | Frame (aspect ratio) | `.ts-frame`, `.ts-frame--square/video/photo/phone` | atomic | PERMISSIVE | Pure aspect-ratio wrapper |
| 38 | Glow / shimmer / scanline | `.ts-glow`, `.ts-glow-success/danger/info`, `.ts-shimmer`, `.ts-scanline`, `.ts-headline-sweep`, `.ts-neon-accent` | atomic | PERMISSIVE | Decoration primitives |
| 39 | Grain layers | `.ts-grain`, `.ts-grain--subtle/medium/strong/fast/slow`, `.ts-grain-layer` | atomic | PERMISSIVE | Decorative texture layer (always behind content) |
| 40 | Effects layer | `.ts-effects-layer`, `.ts-color-overlay-layer` | atomic | PERMISSIVE | Decorative overlay |
| 41 | Glass surface variants | `.ts-glass`, `.ts-glass--light/accent` | atomic | PERMISSIVE | Pure surface token swap (when used on small surfaces; on layout, see §2.3) |
| 42 | Surface-N utilities | `.ts-surface-0/1/2/3/4/5`, `.ts-surface`, `.ts-surface-glass/gradient/mesh/grid` | atomic | PERMISSIVE | Pure surface tier setter — atomic when applied to small surfaces; promotes to LAYOUT if used as section background (§2.3) |
| 43 | Background utilities | `.ts-bg-grad-surface-0/2/radial-soft`, `.ts-bg-engine/gradient-radial/gradient-linear/gradient-accent/mesh/flat/pattern/pattern-dots/pattern-grid/pattern-lines/pattern-noise/pattern-custom/interactive/interactive-grid/parallax/image/motion/motion-reveal/motion-slide/motion-fade/motion-zoom/slider/overlay/radial/glow/accent/accent-dim/grid/stripes` | atomic | PERMISSIVE | Decorative bg primitives |
| 44 | Pattern size variants | `.ts-pattern--xs/sm/lg/xl/2xl` | atomic | PERMISSIVE | Sizing tokens for `.ts-bg-pattern-*` |

**Atomic count: ~44 component families.** (Variant counts inside each family bring total selectors much higher.)

---

### §2.2 — MOLECULAR BLOCKS (Tier: STRICT)

| # | Component family | Selector(s) | Typology | Tier | Reason |
|---|---|---|---|---|---|
| 45 | Card (core) | `.ts-card`, `.ts-card-header`, `.ts-card--accent/featured/glass/accent-bar`, `.ts-card-row/col-full/half/third/auto`, `.ts-card-rows` | molecular | STRICT | Composes atomics + slot layout + surface re-scope inward |
| 46 | Field (form composite) | `.ts-field`, `.ts-field-label`, `.ts-field-row-2/3`, `.ts-field-group`, `.ts-form-column-group`, `.ts-form-column`, `.ts-group-title-label` | molecular | STRICT | Label + input + helper composition |
| 47 | Toggle row | `.ts-toggle-row`, `.ts-toggle-label` | molecular | STRICT | Label + toggle alignment |
| 48 | Checkbox row | `.ts-checkbox-row`, `.ts-checkbox-group`, `.ts-checkbox-container` | molecular | STRICT | Group composition |
| 49 | Radio group | `.ts-radio-group`, `.ts-radio-group--compact`, `.ts-radio-item` | molecular | STRICT | Group composition + one-of-N coordination |
| 50 | Chips strip (canonical) | `.ts-chips`, `.ts-chips:not(.ts-align-anchor-grid)` (variant) | **molecular** | STRICT | **Rule 9 LOCKED — see §6 for verbatim contract.** Composes chips + scroll affordances + overflow trigger + edge-fade gradients |
| 51 | Number input wrapper | `.ts-ui-number-input-wrapper`, `.ts-ui-number-input-controls`, `.ts-ui-number-btn` (collectively) | molecular | STRICT | Input + stepper buttons composition |
| 52 | Color preset row | `.ts-color-row`, `.ts-color-preset` (collectively) | molecular | STRICT | Multiple swatches + selection state |
| 53 | Icon picker dropdown | `.ts-icon-dd-wrap`, `.ts-icon-dd-list`, `.ts-icon-option`, `.ts-icon-search-input`, `.ts-icon-search-icon`, `.ts-icon-selected-row` | molecular | STRICT | Search input + dropdown list + selected display |
| 54 | Select (custom UIKit) | `.ts-ui-select` | molecular | STRICT | Custom dropdown with JS controller |
| 55 | Tabs | `.ts-tabs`, `.ts-tab`, `.ts-tab--active`, `.ts-tab-pane`, `.ts-tabs--pill`, `.ts-tabs--pill-rounded` | molecular | STRICT | Tab triggers + tab panes + JS coordination |
| 56 | Accordion (core) | `.ts-accordion`, `.ts-accordion-body` | molecular | STRICT | Item rows + content panels + expand state |
| 57 | Accordion (UIKit) | `.ts-ui-accordion`, `.ts-ui-accordion--separated/dual-icon` | molecular | STRICT | Same composition + UIKit variants |
| 58 | Modal (content shell) | `.ts-modal`, `.ts-modal--sm/lg/xl` | **molecular**\* | STRICT | \*See LAYOUT exception: modal *overlay* is layout, but the modal *content shell* spec is molecular. Treat full modal block as STRICT per tie-breaker rule 5 (assume molecular when straddling). |
| 59 | Toast (single) | `.ts-toast`, `.ts-toast--success/warning/error/info`, `.ts-ui-toast`, `.ts-ui-toast--in/out` | molecular | STRICT | Surface + icon + dismiss; enter/exit animation; the *container/stack* is layout |
| 60 | Popover (tree variant) | `.ts-tree-popover`, `.ts-tree-popover__item`, `.ts-tree-popover__sep` | molecular | STRICT | Positioned menu + item rows + separators |
| 61 | Marquee | `.ts-marquee-container`, `.ts-marquee-text-wrap/content/text`, `.ts-marquee.fullwidth.ts-marquee-container` | molecular\* | STRICT | \*Standard marquee is molecular. `.ts-marquee.fullwidth` reaches viewport-width → LAYOUT promotion (§2.3). Spec contracts must handle both variants. See §4 resolution. |
| 62 | Feature list / list | `.ts-feat-list`, `.ts-feat-item`, `.ts-list`, `.ts-menu-list`, `.ts-menu-item`, `.ts-menu-link` (when in footer/sidebar context) | molecular | STRICT | Composed item rows + dividers + hover states |
| 63 | Code block (inline) | `.ts-code-block` | molecular | STRICT | Mono surface + code formatting + copy button |
| 64 | Code window | `.ts-code-window`, `.ts-code-header`, `.ts-code-content` | molecular | STRICT | Window chrome + content + copy actions |
| 65 | Table (core) | `.ts-table`, `.ts-table-wrap`, `.ts-log`, `.ts-table-wrapper` | molecular | STRICT | Header + rows + sort/bulk variants |
| 66 | Table (UIKit) | `.ts-ui-table--sortable`, `.ts-ui-table--bulk`, `.ts-ui-table-scroll`, `.ts-ui-table-bulk-wrap` | molecular | STRICT | Sortable + bulk-select coordination + scroll wrapper |
| 67 | Bulk-bar | `.ts-ui-bulk-bar` | molecular | STRICT | Surface + buttons + selection count |
| 68 | Progress row | `.ts-progress-row`, `.ts-progress-label`, `.ts-progress-value` (collectively) | molecular | STRICT | Label + bar + value composition |
| 69 | Pricing card | `.ts-pricing-card`, `.ts-pricing-card--featured` | molecular | STRICT | Card composition with header/features/CTA slots |
| 70 | Testimonial | `.ts-testimonial` | molecular | STRICT | Quote + avatar + attribution |
| 71 | Flip card | `.ts-flip-card`, `.ts-card-face`, `.ts-flip-card--depth-sm/md/lg` | molecular | STRICT | Two faces + 3D flip animation + JS toggle |
| 72 | Swipe card | `.ts-swipe-card` | molecular | STRICT | Card + JS swipe gesture coordination |
| 73 | Portfolio icon | `.ts-portfolio-icon` | molecular | STRICT | Composite badge + label + hover state |
| 74 | Control chip | `.ts-control-chip` | molecular | STRICT | Chip variant with internal label + value pair |
| 75 | Control surface | `.ts-control-surface--glass/accent-gradient/light` | molecular | STRICT | Surface composition with internal state controls |
| 76 | Banner (promo) | `.ts-banner`, `.ts-promo-banner` | molecular | STRICT | Surface + message + dismiss |
| 77 | Hero lead / image | `.ts-hero-lead`, `.ts-hero-image` | molecular | STRICT | Hero internals — the hero SECTION is layout (§2.3) |
| 78 | Split feature | `.ts-split-feature` (item) | molecular | STRICT | Two-side composition; if used as section bg, see LAYOUT promotion |
| 79 | Newsletter input group | `.ts-newsletter-input-group`, `.ts-newsletter-form`, `.ts-footer-newsletter`, `.ts-footer-newsletter-desc` | molecular | STRICT | Input + button + description composition |
| 80 | Footer widget | `.ts-footer-widget`, `.ts-footer-widget-title` | molecular | STRICT | Title + content slot inside footer column |
| 81 | Footer menu | `.ts-footer-menu` | molecular | STRICT | Menu list + items composition inside footer column |
| 82 | Footer copyright | `.ts-footer-copyright`, `.ts-footer-socket-row` | molecular | STRICT | Composition inside socket layout |
| 83 | Social links group | `.ts-social-links` | molecular | STRICT | Container for multiple social-link atoms |
| 84 | Toast container | `.ts-toast-container`, `.ts-ui-toast-stack`, `.ts-ui-toast-display` | molecular\* | STRICT | \*Stack is viewport-positioned (top-right typically) but logically a molecular grouping of toasts. Treat as STRICT. |
| 85 | Tree node | `.ts-tree__node`, `.ts-tree__row`, `.ts-tree__twist`, `.ts-tree__icon`, `.ts-tree__label`, `.ts-tree__meta`, `.ts-tree__children` | molecular | STRICT | Row composition + expand/collapse state |
| 86 | Tree (root) | `.ts-tree`, `.ts-tree .ts-node`, `.ts-tree__children` (the recursive tree) | molecular | STRICT | The tree is molecular; the explorer SHELL is layout (§2.3) |
| 87 | IDE demo | `.ts-ide-demo` | molecular | STRICT | Editor-mock composition with multiple atoms |
| 88 | Gallery (non-lightbox) | `.ts-gallery`, `.ts-gallery--uniform` | molecular | STRICT | Grid of media items; lightbox variant is layout |
| 89 | Logo text | `.ts-logo-text` | molecular | STRICT | Mark + text composition |
| 90 | Banner generator preset row | `.ts-generator-color-row`, `.ts-generator-swatch`, `.ts-generator-select-wrap`, `.ts-generator-select`, `.ts-generator-code-export`, `.ts-generator-animation-controls`, `.ts-generator-tab`, `.ts-generator-tab-pane`, `.ts-generator-canvas-info`, `.ts-generator-canvas-badge`, `.ts-generator-logo`, `.ts-generator-logo-sub`, `.ts-generator-tabs`, `.ts-generator-panel-body` | molecular | STRICT | Generator-app internal compositions (the SHELL is layout, §2.3) |
| 91 | Offcanvas field | `.ts-oce-field`, `.ts-oce-tab`, `.ts-oce-conditional`, `.ts-oce-close`, `.ts-oce-fab`, `.ts-oce-hidden`, `.ts-color-preset`, `.ts-range-value` | molecular | STRICT | Offcanvas editor internal compositions |
| 92 | Promo tab | `.ts-ptab` | molecular | STRICT | Promo carousel tab composition |
| 93 | Row 2 / 3 layouts | `.ts-row-2`, `.ts-row` | molecular | STRICT | Reusable row composition |

**Molecular count: ~49 component families.**

---

### §2.3 — LAYOUT BLOCKS (Tier: ALWAYS STRICT)

| # | Component family | Selector(s) | Typology | Tier | Reason |
|---|---|---|---|---|---|
| 94 | App shell | `.ts-app-shell`, `.ts-app-shell--no-sidebar` | layout | ALWAYS STRICT | Defines page-level grid: sidebar + main |
| 95 | Container | `.ts-container`, `.ts-container--sm/md/xl/full/content` | layout | ALWAYS STRICT | Defines horizontal extent for entire content branch |
| 96 | Section (core) | `.ts-section`, `.ts-section--alt/alt-2/dark/accent-band/glow/glow-center/overlay/phone` | layout | ALWAYS STRICT | Surface tier setter for entire descendant subtree (Rule 4 surface superposition) |
| 97 | Section divider | `.ts-section-divider` | layout | ALWAYS STRICT | Visual page-break primitive |
| 98 | Hero | `.ts-hero` | layout | ALWAYS STRICT | Top-of-page primary layout slot |
| 99 | Topbar | `.ts-topbar`, `.ts-topbar-static` | layout | ALWAYS STRICT | Sticky/fixed top-of-viewport nav |
| 100 | Fixed nav | `.ts-nav`, `.ts-nav-fixed`, `.ts-nav-more`, `.ts-more-trigger`, `.ts-nav-dropdown` | layout | ALWAYS STRICT | Nav coordination at viewport level |
| 101 | Sidebar / sidenav | `.ts-sidenav` | layout | ALWAYS STRICT | Left/right viewport rail |
| 102 | Mobile menu | `.ts-mobile-menu`, `.ts-mobile-menu-items`, `.ts-mobile-menu-overlay` | layout | ALWAYS STRICT | Full-viewport mobile nav overlay |
| 103 | Page footer | `.ts-page-footer`, `.ts-footer-row`, `.ts-footer-column`, `.ts-footer-columns`, `.ts-footer-socket` | layout | ALWAYS STRICT | Bottom-of-page structural block |
| 104 | Grid (page) | `.ts-grid`, `.ts-grid--1/2/3/4`, `.ts-grid--auto-sm/md/lg`, `.ts-grid--sidebar/panel/thirds/auto-fit`, responsive `-d/-t/-m-*`, `.ts-grid--start`, `.ts-grid-responsive`, `.ts-col`, `.ts-col-span-2/3/full`, `.ts-col--safe`, `.ts-span-2/3/full`, `.ts-grid-cols-d/t/m-*` | layout | ALWAYS STRICT | Page-level column definition; mistake cascades site-wide |
| 105 | Flex layout primitives | `.ts-flex`, `.ts-flex-row/col/wrap/nowrap/center/between/around/evenly/start/end/responsive`, `.ts-items-*`, `.ts-justify-*`, `.ts-gap-*`, `.ts-gap-x-*`, `.ts-gap-y-*`, `.ts-flex-d-row`, `.ts-flex-t-col`, `.ts-flex-m-col`, `.ts-flex-1/none/shrink-0`, `.ts-row` | layout | ALWAYS STRICT | Page-composition primitives — atomic-looking but mistakes cascade across every consumer |
| 106 | Layout helpers | `.ts-stack`, `.ts-stack--tight/loose/xl`, `.ts-cluster`, `.ts-cluster--end/between`, `.ts-grid--auto/2/3/4`, `.ts-split`, `.ts-center` | layout | ALWAYS STRICT | One-axis layout primitives that compose every page |
| 107 | Section + main wrap | `.ts-main-wrap-offset-rounded-bg`, `.ts-main` | layout | ALWAYS STRICT | Page-wrap composition |
| 108 | Widget wrap | `.ts-widget--wide` | layout | ALWAYS STRICT | Section-spanning widget container |
| 109 | Modal overlay | `.ts-modal` (when treated as viewport overlay; molecular content shell from §2.2 nests inside) | layout | ALWAYS STRICT | Full-viewport overlay + scroll lock + focus trap |
| 110 | Section overlay | `.ts-overlay`, `.ts-section--overlay` | layout | ALWAYS STRICT | Full-section overlay |
| 111 | Panel (docked / float) | `.ts-panel`, `.ts-panel--docked`, `.ts-panel--float`, `.ts-ui-panel`, `.ts-ui-panel--docked`, `.ts-ui-panel--float` | layout | ALWAYS STRICT | Viewport-anchored docked or floating panels |
| 112 | Offcanvas editor shell | `.ts-oce-overlay`, `.ts-oce-panel` | layout | ALWAYS STRICT | Full-viewport offcanvas shell |
| 113 | Tree explorer shell | `.ts-tree-explorer`, `.ts-tree-explorer__bar`, `.ts-tree-explorer__brand`, `.ts-tree-explorer__brand-mark`, `.ts-tree-explorer__brand-text`, `.ts-tree-explorer__title`, `.ts-tree-explorer__path`, `.ts-tree-explorer__tools`, `.ts-tree-explorer__search`, `.ts-tree-explorer__stats`, `.ts-tree-explorer__actionbar-stats`, `.ts-tree-explorer__body`, `.ts-tree-explorer.boxed`, `.ts-tree-explorer[data-tree-variant="curved"]` | layout | ALWAYS STRICT | Full-app shell hosting the tree molecule + actionbar molecule |
| 114 | Banner generator app shell | `.ts-banner-generator-app`, `.ts-generator-app`, `.ts-generator-topbar`, `.ts-generator-topbar-sep`, `.ts-generator-topbar-right`, `.ts-generator-canvas`, `.ts-generator-panel` | layout | ALWAYS STRICT | Full-app shell |
| 115 | Dashboard layout | `.ts-dashboard` | layout | ALWAYS STRICT | Page-level dashboard grid |
| 116 | Split feature section | `.ts-split-feature` (as section composition) | layout | ALWAYS STRICT | Section-level two-side layout |
| 117 | Portfolio section | `.ts-portfolio-section`, `.ts-portfolio-grid` | layout | ALWAYS STRICT | Portfolio listing section |
| 118 | Gallery lightbox | `.ts-gallery-lightbox`, `.ts-gallery-lightbox--open` | layout | ALWAYS STRICT | Full-viewport lightbox overlay |
| 119 | Marquee (fullwidth) | `.ts-marquee.fullwidth.ts-marquee-container` (LAYOUT promotion of the molecular marquee) | layout | ALWAYS STRICT | Spans viewport (translateX -50% trick + min-width 100vw), order:-1 reorders flex parent; LAYOUT due to viewport span |
| 120 | Preloader | `.ts-preloader`, `.ts-preloader--minimal-bar` | layout | ALWAYS STRICT | Full-viewport boot screen + FOUC guard |
| 121 | Effects parallax | `.ts-parallax`, `.ts-bg-parallax` | layout\* | ALWAYS STRICT | \*Pure CSS parallax is atomic, but full-section parallax bg is a viewport-spanning effect. Tie-breaker rule 1 promotes when used at section scope. Default to LAYOUT. |
| 122 | Hero with effects | `.ts-section--accent-band` + variants | layout | ALWAYS STRICT | Section with multi-layer surface compositions |
| 123 | Lush mode wrapper | `.ts-lush-mode`, `.ts-gradient-ui` | layout | ALWAYS STRICT | Page-mode wrappers that swap surfaces globally |
| 124 | Viewport-paused effects | `.ts-viewport-paused` | layout | ALWAYS STRICT | Page-state class affecting all animation engines |
| 125 | Masonry hero | `.ts-masonry-hero-bg`, `.ts-masonry-hero-text`, `.ts-ui-masonry--v2/lanes/grid` | layout | ALWAYS STRICT | Section-level masonry layout |
| 126 | BG slider | `.ts-bg-slider` | layout | ALWAYS STRICT | Section-level slideshow bg |
| 127 | Footer socket | `.ts-footer-socket` | layout | ALWAYS STRICT | Bottom-most footer band |
| 128 | Resizable container | `.ts-resizable-wrap`, `.ts-resizable`, `.ts-ui-resizable`, `.ts-ui-draggable--dragging`, `.ts-ui-draggable-bounds`, `.ts-ui-sortable` | layout | ALWAYS STRICT | Layout-wrapper behaviors with bounds + global mouse events |

**Layout count: ~35 component families.**

---

### §2.4 — TOTAL CLASSIFICATION

| Tier | Count | Autonomous behavior |
|---|---|---|
| ATOMIC / PERMISSIVE | ~44 | Auto-progress overnight; PR opens, owner reviews next morning |
| MOLECULAR / STRICT | ~49 | Sub-agent completes, halts for owner approval before commit |
| LAYOUT / ALWAYS STRICT | ~35 | Owner approves every step |
| **TOTAL** | **~128 component families** | |

**Notes on counting:**
- Variant counts inside each family (e.g., `.ts-btn--sm/md/lg/xl/full`) are NOT separate families.
- Utility families (spacing, type, color text) are bulk-counted as one family per axis (margin, padding, text, etc.).
- UIKit `ts-ui-*` families are counted separately from core `ts-*` only when they're distinct components (e.g., `.ts-ui-select` vs `.ts-select`); shared selectors collapse to one row.

═══════════════════════════════════════════════════════════════════════
## §3 — COLOR CONTRACT (Rule 15 binding)
═══════════════════════════════════════════════════════════════════════

**Per Rule 15 (apcach supremacy, file 06): every block — atomic, molecular, layout — consumes color exclusively through the `--ts-this-*` derivative chain, which traces back to apcach-derived primitives. No block declares raw color values.**

### §3.1 — The contract

Every block CSS rule, at any tier, MUST satisfy:

1. **NEVER declare a raw color value** (`#xxx`, `rgb(...)`, `oklch(...)` with literal values, etc.) in any component-layer rule. All raw values live in the primitives layer (`assets/css/next/primitives/colors.css`), generated by apcach via `tools/color-engine/generate-colors.js`.

2. **ALWAYS consume `--ts-this-*` derivative tokens** for surface, text, border, accent:
   - Surface: `--ts-this-bg`, `--ts-this-bg-dark`, `--ts-this-bg-dark-1/2`, `--ts-this-bg-light`, `--ts-this-bg-border`, plus future state tokens `--ts-this-bg-border-active/disabled/focus` (per restyling-architecture §4 missing-state tokens)
   - Text: `--ts-this-color`, `--ts-this-color-muted`, `--ts-this-color-on-accent`, `--ts-this-color-success/warning/danger`
   - Accent: `--ts-this-accent`, `--ts-this-accent-dim`, `--ts-this-accent-glow`

3. **`color-mix()` allowed at SYSTEM LAYER only** (`assets/css/next/system/*.css`) where the derivative chain composes. Component-layer rules consume the precomputed derivatives, they don't re-mix.

4. **Surface re-scope is the molecular block's tool** — when a molecular block needs its descendants to resolve against a different surface tier, it sets `--ts-this-bg: var(--ts-bg-N)` at its own root. The descendants automatically pick up the re-scoped derivative chain. This is the documented pattern from `@taxonomy_chips_strip` (line 34008: `--ts-this-bg: var(--ts-bg-1)`).

5. **Hover/focus/active/disabled states consume state-token derivatives** — NEVER a darkening filter, NEVER a hardcoded `rgba(...)` overlay. The state tokens (`--ts-this-bg-border-active` etc.) are apcach-derived per Rule 15.

### §3.2 — Example (canonical)

**Atomic example: `.ts-btn`**

```css
.ts-btn {
  background: var(--ts-this-bg);              /* NOT #2a2b2e */
  color: var(--ts-this-color);                /* NOT #f2f2f2 */
  border: 1px solid var(--ts-this-bg-border); /* NOT 1px solid #444 */
}
.ts-btn:hover {
  background: var(--ts-this-bg-dark);         /* NOT filter: brightness(0.9) */
  border-color: var(--ts-this-bg-border-active);
}
```

**Molecular example: `.ts-chips` (per @taxonomy_chips_strip Rule 9)**

```css
.ts-chips {
  --ts-this-bg: var(--ts-bg-1);                /* surface re-scope INWARD */
  border: 1px solid var(--ts-this-bg-border);
  background: var(--ts-this-bg-dark);
  /* edge-fade gradients use color-mix in OKLCH at system layer (NOT here) */
}
```

**Layout example: `.ts-section--alt`**

```css
.ts-section--alt {
  --ts-this-bg: var(--ts-bg-2);  /* surface tier setter for entire descendant subtree (Rule 4) */
  background: var(--ts-this-bg);
}
```

### §3.3 — Refusal pattern for sub-agents

When any sub-agent (Tier 2-5 skill, external tool, ECC mode) proposes a hex value, rgba(), or non-derivative oklch() in a component rule, the proposal is REJECTED. The sub-agent rewrites in terms of `--ts-this-*` derivatives, citing this section. If a derivative token is missing for the use case, the gap is reported to S1/S2 for primitive/system layer extension — not patched with a literal at the component layer.

This is the operational mechanic that delivers Rule 15's promise: any accent input produces a complete, contrast-verified system because the system is the only place colors come from.

═══════════════════════════════════════════════════════════════════════
## §4 — `ts-marquee` RESOLUTION (canonical pattern exemplar)
═══════════════════════════════════════════════════════════════════════

**Source surveyed:** `../toolskin-showcase/assets/css/toolskin.css:15772-15921` (150 lines).

### §4.1 — Issue 1: Duplicate `--ts-marquee-bg` and `--ts-marquee-font-size` declarations

Lines 15776-15780 contain two declarations each:

```css
.ts-marquee-container {
  --ts-marquee-bg: var(--ts-bg-1);              /* line 15776 */
  --ts-marquee-bg: var(--ts-accent-glow-bg-2);  /* line 15777 — overrides */
  --ts-marquee-color: var(--ts-text-primary);
  --ts-marquee-font-size: var(--ts-fs-4xl);     /* line 15779 */
  --ts-marquee-font-size: var(--ts-fs-hero);    /* line 15780 — overrides */
  ...
}
```

**Resolution: CLEANUP TARGET, not intentional fallback.**

**Evidence and reasoning:**

1. **CSS custom property cascade for duplicates within the same rule:** the LAST declaration wins. Both `--ts-bg-1` and `--ts-accent-glow-bg-2` resolve to valid values (they are defined elsewhere in `:root`). The first declaration on each pair is dead — never read.

2. **Not the documented "fallback" pattern.** True CSS fallback uses `var(--token, fallback-value)` syntax (one declaration, two values). What we see here is two separate declarations. That's an iteration artifact: someone tried `--ts-bg-1` (surface tier 1), then preferred `--ts-accent-glow-bg-2` (glow-themed surface) for the marquee's visual effect, and didn't delete the prior line. Same for font-size: `--ts-fs-4xl` was the original spec, `--ts-fs-hero` is the final preferred value.

3. **Rule 6 (block prototype, reference only):** the old toolskin.css is a block prototype. Iteration leftovers are expected. The rebuild is the opportunity to clean.

4. **The rebuilt `.ts-marquee` must declare each token ONCE.** Surface choice and font-size choice are intentional design decisions that the rebuild encodes deliberately, not as cascade artifacts.

**Rebuild action:**
- Keep `--ts-marquee-bg: var(--ts-accent-glow-bg-2);` (the live value)
- Keep `--ts-marquee-font-size: var(--ts-fs-hero);` (the live value)
- Apply Rule 15 derivative pattern: in rebuilt CSS these become `--ts-this-bg: var(--ts-this-accent-glow);` (or equivalent rebuilt token), and font-size flows from the type scale's `hero` step.

### §4.2 — Issue 2: `pointer-events: none` on `.ts-marquee-container` (line 15791)

Owner comment at line 15792:

> "i added poinet event none to avoid the animation stop on hover. tis shoud be removed whenthe behaviour is removed from the defaults. this is a hardcoded tmeporary fix."

**Root cause:** somewhere in the engine (likely `toolskin.js` cursor module or Lenis smooth-scroll interaction layer), a default behavior is pausing the marquee animation on hover. The owner's patch is to disable pointer events entirely on the marquee container, which prevents hover from being detected and thus prevents the pause.

**Rebuild resolution path:**

1. **Identify the pausing behavior at engine level.** During Wave 1 / T3 (Adaptive Integration Architect), survey `../toolskin-showcase/assets/js/toolskin.js` for hover-pause logic. Candidates:
   - GSAP ScrollTrigger pause-on-hover
   - Lenis interaction handler
   - A custom cursor module that pauses animations under the cursor
   - A `:hover` rule in CSS that uses `animation-play-state: paused`

2. **Remove pause-on-hover from the engine defaults.** If the engine pauses animations on hover by default, that's the wrong default for marquees. Marquees are decorative streams; they should run regardless of hover. The opt-in pattern should be the reverse: `<marquee data-pause-on-hover>` triggers pause behavior; absence runs continuously.

3. **Remove `pointer-events: none` from the rebuilt `.ts-marquee-container`.** Marquee text should remain selectable and link-clickable for accessibility (especially if the marquee contains anchor tags, which is a documented use case).

4. **Document the engine fix in the marquee block-spec.md** (the Session 4+ sandbox for the marquee block). The fix is a coordinated change: marquee CSS drops the patch, marquee block-spec calls out the engine default change in `toolskin.js`, the regression test verifies hover does NOT pause.

**Why this matters for typology:** the marquee is the **canonical pattern exemplar** per Rule 3. A hardcoded temporary fix in the canonical example is a signal that the canonical pattern itself has an unresolved engine-default contradiction. Cleaning this before Sessions 4+ unblocks every component that adopts the marquee pattern.

═══════════════════════════════════════════════════════════════════════
## §5 — CASCADE-SENSITIVITY TREATMENT (Rule 8 binding)
═══════════════════════════════════════════════════════════════════════

**Per Rule 8 (May 17 cascade-sensitivity discovery): `:root [class*="ts-tree"]` is a SCOPED DISTRIBUTION LAYER. Cascade is partially explicit. The rebuild uses explicit `:is(...)` enumeration where appropriate.**

This section defines when the rebuild uses explicit `:is(...)` vs substring-distribution `[class*="..."]`.

### §5.1 — Decision criteria

| Pattern | Use when | Example |
|---|---|---|
| **`.ts-block`** (no compound selector) | Single component family with internal variants under its root. Most ATOMIC blocks. | `.ts-btn { ... }`, `.ts-btn--sm { ... }` |
| **`.ts-block .ts-child`** (descendant) | Internal composition of a molecular block; child resolves against parent context. | `.ts-card .ts-card-header { ... }` |
| **`:is(.ts-a, .ts-b, .ts-c)`** (explicit enumeration) | A SHARED rule applies to a *known, finite* set of components — e.g., shared focus rings on all interactive atomics, shared scroll-snap on multiple gallery types. The set is enumerated; cascade specificity is explicit. | `:is(.ts-input, .ts-select, .ts-textarea):focus { ... }` |
| **`[class*="ts-tree"]`** (substring distribution) | The DISTRIBUTION LAYER PATTERN per Rule 8 — applies to a recursive component family where every nested level shares the pattern (tree, list with infinite depth, accordion of accordions). Use **only** when scoped to a root token block (e.g., `:root [class*="ts-tree"]`) and only for token-distribution, not for state. | `:root [class*="ts-tree"] { --ts-tree-row-h: 26px; }` — distributes token to every tree-descendant scope |

### §5.2 — When `:is(...)` enumeration WINS over substring-distribution

Use explicit `:is(...)`:

1. **When the component set is finite and known.** Buttons, inputs, selects, textareas → enumerate. Don't write `[class*="ts-input"]` and rely on substring-match — that's fragile if naming changes.
2. **For state rules** (`:hover`, `:focus`, `:active`, `:disabled`). State should be explicit per-component; substring matching introduces specificity surprises.
3. **For component-coordination** (e.g., `.ts-form-row :is(.ts-input, .ts-select)`). Explicit enumeration documents intent.
4. **When IDE tooling matters.** Explicit selectors are searchable; substring patterns hide behind regex.

### §5.3 — When substring-distribution WINS over `:is(...)`

Use `[class*="ts-..."]`:

1. **For TOKEN DISTRIBUTION inside a recursive component family.** Tree explorer with infinite-depth nested rows, all sharing a row-height token. Without substring distribution, you'd duplicate the token block at every depth.
2. **Scoped to a single root** (`:root [class*="ts-tree"]` not `[class*="ts-tree"]` floating). Specificity is exactly one class + universal — predictable.
3. **For tokens, NEVER for state.** The distribution layer sets `--ts-something: value` for descendants. Descendants then consume `var(--ts-something)` in their own explicit rules. State and behavior live in explicit selectors.
4. **Documented as a distribution layer.** Comment block above the rule names it: `/* DISTRIBUTION LAYER — Rule 8 — propagates --ts-tree-* tokens to all .ts-tree descendants */`.

### §5.4 — The May 17 incident pattern (verbatim from session-state)

The May 17 cascade-sensitivity discovery established that `[class*="ts-tree"]` worked CORRECTLY for the tree component because:
- It scoped under `:root`, giving exactly-one-class specificity.
- It distributed TOKENS only (not state, not layout, not color).
- The tree's recursive depth made enumeration impractical (you can't enumerate "all possible tree row classes" — they're generated dynamically).

The rebuild's rule: **substring distribution is allowed iff** (1) scoped to `:root` or a similarly-scoped origin, (2) distributes tokens only, (3) targets a recursive component family, and (4) is comment-documented as a distribution layer per Rule 8. Otherwise: explicit `:is(...)` or simple descendant selectors.

### §5.5 — Auditor pseudocode

S6 governance enforces this via a CSS linter check:

```
FOR EACH rule in assets/css/next/**/*.css:
  IF rule.selector matches /\[class\*=/:
    REQUIRE rule.selector matches /^:root /
    REQUIRE rule body declares ONLY --ts-* tokens (custom properties)
    REQUIRE preceding comment contains "DISTRIBUTION LAYER" and references Rule 8
  ELSE IF rule.selector covers multiple component families:
    PREFER :is(...) explicit enumeration over substring match
```

═══════════════════════════════════════════════════════════════════════
## §6 — `@taxonomy_chips_strip` DESIGN CONTRACT (Rule 9 binding)
═══════════════════════════════════════════════════════════════════════

**Source surveyed:** `../toolskin-showcase/assets/css/toolskin.css:33944-34073` (130 lines including docstring + rule body).

The chips strip docstring encodes the **10 KEY STYLE FACTORS TO PRESERVE** per Rule 9. Per the brief mandate, these are extracted verbatim for downstream sub-agent reference. Every Session 4+ sub-agent rebuilding the chips block MUST satisfy all 10.

### §6.1 — Verbatim extraction (lines 33986-34032)

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
>    - `--ts-this-bg: var(--ts-bg-1)` → re-scopes the surface context so chip children resolve their own `--ts-this-*` tokens against the right background tier. *(This factor is restated; counted under #5 above for atomicity.)*

### §6.2 — Confirmation

The rebuilt `.ts-chips` block (Sessions 4+, STRICT tier per §2.2 row #50) WILL honor all 10 factors. The block-spec.md for `.ts-chips` will reproduce this section verbatim as its design-contract preamble. Any sub-agent that proposes a chip strip rebuild violating any of the 10 factors halts and surfaces to owner.

### §6.3 — REFACTOR REQUIREMENTS (lines 34033-34073, extracted for downstream consumers)

Beyond the 10 PRESERVE factors, the docstring specifies refactor goals:

1. **SCOPED ROOT TOKEN SETUP (chips variant)** — wrap variant overrides into a scoped root token block. The chips strip is a tokenized VARIANT of `.ts-chips`, not a re-style. Stop fighting `.ts-chips` styling with overrides.

2. **HORIZONTAL SCROLL — REPLACE THE CURRENT METHOD** — native `overflow-x: auto` is not intuitively scrollable. Solve with (a) better CSS-only method (scroll-driven affordance, pinned scroll buttons, pointer-drag scrolling) OR (b) small JS module for drag-to-scroll + edge buttons. Expose as GLOBAL reusable asset — `.ts-scrollstrip` or `.ts-actionbar-scroll` — usable by any "scrollable navigation / filter bar / nested-action row" elsewhere.

3. **TRUNCATION DROPDOWN (accessibility companion)** — `toolskin.js` already ships a truncation-dropdown helper. Wire it into this strip so a "more filters" / overflow trigger appears beside the scrollable region.

4. **ROW SIBLING SHRINK / COLLAPSE PRIORITY** — chips strip needs WIDTH PRIORITY over the other two siblings on its row. Add media queries (or container queries — preferred if the row is a CQ context) so siblings collapse to icon-only mode as the row narrows.

These four requirements feed S3 (Component Registry) when sketching the `.ts-chips` block-spec.md.

═══════════════════════════════════════════════════════════════════════
## §7 — CONTACT POINTS FOR WAVE 2 + LATER SESSIONS
═══════════════════════════════════════════════════════════════════════

### §7.1 — Wave 2 consumers of this spec

| Wave 2 sub-agent | Consumes |
|---|---|
| **S1 (Color Foundation Architect)** | §3 color contract — confirms primitives feed `--ts-this-*` chain consumed by every block in §2 |
| **S2 (System Layer Architect)** | §3 derivative chain — implements the `--ts-this-*` system that every block (atomic/molecular/layout) consumes |
| **S3 (Component Registry + Block Prioritization)** | §2 classification table (full) — generates one block-spec.md per family, citing tier from §2 and color contract from §3. First 5 sketch block-specs: priority on atomics + the chips strip per §6 + `ts-marquee` per §4 |
| **S4 (Build Pipeline Architect)** | §2 tier counts inform CSS bundle order (primitives → system → atomic → molecular → layout → page); §5 cascade-sensitivity rule informs the linter step |
| **S5 (Autonomous Execution Protocol Architect)** | §2 tier assignments are the input to the protocol — PERMISSIVE/STRICT/ALWAYS STRICT gates per block, lifted directly from §2.4 totals |
| **S6 (Repo Governance + Refusal Patterns Author)** | §5.5 cascade-sensitivity auditor pseudocode for pre-commit hook; §3.3 refusal pattern for color-violation rejection; §2 tier counts inform commit-tag enforcement (`feat(rebuild-atomic):` vs `feat(rebuild-molecular):` vs `feat(rebuild-layout):`) |

### §7.2 — Block sandbox session consumers (Sessions 4+)

Every Session 4+ block sandbox MUST:

1. Read `_rebuild-block-typology.md` (this doc) first.
2. Find its block in §2 — locate the row, note the tier.
3. If ATOMIC / PERMISSIVE: enable auto-progress.
4. If MOLECULAR / STRICT: enable halt-for-approval.
5. If LAYOUT / ALWAYS STRICT: enable owner-at-every-step.
6. Honor §3 color contract — no raw colors in component CSS.
7. If the block is `.ts-chips`: reproduce §6 verbatim as design contract preamble.
8. If the block is `.ts-marquee` or any block following its pattern: honor §4 resolutions (single declaration, no `pointer-events: none` patch, engine fix accompanies the block CSS).
9. If the block writes any rule using `[class*="..."]` substring distribution: honor §5 decision criteria + the auditor pseudocode in §5.5.

### §7.3 — Dependencies on T2 / T3 (Wave 1 siblings)

**T1 → T2:** T2 (Reusable HTML Base) consumes §2's classification to know which blocks are layout-defining (host blocks in `sandbox/_base.html`) vs molecular (drop-in blocks) vs atomic (filler atoms). T2 designs the base to provide layout slots that every block type can occupy without re-engineering.

**T1 → T3:** T3 (Adaptive Integration) consumes §2's layout-block list (especially `.ts-app-shell`, `.ts-section`, `.ts-topbar`, `.ts-page-footer`, `.ts-container`) to verify drop-in compatibility per Rule 5. T3's "give-it-to-WordPress, give-it-to-AI, give-it-to-Vue" verification matrix must include each layout block.

**T1 dependencies on T2 / T3:** **NONE** in Wave 1. T1 produces the typology; T2 and T3 read it. T1 does not block on T2 or T3 output to deliver this spec.

═══════════════════════════════════════════════════════════════════════
## §8 — OPEN QUESTIONS + CONTRADICTIONS
═══════════════════════════════════════════════════════════════════════

### §8.1 — Modal classification edge case

Per §1.4 tie-breaker rule 2, modal overlay spans viewport → LAYOUT. Per §1.4 tie-breaker rule 3, modal content has internal JS coordination but doesn't span viewport (the OVERLAY does) → MOLECULAR. The spec treats them as one block in §2.2 row #58, but a clean separation might be:
- `.ts-modal-overlay` (layout, ALWAYS STRICT) — viewport positioning + scroll lock
- `.ts-modal` (molecular, STRICT) — content shell

The reference repo uses a single `.ts-modal` rule (line 8229). The rebuild likely benefits from separating overlay-positioning from content-shell, similar to how the offcanvas editor separates `.ts-oce-overlay` from `.ts-oce-panel`. **Surfaces to S3 / S5 for resolution at Wave 2 synthesis.**

### §8.2 — Marquee fullwidth promotion

§2.2 row #61 puts the standard marquee as molecular. §2.3 row #119 puts `.ts-marquee.fullwidth.ts-marquee-container` as layout. This is **two block-specs for one component**, distinguished by the `fullwidth` modifier. The rebuild may want a single block-spec with a tier-promotion flag rather than two separate sandboxes. **Surfaces to S5 protocol design — tier promotion based on modifier presence.**

### §8.3 — Surface-N utilities classification

§2.1 row #42 lists `.ts-surface-0/1/2/3/4/5` as atomic, but notes they promote to LAYOUT when applied as section backgrounds. This is a **context-dependent typology** that the current taxonomy doesn't model. Possible resolutions:
- (a) Always layout (cautious; some surface-N usages are inside cards or buttons which would falsely require ALWAYS STRICT)
- (b) Two block-specs: `.ts-surface-N` (atomic utility) vs `.ts-section.ts-surface-N` (layout composition)
- (c) Tier promotion based on parent context — the sub-agent inspects where the rule is used and elevates if it's at section scope

**Recommend (b) for clarity.** Surfaces to S3 / S5 at Wave 2 synthesis.

### §8.4 — Reveal animations: atomic or engine-level

§2.1 row #35 lists `.ts-fade-in`, `.ts-fade-up`, etc., as atomic. But these depend on an IntersectionObserver in `toolskin.js` that adds an `.in-view` class. Is the CSS atomic and the engine separate, or is the block-spec a composite that includes the engine code?

**Recommended pattern:** the CSS animation primitives are atomic per §2.1 row #35 (PERMISSIVE). The engine code lives in a separate "engines" sandbox category that isn't part of the block typology — engines are Toolskin's runtime substrate, treated as INFRASTRUCTURE, not blocks. S4 (Build Pipeline) defines the engine bundle separately.

**Surfaces to S4 / S5 for category clarification:** infrastructure (engines, observers, theme toggle implementation, modal lock implementation, asset loader) vs blocks (the visual primitives that engines operate on).

### §8.5 — Type primitives (Headings, body, mono) and font tokens

§2.1 rows 19-20 classify `.ts-h1`–`.ts-h6` + presets as atomic. They consume `--ts-font-*` tokens (per typography-master skill). No issue with the classification, but the rebuilt type layer needs S1/S2 to expose the font tokens before §2.1 row 19-20 rebuilds can land. Cross-reference S1 + typography-master skill update.

### §8.6 — UIKit aliasing

Some UIKit `ts-ui-*` selectors share rules with core `ts-*` selectors (e.g., `.ts-checkbox` and `.ts-ui-checkbox-group` declared together in toolskin.css). The rebuild needs a stance: are UIKit components separate blocks or aliased extensions of core blocks?

**Tentative stance:** UIKit components that genuinely add behavior (`.ts-ui-select`, `.ts-ui-accordion--separated/dual-icon`, `.ts-ui-table--sortable/bulk`, `.ts-ui-masonry`, `.ts-ui-spinner`, `.ts-ui-resizable/draggable/sortable`, `.ts-ui-number-input-wrapper`, `.ts-ui-toast-*`) are separate molecular blocks per §2.2. UIKit components that are pure aliases of core (`.ts-ui-checkbox-group` = `.ts-checkbox-group`) collapse into the core block-spec. **Surfaces to S3 component registry.**

═══════════════════════════════════════════════════════════════════════
## §9 — STATUS + SIGN-OFF
═══════════════════════════════════════════════════════════════════════

**Spec status:** PROPOSED — Wave 1 deliverable, time-boxed 25 min.

**Coverage:**
- §1 typology definitions (atomic / molecular / layout): COMPLETE
- §2 component classification table: COMPLETE — ~128 component families surveyed, all assigned a tier
- §3 color contract per Rule 15: COMPLETE
- §4 ts-marquee resolution: COMPLETE — both flagged items resolved
- §5 cascade-sensitivity rule treatment: COMPLETE — decision criteria documented
- §6 @taxonomy_chips_strip verbatim extraction: COMPLETE — 10 factors + refactor requirements captured
- §7 contact points: COMPLETE
- §8 open questions: 6 surfaced for Wave 2 synthesis or Gate 4 resolution

**Gaps (none silently skipped):**
- §8 items 1-6 are flagged for cross-wave resolution; they are not blockers for Wave 1 synthesis.
- Full reading of `restyling-architecture.md` and `master-plan.md` was deferred (time-box). Where references were needed (state tokens, derivative chain), they're called out for S1/S2 to deliver in Wave 2 — no critical block typology decision depends on April spec content beyond what's already in this spec.

**Rule honoring:**
- Rule 1-15: honored throughout
- Repo isolation (file 07): all reads from `../toolskin-showcase/`, no writes, no git ops against reference
- Tier hierarchy (file 05): Tier 1 in-house authority preserved; ECC/external skill outputs not consulted

**Conflict with external skills:** none triggered in this spec scope. T1 read no external skill output. If an external skill at Wave 2 synthesis proposes a typology contradiction, this doc's §1 criteria win per Tier 1 priority.

**Status code:** `DONE`
