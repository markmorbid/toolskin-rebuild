# 03 · Layout & Spacing — The Harmonic System

> Layouts that don't break. Spacing that breathes. Grids that hold their shape from
> 320 to 2560px. Every value below is a token; every recipe below is locked.

---

## 1 · The 8pt grid (the rhythm)

Toolskin uses a **4px base unit, 8pt grid for spacing**. Every visible gap, padding,
or margin resolves to a `--ts-sp-*` token. No raw px in your CSS.

```css
--ts-sp-base: 4px;

--ts-sp-1   =  4px        /* hairline */
--ts-sp-2   =  8px        /* compact (icon-text gap, badge inner) */
--ts-sp-3   = 12px        /* form rows, list items */
--ts-sp-4   = 16px        /* default block padding, card inner gap */
--ts-sp-5   = 20px        /* rare — only when 16 is too tight and 24 too loose */
--ts-sp-6   = 24px        /* card padding default, section header gap */
--ts-sp-8   = 32px        /* spacious card padding, dense section gap */
--ts-sp-10  = 40px        /* rare */
--ts-sp-12  = 48px        /* block-to-block on landings */
--ts-sp-16  = 64px        /* section gap (mobile) */
--ts-sp-20  = 80px        /* section gap (tablet) */
--ts-sp-24  = 96px        /* section gap (desktop max) */
--ts-sp-32  = 128px       /* dramatic separation (hero only) */
```

### 1.1 Fluid spacing tokens (preferred for sections)

```css
--ts-section-pad:    clamp(4rem, 8vw, 9rem);      /* 64 → 144px */
--ts-section-gap:    clamp(4rem, 8vw, 9rem);      /* between sections */
--ts-container-pad:  clamp(1rem, 5vw, 4rem);      /* page gutter */
--ts-block-gap:      clamp(2rem, 5vw, 4rem);      /* block-to-block within a section */
```

Use the fluid tokens for top-level layout; fixed `--ts-sp-*` for component-internal spacing.

---

## 2 · The rhythm rule (the unbreakable law)

> **`padding` of a container ≥ `gap` between its children.**

If a card has `padding: 24px`, its children's `gap` is **at most 24px** (ideally 16).
Break this and the design looks careless — children touch the container walls
while floating apart from each other.

| Container padding | Children gap (max) | Children gap (preferred) |
|---:|---:|---:|
| sp-3 (12) | 8  | 8  |
| sp-4 (16) | 12 | 8  |
| sp-6 (24) | 20 | 16 |
| sp-8 (32) | 24 | 20 |
| section-pad | block-gap | block-gap (fluid) |

Same rule for nested grids: outer gap ≥ inner gap by one step.

---

## 3 · Container budgets (the width contract)

A page is a stack of containers. Each container has a max-width budget. Cross it
and content reads as cramped (too narrow) or sprawled (too wide).

```css
--ts-container-sm:  640px;   /* forms, single-column articles */
--ts-container-md:  960px;   /* 2-col cards, narrow editorial */
--ts-container-lg: 1280px;   /* default — dashboards, marketing */
--ts-container-xl: 1520px;   /* cinematic — hero + 3-col grids */
--ts-container-2xl: 1760px;  /* full bento with imagery */

/* Reading widths (NOT container widths) */
--ts-read-prose:  65ch;      /* body paragraphs (≈ 600px) */
--ts-read-wide:   80ch;      /* dashboard descriptions */
```

### 3.1 The full-bleed pattern (background to edge, content centered)

```css
.ts-section {
  /* The section itself goes edge to edge */
  width: 100%;
  padding-inline: var(--ts-container-pad);
  padding-block:  var(--ts-section-pad);
  background: var(--ts-bg-1);
}
.ts-section > .ts-container {
  /* Content lives inside the budget */
  max-width: var(--ts-container-lg);
  margin-inline: auto;
}
```

Never put the background on `.ts-container` — backgrounds belong to sections,
not to content boxes.

---

## 4 · The three layout primitives (90% of layouts)

### 4.1 The auto-fit card grid (unbreakable)

```css
.ts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: var(--ts-sp-6);
}
```

**Why this incantation:**
- `auto-fit` collapses empty tracks (vs `auto-fill` which leaves ghost columns)
- `minmax(min(100%, 280px), 1fr)` lets the card go full-width on narrow screens
  instead of overflowing horizontally — this is the safety belt that prevents most
  "card broke at 360px" bugs.

