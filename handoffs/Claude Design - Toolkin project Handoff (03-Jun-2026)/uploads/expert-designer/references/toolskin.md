# Toolskin Design System Reference

> Complete Toolskin token architecture, component reference, runtime API,
> WordPress integration. Read before any Toolskin implementation task.

---

## 11. TOOLSKIN DESIGN SYSTEM (PRIMARY IMPLEMENTATION)

Toolskin is the native design system for all projects. It provides a unified CSS framework for
WordPress themes, web applications, and UI toolkits. Zero framework dependencies. One stylesheet. Full dynamic control.

**Prefixes:** `.ts-` (Toolskin visual/layout classes), `.tk-` (ToolCore programmatic/JS classes)

### 11.1 Color engine (HSL-based, dynamic)

All color variations are derived dynamically from three primitives using `color-mix()`:
```css
:root {
  /* Change these 3 values to recolor EVERYTHING */
  --ts-accent-h: 18;       /* Hue 0–360: 18=orange, 142=green, 220=blue, 270=purple */
  --ts-accent-s: 100%;     /* Saturation 0–100% */
  --ts-accent-l: 52%;      /* Lightness 0–100% */
}
```

**Computed accent variants (auto-derived, never hardcoded):**
```css
--ts-accent:        hsl(var(--ts-accent-h), var(--ts-accent-s), var(--ts-accent-l));
--ts-accent-bright: color-mix(in srgb, var(--ts-accent), #fff 15%);
--ts-accent-dark:   color-mix(in srgb, var(--ts-accent), #000 25%);
--ts-accent-dim:    color-mix(in srgb, var(--ts-accent), transparent 82%);
--ts-accent-dim-2:  color-mix(in srgb, var(--ts-accent), transparent 92%);
--ts-accent-border: color-mix(in srgb, var(--ts-accent), transparent 60%);
```

**Alt / secondary accent (complement — configurable):**
```css
--ts-alt-h: 195;  --ts-alt-s: 100%;  --ts-alt-l: 40%;
--ts-alt: hsl(var(--ts-alt-h), var(--ts-alt-s), var(--ts-alt-l));
--ts-alt-dim: color-mix(in srgb, var(--ts-alt), transparent 80%);
```

**Status colors:**
```css
--ts-success: hsl(142, 76%, 36%);
--ts-warning: hsl(45, 100%, 50%);
--ts-danger: hsl(0, 90%, 55%);
--ts-info: hsl(210, 90%, 55%);
```

**Named palette (with auto-derived dim and border variants):**
```css
--ts-orange: #ff540a;  --ts-blue: #007bff;  --ts-green: #28a745;
--ts-red: #dc3545;     --ts-yellow: #ffc107; --ts-purple: #6f42c1;
--ts-pink: #e83e8c;    --ts-gray: #6c757d;
/* Each gets -dim (82% transparent) and -border (60% transparent) variants */
```

**Dynamic gradient + hover system:**
```css
:where(:root, :root *) {
  --ts-this-bg: var(--ts-bg-1);
  --ts-this-bg-bright: color-mix(in srgb, var(--ts-this-bg), #ffffff 8%);
  --ts-this-bg-dark: color-mix(in srgb, var(--ts-this-bg), #000000 14%);
  --ts-accent-grad: linear-gradient(to top left, var(--ts-accent-bright), var(--ts-accent-dark), var(--ts-accent));
}
```
Set `--ts-this-bg` on any element and hover/active/gradient states auto-generate.

### 11.2 Surface & background scale

6-level depth stack from darkest body to brightest card surface:
```css
--ts-bg-body: #0c0d0f;    /* Deepest page background */
--ts-bg-0:    #111214;    /* Base surface */
--ts-bg-1:    #17181b;    /* Mid-dark */
--ts-bg-2:    #1f2024;    /* Standard dark surface */
--ts-bg-3:    #28292e;    /* Raised surface */
--ts-bg-4:    #323439;    /* Prominent surface */
--ts-bg-5:    #3e4045;    /* Brightest surface */
```

**Transparent variants (for overlays/glass):**
```css
--ts-bg-1-t: color-mix(in srgb, var(--ts-bg-1), transparent 30%);
--ts-bg-2-t: color-mix(in srgb, var(--ts-bg-2), transparent 40%);
--ts-bg-overlay: color-mix(in srgb, var(--ts-bg-body), transparent 8%);
```

