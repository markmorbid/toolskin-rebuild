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
Any time an agent is about to modify or replace a file that has owner WIP
in the working tree (M-status, OR untracked-and-named, OR present in a
git stash that resulted from a prior agent dispatch), it MUST first copy
that file to `backups/<original-name>-pre-<reason>-<ISO-timestamp>.<ext>`
AND surface the backup path to the owner in its halt report.

Git stash is a developer convenience. It is NOT a substitute for a
discoverable timestamped backup. Stashing without an accompanying
`backups/` file is a rollback (the owner cannot browse stash contents
in their file explorer; the file looks killed) and a B-9 violation
regardless of recoverability.

Use the SAME ISO-timestamp string for every backup written in a single
commit, so they cluster visually in `ls backups/` output. The timestamp
format is `yyyy-MM-ddTHH-mm-ssZ` (filesystem-safe — dashes, not colons).

Surfacing in the halt report means: list every backup path in a
dedicated "Backups created (B-9)" section, with byte-size and source.
The owner must be able to read this section and immediately verify the
backups exist by `ls backups/`.

B-9 is binding from 2026-05-26 onward. The trigger event was the
sub-agent stashing three files into stash@{0} during the Commit A
dispatch without producing parallel backups/ copies — recoverable, but
invisible to the owner, who reasonably concluded the files were killed.

## The design skill is the LAW, not a tool
expert-designer is the core design authority. Compliance or rejection.
No self-approval. No "this looks fine." If a code conflict opposes a
design view, the design view wins — fix the architecture to match the
design intent, not the reverse.
