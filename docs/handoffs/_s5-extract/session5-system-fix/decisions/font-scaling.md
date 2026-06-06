# Decision — Font Scaling (OPEN — council must resolve)

**Status: OPEN architecture question. Owner directive vs current ladder.**
**Do NOT implement either side until council rules + owner confirms.**

## The owner directive (tokens.css L58-61, verbatim intent)

> Use SEMANTIC units, not numeric. xs / sm / lg / xl / 2xl / 3xl etc.
> Numeric values like --ts-fs-3 are hard for users to understand.
> Need flexible / percentage-based values that are clampable.
> Implement the width-aware adaptive scalable font from:
> docs/references/_components-docs/font-scaling-math-experiment.html
> Enable a scale value for EVERY scope so the user can scale the font
> up or down for any design need — not the ratio, but the unit value,
> math-converted into percentage so it scales down smoothly instead of
> raw blown-up laddered values.

## The conflict

CURRENT: numeric ladder --ts-fs--2 ... --ts-fs-9, computed by
`calc(base × ratio^n)`. Role aliases (h1/h2/lead/caption) map onto it.
This is what the sandbox, the skill, and audit-design.mjs all use.

OWNER WANTS: semantic names + percentage/clampable + per-scope scale knob
+ width-aware (the value responds to viewport width smoothly, not in
laddered jumps).

These are not trivially compatible. The role aliases (h1..caption) are
already semantic-ish; the owner wants the SIZE TOKENS themselves to be
semantic AND fluid AND per-scope-scalable.

## What RULING 3 OVERRIDE settled (so it is NOT re-litigated)

Base is flexible, may resolve to 16px. The 13px restriction is annulled.
Mathematical stability + token inheritance are the only acceptance criteria.
So the council is NOT arguing about base size — that is settled. The
council is deciding the NAMING and SCALING MECHANISM.

## Council questions

1. Does the width-aware model in font-scaling-math-experiment.html
   IMPROVE the current harmonic ladder, or REPLACE it? Read the file first.
2. Can semantic names (xs/sm/lg/xl) coexist with the role aliases
   (h1/h2/lead), or do they collapse into one system?
3. How does a per-scope scale knob work without breaking token inheritance?
   (e.g. --ts-fs-scale on a container rescales all descendants smoothly)
4. What is the MINIMUM adoption scope? Owner flagged responsive TITLES as
   the primary use case — maybe it applies to display/hero only, not body.
5. Does audit-design.mjs's LADDER_PX array need to change, and how does
   the auditor validate a fluid/percentage system?

## Constraints on the answer
- Must be mathematically stable (no clamp min > max inversions)
- Must preserve token inheritance (descendants rescale proportionally)
- Owner wants smooth percentage scaling, not raw laddered px jumps
- Do not break the existing role aliases that components already consume
- Reference implementation is the experiment HTML — that is the spec

## Until resolved
Components use the existing role aliases (--ts-fs-h1, --ts-fs-body, etc.).
Do NOT introduce semantic size tokens ad-hoc per block. One system,
council-ruled, owner-confirmed, then applied everywhere at once.
