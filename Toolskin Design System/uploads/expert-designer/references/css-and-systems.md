# CSS, Design Systems & Technical Reference

> W3C DTCG tokens, CSS Grid/Flexbox, modern CSS features 2025–2026, Tailwind v4,
> design system architecture, tools & workflows. Read before CSS/frontend coding tasks.

---

## 1. DESIGN SYSTEMS & TOKEN ARCHITECTURE

### 1.1 W3C Design Tokens Format (DTCG 2025.10)

The Design Tokens Community Group released its first stable version (2025.10) on October 28, 2025. This is now the industry standard for token interoperability.

**File format:** JSON with `.tokens` or `.tokens.json` extension  
**MIME type:** `application/design-tokens+json`  
**Property prefix:** All spec properties use `$` (`$value`, `$type`, `$description`, `$extensions`, `$deprecated`)  
**Token names:** Must NOT start with `$` or contain `{` or `}`

**Primitive types:** Color, Dimension, Font Family, Font Weight, Duration, Cubic Bézier, Number  
**Composite types:** Stroke Style, Border, Transition, Shadow, Gradient, Typography

**Example token file:**
```json
{
  "color": {
    "$type": "color",
    "blue-500": {
      "$value": { "colorSpace": "srgb", "components": [0.23, 0.51, 0.96] }
    },
    "bg-success": {
      "$value": "{color.green-100}",
      "$description": "Success background color"
    }
  },
  "spacing": {
    "$type": "dimension",
    "md": { "$value": { "value": 16, "unit": "px" } }
  }
}
```

**Reference/alias syntax:** Use curly braces `"{other.token.name}"` for token references.  
**Theming:** `$extends` property and group inheritance for light/dark modes, brands, accessibility variants.

**Tool support:** Style Dictionary v4+, Tokens Studio, Figma, Penpot, Sketch, Supernova, Zeroheight, Knapsack, Terrazzo.

### 1.2 Three-tier token architecture (industry consensus)

```
TIER 1 — PRIMITIVE / GLOBAL TOKENS
  Raw values. No semantic meaning. Never used directly in UI.
  Naming: appearance-based (color.blue.500, spacing.4)
  Examples: color.blue.500 = #3B82F6, spacing.4 = 16px

TIER 2 — SEMANTIC / ALIAS TOKENS
  Map primitives to UI purpose/intent. This is the theming layer.
  Naming: purpose-based (color.bg.success, NOT color.bg.green)
  Examples: color.bg.success = {color.green.100}
  TARGET: Keep under 100–150 tokens

TIER 3 — COMPONENT TOKENS
  Scoped to specific components. Allow exceptions without polluting semantic layer.
  Naming: component-scoped (button.primary.bg = {color.bg.action})
  RULE: Only create if token would be used in fewer than 3 places at semantic level
```

**Naming convention:** `[category]-[property]-[variant]-[state]`  
**Directory structure:**
```
tokens/
├── core/                  # Shared primitives (all brands)
│   ├── colors.tokens.json
│   ├── spacing.tokens.json
│   └── typography.tokens.json
├── themes/
│   ├── brand-a/
│   │   ├── light.tokens.json
│   │   └── dark.tokens.json
│   └── brand-b/
│       ├── light.tokens.json
│       └── dark.tokens.json
└── components/
    ├── button.tokens.json
    └── card.tokens.json
```

### 1.3 Token taxonomy

**Color tokens (three-tier):**

| Tier | Example | Value |
|------|---------|-------|
| Primitive | `color.blue.500` | `#3B82F6` |
| Semantic | `color.bg.success` | `{color.green.100}` |
| Component | `button.primary.bg` | `{color.bg.action}` |

**Spacing tokens (4px base, 8px system):**
- `space-025` = 2px, `space-050` = 4px, `space-100` = 8px, `space-150` = 12px
- `space-200` = 16px, `space-300` = 24px, `space-400` = 32px, `space-600` = 48px, `space-800` = 64px
- Define in px for documentation; output as `rem` in CSS for accessibility.

