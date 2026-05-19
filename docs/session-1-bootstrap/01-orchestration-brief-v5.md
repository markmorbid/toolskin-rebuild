# TOOLSKIN SESSION 0+1 ORCHESTRATION BRIEF v5 — NEW REPO, OLD AS REFERENCE

**Session purpose:** Create a fresh repo at `D:\Mis Documentos\Projects\Toolskin Framework\toolskin-rebuild\`. Old repo at `D:\Mis Documentos\Projects\Toolskin Framework\toolskin-showcase\` becomes READ-ONLY REFERENCE forever — sub-agents study its entire content (CSS, JS, HTML, docs, handoffs) but never write to it. The new repo gets toolchain installed, sandbox structure scaffolded, sub-agents dispatched in two waves to pre-engineer the block typology + domain specs, toolskin-architecture skill built, then committed as the first commit on fresh git history.

═══════════════════════════════════════════════════════════════════════
REPO MODEL (CRITICAL — READ FIRST)
═══════════════════════════════════════════════════════════════════════

## Old repo (read-only reference forever)

**Path:** `D:\Mis Documentos\Projects\Toolskin Framework\toolskin-showcase\`

**Status post-Session 1:** Read-only reference. Sub-agents have UNRESTRICTED READ ACCESS to study every file — CSS, JS, HTML, docs, handoffs, branding, pitchdeck, everything. They use this to inform the rebuild plan.

**Never modified.** No edits, no commits. If catastrophe requires shipping the old Toolskin, that's a manual decision outside this rebuild workflow.

## New repo (where rebuild happens)

**Path:** `D:\Mis Documentos\Projects\Toolskin Framework\toolskin-rebuild\`

**Status:** Fresh `git init`. First commit IS the Session 1 baseline. No history imported from old repo. Clean room.

**All writes go here.** All sub-agent outputs land here. All future block sandboxes live here. All commits happen here.

## Cross-repo reads

Sub-agents access the old repo via relative path: `../toolskin-showcase/`

Examples of reads:
- `../toolskin-showcase/assets/css/toolskin.css` (reference CSS)
- `../toolskin-showcase/assets/js/toolskin.js` (reference JS)
- `../toolskin-showcase/index.html` (showcase reference)
- `../toolskin-showcase/docs/handoffs/design-system-audit/architecture/restyling-architecture.md` (THE SPEC)
- `../toolskin-showcase/docs/handoffs/design-system-audit/master-plan/master-plan.md` (April phased delivery)
- `../toolskin-showcase/docs/handoffs/_session-state-2026-05-17.md` (tonight's state)
- Any other file in the old repo for study purposes

═══════════════════════════════════════════════════════════════════════
CONVERSATION RULES (recovered + new — BINDING throughout)
═══════════════════════════════════════════════════════════════════════

## Rule 1 — Toolskin philosophy
> *"Zero framework dependencies. One stylesheet. Full dynamic control."*

## Rule 2 — Token-driven + derivative-math-driven, NOT class-driven like Tailwind
> *"Toolskin is token-driven and derivative-math-driven, not class-driven like Tailwind. Every component follows the `ts-marquee` pattern — zero manual structural markup, everything via data attributes with JS building DOM and CSS styling via tokens."*

## Rule 3 — The ts-marquee pattern is canonical for every component
One-liner setup. Data attributes. JS builds DOM. CSS styles via tokens. Zero manual structural markup.

## Rule 4 — Surface superposition awareness is core, not patch-work
> *"This kind of rules must be consciously planned and designed to be automatically applied like on the light or dark theme modes, but to be surface superposition aware too... so we get a solid design system that cannot fail on its core logic."*

## Rule 5 — The product differentiator
> *"This must be something that literally you give to anybody, AI or WordPress, and instantly adapts and merges to any convention because the tokens makes that possible by the solidness and how is built. If we make this properly, the CSS or JS + Sass or CSS will certainly convert any interface at will to any design type easily, with just design patterns and UI application — just knowing where to adapt to."*
>
> *"The element that makes this product something that actually people may use and don't trash and run to Vercel or Replit or Wix."*

## Rule 6 — Old toolskin.css is BLOCK PROTOTYPE — reference only
Visual and functional source-of-truth REFERENCE in the old repo. Read constantly, modified never. Design essence correct, code not production-grade.

## Rule 7 — Block-by-block sandbox with reusable HTML base context
> *"Module by module, new file to test-drive each one. Same HTML base context reusable. Everything that is not the CSS and assets type must be efficiently reusable."*

ONE `sandbox/_base.html` shared across every block.

## Rule 8 — Cascade-sensitivity rule (May 17 discovery)
`:root [class*="ts-tree"]` is a SCOPED DISTRIBUTION LAYER. Cascade is partially explicit. The rebuild uses explicit `:is(...)` enumeration where appropriate, designed during block-layer-type engineering.

## Rule 9 — @taxonomy_chips_strip 10 protected values are LOCKED design input
The chips strip docstring in the OLD repo's toolskin.css encodes 10 owner-locked values. The rebuilt chips block must reproduce these visually — they are the design contract.

## Rule 10 — Owner manual changes are AUTHORITATIVE
Between agent sessions, owner edits stand. Agents do not "fix" or revert without explicit direction.

## Rule 11 — Halt on anomaly, never improvise
Cost of stopping is minutes. Cost of improvising is months.

## Rule 12 — NEW REPO ONLY ⭐
After Session 1 lands, all rebuild work happens in `toolskin-rebuild/`. The old `toolskin-showcase/` is read-only reference. No edits, no commits, no PRs against the old repo. Sub-agents that propose writes to old repo paths get rejected at synthesis.

## Rule 13 — NO NODE.JS RUNTIME DEPS IN SHIPPED PRODUCT ⭐
Apcach lives in `tools/color-engine/` as build-time tooling. The shipped artifact is pure CSS + minimal JS. No webpack, no Vite, no PostCSS runtime, no npm scripts the end consumer needs to run. Eventual ship = one CSS file + one JS file + wrapping library, drop-in for any context.

## Rule 14 — Fresh git history ⭐
The new repo's first commit IS the Session 1 baseline. No imported history from old repo. Clean room.

═══════════════════════════════════════════════════════════════════════
OPERATING MODE
═══════════════════════════════════════════════════════════════════════

Two-stage execution:

**SESSION 0** — Toolchain dry-run (~10 min). Verifies installs work in the new repo location. Aborts cleanly if anything fails. No spec work. No commits unless dry-run completes clean.

**SESSION 1** — Full orchestration (~4 hours, 7 gates). Two sub-agent waves:
- **Wave 1:** Block layer type pre-engineering team (T1+T2+T3)
- **Wave 2:** Domain specialist dispatch (S1+S2+S3+S4+S5+S6)

Owner ponderates at every gate. Sub-agents propose, orchestrator weighs, owner decides.

═══════════════════════════════════════════════════════════════════════
GLOBAL RULES
═══════════════════════════════════════════════════════════════════════

1. NEVER modify any file in `D:\Mis Documentos\Projects\Toolskin Framework\toolskin-showcase\` (old repo, reference forever).
2. NEVER write any CSS file in `assets/css/next/*` this session. Specs only.
3. NEVER write any block CSS in `sandbox/*` this session. Specs only.
4. NEVER auto-format any CSS. Cursor format-on-save MUST be disabled.
5. NEVER push to remote.
6. NEVER expand scope beyond current Phase.
7. At each owner gate: STOP, surface findings, wait for explicit "proceed".
8. On unexpected output: HALT and write halt report to `docs/handoffs/_session-halt-<phase>.md`.
9. Sub-agents PROPOSE. Orchestrator WEIGHS. Owner DECIDES.
10. Honor all 14 CONVERSATION RULES.

═══════════════════════════════════════════════════════════════════════
═══  SESSION 0 — TOOLCHAIN DRY RUN (~10 min)                        ═══
═══════════════════════════════════════════════════════════════════════

Goal: verify installs work BEFORE owner commits 4 hours of Session 1 time. Aborts cleanly on any failure. Produces a verification log. No git commits in this session.

## Step 0.1 — Create new repo folder + cd

```
mkdir "D:\Mis Documentos\Projects\Toolskin Framework\toolskin-rebuild" 2>nul
cd "D:\Mis Documentos\Projects\Toolskin Framework\toolskin-rebuild"
```

Verify you are in the new folder:
```
cd
```

Should print `D:\Mis Documentos\Projects\Toolskin Framework\toolskin-rebuild`.

If wrong path, HALT — do not proceed.

## Step 0.2 — Verify old repo is reachable for read

```
dir "..\toolskin-showcase\assets\css\toolskin.css"
dir "..\toolskin-showcase\docs\handoffs\"
```

Both must succeed. If old repo not at expected path, HALT.

## Step 0.3 — Prerequisites

```
node --version
npm --version
npx --version
git --version
```

Report each version. Halt if any missing.

## Step 0.4 — Test each tool install (NON-PERMANENT)

These are throwaway installs to verify the tools resolve. If anything fails, owner knows BEFORE Session 1 starts.

```
:: Test Superpowers plugin install (do this in Claude Code, not bash)
/plugin marketplace add claude-plugins-official/superpowers
:: If this fails, abort
```

```
:: Test npx skills add resolution (dry-run mode if available, else lightest install)
npx skills add julianoczkowski/designer-skills --dry-run 2>nul || echo "no dry-run flag, will install in Session 1"
```

```
:: Test apcach availability
cd tools 2>nul || mkdir tools && cd tools
mkdir color-engine-test
cd color-engine-test
npm init -y >nul
npm install apcach --no-save
:: Verify
type node_modules\apcach\package.json
:: Cleanup test
cd ..
rmdir /s /q color-engine-test
cd ..
```

Report:
```
| Tool | Available | Notes |
|---|---|---|
| Superpowers plugin marketplace | yes/no | ... |
| npx skills | yes/no | ... |
| apcach (via npm) | yes/no | version X.Y.Z |
| anthropics/skills marketplace | yes/no | ... |
```

## Step 0.5 — Test fresh git init (NON-COMMITTING)

```
git init
git status
```

Verify clean state. If `git init` fails or shows pre-existing repo, HALT.

DO NOT COMMIT. Session 0 ends with the repo initialized but empty.

## Step 0.6 — Write verification log

Create `docs/_session-0-toolchain-verification.md`:

```markdown
# Session 0 Toolchain Verification — <timestamp>

## Repo location
- New: D:\Mis Documentos\Projects\Toolskin Framework\toolskin-rebuild (created)
- Old: D:\Mis Documentos\Projects\Toolskin Framework\toolskin-showcase (read access verified)

## Prerequisites
- node: <version>
- npm: <version>
- npx: <version>
- git: <version>

## Tool availability
- Superpowers plugin: <yes/no>
- npx skills (designer-skills, ECC): <yes/no>
- Anthropic skill-creator plugin: <yes/no>
- apcach: <yes/no>

## Git
- Fresh git init: <success/failure>
- Status: clean

## Verdict
- READY FOR SESSION 1: <yes/no>
- Blocking issues: <list or "none">
```

## Step 0.7 — Verdict gate

If verdict is READY → owner proceeds to Session 1.

If verdict is NOT READY → owner resolves blocking issues (install Node, fix path, etc.) and re-runs Session 0.

DO NOT proceed to Session 1 phases without a clean Session 0 log.

═══════════════════════════════════════════════════════════════════════
═══  SESSION 1 BEGINS                                               ═══
═══════════════════════════════════════════════════════════════════════

Working directory: `D:\Mis Documentos\Projects\Toolskin Framework\toolskin-rebuild`

═══════════════════════════════════════════════════════════════════════
═══  PHASE A — STUDY OLD REPO + CREATE NEW REPO STRUCTURE           ═══
═══════════════════════════════════════════════════════════════════════

## Step A.1 — Inventory the OLD repo's docs/handoffs/

```
dir "..\toolskin-showcase\docs\handoffs\"
dir "..\toolskin-showcase\docs\handoffs\design-system-audit\" 2>nul
```

Look for and report:
- `_session-state-2026-05-17.md` (tonight's state)
- `_toolskin-general-refactor-roadmap.md`
- `design-system-audit/README.md` (April rebuild bootstrap)
- `design-system-audit/architecture/restyling-architecture.md` (THE SPEC)
- `design-system-audit/master-plan/master-plan.md` (April phased delivery)
- Any `annotations-guide.md`, `nav-unification`, `tree-sync-protocol`, `popover-migration`

## Step A.2 — Read in full (from OLD repo, do not summarize, hold in context)

In order:
1. `..\toolskin-showcase\CLAUDE.md`
2. `..\toolskin-showcase\docs\handoffs\_session-state-2026-05-17.md`
3. `..\toolskin-showcase\docs\handoffs\design-system-audit\README.md` (IF present)
4. `..\toolskin-showcase\docs\handoffs\design-system-audit\architecture\restyling-architecture.md` (IF present — THE SPEC)
5. `..\toolskin-showcase\docs\handoffs\design-system-audit\master-plan\master-plan.md` (IF present)
6. `@taxonomy_chips_strip` inline docstring inside `..\toolskin-showcase\assets\css\toolskin.css` (find by grep — DO NOT modify the file)
7. `ts-marquee` component rules inside `..\toolskin-showcase\assets\css\toolskin.css` (canonical pattern exemplar)

## Step A.3 — Report inventory + framing

```
| Document | Path (relative to new repo) | Lines | Role in rebuild |
|---|---|---|---|
| restyling-architecture.md | ../toolskin-showcase/docs/handoffs/... | ... | THE REBUILD SPEC |
| master-plan.md | ... | ... | phased delivery |
| _session-state-2026-05-17.md | ... | ... | current reference state |
| @taxonomy_chips_strip docstring | ../toolskin-showcase/assets/css/toolskin.css line ~? | ... | locked design input |
| ts-marquee rules | ../toolskin-showcase/assets/css/toolskin.css line ~? | ... | canonical pattern |
```

Report: do the April docs provide enough spec to drive the rebuild? Yes/no with evidence.

## Step A.4 — Create the new repo directory structure

In the new repo (current working directory):

```
mkdir assets 2>nul
mkdir assets\css 2>nul
mkdir assets\css\next 2>nul
mkdir assets\css\next\primitives 2>nul
mkdir assets\css\next\system 2>nul
mkdir assets\css\next\components 2>nul
mkdir assets\css\next\utilities 2>nul
mkdir sandbox 2>nul
mkdir sandbox\_template 2>nul
mkdir sandbox\00-foundation 2>nul
mkdir tools 2>nul
mkdir docs 2>nul
mkdir docs\handoffs 2>nul
mkdir .claude 2>nul
mkdir .claude\skills 2>nul
```

Create `.gitignore`:

```
# Build-time tooling
tools/color-engine/node_modules/
tools/color-engine/package-lock.json

# OS
Thumbs.db
.DS_Store

# Editor
.vscode/
.idea/
```

Create `README.md` at repo root:

```markdown
# Toolskin Rebuild

Fresh-from-scratch rebuild of the Toolskin design system. Block-by-block, sandbox-isolated, token-driven, framework-agnostic.

## Status

In active rebuild. The previous Toolskin v1 lives at `../toolskin-showcase/` as read-only reference.

## Structure

- `assets/css/next/` — production CSS rebuild target
- `sandbox/` — per-block isolated test pages
- `tools/color-engine/` — apcach (build-time only)
- `docs/handoffs/` — all specs, synthesis, session state
- `.claude/skills/` — auto-loading architectural skill

## Read the skill first

Before any work in this repo, the toolskin-architecture skill auto-loads and encodes the rebuild approach, conversation rules, and refusal patterns. Read `.claude/skills/toolskin-architecture/SKILL.md`.

## Reference

The old repo at `../toolskin-showcase/` is the visual + functional reference. Read constantly, never modify.
```

Create `CLAUDE.md` at repo root:

```markdown
# Toolskin Rebuild — Project Conventions

## Identity
- Project: Toolskin Design System Rebuild
- Status: Block-by-block sandbox rebuild in progress
- Branch: main (single, no worktrees)
- Reference: ../toolskin-showcase/ (read-only, never modify)

## File-level freezes
- `../toolskin-showcase/**` — entire old repo is read-only reference
- This repo: free to write at `assets/css/next/`, `sandbox/`, `docs/`, `tools/`, `.claude/`

## Conversation rules
Read `.claude/skills/toolskin-architecture/references/conversation-rules-verbatim.md` for the 14 binding rules.

## Workflow per block
See `.claude/skills/toolskin-architecture/SKILL.md` for the locked block sandbox workflow.

## Owner
Satoshi / SatSea
```

Verify creation:
```
dir
dir assets\css\next
dir sandbox
dir docs\handoffs
```

**OWNER GATE 1:** Owner confirms new repo structure created + can see the listed contents. Approves before tool installation.

═══════════════════════════════════════════════════════════════════════
═══  PHASE B — TOOLCHAIN INSTALLATION (in new repo)                 ═══
═══════════════════════════════════════════════════════════════════════

## B.1 — Install Superpowers

```
/plugin install superpowers@claude-plugins-official
```

Verify slash commands available. Report list.

## B.2 — Install designer-skills (in new repo)

```
npx skills add julianoczkowski/designer-skills
```

Choose: ALL 8 skills, Claude Code, PROJECT scope (installs to `.claude/skills/` in this new repo).

## B.3 — Install ECC design-system

```
npx skills add affaan-m/everything-claude-code
```

Choose: `design-system` skill (minimum) + owner-approved extras.

## B.4 — Install Anthropic skill-creator

```
/plugin marketplace add anthropics/skills
/plugin install skill-creator@anthropic-skills
```

## B.5 — Install apcach (build-time only, Rule 13)

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

## B.6 — Editor format-on-save confirmation

- Cursor "Format on Save" for CSS: DISABLED
- Chrome DevTools workspace live-edit: DISABLED
- Report editor + status

## B.7 — Installation summary

```
| Tool | Status | Notes |
|---|---|---|
| Superpowers | installed/failed | [slash commands list] |
| designer-skills | installed/failed | [list] |
| ECC design-system | installed/failed | /design-system available |
| skill-creator | installed/failed | /skill-create available |
| apcach | installed/failed | tools/color-engine/ initialized |
| Editor format-on-save | disabled/enabled | [editor name] |
```

**OWNER GATE 2:** Owner confirms toolchain operational. Approves before queueing docs.

═══════════════════════════════════════════════════════════════════════
═══  PHASE C — QUEUE ALL DOCUMENTS (from old repo)                  ═══
═══════════════════════════════════════════════════════════════════════

Create `docs/handoffs/_session-1-rebuild-queue.md`:

```markdown
# Session 1 — Rebuild Document Queue

All paths relative to new repo (toolskin-rebuild/).

## CONVERSATION RULES (verbatim, binding for every sub-agent)

Copy the 14 conversation rules from this brief verbatim. Every sub-agent reads them BEFORE reading domain sources.

## Primary architecture sources (orchestrator + ALL sub-agents)

1. ../toolskin-showcase/CLAUDE.md
2. ../toolskin-showcase/docs/handoffs/_session-state-2026-05-17.md
3. ../toolskin-showcase/docs/handoffs/design-system-audit/README.md
4. ../toolskin-showcase/docs/handoffs/design-system-audit/architecture/restyling-architecture.md ⭐ (THE SPEC)
5. ../toolskin-showcase/docs/handoffs/design-system-audit/master-plan/master-plan.md

## Domain-specific sources

### Color foundation (Sub-Agent S1)
6. ../toolskin-showcase/assets/css/toolskin.css — extract --ts-bg-*, --ts-accent-*, --ts-fs-* primitive declarations
7. tools/color-engine/node_modules/apcach/README.md

### System layer (Sub-Agent S2)
8. ../toolskin-showcase/assets/css/toolskin.css — extract --ts-this-bg-* derivative chain rules
9. ../toolskin-showcase/assets/css/toolskin.css — surface superposition rules (.ts-section--alt if present)

### Component inventory (Sub-Agent S3)
10. ../toolskin-showcase/assets/css/toolskin.css — every component selector family
11. ../toolskin-showcase/assets/css/toolskin.css — @taxonomy_chips_strip docstring (locked design input)
12. ../toolskin-showcase/assets/css/toolskin.css — ts-marquee rules (canonical pattern exemplar)
13. ../toolskin-showcase/index.html — showcase reference
14. ../toolskin-showcase/toolskin-lab.html — UIKit lab reference

### Build pipeline + adaptive integration (Sub-Agents S4, T3)
15. ../toolskin-showcase/assets/js/toolskin.js — runtime behavior reference
16. ../toolskin-showcase/assets/js/toolskin-uikit.js — UIKit runtime
17. All HTML files in ../toolskin-showcase/ (index, tree-explorer, pitchdeck/*, branding/* if present)

## State sources

18. Output of: git -C ../toolskin-showcase log --oneline -20
19. ../toolskin-showcase/_bu/rollback-2026-05-17/ artifacts list
```

Validate every source exists. Report any missing.

**OWNER GATE 3:** Owner confirms queue. Approves before sub-agent dispatch.

═══════════════════════════════════════════════════════════════════════
═══  PHASE D — TEAM PRE-ENGINEERING + DOMAIN DISPATCH               ═══
═══════════════════════════════════════════════════════════════════════

## ═══ WAVE 1 — BLOCK LAYER TYPE ENGINEERING (3 sub-agents) ═══

```
/superpowers:subagent-driven-development
```

### Sub-Agent T1 — Block Typology Architect
Brief per v4. Output: `docs/handoffs/_rebuild-block-typology.md`.

### Sub-Agent T2 — Block Composition + Reusable HTML Base Designer
Brief per v4. The `sandbox/_base.html` template designs MUST read from `../toolskin-showcase/assets/css/toolskin.css` for the parity-rig reference iframe. Output: `docs/handoffs/_rebuild-base-context-spec.md`.

### Sub-Agent T3 — Adaptive Integration Architect
Brief per v4 — verifies drop-in compatibility per Rule 5. Output: `docs/handoffs/_rebuild-adaptive-integration-spec.md`.

### Wave 1 ponderation

Time-box 25 min each. Orchestrator pondersates outputs against each other. Output `docs/handoffs/_wave-1-synthesis.md`.

**OWNER GATE 4 (CRITICAL):** Owner reviews Wave 1 synthesis. Approves block typology + reusable base + adaptive contract. This locks the architectural trajectory.

## ═══ WAVE 2 — DOMAIN SPECIALIST DISPATCH (6 sub-agents) ═══

```
/superpowers:subagent-driven-development
```

### Sub-Agent S1 — Color Foundation Architect
Brief per v4 — apcach-derived primitives consuming Wave 1 typology. Output: `docs/handoffs/_rebuild-primitives-spec.md`.

### Sub-Agent S2 — System Layer Architect
Brief per v4 — `--ts-this-*` derivative chain + surface superposition. Output: `docs/handoffs/_rebuild-system-spec.md`.

### Sub-Agent S3 — Component Registry + Block Prioritization
Brief per v4 — every block classified by Wave 1 type with full spec contracts. Plus: first 5 blocks get sketch `block-spec.md` files for autonomous execution. Output: `docs/handoffs/_rebuild-component-registry.md`.

### Sub-Agent S4 — Build Pipeline Architect
Brief per v4 — composition pipeline + reusable base integration. Output: `docs/handoffs/_rebuild-build-pipeline-spec.md`.

### Sub-Agent S5 — Autonomous Execution Protocol Architect (tiered calibration)

**Brief:** Per v4, with tiered S5 calibration:

- **PERMISSIVE tier** — atomic blocks (button, input, chip, toggle, badge, icon, label, link, kbd, etc.). Auto-progress allowed if parity threshold met AND no rule violations. PR opens, owner reviews next morning.
- **STRICT tier** — molecular blocks (card, modal, accordion, tabs, menu, dropdown, popover, tooltip, drawer, etc.). Sub-agent completes block but HALTS for owner approval before commit. No auto-progress.
- **ALWAYS STRICT tier** — layout blocks (section, container, grid, columns, panel, sidebar, topbar, footer, hero, etc.). Owner must explicitly approve every step. No auto-progress under any circumstance.

The Wave 1 / T1 typology assigns each block to a tier. S5 protocol reads the tier and applies the gate. Output: `docs/handoffs/_rebuild-autonomous-protocol.md`.

### Sub-Agent S6 — Repo Governance + Refusal Patterns Author ⭐ NEW

**Brief:**
> Read CONVERSATION RULES (especially Rules 6, 12, 13, 14) + Wave 1 outputs + S1-S5 outputs.
> 
> Design the REPO GOVERNANCE layer:
> 
> 1. **Refusal patterns for the toolskin-architecture skill** — explicit refusal language the skill uses when an agent is asked to:
>    - Modify any file in `../toolskin-showcase/`
>    - Write code outside `assets/css/next/*`, `sandbox/*`, `docs/*`, `.claude/*`, `tools/*`
>    - Add Node.js runtime dependencies
>    - Introduce frameworks (React, Vue, Tailwind, etc.) into the shipped product
>    - Auto-format CSS
>    - Skip owner gates
>    - Make architectural decisions outside the locked Wave 1 typology
> 
> 2. **Pre-commit hook** at `.git/hooks/pre-commit` (script) — blocks:
>    - Any staged change to paths matching `../toolskin-showcase/**` (impossible from this repo, but defense)
>    - Any commit message lacking the rebuild session tag
>    - Any new file in disallowed paths
>    - Any new `!important` in any `assets/css/next/**/*.css`
> 
> 3. **CONTRIBUTING.md** at repo root — short, explicit, lists the 14 conversation rules + refusal patterns + how owner approval works
> 
> Output: `docs/handoffs/_rebuild-governance-spec.md` containing:
>    - Refusal patterns (exact language)
>    - Pre-commit hook script (full text, written but NOT yet installed)
>    - CONTRIBUTING.md content (full text, written but NOT yet committed)
> 
> DO NOT install the pre-commit hook. DO NOT write CONTRIBUTING.md to disk. Spec only — owner reviews at Gate 5.

### Wave 2 ponderation

Output `docs/handoffs/_session-1-orchestrator-synthesis.md` with:
- Cross-wave conflicts
- Session 2-N sequencing per tier (PERMISSIVE / STRICT / ALWAYS STRICT)
- S6 governance applied as commitment
- Open questions

**OWNER GATE 5:** Owner reviews Wave 2 synthesis. Resolves conflicts. Approves S5 tier assignments per block. Approves S6 governance (pre-commit hook + refusal patterns + CONTRIBUTING.md content).

═══════════════════════════════════════════════════════════════════════
═══  PHASE E — BUILD TOOLSKIN-ARCHITECTURE SKILL                    ═══
═══════════════════════════════════════════════════════════════════════

```
/skill-create
```

Answers:
- Name: `toolskin-architecture`
- Description: Codebase-specific architectural rules + REBUILD methodology for the Toolskin Rebuild project. Auto-loads at any session in `toolskin-rebuild/`. Encodes block-by-block sandbox rebuild approach, three-tier token architecture, conversation rules, repo governance, autonomous execution protocol tiers, refusal patterns.
- Auto-trigger: any session whose working directory contains `toolskin-rebuild/`, OR any file path matching `**/toolskin-rebuild/**`.
- Progressive disclosure: SKILL.md < 500 lines, references/ for heavy content.

**SKILL.md content (in order):**

1. **CONVERSATION RULES verbatim (14 rules)** — binding for every session
2. **Repo model** — new repo only, old repo read-only reference forever (Rules 6, 12, 14)
3. **The rebuild framing** — block-by-block sandbox, fresh git history
4. **Block typology** — from `_rebuild-block-typology.md` (T1)
5. **Reusable HTML base context** — from `_rebuild-base-context-spec.md` (T2)
6. **Adaptive integration contract** — from `_rebuild-adaptive-integration-spec.md` (T3)
7. **Three-tier token architecture** — primitives (apcach) → system (--ts-this-*) → component
8. **Surface superposition** — Rule 4
9. **Cascade strategy** — explicit `:is()` enumeration, not substring distribution
10. **Block sandbox workflow** — per-block execution flow from S5 protocol
11. **Autonomous execution tiers** — PERMISSIVE / STRICT / ALWAYS STRICT per block
12. **Repo governance** — refusal patterns + pre-commit hook + CONTRIBUTING from S6
13. **File-editing rules** — backup, diff protocol, no auto-format, no Node runtime
14. **Refusal patterns** — exact language for refusing forbidden requests

**references/ subdirectory (loaded on-demand):**

- `conversation-rules-verbatim.md` (14 rules)
- `taxonomy-chips-strip-contract.md` (extracted from old repo)
- `restyling-architecture-full.md` (full copy of April spec)
- `master-plan-full.md` (full copy of April roadmap)
- `apcach-color-engine.md` (full API + Toolskin integration plan)
- `cascade-sensitivity-incident-2026-05-17.md`
- `ts-marquee-canonical-pattern.md` (extracted reference rules)
- `session-state-2026-05-17.md` (tonight's state)
- All 9 sub-agent specs (`_rebuild-*.md` from Phase D)
- `_wave-1-synthesis.md`
- `_session-1-orchestrator-synthesis.md`

## Install S6 governance artifacts

After skill validated:

1. Write `.git/hooks/pre-commit` per S6 spec. Make executable on Unix; on Windows, ensure git can run it.
2. Write `CONTRIBUTING.md` at repo root per S6 spec.

## Validate skill auto-load

Open new Claude Code conversation at `toolskin-rebuild/`. Ask: "What is the rebuild approach for Toolskin?" Answer must come from the skill, not memory or web. If skill doesn't auto-load, troubleshoot frontmatter.

**OWNER GATE 6:** Owner reads SKILL.md in full + spot-checks references + reviews pre-commit hook + reviews CONTRIBUTING.md. Approves before first commit.

═══════════════════════════════════════════════════════════════════════
═══  PHASE F — FIRST COMMIT ON FRESH REPO                           ═══
═══════════════════════════════════════════════════════════════════════

## Stage

```
git add .
git status
```

Expected staged:
- README.md, CLAUDE.md, CONTRIBUTING.md, .gitignore
- .claude/skills/toolskin-architecture/ (full skill)
- .claude/skills/<all designer-skills>
- .claude/skills/<ECC design-system>
- tools/color-engine/package.json
- sandbox/_template/, sandbox/00-foundation/ (placeholder directories with .gitkeep if needed)
- assets/css/next/ (placeholder directories with .gitkeep)
- docs/handoffs/_session-1-rebuild-queue.md
- docs/handoffs/_session-1-orchestrator-synthesis.md
- docs/handoffs/_wave-1-synthesis.md
- docs/handoffs/_rebuild-*.md (9 spec docs)
- docs/_session-0-toolchain-verification.md
- .git/hooks/pre-commit (NOT staged — hooks live outside git tracking; document this)

Verify .git/hooks/pre-commit exists and is executable, but is NOT in the staged diff.

## Commit (FIRST COMMIT — fresh repo)

```
git diff --staged --stat
```

```
git commit -m "feat(rebuild): session 1 baseline — fresh repo, toolchain, block layer pre-engineering, autonomous protocol, governance, toolskin-architecture skill

REPO MODEL
Fresh git init. First commit IS this baseline. No imported history.

Old repo at ../toolskin-showcase/ is read-only reference forever.
This repo is the ONLY project for the Toolskin rebuild going forward.

REBUILD APPROACH (BLOCK LAYER TYPE PRE-ENGINEERED)
Two-wave orchestrator dispatch:

Wave 1 — Block Layer Type Engineering (team pre-mapping)
- T1 Block Typology Architect
- T2 Block Composition + Reusable HTML Base Designer
- T3 Adaptive Integration Architect

Wave 2 — Domain Specialist Dispatch (consumes Wave 1)
- S1 Color Foundation (apcach-derived primitives)
- S2 System Layer (--ts-this-* derivative chain + superposition)
- S3 Component Registry + Block Prioritization
- S4 Build Pipeline + Reusable Base Integration
- S5 Autonomous Execution Protocol (tiered: PERMISSIVE/STRICT/ALWAYS STRICT)
- S6 Repo Governance + Refusal Patterns

CONVERSATION RULES (14 verbatim in SKILL.md):
1. Zero framework dependencies, one stylesheet, full dynamic control
2. Token-driven + derivative-math-driven, NOT class-driven like Tailwind
3. ts-marquee pattern canonical for every component
4. Surface superposition awareness is core, not patch-work
5. The product differentiator — drop-in for AI/WordPress/anybody
6. Old toolskin.css = block prototype, reference only (in old repo)
7. Block-by-block sandbox with reusable HTML base context
8. Cascade-sensitivity rule (May 17 discovery)
9. @taxonomy_chips_strip 10 values locked as design input
10. Owner manual changes authoritative
11. Halt on anomaly, never improvise
12. NEW REPO ONLY (old repo never modified after Session 1)
13. NO NODE.JS RUNTIME DEPS in shipped product (apcach is build-time only)
14. Fresh git history (this is the first commit)

TOOLCHAIN INSTALLED
- Superpowers (worktrees, subagents, TDD)
- julianoczkowski/designer-skills (respects reference code)
- affaan-m/everything-claude-code design-system (10-dim audit)
- Anthropic skill-creator (built the architecture skill)
- apcach at tools/color-engine/ (APCA-consistent OKLCH, build-time only)

GOVERNANCE INSTALLED
- .git/hooks/pre-commit (blocks forbidden changes)
- CONTRIBUTING.md (14 rules + refusal patterns + owner gate workflow)
- toolskin-architecture skill refusal patterns

TOOLSKIN-ARCHITECTURE SKILL
Auto-loads every session in this repo. Encodes everything above.
Every future agent reads the rules from turn 1.

NEXT SESSION (SESSION 2)
Build primitives foundation per _rebuild-primitives-spec.md using apcach.
Semi-autonomous (owner reviews PR in morning).

SESSION 3
Build system layer per _rebuild-system-spec.md. Semi-autonomous.

SESSION 4+
Block-by-block per S5 tiered protocol.
Atomic blocks (button, input, chip): PERMISSIVE — agents auto-progress, owner reviews PRs in morning.
Molecular blocks (card, modal, accordion): STRICT — agents complete, halt for owner approval before commit.
Layout blocks (section, grid, panel): ALWAYS STRICT — owner approves every step.

Refs:
- docs/handoffs/_session-1-orchestrator-synthesis.md
- docs/handoffs/_wave-1-synthesis.md
- docs/handoffs/_rebuild-*-spec.md (9 spec docs)
- docs/_session-0-toolchain-verification.md
- ../toolskin-showcase/ (read-only reference)"
```

## Verify

```
git log --oneline
git status
```

Should show: one commit (this one), clean working tree.

**OWNER GATE 7 (FINAL):** Owner confirms commit landed. Session 1 ends. Sleep. Session 2 starts the primitives rebuild tomorrow.

═══════════════════════════════════════════════════════════════════════
EXECUTION SEQUENCE SUMMARY
═══════════════════════════════════════════════════════════════════════

| Session | Phase | What | Gate | Time |
|---|---|---|---|---|
| 0 | dry run | toolchain verification, abort on failure | verdict | ~10 min |
| 1 | A | study old repo + create new repo structure | 1 | ~30 min |
| 1 | B | install toolchain in new repo | 2 | ~25 min |
| 1 | C | queue all docs (read from old repo) | 3 | ~15 min |
| 1 | D Wave 1 | block layer type team pre-engineering | 4 ⭐ | ~60 min |
| 1 | D Wave 2 | domain specialist dispatch (6 sub-agents) | 5 | ~90 min |
| 1 | E | build toolskin-architecture skill + install S6 governance | 6 | ~45 min |
| 1 | F | first commit on fresh repo | 7 | ~10 min |

**Session 0 total: ~10 min.**
**Session 1 total: ~4.5 hours.**

After Session 1 commits, sleep. Session 2 starts the primitives rebuild.

═══════════════════════════════════════════════════════════════════════
HARD CONSTRAINTS
═══════════════════════════════════════════════════════════════════════

- NEVER modify any file in `../toolskin-showcase/`
- NEVER write any CSS file in `assets/css/next/*` this session
- NEVER write any block CSS in `sandbox/*` this session
- NEVER write `sandbox/_base.html` this session (T2 provides inline in spec; Session 2+ commits it)
- NEVER push
- NEVER auto-format
- NEVER skip owner gates
- NEVER let a sub-agent autonomously merge findings into files outside `docs/handoffs/_rebuild-*.md`
- NEVER violate any of the 14 CONVERSATION RULES
- NEVER touch `@taxonomy_chips_strip` block contents in old repo
- NEVER add Node.js runtime deps (apcach in tools/ is build-time only — Rule 13)
- HALT on any unexpected output, write halt report

═══════════════════════════════════════════════════════════════════════
PONDERATION PRINCIPLE
═══════════════════════════════════════════════════════════════════════

Orchestrator does NOT execute code. It:
- Reads everything (including 14 CONVERSATION RULES)
- Queues all sources from old repo
- Dispatches Wave 1 team sub-agents (block layer type pre-engineering)
- Pondersates Wave 1 outputs
- Dispatches Wave 2 domain sub-agents (consuming Wave 1)
- Pondersates Wave 2 outputs
- Surfaces findings to owner
- Builds the toolskin-architecture skill
- Installs S6 governance artifacts
- Commits the baseline (first commit on fresh repo)

Sub-agents propose specs. Orchestrator weighs across waves. Owner decides at gates. THEN, Sessions 2+, sub-agents execute per locked specs — tiered autonomy per S5 protocol.

═══════════════════════════════════════════════════════════════════════
THE PROMISE OF THIS SESSION
═══════════════════════════════════════════════════════════════════════

When this session commits:

- Fresh repo at `toolskin-rebuild/` with clean git history
- Old repo at `toolskin-showcase/` permanently frozen as reference
- Toolchain installed: Superpowers + designer-skills + ECC + skill-creator + apcach
- Block typology locked (Wave 1 / T1)
- Reusable HTML base context locked (Wave 1 / T2)
- Adaptive integration contract locked (Wave 1 / T3) — drop-in for WordPress/AI/Vue/React/static HTML
- Spec contracts per block (Wave 2 / S3)
- Tiered autonomous execution protocol (Wave 2 / S5)
- Repo governance with refusal patterns + pre-commit hook (Wave 2 / S6)
- toolskin-architecture skill auto-loads at every future session
- 14 conversation rules encoded and binding

Sessions 2-3 land the primitives + system foundation (semi-autonomous, owner reviews PRs).

Sessions 4+ go autonomous per tier. Atomic blocks ship while you sleep. Molecular blocks halt for your approval. Layout blocks require you at every step.

The rebuild becomes mechanical execution against locked specs, not architectural improvisation.

═══════════════════════════════════════════════════════════════════════
BEGIN SESSION 0 — TOOLCHAIN DRY RUN
═══════════════════════════════════════════════════════════════════════

Start with Step 0.1 — create the new repo folder.
