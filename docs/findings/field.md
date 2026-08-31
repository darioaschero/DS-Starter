# Findings — T7 Field

> Task: build the field component as the reference for native state presentation, focus relocation, and non-axis recipe consumption.
> Date: 2026-08-31
> Files touched: `ds/components/field.css`, `fixtures/field.html`, `docs/findings/field.md`

## What was built

- A direct-child field anatomy with a native label, a framed control containing a visually bare input or textarea, optional description, and conditionally presented error.
- A root column gap of `--ds-space-1`. The 4px rhythm keeps label, frame, and supporting copy visibly associated without adding a field-specific spacing token.
- A geometry-only `data-size="sm" | "md"` axis. The base md control is 2.75rem tall with space-3 inline padding; sm is 2.25rem with space-2. Input typography remains `--ds-type-body-md` at both sizes to keep form text stable at 16px and avoid mobile zoom-on-focus.
- The shared outline recipe bound directly in the base rule, without introducing a variant axis. Public `--ds-field-bg` and `--ds-field-border-color` values resolve over those frame channels.
- Native focus-within, user-invalid, and disabled selectors. Invalid follows focus in source order and therefore wins when both rebind the frame channel. The invalid state also turns the label danger-coloured and reveals the error. The fixture uses a native form-validation request to set the platform's user-validity flag without script.
- A keyboard-only focus ring relocated from the bare native control to the visual frame. Pointer focus still receives the focus-within border change without the outer ring.
- A fixture covering defaults, unsupported values, native state, textarea growth, context and instance overrides, field-on-card nesting, and pinned light/dark subtrees.

## Verification results

- The final baseline battery passed 22/22 computed-style assertions: attribute-less and unsupported sizes equal md; md is 44px / 12px inline padding; sm is 36px / 8px; input typography remains 16px body-md; the textarea is visually bare and expands above its 44px minimum; disabled opacity/cursor resolve; and errors begin hidden.
- Resting borders resolved to `--ds-border-default` in dark (`rgb(67, 72, 78)`) and light (`rgb(205, 206, 214)`). Focus-within resolved to each scheme's `--ds-focus-color`; the relocated control outline was 2px solid at 2px offset in both schemes, while the inner input outline was none.
- Real invalid form-validation attempts produced `:user-invalid` in both schemes. Invalid won while the control remained focused: dark danger border `rgb(181, 69, 72)`, light `rgb(235, 142, 144)`, with the corresponding error displayed. Hidden-to-shown behavior was verified.
- The inherited background override resolved to dark `rgb(13, 40, 71)` and light `rgb(230, 244, 254)`. The instance border override remained `rgb(0, 144, 255)` through focus and user-invalid while label/error presentation still changed, confirming the chosen public-over-state precedence.
- Static checks found zero `!important`, zero local `@layer`, zero palette/active-step or retired-token references, one fixture style block, no duplicate IDs or broken label/description references, and only component-qualified internal properties. The browser reported zero warnings or errors.

## Conventions that held

- The outline recipe's bg/fg/border contract mapped cleanly to a control frame even though the field has no variant axis. This confirms recipes are reusable visual contracts rather than attribute-bound component options.
- Resolved channels kept the control declarations independent of where the value came from. Axis selectors only touch geometry channels; native-state selectors only touch the frame border channel.
- Direct-child part selectors were sufficient for the shallow fixed anatomy. The native input and textarea are selected only as immediate children of the direct-child control part.
- The attribute-less and unsupported-size fallback model required no extra selectors. `data-size="md"` remains a no-op marker.

## Friction / surprises

### 1. Control-height token verdict

Field is now the second control to repeat button's 2.75rem / 2.25rem pair. Wait for a third control before promoting it: two consumers establish a plausible pattern, but disclosure may not behave like a bounded form control and the current milestone deliberately freezes shared tokens. If a third independently designed control repeats the pair, add `--ds-control-height-sm: 2.25rem` and `--ds-control-height-md: 2.75rem` to the non-colour scale, then migrate button and field together. The names should describe control geometry, not component size axes.

### 2. Outline recipe fit

The bg/fg/border contract held. Background and border map directly to the frame, and fg gives the bare native control a reliable text colour. The awkward part is that the recipe background is transparent: on canvas and on `--ds-bg-subtle`, the field inherits the underlying depth instead of reading as its own component surface. That is not a channel-contract failure, but it exposes the unresolved surface-role question. Focus and invalid border colours also remain semantic state concerns rather than recipe channels, which is appropriate because they are not outline-variant interaction states.

