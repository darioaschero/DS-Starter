# T9 — Stack

> **Goal:** the layout primitive — a vertical flow container with a gap axis — AND the assigned owner of two open architecture questions: **embedded-component spacing in prose** (m1-synthesis row 11) and the **direction §17 deferred decision on layout primitives** (component identity vs attributes), which your fixture must answer with evidence.
> **Runs in parallel with T7 (field) and T8 (disclosure).** File sets are disjoint — stay strictly inside yours.

## Read first, completely, in this order

1. `docs/conventions.md` (v3 — normative; §3 markup contract incl. the "no primitive styling as attributes" rule you will stress-test, §6 pattern, §9 rich-text containment)
2. `docs/direction.md` — §4 (identity/configuration/values), §13 (rich text), §17 (deferred: "whether layout primitives use components, attributes, or both"), §18
3. `docs/findings/m1-synthesis.md` §3 row 11 (embedded spacing — the flush card) and §5
4. `docs/findings/rich-text.md` (rhythm subject lists; why `* + *` was rejected) and `ds/components/rich-text.css` (the rhythm rules at the bottom — you will simulate a change to them, not make it)
5. `ds/components/card.css` (container reference)

## Files you may create/edit — ONLY these

`ds/components/stack.css` (currently a stub) · `fixtures/stack.html` (currently a stub) · `docs/findings/stack.md` (new, from `TEMPLATE.md`).

**Frozen for this task**: `ds/index.css` (stack.css is already imported), all `ds/tokens/*`, `ds/reset.css`, **`ds/components/rich-text.css` even though one of your candidate answers modifies it** (you simulate instead — see below), other components, other fixtures including `fixtures/composition.html`, `docs/conventions.md`, `CLAUDE.md`, other findings, `docs/tasks/`. New tokens: propose in findings, never edit token files. **No commits.**

## Component contract

### Identity and markup

```html
<div data-ui="stack" data-gap="lg">
  <section data-ui="card">…</section>
  <section data-ui="card">…</section>
</div>
```

Root: any grouping element. **No parts.** Children are whatever the consumer puts there — stack owns only the space between them.

### Axes

`data-gap: sm | md | lg` (md default, base-rule-only; `sm`/`lg` rebind the channel; `&[data-gap="md"]` is a no-op marker). Mapping: sm → `--ds-space-2`, md → `--ds-space-4`, lg → `--ds-space-6`. One channel: `--_ds-stack-gap-size`. Public override: `--ds-stack-gap` (any length), resolved `public → axis channel`.

This axis deliberately sits on the §3 boundary: "attributes describe discrete choices; custom properties carry styling values" vs "never expose primitive styling as attributes (`data-padding-x`)". Gap presets are arguably the stack's *entire configuration*, not leaked internals — findings question #3 must argue whether `data-gap` is legitimate under §3 or whether the axis should be dropped in favour of the custom property alone, with proposed §3 wording either way.

### Implementation

`display: flex; flex-direction: column; align-items: stretch; gap: var(--ds-stack-gap, var(--_ds-stack-gap-size));` — and nothing else. No margins on children, no `* + *` owl selectors, no width/padding opinions. Vertical only (orientation is findings material, not scope). Header comment documents the axis, the default, and the "owns only the space between children" doctrine.

## The two assigned questions (first-class deliverables)

### A. Embedded-component spacing in prose (m1-synthesis row 11)

The §18 composition fixture showed embedded components sit **flush** in prose (rich-text rhythm subjects are named prose elements only; `rich-text.css` rhythm rules). Three candidate owners:

1. **Rich text**: add `* + [data-ui]` (and `[data-ui] + <prose>`? — check both directions!) to the rhythm subject lists in `rich-text.css`.
2. **Stack**: doctrine says "wrap mixed prose+component sequences in a stack" — but see question B first.
3. **Consumer duty**: document that embedded-component spacing belongs to the page.

Your fixture must reproduce the flush case (prose → card → prose inside a rich-text article) and then **simulate option 1 without touching rich-text.css**: add the candidate rule to the fixture's own unlayered `<style>` (clearly commented as a simulation — this is the one sanctioned exception to the single-chrome-block rule, keep it inside the same block) and measure the result in both directions (space above the embedded component AND below it, vs the surrounding prose rhythm). Evaluate option 2 by actually wrapping the same content in a stack inside the article — which triggers question B. Deliverable: a decision recommendation with measured evidence, the **exact rule text** for whichever owner wins, and who implements it (the integration task, if the answer touches rich-text.css).

### B. Layout primitives and the containment model (direction §17)

A `data-ui` stack is a **scope boundary**: wrap two paragraphs of an article in a stack and rich-text's prose styling stops at it — the paragraphs inside lose their roles, rhythm, everything (conventions §9). Your fixture must demonstrate exactly this, with a control twin outside the stack, computed-style assertions, and screenshots. Then answer for §17: can a component-identity layout primitive ever be used *inside* rich text? Is the answer "stack is for app layout, never for prose" (doctrine), or does the starter need an attribute-only layout mechanism (`data-layout="stack"` with no `data-ui`) that composes with prose, or both? Argue from the measured evidence; recommend one position, name its costs.

## Fixture — `fixtures/stack.html`

Canonical §11 chrome (plus the clearly-commented simulation rules for question A). Sections: gaps sm/md/lg + attribute-less twin + unsupported `data-gap="xl"`; public `--ds-stack-gap` override (instance and context — remember context overrides reach nested stacks by inheritance: probe a stack-in-stack and label the observed behavior); stack of cards (the canonical app-layout use); stack inside a card (vs the card's own gap — do they fight?); **question A's flush-prose reproduction + simulation**; **question B's prose-inside-stack boundary probe with control twin**; `data-theme` subtree box (stack has no colours — assert it contributes nothing).

## Verification battery (required, both schemes)

Serve the repo root on port **8043** (own browser tab; kill server + close tab when done). Assertions: computed `gap` for sm/md/lg = 8/16/24px; attribute-less === md; `xl` === md; override wins over axis; stack-in-stack: inner gap unaffected by outer `data-gap` but affected by an inherited `--ds-stack-gap` context override (document both); question A simulation: measured margins before/after, both directions; question B: nested-vs-control paragraph computed styles (font, margins, link colour) diverge exactly as §9 predicts; stack adds no colour/typography anywhere (computed equality probe). Both schemes screenshotted (stack itself should be scheme-inert — prove it). Greps on your file: zero `!important`, zero `@layer`, every property `--ds-`/`--_ds-stack-` prefixed, no colour references at all, no retired names. Zero console errors.

## `docs/findings/stack.md` — required questions

1. **Embedded spacing (question A)**: recommendation, measured evidence, exact rule text, owner (and hand-off note for the integration task if it's rich-text.css).
2. **Layout primitives vs containment (question B)**: the §17 recommendation — component identity, attribute-only, or both — with the boundary evidence.
3. **Is `data-gap` legitimate under §3?** Argument + proposed wording.
4. **What else does the layout layer need?** Orientation/row, alignment axis, wrap — propose only, with the criterion for when a primitive earns a place.
5. **Did the §6 pattern scale down?** Stack is the smallest possible component (one channel, no parts, no colours) — did the recipe pattern (base defaults / no-op marker / resolved chain / public override) feel right-sized or ceremonious at this scale?

## Done means

All battery checks pass in both schemes · fixture complete (including both assigned-question probes) · findings note answers all five questions · only your three files touched · nothing committed · closing report (what was built, verification results, the five answers in brief — questions A and B first).
