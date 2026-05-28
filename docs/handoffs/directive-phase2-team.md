# PHASE 2 — TEAM-BASED COMPONENT MIGRATION (Superpowers subagent-driven)
# Engineer-lead + per-block worker agents + showcase verification gate.
# Order ratified in decisions/forward-architecture.md. Spec frozen at
# docs/references/toolskin.css.frozen. Operating mode: 01-WORKING-MODE.md.

═══════════════════════════════════════════════════════
INVOKE SUPERPOWERS
═══════════════════════════════════════════════════════
Run via the Superpowers plugin:
  /superpowers:subagent-driven-development
The ratified ADR is the plan. This directive is the team structure + the
shared spec every worker obeys. Do NOT re-plan — execute the ratified order.

═══════════════════════════════════════════════════════
THE TEAM
═══════════════════════════════════════════════════════
ENGINEER-LEAD (orchestrator, does NOT write component CSS):
  - Holds the shared spec (below). Assigns one block per worker.
  - Reviews EVERY worker output against the Block Acceptance Checklist.
  - Rejects drift. A worker that deviates from the nested pattern or the
    border law gets sent back, not merged.
  - Enforces consistency: all workers solve shared problems the SAME way,
    because the answers are pre-resolved in the shared spec below.
  - Commits each accepted block (one commit per block/pair).

WORKER AGENTS (one per component block, fresh context each):
  - Reads ONLY its slice of the frozen spec: grep its selectors out of
    docs/references/toolskin.css.frozen — do NOT load the 29k-line file whole.
  - Migrates its block into assets/css/next/components/ on the nested
    pattern, consuming the v2 engine's --ts-this-bg derivatives.
  - Produces a showcase page for its block.
  - Reports computed-value verification (not "looks done").

VERIFICATION (gate before each commit):
  - Open the block's showcase in Chrome (chrome-devtools).
  - Check computed values: focus border warm (orange, NOT purple/brown),
    ink correct on every surface (auto-flip on accent), all states populate.
  - 0 console errors. Engineer signs off → commit.

═══════════════════════════════════════════════════════
SHARED SPEC — every worker obeys these, no re-litigation
═══════════════════════════════════════════════════════
S1 — NESTED PATTERN (CSS-1): all states/variants/children INSIDE the
     component block. Behavior via CSS custom properties. Context overrides
     via parent selector only. No scattered .component:hover. No duplication.
