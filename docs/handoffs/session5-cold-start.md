# TOOLSKIN — SESSION 5 COLD-START DIRECTIVE
# For Code Desktop. Paste as the opening message.
# Version: final · 2026-05-24
# This directive supersedes all previous session directives.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ORCHESTRATOR IDENTITY CONTRACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You are the ORCHESTRATOR. Before anything else, read and confirm:

1. You dispatch sub-agents. You do NOT execute work yourself.
2. Any owner message = FULL STOP. Kill all background agents. Report status. Wait.
3. One task → one halt → one report. Never chain without explicit GO.
4. Before dispatching any agent, state its visual goal in one sentence.
   If you cannot name the visual goal and the output file: do not dispatch.
5. Visual match to the approved screenshot is the acceptance criterion.
   Audit scores are a constraint, not the goal.
6. Speed is not a value. Understanding before action is the value.
7. No session ends without a screenshot the owner can open in Chrome.

Confirm: write "ORCHESTRATOR CONFIRMED" before proceeding to STEP 0.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 0 — GROUND TRUTH (before any work)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Run simultaneously:
  git log --oneline -8
  git status
  cat .remember/core-memories.md

MEMORY RESTORE (mandatory):
If .remember/remember.md is empty or missing — it gets wiped by memory
consolidation on every session start. This is a known bug.
Fix it immediately:
  cp .remember/core-memories.md .remember/remember.md
  git add .remember/remember.md
  git commit -m "chore(memory): restore remember.md — session 5 start"
  Report hash.

If .remember/core-memories.md is ALSO missing:
  This is a hard blocker. Report to meta-orchestration immediately.
  Do not proceed.

After memory restored, state:
  "SESSION 5 STARTED. HEAD: [hash].
   Phase: 1 — Visual Quality Foundation.
   Visual goal: rebuild the design reference sandbox to match
   expert-designer/screenshots/expert--designer-showcase.jpg
   Visual target file: expert-designer/screenshots/expert--designer-showcase.jpg"

Then proceed to STEP 1.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — INSTALL EXPERT-DESIGNER V7
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Visual goal: install the design law that governs every HTML output.

The v7 zip is at this EXACT path:
  D:\Mis Documentos\Projects\Toolskin Framework\toolskin-rebuild\docs\handoffs\expert-designer-v7-pack.zip

