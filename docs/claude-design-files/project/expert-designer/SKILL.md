---
name: expert-designer
version: 6.0.0
description: >
  Toolskin design-system implementer. Agents become instant experts in Toolskin token
  use, typography ladders, harmonic spacing, card/container anatomy, and Awwwards-grade
  layout patterns. Trigger on ANY visual output: pages, cards, sections, components,
  CSS, design tokens, type pairing, color palettes, dark/light mode, responsive layouts,
  WordPress/Enfold, dashboards, hero sections, landing pages, badges, buttons, forms,
  panels, navbars, footers, marketing assets. Also trigger on words: token, theme,
  accent, surface, palette, hierarchy, scale, ratio, density, grid, gap, padding,
  radius, shadow, motion, ease, --ts-*, oklch, APCA, contrast, container query,
  bento, awwwards.

  This skill replaces ad-hoc design decisions with a deterministic decision protocol
  rooted in `generate-colors.js` (color truth), a locked 1.200 type ladder, an 8pt
  spatial grid, and ten card/container recipes that don't break. Use it BEFORE
  writing any HTML, CSS, or token.
license: MIT
---

# Expert Designer — Toolskin (v6)

> **Stop guessing. Look it up.** This skill exists because design taste alone produces
> inconsistent output. Toolskin already has a deterministic color engine; this skill
> extends that determinism to type, space, shape, and layout. Every decision below
> resolves to a number, a token, or a named recipe.

---

## 0 · How agents use this skill

```
┌─ READ THIS FILE FIRST ────────────────────────────────────┐
│  1. Identify the task class (§1)                          │
│  2. Open the matching reference from the router (§2)      │
│  3. Resolve every choice via the decision trees (§3)      │
│  4. Run the verification checklist before completing (§7) │
└───────────────────────────────────────────────────────────┘
```

**Do NOT** invent numbers, pick fonts from memory, write hex colors, or use
`!important`. Every value must trace back to a `--ts-*` token, the generator,
or a recipe in this skill.

---

## 1 · Task classifier

Map the user's ask to ONE task class. Each class has a fixed entry point.

| If the task is… | Class | Entry point |
|---|---|---|
| New page / hero / landing | **PAGE** | `references/05-awwwards-patterns.md` |
| Card, panel, dashboard tile | **CARD** | `references/04-cards-and-containers.md` |
| Type pairing, hierarchy, scale | **TYPE** | `references/02-typography.md` |
| Palette / dark+light mode / theme | **COLOR** | `references/01-foundation.md` + `scripts/generate-colors.js` |
| Grid, gap rhythm, responsive layout | **LAYOUT** | `references/03-layout-and-spacing.md` |
| Button, input, badge, chip | **COMPONENT** | `references/06-component-recipes.md` |
| WordPress/Enfold shortcodes | **ENFOLD** | Toolskin bridge in `references/01-foundation.md` §7 |
| "Is this design ok?" / review | **REVIEW** | Run `scripts/audit-design.mjs` |

---

## 2 · Reference router (read ONLY what you need)

```
references/
├── 01-foundation.md          ← Color engine, surfaces, APCA, ts- prefix rules
├── 02-typography.md          ← The 1.200 ladder, pairings, line-heights, clamp recipes
├── 03-layout-and-spacing.md  ← 8pt grid, container budgets, gap rhythm, container queries
├── 04-cards-and-containers.md← 10 unbreakable card recipes (anatomy + grid + states)
├── 05-awwwards-patterns.md   ← Hero, bento, asymmetric, magazine, dashboard patterns
└── 06-component-recipes.md   ← Buttons, inputs, badges, navs, footers (CSS ready)
```

**Rule:** open at most TWO references per task. If you need three, you've misclassified.

---

## 3 · The four locked systems

These are not suggestions. They are the constants of every Toolskin output.

### 3.1 Color — `generate-colors.js` is the only source of truth

- **Surfaces & text:** never invent. Pull from one of 10 curated `TOOLSKIN_SURFACE_PRESETS`
  (5 dark + 5 light). Default pair: `dark-practical-neutral-v1` + `light-practical-clean-v1`.
- **Accent:** one HSL triple → everything derives. Change only `--ts-accent-h / -s / -l`.
- **On-accent ink:** computed by relative-color formula
  `oklch(from var(--ts-accent) clamp(0, (0.75 - l) * 999, 1) 0 0)`. Never hardcode white/black on accent.
