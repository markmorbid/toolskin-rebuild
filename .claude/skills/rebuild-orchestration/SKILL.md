---
name: rebuild-orchestration
description: Meta-orchestration patterns for the Toolskin Rebuild project. Auto-loads in any chat or Claude Code session operating on the rebuild repo. Encodes 18 patterns including council voice upgrade, Gate 4.5 procedural correction, design DNA gap-catching, visual audit before specs (Pattern 17), council HALT on fundamental implications (Pattern 16), Session Continuity Protocol (Pattern 18), 5-tier skill priority audit, owner-gate cadence, "agent owns interactive installs", cross-skill collision check protocol, and the layered safety pattern that prevents autonomous-execution disasters. Complements `toolskin-architecture` skill (which encodes WHAT to build); this skill encodes HOW to orchestrate building it.
triggers:
  - working directory contains `toolskin-rebuild`
  - file path matches `**/toolskin-rebuild/**`
  - task mentions Toolskin rebuild, council, orchestration gate, sub-agent dispatch
---

# Toolskin Rebuild — Meta-Orchestration Patterns

This skill encodes the meta-orchestration patterns developed during Session 1 of the Toolskin Rebuild (May 18-19, 2026). It complements the `toolskin-architecture` skill — that one encodes WHAT to build; this one encodes HOW to orchestrate building it without producing the autonomous-execution disasters of the prior 3 months.

Companion skill: see `.claude/skills/toolskin-architecture/SKILL.md` for the architectural rules (15 conversation rules, 5-tier priority, block typology, etc.). This skill assumes that one is already loaded.

## Core principle

The rebuild's safety depends on **layered checks at multiple levels**, not on any single agent being correct. Architecture-first specs, code-zero specs phase, gates-many checkpoints, escape-valves-explicit refusal patterns. Lose any layer and the rebuild becomes another autonomous-execution disaster.

## Pattern 1 — Owner gate cadence (binding)

Every phase of agent work has an explicit owner gate at completion. Agent halts at gate, surfaces findings, owner approves or iterates. Agent does NOT proceed past a gate without explicit owner call.

Specific cadence:

| Phase | Gate | What owner reviews |
|---|---|---|
| A — Discover docs + create repo structure | Gate 1 | Inventory, framing interpretation, path corrections |
| B — Toolchain install + scaffold | Gate 2 | Toolchain summary, format-on-save status |
| C — Queue all docs | Gate 3 | Document queue, source coverage |
| D Wave 1 — Block layer pre-engineering | Gate 4 (CRITICAL) | Block typology + reusable HTML base + adaptive integration. Locks architectural trajectory. |
| D Wave 2 — Domain specialist dispatch | Gate 5 | Domain specs + S4's A1 resolution. Critical review item. |
| E — Build toolskin-architecture skill | Gate 6 | Skill content + governance artifacts |
| F — First commit | Gate 7 | Commit message review + final disk state |

Sub-pattern: **Gate 4.5 procedural correction** (locked Session 1, Gate 4 ponderation). When council is invoked between gates, council outputs are INPUT to owner decision, NOT auto-resolution. Council disagreements MUST be surfaced to owner before dispatching consumers. Orchestrator never silently auto-resolves council disagreements.

## Pattern 2 — Council voice upgrade (binding for visual decisions)

The default ECC council uses 4 voices: Architect / Skeptic / Pragmatist / Critic. Locked Session 1 Gate 4.5: for ANY decision involving visual, aesthetic, identity, brand, or user-perception dimensions, two voices are UPGRADED:

| Standard | Upgraded for visual decisions |
|---|---|
| Skeptic | **Design Skeptic** — challenges from VISUAL design perspective. MUST read `_rebuild-design-dna.md` + Tier 1 in-house skills before responding. Counter-proposals honor design DNA, not generic heuristics. |
| Critic | **Design Critic** — audits against 15+Rule 15 INCLUDING Rule 5 (drop-in identity preservation). Lists failure modes ranked by VISUAL severity. Asks: "If we ship this, will it still LOOK like Toolskin?" |

