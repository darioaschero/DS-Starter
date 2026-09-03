# Conventions (v7 — provisional)

> **Status:** provisional prototype conventions, distilled from [direction.md](direction.md) (rev 0.2, mainly §16 plus hard rules throughout).
> v3 (2026-08-28) adopts the colour architecture agreed in [findings/color-theme-architecture.md](findings/color-theme-architecture.md): Radix-flattened light/dark ramps, active palette steps, purpose-named semantic vocabulary, shared variant recipes, resolved channels, and state-mix tokens. Implemented by task T6.
> v4 (2026-08-31) promotes the rules earned by the M2 component tasks (findings: field, disclosure, stack): native-state channel rebinding and public-vs-state precedence, focus relocation, authoritative state selection, transparent-bg derived states, finite geometry axes, layout-primitive doctrine, and relationship rules outside scope limits.
> v5 (2026-09-01) adopts the M3 derivation-synthesis proposals ([findings/m3-synthesis.md](findings/m3-synthesis.md) §6): the §5a structure/content split, font-slot extension points, the fixture-copy drift policy, and `docs/deriving.md` as the normative-adjacent derivation procedure.
> v7 (2026-09-02) lands the §12 typestyle decision into the file rules (T20): §5b is rewritten around the sm/md/lg tuples, viewport ramp, consumption-point rule, polarity, and smoothing; §11's asset rule now admits vendored self-hosted open-licensed fonts (Inter Variable 4.1 ships in `ds/fonts/`).
> v6 (2026-09-02) executes the two adopted 2026-09 API-review decisions (T19, [docs/reviews/api-review-2026-09.md](reviews/api-review-2026-09.md)): the public markup protocol is namespaced `data-ds-*` (identity, parts, axes, theme switch) with the axis-compound invariant, and state hooks name complete anatomical paths (state-reach rule; `:focus-within` reserved for intentional any-descendant aggregation).
> §12 (2026-09-01) records the M4 tight-core user decisions (perimeter, double entry, font-asset admissibility, colour-in-C4, curation workflow, M5 definition); the affected file-level rules (§1, §2, §11) are updated as each cycle lands.
> They are **binding for every task** in the current prototype, and deliberately cheap to reverse later.
> If a task needs a decision this file does not cover: pick the smallest reasonable option and record it in the task's findings note (`docs/findings/`). Do not invent architecture silently.
> On any conflict between this file and `direction.md`, this file wins for the prototype — but flag the conflict in findings.

## 1. Repository layout

```text
ds/                     starter CSS (everything ships inside named layers)
  core.css              content-only entry; sole owner of cascade-layer order
  index.css             full-system composition: core + optional in-tree modules
  reset.css             minimal reset + shared focus baseline      → layer ds.reset
  tokens/scale.css      raw non-colour scales                      → layer ds.tokens
  tokens/palette.css    colour primitives (Radix light+dark ramps)
                        + active palette steps (light-dark)        → layer ds.tokens
  tokens/semantic.css   content colour roles + dormant module dowry → layer ds.tokens
  tokens/roles.css      typography roles (+ dormant label dowry)   → layer ds.roles
  tokens/recipes.css    shared variant recipes; not part of core   → layer ds.roles
  components/rich-text.css  core semantic content adapter          → layer ds.components
  components/*.css      optional in-tree component modules         → layer ds.components
fixtures/               plain static HTML pages (no build; served statically)
fixtures/corpus/        canonical core-only bench (longform, technical, perimeter)
docs/direction.md       full direction document (rationale)
docs/conventions.md     this file (normative)
docs/deriving.md        derivation procedure (normative-adjacent: may not override this file)
docs/findings/          one note per task (copy TEMPLATE.md)
docs/tasks/             self-contained briefs for work sessions (coordinator-authored)
```

## 2. Cascade layers

- Layer order is declared exactly once, at the top of `ds/core.css`:
  `@layer ds.reset, ds.tokens, ds.roles, ds.components, ds.exceptions;`
