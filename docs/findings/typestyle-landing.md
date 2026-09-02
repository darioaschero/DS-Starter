# Findings — T20 typestyle landing

> Task: Land the user-approved sm/md/lg typestyles, Inter, smoothing, polarity, and rich-text mapping into the core.
> Date: 2026-09-02
> Files touched: `ds/tokens/typestyles.css`, `ds/fonts/inter/InterVariable.woff2`, `ds/fonts/inter/LICENSE.txt`, `ds/fonts/inter/README.md`, `ds/core.css`, `ds/reset.css`, `ds/tokens/scale.css`, `ds/tokens/semantic.css`, `ds/components/rich-text.css`, `fixtures/corpus/perimeter.html`, and this note.

## What was built

The core now vendors Inter Variable 4.1 and imports a new `ds.tokens` sheet containing the approved sm/md/lg tuple constants. `--ds-font-sans` selects Inter first, so dormant components that already consume the sans slot change face without acquiring the prose ramp.

Rich text resolves complete tuples at the element consumption point:

- `h1` and `h2`: lg normal;
- `h3` through `h6`: md semibold;
- `p`, `li`, `dd`, `dt`, `blockquote`, `pre`, `td`, and `th`: md book, with `th` reapplying md semibold weight and tracking;
- `strong`: md semibold weight and tracking in its inherited size context.

`pre` is included in the md-book mapping without introducing a code typestyle. Its existing rule still replaces only the family with the mono stack; size, line-height, weight, tracking, optical sizing, and polarity now come from md.

The root smoothing decision is in `reset.css`. The inherited polarity property defaults to `0`, resolves to `-20` for the system-dark canvas and explicit dark scheme roots, and is re-declared as `0` by explicit light roots. Only the rich-text tuple rules consume it.

The font asset is byte-identical to the approved research copy:

```text
InterVariable.woff2  352,240 bytes
sha256  693b77d4f32ee9b8bfc995589b5fad5e99adf2832738661f5402f9978429a8e3
```

## Clamp derivation and shipped constants

The only ramp source is `37.5rem -> 87.5rem`, a `50rem` span. Expanding a tuple endpoint pair over that interval gives the baseline-safe preferred form used at each consumer.

| Property | Shipped clamp preferred term | Endpoint bounds |
|---|---|---|
| md size | `calc(0.91875rem + 0.35vw)` | `1.05rem` / `1.225rem` |
| md line-height | `calc(1.3125rem + 0.5vw)` | `1.5rem` / `1.75rem` |
| lg size | `calc(1.5104225rem + 0.41666vw)` | `1.66667rem` / `1.875rem` |
| lg line-height | `calc(1.8125rem + 0.5vw)` | `2rem` / `2.25rem` |
| md book tracking | `calc(-0.0075em - 0.014vw)` | `-0.0125em` / `-0.0175em` |
| md semibold tracking | `calc(-0.0025em - 0.014vw)` | `-0.0075em` / `-0.0125em` |
| lg tracking | `calc(0.000655154em - 0.020689617vw)` | `-0.004em` / `-0.009em` |

Negative tracking clamps put the more-negative max-viewport endpoint in the first `clamp()` position. Tracking preferred terms were solved against the tuple's changing own-size at 600px and 1400px, preserving both approved `em` endpoint fractions exactly.

There is one baseline-form nuance worth keeping visible. A percentage that changes linearly while font size also changes linearly produces a slightly quadratic pixel advance in the native shared-progress model. A baseline `em + vw` preferred term is linear in pixel advance. The endpoint renders are identical; at 1000px the shipped values differ from the native-progress construction by only `0.0035px` for md and `0.00417px` for lg, inside the brief's `0.01px` tolerance. Typed length division can remove that tiny middle-ramp difference once it is interoperable; the commented upgrade path stays at the consumption point as required.

## Approved-value assertions

These values were read from both `fixtures/corpus/longform.html` and `technical.html` through `core.css`, with explicit light and dark schemes and real 600px, 1000px, and 1400px viewports.

| Viewport | md book size/lh | md ratio | md tracking | lg size/lh | lg ratio | lg tracking | light weights | dark weights |
|---:|---:|---:|---:|---:|---:|---:|---|---|
| 600px | `16.8 / 24` | `10/7` | `-0.210px` | `26.6667 / 32` | `6/5` | `-0.106667px` | `400 / 600` | `380 / 580` |
| 1000px | `18.2 / 26` | `10/7` | `-0.2765px` | `28.3334 / 34` | `6/5` | `-0.188333px` | `400 / 600` | `380 / 580` |
| 1400px | `19.6 / 28` | `10/7` | `-0.343px` | `30 / 36` | `6/5` | `-0.270px` | `400 / 600` | `380 / 580` |

