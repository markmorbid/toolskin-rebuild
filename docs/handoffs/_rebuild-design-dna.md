# Rebuild Design DNA Spec — Wave 1.5

**Author:** Wave 1.5 Design DNA Extractor (sub-agent, fresh isolated context)
**Date:** 2026-05-19
**Status:** PROPOSED — pending Gate 5 owner review
**Wave 1+2 dependencies consumed:** T1 typology, T2 base context, T3 adaptive integration, S1 primitives, S2 system, S3 components
**In-house Tier 1 skills consumed:** `expert-designer` (SKILL + toolskin/design-theory/css-and-systems/card-layout references), `typography-master` (SKILL + font-catalog reference), `design-tokens-2.0` (SKILL — no references subdir)
**Reference repo (read-only forever per Rule 12):** `../toolskin-showcase/`
**Output role:** Binding input for every Session 4+ block sandbox session; visual parity criteria for S5 autonomous protocol; encoded as Phase E section in `toolskin-architecture` SKILL.md.
**Output discipline:** EXTRACTION ONLY — what exists is canonical. No alternative design choices proposed. Contradictions between in-house skills and CSS evidence are surfaced as Open Questions, not auto-resolved (Rule 11).

═══════════════════════════════════════════════════════════════════════
## ⚠ WAVE 1.6 VISUAL AUDIT RECONCILIATION (2026-05-19 — BINDING)

> ⚠ RULING 3 (2026-05-21): 15px below is wrong. Canonical value is 13px — see `toolskin.css:287` and Session 2 RULING 3.

