# Findings — Radix custom-generator study

> Task: T16 — obtain, explain, run, and compare the real Radix custom-colour generator with T15 Candidates A and B.  
> Date: 2026-09-01  
> Files touched: `docs/research/palette-rule/vendor/**`, `radix-generator.bundle.mjs`, `radix-branch.mjs`, `radix-analysis.mjs`, `specimen.html`, and this finding. Nothing under `ds/` or `fixtures/` changed.  
> Rendered decision surface: [`specimen.html`](../research/palette-rule/specimen.html). Reproduce the tables with `node docs/research/palette-rule/radix-analysis.mjs`.

## Headline result: it is not a Radix-family reproducer

With Blue 9 as both accent inputs, Slate 9 / Slate Dark 9 as the gray inputs, and white / Slate Dark 1 as the canvases, the real generator reproduces only **3/12 light steps and 2/12 dark steps exactly**. Its combined mean ΔE is `.00991`; its max is `.07971` at dark step 10.

| Scheme | Exact steps | Mean ΔE | Max ΔE · step |
|---|---:|---:|---:|
| Light | 3/12: 1, 2, 9 | .00912 | .02363 · 11 |
| Dark | 2/12: 9, 11 | .01070 | .07971 · 10 |
| Combined | 5/24 | .00991 | .07971 · dark 10 |

This is expected once the source is read. The engine uses published P3 families as *shape references*, then locks every generated step to the input hue, rescales chroma, rewrites step 9, synthesizes step 10 with a button-hover formula, caps text chroma, and moves the scale toward a custom canvas. It is a custom-theme generator, not an inverse of `@radix-ui/colors`.

The most visible Blue mismatch is dark 10: published `#3b9eff`, generated `#0083f1`. Published dark 10 is lighter than Blue 9; the generator's shared hover formula sees Blue 9 lightness above `.4` and makes the hover darker. That one intentional custom-theme behavior accounts for the `.07971` maximum.

## Provenance and runnable adaptation

