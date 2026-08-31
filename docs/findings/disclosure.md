# Findings — T8 Disclosure

> Task: build a native `<details>` disclosure as the reference for `[open]`, derived hover over transparent, and a zero-axis/zero-knob component.
> Date: 2026-08-31
> Files touched: `ds/components/disclosure.css`, `fixtures/disclosure.html`, `docs/findings/disclosure.md`

## What was built

- A native `<details data-ui="disclosure">` component with direct-child `trigger` and `content` parts. HTML owns semantics, keyboard behavior, marker state, and exclusivity; CSS only presents those states.
- A deliberately empty axis list and public API. The fixed trigger recipe still passes through component-qualified frame and resolved bg/fg channels so hover consumes one resolved pair exactly as conventions §6–7 require.
- A native `::marker` recolor, label typography and comfortable space-scale padding on the trigger, self-sufficient body typography and internal paragraph rhythm on the content, and a subtle border frame.
- The open state raises the trigger from weight 500 to 600 and adds a 1px bottom hairline. The content uses `--ds-bg-subtle`, making it read as attached on canvas and deliberately exposing same-surface collapse when nested on a card.
- A fixture covering closed/open, interaction guidance, long content, disclosure-in-disclosure, disclosure-on-card, a native `name="faq"` exclusive group, unsupported `data-size="md"`, and pinned light/dark theme subtrees.
- No animation. Marker rotation and `::details-content` height animation remain future work because they would change the portability and motion questions being isolated here.

## Verification results

- Real summary clicks toggled `open` false → true → false. The computed open presentation changed weight 500 → 600 and bottom border 0px → 1px, then reverted. The in-app browser's keyboard injection focused the summary and produced the correct `:focus-visible` ring but did not dispatch the native Enter activation default, so the automated Enter toggle assertion is inconclusive; the implementation adds no behavior or event handling to interfere with the platform path.
- Native exclusive grouping started `[true, false, false]`; clicking the second disclosure produced `[false, true, false]` with no script or group-specific CSS.
- Real pointer hover resolved to `oklch(0.241128 0.00968188 none / 0.08)` in the pinned light subtree and `oklch(0.948915 0.00286495 none / 0.08)` in the pinned dark subtree. Resting background was transparent in both. Visual inspection found both tints quiet but legible on canvas.
- Focus on both pinned-theme summaries computed to `2px solid` with `2px` offset: `rgb(94, 177, 239)` in light and `rgb(40, 112, 189)` in dark. No component re-tune was needed.
- Content typography outside a theme subtree and in both pinned subtrees was identical: system UI, 16px, weight 400, 24px line height. Only foreground/background colors changed.
- The unsupported `data-size="md"` instance matched the attribute-less control across the root, trigger, and content computed-style sample. Native marker colors resolved to muted `rgb(96, 100, 108)` light / `rgb(176, 180, 186)` dark.
- On the dark card probe, card and disclosure content both computed to `rgb(24, 25, 27)` (`--ds-bg-subtle`), while the disclosure border computed to `rgb(54, 58, 63)`. The identical-token relationship also holds in light by construction.
- Zero console errors. Static checks: zero `!important`, zero `@layer`, zero primitive/active-palette or retired color names, all component custom properties use `--_ds-disclosure-`, one fixture `<style>` block, and `git diff --check` passes.

## Required questions

### 1. ARIA doctrine: `[open]` versus `[aria-expanded]`

Use `[open]` when the component is a native `<details>`: it is the platform's actual state, controls rendering and accessibility behavior, and cannot drift from what the user sees. Do not add `aria-expanded` to native `<summary>` as a duplicate hook.

Use `[aria-expanded="true|false"]` when an intentionally JS-driven disclosure uses a separate trigger/control pattern. The script must keep that attribute synchronized with the controlled region; CSS may then consume the same attribute because it is the real accessible state exposed to assistive technology. This starter should add such CSS only when that JS-driven component exists, not as speculative behavior on the native component.

`data-state="open"` would violate the §3 distinction. It is neither finite visual configuration nor the platform/accessibility state; it is a second state store that can silently diverge from `open` or `aria-expanded`.

Concrete proposed §7 wording:

> Select the authoritative state already owned by the behavior: `[open]` for native `<details>`, and `[aria-expanded]` for a JS-driven trigger whose accessible state is synchronized by the controller. Never mirror either into `data-state`; configuration attributes do not duplicate behavioral or accessible state.

### 2. Derived hover over transparent

