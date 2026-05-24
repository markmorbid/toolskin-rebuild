# Gerald 2.0 — New Additions Brief
**Appends to:** `gerald-2-consolidation-prompt.md`
**Process this fully before responding. If anything is unclear, ask before acting.**

---

## CORRECTIONS TO .impeccable.md (fix before sending to Code Desktop)

The `.impeccable.md` entry for media queries was wrong. Replace it with the
correct policy below. Also add the font-scaling and negative-radius entries.

```markdown
# Toolskin intentional design decisions — do not flag as violations

- Base font: 13px (intentional tool-system density — RULING 3)
- Nested cards with telescoping radius: intentional (nest-reduction system §6d)
- color-mix() for surface derivatives: intentional (CSS-native, no runtime JS)
- OKLCH color values: intentional (apcach-derived, dual-emitted with sRGB fallback)
- Space Grotesk 300-700 only: no 800 weight exists in this font
- Dark-first: light mode is a theme variant, not the primary theme
- Surface superposition (one rule, multiple nested contexts): intentional Rule 4

## Media query policy (NOT a no-media-query system)
Toolskin prioritizes intrinsic responsive design via:
  clamp() for fluid type + spacing
  auto-fit/auto-fill grids (no breakpoint needed for column count)
  tokenized sizing systems
  smart ratio-based scaling
Media queries ARE allowed and used when genuinely necessary. Rules:
  - Use only at foundational/base level, not per-component
  - Group ALL media queries by viewport condition, not by component
  - Each media query block groups ALL selectors for that condition
  - Inside each block, keep component grouping consistent with base layer
  - Avoid per-component media queries scattered through the stylesheet
  Do NOT flag intrinsic responsive techniques as "missing breakpoints."
  Do NOT flag absence of per-component media queries as a violation.
  DO flag if a layout is genuinely broken at a viewport (real failure).

## Font scaling system
The current font scaling system has known alignment issues being fixed.
Do NOT flag 13px base as a readability issue.
DO flag: icon/text vertical misalignment, button height inconsistency,
  icon size not tracking font scale, clamp() min > max inversions.
Math-based font scaling experiment exists at:
  docs/references/_components-docs/font-scaling-math-experiment.html
Read this file for context on the mathematical approach being adopted.

## Negative border-radius mask system
A mask-based negative border-radius system is being integrated.
Limitations are intentional: no borders, no shadows, no external decorators.
Use cases: special container shaping, tabs, controlled UI cards.
Reference: docs/references/_components-docs/ (check for the pen export)
Do NOT flag mask constraints as missing features.
```

---

## NEW ADDITION 1 — Media Query Policy

This is NOT a no-media-query system. The owner clarified:

**What Toolskin prioritizes:**
- `clamp()` for fluid typography and spacing
- `auto-fit` / `auto-fill` grids (columns respond without breakpoints)
- Tokenized sizing systems (ratio-based scaling)
- Smart calculated tokens

**Where media queries ARE used:**
- Foundational/base level only
- Grouped by viewport condition, not by component
- One media query block = all selectors for that condition
- Inside blocks: component grouping mirrors base layer structure

**What to avoid:**
- One media query per component group
- Scattered `@media` blocks throughout the stylesheet
- Using breakpoints for things clamp() handles naturally

**What to flag as violations:**
- A layout genuinely broken at a viewport size
- Icon/text vertical misalignment (known existing issue)
- Button height inconsistency across size variants

**Encode this in the system spec before Session 3.x closes.**
It affects how nesting.css, text.css, and all Session 4+ blocks are written.

---

## NEW ADDITION 2 — Font Scaling Math Experiment

**The problem:**
The current font scaling system has known alignment issues:
- Buttons: height/padding not mathematically consistent
- Icons: size not properly tracking font scale
- Text + icon vertical centering: inconsistent, never perfectly solved
- The current `clamp()` min/max values have inversions (min > max bug in hero)
- The harmonic ladder exists but the derived px values need math validation

**The owner's research:**
A developer approached this problem mathematically. The owner translated
this into an experiment file at:
`D:\Mis Documentos\Projects\Toolskin Framework\toolskin-rebuild\docs\references\_components-docs\font-scaling-math-experiment.html`

**What to do with it:**
This is a STUDY CASE, not a global implementation directive.

The goal is:
1. Read the file. Understand the mathematical approach.
2. Identify which specific improvements apply to Toolskin's existing
   font scaling system (the harmonic 1.12 ratio ladder from typography.css)
3. Evaluate specifically for: button height math, icon scaling math,
   text-icon vertical alignment fix
4. Determine: does this IMPROVE the existing system, or does it REPLACE it?
   Council decides this — not the execution agent alone.
5. Identify what is good for RESPONSIVE TITLES specifically (owner flagged
   this as the primary use case for this technique, not global)

