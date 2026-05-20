# TASK — Tree-explorer popover migration + cleanup (single session, no multi-phase)

You are doing one focused session. Read this entire brief before touching any file. Do not invent extra steps. The plan is the 7 steps below — execute them in sequence, pausing only at the explicit confirmation points. Do not consult git remote or any branch. Local files only. Local `git add` (staging) is permitted at the end as specified.

## PRIME DIRECTIVE — READ TWICE

The user's design refinements in `toolskin.css` are the SOURCE OF TRUTH and have ABSOLUTE PRIORITY. The extracted file `toolskin-tree-component-extracted.css` is a snapshot of what is currently inline in the HTML `<head>` — it is LOWER priority and exists only as a reference for declarations that have not been migrated yet. NEVER overwrite the user's stylesheet values with values from the extracted file. NEVER roll back any manual refinement. If the two disagree on a property, the stylesheet wins. Every time.

If you find yourself about to "improve," "clean up," or "normalize" a value in `toolskin.css` that the user already set — STOP. That value is intentional.

## TIMESTAMP CONVENTION

The `{timestamp}` in backup filenames must be the EXACT format `YYYYMMDD-HHMM` where the time is local system time at backup creation. Example: `20260516-1845`. Do not use ISO 8601, no separators other than the dash, no seconds, no UTC offsets.

## FILES

- Stylesheet (source of truth, edit here):
  `D:\Mis Documentos\Projects\Toolskin Framework\toolskin-showcase\assets\css\toolskin.css`
  Relevant block lives around line 32003 — the previously-migrated treemap section. The popover comment block is appended right after it.

- HTML to clean (delete inline styles here, do not touch markup or scripts):
  `D:\Mis Documentos\Projects\Toolskin Framework\toolskin-showcase\tree-explorer.html`

- Reference snapshot (READ ONLY — lower priority, never copy values blindly):
  `D:\Mis Documentos\Projects\Toolskin Framework\toolskin-showcase\assets\css\toolskin-tree-component-extracted.css`

- Backup destination (required before any edit):
  `D:\Mis Documentos\Projects\Toolskin Framework\toolskin-showcase\_bu\`

## BACKUPS — FIRST ACTION, NO EXCEPTIONS

Before editing anything, copy these three files into `_bu\` with a timestamp suffix in the format defined above:
- `toolskin.css` → `_bu\toolskin.{timestamp}.css`
- `tree-explorer.html` → `_bu\tree-explorer.{timestamp}.html`
- `toolskin-tree-component-extracted.css` → `_bu\toolskin-tree-component-extracted.{timestamp}.css`

Also save the current treemap+popover block from `toolskin.css` (lines around 32003 through the end of the popover comment block) as a standalone snapshot:
`_bu\treemap-popover-block.{timestamp}.css`

Verify `_bu\` exists before copying (use `dir _bu` or `Test-Path _bu`). If it doesn't, create it: `mkdir _bu`.

## STEP 1 — QUICK LOCAL DIFF (no repo, no git)

Read all three files into context. Then produce a SHORT diff report in chat — do not write it to disk. The diff has exactly three columns of concern:

1. **KEEP ALIVE** — declarations in `toolskin.css` (the popover block, currently commented out) that the user has refined. These are immovable.
2. **MIGRATE IN** — declarations present in `toolskin-tree-component-extracted.css` that are NOT yet in the `toolskin.css` popover block. These are candidates to add.
3. **DELETE FROM HTML** — every popover-related rule currently in the `<style>` tag of `tree-explorer.html`. All of it goes.

Special attention — these values in `toolskin.css` are user-set and must NOT be reverted to whatever the extracted file says:

- `padding: var(--ts-sp-1)` with the inline `--ts-sp-1: 00px` override on `.ts-tree-popover`
- `background: var(--ts-this-bg-dim-2)` on `.ts-tree-popover`
- `box-shadow: var(--ts-shadow-4)` on `.ts-tree-popover`
- `font-family: var(--ts-font-mono)` on `.ts-tree-popover`
- `backdrop-filter: blur(var(--ts-backdrop-blur))` on `.ts-tree-popover`
- `--ts-this-bg: var(--ts-bg-0)` override on `.ts-tree-popover`
- `border: 0px solid var(--ts-this-bg-border)` and `--ts-radius-xs: 0` on `.ts-tree-popover__item`
- The `:not(:last-child, :has(+ .ts-tree-popover__sep))` rule with `border-bottom-width: 0px`
- `margin: var(--ts-sp-1, 4px) 0` with the inline `--ts-sp-1: 0px` override on `.ts-tree-popover__sep`

If the extracted file has different values for ANY of the above, those extracted values are obsolete — ignore them.

Conversely, watch for declarations in the extracted file that DO need to come in: any rule, selector, or property not present in the `toolskin.css` block at all. Common candidates are positioning helpers, transition states, focus-visible rings, or accessibility attributes that the user hasn't touched yet. Bring those in.

**PAUSE after this diff report and wait for the user to confirm before proceeding.** If the user says "go," continue to Step 2. This is the only mandatory pause in the session — Steps 2-7 then run sequentially without further prompts.

## STEP 2 — UNCOMMENT AND CONSOLIDATE THE POPOVER BLOCK IN `toolskin.css`

The popover block in `toolskin.css` is currently wrapped in a `/* ... */` comment with a staged-for-review header. Once Step 1 is confirmed:

1. Remove the outer `/* ============================================================================ ... CODE  (do not modify values without approval) ... ============================================================================ */` wrapper so the CSS rules become live.
2. Convert the inline `NOTE:` markers inside the rules (e.g. `NOTE: hardforced, eliminate per note #1`) into proper `/* */` inline comments — but keep the notes themselves, the user wants the trail of why those overrides exist.
3. Add the un-migrated declarations from the extracted file in Step 1's MIGRATE IN column. Place them inside the existing `.ts-tree-popover`, `.ts-tree-popover__item`, etc. rules — do NOT create new selectors unless the extracted file has a selector that genuinely does not exist in the current block.
4. Collapse the two duplicate `.ts-tree-popover__item:not(:last-child, :has(+ .ts-tree-popover__sep))` rules into ONE rule. Same selector, same property, no reason for two.
5. Keep the GENERAL REFACTOR RULES comment block at the top of the section intact — that's the user's reference header.
6. Keep the OWNER REFACTOR NOTES `@treeap_adjust_and_migrate` header at the very top intact.

