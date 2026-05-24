# PRAGMATIST — Design Integration Council

> Voice: Pragmatist. Lens: implementation readiness. Fresh context, no knowledge of other voices.
> Question: "What must be spec'd / built / decided BEFORE the first Session 4 block sandbox opens — and what defers?"

---

## PASS/FAIL on visual identity alignment

**CONDITIONAL PASS — proceed with a 1-day system-extension sprint, then open Session 4.**

The sandbox at `sandbox/00-design-reference/index.html` (HEAD `3455437`) is genuinely production-honest: it loads the *real* `primitives/colors.css` + `system/surfaces.css`, every value is a token, the derivative chain works, the two-line idiom is demonstrated three layers deep. As an artifact that says "the engine is real," it ships. As a *base layer Session 4 will build on*, it has three concrete holes the Pragmatist call surfaces below (`§ Session 4 prereq checklist · BLOCKING`). Those holes are small (≤1 working day combined), mechanical, and unambiguous — fix them in a focused micro-session, then Session 4 opens on solid ground. **This is NOT a "redesign the system" call. This is a "tighten three known gaps" call.**

---

## Session 4 prereq checklist

### DONE (verified on disk, this session)
- `assets/css/next/primitives/colors.css` — 313 lines, 10 surface presets baked, dual-emit (hex + oklch), accent + auto-ink (RULING 4)
- `assets/css/next/primitives/typography.css` — exists (Session 2 transcription, RULING 3 13px base)
- `assets/css/next/primitives/spacing.css` — exists, sp-16 ceiling per RULING 5
- `assets/css/next/primitives/radius.css` — exists
- `assets/css/next/primitives/motion.css` — exists
- `assets/css/next/system/surfaces.css` — 131 lines, hue-locked OKLCH derivative chain, two-block inputs/derivatives split. Commit `a0ea9e4` (hue-lock floor + UI-grade borders)
- `expert-designer/scripts/audit-design.mjs` — LADDER_PX + SP arrays already aligned to RULING 3/5 (line 75, 81). HARD rules cover hex/important/1fr/100vh/banned-fonts
- `sandbox/00-design-reference/index.html` — 707 lines, audit-clean per commit `3455437` (`audit clean`)
- Expert-designer skill installed + promoted (`expert-designer/SKILL.md` + `.claude/skills/expert-designer/SKILL.md` per Task 1l)
- RULING 7 ΔL measurement complete — `docs/handoffs/_ruling-7-deltal-measurement-report.md` has per-preset constants ready for engine bake
- `.impeccable.md` exists (commit `dd72cf2`)

### IN-FLIGHT (partial — finish or formally defer)
- **Audit-design.mjs pre-commit wiring** (Task 1j) — NO `.claude/hooks/` directory exists on disk. Wiring was specified, not built. **Effort: 15 min.** Either ship the hook or strike Task 1j from the directive and rely on manual audit + CI later.
- **RULING 7 engine bake** (Task 5 / Pattern-16 Option B) — ΔL constants measured, generate-colors.js NOT YET updated to bake per-preset percentages. surfaces.css currently uses single global `--ts-this-bg-grad-bright-pct: 6%` etc. (works, but ΔL drifts across the 10 presets — measured 0.000 → 6.056 spread). **Effort: 2-3h.** See "Pragmatist call on Pattern-16 Option B" below.
- **Inline tokens vs system files** — sandbox declares typography/spacing/radius/motion tokens INLINE at `:root` (lines 34-117) under naming `--ts-fs-base`, `--ts-fw-thin`, `--ts-sp-1..16`, `--ts-radius-N`, `--ts-dur-fast`. But `assets/css/next/primitives/typography.css` already exists using a *different* naming convention (`--ts-font-weight-thin`, `--ts-sp-base/density/rhythm/ratio`). **This is a naming collision — Session 4 cannot resolve it ad-hoc per block.** Effort: 1h to reconcile.

