# DESIGN SKEPTIC — Design Integration Council

## PASS/FAIL on visual identity alignment

**CONDITIONAL FAIL.** The sandbox is token-clean and architecturally honest, but it has sanded the showcase down to a tutorial slide. It TEACHES the system but does not LIVE the system. Session 4 blocks copying this sandbox will inherit a stripped-back doc aesthetic, not the Toolskin product surface the showcase encoded.

## What the showcase ENCODED (owner intent, lore)

- **Three-font conversation, not "a font stack."** Space Grotesk (display + body) does the work, JetBrains Mono carries data/code/numeric labels (`/01`, `82.6 px`, `tnum`), Instrument Serif italic carries ONE editorial gesture ("guessing.", "unforgettable") that flips the page from "engineer's doc" to "designed object." Three voices: machine, voice, and feeling.
- **Numbered sections as wayfinding.** `/ 01`, `/ 02`, `/ 03` in mono with leading slash — this is editorial chrome, not decoration. It signals "this is a curated tour" before any words land.
- **Density signals tool-system identity.** 13px body + tight tracking + heavy heads at 67–124px is the genre. It's not a marketing page pretending to be a doc, nor a doc pretending to be marketing — it's the third thing: instrument panel.
- **Live re-theming as proof-of-system.** Sliders on the page that retheme the whole document in real time. This is THE demo. It's how the showcase says "this isn't a stylesheet, it's an engine."
- **Surface superposition USED IN PRODUCTION.** Bento grid where the accent tall tile flips to `--ts-accent` background with `--ts-on-accent` text and the eyebrow auto-dims via `color-mix`. Cards that exercise `accent-dim`, `accent-border`, `shadow-accent`, `accent-bright`, `accent-dark` in real layouts.
- **Persona inside the product.** Topbar with brand mark, sticky nav, theme toggle, "Open skill" CTA. Hero with kicker stack, italic-word headline, dual-CTA rail with chip cluster. Footer with 4-column nav. This is a SHIPPED page — not a swatch board.
- **Recipe density.** Stat card with red/green deltas, feature card with icon-on-accent-dim, pricing card with `--ts-shadow-accent` featured variant, testimonial with serif blockquote. The skill earns trust by *showing the recipes working together*.

## What the sandbox PRESERVES

- 13px base — the density signal is kept.
- 1.200 ladder — same math, all 12 steps visible.
- Surface chain via `--ts-this-bg` with re-anchoring — the engineering soul of the system.
- Six derivative state swatches on a single anchor (bg / bright / dark / hover / active / focus).
- Three-deep nested re-anchoring (bg-1 → bg-3 → bg-5).
- Theme + preset toggles (Dark / Light / Default / Warm / Blue) — actually the strongest preservation move.
- Audit-clean token discipline. No hex leaks. No `!important`. Every value resolves.

## What the sandbox SANDED OFF (and why it matters)

