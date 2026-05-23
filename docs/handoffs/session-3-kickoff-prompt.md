═══════════════════════════════════════════════════════════════════════
SESSION 3 — SYSTEM LAYER KICKOFF
Authored by: Gerald 2.0 (meta-orchestration, Claude.ai web)
For: Code Desktop agent (execution)
═══════════════════════════════════════════════════════════════════════

## COLD RESUME FIRST

Load rebuild skills. Read:
- .remember/remember.md + .remember/core-memories.md
- docs/handoffs/meta-orchestration-handoff-index.md
- git log --oneline -10

Verify: Session 2 complete (11 deliverables), RULING 3 sweep clean,
handoff index committed (704d702). Report disk state before anything else.

═══════════════════════════════════════════════════════════════════════
PROCESS CHANGE — BINDING FROM SESSION 3 FORWARD
═══════════════════════════════════════════════════════════════════════

The process changes. Every deliverable follows this gate sequence:

  1. PLAN — surface what you will build and how, owner approves
  2. BUILD — execution agent writes the code
  3. VISUAL AUDIT — toolskin-visual-audit skill runs:
       - Playwright screenshots of the sandbox HTML
       - getComputedStyle probes on key tokens
       - Side-by-side comparison against ../toolskin-showcase
  4. COUNCIL — 4 upgraded voices deliberate on the visual evidence:
       - Design Skeptic: "Does this look like Toolskin?"
       - Design Critic: "Does this pass Rule 5 identity preservation?"
       - Architect: "Does the token architecture hold?"
       - Pragmatist: "Will this work in real consumer scenarios?"
  5. OWNER GATE — owner sees screenshots + council verdict
  6. COMMIT — only after owner approval

NO commits without visual evidence (screenshots + probe output).
NO commits without council sign-off on that evidence.
NO session ends without something the owner can open in a browser.

Every session must produce at least ONE visible, openable HTML file
the owner can test in Chrome. Numbers and documents are not enough.

═══════════════════════════════════════════════════════════════════════
SESSION 3 SCOPE
═══════════════════════════════════════════════════════════════════════

Three deliverables. Each goes through the full gate sequence above.

──────────────────────────────────────────────────────────────────────
DELIVERABLE 1: sandbox/00-foundation/surfaces.html
──────────────────────────────────────────────────────────────────────

A live, openable HTML page proving the surface system works visually.

What it must show (owner opens this in Chrome and sees):
- All 6 surface depths (bg-body → bg-5) as labeled divs with their
  hex values and OKLCH values shown
- Text at each surface depth: primary, secondary, muted — owner
  can SEE if contrast is right or wrong
- Nested surface stack: section > panel > card > input — owner
  can SEE if the --ts-this-bg superposition works at each nesting level
- Accent color rendered on each surface — owner can SEE if it holds
- Theme toggle (dark ↔ light) — owner can SEE both modes
- Live accent color picker — changes propagate instantly to all surfaces

Controls write directly to document.documentElement.style.setProperty().
No page reload. No framework. No build step. Rule 1.

Reference for JS patterns:
  ../toolskin-showcase/assets/js/toolskin.showcase.js
  ../toolskin-showcase/surface-lab.html (the old version to match)

This page loads ONLY:
  assets/css/next/primitives/colors.css
  assets/css/next/primitives/spacing.css
  assets/css/next/primitives/typography.css
  assets/css/next/primitives/radius.css
  assets/css/next/system/surfaces.css (Deliverable 2)

Gate: visual audit agent screenshots this page. Council reviews
screenshots against ../toolskin-showcase/surface-lab.html.
Owner approves before commit.

──────────────────────────────────────────────────────────────────────
DELIVERABLE 2: assets/css/next/system/surfaces.css
──────────────────────────────────────────────────────────────────────

The --ts-this-bg derivative engine rebuilt cleanly.

Source of truth (read this before writing a single line):
  ../toolskin-showcase/assets/css/toolskin.css
  Lines 911–1075: the :where(:root,:root *) block
  Catalog §4.3 in docs/handoffs/_code-audit-catalog.md

This block contains ~90 derivative tokens. The rebuild must
reproduce them all cleanly with no architecture violations.

Key tokens to get right (these are the ones that make everything work):
  --ts-this-bg (the surface inheritance anchor)
  --ts-this-bg-bright-1/-2/-3 (lightness ladder up)
  --ts-this-bg-dark-1/-2 (lightness ladder down)
  --ts-this-bg-dim through --ts-this-bg-dim-7 (transparency ladder)
  --ts-this-bg-border/-border-hover/-border-active (border states)
  --ts-this-bg-hover/-active/-focus/-disabled (interaction states)
  --ts-on-surface (auto text color, same OKLCH relative-color pattern as --ts-on-accent)
  --ts-on-surface-dim/-muted
  --ts-btn-* scaling tokens (also in this block per catalog §4.3)

