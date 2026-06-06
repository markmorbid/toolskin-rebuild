# 06 · Component Recipes — Buttons, Inputs, Badges, Forms, Nav

> Atomic components, copy-paste, locked. Every measurement comes from a token.
> Every state is defined. Use exactly as written.

---

## 1 · Buttons (`.ts-btn`)

The most-used component. Get this right and the system feels professional.

### 1.1 Base

```css
.ts-btn {
  /* sizing */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--ts-sp-2);
  height: var(--ts-btn-h, 44px);
  padding: 0 var(--ts-btn-pad-x, var(--ts-sp-5));
  /* type */
  font-family: inherit;
  font-size: var(--ts-btn-fs, var(--ts-fs-caption));
  font-weight: var(--ts-btn-fw, 600);
  letter-spacing: 0.02em;
  line-height: 1;
  /* shape */
  border-radius: var(--ts-btn-radius, var(--ts-radius-sm));
  border: 1px solid transparent;
  /* color (default = ghost) */
  background: transparent;
  color: var(--ts-text-primary);
  /* behavior */
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  transition: background var(--ts-dur-fast) var(--ts-ease-out),
              border-color var(--ts-dur-fast) var(--ts-ease-out),
              color var(--ts-dur-fast) var(--ts-ease-out),
              transform var(--ts-dur-fast) var(--ts-ease-out);
}
.ts-btn:focus-visible {
  outline: 2px solid var(--ts-accent);
  outline-offset: 2px;
}
.ts-btn:disabled, .ts-btn[aria-disabled="true"] {
  opacity: 0.5; pointer-events: none;
}
.ts-btn:active { transform: translateY(1px); }
```

### 1.2 Variants

```css
.ts-btn--primary {
  background: var(--ts-accent);
  color: var(--ts-on-accent);
  border-color: var(--ts-accent);
}
.ts-btn--primary:hover {
  background: var(--ts-accent-bright);
  border-color: var(--ts-accent-bright);
}

.ts-btn--outline {
  background: transparent;
  color: var(--ts-text-primary);
  border-color: var(--ts-border-2);
}
.ts-btn--outline:hover {
  background: var(--ts-bg-2);
  border-color: var(--ts-text-primary);
}

.ts-btn--ghost {
  background: transparent;
  color: var(--ts-text-primary);
}
.ts-btn--ghost:hover { background: var(--ts-bg-2); }

.ts-btn--danger  { background: var(--ts-danger);  color: #fff; border-color: var(--ts-danger); }
.ts-btn--success { background: var(--ts-success); color: #fff; border-color: var(--ts-success); }
```

### 1.3 Sizes

```css
.ts-btn--sm { --ts-btn-h: 36px; --ts-btn-pad-x: var(--ts-sp-3); --ts-btn-fs: var(--ts-fs-caption); }
.ts-btn     { /* 44px default = WCAG touch */ }
.ts-btn--lg { --ts-btn-h: 50px; --ts-btn-pad-x: var(--ts-sp-6); --ts-btn-fs: var(--ts-fs-body); }
.ts-btn--xl { --ts-btn-h: 60px; --ts-btn-pad-x: var(--ts-sp-8); --ts-btn-fs: var(--ts-fs-lead); }
```

### 1.4 Modifiers

```css
.ts-btn--full { width: 100%; }
.ts-btn--icon { /* square */ width: var(--ts-btn-h, 44px); padding: 0; }
.ts-btn--pill { border-radius: var(--ts-radius-full); padding-inline: var(--ts-sp-6); }
```

### 1.5 Pitfalls

- ❌ Button text < 13px — fails readability. Stay step -1 minimum.
- ❌ Hover changes BOTH bg and border with different colors — choppy. Change in unison.
- ❌ `:hover` only, no `:focus-visible` — keyboard users can't see focus. Both mandatory.
- ❌ Loading spinner replacing text — width jumps. Lock the width via `min-width` or use a spinner overlay.

---

## 2 · Inputs (`.ts-input`)

### 2.1 Base

