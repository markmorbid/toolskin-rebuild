# TypeUI Skills Audit — Toolskin Capability Assessment

**Source:** `bergside/awesome-design-skills` (registry) + `bergside/typeui` (CLI), pulled via raw GitHub on 2026-05-10
**Scope:** 67 skill folders (134 markdown files: SKILL.md + DESIGN.md), 66 preview PNGs (doodle has no preview)
**Bottom line:** **The previews are stunning. The skill files are not.** Your suspicion was correct.

---

## 1. The format in one paragraph

Each "skill" is a folder with two markdown files. `SKILL.md` is the LLM-facing prompt scaffold (frontmatter + ~83 lines of guidance). `DESIGN.md` is human-facing — YAML frontmatter with structured tokens (colors, typography, spacing) plus a short prose overview. The CLI (`npx typeui.sh pull <slug>`) just downloads these two files into your project so an agent can read them.

**There is no CSS, no HTML, no component code, no JS, no framework asset, no Tailwind config, no shadcn override, no anything implementational.** The skill is purely instruction text + token values, designed to be read by an LLM that does the actual building from its training data.

---

## 2. The boilerplate problem (quantified)

I diffed every SKILL.md against the `paper` baseline:

| Metric | Value |
|---|---|
| Mean uniqueness across 66 files vs paper | **11.9%** |
| Median uniqueness | 11.1% |
| Most-unique file (`energetic`) | 18.0% |
| Least-unique files (`elegant`, `shadcn`, `simple`) | 8.4% |
| Average SKILL.md length | 84.9 lines |
| Average lines that actually differ between any two skills | ~10–18 lines |

**Translation: ~88% of every SKILL.md is identical templated boilerplate.** The differing 12% is:
- `name:` and `description:` in frontmatter
- 1-line "Brand" blurb
- 3 lines under "Style Foundations" (visual style keywords, type scale + fonts, palette tokens with hex values)
- 1 line spacing scale
- Occasional extra do/don't bullets

Everything else — Mission, Accessibility, Writing Tone, Expected Behavior, Guideline Authoring Workflow, Required Output Structure, Component Rule Expectations, Quality Gates, Example Constraint Language — is verbatim duplicated across all 67 files. Including bizarre artifacts like the neumorphism file's brand description being a hijacked "Join the private club where people are building..." marketing line, or glassmorphism's unrelated "fast, reliable communication for individuals, teams, and communities" — clear sign these were bulk-generated and not hand-written.

The DESIGN.md files are tighter and more useful: pure token data in YAML frontmatter (colors, typography, rounded, spacing) plus 10–20 lines of prose. Consistent shape, real data. **DESIGN.md is the salvageable artifact; SKILL.md is mostly noise.**

---

## 3. Where the previews come from (and why it matters)

The visual diversity on typeui.sh (editorial Paper, aggressive Brutalism, sci-fi Cosmic, etc.) is **not in the skills**. It comes from one of:

1. Hand-designed mockups by Bergside, used as marketing assets only
2. AI-generated full pages where the LLM was given the tokens *and* did the heavy lifting from training-data knowledge of "what brutalism looks like"

Either way: pulling the skill into Claude Code and asking it to "build a brutalism landing page" leaves the LLM doing 95% of the work from its own pattern recognition. The skill mostly seeds a few tokens and a name. **A skill this thin won't produce the visual results shown unless the underlying model already knows the style.**

For a small, distinctive, Toolskin-specific component library, this is **wholly insufficient**. It contains zero rules about your surfaces, your derivative engine, your `--ts-this-bg` superposition, your `ts-` class taxonomy, your component anatomies. An agent reading these would generate generic React/Tailwind code with arbitrary colors — exactly what you don't want.

---

## 4. Compatibility audit vs Toolskin

| Concern | TypeUI skills | Toolskin needs | Verdict |
|---|---|---|---|
| Framework coupling | Framework-agnostic, no code | Framework-agnostic CSS/JS | ✅ Match |
| Tailwind/Next/Node assumptions | Implicit only (no hard refs) | Explicitly out of scope | ✅ No conflict |
| Token format | Hex literals + scale strings | `--ts-*` custom properties | 🔧 Convert |
| Token tier system | Single flat layer | Primitive → System → Component | ❌ Missing |
| Surface system | None | 6-level + superposition | ❌ Missing |
| Derivative engine | None | OKLCH + color-mix + harmonics | ❌ Missing |
| Component classes | None | `ts-card`, `ts-button`, etc. | ❌ Missing |
| Accessibility rules | Generic WCAG 2.2 AA | Same baseline | ✅ Same |
| Component anatomy | Generic guidance | Per-component anatomy needed | ❌ Missing |
| State coverage | Generic list | Hover/focus/active/loading defined | ⚠️ Partial |
| License | Unclear (no LICENSE on registry repo); MIT in SKILL frontmatter; EULA on typeui.sh | — | ⚠️ Verify before commercial reuse |

**TL;DR:** The skills don't fight Toolskin (no framework lock-in), but they don't help Toolskin either. The only directly-useful parts are the **per-skill token bundles** in DESIGN.md frontmatter.

---

## 5. What's actually worth keeping

From the 67-skill haul, three things have value:

1. **Token bundles** — color palettes, font pairings, type scales, spacing rhythms across 67 named aesthetics. These are real curatorial decisions (Audiowide for Cosmic, Press Start 2P for Tetris, Limelight for Artistic, Bangers, VT323, etc.). Useful as a **named-style preset library** for Toolskin.
2. **The taxonomy itself** — the 67 names are a decent map of design territory (skeuomorphism, neobrutalism, claymorphism, riso, dithered, sega, pacman, tetris, fiction, storytelling, lingo, levels...). Good vocabulary for a "theme presets" feature.
3. **Visual previews** — the 66 PNGs are a mood board. Useful as **visual references** when designing Toolskin theme presets or showcasing range.

The actual SKILL.md prompt scaffolding has near-zero value for Toolskin since you have a real implementation to point an agent at.

---

## 6. Recommended approach for Toolskin

Don't import these skills as-is. Do this instead:

### Phase A — Mine the data (1 session)
Extract the token bundles from `DESIGN.md` frontmatter into a structured Toolskin format. Output: `toolskin-presets.json` with 67 entries, each containing:
- `slug`, `name`, `description`
- `--ts-accent-h/s/l` derived from the primary hex (OKLCH conversion)
- Suggested `--ts-fs-base`, font stack, type ratio
- `--ts-radius-base` from rounded scale
- `--ts-sp-base` from spacing scale

Already have most of this in `SKILLS_INDEX.csv`. Two hours of OKLCH conversion + harmonic-scale mapping completes it.

### Phase B — Build ONE Toolskin skill that does everything (1 session)
Write a single skill — `toolskin-design-system` — that an agent reads to produce on-brand work. It should contain:
- The actual `--ts-*` token namespace and its three tiers
- The surface system rules (`--ts-this-bg`, superposition, `.ts-section--alt`)
- The derivative engine (auto-OKLCH, harmonic ladder, what to never override)
- The component class taxonomy (`.ts-card`, `.ts-button`, `.ts-modal`, etc. with anatomies)
- The MUST-NEVERs from your CLAUDE.md guardrails (don't break `--ts-` namespace, don't add framework deps, don't edit `mockup/` as canonical)
- A pointer to `assets/css/toolskin.css` as the source of truth
- A pointer to `toolskin-presets.json` as the swappable theme layer

This single Toolskin skill will out-perform all 67 TypeUI skills combined for your use case, because it contains real implementation rules instead of prompt scaffolding.

### Phase C — Theme preset showcase (optional, 1 session)
Build a `toolskin-themes.html` page that loads each of the 67 presets via `Toolskin.applyPreset('cosmic')` and renders the same standard component sampler. This validates the preset library and produces your own version of the typeui.sh visual gallery — but using actual Toolskin code, not generated mockups.

### What NOT to do
- Don't ship 67 separate skill files. The agent only needs one Toolskin skill. Theme variation belongs in a JSON preset file, not in 67 markdown files.
- Don't copy the SKILL.md boilerplate. Your `expert-designer` skill plus a Toolskin-specific implementation skill is a strictly better setup.
- Don't trust the visual previews as ground truth for what the skills produce. They're marketing.

---

## 7. Audit of the typeui CLI repo itself

`bergside/typeui` (MIT-licensed, TypeScript):
- ~10k-line CLI that handles `generate`, `update`, `pull`, `list`, `verify`, `license`, `clear-cache`
- Resolves slugs via a remote `index.json` then fetches markdown from raw GitHub
- Writes to provider-specific paths (Claude Code, Cursor, Codex, Gemini)
- Supports a license-key check for "pro" features (cache state in `~/.typeui-sh`)
- No bundled skill content — it's a thin fetch-and-write tool

**Usable for Toolskin?** The CLI itself isn't worth adopting. You already have `npx skills` workflows in your project setup. But the **provider-path mapping logic** (where each agent expects skills to live: `.claude/skills/`, `.cursor/`, etc.) is worth glancing at if you ever want to ship a Toolskin skill that auto-installs across multiple agent platforms. That's a 200-line port at most.

---

## 8. License posture

- `bergside/typeui` (CLI) — MIT, in `LICENSE.md`
- `bergside/awesome-design-skills` (registry) — **no LICENSE file present**; README explicitly invites pulling skills via `npx typeui.sh pull`. Each SKILL.md file declares `license: MIT` in its own frontmatter.
- `typeui.sh` site footer references an EULA at `/license` and Terms of Service. These likely govern commercial redistribution and the "pro" tier.

For your stated purpose (research + adaptation into your own design system, not redistribution of their files), the MIT declarations in the skill frontmatter make this clean. If you ever ship anything publicly that bundles their text, re-read the EULA first.

---

## 9. Files in this haul

```
typeui-haul/
├── AUDIT.md                       # this file
├── TOOLSKIN_ADAPTATION_PLAN.md    # next-steps spec
├── SKILLS_INDEX.csv               # 67 rows × 13 cols of structured token data
├── skills_index.json              # same data, JSON form, for programmatic use
├── skills/                        # 67 folders, each with SKILL.md + DESIGN.md
│   ├── agentic/{SKILL.md,DESIGN.md}
│   ├── ant/...
│   └── (65 more)
└── previews/                      # 66 PNGs (doodle missing upstream)
    ├── paper.png
    └── ...
```