When to use upgraded voices: ANY decision involving visual rules, design patterns, component aesthetics, motion, color application beyond contrast math, typography application beyond ladder math, spacing, borders, shadows, radius. Default to upgraded unless decision is purely structural (file paths, build pipeline mechanics with no visual impact).

Both upgraded voices MUST have access to: `_rebuild-design-dna.md` + Tier 1 in-house design skills (expert-designer, typography-master, design-tokens-2.0) + the relevant component reference in `../toolskin-showcase/`.

## Pattern 3 — Design DNA gap-catching

Architecture-heavy specs CAN ship without visual design audit, and they look fine in the moment. The gap surfaces months later when blocks rebuild architecturally clean but visually generic.

**The catch protocol:** at any orchestration moment, the owner (or a senior agent) asks: "Has visual design criteria been consulted, or only architecture + math?"

If only architecture + math → INSERT design audit subagent before consumer dispatches. Read Tier 1 in-house design skills + visually audit the existing reference. Output a `_rebuild-design-dna.md` document.

The design audit was inserted as Wave 1.5 in Session 1, between Wave 2 specs and Gate 5. It surfaced 4 contradictions between CSS canonical state and stale in-house skill declarations — all resolved at Gate 5 with CSS-wins authority.

**Going forward:** every multi-wave orchestration must include a design DNA gate before consumer specs lock. Bypassing it = repeating the gap.

## Pattern 4 — 5-tier skill priority hierarchy (audit-resistant)

Sub-agents reading external skills MUST honor priority order. Higher tier wins every conflict.

```
TIER 1 — AUTHORITATIVE (Toolskin-specific, never overridden)
  1. toolskin-architecture skill
  2. rebuild-orchestration skill (this skill)
  3. design-tokens-2.0 (in-house, Toolskin token system)
  4. expert-designer (in-house, design philosophy)
  5. typography-master (in-house, font + harmonic ladder)

TIER 2 — WORKFLOW DISCIPLINE
  6. designer-skills (julianoczkowski, 8 skills) — grill-me, design-review, etc.
  7. Superpowers — execution discipline (worktrees, TDD, subagent-driven)

TIER 3 — DIAGNOSTIC (advisory only, never authoritative)
  8. ECC design-system (Audit mode only — Mode 1 OFF-LIMITS)
  9. ECC accessibility (WCAG 2.2 floor)

TIER 4 — DELIBERATION
  10. ECC council (default for ponderation gates)
  11. yogirk agent-council (high-stakes cross-model verification only)

TIER 5 — SUPPORTING
  12. ECC code-tour, codebase-onboarding, context-budget, browser-qa
  13. apcach (build-time tooling, not a skill)
```

When ECC design-system audit flags a Toolskin intentional choice (chip strip edge-fade gradient, Space Grotesk, OKLCH-derived colors, harmonic 1.125 ladder, 13px base font (RULING 3), explicit radius ladder 4/6/8/10/16, substring distribution selectors per cascade-sensitivity rule) → flag is informational only, Toolskin's in-house authority wins.

## Pattern 5 — Agent owns interactive installs

Locked Session 1 file 04. When installing external skill packs with multi-skill pickers (ECC, designer-skills, etc.): ALWAYS use non-interactive flags (`--skill <name>`, `--agent claude-code`, `-y`). Never default to interactive pickers — they waste owner time scrolling 100+ options.

If a pack's skill names aren't known, run `npx skills add <pack> --list` first or check the pack's README to enumerate them, THEN install non-interactively.

The agent is fully capable of running these commands directly in Claude Code Desktop's bash tool. Do NOT hand interactive installs to the owner — own the install end-to-end.

## Pattern 6 — Cross-skill collision check

When installing any external skill, search the SKILL.md content for keywords matching known project constraints (fonts, frameworks, naming conventions, color systems) BEFORE activating. Confirm no contradictions with project rules.