S2 — BORDER LAW (owner @CRITICAL, PRE-RESOLVED): borders derive from text
     tokens mixed with surface (the v2 engine's --ts-this-bg-border family).
     NEVER currentColor. If the frozen spec uses currentColor borders, that
     is the OLD pattern — migrate it to the engine's text-derived border.
     This is settled. No worker asks about it. No worker copies currentColor.
S3 — COLOR: oklab/oklch only. No srgb mixes. No HSL literals. Reach through
     a --ts-* token; never invent a color.
S4 — CLASS NAMES: preserve the frozen .ts-* class names. Reconcile old
     aliases (.btn/.button etc.) by aliasing, NOT by editing the new system.
S5 — MIGRATION not redesign: match the frozen behavior. Same external
     behavior, new internal architecture.
S6 — SURFACES: components consume the v2 engine + primitives. They do NOT
     redefine surface/state tokens. One anchor (--ts-this-bg), derivatives free.

═══════════════════════════════════════════════════════
EXECUTION ORDER (ratified Q1) — DEPENDENCY-SAFE PARALLELISM
═══════════════════════════════════════════════════════
WAVE 0 (SEQUENTIAL — pattern proof, one worker, engineer watches closely):
  - chip + badge. Smallest surface. Proves the migration recipe + catches
    srgb/HSL leaks cheaply. Engineer confirms the recipe WORKS here before
    any parallel work. If chip+badge fights the engine, the recipe is wrong
    — fix it here, not across six parallel agents.

WAVE 1 (PARALLEL — after the recipe is proven, fan out independents):
  - input        (worker A) — carries the border law S2; pre-resolved, no halt
  - ts-section   (worker B)
  - ts-card      (worker C)
  These three share no dependency on each other. Run in parallel. Engineer
  reviews each against the checklist as they complete.

WAVE 2 (PARALLEL — depend on Wave 1 primitives being in):
  - toolbar / nav   (worker D) — needs input + button height parity
  - table + accordion (worker E) — needs card patterns
  - overlays/modal-shell (worker F)

═══════════════════════════════════════════════════════
BLOCK ACCEPTANCE CHECKLIST (engineer applies to EVERY block)
═══════════════════════════════════════════════════════
[ ] Nested pattern — states/variants/children inside the block (S1)
[ ] Borders text-token-derived, zero currentColor (S2)
[ ] oklab/oklch only, no srgb, no HSL literals, no invented colors (S3)
[ ] Frozen .ts-* class names preserved; aliases aliased not edited (S4)
[ ] Behavior matches frozen spec (S5)
[ ] Consumes v2 engine; does not redefine surface tokens (S6)
[ ] Showcase renders in Chrome: focus warm, ink correct on all surfaces,
    all states populate, 0 console errors
[ ] Computed-value evidence reported (not "looks done")
→ All boxes checked → engineer commits the block. Any box fails → back to worker.

═══════════════════════════════════════════════════════
REVIEWER STANDING ORDERS (system-wide checks, NOT spec-slice only)
═══════════════════════════════════════════════════════
Spec reviewers and code-quality reviewers MUST run these checks against
the migrated output IN ADDITION to walking the spec slice. They surfaced
this wave as commit-hook catches that should have been caught earlier.
Reviewer brief MUST include them verbatim.

[META-1] TOKEN-EXISTENCE GREP IS MULTI-FILE.
  For every `var(--ts-*)` reference the worker introduces, confirm the
  token exists somewhere in `assets/css/next/`. Grep ALL of:
    - assets/css/next/primitives/*.css   (every primitive file)
    - assets/css/next/system/*.css       (every system file — v2 engine,
                                          gradients v3, surfaces, future
                                          additions)
    - assets/css/next/components/*.css   (peer components that may emit
                                          shared tokens, e.g. ts-btn v3.1)
  SINGLE-FILE GREP IS A KNOWN FALSE-POSITIVE PATTERN. The Wave 1 ts-card
  reviewer flagged six tokens as "non-existent" by grepping only
  gradients-v3.css; the tokens live in system/toolskin-this-bg-v2.css's
  gradient block. Do not repeat that mistake.

[META-2] FONT-WEIGHT LADDER IS 6-STEP, NO 800.
  Grep the migrated CSS for `font-weight:[[:space:]]*800` or
  `--ts-font-weight-extra-bold` or `wght@300\\.\\.900`. ANY MATCH IS A
  DEFECT (R-OQ-B3 canonical ladder is 300 / 400 / 500 / 600 / 700 / 900).
  The Wave 1 ts-section worker copied `font-weight: 800` verbatim from
  the frozen spec; the hook caught it, but a reviewer should have. Frozen
  spec values are not authoritative against the canonical ladder.

[META-3] DUAL-EMIT IS REQUIRED FOR EVERY oklch PRIMITIVE.
  If the migrated file declares a `--ts-* : oklch(...)` token at PRIMITIVE
  scope (in `assets/css/next/primitives/`), it MUST be paired with a
  preceding `--ts-* : #hexFallback` declaration (sRGB fallback for
  browsers without oklch). The pre-commit hook check #12 (R-D3-dual-emit)
  enforces this; reviewers should pre-empt it. The Wave 1 I-1
  status-tints lift originally shipped oklch-only and was caught by the
  hook, not a reviewer. The two relative-color formulas (`oklch(from ...
  calc(h + 180))` and `oklch(from var(--ts-this-bg) ...)`) are
  intrinsically dynamic and have no static fallback; document that
  exception inline.

[META-4] FROZEN SPEC IS NOT AUTHORITATIVE AGAINST SYSTEM RULES.
  The frozen file (`docs/references/toolskin.css.frozen`) carries every
  OLD-PATTERN defect the rebuild exists to fix: srgb mixes, currentColor
  borders, raw hex, HSL, `!important` chains, forbidden 800 weights,
  invented colors. Workers MUST migrate AWAY from these — preserving them
  verbatim is a defect. Spec reviewers verify the migration cleaned them;
  if the migrated CSS contains any of these patterns, send back.

→ All four META-checks PASS, in addition to all spec/CSS-quality boxes
  → engineer commits the block. Any META-check failure → back to worker
  with the specific defect cited.

═══════════════════════════════════════════════════════
COMMIT + REPORT
═══════════════════════════════════════════════════════
One commit per accepted block (or tight pair). Message:
  feat(components): migrate <block> to next/ on v2 engine
Report hashes as blocks land. HALT for owner only when:
  - WAVE 0 (chip+badge) is done — show owner the proven recipe before fanning out
  - the full Q1 order is complete
  - a showcase is visibly broken
  - a genuine fork appears that S1-S6 do NOT already answer
Otherwise the team runs the waves without per-block permission.

═══════════════════════════════════════════════════════
HARD RULES
═══════════════════════════════════════════════════════
- Workers read only their selector slice of the frozen spec (no whole-file load).
- The frozen file is READ-ONLY. Never edit docs/references/toolskin.css.frozen.
- No worker re-litigates S1-S6. The engineer enforces them.
- Engineer does not write component CSS; workers do not commit (engineer commits).
- Verify by showcase + computed values, never by assertion.