## STEP 3 — REPORT THE THREE HARDFORCED TOKEN OVERRIDES (do not auto-replace)

The HTML cleanup in Step 4 removes the head-level styles, so the `!important`-avoidance reason for these overrides goes away. The three overrides scheduled for elimination are:

- `--ts-sp-1: 00px;` inside `.ts-tree-popover`
- `--ts-this-bg: var(--ts-bg-0);` inside `.ts-tree-popover`
- `--ts-sp-1: 0px;` inside `.ts-tree-popover__sep`

**DO NOT autonomously choose replacements.** For each of the three, do the following:

1. Inspect `toolskin.css` to find the relevant token's existing definition in the scale (e.g. is there a `--ts-sp-0`? what does `--ts-this-bg` inherit from in this scope?).
2. Report the findings to the user in chat as a small table:

   | Override | Current effect | Equivalent token in scale | Recommendation |

3. Wait for the user to specify the replacement for each override. The user picks; you do not.
4. Apply the user's chosen replacement.
5. If the user says "leave as-is for this one," add a `/* TODO: tokenize properly */` comment next to it and move on.

DO NOT guess. DO NOT pick "the closest match" on your own.

## STEP 4 — WIPE THE INLINE CSS FROM THE HTML

In `tree-explorer.html`, find the `<style>` block in the `<head>` that contains the popover rules (and any other rules already migrated into `toolskin.css` per the earlier treemap migration).

Delete every rule from that `<style>` block that has been migrated — popover rules and any prior treemap rules. If the `<style>` block becomes empty after this, delete the entire `<style>` tag.

Do NOT touch:
- Any `<script>` tags
- The HTML markup itself
- Any `<link>` tags loading external CSS
- Any inline `style=""` attributes on elements (those are separate concerns)

If the `<style>` block has rules that have NOT yet been migrated to `toolskin.css`, leave those in place — those are future migration candidates, not this session's scope.

## STEP 5 — ADD THE TWO MISSING VARIANTS (conditional on token architecture)

The user wants two variants beyond the current state, both driven by a SINGLE conditional modifier class — NOT by duplicated rulesets. This is the efficiency mandate: variants are token swaps on the existing base, not new property blocks.

**Precondition check:** Inspect the current `.ts-tree-popover` and `.ts-tree-popover__item` base rules in `toolskin.css`. Do they already reference scoped `--ts-this-*` tokens (e.g. `--ts-this-pad`, `--ts-this-font-size`) that variants could override?

