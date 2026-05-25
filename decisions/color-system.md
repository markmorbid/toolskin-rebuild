# Decision — Color System

**The color engine is delegated OUT of the general token layer.**
**Owner directive: OKLCH logic, inversions, state variants, accent systems
belong in a dedicated color-engine layer, not in general tokens.**

## The three knobs (R1)
--ts-accent-h / -s / -l. Change these three → reskin everything.
Accent is OKLCH-baked via apcach (NOT hsl). Rebuild primitives/colors.css
is correct: --ts-accent: oklch(...) with hex fallback.

## Auto-ink (R4)
--ts-on-accent: oklch(from var(--ts-accent) clamp(0,(0.75-l)*999,1) 0 0)
Threshold 0.75 — mid-tone accents (orange/red) keep white text in dark mode.
Same pattern produces --ts-on-surface (luminance pivot, threshold 0.5).

## The purple artifact — FIXED (owner)
ROOT CAUSE: neutral surface had residual blue channel; direct mix with
accent introduced hue shift → purple.
FIX: desaturated base for contrast token + reduced chroma + percentage-based
mixing. Result: stable focus color, no hue drift.

## Borders — currentColor is BANNED as a global strategy (owner @CRITICAL)
currentColor is NOT reliably inheritable; breaks without explicit text color.
CORRECT: derive borders from text tokens (--ts-text-primary/secondary/muted)
mixed with surface. Each border-* maps to its bg-*. Use dim variants +
transparency for intensity. Borders are COMPUTED tokens, never inherited.
--ts-this-bg-border allowed only as a simple static surface-bound fallback.

## Surfaces — the failure being fixed (owner)
PROBLEM: static surface usage (not computed); dark clamp removes lower
bound so dark == base; presets (warm/cool) not propagating.
FIX: OKLCH contrast-based derivation; remove static values; fix clamp.

## RULING 7 dark-surface degeneracy — THE FIX
On dark presets, --ts-bg-body and --ts-bg-1 are only ~2-5 L-points apart.
Recessing --ts-this-bg-dark TOWARD the floor anchor yields a step too
small to see (the "gradDarkPct=100%" degeneracy the agent hit).

CORRECT FIX (in backups/oklch-surface-system-PREVIOUS.css):
  --ts-this-bg-dark: color-mix(in oklch, var(--ts-this-bg),
                               oklch(0 0 0) var(--ts-this-bg-grad-dark-pct, 14%));
Recess toward PURE BLACK, not toward the floor. The Architect independently
confirmed this exact approach: oklch(from var(--ts-this-bg) calc(l - 6) 0 0)
for an absolute ΔL target per theme.

Per-theme ΔL targets (Architect): dark ΔL ≥ 3.0, light ΔL ≥ 4.0.
Per-preset bake (Pattern-16 Option B): generate-colors.js iterates all 10
presets, emits .ts-preset-{id} derivative-knob overrides.

## Missing palettes (owner — must add)
State palettes: error/success/warning/disabled, each base + 7 dim levels.
Status colors go in primitives/colors.css (brand-fixed, OKLCH not HSL),
APCA-verified, with --ts-on-{status} auto-ink.

## OPEN — surface superposition / alternating sections
The .ts-section--alt experimental system must become contrast-driven and
theme-agnostic (no light/dark branching), with automatic nesting handling
for sections/cards/inputs. Currently static. → council to design.

## Grid background system (owner)
Tokenize via .bg-grid class: size, spacing, line-color, opacity. Applied
as background-image, coexists with background-color, never overrides it.
