# TOOLSKIN — Design System v1.0.0

> A token-driven, framework-independent CSS design system for WordPress themes, web applications, and UI toolkits. Zero framework dependencies. One stylesheet. Full dynamic control.

---

## Overview

**Toolskin** is the visual consolidation of patterns developed across the **YSS Toolpanel**, **Toolcore Framework**, **Degent WordPress theme**, and the **Banner Generator UI**. It extracts the best practices from those projects into a clean, scalable, production-ready CSS architecture.

**Toolcore** is the JavaScript and programmatic side of this framework (modal builder, smart button system, toast manager, etc.). Toolskin is the CSS and visual layer that works anywhere you place its classes on the DOM.

---

## Files Included

| File | Description |
|------|-------------|
| `toolskin.css` | Master design system stylesheet — all tokens, components, utilities |
| `toolskin.js`  | UI modules: tabs, modals, toasts, toggles, scroll observer, icons, theme switching |
| `showcase.html`| Complete component showcase — all modules and variants displayed |
| `README.md`    | This documentation |

---

## Quick Start

```html
<!-- 1. Add fonts (recommended) -->
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />

<!-- 2. Add icons -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
<script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>

<!-- 3. Add Toolskin -->
<link rel="stylesheet" href="toolskin.css" />
<script src="toolskin.js" defer></script>
```

That's it. No build step. No preprocessor. No framework.

---

## Design Token Architecture

All visual settings cascade from a small set of root variables. Changing a single token rewrites an entire design dimension.

### Color Engine (HSL-based)

```css
:root {
  /* Change these three values to recolor EVERYTHING */
  --ts-accent-h: 18;       /* Hue */
  --ts-accent-s: 100%;     /* Saturation */
  --ts-accent-l: 52%;      /* Lightness */
}
```

All accent variants are computed dynamically via `color-mix()`. **No hardcoded hex values** for color variants:

```css
--ts-accent:        hsl(var(--ts-accent-h), var(--ts-accent-s), var(--ts-accent-l));
--ts-accent-bright: color-mix(in srgb, var(--ts-accent), #fff 15%);
--ts-accent-dark:   color-mix(in srgb, var(--ts-accent), #000 25%);
--ts-accent-dim:    color-mix(in srgb, var(--ts-accent), transparent 82%);
--ts-accent-border: color-mix(in srgb, var(--ts-accent), transparent 60%);
```

### Runtime Theme Switching (JavaScript)

```js
// Switch accent by HSL
Toolskin.setAccent(195, '100%', '40%');

// Switch accent by hex
Toolskin.setAccentHex('#2efc86');

// Change global border radius
Toolskin.setRadius(6);

// Change font family
Toolskin.setFont('Inter, sans-serif');
```

### Global Radius (cascade pattern)

```css
--ts-radius-base: 10px;  /* ← EDIT THIS ONE VALUE */

--ts-radius-xs:  calc(var(--ts-radius-base) * 0.3);
--ts-radius-sm:  calc(var(--ts-radius-base) * 0.5);
--ts-radius-md:  var(--ts-radius-base);
--ts-radius-lg:  calc(var(--ts-radius-base) * 1.4);
--ts-radius-xl:  calc(var(--ts-radius-base) * 2);
```

One change. All components update.

### Spacing Scale

```css
--ts-sp-1: 4px   --ts-sp-5: 20px   --ts-sp-12: 48px
--ts-sp-2: 8px   --ts-sp-6: 24px   --ts-sp-16: 64px
--ts-sp-3: 12px  --ts-sp-8: 32px   --ts-sp-20: 80px
--ts-sp-4: 16px  --ts-sp-10: 40px  --ts-sp-24: 96px
```

---

## Component Reference

### Buttons — `.ts-btn`

**Variants:** `--primary` `--outline` `--ghost` `--danger` `--success` `--alt`  
**Sizes:** `--sm` `--lg` `--xl`  
**Modifiers:** `--icon` `--full`

```html
<button class="ts-btn ts-btn--primary">
  <i class="fa-solid fa-bolt"></i> Primary Button
</button>

<button class="ts-btn ts-btn--outline ts-btn--lg">
  <i class="fa-solid fa-arrow-right"></i> Outline Large
</button>

<button class="ts-btn ts-btn--icon ts-btn--sm" title="Settings">
  <i class="fa-solid fa-gear"></i>
</button>

<!-- With counter badge -->
<button class="ts-btn ts-btn--primary">
  Notifications <span class="ts-btn__counter">12</span>
</button>
```

