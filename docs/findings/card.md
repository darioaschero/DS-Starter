# Findings — T3 Card

> Task: card component — reference implementation for named parts (`data-part`) and part containment; both candidate containment techniques implemented and browser-tested before choosing.
> Date: 2026-08-28
> Files touched: ds/components/card.css, fixtures/card.html, docs/findings/card.md

## What was built

- `ds/components/card.css`: `[data-ui="card"]` with title/body/actions parts, `data-size` axis (sm/md/lg, md implemented only in the base rule, `&[data-size="md"]` as no-op marker), three size channels (`--_ds-card-size-padding|gap|title-font`), public API `--ds-card-bg|padding|radius`, base constants surface-2 / 1px border-1 / radius-lg / column flex with gap channel. Parts establish their own typography (title = title-font channel, body = body-md, actions = flex row, gap space-2).
- `fixtures/card.html`: canonical chrome; sections for sizes + no-attribute, unsupported `xl`, nested buttons, card-in-card, wrapped part, public overrides.
- Verified in Chrome via computed styles and screenshots in **both** schemes (light and dark emulated per tab): sm 12px/8px/19px, md 24px/12px/19px, lg 32px/16px/23px; no-attribute card === md in padding, gap, and title font; `xl` === md; dark scheme flips to gray-11 card surface / gray-10 border / gray-1 text; public overrides resolve (accent-surface bg, 4px radius, and `--ds-card-padding: space-2` beating the lg channel's 32px). No console errors.

## Containment comparison (first-class deliverable)

Both techniques were fully implemented in `card.css` and measured against the same fixture, in this order: B first, then A (kept).

- **A — direct-child combinators:** `& > [data-part="title"]` etc., nested in the component block.
- **B — `@scope ([data-ui="card"]) to (:scope [data-ui])`** with `:where([data-part="…"])` rules inside, as a second top-level block (an `@scope` with prelude cannot sit inside the base rule, so the recipe splits in two).

Observed behavior (computed styles, Chrome):

| Case | A direct-child | B @scope |
|---|---|---|
| Canonical parts (direct children), all sizes | styled | styled |
| Button `[data-part="label"]` inside actions | not touched | not touched |
| Colliding name deep inside a nested component (`span data-part="title"` inside a button) | contained (500 16px = button's inherited font, not 600 19px) | contained |
| Card-in-card (outer lg, inner no attribute) | inner title 19px from inner md channel, outer 23px; paddings 24 vs 32px; no double-apply | identical result |
| Title wrapped in one plain `<div>` | **not styled** (UA h3: 700 18.72px) | **styled** (600 19px) |
| Title wrapped in two plain divs | not styled | styled |
| Nested component root that itself carries an outer part name (`<div data-ui="zzz" data-part="actions">` as card child) | **styled as the outer card's part** (flex, gap 8px; title variant gets 600 19px) | **not styled** — the scoping limit is exclusive, so the outer card cannot address a nested component's root as its own part |
| Card root itself carrying `data-part="title"` | not matched (child combinator cannot match the root) | not matched — observed: a bare `:where([data-part])` inside `@scope` does not match the scoping root in Chrome |

Both techniques are **equally leak-proof on the actual containment vectors** (nested component interiors, card-in-card, colliding part names). They differ only at the contract margins: B tolerates wrappers at any depth; A uniquely allows a "dual-role" element (nested component root that is simultaneously an outer part) to be styled by the outer component.

**Chosen: A (direct-child).** Reasons:

1. Containment parity where it matters, so ergonomics decide: A keeps the whole recipe in one nested block (channels declared at the top, consumed by parts below); B splits the component into two top-level constructs with subtler semantics (in-scope matching, exclusive limits, scope proximity).
2. The direct-child contract is trivially explainable and statically lintable ("a part element must be a direct child of its component root").
3. Dual-role parts stay expressible — plausibly needed later (e.g. a media part that is itself an image/figure component).
4. The wrapped-part miss is the honest cost; see the caveat below.

**Wrapped-part contract recommendation:** parts sit as direct children of the card root; consumers wrap content *inside* a part, never around one. A wrapped part renders unstyled by design. Caveat discovered in the fixture: this "loud failure" is actually **quiet** for the title — UA h3 (700, 18.72px) is visually close to heading-sm (600, 19px) — so the contract needs the future linter (markup check: part depth) rather than relying on visual breakage. Frameworks that inject wrapper elements are the strongest argument for B; if wrapper tolerance is ever required *together with* dual-role parts, the refined limit `@scope (…) to (:scope [data-ui] > *)` (boundary at the children of nested roots, keeping the roots themselves addressable) is the candidate to test — not exercised in this task.

**Recommendation for direction §17 ("whether `@scope` is required outside rich text"):** No — for components with fixed, shallow, canonical anatomy, direct-child combinators contain completely and read better. `@scope` earns its complexity where content depth is unbounded or arbitrary wrappers must be tolerated (rich text; possibly deep-anatomy components later). Useful observed `@scope` facts for whoever builds rich-text: limits are exclusive (the limit element itself is already out of scope); a bare selector inside `@scope` does not match the scoping root; `:where()` keeps scoped rules at specificity 0.

**Testing trap worth recording:** an `inline-flex` nested component root blockifies to computed `display: flex` when it becomes a flex item of the card's column stack — during the B round this masqueraded as "@scope styled the limit element" until re-probed with a made-up `data-ui="zzz"` component. Containment probes should use inert component names, and computed-`display` evidence near flex containers is untrustworthy.

## Conventions that held

- The §6 recipe pattern mapped onto card without strain: channel defaults → resolution → axis rebinds → no-op default marker → parts. The no-attribute and unsupported-value cases fell out of the base rule for free (verified equal to md).
- The three-channel size axis felt right-sized: padding/gap/title-font are exactly the things a card size should own, and no cross-axis interaction appeared. One wrinkle: sm's title font equals the base value (heading-sm). I rebound it explicitly anyway so each non-default axis value reads as a complete recipe and cannot drift if the base changes — conventions are silent on same-as-default rebinds in non-default selectors; worth a stated policy (see below).
- Public → channel → semantic resolution behaved exactly as specced, including the padding case where the public property must beat an axis channel (space-2 over lg's space-6).
- Parts establishing their own typography works: every part's font is self-sufficient, so the card needs nothing from prose context (title 600 19px/24.7px, body 400 16px/24px regardless of surroundings).

## Friction / surprises

- **Public overrides are subtree context overrides, not instance overrides.** Setting `--ds-card-bg: rgb(1,2,3)` inline on the outer card also recolors the *nested* card (verified) — custom properties inherit, and the inner card's `var(--ds-card-bg, …)` picks up the inherited value before its own channel. This matches direction §10's "public instance **or context** override" reading and is technique-independent (A and B identical). It is arguably a feature (subtree theming) but will surprise consumers who think they styled one card. Registering the public props with `inherits: false` would kill legitimate context theming, so I left it — but the system should *state* this semantics somewhere normative.
- The wrapped-part failure mode is visually subtle (see containment section) — the contract depends on the linter, not on obvious breakage.
- **Card-in-card has no surface depth:** inner and outer both use surface-2, so nesting reads only through the border. The token set has no surface-3 / raised-surface step (foundations already flagged how few dark in-between steps exist). Fine for the prototype; will matter for real nesting.
- The actions row needed `align-items: center` and `flex-wrap: wrap` beyond the specced `display: flex; gap: space-2` — differently sized buttons otherwise stretch (flex default) and long rows overflow small cards. Recorded as minimal additions rather than API.
- Button.css landed mid-verification (parallel task) — good accident: it upgraded the nested-buttons check from "unstyled stub" to a real two-component composition, and containment still held. The label check needed an inheritance-discriminating probe (force an inline font on the button; the label followed it → no card rule targets the label directly), because inherited page typography and card body typography compute to identical values.

## Open questions raised

- **Do parts need public overrides (e.g. `--ds-card-title-font`)?** I argue not yet: the public API should stay box-level (bg/padding/radius) while typography variation is already covered by the size axis, and unlayered consumer CSS can restyle a part directly with zero specificity fight (that *is* the layer contract). Per-part public properties scale as parts × properties per component and would mostly duplicate what consumer CSS does better. Revisit only if the rich-text/composition tasks show consumers needing to retheme part typography *without* writing a selector (e.g. passing a card into a context they don't control).
- Should conventions state a policy on rebinding a channel to the same value as the base default inside a non-default axis selector (explicit completeness, as done here, vs. minimal diff)? A linter needs to know which one is the smell.
- Is "public override = subtree override" the intended contract, and should any component ever get `inherits: false` public props?
- Does the token set need a nested-surface alias (surface-3) for component-in-component depth?
- Suggested additions to direction §18's composition fixture, revealed here: (1) a wrapped-part case, (2) a colliding part name inside a nested component (the strongest leak probe — the current §18 fixture has no name collisions), (3) a public override on an outer component checked against a nested instance of the same component, (4) a dual-role element (nested component root carrying an outer part name).

## Suggested convention changes (if any)

- §3 (markup contract): make part placement explicit — "parts are direct children of their component root" (or: each component's header comment must state its part-depth contract). Today §3 only says parts must not *reach into* nested components, which both tested techniques satisfy while implying different markup contracts.
- §6 (recipe): add one line on same-as-default channel rebinds in non-default axis selectors (allow and prefer explicit completeness, or forbid — either way the linter gets a rule).
- §9/§10 area: record the observed `@scope` semantics (exclusive limits; bare selectors don't match the scoping root; `:where()` for zero specificity) as shared knowledge for the rich-text task, plus the §17 recommendation that `@scope` is not required for shallow fixed anatomy.
- Somewhere normative: state that public component properties are inherited context overrides (outer instance overrides affect nested instances of the same component) so consumer-facing docs don't have to discover it.
