# RULING 7 — Sub-floor ΔL measurement (canonical constants per preset)

Source: docs/references/toolskin.css_extracted-core-blocks-to-refactor/root-tokens-blocks-reference.css L892–953
Base anchor: each preset's `--ts-bg-1` (matches surfaces.css default `--ts-this-bg`).
Measurement: OKLCH lightness via culori, on color-mix(in srgb, …) replay.

## ΔL per preset × derivative (signed, OKLCH lightness percentage points)

| Preset | base L | bright +%6 | bright-1 +%4 | bright-2 +%8 | bright-3 +%14 | dark −%14 | dark-1 −%2 | dark-2 −%12 | active −%15 | hover +text%30 |
|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|
| `dark-neutral-cool-v1` | 19.64 |  6.0273 |  3.9191 |  8.0496 | 13.6503 | -1.4011 | -0.0511 | -1.2409 | -1.4011 | 26.5231 |
| `dark-warm-slate-v2` | 19.47 |  6.0435 |  3.9305 |  8.0715 | 13.6808 | -1.3532 |  0.0000 | -1.0643 | -1.4032 | 26.4761 |
| `dark-blue-tinted-v3` | 19.19 |  6.0560 |  3.9388 |  8.0861 | 13.7052 | -1.4097 | -0.0516 | -0.9543 | -1.4097 | 26.8438 |
| `dark-practical-neutral-v1` | 20.92 |  5.9548 |  3.8698 |  7.6959 | 13.1602 | -1.3750 | -0.0450 | -1.3290 | -1.6656 | 24.7315 |
| `dark-practical-cool-v2` | 20.86 |  5.9555 |  3.8702 |  7.6950 | 13.2587 | -1.3771 | -0.0468 | -1.3290 | -1.6693 | 24.4996 |
| `light-neutral-clean-v1` | 98.76 |  0.0000 |  0.0000 |  0.0000 |  0.2702 | -10.5862 | -1.4943 | -9.0552 | -11.4300 | -21.7886 |
| `light-warm-paper-v2` | 98.76 |  0.0000 |  0.0000 |  0.0000 |  0.2702 | -10.5862 | -1.4943 | -9.0552 | -11.4300 | -21.7886 |
| `light-cool-professional-v3` | 99.06 |  0.0000 |  0.0000 |  0.0000 |  0.0757 | -10.5777 | -1.4932 | -9.0479 | -11.4987 | -22.0867 |
| `light-practical-clean-v1` | 96.97 |  0.2996 |  0.0000 |  0.2996 |  0.3756 | -10.3301 | -1.5013 | -8.8212 | -11.2560 | -21.2672 |
| `light-practical-cool-v2` | 96.70 |  0.2998 |  0.0000 |  0.2998 |  0.5711 | -10.3378 | -1.5023 | -8.8279 | -11.1860 | -21.2843 |

## Aggregate ΔL by derivative — min / mean / max across all 10 presets

| Derivative | min ΔL | mean ΔL | max ΔL | spread |
|---|--:|--:|--:|--:|
| bright   | 0.000 | 3.064 | 6.056 | 6.056 |
| bright1  | 0.000 | 1.953 | 3.939 | 3.939 |
| bright2  | 0.000 | 4.020 | 8.086 | 8.086 |
| bright3  | 0.076 | 6.902 | 13.705 | 13.630 |
| dark     | -10.586 | -5.933 | -1.353 | 9.233 |
| dark1    | -1.502 | -0.768 | 0.000 | 1.502 |
| dark2    | -9.055 | -5.072 | -0.954 | 8.101 |
| active   | -11.499 | -6.435 | -1.401 | 10.098 |
| hover    | -22.087 | 2.086 | 26.844 | 48.931 |

## RULING 7 canonical sub-floor constants (per-preset OKLCH ΔL targets)

These are the values that generate-colors.js MUST bake per preset.
In surfaces.css the formula becomes `color-mix(in oklch, base, tone-X, var(--ts-this-bg-grad-Y-pct))`
where the percentage is engine-derived to hit the measured ΔL on each preset.

Targets (per RULING 7 constant table):
  --ts-this-bg-grad-bright-pct  → Lc 6 (sub-floor) — measured `bright` (+%6 white)
  --ts-this-bg-grad-dark-pct    → Lc 8 (sub-floor) — measured `dark` (−%14 black)
  --ts-mix-perc-active-surface  → Lc 8 — measured `active` (−%15 black)
  --ts-mix-perc-hover-surface   → Lc 12 — APCA range; calculate separately

