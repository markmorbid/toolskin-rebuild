# EXECUTION DIRECTIVE — Expert Designer v6 Integration
**Mode: EXECUTION. No deliberation. No partials. Working code only.**
**Design is approved. Align to it. Do not reinterpret it.**

---

## ORIENTATION

HEAD: `dd72cf2`. Working tree clean.
Expert designer folder is on disk: `expert-designer/`
Showcase screenshot confirmed — visual output is strong and approved.
This directive supersedes all pending Step 2/3 work.
Integration is now the critical path.

---

## TASK 1 — Phase A alignment (30 min, mechanical)

Read `expert-designer/HANDOFF.md` first. Then apply:

**1a. tokens.css**
```
--ts-fs-base: 16px  →  13px
Remove: --ts-sp-20, --ts-sp-24, --ts-sp-32
```

**1b. SKILL.md**
- §3.2 type ladder: re-anchor to 13px base
  Steps: -2=9.03 -1=10.83 0=13 1=15.6 2=18.72 3=22.46 4=26.95 5=32.34 6=38.81 7=46.57 8=55.89 9=67.06
- §3.3 spacing: drop sp-20/24/32 rows

**1c. references/02-typography.md**
- Re-anchor all values to 13px base
- §9 anti-patterns: "caption floor is 13px" → "13px IS body, not a floor"

**1d. references/03-layout-and-spacing.md**
- Drop sp-20/24/32. Fluid clamp() tokens stay (not on the sp-scale).

**1e. references/04-cards-and-containers.md**
- Any recipe using sp-20+: rewrite to --ts-section-pad or fluid clamp()

**1f. references/06-component-recipes.md**
- Add to §10 component cohesion checklist:
  "[ ] Re-anchor first, consume second. (RULING 9 — two-line idiom:
       set --ts-this-bg: var(--ts-bg-N) BEFORE consuming any derivative)"

**1g. scripts/audit-design.mjs**
- Update LADDER_PX array: base 13px × 1.200 ratio
  [9.03, 10.83, 13, 15.6, 18.72, 22.46, 26.95, 32.34, 38.81, 46.57, 55.89, 67.06]
- Update SP array: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64]
  (sp-16 = 64px is the ceiling — remove 80, 96, 128)

**1h. .impeccable.md** (repo root)
Append:
```
- expert-designer/showcase.html may load up to 3 fonts (Space Grotesk +
  JetBrains Mono + Instrument Serif) for typographic demonstration.
  Production pages stay at 2.
```

**1i. Sync generate-colors.js**
```
cp tools/color-engine/generate-colors.js expert-designer/scripts/generate-colors.js
```

**1j. Wire audit-design.mjs into pre-commit hook**
Add to `.claude/hooks/pre-commit.sh` after existing checks:
```bash
# Design audit gate
if command -v node &> /dev/null; then
  for html_file in sandbox/**/*.html assets/**/*.html; do
    [ -f "$html_file" ] || continue
    node expert-designer/scripts/audit-design.mjs "$html_file"
    if [ $? -ne 0 ]; then
      echo "Design audit FAILED: $html_file"
      exit 1
    fi
  done
fi
```

**1k. Add to CLAUDE.md**
Add section:
```
## Design Protocol
For any visual task: start at expert-designer/SKILL.md
Design audit: node expert-designer/scripts/audit-design.mjs <file.html>
Design wins over code conflicts. If Architect and Design Skeptic disagree:
fix the architecture to match the design intent.
```

