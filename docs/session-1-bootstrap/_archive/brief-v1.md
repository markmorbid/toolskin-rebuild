# TOOLSKIN REFACTOR — SESSION 1 ORCHESTRATION BRIEF

**Session purpose:** Bootstrap the toolchain, load the existing project documentation, build the Toolskin-specific architecture skill from existing materials, then start Phase 0 of the refactor that has been planned since April but never executed cleanly.

**Working directory:** `D:\Mis Documentos\Projects\Toolskin Framework\toolskin-showcase`

**Foundational principle:** Nothing in this session is built from scratch. Every artifact already exists in the repo. This session orchestrates EXISTING materials into a working toolchain + executes the EXISTING plan.

**Estimated time:** 2-3 hours across the full sequence. 5 phases with explicit owner gates.

═══════════════════════════════════════════════════════════════════════
GLOBAL RULES (binding the entire session)
═══════════════════════════════════════════════════════════════════════

1. NEVER work from memory or assumptions about Toolskin architecture. Always read the actual docs in the repo.
2. NEVER auto-format any CSS file. Cursor auto-format-on-save has corrupted this codebase before — confirm it is disabled before any edit.
3. NEVER edit `assets/css/toolskin.css` in this session unless explicitly authorized in a Phase below. This session is mostly setup + reading + planning, with limited writes.
4. NEVER push to remote. Local commits only, owner pushes manually.
5. NEVER expand scope beyond the explicit Phase you are in.
6. When an owner gate is specified, STOP and surface findings — wait for explicit "proceed" before continuing.
7. If at any point a step produces unexpected output, HALT and write a halt report to `docs/handoffs/_session-halt-<phase>-<desc>.md` before any further action.
8. Cascade-sensitivity rule (BINDING): `:root [class*="ts-tree"]` is a SCOPED DISTRIBUTION LAYER, not a default-value declaration. Cascade is partially explicit. Never remove without (1) token propagation verification, (2) cascade + specificity validation, (3) safe rollback snapshot.
9. The `@taxonomy_chips_strip` design contract is locked — 10 owner-protected values inside `assets/css/toolskin.css` must not be modified.
10. Read `CLAUDE.md` in the repo first if you haven't already this session.

═══════════════════════════════════════════════════════════════════════
═══  PHASE A — DISCOVER EXISTING PROJECT DOCUMENTATION              ═══
═══════════════════════════════════════════════════════════════════════

The repo contains months of accumulated planning that has never been fully executed. Before any tool installation or refactor work, locate and read every piece of existing documentation. This is the source material the rest of the session orchestrates.

## Step A.1 — Inventory the docs/handoffs/ directory

```
dir docs\handoffs\
```

Report every file found. Pay special attention to:
- `_session-state-2026-05-17.md` (most recent session state, written hours ago)
- `_toolskin-general-refactor-roadmap.md` (5-phase refactor roadmap)
- Any file in `docs/handoffs/design-system-audit/` (the April handoff package)
- Any file containing `restyling-architecture`, `master-plan`, `nav-unification`, `annotations-guide`, `tree-sync-protocol`, or `popover-migration`

## Step A.2 — Read the key foundational documents

In order, read in full:

1. `CLAUDE.md` (repo root) — current project conventions
2. `docs/handoffs/_session-state-2026-05-17.md` — what state the working tree is in right now
3. `docs/handoffs/_toolskin-general-refactor-roadmap.md` — the 5-phase plan written tonight
4. `docs/handoffs/design-system-audit/README.md` — IF present, the April handoff entry point
5. `docs/handoffs/design-system-audit/architecture/restyling-architecture.md` — IF present, the core CSS architecture blueprint
6. `docs/handoffs/design-system-audit/master-plan/master-plan.md` — IF present, the phased delivery roadmap

If files 4-6 do NOT exist at those paths, search the entire `docs/` tree for files with similar names and report locations.

## Step A.3 — Report findings to owner

Output a structured inventory table:

```
| Document | Path | Lines | Last modified | Status |
|---|---|---|---|---|
| CLAUDE.md | repo root | ... | ... | foundational |
| _session-state-2026-05-17.md | docs/handoffs/ | ... | tonight | current state |
| restyling-architecture.md | ... | ... | ... | core blueprint |
| master-plan.md | ... | ... | ... | phased roadmap |
| (other relevant docs) | ... | ... | ... | ... |
```

