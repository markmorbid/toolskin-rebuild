# SKILL: Toolskin Visual Audit & Engineering

> **Drop in at `.claude/skills/toolskin-visual-audit/SKILL.md`** in your Toolskin refactor branch. Pair with a `playwright` install (`npm i -D playwright && npx playwright install chromium`) and a local server (`python3 -m http.server 8080` or `npx http-server -p 8080`). All visual auditing in this skill goes through those two.

This skill turns a Claude Code agent into a precise visual auditor and engineer for the **Toolskin** design system. It is tuned for token-first refactors: every visual decision must trace back to a canonical Toolskin token, and every claim about "it looks broken" must be backed by a screenshot, a computed-style probe, or a token-leak grep — not vibes.

---

## When to invoke

Invoke this skill when the user asks for:

- A **visual audit** of one or more pages / pitchdecks / components.
- A **refactor pass** that moves hardcoded values onto canonical tokens.
- A **before/after diff** with visual proof (screenshots + computed-style probes).
- **Component grading** against the Toolskin canonical CSS (`assets/css/toolskin.css`).
- Polishing a deck or page **without breaking layout** — fidelity to the existing design is the constraint.

Do **not** invoke for greenfield design from scratch — that's not what this is for.

---

## Engagement contract (non-negotiable)

1. **Read the canonical CSS before touching anything.** `assets/css/toolskin.css` is the source of truth. Every rule you add or change must reference a `--ts-*` token, an `em`, or a `clamp(--ts-sp-*, dvw, --ts-sp-*)`. No hardcoded px in component rules.
2. **No new top-level class namespaces.** Extend via `--ts-this-bg`, BEM modifiers, or `--ts-*` token re-binding inside a scope. If you genuinely need a new class, it must start with `ts-` and be documented in a one-line comment block above the rule.
3. **No inline `style="..."` on slide/page content.** If you find yourself typing `style="max-width: 30dvw"` or `style="font-size: var(--ts-deck-icon-size)"`, stop and create a class (e.g. `.ts-slide-split__intro`, `.ts-icon--deck`).
4. **Visual claims need visual proof.** "Looks broken" / "looks better" must come with a Playwright screenshot before *and* after, plus a `getComputedStyle` probe of the disputed property.
5. **Variant-safe tokens.** When a layout has variants (e.g. slider on/off, density compact/comfortable/spacious), the variant overrides must read tokens that have **safe defaults at `:root`**. The class that flips the variant only changes the tokens — nothing downstream changes formulas.
6. **Never delete legacy CSS in the first pass.** Comment-flag it with `/* @legacy — replace with .ts-slide-split */`. Removal is a separate, atomic commit after verification.

---

## Component-migration fidelity (READ THIS BEFORE MIGRATING A COMPONENT)

The #1 failure mode observed: an agent migrates a component's **CSS** in isolation, declares victory, and never opens the **original showcase** to see what the component is supposed to look like or what **markup contract** it depends on. The CSS then "passes" a token-leak grep while the rendered component is visibly broken — because the harness markup is missing the classes/structure the CSS keys off.

Migrating a component = porting **CSS + markup contract + runtime behavior together**, verified against the original. Checklist, per component:

1. **Open the original first.** Grep the reference HTML (`…showcase-reference.html`) for the component's classes and copy the EXACT markup contract — wrapper elements, BEM children, modifier classes, attribute hooks. Example trap: `.ts-topbar__logo` has two layouts gated by `:has(.ts-logo-brand)`. Omit the `.ts-logo-brand` wrapper in your harness and the logo falls into the cramped fallback grid and overflows. The CSS was fine; the markup was wrong.
2. **Replicate the original's own demos.** Each harness must render the component the way the showcase does (same variants, same realistic content), not a reduced toy. If the showcase shows an App Topbar + a fixed site header + a nav variant matrix, the harness shows all three.
3. **Account for runtime injection.** The showcase injects icons at runtime (`data-ts-icon="fa-solid …"`, `data-icon="ion:…"` via `toolskin.js`). A portable harness has no `toolskin.js`, so icon slots render empty and the component "looks broken." Ship a tiny shim (`ts-icons.js`) that honours the SAME attribute contract; never silently drop the icons or hand-swap to unicode that changes the design.
4. **Reference the original computed values, not your memory.** Pull real numbers (heights, gaps, font sizes, the `--ts-header-*` token chain) from the reference CSS. Don't invent.
5. **Verify the rendered result against the original**, not just the grep. A migration is "done" only when the harness render matches the showcase render AND the token discipline holds. Screenshot/probe both.
6. **Shared scaffold, not per-file styles.** Harness chrome (panels, rows, labels, stages) lives in ONE shared stylesheet (`harness.css`) that every view links. No per-page `<style>` blocks; no divergent dialects. Components compose inside the shared panel, which re-anchors `--ts-this-bg` so the engine recomposes them.
7. **Quarantine, don't dump.** If a migrated file is a kitchen sink (duplicate redefinitions that win by source order, unrelated widgets, legacy token blocks), extract the ONE canonical component into the clean file and move the remainder verbatim into `pending-to-integrate.css` (loaded by nothing) with a provenance header. Never leave duplicate component rules that override the clean ones.