**Typography tokens (DTCG composite):**
```json
{
  "heading-large": {
    "$type": "typography",
    "$value": {
      "fontFamily": "{font.family.sans}",
      "fontSize": { "value": 32, "unit": "px" },
      "fontWeight": 700,
      "lineHeight": 1.25,
      "letterSpacing": { "value": -0.02, "unit": "em" }
    }
  }
}
```

**Elevation/shadow tokens:**
```json
{
  "shadow-medium": {
    "$type": "shadow",
    "$value": {
      "color": { "colorSpace": "srgb", "components": [0, 0, 0], "alpha": 0.15 },
      "offsetX": { "value": 0, "unit": "px" },
      "offsetY": { "value": 4, "unit": "px" },
      "blur": { "value": 8, "unit": "px" },
      "spread": { "value": 0, "unit": "px" }
    }
  }
}
```

**Border tokens:** `border-radius.sm` = 4px, `.md` = 8px, `.lg` = 16px, `.full` = 9999px

**Motion tokens:**
```json
{
  "duration-fast": { "$type": "duration", "$value": { "value": 150, "unit": "ms" } },
  "ease-in-out": { "$type": "cubicBezier", "$value": [0.42, 0, 0.58, 1] }
}
```

### 1.4 Major design systems reference

**Material Design 3 (Google):** Four-level hierarchy — Reference → System → Component tokens (~141 system tokens theme ~800+ component tokens). Dynamic Color via HCT color space extracts tonal palettes from a single source color. M3 Expressive (2025): physics-based motion, 10-step shape tokens, emphasized typography.

**Ant Design 5/6:** Unique algorithmic derivation — Seed → Map → Alias → Component tokens. Composable algorithms (`darkAlgorithm`, `compactAlgorithm`) take seed tokens and derive entire themes programmatically. v6 adds `zeroRuntime` mode.

**IBM Carbon (v11):** Semantic naming (`$background`, `$text-primary`, `$border-subtle`). Four themes: White, Gray 10, Gray 90, Gray 100. Inline theming via `<Theme theme="g100">`. IBM Plex typeface. Spacing scale: 2, 4, 8, 12, 16, 24, 32, 48, 64, 96px.

**Atlassian:** Naming convention `{foundation}.{property}.{modifier}`. CSS variables: `--ds-surface-raised`, `--ds-space-100`. Surface detection via `utility.elevation.surface.current`. Token lifecycle: Active → Deprecated → Deleted.

**GitHub Primer:** Three categories — Base (never used in UI directly), Functional (most common), Component/Pattern. Naming: `{namespace}-{pattern}-{property}-{variant}-{scale}-{state}`. Nine color themes including high-contrast and colorblind variants. Automated contrast checking via GitHub Actions.

**Shopify Polaris:** `--p-color-{role}`, `--p-space-{scale}` (4px base). Moved to Web Components (Oct 2025) for framework-agnostic delivery.

### 1.5 Token-first vs component-first

**Token-first (bottom-up):** Define primitives → semantic layer → apply to components. Best for mature systems with multi-brand needs. Used by Carbon, Material Design, Atlassian.

**Component-first (top-down):** Start with component tokens → extract patterns → build foundations over time. Faster time-to-value. Best for retrofitting existing products.

**Guidance:** Aim for 100–150 semantic tokens. If over 200, the system is over-specified. If a token would be used in fewer than 3 places, use component tier instead.

### 1.6 Multi-brand/multi-theme architecture

**Theme switching via CSS custom properties (runtime):**
```css
:root { --color-bg-primary: #ffffff; --color-text-primary: #1a1a1a; }
[data-theme="dark"] { --color-bg-primary: #1a1a1a; --color-text-primary: #ffffff; }
```

**Multi-brand pattern:** Primitives stay constant across themes. Semantic tokens get different values per theme. Components reference semantic tokens only. Switching brands = swapping Tier 2 values only.

### 1.7 Toolchain

