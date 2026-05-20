# Handoff — Toolskin Rebuild

## State
Session 1.5 housekeeping is fully closed. Three commits this session (all clean — pre-commit hook passed each):
- `5fa1112` — install `toolskin-visual-audit` skill (v1.1)
- `87c6a13` — install `token-validation` skill + archive agent-teams workflow docs + treemap update
- `9452cef` — CLAUDE.md "Module reference library" section

`toolskin-visual-audit` (the last S1.5 blocker) is installed at `.claude/skills/toolskin-visual-audit/SKILL.md`. Source = `docs/references/toolskin-visual-audit-SKILL.md` (the reconciled v1.1 — all 5 Wave 1.6 amendments already baked in). Two install-time changes: YAML frontmatter added (the skill was undiscoverable without it); the `cd "../toolskin-showcase"` in the setup snippet rewritten to `python3 -m http.server --directory` (repo-isolation Rule 12 / reconciliation task 5).

`token-validation` is installed at `.claude/skills/token-validation/SKILL.md` with the OKLCH/apcach REBUILD NOTE prepended. Its `AGENT_CONTEXT.md` was moved to `docs/references/_components-docs/agent-teams/` (it is the agent-teams shared knowledge base, not skill context). The agent-teams folder now holds all 5 reference docs.

## Next — Session 2: primitives implementation
Per `docs/handoffs/_rebuild-primitives-spec.md` (S1 spec):
1. **Prerequisite:** `npm install apcach` inside `tools/color-engine/` (agent owns the install). S1 spec §2 reads the apcach API from `tools/color-engine/node_modules/apcach/`.
2. **Write `tools/color-engine/generate-colors.js`** from scratch — self-contained (constants embedded, no env/args), deterministic (byte-identical output, no timestamps). Emits:
   - `assets/css/next/primitives/colors.css` — 7-step surface ramp + accent family + text primitives; dark `:root` + `[data-theme="light"] :root`; **dual-emission** (`#hex` sRGB fallback + `oklch(...)` per primitive — R-D3-dual-emit).
   - `assets/css/next/primitives/colors-contrast-report.md` — APCA audit table via `calcContrast()`.
3. Also write the static primitive files: `spacing.css`, `typography.css` (15px base; weight 300/400/500/600/700/900 — NO 800), `radius.css` (explicit 4/6/8/10/16 + 9999 + 0), `motion.css`.
4. Session-2-startup housekeeping (synthesis §3.1, before the colors work): S3 registry "Design DNA pointer" column; S6 R-DNA-1..6 refusal family; wire S5 G1 parity criterion to `_rebuild-design-dna.md` §I.

## In-flight
Nothing started-but-incomplete. Working tree clean except the owner-placed files below.

## Context — owner-placed files NOT committed (surface, do not touch)
The owner dropped files between sessions; only the skill bundles were in this session's scope. Left untracked/uncommitted for the owner to triage:
- `docs/references/toolskin-visual-audit-SKILL.md` — the v1.1 SOURCE the install copied from. The `docs/session-1-bootstrap/toolskin-visual-audit/` folder the owner's prompt named holds only v1.0 (`SKILL.md` tracked + `SKILL-v1.md` untracked). Commit `5fa1112`'s message says "Sourced from docs/session-1-bootstrap/…" — used verbatim per owner instruction despite that imprecision.
- `docs/references/_components-docs/token-validation/` — a duplicate reference copy of the token-validation bundle (the live skill is `.claude/skills/token-validation/`).
- 2 pitchdeck docs the owner moved from `docs/session-1-bootstrap/toolskin-visual-audit/` → `docs/references/_components-docs/` (2 deletions + 2 untracked in `git status`). They DUPLICATE copies already at `docs/references/pitchdeck/md-files/` — dedup decision is the owner's.
- `docs/references/CLAUDE.md` — the old showcase CLAUDE.md. WARNING: a CLAUDE.md inside the repo auto-loads as nested instructions when editing files under `docs/references/`; its content is stale (HSL model, 16px base). Recommend renaming it so it does not load as live instructions.
- `.claude/settings.local.json`, `docs/references/toolskin-showcase-latest.html`, `docs/session-1-bootstrap/_phase-5-classification-applied.md` — untracked, owner-placed, untriaged.

## Context — bindings (still binding)
- Wave 1.6 canonical: 15px base; weight 300/400/500/600/700/900 — NO 800; radius explicit 4/6/8/10/16; H1=700, H2=600.
- Extended Rule 15: apcach is the supreme color authority for the whole derivation chain — no hand-tuned per-theme values.
- Pre-commit hook installed at `.git/hooks/pre-commit`; passes docs/skills commits (CSS checks skip until block CSS exists in `assets/css/next/`).
- `.remember/remember.md` was found EMPTY in the working tree at session start (the committed version was intact); the remember plugin's session-start behavior likely empties it. The committed handoff is the durable record — `git show HEAD:.remember/remember.md` recovers it. Manual cold-resume via CLAUDE.md remains the active mechanism on Windows.
- Windows long-path gotcha: a 213-char filename under `docs/references/mockup/...` needs one-shot `git -c core.longpaths=true` for `git add` of that path (never modify git config). This session's commits did not touch it.
