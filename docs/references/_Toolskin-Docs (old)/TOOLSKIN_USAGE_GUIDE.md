# 📘 Toolskin Framework v2.0 — Complete Usage Guide

**Toolskin** is a production-ready, dark-themed UI framework with integrated smooth scrolling (Lenis), parallax effects (Locomotive Scroll), light/dark theme support, and zero-config initialization.

---

## 🚀 Quick Start

### 1. **Include Dependencies**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Toolskin CSS -->
  <link rel="stylesheet" href="toolskin.css" />

  <!-- External Libraries (required for smooth scroll & parallax) -->
  <script src="https://unpkg.com/lenis@1.3.18/dist/lenis.min.js"></script>
  <link rel="stylesheet" href="https://unpkg.com/lenis@1.3.18/dist/lenis.css">
  <script src="https://cdn.jsdelivr.net/npm/locomotive-scroll/bundled/locomotive-scroll.min.js"></script>

  <!-- Toolskin Framework -->
  <script src="toolskin.js" defer></script>
</head>
<body>
  <!-- Your content -->
</body>
</html>
```

### 2. **Zero-Config Initialization**

Toolskin automatically initializes with sensible defaults when the DOM loads. No configuration required!

```html
<script>
  // Listen for ready event (optional)
  window.addEventListener('ts:ready', () => {
    console.log('Toolskin is ready!');
  });
</script>
```

---

## ⚙️ Configuration

### Custom Configuration

Override defaults by calling `Toolskin.init()` with a configuration object:

```javascript
Toolskin.init({
  // Smooth Scroll (Lenis)
  smoothScroll: {
    enabled: true,
    duration: 1.2,              // Scroll duration
    smoothWheel: true,
    smoothTouch: false,
  },

  // Locomotive Scroll (Parallax)
  locomotiveScroll: {
    enabled: true,
    selectors: '.ts-container, .section-divider, .ts-card',  // Elements to parallax
    speeds: [0.3, 0.5, 0.7],    // Random speed pool
    autoDetect: true,           // Auto-apply data-scroll attributes
  },

  // Theme System
  theme: {
    mode: 'dark',               // 'dark' | 'light' | 'auto'
    enableToggle: true,         // Enable theme toggle buttons
    savePreference: true,       // Save to localStorage
  },

  // Layout Settings
  layout: {
    containerMaxWidth: '1400px',
    contentMaxWidth: '1200px',
    enableNoise: true,          // Grain/noise overlay
    noiseOpacity: 1,            // 0-1
    fullpage: false,            // Fullpage snap scrolling
    elasticMode: false,         // Full-width brutalist layout
  },

  // Custom Cursor
  cursor: {
    enabled: true,
    size: 20,
    grow: 3,
  },

  // Range Sliders
  rangeSliders: {
    autoInit: true,
  },
});
```

---

## ✨ Scroll Reveal Animations

Toolskin includes a powerful, **safe, and automatic scroll reveal animation system**. Animations trigger when elements scroll into view, with no conflicts with layouts or other effects.

### Available Animation Classes

#### Basic Animations

```html
<!-- Simple fade in -->
<div class="ts-fade-in">Content</div>

<!-- Fade up from bottom (most popular) -->
<div class="ts-fade-up">Content</div>

<!-- Fade from sides -->
<div class="ts-fade-left">Slides from right</div>
<div class="ts-fade-right">Slides from left</div>
```

#### Scale Animations

```html
<!-- Scale up -->
<div class="ts-zoom-in">Content</div>

<!-- Scale down -->
<div class="ts-zoom-out">Content</div>
```

#### Large Movement Animations

```html
<!-- Slide up with large movement -->
<div class="ts-slide-up">Content</div>

<!-- Slide from sides with large movement -->
<div class="ts-slide-left">Content</div>
<div class="ts-slide-right">Content</div>
```

#### Advanced Animations

```html
<!-- 3D flip effect -->
<div class="ts-flip-up">Content</div>