---

### Cards — `.ts-card`

**Variants:** `--accent` `--featured` `--glass` `--accent-bar` `--interactive`

```html
<!-- Default -->
<div class="ts-card">
  <div class="ts-card__header">
    <div class="ts-card__title"><i class="fa-solid fa-cube"></i> Card Title</div>
    <span class="ts-badge ts-badge--accent">Active</span>
  </div>
  <div class="ts-card__body">Content here.</div>
  <div class="ts-card__footer">
    <span class="ts-caption">Meta info</span>
    <button class="ts-btn ts-btn--ghost ts-btn--sm">Action</button>
  </div>
</div>

<!-- Featured -->
<div class="ts-card ts-card--featured">...</div>

<!-- Glass (works on media backgrounds) -->
<div class="ts-card ts-card--glass">...</div>

<!-- Accent left stripe -->
<div class="ts-card ts-card--accent-bar">...</div>
```

---

### Tool Panels — `.ts-panel`

The core UI component for the Toolcore/YSS Toolpanel pattern.

**Modifiers:** `--docked` (fixed sidebar) `--float` (floating overlay) `--collapsed`

```html
<div class="ts-panel">
  <!-- Header -->
  <div class="ts-panel__header">
    <div class="ts-panel__title">Panel <strong>Title</strong></div>
    <div class="ts-panel__header-actions">
      <button class="ts-btn ts-btn--ghost ts-btn--icon ts-btn--sm">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  </div>

  <!-- Body (scrollable) -->
  <div class="ts-panel__body">
    <!-- Control row with grouped buttons -->
    <div class="ts-panel__row">
      <div class="ts-panel__group">
        <button class="ts-btn ts-btn--primary ts-btn--sm">
          <i class="fa-solid fa-play"></i> Start
        </button>
        <button class="ts-btn ts-btn--sm ts-btn--icon" disabled>
          <i class="fa-solid fa-pause"></i>
        </button>
      </div>
    </div>

    <!-- Log area -->
    <div class="ts-log">
      <div class="ts-log__entry ts-log__entry--success">[12:00:01] Process started</div>
      <div class="ts-log__entry ts-log__entry--error">[12:00:05] Error detected</div>
    </div>
  </div>

  <!-- Status bar -->
  <div class="ts-panel__status">
    <div class="ts-panel__status-item">
      <span class="ts-dot ts-dot--success ts-dot--pulse"></span> Idle
    </div>
    <div class="ts-panel__status-item">
      <i class="fa-solid fa-video"></i> 147 Videos
    </div>
  </div>
</div>
```

**Collapsible panel** via JavaScript:

```html
<button data-collapse-trigger="panel-body-id">Toggle</button>
<div id="panel-body-id" class="ts-panel__body">...</div>
```

---

### Forms — `.ts-field` / `.ts-input` / `.ts-select` / `.ts-textarea`

```html
<!-- Basic field -->
<div class="ts-field">
  <label class="ts-field-label">Project Name</label>
  <input type="text" class="ts-input" placeholder="Enter name…" />
</div>

<!-- With icon prefix -->
<div class="ts-field">
  <label class="ts-field-label">Search</label>
  <div class="ts-input-group">
    <i class="ts-input-icon fa-solid fa-search"></i>
    <input type="text" class="ts-input" placeholder="Search…" />
  </div>
</div>

<!-- Select -->
<div class="ts-select-wrap">
  <select class="ts-select">
    <option>Option 1</option>
  </select>
</div>

<!-- 2-column layout -->
<div class="ts-field-row-2">
  <div class="ts-field">...</div>
  <div class="ts-field">...</div>
</div>
```

---

### Toggle Switch — `.ts-toggle`

```html
<div class="ts-toggle-row">
  <span class="ts-toggle-label">Enable Feature</span>
  <label class="ts-toggle">
    <input type="checkbox" />
    <span class="ts-toggle__knob"></span>
  </label>
</div>
```

---

### Range Slider — `.ts-range`

```html
<div class="ts-range-row">
  <input type="range" class="ts-range" min="0" max="5000" value="1200"
         oninput="this.nextElementSibling.textContent = this.value + 'ms'" />
  <span class="ts-range-val">1200ms</span>
</div>
```

---

### Tabs — `.ts-tabs` / `.ts-tab` / `.ts-tab-pane`

**Variants:** Default (underline) and `ts-tabs--pill`