- `core.css` imports the reset, core token files, typography roles, and rich text into their named layers via `@import "..." layer(ds.…);`. It must render standalone. Individual files never declare their own cascade position.
- `index.css` is composition only: first `@import "core.css";` (the import edge is unlayered, so the nested statement establishes order), then recipe and optional component imports assigned to `ds.roles` / `ds.components`. `index.css` never declares layer order.
- All starter CSS lives inside these layers. Never unlayered. Never `!important`.
- **Consumer contract:** ordinary unlayered application CSS must win over the starter without specificity escalation, layer knowledge, or `!important`. Fixture "chrome" styles inside fixture pages count as consumer CSS: keep them minimal and clearly marked as such.
- **Canvas ownership:** the starter never paints the application canvas — no `body` background/color/base-font rule ships in any `ds.*` layer. The page rule belongs to the consumer, written with public tokens. Fixtures demonstrate this via the canonical fixture chrome (§11).

## 3. Markup contract

- Semantic native HTML first (`<button>`, `<details>`, real heading levels…). Never recreate behavior the platform already provides.
- Component root: `data-ds-ui="<component>"`.
- Named parts: `data-ds-part="<part>"` — meaningful only within the nearest ancestor `[data-ds-ui]` boundary. Part selectors must not reach into nested components.
- Part placement contract (chosen via the card A/B containment test): parts are **direct children** of their component root; consumers wrap content *inside* a part, never around one — a wrapped part renders deliberately unstyled. Components style parts with direct-child combinators (`& > [data-ds-part="…"]`). `@scope` is not required for fixed shallow anatomy; it earns its complexity where content depth is unbounded (rich text).
- Finite configuration axes: `data-ds-<axis>="<value>"` (e.g. `data-ds-variant`, `data-ds-size`). Axis vocabulary is **per component**, not global. Each component documents (in a header comment) which axes it supports, their values, and the default.
- **Axis-compound invariant (v6):** an axis selector MUST be compounded with its component identity, directly or through native nesting (`[data-ds-ui="button"][data-ds-size="sm"]` or `&[data-ds-size="sm"]` inside the identity rule); a bare `[data-ds-size]`-style selector MUST NOT appear. Axis vocabulary stays truly component-local.
- Attributes describe discrete choices; custom properties carry styling values. Never expose primitive styling as attributes (no `data-radius="full"`, no `data-padding-x="large"`).
- A finite axis MAY control geometry when its named values express supported component-level modes decoupled from token names (`data-ds-gap="sm"` on stack: three rhythm densities that may later remap without changing markup). The forbidden form is token- or primitive-shaped markup: raw lengths, token keys (`data-ds-gap="space-4"`), physical properties, or internal composition. Arbitrary values travel through the public custom property instead.
- Component-identity layout primitives (stack) are **application-layout** boundaries: never wrap prose in them — a `[data-ds-ui]` root ends rich-text containment by design, and that is a feature, not a bug. Rich text owns the rhythm around embedded components (§9). An identity-free `data-layout` vocabulary is not introduced until a measured composition case proves rich-text rhythm cannot express the need.
- ARIA is a styling hook only when it reflects real accessible state (e.g. `[aria-expanded="true"]`). Never introduce or repurpose ARIA as a visual configuration API.
- Heading levels reflect document hierarchy, never desired visual size.

## 4. Custom-property naming

- System prefix: `--ds-`.
- Public properties (tokens, roles, component override APIs): `--ds-…`, e.g. `--ds-space-3`, `--ds-type-label-md`, `--ds-button-bg`.
- Internal channels: `--_ds-<component>-<axis>-<prop>`, e.g. `--_ds-button-variant-bg`, `--_ds-button-size-font`. Always qualified by system + component + owning axis/concern. Never generic (`--_bg`, `--_gap`) — the underscore is a convention, not privacy.
- `@property` registration only where it buys typed interpolation, explicit non-inheritance, a guaranteed initial value, or a validated public contract — always with the `--ds-` prefix. Not every token gets registered; be careful registering context-responsive semantic aliases.

## 5. Tokens

### 5a. Colour (architecture v3)

Colour resolves through this chain; each level references only the level above it:

```text
theme-specific primitive ramps
        ↓  light-dark(), in exactly one place
active palette steps
        ↓
semantic colour roles
        ↓
shared variant recipes
        ↓
component axis channels
```