**Radial depth gradients (section backgrounds):**
```css
--ts-radial-depth: radial-gradient(ellipse at 60% 40%, var(--ts-bg-1) 0%, var(--ts-bg-body) 100%);
--ts-accent-glow-bg: radial-gradient(ellipse at 50% -10%, color-mix(in srgb, var(--ts-accent), transparent 92%) 0%, transparent 60%);
```

**Text colors (semantic):**
```css
--ts-text-primary:   #e8e9ea;
--ts-text-secondary: #9ea0a5;
--ts-text-muted:     #6d6f74;
--ts-text-accent:    var(--ts-accent);
--ts-text-invert:    #000000;
```

### 11.3 Border system

Borders derived from surface context:
```css
--ts-border-0: color-mix(in srgb, #fff, transparent 94%);  /* Subtlest */
--ts-border-1: color-mix(in srgb, #fff, transparent 90%);  /* Standard */
--ts-border-2: color-mix(in srgb, #fff, transparent 84%);  /* Prominent */
--ts-border-accent: var(--ts-accent-border);
```

### 11.4 Typography scale

```css
--ts-font-display: "Space Grotesk", system-ui, sans-serif;
--ts-font-body:    "Space Grotesk", system-ui, -apple-system, sans-serif;
--ts-font-mono:    "JetBrains Mono", "Fira Code", "Courier New", monospace;

/* Weight scale */
--ts-font-weight-thin: 300;  --ts-font-weight-normal: 400;
--ts-font-weight-medium: 500;  --ts-font-weight-semibold: 600;
--ts-font-weight-bold: 700;  --ts-font-weight-black: 900;

/* Line height scale */
--ts-line-height-tight: 0.92;  --ts-line-height-snug: 1.2;
--ts-line-height-normal: 1.5;  --ts-line-height-relaxed: 1.7;

/* Letter spacing */
--ts-letter-spacing-tight: -0.04em;  --ts-letter-spacing-normal: 0;
--ts-letter-spacing-wide: 0.08em;    --ts-letter-spacing-wider: 0.12em;
```

**Dynamic font size scale (all derived from --ts-fs-base):**
```css
--ts-fs-base: 16px;
--ts-font-scale: 1;
--ts-fs: calc(var(--ts-fs-base) * var(--ts-font-scale));

--ts-fs-3xs: calc(var(--ts-fs) * 0.5);     /* 8px — fine print */
--ts-fs-2xs: calc(var(--ts-fs) * 0.625);   /* 10px — micro labels */
--ts-fs-xs:  calc(var(--ts-fs) * 0.6875);  /* 11px — overlines */
--ts-fs-sm:  calc(var(--ts-fs) * 0.75);    /* 12px — captions */
--ts-fs-md:  calc(var(--ts-fs) * 0.8125);  /* 13px — body small */
--ts-fs-lg:  calc(var(--ts-fs) * 0.875);   /* 14px — body alt */
--ts-fs-xl:  calc(var(--ts-fs) * 0.9375);  /* 15px */
--ts-fs-2xl: calc(var(--ts-fs) * 1.125);   /* 18px */
--ts-fs-3xl: calc(var(--ts-fs) * 1.25);    /* 20px */
--ts-fs-4xl: calc(var(--ts-fs) * 1.5);     /* 24px */

/* Responsive headings (clamp-based) */
--ts-fs-h3: clamp(calc(var(--ts-fs) * 1.3), 2vw, calc(var(--ts-fs) * 1.8));
--ts-fs-h2: clamp(calc(var(--ts-fs) * 1.8), 3.5vw, calc(var(--ts-fs) * 2.8));
--ts-fs-h1: clamp(calc(var(--ts-fs) * 2.5), 5vw, calc(var(--ts-fs) * 4));

/* Display / Hero sizes */
--ts-fs-hero:    clamp(calc(var(--ts-fs) * 3.5), 12vw, calc(var(--ts-fs) * 10));
--ts-fs-display: clamp(calc(var(--ts-fs) * 2.5), 6vw, calc(var(--ts-fs) * 5.5));
--ts-fs-section-title: clamp(calc(var(--ts-fs) * 1.8), 4vw, calc(var(--ts-fs) * 3));
--ts-fs-lead:    clamp(var(--ts-fs), 2vw, calc(var(--ts-fs) * 1.35));
```

### 11.5 Spacing scale

