# Expert Designer · Toolskin v7

> **Authoritative design skill** for Toolskin. Self-contained, portable,
> drop-anywhere. Move this folder to any location and everything still works —
> all paths are relative within the folder.

```
expert-designer/
│
├── SKILL.md                     ★ AGENT ENTRY POINT — read first, every time
├── ANTI-DEFAULT-PROTOCOL.md     ★ Forcing function — read before any HTML
├── HANDOFF.md                     Integration handoff for Session 3.x agents
├── README.md                      This file
├── Expert Designer Pack.html      Single-file portable viewer (open in browser)
├── showcase.html                  Live themeable showcase of the system
│
├── references/                    Lookup reference (≤ 2 per task)
│   ├── 01-foundation.md            Color engine, surfaces, APCA, --ts-* contract
│   ├── 02-typography.md            1.200 ladder, fonts, hierarchy
│   ├── 03-layout-and-spacing.md    8pt grid, container budgets, primitives
│   ├── 04-cards-and-containers.md  Ten card recipes
│   ├── 05-awwwards-patterns.md     Ten hero/section patterns
│   └── 06-component-recipes.md     Button, input, badge, nav, footer, modal
│
├── starters/                      Approved patterns — FILL these, don't design
│   ├── 01-centered-hero.html       Single-message dev-tool launch
│   ├── 02-magazine-split.html      Editorial / publication
│   ├── 03-asymmetric-hero.html  ★ Marketing default
│   ├── 04-oversized-type.html      Brutalist / poster
│   ├── 05-bento-landing.html    ★ Product default
│   └── 06-magazine-toc.html        Portfolio / index
│
├── scripts/                       Executable verification tools
│   ├── audit-boring.mjs            Boring detector — exits 1 on slop
│   ├── audit-design.mjs            System linter — exits 1 on rule violations
│   ├── generate-colors.js          Color primitive builder + APCA gate
│   ├── health-check.sh             Skill structure verifier
│   └── scaffold-component.sh       Drops a working recipe into cwd
│
└── templates/                     Drop-in starting points
    ├── tokens.css                   Complete --ts-* contract in cascade layers
    └── seed-page.html               Clean Toolskin starter shell
```

---

## Quick start

For an agent:
```
1. cat expert-designer/SKILL.md
2. cat expert-designer/ANTI-DEFAULT-PROTOCOL.md
3. Pick a starter from expert-designer/starters/
4. Fill the SLOT markers with real content
5. node expert-designer/scripts/audit-boring.mjs <your-file.html>
6. node expert-designer/scripts/audit-design.mjs <your-file.html>
7. Ship.
```

For a human reviewer:
```
Open expert-designer/Expert\ Designer\ Pack.html in any browser.
That single file embeds everything — read SKILL.md, browse references,
view starters in live iframes, download individual files or the whole zip.
No install. No server. Drop anywhere.
```

For a designer comparing the system to existing work:
```
Open expert-designer/showcase.html in any browser.
Live themeable demo — drag the HSL sliders to retheme the whole page,
toggle dark/light, see the type ladder, surface swatches, all card recipes,
the bento composition, and the agent workflow.
```

---

## Portability contract

This folder is **self-contained**. You can move it to any location
(`~/projects/foo/`, `/var/www/`, `C:\dev\`) and every internal link
keeps working because:

- Every CSS reference uses **relative paths** (`templates/tokens.css`,
  `../templates/tokens.css`)
- No path references the project root (`/expert-designer/...`) anywhere
- All fonts/icons load from public CDNs (Google Fonts, Font Awesome)
- The Pack HTML embeds every source file inline — no external file deps

The only externally-resolved URLs are:
- `https://fonts.googleapis.com/...` (typography)
- `https://cdn.jsdelivr.net/npm/@fortawesome/...` (icons)
- `https://unpkg.com/...` (Pack viewer: marked, prismjs, jszip, FileSaver)

If you need an offline-only version, vendor these CDNs into `assets/` and
update the `<link>` / `<script>` href values. Everything else is local.

---

## Activation contract (for other agents)

This skill is `priority: 100, scope: design`. It activates FIRST for any
design / visual / layout / styling task. Other skills (build, code,
animation, content) consume its output.

**The skill does not improvise.** It assembles from approved starters,
fills slots with real content, and runs two audit scripts before declaring
done. If the audits fail, the output is rejected and a different starter
is picked.

The full activation protocol lives in `SKILL.md` §0.

---

## What's enforced

1. **Color** — every `var(--ts-*)`, no hex; APCA verified.
2. **Type** — only the 1.200 ladder steps; no off-ladder pixels.
3. **Space** — only `--ts-sp-*` tokens; padding ≥ gap.
4. **Shape** — radius scales with element height; one knob retunes all.
5. **Composition** — no centered vertical stacks; at least one asymmetric
   grid, one oversized element, varied surfaces, varied padding.
6. **Surfaces** — applied to cards OR full-width sections, never to
   contained sections (Satoshi's law).
7. **Icons** — via the `.ts-icon` wrapper system + Font Awesome.
8. **States** — every `:hover` paired with `:focus-visible`.

Each enforced rule has a mechanical check in one of the two audit scripts.

---

## Files of interest by role

| If you are… | Read |
|---|---|
| A coding agent given a design task | `SKILL.md` → `ANTI-DEFAULT-PROTOCOL.md` → pick a starter |
| A human reviewer auditing the output | `HANDOFF.md` §3 (alignment edits), then run audits |
| A designer evaluating the system | `showcase.html`, then `references/05-awwwards-patterns.md` |
| Someone integrating with WordPress / Enfold | `references/01-foundation.md` §7 (bridge) |
| Someone writing CI / pre-commit hooks | `scripts/audit-*.mjs` (exit codes) |
| Anyone wanting one file to share | `Expert Designer Pack.html` |

---

## License

MIT. Use freely. Attribute Toolskin if you fork the system into a new
design family.
