# Expert Designer · v7 — Integration Handoff

> **For agents / teammates picking up this pack.**
> Read this once. Then operate from `SKILL.md` and `README.md`.

---

## What this is (90 seconds)

A self-contained, portable, system-enforcing **design intelligence layer**
for Toolskin. Drops into any project. Activates first for any visual task.
Refuses to improvise — assembles only from approved patterns.

```
expert-designer/                ← drop this folder anywhere
├── SKILL.md                    AUTHORITATIVE entry point (priority 100, design-only)
├── ANTI-DEFAULT-PROTOCOL.md    Forcing function — prevents centered-stack slop
├── README.md                   File tree + portability contract
├── HANDOFF.md                  This file
├── Expert Designer Pack.html   Single-file viewer (open in any browser)
├── showcase.html               Live themeable demo
├── references/                 (6) — lookup, ≤ 2 per task
├── starters/                   (6) — approved patterns, FILL their SLOT markers
├── scripts/                    (5) — audit-boring, audit-design, generators
└── templates/                  (2) — tokens.css + seed-page.html
```

---

## v7 changes from v6 (what's new)

### A. The skill is now AUTHORITATIVE design-only
- `priority: 100` in the frontmatter — this skill activates FIRST for any
  design / visual / layout / styling task.
- DOES NOT build, code, refactor. Hands off to other skills for implementation.
- REFUSES to improvise. Will escalate if no approved pattern fits.

### B. Mandatory flow with two-gate verification
```
0. Read ANTI-DEFAULT-PROTOCOL.md (every time)
1. Classify task → pick starter (one of six)
2. Write 6-line manifesto BEFORE any HTML
3. Fill starter SLOT markers with real content (do NOT redesign)
4. Run `node scripts/audit-boring.mjs <file>`    — exits 1 on slop
5. Run `node scripts/audit-design.mjs <file>`    — exits 1 on rule violations
6. Manual checklist. Ship.
```

### C. Self-contained portability
- All internal paths are **relative** within the folder
- Move `expert-designer/` to any location, every internal link still works
- Only external dependencies are public CDNs (fonts, FontAwesome, Pack viewer libs)
- Nothing depends on project-root path
- `Expert Designer Pack.html` now lives INSIDE `expert-designer/` (not at project root)

### D. Pack iframe containment
- iframe-rendered previews are `sandbox="allow-scripts"` — no top-nav, no popups,
  no form submit, no same-origin escape
- Anchor clicks inside previews are intercepted (preventDefault)
- Stylesheets referenced by the previewed file are **inlined into the srcdoc**
  so paths resolve correctly within the sandbox

### E. Structural rule
- NO HTML files at project root. Everything modular under `expert-designer/`.
- Folder is a complete design pack, not a loose collection.

### F. The boring-detector (`audit-boring.mjs`)
New script that rejects rule-compliant slop. Hard failures (exit 1):
- No asymmetric grid anywhere (`5fr 7fr` or similar)
- No multi-column grid (12-col bento or `auto-fit ≥ 280px`)
- Every section centered
- No varied grid-column spans (bento must have ≥3 distinct spans)
- No oversized element (no font-size ≥ 56px or ≥ 6vw)
- Only one background surface used
- Fewer than 3 unique padding values

Conviction score 0–100. < 60 → restart with a different starter.

### G. The starter library — six approved patterns
| Starter | Use when | Marketing? | Editorial? |
|---|---|---|---|
| `01-centered-hero.html` | Single dev-tool launch | ✓ | — |
| `02-magazine-split.html` | Publication / long-form | — | ✓ |
| `03-asymmetric-hero.html` ★ | **Marketing default** | ✓ | — |
| `04-oversized-type.html` | Brutalist / poster | ✓ | ✓ |
| `05-bento-landing.html` ★ | **Product default** | ✓ | — |
| `06-magazine-toc.html` | Portfolio / index | — | ✓ |

Every starter renders as a complete demo when opened raw. The agent's job
is **fill the SLOTs**, not redesign the layout.

### H. The `.ts-icon` system (Font Awesome compatible)
Added to `templates/tokens.css`. Wrapper sized independently from glyph.
Variants: `--accent`, `--solid`, `--ghost`, `--muted`, `--success`, `--danger`,
sizes xs/sm/md/lg/xl.
```html
<span class="ts-icon ts-icon--md ts-icon--accent">
  <i class="fa-solid fa-bolt"></i>
</span>
```

### I. Surface containment law (Satoshi's rule)
Surfaces apply to:
- Cards (padding + radius + border), OR
- Full-width sections (edge-to-edge)

