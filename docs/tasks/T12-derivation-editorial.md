# T12 — Derivation experiment: warm editorial

> **Working directory: `/Users/darioaschero/Documents/dev/DS-Starter-editorial` (git worktree, branch `derivation/editorial`).**
> Run `pwd` first. If you find yourself in `.../DS-Starter` (the main checkout), STOP — a parallel derivation runs in another worktree, and editing the wrong tree ruins both experiments.

## What this is

Milestone 3 tests DS-Starter's actual thesis: that it is a **starter** — that a differently-branded design system can be derived from it by touching only the token surface. This task derives a **warm editorial** identity and measures exactly what that costs. The measurements are the deliverable; the derived system is the evidence.

This is the **advertised easy path on purpose**: the palette change is a pure Radix family swap — exactly the "swap 24 values in one file" promise the colour architecture was sold on. A sibling task (T11) tests the hard path (non-Radix values); your findings will be compared. If the easy path is NOT easy, that is a first-order finding.

## Read first

1. `docs/conventions.md` (v4) — the architecture you must NOT change.
2. `docs/findings/color-architecture.md` (how the base palette was built; the contrast numbers you will re-measure).
3. `ds/tokens/*.css` — the five files that ARE your working surface.

## The derivation contract (the experiment's rules)

**You may edit ONLY:** `ds/tokens/palette.css`, `ds/tokens/semantic.css`, `ds/tokens/roles.css`, `ds/tokens/scale.css`, `ds/tokens/recipes.css`, plus your findings note `docs/findings/derivation-editorial.md` (from `TEMPLATE.md`).

**Frozen — and every temptation to touch them is itself a finding:** all `ds/components/*.css`, `ds/reset.css`, `ds/index.css`, every fixture, `docs/conventions.md`, `CLAUDE.md`, briefs, other findings. The fixtures must render the new identity **without a single edit** — that is part of the test.

**Leak protocol.** If the derivation seems to require a component/reset/fixture edit: stop, record in findings the exact edit you would need and why (a measured leak is the most valuable single datum this task can produce), then continue without it if the result merely looks off. Apply the minimal edit ONLY if rendering actually breaks, flagged prominently as `LEAK` in the findings.

**Structure vs content.** Preserve the architecture: `--ds-<family>-light|dark-1..12` naming, 12 steps per scheme, the Radix step-role convention, active steps as the single `light-dark()` site, purpose-named semantics, recipes referencing semantics. Values are yours to change (this derivation stays inside Radix's published sets, so fetch them verbatim as the base system did — attribution comment updated).

**No commits. No git branching commands** — you are already on the right branch in the right worktree; the coordinator handles all git.

## The identity to derive

Warm, literary, unhurried — a system for long-form editorial products:

- **Palette (pure Radix family swap)**: neutral ← Radix **Sand** (+ Sand Dark), accent ← Radix **Amber** or **Orange** (your call — pick the one whose step 9 works best as a solid with readable on-solid text, and document the choice), danger ← Radix **Tomato** (+ dark sets). Fetch official values verbatim from `@radix-ui/colors` (same sourcing as the base: unpkg or GitHub; stop and report if the network is unavailable — never invent).
- `--ds-accent-on-solid`: **recompute** — Radix prescribes DARK text over Amber 9 (unlike Blue 9's white). This is a deliberate trap of the identity choice: verify what the chosen accent's step 9 needs, set it accordingly, and measure the contrast. If it silently stayed white, solid buttons would fail — catching this is part of the experiment.
- **Typography**: serif voice. Add `--ds-font-serif` to `scale.css` (system stack, no font files — e.g. 'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, serif — your tuning). Headings (`--ds-type-heading-*`) go serif with editorial weights; body: your judgment (serif body is more radical, sans body more pragmatic — decide, document why). Line-heights relax (body toward 1.6); label roles may stay sans for controls (buttons/fields with serif labels is a legitimate deliberate choice too — decide and document).
- **Geometry & rhythm**: softer, friendlier radius language (bump the radius scale values); spacing scale may breathe slightly if the identity asks for it — every scale change is a knob to record.
- **Recipes**: rebind `solid`/`soft`/`outline` onto the new semantic values so buttons and fields wear the warm skin.

## Verification battery (required, both schemes)

- Serve the worktree root on port **8046**, own browser tab, kill/close when done.
- **Cache warning:** the pane caches imported CSS. Before any assertion: `await Promise.all(urls.map(u => fetch(u, {cache:'reload'})))` over `/ds/index.css` + all token + component files, then reload. Never trust pre-refresh numbers.
- Re-run the **full composition battery** (`fixtures/composition.html` — every M1+M2 probe: discriminated composition, wrapped part, colliding parts, nested overrides, embedded rhythm, composed `:user-invalid`, focus walk) and all `consumer-override.html` cases, light AND dark. Same expected outcomes, new values — the architecture must prove value-independent.
- Contrast duty: primary text on canvas/subtle/component, link on canvas/subtle, **accent-on-solid on the new solid** (the trap above), focus ring visibility on the warm canvas — measure and record all, both schemes.
- Visual pass: screenshot `fixtures/index.html` and `composition.html` in both schemes — does it *read* editorial? Serif headings inside rich text, cards, buttons: note where the identity lands and where the token surface could not carry it.
- Greps: `light-dark()` only in palette.css; zero `!important`; structure naming intact; zero component references to primitives/active steps.

## `docs/findings/derivation-editorial.md` — required content (the actual deliverable)

1. **The cost table**: files touched with line counts (`git diff --stat` vs HEAD), wall-clock time, and the split between mechanical work and judgment calls. Specifically: was the palette REALLY a 24-values-per-family swap, end to end?
2. **Leaks and temptations**: every point where the token surface was not enough — actual `LEAK`s AND resisted temptations. "None" is a legitimate and important answer.
3. **The on-solid trap**: what the chosen accent's step 9 required, how you caught it, and whether the semantic layer made the fix a one-line change (that is the claim being tested).
4. **Fidelity self-assessment**: does the result read warm/editorial? Screenshots; what the token surface fundamentally could NOT express (e.g. if true editorial feel wanted different heading margins — that lives in rich-text.css: a leak worth recording, not fixing).
5. **Battery verdict**: all checks re-run — held/failed per §18 group, both schemes, plus the contrast table.
6. **Parameter surface**: the ordered list of knobs you actually turned (this feeds the wizard questionnaire) — and for each, whether a wizard could turn it mechanically from a simple answer or it needed design judgment.
7. **Easy-path verdict**: was this derivation proportionate to the promise? Where did it exceed "swap families, retune four roles, soften three radii"?

## Done means

Identity derived within the contract · full battery green in both schemes (or failures documented as findings, never silently) · findings note complete with all seven sections · nothing committed · closing report (cost table first, then the on-solid trap outcome, then fidelity verdict).
