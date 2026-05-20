# Toolskin Tree Component — Iteration Report
*Generated 2026-05-16. Forward-ready summary of every issue raised, every fix landed, and every open follow-up across the multi-iteration build of the `ToolskinTree` component.*

---

## 1. What the component is

A token-driven, data-driven tree view shipped as part of the Toolskin design system.

- **Public API (`ToolskinTree.init({...})`)** — caller authors one placeholder `<div>` plus an init call; the component builds the entire DOM.
- **Source of truth (CSS)** — `assets/css/toolskin.css` tail; all `.ts-tree*` rules live there. Tokens follow Toolskin's `--ts-*` namespace and `--ts-this-bg` derivative system.
- **Source of truth (Python generator)** — `build_tree_full_html-interactive.py`. Walks the filesystem, writes three artifacts:
  - `tree-explorer.html` (HTML shell + inline JSON for `file://` portability)
  - `tree-explorer.data.json` (separate JSON, available for fetch fallback or tooling)
  - `tree-explorer.dedup.json` (second-pass content-hash dedup report for an AI agent)
- **Test mock preserved** — `DRIVE_EXPLORER.html` is the user's hand-edited test artifact; the generator does NOT touch it.

---

## 2. Architecture decisions worth carrying forward

| Decision | Why |
|---|---|
| `assets/css/toolskin.css` is the single canonical CSS source | User migrates inline `<style>` from the generated HTML into the tail of `toolskin.css` between iterations. The Python's inline `<style>` should stay MINIMAL (preloader hide + baseline + iteration-specific extensions only). |
| `data-icon` attribute injection over inline `<i>` | Matches Toolskin convention. Used on buttons, brand mark, search icon, empty state. Inner `<i>` is kept on dynamic JS-built icons for instant paint without waiting for runtime hydration. |
| Data embedded as `<script type="application/json">` + fetch fallback | Inline data makes the HTML work in `file://` without a server; fetch fallback lets the user opt into a leaner HTML by emptying the inline tag. Loader is gated on `DOMContentLoaded` so the inline tag is parsed before query. |
| `.ts-chip` / `.ts-chips` design-system components | Replaced bespoke `.ts-tree-explorer__taxonomy` / `__chip` / `__chip-count`. Active state uses Toolskin's built-in `[aria-selected="true"]` variant; no custom `.is-active` rules. |
| Action-bar layout safety | Taxonomy chip strip is `flex: 1 1 0 / min-width: 0 / overflow-x: auto`. Title and actions are `flex: 0 0 auto`. The strip horizontally scrolls inside its bounded slot rather than pushing siblings out. |
| `tree--scroll` (default) and `tree--static` (legacy) height variants | `tree--scroll` is a CSS grid with internal scroll on the body cell so the topnav and action-bar stay pinned at the top of the explorer's viewport-bounded box. `tree--static` is the old "page scrolls naturally" mode for embeds. |
| Topnav `flex-wrap: nowrap` | The header MUST be a single non-wrapping row; horizontal overflow is acceptable, wrapping is not. |
| Search uses `clamp(12rem, 22vw, 18rem)` width via context selector | No bespoke wrapper class — Toolskin's `.ts-input-group` is the wrapper; the width rule is `#ts-topnav .ts-input-group { width: clamp(...) }`. |
| Folder-open swap is JS-driven | When a folder is `aria-expanded="true"`, JS swaps the `<i class="fa-solid fa-folder">` to `<i class="fa-regular fa-folder-open">` (the exact outline variant the spec calls for). No CSS `content` overrides. |
| Folder icons depth-aware via cascade variable | `--ts-tree-folder-color` defaults to accent at the root, descends to `--ts-text-secondary` at depth ≥ 3 via `.ts-tree__children .ts-tree__children .ts-tree__children { ... }`. Hover/selected/expanded states lift back to accent. |
| Unified filter pipeline (`_applyFilters`) | One walk applies BOTH search and taxonomy. Filters compose — "CSS + 'token'" returns only CSS files matching `token`. |

---

## 3. Issues encountered and how they were fixed

### Iteration 1–3 (initial build)

| Issue | Fix |
|---|---|
| Generator embedded data inline (2 MB HTML) | Iter 5: split into `tree-explorer.html` + `tree-explorer.data.json`; HTML fetches at runtime. Later (iter 7) embedded back inline AS WELL with a `<script type="application/json">` tag so it works in `file://`. |
| Header forced uppercase on the file path | Replaced `.ts-topbar__logo` (Toolskin rule forces `text-transform: uppercase !important`) with the explorer's own `.ts-tree-explorer__brand` markup, kept inside `<header class="ts-nav-fixed ts-topbar">` for sticky/glass styling. |
| Folder/file icons used accent everywhere | Made files use `--ts-text-secondary`. Made folders use a cascading variable so deeply-nested folders dim to secondary unless interacted. |
| Hover/selected backgrounds too vivid | Dialed down: hover is `bg-2` at 35% opacity, selected is accent at 9%. |
| Border-radius on left edge of row clipped the selected accent bar | Changed to `border-radius: 0 r r 0` so only right corners are rounded; the inset left bar reads as a flush stripe. |
| Twin counter badges cramped | Bumped to `padding: 0.42em 0.65em`, `line-height: 1.15`. |
| File icons looked heavier than the solid folder glyph | Added `--ts-tree-icon-scale-file: 0.82` applied to `.ts-tree__node--file > .ts-tree__row > .ts-tree__icon`. |
| Light-mode labels barely visible | Removed the `opacity: var(--ts-tree-label-rest-op)` dim — opacity dims compound poorly against light-mode secondary text. Direct color via `--ts-tree-label` instead. |
| File link hover hijacked link color | Killed `.ts-tree__row:hover a.ts-tree__label { color: var(--ts-accent) }`. File labels stay on the row's color in all states. |