```css
.ts-input {
  width: 100%;
  height: 50px;
  padding: 0 var(--ts-sp-4);
  font: inherit;
  font-size: var(--ts-fs-body);
  color: var(--ts-text-primary);
  background: var(--ts-input-bg, var(--ts-bg-3));
  border: 1px solid var(--ts-input-border, var(--ts-border-1));
  border-radius: var(--ts-radius-sm);
  transition: border-color var(--ts-dur-fast) var(--ts-ease-out),
              background var(--ts-dur-fast) var(--ts-ease-out);
}
.ts-input::placeholder { color: var(--ts-text-muted); }
.ts-input:hover { border-color: var(--ts-border-2); }
.ts-input:focus-visible,
.ts-input:focus {
  outline: none;
  border-color: var(--ts-accent);
  background: var(--ts-bg-2);
  box-shadow: 0 0 0 3px var(--ts-accent-dim-2);
}
.ts-input:disabled { opacity: 0.5; cursor: not-allowed; }
.ts-input[aria-invalid="true"] {
  border-color: var(--ts-danger);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--ts-danger), transparent 88%);
}
```

### 2.2 Field wrapper

```html
<div class="ts-field">
  <label class="ts-field__label" for="email">Email</label>
  <input class="ts-input" type="email" id="email" placeholder="you@company.com">
  <p class="ts-field__hint">We'll send a confirmation link.</p>
  <p class="ts-field__error" role="alert">Please enter a valid email.</p>
</div>
```

```css
.ts-field { display: grid; gap: var(--ts-sp-2); }
.ts-field__label { font-size: var(--ts-fs-caption); font-weight: 500; }
.ts-field__hint  { font-size: var(--ts-fs-caption); color: var(--ts-text-muted); }
.ts-field__error { font-size: var(--ts-fs-caption); color: var(--ts-danger); display: none; }
.ts-field[data-invalid="true"] .ts-field__error { display: block; }
.ts-field[data-invalid="true"] .ts-field__hint  { display: none; }
```

### 2.3 Pitfalls

- ❌ Label inside input as placeholder only — fails accessibility (lost on focus).
- ❌ Error icon without `aria-describedby` link — screen readers miss the error.
- ❌ Focus ring < 3px — invisible. Use the 3px accent-dim ring above.

---

## 3 · Select / Combobox (`.ts-select`)

Native select styled to match `.ts-input`:

```css
.ts-select {
  /* inherit ts-input styles */
  appearance: none;
  -webkit-appearance: none;
  background-image:
    linear-gradient(45deg, transparent 50%, currentColor 50%),
    linear-gradient(135deg, currentColor 50%, transparent 50%);
  background-position:
    calc(100% - 18px) 22px,
    calc(100% - 13px) 22px;
  background-size: 5px 5px;
  background-repeat: no-repeat;
  padding-right: var(--ts-sp-8);
  cursor: pointer;
}
```

For complex combobox (searchable, multi-select): use Listbox/Combobox ARIA pattern.
Toolskin does not include a combobox component by default — use a vetted library
(e.g. Downshift, Radix Combobox) and re-skin with the `.ts-input` token surface.

---

## 4 · Badges (`.ts-badge`)

```css
.ts-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--ts-sp-1);
  height: 22px;
  padding: 0 var(--ts-sp-2);
  font-size: var(--ts-fs-micro);     /* 11px */
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  line-height: 1;
  border-radius: var(--ts-radius-full);
  background: var(--ts-bg-3);
  color: var(--ts-text-primary);
  border: 1px solid var(--ts-border-1);
}
.ts-badge--accent  { background: var(--ts-accent-dim); color: var(--ts-accent); border-color: var(--ts-accent-border); }
.ts-badge--success { background: color-mix(in srgb, var(--ts-success), transparent 85%); color: var(--ts-success); border-color: color-mix(in srgb, var(--ts-success), transparent 60%); }
.ts-badge--warning { background: color-mix(in srgb, var(--ts-warning), transparent 85%); color: var(--ts-warning); border-color: color-mix(in srgb, var(--ts-warning), transparent 60%); }
.ts-badge--danger  { background: color-mix(in srgb, var(--ts-danger),  transparent 85%); color: var(--ts-danger);  border-color: color-mix(in srgb, var(--ts-danger),  transparent 60%); }

.ts-badge--solid   { background: var(--ts-accent); color: var(--ts-on-accent); border-color: transparent; }

.ts-badge--dot::before {
  content: ''; width: 6px; height: 6px;
  border-radius: 50%; background: currentColor;
  display: inline-block;
}
```

