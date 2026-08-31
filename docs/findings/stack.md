# Findings — T9 Stack

> Task: stack layout primitive plus the embedded-component spacing and layout-identity decisions.
> Date: 2026-08-31
> Files touched: ds/components/stack.css, fixtures/stack.html, docs/findings/stack.md

## What was built

- `ds/components/stack.css`: a vertical flex container with one gap channel, `sm | md | lg` presets (md default), and one inherited public override, `--ds-stack-gap`. It has no parts and no margin, width, padding, child-selector, colour, or typography rules.
- `fixtures/stack.html`: gap/default/fallback probes; instance and context overrides; two stack-in-stack inheritance probes; stacks of cards and a stack inside a card; the embedded-component spacing control/simulation/stack comparison; the rich-text containment boundary twin; and light/dark theme-subtree inertness probes.
- Verified statically and in Chromium in both colour schemes. The measured evidence and resulting architecture recommendations follow.

## Conventions that held

- The base rule was the only implementation of md: attribute-less and unsupported `data-gap="xl"` instances matched explicit md at 16px. The named `md` selector remained a no-op vocabulary marker.
- The public override chain behaved as documented. An instance-level 32px override beat `data-gap="sm"`; an ancestor 48px `--ds-stack-gap` reached both outer and inner stacks. Without that public property, an outer `lg` axis did not affect an inner `sm` axis: their gaps stayed 32px and 8px respectively.
- Stack and card gaps remained independent because each container lays out only its direct children: the default card used 12px between title/body, while the nested sm stack used 8px between its own children.
- The component was scheme-inert. In both theme subtrees its computed colour, font family, font size, weight, and line height equalled its parent; its background remained transparent. Only display, direction, stretch alignment, and gap came from stack.
- Zero child margins or owl selectors were needed. Native flex `gap` expresses the ownership doctrine directly.

## Friction / surprises

- The brief contains one contradictory expectation: its contract maps `lg` to `--ds-space-6`, which is 32px in the frozen scale, while its verification list says lg must be 24px. The implementation follows the named-token contract and therefore measures 8/16/32px. A 24px lg would require `--ds-space-5`; T10 must reconcile the stale numeric expectation or change the mapping explicitly.
- The smallest component still needs a channel and a default marker to express the same audit-friendly contract as larger components. This is slightly formal for four layout declarations, but the unsupported-value fallback and override inheritance tests made each piece observable rather than decorative.
- A nested stack resets its internal axis channel on its own root, so an outer `data-gap` does not leak. The public `--ds-stack-gap` intentionally behaves differently: as an inherited context override, it reaches nested stacks. This is coherent with conventions §6 but easy to misread unless the fixture labels both cases.
- The rich-text scope limit excludes the nested component root itself. Therefore the tempting `* + [data-ui]` subject cannot simply be appended inside rich-text's existing `@scope … to (:scope [data-ui])` rhythm list: the lower-boundary element is outside that scope. Rich text can still own the space, but the leading-margin rule must sit outside that bounded block and target the root's direct component children.

## Open questions raised

### 1. Embedded spacing (question A)

**Recommendation: rich text owns embedded-component spacing.** The current prose → card → prose control measured 0px above the card and 16px below it. The fixture-only candidate produced 16px in both directions. The following paragraph already matches the existing `* + p` rhythm subject, so no `[data-ui] + p` addition is needed; the same is true for every currently supported prose block because each existing rule begins with `* +` (with headings intentionally receiving 24px).

Wrapping the same sequence in a stack also measured 16px in both directions, but it changed the paragraphs from scoped prose into boundary-excluded content. Consumer duty would preserve containment, but would make a routine rich-text composition concern vary page by page. The semantic adapter already owns the rhythm of every other top-level block and is the least surprising owner of its embedded blocks too.

Exact rule recommended for `ds/components/rich-text.css`, placed **outside** its bounded `@scope` block:

```css
[data-ui="rich-text"] > :where(* + [data-ui]) {
  margin-block-start: var(--ds-space-4);
}
```

