# T6 — Colour architecture v3

> **Goal:** replace the hand-tuned scheme-neutral ramps with the v3 colour architecture: Radix-flattened light/dark primitives → active palette steps → purpose-named semantic roles → shared variant recipes → component channels. Refactor the three built components onto it, and re-run the M1 verification battery to prove nothing regressed.
> **Why:** decided at the M1 checkpoint from `docs/findings/color-theme-architecture.md`; resolves the two structural risks flagged in M1 (dark-ramp step budget; nesting depth) and closes synthesis rows 1, 2, 4, 8.
> **This brief is authoritative for scope.** `docs/conventions.md` (v3) is authoritative for every naming and pattern rule.

## Read first, completely, in this order

1. `docs/conventions.md` — **v3, normative**: §5a is the architecture you are implementing; §6 shows the new canonical component snippet (resolved channels, recipe binding); §7 the state chain.
2. `docs/findings/color-theme-architecture.md` — the rationale and the layered model.
3. `docs/findings/m1-synthesis.md` — §3 rows 1, 2, 4, 8 (what this task closes) and §1 (the battery you will re-run).
4. `docs/findings/button.md` — the state-derivation evidence (mix toward resolved fg; oklch hue-rotation caveat).
5. The files you will touch: `ds/tokens/*.css`, `ds/index.css`, `ds/components/button.css`, `ds/components/card.css`, `ds/components/rich-text.css`, `ds/reset.css`, `fixtures/*.html`.

## Files you may create/edit — ONLY these

`ds/tokens/palette.css` (new) · `ds/tokens/recipes.css` (new) · `ds/tokens/scale.css` · `ds/tokens/semantic.css` · `ds/index.css` (the two new `@import` lines only) · `ds/components/button.css` · `ds/components/card.css` · `ds/components/rich-text.css` · `ds/reset.css` (only if an old name appears in it) · `fixtures/*.html` (rename sweep + specimen updates) · `docs/findings/color-architecture.md` (new, from `TEMPLATE.md`).

Off-limits: `CLAUDE.md`, `docs/direction.md`, `docs/conventions.md`, `docs/findings/TEMPLATE.md`, other findings notes, `docs/tasks/`, the stub component files (field/stack/disclosure — header comments only, no colour references). **No commits** — the coordinator handles git.

## 1. `ds/tokens/palette.css` (new)

- Fetch the **official Radix Colors values** — do not eyeball, do not convert, do not hand-tune. Source: the `@radix-ui/colors` npm package (browse `https://unpkg.com/browse/@radix-ui/colors@latest/` for the per-scale CSS files) or `https://github.com/radix-ui/colors` sources. Needed sets, plain sRGB only (no alpha `…A` sets, no P3): **Slate + Slate Dark, Blue + Blue Dark, Red + Red Dark**. If the network is unavailable, stop and report — never invent values.
- Flatten them verbatim into: `--ds-neutral-light-1..12`, `--ds-neutral-dark-1..12` (from Slate), `--ds-accent-light/dark-1..12` (Blue), `--ds-danger-light/dark-1..12` (Red).
- File header comment: source, package version, MIT attribution, and the Radix step convention (1 app bg · 2 subtle bg · 3–5 component bg/hover/active · 6–8 borders · 9–10 solid+hover · 11–12 text).
- Then the **active steps** under `:root { color-scheme: light dark; }`: `--ds-neutral-1: light-dark(var(--ds-neutral-light-1), var(--ds-neutral-dark-1));` … all 36. This file is the only place `light-dark()` appears.

## 2. `ds/tokens/semantic.css` (rewrite)

Purpose vocabulary referencing active steps (conventions §5a.3). Baseline mapping — deviate only with a documented reason in findings:

