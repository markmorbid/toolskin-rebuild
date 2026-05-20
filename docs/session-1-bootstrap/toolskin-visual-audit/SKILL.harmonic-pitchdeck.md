# Skill — Toolskin harmonic pitchdeck

A reusable recipe for building Toolskin pitch decks. Every size, gap and rhythm derives from canonical Toolskin tokens. One knob (`--ts-deck-scale`) rescales the whole deck. A second switch (`.ts-deck--with-slider` on the deck root) toggles the sidebar gallery variant without breaking any other layout math.

---

## Hard rules

1. **Use canonical Toolskin classes.** Markup is `ts-*` only. New visual behaviour comes from re-binding tokens inside `.ts-deck` scope — not from bespoke class namespaces. Variants are enabled by a single modifier class on the deck root (e.g. `.ts-deck--with-slider`).
2. **No fixed-px bases in deck scope.** Forbidden: `--ts-deck-base: 15px`, `--ts-deck-card-base: 20px`, `--ts-timeline-base: 13px`, etc. Every size points at `--ts-fs-*` / `--ts-sp-*` / `--ts-radius-*` / `--ts-line-height-*`.
3. **No inline `style="..."` on slide content.** If you find yourself typing `style="max-width: 30dvw"` or `style="font-size: var(--ts-deck-icon-size)"`, **stop** and create a class (`.ts-slide-split__intro`, `.ts-icon--deck`). The brittle `:has(div:not([class]))` fallback selectors that v2 leaned on are deprecated.
4. **Padding/gap inside type-bearing components are in `em`, not px.** Cards' padding scales with their font-size automatically.
5. **Line-heights pair by role.** display titles → `--ts-line-height-display` (0.9) · h2/h3 → `--ts-line-height-snug` (1.25) · body → `--ts-line-height-relaxed` (1.5) · lead → `--ts-line-height-loose` (1.625).
6. **Text wraps intelligently.** `text-wrap: balance` on every heading; `text-wrap: pretty` on every paragraph and list item.
7. **Slides must fit the viewport without scrolling.** No `aspect-ratio: 1` on inner cards that have variable copy. No `height: 100dvh` on inner flex wrappers — use `max-height: calc(var(--ts-deck-slide-min-height) - var(--ts-deck-nav-size) * 2)` instead.

---

## Required base — load order

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />

<link rel="stylesheet" href="https://satsea.io/toolskin-showcase/assets/css/toolskin.css" />

<script src="https://satsea.io/toolskin-showcase/assets/js/toolskin-assets.js" defer></script>
<script src="https://satsea.io/toolskin-showcase/assets/js/toolskin.js" defer></script>
<script src="https://satsea.io/toolskin-showcase/assets/js/toolskin-uikit.js" defer></script>
```

These are the **only** stylesheet/script sources. Do not inline copies of toolskin.css. Author additions go in a single `<style>` block scoped to the deck.

---

## The single knob — global rescale

```css
:root {
  --ts-deck-scale: 1;
  --ts-font-scale: var(--ts-deck-scale); /* rebinds the canonical font scale */
}
```

Tweak `--ts-deck-scale` 0.85 → 1.2 and every `--ts-fs-*` rescales. Card padding (em) and layout gaps (`--ts-sp-*`) breathe in proportion. No media queries needed inside the deck — masonry/scenario grids use `auto-fit` for column reflow.

---

## The variant switch — sidebar gallery

The deck has two layout variants controlled by **one class** on `#ts-deck`:

| Class | Behaviour |
|---|---|
| `ts-deck` | Default — full-viewport deck, no gallery lane |
| `ts-deck ts-deck--with-slider` | Carves a right-edge gallery lane; appends `[data-ts-slider]` floating images |

### Token-safe implementation

**Critical rule:** `--ts-deck-gallery-w` is the **single source of truth** for variant-driven sizing. The footer offset, the floating-picture width, and any other dimension that differs between variants must derive from it. `--ts-deck-width` is *only* the deck's max-width cap — never used in sizing math.

