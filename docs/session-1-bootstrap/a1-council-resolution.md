═══════════════════════════════════════════════════════════════════════
A1 COUNCIL RESOLUTION — OWNER DECISIONS LOCKED
═══════════════════════════════════════════════════════════════════════

Council disagreements are now resolved. These decisions are BINDING INPUT to S4 (Build Pipeline Architect) when S4 dispatches.

## Procedural correction (apply going forward)

At council completion, the orchestrator should have surfaced UNRESOLVED council disagreements to owner BEFORE dispatching consumers. Council deliberation is INPUT to owner decision, not orchestrator auto-resolve.

Going forward in Session 1 and all future sessions:
- After any council invocation, if voices DISAGREE on substantive points → surface disagreement to owner, halt for owner call, encode owner's resolution as binding input to the next dispatch.
- After any council invocation, if voices AGREE → orchestrator may proceed without owner intervention, but surfaces the consensus + minor dissent for owner visibility.

For THIS council on A1: surface complete (owner picks below). For FUTURE councils (e.g., Gate 5 council on apcach Path A vs B if invoked): same protocol — synthesize disagreements, surface, halt for owner.

S2 dispatch was correct (orthogonal to A1, no decision needed). S3/S5/S6 are also orthogonal-enough — they consume Wave 1 + S1/S2, not A1 directly. S4 is the consumer of A1 — S4's brief must include these owner picks verbatim.

═══════════════════════════════════════════════════════════════════════
OWNER PICKS ON COUNCIL DISAGREEMENTS (locked, encode in S4 brief)
═══════════════════════════════════════════════════════════════════════

## Q1 — KEEP @ts-deps headers

Block CSS files declare dependencies via comment header:
```css
/* @ts-deps: primitives/colors, primitives/spacing, system/surface, components/button */
```

The header is machine-parsed by the build script for topological sort. Pre-commit hook validates them (per Q3).

Rationale: machine-readable dependencies enable per-block tree-shaking (Q2) and let blocks be added/reordered safely without manual manifest curation. Critic's failure mode #2 (typoed dep headers) is closed by the pre-commit hook's cascade integrity validation (Q3 full version).

## Q2 — KEEP per-block file emission

Build script emits BOTH:
- `dist/toolskin.css` (single concatenated file — primary ship, drop-in for AI/WordPress per Rule 5)
- `dist/blocks/<block>.css` (per-block files — advanced consumers with tree-shaking)

Both targets must be cascade-consistent (same topo-sort produces both).

Rationale: Pragmatist's measurement — 70-80KB savings for buttons-only — is real for power-user consumers. Single-file path remains the documented default; per-block files are opt-in. No Rule 5 contradiction because zero-config drop-in still works via the single file.

Docs MUST include explicit "consumer modes" section:
- AI artifact / WordPress / static HTML → `<link href="dist/toolskin.css">` (single file)
- Build-tool consumer with tree-shake → import per-block files from `dist/blocks/*.css`

## Q3 — Pre-commit hook FULL (validates topo-sort + diffs sandbox vs bundler order)

Hook checks at every commit:
1. Topological sort terminates (no cycles, all deps resolvable)
2. All `@ts-deps` headers reference valid block names (no typos)
3. Sandbox `<link>` order in any block's `index.html` MATCHES the topo-sort order the bundler would produce
4. If sandbox order disagrees with bundler order → fail commit with explicit diff message

This closes BOTH Critic high-severity failure modes (sandbox/production cascade divergence + missing/typoed deps fail silently).

S6 Repo Governance designs the hook script. S4 Build Pipeline designs the topo-sort + bundler. They share the same dependency parser module to ensure both speak the same dep graph.

## Q4 — COMMIT dist/toolskin.css to repo

`dist/toolskin.css` is committed to master at every owner-approved release boundary. Node-less contributors can grab it directly without running the bundler.

Rationale: closes Rule 13 erosion per Critic. Toolskin's identity as "drop-in single CSS file" survives even for contributors who don't want Node.

Implementation:
- `dist/` is NOT gitignored
- `dist/blocks/*.css` ALSO committed (per Q2)
- `dist/colors-contrast-report.md` committed (audit artifact, useful for diff review)
- `.gitignore` updated to remove any `dist/` exclusion
- Release-time workflow: owner runs `npm run build`, reviews diff, commits `dist/*` along with source changes

Note: this WILL make some commits large in diff (any color change cascades through dist/toolskin.css). Mitigation: `.gitattributes` can mark `dist/*.css` as `linguist-generated` + `merge=ours` to reduce diff noise in code reviews.

