# Palette generation rule research

> Task: T15. Research only; no starter CSS or fixture files changed. The rendered decision surface is [`docs/research/palette-rule/specimen.html`](../research/palette-rule/specimen.html). Exact source data, colour conversion, candidate rules, gamut mapping, validation, and gate maths are in [`palette-engine.mjs`](../research/palette-rule/palette-engine.mjs); [`analyze.mjs`](../research/palette-rule/analyze.mjs) reproduces the numerical tables.

## Scope, source set, and measurement convention

The fitted set is exactly six Radix Colors 3.0.0 sRGB families:

- Slate, Blue, Red from [`ds/tokens/palette.css`](../../ds/tokens/palette.css).
- Sand, Amber, Tomato from the read-only editorial worktree's `ds/tokens/palette.css`.

The held-out set is Green, Violet, Cyan, and Yellow. Their light and dark sRGB CSS was fetched from the official `@radix-ui/colors@3.0.0` package ([Green](https://unpkg.com/@radix-ui/colors@3.0.0/green.css), [Violet](https://unpkg.com/@radix-ui/colors@3.0.0/violet.css), [Cyan](https://unpkg.com/@radix-ui/colors@3.0.0/cyan.css), [Yellow](https://unpkg.com/@radix-ui/colors@3.0.0/yellow.css), with the corresponding `-dark.css` files). None of those four families contributes to any fitted table or anchor.

Every source hex is converted sRGB → linear RGB → OKLab → OKLCH. Reported ΔE is unscaled Euclidean OKLab distance:

`sqrt((L₁-L₂)² + (a₁-a₂)² + (b₁-b₂)²)`

This is the same scale used in [`color-architecture.md`](color-architecture.md): a value such as `0.02` means 0.02 in normalized OKLab coordinates, not “2” on a multiplied display scale. The specimen's measured-source explorer exposes L/C/H for all 240 source colours so low-chroma hue instability remains visible rather than being erased from the data.

## 1. What the curves revealed

### Chromatic lightness is role-shaped more than seed-shaped

Across fitted Blue, Red, Amber, and Tomato, light steps 1–8 have very similar **absolute** L despite the step-9 seeds spanning L `0.6256–0.8537`. Their cross-family L range is at most `0.0290` in that zone. Dark steps 1–8 are looser but still structured: range `0.0072–0.0360`. Step 9 is deliberately the seed and is therefore the large exception (`0.2281` fitted L range). Light step 10 follows step 9 closely—the fitted ratio `L10/L9` is `0.9630` with only `0.0162` range—while the other text steps return to a much more shared absolute topology.

| Step | Light mean L | Light L range | Dark mean L | Dark L range | Light C/C9 | Dark C/C9 |
|---:|---:|---:|---:|---:|---:|---:|
| 1 | 0.9935 | 0.0012 | 0.1883 | 0.0086 | 0.0172 | 0.0868 |
| 2 | 0.9835 | 0.0036 | 0.2093 | 0.0084 | 0.0707 | 0.1185 |
| 3 | 0.9597 | 0.0154 | 0.2595 | 0.0234 | 0.1893 | 0.3109 |
| 4 | 0.9314 | 0.0234 | 0.2988 | 0.0309 | 0.3146 | 0.4598 |
| 5 | 0.9010 | 0.0290 | 0.3417 | 0.0360 | 0.4269 | 0.5150 |
| 6 | 0.8634 | 0.0272 | 0.3910 | 0.0360 | 0.4796 | 0.5442 |
| 7 | 0.8115 | 0.0252 | 0.4562 | 0.0278 | 0.5465 | 0.5826 |
| 8 | 0.7441 | 0.0241 | 0.5396 | 0.0072 | 0.6796 | 0.6895 |
| 9 | seed | 0.2281 fitted | seed | 0.2281 fitted | 1.0000 | 1.0000 |
| 10 | seed × 0.9630 | 0.2323 raw | seed + (1−seed) × 0.1314 | 0.2215 raw | 1.0074 | 0.9664 |
| 11 | 0.5625 | 0.0149 | 0.7964 | 0.0974 | 0.9261 | 0.7728 |
| 12 | 0.3403 | 0.0282 | 0.9108 | 0.0364 | 0.4460 | 0.3083 |

This is why a first attempted rule that stretched every L around the seed performed badly on Amber and Yellow. The compact form supported by the data is hybrid: fixed role-position L for 1–8 and 11–12, an exact seed at 9, and a seed-relative 10.

Dark is not a mirror. Comparing each fitted dark L with `1 − light L` at the same role step gives mean absolute residual `0.2404–0.3403`; the worst residual is `0.7162` for Amber and the step-9 residual alone is `0.2511–0.7074`. Operationally, light step 10 gets darker than 9 while dark step 10 gets lighter; dark background steps also start with much more relative chroma than light ones. One mirrored parametric curve cannot express those behaviors.

### The chroma envelope has shared zones, not a shared peak formula

The tinted light 1–5 zone rises from about `0.017 × C9` to `0.427 × C9`; dark 1–5 rises faster, `0.087 → 0.515 × C9`. Steps 8–10 carry roughly `0.68 → 1.01 × C9` in light and `0.69 → 0.97 × C9` in dark. Text step 11 remains strongly chromatic (`0.926 × C9` light, `0.773 × C9` dark), then step 12 deliberately desaturates (`0.446`, `0.308`).

The actual peak is family-specific:

| Family | Light peak | Dark peak |
|---|---:|---:|
| Blue | step 9 · 1.000 × C9 | step 9 · 1.000 × C9 |
| Red | step 11 · 1.021 × C9 | step 9 · 1.000 × C9 |
| Amber | step 10 · 1.068 × C9 | step 10 · 1.148 × C9 |
| Tomato | step 11 · 1.022 × C9 | step 9 · 1.000 × C9 |

So “peak at 9” is a useful seed convention, not an exact description of every ramp. The shared envelope keeps step 9 as the scale anchor and accepts these residuals; the hue-neighbour candidate can inherit the local peak shape of nearby fitted families.

### Hue drift exists, but generic drift is not validated by held-out accuracy

Considering only chromatic source steps with `C ≥ 0.02`, maximum hue movement relative to step 9 is `2.9°–30.0°` in light and `6.6°–16.6°` in dark. Amber light is the large case: step 11 is `−20.2°`, step 12 `−30.0°` from its step-9 hue. Blue light reaches `17.0°`; Red `9.2°`; Tomato only `2.9°`. Low-chroma steps can report larger-looking angles without a correspondingly large perceptual difference, which is why the threshold is stated.

| Family | Light max visible drift | Dark max visible drift | Light step 11 / 12 | Dark step 11 / 12 |
|---|---:|---:|---:|---:|
| Blue | 17.0° | 13.3° | +0.4° / +7.0° | −2.3° / −13.3° |
| Red | 9.2° | 16.6° | +2.1° / −6.4° | −0.9° / −16.6° |
| Amber | 30.0° | 11.2° | −20.2° / −30.0° | +4.9° / +1.9° |
| Tomato | 2.9° | 6.6° | −0.6° / −2.9° | +1.6° / −2.1° |

For the shared rule, enabling the fitted mean drift changes fitted mean ΔE `0.01583 → 0.01532`, but held-out mean gets slightly worse, `0.01836 → 0.01871`. For the hue-neighbour rule it greatly improves fitted data (`0.00901 → 0.00225`) because Blue and Amber are themselves anchors, while held-out again gets slightly worse (`0.01442 → 0.01497`). Hue drift is perceptually real in source families, but these numbers do not validate a universal drift table.

### Neutrals are a separate, much simpler model

Slate and Sand share nearly the same L curve. Their identity difference is a low-chroma cast:

| Source step 9 | Light L / C / H | Dark L / C / H |
|---|---|---|
| Slate | 0.6453 / 0.0165 / 277.7° | 0.5370 / 0.0153 / 262.3° |
| Sand | 0.6413 / 0.0102 / 106.7° | 0.5344 / 0.0110 / 93.7° |

Slate's cool cast versus Sand's warm cast is therefore expressible as tint hue plus tint chroma, not a second lightness curve. The fitted dark neutral step-9 mapping from a light step-9 input is:

- `Ldark9 = Lseed × 0.832708`
- `Cdark9 = Cseed × 1.002483`
- optional source-like drift starts dark hue at `Hseed − 14.1849°`

The LGC source is the boundary case `C = 0`: its redistributed light L sequence is `1.000, .962, .952, .942, .932, .922, .869, .745, .600, .525, .485, .200`; dark is `.000, .200, .227, .253, .280, .320, .386, .485, .600, .673, .745, .962`. It is more contrast-forward than the Radix-neutral mean and proves that “neutral” does not imply one canonical role curve. The tint parameters can express true gray (`C=0`) versus cool/warm cast, but LGC's stronger L distribution remains a separate profile choice.

## 2. Candidate rules, stated exactly

Both candidates take:

1. A seed in OKLCH, conceptually the light step-9 colour.
2. `neutral | chromatic`.
3. For neutral, tint H and C (defaults may be read from the seed).
4. An independent `hue drift on | off` choice.

Both output 12 light + 12 dark 8-bit sRGB hex colours, clamp diagnostics, an on-solid foreground, and semantic gate results.

### Candidate A — shared role tables

For chromatic ramps:

- L at steps 1–8 and 11–12 is the absolute L table in §1.
- L9 is `Lseed` in both schemes.
- light L10 is `Lseed × 0.963021`; dark L10 is `Lseed + (1 − Lseed) × 0.131409`.
- C is `Cseed × Rscheme[i]`, using the C/C9 columns in §1.
- H is `Hseed` when drift is off.
- When drift is on, add these fitted offsets by step:
  - light: `−6.50, +3.61, +4.79, +2.77, +2.97, +0.33, −2.50, −5.49, 0, −0.53, −3.26, −5.14°`
  - dark: `−3.18, +0.24, −5.71, −5.56, −5.71, −4.23, −3.00, −1.98, 0, +2.78, +1.16, −6.81°`

For neutral ramps, the single-seed L must be normalized because the neutral dark step 9 is intentionally not the same colour as light step 9. Let `P` be the table below. For light steps 1–9, `L = 1 − (1 − Lseed) × P[i]`; for light 10–12, `L = Lseed × P[i]`. First derive dark seed L/C/H with the constants above; for dark 1–9, `L = Ldark9 × P[i]`; for dark 10–12, `L = Ldark9 + (1 − Ldark9) × P[i]`. C is the scheme seed C times the corresponding ratio.

| Scheme | P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 | P9 | P10 | P11 | P12 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| light L position | .0209 | .0497 | .1239 | .1915 | .2522 | .3188 | .4148 | .5817 | 1 | .9447 | .7777 | .3764 |
| light C ratio | .1044 | .1448 | .2053 | .3044 | .4127 | .4949 | .6089 | .8856 | 1 | .9048 | .7944 | .6640 |
| dark L position | .3320 | .3978 | .4702 | .5297 | .5823 | .6487 | .7472 | .9134 | 1 | .0999 | .4995 | .8896 |
| dark C ratio | .2246 | .2253 | .2743 | .3913 | .5098 | .5771 | .6991 | .8812 | 1 | .9549 | .7115 | .2154 |

Neutral fitted drift offsets are:

- light: `+4.21, +4.81, −7.23, −2.18, −6.12, +1.21, −2.06, −2.67, 0, −3.27, −8.44, −21.51°`
- dark after the `−14.1849°` scheme offset: `+20.09, +5.60, +9.87, −5.03, +0.89, −6.25, −5.49, −8.68, 0, +5.19, −3.13, +7.27°`

### Candidate B — hue-neighbour role tables

Candidate B uses the same formulas, gamut behavior, and gates, but does not use the single averaged chromatic profile. It has three fitted profile anchors:

| Anchor | Source profiles averaged | Anchor hue |
|---|---|---:|
| warm | Red + Tomato | 28.1825° |
| amber | Amber | 84.1300° |
| blue | Blue | 251.7799° |

For each anchor and scheme, construct absolute L, normalized step-10 position, C/C9, and optional per-step hue offsets with exactly the Candidate A measurements, using only the named source family/families. Sort anchors by hue, append warm again at `388.1825°`, find the two circular neighbors around `Hseed`, and linearly interpolate every profile value by angular position. Step 9 is still the input seed exactly. This deterministic construction is why Blue and Amber can regenerate exactly when drift is on; those zeros are overfit evidence, not held-out evidence.

For neutral Candidate B, use Slate and Sand as two profile anchors at `277.6998°` and `106.6846°`. For a tint hue `H`, weight each anchor by `exp(3 × cos(H − Hanchor))`, normalize the two weights, and blend each profile value. Candidate A simply averages the two neutral profiles.

### Shared gamut and edge policy

1. Clamp requested L to `[0,1]`; keep H modulo 360.
2. Convert the desired OKLCH coordinate to linear sRGB.
3. If all channels are in `[0,1]`, emit it directly.
4. Otherwise binary-search C between `0` and requested C for 26 iterations, holding L and H fixed; emit the maximum in-gamut C as an 8-bit hex.
5. Report every clamped step and `1 − Cused/Crequested` as chroma loss. Never silently channel-clip.

An sRGB colour-input seed can still produce out-of-gamut envelope steps; the failure gallery also includes a conceptual `oklch(.72 .34 150)` seed whose step 9 itself needs mapping. Very desaturated chromatic seeds (`C < .04`) and implausible step-9 lightness (`L < .35` or `L > .90`) generate a ramp but also emit a correction warning. The rule does not “repair” an absent chroma or silently reinterpret a dark brand chip as another step.

### Shared semantic gate algorithm

- **On-solid:** calculate contrast of `#ffffff` and `#111111` against generated step 9 in both schemes; output the candidate with the higher minimum ratio and pass only at `≥4.5:1`.
- **Link:** test step 11, then step 12, against generated neutral canvas (1) and subtle (2), both schemes. Return the first step passing all four `≥4.5:1` pairings. If neither passes, return the one with the higher minimum and an explicit failure.
- **Focus:** test 8, 9, 10, 11, 12 in that order against generated neutral canvas in both schemes. Return the first passing both at `≥3:1`; otherwise return the best minimum with failure.
- Blue/Red/Green/Violet/Cyan validation uses the generated Slate neutral; Amber/Tomato/Yellow uses generated Sand. Neutral-family cards label these accent gates not applicable rather than presenting a false product role.

## 3. Accuracy

### Candidate A — shared tables, hue locked

| Family | Set | Light mean / max ΔE | Dark mean / max ΔE | Clamped targets |
|---|---|---:|---:|---:|
| Slate | fitted | .0017 / .0059 | .0033 / .0065 | 0 |
| Sand | fitted | .0008 / .0019 | .0017 / .0037 | 0 |
| Blue | fitted | .0098 / .0240 | .0165 / .0375 | 12 |
| Red | fitted | .0110 / .0245 | .0128 / .0200 | 8 |
| Amber | fitted | .0348 / .0723 | .0225 / .0836 | 6 |
| Tomato | fitted | .0086 / .0192 | .0106 / .0217 | 8 |
| Green | held-out | .0113 / .0374 | .0197 / .0646 | 0 |
| Violet | held-out | .0132 / .0540 | .0134 / .0253 | 7 |
| Cyan | held-out | .0124 / .0354 | .0167 / .0286 | 3 |
| Yellow | held-out | .0348 / .0664 | .0254 / .1054 | 10 |

Fitted chromatic combined mean is `0.01583`; held-out mean is `0.01836`. The largest fitted error is Amber dark 11 (`0.0836`); held-out worst is Yellow dark 11 (`0.1054`). Blue/Red/Tomato and held-out Cyan are close in aggregate, but Amber/Yellow text-zone and tinted-zone errors are visible in aligned strips.

### Candidate B — hue-neighbour tables, fitted drift on

| Family | Set | Light mean / max ΔE | Dark mean / max ΔE | Clamped targets |
|---|---|---:|---:|---:|
| Slate | fitted | .0000 / .0000 | .0008 / .0018 | 0 |
| Sand | fitted | .0000 / .0000 | .0000 / .0000 | 0 |
| Blue | fitted | .0000 / .0000 | .0000 / .0000 | 0 |
| Red | fitted | .0036 / .0151 | .0046 / .0086 | 4 |
| Amber | fitted | .0000 / .0000 | .0000 / .0000 | 0 |
| Tomato | fitted | .0043 / .0130 | .0056 / .0103 | 8 |
| Green | held-out | .0200 / .0390 | .0186 / .0608 | 0 |
| Violet | held-out | .0156 / .0501 | .0132 / .0244 | 3 |
| Cyan | held-out | .0113 / .0299 | .0099 / .0305 | 3 |
| Yellow | held-out | .0172 / .0366 | .0140 / .0503 | 10 |

Fitted chromatic mean is `0.00225`, dominated by construction-level matches at Blue and Amber. Held-out mean is `0.01497`, and the held-out worst remains Green dark 11 (`0.0608`). Compared with Candidate A, this branch halves Yellow's combined error (`0.0301 → 0.0156`) but makes Green's combined error worse (`0.0155 → 0.0193`). That is the central tradeoff visible in the switcher.

The complete 24 per-step ΔE labels for every family are on the specimen rather than collapsed into averages. The worst-step locations matter: both candidates can have a respectable family mean while one semantic text step is visibly wrong.

### Interpreting ΔE without pretending to have a universal JND

The specimen shows paired swatches at measured ΔE `0.0048, 0.0097, 0.0196, 0.0402, 0.0794`. They differ along one OKLab axis and are therefore a controlled visual ruler, not a complete perceptual study.

**Opinion, offered as labels for the user's visual decision rather than a system conclusion:** below `0.005` is usually negligible beside normal 8-bit quantization; `0.005–0.015` is close; `0.015–0.03` becomes visible in aligned strips; `0.03–0.06` is an obvious local mismatch; above `0.06` should not be called a faithful regeneration. Surface size, adjacency, hue, and role can move those judgments, so the page deliberately keeps mean and max separate.

## 4. Contrast gates on generated output

Every chromatic validation family passes when the rule is allowed to choose a semantic step and on-solid polarity dynamically. The evidence does **not** support hard-coding the same link or focus index for every generated family.

| Family | Candidate A on-solid | A link | A focus | Candidate B on-solid | B link | B focus |
|---|---|---|---|---|---|---|
| Blue | `#111` 5.78 | 12 · 11.18 | 9 · 3.19 | `#111` 5.78 | 11 · 4.53 | 9 · 3.18 |
| Red | `#111` 4.82 | 11 · 4.80 | 9 · 3.82 | `#111` 4.82 | 11 · 4.87 | 9 · 3.82 |
| Amber | `#111` 11.96 | 12 · 11.23 | 11 · 4.58 | `#111` 11.96 | 12 · 10.79 | 11 · 4.53 |
| Tomato | `#111` 4.88 | 11 · 4.78 | 9 · 3.80 | `#111` 4.88 | 11 · 4.81 | 9 · 3.80 |
| Green | `#111` 5.98 | 12 · 10.89 | 9 · 3.08 | `#111` 5.98 | 12 · 10.94 | 9 · 3.08 |
| Violet | `#fff` 5.39 | 11 · 4.68 | 9 · 3.50 | `#fff` 5.39 | 11 · 4.73 | 9 · 3.50 |
| Cyan | `#111` 6.29 | 12 · 11.01 | 10 · 3.22 | `#111` 6.29 | 12 · 11.52 | 10 · 3.23 |
| Yellow | `#111` 14.93 | 12 · 11.05 | 11 · 4.50 | `#111` 14.93 | 12 · 10.88 | 11 · 4.48 |

Numbers are minimum WCAG contrast across the required generated surfaces and schemes. Candidate A is shared + locked; Candidate B is hue-neighbour + fitted drift. The on-solid result is the same because both preserve step 9. The computed local `≥4.5` policy selects a dark foreground for Blue, Red, Amber, Tomato, Green, Cyan, and Yellow; only Violet selects white. That is intentionally a gate result, not a copy of Radix's own contrast-token policy.

The gate algorithm also reports arbitrary-input failures. For example, desaturated `#777b84` in chromatic mode gives the better on-solid candidate only `4.45:1`; the UI labels it fail rather than substituting a hidden third foreground. Candidate A's Yellow focus minimum displays as `4.50` but is above the 3:1 focus gate; it is not being evaluated as body text.

## 5. Hard realities shown in the failure gallery

| Case, Candidate A locked unless noted | Clamp result | What the generator can and cannot do |
|---|---:|---|
| Radix Yellow seed `#ffe629` | 10/24; worst 31% C loss | Correctly selects dark on-solid; shared tables still miss Yellow dark 11 by ΔE .1054. Candidate B reduces held-out max to .0503, not to invisibility. |
| sRGB-edge green `#00ff66` | 10/24; worst 30% | An in-gamut seed can drive other envelope coordinates outside sRGB. Chroma reduction is visible and itemized. |
| conceptual `oklch(.72 .34 150)` | 14/24; worst 51% | Step 9 itself is outside sRGB; the emitted palette is explicitly an approximation of the requested seed. |
| desaturated `#777b84` in chromatic mode | 0 clamps | No seed chroma means no inferred chromatic identity; on-solid fails at 4.45:1. The rule warns rather than inventing saturation. |
| very dark `#351b48` as step 9 | 0 clamps | Fixed role tables remain intact but 8→9→10 becomes topologically implausible. The rule warns and leaves reinterpretation to the user. |

The measured answer to the research question is therefore bounded: a compact hybrid table can generate coherent, gate-aware 12×2 ramps and can be close on several untouched hues. This experiment does not establish “Radix-quality for any brand colour”: Candidate A's held-out max reaches `0.1054`; Candidate B reduces the worst held-out error to about `0.0608` but does so with fitted anchors and a Green regression. Neutrals are substantially more tractable than arbitrary chromatics.

## 6. Verification

- The artifact is static: one HTML file plus two local ES modules; it imports no starter CSS, library, font, asset, or network resource.
- The live control exercises fitted seeds, held-out seeds, Yellow, boundary green, desaturated and dark extremes, and a conceptual out-of-gamut OKLCH seed.
- Every gallery regeneration starts only from source step 9 plus the declared flag/tint; held-out families are absent from fitting code paths.
- `analyze.mjs` reproduces the curve, validation, mirror, hue-drift, peak, clamp, and gate numbers from the embedded exact hex data.
- Browser verification: served from the repository root on port 8051; live generator, both rule branches, hue toggle, neutral tint controls, all galleries, full measured-source table, and mobile reflow exercised with zero console errors. The server was closed after verification.
- Repository scope: no files under `ds/` or `fixtures/` changed; no commit made.

## Decisions left to the user

1. **Which rule branch is acceptable:** shared role tables or hue-neighbour tables. Evidence: §3 tables and the specimen's aligned regeneration gallery, especially Amber/Yellow improvement versus the Green tradeoff.
2. **What mean and max ΔE the wizard may call acceptable:** the specimen's ΔE lens and per-step annotations make the tolerance visible; §3 offers opinion-labelled bands but does not set policy.
3. **Whether hue drift is on or off:** §1 shows real source drift; the switcher shows that fitted error improves while held-out mean changes slightly in the wrong direction.
4. **Which neutral tint model to expose:** a single constant tint over the shared Slate/Sand curve, or hue-weighted Slate/Sand neighbor profiles with optional source-like drift. Evidence: §1 neutral measurements and neutral presets in the live generator. LGC also leaves open whether a true-gray/high-contrast L profile should be a separate neutral profile option.
5. **What on-solid policy the wizard should use:** the implemented branch chooses the better of `#fff` and `#111` at 4.5:1; the user may instead allow a brand-neutral foreground such as the generated neutral 12 or follow source-specific prescribed contrast colours. Evidence: §4 and the Yellow/desaturated failure cards.
6. **Whether semantic indices may vary per generated family:** all validation families pass only because link and focus steps are selected by gates; §4 shows links moving between 11/12 and focus moving among 9/10/11.
7. **How the wizard handles implausible seeds:** generate-with-warning as demonstrated, ask the user to reinterpret the colour as another role, or refuse generation outside agreed L/C bands. Evidence: §5 failure gallery.
8. **How much sRGB chroma loss is tolerable before the wizard stops:** the specimen reports count and worst loss, but neither candidate establishes a cutoff. Evidence: clamp badges and §5's 23–51% stress losses.
