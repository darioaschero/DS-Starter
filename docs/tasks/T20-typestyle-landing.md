# T20 — typestyle landing: sm/md/lg into the core

> **Working directory: `/Users/darioaschero/Documents/dev/DS-Starter` (main checkout, branch `main`).** Run `pwd` first.
> **Goal:** land the user-approved typestyle set (conventions §12, "Typestyles — user-approved 2026-09-02", landing gates CLOSED) into `ds/` core: tuples, fluid ramp, Inter, smoothing, polarity mechanism, and the rich-text mapping — in the `data-ds-*` protocol (conventions v6).
> **Result contract:** the corpus renders the NEW typography (this is the first task whose battery *expects* a visual change in prose); every mechanism (containment, consumer override, focus, layers) stays identity-green; components change **only** typeface; rhythm/spacing/measure/colour change ZERO. The user reviews the rendered result at the coordinator checkpoint — the dark-canvas polarity weight is explicitly flagged for that review.

## Read first, completely, in this order

1. `docs/conventions.md` — v6: the **§12 typestyle decision block is your complete spec** (values, rules, gates closed); plus §3 (protocol + axis-compound), §5b, §6, §7 (state reach), §9, §11, §12
2. `docs/research/typestyles/specimen.html` — the reference implementation: formulas, comments, and the consumption-point constraint are all encoded there; `vendor/inter/README.md` for provenance
3. `docs/findings/namespace-state-reach.md` §6 (handoff: author only `data-ds-*` spellings)
4. `docs/reviews/api-review-2026-09.md` — triage "superseded/converging" (intentional font-shorthand resets; the two `@property` prohibitions: register nothing here)
5. `CLAUDE.md` — current status
6. The files you will touch (below)

## Files you may create/edit — ONLY these

Create: `ds/tokens/typestyles.css` · `ds/fonts/inter/` (copy `InterVariable.woff2` + `LICENSE.txt` + a provenance README from `docs/research/typestyles/vendor/inter/` — same sha256, restated) · `docs/findings/typestyle-landing.md` (from `TEMPLATE.md`).
Edit: `ds/core.css` (one new import) · `ds/reset.css` (smoothing only) · `ds/tokens/scale.css` (ONLY the `--ds-font-sans` line) · `ds/tokens/semantic.css` (polarity declarations only) · `ds/components/rich-text.css` (mapping) · `fixtures/corpus/perimeter.html` (add the typestyle token group to the JS list — mechanical).
Frozen: everything else. In particular: `--ds-font-size-1..6`, `--ds-type-*` legacy roles, `recipes.css`, all components except rich-text, all spacing/radius values, every rich-text **rhythm** rule (margins), fixture markup outside perimeter's token list. No commits. Do not edit `CLAUDE.md`/`docs/conventions.md` — propose wording via findings.

## 1. `ds/tokens/typestyles.css` — tuples, ramp, face

**Interval (user decision):** viewport, 600px → 1400px, written as rem: `A = 37.5rem`, `B = 87.5rem` (zoom-coherent; equivalent at the 16px default root). This is the ONE recorded ramp source; every fluid constant below derives from it.

**Implementation form (coordinator decision, record in findings):** ship the **baseline-guaranteed per-style clamp form** — `clamp(min, calc(C1rem + C2vw), max)` for size, line-height, AND fluid tracking, with C1/C2 computed from the interval. The native shared-progress form (`(100vw − 37.5rem) / 50rem` via typed length-division) is verified only on Chromium; keep it as a **commented upgrade path** in the file header, not as shipped CSS. Rendering is identical by construction.

**Tokens (constants only — never pre-resolved formulas on `:root`; formulas live at consumption per the §12 consumption-point rule).** Naming scheme functional and marked reviewable in findings (`--ds-type-<style>-…`); the tuples (from §12):

| Style | size | lh | weight | tracking rest → fluid max |
|---|---|---|---|---|
| sm (fixed) | 0.875rem (14) | 1.25rem (20) | book 400/500 · semi 600 | book −0.75% · semi −0.5% (no fluid) |
| md | 1.05rem (16.8) → 1.225rem (19.6) | 1.5rem (24) → 1.75rem (28) | book · semi | book −1.25% → −1.75% · semi −0.75% → −1.25% |
| lg | 1.66667rem (26.667) → 1.875rem (30) | 2rem (32) → 2.25rem (36) | normal 400 | −0.4% → −0.9% |

Tracking is `em` on `letter-spacing` (fraction of own size — the sanctioned self-relative em). Verify the clamp constants against the specimen's rendered values at three real viewport widths (§6) — the approved numbers are the acceptance test, not the formulas.

