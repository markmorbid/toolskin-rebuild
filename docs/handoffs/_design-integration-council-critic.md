# DESIGN CRITIC — Design Integration Council

> Voice: Design Critic. Lens: Rule 5 (drop-in identity). Fresh context, no knowledge of other voices.
> Question: Does the tokenized sandbox preserve Toolskin's visual identity? Will it still LOOK like Toolskin in a host context?

---

## PASS/FAIL on visual identity alignment

**FIX-THEN-SHIP.** The sandbox is architecturally honest — every value is a token, every surface re-anchors, the derivative chain is real — but as a *visual artifact* it has been bleached. It demonstrates the engine; it does NOT demonstrate Toolskin's identity. A host page dropping these tokens in TODAY would get a competent token-driven page, not a recognizably Toolskin page.

---

## What the sandbox PRESERVES from showcase intent

- **Three-knob accent + hue propagation** — `--ts-accent` paints CTA fill, focus rings, link underline-hover, accent-bordered icon glyph. The single-source-of-color discipline is intact.
- **Surface ladder as a real ladder** — `bg-1 → bg-5` swatches render side-by-side; the showcase's "surfaces are a curated ladder, not derived" reads cleanly.
- **Two-line idiom (RULING 9)** — every component re-anchors `--ts-this-bg` before consuming; the nested-panel demo proves three-deep coherence works.
- **OKLCH-mixed derivative states** — hover/active/focus all recompute against the local anchor; the upgrade from `srgb` to `oklch` + hue-locked tone anchors is a genuine identity-positive (no pink-drift on chromatic surfaces).
- **Tabular figures + tracking discipline** — `tnum` on metrics, `--ts-tracking-*` ladder applied to headings/eyebrows — the "tool-system precision" voice survives.
- **13px body (RULING 3) + 1.200 ladder** — density reads correctly. This *is* the Toolskin tool-system voice.
- **Real CSS imports verified** — line 10-11 of the sandbox HTML chain `primitives/colors.css` then `system/surfaces.css`. Not stub, not duplicate — the actual engine drives the page. **Confirmed.**

## What the sandbox LOSES vs the showcase (identity-critical)