### Iteration 4 (post-cleanup)

| Issue | Fix |
|---|---|
| `flex: 1 1 auto` made the search input look full-width | Switched to `width: clamp(12rem, 22vw, 18rem)` with `flex: 0 0 auto`. |
| Bespoke `.ts-tree-explorer__search-group` wrapper class added no design value | Dropped the class; applied the width via context selector `#ts-topnav .ts-input-group`. Saved as a memory: don't invent BEM classes when the design system already covers the structure. |
| Bullets in the intro section barely visible | Switched `<ul class="ts-tree-explorer__intro-bullets">` to `<ul class="ts-list">` (Toolskin's list component) — gives amber chevron markers for free. |
| Topnav id renamed mid-iteration | User changed `#ts-tree-explorer-nav` → `#ts-topnav` so JS could target it consistently. Updated all CSS selectors to match. |
| Segmented dual-button control (Expand/Collapse) | Implemented as `.ts-btn-group` with shared seam (`margin-left: -1px`), outer-corners-only radius, mutually exclusive active state. When active: both `.is-active` AND `.ts-btn--primary` classes are added atomically; inactive button has both removed (default style). |
| `.ts-btn-text` wrapper convention | Any button text now lives inside `<span class="ts-btn-text">` so icon-only / text-only / mixed-content patterns share one shape. On `.ts-btn--icon` the wrapper is visually hidden but kept for screen readers. |

### Iteration 5 (preview sidebar + tooling)

| Issue | Fix |
|---|---|
| Preview sidebar requested at the same DOM level as `<main>` | Explorer is now a CSS grid: `<main>` and `<aside class="ts-tree-explorer__preview">` are siblings; footer spans both. Toggle via `data-preview-visible="true|false"`. |
| Preview iframe should handle images, text, html, pdf, fall back for binaries | `PREVIEW_KIND` map covers 30+ extensions across 4 kinds. Fallback panel shown for anything else. Iframe is `sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"`. |
| Three-dot row actions menu | `#ts-action-more` opens a positioned popover. Seven actions: open externally, preview, copy path, copy file URL, copy as Markdown link, copy as `<a>` HTML, reveal in tree. Right-click on a row also opens the popover at the pointer. |
| Multi-format export | `#ts-action-export` opens an export popover. Five formats: JSON, CSV, Markdown, static no-JS HTML, **PDF** (opens static HTML in new window + triggers `print()` so the user saves through the OS dialog). Static HTML has a `@media print { background: #fff; color: #000 }` rule so the printed page is readable regardless of theme. |
| Filesystem dedup (open question from brief) | Second Python pass: groups files by `(size, lowercased name)`, SHA-1s candidates, emits `tree-explorer.dedup.json` with `summary` block + `groups[]`. Sorted by wasted space desc. On this repo: 375 groups, 1146 redundant files, 298 MB wasted, top group is a 12 MB screenshot duplicated 5× across `.claude/worktrees/*`. |
| Standalone reuse documentation | Subagent delivered `docs/toolskin-tree-standalone-uses.md` — five runnable use cases (file explorer, table of contents, sitemap, settings outline, JSON viewer), density variants, theming notes, accessibility checklist. |

### Iteration 6–7 (refactor to design-system primitives)

| Issue | Fix |
|---|---|
| Custom `.ts-tree-explorer__taxonomy` / `__chip` / `__chip-count` classes when Toolskin already has chips | Refactored: container is `<div class="ts-chips">`, items are `<button class="ts-chip" aria-selected="…">`. Active state is the built-in Toolskin `[aria-selected="true"]` variant; no custom `.is-active` rule. Count is `<small>` — no bespoke `__count` class. |
| "Failed to load tree-explorer.data.json (Failed to fetch)" in `file://` context | Embedded the data inline as `<script type="application/json" id="ts-tree-data">…</script>`. JS reads inline first; falls back to `fetch('./tree-explorer.data.json')`. Boot logic gated on `DOMContentLoaded` so the inline script is parsed before the query. |
| Patcher introduced duplicate `ToolskinTree.init({` line (syntax error) | Removed the dup line. Lesson: patcher replacement strings need to match the EXACT bounds of the old block. |

### Iteration 8 (harden filters — this turn)

| Issue | Fix |
|---|---|
| Search and taxonomy filters clobbered each other's `[hidden]` bookkeeping | Unified `_applyFilters()` runs both predicates in one walk. State stored on the instance (`_activeQuery`, `_activeTaxonomy`). `search()` and `filterByTaxonomy()` become thin wrappers that update state and call `_applyFilters()`. |
| Clearing search wiped an active taxonomy filter | Now: clear search → `_activeQuery = ''` → `_applyFilters()` re-renders with taxonomy still applied. |
| Reveal-in-tree from flat mode showed nothing (folder rows are `display: none` in flat mode) | Reveal action now: resets `_activeTaxonomy` to "All", clears the search input, calls `_applyFilters()` (which removes `.ts-tree--flat`), then expands ancestors and scrolls. |
| Empty state was inconsistent across filter paths | Single source: `emptyEl.hidden = !anyFilterActive || anyMatch`. Empty state shows only when an active filter has zero hits. |
| `\* Light mode...` malformed CSS comment in `toolskin.css` (parser bug) | User cleaned up; verified no remaining `^\s*\\\*` instances in the file. |

---

## 4. Verified composability matrix

| Taxonomy | Search | Visible files (this repo) | Mode |
|---|---|---|---|
| All | — | 2012 | tree |
| CSS | — | 167 | flat |
| CSS | "token" | 1 | flat (composed) |
| CSS | cleared | 167 | flat (taxonomy preserved) |
| All | "claude" | 6 | tree |
| All | cleared | 2012 | tree (baseline) |

---

## 5. Memories and conventions saved to user-memory

- `feedback_tree_explorer_workflow.md` — user cleans the generated HTML and migrates inline CSS into `toolskin.css` tail; subsequent iterations must SYNC the generator to the user's state, not regenerate fresh.
- `feedback_design_system_first.md` — only invent a `.ts-{component}__{part}` BEM class when the design system has no inheritable answer; tweak existing components via context selectors.
- `satsea_deployment_workflow.md` — `satsea.io/toolskin-showcase` mirrors the local repo assets; the user manually deploys CSS/JS changes on request.
- `canonical_css_file.md` — `assets/css/toolskin.css` is the canonical CSS file (not the `toolskin-merged-*` variants).
- `critical_failure_2026-05-08.md` — NEVER modify `toolskin.css` autonomously; the user owns that file. (Surgical typo fixes are an exception when explicitly directed.)

---

## 6. Open follow-ups (not done)

1. **Class audit (queued).** Several `.ts-tree-explorer__*` typography classes (`__brand-text`, `__title`, `__path`, `__intro-eyebrow`, `__actionbar-eyebrow`) carry only a few font/colour properties that design-system utilities (`.ts-eyebrow`, `.ts-font-mono`, `.ts-text-muted`) could provide. Per the design-system-first principle, they're candidates for removal. I deliberately did NOT do a blanket purge to avoid regressions on the user's hand-edits. Done on explicit request.

2. **`data-icon` injection consistency.** JS-built tree icons use the wrapper pattern `<span class="ts-icon" data-ts-icon="..."><i class="..."></i></span>`. The user's static markup uses `data-icon` (no `ts-` prefix). Both work because the inner `<i>` paints the glyph. If you want one canonical attribute name across the whole component, flip the JS to emit `data-icon` instead of `data-ts-icon` (one-line change in `makeIconWrap`).

3. **`tree-explorer.data.json` becomes optional.** Now that the HTML embeds the data inline by default, the separate JSON file is only used as a fetch fallback (rare) and by the dedup pipeline (still needed). If the user wants the lighter HTML on `http://` deployments, empty the inline `<script id="ts-tree-data">` block manually or add a Python flag (`EMBED_DATA = False`) to do it at generation time.

4. **Filter URL state.** Filters don't persist in the URL — refreshing loses the active chip + search. A `#hash` state writer (e.g. `?q=token&tax=CSS`) would let users share filtered views.

5. **Density-aware connector tweaks.** Connector geometry rescales with `--ts-tree-row-h` correctly, but at extreme densities (very compact) the elbow can look pinched. Not a regression; a polish item.

6. **Performance on > 10k files.** The unified filter walks every node on every keystroke (debounced 110 ms). For trees beyond ~10k nodes, the walk becomes noticeable. A trie-based index keyed on `dataset.name + groupOf(name)` would make filtering O(matches) instead of O(nodes).

---

## 7. File outputs (current shape)

```
tree-explorer.html        1531 KB   HTML shell + inline JSON; works in file:// and http://
tree-explorer.data.json   1463 KB   the JSON tree (fetch fallback + tooling)
tree-explorer.dedup.json   665 KB   second-pass dedup report (375 groups, 1146 redundant, 298 MB wasted)
docs/toolskin-tree-standalone-uses.md   reference doc with 5 use cases
docs/toolskin-tree-iteration-report.md  this file
```

`DRIVE_EXPLORER.html` and `toolskin.css` are owned by the user and remain untouched by the generator. Backups in `_bu/tree-explorer-iter5-2026-05-15/`.
