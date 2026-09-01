# Findings — T17 Scale rules

> Task: research candidate generative rules for spacing, type size/leading, and radius without choosing the shipped rule.
> Date: 2026-09-01
> Files touched: `docs/research/scale-rules/specimen.html`, `docs/findings/scale-rules.md`

## What was built

- A static, zero-network specimen linked to the real `ds/index.css`, with live controls for spacing base, spacing progression, spacing ratio, density level, density model, body type anchor, modular ratio, rounding, leading rule, and radius softness.
- Root-level generated overrides for `--ds-space-1..8`, `--ds-font-size-1..6`, all six existing typography-role shorthands, and `--ds-radius-sm|md|lg|full`. No `ds/` source is changed.
- A real-system composition in pinned light and dark: rich text with headings, paragraphs, list and code; card with field, buttons, and open disclosure; and a stack of cards.
- Four side-by-side parameter bundles, each rendered through the same composition in both schemes and accompanied by its generated value tables and relational readouts.
- Four deliberately degraded corners: globally tiny space, a runaway geometric tail, a type-ratio cliff, and finite radii beyond half the control height.
- Proposed green/amber/red gates for the existing relations. These are explicitly proposals, not decisions or claims of visual quality.

The page holds the research interface itself on fixed lab values. Only the compositions use the generated DS-Starter values; otherwise an extreme input could make its own controls unusable and prevent honest comparison.

## Parametrizations, stated precisely

### 1. Common notation

- `b_s` is the spacing base in px; the specimen exposes 2–6px in 0.5px increments and starts at 4px.
- `S_i`, for `i = 1..8`, is the px value written as `--ds-space-i` after conversion to `rem` by dividing by 16.
- `b_t` is the body anchor in px and writes `--ds-font-size-2`; the specimen exposes 14–18px in 0.5px increments and starts at 16px.
- `r_t` is the type modular ratio.
- `T_i`, for `i = 1..6`, is the px value written as `--ds-font-size-i` after conversion to `rem` by dividing by 16.
- `Q_q(x) = round(x / q) × q` is quantization to quantum `q`.
- Generated spacing is finally quantized to 0.25px so printed values and CSS values are inspectable. Generated leading is quantized to 0.05.
- The 16px divisor is a serialization convention, not a forced document root size: output remains `rem`, so browser/user root scaling still applies.

### 2. Spacing progression candidates

#### Candidate S-H — current hybrid

Before density:

```text
S_i = b_s × H_i
H = [1, 2, 3, 4, 6, 8, 12, 16]
```

At `b_s = 4`, this is the existing 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64px scale.

Relations preserved by construction at default density:

- `S_2 / S_1 = 2`
- `S_4 / S_2 = 2`
- `S_6 / S_4 = 2`
- stack `sm / md / lg` therefore reads as 8 / 16 / 32px, a doubling at each preset.
- prose `space-1 / 2 / 4 / 6` reads as 4 / 8 / 16 / 32px, also a doubling at each named rhythm role.

Relations needing a gate:

- Component consumers also use steps 3 and 5, so the scale does not by itself prove that card padding, field padding, and prose indent remain coherent at another base.
- A non-default density model may change the relations even though the progression name remains “hybrid.”

#### Candidate S-G — pure geometric

Before density:

```text
S_i = b_s × r_s^(i - 1)
```

The specimen exposes `r_s = 1.25..2.0`. The gallery instance uses 1.5 and produces 4 / 6 / 9 / 13.5 / 20.25 / 30.5 / 45.5 / 68.25px after 0.25px quantization.

Relations preserved by construction:

- Every adjacent ratio is approximately `r_s` after quantization.
- The curve is described by only a base and one ratio.

Relations needing a gate:

- The prose/stack relations are not adjacent in token index. `S_2/S_1 = r_s`, while `S_4/S_2 = S_6/S_4 = r_s²`.
- Therefore no single geometric ratio makes all three fitted relations equal 2: the first relation requires `r_s = 2`, while the latter two require `r_s = √2 ≈ 1.414`.
- Ratios near 2 make the tail explode: the 4px-base scale ends at 512px.
- Quantization perturbs the constant ratio most strongly at the first, smallest steps.

