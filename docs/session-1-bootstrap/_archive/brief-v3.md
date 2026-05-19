# TOOLSKIN SESSION 1 ORCHESTRATION BRIEF v3 — REBUILD VIA SANDBOX

**Session purpose:** Set up the toolchain, the sandbox directory structure, and the orchestrator pattern to **REBUILD** Toolskin block-by-block as production-ready code. The current `assets/css/toolskin.css` is the BLOCK PROTOTYPE — visually correct, but not production. This session does NOT modify it. This session establishes the foundation for re-engineering it in subsequent sessions.

**Working directory:** `D:\Mis Documentos\Projects\Toolskin Framework\toolskin-showcase`

**Foundational distinction (read twice):**

> This is a **REBUILD**, not a refactor in place.
>
> The existing `assets/css/toolskin.css` is treated as the **visual and functional source-of-truth REFERENCE** — read constantly, modified never. It is the block prototype: the design essence is correct, but the code is not production-grade.
>
> The new production code is built in `assets/css/next/` (a parallel rebuild tree). Each component is sandboxed in `sandbox/<component>/` with its own HTML test page, isolated CSS, and visual parity verification against the reference. Only after a block is verified in isolation does its CSS migrate into `assets/css/next/components/<component>.css`.
>
> The sandbox approach was established in the April handoff under "Phase 3 isolation" with `/superpowers:using-git-worktrees`. The block-prototype framing was established with the `ts-marquee` pattern (zero manual structural markup, everything via data attributes, JS builds DOM, CSS styles via tokens). This session honors both.

**Operating mode:** ORCHESTRATOR. Main agent installs toolchain, sets up sandbox structure, queues docs, dispatches specialist sub-agents to map the rebuild territory, ponders findings, builds the toolskin-architecture skill that encodes the REBUILD approach, commits the baseline. Sub-agents propose; orchestrator weighs; owner decides. No write to `assets/css/toolskin.css` ever. No write to `assets/css/next/*.css` in THIS session — sub-agents only analyze and plan.

**Estimated time:** 2.5–3 hours across 6 phases with 6 owner gates. Designed to **start the project without killing it** — establishment session only.

═══════════════════════════════════════════════════════════════════════
GLOBAL RULES (binding the entire session)
═══════════════════════════════════════════════════════════════════════

1. NEVER modify `assets/css/toolskin.css`. It is REFERENCE ONLY. Read constantly, write never.
2. NEVER write to `assets/css/next/*.css` in THIS session. Sandbox/foundation building begins in Session 2.
3. NEVER auto-format any CSS file. Cursor format-on-save MUST be disabled.
4. NEVER push to remote.
5. NEVER expand scope beyond the current Phase.
6. At each owner gate: STOP and surface — wait for explicit "proceed".
7. On unexpected output: HALT and write `docs/handoffs/_session-halt-<phase>-<desc>.md`.
8. CASCADE-SENSITIVITY RULE (BINDING in reference reading): `:root [class*="ts-tree"]` is a SCOPED DISTRIBUTION LAYER. The rebuild will replace this pattern with explicit-enumerated `:is(.ts-tree-explorer, .ts-tree)` selectors at the appropriate phase — BUT this is a future-session decision, not this session's work.
9. `@taxonomy_chips_strip` design contract is the REBUILD'S DESIGN INPUT — the 10 protected values are what the rebuilt chips-strip block must produce visually.
10. Sub-agents PROPOSE, orchestrator PONDERATES, owner DECIDES. No autonomous merging.

═══════════════════════════════════════════════════════════════════════
═══  PHASE A — DISCOVER + READ EXISTING PROJECT DOCUMENTATION       ═══
═══════════════════════════════════════════════════════════════════════

The rebuild plan already exists across multiple April documents. Locate and read everything.

## Step A.1 — Inventory `docs/handoffs/`

```
dir docs\handoffs\
dir docs\handoffs\design-system-audit\ 2>nul
```

