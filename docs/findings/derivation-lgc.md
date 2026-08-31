# Findings — T11 LGC-like derivation

> Task: derive an LGC-like system by changing only the DS-Starter token surface, then re-run the complete M1+M2 battery in both schemes.
> Date: 2026-08-31
> Files touched: `ds/tokens/palette.css`, `ds/tokens/semantic.css`, `ds/tokens/roles.css`, `ds/tokens/scale.css`, `ds/tokens/recipes.css`, `docs/findings/derivation-lgc.md`

## 1. Cost table

Implementation rows come from `git diff --numstat` against `HEAD` on `derivation/lgc`; the untracked findings row comes from `wc -l`.

| File | Added | Removed | Nature of work |
|---|---:|---:|---|
| `ds/tokens/palette.css` | 80 | 79 | Mixed: mechanical 12-step replacement plus the main colour-judgment work |
| `ds/tokens/scale.css` | 15 | 11 | Mostly mechanical type/radius mapping; family-stack split needed judgment |
| `ds/tokens/roles.css` | 6 | 6 | Judgment: assign LGC body/display/label voices to six frozen roles |
| `ds/tokens/recipes.css` | 4 | 2 | Judgment: make soft neutral while reserving accent for links/focus/solid |
| `ds/tokens/semantic.css` | 1 | 1 | Mechanical documentation of the measured on-solid decision |
| `docs/findings/derivation-lgc.md` | 121 | 0 | Evidence and synthesis |

Wall-clock: approximately **45 minutes** from worktree verification through final browser/static checks. Rough split: **18 minutes mechanical** (reading, replacements, greps, repeated batteries, screenshots) and **27 minutes design judgment** (neutral redistribution, missing accent/danger construction, type-role assignment, contrast and state-cue review).

## 2. Leaks and temptations

**Actual frozen-surface leaks: none.** No component, reset, index, or fixture source was changed. The token surface was sufficient to keep rendering and behavior intact.

Resisted temptations and measured friction:

- The brief refers to “LGC's accent colour,” but the checked LGC source has no accent values: its overview marks the accent axis as planned. The ink-blue accent and oxblood danger ramps are therefore explicit derivation judgments, not LGC mappings. This is a source-input gap rather than a component leak.
- LGC's licensed Sanomat, Publico Text, and National faces cannot ship under the zero-asset contract. Georgia and system sans preserve the serif-body/display versus sans-label distinction, but not the real metrics or voice.
- LGC's small-caps/tracking treatments, old-style numerals, drop cap, and independent typeset/per-heading axes are not expressible through the six font-only roles. Adding those would require component/role architecture changes, so they remain fidelity limits rather than `LEAK` edits.
- The frozen specimen fixture still labels its ramps “Radix Slate / Blue / Red.” After derivation that copy is factually stale. Editing it would violate the experiment, so the mismatch remains visible in the screenshots. This is a fixture-copy temptation, not a rendering failure.
- Setting label roles to weight 600 initially collapsed disclosure's closed/open weight cue because `[open]` also resolves to `--ds-font-weight-strong` (600). Reverting label roles to 500 restored `500 → 600` without a component change. The architecture held, but the incident exposes a value-level relational constraint a wizard/linter must know.
- The browser control surface does not expose page `fetch()`, so the exact cache-reload snippet from the brief could not run. Every assertion page instead received a real hard reload (`Cmd+Shift+R`) after navigation; computed values and screenshots showed the current sheets. This is test-driver friction, not a product leak.

## 3. LGC neutral ramp → 24 starter slots

The 13-step LGC ramp is achromatic, so hue/chroma stay exactly `0 0`. “Interp.” values are hand-selected OKLCH lightness values between adjacent LGC anchors. The starter needs dense component and border zones that the source ramp does not contain.

