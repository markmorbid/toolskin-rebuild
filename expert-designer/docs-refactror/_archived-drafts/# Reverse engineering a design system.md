# How to Reverse Engineer Any Website's Design System

# How to Reverse Engineer Any Website's Design System

[![Yahia Bakour](/_next/image?url=%2Fblog%2Fyahia.jpg&w=96&q=75&dpl=dpl_4azViMnwMeuauRR8joP23KweoVKK)

Yahia Bakour

@mynameisyahia

](https://twitter.com/mynameisyahia)·Apr 4, 2026

**Reverse engineering a design system** used to mean weeks of painstaking manual work: inspecting elements one by one, screenshotting color pickers, copying `font-family` declarations from computed styles, and building spreadsheets of spacing values. Designers did it to study competitors. Developers did it to replicate proven patterns. Agencies did it before every pitch.

Now you can do it with a single API call.

This guide walks through the complete process of extracting a design system from any live website — manually and programmatically — and explains why automation has become the only practical approach at scale.

## What Is a Design System, Really?

Before extracting one, it helps to define what we're after. A design system is more than a color palette. It's the complete set of **design decisions** that govern how a product looks and behaves:

-   **Colors** — primary, secondary, accent, background, text, and semantic colors (success, warning, error)
-   **Typography** — font families, size scales, weights, line heights, and letter spacing for each heading level and body text
-   **Spacing** — the mathematical scale that controls padding, margins, and gaps (often based on a 4px or 8px grid)
-   **Shadows** — elevation system from subtle card shadows to prominent modal overlays
-   **Border radii** — the spectrum from sharp corners to fully rounded elements
-   **Components** — buttons, cards, inputs, and other UI primitives with their specific styling rules

Companies like Airbnb, Stripe, and Shopify invest millions building these systems. The decisions encoded in them represent years of user research, A/B testing, and iteration. When you reverse engineer a design system, you're extracting that accumulated knowledge.

## The Manual Approach (And Why It Breaks Down)

Let's start with how people have traditionally done this. Understanding the manual process makes it clear why automation matters.

### Step 1: Open DevTools and Start Inspecting

The classic workflow begins with right-clicking an element and selecting "Inspect." From the Computed tab in Chrome DevTools, you can read every CSS property applied to an element:

Copy

    /* What you'd manually copy from inspecting Stripe's h1 */
    font-family:
    	'Inter',
    	-apple-system,
    	BlinkMacSystemFont,
    	sans-serif;
    font-size: 48px;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.02em;
    color: #0a2540;

Repeat this for every heading level, body text, captions, and labels. Then move on to buttons, cards, navigation items, and footer elements. For a typical marketing site, you're looking at 50-100 unique element inspections.

### Step 2: Extract Colors From Stylesheets

Colors are scattered across CSS files, inline styles, and CSS custom properties. A thorough extraction requires:

1.  Reading every stylesheet linked in the `<head>`
2.  Parsing CSS custom properties (`:root { --primary: #635bff; }`)
3.  Deduplicating similar colors (is `#0a2540` and `rgb(10, 37, 64)` the same? Yes.)
4.  Categorizing colors by role (which is primary? which is accent?)

This alone can take hours for a complex site.

### Step 3: Map the Spacing Scale

Spacing is the hardest to extract manually. You need to measure padding and margin values across dozens of elements, then identify the underlying scale. Is the site using a 4px base? 8px? A custom Fibonacci-like progression?

    /* Typical spacing scale you might discover */
    4px → 8px → 12px → 16px → 24px → 32px → 48px → 64px
    

Finding this pattern requires analyzing enough elements to see the repetition — and enough experience to distinguish intentional values from one-off overrides.

### Step 4: Document Component Patterns

Finally, you'd catalog how these tokens combine into components. A primary button might use:

-   Background: primary color
-   Text: white
-   Padding: 12px 24px
-   Border radius: 8px
-   Font weight: 600
-   Shadow: 0 1px 2px rgba(0,0,0,0.05)

Multiply this by every component variant (secondary buttons, outline buttons, ghost buttons, disabled states) and you begin to understand the scope of the problem.

### Why Manual Extraction Fails at Scale

The manual approach has three fundamental problems:

1.  **Time** — A thorough extraction takes 8-20 hours per website. If you're benchmarking five competitors, that's a full work week.
2.  **Accuracy** — Human inspectors miss edge cases. Computed styles can differ from authored styles. Responsive breakpoints change values.
3.  **Staleness** — Websites update constantly. Your manually extracted system is outdated the moment the site ships a new deploy.

For a one-time analysis of a single page, manual inspection works fine. For anything beyond that, you need automation.

## Automating Design System Extraction

There are several approaches to automating this process, ranging from browser extensions to full API solutions.

### Browser Extensions

Tools like CSS Peeper and WhatFont solve narrow problems well. CSS Peeper extracts colors and assets from a page. WhatFont identifies typefaces on hover. But they share a limitation: they operate on the current viewport only, require manual interaction, and can't be integrated into workflows.

### Custom Scripts

A more powerful approach is writing your own extraction scripts. Using Puppeteer or Playwright, you can programmatically load a page and query computed styles:

Copy

    const puppeteer = require('puppeteer');
     
    async function extractColors(url) {
    	const browser = await puppeteer.launch();
    	const page = await browser.newPage();
    	await page.goto(url);
     
    	const colors = await page.evaluate(() => {
    		const elements = document.querySelectorAll('*');
    		const colorSet = new Set();
     
    		elements.forEach((el) => {
    			const styles = window.getComputedStyle(el);
    			colorSet.add(styles.color);
    			colorSet.add(styles.backgroundColor);
    			colorSet.add(styles.borderColor);
    		});
     
    		return [...colorSet];
    	});
     
    	await browser.close();
    	return colors;
    }

This gets you raw data, but not a design system. You still need to:

-   Deduplicate and normalize color formats
-   Filter out transparent, inherit, and browser defaults
-   Classify colors by role (primary vs. background vs. text)
-   Extract and correlate typography scales
-   Identify the spacing system
-   Map component-level patterns

Building all of this yourself is a significant engineering project — one that needs to handle edge cases like web fonts loading asynchronously, CSS-in-JS frameworks, shadow DOM encapsulation, and responsive style variations.

### The API Approach: Context.dev Styleguide Extraction

This is where [Context.dev](https://www.context.dev/) comes in. The Styleguide API handles the entire extraction pipeline — rendering, parsing, classification, and structuring — and returns a complete design system as structured JSON.

A single call extracts everything:

Copy

    import ContextDev from 'context-dev';
     
    const client = new ContextDev({ apiKey: 'your-api-key' });
     
    const result = await client.style.extractStyleguide({
    	domain: 'stripe.com',
    });
     
    console.log(result.styleguide);

The response contains the full design system, organized into actionable categories:

Copy

    {
    	"status": "ok",
    	"styleguide": {
    		"colors": {
    			"primary": "#635bff",
    			"secondary": "#0a2540",
    			"accent": "#00d4aa",
    			"background": "#ffffff",
    			"text": "#0a2540"
    		},
    		"typography": {
    			"headings": {
    				"h1": {
    					"fontFamily": "Inter",
    					"fontSize": "48px",
    					"fontWeight": "700",
    					"lineHeight": "1.2",
    					"letterSpacing": "-0.02em"
    				},
    				"h2": {
    					"fontFamily": "Inter",
    					"fontSize": "36px",
    					"fontWeight": "600",
    					"lineHeight": "1.3",
    					"letterSpacing": "-0.01em"
    				},
    				"h3": {
    					"fontFamily": "Inter",
    					"fontSize": "24px",
    					"fontWeight": "600",
    					"lineHeight": "1.4",
    					"letterSpacing": "0"
    				}
    			},
    			"p": {
    				"fontFamily": "Inter",
    				"fontSize": "16px",
    				"fontWeight": "400",
    				"lineHeight": "1.6",
    				"letterSpacing": "0"
    			}
    		},
    		"elementSpacing": {
    			"xs": "4px",
    			"sm": "8px",
    			"md": "16px",
    			"lg": "24px",
    			"xl": "48px"
    		},
    		"shadows": {
    			"sm": "0 1px 2px rgba(0,0,0,0.05)",
    			"md": "0 4px 6px rgba(0,0,0,0.07)",
    			"lg": "0 10px 15px rgba(0,0,0,0.1)",
    			"xl": "0 20px 25px rgba(0,0,0,0.15)"
    		},
    		"components": {
    			"button": {
    				"primary": {
    					"backgroundColor": "#635bff",
    					"color": "#ffffff",
    					"borderRadius": "8px",
    					"padding": "12px 24px",
    					"fontSize": "16px",
    					"fontWeight": "600"
    				},
    				"secondary": {
    					"backgroundColor": "transparent",
    					"color": "#635bff",
    					"borderColor": "#635bff",
    					"borderRadius": "8px",
    					"borderWidth": "1px"
    				}
    			},
    			"card": {
    				"backgroundColor": "#ffffff",
    				"borderRadius": "12px",
    				"padding": "24px",
    				"boxShadow": "0 4px 6px rgba(0,0,0,0.07)"
    			}
    		},
    		"mode": "light"
    	},
    	"code": 200
    }

This isn't just raw CSS values dumped into JSON. The API performs intelligent classification — it determines which color serves as the primary brand color versus the background, identifies the typographic hierarchy across heading levels, and extracts the spacing scale that actually governs the layout.

## What You Can Do With an Extracted Design System

Having a design system in structured JSON unlocks workflows that manual extraction can't support.

### Competitive Analysis at Scale

Extract design systems from every competitor in your space and compare them programmatically:

Copy

    const competitors = ['stripe.com', 'square.com', 'braintreepayments.com', 'adyen.com'];
     
    const systems = await Promise.all(competitors.map((domain) => client.style.extractStyleguide({ domain })));
     
    // Compare primary colors, typography choices, spacing patterns
    systems.forEach((result, i) => {
    	const { colors, typography } = result.styleguide;
    	console.log(`${competitors[i]}: Primary=${colors.primary}, Font=${typography.headings.h1.fontFamily}`);
    });

In under a minute, you have a complete competitive landscape of design decisions. Which competitors use serif vs. sans-serif headings? Who has the tightest spacing scale? What's the most common border radius in your industry? These questions become trivially answerable.

### Automated Brand Monitoring

Design systems change. Companies rebrand, update their UI frameworks, or gradually drift from their own guidelines. Set up a scheduled extraction to track changes over time:

Copy

    from context_dev import ContextDev
    import json
    from datetime import datetime
     
    client = ContextDev(api_key="your-api-key")
     
    result = client.style.extract_styleguide(domain="yourcompany.com")
     
    snapshot = {
        "date": datetime.now().isoformat(),
        "styleguide": result.styleguide
    }
     
    with open(f"snapshots/{datetime.now().strftime('%Y-%m-%d')}.json", "w") as f:
        json.dump(snapshot, f)

Compare snapshots to detect drift. Alert when a primary color changes. Track typography evolution across quarters.

### Design System Bootstrapping

Starting a new project? Instead of building a design system from scratch, extract one from a site you admire and use it as a foundation:

Copy

    const inspiration = await client.style.extractStyleguide({
    	domain: 'linear.app',
    });
     
    const { colors, typography, elementSpacing, shadows } = inspiration.styleguide;
     
    // Generate CSS custom properties
    const cssVariables = `
    :root {
      --color-primary: ${colors.primary};
      --color-background: ${colors.background};
      --color-text: ${colors.text};
      --font-heading: ${typography.headings.h1.fontFamily};
      --font-body: ${typography.p.fontFamily};
      --spacing-xs: ${elementSpacing.xs};
      --spacing-sm: ${elementSpacing.sm};
      --spacing-md: ${elementSpacing.md};
      --spacing-lg: ${elementSpacing.lg};
      --spacing-xl: ${elementSpacing.xl};
      --shadow-sm: ${shadows.sm};
      --shadow-md: ${shadows.md};
      --shadow-lg: ${shadows.lg};
    }
    `;

You're not copying the design — you're using proven proportions and relationships as a starting point, then adapting colors and specifics to your own brand.

### White-Label Product Theming

If you build products that need to match client branding, automated extraction eliminates the back-and-forth of asking clients for their brand guidelines (which they often can't find or don't have):

Copy

    async function generateClientTheme(clientDomain) {
    	const { styleguide } = await client.style.extractStyleguide({
    		domain: clientDomain,
    	});
     
    	return {
    		primaryColor: styleguide.colors.primary,
    		backgroundColor: styleguide.colors.background,
    		textColor: styleguide.colors.text,
    		fontFamily: styleguide.typography.p.fontFamily,
    		headingFont: styleguide.typography.headings.h1.fontFamily,
    		borderRadius: styleguide.components.card.borderRadius,
    		spacing: styleguide.elementSpacing,
    	};
    }
     
    // Onboard a new client in seconds
    const theme = await generateClientTheme('newclient.com');
    applyTheme(theme);

This is particularly powerful for SaaS platforms, CRM systems, and any product that serves multiple brands. Instead of manually building themes for each client, you extract them on the fly.

### Agency Pitch Preparation

Before pitching a redesign, agencies need to understand the client's current design system intimately. Automated extraction provides a complete, accurate baseline in seconds. Pair it with the [Context.dev Font API](https://www.context.dev/data/font-api) to identify every typeface in use, and you walk into the pitch with deeper knowledge of the client's design than they have themselves.

## Combining With Other Data Points

The Styleguide API becomes even more powerful when combined with other Context.dev endpoints. Extract the full [brand data](https://www.context.dev/) — logos, social links, company description — alongside the design system. Use the [screenshot API](https://www.context.dev/data/company-styleguide-api) to capture visual references. Pull [font data](https://www.context.dev/data/font-api) for detailed typography analysis including font sources and similar alternatives.

Together, these endpoints give you a complete picture of any brand's digital presence — programmatically, accurately, and at any scale you need.

## Handling Edge Cases

Real-world websites aren't always clean. Here's how automated extraction deals with common challenges:

**CSS-in-JS Frameworks** — Sites built with styled-components, Emotion, or Tailwind generate styles at runtime. The Context.dev API renders the page in a full browser environment, so it captures computed styles regardless of how they were authored.

**Web Fonts** — Custom fonts load asynchronously. The extraction process waits for font loading to complete before reading typography values, ensuring you get the actual rendered font rather than a fallback.

**Responsive Design** — A site's typography and spacing change across breakpoints. The API extracts the desktop design system by default, which represents the most complete expression of the design.

**Dark Mode** — Many sites now support both light and dark themes. The API indicates the detected mode in the response, so you know which variant you're working with.

**Single-Page Applications** — SPAs built with React, Vue, or Angular render content dynamically. The extraction process handles JavaScript rendering and waits for the application to reach a stable state before analysis.

## Getting Started

Extracting your first design system takes about two minutes:

1.  **Get an API key** — Sign up at [context.dev](https://www.context.dev/) and grab your key from the dashboard
2.  **Install the SDK** — `npm install context-dev` (also available for [Python](https://docs.context.dev), Ruby, and [Go](https://pkg.go.dev/github.com/context-dot-dev/context-go-sdk))
3.  **Make the call** — Pass any domain and get back structured JSON
4.  **Build on it** — Use the extracted tokens in your design tools, code, or analysis pipeline

You can also test the API directly in the [interactive playground](https://www.context.dev/data/company-styleguide-api) without writing any code.

Copy

    curl -X GET "https://api.context.dev/v1/style/styleguide?domain=stripe.com" \
      -H "Authorization: Bearer YOUR_API_KEY"

The response is the same structured JSON shown above — ready to parse, transform, and integrate into whatever workflow you need.

## Why This Matters Now

Design systems have gone from a nice-to-have to a requirement for any serious digital product. But creating one from scratch is expensive, and understanding existing ones — whether your own or a competitor's — has been unnecessarily manual.

Automated design system extraction changes the economics. What took days now takes seconds. What required a senior designer's trained eye now returns as structured data any developer can work with. And what was a one-time snapshot now becomes a continuous, monitorable data stream.

Whether you're building a competitive analysis tool, a white-label platform, a design system auditor, or simply trying to understand what makes a great website tick — programmatic extraction is the foundation.

The design decisions are already there in the CSS. You just need the right tool to read them.

## Ship an agent that actually knows things.

Free tier, 10-minute integration, and the same API powering agents at Mintlify, daily.dev, and Propane. No credit card to start.

[

Get API Access

](/signup)[

Book a call

](https://cal.com/context-dev/30min)