This incompatibility is mathematical, not a taste judgment. A user can still prefer the geometric branch, but the wizard must show which semantic relation is being relaxed.

#### Candidate S-L — linear / compact-tail alternative

Before density:

```text
S_i = b_s × i
```

At 4px it produces 4 / 8 / 12 / 16 / 20 / 24 / 28 / 32px.

Relations preserved by construction:

- The difference between adjacent values is always `b_s`.
- `S_2/S_1 = 2` and `S_4/S_2 = 2`, so tight/list and normal-flow relationships match the fitted instance.
- The tail cannot run away.

Relations needing a gate:

- `S_6/S_4 = 1.5`, so heading-before spacing and stack `lg` are materially less distinct from normal flow / stack `md`.
- Large card padding and large layout intervals compress toward the mid-scale.

Opinion, labelled: linear is worth keeping as a real candidate rather than only a failure foil. Its additive predictability may suit dense application UI, but it gives up the strong large-interval hierarchy visible in the current compositions.

### 3. Density models

Density is a level (`compact | default | comfortable`) plus one of three incompatible interpretations. Keeping those two inputs separate prevents the word “compact” from silently choosing an algorithm.

#### D-G — global base scaling

After progression generation:

```text
compact:     S_i' = 0.85 × S_i
default:     S_i' = 1.00 × S_i
comfortable: S_i' = 1.15 × S_i
```

Preserved by construction: all spacing ratios.

Needs a gate: every absolute composition interval moves together. Card/field geometry and prose flow cannot be adjusted independently. This exactly reproduces the M3 limitation rather than solving it.

#### D-C — small-step curve reshaping

After progression generation, multiply each step by the corresponding vector:

```text
compact:     [0.75, 0.80, 0.85, 1, 1, 1, 1, 1]
default:     [1,    1,    1,    1, 1, 1, 1, 1]
comfortable: [1.25, 1.20, 1.15, 1, 1, 1, 1, 1]
```

Preserved by construction:

- `space-4`, `space-6`, and therefore normal prose flow, heading-before rhythm, stack `md`, and stack `lg` remain fixed.
- The upper layout tail remains fixed.

Needs a gate:

- `space-1` and `space-2` are not control-only values. Prose list-item spacing and heading-to-block spacing move with field gap, button gap, small field padding, card actions, and stack `sm`.
- `space-3` affects field/card padding, disclosure gap/padding, and code padding together.

This model demonstrates a narrower form of the same M3 limit: curve reshaping can hold some prose relations, but shared step roles prevent it from expressing control density independently.

#### D-T — density-selected preset tables

The specimen uses these px tables at `b_s = 4`, then multiplies every entry by `b_s / 4`:

| Density | `space-1..8` at a 4px base |
|---|---|
| Compact | 3 / 6 / 9 / 14 / 20 / 28 / 40 / 52 |
| Default | 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 |
| Comfortable | 5 / 10 / 15 / 20 / 30 / 42 / 64 / 88 |

When this model is selected, progression and `r_s` are intentionally bypassed; the specimen disables those controls.

Preserved by construction: only the relations explicitly encoded into each table. The default table is the current fitted relation set. All others need the complete relational gate.

Consequence: tables can express any desired curve and can retain or move arbitrary steps, but the parameters cease to be generative in the small-formula sense. They relocate curation into multiple stored tables and make new density levels non-interpolable unless another rule is added.

### 4. Type-size rule

Six raw steps are generated around step 2, which is the body anchor. The ratio menu is:

| Ratio | Voice label in specimen | Exact anchored span at 16px (`T_1 → T_6`) |
|---:|---|---:|
| 1.125 | quiet | 14.22 → 25.63px |
| 1.2 | moderate | 13.33 → 33.18px |
| 1.25 | assertive | 12.80 → 39.06px |
| 1.333 | display-led | 12.00 → about 50.5px |

The voice labels are descriptive aids, not decisions.

#### T-E — exact, anchor-derived