Example caught Session 1: Anthropic's `frontend-design` skill bans Space Grotesk (per owner's memory warning). The newly-installed `julianoczkowski/designer-skills/frontend-design` is a DIFFERENT skill (same name, different author). Quick grep confirmed: zero "Space Grotesk" mentions → no conflict. Owner's font choice preserved.

Pattern: same skill name across packs ≠ same content. Always verify.

## Pattern 7 — Two-wave sub-agent dispatch (for architectural pre-engineering)

When a session must produce architectural specs that future sessions consume, use two waves:

**Wave 1 — Block-layer pre-engineering team:** 3 parallel sub-agents, fresh context each (anti-anchoring), 25-min time-box each. Produce typology + composition + integration contracts. Owner gate locks the architectural trajectory.

**Wave 2 — Domain specialist dispatch:** N sub-agents consuming Wave 1's locked outputs. Sequential if dependent (S1 → S2), parallel where independent (S3+S4+S5+S6 after S2). Each 25-30 min time-box.

Time-box discipline matters. If a sub-agent exceeds its box without delivering, orchestrator surfaces — owner decides whether to extend or simplify scope.

Each sub-agent's brief must:
1. Reference the 14 + Rule 15 conversation rules + repo isolation
2. List required reading order (rules first, domain sources second)
3. Define output contract (file path, structure, dependencies)
4. Hard write restrictions (markdown only this phase, no `../toolskin-showcase/` writes)

## Pattern 8 — Surface unresolved disagreements (Gate 4.5 procedural correction)

When parallel sub-agents (council voices, Wave 1 team, etc.) DISAGREE on substantive points:
- Orchestrator does NOT auto-resolve
- Orchestrator surfaces disagreement to owner explicitly
- Owner picks → resolution encoded as binding input to next consumer dispatch
- Council deliberation is INPUT to owner decision, not decision authority

This procedural correction emerged Session 1 when the agent treated A1 council outputs as auto-resolved instead of surfacing the Skeptic/Pragmatist/Critic disagreements. Owner caught the gap. From that moment binding.

Implementation rule: after any parallel sub-agent dispatch, orchestrator must:
1. Read all sub-agent outputs in full (not delegated)
2. Identify substantive disagreements (not just minor refinements)
3. Surface disagreements explicitly with options the owner can pick from
4. Wait for owner picks
5. Encode picks as binding input to next dispatch

## Pattern 9 — Tier-3 (ECC) skill is diagnostic, never authoritative on Toolskin

Locked Session 1 file 05. ECC design-system has three modes:

| Mode | Verdict for Toolskin |
|---|---|
| Mode 1 (Generate) | **OFF-LIMITS** — would propose competing tokens against existing system |
| Mode 2 (Audit) | Useful diagnostic. 10-dim scoring. Subject to Toolskin filter list. |
| Mode 3 (Slop detection) | Useful with filtering. Toolskin's intentional gradients are NOT slop. |

ECC's color consistency dimension defers to apcach (Rule 15). ECC's typography hierarchy dimension defers to harmonic 1.125 ladder + Space Grotesk choice. ECC's "complete dark mode" scoring may not recognize OKLCH-derived auto-light-mode pattern — it's complete by construction.

Sub-agent in any session that invokes ECC must apply the filter list. If filter list isn't documented for the use case, ask owner.

## Pattern 10 — Refusal patterns with teeth

Locked Session 1 throughout. The toolskin-architecture skill encodes explicit refusal language for forbidden requests. This skill reminds: WHY refusal patterns matter and WHEN they activate.

