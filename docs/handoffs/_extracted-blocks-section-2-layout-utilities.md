# Extracted Blocks Catalog — Section 2: Layout Utilities

**Sub-agent:** 2  ·  **Chunk:** root layout files  ·  **Files:** 3  ·  **Total bytes:** ~18,910

## Files in this chunk

| File | Lines | Bytes | Block type |
|---|---|---|---|
| configuration-utilities.css | 89 | 2,492 | utilities (framework configuration toggles + Locomotive guards) |
| global-layout-utilities.css | 980 | 13,351 | utilities (spacing/display/text/border/interactive — Tailwind-like utility classes mapped onto `--ts-sp-*` and other system tokens) |
| global-layout-utilities-2.css | 142 | 3,067 | layout + component pattern (re-declares §8e elastic/fullpage utilities and adds the `.ts-parallax` view component) |

## Per-file catalog

### configuration-utilities.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/configuration-utilities.css`
- **Lines:** 89  ·  **Bytes:** 2,492
- **Block type:** utilities — "framework configuration utilities" toggles + Locomotive/scroll-reveal compatibility guards. Owner-marked `§8e`.
- **Key `--ts-*` tokens declared:** none (this file *consumes* tokens; it does not declare any).
- **Key `--ts-*` tokens referenced:** `--ts-sp-8`, `--ts-content-max` (fallback `900px`).
- **Key `.ts-*` classes defined:**
  - `.ts-no-grain` (+ `:root.ts-no-grain .ts-grain` and `::before` variants) — kill-switch for the grain layer.
  - `.ts-layout-elastic` (+ descendant `.ts-container`) — fullwidth Brutalist layout mode.
  - `.ts-layout-content .ts-container` — narrower content-focused layout.
  - `:root.ts-fullpage` + descendant `.ts-section` / `.ts-hero` — vertical scroll-snap fullpage mode.
  - `[data-scroll-container]:not(.ts-grain)` and `[data-scroll]` — Locomotive Scroll `will-change` hints.
  - Locomotive transform-suppression selector set: `section.ts-grain[data-scroll]`, `.ts-hero.ts-grain[data-scroll]`, `.ts-section.ts-grain[data-scroll]`, `.ts-grain[data-scroll]`, `.ts-section-divider[data-scroll]`, `.ts-container[data-scroll]`.
  - Reveal-animation preservation selector set: `.ts-fade-up[data-scroll]`, `.ts-fade-in[data-scroll]`, `.ts-fade-left[data-scroll]`, `.ts-fade-right[data-scroll]`, `.ts-zoom-in[data-scroll]`, `.ts-zoom-out[data-scroll]`, `.ts-slide-up[data-scroll]`.
  - `[data-scroll][data-ts-parallax="true"]` — explicit parallax opt-in.
  - `.ts-grain [data-scroll]:not(.ts-fade-up):not(.ts-fade-in):not(.ts-fade-left):not(.ts-fade-right)` — inner-element transform allowance.
- **Owner annotations VERBATIM with line numbers:**
  - L1: `/* ─── §8e  Framework Configuration Utilities ─────────────────────────── */`
  - L3: `/* Disable noise/grain globally or per-element */`
  - L14: `/* Elastic/Brutalist fullwidth layout */`
  - L26: `/* Content-focused layout (narrower) */`
  - L31: `/* Fullpage snap scrolling mode */`
  - L44: `/* Locomotive Scroll container */`
  - L53: `/* CRITICAL: Prevent Locomotive from breaking layouts */`
  - L54-56: `/* Don't apply transforms to layout-critical elements.\n\tNOTE: .ts-fade-up and .ts-fade-in are EXCLUDED — they need their\n\ttransforms for scroll reveal animations to work correctly. */`
  - L67-68: `/* Reveal animations MUST keep their transforms even with [data-scroll].\n\tThe transition handles the animation; Locomotive should not override. */`
  - L79: `/* Only allow transforms on specifically tagged parallax elements */`
  - L85: `/* Allow transforms on inner elements that aren't animated */`
- **Refactor flags:**
  - Heavy reliance on `!important` (every property in the elastic/content/Locomotive guard rules). Necessary today because Locomotive Scroll writes inline `transform` styles at runtime — but `!important` chains are a long-term tech debt.
  - The `.ts-no-grain` rules use `!important` to override the `.ts-grain::before` SVG turbulence painted by `ToolskinGridBg` — coupling between this utility and the JS grain engine is implicit and untyped.
  - This file overlaps with `global-layout-utilities-2.css` (lines 14-43 are duplicated almost verbatim — see contradictions below).
