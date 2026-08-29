# Findings — T6 Colour architecture v3

> Task: replace the scheme-neutral colour ramps with Radix light/dark primitives, active palette steps, purpose semantics, shared recipes, and resolved component channels; re-run the M1 battery.
> Date: 2026-08-28
> Files touched: `ds/tokens/palette.css`, `ds/tokens/recipes.css`, `ds/tokens/scale.css`, `ds/tokens/semantic.css`, `ds/index.css`, `ds/components/button.css`, `ds/components/card.css`, `ds/components/rich-text.css`, `fixtures/*.html`, `docs/findings/color-architecture.md`

## What was built

- `palette.css` now contains 72 verbatim sRGB primitives from `@radix-ui/colors` 3.0.0: Slate, Blue, and Red in light and dark. Thirty-six active steps resolve those pairs through the repository's only `light-dark()` calls.
- `semantic.css` now exposes the v3 purpose vocabulary and the 8%/12% state strengths. No semantic role needed to know the active scheme. `recipes.css` adds the shared `solid`, `soft`, and `outline` bg/fg/border channel sets.
- Button binds `soft` and `solid` recipes through variant channels, resolves its public bg/fg chains once, and uses only the resolved channels in base, hover, and active declarations. Card and rich text received colour-name-only refactors.
- Every fixture uses the canonical canvas/text chrome. The index demonstrates the semantic roles, all three shared recipes, and light primitive / dark primitive / active strips for all three families.

## Verification results

- Static checks: 72 primitive declarations and 36 active declarations; zero retired names in `ds/` and `fixtures/`; zero component references to active steps; `light-dark()` only in `palette.css`; zero `!important` in `ds/`; zero `@layer` outside `index.css`; one `<style>` block in every fixture.
- Browser, dark preference and a light root scheme override: every composition probe passed with the original typography/containment/override outcomes. Both native disclosures toggled closed → open → closed. All ten interactive targets received a 2px focus ring at 2px offset, resolving to Blue 8 in each scheme.
- All five consumer-override cases passed in both schemes, including the zero-specificity card override. Real pointer hover confirmed that plain consumer CSS stays static while a `--ds-button-bg` override continues through the derived state chain.
- Button: attribute-less = explicit soft/md; unsupported axes fall back; solid = Blue 9 (`rgb(0 144 255)`) in both schemes; soft = Blue 3 (`rgb(230 244 254)` light, `rgb(13 40 71)` dark); the 8% hover expression resolved in the browser; context `--ds-danger-9` still resolves; subtree theme switches still flip independently.
- Canvas = Slate 1 (`rgb(252 252 253)` light, `rgb(17 17 19)` dark). WCAG contrast ratios for primary text and links were respectively 15.98 / 4.65 on canvas and 15.58 / 4.53 on subtle in light; 16.25 / 8.97 on canvas and 15.15 / 8.37 on subtle in dark. No browser console warnings or errors.

## Explicit architecture answers

### 1. Border mapping

- Card root: `--ds-border-subtle`. It outlines a non-interactive container; the stronger default border would overstate affordance.
- Rich-text blockquote rule, horizontal rule, and table row rules: `--ds-border-subtle`. They are structural separators, not controls.
- Fixture frames and probe boundaries: mechanically mapped to `--ds-border-subtle` for the same structural reason.
- `--ds-border-default` is intentionally used by the shared outline recipe. That is the genuinely interactive/default-control case in the current vocabulary, although no built component consumes the outline recipe yet.

### 2. Semantic scheme asymmetry

None was needed. Active steps covered every semantic role, including focus at Blue 8 and text/link roles at step 11/12. `palette.css` remains the sole scheme-resolution point.

### 3. Derived versus curated states

The browser-resolved hover values matched an independent OKLCH interpolation calculation. Distances below are Euclidean OKLab ΔE (lower is closer):

