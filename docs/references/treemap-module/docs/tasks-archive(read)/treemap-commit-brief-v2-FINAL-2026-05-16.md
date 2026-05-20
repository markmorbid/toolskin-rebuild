# Treemap Commit Brief v2 — Session 2026-05-16 FINAL

**For:** Claude Desktop, fresh session, working directory `D:\Mis Documentos\Projects\Toolskin Framework\toolskin-showcase`
**Goal:** Single focused commit with treemap component + treemap tool + morning reorganization
**Headline:** `feat(tree): treemap component iter 1-10 + file-tree-explorer tool`
**Estimated time:** 15-20 minutes, 5 gates
**HARD RULES:** No push. No dedupe execution. No scope expansion. No Desktop Commander.

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

Verify `tools/scripts/` exists or create:

```
mkdir tools\scripts 2>nul
```

Move the 4 root-level Python scripts to `tools/scripts/`:

```
move "build_tree_full_html-interactive.py" "tools\scripts\"
move "deep_tree_map.py" "tools\scripts\"
move "deep_tree_mapv1.py" "tools\scripts\"
move "deep_tree_mapv2-component-extractor.py" "tools\scripts\"
```

Verify root is clean of these:

```
dir build_tree*.py deep_tree*.py 2>nul
```

Should output nothing.

Verify destination:

```
dir tools\scripts\*.py
```

Should show 4 files.

═══════════════════════════════════════════════════════════════════════
PHASE 3 — MOVE _tmp_dedupe SCRIPT AND RECOVERY CSS TO SANDBOX
═══════════════════════════════════════════════════════════════════════

3.A — Move `_tmp_dedupe_pitchdeck.py` to sandbox:

```
mkdir _sandbox\scripts 2>nul
move "_tmp_dedupe_pitchdeck.py" "_sandbox\scripts\"
```

Verify gone from root:

```
dir _tmp_*.py 2>nul
```

(Should output nothing.)

3.B — Move 3 recovery CSS snapshots from `assets/css/` to `_sandbox/css-history/`:

```
mkdir _sandbox\css-history 2>nul
move "assets\css\toolskin-deck_RECOVERED.css" "_sandbox\css-history\"
move "assets\css\toolskin-deck_latest-stable.css" "_sandbox\css-history\"
move "assets\css\toolskin-deck_retouched.css" "_sandbox\css-history\"
```

Verify destinations:

```
dir _sandbox\scripts\
dir _sandbox\css-history\
```

═══════════════════════════════════════════════════════════════════════
PHASE 4 — ACKNOWLEDGE 6 DELETIONS
═══════════════════════════════════════════════════════════════════════

Stage all previously-tracked file deletions:

```
git add -u
```

Verify with `git status` — the 6 deletions should now appear under "Changes to be committed" as `deleted:`.

═══════════════════════════════════════════════════════════════════════
PHASE 5 — STAGE TREEMAP COMPONENT WORK (the headline)
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

The file-tree-explorer tool itself is production-ready:

```
git add tree-explorer.html
git add tools/scripts/build_tree_full_html-interactive.py
git add tools/scripts/deep_tree_map.py
git add tools/scripts/deep_tree_mapv1.py
git add tools/scripts/deep_tree_mapv2-component-extractor.py
```

Note: `tree-explorer.data.json` and `tree-explorer.dedup.json` are now in gitignore (Phase 1), so they'll be left untracked.

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
  - `cube-portfolio.html`, `ts-gallery-demo.html`, `ts-phantom-portfolio.html` ← already-tracked, only stage if modified
  - `docs/# NON-DESTRUCTIVE REFACTOR PROTOCOL PROMPT - TOOLS.md` ← deferred
  - `docs/New folder/` ← deferred
  - `docs/PRE-REFACTORING-PLAN-15-04-2025/screenshots-comparisons/*` untracked items ← deferred
  - `docs/mockup-page_layout-blueprint-design/` ← deferred
  - `docs/handoffs/_pending-task-toast-commit-message.md` ← session record
  - `docs/handoffs/_sleep-mode-success.md` ← session record
  - `tree-explorer.data.json`, `tree-explorer.dedup.json` ← gitignored (Phase 1)
  - `_sandbox/`, `_bu/`, `pitchdeck/dedupe-filter/`, `pitchdeck/trash/` ← gitignored

DO NOT stage any of these.

═══════════════════════════════════════════════════════════════════════
PHASE 9 — FINAL REVIEW
═══════════════════════════════════════════════════════════════════════

```
git status
git diff --staged --stat
```

Owner verifies:
- 4 modifications staged (treemap component work in core files)
- 6 deletions staged
- 5 tool files staged (tree-explorer.html + 4 Python scripts in tools/scripts/)
- 3 production files staged (handoff doc, branding/index.html, .gitignore)
- `_sandbox/`, `_bu/`, gitignored folders, deferred items: all absent from staged

Expected total: ~18 files in commit.

STOP. Owner says "commit".

═══════════════════════════════════════════════════════════════════════
PHASE 10 — ATOMIC COMMIT
═══════════════════════════════════════════════════════════════════════

Save commit message to `commit-msg.txt`, then commit:

```
git commit -F commit-msg.txt
```

**Commit message body:**

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
Queued in handoff doc as future enhancement, depends on generic 
toolskin.js implementation landing first.

