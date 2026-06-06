# 04 · Cards & Containers — Ten Recipes That Don't Break

> The card is the workhorse of UI. Get the card right and 60% of any design is done.
> These ten recipes are copy-paste, locked, and tested. Pick one — do not invent.

---

## How to read this reference

Each recipe specifies:
- **Anatomy** — the slots and their roles
- **Dimensions** — padding, gap, radius, min-height
- **Tokens used** — every `--ts-*` referenced
- **HTML** — canonical markup (with semantic landmarks)
- **CSS** — full styles, ready to drop in
- **States** — default, hover, focus-visible, active, disabled, loading, error
- **Pitfalls** — what breaks this card

---

## Recipe 0 · The Base Card (`.ts-card`)

The atom. All other recipes inherit from this.

```
┌─────────────────────────────────────┐   padding: 24
│  HEADER (auto)                       │
│  ─────────────────────              │
│                                      │   gap: 16
│  BODY (1fr — grows)                  │
│                                      │
│  ─────────────────────              │   gap: 16
│  FOOTER (auto)                       │
└─────────────────────────────────────┘
```

```css
.ts-card {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100%;
  padding: var(--ts-sp-6);
  gap: var(--ts-sp-4);
  background: var(--ts-card-bg, var(--ts-bg-2));
  border: 1px solid var(--ts-card-border, var(--ts-border-1));
  border-radius: var(--ts-radius-md);
  box-shadow: var(--ts-shadow-1);
  color: var(--ts-text-primary);
  transition: border-color var(--ts-dur-base) var(--ts-ease-out),
              transform     var(--ts-dur-base) var(--ts-ease-out),
              box-shadow    var(--ts-dur-base) var(--ts-ease-out);
}
.ts-card__title { font-size: var(--ts-fs-h4); line-height: var(--ts-lh-snug); letter-spacing: var(--ts-tracking-tight); font-weight: 600; }
.ts-card__meta  { font-size: var(--ts-fs-caption); color: var(--ts-text-secondary); }
.ts-card__body  { color: var(--ts-text-primary); }
.ts-card__footer{ display: flex; gap: var(--ts-sp-3); align-items: center; }
```

**Hover (interactive cards only):**
```css
.ts-card--interactive:hover {
  border-color: var(--ts-border-2);
  transform: translateY(-2px);
  box-shadow: var(--ts-shadow-2);
}
.ts-card--interactive:focus-visible {
  outline: 2px solid var(--ts-accent);
  outline-offset: 2px;
}
```

**Pitfalls:**
- ❌ Removing `min-height: 100%` → cards in a row mismatch heights.
- ❌ Using `flex-direction: column` → footer doesn't pin. Use the grid.
- ❌ Box-shadow on every card → noisy. Default is shadow-1; only featured gets more.

---

## Recipe 1 · The Stat Card (`.ts-card--stat`)

Dashboard tile with eyebrow → metric → delta.

```html
<article class="ts-card ts-card--stat">
  <p class="ts-card__eyebrow">Monthly Recurring Revenue</p>
  <div class="ts-card__metric">$248,400</div>
  <div class="ts-card__delta ts-card__delta--up">
    <svg width="12" height="12">…</svg> +12.4% vs last month
  </div>
</article>
```

```css
.ts-card--stat {
  gap: var(--ts-sp-2);
  padding: var(--ts-sp-6);
}
.ts-card__eyebrow {
  font-size: var(--ts-fs-caption);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: var(--ts-tracking-wider);
  color: var(--ts-text-secondary);
}
.ts-card__metric {
  font-size: var(--ts-fs-h2);
  font-weight: 700;
  line-height: var(--ts-lh-tight);
  letter-spacing: var(--ts-tracking-tight);
  font-feature-settings: "tnum" 1, "lnum" 1;   /* tabular figures */
}
.ts-card__delta {
  font-size: var(--ts-fs-caption);
  display: inline-flex;
  align-items: center;
  gap: var(--ts-sp-1);
}
.ts-card__delta--up   { color: var(--ts-success); }
.ts-card__delta--down { color: var(--ts-danger); }
```

