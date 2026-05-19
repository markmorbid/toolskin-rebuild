# TOOLSKIN SESSION 1 ORCHESTRATION BRIEF v4 — REBUILD VIA SANDBOX WITH BLOCK LAYER TYPE PRE-ENGINEERING

**Session purpose:** Set up the toolchain, the sandbox directory structure, and the orchestrator pattern to REBUILD Toolskin block-by-block. Before any block is coded, a specialist sub-agent TEAM pre-engineers the block layer type structure on paper — so when code execution begins, agents implement to a locked spec contract and can work autonomously (while owner sleeps) without architectural drift.

**Working directory:** `D:\Mis Documentos\Projects\Toolskin Framework\toolskin-showcase`

═══════════════════════════════════════════════════════════════════════
CONVERSATION RULES (recovered from past chats — BINDING throughout)
═══════════════════════════════════════════════════════════════════════

These rules are the project's identity. They were established in past sessions and must not be lost again. Every sub-agent reads this section. Every commit honors it. Every skill encodes it.

## Rule 1 — Toolskin philosophy

> *"Zero framework dependencies. One stylesheet. Full dynamic control."*

Toolskin ships as standalone CSS + minimal JS. No build step required for consumers. No npm install for the end user. The CSS can be dropped into any project — static HTML, WordPress theme, Next.js, Vue, Rails view, AI-generated landing page — and it just works.

## Rule 2 — Token-driven, derivative-math-driven, NOT class-driven like Tailwind

> *"Toolskin is token-driven and derivative-math-driven, not class-driven like Tailwind. Every component follows the `ts-marquee` pattern — zero manual structural markup, everything via data attributes with JS building DOM and CSS styling via tokens."*

Consumers do not write classes like `bg-blue-500 px-4 py-2 hover:bg-blue-600`. They write `<div data-ts-card>` and Toolskin renders it.

## Rule 3 — The ts-marquee pattern is canonical for every component

Every block in the rebuild follows this pattern:

- ONE-LINER setup in HTML — declarative `<element data-ts-componentname="...">`
- JS builds the DOM (children, structure, accessibility attributes)
- CSS styles via tokens (no hardcoded values inside component rules)
- Zero manual structural markup from the consumer

The marquee component is the canonical exemplar. Every rebuilt component must replicate this pattern.

## Rule 4 — Surface superposition awareness is core, not patch-work

> *"This kind of rules must be consciously planned and designed to be automatically applied like on the light or dark theme modes, but to be surface superposition aware too. Because of the general design several components have conflicts of design and contrast on surface selection that should be automatically swapped when the elements' tokens are nested inside of a section or card that has a surface that risks visibility... We have to implement it correctly sitewide and planned with a contrast ratio plan that is mathematically effective and almost automatically effective and flawless and doesn't requires hardcoding every time."*
>
> *"Like the this-bg system or the accent and the negative system we implemented, the surfaces awarenesses and contrasts needs to be on the core schematically planned and mapped essentially to avoid initially this kind of problems and manual remappings. So the entire design is not a hand-made tail every time we see a component not correctly displayed on any mode or theme customization. So we get a solid design system that cannot fail on its core logic."*

The rebuild's system layer (`assets/css/next/system/`) encodes surface superposition mathematically. Components consume `--ts-this-*` tokens; the system handles auto-swapping based on context.

## Rule 5 — The product differentiator (recovered tonight)

> *"This must be something that literally you give to anybody, AI or WordPress, and instantly adapts and merges to any convention because the tokens makes that possible by the solidness and how is built. If we make this properly, the CSS or JS + Sass or CSS will certainly convert any interface at will to any design type easily, with just design patterns and UI application — just knowing where to adapt to."*
>
> *"The element that makes this product something that actually people may use and don't trash and run to Vercel or Replit or Wix."*

This is the differentiator. The rebuild succeeds when Toolskin can be handed to:
- A WordPress theme developer who knows nothing of Toolskin → tokens override theirs, layout absorbs their HTML
- An AI agent generating a landing page → tokens emit consistent contrast without the AI knowing color theory
- A Vue/React/Svelte developer → no framework lock-in, no naming conflicts
- A static HTML page → drop the CSS in `<head>`, it works

The block-layer type structure must be designed so this is achievable, not merely styled-around.

## Rule 6 — Existing toolskin.css is BLOCK PROTOTYPE — reference only