```text
T_i = b_t × r_t^(i - 2), for i = 1..6
```

This is the mathematically clean modular scale. It preserves a constant ratio exactly before CSS serialization. It does not reproduce the current hand-rounded values: at `16 × 1.2`, step 6 is 33.178px rather than 34px.

#### T-Q — cumulatively quantized

For quantum `q = 1px` or `0.5px`:

```text
T_2 = Q_q(b_t)
T_1 = Q_q(T_2 / r_t)
T_i = Q_q(T_(i - 1) × r_t), for i = 3..6
```

Whole-pixel cumulative rounding with `b_t = 16` and `r_t = 1.2` yields 13 / 16 / 19 / 23 / 28 / 34px—the current fitted type scale exactly.

Consequences requiring review:

- Whole pixels are easy to inspect and give stable small labels, but rounding error propagates into later steps. The result is no longer a constant-ratio scale.
- Half pixels reduce the local jump while remaining readable in token tables, but still propagate error.
- Exact anchoring preserves the ratio and avoids propagation, but exposes long fractional sizes and can create nearly indistinguishable small-step changes at quiet ratios.
- Regardless of rounding, body and label sizes must be tested against fixed 44/36px controls; type generation does not currently regenerate control heights.

Opinion, labelled: the exact branch is the clearer mathematical contract; the cumulative branch is the only branch that can honestly call the current type values a fitted instance without inserting a one-off exception. That is a tradeoff for the user, not grounds to select either here.

### 5. Leading rule

The rule is a size function with role offsets and clamps. For a profile `p`:

```text
C_p(s) = A_p - B_p × (s - 16)

label_p(s)   = Q_0.05(clamp(1.10, C_p(s) + labelOffset_p, labelMax_p))
body_p(s)    = Q_0.05(clamp(bodyMin_p, C_p(s), bodyMax_p))
heading_p(s) = Q_0.05(clamp(1.05, C_p(s) + headingOffset_p, 1.45))
```

Profile constants:

| Profile | `A` | `B` | label offset | heading offset | body min/max | label max |
|---|---:|---:|---:|---:|---:|---:|
| Dense | 1.45 | 0.014 | -0.25 | -0.18 | 1.40 / 1.55 | 1.20 |
| Balanced | 1.50 | 0.0125 | -0.30 | -0.16 | 1.45 / 1.60 | 1.20 |
| Airy | 1.62 | 0.011 | -0.32 | -0.18 | 1.55 / 1.70 | 1.30 |

Role-size mapping remains fixed:

```text
label-sm → T_1     label-md → T_2     body-md → T_2
heading-sm → T_3   heading-md → T_4   heading-lg → T_5
```

At the current fitted type instance, balanced leading yields 1.2 / 1.2 / 1.5 / 1.3 / 1.25 / 1.2, exactly matching the existing six roles.

Preserved by construction:

- Within a role family and away from clamps, a larger size receives tighter leading.
- Labels are tighter than body even when both consume `T_2`.
- Headings receive an explicit tighter offset rather than inheriting body leading.

Needs a gate:

- Font metrics are not inputs. A line-height number that is safe for `system-ui` may clip or feel loose with a chosen serif/display stack.
- Clamps intentionally flatten the function at extremes.
- Wrapped headings, multiline labels, code blocks that inherit leading, and 36/44px controls must be rendered.

The LGC-like derivation used label 1.25, body/heading-sm 1.4, heading-md 1.2, heading-lg 1.1; the editorial derivation used body 1.65 and headings 1.35 / 1.3 / 1.25. Those verified instances justify a menu of leading profiles and gates; they do not identify a universal formula.

### 6. Radius rule

The softness input selects one finite triple in px:

| Softness | sm | md | lg | `full` |
|---|---:|---:|---:|---:|
| Sharp | 2 | 4 | 6 | 999rem |
| Soft / current fit | 4 | 8 | 12 | 999rem |
| Round | 8 | 14 | 22 | 999rem |

Preserved by construction:

- `sm < md < lg`.
- `full` is fixed, so pill buttons require no generated tuning.
- Soft reproduces the current 4 / 8 / 12px scale exactly.

