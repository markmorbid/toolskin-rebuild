---
name: expert-designer
version: 8.0.0
priority: 100
scope: design
description: >
  **AUTHORITATIVE DESIGN SKILL.** Invoked FIRST for any visual / UI / layout /
  styling / token / palette / hierarchy / spacing / component / page / hero /
  section task. Takes priority over all other design-related skills.

  This skill DOES NOT build, code, refactor, or implement features. It DESIGNS:
  selects the right pattern, assembles the right tokens, enforces the system.
  Implementation lives in OTHER skills. This skill's job is to ensure that
  every visual output respects the locked Toolskin design system — color,
  type, space, shape, composition — and produces award-grade layouts by
  picking from approved patterns rather than improvising.

  Trigger words: design, layout, page, hero, section, card, component, button,
  input, badge, nav, footer, modal, token, theme, accent, surface, palette,
  hierarchy, scale, ratio, density, grid, gap, padding, radius, shadow,
  typography, font, weight, tracking, motion, ease, dark mode, light mode,
  responsive, container query, bento, magazine, awwwards, --ts-*, oklch, APCA,
  contrast, mesh, glass, gradient, brutalist, editorial.
license: MIT
---

# Expert Designer — Toolskin (v8)

> **System-enforcing design intelligence.** Not a generator. Not a builder.
> A constraint engine. Reads the system, picks an approved pattern, fills
> the slots, audits the output, ships.

---

## 0 · Priority + scope contract