**Variants:**
```css
.ts-grid--tight   { gap: var(--ts-sp-4); --min: 220px; }
.ts-grid--spacious{ gap: var(--ts-sp-8); --min: 320px; }
.ts-grid--bento   { /* see §5.2 below */ }
```

### 4.2 The split (asymmetric, magazine-grade)

```css
.ts-split {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);   /* 5:7 — the magazine ratio */
  gap: clamp(var(--ts-sp-6), 4vw, var(--ts-sp-16));
  align-items: start;
}
@media (max-width: 768px) {
  .ts-split { grid-template-columns: 1fr; }
}
```

**Ratio menu** (pick one, never 50/50):
```
2fr 3fr   → 40:60   editorial, image-right
3fr 2fr   → 60:40   text-heavy hero
5fr 7fr   → 42:58   magazine standard
3fr 5fr   → 38:62   sidebar layouts
1fr 2fr   → 33:66   nav-and-content
```

50/50 reads as "default" — only use it intentionally for symmetric pairs
(e.g. before/after, two CTAs side-by-side).

### 4.3 The header-body-footer card (vertically pinned)

```css
.ts-stack {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100%;
  gap: var(--ts-sp-4);
}
```

The `1fr` middle row absorbs all extra space, pinning header to top and footer to
bottom regardless of content length. Cards in the same row stay equal height.

---

## 5 · Higher-order patterns

### 5.1 The reading column (long-form content)

```css
.ts-prose {
  max-width: 65ch;
  margin-inline: auto;
  font-size: var(--ts-fs-lead);     /* 19px — long-form gets larger body */
  line-height: var(--ts-lh-loose);  /* 1.65 */
}
.ts-prose > * + * { margin-top: var(--ts-sp-4); }
.ts-prose > h2 + * { margin-top: var(--ts-sp-2); }     /* headings stay close to their body */
.ts-prose > * + h2 { margin-top: var(--ts-sp-12); }    /* big air above new sections */
```

### 5.2 The bento grid (dashboard / marketing)

```css
.ts-bento {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: minmax(180px, auto);
  gap: var(--ts-sp-6);
  grid-auto-flow: dense;        /* dense packs holes */
}

/* Tile spans */
.ts-bento__hero  { grid-column: span 8; grid-row: span 2; }
.ts-bento__wide  { grid-column: span 8; }
.ts-bento__tall  { grid-column: span 4; grid-row: span 2; }
.ts-bento__half  { grid-column: span 6; }
.ts-bento__third { grid-column: span 4; }
.ts-bento__quart { grid-column: span 3; }

@media (max-width: 960px) {
  .ts-bento { grid-template-columns: repeat(6, 1fr); }
  .ts-bento__hero, .ts-bento__wide { grid-column: span 6; }
  .ts-bento__tall, .ts-bento__half { grid-column: span 3; }
  .ts-bento__third, .ts-bento__quart { grid-column: span 3; }
}
@media (max-width: 560px) {
  .ts-bento { grid-template-columns: 1fr; }
  .ts-bento > * { grid-column: 1; grid-row: auto; }
}
```

### 5.3 The dashboard frame (sidenav + topbar + content)

```css
.ts-app {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: 56px 1fr;
  grid-template-areas:
    "nav  topbar"
    "nav  main";
  min-height: 100dvh;
}
.ts-app__nav    { grid-area: nav;    background: var(--ts-bg-1); border-right: 1px solid var(--ts-border-1); }
.ts-app__topbar { grid-area: topbar; background: var(--ts-bg-0); border-bottom: 1px solid var(--ts-border-1); }
.ts-app__main   { grid-area: main;   overflow: auto; padding: var(--ts-sp-8); }

@media (max-width: 960px) {
  .ts-app { grid-template-columns: 1fr; grid-template-areas: "topbar" "main"; }
  .ts-app__nav { display: none; }  /* collapse to drawer on mobile */
}
```

---

## 6 · Container queries (component-level adaptation)

Container queries adapt a component to its OWN width, not the viewport. Use them
when a card needs different layout at different placements (e.g. sidebar vs main).

```css
.ts-card-wrapper {
  container-type: inline-size;
  container-name: card;
}

.ts-card { display: grid; gap: var(--ts-sp-4); }

@container card (min-width: 480px) {
  .ts-card { grid-template-columns: 96px 1fr; }   /* icon + body side-by-side */
}
@container card (min-width: 720px) {
  .ts-card { grid-template-columns: 96px 1fr auto; }  /* + trailing action */
}
```