---

## Project map (Toolskin)

You can rely on this layout. Update the skill if it drifts.

```
toolskin-showcase/
├── assets/
│   ├── css/
│   │   ├── toolskin.css          # CANONICAL — read-only unless explicitly refactoring it
│   │   └── modules/              # Per-domain split (deck, sidebar, etc.) — write here
│   └── js/
│       ├── toolskin.js           # ToolskinSlider, ToolskinConfig, ToolskinTooltip
│       ├── toolskin-uikit.js
│       └── toolskin-assets.js
├── .claude/skills/
│   ├── design-tokens-2.0/SKILL.md
│   └── toolskin-visual-audit/SKILL.md   # ← this file
└── (pitchdecks, demos, sandboxes)
```

Canonical token namespaces:

- `--ts-fs-*` — font sizes (`-base`, `-body-sm`, `-lead`, `-h1..h6`, `-display-md/lg/xl`, `-eyebrow`)
- `--ts-sp-*` — spacing (4pt grid, tiered scale; `--ts-sp-1..--ts-sp-24`)
- `--ts-radius-*` — radii (`-2xs`, `-xs`, `-sm`, `-md`, `-lg`, `-2xl`, `-xl`, `-full`)
- `--ts-line-height-*` — `none`, `display`, `tight`, `snug`, `normal`, `relaxed`, `loose`, `very-loose`
- `--ts-letter-spacing-*` — `tight`, `normal`, `wide`, `wider`, `eyebrow`
- `--ts-this-bg`, `--ts-this-bg-dim-N`, `--ts-this-bg-bright-N`, `--ts-this-bg-border-*` — surface inheritance
- `--ts-accent`, `--ts-on-accent`, plus per-status `--ts-on-success`, `--ts-on-danger`, `--ts-on-warning`, `--ts-on-info`
- Deck-specific: `--ts-deck-width`, `--ts-deck-gallery-w`, `--ts-deck-slide-pad-y/x`, `--ts-slide-fixed-footer-offset-x`

---

## Standard workflow

### 0. Setup (once per session)

```bash
# Start a local server if one isn't running
cd toolskin-showcase
python3 -m http.server 8080 >/dev/null 2>&1 &
SERVER_PID=$!

# Verify Playwright is installed
node -e "require('playwright')" || npm i -D playwright && npx playwright install chromium
```

Confirm both work before going further. Don't trust headless screenshots from an unrendered server.

### 1. Inventory the target

```bash
# What's the file? What does it load?
rg -n '<link.*\.css|<script.*\.js' <target.html>

# What classes does it use that aren't in toolskin.css? (token leak candidates)
rg -o 'class="[^"]+"' <target.html> | tr ' ' '\n' | sort -u
```

### 2. Visual snapshot (before)

Use Playwright headless, **not** screenshots from the user's browser. You want a clean baseline.

```js
// scripts/_audit_snapshot.mjs (drop this in the repo, .gitignore the screenshots dir)
import { chromium } from 'playwright';
import fs from 'fs';

const [,, url, out, w = 1440, h = 900] = process.argv;
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(500); // settle fonts/animations
fs.mkdirSync('audit/' + out.split('/').slice(0,-1).join('/'), { recursive: true });
await page.screenshot({ path: `audit/${out}.png`, fullPage: true });
await browser.close();
```

```bash
node scripts/_audit_snapshot.mjs http://localhost:8080/pitchdeck.html before/pitchdeck-cover
```

For decks, capture **every slide**:

```js
// _audit_deck.mjs
const slides = await page.$$eval('.ts-slide', els => els.length);
for (let i = 0; i < slides; i++) {
  await page.evaluate(idx => {
    document.querySelectorAll('.ts-slide').forEach((s, j) => s.classList.toggle('ts-active', j === idx));
  }, i);
  await page.waitForTimeout(250);
  await page.screenshot({ path: `audit/before/slide-${String(i+1).padStart(2,'0')}.png`, fullPage: false });
}
```

### 3. Token-leak grep

Find every place the source bypasses tokens. These are your top priorities.

```bash
# Hardcoded hex / rgb / rgba (excluding the canonical token file itself)
rg -n '#[0-9a-fA-F]{3,8}\b|rgba?\(' --type css -g '!toolskin.css'

# Hardcoded px in component CSS (excluding @media, border 1px, hairline 1px)
rg -n ':\s*\d+(\.\d+)?px\b' --type css -g '!toolskin.css' | rg -v '1px solid|0px|@media'

# Inline styles on slide/page content
rg -n 'style="[^"]+"' --type html

# rgba(255, 85, 0, ...) — brand orange that should be color-mix
rg -n 'rgba\(\s*255\s*,\s*85\s*,\s*0' --type css
```

### 4. Computed-style probe (the hard evidence)

When you suspect a token isn't applied, prove it with `page.evaluate`:

```js
const probe = await page.evaluate(() => {
  const el = document.querySelector('.ts-btn--primary');
  const cs = getComputedStyle(el);
  return {
    color: cs.color,
    backgroundColor: cs.backgroundColor,
    fontSize: cs.fontSize,
    padding: cs.padding,
    onAccentToken: getComputedStyle(document.documentElement).getPropertyValue('--ts-on-accent'),
  };
});
console.log(JSON.stringify(probe, null, 2));
```

If `color` resolves to `rgb(12, 13, 15)` on an orange-bg button, you've found a token leak (should be `var(--ts-on-accent)` → white).

### 5. Component grading rubric

For each component in the audit scope, return one of three verdicts in a markdown scorecard:

| Verdict | Meaning | Action |
|---|---|---|
| `pass` | Every property routes through canonical tokens. Visual matches the intended spec. | None. |
| `warn` | Functioning but with drift — px literals, opacity rgbas, missing `--ts-on-*`, inline styles. | List the leaks; recommend fix; do not block. |
| `fail` | Visual bug or contrast/accessibility failure. | Block. Provide minimal patch + computed-style proof. |

Severity tag: `critical` (a11y/WCAG fail, broken layout), `high` (visible drift), `medium` (token leak with no visible effect), `low` (style hygiene).

### 6. Refactor patch (when fixing)

Always:

1. **Add the token-safe rule** *above* the legacy rule, scoped by a more specific selector if needed.
2. **Comment-flag the legacy** with `/* @legacy YYYY-MM-DD — replaced by [rule above]; remove after visual verification */`.
3. **Re-snapshot** (step 2) and diff against the before image.
4. **Re-probe** the disputed computed style.
5. **Commit atomically** with a `[visual-audit]` prefix and the scorecard delta in the message body.

### 7. Output format — scorecard

Produce a markdown file `audit/REPORT-YYYY-MM-DD.md` with this structure:

```md
# Toolskin visual audit — <scope>

**Date:** YYYY-MM-DD  **Auditor:** Claude Code (toolskin-visual-audit skill)
**Files:** <list>  **Viewports:** 1440×900, 1024×768, 390×844

## Summary
- N pass · M warn · K fail
- Token-leak count: X (was Y before this audit)
- Inline-style count: Z

## Findings

### F-001 · `<component>` · `<file:line>` · sev=high
- **Symptom:** <one-line description>
- **Probe:** `getComputedStyle(.ts-btn--primary).color = rgb(12,13,15)` (expected `rgb(255,255,255)` via `--ts-on-accent`)
- **Before:** ![](audit/before/F-001.png)
- **After:** ![](audit/after/F-001.png)
- **Fix:** Replace `color: #0c0d0f` with `color: var(--ts-on-accent)` at `<file:line>`.