**Face:** `@font-face` for `"Inter"` (the vendored woff2, `font-weight: 100 900`, `font-display: swap`, url relative to the css file) lives in this file, imported into `ds.tokens`. `--ds-font-sans` in `scale.css` becomes `"Inter", system-ui, sans-serif` — note in findings the intended side effect: dormant components change typeface via `index.css` (the user's "settiamo tutto in Inter").

## 2. Smoothing (`reset.css`)

`-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;` on the root, with a comment recording: user decision 2026-09-02; macOS-only lever (ignored elsewhere; Android/iOS native rendering already sits close); consumer-overridable by contract.

## 3. Polarity mechanism (`semantic.css` + consumption in §4)

- One inherited declared property (functional name, reviewable — e.g. `--ds-polarity-wght`), default absent/0. **Surfaces declare, never accumulate**: scheme roots declare it —
  dark canvas is a negative surface: set `−20` under the same scheme hooks the palette uses (`[data-ds-theme="dark"]` subtree switch AND the system-default dark case — `light-dark()` carries colours only, so the number needs the selector/media pair; mirror the existing theme-switch structure; `[data-ds-theme="light"]` re-declares 0).
- Consumption happens **only** inside the §4 style rules: `font-weight: calc(<weight> + var(--ds-polarity-wght, 0))`.
- ⚠️ **This makes dark-mode prose render at ~380/580.** It follows the recorded decision (−20 on negative surfaces) but has never been judged on a full page: present it clearly in the closing report — light/dark corpus screenshots side by side — as a flagged item for the user's landing review.

## 4. Rich-text mapping (`rich-text.css`)

Replace the typography mappings (rhythm rules UNTOUCHED):

- `:where(h1, h2)` → **lg**: family + `font-weight: calc(400 + polarity)` + fluid size/lh clamps + fluid tracking clamp + `font-optical-sizing: auto` stated explicitly (the shorthand-reset intentionality from the review: since you author longhands here, state optical-sizing deliberately alongside).
- `:where(h3, h4, h5, h6)` → **md semibold** (weight 600 + polarity, md fluid size/lh, md-semi fluid tracking).
- `:where(p, li, dd, dt, blockquote, td, th)` → **md book** (400 + polarity, md fluid size/lh, md-book fluid tracking).
- `:where(strong)` → weight `calc(600 + polarity)` **+ the md-semi tracking clamp** (tuple-complete inline emphasis in prose flow). Inside lg contexts (strong in h1/h2) the md-semi tracking still applies at the inherited size — record the rendered result in findings; if it reads wrong, fall back to weight-only inside headings via `:where(h1, h2) strong` scoped exception and document it.
- `th` keeps its strong weight via the same approach; `em`, links, code rules unchanged. `pre` still inherits body typography — **no new code role in this task** (open thread stays with C5), now inheriting fluid md; record the rendered consequence.
- `sm` lands as vocabulary only (tokens defined, no core consumer yet — C5 decides captions).
- Everything through `:where()` at zero specificity inside the existing `@scope` block, per current file doctrine.

## 5. Perimeter sheet (`fixtures/corpus/perimeter.html`)

Add a "Typestyles" token group to the JS list rendering the new constants (size/lh/tracking min–max, weights) — mechanical extension of the existing table; no other fixture edits.

## 6. Verification battery (required, both schemes)

Port **8080**, own tab, cache-bust before every computed pass (query-version import edges as T19 proved necessary), kill the server when done.

**(a) Approved-value assertions** — the acceptance test, on `fixtures/corpus/longform.html` + `technical.html` via `core.css`, at three REAL viewport widths (drive the window/pane): ≤600px (p=0), 1000px (p=0.5), ≥1400px (p=1):

| Check | Expected |
|---|---|
| body (p) size/lh | 16.8/24 · 18.2/26 · 19.6/28; ratio 10/7 exact at every width |
| h1/h2 size/lh/weight | 26.667/32 → 28.33…/34 → 30/36; weight 400 (light scheme) |
| h3 + strong | md sizes, weight 600, md-semi tracking |
| tracking (px at size) | body −0.21px @16.8 → −0.343px @19.6; lg −0.107px → −0.27px (±0.01) |
| lh 4px grid | exact at 600−/1400+; continuous at 1000 (expected ✗ mid-ramp) |
| family/opsz/smoothing | Inter active (`document.fonts.check`), `font-optical-sizing: auto`, computed `webkitFontSmoothing: antialiased` |
| dark scheme | all of the above PLUS weights 380/580 (polarity −20); capture paired screenshots for the user review |

**(b) Mechanism identity** — expected-delta discipline: define the delta set (font-family everywhere; size/lh/weight/letter-spacing INSIDE rich-text prose) and assert **byte-identity on everything else**: all colours, spacing/margins, geometry, borders, radius in composition + consumer-override batteries; containment probes (selector + inheritance) green; consumer-override behavior green; T19's nested-state probe green; focus battery green; components: font-family is the ONLY computed delta (spot-check all six); corpus scheme links work.

**(c) Statics** — layer order only in `core.css`; `light-dark()` only in palette; zero `!important`; zero `@property` registrations added; no bare axes; legacy-attribute grep still clean; `git diff` on frozen files empty (scale.css: one line).

## `docs/findings/typestyle-landing.md` — required content

1. The shipped clamp constants table (derived from 37.5/87.5rem) + verification against approved values at the three widths.
2. The (a)/(b) battery results; the expected-delta set as shipped; paired light/dark screenshots for the polarity review.
3. The strong-inside-heading rendered outcome and any scoped exception taken.
4. Naming as shipped (tokens + polarity property), explicitly marked reviewable.
5. Proposed conventions wording for the coordinator: §5b rewrite (typestyles replace the type scale/roles for the core; tuples, ramp, consumption-point rule), §11 font-asset amendment (vendored Inter now in `ds/fonts/`), the smoothing/polarity records.
6. Anything C3 (rhythm) must know — observations only, zero rhythm changes.

## Done means

Typestyles live in core and verified against the approved numbers at three widths in both schemes · Inter vendored in `ds/` with provenance · smoothing and polarity landed (dark flagged for user review with paired screenshots) · rich-text mapped (h1/h2 lg · h3–h6 md-semi · strong tuple-complete) · mechanism identity proven with a documented expected-delta set · statics green · findings complete · nothing committed · closing report (approved-value assertions first, then the dark-polarity screenshots, then the expected-delta discipline, then naming notes).