> The current `assets/css/toolskin.css` is treated as the visual and functional source-of-truth REFERENCE — read constantly, modified never. The design essence is correct, the code is not production-grade. Rebuild block-by-block, NOT refactor in place.

## Rule 7 — Block-by-block sandbox with reusable HTML base context

> *"Module by module, new file to test-drive each one. Same HTML base context reusable. Everything that is not the CSS and assets type must be efficiently reusable."*

ONE HTML test base (`sandbox/_base.html`) is reusable across every block. Block-specific differences live in the CSS file path. The HTML never changes per block — only the loaded stylesheet does. This is the automated parity harness.

## Rule 8 — Cascade-sensitivity rule (tonight's discovery)

`:root [class*="ts-tree"]` is a SCOPED DISTRIBUTION LAYER, not a default-value declaration. Cascade is partially explicit, not pure inheritance. The rebuild replaces substring distribution with explicit `:is(...)` enumeration where appropriate, designed during block-layer-type engineering.

## Rule 9 — @taxonomy_chips_strip 10 protected values are LOCKED as design input

The chips strip docstring inside `assets/css/toolskin.css` encodes 10 owner-locked values. The rebuilt chips block must produce these values visually — they are the design contract, not modifiable.

## Rule 10 — Owner manual changes are AUTHORITATIVE

Between agent sessions, owner edits stand. Agents do not "fix" or revert them without explicit owner direction.

## Rule 11 — Halt on anomaly, never improvise

When in doubt, stop and surface. The cost of stopping is a few minutes; the cost of improvising is months of recovery (see: this entire May session).

═══════════════════════════════════════════════════════════════════════
OPERATING MODE
═══════════════════════════════════════════════════════════════════════

ORCHESTRATOR with two sub-agent dispatch waves:

- **Wave 1 (Phase D.0):** Block Layer Type Engineering — TEAM PRE-MAPPING. No coding. Pure architectural design of how blocks compose, what types exist, what each block's spec contract looks like. Output: locked block typology.

- **Wave 2 (Phase D.1):** Domain Specialist Dispatch — five sub-agents (color foundation, system layer, component inventory, build pipeline, adaptive integration) build their specs CONSUMING the locked block typology from Wave 1.

The orchestrator pondersates between waves. Owner gates between waves. After Wave 2 + skill creation + commit, the rebuild has enough locked specs that subsequent sessions (Session 2+) can execute autonomously block-by-block while owner sleeps — because every block conforms to a typology that's been team-engineered first.

═══════════════════════════════════════════════════════════════════════
GLOBAL RULES
═══════════════════════════════════════════════════════════════════════

1. NEVER modify `assets/css/toolskin.css`. REFERENCE ONLY.
2. NEVER write any CSS file in `assets/css/next/*` this session. Wave 1+2 produce SPECS, not code. Code execution = Session 2+.
3. NEVER write any block CSS in `sandbox/*` this session.
4. NEVER auto-format any CSS. Cursor format-on-save MUST be disabled.
5. NEVER push.
6. NEVER expand scope beyond the current Phase.
7. At each owner gate: STOP and surface. Wait for explicit "proceed".
8. On unexpected output: HALT and write halt report to `docs/handoffs/_session-halt-<phase>.md`.
9. Sub-agents PROPOSE specs. Orchestrator WEIGHS. Owner DECIDES. No autonomous merging.
10. Honor all 11 conversation rules above.

═══════════════════════════════════════════════════════════════════════
═══  PHASE A — DISCOVER + READ EXISTING PROJECT DOCUMENTATION       ═══
═══════════════════════════════════════════════════════════════════════

## Step A.1 — Inventory `docs/handoffs/`

```
dir docs\handoffs\
dir docs\handoffs\design-system-audit\ 2>nul
```

Look for `_session-state-2026-05-17.md`, `_toolskin-general-refactor-roadmap.md`, `design-system-audit/architecture/restyling-architecture.md`, `design-system-audit/master-plan/master-plan.md`, `design-system-audit/README.md`.

## Step A.2 — Read in full (hold in context)

1. `CLAUDE.md`
2. `docs/handoffs/_session-state-2026-05-17.md`
3. `docs/handoffs/design-system-audit/README.md` (April rebuild bootstrap)
4. `docs/handoffs/design-system-audit/architecture/restyling-architecture.md` (THE SPEC)
5. `docs/handoffs/design-system-audit/master-plan/master-plan.md` (phased delivery)
6. `@taxonomy_chips_strip` inline docstring in `assets/css/toolskin.css` (find by grep — DO NOT modify)
7. Search `assets/css/toolskin.css` for the `ts-marquee` component rules — this is the canonical pattern exemplar

