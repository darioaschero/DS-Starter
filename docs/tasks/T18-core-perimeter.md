# T18 — C0: core perimeter, double entry, canonical corpus

> **Working directory: `/Users/darioaschero/Documents/dev/DS-Starter` (main checkout, branch `main`).** Run `pwd` first.
> **Goal:** give the M4 tight core (conventions §12) its physical boundary and its permanent test bench: the `ds/core.css` entry, the canonical content corpus rendered by the core alone, and the perimeter inventory with the judgment calls delivered as **options for the user** — decided at the coordinator checkpoint, not by this task.
> This is a C0 cycle task: mostly mechanical + inventory. **No design value changes.** Every `--ds-*` value ships exactly as it is today.

## Read first, completely, in this order

1. `docs/conventions.md` — v5 **including the new §12 block** (perimeter, double entry, workflow — your work order) and §11 (fixture chrome, curation rule)
2. `CLAUDE.md` — current status (M4 definition, cycle list)
3. `docs/findings/m3-synthesis.md` §2–3 (what the token surface carries; fidelity boundaries — several become your gap inventory)
4. `docs/findings/rich-text.md` (known holes: `pre` has no font role, etc.)
5. `ds/index.css`, all `ds/tokens/*.css`, `ds/components/rich-text.css`, `fixtures/composition.html` + `fixtures/consumer-override.html` (the batteries you must keep green)

## Files you may create/edit — ONLY these

Create: `ds/core.css` · `fixtures/corpus/longform.html` · `fixtures/corpus/technical.html` · `fixtures/corpus/perimeter.html` · `docs/findings/core-perimeter.md` (from `TEMPLATE.md`).
Edit: `ds/index.css` (compose-only rewrite, §1 below) · `fixtures/index.html` (append one clearly-marked "Corpus (core-only)" link section — nothing else).
Frozen: every other file. All `--ds-*` values, all component CSS, reset, tokens: **byte-identical**. No commits. Do not edit `CLAUDE.md` / `docs/conventions.md` — propose wording via findings.

## 1. Double entry (implements conventions §12)

- `ds/core.css` becomes the **sole owner** of the layer declaration, verbatim including placeholders:
  `@layer ds.reset, ds.tokens, ds.roles, ds.components, ds.exceptions;`
  then imports, in current order, ONLY: `reset.css`, `tokens/scale.css`, `tokens/palette.css`, `tokens/semantic.css` (→ `ds.tokens`), `tokens/roles.css` (→ `ds.roles`), `components/rich-text.css` (→ `ds.components`). File header comment: what the core is, that layer order lives here.
- `ds/index.css` becomes composition only: `@import "core.css";` (unlayered — its internal layer statement establishes order first) followed by the five component imports into `layer(ds.components)` and `tokens/recipes.css` into `layer(ds.roles)`, current order preserved. **No `@layer` statement remains in `index.css`.**
- Note the deliberate consequence: `recipes.css` is NOT in the core. Rich-text consumes no recipe token — verify by grep, and flag in findings if anything breaks this assumption.
- Boundary rule for this task: corpus fixtures load **only** `core.css`; every existing fixture keeps loading `index.css` unchanged.

## 2. Perimeter inventory + user-decision options (NO removals)

Classify **every** token, role, and rule the core entry now exposes into: `core` (content consumes it) / `dormant dowry` (only components consume it — rides along unused at file granularity, by §12 design) / `shared infrastructure` (focus, scheme switch). Mechanical evidence: grep each `--ds-*` for consumers in core files vs component files. Deliver the full table in findings.

Then present the three judgment calls as labelled options (A/B[/C], one-line consequence each, tiny rendered demo on `perimeter.html` where visual) — **clearly marked USER DECISION, not implemented**:

1. **Accent beyond link/focus**: do `--ds-accent-subtle` / `--ds-accent-text` stay reserved in the core vocabulary for content use (future `mark`, selection tint, C4/C6 material), or are they dowry of the actions module?
2. **Label roles**: `--ds-type-label-sm|md` stay in core `roles.css` (harmless, unused) or are recorded as actions-module dowry (moved only at module extraction)?
3. **Danger semantic roles**: `--ds-text-danger` / `--ds-border-danger` sleep in core semantic.css or are recorded as field-module dowry?

## 3. Canonical corpus (the permanent bench for C1–C6)

Both pages: canonical fixture chrome (§11 — ONE `<style>` block, body rule + narrow frame), loading `../ds/core.css` (match existing fixtures' relative-path idiom), light/dark honest (no scheme hacks), **zero `[data-ui]` other than `rich-text`**, zero network beyond the one CSS import (images = inline SVG data URIs).

- `longform.html` — `<html lang="it">`, realistic **Italian** editorial long-form: h1–h4 (one very long heading), multi-paragraph flow, nested ul/ol, blockquote with citation, links in flow, em/strong/inline-code, a simple table, hr, a figure + figcaption, long words that test hyphenation (do NOT enable hyphenation — the gap is C6's).
- `technical.html` — `<html lang="en">`, technical doc: long `pre` block with overflow-worthy lines, wide table, dl, kbd, mark, sub/sup, del/ins, a GitHub-style task list, a footnotes pattern (sup ref + hr + ol), inline SVG figure.
- Elements the core does not yet style render however reset+inheritance leaves them — **deliberately visible**. Never patch them with fixture CSS.
- `perimeter.html` — the standalone-core proof sheet: rendered swatch/spec rows for every core token and role (computed values read live via JS is fine — this is a lab page), the §2 option demos, and a visible "loaded stylesheet: core.css only" marker.

## 4. Gap inventory (routes work to the right cycle)

In findings, one table: every element/concern appearing in the corpus × covered-by-core-today (verify by computed style, not by reading CSS) × proposed owning cycle. Expected rows include: figcaption/figure, caption, kbd, mark, sub/sup, del/ins, task-list checkboxes, footnote pattern, `pre` font role (known), measure/max-width ownership (→ C2), text-wrap, hyphenation + `lang`, `::selection`, list markers, table caption/alignment (→ C5/C6). Propose, don't implement.

## 5. Verification battery (required, both schemes)

Port **8060**, own tab, cache-bust before every computed-style pass (stale imports mimic missing implementation), kill the server when done.

- **Regression via `index.css`:** composition + consumer-override fixtures fully green, plus one spot-check per component fixture. This proves the entry split changed nothing for the full system.
- **Core standalone:** all three corpus pages — zero 404s, zero console errors; computed checks on body/headings/inline code/table/blockquote in light AND dark; focus ring visible on a corpus link via real keyboard Tab; narrow viewport (~375px) pass on both corpus pages (`pre`/table overflow behavior recorded, not "fixed").
- **Greps:** layer statement exists exactly once, in `core.css`; `index.css` contains only imports; `light-dark()` only in palette; zero `!important`; corpus pages reference no component `data-ui`; rich-text consumes no recipe token; `git diff` over `ds/` shows **zero value changes** (entry files only).

## `docs/findings/core-perimeter.md` — required content

1. The entry-split diff summary + regression proof (battery identity).
2. The full perimeter classification table (§2) and the three USER DECISION option blocks.
3. The gap inventory (§4) with proposed cycle routing.
4. Proposed conventions wording for the coordinator: the §2 rewrite (layer order in `core.css`, `index.css` composes) and the §1 repo-layout row for `core.css` + `fixtures/corpus/`.
5. Friction + anything C1/C2 briefs must know (e.g. where measure wants to live, what the corpus revealed about current type/space values — observations only).

## Done means

`ds/core.css` + composed `ds/index.css` live with zero value changes · full battery green via index.css · three corpus pages verified standalone on core.css in both schemes + narrow viewport · perimeter table complete with the three option blocks rendered for the user · gap inventory routed to cycles · findings complete · nothing committed · closing report (entry split proof first, then the options awaiting user decision, then gap highlights).
