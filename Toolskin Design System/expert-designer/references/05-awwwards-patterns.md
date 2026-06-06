# 05 · Awwwards-Grade Patterns

> The patterns that win awards aren't novel — they're committed. Pick a pattern,
> execute it with conviction, and the design reads as intentional. Each pattern
> below is lifted from the visual canon of awwwards.com Site of the Day winners
> and broken down into the moves that make it work.

---

## How to use this file

For any new page or section:

1. **Choose a pattern by intent** (§ table below).
2. **Read its breakdown**: anatomy, the ONE move that makes it great, dimensions.
3. **Copy the structure**, fill with real content, do not deviate without a reason.

| Goal | Pattern | Reference |
|---|---|---|
| Tech / dev tool landing | §1 The Centered Hero | agentic, expressive, deployer |
| Editorial / publication | §2 The Magazine Split | editorial, publication |
| Marketing landing | §3 The Asymmetric Hero | difuse, oneapp, lumina-finance |
| Dashboard / app | §4 The Dashboard Frame | typeui.sh, flowloop |
| Bold / brutalist | §5 The Oversized Type | brutalism, exhibit, refined |
| Bento / multi-tile | §6 The Bento Grid | bento, cosmic |
| Product / e-commerce | §7 The Product Showcase | lumi, snackmagic, ghia |
| Portfolio / agency | §8 The Featured Works | skyline, lumina-agency |
| Editorial dark hero | §9 The Restraint Hero | impeccable, retro |
| News / feed | §10 The Lopsided Feed | publication, lopsided |

---

## §1 · The Centered Hero

**Used by:** dev tools, AI products, SaaS launches.

```
                  [overline · v2.0 is live]

              THE #1 AI AGENT FOR
              ALL YOUR CODEBASE

         #1 IN BAKE-OFFS · #1 IN BENCHMARKS · #1 ON G2

              [Primary CTA]   [Secondary CTA]

                      ┌──────────────┐
                      │  product viz │
                      └──────────────┘
```

**Anatomy:**
- Overline pill (badge, optional)
- Display headline (step 7–8, **48–69px**, 2 lines max, weight 700, tracking -0.025em, lh 1.05)
- Inline credentials row (small caps, divided by `·`, color: muted)
- Two CTAs (primary + secondary, both 50px tall, horizontal gap 12px)
- Below-the-fold product visual (terminal screenshot, dashboard, or product mockup)

**The ONE move:** Headline is the entire visual hierarchy. Everything else is a supporting prop with less than 25% of the headline's visual weight.

**Dimensions:**
- Top padding: clamp(96px, 16vh, 192px)
- Vertical rhythm: overline → headline (gap 24), headline → credentials (gap 40), credentials → CTAs (gap 32)
- Container: `--ts-container-md` (960px max) — keeps the headline center-of-page
- Text alignment: center
- Background: `--ts-bg-body` with optional `--ts-accent-glow-bg` radial behind headline

**Snippet:**
```html
<section class="ts-hero ts-hero--centered ts-section--glow">
  <div class="ts-container ts-container--md">
    <p class="ts-badge">v2.0 is live</p>
    <h1 class="ts-hero__title">The #1 AI agent for<br>all your codebase</h1>
    <p class="ts-hero__credits">#1 in bake-offs · #1 in benchmarks · #1 on G2</p>
    <div class="ts-hero__actions">
      <a class="ts-btn ts-btn--primary ts-btn--lg">Start free trial</a>
      <a class="ts-btn ts-btn--ghost ts-btn--lg">View demo</a>
    </div>
  </div>
  <figure class="ts-hero__media">…</figure>
</section>
```

---

## §2 · The Magazine Split

**Used by:** editorial, long-form, publications.