```css
:root {
  /* DEFAULTS — no gallery lane, footer offset reduces to container-pad */
  --ts-deck-gallery-w: 0px;
  --ts-deck-width: 100dvw;
  --ts-slide-fixed-footer-offset-x: calc(var(--ts-deck-gallery-w) + var(--ts-container-pad));
}

/* Hoist the override to <body> so the floating gallery (a sibling of .ts-deck)
   inherits the new --ts-deck-gallery-w too. Overriding on .ts-deck alone only
   propagates to its descendants — the sibling gallery stays at 0-width. */
body:has(.ts-deck--with-slider) {
  --ts-deck-width: clamp(var(--ts-deck-slide-max-width), 75dvw, 1400px);
  --ts-deck-gallery-w: calc(100dvw - var(--ts-deck-width));
}

/* Floating gallery sized purely by gallery-w (0 in default → invisible without display:none chicanery) */
.ts-floating-picture.ts-section { width: var(--ts-deck-gallery-w); }

/* Gallery DOM is dormant unless the deck opts in */
body:not(:has(.ts-deck--with-slider)) .ts-floating-picture { display: none !important; }
```

**Anti-pattern:** `width: calc(100dvw - var(--ts-deck-width) + …)`. If `--ts-deck-width` is `100%` in default, this calc evaluates in a layout context that can produce surprising values. Use `var(--ts-deck-gallery-w)` directly.

**Anti-pattern:** giving the slider variant a bespoke `--ts-slide-fixed-footer-offset-x` calc with subtractions and pad-y multipliers. Define the offset formula **once** at `:root` using `--ts-deck-gallery-w`, and let the variant change only `--ts-deck-gallery-w`. The downstream calc updates itself.

---

## Role → token map

| Role | Font size | Line height |
|------|-----------|-------------|
| Cover title | `--ts-fs-display-md` | `--ts-line-height-display` |
| Section h2 | `--ts-fs-h2` | `--ts-line-height-snug` |
| Card h3 | `--ts-fs-xl` | `--ts-line-height-snug` |
| Lead paragraph | `--ts-fs-lead` | `--ts-line-height-loose` |
| Body | `--ts-fs-body-sm` | `--ts-line-height-relaxed` |
| Eyebrow | `--ts-fs-eyebrow` | `--ts-line-height-normal` |
| Mono / chip | `--ts-fs-2xs` – `--ts-fs-3xs` | `--ts-line-height-tight` |

---

## Layout primitives

### Slide frame
```html
<div class="ts-slide" data-slide="N" aria-label="<concise slide title>">
  <div class="ts-eyebrow">§NN · Section</div>
  <div class="ts-slide-num">NN / TT</div>
  <h2>Title that uses text-wrap: balance</h2>
  <div class="ts-accent-bar"></div>
  ...content...
  <div class="ts-slide-footer">Optional one-liner footnote</div>
</div>
```

Flex column, `gap: var(--ts-deck-slide-gap)`, padding clamps via `--ts-deck-slide-pad-y/x`.

### Masonry (responsive card grid)
```html
<div class="ts-masonry ts-deck-masonry">
  <div class="ts-card ts-deck-card">...</div>
  <div class="ts-card ts-deck-card">...</div>
  ...
</div>
```
`grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr))`. Use `.ts-masonry--full` on any child to span the full row.

### Split-column slide (intro + 2×2 grid body) — **canonical pattern**
For slides that need a left-side intro (eyebrow + h2 + lead) next to a 2×2 card grid. Replaces the v2 inline `style="max-width: 30dvw"` hack.

```html
<div class="ts-slide" data-slide="N" aria-label="...">
  <div class="ts-masonry ts-slide-split">
    <div class="ts-slide-split__intro">
      <div class="ts-eyebrow">§NN · Section</div>
      <div class="ts-slide-num">NN / TT</div>
      <h2>Intro headline</h2>
      <div class="ts-accent-bar"></div>
      <p class="ts-lead ts-deck-lead">Intro lead copy.</p>
    </div>
    <div class="ts-slide-split__body">
      <div class="ts-masonry">
        <div class="ts-card ts-deck-card">...</div>
        <div class="ts-card ts-deck-card">...</div>
        <div class="ts-card ts-deck-card">...</div>
        <div class="ts-card ts-deck-card">...</div>
        <!-- optional full-width row -->
        <p class="ts-deck-lead ts-masonry--full">Commitment paragraph spans both columns.</p>
      </div>
    </div>
  </div>
  <div class="ts-slide-footer">Footnote</div>
</div>
```