**Pitfalls:**
- ❌ Proportional figures → numbers jitter between widths. **`tnum`** is mandatory.
- ❌ Metric below 28px → loses the "headline" feel. Stay step 4+ (33px+).

---

## Recipe 2 · The Feature Card (`.ts-card--feature`)

Icon + title + description. The marketing workhorse.

```html
<article class="ts-card ts-card--feature">
  <div class="ts-card__icon"><svg>…</svg></div>
  <h3 class="ts-card__title">Real-time collaboration</h3>
  <p class="ts-card__body">Multiplayer cursors and presence built-in. Your team sees changes the moment you make them.</p>
  <a class="ts-card__link" href="#">Learn more →</a>
</article>
```

```css
.ts-card--feature {
  padding: var(--ts-sp-8);
  gap: var(--ts-sp-4);
  grid-template-rows: auto auto 1fr auto;   /* icon, title, body, link */
}
.ts-card--feature .ts-card__icon {
  width: 48px; height: 48px;
  display: grid; place-items: center;
  background: var(--ts-accent-dim);
  color: var(--ts-accent);
  border-radius: var(--ts-radius-sm);
  margin-bottom: var(--ts-sp-2);
}
.ts-card--feature .ts-card__body {
  color: var(--ts-text-secondary);
  font-size: var(--ts-fs-body);
  line-height: var(--ts-lh-normal);
  max-width: 40ch;
}
.ts-card--feature .ts-card__link {
  color: var(--ts-text-accent);
  font-weight: 500;
  text-decoration: none;
}
```

**Pitfalls:**
- ❌ Icon background = solid accent → reads as button. Use `--ts-accent-dim` (12% accent).
- ❌ Body wider than 40ch → looks airy. Cap at 40ch in cards.

---

## Recipe 3 · The Media Card (`.ts-card--media`)

Image-led card. Image fills width, content sits below.

```html
<article class="ts-card ts-card--media">
  <figure class="ts-card__media">
    <img src="…" alt="…" loading="lazy">
  </figure>
  <div class="ts-card__inner">
    <p class="ts-card__meta">Article · 6 min read</p>
    <h3 class="ts-card__title">The radical return to minimal interfaces</h3>
    <p class="ts-card__body">A look at how the industry is stripping away shadows, gradients, and noise.</p>
  </div>
</article>
```

```css
.ts-card--media {
  padding: 0;                              /* image goes edge to edge */
  overflow: hidden;
  display: grid;
  grid-template-rows: auto 1fr;
}
.ts-card--media .ts-card__media {
  aspect-ratio: 16 / 9;
  margin: 0;
  overflow: hidden;
  background: var(--ts-bg-3);              /* skeleton */
}
.ts-card--media .ts-card__media img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform var(--ts-dur-slow) var(--ts-ease-out);
}
.ts-card--media:hover .ts-card__media img { transform: scale(1.04); }
.ts-card--media .ts-card__inner {
  padding: var(--ts-sp-6);
  display: grid;
  gap: var(--ts-sp-3);
}
```

**Pitfalls:**
- ❌ No `aspect-ratio` on the media slot → cards in a row misalign while images load.
- ❌ `object-fit: contain` → letterboxing. Always `cover` for cards.

---

## Recipe 4 · The Person Card (`.ts-card--person`)

Avatar + name + meta + bio. Team pages, profiles.

```html
<article class="ts-card ts-card--person">
  <img class="ts-card__avatar" src="…" alt="">
  <h3 class="ts-card__title">Duane J. Hobbs</h3>
  <p class="ts-card__meta">Design Engineer</p>
  <p class="ts-card__body">Crafts clean, user-centric digital experiences focused on minimal aesthetics and strong typography.</p>
</article>
```

