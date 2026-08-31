# T8 — Disclosure

> **Goal:** the stateful disclosure on native `<details>`/`<summary>` — reference implementation for **native open-state presentation** (`[open]`), the ARIA-as-state-hook doctrine (analysis), and a zero-axis component (a useful data point in itself).
> **Runs in parallel with T7 (field) and T9 (stack).** File sets are disjoint — stay strictly inside yours.

## Read first, completely, in this order

1. `docs/conventions.md` (v3 — normative; §3 markup/parts, §6 pattern, §7 state chain incl. the derived color-mix floor, §8 focus)
2. `docs/direction.md` — §12 (native state, ARIA as state hook, the disclosure examples) and §18
3. `docs/findings/m1-synthesis.md` §5 (what M2 may assume; the composition fixture already contains two native disclosure baselines with stub CSS)
4. `docs/findings/color-architecture.md` (derived-state evidence; `bg-component` candidate)
5. `ds/components/card.css` (parts + container reference) and `ds/components/button.css` (state recipe reference)

## Files you may create/edit — ONLY these

`ds/components/disclosure.css` (currently a stub) · `fixtures/disclosure.html` (currently a stub) · `docs/findings/disclosure.md` (new, from `TEMPLATE.md`).

**Frozen for this task**: `ds/index.css` (disclosure.css is already imported), all `ds/tokens/*`, `ds/reset.css`, other components, other fixtures — including `fixtures/composition.html` (a later integration task re-verifies it with your CSS in place) — `docs/conventions.md`, `CLAUDE.md`, other findings, `docs/tasks/`. New tokens/roles/recipe channels: use the closest existing value and **propose** in findings — never edit token files. **No commits.**

## Component contract

### Anatomy (parts are direct children — conventions §3; markup as in direction §18)

```html
<details data-ui="disclosure">
  <summary data-part="trigger">More information</summary>
  <div data-part="content">…</div>
</details>
```

Native element does all behavior. CSS presents state; it never fakes it.

### Axes and API

- **No axes.** Document in the header comment that the axis list is deliberately empty; findings question #5 evaluates whether that held.
- Public API: propose-only. Start with **zero** public properties (container-pattern per T3's reasoning); findings question #5 argues whether any knob earned its place.

### Presentation (modest, testable)

- `trigger`: `font: var(--ds-type-label-md)`, `cursor: pointer`, `user-select: none`, comfortable block padding from the space scale. Marker: style the native one via `::marker` (e.g. `color: var(--ds-text-muted)`) or replace it (`list-style: none` + a `::before` glyph that changes under `[open]`) — your call; findings question #4 records portability notes. Do not animate (marker rotation transitions and `::details-content` height animation are out of scope — note as future work).
- `content`: `font: var(--ds-type-body-md)` (self-sufficient typography — a disclosure is a `[data-ui]` boundary, so embedded in rich text it receives NO prose styling and must not rely on it; state this in the header comment), padding via space tokens, `color: var(--ds-text-primary)`.
- `[open]` state: visible presentation change beyond the marker — e.g. trigger gains `--ds-font-weight-strong` weight or a bottom hairline `--ds-border-subtle`, content area reads as attached. Keep it subtle; record what you chose.
- Trigger hover: use the canonical derived recipe (§7) — `color-mix(in oklch, <resolved bg>, <resolved fg> var(--ds-state-hover-mix))`. The trigger's resting bg is `transparent`: mixing over transparent yields a low-alpha fg tint. **Evaluate whether that alpha-tint is a legitimate generic outcome of the derived recipe or an accident** — findings question #2. If it reads wrong, an explicit hover surface (`--ds-bg-subtle`) is the fallback; either way, states must consume resolved channels only (define frame/resolved channels per §6 even without axes — e.g. `--_ds-disclosure-trigger-bg/fg` + resolved pair).
- Focus: the shared baseline must produce a visible ring on `summary` — verify; re-tune offset only if the geometry truly demands it.

### ARIA doctrine (analysis, no code)

Native `<details>` needs no `aria-expanded`. Direction §12 shows an `[aria-expanded="true"]` hook for JS-driven triggers. In findings question #1, write the doctrine for the starter: when `[open]` is the hook, when `[aria-expanded]` would be, and why a `data-state` attribute would violate §3. No CSS for unbuilt JS behavior.

## Fixture — `fixtures/disclosure.html`

Canonical §11 chrome; inline styles only. Sections: closed + open (`open` attribute) side by side; keyboard interaction note (Tab + Enter/Space); trigger hover; long content (multiple paragraphs — content typography self-sufficiency visible); **disclosure-in-disclosure** nesting probe; **disclosure-on-card** probe (content surface on `--ds-bg-subtle` — evidence for the surface-depth question); native **exclusive accordion** via `<details name="faq">` on three siblings (pure platform behavior showcase — zero CSS required for the exclusivity); unsupported-attribute robustness (`data-size="md"` on the root must change nothing — no axes exist); `data-theme` subtree boxes.

## Verification battery (required, both schemes)

Serve the repo root on port **8042** (own browser tab; kill server + close tab when done). Assertions: `details.open` toggles false→true→false via real summary activation (click AND keyboard Enter); `[open]` presentation applies/reverts; exclusive accordion: opening one closes the sibling (assert `open` on all three); hover expression resolves (state the computed color and whether the alpha-tint reads correctly on canvas in BOTH schemes); focus ring visible on summary in both schemes at 2px/2px; content typography identical inside and outside a `data-theme` box except colours; zero console errors. Greps on your file: zero `!important`, zero `@layer`, every property `--ds-`/`--_ds-disclosure-` prefixed, semantic/recipe tokens only, no retired names.

## `docs/findings/disclosure.md` — required questions

1. **ARIA doctrine**: the `[open]` vs `[aria-expanded]` write-up (above) — concrete §7 wording proposal.
2. **Derived hover over transparent**: is the alpha-tint a feature of the derived recipe or a hole in it? Evidence from both schemes; recommendation for §7.
3. **Content surface**: transparent vs `bg-subtle` vs the `bg-component` (neutral-3) candidate — what does disclosure-on-card show about nesting depth?
4. **Marker styling**: what `::marker` allows cross-engine, what forced a replacement, and what that means for the starter.
5. **Zero axes / zero knobs**: did disclosure genuinely need no axes and no public properties? What was the first thing you were tempted to add, and why did you resist (or not)?

## Done means

All battery checks pass in both schemes · fixture complete · findings note answers all five questions · only your three files touched · nothing committed · closing report (what was built, verification results, the five answers in brief).
