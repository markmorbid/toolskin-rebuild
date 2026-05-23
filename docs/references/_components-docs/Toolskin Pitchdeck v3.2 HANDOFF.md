# Toolskin Pitchdeck v3.2 — Handoff

Two HTML files, one source of truth. Variant is a single class on the deck root.

## Files

| File | Variant | Class on `#ts-deck` |
|---|---|---|
| `Toolskin Pitchdeck v3.2.html` | Full-bleed (default) | `ts-deck` |
| `Toolskin Pitchdeck v3.2 (with slider).html` | Sidebar gallery | `ts-deck ts-deck--with-slider` |

Both load the canonical stylesheet (`assets/css/toolskin.css`) and JS modules (`toolskin-assets.js`, `toolskin.js`, `toolskin-uikit.js`) from the showcase repo — no inline forks, no hardcoded values.

## Token-safe variant system

The vulnerability you flagged — disabling the slider broke the footer/nav math — is solved by routing **every** downstream calc through tokens that have safe defaults at `:root`, and overriding only those tokens inside `.ts-deck--with-slider`.

```css
:root {
  /* DEFAULTS — gallery-w is the ONLY variant-driven token used for sizing math */
  --ts-deck-gallery-w: 0px;
  --ts-deck-width: 100dvw;
  --ts-slide-fixed-footer-offset-x: calc(var(--ts-deck-gallery-w) + var(--ts-container-pad));
}

/* HOIST variant tokens to <body> so siblings of .ts-deck (e.g. the floating
   gallery panel) inherit too — overriding on .ts-deck alone leaves siblings
   in the default state. */
body:has(.ts-deck--with-slider) {
  --ts-deck-width: clamp(var(--ts-deck-slide-max-width), 75dvw, 1400px);
  --ts-deck-gallery-w: calc(100dvw - var(--ts-deck-width));
}

.ts-floating-picture.ts-section { width: var(--ts-deck-gallery-w); }

/* Gallery DOM stays inert when the deck doesn't opt in */
body:not(:has(.ts-deck--with-slider)) .ts-floating-picture { display: none !important; }
```

**Footer-width fix (v3.2.1):** the prior version had `--ts-slide-fixed-footer-offset-x` defined twice (once in `:root`, once in `.ts-deck--with-slider`) and the floating-picture used `calc(100dvw - var(--ts-deck-width) + …)`. Because `--ts-deck-width` was `100%`, that calc resolved against the absolute-positioned element's containing block — not the viewport — producing wrong widths in the default variant. Routing **all** variant math through `--ts-deck-gallery-w` (0 in default, computed in slider) fixes both: the footer offset formula lives once at `:root` and the floating-picture width reads gallery-w directly.

The `.ts-floating-picture` block stays in markup so authors can A/B variants without re-templating. `:has()` keeps it hidden unless the deck explicitly opts in.

### Why this is non-brittle

- **No hardcoded pixel offsets.** Every footer / nav / floating-picture calculation reads `--ts-deck-width`, `--ts-deck-gallery-w`, or `--ts-slide-fixed-footer-offset-x` — all three resolve cleanly to `100%` / `0` / `var(--ts-container-pad)` in the default variant.
- **Single switch.** Adding/removing the `ts-deck--with-slider` class flips the whole layout. No JS, no template surgery.
- **Sidebar markup is dormant, not deleted.** The gallery `<div class="ts-section ts-floating-picture …">` is `aria-hidden="true"` and `display: none` by default — still parseable, costs ~1KB, zero render impact.

## What landed in v3.2

- ✅ Default deck = full viewport (no max-width)
- ✅ Slider variant via `.ts-deck--with-slider`
- ✅ All token-dependent calcs guarded (footer offset, nav position, gallery width)
- ✅ Closing slide (slide 12 — "Thank you")
- ✅ Carry-forward of v3 polish: `.ts-slide-split` / `.ts-slide-split__intro` / `.ts-slide-split__body` named classes, `.ts-icon--deck` modifier, 2×2 grid body, `.ts-masonry--full` spanning row

## What's intentionally deferred (see "Componentization plan" below)

The asks below need a proper module extraction, not another inline patch. They're scoped to be lifted into reusable toolskin components rather than baked further into the pitchdeck HTML.

### 1. Accessible TOC floating menu

**Concept:** auto-built from slide eyebrows + `aria-label`s. Right-edge floating disclosure (`<button aria-expanded>`) reveals a vertical list of every `.ts-slide`. Items pull their label from, in order: `aria-label` → first `.ts-eyebrow` text → `data-slide` number. Active item = current slide. Click jumps. Keyboard: ↑/↓ within list, Enter activates, Esc closes.

**Why not in v3.2:** the showcase repo already has a `ts-sidebar` + mobile sidebar menu component. The right move is a `ToolskinDeckTOC` JS module that consumes `[data-ts-deck]` and emits a `.ts-deck-toc` widget — not a one-off inside this file. Hooks into existing `ts-sidebar` styling for free.

### 2. Auto-nav from eyebrows / aria-labels