```
┌────────────────────────┬───────────────────────────┐
│ DESIGN · 10 min read   │ EDITORIAL                  │
│                        │                            │
│ The radical return to  │ "When you remove           │
│ minimal interfaces.    │  everything that isn't     │
│                        │  essential, what remains   │
│ The industry is        │  must be perfect."         │
│ stripping away…        │                            │
│                        │ — Editor in Chief          │
│ [Read full story]      │                            │
└────────────────────────┴───────────────────────────┘
┌────────────┬────────────┬────────────┬────────────┐
│ TECHNOLOGY │ CULTURE    │ ARCHITECTURE│ DESIGN    │
│ Death of   │ Working in │ Building   │ More      │
│ the…       │ the age…   │ for the…   │ stories…  │
└────────────┴────────────┴────────────┴────────────┘
```

**Anatomy:**
- Hero split (2:3 or 5:7 — see Layout §4.2). Left: article preview. Right: pull quote on `--ts-bg-3`.
- Below: 4-column equal grid of secondary stories. Each: overline + headline + 2 lines of body.
- Vertical dividers between columns (1px `--ts-border-1`).

**The ONE move:** No imagery in the hero. Pure typography carries 100% of the visual weight.

**Dimensions:**
- Headlines in hero: step 5 (40px), display font, weight 600
- Pull quote: step 4 (33px), display font (often serif), weight 500
- Cell body: step 0 (16px), 2-line clamp, color `--ts-text-secondary`
- Cell padding: sp-6 (24px)
- Divider: 1px between columns ONLY, no horizontal dividers

---

## §3 · The Asymmetric Hero

**Used by:** marketing landings, product launches.

```
┌──────────────────────────────────────┐  ┌──────────────┐
│ COMPACT                              │  │              │
│ POWERFUL    Rebuilding the           │  │  product 3D  │
│ SEAMLESS    Network Stack.           │  │  illustration│
│                                      │  │              │
│ We build intelligent router platforms│  │  ┌────────┐ │
│ that unify networking and…           │  │  │ floating│ │
│                                      │  │  │  badge  │ │
│ [Online store]  [Become a partner →] │  │  └────────┘ │
└──────────────────────────────────────┘  └──────────────┘
```

**Anatomy:**
- Left column (5fr): vertical-stacked kicker labels (UPPERCASE, weight 500, color muted), headline, body, CTA pair.
- Right column (7fr): product visualization (illustration, photo, 3D render) with floating decorative badges.

**The ONE move:** The kicker labels stack vertically on the LEFT of the headline like a magazine table of contents. This is unusual and instantly readable as "designed."

**Dimensions:**
- Kicker labels: step -2 (11px), weight 500, UPPERCASE, tracking +0.08em, vertical gap sp-2, color `--ts-text-muted`
- Headline: step 6 (48px), display, weight 700, tracking -0.025em, lh 1.05
- Container ratio 5:7 OR 6:6 with kickers absolutely positioned in the left gutter

---

## §4 · The Dashboard Frame

**Used by:** SaaS apps, admin panels, IDEs.

```
┌──┬───────────────────────────────────────────────────────┐
│  │  ┌─ Search ──────────────┐         + New Project [▾] │
│  │  └───────────────────────┘                            │
│N │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐         │
│A │  │ Stat 1 │ │ Stat 2 │ │ Stat 3 │ │ Stat 4 │         │
│V │  └────────┘ └────────┘ └────────┘ └────────┘         │
│  │  ┌──────────────────────┐ ┌───────────────────────┐   │
│  │  │   Chart card         │ │   Activity card        │   │
│  │  │                       │ │                        │   │
│  │  └──────────────────────┘ └───────────────────────┘   │
└──┴───────────────────────────────────────────────────────┘
```

**Anatomy:**
- Left sidenav (240px), bg-1, vertical icon+label nav
- Topbar (56px), bg-0, search + actions
- Content area: bento grid of stat cards on top row + 2-column chart/activity below
- Generous gutters (sp-6 between cards)

**The ONE move:** Stat cards use **tabular numerals** (`font-feature-settings: "tnum"`).
This single CSS rule is what separates pro dashboards from amateur ones.

