═══════════════════════════════════════════════════════════════════════
REPO BINDING CLARIFICATION (BINDING — read before any further action)
═══════════════════════════════════════════════════════════════════════

This clarification supersedes any ambiguity about where the project lives. Encode in toolskin-architecture skill at Phase E. Acknowledge before continuing B.3.

═══════════════════════════════════════════════════════════════════════
THE CANONICAL TOOLSKIN PROJECT
═══════════════════════════════════════════════════════════════════════

**Project location (THE Toolskin project from this point forward):**

```
D:\Mis Documentos\Projects\Toolskin Framework\toolskin-rebuild\
```

**Project's main branch:** `master` (the active development branch of this repo)

**Project's git history:** Fresh — first commit IS Session 1's Phase F baseline

**This is the ONE repo where:**
- All future work happens
- All commits land
- All branches grow from
- All sub-agents write outputs to
- The shipped Toolskin v2 originates

Whenever the owner says "the Toolskin project", "the repo", "the rebuild", "the project folder", or "the codebase" — this is what's meant. No exceptions.

═══════════════════════════════════════════════════════════════════════
THE REFERENCE SOURCE-OF-TRUTH (read-only, frozen, separate repo)
═══════════════════════════════════════════════════════════════════════

**Reference location (the OLD Toolskin v1, frozen forever):**

```
D:\Mis Documentos\Projects\Toolskin Framework\toolskin-showcase\
```

**Reference branch:** Whatever its current branch is (do not interact with it git-wise)

**Reference status:** PERMANENTLY READ-ONLY. This folder + repo is the visual + functional reference for the rebuild. Sub-agents READ from it constantly during Wave 1/Wave 2 specs and block sandbox work. They NEVER write to it. They NEVER commit to it. They NEVER pull, push, fetch, or rebase against it. They NEVER branch from it.

The reference repo is NOT MAIN in any context. It is not a feature branch, not a parallel branch, not a hotfix branch. It is a SEPARATE REPOSITORY that happens to live on the same filesystem.

═══════════════════════════════════════════════════════════════════════
HOW TO TALK ABOUT EACH
═══════════════════════════════════════════════════════════════════════

When discussing the project, use this language to avoid confusion:

| Term | Refers to |
|---|---|
| "The Toolskin project" / "the repo" / "the project folder" | `toolskin-rebuild/` (canonical, where work happens) |
| "Main branch" | `toolskin-rebuild`'s `master` branch (its main) |
| "The rebuild" | Active work on `toolskin-rebuild/` |
| "The reference" / "the source of truth for the design" / "v1" | `toolskin-showcase/` (frozen, read-only) |
| "Reference CSS" / "reference rules" | Files read from `toolskin-showcase/` for visual/functional comparison |
| "../toolskin-showcase/" (relative path in code/specs) | The reference repo, accessed via relative path from inside `toolskin-rebuild/` |

NEVER say "main branch" when meaning the reference repo. The reference repo is NOT main in any sense. It's a separate repo at a separate path.

═══════════════════════════════════════════════════════════════════════
PHYSICAL ISOLATION RULES (prevent overlap, prevent breakage)
═══════════════════════════════════════════════════════════════════════

To prevent the two repos from ever overlapping or interfering:

