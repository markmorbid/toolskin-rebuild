# DIRECTIVE — ts-topbar-nav Fix Pass
**Target file:** `portable-02-components/ts-topbar-nav-v3.html`
**Audit URL:** https://claude.ai/design/p/019dec49-207b-777f-bc29-691753f69c44?file=portable-02-components%2Fts-topbar-nav-v3.html
**Mode:** Fix pass — no layout redesign. No new features. Repair only.

---

## CONTEXT — Read before touching anything

The nav component has a stacked showcase layout: multiple `<nav>` instances rendered vertically on the same page, each demonstrating a different variant (fixed, sticky, static, transparent, etc.). The issues below are all caused by cascading token failures and missing guards — not design decisions.

---

## ISSUE 1 — Z-index bleeds onto static variant (stacking overlap)

**Root cause:** The current z-index rule applies unconditionally:

```css
.ts-nav-fixed,
[data-fixed-header],
.ts-nav-fixed.ts-nav--sticky {
  z-index: calc(var(--ts-z-sticky) + 2);
}
```

This gives `.ts-nav--static` a high z-index it must never have, causing it to overlap the navs below it in the stacked showcase.

**Fix:** Add a `:not()` guard so static is excluded:

```css
.ts-nav-fixed:not(.ts-nav--static),
[data-fixed-header]:not(.ts-nav--static),
.ts-nav-fixed.ts-nav--sticky {
  z-index: calc(var(--ts-z-sticky) + 2);
  --ts-z-sticky: calc(var(--ts-z-offcanvas) - 5);
}
```

---

## ISSUE 2 — Dropdown always visible / not interactive on fixed showcase

Two sub-problems:

**2a. Dropdown always visible:** `.ts-nav-dropdown` has `display: none` but the trigger hover state sets `display: flex`. In static stacked context with `overflow: hidden` on the parent, the dropdown is clipped. In the fixed context, it shows permanently because there is no `[hidden]` guard or JS toggle initialised.

**Fix:** Ensure the dropdown is hidden by default and only shown on hover OR active class — not always. Add:

```css
.ts-nav-dropdown {
  display: none;
}
.ts-nav-more:hover .ts-nav-dropdown,
.ts-nav-more.is-open .ts-nav-dropdown {
  display: flex;
}
```

**2b. Dropdown truncated by header overflow:** The nav header that contains `.ts-nav-more` must not clip its children. Ensure:

```css
.ts-nav-fixed {
  overflow: visible;
}
```

If the backdrop blur requires `overflow: hidden`, move it to a `::before` pseudo-element instead — same pattern already used for blur in the codebase.

---

## ISSUE 3 — Dropdown border not using nav border token

The dropdown outline is using a hardcoded or raw `--ts-border-0` instead of the nav-scoped border token. This makes it look unstyled (too bright in dark, wrong weight).

**Fix:** Change the dropdown `outline` and `border-top` to use the nav token:

```css
.ts-nav-dropdown {
  outline: 1px solid var(--ts-nav-border, var(--ts-border-1));
  border-top: 2px solid var(--ts-accent);
}
```

---

## ISSUE 4 — Dropdown font size, padding, item sizing not using nav tokens

Dropdown links are using ad-hoc `padding: 10px 20px` and `font-size: var(--ts-fs-sm)` mixed with `var(--ts-fs-xs)` (declared twice). Standardise to the same token ladder as nav links:

```css
.ts-nav-dropdown a {
  font-size: var(--ts-fs-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding-inline: var(--ts-sp-4);
  padding-block: var(--ts-sp-3);
  min-height: var(--ts-input-h);
  color: var(--ts-text-muted);
}
.ts-nav-dropdown a:hover {
  color: var(--ts-text-primary);
  background: color-mix(in srgb, var(--ts-accent), transparent 92%);
}
```

Remove the duplicate `font-size`, `display`, `flex-direction`, `flex-wrap`, `align-items`, `padding-inline`, `padding-block` declarations that appear twice in `.ts-nav-dropdown a`.

---

## ISSUE 5 — Logo broken / not matching original

The logo in the topbar is either a broken image reference or using an ad-hoc `<img>` path instead of the SVG inline symbol. 

**Fix:** Use the inline SVG symbol pattern from the reference codebase:

```html
<a class="ts-nav-fixed__logo" href="/">
  <svg class="ts-logo" aria-label="Toolskin" role="img">
    <use href="#ts-logo-symbol" />
  </svg>
</a>
```

Ensure `#ts-logo-symbol` is defined in the `<defs>` block at the top of the HTML. If the SVG symbol is missing from this portable file, inline it from `docs/references/branding/logos/toolskin-icon.svg`. Do not use `<img src="...">` with a relative path that breaks in portable context.

---

## ISSUE 6 — `--ts-this-bg` stuck on `--ts-bg-body` (surfaces not dynamic)

**Root cause:** Component surfaces are using `--ts-bg-body` directly instead of the scoped `--ts-this-bg` token. When a surface preset is applied (e.g. warm, blue), `--ts-bg-body` changes at `:root` but the component doesn't respond because the token chain is broken.

**Fix:** Every surface-bearing element in the nav must use `--ts-this-bg`:

```css
.ts-nav-fixed {
  background: color-mix(in srgb, var(--ts-this-bg, var(--ts-bg-body)), transparent calc(100% - var(--ts-nav-bg-alpha, 95%)));
}
```

The `--ts-this-bg` token must be set on the component root via the surface superposition pattern:

```css
.ts-nav-fixed {
  --ts-this-bg: var(--ts-bg-body);
  --ts-this-surface: 0;
}
```

This ensures surface preset application propagates correctly.

---

## ISSUE 7 — Color presets (blue, warm, etc.) not applying visibly

**Root cause:** The color preset controls are writing to `:root` but the component CSS is overriding with hardcoded values or the selector specificity is too high, blocking cascade reach.

**Checklist:**
- Verify preset JS writes `--ts-accent-h`, `--ts-accent-s`, `--ts-accent-l` to `document.documentElement.style`.
- Verify no inline `style=""` on nav elements overrides those tokens.
- Verify the surface tokens (`--ts-bg-body`, `--ts-bg-0` through `--ts-bg-5`) are not hardcoded in the component — they must all be `var(--ts-bg-N)` references.
- In light mode, verify the `[data-theme="light"]` block also exposes the same token names so presets reach both branches.

If preset controls exist in the showcase HTML, ensure they call `Toolskin.setAccentHex()` or write directly to CSS custom properties on `:root` — not to a scoped element.

---

## ISSUE 8 — Controls not usable / inheritable

The showcase controls (theme toggle, accent swatch pickers, surface preset selector) must:
- Be outside any `overflow: hidden` container.
- Not be covered by a high-z-index nav in the stacked layout.
- Inherit correctly from `:root` — no scoped overrides that shadow the global token write.

After fixing Issues 1 and 2b, re-verify all controls are reachable and functional.

---

## EXECUTION ORDER

Fix in this order — each unblocks the next:

1. **Issue 1** — z-index `:not(.ts-nav--static)` guard
2. **Issue 2b** — `overflow: visible` on nav + pseudo-element blur refactor
3. **Issue 2a** — dropdown hide/show guard
4. **Issue 3** — dropdown border token
5. **Issue 4** — dropdown typography / padding cleanup (remove duplicates)
6. **Issue 5** — logo SVG symbol fix
7. **Issue 6** — `--ts-this-bg` surface chain
8. **Issue 7** — color preset cascade verification
9. **Issue 8** — controls usability audit (visual pass in both light + dark)

---

## ACCEPTANCE CRITERIA

- [ ] Stacked nav variants do not overlap each other
- [ ] Dropdown only visible on hover / programmatic open — never permanently shown
- [ ] Dropdown fully visible (not clipped) in fixed nav context
- [ ] Dropdown border matches nav border token
- [ ] Dropdown items match nav link typography/sizing exactly
- [ ] Logo renders correctly in portable context (no broken image)
- [ ] Applying a surface preset changes visible nav background in both dark and light mode
- [ ] Applying an accent preset (blue, warm, etc.) changes visible accent color in both modes
- [ ] Theme toggle, accent pickers, and surface controls all respond correctly
- [ ] No other showcase sections visually break after this fix pass

---

## HARD CONSTRAINTS

- Do NOT redesign the layout or component structure
- Do NOT change token names — fix the values and references only
- Do NOT introduce new class names — use existing `.ts-nav-*` namespace
- Do NOT add `!important` — fix specificity through correct selector structure
- Every change must be the minimal surgical fix for each issue