```
┌─ ACTIVATION ────────────────────────────────────────────────────────┐
│                                                                      │
│  This skill is INVOKED FIRST for any task involving:                 │
│    · a visual output (page, screen, slide, hero, section, card)      │
│    · token usage, palette work, theming                              │
│    · layout, grid, spacing, hierarchy decisions                      │
│    · component selection (button, input, nav, modal, etc.)           │
│    · review/audit of an existing visual                              │
│                                                                      │
│  This skill HANDS OFF to other skills when the task is:              │
│    · writing build scripts / CI / tooling                            │
│    · backend logic / data fetching / state                           │
│    · framework integration / SSR / hydration                         │
│    · pure code refactor with no visual change                        │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Behavior model:** senior system designer, not a generator.
- Does NOT improvise outside the system
- Does NOT produce arbitrary layouts
- ONLY assembles from approved patterns, defined templates, existing
  components, and system constraints
- REJECTS its own output if `audit-boring.mjs` or `audit-design.mjs` fails

If a task asks for something outside the approved pattern library, the
skill responds: "this is not in the approved patterns — choose from
\<list\>, or escalate to expand the library." It does not freelance.

---

## 1 · The mandatory flow (no exceptions)

```
STEP 0  Read ANTI-DEFAULT-PROTOCOL.md           ← FIRST, EVERY TIME
STEP 1  Classify the task (§2)
STEP 2  Pick a starter (§3) — FILL, do not design
STEP 3  Write the manifesto (§4) — before any HTML
STEP 4  Fill the starter's slots (§5) — do not redesign the layout
STEP 5  For ATOMIC/CHROME: read §14 + §15 — before any CSS
STEP 6  Run scripts/audit-boring.mjs   ← exits 1 on slop
STEP 7  Run scripts/audit-design.mjs   ← exits 1 on rule violations
STEP 8  Manual checklist (§9). Hand off.
```

**Skipping any step is rejected.** No design without manifesto. No HTML
without starter. No "done" without two clean audits.

---

## 2 · Task classifier

Every visual task maps to exactly one class. The class determines the starter.

| Task | Class | Mandatory starter |
|---|---|---|
| Marketing landing / product launch | **MKTG** | `starters/03-asymmetric-hero.html` |
| Multi-feature product / dashboard | **PRODUCT** | `starters/05-bento-landing.html` |
| Editorial / publication / long-form | **EDIT** | `starters/02-magazine-split.html` |
| Portfolio / agency / project index | **PORTFOLIO** | `starters/06-magazine-toc.html` |
| Statement landing / brutalist / poster | **POSTER** | `starters/04-oversized-type.html` |
| Single-message dev-tool launch | **DEV** | `starters/01-centered-hero.html` |
| Atomic component (button, card, input, badge) | **ATOMIC** | `references/04-cards-and-containers.md` + §14 + §15 |
| Nav / header / chrome (topbar, promo banner) | **CHROME** | `references/06-component-recipes.md` + §14 + §15 |
| Palette / theme / dark+light | **COLOR** | `scripts/generate-colors.js` + `references/01-foundation.md` |
| Type pairing / hierarchy / scale | **TYPE** | `references/02-typography.md` |
| Layout / grid / spacing / responsive | **LAYOUT** | `references/03-layout-and-spacing.md` |
| Review existing design | **REVIEW** | run BOTH audit scripts |

**There is no "design from scratch" class.** That was the v6.0 failure mode.

---

## 3 · The starter library (approved patterns)

The six starters in `starters/` are the entire approved set. Each one is a
working, rendered demonstration with `<!-- SLOT · description -->` markers
above every replaceable element. The agent's job is to **replace the default
content with real content** — never to redesign the layout, change the grid
ratios, alter the container widths, or invent new sections.

| Starter | Use when | Forbidden when |
|---|---|---|
| `01-centered-hero.html` | Single-message launch with one product | More than 3 features to show |
| `02-magazine-split.html` | Publication, editorial, content-heavy site | Product/SaaS marketing |
| `03-asymmetric-hero.html` ★ | **Default for marketing landings** | Pure editorial content |
| `04-oversized-type.html` | Statement / poster / brutalist brand moment | Anything requiring product detail |
| `05-bento-landing.html` ★ | **Default for products with 3+ features** | Editorial long-form |
| `06-magazine-toc.html` | Lists, indices, portfolios with 4+ items | Marketing with one CTA |

Stars (★) = pick this by default when in doubt. The asymmetric-hero and
bento-landing together cover ~80% of real-world product/marketing pages.

**Expanding the library requires explicit owner approval.** If none of the
six fit, escalate — don't invent a seventh inline.

---

## 4 · The mandatory manifesto

Before ANY HTML is produced, write this verbatim:

```
DESIGN MANIFESTO
────────────────
Task class:        <MKTG/PRODUCT/EDIT/PORTFOLIO/POSTER/DEV/...>
Starter:           starters/<filename>.html
The ONE move:      <the asymmetry / oversized / unusual choice you commit to>
What I will NOT do: <the safe default you're explicitly rejecting>
Reader's eye pivots at:  <element 1>, <element 2>
Container variation:     hero=<xl/lg/md>, section-A=<...>, section-B=<...>
Background variation:    section-A=bg-body, section-B=bg-1, section-C=accent
```

If any line cannot be filled in concrete terms, you have not designed yet.
Do not produce HTML. Re-read the starter and try again.

---

## 5 · The locked systems (quick reference)

Full specs in `references/01–06`. Memorize these constants — they don't change.

### 5.1 Color — three knobs, everything derives
```
--ts-accent-h / --ts-accent-s / --ts-accent-l   ← the only color knobs
--ts-bg-{body, 0..5}                            ← surfaces, never invented
--ts-text-{primary, secondary, muted, invert}   ← text roles, four only
--ts-on-accent                                  ← auto-contrast ink (relative-color)
```
**Color rule:** every color is `var(--ts-*)`. Never hex in components.
APCA must pass via `scripts/generate-colors.js`.

### 5.2 Type — 1.200 modular ladder, anchored at 16px
```
step -2  micro / overline (UPPERCASE +0.08em)
step -1  caption / meta
step  0  body
step  1  lead / subtitle
step  3  card title (h4)
step  4  section title (h3)
step  5  h2
step  6  h1
step  7+ display / hero
```
**Type rule:** never an off-ladder pixel value. Heading-from-memory is banned —
open `references/02-typography.md` and pick.

### 5.3 Space — 8pt grid, padding ≥ gap
```
--ts-sp-{1,2,3,4,6,8,12,16,24}   ← 4, 8, 12, 16, 24, 32, 48, 64, 96
--ts-section-pad / --ts-container-pad / --ts-block-gap   ← fluid clamp()
```
**Space rule:** the rhythm rule. A container's padding ≥ its children's gap.
Break this and the layout feels collapsed.

### 5.4 Shape — radius + shadow scale with element size
```
--ts-radius-{xs:3, sm:5, md:10, lg:14, xl:20, full:9999}
--ts-radius-constrained = min(var(--ts-radius-base), 6px)  ← chrome contexts
--ts-shadow-{1,2,3,4} + --ts-shadow-accent
```
**Shape rule:** radius scales with size. A 36px button gets sm; a 480px hero
card gets lg or xl. Pills only for things ≤ 48px tall.
**Chrome rule:** headers, chrome UI, and bars always use `--ts-radius-constrained`
so a large base radius never breaks small elements.

### 5.5 Surface containment (Satoshi's law)
> Surfaces apply to CARDS (with padding + radius + border) or FULL-WIDTH
> SECTIONS (edge-to-edge). They NEVER apply to contained sections — that
> creates a "floating colored square" against the body background.

If a section needs an alt surface, make the section full-bleed and put the
content in an inner container.

### 5.6 Icons — the `.ts-icon` system
```html
<span class="ts-icon ts-icon--md ts-icon--accent">
  <i class="fa-solid fa-bolt"></i>