Needs a gate:

- `md` must be read against the field’s fixed 36/44px heights.
- `lg` must be read on cards, nested cards, prose frames, and both schemes; it has no single control-height denominator.
- Round at 14px is 0.318 of a 44px field height and remains below the proposed green ceiling of 0.35. The breakage corner at 24px is 0.545 and visually becomes an accidental pill.

The presets are categorical on purpose. A formula such as `[x, 2x, 3x]` would reproduce only the soft instance and would falsely imply that equal numeric multiples preserve equal perceived softness across different box sizes.

## Preset tables

These bundles are comparison anchors, not recommended defaults.

| Bundle | Spacing px | Type px (`1..6`) | Leading by role | Radius px |
|---|---|---|---|---|
| Current base · fitted | 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 | 13 / 16 / 19 / 23 / 28 / 34 | 1.2 / 1.2 / 1.5 / 1.3 / 1.25 / 1.2 | 4 / 8 / 12 |
| Compact · small-step curve | 3 / 6.5 / 10.25 / 16 / 24 / 32 / 48 / 64 | 13 / 15 / 17 / 19 / 21 / 24 | 1.2 / 1.2 / 1.45 / 1.25 / 1.25 / 1.2 | 2 / 4 / 6 |
| Comfortable · table | 5 / 10 / 15 / 20 / 30 / 42 / 64 / 88 | 13.5 / 17 / 21.5 / 27 / 34 / 42.5 | 1.3 / 1.3 / 1.6 / 1.4 / 1.3 / 1.25 | 8 / 14 / 22 |
| Geometric · 1.5 | 4 / 6 / 9 / 13.5 / 20.25 / 30.5 / 45.5 / 68.25 | 13 / 16 / 19 / 23 / 28 / 34 | 1.2 / 1.2 / 1.5 / 1.3 / 1.25 / 1.2 | 4 / 8 / 12 |

Consequences visible in the specimen:

- Current is the only bundle that fits every current non-colour value and rhythm relation.
- Compact holds `space-4` and `space-6`, so normal prose flow and section-opening space stay at 16/32px; the list, heading-to-block gap, field gap, and small padding become denser together.
- Comfortable changes prose and controls together because the table has no role separation. Its 17px body leaves less breathing inside the unchanged 44px field even though the control/type ratio remains inside the proposed band.
- Geometric 1.5 keeps a coherent curve but makes `space-2 / space-1 = 1.5` while the two-step rhythm ratios become 2.25.

## Relational-constraint analysis and proposed gates

All thresholds below are proposals. They make the specimen useful as a diagnostic; the user must decide whether they become wizard warnings, hard gates, different thresholds, or no gates.

### Control height / type

Read both:

```text
44px field height / body-md size
36px small-button height / label-sm size
```

- Green proposal: 2.40–3.05.
- Amber proposal: 2.10–3.35.
- Red outside amber.

The specimen also prints spare vertical pixels as `height - (fontSize × lineHeight)`. This is not a box-model proof—the control may align line boxes and glyph metrics differently—but it exposes a combination that has no room left before it is visually tested.

No candidate spacing rule preserves this relation because the control heights are currently literals. Type size and leading must gate it.

### Prose rhythm and stack presets

Read:

```text
space-2 / space-1    tight heading gap vs list-item gap
space-4 / space-2    normal flow vs heading-to-block
space-6 / space-4    section opening vs normal flow; stack lg vs md
```

- For the first two, green 1.65–2.35; amber 1.35–2.70.
- For the last, green 1.60–2.40; amber 1.30–2.80.
- Red outside amber.

Hybrid/default preserves all three by construction. Global density preserves whatever the selected progression produced. Curve density preserves the last ratio but changes the first two. Tables need all gates. Pure geometric cannot make all three exactly 2 with one ratio. Linear makes the last ratio 1.5.

### Leading

- Labels: green 1.15–1.30; amber 1.10–1.35.
- Body: green 1.45–1.65; amber 1.35–1.75.
- Headings: green 1.15–1.40; amber 1.05–1.50.