1. **Colour primitives** (`tokens/palette.css`). The **structure is invariant for every profile**: three semantic families (`neutral`, `accent`, `danger`) × paired ramps `--ds-<family>-light-1..12` / `--ds-<family>-dark-1..12`, with stable step-role meanings, and swapping a family = swapping 24 values in this one file. The **base profile's content policy**: official Radix sRGB values (Slate / Blue / Red), copied verbatim with source + version attribution, never hand-tuned. **Derived profiles** may use other values and provenance while preserving the structure — provenance documented in the file header, interpolated slots annotated; procedure in [docs/deriving.md](../deriving.md). Alpha and P3 variants are out of scope.
2. **Active palette steps** (same file), under `:root { color-scheme: light dark; }`:
   `--ds-neutral-1: light-dark(var(--ds-neutral-light-1), var(--ds-neutral-dark-1));` … for every step of every family. Step N carries the **same intended role in both schemes** (Radix step convention: 1 app bg · 2 subtle bg · 3–5 component bg / hover / active · 6–8 borders · 9–10 solid + hover · 11–12 text). This is normally the ONLY place `light-dark()` appears; a semantic role may use `light-dark()` only for intentional asymmetry, justified by a comment.
3. **Semantic roles** (`tokens/semantic.css`): purpose names on the grammar `--ds-<concern>-<qualifier>`, referencing active steps. Numbered semantic names (`surface-1`, `text-1`) are retired. Core vocabulary:
   `--ds-bg-canvas`, `--ds-bg-subtle`, `--ds-text-primary`, `--ds-text-muted`, `--ds-border-subtle`, `--ds-border-default`, `--ds-link-color`, `--ds-focus-color`, `--ds-accent-subtle`, `--ds-accent-text`, `--ds-accent-solid`, `--ds-accent-on-solid`, `--ds-text-danger`, `--ds-border-danger`, `--ds-disabled-opacity`, the focus-treatment values (`--ds-focus-outline`, `--ds-focus-outline-offset`), and the state-derivation strengths `--ds-state-hover-mix` / `--ds-state-active-mix`.
   Subtree theme switch (unchanged): `[data-ds-theme="light"] { color-scheme: light; }` and the dark equivalent — schemes flip via the active steps; semantic roles and components never know which scheme is active.
4. **Shared variant recipes** (`tokens/recipes.css`, layer `ds.roles`): variants are **system concepts** with shared visual meaning across components. Initial set: `solid`, `soft`, `outline`. A recipe is a coordinated channel set `--ds-variant-<name>-bg|fg`, plus `-border` where the recipe needs one (outline does). Recipes reference semantic roles, never palette steps. Recipes ship **without** hover/pressed channels (derived-first, §7); curated state channels join a recipe only when derivation proves insufficient. Components map only the `data-ds-variant` values they support onto recipe tokens; a component-specific variant stays local and does not join the shared vocabulary.

### Palette generation — user decision, 2026-09-01

