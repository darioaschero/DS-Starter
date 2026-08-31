# Findings — T12 warm editorial derivation

> Task: derive a warm editorial identity through the token surface only, then measure the cost, leaks, fidelity, and value-independence of the full M1+M2 system.
> Date: 2026-08-31
> Files touched: `ds/tokens/palette.css`, `ds/tokens/semantic.css`, `ds/tokens/scale.css`, `ds/tokens/roles.css`, `docs/findings/derivation-editorial.md`

## 1. Cost table

| File | Lines vs HEAD | Work |
|---|---:|---|
| `ds/tokens/palette.css` | +75 / −75 | Mechanical family substitution: 24 Sand, 24 Amber, and 24 Tomato values; family/source comments updated. The 36 active steps did not change. |
| `ds/tokens/semantic.css` | +7 / −5 | Four measured role decisions: link, focus, accent text, and on-solid. |
| `ds/tokens/scale.css` | +4 / −3 | Added the serif stack and softened the three finite radii. Spacing and type-size scales stayed intact. |
| `ds/tokens/roles.css` | +4 / −4 | Serif body/headings and relaxed line heights; label roles deliberately stayed sans. |
| `ds/tokens/recipes.css` | 0 / 0 | No edit needed: its semantic bindings carried the new values as designed. |
| `docs/findings/derivation-editorial.md` | +115 / −0 | Experimental record. |

Wall-clock time was approximately **40 minutes**: about 10 minutes of mechanical palette sourcing/substitution, 10 minutes of design judgment (accent, type voice, radii, and semantic role selection), and 20 minutes of two-scheme verification, screenshots, contrast correction, and reporting.

The palette promise was real. Each family was exactly a 24-value substitution in `palette.css`; the 36 active declarations, every component, and every recipe remained structurally untouched. The full identity cost more than palette substitution because typography, radius language, and four semantic colour roles are identity decisions, but none required architecture work.

