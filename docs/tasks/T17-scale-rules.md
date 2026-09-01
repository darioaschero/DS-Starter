# T17 — Spacing, type, and radius scale rules (research)

> **Working directory: `/Users/darioaschero/Documents/dev/DS-Starter` (main checkout).** Run `pwd` first.
> **Research task under the curation rule (conventions §11): you decide nothing.** Deliver parametrizations, their consequences rendered on the real system, and a "Decisions left to the user" list. Where a judgment call appears, present branches; label opinions as opinions.

## Goal

The palette now has a decided generative engine (conventions §5a, user decision 2026-09-01). This task researches the generative rules for the **non-colour scales**: spacing (`--ds-space-1..8`), type sizes (`--ds-font-size-1..6`) with their role leadings, and the radius scale (`--ds-radius-sm|md|lg`) — so the wizard can generate them from a few plain answers (base unit, density, type ratio/voice, softness) instead of shipping one hand-picked set. Unlike the palette there is no single ground truth to fit: the work is designing **candidate parametrizations** and making their consequences judgeable on real compositions.

## Read first

1. `docs/conventions.md` (v5) — §5b (the scales under study), §6–7 (what consumes them), the §5a user-decision block (the decision format this task feeds).
2. `docs/findings/m3-synthesis.md` §3–4 — especially the non-actions (both derivations kept spacing; global spacing cannot express density) and the relational-constraint class.
3. `docs/findings/field.md` and `button.md` (control heights 2.25/2.75rem vs type/space relations), `rich-text.md` + `stack.md` (rhythm subjects: space-4 flow, space-6 headings, space-2 tight, gap presets sm/md/lg → space-2/4/6).
4. Reference material for scale shapes (read-only): current base (`ds/tokens/scale.css`: space 4–64px on a 1,2,3,4,6,8,12,16 ×4px pattern; type 13/16/19/23/28/34), the LGC scales (`/Users/darioaschero/Documents/dev/LGC/tokens/*`), the two derivation worktrees' `scale.css`.

## The relational constraints (the hard part — carry them, don't rediscover them)

A generated scale set is valid only if the **relations** survive; the M-series proved these matter more than the values:

- Control height ≈ type size + vertical breathing (44px works with 16px body; a generated pair must keep controls proportioned).
- Prose rhythm consumes space-4 (flow), space-6 (before headings), space-2 (heading-to-block), space-1 (list items): the *ratios between steps* carry the rhythm, not the absolute values.
- Stack presets map to space-2/4/6 — preset meaning must survive regeneration.
- Role leadings pair with sizes (body 1.5–1.65, headings tighter) and label weight must stay distinct from `--ds-font-weight-strong` (the relational-delta constraint).
- Radius values relate to control height (a pill needs no tuning; sm/md/lg read against 36–44px boxes).

Every candidate rule must state which relations it preserves by construction and which need a gate.

## Candidate parametrizations to design (min. these axes; add what the analysis suggests)

1. **Spacing**: base unit (default 4px) × progression. Candidates: the current hybrid pattern (1,2,3,4,6,8,12,16), pure geometric (ratio^n), and at least one alternative worth arguing. A **density parameter** (compact/default/comfortable): does it scale the base, reshape the curve, or select a preset table? Show what each choice does to REAL compositions (cards, fields, prose rhythm) — m3-synthesis says global scaling cannot express prose-vs-control density; demonstrate whether that limit applies to each candidate.
2. **Type scale**: base size (16px anchor) + modular ratio (candidate menu: 1.125 / 1.2 / 1.25 / 1.333 …) + step count (6) + rounding policy (whole px? halves? and why it matters at small sizes) + a **leading rule** (line-height as a function of size — smaller looser, larger tighter; state it as a formula with the current roles as one instance).
3. **Radius**: softness presets (e.g. sharp / soft / round) mapping to sm/md/lg triples, with `full` fixed; shown on real controls at both control heights.
4. **What stays out of generation** (argue it): font stacks (voice is a choice, not a formula), weights, the space-step *roles* used by rhythm.

## Specimen — `docs/research/scale-rules/specimen.html`

Unlike the palette specimen, this one MAY link `../../../ds/index.css` (read-only) — judging scales requires the real system. Mechanism: live controls (base, progression, density, ratio, rounding, leading rule, softness) → generated values → applied as `:root` custom-property overrides on the page (`--ds-space-*`, `--ds-font-size-*`, the six role `font` shorthands, `--ds-radius-*`) — zero `ds/` edits, everything inline on the specimen page.

Content:

- **Live composition panel**: a representative sample rendered with the generated scales — prose block (headings, paragraphs, list, code), a card with field + buttons + disclosure, a stack of cards — light and dark, updating as controls move.
- **Preset gallery**: named parameter bundles side by side (at least: current base as "the fitted instance", a compact bundle, a comfortable bundle, one geometric-progression bundle) — same composition sample under each, with the generated value tables printed.
- **Relational readouts** per generation: control-height/type ratio, rhythm step ratios, leading table, the label-vs-strong weight delta — green/amber/red against the constraints above (thresholds proposed by you, labelled as proposals).
- **Breakage gallery**: parameter corners where compositions visibly degrade (huge ratios, tiny bases, extreme density) — shown honestly.

## Deliverables — ONLY these files

`docs/research/scale-rules/specimen.html` (+ local `.mjs` modules in the same folder) · `docs/findings/scale-rules.md` (from `TEMPLATE.md`): the parametrizations stated precisely (reimplementable from prose), the relational-constraint analysis per candidate, preset tables, breakage findings, and the closing **"Decisions left to the user"** (progression shape; density model; ratio menu; rounding; leading rule; radius presets; what stays fixed; proposed gate thresholds). Nothing in `ds/`, no fixtures, no conventions/CLAUDE/briefs. **No commits.**

## Verification

Port **8053**, own tab, kill/close when done. Specimen static, zero network, zero console errors; cache-bust ritual if computed values are asserted against `ds/` styles. Exercise: every control, every preset, both schemes, the breakage corners, and confirm `ds/` files untouched (`git status`).

## Done means

Candidate parametrizations complete and precise · relational constraints analysed per candidate · live specimen with composition panel, presets, readouts, breakage gallery · findings with the user-decision list · nothing committed · closing report (what the parametrization space looks like first, then which relations bind hardest, then the decision list).
