# Toolskin Rebuild — Wave 1.6 Visual Audit

> ⚠ CORRECTION (2026-05-21 — RULING 3): This audit concluded base font size = 15px. That conclusion was wrong — the branding preview page used a different font-size context. Running `toolskin.css:287` confirmed: `--ts-fs-base: 13px`. All "15px canonical" references in this doc are superseded by RULING 3.

**Authored:** Session 1 Day 2 (2026-05-19), per the council-resolutions brief Wave 1.6 + Pattern 17.
**Status:** `AWAITING OWNER ANNOTATION` (HALT W1.6.B).

This is the ground-truth visual record of the existing Toolskin design system — the first time any agent has analyzed *rendered pixels* rather than CSS/HTML/skill text. Per Pattern 17, where this audit and the text-derived `_rebuild-design-dna.md` disagree, **this audit (plus owner annotation) wins**.

---

## Master Summary

### How this audit was produced

- **124 images analyzed** by 5 parallel Visual Audit Analyst subagents:
  - **90 Playwright headless PNGs** — `index.html` + `toolskin-lab.html`, 3 viewports × 2 themes, full-page + per-section + 4 interactive states (`docs/handoffs/_visual-audit/screenshots/`).
  - **34 owner real-Chrome GoFullPage JPGs** — index, surface-lab, toolskin-lab, generator, galleries, portfolios, the full branding system (previews + demos), and 6 pitchdeck slides (`docs/handoffs/_visual-audit/owner-ground-truth/`).
- Batch split: **A1** = Playwright index dark · **A2** = Playwright index light · **B** = Playwright lab + interactive states · **C** = owner core surfaces + headless-vs-real comparison · **D** = owner branding system + pitchdeck.
- Full per-screenshot detail is in the **Per-Batch Detail** sections below.

### Headless-vs-real-Chrome verdict (Batch C)

**MOSTLY faithful.** Color, layout, gradients, type metrics, and component state all match between Playwright headless and owner real Chrome. **Per-section headless captures are reliable.** The one trust hole: **headless full-page stitches of `index.html` have blank unrendered regions** (scroll-triggered lazy-reveal did not fire during capture) — do NOT treat the Playwright `*-index-fullpage.png` captures as ground truth for mid/lower index sections; use the per-section captures instead. The `toolskin-lab.html` headless full-page IS faithful.

### ⚠ Conflicts with Gate 5 resolutions — owner attention required

The visual audit contradicts decisions locked at Gate 5 *today*. These are surfaced, **not reconciled** — owner decides at annotation:

1. **Heading weights vs Resolution #3 (OQ-B3).** DNA §B3 (text-derived) claims a 300–900 ladder with H1=900, H2=800 — and Resolution #3 locked variable-axis Space Grotesk `wght@300..900` specifically to obtain the 800 weight. But the owner's **branding typography reference page caps Space Grotesk at 300–700**, with DISPLAY-XL/H1=700 and H2=600 (Batch D, HIGH). If the showcase truly uses 700/600, OQ-B3's premise ("preserve 800 parity") is false and Resolution #3's variable-axis-for-800 may be unnecessary. **Recommend owner revisit OQ-B3 / Resolution #3.**
2. **Radius ladder vs OQ-D1.** OQ-D1 locked an 8px base and DNA §D1 describes a calc-derived ladder (2xs≈2.4 … xl≈16). The branding spacing-radius page shows a *different* ladder: SM4 / MD6 / BASE8 / LG10 / XL16 (buttons=MD, inputs=BASE, cards=LG) (Batch D, HIGH). The 8px base survives ("BASE8"); the ladder values do not match.
3. **Body base font-size vs OQ-A6.** OQ-A6 locked 13px. Batch D reports three sources disagreeing on body base (13 / 14 / 16px). Needs a single canonical answer.

### Consolidated anomalies — 58 total (11 HIGH / 24 MED / 23 LOW)

**HIGH severity (11):**
- **H1 (A1, A2, C):** Marquee CSS panel contradicts DNA §F7 on 3 tokens — `--ts-marquee-bg: var(--ts-bg-1)` (not `--ts-accent-glow-bg-2`), literal `2rem` font-size (not `var(--ts-fs-hero)`), `--ts-marquee-gutter` (not `--ts-marquee-separator`). Live "NEW" marquee renders near-flat solid, not the radial accent-glow §F7 specifies.
- **H2 (A1):** Marquee CSS uses the `--ts-bg-1` *primitive* directly as a component token value — a visible Rule 5a tokenization violation in the shipped system.
- **H3 (A2):** All 3 Playwright light-theme index full-pages render near-blank white — substantially the lazy-load capture artifact (per Batch C), but light-mode contrast is independently suspect (see MED below).
- **H4 (A2):** Mobile Forms section renders almost entirely blank (per-section capture — leans genuine surface-collapse, not artifact).
- **H5 (B):** Space Grotesk appears substituted/double-struck in headless captures — likely a headless render-env quirk (Batch C says type metrics match real Chrome); judge heading type from owner captures, not headless.
- **H6 (B):** Topbar wordmark renders as an illegible dark smear in headless captures containing the topbar.
- **H7 (B):** FontAwesome icons absent on toast-trigger buttons in `toolskin-lab.html` (isolated — accordion icons, chevrons, sort grips, and all `index.html` FA6 glyphs render fine; Ionicons survive).
- **H8 (C):** Playwright index full-pages have blank unrendered regions (lazy-load) — see headless verdict above.
- **H9, H10, H11 (D):** Radius-system conflict, heading-weight conflict (see Gate 5 conflicts above), and mobile-app demo render break (clipped/overlapping lime balance pill, vertically-cut segmented tab row).

**MED (24)** and **LOW (23):** full lists per batch below. Notable MED items: version-string mismatch on one page (desktop hero "V3.2.0" vs mobile hero "V1.0.0"); chip 2-char label clipping ("OK" → "DK"); light-theme weak surface-boundary contrast (light panels on white barely perceptible — "Light panel" demo card fully invisible); orange BADGE pill renders dark-on-orange, contradicting §C5/Rule 7 OKLCH `--ts-on-accent` (should be white at hue-18); index + surface-lab use full-bleed solid accent/danger *section bands* (DNA §C1 sanctions solid accent only on primary button + chip); a 3-candidate logo system (Bracket/Blade/Cascade) is live, contradicting DNA §H OQ-Logo ("no mark system exists"); `accordion-expanded` interactive captures show a still-collapsed section (capture-fidelity defect).

### Consolidated owner-pending questions — 46 total

Grouped themes (full per-batch lists below):
- **Typography:** canonical heading-weight ladder (700/600 vs 900/800); canonical body base (13/14/16px); resolve OQ-B3.
- **Radius:** which ladder is canonical — DNA calc-derived or branding-page SM4/MD6/BASE8/LG10/XL16.
- **Marquee:** canonical `--ts-marquee-*` tokens — live CSS or DNA §F7; canonical marquee background (flat vs radial glow).
- **Color application:** is a solid accent/status *section-band* tier legitimate (DNA §C1 currently forbids it)? Is dark-on-orange `--ts-on-accent` correct or a regression?
- **Brand:** is the magenta Banner-Generator wordmark + hexagon mark an intentional color-engine demo or a theme-scope leak? Is the hexagon a real brand mark? Is the 3-candidate logo system canonical (DNA OQ-Logo says none)?
- **Versioning:** which version string is canonical (V1.0.0 vs V3.2.0)?
- **Scope:** do cube-portfolio / phantom-portfolio have light modes? Are ts-gallery-demo empty cells intentional placeholders or load failures?

### Capture-method caveats (for Phase E + Session 4+)

- Playwright `*-index-fullpage.png` (all 6) — **unreliable** (lazy-load blanks). Per-section + lab full-page captures reliable.
- Headless Space Grotesk rendering is suspect — judge type weight/quality from owner GoFullPage captures.
- `accordion-expanded` state captures did not actually expand — interactive expanded-state visual remains unverified.
- 2 oversized PNGs (`mobile-*-index-section-portfolio.png`) exceeded the image API dimension limit; covered via desktop equivalents.
- Pitchdeck: only 6 of 11 slides captured (01,02,03,06,07,10 — non-contiguous); pitchdeck reference docs were not placed in `reference-context/`, so pitchdeck notes are pixel-derived only. 5 slides unverified.

---

## Owner annotation instructions (HALT W1.6.B → W1.6.5)

Please annotate the findings below — inline next to each, or as a `# Owner annotations` section appended to this file. Per finding:

- **✅ ENDORSE** — this is canonical Toolskin; preserve in the rebuild.
- **❌ REJECT** — this is workaround/regression state (e.g. FontAwesome failure, marquee primitive misuse, dark-on-orange); do not preserve.
- **📝 INTENT** — add design rationale ("this is canonical because X" / "this was meant to change in v2").
- **❓ UNCLEAR** — intent not recalled; flag for follow-up.

**Priority annotations:** the 3 Gate 5 conflicts (heading weights, radius ladder, body base) — your call there determines whether OQ-A6 / OQ-B3 / OQ-D1 / Resolution #3 need revising before Phase E.

After annotation, W1.6.6 reconciles `_rebuild-design-dna.md` against this audit (visual + your annotation wins on every contradiction), then Phase E proceeds.

---

# Per-Batch Detail



# Rebuild Visual Audit — Batch A1

**Analyst:** Wave 1.6 Visual Audit Analyst — Batch A1 (Playwright headless captures, index.html, DARK theme)
**Date:** 2026-05-19
**Scope:** 29 PNGs matching `*-dark-index-*.png` in `docs/handoffs/_visual-audit/screenshots/` — 3 full-page (desktop/tablet/mobile) + 13 desktop per-section + 13 mobile per-section.
**Cross-reference doc:** `docs/handoffs/_rebuild-design-dna.md` (text-derived design DNA, Wave 1.5).
**Output role:** Ground-truth visual record. Where rendered reality and the text-derived DNA conflict, the contradiction is SURFACED, not reconciled (Rule 11).
**Coverage note:** 28/29 screenshots rendered and analyzed at full visual detail. `mobile-dark-index-section-portfolio.png` exceeds the API many-image dimension limit (>2000px) and could not be rendered in this context — its content is covered by `desktop-dark-index-section-portfolio.png` (analyzed in full) + `mobile-dark-index-fullpage.png`. Flagged as A1-tooling, LOW.

═══════════════════════════════════════════════════════════════════════
## METHOD NOTE — capture fidelity
═══════════════════════════════════════════════════════════════════════

The Playwright captures vary WILDLY in resolution. `desktop-dark-index-section-panels.png` renders at ~960px wide with crisp text; most other desktop sections render at ~480px wide and are soft. The three full-page captures are downscaled extremely (desktop 1921×22729 → tiny; mobile 392×41547; tablet 1025×21538) so micro-detail is unreadable in them — the per-section captures carry the real evidence. Per-section captures also contain large empty dark regions because each section's viewport-height crop includes generous vertical whitespace. This is a CAPTURE-TOOL artifact (the `capture.mjs` section-cropping logic), NOT a layout bug — flagged once below as A1-tooling and not repeated per-screenshot.

A persistent **orange "NEW" announcement bar** ("Explore our interactive Toolpanel Mockups…") appears mid-frame in nearly every per-section capture. It is a sticky/fixed promo banner that the section-scroll capture freezes at scroll offset. Treated as expected furniture, not flagged per-screenshot.

═══════════════════════════════════════════════════════════════════════
## FULL-PAGE CAPTURES
═══════════════════════════════════════════════════════════════════════

## Screenshot: desktop-dark-index-fullpage.png
- **Surface captured:** Entire index.html top-to-bottom, desktop width.
- **Viewport / theme:** desktop (1921w) × dark.
- **What's rendered:** Topbar with "TOOLSKIN" wordmark + nav; orange announcement bar; orange full-bleed hero band ("One engine — surfaces, gradients, controls"); a second "HERO TITLE GRADIENT" type-spec block; then a very long dark scroll with sparse component clusters (chips/buttons strip, a wide marquee band "Design, Software And Marketing Systems For The Fu…", a code-panel block, a 3-up card grid, footer). Accent = orange throughout.
- **Cross-reference vs design DNA:** Matches §G6 "orange-on-near-black" and §F9 uppercase wordmark. The full-bleed orange hero band matches §F7 fullwidth-marquee escape-the-container concept (a layout-promoted full-bleed element). Page is heavily dark with low ink density per vertical inch — consistent with §C "surface IS the depth signal" but the sheer proportion of empty black is striking at this zoom.
- **Anomalies flagged:** Extreme downscale makes this image diagnostic only at the macro level — see method note. Macro: no broken-layout, no white flashes, no obviously-missing sections. The solid orange hero band is so saturated it reads almost like an un-styled placeholder block at this zoom; needs the per-section capture to confirm (it does — see section-top, it is intentional).
- **Open question for owner:** Is the solid-orange full-bleed hero band ("One engine — surfaces, gradients, controls") an intentional marquee/banner surface, or a section that lost its intended gradient/atmosphere treatment? Per-section captures suggest intentional, but confirm.

## Screenshot: tablet-dark-index-fullpage.png
- **Surface captured:** Entire index.html, tablet width.
- **Viewport / theme:** tablet (1025w) × dark.
- **What's rendered:** Same section order as desktop, reflowed narrower. Hero, type-spec, component clusters, marquee band, card grid (still 3-up), footer. Lower 55–60% of the capture is near-empty dark with only faint section dividers.
- **Cross-reference vs design DNA:** Section reflow is graceful — no horizontal overflow, no clipped content. Consistent with §A4 fluid `clamp()` section rhythm.
- **Anomalies flagged:** The large empty dark lower region is the capture-crop artifact (method note). Card grid stays 3-up at tablet — acceptable but worth confirming intended breakpoint behavior (DNA §G2 says grid uses `.ts-grid--auto-md` minmax, so 3→2 collapse may be expected at narrower tablet widths). LOW.
- **Open question for owner:** none.

## Screenshot: mobile-dark-index-fullpage.png
- **Surface captured:** Entire index.html, mobile width.
- **Viewport / theme:** mobile (392w) × dark.
- **What's rendered:** Single-column reflow. Topbar collapses to wordmark + icon cluster (hamburger). Hero, orange band, stacked component sections. Capture is 41547px tall — the tallest of the three; downscaled to a thin sliver, so only color-blocking is legible.
- **Cross-reference vs design DNA:** Single-column stack is correct mobile behavior. Accent orange consistent.
- **Anomalies flagged:** Diagnostic at macro level only (method note). No macro layout break visible. The 41547px page height on a 392px-wide viewport indicates every section stacks fully — extremely long mobile scroll; not a bug but a UX observation. LOW.
- **Open question for owner:** none.

═══════════════════════════════════════════════════════════════════════
## DESKTOP PER-SECTION CAPTURES
═══════════════════════════════════════════════════════════════════════

## Screenshot: desktop-dark-index-section-top.png
- **Surface captured:** Topbar + hero section.
- **Viewport / theme:** desktop × dark.
- **What's rendered:** Sticky topbar — "TOOL SKIN" wordmark (SKIN in orange), horizontal nav (HOME / TYPE / COMPONENTS / UI KIT / FORMS / CARDS / PANELS / MOCKUPS / BANNER UI / SURFACES LAB), a theme dropdown + sun icon at right. Orange announcement bar below. Hero: orange pill eyebrow ("DESIGN SYSTEM · V1.0.0 · 2026"), massive "TOOLSKIN" display title (TOOL white, SKIN orange), a short body paragraph, two buttons (solid-orange primary "VIEW COMPONENTS" + an outline/ghost secondary), and an "ACCENT" label with a row of ~5 color swatch chips (orange, green, cyan/teal, purple, red). Hero background is a warm dark-to-black radial/gradient with subtle grain.
- **Cross-reference vs design DNA:** Strong match. §F9 topbar: sticky, wordmark uppercase, single bottom rule — confirmed. §F3 button: solid-orange primary + `--ts-on-accent` white label — confirmed (white text on orange reads cleanly). §B5 dense UI, §G6 orange-on-near-black, §G6 atmospheric gradient + grain — all confirmed visually. The accent swatch row demonstrates the §4 color-engine hue-swap (orange/green/cyan/purple/red presets).
- **Anomalies flagged:** Topbar nav labels are very small and tightly tracked at this render scale — legibility is borderline but consistent with §B5 13px-dense intent; not a defect. Accent swatch chips are circular/pill — consistent with §F1 `--ts-radius-full` chip variant. None HIGH.
- **Open question for owner:** none.

## Screenshot: desktop-dark-index-section-typography.png
- **Surface captured:** §3 Typography section.
- **Viewport / theme:** desktop × dark.
- **What's rendered:** Section eyebrow ("DISPLAY / HERO"), a huge two-line "HERO TITLE / GRADIENT" display title where "GRADIENT" has an orange-to-light gradient fill. Below: a two-column block — left column is a heading ladder (H1 — Display Heading / H2 — Section Title / H3 — Card Header / H4 — Subsection / H5 — Label Heading / H6 — MICRO LABEL), right column is a darker card with body/secondary/muted/accent/gradient text samples + an "OVERLINE LABEL" + caption text. Bottom: a small code/usage strip with inline orange-bordered code chips.
- **Cross-reference vs design DNA:** Strong match for §B. The heading ladder visibly de-escalates weight/size from H1→H6; H6 renders UPPERCASE while H1–H5 are mixed-case — confirms §B4 caps role-lock exactly. "GRADIENT" gradient-fill word matches the gradient-text utility. Letter-spacing on the display title is visibly tight — confirms §B1 role-coded tracking.
- **Anomalies flagged:** H1 and H2 in the ladder render at near-identical visual weight — hard to distinguish 900 (H1) vs 800 (H2) at this scale. This is consistent with OQ-B3 (the literal `800` vs token ambiguity) — the rendered result shows the two top tiers are weakly differentiated. MED. The right-hand text-samples card sits on a only-slightly-lighter surface than the section bg — surface-tier contrast is subtle (matches §C "surface contrast IS the boundary" but it is faint). LOW.
- **Open question for owner:** Is the weak visual gap between H1 (900) and H2 (800) acceptable, or should the rebuild widen the top-of-ladder contrast? (Ties to OQ-B3.)

## Screenshot: desktop-dark-index-section-components.png
- **Surface captured:** §A — Components section (data tables + list components).
- **Viewport / theme:** desktop × dark.
- **What's rendered:** A pill section-marker ("§04 — COMPONENTS"), large empty region, then an "ENHANCED DATA TABLES" card with a real data grid (rows with checkbox, title, colored status chips — green/orange/teal, dates, ratings with star, an action button), filter chips below. Then a "LIST WITH ICON COMPONENTS" block — three columns of icon+label list rows (orange circular/square icon tiles + text).
- **Cross-reference vs design DNA:** Status chips (green = success, orange/amber = warning, teal) confirm §F1 chip status variants. Data table is a molecular composition on a `--ts-bg-1`-ish raised surface — consistent. Icon tiles use orange accent fills — consistent with accent application. Section-marker pill matches the dotted-connector section-divider motif seen across sections.
- **Anomalies flagged:** Large vertical empty band between the section marker and the data-table card — capture-crop artifact (method note), not a layout bug. The status chips inside the table appear to use SOLID green/teal fills — DNA §C1 says accent goes solid only on primary button + accent/active chip; status chips swapping `--ts-accent` to a status color and rendering solid is consistent with §F1, but the saturation of the green/teal solid fills is high. LOW. Soft render at ~480px wide limits fine inspection.
- **Open question for owner:** none.

## Screenshot: desktop-dark-index-section-ui-kit.png
- **Surface captured:** §05 — Enhanced UI Kit components (tooltips, number inputs, lab components).
- **Viewport / theme:** desktop × dark.
- **What's rendered:** Section marker "§05 — UI KIT COMPONENTS". Toast/alert preview cards with warning-triangle icons. An "INTERACTIVE TOOLTIPS" card (basic tooltips, primary/secondary/live buttons, icon tooltips, form-element tooltip). An "ENHANCED NUMBER INPUTS" card with stepper inputs. A "LAB COMPONENTS — Advanced components available in Toolskin Lab" block: a sortable-list demo (numbered drag rows) + a wide solid-orange "EXPLORE LAB" CTA button at the bottom.
- **Cross-reference vs design DNA:** Toast cards with semantic icons match §F12. Number-input steppers match §F5 input system. The full-width orange "EXPLORE LAB" button is a §F3 primary button stretched to container width — solid accent + white label confirmed. Small green pill badges ("DONE"/"NEW"-style) on card headers match §F1 accent/status chip.
- **Anomalies flagged:** Two small triangle-warning icons render at the top — they appear as filled orange/amber triangles, consistent with FontAwesome warning glyphs; no broken-glyph boxes. Soft render. None HIGH.
- **Open question for owner:** none.

## Screenshot: desktop-dark-index-section-marquee-documentation.png
- **Surface captured:** Marquee component documentation section.
- **Viewport / theme:** desktop × dark.
- **What's rendered:** Section marker "§ — MARQUEE COMPONENT". A two-column block: left is a "FEATURES" card (orange-check bullet list), right is a `marquee-variables.css` code panel (traffic-light window dots + monospace CSS). Below: TWO live marquee strips spanning wide — first a large light-text marquee ("Design, Software And Marketing Systems For The Fu…") on a brown/dark band, second a smaller marquee, plus a solid-orange marquee band on the right ("Design, Software" in orange).
- **Cross-reference vs design DNA:** Marquee strips confirm §E3/§F7 horizontal infinite-loop text. The code panel is the authoritative on-screen source for marquee tokens. **CONTRADICTION (see mobile-marquee capture for the legible version):** the visible code declares `--ts-marquee-bg: var(--ts-bg-1)` and `--ts-marquee-gutter`, whereas design DNA §F7 claims `--ts-marquee-bg: var(--ts-accent-glow-bg-2)` (radial accent glow) and names the spacing token `--ts-marquee-separator`. Surfaced, not reconciled.
- **Anomalies flagged:** The orange marquee band uses solid orange — if marquee bg is `--ts-bg-1` per the code panel, the orange band must come from a variant override or `--ts-accent` swap; DNA §F7 (accent-glow background) does not predict a flat-orange marquee. MED — token-name + bg-value mismatch between rendered code and DNA.
- **Open question for owner:** Which marquee background is canonical — `--ts-bg-1` (shown in the rendered code panel) or `--ts-accent-glow-bg-2` (design DNA §F7)? And is the spacing token `--ts-marquee-gutter` (rendered) or `--ts-marquee-separator` (DNA §F7)? The DNA appears to be stale vs the live CSS.

## Screenshot: desktop-dark-index-section-forms.png
- **Surface captured:** §06 — Forms section (form controls, sliders, color swatches, code panel, accordion/card-layout demos).
- **Viewport / theme:** desktop × dark.
- **What's rendered:** Section marker "§06 — FORMS …". A form card with labeled fields (project name, URL input with orange inset action button, a search-select with orange inset button, a textarea, a select), an "Enable auto-scheduling" checkbox row. Right: a slider card (multiple orange-filled range sliders with value readouts). Below: a `theme-config.json` code panel; a row of large color swatches — WHITE, ORANGE, then bright YELLOW / LIME-GREEN / WHITE / MAGENTA-PINK swatch tiles. Bottom half: extensive card-layout / accordion demo rows.
- **Cross-reference vs design DNA:** Inputs with flush orange inset action buttons confirm §F5 `.ts-input-inset-button` + §D3 sharp-corner edge-flush. Range sliders use orange accent fill — accent application consistent. The form fields use a translucent idle background — matches §F5 `--ts-this-bg-dim-3` see-through input.
- **Anomalies flagged:** The color-swatch row contains very high-chroma YELLOW, LIME-GREEN and MAGENTA-PINK tiles — these are intentional preset/demo swatches (the section is demonstrating the color engine), NOT the Toolskin accent. They are visually jarring against the orange-on-black system but are demo content, not a theme regression. LOW (worth noting because magenta/lime also appear in the banner-generator section — see those captures). Otherwise no defects.
- **Open question for owner:** none (swatches are demo content).

## Screenshot: desktop-dark-index-section-cards.png
- **Surface captured:** Cards section — blank/accent/interactive card variants, pricing cards, 3D flip cards.
- **Viewport / theme:** desktop × dark.
- **What's rendered:** Top row: three card variants — "BLANK CARD", "ACCENT BAR" (with an orange left/top accent bar + "+24.8%" orange stat), "INTERACTIVE CARD". A pricing row: three price cards — `$49`, a highlighted/recommended `$199` card (orange-bordered, orange "WANT THIS" CTA, slightly raised), `$899`. Section marker "§ — 3D FLIP CARDS (HOVER)". Then two rows of large numbered feature cards (01 DYNAMICS / 02 VISUALS / 03 SPEED) — the headings render in orange.
- **Cross-reference vs design DNA:** Pricing cards confirm §F4 card surfaces; the recommended `$199` card has an accent border + accent CTA + subtle lift — matches §C1 (accent border for emphasis) + §C4 (hover-lift shadow opt-in). Numbered feature cards use orange display headings — consistent with accent-as-emphasis. Card surfaces sit on a `--ts-bg-1`-ish raised tier with subtle borders — §F4 confirmed.
- **Anomalies flagged:** The two rows of numbered cards (01/02/03) appear nearly identical — likely a default state vs hover/flipped state of the same "3D FLIP CARDS" demo (front face vs alternate). Not a duplication bug. Soft render. None HIGH.
- **Open question for owner:** none.

