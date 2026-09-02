# Findings — T19 namespace + state reach

> Task: Rename the public markup protocol to `data-ds-*` and make field state reach anatomical.
> Date: 2026-09-02
> Files touched: `ds/tokens/semantic.css`, all six `ds/components/*.css`, eight top-level component/composition fixtures, three corpus fixtures, `docs/research/scale-rules/specimen.html`, and this note.

## 1. Namespace sweep

The pre-task inventory contained 633 exact legacy-name occurrences on 508 matching lines in 19
editable live files. This is larger than the brief's approximate baseline (about 480 in 18 files),
but the difference is source inventory, not scope creep: `semantic.css` and all three core corpus
roots are live protocol consumers. The post column counts the final namespaced spellings; increases
come from the new field probe and the two composition-battery theme-query hooks.

| Live file | Legacy occurrences before | Legacy after | Namespaced after |
|---|---:|---:|---:|
| `docs/research/scale-rules/specimen.html` | 35 | 0 | 35 |
| `ds/components/button.css` | 11 | 0 | 11 |
| `ds/components/card.css` | 14 | 0 | 14 |
| `ds/components/disclosure.css` | 8 | 0 | 8 |
| `ds/components/field.css` | 24 | 0 | 27 |
| `ds/components/rich-text.css` | 6 | 0 | 6 |
| `ds/components/stack.css` | 6 | 0 | 6 |
| `ds/tokens/semantic.css` | 2 | 0 | 2 |
| `fixtures/button.html` | 68 | 0 | 68 |
| `fixtures/card.html` | 76 | 0 | 76 |
| `fixtures/composition.html` | 147 | 0 | 148 |
| `fixtures/consumer-override.html` | 34 | 0 | 35 |
| `fixtures/corpus/longform.html` | 1 | 0 | 2 |
| `fixtures/corpus/perimeter.html` | 1 | 0 | 2 |
| `fixtures/corpus/technical.html` | 1 | 0 | 2 |
| `fixtures/disclosure.html` | 49 | 0 | 49 |
| `fixtures/field.html` | 80 | 0 | 96 |
| `fixtures/rich-text.html` | 13 | 0 | 13 |
| `fixtures/stack.html` | 57 | 0 | 57 |
| **Total** | **633** | **0** | **657** |

The final live-surface completeness command was:

```sh
rg -n 'data-ui|data-part|data-variant|data-size|data-gap|data-theme' \
  ds fixtures docs/research/scale-rules/specimen.html \
  docs/research/palette-rule/specimen.html docs/deriving.md
```

It produced no output. The repo-wide form now reports only the explicitly frozen record:
`CLAUDE.md`, `docs/conventions.md`, `docs/direction.md`, historical `docs/findings/*`,
`docs/reviews/api-review-2026-09.md`, and old/current task briefs. One additional grep hit is not a
legacy DS attribute: `docs/research/typestyles/specimen.html` uses the fixture-local hook
`data-theme-set`; it was verified and left untouched as required.

All axis selectors remain nested compound selectors under their component identity: 12 selector
occurrences, every one spelled `&[data-ds-variant|size|gap=…]` inside a
`[data-ds-ui="…"]` rule. No bare-axis selector shipped. Rich text's load-bearing lower boundary is
now `to (:scope [data-ds-ui])`. The corpus query scripts and the new composition/override query
hooks set `data-ds-theme`, and the corpus light/dark links were exercised successfully.

## 2. Field anatomy and the seven state hooks

The verified contract is `field > [data-ds-part="control"] > input|textarea`. The pre-existing
textarea layout rule already encoded the same direct-child anatomy. The seven state sources were
shipped as four consolidated selectors without changing precedence:

| Pre-fix hook(s) | Shipped selector |
|---|---|
| `&:focus-within` | `&:has(> [data-ds-part="control"] > :is(input, textarea):focus)` |
| `&:has(input:user-invalid)` | `&:has(> [data-ds-part="control"] > :is(input, textarea):user-invalid)` |
| `&:has(textarea:user-invalid)` | consolidated into the same `:is()` path |
| `&:has(input:disabled)` | `&:has(> [data-ds-part="control"] > :is(input, textarea):disabled)` |
| `&:has(textarea:disabled)` | consolidated into the same `:is()` path |
| `&:has(input:focus-visible) > [data-part="control"]` | `&:has(> [data-ds-part="control"] > :is(input, textarea):focus-visible) > [data-ds-part="control"]` |
| `&:has(textarea:focus-visible) > [data-part="control"]` | consolidated into the same `:is()` path |

The first path deliberately uses `:focus`, not `:focus-visible`: pointer focus changed the border
before T19, and a pointer-focus pass still resolved the direct frame to the focus colour. Invalid
remains after focus in source order, so danger still wins the border while the relocated focus ring
continues to compose.

The complete `ds/` inventory now contains five `:has()` selectors, all in `field.css`: one direct
textarea layout check and the four anatomical state selectors above. There are zero
`:focus-within` selectors and zero bare descendant input/textarea state hooks anywhere in `ds/`.

## 3. State-reach conformance probe

`fixtures/field.html` now has paired light/dark probe panels. Each outer field has one authoritative
direct email input plus a nested `[data-ds-ui="nested-control-probe"]` containing disabled,
invalid, and focusable native inputs.

Pre-fix, the latent bug was observable in both panels:

- The nested disabled input immediately set the outer control to `opacity: 0.5` and muted the outer
  label (`rgb(96, 100, 108)` light; `rgb(176, 180, 186)` dark).
- Native validation made the nested email `:user-invalid`, revealed the outer error, and changed the
  outer frame to its danger border. Because disabled follows invalid, the leaked disabled state also
  kept the outer label muted.