**OWNER GATE 1:** Owner confirms the inventory matches their understanding of what exists. If a critical document is missing or in an unexpected location, owner directs the recovery before proceeding to Phase B.

═══════════════════════════════════════════════════════════════════════
═══  PHASE B — TOOL INSTALLATION                                    ═══
═══════════════════════════════════════════════════════════════════════

Install the four-layer toolkit. Each tool has been researched and confirmed appropriate for this project's needs. DO NOT substitute or skip any tool.

## Step B.1 — Verify pre-conditions

```
node --version
npm --version
npx --version
```

Report each. If any is missing, halt — owner installs missing prerequisites before continuing.

Verify Claude Code is the current execution environment (this brief targets Claude Code specifically, not Claude Desktop chat).

## Step B.2 — Install Superpowers plugin

```
/plugin install superpowers@claude-plugins-official
```

Verify by listing available slash commands. Confirm at minimum:
- `/superpowers:brainstorming`
- `/superpowers:writing-plans`
- `/superpowers:subagent-driven-development`
- `/superpowers:requesting-code-review`
- `/superpowers:verification-before-completion`
- `/superpowers:using-git-worktrees`

Report which Superpowers commands are available.

## Step B.3 — Install designer-skills

```
npx skills add julianoczkowski/designer-skills
```

The interactive CLI will ask which skills to install, which agents to target, and project vs global scope.

Choose:
- ALL 8 skills
- Target: Claude Code
- Scope: PROJECT (installs to `.claude/skills/` in this repo)

Verify the install by listing `.claude/skills/`. Confirm at minimum these slash commands exist:
- `/design-flow`
- `/grill-me`
- `/design-brief`
- `/information-architecture`
- `/design-tokens`
- `/brief-to-tasks`
- `/frontend-design`
- `/design-review`

## Step B.4 — Install everything-claude-code design-system skill

```
npx skills add affaan-m/everything-claude-code
```

Same interactive flow. Choose:
- The `design-system` skill specifically (at minimum)
- Any other ECC skills the owner approves (e.g., `accessibility`, `code-tour`)
- Target: Claude Code
- Scope: PROJECT

Verify the install. Confirm `/design-system` slash command (or equivalent) is available with three modes: generate, audit, slop-check.

## Step B.5 — Install Anthropic's skill-creator plugin

```
/plugin marketplace add anthropics/skills
/plugin install skill-creator@anthropic-skills
```

Verify `/skill-create` is available.

## Step B.6 — Confirm Cursor auto-format-on-save is disabled

This is a hard requirement, not optional. Cursor's auto-format-on-save has corrupted `toolskin.css` before. Before any edit in subsequent phases:

- Open Cursor's settings (or whatever editor is in use)
- Confirm "Format on Save" is OFF for CSS files
- Confirm Chrome DevTools live-edit is NOT writing back to disk
- Report which editor is being used and the format-on-save status

## Step B.7 — Report installation summary to owner

```
## Toolchain installation summary

### Superpowers
- Status: installed / failed
- Slash commands verified: [list]

### designer-skills (julianoczkowski)
- Status: installed / failed
- Skills installed: [list]
- Path: .claude/skills/

### ECC design-system (affaan-m)
- Status: installed / failed
- Skills installed: [list]

### skill-creator (Anthropic)
- Status: installed / failed
- /skill-create verified: yes / no

### Editor format-on-save
- Editor: [name]
- CSS format-on-save: DISABLED / ENABLED
```

**OWNER GATE 2:** Owner confirms toolchain is operational. If any install failed, owner directs recovery before proceeding to Phase C.

═══════════════════════════════════════════════════════════════════════
═══  PHASE C — BUILD THE TOOLSKIN-ARCHITECTURE SKILL                ═══
═══════════════════════════════════════════════════════════════════════

The generic skills installed in Phase B do not know Toolskin specifically. They don't know `--ts-this-bg`, the OKLCH derivative engine, the cascade-sensitivity rule, or the @taxonomy_chips_strip contract.

In this phase you will use `skill-creator` to wrap EXISTING Toolskin architecture documentation into a proper SKILL.md that auto-loads at every future session start.

## Step C.1 — Invoke skill-creator

```
/skill-create
```