═══════════════════════════════════════════════════════════════════════
S4 BRIEF — UPDATED MANDATE
═══════════════════════════════════════════════════════════════════════

When S4 dispatches, its brief includes the standard inputs PLUS this LOCKED block from A1 council resolution:

```
A1 ARCHITECTURE LOCKED (per Gate 4-and-a-half owner resolution):

1. Source-of-truth dependency declaration: @ts-deps comment headers in
   each block's CSS file.
   Format: /* @ts-deps: primitives/colors, primitives/spacing, ... */
   
2. Sandbox loading: each block's index.html has explicit <link> tags
   in dependency order (validated by pre-commit hook against bundler
   topo-sort output).

3. Production build: tools/build/bundle-css.js (Node, build-time only)
   parses @ts-deps headers, topo-sorts, emits:
   - dist/toolskin.css (single concatenated file)
   - dist/blocks/<block>.css (per-block files)
   - dist/colors-contrast-report.md (apcach audit artifact)

4. Pre-commit hook (S6 designs script, S4 provides parser module):
   - Validate topo-sort terminates
   - Validate all @ts-deps reference valid blocks
   - Diff sandbox <link> order vs bundler topo-sort output
   - Fail commit on any mismatch

5. dist/ committed to repo. .gitignore does NOT exclude dist/.
   .gitattributes optionally marks dist/*.css as linguist-generated
   to reduce diff noise.

6. Consumer modes (must be documented in dist/README.md or similar):
   - Default: <link href="dist/toolskin.css">  (drop-in single file)
   - Advanced: import dist/blocks/<block>.css individually (tree-shake)

7. Circular dependency strategy: introduce shared-tokens/ layer 
   between system/ and components/ for tokens needed by multiple
   components. OR allow explicit /* @ts-cycle-break: <token> */
   annotation for inevitable mutual references (e.g., chip <-> chip-strip).
   S4 designs the policy.

8. Cascade-sensitivity rule honored: the bundler does NOT optimize
   selector specificity or reorder rules within a block. Block author
   intent is preserved byte-for-byte.

S4 deliverables must include:
- Bundle script (full code, ready to run)
- Pre-commit hook validation module (the parser that S6's hook calls)
- Consumer-modes documentation outline (dist/README.md)
- Test fixtures: at least 3 mock blocks demonstrating topo-sort,
  per-block emission, and cycle detection
- Migration plan: how the existing 128 components from T1 typology
  get classified into block files with @ts-deps headers
```

═══════════════════════════════════════════════════════════════════════
EXECUTION ORDER (UNCHANGED, with A1 locked into S4 brief)
═══════════════════════════════════════════════════════════════════════

1. **S2 currently running** — let complete, no intervention
2. Orchestrator validates S2 spec against S1
3. **Append A1 resolution to `_wave-1-synthesis.md`** as "Appendix A1-Resolution" with the owner picks above verbatim
4. **Update queue** with A1 resolution locked
5. **Dispatch S3+S4+S5+S6 in parallel** — S4's brief includes the locked A1 architecture
6. Orchestrator pondering Wave 2 outputs (will surface any council-worthy disagreements PER PROCEDURAL CORRECTION above)
7. **HALT AT GATE 5**

═══════════════════════════════════════════════════════════════════════
WHAT YOU CAN EXPECT AT GATE 5
═══════════════════════════════════════════════════════════════════════

S4's spec lands with the A1 architecture concretely realized. Owner reviews:

1. **Bundle script implementation** — does it parse @ts-deps correctly? Topo-sort sound? Per-block emission consistent?
2. **Pre-commit hook validation module** — does it close Critic's HIGH-severity failure modes (cascade divergence + missing deps)?
3. **Circular dependency policy** — sound? Will it block real work or enable it?
4. **Consumer modes documentation** — clear for AI/WordPress/static HTML/power-user?
5. **Migration plan from T1 typology** — does it cover all 128 components?

Plus the other Wave 2 spec reviews (S3 registry, S5 protocol, S6 governance + the hook itself).

═══════════════════════════════════════════════════════════════════════
REMINDER BINDINGS
═══════════════════════════════════════════════════════════════════════

- 14 CONVERSATION RULES + Rule 15 (apcach) in effect
- File 07 repo isolation (toolskin-rebuild canonical, toolskin-showcase read-only)
- Procedural correction: surface council disagreements to owner before dispatching consumers
- Halt on anomaly, never improvise
- A1 architecture is LOCKED per owner picks above — S4 brief must include this verbatim

Continue with S2 in flight. After S2 lands + validation + queue update + A1 resolution appendix, dispatch S3+S4+S5+S6 parallel.
