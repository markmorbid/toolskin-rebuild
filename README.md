# Toolskin Rebuild

The active, from-scratch rebuild of the Toolskin design system: block-by-block, sandbox-isolated, token-driven, and framework-agnostic.

## Repository roles

- **This repository (`markmorbid/toolskin-rebuild`) is the active development home.** New implementation work and the forward-looking roadmap belong here.
- **[Toolskin Design System v1](https://github.com/SatoshiSea/toolskin-design-system) is the legacy showcase and reference.** Use it to inspect and recover existing assets, patterns, and behavior. Treat it as a reference snapshot; do not make rebuild changes there.
- Both repositories are retained. The v1 repository is not being deleted or replaced.

## Current status

The rebuild is in progress. The v1 showcase is the visual and functional reference; compare against it when migrating a component, and record intentional differences rather than silently losing behavior.

## Structure

- `assets/css/next/` — production CSS rebuild target
- `sandbox/` — isolated test pages for individual blocks
- `tools/color-engine/` — build-time color engine
- `docs/handoffs/` — specifications, synthesis, and session notes
- `.claude/skills/` — project-specific agent guidance
- `expert-designer/` — portable design skill, references, starters, and verification scripts

## AI-assisted development plan

Use AI as a contributor whose work is reviewed—not as an authority. Keep changes small, verifiable, and reversible.

1. **Orient before editing:** read the relevant project guidance, inspect the target files, and compare the corresponding v1 reference. State the intended scope and files to change before making broad edits.
2. **Inventory and migrate incrementally:** choose one component or design-system concern at a time. Record its v1 behavior, assets, dependencies, and any known gaps in a handoff or issue; do not copy the whole legacy repository blindly.
3. **Implement against the rebuild's contracts:** use the existing tokens and architecture. Avoid introducing a framework, dependency, generated asset, or new public API without explaining the need and getting maintainer approval.
4. **Verify each change:** run the relevant existing checks and design audits, inspect the sandbox in a browser when applicable, and report exactly what was and was not tested. If a check cannot run, say so instead of claiming success.
5. **Protect project history and assets:** do not delete or overwrite legacy/reference material as cleanup. Propose moves or removals separately, preserve the original in version control, and request approval before destructive or sweeping changes.
6. **Keep the roadmap evidence-based:** prioritize foundational tokens, accessible and responsive components, documentation/examples, and reliable tests. Add a task only after defining its user value and a concrete acceptance check.

### Suggested first milestone

Create a small migration inventory from the v1 showcase: identify the core tokens and a few representative components, link each to its source and destination, and note the expected verification. Then migrate one low-risk component end-to-end to validate the workflow before expanding scope. This is a proposed starting point, not a claim that the work is already complete.

## Read the design guidance first

Before a design or implementation task, read the relevant project guidance. In particular, see [`expert-designer/README.md`](expert-designer/README.md) and its `SKILL.md` / `ANTI-DEFAULT-PROTOCOL.md` entry points when working with that design system. Follow the repository's existing instructions where they apply; ask for clarification when requirements or destructive actions are unclear.

## License

This rebuild is licensed under the [MIT License](LICENSE). The v1 reference repository currently has a separate CC0-1.0 license. Each license applies to its own repository; check provenance and third-party asset licenses before copying material between repositories. This README does not relicense third-party work or change the v1 license.