**Style Dictionary v4:** First-class DTCG format support (`$value`/`$type`). ES Modules, async, browser-compatible. Type-based transforms. v5 targets full DTCG 2025.10 compliance.

**Tokens Studio:** 264k+ Figma users. 24 token types. Git sync (GitHub, GitLab, Bitbucket, Azure DevOps). Theme switching. `@tokens-studio/sd-transforms` bridges to Style Dictionary.

**Pipeline:** Figma → Tokens Studio → JSON (W3C format) → GitHub PR → Style Dictionary → CSS variables / Tailwind config / iOS Swift / Android XML

---

## 4. GRID & LAYOUT SYSTEMS

### 4.1 CSS Grid patterns

**Named template areas:**
```css
.layout {
  display: grid;
  grid-template:
    "header header header" auto
    "nav    main   aside"  1fr
    "footer footer footer" auto
    / 200px 1fr 200px;
  min-height: 100dvh;
  gap: 1rem;
}
```

**Auto-responsive card grid (no media queries):**
```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: 1.5rem;
}
```

**auto-fill** creates empty tracks; **auto-fit** collapses empty tracks.
Use `minmax(0, 1fr)` instead of `1fr` to prevent content overflow.

### 4.2 CSS Subgrid (97%+ support, production-ready)

```css
.parent-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
.card {
  display: grid;
  grid-row: span 3;
  grid-template-rows: subgrid;
}
```

Solves card alignment without JavaScript. Can subgrid rows, columns, or both.

### 4.3 Spacing system (8px grid)

```css
:root {
  --grid-unit: 8px;
  --space-1: calc(var(--grid-unit) * 1);   /* 8px */
  --space-2: calc(var(--grid-unit) * 2);   /* 16px */
  --space-3: calc(var(--grid-unit) * 3);   /* 24px */
  --space-4: calc(var(--grid-unit) * 4);   /* 32px */
  --space-6: calc(var(--grid-unit) * 6);   /* 48px */
  --space-8: calc(var(--grid-unit) * 8);   /* 64px */
  --sub-unit: 4px; /* 4px sub-grid for fine-tuning */
}
```

### 4.4 Bento grid layout (trending pattern)

```css
.bento {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 180px;
  gap: 1rem;
  grid-auto-flow: dense;
}
.bento > :nth-child(1) { grid-column: span 2; grid-row: span 2; }
.bento > :nth-child(2) { grid-row: span 2; }
```

### 4.5 Container queries (baseline widely available 2025)

```css
.card-wrapper {
  container-type: inline-size;
  container-name: card;
}
@container card (min-width: 600px) {
  .card { display: grid; grid-template-columns: 2fr 3fr; }
}
@container card (max-width: 400px) {
  .card h2 { font-size: 1rem; }
}
```

**Container query units:** `cqw` (1% container width), `cqi` (1% inline size), `cqb` (1% block size).

**Heuristic:** Media queries for MACRO layout (page columns). Container queries for MICRO layout (component adaptation).

**Style queries (emerging, Chrome/Edge):**
```css
@container style(--density: compact) {
  .card { padding: 0.5rem; }
}
```

### 4.6 Swiss/International style digital adaptation

- Mathematical precision: all spacing from a base unit (8px)
- Asymmetric grids for visual tension: `grid-template-columns: 2fr 1fr;`
- Strong vertical rhythm via consistent line-height multiples
- Modular grid: content areas as multiples of column + gutter module

---

## 5. MODERN CSS FEATURES (2025–2026)

### 5.1 :has() selector (all modern browsers)

```css
.card:has(img) { grid-template-columns: 200px 1fr; }
.form-group:has(:invalid) { border-color: red; }
h1:has(+ p) { margin-bottom: 0.25em; }
```

### 5.2 Scroll-driven animations

```css
.progress-bar {
  animation: grow-width linear;
  animation-timeline: scroll();
}
@keyframes grow-width { from { width: 0; } to { width: 100%; } }

.reveal {
  animation: fade-in linear;
  animation-timeline: view();
  animation-range: entry 0% cover 30%;
}
```