| Scheme | Derived state | Derived OKLCH | Radix target | ΔE |
|---|---|---:|---|---:|
| light | soft hover 8% | 0.9274 0.0314 239.7 | Blue 4 | 0.0116 |
| light | soft active 12% | 0.9112 0.0371 240.3 | Blue 5 | 0.0154 |
| dark | soft hover 8% | 0.3136 0.0710 253.6 | Blue 4 | 0.0266 |
| dark | soft active 12% | 0.3332 0.0734 253.4 | Blue 5 | 0.0471 |
| light | solid hover 8% | 0.6774 0.1776 251.8 | Blue 10 | 0.0553 |
| light | solid active 12% | 0.6914 0.1699 251.8 | Blue 10 | 0.0703 |
| dark | solid hover 8% | 0.6774 0.1776 251.8 | Blue 10 | 0.0138 |
| dark | solid active 12% | 0.6914 0.1699 251.8 | Blue 10 | 0.0032 |

Soft derivation is close in light and directionally correct in dark, but the dark active shade falls notably short of curated Blue 5's lightness/chroma. Solid is the decisive mismatch: mixing Blue 9 toward white lightens in both schemes, while Radix Light Blue 10 is darker than Blue 9; the light hover therefore moves in the opposite direction from the curated convention. In dark, the same derivation is close to Blue 10. The hue movement stayed small for these blue-on-blue and blue-on-white pairs, but that does not remove the general OKLCH hue-rotation risk for arbitrary public override pairs.

Recommendation: keep derivation as the resilient floor for arbitrary overrides, but the evidence favors optional curated recipe hover/active channels for solid, at minimum, when the state API is reopened. Soft can remain derived unless M2 visual testing demands stronger dark active separation.

### 4. Surface depth for M2

Propose active neutral step 3 for a `--ds-bg-raised` candidate. Radix assigns step 3 to component backgrounds, and it creates a clearer second depth above step-2 subtle containers in both independent ramps, especially in dark mode (`#212225` over `#18191b`). The light result (`#f0f0f3` over `#f9f9fb`) reads more like a differentiated component surface than literal physical elevation, so M2 should validate the `raised` name against real field/card/disclosure nesting before promoting it; `bg-component` may be the more honest name.

### 5. Recipe contract gaps

No base channel was missing for the three built components: bg/fg plus an optional border is sufficient, and forcing border tokens onto borderless solid/soft recipes would add noise. The likely future addition is state channels (`hover-bg`, `active-bg`) on recipes that choose curated states. Those are an extension point already anticipated by the resolution model, not a missing base-surface channel.

## Conventions that held

- Flattened independent ramps removed semantic nesting and gave every step one stable role across schemes.
- Purpose names made component and fixture usage easier to read than numbered semantic aliases.
- Resolved channels eliminated the duplicated public/axis fallback chain from button states without changing public override behavior.
- Recipe tokens coordinated the button and standalone specimens without making outline a button variant.

## Friction / surprises

- Radix Blue 9 is identical in its light and dark sRGB sets, so the solid base is scheme-invariant while its curated Blue 10 hover is not. That exposed the strongest derived-versus-curated asymmetry.
- The light Blue 11 link sits close to the 4.5:1 threshold on Slate 2 (measured 4.53). It passes, but future family substitution should re-run this exact check.
- The fixture consumer overrides previously used their own `light-dark()` expressions. Replacing them with active palette steps was necessary to preserve the invariant that `palette.css` is the only scheme-resolution site; the cascade behavior under test remained unchanged.

## Open questions raised

- Should the first curated state addition cover only solid hover, or ship solid hover + active as a complete pair?
- Should the M2 depth role be named for visual hierarchy (`bg-raised`) or for Radix's role (`bg-component`)?
- Is the 4.53 light link-on-subtle contrast margin sufficient policy, or should the system target more headroom than WCAG AA?

## Suggested convention changes (if any)

- No immediate v3 correction is required. When state recipes are revisited, document that derived states are override-safe fallbacks, not expected approximations of every Radix curated step—light solid hover proves the distinction.
- If M2 validates neutral step 3, add the chosen surface role and its naming rationale in one change rather than introducing a numbered semantic alias.