```css
.ts-card--person {
  text-align: center;
  padding: var(--ts-sp-8) var(--ts-sp-6);
  gap: var(--ts-sp-2);
  grid-template-rows: auto auto auto 1fr;
}
.ts-card--person .ts-card__avatar {
  width: 96px; height: 96px;
  border-radius: var(--ts-radius-full);
  object-fit: cover;
  margin: 0 auto var(--ts-sp-2);
  border: 2px solid var(--ts-border-1);
}
.ts-card--person .ts-card__body {
  color: var(--ts-text-secondary);
  margin: var(--ts-sp-2) auto 0;
  max-width: 36ch;
}
```

**Pitfalls:**
- ❌ Avatar without explicit width/height → layout shift on load.
- ❌ Square avatar with `border-radius: 50%` and missing `object-fit` → image stretches.

---

## Recipe 5 · The Pricing Card (`.ts-card--price`)

Plan name + price + feature list + CTA. The conversion machine.

```html
<article class="ts-card ts-card--price ts-card--featured">
  <header class="ts-card__header">
    <p class="ts-card__eyebrow">Pro</p>
    <p class="ts-card__price">$29<span>/mo</span></p>
    <p class="ts-card__sub">Billed annually. $35/mo billed monthly.</p>
  </header>
  <ul class="ts-card__features">
    <li><svg>✓</svg> Unlimited projects</li>
    <li><svg>✓</svg> Real-time collaboration</li>
    <li><svg>✓</svg> Priority support</li>
  </ul>
  <footer class="ts-card__footer">
    <a class="ts-btn ts-btn--primary ts-btn--full" href="#">Start free trial</a>
  </footer>
</article>
```

```css
.ts-card--price {
  padding: var(--ts-sp-8);
  gap: var(--ts-sp-6);
}
.ts-card--price .ts-card__price {
  font-size: var(--ts-fs-h1);
  font-weight: 700;
  letter-spacing: var(--ts-tracking-tight);
  line-height: var(--ts-lh-tight);
  font-feature-settings: "tnum" 1;
}
.ts-card--price .ts-card__price span {
  font-size: var(--ts-fs-body);
  color: var(--ts-text-secondary);
  font-weight: 400;
  margin-inline-start: 4px;
}
.ts-card--price .ts-card__sub { color: var(--ts-text-muted); font-size: var(--ts-fs-caption); }
.ts-card--price .ts-card__features {
  list-style: none;
  padding: 0; margin: 0;
  display: grid;
  gap: var(--ts-sp-3);
}
.ts-card--price .ts-card__features li {
  display: grid; grid-template-columns: 16px 1fr; align-items: center;
  gap: var(--ts-sp-2);
}
.ts-card--featured {
  border-color: var(--ts-accent-border);
  box-shadow: var(--ts-shadow-3), 0 0 0 1px var(--ts-accent-border);
  position: relative;
}
.ts-card--featured::before {
  content: "Most popular";
  position: absolute;
  top: 0; left: var(--ts-sp-6);
  transform: translateY(-50%);
  font-size: var(--ts-fs-micro);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: var(--ts-tracking-wider);
  padding: 4px 10px;
  background: var(--ts-accent);
  color: var(--ts-on-accent);
  border-radius: var(--ts-radius-full);
}
```

**Pitfalls:**
- ❌ Equal-height pricing cards via `align-items: stretch` are not enough if feature
  lists differ. Add `min-height` to features grid to align CTAs across cards.
- ❌ Featured card gets a different padding → throws the row off. Same padding,
  different border/shadow only.

---

## Recipe 6 · The Testimonial Card (`.ts-card--quote`)

Quote + attribution. Social proof.

```html
<figure class="ts-card ts-card--quote">
  <svg class="ts-card__mark">"</svg>
  <blockquote class="ts-card__quote">
    The only project management tool that feels like a Risograph print.
    Fast, colorful, and completely unforgettable.
  </blockquote>
  <figcaption class="ts-card__attribution">
    <img src="…" alt="" class="ts-card__avatar-sm">
    <div>
      <p class="ts-card__name">Alex Carter</p>
      <p class="ts-card__role">VP Engineering, Acme</p>
    </div>
  </figcaption>
</figure>
```