## Step A.3 — Report inventory + interpret framing

Output:

```
| Document | Path | Lines | Role in rebuild |
|---|---|---|---|
| restyling-architecture.md | ... | ... | THE REBUILD SPEC |
| master-plan.md | ... | ... | phased delivery |
| _session-state-2026-05-17.md | ... | ... | current reference state |
| @taxonomy_chips_strip | toolskin.css ~L? | ... | locked design input for chips block |
| ts-marquee rules | toolskin.css ~L? | ... | canonical pattern exemplar |
```

**OWNER GATE 1:** Owner confirms inventory + framing (REBUILD via sandbox, conversation rules binding, April docs as spec source). Approves before installation.

═══════════════════════════════════════════════════════════════════════
═══  PHASE B — TOOLCHAIN INSTALLATION + SANDBOX SCAFFOLDING         ═══
═══════════════════════════════════════════════════════════════════════

## B.1 — Prerequisites

```
node --version
npm --version
npx --version
git --version
```

Halt if any missing.

## B.2 — Install Superpowers

```
/plugin install superpowers@claude-plugins-official
```

Verify: `/superpowers:brainstorming`, `/superpowers:writing-plans`, `/superpowers:subagent-driven-development`, `/superpowers:using-git-worktrees`, `/superpowers:test-driven-development`, `/superpowers:systematic-debugging`, `/superpowers:requesting-code-review`, `/superpowers:verification-before-completion`, `/superpowers:finishing-a-development-branch`.

## B.3 — Install designer-skills

```
npx skills add julianoczkowski/designer-skills
```

Choose: ALL 8 skills, Claude Code, PROJECT scope.

## B.4 — Install ECC design-system

```
npx skills add affaan-m/everything-claude-code
```

Choose: `design-system` skill + owner-approved extras.

## B.5 — Install Anthropic skill-creator

```
/plugin marketplace add anthropics/skills
/plugin install skill-creator@anthropic-skills
```

## B.6 — Install apcach

```
mkdir tools\color-engine 2>nul
cd tools\color-engine
npm init -y
npm install apcach
cd ..\..
```

Update `.gitignore`:
```
tools/color-engine/node_modules/
```

## B.7 — Create rebuild + sandbox directory structure

```
mkdir assets\css\next 2>nul
mkdir assets\css\next\primitives 2>nul
mkdir assets\css\next\system 2>nul
mkdir assets\css\next\components 2>nul
mkdir assets\css\next\utilities 2>nul
mkdir sandbox 2>nul
mkdir sandbox\_template 2>nul
mkdir sandbox\00-foundation 2>nul
```

Create `assets/css/next/README.md` and `sandbox/README.md` per v3 brief.

## B.8 — Editor format-on-save confirmation

Cursor "Format on Save" for CSS: DISABLED. Chrome DevTools workspace live-edit: DISABLED. Report editor + status.

## B.9 — Installation summary

Output the standard summary table from v3.

**OWNER GATE 2:** Owner confirms toolchain + scaffold. Approves before document queue.

═══════════════════════════════════════════════════════════════════════
═══  PHASE C — QUEUE ALL DOCUMENTS                                  ═══
═══════════════════════════════════════════════════════════════════════

Create `docs/handoffs/_session-1-rebuild-queue.md` listing every source the orchestrator + sub-agents reference. Same structure as v3 with one addition under primary sources:

```
## CONVERSATION RULES (verbatim, binding)
- The full "CONVERSATION RULES" section from this orchestration brief (Rules 1-11)
- Every sub-agent reads this section before reading their domain-specific sources
- Any sub-agent output that violates a conversation rule is rejected at synthesis
```

Validate every source exists. **OWNER GATE 3:** Owner confirms queue. Approves before Wave 1 dispatch.

═══════════════════════════════════════════════════════════════════════
═══  PHASE D — TEAM PRE-ENGINEERING + DOMAIN SPECIALIST DISPATCH    ═══
═══════════════════════════════════════════════════════════════════════

This phase has TWO WAVES. Wave 1 pre-engineers the block layer type structure on paper. Wave 2 builds domain specs on top of that locked typology.

## ═══ WAVE 1 — BLOCK LAYER TYPE ENGINEERING (TEAM PRE-MAPPING) ═══