- **APCA gate:** primary ≥ Lc 75, secondary ≥ Lc 45, muted ≥ Lc 25 on `--ts-bg-body`.
  Run `node scripts/generate-colors.js` — exit code 1 if any pair fails.
- **NEVER** write a hex value into a component. NEVER use a `--ts-bg-*` to color text.

Full color spec → **`references/01-foundation.md`**.

### 3.2 Type — the 1.200 modular ladder, anchored at 16px

```
--ts-fs-base : 16px       (1rem)
--ts-fs-ratio: 1.200      (minor third — the locked default)

step  size      role                    line-height  letter-spacing
 -2   11.11px   micro / overline         1.4          +0.08em
 -1   13.33px   small / caption          1.45         +0.02em
  0   16.00px   body                     1.5           0
  1   19.20px   lead / subtitle          1.45          0
  2   23.04px   h5                       1.35         -0.005em
  3   27.65px   h4                       1.3          -0.01em
  4   33.18px   h3                       1.25         -0.015em
  5   39.81px   h2                       1.2          -0.02em
  6   47.78px   h1                       1.15         -0.025em
  7   57.33px   display sm               1.1          -0.03em
  8   68.80px   display md               1.05         -0.035em
  9   82.55px   display lg / hero        1.0          -0.04em
```

**Fluid form (use for steps ≥ 4):**
```css
font-size: clamp(<min>, <min>px + (<max>-<min>) * ((100vw - 480px) / (1280 - 480)), <max>);
```
Or simpler: `clamp(<min>, calc(<min>px + 2vw), <max>)` for hero text.

**Pairing rule:** 1–2 families max. Heading from §2 of typography reference; body from §3.
Mono only when there is real code/numbers on screen. **NEVER** use Inter / Roboto / Arial as a default — pick from `font-catalog.md`.

Full type spec → **`references/02-typography.md`**.

### 3.3 Space — the 8pt grid + 4pt sub-grid

```
--ts-sp-base: 4px
--ts-sp-1  =  4px        ← hairline gap (badges, icon-text)
--ts-sp-2  =  8px        ← compact (input padding inline)
--ts-sp-3  = 12px        ← form rows, list items
--ts-sp-4  = 16px        ← default block padding, card inner gap
--ts-sp-5  = 20px        ← (rarely — only for input height = 50)
--ts-sp-6  = 24px        ← card padding (default), section header gap
--ts-sp-8  = 32px        ← section inner gap, card padding (spacious)
--ts-sp-10 = 40px        ← (rarely)
--ts-sp-12 = 48px        ← block-to-block on landing
--ts-sp-16 = 64px        ← section gap (mobile)
--ts-sp-20 = 80px        ← section gap (tablet)
--ts-sp-24 = 96px        ← section gap (desktop max)

--ts-section-pad: clamp(4rem, 8vw, 9rem)   (use this for <section> padding)
--ts-container-pad: clamp(1rem, 5vw, 4rem) (use this for left/right gutters)
```

**The rhythm rule:** padding of a container ≥ gap of its children. A card with
`padding: 24px` has children gap ≤ 24px. Breaking this rule = visual collapse.

**Container budget:** `--ts-container-lg: 1280px` (default), `xl: 1520px` (cinematic),
`md: 960px` (article), `sm: 640px` (form). Never wider than `xl` for body content;
full-bleed sections only for backgrounds/imagery.

Full layout spec → **`references/03-layout-and-spacing.md`**.

### 3.4 Shape — radius and shadow ladders

```
--ts-radius-base: 10px      (one knob — change to retheme every corner)
--ts-radius-xs:    3px      (chips, badges)
--ts-radius-sm:    5px      (buttons, inputs)
--ts-radius-md:   10px      (cards default)
--ts-radius-lg:   14px      (panels, modals)
--ts-radius-xl:   20px      (featured / hero cards)
--ts-radius-full: 9999px    (pills, avatars)

--ts-shadow-1: subtle           (raised surfaces, no hover)
--ts-shadow-2: card             (cards default)
--ts-shadow-3: float            (dropdowns, popovers)
--ts-shadow-4: dramatic         (modals, hero CTA)
--ts-shadow-accent: accent glow (CTA only, sparingly)
```

