═══════════════════════════════════════════════════════════════════════
GATE 2 — ANSWERS LOCKED, PROCEED TO PHASE C
═══════════════════════════════════════════════════════════════════════

## B.6 — Editor: Cursor + Sublime Text 3

I use both editors. Below are exact disable paths for each. Once I confirm disabled in both, B.6 row in B.11 table is "DISABLED on Cursor + Sublime Text 3 + Chrome DevTools."

### CURSOR — disable format-on-save

**Method 1 — Settings UI (global):**
1. Open Cursor
2. `Ctrl+,` (or `File > Preferences > Settings`)
3. Search bar: `format on save`
4. Uncheck `Editor: Format On Save`
5. Search: `format on save mode`
6. Set to `file` (not `modifications`) — prevents partial format on save

**Method 2 — Per-repo settings.json (recommended, travels with repo):**

Create `.vscode/settings.json` in `toolskin-rebuild/` with:
```json
{
  "editor.formatOnSave": false,
  "editor.formatOnPaste": false,
  "editor.formatOnType": false,
  "[css]": {
    "editor.formatOnSave": false,
    "editor.defaultFormatter": null
  },
  "[html]": {
    "editor.formatOnSave": false,
    "editor.defaultFormatter": null
  },
  "[javascript]": {
    "editor.formatOnSave": false,
    "editor.defaultFormatter": null
  },
  "files.trimTrailingWhitespace": false,
  "files.insertFinalNewline": false,
  "files.trimFinalNewlines": false
}
```