- **Session 3 relationship:** does NOT directly touch the surface chain (`a0ea9e4`). It interacts with two adjacent layers:
  1. **`tools/locomotive`-class JS** (audit catalog §1.9) — these CSS rules are the static counterpart to `ToolskinLocomotive`.
  2. **Future scroll-reveal CSS** — the `.ts-fade-*` / `.ts-zoom-*` / `.ts-slide-up` selectors imply a reveal-animation layer not yet in scope.
  No surface tokens touched. Safe to defer past Sessions 3/4.
- **Gap vs `_code-audit-catalog.md`:**
  - (a) Already covered: existence of `.ts-no-grain` and `.ts-fullpage` is mentioned in the State/utility class list at L590 of the catalog. The `locomotiveScroll` config block at L77 references `ToolskinLocomotive` (L117) and `ToolskinParallaxFallback` (L184) classes.
  - (b) NEW vs catalog: the explicit selector list of "elements where Locomotive transforms are forbidden" and the "reveal animations that must keep transforms" set is not catalogued. The owner's CRITICAL comment at L53 + the dual rule architecture (forbid on layout, allow on reveals) is the design intelligence.
  - (c) Contradictions: catalog L590 lists `.ts-fullpage` as a state/utility class but does not surface that `:root.ts-fullpage` also activates a per-section scroll-snap with `min-height: 100vh` that would interact with section heights elsewhere — minor docs gap, not a contradiction.

---

### global-layout-utilities.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/global-layout-utilities.css`
- **Lines:** 980  ·  **Bytes:** 13,351
- **Block type:** utilities — Tailwind-like atomic utility classes for spacing, display, text, border, interactive cursor/select. Owner-marked sections `§7a` through `§7e`.
- **Key `--ts-*` tokens declared:** none. This file is 100% token consumer.
- **Key `--ts-*` tokens referenced (heavy):**
  - Spacing: `--ts-sp-1` through `--ts-sp-20` (consumed by margin/padding/gap utilities).
  - Container: `--ts-container-sm`, `--ts-container-md`, `--ts-container-lg`, `--ts-container-xl`.
  - Border: `--ts-border-0`, `--ts-accent-border`.
  - Radius: `--ts-radius-md`, `--ts-radius-full`.
- **Key `.ts-*` classes defined (grouped — full list is ~150 utilities):**
  - **Margin (§7a):** `.ts-mt-0` through `.ts-mt-20`, `.ts-mb-0` through `.ts-mb-20`, `.ts-mx-auto`, `.ts-ml-auto`, `.ts-mr-auto`.
  - **Padding (§7a):** `.ts-p-0..20`, `.ts-pt-0..20`, `.ts-pb-0..20`, `.ts-pr-0..20`, `.ts-pl-0..20`, `.ts-px-0..20`, `.ts-py-0..20`.
  - **Max-width (§7a):** `.ts-max-w-sm/-md/-lg/-xl/-none/-prose/-120/-560/-600/-900` (note: `-prose`, `-120`, `-560`, `-600`, `-900` are hardcoded px, not tokenized).
  - **Gap (§7a):** `.ts-gap-1/-2/-3/-4/-5/-6/-8` (gaps 7, 9-20 missing — intentional?).
  - **Flex (§7a):** `.ts-flex-1`, `.ts-flex-row`, `.ts-flex-col`, `.ts-flex-wrap`, `.ts-items-center`, `.ts-items-start`, `.ts-justify-center`, `.ts-justify-between`, `.ts-w-fit`, `.ts-h-full`, `.ts-cursor-pointer`.
  - **Display/visibility (§7b):** `.ts-hidden` (uses both `visibility: hidden !important` AND `display: none`), `.ts-visible`, `.ts-visible:not(.ts-tilt, :hover)`, `.ts-invisible`, `.ts-sr-only`.
  - **Text (§7c):** `.ts-truncate`, `.ts-line-clamp-2`.
  - **Border (§7d):** `.ts-border`, `.ts-border-t`, `.ts-border-b`, `.ts-border-accent`, `.ts-rounded`, `.ts-rounded-full`.
  - **Interactive (§7e):** `.ts-cursor-pointer` (duplicate of §7a definition — see below), `.ts-select-none`, `.ts-no-events`.
- **Owner annotations VERBATIM with line numbers:**
  - L1-3: `/* ═══════════════════════════════════════════════════════════════════════\n\t§7  UTILITIES\n\t═══════════════════════════════════════════════════════════════════════ */`
  - L5: `/* ─── §7a  Spacing Utilities ────────────────────────────────────────── */`
  - L775: `/* Max-width utilities */`
  - L816: `/* Gap overrides */`
  - L845: `/* Flex utilities */`
  - L893: `/* ─── §7b  Display / Visibility ─────────────────────────────────────── */`
  - L925: `/* ─── §7c  Text Utilities ───────────────────────────────────────────── */`
  - L941: `/* ─── §7d  Border Utilities ─────────────────────────────────────────── */`
  - L967: `/* ─── §7e  Interactive / Cursor ─────────────────────────────────────── */`
