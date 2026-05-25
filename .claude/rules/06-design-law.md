---
paths:
  - "**/*.html"
  - "**/*.css"
  - "sandbox/**"
  - "expert-designer/**"
---
# Design Law — Expert Designer v7

**Loads when working on any HTML/CSS file. The design authority, priority 100.**
**Compliance or rejection. No self-approval. No "this looks fine."**

## Mandatory flow for ANY visual / UI / layout / component / page task

1. `cat expert-designer/SKILL.md`
2. `cat expert-designer/ANTI-DEFAULT-PROTOCOL.md`
3. Classify the task → pick ONE starter from `expert-designer/starters/`
4. Write the 6-line manifesto (SKILL.md §4) BEFORE any HTML
5. Copy the starter, fill its SLOT markers — DO NOT redesign the layout
6. `node expert-designer/scripts/audit-boring.mjs <file>`
7. `node expert-designer/scripts/audit-design.mjs <file>`
8. Both must exit 0 before declaring done.

If audit-boring rejects: pick a different starter, restart.
Do not invent layouts. Do not center-stack. Do not improvise outside
the six approved patterns.

## The 6-line manifesto (required before any HTML)
```
Pattern:              starters/<filename>.html
The ONE move:         <the asymmetry / oversized / unusual choice>
What I will NOT do:   <the boring default explicitly rejected>
Reader's eye pivots at: <element 1>, <element 2>
Container variation:  hero=<xl/lg/md>, section-A=<...>, section-B=<...>
Background variation:  section-A=bg-body, section-B=bg-1, section-C=accent
```
The manifesto goes in the commit message for any HTML change.

## The six starters
- 01-centered-hero — DEV only, single message
- 02-magazine-split — editorial / publication
- 03-asymmetric-hero — MARKETING default
- 04-oversized-type — poster / brutalist / statement
- 05-bento-landing — PRODUCT default
- 06-magazine-toc — lists / indices / portfolio

## Branch convention
- design/<feature> — Claude Design produces HTML (must pass both audits)
- feat/<feature> — Claude Code translates HTML → tokens + components,
  NEVER redesigns. The HTML artifact IS the spec. Escalate if it doesn't
  translate cleanly; do not improvise.
Design merges into feat/* via PR.

## This repo's token source (Architect ruling)
Components load the rebuild's primitives/colors.css + system/*.css.
NEVER load expert-designer/templates/tokens.css (it uses HSL + srgb,
violating R1/R7). The rebuild wins.

## Design wins over code conflicts
If a token-architecture concern opposes a design view, fix the
architecture to match the design intent — not the reverse.
The design skill is the LAW, not a tool.
