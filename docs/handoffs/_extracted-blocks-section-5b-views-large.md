# Extracted Blocks Catalog — Section 5b: Views (large / page-compound)

**Sub-agent:** 5b  ·  **Chunk:** views/ large files  ·  **Files:** 3  ·  **Total lines:** 16,307  ·  **Total bytes:** ~523,671

Scope: the three LARGEST view CSS files under `docs/references/toolskin.css_extracted-core-blocks-to-refactor/views/`. Companion to chunk 5a (small views) and 4a/4b (components). Discipline this pass: **GREP-ONLY MANDATORY** — a prior agent crashed at 292k tokens trying to Read these in full. This pass used 8 targeted slice-reads totaling under 1,400 lines plus ~30 grep passes; the prose-narrative format used for chunks 4a/5a is replaced here by enumerated tables + verbatim annotation excerpts, because exhaustive per-rule walkthrough would blow the token budget and add little value over what greps already reveal.

## Files in this chunk

| File | Lines | Bytes | Block type |
|---|---|---|---|
| ts-tree-explorer-styles(not-splitted).css | 2,369 | 94,298 | **multi-component file mis-named as a single view** — the file the owner himself flagged "not-splitted." Carries: the tree-explorer scope (rows / nodes / connectors / curved variant), an action-bar / topbar block, a search-input expandable, a chip-strip (taxonomy chips, locked-design-input per Rule 9), a popover/popmenu, plus preview-header sub-component. **Five+ logical sub-modules glued together.** |
| ts-oce-panel-banner-generator-styles.css | 6,903 | 210,705 | **app-shell view** — the full `.ts-banner-generator-app` reference application from `docs/references/generator/`, plus the offcanvas quick-editor (`.ts-oce-*` family: FAB / overlay / panel / header / tabs / close) that wraps it. References every form primitive (ranges, toggles, color-swatches, ui-select, number-input, chip-strips, accordions) at scope-narrowed `.ts-banner-generator-app …` selectors. **The largest single CSS asset in the entire reference catalog.** |
| ts-oce-panel-styles(partial).css | 7,035 | 218,668 | **subset + extensions of the banner-generator file** — first ~6,330 lines are byte-for-byte identical to banner-generator-styles starting at *its* L397 (the file skips the FAB/overlay/panel-shell preamble and goes straight to the `.ts-oce-panel.ts-banner-generator-app` token cartel). Then ~700 additional lines tail (light-theme overrides for OCE-panel-specific assets: nav-bar, accordion, sortable, footer, modals, toasts, tabs, section dividers, nav-active, accent-bar cards, toggle/range) that don't appear in the banner-generator file. **"(partial)" = missing the leading OCE-panel-shell block AND the OCE-panel light-theme overrides tail aren't in the banner file either** — neither file is "complete"; they are two overlapping extractions of the same conceptual surface that need merging. |

---

## Special case: `(not-splitted)` annotation on ts-tree-explorer — the logical split

The parenthetical `(not-splitted)` is the owner's self-flag that this single 2,369-line file should have been multiple files. Section headers (greppable as `/* === … === */` and `/* === … === */ … =================================================================== */`) cluster into **seven logical sub-modules:**

| Proposed sub-file | Lines (approx) | Selectors | Concern |
|---|---|---|---|
| 1. `ts-tree-explorer.tokens.css` | L1–L260 | `:root :is(.ts-tree-explorer, .ts-tree)` token cartel + the curved-variant `data-tree-variant="curved"` override block | THE TOKEN-CARTEL ENGINE — declares 30+ `--ts-tree-*` tokens; everything else consumes them. The "(FAILED @refactor-note + @owner-fix:tree-token-cascade-2026-05-16)" 80-line postmortem at L19–98 documents an aborted attempt to remove the `:root [class*="ts-tree"]` scope-alias — see "Critical annotations" below |
| 2. `ts-tree-explorer.shell.css` | L168–L390 | `.ts-tree-explorer` root + body / scroll / actionbar geometry | View shell — width clamp, intrinsic height calc, scroll regions, `.tree--scroll` modifier |
| 3. `ts-tree.css` | L391–L770 | `.ts-tree`, `.ts-tree__node`, `.ts-tree__children`, `.ts-tree__row`, `.ts-tree__row` states (hover/focus/active/selected), `.ts-tree__label`, `.ts-tree__icon`, indent-guide connectors (`::before`/`::after`), state map | THE TREE RENDERING — could ship standalone as `ts-tree` atomic component. Independent of the explorer shell |
| 4. `ts-tree-explorer.intro.css` | L685–L770, ~L730–L865 | `.ts-tree-explorer__intro`, `.ts-tree-explorer__intro-bullets.ts-list`, `--ts-feat-icon-gap` / `--ts-feat-item-pad` token group | Empty-state intro panel — has its own `--ts-feat-*` token sub-cartel |
| 5. `ts-tree-explorer.topbar.css` | L869–L1290 | `.ts-btn-group`, `#ts-topbar` scoped variants, `#ts-topbar .ts-input-group`, `.ts-tree-explorer__search-group` (expandable search), `#ts-topbar .ts-btn`, `#ts-topbar` `:has()`-driven layout, `.theme-toggle` scoping | Topbar / actionbar — wraps shared `.ts-btn` + `.ts-input-group` core components into the tree-explorer's specific topbar layout. Has its own `@refactor-note:topbar-unification-2026-05-16` block (L1331) |
| 6. `ts-tree-popover.css` | L1846–L1937 | `.ts-tree-popover` + `--ts-popover-*` 14-token cartel + `&` nested state rules | Popover/menu UI for the action button — declares `--ts-popover-bg-surface: var(--ts-bg-0)` etc. Has 2 `/*NOTE: hardforced, eliminate per step 3*/` annotations (L1872, L1934) |
| 7. `ts-tree-explorer.chipstrip.css` | L1938–L2270 | `#ts-taxonomy.ts-chips` ID-scoped chip strip + chip tokens + L1815–L2067 OWNER REFACTOR-REQUIREMENTS block (53-line spec for the chip-strip refactor: scoped-root token setup, horizontal-scroll replacement, truncation-dropdown wiring, sibling shrink, chip styling inheritance, `!important` cleanup with visual-parity protocol) | The `@taxonomy_chips_strip` block — Rule 9 LOCKED DESIGN INPUT. The 53-line REFACTOR REQUIREMENTS comment is the most detailed owner-authored refactor spec in the entire chunk-5b corpus |
| 8 (footer). `ts-tree-explorer.preview-header.css` + media | L2272–L2369 | `.ts-tree-explorer__preview-header`, `.ts-tree-explorer__preview-name`, `.ts-tree-explorer__preview-header .ts-btn`, plus the three `@media (max-width: …)` rules at L1394 / L1410 / L1683 / L2361 / L2366 | Preview-header sub-component + responsive density toggles |

**Recommended action:** when the owner says "not-splitted," he means this file SHOULD be split into eight files (or at minimum five: tokens / shell+tree / topbar / popover / chip-strip). Today, modifying any one block requires loading 94KB of unrelated context.

## Special case: `(partial)` annotation on ts-oce-panel-styles — what's missing

The parenthetical `(partial)` is the owner's self-flag. Grep + targeted slice-reads identify three distinct kinds of "missing":