**Rules for the split body grid:**
- `display: grid; grid-template-columns: repeat(2, minmax(0, 1fr))` — fixed 2 columns at desktop.
- Cards size to their content (`height: auto`). **Never** `aspect-ratio: 1` if copy is variable.
- Full-row elements use `.ts-masonry--full` → `grid-column: 1 / -1`.
- Under 900px viewport the grid collapses to one column.

### Timeline
4-col grid (marker · content · revenue · badge), middle two cols carry right-borders for column rhythm.

### Roadmap row
`grid-template-columns: minmax(7em, 9em) 1fr` so period labels align vertically across rows.

### Scenario grid (revenue forecasting)
3-col `auto-fit` of `.ts-scenario` cards; center card uses `.ts-scenario--base` modifier for accent glow.

### Service catalog table
`<table class="ts-deck-table">` — handled by toolskin.css; just provide thead/tbody.

---

## Asset toolkit available to the deck

| Asset | How to use |
|---|---|
| **Icons** (Font Awesome 6 + iconify) | `<div class="ts-icon ts-icon--deck ts-accent-text" data-icon="fa-solid fa-code"></div>` — `ts-icon--deck` sizes to `--ts-deck-icon-size`. Use `data-icon="ion:..."` for Ionicons. |
| **Floating gallery slider** | `<div class="ts-section ts-floating-picture ts-pattern-dots ts-parallax">` + `<div class="ts-split-feature__slider" data-ts-slider data-ts-slider-interval="8000">` with `<img class="ts-slide---item">` children. Only renders when deck has `.ts-deck--with-slider`. |
| **Slider dots** | `<div class="ts-slider-dots">` inside the slider root — auto-built by `ToolskinSlider`. |
| **Patterns** | `ts-pattern-dots`, `ts-pattern-grid`, `ts-pattern-lines` on any container. |
| **Parallax** | `ts-parallax` + `ts-parallax__overlay` + `ts-parallax__bg`. |
| **Accent bar** | `<div class="ts-accent-bar"></div>` under every h2. |
| **Eyebrow** | `<div class="ts-eyebrow">§NN · Section name</div>` — first child of every slide. |
| **Slide number** | `<div class="ts-slide-num">NN / TT</div>` |
| **Mono inline** | `<span class="ts-mono ts-accent-text">code or stat</span>` |
| **Badges** | `<span class="ts-badge ts-badge--danger">` (also `--success`, `--warning`, neutral). |
| **Card variants** | `.ts-card.ts-deck-card` base; modifiers: `--accent`, `--featured`, `--danger`. |
| **Cell helpers in tables** | `.ts-table-number`, `.ts-table-subtitle`, `.ts-val-success`. |

---

## Build order (canonical recipe)

1. **Scaffold the shell.** Drop the HTML below, set the `<title>`, set the slide count `TT` for `.ts-slide-num` (e.g. `12 / 12`).
2. **Decide the variant.** Default = no slider. Add `ts-deck--with-slider` on `#ts-deck` if the brief wants the gallery lane.
3. **Author slides as `<div class="ts-slide" data-slide="N" aria-label="…">`.** Aria-labels feed any future TOC component — set them as you go.
4. **Pick a layout primitive per slide.** Default = `.ts-masonry`. Use `.ts-slide-split` only when the slide has a clear intro/body separation.
5. **Always include cover (slide 1) + closing (slide N).** Closing pattern: short headline, accent bar, single lead line, one footer note. No filler.
6. **Verify token usage.** Every `font-size`, `padding`, `margin`, `gap`, `border-radius` must reference `var(--ts-*)`, an `em`, or a `clamp(--ts-sp-*, dvw, --ts-sp-*)`.

