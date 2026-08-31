# T10 — M2 integration

> **Goal:** close Milestone 2. Implement the embedded-spacing rule T9 handed off, extend the composition fixture to the **full direction §18 surface** (all six components composed), settle the `--ds-bg-component` decision with the integrated fixture as the third data point, re-run the complete verification battery, and write the M2 synthesis for the review checkpoint.
> **Sequential task — nothing else runs in parallel.** Conventions are at **v4**: the rules earned by T7–T9 are already promoted; your job is to *apply and verify* them, not re-decide them.

## Read first, completely, in this order

1. `docs/conventions.md` — **v4, normative** (§3 layout doctrine + finite geometry axes; §6 native-state rebinding + precedence; §7 authoritative state + transparent-bg states; §8 relocation; §9 relationship-outside-scope + the exact embedded-rhythm rule)
2. `docs/findings/stack.md` (question A hand-off: the rule you will implement; question B doctrine), `docs/findings/field.md`, `docs/findings/disclosure.md`, `docs/findings/color-architecture.md` (§4 surface-depth proposal)
3. `docs/findings/m1-synthesis.md` (§1 verdict tables you will re-run and extend; §3 open decisions; §5)
4. `docs/direction.md` §18 (the fixture contract and the full evaluation checklist)
5. `fixtures/composition.html` as it stands, plus `docs/findings/composition.md` (probe design, the discriminator trap)
6. The six component files in `ds/components/`

## Files you may create/edit

- `ds/components/rich-text.css` — ONLY to add the embedded-rhythm rule (below).
- `fixtures/composition.html` — extend to the full §18 surface (keep every existing probe and its assertion identity).
- `fixtures/index.html` — status labels only (field/disclosure/stack are built; composition covers M1+M2).
- `docs/findings/integration.md` (from `TEMPLATE.md`) and `docs/findings/m2-synthesis.md` (structure below).
- **Conditionally** (only via the §3 decision procedure below): `ds/tokens/semantic.css` (one `--ds-bg-component` line) and `ds/components/disclosure.css` (its content surface).

Everything else is frozen: `CLAUDE.md`, `docs/conventions.md`, `docs/direction.md`, other findings, `docs/tasks/`, all other `ds/` files, other fixtures. **No commits.**

## 1. Embedded-component rhythm (T9 hand-off)

Add to `ds/components/rich-text.css`, **outside** the `@scope` block (the scope limit excludes the boundary root — conventions §9), with a comment naming the contract:

```css
[data-ui="rich-text"] > :where(* + [data-ui]) {
  margin-block-start: var(--ds-space-4);
}
```

Verify in the composition fixture: the §18 card now sits 16px below the preceding paragraph (was 0), the paragraph after it keeps its existing 16px (`* + p` already covers the trailing direction), headings after components get their 24px, and the rule does NOT reach components nested inside other components (direct-child only — assert on a nested probe).

## 2. Full §18 composition surface

Extend `fixtures/composition.html` (canonical §11 chrome; inline styles only; keep all M1 sections and probes intact — the battery is designed for re-runs):