The readout reports the worst status across all six roles. A later validator should additionally measure resolved font metrics if the browser makes that practical; numeric leading alone cannot validate a font stack.

### Label weight / strong weight

- Green proposal: resolved values differ.
- Red: equal values.
- No amber band.

The specimen holds `medium = 500` and `strong = 600`, so this relation stays green by construction. The point of printing it is to keep the M3 600/600 failure visible and to prevent a future “voice generator” from absorbing weights without a relational check.

### Radius / control

Read `radius-md / 44px`:

- Green proposal: `≤ 0.35`.
- Amber proposal: `> 0.35` and `≤ 0.50`.
- Red: `> 0.50`.

This is a finite-radius/pill ambiguity gate, not a universal curvature-quality metric. Card `radius-lg` still needs visual review.

## Breakage findings

1. **2px base + global compact.** Spacing becomes 1.75 / 3.5 / 5 / 6.75 / 10.25 / 13.5 / 20.5 / 27.25px after quantization. Ratios remain close to their source relations, so a ratio-only validator can stay green/amber while the real card padding and field gaps become cramped beside fixed control heights. Absolute-value review is still necessary.
2. **Geometric ratio 2.** Spacing becomes 4 / 8 / 16 / 32 / 64 / 128 / 256 / 512px. The adjacent ratio looks perfectly systematic; compositions become unusable. A maximum-tail or viewport-relative warning is needed if this ratio remains available.
3. **Type ratio 1.5.** With a 16px anchor and half-pixel cumulative rounding, type becomes 10.5 / 16 / 24 / 36 / 54 / 81px. Body/control remains acceptable, so one aggregate control ratio cannot catch the heading cliff. Maximum step and adjacent role-distinction gates are needed.
4. **18 / 24 / 32px radii.** The 24px field radius exceeds half of the 44px control height and becomes visually indistinguishable from pill intent, while `radius-full` still exists as the explicit pill token.

The broader finding is that no one relational readout is sufficient. Ratio gates catch semantic collapse; absolute/corner gates catch runaway or cramped but internally regular scales; composition catches font metrics and perceived hierarchy.

## What stays out of generation

- **Font stacks.** A stack expresses voice, availability, licensing, and metrics. The wizard may record a user-supplied stack, but a numerical rule cannot decide that Georgia is a convincing substitute for a licensed display face.
- **Weights.** Normal/medium/strong are role and state decisions. Generating them from type ratio or “voice” risks collapsing the disclosure’s required label/strong delta.
- **The six typography role names and mappings.** Labels, body, and three heading roles are architectural consumers. The generator supplies their size and leading values, not new role semantics.
- **Spacing-step roles.** Prose continues to consume 1/2/4/6 and stack continues to map sm/md/lg to 2/4/6. Remapping them would be a component/rhythm architecture decision rather than scale generation.
- **Control heights.** The current 36/44px literals are held fixed so the research exposes whether generated type remains proportionate. Generating them belongs to a separate control-density decision if the user chooses one.
- **`radius-full`.** Pill intent is already scale-independent at 999rem.
- **Font assets and non-font role treatments.** Letter spacing, text transform, feature settings, measure, and per-element editorial treatments remain outside the font-only role contract.

## Conventions that held

- The specimen could replace every studied value through public root custom properties while the real six-component composition continued to work. No component selector or token source needed a special case.
- The existing role shorthands remained the correct boundary: generation rewrites one complete `font` value per role, while components remain unaware of size/leading math.
- Light/dark remains a colour-context concern. The same generated non-colour values apply without scheme branches.
- The process curation rule held. Candidate names, formulas, consequences, thresholds, and failures are presented; no branch is promoted as the answer.
- The M3 relational-delta finding generalizes: valid individual values do not ensure valid generated sets. Rhythm, control proportion, leading, and radius need cross-token gates.

## Friction / surprises

### 1. “Density” is not one parameter

The level compact/default/comfortable is only a label until a model says what moves. Global scaling, curve reshaping, and preset tables have different invariants and different costs. A wizard question asking only “How dense?” would hide a design decision.