Endpoint line-heights sit exactly on the 4px grid. The 1000px values, 26px and 34px, correctly fail the endpoint-grid check while keeping the family ratios exact.

Additional assertions:

- `document.fonts.check('1rem "Inter"')` returned true on every pass;
- computed family was `Inter, system-ui, sans-serif`;
- `font-optical-sizing` was `auto` on every mapped tuple;
- `getComputedStyle(...).getPropertyValue("-webkit-font-smoothing")` returned `antialiased`;
- the explicit light root computed polarity `0`; explicit and system-default dark computed `-20`;
- `h3`, `strong`, and `th` resolved the md-semibold tracking clamp and weights;
- the technical `pre` resolved md's `16.8/24`, `18.2/26`, and `19.6/28` while retaining the mono family.

## Dark-polarity review pair

The paired 1000px longform viewport captures were taken after the final cache-busted pass and are presented inline in the task closing report. They are session artifacts rather than repository files because the task allowlist permits only this Markdown finding under `docs/findings/`.

The dark capture is the first full-page judgment of the decided `-20` correction. It visibly renders prose at approximately 380 and semibold at 580. This is implemented as recorded, but remains explicitly flagged for the user's landing review; no claim is made here that the full-page visual has been approved.

## Strong inside a heading

The existing rich-text fixture's `h2` containing `strong` was reviewed at 1000px. The heading stayed `28.3334/34`; the emphasized word resolved weight 600 in explicit light and 580 in dark. Because the md-semibold tracking clamp is evaluated at the inherited lg size, it resolves to `-0.75%` at 600px and 1000px and approximately `-0.903%` at 1400px, rather than replacing the heading size.

The transition read clearly in the rendered sentence, so no `h1/h2 strong` weight-only exception was added.

## Mechanism identity and expected deltas

The shipped expected-delta set is:

1. `font-family` everywhere that already consumed `--ds-font-sans`;
2. `font-size`, `line-height`, `font-weight`, and `letter-spacing` on rich-text prose subjects;
3. the declared root smoothing value;
4. the dark-scheme `-20` weight delta only where the new tuple rules consume polarity.

The committed pre-task tree was replayed on port 8080 with separate import-edge query versions, then compared with the landing at a 1000px viewport in explicit light and dark.

| Battery | Nodes per scheme | Stable computed properties | Unexpected deltas |
|---|---:|---:|---:|
| Composition | 280 | 37 | 0 |
| Consumer override | 74 | 37 | 0 |
| Button | 75 | 37 | 0 |
| Card | 102 | 37 | 0 |
| Field | 178 | 37 | 0 |
| Rich text | 114 | 37 | 0 |
| Stack | 141 | 37 | 0 |
| Disclosure | 97 | 37 | 0 |

The stable set covered colours, display/position/box sizing, margins, padding, borders, radii, outlines, opacity, alignment, decoration, overflow, and authored min/max geometry. Type-policy comparison across the same nodes found zero violations: outside owned rich-text prose, the only typography delta was family.

One dependent computed-value observation was classified separately rather than hidden: inline code keeps its unchanged `padding: 0.1em 0.35em`, so its reported pixel padding follows the approved prose-size change (`1.44/5.04px` before to `1.638/5.733px` at 1000px). The declaration, relative geometry rule, and every rhythm/spacing token are byte-identical. There were no other computed geometry deltas.

Other mechanism checks were green:

- nested rich-text selector/inheritance probes matched their outside controls exactly in both schemes;
- normal unlayered consumer link colour still beat the layered rich-text rule (`rgb(206, 44, 49)` versus the control's `rgb(13, 116, 206)`);
- direct field keyboard focus kept the input outline suppressed and relocated the shared `2px solid / 2px` ring to the frame;
- nested keyboard focus retained its own shared ring and left the outer frame at `outline-style: none`;
- nested disabled/invalid/focus states left both outer fields at opacity `1`, error `display: none`, and resting borders;
- all six optional component fixtures had zero non-family typography violations;
- the corpus scheme link changed the root to dark, canvas to `rgb(17, 17, 19)`, text to `rgb(237, 238, 240)`, and polarity to `-20`;
- the perimeter rendered all 27 new typestyle/ramp constants with no empty value;
- the browser warning/error log was empty.

## Naming as shipped — reviewable

The functional vocabulary is deliberately marked reviewable:

- ramp: `--ds-type-ramp-min|max`;
- fixed sm: `--ds-type-sm-size|line-height|weight-*|tracking-*`;
- fluid md: `--ds-type-md-size-min|max`, `line-height-min|max`, `weight-*`, and book/semibold `tracking-min|max`;
- fluid lg: `--ds-type-lg-size-min|max`, `line-height-min|max`, `weight-normal`, and `tracking-min|max`;
- inherited polarity: `--ds-polarity-wght`.

For tracking, `min|max` names refer to the ramp's minimum/maximum viewport endpoints, not numeric ordering; the max-viewport values are more negative. That interpretation should be settled in the naming review before the vocabulary is frozen.

## Conventions that held

The single layer prelude remains in `core.css`; the new sheet is one `ds.tokens` import. Formulas resolve on mapped elements, not `:root`. Rich-text selectors remain zero-specificity `:where()` selectors inside the existing bounded `@scope`. The root still contributes no inheritable typography. Theme surfaces set polarity instead of accumulating it. No `@property`, `!important`, bare axis selector, legacy protocol attribute, or non-palette `light-dark()` was introduced.

`scale.css` changed on exactly the allowed `--ds-font-sans` line. The Inter font and license are self-hosted under `ds/fonts/inter/`, with provenance and hash restated beside them.

## Friction / surprises

The baseline-safe tracking expansion cannot reproduce the native shared-progress model's tiny quadratic pixel curve exactly in the middle of the ramp; the measured difference is below `0.005px` and all approved endpoint values are exact. This is documented rather than silently described as mathematical identity.

The frozen rich-text fixture still contains copy and code examples for the superseded font-role/public-font-override mapping. The task explicitly forbade editing that fixture; it is expected fixture-copy drift to clean up in the later contract/content pass, not a reason to mutate the allowlist.

## Anything C3 rhythm must know

No rhythm declaration changed. The larger md/lg line boxes naturally change page height and wrapping while all margins remain the same token values. At mid-ramp the continuous 26px/34px line-heights are intentionally off the 4px endpoint grid. C3 should judge the existing `space-2` heading-follow gap, `space-4` block flow, and `space-6` section opening against those new line boxes rather than treating their unchanged bytes as visual approval.

The fluid md mapping makes technical code blocks taller and changes their wrapping budget while keeping `pre` padding and surrounding rhythm untouched. Inline code's `em` padding also scales with the new prose size, as recorded above.

## Suggested convention changes

### Proposed §5b rewrite

Core typography is expressed as complete sm/md/lg tuples rather than the legacy type scale and font-shorthand roles. A tuple owns family slot, rem size, rem line-height, weight class, tracking, and optical policy. Sm is fixed; md and lg share one viewport progress over `37.5rem -> 87.5rem`, with per-style baseline clamp expansions. Tracking is an `em` fraction of the consuming element's own size. Every fluid formula resolves at the element consumption point; pre-resolved root aliases are forbidden because they prevent subtree re-pinning. The legacy `--ds-font-size-1..6` and `--ds-type-*` roles remain dormant compatibility/module dowry until a separate removal decision.

### Proposed §11 font-asset amendment

Vendored, self-hosted, open-licensed font assets are permitted in shipping `ds/fonts/` when the exact upstream release, license, file size, and cryptographic hash are recorded beside the asset. Inter Variable 4.1 is the current core sans face, loaded locally with a rigorous `system-ui, sans-serif` fallback and no runtime network dependency.

### Smoothing record

The root declares `-webkit-font-smoothing: antialiased` and `-moz-osx-font-smoothing: grayscale` as the user decision of 2026-09-02. These are macOS-specific/non-standard levers, ignored where unsupported, and remain overridable by ordinary consumer CSS through the layer contract.

### Polarity record

Surfaces declare one inherited `--ds-polarity-wght` delta and never add to an inherited delta. Positive/light surfaces re-declare `0`; negative/dark surfaces declare `-20`. Tuple consumers add the delta once at the weight consumption point. The numeric correction requires explicit scheme selector/media wiring because `light-dark()` carries colours, not numbers.

## Open questions raised

1. Does the user approve 380/580 on the full dark corpus, or should the negative-surface delta be revised after the paired review?
2. Should tracking endpoint tokens retain `min|max` viewport terminology, or adopt `rest|end` to avoid negative-number ambiguity?
3. When the frozen rich-text fixture is next editable, should the retired public font-shorthand overrides be removed from its explanatory copy or replaced by tuple-level override vocabulary?