Expected Baseline 2026 (Chrome/Edge shipped; Firefox/Safari catching up).

### 5.3 View transitions

```css
@view-transition { navigation: auto; }
::view-transition-old(root) { animation: fade-out 0.3s; }
::view-transition-new(root) { animation: fade-in 0.3s; }
```

Same-document: Baseline 2025. Cross-document (MPA): Chrome 134, Safari 18.2.

### 5.4 CSS nesting (all modern browsers)

```css
.card {
  padding: 1rem;
  & h3 { margin: 0 0 .5rem; }
  &:hover { border-color: oklch(0.8 0.1 20); }
}
```

### 5.5 Cascade layers

```css
@layer reset, base, components, utilities;
@layer reset { *, *::before, *::after { margin: 0; box-sizing: border-box; } }
@layer base { body { font-family: system-ui; line-height: 1.5; } }
@layer components { .card { border: 1px solid #ddd; border-radius: 8px; } }
@layer utilities { .text-center { text-align: center; } }
@import url('bootstrap.css') layer(framework);
```

Unlayered styles always beat layered styles. Within layers, last declared wins.

### 5.6 Anchor positioning (Chrome, Edge, Safari 18+)

```css
.trigger { anchor-name: --btn; }
.tooltip {
  position: absolute;
  position-anchor: --btn;
  inset-area: bottom;
  position-try-fallbacks: flip-block, flip-inline;
}
```

### 5.7 @property for typed custom properties

```css
@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}
.loader {
  --angle: 0deg;
  background: conic-gradient(from var(--angle), blue, transparent);
  animation: spin 2s linear infinite;
}
@keyframes spin { to { --angle: 360deg; } }
```

Without `@property`, custom properties can't be animated.

### 5.8 @scope

```css
@scope (.card) to (.card-footer) {
  h3 { margin-block: 0; }
  p { font-size: 0.9rem; }
}
```

### 5.9 CSS architecture methodologies

**BEM:** `.card`, `.card__title`, `.card--featured`. Clear naming. Still widely used in enterprise.

**CUBE CSS:** Composition → Utility → Block → Exception. Embraces cascade and inheritance. Less code than BEM.

**Utility-first (Tailwind):** Fast prototyping. Smaller CSS bundles. Best with component frameworks.

| Context | Recommended |
|---------|------------|
| Large team, long-lived | BEM or CUBE CSS |
| Component framework (React/Vue) | Tailwind or CSS Modules |
| Design system with tokens | CUBE CSS + @layer |
| Rapid prototyping | Tailwind |

### 5.10 Tailwind CSS v4 (released January 2025)

```css
@import "tailwindcss";

@theme {
  --color-primary-500: oklch(59.59% 0.24 255);
  --color-surface: #ffffff;
  --spacing-xs: 0.25rem;
  --spacing-md: 1rem;
  --font-display: "Inter", sans-serif;
  --radius-lg: 0.75rem;
}
```

CSS-first configuration (replaces tailwind.config.js). 5x faster builds. Built on cascade layers, @property, color-mix(). All tokens as native CSS variables. P3 color palette. First-class container queries: `@container`, `@md:grid-cols-2`.

### 5.11 Performance CSS

```css
.lazy-section {
  content-visibility: auto;
  contain-intrinsic-size: auto 300px;
}
```

Up to 7x rendering boost on initial load. Don't apply to above-the-fold content. Animate only `transform` and `opacity` (compositor-only, no reflow).

---

## 10. TOOLS & WORKFLOWS

### 10.1 Figma (2025–2026)

**New products (Config 2025):** Figma Make (AI prompt-to-app), Figma Sites (publish websites from Figma), Figma Draw (illustration workspace), Figma Buzz (brand asset creation for non-designers), Figma Slides (presentations).

**Variables:** Color, Number, String, Boolean. Variable modes for theme switching (Light/Dark), responsive design, localization. Up to 10 modes (Pro), 20 modes (Org).

