# M3 synthesis — derivation verdict

> Scope: T11 LGC-like hard-path derivation and T12 warm-editorial easy-path derivation.
> Date: 2026-08-31
> Evidence base: [derivation-lgc.md](derivation-lgc.md), [derivation-editorial.md](derivation-editorial.md), [m2-synthesis.md](m2-synthesis.md), [color-architecture.md](color-architecture.md), and conventions v4.

## 1. Two-path comparison

| Dimension | T11 — LGC-like hard path | T12 — warm-editorial easy path |
|---|---|---|
| Source shape | A sparse, non-Radix neutral source; missing accent and danger families; licensed typefaces unavailable | Complete official Radix Sand, Amber, and Tomato light/dark families |
| Token files touched | All five: `palette.css`, `semantic.css`, `scale.css`, `roles.css`, `recipes.css` | Four: `palette.css`, `semantic.css`, `scale.css`, `roles.css`; `recipes.css` remained 0/0 |
| Line counts | `palette.css` +80/−79; `semantic.css` +1/−1; `scale.css` +15/−11; `roles.css` +6/−6; `recipes.css` +4/−2; finding +121/−0. Implementation total +106/−99; branch total +227/−99. | `palette.css` +75/−75; `semantic.css` +7/−5; `scale.css` +4/−3; `roles.css` +4/−4; `recipes.css` 0/0; finding +115/−0. Implementation total +90/−87; branch total +205/−87. |
| Wall-clock | About 45 minutes | About 40 minutes |
| Work split | 18 minutes mechanical **and verification combined** (the run did not log separate subtotals); 27 minutes judgment | 10 minutes mechanical; 10 minutes judgment; 20 minutes verification/reporting |
| Frozen-surface leaks | **0** | **0** |
| Traps and fixes | Sparse neutral density was interpolated in `palette.css`; absent accent/danger families required human invention in `palette.css`; label weight 600 erased the disclosure's 500→600 open cue, fixed in `roles.css`; the monochrome identity deliberately rebound the soft recipe in `recipes.css` | White on Amber 9 was 1.58:1, fixed with `#21201c` in `semantic.css` for 10.33:1; Amber 11 linked acceptably on canvas at 4.53:1 but failed on Sand subtle at 4.38:1, fixed by moving link/accent text to step 12; focus moved to step 11 after step 8 read too quietly |
| Fixture friction | Radix family labels became false | Family labels and numeric typography claims became false |
| Fidelity self-assessment | About 7/10 LGC-like; the broad editorial identity held, but licensed fonts and fine typesetting did not | No numeric score recorded; assessed as convincingly warm/editorial with a deliberate product-UI undertone, while publication measure, rhythm, decoration, and separate control density remained out of reach |
| Verification | Full M1+M2 batteries held in light and dark; composition 55/55, consumer overrides 9/9, focus 20/20 | Full M1+M2 batteries held in light and dark; composition 64 assertions, final role rerun 14/14, focus 20/20 |
| Unique proof | Non-Radix OKLCH content can inhabit the paired 12-step role structure. The mapping was natural at canvases/text but required density in light steps 3–5 and dark steps 3–6. | A pure Radix family swap is genuinely mechanical. Recipes and every component stayed untouched because the semantic tier carried the new identity. |

The five-minute cost difference understates the paths' qualitative difference. T12 spent half its time verifying a mostly mechanical family substitution. T11 spent most of its time deciding what absent or sparse source material should mean. Both arrived at the same architecture result: no component, reset, index, or fixture source needed to change.

## 2. Starter-thesis verdict

**Yes: DS-Starter is demonstrably a starter, qualified as value-independent at the component boundary.** Two materially different identities—one inside the advertised Radix path and one outside it—were expressed through four or five token files while the complete six-component system, native states, focus relocation, containment, consumer overrides, recipes, cascade, and light/dark mechanism continued to work.

The demonstrated claim is narrower than “any reference can be reproduced exactly.” The token surface carries colour families, semantic role choices, font stacks, six typography roles, a type scale, radii, spacing, and shared recipe emphasis. That is enough for a convincing identity change. It does not carry licensed font files or their metrics, prose measure, heading margins, link-decoration character, small caps, tracking, old-style numerals, drop caps, per-element treatments, independent heading axes, or separate prose/control density systems. Those are fidelity boundaries, not evidence of component value coupling.