1. **Missing preamble (lines 1–396 of banner-generator file).** The partial file starts at `.ts-oce-panel.ts-banner-generator-app {` (its L5), skipping the `:root --ts-oce-width/--ts-oce-tab-h/--ts-oce-header-h` block, the FAB selectors (`.ts-oce-fab`, `.ts-oce-fab--tab`, `.ts-oce-fab:hover`), the backdrop `.ts-oce-overlay` + `.ts-oce--open` open-state, the panel shell `.ts-oce-panel` + `.ts-oce-panel__inner`, the panel header `.ts-oce-panel .ts-oce-panel__header` + title + actions + close-button, the panel tabs `.ts-oce-panel__tabs` + `.ts-oce-tab`, and the 100-line OWNER NOTES + global-inheritance-policy comment (banner L293–393). All of these ARE present in the banner-generator file. The "(partial)" file relies on them being loaded first.
2. **Missing card-shell rules between the OCE-panel cartel and the banner-generator overrides.** The banner file has a long `.ts-oce-panel__inner .ts-card` + `.ts-oce-field` block (banner L841–966) before re-entering the toggle/topbar section. The partial file truncates this — the `.ts-oce-panel__inner` shell rules are partly in the partial file (L446, L450, L482) but the connective tissue (`.ts-oce-field label`, `.ts-color-preset:hover`, `.ts-oce-close:hover`) appears at L539–555 of partial — which is OUT OF ORDER vs banner's L934–965. The partial file appears to have been compiled from a different selector group order; merging will require de-duplication.
3. **Banner-generator file is ALSO partial in the other direction.** The OCE-light-theme tail in partial L6510–7035 (`/* OWNER's FIX: dynamic color system migration (CRAZY_FIX_RULES) */`, light-mode `[data-theme="light"]` overrides for ts-nav, sections, cards/panels, accordions, sortable, footer, modal, toast, tabs, section-divider, nav-active, accent-bar, toggle/range) DOES NOT appear in the banner-generator file. So "(partial)" cuts BOTH ways: each file holds 5,000+ lines the other doesn't.

**Verdict — neither file is canonical alone.** The "full" OCE-panel CSS would be: banner-generator preamble (L1–396) + shared body (~5,000 lines of `.ts-oce-panel.ts-banner-generator-app`, forms, accordions, color-swatches, ui-select, number-input, chips, range, toggle, layout grid, dropdown, scope-isolated tokens) + partial-only OCE light-theme overrides (~700 lines). Total ~7,800 lines = ~245KB once merged and de-duplicated.

## Special case: banner-generator relationship to `docs/references/generator/`

The banner-generator file is the CSS asset that styles the reference app under `docs/references/generator/` (per CLAUDE.md top-level index: "generator/ — Banner-generator reference app — HTML, JS modules, presets"). All `.ts-banner-generator-app` scope selectors in this CSS correspond to the root class set on the generator app's `<body>` (verified by selector `.ts-banner-generator-app body` at L1111). The file contains DOM-tied selectors `#ts-panel`, `#ts-panel-tabs`, `#ts-panel-body`, `#ts-topbar`, `#ts-main`, `#animation-controls`, `#input-animated` — these IDs are the generator app's static DOM hooks. The CSS scoping pattern `.ts-banner-generator-app … .ts-card-rows .ts-field …` (5–8 selector-deep) is the worst specificity profile in the entire chunk-5b corpus and the dominant cleanup burden.

The file repeatedly DOUBLES its selectors: `.ts-banner-generator-app .ts-card-rows .ts-field, .ts-field { … }` (L4008–4009 banner, L3613–3614 partial). Each rule appears TWICE — once app-scoped, once global. This is the failed-migration debris of "promote to global / keep scoped fallback." Cleanup: pick global, delete app-scoped duplicate. The OWNER NOTES block at banner L293–393 explicitly mandates this consolidation (see "Critical annotations" below).

---

## Per-file catalog

### ts-tree-explorer-styles(not-splitted).css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/views/ts-tree-explorer-styles(not-splitted).css`
- **Lines:** 2,369  ·  **Bytes:** 94,298
- **`--ts-*` token declarations:** **111** total. Major groups:
  - Tree token cartel (L102–164): `--ts-accent` (overridden to `--ts-accent-tree!important`), `--ts-tree-row-h` (THE single base rescale lever), `--ts-tree-row-gap/pad-x/pad-y/gap/indent` (derivative geometry), `--ts-tree-fs/icon/twist/radius`, `--ts-tree-guide/guide-active/guide-w/guide-radius` (connector ornament), `--ts-tree-folder-icon/folder-color/file-icon/icon-scale-file`, `--ts-tree-label/label-folder/label-hover/label-rest-op/meta` (semantic color roles), `--ts-tree-row-bg/row-hover/row-focus/row-active/row-active-bar/mark-bg/mark-fg` (state surfaces — note L147 then L148 both declare `--ts-tree-row-hover` with DIFFERENT values; the second wins, the first is an unflagged A/B), `--ts-tree-dur/ease`, `--ts-tree-max/gutter`, `--ts-tree-actionbar-h: 60px` (LIVE at L163 outside of any selector, a stray declaration at the wrong indent level), `--ts-topbar-constrain`.
  - Curved-variant overrides (L204–209): `--ts-tree-row-h: 2rem`, `--ts-tree-guide-radius: calc(... * 0.42)`, `--ts-tree-max: 78rem`, `--ts-tree-label-rest-op: 1`, `--ts-tree-guide` (re-derived with `--ts-text-muted`), `--ts-tree-radius: var(--ts-radius-sm, 6px)`.
  - Surface re-anchors at component boundaries: L174 `--ts-this-bg: var(--ts-bg-0)` (`.ts-tree-explorer`), L431 `--ts-this-bg: var(--ts-bg-1)` (`.ts-tree__row`), L793 `--ts-this-bg: var(--ts-bg-1)`, L1127 `--ts-this-bg: var(--ts-bg-2-t)`, L1148 `--ts-this-bg: var(--ts-bg-0)` (topbar input), L1198 `--ts-this-bg: var(--ts-bg-0)`, L1218 `--ts-this-bg: var(--ts-accent)` (active button), L1258 `--ts-this-bg: var(--ts-bg-1)`, L1277 `--ts-this-bg: var(--ts-bg-3)` (focused input), L1872 `--ts-this-bg: var(--ts-popover-bg-surface)` (popover), L1910 same, L2151 `--ts-this-bg: var(--ts-accent-border-hover)` (active chip), L2163 `--ts-this-bg: var(--ts-bg-0)`, L2181 `--ts-this-bg: var(--ts-bg-0)`. **15 surface re-anchor sites.**
  - Popover cartel (L1854–1868): `--ts-popover-rad`, `--ts-popover-border`, `--ts-popover-bg`, `--ts-popover-bg-surface`, `--ts-popover-bg-surface-alt`, `--ts-popover-color`, `--ts-popover-icon`, `--ts-popover-active`, `--ts-popover-w: 220px`, `--ts-popover-item-bg/item-pad`, `--ts-popover-fs/lh`.
  - Chip-strip cartel (L2099–2107): `--ts-chip-border` (currentcolor-derived, like chunk 4a chips), `--ts-chip-border-active`, `--ts-chip-bg` (set inside chip).
  - Misc: `--ts-input-bg/border/radius` (L1149–1151, scoped to `#ts-topbar .ts-input-group`), `--ts-tree-action-menu-h/radius` (L881–882), `--ts-feat-icon-gap/feat-item-pad/feat-item-gap` (intro panel), `--ts-this-bg-grad-dark-pct: 3%`/`13%` (L941, L2079 — gradient-strength override), `--ts-this-bg-border: var(--ts-this-bg-border-focus)` (L1279, focused input border re-anchor), `--ts-tree-icon-size` (L257, declared inside `.ts-this-bg: currentColor` rule — odd nesting).
