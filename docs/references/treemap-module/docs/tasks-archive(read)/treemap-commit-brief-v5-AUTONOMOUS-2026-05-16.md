# Treemap + Tree-Sync AUTONOMOUS Brief v5 — Session 2026-05-16

**Mode:** MINIMAL GATES — owner pastes, walks away, returns to commits landed (or halt file if a real problem hit)
**For:** Claude Desktop, fresh session, working directory `D:\Mis Documentos\Projects\Toolskin Framework\toolskin-showcase`
**Goal:** TWO atomic commits, autonomous execution, owner-screenshot used as visual ground truth for chips strip CSS filtering
**Estimated time:** 20-30 min unattended
**OUTPUT:** Either `docs/handoffs/_session-success-2026-05-16.md` (success) or `docs/handoffs/_session-halt-<phase>.md` (problem)

═══════════════════════════════════════════════════════════════════════
HARD PROHIBITIONS (apply across entire session)
═══════════════════════════════════════════════════════════════════════

- NEVER push (no git push under any circumstances)
- NEVER delete files (move only, to _sandbox/ or _bu/)
- NEVER auto-format any file (no prettier, no formatter on toolskin.css)
- NEVER touch .git/ directly
- NEVER touch .claude/worktrees/
- NEVER use Desktop Commander tool calls
- NEVER expand scope beyond this brief's manifest
- NEVER OVERWRITE owner's custom values in toolskin.css — when in doubt, preserve owner's value
- NEVER autonomously remove `!important` flags from the chips strip rule (cleanup order requires HTML head migration first + core dedup; those are separate future tasks)
- NEVER touch pitchdeck/ root contents, ANALYZER.html, DRIVE_EXPLORER.html, cube-portfolio.html, ts-gallery-demo.html, ts-phantom-portfolio.html, docs/New folder/, docs/PRE-REFACTORING-PLAN-15-04-2025/screenshots-comparisons/, docs/mockup-page_layout-blueprint-design/
- NEVER extend deep_tree_map.py with new flags

If ANY hard prohibition would be violated, HALT immediately and write halt file.

═══════════════════════════════════════════════════════════════════════
HALT PROTOCOL (use whenever something feels off)
═══════════════════════════════════════════════════════════════════════

If at any phase you encounter:
- A file in git status NOT in this brief's manifest
- A merge conflict, lock file, or git error
- Inability to determine which CSS rule is owner's vs deprecated
- A backup file already existing at target path
- Visual screenshot from owner is missing when needed (Phase 3.5)
- Anything that would require autonomous judgment outside this brief

→ STOP IMMEDIATELY. Write halt file to:
`docs/handoffs/_session-halt-<phase-number>-<short-desc>.md`

Halt file MUST contain:
- Phase where halt occurred
- Full context of the problem
- What you tried (if anything)
- What needs owner direction
- git status output at halt time
- List of files modified up to halt (for rollback reference)

Then END SESSION. Do NOT continue. Do NOT commit anything. Owner returns and diagnoses.

═══════════════════════════════════════════════════════════════════════
═══  COMMIT 1 — TREEMAP + TOOL + REORG + CHIPS STRIP CSS FILTERING  ═══
═══════════════════════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════════════════
PHASE 0 — VERIFY STATE (auto-proceed if expected)
═══════════════════════════════════════════════════════════════════════

```
git status
git log --oneline -3
```