```html
<div class="ts-tabs">
  <button class="ts-tab ts-tab--active" data-tab="pane-one">Tab 1</button>
  <button class="ts-tab" data-tab="pane-two">Tab 2</button>
</div>

<div class="ts-tab-pane ts-tab-pane--active" id="pane-one">
  Content for tab 1.
</div>
<div class="ts-tab-pane" id="pane-two">
  Content for tab 2.
</div>
```

JS activates tabs automatically. Or call:
```js
// Activate by pane ID
document.querySelector('.ts-tabs').__tsTabsInstance.activate('pane-two');
```

---

### Chips / Tags — `.ts-chip`

**Variants:** Default, `--active`, `--accent`, `--success`, `--warning`, `--danger`

```html
<div class="ts-chips">
  <span class="ts-chip ts-chip--active">Selected</span>
  <span class="ts-chip">Option</span>
  <span class="ts-chip ts-chip--accent">Featured</span>
</div>
```

---

### Badges — `.ts-badge`

```html
<span class="ts-badge">Default</span>
<span class="ts-badge ts-badge--accent">Accent</span>
<span class="ts-badge ts-badge--success">Live</span>
<span class="ts-badge ts-badge--warning">Beta</span>
<span class="ts-badge ts-badge--danger">Error</span>
```

### Status Dots — `.ts-dot`

```html
<span class="ts-dot ts-dot--success ts-dot--pulse"></span>
<span class="ts-dot ts-dot--warning"></span>
<span class="ts-dot ts-dot--danger"></span>
<span class="ts-dot ts-dot--accent"></span>
```

---

### Modal — `.ts-overlay` / `.ts-modal`

**Sizes:** Default, `--sm`, `--lg`, `--xl`

```html
<!-- Trigger (any element) -->
<button data-modal-open="my-modal">Open Modal</button>

<!-- Modal markup -->
<div class="ts-overlay" id="my-modal">
  <div class="ts-modal">
    <div class="ts-modal__header">
      <div class="ts-modal__title">Title</div>
      <button class="ts-modal__close" data-modal-close aria-label="Close">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
    <div class="ts-modal__body">
      <p>Modal content here.</p>
    </div>
    <div class="ts-modal__footer">
      <button class="ts-btn ts-btn--ghost" data-modal-close>Cancel</button>
      <button class="ts-btn ts-btn--primary">Confirm</button>
    </div>
  </div>
</div>
```

Programmatic control:
```js
Toolskin.openModal('my-modal');
Toolskin.closeModal('my-modal');
```

---

### Toast Notifications

```js
// Basic
Toolskin.showToast('Message text');

// With options
Toolskin.showToast('Upload complete.', {
  type:     'success',     // 'success' | 'warning' | 'error' | 'info' | 'default'
  title:    'Done!',
  duration: 4000,          // ms, 0 = persistent
});
```

---

### Progress Bar — `.ts-progress`

**Modifiers:** `--sm` `--lg` `--striped`

```html
<div class="ts-progress-row">
  <span class="ts-progress-label">Processing</span>
  <span class="ts-progress-value">68%</span>
</div>
<div class="ts-progress">
  <div class="ts-progress__bar" style="width: 68%"></div>
</div>
```

---

### Log / Terminal — `.ts-log`

**Entry types:** `--info` `--debug` `--success` `--warning` `--error` `--accent`

```html
<div class="ts-log">
  <div class="ts-log__entry ts-log__entry--info">[12:00:01] Status: Idle</div>
  <div class="ts-log__entry ts-log__entry--success">[12:00:02] Task complete</div>
  <div class="ts-log__entry ts-log__entry--error">[12:00:05] Error: Timeout</div>
</div>
```

---

### 3D Flip Cards — `.ts-flip-card`

```html
<div class="ts-flip-card">
  <div class="ts-flip-card__inner">
    <div class="ts-flip-card__front">
      <h3>Front</h3>
      <p>Hover to flip</p>
    </div>
    <div class="ts-flip-card__back">
      <h3>Back</h3>
      <button class="ts-btn ts-btn--primary ts-btn--sm">Action</button>
    </div>
  </div>
</div>
```

---

### Pricing Cards — `.ts-pricing-card`

**Modifiers:** `--featured`

```html
<div class="ts-pricing-card ts-pricing-card--featured">
  <div class="ts-pricing-card__recommend">Recommended</div>
  <div class="ts-label">Studio</div>
  <div class="ts-pricing-card__price ts-text-accent"><sup>$</sup>199</div>
  <div class="ts-pricing-card__features">
    <div class="ts-pricing-card__feature">
      <i class="fa-solid fa-check"></i> Unlimited Domains
    </div>
  </div>
  <button class="ts-btn ts-btn--primary ts-btn--full">Select Plan</button>
</div>
```