</span>
```
Wrapper sized via `--ts-icon-size` (xs/sm/md/lg/xl). Glyph sits at 45% of
wrapper for optical centering. Backgrounds: `--accent`, `--solid`, `--ghost`,
`--muted`, `--success`, `--danger`. Font Awesome 6 free is the icon library.

---

## 6 · Anti-default protocol (the boring-detector contract)

`scripts/audit-boring.mjs` rejects ANY output containing:

1. No asymmetric grid (must have at least one `Nfr Mfr` with N≠M)
2. No multi-column grid (must have `repeat(auto-fit, ...)` or `repeat(12, ...)` somewhere)
3. Every section centered (max ONE centered section per page)
4. No varied grid-column spans (bento must have ≥3 distinct spans)
5. No font-size ≥ 56px or ≥ 6vw (must have ONE oversized element)
6. Only one background color used (must vary surfaces across sections)
7. Fewer than 3 unique padding values (rhythm collapse)

A page that doesn't trip those gates is **by construction** not a centered
vertical stack of identical cards.

---

## 7 · Token namespace (the `--ts-*` contract)

Every custom property MUST carry the `--ts-*` prefix. No exceptions.

```
✓  --ts-accent-h        --ts-card-bg        --ts-fs-h1
✗  --brand-primary      --color-bg-card     --spacing-md
```

Imported CSS (Enfold, WordPress, vendor) bridges TO Toolskin tokens through a
one-way mapping. The bridge consumes; the Toolskin tokens are the source.

---

## 8 · Hard guardrails (rejection conditions)

The skill REFUSES to produce output containing any of:

| # | Violation | Replacement |
|---|---|---|
| 1 | Hardcoded `#hex` color in component CSS | `var(--ts-*)` |
| 2 | `!important` declaration | Fix specificity or use `@layer` |
| 3 | `1fr` grid without `minmax(0, …)` | `minmax(min(100%, 280px), 1fr)` |
| 4 | Font picked from memory (Inter/Roboto/Arial as primary) | Pick from `references/02-typography.md` §2-§3 |
| 5 | `100vh` on a container | `100dvh` |
| 6 | White/black hardcoded on accent surface | `var(--ts-on-accent)` |
| 7 | Off-ladder font-size pixel value | nearest `--ts-fs-*` token |
| 8 | Off-grid padding pixel value | nearest `--ts-sp-*` token |
| 9 | `:hover` without `:focus-visible` | both states required |
| 10 | New layout invented outside the 6 starters | escalate, do not invent |
| 11 | Surface on a contained section | make full-bleed + inner container |
| 12 | Decorative element bleeding off-edge AND cropped | contain it, or make the crop deliberate |
| 13 | `--ts-this-bg` set on a child element | Set ONCE on the shell/root class only |
| 14 | Hardcoded `px` value inside `@media (max-width: …)` | Use `var(--ts-nav-collapse-at)` or build-time var |
| 15 | `--ts-radius-base` used in chrome/header/bar context | Use `--ts-radius-constrained` instead |

These rules are not suggestions. The audit scripts enforce them mechanically.

---

## 9 · Verification (the two-gate handoff)

```bash
node scripts/audit-boring.mjs <file.html>     # conviction ≥ 60 required
node scripts/audit-design.mjs <file.html>     # zero HARD failures required
```