**Concept:** instead of hardcoded `data-slide="N"`, the deck JS scans `.ts-slide` in document order and indexes them. Each slide gets `data-screen-label` auto-stamped from its eyebrow (matches the convention you use for `[data-screen-label]` on slides). The TOC and progress bar pull from the same index.

**Why not in v3.2:** belongs in `ToolskinDeck` (parallel to `ToolskinSlider`), not in inline `<script>`. See plan below.

### 3. Grid view mode ("press ESC")

**The footer line "Press ESC for grid view" was speculative.** It is **not** wired up in v2 or v3. Implementation options:

| Option | Effort | Description |
|---|---|---|
| A. CSS-only grid via `body[data-deck-mode="grid"] .ts-deck` | S | All slides flow as scaled tiles in a `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`. ESC key toggles `data-deck-mode`. Click a tile → restore + jump. Cheap, works. |
| B. Spotlight overlay (`.ts-deck-grid-overlay`) | M | Modal-style overlay over the deck, slides rendered as thumbnails (CSS `transform: scale(.18)` of clones, or `<canvas>` snapshots). More polished, more code. |
| C. Snapshot panel via `html-to-image` | L | True thumbnails. Heavy dependency, slow on big decks. Not recommended. |

**Recommendation:** Option A. Roughly 40 lines of CSS + 10 lines of JS. Lives in `ToolskinDeck.gridView()`. The "Press ESC" hint stays accurate.

## Componentization plan

The pitchdeck has accumulated enough inline systems that it's worth lifting them into the design system proper.

### Modules to extract (in priority order)

1. **`ToolskinDeck`** (`toolskin-deck.js`) — owns slide indexing, nav, progress bar, keyboard. Currently inline in every deck. Should consume `[data-ts-deck]` like `[data-ts-slider]` does.
2. **`ToolskinDeckTOC`** (`toolskin-deck-toc.js`) — auto-built TOC, hooks into `ToolskinDeck`.
3. **`ToolskinDeckGrid`** (`toolskin-deck-grid.js`) — ESC-to-grid mode.
4. **`deck.css` module** in toolskin.css — all `.ts-deck`, `.ts-slide`, `.ts-slide-split`, `.ts-slide-num`, `.ts-deck-card`, `.ts-deck-table`, `.ts-roadmap`, `.ts-scenario-grid`, etc. tokens & rules currently inlined.

### Suggested file layout

```
toolskin-showcase/
├── assets/
│   ├── css/
│   │   ├── toolskin.css                 (existing — base)
│   │   └── modules/
│   │       ├── deck.css                 (NEW — all deck rules)
│   │       ├── deck-split.css           (NEW — .ts-slide-split layout)
│   │       ├── deck-timeline.css        (NEW — execution timeline)
│   │       ├── deck-scenario.css        (NEW — revenue scenario grid)
│   │       └── deck-table.css           (NEW — service catalog table)
│   └── js/
│       ├── toolskin.js                  (existing)
│       ├── toolskin-deck.js             (NEW)
│       ├── toolskin-deck-toc.js         (NEW)
│       └── toolskin-deck-grid.js        (NEW)
└── templates/
    ├── deck-shell.html                  (NEW — empty deck scaffold)
    ├── slide-cover.html
    ├── slide-split.html                 (intro + 2×2 body pattern)
    ├── slide-masonry.html
    ├── slide-table.html
    ├── slide-timeline.html
    ├── slide-scenarios.html
    └── slide-closing.html
```

With this layout, building a new pitchdeck = `cat` together a shell + N slide templates + token customization. The current v3.2 HTML becomes the **reference implementation** that proves the modules work together.

### Migration path (3 phases)

| Phase | Scope | Outcome |
|---|---|---|
| 1. Extract CSS | Move the `<style>` block from v3.2 into `modules/deck*.css`. Replace inline `<style>` with `<link rel="stylesheet">`. | Pitchdeck shrinks from ~2.6k lines to ~700. No behavior change. |
| 2. Extract deck JS | Move the inline `<script>` (slide indexing, keyboard, progress) into `ToolskinDeck`. Mount via `[data-ts-deck]`. | Reusable across any future deck. |
| 3. Add TOC + Grid modules | Ship `ToolskinDeckTOC` and `ToolskinDeckGrid` as separate modules; auto-init via existing `Toolskin.init()` pattern. | "Press ESC" finally does something. TOC always available. |

## Outstanding nits (none blocking)

- `.ts-slide-num` placement inside `<p class="ts-lead">` on slide 7 is technically invalid HTML — should be hoisted out when the slide-split template is formalized.
- The legacy `:has(div:not([class]))` fallback selectors at lines ~1697-1820 can be deleted once all slides are confirmed to use `.ts-slide-split`.
- `--ts-slide-sidebar-w` is currently `clamp(280px, 28dvw, 380px)` — fine, but should probably read from a `--ts-deck-intro-w` alias for naming consistency with the rest of the deck token namespace.

---

**TL;DR for the dev picking this up:** the variant system is solid. Both HTML files render cleanly and the slider toggle is a single class flip with zero hardcoded fallbacks. The TOC, auto-nav, and grid view should be built as proper `Toolskin*` JS modules, not stuffed into another inline `<script>` block. The CSS module split (above) is the next leverage point — once that's done, building decks becomes a templating job.