Official `@radix-ui/colors` 3.0.0 sRGB sources were copied verbatim: [Sand](https://app.unpkg.com/%40radix-ui/colors%403.0.0/files/sand.css), [Sand Dark](https://app.unpkg.com/%40radix-ui/colors%403.0.0/files/sand-dark.css), [Amber](https://app.unpkg.com/%40radix-ui/colors%403.0.0/files/amber.css), [Amber Dark](https://app.unpkg.com/%40radix-ui/colors%403.0.0/files/amber-dark.css), [Tomato](https://app.unpkg.com/%40radix-ui/colors%403.0.0/files/tomato.css), and [Tomato Dark](https://app.unpkg.com/%40radix-ui/colors%403.0.0/files/tomato-dark.css). The attribution header remains versioned at 3.0.0.

## 2. Leaks and temptations

No component, reset, index, or fixture edit was required for rendering or behavior. There were **zero actual `LEAK`s**.

Resisted temptations:

- `fixtures/index.html` has content labels “Neutral · Radix Slate,” “Accent · Radix Blue,” and “Danger · Radix Red.” The swatches correctly render Sand/Amber/Tomato, but their frozen labels are now false. The exact desirable edit is a content-only replacement of those three headings; it was not made because fixtures are frozen.
- `fixtures/composition.html` contains explanatory copy such as “body-md (400 / 1.5).” The computed role is now 400 / 1.65 (26.4px at the 16px base), so that frozen verification prose is stale. Updating the prose would improve the specimen without affecting its assertions, but would still breach the derivation contract.
- A more overtly editorial product would likely narrow the rich-text measure, increase heading-to-body rhythm, and tune link underline metrics. Those controls live in fixture frame CSS and `ds/components/rich-text.css`, not the present token surface. They remained unchanged; this is a genuine fidelity boundary, not a rendering failure.
- Compact field/button geometry still reads as product UI. Changing the global spacing scale would have made prose and application layout breathe together but could not independently retune control density, so the spacing scale stayed unchanged rather than using a blunt global lever.

Verification plumbing had two non-design deviations. Port 8046 was already occupied by a Python server rooted in `/Users/darioaschero/Documents/dev/LGC`; it was not terminated without authorization, so the editorial root used isolated port 8047. The in-app browser's read-only evaluation surface did not expose `fetch`, so the exact `fetch(..., {cache: "reload"})` snippet could not run. The final post-edit pass instead used the fresh origin `127.0.0.1:8047` (never previously loaded by the pane), which guarantees a cold import graph; the wrappers themselves ran on 8048 and never modified fixture DOM or repository files.

## 3. The on-solid trap

Amber was chosen over Orange. It is the quieter, more literary accent, and its prescribed dark foreground gives substantially better WCAG contrast on step 9: **10.33:1** for `#21201c` on Amber 9 (`#ffc53d`). Orange 9 with its prescribed white foreground measured only **2.97:1**; Amber with white would be worse at **1.58:1**.

The old literal `white` therefore could not survive. `--ds-accent-on-solid` changed to literal `#21201c`, with a Radix-specific comment. The fix was exactly one semantic declaration, and both the shared solid recipe and every solid button inherited it. This validates the semantic layer's claim: the trap was high-impact but one-line to correct.

## 4. Fidelity self-assessment

The result reads **warm/editorial, with a deliberate product-UI undertone**. The largest identity carriers are serif body and heading roles, 1.65 body leading, the Sand canvas/surfaces, Amber actions, and the 6/12/20px finite radii. Light mode feels paper-like and unhurried; dark mode remains restrained rather than becoming sepia-heavy. Sans labels preserve control legibility and keep fields/buttons recognizably interactive.

Temporary QA screenshots were kept outside the worktree to preserve the six-file edit contract:

- `/private/tmp/ds-editorial-preview/index-light-final-crop.png`
- `/private/tmp/ds-editorial-preview/index-dark-final-crop.png`
- `/private/tmp/ds-editorial-preview/composition-light-final-crop.png`
- `/private/tmp/ds-editorial-preview/composition-dark-final-crop.png`

The token surface could not express editorial content measure, heading margins, link decoration character, or a separate prose-vs-control density system. Those limitations prevent a full publication identity, but they do not prevent a convincing warm editorial skin.

## 5. Battery verdict

| §18 group | Light | Dark | Evidence |
|---|---|---|---|
| Full six-component composition | held | held | 64 computed assertions per scheme after normalizing the browser's full `system-ui, sans-serif` serialization. |
| Card parts, wrapped part, colliding part | held | held | Direct title 600/19px; wrapped title remained UA 700 and size-distinct; colliding title remained the button's 500/15px. |
| Rich-text scope and discriminators | held | held | Label-md prose stayed sans 500/19.2px; card/field body stayed serif 400/26.4px; nested rich override inheritance held. |
| Context overrides and channel independence | held | held | Outer/nested card override pair matched Amber 3; control pair stayed Sand 2; button/field channels did not collide. |
| Embedded rhythm and stack layout | held | held | Direct embedded cards 16px, nested negative 0px, following heading 32px; stack lg 32px and card gap 12px. |
| Native disclosure state | held | held | Settled real clicks produced open 600/1px → closed 500/0px → open 600/1px. |
| Native `:user-invalid` + focus precedence | held | held | Tomato 8 border, visible error, and relocated 2px solid Amber 11 ring all held while invalid and focused. |
| Focus walk | 20/20 | 20/20 | Every link/input/button/summary matched `:focus-visible`; inputs showed the same ring on their control frame. |
| Consumer override fixture | held | held | All five cases passed; the final role-affected rerun passed 14/14 style assertions per scheme. |
| Console and static checks | held | held | Zero browser warnings/errors; static results below. |

Contrast ratios, measured from browser-computed sRGB values:

| Pair | Light | Dark | Verdict |
|---|---:|---:|---|
| primary / canvas | 16.02:1 | 16.26:1 | pass |
| primary / subtle | 15.48:1 | 15.14:1 | pass |
| primary / component | 14.32:1 | 13.71:1 | pass |
| link / canvas | 11.17:1 | 15.59:1 | pass |
| link / subtle | 10.79:1 | 14.52:1 | pass |
| accent-on-solid / solid | 10.33:1 | 10.33:1 | pass |
| focus ring / canvas | 4.53:1 | 12.34:1 | visible |

The first contrast pass caught Amber 11 at 4.53:1 on Sand canvas but only 4.38:1 on Sand subtle. Link and accent-text roles moved to Amber 12, producing the final headroom above. Focus remains Amber 11 because its required canvas pairing already clears 3:1 comfortably.

Static battery: 72 primitive declarations and 36 active declarations; `light-dark()` only in `palette.css`; zero `!important`; 12 light + 12 dark declarations for each family; zero component references to primitives or active steps; recipes reference semantics only; `git diff --check` clean. No fixture, component, reset, or index file changed.

## 6. Parameter surface

Ordered by dependency, the knobs actually turned were:

1. **Neutral family → Sand** — mechanical from a simple warm-neutral answer; 24 verbatim values.
2. **Accent family → Amber** — design judgment (tone plus on-solid contrast), then mechanical substitution; 24 values.
3. **Danger family → Tomato** — mechanical from the requested semantic family; 24 values.
4. **On-solid foreground → `#21201c`** — mechanical once Amber was chosen and Radix guidance/contrast were checked.
5. **Link role → accent 12** — measured design judgment; step 11 missed the light subtle-surface threshold.
6. **Focus role → accent 11** — measured design judgment; step 8 was visually too quiet on the light Sand canvas.
7. **Accent-text role → accent 12** — mechanical coordination with the accessible link/text decision.
8. **Serif stack** — design judgment among system-available editorial faces; no external font asset.
9. **Body role → serif at 1.65** — explicit editorial-intensity judgment; a wizard could offer “serif body vs serif headings only” and a density slider.
10. **Three heading roles → serif, 600, relaxed 1.35/1.3/1.25 leading** — design judgment that a wizard could seed but should preview visually.
11. **Finite radii → 0.375/0.75/1.25rem** — design judgment; a simple “softness” answer can mechanically choose a preset.

Labels intentionally remained sans, type sizes remained unchanged, spacing remained unchanged, and recipes remained unchanged. Those non-actions are important: the derivation did not need to churn every available knob.

## 7. Easy-path verdict

**Yes: the derivation was proportionate to the promise.** The core palette operation was literally “swap 24 values per family.” The active palette layer, recipe layer, all six components, reset, index, and fixtures were value-independent. The extra work was the legitimate identity surface: retune four semantic roles, add/choose a serif voice, relax four typography roles, and soften three radii.

The only cost materially beyond “swap families, retune four roles, soften three radii” was verification—and that cost found both important traps: white-on-Amber at 1.58:1 and Amber 11 links on Sand 2 at 4.38:1. That is evidence for keeping the derivation wizard preview- and contrast-driven, not evidence that the architecture is too expensive.

## Suggested convention changes

- Add a derivation-fixture labeling policy: family names and numeric role descriptions in fixture prose become stale by design when tokens change. Either generate those labels from custom properties in a future tool or explicitly classify fixture copy drift as expected derivation evidence.
- Add contrast gates for link on canvas + subtle and on-solid on solid to any future derivation wizard. Family substitution is mechanical; accessible semantic selection is not.
- Keep recipes semantic and unchanged by default. This experiment found no value in rebinding them merely to create diff churn.
