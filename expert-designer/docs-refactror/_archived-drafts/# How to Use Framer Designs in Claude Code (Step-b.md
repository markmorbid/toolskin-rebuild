# How to Use Framer Designs in Claude Code (Step-by-Step) | Framer to AI

Guide

# How to use Framer designs in Claude Code

Export from Framer, paste the prompt into Claude Code, and let it integrate pixel-perfect designs directly into your project.

<iframe src="https://www.youtube.com/embed/IXsZSIYvNLI" title="How to Export Framer Components to React Code" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" class="absolute inset-0 w-full h-full"></iframe>

TL;DR

-   Export from Framer with [this Framer plugin](https://www.framer.com/marketplace/plugins/framer-to-ai/), paste the prompt into Claude Code
-   Claude saves the files, integrates them across your project, and verifies the result
-   Best for complex, multi-file integrations where Claude's terminal access shines

## Why Claude Code + Framer to AI?

Claude Code is Anthropic's terminal-based AI coding agent. It has direct access to your file system — it can read files, write code, run commands, and make multi-file changes across your entire project. When you give it a Framer component export with the AI-ready prompt, Claude Code can integrate the component end-to-end without you touching a single file.

## The workflow

1.  **Export from Framer.** Select your component, run the Framer to AI plugin, click Copy Prompt. A self-contained AI prompt copies to your clipboard.
2.  **Open Claude Code and paste.** In your terminal, start Claude Code in your project directory and paste the AI prompt. Claude saves the component files and integrates them for you.
3.  **Tell Claude what to do.** Add instructions like “Add this component to the homepage” or “Replace the hero section with this exported component.”

## Example prompt

After pasting the auto-generated prompt:

```
The prompt above describes a Framer-exported navbar component,
its props, and usage.

Please:
1. Save the component files to components/framer/
2. Replace the existing Navbar in components/Navbar.tsx with this one
3. Update app/layout.tsx to use the new import path
4. Add framer-motion to package.json if it's not already there
5. Run the dev server to verify it works
```

## What makes Claude Code ideal for this

-   **File system access.** Claude Code reads your exported files directly — no need to paste code into chat.
-   **Multi-file editing.** It can update imports, add components, and modify configs in a single pass.
-   **Terminal access.** It can run builds, and verify the integration works.
-   **Project-wide context.** It understands your project structure and matches your conventions.

## Tips for best results

-   **Run Claude Code from your project root.** This gives it full context of your file structure.
-   **Be specific about placement.** Say exactly which file and where to render the component.
-   **Ask it to verify.** Claude Code can run`npm run dev` or `npm run build` to confirm the integration works.
-   **Iterate from there.** Once integrated, ask Claude to customize — connect to APIs, add state management, modify styling.

## More example prompts

The prompt above covers a straightforward swap. Here are three more scenarios you will run into, each with a ready-to-paste prompt you can adapt.

### Replacing an existing component

When you already have a working component and want to swap it for a higher-fidelity Framer export, the key is telling Claude Code about both the old and new files so it can migrate props, event handlers, and any local state.

```
I've exported a new pricing card from Framer into components/framer/PricingCard/.
I already have a PricingCard component at components/PricingCard.tsx.

Please:
1. Read both components and map the existing props to the new export
2. Replace every import of the old PricingCard with the Framer version
3. Carry over the onClick handler and any conditional className logic
4. Delete the old PricingCard.tsx once the new one is wired up
5. Run the dev server and confirm the pricing page still renders
```

### Building a full page from multiple exports

Framer to AI lets you export individual sections — hero, features, testimonials, footer — and assemble them in code. Give Claude Code a single prompt that describes the page order and any shared data each section needs.

```
I've exported four Framer sections into components/framer/:
- HeroSection
- FeatureGrid
- TestimonialCarousel
- FooterCTA

Please:
1. Create a new page at app/landing/page.tsx
2. Import and render each section in the order listed above
3. Add framer-motion if missing — all sections depend on it
4. The HeroSection accepts a "headline" prop — set it to "Ship faster with AI"
5. Make sure Tailwind classes from each section don't conflict
6. Run the build to verify there are no type errors
```

### Connecting an exported component to an API

A Framer export gives you the visual layer. Claude Code can take it the rest of the way by wiring it to live data — fetching from an API, mapping response fields to props, and handling loading and error states.

```
I've added a Framer-exported ProductCard component to components/framer/ProductCard/.
It accepts these props: title, price, imageUrl, and onAddToCart.

Please:
1. Create a new component at components/ProductList.tsx
2. Fetch products from /api/products using SWR or React Query
3. Map each product to a ProductCard, passing the correct props
4. Handle loading (skeleton) and error states
5. Wire onAddToCart to POST /api/cart with the product ID
6. Add ProductList to app/shop/page.tsx and verify it renders
```

## Troubleshooting

Most issues fall into a handful of categories. Here is how to identify and fix each one.

### Claude cannot find the exported files

This almost always means your working directory is wrong. Claude Code operates relative to the directory you launched it from. If you started it in `~/projects` but your project lives in`~/projects/my-app`, Claude will not see the files it saved into `my-app/components/framer/`. Close the session, `cd` into your project root, and start Claude Code again. You can verify by asking it to list the contents of the directory where the component was saved.

### framer-motion version mismatch

Framer to AI exports rely on `framer-motion`. If your project already has an older version installed, you may see type errors or runtime warnings about missing APIs. Ask Claude Code to check which version is in your `package.json` and upgrade if necessary. In most cases running `npm install framer-motion@latest` resolves the conflict. If you are pinned to an older version for compatibility reasons, let Claude know and it can adjust the exported code to match.

### Component renders as blank

A blank render usually means the component depends on a Framer runtime module that is not present in a plain React project. Check the import statements at the top of the exported file. If you see imports from `framer` or `framer-motion` that are not resolving, install the missing package. Another common cause is the component expecting specific props that were not passed — review the auto-generated prompt for the full list of required props and make sure each one has a value.

### Import path errors

After Claude Code rewires imports, TypeScript or your bundler may complain about paths that do not resolve. This happens when the export uses relative paths that assume a different folder structure than your project. Ask Claude to update the import aliases in `tsconfig.json` or move the files to match your existing convention. A quick fix is to tell Claude your project's alias pattern — for example, `@/components` — and have it rewrite all imports accordingly.

## What to do next

Once your Framer export is integrated and rendering, there are several directions you can take.

-   **Customize the exported component.** Ask Claude Code to adjust colors, spacing, or typography to match your design system. Because it has full file access, it can update Tailwind classes, CSS modules, or styled-components in place. See the [Export Framer to React](/guides/export-framer-to-react) guide for details on what you can safely change in an export.
-   **Add backend logic.** Connect your component to a database, authentication provider, or third-party API. Claude Code can create API routes, server actions, or utility functions alongside the component and wire everything together. This is where the terminal access really pays off — it can test the endpoint and confirm the data flows through.
-   **Deploy the result.** When you are happy with the integration, ask Claude Code to run your build step and flag any warnings. From there you can deploy to Vercel, Netlify, or any platform that supports your framework. If your project has a CI pipeline, Claude can also commit the changes and open a pull request so the deployment triggers automatically.

---

Claude Code's ability to read, write, and execute makes it the most hands-off way to go from Framer design to integrated component. Export, paste, let Claude handle the rest. For a complete overview of the Framer AI workflow, see our [complete guide to Framer AI](/guides/framer-ai).

## Ready to try it?

Your first component in under a minute. 5-day free trial included.

[Get started](https://www.framer.com/marketplace/plugins/framer-to-ai/)

---

END OF FILE