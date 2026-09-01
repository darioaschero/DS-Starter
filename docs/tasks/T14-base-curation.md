# T14 — Base-system curation

> **Working directory: `/Users/darioaschero/Documents/dev/DS-Starter` (main checkout, branch `main`).** Run `pwd` first.
> **Goal:** turn the base profile from "values that made the architecture testable" into "values chosen with intention" — using the gates, thresholds, and evidence the M3 derivations produced. This is deliberate review, not churn: **"no change, because …" is a first-class outcome** for every item, and every change needs the same one-line rationale a no-change does.

## Read first, completely, in this order

1. `docs/conventions.md` — **v5** (note the new §5a structure/content split and fixture-copy policy; §6 state-chain rules; §7 curated → recipe → derived)
2. `docs/findings/m3-synthesis.md` — §4 (constraint classes and the gate table with measured thresholds), §7 (decision rows M2-O1, M2-O4, M3-O4, M3-O7 are your work orders)
3. `docs/findings/color-architecture.md` — §3 (the ΔE table: derived solid states vs Radix curated steps — the evidence behind the curated-channel decision)
4. `docs/findings/button.md` (M1: why per-surface hover aliases were forbidden — the trap your recipe-state work must not reintroduce) and `docs/findings/field.md` (public-vs-state precedence)
5. `docs/deriving.md` (the gate matrix you will now apply to the base itself)
6. The files you will touch (below)

## Files you may create/edit — ONLY these

`ds/tokens/semantic.css` · `ds/tokens/recipes.css` · `ds/components/button.css` · `ds/tokens/scale.css` (only if a reviewed value actually changes) · `fixtures/index.html` and `fixtures/composition.html` (**copy retrofit only** — see §4; zero structural/assertion changes) · `docs/findings/curation.md` (from `TEMPLATE.md`).

Frozen: `ds/tokens/palette.css` (base values are Radix verbatim by v5 policy — curation chooses *steps*, never retunes values), `ds/tokens/roles.css` unless a §3 decision requires it, all other components, `ds/reset.css`, `ds/index.css`, other fixtures, `CLAUDE.md`, `docs/conventions.md`, `docs/deriving.md`, briefs, other findings. **No commits.**

## 1. Contrast audit + headroom policy (closes M2-O4 / M3-O4)

The M3 gate matrix has never been run against the base profile itself — do it first, both schemes, from browser-computed colours:

| Pair | Hard floor |
|---|---:|
| Primary text / canvas, subtle, component | 4.5:1 |
| Muted text / canvas, subtle | 4.5:1 |
| Link / canvas AND link / subtle | 4.5:1 |
| Accent-on-solid / solid | 4.5:1 |
| Focus indicator / canvas | 3:1 |