**Dimensions:**
- Stat metric: step 5 (40px), weight 700, tnum
- Stat card padding: sp-6 (24px)
- Stat card gap (in grid): sp-6
- Chart card padding: sp-6, min-height 320px
- Sidenav item: 40px tall, sp-3 padding-inline, sp-2 gap to icon

→ Full markup in `references/03-layout-and-spacing.md` §5.3.

---

## §5 · The Oversized Type Hero

**Used by:** brutalism, editorial-poster, statement landings.

```
┌────────────────────────────────────────────────────┐
│                                                     │
│  NO                                                 │
│  EXCUSES                                            │
│  ONLY                                               │
│  RESULTS                                            │
│                                                     │
│                                       BUILDING ABSOLUTE
│                                       STRENGTH & ENDURANCE │
└────────────────────────────────────────────────────┘
```

**Anatomy:**
- Single dominant block of stacked UPPERCASE words. Each on its own line.
- Color contrast within the stack (1–2 words in accent, rest in primary).
- Tiny supporting label in the opposite corner of the negative space.

**The ONE move:** Type fills 60%+ of the viewport width. Letters touch the safe-area edges (1–2vw margin). This is intentional, not careless.

**Dimensions:**
- Font size: `clamp(80px, 18vw, 280px)` — ultra-display
- Font weight: 800–900 (Bricolage Grotesque, Druk, or similar)
- Line-height: 0.85 (yes, that tight)
- Letter-spacing: -0.04em
- Tracking variation by line is OK (line 1 -0.04, line 2 -0.05) for poster feel
- Background: solid `--ts-bg-body`; accent words use `--ts-accent`
- Text alignment: left (right or center is too magazine-y)

**WCAG note:** at 18vw the type is huge — `text-wrap: balance` and reduced-motion fades are friend not foe.

---

## §6 · The Bento Grid

**Used by:** product landings, "everything we do" sections.

```
┌──────────────────┬──────────────┐
│                  │              │
│    HERO TILE     │  TALL TILE   │
│      8×2         │     4×2      │
│                  │              │
├────────┬─────────┴──────┬───────┤
│ TILE   │      TILE      │  T    │
│ 3×1    │      5×1       │  3×1  │
└────────┴────────────────┴───────┘
```

**Anatomy:**
- 12-column grid, dense packing (`grid-auto-flow: dense`)
- Tiles span varied columns and rows (8×2, 4×2, 6×1, 3×1, etc.)
- ONE tile dominates (the hero, 8×2 or 12×1)
- Each tile is self-contained: title + visual element OR title + body

**The ONE move:** The hero tile is **at least 2× the area** of any other tile. Without a clear hero, the bento reads as a collage instead of a hierarchy.

**Dimensions:**
- Grid gap: sp-6 (24px)
- Grid-auto-rows: minmax(180px, auto)
- Tile padding: sp-6 (small/medium tiles) or sp-8 (hero tile)
- Tile background: varies per tile (bg-1, bg-2, accent surface) but always 2-3 distinct values
- Tile radius: `--ts-radius-md` consistently across all tiles
- Hero tile content: `align-content: end` for headline-bottom-left layout

→ Full markup in `references/03-layout-and-spacing.md` §5.2.

---

## §7 · The Product Showcase

**Used by:** e-commerce, beverage/food, fashion.

```
┌──────────────────────────────────────────────┐
│  NEW FLAVORS ARRIVED                          │
│                                               │
│  THE POWER             ┌──────────────────┐  │
│  OF BITES              │                  │  │
│                        │   product photo  │  │
│  Dive into our…        │   (rotated 6deg) │  │
│                        │                  │  │
│  [Shop Now] [View menu]│  ┌──[badge]──┐   │  │
│                        │  └──────────┘    │  │
│                        └──────────────────┘  │
└──────────────────────────────────────────────┘
```