Three sub-agents work as a TEAM to engineer the block-layer typology BEFORE any block is coded. They scratch-think, debate via their reports, and converge on a locked spec contract that every future block must conform to.

```
/superpowers:subagent-driven-development
```

### Sub-Agent T1 — Block Typology Architect

**Brief:**
> Read CONVERSATION RULES + primary architecture sources + the `ts-marquee` canonical pattern from `assets/css/toolskin.css`.
> 
> Engineer the BLOCK TYPOLOGY — the categorical structure that classifies every Toolskin block. Each type has:
>   - A category name (e.g., "atomic", "molecular", "layout", "panel", "overlay", "data-display")
>   - Composition rules (what tokens does this type consume? What states does it support?)
>   - DOM contract (what does the consumer write? What does JS build?)
>   - CSS contract (what selectors? What `--ts-this-*` tokens?)
>   - Accessibility floor (ARIA roles, keyboard nav, focus management defaults)
>   - Surface superposition behavior (per Rule 4 — how does this type respond to nested contexts?)
> 
> Cross-reference with `restyling-architecture.md` two-layer pattern: Layer 1 (global token resolution) + Layer 2 (component pattern application).
> 
> Propose: 6-10 block types covering every component in the existing showcase. Every component must fit exactly ONE type.
> 
> Output: `docs/handoffs/_rebuild-block-typology.md` with:
>   - Type definitions table
>   - Example: classify 10 existing components (ts-button, ts-input, ts-card, ts-chip, ts-toggle, ts-accordion, ts-tabs, ts-modal, ts-tooltip, ts-tree) by type
>   - The "spec contract template" any block of each type must produce
> 
> DO NOT write CSS or JS. Pure architectural design.

### Sub-Agent T2 — Block Composition + Reusable HTML Base Designer

