# Enfold Builder & Self-Learning Reference

> WordPress Enfold ALB shortcodes, markup patterns, CSS bridge to Toolskin,
> self-learning protocols, trend adaptation. Read before WordPress/Enfold tasks.

---

## 12. WORDPRESS + ENFOLD THEME BUILDER

### 12.1 Architecture

Enfold's Advanced Layout Builder (ALB) generates shortcode markup → WordPress renders HTML → CSS styles it.
**Golden rules:**
1. NEVER modify shortcode tag names or break nesting structure
2. ALWAYS close every `[av_*]` tag with its matching `[/av_*]`
3. Start every shortcode on a NEW LINE (WordPress corrupts inline shortcodes)
4. NO same-name nesting (`[av_one_half]` inside `[av_one_half]` = broken)
5. `custom_class='your-class'` is the PRIMARY CSS styling hook
6. Content text goes BETWEEN opening/closing tags, never in attributes
7. First column in a row MUST have `first` attribute

### 12.2 Page structure hierarchy

```
[av_section]                           ← Full-width section (page-level)
  [av_one_half first]                  ← Column (first in row)
    [av_heading]...[/av_heading]       ← Content element
    [av_textblock]...[/av_textblock]
    [av_button]
  [/av_one_half]
  [av_one_half]                        ← Second column
    [av_image]
  [/av_one_half]
[/av_section]
```

### 12.3 Sections — `[av_section]`

```
[av_section min_height='100' min_height_px='500px' padding='huge'
  custom_bg='#0f0f0f'
  background_gradient_direction='radial'
  background_gradient_color1='#131315' background_gradient_color2='#232325'
  src='https://yoursite.com/bg.jpg' attach='fixed' position='center center' repeat='stretch'
  overlay_enable='aviaTBoverlay_enable' overlay_opacity='0.7' overlay_color='#2a2a2d'
  scroll_down='aviaTBscroll_down' custom_arrow_bg='#2efc86'
  id='home' custom_class='snap-section hero-section']
  ...content...
[/av_section]
```

**Key parameters:** `min_height` (viewport %), `padding` (default|no-padding|small|large|huge),
`background_gradient_direction` (vertical|horizontal|radial|diagonal_bt|diagonal_tb),
`attach` (scroll|fixed|parallax), `overlay_enable`/`overlay_opacity`/`overlay_color`.

### 12.4 Columns

| Shortcode | Width | Notes |
|-----------|-------|-------|
| `[av_one_full]` | 100% | Single column |
| `[av_one_half first]` | 50% | Two columns (first must have `first`) |
| `[av_one_third]` | 33.3% | Three columns |
| `[av_two_third]` | 66.6% | Wide + narrow pair |
| `[av_one_fourth]` | 25% | Four columns |
| `[av_three_fourth]` | 75% | Wide + narrow pair |
| `[av_one_fifth]` | 20% | Five columns |

Key params: `vertical_alignment='av-align-middle'`, `min_height='av-equal-height-column'`,
`custom_class`, `padding`, `border`, `border_style`, `border_color`, `radius`.

### 12.5 Content elements

**Headings:**
```
[av_heading heading='Title <b>Highlight</b> Header' tag='h1'
  style='blockquote modern-quote' subheading_active='subheading_above'
  custom_class='hero-heading hero-heading-gradient']
Pre-header text (subheading between tags)
[/av_heading]
```
Use `<b>` inside `heading` attribute for highlight styling. CSS targets `.hero-heading-gradient b`.

**Text blocks:**
```
[av_textblock custom_class='lead-text']
Paragraph content with <strong>inline HTML</strong> supported.
[/av_textblock]
```

**Buttons:**
```
[av_button label='CTA Blue' icon_select='yes-right-icon' icon='paper-plane' font='svg_entypo-fontello'
  link='manually,https://example.com' link_target='_blank' size='large'
  color_options='color_options_advanced' color='custom' custom_bg='#1e82ce' custom_font='#ffffff'
  btn_color_bg='btn_custom_grad' btn_custom_grad_direction='diagonal_tb'
  btn_custom_grad_1='rgba(0,117,206,0.77)' btn_custom_grad_2='rgba(0,117,206,0.96)'
  border='solid' border_width='1px' border_color='rgba(0,107,165,0.92)' border_radius='8px'
  custom_class='telegram']
```

**Button rows (multiple buttons side by side):**
```
[av_buttonrow alignment='left' button_spacing='5' button_spacing_unit='px']
  [av_buttonrow_item label='CTA Color' color_options='color_options_advanced'
    btn_color_bg='btn_custom_grad' btn_custom_grad_1='#b085b2' btn_custom_grad_2='#e228e2'
    border='solid' border_width='1px' border_radius='8px' /]
  [av_buttonrow_item label='CTA Dark'
    btn_custom_grad_1='#111111' btn_custom_grad_2='#3a3a3a'
    border_color='rgba(255,255,255,0.25)' /]
  [av_buttonrow_item label='CTA Transp'
    custom_bg='#0b0b0d80' btn_custom_grad_1='rgba(58,58,58,0.4)' btn_custom_grad_2='rgba(58,58,58,0.4)'
    btn_color_bg_hover='custom' btn_custom_bg_hover='#2efc86' /]
[/av_buttonrow]
```

