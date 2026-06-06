# DIRECTIVE — Toggle-Fix + Integrate Claude Design's Surface + Gradient Engine
# ONE flow. Two commits. Halt at each behind pending-approval.flag.
# The engine is the SOURCE OF TRUTH for surfaces/states/borders/gradients.

═══════════════════════════════════════════════════════
STANDING ORDERS (read before anything)
═══════════════════════════════════════════════════════
- You are NOT authorized to remove, delete, overwrite, or stash ANY owner
  file or owner edit. Not even to ask. If something seems redundant, leave it.
- Owner working-tree fixes that are CANONICAL — KEEP them:
    * sandbox/00-design-reference/index.html — path fix (../../ correct).
      A safety copy exists at 00-design-reference-cleaned-up.html — do NOT
      touch or delete it.
    * colors.css — owner added :root prefix on the light-theme rule AND the
      preset classes (so specificity actually applies them). KEEP these.
    * Owner moved several styles from index.html into tokens.css to defeat
      inline-specificity. KEEP them there for now — they are flagged for
      later separation into component blocks (see decisions/style-separation.md).
      Do NOT reorganize them in this directive.
- B-9: timestamped backup before touching any owner-WIP file; surface the
  path in the report. Stash is additive, never substitutive.
- pending-approval.flag before every commit; guard blocks until owner clears.
- One commit, one halt, one approval. No chaining.