Both must pass. Then walk the manual checklist:

- [ ] Manifesto is concrete (no vague "the ONE move").
- [ ] Every color is `var(--ts-*)`.
- [ ] Every spacing value is a `--ts-sp-*` token.
- [ ] Every font-size is on the 1.200 ladder.
- [ ] Hero has ONE oversized element (≥ 56px or ≥ 6vw).
- [ ] At least one asymmetric grid (`5fr 7fr` or similar).
- [ ] Surfaces alternate across sections (or all sections are full-bleed).
- [ ] `:focus-visible` defined wherever `:hover` is.
- [ ] Mobile viewport (360px) doesn't overflow.
- [ ] Reduced-motion media query respected.
- [ ] ATOMIC/CHROME: all 11 component patterns checked against §14.
- [ ] ATOMIC/CHROME: nesting discipline verified against §15.

Any "no" → reject, fix, re-audit.

---

## 10 · Reference router (read at most TWO per task)

```
references/
├── 01-foundation.md          Color engine, surfaces, APCA, --ts-* contract
├── 02-typography.md          1.200 ladder, font picks, hierarchy patterns
├── 03-layout-and-spacing.md  8pt grid, container budgets, layout primitives
├── 04-cards-and-containers.md  Ten card recipes (stat, feature, price, etc.)
├── 05-awwwards-patterns.md     Ten section patterns, the ONE move per pattern
└── 06-component-recipes.md     Buttons, inputs, badges, nav, footer, modal
```

If a task needs THREE references, the task is misclassified. Re-classify.

---

## 11 · When to escalate vs. produce

Produce immediately when:
- Task class is clear AND a starter exists for it AND content fits the slots

Escalate to owner when:
- Task asks for a pattern outside the six starters
- Task requires a token type that doesn't exist (a fifth text role, etc.)
- Audit-boring fails after re-trying a different starter
- User explicitly requests a "wild" / off-system creative direction

Escalation is not failure. Inventing instead of escalating IS failure.

---

## 12 · Working with other skills

| Other skill | Hand off when |
|---|---|
| Frontend implementation skill | After design is approved, to write framework code (React, Vue, etc.) |
| Build / tooling skill | After visual artifact is done, to wire CI / pre-commit / lints |
| Animation skill | When the design needs motion beyond CSS transitions |
| Content / copy skill | When real content needs writing past placeholder slots |
| Accessibility skill | When the design has interactive complexity beyond `:focus-visible` |

This skill OUTPUTS a designed HTML artifact. Other skills consume it.

---

## 13 · Quick-start recap

```
1. Read ANTI-DEFAULT-PROTOCOL.md (every time)
2. Classify (§2) → pick starter (§3)
3. Write manifesto (§4)
4. For ATOMIC/CHROME: read §14 + §15 first
5. Open starter, fill SLOT markers with real content
6. node scripts/audit-boring.mjs <file>
7. node scripts/audit-design.mjs <file>
8. Manual checklist (§9) — including §14/§15 items for components
9. Ship
```

Total time for a competent agent following this protocol: 20–40 minutes for
a landing page. Taking longer means inventing instead of looking up — stop
and re-read this file.

---

## 14 · Component CSS Architecture — Named Patterns

> These 11 patterns were extracted from the owner's hand-tuned nav component.
> Every pattern is a proved technique, not a suggestion. For ATOMIC and CHROME
> tasks, check each pattern before writing a line of CSS. If your component
> does not apply a pattern, write a comment explaining why — don't silently skip it.

---

### P-01 · Single-knob color dimming

**One alpha token controls ALL ink in a component.**

```css
.ts-nav-fixed {
  --ts-nav-text-alpha: 85%;   /* ← THE ONE KNOB */

  /* All ink derives from this: */
  --ts-nav-link-color:  color-mix(in oklab, var(--ts-text-primary), transparent calc(100% - var(--ts-nav-text-alpha)));
  --ts-nav-icon-color:  color-mix(in oklab, var(--ts-text-primary), transparent calc(100% - var(--ts-nav-text-alpha)));
  --ts-nav-border-color: color-mix(in oklab, var(--ts-on-surface-auto), transparent calc(100% - var(--ts-nav-text-alpha)));
}
```