---

### Testimonial — `.ts-testimonial`

```html
<div class="ts-testimonial">
  <blockquote>"Your quote text here."</blockquote>
  <div>
    <div class="ts-testimonial__author-name">Author Name</div>
    <div class="ts-testimonial__author-role">Role · Company</div>
  </div>
</div>
```

---

### Color Swatch Input — `.ts-swatch`

```html
<div class="ts-color-row">
  <div class="ts-swatch">
    <input type="color" value="#ff5500"
           oninput="this.nextElementSibling.style.background = this.value" />
    <div class="ts-swatch__preview" style="background: #ff5500"></div>
  </div>
  <input type="text" class="ts-input ts-input--mono" value="#ff5500" style="max-width:120px" />
</div>
```

---

## Layout Classes

### Container

```html
<div class="ts-container">          <!-- max 1280px -->
<div class="ts-container ts-container--md">  <!-- max 960px -->
<div class="ts-container ts-container--xl">  <!-- max 1520px -->
```

### Section

```html
<section class="ts-section">             <!-- standard section -->
<section class="ts-section ts-section--alt">   <!-- alternating background -->
<section class="ts-section ts-section--glow">  <!-- accent glow effect -->
```

### Grid

```html
<div class="ts-grid ts-grid--3">         <!-- 3 columns -->
<div class="ts-grid ts-grid--auto-md">  <!-- responsive: minmax(300px, 1fr) -->
<div class="ts-grid ts-grid--panel">    <!-- 1fr + panel width sidebar -->
```

### Flex

```html
<div class="ts-flex-between">  <!-- space-between, align center -->
<div class="ts-flex-center">   <!-- center both axes -->
<div class="ts-flex-col ts-gap-4">  <!-- column + gap -->
```

### Surfaces & Backgrounds

```html
<div class="ts-surface-2">       <!-- bg level 2 -->
<div class="ts-glass">           <!-- frosted glass -->
<div class="ts-glass--accent">   <!-- accent-tinted glass -->
<div class="ts-bg-grid">         <!-- engineering dot/line grid pattern -->
<div class="ts-grain">           <!-- film grain overlay (pseudo-element) -->
<div class="ts-grain ts-grain--animated">  <!-- animated grain -->
```

---

## Scroll Animations

Add `.ts-fade-up` to any element. The JS observer triggers `.ts-visible` on entry:

```html
<div class="ts-fade-up">Animates in on scroll</div>
<div class="ts-fade-up ts-delay-2">With 160ms delay</div>
<div class="ts-fade-up ts-delay-4">With 320ms delay</div>
```

Available delays: `ts-delay-1` (80ms) `ts-delay-2` (160ms) `ts-delay-3` (240ms) `ts-delay-4` (320ms)

---

## Hero Section

```html
<section class="ts-hero ts-grain ts-section--glow">
  <div class="ts-container">
    <div class="ts-hero__badge">
      <i class="fa-solid fa-circle" style="font-size:6px"></i>
      Tag · v1.0
    </div>

    <h1 class="ts-hero-title">
      BIG <span class="ts-gradient-text">TITLE</span>
    </h1>

    <p>Supporting description text.</p>

    <div class="ts-hero__actions">
      <button class="ts-btn ts-btn--primary ts-btn--lg">Primary CTA</button>
      <a href="#" class="ts-btn ts-btn--outline ts-btn--lg">Secondary</a>
    </div>
  </div>
</section>
```

---

## Tooltip

```html
<button class="ts-btn" data-tooltip="This is a tooltip">Hover me</button>
<button data-tooltip="Below tooltip" data-tooltip-pos="below">Below</button>
```

Tooltips are CSS-only. No JavaScript required.

---

## Icons

### Inline (recommended)

```html
<i class="fa-solid fa-rocket"></i>
<ion-icon name="rocket-outline"></ion-icon>
```

### Via data attribute (DOM-clean approach)

```html
<span data-icon="fa:fa-solid fa-rocket"></span>
<span data-icon="ion:rocket-outline"></span>
```

JavaScript injects the icon element automatically, keeping HTML semantic and clean.

---

## JavaScript API Reference

### `Toolskin.init()`
Initialises all modules. Called automatically. Re-call after dynamic DOM mutations.

