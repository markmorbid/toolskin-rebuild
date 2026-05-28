# toolskin.css.frozen — Migration Spec Snapshot

**This is a frozen, read-only snapshot of the OLD `toolskin.css` taken at the close of Phase 0 of the rebuild.**
It is the migration target for Phase 2 (component migration into `assets/css/next/components/`).

## What it is

A verbatim copy of `../toolskin-showcase/assets/css/toolskin.css` as it stood when the Phase 0 council ratified the forward-architecture ADR. Created to satisfy Amendment A1 of `decisions/forward-architecture.md`.

## Why it exists (Skeptic's spine-blocker finding)

The Phase 0 Skeptic voice flagged that the old `toolskin.css` is a moving spec — owner WIP edits to it mid-Phase-2 would silently change what the migration is migrating *to*. The plan docs estimated the file at ~8.5k lines; at snapshot time it was **29,438 lines** and had been modified within the past hour. Without a freeze, component-by-component parity has no fixed anchor and the migration validates against drift.

Freezing the file as a checked-in artifact gives Phase 2 a stable, diff-able reference. The live file in `toolskin-showcase/` may continue to evolve; this frozen copy does not.

## Provenance

| field | value |
|---|---|
| Source path | `../toolskin-showcase/assets/css/toolskin.css` |
| Source size | 29,438 lines |
| Source mtime | 2026-05-28T03:03:17 local (windows reported) |
| Source SHA-256 | `14508B666D8860E7B26A3277E32E9B9C3E845C34A6521F63FB6C816FB1C259AE` |
| Frozen path | `docs/references/toolskin.css.frozen` |
| Frozen SHA-256 | `14508B666D8860E7B26A3277E32E9B9C3E845C34A6521F63FB6C816FB1C259AE` (verified equal) |
| Frozen at | 2026-05-28, Phase 0 close, before Phase 1 engine integration |
| Frozen at HEAD | (commit hash assigned by the phase-boundary commit referencing this file) |
| ADR reference | `decisions/forward-architecture.md` Amendment A1 |

## Read-only contract

- The frozen file is NEVER edited after this commit. Treat it as a binary blob.
- If the migration spec needs to change (e.g., owner introduces a new pattern in the live `toolskin-showcase/toolskin.css`), the change is incorporated by writing a NEW frozen snapshot at the next phase boundary, not by editing this one.
- The frozen file is excluded from any audit/lint pass that targets `assets/css/next/`. It is reference material, not deliverable code.

## How Phase 2 uses it

For each component migration in Phase 2:

1. Locate the relevant selector block(s) in `docs/references/toolskin.css.frozen` (search by class name, e.g., `.ts-input`, `.ts-card`, `.ts-toolbar`).
2. Migrate those rules into the corresponding `assets/css/next/components/<name>.css` file on the nested CSS pattern (per `.claude/rules/03-css-architecture.md`).
3. Preserve the `.ts-*` class names externally — migration ≠ redesign.
4. Validate by the component sandbox showcase per the working mode (per `docs/handoffs/01-WORKING-MODE.md` rule 4).

## What it is NOT

- It is not the canonical Toolskin output. That is `assets/css/next/` once Phase 2 completes.
- It is not a re-importable stylesheet for the rebuilt showcase. The rebuilt showcase imports `assets/css/next/`, not this frozen reference.
- It is not subject to refactor. Bugs in the frozen file remain bugs in the frozen file; Phase 2 fixes them in the new component code as part of the migration.

## When the freeze ends

The frozen file remains in the repo for the life of Phase 2. Once Phase 4 (refactored showcase) ships and visually achieves parity with the OLD showcase, the frozen file may be archived or pruned per a separate decision. Until then, it is the contract.
