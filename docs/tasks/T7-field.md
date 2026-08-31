# T7 — Field

> **Goal:** the form-field component — reference implementation for **native state presentation** (`:focus-within`, `:has(input:user-invalid)`, `:has(input:disabled)`) and the **first consumer of the shared `outline` recipe** on a non-button component.
> **Runs in parallel with T8 (disclosure) and T9 (stack).** File sets are disjoint — stay strictly inside yours.

## Read first, completely, in this order

1. `docs/conventions.md` (v3 — normative; §5a colour chain, §6 component pattern incl. resolved channels, §7 state chain, §8 focus)
2. `docs/direction.md` — §12 (native state, ARIA, focus) and §18 (evaluation goals)
3. `docs/findings/m1-synthesis.md` §5 (what M2 may assume) and §3 rows 3, 4, 10
4. `docs/findings/color-architecture.md` (recipes, derived states, the `bg-component` surface candidate)
5. `ds/components/button.css` (the leaf reference: channels, resolved channels, states) and `ds/components/card.css` (parts reference)

## Files you may create/edit — ONLY these

`ds/components/field.css` (currently a stub) · `fixtures/field.html` (currently a stub) · `docs/findings/field.md` (new, from `TEMPLATE.md`).

**Frozen for this task** (parallel sessions + coordinator own them): `ds/index.css` (field.css is already imported), all `ds/tokens/*`, `ds/reset.css`, other components, other fixtures — including `fixtures/composition.html` (a later integration task extends it) — `docs/conventions.md`, `CLAUDE.md`, other findings, `docs/tasks/`. If you need a new token, role, or recipe channel: use the closest existing one and **propose** the addition in findings — never edit token files. **No commits.**

## Component contract

### Anatomy (parts are direct children of the root — conventions §3)

```html
<div data-ui="field">
  <label data-part="label" for="email">Email</label>
  <div data-part="control">
    <input id="email" type="email" required>
  </div>
  <p data-part="description">Optional helper text.</p>
  <p data-part="error">Please enter a valid email address.</p>
</div>
```

