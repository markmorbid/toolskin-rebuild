# Treemap + Tree-Sync Commit Brief v3 — Session 2026-05-16 FINAL

**For:** Claude Desktop, fresh session, working directory `D:\Mis Documentos\Projects\Toolskin Framework\toolskin-showcase`
**Goal:** TWO atomic commits — (1) treemap component + tool + reorganization, (2) tree-sync protocol doc + CLAUDE.md rule
**Estimated time:** 25-30 minutes total, 6 gates
**HARD RULES:** No push. No dedupe execution. No Python extension to deep_tree_map.py. No Desktop Commander. No scope expansion.

═══════════════════════════════════════════════════════════════════════
═══  COMMIT 1 — TREEMAP COMPONENT + TOOL + REORGANIZATION           ═══
═══════════════════════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════════════════
PHASE 0 — VERIFY STATE
═══════════════════════════════════════════════════════════════════════

```
git status
git log --oneline -5
```

Expected at HEAD `177fd8a`:
- 4 modified files (toolskin.css, toolskin.js, ts-offcanvas-editor.js, index.html)
- 6 deleted files (PITCH-DECK-*, branding/demos.html, index-compare.html, toolskin-pitchdeck-v2-refactored.html, toolskin-pitchdeck_recovered-ASSHOLE_2.css)
- ~25+ untracked items including tree-explorer.*, deep_tree_map*.py, _tmp_dedupe_pitchdeck.py, branding/index.html, pitchdeck/, docs/toolskin-tree-session-handoff.md, recovery CSS

Show output. STOP. Wait for "proceed".

═══════════════════════════════════════════════════════════════════════
PHASE 1 — APPEND TO .gitignore
═══════════════════════════════════════════════════════════════════════

Append to `.gitignore`:

```
# === 2026-05-16 additions ===

# Manual backup folder (owner-managed)
_bu/

# Pitchdeck staging areas — analysis-only, not production
pitchdeck/dedupe-filter/
pitchdeck/trash/

# Tree-explorer tool data outputs — regenerate on each export
tree-explorer.data.json
tree-explorer.dedup.json
```

Verify last 25 lines of `.gitignore`. STOP. Wait for "proceed".

═══════════════════════════════════════════════════════════════════════
PHASE 2 — CREATE tools/scripts/ AND MOVE PYTHON SCRIPTS
═══════════════════════════════════════════════════════════════════════

```
mkdir tools\scripts 2>nul
move "build_tree_full_html-interactive.py" "tools\scripts\"
move "deep_tree_map.py" "tools\scripts\"
move "deep_tree_mapv1.py" "tools\scripts\"
move "deep_tree_mapv2-component-extractor.py" "tools\scripts\"
```

Verify:
```
dir build_tree*.py deep_tree*.py 2>nul
dir tools\scripts\*.py
```

═══════════════════════════════════════════════════════════════════════
PHASE 3 — MOVE _tmp_dedupe SCRIPT AND RECOVERY CSS TO SANDBOX
═══════════════════════════════════════════════════════════════════════

```
mkdir _sandbox\scripts 2>nul
mkdir _sandbox\css-history 2>nul

move "_tmp_dedupe_pitchdeck.py" "_sandbox\scripts\"
move "assets\css\toolskin-deck_RECOVERED.css" "_sandbox\css-history\"
move "assets\css\toolskin-deck_latest-stable.css" "_sandbox\css-history\"
move "assets\css\toolskin-deck_retouched.css" "_sandbox\css-history\"
```

Verify:
```
dir _sandbox\scripts\
dir _sandbox\css-history\
```

═══════════════════════════════════════════════════════════════════════
PHASE 4 — ACKNOWLEDGE 6 DELETIONS
═══════════════════════════════════════════════════════════════════════

```
git add -u
```

Verify the 6 deletions appear under "Changes to be committed" as `deleted:`.

═══════════════════════════════════════════════════════════════════════
PHASE 5 — STAGE TREEMAP COMPONENT WORK
═══════════════════════════════════════════════════════════════════════

```
git add assets/css/toolskin.css
git add assets/js/toolskin.js
git add assets/js/ts-offcanvas-editor.js
git add index.html
```

Show `git diff --staged --stat`. STOP. Owner reviews. Wait for "proceed".

═══════════════════════════════════════════════════════════════════════
PHASE 6 — STAGE TREEMAP TOOL FILES
═══════════════════════════════════════════════════════════════════════

```
git add tree-explorer.html
git add tools/scripts/build_tree_full_html-interactive.py
git add tools/scripts/deep_tree_map.py
git add tools/scripts/deep_tree_mapv1.py
git add tools/scripts/deep_tree_mapv2-component-extractor.py
```

