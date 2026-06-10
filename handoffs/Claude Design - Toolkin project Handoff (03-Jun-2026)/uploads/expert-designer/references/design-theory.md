# Design Theory Reference

> Comprehensive design theory: composition, typography, color, brand, social media, print, awards.
> Read this file before any design implementation task.

---

## 0. DESIGNER IDENTITY & CREATIVE PHILOSOPHY

### 0.1 Agent persona

You are a world-class visual designer with 15+ years across brand identity, web/UI design,
editorial, print, and digital product. You have won Awwwards SOTD, D&AD pencils, and Cannes
Lions. You think in systems but execute with soul. You are equally comfortable debating Müller-Brockmann's
grid theory and shipping pixel-perfect CSS at 2am. You sketch before you code. You question
briefs before you accept them. You present work with conviction but receive feedback with grace.

**Core beliefs:**
- Design is problem-solving made visible. Every aesthetic choice answers a strategic question.
- Consistency is not uniformity. A design system enables creativity, not suppresses it.
- The best interface is invisible. Users should feel the experience, not notice the design.
- White space is not empty — it's charged. It's the most powerful design element.
- Typography is 90% of design. Get the type right and everything else follows.
- Dark mode is not an afterthought. Design dark-first, light as variant.
- Accessibility is not a constraint — it's a craft. Beautiful and accessible are never in tension.
- Reference, don't replicate. Absorb principles from inspiration, never copy layouts.
- Every project deserves a unique personality. Never converge on safe defaults.
- Ship beats perfect, but never ship ugly. Find the minimum viable beauty.

### 0.2 Design thinking process

Before writing ANY code, commit to a BOLD aesthetic direction:

1. **Purpose** — What problem does this interface solve? Who is the audience?
2. **Tone** — Pick a clear extreme and own it: brutally minimal, maximalist chaos, retro-futuristic,
   organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric,
   soft/pastel, industrial/utilitarian, dark premium, neo-Y2K, Swiss precision, collage punk.
   Use these for inspiration but design one that is true to the aesthetic direction.
3. **Differentiation** — What single visual element makes this UNFORGETTABLE? What will someone remember?
4. **Emotional register** — What should the viewer FEEL in the first 3 seconds?
5. **Constraints** — Technical requirements, brand guidelines, accessibility needs.

**CRITICAL:** Bold maximalism and refined minimalism both work — the key is INTENTIONALITY, not intensity.
Generic = death. Every design decision must answer "why this and not something else?"

### 0.3 Anti-patterns (NEVER do these)
- Overused fonts as defaults (Inter, Roboto, Arial, system-ui) without contextual justification
- Purple-gradient-on-white syndrome (the universal "AI made this" signal)
- Clichéd color schemes, particularly purple gradients on white backgrounds
- Predictable symmetric layouts with no visual tension
- Cookie-cutter component design with no context-specific character
- Converging on the same font/color/layout across different projects (e.g. always Space Grotesk)
- Flat, lifeless solid-color backgrounds where atmosphere is needed
- Scattered micro-interactions with no orchestration strategy

### 0.4 Design excellence signals
- Typography that creates hierarchy AND personality simultaneously
- Color palettes with one dominant hue, sharp accents, and intentional restraint
- Dominant colors with sharp accents outperform timid, evenly-distributed palettes
- Spatial tension: asymmetry, overlap, diagonal flow, grid-breaking moments
- Atmospheric depth: gradient meshes, noise textures, geometric patterns, grain overlays,
  layered transparencies, dramatic shadows, decorative borders, custom cursors
- One well-orchestrated page load with staggered reveals (`animation-delay`) > scattered micro-interactions
- Scroll-triggering and hover states that surprise
- White space used as a compositional tool, not leftover emptiness
- Match implementation complexity to aesthetic vision: elaborate code for maximalist designs,
  restrained precision for minimalist ones

### 0.5 Working method

**When receiving a design brief:**
1. ASK clarifying questions (audience, constraints, brand context)
2. DEFINE the aesthetic direction with conviction (name the vibe, cite references)
3. SKETCH the composition mentally before writing code (describe the layout)
4. IMPLEMENT with Toolskin tokens as the foundation
5. PRESENT with clear rationale for every major decision
6. OFFER variants with logical, not arbitrary, differences

**When reviewing or critiquing design:**
1. Start with what WORKS and why
2. Identify the ONE thing that would most improve the design
3. Provide a specific, actionable solution (not just "make it better")
4. Reference principles, not personal preference ("the hierarchy is unclear because...")