- **Refactor flags:**
  - **Duplicate class definition:** `.ts-cursor-pointer` defined twice — L888-890 (in §7a Flex utilities) AND L969-971 (in §7e Interactive). Identical bodies, but two definitions of the same selector indicates organization drift.
  - **Hardcoded max-width values bypass tokens:** `.ts-max-w-prose: 640px` (L797), `.ts-max-w-120: 120px` (L801), `.ts-max-w-560: 560px` (L805), `.ts-max-w-600: 600px` (L809), `.ts-max-w-900: 900px` (L813). These should reference container or content tokens, not raw px. Especially `-560/-600/-900` look like ad-hoc additions.
  - **`.ts-gap-7` and `.ts-gap-9..20` missing** — gap utilities only cover 1-6 and 8. Likely incomplete vs the 1-20 margin/padding coverage.
  - **`.ts-hidden` redundancy:** sets BOTH `visibility: hidden !important` AND `display: none` (L895-898). `display: none` already removes from rendering; `visibility: hidden !important` is redundant unless something else fights it.
  - **`!important` on border-radius:** `.ts-rounded` and `.ts-rounded-full` both use `!important` (L960, L964). Means component-level radius cannot override these utilities without `!important` of its own.
  - **`.ts-visible:not(.ts-tilt, :hover)` (L905-907)** — uses CSS Selectors L4 `:not()` with comma list. Browser support is good (~2022+) but worth flagging for compatibility audits.
  - **No `.ts-m-*` (all-sides margin) utilities** — only `mt/mb/mx/ml/mr` are present. Asymmetric with padding (which has `.ts-p-*` for all sides).
- **Session 3 relationship:** purely consumes `--ts-sp-*`, `--ts-border-0`, `--ts-accent-border`, `--ts-radius-*`, `--ts-container-*`. Does NOT touch the `--ts-this-bg` superposition chain committed in `a0ea9e4`. Safe to migrate to the rebuild's token namespace verbatim once spacing/radius/border/container tokens are finalized. Will inform a future `utilities.css` layer.
- **Gap vs `_code-audit-catalog.md`:**
  - (a) Already covered: catalog L487-490 documents `--ts-sp-*` scale (with the L490 caveat that `--ts-sp-17..24` are flagged "CRITICAL IMPLEMENTATION ERROR" in toolskin.css L442-457). This utility file consumes `--ts-sp-17..20`, so it inherits the unusable values. Catalog L590 mentions `.ts-hidden` as a state/utility class. Catalog L501 documents `--ts-container-sm/md/lg/xl`. Catalog L493 covers radius scale.
  - (b) NEW vs catalog: the comprehensive utility class inventory (Tailwind-like atomic system) is not catalogued anywhere in `_code-audit-catalog.md`. The duplicate `.ts-cursor-pointer` definition is new. The hardcoded `.ts-max-w-{120,560,600,900}` token leak is new. The `.ts-gap-*` gaps (1-6, 8 only) is new. The `.ts-hidden` double-property design is new.
  - (c) Contradictions: catalog L490 says `--ts-sp-17..24` are "CRITICAL IMPLEMENTATION ERROR" — but this utility file declares `.ts-mt-17`, `.ts-mt-18`, `.ts-mt-19`, `.ts-mt-20` (and the matching mb/p/pt/pb/pl/pr/px/py variants). So the utility classes EXIST for the broken token range. This is a real cross-file inconsistency: removing `--ts-sp-17..20` per the in-source REFACTOR NOTE would orphan ~40 utility classes that consume them.

---

### global-layout-utilities-2.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/global-layout-utilities-2.css`
- **Lines:** 142  ·  **Bytes:** 3,067
- **Block type:** layout (re-declares elastic/fullpage utilities from `configuration-utilities.css`) + component pattern (introduces `.ts-parallax` view component). Owner annotation `/* Width helpers */` at top suggests this is a continuation/append of `global-layout-utilities.css`.
- **Key `--ts-*` tokens declared (LOCAL component overrides — anti-pattern):**
  - L53: `--ts-bg-0: black;` (declared inside `.ts-parallax__overlay`)
  - L61: `--ts-text-primary: white;` (declared inside `.ts-parallax__content h2`)
  - L69: `--ts-text-secondary: #ffffff6b;` (declared inside `.ts-parallax__content p`)
