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

Next: **T6 — colour architecture v3** (`docs/tasks/T6-color-architecture.md`): Radix-flattened light/dark ramps, active palette steps, purpose-named semantic vocabulary, shared variant recipes, resolved channels, state-mix tokens. Then Milestone 2 (field, disclosure, stack + full §18 fixture). Linter feasibility in Milestone 3.
