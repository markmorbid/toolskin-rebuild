---
name: typography-master
description: >
  Typography reference skill for font selection, pairing, and hierarchy decisions in the
  Toolskin design system. Trigger this skill whenever the user picks or evaluates a font,
  asks about font pairing, discusses typographic hierarchy or scale, mentions Space Grotesk
  or wants alternatives, asks about JetBrains Mono alternatives, tunes a font-size scale or
  modular ratio, works on headings/display type, evaluates readability, evaluates variable
  font axes, or touches `--ts-font-*` tokens (`--ts-font-body`, `--ts-font-heading`,
  `--ts-font-mono`) in Toolskin CSS or JS. Also trigger on requests about wordmark/logo
  typography, editorial serifs, display/brand fonts, monospace/code fonts, free commercial
  fonts, Google Fonts, Fontshare, or 2025-2026 typography trends.
---

# Typography Master (Toolskin)

A reference skill — not procedural. Use it to make informed font decisions grounded in Toolskin's anchor stack and a curated catalog of 289+ free/open-source typefaces.

## Toolskin anchor stack

- **Body / UI:** Space Grotesk (300–700, derived from Space Mono)
- **Monospace / code:** JetBrains Mono (138+ coding ligatures)
- **Loading:** render-blocking in `<head>` (see CLAUDE.md §5b) — not via the CDN asset loader.
- **Tokens:** `--ts-font-body`, `--ts-font-heading`, `--ts-font-mono`
- **JS swap:** `setMainVar()` applies fonts sitewide by writing to `:root` so all tokens cascade.

Do NOT swap Space Grotesk without explicit owner approval — it is the anchor of the entire system (see CLAUDE.md §6 guardrails).

## When to consult the full reference

Open `references/font-catalog.md` whenever you need:
- A specific alternative to Space Grotesk, JetBrains Mono, or an existing Toolskin font choice
- Pairing recommendations with Space Grotesk (serif, mono, display)
- Variable-font axis details (opsz, wght, wdth, SOFT, WONK, MONO, CASL, CRSV)
- 2025-2026 trend context (neo-grotesque revival, serif renaissance, SaaS typography audit)
- Wordmark/logo construction guidance or investment-by-stage advice
- License / source links (Google Fonts, Fontshare, GitHub, Gumroad)

## Top picks by category

### Sans-serif workhorses (UI, body, data)
- **Inter** — Figma default, 414B requests/yr, opsz + wght axes
- **Geist** — Vercel/Next.js default, Swiss-inspired
- **Satoshi** — Modernist hybrid, directional arrows in glyph set (Fontshare)
- **General Sans** — Rationalist, 12 styles (Fontshare)
- **Switzer** — "Free Helvetica," 18 styles (Fontshare)

### Editorial serifs (contrast, long-form)
- **Source Serif 4** — Most versatile Space Grotesk pairing (shared screen metrics)
- **Instrument Serif** — Contemporary editorial, pairs with Instrument Sans
- **Fraunces** — WONK + SOFT axes, quirky personality matches Space Grotesk
- **Newsreader** — 42 styles, built for on-screen reading
- **Lora** — Calligraphic warmth, excellent for body

### Display / brand
- **Clash Display** — Strongest brand pairing with Space Grotesk (shared grotesk DNA)
- **Syne** — Letters get wider with weight, futuristic
- **Cabinet Grotesk** — Curved R-leg, modern grotesk with personality
- **Bricolage Grotesque** — 3 axes, dramatic width + opsz shifts
- **Unbounded** — Chevron stems, first on-chain-funded font

### Monospace (code, tables, technical)
- **Space Mono** — #1 natural pairing with Space Grotesk (same DNA)
- **JetBrains Mono** — Current Toolskin default, 138+ ligatures
- **Geist Mono** — SF Mono-inspired, companion to Geist
- **Fira Code** — Extensive ligatures, cv01–cv14 character variants
- **Recursive Mono** — 5-axis variable, interpolates sans↔mono in one file

## Toolskin-specific guidance

- **Anchor lock:** Never swap Space Grotesk without owner approval. Confirm before proposing.
- **Variables:** `--ts-font-body`, `--ts-font-heading`, `--ts-font-mono` are the only font tokens. Add new ones sparingly.
- **Runtime swap:** `setMainVar()` writes to `:root` — all downstream components re-theme via cascade.
- **Loading strategy:** Font files stay in `<head>` render-blocking. Do NOT move them into `toolskin-assets.js`.
- **Scale rule:** Prefer modular ratio (1.125–1.25×) from 16px base, snapped to 4pt grid. Use `clamp()` for fluid type.
- **Hierarchy rule:** Per modern design-system convention, hierarchy comes from weight/size/color — not by stacking more families. Keep Toolskin at 1–2 families max.

For the full 289-font Awwwards-tier catalog, pairing tables, trend analysis, and wordmark/logo guidance, consult **`references/font-catalog.md`**.
