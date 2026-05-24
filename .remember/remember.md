# TOOLSKIN REBUILD — CORE MEMORIES
# This file is the cold-start authority. If remember.md is empty, restore from here.
# Never wipe this file. Never overwrite without owner approval.
# Last updated: 2026-05-24 · Session 4 pre-start

## PROJECT
Owner: Satoshi / SatSea (satsea.io)
Repo: toolskin-rebuild (master) · Reference (READ-ONLY): toolskin-showcase
HEAD at last close: f7d5e19
Purpose: Token-driven CSS design system. Zero framework. One stylesheet. Full dynamic control.

## ACTIVE RULINGS (binding, non-negotiable)
R1:  Surfaces = 10 hand-curated presets. NOT apcach-derived.
R2:  colors.css bakes one default + variant classes (.ts-preset-*)
R3:  BASE FONT OVERRIDE (2026-05-24): 13px restriction ANNULLED.
     Scaling is flexible. May resolve to 16px. Width-aware model is spec.
     Mathematical stability + token inheritance = only acceptance criteria.
R4:  --ts-on-accent threshold = 0.75
R5:  Spacing stops at --ts-sp-16. sp-17..24 DROPPED.
R6:  No second CSS audit pass needed.
R7:  apcach is the constant engine. CSS composes, apcach decides amounts.
     Dual-metric: APCA for Lc≥12, culori OKLCH ΔL for sub-floor constants.
     Sub-floor ΔL measured from root-tokens-blocks-reference.css (done).
     APCA loClip finding: sub-Lc-10 unreachable → culori ΔL path.
     Pattern-16 Option B: engine bakes per preset, CSS composes.
R8:  Session 3.x mandatory before Session 4.
R9:  Pattern 4 — re-anchor FIRST (--ts-this-bg: var(...)), consume SECOND.
R10: Pattern 2 (iconlist) — carry knob, drop hardcoded literal.
R11: Surface derivatives extended pre-emptively in Session 3.x.

## RULING 7 CONSTANT TABLE (approved)
border-rest Lc 15 · border-hover Lc 30 · border-active Lc 30
border-0 Lc 8 · border-disabled Lc 8 · border-focus = accent pass-through
dark Lc 8 · bright Lc 6 · hover-surface Lc 12 · active Lc 8 · disabled Lc 18
text: Lc 75/45/25 (Session 2) · border-dim = ratio of border-rest
grad-angle = geometry-exempt

## VISUAL QUALITY RULES (VQ) — from council differential
VQ-1: Hero headline MUST be ≥ step 7 (38.81px at 13px base / ~57px at 16px base)
      with negative letter-spacing (≥ --ts-tracking-tighter).
VQ-2: Every page MUST have ≥1 asymmetric grid (Nfr Mfr where N≠M).
VQ-3: --ts-font-mono (JetBrains Mono) MUST be loaded AND used for numeric/data/label slots.
      Declaring it without loading is a silent identity failure.
VQ-4: Backgrounds MUST vary across sections (≥3 distinct surface values per page).
VQ-5: Accent MUST be used on at least ONE solid surface (full-paint tile or CTA).
VQ-6: --ts-alt companion color MUST be present in Hero/Bento compositions.
VQ-7: The live accent-lab (HSL sliders → page repaint) is the system's proof-of-concept.
      It MUST exist in sandbox/00-design-reference before Session 4 opens.
VQ-8: Surface superposition MUST be demonstrated under compositional pressure (bento),
      not just on isolated swatches.

## MUST-NOT-HAPPEN-AGAIN (behavior rules)
B-1: Agent ran after owner interrupt. Owner had to force-kill.
     FIX: Any owner message = FULL STOP all background agents.
B-2: Sandbox passed audit but was visually rejected ("piece of shit").
     FIX: Audit score is NOT acceptance. Visual match to approved screenshot IS acceptance.
B-3: remember.md wiped on session start (memory consolidation bug).
     FIX: Always restore from core-memories.md first. Commit restore before any work.
B-4: Orchestrator executed tasks instead of dispatching sub-agents.
     FIX: Orchestrator writes manifesto + dispatches. Never executes.
B-5: Tasks chained without halts. Sessions ran uncontrolled.
     FIX: One task, one halt, one report. Never chain without explicit GO.