**1l. Copy expert-designer/SKILL.md to .claude/skills/expert-designer/**
```
mkdir -p .claude/skills/expert-designer
cp expert-designer/SKILL.md .claude/skills/expert-designer/SKILL.md
```

Commit Phase A:
```
git add expert-designer/ .impeccable.md .claude/ CLAUDE.md
git commit -m "chore(skill): expert-designer v6 — Phase A alignment + pipeline wiring

RULING 3/5/9 alignment: 13px base, sp-16 ceiling, two-line idiom.
audit-design.mjs wired into pre-commit hook.
SKILL.md promoted to .claude/skills/. CLAUDE.md updated."
```

Report: hash. Then TASK 2.

---

## TASK 2 — Map showcase to system architecture

Read: `expert-designer/showcase.html`
Read: `assets/css/next/system/surfaces.css`
Read: `assets/css/next/primitives/colors.css`

The showcase is the approved visual target.
Map it to the system:

**2a. Token mapping**
For every color/spacing/type value in showcase.html:
- Find the equivalent `--ts-*` token
- Document mismatches in `docs/handoffs/_expert-designer-token-map.md`
- Format: `showcase value → --ts-* token → match/gap`

**2b. Structure mapping**
For every component in showcase.html:
- Map to existing `.ts-*` class or flag as new component needed
- Document in same file

**2c. Gap list**
Any showcase element that has no system token yet:
- List it as a Session 3.x or Session 4 deliverable
- Flag the minimum system additions needed

Do NOT rewrite the showcase. Do NOT modify it.
Map only. Output goes to `docs/handoffs/_expert-designer-token-map.md`.

Commit:
```
git commit -m "docs(design): expert-designer token map — showcase → system"
```

Report: hash + gap count. Then TASK 3.

---

## TASK 3 — Integrate showcase into sandbox pipeline

**3a. Create sandbox/00-design-reference/index.html**

This is the design reference sandbox. It:
- Loads real system files (colors.css + surfaces.css + any available system/*.css)
- Embeds the expert-designer showcase as an iframe OR reproduces its key sections
  using ONLY --ts-* tokens (no inline hex)
- Shows side-by-side: showcase original vs system-token version
- Has a toggle: "Original / Tokenized"
- Runs audit-design.mjs clean (no HARD failures)

Purpose: this is the permanent visual target the council uses for every gate.
Not a demo. Not documentation. The reference that every future sandbox is measured against.

**3b. Run design audit on the reference sandbox**
```
node expert-designer/scripts/audit-design.mjs sandbox/00-design-reference/index.html
```
Report the score. Fix any HARD failures before committing.

**3c. Run Playwright captures**
Save to: `docs/handoffs/_visual-audit/sandbox/00-design-reference/`

Commit:
```
git commit -m "feat(sandbox): design reference — showcase tokenized + audit clean"
```

Report: hash + audit score + capture paths. Then TASK 4.

---

## TASK 4 — Council: design integration audit

After Tasks 1-3 are committed, run ECC council (4 parallel fresh-context sub-agents):

Each voice loads:
- `expert-designer/SKILL.md`
- `expert-designer/HANDOFF.md`
- `docs/handoffs/_expert-designer-token-map.md`
- `sandbox/00-design-reference/` Playwright captures
- `.claude/skills/toolskin-architecture/SKILL.md`
- `.claude/skills/toolskin-visual-audit/SKILL.md`

Council question:
"The expert-designer v6 skill has been integrated. The showcase represents
the approved visual target. Review the token map and reference sandbox.
Is the visual output aligned with Toolskin's identity? What gaps in the
system layer must be resolved before Session 4 block work begins?
Design wins — proposals must be concrete implementations, not analysis."

Council output must include:
- PASS/FAIL on visual identity alignment
- Concrete list of system gaps (token name + what it needs to do)
- Priority order: what must ship before Session 4 vs what can follow

Write council output to: `docs/handoffs/_design-integration-council.md`
Commit it. Report hash.

---

## TASK 5 — Resume Step 2 (RULING 7 engine) using correct source

After council clears, resume the blocked Step 2.

Correct ΔL measurement source (NOT ts-surface.css):
```
docs/references/toolskin.css_extracted-core-blocks-to-refactor/root-tokens-blocks-reference.css
```

Grep for:
```
grep -n "color-mix\|--ts-this-bg-dark\|--ts-this-bg-bright\|--ts-this-bg-dim\|--ts-this-bg-active" \
  "docs/references/toolskin.css_extracted-core-blocks-to-refactor/root-tokens-blocks-reference.css"
```

Measure ΔL. Update generate-colors.js. Regenerate colors.css.
Replace % literals in surfaces.css with engine-baked tokens.

Commit: `feat(engine): RULING 7 — apcach-bake surface constants`
Report: hash + measured ΔL values.

---

## HARD BLOCKERS — stop and report

- showcase.html cannot load in Playwright (path error)
- audit-design.mjs exits 1 on the reference sandbox with unfixable HARD failures
- Token map reveals a system gap that breaks the surface superposition model
- Council gives NO-GO on visual alignment

## SUCCESS CRITERIA FOR THIS DIRECTIVE

- [ ] expert-designer/ aligned with RULINGs 3/5/9
- [ ] audit-design.mjs wired into pre-commit hook
- [ ] Token map complete (showcase → system)
- [ ] Reference sandbox passes audit (score ≥ 70, zero HARD failures)
- [ ] Council PASS on visual identity
- [ ] RULING 7 engine complete (Step 2 unblocked)

Only after all 6 are checked: proceed to Step 3 (nesting.css).
