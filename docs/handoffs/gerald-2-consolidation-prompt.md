# Gerald 2.0 — Full Consolidation Brief
**Source:** Meta-orchestration chat (Gerald 1.0, 100-message limit reached)
**Purpose:** Process this entire brief before responding to anything.
**Your job:** Read it, verify files where indicated, then craft the
correct response to Code Desktop for the next phase.

---

## SECTION 1 — WHAT THE OWNER NEEDS (non-negotiable)

Satoshi builds Toolskin — a token-driven, framework-independent CSS/HTML/JS
design system for WordPress themes and web apps. The rebuild goal is to make
it commercially sellable by fixing its architecture so any AI or developer
can implement it correctly without Satoshi's intervention.

**What Satoshi requires from every session:**
1. Something VISIBLE he can open in Chrome. Not reports, not CSS files alone.
2. Council runs at every major gate — real isolated voices, not simulated.
3. Multiple agents working, not one agent deciding alone.
4. Engineering from the OLD codebase (running toolskin-showcase) as ground
   truth — not from specs alone.
5. Sandbox HTML alongside every CSS deliverable. Never CSS-only commits.
6. Decision format: one recommendation, one sentence why, YES/NO only.
   Never option tables. Never technical proposals for owner to evaluate.

**What you (Gerald 2.0) must do before every response:**
- Read any file mentioned before referencing it. Memory is not enough.
- If you cannot read it: state "could not access [file]" and flag all
  claims from it as UNVERIFIED.
- Never move forward with less context than the task requires.

---

## SECTION 2 — CURRENT PROJECT STATE (verified)

**Repo:** toolskin-rebuild on master
**Reference:** toolskin-showcase (READ-ONLY FOREVER — Rule 12)
**Last known commits (verify with agent):**
- `704d702` — meta-orchestration handoff index committed
- `f44a651` — extracted blocks catalog (2,882 lines)
- `d83e264` — RULING 7 + Pattern-16 Option B encoded in memory files
- Council output file: `docs/handoffs/_extracted-blocks-catalog-council.md`

**Session 3 state:**
- surfaces.css written and functional (architectural fix confirmed:
  inputs at :root, derivatives in :where(:root,:root *))
- surfaces.html sandbox working at localhost
- HALTED at council gate for Session 3.x planning

**Owner picks already confirmed (encode these if not already in memory):**
- PICK 1 YES — Session 3.x before Session 4
- PICK 2 YES — re-anchor first, consume second (two-line idiom order)
- PICK 3 YES — adopt Pattern 2 with engineering fix (carry knob, drop literal)
- PICK 4 YES — pre-emptive derivative extension in Session 3.x

---

## SECTION 3 — BINDING RULINGS (all active)

Verify these are in `.remember/core-memories.md` before proceeding:

- RULING 1: Surfaces = presets (TOOLSKIN_SURFACE_PRESETS). Not apcach-derived.
- RULING 2: colors.css bakes one default preset + all 10 as .ts-preset-* classes.
- RULING 3: --ts-fs-base: 13px (NOT 15px, NOT 16px). Swept across all docs.
- RULING 4: --ts-on-accent threshold = 0.75.
- RULING 5: Spacing stops at --ts-sp-16. sp-17..24 dropped.
- RULING 6: No second CSS audit pass needed.
- RULING 7: apcach is the constant engine for the ENTIRE system layer.
  Every mixing constant, percentage, threshold, and lightness delta must
  be apcach-derived outputs baked by generate-colors.js at build time.
  Hand-tuned literals are Rule-15 violations regardless of appearance.
  CSS composes — apcach decides the amounts.
  Pattern-16 resolution: dual-metric engine (Option B) — APCA governs
  Lc≥12 constants; sub-Lc-10 surface depth governed by OKLCH ΔL via
  culori, baked deterministically.

---

## SECTION 4 — SESSION 3.x SCOPE (confirmed, execute next)

Read `assets/css/next/system/surfaces.css` before starting.
Read `docs/handoffs/_extracted-blocks-catalog.md` sections on
nesting, text, and accent before starting.

**Three deliverables in order, each with atomic pairing:**

### DELIVERABLE 1: system/nesting.css
- @property --ts-nest-radius (syntax: <length>, inherits: true)
- @property --ts-nest-pad (syntax: <length>, inherits: true)
- :root { --ts-radius-nest-reduction; --ts-pd-nest-reduction } (engine-derived)
- Depth-2 and depth-3 explicit selector cartel
- CRITICAL: Preserve owner's failed-self-reference explainer VERBATIM from
  ts-panel+root-debugger-component.css L25-46 (the @property own-element
  cycle explanation). This is load-bearing wisdom. Do not paraphrase.