## EXPERT-DESIGNER V7 (the design law)
Location: expert-designer/ (project root)
Priority: 100 — activates FIRST for any design task
SKILL.md: mandatory read before any visual task
ANTI-DEFAULT-PROTOCOL.md: mandatory read BEFORE SKILL.md

Two-gate enforcement (BOTH must pass before any HTML ships):
  node expert-designer/scripts/audit-boring.mjs <file>   ← conviction detector
  node expert-designer/scripts/audit-design.mjs <file>   ← token compliance

Six approved starters (agents FILL these, never design layouts):
  01-centered-hero.html      DEV only — single message
  02-magazine-split.html     EDIT — editorial/publication
  03-asymmetric-hero.html ★  MKTG default
  04-oversized-type.html     POSTER — brutalist/statement
  05-bento-landing.html   ★  PRODUCT default
  06-magazine-toc.html       PORTFOLIO — lists/indices

Manifesto (6 lines, BEFORE any HTML):
  Task class / Starter / The ONE move / What I will NOT do /
  Reader's eye pivots at / Container variation / Background variation

RULING 3 OVERRIDE applies: tokens.css base may remain at 16px until
width-aware scaling model is integrated. DO NOT change to 13px without
verifying mathematical stability of full ladder.

Session 3.x alignment pending (mechanical, do in Phase A of next session):
  - tokens.css: remove sp-20/sp-24/sp-32 (RULING 5)
  - generate-colors.js: re-copy from tools/color-engine/ after RULING 7 bake
  - RULING 9 callout in 06-component-recipes.md §10

## SYSTEM LAYER STATUS (session 4 pre-start)
DONE:
  assets/css/next/primitives/colors.css          ✅ 10 presets, dual-emit
  assets/css/next/primitives/typography.css      ✅ exists (naming collision — see B1 below)
  assets/css/next/primitives/spacing.css         ✅ exists (naming collision — see B1)
  assets/css/next/primitives/radius.css          ✅
  assets/css/next/primitives/motion.css          ✅
  assets/css/next/system/surfaces.css            ✅ hue-locked OKLCH, two-block, hand-tuned (RULING 7 pending)
  sandbox/00-design-reference/index.html         ✅ audit-clean, REJECTED visually (needs VQ fixes)
  expert-designer/ v7                            ✅ installed + Phase A partial (sp-20/24/32 remain)

BLOCKING (must ship before Session 4 block 1):
  B1: Naming collision — sandbox uses --ts-fs-base/--ts-sp-N flat,
      primitives use --ts-font-weight-thin/--ts-sp-base×density.
      SANDBOX NAMES WIN. Rewrite primitives to match.
  B2: system/text.css MISSING — font stack + scale aliases
      system/accent.css MISSING — accent derivative chain
  B3: JetBrains Mono declared but NOT LOADED. One-line fix.
  B4: RULING 7 engine bake — generate-colors.js not yet updated.
      ΔL constants measured (docs/handoffs/_ruling-7-deltal-measurement-report.md).

SESSION 4 BLOCK ORDER (dependency-optimized):
  Block 1: ts-input        (4h) — needs B1+B2+B3
  Block 2: ts-btn          (3h) — needs Block 1 height parity
  Block 3: ts-chip+badge   (3h) — needs Block 2
  Block 4: ts-card-stat/feature (4h) — needs Blocks 1-3
  Block 5: ts-toolbar      (4h) — needs Block 2
  = 5 blocks, ~18h build + 3h audit = 21h = 1 week

## APPROVED VISUAL TARGET
expert-designer/screenshots/expert--designer-showcase.jpg
expert-designer/showcase.html

EVERY sandbox is measured against this. Not against an audit score.
If it doesn't look like this: it fails regardless of commit count.

## BRANCH CONVENTION
design/<feature>  ← Claude Design produces HTML (must pass both audits)
feat/<feature>    ← Claude Code translates HTML → tokens + components (never redesigns)
Design merges into feat/* via PR. HTML artifact IS the spec.

## COLD-START PROTOCOL (every new session)
1. git log --oneline -5 + git status
2. Confirm HEAD
3. If remember.md empty: restore from this file + commit immediately
4. State the visual goal for this session in ONE sentence
5. Name the visual target file (screenshot or HTML)
6. Only then: dispatch agents