Refusal pattern triggers:
- Request to modify any file in `../toolskin-showcase/` → REFUSE, remind of Rule 12 (new repo only, old repo read-only forever)
- Request to write code outside `assets/css/next/*`, `sandbox/*`, `docs/*`, `.claude/*`, `tools/*` → REFUSE, ask for scope clarification
- Request to add Node.js runtime dependencies → REFUSE, remind of Rule 13 (build-time only, shipped product is pure CSS+JS)
- Request to introduce frameworks (React, Vue, Tailwind, etc.) in shipped product → REFUSE, remind of Rule 1
- Request to auto-format CSS → REFUSE, remind of editor format-on-save disable
- Request to skip owner gates → REFUSE, remind of Rule 11 (halt on anomaly, never improvise)
- Request to make architectural decisions outside the locked Wave 1 typology → REFUSE, ask for typology revision via owner-approved iteration
- ECC Mode 1 Generate request → REFUSE, remind that Toolskin token system is authoritative via in-house design-tokens-2.0 skill
- Request to derive color values outside apcach → REFUSE, remind of Rule 15

Refusal is not optional. The 3-month disaster history happened because soft language got ignored under context pressure. Refusal patterns are hard.

## Pattern 11 — Cascade-sensitivity rule (preserves intentional patterns)

Locked May 17 (pre-rebuild discovery). `:root [class*="ts-tree"]` is a SCOPED DISTRIBUTION LAYER, not a default-value declaration. Cascade is partially explicit, not pure inheritance.

The rebuild uses explicit `:is(...)` enumeration where appropriate. BUT some substring distribution patterns in the old toolskin.css are INTENTIONAL and must be preserved when their semantics match the use case.

Implication: sub-agents replacing old patterns should not blindly convert `[class*=...]` to `:is(...)`. They must verify the semantics match — sometimes substring distribution is the right pattern (when descendants of varying named classes need the same default), sometimes explicit enumeration is correct (when descendant set is small and stable).

Default to explicit enumeration. Document substring distribution decisions explicitly per block.

## Pattern 12 — apcach is supreme color authority (Rule 15)

Locked Session 1 file 06. apcach (antiflasher, MIT, Evil Martians) generates every Toolskin primitive color with verified APCA contrast at every derivation step.

Two layers in shipped product:
1. **Build-time** at `tools/color-engine/generate-colors.js` → bakes static OKLCH primitives into `assets/css/next/primitives/colors.css`
2. **Optional runtime** via `toolskin.js` Path A opt-in → recomputes derivative chain when consumer selects new accent (~25-30KB bundled)

No skill (external or internal) overrides apcach on color matters. ECC color consistency flag → apcach output stays. Generic palette guidance → apcach output stays. WCAG-only methodology → APCA preferred.

If a sub-agent proposes color values that aren't apcach-derived, REJECT, document the rejection ("Conflict with Rule 15 — apcach output preserved"), proceed with apcach.

## Pattern 13 — File-level freeze vs repo-level freeze

Locked Session 1 file 07. The old repo `toolskin-showcase/` is FROZEN AT REPO LEVEL — never modified after Session 1, sub-agents read constantly via relative path `../toolskin-showcase/` but never write.

This is different from file-level freeze (a single file is read-only within an active repo). Repo-level freeze means: no `cd` into the reference repo, no `git` operations against it, no symlinks/junctions/bind mounts that could collapse them as one.

Practical enforcement:
- Working directory for ALL agent operations is `toolskin-rebuild/`
- Reference reads use relative path `../toolskin-showcase/<path>`
- Read operations only: cat, view, grep, head, tail, find
- Forbidden: edit, write, rm, mv, cp -t (into reference), git ops
- S6 governance pre-commit hook defends against accidental staged changes to `../toolskin-showcase/` paths

## Pattern 14 — Session checkpoint state (for resumption across reboots)

For sessions that span multiple calendar days or require reboot (rate limits, owner pause), write a checkpoint state document at the pause point:

`docs/handoffs/_session-N-state-<phase>.md`

Contents:
- All owner picks approved so far (locked, not for re-deliberation)
- Spec inventory + line counts
- Pending work + execution order for resumption
- Bindings active at pause
- Tomorrow's entry point

Combined with claude-remember plugin (auto-loads session memory at start), this provides full continuity across reboots. The checkpoint is the AUTHORITATIVE state; claude-remember is the conversational continuity layer.

## Pattern 15 — Skills audit hygiene