- initial-value literals must derive from rebuild radius/spacing primitives,
  NOT carry forward the old repo's 9.2px / 24px literals (RULING 7)
- Sandbox: sandbox/01-system/nesting.html showing nested cards at
  3 depth levels, radius telescoping live, --ts-radius-nest-reduction slider

### DELIVERABLE 2: system/text.css + system/accent.css
Must include (apcach-governed, engine-derived):
- --ts-text-primary-dim-2 (text derivative, needed by inputs Pattern 1)
- --ts-text-accent (needed by Pattern 2 iconlist)
- --ts-accent-bright, --ts-accent-dim (multi-step), --ts-accent-border
- --ts-accent-glow-bg-2
- --ts-on-surface (runtime oklch(from var(--ts-this-bg) ...) — RULING Z
  exception, parallel to --ts-on-accent)
- --ts-on-surface-dim, --ts-on-surface-muted (strength ladder)
- Sandbox: sandbox/01-system/text-accent.html showing text on all 6
  surface depths, on-surface auto-contrast working, accent derivatives
  rendered as swatches

### DELIVERABLE 3: surfaces.css extended
Add to existing surfaces.css:
- --ts-this-bg-dim-5, --ts-this-bg-dim-6
- --ts-this-bg-grad-2, --ts-this-bg-grad-3, --ts-this-bg-grad-4
- RULING 7 constants re-grounded: Agent A ΔL measurement must complete
  (was pending — verify if done, if not do it now as first sub-step)
- Update sandbox/01-system/surfaces.html to show the new tokens

**Gate after each deliverable:**
- Playwright captures of the sandbox
- toolskin-visual-audit skill runs (token-leak grep + computed style probes)
- impeccable audit + impeccable polish run on the sandbox HTML
- Council gate (real isolated agents, NOT Gerald 2.0 simulating voices)
- Owner sees screenshots + council verdict
- Only then: commit

---

## SECTION 5 — SKILLS TO INSTALL (pre-audited, act on these)

The following have been audited by Gerald 1.0 against the project.
Install these in the rebuild repo before Session 3.x begins:

### INSTALL NOW (Code Desktop):
```bash
# Impeccable quality pack (8 skills — all security audits verified PASS)
npx skills add https://github.com/pbakaus/impeccable --skill audit
npx skills add https://github.com/pbakaus/impeccable --skill polish
npx skills add https://github.com/pbakaus/impeccable --skill animate
npx skills add https://github.com/pbakaus/impeccable --skill adapt
npx skills add https://github.com/pbakaus/impeccable --skill harden
npx skills add https://github.com/pbakaus/impeccable --skill colorize
npx skills add https://github.com/pbakaus/impeccable --skill arrange
npx skills add https://github.com/pbakaus/impeccable --skill extract

# Accessibility (WCAG 2.1 — verified on skills.sh)
npx skills add supercent-io/skills-template --skill web-accessibility
```

### ENABLE (settings.json or environment):
```bash
# Native Agent Teams — replaces manual council dispatch with real
# isolated-context parallel agents that communicate directly
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```
Or add to .claude/settings.json:
```json
{ "env": { "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1" } }
```

### DO NOT INSTALL (audited and rejected):
- vercel-labs/agent-skills@web-design-guidelines — Vercel design language
  conflicts with Toolskin identity, would produce constant false positives
- mblode/agent-skills@ui-animation — covered better by impeccable animate;
  mblode skill is Framer Motion / GSAP focused (Rule 1 violation — no frameworks)

### REQUIRED SETUP after installing impeccable:
Create `.impeccable.md` in repo root with Toolskin intentional patterns:
```markdown
# Toolskin intentional design decisions — do not flag as violations

- Base font: 13px (intentional tool-system density — RULING 3)
- Nested cards with telescoping radius: intentional (nest-reduction system)
- No media queries: intentional (intrinsic responsive via auto-fit grids)
- OKLCH color values: intentional (apcach-derived, dual-emitted with sRGB fallback)
- Space Grotesk 300-700 only: no 800 weight exists in this font
- Dark-first: light mode is a theme variant, not the primary theme
- 13px base font: not a readability issue — design system tool density
- Surface superposition (one rule, multiple nested contexts): intentional
- color-mix() for surface derivatives: intentional (CSS-native, no runtime JS)
```

---