The practical thesis is therefore: **a coherent product-facing identity can be derived without touching component CSS; high-fidelity reproduction stops where the source identity depends on assets or layout/treatment axes the starter does not model.**

## 3. Consolidated parameter surface

Tags:

- `mechanical` — the wizard can write the value from a plain answer or supplied source.
- `judgment` — a designer must decide, or an expert rule set must supply the decision.
- `preview-gated` — the write is mechanical, but it is not accepted until a visual or contrast gate passes.

| Order | Knob | Tag | Canonical action |
|---:|---|---|---|
| 1 | Source route | `mechanical` | Classify each family as official paired 12-step, complete custom paired 12-step, sparse, or missing. This determines which later questions may proceed automatically. |
| 2 | Neutral family or complete neutral anchors | `preview-gated` | Copy 12 light + 12 dark values into `palette.css`; retain attribution/provenance and verify canvas, surface, border, and text roles in both schemes. |
| 3 | Sparse neutral redistribution | `judgment` | When the source lacks role density, map anchors onto the step-role table and interpolate the component/border zones rather than duplicating sparse values. |
| 4 | Accent family | `preview-gated` | Copy a complete pair mechanically, then preview tone and run link, focus, and solid gates. A missing family exits the automatic path. |
| 5 | Missing accent or danger construction | `judgment` | A human supplies the family and temperature. T11 proves the structure accepts it; it does not prove a wizard can invent it faithfully. |
| 6 | Danger family | `preview-gated` | Copy 12×2 values and inspect danger text, invalid border, and focused-invalid composition in both schemes. |
| 7 | Accent-on-solid foreground | `preview-gated` | Select the prescribed or candidate foreground and accept only when it passes on accent step 9 in both schemes. Never carry `white` forward by assumption. |
| 8 | Link, accent-text, and focus roles | `preview-gated` | Choose active accent steps in `semantic.css`; test links on canvas **and** subtle, and focus against canvas, in both schemes. |
| 9 | Shared recipe emphasis | `judgment` | Keep recipes unchanged by default. Rebind only when the identity explicitly changes a system concept, as T11's neutral soft treatment did. |
| 10 | Available font stacks | `judgment` | Choose shippable fallbacks for sans, serif, and display voices. A wizard can record supplied stacks but cannot judge whether Georgia substitutes convincingly for a licensed face. |
| 11 | Type-size anchors | `mechanical` | Map supplied role sizes onto `--ds-font-size-1..6`; retain the existing scale when the reference does not demand a change. |
| 12 | Typography role family and weight | `judgment` | Map label/body/heading voices in `roles.css`; preserve meaningful state deltas such as disclosure label 500 versus open 600. |
| 13 | Role leading | `judgment` | Set complete font shorthands from the intended reading density, then inspect the full composition. |
| 14 | Finite radii | `preview-gated` | Map a source or softness preset onto sm/md/lg; inspect controls, cards, and nested composition before accepting. |
| 15 | Spacing scale audit | `mechanical` | Default to no change. Both experiments retained the 4–64px scale; a global spacing rewrite cannot independently solve prose and control density. |

The non-actions show that this is naturally a small surface, not a checklist that must churn every token. Both paths retained spacing. T12 retained type sizes, label roles, and every recipe. Recipe rebinding is an explicit exception, not routine derivation work.

## 4. Constraint classes discovered

### 4.1 Relational value constraints

Valid token names and valid individual values are insufficient when a state communicates through a difference between values. T11 initially set label roles to 600 while disclosure `[open]` also uses `--ds-font-weight-strong` at 600. The declarations were individually valid, but the open-state weight cue disappeared. Restoring base labels to 500 restored the intentional 500→600 delta.

The wizard must render and compare named states after typography changes. The linter needs a registry-backed relational rule that resolves configured values and reports a collapsed state delta; for disclosure, base trigger weight must differ from open trigger weight, with the existing 0→1px hairline as a second cue rather than an excuse to lose the first.

### 4.2 Contrast gates

Contrast is a matrix over semantic pairings, not a property of a family or step by itself. The acceptance gates exercised by T11/T12 are:

| Semantic pair | Minimum | Schemes/surfaces | Evidence |
|---|---:|---|---|
| Link / canvas | 4.5:1 | Light + dark canvas | T12 Amber 11 reached 4.53:1 on light canvas, proving that canvas alone gives almost no headroom |
| Link / subtle | 4.5:1 | Light + dark subtle | The same Amber 11 failed at 4.38:1 on light Sand subtle; Amber 12 passed at 10.79:1 |
| Accent-on-solid / solid | 4.5:1 | Light + dark accent step 9 | White/Amber failed at 1.58:1; `#21201c`/Amber passed at 10.33:1; LGC white/ink-blue passed at 6.91:1 |
| Focus indicator / canvas | 3:1 | Light + dark canvas | Amber 11 passed at 4.53:1 light and 12.34:1 dark |

Primary text on canvas, subtle, and component remains part of the verification matrix at the normal-text 4.5:1 minimum. A guided flow must run these gates after the relevant family or role write, not only once at the end.

### 4.3 Step-role density

The 12-step structure is semantic storage, not a demand that a custom source already contain twelve evenly distributed samples. Sparse sources must be redistributed into distinguishable component and border-state zones. T11 needed interpolation at **light steps 3–5** and **dark steps 3–6**. Preserving role meaning and ordering took precedence over preserving the source ramp's original intervals.

The wizard must pause for a human mapping when a source is sparse. The linter can still verify the result: twelve values exist per scheme; role-zone values do not collapse into duplicates; light/dark role ordering is coherent; and an annotation records derived/interpolated slots. It cannot choose the interpolation.

### 4.4 Fixture-copy drift

Both experiments made fixture prose stale without making fixture behavior stale. Family labels such as “Radix Slate / Blue / Red” and numeric claims such as “body-md (400 / 1.5)” encode base-profile content in otherwise value-independent fixtures.

Policy is required: structural verification fixtures remain frozen during a derivation, and stale profile copy is recorded as expected evidence rather than repaired as a leak. Reusable fixtures should replace literal family/numeric claims with token-neutral labels or generated profile metadata. A linter should flag base-family names and duplicated token values in derivation-safe fixture prose.

## 5. Wizard verdict and recommended form

**Build a guided, preview- and contrast-driven wizard; ship [`docs/deriving.md`](../deriving.md) now as its cheapest useful form.** A guide alone cannot prevent Amber's two contrast failures or the disclosure weight collision. A generator can copy values, but it would imply unsafe competence at inventing missing families, redistributing sparse ramps, or judging typographic voice. The evidence supports automation around deterministic writes and gates, with deliberate human handoffs around identity decisions.

The questionnaire implied by the parameter surface is:

| Order | Question | Writes | Gate before continuing |
|---:|---|---|---|
| 1 | Is each colour source an official Radix family, a complete paired 12-step family, a sparse ramp, or missing? | None; selects the route | Sparse/missing sources show a required-human handoff |
| 2 | Which neutral family, or which light/dark neutral anchors, should the system use? | `ds/tokens/palette.css` | 12×2 completeness; step-role/density review; primary text on canvas, subtle, and component in both schemes |
| 3 | Which accent family should carry links, focus, and solid actions? | `ds/tokens/palette.css` | 12×2 completeness and two-scheme preview; missing family pauses |
| 4 | Which danger family fits the identity? | `ds/tokens/palette.css` | 12×2 completeness; danger/invalid/focused-invalid preview |
| 5 | What foreground belongs on accent solid? | `ds/tokens/semantic.css` | On-solid/solid ≥4.5:1 in both schemes |
| 6 | Which accent steps should serve link, accent text, and focus? | `ds/tokens/semantic.css` | Link/canvas and link/subtle ≥4.5:1; focus/canvas ≥3:1, all in both schemes |
| 7 | Should soft UI remain accent-tinted, or should the identity make it neutral? | Usually no write; exceptional write to `ds/tokens/recipes.css` | Rest/hover/active preview across supported surfaces; default is unchanged |
| 8 | Which shippable sans, serif, and display stacks are allowed? | `ds/tokens/scale.css` | Every family resolves without adding forbidden assets; side-by-side voice preview |
| 9 | What are the six type-size anchors, or should the base scale remain? | `ds/tokens/scale.css` | Role specimens remain distinguishable and composition does not break |
| 10 | Which voice, weight, and leading belongs to labels, body, and each heading role? | `ds/tokens/roles.css` | Complete `font` values; closed/open disclosure state delta; full type/composition preview |
| 11 | How sharp or soft should sm/md/lg geometry be? | `ds/tokens/scale.css` | Card, button, field, disclosure, and nested-composition preview |
| 12 | Does evidence require changing the spacing scale? | Usually no write; exceptional write to `ds/tokens/scale.css` | Human review, because global spacing cannot express a separate density system |
| 13 | Does the complete composition still carry the intended identity in light and dark? | None | Full composition + consumer battery, contrast table, static architecture checks, and zero unapproved leaks |

