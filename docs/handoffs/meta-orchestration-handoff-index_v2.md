# Toolskin Rebuild — Meta-Orchestration Handoff Index v2
**Entry point for new meta-orchestration chat.**
**Search index for originating chats via `conversation_search`.**

**Last commit:** `9291d08` — session artifacts + reference repo restructure (126 files)
**Previous meta-orchestration chat:** search `"TOOLSKIN Design System v1.0.0 rebuild orchestration"` → title "Gerald :)"
**This chat:** search `"Gerald 2.0 process self-correction directive"` → title "Gerald :)"

---

## HOW TO USE

When owner asks about any past decision, search first:
```
conversation_search(query="<search terms below>")
```

---

## RULINGS INDEX

| # | Ruling | Search query |
|---|---|---|
| R1 | Surfaces = 10 presets, not apcach-derived | `"surfaces presets apcach option A reframe"` |
| R2 | colors.css bakes one default + variant classes | `"colors.css bakes preset variant classes"` |
| R3 | Base font = 13px | `"RULING 3 13px confirmed toolskin.css 287"` |
| R4 | --ts-on-accent threshold = 0.75 | `"on-accent threshold 0.75 0.65 code wins"` |
| R5 | Spacing stops at --ts-sp-16 | `"spacing sp-16 drop 17 24 critical error"` |
| R6 | No second CSS audit pass needed | `"second CSS audit pass incomplete section"` |
| R7 | apcach is the constant engine for system layer | `"RULING 7 apcach constant engine system layer"` |
| R8 | Session 3.x mandatory before Session 4 | `"RULING 8 session 3.x mandatory before session 4"` |
| R9 | Pattern 4 two-line idiom — re-anchor first | `"RULING 9 re-anchor first consume second two-line"` |
| R10 | Pattern 2 — carry knob, drop literal | `"RULING 10 iconlist carry knob drop literal"` |
| R11 | Pre-emptive derivative extension in Session 3.x | `"RULING 11 pre-emptive derivative extension"` |

### RULING 7 constant table (approved)
```
border-rest Lc 15 · border-hover Lc 30 · border-active Lc 30
border-0 Lc 8 · border-disabled Lc 8 · border-focus = accent
dark Lc 8 · bright Lc 6 · hover-surface Lc 12
active Lc 8 · disabled Lc 18 · text Lc 75/45/25
border-dim = ratio of border-rest (Engine-Anchored Derivation)
grad-angle = geometry-exempt
Pattern-16 Option B: engine bakes constants, CSS composes.
APCA loClip finding: sub-floor constants (dark/bright/active)
use culori OKLCH ΔL, not APCA. Measure from ts-surface.css.
```

---

## SESSION STATUS

| Session | Status | Key commits |
|---|---|---|
| S1 | ✅ Complete | fa4cf0a, a9efd26 |
| S1.5 | ✅ Complete | aa024de, 5d2b7cf |
| S2 | ✅ Complete | 4958c87 + 5 more — primitives layer |
| S2 sweep | ✅ Complete | 114f0e7 — RULING 3 clean |
| S2 closeout | ✅ Complete | 4364d09 |
| S3 partial | ✅ Complete | ec357b7 — chunks 1-3 catalog |
| S3-S4 | ✅ Complete | 9291d08 — 126 files, council artifact, reference repo |
| **S3.x** | ⏳ **NEXT** | system extension pass |

---

## BEHAVIORAL CORRECTIONS (Gerald 2.0 — this chat)

Search: `"Gerald 2.0 process self-correction directive"`

Key corrections locked in this chat:
1. Every session must produce at least one HTML file openable in Chrome
2. Sandbox HTML paired atomically with every CSS file
3. Council runs at every major gate — dispatched, not self-executed
4. Multiple agents — Code Desktop writes, Visual Audit audits, Council deliberates
5. Engineering from old codebase (catalog + visual audit), not from specs
6. Output must look like Toolskin, not a generic design system
7. Before responding to any file reference — READ THE FILE FIRST
8. Surface decisions to owner in one-sentence format: problem / recommendation / why / YES-NO
9. Agent halts only on genuine blockers — not after every commit

