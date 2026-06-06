# 02 · Typography — The 1.200 Ladder, Pairings, and Hierarchy

> Every type decision in Toolskin resolves through this file. No font picked from
> memory. No size off-ladder. No line-height invented.

---

## 1 · The locked 1.200 ladder (minor third)

Why 1.200: dense enough for editorial and dashboards, open enough for marketing.
Major third (1.250) is too operatic for body-heavy UI; major second (1.125) is too
subtle for hierarchy.

```css
--ts-fs-base: 16px;
--ts-fs-ratio: 1.200;

--ts-fs--2: calc(var(--ts-fs-base) / var(--ts-fs-ratio) / var(--ts-fs-ratio)); /* 11.11px */
--ts-fs--1: calc(var(--ts-fs-base) / var(--ts-fs-ratio));                      /* 13.33px */
--ts-fs-0:  var(--ts-fs-base);                                                  /* 16.00px */
--ts-fs-1:  calc(var(--ts-fs-base) * var(--ts-fs-ratio));                      /* 19.20px */
--ts-fs-2:  calc(var(--ts-fs-1)    * var(--ts-fs-ratio));                      /* 23.04px */
--ts-fs-3:  calc(var(--ts-fs-2)    * var(--ts-fs-ratio));                      /* 27.65px */
--ts-fs-4:  calc(var(--ts-fs-3)    * var(--ts-fs-ratio));                      /* 33.18px */
--ts-fs-5:  calc(var(--ts-fs-4)    * var(--ts-fs-ratio));                      /* 39.81px */
--ts-fs-6:  calc(var(--ts-fs-5)    * var(--ts-fs-ratio));                      /* 47.78px */
--ts-fs-7:  calc(var(--ts-fs-6)    * var(--ts-fs-ratio));                      /* 57.33px */
--ts-fs-8:  calc(var(--ts-fs-7)    * var(--ts-fs-ratio));                      /* 68.80px */
--ts-fs-9:  calc(var(--ts-fs-8)    * var(--ts-fs-ratio));                      /* 82.55px */
```

### 1.1 Role mapping (use these, not raw steps)

```css
--ts-fs-micro:    var(--ts-fs--2);   /* 11px — overlines, legal */
--ts-fs-caption:  var(--ts-fs--1);   /* 13px — meta, helpers */
--ts-fs-body:     var(--ts-fs-0);    /* 16px — paragraph */
--ts-fs-lead:     var(--ts-fs-1);    /* 19px — subtitle / intro */
--ts-fs-h5:       var(--ts-fs-2);    /* 23px */
--ts-fs-h4:       var(--ts-fs-3);    /* 28px */
--ts-fs-h3:       var(--ts-fs-4);    /* 33px */
--ts-fs-h2:       var(--ts-fs-5);    /* 40px */
--ts-fs-h1:       var(--ts-fs-6);    /* 48px */
--ts-fs-display:  clamp(var(--ts-fs-6), 4vw + 1rem, var(--ts-fs-8));  /* 48→69px */
--ts-fs-hero:     clamp(var(--ts-fs-7), 8vw + 1rem, var(--ts-fs-9));  /* 57→83px */
```

### 1.2 Line-height by role (the locked pairs)

```css
--ts-lh-tight:    0.92;   /* hero only (step 9) */
--ts-lh-display:  1.05;   /* display (steps 7-8) */
--ts-lh-headline: 1.15;   /* h1-h2 (steps 5-6) */
--ts-lh-snug:     1.3;    /* h3-h5 (steps 2-4) */
--ts-lh-normal:   1.5;    /* body, lead */
--ts-lh-loose:    1.65;   /* long-form prose, blockquotes */
```

| Step | Line-height | Why |
|---:|---|---|
| 9 | 0.92–1.0 | Massive type stacks need negative leading to look unified |
| 7-8 | 1.05 | Display reads as one shape, not a paragraph |
| 5-6 | 1.15 | Two-line headlines need enough air without floating apart |
| 3-4 | 1.25–1.3 | Card titles, subheads; readable in tight contexts |
| 0-2 | 1.45–1.5 | Body; 1.5 is the ideal reading rhythm |
| -2/-1 | 1.4 | Small text gets slightly tighter; 1.5 looks loose |

### 1.3 Letter-spacing (the locked pairs)

```css
--ts-tracking-tightest:  -0.04em;   /* hero (step 9) */
--ts-tracking-tighter:   -0.025em;  /* display (steps 7-8) */
--ts-tracking-tight:     -0.015em;  /* h1-h3 (steps 4-6) */
--ts-tracking-snug:      -0.005em;  /* h4-h5 (steps 2-3) */
--ts-tracking-normal:     0;        /* body, lead */
--ts-tracking-wide:       0.02em;   /* captions (step -1) */
--ts-tracking-wider:      0.08em;   /* overlines (step -2 UPPERCASE) */
--ts-tracking-widest:     0.16em;   /* tiny labels in cards */
```

