# Visual Quality Rules (VQ)

**Derived from the approved-vs-rejected differential.**
**The audit passed BOTH the approved showcase and the rejected sandbox.**
**These rules catch what the audit cannot: visual poverty.**

## The gap the audit missed
The rejected sandbox was token-clean and architecturally honest but read
as a documentation page, not a product. It demonstrated the engine; it did
not live the identity. Audit score is not visual quality.

## Binding rules — checkable before shipping

- **VQ-1** — Hero headline ≥ step 7 (~38px at 13px base / ~57px at 16px),
  with negative letter-spacing (≥ --ts-tracking-tighter). The rejected
  hero was a plain centered headline; the approved was 7fr/5fr split with
  an oversized headline and an italic accent word.

- **VQ-2** — JetBrains Mono LOADED and RENDERED on numeric/data/label slots
  (section numbers /01, px measurements, swatch labels, metrics). Declaring
  the token without loading the font is a silent identity failure (B3).

- **VQ-3** — ≥3 distinct background values across sections. The rejected
  sandbox was visually flat; the approved varied body / bg-1 / accent-tile.

- **VQ-4** — ≥1 solid accent-paint surface (a full --ts-accent tile with
  --ts-on-accent text, or the bento tall tile). Not just accent on the CTA.

- **VQ-5** — The accent lab (HSL sliders → whole-page repaint) is present.
  It is the system's proof of concept: "one knob → the whole UI repaints."
  Without it on the reference page, the core promise is unproven.

- **VQ-6** — ≥1 bento or asymmetric composition (Nfr Mfr where N≠M), not
  cards-in-a-row. Surface superposition must be shown under compositional
  pressure, not only on isolated swatches.

- **VQ-7** — --ts-alt companion color declared and used in the hero
  atmosphere (radial gradients). Toolskin identity is bichromatic
  (accent + alt), not monochromatic accent.

- **VQ-8** — Numbered section chrome (/ 01, / 02) in JetBrains Mono with
  leading slash. This is the editorial wayfinding signature.

## The acceptance test
Take a screenshot. Place it beside
expert-designer/screenshots/expert--designer-showcase.jpg.
Ask: "Does mine look like that?" If NO, fix the specific gap.
The audit is a constraint. This comparison is the goal.

## Identity elements the rejected sandbox lost (do not lose again)
- Instrument Serif italic accent word (one editorial gesture)
- Radial gradient hero atmosphere (--ts-accent-dim + --ts-alt-dim)
- Bento composition with one accent-painted tile
- Mono-as-machine-voice on all data/label slots
- Sticky topbar with brand mark + nav + CTA
- --ts-shadow-accent on the featured card