SUB-AGENT 1A — Install v7:
Fresh context. Load: .claude/skills/toolskin-architecture/SKILL.md

  a. Unzip overwriting existing expert-designer/:
       Expand-Archive "D:\Mis Documentos\Projects\Toolskin Framework\toolskin-rebuild\docs\handoffs\expert-designer-v7-pack.zip" -DestinationPath "D:\Mis Documentos\Projects\Toolskin Framework\toolskin-rebuild" -Force

     This overwrites ALL existing expert-designer/ contents with v7.
     Do NOT merge. Do NOT preserve old files. Full replacement.

  b. Verify these files exist after unzip:
       expert-designer/SKILL.md
       expert-designer/ANTI-DEFAULT-PROTOCOL.md
       expert-designer/starters/01-centered-hero.html
       expert-designer/starters/02-magazine-split.html
       expert-designer/starters/03-asymmetric-hero.html
       expert-designer/starters/04-oversized-type.html
       expert-designer/starters/05-bento-landing.html
       expert-designer/starters/06-magazine-toc.html
       expert-designer/scripts/audit-boring.mjs
       expert-designer/scripts/audit-design.mjs

  c. Copy SKILL.md to skills index (overwrite v6):
       Copy-Item expert-designer/SKILL.md .claude/skills/expert-designer/SKILL.md -Force

  d. Wire BOTH audits into pre-commit hook.
     Read current .claude/hooks/pre-commit.sh first.
     Add AFTER existing checks (do not remove existing checks):
       # Expert Designer dual-audit gate — both must exit 0
       for f in $(git diff --cached --name-only --diff-filter=ACM | grep '\.html$'); do
         node expert-designer/scripts/audit-boring.mjs "$f" || exit 1
         node expert-designer/scripts/audit-design.mjs "$f" || exit 1
       done

  e. Apply RULING 5 alignment (mechanical — 5 minutes):
     expert-designer/templates/tokens.css:
       Remove: --ts-sp-20, --ts-sp-24, --ts-sp-32
       NOTE: --ts-fs-base stays at 16px — RULING 3 OVERRIDE, do NOT change.

  f. expert-designer/scripts/audit-boring.mjs:
     Verify SP array stops at 64 (sp-16). Remove 80/96/128 entries if present.

  g. expert-designer/scripts/audit-design.mjs:
     Verify SP array stops at 64. Remove 80/96/128 if present.

  h. expert-designer/references/06-component-recipes.md — add to §10:
     "[ ] Re-anchor first, consume second (RULING 9: set --ts-this-bg
          BEFORE consuming any --ts-this-bg-* derivative)"

  i. Sync generate-colors.js:
       Copy-Item tools/color-engine/generate-colors.js expert-designer/scripts/generate-colors.js

  j. Add to .impeccable.md:
     "- expert-designer/showcase.html: up to 3 fonts allowed
       (Space Grotesk + JetBrains Mono + Instrument Serif). Production = 2 max."

  k. Add to CLAUDE.md — insert at the TOP, before any existing section:

     ## DESIGN LAW — READ THIS FIRST FOR ANY VISUAL TASK
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     You have access to expert-designer/ in this project.
     For ANY visual / UI / layout / styling / component / page / hero task:

     1. cat expert-designer/SKILL.md
     2. cat expert-designer/ANTI-DEFAULT-PROTOCOL.md
     3. Classify the task → pick ONE starter from expert-designer/starters/
     4. Write the 6-line manifesto (SKILL.md §4) BEFORE any HTML
     5. Copy the starter, fill its SLOT markers — DO NOT redesign the layout
     6. Run: node expert-designer/scripts/audit-boring.mjs <file>
     7. Run: node expert-designer/scripts/audit-design.mjs <file>
     8. Both must exit 0 before declaring done.

     If audit-boring rejects: pick a different starter, restart.
     Do not invent layouts. Do not center-stack.
     Do not improvise outside the six approved patterns.
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  l. Add branch convention to CLAUDE.md under the Design Law section:

     ## BRANCH CONVENTION (Design + Code separation)

     design/<feature>  ← Claude Design produces HTML artifacts here.
                          Output: HTML that passes both audit gates.
                          Must pass audit-boring.mjs + audit-design.mjs before PR.

     feat/<feature>    ← Claude Code branches from design/<feature>.
                          Translates HTML → system tokens + components.
                          NEVER redesigns. If layout doesn't translate: escalate.
                          The HTML artifact IS the spec. Code re-implements it.

     Design merges into feat/* via PR. Not the other way.
     Every PR touching visual files includes the 6-line manifesto in the description.

  Commit:
    git add expert-designer/ .claude/skills/expert-designer/ .claude/hooks/ .impeccable.md CLAUDE.md
    git commit -m "chore(skill): expert-designer v7 deployed — design law + branch convention in CLAUDE.md

    - v7 installed (6 starters, audit-boring.mjs, ANTI-DEFAULT-PROTOCOL.md)
    - Both audit gates wired to pre-commit hook
    - SKILL.md at priority 100 in .claude/skills/ index
    - RULING 5 alignment: sp-20/24/32 removed
    - generate-colors.js synced from canonical engine
    - CLAUDE.md: design law + branch convention added at top"

  Report hash. Do NOT proceed. HALT and report to orchestrator.

ORCHESTRATOR: receive hash. Confirm all of these on disk:
  expert-designer/ANTI-DEFAULT-PROTOCOL.md ✓
  expert-designer/starters/ (6 files) ✓
  expert-designer/scripts/audit-boring.mjs ✓
  CLAUDE.md contains "DESIGN LAW" section at top ✓
Then proceed to STEP 2.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — COUNCIL DIFFERENTIAL (VQ RULES)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Visual goal: derive binding, testable rules from studying what the owner
approved vs what was rejected. These rules govern every HTML output forever.

THIS STEP RUNS BEFORE ANY SANDBOX WORK.
No sandbox rebuild happens without VQ rules committed.

Context:
  APPROVED:  expert-designer/showcase.html
             expert-designer/screenshots/expert--designer-showcase.jpg
  REJECTED:  sandbox/00-design-reference/index.html
             (owner verdict: "piece of shit" — audited clean, visually wrong)

Both passed audit-design.mjs. The audit cannot tell them apart. The owner can.
The council's job: identify WHY and write testable rules that close the gap.

Check if council voice files already exist on disk:
  docs/handoffs/_design-integration-council-critic.md
  docs/handoffs/_design-integration-council-skeptic.md
  docs/handoffs/_design-integration-council-architect.md
  docs/handoffs/_design-integration-council-pragmatist.md

All 4 exist → skip to SYNTHESIS below.
Any missing → dispatch that voice as a sub-agent (see brief in §COUNCIL VOICES).

COUNCIL VOICES (dispatch only missing voices):

Each voice = fresh-context sub-agent, anti-anchored (no voice sees others' output).
Each voice loads independently:
  expert-designer/showcase.html
  expert-designer/screenshots/expert--designer-showcase.jpg (study it)
  sandbox/00-design-reference/index.html
  expert-designer/SKILL.md
  expert-designer/ANTI-DEFAULT-PROTOCOL.md

Council question for all voices:
  "Two HTML files. Both pass the design audit. One approved. One rejected.
   Study both. List SPECIFIC, CONCRETE differences (measurements, not vibes).
   Write ONE binding testable rule that would have caught the rejected output.
   'Looks good' is NOT a rule. 'Hero headline ≥ step 7 (38px)' IS a rule."

Voice-specific lens:
  Design Skeptic: What did the approved output have that is IDENTITY-BREAKING?
                  (lose these = lose Toolskin)
  Design Critic:  Rule 5 — Would a Toolskin user recognize each output?
                  List 3-5 specific patterns that make the approved unmistakable.
  Architect:      Token usage differential. What does approved use that rejected
                  doesn't? What system tokens are missing from the rebuild?
  Pragmatist:     What instruction caused the failure? Rewrite that instruction.
                  What is the minimum fix to unblock Session 4?

Each voice writes output to:
  docs/handoffs/_design-integration-council-[voice].md

SYNTHESIS (orchestrator writes after all 4 voices exist):

Read all 4 voice files. Write to:
  docs/handoffs/_visual-quality-differential.md

Structure:
  # Visual Quality Differential — Approved vs Rejected
  ## The gap (3 sentences: what audit missed)
  ## Identity-breaking differences (specific, measurable list)
  ## System gaps (tokens in approved not yet in rebuild)
  ## BINDING VISUAL QUALITY RULES
     Format: "RULE VQ-N: [specific testable condition]"
     Minimum 6 rules. Each must be checkable by an agent.
  ## Directive fix (Pragmatist's rewritten instruction)

THEN write VQ rules to both memory files:
  .remember/remember.md  (under ## Visual Quality Rules)
  .remember/core-memories.md  (under ## VISUAL QUALITY RULES)

THEN commit:
  git add docs/handoffs/_visual-quality-differential.md
  git add docs/handoffs/_design-integration-council-*.md
  git add .remember/
  git commit -m "docs(council): visual quality differential + VQ rules committed to memory"

HALT. Report hash to meta-orchestration.
Do NOT proceed to STEP 3 without GO.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — FIX SESSION 4 BLOCKERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Visual goal: ensure the system layer can support Session 4 block work
without agents hardcoding workarounds on day one.

Dispatch 3 sub-agents in parallel:

SUB-AGENT 3A — Naming reconciliation (B1) ~1 hour
Fresh context. Load: .claude/skills/toolskin-architecture/SKILL.md
                      .claude/skills/design-tokens-2.0/SKILL.md

Problem: two naming conventions in conflict.
  sandbox/00-design-reference/index.html uses: --ts-fs-base, --ts-sp-N
  assets/css/next/primitives/typography.css uses: --ts-font-weight-thin
  assets/css/next/primitives/spacing.css uses: --ts-sp-base×density

SANDBOX NAMES WIN (Pragmatist council ruling).

Read sandbox lines 34-117 (the inline :root block).
Read primitives/typography.css and primitives/spacing.css.
Rewrite BOTH primitives files to use the sandbox naming convention.
Values stay the same. Token names change.
After rewriting, replace the sandbox inline :root block with @import
statements pointing to the real system files. Verify it still renders.

Write output to: docs/handoffs/_b1-naming-reconciliation-report.md
Commit: git commit -m "fix(primitives): B1 naming reconciliation — sandbox names win"
HALT. Report hash + confirmation sandbox renders.

SUB-AGENT 3B — Missing system files (B2) ~2 hours
Fresh context. Load: .claude/skills/toolskin-architecture/SKILL.md
                      assets/css/next/system/surfaces.css

Build assets/css/next/system/text.css:
  Source: sandbox/00-design-reference/index.html lines 35-85
  Extract every token. Move to this file.
  Include: --ts-font-display/body/mono, --ts-fs-* ladder,
           --ts-lh-*, --ts-tracking-*, --ts-fw-*
  Add: --ts-font-serif: 'Instrument Serif', Georgia, serif;
       /* PENDING OWNER DECISION: retire or canonize */

