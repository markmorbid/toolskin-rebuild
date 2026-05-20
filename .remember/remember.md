# Handoff — Toolskin Rebuild

## State
**Session 1 COMPLETE.** 2 commits on `master` (no remote — fresh git history, Rule 14):
- `fa4cf0a` — Day 1 corpus (68 files, ~22k lines; mislabeled "init: empty commit" but it actually holds the full corpus).
- `a9efd26` — Session 1 baseline completion (55 files): Gate 5 council + 3 resolutions, Extended Rule 15, Wave 1.6 visual audit, the `toolskin-architecture` skill, S6 governance.

Working tree clean.

On master now:
- **Spec corpus** — 10 rebuild specs (T1-T3, S1-S6, Wave 1.5 DNA) + syntheses in `docs/handoffs/` (~11.5k+ lines).
- **`toolskin-architecture` skill** — `.claude/skills/toolskin-architecture/` — auto-loads every session; 23 sections + `references/conversation-rules-verbatim.md`. Read it first every session.
- **Governance** — `.git/hooks/pre-commit` (tracked copy `tools/governance/pre-commit`; re-install per clone) + `CONTRIBUTING.md`.
- **Wave 1.6 visual audit** — `docs/handoffs/_rebuild-visual-audit.md` (1,510 lines) + 34 owner real-Chrome captures in `docs/handoffs/_visual-audit/owner-ground-truth/`. The 90 Playwright screenshots are gitignored — regenerate via `node tools/visual-audit/capture.mjs`.
- **Build tooling** — apcach v0.6.4 (`tools/color-engine/`) + Playwright (`tools/visual-audit/`), build-time only; `node_modules/` gitignored (Rule 13).

## 3 Gate 5 revisions from the Wave 1.6 visual audit (BINDING for Session 2 / S1)
- **OQ-A6** — base font size is **15px** (not 13px, not 16px). The S1 harmonic ladder derives from 15px.
- **OQ-B3** — ABANDONED. 6-step weight ladder `300/400/500/600/700/900`, **NO 800**. H1=700, H2=600. Standard Space Grotesk `wght@300..700` (no variable-axis). Gate 5 Resolution #3 withdrawn.
- **OQ-D1** — 8px base confirmed; radius ladder is explicit `4/6/8/10/16` (+ `9999` pill, `0` sharp), NOT calc-derived.

The Wave 1.6 Reconciliation block at the TOP of `_rebuild-design-dna.md` is authoritative — visual reality wins over the text-derived DNA below it (Pattern 17).

## Next — Session 1.5 (housekeeping, ~90 min)
- Install skills: `rebuild-orchestration` (Patterns 1-18; source `docs/session-1-bootstrap/rebuild-orchestration/`), `toolskin-visual-audit` (source `docs/session-1-bootstrap/toolskin-visual-audit/` — apply the 5 reconciliation tasks), `claude-remember` plugin.
- Update the 3 in-house skills to Wave 1.6 values: typography-master → 15px base + 6-step weight ladder; expert-designer → 8px radius + explicit ladder; design-tokens-2.0 → Extended Rule 15.
- Amend the S1 spec for 15px base + 6-step weight ladder + explicit radius (minor edit — no sub-agent re-dispatch).
- Verify the `toolskin@1` npm name; Snyk audits of browser-qa / configure-ecc / design-system.
- Full checklist: `docs/handoffs/_in-house-skills-update-todo.md`.

## Next — Session 2 (primitives, ~3-4 hr)
Implement `tools/color-engine/generate-colors.js` running apcach → `assets/css/next/primitives/colors.css`: apcach-derived OKLCH primitives with paired sRGB fallbacks (Resolution #2), a 48-pair APCA contrast table, the 15px-base harmonic ladder, the 6-step weight ladder, the explicit radius ladder. Per S1 spec (`docs/handoffs/_rebuild-primitives-spec.md`) + the Wave 1.6 reconciliation.

## Context
- Repo isolation: `../toolskin-showcase/` is read-only reference forever — never write, cd, or commit there.
- HALT protocol: surface council fundamental implications + visual-audit gaps + quota-approach to the owner; never auto-resolve (Patterns 16 / 17 / 18).
- **Pattern 18 was extended this session:** at every session close (and on any quota halt), update AND commit `.remember/remember.md`. See `toolskin-architecture` SKILL.md §19.
