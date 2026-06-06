# Council voice — Design Skeptic
**Author:** Design Skeptic
**Date:** 2026-05-25
**HEAD:** f095d75

## Q1 — Dark-surface fix
**Identity verdict:** The PREVIOUS file's recession toward `oklch(0 0 0)` is CORRECT and preserves OKLCH surface-hue identity. Pure-black recession in `color-mix(in oklch, ...)` lowers L while LEAVING the chroma and hue of `--ts-this-bg` untouched (mixing into a 0-chroma anchor reduces only the luminance contribution proportionally — the resulting hue is the source hue retained at the unmixed weight). The current `--ts-tone-floor` recession is what muddies darks, because on dark presets `tone-floor` derives from `--ts-bg-body` (L≈15%) and `--ts-this-bg` derives from `--ts-bg-1` (L≈20%) — a 5-point delta that, mixed at 10%, yields ΔL ≈ 0.5 (invisible; fails Architect target ΔL ≥ 3.0).

**Concrete edit:**
- file: `assets/css/next/system/surfaces.css`
- diff (line 131-133 + line 51):
  ```
  - --ts-this-bg-grad-dark-pct:   10%;
  + --ts-this-bg-grad-dark-pct:   14%;
  ...
  - --ts-this-bg-dark:   color-mix(in oklch, var(--ts-this-bg), var(--ts-tone-floor) var(--ts-this-bg-grad-dark-pct));
  - --ts-this-bg-dark-1: color-mix(in oklch, var(--ts-this-bg), var(--ts-tone-floor) calc(var(--ts-this-bg-grad-dark-pct) * 0.5));
  - --ts-this-bg-dark-2: color-mix(in oklch, var(--ts-this-bg), var(--ts-tone-floor) calc(var(--ts-this-bg-grad-dark-pct) * 0.85));
  + --ts-this-bg-dark:   color-mix(in oklch, var(--ts-this-bg), oklch(0 0 0) var(--ts-this-bg-grad-dark-pct));
  + --ts-this-bg-dark-1: color-mix(in oklch, var(--ts-this-bg), oklch(0 0 0) calc(var(--ts-this-bg-grad-dark-pct) * 0.5));
  + --ts-this-bg-dark-2: color-mix(in oklch, var(--ts-this-bg), oklch(0 0 0) calc(var(--ts-this-bg-grad-dark-pct) * 0.85));
  ```
- Keep `--ts-this-bg-bright` recessing toward `--ts-tone-contrast` (line 142). Asymmetry is intentional: bright recesses toward an inverted text-L anchor (preserves theme), dark recesses toward absolute black (escapes the floor degeneracy).
- Also update line 146 `--ts-this-bg-active` from `--ts-tone-floor` to `oklch(0 0 0)` for the same reason (active state must visibly recede on dark presets).

**Identity-risk callout:** Pure-black recession is safe ONLY because `color-mix(in oklch, srcHue, 0-chroma-anchor X%)` preserves the source hue. If anyone "modernizes" this to `color-mix(in srgb, ...)` later, the engineered hue collapses to neutral gray and the bichromatic identity (VQ-7) silently dies on every dark surface. Lock with an `@OWNER_DIRECTIVE` comment above the block: **"oklch interpolation space is mandatory; srgb here kills hue identity."** Also: on LIGHT presets the same fix moves --ts-this-bg-dark toward 0, which will push it past bg-body — verify on the light preset audit that bg-dark stays ABOVE pure black by ≥0.05L so we don't crush card shadows.

## Q2 — Owner notes integration order
**Identity ordering rationale:** Items that protect the engine's STRUCTURAL guarantees (color engine isolation, border derivation) ship first because they prevent token-architecture rot from spreading into Session 4 block work. Items that are visual flourishes (alternating surfaces, grid background) can wait without compromising the Wave 1.5/1.6 DNA because the bento + accent-painted tile + radial-gradient hero (VQ-3/4/6/7) carry identity even with static section backgrounds.

**Order (Session 3.x first, then Session 4+):**
1. **(3.x — NOW)** Borders derived from text tokens, NOT currentColor. Already encoded in the PREVIOUS file (`--ts-this-bg-border: color-mix(in oklch, --ts-this-bg, --ts-tone-contrast var(--ts-mix-perc))`). Promote to system/surfaces.css lines 173-179 as the standard; ban `currentColor` borders in audit/checklist.md §2 (already listed — enforce).
2. **(3.x — NOW)** Color engine delegated OUT of general tokens — split today as part of B2: `system/accent.css` owns OKLCH accent derivatives + on-accent auto-ink + state palettes (error/success/warning/disabled with their own `--ts-on-*` ink). `primitives/colors.css` keeps ONLY the three knobs + raw preset bake. No mixing logic in general tokens.
3. **(3.x — NOW)** Alternating-surface system becomes contrast-driven and theme-agnostic. Concrete spec: `.ts-section--alt { --ts-this-bg: color-mix(in oklch, var(--ts-this-bg, var(--ts-bg-body)), var(--ts-tone-contrast) 4%); }`. Single rule, no light/dark branching. Ship now because B1 naming reconciliation already touches surface tokens; doing this later means a second pass over the same files.
4. **(Session 4+ — LATER)** `.bg-grid` utility tokenized via `background-image` only. Defer because it is a non-blocking utility — sandbox blocks 1-3 (input, button, chip) don't need it; only when we reach hero/landing surfaces (Block 5+) does it gate anything.