## Screenshot: desktop-dark-index-section-panels.png
- **Surface captured:** §05 — Tool Panels section (toolpanel control block, sidebar nav, app topbar, nav variants, dashboard shell). HIGHEST-FIDELITY capture in the batch (~960px wide, crisp).
- **Viewport / theme:** desktop × dark.
- **What's rendered:** Section marker "§05 — TOOL PANELS". Left: a "YSS TOOLPANEL · 4.2.2" panel — header with gear/settings icons, a solid-orange "SCHEDULE" button, "DISABLE NOTIFS" / "DOWNLOADER" / "UPLOADER" / "EXPORT" buttons, a status/log line "[10:22:08] [Scheduler] Rate limit detected — throttling", a status footer (green-dot "Status: Idle", "Total 147", "Page 1/6"). Right: a "SIDEBAR NAV" — MAIN group (Dashboard active w/ orange highlight + orange left bar, Analytics, Projects), SETTINGS group (Analytics, Security, Projects) each with a FontAwesome glyph. Below: "APP TOPBAR" with logo + nav. Then five labeled "NAV VARIANT" rows demonstrating spacing/icon-only/dropdown permutations. Bottom: "DASHBOARD APP SHELL (MINI PREVIEW)" section marker. The site topbar here shows the full nav with "PANELS" tab ACTIVE (orange underline) and a sun/moon theme toggle at the right edge.
- **Cross-reference vs design DNA:** Crisp confirmation of multiple DNA claims: §F9 topbar sticky + active-tab orange underline; §F6 tree/nav rows with the inset accent bar on the selected row (the "Dashboard" active row shows the flush full-height left accent stripe — exactly §F6's `box-shadow: inset 2px 0 0 0` mechanism); icons render cleanly (FontAwesome 6 glyphs — no tofu boxes). Active "Dashboard" nav item = accent fill + on-accent text, confirming §C1 (accent solid on active state). Buttons confirm §F3.
- **Anomalies flagged:** None of significance. This capture shows the system rendering as the DNA predicts. The "SCHEDULE" primary button has white text on orange — §C5 on-accent confirmed. One LOW note: the active-tab underline ("PANELS") and the active sidebar row both use orange — consistent, no conflict.
- **Open question for owner:** none.

## Screenshot: desktop-dark-index-section-social-links.png
- **Surface captured:** Social Links component section.
- **Viewport / theme:** desktop × dark.
- **What's rendered:** "Social Links" H-title + descriptor. Six labeled variant groups, each a row of brand-icon buttons: STANDARD (dark square tiles, FB/Twitter/IG/LinkedIn/GitHub/YouTube), LIGHT (lighter tiles), DARK (darker tiles), ACCENT (orange-filled tiles), ROUNDED (circular tiles), FLAT (borderless), COLORED ("hover for brand colors", dark tiles incl. Pinterest/TikTok), COMBINED: ROUNDED + ACCENT (orange circular tiles).
- **Cross-reference vs design DNA:** Brand icons all render correctly — FontAwesome 6 brand glyphs intact, no broken/missing icons. ACCENT variant = solid orange tile with `--ts-on-accent` icon color — consistent with §C1/§C5. ROUNDED uses `--ts-radius-full`. Section header uses mixed-case H-title — consistent with §B4.
- **Anomalies flagged:** None. Icon system healthy (this is a key Pattern-17 check — FontAwesome did NOT fail). All variants visually distinct.
- **Open question for owner:** none.

## Screenshot: desktop-dark-index-section-footer-showcase.png
- **Surface captured:** Footer Components section.
- **Viewport / theme:** desktop × dark.
- **What's rendered:** "Footer Components" H-title + descriptor. A multi-column footer layout: link columns (Documentation/Components/Layouts; Get Started/Examples/GitHub; About Us/Contact/Careers; Privacy Policy/Terms of Service/Cookie Policy). A "NEWSLETTER" block with an email input + orange "Subscribe" button. A testimonial/quote card on the right ("The token-depth and dynamic color engine are unparalleled. Toolskin changed how I architect CSS." — attributed, with an orange accent bar / quote mark).
- **Cross-reference vs design DNA:** Footer link columns are a layout-tier composition with no per-column borders — §C3 "layout tier = no border" confirmed. Newsletter input + orange button matches §F5 + §F3. The quote card uses an orange left accent bar — §C1 accent-as-emphasis-bar.
- **Anomalies flagged:** Soft render limits fine inspection but no layout break, no overflow, no broken glyph. None HIGH.
- **Open question for owner:** none.

## Screenshot: desktop-dark-index-section-mockups.png
- **Surface captured:** "Toolpanel Mockup Previews" portfolio/CTA section.
- **Viewport / theme:** desktop × dark.
- **What's rendered:** A centered hero-style block: eyebrow "PORTFOLIO · LIVE DEMOS", large two-tone title "Toolpanel Mockup Previews" (Toolpanel in orange, rest white), a descriptor paragraph, a solid-orange "EXPLORE MOCKUPS" CTA. Behind/around the centered content is a faint, very-low-opacity collage of toolpanel UI screenshots bleeding off both edges (ghosted background imagery).
- **Cross-reference vs design DNA:** Centered composition slightly departs from §G6 "Toolskin heroes use spatial tension: asymmetric grids, off-center elements" — this block IS center-aligned and symmetric. But it is a CTA/portfolio band, not the primary hero, so the §G6 anti-pattern (which targets the main hero) may not strictly apply. Surfaced as observation.
- **Anomalies flagged:** The ghosted background collage is very dark/low-contrast — intentional atmospheric layering per §G6 ("atmospheric depth"), reads as deliberate, not a broken image. Center-symmetric layout: LOW (see open question). The faded edge-bleed images on the right have visible color (red/orange thumbnails) — fine.
- **Open question for owner:** Is the fully centered/symmetric layout of the "Toolpanel Mockup Previews" band intentional, given §G6 flags symmetric center-aligned heroes as a Toolskin anti-pattern? (Likely OK because it is a secondary CTA band, but confirm the anti-pattern scope.)

## Screenshot: desktop-dark-index-section-banner-generator.png
- **Surface captured:** Banner Generator section + a Banner-UI showcase panel.
- **Viewport / theme:** desktop × dark.
- **What's rendered:** LEFT half: an orange pill eyebrow ("TOOLSKIN TOOL"), "Banner Generator" title (Banner in orange), a descriptor with an orange-highlighted phrase, a 2-column feature-icon list, and an orange "LAUNCH BANNER GENERATOR" button. RIGHT half: a separate panel showing a large **MAGENTA/PINK "TOOLSKIN" wordmark** on a dark-warm background, with magenta accents — "FRAMEWORK FOR CREATORS" magenta sub-text, a magenta-outlined "v1.0.0"-style badge, a magenta hexagon mark, and a carousel dot row (first dot orange/active).
- **Cross-reference vs design DNA:** The LEFT half is orange-accent, consistent. The RIGHT panel is rendered entirely in MAGENTA/PINK — this is a live demonstration of the §4 color-engine hue-swap (`--ts-accent-h` retheme), shown as a banner-design preview. It is intentional demo content (the Banner Generator previewing a non-default accent). But it is the single most visually divergent frame in the batch.
- **Anomalies flagged:** Magenta "TOOLSKIN" wordmark + magenta accents in the right panel — flagged MED for owner confirmation. If this is the banner-generator output preview (color engine demo), it is correct-by-design. If any of it is leaking into the actual page chrome, it would be a theme-scope bug. The carousel dots suggest it is one slide of a banner-preview carousel → almost certainly intentional demo content. Also: the right panel's magenta hexagon is the only "mark/icon-logo" glyph seen anywhere in the batch — DNA OQ-Logo states no mark/icon-logo system is documented; this hexagon may be that missing artifact. Surfaced.
- **Open question for owner:** (1) Confirm the magenta-themed right panel is intentional Banner-Generator demo output (color-engine showcase), not a theme-scope leak. (2) The magenta hexagon mark — is this a real Toolskin brand mark? DNA OQ-Logo says no icon-logo is documented; if this hexagon is canonical, it should be captured into the design DNA.

## Screenshot: desktop-dark-index-section-portfolio.png
- **Surface captured:** §07 — Portfolio Showcase section (interactive automation toolpanels).
- **Viewport / theme:** desktop × dark.
- **What's rendered:** Section marker "§ — PORTFOLIO SHOWCASE" + descriptor "Interactive automation toolpanels — hover to reveal details, click to launch." A card grid: top row of three large cards — "YouTube Toolpanel" (red YouTube icon tile, "v4.2.7" badge), "Suno Automation" (orange music-note tile, purple "v3.6.1" badge), "Higgsfield Automation" (orange video tile, teal "v4.9.0" badge). Second row: a "Banner Generator" card (orange wand/magic icon, "v2.5" purple badge) + a wide expanded "YOUTUBE TOOLPANEL" detail panel (red YouTube icon, "v4.2.7" badge, descriptor, an orange "YSS TOOLPANEL UI" chip, two mode rows — "Watch Mode / Transcript + Summarizer" and "Studio Mode / Scheduler + Bulk Ops").
- **Cross-reference vs design DNA:** Cards confirm §F4 nest-aware surfaces. Version badges render in MULTIPLE colors — purple, teal, orange — these are status/category chip variants per §F1 (chip status accent swap). Icon tiles render correctly (FontAwesome glyphs, no tofu). The expanded detail panel is a card-in-card composition — consistent with §A3/§D4 nesting.
- **Anomalies flagged:** Version badges in purple/teal/orange — consistent with §F1 status-chip variants but note these are not the system accent; they are per-card category coding. LOW. Topbar at the very top of this capture shows "BANNER UI" and "SURFACES LAB" as the last two nav items, "SURFACES LAB" rendered as a solid-orange button (active/CTA treatment) — consistent. None HIGH.
- **Open question for owner:** none.

═══════════════════════════════════════════════════════════════════════
## MOBILE PER-SECTION CAPTURES
═══════════════════════════════════════════════════════════════════════

## Screenshot: mobile-dark-index-section-top.png
- **Surface captured:** Topbar + hero, mobile.
- **Viewport / theme:** mobile (375w) × dark.
- **What's rendered:** Topbar collapses to "TOOL SKIN" wordmark + a right cluster of three icons (sun/theme, up-arrow, hamburger). Orange announcement bar. Hero: orange pill eyebrow ("DESIGN SYSTEM · V1.0.0 · 2026"), large stacked "TOOLSKIN" title, body paragraph, a full-width solid-orange "VIEW COMPONENTS" primary button, a full-width outline "DESIGN TOKENS" secondary button, an "ACCENT" label + swatch chip row (orange/cyan/green/purple + a dark tile).
- **Cross-reference vs design DNA:** Same as desktop-dark-index-section-top except: nav collapses to hamburger (correct mobile pattern), buttons go full-width-stacked (correct mobile reflow). Wordmark, eyebrow, accent system all consistent with §F9/§B/§G6.
- **Anomalies flagged:** Buttons stack full-width — expected. No overflow. None.
- **Open question for owner:** none.

## Screenshot: mobile-dark-index-section-typography.png
- **Surface captured:** §3 Typography section, mobile.
- **Viewport / theme:** mobile (375w) × dark.
- **What's rendered:** "§3 — TYPOGRAPHY" pill marker. "DISPLAY / HERO" eyebrow + huge "HERO TITLE GRADIENT" display title (GRADIENT gradient-filled). A "TYPE SCALE" card with the heading ladder (H3 Card Header / H4 Subsection / H5 Label Heading / H6 MICRO LABEL visible — H1/H2 scrolled above). A "TEXT UTILITIES" card: body / secondary / muted / accent / "Gradient Text" / "OVERLINE LABEL" / "UI LABEL / CATEGORY" / caption samples. A "CODE / MONO" block with inline code chips (`ts-mono`, `—ts-accent`, `—ts-radius-base`).
- **Cross-reference vs design DNA:** Same DNA confirmations as the desktop typography capture — §B4 caps role-lock (H6 uppercase, H3–H5 mixed), §B1 tracking, gradient-text utility. At mobile fidelity (this capture is crisp) the body/secondary/muted text tiers are clearly differentiated by color — confirms §C text-tier hierarchy.
- **Anomalies flagged:** The inline code chips render with a light/pale background pill — they read clearly. Heading "H3 — Card Header" and "H4 — Subsection" are clearly weight-differentiated here (H3 lighter-weight than H4's bolder look is actually inverted-looking at a glance — H4 appears BOLDER than H3). Possible weight-ladder oddity. MED — see open question.
- **Open question for owner:** In the mobile type-scale card, H4 ("Subsection") appears visually BOLDER/heavier than H3 ("Card Header") directly above it. DNA §B3 maps H3–H6 all to 600 semibold. If H3 and H4 are both 600 the visual weight should match — the rendered inequality suggests either a size/weight inconsistency or a rendering artifact. Confirm intended H3 vs H4 weight.

## Screenshot: mobile-dark-index-section-components.png
- **Surface captured:** §04 Components section, mobile.
- **Viewport / theme:** mobile (375w) × dark.
- **What's rendered:** Very tall capture, heavily downscaled. Visible: "§04 — COMPONENTS" pill marker, faint section dividers, a chip/button strip, a data-table card (orange-accented rows), an icon-list column. Large empty dark regions between clusters.
- **Cross-reference vs design DNA:** Same content as desktop-dark-index-section-components, single-column reflow. Consistent.
- **Anomalies flagged:** Diagnostic at macro level only — extreme downscale (capture-crop artifact, method note). No macro break. LOW.
- **Open question for owner:** none.

## Screenshot: mobile-dark-index-section-ui-kit.png
- **Surface captured:** §06 Enhanced UI Kit section, mobile.
- **Viewport / theme:** mobile (375w) × dark.
- **What's rendered:** "§06 — ENHANCED UI KIT COMPONENTS" pill marker. An "INTERACTIVE TOOLTIPS" card — green "DEMO" pill, basic-tooltip text, three buttons (PRIMARY solid-orange / SECONDARY dark / LIVE dark-red), icon-tooltip row, a form-element username input, "Multi-line Content" with an orange "TOOLSKIN" chip, hover/positioning bullets. An "ENHANCED NUMBER INPUTS" card — orange field labels (QUANTITY/PRICE/PROGRESS/MIN-MAX), four stepper inputs with up/down chevrons, three bullet rows below.
- **Cross-reference vs design DNA:** Number-input steppers confirm §F5. Buttons confirm §F3 (PRIMARY = solid orange). Field labels render in orange — accent-as-label-emphasis. Green "DEMO" pill = §F1 status chip. The "LIVE" button renders dark-red — possibly a danger-variant button or a hover state frozen by the capture.
- **Anomalies flagged:** The "LIVE" button renders in a muted dark-red — DNA §F3 lists `--danger` as a status-color button variant; if "LIVE" is meant to be a danger/recording indicator this is consistent. If "LIVE" should be a neutral or accent button, the red is unexpected. LOW. Otherwise clean.
- **Open question for owner:** Is the dark-red "LIVE" button in the Interactive Tooltips card an intentional `--danger`/recording variant, or an unintended color?

## Screenshot: mobile-dark-index-section-marquee-documentation.png
- **Surface captured:** Marquee component documentation, mobile. CRISP capture.
- **Viewport / theme:** mobile (375w) × dark.
- **What's rendered:** A brown/dark marquee band at top ("Infinite scrolling text m…"). "MARQUEE COMPONENT" pill marker. A "FEATURES" card (orange-check bullets: Configurable via CSS variables / Responsive and performant / Auto-calculates text repeats / Viewport-aware pausing). A `marquee-variables.css` code panel — **legibly readable** monospace CSS. Below: live marquee strips — a large light-text "Design, S…" on a brown band, a smaller dark-band marquee "…gn, Software And Ma…", and an orange-text "Design," marquee on a brown band.
- **Cross-reference vs design DNA:** The code panel is fully legible here and is the AUTHORITATIVE on-screen token source. It reads:
  `--ts-marquee-speed: 45s;` (matches DNA §E3 ✓)
  `--ts-marquee-font-size: 2rem;` (DNA §F7 says `var(--ts-fs-hero)` — the rendered value is a literal `2rem`, NOT a token reference — CONTRADICTION)
  `--ts-marquee-color: var(--ts-accent);`
  `--ts-marquee-bg: var(--ts-bg-1);` (DNA §F7 says `var(--ts-accent-glow-bg-2)` — CONTRADICTION)
  `--ts-marquee-border: 1px;`
  `--ts-marquee-radius: var(--ts-radius-lg);` (matches DNA §F7 ✓)
  `--ts-marquee-pad: var(--ts-sp-8);` (matches DNA §F7 ✓)
  `--ts-marquee-gutter: var(--ts-sp-6);` (DNA §F7 names this `--ts-marquee-separator` — CONTRADICTION)
  `--ts-marquee-weight: 600;` (matches DNA §F7 ✓)
- **Anomalies flagged:** THREE concrete DNA-vs-rendered-CSS contradictions in the marquee token set (bg value, font-size token-vs-literal, separator/gutter naming). HIGH — this is exactly the "code-text extraction missed reality" failure mode Pattern 17 exists to catch. Also: `--ts-marquee-bg: var(--ts-bg-1)` is a Tier-1 primitive used directly as a component token value — by design-tokens-2.0 Rule 5a that is the cardinal sin (component should set `--ts-this-bg` and use a derivative). The rendered CSS shows the live system violating its own tokenization rule. HIGH.
- **Open question for owner:** The design DNA §F7 marquee paragraph is contradicted by the rendered `marquee-variables.css` panel on THREE tokens. Which is canonical — the live CSS (shown on screen) or the DNA spec? And should `--ts-marquee-bg` route through `--ts-this-bg` per design-tokens-2.0 Rule 5a instead of referencing `--ts-bg-1` directly?

## Screenshot: mobile-dark-index-section-forms.png
- **Surface captured:** §06 Forms section, mobile.
- **Viewport / theme:** mobile (375w) × dark.
- **What's rendered:** Very tall capture, heavily downscaled. Visible: "§06 — FORMS…" pill marker, a large empty dark region, then a cluster of color-swatch rows — WHITE, ORANGE, then bright YELLOW / LIME-GREEN / WHITE / MAGENTA-PINK swatch tiles each with a small label. Large empty regions above and below.
- **Cross-reference vs design DNA:** Same color-swatch demo content as desktop-dark-index-section-forms (high-chroma demo swatches). Single-column reflow.
- **Anomalies flagged:** Extreme downscale — diagnostic at macro level only (method note). The high-chroma yellow/lime/magenta swatches are demo content (color-engine showcase), not a theme regression — same call as the desktop forms capture. The bulk of the form-controls content is compressed to illegibility by the capture crop. LOW (capture-tool artifact).
- **Open question for owner:** none.

## Screenshot: mobile-dark-index-section-cards.png
- **Surface captured:** Cards section, mobile.
- **Viewport / theme:** mobile (375w) × dark.
- **What's rendered:** Tall downscaled capture. Visible: pricing cards stacked single-column — `$199` (orange "RECOMMENDED" badge, orange "SELECT STUDIO" CTA, "All Toolcore Modules"), `$899` (White-label Rights / Dedicated Architect / 24/7 Hotline, "CONTACT SALES" button). "3D FLIP CARDS (HOVER)" pill marker. Then numbered feature cards stacked single-column (01 DYNAMICS / 02 VISUALS / 03 SPEED, headings in orange) — and a second set of the same numbered cards below.
- **Cross-reference vs design DNA:** Same content as desktop-dark-index-section-cards, single-column reflow. Pricing-card emphasis (orange border/CTA on the recommended tier) and numbered flip-cards consistent with §F4/§C1.
- **Anomalies flagged:** Two visually-identical sets of numbered cards = front/alt faces of the flip-card demo (same as desktop). Heavy downscale on the empty regions (capture artifact). None HIGH.
- **Open question for owner:** none.

## Screenshot: mobile-dark-index-section-panels.png
- **Surface captured:** §05 Tool Panels section, mobile. Reasonably crisp.
- **Viewport / theme:** mobile (375w) × dark.
- **What's rendered:** "§05 — TOOL PANELS" pill marker, "TOOL PANEL — CONTROL BLOCK" label. A "SIDEBAR NAV" panel — MAIN group (Dashboard ACTIVE with orange fill + orange left accent bar, Analytics, Projects), SETTINGS group (Appearance, Analytics, Security, Projects) — each row a FontAwesome glyph + label. "APP TOPBAR" with logo + Dashboard nav. Five "NAV VARIANT" labeled rows. "DASHBOARD APP SHELL (MINI PREVIEW)" pill marker at bottom.
- **Cross-reference vs design DNA:** Confirms §F6 nav/tree — the active "Dashboard" row shows the flush full-height orange left accent stripe + accent fill + on-accent text, exactly §F6/§C1. FontAwesome glyphs render cleanly. Same content as desktop-dark-index-section-panels, single-column.
- **Anomalies flagged:** Some "NAV VARIANT" rows show content slightly clipped at the right edge ("Settings" label truncated) — this is the mobile-narrow reflow of horizontal nav variants that are intentionally wider than the viewport (they demo overflow/icon-only collapse). Reads as intended demo behavior, not a layout bug, but worth a glance. LOW.
- **Open question for owner:** none.

## Screenshot: mobile-dark-index-section-social-links.png
- **Surface captured:** Social Links section, mobile. CRISP.
- **Viewport / theme:** mobile (375w) × dark.
- **What's rendered:** Six labeled brand-icon variant groups stacked: STANDARD, LIGHT, DARK, ACCENT (orange tiles), ROUNDED (circular), FLAT (borderless), COLORED ("hover for brand colors"), COMBINED: ROUNDED + ACCENT (orange circular). Each group a horizontal row of FB/Twitter/IG/LinkedIn (+ GitHub/YouTube/Pinterest/TikTok on the wider rows).
- **Cross-reference vs design DNA:** Same as desktop-dark-index-section-social-links. All brand icons render correctly — FontAwesome 6 brand glyphs healthy at mobile size, no tofu. ACCENT variant solid orange + on-accent icon. ROUNDED = `--ts-radius-full`.
- **Anomalies flagged:** None. Icon system healthy.
- **Open question for owner:** none.

## Screenshot: mobile-dark-index-section-footer-showcase.png
- **Surface captured:** Footer Components section, mobile.
- **Viewport / theme:** mobile (375w) × dark.
- **What's rendered:** Downscaled capture. Footer link columns reflow to a stacked/compressed layout, a "NEWSLETTER" block with email input + orange "Subscribe" button, the testimonial quote card ("The token-depth and dynamic color engine are unparalleled…") with an orange accent bar.
- **Cross-reference vs design DNA:** Same content as desktop-dark-index-section-footer-showcase, mobile reflow. Consistent — §F5 input + §F3 button + accent-bar quote card.
- **Anomalies flagged:** Downscaled — fine detail compressed (method note). No macro break. LOW.
- **Open question for owner:** none.

## Screenshot: mobile-dark-index-section-mockups.png
- **Surface captured:** "Toolpanel Mockup Previews" CTA section, mobile. CRISP.
- **Viewport / theme:** mobile (375w) × dark.
- **What's rendered:** Eyebrow "PORTFOLIO · LIVE DEMOS", two-line two-tone title "Toolpanel Mockup Previews" (Toolpanel orange), descriptor paragraph, full-width solid-orange "EXPLORE MOCKUPS" CTA. A small dark "Lab"-labeled floating tab is visible at the right edge (a side-rail toggle/affordance). Faint ghost imagery behind.
- **Cross-reference vs design DNA:** Same as desktop-dark-index-section-mockups, mobile reflow — centered, button full-width. Center-symmetric layout (same §G6 observation as the desktop capture).
- **Anomalies flagged:** A small dark side-tab labeled "Lab" / icon is pinned to the right viewport edge mid-section — appears in several mobile captures (ui-kit, marquee, panels-area) — this is a persistent floating side-rail affordance (likely the "Toolskin Lab" / editor launcher). It overlaps section content slightly. LOW — confirm it is intended fixed furniture, not a stuck overlay.
- **Open question for owner:** A small floating "Lab"/editor side-tab is pinned to the right edge across multiple mobile captures and lightly overlaps content. Confirm it is intended persistent UI (an editor/lab launcher), not a debug or stuck-overlay artifact.

## Screenshot: mobile-dark-index-section-banner-generator.png
- **Surface captured:** Banner Generator section, mobile.
- **Viewport / theme:** mobile (375w) × dark.
- **What's rendered:** Orange pill eyebrow ("TOOLSKIN TOOL"), "Banner Generator" title (Banner in orange), descriptor with orange-highlighted phrases, a single-column feature-icon list (8 rows: Gradient Text with custom color stops / Multiple fonts & weight controls / Background presets & noise layers / Preset sizes OG-HD-4K & custom / Icon picker with 1400+ Ionicons / PNG-JPEG export at 2× resolution / Live preview with real-time controls / Save & load preset configurations), an orange "LAUNCH BANNER GENERATOR" button. Behind/right edge: a partial bleed of a large MAGENTA shape/wordmark (the magenta banner-preview panel from the desktop capture, edge-visible here).
- **Cross-reference vs design DNA:** Feature list confirms the Banner Generator references "1400+ Ionicons" — consistent with DNA §G4 / CLAUDE.md §5b (FontAwesome 6 + Ionicons icon stack). LEFT content is orange-accent, consistent.
- **Anomalies flagged:** The magenta panel bleeds in from the right edge (same magenta banner-preview as the desktop banner-generator capture). Same MED flag as desktop — confirm intentional color-engine demo. Feature list mentions Ionicons (1400+) — confirms the dual icon system; no broken glyphs in the list's own icon tiles. MED (magenta), inherited.
- **Open question for owner:** Same as desktop-dark-index-section-banner-generator — confirm the magenta banner-preview panel is intentional color-engine demo output.

## Screenshot: mobile-dark-index-section-portfolio.png
- **Surface captured:** §07 Portfolio Showcase section, mobile.
- **Viewport / theme:** mobile (375w) × dark.
- **What's rendered:** NOT RENDERABLE — the PNG exceeds the API's 2000px max dimension for many-image requests and could not be loaded in this audit context. Based on `desktop-dark-index-section-portfolio.png` (analyzed in full) and `mobile-dark-index-fullpage.png`, the mobile portfolio section contains the same content — the toolpanel portfolio card grid (YouTube Toolpanel / Suno Automation / Higgsfield Automation / Banner Generator cards with multi-color version badges + an expanded YouTube Toolpanel detail panel) reflowed to a single column.
- **Cross-reference vs design DNA:** Cannot cross-reference rendered pixels for this specific file. Desktop equivalent confirmed §F4 cards + §F1 status-chip badges + healthy icon glyphs.
- **Anomalies flagged:** A1-tooling: capture not renderable in this context (>2000px). LOW (tooling, not a design defect). Owner should re-view this PNG directly or have it re-captured at a constrained height so a future audit pass can render it.
- **Open question for owner:** none (design); tooling note only.

═══════════════════════════════════════════════════════════════════════
## Anomalies — Batch A1
═══════════════════════════════════════════════════════════════════════

1. **[mobile-dark-index-section-marquee-documentation.png — HIGH]** The rendered `marquee-variables.css` code panel contradicts design DNA §F7 on THREE tokens: (a) `--ts-marquee-bg: var(--ts-bg-1)` rendered vs `var(--ts-accent-glow-bg-2)` in DNA; (b) `--ts-marquee-font-size: 2rem` rendered as a raw literal vs `var(--ts-fs-hero)` token in DNA; (c) spacing token named `--ts-marquee-gutter` rendered vs `--ts-marquee-separator` in DNA. The text-derived DNA §F7 marquee paragraph is stale relative to the live CSS. This is the exact Pattern-17 failure mode (code-text extraction diverged from reality).
2. **[mobile-dark-index-section-marquee-documentation.png — HIGH]** The rendered marquee CSS uses `--ts-marquee-bg: var(--ts-bg-1)` — a Tier-1 primitive used directly as a component token value. Per `design-tokens-2.0` Rule 5a/5b this is the "cardinal sin" (component must set `--ts-this-bg` and reference a derivative). The live system visibly violates its own tokenization architecture in the marquee component.
3. **[desktop-dark-index-section-marquee-documentation.png — MED]** A flat solid-orange marquee band is rendered, which the DNA §F7 "accent-glow background" claim does not predict; reconciles with anomaly #1 (bg is actually `--ts-bg-1` + an accent variant), confirming the DNA's marquee-bg description is wrong.
4. **[desktop-dark-index-section-banner-generator.png + mobile-dark-index-section-banner-generator.png — MED]** A fully MAGENTA/PINK-themed "TOOLSKIN" wordmark + magenta accents + magenta hexagon mark render in the Banner-Generator right-hand panel. Almost certainly an intentional color-engine hue-swap demo (banner-preview carousel), but it is the single most theme-divergent frame in the batch and needs explicit owner confirmation it is not a theme-scope leak.
5. **[desktop-dark-index-section-typography.png — MED]** H1 (900 black) and H2 (800) in the heading ladder render at near-identical visual weight — the top of the type ladder is weakly differentiated. Ties directly to DNA OQ-B3 (literal `800` vs token ambiguity); the rendered result confirms the concern is real, not theoretical.
6. **[mobile-dark-index-section-typography.png — MED]** In the mobile type-scale card, H4 ("Subsection") renders visually BOLDER than H3 ("Card Header") directly above it, despite DNA §B3 mapping both H3 and H6 range to 600 semibold. Suggests an H3-vs-H4 weight/size inconsistency in the live CSS or a rendering inversion.
7. **[mobile-dark-index-section-mockups.png + others — LOW]** A small floating "Lab"/editor side-tab is pinned to the right viewport edge across multiple mobile captures and lightly overlaps section content. Likely intentional persistent UI (lab/editor launcher) but unconfirmed.
8. **[mobile-dark-index-section-ui-kit.png — LOW]** The "LIVE" button in the Interactive Tooltips card renders dark-red — possibly an intentional `--danger`/recording variant, possibly an unintended color.
9. **[desktop-dark-index-section-mockups.png + mobile-dark-index-section-mockups.png — LOW]** The "Toolpanel Mockup Previews" band is fully centered/symmetric, which DNA §G6 flags as a Toolskin anti-pattern for heroes. Likely acceptable because it is a secondary CTA band (not the primary hero), but the anti-pattern's scope should be clarified.
10. **[ALL per-section captures — LOW, capture-tool artifact]** Per-section captures vary enormously in resolution (panels ~960px crisp; most others ~480px soft) and contain large empty dark regions from the section-height crop logic in `capture.mjs`. The three full-page captures are downscaled so heavily (heights 21k–41k px) they are macro-diagnostic only. Not a design defect — a capture-pipeline limitation that constrains fine-grained inspection of the softer frames.
11. **[mobile-dark-index-section-portfolio.png — LOW, tooling]** This PNG exceeds the API 2000px many-image dimension limit and could not be rendered/analyzed in this audit context. Content is covered by the desktop portfolio capture; the file should be re-viewed directly by the owner or re-captured at constrained height.
12. **[desktop-dark-index-section-components.png + desktop-dark-index-section-forms.png — LOW]** Status chips and demo color swatches render at very high chroma (saturated green/teal/yellow/lime/magenta). Confirmed as intentional demo/showcase content (color-engine + status-chip demos), not a theme regression — logged so a future audit does not re-flag it.

═══════════════════════════════════════════════════════════════════════
## Owner-pending questions — Batch A1
═══════════════════════════════════════════════════════════════════════

1. **[marquee-documentation captures]** Design DNA §F7 is contradicted by the rendered `marquee-variables.css` panel on THREE tokens (bg = `--ts-bg-1` not `--ts-accent-glow-bg-2`; font-size = literal `2rem` not `var(--ts-fs-hero)`; spacing = `--ts-marquee-gutter` not `--ts-marquee-separator`). Which is canonical for the rebuild — the live CSS shown on screen, or the DNA spec? (Recommend: live CSS wins, update DNA §F7.)
2. **[marquee-documentation captures]** Should the rebuilt marquee's `--ts-marquee-bg` route through `--ts-this-bg` + a derivative (per `design-tokens-2.0` Rule 5a), instead of referencing the `--ts-bg-1` primitive directly as the live CSS does?
3. **[banner-generator captures]** Confirm the magenta/pink-themed "TOOLSKIN" wordmark + magenta hexagon mark in the Banner-Generator right panel are intentional color-engine demo output (not a theme-scope leak). And: is the magenta hexagon a real Toolskin brand mark? DNA OQ-Logo states no icon-logo/mark system is documented — if this hexagon is canonical it should be captured into the design DNA.
4. **[desktop + mobile typography captures]** DNA OQ-B3 is visually confirmed: H1 (900) vs H2 (800) are weakly differentiated, and on mobile H4 appears bolder than H3. Should the rebuild widen top-of-ladder weight contrast and/or audit H3-vs-H4 weight? An explicit weight resolution is needed.
5. **[mockups captures]** Is the fully centered/symmetric "Toolpanel Mockup Previews" band acceptable given §G6 flags symmetric center-aligned heroes as an anti-pattern — i.e. does the §G6 anti-pattern apply only to the primary hero, or to all hero-style bands?
6. **[mobile-dark-index-section-mockups.png + other mobile captures]** Confirm the floating right-edge "Lab"/editor side-tab is intended persistent UI furniture, not a debug/stuck overlay; if intended, the design DNA should document this side-rail affordance.
7. **[mobile-dark-index-section-ui-kit.png]** Is the dark-red "LIVE" button in the Interactive Tooltips card an intentional `--danger`/recording-indicator variant, or an unintended color?


# Rebuild Visual Audit — Batch A2

**Analyst:** Wave 1.6 Visual Audit Analyst — Batch A2
**Scope:** Playwright headless captures of `index.html`, LIGHT theme
**Date:** 2026-05-19
**Screenshots analyzed:** 28 of 29 fully (mobile portfolio section is a documented partial — see note below)
**Primary cross-reference:** `docs/handoffs/_rebuild-design-dna.md` (Wave 1.5 Design DNA Spec)
**In-house skills consulted:** `expert-designer`, `typography-master`, `design-tokens-2.0`
**Output discipline:** Extraction only — describes rendered reality, proposes no alternatives. Contradictions surfaced, never reconciled.

---

## ⚠ CRITICAL CONTEXT — read before the per-screenshot sections

Two cross-cutting observations dominate this batch and are **stated once here** to avoid repeating them 29 times:

1. **CAPTURE ARTIFACT — sticky topbar overlap (NOT a real bug).** Every *per-section* desktop and mobile capture shows the orange "NEW" announcement banner + the white sticky topbar painted **on top of** the section content, roughly one-third down the frame. This is a Playwright scroll-to-section artifact: the topbar is `position: sticky` (DNA F9) and the announcement bar is `position` fixed/sticky, so when the script scrolls a section into view the sticky chrome overlays it. The *full-page* captures do NOT show this. **Treated as a capture-method artifact, not a Toolskin rendering defect.** Where a per-section shot is otherwise clean, it is scored clean.

2. **LIGHT-THEME FULL-PAGE "EMPTY WHITE" RENDERING (genuine, HIGH severity).** All three full-page captures (desktop / tablet / mobile) render as overwhelmingly **blank near-white pages** — section eyebrows, hairline rules and faint card outlines are visible but the bulk of body text, card fills, table content and component surfaces are **washed out to near-invisibility against the `#f5f5f7`-ish light body**. The *per-section* captures (which scroll closer and the browser had more paint time) show the SAME sections rendering with full content. This points to either (a) a light-theme contrast failure where low-contrast tokens collapse against the light surface, and/or (b) a paint-timing / lazy-reveal / scroll-animation issue where content below the fold has not been revealed at full-page capture time. **This is exactly the class of "math-correct but visual-wrong" failure Pattern 17 predicts and CANNOT be seen from CSS text.** Flagged HIGH; owner triage required to separate the contrast cause from the timing cause.

---

## Screenshot: desktop-light-index-fullpage.png
- **Surface captured:** Entire `index.html` page, top to footer.
- **Viewport / theme:** Desktop × light.
- **What's rendered:** Orange topbar with TOOLSKIN wordmark at top; a solid orange hero band; a large "HERO TITLE GRADIENT" heading; below that the page is ~90% blank near-white. Only faint section eyebrow pills, thin hairline rules, ghost card outlines, a faint orange-tinted "Design, Software…" marquee band, and three small orange-text cards low on the page are discernible. The vast majority of body content does not read.
- **Cross-reference vs design DNA:** Topbar and hero match DNA (F9 topbar, accent-solid hero). But DNA §G6 says Toolskin rejects "flat solid backgrounds" and expects gradient overlay + grain + radial glow as atmospheric layers — the rendered page is instead a flat near-white void. DNA gives no instruction that the bulk of the page should be invisible. Rendered reality diverges hard from any documented intent.
- **Anomalies flagged:** HIGH — near-total content washout on the light-theme full page (see Critical Context #2). Body text, card surfaces, tables and components fail to read against the light body surface.
- **Open question for owner:** Is the empty-white full page a light-theme contrast-token failure, or a scroll-reveal/lazy-paint timing artifact of the headless capture? The per-section shots render fine, which suggests timing — but the washed-out text in mid-page bands suggests contrast. Which is it?

## Screenshot: desktop-light-index-section-top.png
- **Surface captured:** Topbar + announcement bar + hero section.
- **Viewport / theme:** Desktop × light.
- **What's rendered:** Top: orange announcement strip ("NEW: Explore our interactive Toolpanel Mockups…") with a dark "BOOK WEBSITE" pill and a close ×. Below: white topbar — "TOOL SKIN" wordmark (SKIN in orange), nav items HOME / TYPE / COMPONENTS / UI KIT / FORMS / CARDS / PANELS / MOCKUPS, plus a "BANNER UI" outline button, a solid-orange "SURFACES LAB" button, a "DEFAULT ▾" select, and a moon (dark-mode) toggle. Hero: warm peach-to-white gradient wash; an orange-outline eyebrow pill "FOURTH EDITION · V3.2.0 · 2026"; a very large black "TOOLSKIN" wordmark (SKIN in orange); a short body paragraph; a solid-orange "VIEW COMPONENTS" button + an outline "DESIGN TOKENS" button; a row of 6 rounded accent swatches (orange/teal/blue/purple/pink/grey).
- **Cross-reference vs design DNA:** Strong match. Wordmark is uppercase + tracked (DNA B4, F9). Display title is uppercase + heavy/black weight (DNA B3, B4). Eyebrow pill uses wide tracking (DNA B1, B7). Primary button is solid accent (DNA C1). Outline button is transparent w/ dim border (DNA F3). Hero uses a gradient wash + asymmetric left-aligned composition (DNA §G6 — heroes use spatial tension, not centered symmetry — confirmed).
- **Anomalies flagged:** MED — the announcement bar's leading icon (a megaphone, far left) renders as a dark glyph on the orange bar with low contrast; legible but muted. MED — a small dark rounded element floats at the right viewport edge (vertically centered) — appears to be an off-canvas "Editor" tab handle clipped at the edge; see ui-kit/forms shots where it reads as a black "Editor" pill. Not obviously broken but visually unexplained on the hero.
- **Open question for owner:** The right-edge black tab handle ("Editor", a vertical sandbox toolbar) appears in nearly every desktop capture pinned to the viewport edge — is it intended to be visible on the public showcase page, or is it a dev-only tool that should be hidden in the captured build?

## Screenshot: desktop-light-index-section-typography.png
- **Surface captured:** §3 Typography section — display/heading ladder + text utilities.
- **Viewport / theme:** Desktop × light.
- **What's rendered:** "DISPLAY / HERO" orange eyebrow; huge black "HERO TITLE" with "GRADIENT" below it where "GRAD" is dark and "IENT" is orange (a gradient-text treatment). Below: heading ladder H1 "— Display Heading", H2 "— Section Title", H3 "— Card Header", H4 "— Subsection", H5 "— Label Heading", H6 "— MICRO LABEL" (H6 uppercased). A panel at right shows body / lead / secondary / muted / accent / gradient text samples. Low-contrast caption rows at the bottom.
- **Cross-reference vs design DNA:** Heading ladder confirms DNA B2/B3 — weights escalate and H1/display are heaviest; H6 alone is uppercase (DNA B4). Letter-spacing on the display title looks tight (DNA B1). The "GRADIENT" word splitting dark→orange is a literal render of the gradient-text utility.
- **Anomalies flagged:** MED — the gradient-text "GRADIENT" word: the "GRAD" portion renders near-black/very-dark-brown and only "IENT" is clearly orange. On the light surface the dark half of the gradient looks almost like a rendering glitch rather than an intentional ramp. Possible light-theme gradient-stop issue. LOW — caption/utility text at the section bottom is very faint against the light surface (contrast watch).
- **Open question for owner:** Is the gradient-text effect meant to ramp dark→accent (so half the word reads near-black on light bg), or should both stops stay within the accent family so the whole word reads as colored?

## Screenshot: desktop-light-index-section-components.png
- **Surface captured:** §4 Components — enhanced data table + list components.
- **Viewport / theme:** Desktop × light.
- **What's rendered:** Top half is mostly blank light surface with faint ghost outlines (capture scrolled mid-section). Visible: an orange-outline eyebrow; a filter chip row ("ALL" active = solid orange, plus inactive chips); an "ENHANCED DATA TABLE" card with a dark/black table header row, zebra-striped body rows, status chips (green/orange/etc.), and small action controls; below, three "list" cards each with orange leading icons + label rows. Sticky topbar overlay artifact present mid-frame.
- **Cross-reference vs design DNA:** Active filter chip is solid accent — confirms DNA C1/F1 (accent solid only on active chip / primary button). Status chips swap accent to status colors (DNA F1 variants). Data table dark header is a deliberate contrast device. List-card leading icons are FontAwesome-style orange glyphs and render correctly (DNA §G4 — Toolskin uses Font Awesome, not Lucide — confirmed).
- **Anomalies flagged:** MED — upper portion of the section is blank/ghosted (same washout family as the full-page issue; here partly capture-scroll). LOW — list-card body label text is light-grey and low-contrast on the light card surface.
- **Open question for owner:** none.

## Screenshot: desktop-light-index-section-ui-kit.png
- **Surface captured:** §5 Enhanced UI Kit — toast alerts, tooltips, number inputs, Lab/sortable components.
- **Viewport / theme:** Desktop × light.
- **What's rendered:** Eyebrow "§5x — ENHANCED UI KIT COMPONENTS"; toast/alert cards (success/warning/error variants with colored left accent + icon); "INTERACTIVE TOOLTIPS" card with state-tooltip buttons; "ENHANCED NUMBER INPUTS" card with stepper inputs; "LAB COMPONENTS" card with sortable lists (drag rows) and a wide solid-orange "EXPLORE LAB" CTA at the bottom.
- **Cross-reference vs design DNA:** Toast variants use a semantic colored left-border (DNA F12 — confirmed). Number-input steppers and tooltip components render with derivative surfaces. The wide CTA is solid accent (DNA C1). Sortable Lab rows render as flat list rows.
- **Anomalies flagged:** LOW — section header / sub-labels are low-contrast grey on light. Sticky-topbar overlay artifact mid-frame (capture artifact). Otherwise clean.
- **Open question for owner:** none.

## Screenshot: desktop-light-index-section-marquee-documentation.png
- **Surface captured:** §6 Marquee component — feature list + CSS variable code panel + live marquee strips.
- **Viewport / theme:** Desktop × light.
- **What's rendered:** A card with a checklist of marquee features (orange check icons) on the left and a dark-themed code block ("marquee-variables.css") on the right showing `--ts-marquee-*` tokens. Below, two live marquee strips: a large one "Design, Software And Marketing Systems For The…" on a pale salmon/peach band, and a second smaller strip; the second strip shows the duplicated text plus an orange-colored "Design, Softwar…" copy on a salmon band.
- **Cross-reference vs design DNA:** Marquee bg is a pale accent-glow band — DNA F7 says `--ts-marquee-bg: var(--ts-accent-glow-bg-2)` (radial accent glow, not solid) — the rendered pale-salmon band is consistent with a light-theme rendering of an accent glow. Duplicated text strip confirms the `translateX(-50%)` seamless-duplication pattern (DNA E3/F7). Code block is dark even in light theme (intentional code-surface treatment).
- **Anomalies flagged:** LOW — the marquee text is near-black on a pale-salmon band; contrast is adequate but the band itself is very washed out (light-theme accent-glow reads as barely-there pink). Not broken. Capture shows topbar overlay artifact.
- **Open question for owner:** In light theme the accent-glow marquee background renders as a very faint pink wash — is that the intended light-mode appearance, or should the marquee band carry more accent presence in light theme?

## Screenshot: desktop-light-index-section-forms.png
- **Surface captured:** §6/7 Forms — inputs, sliders, color swatches, accordions, code samples.
- **Viewport / theme:** Desktop × light.
- **What's rendered:** A long forms section. Visible: text inputs with labels (one with an inset orange "+" action button, one a search field with inset action), a textarea, a checkbox row ("Enable auto-scheduling"), a slider group with orange-filled track sliders and numeric readouts, a row of bright color swatches (orange / lime-yellow / pink / etc.) under a "GRID OR FLEX" heading, a dark code block, and a stack of accordions (single/group/separated variants) and toggle rows.
- **Cross-reference vs design DNA:** Inputs render translucent with derivative surfaces and 1px borders (DNA F5). Inset-action button on the input flattens flush to the input's right edge — confirms DNA D3/F5 (inset-action variant, sharp right corners). Sliders use accent-filled tracks. Accordions render as a derivative-sized item list (DNA F10). Color swatches are very saturated/bright.
- **Anomalies flagged:** MED — the color-swatch row renders extremely vivid lime-yellow and hot-pink tiles that look almost neon against the light surface; consistent with a configurable accent demo, but the saturation is jarring vs the otherwise restrained orange identity (DNA §G6 expects "dominant color + sharp accents," not a neon spread). Likely an intentional palette-swatch demo — flag for confirmation. LOW — input idle text is light/secondary-tier and faint on light bg (DNA F5 says idle text uses a secondary tier — confirmed, but light-theme legibility is marginal).
- **Open question for owner:** The bright lime/pink swatch tiles — are these a deliberate "accent is reconfigurable" demonstration, or sample content that happens to look off-brand on the light surface?

## Screenshot: desktop-light-index-section-cards.png
- **Surface captured:** §7 Cards — blank/accent/interactive cards, pricing cards, 3D flip cards.
- **Viewport / theme:** Desktop × light.
- **What's rendered:** Top: three small example cards (Blank Card / Accent Bar / Interactive Card). Middle: three pricing cards — "$49", a highlighted "$199" card with a pink/salmon-tinted fill + solid-orange "SELECT PLAN" button (the recommended tier), and "$899"; each lists feature rows with orange check icons. Below: an "§7 — FLIP CARDS [ABOVE]" eyebrow and two rows of three flip cards each (01 DYNAMICS / 02 VISUALS / 03 SPEED) with orange numerals + orange titles.
- **Cross-reference vs design DNA:** Pricing-card "recommended" tier uses a tinted accent fill + solid accent CTA — consistent with DNA C1 (solid accent on primary CTA; tinted accent elsewhere). Cards are surface containers (DNA F4). Flip cards render their front face. The accent-bar card shows a thin orange left bar.
- **Anomalies flagged:** MED — the highlighted "$199" pricing card fill renders as a flat pale-salmon/pink rather than a confident accent tint; on the light surface the "recommended" emphasis is weak. LOW — flip-card body text ("Hover to inspect") is very faint grey. Topbar overlay artifact mid-frame.
- **Open question for owner:** The recommended-tier pricing card: is the pale-pink tinted fill the intended light-mode treatment, or should the recommended card carry stronger accent emphasis to stand out from the $49/$899 neutral cards?

## Screenshot: desktop-light-index-section-panels.png
- **Surface captured:** §6c Tool Panels — toolpanel control block, sidebar nav, app topbars, nav variants, app-shell preview.
- **Viewport / theme:** Desktop × light. (Highest-resolution capture in the batch — most detail readable here.)
- **What's rendered:** Eyebrow "§6c — TOOL PANELS". "TOOL PANEL — CONTROL BLOCK": a panel titled "YSS TOOLPANEL · 4.2.2" with a header (gear/settings/chevron controls), a solid-orange "SCHEDULE" primary action, secondary buttons (pause, "DISABLE NOTIFS", "DOWNLOADER", "UPLOADER", "EXPORT"), a monospace log line "[10:22:08] [Scheduler] Rate limit detected — throttling" in orange, and a status footer ("Status: Idle / Total: 147 / Page: 1/6"). "SIDEBAR NAV": a vertical nav card — MAIN group with "Dashboard" active (pale-salmon fill + orange icon/text), "Analytics", "Projects"; SETTINGS group with "Appearance", "Analytics", "Security", "Projects". "APP TOPBAR": a compact app topbar with TOOLSKIN logo + Dashboard/Analytics/Settings nav + a solid-orange "+ NEW" button + a bell. Then five nav-variant demos (default / spaced / icon-only / combined / dropdown-separators). Bottom: "DASHBOARD APP SHELL [MINI PREVIEW]" eyebrow.
- **Cross-reference vs design DNA:** Sidebar nav active item = tinted (pale) accent fill + accent icon/text — consistent with DNA C1 (accent tinted, not solid, for nav active state). Primary panel action "SCHEDULE" is solid accent (DNA C1, F3). Buttons are uppercase + tracked (DNA B4, F3). Monospace log line uses the mono font (DNA — JetBrains Mono anchor). Panel surfaces are derivative-tinted containers. Nav variants render distinctly. FontAwesome/Ionicon glyphs in the sidebar render correctly.
- **Anomalies flagged:** LOW — section sub-labels ("TOOL PANEL — CONTROL BLOCK", "SIDEBAR NAV", "APP TOPBAR", nav-variant captions) are low-contrast grey on light. Otherwise this section renders cleanly and completely — the strongest light-theme section in the batch.
- **Open question for owner:** none.

## Screenshot: desktop-light-index-section-social-links.png
- **Surface captured:** §? Social Links — social-icon component style variants.
- **Viewport / theme:** Desktop × light.
- **What's rendered:** "Social Links" H-heading + a body line. Then a grid of variant rows, each labelled: STANDARD, LIGHT, DARK, ACCENT, ROUNDED, FLAT, COLORED (— hover for brand colors), and COMBINED: ROUNDED + ACCENT. Each row shows social glyphs (Facebook / Twitter / Instagram / LinkedIn / GitHub / YouTube / Pinterest / TikTok) in different chip treatments — square, rounded-square, circular, accent-orange-filled, flat, etc.
- **Cross-reference vs design DNA:** Icon glyphs render correctly (FontAwesome brand icons — DNA §G4 confirmed). ACCENT and COMBINED variants show solid/ tinted accent fills on the icon chips; other variants use neutral surface tiers. Treatment variety is consistent with the derivative-surface system.
- **Anomalies flagged:** LOW — variant label text (STANDARD/LIGHT/DARK/etc.) is faint grey on light. The "LIGHT" variant chips are near-white on the near-white page and read with very low contrast (a light-on-light edge case). Otherwise clean.
- **Open question for owner:** The "LIGHT" social-icon variant renders white chips on the light page surface and nearly disappears — is the LIGHT variant intended for use only on darker surfaces?

## Screenshot: desktop-light-index-section-footer-showcase.png
- **Surface captured:** Footer Components section — footer link columns, newsletter form, testimonial.
- **Viewport / theme:** Desktop × light.
- **What's rendered:** "Footer Components" heading + description. Four link columns (Documentation/Components/Layouts; Get Started/Examples/GitHub; About Us/Contact/Careers; Privacy Policy/Terms of Service/Cookie Policy). A "NEWSLETTER" area with an input + a faint button. A testimonial card (right) with a quote, an orange attribution name, and a role line.
- **Cross-reference vs design DNA:** Footer columns and testimonial card are layout/molecular surfaces. The testimonial card sits on a slightly darker tint than the body — surface-tier differentiation (DNA C6). Attribution name in accent color = accent-as-text-highlight (DNA C1 tinted usage).
- **Anomalies flagged:** MED — most footer text (column links, headings, newsletter copy) is very low-contrast grey on the light surface; the whole section reads as faded. The newsletter submit button is almost invisible (pale on pale). LOW — overall the footer is the most washed-out *per-section* capture, suggesting the light-theme contrast issue is real here and not purely a capture artifact.
- **Open question for owner:** Footer link text and the newsletter button render at very low contrast in light theme — is the footer intended to use muted text, and if so does the light-theme muted token meet a legibility bar?

## Screenshot: desktop-light-index-section-mockups.png
- **Surface captured:** §? Mockups — "Toolpanel Mockup Previews" promo section.
- **Viewport / theme:** Desktop × light (but section renders DARK — see below).
- **What's rendered:** A near-black full-bleed section with a faint dark backdrop image (ghosted UI panels). Centered: "PORTFOLIO · LIVE DEMOS" eyebrow, a large two-tone heading "Toolpanel Mockup Previews" (where "Tool" is orange-tinted and the rest is light/white), a muted descriptive paragraph, and a solid-orange "EXPLORE MOCKUPS" button.
- **Cross-reference vs design DNA:** This section is **intentionally dark even in light theme** — a deliberate dark "feature spotlight" band. DNA §C6 (surface re-scoping) permits a section to set its own surface tier; a dark promo band is a legitimate use. Centered text here is an exception to DNA §G6's "no symmetric centered hero" — but this is a promo band, not the hero, so not a violation. Solid-orange CTA = DNA C1.
- **Anomalies flagged:** none — the dark rendering is consistent across desktop and mobile captures and reads as intentional. Text contrast is good on the dark band (light text on near-black). LOW note only: confirm the dark band is by design and not a theme-token leak from dark mode.
- **Open question for owner:** Confirm: the Mockups section is deliberately a dark spotlight band in BOTH light and dark themes (a fixed-dark section), correct?

## Screenshot: desktop-light-index-section-banner-generator.png
- **Surface captured:** §? Banner Generator — promo split: feature list (left) + live banner preview (right).
- **Viewport / theme:** Desktop × light.
- **What's rendered:** Left: "TOOLSKIN TOOL" eyebrow, "Banner Generator" heading, a description, a two-column feature list with orange icons, and a solid-orange "LAUNCH BANNER GENERATOR" button — all on the light surface. Right: a dark near-black banner-preview canvas showing a large MAGENTA/PINK "TOOLSKIN" wordmark, a magenta "FRAMEWORK FOR CREATORS" sub-line, a magenta-outline "v1.0.0" badge, and a row of carousel dots (first dot orange).
- **Cross-reference vs design DNA:** Left half matches DNA (accent icons, solid CTA, uppercase tracked heading). The right banner-preview canvas is intentionally dark (a preview surface) and shows the banner tool rendering a **magenta** accent — i.e. the banner preview is demonstrating a *reconfigured accent hue* (DNA §4 / expert-designer: "change 3 values → retheme everything"; the accent HSL pipeline, DNA-skill Rule 8). The magenta is the banner-tool's own sample output, not a Toolskin identity color.
- **Anomalies flagged:** LOW — the magenta wordmark could be misread as an accent-token leak; but in context (a banner-generator preview canvas) it is plainly demo output showing accent reconfigurability. No defect. Topbar overlay artifact mid-frame.
- **Open question for owner:** Confirm the magenta "TOOLSKIN" in the banner preview is intentional sample output of the banner generator (demonstrating accent reconfiguration), not a stray theme value.

## Screenshot: desktop-light-index-section-portfolio.png
- **Surface captured:** §8 Portfolio Showcase — interactive automation toolpanel cards.
- **Viewport / theme:** Desktop × light.
- **What's rendered:** Eyebrow "§ — PORTFOLIO SHOWCASE"; line "Interactive automation toolpanels — hover to reveal details, click to launch." A grid of cards: "YouTube Toolpanel" (red YouTube glyph, "V4.2.7" badge, "YBB Studio & Watch modes"), "Suno Automation" (music-note icon, "V3.6.1", "AI Music Generation"), "Higgsfield Automation" (video-camera icon, "V4.6.0", "AI Video Generation"), "Banner Generator" (orange tool icon, "V0.3", "Canvas 2D Export Tool"), and a wide expanded card "YOUTUBE TOOLPANEL v4.2.7" with a description and two sub-rows ("Watch Mode / Transcript + Summarizer", "Studio Mode / Scheduler + Bulk Ops"). The topbar is visible at the very top (this capture starts near page top, minimal overlap).
- **Cross-reference vs design DNA:** Portfolio cards are surface containers (DNA F4) with version-badge chips (DNA F1 chip family). Brand glyphs (YouTube red) render correctly. The expanded card demonstrates a card-detail/hover-reveal state. Card surfaces are derivative-tinted.
- **Anomalies flagged:** LOW — card body sub-text ("AI Music Generation", etc.) is faint grey on light card surfaces. Version-badge chips are pale and low-contrast. Otherwise the section renders completely and cleanly.
- **Open question for owner:** none.

## Screenshot: tablet-light-index-fullpage.png
- **Surface captured:** Entire `index.html` page at tablet width.
- **Viewport / theme:** Tablet × light.
- **What's rendered:** Same structure as the desktop full-page: orange topbar + wordmark, orange hero band, "HERO TITLE GRADIENT" heading, then a predominantly blank near-white page with faint section eyebrows, hairline rules, the faint orange "Design, Software…" marquee band, and the three small orange-text cards low down. Layout reflows narrower (some two-column areas stack). Content remains overwhelmingly washed-out.
- **Cross-reference vs design DNA:** Same as desktop full-page — topbar/hero match DNA; the empty-white body diverges from all documented intent. No tablet-specific layout break is visible beyond the washout (reflow appears to behave).
- **Anomalies flagged:** HIGH — same near-total content washout as desktop-light-index-fullpage (Critical Context #2). Tablet does not fix or worsen it.
- **Open question for owner:** Same as desktop full-page — contrast failure vs lazy-paint timing. Does the washout reproduce identically at all three viewports because the cause is viewport-independent (i.e. a token/paint issue, not a responsive-layout issue)?

## Screenshot: mobile-light-index-fullpage.png
- **Surface captured:** Entire `index.html` page at mobile width.
- **Viewport / theme:** Mobile × light.
- **What's rendered:** An extremely tall narrow capture. Top: a sliver of orange (announcement + topbar + hero band) and a few orange button shapes; the remainder is an almost entirely blank near-white column for the full scroll length, with only the faintest hairlines and a single small orange element near the very bottom.
- **Cross-reference vs design DNA:** Same washout pattern. The per-section mobile captures (top/typography/ui-kit/marquee/panels/social-links) prove the sections DO render with content when scrolled close — reinforcing the timing-vs-contrast question.
- **Anomalies flagged:** HIGH — near-total content washout on the mobile full page (Critical Context #2).
- **Open question for owner:** Same as the other full-page captures.

## Screenshot: mobile-light-index-section-top.png
- **Surface captured:** Topbar + announcement + hero, mobile.
- **Viewport / theme:** Mobile × light.
- **What's rendered:** Orange announcement strip with × close. White topbar: "TOOL SKIN" wordmark, a moon toggle, an up-arrow, and a hamburger (☰) menu — nav collapses to a hamburger at mobile (DNA F9 + responsive). Hero: peach gradient wash, orange-outline eyebrow "DESIGN SYSTEM · V1.0.0 · 2026", large black "TOOLSKIN" wordmark (SKIN orange), a body paragraph, a solid-orange "VIEW COMPONENTS" button, an outline "DESIGN TOKENS" button, and a row of 6 accent swatches plus a dark element at the row's right end.
- **Cross-reference vs design DNA:** Matches DNA — wordmark uppercase/tracked, eyebrow wide-tracked, primary solid + outline secondary (C1/F3). Hamburger collapse is correct responsive behavior. NOTE: hero eyebrow here reads "V1.0.0" whereas the desktop hero eyebrow read "V3.2.0 · FOURTH EDITION" — see anomaly.
- **Anomalies flagged:** MED — **version-string mismatch**: desktop hero eyebrow = "FOURTH EDITION · V3.2.0 · 2026"; mobile hero eyebrow = "DESIGN SYSTEM · V1.0.0 · 2026". The topbar wordmark sub-label also reads "DESIGN SYSTEM V1.0" in several captures. Multiple inconsistent version/edition strings across the same page. (Exactly the version-mismatch class Pattern 17 warns of.) LOW — dark element clipped at the accent-swatch row's right edge (the off-canvas Editor handle again).
- **Open question for owner:** Which version/edition string is canonical — "V1.0.0 / DESIGN SYSTEM" or "V3.2.0 / FOURTH EDITION"? The page currently shows both.

## Screenshot: mobile-light-index-section-typography.png
- **Surface captured:** §3 Typography, mobile.
- **Viewport / theme:** Mobile × light.
- **What's rendered:** Orange-outline eyebrow pill "§3 — TYPOGRAPHY"; "DISPLAY / HERO" orange label; large black "HERO TITLE" + "GRADIENT" (GRAD dark, IENT orange). Heading ladder H1–H6 stacked. A "TEXT UTILITIES" panel: body / secondary / muted / accent ("Accent colored text — highlights, links") / "Gradient Text" / "OVERLINE LABEL" / "UI LABEL / CATEGORY" / "CAPTION TEXT…" samples. A "CODE / MONO" block: "Use `ts-mono` for inline code… Reference tokens like `--ts-accent` or `--ts-radius-base`" with inline-code chips.
- **Cross-reference vs design DNA:** Same as desktop typography — heading ladder confirms B2/B3, H6 uppercase (B4), eyebrow wide-tracked (B1/B7). Inline-code chips use the mono font with a tinted surface (DNA — JetBrains Mono anchor). Accent text and overline render in accent color.
- **Anomalies flagged:** MED — the gradient-text "GRADIENT" again renders its first half near-black (light-theme gradient-stop concern, same as desktop). LOW — "TEXT UTILITIES" / "UI LABEL / CATEGORY" / "CODE / MONO" sub-headings are faint grey on light.
- **Open question for owner:** Same gradient-text question as the desktop typography capture.

## Screenshot: mobile-light-index-section-components.png
- **Surface captured:** §4 Components, mobile.
- **Viewport / theme:** Mobile × light.
- **What's rendered:** Orange-outline eyebrow at top, then a long stretch of blank near-white surface with faint ghost outlines (capture scrolled mid-section / washout). Lower down: a filter chip row ("ALL" active = solid orange + inactive chips with count badges), a data-table card fragment, and a list card with orange leading icons + label rows. Sticky topbar overlay artifact mid-frame.
- **Cross-reference vs design DNA:** Active filter chip solid accent (C1/F1). List-card icons are orange FontAwesome glyphs, rendering correctly. Chip count badges render.
- **Anomalies flagged:** MED — large blank/ghosted upper portion (washout family + capture scroll). LOW — list-card label text faint on light.
- **Open question for owner:** none.

## Screenshot: mobile-light-index-section-ui-kit.png
- **Surface captured:** §5x Enhanced UI Kit, mobile.
- **Viewport / theme:** Mobile × light.
- **What's rendered:** Eyebrow "§5x — ENHANCED UI KIT COMPONENTS" + intro line; a stretch of blank surface (capture scroll); then "INTERACTIVE TOOLTIPS" card (CORE badge, tooltip buttons PRIMARY/SECONDARY/LIVE, icon tooltips, a form-element username input), and "ENHANCED NUMBER INPUTS" card (UIKIT badge; QUANTITY / PRICE($) / PROGRESS(%) / MONTHS stepper inputs; feature rows "Stacked increment controls / Keyboard navigation support / Min/max validation").
- **Cross-reference vs design DNA:** Tooltip-trigger buttons show primary (solid orange), secondary (neutral), and a third pale variant — consistent with button variant system (F3). Number-input steppers render with derivative surfaces (F5). Badges ("CORE", "UIKIT") are green/teal chip variants (F1).
- **Anomalies flagged:** LOW — blank upper portion (capture scroll). Sub-labels faint grey. Otherwise clean.
- **Open question for owner:** none.

## Screenshot: mobile-light-index-section-marquee-documentation.png
- **Surface captured:** §6 Marquee, mobile.
- **Viewport / theme:** Mobile × light.
- **What's rendered:** A pale-salmon marquee band "Infinite scrolling text m…" at top; a "MARQUEE COMPONENT" eyebrow pill; a "FEATURES" panel with orange-check feature rows ("Configurable via CSS variables", "Data attribute support", "Pause on hover (optional)", "Direction control (left/right)", "Responsive and performant", "Auto-calculates text repeats", "Viewport-aware pausing"); a dark code block "marquee-variables.css" listing `--ts-marquee-speed: 45s`, `--ts-marquee-font-size: 2rem`, `--ts-marquee-color: var(--ts-accent)`, `--ts-marquee-bg: var(--ts-bg-1)`, `--ts-marquee-radius: var(--ts-radius-lg)`, etc. Below, two more live marquee strips on salmon bands ("Design, So…" / "ftware And Marketin…" / a large orange "Design." copy).
- **Cross-reference vs design DNA:** The code block confirms several DNA F7 marquee facts directly: `--ts-marquee-speed: 45s` (DNA E3/F7), `--ts-marquee-radius: var(--ts-radius-lg)` (F7). **Contradiction surfaced:** the code block shows `--ts-marquee-bg: var(--ts-bg-1)` — but DNA F7 states `--ts-marquee-bg: var(--ts-accent-glow-bg-2)` (a radial accent glow). The showcase's own documentation panel says `--ts-bg-1`; DNA says accent-glow. These disagree. Per instructions this is surfaced, not reconciled.
- **Anomalies flagged:** MED — **DNA-vs-rendered-doc contradiction**: index.html's marquee code panel documents `--ts-marquee-bg: var(--ts-bg-1)`, while `_rebuild-design-dna.md` F7 documents `--ts-marquee-bg: var(--ts-accent-glow-bg-2)`. One of the two is stale. LOW — marquee bands are very faint salmon on the light page.
- **Open question for owner:** Is the canonical marquee background `--ts-bg-1` (per the showcase's own code panel) or `--ts-accent-glow-bg-2` (per Wave 1.5 design DNA F7)? The rebuild spec and the showcase doc currently disagree.

## Screenshot: mobile-light-index-section-forms.png
- **Surface captured:** §6/§7 Forms, mobile.
- **Viewport / theme:** Mobile × light.
- **What's rendered:** Orange-outline eyebrow at top; a very long stretch of blank near-white surface (washout / capture scroll); near the bottom, a set of "COLOR SWATCH" rows showing tiles labelled with hex-ish values — a white tile (#ffffff-ish), a solid-orange tile, a bright-yellow/amber tile, a lime-green tile, and a hot-pink tile.
- **Cross-reference vs design DNA:** Color swatch tiles demonstrate configurable palette values — same vivid lime/pink saturation noted in the desktop forms capture. Consistent with an accent-reconfiguration demo.
- **Anomalies flagged:** HIGH(-leaning MED) — the mobile forms section is **almost entirely blank** for the great majority of its height; only the bottom color-swatch strip renders. This is the worst per-section washout in the batch and strongly supports a genuine light-theme content-rendering failure (not just a capture artifact, since other mobile sections render fine). LOW — neon swatch saturation as in desktop forms.
- **Open question for owner:** Why does the mobile Forms section render almost entirely blank while sibling mobile sections (typography, ui-kit, panels) render fully? Is the forms section content failing to paint, or are its input surfaces collapsing to invisible on the light theme at mobile width?

## Screenshot: mobile-light-index-section-cards.png
- **Surface captured:** §7 Cards, mobile.
- **Viewport / theme:** Mobile × light.
- **What's rendered:** Long blank upper stretch (washout/scroll); then pricing cards stacked vertically — a "$199" card (RECOMMENDED badge, salmon-tinted fill, "All Toolcore Modules" row, solid-orange "SELECT STUDIO" button) and an "$899" card ("White-label Rights / Dedicated Architect / 24/7 Hotline" with orange checks, "CONTACT SALES" button); then an "§7 — 3D FLIP CARDS [ABOVE]" eyebrow and flip cards stacked (01 DYNAMICS / 02 VISUALS / 03 SPEED) with orange numerals + titles, then a second set of the same.
- **Cross-reference vs design DNA:** Pricing recommended-tier = salmon-tinted fill + solid CTA (C1). Flip cards render front faces with orange numerals/titles (consistent with desktop cards capture). Cards stack to single column at mobile (correct reflow).
- **Anomalies flagged:** MED — blank upper portion (washout/scroll). MED — recommended "$199" card's pale-pink fill is a weak emphasis on light (same as desktop cards). LOW — flip-card body text faint.
- **Open question for owner:** Same recommended-card emphasis question as the desktop cards capture.

## Screenshot: mobile-light-index-section-panels.png
- **Surface captured:** §6c Tool Panels, mobile.
- **Viewport / theme:** Mobile × light.
- **What's rendered:** Eyebrow "§6c — TOOL PANELS"; "TOOL PANEL — CONTROL BLOCK" sub-label then a blank stretch (the toolpanel control block did not paint into view here — washout/scroll); "SIDEBAR NAV" renders fully — MAIN group (Dashboard active = pale-salmon fill + orange icon, Analytics, Projects), SETTINGS group (Appearance, Analytics, Security, Projects); "APP TOPBAR" renders (TOOLSKIN logo + Dashboard pill); then nav-variant demos (default / spaced / icon-only / combined / dropdown-separators) stacked; "DASHBOARD APP SHELL [MINI PREVIEW]" eyebrow at the bottom.
- **Cross-reference vs design DNA:** Sidebar nav active item = tinted accent fill + accent icon/text (C1). App topbar + nav variants render consistently with the desktop panels capture. Icon-only nav variant shows just glyphs in tinted chips.
- **Anomalies flagged:** MED — the "TOOL PANEL — CONTROL BLOCK" toolpanel did not render in this capture (blank between its sub-label and the SIDEBAR NAV block) — washout/timing. LOW — sub-labels faint grey on light.
- **Open question for owner:** none (covered by the global washout question).

## Screenshot: mobile-light-index-section-social-links.png
- **Surface captured:** Social Links, mobile.
- **Viewport / theme:** Mobile × light.
- **What's rendered:** Variant rows stacked vertically, each labelled: STANDARD, LIGHT, DARK, ACCENT, ROUNDED, FLAT, COLORED (— hover for brand colors), COMBINED: ROUNDED + ACCENT. Each row shows social glyphs (Facebook/Twitter/Instagram/LinkedIn/GitHub/YouTube/Pinterest/TikTok) in the corresponding chip treatment — square, rounded, circular, accent-orange-filled, flat, etc.
- **Cross-reference vs design DNA:** Icon glyphs render correctly (FontAwesome brand icons — DNA §G4). ACCENT + COMBINED variants use solid/tinted accent chips; others neutral. This section renders fully and cleanly on mobile.
- **Anomalies flagged:** LOW — variant label text faint grey; the "LIGHT" variant white chips read with low contrast on the near-white page (same light-on-light edge case as desktop).
- **Open question for owner:** Same as desktop social-links — is the "LIGHT" variant intended only for darker surfaces?

## Screenshot: mobile-light-index-section-footer-showcase.png
- **Surface captured:** Footer Components, mobile.
- **Viewport / theme:** Mobile × light.
- **What's rendered:** A small, faint capture: footer link groups stacked, a "NEWSLETTER" area with an input + an orange submit button, and a testimonial card with a quote + orange attribution name. Most text is extremely faint grey on light; the section is largely washed out.
- **Cross-reference vs design DNA:** Footer columns + testimonial card are layout surfaces; testimonial card sits on a slightly darker tint (C6). Attribution name in accent (C1). The orange newsletter submit button reads better here than in the desktop footer capture.
- **Anomalies flagged:** MED — footer text very low-contrast grey on light; section reads faded (consistent with the desktop footer capture — light-theme footer contrast is genuinely weak).
- **Open question for owner:** Same as desktop footer — does the light-theme footer muted-text token meet a legibility bar?

## Screenshot: mobile-light-index-section-mockups.png
- **Surface captured:** Mockups "Toolpanel Mockup Previews" promo, mobile.
- **Viewport / theme:** Mobile × light (section renders DARK).
- **What's rendered:** A near-black full-bleed section: "PORTFOLIO · LIVE DEMOS" eyebrow, two-tone heading "Toolpanel Mockup Previews" (Tool orange, rest light), a muted descriptive paragraph, and a wide solid-orange "EXPLORE MOCKUPS" button. The dark off-canvas "Editor" tab handle is visible at the right edge.
- **Cross-reference vs design DNA:** Confirms the Mockups section is intentionally a dark spotlight band in BOTH themes (matches the desktop mockups capture exactly). Text contrast is good on the dark band. Solid-orange CTA = C1.
- **Anomalies flagged:** none — dark band is consistent and intentional. The "Editor" handle at the right edge is the recurring off-canvas tool, not a defect of this section.
- **Open question for owner:** Same as desktop mockups — confirm the section is a fixed-dark band by design.

## Screenshot: mobile-light-index-section-banner-generator.png
- **Surface captured:** Banner Generator promo, mobile.
- **Viewport / theme:** Mobile × light.
- **What's rendered:** Top: "TOOLSKIN TOOL" eyebrow, "Banner Generator" heading, description ("Create stunning, minimalistic and professional… textures, custom typography, icon picker, multiple presets. No dependencies. What you see is what you export."), a stacked feature list with orange icons ("Gradient Text with custom color stops", "Multiple fonts & weight controls", "Background presets & noise layers", "Preset sizes: OG, HD, 4K & custom", "Icon picker with 1400+ Ionicons", "PNG/JPEG export at 2× resolution", "Live preview with real-time controls", "Save & load preset configurations"), and a solid-orange "LAUNCH BANNER GENERATOR" button. The right side / background is a dark banner-preview canvas with magenta artwork bleeding in.
- **Cross-reference vs design DNA:** Feature list with orange icons + solid CTA matches DNA. The dark canvas with magenta artwork is the banner-tool preview output (accent reconfiguration demo) — same as the desktop banner-generator capture. The "1400+ Ionicons" feature line corroborates DNA §G4 (Toolskin uses Font Awesome 6 + Ionicons).
- **Anomalies flagged:** LOW — at mobile the dark preview canvas overlaps/bleeds behind the light feature panel, which looks slightly awkward (the two-tone split doesn't cleanly stack at mobile width) — possible minor responsive composition issue, not a break. Magenta artwork is intentional demo output (as desktop).
- **Open question for owner:** At mobile width the Banner Generator's dark preview canvas sits behind the light feature list rather than stacking cleanly below it — is that overlap intentional, or should the preview canvas stack as a separate block on mobile?

## Screenshot: mobile-light-index-section-portfolio.png
- **Surface captured:** §8 Portfolio Showcase, mobile.
- **Viewport / theme:** Mobile × light.
- **What's rendered:** NOT VISUALLY ANALYZED — this PNG's pixel dimensions exceed the image-API maximum (one dimension > 2000px) and could not be rendered by the Read tool; a resize to a readable height was blocked because the command classifier was temporarily unavailable during this session. Content is inferred from the desktop portfolio capture (which renders the same section cleanly: YouTube / Suno / Higgsfield / Banner Generator toolpanel cards with version badges) and from the mobile banner-generator capture.
- **Cross-reference vs design DNA:** Not verifiable from pixels in this session. Desktop portfolio equivalent matched DNA F4 (card surfaces) + F1 (version-badge chips) with no anomalies.
- **Anomalies flagged:** LOW (process, not visual) — one Batch A2 screenshot could not be rendered; see Owner-pending question A2-Q for the re-capture request.
- **Open question for owner:** `mobile-light-index-section-portfolio.png` is too tall for the image API to render — request a re-capture at a smaller per-section height, or split it, so the mobile portfolio section gets ground-truth visual coverage.

---

## Anomalies — Batch A2

1. **[HIGH]** `desktop-light-index-fullpage.png`, `tablet-light-index-fullpage.png`, `mobile-light-index-fullpage.png` — All three light-theme full-page captures render as overwhelmingly **blank near-white pages**: body text, card fills, table content and component surfaces wash out to near-invisibility against the light body surface. The bulk of the page does not read. This is the headline finding of Batch A2 and is exactly the "math-correct but visual-wrong" failure Pattern 17 predicts. Cause is ambiguous between (a) a genuine light-theme contrast-token failure and (b) a scroll-reveal / lazy-paint timing artifact of headless capture — owner triage required.
2. **[HIGH]** `mobile-light-index-section-forms.png` — The mobile Forms section renders almost entirely blank for the great majority of its height (only the bottom color-swatch strip paints). Because sibling mobile sections render fully, this leans toward a genuine content-render / surface-collapse failure rather than a pure capture artifact.
3. **[MED]** `mobile-light-index-section-top.png` vs `desktop-light-index-section-top.png` — **Version-string mismatch on the same page**: desktop hero eyebrow reads "FOURTH EDITION · V3.2.0 · 2026" while the mobile hero eyebrow reads "DESIGN SYSTEM · V1.0.0 · 2026"; the topbar wordmark sub-label also shows "DESIGN SYSTEM V1.0". Multiple inconsistent edition/version strings — a Pattern-17-class version mismatch.
4. **[MED]** `mobile-light-index-section-marquee-documentation.png` — **DNA-vs-rendered-doc contradiction**: index.html's own marquee code panel documents `--ts-marquee-bg: var(--ts-bg-1)`, while `_rebuild-design-dna.md` §F7 documents `--ts-marquee-bg: var(--ts-accent-glow-bg-2)`. One source is stale. Surfaced, not reconciled (per Rule 11 / instructions).
5. **[MED]** `desktop-light-index-section-typography.png`, `mobile-light-index-section-typography.png` — The gradient-text "GRADIENT" word renders its first half ("GRAD") near-black/very-dark on the light surface, so it looks like a rendering glitch rather than an intentional dark→accent ramp. Possible light-theme gradient-stop issue.
6. **[MED]** `desktop-light-index-section-footer-showcase.png`, `mobile-light-index-section-footer-showcase.png` — The footer renders at very low contrast in light theme: column links, headings and newsletter copy are faint grey on the light surface; the desktop newsletter submit button is almost invisible (pale-on-pale). Light-theme footer legibility is genuinely weak.
7. **[MED]** `desktop-light-index-section-cards.png`, `mobile-light-index-section-cards.png` — The "recommended" pricing tier ("$199") uses a flat pale-pink/salmon tinted fill that provides weak emphasis on the light surface; the recommended card barely distinguishes itself from the neutral $49/$899 cards.
8. **[MED]** `desktop-light-index-section-forms.png`, `mobile-light-index-section-forms.png` — Color-swatch demo tiles render as very vivid neon lime-yellow and hot-pink against the light surface, visually jarring versus Toolskin's otherwise restrained orange identity. Likely an intentional accent-reconfiguration demo — flagged for confirmation.
9. **[MED]** `desktop-light-index-section-top.png` (and most desktop captures) — A dark off-canvas "Editor" tab handle is pinned to the right viewport edge in nearly every desktop and mobile capture. If this is a dev-only sandbox tool it should not appear on a public showcase capture.
10. **[MED — capture method]** All per-section captures (desktop + mobile) — The sticky topbar + orange announcement bar paint **on top of** section content ~⅓ down each per-section frame. Confirmed a Playwright scroll-to-section artifact (sticky/fixed chrome), NOT a Toolskin rendering defect — but it degrades the usefulness of every per-section capture and should be fixed in the capture method (e.g. offset scroll, or hide sticky chrome during per-section shots).
11. **[LOW]** `desktop-light-index-section-marquee-documentation.png`, `mobile-light-index-section-marquee-documentation.png` — In light theme the accent-glow marquee background renders as a very faint, barely-there pink wash; the marquee bands have almost no accent presence.
12. **[LOW]** `desktop-light-index-section-social-links.png`, `mobile-light-index-section-social-links.png` — The "LIGHT" social-icon variant renders near-white chips on the near-white page surface and nearly disappears (light-on-light contrast edge case).
13. **[LOW]** Multiple sections (components, ui-kit, panels, portfolio, footer, typography) — Section sub-labels, captions, and card body sub-text consistently render as low-contrast light-grey on the light surface; legible but faint throughout light theme. Pervasive light-theme contrast softness even in otherwise-clean sections.
14. **[LOW]** `desktop-light-index-section-banner-generator.png`, `mobile-light-index-section-banner-generator.png` — The banner-preview canvas renders a magenta "TOOLSKIN" wordmark; in context this is intentional banner-tool sample output demonstrating accent reconfiguration, but it could be misread as a stray theme value — noted for confirmation.
15. **[LOW — process]** `mobile-light-index-section-portfolio.png` — Could not be rendered/visually analyzed: PNG dimensions exceed the image-API limit and a resize was blocked by a temporarily-unavailable command classifier. 28 of 29 Batch A2 screenshots were fully analyzed; this one is documented from the cleanly-rendering desktop portfolio equivalent.

## Owner-pending questions — Batch A2

1. **[`desktop-light-index-fullpage.png` / `tablet-light-index-fullpage.png` / `mobile-light-index-fullpage.png`]** Is the empty near-white full-page rendering caused by a light-theme contrast-token failure, or by a scroll-reveal / lazy-paint timing artifact of the headless capture? The per-section shots render their content, which hints at timing — but the washed-out text within mid-page bands hints at contrast. Which is the root cause (or both)?
2. **[all three full-page captures]** The washout reproduces near-identically at desktop, tablet and mobile widths — does that confirm the cause is viewport-independent (a token / paint issue) rather than a responsive-layout break?
3. **[`mobile-light-index-section-forms.png`]** Why does the mobile Forms section render almost entirely blank while sibling mobile sections (typography, ui-kit, panels, social-links) render fully? Is forms-section content failing to paint, or are its input surfaces collapsing to invisible on light theme at mobile width?
4. **[`mobile-light-index-section-top.png` / `desktop-light-index-section-top.png`]** Which version/edition string is canonical — "V1.0.0 / DESIGN SYSTEM" (mobile hero + topbar sub-label) or "V3.2.0 / FOURTH EDITION" (desktop hero eyebrow)? The page currently displays both.
5. **[`mobile-light-index-section-marquee-documentation.png`]** Is the canonical marquee background `--ts-marquee-bg: var(--ts-bg-1)` (per index.html's own code panel) or `var(--ts-accent-glow-bg-2)` (per `_rebuild-design-dna.md` §F7)? The showcase doc and the Wave 1.5 DNA spec disagree.
6. **[`desktop-light-index-section-typography.png` / `mobile-light-index-section-typography.png`]** Is the gradient-text effect meant to ramp dark→accent (so half a word reads near-black on the light surface), or should both gradient stops stay within the accent family so the whole word reads colored?
7. **[`desktop-light-index-section-footer-showcase.png` / `mobile-light-index-section-footer-showcase.png`]** Does the light-theme footer muted-text token meet a legibility bar? Footer links and the newsletter submit button currently render at very low contrast.
8. **[`desktop-light-index-section-cards.png` / `mobile-light-index-section-cards.png`]** Should the "recommended" pricing tier carry stronger accent emphasis in light theme? Its current pale-pink fill barely distinguishes it from the neutral pricing cards.
9. **[`desktop-light-index-section-forms.png` / `mobile-light-index-section-forms.png`]** Are the vivid lime/pink color-swatch tiles a deliberate "accent is reconfigurable" demonstration, or sample content that happens to look off-brand on the light surface?
10. **[`desktop-light-index-section-mockups.png` / `mobile-light-index-section-mockups.png`]** Confirm the Mockups section is deliberately a fixed-dark spotlight band in BOTH light and dark themes (it renders dark in the light-theme captures).
11. **[`desktop-light-index-section-banner-generator.png` / `mobile-light-index-section-banner-generator.png`]** Confirm the magenta "TOOLSKIN" in the banner-preview canvas is intentional banner-generator sample output (accent reconfiguration demo), not a stray theme value. Also: at mobile width the dark preview canvas sits behind the light feature list rather than stacking cleanly — intentional or a responsive composition issue?
12. **[most desktop + mobile captures]** The dark off-canvas "Editor" tab handle is pinned to the viewport edge in nearly every capture — is this a dev-only sandbox tool that should be hidden on the public showcase page, or intended to be visible?
13. **[`desktop-light-index-section-social-links.png` / `mobile-light-index-section-social-links.png`]** Is the "LIGHT" social-icon variant intended for use only on darker surfaces? On the light page its white chips nearly disappear.
14. **[process — `mobile-light-index-section-portfolio.png`]** This screenshot exceeds the image-API dimension limit and could not be rendered. Request a re-capture at a smaller per-section height (or split) so the mobile portfolio section gets ground-truth coverage. Separately, recommend fixing the capture method so the sticky topbar does not overlay per-section content (anomaly 10).


# Rebuild Visual Audit — Batch B

**Analyst:** Wave 1.6 Visual Audit Analyst — Batch B (Playwright headless captures of toolskin-lab.html, all viewports + both themes, + interactive states)
**Date:** 2026-05-19
**Scope:** 32 PNGs — 28 `*-lab-*` (fullpage @ desktop/tablet/mobile × dark/light, + 11 per-section desktop captures × dark/light) + 4 `*-state-*` (accordion-expanded, tabs-switched, dark/light).
**Primary cross-reference:** `docs/handoffs/_rebuild-design-dna.md` (Wave 1.5).
**Output discipline:** Visual evidence is ground-truth. Where rendered reality and text-derived DNA disagree, the contradiction is SURFACED, not reconciled. No alternative design choices proposed.

> **Capture-method note:** every `*-lab-*` PNG is a Playwright HEADLESS render. The repeated FontAwesome-icon absence and the topbar wordmark double-strike (see anomalies A1, A2) are consistent across ALL 32 captures — strongly indicating a **headless-environment font-loading artifact**, not a stylesheet defect. This must be confirmed against the owner's GoFullPage ground-truth captures (Batch A / W1.6.A) before any anomaly here is treated as a CSS regression. Tagged per-screenshot below as "render-env suspected."

═══════════════════════════════════════════════════════════════════════
## PART 1 — FULLPAGE CAPTURES
═══════════════════════════════════════════════════════════════════════

## Screenshot: desktop-dark-lab-fullpage.png
- **Surface captured:** Entire toolskin-lab.html page — a component lab/showcase. Top to bottom: topbar, intro panel, accordion section, checkbox/radio (controls) section, select, spinner, tooltips, drag & resize, sortable list, data table, masonry/grid, 3D-tilt cards, photo grid, API code block, footer.
- **Viewport / theme:** Desktop (1024w render) × dark.
- **What's rendered:** Near-black body floor (`--ts-bg-body`), darker raised surface panels stacked as full-width sections. Section headings left-aligned bold. Orange accent (hue ~18, matches DNA §G6 "orange-on-near-black" default) appears on: checkboxes (checked), radio dots, accordion chevrons/icons (active), sort grips, table sort arrows, "DYNAMICS/VISUALS/SPEED" tilt-card headings, footer code highlights. Layout is single-column stacked sections — no asymmetric hero (this is a lab page, not a marketing page, so §G6 "symmetric hero" anti-pattern does not apply).
- **Cross-reference vs design DNA:** Surface tiering (body → raised panel) matches §C6 surface propagation intent. Accent-as-orange matches §G6. Accent used SOLID only on checked controls + active chips/tabs — consistent with §C1 (accent solid is rare). Section vertical rhythm looks generous/fluid — consistent with §A4 clamp() section gaps. No default box-shadows visible on panels — consistent with §C4 (depth via surface, not shadow).
- **Anomalies flagged:** (1) Topbar wordmark at top-left renders as an unreadable dark double-struck smear (see A2). (2) Section-heading and body text throughout shows a faint double-strike / heavy-render quality — consistent with a fallback font substituting for Space Grotesk in headless (render-env suspected, A1). Layout itself is clean — no breaks, no clipping, no overflow.
- **Open question for owner:** Page-load orchestration (§G6 "one orchestrated page-load") cannot be verified from a static capture — is there an intended entrance animation, and should the visual audit cover it?

## Screenshot: desktop-light-lab-fullpage.png
- **Surface captured:** Same full page as desktop-dark-lab-fullpage.png.
- **Viewport / theme:** Desktop (1024w) × light.
- **What's rendered:** White/near-white body floor, very light gray (#f0-ish) raised panels. Same orange accent retained in light theme (accent is hue-stable across themes — matches the `--ts-accent-h/s/l` pipeline, §C). Text is dark-on-light. The tilt-card "DYNAMICS/VISUALS/SPEED" headings stay orange.
- **Cross-reference vs design DNA:** Light theme correctly inverts surfaces (body lighter than... actually body is WHITE and panels are light-gray — panels are DARKER than body, inverting the dark-theme relationship where panels are LIGHTER than body). This is the expected `[data-theme=light]` primitive remap (design-tokens-2.0 Tier-2 system). Accent hue preserved — consistent with §C accent pipeline.
- **Anomalies flagged:** (1) Same FontAwesome/wordmark rendering issue as dark (render-env suspected). (2) **MED — light-theme contrast is markedly weaker than dark:** light-gray panels on white body produce very low surface-boundary contrast; several panel edges are barely perceptible. The "Light panel" demo card in the controls section is nearly invisible (detailed under desktop-light-lab-section-controls.png). Borderless layout sections (§C3 "layout tier = no border, surface contrast IS the boundary") work in dark theme but the light-theme surface steps are too close in luminance to read as boundaries.
- **Open question for owner:** Is the light theme's low surface-step contrast intentional (a "soft" light mode), or a tuning regression? §C7 mixing constants (6%/14%) were tuned — but the DNA does not state whether they were tuned against the light palette or only dark.

## Screenshot: tablet-dark-lab-fullpage.png
- **Surface captured:** Full toolskin-lab.html page at tablet width.
- **Viewport / theme:** Tablet (~768w) × dark.
- **What's rendered:** Same sections; multi-column section internals (accordion left/right columns, controls 2-up, select 3-up) appear to hold their columns at tablet width rather than collapsing to single-column. Topbar nav still horizontal. Masonry/grid sections reflow to fewer columns.
- **Cross-reference vs design DNA:** Responsive behavior present. DNA §G5 flags raw `@media` breakpoints as an anti-pattern pending `--ts-bp-*` tokens — cannot verify token usage from a pixel capture; layout reflow itself looks correct.
- **Anomalies flagged:** Same global font/wordmark artifact (render-env suspected). No tablet-specific layout break, clipping, or overlap detected. Two-column sections at tablet are dense but not broken.
- **Open question for owner:** At tablet width the two-column accordion/controls groups stay 2-up — is 768px intended to KEEP two columns, or should it be the breakpoint where they stack? (Affects `--ts-bp-*` definition in rebuild.)

## Screenshot: tablet-light-lab-fullpage.png
- **Surface captured:** Same as tablet-dark-lab-fullpage.png.
- **Viewport / theme:** Tablet (~768w) × light.
- **What's rendered:** Light theme at tablet. Same reflow as tablet-dark.
- **Cross-reference vs design DNA:** Same as tablet-dark plus the light-theme low-contrast observation.
- **Anomalies flagged:** Same as desktop-light (low surface-boundary contrast) + global font artifact. No tablet-specific break.
- **Open question for owner:** none beyond the desktop-light contrast question.

## Screenshot: mobile-dark-lab-fullpage.png
- **Surface captured:** Full toolskin-lab.html page at mobile width.
- **Viewport / theme:** Mobile (375w) × dark.
- **What's rendered:** All sections collapse to single-column. Topbar nav links appear collapsed/hidden (only the logo region + a control at far right remain — likely a hamburger or condensed nav). Multi-column section internals stack vertically. Cards/panels go full-bleed-within-gutter. Very long page.
- **Cross-reference vs design DNA:** Single-column collapse is correct mobile behavior. Topbar condensing at mobile is expected for the sticky height-locked topbar (§F9).
- **Anomalies flagged:** Same global font/wordmark artifact (render-env suspected). No mobile layout break, no horizontal-scroll/overflow visible, no clipped cards. Text remains within gutters.
- **Open question for owner:** The mobile topbar shows what appears to be a collapsed nav — is there a hamburger/offcanvas menu component, and is its closed-state the only thing the lab page exercises? (Cannot open it in a static capture.)

## Screenshot: mobile-light-lab-fullpage.png
- **Surface captured:** Same as mobile-dark-lab-fullpage.png.
- **Viewport / theme:** Mobile (375w) × light.
- **What's rendered:** Light theme, single-column mobile stack.
- **Cross-reference vs design DNA:** Same as mobile-dark + light-theme low-contrast note.
- **Anomalies flagged:** Same as mobile-dark + light low surface-contrast. No mobile-specific break.
- **Open question for owner:** none beyond prior.

═══════════════════════════════════════════════════════════════════════
## PART 2 — PER-SECTION DESKTOP CAPTURES (DARK)
═══════════════════════════════════════════════════════════════════════

## Screenshot: desktop-dark-lab-section-toast.png
- **Surface captured:** "Toast (UIKit)" section — heading, descriptive paragraph, and a row of 4 trigger buttons (SUCCESS, WARNING, ERROR, "CORE TOOLSKIN TOAST").
- **Viewport / theme:** Desktop × dark.
- **What's rendered:** 4 dark gradient-surface buttons, uppercase tracked labels. Labels are text-only.
- **Cross-reference vs design DNA:** Buttons are uppercase + letter-tracked + height-derived gradient surface — matches §F3 / §B4 caps-locked roles. Default (non-primary) variant = `--ts-this-bg-grad` dark surface, NOT solid accent — correct per §C1 (accent solid only on primary/active).
- **Anomalies flagged:** **HIGH — no FontAwesome icons render on any of the 4 buttons.** Toast trigger buttons conventionally carry a leading status glyph (check / triangle / x / bell). All four show label text only. Combined with the section's "Toast" semantics, an icon is expected. This is the clearest single instance of the global icon-failure pattern (A3). Render-env suspected but must be confirmed.
- **Open question for owner:** Are these toast trigger buttons SPEC'd to carry leading icons? If yes, A3 is a real regression in the lab page's icon pipeline; if no, the buttons are correct and A3 is purely the topbar/other-glyph issue.

## Screenshot: desktop-dark-lab-section-accordion.png
- **Surface captured:** "Accordion" section — 6 accordion groups: Joined·multiple-open, Joined·exclusive, Separated cards (plus/minus toggle), Alias root, Schema-built, Column groups (2-col).
- **Viewport / theme:** Desktop × dark.
- **What's rendered:** Accordion headers are raised dim-tint surfaces with a leading icon, a title, and a right-aligned chevron (joined variants) or +/− stroke glyph (separated variants). Expanded panels show body text on a slightly recessed surface. Headers ~50px tall. Active/expanded chevrons + the "Schema A" wand icon render in orange. The `--separated` variant correctly breaks the unified shell into individually-bordered items.
- **Cross-reference vs design DNA:** Strongly matches §F10: header min-height ~50px, dim-tint header surface, chevron rotation (down vs up = collapsed vs expanded), `--separated` per-item border+radius, accent color shift on active. Plus/minus toggle present on the separated variant — DNA §G2 explicitly REJECTS Bootstrap +/− for the *standard* accordion but §F10/the lab clearly offer it as an opt-in `toggle:'plus'` variant; not a contradiction (it's a labeled variant, not the default).
- **Anomalies flagged:** Leading header icons (layers, star, folder, lightning, wand, document) DO render here — these appear to be a different glyph source than the failing ones. Mixed result: some icon families render, some don't (see A3 — supports "FontAwesome specifically fails, other icon source survives"). No layout break.
- **Open question for owner:** The lab shows two icon behaviors — accordion header icons render, toast/topbar glyphs do not. Are accordion icons Ionicons (web-component) while toast/topbar are FontAwesome (CSS-font)? If so, the failure is isolated to the FontAwesome CSS-font path in headless. Owner to confirm icon-source split.

## Screenshot: desktop-dark-lab-section-select.png
- **Surface captured:** "Select (search + icons)" section — heading, paragraph, 3 select controls (With search / No search / Compact width), trailing caption.
- **Viewport / theme:** Desktop × dark.
- **What's rendered:** 3 closed dropdown controls on a translucent dim surface, each with a right-aligned chevron. "Beta" option shows a leading lightning glyph (renders). Controls are height-aligned with the button/input system.
- **Cross-reference vs design DNA:** Matches §F5 input family — height-aligned, `--ts-this-bg-dim` translucent surface, `--ts-radius-sm`. Chevron affordance present. "Compact width" select is visibly narrower — matches a width-variant.
- **Anomalies flagged:** none — the leading "Beta" lightning icon renders; chevrons render (these read as CSS-drawn or Ionicon, not FontAwesome). No layout break, no clipping.
- **Open question for owner:** none.

## Screenshot: desktop-dark-lab-section-spinner.png
- **Surface captured:** "Spinner & number inputs" section — UIKit spinner (value 10), a standalone auto-wrapped number input (value 42), and an Interval demo (Hours 2 / Minutes 0).
- **Viewport / theme:** Desktop × dark.
- **What's rendered:** Number inputs with a value on the left and a stacked up/down chevron pair on the right (`.ts-ui-spinner__controls`). Chevrons render correctly. The standalone "42" input is full-width with the same right-side stepper.
- **Cross-reference vs design DNA:** Matches §F5 input system. Stacked-chevron stepper is a deliberate composition. Value text appears centered in the wide standalone input and left-ish in the compact spinner — consistent with the section's "value on the left" description for the compact form.
- **Anomalies flagged:** none — chevrons render; no clipping. The standalone "42" appears centered rather than left-aligned — minor and possibly intended for the wide variant.
- **Open question for owner:** Is the standalone number input's value meant to be left-aligned (to match the UIKit spinner) or centered? Captures show centered for the wide one — confirm intent.

## Screenshot: desktop-dark-lab-section-tooltips.png
- **Surface captured:** "Tooltips" section — heading, paragraph, and 3 tooltip triggers: a "HOVER ME" button, a pill-shaped "BADGE", and a "Longer link" text link.
- **Viewport / theme:** Desktop × dark.
- **What's rendered:** "HOVER ME" = standard dark gradient button. "BADGE" = a fully-rounded (pill) SOLID ORANGE element with dark uppercase tracked label. "Longer link" = orange text link.
- **Cross-reference vs design DNA:** The orange pill "BADGE" is a SOLID accent fill — per §C1, accent appears solid only on primary button + accent/active chip. A solid-accent badge is consistent IF it is a `.ts-chip--accent` / accent-badge variant (§F1 chip variants include `.ts-chip--accent` solid fill). The dark label on orange = `--ts-on-accent` OKLCH auto-contrast (§C5) — orange at hue 18 is not light enough to flip to black, yet the label reads DARK; see anomaly. Tooltips themselves are hover-triggered and not visible in a static capture.
- **Anomalies flagged:** **MED — the "BADGE" pill label looks cramped/clipped:** the uppercase text appears tight against the pill's rounded ends, almost touching the edges, and slightly vertically off-center. Either horizontal padding is insufficient for a pill radius or the label overflows its asymmetric chip padding (§A2 chips are intentionally 8/12 asymmetric, but a `--ts-radius-full` pill needs more horizontal padding than a `--ts-radius-sm` chip). Also: the dark label on the orange badge — if this badge uses `--ts-on-accent`, the formula should yield WHITE for hue-18 orange (lightness below the 0.75 threshold per §C5/Rule 7); a dark label suggests either a hardcoded color or the badge is not using `--ts-on-accent`. SURFACE: visual reality (dark text on orange) vs DNA §C5 expectation (white text on hue-18 orange).
- **Open question for owner:** (a) Is the orange "BADGE" pill meant to use `--ts-on-accent`? If yes, its dark label contradicts the OKLCH formula's expected output for orange. (b) Should pill-radius chips get extra horizontal padding vs sharp-radius chips?

## Screenshot: desktop-dark-lab-section-drag-resize.png
- **Surface captured:** "Draggable & Resizable" section — heading, paragraph, a bordered bounds container holding two draggable cards ("Bounded A", "Bounded B"), and a separate "Resize from corner" panel with a corner resize handle.
- **Viewport / theme:** Desktop × dark.
- **What's rendered:** Two recessed cards inside a dashed/solid bounds frame. The resize panel is a raised surface with a visible diagonal grip mark at the bottom-right corner.
- **Cross-reference vs design DNA:** Cards are molecular surfaces with `--ts-card-border` (§C3). The bounds container is a layout-tier element. Resize grip is a small corner affordance — consistent with a non-default, opt-in interaction control.
- **Anomalies flagged:** none — cards render cleanly, the resize grip glyph renders (corner triangle, CSS-drawn). No clipping or overlap.
- **Open question for owner:** none.

## Screenshot: desktop-dark-lab-section-sortable.png
- **Surface captured:** "Sortable list" section — 3 sub-lists: A (handle-only, ⇕ grip icon), B (whole-row draggable, no grip), C (drag handle = title strip only, ═ grip).
- **Viewport / theme:** Desktop × dark.
- **What's rendered:** List A rows have a leftmost orange vertical double-arrow grip in its own boxed cell, then the row label. List B rows are plain full-width rows. List C rows have an orange "equals/grip" glyph beside the title plus right-aligned muted helper text.
- **Cross-reference vs design DNA:** Rows are molecular surfaces, gradient-surface, `--ts-card-border`-style borders. Grip icons render in orange — accent applied to an interactive affordance (a tinted/accent icon, consistent with §C1 "accent as icon tint"). Right-aligned muted helper text in list C uses `--ts-text-muted` tier — consistent with §B/§C text hierarchy.
- **Anomalies flagged:** none — grips render (orange ⇕ and ═). No layout break. List C's right-aligned helper text is small but legible on dark.
- **Open question for owner:** none.

## Screenshot: desktop-dark-lab-section-table.png
- **Surface captured:** "Data table (sticky header, sort, bulk actions)" section — heading, paragraph, and an 8-row data table: checkbox column, ID, TITLE, STATUS, QTY, PRICE.
- **Viewport / theme:** Desktop × dark.
- **What's rendered:** Header row near-black with uppercase tracked column labels + orange sort-arrow glyphs. Body rows alternate subtle striping. STATUS column has colored pill badges: amber "PENDING", green "OK", red "FAILED". Checkbox column on the left.
- **Cross-reference vs design DNA:** Table header uppercase + tracked = §B4 caps roles. Status pills are chip-family — semantic color variants (`.ts-chip--success/warning/danger`) per §F1 (variants swap `--ts-accent` to status colors). Sort arrows in orange = accent affordance. Striping is subtle surface-tier alternation, not heavy lines — consistent with §C4 restraint.
- **Anomalies flagged:** **MED — the green "OK" status pills render as "DK".** Multiple rows (IDs 12, 240, 401) show a green pill reading "DK" instead of "OK". The leading "O" is either clipped by the pill's left padding, the glyph is missing, or the pill's horizontal padding is too tight for a 2-character uppercase label at this letter-spacing. Identical in light theme (see desktop-light-lab-section-table.png) → this is NOT a theme/contrast issue and NOT the FontAwesome issue → it is a **chip horizontal-padding / text-clipping defect** on short labels, OR a literal data string of "DK". Amber "PENDING" (7 chars) and red "FAILED" (6 chars) render fully — only the 2-char label clips, which points to a min-width/padding interaction on very short chip content.
- **Open question for owner:** Is the intended status label "OK" (clipped to "DK" by chip padding) or literally "DK"? If "OK", the chip component clips short labels — a real padding/min-width bug to fix in the rebuilt chip.

## Screenshot: desktop-dark-lab-section-masonry.png
- **Surface captured:** Four stacked layout sub-sections: "Masonry (core + UIKit)" with a HERO ITEM 13 (3×3) spanning tile, "Dense" masonry, "3D tilt" cards (DYNAMICS / VISUALS / SPEED), and a "Photo grid" of 5 images.
- **Viewport / theme:** Desktop × dark.
- **What's rendered:** Masonry/grid of dark recessed tiles of varying span; one large tile labelled "HERO ITEM 13 (3×3)" tinted with a faint warm/orange wash. The 3D-tilt sub-section shows 3 tall cards with large orange uppercase headings DYNAMICS/VISUALS/SPEED. The photo grid shows 5 photographic thumbnails (the only raster imagery in the lab).
- **Cross-reference vs design DNA:** Masonry tiles are recessed surfaces; the hero tile's warm tint = `--ts-accent-glow-bg` style radial/wash (consistent with §C accent-as-glow). The tilt-card orange headings = large display type, accent-colored. Photo grid renders real images correctly. Grid uses span-based layout — consistent with §G2 rejection of named-column spans in favor of grid patterns.
- **Anomalies flagged:** LOW — the bulk of the masonry tiles are empty placeholders (tiny centered "+" or index marks); this is expected for a layout demo. The "HERO ITEM 13 (3×3)" tile's warm tint is faint but present. No layout break, no clipping. Tiles align to a coherent grid.
- **Open question for owner:** The "Dense" masonry sub-section renders mostly as large empty dark tiles — is that the intended demo state (structure-only), or is tile content expected to populate?

## Screenshot: desktop-dark-lab-section-api.png
- **Surface captured:** "API" section — a single full-width code block listing `ToolskinUIKit.*` JS API calls.
- **Viewport / theme:** Desktop × dark.
- **What's rendered:** A recessed dark code panel with monospace text. Code is light-on-dark, no syntax highlighting (single foreground color). Indentation preserved for the nested `AccordionFromSchema` object.
- **Cross-reference vs design DNA:** Monospace block — JetBrains Mono is the Toolskin mono anchor (§G6). Code panel is a recessed surface. Plain (non-highlighted) code is consistent with a utilitarian API reference.
- **Anomalies flagged:** none — monospace renders cleanly and legibly, indentation intact, panel surface correct.
- **Open question for owner:** Code block has no syntax highlighting — is monochrome code intended, or should the rebuild add token-colored syntax?

═══════════════════════════════════════════════════════════════════════
## PART 3 — PER-SECTION DESKTOP CAPTURES (LIGHT)
═══════════════════════════════════════════════════════════════════════

## Screenshot: desktop-light-lab-section-toast.png
- **Surface captured:** "Toast (UIKit)" section — same as desktop-dark-lab-section-toast.png.
- **Viewport / theme:** Desktop × light.
- **What's rendered:** Same 4 trigger buttons (SUCCESS/WARNING/ERROR/CORE TOOLSKIN TOAST) on light-gray gradient surfaces, dark uppercase labels.
- **Cross-reference vs design DNA:** Same as dark-theme toast section.
- **Anomalies flagged:** Same as desktop-dark-lab-section-toast.png — **HIGH: no FontAwesome icons on any toast button** (A3). Confirms the icon failure is theme-independent.
- **Open question for owner:** Same as dark toast section.

## Screenshot: desktop-light-lab-section-accordion.png
- **Surface captured:** "Accordion" section — same 6 groups as desktop-dark-lab-section-accordion.png.
- **Viewport / theme:** Desktop × light.
- **What's rendered:** Light-gray accordion header surfaces, dark titles, leading icons (render), chevron/plus-minus toggles. Expanded panels white-ish. Accent orange retained on active chevrons and the "Schema A" wand.
- **Cross-reference vs design DNA:** Matches §F10. Header dim-tint reads as light-gray-on-white in light theme — correct primitive remap.
- **Anomalies flagged:** **LOW–MED — accordion header surface vs panel-body surface contrast is weak in light theme.** Header gray and panel white are close in luminance; the boundary between a header and its open panel is faint. Functionally still distinguishable. Topbar wordmark double-strike persists (A2).
- **Open question for owner:** Same light-theme surface-step contrast question as desktop-light-lab-fullpage.png.

## Screenshot: desktop-light-lab-section-select.png
- **Surface captured:** "Select (search + icons)" — same as dark.
- **Viewport / theme:** Desktop × light.
- **What's rendered:** 3 light-gray dropdown controls, dark labels, chevrons render, "Beta" lightning icon renders.
- **Cross-reference vs design DNA:** Matches §F5; correct light remap.
- **Anomalies flagged:** none beyond the general light-theme softness — selects are legible. Same as dark except theme.
- **Open question for owner:** none.

## Screenshot: desktop-light-lab-section-spinner.png
- **Surface captured:** "Spinner & number inputs" — same as dark.
- **Viewport / theme:** Desktop × light.
- **What's rendered:** Light-gray number inputs, dark values, chevron steppers render.
- **Cross-reference vs design DNA:** Matches §F5. Same as dark except theme.
- **Anomalies flagged:** none. Steppers render; no clipping.
- **Open question for owner:** Same value-alignment question as the dark spinner section.

## Screenshot: desktop-light-lab-section-tooltips.png
- **Surface captured:** "Tooltips" — same 3 triggers as dark.
- **Viewport / theme:** Desktop × light.
- **What's rendered:** "HOVER ME" light-gray button; "BADGE" SOLID ORANGE pill (accent unchanged in light theme); "Longer link" orange link.
- **Cross-reference vs design DNA:** Same as dark tooltips section. The orange "BADGE" pill keeps the SAME solid orange in light theme — accent is theme-stable (§C accent pipeline).
- **Anomalies flagged:** Same as desktop-dark-lab-section-tooltips.png — **MED: "BADGE" pill label cramped against pill ends; dark label on orange contradicts §C5 `--ts-on-accent` expected white-for-orange.** Theme-independent → confirms the badge label color is hardcoded or not wired to `--ts-on-accent`, AND the pill padding is too tight regardless of theme.
- **Open question for owner:** Same as dark tooltips section.

## Screenshot: desktop-light-lab-section-drag-resize.png
- **Surface captured:** "Draggable & Resizable" — same as dark.
- **Viewport / theme:** Desktop × light.
- **What's rendered:** Light-gray draggable cards in a faint bounds frame; resize panel with corner grip.
- **Cross-reference vs design DNA:** Matches dark equivalent.
- **Anomalies flagged:** **LOW — the bounds container frame and the inner cards are all light-gray on white; the bounds frame is nearly imperceptible** (light-theme low-contrast pattern again). Resize grip still visible. No break.
- **Open question for owner:** none beyond the light-theme contrast question.

## Screenshot: desktop-light-lab-section-sortable.png
- **Surface captured:** "Sortable list" — 3 sub-lists, same as dark.
- **Viewport / theme:** Desktop × light.
- **What's rendered:** Light-gray rows, dark labels, orange grip icons (⇕ and ═) render. List C right-aligned helper text in muted gray.
- **Cross-reference vs design DNA:** Matches §F6/sortable; correct light remap. Orange grips on light surface have good contrast.
- **Anomalies flagged:** LOW — row-to-row separation is subtle on white (rows are light-gray with faint borders); still distinguishable. List C muted helper text is light-gray on light-gray and faint but readable.
- **Open question for owner:** none.

## Screenshot: desktop-light-lab-section-table.png
- **Surface captured:** "Data table" — same 8-row table as dark.
- **Viewport / theme:** Desktop × light.
- **What's rendered:** Near-black header row (header stays dark even in light theme — a deliberate inversion), uppercase tracked labels, orange sort arrows. Body rows white with subtle striping. Status pills: amber PENDING, green "DK", red FAILED. Header checkbox appears checked/filled.
- **Cross-reference vs design DNA:** Table header staying dark in light theme is a deliberate contrast anchor — not contradicted by DNA. Status chips = §F1 semantic variants.
- **Anomalies flagged:** **MED — green "OK" pills again render as "DK"** (IDs 12, 240, 401) — identical to dark theme. Confirms A4 is a content/chip-padding defect, theme-independent. Header row dark-on-light is intentional, not an anomaly.
- **Open question for owner:** Same as dark table section (is the label "OK" or "DK").

## Screenshot: desktop-light-lab-section-masonry.png
- **Surface captured:** Masonry / Dense / 3D-tilt / Photo-grid stack — same as dark.
- **Viewport / theme:** Desktop × light.
- **What's rendered:** Light-gray grid tiles on white; "HERO ITEM 13 (3×3)" tile has a faint pink/peach tint (the accent-glow wash reading very pale on a light surface). Tilt cards keep large orange DYNAMICS/VISUALS/SPEED headings. Photo grid renders the 5 images identically to dark.
- **Cross-reference vs design DNA:** Matches dark equivalent. The hero tile's accent wash is much fainter in light theme — `--ts-accent-glow-bg` radial reads pale on white.
- **Anomalies flagged:** **LOW — masonry/Dense tiles are light-gray on white with minimal boundary contrast; the grid structure is hard to perceive in light theme.** Tilt cards are fine (orange headings carry them). Photo grid fine.
- **Open question for owner:** Is the very pale accent-glow wash on the light-theme hero tile intended, or should the glow intensity scale up for light surfaces?

## Screenshot: desktop-light-lab-section-api.png
- **Surface captured:** "API" code block — same as dark.
- **Viewport / theme:** Desktop × light.
- **What's rendered:** Light-gray code panel, dark monospace text, no syntax highlighting, indentation preserved.
- **Cross-reference vs design DNA:** Matches dark equivalent; correct light remap. Code legible.
- **Anomalies flagged:** none — code panel is one of the better-contrasting light-theme surfaces (dark text on light-gray).
- **Open question for owner:** Same monochrome-code question as the dark API section.

═══════════════════════════════════════════════════════════════════════
## PART 4 — INTERACTIVE STATE CAPTURES
═══════════════════════════════════════════════════════════════════════

## Screenshot: desktop-dark-state-accordion-expanded.png
- **Surface captured:** Accordion section after an accordion was clicked. The "Joined·multiple-open" group (top-left) shows Section A and Section B BOTH COLLAPSED (chevrons point down, no panel body). The separated "Alpha" and "Schema A" groups show their panels OPEN with a minus (−) toggle.
- **Viewport / theme:** Desktop × dark.
- **What's rendered:** Compared to the static desktop-dark-lab-section-accordion.png (where Section A was OPEN showing "First panel — raw HTML content"), here Section A is CLOSED. The intended "accordion-expanded" interaction appears to have TOGGLED SECTION A SHUT rather than expanding a closed section.
- **Cross-reference vs design DNA:** Collapsed-state chevron points down, expanded points up — §F10 chevron-rotation mechanism. The separated Alpha/Schema-A items correctly show open panels + minus toggle. Mechanically the accordion states render correctly (collapsed vs expanded are visually distinct).
- **Anomalies flagged:** **MED — the capture is mislabeled OR the interaction targeted the wrong element.** File is named `accordion-expanded` but the top-left accordion's Section A is shown COLLAPSED (it was OPEN in the static section capture). Either: (a) the capture script clicked an already-open header and collapsed it, or (b) it clicked a different accordion than intended. The "expanded" state being demonstrated is not obvious. No CSS/render defect in the accordion itself — this is a capture-fidelity issue.
- **Open question for owner:** Which accordion + which section was the `accordion-expanded` capture meant to exercise? As captured, it shows a COLLAPSE, not an expand — the audit cannot verify the intended expanded-state visual.

## Screenshot: desktop-dark-state-tabs-switched.png
- **Surface captured:** A tab strip (OVERVIEW / ANALYTICS / SETTINGS) with the ANALYTICS tab active, and the panel below showing "Analytics tab content. Activated when the Analytics tab is clicked." This is the index.html tab component (per the task brief — tabs-switched is an index.html capture).
- **Viewport / theme:** Desktop × dark.
- **What's rendered:** 3 tabs in a horizontal strip with a bottom rule. ANALYTICS (middle) is active: its label is orange and it carries an orange bottom-border bar that sits on the divider line. OVERVIEW and SETTINGS are idle with muted-gray labels. The active panel content renders below.
- **Cross-reference vs design DNA:** STRONGLY matches §F11: tabs are bottom-rule sliders, active tab gets an accent bottom bar that "becomes the divider in its slot" (the orange bar aligns exactly with the bottom rule). Idle labels = `--ts-text-muted`, active label = accent. Uppercase + tracked labels = §B4. The negative-margin overlap mechanism (active bar = divider) is visually confirmed — the orange bar is flush with the strip's bottom line.
- **Anomalies flagged:** none — the switched/active tab state renders exactly per §F11. Active accent bar, accent label, idle muted labels, content swap all correct. This is the cleanest interactive-state capture in Batch B.
- **Open question for owner:** none.

## Screenshot: desktop-light-state-accordion-expanded.png
- **Surface captured:** Accordion section, light theme, post-interaction — same state as desktop-dark-state-accordion-expanded.png (Section A & B collapsed in the top-left group; Alpha/Schema-A panels open).
- **Viewport / theme:** Desktop × light.
- **What's rendered:** Light-theme accordion. Same collapsed/open pattern as the dark state capture.
- **Cross-reference vs design DNA:** Same as dark accordion-expanded state. Light remap correct; chevron/minus toggles render.
- **Anomalies flagged:** Same MED capture-fidelity issue as desktop-dark-state-accordion-expanded.png (named "expanded" but shows Section A collapsed). Plus the recurring light-theme weak header/panel surface contrast (LOW–MED).
- **Open question for owner:** Same as desktop-dark-state-accordion-expanded.png.

## Screenshot: desktop-light-state-tabs-switched.png
- **Surface captured:** Tab strip (OVERVIEW / ANALYTICS / SETTINGS), ANALYTICS active, light theme.
- **Viewport / theme:** Desktop × light.
- **What's rendered:** Light-theme tab strip. ANALYTICS active with orange label + orange bottom bar flush to the divider; OVERVIEW/SETTINGS idle gray. Active panel content below.
- **Cross-reference vs design DNA:** Matches §F11 exactly, same as the dark tabs-switched capture. Active accent bar = divider mechanism confirmed in light theme too.
- **Anomalies flagged:** none — tab active state renders correctly in light theme. Light theme here has adequate contrast (the dark accent bar + dark text on white work well; tabs are a strong light-theme component unlike the gray-on-white panels).
- **Open question for owner:** none.

═══════════════════════════════════════════════════════════════════════
## Anomalies — Batch B
═══════════════════════════════════════════════════════════════════════

1. **[HIGH] Global text rendering quality — Space Grotesk likely substituted in headless.** `desktop-dark-lab-fullpage.png`, `desktop-light-lab-fullpage.png`, and ALL 32 captures: body and heading text shows a faint double-strike / heavy fallback-render quality. Consistent across every capture → strongly suggests the Playwright headless environment failed to load the render-blocking Space Grotesk `<head>` font and substituted a system fallback. **Render-env suspected — must be confirmed against owner GoFullPage (W1.6.A) ground-truth captures before treating as a CSS regression.** If GoFullPage shows clean type, this is a capture-tooling artifact, not a Toolskin defect.

2. **[HIGH] Topbar wordmark renders as an illegible dark double-struck smear.** All captures containing the topbar (`*-fullpage`, `desktop-*-lab-section-accordion`, both `*-state-accordion-*`). The `.ts-topbar__logo` (§F9 — grid-composed, uppercase, display-weight, letter-tracked) is unreadable at top-left. Likely the same headless font-substitution issue compounded by the logo's display font + heavy weight. Render-env suspected; confirm against W1.6.A.

3. **[HIGH] FontAwesome icons absent on toast trigger buttons (and topbar nav glyphs).** `desktop-dark-lab-section-toast.png`, `desktop-light-lab-section-toast.png`: all 4 toast buttons (SUCCESS/WARNING/ERROR/CORE TOOLSKIN TOAST) show label text only, no leading status glyph. Meanwhile accordion header icons, select chevrons, sort grips DO render → the failure is isolated to the FontAwesome CSS-font icon path; the surviving icons are likely Ionicons (web components) or CSS-drawn. Per DNA §G4, Toolskin uses FontAwesome 6 + Ionicons — only the FA half fails. Render-env suspected (FA webfont not loaded in headless); confirm against W1.6.A. If FA also fails in ground-truth, it is a real pinned-version/asset-loader regression.

4. **[MED] Green status pill renders "OK" as "DK".** `desktop-dark-lab-section-table.png`, `desktop-light-lab-section-table.png` (table rows ID 12, 240, 401). Theme-independent and NOT a FontAwesome issue. Amber "PENDING" (7ch) and red "FAILED" (6ch) render fully — only the 2-character label clips. Points to a chip min-width / horizontal-padding interaction that clips very short uppercase labels at the chip's letter-spacing. Either a real chip-padding defect (fix in rebuilt `.ts-chip`) or the source data literally says "DK" — owner must disambiguate.

5. **[MED] Light-theme surface-boundary contrast is too weak across the board.** `desktop-light-lab-fullpage.png`, `tablet-light`, `mobile-light`, `desktop-light-lab-section-controls.png`, `-drag-resize`, `-masonry`. Light-gray panels on a white body produce barely-perceptible surface boundaries. Borderless layout sections (§C3: "surface contrast IS the boundary") work in dark theme but fail in light because the light-palette surface steps are too close in luminance. SURFACES the question of whether §C7's tuned mixing constants (6%/14%) were tuned for the light palette or only dark.

6. **[MED] "Light panel (readable on dark chrome)" demo is nearly invisible in light theme.** `desktop-light-lab-section-controls.png`: the demo panel — explicitly built to be a light surface readable against dark chrome — renders as light-gray text on a light-gray/white surface, effectively unreadable in light theme. A panel designed for dark-theme contrast does not re-contrast when the global theme flips to light. (Dark-theme equivalent `desktop-dark-lab-section-controls.png` renders the same panel clearly.)

7. **[MED] Tooltip "BADGE" pill: cramped label + dark-text-on-orange contradicts §C5.** `desktop-dark-lab-section-tooltips.png`, `desktop-light-lab-section-tooltips.png`. The solid-orange pill badge's uppercase label sits cramped against the pill's rounded ends (pill `--ts-radius-full` needs more horizontal padding than a sharp chip) and is slightly vertically off-center. Separately: the label renders DARK on orange — per §C5/Rule 7, `--ts-on-accent` OKLCH should yield WHITE for a hue-18 orange (lightness below the 0.75 black-threshold). Dark text implies the badge does not use `--ts-on-accent` (hardcoded color) — a contradiction between visual reality and the DNA's stated OKLCH auto-contrast rule. Theme-independent.

8. **[MED] `accordion-expanded` state captures show a COLLAPSED section, not an expanded one.** `desktop-dark-state-accordion-expanded.png`, `desktop-light-state-accordion-expanded.png`. In the static section capture Section A of the top-left "Joined·multiple-open" group is OPEN; in the "expanded" state capture it is CLOSED. The capture either clicked an already-open header (collapsing it) or targeted the wrong accordion. The accordion CSS itself renders collapsed/expanded states correctly — this is a capture-fidelity defect that leaves the intended expanded-state visual unverified.

9. **[LOW] Masonry/"Dense" tiles render as empty placeholders.** `desktop-dark-lab-section-masonry.png`, `desktop-light-lab-section-masonry.png`, and the fullpages. Most masonry/dense grid tiles are empty dark/gray boxes with only tiny index marks. Expected for a layout demo (structure-only), flagged LOW so the rebuild does not mistake empty tiles for a content-loading failure. Compounded in light theme by weak tile-boundary contrast (anomaly 5).

10. **[LOW] API code block has no syntax highlighting.** `desktop-dark-lab-section-api.png`, `desktop-light-lab-section-api.png`. Monospace code renders in a single foreground color. Likely intentional for a utilitarian API reference; flagged LOW in case token-colored syntax was expected.

11. **[LOW] Standalone number input value appears centered, not left-aligned.** `desktop-dark-lab-section-spinner.png`, `desktop-light-lab-section-spinner.png`. The auto-wrapped standalone `<input type="number">` ("42") shows its value centered, while the section text describes "value on the left" for the UIKit spinner. May be an intended difference for the wide variant; flagged LOW.

═══════════════════════════════════════════════════════════════════════
## Owner-pending questions — Batch B
═══════════════════════════════════════════════════════════════════════

1. **[`desktop-dark-lab-fullpage.png` + all captures]** Do the owner's GoFullPage (W1.6.A) ground-truth captures show clean Space Grotesk type and a legible topbar wordmark? If yes, anomalies 1 & 2 are Playwright-headless artifacts and the design DNA needs no change. If GoFullPage ALSO shows degraded type, it is a real render-blocking-font regression.

2. **[`desktop-dark-lab-section-toast.png`]** Are the toast trigger buttons spec'd to carry leading FontAwesome status icons? And more broadly — does the lab page split icons between FontAwesome (CSS-font) and Ionicons (web component), explaining why only some glyphs render in headless? Confirm the icon-source split (DNA §G4 states both systems are in use).

3. **[`desktop-dark-lab-section-table.png`]** Is the green status label intended to be "OK" (currently clipped to "DK" by chip padding) or literally "DK"? If "OK", the rebuilt `.ts-chip` has a short-label clipping bug to fix (min-width / horizontal-padding interaction at chip letter-spacing).

4. **[`desktop-light-lab-fullpage.png` + `desktop-light-lab-section-controls.png`]** Is the light theme's weak surface-boundary contrast intentional (a deliberately soft light mode), or a tuning regression? Were §C7's load-bearing mixing constants (6%/14%/32%/46%) tuned against the light palette, or only the dark palette? The "Light panel" demo card going invisible in light theme suggests dark-only tuning.

5. **[`desktop-dark-lab-section-tooltips.png`]** Is the orange "BADGE" pill meant to use `--ts-on-accent` for its label color? Its dark-on-orange rendering contradicts the §C5/Rule 7 OKLCH formula's expected white-for-hue-18-orange output — suggesting a hardcoded label color. Also: should pill-radius (`--ts-radius-full`) chips receive extra horizontal padding versus sharp-radius chips?

6. **[`desktop-dark-state-accordion-expanded.png`]** Which accordion and which section was the `accordion-expanded` interactive capture meant to exercise? As captured it shows a section being COLLAPSED, not expanded, leaving the intended expanded-state visual unverified — a re-capture may be needed for W1.6.B.


# Rebuild Visual Audit — Batch C

**Analyst:** Wave 1.6 Visual Audit Analyst — Batch C (owner real-Chrome ground-truth + headless-vs-real comparison)
**Date:** 2026-05-19
**Scope:** 13 owner real-Chrome GoFullPage captures (`docs/handoffs/_visual-audit/owner-ground-truth/`) + 4 Playwright headless reference PNGs (`docs/handoffs/_visual-audit/screenshots/`) for the headless-vs-real validation.
**Authority:** Owner real-Chrome captures are HIGHEST authority (Pattern 17) — they are what the owner's eye sees. This file is GROUND-TRUTH visual record, primary input to Phase E.
**Output discipline:** EXTRACTION ONLY. Where rendered reality contradicts `_rebuild-design-dna.md`, the contradiction is SURFACED, never silently reconciled (Rule 11).
**Cross-reference base:** `docs/handoffs/_rebuild-design-dna.md` (Wave 1.5 DNA spec — text-derived).

> **Method note on the index full-page captures.** The owner provided the index page as both a full JPG (`index-screencapture-...jpg`, ~11 MB, ~22,729 px tall) and a `_compressed` JPG (same surface, ~1.2 MB). Per task instructions the `_compressed` version was the primary read for legibility; the matching Playwright headless fullpage PNGs (`desktop-dark-index-fullpage.png` 22,546 px / `desktop-light-index-fullpage.png`) were read alongside. For sections that are unreadable at full-page scale in BOTH owner and Playwright fullpages, the per-section Playwright PNGs (`desktop-dark-index-section-*.png`) were used as legibility aids — these are headless but render individual sections at 1:1 and are internally consistent with the owner capture's layout.

═══════════════════════════════════════════════════════════════════════
## GROUP 1 — OWNER REAL-CHROME GROUND-TRUTH CAPTURES
═══════════════════════════════════════════════════════════════════════

## Screenshot: index-screencapture-localhost-8002-2026-05-19-21_39_04.jpg (+ _compressed)
- **Surface captured:** `index.html` — the master showcase page, DARK mode, full-page top-to-bottom (~22,700 px tall). The `_compressed` twin is the same surface re-encoded smaller for legibility.
- **Source:** owner real-Chrome (GoFullPage)
- **What's rendered:** Sticky dark topbar with `TOOLSKIN` wordmark (TOOL in light, SKIN in accent orange — two-tone wordmark, uppercase, tracked) and a right-side nav/control cluster. Below: a full-bleed SOLID ORANGE hero band ("One engine — surfaces, gradients, controls") with a single light pill button — this is the loudest accent block on the page and the only place accent is painted as a large solid field. Then a near-black body running the full showcase: a "HERO TITLE / GRADIENT" display-type specimen (GRADIENT rendered with an orange→light gradient fill on part of the word), a typography ladder (H1–H6 + label tiers), color swatch rows (orange/green/red/blue/lime status chips), button matrices, form/input panels, a code-block panel, a dark data table, a pricing-card trio ($49 / $199 / $899 with the $199 middle card accent-bordered and carrying a solid-orange "NEXT STEPS"-type primary button), a full-bleed orange marquee strip ("NEW…"), a second display marquee ("Design, Software And Marketing Systems For The…" with a duplicated copy and an accent-colored trailing copy), more form sections, stat cards (numbers "49" / "899" in accent), three "DYNAMICS / VISUALS / SPEED" numbered cards, a "Social Links" row, a "Footer Components" section, a dark "Toolskin Mockup Previews" band, and a "Banner Generator" promo block ending with a large dark canvas showing the TOOLSKIN wordmark + `</>` glyph.
- **Cross-reference vs design DNA:**
  - C1 (accent solid only on primary button + active chip) — **partial contradiction at the page level.** DNA C1 says accent is painted SOLID only on `.ts-btn--primary` and `.ts-chip--accent/--active`. The rendered page has TWO large full-bleed SOLID ORANGE bands (the hero band and the "NEW" marquee strip). These are section/marquee backgrounds, not buttons or chips. DNA §F7 does account for the marquee (`--ts-marquee-bg: --ts-accent-glow-bg-2`, a radial glow) — but the rendered "NEW" strip reads as a near-FLAT solid orange, not a soft radial glow. And the hero band is a solid-accent SECTION, which C1's enumeration does not cover at all. Surfaced as OQ-C-VIS-1.
  - Two-tone `TOOLSKIN` wordmark (TOOL neutral / SKIN accent) is consistent with F9 logo DNA (uppercase, tracked, display weight) — the two-tone split itself is not documented in F9; F9 only specifies casing/tracking/weight. Minor surfacing OQ-LOGO-VIS.
  - Uppercase + tracking on buttons, chips, eyebrows, section eyebrows — consistent with B4 caps role-lock and B1 letter-spacing role-coding.
  - Pricing trio: middle card accent-bordered + solid-accent CTA — consistent with C1 (accent border for emphasis) and C3 (accent border on emphasis components).
  - Display gradient text ("GRADIENT", "Design, Softwa…") — consistent with the showcase demonstrating gradient-fill display type; DNA does not name a gradient-text token but §F display specimens imply it.
  - Surface tiering (near-black body, slightly raised cards, sunken code panels) is visible and consistent with the `--ts-this-bg` depth-by-surface philosophy (C4: depth via surface mixing, not shadow).
- **Anomalies flagged:** No broken icons, no contrast failures, no layout breaks visible. FontAwesome/Ionicon glyphs render (icons present in feature lists, buttons, social row). The hero band's solid-orange intensity vs DNA C1 is a DNA-coverage gap, flagged below — not a render defect.
- **Headless vs real-Chrome:** **MAJOR DISCREPANCY.** Compared against `desktop-dark-index-fullpage.png` (Playwright headless, same 1920-wide × ~22,5k-tall page): the owner real-Chrome capture shows EVERY section fully populated with content. The Playwright headless fullpage shows the topbar, hero band, the "HERO TITLE / GRADIENT" specimen, ONE partially-rendered button/form fragment, the orange "NEW" marquee, the "Design, Software…" display marquee, and the three "DYNAMICS/VISUALS/SPEED" cards — but LARGE VERTICAL STRETCHES BETWEEN THEM ARE EMPTY (blank dark canvas where typography ladder, color swatches, full form panels, code block, data table, pricing trio, stat cards, social row, footer, mockups and banner-generator content all exist in the owner capture). The page HEIGHT is reserved correctly (so layout/measurement is intact) but the in-section CONTENT did not paint in the stitched headless fullpage. Per-section Playwright captures (`desktop-dark-index-section-typography.png`, `-cards.png`, `-forms.png`, `-banner-generator.png`) render those SAME sections fully and correctly at 1:1 — confirming the cause is lazy-load / IntersectionObserver / scroll-triggered reveal NOT firing during the headless full-page stitch, not a CSS or asset failure. Verdict detail in the Batch C verdict section.
- **Open question for owner:** OQ-C-VIS-1 — Is the solid full-bleed orange HERO BAND an intentional accent-section pattern that DNA C1 must be widened to include? C1 currently states accent goes solid ONLY on primary button + accent/active chip; the rendered index has a solid-accent hero section AND a near-flat solid-orange marquee. Should DNA add a documented "accent section / accent band" application tier?

## Screenshot: index-light-screencapture-localhost-8002-2026-05-19-21_39_04.jpg (+ _compressed)
- **Surface captured:** `index.html` — same master showcase page, LIGHT mode, full-page.
- **Source:** owner real-Chrome (GoFullPage)
- **What's rendered:** Same section sequence as the dark capture, on a light/off-white surface system. Topbar is light with the two-tone wordmark (TOOL dark / SKIN orange). The orange hero band stays full-bleed solid orange (accent band is mode-invariant — it does not lighten in light mode). Body sections sit on white / very-light-grey surfaces with subtly raised card surfaces and light borders. Status swatches, button matrices, form panels, the data table (which renders with a dark header row even in light mode), pricing trio, stat cards, "DYNAMICS/VISUALS/SPEED" cards, social row, footer, mockup band, and Banner Generator block all present. The Banner Generator's canvas preview at the bottom stays a dark canvas with the TOOLSKIN wordmark even in light mode (the canvas is its own dark surface, by design).
- **Cross-reference vs design DNA:**
  - Light mode is a full surface-token re-map (C6 / design-tokens-2.0 Tier-2 `[data-theme="light"]` overrides) — text inverts to dark, surfaces invert to light, borders stay derivative. Consistent with the `--ts-this-bg` derivative philosophy: the page re-themes wholesale.
  - The accent orange does NOT change between dark and light — consistent with the accent being an HSL-pipeline primary that is mode-independent (Rule 8 / C-series). The hero band, marquee, primary buttons and accent text stay the same orange in both modes.
  - The dark data-table header inside light mode is a deliberate surface re-scope (a component setting its own darker `--ts-this-bg`) — consistent with C6 / D-series surface re-scoping. Not a contrast failure.
  - Light-mode card borders are visible and low-contrast — consistent with C3 (molecular border = derivative, quiet).
- **Anomalies flagged:** No broken icons, no layout breaks. One thing to verify with owner (not a defect): in light mode several large mid-page sections render with very light, low-contrast section eyebrows / helper text on near-white — legibility of the smallest helper text on white should be confirmed at 1:1, but at capture scale nothing reads as a hard WCAG fail.
- **Headless vs real-Chrome:** **MAJOR DISCREPANCY — same pattern as dark.** `desktop-light-index-fullpage.png` (Playwright headless) shows the topbar, hero band, "HERO TITLE/GRADIENT" specimen, a small form fragment, the "NEW" marquee, the "Design, Software…" marquee and the DYNAMICS/VISUALS/SPEED cards — with the SAME large empty vertical stretches between them. The light headless fullpage is arguably WORSE for an analyst because the empty regions are blank WHITE, so a careless reader could mistake an unrendered section for an intentionally empty white section. Owner light capture confirms all those regions are fully populated. Same root cause: scroll-triggered content not revealed during the headless stitch.
- **Open question for owner:** OQ-C-VIS-2 — In light mode, confirm the smallest helper / eyebrow text passes contrast on the near-white surface (WCAG AA 4.5:1 normal text). Cannot be measured precisely from a full-page capture; flag for a 1:1 check.

## Screenshot: screencapture-localhost-8002-generator-2026-05-19-21_44_16.jpg
- **Surface captured:** `/generator` — the Toolskin Banner Generator app, DARK mode. TEXT tab active in the right inspector. Canvas shows a black banner with the white "TOOLSKIN" wordmark.
- **Source:** owner real-Chrome (GoFullPage)
- **What's rendered:** A full single-viewport app shell (1438-ish wide). Top app-bar: `TOOLSKIN | v2.3` wordmark left ("BANNER GENERATOR" micro-label under it), a tool cluster center-right ("PATTERN GENERATOR" pill + home/folder/save icon buttons), a solid-orange "PREVIEW & EXPORT" primary button, and two trailing icon buttons (refresh, dark-mode toggle). Left edge: a "1200 × 900 PX" size chip + an "88%" zoom chip. Center: large dark banner canvas — white "TOOLSKIN" wordmark, an orange `</>` glyph top-right, an orange "FRAMEWORK FOR CREATORS" eyebrow, and an orange-outlined "V1.2.2" badge. Right inspector panel: tab row (TEXT active / BG / ELEMENTS / ICON / CANVAS), then collapsible sections — "TITLE" (open: text input "TOOLSKIN", a FONT select "Space Grotesk" + WEIGHT select "Black", a SIZE slider at 145px with an accent-filled track + numeric box, a COLOR row with white swatch + "#ffffff" hex, a "Word Wrap" toggle), then collapsed "TEXT GRADIENT" and "TAGLINE & BADGE" rows. Footer of the panel: a solid-orange "PREVIEW & EXPORT" + an outline "SAVE".
- **Cross-reference vs design DNA:**
  - The font select reads "Space Grotesk" and weight "Black" — directly confirms the typography-master anchor (Space Grotesk as the body/UI anchor) AND B3 (900/black weight available and used for display). Strong DNA confirmation from rendered reality.
  - The SIZE slider has an accent-orange filled track — consistent with C1 (accent as a functional fill on an active control) and the input/control derivative system.
  - Collapsible inspector sections with `+` / chevron affordances — consistent with F10 accordion DNA (chevron affordance, derivative-sized header) although this is the generator's own panel idiom.
  - "PREVIEW & EXPORT" solid-orange = primary button (C1). "SAVE" outline = `--outline` variant (F3). Both confirm the button variant system in rendered reality.
  - Uppercase micro-labels ("FONT", "WEIGHT", "SIZE", "COLOR", section titles) — consistent with B4 caps role-lock for labels.
  - Icon buttons (home/folder/save/refresh/theme) render with crisp glyphs — FontAwesome/Ionicon system intact.
- **Anomalies flagged:** None. All icons render, no contrast failures, no layout break, no clipping. App shell is dense and coherent.
- **Headless vs real-Chrome:** No headless counterpart (generator was not in the 4-PNG Playwright reference set).
- **Open question for owner:** None.

## Screenshot: screencapture-localhost-8002-generator-2026-05-19-21_45_36.jpg
- **Surface captured:** `/generator` — Banner Generator, DARK mode, BG tab active. Canvas now shows a multi-color mesh-gradient background.
- **Source:** owner real-Chrome (GoFullPage)
- **What's rendered:** Same app shell as above. The BG tab is now active; the canvas banner background is a vivid mesh gradient (warm orange/red top-left blending to lime/yellow-green bottom-right) with visible grain/noise texture, the white "TOOLSKIN" wordmark and orange eyebrow/badge still on top. Right inspector: "GLOBAL ACCENT" collapsible (collapsed, `+`), "BACKGROUND MODE" open — a mode selector row (Radial / Linear / Solid on top row; Mesh / Image on bottom row, with **Mesh** selected and shown with a brown/dark-orange active fill), an ORIGIN 3×3 directional pad (9 arrow buttons, the right-center one active in solid orange), "GRADIENT STRENGTH" slider at 44%, "MESH SMOOTHNESS" slider at 95%, a disabled/greyed "ANGLE" slider at 351°, then color inputs: "BG LIGHT" with a bright-green swatch (#66ff00), "BG DARK" with a red swatch (#f50a0a), "MESH COLOR 3" with a grey swatch (#333333). Below: collapsed "GRAINY NOISE" (label "SVG feTurbulence") and "ACCENT GLOW" rows. Footer: same orange "PREVIEW & EXPORT" + outline "SAVE".
- **Cross-reference vs design DNA:**
  - The mesh gradient + visible grain confirms the "atmospheric depth" DNA (G6 anti-pattern rejects flat solid backgrounds; the generator literally tools grain + gradient + mesh as first-class). Confirms `--ts-grain` / noise as an intentional Toolskin atmospheric layer.
  - The directional ORIGIN pad's active cell renders in solid orange — accent-as-active-state on a control (C1 functional fill).
  - The active "Mesh" mode button shows a muted brown/dark-orange fill rather than full-saturation accent — consistent with C1's tinted-accent treatment for a selected-but-not-primary control (accent appears tinted/dim, not solid, outside primary CTA). Good rendered confirmation of the tinted-accent rule.
  - Disabled "ANGLE" slider renders visibly greyed/dimmed — consistent with the `--ts-this-bg-disabled` derivative state (design-tokens-2.0 derivative chain).
  - The arbitrary swatch colors (#66ff00 lime, #f50a0a red) are USER-CHOSEN canvas content, not Toolskin tokens — correct; the generator outputs arbitrary banners, so non-token colors here are expected and not a G5 violation.
- **Anomalies flagged:** None. Mesh gradient renders smoothly with no harsh banding visible at capture scale. All controls render.
- **Headless vs real-Chrome:** No headless counterpart.
- **Open question for owner:** None.

## Screenshot: screencapture-localhost-8002-surface-lab-html-2026-05-19-21_59_42.jpg
- **Surface captured:** `surface-lab.html` — the surface/contrast/token export lab, DARK mode, full-page (~7,760 px tall).
- **Source:** owner real-Chrome (GoFullPage)
- **What's rendered:** Topbar with `TOOL SKIN` wordmark + nav. A dark hero with an "● BOXED HERO · V1.5.0 · 2026"-style eyebrow pill, a large `TOOLSKIN` display wordmark (SKIN in accent), a short paragraph, two buttons (a solid-orange "JOIN COMPONENTS"-type primary + an outline secondary), and an ACCENT swatch row of ~8 colored chips (orange/teal/green/yellow/purple/pink etc.). Then a full-bleed SOLID ORANGE band with "One engine — surfaces, gradients, controls" + a light pill button (identical accent-band motif to index.html). Body: a surface-swatch matrix — rows of surface tiles labelled "— ts-bg-0…5" plus accent/success/warning/danger tiles (orange, lime-green, yellow, red tiles among neutral grey tiles). A large "PREVIEW, CONTRAST & SURFACE EXPORT" panel containing: "PREVIEW CONTROLS" with accent-preset swatch chips, "GLOBAL CONTRAST TWEAK (SURFACE MAPS)" with an accent-filled slider, "SURFACE TOKEN EXPORT (DARK + LIGHT)" with two code-export blocks. Then "COLOR ENGINE (HSL)" and "RADIUS (GLOBAL)" code panels. Lower: a "neutral palette presets" section with multiple preset cards ("Classic — V1 Neutral Cool", "Classic — V2 Warm Slate", "Classic — V3 Blue-Tinted Professional", "Practical — Neutral with proper steps (recommended)", "Practical — Slightly cool"), each card showing a grey-step ramp, mini swatches and a JSON-ish token block + a small accent button. A full-bleed RED reset bar ("Reset surface presets…"). Dark footer with link columns + a newsletter input + orange "Subscribe" button.
- **Cross-reference vs design DNA:**
  - The surface-swatch matrix is a literal visual of the `--ts-bg-0…5` primitive ladder (design-tokens-2.0 Tier 1) and the accent/status surfaces — direct rendered confirmation of the surface token scale.
  - The full-bleed solid-orange band ("One engine…") is the SAME accent-band motif seen on index.html — reinforces OQ-C-VIS-1: this accent-section pattern recurs across multiple showcase pages, so it is an established Toolskin pattern that DNA C1 does not currently document.
  - The full-bleed RED "Reset…" bar is a solid-danger band — same logic: a status color painted as a full-bleed section background, again outside C1's button/chip enumeration. Strengthens OQ-C-VIS-1 (extend it to status bands).
  - Accent-preset swatch chips + accent-filled "GLOBAL CONTRAST TWEAK" slider = accent on functional controls (C1).
  - Preset cards with grey-step ramps demonstrate the surface-derivative tooling — consistent with C6/C7 (the mixing percentages and surface ladder are tunable, the lab literally exposes that tuning).
  - Code-export panels (token JSON / HSL / radius) confirm the system is token-export-driven — consistent with the whole design-tokens-2.0 premise.
- **Anomalies flagged:** None. No broken icons, no clipping, no layout break. Code blocks render in monospace (JetBrains Mono anchor — B-series mono anchor confirmed). The red reset bar is high-contrast and intentional.
- **Headless vs real-Chrome:** No headless counterpart (surface-lab was not in the 4-PNG reference set).
- **Open question for owner:** Reinforces OQ-C-VIS-1 (see verdict): the accent band AND a danger band both appear as full-bleed solid section backgrounds — does DNA need an "accent / status section band" application tier added to §C?

## Screenshot: screencapture-localhost-8002-toolskin-lab-html-2026-05-19-22_02_38.jpg
- **Surface captured:** `toolskin-lab.html` — "Toolskin UI Kit Lab", DARK mode, full-page (~9,175 px tall). Component playground.
- **Source:** owner real-Chrome (GoFullPage)
- **What's rendered:** Topbar with `TOOL SKIN` wordmark + a long nav. A header card "Toolskin UI Kit Lab" with description + a "VIEW SOURCE" button. Then a long stack of component demo sections, each a titled panel: "Toast (DRY)" with toast trigger buttons; "Accordion" — multiple accordion groups, expanded and collapsed states, separated-variant accordions, accordions with toggle-rows and left/right control variants; "Select (search + icons)"; "Spinner & number inputs" — number steppers; "Tooltips" with NEUTRAL/ACCENT trigger buttons; "Draggable & Resizable" — drag/resize demo boxes; "Sortable list" — stacked sortable rows; "Checkboxes & Radio" — checkbox/radio groups, an accent checkbox checked, a small floating tooltip/popover visible top-right of that block; "Data table" — a dark table with status pills (orange/green badges), qty + price columns; "Masonry" — a masonry image/box grid with one large accent-tinted "HERO ITEM 18 (3×3)" tile and many neutral tiles; "Compact" masonry variant; "UI flat masonry grid" — three large "DYNAMICS/VISUALS/SPEED" cards (accent headings); a "UI tile masonry"-type row of small tiles; "Grid items" — a thumbnail photo strip (5 landscape photos); an "API" code panel at the bottom.
- **Cross-reference vs design DNA:**
  - Accordion demos confirm F10: chevron affordance, derivative-sized headers, `--separated` variant breaking the unified shell into individually-bordered items, toggle-row variants. Strong rendered confirmation.
  - Toast triggers + the toast component confirm F12 (toast as a component family).
  - Data table with status pills (orange / green) confirms status-color chips (F1 chip variants `--success` etc.) and C1 (accent/status chips can be solid-ish for status).
  - The masonry "HERO ITEM 18 (3×3)" tile renders with an accent TINT (not solid accent) — consistent with C1 tinted-accent for emphasis-without-being-a-CTA.
  - "DYNAMICS / VISUALS / SPEED" cards reappear here (also on index.html and in the Playwright lab capture) — a recurring showcase card pattern with accent display headings.
  - Tooltips with NEUTRAL vs ACCENT variants confirm the accent/neutral variant axis on small components.
  - Checkbox/radio with an accent-checked state confirms accent-as-active on form controls (C1 functional fill).
  - Monospace code panels (API section) confirm JetBrains Mono anchor.
- **Anomalies flagged:** None broken. All component sections render with content (contrast with the index headless fullpage — see headless verdict). Glyphs/icons render. No clipping or layout break.
- **Headless vs real-Chrome:** **THIS IS THE SECOND HALF OF MY COMPARISON TASK.** Compared against `desktop-dark-lab-fullpage.png` (Playwright headless full-page of the SAME `toolskin-lab.html`): **the lab page matches FAITHFULLY.** The Playwright headless lab fullpage shows the same header card, the same accordion stack, select/spinner/tooltip/drag-resize/sortable sections, the checkbox-radio block (with the same little floating popover top-right), the data table with the same orange/green status pills, the masonry grid with the same accent-tinted "HERO ITEM 18 (3×3)" tile and neutral tiles, the "DYNAMICS/VISUALS/SPEED" cards, the thumbnail strip, and the API code panel — in the SAME order, SAME layout, SAME colors, SAME populated state. Unlike the index page, the lab page's content sections ARE fully painted in the headless stitch (the lab page has less scroll-triggered/lazy content, so the headless capture caught it). Minor differences only: (a) the per-section lab PNGs at the very small sizes (toast 3.7 KB, tooltips 5 KB, select 6.8 KB) are essentially empty/near-empty crops — those tiny sections captured almost nothing, which is a section-crop framing artifact, not a render failure (the fullpage shows those sections fine); (b) font rendering: the owner real-Chrome capture shows slightly heavier/softer text (Windows ClearType / subpixel + GoFullPage JPG compression) vs the Playwright PNG's lighter, crisper greyscale-antialiased text — a hinting/AA difference, not a layout or color difference. No missing elements, no color shift, no gradient banding difference, no layout break between the two on the lab page.
- **Open question for owner:** None specific to this surface.

## Screenshot: screencapture-localhost-8002-ts-gallery-demo-html-2026-05-19-22_07_09.jpg
- **Surface captured:** `ts-gallery-demo.html` — "ts-gallery · first draft", DARK mode, full-page.
- **Source:** owner real-Chrome (GoFullPage)
- **What's rendered:** A dark page. Heading "ts-gallery · first draft" with a descriptive paragraph and small status chips ("GEOMETRIC · FLOAT BASED" type tags). Section "Portfolio layout" — a populated asymmetric image mosaic: photographs of varying aspect ratios (landscape coast, harbor crane, street crowd, horses in a field, rolling hills, a green door, a Timex clock close-up, a stairwell, mountains, ivy-covered balconies, a colorful building row, a barn at sunset, a wheat field) tiled in a tight float/percentage grid with mixed full/half/third/double-height cells. Section "Uniform grid" — a 4-column × 3-row grid of EMPTY dark cells (placeholder grid, no images loaded) with an "+ Add image" + "Shuffle" control pair. Section "Sortable gallery" — a vertical stack of ~7 narrow EMPTY light-grey placeholder rows.
- **Cross-reference vs design DNA:**
  - The "Portfolio layout" mosaic confirms the asymmetric-grid / spatial-tension DNA (G6 anti-pattern rejects symmetric predictable layout; this gallery is deliberately asymmetric, mixed-aspect — Toolskin identity).
  - Section eyebrows / tags are uppercase tracked — B4 caps role-lock.
  - The "Uniform grid" and "Sortable gallery" sections render their CONTAINERS and grid cells correctly but the cells are EMPTY — this is a "first draft" page (the heading literally says "first draft") so empty demo regions are likely intentional WIP, not a render failure. The grid structure (4×3, gaps, radius) IS visible and correct.
- **Anomalies flagged:** Empty cells in "Uniform grid" and "Sortable gallery" — flagged as LOW severity / likely-intentional WIP given the "first draft" page title. Should be confirmed with owner that these are intentionally unpopulated and not an asset-load failure. No broken icons, no layout break, no contrast issue.
- **Headless vs real-Chrome:** No headless counterpart (ts-gallery-demo not in the 4-PNG reference set).
- **Open question for owner:** OQ-C-VIS-3 — On `ts-gallery-demo.html`, are the empty "Uniform grid" and "Sortable gallery" cells intentional first-draft placeholders, or did demo images fail to load? (Heading "first draft" suggests intentional.)

## Screenshot: screencapture-localhost-8002-cube-portfolio-html-2026-05-19-22_07_57.jpg
- **Surface captured:** `cube-portfolio.html` — the 3D-cube portfolio landing, DARK mode, above-the-fold viewport. NOTE: the capture includes a browser/devtools RULER overlay (px ruler along top and left edges) — this is a capture-environment artifact, not part of the page.
- **Source:** owner real-Chrome (GoFullPage)
- **What's rendered:** A near-black full-bleed hero. Thin top utility row: "Featured Works, Archive, About" centered, "● Available Now" top-right. Center: a 3D-rotated cube/box assembly built from photographic tiles (forest, tools/workbench, a dark interior, etc.) — the images are mapped onto cube faces and shown mid-rotation in perspective, some faces edge-on as thin slivers. Bottom-left: a HUGE accent-orange "TS" set in massive display type, partly cropped by the viewport bottom, with "Toolskin / Design System - v1.0" small text above it. A faint centered "Issue N°001 / Coll. 2026 / Ref. TS-032026-R01" metadata block. Right edge: a long vertical scrolling list of project names ("Signal / Noise", "Moving Portraits", "Issey Miyake SS25", "Studies in Motion", "Ruby Campbell", "Shaped by Earth", "Echoes in Light", "Archive 001", "Surface Tension", "Deep Field", "Frequency", "Meridian", "Chromatic", "Concrete Forest", "Drift", "Neon Garden", … repeating).
- **Cross-reference vs design DNA:**
  - The oversized accent "TS" display lettering confirms display-type DNA: extreme scale, accent fill, B3 black/900 weight territory, B1 tight tracking on display. Strong rendered confirmation of the "typography as 90% of design / bold display" identity.
  - The 3D cube is a bespoke showcase hero effect — not enumerated in DNA §F (DNA §F covers atomic→layout components, not page-level hero set-pieces). This is an editorial landing, outside the component DNA scope. No contradiction; just out-of-scope for §F.
  - Monospace metadata ("Ref. TS-032026-R01", "Issue N°001") — JetBrains Mono anchor used for technical/editorial micro-labels (consistent with B-series mono role).
  - Near-black ground + single hot-orange accent = the orange-on-near-black identity (G6: Toolskin defaults orange-on-near-black, rejects purple-on-white). Confirmed.
- **Anomalies flagged:** The px RULER overlay across the top and left is a capture artifact (devtools/extension ruler), NOT a page anomaly — noted so it is not mistaken for a design element. The huge "TS" is cropped at the viewport bottom — expected for an above-the-fold hero capture, not a clip defect. No broken icons, no contrast failure.
- **Headless vs real-Chrome:** No headless counterpart.
- **Open question for owner:** None. (Capture-artifact ruler noted; not a design question.)

## Screenshot: screencapture-localhost-8002-cube-portfolio-html-2026-05-19-22_08_52.jpg
- **Surface captured:** `cube-portfolio.html` — a portfolio DETAIL/case-study view ("Studies in Motion"), DARK mode. This is a second state of the cube-portfolio site (a project opened). Despite the task brief labelling cube-portfolio as "dark + light", BOTH cube captures are dark — this second one is a different PAGE STATE (project detail), not a light-mode variant.
- **Source:** owner real-Chrome (GoFullPage)
- **What's rendered:** A "← BACK" link top-left. An eyebrow "MOTION DESIGN · 2025". A large two-tone display headline "Studies in Motion" — "Studies" in an orange→light gradient fill, "in Motion" in white — mixed-weight (the two words appear set in different weights/styles). A descriptive paragraph. A metadata row with three columns: "YEAR / 2025", "TYPE / Motion Design", "CLIENT / Self-Initiated" (uppercase micro-labels over values). Then a 2×2 grid of large photographs (a person by the sea in a scarf, a derelict pier with birds at sunset, a wooden jetty leading to the horizon, a person in a red coat in snow).
- **Cross-reference vs design DNA:**
  - The two-tone gradient display headline ("Studies" gradient-filled, "in Motion" solid white) confirms gradient display-type as a Toolskin signature (same motif as index.html's "GRADIENT" word and the cube hero "TS").
  - The metadata row (uppercase label / value pairs) confirms B4 caps role-lock on labels and the eyebrow/label typography tier.
  - 2×2 image grid with consistent gutters — clean layout-grid usage. No border on the grid (C3: layout tier has no default border; the gap IS the structure).
  - Mixed-weight headline (one word heavier/display, one lighter) — consistent with B3 weight-as-semantic-role and the "hierarchy from weight/size/color, not more families" rule (typography-master).
- **Anomalies flagged:** None. Images load, no clipping, no layout break, no contrast failure.
- **Headless vs real-Chrome:** No headless counterpart.
- **Open question for owner:** OQ-C-VIS-4 — Task brief expected cube-portfolio "dark + light"; both owner cube captures are DARK (one hero, one project-detail). Confirm whether cube-portfolio has a light mode at all, or whether the second capture (project detail) was intended in place of a light capture.

## Screenshot: screencapture-localhost-8002-ts-phantom-portfolio-html-2026-05-19-22_09_53.jpg
- **Surface captured:** `ts-phantom-portfolio.html` — the "phantom" portfolio, DARK mode. A perspective image-wall hero state.
- **Source:** owner real-Chrome (GoFullPage)
- **What's rendered:** A full-bleed dark page filled edge-to-edge with a 3D-perspective grid/wall of photographic tiles, tilted in perspective so the wall recedes — rows of images (mountain landscapes, a black-and-white window, an autumn-leaf path, a sunset hillside, the Golden Gate bridge, a suspension-bridge deck, a highway interchange aerial, crashing waves on rocks, a red tram on a city street, a kayak on misty water, etc.). Interspersed among the photo tiles are a few SOLID FLAT-COLOR tiles (a bright yellow tile mid-left, another yellow tile lower-center, light/blank tiles) — these read as accent/placeholder tiles within the wall. The whole composition is dark, atmospheric, with the wall darkening toward the edges (vignette/perspective fade).
- **Cross-reference vs design DNA:**
  - The perspective image-wall is a bespoke page-level hero effect — like the cube, outside DNA §F component scope. No contradiction.
  - The edge-darkening / vignette is consistent with the "atmospheric depth" DNA (gradient/glow/grain atmosphere, G6 rejects flat backgrounds).
  - The bright-yellow flat tiles within the wall: yellow is one of Toolskin's status/accent-family colors (seen in the surface-lab swatch row). Their presence as flat tiles is likely intentional rhythm/accent punctuation in the wall, OR placeholder tiles for unloaded images — ambiguous. Flagged.
  - Near-black ground — orange/accent identity (here the accent punctuation is yellow rather than orange; the accent hue is configurable per the HSL pipeline, Rule 8).
- **Anomalies flagged:** The solid bright-yellow tiles in the image wall are ambiguous — intentional accent punctuation vs unloaded-image placeholders. Flagged LOW. No broken icons, no layout break, no contrast failure otherwise.
- **Headless vs real-Chrome:** No headless counterpart.
- **Open question for owner:** OQ-C-VIS-5 — On `ts-phantom-portfolio.html`, are the solid bright-yellow tiles in the perspective image wall intentional accent-color punctuation, or placeholders for images that did not load?

## Screenshot: screencapture-localhost-8002-ts-phantom-portfolio-html-2026-05-19-22_10_14.jpg
- **Surface captured:** `ts-phantom-portfolio.html` — a LIGHTBOX / image-detail overlay state of the phantom portfolio, DARK mode. This is the second phantom capture: a modal/lightbox open, not a light-mode variant.
- **Source:** owner real-Chrome (GoFullPage)
- **What's rendered:** The image wall is now heavily blurred and darkened in the background (a depth-of-field backdrop). Center: a single large square photograph in sharp focus (a beach with a wooden boardwalk/steps leading down to sand and sea, distant headland, cloudy sky). Top-right: an "✕" close button. Bottom-center: a thumbnail filmstrip of 4 images (a brown bear, a grey monochrome building, a bare tree against fog, and the currently-selected beach image) — the active beach thumbnail has an ORANGE border highlight.
- **Cross-reference vs design DNA:**
  - The blurred/darkened backdrop behind the focused image confirms the modal/overlay depth treatment (F8 modal: viewport overlay, the background recedes). The blur is heavier than a plain scrim — a depth-of-field overlay.
  - The active thumbnail's ORANGE BORDER is the accent used as a SELECTION INDICATOR — consistent with C1 (accent on active/selected state) and C3 (accent border on emphasis/selected). Rendered confirmation that accent-border = "selected" is a Toolskin pattern.
  - The "✕" close affordance — standard modal close (F8).
  - Centered single image in the lightbox — this lightbox is a bespoke gallery feature; the centering here is appropriate (a focused media object), and does NOT contradict G6's "symmetric center-aligned hero" anti-pattern (that anti-pattern is about HERO sections, not lightbox media).
- **Anomalies flagged:** None. Lightbox renders cleanly, close button present, active-thumbnail accent border renders. No clipping, no contrast failure.
- **Headless vs real-Chrome:** No headless counterpart.
- **Open question for owner:** OQ-C-VIS-6 — Task brief expected ts-phantom-portfolio "dark + light"; both phantom captures are DARK (one image-wall hero, one lightbox overlay). Confirm whether ts-phantom-portfolio has a light mode, or whether the lightbox state was captured in place of a light-mode variant.

═══════════════════════════════════════════════════════════════════════
## GROUP 2 — PLAYWRIGHT HEADLESS REFERENCE PNGs (read for comparison)
═══════════════════════════════════════════════════════════════════════

The 4 Playwright PNGs (`desktop-dark-index-fullpage.png`, `desktop-light-index-fullpage.png`, `desktop-dark-lab-fullpage.png`, `desktop-light-lab-fullpage.png`) were read solely to perform the headless-vs-real comparison. Findings are folded into the Group 1 sections for `index.html` (dark + light) and `toolskin-lab.html`, and into the verdict below. Summary of what the Playwright PNGs show:

- **`desktop-dark-index-fullpage.png` / `desktop-light-index-fullpage.png`** — correct page height, correct topbar, hero band, "HERO TITLE/GRADIENT" specimen, one form fragment, both marquees, and the DYNAMICS/VISUALS/SPEED cards — but LARGE EMPTY vertical stretches where the owner real-Chrome capture has fully-populated typography / color / form / table / pricing / stat / social / footer / mockup / banner-generator sections. Lazy-load / scroll-reveal content did not fire during the headless full-page stitch.
- **`desktop-dark-lab-fullpage.png` / `desktop-light-lab-fullpage.png`** — FULLY populated and FAITHFUL to the owner `toolskin-lab.html` capture: same section order, layout, colors, component states, masonry tiles, data-table status pills, code panels.
- **Corroborating evidence (not in the 4-PNG set but inspected to diagnose the index discrepancy):** the per-section Playwright PNGs `desktop-dark-index-section-typography.png`, `-cards.png`, `-forms.png`, `-banner-generator.png` each render their section FULLY and correctly at 1:1. This proves the index empty-region problem is purely a full-page-stitch lazy-load artifact — the CSS, fonts, and assets are all healthy; headless Chromium renders every section fine when that section is individually in-viewport.

═══════════════════════════════════════════════════════════════════════
## Headless-vs-real-Chrome verdict — Batch C
═══════════════════════════════════════════════════════════════════════

**Verdict: MOSTLY faithful — with one specific, important caveat about FULL-PAGE captures of LAZY-LOADED pages.**

**What is faithful (high confidence):**
- **Per-section headless captures are TRUSTWORTHY.** Every per-section Playwright PNG inspected (index typography / cards / forms / banner-generator; the lab section crops) renders the section's content, layout, color, type, gradients, and component states accurately. The 90-capture audit's per-section PNGs can be trusted.
- **The `toolskin-lab.html` full-page headless capture is FAITHFUL** to the owner real-Chrome capture — same content, order, layout, colors, component states (accordions, data table + status pills, masonry incl. the accent-tinted HERO tile, code panels). Pages without heavy scroll-triggered reveal capture correctly in a headless full-page stitch.
- **Color rendering is faithful.** Accent orange, status colors (green/red/yellow), surface tiers, and gradients match between headless and real Chrome. No hue shift, no gamma/profile mismatch observed.
- **No gradient banding difference.** The mesh gradients and surface gradients show no headless-specific banding.
- **No layout differences.** Page height, column structure, card geometry, topbar are identical between headless and real Chrome.

**The caveat (must be known by other analysts and Phase E):**
- **Full-page headless captures of `index.html` are NOT faithful — they have large UNRENDERED (blank) regions.** On `index.html` (dark AND light), scroll-triggered / IntersectionObserver / lazy-reveal content did NOT paint during Playwright's full-page stitch. The page height is reserved correctly, but entire sections (typography ladder, color swatches, full form panels, code block, data table, pricing trio, stat cards, social row, footer, mockups, banner-generator body) appear as EMPTY dark (or in light mode, empty WHITE) space in `desktop-dark-index-fullpage.png` and `desktop-light-index-fullpage.png`.
  - **Consequence 1:** Any analyst who treats an index full-page headless PNG as ground truth will WRONGLY conclude sections are missing/empty. The owner real-Chrome captures prove those sections are fully populated.
  - **Consequence 2:** The light-mode index full-page PNG is the most dangerous — unrendered sections are blank white and can be misread as intentionally-empty white sections.
  - **Mitigation:** For any lazy-loaded long page, trust the PER-SECTION headless captures (they scroll the section into view first, triggering the reveal) and the OWNER real-Chrome full-page captures — NOT the headless full-page stitch.
- **Minor, non-blocking:** real-Chrome text (Windows ClearType subpixel AA + GoFullPage JPG compression) looks slightly heavier/softer; Playwright PNG text is lighter and crisper (greyscale AA). This is a font-hinting/anti-aliasing difference only — it does NOT change layout, metrics, weight selection, or color, and does not affect design-DNA extraction. Do not treat the AA difference as a defect in either capture.

**Bottom line for Phase E:** Headless captures are faithful for COLOR, LAYOUT, GRADIENTS, TYPE METRICS, and COMPONENT STATE, and per-section headless captures are reliable. The ONLY trust hole is headless FULL-PAGE stitches of pages with scroll-triggered lazy content (the index page) — there, defer to owner real-Chrome captures. The 90-capture audit remains usable as long as conclusions about the index page's mid/lower sections come from per-section captures or owner captures, never the headless index fullpage.

═══════════════════════════════════════════════════════════════════════
## Anomalies — Batch C
═══════════════════════════════════════════════════════════════════════

1. **[HIGH] `desktop-dark-index-fullpage.png` / `desktop-light-index-fullpage.png`** — Playwright headless full-page captures of `index.html` have large UNRENDERED blank regions: scroll-triggered/lazy content (typography ladder, color swatches, form panels, code block, data table, pricing trio, stat cards, social row, footer, mockups, banner-generator body) did not paint during the full-page stitch. Owner real-Chrome captures prove all these sections are fully populated. Headless index full-page PNGs must NOT be used as ground truth for those sections. Root cause confirmed via per-section PNGs (which render fine): lazy-load / IntersectionObserver not firing during headless stitch — not a CSS/asset failure.

2. **[MED] index (dark + light), surface-lab.html** — DNA-coverage gap, not a render defect: `index.html` and `surface-lab.html` both render a full-bleed SOLID-ORANGE accent SECTION BAND ("One engine — surfaces, gradients, controls"), and `surface-lab.html` additionally renders a full-bleed SOLID-RED danger reset bar. Design-DNA rule C1 states accent is painted SOLID only on `.ts-btn--primary` and `.ts-chip--accent/--active` — it does NOT enumerate solid accent/status SECTION bands. Rendered reality contradicts the literal scope of C1. Surfaced (OQ-C-VIS-1), not reconciled.

3. **[MED] index (dark + light)** — The full-bleed orange "NEW…" marquee strip renders as a near-FLAT solid orange field. DNA §F7 specifies the marquee background as `--ts-marquee-bg: --ts-accent-glow-bg-2` (a soft RADIAL accent GLOW). The rendered strip does not read as a radial glow. Possible contradiction between F7's documented marquee-bg token and the rendered marquee. Surfaced for owner.

4. **[LOW] ts-gallery-demo.html** — The "Uniform grid" (4×3) and "Sortable gallery" sections render correct containers/grid structure but EMPTY cells (no images / blank placeholder rows). The page title is "ts-gallery · first draft", so these are most likely intentional WIP placeholders rather than asset-load failures — but should be confirmed (OQ-C-VIS-3).

5. **[LOW] ts-phantom-portfolio.html (image-wall hero)** — Solid bright-yellow flat tiles appear interspersed in the perspective image wall. Ambiguous: intentional accent-color punctuation vs placeholders for unloaded images. Surfaced (OQ-C-VIS-5).

6. **[LOW] cube-portfolio.html (hero capture)** — A devtools/extension pixel RULER overlay is present along the top and left edges of the capture. This is a CAPTURE-ENVIRONMENT artifact, not a page anomaly — flagged only so it is not mistaken for a design element by downstream readers.

7. **[LOW] cube-portfolio.html (×2) and ts-phantom-portfolio.html (×2)** — The task brief described both as "dark + light", but all four captures are DARK. The "second" capture in each pair is a different PAGE STATE (cube: a project-detail view; phantom: a lightbox overlay), not a light-mode variant. No light-mode rendering of either portfolio page exists in Batch C. Not a defect — a scope/labelling mismatch to confirm (OQ-C-VIS-4, OQ-C-VIS-6).

═══════════════════════════════════════════════════════════════════════
## Owner-pending questions — Batch C
═══════════════════════════════════════════════════════════════════════

1. **OQ-C-VIS-1 [index.html dark+light, surface-lab.html]** — Rendered reality shows full-bleed SOLID accent SECTION bands (the orange "One engine…" band on index.html and surface-lab.html) and a full-bleed SOLID danger band (surface-lab.html red reset bar). Design-DNA C1 currently restricts solid accent to primary button + accent/active chip only. Should C1 / §C be widened with a documented "accent / status SECTION band" application tier, so the rebuild treats these bands as a canonical pattern rather than a C1 violation?

2. **OQ-C-VIS-3 [ts-gallery-demo.html]** — Are the empty cells in the "Uniform grid" and "Sortable gallery" sections intentional "first draft" placeholders, or did demo images fail to load? (Page is titled "first draft", suggesting intentional WIP.)

3. **OQ-C-VIS-5 [ts-phantom-portfolio.html]** — Are the solid bright-yellow tiles in the perspective image wall intentional accent-color punctuation within the composition, or placeholders for images that did not load?

4. **OQ-C-VIS-2 [index.html light mode]** — Confirm the smallest helper / section-eyebrow text passes WCAG AA contrast (4.5:1 normal text) on the near-white light-mode surfaces. Cannot be measured precisely from a full-page capture; flagged for a 1:1 contrast check.

5. **OQ-C-VIS-4 / OQ-C-VIS-6 [cube-portfolio.html, ts-phantom-portfolio.html]** — The brief expected "dark + light" captures of both portfolio pages, but all four captures are dark (the pairs are hero vs project-detail, and image-wall vs lightbox — different states, not modes). Do these portfolio pages have a light mode at all? If yes, light captures are still needed; if no, the DNA/audit record should note these surfaces are dark-only.

6. **OQ-LOGO-VIS [index.html, surface-lab.html, generator]** — The `TOOLSKIN` wordmark renders as a TWO-TONE lockup ("TOOL" in neutral text color, "SKIN" in accent orange) across multiple surfaces. DNA §F9 documents the logo's casing (uppercase), tracking (wide), weight (display/semibold) and grid composition — but NOT the two-tone color split. Should the two-tone wordmark color treatment be added to §F9 as part of the canonical logo DNA?

3 marquee-related contradiction (OQ for item 3 above): the F7 documented marquee background token (`--ts-accent-glow-bg-2` radial glow) vs the rendered near-flat solid-orange "NEW" marquee — owner to confirm whether the rendered marquee matches intent or whether F7's token spec is the authority.

---
**Status:** Batch C complete — 13 owner real-Chrome ground-truth captures analyzed + 4 Playwright headless references compared. Headless-vs-real verdict: MOSTLY faithful, with the index-full-page lazy-load caveat. 7 anomalies (1 HIGH, 2 MED, 4 LOW). 6 owner-pending questions + 1 marquee contradiction.


# Rebuild Visual Audit — Batch D

**Analyst:** Wave 1.6 Visual Audit Analyst — Batch D (owner real-Chrome ground-truth: branding system, branding demos, pitchdeck)
**Date:** 2026-05-19
**Authority:** GROUND-TRUTH visual record (Pattern 17). Owner real-Chrome GoFullPage captures are HIGHEST authority — what the owner's eye actually sees. Displaces text-derived design DNA where they conflict.
**Cross-reference:** `docs/handoffs/_rebuild-design-dna.md` (Wave 1.5 PROPOSED spec) + `expert-designer` / `typography-master` / `design-tokens-2.0` SKILLs.
**Scope note — Layer A.5:** Pitchdeck activated in audit scope by owner. Pitchdeck reference docs were NOT placed at `docs/handoffs/_visual-audit/reference-context/` — that directory is empty. **Pitchdeck reference docs were unavailable for this audit.** Per owner instruction, the 6 pitchdeck slides are audited as a distinct sub-group and every pitchdeck observation is tagged for **Section H verification** (the layout/pitchdeck tier).
**Screenshots analyzed:** 21 (1 branding index, 8 branding previews, 6 branding demos, 6 pitchdeck slides).
**Output discipline:** EXTRACTION ONLY. No alternative design choices proposed. Contradictions surfaced, never silently reconciled (Rule 11).

═══════════════════════════════════════════════════════════════════════
## BATCH D — BRANDING SYSTEM
═══════════════════════════════════════════════════════════════════════

## Screenshot: screencapture-localhost-8002-branding-2026-05-19-22_10_49.jpg
- **Surface captured:** Branding system index landing page (`/branding`) — "Range demonstration v1.1"
- **Source:** owner real-Chrome (GoFullPage)
- **What's rendered:** Dark near-black page. Hero: massive Space Grotesk display headline "One token engine. *Five* universes." with "Five" set in italic accent-orange. Orange mono eyebrow. A 5-cell stat strip (5 demos / 1 stylesheet / 3 variables to retheme / 240+ derived tokens / 0 JS dependencies) with large numerals on dark stat cards. Below: an accent-tinted "B+" audit scorecard panel with a big orange "B+" grade, copy, and an outline "VIEW AUDIT" button. Then "Five products. Same skin." section with a 5-tile demo gallery: Marketing landing (orange accent), SaaS dashboard (teal accent), Mobile app screen (lime accent), Game combat HUD (magenta accent), Developer IDE (amber accent). Each tile has a thumbnail, title, description, mono chip row, and an "OPEN ___.HTML" link. Footer two-column "The proof." / "The honest caveat."
- **Cross-reference vs design DNA:** Strong match. Hero confirms B1 (display tracking tight), B3 (display weight heavy/900-ish), B4 (display title is mixed-case here, NOT uppercase — note: §B4 lists hero/display titles as uppercase; this index hero is mixed-case sentence form). Accent-italic word treatment ("Five", "Same skin") is a recurring brand device not documented in §B — see open question. Stat cards, dark surfaces, 1px hairline borders match C3/F4. The "240+" claim aligns with the design-tokens-2.0 derivative-token story. The per-demo accent-HSL retheme (orange/teal/lime/magenta/amber) is the live proof of the C-series accent engine and Rule 8 HSL pipeline.
- **Anomalies flagged:** none. Clean render, fonts loaded, no broken glyphs.
- **Section H tag:** n/a
- **Open question for owner:** The accent-colored *italic* single-word emphasis inside display headlines ("*Five*", "Same *skin*", later "*any*", "*one*") is a consistent brand signature across branding + marketing + pitchdeck but is not captured as a typographic pattern in `_rebuild-design-dna.md` §B. Should this be codified as a named DNA pattern (accent-italic emphasis word)?

## Screenshot: screencapture-localhost-8002-branding-previews-audit-html-2026-05-19-22_11_18.jpg
- **Surface captured:** Branding preview — "TOOLSKIN Audit Scorecard" full page
- **Source:** owner real-Chrome (GoFullPage)
- **What's rendered:** Long dark audit page. Header "TOOL*SKIN* Audit Scorecard" with accent-italic "SKIN". A 4-metric counter strip near the top (49 / 31 / 12 / 6 — components, pass-ish, warn, fail counts) color-coded green/green/amber/red. "Token Coverage Gaps" section: a 2-column grid of small issue cards each with a colored left-border accent (red/amber/green status bars) — items include "Black labels on accent buttons (dark mode)", "Status buttons hardcoded near-black text", "Orange ramp uses literal hex, not derived", "Orange tinted-glass baked in CSS", "Spacing scale (4pt grid)", "Radius scale, font tokens, surface tiers". Below: a horizontal orange/red gradient ramp strip. Then a very large "Component Inventory — live vs extract" table: ~40 rows, columns LIVE / EXTRACT / PARITY / NOTES, with small green/amber/red status pills per cell. Then "New System Capabilities" with several dark demo panels (toggles, gradient swatches, color tiles, chip rows). Footer "Recommendation Summary" 2-column grid of 4 cards.
- **Cross-reference vs design DNA:** This page IS a self-audit and confirms several §H open questions independently. The issue cards literally name: hardcoded near-black text on status buttons (echoes C5 — `--ts-on-accent` not universally applied), orange ramp using literal hex not derivative tokens (echoes G5 "never raw colors" + OQ on accent pipeline), baked-in tinted glass. The component-inventory table's red/amber PARITY pills are a live confession of incomplete token migration (the 337-reference problem from design-tokens-2.0). Status pills, chips, tables all match F-series DNA.
- **Anomalies flagged:** Content-level (intentional, this is an audit page): the page itself flags hardcoded text colors, literal hex ramps, and parity gaps as KNOWN system defects. These are not render bugs — they are the system documenting its own debt. No visual render failures (fonts, icons, layout all intact at this zoom).
- **Section H tag:** n/a
- **Open question for owner:** The audit page asserts concrete defects (hardcoded `#0a0a0a`-ish text on status buttons, literal-hex orange ramp). Are these the SAME issues already in `_rebuild-design-dna.md` §H (OQ-C5 region), or additional defects the rebuild must independently track? The page should be cross-walked against §H so nothing is double-counted or missed.

## Screenshot: screencapture-localhost-8002-branding-previews-colors-html-2026-05-19-22_18_56.jpg
- **Surface captured:** Branding preview — "One accent. Onyx surfaces. HSL engine." (color system)
- **Source:** owner real-Chrome (GoFullPage)
- **What's rendered:** Color reference page. Sections: **Primary — Orange Fire** 7-swatch ramp (800 #FF8C00 brightest orange → 600 #FF6B00 → 500★ #FF5500 the accent → 400 #E03C00 → 300 #B32C00 → DIM 20% alpha → GHOST 7% alpha). **Surface — Onyx Scale** 7 swatches BODY #0c0d0f → BG-0 #14161a → BG-1 #1c1e24 → BG-2 #23262e → BG-3 #2d3038 → BG-4 #363942 → BG-5 #42454f. **Text Scale** 4 cards: Primary #e8e9ea, Secondary 65% alpha, Muted 45% alpha, Accent #FF5500 (rendered orange). **Status** 4 saturated swatches: Success #22c55e (green), Warning #f59e0b (amber), Danger #ef4444 (red), Info #3b82f6 (blue). Footer: a mono code block showing `--ts-accent-h: 18; --ts-accent-s: 100%; --ts-accent-l: 52%; --ts-accent: hsl(...)`.
- **Cross-reference vs design DNA:** CRITICAL surface-value capture. The Onyx scale here gives concrete hex for BG-0..BG-5. The design-tokens-2.0 SKILL example block uses placeholder primitives `--ts-color-10: #0c0d0f` etc.; this page gives the REAL Toolskin surface hex ladder. The accent code block confirms Rule 8 HSL pipeline (`--ts-accent-h: 18`) — note hue is **18**, while DNA §G6 / branding-logo page text both say orange "h:18" — consistent. **Contradiction surfaced:** the colors page says `--ts-accent-h: 18` but the colors-page accent swatch is labeled #FF5500 AND the branding-logo page also cites "#FF5500" — yet hsl(18,100%,52%) does not render as exactly #FF5500 (hsl(18,100%,52%) ≈ #FF5800-ish). Minor, but the page presents both an HSL triplet and a hex that are not bit-identical. Surfaces are blue-shifted neutrals ("cool, never grey") — matches the DNA "onyx/blue-shifted" implication.
- **Anomalies flagged:** LOW — accent value presented two ways (hsl(18,100%,52%) vs hex #FF5500) that are near- but not exactly-equal. Visual render itself is clean: all swatches paint, text legible, no broken glyphs.
- **Section H tag:** n/a
- **Open question for owner:** Is the canonical accent the HSL triplet `hsl(18,100%,52%)` or the hex `#FF5500`? The rebuild's primitive layer needs ONE source of truth (Rule 8 says H/S/L channels are primary). Confirm which is authoritative and whether the displayed mismatch is a labeling bug.

## Screenshot: screencapture-localhost-8002-branding-previews-components-buttons-html-2026-05-19-22_19_11.jpg
- **Surface captured:** Branding preview — "Buttons, chips, badges, dots." (components)
- **Source:** owner real-Chrome (GoFullPage)
- **What's rendered:** Component reference. **Button variants** row: PRIMARY (solid orange), OUTLINE, DEFAULT (dark), GHOST (very faint), ALT (dark + icon), SUCCESS (solid green), DANGER (solid red), DISABLED (greyed). **Sizes** row: SMALL / DEFAULT / LARGE / X-LARGE all solid orange, scaling up in height. **Icon-only** row: 5 small square buttons (orange icon btn, dark btn, dark down-arrow btn, one near-empty/blank btn, red X btn). **With counter**: "NOTIFICATIONS 12" (orange) and "DOWNLOADS 3" (dark) — counter sits in a small badge bubble. **Chips & tags**: two rows of chips (SELECTED, DEFAULT, ACCENT, SUCCESS, WARNING, DANGER) — uppercase, tracked, bordered. **Badges & status dots**: two rows of badges (DEFAULT, ACCENT, LIVE, BETA, ERROR, ALT) plus a status-dot row (LIVE orange / ONLINE green / IDLE yellow / OFFLINE red).
- **Cross-reference vs design DNA:** Strong match to F1 (chip: dense uppercase tracked pill), F3 (button: uppercase, tracked, height-derived; size variants scale height). PRIMARY is solid accent + on-accent text — matches C1 (accent solid only on primary button + accent/active chip). Status buttons SUCCESS/DANGER use solid status color — matches C-series status overrides. Chips uppercase + tracked + bordered confirm F1. Status dots confirm a small-dot affordance.
- **Anomalies flagged:** MED — in the "Icon-only" button row, the 4th button appears **blank / missing its icon** — it renders as an empty square with only a faint vertical sliver where a glyph should be. This is consistent with a FontAwesome / Ionicons glyph failing to load or a missing icon reference. All other icon buttons (rocket, gear/dot, down-arrow, X) render their glyphs fine. Flag for icon-system verification.
- **Section H tag:** n/a
- **Open question for owner:** The 4th icon-only button is empty — is that an intentional "blank/placeholder" button variant being demonstrated, or a broken icon glyph (FontAwesome/Ionicons load failure)? If broken, the icon-pinning per CLAUDE.md §5b needs checking.

## Screenshot: screencapture-localhost-8002-branding-previews-components-cards-html-2026-05-19-22_19_27.jpg
- **Surface captured:** Branding preview — "Containers, surfaces, signals." (cards & panels)
- **Source:** owner real-Chrome (GoFullPage)
- **What's rendered:** Card/panel reference. **Card variants**: DEFAULT CARD (dark, hairline border, "v1" pill), FEATURED CARD (accent-tinted bg + orange border + soft orange outer glow, "+ PRO" pill, orange title), GLASS CARD (translucent over canvas, "A" pill). **Stat cards**: 3 cards (128 tokens shipped / 23kb bundle size / 94% CSS coverage) — big numerals, small green sub-stat. **Progress & tabs**: left card has 3 progress bars (Uploading files 68% solid orange, Processing queue 32%, Striped style 55% striped orange); right card has an underline tab strip (OVERVIEW active / ANALYTICS / SETTINGS) plus a pill-tab segmented control (ALL active / PUBLISHED / DRAFTS / ARCHIVED). **Toasts**: 4 toasts (Success green left-bar, Warning amber, Error red, Info blue) — each a card with colored left border + icon + title + body. **Modal**: a centered "Confirm action" modal with header + X, body copy, CANCEL (outline) + RESET TOKENS (solid orange) buttons, over a dimmed backdrop.
- **Cross-reference vs design DNA:** Excellent match. FEATURED CARD = 4% accent tint + accent border — matches the page's own descriptive copy AND §C1 (accent as tint/border, not solid) + §C4 (the orange outer glow on featured card is the ONE opt-in glow case, "pulls focus without raising elevation"). Toasts confirm F12 exactly: colored left-border accent slot, icon + title + body, success→green / warning→amber / error→red / info→blue. Modal confirms F8: centered content shell, header with X + divider, footer button pair, dimmed backdrop. Underline tabs confirm F11 (bottom-rule slider, accent underline on active). Progress bars use solid accent fill.
- **Anomalies flagged:** none. All variants render cleanly; the featured-card glow is intentional (C4).
- **Section H tag:** n/a
- **Open question for owner:** none.

## Screenshot: screencapture-localhost-8002-branding-previews-components-forms-html-2026-05-19-22_19_52.jpg
- **Surface captured:** Branding preview — "Inputs that feel like a panel." (forms & inputs)
- **Source:** owner real-Chrome (GoFullPage)
- **What's rendered:** Forms reference. **Inputs & fields**: mono-caps labels (PROJECT NAME, VIDEO URL, SEARCH, NOTES, CSS TOKEN (MEMO)) above each control. Text input with folder icon placeholder; VIDEO URL and SEARCH are inset-action inputs with a flush orange arrow button on the right edge; NOTES is a textarea; CSS TOKEN field shows mono text `--ts-accent-h: 18;`. **Toggles**: 6 rows (UI transitions ON orange, Show tooltips OFF, Live updates ON, Disabled greyed, Small ON, Large ON) — pill toggles. **Range sliders**: 3 sliders (DELAY 50ms, SCALE 65%, VOLUME 120) — orange-filled track, thumb, value pill on the right. **Checkboxes**: 3 rows (Enable auto-scheduling checked orange, Rename-only mode, Notify subscribers). **Code wrapper**: a mac-style code window (`ts-button.config.json`) with traffic-light dots and a JSON snippet (syntax-highlighted: keys orange, strings/values). **Color pickers**: 2 swatch+hex rows (#ffffff white swatch, #ff5500 orange swatch).
- **Cross-reference vs design DNA:** Strong match to F5 (input height-aligned with button, translucent surface, hairline border; inset-action variant flattens right edge to radius-0 and slots a flush button — confirmed by VIDEO URL / SEARCH fields with their flush orange arrow buttons — exactly D3). Mono-caps field labels confirm B4 (caps role-locked to labels) + B1 (UI label wide tracking). Toggles are pill-shaped with accent on-state — matches the page's own copy. Checkboxes use accent fill when checked. Code wrapper uses JetBrains Mono — matches typography anchor.
- **Anomalies flagged:** none. Inputs, toggles, sliders, checkboxes all render cleanly.
- **Section H tag:** n/a
- **Open question for owner:** none.

## Screenshot: screencapture-localhost-8002-branding-previews-spacing-radius-html-2026-05-19-22_20_08.jpg
- **Surface captured:** Branding preview — "4pt grid. Six radii." (spacing & radius)
- **Source:** owner real-Chrome (GoFullPage)
- **What's rendered:** Spacing/radius reference. **Spacing scale**: a panel with 9 rows — `--ts-sp-1` 4px through `--ts-sp-12` 48px (1/2/3/4/5/6/8/10/12), each row shows the token name (orange mono), the px value, and an orange bar whose width grows with the value. **Radius scale**: a panel with 6 tiles — SM 4px·badges / MD 6px·buttons / BASE 8px·inputs / LG 10px·cards / XL 16px·sheets / PILL 999px — each tile is a dark rounded box whose corner radius visibly increases (PILL is a full circle).
- **Cross-reference vs design DNA:** **MAJOR CONTRADICTION SURFACED.** This page assigns radius roles that DISAGREE with `_rebuild-design-dna.md` §D1. The DNA §D1 says: buttons default ≈ `--ts-radius-sm` (~7px), inputs default `--ts-radius-sm` (~7px), cards `--ts-radius-md` (~8px = base). This page instead labels: **MD = 6px = buttons**, **BASE = 8px = inputs**, **LG = 10px = cards**, **SM = 4px = badges**. So the live branding page maps buttons→MD(6px), inputs→BASE(8px), cards→LG(10px) — a completely different radius-to-component assignment than the DNA spec's. Also the radius VALUES differ: this page shows SM 4 / MD 6 / BASE 8 / LG 10 / XL 16; DNA §D1 shows a calc-derived ladder (2xs 2.4 / xs 4.8 / sm 7 / md 8 / lg 9.2 / 2xl 12 / xl 16). The "LG 10px" here also independently confirms OQ-D1's "10px" number — but as the *card* radius, not the base. This is a real, load-bearing conflict between the branding system's own reference page and the Wave 1.5 DNA extraction.
- **Anomalies flagged:** HIGH — radius role/value assignment on this branding page contradicts `_rebuild-design-dna.md` §D1 and §D2. Render itself is clean (no broken layout); the anomaly is a design-DNA conflict, not a pixel bug.
- **Section H tag:** n/a
- **Open question for owner:** Which radius mapping is canonical for the rebuild — the branding-preview page (SM 4=badges / MD 6=buttons / BASE 8=inputs / LG 10=cards / XL 16=sheets / PILL 999) or `_rebuild-design-dna.md` §D1 (calc-derived, buttons/inputs=sm~7, cards=md~8)? The two cannot both be right. This blocks any radius-token work in Sessions 4+.

## Screenshot: screencapture-localhost-8002-branding-previews-toolskin-logo-html-2026-05-19-22_20_41.jpg
- **Surface captured:** Branding preview — "Three harmonic directions" (Toolskin logo proposals v2)
- **Source:** owner real-Chrome (GoFullPage)
- **What's rendered:** Logo proposal page with THREE candidate logo systems, each shown in primary-dark / light / accent-orange lockups plus a 4-step favicon scaling row (16/22/20/16 px) and a 3-cell concept/harmonizes/scaling explainer:
  - **01 The Bracket** — wordmark "TOOL│SKIN" wrapped in `[ ]` brackets, an orange caret bar between TOOL and SKIN (CSS attribute-selector metaphor).
  - **02 The Blade** — wordmark "TOOLSKIN" with a single 18° orange slash blade slicing through it ("Stanley blade, not Swiss watch").
  - **03 The Cascade** — a mark: three nested concentric squares (primitive frame / orange computed engine / component slot), wordmark "TOOLSKIN" set beside it.
- **Cross-reference vs design DNA:** This is NEW design DNA the Wave 1.5 spec explicitly said did not exist. `_rebuild-design-dna.md` §H OQ-Logo states "Neither branding nor pitchdeck directory exists... Logo design lives entirely in `.ts-topbar__logo` CSS (F9) — wordmark-only... No mark / icon-logo / pictorial logo system documented." **That conclusion is now contradicted by ground truth:** a full logo-proposal system DOES exist with three candidate marks (Bracket, Blade, Cascade), favicon scaling specs, light/dark/accent lockups, and the page explicitly says "Pick one — it becomes the master mark." The page also states all concepts use Space Grotesk + JetBrains Mono and the canonical orange #FF5500. The accent-italic "SKIN" treatment recurs in the lockups.
- **Anomalies flagged:** MED — not a render bug, but a documentation contradiction: `_rebuild-design-dna.md` §H OQ-Logo says no logo/mark system exists; this ground-truth capture proves a 3-candidate logo system DOES exist and is pending an owner pick. The DNA spec must be corrected.
- **Section H tag:** n/a
- **Open question for owner:** (1) Which of the three logo directions (Bracket / Blade / Cascade) is the chosen master mark? The rebuild needs this to define the brand mark + favicon. (2) `_rebuild-design-dna.md` §H OQ-Logo asserts no mark system exists — should that open question be re-opened/corrected given this page? (3) The favicon scaling row labels read "16 / 22 / 20 / 16 px" — is the 22/20 ordering intentional or a typo in the source page?

## Screenshot: screencapture-localhost-8002-branding-previews-typography-html-2026-05-19-22_20_56.jpg
- **Surface captured:** Branding preview — "Two faces. Variable. Self-hosted." (typography)
- **Source:** owner real-Chrome (GoFullPage)
- **What's rendered:** Typography reference. **Two specimen cards**: left "Space Grotesk" (DISPLAY & BODY — Florian Karsten, 2018, derived from Space Mono; variable axis wght 300–700; SIL OFL; tokens `--ts-font-display`, `--ts-font-body`; full uppercase + lowercase + numerals + glyphs specimen). Right "JetBrains Mono" (MONO / CODE / TOKENS — 2020, 138 coding ligatures; variable axis wght 100–800; SIL OFL; token `--ts-font-mono`; shows `--ts-accent: #FF5500;`, ligature glyphs `=> -> != == >= <=`, `0Oo lI1 {} [] () /* */`). **A type-ramp table** headed "TOOLSKIN v1": rows DISPLAY XL (38/-3%/700), H1 (26/-2%/700), H2 (20/-1.5%/600), H3 (15/0/600), BODY (14/0/400/1.65), LABEL (11 mono/+8%/600 caps), CODE (13 mono/0/400) — each row shows the size/tracking/weight spec and a live sample. **A weight row**: 5 "Aa" specimens — 300 Light / 400 Regular / 500 Medium / 600 Semibold / 700 Bold.
- **Cross-reference vs design DNA:** **SEVERAL CONTRADICTIONS SURFACED.** (1) **Weight ceiling:** this page caps Space Grotesk at **wght 300–700** and the weight row stops at 700 Bold. But `_rebuild-design-dna.md` §B3 claims a "6-step weight scale (300/400/500/600/700/900)" with H1/hero/display at **900 black** (`--ts-font-weight-black`), and §B3 cites H2 at literal 800. The branding typography page shows DISPLAY XL and H1 BOTH at **700**, not 900 — and H2 at **600**, not 800. The live branding reference flatly contradicts §B3's 800/900 claims. (2) **Font-size base:** the type ramp shows BODY at **14px** (not 13px and not 16px). `_rebuild-design-dna.md` §B5 / OQ-A6 says base is 13px (CSS) vs 16px (typography-master skill). Branding page says **14px body**. That is a THIRD value — neither 13 nor 16. (3) **Token names:** this page uses `--ts-font-display` and `--ts-font-body` as the Space Grotesk tokens; the typography-master SKILL lists `--ts-font-body`, `--ts-font-heading`, `--ts-font-mono` — there is a `-display` vs `-heading` token-name mismatch. Matches that do hold: two families only (Space Grotesk + JetBrains Mono) confirms typography-master anchor; SIL OFL + self-hosted + variable confirms loading strategy; negative tracking on display/H1 confirms B1.
- **Anomalies flagged:** HIGH — the branding typography page's weight ceiling (700) and heading weights (DISPLAY XL/H1=700, H2=600) directly contradict `_rebuild-design-dna.md` §B3 (which claims 900 for H1/display, 800 for H2). MED — body size shown as 14px contradicts both 13px (DNA §B5) and 16px (typography-master skill) — a three-way conflict on the type base. LOW — `--ts-font-display` token name vs typography-master's `--ts-font-heading`. Render itself is clean.
- **Section H tag:** n/a
- **Open question for owner:** (1) Is the canonical heading weight scale 300–700 (branding page: H1/display=700, H2=600) or the DNA spec's 300–900 (H1/display=900, H2=800)? OQ-B3 must be re-decided with this evidence. (2) What is the real body font-size base — 13px, 14px, or 16px? Three sources, three answers. (3) Is the Space Grotesk token `--ts-font-display` or `--ts-font-heading`? The rebuild needs one name.

═══════════════════════════════════════════════════════════════════════
## BATCH D — BRANDING DEMOS
═══════════════════════════════════════════════════════════════════════

## Screenshot: screencapture-localhost-8002-branding-demos-marketing-html-2026-05-19-22_15_28.jpg
- **Surface captured:** Branding demo — Marketing landing page (`marketing.html`)
- **Source:** owner real-Chrome (GoFullPage)
- **What's rendered:** Full marketing site, orange accent. Sticky topbar with "TOOL*SKIN*" wordmark, nav (Features/Pricing/Docs/Blog), orange "GET STARTED" button. Hero: a status pill, a huge multi-line display headline "Design *any* interface from *one* token engine." with "any"/"one" in accent-italic, sub-copy, "Open Components" (solid orange) + "View Tokens" (outline) buttons, and a 5-cell stat strip (1.0 / 49 / 240+ / 0 / OFL). "Why Toolskin" section: 6-card feature grid (OKLCH auto-contrast, Density modes, Surface system, Layout primitives, Effect tokens, Theme by HSL) — each card with an orange icon tile, title, body, mono tag. A "Token engine" panel: accent-tinted, headline + buttons left, a mac-style code window right. "Pricing" section: 3-tier pricing cards (Starter $49 / Studio $199 "RECOMMENDED" with accent treatment / Enterprise $899) with checkmark feature lists + buttons. Dark footer: wordmark, 3 link columns, newsletter input + Subscribe button.
- **Cross-reference vs design DNA:** Strong match. Topbar confirms F9 (sticky, wordmark, single bottom rule). Hero confirms B1/B3 (heavy display, tight tracking) + the accent-italic emphasis device. Buttons confirm F3 + C1 (primary solid accent). Feature cards confirm F4. The "RECOMMENDED" pricing card uses accent border + tint — matches C1 (accent as border/tint, not flooding). Code window uses JetBrains Mono. Footer hairline-separated. Atmospheric hero gradient + radial glow match §G6 ("flat solid backgrounds rejected"). NOTE: hero display headline here is mixed-case sentence form, NOT uppercase — consistent with the branding index but a point against §B4's "hero title uppercase" rule.
- **Anomalies flagged:** none of severity. Page renders cleanly end-to-end; fonts loaded; no broken icons or layout breaks observed at this zoom.
- **Section H tag:** n/a
- **Open question for owner:** `_rebuild-design-dna.md` §B4 lists "hero title and display title" as uppercase-locked. Across the marketing demo, branding index, and pitchdeck, hero/display headlines are consistently **mixed-case sentence form** (e.g. "Design any interface...", "Make money in 30 days."). Should §B4 be corrected — are hero display headlines actually mixed-case, with uppercase reserved for buttons/chips/tabs/labels/logo only?

## Screenshot: screencapture-localhost-8002-branding-demos-saas-dashboard-html-2026-05-19-22_16_05.jpg
- **Surface captured:** Branding demo — SaaS dashboard (`saas-dashboard.html`), teal accent
- **Source:** owner real-Chrome (GoFullPage)
- **What's rendered:** Full app-shell dashboard. Left sidebar: "tool*skin*" logo (teal "skin"), grouped nav (WORKSPACE: Dashboard active+LIVE pill / Pipelines / Sources·12 / Reports; OPERATIONS: Workflows / Automation / Webhooks·3; SETTINGS: Team / Billing / Integrations), a user card (Marcus Vance, Lead architect) pinned bottom. Top bar: Workspace › Dashboard breadcrumb, a search field, icon buttons, teal "+ New pipeline" button. Main: "Operations overview" H1 + sub-line, a 7d/30d/90d/All-time segmented control + Export. A 4-card stat row (Total runs 14,820 / Active pipelines 47 / Queue depth 128 / Avg latency 412ms) each with a mini sparkline. "Throughput · last 30d" area chart (teal fill + dashed baseline). "Run distribution" donut chart (62% Succeeded / 22% Running / 11% Throttled / 5% Failed) with legend. "Recent pipeline runs" data table: 7 rows, columns ID/PIPELINE/SOURCE/STATUS/RECORDS/DURATION/STARTED, status pills SUCCEEDED green / THROTTLED amber / QUEUED grey / FAILED red.
- **Cross-reference vs design DNA:** Strong match. The whole screen re-themed to teal accent with zero structural change proves the C-series accent engine + Rule 8 HSL pipeline. Sidebar + topbar confirm F9-family layout-tier patterns. Stat cards confirm F4. Status pills in the table confirm F1/chip-family + C-series status colors. Data table is dense, mono-ish, hairline-separated — matches the "tool-system UI density" thesis (B5). Charts use accent-derived fills. The sidebar's denser type is consistent with B6 (`--ts-fs-base` rescale in a constrained container) — though I cannot confirm the token from a screenshot.
- **Anomalies flagged:** none. Clean, cohesive render; charts, table, sidebar all intact.
- **Section H tag:** n/a
- **Open question for owner:** none.

## Screenshot: screencapture-localhost-8002-branding-demos-mobile-app-html-2026-05-19-22_16_36.jpg
- **Surface captured:** Branding demo — Mobile app screen (`mobile-app.html`), lime accent
- **Source:** owner real-Chrome (GoFullPage)
- **What's rendered:** A centered iPhone-style mockup on a dark green-tinted canvas, flanked by two text columns. Left column: "Same tokens. *Different* universe." headline + body + a spec list (ACCENT hsl(88,76%,54%) / SURFACE bg-0·bg-1·bg-2 / RADII 12·16·22·24 / TYPE PP Editorial · IBM Mono / GLOW var(--ts-shadow-glow)). Phone: status bar 9:41, "Hi, *Marcus*." greeting + lime avatar, then a lime balance pill area, a segmented tab row, "Holdings" list (Anthropic Series E +8.4% / Nvidia NVDA +2.1% / Treasury 10Y +0.3% / USDC stablecoin -0.0%) each row with an icon tile, "Activity" list (Sent to Lina Park -$240 / Deposit ACH +$2,000), and a bottom tab bar (Home / Send / big lime + FAB / Stats / More). Right column: "Zero *mobile* CSS rewrites." + body + a reused-tokens spec list (TOUCH MIN 44pt / CARD RADIUS --ts-radius-lg / GLASS BLUR backdrop-filter / STATUS PILLS success-warning / AVATAR GRAD accent→info).
- **Cross-reference vs design DNA:** Re-theme to lime accent confirms the accent engine. BUT several conflicts: (1) The left spec list says **TYPE: PP Editorial · IBM Mono** — that contradicts the entire `typography-master` anchor (Space Grotesk + JetBrains Mono). PP Editorial and IBM Plex Mono are NOT the Toolskin anchor fonts. Either this demo intentionally swaps fonts to show theming reach, or it is off-brand. (2) The spec list says **RADII 12/16/22/24** — yet another radius set, different from both the branding spacing-radius page (4/6/8/10/16) AND DNA §D1. (3) The bottom tab bar has a prominent lime **circular + FAB** — §G1 explicitly says "Floating action buttons (FAB) — Toolskin uses `.ts-oce-fab` only inside the offcanvas editor, never as a primary CTA pattern." A FAB as the centerpiece of a mobile tab bar is a documented anti-pattern.
- **Anomalies flagged:** HIGH — the lime balance pill near the top of the phone shows **text clipped / overlapping** — the pill content ("LIVE BALANCE ___" or similar) is illegible, characters collide and bleed past the pill edge. Directly below it, the segmented tab row appears **vertically clipped** — the tabs are cut off / half-height, only the top portion of each tab renders. This is a real layout/clipping break inside the phone mockup. MED — TYPE spec lists "PP Editorial · IBM Mono", off the Space Grotesk / JetBrains Mono anchor. MED — a circular FAB is used as the mobile tab-bar centerpiece, which §G1 lists as an explicit Toolskin anti-pattern. LOW — RADII 12/16/22/24 is a third independent radius set.
- **Section H tag:** n/a
- **Open question for owner:** (1) The lime balance pill and the tab row under it are visibly clipped/overlapping in the phone mockup — confirmed render bug to fix, or known WIP? (2) Does the mobile demo intentionally swap to PP Editorial + IBM Mono to demonstrate font-token theming, or is that an off-brand mistake? If intentional, the rebuild's typography-master skill needs a note that demos may override the anchor. (3) Is the circular FAB in the mobile tab bar acceptable here despite §G1's anti-FAB rule — i.e., does the anti-pattern apply only to web, not the mobile-app demo?

## Screenshot: screencapture-localhost-8002-branding-demos-game-hud-html-2026-05-19-22_17_15.jpg
- **Surface captured:** Branding demo — Game combat HUD (`game-hud.html`), magenta/neon accent
- **Source:** owner real-Chrome (GoFullPage)
- **What's rendered:** A full-bleed dark game HUD. Top-left: player card (MV avatar, "Marcus *Vance*", LV 47 · VANGUARD III) with three resource bars HP 784/1000 (red) / MP 256/400 (cyan) / XP 42% (magenta). Top-center: "PRIMARY OBJECTIVE — Breach the *Spire*" panel, step 2 of 3, a "04:21 REMAINING" countdown chip. Top-right: 3 currency counters (14,820 gold / 148 cyan / 72 magenta) + a "MAP // SECTOR_07" minimap with plotted nodes. Center: an "⚠ INCOMING WAVE" warning badge, floating damage numbers "-842!" (orange) / "+1,400 XP" (magenta) / "-312" (red) around a crosshair. Bottom-left: a 6-slot ability hotbar (icons with keybind labels 1–6, ×3/×5 multipliers, first slot magenta-active). Bottom-center: a "COMBO x18 · +2.4× multiplier" panel. Bottom-right: a "COMBAT LOG" feed (monospace lines, color-coded names/values).
- **Cross-reference vs design DNA:** Re-theme to neon-magenta confirms the accent engine reaching an extreme aesthetic. Bars, chips, counters, the countdown chip all read as composed Toolskin primitives with status colors. Monospace combat log confirms JetBrains Mono usage. The HUD demonstrates the "from marketing to terminal" flex claim (matches the pitchdeck/marketing thesis). Corner-anchored HUD panels with clipped/angled corners are an aesthetic extension — not contradicting DNA, since §D3 allows intentional sharp/edge-flush corners.
- **Anomalies flagged:** none of severity. Render is clean and cohesive for a game HUD; all panels, bars, icons, and the minimap render. The hotbar icons all render glyphs (unlike the buttons-preview blank icon). No layout breaks.
- **Section H tag:** n/a
- **Open question for owner:** none.

## Screenshot: screencapture-localhost-8002-branding-demos-dev-ide-html-2026-05-19-22_17_47.jpg
- **Surface captured:** Branding demo — Developer IDE (`dev-ide.html`), amber accent
- **Source:** owner real-Chrome (GoFullPage)
- **What's rendered:** A full VS Code-style IDE chrome, amber accent. Mac traffic-light dots + menu bar (File/Edit/View/Run/Help) + breadcrumb "toolskin-engine › src › tokens › resolver.ts". Far-left activity rail. Explorer panel: a file-filter input, a file tree (toolskin-engine › src › components / tokens [resolver.ts active, accent.ts, contrast.ts, density.ts, surface.ts] / primitives / themes; test; docs; package.json, tsconfig.json, README.md, LICENSE). Center: a code editor with line numbers, tab strip (accent.ts / resolver.ts active / surface.ts / README.md), syntax-highlighted TypeScript (a `resolveAccent` function), an inline gutter hint chip. Right: a "Toolskin AI" assistant panel (claude-haiku-4-5) — a chat thread with YOU / ASSISTANT turns, a red/green diff block (`- expect(opacity).toBe(0.04)` / `+ expect(opacity).toBeCloseTo(0.04, 2)`), APPLY DIFF / SHOW FILE / EXPLAIN MORE buttons, a composer input. Bottom: a terminal panel (TERMINAL / PROBLEMS·2 / OUTPUT / DEBUG tabs) running `pnpm test:tokens` with green check pass lines + one amber warning. Status bar at the very bottom (branch main, problem counts, TypeScript 5.4.3, Ln/Col, UTF-8, etc.).
- **Cross-reference vs design DNA:** Re-theme to amber confirms the accent engine at the "terminal" end of the flex. Dense monospace everywhere confirms JetBrains Mono + B5's tool-system density thesis. The red/green diff block, status pills, terminal pass/fail markers all use C-series status colors. The IDE panels are hairline-separated, no default shadows — matches C3/C4. The syntax highlighting palette is accent-aware. Tab strip in the editor uses top-corner-only style consistent with F11.
- **Anomalies flagged:** none. Render is clean and dense; all panels, the file tree, the AI panel, and the terminal render correctly. No broken glyphs or layout breaks.
- **Section H tag:** n/a
- **Open question for owner:** none.

## Screenshot: screencapture-localhost-8002-branding-demos-masonry-test-html-2026-05-19-22_22_19.jpg
- **Surface captured:** Branding demo — Masonry v5 test bench (`masonry-test.html`), orange accent
- **Source:** owner real-Chrome (GoFullPage)
- **What's rendered:** A masonry layout test harness. Header "One engine. *Every* count." + body. A "CONTAINER" range slider (value 1136px) that sets each masonry's container width. Then a long series of labelled masonry groups, each showing how N items distribute: Hero stat strip (5 items), 1 item (`:only-child`, forced full-width), 2 items (`:has` guard, forced halves), 3 items (forced thirds), 4 items (`:has` guard · 2×2), 6 items (`:has` guard · 3×3), 7 items (ladder), 8 items (ladder), 9 items (ladder), 10 items (ladder · clean grid). Each item is a dark card with a big numeral/label (1, 2a, 2b, 3a... 10j) and a small caption.
- **Cross-reference vs design DNA:** This is a layout-engine stress test. It confirms a Toolskin layout capability — container-query-driven masonry that redistributes harmonically with no orphan/half-empty trailing slots — which is not explicitly enumerated in `_rebuild-design-dna.md` §F (the F-series covers chip/card/marquee/modal/etc. but not a masonry/grid-distribution engine). The cards themselves match F4 (dark surface, hairline border, radius). The `:has()` / `:only-child` guard approach is a modern-CSS technique consistent with the design-tokens-2.0 / expert-designer "no JS" preference.
- **Anomalies flagged:** none. All masonry groups render cleanly; cards distribute as labelled; no layout breaks or clipping. (Note: the dashed verticals the intro text mentions as container-width markers are not strongly visible at this zoom, but nothing reads as broken.)
- **Section H tag:** n/a
- **Open question for owner:** The masonry/grid-distribution engine (container-query-driven, `:has()`-guarded, orphan-free) is a significant Toolskin layout capability not documented in `_rebuild-design-dna.md` §F. Should it be added as a layout-tier component DNA entry (e.g. F13 MASONRY) so Sessions 4+ block sandboxes can verify parity against it?

═══════════════════════════════════════════════════════════════════════
## BATCH D — PITCHDECK (6 slides — Section H verification sub-group)
═══════════════════════════════════════════════════════════════════════

*Pitchdeck reference docs were UNAVAILABLE (`docs/handoffs/_visual-audit/reference-context/` is empty). The 6 slides below are audited from ground-truth pixels only. Every observation is tagged for Section H verification per owner instruction. The deck is "Toolskin Pitchdeck v3.2", 11 slides total; the owner captured 6 of them (slides numbered 01, 02, 03, 06, 07, 10 of 11).*

## Screenshot: screencapture-localhost-8002-pitchdeck-Toolskin-Pitchdeck-v3-2-html-2026-05-19-22_24_41.jpg
- **Surface captured:** pitchdeck-slide — slide 01/11, cover/title slide
- **Source:** owner real-Chrome (GoFullPage)
- **What's rendered:** A single full-viewport dark slide framed by a thin border, sitting on a faint grid background. Top edge: an orange progress bar (≈1/11 filled). Top-right: "01 / 11" slide counter in orange mono. Content (left-aligned, lower-third): "TOOL*SKIN*" wordmark, an orange mono eyebrow "BUSINESS BRIEFING · Q2 2026", a very large display headline "Make money in 30 days." (mixed-case, white, "30" inline), a two-line sub-paragraph, and a two-column meta block (PREPARED FOR → Co-founder review / DECISION NEEDED → Continue / pivot / shut down). Bottom bar: "PRESS → TO ADVANCE · [Esc] FOR GRID VIEW" hint + a → arrow button at far right.
- **Cross-reference vs design DNA:** Matches the Toolskin visual language: near-black surface, orange accent, Space Grotesk heavy display, mono eyebrow with wide tracking (B1 UI-label tracking), accent-italic "SKIN" wordmark device. The slide-frame + grid backdrop is a pitchdeck-specific layout chrome not in §F. Display headline is mixed-case (consistent with marketing/branding, again against §B4's uppercase claim).
- **Anomalies flagged:** none. Clean render; fonts loaded; no broken glyphs.
- **Section H tag:** Pitchdeck slide chrome = a bordered full-viewport slide frame on a faint grid background, top orange progress bar, top-right "NN / 11" mono counter, bottom keyboard-hint bar with → advance affordance. Carry this slide-shell spec into Section H verification as the canonical pitchdeck layout container.
- **Open question for owner:** Pitchdeck reference docs are missing — should the rebuild treat this captured deck chrome (slide frame + progress bar + counter + keyboard-hint footer) as canonical pitchdeck DNA, or are there reference docs that must be located first?

## Screenshot: screencapture-localhost-8002-pitchdeck-Toolskin-Pitchdeck-v3-2-html-2026-05-19-22_24_54.jpg
- **Surface captured:** pitchdeck-slide — slide 02/11, "What is Toolskin, in one minute."
- **Source:** owner real-Chrome (GoFullPage)
- **What's rendered:** Same slide shell. Counter "02 / 11", progress bar ≈2/11. Left column: "§01 · THE PRODUCT" mono label, headline "What is *Toolskin*, in one minute." (accent-italic "Toolskin"), a short orange accent underline rule, and a sub-paragraph. Right region: a 2×2 grid of audience cards — FOR DEVELOPERS (accent-orange border + tint + orange body text, inline mono code chips `--ts-accent-h`, `color-mix()`, `clamp()`), FOR DESIGNERS (dark, hairline border), FOR AGENCIES (dark, hairline border), FOR NON-TECHNICAL BUYERS (accent-orange border + tint + orange body text). Each card has a small icon + mono caps title. Bottom bar: "10,000+ LINES OF CSS · OKLCH AUTO-CONTRAST · WCAG AA BUILT IN · ZERO DEPENDENCIES" + ← → buttons.
- **Cross-reference vs design DNA:** Cards match F4 + C1 (two cards use accent border + tint to draw emphasis without solid flood — exactly C1's "tinted/bordered, not solid" rule; only primary buttons / accent chips go solid). Inline mono code chips confirm JetBrains Mono token usage. Orange underline accent rule under the headline is a recurring pitchdeck device.
- **Anomalies flagged:** LOW — the two accent-emphasis cards (FOR DEVELOPERS, FOR NON-TECHNICAL BUYERS) render their entire body copy in orange on a dark+orange-tinted background. Body-length text in saturated orange is lower-contrast / harder to read than the white body text in the neutral cards. Not a hard WCAG failure at display size, but worth a contrast check — it sits adjacent to the deck's own "WCAG AA built in" claim in the footer.
- **Section H tag:** Pitchdeck card-emphasis pattern = selected cards in a slide grid use accent border + accent tint + accent-colored body text to signal emphasis. Carry into Section H verification: confirm the accent-on-tint body-text contrast passes WCAG AA, since the deck footer explicitly claims AA compliance.
- **Open question for owner:** Is full-paragraph orange body text on an orange-tinted card an accepted pitchdeck emphasis style, or should emphasis cards keep neutral (white) body text and use only border+tint for emphasis (which would also align with §C1)?

## Screenshot: screencapture-localhost-8002-pitchdeck-Toolskin-Pitchdeck-v3-2-html-2026-05-19-22_25_25.jpg
- **Surface captured:** pitchdeck-slide — slide 03/11, "The market changed in 2025."
- **Source:** owner real-Chrome (GoFullPage)
- **What's rendered:** Same shell. Counter "03 / 11". "§02 · MARKET REALITY" mono label, headline "The market changed in 2025. Plan accordingly." + orange underline rule. A 3-column card row: card 1 "Tailwind UI revenue collapsed 80%" with a red "DYING" pill, body, and a small italic pull-quote; card 2 "What still makes money in 2026" with a green "SURVIVING" pill and a 4-item plus-marked list; card 3 "IMPLICATION FOR TOOLSKIN" (orange mono title, no pill) with body copy. Bottom bar: "SOURCES: SACRA · CONTRARY RESEARCH · TAILWIND LABS FOUNDER STATEMENTS · YAHOO FINANCE" + ← →.
- **Cross-reference vs design DNA:** Cards match F4. The red "DYING" / green "SURVIVING" status pills confirm F1/chip-family + C-series status colors used semantically (red=danger, green=success). Plus-marked list items use accent/green markers. Consistent dark-surface + hairline-border treatment.
- **Anomalies flagged:** none. Clean render; pills, lists, columns all intact.
- **Section H tag:** Pitchdeck content-card pattern = 3-column comparison row where status pills (red/green) classify each column, the third column is an "implication" card with an orange mono title and no pill. Carry into Section H verification as a standard pitchdeck slide layout (3-up comparison cards).
- **Open question for owner:** none.

## Screenshot: screencapture-localhost-8002-pitchdeck-Toolskin-Pitchdeck-v3-2-html-2026-05-19-22_25_44.jpg
- **Surface captured:** pitchdeck-slide — slide 06/11, "Week-by-week. First 30 days."
- **Source:** owner real-Chrome (GoFullPage)
- **What's rendered:** Same shell. Counter "06 / 11". "§05 · EXECUTION" mono label, headline "Week-by-week. First 30 days." + orange underline. A 4-row timeline: each row = a numbered "Week 01/02/03/04" badge (orange-outlined square), a task description line, a revenue range cell ($0–$1.5K / $1.5K–$4K / $3K–$7K / $5K–$12K), and an orange-outlined phase pill (FOUNDATION / FIRST $ / VALIDATE / COMPOUND). Below: a "CRITICAL PATH METRIC" panel — "By Day 14: at least [1 signed service contract] with 50% deposit collected..." with the key phrase in a mono inline chip. Bottom bar: "OUTREACH MATH: 50 COLD DMS → 10 REPLIES → 3 CALLS → 1 CLOSE · INDUSTRY BASELINE" + ← →.
- **Cross-reference vs design DNA:** The week badges (orange-outlined squares) and phase pills (orange-outlined) match C1's "accent as border/outline, not solid" — emphasis via outline. The numbered timeline rows are hairline-separated. Inline mono chip for the key phrase confirms JetBrains Mono usage. The slide jumps from §02 (slide 03) to §05 (slide 06) — consistent with the owner capturing a 6-of-11 subset; section numbers are non-contiguous because intervening slides were not captured.
- **Anomalies flagged:** none. Clean render; timeline rows, badges, pills, panel all intact.
- **Section H tag:** Pitchdeck timeline pattern = numbered-badge rows (orange-outlined square badge + description + value cell + orange-outlined phase pill), followed by an emphasized "critical path" callout panel with an inline mono chip. Carry into Section H verification as a pitchdeck timeline/roadmap layout. Also note for Section H: captured slides are non-contiguous (01,02,03,06,07,10) — Section H verification should account for 5 uncaptured slides (04,05,08,09,11).
- **Open question for owner:** Only 6 of 11 pitchdeck slides were captured (01/02/03/06/07/10). Should the remaining 5 slides (04, 05, 08, 09, 11) be captured for a complete Section H verification, or is this 6-slide subset sufficient?

## Screenshot: screencapture-localhost-8002-pitchdeck-Toolskin-Pitchdeck-v3-2-html-2026-05-19-22_25_58.jpg
- **Surface captured:** pitchdeck-slide — slide 07/11, "Kill-switches. We commit to these now."
- **Source:** owner real-Chrome (GoFullPage)
- **What's rendered:** Same shell. Counter "07 / 11". Left column: "§06 · DECISION GATES" mono label, headline "Kill-switches. We commit to these now." + orange underline, sub-paragraph. Right region: a 2×2 grid of decision-gate cards, each with a ⚠ warning-triangle icon and a red-accent title (DAY 14 · No signed contract / DAY 30 · Below $1.5K cumulative / DAY 60 · Below $5K cumulative / DAY 90 · Below $15K cumulative) + body. All four cards have a red/danger left treatment. Below the grid: a wide accent-tinted panel with an orange left-border bar and body copy ("These are commitments to you, not predictions..."). Bottom bar: "* MOST FAILED FOUNDER PARTNERSHIPS FAIL BECAUSE NO ONE DEFINED THE EXIT CRITERIA." + ← →.
- **Cross-reference vs design DNA:** The four gate cards use red/danger accent (border + title color) — semantic status color application matching C-series. The ⚠ icons render (FontAwesome/Ionicons OK). The bottom accent-tinted panel with orange left-border bar is the same emphasis device as the toast left-bar (F12) scaled to a panel. Cards hairline/red-bordered, dark surface — F4 family.
- **Anomalies flagged:** none. Clean render; warning icons, cards, the tinted summary panel all intact.
- **Section H tag:** Pitchdeck warning-grid pattern = 2×2 grid of danger-accented cards (⚠ icon + red title + body), closed by a full-width accent-tinted summary panel with an orange left-border bar. Carry into Section H verification as a pitchdeck "risk/decision-gate" slide layout; confirm red-accent title text passes WCAG AA contrast.
- **Open question for owner:** none.

## Screenshot: screencapture-localhost-8002-pitchdeck-Toolskin-Pitchdeck-v3-2-html-2026-05-19-22_26_16.jpg
- **Surface captured:** pitchdeck-slide — slide 10/11, "Why we win — and where we don't."
- **Source:** owner real-Chrome (GoFullPage)
- **What's rendered:** Same shell. Counter "10 / 11". "§09 · DEFENSIBILITY" mono label, headline "Why we win — and where we don't." + orange underline. A 2-column card row: left "DEFENSIBLE" (green mono title) with 5 green-plus-marked list items; right "NOT DEFENSIBLE" (red mono title) with 5 red-X-marked list items. Below: a wide accent-tinted panel with orange left-border bar, "THE HONEST MOAT" orange mono title + body copy. Bottom bar: a mono pull-quote "'WE DON'T NEED A MOAT TO START. WE NEED A MOAT BY YEAR 2-3 TO KEEP GOING.'" + ← →.
- **Cross-reference vs design DNA:** Two-column pro/con card layout; green-plus vs red-X list markers confirm C-series status colors used semantically. The "THE HONEST MOAT" accent-tinted panel with orange left-border bar is again the toast-style left-bar emphasis device (F12) at panel scale — consistent with slide 07. Mono titles, hairline borders, dark surfaces all match the F4 family.
- **Anomalies flagged:** none. Clean render; both columns, list markers, the moat panel all intact.
- **Section H tag:** Pitchdeck pro/con pattern = 2-column card row with semantic green-title/red-title and plus/X list markers, closed by a full-width accent-tinted "honest" summary panel with orange left-border bar. The accent-tinted-panel-with-orange-left-bar appears on slides 07 and 10 — carry into Section H verification as a RECURRING pitchdeck "summary callout" component.
- **Open question for owner:** none.

═══════════════════════════════════════════════════════════════════════
## Pitchdeck — Section H verification notes — Batch D
═══════════════════════════════════════════════════════════════════════

Consolidated pitchdeck-tier observations for downstream Section H (layout/pitchdeck tier) verification. **Pitchdeck reference docs were unavailable** (`reference-context/` empty) — these notes are extracted purely from owner ground-truth pixels and must be verified against reference docs if/when located.

1. **Slide shell (canonical pitchdeck layout container).** Every slide is a bordered full-viewport frame on a faint grid background, with: a top-edge orange progress bar that fills proportionally to slide position; a top-right "NN / 11" slide counter in orange mono; a bottom keyboard-hint footer bar containing contextual mono microcopy and ←/→ (or → on slide 01) navigation buttons. Section H must verify this shell as the pitchdeck layout primitive.

2. **Section-label + headline + accent-rule head pattern.** Each content slide opens with a "§NN · SECTION NAME" orange mono label, a large mixed-case Space Grotesk display headline (often with an accent-italic word), and a short orange underline accent rule beneath the headline.

3. **Recurring pitchdeck slide layouts to verify in Section H:** (a) cover/title slide (slide 01); (b) 2×2 audience/feature card grid (slide 02); (c) 3-up comparison card row with status pills (slide 03); (d) numbered timeline/roadmap rows + critical-path callout (slide 06); (e) 2×2 danger/decision-gate card grid (slide 07); (f) 2-column pro/con card row (slide 10).

4. **Recurring "summary callout" component.** A full-width accent-tinted panel with an orange left-border bar (the toast left-bar device, F12, at panel scale) appears on slides 07 and 10 as a closing emphasis block. Section H should treat this as a named pitchdeck component.

5. **Accent application in the deck matches §C1.** Emphasis is delivered via accent border + accent tint + outline (week badges, phase pills, emphasis cards), never solid accent floods — consistent with the design DNA. EXCEPTION to verify: slide 02's emphasis cards render full-paragraph body text in saturated orange (contrast concern, see anomaly D-A11).

6. **Capture coverage gap.** Only 6 of 11 slides were captured (01, 02, 03, 06, 07, 10). Section numbers are therefore non-contiguous (§01,§02,§05,§06,§09). Section H verification of the full deck requires the 5 uncaptured slides (04, 05, 08, 09, 11) OR an explicit owner decision that the 6-slide subset is sufficient.

7. **Contrast claims to verify.** The deck footer (slide 02) explicitly claims "WCAG AA BUILT IN". Section H verification should contrast-check: orange body text on orange-tinted cards (slide 02), red-accent titles on dark (slide 07), and green/red mono titles (slides 03, 10).

═══════════════════════════════════════════════════════════════════════
## Anomalies — Batch D
═══════════════════════════════════════════════════════════════════════

1. **[HIGH]** `screencapture-localhost-8002-branding-previews-spacing-radius-html` — Radius role/value assignment on the branding spacing-radius reference page (SM 4=badges / MD 6=buttons / BASE 8=inputs / LG 10=cards / XL 16=sheets / PILL 999) directly **contradicts `_rebuild-design-dna.md` §D1/§D2** (calc-derived ladder; buttons/inputs ≈ sm~7, cards = md~8). Two authoritative-looking sources give incompatible radius systems. Blocks radius-token work.
2. **[HIGH]** `screencapture-localhost-8002-branding-previews-typography-html` — The branding typography reference caps Space Grotesk at **wght 300–700** and shows DISPLAY XL & H1 at **700**, H2 at **600**. This contradicts `_rebuild-design-dna.md` §B3, which claims a 300–900 scale with H1/hero/display at **900** and H2 at literal **800**. The live branding reference and the DNA spec disagree on heading weights.
3. **[HIGH]** `screencapture-localhost-8002-branding-demos-mobile-app-html` — Render/layout break inside the phone mockup: the lime balance pill near the top shows **text clipped and overlapping** (illegible), and the segmented tab row directly below it is **vertically clipped / cut off** (half-height tabs). Confirmed visual breakage.
4. **[MED]** `screencapture-localhost-8002-branding-previews-typography-html` — Body font-size shown as **14px** on the type ramp. This is a THIRD value against 13px (`_rebuild-design-dna.md` §B5 / OQ-A6) and 16px (typography-master skill) — a three-way conflict on the type base.
5. **[MED]** `screencapture-localhost-8002-branding-previews-components-buttons-html` — In the "Icon-only" button row, the 4th button renders **blank / missing its icon** (empty square, faint sliver only). Consistent with a FontAwesome/Ionicons glyph load failure (or an undocumented blank variant).
6. **[MED]** `screencapture-localhost-8002-branding-previews-toolskin-logo-html` — A full 3-candidate logo system (Bracket / Blade / Cascade) with favicon specs and light/dark/accent lockups EXISTS on this page, **contradicting `_rebuild-design-dna.md` §H OQ-Logo**, which states no logo/mark system exists in the repo. The DNA spec's OQ-Logo conclusion is factually wrong per ground truth.
7. **[MED]** `screencapture-localhost-8002-branding-demos-mobile-app-html` — Demo spec list declares **TYPE: PP Editorial · IBM Mono**, off the Toolskin Space Grotesk / JetBrains Mono anchor (typography-master). Either an intentional theming demo or off-brand.
8. **[MED]** `screencapture-localhost-8002-branding-demos-mobile-app-html` — The mobile tab bar uses a prominent circular **FAB** as its centerpiece; `_rebuild-design-dna.md` §G1 explicitly lists FAB as a Toolskin anti-pattern ("never as a primary CTA pattern").
9. **[LOW]** `screencapture-localhost-8002-branding-previews-colors-html` — Accent presented two non-identical ways: `hsl(18,100%,52%)` (code block) vs hex `#FF5500` (swatch label). hsl(18,100%,52%) does not resolve exactly to #FF5500. Single source of truth needed.
10. **[LOW]** `screencapture-localhost-8002-branding-demos-mobile-app-html` — Demo declares **RADII 12/16/22/24**, a third independent radius set (vs branding page 4/6/8/10/16 and DNA §D1's derived ladder).
11. **[LOW]** `screencapture-localhost-8002-pitchdeck-...-22_24_54.jpg` (slide 02) — Emphasis cards render full-paragraph body copy in saturated orange on an orange-tinted background — lower contrast, adjacent to the deck's own "WCAG AA built in" claim. Contrast verification recommended (also tagged for Section H).
12. **[LOW]** `screencapture-localhost-8002-branding-previews-typography-html` — Space Grotesk token shown as `--ts-font-display`; typography-master SKILL lists `--ts-font-heading`. Token-name mismatch.
13. **[LOW]** `screencapture-localhost-8002-branding-demos-marketing-html` (+ branding index + pitchdeck slide 01) — Hero/display headlines are consistently **mixed-case sentence form**, contradicting `_rebuild-design-dna.md` §B4, which lists hero title and display title as uppercase-locked.

═══════════════════════════════════════════════════════════════════════
## Owner-pending questions — Batch D
═══════════════════════════════════════════════════════════════════════

1. `screencapture-localhost-8002-branding-previews-spacing-radius-html` — Which radius system is canonical for the rebuild: the branding-preview page (SM4/MD6/BASE8/LG10/XL16/PILL999, buttons=MD, inputs=BASE, cards=LG) or `_rebuild-design-dna.md` §D1's calc-derived ladder (buttons/inputs≈sm~7, cards=md~8)? They are incompatible.
2. `screencapture-localhost-8002-branding-previews-typography-html` — Is the canonical heading weight scale 300–700 (branding page: H1/display=700, H2=600) or 300–900 (DNA §B3: H1/display=900, H2=800)? OQ-B3 needs re-deciding with this ground-truth evidence.
3. `screencapture-localhost-8002-branding-previews-typography-html` — What is the true body font-size base: 13px, 14px, or 16px? Three sources give three answers (DNA §B5=13, branding page=14, typography-master=16).
4. `screencapture-localhost-8002-branding-previews-toolskin-logo-html` — Which of the three logo directions (Bracket / Blade / Cascade) is the chosen master mark? And should `_rebuild-design-dna.md` §H OQ-Logo (which wrongly says no logo system exists) be corrected/re-opened?
5. `screencapture-localhost-8002-branding-demos-mobile-app-html` — The lime balance pill and the tab row beneath it are visibly clipped/overlapping — confirmed bug to fix, or known WIP?
6. `screencapture-localhost-8002-branding-demos-mobile-app-html` — Does the mobile demo intentionally swap to PP Editorial + IBM Mono (theming demonstration), or is that off-brand against the Space Grotesk / JetBrains Mono anchor? And is the circular FAB acceptable in the mobile demo despite §G1's anti-FAB rule?
7. `screencapture-localhost-8002-branding-previews-colors-html` — Is the canonical accent the HSL triplet `hsl(18,100%,52%)` or the hex `#FF5500`? They are presented together but are not exactly equal; the rebuild's primitive layer needs one source of truth.
8. `screencapture-localhost-8002-branding-previews-components-buttons-html` — Is the 4th icon-only button intentionally blank (a placeholder variant) or a broken FontAwesome/Ionicons glyph? If broken, icon pinning per CLAUDE.md §5b needs checking.
9. `screencapture-localhost-8002-branding-previews-audit-html` — The branding self-audit page names concrete defects (hardcoded near-black text on status buttons, literal-hex orange ramp, baked-in tinted glass). Are these the same issues already in `_rebuild-design-dna.md` §H, or additional defects the rebuild must independently track?
10. `screencapture-localhost-8002-branding-demos-marketing-html` — `_rebuild-design-dna.md` §B4 lists hero/display titles as uppercase-locked, but every captured hero (marketing, branding index, pitchdeck) is mixed-case. Should §B4 be corrected so hero display headlines are mixed-case?
11. `screencapture-localhost-8002-branding-demos-masonry-test-html` — Should the container-query-driven, `:has()`-guarded, orphan-free masonry/grid-distribution engine be added to `_rebuild-design-dna.md` §F as a layout-tier component DNA entry (e.g. F13 MASONRY)?
12. `screencapture-localhost-8002-pitchdeck-...` (all 6 slides) — Pitchdeck reference docs are missing (`reference-context/` empty). Should the captured deck chrome be treated as canonical pitchdeck DNA, and should the 5 uncaptured slides (04, 05, 08, 09, 11 of 11) be captured for a complete Section H verification?
13. `screencapture-localhost-8002-pitchdeck-...-22_24_54.jpg` (slide 02) — Is full-paragraph orange body text on an orange-tinted emphasis card an accepted pitchdeck style, or should emphasis cards keep neutral body text (border+tint only, aligning with §C1)?

═══════════════════════════════════════════════════════════════════════
## STATUS — Batch D
═══════════════════════════════════════════════════════════════════════

- **Batch:** D (owner real-Chrome ground-truth — branding system, branding demos, pitchdeck).
- **Screenshots analyzed:** 21 / 21 (1 branding index, 8 branding previews, 6 branding demos, 6 pitchdeck slides).
- **Anomalies:** 13 total — HIGH 3, MED 5, LOW 5.
- **Owner-pending questions:** 13.
- **Pitchdeck:** 6 of 11 slides audited as a distinct sub-group; all observations tagged for Section H verification. Pitchdeck reference docs were UNAVAILABLE — Section H notes are pixel-derived only.
- **Key finding:** Ground-truth pixels surface three HIGH-severity contradictions between the branding system's own reference pages and `_rebuild-design-dna.md` (radius system §D1, heading weights §B3, plus a render bug in the mobile demo) — these displace the text-derived DNA per Pattern 17 and require Gate-5 owner re-decisions before Sessions 4+ can run a strict design-DNA-conformance gate.
- **Status:** `DONE_WITH_CONCERNS` — extraction complete; 13 owner questions (esp. radius, weight, font-base, logo pick) block strict design-DNA conformance.
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