NEVER to contained sections. A contained section with bg-1 reads as a
"floating colored square" inside the body. Make it full-bleed + inner container.

### J. Auto-harmony section pattern (`.ts-flow`)
`<main class="ts-flow">` — direct child `<section>`s alternate body / bg-1
surfaces automatically via `:nth-of-type`, with a hairline border between
adjacent sections. No manual surface assignment per-section needed.

---

## Path integrity audit

```bash
# From the project root:
grep -rn 'href="/\|src="/\|url(/' expert-designer/   # should find NOTHING
grep -rn '/expert-designer/'      expert-designer/   # should find NOTHING
```

Everything in this folder uses **relative paths** (`../templates/tokens.css`
from `starters/*.html`, `templates/tokens.css` from `showcase.html`, etc.).
The only example absolute path is in a documentation code snippet
(`references/06-component-recipes.md`'s nav example) — that's intentional doc.

---

## How another agent operates this pack

### To consume the skill (typical task)
```bash
# 1. Read the skill
cat expert-designer/SKILL.md
cat expert-designer/ANTI-DEFAULT-PROTOCOL.md

# 2. Pick a starter, copy it as your work file
cp expert-designer/starters/03-asymmetric-hero.html my-page.html

# 3. Fill the SLOT markers with real content
$EDITOR my-page.html

# 4. Audit BOTH gates
node expert-designer/scripts/audit-boring.mjs my-page.html
node expert-designer/scripts/audit-design.mjs my-page.html

# 5. If both pass: ship.
#    If either fails: re-read the error, fix, re-audit.
#    If audit-boring keeps failing: pick a different starter.
```

### To review someone else's design
```bash
node expert-designer/scripts/audit-boring.mjs their-page.html
node expert-designer/scripts/audit-design.mjs their-page.html
```

If both exit 0, the design respects the system. Manual checklist in SKILL.md §9.

### To extend the system (new starter)
1. Owner approval required.
2. New starter goes in `expert-designer/starters/NN-name.html`.
3. Update `SKILL.md` §2 task classifier table.
4. Update `audit-boring.mjs` if the new starter introduces a layout primitive
   the linter doesn't yet know about.
5. Update `README.md` file tree.

---

## Alignment with Toolskin Session 3.x rulings (still active from v6 handoff)

These were flagged in v6's HANDOFF and remain unresolved at the skill level.
The skill v7 left them intentionally so an integration agent can apply them
when the Session 3.x refactor lands its constants:

### RULING 3 — base font size
- `templates/tokens.css` currently anchors at `--ts-fs-base: 16px`
- If your project ruled 13px, regenerate the ladder values
- Update `SKILL.md` §5.2 and `references/02-typography.md`

### RULING 5 — spacing stops at sp-16
- `templates/tokens.css` currently has sp-20/24/32
- If your project caps at sp-16, drop those tokens
- Update `SKILL.md` §5.3 and `references/03-layout-and-spacing.md`

### RULING 7 — apcach constants in `generate-colors.js`
- Re-copy from `tools/color-engine/generate-colors.js` when Session 3.x
  updates the apcach Lc / culori ΔL constants
- The skill points users at `scripts/generate-colors.js`, so it inherits
  whatever's there

These are reconciliation tasks, not blockers — the skill works as-is and
the rulings are mechanical text edits when applied.

---

## What v7 explicitly does NOT cover

So you know where to escalate or invoke a different skill:

- **Framework integration** (React, Vue, Svelte, Astro) — implementation skill
- **Animation beyond CSS transitions** — animation skill
- **Backend / data fetching / state management** — out of scope
- **Real content writing past placeholder SLOTs** — content skill
- **Accessibility audits beyond `:focus-visible`** — a11y skill
- **WordPress/Enfold theme code** — only the token bridge is documented
  (`references/01-foundation.md` §7); shortcode/PHP belongs in a WP skill

---

## Quick verify the pack is healthy

```bash
bash expert-designer/scripts/health-check.sh
```

Should report all files present + no `!important` declarations in skill CSS.

---

## The one-file deliverable

`expert-designer/Expert Designer Pack.html` — single HTML file embedding
every source. Open in any browser. Browse, copy individual files, download
the whole pack as zip with one click. Self-contained: needs no install, no
server, no project-root path.

Hand this file to:
- Designers reviewing the system
- Stakeholders needing a self-contained snapshot
- Other agents that need offline access to the pack

---

## Done

Skill is v7. Self-contained. Portable. Two audit gates. Six approved patterns.
Authoritative for any design task.

If something breaks: run `bash scripts/health-check.sh` first. Then re-read
`SKILL.md` §11 (escalation criteria). Then ping the owner.
