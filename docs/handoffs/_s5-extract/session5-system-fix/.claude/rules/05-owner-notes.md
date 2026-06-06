# Owner Notes — Full Payload (VERBATIM)

**Source of truth. Present to the council with ZERO summarization loss.**
**These are the owner's hand-written CSS comments from a full day of work.**
**Owner directive: any work ignoring these notes = invalid output.**

---

## GLOBAL DIRECTIVE (owner @OWNER_DIRECTIVE)

All CSS and JS must be fully removed from HTML. No inline styles or scripts.
No embedded logic in markup. All classes must be reusable, system-driven
patterns — no disposable, temporary, or one-off classes. Every class = a
committed design asset.

CLEANUP MANDATORY BEFORE ANY PROGRESS: audit all HTML, remove stale/redundant/
conflicting classes, deduplicate overlapping rules, eliminate cascade
conflicts and specificity issues.

No further development without cleanup. Sandboxes are high-risk; do not
propagate bad practices. Every step must validate the design system.
No temporary fixes or hidden technical debt. Always unify, deduplicate,
optimize against core assets.

ARCHITECTURE FLOW: 1. Apply Expert Designer v7 → 2. Validate in sandbox →
3. Confirm reusability → 4. Then proceed. Do not copy legacy patterns
blindly. Owner notes are source of truth for refactor priorities.

---

## COLOR · core knobs (owner)

These tokens MUST be delegated to a color engine layer, not handled in the
general token layer. Move OKLCH logic, derivations, and state variants out
of this scope.

---

## COLOR · theme-toggle breakage (owner)

Remove color overrides that conflict with non-inheritable rules across
stylesheets. Prefer a proper import chain to avoid duplicated root
declarations (tokens.css already defines core values).

Temporary conditional added to prevent theme-toggle breakage: buttons were
inheriting the same attribute that drives theme switching, causing conflicts
(black text on black background). Safeguard keeps buttons stable during
theme swaps. Refactor once theme/state responsibilities are isolated.

---

## SURFACES · dark default conflict (owner @OWNER_NOTE)

Conflicts with generated color system. Overlapping responsibilities between
surfaces and color tokens. ACTION: reorder with architecture; separate roles
(color engine vs surface/application layer); components consume tokens, not
redefine them.

---

## BORDERS (owner @CRITICAL)

Borders must NOT rely on currentColor as a general rule. Not reliably
inheritable; breaks when no explicit text color is set; only safe for
limited cases (icons, some buttons).

STANDARD: derive borders from text tokens (ts-text-primary/secondary/muted),
mix with surface (bg-*) for contrast + transparency. Each border-* maps to
its corresponding surface. Use dim variants for intensity. Always base on
text-primary + dim level for consistency across themes. Border tokens must
be explicitly computed, not implicitly inherited. this-bg-border allowed
only as a simple static surface-bound fallback.

---

## PADDING SCALING ENGINE (owner @OWNER_NOTE)

Tokenized scaling system for padding: harmonic ratios, proportional spacing
logic, math for consistent UI layout scaling. ACTION: validate against
original token definitions; submit for architectural review (council);
ensure alignment with global spacing system before reuse.

---

## ALTERNATING SURFACE SYSTEM (owner @OWNER_NOTE, experimental)

Avoids explicit background assignment when already defined; relies on
contrast-based alternation. STATUS: draft, visual validation only, deployed
in legacy showcase. ISSUES: static surface values instead of computed
contrast; nested cases (sections/cards/inputs) inconsistent; non-color rules
mixed into color logic; dark background system broken (root clamp removes
lower bound → dark == base); presets not propagating.

ACTION: rebuild with OKLCH contrast calc (no static surfaces); isolate color
from layout rules; define reusable automated patterns for section alternation
and nested containers; theme-agnostic (no light/dark branching); fix surface
scaling/clamping; validate preset propagation.

---

## PURPLE ARTIFACT — FIXED (owner @OWNER_FIX)

ROOT CAUSE: neutral surface contained residual blue component; direct mixing
with accent introduced hue shift → purple. FIX: replaced base with
desaturated value for contrast token; reduced chroma; percentage-based
mixing with accent. RESULT: subtle stable focus color, no hue shifts.
FOLLOW-UP: optionally dim final mix; if instability persists, remove
accent-based background focus entirely.

---

## GRID BACKGROUND SYSTEM (owner)

Keep defined at token level; expose via utility class (.bg-grid). Allow grid
backgrounds anywhere via class; full customization through tokens (size,
spacing, line color, opacity). Context-agnostic; no hardcoded values; consistent
with color/surface system. Applied via background-image NOT background-color;
coexists with surface color; must not override or conflict with background-color.

---

## LAYOUT FAILURE (owner @OWNER_REVIEW)

Does NOT comply with system standards. Does not follow starter patterns;
ignores layout/composition rules; overuses vertical stacks; lacks grid
structure and hierarchy; no exploratory composition.

CONSTRAINT: DO NOT delete this file (deletion = rollback, unacceptable).
Section color alternation already fixed — must be preserved.

ACTION: fully evaluate and rebuild; re-align with starter patterns; replace
stacked layouts with grid compositions; introduce structured reusable layout
patterns; improve hierarchy. Study and apply starter patterns + new system
skills. Comply with non-linear grid-driven layout standards.

---

## END-OF-ISOLATED-SCOPE (showcase bento, owner)

End of isolated scope showcase bento styles to dedupe and merge with general
scope. Unique elements must remain or the page breaks. If elements are
general-use, this block should not exist. Do not delete until owner approval.
Exists to clean up the main tokens.css. Part of sandbox cleanup. Tokens here
must remain focused on general usage.