Before installing any skill into the rebuild repo's `.claude/skills/`, the agent should:

1. **Cross-skill collision check** (Pattern 6) — search SKILL.md for project-constraint keywords
2. **Tier classification** (Pattern 4) — explicitly assign the skill to a tier; if it's Tier 1 it goes in-house, if it's Tier 3+ it stays external
3. **Snyk/security flag review** — note any "Med Risk" or higher flags, add to pre-first-use audit todo
4. **Refusal compatibility** — verify the skill doesn't propose patterns the project's refusal catalog explicitly rejects
5. **Auto-trigger collision** — ensure the skill's auto-trigger directive doesn't conflict with toolskin-architecture or rebuild-orchestration

If any check fails, surface to owner before activation.

## Pattern 16 — Council HALT on fundamental implications surfaced (binding)

Companion to Pattern 8 (surface unresolved disagreements). Pattern 8 handles council voices DISAGREEING with each other; Pattern 16 handles council voices AGREEING that a fundamental was missed by the prior gate.

When ECC council deliberation surfaces a FUNDAMENTAL IMPLICATION that was missed at the prior owner gate — not minor refinement, but architectural concern that would affect downstream specs or shipped behavior — orchestrator MUST:

1. **HALT** before dispatching any consumer (Phase E, next sub-agent, etc.)
2. **Classify the implication explicitly:** is it (a) a downstream spec amendment, (b) an architectural choice the owner missed, or (c) a redirect that reframes the original question?
3. **Surface to owner** with classification + recommended resolution + alternative options
4. **Wait for owner decision** before encoding ANY of the council's elaborations into downstream specs or skill content
5. **Document the resolution** in the orchestrator synthesis as binding input

This pattern emerged Session 1 Gate 5 council. The council surfaced 3 fundamental implications:
- One was a downstream spec amendment (D3 dual-emission sRGB fallback)
- One was an architectural choice missed (OQ-B3 Space Grotesk 800 variable-axis loading)
- One was a redirect that reframed the original question (D2↔D8 light mode — owner reframed: "smart color system handles this mathematically, mixing constants should NEVER have been hand-tuned per-theme")

The third case is the most important. Council can surface implications that reveal the QUESTION ITSELF was framed wrong. Orchestrator must accept owner redirects as valid resolutions — the smart color system, surface superposition, and apcach engine are FOUNDATIONAL constraints that supersede tactical "pick A or B" framings.

Both Pattern 8 and Pattern 16 halt for owner. Neither auto-resolves council output.

## Pattern 17 — Visual audit before specs (mandatory for design system work)

Design system rebuilds MUST visually audit the source-of-truth rendered state BEFORE producing engineering specs. Code-text design extraction (reading CSS rules, parsing HTML, reading skill docs) is INSUFFICIENT — it cannot detect:
- Contrast regressions
- Version mismatches (e.g., FontAwesome v6 vs v7 silent breakage)
- Icon rendering failures
- localStorage-cached false-positives
- Browser-specific rendering discrepancies
- Any visual outcome where math-correct ≠ visual-correct

**Source of truth hierarchy:**
1. Owner's eye (highest authority — design taste cannot be derived)
2. Browser-rendered screenshots (real Chrome via GoFullPage extension = ground truth; Playwright headless = systematic baseline)
3. Claude's vision analysis of captured PNGs (reasons about pixels, not text)
4. CSS source text (lowest — what code SAYS the design is, may not match what renders)

Skills derived from text alone are INPUTS to visual audit, never substitutes. Council Design voices reading text-derived specs are auditing blind — they must consume the visual audit document as primary input.

**Implementation:**
- Capture tools: Playwright (build-time, gitignored, Rule 13 honored) at `tools/visual-audit/` + GoFullPage Chrome extension (owner manual ground truth)
- Analysis: Claude native multimodal vision viewing PNG files + `design-review` skill (julianoczkowski) + `browser-qa` skill (ECC)
- Output: `_rebuild-visual-audit.md` with per-surface findings, cross-referenced to `_rebuild-design-dna.md`
- Gate: visual audit MUST land + receive owner annotation BEFORE Phase E skill build, BEFORE any block sandbox work in Session 4+