### F-002 · ...
```

Every finding has a probe **and** a before/after screenshot. No exceptions.

---

## Toolskin-specific gotchas (learned the hard way)

These cost iterations in the past — bake them in:

1. **`oklch(from var(--ts-accent) clamp(0, (0.72 - l)*999, 1) 0 0)`** is the `--ts-on-accent` formula. Threshold 0.72 keeps white text on brand orange. Lowering pushes more text to black; raising pushes more to white. Same formula applies to per-status `--ts-on-{success|warning|danger|info}`.

2. **Variant-safe deck width.** The slider-on variant is enabled with `.ts-deck--with-slider`. Tokens must be hoisted to `:root:has(.ts-deck--with-slider), body:has(.ts-deck--with-slider)` so the floating gallery (sibling of `.ts-deck`) inherits — overriding on `.ts-deck` alone leaves the sibling at 0-width. Use `--ts-deck-gallery-w` as the **single variant-driven dimension**; everything else derives from it.

3. **Footer offset formula.** `--ts-slide-fixed-footer-offset-x: calc(var(--ts-deck-gallery-w) - var(--ts-container-pad))`. The `-` is intentional. The `+` variant was a regression.

4. **Split-column slides** use `.ts-slide-split` / `.ts-slide-split__intro` / `.ts-slide-split__body`. Inside `__body`, the masonry is a **2-col CSS grid** (`grid-template-columns: repeat(2, minmax(0, 1fr))`) with `height: var(--_ts-basis)` on inner cards. **Never** `aspect-ratio: 1` on cards with variable copy — it forces vertical scroll.

5. **Card body text** uses `font-size: clamp(0.42em + 1cqw, 0.65rem + 1cqw, 1.2rem)` — note the container queries. The card needs `container-type: inline-size` for `cqw` to resolve.

6. **`text-wrap: balance`** on every heading, `text-wrap: pretty` on every paragraph. Non-negotiable.

7. **No `height: 100dvh`** on inner flex wrappers — causes scroll. Use `max-height: calc(var(--ts-deck-slide-min-height) - var(--ts-deck-nav-size) * 2)`.

8. **Don't fight `:has()`.** Selectors like `body:not(:has(.ts-deck--with-slider)) .ts-floating-picture { display: none }` are the right way to keep variant DOM inert without JS.

9. **Toolskin JS auto-init.** `ToolskinSlider` mounts on `[data-ts-slider]`. `Toolskin.init()` runs the rest. If you add new components, follow the same `data-ts-*` attribute convention.

---

## What to refuse

- "Just hardcode it for now." → No. The point of this skill is to prevent that.
- "Skip the screenshot, I trust you." → No. The probe + screenshot is the audit. Without them it's a guess.
- "Make a new class for this one-off." → Push back. Either it's a real pattern (worth a token-driven class with a comment) or it should compose existing utilities. One-offs are how design systems decay.
- "Just delete the legacy CSS." → Comment-flag it first. Removal is a follow-up commit after the visual verification passes.

---

## Quick reference — commands

```bash
# Snapshot all slides of a deck
node scripts/_audit_deck.mjs http://localhost:8080/pitchdeck.html

# Probe computed style of a selector
node -e 'import("playwright").then(async ({chromium})=>{const b=await chromium.launch();const p=await(await b.newContext()).newPage();await p.goto(process.argv[1]);console.log(await p.evaluate(()=>JSON.stringify({color:getComputedStyle(document.querySelector(process.env.SEL)).color},null,2)));await b.close()})' \
  http://localhost:8080/pitchdeck.html  # then set SEL env var

# Diff two screenshot dirs (requires imagemagick)
for f in audit/before/*.png; do
  name=$(basename "$f")
  compare -metric AE "$f" "audit/after/$name" "audit/diff/$name" 2>&1 | xargs -I{} echo "$name: {} px diff"
done

# Token-leak count over time
rg -c '#[0-9a-fA-F]{3,8}|rgba?\(' --type css -g '!toolskin.css' | awk -F: '{s+=$2} END {print s}'
```

---

## Output format expectations

When the user asks for an audit, **always** end your turn with:

1. The scorecard markdown file path.
2. The screenshots directory path.
3. A one-line summary: `N pass · M warn · K fail · X token leaks fixed · Y remaining`.
4. The next recommended action (which finding to address next, or "audit complete — no action needed").

Do not pad with prose. The user wants the verdict, the proof, and the path forward — in that order.

---

## Versioning

- **v1.0** — 2026-05-19. Initial extraction from the Toolskin pitchdeck refactor session.
- Update `## Toolskin-specific gotchas` whenever a new bug-pattern shows up that costs more than one iteration to fix.