- **Key `--ts-*` tokens referenced:** `--ts-content-max` (fallback `900px`), `--ts-sp-2/3/4/6/8/10/20`, `--ts-fs-sm`, `--ts-fs-lg`, `--ts-letter-spacing-wider`, `--ts-text-secondary`, `--ts-border-0`, `--ts-bg-0`, `--ts-card-pad`.
- **Key `.ts-*` classes defined:**
  - `.ts-w-full`, `.ts-w-auto`, `.ts-h-full` — width/height helpers (NOTE: `.ts-h-full` is duplicated from `global-layout-utilities.css` L884).
  - `.ts-layout-elastic` + `.ts-layout-elastic .ts-container` — DUPLICATE of `configuration-utilities.css` L14-24.
  - `.ts-layout-content .ts-container` — DUPLICATE of `configuration-utilities.css` L27-29.
  - `:root.ts-fullpage` + scroll-snap selectors — DUPLICATE of `configuration-utilities.css` L32-42.
  - `.ts-parallax`, `.ts-parallax__overlay`, `.ts-parallax__content` (+ `h2`, `p`, `.ts-overline` descendants), `.ts-parallax__bg` — parallax hero/banner component (BEM-style modifiers).
  - `section.ts-h-full`, `section.ts-h-70`, `section.ts-h-50` (compound selectors) — fixed-attachment parallax section heights.
  - `.ts-parallax .ts-card > .ts-card-header.absolute` — card-header positioning inside parallax containers.
  - `.ts-parallax .ts-card:has(> .ts-card-header.absolute)` — `:has()` selector to add top padding when an absolute card-header is present.
  - `.demo-panel-col` — non-tokenized demo class (NOT `ts-` prefixed — likely scratch markup).
- **Owner annotations VERBATIM with line numbers:**
  - L1: `/* Width helpers */`
  - L15: `/* Elastic/Brutalist fullwidth layout */`
  - L27: `/* Content-focused layout (narrower) */`
  - L32: `/* Fullpage snap scrolling mode */`
- **Refactor flags:**
  - **CRITICAL — token sabotage / local override pattern:** L53 `--ts-bg-0: black;`, L61 `--ts-text-primary: white;`, L69 `--ts-text-secondary: #ffffff6b;` are declared **inside component selectors**, overriding the cascade scope. This is the exact "component declares system tokens" anti-pattern that Toolskin Design Tokens 2.0 forbids — components should only consume System tokens, never re-declare them. The `--ts-text-secondary: #ffffff6b` is also a hex literal with an alpha hack (`6b` = ~42% alpha), bypassing any apcach/OKLCH derivation. Direct hardcoded values that escape the design system.
  - **CRITICAL — DUPLICATION:** L15-43 are nearly byte-identical to `configuration-utilities.css` L14-42. Two source files contain the same `.ts-layout-elastic`, `.ts-layout-content`, and `:root.ts-fullpage` rules. One must be deleted in the rebuild; whichever ships last wins by source order, creating a fragile dependency on file ordering.
  - **Magic numbers:** L57 `font-size: clamp(2rem, 5vw, 3.5rem)` — clamp range not tokenized. L82 `max-width: 700px` — hardcoded. L90 `filter: brightness(0.35) saturate(1.4)` — magic values. L132 `height: 35px !important` — magic.
  - **`!important` proliferation:** L98-106 — `section.ts-h-full/-h-70/-h-50` block uses `!important` on `border-block-style`, `overflow`, `position`. Also L132 `height: 35px !important`, L136 `padding-top: calc(...) !important`.
  - **`section.ts-h-70` and `section.ts-h-50` are referenced but NOT defined** — these classes set `background-attachment: fixed`, but no companion utility class declares the `height: 70vh` / `height: 50vh` (or whatever was intended). Likely defined elsewhere; broken if not.
  - **`.demo-panel-col` (L139-143) lacks `ts-` prefix** — violates the design system's naming convention. Looks like leftover demo/scaffolding markup that should not be in a utility file.
  - **`:has()` selector (L135)** — modern selector; needs browser-support audit (Chromium 105+/Safari 15.4+/Firefox 121+).
  - **`background-attachment: fixed` (L89, L98)** — known performance and mobile compatibility issue; can break iOS Safari scrolling and cause repaints. Should be flagged as `@media (hover: hover) { ... }` or behind a feature query.