| Step / role | Light slot ← LGC source | Dark slot ← LGC source | Fit |
|---:|---|---|---|
| 1 · app bg | `100%` ← neutral-0 | `0%` ← neutral-1000 | Natural: exact canvases |
| 2 · subtle bg | `96.2%` ← neutral-100 | `20%` ← neutral-900 | Natural: exact LGC subtle surfaces |
| 3 · component bg | `95.2%` ← interp. 100→200 | `22.7%` ← interp. 900→800 | Forced density for attached component regions |
| 4 · component hover | `94.2%` ← interp. 100→200 | `25.3%` ← interp. 900→800 | Forced density |
| 5 · component active | `93.2%` ← interp. 100→200 | `28%` ← neutral-800 | Light forced; dark exact anchor |
| 6 · subtle border | `92.2%` ← neutral-200 | `32%` ← interp. 800→700 | Light exact LGC border; dark strengthened to preserve role order |
| 7 · default border | `86.9%` ← neutral-300 | `38.6%` ← neutral-700 | Natural stronger border |
| 8 · strong border/focus | `74.5%` ← neutral-400 | `48.5%` ← neutral-600 | Natural high-emphasis edge |
| 9 · solid | `60%` ← neutral-500 | `60%` ← neutral-500 | Natural shared midpoint |
| 10 · solid hover | `52.5%` ← interp. 500→600 | `67.3%` ← interp. 500→400 | Forced interaction density |
| 11 · muted text | `48.5%` ← neutral-600 | `74.5%` ← neutral-400 | Natural: exact LGC muted text |
| 12 · primary text | `20%` ← neutral-900 | `96.2%` ← neutral-100 | Natural high-contrast text |

The role convention fit the canvases, subtle surfaces, text, and most border anchors naturally. It was forced in light steps 3–5 and dark steps 3–6 because LGC jumps directly between a few semantic selections while the starter reserves consecutive slots for component and border state density. Preserving role meaning was more valuable than preserving every original ramp interval.

## 4. Fidelity self-assessment

**Verdict: about 7/10 LGC-like.** The result reads as the same broad editorial family: true-white/true-black canvases, high-contrast gray hierarchy, Georgia-led body/display typography, compact sans labels, restrained rules, 4/6/8px corners, and mostly monochrome soft/outline chrome. The ink-blue solid/link treatment is deliberately quieter than the base Radix Blue and the danger family is warm rather than signal-red.

The main misses are fundamental to the permitted surface: system Georgia cannot reproduce Sanomat/Publico metrics, the font-only roles cannot carry LGC's tracking/small-caps/numeral treatments, and the starter has no drop-cap or independent typeset axes. The accent/danger families are plausible additions, not faithful copies, because the reference has not implemented them. The frozen fixtures also remain utilitarian DS-Starter pages rather than LGC editorial content.

Screenshot evidence (captured after hard reload):

- [LGC reference · dark](/Users/darioaschero/.codex/visualizations/2026/08/31/01a05825-0868-77c3-b0e2-a2017a77a20f/lgc-reference-dark.png)
- [Derived specimen index · dark](/Users/darioaschero/.codex/visualizations/2026/08/31/01a05825-0868-77c3-b0e2-a2017a77a20f/ds-lgc-index-dark.png)
- [Derived specimen index · light](/Users/darioaschero/.codex/visualizations/2026/08/31/01a05825-0868-77c3-b0e2-a2017a77a20f/ds-lgc-index-light.png)
- [Full composition · dark](/Users/darioaschero/.codex/visualizations/2026/08/31/01a05825-0868-77c3-b0e2-a2017a77a20f/ds-lgc-composition-dark.png)
- [Full composition · light](/Users/darioaschero/.codex/visualizations/2026/08/31/01a05825-0868-77c3-b0e2-a2017a77a20f/ds-lgc-composition-light.png)

## 5. Battery verdict

| Group | Dark | Light | Evidence |
|---|---|---|---|
| Composition computed styles | held, 55/55 | held, 55/55 | Parts, boundaries, inherited overrides, dual-role part, nested rich text, embedded rhythm, type discriminators, axes, state, and all six components |
| Native disclosure | held | held | Real summary clicks: `open 600/1px → closed 500/0px → open 600/1px` |
| Composed native invalid state | held | held | Submit produced `:user-invalid`, focused the input, changed to danger border, showed error, and retained the relocated 2px/2px ring |
| Keyboard focus inventory | held, 20/20 | held, 20/20 | Expected DOM order; every target matched `:focus-visible` and showed shared/relocated ring under real Tab key input |
| Consumer overrides | held, 9/9 | held, 9/9 | All five frozen cases; real pointer hover kept plain CSS static while public-property state math changed |
| Visual pass | held | held | Index and full composition screenshots; no missing/invalid paint |
| Browser console | held | held | Zero warnings/errors on index, composition, and consumer pages |
| Static architecture | held | held | 12 primitives per family/scheme; `light-dark()` only in palette; zero `!important` in starter CSS; zero component/reset primitive or active-step references; no local layer ownership; unique IDs/references; clean diff |

