# Pending Modular Integration — Showcase Tremap

**Created:** 2026-05-10
**Owner principle:** Every craft is a module or variant. Nothing is a 
new build. If a view is a new craft layout, then it's not working. The 
HTMLs are only frames for the modular base logic of the system.

## Purpose

Track loose HTMLs and CSS modules that exist in the production tree but 
are NOT yet conformant to the modular-assembly principle. Each entry 
must eventually decompose into existing tokens + components, OR the 
components must be promoted into Toolskin core.

## Entries

### Pages — pending modular decomposition

| File | Status | What it currently does | What's needed |
|---|---|---|---|
| `cube-portfolio.html` | LOOSE — STANDALONE | Portfolio prototype with 3D cube gallery, ruler design, swipe/wipe nav, sidebar menu | Componentize per integration plan documented in `assets/css/ts-cube-portfolio.css` and `assets/js/ts-cube-portfolio.js` headers. Includes: rulers (mostly JS, minimal CSS), background big-letter design (variant), swipe/wipe nav (economized), **sidebar (NAMING CONFLICT — `.ts-sidebar` already exists in core, must be REPLACED not re-scoped, across JS+HTML+CSS)**, heavy filtering before merge. Must NOT ship with own dedicated CSS sheet. |
| `ts-phantom-portfolio.html` | LOOSE | Alternative portfolio prototype | Decompose into existing `.ts-section`, `.ts-card`, grid utilities. Promote any unique components into core. |
| `mockup/fuckedup.html` | STAGING — DO NOT COMMIT | Mockup staging file | Pending boxed-layout refactor per blueprint at `docs/mockup-page_layout-blueprint-design/`. Gitignored. |
| `mockup/not-fuckedup.html` | STAGING — DO NOT COMMIT | Mockup staging file | Same blueprint applies. Gitignored. |
| `toolskin-pitchdeck-v2-refactored.html` | CANONICAL — pending nested folder home | Tokenized pitch deck, manually repaired by owner. Self-contained. Links to `toolskin-pitchdeck_recovered-ASSHOLE_2.css` (local) and to `https://satsea.io/toolskin-showcase/assets/js/*` (web-hosted runtime). | Find proper nested folder (possibly under `branding/` or new `decks/`). Integrate into showcase v2 navigation tremap. |
| `surface-lab.html` | PRODUCTION — pending split | Surface preset lab | Per session-recap: showcase HTML split — Surface Preset Lab and masonry examples should move to `toolskin-lab.html` in a future pass. Currently lives at root. |
| `ts-folded-tab-experiment` (sandboxed) | EXPERIMENTAL | Inverted-corner folded tab demo using anchor-positioning + corner-shape: scoop. Verbose ad-hoc tokens. | Cross-browser audit. Retokenize using `--ts-` prefix. Reduce verbosity. Avoid token conflicts. Expose simplified parameters: surface tokens, layout controls, corner-shape adjustables. Stabilize fragility (CSS currently breaks on minor edits). |

### CSS modules — pending integration into toolskin.css

| File | Status | What it does | Integration target |
|---|---|---|---|
| `assets/css/ts-gallery.css` | SANDBOXED — already integrated in core | Standalone version no longer needed at runtime | Reference / recovery archive only. Component lives in `toolskin.css`. The `ts-gallery-demo.html` does not link this file. |
| `assets/css/ts-cube-portfolio.css` | EXTRACTION FILE — pending integration | Cube portfolio styles awaiting filter/tokenize/fold into core. Per-element plan in file header. | See cube-portfolio.html row above. |
| `assets/js/ts-cube-portfolio.js` | EXTRACTION FILE — pending integration | Cube portfolio runtime | Split per the integration plan in file header. Hooks (sidebar menu, 3D cube gallery) become reusable Toolskin components, data-fed from other elements. |
| `assets/css/masonry-extracted-styles-cleanup.css` | NEW | Masonry refinements | Verify all rules use existing tokens; merge into core or keep as supplement. |

### JS modules — pending integration

| File | Status | What it does | Integration target |
|---|---|---|---|
| `assets/js/ts-gallery.js` | NEW | Gallery runtime | Verify hooks to existing Toolskin namespace; eventually merge into `toolskin-uikit.js`. |

### Pitch deck system — pending consolidation

The pitch deck has been manually repaired by the owner. Currently:

