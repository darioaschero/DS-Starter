# T11 — Derivation experiment: LGC-like

> **Working directory: `/Users/darioaschero/Documents/dev/DS-Starter-lgc` (git worktree, branch `derivation/lgc`).**
> Run `pwd` first. If you find yourself in `.../DS-Starter` (the main checkout), STOP — a parallel derivation runs there in another worktree, and editing the wrong tree ruins both experiments.

## What this is

Milestone 3 tests DS-Starter's actual thesis: that it is a **starter** — that a differently-branded design system can be derived from it by touching only the token surface. This task derives a system with **LGC's visual identity** and measures exactly what that costs. The measurements are the deliverable; the derived system is the evidence.

This is the **hard path on purpose**: LGC's values are not Radix values, so you are testing whether non-Radix content can inhabit the Radix-shaped structure (12 steps × light/dark, step-role convention). A sibling task (T12) tests the easy path (pure Radix family swap) — your findings will be compared.

## Read first

1. `docs/conventions.md` (v4) — the architecture you must NOT change.
2. `docs/findings/color-theme-architecture.md` §3 (LGC as prior art — what its architecture does differently; you are borrowing its *look*, never its architecture).
3. **The LGC reference, read-only, outside this repo**: `/Users/darioaschero/Documents/dev/LGC/tokens/primitives.css`, `semantic.css`, `fonts.css`, `rich-text.css` (and skim the repo for any preview page to see the identity you are matching). Never edit anything under `/Users/darioaschero/Documents/dev/LGC`.
4. `ds/tokens/*.css` — the five files that ARE your working surface.

## The derivation contract (the experiment's rules)

**You may edit ONLY:** `ds/tokens/palette.css`, `ds/tokens/semantic.css`, `ds/tokens/roles.css`, `ds/tokens/scale.css`, `ds/tokens/recipes.css`, plus your findings note `docs/findings/derivation-lgc.md` (from `TEMPLATE.md`).

**Frozen — and every temptation to touch them is itself a finding:** all `ds/components/*.css`, `ds/reset.css`, `ds/index.css`, every fixture, `docs/conventions.md`, `CLAUDE.md`, briefs, other findings. The fixtures must render the new identity **without a single edit** — that is part of the test.

**Leak protocol.** If the derivation seems to require a component/reset/fixture edit: stop, record in findings the exact edit you would need and why (this is a measured leak — the most valuable single datum this task can produce), then continue without it if the result merely looks off. Apply the minimal edit ONLY if rendering actually breaks, flagged prominently as `LEAK` in the findings.

**Structure vs content.** Conventions §5a says primitives are "Radix values, verbatim" — that is a *content* rule for the base system, not architecture. A derivation replaces family values. What you must preserve is the **structure**: `--ds-<family>-light|dark-1..12` naming, 12 steps per scheme, the step-role convention (1 app bg … 6–8 borders … 9–10 solid … 11–12 text), active steps as the single `light-dark()` site, semantic purpose names, recipes referencing semantics. If preserving structure fights LGC's material, document the fight — it may mean conventions need an explicit structure/content split (T13 synthesis will decide).

**No commits. No git branching commands** — you are already on the right branch in the right worktree; the coordinator handles all git.

## The identity to derive

Match LGC's look as faithfully as the token surface allows:

- **Neutrals**: LGC's single neutral OKLCH ramp must become our paired light/dark ramps. This mapping is the core experiment — decide which LGC steps (or interpolations) serve each of the 24 slots so that the *step roles* hold in both schemes, and document the mapping table with reasoning. Hand-interpolating intermediate values is allowed (unlike the base system): note where LGC's ramp lacks the density our roles need.
- **Accent + danger**: LGC's accent colour (build the 12-step pair around it; LGC may define fewer steps — same interpolation licence) and a danger family that fits its temperature.
- **Typography**: LGC's type voice from `fonts.css` — family stacks, weights, the feel of its scale — expressed through our six font-only roles in `roles.css` (and `--ds-font-*` stacks in `scale.css`). No external font files (zero-build): use system-stack equivalents that read closest, and note the compromise.
- **Geometry & rhythm**: LGC's radius language and spacing feel via `scale.css`.
- **Recipes**: rebind `solid` / `soft` / `outline` so buttons and fields wear LGC's skin.
- `--ds-accent-on-solid`: recompute for LGC's accent (may not be white — check contrast on the new solid, both schemes).

## Verification battery (required, both schemes)

- Serve the worktree root on port **8045**, own browser tab, kill/close when done.
- **Cache warning:** the pane caches imported CSS. Before any assertion: `await Promise.all(urls.map(u => fetch(u, {cache:'reload'})))` over `/ds/index.css` + all token + component files, then reload. Never trust pre-refresh numbers.
- Re-run the **full composition battery** (`fixtures/composition.html` — every M1+M2 probe: discriminated composition, wrapped part, colliding parts, nested overrides, embedded rhythm, composed `:user-invalid`, focus walk) and all `consumer-override.html` cases, light AND dark. Same expected outcomes, new values — the architecture must prove value-independent.
- Contrast duty: primary text on canvas/subtle/component, link on canvas/subtle, accent-on-solid on solid — measure and record all, both schemes (the base system's numbers are in findings/color-architecture.md and m2-synthesis.md for comparison).
- Visual pass: screenshot `fixtures/index.html` (specimen page), `composition.html`, and side-by-side impressions against the real LGC preview if it has one.
- Greps: `light-dark()` only in palette.css; zero `!important`; structure naming intact; zero component references to primitives/active steps.

## `docs/findings/derivation-lgc.md` — required content (the actual deliverable)

1. **The cost table**: files touched with line counts (`git diff --stat` vs HEAD), wall-clock time spent, and the split between mechanical work and judgment calls.
2. **Leaks and temptations**: every point where the token surface was not enough — actual leaks (with the `LEAK` protocol above) AND resisted temptations. "None" is a legitimate and important answer.
3. **The step-mapping table**: LGC ramp → 24 slots, with reasoning; where the step-role convention fit naturally and where it was forced.
4. **Fidelity self-assessment**: honest judgment of how LGC-like the result reads, with screenshots; what the token surface fundamentally could NOT express about LGC's identity.
5. **Battery verdict**: all checks re-run — held/failed per §18 group, both schemes, plus the contrast table.
6. **Parameter surface**: the ordered list of knobs you actually turned (this feeds the wizard questionnaire) — and for each, whether a wizard could turn it mechanically from a simple answer or it needed design judgment.
7. **Structure/content friction**: whether conventions §5a (and anything else) needs a declared structure-vs-content split for derivations.

## Done means

Identity derived within the contract · full battery green in both schemes (or failures documented as findings, never silently) · findings note complete with all seven sections · nothing committed · closing report (cost table first, then leaks, then fidelity verdict).