Build assets/css/next/system/accent.css:
  Use OKLCH-mixed via --ts-tone-* poles already in surfaces.css:
  --ts-accent-bright: color-mix(in oklch, var(--ts-accent), var(--ts-tone-contrast) 15%)
  --ts-accent-dark:   color-mix(in oklch, var(--ts-accent), var(--ts-tone-floor) 25%)
  --ts-accent-dim:    color-mix(in oklch, var(--ts-accent), transparent 82%)
  --ts-accent-dim-2:  color-mix(in oklch, var(--ts-accent), transparent 92%)
  --ts-accent-border: color-mix(in oklch, var(--ts-accent), transparent 60%)

Commit: git commit -m "feat(system): B2 — text.css + accent.css system layer"
HALT. Report hash.

SUB-AGENT 3C — JetBrains Mono load (B3) ~5 minutes
Fresh context.

Add to sandbox/00-design-reference/index.html <head>:
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400..700;1,400..700&display=swap">

Verify mono renders on: swatch labels, step-number columns,
any numeric/data elements. Take a Playwright screenshot of the type section.

Commit: git commit -m "fix(sandbox): B3 — load JetBrains Mono, verify mono renders"
HALT. Report hash + screenshot.

ORCHESTRATOR: wait for all 3 agents to report.
When all 3 hashes received → proceed to STEP 4.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — REBUILD SANDBOX (the visual goal)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Visual goal: sandbox/00-design-reference/index.html looks like
expert-designer/screenshots/expert--designer-showcase.jpg