- **Session 3 relationship:**
  - **DIRECT IMPACT on surface chain:** L53 `--ts-bg-0: black` is a local override of a System surface token. If `.ts-parallax__overlay` ever appears inside a surface-superposition chain (like the one rebuilt in `surfaces.css`, commit `a0ea9e4`), this will BREAK the inheritance — `--ts-bg-0` is one of the keys the propagation engine reads from. The rebuild's `system/surfaces.css` must reject this pattern, or migrate parallax to use a derivative token (`--ts-this-bg`).
  - **DIRECT IMPACT on future `text.css`:** L61, L69 hardcode `--ts-text-primary: white` and `--ts-text-secondary: #ffffff6b`. These bypass the OKLCH `--ts-on-accent` auto-contrast pipeline (audit catalog L527 documents). The text layer rebuild must explicitly forbid component-local text token declarations.
  - **Informs future scroll/animation layer** — `.ts-parallax` + the `section.ts-h-*` set is the static side of the `ToolskinParallaxFallback` JS (audit catalog §1.20, L184).
- **Gap vs `_code-audit-catalog.md`:**
  - (a) Already covered: catalog §1.20 documents `ToolskinParallaxFallback`. Catalog L578 lists `.ts-bg-parallax` in the background engine class set (but not `.ts-parallax` itself). Catalog L501 covers `--ts-container-*`. Catalog L590 documents `.ts-fullpage` state class.
  - (b) NEW vs catalog: `.ts-parallax` + `.ts-parallax__overlay` + `.ts-parallax__content` + `.ts-parallax__bg` BEM family is not catalogued. The local-override anti-patterns (L53, L61, L69) are not catalogued. The duplication of layout utilities between this file and `configuration-utilities.css` is not catalogued. The `section.ts-h-{full,70,50}` parallax-section pattern is not catalogued. `.demo-panel-col` non-prefixed leak is not catalogued.
  - (c) Contradictions: catalog L578 names `.ts-bg-parallax` (a background engine variant), but this file declares `.ts-parallax` (no `-bg-` prefix), suggesting either a naming inconsistency in the source or two separate parallax systems. Owner should clarify.

---

## Annotation index (this section, line-numbered, verbatim)

- configuration-utilities.css:L1: `/* ─── §8e  Framework Configuration Utilities ─────────────────────────── */`
- configuration-utilities.css:L3: `/* Disable noise/grain globally or per-element */`
- configuration-utilities.css:L14: `/* Elastic/Brutalist fullwidth layout */`
- configuration-utilities.css:L26: `/* Content-focused layout (narrower) */`
- configuration-utilities.css:L31: `/* Fullpage snap scrolling mode */`
- configuration-utilities.css:L44: `/* Locomotive Scroll container */`
- configuration-utilities.css:L53: `/* CRITICAL: Prevent Locomotive from breaking layouts */`
- configuration-utilities.css:L54-56: `/* Don't apply transforms to layout-critical elements.\n\tNOTE: .ts-fade-up and .ts-fade-in are EXCLUDED — they need their\n\ttransforms for scroll reveal animations to work correctly. */`
- configuration-utilities.css:L67-68: `/* Reveal animations MUST keep their transforms even with [data-scroll].\n\tThe transition handles the animation; Locomotive should not override. */`
- configuration-utilities.css:L79: `/* Only allow transforms on specifically tagged parallax elements */`
- configuration-utilities.css:L85: `/* Allow transforms on inner elements that aren't animated */`
- global-layout-utilities.css:L1-3: `/* ═══════════════════════════════════════════════════════════════════════\n\t§7  UTILITIES\n\t═══════════════════════════════════════════════════════════════════════ */`
- global-layout-utilities.css:L5: `/* ─── §7a  Spacing Utilities ────────────────────────────────────────── */`
- global-layout-utilities.css:L775: `/* Max-width utilities */`
- global-layout-utilities.css:L816: `/* Gap overrides */`
- global-layout-utilities.css:L845: `/* Flex utilities */`
- global-layout-utilities.css:L893: `/* ─── §7b  Display / Visibility ─────────────────────────────────────── */`
- global-layout-utilities.css:L925: `/* ─── §7c  Text Utilities ───────────────────────────────────────────── */`
- global-layout-utilities.css:L941: `/* ─── §7d  Border Utilities ─────────────────────────────────────────── */`
- global-layout-utilities.css:L967: `/* ─── §7e  Interactive / Cursor ─────────────────────────────────────── */`
- global-layout-utilities-2.css:L1: `/* Width helpers */`
- global-layout-utilities-2.css:L15: `/* Elastic/Brutalist fullwidth layout */`
- global-layout-utilities-2.css:L27: `/* Content-focused layout (narrower) */`
- global-layout-utilities-2.css:L32: `/* Fullpage snap scrolling mode */`