FILE-TREE-EXPLORER TOOL — NEW
Standalone HTML tool for visualizing repo structure with categorized 
file counts, search, dark/light theme, export to JSON, and clickable 
duplicate detection. Generated tool surfaces all 2,012 files / 409 
folders across the repo at once, with category counts (markdown 313, 
images 264, html 263, css 167, js 150, other 132, fonts 103, json 60, 
text 33, archives 18, shell 12, python 4, sheets 2).

Tool files committed:
- tree-explorer.html (the UI)
- tools/scripts/build_tree_full_html-interactive.py (build script)
- tools/scripts/deep_tree_map.py (scanner core)
- tools/scripts/deep_tree_mapv1.py (scanner v1)
- tools/scripts/deep_tree_mapv2-component-extractor.py (scanner v2)

Companion data outputs (tree-explorer.data.json, tree-explorer.dedup.
json) added to .gitignore — these regenerate on each export run.

HANDOFF DOC
docs/toolskin-tree-session-handoff.md — single living doc covering 
the full session in 10 sections: component summary + API, 12 
architecture conventions, full iter 1→10 timeline, owner vs agent 
toolskin.css changes, generator outputs with byte sizes, memory 
entries saved, open tasks split by component/tooling/design-system 
level, where-to-pick-up file pointers, and three recurring 
toolskin.css quirks worth flagging upstream (parser bug at \* */, 
chip --ts-this-bg reassignment, topbar logo uppercase override).

Designed for in-place extension — last line reads "Append new 
sections below this line as work continues."

REORGANIZATION (owner manual moves, this commit acknowledges)
- Deleted obsolete files: PITCH-DECK-COMPONENT-PATTERNS.md, 
  PITCH-DECK-IMPROVEMENTS-LOG.md, toolskin-pitchdeck_recovered-
  ASSHOLE_2.css, toolskin-pitchdeck-v2-refactored.html, 
  index-compare.html (moved to _bu/ locally, gitignored), 
  branding/demos.html (replaced).
- Renamed branding/demos.html → branding/index.html (new production 
  entry point for brand showcase).
- Moved 4 Python scripts from repo root to tools/scripts/ 
  (build_tree_full_html-interactive.py, deep_tree_map.py, 
  deep_tree_mapv1.py, deep_tree_mapv2-component-extractor.py).
- Moved 3 toolskin-deck CSS recovery snapshots from assets/css/ to 
  _sandbox/css-history/ (gitignored).
- Moved _tmp_dedupe_pitchdeck.py to _sandbox/scripts/ (gitignored, 
  decide final home later — the script is a working dedupe utility 
  for pitchdeck/ that classifier blocked from auto-running this 
  session).

.gitignore ADDITIONS
- _bu/ (owner-managed local backup folder)
- pitchdeck/dedupe-filter/ (analysis-only staging area)
- pitchdeck/trash/ (analysis-only staging area)
- tree-explorer.data.json (regenerates on tool export)
- tree-explorer.dedup.json (regenerates on tool export)

NOT IN THIS COMMIT (deferred)
- pitchdeck/ root files (all variants of pitchdeck HTML/CSS/MD) — 
  staged for parallel pitchdeck agent session, see 
  _session-staging/pitchdeck-track/ for the delegation brief and 
  related specs.
- assets/css/toolskin-deck.css — parallel pitchdeck agent's canonical 
  target.
- Hero padding fix — separate next commit.
- apcach Phase 1 audit — separate next commit.
- presets.json curation — separate next commit.
- TypeUI adaptation Phase B (showcase HTML) — separate next commit.
- ANALYZER.html, ANALYZER2.html, DRIVE_EXPLORER.html — owner to 
  classify.

Refs:
- docs/toolskin-tree-session-handoff.md (treemap session, this commit)
- docs/handoffs/_sleep-mode-success.md (prior session, 177fd8a 
  predecessor)
- _session-staging/pitchdeck-track/* (pitchdeck delegation, future)
```

After commit:

```
git log --oneline -5
git status
```

Show output.

═══════════════════════════════════════════════════════════════════════
PHASE 11 — STAND DOWN
═══════════════════════════════════════════════════════════════════════

Session ends here. Working tree should now be clean except for the 
intentionally-deferred untracked items listed in Phase 8.

Owner now decides next move:
1. Hero padding fix (~15 min, owner provides CSS replacement)
2. Dispatch parallel pitchdeck agent in new session
3. apcach Phase 1 audit
4. Other priorities

Do NOT autonomously continue. Wait for owner's next instruction.

═══════════════════════════════════════════════════════════════════════
HARD CONSTRAINTS
═══════════════════════════════════════════════════════════════════════

- NO push
- NO running of _tmp_dedupe_pitchdeck.py or any pitchdeck dedupe
- NO modification of any file beyond what's listed above
- NO auto-format
- NO file deletions (move only)
- NO touching .git/ directly
- NO touching .claude/worktrees/
- NO Desktop Commander tool calls
- NO scope expansion into pitchdeck root files, hero padding, 
  apcach, or any other deferred priority
- If a file appears in git status NOT in this manifest, FLAG to owner 
  before any action

═══════════════════════════════════════════════════════════════════════
END OF BRIEF
═══════════════════════════════════════════════════════════════════════