Cursor reads `.vscode/settings.json` (it's a VS Code fork). This config is per-repo so it can't leak into other projects. Commit it as part of the Session 1 baseline.

### SUBLIME TEXT 3 — disable format-on-save

Sublime doesn't have format-on-save by default — but if you have plugins installed (Prettier, JsFormat, CSS-Format, etc.), they each have their own toggle.

**Check installed packages:**
1. `Ctrl+Shift+P` (Command Palette)
2. Type: `Package Control: List Packages`
3. Look for: `Prettier`, `JsPrettier`, `CSSFormat`, `SublimePrettier`, `JsFormat`, `HTML-CSS-JS Prettify`, `CodeFormatter`, `AutoFormat`

**For each one found, disable auto-format-on-save:**

- **JsPrettier:** `Preferences > Package Settings > JsPrettier > Settings - User` — set `"auto_format_on_save": false`
- **Prettier (regular):** `Preferences > Package Settings > Prettier > Settings - User` — set `"auto_format_on_save": false`
- **HTML-CSS-JS Prettify:** `Preferences > Package Settings > HTML-CSS-JS Prettify > Set Prettify Preferences` — find `"format_on_save"` and set to `false`
- **CodeFormatter:** `Preferences > Package Settings > CodeFormatter > Settings - User` — set `"format_on_save": false`
- **AutoFormat:** `Preferences > Package Settings > AutoFormat > Settings - User` — set `"on_save": false`

If none installed: Sublime is safe by default, no action needed.

**Also disable Sublime's own trim-whitespace-on-save (which can corrupt CSS):**

`Preferences > Settings` → in User settings file, ensure:
```json
{
  "trim_trailing_white_space_on_save": false,
  "ensure_newline_at_eof_on_save": false,
  "translate_tabs_to_spaces": false
}
```

### CHROME DEVTOOLS — disable workspace live-edit

This is the one that wrote back to disk in inspector and corrupted toolskin.css before.

**Disable workspace folder mapping:**
1. Open Chrome DevTools (F12 on the showcase page)
2. Click ⚙️ gear icon (top-right of DevTools panel) → opens DevTools Settings
3. Left sidebar → **Workspace**
4. If `toolskin-rebuild/` OR `toolskin-showcase/` is listed: click the **X** to remove it
5. Verify the list is empty for the Toolskin Framework folder

**Additionally, disable "Sync changes back to filesystem":**
1. DevTools Settings → **Preferences** tab (left sidebar)
2. Section: **Sources**
3. UNCHECK: `Enable persistent authoring` (if present, varies by Chrome version)
4. UNCHECK: `Auto-save changes to local files` (if present)
5. UNCHECK: `Search in anonymous and content scripts` (not critical but reduces accident surface)

**Belt and suspenders — disable Sources editing entirely while doing rebuild work:**
- DevTools Settings → **Preferences** → Sources section
- UNCHECK `Allow scrolling past end of file`
- This won't disable editing but you can also press `Ctrl+Z` to undo any accidental edit before save

═══════════════════════════════════════════════════════════════════════
B.6 — REPORT BACK WHEN DONE
═══════════════════════════════════════════════════════════════════════

Once disabled in all three (Cursor + Sublime + DevTools), reply with:

```
B.6 confirmed:
- Cursor format-on-save: DISABLED via .vscode/settings.json (committed in Phase F)
- Sublime Text 3: <plugin name + setting> or "no formatter plugins, safe by default"
- Chrome DevTools workspace: NO folder mappings, persistent authoring OFF
```

Agent updates B.11 row + commits `.vscode/settings.json` in Phase F.

═══════════════════════════════════════════════════════════════════════
ANSWERS TO Q3 + Q4 (FOR THE AGENT)
═══════════════════════════════════════════════════════════════════════

## Q3 — Snyk Med-Risk skills

**SKIP audit. Proceed to Phase C.** Skills sit dormant until invoked. Audit on first use per skill.

Add to `docs/handoffs/_in-house-skills-update-todo.md` under a NEW section "Pre-first-use audits":

```markdown
## Pre-first-use audits (Snyk Med-Risk flagged)

Before first invocation of each of these, read the SKILL.md + any scripts:

- [ ] browser-qa (likely touches filesystem for UI testing)
- [ ] configure-ecc (may write to settings)
- [ ] design-system (Mode 1 generative scripts — Mode 1 OFF-LIMITS per file 05, but read before Mode 2 audit too)

If audit reveals concerning patterns, remove or quarantine the skill.
```

## Q4 — Proceed to Phase C

**Yes — proceed immediately after B.6.**

═══════════════════════════════════════════════════════════════════════
PHASE C — QUEUE ALL DOCUMENTS
═══════════════════════════════════════════════════════════════════════

After B.6 confirms disabled, execute Phase C per file 01 (v5 brief) Step C.1.

Create `docs/handoffs/_session-1-rebuild-queue.md` with:

- All 14 CONVERSATION RULES verbatim at top
- Rule 15 (apcach color authority) appended verbatim
- All primary architecture sources (paths relative to new repo, using `../toolskin-showcase/`)
- All domain-specific sources for each Wave 2 sub-agent (S1-S6)
- The newly-migrated in-house skills referenced as Tier 1 authority for color/design/typography questions
- State sources (git log, _bu/ artifacts, session-state file)

Then validate every listed source exists. Report missing.

═══════════════════════════════════════════════════════════════════════
TWO ADDITIONS TO _in-house-skills-update-todo.md BEFORE PHASE C
═══════════════════════════════════════════════════════════════════════

The owner flagged these — add them to the existing todo doc before Phase C:

```markdown
## Naming collision documentation

There are TWO skills with similar names — they are DIFFERENT skills:

- `.claude/skills/design-tokens/` — julianoczkowski's generic design-tokens workflow skill (Tier 2 — workflow)
- `.claude/skills/design-tokens-2.0/` — IN-HOUSE Toolskin token rules (Tier 1 — AUTHORITATIVE for Toolskin colors/tokens)

When a question is Toolskin-specific (any --ts-* token, surface superposition, derivative chain, OKLCH math, apcach integration), use `design-tokens-2.0`. When a question is generic design-token methodology, `design-tokens` is fine but lower priority.

Encode this distinction in the toolskin-architecture skill (Phase E SKILL.md).

## project-builder retrieval (deferred to Session 1.5)

The fourth in-house skill `project-builder` was NOT found on Windows disk during B.9.1 location search. It exists in Claude.ai's cloud sandbox (`/mnt/skills/user/project-builder/`).

To retrieve in a future Claude.ai session:
1. Open a chat with access to `/mnt/skills/user/`
2. Bundle the skill via the artifact system or zip it manually
3. Download to local Windows path
4. Copy to `.claude/skills/project-builder/` in toolskin-rebuild

LOW PRIORITY for the rebuild — project-builder is for scaffolding new project structures, and the rebuild repo is already scaffolded (Phase A.4). Defer to Session 1.5 or later.
```

═══════════════════════════════════════════════════════════════════════
EXECUTION ORDER
═══════════════════════════════════════════════════════════════════════

1. Owner disables format-on-save in Cursor + Sublime + Chrome DevTools per paths above
2. Owner reports back "B.6 confirmed: [status]"
3. Agent updates B.11 row + writes `.vscode/settings.json` to new repo
4. Agent appends Snyk audit + naming collision + project-builder retrieval items to `_in-house-skills-update-todo.md`
5. Agent begins Phase C — queue all docs
6. Halt at Gate 3 (queue review)
7. Phase D Wave 1 dispatch (T1+T2+T3 block layer engineering)
8. Halt at Gate 4 (CRITICAL — block typology + reusable base + adaptive integration locked)
9. Phase D Wave 2 dispatch (S1-S6 domain specialists)
10. Halt at Gate 5
11. Phase E (build toolskin-architecture skill)
12. Halt at Gate 6
13. Phase F (first commit)
14. Halt at Gate 7

═══════════════════════════════════════════════════════════════════════
REMINDER BINDINGS
═══════════════════════════════════════════════════════════════════════

- 14 CONVERSATION RULES + Rule 15 in effect
- File 07 repo binding (toolskin-rebuild canonical, toolskin-showcase read-only reference)
- Never modify any file in ../toolskin-showcase/
- Agent owns interactive installs (no owner pickers)
- Halt on anomaly

Awaiting B.6 confirmation, then begin Phase C.