<!-- Spring physics bounce -->
<div class="ts-bounce-in">Content</div>
```

### Sequential Reveals (Stagger)

Create cascading animation effects with delay classes:

```html
<div class="ts-fade-up ts-delay-1">First (100ms delay)</div>
<div class="ts-fade-up ts-delay-2">Second (200ms delay)</div>
<div class="ts-fade-up ts-delay-3">Third (300ms delay)</div>
<div class="ts-fade-up ts-delay-4">Fourth (400ms delay)</div>
<div class="ts-fade-up ts-delay-5">Fifth (500ms delay)</div>
<div class="ts-fade-up ts-delay-6">Sixth (600ms delay)</div>
```

### Speed Variants

Control animation duration:

```html
<!-- Fast animation (300ms) -->
<div class="ts-fade-up ts-reveal-fast">Quick reveal</div>

<!-- Normal speed (600ms - default) -->
<div class="ts-fade-up">Normal reveal</div>

<!-- Slow animation (800ms) -->
<div class="ts-fade-up ts-reveal-slow">Slow reveal</div>

<!-- Very slow animation (1200ms) -->
<div class="ts-fade-up ts-reveal-slower">Very slow reveal</div>
```

### Auto-Applied Animations

By default, these elements **automatically get `.ts-fade-up` animation**:
- `.ts-card`
- `.ts-panel`
- `.ts-pricing-card`

You can customize which elements get auto-animations in the config:

```javascript
Toolskin.init({
  reveal: {
    enabled: true,
    autoReveal: true,
    selectors: '.ts-card, .ts-panel, .my-custom-class',
    defaultAnimation: 'ts-fade-up', // or any other animation class
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px', // Start animation 60px before entering viewport
  },
});
```

### Skip Auto-Animation

To prevent auto-animation on specific elements:

```html
<div class="ts-card" data-ts-reveal-skip>
  This card won't animate
</div>
```

### Programmatic Control

```javascript
// Reveal all elements immediately (skip animations)
Toolskin.observer.revealAll();

// Reveal specific element
const element = document.querySelector('.my-element');
Toolskin.observer.revealNow(element);

// Refresh observer after dynamically adding new elements
Toolskin.observer.refresh();

// Listen for reveal events
document.addEventListener('ts:reveal', (e) => {
  console.log('Element revealed:', e.detail.element);
});
```

### Configuration Options

```javascript
Toolskin.init({
  reveal: {
    enabled: true,              // Enable/disable entire system
    autoReveal: true,           // Auto-apply to common elements
    selectors: '.ts-card, .ts-panel', // Which elements to auto-animate
    defaultAnimation: 'ts-fade-up',   // Default animation class
    threshold: 0.1,             // 0-1, viewport percentage to trigger
    rootMargin: '0px 0px -60px 0px', // Margin adjustment for trigger point
  },
});
```

### Best Practices

1. **Use sparingly**: Too many animations can be overwhelming
2. **Stick to one animation per section**: Consistency looks professional
3. **Use stagger for lists**: Makes groups feel cohesive
4. **Respect reduced motion**: Animations automatically disable for users with motion sensitivity
5. **Test performance**: Animating many elements at once can impact performance

### Accessibility

All animations automatically respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  .ts-fade-up,
  .ts-zoom-in,
  /* ... all animation classes ... */ {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
```

---

## 🎨 Theme System

### Dark & Light Themes

Toolskin includes **automatic light theme conversion**. You don't need to manually define light theme colors—they're auto-generated from the dark theme.

#### Switch Themes Programmatically

```javascript
// Set theme
Toolskin.setTheme('light');
Toolskin.setTheme('dark');
Toolskin.setTheme('auto'); // Follows system preference

// Toggle theme
Toolskin.toggleTheme();
```

#### Theme Toggle Button

Add a theme toggle button with `data-theme-toggle`:

```html
<button data-theme-toggle class="ts-btn ts-btn--ghost">
  <i class="fa-solid fa-moon"></i> Toggle Theme
</button>
```

#### Listen for Theme Changes

```javascript
window.addEventListener('ts:theme-change', (e) => {
  console.log('Theme changed to:', e.detail.mode);
});
```

---

## 🎯 Smooth Scrolling (Lenis)

### Automatic Anchor Links

Lenis automatically handles smooth scrolling for anchor links:

```html
<nav>
  <a href="#section1">Section 1</a>
  <a href="#section2">Section 2</a>
</nav>

<section id="section1">Content</section>
<section id="section2">Content</section>
```

### Programmatic Scrolling

```javascript
// Scroll to element
Toolskin.scrollTo('#target-element', {
  offset: 0,
  duration: 1.2,
});

// Scroll to top
Toolskin.scrollTo(0);
```

### Control Scroll

```javascript
// Stop scrolling
Toolskin.smooth.stop();

// Resume scrolling
Toolskin.smooth.start();
```

---

## 🌀 Parallax Effects (Locomotive Scroll) — Optional

### Important Note

⚠️ **Locomotive Scroll is DISABLED by default** to prevent conflicts with the built-in fade-up animations. It's recommended to use **Lenis smooth scrolling alone** for most projects.

### When to Enable Locomotive

Enable Locomotive Scroll only if you:
- Need specific parallax effects on hero images or backgrounds
- Want to manually control which elements have parallax
- Don't use many fade-up animations

### Manual Parallax (Recommended Approach)

Instead of auto-detection, manually tag elements you want to parallax:

```html
<!-- Add parallax to specific elements -->
<div class="hero-bg" data-scroll data-scroll-speed="0.5" data-ts-parallax="true">
  Background image
</div>

<img src="..." data-scroll data-scroll-speed="-0.2" data-ts-parallax="true" />
```

```javascript
Toolskin.init({
  locomotiveScroll: {
    enabled: true,
    autoDetect: false,  // Don't auto-apply (prevents conflicts)
  },
});
```

### Auto-Detection (Use with Caution)

If you must use auto-detection, specify ONLY non-animated elements:

```javascript
Toolskin.init({
  locomotiveScroll: {
    enabled: true,
    selectors: '.hero-image, .parallax-bg',  // Specific elements only
    speeds: [0.3, 0.5],
    autoDetect: true,
  },
});
```

### Skip Parallax on Specific Elements

```html
<!-- Prevent parallax on this element -->
<div class="ts-container" data-ts-scroll-skip>
  No parallax here
</div>
```

### Best Practice

**Use Lenis (smooth scroll) + IntersectionObserver (fade-up) without Locomotive:**

```javascript
Toolskin.init({
  smoothScroll: { enabled: true },      // ✅ Smooth scrolling
  locomotiveScroll: { enabled: false }, // ✅ No layout conflicts
  // Fade-up animations work perfectly with IntersectionObserver
});
```

---

## 📐 Layout System

### Container Widths

Configure maximum widths globally:

```javascript
Toolskin.init({
  layout: {
    containerMaxWidth: '1400px',  // Default container
    contentMaxWidth: '1200px',    // Content-focused layouts
  },
});
```

Or use CSS classes:

```html
<div class="ts-container">Default width (1400px)</div>
<div class="ts-container ts-container--content">Narrower (1200px)</div>
<div class="ts-container ts-container--full">Full width</div>
```

### Elastic/Brutalist Mode

Enable full-width, no-max-width layouts:

```javascript
Toolskin.init({
  layout: {
    elasticMode: true,  // Removes max-width constraints
  },
});
```

Or add the class to the `<html>` tag:

```html
<html class="ts-layout-elastic">
```

### Disable Noise/Grain

```javascript
Toolskin.init({
  layout: {
    enableNoise: false,
  },
});
```

Or use the CSS class:

```html
<html class="ts-no-grain">
```

### Fullpage Snap Scrolling

Enable vertical snap scrolling for fullpage designs:

```javascript
Toolskin.init({
  layout: {
    fullpage: true,
  },
});
```

---

## 🖱️ Custom Cursor

### Enable/Disable

```javascript
Toolskin.init({
  cursor: {
    enabled: true,
    size: 20,
    grow: 3,
  },
});
```

### Custom Cursor Labels

Add `data-cursor` to interactive elements:

```html
<button data-cursor="PRESS">Click Me</button>
<a href="#" data-cursor="EXPLORE">Learn More</a>
```

---

## 🧩 UI Components

### Tabs

```html
<div class="ts-tabs">
  <button class="ts-tab ts-tab--active" data-tab="tab1">Tab 1</button>
  <button class="ts-tab" data-tab="tab2">Tab 2</button>
</div>

<div class="ts-tab-pane ts-tab-pane--active" id="tab1">
  Content 1
</div>
<div class="ts-tab-pane" id="tab2">
  Content 2
</div>
```

### Modals

```html
<!-- Trigger -->
<button data-modal-open="myModal">Open Modal</button>

<!-- Modal -->
<div class="ts-overlay" id="myModal">
  <div class="ts-modal">
    <div class="ts-modal__header">
      <h3 class="ts-modal__title">Modal Title</h3>
      <button data-modal-close>&times;</button>
    </div>
    <div class="ts-modal__body">
      Content
    </div>
  </div>
</div>
```

Programmatic control:

```javascript
Toolskin.openModal('myModal');
Toolskin.closeModal('myModal');
```

### Toast Notifications

```javascript
Toolskin.showToast('Success!', {
  type: 'success',  // 'default' | 'success' | 'warning' | 'error' | 'info'
  title: 'Operation Complete',
  duration: 4000,
  icon: 'fa-solid fa-check',
});
```

### Toggle/Collapse

```html
<button data-collapse-trigger="panel1">Toggle Panel</button>
<div id="panel1" class="ts-hidden">
  Hidden content
</div>
```

### Range Sliders

Range sliders **automatically initialize** with gradient fill:

```html
<div class="ts-range-row">
  <input type="range" class="ts-range" min="0" max="100" value="50" data-unit="%" />
  <span class="ts-range-val">50%</span>
</div>
```

---

## 🎨 Customization

### Accent Color

```javascript
// HSL
Toolskin.setAccent(18, '100%', '52%');

// Hex
Toolskin.setAccentHex('#ff5500');
```

### Border Radius

```javascript
Toolskin.setRadius(10);  // Changes global border radius
```

### Font Family

```javascript
Toolskin.setFont('Inter, system-ui, sans-serif');
```

---

## 🔄 Dynamic Updates

### Refresh All Modules

After adding new content to the DOM:

```javascript
Toolskin.refresh();
```

This re-scans for:
- Fade-in animations
- Locomotive scroll elements
- Range sliders
- Icons

### Update Layout Settings

```javascript
Toolskin.updateLayout({
  containerMaxWidth: '1600px',
  enableNoise: false,
});
```

---

## 📦 Events

Listen for framework events:

```javascript
// Framework ready
window.addEventListener('ts:ready', (e) => {
  console.log('Config:', e.detail.config);
});

// Theme change
window.addEventListener('ts:theme-change', (e) => {
  console.log('Mode:', e.detail.mode);
});

// Tab change
document.addEventListener('ts:tab-change', (e) => {
  console.log('Tab ID:', e.detail.id);
});

// Modal open/close
document.addEventListener('ts:modal-open', () => {});
document.addEventListener('ts:modal-close', () => {});

// Toggle
document.addEventListener('ts:toggle', (e) => {
  console.log('Open:', e.detail.open);
});
```

---

## 🎯 CSS Utility Classes

### Layout