Generated palettes (the wizard's colour engine) use the **hybrid** model, decided by the user after the T15/T16 research:

- **Scales**: the vendored, pinned Radix custom-colour generator (provenance and MIT attribution in `docs/research/palette-rule/vendor/`) produces the accent and neutral ramps, light and dark, canvas-aware.
- **Safety**: every safety-facing output is decided by **this system's own gates**, not the engine's — on-solid foreground (better of `#fff`/`#111` at ≥ 4.5:1 WCAG), link step (11 → 12, ≥ 4.5:1 on canvas AND subtle, both schemes), focus step (first of 8–12 at ≥ 3:1), plus explicit warnings/diagnostics. Radix's APCA contrast token is **not** used. Semantic indices may vary per generated family (gate-driven), as demonstrated in findings/radix-generator.md.
- The combination is a named fork — "Radix colours + DS-Starter gates" — never described as "the Radix algorithm". T15's compact fitted rules are retired from the production path and remain research artifacts.
- Parked with this decision, to settle at wizard design time: canvas / per-appearance input exposure; implausible-seed UX (Radix's silent near-canvas step-9 fallback must be disclosed if kept); sRGB gamut-loss policy.

Evidence: [findings/palette-rule.md](findings/palette-rule.md), [findings/radix-generator.md](findings/radix-generator.md).

Colour rules:

- Components consume **semantic roles and recipe tokens only** — never primitives, never active steps directly. (Fixture/consumer code may reference active steps; that is consumer freedom, not starter practice.)
- `--ds-accent-on-solid` is the one semantic value not drawn from a ramp (Radix prescribes white text over Blue 9); define it literally, with a comment.
- Semantic asymmetry (`light-dark()` at the semantic level) is the exception, not the rule, and every use carries a justifying comment.

### 5b. Non-colour scales and typestyles (v7 — T20 landing)

- **Raw scales** (`tokens/scale.css`), all in `:root`, no component meaning: `--ds-space-1..8`, `--ds-radius-sm|md|lg|full`, `--ds-font-sans` (now `"Inter", system-ui, sans-serif` — vendored face, §11), `--ds-font-mono`, `--ds-font-weight-normal|medium|strong`, plus the optional `--ds-font-serif` / `--ds-font-display` slots. The legacy `--ds-font-size-1..6` scale remains in the file as **dormant module dowry** (consumed only by the legacy roles) pending a separate removal decision.
- **Typestyles** (`tokens/typestyles.css`, layer `ds.tokens`; the user-approved instance lives in §12): core typography is three complete **tuples** — `sm` (fixed) · `md` · `lg` (fluid) — each owning size (rem), line-height (rem), weight class, tracking, and optical policy. Tracking is an `em` fraction of the element's own size (the sanctioned self-relative `em`, alongside inline `code` 0.9em); sizes and line-heights stay `rem`. `font-optical-sizing: auto` is stated explicitly where tuples are consumed — longhand resets are intentional acts, never accidents of a shorthand.
- **One recorded ramp** (viewport, `37.5rem → 87.5rem`) is the sole fluid source; shipped form = per-style baseline `clamp()` expansions derived from it; the native shared-progress form (typed length division) is a commented upgrade path, not shipped CSS, until it is interoperable beyond Chromium.
- **Consumption-point rule:** every fluid formula resolves on the element that consumes the tuple (adapter/component rules) — NEVER pre-resolved on `:root`, which freezes the ramp value and prevents subtree re-pinning.
- **Polarity:** surfaces declare the inherited `--ds-polarity-wght` delta — set, never accumulate (light re-declares `0`; negative/dark declares `−20`; user decision 2026-09-02, approved **"ok per ora"** — provisional, revisitable). Tuple consumers add the delta exactly once at the weight consumption point. Numbers cannot ride `light-dark()`, so scheme wiring uses the selector + media pair.
- **Smoothing:** the root declares `-webkit-font-smoothing: antialiased` + `-moz-osx-font-smoothing: grayscale` (user decision 2026-09-02; macOS-only lever, ignored elsewhere, consumer-overridable through the layer contract).
- **Legacy typography roles** (`tokens/roles.css`): dormant module dowry — components still consume them via `index.css`; rich text consumes tuples only. No new consumer may adopt a legacy role.
- **Tuple token naming (user decision, 2026-09-03): position-based `rest|end` suffixes.** `-rest` = ramp start (≤ 37.5rem — the style *at rest*); `-end` = ramp end (≥ 87.5rem). Applied uniformly to every fluid pair and to the interval tokens (`--ds-type-ramp-rest|end`). Suffixes name the position on the ramp, never numeric ordering — chosen because tracking grows more negative along the ramp, making `min|max` ambiguous and inverting inside `clamp()`.

## 6. Component recipe pattern

Canonical shape (button is the reference implementation):

```css
[data-ds-ui="button"] {
  /* 1. Axis channel defaults — the base rule is the ONLY implementation of every default.
        Shared variants bind recipe tokens (soft is the default variant here). */
  --_ds-button-variant-bg: var(--ds-variant-soft-bg);
  --_ds-button-variant-fg: var(--ds-variant-soft-fg);
  --_ds-button-size-font: var(--ds-type-label-md);

  /* 2. Resolved channels — each override chain computed ONCE, consumed everywhere */
  --_ds-button-resolved-bg: var(--ds-button-bg, var(--_ds-button-variant-bg));
  --_ds-button-resolved-fg: var(--ds-button-fg, var(--_ds-button-variant-fg));
  background: var(--_ds-button-resolved-bg);
  color: var(--_ds-button-resolved-fg);
  font: var(--ds-button-font, var(--_ds-button-size-font));

  /* 3. Axis selectors rebind ONLY their own channels */
  &[data-ds-variant="solid"] {
    --_ds-button-variant-bg: var(--ds-variant-solid-bg);
    --_ds-button-variant-fg: var(--ds-variant-solid-fg);
  }
  &[data-ds-size="sm"] {
    --_ds-button-size-font: var(--ds-type-label-sm);
  }

  /* 4. Named default value = no-op vocabulary marker, no rebind */
  &[data-ds-size="md"] {
    /* Default vocabulary marker. No channel rebind. */
  }

  /* 5. States consume resolved channels only — never restate a chain */
  &:hover:not(:disabled) {
    background: color-mix(in oklch,
      var(--_ds-button-resolved-bg),
      var(--_ds-button-resolved-fg) var(--ds-state-hover-mix));
  }
}
```

Hard rules:

- One axis never touches another axis's channels.
- Axis selectors never write the public property (e.g. `--ds-button-bg`) — that bypasses the override chain.
- No combination-matrix selectors (`[data-ds-variant=…][data-ds-size=…]` recipes) unless a real cross-axis interaction exists and is documented in findings.
- The component renders correctly with no axis attributes at all, and degrades gracefully on unsupported values (the base rule wins). Graceful fallback is not validation — a future linter reports bad vocabulary.
- Defaults are implemented **only** in the base rule; a named-default selector exists only as a commented no-op marker.
- Non-default axis values rebind **every** channel their axis owns, even when one value coincides with the base default (explicit completeness: each named value reads as a complete recipe, and the invariant is lintable). Only the default is implemented solely by the base rule.
- Public override properties are inherited **context** overrides: set on an ancestor, they retheme the whole subtree — including nested instances of the same component. This is by design (subtree theming); never register them `inherits: false` without a documented reason.
- **Resolved channels are the standard idiom**: any override chain consumed by more than one declaration is precomputed once in the base rule (`--_ds-<component>-resolved-<prop>`); base and state rules reference only the resolved channel. State rules never restate a public/axis chain (lintable). A chain consumed exactly once (stack's gap) needs no resolved channel — that is the stated boundary, not an exception.
- Where a shared variant exists (`solid`/`soft`/`outline`), the variant selector binds its channels to the recipe tokens (`--ds-variant-<name>-*`), never directly to palette steps. A component-specific variant may bind semantic roles directly.
- **Native-state selectors are first-class rebinding sites**, exactly like axis selectors: `:focus-within`, `:has(input:user-invalid)`, `[open]`, … rebind component-qualified state/frame channels (never another concern's channels), in explicit precedence order — later source wins at equal specificity (field: invalid after focus). Rendered declarations keep consuming resolved channels only.
- **Public overrides beat state rebinds by construction** (the resolved chain reads the public property first). This is the documented default: a consumer override is final, and state feedback must survive through other cues (label colour, message, focus ring — as in field). If state-proof colour is ever required, add explicit public state properties (`--ds-<component>-invalid-border-color`) — never silently invert precedence.
- Expose public override properties (`--ds-<component>-bg|fg|font|padding-x|…`) for the obvious knobs. Whether *every* component needs them is deliberately open — record reasoning in findings.

## 7. State

- Prefer native state: `:disabled`, `:hover`, `:active`, `:focus-visible`, `:focus-within`, `:has(input:user-invalid)`, `[open]`.
- ARIA state selectors (e.g. `[aria-expanded="true"]`) only where they mirror real component state.
- CSS styles state; it never creates behavior.
- Interaction-state colour resolves **curated → recipe → derived**, threaded through axis channels so state rules stay variant-agnostic. The derived floor is the canonical recipe `color-mix(in oklch, <resolved-bg>, <resolved-fg> var(--ds-state-hover-mix | --ds-state-active-mix))` — mixing toward the resolved fg keeps the shade direction correct in both schemes and under any public override. Recipes gain curated state channels only when derivation proves insufficient (record the evidence in findings; the measured candidate is solid hover in light — see findings/color-architecture.md). Per-surface hover aliases (`--ds-accent-subtle-hover`, …) are forbidden — they escape the override chain.
- A **transparent resolved bg** makes the derived state a semi-transparent fg tint compositing over the backdrop (disclosure trigger: 8% fg alpha). This is intentional and backdrop-aware, not an accident — but the result depends on the backdrop, so review it over every supported surface; bind an opaque semantic surface as the resting bg only when overlay behavior is undesirable.
- **Select the authoritative state the behavior already owns**: `[open]` for native `<details>`; `[aria-expanded]` only for a JS-driven trigger whose controller synchronizes it. Never mirror either into `data-ds-state` — configuration attributes do not duplicate behavioral or accessible state.
- **State reach is anatomical (v6, T19):** a state hook MUST name the complete anatomical path from the component root to its authoritative state source — `&:has(> [data-ds-part="control"] > :is(input, textarea):user-invalid)`, never a bare descendant observation (`&:has(input:user-invalid)`), which lets a nested component's control drive the outer component's state. `:focus-within` is reserved for a component whose specified behavior intentionally aggregates focus from **any** descendant, nested components included; it is never shorthand for a known control part.

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
- **Relocation is permitted, removal is not**: a component may suppress a descendant's baseline `:focus-visible` outline only when it re-expresses the same shared focus treatment, under the same `:focus-visible` condition, on the part that owns the visible interactive frame (field relocates the ring from the bare input to its control frame via the anatomical path `:has(> [data-ds-part="control"] > :is(input, textarea):focus-visible)` — §7 state-reach rule). Relocation must never make focus indication pointer-only or absent. Note: `:focus-visible` matching follows the browser's heuristic — programmatic `focus()` may not match; verify with real keyboard input.
- Focus visibility is a system responsibility; a component is not "done" without it.

## 9. Rich-text containment

- Prose styling uses `@scope ([data-ds-ui="rich-text"]) to (:scope [data-ds-ui]) { … }` — any nested `[data-ds-ui]` is a lower boundary.
- `@scope` limits selector reach only; it does **not** stop inheritance. Do not set typography on the rich-text root; map roles onto semantic elements inside the scope.
- Block elements get complete `font` roles; inline elements (`strong`, `em`, `code`, `a`) only modify the current context (weight, style, family, `0.9em` size, link color/underline) — never a full body role.
- Composition fixtures must test both failure modes separately: selector bleed AND inherited-value bleed.
- When to use `@scope` (rule distilled from the card and rich-text tests): **mandatory** wherever a component styles elements it does not mark (unmarked semantic descendants at arbitrary depth — rich text); optional and normally omitted where a component styles only its root and its direct-child marked parts (§3).
- Scoping limits are exclusive: the boundary element itself (`:scope [data-ds-ui]`) is already outside the donut — scoped rules cannot style even the nested component's root.
- An element deliberately excluded from scoped styling falls back to **UA** rules, not to the nearest role — neutralize where it matters (e.g. `:where(pre > code) { font: inherit; }`).
- Because the scope limit excludes the boundary root, a semantic adapter that owns a **relationship around** an embedded component expresses it as a separate direct-child rule OUTSIDE its bounded `@scope` block. Canonical case: rich text owns embedded-component leading rhythm at content level — `[data-ds-ui="rich-text"] > :where(* + [data-ds-ui]) { margin-block-start: var(--ds-space-4); }` (the trailing direction is already covered by the `* + <prose>` rhythm subjects).

## 10. Browser baseline

Evergreen browsers, 2025+: native nesting, cascade layers, `@scope`, `light-dark()`, `color-scheme`, `:user-invalid`, `:has()`, `:focus-visible`. No fallbacks for older engines in this prototype.

## 11. Process rules (for tasks/agents)

- No build tools, no npm, no external/CDN assets or libraries at runtime. **Vendored, self-hosted, open-licensed font assets are permitted in `ds/fonts/`** when the exact upstream release, license, byte size, and sha256 are recorded beside the asset (current: Inter Variable 4.1, SIL OFL, rigorous `system-ui, sans-serif` fallback). Fixtures must work served statically (`python3 -m http.server` from the repo root).
- Canonical fixture chrome: each fixture page has exactly ONE inline `<style>` block, commented `/* fixture chrome — unlayered consumer CSS */`, containing only the consumer page rule `body { background: var(--ds-bg-canvas); color: var(--ds-text-primary); font: var(--ds-type-body-md); }` plus a minimal page frame (max-width, margin auto, padding). All other fixture presentation uses inline `style` attributes on specimen wrappers — never a second `<style>` block.
- The three pages in `fixtures/corpus/` are permanent core-only batteries: they load `../../ds/core.css`, use canonical fixture chrome, and may not import optional component CSS or add fixture rules that patch uncovered elements.
- Fixture/research scheme toggles set exactly `data-ds-theme`. Research-local hooks must not collide with protocol attribute names (exact-match boundary; substring lookalikes such as `data-theme-set` are outside the protocol and stay legal).
- `ds/index.css` already imports every component file. Component tasks edit ONLY their own `ds/components/<name>.css`, their own `fixtures/<name>.html`, and their findings note — never shared files.
- Every task ends with a findings note in `docs/findings/` (copy `TEMPLATE.md`): what held, what caused friction, open questions, suggested convention changes. The prototype exists to answer §18 of direction.md — findings are a first-class deliverable.
- **Design curation belongs to the user.** Research and design tasks deliver *options with rendered specimen pages* for the user to judge — never final design choices. Decisions are made by the user at coordinator checkpoints, and this file records them as the user's. Mechanical and measured work is delegated; taste is not.
- **Fixture-copy drift policy** (from the M3 derivations): fixture prose must not hard-code profile content — family names ("Radix Slate") or numeric token claims ("400 / 1.5") — outside explicitly base-profile-only specimens; prefer token-neutral labels. During a frozen derivation battery, stale profile copy is recorded as expected evidence, never "fixed" by editing frozen fixtures.
- `docs/deriving.md` is the supported operational procedure for derivations (normative-adjacent). It may not override this file; update it when a verified derivation changes the safe sequence or gates.
- Tasks do not commit; the coordinator handles git.
- Do not edit `CLAUDE.md`, `docs/direction.md`, `docs/conventions.md`, or `docs/findings/TEMPLATE.md` — propose changes via findings instead.

## 12. Core curation (M4) — user decisions, 2026-09-01

Defined with the user at the M4 coordinator checkpoint. This block is the authoritative record; the affected file-level rules (§1, §2, §11) are rewritten as each cycle lands, not before.

- **Tight-core perimeter (file granularity).** The content-only core is: `reset.css` (+ focus baseline), `tokens/scale.css`, `tokens/palette.css` (3-family §5a structure intact, danger included), `tokens/semantic.css`, `tokens/roles.css`, `components/rich-text.css` (to be extended toward full content coverage across the cycles). The five components, `tokens/recipes.css`, and component-facing tokens stay **dormant in-tree** as module dowry; token-level splitting of `semantic.css`/`roles.css` is deferred to module extraction. The judgment calls (do `--ds-accent-subtle`/`--ds-accent-text` serve content? do label roles stay core or ship with the actions module? where do danger semantic roles sleep?) were delivered as T18 options; at the 2026-09-01 checkpoint the user left all three **open** — the core-vs-dowry filing is superseded by the colour-context study (see CLAUDE.md status: colour as overridable context palettes) and by the role-naming review in C1/C2. Nothing moves at file granularity meanwhile.
- **Double entry (implemented by T18).** A new `ds/core.css` becomes the sole owner of the cascade-layer declaration (including `ds.components` / `ds.exceptions` placeholders so modules slot in later) and imports only core files; `ds/index.css` composes `core.css` plus the component imports. The core must load and render standalone. §2 wording updates when T18 lands.
- **Font assets.** Vendored, self-hosted, open-licensed font files are **admissible as curation options**: zero network at runtime, licenses and provenance documented in-repo, rigorous fallback stacks mandatory. Adopting an actual typeface is a user decision in C1; §11's asset rule is amended when that decision lands. External/CDN assets remain forbidden.
- **Colour identity.** Decided in C4 by rendered comparison: the current Radix-verbatim base vs 2–3 custom-seed palettes generated by the decided hybrid engine (§5a). No colour change before C4.
- **Curation workflow (process, binding for M4 tasks).** Coordinator brief → specimen task renders **2–4 labelled option bundles** (each a coherent, named intent — never isolated knobs) on the canonical corpus, both schemes plus a narrow viewport, via root-level overrides with **zero `ds/` edits** → the user decides at a coordinator checkpoint (mixes allowed) → a small landing task writes the decided values plus findings → the coordinator commits and records the decision here. Design curation stays the user's (§11).
- **Cycles.** C0 perimeter + corpus + core entry (T18) · C1 typographic voice · C2 type scale / leading / measure · C3 prose rhythm · C4 colour identity + link/focus treatment · C5 extended element coverage · C6 finishing details. Order adjustable; C1/C2 may interleave.
- **M5 — expressiveness testing.** Curated **composition batteries**: additional content patterns/elements composed *only* from core scales, with measured consumer CSS and no new tokens, to probe the expressive range of the typographic and spacing scales. Identity derivations and docs dogfooding are parked for M5, not adopted.
- **Typestyles — user-approved 2026-09-02** (supersedes the §5b type scale/roles for the core; §5b/§11 file rules update when the set lands in `ds/`). Face: **Inter** (InterVariable 4.1, vendored with pinned provenance, SIL OFL; "for now"). Judge base, part of the decision: **opsz auto** and **`-webkit-font-smoothing: antialiased` + `-moz-osx-font-smoothing: grayscale` global** (macOS-only lever; converges with Android/iOS native rendering). Three styles as complete tuples (size, lh, weight-class, tracking); generation rule: one constant ratio per family, lh on the 4px grid, size derived from lh — text `size = 0.7 × lh` (r = 10/7), lg `size = lh / 1.2` (r = 6/5):
  - **sm** 14/20 fixed — book (400/500) tracking **−0.75%**, semibold (600) **−0.5%**
  - **md** 16.8/24 → fluid 19.6/28 — book **−1.25% → −1.75%**, semibold **−0.75% → −1.25%**
  - **lg** 26.667/32 → fluid 30/36 — weight **normal (400)**, tracking **−0.4% → −0.9%**
  Tracking is written as `em` on `letter-spacing` (fraction of own size — self-relative; `em` remains banned for style identity, which stays rem tuples). Tracking values are **curated per style** (no uniform weight-class formula; the Figma-era −0.5pp class rule is retired); the fluid tightening is a uniform **−0.5pp along the ramp** for every fluid style. Fluid model: ONE shared progress (0→1 over a width interval — **interval still open**), per-style rem spans; formulas resolve **at the consumption point** (element-level; pre-resolved `:root` tokens would freeze the progress and kill subtree re-pinning). Polarity: surfaces **declare** a context weight delta (set, never accumulate; positive surfaces re-declare 0); **decided delta −20** on negative surfaces, consumed additively where styles resolve weight. Evidence and live bench: `docs/research/typestyles/specimen.html` (+ vendored Inter under `vendor/inter/`).
  **Landing gates — CLOSED (user, 2026-09-02):** (1) the ramp runs on the **viewport**, from **600px to 1400px** (recorded and implemented as 37.5rem → 87.5rem: equivalent at the 16px default root, and zoom-coherent — the interval scales with the user's text preference); (2) rich-text mapping: **h1 and h2 → lg normal** (h1/h2 hierarchy is expressed by rhythm and structure, not size), **h3 → md semibold** (h4–h6 grouped with h3, mirroring the previous h3–h6 grouping — coordinator assumption, user may veto), **strong → semibold** (weight 600 + the containing style's semibold tracking where defined, i.e. md-semi in prose flow). Landing brief: T20.
- **Deferred.** T17's 10 scale-generation decisions remain deferred; the refined core becomes the fitted instance that later parametrization must reproduce.