**Anatomy:**
- Split: text left (5fr), product image right (7fr) — or reverse
- Product image is **rotated** slightly (3–6deg) for energy
- 1–2 floating badges (decorative, sticker-style) on top of the image

**The ONE move:** The rotation. A perfectly straight product photo on a landing looks like a catalog. 4 degrees of tilt + a soft shadow = "lifestyle."

**Dimensions:**
- Image rotation: rotate(-4deg) or rotate(6deg)
- Image shadow: large blurred shadow that doesn't rotate (`filter: drop-shadow(0 24px 48px rgba(0,0,0,0.2))`)
- Badge: position absolute, slight rotate(-12deg), padding sp-2 sp-3, bg accent or contrast, radius full
- Background: subtle accent-tinted (`background: color-mix(in srgb, var(--ts-accent), white 92%)`)

---

## §8 · The Featured Works Grid

**Used by:** agencies, portfolios, case-study indices.

```
┌──────────────────────────────────────────────────┐
│ FEATURED                We build beautiful and   │
│ WORKS                   functional websites…     │
│                                                   │
│                         [Explore works →]         │
├──────────────┬───────────────┬────────────────────┤
│              │               │                    │
│   Project    │   Project     │   Project          │
│   thumb 1    │   thumb 2     │   thumb 3          │
│              │               │                    │
│   OLDTECH    │   CREATIFY    │   MARQUIX          │
│   Tech       │   Design      │   New Tech         │
└──────────────┴───────────────┴────────────────────┘
```

**Anatomy:**
- Header: ultra-display title left (step 8), short description + CTA right (5:7 ratio)
- 3-column gallery below: each tile is a media card with hover scale + corner label

**The ONE move:** The header title is **vertically baseline-aligned with the description's first line** — so the giant title and the small description start at the same x-height. This requires negative margin on the title.

**Dimensions:**
- Title: step 8 (69px) or larger via `clamp(48px, 8vw, 96px)`
- Description: step 0 (16px), max-width 36ch
- Tile aspect-ratio: 4/3 or 1/1
- Tile hover: `transform: translateY(-4px); box-shadow: shadow-3`

---

## §9 · The Restraint Hero (premium / luxury)

**Used by:** luxury brands, premium SaaS, editorial newsletters.

```
┌────────────────────────────────────────────────────┐
│                                                     │
│                                                     │
│                                                     │
│                                                     │
│           Tell your story with warmth               │
│                  and clarity.                        │
│                                                     │
│        An editorial platform designed for long-     │
│        form reading and thoughtful writing.         │
│                                                     │
│              [Start your journal]  [Read manifesto] │
│                                                     │
│                                                     │
│                                                     │
└────────────────────────────────────────────────────┘
```

**Anatomy:**
- 80%+ whitespace. Content occupies the middle 40% vertically.
- Headline uses a **serif** display (Instrument Serif, Fraunces) with **italic** for one word
- Body: humble, sans-serif, weight 400, color `--ts-text-secondary`
- CTAs: black/inverted primary + outline secondary

**The ONE move:** The italic word in the headline (`Tell your story with *warmth*`). A single italic in serif = "we have taste." Don't overdo it; one italic per page.

**Dimensions:**
- Headline: step 6-7 (48–57px), serif, weight 500 (NOT 700 — restraint)
- Body max-width: 50ch, centered
- Background: light preset (light-warm-paper-v2 is the gold standard here)
- Vertical centering: `min-height: 80vh; align-content: center`

---

## §10 · The Lopsided News Feed

**Used by:** news, content aggregators, feed-based products.

