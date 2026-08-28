# Conventions (v1 — provisional)

> **Status:** provisional prototype conventions, distilled from [direction.md](direction.md) (rev 0.2, mainly §16 plus hard rules throughout).
> They are **binding for every task** in the current prototype, and deliberately cheap to reverse later.
> If a task needs a decision this file does not cover: pick the smallest reasonable option and record it in the task's findings note (`docs/findings/`). Do not invent architecture silently.
> On any conflict between this file and `direction.md`, this file wins for the prototype — but flag the conflict in findings.

## 1. Repository layout

```text
ds/                     starter CSS (everything ships inside named layers)
  index.css             the ONLY file that decides cascade order
  reset.css             minimal reset + shared focus baseline      → layer ds.reset
  tokens/scale.css      raw scale tokens                           → layer ds.tokens
  tokens/semantic.css   semantic aliases (light-dark)              → layer ds.tokens
  tokens/roles.css      typography roles                           → layer ds.roles
  components/*.css      one file per component                     → layer ds.components
fixtures/               plain static HTML pages (no build; served statically)
docs/direction.md       full direction document (rationale)
docs/conventions.md     this file (normative)
docs/findings/          one note per task (copy TEMPLATE.md)
```

## 2. Cascade layers

- Layer order, declared once at the top of `ds/index.css`:
  `@layer ds.reset, ds.tokens, ds.roles, ds.components, ds.exceptions;`
- Files are pulled into their layer from `index.css` via `@import "..." layer(ds.…);`. Individual files never declare their own cascade position.
- All starter CSS lives inside these layers. Never unlayered. Never `!important`.
- **Consumer contract:** ordinary unlayered application CSS must win over the starter without specificity escalation, layer knowledge, or `!important`. Fixture "chrome" styles inside fixture pages count as consumer CSS: keep them minimal and clearly marked as such.
- **Canvas ownership:** the starter never paints the application canvas — no `body` background/color/base-font rule ships in any `ds.*` layer. The page rule belongs to the consumer, written with public tokens. Fixtures demonstrate this via the canonical fixture chrome (§11).

## 3. Markup contract

- Semantic native HTML first (`<button>`, `<details>`, real heading levels…). Never recreate behavior the platform already provides.
- Component root: `data-ui="<component>"`.
- Named parts: `data-part="<part>"` — meaningful only within the nearest ancestor `[data-ui]` boundary. Part selectors must not reach into nested components.
- Part placement contract (chosen via the card A/B containment test): parts are **direct children** of their component root; consumers wrap content *inside* a part, never around one — a wrapped part renders deliberately unstyled. Components style parts with direct-child combinators (`& > [data-part="…"]`). `@scope` is not required for fixed shallow anatomy; it earns its complexity where content depth is unbounded (rich text).
- Finite configuration axes: `data-<axis>="<value>"` (e.g. `data-variant`, `data-size`). Axis vocabulary is **per component**, not global. Each component documents (in a header comment) which axes it supports, their values, and the default.
- Attributes describe discrete choices; custom properties carry styling values. Never expose primitive styling as attributes (no `data-radius="full"`, no `data-padding-x="large"`).
- ARIA is a styling hook only when it reflects real accessible state (e.g. `[aria-expanded="true"]`). Never introduce or repurpose ARIA as a visual configuration API.
- Heading levels reflect document hierarchy, never desired visual size.

## 4. Custom-property naming

- System prefix: `--ds-`.
- Public properties (tokens, roles, component override APIs): `--ds-…`, e.g. `--ds-space-3`, `--ds-type-label-md`, `--ds-button-bg`.
- Internal channels: `--_ds-<component>-<axis>-<prop>`, e.g. `--_ds-button-variant-bg`, `--_ds-button-size-font`. Always qualified by system + component + owning axis/concern. Never generic (`--_bg`, `--_gap`) — the underscore is a convention, not privacy.
- `@property` registration only where it buys typed interpolation, explicit non-inheritance, a guaranteed initial value, or a validated public contract — always with the `--ds-` prefix. Not every token gets registered; be careful registering context-responsive semantic aliases.

## 5. Tokens

Three levels. Components normally consume the **semantic** level, never raw palette values.