**Identity-risk callouts:**
- Item 1 (borders): if delayed, every Block 1-3 component invents its own border strategy → component-block proliferation kills "one knob → repaint" promise.
- Item 3 (alt surfaces): if shipped as static values (current trap), VQ-3 (≥3 distinct backgrounds) silently regresses into "same background everywhere" on every preset that isn't the dev default.
- Item 4 (grid bg): MUST be `background-image` not shorthand `background:` — shorthand resets `background-color` and obliterates the surface layer. Add an audit grep: `background:` followed by `url\|gradient` in component layer = FAIL.

## Q3 — Font scaling
**IMPROVE** (do not replace).

**Minimum adoption scope:**
- Display/hero tokens ONLY: `--ts-fs-display`, `--ts-fs-hero`, `--ts-fs-h1`, `--ts-fs-h2`. These are the slots where viewport-width responsiveness materially affects identity (VQ-1 hero headline ≥ step 7).
- Role aliases (`--ts-fs-h1...h6`, `--ts-fs-lead`, `--ts-fs-body`, `--ts-fs-caption`) stay as the consumed surface.
- Numeric ladder `--ts-fs-1..9` REMAINS as the harmonic-ratio engine underneath. Display tokens become `clamp()` wrappers around two adjacent ladder steps.

**Concrete proposal:**
- In `system/text.css` (to be created in B2), add after the numeric ladder:
  ```
  /* Width-aware display tokens — clamp between two adjacent ladder steps */
  --ts-fs-hero:    clamp(var(--ts-fs-7), calc(var(--ts-fs-7) + (var(--ts-fs-9) - var(--ts-fs-7)) * ((100vw - 480px) / (1440 - 480))), var(--ts-fs-9));
  --ts-fs-display: clamp(var(--ts-fs-6), 6vw + 1rem, var(--ts-fs-8));
  --ts-fs-h1:      clamp(var(--ts-fs-5), 4vw + 0.5rem, var(--ts-fs-7));
  --ts-fs-h2:      clamp(var(--ts-fs-4), 3vw + 0.5rem, var(--ts-fs-6));
  /* Per-scope rescale (semantic) — does NOT touch ratio */
  --ts-fs-scale: 1;
  ```
- Body/caption stay on the laddered values (reading is not viewport-responsive — line length is). Do NOT introduce `xs/sm/lg/xl` semantic names for body slots — that is the path that flattens harmonic identity.
- `audit-design.mjs` LADDER_PX validates ladder steps only; display tokens are exempted (whitelist `--ts-fs-(hero|display|h1|h2)`) because clamp output by definition lives between two valid ladder values.

**Identity-risk callout:** Semantic names `xs/sm/lg/xl` on size tokens themselves are a TRAP — they erase the harmonic ratio that gives Toolskin its typographic rhythm. The role aliases (h1, lead, caption) are ALREADY semantic — that is the right layer for semantics. Owner's "semantic units" intent is satisfied by exposing `--ts-fs-hero/display/h1` (semantic) consumed by components, while the ratio engine lives below. Do not rename `--ts-fs-1..9` to `xs..3xl` under any framing.

## Q4 — B1/B2/B3 confirmation
**CONFIRM with one addition.**

**Order:** 1. B1 naming → 2. B2 text.css + accent.css → 3. B3 mono font load

**New blocker (if any):** **B4 — Visual Quality gate on system/surfaces.css FIX-VERIFICATION.** Before any Block 1 component CSS, render the existing `sandbox/00-design-reference/index.html` (which is audit-clean but visually REJECTED per system-layer-status.md) with the Q1 dark-surface fix applied AND switch the active preset to a dark non-default preset (e.g. `.ts-preset-2` or `.ts-preset-3`). If VQ-3 (≥3 distinct backgrounds visibly distinguishable) fails on any preset, the engine is still broken regardless of audit-design.mjs exit code. This is identity-critical because the bento accent-painted tile (VQ-4/6) depends on bg-1, bg-dark, and accent being mutually distinguishable — if the dark-surface degeneracy persists on any of the 10 presets, surface superposition under compositional pressure fails silently. ~30min to add (one screenshot per preset, eyeball ΔL on the three bento backgrounds).

Additionally, the owner's `LAYOUT FAILURE @OWNER_REVIEW` note is itself an implicit blocker on any HTML deliverable until starter-pattern compliance is restored — but that is a per-deliverable gate, not a system blocker. The existing dual-audit pre-commit handles it. Do not promote to B5.

## Identity invariants this integration MUST preserve (5-line summary)
- **OKLCH-as-interpolation-space is non-negotiable** — every `color-mix` in system/* uses `in oklch`. srgb mixes silently kill hue identity on every recession (VQ-7 bichromatic identity dies first).
- **Three-knob promise** — `--ts-accent-h/-s/-l` change → whole UI repaints. Any token that bakes a hue OUTSIDE the engine (e.g. hardcoded purple, srgb fallback) breaks the proof of concept (VQ-5).
- **Bichromatic, not monochromatic** — `--ts-alt` must be declared and used in the hero radial atmosphere. Single-accent surfaces are a regression even if audit-clean.
- **Harmonic ratio survives semantic layering** — role aliases (h1/lead/body) are semantic; size tokens (`--ts-fs-1..9`) are harmonic. Do not collapse the two layers.
- **Mono-as-machine-voice + numbered section chrome (/ 01)** — VQ-2 and VQ-8 are silent-failure traps. JetBrains Mono LOADED, not just declared. Section numbers in mono with leading slash.

COUNCIL VOICE COMPLETE — Design Skeptic — handoffs/_design-integration-council-skeptic.md