This Wave 1.5 spec was authored entirely from CSS / HTML / skill TEXT. Wave 1.6 (Pattern 17) audited 124 rendered screenshots — 90 Playwright headless + 34 owner real-Chrome GoFullPage — and the owner annotated the findings. **Where this block and any section below disagree, THIS BLOCK WINS** (Pattern 17 source-of-truth hierarchy: owner's eye > rendered pixels > CSS text).

Full audit + owner annotations: `_rebuild-visual-audit.md`. Owner annotations also at `docs/session-1-bootstrap/owner-annotations-visual-audit.md`.

### Three Gate 5 picks revised by visual reality

| DNA entry | Wave 1.5 text-derived claim (SUPERSEDED) | Wave 1.6 canonical (BINDING) |
|---|---|---|
| §B5 / §A6 — base font size | `--ts-fs-base: 13px` | **`--ts-fs-base: 15px`** — confirmed in running `toolskin.css`. Gate 5 OQ-A6 (13px) and the typography-master skill (16px) were BOTH wrong. The S1 harmonic ladder derives from **15px**. |
| §B3 — weight pairings | 7 weights incl. `800 extra-bold` on H2 / `.ts-section-title`; H1 = 900 | **6-step ladder: 300 / 400 / 500 / 600 / 700 / 900 — NO 800.** Space Grotesk ships 300–700 (SIL OFL); 800 never rendered in production. **H1 = 700** (`--ts-font-weight-bold`), **H2 = 600** (`--ts-font-weight-semibold`). The gap at 800 is intentional. Gate 5 OQ-B3 ABANDONED; the `--ts-font-weight-extra-bold: 800` primitive is DROPPED from S1. |
| §D1 — radius ladder | 8px base + calc-derived ladder (2xs 0.3× … xl 2×) | **8px base CONFIRMED.** Ladder is **explicit fixed steps, NOT calc-derived**: `--ts-radius-sm: 4px`, `--ts-radius-md: 6px`, `--ts-radius-base: 8px`, `--ts-radius-lg: 10px`, `--ts-radius-xl: 16px`; plus `--ts-radius-full: 9999px` and sharp `0`. §D4 nest-reduction (8→6→4→2, −2px per depth) still holds against the real steps. |

### Consequent spec amendments (binding for Session 2 / S1 implementation)

- **S1 harmonic ladder** recomputes from a **15px** base, not 13px.
- **S1 font-weight primitives** = 6-step `300/400/500/600/700/900`. No `--ts-font-weight-extra-bold`.
- **S1 radius primitives** = explicit `4/6/8/10/16` + `9999` + `0`. No calc-derived radius scale.
- **Font loading** = standard Space Grotesk `wght@300..700` (Google Fonts). The variable-axis `wght@300..900` requirement (Gate 5 Resolution #3) is WITHDRAWN — no 800 axis needed.
- A minor amendment to the S1 spec doc covers this; no S1 sub-agent re-dispatch required (per owner annotation).

### Other Wave 1.6 corrections

- **§F7 marquee** — the live `--ts-marquee-bg: var(--ts-bg-1)` (direct primitive reference) is a **regression / Rule 15 violation**, NOT canonical. The rebuild marquee uses `--ts-this-bg` surface inheritance (S4 A8 fix covers this). DNA §F7 / §E3 marquee-token claims that cite the live CSS are superseded on this point.
- **§H "no mark system exists"** — SUPERSEDED. A **3-candidate logo system exists** in `../toolskin-showcase/branding/` previews: **Bracket**, **Blade**, **Cascade** — design explorations, NOT finalized. The rebuild acknowledges they exist without committing to one; finalization is tracked in `_in-house-skills-update-todo.md`.
- **§H OQ-A6 / OQ-B3 / OQ-D1** — all three Open Questions are now RESOLVED by this reconciliation (see table above).
- **FontAwesome** — the missing icons on `toolskin-lab` toast buttons are the known FA version-detection bug, NOT canonical; the rebuild's pinned-version `toolskin-assets.js` fixes it. `index.html` FA6 renders correctly.

### Headless capture caveat (for Session 4+ parity rigs)

Playwright headless **full-page** captures of long lazy-loaded pages (`index.html`) have blank unrendered regions — do not use as parity ground truth. Per-section headless captures and the owner's real-Chrome captures ARE reliable. The S5 G1 parity criterion references `_rebuild-visual-audit.md` + this block.

═══════════════════════════════════════════════════════════════════════
## §0 — PURPOSE OF THIS SPEC
═══════════════════════════════════════════════════════════════════════

Wave 1 + Wave 2 produced ARCHITECTURE (typology, base context, primitives, system, registry) but did not consult the in-house Tier 1 design skills (`expert-designer`, `typography-master`, `design-tokens-2.0`). The risk identified at Gate 4.5: rebuilt blocks become architecturally correct but visually generic, violating Rule 5 at the visual identity level.

This spec extracts the **visual design DNA** that makes Toolskin recognizably Toolskin — separable from architecture. Sessions 4+ block sandboxes verify parity against BOTH structural correctness AND these design DNA signatures. The S5 autonomous protocol's PERMISSIVE/STRICT gates run a design-DNA-conformance check before committing.

═══════════════════════════════════════════════════════════════════════
## §1 — METHODOLOGY
═══════════════════════════════════════════════════════════════════════

### §1.1 — What design DNA means here

Design DNA = the signature visual decisions that distinguish Toolskin from a generic shadcn / Tailwind / Material default. Token primitives (Wave 2.1 S1) define the math. Design DNA defines APPLICATION — when accent goes solid vs tinted vs outline, when sharp corners are intentional, what easing the marquee uses, how chip padding asymmetry signals scannable density.

A block can be architecturally clean (every token comes from `--ts-this-*`, zero `!important`) and still look generic. This spec is the second filter.

### §1.2 — How each pattern is documented

For every signature in §A–§F:
1. **Rule** — the canonical decision (extracted, never proposed)
2. **Evidence** — line reference in `../toolskin-showcase/assets/css/toolskin.css` or in-house skill file
3. **Owner** — which in-house Tier 1 skill is authoritative for this rule (used in Gate 5 council voices)

### §1.3 — Contradictions handling

When the in-house skill and the live CSS disagree, the contradiction is filed as Open Question in §H, never silently reconciled. Examples surface in §C and §D.

═══════════════════════════════════════════════════════════════════════
## §A — SPACING SIGNATURES
═══════════════════════════════════════════════════════════════════════

What makes Toolskin spacing distinctly Toolskin (vs. generic 4px Tailwind grid).

### A1. Component padding is ALWAYS a ratio of height, never an independent `--ts-sp-N`

**Rule:** Atomic blocks (button, input) derive `padding-x`, `padding-y`, `font-size`, `icon-size` from a single component-base token via calc() ratios. Override the base on a container → entire component rescales coherently.

**Evidence:**
- `assets/css/toolskin.css:912-939` — the button derivative system. `--ts-btn-base: 45` → `--ts-btn-h: calc(var(--ts-btn-size) * var(--ts-btn-h-ratio) * 1px)` → `--ts-btn-pad-x: calc(var(--ts-btn-size) * var(--ts-btn-pad-x-ratio) * 1px)` with `--ts-btn-pad-x-ratio: 0.45` → `--ts-btn-pad-y: calc(var(--ts-btn-pad-x) * var(--ts-btn-pad-y-ratio))` with `--ts-btn-pad-y-ratio: 0.42`. Padding-Y is 42% of padding-X.
- `assets/css/toolskin.css:601-606` — input system inherits: `--ts-input-h: var(--ts-btn-h)`; `--ts-input-pad-x: calc(var(--ts-input-h)*.3)`; `--ts-input-pad-y: calc(var(--ts-input-pad-x)*.7)`. Input pad-Y is 70% of pad-X (input ratio differs from button — input is denser).

**Owner:** `design-tokens-2.0` SKILL.md Rule 4 — "Padding is ALWAYS a ratio of height: `calc(var(--height) * 0.3)`. Never an independent `--ts-sp-N` value on a component."

### A2. Chip vertical padding is INTENTIONALLY ASYMMETRIC vs horizontal — scannable density

**Rule:** Chips use raw `--ts-sp-2 var(--ts-sp-3)` (8px Y / 12px X). The asymmetry compresses vertical real-estate so chip strips read as dense scannable rows, not bloated tags.

**Evidence:** `assets/css/toolskin.css:7548` — `padding: var(--ts-sp-2) var(--ts-sp-3);` on `.ts-chip:not(.ts-align-anchor-btn)`.

**Owner:** `expert-designer` references/toolskin.md (existing chip patterns); no override from `design-tokens-2.0` because chips are intentionally outside the height-ratio system — their footprint is governed by the strip composition (factor 2 in `@taxonomy_chips_strip`).

### A3. The 4-step containerish nest-reduction system (cards/panels)

**Rule:** Nested cards/panels shrink their radius AND padding by 2px per nesting depth via `--ts-radius-nest-reduction` + `--ts-pd-nest-reduction`. No JS, pure custom property inheritance.

**Evidence:** `assets/css/toolskin.css:500-507` declares the primitives. `:506` `--ts-radius-nest-reduction: 2px;` and `:507` `--ts-pd-nest-reduction: 2px;`. Comment: "Pure CSS custom-property inheritance — no JS."

**Owner:** Existing CSS. `design-tokens-2.0` SKILL doesn't enumerate this; surfaces it as a Toolskin-specific extension.

### A4. Section gap and section pad are FLUID via clamp() — not fixed scale

**Rule:** Section-level vertical rhythm uses `clamp(4rem, 8vw, 9rem)` so layout breathes responsively without media-query breakpoints.

**Evidence:** `expert-designer/references/toolskin.md:188-189` — `--ts-section-gap: clamp(4rem, 8vw, 9rem); --ts-section-pad: clamp(4rem, 8vw, 9rem);`

**Owner:** `expert-designer` references/toolskin.md §11.5 spacing scale.

### A5. The 4px spacing primitive scale exists BUT is NOT used on atomic-component padding

**Rule:** `--ts-sp-1` through `--ts-sp-24` (4px base × multiplier) is reserved for: gaps between layout primitives, section breathing, card→content gaps, chip strip gap, marquee separator widths. Never for atomic component padding (covered by A1).

**Evidence:** `expert-designer/references/toolskin.md:166-185` — full scale definition. `assets/css/toolskin.css:7541` (chips gap), `:8550` (toast container gap) — gaps not paddings.

**Owner:** `expert-designer` toolskin.md §11.5 + `design-tokens-2.0` Rule 4b.

### A6. Harmonic relationship between component spacing and typographic ladder

**Rule:** Both spacing and font-size systems derive from a single `--ts-*-base` × ratio scheme. Spacing: `var(--ts-spacing-base) * scale` (linear). Typography: `var(--ts-fs-base) * 1.125^n` (geometric, harmonic). The two scales DO NOT share a common multiplier — they coexist because they answer different visual problems (linear spacing rhythm vs geometric type contrast).

**Evidence:**
- `assets/css/toolskin.css:286-289` — `--ts-fs-base: 13px; --ts-fs-ratio: 1.12; --ts-fs-display-ratio: 1.333;`
- Body ratio = minor second (1.12). Display ratio = perfect fourth (1.333) — intentionally separate scale for impact headings.

**Owner:** `typography-master` references/font-catalog.md "Toolskin-specific guidance: Scale rule: Prefer modular ratio (1.125–1.25×) from 16px base, snapped to 4pt grid." Note: showcase deviates from typography-master's 16px guidance — see §H OQ-A6.

═══════════════════════════════════════════════════════════════════════
## §B — TYPOGRAPHIC SIGNATURES
═══════════════════════════════════════════════════════════════════════

Beyond the Space Grotesk anchor — what intentional typographic decisions distinguish Toolskin.

### B1. Letter-spacing is ROLE-CODED, not size-coded

**Rule:** Letter-spacing is dictated by the type's semantic role, not its size:
- Display / headings: **tight** (`--ts-letter-spacing-tight: -0.04em` for H1, `-0.03em` for H2/section title)
- Body: **normal** (`--ts-letter-spacing-normal: 0`)
- UI labels (uppercase): **wide** (`--ts-letter-spacing-wide: 0.08em`)
- Eyebrows / overlines / caps badges: **wider/eyebrow** (`--ts-letter-spacing-wider: 0.12em`, `--ts-letter-spacing-eyebrow: 0.06em`)
- Buttons: **0.055em** (`--ts-btn-ls`)

**Evidence:**
- `assets/css/toolskin.css:266-269` declares the family.
- `:277` `--ts-letter-spacing-eyebrow: 0.06em;` Tier-1 primitive intentionally distinct from `-wide` and `-wider`.
- `:593` `--ts-btn-ls: 0.055em;` Buttons get their own primitive (not `-wide`).
- `:1943` H1 `letter-spacing: var(--ts-letter-spacing-tight);` -0.04em.
- `:7551` chips `letter-spacing: 0.08em;` — wide.

**Owner:** `expert-designer` references/design-theory.md §0B.3 — "Negative letter-spacing on large text (−0.02em to −0.04em)" + `expert-designer` toolskin.md §11.4.

### B2. Line-height tightens AS SIZE INCREASES

**Rule:** Toolskin operates a 7-tier line-height ladder where larger text gets tighter line-height:
- Display/hero: `0.9` (`--ts-line-height-display`)
- Display headings: `1.1` (`--ts-line-height-tight`)
- H1-H3: `1.25` (`--ts-line-height-snug`)
- H4-H6: `1.4` (`--ts-line-height-normal`)
- Body: `1.5` (`--ts-line-height-relaxed`)
- Lead: `1.625` (`--ts-line-height-loose`)
- Long-form: `1.75` (`--ts-line-height-very-loose`)

**Evidence:** `assets/css/toolskin.css:251-265` — full 7-step declaration with use-case comments.

**Owner:** `expert-designer` references/design-theory.md §2.5 "Line-height by size" + `typography-master` SKILL.md font-catalog.md (cite: "1–2 typeface families maximum. Hierarchy comes from weight, size, and color").

### B3. Weight pairings encode semantic role

> ⚠ **REVISED — Wave 1.6 Visual Audit.** Canonical ladder is 6-step `300/400/500/600/700/900` — NO 800. H1=700, H2=600. The `--ts-font-weight-extra-bold: 800` primitive is dropped (Gate 5 OQ-B3 abandoned). See the Wave 1.6 Reconciliation block at the top of this doc. The §B3 text below is the superseded Wave 1.5 text-derived claim (it incorrectly listed an `800 extra-bold` tier and H1=900).

**Rule:** The 6-step weight scale (300/400/500/600/700/900) maps to roles:
- 300 thin: not used in default UI (reserved for editorial body)
- 400 normal: button label default, body text
- 500 medium: body emphasis, .ts-lead, .ts-caption
- 600 semibold: H3-H6, panel headers, accordion header
- 700 bold: chips (`font-weight: 700`), overlines, labels, .ts-h4 ad-hoc
- 800 extra-bold: H2, section title, display title — non-tokenized literal
- 900 black: H1, hero title, display-xl/lg/md (`--ts-font-weight-black`)

**Evidence:**
- `assets/css/toolskin.css:243-248` weight token declaration.
- `:1941` H1 `font-weight: var(--ts-font-weight-black);` (900).
- `:1952` H2 `font-weight: 800;` — LITERAL, not token. See §H OQ-B3.
- `:7550` chips `font-weight: 700;`.
- `:2114` `.ts-section-title font-weight: 800;` — literal.

**Owner:** `expert-designer` references/design-theory.md §0B.1 (weight contrast) + `typography-master` SKILL.md (Space Grotesk anchor + weight ladder).

### B4. Caps usage is role-locked

**Rule:** UPPERCASE is reserved for SPECIFIC roles and never applied for stylistic flair:
- Button labels (`.ts-btn text-transform: uppercase`)
- Chip labels (`.ts-chip text-transform: uppercase`)
- Tabs (`.ts-tab text-transform: uppercase`)
- Labels, captions, overlines, eyebrows (`.ts-label`, `.ts-caption`, `.ts-overline`, `.ts-section__eyebrow`)
- H6 (uniquely among headings: `.ts-h6 text-transform: uppercase`)
- Logo / wordmark (`text-transform: uppercase !important` in topbar logo block)
- Hero title and display title (`.ts-hero-title`, `.ts-display-title`)

**Headings H1–H5 are mixed-case.** Body text is mixed-case. Code labels keep monospace casing per source.

**Evidence:**
- `assets/css/toolskin.css:4762` `.ts-btn text-transform: uppercase;`
- `:7552` chips uppercase
- `:7677` tabs uppercase
- `:2088-2089` `.ts-h6 text-transform: uppercase; letter-spacing: var(--ts-letter-spacing-wide);`
- `:5915` topbar logo `text-transform: uppercase !important;`
- `:2100` hero title uppercase

**Owner:** `expert-designer` references/design-theory.md §0B.3 "Uppercase + wide tracking for labels/categories (0.08em–0.12em)" — Toolskin codifies this beyond labels into buttons + chips + tabs + display titles.

### B5. Font-size base is 13px (NOT 16px) — denser UI by intent

> ⚠ **SUPERSEDED — Wave 1.6 Visual Audit.** The canonical base is **15px**, confirmed in the running `toolskin.css` — not 13px (and not the typography-master skill's 16px). See the Wave 1.6 Reconciliation block at the top of this doc. The §B5 text below is the superseded Wave 1.5 text-derived claim. ⚠ RULING 3 (2026-05-21): 13px confirmed.

**Rule:** `--ts-fs-base: 13px` (declared with intentional `0.8rem` shadow declaration on the line above showing the author's preference signal). Body reads denser than a typical Material/Tailwind site (16px base) — Toolskin is a tool-system UI, not a marketing site.

**Evidence:** `assets/css/toolskin.css:286-288` — `--ts-fs-base: 0.8rem; --ts-fs-base: 13px;` (the second declaration wins).

**Owner:** Existing CSS. Contradicts `typography-master` font-catalog.md guidance "modular ratio (1.125–1.25×) from a 16px base." See §H OQ-A6.

### B6. The harmonic font-size ladder is RESCALABLE inside any container

**Rule:** Override `--ts-fs-base` (or `--ts-font-scale`) on any container → the entire `--ts-fs-xs/sm/md/lg/xl/2xl/3xl/4xl` ladder recalculates inside that container's subtree, because every step is `calc(--ts-fs * ratio_constant)`. This is the same `--ts-this-bg` pattern applied to typography.

**Evidence:** `expert-designer/references/toolskin.md:138-164` documents the full derivation. `assets/css/toolskin.css:291-300` declares the ratio + sub-base divisions. The example "Sidebar font scope override (`--ts-fs-base: 0.78rem`)" in design-tokens-2.0 SKILL §10 priority 7 is the canonical use.

**Owner:** `design-tokens-2.0` SKILL Rule 4 (harmonic font scale IS a derivative system).

### B7. Eyebrows sit OUTSIDE the harmonic ladder by design

**Rule:** Eyebrow / overline tokens (`--ts-fs-eyebrow: 9px`, `--ts-letter-spacing-eyebrow: 0.06em`) are role-fixed UI affordances, not body-text rungs of the modular scale. They use raw px literals to match the Tier-1 primitive style.

**Evidence:** `assets/css/toolskin.css:271-277` — explicit comment: "Sit OUTSIDE the modular --ts-fs-* harmonic ladder by design: the eyebrow is a role-fixed UI affordance, not a body-text rung."

**Owner:** Existing CSS. Author rationale embedded in inline comment — load-bearing for the rebuild.

═══════════════════════════════════════════════════════════════════════
## §C — COLOR APPLICATION SIGNATURES
═══════════════════════════════════════════════════════════════════════

Beyond apcach math (Rule 15) — when accent appears solid vs tinted vs outline, how depth is signaled, when borders are loud vs muted.

### C1. Accent appears as SOLID only in two states: primary button + active chip

**Rule:** The accent color (`--ts-accent`) is painted SOLID only on:
- `.ts-btn--primary` (primary CTA — solid accent + gradient overlay + on-accent text)
- `.ts-chip--accent` (the explicit accent chip variant)
- `.ts-chip--active` / `[aria-selected="true"]` chips (active filter chips in chip strip)

In every other place — links, icons, accents on hovers — the accent appears as:
- **Tinted** via `--ts-accent-dim/dim-2/dim-3/dim-4` (alpha overlays at 70%/82%/90%/92% transparent)
- **Bordered** via `--ts-accent-border` (60% transparent — used for accent rings)
- **Glow** via `--ts-accent-glow-bg-2/-3` (radial gradient backgrounds)
- **Bright/Dark** via `color-mix` toward white/black for hover/active state shifts

**Evidence:**
- `assets/css/toolskin.css:4922-4949` `.ts-btn--primary` — solid + gradient + `--ts-on-accent` text.
- `:7630-7637` `.ts-chip--accent` — solid + gradient + on-accent.
- `:7618-7628` `.ts-chip--active` — accent glow background + accent border.
- `:944-963` `--ts-accent-dim-*`, `--ts-accent-border-hover`, `--ts-accent-bright-2` etc. — the full tinted derivative ladder.

**Owner:** `expert-designer` references/design-theory.md §3.5 "Dominant colors with sharp accents outperform timid, evenly-distributed palettes. The 60-30-10 rule: Primary 60%, secondary 30%, accent 10%."

### C2. The `--ts-this-bg-grad-dark-pct` is a GLOBAL gradient-overlay-intensity knob — KEEP IT EVEN WHEN UNUSED LOCALLY

**Rule:** `--ts-this-bg-grad-dark-pct` (default 14%) controls the intensity of every dark-variant token in the chain. The pct lands through the global pipeline — direct local references are NOT required for it to work. Don't refactor it away as "unused."

**Evidence:**
- `assets/css/toolskin.css:1007` declaration in derivative chain: `--ts-this-bg-grad-dark-pct: 14%`.
- `:996` consumption: `--ts-this-bg-dark: color-mix(in srgb, var(--ts-this-bg), #000000 var(--ts-this-bg-grad-dark-pct, 14%));`
- `:34016-34021` Author docstring in `@taxonomy_chips_strip`: "**KEEP IT — do not refactor away as 'unused'**; its effect lands through the global dark-variant pipeline, not through a direct reference in this rule." This is canonical author intent.

**Owner:** Existing CSS + `design-tokens-2.0` SKILL "Needs addition: Gradient control tokens (`--ts-this-bg-grad-angle`, `--ts-mix-perc`) — exposed, not buried."

### C3. Borders per component tier follow a stable hierarchy

**Rule:** Border treatment encodes component tier:
- **Atomic** (button, input, chip, badge): 1px solid `var(--ts-this-bg-border)` — derived from current surface, NEVER raw color.
- **Molecular** (card, accordion, modal content): 1px solid `var(--ts-card-border)` / `var(--ts-modal-border)` — component-scoped token.
- **Layout** (section, container, app shell): NO border by default. Section bg sets surface tier; the surface-color contrast IS the boundary.
- **Special accent emphasis** (active chip, primary button, focus state): border switches to `var(--ts-accent-border)` (60% transparent accent) or `var(--ts-accent-border-hover)` (40% transparent — more saturated).

**Evidence:**
- `assets/css/toolskin.css:4753-4754` button border: `border: 1px solid var(--_btn-border); border-color: var(--_btn-border);` where `--_btn-border: var(--ts-this-bg-border);`.
- `:5153` card border: `border: 1px solid var(--ts-card-border);`
- `:8256` modal border: `border: 1px solid var(--ts-modal-border);`
- `:2881-2889` section has NO border declaration — only `background-color: var(--ts-this-bg)` to set surface.

**Owner:** `design-tokens-2.0` SKILL Rule 5 — "Component CSS may NOT reference `--ts-bg-0` through `--ts-bg-5` directly. They MUST set `--ts-this-bg` and use derivatives." Border-per-tier is the visual application of that rule.

### C4. Shadow philosophy = depth-additive, never default

**Rule:** Components do NOT have a default shadow. Shadows appear only as:
- Focus glow (input/button focus): `box-shadow: 0 0 4px 4px color-mix(in srgb, var(--_input-accent), transparent 79%);` (`:7113`)
- Hover lift (primary button): `box-shadow: var(--ts-shadow-accent-sm);` (`:4944`)
- Modal: `box-shadow: var(--ts-shadow-5);` (`:8258`)
- Toast: `box-shadow: var(--ts-shadow-3);` (`:8563`)
- Glow-emphasis variants: `.ts-glow`, `.ts-glow-success/danger/info` — opt-in
- Accent shadows: `--ts-accent-shadow-glow` for accent-emphasis components

The default surface is the gradient. Depth is signaled by `--ts-this-bg-bright/dark` mixing — not box-shadows.

**Evidence:**
- `assets/css/toolskin.css:513-532` — 5-step shadow scale + accent-shadow tokens. Comments label use cases: subtle / cards-buttons / dropdowns-panels / large-modals / dramatic-depth.
- `:1008` `--ts-this-bg-grad: linear-gradient(var(--ts-this-bg-grad-angle), var(--ts-this-bg), var(--ts-this-bg-dark), var(--ts-this-bg));` — the surface IS the depth signal.

**Owner:** `expert-designer` references/design-theory.md §0B.5 "Motion should feel INEVITABLE, not decorative. If removing the animation doesn't reduce understanding, the animation shouldn't exist." Same logic applied to shadows.

### C5. The `--ts-on-accent` OKLCH auto-contrast rule

**Rule:** Any element painted with `background: var(--ts-accent)` MUST use `color: var(--ts-on-accent)` — never hardcoded `#fff` or `#000`. The OKLCH formula auto-selects white (0%) or black (100%) based on accent luminance threshold (0.75 — only very light accents like yellow/lime get black text).

**Evidence:**
- `assets/css/toolskin.css:952` declaration: `--ts-on-accent: oklch(from var(--ts-accent) clamp(0, (0.75 - l) * 999, 1) 0 0);`
- `:4926` button: `--_btn-color: var(--ts-on-accent) !important;`
- `:7634` chip-accent: `color: var(--ts-on-accent) !important;`

**Owner:** `design-tokens-2.0` SKILL Rule 7 (OKLCH auto-contrast system).

### C6. Surface re-scoping cascades the entire derivative chain — not just background

**Rule:** When a component sets `--ts-this-bg: var(--ts-bg-N)` on its root, ALL 20+ derivative tokens in the chain (`--ts-this-bg-bright/dark/dim-1..4/border/hover/active/focus/disabled/grad/grad-2/etc.`) recompute. Descendants inherit the recomputed values automatically. Components MUST use this mechanism, never override individual properties.

**Evidence:**
- `assets/css/toolskin.css:973-1014` declares ~30 derivatives under `:where(:root, :root *)`.
- `:1083-1139` consumption pattern: `.interactive` family uses `background: var(--ts-this-bg-grad); border-color: var(--ts-this-bg-border);` etc. — every state is a derivative reference, no raw colors.
- `:34023-34024` `@taxonomy_chips_strip` docstring: "`--ts-this-bg: var(--ts-bg-1)` surface re-scoping so children inherit the correct contextual background."

**Owner:** `design-tokens-2.0` SKILL Rule 5 (surface propagation system).

### C7. The 14% / 6% / 32% mixing values are LOAD-BEARING constants

**Rule:** The mixing percentages used in derivative tokens have been tuned over time and are author-locked:
- `--ts-this-bg-bright: color-mix(in srgb, var(--ts-this-bg), #ffffff 6%);` — subtle lift (6%)
- `--ts-this-bg-bright-3: color-mix(in srgb, var(--ts-this-bg), #ffffff 14%);` — stronger lift (14%)
- `--ts-this-bg-dark: color-mix(in srgb, var(--ts-this-bg), #000000 14%);` — depth recess (14%)
- `--ts-this-bg-dark (alt): color-mix(in srgb, var(--ts-this-bg), var(--ts-bg-body) 32%);` — recess toward floor (32%, declared twice — second wins)
- `--ts-this-bg-muted: color-mix(in srgb, var(--ts-this-bg), var(--ts-bg-body) 46%);` — muted toward floor (46%)

S2 spec proposed migrating these to OKLCH and adjusting some values (e.g., dim ladder caps at -4 instead of -7). See §H OQ-C7.

**Evidence:** `assets/css/toolskin.css:973-999` — full derivative declaration block.

**Owner:** Existing CSS + `design-tokens-2.0` SKILL Rule 5a (the derivative chain enumeration).

═══════════════════════════════════════════════════════════════════════
## §D — RADIUS SIGNATURES
═══════════════════════════════════════════════════════════════════════

### D1. Per-component radius ladder

> ⚠ **REVISED — Wave 1.6 Visual Audit.** 8px base CONFIRMED. The ladder is explicit fixed steps `4/6/8/10/16` (+ `9999` pill, `0` sharp) — NOT the calc-derived scale below. See the Wave 1.6 Reconciliation block at the top of this doc. The §D1 calc formula below is the superseded Wave 1.5 text-derived claim.

**Rule:** Radius is component-scoped via a single base × scale × ratio formula:
- Base: `--ts-radius-base: 8px` (NOT 10px — old skill ref says 10, code says 8; the 8 wins; see §H OQ-D1)
- `--ts-radius-2xs: calc(var(--ts-radius) * 0.3)` ≈ 2.4px (chips, badges)
- `--ts-radius-xs: 0.6×` ≈ 4.8px
- `--ts-radius-sm: 0.87×` ≈ 7px (buttons default, inputs default, chip strip surfaces)
- `--ts-radius-md: 1×` ≈ 8px (cards default, accordion items)
- `--ts-radius-lg: 1.15×` ≈ 9.2px (marquee)
- `--ts-radius-2xl: 1.5×` ≈ 12px
- `--ts-radius-xl: 2×` ≈ 16px (large modals)
- `--ts-radius-full: 9999px` (pill chips, toggles, dots, badges-rounded)

**Evidence:** `assets/css/toolskin.css:484-498` — full radius scale declaration.

**Owner:** `expert-designer` references/toolskin.md §11.6 + existing CSS.

### D2. Component sizes correlate with radius via ratio — sliding scale

**Rule:** As components scale up (lg/xl button variants), their height-derived radius scales proportionally because `border-radius: var(--ts-btn-radius)` uses `var(--ts-radius-sm)` which is itself derived from `--ts-radius-base × scale`. Buttons at large size keep the visually-balanced corner-to-height ratio.

**Evidence:** `assets/css/toolskin.css:591` `--ts-btn-radius: var(--ts-radius-sm);`. Button variants override `--ts-btn-h-ratio` (`:5048` `--ts-btn-h-ratio: 0.88;`) which changes height but radius token reference stays — visual ratio preserved.

**Owner:** `design-tokens-2.0` SKILL Rule 4 (derivative system) applied to radius.

### D3. Sharp corners ARE intentional — at component boundaries and inside fixed structures

**Rule:** Several places use radius-0 by design:
- Chip strip `border-radius: 0` (`:34164`) — sharp because it's flush with action-bar siblings
- Inset action buttons in input-groups `border-radius: 0; border-top-left-radius: 0 !important; border-bottom-left-radius: 0 !important;` (`:7001-7003`) — flush with input on right edge
- Tabs `border-radius: var(--ts-tab-radius) var(--ts-tab-radius) 0 0` (`:7682`) — top corners only, bottom sharp because it sits on a horizontal divider
- Tree row `border-radius: 0 var(--ts-tree-radius) var(--ts-tree-radius) 0` (`:32486`) — sharp left because the inset accent bar is a flush full-height stripe; right corners round
- Marquee fullwidth `border-radius: 0` (`:15809`) — full-bleed viewport span has no corner-rounding

Each "sharp corner" is a deliberate edge-flush composition — never a stylistic choice.

**Evidence:** see line refs above + author comments at `:32484-32486` "Round only the right corners so the inset accent bar on the left stays a flush, full-height stripe."

**Owner:** Existing CSS — author rationale embedded as comments.

### D4. The nest-reduction system (radius shrinks by 2px per depth level)

**Rule:** Cards inside cards (and panels inside panels) auto-reduce their radius by `--ts-radius-nest-reduction: 2px` per nesting depth. Pure CSS custom-property inheritance — no JS. Creates visual telescoping that signals depth without shadows.

**Evidence:** `assets/css/toolskin.css:506` declaration; `:5154` consumption: `border-radius: var(--ts-nest-radius, var(--ts-card-radius));` — the `--ts-nest-radius` is the descended value with reductions applied.

**Owner:** Existing CSS (a Toolskin-specific innovation NEW-B16 per inline comment `:5149-5151`).

═══════════════════════════════════════════════════════════════════════
## §E — MOTION SIGNATURES
═══════════════════════════════════════════════════════════════════════

### E1. Easing curves are role-coded — 11 specific bezier values

**Rule:** Toolskin operates an 11-curve easing palette where each curve is bound to an interaction tier, not chosen aesthetically:
- `--ts-ease-out: cubic-bezier(0.16, 1, 0.3, 1)` — default for UI feedback (most-used)
- `--ts-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)` — symmetric, two-direction transitions
- `--ts-ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)` — overshoots, used for emphasis (>1 in y)
- `--ts-ease-snap: cubic-bezier(0.25, 0.46, 0.45, 0.94)` — quick crisp
- `--ts-ease-out-slow: cubic-bezier(0.25, 0.1, 0.25, 1)`
- `--ts-ease-in-slow: cubic-bezier(0.75, 0.8, 0.25, 1)`
- `--ts-ease-out-linear/in-linear` — for parallax/scroll-tied
- `--ts-panel-ease-out: cubic-bezier(0.56, 0.29, 0.15, 1.19)` — panel-specific (overshoots)
- `--ts-panel-ease-in: cubic-bezier(0.73, 0.03, 0, 0.92)` — panel-specific

**Evidence:** `assets/css/toolskin.css:552-562` — full 11-curve palette.

**Owner:** `expert-designer` references/design-theory.md §6.2 — Material standard 3-curve palette is the floor. Toolskin operates an expanded 11-curve palette; `--ts-ease-spring` is the Toolskin signature (overshoots).

### E2. Duration ladder per interaction tier

**Rule:** 4-step duration ladder:
- `--ts-dur-fast: 220ms` — micro-interactions: input focus, hover state transitions, accordion arrow
- `--ts-dur-base: 300ms` — standard: button hover, card hover, tab change, transition default
- `--ts-dur-slow: 550ms` — deliberate: modal/toast enter, accordion expand, panel slide
- `--ts-dur-slower: 700ms` — emphasis: large overlays, hero animations

Note: these are SLIGHTLY slower than the typical Material/Tailwind 100/200/300 — Toolskin animations are intentionally more relaxed.

**Evidence:** `assets/css/toolskin.css:563-566`.

**Owner:** `expert-designer` references/design-theory.md §6.2 ("Standard 200–300ms, Complex 300–500ms"). Toolskin: 220/300/550/700 — sits at the slower end of the recommended bands.

### E3. The marquee infinite-loop pattern — translateX(-50%)

**Rule:** Marquee uses a SPECIFIC seamless-loop pattern: duplicate text strip via `::before` pseudo with `content: attr(data-text-content)`, animate the wrapper from `translateX(0)` to `translateX(-50%)`. The translation by exactly half-width creates the seamless loop. Animation duration: `45s` default (`--ts-marquee-speed: 45s`). Animation: `linear` (no easing) + `iteration-count: infinite`.

**Evidence:**
- `assets/css/toolskin.css:15784` `--ts-marquee-speed: 45s;`
- `:15851-15863` animation declaration: `linear, infinite, var(--ts-marquee-speed)`.
- `:15914-15924` `@keyframes ts-marquee-loop { from: translateX(0); to: translateX(-50%); }` with comment: "Moves text by exactly half its width, creating seamless loop"
- `:15889-15892` `.ts-marquee-text-text[data-text-content]::before { content: attr(data-text-content); padding-right: var(--ts-marquee-separator); }` — the duplicate strip mechanism.

**Owner:** Existing CSS. Rule 9 of Wave 1 council ("ts-marquee canonical pattern") locks this. See `_session-1-rebuild-queue.md` Rule 9.

### E4. Reduced-motion fallbacks

**Rule:** `@media (prefers-reduced-motion: reduce)` blocks exist but are PARTIALLY DEPLOYED in the showcase (5 occurrences at `:1541` (commented), `:10903` (commented), `:16628`, `:28390`, `:29286`). Two are commented out — see §H OQ-E4.

**Evidence:** Grep result above. Lines 16628, 28390, 29286 are active.

**Owner:** `expert-designer` references/design-theory.md §6.2 "Always respect reduced motion" — the rebuild should normalize this into a single canonical reduced-motion override (S5 protocol concern).

### E5. Toast enter animation = `translateX(20px) → 0` over `var(--ts-dur-slow)` with `var(--ts-ease-out)`

**Rule:** Toasts slide in from the right (20px) with opacity fade, using slow duration + ease-out. Specific composition.

**Evidence:** `assets/css/toolskin.css:8570-8580` `@keyframes ts-toast-in`.

**Owner:** Existing CSS.

### E6. Modal enter = `translateY(16px) scale(0.97) → 0/1` over `var(--ts-dur-slow)` with `var(--ts-ease-out)`

**Rule:** Modals enter from below (16px) with subtle scale up (0.97 → 1) and opacity fade.

**Evidence:** `assets/css/toolskin.css:8274-8283` `@keyframes ts-modal-in`.

**Owner:** Existing CSS.

═══════════════════════════════════════════════════════════════════════
## §F — COMPONENT-LEVEL DNA
═══════════════════════════════════════════════════════════════════════

What makes each component family recognizably Toolskin. Ordered by T1 typology: atomic first, then molecular, then layout.

### F1. CHIP (atomic — PERMISSIVE)

A Toolskin chip is a **dense uppercase pill** with letter-spaced tracking. The default chip uses `var(--ts-sp-2) var(--ts-sp-3)` padding (8px/12px asymmetric — see A2), `font-size: var(--ts-fs-xs)` overridden to 10px, `font-weight: 700`, `letter-spacing: 0.08em`, `text-transform: uppercase`, `border-radius: var(--ts-radius-sm)` (~7px), `border: 1px solid var(--ts-border-2)`. Chip variants signal status via accent override: `.ts-chip--success/warning/danger` swap `--ts-accent` to status colors; `.ts-chip--accent` solidifies into accent fill; `.ts-chip--active` / `[aria-selected="true"]` glow with `--ts-accent-glow-bg-2` radial. Hover state tightens `--ts-this-bg-mix` (the chip's transparency mix percentage drops from 78% to 65%). Evidence: `assets/css/toolskin.css:7544-7658`.

### F2. CHIP-STRIP (molecular — STRICT, Rule 9 LOCKED 10-factor protected contract)

A Toolskin chip strip (`#ts-taxonomy.ts-chips` canonical at `:34131`) is `flex-wrap: nowrap` horizontal scroll with **edge-fade gradients** signaling scrollability. The 10 protected style factors per `_session-1-rebuild-queue.md` Rule 9 + `assets/css/toolskin.css:34001-34130` docstring:
1. `border-inline: 1px solid var(--ts-this-bg-border)` frame
2. Horizontal flex strip with `flex-wrap: nowrap; min-width: 0; overflow-x: auto`
3. Height locked to `calc(var(--ts-tree-actionbar-h) - 2px)` for action-bar alignment
4. Two edge-fade gradients (left/right) via mixed color-stops at `--_-grad-w: 20px`
5. `--ts-this-bg-grad-dark-pct: 13%` global dark-variant intensity knob (KEEP — invisible work)
6. `--ts-this-bg: var(--ts-bg-1)` surface re-scoping
7. `flex: 1 1 var(--_chips-max-w)` width priority over siblings
8. `--_chips-max-w` fallback math `calc(100% - (var(--ts-chip-size, var(--ts-btn-h)*2)*1))` — DO NOT simplify
9. `--ts-this-bg-dark/-1/-2` gradient stops mixed with `transparent` so fades read against parent surface (no hardcoded colors baked in)
10. `border-radius: 0` — flush with action-bar siblings; sharp corners INTENTIONAL

Inactive chips: `--ts-this-bg: var(--ts-bg-0)` + `--ts-chip-color: var(--ts-text-muted)`. Active chips (`[aria-selected="true"]`): `--ts-this-bg: var(--ts-accent-border-hover)` + `--ts-chip-color: var(--ts-on-accent)`. Both states wrap their numeric count in `[ ]` brackets via `::before/::after` pseudos on inline `<small>`.

### F3. BUTTON (atomic — PERMISSIVE)

A Toolskin button is **uppercase + tracked + height-derived**. Default `--ts-btn-base: 45` → 45px height. Padding/font-size/icon-size all derive via ratios (A1). `font-weight: 400` (light for default — relies on size + tracking + caps for emphasis, not weight). `letter-spacing: 0.055em`. `text-transform: uppercase`. `border-radius: var(--ts-radius-sm)` ≈ 7px. Default variant uses `--ts-this-bg-grad` gradient overlay. Variants by token swap, not new rules: `--primary` swaps `--_btn-bg` to `--ts-accent` (solid accent fill + accent-grad overlay + `--ts-on-accent` text). `--outline` swaps `--_btn-bg` to `transparent`, `--_btn-border` to dim border. `--ghost` swaps to translucent surface + soft glow on hover. `--accent/alt/danger/success` use status color overrides. Sizing variants (`--sm/lg/xl`) override `--ts-btn-h-ratio` only — everything else recalculates. Evidence: `assets/css/toolskin.css:4735-5070`.

### F4. CARD (molecular — STRICT)

A Toolskin card is a **nest-aware container surface**. Sets `--ts-this-bg: var(--ts-bg-1)` re-scope on root (`:5148`). Uses `--ts-card-bg`, `--ts-card-border`, `--ts-card-radius`, `--ts-card-pad`, `--ts-card-gap` as component tokens that resolve to system-tier derivatives. Card-in-card composition uses `--ts-nest-radius` and `--ts-nest-pad` from the `--ts-radius-nest-reduction: 2px` mechanism (D4) — pure CSS-property inheritance, no JS. Cards use `flex-direction: column` + `gap: var(--ts-card-gap)` for internal stacking by default. Card layout-rule (per `card-layout-rules.md`): hierarchy is `.ts-card > [.ts-card-header.ts-accordion] > .ts-toggle-row? > .ts-card-rows > .ts-card-row > .ts-card-col-(full|half|third) > .ts-field > label + control`. NEVER unclassed divs, MAX ONE `.ts-card-rows` per card. Evidence: `assets/css/toolskin.css:5147-5198` + `.claude/skills/expert-designer/references/card-layout-rules.md`.

### F5. INPUT (atomic — PERMISSIVE)

A Toolskin input is **height-aligned with the button system** (`--ts-input-h: var(--ts-btn-h)`). Uses `--ts-this-bg-dim-3` (50% transparent) as default idle background — translucent, see-through, signals "active input field" before user touches it. Padding: `var(--ts-input-pad-y) var(--ts-input-pad-x)` where pad-X is `30% of height` (denser than button's 45%), pad-Y is `70% of pad-X` (NOT 42% like button — input is wider/shorter). Border: `1px solid var(--ts-this-bg-border)`. Radius: `var(--ts-radius-sm)`. Font-size: `var(--ts-fs-body-sm)` — slightly larger than button label by intent. Idle text color: `--ts-text-primary-dim-2` (secondary tier). Focus: border → accent, color → `--ts-text-primary`, placeholder → primary (NOT muted on focus — clarifies entered text). Inset-action variants (`.ts-input-inset-button`) flatten right edge to `border-radius: 0` (D3) and slot a button flush to input edge. Evidence: `assets/css/toolskin.css:601-639` + `:6944-7145`.

### F6. TREE (molecular — STRICT, with cascade-sensitivity rule)

A Toolskin tree is a **vertical row stack with right-aligned twist chevrons**. Tree rows: `display: flex; align-items: center; gap: var(--ts-tree-gap); height: var(--ts-tree-row-h) !important;`. Border-radius: `0 var(--ts-tree-radius) var(--ts-tree-radius) 0` — sharp left because the accent bar (`box-shadow: inset 2px 0 0 0 var(--ts-tree-row-active-bar)`) is a flush full-height stripe on selected rows. Twist chevron starts at `opacity: 0`, fades in on hover/focus/aria-selected; rotates 90deg on `aria-expanded="true"` with color shift to `--ts-accent`. State map: `:hover` = transient wash; `:focus-visible` = ACTIVE (dashed accent outline + soft fill); `[aria-selected="true"]` = SELECTED (accent fill + inset bar). Active + selected stack both layers. Folder colors cascade via `--ts-tree-folder-color` — accent at top, secondary at depth ≥3, accent again on hover/select/expand. File icons scale down via `--ts-tree-icon-scale-file` (heavier glyph balance). Cascade-sensitivity: per Rule 8 (May 17 discovery), tree row variants MUST be enumerated explicitly via `:is(...)` selectors at the component layer — distribution selectors at primitive/system layer are forbidden. Evidence: `assets/css/toolskin.css:32477-32570`.

### F7. MARQUEE (molecular — STRICT, canonical pattern per Rule 9)

A Toolskin marquee is a **horizontal infinite-loop text strip with `translateX(-50%)` seamless duplication** (E3). Default `--ts-marquee-font-size: var(--ts-fs-hero)`, `--ts-marquee-speed: 45s` linear, `--ts-marquee-pad: var(--ts-sp-8)`, `--ts-marquee-radius: var(--ts-radius-lg)`, `--ts-marquee-bg: var(--ts-accent-glow-bg-2)` (radial accent glow as background — NOT a solid color). `--ts-marquee-weight: 600`. Separator between text copies: `calc(var(--ts-marquee-font-size) / 2)`. `pointer-events: none` is currently HARDCODED (`:15795` author comment: "this is a hardcoded temporary fix" to avoid animation stop on hover) — see §H OQ-E3. Fullwidth variant (`.ts-marquee.fullwidth`) reaches viewport-width via `min-width: calc(100vw + ...)`, `translateX(-50%); left: 50%;` to escape parent containers — promotes molecular → LAYOUT per T1 §2.3. `order: -1` reorders the strip to flex-parent's first child. Right-direction variant (`[data-mq-direction="right"]`) reverses animation. Evidence: `assets/css/toolskin.css:15775-15924`.

### F8. MODAL (LAYOUT-tier per T1 tie-breaker — ALWAYS STRICT)

A Toolskin modal is a **viewport-overlay shell + content surface**. Per Gate 4 D5 split: modal overlay is layout (full-viewport + scroll lock + focus trap); modal content shell is molecular (surface composition + slots). Combined treatment is LAYOUT (tier 1 of T1's §1.4 tie-breaker — sets surface tier for descendants). Content: `width: 100%; max-width: 560px; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden;`. Background: `--ts-modal-bg` (scoped token), border `1px solid var(--ts-modal-border)`, border-radius: `var(--ts-modal-radius)`, `box-shadow: var(--ts-shadow-5)`. Modal sets `--ts-this-bg: var(--ts-modal-surface)` so children resolve derivatives against modal surface tier. Enter animation: `translateY(16px) scale(0.97) → 0/1` over `var(--ts-dur-slow)` (E6). Size variants by max-width: `--sm: 380px`, `--lg: 800px`, `--xl: 1100px`. Header: flex row, `space-between`, divider `border-bottom: 1px solid var(--ts-modal-border)`, max-height `--ts-modal-header-h`. Evidence: `assets/css/toolskin.css:8232-8350`.

### F9. TOPBAR / NAVBAR (LAYOUT — ALWAYS STRICT)

A Toolskin topbar is **sticky-positioned, height-locked, with grid-based logo composition**. `position: sticky; top: 0; z-index: var(--ts-z-sticky); height: var(--ts-topbar-h); min-height: var(--ts-topbar-h);`. Surface: `background: var(--ts-topbar-bg)`. Border: `border-bottom: 1px solid var(--ts-border-1)` — single bottom rule, no shadow. Logo composition is GRID-based (NOT flex): `display: grid; grid-template-columns: 1fr 1fr; align-content: center; justify-items: start;` — explicitly chosen for "better line control" per author comment (`:5893-5897`). Logo typography: `--ts-font-display`, `--ts-font-weight-semibold` (600), `text-transform: uppercase !important`, `letter-spacing: var(--ts-letter-spacing-wide) !important`, `font-size: var(--ts-header-logo-fs) !important`. Logo size: `min-width: calc(var(--ts-topbar-h) * 1.5); max-width: calc(var(--ts-topbar-h) * 2);` — intrinsic width tied to topbar height. Evidence: `assets/css/toolskin.css:5876-5946`.

### F10. ACCORDION (molecular — STRICT)

A Toolskin accordion is a **derivative-sized item list**. Header: `min-height: 50px` (also exposed as `--ts-ui-accordion-header-min-h`). Header pad-X: `calc(--ts-ui-accordion-header-min-h * .5)`. Header pad-Y: `calc(pad-x * 0.78)` (similar density to input). Header gap: `calc(pad-y * 0.54)`. Header font-size: `calc(panel-fs * 1.1)` — header is 10% larger than panel body. Header background: `--ts-this-bg-dim` (light tint of current surface). Hover: `--ts-this-bg-dark-1` (slight recess). Active: `--ts-this-bg-dark`. Toggle chevron: `--ts-accordion-toggle-chevron-size: calc(--ts-ui-accordion-icon-size * 0.6)`, scaled to header. Arrow color shifts to `--ts-accent` on hover/expanded. `--separated` variant breaks the unified shell — each item gets its own border + radius. Surface re-scope: `--ts-this-bg: var(--ts-bg-2-t)` at root. Evidence: `assets/css/toolskin.css:17753-17836`.

### F11. TABS (molecular — STRICT)

Toolskin tabs are **bottom-rule sliders**. `display: flex; border-bottom: 1px solid var(--ts-border-0)`. Each `.ts-tab`: `flex: 1; padding: var(--ts-sp-3) var(--ts-sp-4); font-size: var(--ts-fs-2xs)` (compact); `font-weight: 500; letter-spacing: var(--ts-letter-spacing-wider); text-transform: uppercase; text-align: center`. Idle color: `var(--ts-text-muted)`. `border-bottom: 2px solid transparent; margin-bottom: -1px; margin-top: var(--ts-sp-1);` — the negative margin overlaps the divider so the active tab's accent bar BECOMES the divider in its slot. `border-radius: var(--ts-tab-radius) var(--ts-tab-radius) 0 0` — top corners only (D3). Transition: `all var(--ts-dur-fast) var(--ts-ease-out)`. Pill variants (`--pill`, `--pill-rounded`) swap radius and shape. Evidence: `assets/css/toolskin.css:7660-7720`.

### F12. TOAST (molecular — STRICT, but container is LAYOUT)

A Toolskin toast is a **right-edge slide-in card with semantic left-border accent**. Container: `position: fixed; bottom: var(--ts-sp-5); right: var(--ts-sp-5); z-index: var(--ts-z-toast)`. Toast: `display: flex; align-items: flex-start; gap: var(--ts-sp-3); padding: var(--ts-sp-4) var(--ts-sp-5); background: var(--ts-bg-3); border: 1px solid var(--ts-border-1); border-left: var(--ts-index-bar-height) solid var(--ts-accent);` — 3px left bar is the variant-color slot. `border-radius: var(--ts-radius-md). box-shadow: var(--ts-shadow-3)`. min-width 280px / max-width 380px. Variants by `border-left-color`: `--success → --ts-success`, `--warning → --ts-warning`, `--error → --ts-danger`, `--info → --ts-accent-alt`. Enter: `translateX(20px) → 0 + opacity 0→1`, `var(--ts-dur-slow) var(--ts-ease-out)`. Evidence: `assets/css/toolskin.css:8541-8617`.

═══════════════════════════════════════════════════════════════════════
## §G — ANTI-PATTERNS (EXPLICITLY NOT TOOLSKIN)
═══════════════════════════════════════════════════════════════════════

What an LLM might default to that breaks Toolskin identity. The rebuild MUST avoid:

### G1. Material Design conventions Toolskin rejects
- **Floating action buttons (FAB)** — Toolskin uses `.ts-oce-fab` only inside the offcanvas editor as a sandbox tool, never as a primary CTA pattern.
- **Card elevation via box-shadow** — Toolskin signals depth via gradient overlay (`--ts-this-bg-grad`) and surface tier (`--ts-this-bg`), NOT default box-shadow. Shadows are reserved for focus, modal, toast only (C4).
- **Material ripple effects** — no ripple on button click. Toolskin buttons use background-color transition + `var(--ts-ease-out) var(--ts-btn-dur)`.
- **Material 3-stop easing palette only** — Toolskin operates 11 specific bezier curves (E1).
- **Default font weight 400 for everything** — Toolskin button default is 400 BUT relies on uppercase + tracking + size for emphasis; headings escalate weight to 700/800/900.

### G2. Bootstrap patterns Toolskin rejects
- **`.btn-primary` solid blue + white text everywhere** — Toolskin primary is hue-configurable, defaults to orange (h:18), uses OKLCH auto-contrast for text.
- **Form-control `border: 1px solid #ced4da` literal** — every Toolskin border is `--ts-this-bg-border` derivative.
- **Bootstrap accordion `+/-` icon swap** — Toolskin uses chevron rotation `transform: rotate(90deg)` (F6 mechanism applied to accordion).
- **Card `box-shadow: 0 0.5rem 1rem rgba(0,0,0,.15)`** — no default shadow (C4).
- **Grid `.col-md-6` named-class spans** — Toolskin grid uses `.ts-grid--1/2/3/4` + `.ts-grid--auto-md` minmax patterns, not named-column spans.

### G3. Tailwind-style utility classes
- **`text-gray-500` literal-color utilities** — Toolskin utilities reference tokens: `.ts-text-secondary` resolves to `--ts-text-secondary` which resolves through the chain.
- **`p-4 m-2 gap-3` direct spacing classes** — Toolskin uses `.ts-p-4`, `.ts-mt-4`, `.ts-gap-4` but these resolve to `--ts-sp-4` tokens. The `--ts-` prefix is non-negotiable.
- **JIT one-off classes (`pt-[27px]`)** — never. Every value comes from a token.
- **Stack of 15 utility classes on one element** — Toolskin prefers component-class + 1-2 modifier classes + token overrides.

### G4. Generic shadcn-default aesthetic
- **`bg-background text-foreground border-input` semantic-name utilities** — Toolskin uses surface-tier numbering (`--ts-bg-0/1/2/3/4/5`) for primitives, NOT semantic-name primitives. The semantic layer is `--ts-this-*`.
- **Lucide icons as the default icon system** — Toolskin uses Font Awesome 6 + Ionicons web components (pinned versions per CLAUDE.md §5b). Icon glyph choices are deliberate.
- **`rounded-lg` literal radius application** — every radius is a token reference (D1).
- **Tabs that scale border-radius equally on all 4 corners** — Toolskin tabs use top-corners-only (F11).
- **Form field `<label>` floating above input** — Toolskin's `.ts-field` pattern (per `card-layout-rules.md`) wraps label-above + control-below in a `.ts-field` container with intentional spacing.

### G5. Generic CSS-only LLM-default
- **CSS custom properties WITHOUT a `--ts-` prefix** — non-negotiable namespace.
- **`background: linear-gradient(135deg, #aaa, #bbb)`** — never raw colors. Always derivative tokens.
- **`transition: all 0.3s ease`** — never raw `ease`. Always `var(--ts-ease-out)`.
- **`@media (min-width: 768px)` raw breakpoint** — should use `--ts-bp-*` tokens (S2 spec proposes adding; rebuild MUST formalize).
- **Inline color values inside `box-shadow`** — every shadow color comes from `color-mix(in srgb, var(--ts-accent), transparent N%)` or a token.

### G6. Visual identity defaults Toolskin rejects
- **Inter / Roboto / Arial as defaults** — Space Grotesk is the anchor (`typography-master` non-negotiable). JetBrains Mono is the monospace anchor.
- **Purple-on-white** — the "AI made this" signal (`expert-designer/design-theory.md:48`). Toolskin defaults orange-on-near-black.
- **Symmetric center-aligned hero** — Toolskin heroes use spatial tension: asymmetric grids, overlap, off-center elements (`expert-designer/design-theory.md:60`).
- **Flat solid backgrounds** — Toolskin uses gradient overlay + grain texture + radial accent glow as atmospheric layers (`--ts-grain`, `--ts-accent-glow-bg-2`, `--ts-radial-depth`).

═══════════════════════════════════════════════════════════════════════
## §H — OPEN QUESTIONS FOR GATE 5
═══════════════════════════════════════════════════════════════════════

Anomalies where the in-house skill and the live CSS disagree, OR where the CSS shows multiple options without a clear authoritative source. Surfaced per Rule 11 (halt on anomaly, never improvise).

### OQ-A6 — Font-size base: 13px (CSS) vs 16px (typography-master skill)

The live CSS uses `--ts-fs-base: 13px` (`assets/css/toolskin.css:286-288`, with `0.8rem` declaration overridden by the px declaration on the next line). The `typography-master/references/font-catalog.md` "Toolskin-specific guidance" says: "Scale rule: Prefer modular ratio (1.125–1.25×) from 16px base, snapped to 4pt grid." 13px ≠ 16px.

**Resolution options:**
1. Keep 13px (CSS wins). Update typography-master skill to align ("Toolskin operates at 13px base — denser than typical 16px Material/Tailwind, signaling tool-system UI density").
2. Move rebuild to 16px base. Recompute every harmonic step. Breaks visual parity with showcase.
3. Expose both as primitives (`--ts-fs-base-ui: 13px`, `--ts-fs-base-marketing: 16px`); component CSS picks per context.

**Recommendation embedded in CSS:** 13px is intentional ("Smallest comfortable UI text. Override per project." comment at `:287`). Owner decision required.

### OQ-B3 — Heading weights: literal `800` (CSS) vs `--ts-font-weight-*` token (system)

H2 (`assets/css/toolskin.css:1952`) and `.ts-section-title` (`:2114`) declare `font-weight: 800` as a literal, not as `var(--ts-font-weight-*)`. But `--ts-font-weight-bold: 700` and `--ts-font-weight-black: 900` exist — no `800` token. Inconsistent.

**Resolution options:**
1. Add `--ts-font-weight-extra-bold: 800` primitive. Update H2 + section title to reference it.
2. Round H2 and section title to 700 (`--ts-font-weight-bold`) — slightly lighter look.
3. Round H2 and section title to 900 (`--ts-font-weight-black`) — same as H1.

**Owner decision required.** Affects visual parity baseline.

### OQ-C7 — Derivative dim-ladder count: 7 steps (CSS) vs 4 steps (S2 proposal)

Live CSS has `--ts-this-bg-dim-1/2/3/4/5/6/7` (transparency at 12%, 25%, 50%, 60%, 70%, 80%, 90% — `:983-989`). Wave 2.2 S2 spec proposes capping at `-dim-4` and composing `-dim-5+` inline per component when needed.

**Resolution:** Owner approved S2 spec ("smallest sharpest set" principle). Rebuild ships `-dim-1/2/3/4` only; any component that previously referenced `-dim-5/6/7` documents the migration in the per-block sandbox. Acknowledged in S2 §3.3 note. Surfacing here so Sessions 4+ block sandboxes know to expect this contraction.

### OQ-D1 — Radius base: 8px (CSS) vs 10px (skill reference)

`assets/css/toolskin.css:484` declares `--ts-radius-base: 8px`. `expert-designer/references/toolskin.md:196` documents the same token as `10px` ("Radius (one value controls all)"). Showcase CSS wins.

**Resolution:** Update toolskin.md reference to match 8px. Marked in `_in-house-skills-update-todo.md` (already flagged for skills update pass).

### OQ-E3 — Marquee `pointer-events: none` hardcoded fix

`assets/css/toolskin.css:15794-15795` author comment: "I added pointer event none to avoid the animation stop on hover. This should be removed when the behaviour is removed from the defaults. This is a hardcoded temporary fix."

**Resolution:** The rebuild's marquee component CSS should:
- Either expose a `--ts-marquee-pause-on-hover: 0` token (default 0 = no pause) and consume it via `animation-play-state: var(--ts-marquee-pause-on-hover, paused)` mechanism — letting the canonical pattern handle hover-pause as opt-in.
- OR remove `pointer-events: none` and accept hover-pause as a feature (matches typical marquee UX), then document it.

**Owner decision required.** The "temporary fix" framing in the comment suggests the owner expects this to be designed out — recommend exposing as token.

### OQ-E4 — Reduced-motion blocks partially commented

`@media (prefers-reduced-motion: reduce)` exists at 5 locations but 2 are commented out (`:1541`, `:10903`). The rebuild must normalize this to a single canonical override block — the partial deployment is a Wave 1.5 surfacing.

**Resolution:** Add to S5 protocol verification: every block sandbox must declare its own reduced-motion override OR inherit from a canonical motion-reset block at the system layer. Owner approve approach.

### OQ-C-extra — `--ts-this-bg-dark` declared TWICE with different values

`assets/css/toolskin.css:978` `--ts-this-bg-dark: color-mix(in srgb, var(--ts-this-bg), #000000 14%);` followed by `:995-996` two more declarations of the same token — the last one wins (`color-mix(in srgb, var(--ts-this-bg), #000000 var(--ts-this-bg-grad-dark-pct, 14%));`). Same final value, but the duplicate declarations are confusing.

**Resolution:** Rebuild's `system/surfaces.css` declares each token EXACTLY ONCE. S2 spec already enforces this.

### OQ-F4 — Card `.gradient` modifier uses linear-gradient as `--ts-card-bg`

`assets/css/toolskin.css:5176-5178` `.ts-card.gradient` swaps `--ts-card-bg` to `linear-gradient(180deg, var(--ts-bg-2) 0%, var(--ts-bg-1) 100%)`. This works because `--ts-card-bg` is used in `background: var(--ts-card-bg)` (shorthand that accepts gradients). But the design-tokens-2.0 expectation is that surface tokens hold color values, not gradients — gradients live in `--ts-this-bg-grad`.

**Resolution:** Rebuild's card-gradient variant should use `background-image: var(--ts-this-bg-grad-N)` overlay on top of `background-color: var(--ts-card-bg)`. Two-property composition, not gradient-as-color-token. Owner approve approach.

### OQ-Logo / Pitchdeck — no branding directory found

The reading order asked to check `../toolskin-showcase/branding/` and `../toolskin-showcase/pitchdeck/`. Neither directory exists in the reference repo (Glob returned no files).

**Resolution:** No additional branding artifacts to extract design DNA from. Logo design lives entirely in `.ts-topbar__logo` CSS (F9) — wordmark-only, grid-composition, uppercase-display-tracked. No mark / icon-logo / pictorial logo system documented in the repo. If owner has a wordmark + mark + favicon system elsewhere, surface it for the rebuild.

═══════════════════════════════════════════════════════════════════════
## §I — SUMMARY: VISUAL DNA CHECKLIST FOR S5 PROTOCOL
═══════════════════════════════════════════════════════════════════════

Every block sandbox in Sessions 4+ MUST verify against:

**Spacing (A1–A6):**
- [ ] Atomic component padding = ratio of height (never raw `--ts-sp-N`)
- [ ] Chip strip preserves 10 protected style factors (Rule 9)
- [ ] Nested cards use `--ts-radius-nest-reduction` / `--ts-pd-nest-reduction`

**Typography (B1–B7):**
- [ ] Letter-spacing is role-coded (display tight / body normal / UI wide / eyebrow wider / button 0.055em)
- [ ] Line-height ladder follows size-inverse (display 0.9 → long-form 1.75)
- [ ] Caps reserved for buttons / chips / tabs / labels / display titles / logo only
- [ ] Eyebrows outside harmonic ladder (raw 9px)

**Color (C1–C7):**
- [ ] Accent solid only on `.ts-btn--primary` + `.ts-chip--accent/--active`
- [ ] All other accent usage = tinted/bordered/glowed via derivative tokens
- [ ] `--ts-on-accent` OKLCH for any accent-bg element (no hardcoded `#fff`/`#000`)
- [ ] Surface re-scope via `--ts-this-bg`, never `background: var(--ts-bg-N)` direct
- [ ] No default `box-shadow` on atomic/molecular surfaces

**Radius (D1–D4):**
- [ ] Component radius via component-scoped token, not raw value
- [ ] Sharp corners (radius 0) only at edge-flush composition points
- [ ] Nest-reduction telescoping for card-in-card

**Motion (E1–E6):**
- [ ] Easing from 11-curve palette, role-bound
- [ ] Duration from `--ts-dur-fast/base/slow/slower` ladder (220/300/550/700ms)
- [ ] Marquee uses `translateX(-50%)` seamless pattern with 45s linear
- [ ] Reduced-motion block declared

**Anti-patterns (G1–G6):**
- [ ] No Material FAB / ripple / elevation-by-shadow / 3-curve easing
- [ ] No Bootstrap `.btn-primary` literal blue / `border: 1px solid #ced4da` patterns
- [ ] No Tailwind-style JIT or non-token utilities
- [ ] No shadcn semantic-name primitives (`bg-background`)
- [ ] Space Grotesk + JetBrains Mono only; no Inter/Roboto/Arial defaults

═══════════════════════════════════════════════════════════════════════
## §J — STATUS
═══════════════════════════════════════════════════════════════════════

- **Layer A (in-house Tier 1 skills):** READ in full — expert-designer SKILL + toolskin.md + design-theory.md + css-and-systems.md + card-layout-rules.md + css-integration-discipline.md; typography-master SKILL + font-catalog.md; design-tokens-2.0 SKILL.md.
- **Layer B (Wave 1+2 outputs):** READ in full or via targeted heads — T1, T2 + T3 + S1 + S2 (heads for context; full outputs already binding from prior dispatches).
- **Layer C (reference CSS):** TARGETED reads on ~12 component sections via grep-locate-then-read; ~3,500 lines of CSS surveyed for evidence.
- **Branding / pitchdeck:** Glob confirmed empty (OQ-Logo).
- **Output written to:** `D:\Mis Documentos\Projects\Toolskin Framework\toolskin-rebuild\docs\handoffs\_rebuild-design-dna.md` ✅

**Signature pattern count:** 31 patterns extracted (A: 6, B: 7, C: 7, D: 4, E: 6, F: 12 component DNA paragraphs).
**Component DNA paragraphs:** 12 (chip, chip-strip, button, card, input, tree, marquee, modal, topbar, accordion, tabs, toast).
**Anti-patterns enumerated:** 30 across 6 categories (Material, Bootstrap, Tailwind, shadcn, generic CSS, visual identity).
**Open questions surfaced:** 9 for Gate 5 review (OQ-A6, OQ-B3, OQ-C7, OQ-D1, OQ-E3, OQ-E4, OQ-C-extra, OQ-F4, OQ-Logo).
**In-house skill ↔ CSS contradictions:** 3 (OQ-A6 base 13px vs 16px; OQ-D1 radius 8px vs 10px; OQ-C7 dim ladder 7-step vs 4-step proposal).

**Status:** `DONE_WITH_CONCERNS` — extraction complete; 9 open questions require Gate 5 owner decisions before Sessions 4+ block sandboxes can run a strict design-DNA-conformance gate.