```css
.ts-card--quote {
  padding: var(--ts-sp-8);
  gap: var(--ts-sp-6);
  grid-template-rows: auto 1fr auto;
}
.ts-card--quote .ts-card__mark {
  width: 32px; height: 32px;
  color: var(--ts-accent);
  opacity: 0.35;
}
.ts-card--quote .ts-card__quote {
  font-family: var(--ts-font-display);
  font-size: var(--ts-fs-h4);
  line-height: var(--ts-lh-snug);
  letter-spacing: var(--ts-tracking-snug);
  margin: 0;
  text-wrap: balance;
  max-width: 50ch;
}
.ts-card--quote .ts-card__attribution {
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: var(--ts-sp-3);
  align-items: center;
}
.ts-card--quote .ts-card__avatar-sm {
  width: 40px; height: 40px;
  border-radius: var(--ts-radius-full);
  object-fit: cover;
}
.ts-card--quote .ts-card__name { font-weight: 600; }
.ts-card--quote .ts-card__role { font-size: var(--ts-fs-caption); color: var(--ts-text-secondary); }
```

**Pitfalls:**
- ❌ Italic quote → Toolskin doesn't use italic body. Use the display font upright.
- ❌ Massive quotation marks above the text → looks like a meme. Subtle accent mark only.

---

## Recipe 7 · The Action Card (`.ts-card--action`)

Title + summary + ONE primary CTA. The "Get started" card.

```html
<article class="ts-card ts-card--action">
  <div>
    <h3 class="ts-card__title">Ready to ship faster?</h3>
    <p class="ts-card__body">Set up your first project in under 60 seconds. No credit card required.</p>
  </div>
  <a class="ts-btn ts-btn--primary" href="#">Start free →</a>
</article>
```

```css
.ts-card--action {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: var(--ts-sp-8);
  padding: var(--ts-sp-8);
  background: var(--ts-bg-1);
  border-radius: var(--ts-radius-lg);
}
@container card (max-width: 560px) {
  .ts-card--action { grid-template-columns: 1fr; }
}
```

**Pitfalls:**
- ❌ Two CTAs side-by-side → user must choose. One card = one action.
- ❌ Stack on mobile → set `container-type: inline-size` on parent and use container query.

---

## Recipe 8 · The List Card (`.ts-card--list`)

A card whose body IS a list (e.g. recent activity, notifications).

```html
<article class="ts-card ts-card--list">
  <header class="ts-card__header">
    <h3 class="ts-card__title">Recent deployments</h3>
    <a class="ts-card__link" href="#">View all</a>
  </header>
  <ul class="ts-card__list">
    <li class="ts-card__row">
      <span class="ts-badge ts-badge--success">Ready</span>
      <span>Update landing page hero</span>
      <span class="ts-card__meta">2m ago</span>
    </li>
    <li class="ts-card__row">…</li>
  </ul>
</article>
```

```css
.ts-card--list { padding: 0; }
.ts-card--list .ts-card__header {
  display: flex; justify-content: space-between; align-items: center;
  padding: var(--ts-sp-5) var(--ts-sp-6);
  border-bottom: 1px solid var(--ts-border-0);
}
.ts-card--list .ts-card__list {
  list-style: none; padding: 0; margin: 0;
}
.ts-card--list .ts-card__row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--ts-sp-3);
  align-items: center;
  padding: var(--ts-sp-3) var(--ts-sp-6);
}
.ts-card--list .ts-card__row + .ts-card__row {
  border-top: 1px solid var(--ts-border-0);
}
```

**Pitfalls:**
- ❌ Padding on `.ts-card` + padding on rows → double padding. Set card padding to 0
  and let rows own the gutter.
- ❌ `gap` on the list instead of borders → looks like a card stack, not a list.

---

## Recipe 9 · The Spotlight Card (`.ts-card--spotlight`)

Featured / hero card. Asymmetric layout, image-heavy, used as the lead of a grid.

