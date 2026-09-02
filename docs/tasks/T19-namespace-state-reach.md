# T19 — namespace `data-ds-*` + anatomical state reach

> **Working directory: `/Users/darioaschero/Documents/dev/DS-Starter` (main checkout, branch `main`).** Run `pwd` first.
> **Goal:** execute two decisions from the 2026-09 external API review (`docs/reviews/api-review-2026-09.md`): (1) the **approved namespace rename** `data-ui`/`data-part`/`data-<axis>` → `data-ds-ui`/`data-ds-part`/`data-ds-<axis>`; (2) the **confirmed state-reach fix** — field's bare-descendant `:has()`/`:focus-within` state hooks become explicit anatomical paths.
> Result contract: **zero computed change for every existing composed case** (battery identity, T18-style) — with exactly ONE intended behavioral change, in a case no current fixture composes: a nested component's form control must no longer drive the outer field's state. A new probe proves it.

## Read first, completely, in this order

1. `docs/reviews/api-review-2026-09.md` — the triage block + review §1 (state reach, with the exact selector forms) and §2 (namespace rationale and the compound-selector invariant)
2. `docs/conventions.md` — §3 (markup contract), §6 (component recipe), §7 (state), §8 (focus relocation), §12 (M4 state)
3. `CLAUDE.md` — current status
4. `ds/components/field.css` — lines ~100–150 are your §2 surface; note line 72 is ALREADY anatomical
5. `fixtures/composition.html` + `fixtures/consumer-override.html` (the batteries you must keep computed-identical)

## Files you may create/edit — ONLY these

