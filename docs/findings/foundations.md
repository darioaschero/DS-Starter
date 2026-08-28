# Findings — T1 Foundations

> Task: layer skeleton, reset + focus baseline, all three token levels, component stubs, fixture skeletons.
> Date: 2026-08-28
> Files touched: ds/index.css, ds/reset.css, ds/tokens/scale.css, ds/tokens/semantic.css, ds/tokens/roles.css, ds/components/{button,card,field,rich-text,stack,disclosure}.css (stubs), fixtures/{index,button,card,field,rich-text,stack,disclosure,composition,consumer-override}.html, README.md, docs/findings/foundations.md

## What was built

- `ds/index.css` declaring `@layer ds.reset, ds.tokens, ds.roles, ds.components, ds.exceptions;` and importing all ten files (including the six component stubs) with `layer()` clauses. Verified in-browser: every `CSSImportRule.layerName` reports the intended layer; all requests 200.
- `ds/reset.css`: box-sizing, universal margin zero, `body { line-height: 1.5 }`, block media defaults, `font: inherit` on form controls, and the §8 focus baseline verbatim.
- `ds/tokens/scale.css`: space 1–8 (0.25–4rem), font-size 1–6 (13/16/19/23/28/34px at 16px root, ≈×1.2, size 2 = body base), radius sm/md/lg/full (0.25/0.5/0.75/999rem), system font stacks, weights 400/500/600, and three 12-step scheme-neutral oklch ramps (gray h260 low-chroma, accent h250–260 blue, danger h20–28 red).
- `ds/tokens/semantic.css`: `color-scheme: light dark`, all §5.2 aliases via `light-dark()`, the `[data-theme]` subtree switch, focus treatment values.
- `ds/tokens/roles.css`: six font-only roles as complete `font` shorthand values (labels 500/1.2, body 400/1.5, headings 600/1.2–1.3).
- Nine fixture pages; `fixtures/index.html` is a token sanity page (role specimens, space bars, radius chips, semantic swatches, raw ramp strips). Verified in both schemes: light-dark() flips surfaces/text/link/danger/focus (focus outline computes to accent-9 in light, accent-8 in dark); keyboard focus shows the 2px offset ring; heading-lg computes to exactly `600 28px/33.6px system-ui`.

## Conventions that held

- The §2 layer plumbing worked first try and is easy to reason about; the browser exposes the import→layer mapping, which a future linter can also read.
- The §8 focus baseline living in `ds.reset` while its values live in `ds.tokens` is safe in practice: `var()` resolves per element at computed-value time, so the "reset comes before tokens" layer order is irrelevant for custom-property references.
- Scheme-neutral raw ramps + `light-dark()` only in semantic.css was enough for the entire sanity surface; no per-scheme rule was needed anywhere else.
- Font-only roles as one `font` handle behave exactly as intended, including the shorthand's implicit reset of unlisted font longhands.

## Friction / surprises

- **One light-ordered ramp must serve both schemes.** The dark end had to be hand-shaped: step 12 ≈ dark surface-1, step 11 ≈ dark surface-2, step 10 ≈ dark border. Consequences: light-scheme secondary text aliases step 10 (not the Radix-conventional 11), and dark mode has very few in-between steps for future hover/active surface depth. This is the largest structural risk carried forward to component tasks.
- **§5.2 reads as if every alias uses `light-dark()`, but some are naturally scheme-invariant.** `--ds-accent-strong`/`--ds-accent-contrast` are identical in both schemes (accent-9 tuned to oklch L 0.55 so near-white text stays ≥ 4.5:1 either way — verified visually both ways), as are `--ds-disabled-opacity` and the focus geometry values. I wrote those as plain aliases without `light-dark()`.
- **Nothing in the starter paints the app canvas.** No rule applies `--ds-surface-1`/`--ds-text-1`/a base font to `body`; fixtures currently rely on `color-scheme` UA canvas colors, which are close to but not identical to surface-1/text-1. The sanity page sets its own body font inline as a specimen.
- **The fixture-chrome rule ("padding/max-width only") forces all other fixture presentation into inline `style` attributes.** Workable — and it keeps chrome honest — but the sanity page needed a lot of them (spacing exists only because the reset removed UA margins). A stated policy for "fixture content styling" would remove the ambiguity.
- Small vocabulary gaps conventions.md is silent on, chosen minimally: label weight 500 vs. direction.md's illustrative 600; radius-lg 0.75rem; heading line-heights 1.2/1.25/1.3; font-size-6 (34px) defined but unused by any role (display headroom); `<meta charset>`/`<meta viewport>` added to the fixture skeleton though the brief did not list them.

## Open questions raised

- Do raw ramps stay scheme-neutral, or do components eventually need per-scheme ramps (Radix-style dedicated dark palettes) for hover/active depth on dark surfaces?
- Who owns painting the page canvas (background, text color, default body font): a tiny starter "page" rule, or always the consumer? Related: should `ds.exceptions` or a `ds.page` concept exist for it?
- Is the focus baseline's home in `ds.reset` right long-term, given it makes reset carry the first *design* decision? (Technically proven fine; conceptually debatable.)
- Are stub owner labels by component name ("the button task") the right convention, or will tasks get stable IDs (T2, T3…) that notes should reference?

## Suggested convention changes (if any)

- §5.2: state that aliases *may* be scheme-invariant plain `var()` references when one value passes contrast in both schemes; `light-dark()` is required only where branches differ.
- §8: add one sentence that reset may safely reference token custom properties despite layer order (computed-value-time resolution), to preempt re-litigating the ordering.
- §5.1: document the intended ramp step roles (1–2 app backgrounds, 3–5 tinted component backgrounds, 6–8 borders/tints, 9–10 solids, 11–12 text, with 10–12 doubling as dark-scheme border/surfaces) so component tasks pick steps consistently.
- §1 or §11: define what fixture *content* styling may use (inline `style` attributes encouraged, no `<style>` beyond the chrome block) so the chrome contract stays crisp.