**Negative tracking is mandatory at sizes ≥ 33px.** Without it, type at scale looks
spaced-out and amateur.

---

## 2 · Heading fonts (display) — pick by mood

| Font | Mood | Source | Pair with body |
|---|---|---|---|
| **Clash Display** ★ default | Confident tech, neo-grotesk | Fontshare | Space Grotesk |
| **Cabinet Grotesk** | Friendly modern | Fontshare | General Sans |
| **Bricolage Grotesque** | Editorial-poster, brutalist | Google Fonts | Switzer |
| **Instrument Serif** | Editorial, luxury, magazine | Google Fonts | Source Serif 4 |
| **Fraunces** | Quirky-warm display serif | Google Fonts | Newsreader |
| **Syne** | Futuristic, art-deco | Google Fonts | Inter (light only) |
| **Unbounded** | Web3 / experimental | Google Fonts | Switzer |
| **Playfair Display** | Classical luxury (display ONLY) | Google Fonts | Lora |
| **Space Grotesk** | Engineering / neutral | Google Fonts | Space Grotesk (single-family) |
| **DM Serif Display** | Editorial classical | Google Fonts | DM Sans |

**Banned defaults:** Inter, Roboto, Arial, system-ui, sans-serif. These are *fallbacks*,
not *choices*. Pick from above.

---

## 3 · Body fonts — pick by reading load

| Font | Best for | Source | x-height | Notes |
|---|---|---|---|---|
| **Space Grotesk** ★ default | UI, dashboards, dev tools | Google Fonts | Tall | The Toolskin anchor |
| **General Sans** | Marketing, friendly SaaS | Fontshare | Medium | Modern rationalist |
| **Switzer** | "Free Helvetica," editorial | Fontshare | Tall | 18 styles |
| **Geist** | Dev tools, tech | Google Fonts | Tall | Vercel-clean |
| **Source Serif 4** | Long-form, articles | Google Fonts | Medium | Pairs Source Sans |
| **Newsreader** | Magazine, blog | Google Fonts | Tall | 42 styles, screen-tuned |
| **Lora** | Editorial body | Google Fonts | Medium | Calligraphic warmth |

**Body rule:** 16px minimum (step 0). 18px on landing pages with sparse content
(step 1). Below 16 only for `caption` / `micro` roles.

**Reading length:** body text gets `max-width: 65ch` (≈ 600px). Wider is faster
to skim but harder to read. Use `max-width: 80ch` only for dashboards.

---

## 4 · Mono fonts — when there is code or data

```css
--ts-font-mono: "JetBrains Mono", "Space Mono", "Fira Code", ui-monospace, monospace;
```

| Font | Use | Source |
|---|---|---|
| **JetBrains Mono** ★ default | Code, terminal | Google Fonts |
| **Space Mono** | Pairs with Space Grotesk (same DNA) | Google Fonts |
| **Geist Mono** | Pairs with Geist | Google Fonts |
| **Fira Code** | Heavy ligature use | Google Fonts |
| **Recursive Mono** | One file, sans+mono in one | Google Fonts |

**Rule:** mono only when there is real code, hashes, or columnar numeric data.
Don't use mono "for vibe" — it always reads as terminal.

---

## 5 · Loading strategy

```html
<!-- In <head>, RENDER-BLOCKING (Toolskin anchor) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style"
      href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&family=Clash+Display:wght@400..700&family=JetBrains+Mono:wght@400..700&display=swap">
<link rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&family=Clash+Display:wght@400..700&family=JetBrains+Mono:wght@400..700&display=swap">
```

```css
@font-face {
  font-family: 'Space Grotesk';
  font-display: swap;          /* swap for most cases; optional for best CWV */
  font-weight: 300 700;        /* variable range, one file */
}
```

**Self-host** when possible (`.woff2` only). Preload the body font; let display
swap in. Maximum 2 families loaded at once.

---

## 6 · Decision tree: "Which type step for THIS element?"

```
Is it the page hero (one screen, one element)?
├─ YES → step 7-9 (--ts-fs-hero, clamp 57→83px)
└─ NO  → continue

Is it a section title (above an aside / below nav)?
├─ YES → step 5-6 (--ts-fs-h1 or h2)
└─ NO  → continue

Is it the title of a card / panel / list item?
├─ YES → step 3-4 (--ts-fs-h3 or h4)
└─ NO  → continue

Is it a subtitle / lead paragraph?
├─ YES → step 1 (--ts-fs-lead, 19px)
└─ NO  → continue

Is it the actual reading text?
├─ YES → step 0 (--ts-fs-body, 16px)
└─ NO  → continue

Is it metadata, helper text, timestamp?
├─ YES → step -1 (--ts-fs-caption, 13px)
└─ NO  → continue

Is it an overline / category / kicker (UPPERCASE)?
└─ step -2 + UPPERCASE + tracking +0.08em
```

