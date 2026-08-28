# Findings — T2 Button

> Task: button as the reference implementation of the component recipe (axis channels + public overrides), fixture, verification.
> Date: 2026-08-28
> Files touched: ds/components/button.css, fixtures/button.html, docs/findings/button.md

## What was built

- `ds/components/button.css`: one nested `[data-ui="button"]` rule. Axes `data-variant` (soft default | solid) and `data-size` (sm | md default) as independent channel pairs (`--_ds-button-variant-bg|fg`, `--_ds-button-size-font|padding-x|height`); defaults implemented only in the base rule; `soft`/`md` selectors exist as commented no-op markers. Public API `--ds-button-bg|fg|font|padding-x|height` resolved as `var(--ds-button-*, var(--_ds-button-*-*))`. Constants: pill radius, inline-flex + `gap: --ds-space-2`, `min-block-size`, UA border/padding-block neutralized, `cursor: pointer`, `user-select: none`. States: hover/active mix the resolved fg chain over the resolved bg chain (8% / 12%, oklch); `:disabled` = `--ds-disabled-opacity` + cursor reset. Parts: `label` (no rules), `icon` at `1em` (intentional em) via child combinator.
- `fixtures/button.html`: canonical chrome (§11) + six inline-style-only sections — matrix + attribute-less button, unsupported values (`ghost`, `xl`), icon+label at both sizes, disabled per variant, context + instance public overrides, `data-theme` subtree boxes.
- Verified in Chromium, both schemes (screenshots + computed styles): attribute-less button computed-identical to explicit soft/md (font/height/padding/bg/fg all equal); `ghost`/`xl` computed-identical to defaults; context override (`--ds-button-bg: --ds-danger-9` on a wrapper) beats the solid variant in both schemes; keyboard focus ring visible (accent-9 light / accent-8 dark, 2px/2px); subtree theme boxes flip in both page schemes; button.css confirmed in `layer(ds.components)` via CSSOM; zero console errors. Hover/active could not be triggered by the driver's synthetic pointer, so the exact state expressions were resolved inline on the live elements instead — identical var context, so identical computed color to what `:hover` paints: soft light 0.945→0.905 L (darkens), soft dark 0.30→0.34 (lightens), solid 0.55→0.585 (lightens toward fg), danger override flows through (0.585, hue 27→16.8).

## Conventions that held

- The §6 recipe shape worked verbatim: every default has exactly one home, axis rebinds are 2–3 line diffs, and the attribute-less/unsupported-value cases passed with no extra code — the base rule really is the fallback implementation.
- No-op default markers cost nothing and read well as vocabulary documentation; CSSOM shows them as empty rules a linter can consume.
- §7 state-derivation over the resolved chains delivers the headline promise: a public bg/fg override automatically gets correct hover/active shades. This fell out of the pattern for free.
- §8 focus baseline needed **no re-tune** for pill geometry: outline follows `border-radius` in evergreen browsers, and 2px/2px reads clearly on both sizes and schemes. Decision: keep the shared values; components should touch `--ds-focus-outline-offset` more rarely than direction §12's example implies.
- Component-qualified channel names did real work: this fixture page also loads the card task's `--_ds-card-size-*` channels; zero interaction, by construction.
- The reset's `font: inherit` hazard was real but the layer order (`ds.components` > `ds.reset`) resolves it with no ceremony; the font chain is load-bearing and documented as such in the header comment.

## Friction / surprises

- **Restating the resolved chain is the fragile spot.** `var(--ds-button-bg, var(--_ds-button-variant-bg))` appears three times (base, hover, active) and the fg chain three times too. Nothing keeps the copies in sync; a typo in one silently forks the override chain. This is the one place the pattern felt fragile rather than mechanical.
- **Mix-partner choice matters more than the mix.** Mixing toward a fixed ink (`--ds-text-1`) gives conventional light/dark directions but produces a near-zero shade when an override bg approaches the ink color. Mixing toward the **resolved fg chain** (MD3 "state layer") is self-correcting for any readable pair and is what shipped. 8%/12% is subtle but clearly visible (ΔL ≈ 0.035–0.06 in every context tested).
- oklch polar mixing rotates hue when one side is near-achromatic (danger-9 + 8% gray-1: hue 27°→16.8°). Invisible at these strengths, but `in oklab` would sidestep it if stronger mixes ever make it show.
- Sizes carry bare literals (`2.75rem`/`2.25rem`): control heights fit neither the space scale nor type scale. Fine per direction §8, but a third component repeating this will want a control-height token.
- Conventions are silent on cursor/selection; chose `cursor: pointer` (web affordance convention over platform default) + `user-select: none`, with `:disabled` resetting the cursor — recorded here as the smallest reasonable option.
- Trivia: a flex-child button's computed `display` reports `flex`, not `inline-flex` (blockification) — harmless, but it can startle computed-style assertions.

## Task-brief questions

- **Channel pattern — mechanical or fragile?** Mechanical in the good sense, with one fragility: the unenforced verbatim restatement of resolution chains in state rules (above). A candidate fix is one extra derived channel per themed property, computed once in the base rule (`--_ds-button-resolved-bg: var(--ds-button-bg, var(--_ds-button-variant-bg))`), consumed by base + states. Not implemented — it adds a channel category §6 doesn't define — but it would remove all duplication and is trivially lintable.
- **Public-override chain worth its verbosity?** For button, yes. The context-override demo is the consumer contract working exactly as promised: a wrapper custom property re-themes soft *and* solid buttons, wins with no selector knowledge, no `!important`, and keeps correct state shades. The cost is per-declaration, bounded, and paid once by the component author. Recommendation for the deferred decision: interactive leaf components should expose the obvious knobs; container components should not get knobs speculatively. One reach caveat to document: public overrides inherit subtree-wide by design, crossing nested component boundaries — feature and hazard.
- **color-mix state shades — promote hover/active aliases?** Do **not** promote per-surface aliases (`--ds-accent-surface-hover` …): they multiply the semantic table and, worse, fall outside the override chain (an overridden bg would pair with default hover aliases). Do promote the two strengths as semantic tokens — e.g. `--ds-state-hover-mix: 8%`, `--ds-state-active-mix: 12%` — so every component derives press feedback with one shared grammar and theming can globally tune intensity.
- **Channel collisions / inheritance surprises?** No cross-component collisions (card channels coexisted on the same page). Internal channels do inherit — irrelevant for button (nested buttons are invalid HTML), but container components must expect their channels to be readable in their entire subtree; qualification prevents *collision*, not *reach*.

## Open questions raised

- Should §6 add a "resolved channel" (public→axis precomputed once) as the blessed way to consume chains in state rules?
- Control heights: literal `rem` per component, or a shared control-height scale token?
- Is a styling-less `data-part="label"` worth requiring in markup? It documents anatomy and gives the linter/a11y tooling a hook, but it is pure ceremony in CSS terms. (Kept in all fixture markup.)
- Driver-based verification cannot synthesize `:hover`; the workaround (resolving the state expression inline on the element) is exact but indirect. Should fixtures grow a "forced state" specimen convention (e.g. a demo row applying the state declarations statically) for visual regression?

## Suggested convention changes (if any)

- §7: name the canonical state recipe — "mix the resolved fg chain over the resolved bg chain" — and add the two mix-strength semantic tokens, so components stop inventing per-component shade math.
- §6: state explicitly that public override properties inherit subtree-wide and cross nested component boundaries by design.
- §6 (candidate, pending more components): allow/define derived resolved channels to de-duplicate chain restatement in state rules.
