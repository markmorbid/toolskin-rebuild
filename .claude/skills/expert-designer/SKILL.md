---
name: expert-designer
version: 7.0.0
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

# Expert Designer — Toolskin (v7)

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
STEP 5  Run scripts/audit-boring.mjs   ← exits 1 on slop
STEP 6  Run scripts/audit-design.mjs   ← exits 1 on rule violations
STEP 7  Manual checklist (§9). Hand off.
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
| Atomic component (button, card, etc.) | **ATOMIC** | `references/04-cards-and-containers.md` or `references/06-component-recipes.md` |
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
--ts-shadow-{1,2,3,4} + --ts-shadow-accent
```
**Shape rule:** radius scales with size. A 36px button gets sm; a 480px hero
card gets lg or xl. Pills only for things ≤ 48px tall.

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
4. Open starter, fill SLOT markers with real content
5. node scripts/audit-boring.mjs <file>
6. node scripts/audit-design.mjs <file>
7. Manual checklist (§9)
8. Ship
```

Total time for a competent agent following this protocol: 20–40 minutes for
a landing page. Taking longer means inventing instead of looking up — stop
and re-read this file.
