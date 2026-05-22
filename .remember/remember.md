## Rulings

RULING 7: apcach is the constant engine for the entire system layer. Every mixing constant, percentage, threshold, and lightness delta in `surfaces.css` and all future system files must be apcach-derived outputs baked by `generate-colors.js` at build time. Hand-tuned literals are Rule-15 violations regardless of whether they look right. The CSS composes — apcach decides the amounts. Committed constants in `surfaces.css` (`a0ea9e4`) are provisional Rule-15-noncompliant placeholders.

RULING 7 CONSTANT TABLE (approved — owner-reconciled from the 4-voice council):

```
border-rest       Lc 15   --ts-mix-perc
border-0          Lc 8    soft hairline
border-hover      Lc 30   --ts-mix-perc-hover
border-active     Lc 30   accent-tinted
border-disabled   Lc 8
border-focus      accent pass-through — no Lc target
dark (recessed)   Lc 8    --ts-this-bg-grad-dark-pct
bright (raised)   Lc 6    --ts-this-bg-grad-bright-pct
hover-surface     Lc 12
active-surface    Lc 8
disabled-bg       Lc 18
text primary / secondary / muted   Lc 75 / 45 / 25  (Session 2)
border-dim        ratio of border-rest via Engine-Anchored Derivation
grad-angle        geometry-exempt — named allowlist
```

PATTERN-16 RESOLUTION — Option B: `generate-colors.js` bakes constants per preset (not 300 resolved colors). `surfaces.css` composes with those constants. Engine owns the amounts. CSS composes. Path-A opt-in required for arbitrary runtime surfaces (AI builder / custom brand).