## SECTION 6 — COUNCIL UPGRADE (how it works now)

From this session forward, council uses Agent Teams natively.

**Old approach (broken):** Gerald 2.0 simulated 4 voices inline. One model,
four hats. No context isolation. Not real council.

**Correct approach with Agent Teams enabled:**
When Code Desktop needs a council run, it spawns 4 teammates via Agent Teams:
```
Enable CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1

Spawn council team with 4 teammates:
- Design Skeptic: reads _rebuild-design-dna.md FIRST, then evaluates
  screenshots and computed style probes. Asks: "Does this look like Toolskin?"
- Design Critic: audits Rule 5 identity preservation. Asks: "Would a
  Toolskin user recognize this?"
- Architect: verifies token architecture — no layer violations, no hardcoded
  values, correct derivation, RULING 7 compliance
- Pragmatist: checks consumer scenario viability — can a developer
  actually use this?

Each teammate loads independently:
  .claude/skills/toolskin-architecture/SKILL.md
  .claude/skills/toolskin-visual-audit/SKILL.md
  .claude/skills/design-tokens-2.0/SKILL.md

Council input package per run:
1. Playwright screenshots of the sandbox
2. Computed style probe output for key tokens
3. The equivalent Wave 1.6 screenshot for comparison
4. The specific question to deliberate

Council output: GO / NO-GO verdict + specific issues if NO-GO
Raw output sent to Gerald 2.0. No summarization by Code Desktop.
```

Gerald 2.0 reads the raw council output and issues GO or NO-GO to Code Desktop.

---

## SECTION 7 — IMPECCABLE WORKFLOW INTEGRATION

After skills are installed, every Session 4+ block sandbox goes through
this quality gate sequence before council:

```
After building CSS + sandbox HTML:
1. npx skills run toolskin-visual-audit  (token-leak grep + probes)
2. /impeccable audit                     (P0-P3 severity, accessibility)
3. /impeccable polish                    (alignment, spacing, micro-detail)
4. Agent Teams council                   (design identity + architecture)
5. Owner sees screenshots + verdict
6. COMMIT only after owner GO
```

For motion-bearing components (toasts, modals, transitions):
- Add `/impeccable animate` before council

For components with form elements (inputs, selects, checkboxes):
- Add `npx skills run web-accessibility` before council

---

## SECTION 8 — WHAT AGENT TEAMS REPLACES IN YOUR CURRENT WORKFLOW

| Before | After (Agent Teams) |
|--------|---------------------|
| Gerald 2.0 simulates 4 council voices | 4 real isolated Claude sessions as teammates |
| Sub-agents report back to main agent only | Teammates message each other directly |
| Manual anti-anchoring via separate prompts | Native context isolation per teammate |
| Gerald 2.0 writes council dispatch prompt | Code Desktop spawns team via one prompt |
| Council output is one model's perspective | Council output is 4 genuinely independent analyses |

The council quality gate becomes REAL council, not simulation.

---

## SECTION 9 — IMMEDIATE MANDATORY ACTIONS FOR CODE DESKTOP

This is what you (Gerald 2.0) must instruct Code Desktop to do.
In this exact order. No skipping. No reordering.