**Rule:** never set individual alpha values on sub-elements. Raise or lower the
single knob token. The component's "loudness" is controlled from one place.

---

### P-02 · Harmonic icon-item sizing

**All icon controls derive width + height from one anchor (topbar height).**

```css
.ts-nav-fixed {
  --ts-topbar-h: 58px;                            /* ONE anchor */
  --ts-nav-icon-item-w: var(--ts-topbar-h);       /* width = height */
  --ts-nav-icon-item-h: calc(var(--ts-topbar-h) - 1px);  /* -1px: divider never overlaps border */
  --ts-nav-glyph-size:  calc(var(--ts-nav-icon-item-w) * 0.5); /* glyph = 50% of wrapper */
}
```

**Rule:** height is always `anchor − 1px`. This single offset prevents icon
control dividers from bleeding over the nav border at any size. Glyph is
always 50% of wrapper for optical centering.

---

### P-03 · Auto-inverting border via `--ts-on-surface-auto`

**Border resolves correctly on any surface with zero per-context overrides.**

```css
:root {
  /* The engine: mix the surface with its complement */
  --ts-on-surface-auto: color-mix(in oklab,
    var(--ts-this-bg, var(--ts-bg-body)),
    var(--ts-text-primary) 12%
  );
}

/* Usage — the border just works on any --ts-this-bg: */
.ts-nav-fixed {
  border-bottom: 1px solid var(--ts-on-surface-auto);
}
```

**Rule:** never write a per-component border color override. Set `--ts-this-bg`
(P-08) and `--ts-on-surface-auto` resolves automatically.

---

### P-04 · Constrained radius cap

**`--ts-radius-constrained` prevents a large `--ts-radius-base` from breaking chrome UI.**

```css
:root {
  --ts-radius-base: var(--ts-radius-md);   /* 10px — fine for cards */
  --ts-radius-constrained: min(var(--ts-radius-base), 6px); /* cap for chrome */
}

/* Usage in nav buttons / icon controls: */
.ts-nav-fixed .ts-btn {
  border-radius: var(--ts-radius-constrained);
}
```

**Rule:** any element inside a fixed header, toolbar, or chrome bar uses
`--ts-radius-constrained`, never `--ts-radius-base` or `--ts-radius-md` directly.
A user's 20px base radius should never make nav buttons look like pills.

---

### P-05 · Derivative spacing chain

**Change one multiplier — the whole component rescales.**

```css
.ts-nav-fixed {
  --ts-nav-scale: 1;                       /* THE multiplier */
  --ts-nav-pad-x: calc(var(--ts-sp-4) * var(--ts-nav-scale));  /* 16px base */
  --ts-nav-pad-y: calc(var(--ts-sp-2) * var(--ts-nav-scale));  /* 8px base */
  --ts-nav-gap:   calc(var(--ts-sp-2) * var(--ts-nav-scale));
}
/* Compact mode: */
.ts-nav-fixed.ts-nav--compact { --ts-nav-scale: 0.75; }
```

**Rule:** all internal spacing tokens are `calc(base × scale)`. Never declare
two independently-tuned pixel values next to each other in the same component.

---

### P-06 · Smart first/last button spacing

**Buttons mixed with navlinks need three selector fixes for correct spacing.**

```css
/* 1. First child: no left gap (the logo already provides it) */
.ts-nav-fixed__links > :first-child { margin-left: 0; }

/* 2. Button after a non-button: add left gap */
.ts-nav-fixed__links > :not(.ts-btn) + .ts-btn {
  margin-left: var(--ts-nav-gap);
}

/* 3. Button not followed by another button: no right gap (edge) */
.ts-nav-fixed__links > .ts-btn:not(:has(+ .ts-btn)) {
  margin-right: 0;
}
```

**Rule:** these three selectors are the complete set. Never use nth-child or
hardcoded margins per button. The spacing adapts as buttons are added/removed.

---

### P-07 · Nav-scoped motion override

**Motion tokens live inside the component block — never global.**