1. **Working directory for ALL agent operations:** `D:\Mis Documentos\Projects\Toolskin Framework\toolskin-rebuild\`. Agent never `cd`s into the reference repo.

2. **All git operations (`git add`, `git commit`, `git status`, `git log`, etc.):** run from inside `toolskin-rebuild/` only. Never run inside `toolskin-showcase/`.

3. **Reference reads from the old repo:** use ONLY relative paths from `toolskin-rebuild/`:
   - `../toolskin-showcase/assets/css/toolskin.css`
   - `../toolskin-showcase/docs/PRE-REFACTORING-PLAN-15-04-2025/...`
   - `../toolskin-showcase/index.html`
   - etc.
   
   Use `cat`, `view`, `grep`, `head`, `tail`, `find` — read operations only. Never `vim`, `str_replace`, `create_file`, `rm`, `mv`, `cp -t`, or any write operation against `../toolskin-showcase/**`.

4. **The reference repo's git state:** invisible to the rebuild. Don't query its branches, don't check its log, don't compare against its HEAD. It exists on disk; treat it as a static filesystem mirror, not a git repository.

5. **Symlinks, junctions, bind mounts:** none. The two folders are siblings, period. No path tricks that could make them appear as one.

6. **Two-repo isolation in CLAUDE.md** of the new repo: explicitly state the freeze, the reference path, and the read-only rule.

═══════════════════════════════════════════════════════════════════════
WHEN A SUB-AGENT NEEDS REFERENCE MATERIAL
═══════════════════════════════════════════════════════════════════════

The protocol for any sub-agent (Wave 1, Wave 2, or future block-rebuild sub-agents) to read from the reference repo:

1. Identify what they need (specific component rules, specific token declarations, specific HTML structure)
2. Use relative path `../toolskin-showcase/<path>` from within `toolskin-rebuild/`
3. READ the file (cat / view / grep)
4. Extract the relevant portion into their own working notes inside `toolskin-rebuild/docs/handoffs/` or their sandbox folder
5. NEVER stage, commit, or write back to `../toolskin-showcase/`

Example correct read:
```bash
# From inside toolskin-rebuild/, looking up reference rules for .ts-button
grep -n "\.ts-btn[^a-z]" ../toolskin-showcase/assets/css/toolskin.css | head -50
```

Example FORBIDDEN write:
```bash
# DO NOT DO THIS:
echo "anything" >> ../toolskin-showcase/anyfile  # FORBIDDEN
cd ../toolskin-showcase && git status            # FORBIDDEN — never cd into reference
```

═══════════════════════════════════════════════════════════════════════
WHY THIS MATTERS
═══════════════════════════════════════════════════════════════════════

The previous Toolskin work (in `toolskin-showcase/`) accumulated 3+ months of disasters because agents kept "fixing" things in the same repo where they were also discovering architectural rules. Mistakes overwrote good work. Good work overwrote experiments. Branches tangled.

The two-repo model breaks that cycle:
- Reference repo = frozen historical state of Toolskin v1. Never changes. Always reliable for comparison.
- Rebuild repo = clean slate where every block goes through sandbox isolation, verification, owner approval, commit.

If at any point an agent gets confused and starts writing to the reference repo, that breaks the architecture. The reference repo becomes corrupted; the comparison target moves; the rebuild loses its anchor.

This is a HARD INVARIANT, not a preference. Code reviews, sub-agent dispatches, commit hooks, and the toolskin-architecture skill all enforce it.

═══════════════════════════════════════════════════════════════════════
ENCODE IN PHASE E SKILL.md
═══════════════════════════════════════════════════════════════════════

The toolskin-architecture skill (Phase E deliverable) MUST contain a top-of-file section titled "**REPO MODEL — READ FIRST**" with the content above. Specifically:

- Canonical project path (toolskin-rebuild/)
- Reference path (toolskin-showcase/)
- Language clarification ("the project" = rebuild, "the reference" = showcase)
- Hard isolation rules (no git ops in reference, only relative-path reads, no cd into reference)
- Why isolation matters (3-month disaster history of the old repo)

═══════════════════════════════════════════════════════════════════════
ENCODE IN CLAUDE.md AT THE NEW REPO ROOT
═══════════════════════════════════════════════════════════════════════

The new repo's `CLAUDE.md` (created in Phase A.4) must also state:

```markdown
## Repo isolation (binding)

- **This repo (`toolskin-rebuild/`)**: the canonical Toolskin project. Branch `master`. All work happens here.
- **Reference repo (`../toolskin-showcase/`)**: frozen, read-only. Sub-agents read from it via relative paths. NEVER write, NEVER commit, NEVER cd into.

Any agent that violates this isolation halts immediately and surfaces to owner. See `.claude/skills/toolskin-architecture/SKILL.md` REPO MODEL section.
```

═══════════════════════════════════════════════════════════════════════
PRE-COMMIT HOOK (S6 Governance — Wave 2 deliverable)
═══════════════════════════════════════════════════════════════════════

Sub-Agent S6 (Repo Governance + Refusal Patterns Author) brief now includes:

> Write a pre-commit hook at `.git/hooks/pre-commit` that:
> - Blocks any commit if `git diff --staged` includes paths matching `../toolskin-showcase/**` (defense in depth — this shouldn't happen but hook prevents it if it ever did)
> - Blocks any commit message lacking the rebuild session tag (e.g., `feat(rebuild):`, `refactor(css):`, `docs(handoffs):`)
> - Blocks any new `!important` in `assets/css/next/**/*.css`
> - Warns on any file added outside `assets/css/next/`, `sandbox/`, `docs/`, `tools/`, `.claude/`, repo-root metadata files

═══════════════════════════════════════════════════════════════════════
ACKNOWLEDGE BEFORE CONTINUING
═══════════════════════════════════════════════════════════════════════

Before running B.3 non-interactively (per file 04), confirm:

1. Current working directory is `D:\Mis Documentos\Projects\Toolskin Framework\toolskin-rebuild\` (the canonical project)
2. The reference repo at `..\toolskin-showcase\` is recognized as READ-ONLY frozen reference
3. The language above is understood (project = rebuild, reference = showcase, no "main branch" for reference)
4. The hard isolation rules will be honored throughout this and all subsequent sessions

Once acknowledged, proceed with B.3 non-interactive install per file 04. Then B.6, B.8, B.9, B.11, Gate 2.