### 3. Focus relocation vs conventions §8

The relocation is acceptable because keyboard focus remains visible, uses the shared treatment unchanged, and moves to the element that actually owns the visual boundary. Proposed exact addition to §8:

> A component may suppress a descendant's baseline `:focus-visible` outline only when it re-expresses the same shared focus treatment, under the same `:focus-visible` condition, on the component part that owns the visible interactive frame. Relocation must not make focus indication pointer-only, state-independent, or absent.

This permits designed relocation while retaining the prohibition on removal.

Browser evidence adds one precision: Chromium matches `:focus-visible` for pointer-focused text-entry controls because they accept keyboard input. “Keyboard-only” therefore means the ring is gated by the browser's focus-visible heuristic, not that every mouse click is guaranteed to suppress it. The fixture states that distinction instead of promising a strict pointer/keyboard split CSS cannot provide here.

### 4. State channels + public overrides

Implemented precedence: public border override beats native state. The resolved channel is `var(--ds-field-border-color, var(--_ds-field-frame-border-color))`; focus and invalid rebind the frame channel, while a consumer who explicitly sets the public property remains authoritative. This follows the existing public-override contract literally and makes the outcome predictable, but it means a careless override can mask the danger border (the label and error still convey invalid state, and keyboard focus still has the outer ring).

Conventions should codify native-state rebinding as a first-class §6/§7 pattern, and should make this precedence choice explicit rather than accidental. Recommended rule for the current public API: state selectors rebind internal state/frame channels; resolved public properties remain last-mile overrides. If preserving semantic state colour is considered non-negotiable, introduce a separate public state API such as `--ds-field-invalid-border-color` rather than silently making a base override lose in some states.

### 5. Surface-depth evidence

On `--ds-bg-subtle`, the transparent field frame reads as a bordered region cut into the card, not as a distinct control surface. It remains legible in both schemes, but the dark composition is especially flat. This supports adding a neutral-step-3 component surface. `--ds-bg-component` is the more accurate candidate name than `--ds-bg-raised`: the desired distinction is component affordance and nesting depth, not a universal promise of physical elevation. If promoted, the outline recipe background could consume it after validating that the light scheme does not become visually heavy.

### 6. Missing vocabulary

- Add `--ds-type-body-sm` if a second component needs compact supporting copy. Field descriptions/errors at body-md are readable but visually prominent beside a label-md; one component alone is not enough evidence to expand the role set.
- Do not add a danger focus ring yet. The normal shared focus ring remains a stable keyboard-location cue while the danger border communicates validity. A danger ring would combine two meanings and needs contrast testing across schemes.
- The likely shared geometry addition is the control-height pair described above. Inline padding is less ready for promotion: button and field legitimately use different horizontal space at the same nominal size.
- If public overrides must preserve semantic states, the missing vocabulary is component state overrides (`--ds-field-focus-border-color`, `--ds-field-invalid-border-color`), not more global colour semantics.

## Open questions raised

- The current HTML Standard initializes the user-validity flag to false and explicitly sets it during form submission. Chromium therefore kept an edited standalone email at `:invalid`, not `:user-invalid`, after blur. The fixture now requests native validation through a real form submission attempt, which is canceled by constraint validation and produces the intended state without script. Conventions and test briefs should avoid treating blur alone as a portable trigger. See the [HTML form-control infrastructure](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#the-user-valid-pseudo-class-user-valid).
- Should public base-colour overrides have authority over semantic component states, or should state-specific public properties be required for that authority?
- Should the outline recipe itself adopt a future `--ds-bg-component`, or should fields bind that surface locally while other outline consumers stay transparent?
- Does a third bounded control repeat the shared height pair strongly enough to promote it now?

## Suggested convention changes (if any)

- Add the focus-relocation wording above to §8.
- Add a §6/§7 native-state recipe: selectors rebind component-qualified state/frame channels, states appear in explicit precedence order, and rendered declarations consume resolved channels only.
- Document public-versus-state precedence for every stateful public colour API. The current field implementation treats public values as final overrides; a future alternative should require explicit state override properties rather than changing precedence invisibly.