═══════════════════════════════════════════════════════
COMMIT 2 (this directive's first commit) — TOGGLE-FIX ONLY
═══════════════════════════════════════════════════════
IMPORTANT: do NOT hand-build any state-token knob block. The engine
(Phase below) supersedes it. Commit 2 is ONLY the theme-toggle exclusion.

a. B-9 backup: tools/color-engine/generate-colors.js + colors.css.
b. Edit the generator to emit :not(button[data-theme]) on BOTH rules:
     [data-theme="light"]:not(button[data-theme]) {
     [data-theme="dark"]:not(button[data-theme]) {
   Preserve the owner's :root prefix. Only button[data-theme]. NOT .ts-picker.
   Closing paren present. This stops theme-toggle buttons from inheriting the
   theme they switch.
c. Regenerate colors.css. APCA-verify all 10 preset pairs.
d. Write pending-approval.flag: "Commit 2: theme-toggle exclusion".
   Attempt commit → guard denies → HALT. Owner approves → clear flag → commit.

═══════════════════════════════════════════════════════
WHAT THE ENGINE IS (and why it wins — context for the integration)
═══════════════════════════════════════════════════════
The engine zip is already in docs/handoffs/ (untouched). Contents:
  toolskin-this-bg-v2.css     — surface + state + border engine
  toolskin-gradients-v3.css   — 19-gradient painterly library
  GRADIENTS.md, HANDOFF.md    — full docs (HANDOFF.md = authoritative load order)
  this-bg-v2-showcase.html, gradients-v3-bento.html — interactive showcases
  fonts/ — Space Grotesk + JetBrains Mono variable fonts

THE PURPLE FIX (definitive): v1 mixed states color-mix(in oklch,...). OKLCH
interpolates hue on the SHORT ARC — blue-neutral (h~270) to orange accent
(h~39) passes through magenta = purple. v2 mixes every chromatic state in
OKLAB (Cartesian a/b, no hue path, no wrap). Focus = desaturated
--ts-tone-accent-tint at 8% — a warm whisper, not a wash. This SUPERSEDES
the earlier tone-contrast patch and any hand-rolled knob block. Use oklab.

It ADDS what the old system lacked: tone anchors, full mix-perc knob set,
surfaces (bright/dark ×3 + raised + recessed + dim ×6 + muted), states
(hover/active/pressed/focus/focus-ring/focus-outline/selected/disabled/
dragging + semantic success/danger/warning/info), 3 border weights, and a
tint-agnostic gradient library with a live generator.

═══════════════════════════════════════════════════════
COMMIT 3 (engine integration) — PHASE A: place files (remove nothing)
═══════════════════════════════════════════════════════
Extract the docs/handoffs engine zip to a temp dir, then place:
  assets/css/next/system/toolskin-this-bg-v2.css     ← surface engine
  assets/css/next/system/toolskin-gradients-v3.css   ← gradient library
  docs/handoffs/engine/GRADIENTS.md
  docs/handoffs/engine/HANDOFF.md
  docs/handoffs/engine/this-bg-v2-showcase.html
  docs/handoffs/engine/gradients-v3-bento.html
  assets/fonts/  ← 3 variable font files (B-9 backup before overwriting any
                   existing font; if already present and identical, skip)
Do NOT layer the package's toolskin.css over the repo base — the repo's
primitives/colors.css + tokens ARE the base. The engine sits ON TOP,
consuming --ts-accent and --ts-this-bg.

═══════════════════════════════════════════════════════
PHASE B — wire load order (HANDOFF.md authoritative)
═══════════════════════════════════════════════════════
In sandbox/00-design-reference/index.html (owner's canonical file) and any
surface-consuming showcase, load IN THIS ORDER (B-9 backup the HTML first):
  1. base (existing): primitives/colors.css + tokens + type + fonts
  2. surface engine:  system/toolskin-this-bg-v2.css
  3. gradient library: system/toolskin-gradients-v3.css
Order matters: gradients need --ts-this-bg from the surface engine; the
surface engine needs --ts-accent from the base.

═══════════════════════════════════════════════════════
PHASE C — reconcile surfaces.css state tokens (OWNER DECIDES)
═══════════════════════════════════════════════════════
The repo's system/surfaces.css defines state/border tokens by hand (the ones
that produced brown focus + washed states). The v2 engine defines the SAME
names, correctly. REPORT the exact overlap (which token names appear in both)
and let the OWNER pick — touch nothing until they choose:
  (i)  surfaces.css KEEPS the owner's layout/utility blocks (alternating
       sections, accent-band, grad-surface) and DROPS its hand-rolled
       state/border token block, deferring those to toolskin-this-bg-v2.css.
  (ii) keep both; load v2 AFTER so it wins the cascade.
The owner's alternating-surface + accent-band + grad-surface blocks are
PRESERVED either way (they are layout/utility, not the state-token chain).

═══════════════════════════════════════════════════════
PHASE D — verify against the showcases (live, not screenshots)
═══════════════════════════════════════════════════════
Open this-bg-v2-showcase.html + the sandbox in the browser. Confirm:
  - focus is a WARM tint, NOT purple, NOT brown, on all base surfaces
  - active/disabled subtle, gentle ramp
  - all 10 presets render distinct (owner's :root-prefix fix makes them apply)
  - gradients render without banding; radial uses ellipse (not circle %)
Screenshot → backups/_engine-integration-verify-<ISO>.png.

═══════════════════════════════════════════════════════
PHASE E — commit 3 (behind the flag)
═══════════════════════════════════════════════════════
B-9 backups taken, owner picked the C-option, screenshots saved.
Write pending-approval.flag: "Commit 3: engine integration v2/v3".
Stage explicit paths. Attempt commit → guard denies → HALT.
Owner approves → clear flag → commit.

═══════════════════════════════════════════════════════
RULES GIVEN REPEATEDLY — FOLLOW THEM
═══════════════════════════════════════════════════════
- oklab for chromatic state mixes (never oklch — that IS the purple bug)
- never invent a color; reach through a --ts-* token
- radial-gradient uses ellipse <pct> <pct>, never circle <pct>
- nested component pattern for anything with states/variants/children
- remove nothing; ask to remove nothing; preserve every owner edit
- do NOT reorganize the styles owner moved into tokens.css — flagged for later
- HALT and show owner before each commit
- Claude Design's output is the LAW — integrate it whole, no exclusions

CONFIRM before touching anything: (1) Commit 2 is toggle-fix ONLY, no
hand-built state block; (2) engine integration uses oklab and is the source
of truth; (3) load order base→surface→gradient; (4) owner picks the Phase-C
option; (5) remove nothing.