This deliberately covers direct content-level embedded components, not components nested inside other components. T10 integration owns the hand-off because `rich-text.css` is frozen for T9. The rule's unlayered, class-scoped twin in `fixtures/stack.html` is simulation only.

### 2. Layout primitives vs containment (question B)

**Recommendation: keep component identity only, and define stack as application layout — never prose layout.** `[data-ui="stack"]` is correct where explicit component siblings need a common flow owner; inside rich text, its boundary behavior is not an incidental bug but a direct consequence of the containment contract. Question A gives the mixed prose/component sequence a solution without a wrapper: rich text owns the component's leading rhythm.

Measured boundary evidence in both schemes: under a discriminating `--ds-rich-text-body-font: var(--ds-type-heading-sm)`, control paragraphs in a plain wrapper computed to 19px/600/24.7px, the second had a 16px margin, and its semantic link was `rgb(13, 116, 206)` light / `rgb(112, 184, 255)` dark. Identical paragraphs inside `[data-ui="stack"]` fell back to 16px/400/24px page typography, both paragraph margins were 0px, and their UA link was `rgb(0, 0, 238)` light / `rgb(158, 158, 255)` dark; the stack's 16px flex gap merely hid the lost margin visually.

The cost is that consumers cannot reuse the system stack to group prose transparently; a future authoring case may need an attribute-only `data-layout="stack"` or local consumer CSS. But an identity-free stack is not automatically composable: rich-text paragraph margins would continue through it and add to flex gap, creating two rhythm owners unless more exception rules were introduced. That duplication, plus a second vocabulary and new lint/documentation rules, is too much architecture without a concrete case that cannot be expressed by rich-text rhythm. Reopen §17 only when such a case appears.

### 3. Is `data-gap` legitimate under conventions §3?

**Yes, narrowly.** For stack, gap presets are the component's finite configuration vocabulary, not a projection of an internal primitive name. `sm | md | lg` express three supported rhythm densities and may later map to different tokens without changing markup. `--ds-stack-gap` remains the value-bearing escape hatch for arbitrary lengths. The forbidden form would be token-shaped markup such as `data-gap="space-4"`, `data-gap-px="16"`, or one attribute per physical spacing property.

Proposed §3 wording:

> A finite axis may control geometry when its named values express supported component-level modes and remain decoupled from token names. Do not expose raw lengths, token keys, physical properties, or internal primitive composition as attributes; carry those values through custom properties.

If that distinction proves too subjective to lint, drop `data-gap` and retain only `--ds-stack-gap`; the cost is losing a discoverable, consistent preset vocabulary for the layout primitive whose only meaningful configuration is rhythm.

### 4. What else does the layout layer need?

Nothing else should be added from this isolated test. Likely candidates are a horizontal/row primitive, an alignment axis, and wrapping, but each should earn a place only after the same combination recurs across at least three real compositions and cannot be expressed more clearly by the owning component or a few lines of consumer CSS. Orientation changes interaction with inline/block semantics; alignment and wrap create cross-axis and overflow policy. They should not be added as “complete flexbox” axes by reflex.

### 5. Did the §6 pattern scale down?

Mostly yes. Base default → axis rebind → no-op named default → public-to-axis resolution stayed consistent, observable, and easy to grep. A separate resolved channel would be ceremony here because the override chain is consumed exactly once; conventions §6 already requires precomputation only when a chain is consumed more than once. The one internal channel is justified by unsupported-value fallback and by isolating nested instances. This is about the smallest component for which the full axis pattern remains proportionate.

## Suggested convention changes (if any)

- Add the finite-geometry-axis wording proposed in question 3 so `data-gap="sm"` is clearly distinct from forbidden primitive/token-shaped styling attributes.
- Record that a nested `[data-ui]` scope limit excludes the boundary root, so an owning semantic adapter may need a separate direct-child rule to style the *relationship* around that boundary without styling inside it.
- State that component-identity layout primitives are application-layout boundaries and should not wrap prose. Require measured composition evidence before introducing any identity-free `data-layout` vocabulary.