```
┌─────────────────────────────────────────────────────────┐
│ Home | My Feed ▾ | Lopsided | Local News               │
├─────────────────────────────────────────────────────────┤
│  Lopsided   Stories disproportionately reported…        │
├────────────────────────────────┬────────────────────────┤
│ ┌──────────┐  ┌──────────┐    │  ┌──────────────────┐ │
│ │ tile 1   │  │ tile 2   │    │  │ Daily Index       │ │
│ │ [|||]    │  │ [|||]    │    │  │ 124 LEFT 112 RIGHT│ │
│ └──────────┘  └──────────┘    │  │                   │ │
│ ┌──────────┐  ┌──────────┐    │  │ AI Summary panel  │ │
│ │ tile 3   │  │ tile 4   │    │  │ ─────             │ │
│ │ [|||]    │  │ [|||]    │    │  │                   │ │
│ └──────────┘  └──────────┘    │  └──────────────────┘ │
└────────────────────────────────┴────────────────────────┘
```

**Anatomy:**
- 12-column grid: 9 cols for main feed, 3 cols for sticky sidebar
- Feed: 2-column tiles with colored bias bars (visual data primitive)
- Sidebar: vertical stack of summary cards, sticky positioning

**The ONE move:** The bias bars (small horizontal segmented bars under each story). They're a data primitive that becomes the brand signature. Find one such primitive per product and use it everywhere.

**Dimensions:**
- Feed gap: sp-4 (16px) — denser than marketing
- Tile padding: sp-4
- Bias bar height: 6px, full-width below the image, segmented
- Sidebar width: 320–360px, sticky with `top: 80px`

---

## Cross-cutting moves (work on any pattern)

These additions elevate any of the 10 patterns above:

### A. The accent glow
```css
.ts-section--glow {
  position: relative;
  isolation: isolate;
}
.ts-section--glow::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: radial-gradient(
    ellipse 60% 50% at 50% 0%,
    color-mix(in srgb, var(--ts-accent), transparent 80%) 0%,
    transparent 70%
  );
  pointer-events: none;
}
```

### B. The grain texture
```css
.ts-grain {
  position: relative;
}
.ts-grain::before {
  content: '';
  position: absolute; inset: 0;
  background-image: var(--ts-grain);     /* SVG noise data URI */
  background-size: 200px;
  opacity: 0.5;
  mix-blend-mode: soft-light;
  pointer-events: none;
}
```

### C. Staggered reveal on load
```css
.ts-reveal { opacity: 0; transform: translateY(8px); }
.ts-reveal.is-in {
  opacity: 1; transform: none;
  transition: opacity 600ms var(--ts-ease-out), transform 600ms var(--ts-ease-out);
  transition-delay: calc(var(--i, 0) * 80ms);
}
```

```html
<h1 class="ts-reveal" style="--i: 0">…</h1>
<p  class="ts-reveal" style="--i: 1">…</p>
<div class="ts-reveal" style="--i: 2">…</div>
```

### D. The custom cursor (use SPARINGLY)
```css
@media (pointer: fine) {
  body { cursor: none; }
  .ts-cursor {
    position: fixed; pointer-events: none;
    width: 16px; height: 16px;
    border-radius: 50%;
    background: var(--ts-accent);
    transform: translate(-50%, -50%);
    mix-blend-mode: difference;
    transition: transform 100ms var(--ts-ease-out);
  }
}
```

JS: track pointer → translate `.ts-cursor`. Scale up on interactive hover.

---

## The award-grade checklist

For any pattern above, before declaring it ready:

- [ ] **One dominant element** holds 50%+ of the visual weight.
- [ ] **White space** is intentional — at least one large empty region.
- [ ] **Typography hierarchy** uses ≥ 3 step gap between primary and secondary text.
- [ ] **Color** uses accent + 1 neutral scale. No third color unless triadic system.
- [ ] **One micro-detail** (grain, glow, cursor, reveal) — not all four.
- [ ] **Imagery** is full-quality or doesn't exist. No tiny stock photos.
- [ ] **Motion** orchestrated as one event (page load), not scattered micro-interactions.
- [ ] **APCA contrast** passes (run generator).
- [ ] **Reduced motion** alternative works.
- [ ] **Mobile** is not an afterthought — re-walk all checks at 360px width.

10/10 = ship. 8/10 = iterate. < 8 = pattern was wrong choice, restart.