```css
/* ✓ Correct: scoped inside the component */
.ts-nav-fixed {
  --ts-nav-dur-fast: var(--ts-dur-fast, 150ms);
  --ts-nav-dur-base: var(--ts-dur-base, 250ms);
  --ts-nav-ease:     var(--ts-ease-out, cubic-bezier(0.16, 1, 0.3, 1));

  transition: background-color var(--ts-nav-dur-base) var(--ts-nav-ease),
              box-shadow        var(--ts-nav-dur-base) var(--ts-nav-ease);
}

/* Reduced motion: also scoped */
@media (prefers-reduced-motion: reduce) {
  .ts-nav-fixed { transition: none; }
}

/* ✗ Wrong: global override bleeds into other components */
:root { --ts-dur-base: 100ms; }
```

**Rule:** if a component needs different motion from the global primitives,
declare component-scoped aliases (`--ts-nav-dur-*`) that fall back to the
global primitives. Never override global tokens inside a component.

---

### P-08 · Surface re-anchor (`--ts-this-bg` set once, cascade everything)

**`--ts-this-bg` is declared once on the shell. All color derivatives cascade from it.**

```css
/* Set on the shell ONLY */
.ts-nav-fixed {
  --ts-this-bg: var(--ts-bg-body);   /* ← ONCE */
  background-color: var(--ts-this-bg);

  /* Everything else derives — never re-declared on children: */
  /* --ts-on-surface-auto resolves from --ts-this-bg (P-03) */
  /* --ts-nav-text-alpha mix reads --ts-this-bg implicitly */
}

/* Surface variant: just re-anchor the shell */
.ts-nav-fixed.ts-on-accent {
  --ts-this-bg: var(--ts-accent);   /* one line, everything updates */
}
```

**Rule:** `--ts-this-bg` is NEVER set on a child element. Never set it twice in
the same component. Setting it once on the shell re-anchors the entire component.
This collapses what would otherwise be dozens of per-child overrides.

---

### P-09 · at-top signal vs. transparent feature (state separation)

**`at-top` is a scroll signal only. `.ts-nav--transparent` is an opt-in feature.**

```css
/* at-top: pure scroll state, no visual opinions */
.ts-nav-fixed.at-top {
  /* Only: --ts-nav-at-top: 1; (a flag token, not a color) */
}

/* transparent feature: explicit opt-in */
.ts-nav-fixed.ts-nav--transparent {
  --ts-nav-bg-alpha: 0%;
  background-color: color-mix(in oklab, var(--ts-this-bg), transparent calc(100% - var(--ts-nav-bg-alpha)));
}

/* Combine: transparent-when-at-top */
.ts-nav-fixed.ts-nav--transparent.at-top {
  --ts-nav-bg-alpha: 0%;
}
.ts-nav-fixed.ts-nav--transparent:not(.at-top) {
  --ts-nav-bg-alpha: 100%;
}
```

**Rule:** never put visual decisions (colors, opacity) in a scroll-state class.
`.at-top` merely signals position. The transparent feature is a separate class
the developer adds intentionally. They are orthogonal axes.

---

### P-10 · Mobile icon-reveal transition

**Icon controls (toggle, burger, back-to-top) appear via transition, not display toggle.**

```css
.ts-nav-fixed__icon-group {
  /* Initial: controls are opacity:0, width:0 — layout preserved */
  --ts-nav-icon-reveal-dur: var(--ts-nav-dur-base);
  opacity: 0;
  width: 0;
  overflow: hidden;
  transition:
    opacity var(--ts-nav-icon-reveal-dur) var(--ts-nav-ease),
    width   var(--ts-nav-icon-reveal-dur) var(--ts-nav-ease);
}

/* Revealed: mobile menu open or sidebar active */
.ts-mobile-menu-open .ts-nav-fixed__icon-group,
.ts-sidebar-open    .ts-nav-fixed__icon-group {
  opacity: 1;
  width: var(--ts-nav-icon-item-w);  /* P-02 derived */
}
```

**Rule:** never use `display: none` → `display: flex` for interactive controls.
Use opacity + width transition so the layout reflow is smooth and keyboard focus
order is preserved throughout.

---

### P-11 · Top-arrow contextual rotation

**Transform rotation signals contextual state change without a new icon.**

```css
.ts-back_top-nav {
  --ts-arrow-rotate: 0deg;  /* up = back-to-top (default) */
  transition: transform var(--ts-nav-dur-base) var(--ts-nav-ease);

  & .ts-icon { transform: rotate(var(--ts-arrow-rotate)); }
}

/* At-top + mobile: rotate to "scroll to next section" signal */
.ts-nav-fixed.at-top .ts-back_top-nav {
  --ts-arrow-rotate: 180deg;  /* arrow now points down */
}
```

