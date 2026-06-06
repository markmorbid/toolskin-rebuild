# Toolskin Adaptation Plan

How to turn the typeui haul into something actually useful for the Toolskin design system, without inheriting its weaknesses.

---

## 1. Architecture decision

**One implementation skill + one preset registry.** Not 67 skills.

```
toolskin-showcase/
├── .claude/skills/
│   ├── expert-designer/                 # already installed (visual judgment)
│   └── toolskin-implementation/         # NEW: the real Toolskin skill
│       ├── SKILL.md                     # token tiers, surfaces, derivatives, components, guardrails
│       └── references/                  # heavier docs offloaded here
│           ├── token-architecture.md
│           ├── surface-system.md
│           ├── derivative-engine.md
│           └── component-anatomies.md
└── assets/themes/
    ├── presets.json                     # 67 themes, machine-readable
    └── presets/                         # optional: one .css per preset for static loading
        ├── cosmic.css
        ├── brutalism.css
        └── ...
```

The `toolskin-implementation` skill teaches an agent **how Toolskin works**. The presets registry gives the agent **67 different aesthetic dials** to spin Toolskin to.

---

## 2. Preset schema (proposed)

Each typeui DESIGN.md frontmatter maps cleanly to this:

```json
{
  "slug": "cosmic",
  "name": "Cosmic",
  "description": "Sci-fi, dark, neon accents, immersive spatial elements.",
  "category": "futuristic",
  "tokens": {
    "--ts-accent-h": 217,
    "--ts-accent-s": 91,
    "--ts-accent-l": 60,
    "--ts-accent-alt": "#8B5CF6",
    "--ts-bg-body": "#0a0e1a",
    "--ts-text-base": "#e6e9f2",
    "--ts-radius-base": 6,
    "--ts-fs-base": 16,
    "--ts-fs-ratio": 1.25,
    "--ts-sp-base": 4,
    "--ts-font-display": "Audiowide, system-ui, sans-serif",
    "--ts-font-body": "Audiowide, system-ui, sans-serif",
    "--ts-font-mono": "JetBrains Mono, ui-monospace, monospace"
  },
  "mood": ["dark", "playful", "premium"],
  "fonts_to_load": [
    "https://fonts.googleapis.com/css2?family=Audiowide&family=JetBrains+Mono:wght@400;500;700&display=swap"
  ]
}
```

The conversion from typeui DESIGN.md → this schema is mechanical. A small Python or Node script reads each `DESIGN.md` frontmatter, converts hex → OKLCH/HSL channels for `--ts-accent-h/s/l`, snaps the type scale to your harmonic 1.125 ladder (or keeps a custom ratio if it deviates), and emits a JSON entry.

---

## 3. Conversion pipeline

```
typeui-haul/skills/<slug>/DESIGN.md
        │
        ▼   parse YAML frontmatter
{ colors, typography, rounded, spacing }
        │
        ▼   transform
{ HEX → HSL channels for --ts-accent-h/s/l }
{ type sourceScale → nearest harmonic ratio + base size }
{ rounded.md → --ts-radius-base px }
{ spacing scale → --ts-sp-base + density mode }
        │
        ▼   emit
toolskin-presets.json entry
```