- **Canonical:** `toolskin-pitchdeck-v2-refactored.html` (in repo root)
- **Stylesheet:** `toolskin-pitchdeck_recovered-ASSHOLE_2.css` (in repo root)
- **JS runtime:** loaded from `https://satsea.io/toolskin-showcase/assets/js/*`
  (web-hosted, depends on FTP commits of canonical CSS to server)
- **Documentation:** `PITCH-DECK-COMPONENT-PATTERNS.md`,
  `PITCH-DECK-IMPROVEMENTS-LOG.md` (repo root)

**Component patterns marked Priority 1: Ready for Core** in
`PITCH-DECK-COMPONENT-PATTERNS.md`:

1. `.ts-badge` component (verify if already exists in main system; if 
   not, the pattern is ready for core integration)
2. `.ts-deck-card` modifiers pattern (`--accent`, `--featured`, 
   `--danger`)
3. Component-specific typography scaling pattern (uses base tokens as 
   foundation, adds semantic overrides)

**Priority 2: UIKit Extensions:**
- `.ts-timeline` component
- `.ts-roadmap` component (or as `.ts-timeline--roadmap` variant)
- Progress bar gradient pattern

The pitch deck is NOT a loose project. It is pending integration and 
needs:
1. A proper nested folder home that fits its category
2. Promotion of Priority 1 components into `toolskin.css` proper
3. Decision on Priority 2 components (UIKit additions)

### Branding folder — production-canonical, pending v2 navigation tremap

`branding/` is the canonical path for self-referenced brand assets:
logos, identity, anything Toolskin-self-referenced. Per owner direction,
this stays as the dedicated branding folder.

Future v2 navigation tremap:
- Source logos and identity assets from `branding/` only
- DO NOT pull from `assets/img/toolskin-*` (legacy mirror copies; 
  eventually consolidate into `branding/`)

### Bucket A debugger non-swappable widget sheet — pending architecture

Original recovery scope from earlier session: the debugger widget's 
CSS rules currently live in the same stylesheet that the widget swaps 
in/out (`toolskin.css`). This means during stylesheet swap, the widget's 
own styles disappear briefly.

**Architectural fix needed:**
- Move `#ts-debug-root` ID-scoped rules to a non-swappable location 
  (either `toolskin-uikit.css` or JS-injected `<style>` block)
- Replicate the tokens consumed by the widget at `#ts-debug-root` 
  scope (so they don't depend on `:root` inheritance from the swapped 
  toolskin.css)
- Keep the `@property` declarations duplicated in both files (browsers 
  handle duplicate `@property` registrations gracefully)
- Generic `.ts-panel`/`.ts-ui-panel` base rules remain in `toolskin.css`

This is currently working because the widget reloads after CSS swap, 
but is architecturally fragile. Pending Phase 1 work.

### Surface Superposition — global migration

The banner component in `toolskin.css` is the canonical implementation 
of the Surface Superposition pattern (three-tier token chain: 
`--ts-this-bg-surface` → `--ts-this-bg` → `background:`, with 
auto-inversion via `--ts-this-bg-inverse`). All other container 
components should eventually migrate to this pattern.

Estimated: 4-8 hours owner-supervised work. Eliminates the recurring 
"every element needs a `background` declaration AND the token" pattern.

### Toolskin-executor skill — sellable artifact

Per `docs/handoffs/toolskin-skills-audit-2026-05-09.md`, the highest-
leverage future deliverable is a custom `toolskin-executor` skill 
that teaches AI agents how to use the Toolskin design system without 
breaking it. Approximately 6-8 hours focused work. Foundation of the 
sellable Toolskin product (ships with the design system to other 
developers).

## Architectural commitment

When ANY new HTML view is added to this repo, before commit, verify:

1. The view is composed of existing `.ts-*` components — no inline 
   custom layouts.
2. All colors, spacing, typography come from `--ts-*` tokens.
3. Any new pattern is promoted to `toolskin.css` as a reusable 
   component BEFORE being used in the view.
4. If the view requires something that doesn't exist yet, the missing 
   component is built FIRST in core with tokens — then the view 
   assembles it.

If a view violates this, it goes here as a tracking entry until 
decomposed.

## Maintenance

Update this document at the start of every session that touches HTML 
showcase pages. Resolve entries by either:
- Decomposing into existing modules (preferred)
- Promoting needed components into core
- Sandboxing if no longer relevant

Empty list = clean modular conformance.
