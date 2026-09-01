# T16 — Radix custom-generator study

> **Working directory: `/Users/darioaschero/Documents/dev/DS-Starter` (main checkout).** Run `pwd` first.
> **Research task, second act of the palette work.** T15 fitted rules from Radix *outputs*; the actual Radix generator *source* is public and MIT: [`components/generate-radix-colors.tsx`](https://github.com/radix-ui/website/blob/main/components/generate-radix-colors.tsx) in `radix-ui/website` (the engine behind https://www.radix-ui.com/colors/custom, signature ≈ `{appearance, accent, gray, background} → accent/gray scales + contrast colour + surface + background`). Your job: obtain it, understand it, run it, and put it side-by-side with T15's candidates so the user can judge all three on the same specimen. **You decide nothing**; where analysis forces a judgment call, present branches.

## Read first

1. `docs/findings/palette-rule.md` (T15 — the fitted candidates, the ΔE convention, the 8 pending user decisions this study will reframe)
2. `docs/research/palette-rule/palette-engine.mjs` and `specimen.html` (you will extend both, without breaking the existing branches)
3. `docs/conventions.md` §11 (curation-is-the-user's process rule)

## Part 1 — Obtain and document the real algorithm

- Fetch from `radix-ui/website` @ `main` (record the commit SHA): `components/generate-radix-colors.tsx` plus whatever it imports to run (e.g. `app/colors/custom/utils.ts`, reference-scale data, colour library). Vendor everything needed under `docs/research/palette-rule/vendor/` with a header per file: source path, repo, commit SHA, MIT attribution. Vendoring an MIT colour library (e.g. colorjs.io, if that is the dependency) is permitted **inside `docs/research/` only** — the zero-asset rule protects the starter (`ds/`), not research artifacts. If the network is unavailable: stop and report.
- **Document the algorithm in prose**, precisely enough to reimplement from the findings alone: how the accent input is used; how reference scales are selected/blended (nearest-scale interpolation? by what metric?); what curves/easings shape the steps; how `gray` tints the neutral scale; what role `background` plays (custom canvas is an input we never modelled!); how dark differs from light; how the **contrast colour** (their on-solid) is computed; what surface/alpha/wide-gamut outputs are and which we care about (sRGB only for now).

## Part 2 — Run it as a third branch in the specimen

- Adapt the vendored code to run in the browser from the existing specimen (an ES-module wrapper in `docs/research/palette-rule/`; strip React/TS as needed, but keep the vendored originals untouched for provenance — adapt in a separate file that imports or transcribes them, documenting any change).
- Add **"Radix algorithm"** as a third branch beside Candidates A and B: same live generator (their extra inputs — gray, background — get controls with sensible defaults derived from the seed so the comparison stays fair and the extra power stays visible), same regeneration gallery, same per-step ΔE annotations, same gate readouts.
- **Headline validations to run and report:**
  1. Self-consistency: seeded with its own published family colours (e.g. Blue 9 / Slate / white), how exactly does it reproduce published Radix Blue? (If not ~exact, understand and explain why.)
  2. The T15 table, third column: fitted six + held-out four, mean/max ΔE both schemes, next to Candidates A and B.
  3. The T15 failure gallery, same seeds: Yellow, sRGB-edge green, out-of-gamut OKLCH, desaturated, very dark.
  4. Its contrast colour vs our computed on-solid gate across all validation families (does it agree with `#fff`-vs-`#111`-at-4.5:1? where does it differ and why).
  5. The new capability: custom `background` — show 2–3 examples of what canvas-as-input does that our model cannot.

## Part 3 — Findings: `docs/findings/radix-generator.md`

1. The algorithm description (Part 1), with the honest delta between what T15's empirical curves guessed and what the code actually does — where we converged (did their approach resemble hue-neighbour interpolation?), where we were wrong.
2. All Part-2 tables and results.
3. **Cost of adoption analysis**, neutral: vendored engine size/dependencies vs T15's compact self-contained rule; what the wizard inherits with each (inputs, outputs, edge behavior, maintainability, upstream drift risk).
4. **The reframed decision set**: rewrite T15's 8 pending user decisions in light of the real engine — which are answered authoritatively by adopting it (hue handling, neutral tinting, on-solid policy…), which remain open regardless (ΔE tolerance is moot if we adopt their engine wholesale — say so), and the new master decision: **adopt the Radix engine (vendored, MIT, attributed) vs keep the compact fitted rule vs hybrid** — evidence for each, opinions labelled as opinions, decision left to the user.

## Files you may create/edit — ONLY these

`docs/research/palette-rule/vendor/**` (new) · `docs/research/palette-rule/` adapter module(s) · `docs/research/palette-rule/specimen.html` (extend; existing A/B branches must keep working identically) · `docs/findings/radix-generator.md` (new, from `TEMPLATE.md`). Nothing in `ds/`, no fixtures, no conventions/CLAUDE/briefs/other findings. **No commits.**

## Verification

Port **8052**, own tab, kill/close when done. The extended specimen must work statically offline once vendored (no runtime network). Exercise: all three branches on the six fitted + four held-out seeds; the failure-gallery seeds; the background-input demos; branch switcher integrity (A and B unchanged — spot-assert a couple of their outputs against T15's recorded values); zero console errors.

## Done means

Vendored source with commit-SHA provenance · algorithm documented to reimplementation standard · third branch live in the specimen with all comparative tables/galleries · self-consistency + held-out + failure + contrast-colour + background results reported · cost-of-adoption analysis · reframed decision set closing the findings · nothing committed · closing report (self-consistency result first, then the three-way ΔE comparison, then the reframed master decision).