WCAG contrast ratios, measured from browser-computed colours:

| Pair | Light | Dark |
|---|---:|---:|
| Primary text / canvas | 18.10:1 | 18.81:1 |
| Primary text / subtle | 16.21:1 | 16.21:1 |
| Primary text / component | 15.74:1 | 15.24:1 |
| Link / canvas | 10.11:1 | 9.12:1 |
| Link / subtle | 9.05:1 | 7.86:1 |
| Accent-on-solid / solid | 6.91:1 | 6.91:1 |

No §18 behavior failed. The derivation is value-independent at the component boundary, with one important qualification: token choices must preserve intentional differences such as base-label 500 versus open-state 600.

## 6. Parameter surface actually used

| Order | Knob | Result | Wizardability |
|---:|---|---|---|
| 1 | Neutral canvas/subtle/text anchors | Exact LGC `0/100/200/…` OKLCH anchors | Mechanical from supplied source |
| 2 | Neutral role redistribution | Interpolated 24-slot pair | Design judgment: role density and dark ordering |
| 3 | Accent family | Restrained ink blue, 12×2 | Design judgment: reference value absent |
| 4 | Danger family | Warm oxblood, 12×2 | Design judgment: temperature and contrast |
| 5 | Accent-on-solid | White at 6.91:1 in both schemes | Mechanical after contrast calculation |
| 6 | Shared soft recipe | Neutral subtle + primary text | Design judgment: preserve LGC monochrome restraint |
| 7 | Font family stacks | Georgia display/body; system sans labels | Mostly mechanical fallback selection, then visual judgment |
| 8 | Type-size anchors | 12 / 15.5 / 17 / 20 / 29 / 40px | Mechanical from LGC roles |
| 9 | Role family/weight assignment | Body/display serif, labels sans 500, headings 600 | Design judgment; includes the disclosure-state constraint |
| 10 | Role leading | 1.25 / 1.4 / 1.2 / 1.1 | Mostly mechanical from LGC role intent |
| 11 | Radius scale | 4 / 6 / 8px / pill | Mechanical from visible LGC chrome |
| 12 | Spacing scale audit | Existing 4–64px starter scale retained | Mechanical: it already matched LGC's 4–48px anchors and extended once |

A wizard can perform source copying, size/radius mapping, fallback selection, and contrast calculations. It cannot safely invent missing colour families, redistribute a sparse ramp into role-dense slots, choose recipe emphasis, or protect cross-token state distinctions without either expert rules or human review. The experiment supports a **guided wizard**, not a fully mechanical generator.

## 7. Structure/content friction

- Conventions §5a should explicitly separate the base system's **content rule** (“Radix values, verbatim”) from the derivable **structure rule** (three families × paired 12-step ramps × step-role meaning × one active `light-dark()` site). The experiment preserved the latter and necessarily replaced the former.
- The colour structure accepted non-Radix OKLCH values cleanly. Semantics, recipes, and component channels did not care about syntax or provenance.
- Typography exposed a smaller structural ambiguity: the documented raw scale lists only `--ds-font-sans` and `--ds-font-mono`, but an editorial derivation needs distinct body and display families. Adding `--ds-font-serif` and `--ds-font-display` stayed entirely inside the token surface and should be recognized as a legitimate derivation extension point.
- Derivations need lintable relational constraints in addition to names and tiers. This run discovered one: the disclosure's base label weight must differ from `--ds-font-weight-strong` for weight to communicate `[open]`. A wizard should verify meaningful state deltas, not only valid token references.
- No component API, cascade rule, selector boundary, theme mechanism, or recipe tier required structural change. The parameter surface is broad enough for a convincing rebrand, but high-fidelity editorial features still require deliberate architecture beyond colour/font/geometry values.
