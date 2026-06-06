# _review Manifest — Feature Extraction Queue
**Generated:** 2026-06-04

> Items in this manifest are NOT deprecated. They contain patterns worth
> extracting before the source folders are archived. Each entry names the
> pattern, the extraction target, and the blocking dependency.

---

## toolskin-rebuild/_review

### RV-01 · gradients-v3-bento
**File:** `expert-designer/portable-02-components/gradients-v3-bento.html`
**Priority:** Medium

| Pattern | What to extract | Target |
|---|---|---|
| Gradient bento grid | Unequal tile spans, gradient-bg per cell | `sandbox/02-components/ts-gradients.html` |
| Token usage | How `--ts-gradient-*` tokens wire through per-tile | `system/toolskin-gradients-v3.css` token audit |
| Tile sizing | bento `grid-column: span N` per gradient category | `references/04-cards-and-containers.md` addition |

**Extraction note:** Check that all `--ts-gradient-*` token names in this file
match those in the canonical `assets/css/next/system/toolskin-gradients-v3.css`.
Mismatches mean the showcase rendered with inline overrides — lift those into the system file.

---

### RV-02 · this-bg-v2-showcase
**File:** `expert-designer/portable-02-components/this-bg-v2-showcase.html`
**Priority:** High — needed for on-surface consolidation (Directive Task 4)

| Pattern | What to extract | Target |
|---|---|---|
| Surface matrix | All 8 `--ts-this-bg` variants side-by-side | `sandbox/00-design-reference/` token explorer |
| `--ts-on-surface-auto` visual proof | Border auto-inversion on each surface | Confirm in `system/toolskin-this-bg-v2.css` |
| Edge case: accent surface | Does border stay legible? | `ts-nav-header.css` `.ts-on-accent` variant |

**Extraction note:** This file is the visual proof that the on-surface engine works.
It's the acceptance test for Directive Task 4 (on-surface inversion consolidation).
Extract its surface matrix into the reference token explorer so every future component
can verify against it without rebuilding the proof.

---

### RV-03 · type-v2
**Files:** `toolskin-type-v2.css` + `Toolskin Type Scale v2.html`
**Priority:** Medium

| Pattern | What to extract | Target |
|---|---|---|
| Type scale v2 | Ladder steps + font pairing at each step | `primitives/typography.css` token alignment check |
| Button/type co-scaling | How button height tracks type step | `components/ts-btn_v3.1.css` scaling token |
| Display + body pairing | The exact font-weight + tracking at each step | `references/02-typography.md` §2 update |

**Extraction note:** Compare `toolskin-type-v2.css` token names against the current
`primitives/typography.css`. Any token in v2 not present in primitives is either
missing (add it) or renamed (document the rename). Do not silently discard.

---

### RV-04 · ts-btn-v3.1 harness
**File:** `expert-designer/portable-02-components/ts-btn_v3.1.html`
**Priority:** High — button scaling token (Directive Task 6 dependency)

| Pattern | What to extract | Target |
|---|---|---|
| Button state matrix | Full default/hover/focus/active/disabled × all variants | `sandbox/02-components/` button harness |
| P-06 smart spacing in context | First/last button corrections visually verified | `ts-nav-header.css` §6d |
| `--ts-btn-scale` token | Button scaling token wired and tested | `components/ts-btn_v3.1.css` |

**Extraction note:** The button scaling token (`--ts-btn-scale`) is referenced in
the Directive (Task 6) but its presence in the current canonical `ts-btn_v3.1.css`
is unconfirmed. This harness is the place to verify it renders correctly.
If missing: add `--ts-btn-scale: 1` + `calc(… * var(--ts-btn-scale))` to btn sizing.

---

## toolskin-showcase/_review

### RV-05 · banner-generator-v2
**File:** `_bu/banner-generator-v2.html`
**Priority:** High — promo banner rebuild (Directive Task 11 dependency)