The skill-creator will interview you about the new skill. Use these answers:

| Question | Answer |
|---|---|
| Skill name | `toolskin-architecture` |
| Description | Codebase-specific architectural rules for the Toolskin design system. Required reading for any session touching `assets/css/toolskin.css`, `assets/js/toolskin.js`, `tree-explorer.html`, `pitchdeck/`, or any component within the showcase. Encodes the token system, cascade-sensitivity rules, owner-protected blocks, editor prohibitions, and refactor priority order. |
| Auto-trigger conditions | Any session whose working directory is the toolskin-showcase repo, OR any file path matching `**/toolskin*.css`, `**/toolskin*.js`, `**/tree-explorer*`, `**/pitchdeck/**`. |
| Skill type | Architectural rules + reference |
| Progressive disclosure | Yes — keep SKILL.md under 500 lines, offload heavier content to `references/` subdirectory |

## Step C.2 — Source the content from existing project docs

The skill-creator will ask what content goes in SKILL.md vs reference files. Use these sources, in order of priority:

### SKILL.md (the brain — auto-loaded, must stay under 500 lines)

Include:

**1. Critical rules (read first — would have prevented past disasters):**
- `:root [class*="ts-tree"]` is a SCOPED DISTRIBUTION LAYER. NEVER remove. Cascade is partially explicit, not pure inheritance.
- `@taxonomy_chips_strip` design contract is LOCKED — 10 owner-protected values must not be modified. The full list lives in `references/taxonomy-chips-strip-contract.md`.
- Cursor auto-format-on-save MUST stay disabled for `toolskin.css`. Chrome DevTools live-edit MUST stay disabled.
- Owner manual changes between agent sessions are AUTHORITATIVE. Do not question or "fix" them.
- Halt on anomaly. Never improvise. When in doubt, surface to owner.

**2. Token architecture (three-tier):**
- Source: `docs/handoffs/design-system-audit/architecture/restyling-architecture.md` § Token Architecture
- Summary: Primitives → Computed (color-mix/calc) → Component
- Surface superposition + `--ts-this-bg-*` derivative chain
- OKLCH derivative engine + harmonic ladder

**3. Two-layer CSS architecture pattern:**
- Source: same doc § Two-Layer Architecture
- Layer 1: Global Scope (token resolution, no visual values)
- Layer 2: Local Scope (visual values, consumes layer 1 tokens)

**4. File-editing rules:**
- Backup `toolskin.css` to `_bu/<timestamp>/` before any edit
- Use diff protocol: `git diff` for HEAD-relative, `diff -uw` for backup-relative
- `@refactor-note:<topic>-<date>` comment pattern for deferred work

**5. Refactor priority order (Phase 0 of the master plan):**
- Source: `docs/handoffs/_toolskin-general-refactor-roadmap.md` (the 5-phase roadmap written tonight)
- Phase 1: `!important` audit + cascade fight resolution
- Phase 2: Substring-selector + scope-alias audit
- Phase 3: `.ts-section` component standardization
- Phase 4: Token scope cleanup
- Phase 5: ts-ui-select + actionbar responsiveness

**6. Refusal patterns (binding):**
- Refuse autonomous removal of foundational rules
- Refuse autonomous `!important` removal without root-cause diagnosis
- Refuse autonomous creation of new unique classes when existing components fit
- Refuse autonomous changes to global tokens or core component rules without owner approval

### references/ subdirectory (loaded on-demand)

Create these reference files inside `.claude/skills/toolskin-architecture/references/`:

- `taxonomy-chips-strip-contract.md` — the 10 protected values + full inline docstring from `assets/css/toolskin.css`
- `restyling-architecture-full.md` — full text of `docs/handoffs/design-system-audit/architecture/restyling-architecture.md` (or wherever it lives)
- `master-plan-full.md` — full text of the master plan
- `session-state-2026-05-17.md` — copy of tonight's session state for historical context
- `cascade-sensitivity-incident-2026-05-17.md` — short writeup of how the BEM substring trap was discovered tonight, including the exact selector chain and the fix path

## Step C.3 — Validate the generated skill

After skill-creator finishes, verify:

```
dir .claude\skills\toolskin-architecture
type .claude\skills\toolskin-architecture\SKILL.md
```

