# RESET — clean the workspace, keep everything good
# ONE job. Do it top to bottom. No phases, no halts, just do it and report.

═══════════════════════════════════════════════════════
THE ABSOLUTE RULE — DO THIS FIRST OR WORK IS LOST
═══════════════════════════════════════════════════════
A hard reset DESTROYS uncommitted working-tree changes. The owner's 22-hour
tokens.css work is UNCOMMITTED. ZIP THE ENTIRE WORKING TREE FIRST. If you
skip this, the owner loses a day of work. This is not optional.

  STEP 1 — full zip backup of the current state (everything, mess included):
    $stamp = [DateTime]::UtcNow.ToString("yyyyMMdd-HHmmss")
    git stash list > _stash-manifest.txt 2>$null
    # Zip the whole repo working tree EXCEPT .git/node_modules, into a dated archive
    Compress-Archive -Path * -DestinationPath "..\toolskin-OLD-pre-reset-$stamp.zip" -Force
    # ALSO explicitly copy the irreplaceable uncommitted files out, by name:
    New-Item -ItemType Directory -Force -Path "..\_pre-reset-rescue-$stamp"
    Copy-Item assets\css\next\**\tokens.css   "..\_pre-reset-rescue-$stamp\" -Force
    Copy-Item assets\css\next\**\colors.css   "..\_pre-reset-rescue-$stamp\" -Force
    Copy-Item sandbox\00-design-reference\*.html "..\_pre-reset-rescue-$stamp\" -Force
  Confirm both the zip and the rescue folder exist. Report their paths.
  DO NOT PROCEED until both are confirmed on disk.

═══════════════════════════════════════════════════════
STEP 2 — restore the uncommitted gold into git, THEN reset
═══════════════════════════════════════════════════════
The reset target is the current HEAD (012e048) — it already holds every
committed gain (toggle fix, :root fix, layout restore, the system install).
The only thing worth keeping that is NOT yet committed is the owner's
tokens.css (and possibly colors.css/sandbox edits). So:

  a. Commit the owner's uncommitted gold as ONE real phase commit BEFORE
     resetting away the rest of the mess:
       git add <tokens.css path> <colors.css path> <sandbox index.html path>
       git commit -m "feat(tokens): owner 22h tokens.css work + colors :root + sandbox layout"
     (This is a real development phase — commit it. This is committable progress.)

  b. NOW hard-reset to drop the remaining battlefield (stashes, stray WIP,
     19 scattered backups, half-integration cruft) — everything NOT committed:
       git reset --hard HEAD
       git clean -fd -e backups -e .claude   # remove untracked junk, KEEP backups/ and .claude/
     (Guard note: this reset/clean is owner-authorized HERE explicitly. If the
      guard blocks it, the owner has approved this specific reset — proceed.)

  c. Drop the stash chaos (it's archived in the zip already):
       git stash clear

═══════════════════════════════════════════════════════
STEP 3 — verify the clean state
═══════════════════════════════════════════════════════
  git status         → working tree clean
  git log --oneline -3  → tokens commit on top of 012e048
  Confirm these still exist and are intact:
    - assets/css/next/.../tokens.css   (owner's 22h work)
    - assets/css/next/.../colors.css   (:root fixes)
    - sandbox/00-design-reference/index.html  (good layout)
    - .claude/ (rules + hooks + guard)
    - expert-designer/ (skill)
  Report the clean HEAD hash. DONE. No further action.

The old mess lives in toolskin-OLD-pre-reset-<stamp>.zip if ever needed.
Do not reopen it. The workspace is now clean and anchored.