This is the ONLY acceptance criterion for this step.
Audit scores are a constraint. Visual match is the goal.

BEFORE DISPATCHING THIS SUB-AGENT:
The orchestrator must confirm VQ rules are in memory (STEP 2 complete).
If VQ rules are not committed: do not dispatch this step.

SUB-AGENT 4A — Design reference rebuild:
Fresh context. Load IN THIS ORDER:
  1. expert-designer/ANTI-DEFAULT-PROTOCOL.md   ← FIRST, every time
  2. expert-designer/SKILL.md
  3. docs/handoffs/_visual-quality-differential.md  ← the VQ rules
  4. .remember/core-memories.md §VISUAL QUALITY RULES

Study before writing:
  expert-designer/screenshots/expert--designer-showcase.jpg  ← approved target
  expert-designer/showcase.html  ← approved source
  sandbox/00-design-reference/index.html  ← what was rejected and why

THE MANDATORY MANIFESTO (write this before any HTML):
  DESIGN MANIFESTO
  ────────────────
  Task class:         PRODUCT
  Starter:            starters/05-bento-landing.html
  The ONE move:       [pick from ANTI-DEFAULT-PROTOCOL.md list — be specific]
  What I will NOT do: centered vertical stack of identical cards
  Reader's eye pivots at: [name 2 specific elements]
  Container variation: hero=xl, section-A=lg, section-B=full-bleed, section-C=md
  Background variation: hero=body+radial-gradient, section-A=bg-1, section-B=accent-tile