Look for:
- `_session-state-2026-05-17.md` (tonight's session state)
- `_toolskin-general-refactor-roadmap.md` (5-phase roadmap)
- `design-system-audit/architecture/restyling-architecture.md` (April core blueprint — the SPECIFICATION for the rebuild)
- `design-system-audit/master-plan/master-plan.md` (April phased delivery — Phase 0-5)
- `design-system-audit/README.md` (April handoff entry point — bootstraps Superpowers, defines sub-agent roles)

## Step A.2 — Read in full (do not summarize, hold in context)

In order:

1. `CLAUDE.md` (repo root)
2. `docs/handoffs/_session-state-2026-05-17.md` (current state)
3. `docs/handoffs/_toolskin-general-refactor-roadmap.md` (recent roadmap)
4. `docs/handoffs/design-system-audit/README.md` — IF present
5. `docs/handoffs/design-system-audit/architecture/restyling-architecture.md` — IF present (THE REBUILD SPEC)
6. `docs/handoffs/design-system-audit/master-plan/master-plan.md` — IF present (PHASED DELIVERY)
7. The `@taxonomy_chips_strip` inline comment block inside `assets/css/toolskin.css` (find by grep — do NOT modify)

If files 4-6 don't exist at expected paths, search the entire `docs/` tree.

## Step A.3 — Report inventory + interpret framing

Output:

```
| Document | Path | Lines | Status | Role in rebuild |
|---|---|---|---|---|
| restyling-architecture.md | ... | ... | April spec | THE REBUILD BLUEPRINT |
| master-plan.md | ... | ... | April roadmap | PHASED DELIVERY |
| _session-state-2026-05-17.md | ... | ... | tonight | current reference state |
| _toolskin-general-refactor-roadmap.md | ... | ... | tonight | superseded by rebuild approach |
| CLAUDE.md | ... | ... | foundational | conventions |
| @taxonomy_chips_strip | toolskin.css ~L? | ... | locked | rebuild design input for chips |
| (others) | ... | ... | ... | ... |
```

**Critical framing question for the orchestrator to answer in the report:**

> Per the April docs, the rebuild was always planned as block-by-block isolated work, not in-place refactoring. The `_toolskin-general-refactor-roadmap.md` from tonight described 5 phases of in-place refactor; that's now superseded. Do the April docs (`restyling-architecture.md` + `master-plan.md`) provide enough specification to drive the rebuild? Report yes/no with evidence.

**OWNER GATE 1:** Owner confirms framing — REBUILD via sandbox, April docs as spec, tonight's roadmap superseded. Approves before any installation.

═══════════════════════════════════════════════════════════════════════
═══  PHASE B — TOOLCHAIN INSTALLATION + SANDBOX SCAFFOLDING         ═══
═══════════════════════════════════════════════════════════════════════

Install five tools + create the sandbox directory structure.

## Step B.1 — Prerequisites

```
node --version
npm --version
npx --version
git --version
```

Report each. Halt if missing.

## Step B.2 — Install Superpowers

```
/plugin install superpowers@claude-plugins-official
```

Verify these slash commands exist:
- `/superpowers:brainstorming`
- `/superpowers:writing-plans`
- `/superpowers:subagent-driven-development`
- `/superpowers:using-git-worktrees` ⭐ (the sandbox enabler)
- `/superpowers:test-driven-development` ⭐ (RED-GREEN-REFACTOR per block)
- `/superpowers:systematic-debugging`
- `/superpowers:requesting-code-review`
- `/superpowers:verification-before-completion`
- `/superpowers:finishing-a-development-branch`

Job: phased execution discipline + git-worktree sandbox isolation per block.

## Step B.3 — Install designer-skills

```
npx skills add julianoczkowski/designer-skills
```

Choose: ALL 8 skills, Claude Code target, PROJECT scope.

Verify: `/design-flow`, `/grill-me`, `/design-brief`, `/information-architecture`, `/design-tokens`, `/brief-to-tasks`, `/frontend-design`, `/design-review`.

Job: design-process discipline + respects existing reference code.

## Step B.4 — Install ECC design-system

```
npx skills add affaan-m/everything-claude-code
```

Choose: `design-system` skill (minimum) + any other ECC skills owner approves.

Verify: `/design-system` (generate / audit / slop-check modes).

Job: 10-dimension visual audit + slop detection — used per block to verify rebuild quality.

## Step B.5 — Install Anthropic skill-creator

```
/plugin marketplace add anthropics/skills
/plugin install skill-creator@anthropic-skills
```

Verify: `/skill-create`.

Job: wrap existing project docs (rebuild spec) into auto-loading SKILL.md.

## Step B.6 — Install apcach (color-engine substrate)

Build-time tooling, not runtime dependency. Toolskin's distribution stays pure CSS — apcach generates canonical token values that get baked into the rebuild's `01-tokens.css`.

```
mkdir tools\color-engine 2>nul
cd tools\color-engine
npm init -y
npm install apcach
cd ..\..
```

Verify:
```
type tools\color-engine\package.json
dir tools\color-engine\node_modules\apcach\
```

Add to `.gitignore`:
```
tools/color-engine/node_modules/
```

Job: APCA-consistent OKLCH color derivation for the rebuilt token foundation.

## Step B.7 — Create the rebuild + sandbox directory structure ⭐ NEW

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

Create `sandbox/README.md`:

```markdown
# Toolskin Rebuild — Sandbox Directory

This directory holds per-block sandboxes for the Toolskin rebuild.

## Structure

- `_template/` — copy this folder to start a new block sandbox
- `<NN>-<component>/` — one folder per block (e.g., `01-button/`, `02-input/`)
  - `block.html` — isolated test page rendering only this block
  - `block.css` — the rebuilt CSS for this block
  - `parity.html` — side-by-side render of reference (toolskin.css) vs rebuild (block.css)
  - `block-spec.md` — block design contract (tokens consumed, states supported, parity criteria)
  - `verification.md` — sign-off log: what was tested, parity results, owner approval

## Workflow per block

1. `/superpowers:using-git-worktrees` to create isolated worktree branch
2. Copy `_template/` to new `<NN>-<component>/`
3. Sub-agent reads the reference rules from `assets/css/toolskin.css` for the block
4. Sub-agent writes the rebuilt block at `<NN>-<component>/block.css` consuming the rebuilt token foundation
5. `/superpowers:test-driven-development` for verifiable behaviors (parity, state transitions, token consumption)
6. Visual parity verified via `parity.html` — owner approves
7. Block CSS promoted to `assets/css/next/components/<component>.css`
8. `block.html`, `parity.html`, `block-spec.md`, `verification.md` retained as historical record
9. `/superpowers:finishing-a-development-branch` to merge worktree

## Rules

- Old `assets/css/toolskin.css` is READ-ONLY reference, never modified
- New `assets/css/next/*` is the production target
- Each block sandbox is independent — no cross-block dependencies until promoted
- The token foundation (`assets/css/next/primitives/` + `assets/css/next/system/`) must land FIRST before any component block
- Block sandboxes consume `assets/css/next/primitives/*.css` + `assets/css/next/system/*.css` via @import (sandbox-relative path)
```

Create `assets/css/next/README.md`:

```markdown
# Toolskin Rebuild — Production Target

This directory holds the rebuilt production CSS. Built block-by-block via the sandbox workflow.

## Structure

- `primitives/` — apcach-derived token primitives (`--ts-bg-*`, `--ts-accent-*`, `--ts-fs-*`, etc.)
- `system/` — derivative tokens (`--ts-this-bg-*`, surface superposition, OKLCH math)
- `components/` — per-component rules (one file per block, imported once verified in sandbox)
- `utilities/` — shared utility rules (a11y, motion-safe, print, etc.)

## Build order

1. `primitives/` lands first (apcach-derived foundation)
2. `system/` lands second (derivative chains depend on primitives)
3. `components/` land block-by-block from sandbox
4. `utilities/` land as needed

## How this gets bundled

Final shipped file `assets/css/toolskin-v2.css` (or kept as multi-file imports — decision deferred) is composed from this directory.

The old `assets/css/toolskin.css` is preserved for visual reference until the rebuild is complete and the showcase HTML is migrated to load `toolskin-v2.css`.
```

Verify creation:
```
dir sandbox\
dir assets\css\next\
```

## Step B.8 — Editor format-on-save confirmation

- Cursor "Format on Save" for CSS: DISABLED
- Chrome DevTools workspace live-edit writing to disk: DISABLED
- Report editor name + status

## Step B.9 — Installation + scaffold summary

```
| Component | Status | Notes |
|---|---|---|
| Superpowers | installed/failed | [list of slash commands verified] |
| designer-skills | installed/failed | [list] |
| ECC design-system | installed/failed | /design-system available |
| skill-creator | installed/failed | /skill-create available |
| apcach | installed/failed | tools/color-engine/ initialized |
| sandbox/ scaffold | created | + _template/ + 00-foundation/ + README |
| assets/css/next/ scaffold | created | + primitives/ + system/ + components/ + utilities/ + README |
| Editor format-on-save | disabled/enabled | [editor name] |
```

**OWNER GATE 2:** Owner confirms toolchain + scaffold operational. Approves before document queue.

═══════════════════════════════════════════════════════════════════════
═══  PHASE C — QUEUE ALL DOCUMENTS                                  ═══
═══════════════════════════════════════════════════════════════════════

Create `docs/handoffs/_session-1-rebuild-queue.md`:

```markdown
# Session 1 — Rebuild Document Queue

## Primary architecture sources (orchestrator + ALL sub-agents read)

1. CLAUDE.md (repo root)
2. docs/handoffs/_session-state-2026-05-17.md
3. docs/handoffs/design-system-audit/README.md (rebuild bootstrap)
4. docs/handoffs/design-system-audit/architecture/restyling-architecture.md ⭐ (THE REBUILD SPEC)
5. docs/handoffs/design-system-audit/master-plan/master-plan.md (phased delivery)

## Domain-specific sources

### Color foundation (Sub-Agent 1: Color Foundation Architect)
6. apcach README at tools/color-engine/node_modules/apcach/README.md
7. Current --ts-bg-*, --ts-accent-*, --ts-fs-* primitive declarations in toolskin.css (search & extract)
8. Current OKLCH derivative chain rules in toolskin.css (search & extract)

### System layer (Sub-Agent 2: System Layer Architect)
9. Current --ts-this-bg-* derivative chain rules in toolskin.css
10. Surface superposition .ts-section--alt pattern (if present)
11. --ts-this-bg-grad-dark-pct global knob

### Component inventory (Sub-Agent 3: Component Inventory + Block Prioritization)
12. Every component selector family in toolskin.css (.ts-btn, .ts-input, .ts-card, .ts-chip, etc.)
13. The @taxonomy_chips_strip locked design contract (locked design INPUT for chips block)
14. The ts-marquee pattern (canonical "zero markup, data-attribute driven" block exemplar)

### Build pipeline (Sub-Agent 4: Build Pipeline Architect)
15. Existing HTML showcase files (index.html, toolskin-lab.html, tree-explorer.html, branding/index.html, pitchdeck/*) — to understand what blocks need to ship
16. assets/js/toolskin.js (current runtime — does it build DOM from data attributes per ts-marquee pattern, or assume static markup?)

## State sources (reference for orchestrator)

17. git log --oneline -20
18. Working tree state from _session-state-2026-05-17.md
19. _bu/rollback-2026-05-17/ artifacts
```

Validate every source exists. Report missing.

**OWNER GATE 3:** Owner confirms queue. Adds any missing sources. Approves before sub-agent dispatch.

═══════════════════════════════════════════════════════════════════════
═══  PHASE D — REBUILD-MAPPING SUB-AGENT DISPATCH                   ═══
═══════════════════════════════════════════════════════════════════════

Four specialist sub-agents in parallel. Each MAPS the rebuild territory — none writes code. Their reports become the foundation for Sessions 2+.

```
/superpowers:subagent-driven-development
```

## Sub-Agent 1 — Color Foundation Architect

**Brief:**
> Read primary sources 1-5 + color sources 6-8 + apcach README.
> 
> Map the current `--ts-bg-*` / `--ts-accent-*` / `--ts-fs-*` primitive layer in `assets/css/toolskin.css`. Extract the actual values used.
> 
> Design the REBUILT primitive layer at `assets/css/next/primitives/`:
>   - `assets/css/next/primitives/colors.css` — apcach-derived OKLCH primitives with verified APCA contrast at every step of the ramp
>   - `assets/css/next/primitives/typography.css` — apcach-isolated, the harmonic 1.125 ladder
>   - `assets/css/next/primitives/spacing.css` — 4px base × multiplier
>   - `assets/css/next/primitives/radius.css` — radius ramp
>   - `assets/css/next/primitives/motion.css` — duration + easing primitives
> 
> Build-time vs runtime decision: apcach generates static OKLCH values baked into `colors.css`, OR runs via toolskin.js for user-selected accents. Propose both, weigh trade-offs.
> 
> Output: spec document at `docs/handoffs/_rebuild-primitives-spec.md` describing:
>   - The proposed file structure for `assets/css/next/primitives/`
>   - The apcach generation script that would output `colors.css` (write it, but don't execute yet)
>   - Per-token-family migration: old toolskin.css source → new primitive file → APCA-verified value
>   - Build-time vs runtime recommendation
> 
> DO NOT write any CSS file. DO NOT execute apcach. Spec only.

## Sub-Agent 2 — System Layer Architect

**Brief:**
> Read primary sources 1-5 + system sources 9-11.
> 
> Map the current `--ts-this-bg-*` derivative chain + surface superposition pattern in `assets/css/toolskin.css`.
> 
> Design the REBUILT system layer at `assets/css/next/system/`:
>   - `assets/css/next/system/surface.css` — `--ts-this-bg-*` derivative chain consuming primitives
>   - `assets/css/next/system/text.css` — `--ts-this-color-*` derivative chain (auto-contrast via apcach)
>   - `assets/css/next/system/border.css` — `--ts-this-border-*` derivative chain
>   - `assets/css/next/system/superposition.css` — surface depth + alt-context awareness
> 
> Design the rebuild's CASCADE STRATEGY: instead of `:root [class*="ts-tree"]` substring scoped distribution (which traps BEM descendants), use explicit `:is(.ts-tree-explorer, .ts-tree)` enumeration or component-scoped definitions. Honor the cascade-sensitivity rule from tonight's discovery.
> 
> Output: spec at `docs/handoffs/_rebuild-system-spec.md`:
>   - The proposed file structure for `assets/css/next/system/`
>   - Cascade-distribution strategy (explicit enumeration vs scoped distribution alias)
>   - How `--ts-this-*` propagates to descendants via inheritance (not via universal-descendant explicit-sets)
>   - Per-token-family migration
> 
> DO NOT write any CSS file. Spec only.

## Sub-Agent 3 — Component Inventory + Block Prioritization

**Brief:**
> Read primary sources 1-5 + component sources 12-14.
> 
> Build the COMPLETE component registry from the reference `assets/css/toolskin.css` + showcase HTML. For EACH component:
>   - name (e.g., `ts-button`, `ts-input`, `ts-card`, `ts-chip`, `ts-tree`, `ts-topbar`)
>   - variants (e.g., `--primary`, `--ghost`, `--outline`)
>   - states (hover, active, focus, disabled, aria-selected, data-density, etc.)
>   - tokens consumed (which `--ts-this-*` does it read?)
>   - locked design contracts (@taxonomy_chips_strip locks the chips strip; brand block from tonight; footer kbd row from tonight)
>   - reference line range in toolskin.css
>   - estimated complexity for rebuild (Small / Medium / Large)
>   - dependencies on other components (e.g., ts-tree depends on ts-chip + ts-btn + ts-input)
> 
> PRIORITIZE the rebuild order. Dependencies first, leaves last. Propose the first 5 blocks for Session 2-6.
> 
> Pattern reference: the `ts-marquee` block is the canonical exemplar — zero manual structural markup, everything via data attributes, JS builds DOM, CSS styles via tokens. Every rebuilt component must follow this pattern.
> 
> Output: spec at `docs/handoffs/_rebuild-component-registry.md`:
>   - Full registry table
>   - Dependency graph
>   - Proposed Session 2-6 block sequencing
>   - For each of the first 5 blocks, a sketch `block-spec.md` (tokens consumed, states supported, parity criteria)
> 
> DO NOT write any CSS file. Spec + sequencing only.

## Sub-Agent 4 — Build Pipeline Architect

**Brief:**
> Read primary sources 1-5 + build sources 15-16.
> 
> Design the REBUILD'S BUILD PIPELINE:
>   - How does `assets/css/next/*.css` get composed into the final `toolskin-v2.css`?
>     - Option A: Single concatenated file via @import resolution at build time
>     - Option B: Multiple files loaded directly by HTML
>     - Option C: PostCSS or other tooling
>   - How does apcach get invoked? Manual `node tools/color-engine/generate.js`? npm script?
>   - How does the sandbox per-block test page render in isolation?
>     - Sandbox HTML imports `assets/css/next/primitives/*` + `assets/css/next/system/*` + just `sandbox/<NN>-<component>/block.css`
>     - Parity HTML side-by-side iframe: left loads `assets/css/toolskin.css` (reference), right loads new rebuild
>   - How does `assets/js/toolskin.js` interact with the rebuild? Is it part of Session 1 scope? (Default: no — JS is separate rebuild track.)
> 
> Output: spec at `docs/handoffs/_rebuild-build-pipeline-spec.md`:
>   - Build pipeline recommendation (A / B / C)
>   - apcach invocation method
>   - Sandbox HTML template for `_template/block.html` + `_template/parity.html`
>   - JS rebuild track scope (in or out of CSS rebuild sessions)
> 
> DO NOT write any code. Spec only.

## Step D.1 — Sub-agents run in parallel

Time-box each sub-agent at 20 min. Time-out → orchestrator surfaces.

## Step D.2 — Orchestrator ponderation

Receive all 4 specs. Cross-reference:
1. Does Sub-Agent 1's apcach output schema match Sub-Agent 2's consumption pattern?
2. Does Sub-Agent 3's block sequencing have the dependencies Sub-Agent 4's build pipeline expects?
3. Are there architectural conflicts to surface to the owner?

Output orchestrator synthesis at `docs/handoffs/_session-1-orchestrator-synthesis.md`:

```markdown
# Session 1 — Orchestrator Synthesis (Rebuild Mapping)

## Sub-agent specs delivered
- _rebuild-primitives-spec.md
- _rebuild-system-spec.md
- _rebuild-component-registry.md
- _rebuild-build-pipeline-spec.md

## Cross-references identified
[list]

## Conflicts surfaced (owner decides)
[list]

## Proposed Session 2-N sequencing

| Session | Block | Sub-agent providing primary input | Status |
|---|---|---|---|
| 2 | Primitives foundation (colors + typography + spacing + radius + motion) | SA1 | First rebuild block |
| 3 | System layer (surface + text + border + superposition) | SA2 | Depends on Session 2 |
| 4 | Block 01 — ts-button (leaf component) | SA3 | Depends on Session 3 |
| 5 | Block 02 — ts-input | SA3 | Depends on Session 3 |
| 6 | Block 03 — ts-card | SA3 | Depends on Sessions 3, 4 |
| 7+ | Subsequent blocks per registry dependency order | SA3 | ... |
| Last | Showcase HTML migration to load toolskin-v2.css | SA4 | After all blocks land |

## Open questions for owner
[list]
```

**OWNER GATE 4:** Owner reviews synthesis. Resolves conflicts. Approves the proposed session sequencing. This sets the trajectory for all future rebuild sessions.

═══════════════════════════════════════════════════════════════════════
═══  PHASE E — BUILD TOOLSKIN-ARCHITECTURE SKILL                    ═══
═══════════════════════════════════════════════════════════════════════

Wrap the rebuild approach into the auto-loading skill. Every future session loads it at startup.

```
/skill-create
```

Answers:
- Name: `toolskin-architecture`
- Description: Codebase-specific architectural rules + REBUILD methodology for the Toolskin design system. Auto-loads at any session touching `assets/css/toolskin.css` (REFERENCE, read-only), `assets/css/next/*` (rebuild target), `sandbox/*` (block sandboxes), or `tools/color-engine/`. Encodes the block-by-block sandbox rebuild approach, the three-tier token architecture, cascade rules, owner-protected blocks, editor prohibitions, and rebuild sequencing.
- Auto-trigger: any file path matching `**/toolskin*.css`, `**/toolskin*.js`, `**/assets/css/next/**`, `**/sandbox/**`, `**/tools/color-engine/**`, or working directory is the toolskin-showcase repo.
- Progressive disclosure: SKILL.md < 500 lines, references/ for heavy content.

**SKILL.md content (in order):**

1. **The rebuild framing (read first)**
   - REBUILD via sandbox, NOT refactor in place
   - `assets/css/toolskin.css` is REFERENCE ONLY (read constantly, modified never)
   - New code goes in `assets/css/next/` (production target)
   - Each block sandboxed in `sandbox/<NN>-<component>/`
   - Block lands in production CSS only after sandbox parity verification

2. **Critical rules**
   - Cascade-sensitivity (today's discovery)
   - @taxonomy_chips_strip locked contract (rebuild design input)
   - Cursor format-on-save disabled
   - Chrome DevTools live-edit disabled
   - Owner manual changes are authoritative
   - Halt on anomaly, never improvise

3. **Three-tier token architecture (rebuild target)**
   - Primitive: apcach-derived OKLCH with verified APCA contrast
   - System: `--ts-this-*` derivative chain
   - Component: scoped per-block overrides
   - Cascade strategy: explicit enumeration (`:is(...)`) preferred over substring distribution `[class*=...]`

4. **Block sandbox workflow**
   - `/superpowers:using-git-worktrees` for isolation
   - Copy `_template/` → new `<NN>-<component>/`
   - Sub-agent reads reference from `assets/css/toolskin.css`
   - Build at `<NN>-<component>/block.css` consuming rebuilt foundation
   - `/superpowers:test-driven-development` for verifiable behaviors
   - Visual parity via `parity.html`
   - `/design-system audit` (ECC) for 10-dimension scoring
   - Owner approves
   - Promote to `assets/css/next/components/<component>.css`
   - `/superpowers:finishing-a-development-branch` to merge

5. **File-editing rules**
   - Backup before any reference read (timestamp in `_bu/`)
   - Diff protocol: `git diff` HEAD-relative, `diff -uw` backup-relative
   - `@refactor-note:<topic>-<date>` for deferred items

6. **Rebuild sequencing** (from Phase D synthesis)
   - Sessions 2-N order
   - Dependencies between blocks
   - Locked design contracts to honor per block

7. **Refusal patterns**
   - No autonomous modification of `assets/css/toolskin.css`
   - No autonomous removal of foundational rules
   - No autonomous `!important` (rebuild bans `!important` from day 1)
   - No new unique classes when existing components fit
   - Halt on anomaly

**references/ subdirectory:**

- `taxonomy-chips-strip-contract.md` — 10 protected values + full docstring (rebuild design input for chips block)
- `restyling-architecture-full.md` — April core blueprint (the rebuild specification)
- `master-plan-full.md` — April phased roadmap
- `apcach-color-engine.md` — full apcach API + Toolskin integration (build-time vs runtime, per SA1 finding)
- `cascade-sensitivity-incident-2026-05-17.md` — BEM substring trap discovery
- `rebuild-primitives-spec.md` — copy of SA1 output
- `rebuild-system-spec.md` — copy of SA2 output
- `rebuild-component-registry.md` — copy of SA3 output
- `rebuild-build-pipeline-spec.md` — copy of SA4 output
- `orchestrator-synthesis-2026-05-XX.md` — copy of Phase D synthesis
- `session-state-2026-05-17.md` — tonight's reference state

## Validate + test auto-load

```
dir .claude\skills\toolskin-architecture\
type .claude\skills\toolskin-architecture\SKILL.md
```

Open new Claude Code conversation in same repo. Ask: "What is the rebuild approach for Toolskin?" Answer should come from the skill, not memory or web.

**OWNER GATE 5:** Owner reads SKILL.md in full + spot-checks references. Approves before commit.

═══════════════════════════════════════════════════════════════════════
═══  PHASE F — COMMIT SESSION 1 BASELINE                            ═══
═══════════════════════════════════════════════════════════════════════

Lock in everything from this session. ZERO `toolskin.css` changes — this is the rebuild establishment baseline.

## Stage

```
git add .claude/skills/toolskin-architecture/
git add tools/color-engine/package.json
git add tools/color-engine/package-lock.json
git add sandbox/
git add assets/css/next/
git add docs/handoffs/_session-1-rebuild-queue.md
git add docs/handoffs/_session-1-orchestrator-synthesis.md
git add docs/handoffs/_rebuild-primitives-spec.md
git add docs/handoffs/_rebuild-system-spec.md
git add docs/handoffs/_rebuild-component-registry.md
git add docs/handoffs/_rebuild-build-pipeline-spec.md
git add .gitignore
```

## Commit

```
git status
git diff --staged --stat
```

```
git commit -m "feat(rebuild): session 1 baseline — toolchain + apcach + sandbox scaffold + rebuild specs + toolskin-architecture skill

REBUILD APPROACH ESTABLISHED
Per April handoffs (restyling-architecture.md + master-plan.md) and 
tonight's clarification, Toolskin moves from in-place refactor to 
block-by-block REBUILD via sandbox isolation.

- assets/css/toolskin.css remains REFERENCE ONLY (untouched)
- assets/css/next/ holds the new production CSS (rebuilt blocks)
- sandbox/<NN>-<component>/ holds per-block isolated test pages
- Each block migrates to production only after sandbox parity verified

TOOLCHAIN INSTALLED
- Superpowers (worktree isolation, subagent dispatch, TDD)
- julianoczkowski/designer-skills (respects existing reference code)
- affaan-m/everything-claude-code design-system (10-dim audit per block)
- Anthropic skill-creator (built toolskin-architecture skill below)
- apcach at tools/color-engine/ (APCA-consistent OKLCH primitives)

ORCHESTRATOR DISPATCH (Phase D)
Four specialist sub-agents mapped the rebuild territory:
- SA1 Color Foundation — apcach integration + primitive layer spec
- SA2 System Layer — --ts-this-* derivative chain + cascade strategy
- SA3 Component Inventory — full registry + block prioritization
- SA4 Build Pipeline — sandbox-to-production composition

Orchestrator synthesis proposes session sequencing for Sessions 2-N.

TOOLSKIN-ARCHITECTURE SKILL
Auto-loads at every session in this repo. Encodes:
- The REBUILD framing (sandbox per block, not in-place refactor)
- Three-tier token architecture (apcach primitives → system → component)
- Cascade strategy (explicit :is() enumeration vs substring distribution)
- Block sandbox workflow (worktrees + TDD + parity HTML + 10-dim audit)
- @taxonomy_chips_strip locked design contract
- Editor prohibitions (Cursor format-on-save, DevTools live-edit)
- Refusal patterns (no toolskin.css modification, no !important, no overreach)

WHY THIS COMMIT MATTERS
3 months of in-place refactor attempts have produced disasters and 
regressions. The rebuild approach via sandbox isolation was always 
the April plan; tonight it becomes operational.

NOT IN THIS COMMIT
- Any assets/css/toolskin.css changes (reference, untouched)
- Any assets/css/next/*.css implementation (Sessions 2+)
- Any sandbox/<NN>-<component>/ implementation (Sessions 2+)
- Agent Council, GSD, other plugins (deferred or wrong fit)

NEXT SESSION
Session 2 begins the primitives foundation rebuild per 
docs/handoffs/_rebuild-primitives-spec.md. Open a fresh Claude Code 
session — the toolskin-architecture skill auto-loads, the rebuild 
approach is binding from turn 1.

Refs:
- docs/handoffs/_session-1-orchestrator-synthesis.md
- docs/handoffs/_rebuild-primitives-spec.md
- docs/handoffs/_rebuild-system-spec.md
- docs/handoffs/_rebuild-component-registry.md
- docs/handoffs/_rebuild-build-pipeline-spec.md
- docs/handoffs/design-system-audit/architecture/restyling-architecture.md
- docs/handoffs/design-system-audit/master-plan/master-plan.md"
```

## Verify

```
git log --oneline -3
git status
```

**OWNER GATE 6:** Owner confirms commit landed clean. Session 1 ends here. **DO NOT proceed to any rebuild work in this session — that's Session 2.**

═══════════════════════════════════════════════════════════════════════
EXECUTION SEQUENCE SUMMARY
═══════════════════════════════════════════════════════════════════════

| Phase | What | Gate | Time |
|---|---|---|---|
| A | Discover + read existing docs (incl. April rebuild spec) | 1 | ~20 min |
| B | Install 5 tools + create sandbox + next/ scaffold | 2 | ~30 min |
| C | Queue all source documents | 3 | ~15 min |
| D | Dispatch 4 specialist sub-agents to MAP the rebuild | 4 | ~60 min |
| E | Build toolskin-architecture skill (encodes rebuild approach) | 5 | ~45 min |
| F | Commit Session 1 baseline | 6 | ~10 min |

**Session 1 total: ~3 hours.** Establishment only. No rebuild work yet.

═══════════════════════════════════════════════════════════════════════
HARD CONSTRAINTS
═══════════════════════════════════════════════════════════════════════

- NEVER modify `assets/css/toolskin.css` (REFERENCE ONLY)
- NEVER write any CSS file in `assets/css/next/*` this session (Sessions 2+)
- NEVER write any block CSS in `sandbox/*` this session (Sessions 2+)
- NEVER push
- NEVER auto-format
- NEVER skip owner gates
- NEVER let a sub-agent autonomously merge findings into files
- NEVER touch pitchdeck/, ANALYZER.html, DRIVE_EXPLORER.html, or any deferred-untracked files
- NEVER touch `@taxonomy_chips_strip` block contents (it's locked DESIGN INPUT)
- HALT on any unexpected output

═══════════════════════════════════════════════════════════════════════
PONDERATION PRINCIPLE (binding the orchestrator throughout)
═══════════════════════════════════════════════════════════════════════

The orchestrator does NOT execute. It:
- Reads everything
- Queues all sources
- Dispatches specialist sub-agents
- Receives their specs (NOT code — specs only this session)
- PONDERATES across all 4 specs + the April architecture docs
- Surfaces findings to owner
- Waits for owner decisions
- Builds the toolskin-architecture skill from the synthesized output

Sub-agents propose specs. Orchestrator weighs. Owner decides. THEN, in Session 2+, sub-agents execute the approved specs block-by-block.

This pattern is the survival mechanism. It prevents the autonomous-execution disasters that have killed past attempts.

═══════════════════════════════════════════════════════════════════════
BEGIN PHASE A
═══════════════════════════════════════════════════════════════════════

Start by reading `CLAUDE.md` in the repo root, then proceed with Step A.1.