---

## ARCHITECTURAL DECISIONS

### Council-verified canonical patterns (from extracted-blocks catalog council)
Search: `"inputs-global-nested-design-pattern iconlist featlist LAYER-1 LAYER-2"`

| Pattern | What it is | Where |
|---|---|---|
| Pattern 1 | inputs-global-nested — canonical Rule 4 reference, 4-layer hierarchy | inputs-global-nested-design-pattern.css |
| Pattern 2 | iconlist+featlist — LAYER-1/LAYER-2 molecular template (carry knob, drop literal) | iconlist+featlist-allvariants-component.css |
| Pattern 3 | §6d nest-reduction — system/nesting.css, travels as 3-file unit, @property explainer verbatim | ts-panel+root-debugger-component.css L25-93 |
| Pattern 4 | Two-line idiom — re-anchor first, consume second, 22 occurrences in ts-ui-ide-view | ts-ui-ide-view-fullview.css |

### APCA loClip finding
Search: `"APCA loClip 0.1 sub-floor constants dual-metric"`
Sub-Lc-10 surface depth constants unreachable by APCA. Option B approved: APCA for Lc ≥ 12, culori OKLCH ΔL for sub-floor. Measure from ts-surface.css (extracted blocks) — NOT raw toolskin.css.

### Pattern-16 Option B
Search: `"Pattern-16 Option B engine bakes constants CSS composes"`
generate-colors.js bakes constants per preset. CSS composes. Path-A opt-in for arbitrary runtime surfaces.

---

## OPEN ITEMS — Session 3.x must complete before Session 4

| Item | Status |
|---|---|
| Agent A ΔL measurement from ts-surface.css | ⏳ Not yet dispatched |
| generate-colors.js updated with apcach + ΔL constants | ⏳ Blocked on ΔL measurement |
| surfaces.css regenerated from engine output | ⏳ Blocked on generate-colors.js |
| surfaces.css extended: dim-5/6, grad-2/3/4 | ⏳ Session 3.x |
| system/nesting.css | ⏳ Session 3.x — @property explainer verbatim |
| system/text.css | ⏳ Session 3.x |
| system/accent.css | ⏳ Session 3.x |
| RULINGs 8-11 encoded in memory files | ⏳ Not yet committed |
| Council output committed | ⏳ 9291d08 includes artifact but RULINGs not in memory |

---

## REFERENCE LIBRARY

Full reference library versioned at:
```
docs/references/
```
Key files:
- `toolskin.css_toolskin-showcase[latest_cannonical_reference].css` — canonical CSS (~32k lines)
- `toolskin.css_extracted-core-blocks-to-refactor/` — owner-segmented blocks (USE THESE, not raw)
- `toolskin-references-directory-treemap.md` — 162-file orientation map
- `surface-presets-catalog.json` — all 10 presets

---

## SESSION 3.x DIRECTIVE

The new meta-orchestration chat's first job after orientation:
issue the Session 3.x autonomous directive.

Session 3.x deliverables (single autonomous agent run):
1. Encode RULINGs 8-11 in memory files + commit
2. Agent A: measure ΔL from ts-surface.css, update generate-colors.js, regenerate surfaces.css
3. Build system/nesting.css (Pattern 3, @property explainer verbatim)
4. Build system/text.css (--ts-on-surface, Lc 75/45/25)
5. Build system/accent.css (apcach-derived accent derivatives)
6. Extend surfaces.css (dim-5/6, grad-2/3/4, RULING 7 constants re-grounded)
7. Sandbox HTML for each new system file (atomic pairing rule)
8. Council gate on all visual outputs
9. Commit all

Halt only on: genuine architectural ambiguity, council NO-GO, hard blocker.
NOT on: individual file completion, individual commits.

---

## PROCESS PERFORMANCE NOTES

Current bottleneck: coordination overhead in meta-orchestration chat.
Fix for Session 3.x: single autonomous directive, one agent run,
council at end, report back here only on blockers or completion.
Skills invoked in dispatches but not verified as actually running —
Step 0 skill health check must be first action of every new session.