**Extended Collections (Schema 2025):** Core design system published; teams extend with brand-specific themes inheriting parent changes.

**Component properties:** Boolean (toggle layers), Instance swap (swap nested instances), Text (expose for customization), Variant (switch variants), Slots (dynamic instances without detaching).

**Grid auto layout:** 2D layout within auto layout. Rows and columns, multi-track spanning. CSS Grid alignment in Dev Mode.

**Figma MCP Server:** AI agents (VS Code, Cursor, Claude Code) write directly to Figma files using existing components, variables, tokens.

**Code Connect:** Connect Figma components to codebase. Component mapping suggestions, AI-generated code snippets.

### 10.2 Adobe Creative Suite (2025)

**Photoshop:** Generative Fill (GA, supports third-party models), Generative Upscale (4K), Harmonize (blend composites), AI Assistant (sidebar agentic AI). Non-destructive: Smart Objects, adjustment layers, layer masks.

**Illustrator:** Firefly AI for vectors, Generative Recolor, Objects on Path. SVG export: use "Presentation Attributes" for cleaner code.

**InDesign:** Generative Expand (un-crop images), HTML5 export, export to Adobe Express. GREP styles for automated formatting. Data merge for variable publishing. File > Package for handoff.

**Lightroom:** Assisted Culling (AI sorting), Generative Remove, Select Landscape masking.

**Firefly Image Model 5:** Native 4MP, photorealistic. Firefly Creative Production: node-based batch editing.

### 10.3 Design-to-development handoff

**Essential package:**
1. Design specs: Colors (tokens), typography, spacing system
2. Export-ready assets: SVG icons, WebP/AVIF images at @1x, @2x, @3x
3. Interactive prototypes: Transitions, micro-interactions, hover effects
4. Component states: Default, Hover, Focus, Active, Disabled, Error, Success, Loading
5. Responsive breakpoints: 6 minimum with layout/component/typography changes documented

**Documentation tools:** Zeroheight (cross-team docs, AI assistant, MCP support) + Storybook (live component rendering, developer-focused). Connect both for single source of truth.

**Key stats:** Poor handoffs cause ~30% of development delays. Proper handoffs reduce dev time by 40%.

### 10.4 Asset management

**Image formats (2025–2026):**
- AVIF: Best compression (50% smaller than JPEG), HDR, ~89% browser support
- WebP: Excellent (25–34% smaller than JPEG), ~97% support
- SVG: Always for logos/icons/UI shapes
- Fallback: AVIF → WebP → JPEG via `<picture>`

**File organization:**
1. Cover page (identification)
2. Index page (preview)
3. Local components
4. Work in progress
5. Ready for development

**Naming:** `btn/primary/default` not `Component-1`. Status tags: [Live], [Ready for Dev], [WIP].

### 10.5 Other tools

**Framer:** Design-first no-code sites. Best for SaaS landing pages, portfolios, motion design. From $5/mo.

**Webflow:** Visual coding platform. Clean HTML/CSS output. Robust CMS, e-commerce, SEO. Best for content-heavy sites. From $14/mo.

**Penpot:** Free open-source design tool. Built on SVG/CSS/HTML. Native CSS Grid/Flexbox layout. Native design tokens. Self-hosting option for data sovereignty.

---

## QUICK REFERENCE TABLES

### Spacing scale (8px grid)

| Token | Value | Use |
|-------|-------|-----|
| space-025 | 2px | Hairline gaps |
| space-050 | 4px | Tight spacing |
| space-100 | 8px | Default compact |
| space-150 | 12px | Form fields |
| space-200 | 16px | Standard padding |
| space-300 | 24px | Card padding |
| space-400 | 32px | Section gaps |
| space-600 | 48px | Large sections |
| space-800 | 64px | Page sections |

### Animation timing

