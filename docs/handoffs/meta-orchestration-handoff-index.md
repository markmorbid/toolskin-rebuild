# Toolskin Rebuild — Meta-Orchestration Handoff Index

**Purpose:** This file is the entry point for a new Claude.ai chat taking over meta-orchestration
of the Toolskin Rebuild project. It is NOT a complete record — it is a search index. Use the
`conversation_search` tool to retrieve full context on any topic listed below.

**This chat ended at:** ~100 message limit, Session 2 complete, Session 3 pending.
**Active repo:** `toolskin-rebuild` on master (last commit: 498ffba — 15px sweep)
**Reference repo:** `toolskin-showcase` (READ-ONLY FOREVER — Rule 12)

---

## HOW TO USE THIS DOCUMENT

When the owner asks about any topic below, search the conversation database FIRST:

```
conversation_search(query="<search terms listed below>")
```

The originating chat contains the full deliberation, council outputs, owner decisions,
and binding rulings that are not fully encoded in the skill files.

---

## RULINGS INDEX (search these exact terms)

| Ruling | Topic | Search query | Where encoded |
|--------|-------|--------------|---------------|
| RULING 1 | Surfaces = presets, not apcach-derived | `"surfaces presets apcach option A reframe"` | S1 spec §3 amended, synthesis |
| RULING 2 | colors.css bakes one default + variant classes | `"colors.css bakes preset variant classes"` | generate-colors.js |
| RULING 3 | Base font = 13px (not 15px, not 16px) | `"RULING 3 13px confirmed toolskin.css 287"` | typography.css, all skills swept |
| RULING 4 | --ts-on-accent threshold = 0.75 | `"on-accent threshold 0.75 0.65 code wins"` | colors.css |
| RULING 5 | Spacing stops at --ts-sp-16 | `"spacing sp-16 drop 17 24 critical error"` | spacing.css |
| RULING 6 | No second CSS audit pass needed | `"second CSS audit pass incomplete section"` | synthesis |

---

## ARCHITECTURAL DECISIONS INDEX

### Color System
- **apcach HALT and resolution** → search `"apcach surface derivation HALT crToBg dead zone"`
  Full deliberation on why APCA can't step dark surfaces; Option A resolution; Extended Rule 15
  relationship. The most important architectural decision of Session 2.

- **TOOLSKIN_SURFACE_PRESETS canonical status** → search `"TOOLSKIN_SURFACE_PRESETS canonical not legacy"`
  Why the 10 preset palettes are Tier 1 data, not legacy code to discard.

- **Contrast targets 75/45/25** → search `"contrast targets revised 75 45 25 pre-tuner"`
  Why secondary/muted text targets were relaxed; relationship to runtime
  `_toolskinApplyContrastToTokenMap` tension slider.

- **Dual-emission mandate** → search `"dual emission sRGB fallback mandate oklch hex"`
  Every primitive ships #hex fallback + oklch(). Refusal pattern R-D3-dual-emit.

### Font System
- **Space Grotesk 800 weight abandonment** → search `"Space Grotesk 800 weight OQ-B3 abandoned"`
  Why the 800 weight token was dropped; variable-axis font URL not needed.

- **13px vs 15px vs 16px history** → search `"font base 13px 15px wave 1.6 branding preview misleading"`
  Full audit trail. The branding preview used a different context. toolskin.css:287 wins.

### Radius System
- **Explicit ladder vs calc-derived** → search `"radius ladder 4 6 8 10 16 explicit not calc"`
  Why the radius steps are explicit primitives like the Wave 1.6 radius precedent.

### Spacing System
- **sp-17 through sp-24 dropped** → search `"spacing critical implementation error geometric multiplier"`
  In-source REFACTOR NOTE flagged these as broken. Owner confirmed: drop them.

---

## PATTERN INDEX (meta-orchestration patterns)

The rebuild-orchestration skill has 18 patterns. These were developed in the originating
chat and are encoded in `.claude/skills/rebuild-orchestration/SKILL.md`. Search for
full deliberation context:

| Pattern | Search query |
|---------|--------------|
| Pattern 16 — Council HALT on fundamental implications | `"pattern 16 council HALT fundamental implications classify"` |
| Pattern 17 — Visual audit before specs mandatory | `"pattern 17 visual audit before specs browser screenshots"` |
| Pattern 18 — Quota safety protocol | `"pattern 18 quota safety protocol save state halt"` |
| Gate 4.5 procedural correction | `"gate 4.5 council disagreement surface owner never auto-resolve"` |
| Council voice upgrade (Design Skeptic + Design Critic) | `"council voice upgrade design skeptic design critic visual decisions"` |
| 5-tier skill priority hierarchy | `"tier 1 authoritative tier 3 diagnostic ECC design-system"` |

---

## VISUAL AUDIT INDEX

The Wave 1.6 visual audit (124 screenshots, 5 analysts) is the ground truth for
visual design decisions. Key findings:

- **Full audit report** → `docs/handoffs/_rebuild-visual-audit.md` (1510 lines, owner-annotated)
- **3 Gate 5 decisions revised by visual audit** → search `"wave 1.6 visual audit gate 5 revised OQ-A6 OQ-B3 OQ-D1"`
- **Logo system discovery** → search `"logo system 3 candidates bracket blade cascade branding"`
- **FontAwesome silent failure** → search `"fontawesome icon missing toast toolskin-lab version mismatch"`
- **Marquee token leak** → search `"marquee ts-bg-1 direct primitive token leak high"`

