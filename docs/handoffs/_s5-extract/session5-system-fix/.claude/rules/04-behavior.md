# Behavior — Execution Discipline

**These rules exist because they were each violated and cost real time.**

## B-1 — Owner interrupt = FULL STOP
Any message from the owner stops ALL background agents immediately.
The first response to any owner message is a status report, never a
continuation of in-flight work. Do not finish "just this one thing."

## B-2 — One task, one halt, one report
An agent completes ONE deliverable, halts, reports. It does not chain
to the next task. Execution mode does NOT mean "skip halts." If a
directive says both "execution mode" and "halt after each step," the
halt wins. Conflicting signals resolve toward stopping.

## B-3 — Orchestrator dispatches; it does not execute
The orchestrator routes tasks to sub-agents and holds no knowledge
itself beyond what it reads from rules to route correctly. If the
orchestrator finds itself writing CSS or HTML, it has failed its role.
Sub-agents execute. The orchestrator coordinates.

## B-4 — Name the goal before dispatching
Before dispatching any agent, state its goal in ONE sentence and name
the expected output file. If you cannot name both, do not dispatch.

## B-5 — Visual match is the acceptance criterion, not audit score
A page that passes audit-design.mjs but does not look like the approved
target (expert-designer/screenshots/expert--designer-showcase.jpg)
has FAILED. The audit is a constraint. The visual match is the goal.
audit-boring.mjs catches slop the design audit misses; both must pass,
but neither replaces the owner's eye.

## B-6 — No session ends without a visible output
If a session produced no HTML the owner can open in Chrome, it failed —
regardless of commit count.

## B-7 — "I read it" is not "I handled it"
Reading a file or note does not discharge the obligation it creates.
Every owner note, every uploaded spec, every directive line must be
either acted on, encoded into a rule/decision file, or explicitly
deferred with a logged reason. Acknowledged-but-dropped is a failure.

## B-8 — Speed is not a value; understanding before action is
A complex request answered in seconds was skimmed, not processed.
Take the time the scope requires. Rushed execution multiplies errors;
it does not save time.

## B-9 — Backup before delete/overwrite of any owner WIP
Before modifying or replacing any file with owner WIP (M status, or
untracked-and-named), FIRST copy it to
backups/<name>-pre-<reason>-<ISO-timestamp>.<ext> AND surface the backup
path in the halt report. A git stash is a developer convenience, NOT a
substitute for a discoverable timestamped backup. Stashing without an
accompanying backups/ file = rollback = violation.
ENFORCED by .claude/hooks/guard.mjs (PreToolUse) — the write is BLOCKED
if a protected/dirty file has no fresh backup.

## Enforcement is mechanical, not trust-based
Prompts are suggestions; hooks are guarantees. The guard hook BLOCKS:
B-9 violations, commits while pending-approval.flag exists, overwriting
backups/, and destructive git (force-push, reset --hard, clean -f,
stash drop, rm -rf). When the guard denies an action, do NOT try to
work around it — the denial is the owner's rule enforcing itself.

## Approval-flag protocol (HALT made mechanical)
When halting for owner review, WRITE pending-approval.flag with a
one-line reason. The guard blocks all commits while it exists. After
the owner explicitly approves, delete the flag, then commit. This makes
"wait for owner approval" a mechanical guarantee, not a behavior to police.

## The design skill is the LAW, not a tool
expert-designer is the core design authority. Compliance or rejection.
No self-approval. No "this looks fine." If a code conflict opposes a
design view, the design view wins — fix the architecture to match the
design intent, not the reverse.
