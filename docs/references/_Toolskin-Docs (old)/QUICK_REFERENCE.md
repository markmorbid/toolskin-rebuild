# 🎛️ Toolskin Configuration Quick Reference

## Minimal Setup (Zero Config)

```html
<link rel="stylesheet" href="toolskin.css" />
<script src="https://unpkg.com/lenis@1.3.18/dist/lenis.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/locomotive-scroll/bundled/locomotive-scroll.min.js"></script>
<script src="toolskin.js" defer></script>
```

✅ **Everything works automatically!**

---

## Custom Configuration

```javascript
Toolskin.init({
  smoothScroll: {
    enabled: true,
    duration: 1.2,
  },
  
  locomotiveScroll: {
    enabled: false,        // ⚠️ Disabled by default (use manual parallax only)
    autoDetect: false,     // Prevents conflicts with fade animations
  },
  
  theme: {
    mode: 'dark',  // 'dark' | 'light' | 'auto'
    enableToggle: true,
  },
  
  layout: {
    containerMaxWidth: '1400px',
    enableNoise: true,
    elasticMode: false,
  },
  
  reveal: {
    enabled: true,
    autoReveal: true,      // Auto-animate cards/panels
    selectors: '.ts-card, .ts-panel, .ts-pricing-card',
    defaultAnimation: 'ts-fade-up',
    threshold: 0.1,
  },
  
  cursor: {
    enabled: true,
  },
});
```

---

## ✨ Scroll Reveal Animations (NEW!)

### Available Animations

```html
<div class="ts-fade-in">Simple fade</div>
<div class="ts-fade-up">From bottom (default)</div>
<div class="ts-fade-left">From right</div>
<div class="ts-fade-right">From left</div>
<div class="ts-zoom-in">Scale up</div>
<div class="ts-zoom-out">Scale down</div>
<div class="ts-slide-up">Large bottom movement</div>
<div class="ts-slide-left">Large right movement</div>
<div class="ts-slide-right">Large left movement</div>
<div class="ts-flip-up">3D flip effect</div>
<div class="ts-bounce-in">Spring physics</div>
```

### Stagger & Speed

```html
<!-- Sequential reveals -->
<div class="ts-fade-up ts-delay-1">First (100ms delay)</div>
<div class="ts-fade-up ts-delay-2">Second (200ms delay)</div>
<div class="ts-fade-up ts-delay-3">Third (300ms delay)</div>

<!-- Speed variants -->
<div class="ts-fade-up ts-reveal-fast">Fast (300ms)</div>
<div class="ts-fade-up">Normal (600ms)</div>
<div class="ts-fade-up ts-reveal-slow">Slow (800ms)</div>
<div class="ts-fade-up ts-reveal-slower">Slower (1200ms)</div>
```

### Skip Auto-Animation

```html
<!-- Cards auto-animate by default, skip with: -->
<div class="ts-card" data-ts-reveal-skip>No animation</div>
```

### Programmatic Control

```javascript
// Reveal all elements immediately
Toolskin.observer.revealAll();

// Reveal specific element
Toolskin.observer.revealNow(element);

// Refresh after adding new elements
Toolskin.observer.refresh();
```

---

## Parallax Effects (Optional)

⚠️ **Locomotive Scroll is disabled by default** to prevent conflicts.

### Manual Parallax (Recommended)

```html
<!-- Add to specific elements only -->
<div data-scroll data-scroll-speed="0.5" data-ts-parallax="true">
  Parallax element
</div>
```

```javascript
Toolskin.init({
  locomotiveScroll: { enabled: true, autoDetect: false }
});
```

---

## Quick Actions

### Theme Control
```javascript
Toolskin.setTheme('light');
Toolskin.toggleTheme();
```

### Scroll Control
```javascript
Toolskin.scrollTo('#section', { duration: 1.2 });
```

### Modals & Toasts
```javascript
Toolskin.openModal('modalId');
Toolskin.showToast('Message', { type: 'success' });
```

### Dynamic Updates
```javascript
Toolskin.refresh();
Toolskin.updateLayout({ containerMaxWidth: '1600px' });
```

### Color Customization
```javascript
Toolskin.setAccentHex('#ff5500');
Toolskin.setRadius(15);
```

---

## HTML Data Attributes

```html
<!-- Theme toggle -->
<button data-theme-toggle>Toggle Theme</button>

<!-- Modal trigger -->
<button data-modal-open="myModal">Open</button>

<!-- Collapse -->
<button data-collapse-trigger="panel">Toggle</button>

<!-- Custom cursor label -->
<button data-cursor="CLICK ME">Button</button>

<!-- Skip parallax -->
<div class="ts-container" data-ts-scroll-skip>No parallax</div>

<!-- Tab -->
<button class="ts-tab" data-tab="tab1">Tab 1</button>
```

---

## CSS Classes

### Layout
- `.ts-container` — Max width container
- `.ts-container--content` — Narrower content width
- `.ts-container--full` — Full width
- `.ts-layout-elastic` — Brutalist full-width mode
- `.ts-no-grain` — Disable noise overlay

### Surfaces
- `.ts-surface-0` to `.ts-surface-5` — Dark surfaces
- `.ts-glass` — Glassmorphism effect
- `.ts-grain` — Noise/grain overlay

### Components
- `.ts-btn`, `.ts-btn--primary`, `.ts-btn--outline`
- `.ts-card`, `.ts-card--interactive`
- `.ts-modal`, `.ts-overlay`
- `.ts-tabs`, `.ts-tab`, `.ts-tab-pane`
- `.ts-range` — Range slider with gradient
- `.ts-toggle` — Toggle switch

### Utilities
- `.ts-flex`, `.ts-flex-col`, `.ts-flex-center`
- `.ts-grid`, `.ts-grid--2`, `.ts-grid--auto-md`
- `.ts-gap-4`, `.ts-mt-8`, `.ts-mb-4`
- `.ts-text-accent`, `.ts-text-muted`
- `.ts-rounded`, `.ts-border`
- `.ts-hidden`, `.ts-visible`

---

## Events

```javascript
window.addEventListener('ts:ready', () => {});
window.addEventListener('ts:theme-change', (e) => {});
document.addEventListener('ts:tab-change', (e) => {});
document.addEventListener('ts:modal-open', () => {});
document.addEventListener('ts:toggle', (e) => {});
```

---

## Advanced Access

```javascript
// Module instances
Toolskin.theme.setMode('light');
Toolskin.smooth.scrollTo('#target');
Toolskin.locomotive.refresh();

// Global instances
window.lenis            // Lenis smooth scroll
window.locomotiveScroll // Locomotive parallax
```

---

**See `TOOLSKIN_USAGE_GUIDE.md` for complete documentation.**
