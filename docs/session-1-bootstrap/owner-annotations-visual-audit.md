# Owner annotations
## (Paste this section at the bottom of _rebuild-visual-audit.md)

---

## GATE 5 CONFLICT RESOLUTIONS (visual reality wins — Pattern 17 binding)

### OQ-B3 — Space Grotesk 800 weight — ❌ REVISE Gate 5 Resolution #3

Visual audit shows branding typography page renders H1=700, H2=600. No 800 weight anywhere in the rendered showcase. The running toolskin.css confirms: font-weight tokens are 300/400/500/600/700/900 — no 800. Space Grotesk ships 300-700 maximum under SIL OFL license.

**OQ-B3's premise was false.** The "800 literal in H2 + .ts-section-title" either doesn't exist in the production CSS or rounds to 700 silently in the browser.

**Owner resolution:**
- ❌ REVISE: Drop `--ts-font-weight-extra-bold: 800` primitive from S1 spec
- ❌ REVISE: Abandon variable-axis `wght@300..900` requirement — standard Space Grotesk 300-700 is what renders and it looks correct
- 📝 INTENT: The 6-step weight ladder (300/400/500/600/700/900) is canonical. The gap at 800 is intentional — Space Grotesk doesn't have it natively.
- 📝 INTENT: H1=700 (--ts-font-weight-bold), H2=600 (--ts-font-weight-semibold). This hierarchy reads correctly at 15px base.
- ✅ KEEP: Resolution #3 Variable-axis URL abandoned. Standard Google Fonts URL `wght@300;400;500;600;700` or just `wght@300..700` is correct. No 800 needed.

---

### OQ-A6 — Base font size — ❌ REVISE Gate 5 decision

Visual reality + running toolskin.css source confirms: `--ts-fs-base: 15px`. NOT 13px. NOT 16px.

The Gate 5 council debate was between 13px (CSS comment reference) and 16px (typography-master skill). Both were wrong. The actual production CSS runs at 15px.

**Owner resolution:**
- ❌ REVISE: OQ-A6 decision changes from "keep 13px" to "keep 15px — this is what runs in production"
- 📝 INTENT: 15px is the intentional base — denser than Bootstrap/Tailwind 16px default, but not as extreme as 13px. This is the real Toolskin base.
- ✅ KEEP: "Update typography-master skill" — yes, update it to say 15px not 16px
- 📝 INTENT: The harmonic ladder derives from 15px, not 13px. S1 spec must be updated to apcach-derive from 15px base.

---

### OQ-D1 — Radius ladder — ✅ PARTIAL ENDORSE, ❌ ladder steps revised

8px base is confirmed correct. The LADDER STEPS are revised based on what branding spacing-radius page actually shows:

**Visual reality shows:** SM=4, MD=6, BASE=8, LG=10, XL=16

**Owner resolution:**
- ✅ ENDORSE: 8px base radius (--ts-radius-base: 8px) — confirmed canonical
- ❌ REVISE: The calc-derived ladder steps in DNA §D1 are wrong. The actual steps are: 4 / 6 / 8 / 10 / 16 (not the harmonic calc outputs)
- 📝 INTENT: These are the 5 canonical radius values in Toolskin v1. The rebuild tokens should use these exact values as primitives: `--ts-radius-sm: 4px`, `--ts-radius-md: 6px`, `--ts-radius-base: 8px`, `--ts-radius-lg: 10px`, `--ts-radius-xl: 16px`
- 📝 INTENT: Full-pill = 9999px, sharp = 0px. These are additional values, not derived.
- ❌ REVISE: The nest-reduction formula (8/6/4/2) was built on wrong ladder. Correct nest-reduction: 8→6→4→2 still works (uses the actual ladder steps, just needs re-documenting with correct step names)

---

## OTHER HIGH FINDINGS

### Marquee CSS — `--ts-bg-1` direct primitive use (live token leak)
- ❌ REJECT as canonical Toolskin pattern. This is a Rule 15 violation live in production.
- 📝 INTENT: In rebuild, marquee uses `--ts-this-bg` surface inheritance, not direct primitive references. S4's A8 fix already accounts for this.

### FontAwesome icons missing on toolskin-lab toast buttons
- ❌ REJECT as canonical state. This is the known FontAwesome version mismatch bug.
- 📝 INTENT: index.html FA6 renders correctly. toolskin-lab is affected by the version detection bug. The rebuild's `toolskin-assets.js` fix (pin version, no `latest` string) resolves this in v2.

### 3-candidate logo system (Bracket/Blade/Cascade) in branding/
- ✅ ENDORSE the existence of a logo system. DNA §H said "no mark system" — that was wrong.
- 📝 INTENT: The 3 concepts (Bracket, Blade, Cascade) are design explorations, not finalized. The rebuild should acknowledge they exist in branding/ without committing to one. Add to in-house-skills-update-todo: "Logo system finalization — 3 candidates in branding/ previews, owner to pick or commission final direction."

### Mobile-app branding demo render break (clipped pill, cut tab row)
- ❌ REJECT as canonical. This is a responsive/viewport clipping bug in the demo, not the component.
- 📝 INTENT: The component behavior (pill, tab row) is canonical. The demo shell has a viewport constraint bug. Low priority for rebuild.

### Full-page headless captures unreliable (lazy-load blanks in index-fullpage)
- ❓ UNCLEAR: The per-section Playwright captures are reliable (confirmed). Full-page captures of long pages have blank sections where lazy-load didn't fire. Use per-section captures as ground truth for index.html analysis. Your real-Chrome captures are the ground truth for full-page views.

---

## ANNOTATION SUMMARY FOR W1.6.6 RECONCILIATION

Priority revisions to _rebuild-design-dna.md:

| DNA section | Old claim | Revised canonical (visual reality wins) |
|---|---|---|
| §B3 font weight | H1=900, H2=800, add 800 token | H1=700, H2=600. 6-step ladder: 300/400/500/600/700/900. No 800. |
| §B.base font size | 13px canonical | 15px canonical (running toolskin.css) |
| §D1 radius ladder | 8px base + calc-derived steps | 8px base + steps: 4/6/8/10/16/9999/0 |
| §F7 marquee tokens | --ts-bg-1 direct reference | Bug/regression — should use --ts-this-bg surface inheritance |
| §H logo system | "No mark system exists" | 3 design candidates in branding/: Bracket, Blade, Cascade. Unfinalized. |

Priority amendments to specs:

| Spec | Amendment |
|---|---|
| S1 (Color Foundation) | Recompute harmonic ladder from 15px base, not 13px |
| S1 (Font weights) | 6-step ladder 300/400/500/600/700/900 — no 800 token |
| OQ-B3 resolution | ABANDONED — standard Space Grotesk 300-700 confirmed correct |
| OQ-A6 resolution | REVISED — 15px (not 13px) is the canonical base |
| OQ-D1 resolution | PARTIAL REVISE — 8px base confirmed, ladder steps revised to 4/6/8/10/16 |

Pattern 17 enforcement: the S1 spec MUST be re-dispatched or amended before Session 2 primitives implementation to use 15px base and 6-step weight ladder. Minor amendment to the spec doc is sufficient — no full sub-agent re-dispatch needed. The amendment gets encoded in the Phase E skill's §23 (Wave 1.6 Visual Audit appendix) as the binding basis for Session 2.