4px base, all values as simple multiples:
```css
--ts-spacing-base: 4px;
--ts-spacing-scale: 1;
--ts-sp: calc(var(--ts-spacing-base) * var(--ts-spacing-scale));

--ts-sp-1: var(--ts-sp);              /* 4px */
--ts-sp-2: calc(var(--ts-sp) * 2);    /* 8px */
--ts-sp-3: calc(var(--ts-sp) * 3);    /* 12px */
--ts-sp-4: calc(var(--ts-sp) * 4);    /* 16px */
--ts-sp-5: calc(var(--ts-sp) * 5);    /* 20px */
--ts-sp-6: calc(var(--ts-sp) * 6);    /* 24px */
--ts-sp-8: calc(var(--ts-sp) * 8);    /* 32px */
--ts-sp-10: calc(var(--ts-sp) * 10);  /* 40px */
--ts-sp-12: calc(var(--ts-sp) * 12);  /* 48px */
--ts-sp-16: calc(var(--ts-sp) * 16);  /* 64px */
--ts-sp-20: calc(var(--ts-sp) * 20);  /* 80px */
--ts-sp-24: calc(var(--ts-sp) * 24);  /* 96px */

/* Section-level (responsive) */
--ts-section-gap: clamp(4rem, 8vw, 9rem);
--ts-section-pad: clamp(4rem, 8vw, 9rem);
```

### 11.6 Radius, shadow, animation, layout tokens

```css
/* Radius (one value controls all) */
--ts-radius-base: 10px;
--ts-radius-scale: 1;
--ts-radius: calc(var(--ts-radius-base) * var(--ts-radius-scale));
--ts-radius-xs: calc(var(--ts-radius) * 0.3);
--ts-radius-sm: calc(var(--ts-radius) * 0.5);
--ts-radius-md: var(--ts-radius);
--ts-radius-lg: calc(var(--ts-radius) * 1.4);
--ts-radius-xl: calc(var(--ts-radius) * 2);
--ts-radius-full: 9999px;

/* Shadow scale */
--ts-shadow-1: 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1);
--ts-shadow-2: 0 4px 12px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.1);
--ts-shadow-3: 0 10px 30px rgba(0,0,0,0.05), 0 4px 8px rgba(0,0,0,0.1);
--ts-shadow-4: 0 24px 60px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.1);
--ts-shadow-accent: 0 0 0 1px var(--ts-accent-border), 0 8px 32px color-mix(in srgb, var(--ts-accent), transparent 65%);

/* Animation tokens */
--ts-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ts-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ts-ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
--ts-dur-fast: 120ms;  --ts-dur-base: 200ms;  --ts-dur-slow: 350ms;
--ts-transition: all var(--ts-dur-base) var(--ts-ease-out);

/* Layout tokens */
--ts-container-sm: 640px;  --ts-container-md: 960px;
--ts-container-lg: 1280px; --ts-container-xl: 1520px;
--ts-container-pad: clamp(1rem, 5vw, 4rem);
--ts-grid-gap: var(--ts-sp-6);  --ts-card-gap: var(--ts-sp-4);
```

### 11.7 Component-level tokens (derived)

Each component reads its own scoped tokens, falling back to globals:
```css
/* Button */
--ts-btn-h: 50px;  --ts-btn-pad-x: var(--ts-sp-5);
--ts-btn-radius: var(--ts-radius-sm);  --ts-btn-fs: var(--ts-fs-sm);
--ts-btn-fw: var(--ts-font-weight-bold);  --ts-btn-ls: 0.1em;

/* Input */
--ts-input-h: 50px;  --ts-input-pad-x: var(--ts-sp-3);
--ts-input-bg: var(--ts-bg-3);  --ts-input-border: var(--ts-border-2);

/* Card */
--ts-card-pad: var(--ts-sp-6);  --ts-card-radius: var(--ts-radius-lg);
--ts-card-bg: var(--ts-bg-2);  --ts-card-border: var(--ts-border-0);

/* Panel */
--ts-panel-w: 340px;  --ts-panel-bg: var(--ts-bg-1);
--ts-panel-border: var(--ts-border-0);
```

**Per-instance overrides (no system pollution):**
```css
.my-special-card { --ts-card-bg: #1a1a2e; --ts-card-border: rgba(100,50,200,0.3); }
.my-panel { --ts-accent-h: 142; } /* Green accent for this panel only */
```

### 11.8 Component reference

**Buttons — `.ts-btn`**
Variants: `--primary` `--outline` `--ghost` `--danger` `--success` `--alt`
Sizes: `--sm` `--lg` `--xl` Modifiers: `--icon` `--full`
```html
<button class="ts-btn ts-btn--primary"><i class="fa-solid fa-bolt"></i> Primary</button>
<button class="ts-btn ts-btn--outline ts-btn--lg">Outline Large</button>
<button class="ts-btn ts-btn--icon ts-btn--sm" title="Settings"><i class="fa-solid fa-gear"></i></button>
```