```
COLD RESUME — verify state before anything:
  Read: .remember/remember.md + .remember/core-memories.md
  Read: docs/handoffs/meta-orchestration-handoff-index.md
  Run: git log --oneline -10
  Run: git status
  Verify: All 7 RULINGS present in core-memories.md
  Verify: PICK 1-4 owner decisions encoded
  Report disk state before proceeding.

STEP 1 — Install skills (one-time setup):
  Run the 9 install commands from Section 5 above.
  Create .impeccable.md in repo root with content from Section 5.
  Enable Agent Teams: add to .claude/settings.json
  Report: all skills installed, Agent Teams enabled, .impeccable.md created
  Commit: "chore(tools): install impeccable pack + web-accessibility skill,
           enable Agent Teams, add .impeccable.md"

STEP 2 — Complete pending Agent A ΔL measurement (if not done):
  Check if RULING 7 constants were re-grounded.
  If NOT done: run Agent A measurement now.
  Read ../toolskin-showcase/assets/css/toolskin.css lines 911-1075
  Measure actual OKLCH ΔL between base surface and each depth variant.
  Report measured values. DO NOT proceed to Step 3 until this is done.

STEP 3 — Session 3.x Deliverable 1: system/nesting.css
  Read: ts-panel+root-debugger-component.css L25-93 (source of truth)
  Read: root-tokens-blocks-reference.css §1f-nest (knob values)
  Build: assets/css/next/system/nesting.css
  Build: sandbox/01-system/nesting.html (paired, same commit)
  Run quality gate: toolskin-visual-audit + impeccable audit + impeccable polish
  Playwright captures. HALT. Report to Gerald 2.0.

STEP 4 — Council gate on nesting.css
  (Gerald 2.0 dispatches Agent Teams council after receiving HALT report)
  Council verifies: Does the nested card telescoping look correct?
  Does it match Wave 1.6 §A3/§D4 visual identity?
  GO/NO-GO to Code Desktop.

STEP 5 — Session 3.x Deliverable 2: text.css + accent.css
  Read: toolskin.css lines 1049-1075 (on-surface source pattern)
  Read: docs/handoffs/_code-audit-catalog.md §4.2 ROOT-1b semantic palette
  Build: assets/css/next/system/text.css
  Build: assets/css/next/system/accent.css
  Build: sandbox/01-system/text-accent.html (paired, same commit)
  Run quality gate: toolskin-visual-audit + impeccable colorize + impeccable audit
  Playwright captures. HALT. Report to Gerald 2.0.

STEP 6 — Council gate on text.css + accent.css
  Council verifies: Does text adapt correctly on all 6 surface depths?
  Does accent derivative chain match visual identity?
  GO/NO-GO to Code Desktop.

STEP 7 — Session 3.x Deliverable 3: surfaces.css extended
  Extend existing surfaces.css with missing derivatives.
  Update sandbox/01-system/surfaces.html to show new tokens.
  Run quality gate: toolskin-visual-audit + impeccable polish
  Playwright captures. HALT. Report to Gerald 2.0.

STEP 8 — Final Session 3.x council gate
  Council verifies the complete system layer (all 3 deliverables together).
  Question: "Is the system layer complete and sufficient for Session 4
  block work to begin?"
  GO = Session 3 closes. Session 4 plan queued.
  NO-GO = specific items to fix before close.

HALT BETWEEN EVERY STEP. Never chain steps without Gerald 2.0 GO.
```

---

## SECTION 10 — SESSION 4 BLOCK ORDER (queued, not started yet)

After Session 3.x closes cleanly:

1. ts-input (Atomic / PERMISSIVE) — Pattern 1 first consumer — ~6hrs
2. ts-btn (Atomic / PERMISSIVE) — ~5hrs
3. ts-chip (Atomic / PERMISSIVE — Rule 9 LOCKED) — ~4hrs
4. ts-feat-list (Molecular / STRICT) — Pattern 2 first consumer — ~8hrs
5. ts-card (Molecular / STRICT) — Pattern 3 first consumer — ~10hrs

Each block: CSS + sandbox HTML + impeccable quality gate + web-accessibility
(for form components) + Agent Teams council + owner gate + commit.

---

## SECTION 11 — OUTCOMES AND RISKS PER PATH

### If Session 3.x runs cleanly (expected):
- System layer complete: surfaces + nesting + text + accent
- Session 4 opens with ts-input on solid ground
- Every Session 4 block consumes the full system layer without gaps
- Impeccable + Agent Teams council catches issues before they commit
- Owner sees something visible after every deliverable

### If Agent Teams council replaces simulated council:
- Council quality goes from "one model, four hats" to "four real isolated analyses"
- Design Skeptic genuinely challenges Architect without seeing Architect's output first
- Council output is trustworthy enough to block commits

### If impeccable skills are not set up before session starts:
- Quality gate is incomplete
- Issues that impeccable would catch (alignment, spacing, accessibility) reach council
- Council spends time on fixable micro-issues instead of design identity

### If .impeccable.md is not created:
- impeccable audit will flag Toolskin intentional patterns as violations
- 13px base, nested cards, no media queries = constant false positives
- Agent will waste time defending intentional decisions

---

## YOUR RESPONSE FORMAT TO CODE DESKTOP

Gerald 2.0: write one response to Code Desktop.

Structure it exactly as:

1. COLD RESUME block (Section 9 Step 0)
2. STEP 1 — skills install (exact commands from Section 5)
3. STEP 2 — Agent A ΔL check
4. STEP 3 — nesting.css directive (exact scope from Section 4)
5. HALT instruction after Step 3
6. Note: Steps 4-8 will be issued after you report back on Step 3

Do not issue all steps at once. One step, then halt, then Gerald 2.0
issues the next step after reviewing the output.

The owner needs to see something in Chrome after nesting.html is built.
That is the success criterion for Step 3.