---

## 7 · Hierarchy patterns (the three canonical compositions)

### 7.1 The classical (display + body)
```
DISPLAY (step 8, 69px, weight 700, tracking -0.025em, lh 1.05)
↓ gap 24px
Lead paragraph (step 1, 19px, weight 400, tracking 0, lh 1.45)
↓ gap 32px
Two CTAs side-by-side
```

### 7.2 The editorial (overline + headline + body)
```
OVERLINE (step -2, 11px, weight 600, UPPERCASE, tracking +0.08em, color: --ts-text-secondary)
↓ gap 12px
Headline (step 5, 40px, weight 600, tracking -0.02em, lh 1.15)
↓ gap 20px
Body (step 0, 16px, weight 400, lh 1.6, max-width 65ch)
```

### 7.3 The dashboard (eyebrow + metric + delta)
```
Eyebrow (step -1, 13px, weight 500, color: --ts-text-secondary)
↓ gap 8px
Metric (step 5, 40px, weight 700, mono numerals, tracking -0.02em)
↓ gap 4px
Delta (step -1, 13px, weight 500, color: success/danger)
```

---

## 8 · Hierarchy rule (the meta-rule)

**Hierarchy comes from contrast, not from variety.**

- 2 type sizes + 2 weights ≥ 6 type sizes + 1 weight
- 1 family + weight contrast ≥ 3 families
- Color contrast ≥ size contrast for short labels
- White space contrast ≥ all of the above for sections

If a layout feels flat: don't add a font, increase the size delta between primary
and secondary text by one step. If it still feels flat: increase the weight delta
(400 → 700, not 400 → 500). If still flat: increase whitespace around the primary
element by 2× before touching anything else.

---

## 9 · Anti-patterns (forbidden)

- ❌ More than 2 type families on one page (mono is a third only when justified).
- ❌ Headlines at 1.5 line-height (looks like a paragraph).
- ❌ Body at 1.2 line-height (unreadable).
- ❌ Positive letter-spacing on display type (looks decorative).
- ❌ Bold + italic + underline on the same word.
- ❌ All-caps body text (reduces reading speed 13–20%).
- ❌ Justified text on the web (rivers — use `text-align: left`).
- ❌ `font-size: 12px` for anything a user must read (caption floor is 13px).
- ❌ Sentence-case overlines (overlines are UPPERCASE).
- ❌ Color as the ONLY hierarchy signal (also use size or weight).

---

## 10 · Implementation snippet (copy this into a new page)

```css
:root {
  --ts-font-display: 'Clash Display', system-ui, sans-serif;
  --ts-font-body:    'Space Grotesk', system-ui, sans-serif;
  --ts-font-mono:    'JetBrains Mono', ui-monospace, monospace;

  --ts-fs-base: 16px;
  --ts-fs-ratio: 1.2;
}

body {
  font-family: var(--ts-font-body);
  font-size: var(--ts-fs-body);
  line-height: var(--ts-lh-normal);
  color: var(--ts-text-primary);
  text-rendering: optimizeLegibility;
  font-feature-settings: "kern", "liga", "calt";
}

h1, .ts-h1 {
  font-family: var(--ts-font-display);
  font-size: var(--ts-fs-h1);
  line-height: var(--ts-lh-headline);
  letter-spacing: var(--ts-tracking-tight);
  font-weight: 700;
  text-wrap: balance;          /* prevent orphans on multi-line headings */
}

h2, .ts-h2 { font-size: var(--ts-fs-h2); line-height: var(--ts-lh-headline); letter-spacing: var(--ts-tracking-tight); }
h3, .ts-h3 { font-size: var(--ts-fs-h3); line-height: var(--ts-lh-snug);     letter-spacing: var(--ts-tracking-snug); }
h4, .ts-h4 { font-size: var(--ts-fs-h4); line-height: var(--ts-lh-snug); }
h5, .ts-h5 { font-size: var(--ts-fs-h5); line-height: var(--ts-lh-snug); }

p { max-width: 65ch; text-wrap: pretty; }

.ts-overline {
  font-size: var(--ts-fs-micro);
  text-transform: uppercase;
  letter-spacing: var(--ts-tracking-wider);
  font-weight: 600;
  color: var(--ts-text-secondary);
}

.ts-display { font-size: var(--ts-fs-display); line-height: var(--ts-lh-display); letter-spacing: var(--ts-tracking-tighter); }
.ts-hero    { font-size: var(--ts-fs-hero);    line-height: var(--ts-lh-tight);   letter-spacing: var(--ts-tracking-tightest); }
```