**Cards — `.ts-card`**
Variants: `--accent` `--featured` `--glass` `--accent-bar` `--interactive`
```html
<div class="ts-card ts-card--featured">
  <div class="ts-card__header"><div class="ts-card__title">Title</div></div>
  <div class="ts-card__body">Content</div>
  <div class="ts-card__footer"><button class="ts-btn ts-btn--ghost ts-btn--sm">Action</button></div>
</div>
```

**Panels — `.ts-panel`**
Modifiers: `--docked` (fixed sidebar), `--float` (overlay), `--collapsed`

**Forms:** `.ts-field` `.ts-input` `.ts-select` `.ts-textarea` `.ts-toggle` `.ts-range`

**Layout:**
```html
<div class="ts-container">          <!-- max 1280px -->
<div class="ts-container ts-container--xl">  <!-- max 1520px -->
<section class="ts-section ts-section--glow">  <!-- accent glow effect -->
<div class="ts-grid ts-grid--3">         <!-- 3 columns -->
<div class="ts-grid ts-grid--auto-md">  <!-- responsive: minmax(300px, 1fr) -->
```

**Surfaces:** `.ts-surface-2` `.ts-glass` `.ts-glass--accent` `.ts-bg-grid` `.ts-grain` `.ts-grain--animated`

**Scroll animations:** Add `.ts-fade-up` to any element. JS observer triggers `.ts-visible`.
Delays: `ts-delay-1` (80ms) `ts-delay-2` (160ms) `ts-delay-3` (240ms) `ts-delay-4` (320ms)

**Hero section pattern:**
```html
<section class="ts-hero ts-grain ts-section--glow">
  <div class="ts-container">
    <div class="ts-hero__badge"><i class="fa-solid fa-circle" style="font-size:6px"></i> Tag · v1.0</div>
    <h1 class="ts-hero-title">BIG <span class="ts-gradient-text">TITLE</span></h1>
    <p>Supporting description.</p>
    <div class="ts-hero__actions">
      <button class="ts-btn ts-btn--primary ts-btn--lg">Primary CTA</button>
      <a href="#" class="ts-btn ts-btn--outline ts-btn--lg">Secondary</a>
    </div>
  </div>
</section>
```

### 11.9 Runtime theme switching (JavaScript API)

```js
Toolskin.setAccent(195, '100%', '40%');   // Switch by HSL
Toolskin.setAccentHex('#2efc86');          // Switch by hex
Toolskin.setRadius(6);                    // Sharp corners
Toolskin.setFont('Inter, sans-serif');    // Change font
Toolskin.refresh();                       // Re-scan DOM after dynamic content
```

### 11.10 WordPress integration

```php
// In functions.php:
wp_enqueue_style('toolskin', get_template_directory_uri() . '/toolskin.css');
wp_enqueue_script('toolskin', get_template_directory_uri() . '/toolskin.js', [], '1.0.0', true);
```

Admin bar auto-detected: `body.admin-bar .ts-topbar { top: calc(var(--ts-topbar-h) + 32px); }`

---

---

## WORDPRESS CHILD THEME TOKEN BRIDGE (customized_v4amn.css)

The child theme CSS establishes the Toolskin engine primitives and maps them to Enfold's
legacy variable names. This is the SINGLE SOURCE OF TRUTH for each WordPress site.

### Core engine primitives (edit ONLY these to retheme a site)
```css
:root {
  /* ── ACCENT ENGINE (HSL) ── Change --ts-h to change ALL accent colors */
  --ts-h:      18;        /* Hue 0–360: 18=orange, 142=green, 220=blue, 270=purple */
  --ts-s:      100%;      /* Saturation */
  --ts-l:      52%;       /* Lightness */
  
  /* ── ALT/SECONDARY ── */
  --ts-alt-h:  220;       /* Alt hue */
  --ts-alt-s:  73%;
  --ts-alt-l:  43%;
  
  /* ── TRIADIC (optional third color) ── */
  --ts-tri-h:  193;
  --ts-tri-s:  84%;
  --ts-tri-l:  56%;

  /* ── SURFACE ENGINE ── */
  --ts-bg-base:   #141414;   /* Deepest (body bg) */
  --ts-bg-1:      #1c1c1c;   /* Mid-dark */
  --ts-bg-2:      #212121;   /* Standard dark */
  --ts-bg-3:      #191b22;   /* Dark-blue tint */
  --ts-bg-4:      #222222;   /* Gray */

  /* ── RADIUS ── */
  --ts-radius-base: 8px;

  /* ── TYPOGRAPHY ── */
  --ts-font-body:  'Raleway', system-ui, sans-serif;
  --ts-font-title: 'Raleway', system-ui, sans-serif;
}
```