- **Instrument Serif italic.** Gone. The single italic word was the editorial gesture that made the showcase feel *authored*. Sanding it costs the designed-object register. — IDENTITY-BEARING.
- **JetBrains Mono.** Loaded only as a fallback in the font stack, never actually rendered on the page (no mono usage anywhere in section numbers, ladder sizes, swatch labels, kicker tags). The showcase used mono as the "machine voice" that distinguishes data from prose. Sandbox renders everything in Space Grotesk including the `/01` numbers and `67 px` measurements. — IDENTITY-BEARING.
- **Numbered section chrome (`/ 01`, `/ 02`).** Replaced by plain `Typography`, `Surfaces`, `Card recipes` overlines. The slash-numeral pattern was the showcase's wayfinding signature. Loss flattens the page into a generic doc. — IDENTITY-BEARING.
- **The accent lab (live sliders).** Cut. Theme/preset toggles remain, but the showcase's *headline demo* — drag a hue, the page repaints — is gone. The sandbox claims "the system is the design"; without the lab, that claim is unproven. — HIGHEST IDENTITY LOSS.
- **Bento composition.** Cut. The 12-col dense bento with accent-tall tile was the layout that showed surface superposition under real composition pressure. Sandbox shows the chain on isolated swatches, not in compositional combat. — IDENTITY-BEARING.
- **Recipe variety.** Showcase has 4 recipes (stat / feature / pricing / quote) plus bento tiles, each exercising a different part of the accent chain. Sandbox has 3 generic-shape cards using nearly identical token combinations. The system's vocabulary appears narrower than it is. — IDENTITY-BEARING.
- **Hero composition.** Showcase: 7fr/5fr split, kicker stack, italic-word headline, side rail with lead + dual CTA + chip cluster. Sandbox: centered single-column hero, plain headline, lead, two buttons. The showcase hero TAUGHT a layout pattern. Sandbox hero teaches nothing. — MED-HIGH.
- **Sticky topbar with brand mark + nav + CTA.** Showcase has identity furniture. Sandbox has a one-line toolbar. The product-shell vocabulary is missing. — MED.
- **`--ts-shadow-accent` and the `--featured` pricing variant.** Token exists in `tokens.css`, never demonstrated in sandbox. A signature visual move (accent-glow on the featured card) goes unused. — MED.
- **`color-mix` on `--ts-on-accent`** for auto-dimmed eyebrows on accent backgrounds. The bento tall tile used it. Sandbox never colors anything on `--ts-accent`, so the on-accent semantics aren't proven. — MED.
- **Radial gradient hero glow.** Showcase hero uses dual `radial-gradient` with `--ts-accent-dim` + `--ts-alt-dim` for atmospheric depth. Sandbox is flat. Atmosphere is part of the identity. — LOW-MED.

## Naive-refactor risk ranking

If Session 4 blocks copy the sandbox pattern unchanged:

| Delta | LOSS RISK | Why |
|---|---|---|
| No mono usage in numeric/data/label slots | **HIGH** | Every Session 4 block will render data labels in Space Grotesk. The machine voice dies system-wide. Hard to retrofit. |
| No Instrument Serif accent word | **MED** | If sandbox is "the canon," blocks will assume one-font is the rule. Reintroducing later reads as a regression. |
| No accent-lab / live sliders | **HIGH** | The system's selling proposition is "one knob → whole UI repaints." If no block proves it, the framework's marketing claim is unfalsifiable. |
| No bento / compositional pressure on the surface chain | **HIGH** | Surface superposition is the technical centerpiece. Showing it only on swatches teaches the chain abstractly. Blocks will use cards-in-a-grid forever and never reach for bento. |
| No featured/shadow-accent variant | **MED** | `--ts-shadow-accent` exists but is invisible. Tokens that aren't demonstrated get deleted in cleanup. |
| Numbered section chrome dropped | **MED** | Editorial signature lost. Blocks will look like Bootstrap docs. |
| Hero is centered + flat instead of split + atmospheric | **MED** | Marketing/hero block work in Session 4+ will default to "centered, lead, two buttons" — the most generic hero on earth. |
| Sticky topbar with brand+nav+CTA is downgraded to toolbar | **LOW-MED** | Easier to fix per-block but means no canonical app-shell exists. |
| Pricing / quote / icon-on-accent-dim recipes never built | **MED** | Recipe library shrinks invisibly. Agents will reinvent them. |
| Radial gradient atmospherics | **LOW** | Cosmetic; can be retrofitted. |

## Concrete system gaps the showcase demands

These are gaps in the **system layer** (not just the sandbox demo) that Session 4 needs resolved before block work:

1. **`system/text.css` must declare `--ts-font-mono` AS A REAL TOKEN with a use-case rule.** Right now mono is loaded but unrendered. The system needs a `.ts-mono`, `.ts-num`, `.ts-label` class that automatically applies mono + `tnum` for measurements/labels/data. Component recipes should consume it (every `/ 01` numeral, every "67 px" stat, every `var(--ts-foo)` inline code).

2. **`system/text.css` (or `system/editorial.css`) needs `--ts-font-accent` and a `.ts-accent-word` class** that loads Instrument Serif (or whichever serif wins) on demand. This is the single editorial gesture; treating it as accidental costs identity. Token name + class makes it a deliberate, reusable move instead of a one-off showcase hack.

3. **`system/accent.css` must own `--ts-accent-h/s/l` as the three knobs**, not `tokens.css` ad-hoc. Plus `--ts-accent-bright`, `--ts-accent-dark`, `--ts-accent-dim`, `--ts-accent-dim-2`, `--ts-accent-border`, `--ts-on-accent`, `--ts-shadow-accent`. Currently sandbox uses only `--ts-accent` + `--ts-on-accent`; the rest of the chain exists in tokens.css but is invisible.