**Scope boundaries:**
- DO evaluate for responsive title treatment (h1-h3 clamp values)
- DO evaluate for button height / icon size mathematical consistency
- DO evaluate for text-icon vertical centering fix system-wide
- DO NOT implement globally without council sign-off
- DO NOT replace the harmonic ladder without council sign-off
- The architecture decides (council), not the agent alone

**Council question when this reaches the gate:**
"Does the math-based font scaling experiment improve Toolskin's current
harmonic ladder results for: (a) responsive titles, (b) button height
consistency, (c) icon-text vertical alignment? What is the minimum
adoption scope that delivers the most improvement?"

---

## NEW ADDITION 3 — Negative Border-Radius Mask System

**What it is:**
A mask-based system for creating negative (concave) border-radius effects.
Responsive to border-radius tokens. Lightweight CSS.

**Known limitations (intentional, not bugs):**
- No borders allowed (mask clips them)
- No box-shadows (mask clips them)
- No external decorative elements

**Best use cases for Toolskin:**
- Special container shaping
- Tab components (the concave tab-to-content join)
- Controlled card variants
- UI patterns where convex/concave corner contrast is the design intent

**Reference pen:** `https://codepen.io/Marcos-Ribero/pen/JobyEXz`
CodePen blocks external fetch. Owner must export the pen HTML and save to:
`docs/references/_components-docs/negative-border-radius-system.html`

**What to do:**
1. Gerald 2.0: ask the owner to export the CodePen as HTML and place it
   at the path above. Do NOT proceed on this item without the local file.
2. Once file exists: read it, understand the mask technique
3. Assess: which Toolskin components benefit from this?
   Candidates: .ts-tab (tab-to-content join), .ts-card variants,
   special hero section shapes
4. Council question when ready: "Where does the negative border-radius
   mask system add genuine visual value in Toolskin without violating
   Rule 1 (no framework) or the surface-superposition system?"
5. This is NOT Session 3.x scope. Queue for Session 4+ after council
   validates the use cases.

**Block until file exists:** Do not send this to Code Desktop until
the owner confirms the HTML export is at the reference path.

---

## WHAT GERALD 2.0 MUST DO NOW

**Step 1 — Questions to ask the owner (if anything is unclear):**

Before writing the Code Desktop prompt, Gerald 2.0 must ask the owner
these questions if he does not have clear answers:

Q1: The font-scaling-math-experiment.html file — is it already at
`docs/references/_components-docs/font-scaling-math-experiment.html`
or does it need to be exported from the CodePen first?

Q2: The negative border-radius CodePen (JobyEXz) — has this been
exported to a local HTML file yet? If not, the owner needs to do this
before Gerald 2.0 can include it in any agent directive.

Q3: The 126-file commit (9291d08) — agent confirmed working tree is
clean. Are the 4 Pattern 8 picks (from the council output) still pending?
If yes, Gerald 2.0 cannot issue GO for Agent A ΔL measurement until
those picks are confirmed.

**Step 2 — What to send Code Desktop (only after questions answered):**

Append these items to the existing Session 3.x directive:

```
ADDITIONAL SCOPE FOR SESSION 3.x:

A. Media query policy — encode in system spec
   Before closing Session 3.x, add a binding section to
   docs/handoffs/_rebuild-system-spec.md covering the media
   query grouping policy. This governs all Session 4+ CSS files.

B. Font scaling math — read and assess only (no implementation yet)
   Read: docs/references/_components-docs/font-scaling-math-experiment.html
   Produce a 1-page assessment: what the math approach does, which
   specific Toolskin improvements it enables (responsive titles,
   button math, icon-text alignment), what the minimum adoption scope is.
   HALT and report to Gerald 2.0. Council gate before any implementation.
   Do NOT modify typography.css until council approves scope.

C. Negative border-radius system — BLOCKED pending owner file export
   Skip until owner confirms HTML file at:
   docs/references/_components-docs/negative-border-radius-system.html
   Gerald 2.0 will unblock this when file is confirmed.

D. .impeccable.md — update with corrected media query policy
   Replace the old "no media queries" entry with the full policy
   from the corrections section above. This must happen before
   any impeccable skill runs on Session 3.x sandboxes.
```

---

## UNSKIPPABLE BEFORE SESSION 4 STARTS

These must all be true before Session 4 block work begins:

- [ ] RULING 7 constants re-grounded (Agent A ΔL measurement complete)
- [ ] Pattern 8 picks (1-4) confirmed and encoded in remember.md
- [ ] Session 3.x deliverables: nesting.css + text.css + accent.css + surfaces.css extended
- [ ] Each deliverable: council GO received
- [ ] .impeccable.md updated with corrected media query policy
- [ ] Font scaling math assessment complete and council-approved scope defined
- [ ] Negative border-radius system: local file confirmed OR deferred to Session 5+
- [ ] Agent Teams enabled in .claude/settings.json
- [ ] Impeccable 8-skill pack installed
- [ ] web-accessibility skill installed
- [ ] All skills verified with: npx skills check