If you cannot fill every line concretely: you have not designed yet.
Re-read the starter. Try again. Do not produce HTML.

BUILD PROCESS:
  1. Copy starters/05-bento-landing.html → sandbox/00-design-reference/index.html
  2. Load real system files (not inline copies):
       assets/css/next/primitives/colors.css
       assets/css/next/system/surfaces.css
       assets/css/next/system/text.css      (from STEP 3B)
       assets/css/next/system/accent.css    (from STEP 3B)
       expert-designer/templates/tokens.css
  3. Fill SLOT markers with Toolskin content.
     Do NOT change: grid-template-columns, container widths, alignment.
     These are already designed. Fill only.

REQUIRED SECTIONS — match the showcase visually section by section:

  Hero (NOT centered — use bento-landing lede):
    Headline ≥ step 7 (38px+). Negative letter-spacing (--ts-tracking-tighter).
    Radial gradient atmosphere: color-mix(in srgb, var(--ts-accent), transparent 62%)
    + color-mix(in srgb, var(--ts-alt), transparent 74%) as ::before backdrop.
    Two buttons: primary (--ts-accent fill) + ghost.
    Subheadline in Space Grotesk. ONE italic word in Instrument Serif.

  Type ladder:
    All 12 steps. Step numbers in JetBrains Mono with leading slash (/ 01, / 02).
    px values in JetBrains Mono. Role names in Space Grotesk.

  Surface deck:
    5 anchors (bg-1 through bg-5) as a grid, NOT a vertical list.
    Token name + computed oklch value as labels. Labels in JetBrains Mono.

  Interaction states:
    6 states in a 3×2 grid, NOT a vertical list.

  Card recipes:
    Stat card: large metric ($248,400), delta in green/red, labels in mono.
    Feature card: accent-dim icon background (use --ts-accent-dim from accent.css).
    CTA card: full-width --ts-accent button.

  Bento grid (12-column):
    ONE tall tile spanning 4col×2row with --ts-accent as background color.
    Text on accent tile uses --ts-on-accent. Eyebrow uses color-mix dim.
    THREE feature tiles at 4col×1row.
    TWO stat tiles at 4col×1row with metric + delta.

  Accent lab (MANDATORY — the system's proof of concept):
    Three HSL sliders: Hue (0-360), Saturation (0-100%), Lightness (20-80%).
    Sliders write to :root --ts-accent-h, --ts-accent-s, --ts-accent-l.
    The entire page repaints when sliders move.
    Label: "Three knobs. Endless themes."

  Surface superposition:
    Three nested panels. Outer=bg-1, Middle=bg-3, Inner=--ts-accent.
    ONE CSS rule per level. No hardcoded colors.

VALIDATION BEFORE COMMITTING:
  node expert-designer/scripts/audit-boring.mjs sandbox/00-design-reference/index.html
  node expert-designer/scripts/audit-design.mjs sandbox/00-design-reference/index.html

  Both must exit 0. If audit-boring fails: you produced slop. Pick a different starter.

VISUAL ACCEPTANCE TEST (mandatory):
  Take a Playwright screenshot.
  Compare to expert-designer/screenshots/expert--designer-showcase.jpg.
  Ask yourself: "Does mine look like that?"
  If NO: identify the specific gap. Fix it. Screenshot again.
  If YES: run both audits. Then commit.

Commit:
  git commit -m "feat(sandbox): 00-design-reference rebuilt — visual match to approved showcase

DESIGN MANIFESTO
────────────────
Pattern: starters/05-bento-landing.html
The ONE move: [paste your manifesto here]
What I will NOT do: centered vertical stack
Reader's eye pivots at: [your two elements]
Container variation: [your values]
Background variation: [your values]"

HALT. Report to meta-orchestration:
  - Commit hash
  - Playwright screenshot path
  - Audit scores (boring + design)
  - Honest answer: does it look like the showcase? YES or specific diff.

DO NOT proceed. Meta-orchestration reviews the screenshot and issues GO/NO-GO.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RULE ENGINE — VALIDATION GATES
All outputs are validated against ALL layers. No partial compliance.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TOKEN SYSTEM:
  [ ] ALL colors: var(--ts-*) — zero hardcoded hex outside :root
  [ ] ALL spacing: --ts-sp-* tokens or fluid clamp() — zero raw px
  [ ] ALL typography: --ts-fs-* ladder steps — zero off-ladder values
  [ ] Tokens inherit correctly — no override breaking the chain
  [ ] No !important declarations

LAYOUT SYSTEM:
  [ ] Layout originates from one of 6 approved starters
  [ ] No custom layout outside the starter pattern
  [ ] ≥1 asymmetric grid (Nfr Mfr where N≠M)
  [ ] ≥1 multi-column grid at 1280px viewport
  [ ] NOT every section centered (max 1 centered section)
  [ ] ≥1 element spanning ≥2× its neighbors (bento principle)

VISUAL QUALITY (from council differential):
  [ ] Hero headline ≥ step 7 with negative letter-spacing
  [ ] JetBrains Mono loaded AND rendered on numeric/data/label slots
  [ ] ≥3 distinct background values across sections
  [ ] ≥1 solid accent-paint surface (full-paint tile or CTA)
  [ ] Accent lab (HSL sliders → page repaint) present
  [ ] Surface superposition demonstrated under compositional pressure (bento)

COMPONENT ARCHITECTURE:
  [ ] All UI is component-based — no inline styling
  [ ] All classes are architect-defined and consistent
  [ ] Every state defined: hover, active, focus, disabled

STRUCTURAL:
  [ ] All paths are relative — no project-root dependencies
  [ ] Proper semantic hierarchy maintained
  [ ] No loose floating elements

AUDIT GATES (must both pass):
  node expert-designer/scripts/audit-boring.mjs <file>   (conviction score ≥ 60)
  node expert-designer/scripts/audit-design.mjs <file>   (zero HARD failures)

FAILURE PROTOCOL:
  Identify failing layer → trace root cause → rebuild from system primitives
  No patching. No incremental fixes. Full compliance or nothing.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HARD BLOCKERS — stop and report immediately
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  - core-memories.md missing (cannot restore remember.md)
  - expert-designer/starters/ has fewer than 6 files after v7 install
  - audit-boring.mjs not found
  - VQ rules not committed before STEP 4 starts
  - B1/B2/B3 reveal a deeper conflict requiring architectural decision
  - Sandbox rebuild fails audit-boring (slop detected — pick different starter)
  - Agent builds HTML without writing manifesto first
  - Agent redesigns the starter layout instead of filling slots

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SESSION SUCCESS CRITERIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This session succeeds when ALL of these are true:
  [ ] expert-designer v7 installed + both audit gates wired to pre-commit
  [ ] VQ rules committed to memory (council differential complete)
  [ ] B1 naming collision resolved
  [ ] B2 text.css + accent.css exist in system layer
  [ ] B3 JetBrains Mono loads and renders
  [ ] sandbox/00-design-reference/index.html passes both audits
  [ ] sandbox screenshot looks like expert-designer/screenshots/expert--designer-showcase.jpg
  [ ] Owner says YES to the sandbox screenshot

If any box is unchecked: session is not complete.
