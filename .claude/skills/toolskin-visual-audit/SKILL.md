---
name: toolskin-visual-audit
description: Precise visual auditor and engineer for the Toolskin design system — verifies token-first refactors with screenshots, computed-style probes, and token-leak greps rather than vibes. Use for visual audits of pages, components, or pitchdecks; refactor passes that move hardcoded values onto canonical --ts-* tokens; before/after screenshot diffs; component grading against canonical CSS; and Session 4+ block-sandbox parity checks against the Wave 1.6 visual ground truth. Trigger whenever the user asks for a visual audit, parity check, token-leak scan, computed-style probe, component scorecard, or before/after visual proof in the Toolskin rebuild.
---

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

1. **Read the canonical CSS before touching anything.** In rebuild context: reference = `../toolskin-showcase/assets/css/toolskin.css` (read-only baseline per file 07); rebuild target = `assets/css/next/**/*.css` (under construction from Session 2 onward). Every rule you add or change must reference a `--ts-*` token, an `em`, or a `clamp(--ts-sp-*, dvw, --ts-sp-*)`. No hardcoded px in component rules.
2. **No new top-level class namespaces.** Extend via `--ts-this-bg`, BEM modifiers, or `--ts-*` token re-binding inside a scope. If you genuinely need a new class, it must start with `ts-` and be documented in a one-line comment block above the rule.
3. **No inline `style="..."` on slide/page content.** If you find yourself typing `style="max-width: 30dvw"` or `style="font-size: var(--ts-deck-icon-size)"`, stop and create a class (e.g. `.ts-slide-split__intro`, `.ts-icon--deck`).
4. **Visual claims need visual proof.** "Looks broken" / "looks better" must come with a Playwright screenshot before *and* after, plus a `getComputedStyle` probe of the disputed property.
5. **Variant-safe tokens.** When a layout has variants (e.g. slider on/off, density compact/comfortable/spacious), the variant overrides must read tokens that have **safe defaults at `:root`**. The class that flips the variant only changes the tokens — nothing downstream changes formulas.
6. **Never delete legacy CSS in the first pass.** Comment-flag it with `/* @legacy — replace with .ts-slide-split */`. Removal is a separate, atomic commit after verification.

---

## Rebuild-context token values (Wave 1.6 binding — supersede any prior references)

These values were confirmed by the Wave 1.6 visual audit (May 2026) against the running toolskin.css and owner real-Chrome captures. Use these in any rebuild work, not the showcase's inline comments.

- **Base font size:** `--ts-fs-base: 15px` (not 13px, not 16px)
- **Font weight ladder:** 300 / 400 / 500 / 600 / 700 / 900 (6 steps — NO 800 weight; Space Grotesk ships 300–700 max under SIL OFL)
- **H1 weight:** 700 (`--ts-font-weight-bold`), **H2 weight:** 600 (`--ts-font-weight-semibold`)
- **Radius base:** `--ts-radius-base: 8px`
- **Radius ladder (explicit, not calc-derived):** 4 / 6 / 8 / 10 / 16 / 9999 / 0
- **Canonical token names** follow `_rebuild-primitives-spec.md` — verify against S1 spec before using deck-specific token names from the showcase source

---

## Project map (Toolskin rebuild)

```
toolskin-rebuild/                    ← canonical project (all work here)
├── assets/css/next/                 ← rebuild target (Sessions 2+)
├── tools/visual-audit/              ← audit scripts (build-time, gitignored)
│   └── capture.mjs                  ← existing capture script (non-deck + deck)
├── docs/handoffs/
│   ├── _rebuild-visual-audit.md     ← Wave 1.6 ground truth (1510 lines)
│   ├── _rebuild-design-dna.md       ← design DNA (Wave 1.5 + 1.6 reconciled)
│   └── _visual-audit/
│       ├── screenshots/             ← gitignored (regenerable via capture.mjs)
│       └── owner-ground-truth/      ← committed (34 owner real-Chrome JPGs)
└── .claude/skills/
    └── toolskin-visual-audit/       ← this skill

../toolskin-showcase/                ← reference repo (READ-ONLY FOREVER)
├── assets/css/toolskin.css          ← reference CSS (read, never write)
└── index.html, toolskin-lab.html    ← reference pages (read, never write)
```

Canonical token namespaces (rebuild):

- `--ts-fs-*` — font sizes (base=15px, harmonic ladder)
- `--ts-sp-*` — spacing (4pt grid, tiered scale; `--ts-sp-1..--ts-sp-24`)
- `--ts-radius-*` — radii (explicit: 4/6/8/10/16/9999/0)
- `--ts-line-height-*` — `none`, `display`, `tight`, `snug`, `normal`, `relaxed`, `loose`, `very-loose`
- `--ts-letter-spacing-*` — `tight`, `normal`, `wide`, `wider`, `eyebrow`
- `--ts-this-bg`, `--ts-this-bg-dim-N`, `--ts-this-bg-bright-N`, `--ts-this-bg-border-*` — surface inheritance
- `--ts-accent`, `--ts-on-accent`, plus per-status `--ts-on-success`, `--ts-on-danger`, `--ts-on-warning`, `--ts-on-info`

---

## Standard workflow

### 0. Setup (once per session)

```bash
# Start a local server for the reference repo (read-only — never cd into it)
python3 -m http.server 8080 --directory "../toolskin-showcase" >/dev/null 2>&1 &
SERVER_PID=$!

# Or for the rebuild target (Sessions 2+):
python3 -m http.server 8080 --directory "D:/Mis Documentos/Projects/Toolskin Framework/toolskin-rebuild" >/dev/null 2>&1 &

# Verify Playwright is installed at tools/visual-audit/
node -e "require('playwright')" 2>/dev/null || \
  (cd tools/visual-audit && npm i -D playwright && npx playwright install chromium)
```