Expected at HEAD `177fd8a`. If state differs significantly from this manifest (e.g., HEAD is NOT 177fd8a, or there are commits you didn't expect), HALT.

Expected modifications: toolskin.css, toolskin.js, ts-offcanvas-editor.js, index.html
Expected deletions: 6 files (PITCH-DECK-*.md, branding/demos.html, index-compare.html, toolskin-pitchdeck-v2-refactored.html, toolskin-pitchdeck_recovered-ASSHOLE_2.css)
Expected untracked: tree-explorer.*, deep_tree_map*.py, _tmp_dedupe_pitchdeck.py, branding/index.html, pitchdeck/, docs/toolskin-tree-session-handoff.md, 3 toolskin-deck_*.css recovery files

If matches: auto-proceed. No gate.

═══════════════════════════════════════════════════════════════════════
PHASE 1 — APPEND TO .gitignore (auto)
═══════════════════════════════════════════════════════════════════════

Append:

```
# === 2026-05-16 additions ===

_bu/
pitchdeck/dedupe-filter/
pitchdeck/trash/
tree-explorer.data.json
tree-explorer.dedup.json
```

Verify append landed. Auto-proceed.

═══════════════════════════════════════════════════════════════════════
PHASE 2 — CREATE tools/scripts/ AND MOVE PYTHON SCRIPTS (auto)
═══════════════════════════════════════════════════════════════════════

```
mkdir tools\scripts 2>nul
move "build_tree_full_html-interactive.py" "tools\scripts\"
move "deep_tree_map.py" "tools\scripts\"
move "deep_tree_mapv1.py" "tools\scripts\"
move "deep_tree_mapv2-component-extractor.py" "tools\scripts\"
```

Verify with `dir tools\scripts\*.py` (should show 4 files).

═══════════════════════════════════════════════════════════════════════
PHASE 3 — MOVE _tmp_dedupe + RECOVERY CSS TO SANDBOX (auto)
═══════════════════════════════════════════════════════════════════════

```
mkdir _sandbox\scripts 2>nul
mkdir _sandbox\css-history 2>nul
move "_tmp_dedupe_pitchdeck.py" "_sandbox\scripts\"
move "assets\css\toolskin-deck_RECOVERED.css" "_sandbox\css-history\"
move "assets\css\toolskin-deck_latest-stable.css" "_sandbox\css-history\"
move "assets\css\toolskin-deck_retouched.css" "_sandbox\css-history\"
```

═══════════════════════════════════════════════════════════════════════
PHASE 3.5 — CHIPS STRIP CSS FILTERING (the actual work)
═══════════════════════════════════════════════════════════════════════

Owner-stated objective (verbatim):
> "filter the duplicates from the inline <style> block in the HTML,
> drop them into the existing toolskin.css block WITHOUT overwriting
> owner's customizations, append the missing remaining rules, remove
> the deprecated old-version pieces."

PROCEDURE (mechanical, no design judgment):

3.5.A — IDENTIFY THE TWO SOURCES

  Source A (owner's customized, source-of-truth):
    The @taxonomy_chips_strip block in `assets/css/toolskin.css`.
    Find it by searching for the comment header
    "@taxonomy_chips_strip — KEEP design output identical"
    inside toolskin.css.

  Source B (the inline duplicate to filter):
    The chips strip rules currently in the `<style>` block of
    `tree-explorer.html` (the head-level CSS).

3.5.B — VERIFY OWNER'S SCREENSHOT IS AVAILABLE

  Check if any of these exist:
  - `_bu\screenshot-current-render-2026-05-16.png`
  - `_bu\screenshot-chips-strip-current.png`
  - Any PNG/JPG in `_bu\` dated 2026-05-16

  If found: log filename in the success report. The screenshot is
  owner's reference for "what the current render looks like" and is
  the visual ground truth. You do not need to open it — you only need
  to confirm it exists so owner can verify post-commit.

  If NOT found: HALT — write halt file noting screenshot missing.
  Owner will drop screenshot in _bu/ and re-run.

3.5.C — DIFF THE TWO SOURCES

  For each CSS rule in Source B (tree-explorer.html <style>):

    1. Is the SAME selector present in Source A (toolskin.css)?
       - YES → check declarations:
         - Identical declaration → DELETE from Source B (duplicate)
         - Different declaration → SOURCE A WINS. DELETE from Source B.
           Owner's customization preserved. Do NOT update Source A.
         - Source A has the declaration, Source B has the deprecated
           version → DELETE from Source B.
       - NO selector in Source A → check if it's a future-scope rule
         (animation, transition, focus-visible, accessibility):
         - If it's a clear extension that doesn't conflict with any
           owner customization → ADD to Source A in the appropriate
           location within the existing block, with a comment:
           `/* migrated from tree-explorer.html inline styles 2026-05-16 */`
         - If it's deprecated/unused (e.g., references old class names
           not in current HTML) → DELETE from Source B, do NOT migrate.

  For each CSS rule in Source A (toolskin.css) but NOT in Source B:
    Owner's customization. UNTOUCHED. No action.

3.5.D — DECISION RULE FOR AMBIGUOUS CASES

  If you cannot determine confidently which version is current vs
  deprecated, default to: PRESERVE BOTH for now. Add a comment
  inside Source A marking the ambiguity:
  `/* TODO: owner review — Source B had different value: X */`

  Do NOT delete rules from Source A if uncertain.
  Do NOT add rules to Source A if you can't place them correctly.

3.5.E — PROTECTED OWNER VALUES (from @taxonomy_chips_strip comment)

  These specific declarations MUST survive untouched in Source A.
  If Source B has different values for any of these, IGNORE Source B
  for that property:

  - `--ts-this-bg-grad-dark-pct: 2%` (global dark variant knob)
  - `--_chips-max-w: calc(100% - (var(--ts-chip-size, var(--ts-btn-h)*2)*1))`
    (intentional fallback math — do NOT simplify, do NOT pull
    --ts-chip-size onto this scope)
  - Gradient color-mix percentages (30% transparent, 90% transparent)
  - Fade width `--_-grad-w: 25px`
  - Height `calc(var(--ts-tree-actionbar-h) - 2px)`
  - `--ts-this-bg: var(--ts-bg-1)` surface re-scope
  - `flex-wrap: nowrap`, `min-width: 0`, single-row
  - Border-inline frame using `--ts-this-bg-border`
  - Width-priority: `flex: 1 1 var(--_chips-max-w)`
  - !important flags on gradient/background (KEEP — cleanup order
    requires HTML migration first which IS this phase, but the dedup
    in toolskin.css is a SEPARATE task; do NOT remove !important now)

3.5.F — WRITE THE DIFF SUMMARY

  After applying changes, write a summary to:
  `_sandbox/chips-strip-css-filter-2026-05-16.md`

  Format:
  ```
  # Chips strip CSS filter summary

  ## Source B (tree-explorer.html <style>) — rules removed
  - <selector>: reason (duplicate / deprecated / superseded)
  - ...

  ## Source A (toolskin.css @taxonomy_chips_strip block) — rules added
  - <selector>: source (migrated from inline)
  - ... (or "none — all owner-customized")

  ## Ambiguous cases flagged
  - <selector>: <reason>
  - ... (or "none")

  ## Owner-protected values verified intact
  - all 10 protected declarations from @taxonomy_chips_strip comment
    confirmed present in toolskin.css block
  ```

═══════════════════════════════════════════════════════════════════════
PHASE 4 — ACKNOWLEDGE 6 DELETIONS (auto)
═══════════════════════════════════════════════════════════════════════

```
git add -u
```

═══════════════════════════════════════════════════════════════════════
PHASE 5 — STAGE PRODUCTION CHANGES (auto)
═══════════════════════════════════════════════════════════════════════

```
git add assets/css/toolskin.css
git add assets/js/toolskin.js
git add assets/js/ts-offcanvas-editor.js
git add index.html
git add tree-explorer.html
git add tools/scripts/build_tree_full_html-interactive.py
git add tools/scripts/deep_tree_map.py
git add tools/scripts/deep_tree_mapv1.py
git add tools/scripts/deep_tree_mapv2-component-extractor.py
git add docs/toolskin-tree-session-handoff.md
git add branding/index.html
git add .gitignore
```

═══════════════════════════════════════════════════════════════════════
PHASE 6 — SELF-REVIEW STAGED DIFF (auto)
═══════════════════════════════════════════════════════════════════════

Run:
```
git status
git diff --staged --stat
```

Verify:
- ~18 files staged (16 production + 6 deletions accounted for)
- toolskin.css shows changes (treemap + chips strip filter)
- tree-explorer.html shows changes (filtered <style> block)
- No file from "Leave Untracked" list below appears in staged

LEAVE UNTRACKED (do NOT stage):
- assets/css/toolskin-deck.css (parallel pitchdeck agent's territory)
- assets/js/toolskin - Copy.js (backup)
- pitchdeck/ (all root contents)
- ANALYZER.html, ANALYZER2.html, DRIVE_EXPLORER.html
- cube-portfolio.html, ts-gallery-demo.html, ts-phantom-portfolio.html
- docs/# NON-DESTRUCTIVE REFACTOR PROTOCOL PROMPT - TOOLS.md
- docs/New folder/
- docs/PRE-REFACTORING-PLAN-15-04-2025/screenshots-comparisons/* untracked
- docs/mockup-page_layout-blueprint-design/
- docs/handoffs/_pending-task-toast-commit-message.md (session record)
- docs/handoffs/_sleep-mode-success.md (session record)
- tree-explorer.data.json, tree-explorer.dedup.json (gitignored)

If anything is staged that shouldn't be → HALT.

═══════════════════════════════════════════════════════════════════════
PHASE 7 — COMMIT 1 (auto)
═══════════════════════════════════════════════════════════════════════

Save commit message to `commit-msg-1.txt`:

```
feat(tree): treemap iter 1-10 + chips strip CSS filter + file-tree-explorer tool

TREEMAP COMPONENT — HEADLINE
Ten-iteration component build culminating in a stable treemap with
muted-chip idle state, single-row chips strip with horizontal scroll +
mask-image edge-fade overflow hint, and an architecture handoff doc
designed for in-place extension.

Key fixes:
- Chip idle color hijack defeated via scoped --ts-this-bg reset
  (toolskin.css line 7567 reassigns --ts-this-bg: var(--ts-accent)
  on chips, cascading border color from accent; reset to --ts-bg-0
  inside contextual selector, idle pinned to muted tokens, idle
  resolves to rgb(109, 111, 116) = --ts-text-muted, active wins via
  [aria-selected=true]).
- Overflow handling — bounded flex slot + mask-image edge-fade hints
  scrollability without chrome. Action bar 60px, chip strip layout
  417px / scroll 1214px, chipOverflows: true.
- flex-wrap regression — caught .ts-chips inheriting flex-wrap: wrap
  from toolskin.css; forced flex-wrap: nowrap on the strip.

CHIPS STRIP CSS FILTER
Filtered the inline <style> block in tree-explorer.html against the
@taxonomy_chips_strip canonical block in assets/css/toolskin.css.
Duplicates removed from HTML. Deprecated rules from old version
removed from HTML. Missing extension rules migrated to toolskin.css
(if any). Owner's customized values preserved untouched per
@taxonomy_chips_strip comment.

The @taxonomy_chips_strip preserved-as-written design contract is
documented inline in toolskin.css to protect against future
"improvements". Cleanup order honored (HTML head migration this
commit; core .ts-chips dedup + !important removal deferred to
separate future session).

Diff summary: _sandbox/chips-strip-css-filter-2026-05-16.md

FILE-TREE-EXPLORER TOOL — NEW
Standalone HTML tool visualizing 2,012 files / 409 folders across
the repo with categorized counts (markdown 313, images 264,
html 263, css 167, js 150, other 132, fonts 103, json 60, text 33,
archives 18, shell 12, python 4, sheets 2), search, dark/light
theme, export, dedup detection.

Tool files:
- tree-explorer.html
- tools/scripts/build_tree_full_html-interactive.py
- tools/scripts/deep_tree_map.py
- tools/scripts/deep_tree_mapv1.py
- tools/scripts/deep_tree_mapv2-component-extractor.py

Data outputs (tree-explorer.data.json, .dedup.json) gitignored.

HANDOFF DOC
docs/toolskin-tree-session-handoff.md — 10 sections, in-place
extension pattern.

REORGANIZATION
- Deleted obsolete: PITCH-DECK-*.md, toolskin-pitchdeck_recovered-
  ASSHOLE_2.css, toolskin-pitchdeck-v2-refactored.html,
  index-compare.html, branding/demos.html (replaced by index.html).
- Renamed branding/demos.html -> branding/index.html.
- Moved 4 Python scripts root -> tools/scripts/.
- Moved 3 CSS recovery snapshots -> _sandbox/css-history/.
- Moved _tmp_dedupe_pitchdeck.py -> _sandbox/scripts/.

.gitignore: _bu/, pitchdeck/dedupe-filter/, pitchdeck/trash/,
tree-explorer.data.json, tree-explorer.dedup.json.

NEXT COMMIT IN THIS SESSION
Tree-sync protocol doc + CLAUDE.md rule (autonomous).

NOT IN THIS SESSION (queued for future)
- Python extension to deep_tree_map.py (--summary, --diff-git)
- pitchdeck/ root files (parallel pitchdeck agent)
- Hero padding fix
- apcach Phase 1 audit
- presets.json curation
- TypeUI Phase B
- ANALYZER.html, ANALYZER2.html, DRIVE_EXPLORER.html
- Chips strip refactor follow-ups (truncation dropdown, !important
  cleanup post-HTML-migration + core dedup, .ts-scrollstrip global,
  container-query sibling shrink)

Refs:
- docs/toolskin-tree-session-handoff.md
- docs/handoffs/_sleep-mode-success.md (prior, 177fd8a)
- @taxonomy_chips_strip comment in assets/css/toolskin.css
- _sandbox/chips-strip-css-filter-2026-05-16.md
```

```
git commit -F commit-msg-1.txt
```

Capture commit hash. Verify:
```
git log --oneline -3
git status
```

═══════════════════════════════════════════════════════════════════════
═══  COMMIT 2 — TREE-SYNC PROTOCOL DOC + CLAUDE.md RULE             ═══
═══════════════════════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════════════════
PHASE 8 — VERIFY PROTOCOL DOC EXISTS (auto)
═══════════════════════════════════════════════════════════════════════

```
dir _session-staging\tree-sync-protocol.md
```

If found: continue.
If not found: HALT.

═══════════════════════════════════════════════════════════════════════
PHASE 9 — MOVE PROTOCOL DOC TO docs/handoffs/ (auto)
═══════════════════════════════════════════════════════════════════════

```
move "_session-staging\tree-sync-protocol.md" "docs\handoffs\tree-sync-protocol.md"
```

═══════════════════════════════════════════════════════════════════════
PHASE 10 — APPEND CLAUDE.md RULE (auto)
═══════════════════════════════════════════════════════════════════════

Append to `CLAUDE.md`:

```markdown

## File-Tree-Explorer Protocol

This repo includes a file-tree-explorer tool at `tree-explorer.html`
with scanners at `tools/scripts/deep_tree_map*.py`. Agents working on
this repo MUST use it as ground truth for filesystem state,
complementing (not replacing) `git status`.

**Session start rule:** If a session involves filesystem changes,
verify the current tree state. Currently: run `git status` and
reconcile against owner's expectation. (Future: `python tools/scripts/deep_tree_map.py --summary` once that flag lands — see docs/handoffs/tree-sync-protocol.md.)

**Discovery rule:** If a file appears in `git status` you can't account
for, query the tree for category/origin before guessing. Open
`tree-explorer.html` for visual inspection, or read
`tree-explorer.dedup.json` (gitignored) for dedup groups.

**Dedup rule:** If you detect duplicate-looking filenames, load
`tree-explorer.dedup.json` to check dedup groups. Surface to owner.
Never auto-move duplicates without explicit owner approval.

**Anti-pattern:** Never load the full `tree-explorer.data.json`
(~1.4 MB) into agent context. Read it selectively or use the
forthcoming `--summary` flag.

**Full spec:** `docs/handoffs/tree-sync-protocol.md`
```

═══════════════════════════════════════════════════════════════════════
PHASE 11 — STAGE COMMIT 2 (auto)
═══════════════════════════════════════════════════════════════════════

```
git add docs/handoffs/tree-sync-protocol.md
git add CLAUDE.md
```

═══════════════════════════════════════════════════════════════════════
PHASE 12 — COMMIT 2 (auto)
═══════════════════════════════════════════════════════════════════════

Save commit message to `commit-msg-2.txt`:

```
docs(protocol): tree-sync protocol + CLAUDE.md rule for agent ground truth

PROTOCOL DOC
docs/handoffs/tree-sync-protocol.md — defines how agents use the
file-tree-explorer tool to verify repo state. Three-tier architecture
(summary / diff / full) to avoid burning agent context on the 1.4 MB
tree JSON.

Key rules:
- Session start: agent uses git status + (future) tree summary
- Discovery: agent cross-references tree before guessing
- Dedup: agent surfaces findings, never auto-moves
- Anti-pattern: never load full tree-explorer.data.json into context

CLAUDE.md UPDATE
Added "File-Tree-Explorer Protocol" section with rule summary +
pointer to full spec. Future agents reading CLAUDE.md follow the
rule even before Python extension lands.

NOT IN THIS COMMIT (future)
- Python extension to deep_tree_map.py with --summary, --diff-git
  (30-60 min focused session)
- Session-brief template update (depends on Python extension)

Refs:
- docs/handoffs/tree-sync-protocol.md
- Previous commit: treemap + tool + chips strip filter (see git log)
```

```
git commit -F commit-msg-2.txt
```

Capture commit hash.

═══════════════════════════════════════════════════════════════════════
PHASE 13 — CLEANUP TEMP FILES (auto)
═══════════════════════════════════════════════════════════════════════

```
del commit-msg-1.txt 2>nul
del commit-msg-2.txt 2>nul
```

═══════════════════════════════════════════════════════════════════════
PHASE 14 — WRITE SUCCESS REPORT (auto)
═══════════════════════════════════════════════════════════════════════

Write `docs/handoffs/_session-success-2026-05-16.md`:

```markdown
# Session Success Report — 2026-05-16

## Commits landed (master, not pushed)

| Hash | Subject | Files |
|---|---|---|
| <hash-1> | feat(tree): treemap iter 1-10 + chips strip CSS filter + file-tree-explorer tool | ~18 |
| <hash-2> | docs(protocol): tree-sync protocol + CLAUDE.md rule | 2 |

## Phase summary

- Phase 0-7: COMMIT 1 — treemap + tool + reorg + chips strip CSS filter
- Phase 8-12: COMMIT 2 — protocol doc + CLAUDE.md rule
- Phase 13: temp file cleanup
- Phase 14: this report

## Chips strip CSS filter result

Detailed diff in `_sandbox/chips-strip-css-filter-2026-05-16.md`.

Summary:
- Source B (tree-explorer.html <style>) rules removed: <count>
- Source A (toolskin.css block) rules added: <count>
- Ambiguous cases flagged: <count>
- Owner-protected values intact: 10/10 verified

## Owner visual verification (do tomorrow morning)

1. Open `tree-explorer.html` in browser
2. Compare against owner's screenshot in `_bu/` (referenced: <filename>)
3. Walk 10 states from the @taxonomy_chips_strip preserved factors
   (light/dark × empty/populated × scrolled/unscrolled + active chip + resize)
4. If anything looks different from screenshot: file a fix as
   follow-up commit. No revert needed — owner-protected values are
   in the CSS, render should match.

## Working tree post-commit

```
<output of git status>
<output of git log --oneline -5>
```

## Pending next session

- Python extension to deep_tree_map.py (--summary, --diff-git flags)
- Hero padding fix (~15 min)
- Parallel pitchdeck agent dispatch
- apcach Phase 1 audit (~1 hour)
- presets.json curation
- TypeUI Phase B (showcase HTML)
- Chips strip refactor follow-ups (truncation dropdown,
  !important cleanup, .ts-scrollstrip global, CQ sibling shrink)
- Address ambiguous cases flagged in chips strip filter (if any)

## Constraints upheld

- No push
- No file deletions (moves only)
- No auto-format
- No !important removal (deferred — cleanup order requires core
  dedup first)
- No scope expansion
- No Desktop Commander tool calls
- Owner-protected @taxonomy_chips_strip values preserved
```

Fill in the placeholders (`<hash-1>`, `<count>`, `<filename>`, etc.) with actual values.

═══════════════════════════════════════════════════════════════════════
PHASE 15 — STAND DOWN (auto)
═══════════════════════════════════════════════════════════════════════

Session complete. End here. No further actions.

Do NOT push. Do NOT continue with any deferred task. Do NOT initiate
new work.

═══════════════════════════════════════════════════════════════════════
END OF BRIEF
═══════════════════════════════════════════════════════════════════════
