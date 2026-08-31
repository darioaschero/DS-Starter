# T13 — Derivation synthesis

> **Working directory: `/Users/darioaschero/Documents/dev/DS-Starter` (the MAIN checkout, branch `main`).**
> Run `pwd` first. This task runs on main — NOT in a derivation worktree. It is document-only: no CSS changes, no browser required (the derivations are verified and committed; their screenshots and measurements are your evidence base).

## What this is

Both M3 derivation experiments are complete, reviewed, and committed on their branches. T11 (LGC-like, the hard path: non-Radix values) and T12 (warm editorial, the easy path: pure Radix family swap) both derived convincing identities with **zero frozen-surface leaks**. Your job is the synthesis that turns two experiments into decisions: the starter-thesis verdict, the consolidated parameter surface, the wizard verdict with a recommended form, and the first shippable derivation guide.

## Read first, completely

1. `docs/findings/derivation-lgc.md` — read from the worktree: `/Users/darioaschero/Documents/dev/DS-Starter-lgc/docs/findings/derivation-lgc.md`
2. `docs/findings/derivation-editorial.md` — from: `/Users/darioaschero/Documents/dev/DS-Starter-editorial/docs/findings/derivation-editorial.md`
3. `docs/tasks/T11-derivation-lgc.md` and `docs/tasks/T12-derivation-editorial.md` (what was asked, to compare against what was delivered)
4. `docs/findings/m2-synthesis.md` (§3 open decisions to carry forward; §4 linter inventory the derivations enriched)
5. `docs/findings/color-architecture.md` and `docs/conventions.md` v4 (what the derivations were allowed to assume)

Optionally inspect the derived token files themselves in the two worktrees (read-only) when the findings need verification.

## Files you may create/edit — ONLY these

1. `docs/findings/derivation-lgc.md` and `docs/findings/derivation-editorial.md` — **verbatim copies** into main's `docs/findings/` (so main is self-contained; do not edit their content).
2. `docs/findings/m3-synthesis.md` — the synthesis (structure below).
3. `docs/deriving.md` — the derivation guide v1 (structure below).

Everything else is frozen: no `ds/` changes, no fixtures, no `CLAUDE.md`, no `docs/conventions.md` (propose v5 changes inside the synthesis instead), no other findings, no briefs. **No commits.**

## `docs/findings/m3-synthesis.md` — structure fixed

1. **Two-path comparison table**: T11 vs T12 — files touched, line counts, wall-clock, mechanical/judgment/verification split, leaks (both zero), traps found and where they were fixed, fidelity self-scores, what each path uniquely proved (T12: recipes untouched — the semantic tier carried everything; T11: non-Radix content in the step-role structure, with forced-density slots).
2. **Starter-thesis verdict**: is DS-Starter demonstrably a starter? State it with the qualification the evidence supports (value-independent at the component boundary; identity expressible through 4–5 token files; where fidelity ends — licensed fonts, prose measure, per-element treatments, density systems).
3. **Consolidated parameter surface**: merge both ordered knob lists into one canonical sequence, each knob tagged: `mechanical` (wizard turns it from a plain answer) / `judgment` (needs a designer or expert rules) / `preview-gated` (mechanical but must pass a visual/contrast gate). Include the non-actions (knobs neither derivation needed — spacing scale, recipe rebinding) as evidence of a naturally small surface.
4. **Constraint classes discovered** — the generalizable ones a wizard AND the parked linter must encode:
   - Relational value constraints (T11's label-weight vs `[open]`-weight collision: state deltas must stay meaningful);
   - Contrast gates (T12's two traps: on-solid on solid; link on canvas AND subtle; focus-visibility on canvas) with the measured thresholds used;
   - Step-role density requirements (T11: sparse source ramps must be interpolated into the component/border-state zones — light 3–5, dark 3–6);
   - Fixture-copy drift (both: family names and numeric claims in fixture prose go stale by design — policy needed).
5. **Wizard verdict and recommended form**: guided wizard vs guide vs generator — argue from the evidence (both findings converge on "guided, preview- and contrast-driven"). Sketch the questionnaire the parameter surface implies (the actual questions, in order, with which files each answer writes and which gates run after each). State what the wizard CANNOT do (invent missing families, redistribute sparse ramps, judge voice) and how the flow hands those to a human.
6. **Conventions v5 proposals** (proposals only — the coordinator applies them): §5a structure/content split; font-slot extension points (`--ds-font-serif`/`--ds-font-display`); fixture-copy drift policy; whether `docs/deriving.md` becomes normative-adjacent; new linter rules from §4 (relational deltas, contrast gates) appended to the M3 inventory.
7. **Open decisions after M3**: carry the m2-synthesis table forward — update M2-O4 (link headroom: Amber evidence now — step 11 failed outright on Sand subtle) and every row the derivations touched; add new rows from §4–6.
8. **Next-milestone recommendation**: sequencing among wizard prototype, linter unparking (now enriched with derivation-informed rules), and base-system curation — one recommended order with reasoning, alternatives with costs.

## `docs/deriving.md` — the derivation guide v1 (a first-class deliverable, not an appendix)

The cheapest form of the wizard, shippable today, written for a designer-developer deriving their own system. Distilled from BOTH experiments — every step must trace to something actually done in T11/T12:

- **What you touch and what you never touch** (the contract, stated plainly: the 4–5 token files vs everything else; the leak protocol if you believe you need more).
- **The ordered checklist**: neutral family (Radix path: fetch verbatim / custom path: map onto the step-role table with the density warning) → accent family + the on-solid check (with the Radix dark-foreground rule and measured thresholds) → danger family → semantic role gates (link on canvas AND subtle ≥ threshold; focus visibility; on-solid) → type voice (stacks, roles, the label-weight relational constraint) → radii/geometry → the non-actions (what you probably don't need to touch, and why that's a feature).
- **Verify**: re-run the composition + consumer batteries in both schemes (point to the fixtures and the cache-bust ritual); the contrast table to fill in; known fixture-copy drift to expect.
- Keep it tight (one page of doing, not philosophy). Link the two findings notes as worked examples.

## Done means

Both findings copied verbatim · m3-synthesis complete with all eight sections · deriving.md v1 written and traceable to the experiments · nothing else touched · nothing committed · closing report (starter-thesis verdict first, then wizard verdict + questionnaire sketch, then the next-milestone recommendation).
