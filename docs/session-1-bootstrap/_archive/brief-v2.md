# TOOLSKIN REFACTOR — SESSION 1 ORCHESTRATION BRIEF v2

**Session purpose:** Bootstrap toolchain (including apcach as color-engine substrate), queue all existing project documentation, dispatch specialist sub-agents to ponderate each domain, commit the toolchain baseline, then optionally start Phase 1 of the refactor.

**Working directory:** `D:\Mis Documentos\Projects\Toolskin Framework\toolskin-showcase`

**Operating mode:** ORCHESTRATOR. The main agent installs the toolchain, reads + queues every existing document, dispatches specialized sub-agents per domain (color/cascade/tokens/architecture), pondersates each sub-agent's findings, and only THEN proposes work to the owner. Sub-agents propose; orchestrator weighs; owner decides. No write to `assets/css/toolskin.css` in this session.

**Foundational principle:** Nothing built from scratch. Every artifact already exists in the repo. The session orchestrates EXISTING materials into a working toolchain + ponderates the EXISTING plan + adds apcach as the missing color-derivation substrate.

**Estimated time:** 2.5–3.5 hours across 6 phases with 6 owner gates. Designed to **revive the project without killing it** — gentle paced execution, no autonomous overreach.

═══════════════════════════════════════════════════════════════════════
GLOBAL RULES (binding the entire session)
═══════════════════════════════════════════════════════════════════════

1. NEVER work from memory or assumptions about Toolskin architecture. Read actual docs.
2. NEVER auto-format any CSS file. Cursor auto-format-on-save MUST be disabled.
3. NEVER edit `assets/css/toolskin.css` in this session. Read-only.
4. NEVER push to remote.
5. NEVER expand scope beyond the current Phase.
6. At each owner gate: STOP and surface — wait for explicit "proceed".
7. On unexpected output: HALT and write `docs/handoffs/_session-halt-<phase>-<desc>.md`.
8. CASCADE-SENSITIVITY RULE (BINDING): `:root [class*="ts-tree"]` is a SCOPED DISTRIBUTION LAYER, never remove without (1) token propagation verification, (2) cascade + specificity validation, (3) safe rollback snapshot.
9. `@taxonomy_chips_strip` 10 owner-protected values are LOCKED.
10. Sub-agents PROPOSE, orchestrator PONDERATES, owner DECIDES. No autonomous merging of sub-agent outputs into files.

═══════════════════════════════════════════════════════════════════════
═══  PHASE A — DISCOVER + READ EXISTING PROJECT DOCUMENTATION       ═══
═══════════════════════════════════════════════════════════════════════

## Step A.1 — Inventory `docs/handoffs/`

```
dir docs\handoffs\
dir docs\handoffs\design-system-audit\ 2>nul
```