- Nested `:focus-visible` retained its own 2px/2px shared baseline but also put the same relocated
  2px/2px outline on the outer field control.

Post-fix, with the nested disabled/invalid/focus states all active:

- The outer label stays primary, the control stays at opacity `1`, the error stays `display: none`,
  and the outer border stays at its resting value (`rgb(205, 206, 214)` light;
  `rgb(67, 72, 78)` dark).
- A real Tab key event on the nested focus probe leaves the outer frame at `outline-style: none`;
  the nested input keeps the shared `2px solid` / `2px` focus baseline (`rgb(94, 177, 239)` light;
  `rgb(40, 112, 189)` dark).
- The direct input still drives the entire state recipe. Direct invalidity recolours the label,
  reveals the message, produces the danger border (`rgb(235, 142, 144)` light;
  `rgb(181, 69, 72)` dark), and relocates the 2px focus ring. Direct disabled controls remain at
  opacity `0.5`; direct keyboard focus suppresses the input outline and puts the shared ring on the
  frame in both schemes.

This is the single intended component-behaviour delta: nested state no longer reaches the outer
field. Existing direct-control behavior is unchanged.

## 4. Regression battery

The pre-change browser baseline was captured before the rename, on port 8070. The final pass used
query-versioned `index.css`/`core.css` imports for every imported stylesheet, then removed those
temporary query strings. This mattered: an intentionally discarded first pass reproduced T10's
stale-import failure mode (new markup against cached old selectors), proving the cache bust was
effective rather than ceremonial.

| Battery | Result |
|---|---|
| Composition, light + dark | Byte-identical: 117 nodes × 39 stable computed properties in each scheme |
| Consumer override, light + dark | Byte-identical: 18 nodes × 39 stable computed properties in each scheme |
| Six component fixtures | Button, card, field, rich text, stack, disclosure all retained their defining presentation; paired theme subtrees resolved correctly |
| Core corpus | Longform, technical, perimeter × light/dark = 6/6 styled passes through `core.css`; exactly one `data-ds-ui="rich-text"` and zero legacy identities per page |
| Scheme links | Corpus `?theme=light` / `?theme=dark` navigation changed `color-scheme`, canvas, text, and link roles correctly |
| Keyboard focus | Direct field relocation, nested focus locality, and corpus link 2px/2px focus treatment all present after real key events |
| Research | Scale-rules generated 140 namespaced component roots with zero legacy roots; palette-rule rendered eight styled scheme panels |
| Console | Zero warning/error entries in the verification tab |

An exploratory 41-property matrix also sampled used `inline-size`. It found only two deltas: the
`b2-collide-title` text and its button grew intrinsically because the required visible code string
changed from `data-part` to the three-character-longer `data-ds-part`. No CSS presentation value or
authored geometry changed; the stable computed-style matrix excludes these content-derived used
widths, as the T18-style identity contract intends.

Static gates also passed: `light-dark()` occurs only in `tokens/palette.css`; zero `!important`;
the canonical layer-order statement occurs only in `core.css`; `git diff --check` is clean.

## 5. Proposed convention wording

### §3 — markup protocol

Use `data-ds-ui="<component>"` for identity and scope boundaries,
`data-ds-part="<part>"` for direct-child anatomy, and component-local `data-ds-*` axes such as
`data-ds-variant`, `data-ds-size`, and `data-ds-gap`. An axis selector MUST be compounded with its
component identity, directly or through native nesting; a bare `[data-ds-size]`-style selector MUST
NOT appear. `data-ds-theme` is the coordinated subtree scheme switch.

### §7 — state reach

A state hook MUST name the complete anatomical path from the component root to its authoritative
state source. Bare descendant state observation is forbidden. `:focus-within` is reserved for a
component whose specified behavior intentionally aggregates focus from every descendant, including
nested component ownership; it is not shorthand for a known control part.

### §5a / §11 — coordinator and fixtures

Replace every normative or example mention of `data-theme` with `data-ds-theme`. Fixture scheme
links/scripts must set that exact attribute; research-only controls whose names merely contain the
substring (for example `data-theme-set`) are outside the DS protocol and should be identified with
boundary-aware linting.

### Confirmed linter candidates

1. Reject legacy protocol attributes on live CSS/HTML/example surfaces.
2. Reject bare axis selectors; require identity compound/nesting.
3. Reject stateful descendant `:has()` paths that do not traverse marked direct anatomy.
4. Flag `:focus-within` unless the component records intentional any-descendant aggregation.

## 6. Typestyle landing handoff

The typestyle landing must author only the new protocol spellings. Any new component/type-consumer
markup uses `data-ds-ui` / `data-ds-part`; scheme contexts use `data-ds-theme`. The dynamic
scale-rules specimen templates are already migrated and proved styled. The current typestyle
specimen's `data-theme-set` buttons are local UI hooks, not DS scheme attributes; do not mechanically
rename them, and make future completeness grep boundary-aware so they are not reported as stale API.

## Conventions that held

Direct-child anatomy made the correct state path mechanically derivable, native state remained the
authority, invalid-after-focus precedence survived consolidation, layered consumer override behavior
remained identical, and the rich-text identity boundary moved coherently with the identity rename.

## Friction / surprises

The live occurrence count exceeded the estimate, the typestyle specimen exposes a harmless
`data-theme-set` substring false-positive, and imported CSS caching can perfectly mimic an incomplete
namespace sweep. Query-versioning every import edge was necessary for trustworthy browser evidence.

## Open questions raised

None for T19. The normative contract task should decide the precise lint syntax for intentional
`:focus-within` exemptions and boundary-aware legacy-name matching.