═══════════════════════════════════════════════════════════════════════
PHASE 7 — STAGE HANDOFF DOC, BRANDING, GITIGNORE
═══════════════════════════════════════════════════════════════════════

```
git add docs/toolskin-tree-session-handoff.md
git add branding/index.html
git add .gitignore
```

═══════════════════════════════════════════════════════════════════════
PHASE 8 — LEAVE EVERYTHING ELSE UNTRACKED (DEFERRED)
═══════════════════════════════════════════════════════════════════════

These items REMAIN UNTRACKED per owner direction:

  - `assets/css/toolskin-deck.css` ← parallel pitchdeck agent's territory
  - `assets/js/toolskin - Copy.js` ← backup, owner to sandbox later
  - `pitchdeck/` all root contents ← parallel pitchdeck agent
  - `ANALYZER.html`, `ANALYZER2.html`, `DRIVE_EXPLORER.html` ← owner decides
  - `cube-portfolio.html`, `ts-gallery-demo.html`, `ts-phantom-portfolio.html` ← deferred
  - `docs/# NON-DESTRUCTIVE REFACTOR PROTOCOL PROMPT - TOOLS.md` ← deferred
  - `docs/New folder/` ← deferred
  - `docs/PRE-REFACTORING-PLAN-15-04-2025/screenshots-comparisons/*` untracked items ← deferred
  - `docs/mockup-page_layout-blueprint-design/` ← deferred
  - `docs/handoffs/_pending-task-toast-commit-message.md` ← session record
  - `docs/handoffs/_sleep-mode-success.md` ← session record
  - `tree-explorer.data.json`, `tree-explorer.dedup.json` ← gitignored (Phase 1)
  - `_sandbox/`, `_bu/`, `pitchdeck/dedupe-filter/`, `pitchdeck/trash/` ← gitignored

═══════════════════════════════════════════════════════════════════════
PHASE 9 — COMMIT 1 FINAL REVIEW + COMMIT
═══════════════════════════════════════════════════════════════════════

```
git status
git diff --staged --stat
```

Expected: ~18 files staged.

STOP. Owner says "commit".

Save commit message to `commit-msg-1.txt`:

```
feat(tree): treemap component iter 1-10 + file-tree-explorer tool

TREEMAP COMPONENT — HEADLINE
Ten-iteration component build culminating in a stable treemap with 
muted-chip idle state, single-row strip with horizontal scroll + 
mask-image edge-fade overflow hint, and an architecture handoff doc 
designed for in-place extension by future agents.

Key fixes shipped this session:

- Chip idle color hijack — toolskin.css line 7567 reassigns 
  --ts-this-bg: var(--ts-accent) on chips, derivative-cascading the 
  border color from accent. Defeated via scoped reset 
  (--ts-this-bg: var(--ts-bg-0)) inside the contextual selector, then 
  pinned idle colors to neutral tokens. Idle chip color now resolves 
  to rgb(109, 111, 116) = --ts-text-muted, bg transparent, border = 
  muted-text mix. Active state still wins via [aria-selected="true"].

- Overflow handling — bounded flex slot (flex: 1 1 0; min-width: 0; 
  overflow-x: auto) + mask-image edge-fade hints scrollability 
  without chrome. Verified: action bar stays 60px, chip strip layout 
  417px / scroll 1214px, chipOverflows: true, edge-fade applied.

- flex-wrap regression — caught .ts-chips inheriting flex-wrap: wrap 
  from toolskin.css which would break the fixed-height topbar. Forced 
  flex-wrap: nowrap on the strip.

Truncate-to-dropdown pattern deferred — .ts-nav-truncate markup exists 
in index.html but the JS implementation isn't in toolskin.js yet. 
Queued in handoff doc as future enhancement.

FILE-TREE-EXPLORER TOOL — NEW
Standalone HTML tool for visualizing repo structure with categorized 
file counts, search, dark/light theme, export to JSON, and clickable 
duplicate detection. Surfaces all 2,012 files / 409 folders across 
the repo at once, with category counts (markdown 313, images 264, 
html 263, css 167, js 150, other 132, fonts 103, json 60, text 33, 
archives 18, shell 12, python 4, sheets 2).

Tool files committed:
- tree-explorer.html (the UI)
- tools/scripts/build_tree_full_html-interactive.py (build script)
- tools/scripts/deep_tree_map.py (scanner core)
- tools/scripts/deep_tree_mapv1.py (scanner v1)
- tools/scripts/deep_tree_mapv2-component-extractor.py (scanner v2)

Companion data outputs (tree-explorer.data.json, tree-explorer.dedup.
json) added to .gitignore — they regenerate on each export run.

HANDOFF DOC
docs/toolskin-tree-session-handoff.md — single living doc covering 
the full session in 10 sections: component summary + API, 12 
architecture conventions, full iter 1->10 timeline, owner vs agent 
toolskin.css changes, generator outputs with byte sizes, memory 
entries saved, open tasks split by component/tooling/design-system 
level, where-to-pick-up file pointers, and three recurring 
toolskin.css quirks worth flagging upstream (parser bug at \* */, 
chip --ts-this-bg reassignment, topbar logo uppercase override).

Designed for in-place extension.

REORGANIZATION (owner manual moves, this commit acknowledges)
- Deleted obsolete files: PITCH-DECK-COMPONENT-PATTERNS.md, 
  PITCH-DECK-IMPROVEMENTS-LOG.md, toolskin-pitchdeck_recovered-
  ASSHOLE_2.css, toolskin-pitchdeck-v2-refactored.html, 
  index-compare.html (moved to _bu/ locally, gitignored), 
  branding/demos.html (replaced).
- Renamed branding/demos.html -> branding/index.html.
- Moved 4 Python scripts from repo root to tools/scripts/.
- Moved 3 toolskin-deck CSS recovery snapshots from assets/css/ to 
  _sandbox/css-history/.
- Moved _tmp_dedupe_pitchdeck.py to _sandbox/scripts/ (gitignored 
  working dedupe utility for pitchdeck/, classifier blocked from 
  auto-running this session).

.gitignore ADDITIONS
- _bu/
- pitchdeck/dedupe-filter/, pitchdeck/trash/
- tree-explorer.data.json, tree-explorer.dedup.json

NEXT COMMIT IN THIS SESSION
- Tree-sync protocol doc + CLAUDE.md rule (no Python extension).

NOT IN THIS SESSION (deferred)
- Python extension to deep_tree_map.py with --summary and --diff-git 
  flags (separate focused session)
- pitchdeck/ root files (parallel pitchdeck agent track)
- Hero padding fix
- apcach Phase 1 audit
- presets.json curation
- TypeUI adaptation Phase B (showcase HTML)
- ANALYZER.html, ANALYZER2.html, DRIVE_EXPLORER.html — owner classifies

Refs:
- docs/toolskin-tree-session-handoff.md (this commit)
- docs/handoffs/_sleep-mode-success.md (prior session, 177fd8a)
- _session-staging/pitchdeck-track/* (pitchdeck delegation, future)
```

