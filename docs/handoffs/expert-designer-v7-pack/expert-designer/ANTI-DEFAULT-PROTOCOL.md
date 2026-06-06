# 00 · ANTI-DEFAULT PROTOCOL — Read this BEFORE anything else

> Agents following v6 produced rule-compliant slop. Centered vertical stacks.
> Single column. No asymmetry. No risk. No conviction. This document is the
> forcing function that prevents that failure mode. **Read it first. Every time.**

---

## The diagnosis (look at this image: bad-output.jpg)

Last session's failure mode, in one screenshot:
- Hero: centered, narrow, vertical stack
- Five "surface anchors" → five cards stacked vertically (not a grid)
- Six "state outputs" → six cards stacked vertically (not a grid)
- Three card recipes → three cards stacked vertically (not a row)
- Three nested surfaces → three boxes stacked vertically (not nested)

**Every section was a vertical stack centered in a 720px column.** The rules were
all followed. The design had zero conviction. This is what happens when an agent
optimizes for not-breaking-rules instead of for visual outcome.

---

## The root cause

v6 SKILL.md leads with **what to avoid**: 10 hard guardrails, banned fonts, banned
techniques, banned units. Risk-averse agents read that and pick the least-risky
composition: a centered vertical stack. It violates zero rules and looks like
nothing.

The skill names 10 Awwwards patterns — but never **forces a choice**. An agent
that doesn't choose a pattern *defaults to none*, which is a centered stack.

The skill never asked: "what's the ONE risky move you're committing to?" Without
that question, agents commit to nothing.

---

## The new mandatory flow (overrides SKILL.md §8 step 2)

```
Step 1 — PICK A STARTER, not a "pattern"
  Open expert-designer/starters/ and copy ONE file into your work.
  You are not designing a layout. You are FILLING a layout.

Step 2 — WRITE THE MANIFESTO (3 lines, before any HTML)
  - Pattern: [exact starter filename]
  - The ONE move: [what asymmetry / oversized element / unusual ratio you commit to]
  - What you will NOT do: [the safe default you're explicitly rejecting]

Step 3 — FILL THE SLOTS (do NOT redesign the layout)
  The starter has <!-- FILL: --> markers. Replace them with real content.
  You may NOT change grid-template-columns, container widths, alignment, or padding scale.
  If the content doesn't fit the layout, your content is wrong, not the layout.

Step 4 — AUDIT FOR BORING
  Run: node expert-designer/scripts/audit-boring.mjs <your-file.html>
  If it flags any HARD failure, you have failed and must restart with a different starter.

Step 5 — VERIFY
  Run the regular audit-design.mjs.
  Manual checklist from SKILL.md §7.
```

---

## The forbidden defaults (HARD failures)

If your output contains ANY of these, you have produced slop. Restart.

1. **Every section is centered.** At least 40% of sections must be asymmetric (split, bento, magazine).
2. **Every section is a vertical stack.** At least one section must have a grid with ≥ 2 visible columns at 1280px.
3. **All cards are the same size.** At least one card grid must include a featured tile spanning ≥ 2× the others (bento principle).
4. **No element occupies ≥ 50% of viewport width.** At least one hero/headline/image must be visually dominant.
5. **Container width is the same on every section.** Vary between sm/md/lg/xl deliberately. Full-bleed at least once.
6. **All headings are the same size.** The h1 must be at least 2 ladder steps larger than the h2 on the same page.
7. **No asymmetric ratio anywhere.** No 5fr 7fr. No 2fr 3fr. 50/50 doesn't count.
8. **No section has a different background color.** Use --ts-bg-1 alt for at least one section; --ts-accent surface for at most one.
9. **Whitespace is uniform.** Section padding must vary deliberately (some compact, one dramatic).
10. **The page reads top-to-bottom only.** A reader's eye should pivot at least twice — that means asymmetric placement of an element somewhere.

`audit-boring.mjs` checks these mechanically. If it fails, you didn't commit.

---

## The Awwwards mindset (the part the rules can't teach)

Awwwards-grade design is **asymmetric** before it is symmetric, **bold** before
it is restrained, **oversized** before it is balanced. Every layout that wins
an award has at LEAST ONE thing about it that is uncomfortable, surprising, or
risky. A safe layout is by definition not award-grade — it's not bad, it's just
invisible.

When you pick a starter, you are choosing **one risky move** to commit to. The
rest of the page supports that move. Without a risky move, the page is invisible.

| Risky moves you can pick |
|---|
| Hero headline at 18vw, touching the safe-area edge |
| Asymmetric 5:7 split with image bleeding off the right edge |
| One bento tile 8 cols × 2 rows; everything else 3×1 |
| Section title aligned to a column 3 of a 12-col grid, not centered |
| Mixed serif italic inside a sans display (one word only) |
| Negative letter-spacing −0.05em on a hero |
| A full-bleed section with text in the lower-left third only |
| A list of items as a magazine TOC with rules between |
| One section that breaks out of the container (negative margin to bleed) |

If your output has none of these, you committed to nothing. Restart.

---

## What the agent must write before producing HTML

Verbatim template, paste into the top of your response BEFORE you write code:

```
DESIGN MANIFESTO
────────────────
Pattern:           starters/<filename>.html
The ONE move:      <describe the asymmetry / oversized / unusual choice>
What I will NOT do: <name the boring default you're explicitly rejecting>
Reader's eye pivots at:  <element 1>, <element 2>
Container variation:     hero=<xl/lg/md>, section-A=<...>, section-B=<...>
Background variation:    section-A=bg-body, section-B=bg-1, section-C=accent
```

If you cannot fill all six lines, you have not designed. Do not produce HTML.

---

## The self-roast (do this before declaring done)

Look at your output and answer aloud:

- [ ] Is more than one section centered? → Probably slop.
- [ ] Is every card the same size? → Definitely slop.
- [ ] Did I use one container width for everything? → Slop.
- [ ] Did I default to a single column anywhere I should have used a grid? → Slop.
- [ ] Is there ONE oversized element on the page? → If not, slop.
- [ ] Did I make ONE choice that scared me a little? → If not, slop.

Three "yes-it's-slop" answers → throw it out, pick a different starter, restart.

---

## Why this works (the meta-principle)

Agents are great at FILLING. Agents are bad at COMPOSING. The fix is to take the
composition decision *away* from the agent — pre-build the risky layout in a
starter file, force the agent to pick one, and let them only fill the slots.

The agent's job is no longer "design a hero." It's "fill `starters/03-asymmetric-hero.html`
with the user's content." That's a job agents can do without producing slop.

---

## Quick reference

```
expert-designer/
  ANTI-DEFAULT-PROTOCOL.md       ← this file (read first, every time)
  starters/
    01-centered-hero.html         ← Only use for dev-tool launches with a single message
    02-magazine-split.html        ← Editorial / publication / long-form
    03-asymmetric-hero.html       ← Marketing landings, product launches (DEFAULT)
    04-oversized-type.html        ← Statement landings, brutalist, posters
    05-bento-landing.html         ← Multi-feature products, dashboards (DEFAULT for product)
    06-magazine-toc.html          ← Lists, indices, agency featured-works
  scripts/
    audit-boring.mjs              ← The boring detector. Run before declaring done.
```

When in doubt: pick `03-asymmetric-hero.html` for marketing or
`05-bento-landing.html` for product. Both prevent the centered-stack failure
by construction.