### Shell template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>...</title>
  <!-- preconnect + Google Fonts + toolskin.css + toolskin*.js (see "Required base" above) -->
  <style>
    /* Author overrides + variant tokens go here.
       Token-safe defaults + .ts-deck--with-slider opt-in (see "The variant switch"). */
  </style>
</head>
<body class="ts-bg-body">
  <!-- Floating gallery — dormant unless .ts-deck--with-slider is present -->
  <div class="ts-section ts-floating-picture ts-z-0 ts-pattern-dots ts-parallax" aria-hidden="true">
    <div class="ts-parallax__overlay"></div>
    <div class="ts-split-feature__slider ts-parallax__bg" data-ts-slider data-ts-slider-interval="8000">
      <img class="ts-slide---item active" src="..." alt="" loading="eager" />
      <img class="ts-slide---item" src="..." alt="" loading="lazy" />
      <div class="ts-slider-dots"></div>
    </div>
  </div>

  <div id="ts-deck" class="ts-deck">
    <div class="ts-progress">
      <div class="ts-progress--bar" id="ts-progress" style="width: 0%"></div>
    </div>

    <!-- Slides 1..N -->
    <div class="ts-slide ts-active" data-slide="1" aria-label="Cover">...</div>
    ...
    <div class="ts-slide" data-slide="N" aria-label="Thank you">...</div>
  </div>

  <!-- Slide navigation buttons (existing pattern) -->
  <nav class="ts-slide-nav" aria-label="Slide navigation">
    <button class="ts-btn" id="ts-prev" aria-label="Previous slide">←</button>
    <span id="ts-counter">1 / N</span>
    <button class="ts-btn" id="ts-next" aria-label="Next slide">→</button>
  </nav>

  <script>
    // Slide indexing + keyboard nav + progress bar (see v3.2 reference impl)
  </script>
</body>
</html>
```

---

## What gets removed (v2 → v3+ migration)

When polishing an older deck, delete these on sight:

- All ad-hoc `--ts-deck-*-base: NNpx` tokens — use canonical `--ts-fs-*` / `--ts-sp-*`.
- `--ts-deck-body-scale: 0.9` (sub-canonical size cheat).
- Hand-rolled `.ts-card` padding in px.
- Inline `style="max-width: 30dvw"` / `style="font-size: ..."` — extract to a class.
- Brittle `:has(div:not([class]))` fallback selectors — replace with `.ts-slide-split` family.
- Forced `aspect-ratio: 1` on cards with variable copy.
- `height: 100dvh` on inner flex wrappers — causes scroll. Use `max-height: calc(var(--ts-deck-slide-min-height) - var(--ts-deck-nav-size) * 2)`.

---

## Checklist when finishing a deck

- [ ] Every `font-size`, `padding`, `margin`, `gap`, `border-radius` references `var(--ts-*)` or an `em`.
- [ ] Exactly one `--ts-deck-scale` declaration; `--ts-font-scale` rebinds it.
- [ ] Every heading: `text-wrap: balance`. Every paragraph: `text-wrap: pretty`.
- [ ] Grids use `minmax(min(100%, …), 1fr)` for graceful 1-col fallback.
- [ ] No slide has inline `style="..."` that hardcodes width/spacing.
- [ ] Every slide has `data-slide="N"` and a descriptive `aria-label`.
- [ ] Split-column slides use `.ts-slide-split` / `.ts-slide-split__intro` / `.ts-slide-split__body` — not unclassed divs.
- [ ] Inner card grids inside `.ts-slide-split__body` are 2-column CSS grid; full-row elements have `.ts-masonry--full`.
- [ ] Slide content fits the viewport (no internal scroll). Verify by viewing each slide.
- [ ] `--ts-deck-width`, `--ts-deck-gallery-w`, `--ts-slide-fixed-footer-offset-x` have safe defaults at `:root` and are only overridden inside `.ts-deck--with-slider`.
- [ ] Cover slide and closing slide both present.
- [ ] No emoji unless the brand calls for it. No filler copy.