```html
<article class="ts-card ts-card--spotlight">
  <figure class="ts-card__media"><img src="…" alt=""></figure>
  <div class="ts-card__content">
    <p class="ts-card__eyebrow">Editorial</p>
    <h2 class="ts-card__title">When you remove everything that isn't essential, what remains must be perfect.</h2>
    <p class="ts-card__body">A study in restraint, by the editor in chief.</p>
    <a class="ts-btn ts-btn--ghost" href="#">Read full story</a>
  </div>
</article>
```

```css
.ts-card--spotlight {
  padding: 0;
  display: grid;
  grid-template-columns: 5fr 7fr;     /* magazine ratio */
  min-height: 480px;
  border-radius: var(--ts-radius-lg);
  overflow: hidden;
}
.ts-card--spotlight .ts-card__media {
  margin: 0;
}
.ts-card--spotlight .ts-card__media img {
  width: 100%; height: 100%; object-fit: cover;
}
.ts-card--spotlight .ts-card__content {
  padding: var(--ts-sp-12);
  display: grid;
  gap: var(--ts-sp-4);
  align-content: end;                  /* content sinks to the bottom */
  background: var(--ts-bg-1);
}
.ts-card--spotlight .ts-card__title {
  font-family: var(--ts-font-display);
  font-size: var(--ts-fs-h2);
  line-height: var(--ts-lh-headline);
  letter-spacing: var(--ts-tracking-tight);
  text-wrap: balance;
}
@media (max-width: 768px) {
  .ts-card--spotlight { grid-template-columns: 1fr; min-height: 0; }
}
```

**Pitfalls:**
- ❌ Center-aligned content → kills the editorial feel. `align-content: end` reads as deliberate.
- ❌ 16:9 image but content side fills 4:3 area → mismatched heights. Set explicit `min-height`.

---

## Recipe 10 · The Glass Card (`.ts-card--glass`)

Translucent over a colorful background. Use sparingly — once per page, max.

```css
.ts-card--glass {
  background: color-mix(in srgb, var(--ts-bg-1), transparent 30%);
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  border: 1px solid color-mix(in srgb, currentColor, transparent 80%);
}
```

**Pitfalls:**
- ❌ Glass on a flat background → useless. Glass needs imagery/gradient behind it to read.
- ❌ Forgetting `-webkit-` prefix → broken on Safari.

---

## The card matrix (when to use which)

| Need | Recipe |
|---|---|
| Dashboard metric | 1 stat |
| Marketing feature | 2 feature |
| Article tile | 3 media |
| Team / profile | 4 person |
| Plan / tier | 5 price |
| Social proof | 6 quote |
| CTA banner | 7 action |
| Activity feed | 8 list |
| Lead of a grid | 9 spotlight |
| On a hero gradient | 10 glass |

If your need doesn't fit, you're inventing. Re-read the recipes; one will fit.

---

## Composition rules (multi-card layouts)

1. **Same row = same recipe.** Don't mix media + stat in one row.
2. **Same level = same shadow.** Floor cards get shadow-1; only featured gets shadow-2+.
3. **Equal heights = same min-height OR grid `align-items: stretch`.** Don't fight the row.
4. **Hover lift = 2px transform max.** More breaks the grid rhythm.
5. **One featured per row.** Two featured = neither is featured.

---

## The unbreakable test

For any card you build:

- [ ] Title and body align to grid rows, not to content height
- [ ] Footer pinned to bottom regardless of body length
- [ ] Padding consistent with `--ts-sp-*` (no raw px)
- [ ] Hover/focus-visible states defined and visible
- [ ] Works with text 5× longer than design
- [ ] Works with title 1 word vs 8 words (use `text-wrap: balance`)
- [ ] Doesn't overflow at 320px viewport
- [ ] Image (if any) uses `aspect-ratio` + `object-fit: cover`
- [ ] No `position: absolute` for layout (only for badges/marks)
- [ ] Tab order is logical (title → body → CTA)

All ten checked? Card is done.