## Detailed measurements (full table)

| Preset | Derivative | base hex | derived hex | base L% | derived L% | ΔL |
|---|---|---|---|--:|--:|--:|
| `dark-neutral-cool-v1` | bright   | `#13151b` | `#212329` | 19.64 | 25.66 | 6.0273 |
| `dark-neutral-cool-v1` | bright1  | `#13151b` | `#1c1e24` | 19.64 | 23.55 | 3.9191 |
| `dark-neutral-cool-v1` | bright2  | `#13151b` | `#26282d` | 19.64 | 27.69 | 8.0496 |
| `dark-neutral-cool-v1` | bright3  | `#13151b` | `#34363b` | 19.64 | 33.29 | 13.6503 |
| `dark-neutral-cool-v1` | dark     | `#13151b` | `#101217` | 19.64 | 18.23 | -1.4011 |
| `dark-neutral-cool-v1` | dark1    | `#13151b` | `#13151a` | 19.64 | 19.58 | -0.0511 |
| `dark-neutral-cool-v1` | dark2    | `#13151b` | `#111218` | 19.64 | 18.39 | -1.2409 |
| `dark-neutral-cool-v1` | active   | `#13151b` | `#101217` | 19.64 | 18.23 | -1.4011 |
| `dark-neutral-cool-v1` | hover    | `#13151b` | `#57585e` | 19.64 | 46.16 | 26.5231 |
| `dark-warm-slate-v2` | bright   | `#151419` | `#232227` | 19.47 | 25.51 | 6.0435 |
| `dark-warm-slate-v2` | bright1  | `#151419` | `#1e1d22` | 19.47 | 23.40 | 3.9305 |
| `dark-warm-slate-v2` | bright2  | `#151419` | `#28272b` | 19.47 | 27.54 | 8.0715 |
| `dark-warm-slate-v2` | bright3  | `#151419` | `#363539` | 19.47 | 33.15 | 13.6808 |
| `dark-warm-slate-v2` | dark     | `#151419` | `#121116` | 19.47 | 18.12 | -1.3532 |
| `dark-warm-slate-v2` | dark1    | `#151419` | `#151419` | 19.47 | 19.47 | 0.0000 |
| `dark-warm-slate-v2` | dark2    | `#151419` | `#121216` | 19.47 | 18.40 | -1.0643 |
| `dark-warm-slate-v2` | active   | `#151419` | `#121115` | 19.47 | 18.07 | -1.4032 |
| `dark-warm-slate-v2` | hover    | `#151419` | `#58575c` | 19.47 | 45.94 | 26.4761 |
| `dark-blue-tinted-v3` | bright   | `#12141a` | `#202228` | 19.19 | 25.24 | 6.0560 |
| `dark-blue-tinted-v3` | bright1  | `#12141a` | `#1b1d23` | 19.19 | 23.13 | 3.9388 |
| `dark-blue-tinted-v3` | bright2  | `#12141a` | `#25272c` | 19.19 | 27.28 | 8.0861 |
| `dark-blue-tinted-v3` | bright3  | `#12141a` | `#33353a` | 19.19 | 32.89 | 13.7052 |
| `dark-blue-tinted-v3` | dark     | `#12141a` | `#0f1116` | 19.19 | 17.78 | -1.4097 |
| `dark-blue-tinted-v3` | dark1    | `#12141a` | `#121419` | 19.19 | 19.14 | -0.0516 |
| `dark-blue-tinted-v3` | dark2    | `#12141a` | `#101217` | 19.19 | 18.23 | -0.9543 |
| `dark-blue-tinted-v3` | active   | `#12141a` | `#0f1116` | 19.19 | 17.78 | -1.4097 |
| `dark-blue-tinted-v3` | hover    | `#12141a` | `#56585d` | 19.19 | 46.03 | 26.8438 |
| `dark-practical-neutral-v1` | bright   | `#17181b` | `#252629` | 20.92 | 26.88 | 5.9548 |
| `dark-practical-neutral-v1` | bright1  | `#17181b` | `#202124` | 20.92 | 24.79 | 3.8698 |
| `dark-practical-neutral-v1` | bright2  | `#17181b` | `#2a2a2d` | 20.92 | 28.62 | 7.6959 |
| `dark-practical-neutral-v1` | bright3  | `#17181b` | `#37383b` | 20.92 | 34.08 | 13.1602 |
| `dark-practical-neutral-v1` | dark     | `#17181b` | `#141517` | 20.92 | 19.55 | -1.3750 |
| `dark-practical-neutral-v1` | dark1    | `#17181b` | `#17181a` | 20.92 | 20.88 | -0.0450 |
| `dark-practical-neutral-v1` | dark2    | `#17181b` | `#141518` | 20.92 | 19.59 | -1.3290 |
| `dark-practical-neutral-v1` | active   | `#17181b` | `#141417` | 20.92 | 19.26 | -1.6656 |
| `dark-practical-neutral-v1` | hover    | `#17181b` | `#565759` | 20.92 | 45.66 | 24.7315 |
| `dark-practical-cool-v2` | bright   | `#16181c` | `#24262a` | 20.86 | 26.82 | 5.9555 |
| `dark-practical-cool-v2` | bright1  | `#16181c` | `#1f2125` | 20.86 | 24.73 | 3.8702 |
| `dark-practical-cool-v2` | bright2  | `#16181c` | `#292a2e` | 20.86 | 28.56 | 7.6950 |
| `dark-practical-cool-v2` | bright3  | `#16181c` | `#37383c` | 20.86 | 34.12 | 13.2587 |
| `dark-practical-cool-v2` | dark     | `#16181c` | `#131518` | 20.86 | 19.49 | -1.3771 |
| `dark-practical-cool-v2` | dark1    | `#16181c` | `#16181b` | 20.86 | 20.82 | -0.0468 |
| `dark-practical-cool-v2` | dark2    | `#16181c` | `#131519` | 20.86 | 19.54 | -1.3290 |
| `dark-practical-cool-v2` | active   | `#16181c` | `#131418` | 20.86 | 19.19 | -1.6693 |
| `dark-practical-cool-v2` | hover    | `#16181c` | `#55565a` | 20.86 | 45.36 | 24.4996 |
| `light-neutral-clean-v1` | bright   | `#fafbfc` | `#fafbfc` | 98.76 | 98.76 | 0.0000 |
| `light-neutral-clean-v1` | bright1  | `#fafbfc` | `#fafbfc` | 98.76 | 98.76 | 0.0000 |
| `light-neutral-clean-v1` | bright2  | `#fafbfc` | `#fafbfc` | 98.76 | 98.76 | 0.0000 |
| `light-neutral-clean-v1` | bright3  | `#fafbfc` | `#fbfcfc` | 98.76 | 99.03 | 0.2702 |
| `light-neutral-clean-v1` | dark     | `#fafbfc` | `#d7d8d9` | 98.76 | 88.17 | -10.5862 |
| `light-neutral-clean-v1` | dark1    | `#fafbfc` | `#f5f6f7` | 98.76 | 97.27 | -1.4943 |
| `light-neutral-clean-v1` | dark2    | `#fafbfc` | `#dcddde` | 98.76 | 89.71 | -9.0552 |
| `light-neutral-clean-v1` | active   | `#fafbfc` | `#d5d5d6` | 98.76 | 87.33 | -11.4300 |
| `light-neutral-clean-v1` | hover    | `#fafbfc` | `#b3b4b6` | 98.76 | 76.97 | -21.7886 |
| `light-warm-paper-v2` | bright   | `#fafbfc` | `#fafbfc` | 98.76 | 98.76 | 0.0000 |
| `light-warm-paper-v2` | bright1  | `#fafbfc` | `#fafbfc` | 98.76 | 98.76 | 0.0000 |
| `light-warm-paper-v2` | bright2  | `#fafbfc` | `#fafbfc` | 98.76 | 98.76 | 0.0000 |
| `light-warm-paper-v2` | bright3  | `#fafbfc` | `#fbfcfc` | 98.76 | 99.03 | 0.2702 |
| `light-warm-paper-v2` | dark     | `#fafbfc` | `#d7d8d9` | 98.76 | 88.17 | -10.5862 |
| `light-warm-paper-v2` | dark1    | `#fafbfc` | `#f5f6f7` | 98.76 | 97.27 | -1.4943 |
| `light-warm-paper-v2` | dark2    | `#fafbfc` | `#dcddde` | 98.76 | 89.71 | -9.0552 |
| `light-warm-paper-v2` | active   | `#fafbfc` | `#d5d5d6` | 98.76 | 87.33 | -11.4300 |
| `light-warm-paper-v2` | hover    | `#fafbfc` | `#b3b4b6` | 98.76 | 76.97 | -21.7886 |
| `light-cool-professional-v3` | bright   | `#fbfcfd` | `#fbfcfd` | 99.06 | 99.06 | 0.0000 |
| `light-cool-professional-v3` | bright1  | `#fbfcfd` | `#fbfcfd` | 99.06 | 99.06 | 0.0000 |
| `light-cool-professional-v3` | bright2  | `#fbfcfd` | `#fbfcfd` | 99.06 | 99.06 | 0.0000 |
| `light-cool-professional-v3` | bright3  | `#fbfcfd` | `#fcfcfd` | 99.06 | 99.13 | 0.0757 |
| `light-cool-professional-v3` | dark     | `#fbfcfd` | `#d8d9da` | 99.06 | 88.48 | -10.5777 |
| `light-cool-professional-v3` | dark1    | `#fbfcfd` | `#f6f7f8` | 99.06 | 97.57 | -1.4932 |
| `light-cool-professional-v3` | dark2    | `#fbfcfd` | `#dddedf` | 99.06 | 90.01 | -9.0479 |
| `light-cool-professional-v3` | active   | `#fbfcfd` | `#d5d6d7` | 99.06 | 87.56 | -11.4987 |
| `light-cool-professional-v3` | hover    | `#fbfcfd` | `#b3b4b6` | 99.06 | 76.97 | -22.0867 |
| `light-practical-clean-v1` | bright   | `#f4f5f6` | `#f5f6f7` | 96.97 | 97.27 | 0.2996 |
| `light-practical-clean-v1` | bright1  | `#f4f5f6` | `#f4f5f6` | 96.97 | 96.97 | 0.0000 |
| `light-practical-clean-v1` | bright2  | `#f4f5f6` | `#f5f6f7` | 96.97 | 97.27 | 0.2996 |
| `light-practical-clean-v1` | bright3  | `#f4f5f6` | `#f6f6f7` | 96.97 | 97.34 | 0.3756 |
| `light-practical-clean-v1` | dark     | `#f4f5f6` | `#d2d3d4` | 96.97 | 86.64 | -10.3301 |
| `light-practical-clean-v1` | dark1    | `#f4f5f6` | `#eff0f1` | 96.97 | 95.47 | -1.5013 |
| `light-practical-clean-v1` | dark2    | `#f4f5f6` | `#d7d8d8` | 96.97 | 88.15 | -8.8212 |
| `light-practical-clean-v1` | active   | `#f4f5f6` | `#cfd0d1` | 96.97 | 85.71 | -11.2560 |
| `light-practical-clean-v1` | hover    | `#f4f5f6` | `#afb0b2` | 96.97 | 75.70 | -21.2672 |
| `light-practical-cool-v2` | bright   | `#f3f4f6` | `#f4f5f7` | 96.70 | 97.00 | 0.2998 |
| `light-practical-cool-v2` | bright1  | `#f3f4f6` | `#f3f4f6` | 96.70 | 96.70 | 0.0000 |
| `light-practical-cool-v2` | bright2  | `#f3f4f6` | `#f4f5f7` | 96.70 | 97.00 | 0.2998 |
| `light-practical-cool-v2` | bright3  | `#f3f4f6` | `#f5f6f7` | 96.70 | 97.27 | 0.5711 |
| `light-practical-cool-v2` | dark     | `#f3f4f6` | `#d1d2d4` | 96.70 | 86.36 | -10.3378 |
| `light-practical-cool-v2` | dark1    | `#f3f4f6` | `#eeeff1` | 96.70 | 95.19 | -1.5023 |
| `light-practical-cool-v2` | dark2    | `#f3f4f6` | `#d6d7d8` | 96.70 | 87.87 | -8.8279 |
| `light-practical-cool-v2` | active   | `#f3f4f6` | `#cfcfd1` | 96.70 | 85.51 | -11.1860 |
| `light-practical-cool-v2` | hover    | `#f3f4f6` | `#aeafb2` | 96.70 | 75.41 | -21.2843 |