**When learning from references:**
1. INVENTORY: What is the reference doing? (Layout, type, color, motion, texture)
2. ABSTRACT: What principle makes it work? (Not "they used Helvetica" but "single grotesque at extreme weight contrast")
3. ADAPT: How does this principle serve THIS project?
4. DOCUMENT: Add the learned pattern to expanding knowledge base

---


## 0B. VISUAL COMPOSITION & DESIGN THEORY

### 0B.1 Composition principles (always apply)

**Visual hierarchy** — Guide the eye through content in order of importance:
- Size contrast (hero text 3–5× body size minimum for impact)
- Weight contrast (black weight headlines vs. light body)
- Color contrast (accent on neutral = instant focal point)
- Spatial isolation (the element with most space around it feels most important)
- Position (top-left dominant in LTR cultures, center for symmetrical layouts)

**The Rule of Thirds** — Divide the viewport into a 3×3 grid. Place focal elements at intersections.
Break this rule deliberately for tension (centered hero with massive whitespace = luxury).

**Gestalt principles for UI:**
- **Proximity** — Group related items tightly; separate unrelated ones with meaningful space
- **Similarity** — Same visual treatment = same semantic meaning
- **Continuation** — Lead the eye along lines and curves through the layout
- **Closure** — The brain completes incomplete shapes (use for creative icon/logo work)
- **Figure-ground** — Ensure clear separation between content and background at all depths

**Rhythm & repetition** — Consistent spacing, repeating visual motifs, and modular patterns
create cohesion. Break the rhythm once per section for emphasis (the "pattern interrupt").

**Contrast drives everything** — If two things aren't the same, make them VERY different.
Small differences look like mistakes. Big differences look intentional.

### 0B.2 Layout strategy by context

| Context | Grid | Character |
|---------|------|-----------|
| Editorial / Magazine | Asymmetric multi-column (2fr 1fr, 3fr 2fr) | Sophisticated, dynamic |
| SaaS / Dashboard | 12-column with consistent gutters | Professional, functional |
| Portfolio / Creative | Bento grid (mixed spans, dense flow) | Playful, gallery-like |
| Landing page | Single-column with full-width sections | Focused, narrative |
| E-commerce | Product grid auto-fit minmax(280px, 1fr) | Scannable, efficient |
| Luxury / Fashion | Generous whitespace, oversized single elements | Elevated, exclusive |

**Responsive philosophy:** Design for the smallest screen first. Let content determine breakpoints,
not device categories. Container queries for component-level adaptation. Media queries for page structure.

### 0B.3 Typography as design tool (beyond font selection)

Typography is NOT just "picking a font." It's the primary design tool.

**Font selection decision tree:**
1. What is the brand personality? (see §2.6 brand typography)
2. Does the typeface have enough weights/styles for a full system? (minimum: 3 weights)
3. Does it perform well at both extremes? (12px body AND 80px display)
4. Variable font available? (prefer for web — single file, unlimited flexibility)
5. Does it pair with the secondary typeface via contrast OR concordance? (never similarity)

**Display typography techniques:**
- Negative letter-spacing on large text (−0.02em to −0.04em)
- Line-height tightens as size increases (body: 1.5, H1: 1.1, hero: 0.92)
- Uppercase + wide tracking for labels/categories (0.08em–0.12em)
- Mixed weight in headlines: "Your <b>Bold</b> Statement" creates instant hierarchy
- Gradient text via `background-clip: text` for hero moments (use sparingly)

### 0B.4 Color as communication

**Palette construction method:**
1. Start with ONE brand color (the accent)
2. Derive 10-step tint/shade scale from that single hue
3. Add 1 neutral scale (warm gray or cool gray, never pure gray)
4. Add 0–1 complementary accent (ts-accent-alt) (sparingly, for contrast moments only)
5. Define semantic colors: success (green), warning (amber), danger (red), info (blue)

### 0B.5 Motion & interaction design philosophy

**Core principle:** Motion should feel INEVITABLE, not decorative. If removing the animation
doesn't reduce understanding, the animation shouldn't exist.

**High-impact pattern:** One well-orchestrated page load with staggered reveals
(`animation-delay: calc(var(--i) * 80ms)`) creates more delight than scattered micro-interactions.
Use scroll-triggering and hover states that surprise.

**CSS-only solutions preferred for HTML.** Use Motion library for React when available.
Focus on high-impact moments rather than decorating everything.


## 2. TYPOGRAPHY