Use existing `tools/visual-audit/capture.mjs` for systematic captures (already handles non-deck pages + deck slides + theme toggling).

### 1. Inventory the target

```bash
# What CSS/JS does the file load?
rg -n '<link.*\.css|<script.*\.js' <target.html>

# What classes does it use that aren't in canonical CSS? (token leak candidates)
rg -o 'class="[^"]+"' <target.html> | tr ' ' '\n' | sort -u
```

### 2. Visual snapshot (before)

Use the existing capture script rather than writing new ones:

```bash
# Full audit of reference pages (non-deck)
node tools/visual-audit/capture.mjs

# Or targeted: pass URL + output + viewport
node scripts/_audit_snapshot.mjs http://localhost:8080/index.html before/index 1440 900
```

Note: audit scripts live at `tools/visual-audit/*.mjs` in the rebuild (not `scripts/`).

For decks, use the deck iteration variant:

```js
// Within capture.mjs deck mode — iterates .ts-slide elements
const slides = await page.$$eval('.ts-slide', els => els.length);
for (let i = 0; i < slides; i++) {
  await page.evaluate(idx => {
    document.querySelectorAll('.ts-slide').forEach((s, j) =>
      s.classList.toggle('ts-active', j === idx));
  }, i);
  await page.waitForTimeout(250);
  await page.screenshot({
    path: `audit/before/slide-${String(i+1).padStart(2,'0')}.png`,
    fullPage: false
  });
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

# Direct primitive references (should use --ts-this-bg surface inheritance instead)
rg -n 'var\(--ts-bg-[0-9]\)' --type css -g '!toolskin.css'
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
    onAccentToken: getComputedStyle(document.documentElement)
      .getPropertyValue('--ts-on-accent'),
    fsBase: getComputedStyle(document.documentElement)
      .getPropertyValue('--ts-fs-base'),
    radiusBase: getComputedStyle(document.documentElement)
      .getPropertyValue('--ts-radius-base'),
  };
});
console.log(JSON.stringify(probe, null, 2));
```

If `color` resolves to `rgb(12, 13, 15)` on an orange-bg button, you've found a token leak (should be `var(--ts-on-accent)` → white).

If `fsBase` resolves to anything other than `15px`, the base font token isn't applied correctly.

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
- **Probe:** `getComputedStyle(.ts-btn--primary).color = rgb(12,13,15)`
  (expected `rgb(255,255,255)` via `--ts-on-accent`)
- **Before:** ![](audit/before/F-001.png)
- **After:** ![](audit/after/F-001.png)
- **Fix:** Replace `color: #0c0d0f` with `color: var(--ts-on-accent)` at `<file:line>`.
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

10. **Direct primitive references are token leaks.** `var(--ts-bg-1)` in component CSS is a Rule 15 violation — use `var(--ts-this-bg)` surface inheritance instead. The marquee `--ts-bg-1` reference was flagged HIGH in the Wave 1.6 audit and is a known regression to fix in rebuild.

11. **Font weight 800 does not exist in Space Grotesk.** The font ships 300–700 only (SIL OFL). Any `font-weight: 800` declaration triggers synthetic faux-bold — avoid. The rebuild's canonical 6-step ladder: 300/400/500/600/700/900.

---

## What to refuse

- "Just hardcode it for now." → No. The point of this skill is to prevent that.
- "Skip the screenshot, I trust you." → No. The probe + screenshot is the audit. Without them it's a guess.
- "Make a new class for this one-off." → Push back. Either it's a real pattern (worth a token-driven class with a comment) or it should compose existing utilities. One-offs are how design systems decay.
- "Just delete the legacy CSS." → Comment-flag it first. Removal is a follow-up commit after the visual verification passes.
- "Use font-weight: 800 for the heading." → No. Space Grotesk ships 300–700 only. Use 700 (bold) for H1, 600 (semibold) for H2.

---

## Quick reference — commands

```bash
# Run existing Wave 1.6 capture script (non-deck pages, all viewports + themes)
node tools/visual-audit/capture.mjs

# Probe computed style of a selector
node -e "
import('playwright').then(async ({chromium}) => {
  const b = await chromium.launch();
  const p = await (await b.newContext()).newPage();
  await p.goto(process.argv[1]);
  const probe = await p.evaluate(() => ({
    color: getComputedStyle(document.querySelector('.ts-btn--primary')).color,
    fsBase: getComputedStyle(document.documentElement).getPropertyValue('--ts-fs-base'),
  }));
  console.log(JSON.stringify(probe, null, 2));
  await b.close();
})" http://localhost:8080/index.html

# Token-leak count over time
rg -c '#[0-9a-fA-F]{3,8}|rgba?\(' --type css -g '!toolskin.css' | \
  awk -F: '{s+=$2} END {print s}'

# Diff two screenshot dirs (requires imagemagick)
for f in audit/before/*.png; do
  name=$(basename "$f")
  compare -metric AE "$f" "audit/after/$name" "audit/diff/$name" 2>&1 | \
    xargs -I{} echo "$name: {} px diff"
done
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
- **v1.1** — 2026-05-19. Rebuild reconciliation: Wave 1.6 binding values (15px base, 6-step weight ladder, explicit radius 4/6/8/10/16), repo isolation amendment (reference vs rebuild paths), script path update (tools/visual-audit/ not scripts/), direct-primitive-reference gotcha added (#10), font-weight-800 gotcha added (#11), token namespace updated for rebuild.

Update `## Toolskin-specific gotchas` whenever a new bug-pattern shows up that costs more than one iteration to fix.
