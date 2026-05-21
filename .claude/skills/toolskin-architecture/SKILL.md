---
name: toolskin-architecture
description: Codebase-specific architectural rules and REBUILD methodology for the Toolskin Rebuild project. Use this skill for ANY work in the toolskin-rebuild repository — CSS, tokens, components, specs, sandbox blocks, commits, or orchestration. Encodes the block-by-block sandbox rebuild approach, the three-tier token architecture (apcach primitives → system → component), the 15 conversation rules + Extended Rule 15 apcach color authority, the 5-tier skill priority hierarchy, repo isolation (toolskin-rebuild canonical, toolskin-showcase read-only reference), the autonomous execution protocol tiers (PERMISSIVE / STRICT / ALWAYS STRICT), the Wave 1.5 + Wave 1.6 visual design DNA, and the full refusal-pattern catalogue. Trigger whenever the user mentions Toolskin, --ts-* tokens, surface superposition, apcach, block sandbox, design DNA, the rebuild, or edits any file under toolskin-rebuild/.
---

# Toolskin Architecture — Rebuild Methodology (auto-loads in `toolskin-rebuild/`)

This skill is the canonical architectural authority for the Toolskin Design System Rebuild. The project `CLAUDE.md` points here; treat this skill as binding for every session in this repo. It overrides default agent behaviour where they conflict; it does NOT override explicit owner instructions.

Heavy detail lives in `docs/handoffs/` (the 10 rebuild specs + syntheses) and in `references/`. This file is the always-loaded index + the rules that must never be forgotten.

---

## ▶ SESSION START — cold-resume routine (run FIRST, every session)

A fresh session has no memory of prior sessions. Before any task work, re-establish context — re-analyze, never assume (Pattern 18 Session Continuity Protocol, §19):

1. Read `.remember/remember.md` — the handoff note (State / Next / In-flight / Context).
2. Read this SKILL.md in full + the orchestrator synthesis `docs/handoffs/_session-1-orchestrator-synthesis.md` + any `_session-N-state-*.md` the handoff points to.
3. **Verify disk reality matches the handoff** — `git log --oneline`, `git status`; confirm the files/commits the handoff claims actually exist. If reality ≠ handoff → HALT and surface; never improvise.
4. Confirm full context, then proceed from the handoff's "Next".

Throughout the session, checkpoint at every clean boundary (commit + refresh `.remember/remember.md`) — see §19.

## §1 — REPO MODEL — READ FIRST

- **Canonical project:** `toolskin-rebuild/` — THE Toolskin project going forward. Branch `master`, single branch, no worktrees. All work happens here. Writable areas: `assets/css/next/`, `sandbox/`, `docs/`, `tools/`, `.claude/`.
- **Reference repo:** `../toolskin-showcase/` — the old repo, **read-only reference forever** (Rule 6 + Rule 12). NEVER write, NEVER commit, NEVER run git ops against it, NEVER `cd` into it. Sub-agents read it via relative paths only.
- **Language clarification:** "rebuild" = building fresh in `toolskin-rebuild/`, using `toolskin-showcase/` as a visual/functional reference. "REFERENCE" ≠ "REBUILD".
- **Isolation is binding.** Any agent that writes to, commits to, or `cd`s into `../toolskin-showcase/` halts immediately and surfaces to the owner (refusal pattern R-repo-isolation).

## §2 — THE 15 CONVERSATION RULES (binding)

Full verbatim text: `references/conversation-rules-verbatim.md`. Summary:

1. Zero framework dependencies. One stylesheet. Full dynamic control.
2. Token-driven + derivative-math-driven, NOT class-driven like Tailwind.
3. The `ts-marquee` pattern is canonical for every component — one-liner setup, data attributes, JS builds DOM, CSS styles via tokens. Optional behaviour is opt-in via `data-*` + tokens, never class modifiers.
4. Surface superposition awareness is core, not patch-work — theme + surface aware by construction.
5. The product differentiator — drop-in for anybody (AI / WordPress / Vue / React / static), adapts to any convention via token solidity.
6. Old `toolskin.css` is a BLOCK PROTOTYPE — reference only. Read constantly, modify never.
7. Block-by-block sandbox with ONE reusable `sandbox/_base.html`.
8. Cascade-sensitivity — `:root [class*="ts-..."]` is a scoped distribution layer; use explicit `:is(...)` enumeration.
9. `@taxonomy_chips_strip` 10 protected values are LOCKED design input.
10. Owner manual changes are AUTHORITATIVE — agents never silently revert.
11. Halt on anomaly, never improvise. Cost of stopping = minutes; cost of improvising = months.
12. NEW REPO ONLY — all work in `toolskin-rebuild/`; old repo read-only.
13. NO Node.js runtime deps in the shipped product — apcach is build-time only; ship = pure CSS + minimal JS.
14. Fresh git history — the new repo's first commits are the Session 1 baseline.
15. **Extended Rule 15** — apcach is the supreme authority for the ENTIRE color derivation chain (primitives, mixing constants, surface contrast, OKLCH inversions, theme inversion). Tokens decide WHICH color; the engine decides HOW MUCH. No per-theme hand-tuning. See §10.