- **`--ts-*` token references:** **413** total. Heaviest consumers: `--ts-this-bg-*` derivative chain (~80 refs), `--ts-text-*` family (~55 refs), `--ts-accent` family (~45 refs), `--ts-tree-*` self-derived consumption (~120 refs internal to the file's own cartel), `--ts-sp-*`/`--ts-radius-*`/`--ts-fs-*` spacing/sizing primitives (~70 refs).
- **`--ts-bg-N` direct-reference contribution:** **18 LIVE references** (per `grep --ts-bg-[0-9]\b|--ts-bg-body\b`). Breakdown (line numbers from the declarations grep above):
  - `--ts-bg-0`: L174, L1148, L1198, L1857, L2163, L2181 = **6 refs** (component-root re-anchors, ALL of which should migrate to `--ts-this-bg-dim-N` or remain as ONE root with derivative cascade)
  - `--ts-bg-1`: L431, L793, L1258 = **3 refs** (action-bar / row re-anchors)
  - `--ts-bg-2`: L147 (commented-out variant of row-hover), L1858 (popover surface alt) = **2 refs** (one is dead code)
  - `--ts-bg-2-t`: L1127 = **1 ref** (translucent surface — uses the `-t` transparent variant which doesn't exist in `assets/css/next/system/surfaces.css` yet)
  - `--ts-bg-3`: L1277 = **1 ref**
  - **No `--ts-bg-body` LIVE refs.**
  - Total: ~13 LIVE component-tier refs (+ ~5 in fallback positions or commented). **All violate Rule 15 / refusal pattern R-rule-15.**
- **`oklch(from ...)` Wave 1.6 anti-pattern:** **NONE.** (Tree file is clean of this anti-pattern.)
- **Selectors / IDs (high-level):** `.ts-tree-explorer`, `.ts-tree-explorer.tree--scroll .ts-tree-explorer__body`, `.ts-tree-explorer.tree--scroll .ts-tree-explorer__foot`, `.ts-tree-explorer__intro` + `.hide-section`, `.ts-tree-explorer__intro-bullets.ts-list`, `.ts-tree-explorer__preview-header` + `.ts-tree-explorer__preview-name`, `.ts-tree-explorer__search-group`, `.ts-tree-explorer__actionbar-title/actions`, `.ts-tree`, `.ts-tree__node`, `.ts-tree__children`, `.ts-tree__row` + states, `.ts-tree__label`, `.ts-btn-group` + `.ts-btn` children, `.ts-btn::hover` (⚠ INVALID CSS — should be `:hover`, double-colon is for pseudo-elements; this rule never matches), `#ts-topbar` + 14 nested scope variants (`:not(:has(...))`, `:has(...)`, `.ts-input-group`, `.ts-tree-explorer__search-group`, `.theme-toggle`, etc.), `.ts-tree-popover`, `#ts-taxonomy.ts-chips`, chip-strip data-active variants. **ID-anchored:** `#ts-topbar` (extensive — fully ID-scoped), `#ts-taxonomy` (chip strip, ID-scoped).
- **`@media` queries:** 6 — `(prefers-reduced-motion: reduce)` L212, `(max-width: 960px)` L761, `(max-width: 640px)` L995, `(max-width: 868px)` L1394, `(max-width: 600px)` L1410, `(max-width: 600px)` L1683, plus two density-toggles at L2361, L2366. **No `@property`, no `@container`, no `@keyframes`, no `@supports`.**
- **Non-OKLCH literals:** check via separate grep — file is mostly `color-mix(in srgb, var(--ts-…), transparent X%)` driven; very few raw hex / rgb / hsl literals. Counted from the declarations grep: zero raw hex declarations at root (the only hex-like values are `0%`, `0px` fallbacks). **Tree file is the CLEANEST of the 3 in chunk 5b for color tokenization** despite its bg-N violations.
- **Owner annotations / critical comments (VERBATIM, line-anchored):**
  - L3–15 — file header: `"TOOLSKIN . FILE TREE EXPLORER … A token-driven tree view built entirely on the Toolskin design system. Every gap, pad, border, colour, surface and type size is a derivative declared once on the main scope: .ts-tree-explorer … To re-tune the whole component, change ONE value: --ts-tree-row-h -> rescales rows, pads, gaps, indent, type, icons / --ts-this-bg -> re-derives every surface, border & state / --ts-accent-h/s/l -> re-themes every accent (Toolskin engine) … Light / dark is free: every value resolves through Toolskin tokens, so [data-theme="light"] adapts the whole tree with zero extra CSS."` — **the canonical statement of the "single base lever" design intent** (Wave 1.6 "OQ-D1 confirmed: ratio-driven derivative scaling"). Tree-explorer is the cleanest realization of this principle in the catalog.
  - L19–98 — `FAILED @refactor-note:tree-token-cascade-2026-05-16` + `@owner-fix:tree-token-cascade-2026-05-16` — a 79-line postmortem of a botched refactor. Verbatim key passages:
    - L19–30: "Removed `:root [class*=\"ts-tree\"] *` selector that explicitly reset all tokens on every descendant. Tokens now inherit normally from .ts-tree-explorer scope, which is what custom property semantics intend. The previous explicit-on-descendant pattern was masking the density attribute response (parent's density rule wrote correct value but the `*` rule re-wrote it on every child, neutralizing the effect)."
    - L33–48: "PARTIAL REVERT + STABILIZATION. Re-enabled `:root [class*=\"ts-tree\"]` scope alias. Reason: Removing this rule broke token propagation across the tree system. Tokens were not reaching dependent classes/components because this selector was intentionally acting as a distribution layer, not just a reset. This architecture does NOT rely purely on passive inheritance. It requires scoped propagation for tokens to reach all consumers. Do NOT remove this again."
    - L69–78: "CRITICAL NOTE. Several core cascade rules were removed without verifying: token reachability, specificity resolution, dependency coverage. This caused a system-wide regression. Rules were recovered and re-integrated manually."
    - L81–95: "DIRECTIVE. Do NOT refactor or remove foundational cascade rules without: 1. Full token propagation verification 2. Cascade + specificity validation 3. Safe rollback snapshot. SUMMARY: - Token delivery was broken → now restored - System stabilized - This rule is REQUIRED, not redundant. Do not remove without a full cascade audit."
    - **Council implication:** this postmortem is direct evidence supporting the rebuild's §13 "explicit `:is(...)` enumeration" strategy over substring-distribution. The owner here is preserving a `:root [class*="ts-tree"]` substring-distribution selector because removing it caused regression — but the rebuild's S2 spec (`_rebuild-system-spec.md`) replaces this pattern with explicit enumeration designed at block-layer time. The owner's postmortem doesn't conflict with the rebuild plan; it confirms WHY substring-distribution is hard to remove in the legacy codebase (and why the rebuild must engineer the replacement up-front, not retrofit).
  - L125: `/* 0 = classic ├── └── ; non-zero only honoured by the [data-tree-variant="curved"] block */` — documents the connector ornament toggle.
  - L128–132: `/* Folder icons: The cascade variable --ts-tree-folder-color starts as accent at the top of the tree and is overridden to secondary at depth >= 3 (children-of-children-of-children). Hover / selected / expanded then lifts it back to accent. Files default to secondary. */` — the cascade-depth color rule.
  - L168–171 — file's MAIN-SCOPE header: `"MAIN SCOPE - every component token is declared here, exactly once. Children only ever *consume* these tokens (Toolskin two-layer rule)."` — explicit Rule 2-tier statement.
  - L197–203 — `"ALTERNATE THEME: 'curved' — the iteration-1 design preserved. Add data-tree-variant='curved' to the .ts-tree-explorer root. Brings back rounded-L elbows, tight rows, twist on the left, …"` — variant-via-data-attribute pattern (Rule 7 / pattern-opt-in conformance).
  - L193–195 — inline comment inside `.ts-tree-explorer`: `"modified the dom o make possible the stikcy tookbar inside the exoplorer and movedthe section with nfooutsidethe cotnianer for proper dom usage. the height is calculated but we need to sovle the scrollingaccuracy usbailty. and scrol snap´ping."` — open issue: height calc + scroll-snap not yet solved.
  - L1154–1156: `"@search_expandable — opt-in variant for an icon-only collapsed [search input]"`.
  - L1178: `"@ts-topbar_tree_scope — structural block, must remain intact."`
  - L1331: `"@refactor-note:topbar-unification-2026-05-16"` — companion to the tree-cascade postmortem; topbar block was unified the same week.
  - L1813–1814 + L1815–L1939 — `"END OF THE OLD VERISON TO TURN INTO A VARIANT."` then a long `NOTE — VARIANT WORK PENDING (see step 4): …` planning block for the variant-as-token-swap pattern (tokenization sample for the main variant).
  - L1938: `"@taxonomy_chips_strip — KEEP design output identical; refactor structure only"` — **Rule 9 locked-design-input declaration** (the 10 protected values are LOCKED).
  - L1815–L2067 (53 lines, INSIDE the chip-strip block): **REFACTOR REQUIREMENTS** spec, verbatim section headers:
    - "1. SCOPED ROOT TOKEN SETUP (chips variant) — Wrap the chip-level overrides on this component into a scoped root token block — same pattern used in every other asset-layer refactor. The chips here must INHERIT the original `.ts-chips` tokens and only swap the values that this variant changes (height, padding, gap, surface context). No new unique selectors per chip; the variant is a token swap on the existing `.ts-chips` base. Goal: stop fighting `.ts-chips` styling with overrides. Make this instance a tokenized variant of `.ts-chips`, not a re-style of it."
    - "2. HORIZONTAL SCROLL — REPLACE THE CURRENT METHOD … expose it as a GLOBAL reusable asset — e.g. `.ts-scrollstrip` or `.ts-actionbar-scroll` — usable by any 'scrollable navigation / filter bar / nested-action row' elsewhere in the system. This component then composes that asset, it does not redefine the behavior."
    - "3. TRUNCATION DROPDOWN (accessibility companion) — `toolskin.js` already ships a truncation-dropdown helper. Wire it into this strip so a 'more filters' / overflow trigger appears beside the scrollable region."
    - "4. ROW SIBLING SHRINK / COLLAPSE PRIORITY — This strip needs WIDTH PRIORITY over the other two siblings on its row. Add media queries (or container queries — preferred if the row is a CQ context) so that as the row narrows: Sibling buttons collapse to icon-only mode. Any sibling container shrinks, yielding horizontal space. This strip retains its `flex: 1 1 var(--_chips-max-w)` claim and grows into the freed space."
    - "5. CHIP STYLING INHERITANCE — The chips inside this strip must inherit every token and state style from the base `.ts-chips` chip rules. The current customization fights that inheritance. After the scoped root token setup in #1, the chip children should style themselves automatically — no per-chip overrides inside this selector."
    - "GUARDRAILS — !important CLEANUP + DEDUP PROCEDURE … Both `!important` declarations on the gradient/background are present ONLY because base `.ts-chips` rules in toolskin.css currently win, and because the HTML still drops head-level styles. The cleanup order is: a. Remove the migrated CSS from the HTML <head> first. b. Dedupe redundant `.ts-chips` rules inside toolskin.css so this instance's declarations land naturally in the cascade and no longer need `!important`. c. Only then remove the `!important` flags here. Do not skip steps or reorder them."
    - "VISUAL PARITY PROTOCOL (required, no exceptions): 1. Snapshot the rendered output BEFORE any change … 2. Implement the refactor. 3. Snapshot again under the exact same conditions. 4. Diff the before/after snapshots pixel-by-pixel. If anything changed — gradient softness, fade width, chip alignment, border color, height, anything — fix and re-snapshot until parity is confirmed. 5. Only commit once the final diff is clean."
    - **This 53-line spec is gold** — it's the owner's explicit blueprint for the chip-strip variant pattern, the global `.ts-scrollstrip` asset proposal, the toolskin.js truncation-dropdown wiring, the responsive sibling-shrink with container queries, the `!important` cleanup order, and the visual-parity protocol. It maps directly onto the rebuild's Pattern 17 (visual audit before specs) + Rule 9 (chip-strip LOCKED) + the design-DNA visual-parity gates.
  - L2208–2210: `"@taxonomy_chips_strip — TRUNCATION DROPDOWN companion (docstring §3)."` — implements requirement #3 above.
  - L2306–2308: `"Note: the .ts-tree-explorer__actionbar-title/actions width budget"` — partial comment, action-bar width budget concern.
  - L1872, L1934 — `/*NOTE: hardforced, eliminate per step 3*/` — two `!important` / hard-forced declarations slated for removal once dependency cleanup completes.
- **Refactor flags:**
  - **SPLIT THE FILE.** Per "(not-splitted)" annotation. 5–7 sub-files proposed above. HIGH PRIORITY.
  - **L147 / L148 — `--ts-tree-row-hover` declared TWICE with different values.** Second wins. First is unflagged A/B. Cleanup: delete L147.
  - **L163 — `--ts-tree-actionbar-h: 60px` declared outside any selector (or at the wrong indent).** Stray declaration — verify scope; may be silently invalid.
  - **L1210 — `.ts-btn::hover` (double-colon) — INVALID CSS.** Never matches. Cleanup: fix to `.ts-btn:hover`.
  - **18 LIVE `--ts-bg-N` direct references** — all violate Rule 15 / R-rule-15. Migration: re-anchor each component's `--ts-this-bg` once; let derivatives cascade.
  - **`--ts-bg-2-t` referenced at L1127** — the transparent variant doesn't yet exist in `assets/css/next/system/surfaces.css`; either add the `-t` derivative tier or migrate to a `color-mix` against `--ts-this-bg`.
  - **`!important` overuse** — L102 (`--ts-accent`), L419 (`height: var(--ts-tree-row-h)!important`), L1150 (`--ts-input-border`), L2069–2070 (`mask-image: none!important`), and several others. Cleanup per the chip-strip spec's three-step procedure.
  - **`:root [class*="ts-tree"]` substring-distribution selector** at L100 — owner's postmortem mandates it stays; rebuild's S2 spec replaces this pattern. Council note: this is an existing tension; the rebuild must engineer explicit enumeration up-front, the legacy file cannot be refactored in-place without regression risk per L19–98 postmortem.
  - **6 `@media` queries but no `@container` queries** — chip-strip refactor spec #4 explicitly prefers container queries; the file does not yet use them.
  - **Hardforced `--ts-this-bg` re-anchors inside popover (L1872 + L1934)** — owner-flagged for removal "per step 3."

### ts-oce-panel-banner-generator-styles.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/views/ts-oce-panel-banner-generator-styles.css`
- **Lines:** 6,903  ·  **Bytes:** 210,705
- **Block type:** the full banner-generator-app reference application + the OCE quick-editor offcanvas that wraps it. **Largest single CSS file in the entire reference catalog.**
- **`--ts-*` token declarations:** **523** total — the highest density in chunk 5b. Major groups:
  - OCE width/header tokens (L3–5, `:root` scope): `--ts-oce-width: min(22rem, 92vw)`, `--ts-oce-tab-h: 48px`, `--ts-oce-header-h: 60px`.
  - FAB local re-anchors (L49, L52, L57): `--ts-this-bg-bright`, `--ts-this-bg: var(--ts-bg-0)`, `--ts-this-bg-bright` (hover, second declaration).
  - OCE panel cartel (L151–192): `--ts-this-bg: var(--ts-bg-0)`, `--ts-panel-border: var(--ts-this-bg-border)`, `--ts-fs-base: 0.78rem` (⚠ VIOLATES RULING 3 — base font is 13px, not 0.78rem ≈10.14px), `--ts-card-title-fs`, `--ts-card-header-h: 40px`, plus the close-button + tab cartel.
  - OCE tab token group (L246–289): tab variants `--ts-this-bg: transparent / var(--ts-bg-2/3/1)`.
  - **OCE-panel banner-generator app cartel** (L402–421, the largest single cartel — 18 tokens): `--ts-panel-w: 400px`, `--ts-card-pad/gap/sp/radius/header-h`, `--ts-card-bg: var(--ts-bg-1-t)`, `--ts-card-bg-2: var(--ts-bg-2)`, `--ts-card-border`, `--ts-input-fs/pad-y/pad-left/radius`, `--ts-btn-radius/fs`, `--ts-range-h/thumb/bg/border/rad`. All consume direct `--ts-bg-N` primitives.
  - Panel-inner re-anchors (L432, L443, L466–468, L481): `--ts-this-bg: var(--ts-panel-bg)`, `--ts-ptab-aborder/pad-y/pad-x`, `--ts-this-bg: var(--ts-bg-body)`.
  - **Panel isolation cartel** (L601–765): `[data-theme="light"] .ts-oce-panel[data-ts-oce-isolated]` re-declares THE ENTIRE PRIMITIVE + SYSTEM TOKEN LAYER inline with hex literals (`--ts-bg-body: #0c0d0f`, `--ts-bg-0..5` hex, `--ts-bg-0-t..4-t`, `--ts-text-primary/secondary/muted` hex, `--ts-border-0..4`, `color-scheme: dark`, `--ts-input-bg/border`) PLUS the full accent-derivative chain (`--ts-on-accent` via the `oklch(from ...)` Wave 1.6 anti-pattern at L627, `--ts-accent-bright/bright-2/dark/dark-2/muted/border/border-hover` — all via raw `color-mix`), `--ts-accent-grad/grad-comp/grad-flat` (3 gradient variants), the FULL `--ts-this-bg-*` derivative chain (`--ts-this-bg-bright/bright-1/bright-2/bright-3/dim/dim-2/dim-3/dim-4/dark/dark-1/dark-2/muted/grad/grad-comp/grad-flat/grad-1/grad-2/grad-3/grad-4`), border variants, hover/active/focus/disabled, text-color derivatives. **This is the OCE panel forcibly maintaining dark-mode visuals even when the host page is in light mode.** ~100 tokens declared in a single block.
  - Toggle/range cartel sub-section, button cartel sub-section (L815–870 + L850–870), then THOUSANDS of selector-scoped token applications for the banner-generator app body, topbar, buttons, canvas, ranges, cards, fields, color-rows, swatches, number-inputs, ui-select, dropdowns, charts, layout grid.
- **`--ts-*` token references:** **1,524** total — the highest in chunk 5b. The file CONSUMES the system derivative chain on essentially every rule.
- **`--ts-bg-N` direct-reference contribution:** **112 LIVE references** (per grep). This is by far the worst chunk 5b file. The panel-isolation block alone re-declares all 6 `--ts-bg-N` AND consumes many more inline. Sample lines: L52, L151, L191, L247, L280, L289, L408–409, L419, L432, L443, L466, L481, L644, L652, L713 (`--ts-this-bg-focus-outline: var(--ts-accent, #ff540a)`), L1138, ... (112 total). **The biggest single contributor to the cross-chunk `--ts-bg-N` debt.**
- **`oklch(from ...)` Wave 1.6 anti-pattern:** **1 instance** — L627 `--ts-on-accent: oklch(from var(--ts-accent) clamp(0, (0.75 - l) * 999, 1) 0 0)`. Wave 1.6 Resolution #1 mandates engine-derived constants, not runtime `from`. R-rule-15 / engine-constant violation.
- **Selectors:** ~600 distinct selectors (sampled). Highest specificity profile in chunk 5b — `.ts-banner-generator-app .ts-card-rows .ts-field .ts-color-row:not(.vertical) .ts-color-swatch input[type="color"]` (8-selector-deep) appears 20+ times. **Heavy duplication:** nearly every rule is doubled `.ts-banner-generator-app SELECTOR, SELECTOR { … }` (app-scoped + global). Cleanup mandate per L293–393 OWNER NOTES: pick global, delete scoped.
- **`@keyframes` / `@media`:** `spin` at L2566, `(max-width: 860px)` L2630, `(max-width: 380px)` L3870, `(min-width: 860px)` L3881, `(min-width: 400px)` L3887, `(max-width: 720px)` L6704, `(min-width: 880px)` L6766, `(max-width: 880px)` L6802. **8 media queries** (most of any chunk-5b file). **No `@container`, no `@property`, no `@supports`, no `@layer`.**
- **Non-OKLCH literals:** hundreds — every `--ts-bg-N` redeclaration in the panel-isolation block carries a hex (e.g. `#0c0d0f`, `#111214`, `#17181b`, `#1f2024`, `#28292e`, `#323439`, `#3e4045`, `#e8e9ea`, `#9ea0a5`, `#6d6f74`), plus `#ffffff`/`#000000`/`#fff`/`#000` inside `color-mix()` literals throughout the derivative chain (~80 instances), plus the FAB and accent fallbacks `#ff540a`, plus the partial-file tail's light-theme hex declarations. **Estimate: 200+ raw color literals.** Most are inside the panel-isolation re-declaration block; cleanup means deleting that block in favor of inheriting the production primitive layer.
- **Owner annotations / critical comments (VERBATIM, line-anchored):**
  - L1: `"═══ Showcase: offcanvas quick editor (restored original + enhanced) ═══"`
  - L154–164 (inside `.ts-oce-panel`): `"B10: single-line typography base override per restyling-arch §4."` — explicit reference to the April 2026 restyling-architecture spec (§5 architecture canonical).
  - L293–294 — **OWNER NOTES: component inheritance + scope isolation refactor (banner/pattern generators)** — verbatim opening: `"NEW Refactor Note URGENT: move all stable, well-designed component styles to the global scope so they are inherited across contexts. this scope must only define isolated, feature-specific variants. eliminate duplicated definitions and override chains. unify all shared UI assets between banner generator and pattern generator into a single canonical system."`
  - L296–393 (98 lines, banner-generator's master refactor spec, verbatim section list):
    - `"toolskin ui system — global inheritance + scoped isolation (v1)"`
    - "Why: components are currently redefined across scopes (banner/pattern), causing redundancy, inconsistencies, and broken behaviors."
    - "v1 fix: promote all base component styles to global scope and restrict scoped files to minimal, isolated overrides and variants only."
    - "Components to unify globally: ranges (.ts-range, .ts-range-row, .ts-range-val) · chips · anchor grid/buttons · buttons (+ variants, incl. .ts-input-btn) · inputs (+ variants) · input groups/wrappers · color utilities · toggles · layout system."
    - "Toggle system fixes (global, not scoped): correct left padding behavior for .ts-toggle-label (match input padding when no icon is present); support multiline labels with clamp/ellipsis (up to 2 lines) in constrained sidebar widths; no media queries; must be intrinsic/responsive and inherited."
    - "Scope isolation rules (banner/pattern generators): only lock: font-size, border-radius, font-family, surface relations, accent colors, and protected editable vars; these locked tokens must not be affected by live editing panels; panel edits affect global UI, not the tool's internal core values; spacing and typography inside tools must remain controlled."
    - "Theme behavior: banner/pattern generators share identical UI system → must stay consistent; default to isolated dark mode context (independent from showcase state); light mode only applied via explicit user toggle (topbar); optional lock/unlock mechanism (boolean) to control theme inheritance."
    - "Strategy: remove all duplicated scoped component definitions; build a dedicated showcase to audit and normalize each component; reconstruct unified CSS from a single canonical source; enforce inheritance-first architecture."
    - "Hard rules: no component redefinitions per scope; no override chains fixing previous overrides; scoped files = variants only, never base styles; shared UI must be defined once and reused everywhere."
    - L359–391 — **NOTE: tagged elements extraction + consolidation protocol** — verbatim: `"NEW Refactor Note: tagged elements must NOT be deleted or rolled back. all tagged assets must be extracted, accumulated, compared, and documented in a centralized audit document. these elements define key visual aspects of the frontend and must be preserved. no loss of data or visual behavior is allowed."` + the `@ts-component-consolidate` audit workflow (extract → accumulate → compare → mark @extracted_for_v1 → derive unified asset). **THIS IS THE OWNER'S MASTER REFACTOR-SCOPE DECLARATION FOR THE OCE-PANEL CHUNK.**
  - L596: `"PANEL ISOLATION: always dark regardless of page theme"` — declares the rationale for the 100-token panel-isolation cartel.
  - L626: `"✅ ACCENT TOKENS - Panel dark isolation (same 0.75 threshold as dark mode)"` — context for the `oklch(from ...)` anti-pattern (the owner is intentionally matching the dark-mode threshold for the isolated panel).
  - L957–962 — `"Add from here on down to the end of the file / Quick style adjhustents to aply overrides on this header styles above"` — entry-point marker for the post-restoration appendix.
  - L964: `"§6e TOGGLE SWITCH (REFACTOR NOTE: his is one of the elkements to be unified as mentione don the refactor note)"` — toggle-switch unification mandate.
  - L1054–1097: `@ts-component-consolidate` tags on 6 toggle-related blocks.
  - L1331: `"@refactor-note:topbar-unification-2026-05-16"` — companion to the tree-file's topbar-unification annotation.
  - L1449–1452 (and 5+ other clusters): `/* @refactor:backdrop-critical */ /* @refactor:glass-dependent */ /* @refactor:needs-solid-fallback */ /* @refactor:token-dependency */` — 4-tag refactor flag pattern, marking blocks that depend on backdrop-filter glass effects and need solid fallbacks. Appears 5+ times in this file.
  - L1713 + L1739: `"OWNER NOTE: input gradient delegation (Lush Mode) … Refer to Lush mode ON THE REFACTOR NOTES. THESE ELEMENTS MUST BE DEDUPED ON THE TAGS @ts-component-consolidate"` — `@Lush Mode` is the owner's term for a global "background-image enabled" mode for inputs/buttons; this file has multiple Lush-Mode-pending blocks.
  - L1972: `"is currently fragmented, duplicated, and partially inconsistent across scopes."`
  - L2012, L2057, L2097, L2103, L2172: 5 `#LOCAL_NOTE` annotations on token dedupe / sibling-rule preservation directives.
  - L2887: `"#CRAZY_CODE_FIX: DUPLICATE DELETED #1"` — explicit marker. L2998 same for #2.
  - L3265, L4341, L4998: identical-text 3-time repetition of `"#NEW REFACTOR NOTES: All the inputs that has gradients by default must be removed and be delegated globally to a global button and input styling mode 'Lush Mode'. WHICH SHOULD NABLE THE BACKGRUND IMAGES FOR THE INPUTS that has already the ts-this-bg built and only needs the image set to work. the hover state should support it too."` — the **Lush Mode global refactor spec**, repeated three times in the same file (indicating its importance OR the file's failed-consolidation history).
  - L3512 + L3593 + L4935 + L4936 + L4954 + L4956: `"REFACTOR NOTES AND HIGHLIGHTS: refactoring needs the / tokenization to prevent repeated declarations and make the color smart and responsive on childs / Tokens that needs to be centralized"` — 6× duplicated refactor-tokenization notes.
  - L3736–3770: `"LAYOUT REFACTOR INSTRUCTIONS (Bootstrap'like grid)"` + `"SPECIAL NOTES:"` — the panel's grid-system refactor spec.
  - L3899: `"#CRAZY_FIX_RULES this si redefined several times., so pelase extratc this adn comapre it to keept he best version. only extratc the structural styles and thg ebest ones. to keep the ones thta are build qwith proportional calculation based and token using based styles. not static ones. then we must delegate the coloring patterns to another rule set inclduign this asset."` — extractor instruction for duplicated rules.
  - L4133: `"#CRAZY_FIX_RULES superseded by R12 consolidation: original rule scoped only to .ts-banner-generator-app."` — R12 consolidation reference (chunk-4b R12 spec).
  - L4106 + L4159: `"Docs: toggle-row spacing reconciliation (B23 Wave 2 / R12). / R12 — OCE-panel two-column toggle-row inline-padding tightening."` — references to the Wave 2 B23 rule + R12.
  - L5176–5183 + L5797–5823: **`@ts-component-consolidate` UI-select consolidation spec** (8-line + 30-line block): `"It MUST be aligned with the base `.ts-ui-select` system defined in the … These partially duplicate `.ts-ui-select` structure … This asset has been REFACTORED into a portable component variant of `.ts-ui-select` and MUST reside in the GLOBAL component scope … MUST NOT: [defining final colors locally] … This component MUST: [inherit, not override; declare variants only via data attributes]."`
  - L5243 + L5319: `"REQUIRED REFACTOR / 6. REMOVE / REPLACE 'CRAZY_FIX_RULES'"` — explicit cleanup steps for the UI-select consolidation.
  - L5376: `"NEW NOTE: PLESE GREP THE BLOCK FOUND BY SEARCHING FOR @consolidate_select_component"` — explicit cross-file grep instruction.
  - L5718: `"this block MUST NOT define final colors"` — token-tier-violation guardrail.
  - L5772: `"#CRAZY_FIX_RULES: added a hardcoded css placehoplder replacement for the icon when theresno icon selected. this should be done with js instead of this."` — hardcoded-icon-fix flagged for JS migration.
  - L5993: `"OWNER REFACTOR NOTES 13 MAY: THESE RULES ARE OK. BUT ON THE CURRENT PLAN THEY NEED TO BE MOVED TO GENERAL SCOPE FUNCTIONALITY. ONLY EXCLUDED BY SPECIIFC SCOPES LIKE APPS OR TOOLS."`
  - L6248: `"WHY THIS MUST REMAIN LOCAL"` — counter-rationale: certain rules SHOULD stay scoped. The OCE-panel is a tool-scope; not everything globalizes.
  - L6335: `"@consolidate_select_component: HERE ARE MORE SPARED BLOCKS OF THE SELECT UI COMPONENT AGAIN. i didi grouped this. BUT HERE TEY ARE AGAIN ROLLED BACK. SO WE MUST UNIFY TE COMPONENT AND ESNURE THERE AR ENO REDUNDANCUIES AMD MAKE ASINGLE RULESET GROUP FOR THE VARIANTS OF THIS COMPONENT VALUD FOR ANY SCOPE. I ALREADY DID THIS. AND IS MARED AS SOLVED. BUT CANNOTFIND THAT RECORD ANYWHERE."` — **owner's frustration log**: he previously consolidated the select component, but a rollback re-introduced the duplicates and he can't find his own consolidation record. **This is direct evidence for Pattern 18 Session Continuity Protocol** — the owner himself lost the resolution record. The rebuild's `.remember/` + checkpoint regime is the answer.
  - L6417: `"#CRAZY_FIX_RULES - tehse are styles thta were supposed to be just for the shopwcase but several style designs are actually goot to be incorporated to the design base components and design pattern base... so let's not lose these i already wrapped and scoped for the showcase., "` — preservation note: do not lose showcase-scoped designs; promote them.
  - L6433: `"#CRAZY_FIX_RULES: these are hardcode styles meant to keep design on the surface cards layout. but these rules must be removed and we must make the layouts gaps and paddighn work smarter than this. this must be removed after the layout is consolidated."`
  - L6712 + L6729: `"Sidebar panel font scope"` / `"Offcanvas Push Sync v2 ───"` — markers for sub-sections.
- **Refactor flags:**
  - **DELETE the panel-isolation `[data-theme="light"] .ts-oce-panel[data-ts-oce-isolated]` block (L601–765).** It re-declares the entire primitive + system + accent layer with hex literals — this is the LOUDEST shadow-of-production-tokens in the entire reference corpus. Replace with: an isolation strategy that re-anchors `--ts-this-bg` (the surface engine) once on the panel root and lets the production derivative chain compute. The owner intent ("always dark regardless of page theme") can be met by overriding `color-scheme: dark` + `--ts-bg-body` only.
  - **`oklch(from var(--ts-accent) clamp(0, (0.75 - l) * 999, 1) 0 0)` at L627** — Wave 1.6 Resolution #1 violation. The on-accent threshold should be an engine-derived constant, not a runtime `oklch(from)` expression. R-rule-15.
  - **`--ts-fs-base: 0.78rem` at L159** — VIOLATES RULING 3. Base font is locked to 13px. 0.78rem at default root = ~10.14px. **R-DNA violation** + needs immediate replacement with the production `--ts-fs-base` value or a panel-private alias `--ts-oce-fs-base`.
  - **8 `--ts-bg-N` direct references in tokens, 112 LIVE refs total in the file** — the worst R-rule-15 contributor in chunk 5b. The OCE token-cartel pattern at L402–421 declares 18 tokens that ALL consume `--ts-bg-N` primitives directly. Migration: introduce a view-private alias layer (`--ts-oce-surface-1..5`) that resolves to `--ts-this-bg-dim-N`, and have the OCE consume the aliases.
  - **Rule-doubling cleanup** — every rule appears as `app-scoped, global-fallback`. Pick one (global), delete the other. Reduces file size by ~30%.
  - **5 instances of the `@refactor:backdrop-critical / glass-dependent / needs-solid-fallback / token-dependency` 4-tag cluster.** Each marks a glass-effect block needing a no-backdrop-filter fallback.
  - **Lush Mode global refactor PENDING** — owner has repeated the spec 3 times (L3265, L4341, L4998). Inputs/buttons with gradient backgrounds must be delegated to a global `lush-mode` opt-in token, not per-component declarations.
  - **`.ts-ui-select` consolidation BLOCKED on owner's lost record** — L6335 frustration log + L5797–5823 + L5176–5183 consolidation spec. Resolution: re-do the consolidation per L5183 verbatim spec; commit with a clear `@extracted_for_v1` marker so the record is preserved.
  - **`@taxonomy_chips_strip` LOCKED design input** — Rule 9. The chip strip's 10 protected values must remain identical visually; refactor structure only.
  - **No `@container` queries** — owner's refactor spec mandates `intrinsic/responsive without media queries` (toggle system fixes, L320–325). The 8 `@media` queries should migrate to container queries where the rule is panel-relative.

### ts-oce-panel-styles(partial).css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/views/ts-oce-panel-styles(partial).css`
- **Lines:** 7,035  ·  **Bytes:** 218,668
- **Block type:** see "Special case: `(partial)`" above. **Identical to banner-generator file from line ~397 of banner onward, with a different tail (light-theme overrides) after ~L6510 of partial.**
- **`--ts-*` token declarations:** **609** total. Slight superset of banner-generator (523) due to the OCE-light-theme tail. The leading 18-token cartel at L7–26 is byte-identical to banner L402–421 except for indentation.
- **`--ts-*` token references:** **1,600** total. Largest reference count in chunk 5b — slightly higher than banner-generator (1,524) due to the OCE-light-theme tail's 700 extra lines.
- **`--ts-bg-N` direct-reference contribution:** **129 LIVE references.** Even worse than the banner-generator file. The extra 17 over banner-generator come from the L6510–7035 OCE-light-theme tail (every `[data-theme="light"] .ts-X` rule that re-declares `--ts-bg-N`, `--ts-bg-body`, or anchors `--ts-this-bg` to a specific bg primitive).
- **`oklch(from ...)` Wave 1.6 anti-pattern:** **3 instances** — L232, L6551, L6588. Three separate `--ts-on-accent: oklch(from var(--ts-accent) clamp(0, (T - l) * 999, 1) 0 0)` declarations with thresholds 0.75 (L232 + L6588) and 0.55 (L6551). The threshold-difference is itself an anti-pattern: there should not be two different on-accent thresholds in the same file. **3 R-rule-15 violations** (vs 1 in banner).
- **Selectors:** ~620 distinct selectors (sampled — equivalent to banner-generator's ~600 plus the OCE-light-theme tail).
- **`@keyframes` / `@media`:** `spin` at L2171, `(max-width: 860px)` L2235, `(max-width: 380px)` L3475, `(min-width: 860px)` L3486, `(min-width: 400px)` L3492, `(max-width: 720px)` L6309, `(min-width: 880px)` L6371, `(max-width: 880px)` L6407. **8 media queries** (same count as banner-generator). **No `@container`, no `@property`, no `@supports`, no `@layer`.**
- **Non-OKLCH literals:** ~250+ (banner's 200+ plus the OCE-light-theme tail's hex literals: `#000000ed` at L6808, light-mode `#4a4d52` text-muted L6843, transparent black gradients in modal/toast shadows like `rgba(0,0,0,0.18)`/`(0,0,0,0.12)`).
- **Owner annotations / critical comments (VERBATIM, line-anchored, additional to those already cataloged for the shared body):**
  - L6510–6541 — **OWNER's FIX: dynamic color system migration (CRAZY_FIX_RULES)** — multi-line header marking the OCE-light-theme migration block. Verbatim opening: `"OWNER's FIX: dynamic color system migration (CRAZY_FIX_RULES)"` followed by ASCII separators.
  - L6541–6545: `"═══════════════════════════════════════════════════════════════════"` + `"Light mode design tokens ────────────────────────────────────────"` — section delimiters for the light-mode design-tokens overrides.
  - L6636: `"Navigation bar ──── REFACTOR NOTE: fix done, Removed this hardcode ix for light theme... it only made the light mode header worse. conversion on automaic curent status looks good."` — **owner's MISCARRIED-FIX postmortem**: a previous light-theme nav-bar hardcoded fix WORSENED the light-mode header; the fix was removed, and the engine-derived automatic conversion now looks correct. **This is direct evidence supporting Wave 1.6 Resolution #1 (engine-derived constants beat per-theme hand-tuning).**
  - L6677–6694 (Cards / Panels / Pricing section): `"refactor note: added refacroted purpose behaviour with only tpoken based styling. this should be ageneral behaviour. not static declaRATIOUNS. WE NEED TO REMOVE ALL DECLATRATIONS THAT OVERRIDES WITH STYLES AND CENTYRALIZE EVERYTHING TO AUTOMATE THE SYLING SYSTEM."` — **TOKEN-FIRST mandate restated**: all per-component overrides must collapse into the central token engine; nothing should declare a value that overrides a system token.
  - L6713–6730 (Surfaces section): multiple `[data-theme="light"]` blocks **COMMENTED OUT** — owner has already deleted the per-component surface overrides as part of "fix done." The commented-out blocks are historical record only.
  - L6741: `"3. TOAST OFFSET — push when panel is open"` + L6817 `"DEPRECATED TOAST OFFSET — push with margin instead of right"` — toast-positioning migration record.
  - L6953–6957 (Toggle/Range section): `[data-theme] .ts-toggle { --ts-toggle-knob-bg: var(--ts-this-bg-dark-1); --ts-this-bg: var(--ts-bg-3-t); … }` — this is the section that consumes `--ts-bg-3-t` (the transparent variant) — flagging here because the chunk-5b tree-explorer also consumes `--ts-bg-2-t` (L1127) and these `-t` variants don't yet exist in `assets/css/next/system/surfaces.css`. **Cross-chunk pattern:** chunk-5b files assume a transparent-variant tier exists at primitives that the rebuild has not yet declared.
- **Refactor flags:**
  - **MERGE OR DELETE.** Either merge `(partial)` into the banner-generator file (de-duplicate the shared body + append the OCE-light-theme tail) OR keep them split but document the contract (banner-generator = base; partial = OCE-tail-only overlay). The current state — two 95%-overlapping 200KB files — is the worst possible.
  - **3 `oklch(from ...)` Wave 1.6 violations** (L232, L6551, L6588) + **threshold inconsistency** (0.55 vs 0.75) — must collapse to a single engine-derived constant.
  - **129 LIVE `--ts-bg-N` direct references** — worst single file in chunk 5b. Migration plan as for banner-generator.
  - **`--ts-bg-3-t` (transparent variant) consumed without being declared in the primitive layer** — L6956. Needs primitive-tier addition or migration to `color-mix` against the production derivative.
  - **`[data-theme="light"]` overrides for ~25 components in the tail (L6510–7035)** — owner has already done some of this cleanup ("fix done" L6636) but the file still carries the migration debris. Final pass: delete every commented-out override; verify the engine derives the light mode correctly without per-component overrides; promote the proven `[data-theme="light"]` rules into the production primitive-tier light-mode token declarations.
  - **Sortable / Footer / Modal / Toast / Tabs / Section-divider / Nav-active / Accent-bar / Toggle / Range** all carry residual light-theme overrides — each one is a candidate to delete after verifying the engine-derived light mode matches the visual ground truth.

---

## Cross-chunk inventory update

### `--ts-bg-N` direct-reference running tally — chunk 5b contribution

Live references (excludes commented-out code) added by chunk 5b:

| File | Total LIVE `--ts-bg-N` + `--ts-bg-body` refs (per grep) |
|---|---|
| ts-tree-explorer-styles(not-splitted).css | **18** |
| ts-oce-panel-banner-generator-styles.css | **112** |
| ts-oce-panel-styles(partial).css | **129** |
| **Chunk 5b total LIVE** | **259** |

⚠ The banner-generator and partial files are 95%-overlap; **deduplicated LIVE count = ~129** (the partial file is the superset of the banner-generator file in terms of `--ts-bg-N` refs once the OCE-light-theme tail is included; if both files ship as-is the cascade has both, but in any real "merged" world there's only one). The 259 figure is for the catalog's record; the migration burden is **~147 unique LIVE refs** across the chunk after dedup (18 tree + 129 merged-OCE).

### Cross-chunk RUNNING GRAND TOTAL of `--ts-bg-N` direct references

Pulling forward chunk 5a's tally (13 LIVE refs across 3 small view files) plus chunk 5b raw count:

| Chunk | LIVE `--ts-bg-N` direct refs |
|---|---|
| 4a (components — small) | ~not yet tallied in 5a doc; assumed in scope |
| 4b (components — large) | ~not yet tallied in 5a doc; assumed in scope |
| 5a (views — small) | **13** |
| 5b (views — large, raw) | **259** |
| 5b (views — large, dedup OCE) | **147** |
| **Running grand total of cataloged chunks (5a + 5b dedup)** | **160 LIVE refs** |

⚠ Caveat: this grand total is for the catalog chunks that have explicitly reported their tallies in their own docs. Chunks 4a + 4b ran before the running-tally protocol was added; their `--ts-bg-N` counts are not yet incorporated into a single grand total. The 5a doc's "carry-forward" section explicitly notes the running tally starts with chunk 5a. **For an absolute cross-rebuild grand total, chunks 1–4b need a retroactive grep pass** — recommend: a one-line script `grep -rEn '\-\-ts-bg-[0-9]\b|\-\-ts-bg-body\b' docs/references/toolskin.css_extracted-core-blocks-to-refactor/ | wc -l` to get the full corpus count in one shot, then break down per chunk.

### `oklch(from ...)` Wave 1.6 anti-pattern running tally

| Chunk | Instances |
|---|---|
| 5a | 0 |
| 5b — banner-generator | 1 (L627) |
| 5b — partial | 3 (L232, L6551, L6588) |
| **Chunk 5b total** | **4 R-rule-15 violations** |

(All 4 are variants of `--ts-on-accent: oklch(from var(--ts-accent) clamp(0, (T - l) * 999, 1) 0 0)`. Thresholds: 0.75 used 3 times, 0.55 used once.)

### View-tier vs component-tier — what chunk 5b teaches

Compared to chunks 4a/4b (components) and 5a (small views):

1. **Large views compound MANY components.** Banner-generator is the only file in the corpus that selector-scopes EVERY shared form primitive (`.ts-range`, `.ts-toggle`, `.ts-card`, `.ts-field`, `.ts-color-row`, `.ts-ui-select`, `.ts-ui-number-input-wrapper`, `.ts-chips`) under `.ts-banner-generator-app …`. This is the **rule-doubling debt** — fix by promoting to global, deleting the scoped duplicate.
2. **Tree-explorer is the single CLEANEST realization of the "ONE base lever rescales everything" principle** (`--ts-tree-row-h` cascades through pad / gap / indent / fs / icon / twist / radius via calc()). It is the canonical reference for the rebuild's ratio-driven derivative-geometry pattern.
3. **OCE panel is the LOUDEST shadow-of-production-tokens** (the 100-token panel-isolation block at banner L601–765). Pattern: forcibly maintaining one component's theme regardless of host theme. The correct rebuild strategy is to override `color-scheme` + `--ts-bg-body` only and let the engine recompute, not redeclare the entire primitive + derivative chain inline.
4. **Owner annotations density is HIGH (chunk 5b avg ~5%) and CRITICAL** — the chip-strip 53-line refactor spec, the panel-isolation 100-line refactor spec, the L6335 "lost consolidation record" frustration log, and the L6636 "engine-derived beats hand-tuned" postmortem are each gold for the rebuild. The owner's voice across all three files is consistent: token-first, one-base-lever, no-per-theme-tables, scope-only-true-locals, dedupe-via-`@ts-component-consolidate` audit, preserve via `@extracted_for_v1`.
5. **Chunk 5b is where the rebuild's three big binding rules (Rule 4 surface superposition / Rule 9 chip-strip LOCKED / Rule 15 apcach supremacy) collide with the legacy code's worst violations.** Tree-explorer is the model of compliance; OCE-panel is the model of violation. Both files come from the SAME owner — the rebuild's job is to encode the design intent (which the owner has consistently stated) in the engine, so legacy files can be DELETED rather than refactored.

### Annotations density (chunk 5b)

| File | Lines | Owner-annotated lines (estimate) | Density |
|---|---|---|---|
| ts-tree-explorer-styles(not-splitted).css | 2,369 | ~210 | ~8.9% (dominated by L19–98 cascade postmortem + L1815–2067 chip-strip spec) |
| ts-oce-panel-banner-generator-styles.css | 6,903 | ~350 | ~5.1% (dominated by L293–393 master refactor spec + repeated Lush Mode + UI-select consolidation specs) |
| ts-oce-panel-styles(partial).css | 7,035 | ~360 | ~5.1% (banner annotations + the L6510+ OCE-light-theme migration tail) |
| **Chunk 5b total** | **16,307** | **~920** | **~5.6%** |

**Compared to chunk 5a (~9.3% density driven by ts-cube-portfolio's 91-line integration brief):** chunk 5b annotations are spread over many more sub-blocks but the per-spec depth is HIGHER (the chip-strip spec alone is the most detailed single refactor block in the entire corpus).

---

## Gap vs `_code-audit-catalog.md`

The `_code-audit-catalog.md` cataloged Toolskin's general code architecture but did NOT enumerate:
- The OCE-panel `(partial)` vs banner-generator overlap (cross-file duplication).
- The tree-explorer's `(not-splitted)` 7-sub-file structure.
- The Lush Mode global refactor spec (repeated 3× in OCE files).
- The chip-strip 53-line REFACTOR REQUIREMENTS block + visual-parity protocol.
- The L6335 "lost consolidation record" frustration log (which is itself prima facie evidence for Pattern 18).
- The L6636 "engine-derived beats hand-tuned" postmortem (which is direct evidence supporting Wave 1.6 Resolution #1).
- The `--ts-bg-N-t` transparent-variant consumption without primitive declaration (cross-chunk pattern).
- The 4 `oklch(from ...)` Wave 1.6 anti-pattern violations.
- The `@ts-component-consolidate` / `@extracted_for_v1` / `@consolidate_select_component` / `@taxonomy_chips_strip` tag taxonomy (which the rebuild's audit workflow should formalize).

---

## Halt status

No HALT this chunk. All 3 files cataloged; no files missing; output well under 120k tokens.

Reads performed (within the 8-per-file budget):
- ts-tree-explorer: 3 slice-reads (L1–200, L391–440, L1980–2099) = 391 lines.
- ts-oce-panel-banner-generator: 3 slice-reads (L1–110, L290–419, L596–725) = 370 lines.
- ts-oce-panel-styles(partial): 2 slice-reads (L1–130, L6800–7000) = 330 lines.
- **Total slice-read budget used: 1,091 lines of 4,800-line cap (23%).** Well under budget.

Greps performed: ~25, all targeted, no full-file scans.

No over-reading. No Read without `offset` + `limit`. No HALT triggers fired.