- **If YES (base already uses scoped tokens):** proceed with Step 5 as below.
- **If NO (base uses direct values like `padding: var(--ts-sp-3)` instead of `padding: var(--ts-this-pad)`):** STOP. Do NOT refactor the base autonomously. Surface this to the user in chat with the exact lines that would need refactoring and a recommendation:
  > "Variants require base to use scoped tokens (--ts-this-*) for clean override. Base currently uses [list]. Refactor approach: [describe]. This is a meaningful architectural change to user-finalized CSS. Recommend deferring variants to a separate session where this refactor is the focus. Confirm to proceed with refactor now, or skip variants."
  Wait for the user's call. If user says "skip variants for now," skip Step 5 entirely and move to Step 6.

When proceeding with variants (precondition met):

1. **Polished variant** — modifier class that scales font sizing and spacing. Implement as token overrides on the base ruleset (e.g. `.ts-tree-popover--polished { --ts-this-font-size: ...; --ts-this-pad: ...; }`).

2. **Bulleted variant** — modifier class that toggles `border-bottom-width` from `0` to `1px` on the existing `:not(:last-child, :has(+ .ts-tree-popover__sep))` rule, plus padding around items.

Both variants must work by setting CSS custom properties that the base rules already consume. If you have to write more than 3-4 declarations per variant, you're doing it wrong — surface to user.

## STEP 6 — VISUAL AUDIT

Before declaring done:

1. Confirm the popover renders identically to what the user had with the inline styles in place. (Agent: describe the expected visual result and ask the user to confirm in browser. The agent cannot open the browser itself.)
2. If variants were added in Step 5, describe how the user can manually add the modifier class to a popover element and what they should see.
3. If anything looks wrong, the migration is NOT done. Report the discrepancy to the user. Do not "fix" it by changing the user's values.

## STEP 6.5 — STAGE FOR COMMIT (do NOT commit)

This is the ONLY git operation permitted in this session. Run:

```
git add assets/css/toolskin.css
git add tree-explorer.html
```

Then show the user `git diff --staged --stat` so they can see the scope.

Do NOT run:
- `git commit` (the user commits manually after reviewing the diff)
- `git status` (not needed — staging is by file path, no status query required)
- `git log`, `git diff` against branches, or anything that consults remote

If `git add` fails with a "another git process running" error, surface to user and stop. Do not delete lock files or take recovery actions.

## STEP 7 — AUDIT REPORT FOR STANDALONE EXTRACTION (mandatory deliverable)

This step is NOT optional. Even if Steps 1-6.5 ran clean, the session is not complete until this audit is in chat output.

Scan `tree-explorer.html` and the rest of the popover/treemap surface area and produce a SHORT list (chat output only, NOT a file) of other elements that look like standalone-promotion candidates. For each entry provide:

- Proposed base class name
- What styling capabilities it needs
- Whether existing Toolskin tokens cover those capabilities
- Estimated effort (small / medium / large)

This is just a list for the user to review later — do not extract anything in this session.

After delivering this report, declare the session complete.

## ABSOLUTE PROHIBITIONS

- No `git status` queries, no `git diff` against branches, no `git log`, no branch comparison, no remote consultation. The single permitted git operation is `git add` in Step 6.5 (staging only).
- No reformatting of unrelated CSS in `toolskin.css`. Do not run a prettifier on the whole file. Touch only the popover section + the inline overrides being killed.
- No "while I'm here" cleanups. If it's not in this brief, don't do it.
- No new one-off classes. Modular reuse is the rule. Modifier classes that token-swap on the base are fine; new component classes are not.
- No deletion of the user's manual refinements under any circumstance. When in doubt, KEEP it and ask.
- No autonomous selection of replacement tokens in Step 3. User picks.
- No autonomous refactor of base rules to scoped tokens in Step 5. If precondition fails, surface and wait.
- No invented phases. The 7 steps (plus Step 6.5) are the plan. The only pause is at Step 1.
- No multi-commit splits. Stage everything as one logical change; user commits as one commit.

## DONE CRITERIA

- `_bu\` contains four timestamped backup files (verify with `dir _bu\*.{timestamp}.*`).
- `toolskin.css` popover block is live (uncommented), consolidated, hardforced tokens addressed per user direction in Step 3, duplicate rule collapsed, all of the user's prioritized values intact.
- `tree-explorer.html` has zero migrated popover rules in its `<style>` tag (and the tag itself removed if empty).
- Variants either added (if precondition met) or surfaced as deferred (if precondition not met).
- Visual audit description provided to user.
- Changes staged via `git add` (not committed).
- Audit report for further standalone extractions is delivered in chat output.

Begin with the BACKUPS step, then Step 1 (the diff report). Pause at the end of Step 1 for confirmation. Steps 2-7 run sequentially after confirmation.