**Icon lists:**
```
[av_iconlist position='left' custom_class='custom-benefits-list numbered']
  [av_iconlist_item title='Step one' icon='tools' font='svg_entypo-fontello'
    link='manually,https://example.com'][/av_iconlist_item]
  [av_iconlist_item title='Step two' icon='brush' font='svg_entypo-fontello'][/av_iconlist_item]
[/av_iconlist]
```
`numbered` class triggers CSS counter numbering (replaces icons with 01, 02...).

**Icon boxes:**
```
[av_icon_box icon='trophy' font='svg_entypo-fontello'
  title='Feature <b class="hero-heading-gradient">Title</b>'
  position='left' heading_tag='h3' custom_class='stat-header'][/av_icon_box]
```

**Toggles/Accordions:**
```
[av_toggle_container initial='0' mode='accordion' custom_class='custom-toggle']
  [av_toggle title='Question']Answer text.[/av_toggle]
[/av_toggle_container]
```

**Tabs:** `[av_tab_container position='top_tab'][av_tab title='Tab One']Content[/av_tab][/av_tab_container]`

**Separators:** `[av_hr class='invisible' height='50' /]`

**Images:** `[av_image src='url' align='center' hover='av-hover-grow' custom_class='rounded-image']`

### 12.6 Enfold → Toolskin CSS bridge

The `customized.css` maps Enfold's legacy variables to the Toolskin engine:
```css
:root {
  /* TOOLSKIN ENGINE PRIMITIVES — edit these to restyle entire WP site */
  --ts-h: 18;  --ts-s: 100%;  --ts-l: 52%;  /* Accent hue/sat/light */
  --ts-alt-h: 220;  --ts-alt-s: 73%;  --ts-alt-l: 43%;  /* Alt color */
  --ts-bg-base: #141414;  --ts-bg-1: #1c1c1c;  --ts-bg-2: #212121;
  --ts-radius-base: 8px;
  --ts-font-body: 'Raleway', system-ui, sans-serif;

  /* ENFOLD VARIABLES — now powered by Toolskin (do NOT edit these directly) */
  --maincolor:       var(--ts-accent);
  --orange:          var(--ts-accent);
  --orange-2:        var(--ts-alt);
  --altcolor:        var(--ts-alt);
  --darkbg2:         var(--ts-bg-base);
  --darkbg:          var(--ts-bg-2);
  --darkbg-1:        var(--ts-bg-1);
  --border-radius:   var(--ts-radius-md);
  --mainfont:        var(--ts-font-body);
  --titlefont:       var(--ts-font-title);
}
```
Changing `--ts-h` rethemes the ENTIRE WordPress site. All 142+ selector references auto-update.

### 12.7 Common custom_class patterns

| Custom class | Element | Effect |
|-------------|---------|--------|
| `hero-section` | av_section | Full-height hero with gradient background |
| `hero-heading-gradient` | av_heading | Gradient text on `<b>` tags |
| `stat-card` | Column | Card with border and surface |
| `custom-benefits-list` | av_iconlist | Toolskin-styled list |
| `numbered` | av_iconlist | CSS counter numbering instead of icons |
| `custom-toggle` | av_toggle_container | Toolskin-styled accordion |
| `snap-section` | av_section | Scroll-snap alignment |
| `telegram` | av_button | Blue-themed CTA |

### 12.8 All available ALB elements

**Layout:** Grid Row, Color Section, Columns (1/2, 1/3, 2/3, 1/4, 3/4, 1/5, 4/5, 1/1),
Tab Sections, Stretched Layout

**Content:** Heading, Textblock, Icon, Icon Box, Icon List, Button, Button Row,
Separator/Whitespace, Animated Numbers, Animated Countdown, Notification,
Promo Box, Comments, Code Block, Breadcrumbs

**Media:** Image, Image with Hotspots, Video, Gallery, Masonry Gallery,
Fullscreen Slider, Fullwidth Easy Slider, Easy Slider, Featured Image Slider,
Content Slider, Post Slider, Partner/Logo Element

**Interactive:** Accordion, Tabs, Toggle Container, Table, Progress Bar,
Social Share Buttons, Contact Form, MailChimp Signup

**Dynamic:** Blog Post, Portfolio Grid, Masonry, Magazine, Catalogue,
Team Member, Testimonials, Headline Rotator, Fullwidth Sub Menu

**WooCommerce:** Product Grid, Product Slider

### 12.9 Common pitfalls & fixes