### Enfold variable mapping (auto-generated from engine)
```css
:root {
  /* These are what Enfold selectors consume — powered by Toolskin */
  --maincolor:       var(--ts-accent);
  --orange:          var(--ts-accent);
  --orange-2:        var(--ts-alt);
  --altcolor:        var(--ts-alt);
  --darkbg2:         var(--ts-bg-base);
  --darkbg:          var(--ts-bg-2);
  --darkbg-1:        var(--ts-bg-1);
  --border-radius:   var(--ts-radius-md);
  --mainfont:        var(--ts-font-body);
  --titlefont:       var(--ts-font-title);
  
  /* Computed accent variants */
  --ts-accent:          hsl(var(--ts-h), var(--ts-s), var(--ts-l));
  --ts-accent-bright:   color-mix(in srgb, var(--ts-accent), #fff 15%);
  --ts-accent-dark:     color-mix(in srgb, var(--ts-accent), #000 30%);
  --ts-accent-transp:   color-mix(in srgb, var(--ts-accent), transparent 70%);
  --ts-accent-dim:      color-mix(in srgb, var(--ts-accent), transparent 82%);
  --ts-accent-border:   color-mix(in srgb, var(--ts-accent), transparent 55%);
  --ts-accent-grad:     linear-gradient(126deg, var(--ts-accent), var(--ts-alt), var(--ts-accent));
}
```

### Key WordPress custom_class CSS patterns
```css
/* Hero heading gradient text */
.hero-heading-gradient b, .hero-strong-gradient strong.gradient {
  background: linear-gradient(126deg, var(--ts-accent), var(--ts-alt));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 900;
}

/* Stat card (column as card) */
.stat-card {
  background: var(--ts-bg-2) !important;
  border: 1px solid rgba(58,58,58,0.62);
  border-radius: var(--border-radius);
  padding: 30px;
}

/* Snap sections */
.snap-section { scroll-snap-align: start; }

/* Grid background pattern */
.grid-bg, .ba-grid {
  background-image: var(--ts-bg-grid-pattern);
  background-size: var(--ts-canvas-grid-size) var(--ts-canvas-grid-size);
}

/* Grain overlay (Toolskin native) */
.ts-grain::before {
  content: '';
  position: absolute; inset: -20%;
  width: 140%; height: 140%;
  background-image: var(--ts-grain);
  background-size: 200px 200px;
  opacity: 0.5;
  mix-blend-mode: soft-light;
  pointer-events: none; z-index: 1;
}
.ts-grain-flickered::before {
  animation: ts-grain-flickered 0.2s steps(4) infinite;
  mix-blend-mode: overlay; z-index: 40;
}

/* Numbered icon list (CSS counter) */
.custom-benefits-list.numbered .avia-icon-list-item {
  counter-increment: benefits;
}
.custom-benefits-list.numbered .avia-icon-list-item .avia-iconbox-icon {
  content: counter(benefits, decimal-leading-zero);
}

/* Steps horizontal layout */
.steps.horizontal { display: flex; flex-wrap: wrap; }
.steps.horizontal .avia-icon-list-item { flex: 1; min-width: 200px; }

/* Deep 3D flip cards (icongrid) */
.deep-cards .av-icongrid-flipbox { perspective: 1000px; }
```

### Toolskin --ts- prefix convention
ALL CSS custom properties introduced by this design system or acquired from external skills
MUST use the `--ts-` prefix to maintain namespace consistency:
```
--ts-[category]-[property]-[variant]-[state]

Examples:
--ts-accent-h         (color engine: hue)
--ts-bg-2             (surface: level 2)
--ts-sp-6             (spacing: 24px)
--ts-radius-lg        (radius: large)
--ts-fs-h1            (font size: heading 1)
--ts-shadow-accent    (shadow: accent glow)
--ts-ease-spring      (animation: spring easing)
--ts-card-bg          (component: card background)
```

When importing patterns from external skills or frameworks, RE-PREFIX all custom properties:
- External `--color-primary` → `--ts-color-primary`
- External `--spacing-md` → `--ts-sp-4` (map to existing scale)
- External `--radius-lg` → `--ts-radius-lg` (use existing token)
