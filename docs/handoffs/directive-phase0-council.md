# PHASE 0 — COUNCIL ON CURRENT STATE + FORWARD ORDER
# No execution. No code. Output = ONE ratified build order.
# Operating mode: 01-WORKING-MODE.md (phases not steps, no flag dance, no ceremony).

═══════════════════════════════════════════════════════
ORCHESTRATOR — how you run this
═══════════════════════════════════════════════════════
You dispatch 4 council voices, fresh context each, anti-anchored (no voice
sees another's output before writing its own). You do NOT deliberate yourself.
You collect all 4, write the synthesis, HALT for owner. No commit.

INVOKE THESE SKILLS (they exist in .claude/skills/ — use them, don't wing it):
  - council                 → run the 4-voice structure
  - context-budget          → keep each voice on LEAN inputs (the 5 md files
                              below + decisions/*), NEVER raw CSS. Context
                              exhaustion killed the council twice before.
  - design-tokens-2.0       → the 3-tier token law each voice reasons against
  - toolskin-architecture    → the project architecture each voice respects
  - rebuild-orchestration    → the phasing/ordering frame
  - architecture-decision-records → the OUTPUT format (write the ratified
                              order as an ADR in decisions/)

═══════════════════════════════════════════════════════
INPUTS — every voice reads these FIVE files, nothing else
═══════════════════════════════════════════════════════
LEAN ONLY. Do not open raw CSS/JS. These docs already distill it.
  docs/handoffs/STATE-AND-PLAN.md          ← the inventory + 7-phase plan
  docs/handoffs/SESSION-5-CLOSE.md         ← where we stand at c005e50
  docs/handoffs/01-WORKING-MODE.md         ← the operating law
  docs/handoffs/02-INTEGRATION-RECIPE.md   ← the engine integration recipe
  docs/handoffs/REFACTOR-ACHIEVEMENTS.md   ← old-vs-new, what the prize is
  + decisions/*.md (color-system, font-scaling, system-layer-status, style-separation)

═══════════════════════════════════════════════════════
WHAT IS ALREADY DECIDED — DO NOT RE-LITIGATE
═══════════════════════════════════════════════════════
- The layered architecture (primitives→system→components→utilities) is final.
- Claude Design's engine (this-bg-v2 oklab, gradients-v3, ts-btn v3.1) is the
  source of truth for surfaces/states/borders/gradients/button.
- oklab for chromatic state mixes (oklch = the purple bug). Settled.
- The new working mode (phases not steps, zip before risk, no flags) is law.
- The spine finding: components/ is empty; that is the core blocker. Settled.
- Nested component pattern (CSS-1) is the law for components. Settled.
A voice that re-debates these has failed. Confirm them, build ON them.

═══════════════════════════════════════════════════════
THE THREE QUESTIONS THE COUNCIL ACTUALLY ANSWERS
═══════════════════════════════════════════════════════
These are GENUINELY undecided. Each voice answers all three, concretely.

Q1 — MIGRATION ORDER (components/)
  After engine integration (Phase 1 places this-bg-v2, gradients-v3, ts-btn),
  what ORDER do the remaining components migrate from old toolskin.css into
  next/components/? Which component first — the one that reveals the most
  failure modes early, or the safest/most-isolated? Give a numbered order
  (input, card, chip, badge, toolbar, accordion, table, etc.) with a one-line
  reason per position. Name the SOURCE for each (old toolskin.css section vs
  engine file). Migration, NOT redesign — same .ts-* classes preserved.

Q2 — JS RUNTIME SCOPE (the 20k-line cleanup, never scoped)
  toolskin.js is 8,143 lines; total runtime ~20k across 11 modules. What is
  the MINIMUM inherited core (theme, accent, surfaces, init) that must be
  cleaned and kept? What gets DEMOTED to optional asset module (banner
  generator, galleries, offcanvas, cube-portfolio)? What gets DROPPED? Give
  a keep/clean/demote/drop verdict per module, with a one-line reason.

Q3 — AGENT PAGE-GENERATION (Phase 5, never thought through)
  "Agent generates pages following rules" — what does it ACTUALLY require?
  Inputs (which starters + which tokens + what recipe format)? The
  verification (which audits gate a generated page)? The minimum viable
  version — what is the smallest thing that proves the capability works?
  Be concrete: name files, name the recipe shape, name the gate.

═══════════════════════════════════════════════════════
THE FOUR VOICES (each answers Q1–Q3 through its lens)
═══════════════════════════════════════════════════════
Voice 1 — ARCHITECT: three-tier compliance, dependency order, what breaks
  if migrated out of order. Invoke design-tokens-2.0 + toolskin-architecture.
Voice 2 — PRAGMATIST: minimum work to a visible deliverable, time per phase,
  what unblocks the most downstream work fastest.
Voice 3 — SKEPTIC: where does this go wrong? Which component migration hides
  a dependency landmine? What in the JS cleanup risks breaking the showcase?
Voice 4 — PRODUCT: against REFACTOR-ACHIEVEMENTS.md — does this order get to
  the deliverable (showcase parity + page-gen) by the shortest honest path?
  What sequencing best demonstrates the 5 things we're buying?

Every answer must be CONCRETE — an order, a verdict, a file, a number.
"Should consider" / "looks good" = invalid. A criticism without a concrete
alternative = invalid.

═══════════════════════════════════════════════════════
SYNTHESIS (orchestrator writes after all 4 report)
═══════════════════════════════════════════════════════
Write to decisions/forward-architecture.md (ADR format):
  ## Status: ratified [date] at HEAD c005e50
  ## Q1 — Component migration order (the numbered list, agreed)
  ## Q2 — JS runtime keep/clean/demote/drop table
  ## Q3 — Page-generation MVP (inputs + recipe shape + gate)
  ## The critical path to deliverable (phase-ordered, effort estimates)
  ## Disagreements surfaced (if voices split, name it for owner to break)

═══════════════════════════════════════════════════════
HALT
═══════════════════════════════════════════════════════
Show owner the synthesis. NO COMMIT, no code, no execution. Owner ratifies
or breaks any tie. Only then does Phase 1 (engine integration) begin.

HARD BLOCKERS:
  - Any voice reads raw CSS/JS instead of the lean docs (context risk)
  - Any voice re-litigates a settled decision
  - Any answer without a concrete order/verdict/file/number
  - Any commit or code change during the council