**Rule:** media queries for PAGE layout (column count, sidebar visibility),
container queries for COMPONENT layout (card going from stacked to inline).

---

## 7 · Breakpoint contract

```css
/* Mobile-first. Base styles = 0-479px. */
@media (min-width: 480px)  { /* sm — mobile landscape */ }
@media (min-width: 768px)  { /* md — tablet portrait */ }
@media (min-width: 1024px) { /* lg — laptop */ }
@media (min-width: 1280px) { /* xl — desktop */ }
@media (min-width: 1536px) { /* 2xl — large desktop */ }
```

**Rule:** the layout primitives (§4) should work at ALL widths without media queries
thanks to `auto-fit` + `clamp()` + `minmax()`. Media queries are an escape hatch,
not a default tool.

---

## 8 · The harmonic ladder cheat sheet

Pair these values together — they belong on the same level.

| Level | Padding | Gap (children) | Radius | Type role | Shadow |
|---|---|---|---|---|---|
| **Hairline** | sp-1 (4) | — | xs (3) | micro -2 | — |
| **Tight** | sp-2 (8) | sp-1 (4) | xs (3) | caption -1 | — |
| **Compact** | sp-3 (12) | sp-2 (8) | sm (5) | body 0 | shadow-1 |
| **Default** | sp-4 (16) | sp-3 (12) | md (10) | body 0 | shadow-1 |
| **Card**    | sp-6 (24) | sp-4 (16) | md (10) | h4 step 3 | shadow-2 |
| **Panel**   | sp-8 (32) | sp-6 (24) | lg (14) | h3 step 4 | shadow-3 |
| **Hero**    | sp-16 (64) | sp-12 (48) | xl (20) | hero step 7+ | shadow-4 |

**Crossing levels causes visual collapse.** A card with hero radius looks like
a sticker; a hero with card padding looks anemic. Stay on a level.

---

## 9 · The vertical rhythm (baseline grid alternative)

We don't enforce a strict baseline grid in Toolskin (variable type heights make it
fragile), but we DO enforce vertical rhythm via `--ts-sp-*` between blocks.

```
Block stack (top → bottom):
  Overline    ─┐
              │  gap sp-2 (8px)
  Headline   ─┤
              │  gap sp-4 (16px)
  Lead       ─┤
              │  gap sp-6 (24px)
  Body       ─┤
              │  gap sp-12 (48px)   ← bigger gap = new logical section
  Next h2    ─┘
```

The gap *between* a heading and its body is **smaller** than the gap *before*
the next heading. This is the Gestalt proximity principle made concrete.

---

## 10 · Anti-patterns

- ❌ `margin: 16px 8px` — use `gap` and `padding`, never asymmetric margin.
- ❌ `grid-template-columns: 1fr 1fr 1fr` — collapses on text overflow. Use `minmax(0, 1fr)`.
- ❌ `width: 100vw` — causes horizontal scroll on macOS scrollbars. Use `100%`.
- ❌ `height: 100vh` — breaks on mobile address bar. Use `100dvh`.
- ❌ Fixed `width: 1200px` containers — use `max-width` with `margin: auto`.
- ❌ `padding-top: 80px` for a section. Use `--ts-section-pad`.
- ❌ Different gap values inside the same grid level.
- ❌ Negative margins to "pull" elements (cause stacking-context surprises).
- ❌ `position: absolute` for layout (vs decoration). Use grid placement.
- ❌ Hidden overflow on body (kills scroll on iOS). Lock scroll on a child instead.

---

## 11 · The "this won't break" test

For any layout you build, mentally check:

1. **Narrow content test** — viewport 320px wide, longest English word (~25 chars).
   Does anything overflow? Use `min(100%, X)` patterns to fix.

2. **Long content test** — paragraph 5× normal length. Does layout shift, or just
   the card grow taller? `1fr` and `minmax(0, ...)` matter here.

3. **Zoom test** — browser zoom 200%. Does layout collapse cleanly to mobile state?
   If columns crush, breakpoint is too late — move it to a `clamp()` or use container queries.

4. **No-image test** — disable images. Does layout still hold shape? If cards
   collapse, you put critical sizing on the image instead of the card.

5. **RTL test** — `dir="rtl"`. Does anything look broken? Use logical properties
   (`padding-inline`, `margin-block`, `inset-inline-start`) over physical.

If you can answer "yes, holds" to all five, the layout passes. Otherwise it's
not done.