---

## CODE AUDIT CATALOG INDEX

The code audit catalog is at `docs/handoffs/_code-audit-catalog.md` (958 lines).
Search for specific findings:

| Topic | Search query |
|-------|--------------|
| Full catalog overview | `"code audit catalog 958 lines ground truth"` |
| TOOLSKIN_SURFACE_PRESETS all 10 presets | `"surface presets catalog dark light practical neutral clean"` |
| ToolskinTheme full API | `"ToolskinTheme class constructor setMode syncTriggers"` |
| _toolskinApplyContrastToTokenMap math | `"applyContrastToTokenMap tension slider colorjs oklch mix"` |
| FA version detection actual behavior | `"font awesome version detection no-op hard pinned 6.7.2"` |
| All 14 CustomEvents | `"customevents ts theme-change ts accent ts ready ts-ui"` |
| --ts-sp-17..24 CRITICAL error | `"spacing sp-17 sp-24 critical implementation error geometric"` |
| __TOOLSKIN_CONFIG__ double declaration | `"TOOLSKIN_CONFIG declared twice index.html second clobbers"` |
| 15 discrepancies full list | `"notable discrepancies observations 15 items"` |

---

## SESSION STATUS INDEX

| Session | Status | Key commits | Search for details |
|---------|--------|-------------|-------------------|
| Session 1 | ✅ Complete | fa4cf0a, a9efd26 | `"session 1 complete gate 5 wave 1.6 phase F commit"` |
| Session 1.5 | ✅ Complete | aa024de, 5d2b7cf | `"session 1.5 housekeeping skills installed npm verified"` |
| Session 2 | ✅ Complete | 4958c87 + 5 more | `"session 2 complete 11 deliverables 30 30 contrast report"` |
| Session 3 | ⏳ Pending | — | `"session 3 system layer ts-this-bg derivative chain _base.html"` |

---

## OPEN ISSUES INDEX (pre-Session 3)

| Issue | Search query | Where |
|-------|--------------|-------|
| Sweep extension still in progress | `"sweep extension 6 more files design-tokens-2.0 probe assertion"` | Agent was executing when this chat ended |
| typography-master skill 13px | `"typography-master 15px 13px update ruling 3"` | May be done in final sweep |
| S3 DNA-pointer column | `"S3 DNA pointer column session 3 startup housekeeping"` | Deferred from Session 1.5 |
| S6 R-DNA-1..6 refusal family | `"R-DNA refusal family wave 1.5 anti-patterns S6"` | Deferred |
| S5 G1 wiring | `"S5 G1 parity criterion visual audit DNA combined ground truth"` | Deferred |
| ToolskinTheme class migration | `"ToolskinTheme class migrate toolskin.js v2 tier 1 deliverable"` | Session N+ |
| Sidebar editor panel rebuild | `"sidebar editor panel ts-oce-panel molecular tier deliverable patches"` | Session N+ |
| Logo system finalization | `"logo system bracket blade cascade 3 candidates finalize"` | Future |

---

## HOW THE DUAL-ENDPOINT WORKS

This document is the bridge. The originating chat (now at 100-message limit) is
searchable via `conversation_search`. The new chat should:

1. Load rebuild-orchestration skill (auto-loads from `.claude/skills/`)
2. Load toolskin-architecture skill (auto-loads)
3. Read `docs/handoffs/` for current session state
4. Use THIS document as a search index when owner asks about past decisions
5. Search the originating chat for full deliberation context

The originating chat title in the database is approximately:
**"TOOLSKIN — Design System v1.0.0"** (starts with the CLAUDE.md content paste)

Search query to find it: `"TOOLSKIN Design System v1.0.0 rebuild orchestration"`

---

## QUICK ORIENTATION FOR NEW CHAT

**What Toolskin is:** Token-driven CSS/HTML/JS design system for WordPress themes, web apps,
UI toolkits. Owner: Satoshi/SatSea. Prefix: `.ts-` (visual), `.tk-` (programmatic), `.ts-ui-*` (UIKit).

**The rebuild philosophy:**
- Zero framework dependencies. One stylesheet. Full dynamic control.
- Token-driven, derivative-math-driven (not class-driven like Tailwind)
- Three-tier: Primitive → System → Component
- apcach (APCA color engine) for contrast verification, NOT surface generation
- Surface presets = 10 hand-curated palettes in TOOLSKIN_SURFACE_PRESETS

**The meta-orchestrator's role (this chat's job):**
- Architectural decisions under ambiguity → bring here
- Council voice upgrades for visual decisions → Design Skeptic + Design Critic
- Gate 4.5 procedural: surface disagreements to owner, never auto-resolve
- Pattern 16: HALT when council surfaces fundamental implications
- Pattern 17: Visual audit before specs (mandatory)
- Pattern 18: Quota safety — save state before any limit cutoff

**The agent's role (Claude Code Desktop):**
- Execution against locked specs
- Cold resume via `.remember/remember.md` + `core-memories.md`
- Pre-commit hook at `tools/governance/pre-commit`
- Halt at owner gates, never auto-resolve architectural questions

**Owner communication style:** Stream-of-consciousness, heavy typos, fragmented phrasing.
Claude produces clean structured professional output from raw inputs.
Owner never reads long prose — tables and checklists only.
