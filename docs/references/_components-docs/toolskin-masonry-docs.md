# Toolskin · Masonry Integration v5

Token-driven, container-aware, harmonic flexbox masonry. Single primitive, three layout modes, zero JS.

## At a glance

```
.ts-masonry                          ← canonical base
.ts-masonry > *                      ← default item selector
.ts-masonry-item                     ← optional explicit item marker
.ts-masonry-item--image, .ts--image  ← image item (canonical + alias)
.ts-masonry--gallery                 ← variant: image-tile gallery
.ts-masonry--grid                    ← variant: reserved for future
```

## Naming rationale

The new system collapses three legacy systems (`.ts-masonry` legacy, `.ts-masonry--v2`, `.ts-ui-masonry`) into one canonical entry point: `.ts-masonry`. The naming choices are guided by three principles.

**Block / element / modifier separation.** `.ts-masonry` is the block. `.ts-masonry-item` is its element (note the single hyphen, mirroring the BEM-lite house style — not the double underscore of the legacy `.ts-ui-masonry__item`). Modifiers attach with double-hyphen: `.ts-masonry--gallery`, `.ts-masonry-item--image`.

**Item-on-block modifier shortcuts.** The spec also requested item-level modifiers using the block's name: `.ts-masonry--full`, `.ts-masonry--wide`, `.ts-masonry--tall`. These read as "this item exhibits the block's *full* / *wide* / *tall* mode." Plus short aliases (`.full`, `.half`, `.wide`, `.tall`, `.fullwidth`) so terse markup stays terse. All variants of each modifier resolve to the same rule via comma-grouped selectors.

**No collision with legacy.** All legacy classes (`.ts-masonry--v2`, `.ts-ui-masonry`, `.ts-ui-masonry__item--image`, broken `.ts-masonry--grid`) keep their own selectors. The new system's specificity intentionally doesn't reach into legacy markup. `.ts-masonry--grid` is reserved here only as a variant slot — its existing legacy declaration is left alone and will be deprecated in a later pass.

## Variant architecture

Three tiers, each strictly contained:

```
TIER 1 — BASE LAYOUT ENGINE (locked v5)
  .ts-masonry                              ← container, tokens, ladder
  .ts-masonry > *                          ← items, basis, min-height
  .ts-masonry:has(...)                     ← anti-orphan count guards
  @container ts-masonry (max-width: ...)   ← responsive ladder

TIER 2 — ITEM MODIFIERS (composable, all token-driven)
  .full / .fullwidth / .ts-masonry--full   ← --_ts-basis: 100%
  .half                                    ← --_ts-basis: 50%
  .wide / .ts-masonry--wide                ← flex-grow: 2; basis × 2
  .tall / .ts-masonry--tall                ← min-height × multiplier

TIER 3 — VARIANTS (mode switches on the block)
  .ts-masonry--gallery                     ← image-tile gallery
  .ts-masonry--grid                        ← reserved
```

Each tier reads tokens defined by the tier above. Modifiers compose freely: `.wide.tall`, `.full.tall`, etc.

## Image handling

Three trigger paths converge on identical surface treatment:

| Path | Selector | Use when |
|------|----------|----------|
| **A · explicit canonical** | `.ts-masonry-item--image` | New code; clearest intent |
| **B · explicit alias** | `.ts-masonry-item.ts--image` or `.ts--image` | Migrating from short-naming codebases |
| **C · auto-detect** | `:has(> img:not(.ts-icon, .ts-logo))` | Plain `<img>` or wrapped `<img>` with no class |

All three apply the same surface: `position: relative; overflow: hidden; aspect-ratio; background; border; radius; min-height: 0`. Inside, the `<img>` is positioned absolutely and `object-fit: cover`'s the surface.

The auto-detect path is **excluded** from `.ts-card`, `.ts-flip-card`, `.ts-swipe-card`. These components manage their own image rendering — the masonry never reaches into them. Explicit `.ts-masonry-item--image` *does* still apply on cards if you opt-in deliberately, in case you want a card surface to render as an image tile.

The `.ts-icon` and `.ts-logo` exceptions on `<img>` selectors prevent the masonry from converting small UI graphics (logos, inline icons) into giant image tiles.

### Aspect-ratio modes

```
default              4 / 3   (--ts-masonry-image-aspect)
.ts-masonry-item--natural    auto, lets image dictate
.ts-masonry-item--square     1 / 1
.ts-masonry--gallery         1 / 1 (variant default)
```

Override per-instance:

```html
<div class="ts-masonry" style="--ts-masonry-image-aspect: 16 / 9;">…</div>
```

### Hover effect

Gallery tiles only. Tunable via `--ts-masonry-hover-scale`, `--ts-masonry-hover-duration`, `--ts-masonry-hover-ease`. Set scale to `1` to disable.

## Supported components

These render correctly as direct masonry items:

| Component | Notes |
|-----------|-------|
| `.ts-card` | Stretches to slot via `width: 100%` |
| `.ts-flip-card` | Uses `--ts-flip-card-h`; engine min-height suppressed |
| `.ts-swipe-card` | Uses `--ts-swipe-card-h`; engine min-height suppressed |
| Plain divs / sections | Default `> *` behavior, min-height = `--ts-masonry-row-h` |
| `<img>` direct child | Auto-detected; rendered as image tile |
| `<div><img></div>` | Auto-detected; wrapper becomes image surface |

The masonry never adds transforms, opacity, isolation, or other stacking-context triggers to its children. Card 3D transforms remain intact.

## Token reference

```
LAYOUT (engine)
  --ts-masonry-cols-target          5         target cols at wide
  --ts-masonry-col-min              10rem     wrap floor
  --ts-masonry-gap                  --ts-sp-4 inter-item gap
  --ts-masonry-row-h                7.5rem    item min-height (0 = aspect-driven)

IMAGES
  --ts-masonry-image-aspect         4 / 3     default tile aspect
  --ts-masonry-image-radius         --ts-radius-md
  --ts-masonry-image-bg             --ts-bg-1 (or --ts-this-bg)
  --ts-masonry-image-border         --ts-border-0 (or --ts-this-bg-border)

MODIFIERS
  --ts-masonry-tall-multiplier      2         .tall row-h multiplier

HOVER (gallery)
  --ts-masonry-hover-scale          1.04
  --ts-masonry-hover-duration       380ms
  --ts-masonry-hover-ease           cubic-bezier(.2, .7, .2, 1)
```

The image background and border tokens fall back to `--ts-this-bg` and `--ts-this-bg-border` when the surface system is in scope, so masonry tiles inherit the local surface tier automatically.

## Quick start

### Stat strip (5 items)

```html
<div class="ts-masonry">
    <div class="ts-card"><h3>5</h3><p>Demos</p></div>
    <div class="ts-card"><h3>1</h3><p>Stylesheet</p></div>
    <div class="ts-card"><h3>3</h3><p>Variables</p></div>
    <div class="ts-card"><h3>240+</h3><p>Tokens</p></div>
    <div class="ts-card"><h3>0</h3><p>JS deps</p></div>
</div>
```

### Mixed widths

```html
<div class="ts-masonry">
    <div class="ts-masonry-item ts-masonry--full">Hero — full row</div>
    <div class="ts-masonry-item wide">Wide — 2× span</div>
    <div class="ts-masonry-item">Normal</div>
    <div class="ts-masonry-item">Normal</div>
    <div class="ts-masonry-item tall">Tall — 2× height</div>
</div>
```

### Image gallery

```html
<div class="ts-masonry ts-masonry--gallery">
    <img src="photo-1.jpg" alt="…">
    <img src="photo-2.jpg" alt="…">
    <img src="photo-3.jpg" alt="…">
    <img src="photo-4.jpg" alt="…">
    <img src="photo-5.jpg" alt="…">
    <img src="photo-6.jpg" alt="…">
</div>
```

### Mixed image + UI

```html
<div class="ts-masonry">
    <div class="ts-masonry-item ts-masonry-item--image">
        <img src="hero.jpg" alt="…">
    </div>
    <div class="ts-card">…stat card…</div>
    <div class="ts-flip-card">…flip card…</div>
</div>
```

## Do · Don't

**Do**

- Set `--ts-masonry-cols-target` per instance to express intent.
- Use `.ts-masonry-item` whenever you'll attach modifiers — it makes specificity predictable.
- Use the `.ts-masonry--gallery` variant for any image-only grid; it's tuned for tile flow.
- Override tokens at the instance level (inline style or scoped class) instead of writing custom CSS.

**Don't**

- Don't redeclare the locked v5 base block. If your `toolskin-extras.css` already has it, delete that block from this file.
- Don't apply `transform`, `opacity`, `isolation`, or `will-change` to direct masonry children — it breaks `.ts-flip-card` / `.ts-swipe-card` 3D contexts.
- Don't nest `.ts-masonry` inside `.ts-masonry > *` without a wrapper — the inner masonry's container query will read the parent slot's width, which may collapse unexpectedly. Add an explicit width-100% wrapper if you must nest.
- Don't combine `.full` and `.wide` on the same item — `.full` already takes the row.
- Don't use `.ts-masonry-item--image` on a flip/swipe card. The card paints its own image; image-tile styling will fight its 3D layers.

## Migration notes

| Legacy | Status | Move to |
|--------|--------|---------|
| `.ts-masonry` (pre-v5) | Replaced silently — same name, new engine | (already done) |
| `.ts-masonry--v2` | Kept; deprecated | `.ts-masonry` |
| `.ts-ui-masonry` | Kept; deprecated | `.ts-masonry` |
| `.ts-ui-masonry__item` | Kept; deprecated | `.ts-masonry-item` |
| `.ts-ui-masonry__item--image` | Kept; deprecated | `.ts-masonry-item--image` |
| `.ts-masonry--grid` (broken) | Kept untouched | (variant slot reserved; future overhaul) |

No legacy class is removed in this pass. Deprecation migration happens as a separate phase.
