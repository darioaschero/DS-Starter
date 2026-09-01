# DS-Starter

CSS-only design system starter. Hand-authored CSS is the source of truth: no build step, no TypeScript descriptors, no token pipeline, no framework runtime, no component library implementation.

## Read before any change

1. [docs/conventions.md](docs/conventions.md) — **normative**. Naming, layers, component pattern, process rules. Every task must follow it.
2. [docs/direction.md](docs/direction.md) — the full direction document (rationale, decision status, deferred decisions).

## Quick facts

- All starter CSS lives in named cascade layers (`ds.*`). Layer order is declared **only** in `ds/index.css`. Ordinary unlayered consumer CSS must win over the starter. No `!important`.
- Component identity: `data-ui="<component>"`. Parts: `data-part="<part>"`. Finite configuration: per-component `data-*` axes. Styling values: `--ds-*` custom properties.
- Preview: `python3 -m http.server <port>` from the repo root, then open `/fixtures/`. Zero build.
- Every work task ends with a findings note in `docs/findings/` (copy `TEMPLATE.md`). The prototype exists to answer questions; findings notes are a first-class deliverable.
- Work tasks are defined as self-contained briefs in `docs/tasks/`, launched by the user as separate sessions. If this session was started from such a brief, follow the brief exactly.
- Tasks do **not** commit. The coordinator session handles git.

## Current status

Milestone 1 (vertical slice) is **complete and committed**: foundations, button, card, rich text, composition + consumer-override fixtures, synthesis in `docs/findings/m1-synthesis.md`. Conventions are at v3 (colour architecture).

T6 (colour architecture v3) and the three M2 component tasks — T7 field, T8 disclosure, T9 stack — are **complete and committed**. Conventions are at v4 (M2 rules promoted: native-state channels, public-vs-state precedence, focus relocation, authoritative state, transparent-bg derived states, finite geometry axes, layout doctrine, relationship rules outside scope).

**Milestone 2 is complete and committed** (T10 integration included): all six direction-§18 components composed and verified on the full fixture, embedded-component rhythm owned by rich-text, `--ds-bg-component` adopted (disclosure content only), M2 synthesis + 30-rule linter inventory in `docs/findings/m2-synthesis.md`.

**Milestone 3 is complete and committed.** Both derivation experiments (T11 LGC-like on `derivation/lgc`, T12 warm editorial on `derivation/editorial` — worktrees `../DS-Starter-lgc`, `../DS-Starter-editorial`) proved the starter thesis with zero frozen-surface leaks. The synthesis is `docs/findings/m3-synthesis.md` (two-path comparison, 15-knob parameter surface, constraint classes, wizard questionnaire, conventions v5 proposals, linter rules 31–34); the shippable derivation guide is `docs/deriving.md`.

**Project thesis v2 (2026-09-01 pivot, user-decided):** DS-Starter becomes a **minimal core + optional modules** that a wizard integrates step by step, with scales and palettes produced by **generative rules** rather than hand-picked values. Core minimo (user's choice): pure content — foundations, generated scales, semantic roles, typography, rich text; **zero components** (the first module will be `actions`/button). T14 base curation is **superseded — do not launch**; its useful pieces return as gates/modules.

**Process rule (conventions §11): design curation belongs to the user.** Research/design tasks deliver options with rendered specimen pages; the user decides at coordinator checkpoints; conventions record the user's choices.

Now: **T15 — palette generation rule** (`docs/tasks/T15-palette-rule.md`, research-only): reverse-engineer the OKLCH curves from the Radix ground truth (6 families in-repo + held-out set), formulate candidate seed→ramp rules, validate at ΔE, and deliver a live specimen page for the user's judgment. Spacing/type-scale rules and the core/module restructuring follow.

The linter is **parked, not dropped**: its 30-rule inventory (`docs/findings/m2-synthesis.md` §4–5) stays valid and will be better informed by the mistakes derivations actually surface.
