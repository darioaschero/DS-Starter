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
- Tasks do **not** commit. The coordinator session handles git.

## Current status

Milestone 1 — vertical slice: foundations (tokens, layers, reset, focus baseline), button, card, rich text, composition fixture v1. Field, disclosure, and the layout primitive come in Milestone 2. Linter feasibility in Milestone 3.
