═══════════════════════════════════════════════════════════════════════
RULE 15 (NEW) — SMART COLOR SYSTEM (apcach) IS NON-NEGOTIABLE
═══════════════════════════════════════════════════════════════════════

Add to the CONVERSATION RULES as Rule 15. Encode verbatim in Phase E SKILL.md. This rule is non-skippable, non-overridable, and supersedes any color guidance from ANY external skill (ECC, designer-skills, anything else) when contradiction arises.

═══════════════════════════════════════════════════════════════════════
## Rule 15 — Smart Color System (apcach) is the color authority

> The Toolskin color system is built on **apcach** (antiflasher/apcach, MIT, Evil Martians) — JS color calculator composing OKLCH colors with verified APCA contrast at every derivation step. This is the holy grail differentiator of Toolskin: a CSS framework where every accent hue, every surface depth, every text-on-background pair is mathematically guaranteed to meet a target APCA contrast ratio without hand-tuning or lightness-fluctuation patches.
>
> apcach runs at TWO layers in Toolskin:
>
> 1. **BUILD-TIME** (tools/color-engine/) — generates the canonical primitive OKLCH values for `--ts-bg-*`, `--ts-accent-*`, `--ts-this-*` token families with verified APCA contrast at every step of every ramp. Output baked into `assets/css/next/primitives/colors.css` as static OKLCH custom properties.
>
> 2. **OPTIONAL RUNTIME** (toolskin.js) — when consumer selects a new accent hue at runtime (theme customizer, white-label deployment, AI-generated palette), toolskin.js calls apcach to recompute the entire derivative chain with the new hue while preserving contrast contracts at every step. No lightness fluctuation. No accessibility failures. No hand-tuning.
>
> **BINDING ON ALL CODE, ALL SKILLS, ALL SUB-AGENTS:**
>
> - Every color rule in `assets/css/next/**/*.css` derives from apcach output OR consumes the derivative system that derives from apcach output. NEVER from manual hex picks, NEVER from generic palette guidance, NEVER from external skill color proposals.
> - Any external skill (ECC design-system, designer-skills `/design-tokens`, anything else) that proposes color values, palette logic, or contrast methodology — its color guidance is OVERRIDDEN by apcach. The external skill's color flag is informational only; apcach's output is law.
> - The in-house `design-tokens` skill must be updated to reference apcach as the color substrate (in the update pass, Phase B.9.3 todo).
> - The CSS derivative chain (`--ts-this-color-*`, `--ts-this-bg-*`, surface superposition math) consumes apcach-derived primitives. The chain itself uses CSS `oklch()` and `color-mix()` to compose at the system layer.
> - NEVER propose an alternative color system. NEVER suggest "WCAG-only" methodology. NEVER use generic palette tooling that produces hex values without contrast verification.
> - If a sub-agent's brief or any external skill flag conflicts with apcach output, apcach wins. Document the override reason; proceed with apcach.
>
> **Why this rule matters:** Toolskin's value proposition vs Tailwind/Bootstrap/Vercel-default is that ANY accent input produces a complete, contrast-verified design system in one operation. This is the "literally give to anybody, AI or WordPress, and it adapts" promise (Rule 5). Without apcach as authoritative color substrate, that promise fails. Lose this rule, lose the differentiator.

═══════════════════════════════════════════════════════════════════════
ABSORPTION IMPLICATIONS — UPDATE TO PRIORITY HIERARCHY
═══════════════════════════════════════════════════════════════════════

The 5-tier hierarchy from the previous absorption strategy stands, with apcach as the COLOR DOMAIN's non-overridable substrate inside Tier 1:

```
TIER 1 — AUTHORITATIVE
  1. toolskin-architecture (Phase E skill)
     └── Rule 15: apcach is THE color authority (NON-OVERRIDABLE)
  2. design-tokens (in-house) — must consume apcach output
  3. expert-designer (in-house) — defers to apcach on color questions
  4. typography-master (in-house) — color/typography pairings via apcach

TIER 2-5 unchanged.
```