**Rule:** radius scales with size. A 40px button gets `--ts-radius-sm`; a 320px-tall
card gets `--ts-radius-lg`. Pills only for things smaller than 48px tall.

---

## 4 · Decision trees (the anti-doubt protocol)

When in doubt, walk the tree. Do not deliberate — execute.

### 4.1 "Which font for this project?"
```
Brand mood?
├─ Editorial / luxury / long-form → Heading: Instrument Serif | Body: Source Serif 4
├─ Tech / SaaS / dashboard       → Heading: Clash Display     | Body: Space Grotesk
├─ Friendly / consumer / playful → Heading: Cabinet Grotesk   | Body: General Sans
├─ Brutalist / editorial-poster  → Heading: Bricolage Grotesque| Body: Switzer
├─ Default (no signal)           → Heading: Space Grotesk     | Body: Space Grotesk
└─ Mono needed                   → JetBrains Mono (always)
```

### 4.2 "Which type step for this element?"
```
Hero h1, single screen ........ step 7-9 (clamp 48→80px)
Section title h2 .............. step 5-6 (clamp 36→48px)
Card title h3 ................. step 3   (28px)
Subheading / lead ............. step 1   (19px)
Body ......................... step 0   (16px)
Caption / meta ............... step -1  (13px)
Overline / badge ............. step -2 UPPERCASE +0.08em (11px)
```

### 4.3 "How much padding on this thing?"
```
Element width      Padding (inline / block)
< 100px            sp-2  / sp-2   ( 8 /  8)
100–240px          sp-3  / sp-3   (12 / 12)   ← buttons, chips
240–480px          sp-4  / sp-4   (16 / 16)   ← inputs, small cards
480–800px          sp-6  / sp-6   (24 / 24)   ← standard cards, modals
> 800px            sp-8  / sp-8   (32 / 32)   ← hero cards, panels
Full-bleed section sp-section/sp-section (clamp 4rem→9rem)
```

### 4.4 "Light or dark default?"
```
Tech / dev tools / dashboard / AI ........ dark-practical-neutral-v1
Editorial / publication / luxury ........ light-practical-clean-v1
Marketing landing (single hero) ........ dark + light tweak ready
WordPress / Enfold ..................... dark-practical-neutral-v1
```

### 4.5 "Awwwards-grade — what's the ONE move that makes this great?"
```
Have a hero?     → ONE oversized type element + 90% whitespace
Have a card grid?→ Break the symmetry: one card spans 2 (bento)
Have a list?     → Negative letter-spacing on heads, +0.08em on overlines
Have an image?   → Edge-to-edge crop OR floating with shadow-4; never half measures
Have ≥3 colors?  → You have too many. Cut to accent + 1 neutral scale.
```

Full decision flow → **`references/06-decision-trees.md`** (if present).

---

## 5 · The unbreakable layout primer

Three patterns cover 90% of layouts. Memorize them.

### 5.1 The auto-fit card grid (never breaks)
```css
.ts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: var(--ts-sp-6);
}
```
The `min(100%, 280px)` prevents single-column overflow on narrow screens.
`minmax(0, 1fr)` (or this min() variant) is **mandatory** — `1fr` alone overflows on long content.

### 5.2 The pinned-footer card (header-body-footer)
```css
.ts-card {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100%;
  padding: var(--ts-sp-6);
  gap: var(--ts-sp-4);
  background: var(--ts-card-bg, var(--ts-bg-2));
  border: 1px solid var(--ts-border-1);
  border-radius: var(--ts-radius-md);
}
```
Cards in the same row are equal height **only** with `align-items: stretch` (the grid default)
AND every card uses this template. Mixed templates = jagged row.

### 5.3 The editorial split (asymmetric, magazine-grade)
```css
.ts-split {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);   /* or 2fr 3fr */
  gap: clamp(var(--ts-sp-6), 4vw, var(--ts-sp-16));
  align-items: start;
}
@media (max-width: 768px) { .ts-split { grid-template-columns: 1fr; } }
```
Asymmetric ratios (2:3, 3:5, 5:7) read as designed; 50/50 reads as default.

Full layout cookbook → **`references/03-layout-and-spacing.md`** §4.

---

## 6 · Hard guardrails (NEVER, under any pressure)

