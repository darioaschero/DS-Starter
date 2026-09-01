# T15 — Palette generation rule (research)

> **Working directory: `/Users/darioaschero/Documents/dev/DS-Starter` (main checkout).** Run `pwd` first.
> **This is a RESEARCH task, not an implementation task.** It changes NOTHING in `ds/` and decides NOTHING about the system. Its deliverables are: the analysis, one or more candidate generative rules, and a **specimen page the user will judge by eye**. The user makes the design decisions at the coordinator checkpoint — your job is to make those decisions easy and honest. Present branches, not picks.

## Goal

Discover whether a compact generative rule can produce Radix-quality 12-step light+dark colour ramps from a small set of inputs (a seed colour, a "neutral vs chromatic" flag, maybe a temperature/tint parameter) — so the future wizard can generate palettes for **any** brand colour instead of only offering the published Radix families. Quantify how close the rule gets; show where it breaks; let the user see and judge.

## Ground truth available

- `ds/tokens/palette.css` (main) — Radix **Slate, Blue, Red**, light+dark, sRGB hex, v3.0.0.
- `/Users/darioaschero/Documents/dev/DS-Starter-editorial/ds/tokens/palette.css` (read-only worktree) — Radix **Sand, Amber, Tomato**, light+dark.
- `/Users/darioaschero/Documents/dev/LGC/tokens/primitives.css` (read-only, outside the repo) — a real non-Radix neutral ramp; `/Users/darioaschero/Documents/dev/DS-Starter-lgc/ds/tokens/palette.css` shows how T11 redistributed it into 24 slots.
- **Held-out test set**: fetch 3–4 additional Radix families the analysis never fits against (suggest: Grass or Green, Purple or Violet, Cyan, and one hard case like Yellow or Lime) from `@radix-ui/colors@3.0.0` (unpkg/GitHub, sRGB sets, light+dark). If the network is unavailable, proceed without and say so — the held-out validation is then a gap, not silently skipped.

## Method (guide, not straitjacket)

1. **Convert everything to OKLCH.** Build per-family tables: L, C, H for steps 1–12, light and dark separately.
2. **Characterize the curves.** Questions the analysis must answer with numbers: Do chromatic families share (or nearly share) a lightness curve per scheme? What shape is the chroma envelope across steps (where does it peak; how do the tinted 1–5 zone and text 11–12 zone behave)? How much does hue drift across steps, and does it matter perceptually? How exactly do dark-scheme curves differ from light (they are NOT mirrors)? How do the six neutrals-vs-chromatics differ, and what makes Slate "cool" vs Sand "warm" expressible as a parameter (a low-chroma hue cast?)?
3. **Formulate candidate rules.** Plausible shapes to explore (bring others if the data suggests them): (a) fixed per-scheme L tables + a chroma envelope scaled from the seed's chroma + hue locked or drifted by a small per-step table; (b) parametric curve fits; (c) hybrid table+parameter forms. A rule's inputs should be minimal and wizard-friendly: seed colour (conceptually "your brand colour ≈ step 9"), neutral/chromatic flag, optional tint/temperature for neutrals.
4. **Handle the hard realities**, explicitly: sRGB gamut clamping strategy for high-chroma seeds; the **yellow/amber problem** (bright hues where step 9 is light and wants a dark on-solid foreground — the rule must OUTPUT the recommended on-solid foreground per generated family, computed from contrast, never assumed); very desaturated or very dark seeds (what does the rule do when the seed is nowhere near a plausible step 9?).
5. **Validate.** Regenerate the six known families from ONLY their seed + flags; report per-step and per-family ΔE (OKLab Euclidean, consistent with earlier findings' usage) tables against ground truth, both schemes. Then the held-out families, never fitted, same tables. Propose honest tolerance interpretations (what mean/max ΔE is visually indistinguishable in a UI ramp — demonstrate with a specimen pair, don't just assert).
6. **Contrast gates on generated output**: for each generated family run the deriving.md gate maths (on-solid ≥4.5:1, candidate link steps on canvas+subtle, focus ≥3:1) and report — the rule is only wizard-usable if its output predictably passes or predictably reports failure.

## Deliverables — ONLY these files

1. **`docs/research/palette-rule/specimen.html`** — the page the user judges. Self-contained (inline JS/CSS allowed — this is a research artifact, NOT a starter fixture; it lives outside `fixtures/` and must not link `ds/index.css`). Contents:
   - **Live generator**: a colour input (seed) + neutral/chromatic + tint controls → renders the generated 12×2 ramp instantly, in a light and a dark panel side by side, with an on-solid recommendation and gate readouts per generation.
   - **Regeneration gallery**: for each of the six known + held-out families: original strip vs regenerated strip, aligned, with per-step ΔE annotated and the family's mean/max ΔE.
   - **Failure gallery**: the seeds/zones where the rule visibly breaks (gamut clamps, yellows, extreme seeds) — shown, not hidden.
   - If multiple candidate rules survive, a switcher so the user compares them on the same seed.
2. **`docs/research/palette-rule/`** may hold supporting data files (JSON tables, a small JS module the specimen inlines or imports locally). Keep it self-contained and served statically.
3. **`docs/findings/palette-rule.md`** — the research note: the measured curve tables, each candidate rule stated precisely (someone must be able to reimplement it from the prose + numbers alone), validation tables, gamut/edge findings, and **"Decisions left to the user"** as the closing section: the explicit list of choices the specimen lets them make (which rule, tolerable ΔE, hue-drift on/off, neutral tint model, on-solid policy), each with the evidence pointer — and NO recommendation dressed as a conclusion; where you have an opinion, label it as opinion.

Nothing else: no `ds/` edits, no fixtures/ edits, no conventions/CLAUDE edits, no commits.

## Verification

Serve the repo root on port **8051** (own tab; kill/close when done). The specimen must work statically from `docs/research/palette-rule/specimen.html` with zero build and zero network. Verify the live generator against at least: the six known seeds (visual match), one held-out seed, one yellow-zone seed, one out-of-gamut seed (graceful clamp + honest readout). Zero console errors.

## Done means

Curve characterization complete with numbers · at least one precisely-stated candidate rule · regeneration + held-out ΔE tables, both schemes · gates computed on generated output · specimen page working statically with live generator, galleries, and (if applicable) rule switcher · findings note ending with the "Decisions left to the user" section · nothing in `ds/` touched · nothing committed · closing report (what the curves revealed first, then rule accuracy honestly, then the exact list of user decisions the specimen enables).