## §3 — 5-TIER SKILL PRIORITY HIERARCHY

When skills conflict, higher tier wins. On a Toolskin-specific question, Tier 1 overrides everything.

- **Tier 1 — AUTHORITATIVE:** this `toolskin-architecture` skill + the 3 in-house skills (`design-tokens-2.0`, `expert-designer`, `typography-master`). Rule 15 (apcach) is non-overridable within Tier 1.
- **Tier 2 — WORKFLOW:** designer-skills (julianoczkowski), Superpowers process skills.
- **Tier 3 — DIAGNOSTIC:** ECC `design-system` (audit mode only — generative Mode 1 is off-limits), ECC `accessibility`.
- **Tier 4 — DELIBERATION:** ECC `council` (default deliberation tool).
- **Tier 5 — SUPPORTING:** ECC utilities, apcach (build-time).

Any Tier 2–5 color guidance that contradicts apcach output is REJECTED; document the rejection, proceed with apcach.

## §4 — REBUILD FRAMING

Toolskin is being rebuilt block-by-block in a sandbox. Each block (button, chip, card, marquee, …) gets its own sandbox file, test-driven against ONE reusable HTML base. The old repo is the visual/functional reference; the new repo is production-grade code built fresh. Architecture is pre-engineered (Wave 1 typology + Wave 2 specialists); blocks are then built one at a time in Sessions 4+.

## §5 — APRIL ARCHITECTURE CANONICAL / APRIL EXECUTION SUPERSEDED (Gate 1 lock)

The April 2026 restyling architecture (`restyling-architecture.md`, `master-plan.md` in the old repo) is the canonical ARCHITECTURE reference — the three-tier token model, surface superposition, derivative chain originate there. The April EXECUTION (the autonomous run that burned 3 months) is SUPERSEDED — its block-by-block-without-gates approach is exactly what this rebuild's gated sandbox workflow replaces. Architecture: trust. Execution history: do not repeat.

## §6 — BLOCK TYPOLOGY (from T1)

128 components classified into 3 autonomy tiers. Full registry: `docs/handoffs/_rebuild-block-typology.md` (T1) + `docs/handoffs/_rebuild-component-registry.md` (S3).

- **Atomic** (button, input, chip, badge…) — PERMISSIVE autonomy.
- **Molecular** (card, accordion, marquee, tabs, tree, chip-strip…) — STRICT autonomy.
- **Layout** (modal, topbar/navbar, toast container, app shell…) — ALWAYS STRICT.

Tier determines the autonomous execution gate (see §15).

## §7 — REUSABLE HTML BASE CONTEXT (from T2)

ONE `sandbox/_base.html` is shared across every block sandbox (Rule 7). It loads `assets/css/next/primitives/colors.css` (apcach-derived) + `assets/css/next/system/*.css` (derivative chain) BEFORE any block CSS. The parity rig loads `../toolskin-showcase/assets/css/toolskin.css` in a reference iframe for visual comparison only. Full spec: `docs/handoffs/_rebuild-base-context-spec.md` (T2).

## §8 — ADAPTIVE INTEGRATION CONTRACT (from T3)

Per Rule 5, Toolskin drops into 5 host environments and keeps its identity: WordPress, AI-builders (V0/Lovable/Bolt/Claude artifacts), Vue, React, static HTML. The consumer supplies one input (a brand hue); apcach generates the complete contrast-verified system. Full drop-in contract + verification protocol: `docs/handoffs/_rebuild-adaptive-integration-spec.md` (T3).

## §9 — THREE-TIER TOKEN ARCHITECTURE