4. **A canonical "accent-lab" component** — a re-themable demo block (sliders → whole-page repaint) ships into `sandbox/00-design-reference/` BEFORE Session 4. Without it, the rebuild has no live proof its core promise works.

5. **A canonical bento block recipe.** `--ts-bento`, `--ts-bento__hero/tall/third` are in `tokens.css` but the sandbox never composes one. Session 4 needs a bento block in `sandbox/01-system/` or `sandbox/02-marketing/` that exercises accent-tile + `--ts-on-accent` body + `color-mix` eyebrow dimming.

6. **App-shell primitives** — sticky topbar (with brand-mark + nav + actions) and footer (4-col grid) need a canonical class set. Showcase has them inline; sandbox has half-versions. Session 4 marketing blocks will need these on day one.

7. **`--ts-section-pad` rhythm tokens consumed**, not just declared. Showcase uses `padding-block: clamp(96px, 16vh, 192px)` on the hero (its own fluid rhythm); sandbox uses `clamp(4rem, 12vw, 10rem)`. Decide which is canonical; encode in `system/spacing.css`.

8. **Surface preset switching at runtime.** Sandbox topbar has buttons for `dark-warm-slate-v2` and `dark-blue-tinted-v3`, but those classes have to exist as `.ts-preset-dark-warm-slate-v2 { … }` in `primitives/colors.css` for the buttons to actually do anything. Verify the system layer ships preset classes, not just hex tables.

## Priority order

**MUST SHIP BEFORE SESSION 4:**
- `--ts-font-mono` consumed in numeric/label/data slots in the sandbox (rebuild section numbers, measurements, swatch labels into mono). Without this, every Session 4 block bakes in "everything is Space Grotesk."
- Accent-lab block (live H/S/L sliders → page repaint) shipped to `sandbox/00-design-reference/`. The system's headline claim must be proven on the canonical reference page.
- One canonical bento composition exercising `--ts-accent` tile + `--ts-on-accent` + `color-mix` eyebrow dim.
- Decision (write it down): is Instrument Serif a Toolskin word, or was it a one-off? If yes, encode as `--ts-font-accent` token + `.ts-accent-word` class in `system/text.css`. If no, document the deletion as deliberate so it doesn't sneak back in.
- Sticky topbar primitive (brand-mark + nav + actions cluster) and 4-col footer primitive — canonical class set.

**CAN SHIP DURING SESSION 4 (if guarded by clear specs):**
- Numbered section chrome (`/ 01` mono leading-slash pattern) as a `.section-head__num` utility.
- Featured/shadow-accent card variant demonstrated in a real pricing or hero card.
- Hero split layout (7fr/5fr + kicker stack + side rail) as a canonical marketing-hero block.
- Radial-gradient atmospheric hero background.
- Stat / feature / pricing / quote recipe parity with showcase.

**DEFER TO SESSION 5+:**
- Scroll-reveal animations.
- Awwwards-canon section patterns (the 10 patterns in `references/05-awwwards-patterns.md`).
- The accent-lab graduating from sandbox to production tools (component-builder UI).

## Skeptic verdict (1 paragraph)

The integration is not done. The sandbox is what an engineer would build to *prove the architecture works*; the showcase is what a designer built to *prove the architecture matters*. Both are necessary, but right now we have only the first. Session 4 inherits hidden design debt in five places: (1) mono-as-machine-voice is implied by the token stack but rendered nowhere, (2) the live-retheme demo that justifies the entire "one knob" pitch is missing from the canonical reference, (3) surface superposition is shown on swatches but never on compositional pressure (bento, accent tiles, on-accent text), (4) the editorial gesture (Instrument Serif italic word) is undecided — either canonize it or document the deletion, and (5) app-shell primitives (real topbar, real footer, featured-card variant) don't exist as canonical classes. If Session 4 blocks copy the sandbox pattern as-is, the rebuilt Toolskin will read as a tasteful documentation site, not as the instrument-panel design system the showcase was promising. Fix the five gaps above first or rename the sandbox from `00-design-reference` to `00-token-proof`.