| Token | Step |
|---|---|
| `--ds-bg-canvas` | neutral-1 |
| `--ds-bg-subtle` | neutral-2 |
| `--ds-text-primary` | neutral-12 |
| `--ds-text-muted` | neutral-11 |
| `--ds-border-subtle` | neutral-6 |
| `--ds-border-default` | neutral-7 |
| `--ds-link-color` | accent-11 |
| `--ds-focus-color` | accent-8 (Radix's designated focus-ring step) |
| `--ds-accent-subtle` | accent-3 |
| `--ds-accent-text` | accent-11 |
| `--ds-accent-solid` | accent-9 |
| `--ds-accent-on-solid` | `white` literal + comment (Radix prescribes white over Blue 9) |
| `--ds-text-danger` | danger-11 |
| `--ds-border-danger` | danger-8 |

Keep: `--ds-disabled-opacity`, `--ds-focus-outline`, `--ds-focus-outline-offset`, and the `[data-theme="light"|"dark"] { color-scheme: … }` subtree switch. Add the state strengths: `--ds-state-hover-mix: 8%`, `--ds-state-active-mix: 12%`. Retired names (`--ds-surface-1|2`, `--ds-text-1|2`, `--ds-border-1`, `--ds-accent-surface|strong|contrast`, `--ds-danger-color`) must not survive anywhere.

## 3. `ds/tokens/recipes.css` (new)

Per conventions §5a.4 — recipes reference semantic roles, never steps:

- `solid`: bg `--ds-accent-solid`, fg `--ds-accent-on-solid`
- `soft`: bg `--ds-accent-subtle`, fg `--ds-accent-text`
- `outline`: bg `transparent`, fg `--ds-text-primary`, border `--ds-border-default`

No hover/pressed channels (derived-first). `outline` ships unconsumed for now — that is fine (starter vocabulary ≠ dead code, direction §15); do **not** add an outline variant to button in this task.

## 4. `ds/tokens/scale.css` and `ds/index.css`

- scale.css: remove the three colour ramps; keep space / font-size / radius / font stacks / weights untouched.
- index.css: add exactly two imports — `tokens/palette.css` into `layer(ds.tokens)` **before** semantic.css; `tokens/recipes.css` into `layer(ds.roles)` after roles.css. Touch nothing else.

## 5. Component refactors

**button.css — the reference refactor** (conventions §6 snippet is the target shape):

- Variant channels bind recipes: base (soft default) → `--ds-variant-soft-bg/fg`; `&[data-variant="solid"]` → `--ds-variant-solid-bg/fg`.
- Add resolved channels `--_ds-button-resolved-bg/fg` computed once in the base rule; `background`/`color` and both state rules consume ONLY the resolved channels.
- Hover/active strengths come from `--ds-state-hover-mix` / `--ds-state-active-mix`.
- Update the header comment (it documents the resolution chain and the state recipe).

**card.css, rich-text.css, reset.css — mechanical rename only**: `surface-2 → bg-subtle`, `border-1 → border-subtle` (or `border-default` where genuinely interactive — record each choice), `text-2 → text-muted`, `text-1 → text-primary`. No structural changes.

**fixtures/*.html — sweep**: every chrome block becomes `body { background: var(--ds-bg-canvas); color: var(--ds-text-primary); font: var(--ds-type-body-md); }` + frame; rename any inline-style semantic references. Raw-step references in consumer/probe demos (e.g. `--ds-danger-9`) remain valid active-step names — verify they still resolve. `fixtures/index.html`: update the specimen page — swatches for the new semantic vocabulary, recipe specimens (three chips), and three ramp strips per family: light primitives (fixed), dark primitives (fixed), active steps (flips with scheme).

## 6. Verification battery (required, both schemes, before writing findings)

- Serve the repo root statically on a free port; verify in the browser with computed styles + screenshots, light AND dark (emulate `prefers-color-scheme`).
- **Re-run the M1 composition battery**: every probe in `fixtures/composition.html` (§18 fixture, wrapped part, colliding part name, nested overrides, dual-role, nested rich-text, discriminated composition) and all five `fixtures/consumer-override.html` cases. The assertions are stable by design — same expected outcomes, new colour values.
- Button checks: attribute-less === soft/md; solid bg computes to Radix Blue 9; soft bg to Blue 3; hover shade uses the 8% token (resolve the expression); focus ring = accent-8 in both schemes.
- Sanity: `--ds-bg-canvas` computes to Slate 1 light / Slate Dark 1 dark; text/link contrast reads cleanly on canvas and subtle in both schemes.
- Greps: zero old names in `ds/` + `fixtures/` (`surface-`, `--ds-text-1`, `--ds-text-2`, `--ds-border-1`, `--ds-gray`, `accent-surface`, `accent-strong`, `accent-contrast`, `danger-color`); `light-dark(` only in palette.css; zero `!important`; zero `@layer` outside index.css.
- Kill servers, close tabs when done.

## 7. `docs/findings/color-architecture.md`

Beyond the template, answer explicitly:

1. Exact border mapping chosen per use (subtle vs default) and why.
2. Was any semantic `light-dark()` asymmetry needed, or did active steps cover everything?
3. **Derived vs curated states**: Radix's own hover convention is step 4 (soft/tinted bg hover) and step 10 (solid hover). Compare the computed derived shades (`color-mix` 8%/12%) against Radix 4/5 and 10 in both schemes — how close are they? This is the evidence for the open curated-vs-recipe-state decision.
4. Surface depth for M2: with independent dark ramps, which step should a nested/raised surface use (`bg-raised` candidate)? Propose, don't implement.
5. Anything the recipe contract (bg/fg/border channels) turned out to be missing.

## Done means

All §6 checks pass in both schemes · zero old-name survivors · findings note written · a short closing report (what changed, battery results, the five findings answers in brief) · nothing committed.