The wizard cannot invent an absent accent/danger family, redistribute a sparse ramp safely, acquire or emulate licensed fonts, judge whether a fallback has the right voice, or decide whether missing prose measure/per-element treatments are acceptable. At those points it should stop automatic writes, present the role table and paired previews, request an explicit human-supplied ramp/stack/decision, and record any unexpressible treatment as a fidelity boundary. It may calculate; it must not impersonate taste.

## 6. Conventions v5 proposals

These are proposals for the coordinator; this task does not edit conventions.

1. **Split §5a structure from base content.** Make the invariant: three semantic families × 12 light + 12 dark slots; stable step-role meanings; active steps as the sole normal `light-dark()` site; semantics → recipes → components. Keep “official Radix sRGB values copied verbatim with attribution” as the **base profile's content policy**, not a universal derivation constraint. Custom derivations may use other syntaxes/provenance when documented.
2. **Recognize font-slot extension points.** Add optional `--ds-font-serif` and `--ds-font-display` raw slots alongside sans/mono. Roles may consume them while remaining single complete `font` shorthand values. Their presence does not authorize external font assets.
3. **Adopt the fixture-copy drift policy from §4.4.** Frozen derivation batteries do not change prose. New derivation-safe fixtures use token-neutral copy or generated profile metadata and do not duplicate numeric token claims.
4. **Make `docs/deriving.md` normative-adjacent.** Conventions remain the source of architectural truth; the guide is the supported operational procedure and may not override conventions. Update it when a verified derivation changes the safe sequence or gates.
5. **Append four rules to the M3 linter inventory:**
   31. **Relational state deltas:** resolve registered base/state values and reject a collapsed required cue (initial registry case: disclosure trigger base weight versus `[open]` weight).
   32. **Semantic contrast matrix:** resolve both schemes and enforce link/canvas + link/subtle ≥4.5:1, on-solid/solid ≥4.5:1, focus/canvas ≥3:1, plus primary text on canvas/subtle/component ≥4.5:1.
   33. **Custom-ramp density:** require 12 values per family/scheme, distinguishable ordered component/border zones, and provenance/interpolation annotations for non-verbatim slots.
   34. **Derivation-safe fixture copy:** flag literal base family names and duplicated numeric token claims outside explicitly base-profile-only fixtures.

## 7. Open decisions after M3