Report every file found. Pay special attention to:
- `_session-state-2026-05-17.md` (tonight's session state)
- `_toolskin-general-refactor-roadmap.md` (5-phase roadmap)
- `design-system-audit/architecture/restyling-architecture.md` (the core blueprint from April)
- `design-system-audit/master-plan/master-plan.md` (the phased delivery roadmap)
- Any `annotations-guide.md`, `nav-unification`, `tree-sync-protocol`, `popover-migration`

## Step A.2 — Read in full

In order, read in full (DO NOT summarize, hold in context):

1. `CLAUDE.md` (repo root)
2. `docs/handoffs/_session-state-2026-05-17.md`
3. `docs/handoffs/_toolskin-general-refactor-roadmap.md`
4. `docs/handoffs/design-system-audit/README.md` (if present)
5. `docs/handoffs/design-system-audit/architecture/restyling-architecture.md` (if present)
6. `docs/handoffs/design-system-audit/master-plan/master-plan.md` (if present)
7. The `@taxonomy_chips_strip` inline comment block inside `assets/css/toolskin.css` (find by grep, read in full — do not modify)

If any file from 4-6 is missing, search the entire `docs/` tree for similarly-named files.

## Step A.3 — Report inventory

```
| Document | Path | Lines | Status |
|---|---|---|---|
| CLAUDE.md | repo root | ... | foundational |
| _session-state-2026-05-17.md | docs/handoffs/ | ... | current state |
| _toolskin-general-refactor-roadmap.md | docs/handoffs/ | ... | 5-phase roadmap (written tonight) |
| restyling-architecture.md | ... | ... | April core blueprint |
| master-plan.md | ... | ... | April phased roadmap |
| @taxonomy_chips_strip docstring | toolskin.css line ~? | ... | locked design contract |
| (other) | ... | ... | ... |
```

**OWNER GATE 1:** Owner confirms inventory matches expectations. Approves before any installation.

═══════════════════════════════════════════════════════════════════════
═══  PHASE B — TOOLCHAIN INSTALLATION (5 TOOLS INCLUDING APCACH)    ═══
═══════════════════════════════════════════════════════════════════════

Install five tools. Each has a researched, specific purpose. Skipping any breaks the orchestrator pattern.

## Step B.1 — Verify prerequisites

```
node --version
npm --version
npx --version
git --version
```

Apcach requires Node. Confirm all four are present and report versions.

## Step B.2 — Install Superpowers

```
/plugin install superpowers@claude-plugins-official
```

Verify: `/superpowers:brainstorming`, `/superpowers:writing-plans`, `/superpowers:subagent-driven-development`, `/superpowers:requesting-code-review`, `/superpowers:verification-before-completion`.

Job: execution discipline + sub-agent orchestration.

## Step B.3 — Install designer-skills

```
npx skills add julianoczkowski/designer-skills
```

Choose: ALL 8 skills, Claude Code target, PROJECT scope.

Verify: `/design-flow`, `/grill-me`, `/design-brief`, `/information-architecture`, `/design-tokens`, `/brief-to-tasks`, `/frontend-design`, `/design-review`.

Job: design-process discipline + respects existing code.

## Step B.4 — Install ECC design-system

```
npx skills add affaan-m/everything-claude-code
```

Choose: `design-system` skill (minimum), Claude Code target, PROJECT scope.

Verify: `/design-system` (generate / audit / slop-check modes).

Job: 10-dimension visual audit + AI-slop detection.

## Step B.5 — Install Anthropic skill-creator

```
/plugin marketplace add anthropics/skills
/plugin install skill-creator@anthropic-skills
```

Verify: `/skill-create`.

Job: wrap existing project docs into auto-loading SKILL.md.

## Step B.6 — Install apcach (color-engine substrate) ⭐ NEW

Apcach is a JS color calculator that composes OKLCH colors with consistent APCA contrast ratio. It solves the lightness-fluctuation problem in the current Toolskin OKLCH derivative engine — the same accent hue at different L* values doesn't currently have predictable contrast, which is why surface superposition has been hand-tuned.

**Installation approach:**

Apcach is build-time tooling for Toolskin (Toolskin's runtime is pure CSS — apcach generates the canonical token values that get baked in).

Create a tools-only Node workspace at `tools/color-engine/`:

```
mkdir tools\color-engine 2>nul
cd tools\color-engine
npm init -y
npm install apcach
cd ..\..
```

Verify install:

```
type tools\color-engine\package.json
dir tools\color-engine\node_modules\apcach\
```

Add to repo `.gitignore` (if not already):

```
# Build-time color engine — apcach
tools/color-engine/node_modules/
```

Then commit `tools/color-engine/package.json` + `package-lock.json` later in Phase E (not now).

Job: canonical color derivation with verified APCA contrast for the `--ts-bg-*`, `--ts-accent`, `--ts-this-*` token families. Replaces the hand-tuned OKLCH lightness fluctuation workaround.

## Step B.7 — Confirm editor format-on-save disabled

This is a hard requirement, not optional.

- Cursor "Format on Save" for CSS: **DISABLED**
- Chrome DevTools workspace live-edit writing to disk: **DISABLED**
- Report which editor is in use + format-on-save status

## Step B.8 — Installation summary

```
| Tool | Status | Slash commands / API verified |
|---|---|---|
| Superpowers | installed/failed | [list] |
| designer-skills | installed/failed | [list] |
| ECC design-system | installed/failed | [list] |
| skill-creator | installed/failed | /skill-create |
| apcach | installed/failed | tools/color-engine/ initialized |
| Editor format-on-save | disabled/enabled | [editor name] |
```

**OWNER GATE 2:** Owner confirms toolchain operational. Approves before document queue.

═══════════════════════════════════════════════════════════════════════
═══  PHASE C — QUEUE ALL DOCUMENTS                                  ═══
═══════════════════════════════════════════════════════════════════════

The orchestrator queues every relevant source document into its working context BEFORE dispatching sub-agents. This is where "queue all the documents" lives. No sub-agent dispatches in this phase — just preparation.

## Step C.1 — Build the source document queue

Create `docs/handoffs/_session-1-orchestration-queue.md` listing every document the orchestrator + sub-agents will reference:

```markdown
# Session 1 — Document Queue

## Primary architecture sources (orchestrator + ALL sub-agents read these)

1. CLAUDE.md (repo root)
2. docs/handoffs/_session-state-2026-05-17.md
3. docs/handoffs/_toolskin-general-refactor-roadmap.md
4. docs/handoffs/design-system-audit/architecture/restyling-architecture.md
5. docs/handoffs/design-system-audit/master-plan/master-plan.md

## Domain-specific sources (orchestrator dispatches to specialist sub-agent)

### Color domain
6. @taxonomy_chips_strip docstring (assets/css/toolskin.css, search location)
7. apcach README (tools/color-engine/node_modules/apcach/README.md)
8. Current --ts-bg-* and --ts-accent-* token declarations in toolskin.css
9. Current OKLCH derivative chain rules in toolskin.css

### Cascade domain
10. :root [class*="ts-tree"] scope alias block (toolskin.css)
11. data-density="..." attribute variant rules
12. Lines 33375-33384 (provisional topbar height block with !important — flagged)

### Token-scope domain
13. --ts-this-bg system rules (assets/css/toolskin.css, search for occurrences)
14. --ts-this-bg-grad-dark-pct global knob
15. Surface superposition .ts-section--alt pattern (if present)

### Component domain
16. ts-ui-select component rules (broken per session-state)
17. .ts-tree-explorer__intro architectural anti-pattern (needs .ts-section refactor)
18. Topbar / actionbar unification rules

## State sources

19. git log --oneline -20 (commit history)
20. Working tree state from session-state file
21. _bu/rollback-2026-05-17/ artifacts
```

## Step C.2 — Validate queue completeness

For each numbered source, confirm:
- File exists at the listed path (or report it doesn't)
- Approximate line count or location
- Whether it's been modified recently (mtime)

Report any source that doesn't exist where expected.

## Step C.3 — Queue confirmation

Output the queue to chat. **OWNER GATE 3:** Owner confirms all sources are accounted for + adds any missing documents the orchestrator should know about. Approves before sub-agent dispatch.

═══════════════════════════════════════════════════════════════════════
═══  PHASE D — ORCHESTRATOR SUB-AGENT DISPATCH (PONDERATE)          ═══
═══════════════════════════════════════════════════════════════════════

Now the orchestrator dispatches 4 specialist sub-agents in parallel, each reading the queue's primary sources plus its domain-specific sources. Each sub-agent produces a structured report. The orchestrator ponders all four reports together and synthesizes findings for the owner.

This is the heart of the session — `/superpowers:subagent-driven-development` invocation. The orchestrator stays focused; sub-agents go deep.

## Step D.1 — Invoke subagent-driven-development

```
/superpowers:subagent-driven-development
```

Configure 4 specialist sub-agents:

### Sub-Agent 1 — Color Engine Analyst

**Brief:**
> Read primary sources 1-5 + color domain sources 6-9 + apcach README.
> Analyze: where does Toolskin's current OKLCH derivative chain produce inconsistent APCA contrast? Map the current --ts-bg-* and --ts-accent-* token derivations against what apcach would produce.
> Propose: a build-time integration pattern for apcach in tools/color-engine/. Should apcach generate the canonical primitive token values that get baked into toolskin.css? Or should it run at runtime via toolskin.js for user-selected accents?
> Output: report with (a) audit of current color contrast inconsistencies, (b) proposed apcach integration architecture, (c) which tokens would be apcach-derived vs hand-tuned, (d) estimated effort.
> Do NOT modify any file. Read-only analysis.

### Sub-Agent 2 — Cascade Architecture Analyst

**Brief:**
> Read primary sources 1-5 + cascade domain sources 10-12.
> Analyze: every substring selector ([class*=...]) in toolskin.css. Classify each as intentional scoped distribution layer or unintentional BEM-descendant trap (tonight's discovery).
> Analyze: every !important in toolskin.css. Categorize per the roadmap's Phase 1 plan (cascade fight winnable by specificity / style-tag injection / token-scope mismatch / genuinely needed).
> Propose: per-instance fix approach. Surface anything that conflicts with the cascade-sensitivity rule.
> Output: full audit table + categorization + per-fix recommendation.
> Do NOT modify any file. Read-only analysis.

### Sub-Agent 3 — Token Scope Analyst

**Brief:**
> Read primary sources 1-5 + token-scope domain sources 13-15.
> Analyze: where each --ts-this-* token is DECLARED vs CONSUMED. Identify scope mismatches that force inlined calcs or !important.
> Analyze: the surface superposition pattern (.ts-section--alt) per the April restyling-architecture.md.
> Propose: token-scope cleanup plan per Phase 4 of the roadmap. Identify which tokens should be apcach-derived (cross-reference Sub-Agent 1).
> Output: token scope audit + cleanup proposal + surface superposition implementation plan.
> Do NOT modify any file. Read-only analysis.

### Sub-Agent 4 — Component State Analyst

**Brief:**
> Read primary sources 1-5 + component domain sources 16-18.
> Analyze: current state of ts-ui-select (per session-state, broken borders/backgrounds). Identify exact rule conflicts.
> Analyze: .ts-tree-explorer__intro architectural anti-pattern. Map the existing showcase .ts-section pattern that should replace it.
> Analyze: topbar/actionbar unification state post-tonight's session (including provisional topbar height block at line 33375-33384).
> Propose: per-component refactor approach. Cross-reference Phase 3 + Phase 5 of the roadmap.
> Output: per-component audit + proposed refactor sequencing.
> Do NOT modify any file. Read-only analysis.

## Step D.2 — Sub-agents execute in parallel

Sub-agents run concurrently if Superpowers supports it; serially otherwise. Each produces its structured report.

Each sub-agent has a hard time-box: 20 minutes max. If a sub-agent hasn't completed its report in 20 minutes, the orchestrator surfaces and the owner decides whether to continue or simplify scope.

## Step D.3 — Orchestrator ponderation

The orchestrator (main agent) receives all 4 sub-agent reports. It then ponders:

1. **Cross-reference:** which sub-agents' proposals depend on each other? (e.g., Sub-Agent 1's apcach integration depends on Sub-Agent 3's token-scope cleanup proposal)
2. **Conflict surface:** where do sub-agents disagree or propose contradictory paths?
3. **Sequencing:** what is the optimal order of execution given the roadmap's 5 phases + the sub-agent findings?
4. **Risk assessment:** which proposals carry highest risk of regression? Which are safest starting points?
5. **Synthesis:** what does the orchestrator recommend as the order of operations for sessions 2-N?

Output the ponderation as `docs/handoffs/_session-1-orchestrator-synthesis.md`:

```markdown
# Session 1 — Orchestrator Synthesis

## Sub-agent reports (links)
- Color Engine: ...
- Cascade Architecture: ...
- Token Scope: ...
- Component State: ...

## Cross-references identified
[list]

## Conflicts surfaced
[list — orchestrator does NOT resolve, owner does]

## Proposed sequencing for sessions 2-N
| Session | Phase | Sub-agent providing primary input | Dependencies |
|---|---|---|---|
| 2 | Phase 1 — !important audit + cascade fight | Sub-Agent 2 | None |
| 3 | Phase 2 — substring-selector audit | Sub-Agent 2 | Session 2 |
| 4 | Phase 4 — token scope cleanup | Sub-Agent 3 | Session 3 |
| 5 | apcach color refactor (NEW PHASE) | Sub-Agent 1 | Session 4 |
| 6 | Phase 3 — .ts-section standardization | Sub-Agent 4 | Session 4 |
| 7 | Phase 5 — ts-ui-select + actionbar | Sub-Agent 4 | All previous |

## Risk assessment
[list]

## Open questions for owner
[list — explicit gates]
```

**OWNER GATE 4:** Owner reviews the synthesis. Approves the proposed session sequencing, resolves any surfaced conflicts, answers open questions. This is the most important gate of the session — it sets the trajectory for all subsequent work.

═══════════════════════════════════════════════════════════════════════
═══  PHASE E — BUILD TOOLSKIN-ARCHITECTURE SKILL (with apcach)      ═══
═══════════════════════════════════════════════════════════════════════

Now that the orchestrator has synthesized the architecture across all 4 domains, wrap it into the auto-loading skill.

## Step E.1 — Invoke skill-creator

```
/skill-create
```

Answers:
- Skill name: `toolskin-architecture`
- Description: Codebase-specific architectural rules for the Toolskin design system. Auto-loads at any session touching toolskin.css/js, tree-explorer.html, pitchdeck/, or showcase HTML. Encodes the three-tier token system (apcach-derived primitives, `--ts-this-*` system, component layer), cascade-sensitivity rules, owner-protected blocks (`@taxonomy_chips_strip`), editor prohibitions, refactor sequencing.
- Auto-trigger: any file path matching `**/toolskin*.css`, `**/toolskin*.js`, `**/tree-explorer*`, `**/pitchdeck/**`, or working directory containing `toolskin-showcase`.
- Progressive disclosure: SKILL.md < 500 lines, references/ for heavy content.

## Step E.2 — Content sources (built from this session's outputs)

**SKILL.md content (in order):**

1. **Critical rules** (read first, would have prevented past disasters)
2. **Token architecture (three-tier with apcach)**
   - Primitive layer: apcach-derived OKLCH values with verified APCA contrast (source: `tools/color-engine/` build output)
   - System layer: `--ts-this-*` derivative chain
   - Component layer: scoped overrides
3. **Two-layer CSS architecture pattern** (from restyling-architecture.md)
4. **Cascade rules**
   - `:root [class*="ts-tree"]` is a scoped distribution layer (cascade-sensitivity)
   - Substring selectors on BEM codebases trap descendants
   - Never remove foundational rules without verification
5. **`@taxonomy_chips_strip` 10 protected values** (source: inline docstring in toolskin.css)
6. **File-editing rules** (backup, diff protocol, no auto-format)
7. **Refactor sequencing** (from orchestrator synthesis in Phase D)
8. **Refusal patterns** (no autonomous overreach, halt on anomaly)

**references/ subdirectory (loaded on-demand):**

- `taxonomy-chips-strip-contract.md`
- `restyling-architecture-full.md` (copy of April doc)
- `master-plan-full.md` (copy of April doc)
- `apcach-color-engine.md` ⭐ — full apcach API reference + how Toolskin uses it (build-time vs runtime per Sub-Agent 1 finding)
- `cascade-sensitivity-incident-2026-05-17.md` (tonight's BEM substring trap discovery)
- `orchestrator-synthesis-2026-05-XX.md` (Phase D output, copied here)
- `session-state-2026-05-17.md` (tonight's session state, copied here)

## Step E.3 — Validate skill

```
dir .claude\skills\toolskin-architecture\
dir .claude\skills\toolskin-architecture\references\
type .claude\skills\toolskin-architecture\SKILL.md
```

Verify:
- YAML frontmatter correct (name, description, triggers)
- SKILL.md < 500 lines
- All references/ files present
- apcach reference doc exists

## Step E.4 — Test auto-load

Open new Claude Code conversation in same repo. Ask: "What is the cascade-sensitivity rule for `:root [class*='ts-tree']`?" The answer should come from the loaded skill, not from memory or web search.

If skill doesn't auto-load, troubleshoot frontmatter.

**OWNER GATE 5:** Owner reads SKILL.md in full + spot-checks references/. Approves before commit.

═══════════════════════════════════════════════════════════════════════
═══  PHASE F — COMMIT THE BASELINE                                  ═══
═══════════════════════════════════════════════════════════════════════

Lock in everything from this session as a real commit. NO toolskin.css changes — this is the toolchain + skill + synthesis baseline.

## Step F.1 — Stage

```
git add .claude/skills/toolskin-architecture/
git add tools/color-engine/package.json
git add tools/color-engine/package-lock.json
git add docs/handoffs/_session-1-orchestration-queue.md
git add docs/handoffs/_session-1-orchestrator-synthesis.md
git add .gitignore
```

If any other files were touched by toolchain installs (e.g., `.claude/plugins/` config, `CLAUDE.md` skill registry), include those.

## Step F.2 — Commit

```
git status
git diff --staged --stat
```

```
git commit -m "feat(orchestrator): session 1 baseline — toolchain + apcach + toolskin-architecture skill + synthesis

TOOLCHAIN INSTALLED
- Superpowers (claude-plugins-official)
- julianoczkowski/designer-skills (8 skills)
- affaan-m/everything-claude-code design-system
- Anthropic skill-creator
- apcach (build-time color engine) at tools/color-engine/

ORCHESTRATOR DISPATCH
Four specialist sub-agents analyzed Toolskin in parallel:
- Color Engine — apcach integration architecture
- Cascade Architecture — substring selectors + !important audit
- Token Scope — declaration vs consumption mismatches
- Component State — ts-ui-select, intro section, topbar/actionbar

Synthesis at docs/handoffs/_session-1-orchestrator-synthesis.md
proposes session sequencing for Phases 1-5 of the refactor roadmap
plus a new apcach color-engine phase.

TOOLSKIN-ARCHITECTURE SKILL
Auto-loads at every session in this repo. Encodes:
- Cascade-sensitivity rule (:root [class*='ts-tree'] scoped distribution)
- Three-tier token architecture with apcach-derived primitives
- @taxonomy_chips_strip locked contract
- Editor prohibitions (Cursor format-on-save, Chrome DevTools live-edit)
- Refactor sequencing per orchestrator synthesis
- Refusal patterns for autonomous overreach

WHY THIS MATTERS
For 3 months agents have operated without codebase-specific
architectural rules in context. Every session re-discovered (or
ignored) the same patterns. This commit ends that — every future
agent loads the rules at startup.

apcach (antiflasher, MIT, Evil Martians) provides consistent APCA
contrast via OKLCH composition — solves the lightness-fluctuation
problem in the current hand-tuned derivative chain.

NOT IN THIS COMMIT
- Any assets/css/toolskin.css modifications (subsequent sessions)
- Agent Council (defer until novel architectural decisions arise)
- GSD plugin (wrong fit for resuming existing work)
- Phase 1 refactor execution (gated to optional Phase G or session 2)

Refs:
- docs/handoffs/_session-1-orchestration-queue.md
- docs/handoffs/_session-1-orchestrator-synthesis.md
- docs/handoffs/_session-state-2026-05-17.md
- docs/handoffs/_toolskin-general-refactor-roadmap.md
- docs/handoffs/design-system-audit/architecture/restyling-architecture.md
- docs/handoffs/design-system-audit/master-plan/master-plan.md
- tools/color-engine/ (apcach build-time substrate)"
```

## Step F.3 — Verify

```
git log --oneline -3
git status
```

**OWNER GATE 6:** Owner confirms commit landed clean. If satisfied, session can end here. If owner has energy, they say "proceed to Phase G".

═══════════════════════════════════════════════════════════════════════
═══  PHASE G — OPTIONAL: BEGIN PHASE 1 REFACTOR                     ═══
═══════════════════════════════════════════════════════════════════════

ONLY if owner explicitly says "proceed" at Gate 6.

Per the orchestrator synthesis from Phase D, Sub-Agent 2 has already inventoried all `!important` instances + cascade fights. Phase 1 of the refactor roadmap is therefore READY to execute — no fresh discovery needed.

## Step G.1 — Re-read Sub-Agent 2 report

Load the cascade architecture analyst report from Phase D. Confirm the inventory table + per-instance categorization.

## Step G.2 — Per-category sub-agent dispatch

```
/superpowers:subagent-driven-development
```

One sub-agent per category (A: cascade fight, B: style-tag injection, C: token-scope, D: defensive). Each executes the agreed fix approach with surgical precision. Each produces a diff for owner review.

## Step G.3 — Owner reviews per-category diff

For each category, owner reviews diff before application. Sub-agents do NOT autonomously apply — they propose the diff, orchestrator weighs, owner approves.

## Step G.4 — Apply approved fixes

Surgical str_replace per approved category. After each category lands, run `/design-system audit` to verify no regressions.

## Step G.5 — Commit Phase 1

```
git add assets/css/toolskin.css
git commit -m "refactor(css): Phase 1 — !important audit + cascade fight resolution per roadmap"
```

End Phase 1. Session ends regardless of energy.

═══════════════════════════════════════════════════════════════════════
EXECUTION SEQUENCE SUMMARY
═══════════════════════════════════════════════════════════════════════

| Phase | What | Gate | Time |
|---|---|---|---|
| A | Discover + read existing docs | 1 | ~15 min |
| B | Install 5 tools incl apcach | 2 | ~25 min |
| C | Queue all source documents | 3 | ~15 min |
| D | Dispatch 4 sub-agents + ponderate | 4 | ~60 min |
| E | Build toolskin-architecture skill | 5 | ~45 min |
| F | Commit baseline | 6 | ~10 min |
| G (optional) | Phase 1 refactor execution | per-category | ~60 min |

Total ending at Gate 6: ~2.5 hours
Total ending at Phase G complete: ~3.5 hours

═══════════════════════════════════════════════════════════════════════
HARD CONSTRAINTS
═══════════════════════════════════════════════════════════════════════

- NEVER push
- NEVER edit `assets/css/toolskin.css` outside Phase G (and only with per-category owner approval)
- NEVER auto-format
- NEVER skip owner gates
- NEVER let a sub-agent autonomously merge findings into files
- NEVER expand scope into rollback Region 3/4/5 work (deferred to later sessions)
- NEVER touch pitchdeck/, ANALYZER.html, DRIVE_EXPLORER.html, or any deferred-untracked files
- NEVER touch `@taxonomy_chips_strip` block contents
- NEVER override the cascade-sensitivity rule
- HALT on any unexpected output

═══════════════════════════════════════════════════════════════════════
PONDERATION PRINCIPLE (binding the orchestrator throughout)
═══════════════════════════════════════════════════════════════════════

The orchestrator's job in this session is NOT to execute. It is to:
- Read everything
- Queue all sources
- Dispatch specialist sub-agents
- Receive their reports
- WEIGH them (ponderate) against each other and against the existing roadmap
- Surface findings to owner
- Wait for owner decisions

The orchestrator never autonomously merges sub-agent outputs into files. Sub-agents propose, orchestrator ponders, owner decides, then orchestrator instructs the appropriate sub-agent to apply the approved change.

This pattern is the survival mechanism for the project. It prevents the "agent off-script disaster" pattern that has burned this project for 3 months.

═══════════════════════════════════════════════════════════════════════
BEGIN PHASE A
═══════════════════════════════════════════════════════════════════════

Start by reading `CLAUDE.md` in repo root, then proceed with Step A.1.