| Duration | Use | Easing |
|----------|-----|--------|
| 100–200ms | Button, toggle, hover | ease-out |
| 200–300ms | Dropdown, card, standard | ease-out |
| 300–500ms | Full-screen, page | ease-in-out |
| <100ms | Immediate feedback threshold | — |
| >400ms | Feels sluggish | Avoid |

### Contrast requirements

| Standard | Normal Text | Large Text | Non-text |
|----------|------------|------------|----------|
| WCAG AA | 4.5:1 | 3:1 | 3:1 |
| WCAG AAA | 7:1 | 4.5:1 | — |
| APCA (body) | Lc 60+ | Lc 45+ | Lc 15+ |

### Touch targets

| Standard | Minimum Size |
|----------|-------------|
| WCAG 2.2 AA | 24×24 CSS px |
| Apple HIG | 44×44 pt |
| Material Design | 48×48 dp |
| Spacing between | ≥8px |

### Breakpoints

| Name | Width | Target |
|------|-------|--------|
| Base | 0–479px | Mobile portrait |
| sm | 480px | Mobile landscape |
| md | 768px | Tablet portrait |
| lg | 1024px | Laptop |
| xl | 1280px | Desktop |
| 2xl | 1536px | Large/4K |

### Color space syntax

```css
oklch(L C H)          /* L: 0-1, C: 0-0.37, H: 0-360 */
color(display-p3 R G B)
color-mix(in oklch, color1 %, color2)
oklch(from var(--c) calc(l * 1.2) c h)
```

### Social media dimensions (quick ref)

| Platform | Feed | Stories/Reels | Profile |
|----------|------|--------------|---------|
| Instagram | 1080×1350 (4:5) | 1080×1920 (9:16) | 320×320 |
| TikTok | 1080×1920 (9:16) | 1080×1920 | 200×200 |
| LinkedIn | 1200×627 (1.91:1) | — | 400×400 |
| X/Twitter | 1280×720 (16:9) | — | 400×400 |
| YouTube | — | 1080×1920 (Shorts) | 800×800 |
| Facebook | 1080×1080 (1:1) | 1080×1920 (9:16) | 320×320 |
| Pinterest | 1000×1500 (2:3) | 1080×1920 (9:16) | 280×280 |

### Print specifications (quick ref)

| Spec | Value |
|------|-------|
| Resolution | 300 DPI |
| Bleed (US) | 0.125" |
| Bleed (metric) | 3mm |
| Rich black | C:60 M:40 Y:40 K:100 |
| Max ink coverage | 300% |
| File format | PDF/X-1a |

---

## DESIGN DECISION FRAMEWORK

When making design decisions, apply this hierarchy:

1. **Accessibility first:** Does it meet WCAG 2.2 AA? Contrast, touch targets, focus management.
2. **Content clarity:** Does hierarchy guide the eye? Is the message immediately clear?
3. **Systematic consistency:** Does it use established tokens and patterns? Can it be maintained?
4. **Performance:** Is it fast? Content-visibility, optimized images, efficient animations.
5. **Aesthetic excellence:** Does it create emotional impact? White space, typography, color.
6. **Innovation:** Does it bring something fresh while serving the above goals?

---

## TOKEN PIPELINE AUTOMATION

```
Figma Variables
     ↓ (Tokens Studio plugin)
JSON (W3C DTCG format)
     ↓ (Git sync: GitHub/GitLab)
Style Dictionary v4
     ↓ (transforms)
┌────┼────┬────┬────┐
CSS  Sass  iOS  Android  Tailwind
vars vars  Swift XML     @theme
```

Always automate. Manual token processes fail at scale. Use ESLint rules (Atlassian pattern) and CI/CD for enforcement.

---

*This skill file synthesizes research from W3C DTCG specification, Material Design 3, IBM Carbon, GitHub Primer, Atlassian Design System, Shopify Polaris, Ant Design, Awwwards, WCAG 2.2/3.0, CSS Color Level 4/5, Tailwind CSS v4, Figma Config/Schema 2025, Adobe MAX 2025, and authoritative sources across typography, color science, and design systems. Current as of March 2026.*

---