### 2.1 Font pairing methodology

**Three approaches:**
1. **Contrast principle:** Pair fonts with different characteristics (serif + sans-serif, display + body). Match x-heights and stroke weights.
2. **Concordance principle:** Pair similar fonts. Different weights within the same family guarantees harmony.
3. **Superfamily approach:** Serif and sans-serif from the same superfamily (e.g., Roboto + Roboto Slab).

**Rules:** Limit to 2–3 typefaces maximum. One "loud" font only; keep body font calm. Body text: 16–18px. Headlines: 40–56px.

**Proven pairings:**

| Heading | Body | Character |
|---------|------|-----------|
| Playfair Display (Serif) | Montserrat (Sans) | Sophisticated, professional |
| Bebas Neue (Condensed) | Inter (Sans) | Striking contrast |
| Young Serif | Bitter (Serif) | Blogs, portfolios |
| Aktiv Grotesk (Sans) | Brix Slab (Slab) | Consulting, wellness |
| Single-family system (Lato weights) | — | Clean, formal |

### 2.2 Type scale systems

**Modular scale ratios:**

| Name | Value | Character |
|------|-------|-----------|
| Minor Second | 1.067 | Very subtle |
| Major Second | 1.125 | Gentle |
| Minor Third | 1.200 | Versatile, good for small screens |
| Major Third | 1.250 | Balanced, popular for web |
| Perfect Fourth | 1.333 | Strong hierarchy |
| Perfect Fifth | 1.500 | Bold hierarchy |
| Golden Ratio | 1.618 | Classic, dramatic |

**CSS modular scale implementation:**
```css
:root {
  --ts-ratio: 1.333;
  --ts-s-2: calc(var(--ts-s-1) / var(--ts-ratio));
  --ts-s-1: calc(var(--ts-s0) / var(--ts-ratio));
  --ts-s0: 1rem;
  --ts-s1: calc(var(--ts-s0) * var(--ts-ratio));
  --ts-s2: calc(var(--ts-s1) * var(--ts-ratio));
  --ts-s3: calc(var(--ts-s2) * var(--ts-ratio));
  --ts-s4: calc(var(--ts-s3) * var(--ts-ratio));
  --ts-s5: calc(var(--ts-s4) * var(--ts-ratio));
}
```

### 2.3 Fluid typography with clamp()

**Formula:** Given min font (y₁) at min viewport (x₁) and max font (y₂) at max viewport (x₂):
- Slope (m) = (y₂ - y₁) / (x₂ - x₁)
- Preferred = m × 100vw + (y₁ - m × x₁) converted to rem
- Always combine vw + rem for zoom support

```css
h1 { font-size: clamp(2rem, 5vw + 0.5rem, 3.5rem); }
h2 { font-size: clamp(1.5rem, 3vw + 0.75rem, 2.5rem); }
p  { font-size: clamp(1rem, 0.31vw + 0.938rem, 1.19rem); }
```

**Utopia.fyi approach:** Interpolates between two modular scales — smaller for mobile, larger for desktop. Use https://utopia.fyi/type/calculator to generate clamp() values.

### 2.4 Variable fonts

**Registered axes:** `wght` (weight, 100–900), `wdth` (width, 75–125), `slnt` (slant, -12–0), `ital` (italic, 0–1), `opsz` (optical size, 8–144).

**CSS usage (prefer high-level properties):**
```css
.ts-heading {
  font-weight: 650;
  font-stretch: 90%;
  font-optical-sizing: auto;
}
```

**Top variable fonts (2025–2026):**
- **Sans-serif:** Inter (UI workhorse), Roboto Flex (12 axes), Bricolage Grotesque (trending), Commissioner
- **Serif:** Fraunces (custom SOFT/WONK axes), Playfair Display
- **Versatile:** Recursive (mono to sans on single axis)
- **Premium:** Druk (Commercial Type), GT Ultra (Grilli Type), Fragment (Pangram Pangram)

**Performance:** Single variable font file (300–500KB) replaces 7–12 static files (800KB–2MB+). Break-even at 3+ weights.

### 2.5 Web typography rules

**Optimal line length:** 45–75 characters (ideal: 65ch). `max-width: 65ch;`

**Line-height by size:**
- Body (16–18px): 1.5–1.6
- Subheadings (20–24px): 1.3–1.4
- Headings (32–48px): 1.1–1.2
- Display (48px+): 1.0–1.1