Check:
- SKILL.md has proper YAML frontmatter (`name`, `description`, trigger conditions)
- SKILL.md is under 500 lines
- All references/ files exist
- The skill is discoverable by Claude Code (try `/skills list` or equivalent)

## Step C.4 — Test the skill auto-loads

Open a new Claude Code conversation (in same repo). The skill should auto-load. Verify by asking: "What is the cascade-sensitivity rule for `:root [class*='ts-tree']`?" — the answer should come from the loaded skill content, NOT from web search or memory.

If the skill doesn't auto-load, troubleshoot SKILL.md frontmatter — likely the trigger conditions need adjustment.

## Step C.5 — Stage the skill for commit

```
git add .claude/skills/toolskin-architecture/
git status
```

DO NOT COMMIT YET. Owner reviews + commits manually at the end of Phase D.

**OWNER GATE 3:** Owner reads SKILL.md in full + spot-checks references/. Approves the skill before proceeding to Phase D. Owner can also direct adjustments to content at this point — they're easier to fix now than after commit.

═══════════════════════════════════════════════════════════════════════
═══  PHASE D — COMMIT THE TOOLCHAIN + SKILL                         ═══
═══════════════════════════════════════════════════════════════════════

Lock in the toolchain installation + new skill as a real commit before any refactor work begins.

## Step D.1 — Verify staged state

```
git status
git diff --staged --stat
```

Expected staged:
- `.claude/skills/toolskin-architecture/` (the new skill)
- `.claude/skills/design-system/` (from ECC)
- `.claude/skills/design-tokens/`, `design-flow/`, `design-review/`, etc. (from designer-skills)
- `.claude/plugins/` configuration updates if applicable

If the toolchain installs touched anything else (e.g., `CLAUDE.md` got updated with skill references), include those.

## Step D.2 — Commit

```
git commit -m "feat(toolchain): install Superpowers + designer-skills + ECC + skill-creator + toolskin-architecture skill

TOOLCHAIN INSTALLED
- Superpowers (claude-plugins-official) — phased execution discipline
- julianoczkowski/designer-skills — design-process workflow, respects existing code
- affaan-m/everything-claude-code design-system — 10-dimension visual audit
- Anthropic skill-creator — used to build the toolskin-architecture skill below

TOOLSKIN-ARCHITECTURE SKILL CREATED
Built via skill-creator. Auto-loads at every session in this repo.
Sources content from existing docs:
- docs/handoffs/design-system-audit/architecture/restyling-architecture.md
- docs/handoffs/_toolskin-general-refactor-roadmap.md
- docs/handoffs/_session-state-2026-05-17.md
- @taxonomy_chips_strip docstring in assets/css/toolskin.css

Encodes:
- Critical rules (cascade-sensitivity, owner-protected blocks, editor prohibitions)
- Three-tier token architecture (Primitive → System → Component)
- Two-layer CSS architecture pattern
- Surface superposition + --ts-this-bg derivative chain
- OKLCH derivative engine + harmonic ladder
- File-editing rules (backup, diff protocol, refactor-note pattern)
- 5-phase refactor priority order
- Refusal patterns for autonomous overreach

NEXT SESSION
Phase 0 of the refactor begins per the roadmap. With the
toolskin-architecture skill auto-loaded, agents now have the
codebase-specific guardrails that have been missing for 3 months.

NOT IN THIS COMMIT
- Any toolskin.css changes (refactor work begins next session)
- Agent Council (yogirk version) — defer until needed for novel
  architectural decisions
- GSD plugin — wrong fit for resuming existing work

Refs:
- docs/handoffs/_session-state-2026-05-17.md
- docs/handoffs/_toolskin-general-refactor-roadmap.md"
```

## Step D.3 — Verify commit landed

```
git log --oneline -3
git status
```

Expected: clean working tree, new commit at HEAD.

**OWNER GATE 4:** Owner confirms the commit landed clean. If owner is satisfied with this session ending here (toolchain installed, skill created, refactor next session), they can say "stop" and the session ends. If they want to continue into Phase E (Phase 0 of refactor), they say "proceed".

═══════════════════════════════════════════════════════════════════════
═══  PHASE E — KICKOFF PHASE 1 OF THE REFACTOR (OPTIONAL)           ═══
═══════════════════════════════════════════════════════════════════════

ONLY proceed to Phase E if owner explicitly says "proceed" at Gate 4. Otherwise end the session.