### `Toolskin.showToast(message, options)`
```js
Toolskin.showToast('Done!', {
  type: 'success',   // 'default' | 'success' | 'warning' | 'error' | 'info'
  title: 'Title',
  duration: 4000,
});
```

### `Toolskin.openModal(id)` / `Toolskin.closeModal(id)`
```js
Toolskin.openModal('modal-id');
Toolskin.closeModal('modal-id');
```

### `Toolskin.setAccentHex(hex)` / `Toolskin.setAccent(h, s, l)`
```js
Toolskin.setAccentHex('#2efc86');
Toolskin.setAccent(142, '76%', '36%');
```

### `Toolskin.setRadius(px)`
```js
Toolskin.setRadius(4);   // Sharp
Toolskin.setRadius(16);  // Rounded
```

### `Toolskin.refresh()`
Re-scans DOM for new `.ts-fade-up` elements and `[data-icon]` attributes after dynamic content injection.

---

## WordPress Integration

### Theme Setup

```php
// In functions.php:
wp_enqueue_style('toolskin', get_template_directory_uri() . '/toolskin.css');
wp_enqueue_script('toolskin', get_template_directory_uri() . '/toolskin.js', [], '1.0.0', true);
```

### Admin Bar Compatibility

The system automatically detects `body.admin-bar` and offsets fixed panels:

```css
/* Applied automatically */
body.admin-bar .ts-topbar { top: calc(var(--ts-topbar-h) + 32px); }
```

Override admin bar height:
```css
:root { --ts-wp-adminbar-h: 46px; } /* mobile WP bar is 46px */
```

### WordPress Theme Customizer

Override accent color from PHP:
```php
$accent = get_theme_mod('accent_color', '#ff5500');
echo "<style>:root{--ts-accent-h:" . hsl_hue($accent) . ";}</style>";
```

---

## Overriding Component Tokens

Each component reads from local scoped tokens that fall back to globals. To override a single component without touching the system:

```css
/* Override card appearance only */
.my-special-card {
  --ts-card-bg: #1a1a2e;
  --ts-card-border: rgba(100, 50, 200, 0.3);
  --ts-card-radius: 20px;
}

/* Override accent for a specific panel */
.my-panel {
  --ts-accent-h: 142;   /* Green accent for this panel only */
}
```

---

## Design Reference Brief

The Toolskin system was synthesized from the following design references:

| Source | Contribution |
|--------|-------------|
| **YSS Toolpanel** (`userscript_styles_66.css`) | Panel anatomy, button group patterns, log block design, status bar, collapsed states, flat-theme / gradient-btn variants |
| **Degent WordPress Theme** (`degent_v3.css`) | HSL-based color variables, `color-mix()` transparent variants, scrollbar design, admin bar integration, WP compatibility patterns |
| **Banner Generator** (`toolskin-banner-generator_v2_3_1.html`) | Surface depth stack (0–5), card/field/input/slider/toggle component definitions, tab system, color swatch, panel+canvas app shell layout |
| **Toolcore Pitch** (`code.html`) | Grain overlay SVG technique, `clamp()` responsive typography, flip card component, grainy hero pattern, section alternation |
| **Toolcore Design Tokens** (`design-tokens.css`) | Spacing scale naming, radius system, semantic component token layering |
| **Components CSS** (`components.css`) | Flip card 3D transform pattern, custom cursor concept, noise overlay positioning |
| **SatSea / Degent** | Accent glow radial gradient, dark surface palette values, border color relative-to-background design rule |
| **Awwwards / Editorial reference** | Hero typography scale (`clamp`), uppercase micro-label treatment, gradient text technique, grain animation |

---

## Prefixes

| Prefix | Scope |
|--------|-------|
| `ts-`  | Toolskin visual/layout classes |
| `tk-`  | ToolCore programmatic/JS classes (separate system) |
| `yss-` | YSS Toolpanel legacy classes (migrating) |

---

## Browser Support

| Feature | Requirement |
|---------|-------------|
| `color-mix()` | Chrome 111+, Firefox 113+, Safari 16.2+ |
| `clamp()` | Chrome 79+, Firefox 75+, Safari 13.1+ |
| `backdrop-filter` | Chrome 76+, Firefox 103+, Safari 9+ |
| CSS Custom Properties | All modern browsers |
| `IntersectionObserver` | Chrome 51+, Firefox 55+, Safari 12.1+ |

---

*Toolskin v1.0.0 — 2025*