1. **NEVER hardcode a color.** Always `var(--ts-*)`. Use `generate-colors.js` to add new colors.
2. **NEVER use `!important`** to fix integration. Fix specificity or use `@layer`.
3. **NEVER nest `--ts-*` prefixes** with another (e.g. `--brand-ts-x`). The namespace is sacred.
4. **NEVER pick a font from memory.** Open `references/02-typography.md` §2-§3.
5. **NEVER use Inter / Roboto / Arial / system-ui** as a primary chosen font. They're fallbacks only.
6. **NEVER skip the APCA gate.** If `generate-colors.js` exits 1, the palette is rejected.
7. **NEVER use `1fr` without `minmax(0, …)`** in a grid that holds text or images.
8. **NEVER use `vh`** on full-height containers — use `dvh` (mobile safe).
9. **NEVER use raw `#hex` on accent ink.** Use the relative-color clamp formula.
10. **NEVER write a number that isn't a token.** If it doesn't exist, add it to the system first.

---

## 7 · Verification checklist (run before declaring done)

```bash
# 1. Color contrast
node scripts/generate-colors.js     # exit 0 required

# 2. Design audit (lints HTML/CSS for system violations)
node scripts/audit-design.mjs <file.html>

# 3. Project health
bash scripts/health-check.sh
```

**Manual checks** (the agent does these):
- [ ] Every color comes from a `var(--ts-*)`.
- [ ] No `!important` introduced.
- [ ] All text on a surface meets APCA primary/secondary/muted bands.
- [ ] Touch targets ≥ 44px (WCAG 2.2 AA `:focus-visible` visible).
- [ ] Grid uses `minmax(0, ...)` or `minmax(min(100%, ...), 1fr)`.
- [ ] Cards in the same row share the SAME recipe (§5.2).
- [ ] Type scale stays on the 1.200 ladder (§3.2). No off-ladder px values.
- [ ] Padding ≥ gap (the rhythm rule, §3.3).
- [ ] Hero has one oversized element + 90% whitespace.
- [ ] Reduced-motion media query respected.

If any item fails: STOP, fix it, re-verify. Do not ship partial.

---

## 8 · Working with the user

When the user asks for something visual:

1. **Classify** (§1). State the class in one short sentence.
2. **Open** at most two references (§2). Do not invent.
3. **Walk** the decision trees (§4) out loud — show the path you took.
4. **Build** using the locked systems (§3) and primer (§5).
5. **Verify** (§7).
6. **Hand off** with: the class, the recipes used, the tokens introduced (none, ideally),
   and the audit report.

When the user says "make it more X" (bolder, softer, premium, playful):

- Bolder    → step +1 on h1 + heavier weight (700→900) + tighter letter-spacing (-0.005em)
- Softer    → step −1 on h1 + lighter weight (700→500) + +1 on line-height + radius +1 step
- Premium   → cut color count, max whitespace, swap heading font to serif, slow motion (350ms)
- Playful   → radius +2 steps, increase saturation `--ts-accent-s` by 10%, add ts-grain

Do not invent new dials. The eight above cover it.

---

## 9 · What this skill replaces

This skill replaces and supersedes:
- The 67 `typeui-haul/skills/*/SKILL.md` files (they were generic prompts, not tools).
- The v5 `expert-designer/SKILL.md` (essay form, too long, no decision protocol).
- Ad-hoc color, type, and spacing choices.

It does NOT replace:
- `generate-colors.js` — kept verbatim; this skill calls into it.
- `toolskin.css` / `toolskin-extras.css` — the runtime token system.
- The Toolskin Pitchdeck — that's content, not a skill.

---

## 10 · Quick-start: building a new page right now

```
1. node scripts/generate-colors.js                    (verify colors)
2. cp templates/seed-page.html my-page.html           (clean Toolskin starter)
3. Pick a hero pattern from references/05-awwwards-patterns.md §1
4. Pick a card recipe from references/04-cards-and-containers.md
5. Drop in real content (no lorem ipsum past first draft)
6. node scripts/audit-design.mjs my-page.html         (lint)
7. Manual checklist (§7)
8. Ship.
```

Total time for a competent agent: 20–40 minutes for a landing page. If it's
taking longer, you're inventing instead of looking up. Stop and re-read this file.