**Companion to Pattern 16:** Pattern 17 is what Design Skeptic + Design Critic voices need as INPUT. Without visual audit, council Design voices operate blind on text. Pattern 17 ensures the voices have pixels to reason about, not just text.

This pattern emerged Session 1 Gate 5+ when the owner caught that the entire Session 1 rebuild progressed through Wave 1 + Wave 2 + Wave 1.5 + Gate 5 council with ZERO agent ever rendering the design system in a browser. The 3-month Toolskin disaster history shows multiple math-correct/visual-wrong outcomes (e.g., `--ts-on-accent` regression, FontAwesome silent failure) all caught by owner's eye, none caught by code analysis. From that point binding.

The owner's April 27 binding principle: *"my eye was the source of truth, not the math."* Pattern 17 operationalizes this principle as an enforceable orchestration step.

## Pattern 18 — Session Continuity Protocol (checkpoint + cold-resume)

Rewritten 2026-05-20. Supersedes the original "Quota Safety Protocol" framing.

Guarantees any session (clean end OR quota cutoff) leaves a state a fresh cold session resumes with zero context loss. The agent has NO reliable in-band quota meter, so continuity does NOT rely on detecting the cutoff — it relies on continuous checkpointing + owner triggering + the SESSION START routine in `toolskin-architecture` SKILL.md (§19).

**Checkpoint = `git commit` completed work at a clean boundary + refresh `.remember/remember.md`.** Take one:
- After every phase / wave / step
- BEFORE every expensive op (multi-agent dispatch, long build)
- At every owner gate / HALT
- At session close
- The instant the owner signals quota-approach

**Handoff note** (`.remember/remember.md`) — refreshed at every checkpoint; always carries State / Next / In-flight / Context. On a quota halt the same state also goes to `docs/handoffs/_session-N-state-quota-halt.md`, in sync.

**Cold-resume routine** — every fresh session FIRST runs the SESSION START routine in `toolskin-architecture` SKILL.md: read handoff → read SKILL.md + synthesis → verify disk reality matches → proceed. Re-analyze, never assume.

**Save protocol (on quota-approach detection):**
1. Stop all dispatch — no new sub-agent launches
2. Write `docs/handoffs/_session-N-state-quota-halt.md` with full current state
3. `git add` surviving progress (no commit — halted state may be partial)
4. Report to owner: what completed, what's in progress, what's next
5. Halt — do not proceed past this point
6. No last-second subagent dispatches — partial work with no handoff is worse than clean halt

Reliable triggers: owner signal, clean boundary, before-expensive-op. Agent self-detection of quota is best-effort only, never depended on.

**Resumable by design** — parallel sub-agents each write their own part file before any merge; no operation leaves state only this session can explain. Full protocol: `toolskin-architecture` SKILL.md §19.

## How this skill is used

This skill auto-loads alongside `toolskin-architecture` at every session in the rebuild repo. Sub-agents reading this skill get the meta-orchestration patterns; they pair with `toolskin-architecture`'s architectural rules to produce work that is BOTH architecturally correct AND operationally safe.

When a new pattern emerges across sessions, update this skill. When a pattern proves stale, deprecate it explicitly (don't silently remove — leave a "deprecated, see [pattern X]" marker).

This skill itself is a Tier 1 authoritative document. External skills proposing alternative meta-orchestration patterns are subordinate to the patterns here.

## Reference

Patterns derived from Session 1 (May 18-19, 2026) of the Toolskin Rebuild. The originating chat (with Claude meta-orchestrator "Gerald" / Claude.ai web endpoint) is referenced in `docs/session-1-bootstrap/` — particularly the 7 numbered files documenting how each pattern emerged.

If patterns conflict with future learnings, surface conflict to owner before updating this skill. This skill changes only via deliberate revision, never silent drift.