Edit (sweep §1): every `ds/*.css` and `ds/**/*.css` · every `fixtures/*.html` and `fixtures/corpus/*.html` · `docs/research/scale-rules/specimen.html` and `docs/research/palette-rule/specimen.html` **if** they carry the attributes (they load the real `ds/` CSS — a stale name silently unstyles them; verify by grep) · `docs/deriving.md` (code examples only).
Edit (state reach §2): `ds/components/field.css` · `fixtures/field.html` (new probe section §3).
Create: `docs/findings/namespace-state-reach.md` (from `TEMPLATE.md`).
Frozen: `CLAUDE.md`, `docs/conventions.md`, `docs/direction.md`, ALL existing `docs/findings/*` (historical record — stale names in findings are correct history, do NOT sweep), `docs/reviews/`, briefs, `docs/research/typestyles/` (carries no `data-*` attributes — verify, don't edit). No commits.

## 1. The rename (mechanical, complete, provable)

Map — attributes only, in selectors, markup, JS probe strings, and prose that names them as code:

- `data-ui` → `data-ds-ui`
- `data-part` → `data-ds-part`
- `data-variant` → `data-ds-variant` · `data-size` → `data-ds-size` · `data-gap` → `data-ds-gap`
- `data-theme` → `data-ds-theme` (coordinator-included for API coherence with the review's own §6 example; the semantic.css subtree-switch selectors and every fixture scheme toggle move with it)

Rules:

- Custom properties (`--ds-*`, `--_ds-*`) are ALREADY namespaced — untouched.
- The `@scope` lower boundary in rich-text (`to (:scope [data-ui])`) becomes `to (:scope [data-ds-ui])` — this is load-bearing containment, not prose.
- The review's invariant holds everywhere: an axis selector NEVER appears without identity (`[data-ds-ui="button"][data-ds-size="sm"]`, never bare `[data-ds-size]`). Current sources already comply via nesting — verify, don't restructure.
- Sweep completeness is proven by grep, not by memory: after the sweep, `grep -rn 'data-ui\|data-part\|data-variant\|data-size\|data-gap\|data-theme'` over the repo returns hits ONLY in the frozen historical files (findings, direction, reviews, old briefs). Record the before/after occurrence counts per file in findings (baseline: ~480 across 18 live files).

## 2. Anatomical state reach (field.css)

First verify the real anatomy from `field.css` + `fixtures/field.html` (input/textarea are expected as direct children of `[data-ds-part="control"]`; line 72 encodes this). Then rewrite the seven bare-descendant hooks — with the new names — into explicit anatomical paths:

| Line (pre) | Today | Becomes (shape, adjust to verified anatomy) |
|---|---|---|
| ~107 | `&:focus-within` | `&:has(> [data-ds-part="control"] > :is(input, textarea):focus)` — NOTE `:focus`, not `:focus-visible`: today's `:focus-within` reacts to pointer focus too, and battery identity requires preserving that |
| ~111–112 | `&:has(input:user-invalid)`, textarea twin | `&:has(> [data-ds-part="control"] > :is(input, textarea):user-invalid)` |
| ~124–125 | `&:has(input:disabled)`, twin | `&:has(> [data-ds-part="control"] > :is(input, textarea):disabled)` |
| ~145–146 | `&:has(input:focus-visible) > [data-part="control"]`, twin | `&:has(> [data-ds-part="control"] > :is(input, textarea):focus-visible) > [data-ds-part="control"]` |

- `:is()` consolidation of the input/textarea twins is allowed ONLY where the computed result is provably identical; otherwise keep pairs.
- Every other component: verify by grep that field was the only bare-descendant state consumer (`:has(`/`:focus-within` inventory across `ds/`); report the inventory in findings.
- Precedence must not shift: the invalid-after-focus source order (conventions §6) stays.

## 3. The new conformance probe (the one intended behavior change)

Append to `fixtures/field.html` a clearly-marked probe section: a field whose `[data-ds-part="control"]` area ALSO contains a nested `[data-ds-ui]` component wrapping its own `<input>` (disabled + invalid + focusable variants). Assert, computed, both schemes:

- Outer field's border/label/message do NOT react to the nested input's invalid/disabled state.
- Focusing the nested input does NOT relocate the outer field's focus frame; the nested component's own focus baseline still shows (keyboard Tab, real key event).
- The field's own direct control still drives every state exactly as before.

Record the pre-fix behavior first (run the probe against the unmodified selectors) so findings can show the real before/after delta — this documents the latent bug class, not just the fix.

## 4. Verification battery (required, both schemes)

Port **8070**, own tab, cache-bust before every computed pass, kill the server when done.

- **Computed identity** (T18 method): composition + consumer-override matrices via `index.css`, byte-for-byte equal to a pre-change baseline capture; spot checks on all six component fixtures; corpus pages via `core.css` (they carry one `data-ds-ui="rich-text"` each after the sweep); scheme toggles still work via `data-ds-theme` (subtree switch + fixture links).
- **State-reach probe** (§3): green post-fix; pre-fix capture recorded.
- **Keyboard focus**: field relocation intact for the field's own control; nested probe per §3; corpus link focus intact.
- **Greps**: sweep completeness (§1); zero bare-axis selectors; `light-dark()` only in palette; zero `!important`; layer order still declared only in `core.css`; research specimens (scale-rules, palette-rule) render styled — no silently-unstyled `data-ui` leftovers.

## `docs/findings/namespace-state-reach.md` — required content

1. Occurrence table before/after per file + the completeness grep output (exempt list explicit).
2. The seven selector rewrites as shipped, with the verified anatomy path and the `:focus` vs `:focus-visible` note.
3. Probe results: pre-fix (bug demonstrated) and post-fix (inert outer field), both schemes.
4. Battery identity proof.
5. Proposed conventions wording for the coordinator: §3 (attribute names + the axis-compound invariant), §7 (state-reach rule: state hooks are anatomical paths; `:focus-within` reserved for intentional any-descendant aggregation), §5a/§11 mentions of `data-theme` → `data-ds-theme`, and the review-triage linter candidates you can now confirm from real code (anatomical-path rule, bare-axis ban).
6. Anything the sweep surfaced that the typestyle landing (next task) must know.

## Done means

Sweep complete and grep-proven · seven state hooks anatomical · probe demonstrates the fix with pre/post evidence · full battery computed-identical in both schemes · research specimens still styled · findings complete · nothing committed · closing report (battery identity first, then the probe before/after, then sweep counts).