Edge cases the typeui data has that need handling:
- Some skills declare descriptive text instead of numbers (e.g. spacing scale = "comfortable density mode" instead of "4/8/12/16/24/32"). Map these to your existing density modes.
- Some `colors.neutral` are duplicates of `surface`. Drop the duplicate.
- Several skills share the exact same hex (Inter + #3B82F6 + #8B5CF6 appears repeatedly). Don't bother creating those as separate presets — collapse duplicates and add a `aliases: []` field on canonical entries.
- Brand text in some SKILL.md files contains stray marketing copy from unrelated products (the neumorphism file describes a club; glassmorphism describes a chat app). Discard. Use the `description` field from frontmatter instead, which is clean.

---

## 4. The Toolskin implementation skill (outline)

Replaces all 67 typeui SKILL.md files with one document an agent can actually act on. Outline only — the real one writes during Phase B:

```
---
name: toolskin-implementation
description: Build UI components and pages using the Toolskin design system. Use whenever generating CSS, HTML, or JS that targets toolskin.css tokens, ts-* classes, surfaces, or themed pages. Required reading before writing any --ts-* custom property.
---

# Toolskin Implementation Skill

## When to use
[trigger conditions specific to Toolskin work]

## The three-tier token contract
[Primitive → System → Component, with examples]
[ANTI-PATTERN: writing direct primitive references in component CSS — must go through --ts-this-bg]

## The surface system
[6 levels, --ts-this-bg, superposition with .ts-section--alt]

## The derivative engine
[OKLCH auto-derivation, color-mix, harmonic ladder, what's auto vs static]

## Component classes (anatomy + states)
[ts-card, ts-button, ts-input, ts-modal, ts-toast, ts-table, ts-marquee, etc.]
[Each: anatomy, variants, required states, accessibility, edge cases]

## Theme presets
[How to apply a preset from toolskin-presets.json]
[Toolskin.applyPreset(slug) JS API]

## Guardrails (from CLAUDE.md)
[Never read .env / never break --ts-* namespace / etc.]

## QA checklist
[Specific to Toolskin: tokens not bypassed, surfaces respected, dark+light tested, derivative chain not broken]
```

This is materially different from typeui's generic "anchor each rule to a token, threshold, or example" prose because it points at **real tokens, real classes, real files**.

---

## 5. Implementation steps

1. **Generate the preset JSON** (~30 min)
   - Script reads `typeui-haul/skills/*/DESIGN.md` frontmatter
   - Emits `assets/themes/presets.json`
   - Skip duplicates, normalize fonts, convert hex to HSL channels
   - Sanity-check: 67 input → expect ~50 unique outputs after dedup

2. **Add `Toolskin.applyPreset(slug)` to `assets/js/toolskin.js`** (~1 hour)
   - Loads the JSON, sets CSS custom properties on `:root`
   - Triggers font load if `fonts_to_load` is present
   - Persists last-applied preset to localStorage
   - Fires a `toolskin:preset-changed` event

3. **Build `toolskin-themes.html` showcase page** (~1 hour)
   - Reuses your standard component sampler from `toolskin-lab.html`
   - Adds a preset picker (dropdown or grid of preview cards)
   - Each preset card uses the typeui preview PNG as thumbnail
   - Renders the sampler with the chosen preset live

4. **Write `toolskin-implementation` SKILL.md** (~3 hours)
   - This is the real work. Pull from existing `assets/css/toolskin.css` comments and your `expert-designer` skill content.
   - Keep under 500 lines per the SKILL.md authoring rule. Offload heavy details to `references/`.

5. **Optional: per-preset standalone CSS files** (~1 hour)
   - For consumers who want static loading rather than runtime preset switching
   - One `presets/<slug>.css` per entry, just `:root { ... }` overrides

Total: roughly one full development day to convert 67 thin skills into one strong Toolskin skill plus a useful preset library.

---

## 6. What you get

- **One skill** that teaches an agent Toolskin's actual rules, replacing 67 generic ones
- **~50 dedup'd theme presets** as machine-readable JSON, swappable at runtime
- **A showcase page** that proves your design system can render the full typeui aesthetic range while staying inside the `--ts-*` token contract
- **A genuine differentiator** — typeui delivers prompts, Toolskin would deliver an actual implementation that's themeable to match any of those prompts

The visual quality of the typeui previews is reachable from Toolskin because the previews are mostly token-driven (color + font + type scale + radius + spacing). Where they aren't (custom illustrations, photos, gradients on the Cosmic preview, big dramatic type on Brutalism), those are layout/content choices outside any design system's scope.