### Pitfalls

- ❌ Badge > 14px tall — looks like a button. Stay 22–24px.
- ❌ Lowercase badge text — overlines are UPPERCASE.

---

## 5 · Chips (`.ts-chip`)

Larger than a badge, smaller than a button. Interactive (filter, tag).

```css
.ts-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--ts-sp-2);
  height: 32px;
  padding: 0 var(--ts-sp-3);
  font-size: var(--ts-fs-caption);
  font-weight: 500;
  border-radius: var(--ts-radius-full);
  background: var(--ts-bg-2);
  color: var(--ts-text-primary);
  border: 1px solid var(--ts-border-1);
  cursor: pointer;
  transition: all var(--ts-dur-fast) var(--ts-ease-out);
}
.ts-chip:hover { background: var(--ts-bg-3); }
.ts-chip[aria-pressed="true"],
.ts-chip--active {
  background: var(--ts-accent);
  color: var(--ts-on-accent);
  border-color: var(--ts-accent);
}
```

---

## 6 · Top navigation (`.ts-nav`)

```html
<header class="ts-nav">
  <a class="ts-nav__brand" href="/">Brand</a>
  <nav class="ts-nav__items">
    <a class="ts-nav__link" href="#">Product</a>
    <a class="ts-nav__link" href="#">Solutions</a>
    <a class="ts-nav__link" href="#">Pricing</a>
    <a class="ts-nav__link" href="#">Docs</a>
  </nav>
  <div class="ts-nav__actions">
    <a class="ts-btn ts-btn--ghost ts-btn--sm">Sign in</a>
    <a class="ts-btn ts-btn--primary ts-btn--sm">Start free</a>
  </div>
</header>
```

```css
.ts-nav {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: var(--ts-sp-8);
  height: 64px;
  padding: 0 var(--ts-container-pad);
  background: color-mix(in srgb, var(--ts-bg-body), transparent 20%);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--ts-border-0);
  position: sticky;
  top: 0; z-index: 100;
}
.ts-nav__brand {
  font-weight: 700;
  font-size: var(--ts-fs-body);
  letter-spacing: var(--ts-tracking-tight);
}
.ts-nav__items {
  display: flex;
  gap: var(--ts-sp-6);
  justify-content: center;        /* nav links centered */
}
.ts-nav__link {
  font-size: var(--ts-fs-caption);
  color: var(--ts-text-secondary);
  text-decoration: none;
  padding: var(--ts-sp-2);
  border-radius: var(--ts-radius-sm);
}
.ts-nav__link:hover { color: var(--ts-text-primary); }
.ts-nav__link[aria-current="page"] { color: var(--ts-text-primary); font-weight: 600; }
.ts-nav__actions { display: flex; gap: var(--ts-sp-2); }

@media (max-width: 768px) {
  .ts-nav__items { display: none; }
  /* + hamburger toggle for drawer */
}
```

### Pitfalls

- ❌ Sticky nav without backdrop blur — looks like a banner. Always blur OR opaque bg.
- ❌ Nav height < 56px — touch targets cramped. 64px is the comfortable minimum.

---

## 7 · Footer (`.ts-footer`)

```css
.ts-footer {
  padding: var(--ts-sp-16) var(--ts-container-pad) var(--ts-sp-8);
  background: var(--ts-bg-1);
  border-top: 1px solid var(--ts-border-1);
}
.ts-footer__grid {
  max-width: var(--ts-container-lg);
  margin-inline: auto;
  display: grid;
  grid-template-columns: 2fr repeat(4, 1fr);
  gap: var(--ts-sp-8);
}
.ts-footer__brand { display: grid; gap: var(--ts-sp-3); max-width: 36ch; }
.ts-footer__col h4 {
  font-size: var(--ts-fs-caption);
  text-transform: uppercase;
  letter-spacing: var(--ts-tracking-wider);
  color: var(--ts-text-secondary);
  margin: 0 0 var(--ts-sp-4) 0;
  font-weight: 600;
}
.ts-footer__col ul { list-style: none; padding: 0; margin: 0; display: grid; gap: var(--ts-sp-2); }
.ts-footer__col a {
  color: var(--ts-text-primary);
  text-decoration: none;
  font-size: var(--ts-fs-caption);
}
.ts-footer__col a:hover { color: var(--ts-accent); }

.ts-footer__bottom {
  max-width: var(--ts-container-lg);
  margin: var(--ts-sp-12) auto 0;
  padding-top: var(--ts-sp-6);
  border-top: 1px solid var(--ts-border-0);
  display: flex;
  justify-content: space-between;
  font-size: var(--ts-fs-caption);
  color: var(--ts-text-muted);
}

@media (max-width: 960px) {
  .ts-footer__grid { grid-template-columns: 1fr 1fr; }
  .ts-footer__brand { grid-column: 1 / -1; }
}
```