The upstream file was fetched from [`radix-ui/website/components/generate-radix-colors.tsx`](https://github.com/radix-ui/website/blob/bb424082fd33fadc244a6dd276d3ced55caa6234/components/generate-radix-colors.tsx) at commit `bb424082fd33fadc244a6dd276d3ced55caa6234` on 2026-09-01. Its exact dependencies at that commit are:

- `@radix-ui/colors@3.0.0`, published git head `c4d0e50006c71ec51c4d6ff349062ab261b57e67`;
- `colorjs.io@0.5.2`, published git head `c3dce07d4d3f3163182c24b2ceed99096b9c4d5a`;
- `bezier-easing@2.1.0`, tag commit `b9f7a8b623c00ecdbf304c2d542adfa9e5c63872`.

The exact upstream source, dependency distributions, MIT licenses, revisions, and pre-header SHA-256 hashes are recorded in [`vendor/README.md`](../research/palette-rule/vendor/README.md). The upstream files are unchanged below their required provenance headers.

[`radix-generator.bundle.mjs`](../research/palette-rule/radix-generator.bundle.mjs) is an offline ES-module bundle of those exact inputs. [`radix-branch.mjs`](../research/palette-rule/radix-branch.mjs) does not restate the algorithm: it makes the two appearance-specific calls, maps returned hex values into T15's specimen shape, supplies visible comparison defaults, and calculates ΔE and gate annotations. Candidate A/B code in `palette-engine.mjs` was not modified.

The [current Radix page provider](https://github.com/radix-ui/website/blob/bb424082fd33fadc244a6dd276d3ced55caa6234/app/colors/custom/color-theme-provider.tsx#L84-L99) makes separate light and dark calls and allows independent accent, gray, and background values per appearance. To retain T15's one-seed premise, this study sends the same light step-9 accent to both calls. Family validation uses the associated neutral's light and dark step 9 as the gray inputs, `#fff` for light background, and that neutral's dark step 1 for dark background. The live specimen exposes all four extra gray/canvas inputs, so this study choice is inspectable rather than hidden.

## The algorithm, to reimplementation detail

### 1. Reference data and nearest-scale selection

For each appearance, the engine loads 29 P3 reference scales from `@radix-ui/colors@3.0.0`: six grays (`gray`, `mauve`, `slate`, `sage`, `olive`, `sand`) and 23 chromatic families from Tomato through Amber. It converts all 12 steps of each scale to OKLCH. A gray output searches only the six gray references; an accent output searches all 29.

For an input colour `S`:

1. Compute ColorJS `deltaEOK(S, step)` to every step of every allowed reference family.
2. Sort all points by distance, then keep the closest point from each family. This means the comparison family is represented by whichever of its 12 steps is nearest to the input; step 9 is not privileged during selection.
3. If the nearest family is gray but at least one chromatic family is available, discard subsequent gray candidates until the second family is chromatic. This stops two near-identical grays from consuming both blend anchors. A gray-only search does not do this.
4. Call the nearest points `A` and `B`. Let `a = distance(S,B)`, `b = distance(S,A)`, and `c = distance(A,B)`. By the law of cosines:

   `cosA = (b² + c² − a²) / (2bc)`  
   `cosB = (a² + c² − b²) / (2ac)`  
   `ratio = max(0, (cosA/sinA) / (cosB/sinB)) × .5`

   There is no upper clamp in the source. An obtuse geometry drives the ratio to zero, so only A contributes.
5. Mix every corresponding A/B scale step by that ratio. ColorJS `Color.mix` defaults to **CIE Lab interpolation**, after which the engine converts the mixed steps to OKLCH.

This resembles T15 Candidate B only at a high level: both borrow role shapes from nearby families. Radix proximity is full OKLab distance to any step, not angular adjacency to one of three step-9 hue anchors.

### 2. Source hue and chroma remapping

Find the step of the premixed scale closest to `S` by `deltaEOK`; call it `base`. Compute `ratioC = Csource / Cbase`. For every scale step:

- `Cnew = min(1.5 × Csource, Cold × ratioC)`;
- `Hnew = Hsource`.

Hue is therefore locked across the generated scale. The reference blend contributes lightness and a relative chroma envelope, but not its final per-step hue drift. The `1.5 × Csource` ceiling prevents a reference step from becoming more than 150% of the input chroma.

### 3. Background-driven lightness

Only the background's OKLCH **L** changes the solid accent and gray scales. Background hue/chroma matter later when reconstructing alpha colours and surfaces.

The helper `transposeProgressionStart(to, arr, curve)` returns, at index `i`:

`arr[i] − (arr[0] − to) × cubicBezier(curve, 1 − i/(N−1))`.

For a light reference (`scale[0].L > .5`), prepend `1` to its 12 L values, transpose that 13-point sequence toward clamped `background.L` with cubic Bézier control points `[0,2,0,2]`, then remove the prepended point. A white canvas makes the difference zero and leaves reference L unchanged; a darker canvas moves early steps most and step 12 not at all.

For dark, transpose the 12 reference L values directly with `[1,0,1,0]`. If the clamped canvas L is lighter than reference step 1, compute `ratioL = backgroundL/referenceStep1L` and fade every easing control toward zero with `max(0, ease × (1 − 3(ratioL−1)))`; a zero-control curve behaves linearly here. The transposition itself uses the canvas's un-clamped L. Again, step 1 moves to the canvas and the effect decays to zero at step 12.

Light and dark are separate reference sets and separate calls. There is no mirrored curve and no T15-style mapping from a light neutral seed to a dark neutral seed.

### 4. Step 9, hover 10, text 11–12

After scale construction:

- Compare the input accent with generated step 1. If `deltaEOK × 100 < 25`—equivalently normalized ΔEOK `< .25`—the input is considered too close to the canvas and generated step 9 is retained. Otherwise step 9 becomes the exact input colour. The very-dark stress case triggers this fallback in the dark call.
- The contrast colour is calculated from whichever step 9 survived that test.
- Step 10 is synthesized from step 9. If `L > .4`, `L10 = L − .03/(L+.1)` and a provisional `C10 = .93C`; otherwise `L10 = L + .03/(L+.1)` and provisional C is unchanged. The nearest colour in the current scale to this provisional hover donates its actual C and H. This rule is appearance-independent.
- For steps 11 and 12, cap C at `max(C9,C8)`. The cap can reduce text saturation but never increase it.
- If the input accent serializes to pure `#000` or `#fff`, clone the generated gray scale as the accent scale before the step-9/10 rewrites, preserving the gray tint.

### 5. Contrast colour

The engine compares white against step 9 using ColorJS's APCA 0.0.98G implementation. If absolute APCA contrast is below `40`, it returns a hue-tinted dark colour `oklch(.25, max(.08 × Csolid, .04), Hsolid)`; otherwise it returns white. It does not compare white with `#111`, does not use WCAG 2 contrast, and does not require `4.5:1`.

This is why the source policy and T15 gate disagree for several mid-lightness solids. Adopting the engine's contrast token would adopt this APCA threshold as policy; using its scale while retaining the WCAG gate would be a hybrid.

### 6. sRGB, wide gamut, alpha, surface, and background outputs

- Solid accent and gray scales serialize through ColorJS to sRGB hex. ColorJS 0.5.2 serialization uses its CSS gamut-mapping default: OKLCH chroma search with a `.02` ΔEOK JND and clipping when already within that JND. This is not T15's maximum-in-gamut fixed-L/H binary search, and the engine does not return per-step loss diagnostics.
- `accentScaleWideGamut` and `grayScaleWideGamut` are OKLCH strings from the working colours. Alpha wide-gamut outputs are display-P3 strings.
- Alpha colours solve `target = background × (1−alpha) + foreground × alpha` against either all-black or all-white RGB, choose/ceil a sufficient alpha, solve rounded channels, and correct one-unit compositing errors. The same method runs in sRGB and P3.
- Accent surface is step 2 reconstructed over the canvas at fixed alpha `.8` in light and `.5` in dark. Gray surface is a fixed white 80% in light and black 5% in dark.
- `background` is the supplied canvas serialized to sRGB.

For this first adoption comparison, ΔE tables use the sRGB solid accent/gray scales. The specimen also shows contrast, surface, and canvas effects. Alpha and wide-gamut arrays are preserved in the exact engine result but are not assigned wizard semantics here.

## Where T15 converged, and where it guessed wrong

| T15 observation | Source-code answer |
|---|---|
| Light and dark need separate role shapes. | Confirmed. Radix uses separate light/dark P3 reference families and different background easing. |
| Step 9 is a special seed anchor and step 10 is special. | Confirmed with a qualification: step 9 is exact only when not within `.25` ΔEOK of generated step 1; step 10 is an explicit hover formula. |
| Chroma is a source-scaled envelope. | Confirmed in form: a blended reference envelope is multiplied by `Csource/Cbase` and capped at `1.5Csource`. |
| Hue-neighbour profiles may explain family shape. | Directionally close, mechanically wrong. Radix selects up to two references by full ΔEOK to any step, not by step-9 hue, and mixes them in CIE Lab. |
| Source hue drift should be fitted or optionally copied. | Wrong for this engine. Radix overwrites every generated step with the input hue. Published-family drift helped describe the dataset, not the custom generator. |
| Absolute fitted lightness tables express the generator. | Incomplete. Radix inherits L from selected reference scales and only transposes it in response to the canvas. |
| Slate/Sand can be one neutral curve plus tint. | Too compact for source parity. Radix chooses/blends among six neutral reference families and accepts independent light/dark gray inputs. |
| A `#fff`/`#111` WCAG gate describes on-solid. | Not Radix policy. Radix uses an APCA-40 white-or-tinted-dark rule. |
| Explicit fixed-L/H sRGB chroma reduction describes gamut handling. | Not source behavior. Radix keeps wide-gamut forms and delegates sRGB serialization to ColorJS's CSS gamut map. |

The honest summary is that Candidate B stumbled onto the *reference-shape interpolation idea* but not its geometry, reference breadth, colour space, hue policy, canvas input, or post-processing.

## Three-way regeneration accuracy

Notation in each cell is `light mean/max · dark mean/max`, using T15's unscaled Euclidean OKLab ΔE. Candidate A is shared tables with hue locked. Candidate B is hue-neighbour tables with fitted drift. Radix uses the family-specific inputs stated above.

| Family | Set | Candidate A | Candidate B | Radix algorithm |
|---|---|---:|---:|---:|
| Slate | fitted | .00168/.00587 · .00334/.00646 | .00000/.00000 · .00081/.00178 | .00143/.00481 · .00103/.00356 |
| Sand | fitted | .00083/.00187 · .00168/.00368 | .00000/.00000 · .00000/.00000 | .00108/.00267 · .00085/.00352 |
| Blue | fitted | .00984/.02404 · .01650/.03749 | .00000/.00000 · .00000/.00000 | .00912/.02363 · .01070/.07971 |
| Red | fitted | .01100/.02450 · .01278/.01997 | .00355/.01507 · .00460/.00855 | .00593/.01462 · .01573/.08092 |
| Amber | fitted | .03475/.07228 · .02253/.08364 | .00000/.00000 · .00000/.00000 | .01704/.03833 · .01689/.07338 |
| Tomato | fitted | .00862/.01920 · .01063/.02171 | .00426/.01295 · .00561/.01028 | .00309/.01780 · .01159/.08068 |
| Green | held-out | .01129/.03745 · .01968/.06460 | .01996/.03905 · .01858/.06084 | .00424/.02145 · .01204/.07578 |
| Violet | held-out | .01320/.05395 · .01344/.02531 | .01564/.05009 · .01317/.02442 | .00618/.02444 · .01485/.10132 |
| Cyan | held-out | .01243/.03536 · .01668/.02864 | .01127/.02993 · .00992/.03047 | .00919/.01901 · .01017/.07482 |
| Yellow | held-out | .03477/.06639 · .02542/.10544 | .01721/.03657 · .01396/.05026 | .01636/.05000 · .01582/.08868 |

Aggregate all-family results keep mean and max separate:

| Set | Branch | Light mean/max | Dark mean/max | Combined mean/max |
|---|---|---:|---:|---:|
| Fitted six | A | .01112/.07228 | .01124/.08364 | .01118/.08364 |
| Fitted six | B | .00130/.01507 | .00184/.01028 | .00157/.01507 |
| Fitted six | Radix | .00628/.03833 | .00946/.08092 | .00787/.08092 |
| Held-out four | A | .01792/.06639 | .01880/.10544 | .01836/.10544 |
| Held-out four | B | .01602/.05009 | .01391/.06084 | .01497/.06084 |
| Held-out four | Radix | .00899/.05000 | .01322/.10132 | .01111/.10132 |

Radix has the best held-out **mean** in this test, but not the best held-out **maximum**: Violet dark 10 reaches `.10132`, while Candidate B's held-out maximum is `.06084`. Candidate B's fitted advantage is construction-level overfit—Blue, Amber, and Sand are exact anchors. No row licenses a choice; the specimen keeps all 24 per-step deltas visible.

## The same five stress seeds

Only Yellow has a published target and therefore a meaningful regeneration ΔE above. The other four rows report edge behavior rather than inventing an accuracy number.

| Case | Candidate A | Candidate B | Radix algorithm |
|---|---|---|---|
| Yellow `#ffe629` | 10/24 clamps, worst 31%; L10 `#f4db00`, D10 `#ffea5a` | 10/24, worst 23%; L10 `#fcdb00`, D10 `#f2f400` | No loss diagnostic; L9 `#ffe62a`, L10 `#f3dd45`, D10 `#f1dd4e`; family max `.08868` |
| sRGB-edge green `#00ff66` | 10/24, worst 30% | 11/24, worst 32% | sRGB serializes step 9 as short `#0f6`; returns separate wide-gamut output; no warning |
| `oklch(.72 .34 150)` | 14/24, worst 51%; mapped step 9 `#00c55b` | 18/24, worst 49%; mapped step 9 `#00c55b` | sRGB step 9 `#00c94b` through ColorJS CSS mapping; wide-gamut OKLCH retained |
| Desaturated `#777b84` | No clamps; computed on-solid fails at 4.45; warns | Same gate failure; no clamps; warns | Same 4.45 computed-gate failure; no input warning; both scheme step 10s darken |
| Very dark `#351b48` | Preserves step 9 in both schemes; warns | Preserves step 9 in both schemes; warns | Light step 9 stays `#351b48`, but dark triggers the near-background fallback and substitutes `#865ba8`; no warning |

The Radix engine does not expose T15-style seed diagnostics or a chroma-loss cutoff. That is not necessarily a defect—it returns richer output spaces—but it means a wizard adopting it must either accept silent mapping/fallback behavior or add a policy layer.

## Radix contrast token versus the local WCAG gate

The comparison below uses the generated Radix solid. “Computed” means choose the higher-contrast of `#fff` and `#111` and require `4.5:1`, exactly as in T15. Ratios show light/dark; most solids are identical across schemes.

| Family | Radix token · WCAG ratio L/D | Computed choice · ratio L/D | Polarity agreement |
|---|---:|---:|---|
| Blue | `#fff` · 3.26/3.26 **fail** | `#111` · 5.78/5.78 | No |
| Red | `#fff` · 3.91/3.91 **fail** | `#111` · 4.82/4.82 | No |
| Amber | `#2b2009` · 10.46/10.13 | `#111` · 12.36/11.96 | Yes |
| Tomato | `#fff` · 3.87/3.87 **fail** | `#111` · 4.88/4.88 | No |
| Green | `#fff` · 3.16/3.16 **fail** | `#111` · 5.98/5.98 | No |
| Violet | `#fff` · 5.39/5.39 | `#fff` · 5.39/5.39 | Yes |
| Cyan | `#fff` · 3.00/3.00 **fail** | `#111` · 6.29/6.29 | No |
| Yellow | `#262209` · 12.63/12.62 | `#111` · 14.93/14.93 | Yes |

The policies agree in polarity for 3/8 validation accents. Radix's returned contrast token fails WCAG `4.5:1` for 5/8; this does not mean its APCA rule failed its own threshold. It means the two policies answer different questions and cannot be treated as interchangeable.

Keeping the local semantic selector on Radix output gives these all-pass readouts:

| Family | Computed on-solid | Link step · min | Focus step · min |
|---|---:|---:|---:|
| Blue | `#111` · 5.78 | 12 · 11.95 | 9 · 3.18 |
| Red | `#111` · 4.82 | 11 · 4.97 | 9 · 3.82 |
| Amber | `#111` · 11.96 | 12 · 10.57 | 11 · 4.42 |
| Tomato | `#111` · 4.88 | 11 · 4.73 | 9 · 3.80 |
| Green | `#111` · 5.98 | 11 · 4.71 | 9 · 3.08 |
| Violet | `#fff` · 5.39 | 11 · 5.88 | 9 · 3.50 |
| Cyan | `#111` · 6.29 | 12 · 11.34 | 10 · 3.42 |
| Yellow | `#111` · 14.93 | 12 · 10.40 | 11 · 4.26 |

That table is explicitly a hybrid result: Radix generates colours; T15 selects semantic steps and foreground polarity.

## Canvas as a capability T15 does not model

These Blue/Slate runs hold accent and gray inputs fixed. Mean shift is ΔE from the reference-canvas generated scale, averaged over 12 steps. Solid-scale movement comes from canvas L only; canvas hue/chroma influence the composited alpha/surface outputs and the actual page colour, not the solid scale's H/C remap.

| Canvas pair | Step 1 L/D | Accent surface L/D | Mean solid-scale shift L/D |
|---|---|---|---:|
| `#fff` / `#111113` | `#fbfdff` / `#09121c` | `#f1f9ffcc` / `#0c213980` | .00000 / .00000 |
| warm `#fff5e8` / `#1d1610` | `#f2f4f6` / `#0f1823` | `#e6eff9cc` / `#04224080` | .02652 / .00412 |
| cool `#eaf4ff` / `#0b1825` | `#eef0f2` / `#0e1822` | `#e5e9eecc` / `#151e2b80` | .03882 / .00361 |

T15 A/B always generate the same solids for a seed; they can only place those solids on a different page later. Radix lets the page canvas participate in scale construction and alpha reconstruction. Whether the wizard should expose one canvas, independent appearance canvases, or only preset canvases is a new product-input decision.

## Cost of adoption

| Dimension | Vendored Radix engine | T15 compact fitted rule | Hybrid |
|---|---|---|---|
| Checked-in runtime in this study | 255,107-byte unminified offline bundle + 6,948-byte adapter. Readable vendored provenance is 316 KB. | `palette-engine.mjs` is 20,950 bytes including ten-family validation data; a production-only extraction would be smaller. | At least the Radix bundle plus whichever T15 warnings/gates are retained. |
| Inputs | Separate appearance, accent, gray, background per call; current page can use six independent values across light/dark. | One light step-9 seed, kind flag, neutral tint H/C, optional drift. | Must declare which input model is authoritative. |
| Outputs | Accent/gray solids, sRGB alpha, OKLCH/P3 wide gamut, contrast, accent/gray surfaces, background. | 24 sRGB solids, clamp diagnostics, warnings, computed semantic choices. | Rich Radix colour outputs plus selected local diagnostics/semantics. |
| Edge behavior | Broad 29-scale references, near-background step-9 fallback, ColorJS CSS gamut mapping, no seed warnings. | Deterministic tables, explicit max-chroma mapping/loss, warnings; weaker held-out mean. | Can combine breadth with warnings, but behavior is no longer upstream-identical. |
| Maintenance | Internal website source, not a published generator API. Pinning protects reproducibility but requires attribution, dependency audits, and deliberate upstream refreshes. | Small local maths and tables, easy to inspect; ownership and evidence burden remain local. | Largest test matrix: upstream drift plus local overlay compatibility. |
| Source parity | Exact for the pinned custom generator. It still does not reproduce published families exactly. | Empirical approximation of published sRGB family outputs, not source parity. | Must define “parity” per output; easy to make an ambiguous promise. |

**Opinion, not a decision:** the bundle-size difference is unlikely to matter inside a build-time wizard, but auditability and policy coupling do. Radix carries a mature reference set and richer outputs; T15 carries explicit failure diagnostics and a transparent WCAG gate in a much smaller rule. A hybrid is attractive specifically around diagnostics/contrast, but it should be named as a forked policy rather than “the Radix algorithm.”

## Reframed decisions for the user

Adopting an engine can answer mechanical questions authoritatively *for that branch*; it cannot turn product policy into a source-code fact.

1. **Master decision — source engine, compact rule, or hybrid.**
   - Adopt vendored Radix: best held-out mean here, broad reference set, canvas/alpha/wide-gamut outputs, exact pinned custom-generator behavior; accepts a larger dependency surface, upstream drift process, `.10132` held-out max, near-canvas fallback, and APCA contrast policy if truly wholesale.
   - Keep compact fitted rule: smallest and most inspectable; retains explicit warnings/loss and current WCAG gates; accepts weaker held-out mean and empirical rather than source authority.
   - Hybrid: likely variants are Radix scale + local warnings/WCAG gates, or compact scale + a separately validated canvas transform. It offers policy control but inherits the largest validation and naming burden.
2. **Old decision 1, A versus B:** subordinate if Radix is adopted. If the compact path remains, the A/B evidence and Green/Yellow tradeoff remain unchanged. A hybrid must name which compact components, if any, survive.
3. **Old decision 2, acceptable ΔE:** moot for claiming parity with the pinned custom generator when adopting it wholesale—the code is the authority. It remains relevant for “reproduces published Radix families,” for compact/hybrid acceptance, and for deciding whether Radix's `.10132` held-out max is visually acceptable on this specimen.
4. **Old decision 3, hue drift:** answered by wholesale Radix adoption: final generated hue is locked to the input. Keep/remove fitted drift remains open only on the compact branch. A hybrid that reintroduces drift is intentionally no longer source-identical.
5. **Old decision 4, neutral tint model:** answered mechanically by wholesale Radix adoption: separate gray input per appearance, selected/blended across six gray references. The wizard still must decide whether to expose both gray inputs, derive them, or constrain them to named presets.
6. **Old decision 5, on-solid:** Radix supplies an authoritative APCA-40 white/tinted-dark token only if that policy is adopted. The 5/8 WCAG failures make “wholesale including contrast” versus “Radix scale + local WCAG gate” an explicit branch, not an implementation detail.
7. **Old decision 6, variable semantic indices:** remains open. Radix outputs colour roles but does not choose this product's link and focus indices. The local gate still varies links across 11/12 and focus across 9/10/11.
8. **Old decision 7, implausible seeds:** remains open. Radix silently substitutes generated step 9 when the seed is near the canvas; it does not provide a wizard correction/refusal UX. The dark stress result shows why the fallback must be disclosed if used.
9. **Old decision 8, sRGB loss cutoff:** wholesale Radix adoption makes T15's specific binary-search loss percentage inapplicable, because ColorJS uses a different CSS gamut map and wide-gamut outputs are retained. Whether to warn, refuse, or require sRGB parity remains a product-support decision.
10. **New input decision — canvas and per-appearance independence:** decide whether users choose light/dark accent, gray, and background independently as the upstream page permits, or whether the wizard derives some values to preserve a simpler one-seed promise.

No branch is selected here. Under the repository's curation rule, these measurements, controls, and opinion-labelled tradeoffs are the decision surface; adoption belongs to the user.

## Verification

- Static/offline runtime: one HTML file plus local ES modules and vendored sources; no runtime network imports.
- Port 8052, own in-app browser tab: all three branches exercised; six fitted plus four held-out cards; five stress seeds; three background demos; light/dark gray and canvas controls; surface and contrast-token readouts.
- Candidate A spot assertions after the extension: Blue live step 1 `#fbfdff`, step 9 `#0090ff`, dark step 12 `#cde4ff`; Candidate B with drift: Blue mean/max `0.0000/0.0000` and dark step 12 `#c2e6ff`, matching T15.
- Radix Blue live call: step 1 `#fbfdff`, step 9 `#0090ff`, dark step 10 `#0083f1`; computed on-solid `#111` at `5.78:1`; Radix contrast `#fff` at `3.26:1`.
- Branch switcher, family presets, gray/canvas controls, and “load in generator” canvas actions exercised with zero console warnings/errors.
- Mobile breakpoint at 390×844: controls, live schemes, failure cards, and canvas cards collapse to one column; body client/scroll width both 390 px.
- No commits made; local server and own tab closed after verification.
