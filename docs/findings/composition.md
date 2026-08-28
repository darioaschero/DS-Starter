# Findings — T5 Composition

> Task: composition & synthesis — the direction §18 nested fixture plus adversarial probes, the consumer-override fixture, the full verification battery, and the M1 synthesis.
> Date: 2026-08-28
> Files touched: fixtures/composition.html, fixtures/consumer-override.html, fixtures/index.html (reconciled), docs/findings/composition.md, docs/findings/m1-synthesis.md

## What was built

- `fixtures/composition.html`: canonical §11 chrome; four sections. (1) The §18 fixture verbatim in spirit — rich-text article (h2, paragraphs with strong/em/link/inline code) containing a card (title/body/actions + soft-sm and solid-md buttons with labels) and a `details data-ui="disclosure"` (M2 stub, visibly noted). (2) Five adversarial probes from T3/T4 findings: wrapped part, colliding `data-part="title"` inside a button (with an inline `--ds-button-font: 500 15px/1.2 serif` as inheritance discriminator), outer `--ds-card-bg` override over a nested card (plus control pair), dual-role `div data-ui="probe" data-part="actions"`, and rich-text-in-rich-text with an outer `--ds-rich-text-h2-font` override. (3) Discriminated composition: a copy of the §18 structure under a wrapper setting `--ds-rich-text-body-font: var(--ds-type-label-md)`. (4) A focus-walk inventory of all ten interactive elements in tab order.
- `fixtures/consumer-override.html`: canonical chrome + a second commented section in the same single `<style>` block (`consumer application CSS — deliberately unlayered`, the specimen under test). Five cases, each beside an unmodified control: §14's `.checkout-action` radius (0,1,0); bare `button` background/color at (0,0,1) (page-scoped via `:where(#case-2)`, which adds zero specificity); `:where(.quiet-card)` at (0,0,0); `.marketing a` prose retheme; and the plain-CSS vs `--ds-button-bg` side-by-side.
- `fixtures/index.html` reconciled: §11 canonical chrome (T1's frame-only chrome + inline body font replaced), page-status labels per component (M1 built / M2 stub / M1 verification). Token-specimen content untouched.
- Verification battery (Chromium pane, statically served on :8024, light and dark emulated per tab): ~40 computed-style assertions on composition + 8 per scheme on consumer-override, native-disclosure toggle assertions, a 10-stop keyboard focus walk with screenshots, full-page screenshots of both fixtures in both schemes, zero console errors on both pages, and `grep -r '!important' ds/` → zero matches. Full results in `m1-synthesis.md` §1; highlights below.

## Conventions that held

- **Part containment held under real composition, exactly as T3's contract predicts.** Wrapped title → UA values (700 / 18.72px), untouched by the card. Colliding `data-part="title"` inside the button → 500 15px serif, i.e. it followed the button's inline font override (inheritance), not the card's title recipe (600 / 19px sans) — the serif probe discriminates targeting from inheritance. Dual-role element → styled as the outer card's actions part (`display: flex`, gap 8px).
- **@scope containment held under the discriminating override.** With the wrapper forcing prose body to label-md: prose paragraphs computed 500 16px/19.2px, while the card body stayed 400 16px/24px and the sm button label stayed 13px in both schemes. That separates "not targeted" from "same value by coincidence" — the trap T3 named.
- **Inherited context overrides behaved exactly as conventions §6 documents, twice.** `--ds-card-bg` on the outer card recolored outer *and* nested card (accent-surface in both schemes; controls stayed surface-2). `--ds-rich-text-h2-font` on the outer article changed the inner article's h2 too (both 28px): outer *selectors* cannot cross the scope boundary, but the custom property inherits and the inner scope's own rule reads it.
- **Native state needed nothing.** The stub disclosure toggled `open` false→true→false via summary activation in both instances and both schemes, with zero component CSS.
- **The shared focus baseline covered the entire composition page with no per-component tuning:** 10/10 stops in exact DOM order, each `:focus-visible` with `2px solid` accent-9 (light) / accent-8 (dark) at offset 2px — links, both button sizes, the serif probe button, and both summaries.
- **The consumer contract is real at every specificity.** All five cases held in both schemes, including the (0,0,0) `:where(.quiet-card)` beating the starter's (0,1,0) card rule. Precondition confirmed: zero `!important` anywhere in `ds/`.
- **§11 canonical chrome scaled.** Both new pages (the heaviest fixtures yet) needed exactly one `<style>` block; all other presentation fit in inline `style` attributes without strain.

## Friction / surprises

- **Embedded components get no prose rhythm.** The §18 fixture itself shows it: the card sits at `margin-block-start: 0` between two spaced paragraphs, because the rhythm subjects in `ds/components/rich-text.css:82` are deliberately named prose elements only. Working as designed — and the design leaves "space before/after an embedded component" unowned. Made visible and labeled in the fixture rather than masked with an inline margin. Candidate owners: a `* + [data-ui]`-style rhythm subject in rich-text, the M2 layout primitive, or explicitly the consumer. Needs a checkpoint decision (m1-synthesis §3).
- **Discriminator values must be chosen against every nested component's own resolution.** The chosen discriminator (label-md) coincides with the md button's label font, so for that one element the assertion is vacuous — a leak would be invisible. The sm label (13px vs a leaked 16px) is the decisive probe. Lesson for future fixtures: before trusting a "did not change" assertion, check the discriminator differs from the nested element's correct value.
- **The wrapped-part quiet failure reconfirmed at composition scale:** UA h3 700/18.72px beside heading-sm 600/19px is nearly invisible in a screenshot. The part-depth linter rule stays the real enforcement.
- **Internal channels really do reach nested components.** `--_ds-card-size-title-font` is readable *on the button* inside the card (computed: `600 1.1875rem / 1.3 system-ui…`) — inherited, unconsumed, harmless. T2 predicted reach-without-collision; composition confirms it. The qualification convention, not any isolation mechanism, is what keeps this inert.
- **Driver limitations, again:** the pane's synthetic `hover` does not trigger `:hover` (`matches(':hover')` stays false) — reused T2's workaround of resolving the state `color-mix` expression inline in the element's own var context (light: oklch(0.878 0.037 164); dark: oklch(0.386 0.047 165.5)); exact but indirect. A batched Tab keypress immediately after `navigate` fired before load and landed on `<body>` — re-pressed after settling. Tall-viewport screenshots intermittently failed (`UnknownVizError`) or came back blank right after scrolling (T3/T4 hit the same); retry-after-wait and JS `scrollTo` + normal viewport were the reliable pattern. `ctrl+Home` does not scroll the macOS pane.

## Open questions raised

- Who owns spacing of embedded components in prose flow (rich-text rhythm, layout primitive, or consumer)? — the one §18-fixture behavior that reads as unfinished.
- Should the fixture/verification idiom be written down: discriminating overrides for inheritance-vs-targeting, discriminator ≠ any nested resolved value, and inline resolution of state expressions where `:hover` cannot be synthesized?
- T2's "forced state" specimen idea gains weight: a static row applying the hover/active declarations would make state shades screenshot-able and regression-testable without synthetic pointers.

## Suggested convention changes (if any)

- §9 (or the M2 stack brief): record the embedded-component spacing decision once made; today's behavior (no margin) should be stated either way so it reads as chosen, not forgotten.
- §11 process rules: add the two verification idioms above so later tasks stop rediscovering them (T2, T3, T4 and T5 each hit at least one).
