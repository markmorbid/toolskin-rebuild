# INTEGRATION RECIPE — engine → core CSS chunks, no missing pieces
# 3 phases = 3 commits. Each phase loads ON TOP of the verified one below.
# Source: Gradient_Engine_System.zip (in docs/handoffs/). All 4 files functional.

═══════════════════════════════════════════════════════
WHY PIECES GO MISSING (and how this prevents it)
═══════════════════════════════════════════════════════
The button consumes tokens from THREE layers below it. Load out of order
or drop a block, and the button silently falls back to defaults — it LOOKS
fine but is broken. The fix: integrate bottom-up, verify each layer's
showcase renders BEFORE the next layer loads on top. A broken showcase =
a missing dependency, caught visually, before it cascades.

DEPENDENCY CHAIN (bottom feeds top):
  base (toolskin.css: --ts-accent, --ts-bg-*, --ts-radius-*, fonts)
    └─> SURFACES (this-bg-v2: --ts-this-bg, --ts-on-surface-auto,
                  --ts-tone-floor, states, borders, semantic colors)
          └─> GRADIENTS (gradients-v3: --ts-grad-*, --ts-accent-grad)
                └─> BUTTON (ts-btn: consumes ALL of the above)

The button REQUIRES from below: --ts-on-surface-auto, --ts-tone-floor,
--ts-accent-grad, semantic --ts-success/danger/warning/info + --ts-on-*.
If surfaces/gradients aren't in first, the button breaks. Hence the order.

═══════════════════════════════════════════════════════
PHASE 1 — SURFACES  (toolskin-this-bg-v2.css → surfaces chunk)
═══════════════════════════════════════════════════════
This is the foundation. Everything needs it. Do it first.

  1. Zip-backup the current surfaces CSS before overwriting:
     Compress-Archive system\surfaces.css backups\surfaces-pre-phase1-<UTC>.zip
  2. Integrate toolskin-this-bg-v2.css as the surfaces engine chunk
     (assets/css/next/system/). It consumes --ts-accent + --ts-bg-* from the
     existing base (already present post-reset). Preserve the owner's
     alternating-surface / accent-band / grad-surface blocks (layout/utility,
     NOT state tokens) — append them or keep them; do not delete.
  3. VERIFY: open this-bg-v2-showcase.html in the browser. All states render,
     focus is a WARM tint (not purple/brown), all presets distinct.
  4. Showcase renders correctly → COMMIT:
     git commit -m "feat(surfaces): integrate v2 oklab surface+state engine"
  Phase 1 done. Surfaces are now the verified foundation.

═══════════════════════════════════════════════════════
PHASE 2 — GRADIENTS  (toolskin-gradients-v3.css → gradients chunk)
═══════════════════════════════════════════════════════
Loads ON TOP of surfaces (needs --ts-this-bg from Phase 1).

  1. Zip-backup before adding (low risk; still do it for the chunk it touches).
  2. Integrate toolskin-gradients-v3.css (assets/css/next/system/), loaded
     AFTER the surfaces chunk. It derives every gradient from --ts-this-bg +
     --ts-grad-tint. Radial gradients use ellipse <pct> <pct>, never circle.
  3. VERIFY: open gradients-v3-bento.html. All 19 gradients render, no
     banding, the live generator works.
  4. Renders correctly → COMMIT:
     git commit -m "feat(gradients): integrate v3 token-driven gradient library"
  Phase 2 done.

═══════════════════════════════════════════════════════
PHASE 3 — BUTTON  (ts-btn_v3.1.css → components chunk)
═══════════════════════════════════════════════════════
Loads LAST. Consumes everything from Phases 1+2. CANNOT be done before them.

  1. Zip-backup the existing component CSS before migrating.
  2. MIGRATE the old button system → ts-btn_v3.1.css as the canonical button
     in the components CSS block. This is a MIGRATION, not a rewrite: the new
     ts-btn is the target; map old button classes/usages onto it. Use
     ts-btn_v3.1.css verbatim as the component definition; reconcile old
     class names by aliasing, NOT by editing the new system.
  3. Load order in every consuming page: base → surfaces → gradients → button.
  4. VERIFY: open ts-btn_v3.1.html. Every variant/size/state renders; button
     on an accent surface auto-flips ink; lush (gradient) skins work; focus
     is warm not purple. Also spot-check the button inside the sandbox.
  5. Renders correctly → COMMIT:
     git commit -m "feat(components): migrate button system to ts-btn v3.1"
  Phase 3 done. The engine is fully integrated, bottom to top, verified.

═══════════════════════════════════════════════════════
PHASE 4 (LATER, separate) — color system consolidation
═══════════════════════════════════════════════════════
Once surfaces+gradients+button are in, consolidate the color system
(semantic palettes, dim ladders, preset propagation). Separate phase,
separate commit. Not part of this integration. Flagged, not forgotten.

═══════════════════════════════════════════════════════
THE ANTI-MISSING-PIECES GUARANTEE
═══════════════════════════════════════════════════════
You cannot finish a phase while its showcase is visibly broken. A broken
showcase IS a missing dependency, made visible. Integrate bottom-up, verify
each layer's real page, and the dependency chain cannot have holes —
because a hole shows up as a broken showcase before the next layer loads.

No flags. No mid-phase halts. Three phases, three commits, three showcase
checks. Zip before each overwrite. Report when each phase renders. Done.