---

## 8 · Modal / Dialog (`.ts-modal`)

Use the native `<dialog>` element. It handles focus trap, ESC-close, backdrop click.

```css
.ts-modal {
  border: 1px solid var(--ts-border-1);
  background: var(--ts-bg-2);
  border-radius: var(--ts-radius-lg);
  padding: 0;
  width: min(92vw, 520px);
  max-height: 90dvh;
  box-shadow: var(--ts-shadow-4);
  color: var(--ts-text-primary);
}
.ts-modal::backdrop {
  background: color-mix(in srgb, var(--ts-bg-body), transparent 30%);
  backdrop-filter: blur(8px);
}
.ts-modal__header {
  padding: var(--ts-sp-6);
  border-bottom: 1px solid var(--ts-border-0);
  display: flex; align-items: center; justify-content: space-between;
}
.ts-modal__body { padding: var(--ts-sp-6); }
.ts-modal__footer {
  padding: var(--ts-sp-4) var(--ts-sp-6);
  border-top: 1px solid var(--ts-border-0);
  display: flex; gap: var(--ts-sp-3); justify-content: flex-end;
}
```

```js
modal.showModal();   // opens with backdrop, focus trap, ESC-close, all free
modal.close();
```

### Pitfalls
- ❌ Custom div modal without `<dialog>` — you re-implement focus trap badly. Use the platform.
- ❌ Modal width > 600px — feels invasive. Stay 480–560px for confirm/info modals; 720px max for forms.

---

## 9 · Toast (`.ts-toast`)

Live region for transient feedback.

```html
<div class="ts-toast-region" role="region" aria-live="polite" aria-label="Notifications">
  <div class="ts-toast ts-toast--success" role="status">
    <svg>✓</svg>
    <p>Changes saved.</p>
    <button class="ts-toast__close" aria-label="Dismiss">×</button>
  </div>
</div>
```

```css
.ts-toast-region {
  position: fixed; bottom: var(--ts-sp-6); right: var(--ts-sp-6);
  display: grid; gap: var(--ts-sp-3); z-index: 200;
}
.ts-toast {
  display: grid;
  grid-template-columns: 20px 1fr auto;
  gap: var(--ts-sp-3);
  align-items: center;
  padding: var(--ts-sp-3) var(--ts-sp-4);
  background: var(--ts-bg-3);
  border: 1px solid var(--ts-border-1);
  border-radius: var(--ts-radius-md);
  box-shadow: var(--ts-shadow-3);
  min-width: 280px;
}
.ts-toast--success { border-left: 3px solid var(--ts-success); }
.ts-toast--warning { border-left: 3px solid var(--ts-warning); }
.ts-toast--danger  { border-left: 3px solid var(--ts-danger); }
```

---

## 10 · The component cohesion test

For any new component, verify it inherits the system:

- [ ] Sizes draw from token scale (no `padding: 17px`).
- [ ] Type uses role tokens (`--ts-fs-body`, not `font-size: 16px`).
- [ ] Colors use `--ts-*` (no `#hex` anywhere in component CSS).
- [ ] Radius scales with size (small = xs, large = lg).
- [ ] Hover/focus-visible/active/disabled defined.
- [ ] Transitions use `--ts-dur-*` + `--ts-ease-*`.
- [ ] Border uses `currentColor`-based for dark/light reuse.
- [ ] Accessible: labels, ARIA where needed, keyboard navigation works.
- [ ] Component works in both default presets (dark + light).
- [ ] Mobile width ≥ touch target (44px).
- [ ] Re-anchor first, consume second (RULING 9: set `--ts-this-bg`
      BEFORE consuming any `--ts-this-bg-*` derivative).

11/11 = component joins the library. < 11/11 = fix before merging.
