# WORKING MODE — how we actually work now
# This REPLACES the heavy loop. No flags. No per-step halts. No ceremony.
# Goal: agent does real work, commits at real milestones, gets out of the way.

═══════════════════════════════════════════════════════
THE FOUR RULES (this is the whole operating system)
═══════════════════════════════════════════════════════

1. COMMIT AT PHASES, NOT STEPS.
   A commit marks a COMPLETED PHASE of development — a real milestone.
   Phases here: (1) surfaces integrated, (2) gradients integrated,
   (3) button integrated, (4) color system consolidated.
   Four commits, not forty. Do NOT commit micro-steps. Do NOT commit
   mid-phase. Finish the phase, verify it, commit once, move on.

2. ZIP-BACKUP BEFORE RISK — like any normal developer.
   Before a risky or destructive pass (overwriting a core file, a big
   refactor), zip the target folder:
     Compress-Archive -Path <target> -DestinationPath "backups\<name>-<UTCstamp>.zip"
   That's the ENTIRE backup protocol. One zip before risk. Not 12
   timestamped per-file copies. Not a backup before every edit.

3. NO CEREMONY. DO THE WHOLE JOB.
   - No pending-approval.flag dance.
   - No "halt after every step."
   - No "Pattern 16" question every three minutes.
   - No asking permission to continue mid-phase.
   Run the entire phase. If you hit a genuine fork that changes the
   OUTCOME (not a detail), ask ONCE, briefly. Otherwise: just do it
   and report when the PHASE is done.

4. VERIFY BY THE SHOWCASE, NOT BY INSPECTION.
   Each phase has a real HTML page that proves it works. The phase is
   done when that page renders correctly in the browser — not when a
   token count matches. If the showcase looks right, ship it. If it's
   visibly broken, a dependency is missing — fix it before commit.

═══════════════════════════════════════════════════════
WHAT THIS KILLS (the heavy loop that wasted the day)
═══════════════════════════════════════════════════════
- pending-approval.flag → GONE. Commit at phase end, no flag gate.
- one-task-one-halt → GONE. Do the whole phase.
- per-file timestamped backups → GONE. One zip before risk.
- guard blocking every commit → relaxed. The guard stays ONLY as:
    * block rm -rf / force-push / reset --hard (real catastrophes)
    * that's it. No commit-gating. No per-file backup-gating.
- Pattern-16 interrogation → GONE. One question only if the OUTCOME forks.

═══════════════════════════════════════════════════════
WHAT STAYS (the few things that actually helped)
═══════════════════════════════════════════════════════
- The zip-before-risk habit (it's what saves work).
- The guard as a catastrophe-only net (rm -rf / force-push / hard-reset).
- Showcase-based verification (catches missing pieces visually).
- The rules files for context (so the agent knows the architecture).

═══════════════════════════════════════════════════════
THE AGENT'S JOB, IN ONE SENTENCE
═══════════════════════════════════════════════════════
Read the phase recipe, do the whole phase, verify against its showcase,
zip before anything risky, commit once when the phase renders correctly,
report the result. Do not narrate the journey. Do not ask permission to
breathe. Make the owner work less.