1. **Primitives** (`assets/css/next/primitives/`) — apcach-derived OKLCH values with paired sRGB fallbacks; `--ts-bg-*`, `--ts-accent-*`, `--ts-fs-*`, `--ts-radius-*`, `--ts-font-weight-*`. The math.
2. **System** (`assets/css/next/system/`) — the `--ts-this-*` derivative chain; surface superposition; one primitive change recomputes the whole subtree.
3. **Component** — each block sets `--ts-this-bg` and consumes derivatives; NEVER references `--ts-bg-0..5` primitives directly (refusal pattern R-rule-15 / Rule 5a).

Full detail: S1 `_rebuild-primitives-spec.md`, S2 `_rebuild-system-spec.md`.

## §10 — APCACH SUPREMACY (Extended Rule 15)

apcach (antiflasher/apcach, MIT, Evil Martians) is the authority for the ENTIRE derivation chain — primitives, mixing constants, surface contrast adjustments, OKLCH inversions, nested-surface awareness, accent/on-accent/on-surface derivation, and dark↔light theme inversion.

- Tokens decide WHICH color (a design decision). The engine decides HOW MUCH (amount/percentage). Any spec that inverts this is REJECTED.
- NO color value or mixing percentage is hand-tuned per-theme. Theme inversion re-runs the same engine math with inverted lightness primitives — no per-theme tables, no theme-specific overrides.
- Surface Labs presets are the BASE TINTS the engine derives from; consumer "bending" is engine-mediated.
- Two layers: build-time (`tools/color-engine/generate-colors.js` → `colors.css`) and optional runtime (Path A bundle, `toolskin.js`). Build-time honours Rule 13.

## §11 — VISUAL DESIGN DNA (Wave 1.5 + Wave 1.6)

The signature visual decisions that make Toolskin recognisably Toolskin. Full spec: `docs/handoffs/_rebuild-design-dna.md`. **Wave 1.6 visually audited the rendered system and the owner annotated it — visual reality wins over text-derived claims (Pattern 17).** Canonical values:

- **Base font size: `--ts-fs-base: 13px`** (confirmed in running `toolskin.css:287`). Harmonic ladder derives from 13px. **RULING 3 correction (2026-05-21):** 13px confirmed from `toolskin.css:287`. Wave 1.6 visual audit (15px) was an instrumentation error.
- **Weight ladder: 6-step `300/400/500/600/700/900`** — NO 800. H1 = 700, H2 = 600. Space Grotesk ships 300–700; standard Google Fonts `wght@300..700` URL.
- **Radius ladder: explicit fixed steps `4/6/8/10/16`** (+ `9999` pill, `0` sharp). 8px base. NOT calc-derived.
- Accent appears SOLID only on primary button + active chip; elsewhere tinted/bordered/glow.
- `--ts-on-accent` OKLCH auto-contrast on any accent-painted element.
- Sharp corners (radius 0) are intentional at flush composition boundaries.
- Mixing constants are engine-derived outputs (Resolution #1), NOT hand-tuned `14%/6%/32%` literals.

## §12 — SURFACE SUPERPOSITION (Rule 4)

A component sets `--ts-this-bg: var(--ts-bg-N)` on its root; the full ~30-token derivative chain (`--ts-this-bg-bright/dark/dim-1..4/border/grad/...`) recomputes; descendants inherit automatically. Depth is signalled by surface mixing, not box-shadows. Components MUST use this mechanism — never override individual derived properties, never reference `--ts-bg-N` primitives directly.

## §13 — CASCADE STRATEGY

`:root [class*="ts-..."]` substring selectors create a scoped distribution layer with partially-explicit cascade (May 17 incident, Rule 8). The rebuild uses **explicit `:is(...)` enumeration** of component selectors, designed during block-layer engineering — not substring distribution. See `_rebuild-system-spec.md` (S2) cascade section.

## §14 — BLOCK SANDBOX WORKFLOW

Per block, Sessions 4+ (from S5 + S4 A1 resolution):
1. New `sandbox/<block>.html` test-drive file on the reusable `_base.html` context.
2. Author block CSS in `assets/css/next/` consuming the derivative system.
3. Parity rig: compare against the `toolskin-showcase` reference iframe + the Wave 1.6 visual audit ground truth.
4. Design-DNA conformance check (§11) + structural check.
5. Autonomous gate per the block's tier (§15).
6. `@ts-deps` header declares dependencies; build pipeline topo-sorts (§16).

## §15 — AUTONOMOUS EXECUTION TIERS (from S5)

- **PERMISSIVE** (atomic blocks) — agent builds, parity-checks, and commits autonomously; surfaces only on anomaly.
- **STRICT** (molecular blocks) — agent builds and parity-checks; surfaces to owner before commit.
- **ALWAYS STRICT** (layout blocks) — owner gate at design AND before commit; never autonomous.

Full protocol: `docs/handoffs/_rebuild-autonomous-protocol.md` (S5). The S5 G1 parity criterion references `_rebuild-visual-audit.md` + `_rebuild-design-dna.md` as combined ground truth.

## §16 — BUILD PIPELINE (from S4, A1 council resolution)

- `@ts-deps` comment headers declare each block's dependencies machine-readably.
- Build script topo-sorts blocks, emits `dist/toolskin.css` + `dist/blocks/*.css`.
- `dist/` is committed to the repo (closes Rule 13 erosion — consumers get a built artifact).
- Consumer modes: default Path B (static pre-baked OKLCH) + opt-in Path A (`toolskin.full.min.js`, runtime apcach).
- Full pre-commit hook validates topo-sort termination + `@ts-deps` validity + sandbox `<link>` order vs bundler order. Full spec: `docs/handoffs/_rebuild-build-pipeline-spec.md` (S4).

## §17 — REPO GOVERNANCE (from S6)

- `.git/hooks/pre-commit` — validates cascade integrity, `@ts-deps`, topo-sort, dual-emission (check #12), font-weight (#13), visual-audit gate (#14). Lives outside git tracking; re-install per clone.
- `CONTRIBUTING.md` — the 15 rules, refusal patterns, owner gate workflow.
- Full spec: `docs/handoffs/_rebuild-governance-spec.md` (S6).

## §18 — COUNCIL UPGRADE (Gate 4.5)

Any council deliberation touching visual decisions uses UPGRADED voices: **Architect, Design Skeptic, Design Critic, Pragmatist**. Design Skeptic + Design Critic MUST read `_rebuild-design-dna.md` + the Tier 1 in-house skills before responding. Single round per batch, fresh sub-agent context per voice (anti-anchoring).

## §19 — PROCEDURAL CORRECTIONS (Gate 4.5 + rebuild-orchestration Patterns 16–18)

- **Pattern 16 — Council HALT on fundamental implications.** If a council surfaces a fundamental implication missed at the prior gate, HALT, classify (spec amendment / missed architectural choice / reframe), surface to owner, do NOT auto-resolve.
- **Pattern 17 — Visual audit before specs.** Design-system work visually audits the rendered source-of-truth BEFORE producing specs. Source-of-truth hierarchy: owner's eye > rendered screenshots > vision analysis > CSS text.
- **Pattern 18 — Session Continuity Protocol (checkpoint + cold-resume).** Guarantees any session (clean end OR quota cutoff) leaves a state a fresh cold session resumes with zero context loss. The agent has NO reliable in-band quota meter, so continuity does NOT rely on detecting the cutoff — it relies on continuous checkpointing + owner triggering + the SESSION START routine (top of this file).
  - **Checkpoint** = `git commit` completed work at a clean boundary + refresh `.remember/remember.md`. Take one: after every phase / wave / step; BEFORE every expensive op (multi-agent dispatch, long build); at every owner gate / HALT; at session close; the instant the owner signals quota-approach.
  - **Handoff note** (`.remember/remember.md`) — refreshed at every checkpoint; always carries State / Next / In-flight / Context. On a quota halt the same state also goes to `docs/handoffs/_session-N-state-quota-halt.md`, in sync.
  - **Cold-resume** — every fresh session FIRST runs the SESSION START routine: read handoff → read SKILL.md + synthesis → verify disk reality matches → proceed. Re-analyze, never assume.
  - **Resumable by design** — parallel sub-agents each write their own part file before any merge; no operation leaves state only this session can explain.
  - Reliable triggers: owner signal, clean boundary, before-expensive-op. Agent self-detection of quota is best-effort only, never depended on. Full protocol: `docs/handoffs/_session-1-orchestrator-synthesis.md` §Pattern 18.

## §20 — GATE 5 COUNCIL APPENDIX (3 resolutions)

Full deliberation: `docs/handoffs/_session-1-orchestrator-synthesis.md` Appendix Gate-5-Council.

- **Resolution #1 — D2↔D8 light mode: REFRAME.** Mixing constants are engine-derived outputs, never hand-tuned per-theme. The smart color system handles theme inversion mathematically. → Extended Rule 15 + S1/S2/Wave-1.5 spec amendments. STANDS.
- **Resolution #2 — D3 dual-emission sRGB fallback: LOCKED.** Every primitive in `colors.css` ships `#hex` then `oklch(...)` in cascade; `generate-colors.js` emits both. STANDS.
- **Resolution #3 — OQ-B3 Space Grotesk variable-axis: WITHDRAWN by Wave 1.6.** No 800 weight exists in production; standard `wght@300..700` is canonical. See §11 + §23.

## §21 — FILE-EDITING RULES

- NEVER auto-format CSS — Cursor/editor format-on-save stays disabled (`.vscode/settings.json` is tracked to enforce this).
- NEVER add Node.js runtime deps to the shipped product (Rule 13). apcach + Playwright + build tooling live in `tools/` as build-time only, gitignored `node_modules/`.
- The agent owns interactive installs (npm, playwright) — run them, don't hand them to the owner.
- NEVER write to `../toolskin-showcase/`.
- Specs are markdown in `docs/handoffs/`; block CSS goes in `assets/css/next/` and `sandbox/` only in the relevant session.

## §22 — REFUSAL PATTERNS (halt + surface to owner when triggered)

- **R-repo-isolation** — any write/commit/cd into `../toolskin-showcase/`.
- **R-rule-15** — a component CSS rule referencing `--ts-bg-0..5` primitives directly instead of `--ts-this-bg` derivatives; or any hand-picked hex / non-apcach color value.
- **R-cascade** — substring-distribution selectors where explicit `:is(...)` enumeration is required (Rule 8).
- **R-D3-dual-emit** — an `oklch(...)` primitive declaration WITHOUT a paired sRGB fallback in the same rule block.
- **R-OQ-B3** — adding an `800` font-weight, a `--ts-font-weight-extra-bold` token, or a variable-axis `wght@300..900` font requirement (Wave 1.6 withdrew these — 6-step ladder, no 800).
- **R-D8** — a `Toolskin.setTheme()` value other than `'light' | 'dark' | 'auto'`.
- **R-pattern-opt-in** — a component optional behaviour exposed as a class modifier (`.ts-x--variant`) instead of a `data-*` attribute + token.
- **R-D4** — a hardcoded `toolskin@1` npm string outside canonical sources before npm-name verification is logged.
- **R-A1** — a block missing its `@ts-deps` header, or a `@ts-deps` cycle, or a sandbox `<link>` order that disagrees with the bundler topo-sort.
- **R-DNA family (R-DNA-1..6)** — visual-identity anti-patterns from Wave 1.5 §G; finalized in Session 1.5 housekeeping.

## §23 — WAVE 1.6 VISUAL AUDIT APPENDIX (binding visual ground truth)

Wave 1.6 was the first time any agent analysed RENDERED PIXELS of Toolskin (Pattern 17). 124 screenshots (90 Playwright headless + 34 owner real-Chrome) were audited by 5 parallel analysts; the owner annotated the findings. Canonical record: `docs/handoffs/_rebuild-visual-audit.md`; owner annotations: `docs/session-1-bootstrap/owner-annotations-visual-audit.md`.

**Three Gate 5 picks were revised by visual reality:**
- **OQ-A6** → SUPERSEDED by RULING 3. Base font size is **13px** (confirmed `toolskin.css:287`). The visual audit that said 15px was an instrumentation error.
- **OQ-B3 ABANDONED** → 6-step weight ladder `300/400/500/600/700/900`, no 800; H1=700, H2=600; standard `wght@300..700`. Resolution #3 WITHDRAWN.
- **OQ-D1** → 8px base confirmed; radius ladder is explicit `4/6/8/10/16` (not calc-derived).

Other binding findings: the live marquee `--ts-marquee-bg: var(--ts-bg-1)` is a regression (rebuild uses `--ts-this-bg` inheritance); a 3-candidate logo system (Bracket/Blade/Cascade) exists in `branding/` (unfinalized); FontAwesome toast-button failures are the known version bug. Playwright headless full-page captures of lazy-loaded pages are unreliable — per-section captures are ground truth.

Every Session 4+ block sandbox verifies against `_rebuild-visual-audit.md` + `_rebuild-design-dna.md` (which carries a Wave 1.6 reconciliation block) as combined design ground truth.
