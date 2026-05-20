# Tree-Sync Protocol — Agent Rule

**Purpose:** Standardize how Claude Code agents use the file-tree-explorer tool to verify repo state against the working filesystem. Prevents agent-inferred file taxonomies, missed untracked files, and ghost-state assumptions.

**Tool:** `tree-explorer.html` + `tools/scripts/deep_tree_map.py` (committed in this repo)

**Outputs:**
- `tree-explorer.data.json` (full tree, ~1.4 MB, gitignored)
- `tree-explorer.dedup.json` (dedup groups, gitignored)

---

## When to use which tier

### Tier 1 — Session start (MANDATORY)

At the start of every session that touches the filesystem, the agent runs:

```
python tools/scripts/deep_tree_map.py --summary --output _session/tree-summary.json
```

This produces a **compact summary** (~2-5 KB):

```json
{
  "generated_at": "2026-05-16T14:32:00Z",
  "total_files": 2012,
  "total_folders": 409,
  "by_category": {
    "markdown": 313,
    "images": 264,
    "html": 263,
    "css": 167,
    "js": 150,
    "json": 60,
    "python": 4
  },
  "recently_modified_24h": [
    "assets/css/toolskin.css",
    "index.html",
    "..."
  ],
  "new_files_since_last_commit": [
    "...path..."
  ],
  "deleted_files_since_last_commit": [
    "...path..."
  ],
  "dedup_groups_count": 375,
  "untracked_count": 25,
  "modified_count": 4
}
```

Agent reads this. Reports to owner: "Session start: N untracked, M modified, X recently-changed in last 24h." 

If anomaly detected (e.g., owner expected 5 modifications, summary shows 50), agent halts and surfaces.

### Tier 2 — Git status anomaly (CONDITIONAL)

When `git status` reports something unexpected, agent runs a diff query:

```
python tools/scripts/deep_tree_map.py --diff-git --output _session/tree-diff.json
```

This compares disk against git index and produces a **focused report** (~5-20 KB):
- Files on disk not in git
- Files in git not on disk
- Files modified vs HEAD
- Files in `.gitignore` but still present (intentional)

Agent reads this. Cross-references with task manifest. Surfaces discrepancies.

### Tier 3 — Full tree (ON-DEMAND ONLY)

If a specific folder needs full inspection (e.g., "what's actually in `pitchdeck/`?"), agent reads from `tree-explorer.data.json` selectively:

```python
# Pseudo-pattern for agent:
load tree-explorer.data.json
find node where name == "pitchdeck"
return its children only (not the full 2012-file tree)
```

NEVER load the full 1.4 MB JSON into agent context. Always traverse to the relevant subtree.

---

## Trigger conditions

### Regenerate the tree when:

1. Session starts and last `tree-explorer.data.json` mtime > 30 minutes old
2. After any `git mv`, `git rm`, or batch file move operation
3. Before any "verify state" gate in a multi-phase brief
4. After unzip, untar, or any bulk import

### Do NOT regenerate when:

1. Tree was generated within the last 5 minutes and no file ops happened
2. Agent is in a read-only inspection task
3. Owner explicitly says "use cached tree"

---

## Integration with session briefs

Every session brief's **Phase 0** should now include the tree-sync as a sub-step:

```
PHASE 0 — VERIFY STATE
  0.A — git status
  0.B — tree-sync summary (if last summary >30min old)
  0.C — compare counts: report any discrepancy to owner

If 0.A and 0.B agree on file count: proceed.
If they disagree: surface delta, owner decides before proceeding.
```

This adds ~10 seconds to session start. Saves hours of mid-session "where did this file come from?" recovery.

---

## Dedup integration

The dedup report (`tree-explorer.dedup.json`) is loaded on-demand when:
- Agent encounters a file with `(1)`, `- Copy`, `BROKEN`, `RECOVERED`, `ASSHOLE`, `CLONE` markers
- Agent suspects duplication during housekeeping
- Owner explicitly asks "are there duplicates of X?"

Pattern:
```python
load tree-explorer.dedup.json
find group containing file X
report all members + recommended canonical
```

Never run autonomous dedup moves. Surface findings, owner approves.

---

## Anti-patterns (what NOT to do)

❌ **Don't load full `tree-explorer.data.json` into agent context every turn.** Token cost is ~350-500K. Burns context budget.

❌ **Don't trust the tree summary as "what's in git."** Tree shows the filesystem. Git is the source of truth for tracked state. Use both, cross-reference.

❌ **Don't regenerate the tree mid-task without reason.** Each regenerate is 10 sec of agent time. Cache aggressively.

❌ **Don't infer file taxonomy from filenames alone.** Use the tree's category + dedup data to confirm.

❌ **Don't run the tree generator while another file-op is in progress.** Race condition — tree captures a torn state.

---

## Minimal CLAUDE.md addition

Add this section to the project's `CLAUDE.md`:

```markdown
## File-Tree-Explorer Protocol

This repo includes a file-tree-explorer tool at `tree-explorer.html` 
with scanner at `tools/scripts/deep_tree_map.py`. Agents working on 
this repo MUST use it as ground truth for filesystem state.

**Session start rule:** Run tree summary if last summary is >30 min 
old or if any session has done file ops since last summary.

**Discovery rule:** If a file appears in `git status` that you can't 
account for, query the tree for its category/origin before guessing.

**Dedup rule:** If you detect duplicate-looking filenames, load 
`tree-explorer.dedup.json` to check the dedup groups. Surface to 
owner. Never auto-move duplicates without explicit owner approval.

**Full spec:** docs/tree-sync-protocol.md
```

---

## Implementation steps (next session)

To make this fully operational:

1. **Extend `deep_tree_map.py`** to support `--summary` and `--diff-git` flags
   - `--summary` outputs the compact JSON in Section "Tier 1" above
   - `--diff-git` outputs the diff JSON in Section "Tier 2" above
   - Reuses the existing scanner core, just adds output formatters

2. **Add the CLAUDE.md section** (text above)

3. **Update session-brief template** to include Phase 0.B tree-sync check

4. **Test on next session** — measure actual time savings vs current "agent guesses" pattern

5. **Document in `docs/handoffs/pending-modular-integration.md`** as a completed item

---

## What this gives you

| Before | After |
|---|---|
| Agent assumes file state from chat history | Agent verifies against actual filesystem |
| Mystery untracked files cause halts | Tree shows them with category + path |
| Duplicate files accumulate silently | Dedup report makes them visible |
| Owner repeats "what's in pitchdeck/?" 5 times per session | Tree summary answers in 2 KB |
| 30 min of mid-session "wait, where did this come from?" | 10 sec of session-start verification |

End of protocol spec.
