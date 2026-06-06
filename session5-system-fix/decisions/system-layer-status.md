# Decision — System Layer Status

**Current phase: Session 3.x (system extension) → unblock Session 4.**
**Source: 4-voice council, unanimous convergence (HEAD f7d5e19 → 00711b6).**

## The verdict (all 4 voices agree)

The system is ~80% there. Session 4 block work CANNOT begin until three
mechanical gaps close. These are NOT design decisions — they are
file-creation and reconciliation work. Estimated ~5 hours.

## DONE (verified on disk)
- primitives/colors.css — 10 presets, dual-emit hex+oklch, RULING 4 auto-ink
- primitives/typography.css, spacing.css, radius.css, motion.css — exist
- system/surfaces.css — hue-locked OKLCH derivative chain (hand-tuned literals)
- expert-designer v7 installed + dual-audit gate wired (00711b6)
- RULING 7 ΔL measured (docs/handoffs/_ruling-7-deltal-measurement-report.md)
- sandbox/00-design-reference/index.html — audit-clean, visually REJECTED

## BLOCKING — must close before Session 4 block 1

### B1 — Naming collision
sandbox-inline tokens (--ts-fs-base, --ts-fw-thin, --ts-sp-N flat) do NOT
match primitives files (--ts-font-weight-thin, --ts-sp-base × density).
RESOLUTION: sandbox names win. Rewrite primitives to sandbox vocabulary.
ONE source of truth before any component CSS. Effort: ~1h.

### B2 — Missing system files
system/text.css and system/accent.css do not exist.
- text.css: font tokens + fs ladder + lh + tracking + fw aliases
  (extract from sandbox L35-85; note RULING 3 OVERRIDE — base flexible)
- accent.css: --ts-accent-bright/dark/dim/dim-2/border, OKLCH-mixed
  against --ts-tone-contrast / --ts-tone-floor poles (NOT srgb, NOT hsl)
Effort: ~3h.

### B3 — JetBrains Mono not loaded
Declared at sandbox L38, only Space Grotesk loaded at L16.
Silent fallback to Consolas. One-line fix. Effort: 5min.

## PARALLEL — does NOT block Session 4
RULING 7 per-preset engine bake (Task 5). ΔL measured, generate-colors.js
not yet updated. Dark-surface degeneracy fix is in backups/oklch-surface
(recess toward oklch(0 0 0), not floor). Assign to a separate agent.

## Session 4 block order (dependency-optimized)
1. ts-input (4h) — needs B1+B2+B3
2. ts-btn (3h) — needs Block 1 height parity
3. ts-chip + ts-badge (3h) — needs Block 2
4. ts-card-stat / ts-card-feature (4h) — needs Blocks 1-3
5. ts-toolbar (4h) — needs Block 2
Total ~18h build + 3h audit = ~1 week.

## The four Tier-2 files the Architect demands (alternative framing)
text.css, spacing.css, shape.css, motion.css — extract from sandbox
inline :root. If the primitives already cover spacing/shape/motion,
B1 reconciliation resolves this. Verify on disk which exist before building.

## Skill-template conflict (Architect flag)
expert-designer/templates/tokens.css uses HSL accent + srgb mixes —
violates R1/R7. For THIS repo, components load rebuild primitives +
system files, NEVER the skill template tokens.css. The rebuild wins.