### BLOCKING (must complete before Session 4 first block)
- **B1. Naming reconciliation: sandbox-inline tokens vs `assets/css/next/primitives/typography.css|spacing.css`.** The sandbox names (`--ts-fs-base`, `--ts-fw-thin`, `--ts-sp-N` flat scale) DO NOT MATCH the existing primitives files (`--ts-font-weight-thin`, `--ts-sp-base × density`). One must win. Pragmatist call: **the sandbox names win** (they're what audit-design.mjs and expert-designer references actually use). Rewrite `primitives/typography.css` + `primitives/spacing.css` to the sandbox vocabulary, OR move the sandbox's inline declarations *into* those files. Either way, ONE source of truth before any component CSS is written.
- **B2. system/text.css + system/accent.css MUST land** — surfaces.css references `--ts-text-primary`, `--ts-text-secondary`, `--ts-text-muted`, `--ts-accent`, `--ts-on-accent` from primitives. These work, but the *system layer* for text scale + accent derivative chain (e.g. `--ts-accent-dim`, `--ts-accent-bright`, `--ts-accent-dark` for icons + radial atmospheres) does not exist. Without these, the first molecular block (any block with an accent-tinted icon or atmosphere) will hardcode mixes inline → architecture violation on day one.
- **B3. JetBrains Mono load directive** — sandbox declares `--ts-font-mono: 'JetBrains Mono'` (line 38) but only loads Space Grotesk from Google Fonts (line 16). Silent fallback to Consolas on Windows. Session 4 blocks with mono labels (input chips, code blocks, tabular metrics) will render in wrong font. **Effort: 1 line, must ship.**

### NICE-TO-HAVE (defers safely)
- `--ts-alt` companion color in system layer — useful for Hero/Bento blocks but those are mid-Session 4
- Extended surface derivatives `dim-5/6`, `grad-2/3/4` — declared in checklist but not blocking the FIRST block
- system/nesting.css with `--ts-radius-nest-reduction` token — needed for nested card recipes, but block 1 (ts-input) doesn't nest
- showcase.html font load update (3 fonts allowed per .impeccable.md) — affects only the reference page
- Bento + featured/elevated treatments — block-natural arrival in Session 4 mid

---

## Session 4 block ordering proposal (first 5 blocks)

Block order optimized for **dependency-graph minimization** — each block ships tokens that subsequent blocks consume, so the system grows by accretion rather than retrofit.

| # | Block name | Tier | Tokens needed (must exist) | New tokens it SHIPS | ETA hours | Prereqs |
|---|---|---|---|---|---|---|
| 1 | **ts-input** (text input + label) | atomic | `--ts-this-bg-*` chain ✅, `--ts-text-*` ✅, `--ts-fs-caption/body` ✅, `--ts-radius-6` ✅, `--ts-sp-2/3/4` ✅ | `--ts-input-h`, `--ts-input-pad-x`, `--ts-input-label-color` (component-local per RULING 9) | 4h | B1, B2 (text.css), B3 |
| 2 | **ts-btn variants** (primary/outline/ghost/icon) | atomic | All from input + `--ts-accent`, `--ts-on-accent` ✅ | `--ts-btn-h`, `--ts-btn-pad-x`, `--ts-btn-icon-size` | 3h | Block 1 (input height parity) |
| 3 | **ts-chip + ts-badge** (status pills) | atomic | All above + `--ts-radius-full` ✅ | `--ts-chip-h`, `--ts-chip-pad-x`, `--ts-chip-text-color` derivatives | 3h | Block 2 (chip = mini-btn shape) |
| 4 | **ts-card-stat / ts-card-feature** (atomic cards) | molecular | All above + nest `--ts-this-bg` re-anchor ✅ | `--ts-card-pad`, `--ts-card-gap`, `--ts-card-icon-size` | 4h | Blocks 1-3 (cards compose buttons + chips) |
| 5 | **ts-toolbar** (horizontal control strip) | layout | All above + `--ts-this-bg-grad` ✅ | `--ts-toolbar-h`, `--ts-toolbar-pad-x`, `--ts-toolbar-gap` | 4h | Block 2 (toolbar = button row + dividers) |

**Total first 5 blocks: 18 hours of component work** (≈3 working days). Plus prereqs (B1+B2+B3 = ~5h). Plus Pattern-16 engine bake if done in parallel (~3h). **Realistic 1-week sprint to ship the first 5 blocks.**

---

## System gap → who fills it, when

| Gap | Source-of-truth file (when shipped) | Session 4 block that needs it | Effort to ship gap |
|---|---|---|---|
| Token-naming collision (sandbox inline vs primitives/*.css) | Rewrite `primitives/typography.css` + `primitives/spacing.css` to sandbox vocabulary OR migrate sandbox inline → primitives | Block 1 (ts-input) needs ONE consistent `--ts-fs-*` + `--ts-sp-*` set | 1h |
| Accent derivative chain (`--ts-accent-dim`, `--ts-accent-bright`, `--ts-accent-dark`, `--ts-on-accent` system mirror) | `assets/css/next/system/accent.css` (new file) | Block 4 (ts-card-feature with icon), Block 5 (toolbar active-state) | 2h |
| Text scale system layer (semantic aliases over primitive `--ts-fs-N`) | `assets/css/next/system/text.css` (new file) | Block 1 (ts-input — label/value/helper sizes) | 1.5h |
| JetBrains Mono load | `sandbox/00-design-reference/index.html` line 16-17 + future `system/fonts.css` | Any block with mono (Block 3 chip if numeric, Block 4 stat-card metric) | 5 min |
| RULING 7 per-preset constants baked | `tools/color-engine/generate-colors.js` + regenerated `primitives/colors.css` | All blocks — affects derivative chain accuracy on non-default presets | 3h |
| Pre-commit audit hook | `.claude/hooks/pre-commit.sh` (new file) | Optional — gates ALL blocks via CI | 15 min |
| `--ts-alt` companion color | `system/accent.css` (extend) | Block 6+ (Hero, Bento — NOT first 5) | 1h |
| Nest-reduction radius token | `system/nesting.css` (new file) | Block 7+ (nested cards) | 1h |

---

## Time estimates

- **System-layer extensions to unblock Session 4 (B1+B2+B3):** ~5 hours
- **First Session 4 block (ts-input):** ~4 hours
- **First 5 Session 4 blocks (atomic + first molecular + first layout):** ~18 hours of build + ~3h of inter-block audit = 21h
- **Realistic Session 4 calendar to ship first 5 blocks:** **1 week** (5 working days at 5h/day) including audit + sandbox + commit cycles
- **RULING 7 engine bake (Task 5) IF run in parallel:** +3h, no schedule impact if done by a separate agent

---

## Critical gate question

**Can Session 4 block work begin TODAY against current system layer?**

**NO-BUT-MINIMAL-EXTENSION.** 

Reasoning: The system is 80% there. The derivative chain works, primitives load, surfaces.css is honest. But three concrete gaps will force *every* Session 4 block to either hardcode workarounds or invent ad-hoc tokens:

1. **Naming collision (B1)** — Session 4 cannot pick `--ts-fw-thin` vs `--ts-font-weight-thin` per block. Resolve once, not 30 times.
2. **No system/accent.css (B2)** — Block 4 (ts-card-feature) needs accent-tinted icon backgrounds. Without `--ts-accent-dim` system token, it will inline `color-mix(in oklch, var(--ts-accent), transparent 88%)` → architecture violation.
3. **Mono font not loaded (B3)** — Silent visual regression on any mono surface; trivial to fix, embarrassing if shipped 5 blocks deep.

Fix B1+B2+B3 in a **5-hour focused micro-session** (one agent, mechanical edits, no design decisions required), then Session 4 opens cleanly on day 2.

---

## Pragmatist call on the special items raised

### Inline tokens in sandbox: pattern acceptable?
**NO — must move to system files before Session 4.** The sandbox declared tokens inline as a *transitional* expedient (per its own comment line 24: "until system/text.css / system/spacing.css ship"). Honor that comment — ship the system files. Otherwise Session 4 blocks will copy the inline pattern thinking it's canonical, and every block will redeclare typography tokens at component scope. That's architectural rot on day one.

### audit-design.mjs pre-commit hook wiring (Task 1j)
**Confirmed NOT wired.** `.claude/hooks/` directory does not exist. Either ship the hook (15-min fix) OR formally strike Task 1j from the directive and gate via `npm run audit` in CI later. **Pragmatist call: ship the hook this micro-session.** Saves three "we forgot to audit" incidents in Session 4.

### Pattern-16 Option B (RULING 7 engine bake): block Session 4 or parallel?
**Run in parallel.** The current single-global `--ts-this-bg-grad-bright-pct: 6%` (etc.) works on the default preset and degrades gracefully on the other 9 (ΔL spread 0-6 — measurable but not visually catastrophic per the ΔL report's `bright` column). Session 4's first 5 blocks demo on the default preset; the engine bake improves preset switching but doesn't gate atomic component work. **Assign Agent A to Task 5 (engine bake) while a different agent opens Session 4 Block 1 (ts-input). They don't conflict; surfaces.css formulas don't change, only the per-preset constants do.**

### Math degeneracy in Task 5 (gradDarkPct=100% on dark presets)
**Per the ΔL report, the `dark` derivative on `light-*` presets hits ΔL -10.586** (which is correct — large dark step against a near-white floor). The reverse on dark presets shows `dark: -1.353` to `-1.401` ΔL — *very small* because dark surfaces are already near the floor anchor. The 100% degeneracy mentioned likely arose because the prior agent tried to fit "Lc 8" against a base that's already near the floor; floor-anchor solver returns saturate-100% when no solution exists in the [0,100] range. **Pragmatist call: use a relaxed target (`Lc 6` on dark presets where Lc 8 is infeasible) AND clamp engine output to 80% max. Document the per-theme target in the engine. This is engineering, not redesign.**

### Four binding patterns from prior council
- **Pattern 4 (two-line idiom)** — sandbox demos this clearly. ✅ CONFIRMED.
- **Patterns 1-3 (inputs nested, iconlist LAYER-1/2, nest-reduction)** — defer to Session 4 first blocks. ✅ SAFE to defer. Pattern 1 (inputs nested) is literally Block 1; the other two are Block 4-7 territory.

---

## Priority order

### MUST SHIP THIS WEEK to unblock Session 4 (the 5-hour micro-session)
1. B1 — Reconcile token naming (sandbox-inline → primitives files, OR rewrite primitives to sandbox names). **1h.**
2. B2 — Ship minimal `system/text.css` (semantic aliases) + `system/accent.css` (3-knob accent derivative chain). **3h.**
3. B3 — Add JetBrains Mono Google Fonts URL to the sandbox + future fonts file. **5 min.**
4. Task 1j — Create `.claude/hooks/pre-commit.sh` running audit-design.mjs on touched HTML. **15 min.**
5. Generate updated `colors.css` if any preset edits land. **5 min.**

### SHIP IN PARALLEL with Session 4 opening blocks
- Task 5 (RULING 7 engine bake) — assign to a separate agent. Doesn't gate Block 1-3. **3h.**
- `--ts-alt` system token — needed mid-Session 4 (Block 6+), not first 5. **1h.**
- Extended surface derivatives (`dim-5/6`, `grad-2/3/4`) — add when first block surfaces a need. **1h.**
- showcase.html font load update — pure reference page, parallel work. **5 min.**

### DEFER until first 3 blocks ship
- `system/nesting.css` + `--ts-radius-nest-reduction` token — first need arrives at Block 7 (nested card). **1h when needed.**
- Bento / Hero / Pricing identity patterns — block-natural arrival mid-late Session 4. **No prep needed now.**
- Reveal-on-scroll motion utility — Session 5 territory.
- Multi-column footer recipes — Session 5+.

---

## Pragmatist verdict

Session 4 opens **next working day after a 5-hour micro-session** (B1+B2+B3 + hook wiring), against a system layer that has 1 reconciled token naming convention, 2 new system files (`accent.css`, `text.css`), 1 added Google Fonts URL (JetBrains Mono), and 1 wired pre-commit gate. The first 5 blocks (ts-input, ts-btn, ts-chip+badge, ts-card-stat+feature, ts-toolbar) ship in approximately **1 calendar week**, building each on the previous block's tokens with zero architectural retrofit. Pattern-16 Option B (engine bake) runs as a parallel side-quest by Agent A and merges back when ready — it does not gate component work. The sandbox is honest enough as a base; the gaps are small enough to close mechanically; the block order is dependency-clean enough to grow the system by accretion. **Open Session 4 on Tuesday.**