| ID | Decision | M3 evidence | Recommendation | Cost to reverse |
|---|---|---|---|---|
| M2-O1 | Curated solid hover/active channels | Both derivations kept derived state behavior and public-override math green; neither compared its derived solid states with curated family step 10. T11's recipe exception did not require component state changes. | Keep the M2 recommendation: optional curated solid hover + active as a complete pair, with derivation as the override-safe floor. Treat as base curation, not a wizard prerequisite. | Low–medium |
| M2-O2 | Control-height tokens / density | Both derivations retained spacing. T12 explicitly found that global spacing could not independently loosen prose and compact controls. | Continue to wait for a third bounded control; do not use global spacing as a density surrogate. If fidelity repeatedly demands it, design a separate prose/control density axis. | Low for shared heights; high for a new density system |
| M2-O3 | `--ds-type-body-sm` | Type voice changed substantially, but no second component demanded compact body copy. | Do not promote from repeated field instances or derivation desire alone. | Low |
| M2-O4 | Link contrast headroom | The base's 4.53:1 link/subtle margin predicted the failure: Amber 11 was 4.53:1 on Sand canvas but **4.38:1 on Sand subtle**. T11's custom accent passed with much more headroom. | Enforce both surfaces at ≥4.5:1 in every derivation. During base curation, choose a policy target above the legal floor or warn when headroom is narrow; do not add a component-surface link until that pairing also passes. | Medium |
| M2-O5 | `data-ui` name portability | Two new identities produced zero component/fixture leaks and no adopting-project collision. | Keep `data-ui`; prefix only on a real collision. | Medium |
| M2-O6 | `bg-component` consumption boundary | Both new neutral families preserved disclosure depth and primary/component contrast without expanding consumption. | Keep disclosure as the sole consumer until another measured pairing demands the role. | Low–medium |
| M2-O7 | Brief/fixture numeric duplication | Both derivations exposed stale family labels; T12 also exposed stale 400/1.5 copy. This is now a class, not an isolated typo. | Apply the v5 fixture-copy policy; briefs name tokens first and fixtures avoid literal profile claims. | Trivial for copy; medium for generated metadata |
| M2-O8 | Focus/cache driver semantics | Focus remained 20/20. T11 needed hard reloads and T12 a fresh origin because page `fetch()` was unavailable; the original sequential-Tab limitation remains. | Preserve DOM inventory + per-target keyboard assertions; add a driver with true traversal and a reliable cache-bust primitive. | Low harness cost |
| M3-O1 | §5a structure/content split | Non-Radix OKLCH values preserved every architectural invariant and battery result. | Adopt the v5 split; retain Radix-verbatim as the base profile policy. | Low documentation cost |
| M3-O2 | Font slot extension points | Both derivations needed serif; T11 also needed a distinct display slot. Neither required a component change. | Adopt optional `--ds-font-serif` and `--ds-font-display` in v5. | Low |
| M3-O3 | Relational value validation | T11 produced a real, otherwise valid 600/600 state-cue collision. | Make registered relational deltas a wizard gate and linter error; begin with disclosure and expand only from evidence. | Medium: computed-value/registry support |
| M3-O4 | Contrast policy: floor versus headroom | T12 failed at 4.38:1 and barely passed another surface at 4.53:1 before moving to step 12. | Hard-fail below WCAG minima; warn on narrow headroom until base curation chooses a higher policy target. | Low in wizard; medium in cross-file linter |
| M3-O5 | Sparse-ramp validation boundary | T11 required human interpolation at light 3–5 and dark 3–6. | Let tooling validate completeness/order/density and record provenance; keep interpolation itself a human handoff. | Medium |
| M3-O6 | Status of the derivation guide | The guide is immediately shippable but contains operational policy not yet in conventions v4. | Make it normative-adjacent under conventions, as proposed in §6. | Trivial |
| M3-O7 | Default recipe policy | T12 proved semantics can carry a family swap with recipes untouched; T11 needed one identity-specific neutral-soft exception. | Preserve recipes by default; expose one explicit emphasis question rather than rewriting recipes mechanically. | Low |

## 8. Next-milestone recommendation

Recommended order: **unpark a thin linter/validator slice → build the guided wizard on that validator → curate the base system with evidence from both.**

1. Start the linter with the M2 high-confidence structural rules (1, 4, 10, 11, 15, 17–20, 27) plus the new relational, contrast, and ramp-density rules. This turns the two discovered silent failures into reusable gates and answers the parser/computed-value feasibility questions before a UI depends on them.
2. Build the guided wizard as a thin questionnaire and preview layer over those validations. Its write surface is only four default files plus an exceptional fifth recipe file; the guide already supplies its order and human-handoff boundaries.
3. Curate the base afterward: decide link headroom and optional curated solid states using validator output and more than the original Blue profile. That avoids tuning defaults in isolation and keeps curation separate from derivation mechanics.

Wizard-first would produce user-flow learning sooner, but it would duplicate validation logic or codify gates before their source diagnostics are understood. Base-curation-first would polish the shipped profile fastest, but it would not reduce derivation risk and could optimize for Blue/Sand rather than the proven range. A guide-only path is inexpensive—the guide now exists—but leaves the exact failures found in M3 unenforced.