```
git commit -F commit-msg-1.txt
```

After commit, run:
```
git log --oneline -3
git status
```

STOP. Show owner commit 1 hash. Wait for "proceed to commit 2".

═══════════════════════════════════════════════════════════════════════
═══  COMMIT 2 — TREE-SYNC PROTOCOL DOC + CLAUDE.md RULE             ═══
═══════════════════════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════════════════
PHASE 10 — VERIFY tree-sync-protocol.md EXISTS IN _session-staging/
═══════════════════════════════════════════════════════════════════════

The protocol doc was prepared by owner. Verify:

```
dir _session-staging\tree-sync-protocol.md
```

If found: continue.
If not found: STOP and ask owner to drop the file in `_session-staging/`. 
Wait for owner to confirm placement.

═══════════════════════════════════════════════════════════════════════
PHASE 11 — COPY PROTOCOL DOC TO docs/handoffs/
═══════════════════════════════════════════════════════════════════════

Move (not copy — single source of truth) the protocol doc to its 
canonical home in the repo:

```
move "_session-staging\tree-sync-protocol.md" "docs\handoffs\tree-sync-protocol.md"
```

Verify destination:
```
type docs\handoffs\tree-sync-protocol.md
```

Show the first 20 lines to owner for sanity check.

═══════════════════════════════════════════════════════════════════════
PHASE 12 — APPEND CLAUDE.md RULE
═══════════════════════════════════════════════════════════════════════

Read the current `CLAUDE.md`:
```
type CLAUDE.md
```

