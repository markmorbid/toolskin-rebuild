# DIRECTIVE — Install the System + Run the Recovery (FULL AUTO)
# The agent does everything. Owner only approves at each flagged halt.
# Files already on disk (owner placed them):
#   docs/handoffs/session5-system-fix.zip
#   docs/handoffs/guard.mjs   (also bundled inside the zip; zip wins)

═══════════════════════════════════════════════════════
PHASE 0 — VERIFY DISK REALITY FIRST (Pattern 18)
═══════════════════════════════════════════════════════
Run and report before doing anything:
  git rev-parse --short HEAD          (expect 740a1fe)
  dir docs\handoffs\session5-system-fix.zip   (must exist)
  dir .claude                          (skills/ exists; rules/ + hooks/ likely missing)
  dir .claude\hooks                    (likely missing)
  dir .claude\rules                    (likely missing)
  dir logs                             (likely missing)
  type .claude\settings.json           (if exists — we MERGE, never overwrite)
  node --version                       (hooks need node; if missing, HALT and report)
Report what exists vs missing. Then PHASE 1.

═══════════════════════════════════════════════════════
PHASE 1 — EXTRACT + DEPLOY THE SYSTEM PACKAGE
═══════════════════════════════════════════════════════
a. Extract the zip to a temp folder (do NOT unzip over the repo blindly):
     Expand-Archive "docs\handoffs\session5-system-fix.zip" `
       -DestinationPath "docs\handoffs\_s5-extract" -Force
   The zip contains a top folder: session5-system-fix/. Confirm it expanded:
     dir docs\handoffs\_s5-extract\session5-system-fix

b. Copy each piece to the repo root. Set $S5 first:
     $S5 = "docs\handoffs\_s5-extract\session5-system-fix"

   RULES (auto-loaded each session):
     New-Item -ItemType Directory -Force -Path .claude\rules
     Copy-Item "$S5\.claude\rules\*" .claude\rules\ -Force

   HOOKS (the logger, rehydrator, and the BLOCKING guard):
     New-Item -ItemType Directory -Force -Path .claude\hooks
     Copy-Item "$S5\.claude\hooks\checkpoint-logger.mjs" .claude\hooks\ -Force
     Copy-Item "$S5\.claude\hooks\session-rehydrate.mjs" .claude\hooks\ -Force
     Copy-Item "$S5\.claude\hooks\guard.mjs"             .claude\hooks\ -Force
   (If $S5 lacks guard.mjs for any reason, fall back to docs\handoffs\guard.mjs.)

   DECISIONS / AUDIT / LOGS / BACKUPS-REFERENCE / HANDOFFS:
     New-Item -ItemType Directory -Force -Path decisions, audit, logs
     Copy-Item "$S5\decisions\*" decisions\ -Force
     Copy-Item "$S5\audit\*"     audit\     -Force
     Copy-Item "$S5\logs\checkpoints.log" logs\ -Force          # seed; keep appending
     Copy-Item "$S5\backups\oklch-surface-system-PREVIOUS.css" backups\ -Force
     Copy-Item "$S5\handoffs\council-compensation-directive.md" docs\handoffs\ -Force

c. MERGE the root CLAUDE.md (NEVER overwrite):
   PREPEND the contents of "$S5\.claude\CLAUDE.md" to the TOP of the
   project-root CLAUDE.md. Keep the existing DESIGN LAW + BRANCH CONVENTION
   that landed in 00711b6. If a "CONTEXT REHYDRATION" block already exists,
   do not duplicate it — reconcile.

d. MERGE the hook registration into .claude\settings.json (NEVER overwrite):
   Open "$S5\.claude\hooks\settings.json". Add its three hook entries
   (SessionStart → rehydrate, PreToolUse → guard, PostToolUse → logger)
   into the existing .claude\settings.json "hooks" object. Preserve all
   existing settings/permissions. If .claude\settings.json does not exist,
   create it from the package file. Validate it parses as JSON:
     node -e "JSON.parse(require('fs').readFileSync('.claude/settings.json','utf8'));console.log('settings valid')"

═══════════════════════════════════════════════════════
PHASE 2 — VERIFY THE HOOKS ACTUALLY FIRE
═══════════════════════════════════════════════════════
Run each and report output. ALL must behave as stated or HALT.

a. Logger appends:
     echo {"tool_name":"Write","tool_input":{"file_path":"verify.css"},"session_id":"install01"} | node .claude\hooks\checkpoint-logger.mjs
     type logs\checkpoints.log    (a new line should appear)

b. Rehydrator emits JSON:
     node .claude\hooks\session-rehydrate.mjs    (valid JSON with manifest)

c. Guard BLOCKS a destructive command (must print permissionDecision "deny"):
     echo {"tool_name":"Bash","tool_input":{"command":"git reset --hard"}} | node .claude\hooks\guard.mjs

d. Guard ALLOWS a normal write (empty output = allowed):
     echo {"tool_name":"Write","tool_input":{"file_path":"docs\notes\ok.md"}} | node .claude\hooks\guard.mjs

e. Guard BLOCKS commit while a flag exists:
     echo test-halt > pending-approval.flag
     echo {"tool_name":"Bash","tool_input":{"command":"git commit -m x"}} | node .claude\hooks\guard.mjs
     del pending-approval.flag

Remove the verify line from logs\checkpoints.log if you want it clean
(optional). Report all five results.

═══════════════════════════════════════════════════════
PHASE 3 — COMMIT THE SYSTEM (infra only; safe)
═══════════════════════════════════════════════════════
This commit has no design change, so no approval flag is needed for it.
  git add .claude\ decisions\ audit\ logs\ backups\ docs\handoffs\ CLAUDE.md
  git commit -m "feat(system): install externalized knowledge + logging + rehydration + enforcement guard

  - .claude/rules/ : 7 topic files, auto-loaded each session
  - .claude/hooks/ : PostToolUse logger + SessionStart rehydrate + PreToolUse guard (BLOCKS B-9 violations, unapproved commits, backup deletion, destructive git)
  - decisions/, audit/, logs/, backups/ reference
  - root CLAUDE.md rehydration protocol (survives compaction)"
Append a line to logs\checkpoints.log for this commit.
Report hash. Then PHASE 4. (No halt needed — pure infra.)

═══════════════════════════════════════════════════════
PHASE 4 — RUN THE THREE-COMMIT RECOVERY
═══════════════════════════════════════════════════════
Now execute docs\handoffs\directive-surface-state-fix.md in full:
  Commit 1 — layout restore + hook backups/ exclusion + B-9 rule
  Commit 2 — generator toggle fix (both rules) + state knob block
  Commit 3 — owner surfaces.css blocks restored VERBATIM

The guard is now LIVE, so:
  - Before each of those commits, write pending-approval.flag with a
    one-line reason. The guard will BLOCK the commit until owner clears it.
  - Owner reviews, approves, runs `del pending-approval.flag`, then you commit.
  - B-9 backups are now ENFORCED — any owner-WIP write without a fresh
    backup will be blocked by the guard. Make the backup first.

═══════════════════════════════════════════════════════
HARD RULES
═══════════════════════════════════════════════════════
- NEVER overwrite root CLAUDE.md or .claude/settings.json — MERGE only.
- If node is unavailable, HALT immediately (hooks cannot run).
- If any PHASE 2 verification fails, HALT and report — do not proceed.
- After PHASE 3, the guard enforces everything. Do not attempt to bypass
  a denial; the denial is the owner's rule. If blocked, report and ask.
- One commit, one halt, one approval through PHASE 4. No chaining.
- Confirm PHASE 0 disk reality before PHASE 1.