### 2. Shared steps prevent a clean prose/control split

Curve density initially appears to solve the M3 limitation because it can hold `space-4` and `space-6`. It still moves prose `space-1` and `space-2` because those same values serve field/button/card geometry. No candidate using one shared eight-step scale can independently express prose and control density.

### 3. A current fit depends on rounding order

The current 13 / 16 / 19 / 23 / 28 / 34 values are exactly generated by cumulative whole-pixel rounding at 1.2, but not by the usual anchor-derived modular formula. “Ratio 1.2, rounded to pixels” is not reimplementable until rounding order is specified.

### 4. The geometric spacing promise conflicts with semantic indexing

The meaningful rhythm comparisons skip different numbers of token indices. Constant adjacent ratios therefore cannot preserve all current semantic ratios. This is a structural consequence of the current token-role mapping, not evidence that geometric scales are inherently invalid.

### 5. Numeric gates miss internally coherent extremes

The 2px compact base keeps the hybrid ratios; ratio readouts remain green. The ratio-2 geometric scale is perfectly regular. Both compositions visibly fail for ordinary use. The wizard needs relational gates plus bounded absolute/tail warnings and the rendered composition.

## Open questions raised

- If the user wants real control density, should control heights/padding gain a separate generated axis, should prose spacing gain a separate rhythm scale, or should the shared scale roles be split? T17 provides evidence for the question but no third control and no authorization to change architecture.
- Should the type generator fit the existing values exactly through cumulative rounding, or favor the simpler exact anchored formula and treat the base as an approximate historical instance?
- Should a ratio menu expose only values with known safe six-step spans at the chosen base, dynamically warn, or allow free input?
- Does density-table selection still count as desirable generation, or is it intentionally curated preset storage?
- Should leading profiles include font-metric categories (system sans / text serif / display serif), or should every font-stack choice require manual leading review?
- Is the proposed 0.35 radius/control green ceiling useful across actual product controls, or only as a pill-ambiguity warning?
- Should tail bounds be absolute px, viewport-relative, consumer-based (largest actual token use), or all three?

## Suggested convention changes (if any)

No convention change is proposed before the user chooses the generation branches.

If a branch is adopted later, conventions §5b should record enough detail to reimplement it: formula, anchor index, rounding order, density semantics, leading constants/clamps, fixed values, and the accepted gate matrix. Merely recording “modular scale,” “compact,” or “soft” would be underspecified.

## Decisions left to the user

1. **Spacing progression shape:** current hybrid; pure geometric (and which `r_s` range/default); linear compact-tail; or another supplied shape.
2. **Density model:** global base scaling; small-step curve reshaping; explicit preset tables; no spacing-based density; or a future separate prose/control density architecture.
3. **Type ratio menu:** retain 1.125 / 1.2 / 1.25 / 1.333; narrow it; relabel it; allow free input; and decide whether the menu changes with the body anchor.
4. **Type rounding:** exact anchor-derived; whole-pixel cumulative (the current fit); half-pixel cumulative; or another specified reconciliation policy.
5. **Leading rule:** dense/balanced/airy formula profiles; a smaller menu; font-category-specific profiles; fixed per-role tables; and whether the balanced current fit is a default or only a reference.
6. **Radius presets:** sharp 2/4/6, soft 4/8/12, round 8/14/22; different triples/names; a continuous softness input; and whether `full = 999rem` stays fixed.
7. **What stays fixed:** font stacks, weights, role mappings, spacing-step roles, control heights, and radius-full as listed above—or explicitly move any of them into a separately researched generator.
8. **Gate thresholds and severity:** accept, change, or reject the proposed control/type, rhythm, leading, weight-delta, and radius bands; decide which are warnings versus hard stops.
9. **Absolute/tail gates:** choose whether the wizard also bounds minimum steps, maximum steps, six-step type span, and viewport-relative composition growth, since relational gates alone do not catch coherent extremes.
10. **Status of preset tables:** decide whether they are valid generative outputs, curated named bundles, or only research comparisons.