| Pattern | What to extract | Target |
|---|---|---|
| Dismissable banner | Fixed top bar, height = `--ts-promo-banner-h`, collapse transition | `components/ts-promo-banner.css` |
| Mobile CTA reveal | Opacity transition on hover (not display toggle — P-10 equivalent) | ts-promo-banner.css mobile block |
| Nav-top coupling | `body:has(.ts-promo-banner:not(.ts-dismissed)) .ts-nav-fixed { top: var(--ts-promo-banner-h) }` | ts-nav-header.css § offset compensation |
| Intrinsic responsive | Replace `#CRAZY_FIX_RULES` media hacks with flex/clamp/min-max | ts-promo-banner.css mobile block |
| Tokenized button placement | Inline / stacked / overlay at different widths | `--ts-promo-cta-placement` token |

**Extraction note:** The owner's directive (Task 11) is to rebuild the promo banner
cleanly without `#CRAZY_FIX_RULES`. This file contains the patterns that work —
extract the mobile CTA reveal, the dismiss transition, and the nav-top coupling,
then rebuild them tokenized. The `ba-grid` class in the reference HTML is a demo
overlay — do not carry it into the canonical banner.

---

### RV-06 · customized-css-evolution (v1 → v4amn)
**Files:** `_bu/customized_v*.css` (5 versions)
**Priority:** Low–Medium

| Pattern | What to extract | Target |
|---|---|---|
| User-script token override layer | Which tokens are exposed for customization | User-script layer spec |
| v1 → v4amn diff | What Satoshi converged on over 4 iterations | `toolskin-architecture` SKILL.md |
| `amn` suffix meaning | Check file header for annotation | Session notes |

**Extraction note:** Run `diff customized_v1.css customized_v4amn.css` to see the
exact evolution. The delta is the design decision — document it as a named pattern
("user-script token cartel evolution") in the architecture skill.

---

### RV-07 · experimental-components
**Folder:** `_sandbox/experimental-components/`
**Priority:** Low (per-file assessment needed)

**Action required:** List files in this folder (not done — requires local access).
For each file: determine if the component it represents is already in the canonical
rebuild. If yes → archive. If no → assess extraction priority.

---

### RV-08 · unintegrated-patches
**Folder:** `docs/_unintegrated-patches/`
**Priority:** High — blocking integration completeness

**Action required:** Each patch in this folder is an owner-written fix not yet
in the canonical CSS. These are in the integration queue. Process in order:
1. Read each patch
2. Determine which canonical file it targets
3. If the fix is already in canonical (was integrated separately) → archive the patch
4. If not integrated → schedule as a CSS integration task per `css-integration-discipline.md`

---

### RV-09 · corentin-prototype
**Files:** `_bu/corentin.html` + `corentin-beautified.js`
**Priority:** Low — identity unclear

**Action:** Open in browser. If it's a Higgsfield/SatSea collaborator UI:
check if any interaction patterns are relevant to the Toolpanel mockup work.
If unrelated: move to `_archived/`.

---

## Extraction priority order

```
1. RV-05  banner-generator   → unblocks Directive Task 11 (promo banner)
2. RV-02  this-bg-v2         → unblocks Directive Task 4 (on-surface consolidation)
3. RV-04  ts-btn-v3.1        → unblocks Directive Task 6 (button scaling token)
4. RV-08  unintegrated-patches → integration queue hygiene
5. RV-01  gradients-v3-bento → standalone, no directive dependency
6. RV-03  type-v2            → typography alignment check
7. RV-06  customized-css     → architecture documentation
8. RV-07  experimental       → requires per-file assessment
9. RV-09  corentin           → open + decide
```

---

## How to use this manifest

1. Pick the top item from the priority order
2. Open the source file(s) listed
3. Read the "Patterns to extract" table
4. Follow the "Target" column to know where the pattern lands
5. Write the extracted pattern to the target file
6. Strike through the item here (or delete the entry)
7. Move the source file to `_archived/` after extraction is confirmed

**Rule:** never delete a source file until its patterns are confirmed in the
target. "Extracted" means the target file renders the pattern correctly, not
just that the code was copied.