Known base facts to confront: link (Blue 11) / Sand-equivalent… on Slate subtle measured **4.53:1** in light — legally passing, zero headroom (it predicted T12's Amber failure at 4.38:1). Focus is Blue 8, chosen from Radix's designation, but the **3:1 non-text gate has never been measured against it on the light canvas** — T12 found step 8 visually too quiet on light and moved to 11.

Then decide and implement:

- **A headroom policy**: hard-fail below WCAG floors; a warning band below a chosen policy target (propose the target from the measurements — e.g. links ≥ 5.5:1 or "step 12 for link text" as T12 landed on; justify whichever you pick).
- **Base step remaps where the audit or policy demands**: candidates are `--ds-link-color` and `--ds-accent-text` (11 → 12?) and `--ds-focus-color` (8 → 9/10/11?). Every remap is one line in `semantic.css`; verify the visual result in composition (links in prose, focus ring on canvas and on cards) — a passing ratio that looks wrong is still wrong.
- Record the full before/after contrast table in findings.

## 2. Curated solid states (closes M2-O1) — the state chain, completed end-to-end

The T6 evidence: derived solid hover moves the WRONG direction in light (Blue 9 + white 8% *lightens*; Radix's curated Blue 10 hover is *darker*; ΔE 0.055) while dark derivation is nearly exact (ΔE 0.014/0.003). Implement the M2/M3 recommendation:

- `recipes.css`: add curated state channels to the solid recipe only — `--ds-variant-solid-hover-bg: var(--ds-accent-10);`… wait — recipes reference **semantic roles**, not active steps (conventions §5a). So first add the semantic role the recipe needs (e.g. `--ds-accent-solid-hover: var(--ds-accent-10);` in `semantic.css`, with a comment naming Radix's step-10 role), then bind it in the recipe. Decide `active` deliberately: Radix curates no "solid active" step — options are a curated value you justify, or leaving active derived. A complete pair was recommended (M3 §7 row M2-O1); if you disagree with evidence, document the disagreement.
- `button.css`: thread the recipe state channel through the variant axis per conventions §7 (curated → recipe → derived), keeping states variant-agnostic: the `solid` variant selector rebinds a `--_ds-button-variant-hover-bg` channel to the recipe token; `soft` leaves it unset; the hover rule consumes `var(--_ds-button-variant-hover-bg, <existing derived color-mix>)` through a resolved channel per §6.
- **The trap you must decide and document (this is the intellectual core of the task):** a curated hover is *pair-specific*. If a consumer overrides `--ds-button-bg` on a solid button, a naïvely-wired curated Blue-10 hover would still apply — exactly the "escapes the override chain" failure M1 forbade for per-surface aliases (button.md). Decide the behavior: (a) public bg override also suppresses the curated channel (find a wiring that does this — e.g. the resolved chain places the curated channel *behind* the public override such that overriding bg re-routes hover to the derived floor computed from the overridden bg), or (b) curated wins and consumers who override bg must override the public state property too (`--ds-button-hover-bg` — introduce it as the curated public slot if you go this way), documented loudly. Prove the chosen behavior in the fixture with the existing danger-context override probe: an overridden solid button's hover MUST remain coherent with its overridden surface. If (a) is achievable within §6 idioms, prefer it; if not, implement (b) and write exactly why (a) is not expressible.
- Re-measure the ΔE table (derived vs curated vs shipped) after wiring; both schemes.

## 3. Intentional-values review (the "valori messi a caso" pass)

For each, reaffirm or change, one line of rationale each in findings — evidence over taste, and M1–M3 batteries are the evidence that current values *work*:

- Type scale (`--ds-font-size-1..6`: 13/16/19/23/28/34px) and the six role definitions (weights, leadings).
- Space scale (4–64px) — both derivations kept it; M3 says a global change cannot express density. Expected: reaffirm.
- Radius scale (sm/md/lg/full) and each component's radius choice (button pill, card lg, field md, disclosure md).
- Control heights (2.75/2.25rem literals in button + field) — M2-O2/M3 say wait for a third control. Expected: reaffirm literals, don't promote.
- `--ds-disabled-opacity`, the 8%/12% state mixes (T6 ΔE supports them for soft), focus outline width/offset.
- `--ds-type-body-sm` (M2-O3): expected no — reaffirm or bring evidence.

## 4. Derivation-safe fixture copy (implements the v5 policy)

Retrofit ONLY the prose that encodes profile content, per conventions v5 §11:

- `fixtures/index.html`: ramp headings "Neutral · Radix Slate" etc. → token-neutral ("Neutral family — base profile: see palette.css"), or split into neutral label + a clearly-marked base-profile note.
- `fixtures/composition.html`: numeric claims like "body-md (400 / 1.5)" → token-named claims ("body-md role") or clearly-marked base-profile values.
- Zero changes to structure, assertions, probe markup, or ids. The full battery must pass IDENTICALLY before and after this retrofit — that is the proof the retrofit was copy-only.

## 5. Verification battery (required, both schemes)

Port **8050**, own tab, cache-bust ritual from `docs/deriving.md` before every assertion pass, kill/close when done.

- Full composition + consumer-override batteries (the wiring in §2 touches button state math — the consumer public-property hover case and the danger-context probe are the critical re-runs).
- The §1 contrast matrix, before and after, both schemes.
- §2: computed hover/active values on solid + soft, base and overridden, both schemes; the ΔE re-measurement.
- §4: battery identity pre/post retrofit.
- Greps: `light-dark()` only in palette; zero `!important`; recipes reference semantics only; components reference semantics/recipes only; prefix discipline.

## `docs/findings/curation.md` — required content

1. The contrast table (before/after, both schemes) + the adopted headroom policy statement.
2. Every remap and every reaffirmation from §1–§3, one-line rationale each — the complete "intentional values" register.
3. The §2 chain-wiring decision: which behavior (a/b), why, the exact resolution order shipped, and the fixture proof that overridden solids stay coherent. Plus the re-measured ΔE table.
4. Fixture-copy retrofit: what changed, and the pre/post battery-identity proof.
5. Conventions v6 candidates (proposals only): e.g. the curated-state wiring pattern as a §7 example; the headroom policy as normative numbers.
6. Anything the curation surfaced that tooling (validator/wizard) must know.

## Done means

Contrast audit + policy adopted and implemented · curated solid states wired with the override-coherence decision proven in-fixture · intentional-values register complete (reaffirmations included) · fixture copy derivation-safe with battery-identity proof · full battery green in both schemes · findings complete · nothing committed · closing report (contrast before/after first, then the §2 wiring decision, then the register highlights).