**Font loading strategy:**
```html
<link rel="preload" href="/fonts/space-grotesk.woff2" as="font" type="font/woff2" crossorigin>
```
```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/space-grotesk.woff2') format('woff2');
  font-display: swap;
  font-weight: 100 900;
}
```

Use WOFF2 format. Self-host. Preload 1–2 critical fonts. `font-display: swap` for most cases; `optional` for best Core Web Vitals.

### 2.6 Brand typography selection

| Brand Value | Style | Examples |
|-------------|-------|----------|
| Luxury / Elegance | Classic serif, Didone | Chanel, Rolex (Garamond) |
| Trust / Authority | Sturdy serif | NYT, law firms |
| Innovation / Tech | Clean geometric sans | Apple (SF Pro), Spotify (Circular) |
| Friendly / Approachable | Rounded humanist sans | Mailchimp (Cooper Light), Airbnb (Cereal) |
| Playful / Creative | Display, handwritten | Lego |

**Brand typography structure:** Primary typeface (logo, headlines) → Secondary (body) → Tertiary (accents, optional).

### 2.7 Typography trends (2025–2026)

- Variable fonts mainstream with scroll-linked animations
- "Typography as Hero Image" — type IS the design (COLLINS' Bose identity)
- Anti-AI hand-rendered type as authenticity signal
- Condensed bold grotesques for branding
- Kinetic typography in web and social media
- Art Deco revival with geometric, elongated forms
- Mutant heritage: classic letterforms "hacked and reengineered"

---

## 3. COLOR THEORY & IMPLEMENTATION

### 3.1 Color harmonies

- **complementary:** (currently used on  swatch .ts-accent-alt) Opposite on wheel (high contrast, CTAs)
- **Analogous:** 3 adjacent hues (harmonious, backgrounds)
- **Triadic:** 3 colors at 120° intervals (vibrant, balanced)
- **Split-complementary:** (ts-accent-alt) Base + two adjacent to alt (contrast with less tension)
- **Tetradic:** 4 colors forming rectangle (rich, needs careful balance)

### 3.2 Accessibility contrast

**WCAG 2.1 (current legal standard):**

| Level | Normal Text (<18pt) | Large Text (≥18pt/14pt bold) |
|-------|---------------------|-------------------------------|
| AA | 4.5:1 | 3:1 |
| AAA | 7:1 | 4.5:1 |
| Non-text (AA) | 3:1 | — |

**APCA (WCAG 3.0 candidate):** Uses Lightness Contrast (Lc) score. Polarity-aware. Font size AND weight matter.

| Lc Score | Usage |
|----------|-------|
| 15 | Minimum non-text elements |
| 30 | Absolute minimum any text |
| 45 | Large/heavy text (≥36pt/400) |
| 60 | Minimum body text |
| 75 | Preferred body text |
| 90 | Comfortable reading |

### 3.3 Modern CSS color spaces

**OKLCH (recommended for all new work):**

```css
color: oklch(0.7 0.15 240);
/* L: 0–1 (lightness), C: 0–~0.37 (chroma), H: 0–360 (hue) */
/* Hue reference: red≈20, yellow≈90, green≈140, blue≈220, purple≈320 */
```

Why OKLCH: Perceptually uniform (equal numerical changes = equal perceived changes), human-readable, wide-gamut (P3+), better palette generation, smoother gradients. Fixes HSL's broken lightness and LCH's blue-purple hue shift.

**Display P3 (progressive enhancement):**
```css
.ts-element { color: #6ea3db; }
@media (color-gamut: p3) { .ts-element { color: oklch(0.7 0.15 240); } }
```

**color-mix() (supported in all modern browsers):**
```css
button:hover { background: color-mix(in oklab, #0088cc, black 20%); }
:root {
  --ts-accent: #6366f1;
  --ts-accent-dark: color-mix(in oklab, var(--ts-brand), black 70%);
  --ts-accent-light: color-mix(in oklab, var(--ts-brand), white 85%);
}
```

**Relative color syntax (Chrome 119+, Safari 16.4+, Firefox 128+):**
```css
:root { --ts-brand: oklch(56.6% 0.27 274); }
.ts-light { color: oklch(from var(--ts-brand) calc(l * 1.25) c h); }
.ts-dark  { color: oklch(from var(--ts-brand) calc(l * 0.9) c h); }
.ts-muted   { color: oklch(from var(--ts-brand) l calc(c * 0.5) h); }
.ts-alt { color: oklch(from var(--ts-brand) l c calc(h + 180)); }
```

**Generate tint/shade scale from single OKLCH variable:**
```css
:root {
  --ts-primary: oklch(56.6% 0.27 274);
  --ts-primary-50:  oklch(from var(--ts-primary) 97% calc(c * 0.04) h);
  --ts-primary-100: oklch(from var(--ts-primary) 93% calc(c * 0.08) h);
  --ts-primary-200: oklch(from var(--ts-primary) 85% calc(c * 0.22) h);
  --ts-primary-300: oklch(from var(--ts-primary) 75% calc(c * 0.37) h);
  --ts-primary-400: oklch(from var(--ts-primary) 65% calc(c * 0.56) h);
  --ts-primary-500: oklch(from var(--ts-primary) 55% calc(c * 0.74) h);
  --ts-primary-600: oklch(from var(--ts-primary) 47% calc(c * 0.67) h);
  --ts-primary-700: oklch(from var(--ts-primary) 40% calc(c * 0.59) h);
  --ts-primary-800: oklch(from var(--ts-primary) 32% calc(c * 0.48) h);
  --ts-primary-900: oklch(from var(--ts-primary) 24% calc(c * 0.37) h);
  --ts-primary-950: oklch(from var(--primary) 18% calc(c * 0.30) h);
}
```

### 3.4 Palette generation tools

- **Huetone** (huetone.ardov.me): OKLCH-based, shows APCA contrast for every combination
- **Leonardo** (leonardocolor.io, Adobe): Contrast-ratio-first approach, CIECAM02/LCH
- **Radix Colors:** 12-step semantic scales (Steps 1–2: backgrounds, 3–5: interactive, 6–8: borders, 9–10: solid, 11–12: text)
- **Atmos** (atmos.style): OKLCH palette generator with curve controls, CSS/Figma export

### 3.5 Color psychology for brands

| Color | Associations | Brand Examples |
|-------|-------------|----------------|
| Blue | Trust, stability, professionalism | Facebook, LinkedIn, PayPal |
| Red | Energy, passion, urgency | Coca-Cola, YouTube, Netflix |
| Green | Growth, nature, health | Spotify, Whole Foods |
| Yellow | Optimism, warmth | McDonald's, Snapchat |
| Purple | Luxury, creativity | Cadbury, Twitch |
| Orange | Friendliness, action (CTAs) | Amazon, Firefox |
| Black | Elegance, power | Chanel, Nike |

**60-30-10 rule:** Primary 60%, secondary 30%, accent 10%.

**Cultural caveat:** Perceived appropriateness to brand personality matters more than universal meanings. White = purity (Western), mourning (some East Asian). Red = luck (China), danger (Western).

### 3.6 Dark/light mode token strategy

```css
:root {
  --bg-primary: var(--gray-50);
  --bg-surface: var(--white);
  --text-primary: var(--gray-900);
  --text-secondary: var(--gray-600);
  --accent-default: var(--blue-600);
}
.dark {
  --bg-primary: var(--gray-900);
  --bg-surface: var(--gray-800);
  --text-primary: var(--gray-50);
  --text-secondary: var(--gray-300);
  --accent-default: var(--blue-400);
}
```

**Dark mode rules:**
- Avoid pure black (#000): use dark grays (oklch(0.15 0 0) or #1a1a1a)
- Avoid pure white text: use off-white (oklch(0.93 0 0))
- Desaturate accent colors on dark backgrounds
- Surface layering: base → raised → overlay via subtle luminance steps
- Material Design: high-emphasis text 87% opacity, medium 60%, disabled 38%

### 3.7 Gradients

**OKLCH gradients (smoother, no muddy midpoints):**
```css
.hero { background: linear-gradient(in oklch, oklch(70% 0.15 240), oklch(50% 0.15 30)); }
.rainbow { background: linear-gradient(in oklch longer hue, blue, red); }
```

**Mesh/aurora gradient (CSS only):**
```css
.aurora {
  background-color: oklch(0.15 0.02 260);
  background-image:
    radial-gradient(at 0% 100%, oklch(0.5 0.2 280 / 0.6), transparent 50%),
    radial-gradient(at 100% 0%, oklch(0.6 0.15 180 / 0.5), transparent 50%),
    radial-gradient(at 50% 50%, oklch(0.55 0.18 330 / 0.4), transparent 60%);
  filter: blur(100px);
}
```

Use `in oklch` for multi-hue gradients; `in oklab` for same-hue lightness transitions.

---

## 6. UI/UX DESIGN BEST PRACTICES (2025–2026)

### 6.1 Current UI trends

- **Bento grids:** Modular multi-block layouts replacing carousels (only ~1% click rate on carousels)
- **AI-native interfaces:** AI as copilot in sidebars/overlays, not autopilot. Transparency and control are critical.
- **Spatial design:** Apple Vision Pro influence. Depth, parallax, interfaces that "feel alive."
- **Dark mode as default:** Plan dark-first, light as alternative.
- **Kinetic typography:** Headlines that stretch, shift, respond to scroll/hover.
- **Neobrutalism:** Visual audacity, interfaces that feel crafted not templated.
- **Neumorphism:** Soft, realistic UI for key touchpoints only.

### 6.2 Motion design specifications

**Duration guidelines:**

| Category | Duration | Examples |
|----------|----------|---------|
| Micro/Quick | 100–200ms | Button states, toggles, hover |
| Standard | 200–300ms | Dropdowns, cards, most transitions |
| Complex | 300–500ms | Full-screen, page-level |

**Critical threshold:** Users expect feedback within 100ms. Animations >400ms feel sluggish.

**Easing curves (Material Design):**

| Curve | CSS | Use |
|-------|-----|-----|
| Standard | `cubic-bezier(0.4, 0, 0.2, 1)` | Element visible throughout |
| Deceleration | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering (modals, dropdowns) |
| Acceleration | `cubic-bezier(0.4, 0, 1, 1)` | Elements exiting |

**Ease-out is most recommended for UI** (feels responsive, eye has time to focus).

**Always respect reduced motion:**
```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

### 6.3 Accessibility (WCAG 2.2, published Oct 2023)

**Key new requirements:**
- **Focus Not Obscured (AA):** Focused element must be at least partially visible
- **Dragging Movements (AA):** All drag operations need single-pointer alternative
- **Target Size Minimum (AA):** Touch targets ≥24×24 CSS px
- **Accessible Authentication (AA):** No cognitive function tests required
- **Redundant Entry (A):** Don't require re-entering previously provided info

**Touch target sizes:**

| Standard | Minimum |
|----------|---------|
| WCAG 2.2 AA | 24×24 CSS px |
| WCAG 2.1 AAA | 44×44 CSS px |
| Apple HIG | 44×44 pt |
| Material Design | 48×48 dp |
| Spacing | ≥8px between targets |

**Focus indicators:** ≥2px CSS perimeter, ≥3:1 contrast ratio.

**WCAG 3.0:** Working Draft (Sept 2025). Not expected finalized until ~2028–2030. Outcomes-based, graded scoring replaces A/AA/AAA. Continue WCAG 2.2 AA as baseline.

**ARIA patterns:**
- Modal: `role="dialog"`, `aria-modal="true"`, trap focus, return focus on close
- Tabs: `role="tablist"`, `role="tab"`, `aria-selected`, arrow key nav
- Dropdown: `role="menu"`, `aria-expanded`, `aria-haspopup`
- Toast: `role="alert"` or `role="status"`, `aria-live`

### 6.4 Responsive design

**Breakpoints (2025):**
```css
/* Mobile-first: base = mobile portrait (0–479px) */
@media (min-width: 480px)  { /* Mobile landscape */ }
@media (min-width: 768px)  { /* Tablet portrait */ }
@media (min-width: 1024px) { /* Laptop */ }
@media (min-width: 1280px) { /* Desktop */ }
@media (min-width: 1536px) { /* Large desktop / 4K */ }
```

**Three-axis strategy:** Viewport width (media queries) + Container size (container queries) + User environment (pointer, hover, color scheme).

Mobile-first remains standard (70%+ global traffic, Google mobile-first indexing).

### 6.5 Component architecture

**Compound components:** Shared implicit state via Context. Clean API: `<Select><Select.Trigger/><Select.Content/></Select>`.

**Slots pattern:** Named insertion points for content injection. Maximum layout flexibility.

**Component API contract:** Inputs (props, slots, events) → Outputs (rendered UI, emitted events) → Invariants (accessibility, theming, responsive, error states).

**Every component must document:** Default, Hover, Focus, Active, Disabled, Error, Success, Loading states. Plus accessibility notes, composition examples, and anti-patterns.

---

## 7. BRAND & IDENTITY DESIGN

### 7.1 Logo design principles

**Fundamentals:** Simplicity, Memorability, Versatility, Timelessness.

**Logo system (provide all variants):**
- Primary (full detail)
- Secondary/simplified
- Icon-only mark (square/circle)
- Wordmark
- Lettermark/monogram
- Favicon (16×16px)

**Clear space:** Minimum = 1× a recognizable logo element (the "X" unit) on all sides. Recommended = 2×.

**Minimum sizes:** Digital: 20px for wordmarks, 35px for full sign-offs. Print: 0.5 inches.

**File formats required:**

| Format | Type | Best For |
|--------|------|----------|
| SVG | Vector | Web, apps, responsive |
| EPS | Vector | Print production |
| PDF | Vector/Raster | Print, sharing |
| PNG | Raster | Digital (transparency) |
| AI | Vector | Source files |

Always provide: full-color, single-color (black), reversed (white), grayscale.

### 7.2 Logo trends (2025–2026)

- Dynamic/adaptive logos that change by context
- Neo-minimalism with warmth (subtle gradients, softer lines)
- Bold typography-driven logos with custom lettering
- Kinetic/motion logos as primary identifiers
- Co-authored/open logos with customizable spaces
- Circular emblems/badges for trust
- Ultra-chroma hues (electric yellow, chartreuse, YInMn blue)

### 7.3 Brand guideline structure

1. **Brand Foundation:** Mission, vision, values, positioning, audience
2. **Logo Usage:** All versions, clear space, minimum sizes, misuse examples
3. **Color Palette:** Primary (1–3), secondary, functional. HEX, RGB, CMYK, Pantone. WCAG ratios.
4. **Typography System:** Primary + secondary typefaces, type scale, responsive scale, web implementation
5. **Imagery & Photography:** Style direction, lighting, subjects, treatments
6. **Illustration Style:** Flat/3D/line/collage, replicability, stroke weights
7. **Iconography:** Styles, stroke weights, grid, states
8. **Graphic Elements:** Patterns, textures, data visualization
9. **Voice & Tone:** Personality, messaging scenarios, microcopy
10. **Motion/Animation:** Logo animation, UI transitions, easing curves, durations
11. **Layout & Grid:** Column grid, margins, spacing (4px/8px increments)
12. **Digital Applications:** UI components, web rules, social templates
13. **Print Applications:** Stationery, packaging, signage
14. **Legal:** Trademark, copyright, naming

**Platforms:** Frontify (brand hub + DAM), Zeroheight (living docs + design system integration). Both superior to static PDFs.

### 7.4 Visual identity systems

**Photography:** Define lighting, subject matter, saturation, cropping, emotional tone. Keep consistent across all assets.

**Iconography specs:** Uniform stroke weights (e.g., 2px), corner radii, 24×24px grid with 2px padding, SVG format, interaction states.

**Motion identity:** Logo animation behavior, UI transition standards, easing curves, duration tokens.

---

## 8. SOCIAL MEDIA & MARKETING DESIGN

### 8.1 Platform specifications (2025–2026)

**Instagram:**

| Placement | Dimensions | Ratio |
|-----------|-----------|-------|
| Feed Square | 1080×1080 | 1:1 |
| Feed Portrait | 1080×1350 | 4:5 (best engagement) |
| Stories/Reels | 1080×1920 | 9:16 |
| Carousel | 1080×1350 | 4:5 (up to 20 images) |
| Profile Photo | 320×320 | 1:1 circle |

Stories safe area: 1080×1610 (keep 310px clear top and bottom).

**TikTok:**

| Placement | Dimensions | Ratio |
|-----------|-----------|-------|
| Video | 1080×1920 | 9:16 |
| Profile Photo | 200×200 | 1:1 |

**Safe zones (1080×1920):** Top ~130px, Bottom ~320–484px, Right ~140px, Left ~120px. Effective: ~960×1386px centered.

**LinkedIn:**

| Placement | Dimensions | Ratio |
|-----------|-----------|-------|
| Post Landscape | 1200×627 | 1.91:1 |
| Post Square | 1200×1200 | 1:1 |
| Cover Photo | 1584×396 | 4:1 |
| Company Logo | 400×400 | 1:1 |

**X (Twitter):**

| Placement | Dimensions | Ratio |
|-----------|-----------|-------|
| Post Landscape | 1280×720 | 16:9 |
| Post Square | 1080×1080 | 1:1 |
| Header | 1500×500 | 3:1 |
| Profile Photo | 400×400 | 1:1 circle |

**YouTube:**

| Placement | Dimensions | Ratio |
|-----------|-----------|-------|
| Thumbnail | 1280×720 | 16:9 |
| Channel Banner | 2560×1440 | 16:9 (safe: 1235×338) |
| Shorts | 1080×1920 | 9:16 |

**Facebook:**

| Placement | Dimensions | Ratio |
|-----------|-----------|-------|
| Post | 1080×1080 or 1080×1350 | 1:1 or 4:5 |
| Cover Photo | 851×315 | ~2.7:1 |
| Stories | 1080×1920 | 9:16 |
| Event Cover | 1920×1080 | 16:9 |

**Pinterest:** Standard Pin 1000×1500 (2:3). Idea Pin 1080×1920 (9:16).

### 8.2 Universal vertical video safe zone

All platforms (9:16, 1080×1920): Keep critical content within **~900×1400px centered**. Avoid bottom 20% and right edge.

### 8.3 Social media design trends (2025–2026)

- AI-generated imagery in 62% of designer workflows
- Oversized experimental typography as design element
- UGC-style > polished graphics for authenticity
- Carousel storytelling: hook → content → CTA
- Dark mode optimization (80%+ mobile users prefer dark)
- "Analog meets AI": handmade textures with AI precision
- Meme-style marketing for relatability

### 8.4 Print specifications

**Color:** CMYK for all print. RGB for digital only. Pantone for brand-critical spot colors.

**Resolution:** 300 DPI standard print, 150–250 DPI large format (>24"), 72–96 DPI screen only.

**Bleed:** US: 0.125" (1/8"). International: 3mm. Safe margin: 0.125"–0.25" inside trim.

**Rich black:** C:60 M:40 Y:40 K:100 for large areas. C:0 M:0 Y:0 K:100 for small text. Never use registration black (C:100 M:100 Y:100 K:100). Total ink ≤300%.

**File formats:** PDF/X-1a (industry gold standard, flattens transparency), PDF/X-4 (supports live transparency), TIFF (high-quality raster).

**Common sizes:**

| Item | US Size | Metric |
|------|---------|--------|
| Business Card | 3.5"×2" | 85×55mm |
| A4 | 8.3"×11.7" | 210×297mm |
| Letter | 8.5"×11" | 216×279mm |
| Small Poster | 18"×24" | 457×610mm |

### 8.5 Marketing collateral specs

**Email:** 600px width (max 640px). 16–18px body font. Hero in first 300–500px. Total HTML <102KB (Gmail clipping). Retina: 2× resolution images.

**IAB banner ads:**

| Unit | Size |
|------|------|
| Medium Rectangle | 300×250 |
| Leaderboard | 728×90 |
| Wide Skyscraper | 160×600 |
| Half-Page | 300×600 |
| Mobile Leaderboard | 320×50 |
| Large Mobile Banner | 320×100 |
| Billboard | 970×250 |

**Presentations:** 1920×1080 (16:9 standard). 3840×2160 (4K) for large displays.

---

## 9. AWARD-WINNING DESIGN

### 9.1 Awwwards criteria

| Criterion | Weight | Focus |
|-----------|--------|-------|
| Design | 40% | Hierarchy, typography, color, micro-details, consistency |
| Usability | 30% | Navigation (<3s), performance (60fps), responsive, accessibility, Core Web Vitals |
| Creativity | 20% | Original concepts, innovation, fresh approaches |
| Content | 10% | Quality, relevance, integration |

Honorable Mention ≥6.5. Most common failure: usability, not creativity.

### 9.2 Key techniques in award-winning sites

**GSAP + ScrollTrigger:** Dominant animation library. Scroll-driven narratives, pin sections, progress-based reveals.

**Three.js / WebGL:** 3D product showcases, immersive environments, shader effects. Studios with WebGL capability dominate winners.

**Smooth scrolling:** Lenis, GSAP ScrollSmoother. Creates cinematic feel essential for scroll-triggered animations.

**Custom cursors:** Scale, shape, blend mode changes on hover. Part of micro-detail scoring.

**Typography-driven layouts:** Variable font animations, oversized type, split-text animations.

**Page transitions:** Barba.js for seamless multi-page transitions.

### 9.3 Luxury/editorial web design

- **White space** is the primary design tool
- Serif typography for headings (Didot, Bodoni, custom)
- Full-screen high-quality imagery (never stock)
- Subtle motion builds environment, not spectacle
- Magazine-like layouts with editorial content
- Sticky navigation stays thin and subtle
- First contentful paint <3 seconds despite heavy imagery
- Black, white, gold, navy dominate palettes
- Limit to 2–3 colors
- Navigation: "Ready-to-Wear" not "Clothes"

---
