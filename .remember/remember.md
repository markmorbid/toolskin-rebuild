## Rulings

RULING 7: apcach is the constant engine for the entire system layer. Every mixing constant, percentage, threshold, and lightness delta in `surfaces.css` and all future system files must be apcach-derived outputs baked by `generate-colors.js` at build time. Hand-tuned literals are Rule-15 violations regardless of whether they look right. The CSS composes — apcach decides the amounts. Committed constants in `surfaces.css` (`a0ea9e4`) are provisional Rule-15-noncompliant placeholders.