- **Editorial italic accent word** — showcase hero: `Stop guessing.` with `guessing` in Instrument Serif italic colored by accent. Sandbox hero: `The Toolskin design language.` with `design language.` in plain Space Grotesk colored by accent. **Severity: HIGH.** This single Instrument Serif word IS one of the three visual gestures that read as "Toolskin, not generic SaaS." The substitution to color-only loses 70% of the editorial voice. The Gerald 2 HANDOFF §8 explicitly flagged this as intentional and showcase-only-acceptable.
- **Gradient hero atmosphere** — showcase hero `::before` paints two radial accent + alt gradients behind the headline (`accent-dim` + `alt-dim`). Sandbox hero is a flat color field. **Severity: HIGH.** The radial-glow under the headline is what makes the showcase hero feel like a *product*, not a docs page. Removing it makes the sandbox feel like a token explainer (which it is) instead of a Toolskin artifact.
- **`--ts-alt` companion color** — showcase consistently uses `--ts-alt` / `--ts-alt-dim` alongside accent (radial backgrounds, quote avatar gradient, bento corners). Sandbox has no alt at all. **Severity: HIGH.** Toolskin identity in the showcase is *bichromatic* — accent + alt — not monochromatic accent.
- **Bento composition** — showcase has the 12-column bento (hero tile + tall accent tile + 3 thirds) with accent-paint on the metric tile (`bento-tall` background: var(--ts-accent)`). Sandbox has card-row only. **Severity: HIGH.** The bento with one accent-painted tile + one gradient hero IS the Toolskin composition signature.
- **Featured/elevated emphasis pattern** — showcase `.demo-price--featured` uses `--ts-accent-border` + `--ts-shadow-accent` (an accent-tinted shadow) to elevate the chosen plan. Sandbox cards are uniform. **Severity: MED.** Without an "elevated" treatment, the system can't express *priority*.
- **3-font typographic system** — showcase loads Space Grotesk + JetBrains Mono + Instrument Serif. Sandbox loads ONLY Space Grotesk. **Severity: MED-HIGH.** This is partly correct (.impeccable rule says production = 2), but the *reference page* should mirror showcase to prove the system covers display/body/mono/serif gestures. Currently the sandbox can't prove Toolskin handles serifs at all.
- **JetBrains Mono missing in execution** — sandbox declares `--ts-font-mono: 'JetBrains Mono'` (line 38) but does NOT load it. Mono will fall back to `ui-monospace` which on Windows = Consolas, on macOS = Menlo. **Severity: MED.** Identity-breaking fallback in any host context. The mono labels (`--ts-bg-1` swatch labels, ladder step labels) will render in the wrong font.
- **Solid accent paint surfaces** — showcase paints accent SOLID on `.bento-tall` (a full card background) and `.flow__num` (the workflow numbers). Sandbox paints accent only on `.ts-btn--primary` (CTA) + `.pick[aria-pressed]` (active state). **Severity: MED.** This matches Rule-5 discipline correctly (CTA + active only), but the sandbox would be more identity-true if at least ONE surface block carried full-paint accent the way showcase's bento-tall does. The showcase WAS doing this on a "hero metric" tile — there's a legitimate reason for one full-paint surface.
- **Sharp radius corners** — showcase has no `border-radius: 0` anywhere visible. Sandbox has `--ts-radius-0: 0` declared but unused. The orchestrator brief specifically asked about flush composition + sharp corners; neither artifact uses them. **Severity: LOW** for the sandbox (it matches showcase), but a flagged gap for the *system*: the token exists for a reason and should be used in the eventual Session 4 composition blocks.
- **`text-wrap: balance` on hero only** — sandbox uses it, good. But the showcase uses balance on hero + quotes + bento h3 + section heads. Sandbox uses it only on hero. **Severity: LOW.**

## What the sandbox SIMPLIFIES (convenience, not identity)

- **No `box-shadow` token usage** — sandbox correctly drops the showcase's `--ts-shadow-1` / `--ts-shadow-accent` and substitutes border-only depth. This is an **identity GAIN, not a loss**: depth-via-surface-mixing is more on-brand for a tool system than the SaaS-default elevation shadows, and aligns with the "OKLCH-mixed surfaces are the depth language" promise. Keep.
- **No `clamp()` hero size** — showcase uses `clamp(48px, 9vw, 124px)` on the hero h1; sandbox uses the `--ts-fs-hero` token which IS itself a clamp. Acceptable.
- **Topbar simplified** — showcase has full nav + theme toggle + CTA; sandbox has brand + theme/preset toggles. Acceptable for a reference page (nav has nothing to point to).
- **Footer reduced to one line** — showcase has full 4-column footer; sandbox has 1-line credit. Acceptable for reference.
- **No reveal-on-scroll animation** — sandbox drops the IntersectionObserver fade. Acceptable: this is host-page polish, not system identity.
- **Single accent (no `--ts-alt`)** — listed under losses above; arguably a simplification, but `--ts-alt` is in the showcase's identity vocabulary often enough to count as identity, not chrome.

## Concrete system gaps (token-name level)

| Gap | What it needs to do | Session 4 block impact |
|---|---|---|
| `--ts-alt` + `--ts-alt-dim` (system layer) | Companion color paired with `--ts-accent`. Same three-knob derivation pipeline, hue offset by a curated delta (complementary or split-complementary). Used in radial atmospheres, gradient bridges, secondary chips. | Hero block, Bento block, Testimonial block can't ship a faithful Toolskin look without it. |
| `--ts-accent-dim` (system layer, currently inline-only in showcase) | Pre-derived 12-15% accent for icon backgrounds and radial gradients. Sandbox uses `--ts-this-bg-bright` on icons but the showcase's iconography reads as accent-tinted, not contrast-tinted. | Feature card icon (Block 6+) needs accent-tinted icon bg, not contrast-tinted. |
| `--ts-accent-bright` + `--ts-accent-dark` (system layer) | Accent variants for the accent-on-accent gradient atmosphere in the hero `accent-lab__preview` block of the showcase. | Hero block + any "premium tile" block. |
| `--ts-shadow-accent` (system layer, optional) | Even if the system rejects neutral shadows in favor of surface-mix depth, the *accent-glow* shadow is identity (it makes the featured pricing tile read as the chosen path). | Pricing block + featured-emphasis blocks. Without this OR an equivalent paint-based "selected" treatment, can't express selection priority. |
| `--ts-text-display` font fallback chain hardening | Hero deserves a display-weight pairing distinct from body. Currently `--ts-font-display` == `--ts-font-body`. Showcase uses Space Grotesk for both but the cascade allows divergence. Token needs to NOT be an alias of body. | Hero block + section heads. |
| `--ts-font-serif` (system layer) | One Instrument Serif italic accent word IS Toolskin identity. Either declare the token and let blocks opt in, or formally retire the gesture. | Hero block, Quote block, any "editorial moment." |
| JetBrains Mono load directive | Currently declared but not loaded — silent fallback to Consolas. | Every block with code, mono labels, tabular metrics. |
| Radius usage of `--ts-radius-0` | Token exists but no recipe in the sandbox demonstrates the flush/sharp gesture. Spec a "flush composition" pattern in Session 4 docs. | Bento hero tile + any "monolith" composition. |
| `--ts-fs-hero` clamp upper bound | Currently `var(--ts-fs-9)` ≈ 67px. Showcase hero hits 124px. Even at 13px base, Toolskin hero moments need to break the ladder. | Hero block reads small without this. |

## Priority order

**MUST SHIP BEFORE SESSION 4 (identity-critical):**
1. Load JetBrains Mono — one-line fix, otherwise every mono label silently degrades.
2. Add `--ts-alt` to the system layer (or formally retire the alt-color identity gesture and document it).
3. Bump `--ts-fs-hero` upper clamp to ~`calc(var(--ts-fs-9) * 1.5)` or ~96px — current cap reads timid.
4. Add `--ts-accent-dim` / `--ts-accent-bright` / `--ts-accent-dark` to the system layer — the radial-atmosphere + icon-tint pattern needs them.
5. Decide policy on `--ts-font-serif` / Instrument Serif italic word. If retained: token + load + sandbox demo. If retired: explicit ruling so Session 4 doesn't reintroduce it ad-hoc.

**CAN SHIP DURING SESSION 4:**
6. Bento composition pattern + flush/`--ts-radius-0` flush variant — naturally arrives with Block "Bento."
7. Accent-tinted shadow OR equivalent paint-based "featured" treatment — arrives with Block "Pricing."
8. Add radial-gradient atmosphere recipe to Hero block — arrives with Block "Hero."
9. `text-wrap: balance` defaults on h1/h2/h3 — arrives with Block "Typography composition."

**DEFER TO SESSION 5+:**
10. Reveal-on-scroll motion utility.
11. Footer recipes (4-column variant).
12. Full top-nav patterns.

## Critic verdict

The sandbox is a faithful demonstration of the **engine** but a thin demonstration of the **identity**. Architecturally it passes — the derivative chain works, real system files are loaded, two-line idiom is honored, hue-locked OKLCH mixing is genuinely better than the showcase's older `srgb` mixes. As an identity drop-in, it currently reads as "a token-driven design system" and not as "Toolskin." The fix is concrete and small: ship 5 system tokens (alt + 3 accent steps + a hero clamp bump), load JetBrains Mono, decide policy on serif italic, and the system will be ready to carry Session 4 block work without losing the brand. **Fix the 5 MUST-SHIP items in one focused 90-minute session, then go.** Do not start Session 4 block work on the current system layer — the blocks will be built against a vocabulary too small to express what the showcase already demonstrated as the target.