- The **control** part is the visual "input box": it carries frame bg/border, radius, height, padding, and holds the native `<input>` (or `<textarea>` — see fixture). The native input inside the control is visually bare: no border, no background, `inherit` typography, `width: 100%`; the frame belongs to the control.
- `label` uses `--ds-type-label-md`. `description` and `error` use `--ds-type-body-md` (there is no smaller body role yet — required findings question #6). `error` is `display: none` by default and shown only in the invalid state; it uses `--ds-text-danger`. `description` uses `--ds-text-muted`.
- Root is a small column layout (`display: flex; flex-direction: column`) with a tight gap (`--ds-space-1` or `--ds-space-2` — your call, record it).

### Base look — the outline recipe

Field has **no `data-variant` axis**. Its frame consumes the shared `outline` recipe directly in the base rule — this deliberately tests that recipes are decoupled from axes:

```css
--_ds-field-frame-bg: var(--ds-variant-outline-bg);
--_ds-field-frame-fg: var(--ds-variant-outline-fg);
--_ds-field-frame-border-color: var(--ds-variant-outline-border);
```

### Axes

`data-size: sm | md` (md default, implemented ONLY in the base rule; `&[data-size="sm"]` rebinds every size channel; `&[data-size="md"]` is a no-op marker). Size owns control height, control padding-inline. Heights align with button's control literals: md `2.75rem`, sm `2.25rem`. Input text stays `--ds-type-body-md` at **both** sizes (16px also avoids mobile zoom-on-focus); the size axis is geometry-only — record this choice.

### States (the point of this task) — native selectors rebinding state channels

State selectors on the root rebind the frame channels; the control consumes resolved channels only (conventions §6):

- `&:focus-within` → `--_ds-field-frame-border-color: var(--ds-focus-color)`
- `&:has(input:user-invalid)` → `--_ds-field-frame-border-color: var(--ds-border-danger)`, show `[data-part="error"]`, label may take `--ds-text-danger` (your call, record it)
- `&:has(input:disabled)` → `opacity: var(--ds-disabled-opacity)` on the control (and muted label), `cursor: default`
- Precedence: invalid must win over plain focus-within where both apply while focused — order the rebinds accordingly and verify it.

### Focus indication — designed relocation

The shared `:focus-visible` ring on a bare inner input draws inside the frame and doubles with the border treatment. Designed approach:

- Suppress the inner ring **only inside the field**: `& input:focus-visible { outline: none; }`
- Re-express it on the frame, keyboard-only: `&:has(input:focus-visible) > [data-part="control"] { outline: var(--ds-focus-outline); outline-offset: var(--ds-focus-outline-offset); }`
- Mouse focus still gets the `:focus-within` border-color change.

This *relocates* rather than removes indication, which conventions §8 does not explicitly sanction — required findings question #3 evaluates it and proposes §8 wording.

### Public API

Minimal, leaf-pattern: `--ds-field-bg`, `--ds-field-border-color` resolved as `public → frame channel`, consumed via resolved channels (`--_ds-field-resolved-*`) everywhere including state rules… careful: state selectors rebind the **frame channel**, and the resolved channel computes `public → frame`, so a public border-color override beats state changes. Decide which precedence is right (state beats public, or public beats state?), implement ONE deliberately, and make it required findings question #4's centrepiece — this is a genuinely new pattern question M1 never had to answer.

## Fixture — `fixtures/field.html`

Canonical §11 chrome; inline styles only. Sections: sizes + attribute-less twin; unsupported `data-size="xl"`; description + error anatomy; invalid (an `<input type="email" required>` — note `user-invalid` needs real interaction; verify by typing via the browser tools); disabled; keyboard focus vs mouse focus (ring vs border-color); `<textarea>` in a control (does the frame generalize? min-height instead of height); public override demo (context + instance); **field-on-card** nesting probe (frame on `--ds-bg-subtle` — evidence for the surface-depth question); `data-theme` subtree boxes.

## Verification battery (required, both schemes)

Serve the repo root on port **8041** (own browser tab; kill server + close tab when done). Computed-style assertions: attribute-less === md; `xl` === md; frame border = `border-default` at rest, `focus-color` on focus-within, `border-danger` when invalid (drive a real invalid state: focus, type an invalid value, blur, assert); error paragraph hidden↔shown; disabled opacity; keyboard ring on control at 2px/2px in both schemes; input typography stable at both sizes; overrides behave as designed. Greps on your file: zero `!important`, zero `@layer`, every property `--ds-`/`--_ds-field-` prefixed, no palette/active-step references (semantic + recipe tokens only), no retired names. Zero console errors.

## `docs/findings/field.md` — required questions

1. **Control-height token verdict**: field is the second control repeating `2.75/2.25rem`. Promote a shared control-height scale now, or wait for a third? Concrete proposal either way.
2. **Outline recipe fit**: did the shared recipe contract (bg/fg/border) hold for a field frame? What was missing or awkward?
3. **Focus relocation vs §8**: is the designed relocation acceptable? Propose exact §8 wording that permits relocation while still forbidding removal.
4. **State channels + public overrides**: which precedence did you implement (public vs state) and why; should conventions codify "native-state selectors rebind state channels" as a first-class §6/§7 pattern?
5. **Surface depth evidence**: how does the field frame read on `bg-subtle` (field-on-card)? Does it support the `bg-component`/`bg-raised` (neutral-3) candidate?
6. **Missing vocabulary**: smaller body role for description/error (`--ds-type-body-sm`?), danger focus ring?, anything else — propose, don't implement.

## Done means

All battery checks pass in both schemes · fixture complete · findings note answers all six questions · only your three files touched · nothing committed · closing report (what was built, verification results, the six answers in brief).