- **In the §18 article's card**: add a `field` (label + control + input + description + error, `required`) so the card composes title/body/field/actions/disclosure — the §18 fixture now exercises all six components. The disclosure there is no longer a stub: assert its styled `[open]` presentation in place.
- **App-layout section** (outside the article — stacks never wrap prose, conventions §3): a `stack` of two cards, each containing a field and buttons, one containing a disclosure. Assert: stack gap vs card internal gap independence; every containment guarantee holds in the deeper tree.
- **New probes**, each labeled with intended outcome:
  1. Field-in-card-in-rich-text under the §3 discriminated copy: label/description/error typography must NOT follow the prose override (extend the existing discriminated section with a field).
  2. Embedded-rhythm assertions from §1 (including the direct-child-only negative probe).
  3. `:user-invalid` under composition: the in-card field driven invalid via the native form-submission technique from T7's fixture; assert danger border + error visibility inside the composed tree, plus invalid-beats-focus while focused.
  4. Focus walk v2: the full inventory now includes inputs and summaries — count it in the fixture text, assert the ring (or field's relocated ring) on every stop.
  5. Same-surface collapse inventory for §3: every pairing where two `--ds-bg-subtle` surfaces or a transparent frame meet (card-in-card from M1, disclosure-content-on-card, field-frame-on-card, any new ones the full tree creates) — one labeled specimen each.

## 3. `--ds-bg-component` decision (third data point)

Procedure, in order — the criteria decide, not preference:

1. Build §2 first; screenshot the §2.5 collapse inventory in both schemes.
2. **Adopt** the token if BOTH hold: (a) same-surface collapse appears in ≥2 distinct real pairings of the integrated fixture; (b) `--ds-neutral-3` restores legible depth in both schemes without making the light scheme read heavy (visual judgment + text-contrast spot checks on the new surface).
3. If adopted: add `--ds-bg-component: var(--ds-neutral-3);` to `tokens/semantic.css` (one line, with a comment naming the Radix step role), bind **only** `disclosure.css`'s content part to it (the one consumer with measured demand across T8 + this fixture). The outline recipe stays transparent and card stays `bg-subtle` — record those as deliberate non-consumers with reasons. Re-run the affected assertions.
4. If not adopted: change nothing, and document exactly which criterion failed with the screenshots as evidence. Either outcome is a valid result.

## 4. Verification battery (required, both schemes)

- Serve the repo root on port **8044**, own browser tab, kill/close on completion.
- **Cache warning (learned the hard way):** the browser pane caches imported CSS across visits with this server. Before ANY computed-style assertion, refresh every stylesheet — `await Promise.all(urls.map(u => fetch(u, {cache: 'reload'})))` over `/ds/index.css`, all `/ds/tokens/*.css`, all `/ds/components/*.css` — then reload the page. Re-run, never trust pre-refresh numbers; "component looks unstyled" is a cache smell before it is a defect.
- Re-run the ENTIRE M1 battery on `composition.html` (every probe: discriminated composition, wrapped part, colliding part name, nested overrides, dual-role, nested rich-text) plus all §2 additions, plus `consumer-override.html` untouched-but-re-verified (5 cases).
- Keyboard note: drive focus with real Tab/Shift+Tab key injection (programmatic `focus()` defeats `:focus-visible`); summary Enter/Space activation is known-uninjectable in this pane — verify disclosure toggling by real click and state it, don't fail the battery on the driver limit.
- Zero console errors; greps: zero `!important`, `@layer` only in index.css, `light-dark()` only in palette.css, zero retired names, zero component references to primitives/active steps (fixture consumer demos exempt).

## 5. `docs/findings/m2-synthesis.md` (the checkpoint document — structure fixed)

1. **Verdict table**: the direction §18 evaluation items that M1 deferred (native + ARIA state presentation, layout primitive under composition, `:user-invalid` composed) plus every §18 fixture check re-run on the full surface — held / held\* / failed / still-deferred, with evidence pointers.
2. **The bg-component decision**: outcome, criteria evidence, consumers and non-consumers.
3. **Open decisions after M2** — consolidated table (id, evidence, recommendation, cost to reverse): curated solid hover/active channels (T6's ΔE evidence), control-height token (still two consumers?), `--ds-type-body-sm` (field's demand — did integration add a second?), light link-on-subtle contrast headroom (4.53:1), `data-ui` name portability, anything new.
4. **Linter rule inventory for M3** — consolidate every lintable rule accumulated across ALL findings into one numbered list with source pointers (part depth; axis-owns-channels; no-op default markers; public-chain bypass; resolved-channel restatement; explicit completeness of non-default rebinds; vocabulary keys `component.axis.value`; §3 geometry-axis distinction; relationship-rule placement; `light-dark()` single site; prefix discipline; …). This list is M3's starting spec.
5. **M3 readiness**: what the linter spike can assume; which questions only it can answer.

`docs/findings/integration.md` records the integration work itself (template: what held, friction, surprises).

## Done means

Embedded rhythm implemented and asserted · full §18 surface composed with all six components · bg-component decided by procedure with evidence · entire battery green in both schemes (M1 probes + M2 additions + consumer overrides) · index labels updated · both findings documents written · nothing committed · closing report (battery results first, then the bg-component outcome, then the synthesis headlines).