1. **Raw scale** (`tokens/scale.css`), all in `:root`, no component meaning, no `light-dark()` here:
   `--ds-space-1..8`, `--ds-font-size-1..6` (rem), `--ds-radius-sm|md|lg|full`, `--ds-font-sans`, `--ds-font-mono`, `--ds-font-weight-normal|medium|strong`, raw palettes `--ds-gray-1..12`, `--ds-accent-1..12`, `--ds-danger-1..12`.
   Ramp step roles (shared by all three palettes, light-ordered): 1–2 app/subtle backgrounds · 3–5 tinted component backgrounds · 6–8 borders and strong tints · 9–10 solids · 11–12 text. The dark end doubles as dark-scheme surfaces (12 ≈ dark surface-1, 11 ≈ dark surface-2, 10 ≈ dark border). Components pick steps only via semantic aliases, never raw steps.
2. **Semantic** (`tokens/semantic.css`), purpose-named aliases via `light-dark()` under `:root { color-scheme: light dark; }`:
   `--ds-surface-1|2`, `--ds-text-1|2`, `--ds-border-1`, `--ds-accent-surface`, `--ds-accent-text`, `--ds-accent-strong`, `--ds-accent-contrast`, `--ds-link-color`, `--ds-danger-color`, `--ds-focus-color`, `--ds-disabled-opacity`, plus focus-treatment values (`--ds-focus-outline`, `--ds-focus-outline-offset`).
   Provisional subtree theme switch: `[data-theme="light"] { color-scheme: light; }` and the dark equivalent.
3. **Typography roles** (`tokens/roles.css`) — font-only, each one a single value for the native `font` shorthand:
   `--ds-type-label-sm|md`, `--ds-type-body-md`, `--ds-type-heading-sm|md|lg`.

Rules:

- Semantic aliases *may* be scheme-invariant: when a single value passes contrast in both schemes (e.g. `--ds-accent-strong`), write a plain `var()` reference — `light-dark()` only where the branches differ.
- Role font sizes use `rem` (stability under nesting). `em` only for intentionally context-relative adjustments (e.g. inline `code` at `0.9em`).
- Roles carry ONLY what `font` carries. `letter-spacing`, `text-transform`, color, truncation, clamping are **not** part of a role. No sidecar properties in this prototype.
- Components select their intrinsic typography role in their own CSS — never via markup attributes.

## 6. Component recipe pattern

Canonical shape (button is the reference implementation):

```css
[data-ui="button"] {
  /* 1. Axis channel defaults — the base rule is the ONLY implementation of every default */
  --_ds-button-variant-bg: var(--ds-accent-surface);
  --_ds-button-size-font: var(--ds-type-label-md);

  /* 2. Resolution: public override → axis channel → semantic token (already inside the channel) */
  background: var(--ds-button-bg, var(--_ds-button-variant-bg));
  font: var(--ds-button-font, var(--_ds-button-size-font));

  /* 3. Axis selectors rebind ONLY their own channels */
  &[data-variant="solid"] {
    --_ds-button-variant-bg: var(--ds-accent-strong);
  }
  &[data-size="sm"] {
    --_ds-button-size-font: var(--ds-type-label-sm);
  }

  /* 4. Named default value = no-op vocabulary marker, no rebind */
  &[data-size="md"] {
    /* Default vocabulary marker. No channel rebind. */
  }
}
```

Hard rules:

- One axis never touches another axis's channels.
- Axis selectors never write the public property (e.g. `--ds-button-bg`) — that bypasses the override chain.
- No combination-matrix selectors (`[data-variant=…][data-size=…]` recipes) unless a real cross-axis interaction exists and is documented in findings.
- The component renders correctly with no axis attributes at all, and degrades gracefully on unsupported values (the base rule wins). Graceful fallback is not validation — a future linter reports bad vocabulary.
- Defaults are implemented **only** in the base rule; a named-default selector exists only as a commented no-op marker.
- Non-default axis values rebind **every** channel their axis owns, even when one value coincides with the base default (explicit completeness: each named value reads as a complete recipe, and the invariant is lintable). Only the default is implemented solely by the base rule.
- Public override properties are inherited **context** overrides: set on an ancestor, they retheme the whole subtree — including nested instances of the same component. This is by design (subtree theming); never register them `inherits: false` without a documented reason.
- Expose public override properties (`--ds-<component>-bg|fg|font|padding-x|…`) for the obvious knobs. Whether *every* component needs them is deliberately open — record reasoning in findings.