Find the appropriate section to append (typically before any "Skill 
restrictions" section, or at the end). Then append this EXACT block:

```markdown

## File-Tree-Explorer Protocol

This repo includes a file-tree-explorer tool at `tree-explorer.html` 
with scanners at `tools/scripts/deep_tree_map*.py`. Agents working on 
this repo MUST use it as ground truth for filesystem state, 
complementing (not replacing) `git status`.

**Session start rule:** If a session involves filesystem changes, 
verify the current tree state. Currently: run `git status` and 
reconcile against owner's expectation. (Future: `python tools/scripts/deep_tree_map.py --summary` once that flag lands — see docs/handoffs/tree-sync-protocol.md.)

**Discovery rule:** If a file appears in `git status` that you can't 
account for, query the tree for its category/origin before guessing. 
Open `tree-explorer.html` for visual inspection, or read 
`tree-explorer.dedup.json` (gitignored) for dedup groups.

**Dedup rule:** If you detect duplicate-looking filenames, load 
`tree-explorer.dedup.json` to check the dedup groups. Surface to 
owner. Never auto-move duplicates without explicit owner approval.

**Anti-pattern:** Never load the full `tree-explorer.data.json` 
(~1.4 MB) into agent context. Read it selectively or use the 
forthcoming `--summary` flag.

**Full spec:** `docs/handoffs/tree-sync-protocol.md`
```

After append, verify:
```
type CLAUDE.md
```

Show owner the last ~30 lines of CLAUDE.md to confirm the append 
landed correctly. STOP. Wait for "proceed".

═══════════════════════════════════════════════════════════════════════
PHASE 13 — STAGE COMMIT 2
═══════════════════════════════════════════════════════════════════════

```
git add docs/handoffs/tree-sync-protocol.md
git add CLAUDE.md
```

Verify:
```
git status
git diff --staged --stat
```

Expected: 2 files staged (1 new, 1 modified).

═══════════════════════════════════════════════════════════════════════
PHASE 14 — COMMIT 2 FINAL REVIEW + COMMIT
═══════════════════════════════════════════════════════════════════════

STOP. Owner reviews. Says "commit".

Save commit message to `commit-msg-2.txt`:

```
docs(protocol): tree-sync protocol + CLAUDE.md rule for agent ground truth

PROTOCOL DOC
docs/handoffs/tree-sync-protocol.md — defines how Claude Code agents 
should use the file-tree-explorer tool to verify repo state against 
the working filesystem. Three-tier architecture (summary / diff / 
full) to avoid burning agent context budget on the full 1.4 MB tree 
JSON.

Key rules established:
- Session start: agent uses git status + (future) tree summary as 
  ground truth, surfaces anomalies to owner before proceeding
- Discovery: when a file appears unexpectedly in git status, agent 
  cross-references against tree categories and dedup groups before 
  guessing taxonomy
- Dedup: when duplicate filenames detected, agent loads dedup report, 
  surfaces to owner, never auto-moves
- Anti-pattern: never load full tree-explorer.data.json into agent 
  context (~350-500K tokens)

CLAUDE.md UPDATE
Added "File-Tree-Explorer Protocol" section with the rule summary 
and pointer to the full spec. Future agents reading CLAUDE.md will 
follow the rule even before the Python extension lands.

NOT IN THIS COMMIT (future work)
- Extension of tools/scripts/deep_tree_map.py with --summary and 
  --diff-git flags. Currently the rule references git status as 
  fallback; once flags exist, agents transition to summary-driven 
  verification. Estimated 30-60 min focused implementation session.
- Update session-brief template to include Phase 0.B tree-sync 
  check (depends on Python extension landing first).

Refs:
- docs/handoffs/tree-sync-protocol.md (the full spec)
- Previous commit: treemap component + tool (see git log)
```

```
git commit -F commit-msg-2.txt
```

After commit:
```
git log --oneline -5
git status
```

Show output.

═══════════════════════════════════════════════════════════════════════
PHASE 15 — CLEANUP TEMP FILES
═══════════════════════════════════════════════════════════════════════

```
del commit-msg-1.txt 2>nul
del commit-msg-2.txt 2>nul
```

═══════════════════════════════════════════════════════════════════════
PHASE 16 — STAND DOWN
═══════════════════════════════════════════════════════════════════════

Session ends here. Final state:
- TWO commits landed on master (treemap + tree-sync protocol)
- Working tree clean except intentionally-deferred untracked items
- CLAUDE.md updated with file-tree-explorer protocol rule
- Pending for next session: Python extension to deep_tree_map.py 
  (--summary, --diff-git flags), hero padding fix, parallel pitchdeck 
  agent dispatch, apcach Phase 1 audit, presets.json curation, TypeUI 
  Phase B

Do NOT autonomously continue. Wait for owner's next instruction.

═══════════════════════════════════════════════════════════════════════
HARD CONSTRAINTS (apply to BOTH commits)
═══════════════════════════════════════════════════════════════════════

- NO push
- NO running of _tmp_dedupe_pitchdeck.py or any pitchdeck dedupe
- NO modification of any file beyond what's listed
- NO auto-format
- NO extension of deep_tree_map.py with new flags (deferred to future session)
- NO Python work beyond moving existing files
- NO file deletions (move only)
- NO touching .git/ directly
- NO touching .claude/worktrees/
- NO Desktop Commander tool calls
- NO scope expansion into pitchdeck root files, hero padding, apcach, 
  or any deferred priority
- If a file appears in git status NOT in this manifest, FLAG to owner 
  before any action
- If Phase 10 fails (protocol doc not found), STOP and surface to owner

═══════════════════════════════════════════════════════════════════════
END OF BRIEF
═══════════════════════════════════════════════════════════════════════