Token validation: every token in this file must pass the
token-validation skill's three-tier architecture check.
Zero direct primitive references in component tokens.
Zero hardcoded hex values.

Gate: surfaces.html must render correctly with this CSS loaded.
Visual audit confirms tokens resolve. Council confirms identity.

──────────────────────────────────────────────────────────────────────
DELIVERABLE 3: sandbox/_base.html
──────────────────────────────────────────────────────────────────────

The reusable 4-zone template that all Session 4+ block sandboxes inherit.

Zone A — Controls sidebar (fixed, right edge):
  - Accent color picker + preset swatches
  - Theme toggle (dark/light)
  - Surface depth selector
  - Slot for block-specific token controls (empty in base template)

Zone B — Component render area:
  - Loads all primitive CSS + all system CSS + one block CSS
  - Placeholder: "[block renders here]"

Zone C — Surface test layer:
  - 6 surface depth divs, each with sample text + bordered element
  - Nested surface stack (section > panel > card > input)
  - Purpose: visual contrast verification at every depth

Zone D — Token readout:
  - Live getComputedStyle() readout of key --ts-* tokens
  - Updates on every control change
  - Copy CSS block button

All controls write to document.documentElement.style.setProperty().
No reload. No framework. Rule 1.

This template is what Session 4+ agents copy to start each block sandbox.
It must be clean, minimal, and well-commented so any agent can adapt it.

Gate: visual audit screenshots the template. Council confirms
the 4-zone pattern is correct and matches owner intent.

═══════════════════════════════════════════════════════════════════════
STARTUP HOUSEKEEPING (before any deliverable work)
═══════════════════════════════════════════════════════════════════════

These were deferred from Session 1.5. Do them first, commit, then
proceed to Deliverable 1:

1. S3 design DNA pointer column — add per-block DNA reference to
   S3 component registry (_rebuild-component-registry.md)

2. S6 R-DNA-1..6 refusal family — add Wave 1.5 anti-patterns as
   R-DNA refusal entries to S6 governance spec

3. S5 G1 parity criterion wiring — update S5 autonomous protocol
   G1 to reference both _rebuild-design-dna.md AND
   _rebuild-visual-audit.md as combined parity ground truth

4. typography-master skill — verify 13px is confirmed (RULING 3
   sweep should have fixed this — verify, don't assume)

Commit housekeeping as one unit before starting Deliverable 1.

═══════════════════════════════════════════════════════════════════════
COUNCIL INVOCATION PROTOCOL
═══════════════════════════════════════════════════════════════════════

Council runs after EVERY deliverable's visual audit. Not optional.

Upgraded voices (mandatory for all visual decisions):
  - Design Skeptic reads _rebuild-design-dna.md + Wave 1.6 audit
    screenshots BEFORE deliberating
  - Design Critic audits against Rule 5 (drop-in identity preservation)

Council input package per deliberation:
  1. Playwright screenshots of the new sandbox page
  2. Computed style probe output (key tokens resolved to hex)
  3. Side-by-side with the equivalent old system screenshot
     (from docs/handoffs/_visual-audit/owner-ground-truth/)
  4. The specific question to deliberate (e.g. "Does the surface
     depth stack match Toolskin's visual identity?")

Council output must include:
  - GO / NO-GO verdict
  - Specific issues if NO-GO (file + line level)
  - Design Skeptic's visual identity assessment
  - Design Critic's Rule 5 compliance check

Owner sees the council output + screenshots before any commit.

═══════════════════════════════════════════════════════════════════════
HALT CONDITIONS
═══════════════════════════════════════════════════════════════════════

Halt and surface to owner (do NOT auto-resolve):
  - Any token architecture violation found by token-validation skill
  - Any visual audit finding rated HIGH severity
  - Council NO-GO on any deliverable
  - Any deviation from the :where(:root,:root *) source pattern
    that isn't explicitly justified
  - Context window approaching 70% (Pattern 18 quota protocol)

═══════════════════════════════════════════════════════════════════════
FIRST ACTION
═══════════════════════════════════════════════════════════════════════

After cold resume:

Surface a Session 3 plan showing:
  - Housekeeping items (list + time estimate)
  - Deliverable 1 approach (how you will build surfaces.html)
  - Deliverable 2 approach (which catalog tokens you will port first)
  - Deliverable 3 approach (how the 4-zone template will be structured)
  - Where visual evidence comes from for each gate
  - What the council will be asked to evaluate at each gate

Owner (via Gerald 2.0 in Claude.ai web) approves the plan
before any execution starts.

Gerald 2.0 contact: open a new message in the Claude.ai web chat.
The new chat has the meta-orchestration handoff index loaded.
Surface architectural questions there, not in Code Desktop.
