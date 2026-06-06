# DIRECTIVE — Surface State Token Fix + Layout Recovery
# Three discrete commits. B-9 backup before every file touch. Halt at each.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
B-9 REMINDER (applies to every step below)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Before modifying ANY file with owner WIP, copy it to
backups/<name>-pre-<reason>-<ISO-timestamp>.<ext> AND surface the
path in the halt report. No exceptions.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMMIT 1 — Restore the owner's HTML layout
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The owner's layout for sandbox/00-design-reference/index.html was wiped.
The canonical version is live at:
  https://satsea.io/toolskin-rebuild/sandbox/00-design-reference/
and the recovered CSS is at:
  sandbox/00-design-reference/00-design-reference_recover.css

a. Backup current state first:
   cp sandbox/00-design-reference/index.html \
      backups/sandbox-00-pre-layout-restore-<ISO>.html  (if it exists)

b. Fetch the live canonical version (curl/WebFetch) and use it as the
   reference for the correct layout — the grid-based surface cards
   (2-3 columns), the 6-state grid, NOT the vertical single-column stack.
   The screenshots show: LEFT = current wrong (vertical stack),
   RIGHT = correct (grid). Restore to the grid version.

c. The recovered CSS (00-design-reference_recover.css) contains the
   owner's @OWNER_REVIEW + @OWNER_DIRECTIVE comment blocks and the
   correct token cartel. Reconcile it into the file.

d. Verify against the live version visually (Playwright screenshot vs
   the satsea.io render). They must match.

e. Commit. Report hash. HALT.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMMIT 2 — Surface state token fix (in the GENERATOR)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

These tokens are defined in system/surfaces.css, baked by the generator.
Fix the SOURCE (generator), then regenerate. Do NOT hand-edit the
generated CSS — it gets overwritten.

a. Backup:
   cp assets/css/next/system/surfaces.css \
      backups/surfaces-pre-state-fix-<ISO>.css
   cp tools/color-engine/generate-colors.js \
      backups/generate-colors-pre-state-fix-<ISO>.js

b. THE PROBLEMS (from owner review of the live sandbox):
   1. --ts-this-bg-focus renders BROWN — accent mixed into dark surface.
      WRONG. Focus FILL should equal active fill. Accent goes on the
      border (focus ring) only.
   2. --ts-this-bg-active and --ts-this-bg-disabled are too washed/bright.
      Mix percentages too high; the ramp between states is too abrupt.
   3. Every derivative needs its own mix-percentage knob for control.

c. THE FIX — replace the state + border token block with this
   (knob-controlled, subtle ramps, accent only on focus ring):

   /* ── MIX-PERCENTAGE CONTROL KNOBS ── */
   --ts-mix-perc:            10%;
   --ts-mix-perc-hover:      18%;   /* was 25 — gentler */
   --ts-mix-perc-active:     14%;   /* was 20 — less washed */
   --ts-mix-perc-disabled:   8%;
   --ts-surf-hover-pct:      6%;    /* was ~12 */
   --ts-surf-active-pct:     5%;    /* subtle recession */
   --ts-surf-disabled-pct:   10%;   /* was ~60 — way too much */

   /* ── SURFACE STATES ── */
   --ts-this-bg-hover:
     color-mix(in oklch, var(--ts-this-bg), var(--ts-tone-contrast) var(--ts-surf-hover-pct));
   --ts-this-bg-active:
     color-mix(in oklch, var(--ts-this-bg), oklch(0 0 0) var(--ts-surf-active-pct));
   --ts-this-bg-focus: var(--ts-this-bg-active);   /* fill = active; ring = accent */
   --ts-this-bg-disabled:
     color-mix(in oklch, var(--ts-this-bg), var(--ts-text-muted) var(--ts-surf-disabled-pct));

   /* ── BORDERS — accent ONLY on focus ring ── */
   --ts-this-bg-border:
     color-mix(in oklch, var(--ts-this-bg), var(--ts-tone-contrast) var(--ts-mix-perc));
   --ts-this-bg-border-hover:
     color-mix(in oklch, var(--ts-this-bg), var(--ts-tone-contrast) var(--ts-mix-perc-hover));
   --ts-this-bg-border-active:
     color-mix(in oklch, var(--ts-this-bg), var(--ts-tone-contrast) var(--ts-mix-perc-active));
   --ts-this-bg-border-disabled:
     color-mix(in oklch, var(--ts-this-bg), var(--ts-text-muted) var(--ts-mix-perc-disabled));
   --ts-this-bg-border-focus: var(--ts-accent);

   LOCK COMMENT (keep): oklch interpolation is mandatory; srgb collapses
   bichromatic identity. Mixing toward tone-contrast (hue-neutral) not
   this-bg (blue-biased) is what kills the purple aberration.

d. ALSO — every primitive derivative needs its dim tokens + mix knobs.
   Audit the accent + surface + text derivative chains. Any derivative
   missing a -dim variant or a controlling --ts-*-pct / --ts-mix-* knob:
   add it, defaulted to a sensible value, so transparency/bright/dark are
   all controllable from the knob block. Report which were missing.

e. Regenerate: node tools/color-engine/generate-colors.js
   Verify all 10 preset pairs APCA-pass.

f. Visual recheck: Playwright screenshot the "Six state outputs" grid
   in sandbox/00-design-reference. Confirm:
   - focus is NO longer brown (matches active — subtle neutral)
   - active and disabled are subtle, not washed
   - the ramp base→hover→active reads as gentle steps
   Save screenshot to backups/_state-fix-verify-<ISO>.png

g. Commit (generator + regenerated surfaces.css + colors.css + backups).
   Report hash. HALT.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMMIT 3 — Restore the alternating-surface CSS the owner wrote
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The owner's .ts-section alternating-surface block + accent-band +
grad-surface utilities were wiped from surfaces.css. The owner pasted
the full block (in the grievance message). Restore it verbatim, with
its @OWNER_NOTE comment, into the appropriate layer.

NOTE: it contains color-mix(in srgb,...) in several places. Per the
identity invariant, flag each srgb mix for conversion to oklch, but
RESTORE FIRST (owner's work back on disk), convert in a follow-up the
owner approves. Do not "improve" while restoring — restore verbatim,
then propose the oklch conversions separately.

a. Backup surfaces.css again (post-Commit-2 state).
b. Restore the owner's alternating-surface block verbatim.
c. Do NOT run audits or convert srgb yet — owner reviews the restored
   block first.
d. Commit. Report hash. HALT.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HALT CADENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Three commits, halt + report hash after EACH. Owner reviews each before
the next. No chaining. B-9 backup surfaced in every report.