When any Tier 2-5 skill proposes color guidance that contradicts apcach output:
- The proposal is REJECTED
- Document the rejection in the artifact's footer ("Conflict with Rule 15 — apcach output preserved")
- Proceed with apcach

═══════════════════════════════════════════════════════════════════════
SUB-AGENT BRIEF UPDATES — APPLY DURING WAVE 2 DISPATCH
═══════════════════════════════════════════════════════════════════════

## S1 Color Foundation Architect — UPDATED MANDATE

Add to S1's existing brief:

> **HARD MANDATE (Rule 15 binding):** Every primitive color in `assets/css/next/primitives/colors.css` MUST be apcach-derived. No exceptions. No manual hex. No generic palette imports. No "let's just use a known good Tailwind ramp." Every value in the file is the output of an apcach call with verified APCA contrast at every step.
>
> Deliverables include:
> 1. Build script at `tools/color-engine/generate-colors.js` that imports apcach and writes `assets/css/next/primitives/colors.css`
> 2. Per-token derivation: each `--ts-bg-*`, `--ts-accent-*`, `--ts-on-*` documented with its apcach call (contrast target, chroma, hue, comparing color, search direction)
> 3. APCA contrast table — for every meaningful pair (e.g., text on each bg level, accent on each surface), the verified contrast ratio
> 4. Runtime hook spec — how `toolskin.js` would call apcach for accent recalculation (optional runtime layer per Rule 13 — apcach in shipped product is build-time, BUT toolskin.js may bundle a minimal apcach subset for runtime if owner approves)
> 5. Migration map: every color in the old toolskin.css → new apcach-derived equivalent (proves no regression)

## S2 System Layer Architect — UPDATED MANDATE

Add to S2's existing brief:

> **Rule 15 binding:** Every `--ts-this-color-*`, `--ts-this-bg-*`, surface superposition rule in `assets/css/next/system/*.css` consumes apcach-derived primitives via CSS `oklch()`, `color-mix(in oklch, ...)`, or direct token reference. No CSS rule introduces a color value that isn't derived from apcach output. The system layer's job is mathematical composition; the primitive layer provides the verified inputs.

═══════════════════════════════════════════════════════════════════════
ECC DESIGN-SYSTEM AUDIT — FILTER LIST EXTENSION
═══════════════════════════════════════════════════════════════════════

Add to the Toolskin filter list (encoded in Phase E SKILL.md) for ECC design-system audit mode:

- **Color consistency dimension:** ECC will score "consistent palette adherence." Toolskin uses apcach-derived OKLCH primitives, not a static palette. ECC's flag is INFORMATIONAL only. apcach-derived = ALWAYS consistent by construction. Rule 15 overrides ECC's color audit dimension.
- **AI slop detection:** ECC may flag "gradients on everything" or "purple-to-blue defaults." Toolskin's intentional gradients (chip strip edge-fade, surface superposition) are documented in @taxonomy_chips_strip and per Rule 4 (surface superposition). Filter these from slop detection.
- **Dark mode dimension:** ECC scores "complete dark mode." Toolskin's dark/light mode is automatically derived via apcach + OKLCH math, not hand-coded twice. ECC may not recognize this pattern. apcach output = ALWAYS complete by construction.

═══════════════════════════════════════════════════════════════════════
IN-HOUSE SKILL UPDATE TODO — EXTENDED
═══════════════════════════════════════════════════════════════════════

Add to `docs/handoffs/_in-house-skills-update-todo.md` (the file created in B.9.3):

```markdown
## design-tokens (in-house) — apcach migration

- [ ] Reference apcach as the canonical color substrate at the top of SKILL.md
- [ ] Update token-rules.md color section to defer to apcach-derived values
- [ ] Add Rule 15 verbatim with hard mandate
- [ ] Document the build-time + optional-runtime architecture
- [ ] List which `--ts-bg-*`, `--ts-accent-*`, `--ts-this-*` tokens are apcach-derived
- [ ] Add APCA contrast targets per token pair
- [ ] Add reference to `tools/color-engine/` build script

## expert-designer (in-house) — apcach awareness

- [ ] Update toolskin.md reference with apcach as color authority
- [ ] In design-theory.md color section, note that Toolskin uses APCA over WCAG
- [ ] Cross-reference apcach API in css-and-systems.md
- [ ] Remove or annotate any guidance that proposes hex picks or generic palettes

## typography-master (in-house) — color/typography pairing via apcach

- [ ] Note that text-on-background contrast comes from apcach, not manual
- [ ] Font color recommendations defer to `--ts-this-color-*` derivative tokens
```