The alpha tint is a legitimate generic outcome of the derived recipe, not an accident. With `transparent` as the resolved background, interpolation toward an opaque resolved foreground produces that foreground at the state mix's alpha. The result composites over the actual backdrop, which is useful for a trigger that should work on canvas, subtle surfaces, and consumer-painted surfaces without pretending its resting background is a particular semantic color.

Both schemes support this conclusion: 8% dark foreground over the light canvas and 8% light foreground over the dark canvas each read as a restrained hover. The transparent input does make the recipe backdrop-dependent, so the floor is not a guarantee of a fixed final color or contrast. If a component needs a stable, opaque hover surface, its resolved resting bg should be an explicit semantic surface such as `--ds-bg-subtle`; that is a recipe decision, not a new per-surface hover alias.

Recommendation for §7: explicitly state that a transparent resolved bg intentionally yields a semi-transparent fg tint and must be reviewed over every supported backdrop; choose an opaque semantic bg only when that overlay behavior is undesirable.

### 3. Content surface and nesting depth

`--ds-bg-subtle` won over transparent for the current component because it gives open content a modest attached region on canvas while leaving the trigger itself surface-neutral. Transparent content would make the open state depend almost entirely on the hairline and would erase that region on every backdrop.

The card probe shows the limit clearly: card and content consume the same role, so the nested content surface disappears and only the disclosure border communicates depth. The proposed neutral-3 `--ds-bg-component` would restore a second surface step in both schemes and is semantically plausible for this region. Disclosure alone does not justify promoting it, however: the border preserves comprehension, and adding a shared role should wait for repeated component-level demand rather than one nesting case. Keep `bg-subtle` now; carry `bg-component` as the evidence-backed candidate if M2 integration shows repeated same-surface collapse.

### 4. Marker styling

The native marker was sufficient. `::marker` reliably supplied the only needed customization here—semantic color—while the UA continued to own the closed/open glyph change. Chromium computed `content: normal` and the correct muted color in both schemes.

`::marker` is intentionally limited to marker content and a small set of text/font/color properties; it is not a general layout box and is a poor target for precise geometry, transforms, or motion. A starter that required a fixed cross-engine glyph shape, alignment, or rotation animation would need `list-style: none` plus a generated `::before` replacement, along with extra forced-colors and bidi testing. None of those needs appeared, so retaining the native affordance is the smaller and more portable contract.

### 5. Zero axes and zero knobs

The zero-axis claim held. Open/closed is native state, not an axis; no size, variant, density, or orientation choice emerged. The unsupported `data-size="md"` probe was a complete no-op.

Zero public properties also held. The first tempting knob was `--ds-disclosure-content-bg`, prompted by the same-surface card probe. It was resisted because it would expose a per-instance cure for a system-level surface-depth question, and this container pattern has not shown repeated override demand. Consumers can override the part with ordinary unlayered CSS today; if several components need a second nested surface, the correct addition is a shared semantic role rather than a disclosure-only public property.

## Conventions that held

- Native state plus `[open]` kept behavior, accessibility, and presentation on one source of truth.
- Direct-child part selectors contained nested instances without `@scope`.
- Self-sufficient part typography survived ordinary, nested, card, and theme contexts.
- Resolved state channels remained useful even with no axes or public override chain: hover has one inspectable input pair and no duplicated fallback expression.
- The shared focus baseline fit summary geometry without adjustment.

## Friction / surprises

- `color-mix()` over transparent remains serialized as an OKLCH color with 8% alpha rather than a final composited sRGB color. That accurately describes the computed value but makes the actual painted result backdrop-dependent; visual verification is part of the contract.
- `bg-subtle` creates useful attachment on canvas but collapses exactly on a subtle card. The border is enough for this modest component, though the probe strengthens the neutral-3 `bg-component` candidate.
- The retained marker made the implementation smaller, but it deliberately leaves glyph geometry to the UA. Precise motion would force a different strategy.
- The in-app browser could establish keyboard focus-visible state but its Enter key injection did not trigger the native summary default action. Click state, focus treatment, and the absence of behavior-interfering code were verified; the Enter automation remains the sole inconclusive battery item.

## Open questions raised

- How many same-surface nesting failures should be required before `--ds-bg-component` becomes a semantic role?
- Should future cross-engine testing standardize only native marker color, or also accept UA-specific glyph geometry as intentional?
- When motion enters scope, can `::details-content` meet progressive-enhancement and reduced-motion requirements without replacing the native marker?

## Suggested convention changes (if any)

- Add the authoritative-state wording proposed in question 1 to §7.
- Add the transparent-background outcome proposed in question 2 to the derived-state guidance.
- Do not add an axis, public disclosure property, or surface token yet.