| Problem | Cause | Fix |
|---------|-------|-----|
| Layout breaks after paste | Missing closing tag | Verify every `[av_*]` has `[/av_*]` |
| Columns stack instead of row | Missing `first` | Add `first` attribute to first column |
| Same-name nesting breaks | `[av_one_half]` in `[av_one_half]` | Use different column sizes or sections |
| CSS not applying | Wrong specificity | Use `.custom_class .target` or `!important` |
| Colors not matching Toolskin | Hardcoded hex in shortcode | Use CSS variables via custom_class |

---

## 13. SELF-LEARNING & TREND ADAPTATION PROTOCOL

### 13.1 Awwwards reference method

When pursuing award-winning or trend-forward design:
1. **Search** `site:awwwards.com` for current SOTD/SOTM winners in the relevant category
2. **Analyze** winning patterns: scroll behavior, typography scale, color restraint, animation timing
3. **Extract principles** — never copy layouts. Identify the WHY behind each design choice
4. **Synthesize** — Combine observed principles with brand context and Toolskin tokens

### 13.2 Awwwards scoring criteria

| Criterion | Weight | Focus |
|-----------|--------|-------|
| Design | 40% | Hierarchy, typography, color, micro-details, consistency |
| Usability | 30% | Navigation (<3s), performance (60fps), responsive, accessibility |
| Creativity | 20% | Original concepts, innovation, fresh approaches |
| Content | 10% | Quality, relevance, integration |

Honorable Mention ≥6.5. Most common failure: usability, not creativity.

### 13.3 Reference learning workflow

When a client provides reference sites or images:
1. **Inventory** the reference: layout structure, type choices, color count, animation style
2. **Identify** what the client is responding to (usually 1–2 elements, not the whole design)
3. **Abstract** the principle ("they like the oversized serif typography" not "copy this layout")
4. **Implement** using Toolskin tokens and project-appropriate adaptation
5. **Present variants** with CLEAR, LOGICAL differences:
   - Variant A: Closest to reference direction
   - Variant B: Brand-adapted interpretation
   - Variant C: Contrast proposal (shows range of thinking)

### 13.4 Design trend radar (2025–2026)

- Variable font animations tied to scroll position
- "Typography as Hero Image" — type IS the design (COLLINS' Bose identity)
- Bento grids replacing carousels (carousels have ~1% click rate)
- Dark mode as default, light as variant
- Kinetic/morphing typography in headers
- Anti-AI aesthetic: hand-rendered textures, imperfect letterforms, analog warmth
- Condensed bold grotesques for branding
- Ultra-chroma accent colors (electric yellow, chartreuse, YInMn blue)
- Glassmorphism with `backdrop-filter: blur()` on dark surfaces
- CSS scroll-driven animations via `animation-timeline: scroll()`
- "Analog meets AI": handmade textures with AI precision
- Spatial design: Apple Vision Pro influence, depth, parallax
- AI-native interfaces: AI as copilot in sidebars/overlays, not autopilot

### 13.5 Key techniques in award-winning sites

**GSAP + ScrollTrigger:** Dominant animation library. Scroll-driven narratives, pin sections, progress-based reveals.
**Three.js / WebGL:** 3D product showcases, immersive environments, shader effects.
**Smooth scrolling:** Lenis, GSAP ScrollSmoother. Cinematic feel for scroll-triggered animations.
**Custom cursors:** Scale, shape, blend mode changes on hover.
**Typography-driven layouts:** Variable font animations, oversized type, split-text animations.
**Page transitions:** Barba.js for seamless multi-page transitions.

### 13.6 Luxury/editorial web design patterns

- White space as primary design tool
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

## 14. DESIGN DECISION FRAMEWORK (ENHANCED)

For every design decision, apply this hierarchy:

1. **Accessibility first:** Does it meet WCAG 2.2 AA? Contrast, touch targets, focus management.
2. **Content clarity:** Does hierarchy guide the eye? Is the message immediately clear?
3. **Systematic consistency:** Does it use established tokens and patterns? Can it be maintained?
4. **Performance:** Is it fast? Content-visibility, optimized images, efficient animations. <3s FCP.
5. **Aesthetic excellence:** Does it create emotional impact? White space, typography, color.
6. **Innovation:** Does it bring something fresh while serving the above goals?

**When in doubt:** Restraint over excess. Space over clutter. One perfect detail over ten adequate ones.

**Quality standards (every deliverable must meet):**
- WCAG 2.2 AA accessibility (contrast, targets, focus, motion)
- Performance: <3s FCP, <100ms interaction response
- Systematic: Uses design tokens, not hardcoded values
- Responsive: Works from 320px to 2560px without breaking
- Intentional: Every visual element can be justified with a design reason

---

*This skill file synthesizes research from W3C DTCG specification, Material Design 3, IBM Carbon, GitHub Primer, Atlassian Design System, Shopify Polaris, Ant Design, Awwwards, WCAG 2.2/3.0, CSS Color Level 4/5, Tailwind CSS v4, Figma Config/Schema 2025, Adobe MAX 2025, Toolskin v1.0, WordPress Enfold theme patterns, Anthropic frontend-design skill, and authoritative sources across typography, color science, and design systems. Current as of March 2026.*