Phase 1 of the refactor (per `_toolskin-general-refactor-roadmap.md`) is the `!important` audit + cascade fight resolution. This is the right starting phase because:
- It targets a specific concrete technical debt
- Each removal requires diagnosis (matches the cascade-sensitivity discipline)
- It directly addresses tonight's "provisional topbar height block with !important" — which sits at line 33375-33384 of `toolskin.css`

## Step E.1 — Run Superpowers brainstorming

```
/superpowers:brainstorming
```

Goal: inventory every `!important` in `assets/css/toolskin.css`.

The brainstorming skill will help structure the inventory. Output as a table:

```
| Line | Selector | Property | !important | Suspected reason | Risk if removed |
|---|---|---|---|---|---|
| 33375 | (topbar height block) | height | yes | Lower-specificity .ts-nav-fixed .ts-btn winning cascade | medium |
| ... | ... | ... | ... | ... | ... |
```

Expected count: somewhere between 20 and 80 instances based on prior session context.

## Step E.2 — Categorize each instance

For each `!important`:

- **Category A — cascade fight winnable by specificity boost**: rule below in source order would naturally win if specificity were equal; just need to bump specificity on the desired winner
- **Category B — cascade fight caused by `<style>` tag injection**: inline styles or `<head>`-injected rules winning over external stylesheet; fix at source by migrating those rules properly
- **Category C — token-scope mismatch**: rule is using inlined calc or hardcoded value because the relevant token isn't in scope; fix by expanding token scope
- **Category D — genuinely needed defensive guard**: rare; document why and keep

Output the categorization to chat. **OWNER GATE 5:** Owner reviews the categorization and approves the per-category fix approach before any `!important` removal.

## Step E.3 — Sub-agent dispatch for fixes

```
/superpowers:subagent-driven-development
```

Use sub-agents to execute the fixes by category. One sub-agent per category, executing the agreed fix approach. Sub-agents report back; main agent synthesizes; owner reviews per-category diff before any application.

## Step E.4 — Visual audit after each category

```
/design-system audit --url http://localhost:<port> --pages /tree-explorer.html
```

Run the ECC visual audit after each category lands. Verify no regressions in the 10-dimension scoring.

## Step E.5 — Commit Phase 1

When all categories are clean + visually verified:

```
git add assets/css/toolskin.css
git commit -m "refactor(css): Phase 1 !important audit + cascade fight resolution per refactor roadmap"
```

End Phase 1. Session ends here regardless of owner energy — Phase 2 (substring-selector audit) is a separate focused session.

═══════════════════════════════════════════════════════════════════════
EXECUTION SEQUENCE SUMMARY
═══════════════════════════════════════════════════════════════════════

| Phase | What | Owner gate | Time |
|---|---|---|---|
| A | Discover existing project docs, read them, report inventory | Gate 1 | ~15 min |
| B | Install toolchain (Superpowers + designer-skills + ECC + skill-creator) | Gate 2 | ~20 min |
| C | Use skill-creator to wrap existing docs into toolskin-architecture skill | Gate 3 | ~45 min |
| D | Commit toolchain + skill | Gate 4 (continue/stop) | ~10 min |
| E (optional) | Start Phase 1 of the refactor: !important audit + fixes | Gate 5 | ~60 min |

Total if Phase E runs: ~2.5 hours
Total if session ends at Gate 4: ~90 min

═══════════════════════════════════════════════════════════════════════
HARD CONSTRAINTS (binding the entire session)
═══════════════════════════════════════════════════════════════════════

- NEVER push
- NEVER edit `assets/css/toolskin.css` outside Phase E (and only with owner approval per category)
- NEVER auto-format
- NEVER skip owner gates
- NEVER expand scope into Region 3/4/5 work from the prior rollback session
- NEVER touch pitchdeck/ files, ANALYZER.html, DRIVE_EXPLORER.html, or any deferred-untracked files from the prior session
- NEVER touch `@taxonomy_chips_strip` block contents
- NEVER override the cascade-sensitivity rule
- HALT on any unexpected output

═══════════════════════════════════════════════════════════════════════
BEGIN PHASE A
═══════════════════════════════════════════════════════════════════════

Start by reading `CLAUDE.md` in the repo root, then proceed with Step A.1.