═══════════════════════════════════════════════════════════════════════
COMMIT MESSAGE — UPDATED PHASE F COMMIT
═══════════════════════════════════════════════════════════════════════

Update the Phase F commit message to include:

```
RULE 15 ESTABLISHED — SMART COLOR SYSTEM (apcach)
The Toolskin color system is built on apcach (antiflasher/apcach,
MIT, Evil Martians). Every accent hue, every surface depth, every
text-on-background pair is mathematically guaranteed to meet APCA
contrast at every derivation step. This is the holy grail
differentiator — a CSS framework where any accent input produces
a complete contrast-verified design system in one operation.

apcach runs at two layers:
- Build-time at tools/color-engine/ — generates canonical OKLCH
  primitives, baked into assets/css/next/primitives/colors.css
- Optional runtime via toolskin.js — recomputes derivative chain
  when consumer selects new accent (white-label, AI-generated palette)

NON-NEGOTIABLE: every color rule derives from apcach output. No
manual hex. No generic palettes. No skill (external or internal)
overrides apcach. This is Rule 15 in CONVERSATION RULES and
the supreme color authority in the toolskin-architecture skill.
```

═══════════════════════════════════════════════════════════════════════
WHAT THIS CHANGES ABOUT WAVE 1 (Block Typology Engineering)
═══════════════════════════════════════════════════════════════════════

T1 (Block Typology Architect) brief gets ONE addition:

> Every block type definition includes a "color contract" field stating: this block type consumes `--ts-this-color-*` and `--ts-this-bg-*` derivative tokens, which trace back to apcach-derived primitives. The block never declares its own raw color values.

T2 (Reusable HTML Base Designer) brief gets ONE addition:

> The reusable `sandbox/_base.html` loads `assets/css/next/primitives/colors.css` (apcach-derived) and `assets/css/next/system/*.css` (derivative chain) BEFORE any block CSS. The parity-rig reference iframe loads `../toolskin-showcase/assets/css/toolskin.css` (the old hand-tuned system) for visual comparison only.

T3 (Adaptive Integration Architect) brief gets ONE addition:

> The drop-in compatibility verification (Rule 5 — give to anybody, WordPress, AI, etc.) MUST demonstrate apcach's role: when the consumer's framework provides only a brand hue, Toolskin uses apcach to generate the complete contrast-verified system from that single input. This is the "smart color system absorbing any convention" verification.

═══════════════════════════════════════════════════════════════════════
EXECUTION ORDER (unchanged, with Rule 15 layered in)
═══════════════════════════════════════════════════════════════════════

1. B.3 verification (9 ECC skills landed)
2. B.6 editor format-on-save
3. B.8 yogirk council decision
4. B.9 in-house skill migration + update todo (now includes apcach migration items)
5. B.11 updated summary
6. HALT at extended Gate 2
7. Phase C queues docs (Rule 15 in conversation rules)
8. Phase D Wave 1 dispatch (T1/T2/T3 briefs include Rule 15 color contract)
9. Phase D Wave 2 dispatch (S1/S2 briefs include Rule 15 hard mandate)
10. Phase E builds skill (Rule 15 verbatim in SKILL.md, dedicated section)
11. Phase F commits (commit message includes apcach establishment)

═══════════════════════════════════════════════════════════════════════
REMINDER BINDINGS
═══════════════════════════════════════════════════════════════════════

- 14 CONVERSATION RULES + Rule 15 in effect
- Never modify any file in ../toolskin-showcase/
- Rule 15 is NON-OVERRIDABLE for color matters
- Halt on anomaly

Continue with B.3 verification.
