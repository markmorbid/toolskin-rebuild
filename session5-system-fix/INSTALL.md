# INSTALL — Persistent System Deployment
# Paste to Code Desktop. This deploys the externalized-knowledge +
# logging + rehydration system. ONE task, verify each step, HALT at end.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 0 — VERIFY DISK REALITY FIRST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Do NOT assume structure. Run and report:
  git rev-parse --short HEAD
  dir .claude              (what's actually there — we know skills/ exists)
  dir .claude\hooks         (likely missing)
  dir .claude\rules         (likely missing — this is the gap)
  dir logs                  (likely missing)
  dir decisions             (likely missing)
  type .claude\settings.json  (if exists — we MERGE, never overwrite)

Report what exists vs what's missing. THEN proceed.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — DEPLOY THE FILES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This package (session5-system-fix/) contains the full tree. Copy each
file to its matching path in the repo root. Structure:

  .claude/CLAUDE.md            → MERGE into existing root CLAUDE.md at TOP
                                  (do NOT overwrite — prepend this block)
  .claude/rules/00-cold-start.md
  .claude/rules/01-rulings.md
  .claude/rules/02-visual-quality.md
  .claude/rules/03-css-architecture.md
  .claude/rules/04-behavior.md
  .claude/rules/05-owner-notes.md
  .claude/rules/06-design-law.md       (path-scoped to html/css)
  .claude/hooks/checkpoint-logger.mjs
  .claude/hooks/session-rehydrate.mjs
  .claude/hooks/settings.json          → MERGE hooks block into
                                          .claude/settings.json
  decisions/color-system.md
  decisions/system-layer-status.md
  decisions/font-scaling.md
  audit/checklist.md
  logs/checkpoints.log                 (seed file — keep appending)
  backups/oklch-surface-system-PREVIOUS.css
  handoffs/council-compensation-directive.md

IMPORTANT MERGES (never overwrite):
- Root CLAUDE.md: PREPEND the .claude/CLAUDE.md block. Keep existing
  DESIGN LAW + BRANCH CONVENTION that landed in 00711b6.
- .claude/settings.json: add the "hooks" block from
  .claude/hooks/settings.json. Keep existing settings.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — ALSO COPY core-memories.md TO handoffs/
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The full-state insurance copy. If it exists at docs/handoffs/core-memories.md
already, copy it to handoffs/core-memories.md (the path the rehydrate hook
and cold-start protocol reference). Keep both in sync.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — VERIFY THE HOOKS RUN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Test the logger:
  echo '{"tool_name":"Write","tool_input":{"file_path":"test.css"},"session_id":"verify01"}' | node .claude/hooks/checkpoint-logger.mjs
  type logs\checkpoints.log    (should show a new line)

Test the rehydrator:
  node .claude/hooks/session-rehydrate.mjs    (should print valid JSON)

Both must exit 0. If either errors, report and HALT.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — RETIRE remember.md (it never survived anyway)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The nested .remember/remember.md does NOT survive compaction — that is
why it kept emptying. The durable store is now root CLAUDE.md +
.claude/rules/ + logs/checkpoints.log. Leave .remember/core-memories.md
as a secondary backup but stop relying on remember.md as the live store.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5 — COMMIT (this IS a safe commit — system infra, no design change)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  git add .claude/ decisions/ audit/ logs/ backups/ handoffs/ CLAUDE.md
  git commit -m "feat(system): externalized knowledge + persistent logging + rehydration

  - .claude/rules/ : 7 topic files, auto-loaded each session (<200 lines each)
  - .claude/hooks/ : PostToolUse checkpoint logger + SessionStart rehydrator
  - decisions/ : color-system, system-layer-status, font-scaling (OPEN)
  - audit/checklist.md : grep-based FAIL conditions
  - backups/ : OKLCH surface reference (dark-surface fix)
  - root CLAUDE.md : rehydration protocol (survives compaction)
  Solves the remember.md wipe: durable knowledge now lives where the
  system guarantees re-injection."

Append to log:
  Add a line to logs/checkpoints.log recording this commit.

Report hash. Then HALT.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 6 — NEXT (do NOT run yet — await owner GO)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After owner confirms the system is installed and the rehydration works:
→ dispatch handoffs/council-compensation-directive.md
  (council deliberates on the owner's CSS work, NO COMMIT, then HALT)

Do NOT start the council until owner says GO.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HARD BLOCKERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Either hook errors on the test invocation
- .claude/settings.json merge would overwrite existing hooks/permissions
- Root CLAUDE.md merge would lose the existing DESIGN LAW block from 00711b6
- node not available in the shell (hooks need it)