**Brief:**
> Read CONVERSATION RULES (especially Rule 7) + primary sources + Sub-Agent T1's typology when delivered.
> 
> Engineer the REUSABLE HTML BASE CONTEXT — one HTML file (`sandbox/_base.html`) that all blocks share. Per Rule 7, "module by module, new file to test-drive each one. Same HTML base context reusable."
> 
> The base HTML:
>   - Loads `assets/css/next/primitives/*.css` + `assets/css/next/system/*.css` (the rebuilt foundation)
>   - Loads a single dynamic CSS slot for the block under test (passed as query param or build-time variable)
>   - Provides standardized DOM scaffolding for each block type (per T1's typology)
>   - Includes parity rig: side-by-side iframes — left loads `assets/css/toolskin.css` (reference), right loads block.css (rebuild)
>   - Includes 10-dimension visual audit hooks (per ECC design-system skill)
> 
> Engineer the BLOCK COMPOSITION RULES — how blocks compose into pages:
>   - Can a `card` contain a `chip`? Yes — surface superposition handles nested context.
>   - Can a `modal` contain a `tabs`? Yes — same.
>   - Are there forbidden nestings? Document them.
> 
> Output: `docs/handoffs/_rebuild-base-context-spec.md` with:
>   - Reusable base HTML template (the actual HTML file, written as a fenced code block — not committed yet)
>   - Block composition rules
>   - How parity testing works for each block type
>   - Same-base-context invariants (what stays constant, what varies)
> 
> DO NOT write the HTML file. Provide it inline in the spec doc.

### Sub-Agent T3 — Adaptive Integration Architect (Rule 5 — drop-in to any framework)

**Brief:**
> Read CONVERSATION RULES (especially Rule 5) + primary sources.
> 
> Engineer the ADAPTIVE INTEGRATION CONTRACT — what makes Toolskin drop-in compatible with arbitrary frameworks per Rule 5.
> 
> Specifically:
>   - **WordPress theme:** if a theme already defines `--wp-*` custom properties, can Toolskin tokens coexist via a token-bridge layer? Design the bridge.
>   - **AI-generated landing page:** if an AI emits HTML with random Tailwind-like classes, can Toolskin tokens still apply via component classes (`.ts-button`)? Verify.
>   - **Vue/React/Svelte component:** can Toolskin components be imported as web components or remain as data-attribute-driven plain HTML?
>   - **Static HTML page:** what's the minimum integration? One `<link>` tag in `<head>`, period.
>   - **Existing design tokens conflict:** if consumer already defines `--accent`, does Toolskin namespace `--ts-accent` cleanly?
> 
> Verify the adaptive system framing across these 5 integration scenarios. Each must pass: tokens apply, no conflict, no manual rewriting of consumer code.
> 
> Output: `docs/handoffs/_rebuild-adaptive-integration-spec.md` with:
>   - 5 integration scenario walkthroughs
>   - The token-bridge pattern for namespace conflicts
>   - The "literally give to anybody" verification checklist
>   - Any architectural changes required vs current toolskin.css to make this work
> 
> DO NOT write code. Spec + verification only.

### Wave 1 ponderation

Time-box each T-sub-agent at 25 min. After all three deliver, orchestrator pondersates:

1. Does T1's typology cover every component in the existing showcase?
2. Does T2's reusable base context work for every type T1 defined?
3. Does T3's adaptive integration work without breaking T1's typology or T2's base context?
4. Any conflicts surface? Owner decides.

Output: `docs/handoffs/_wave-1-synthesis.md` with the locked block-layer type structure ready for Wave 2 to consume.

**OWNER GATE 4 (CRITICAL):** Owner reviews Wave 1 synthesis. The block typology + reusable base + adaptive integration contract is the locked foundation. If owner approves, Wave 2 builds on it. If owner objects, Wave 1 iterates. **This gate is the most important of the entire session — it sets the architectural trajectory for every future block.**

## ═══ WAVE 2 — DOMAIN SPECIALIST DISPATCH ═══

Now five sub-agents build domain specs CONSUMING Wave 1's locked typology.

```
/superpowers:subagent-driven-development
```

### Sub-Agent S1 — Color Foundation Architect

**Brief:** (same as v3 Sub-Agent 1) + must conform to Wave 1's typology when proposing primitive layer structure. apcach-derived OKLCH primitives at `assets/css/next/primitives/`. Output: `_rebuild-primitives-spec.md`.

### Sub-Agent S2 — System Layer Architect

**Brief:** (same as v3 Sub-Agent 2) + must implement Wave 1's surface-superposition rules at the system layer. `--ts-this-*` derivative chain at `assets/css/next/system/`. Output: `_rebuild-system-spec.md`.

### Sub-Agent S3 — Component Registry + Block Prioritization

**Brief:** (same as v3 Sub-Agent 3) + every registry entry is classified by Wave 1 type. Each entry includes:
- The Wave 1 type
- The spec contract (per T1's template)
- Reference rules from `toolskin.css` (line range)
- Estimated rebuild complexity
- Dependencies on other blocks

Plus: propose Session 2-N block sequencing. The first 5 blocks get full sketch `block-spec.md` files (consumable by autonomous sub-agents in Session 2+).

Output: `_rebuild-component-registry.md`.

### Sub-Agent S4 — Build Pipeline Architect

**Brief:** (same as v3 Sub-Agent 4) + must integrate Wave 1's reusable base context (T2's `_base.html` template). Build pipeline composes `assets/css/next/*` into ship-ready bundle. Output: `_rebuild-build-pipeline-spec.md`.

### Sub-Agent S5 — Autonomous Execution Protocol Architect ⭐ NEW (the "while I sleep" enabler)

**Brief:**
> Read CONVERSATION RULES + all Wave 1 outputs + Wave 2 S1-S4 outputs as they arrive.
> 
> Design the AUTONOMOUS EXECUTION PROTOCOL for Session 2+ block-by-block rebuild. Per owner's intent: "they just do it while I sleep."
> 
> The protocol enables agents to execute blocks autonomously because:
>   - Block typology is locked (Wave 1 / T1)
>   - Reusable base context is locked (Wave 1 / T2)
>   - Adaptive integration contract is locked (Wave 1 / T3)
>   - Spec contracts per block are locked (Wave 2 / S3)
>   - Sequencing is locked (Wave 2 / S3)
>   - Build pipeline is locked (Wave 2 / S4)
> 
> Design the per-block execution flow:
>   - Step 1: Sub-agent loads block spec contract from `_rebuild-component-registry.md`
>   - Step 2: `/superpowers:using-git-worktrees` creates isolated worktree
>   - Step 3: Copy `sandbox/_template/` to `sandbox/<NN>-<component>/`
>   - Step 4: Sub-agent reads reference rules from `assets/css/toolskin.css` for the block
>   - Step 5: Sub-agent writes `block.css` consuming primitives + system per spec contract
>   - Step 6: `/superpowers:test-driven-development` for verifiable behaviors
>   - Step 7: Parity HTML auto-renders both versions via the reusable base
>   - Step 8: `/design-system audit` runs 10-dimension score
>   - Step 9: If parity score >= threshold AND audit passes: auto-commit to worktree branch + open PR
>   - Step 10: Owner reviews PR in the morning. Approves or rejects.
> 
> Define the auto-commit GATES that allow autonomous progression vs forced halt-and-surface:
>   - Auto-progress: parity score above threshold, no architectural rule violations
>   - Halt-and-surface: any rule violation, any new `!important`, any unique class creation, any token derivation outside Wave 1 typology
> 
> Output: `_rebuild-autonomous-protocol.md` with:
>   - Per-block execution flow
>   - Auto-progress vs halt-and-surface gate criteria
>   - Audit thresholds (specific 10-dimension scores required)
>   - PR template for owner morning review
>   - Resume protocol if a block halts mid-execution

### Wave 2 ponderation

Orchestrator pondersates all 5 specs against each other + against Wave 1 outputs. Output `docs/handoffs/_session-1-orchestrator-synthesis.md`:

```markdown
# Session 1 — Orchestrator Synthesis

## Wave 1 outputs (block-layer type pre-engineering)
- _rebuild-block-typology.md (T1)
- _rebuild-base-context-spec.md (T2)
- _rebuild-adaptive-integration-spec.md (T3)
- _wave-1-synthesis.md (cross-team)

## Wave 2 outputs (domain specialist)
- _rebuild-primitives-spec.md (S1)
- _rebuild-system-spec.md (S2)
- _rebuild-component-registry.md (S3)
- _rebuild-build-pipeline-spec.md (S4)
- _rebuild-autonomous-protocol.md (S5)

## Cross-wave conflicts surfaced
[list — owner decides]

## Session 2-N sequencing

| Session | Block | Type (Wave 1) | Spec source | Autonomous? |
|---|---|---|---|---|
| 2 | Primitives (apcach gen) | foundation | S1 | semi (owner reviews PR) |
| 3 | System layer | foundation | S2 | semi |
| 4 | Block 01 — ts-button | atomic | S3 sketch | yes (per S5 protocol) |
| 5 | Block 02 — ts-input | atomic | S3 sketch | yes |
| 6 | Block 03 — ts-chip | atomic | S3 sketch | yes |
| 7 | Block 04 — ts-card | molecular | S3 sketch | yes |
| 8 | Block 05 — ts-toggle | atomic | S3 sketch | yes |
| 9+ | Per registry dependency order | various | S3 | yes |

## Open questions for owner
[list]
```

**OWNER GATE 5:** Owner reviews Wave 2 synthesis. Approves sequencing. Resolves conflicts. This is the trigger for autonomous-while-sleeping execution starting Session 4.

═══════════════════════════════════════════════════════════════════════
═══  PHASE E — BUILD TOOLSKIN-ARCHITECTURE SKILL                    ═══
═══════════════════════════════════════════════════════════════════════

```
/skill-create
```

Same v3 inputs, with these ADDITIONS to the SKILL.md content:

**SKILL.md content (in order):**

1. **CONVERSATION RULES verbatim (Rules 1-11)** — read first, binding for every session
2. **The rebuild framing** — block-by-block, sandbox, reference-only old toolskin.css
3. **Block typology** — copy from `_rebuild-block-typology.md`
4. **Reusable HTML base context** — copy from `_rebuild-base-context-spec.md`
5. **Adaptive integration contract** — copy from `_rebuild-adaptive-integration-spec.md`
6. **Three-tier token architecture** — primitives (apcach) → system (--ts-this-*) → component
7. **Surface superposition** — Rule 4 mathematical pattern
8. **Cascade strategy** — explicit :is() enumeration, not substring distribution
9. **Block sandbox workflow** — per-block execution flow from S5 protocol
10. **Autonomous execution protocol** — auto-progress vs halt-and-surface gates from S5
11. **File-editing rules** — backup, diff protocol, no auto-format
12. **Refusal patterns**

**references/ subdirectory:**

All Wave 1 + Wave 2 outputs copied as references. Plus:
- `conversation-rules-verbatim.md` (Rules 1-11 in full)
- `taxonomy-chips-strip-contract.md`
- `restyling-architecture-full.md` (April)
- `master-plan-full.md` (April)
- `apcach-color-engine.md`
- `cascade-sensitivity-incident-2026-05-17.md`
- `ts-marquee-canonical-pattern.md` — extracted from toolskin.css as the exemplar every block follows
- `session-state-2026-05-17.md`

## Validate + test auto-load

Same as v3.

**OWNER GATE 6:** Owner reads SKILL.md in full + spot-checks references. Approves before commit.

═══════════════════════════════════════════════════════════════════════
═══  PHASE F — COMMIT SESSION 1 BASELINE                            ═══
═══════════════════════════════════════════════════════════════════════

## Stage

```
git add .claude/skills/toolskin-architecture/
git add tools/color-engine/package.json
git add tools/color-engine/package-lock.json
git add sandbox/
git add assets/css/next/
git add docs/handoffs/_session-1-rebuild-queue.md
git add docs/handoffs/_wave-1-synthesis.md
git add docs/handoffs/_rebuild-block-typology.md
git add docs/handoffs/_rebuild-base-context-spec.md
git add docs/handoffs/_rebuild-adaptive-integration-spec.md
git add docs/handoffs/_rebuild-primitives-spec.md
git add docs/handoffs/_rebuild-system-spec.md
git add docs/handoffs/_rebuild-component-registry.md
git add docs/handoffs/_rebuild-build-pipeline-spec.md
git add docs/handoffs/_rebuild-autonomous-protocol.md
git add docs/handoffs/_session-1-orchestrator-synthesis.md
git add .gitignore
```

## Commit

```
git status
git diff --staged --stat
```

```
git commit -m "feat(rebuild): session 1 — toolchain + apcach + block layer type pre-engineering + autonomous protocol + toolskin-architecture skill

REBUILD APPROACH (BLOCK LAYER TYPE PRE-ENGINEERED)
Two-wave orchestrator dispatch:

Wave 1 — Block Layer Type Engineering (team pre-mapping)
- T1 Block Typology Architect — locked block type categories + composition rules
- T2 Block Composition + Reusable HTML Base Designer — single _base.html for all blocks
- T3 Adaptive Integration Architect — drop-in to WP/AI/Vue/React/static HTML per Rule 5

Wave 2 — Domain Specialist Dispatch (consumes Wave 1)
- S1 Color Foundation — apcach-derived primitives
- S2 System Layer — --ts-this-* derivative chain + surface superposition
- S3 Component Registry — every block classified by Wave 1 type
- S4 Build Pipeline — composition + reusable base integration
- S5 Autonomous Execution Protocol — 'while I sleep' execution gates

CONVERSATION RULES RECOVERED (verbatim in SKILL.md):
1. Zero framework dependencies, one stylesheet, full dynamic control
2. Token-driven + derivative-math-driven, NOT class-driven like Tailwind
3. ts-marquee pattern canonical for every component
4. Surface superposition awareness is core, not patch-work
5. The product differentiator: literally drop-in for AI/WordPress/anybody
6. Existing toolskin.css = block prototype, reference only
7. Block-by-block sandbox with reusable HTML base context
8. Cascade-sensitivity rule (May 17 discovery)
9. @taxonomy_chips_strip 10 values locked as design input
10. Owner manual changes authoritative
11. Halt on anomaly, never improvise

TOOLCHAIN INSTALLED
- Superpowers (worktrees, subagents, TDD)
- julianoczkowski/designer-skills (respects existing reference)
- affaan-m/everything-claude-code design-system (10-dim audit)
- Anthropic skill-creator (built the architecture skill)
- apcach at tools/color-engine/ (APCA-consistent OKLCH)

TOOLSKIN-ARCHITECTURE SKILL
Auto-loads every session. Encodes conversation rules, block typology,
reusable base context, adaptive integration contract, autonomous
execution protocol. Every future agent has the rebuild approach
binding from turn 1.

WHY THIS COMMIT MATTERS
3 months of disasters traced to: agents executing without locked
specs, no block typology, no adaptive contract, no autonomous
gates. This session locks all of it. Sessions 4+ can execute
block-by-block autonomously while owner sleeps because the
architectural trajectory is fully team-engineered and committed.

NOT IN THIS COMMIT
- Any assets/css/toolskin.css changes (REFERENCE ONLY)
- Any assets/css/next/*.css implementation (Sessions 2+)
- Any sandbox/<NN>-<component>/ implementation (Sessions 2+)

NEXT SESSION (SESSION 2)
Build the primitives foundation per _rebuild-primitives-spec.md
using apcach. Semi-autonomous (owner reviews PR).

SESSION 3
Build the system layer per _rebuild-system-spec.md. Semi-autonomous.

SESSION 4+
Block-by-block autonomous execution via S5 protocol.
Owner sleeps. Agents work. PRs reviewed in the morning.

Refs:
- docs/handoffs/_session-1-orchestrator-synthesis.md
- docs/handoffs/_wave-1-synthesis.md
- docs/handoffs/_rebuild-*-spec.md (8 spec docs)
- docs/handoffs/design-system-audit/architecture/restyling-architecture.md
- docs/handoffs/design-system-audit/master-plan/master-plan.md"
```

## Verify

```
git log --oneline -3
git status
```

**OWNER GATE 7 (FINAL):** Owner confirms commit landed. Session 1 ends. Session 2 begins block-by-block rebuild starting with primitives.

═══════════════════════════════════════════════════════════════════════
EXECUTION SEQUENCE SUMMARY
═══════════════════════════════════════════════════════════════════════

| Phase | What | Gate | Time |
|---|---|---|---|
| A | Discover + read existing docs (incl. April rebuild spec + ts-marquee exemplar) | 1 | ~20 min |
| B | Install 5 tools + create sandbox + next/ scaffold | 2 | ~30 min |
| C | Queue all source documents + conversation rules | 3 | ~15 min |
| D Wave 1 | Block layer type engineering (T1+T2+T3 team) | 4 ⭐ critical | ~60 min |
| D Wave 2 | Domain specialist dispatch (S1+S2+S3+S4+S5) | 5 | ~75 min |
| E | Build toolskin-architecture skill | 6 | ~45 min |
| F | Commit Session 1 baseline | 7 | ~10 min |

**Session 1 total: ~4 hours.** Establishment only. No rebuild work executed. Block typology + reusable base + adaptive contract + autonomous protocol all locked.

═══════════════════════════════════════════════════════════════════════
HARD CONSTRAINTS
═══════════════════════════════════════════════════════════════════════

- NEVER modify `assets/css/toolskin.css`
- NEVER write any CSS file in `assets/css/next/*` this session
- NEVER write any block CSS in `sandbox/*` this session
- NEVER write `sandbox/_base.html` this session — T2 provides it inline in spec doc; it's committed by an autonomous Session 2 agent after Session 1 lands
- NEVER push
- NEVER auto-format
- NEVER skip owner gates
- NEVER let a sub-agent autonomously merge findings into files outside `docs/handoffs/_rebuild-*.md`
- NEVER violate any of the 11 CONVERSATION RULES
- NEVER touch `@taxonomy_chips_strip` block contents
- HALT on any unexpected output

═══════════════════════════════════════════════════════════════════════
PONDERATION PRINCIPLE (binding the orchestrator throughout)
═══════════════════════════════════════════════════════════════════════

The orchestrator does NOT execute. It:
- Reads everything (including 11 CONVERSATION RULES)
- Queues all sources
- Dispatches Wave 1 team sub-agents (block layer type pre-engineering)
- Pondersates Wave 1 outputs
- Dispatches Wave 2 domain sub-agents (consuming Wave 1)
- Pondersates Wave 2 outputs against Wave 1
- Surfaces findings to owner
- Builds the toolskin-architecture skill that encodes EVERYTHING
- Commits the baseline

Sub-agents propose specs. Orchestrator weighs across waves. Owner decides at gates. THEN, Session 2+, sub-agents execute per locked specs — autonomously where S5 protocol allows, semi-autonomously where review is required.

This pattern is the survival mechanism. The block typology + reusable base + adaptive contract + autonomous protocol means agents can't drift architecturally because every move is pre-mapped.

═══════════════════════════════════════════════════════════════════════
THE PROMISE OF THIS SESSION
═══════════════════════════════════════════════════════════════════════

When this session commits:

- Owner has a locked block typology that every future block must conform to
- Owner has a reusable HTML base context that automates parity testing
- Owner has an adaptive integration contract that verifies Rule 5 (drop-in compatibility)
- Owner has an autonomous execution protocol with explicit auto-progress vs halt gates
- Owner has a skill that auto-loads all of the above every session
- Owner can sleep starting Session 4 while agents execute block-by-block per locked specs

The rebuild becomes mechanical execution against locked specs, not architectural improvisation.

═══════════════════════════════════════════════════════════════════════
BEGIN PHASE A
═══════════════════════════════════════════════════════════════════════

Read `CLAUDE.md` first. Then proceed with Step A.1.