## 7. State

- Prefer native state: `:disabled`, `:hover`, `:active`, `:focus-visible`, `:focus-within`, `:has(input:user-invalid)`, `[open]`.
- ARIA state selectors (e.g. `[aria-expanded="true"]`) only where they mirror real component state.
- CSS styles state; it never creates behavior.
- No dedicated hover/active semantic aliases exist yet. Derive state shades with `color-mix(in oklch, …)` over the component's own resolved chain (so public overrides still flow through), and record in findings whether dedicated state aliases should be promoted to `tokens/semantic.css`.

## 8. Focus

- Shared baseline lives in `reset.css`:

  ```css
  :where(:focus-visible) {
    outline: var(--ds-focus-outline);
    outline-offset: var(--ds-focus-outline-offset);
  }
  ```

  with the two values defined in `tokens/semantic.css`.
- Layer order is not a hazard here: `var()` resolves per element at computed-value time, so `ds.reset` may safely reference custom properties defined in `ds.tokens`. Do not re-litigate this ordering.
- Components may re-tune the shared values (e.g. `--ds-focus-outline-offset: 3px;`) for their geometry. Components must never remove focus indication.
- Focus visibility is a system responsibility; a component is not "done" without it.

## 9. Rich-text containment

- Prose styling uses `@scope ([data-ui="rich-text"]) to (:scope [data-ui]) { … }` — any nested `[data-ui]` is a lower boundary.
- `@scope` limits selector reach only; it does **not** stop inheritance. Do not set typography on the rich-text root; map roles onto semantic elements inside the scope.
- Block elements get complete `font` roles; inline elements (`strong`, `em`, `code`, `a`) only modify the current context (weight, style, family, `0.9em` size, link color/underline) — never a full body role.
- Composition fixtures must test both failure modes separately: selector bleed AND inherited-value bleed.
- When to use `@scope` (rule distilled from the card and rich-text tests): **mandatory** wherever a component styles elements it does not mark (unmarked semantic descendants at arbitrary depth — rich text); optional and normally omitted where a component styles only its root and its direct-child marked parts (§3).
- Scoping limits are exclusive: the boundary element itself (`:scope [data-ui]`) is already outside the donut — scoped rules cannot style even the nested component's root.
- An element deliberately excluded from scoped styling falls back to **UA** rules, not to the nearest role — neutralize where it matters (e.g. `:where(pre > code) { font: inherit; }`).

## 10. Browser baseline

Evergreen browsers, 2025+: native nesting, cascade layers, `@scope`, `light-dark()`, `color-scheme`, `:user-invalid`, `:has()`, `:focus-visible`. No fallbacks for older engines in this prototype.

## 11. Process rules (for tasks/agents)

- No build tools, no npm, no external assets, fonts, or libraries. Fixtures must work served statically (`python3 -m http.server` from the repo root).
- Canonical fixture chrome: each fixture page has exactly ONE inline `<style>` block, commented `/* fixture chrome — unlayered consumer CSS */`, containing only the consumer page rule `body { background: var(--ds-surface-1); color: var(--ds-text-1); font: var(--ds-type-body-md); }` plus a minimal page frame (max-width, margin auto, padding). All other fixture presentation uses inline `style` attributes on specimen wrappers — never a second `<style>` block.
- `ds/index.css` already imports every component file. Component tasks edit ONLY their own `ds/components/<name>.css`, their own `fixtures/<name>.html`, and their findings note — never shared files.
- Every task ends with a findings note in `docs/findings/` (copy `TEMPLATE.md`): what held, what caused friction, open questions, suggested convention changes. The prototype exists to answer §18 of direction.md — findings are a first-class deliverable.
- Tasks do not commit; the coordinator handles git.
- Do not edit `CLAUDE.md`, `docs/direction.md`, `docs/conventions.md`, or `docs/findings/TEMPLATE.md` — propose changes via findings instead.