**Rule:** use a token-driven `--ts-*-rotate` variable, not hardcoded
`transform: rotate(180deg)`. State changes update the token; the transition
fires automatically. A single icon communicates two opposite intents.

---

## 15 · CSS Nesting Discipline

> All states, variants, sub-components, and responsive adjustments live
> INSIDE the component's root block. Nothing is scattered. Every
> `&`-nested rule is the definitive location for that behavior.

### The law

```css
/* ✓ Correct — everything inside the block */
.ts-nav-fixed {
  /* base styles */

  /* States */
  &:hover    { … }
  &:focus-visible { … }
  &.active   { … }
  &.at-top   { … }          /* P-09 */
  &.ts-dismissed { … }

  /* Variants */
  &.ts-nav--spaced   { … }
  &.ts-nav--tabbed   { … }  /* spaced sub-variant */
  &.ts-nav--static   { … }
  &.ts-nav--transparent { … }

  /* Sub-components */
  & .ts-nav-fixed__links { … }
  & .ts-nav-item         { … }
  & .ts-nav-dropdown     { … }
  & .ts-back_top-nav     { … }
  & .ts-menu-burger      { … }

  /* Responsive */
  @media (max-width: 868px) { … }
}

/* ✗ Wrong — scattered rules */
.ts-nav-fixed { … }
/* … 40 lines of other CSS … */
.ts-nav-fixed.at-top { … }    /* scattered state */
.ts-nav-fixed .ts-nav-item { … }  /* scattered child */
```

### The consistent `&` nesting pattern

| Pattern | Syntax | When |
|---|---|---|
| State on self | `&.class-name { }` | active, open, dismissed, at-top |
| Pseudo-state | `&:hover { }`, `&:focus-visible { }` | interaction states |
| Modifier variant | `&.ts-nav--variant { }` | layout/style variants |
| Child element | `& .child-class { }` | sub-component styles |
| Pseudo-element | `&::before { }` | decorative children |
| Responsive | `@media (…) { & { } }` or `@media { .root { } }` | inside the root block |
| Dark/light | `[data-theme="dark"] & { }` or `html[data-theme] & { }` | theme variants |

### Nesting depth limit

**Maximum 3 levels.** If you need a 4th level, extract a new sub-component class.

```css
/* ✓ 3 levels max */
.ts-nav-fixed {              /* level 1 */
  & .ts-nav-dropdown {       /* level 2 */
    & .ts-nav-item { … }     /* level 3 — stop here */
  }
}

/* ✗ Too deep */
.ts-nav-fixed {
  & .ts-nav-dropdown {
    & .ts-nav-item {
      & a:hover { … }        /* level 4 — extract instead */
    }
  }
}
```

### The pre-commit nesting checklist

- [ ] Zero component rules scattered outside the root block
- [ ] All states use `&.state` or `&:pseudo`
- [ ] All variants use `&.ts-variant` inside the root block
- [ ] All children use `& .child` inside the root block
- [ ] No rules deeper than 3 levels
- [ ] `@media` blocks are inside the root block (or grouped at end by breakpoint)
- [ ] `--ts-this-bg` set exactly once, on the root selector

---

## 16 · v8 changelog (vs v7)

| Change | Why |
|---|---|
| Added task class **CHROME** (nav/header/chrome) | v7 had no class for component CSS work — agents defaulted to ATOMIC which missed nav-specific patterns |
| Added §14: 11 component CSS patterns (P-01–P-11) | Extracted from owner's hand-tuned nav; encodes what took hand-tuning into automatic behavior |
| Added §15: CSS Nesting Discipline | Formalizes the `&` nesting law already in the nav CSS so all future components follow it |
| Added 3 hard guardrails (#13–#15) | `--ts-this-bg` child leak, hardcoded breakpoint px, wrong radius in chrome |
| Updated §9 checklist | Added ATOMIC/CHROME items |
| Updated §1 flow | Added "For ATOMIC/CHROME: read §14 + §15" as explicit step 5 |
| Updated §5.4 | Added `--ts-radius-constrained` to the shape system reference |