```html
<!-- Container variants -->
<div class="ts-container">Default (1400px)</div>
<div class="ts-container ts-container--sm">Small (640px)</div>
<div class="ts-container ts-container--content">Content (1200px)</div>
<div class="ts-container ts-container--full">Full width</div>

<!-- Flex utilities -->
<div class="ts-flex ts-gap-4">Flex with gap</div>
<div class="ts-flex-col ts-gap-2">Column layout</div>
<div class="ts-flex-center">Centered content</div>
<div class="ts-flex-between">Space between</div>

<!-- Grid -->
<div class="ts-grid ts-grid--3">3 columns</div>
<div class="ts-grid ts-grid--auto-md">Auto-responsive</div>
```

### Spacing

```html
<div class="ts-mt-8">Margin top</div>
<div class="ts-mb-4">Margin bottom</div>
<div class="ts-p-6">Padding</div>
```

### Surfaces

```html
<div class="ts-surface-2 ts-rounded">Dark surface</div>
<div class="ts-glass">Glassmorphism</div>
<div class="ts-grain">Noise overlay</div>
```

### Text

```html
<span class="ts-text-accent">Accent color</span>
<span class="ts-text-muted">Muted text</span>
<span class="ts-gradient-text">Gradient text</span>
<code class="ts-mono">Monospace</code>
```

---

## 🛠️ Advanced Usage

### Disable Locomotive for Specific Elements

```html
<!-- Grain sections should not have transforms applied -->
<section class="ts-grain" data-ts-scroll-skip>
  Grain overlay without parallax
</section>
```

### Access Module Instances

```javascript
// Lenis instance
window.lenis.scrollTo('#target');

// Locomotive instance
window.locomotiveScroll.update();

// Toast instance
Toolskin.toast.show('Custom toast');

// Modal instance
Toolskin.modal.open('myModal');
```

---

## 📋 Default Configuration Reference

```javascript
{
  smoothScroll: {
    enabled: true,
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
    touchMultiplier: 2,
  },

  locomotiveScroll: {
    enabled: false,              // ⚠️ Disabled by default
    selectors: '',               // No auto-apply
    speeds: [0.3, 0.5, 0.7],
    autoDetect: false,           // Manual parallax only
  },

  theme: {
    mode: 'dark',
    enableToggle: true,
    savePreference: true,
    storageKey: 'ts-theme-mode',
  },

  layout: {
    containerMaxWidth: '1400px',
    contentMaxWidth: '1200px',
    enableNoise: true,
    noiseOpacity: 1,
    fullpage: false,
    elasticMode: false,
  },

  cursor: {
    enabled: true,
    size: 20,
    grow: 3,
  },

  rangeSliders: {
    autoInit: true,
  },
}
```

---

## 🐛 Troubleshooting

### Smooth Scroll Not Working

- Ensure Lenis is loaded **before** `toolskin.js`
- Check console for errors
- Verify `smoothScroll.enabled: true`

### Parallax Not Applied

- Check that Locomotive Scroll is loaded
- Verify selectors match your elements
- Ensure `autoDetect: true`
- Call `Toolskin.refresh()` after DOM changes

### Theme Not Switching

- Check `theme.enableToggle: true`
- Verify `data-theme-toggle` on button
- Check browser console for errors

### Cursor Not Showing

- Set `cursor.enabled: true`
- Check CSS custom properties
- Ensure no conflicting cursor styles

---

## 📚 Additional Resources

- **CSS Variables Reference**: See `:root` in `toolskin.css`
- **Component Examples**: Open `showcase.html`
- **Source Code**: `toolskin.js` (fully commented)

---

## 🎉 You're Ready!

Toolskin is designed to **just work** with minimal configuration. Start building your dark-themed, smooth-scrolling, parallax-enabled UI today!

For questions or issues, check the source code—every module is fully documented.

---

**Version:** 2.0.0  
**License:** MIT  
**Author:** Toolskin Framework Team
