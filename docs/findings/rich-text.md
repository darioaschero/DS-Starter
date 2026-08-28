# Findings — T4 Rich text

> Task: rich-text component — semantic prose → typography roles, reference implementation of `@scope` containment.
> Date: 2026-08-28
> Files touched: ds/components/rich-text.css, fixtures/rich-text.html, docs/findings/rich-text.md

## What was built

- `ds/components/rich-text.css`: one `@scope ([data-ui="rich-text"]) to (:scope [data-ui])` block containing everything — block roles (h1 → heading-lg, h2 → heading-md, h3–h6 → heading-sm, p/li/dd/dt/blockquote/td/th → body-md, each `public override → role`), inline semantics (strong/em/a/inline code), sibling-based prose rhythm from space tokens, and box styling for lists, blockquote, pre, hr, table. **No rule on the root at all** — not even box properties turned out to be needed, which makes the inheritance claim easy to audit: nothing inheritable can originate at the boundary because no declaration exists there.
- `fixtures/rich-text.html`: canonical §11 chrome; full prose specimen; a nested `data-ui="probe"` section inside the article and an identical control probe outside; an h2 mixing `strong`/`code`; a second article overriding `--ds-rich-text-h2-font` via inline style; a visible note stating what crosses the boundary.
- Verified in Chromium (served statically on :8023), light and dark.

### Verification evidence (computed styles, both schemes)

- **Decisive probe comparison** — nested vs control probe h2: `24px / 700 / 36px / margin-block-start 0px / color text-1` — *identical in both schemes* (dark: `oklch(0.99 0.002 260)`, light: `oklch(0.21 0.01 260)`); same for the probe p, the `data-part="label"` span, and the probe link (UA `rgb(0,0,238)` light / `rgb(158,158,255)` dark, `text-decoration-thickness/offset: auto` — no `--ds-link-color`, no thickness/offset tweaks). Prose links, for contrast, computed to `--ds-link-color` (accent-11 light / accent-7 dark) with `1.28px / 2.4px` decoration metrics. So: no selector bleed AND no inherited-value contribution.
- **Root adds nothing**: the article's computed font-size/weight/line-height/family/color equal its parent's exactly.
- **Inline-inside-heading**: h2 = `23px / 28.75px / 600`; its `strong` = `23px / 28.75px / 600` (metrics preserved — this is why inline rules never carry a full role); its `code` = `20.7px` (0.9 × 23) in the mono stack.
- **Public override**: `--ds-rich-text-h2-font: var(--ds-type-heading-lg)` on an instance root → that h2 computes 28px while the sibling p stays body-md.

## Conventions that held

- **`@scope … to (:scope [data-ui])` did everything asked of it.** One block covered the whole component; no selector needed to exist outside it; the donut boundary needed no per-rule discipline — write `:where(p)` and forget about nested components. This is dramatically better ergonomics than suffixing every rule with `:not([data-ui] *)`-style guards.
- **Zero specificity is real**: `:where()` everywhere plus a specificity-free `@scope` prelude (no `:scope` in any subject). Within-file ordering resolved the two intentional overlaps (heading-adjacent rhythm; `th` re-bolding over its body role) — "same specificity, later source wins" is a workable idiom but worth a comment each time.
- **Font-only roles + inline modifiers compose exactly as designed** — the in-heading `strong`/`code` evidence above is the proof the doctrine wanted.
- **`rem` roles stayed stable under nesting** (nested list items compute 16px at every depth).
- The §11 canonical chrome demonstrates the intended split: the *page* owns canvas color/font; unmapped elements inside the article visibly inherit page styling through the (styleless) root.

## Friction / surprises

- **UA stylesheets are the second cascade you must design against.** Excluding `pre > code` from the inline-code rule (to avoid double-shrink) meant *no author rule* matched it — so the UA's `code { font-family: monospace }` won and replaced the pre's `--ds-font-mono` stack (computed family was literally `monospace`). Fix: `:where(pre > code) { font: inherit; }` — adopt the context exactly once, neutralizing the UA family swap and its size quirk. General lesson for scoped "semantic adapter" components: an element you deliberately *don't* style falls back to UA rules, not to your nearest block role.
- **Scoping limits are exclusive of the boundary element itself** (tested empirically with an injected scoped rule targeting `section`): the nested `[data-ui]` root did **not** receive scoped custom properties — `getComputedStyle(probe).getPropertyValue('--scope-limit-probe')` stayed empty. Good news: rich-text cannot restyle even the *root* of an embedded component, so the donut hole starts at the boundary element, not below it.
- **Prose rhythm can't use `* + *` safely here.** Because custom elements and nested component roots are also siblings in the flow, the rhythm subjects had to be an explicit list of prose elements (`* + p, * + ul, …`). That list is a maintenance surface: a newly supported block element must be added in up to three places (role rule, rhythm rule, maybe the heading-adjacent rule).
- **`pre` is the one block with no complete role** (spec'd as mono-family-only), so its size/line-height inherit across the boundary — the only context-dependent typography in the component. Fine on the canonical page chrome; would compound inside a container that establishes a different font context.
- **Fixture-chrome drift**: the T1-era fixture stubs carry a chrome block with only frame properties; conventions §11 canonicalizes chrome as `background/color/font` + frame. This fixture implements §11; the older fixtures should be reconciled by the coordinator (not touched here).
- Minor vocabulary gaps chosen minimally and documented in code: blockquote bar `3px`, hr/table rules `1px` (no border-width tokens exist); table got collapse + row rules + `th` start-alignment since a completely UA table inside styled prose reads as broken.

## Open questions raised

- Should a `--ds-type-code-md` role exist so `pre` (and maybe inline code) get stable typography instead of inherited size? If yes, `--ds-rich-text-pre-font` joins the public API.
- Does `--ds-rich-text-body-font` covering seven elements (including td/th) stay one knob, or do tables eventually deserve their own override?
- Nested rich-text inside rich-text: each root starts its own scope, and outer `--ds-rich-text-*` values *inherit into* the inner instance (custom properties cross boundaries even though selectors don't). Plausibly desirable ("theming flows down"), but it is the one way one rich-text instance can affect another; worth a composition-fixture case.
- Scope proximity (inner scope beats outer at equal specificity) went unexercised — relevant once any second scoped component exists.

## Suggested convention changes (if any)

- §9: add the two operational lessons: (a) scoping limits are exclusive — the boundary element itself is already outside the donut; (b) elements deliberately excluded from scoped styling fall back to *UA* rules — neutralize with `font: inherit`-style adoptions where that matters.
- §5/§9: decide where prose rhythm belongs. Recommendation: **keep it per-component.** Margins are layout, roles are font-only by invariant, and the sibling-margin idiom is intrinsically contextual; promoting "prose gap" tokens beyond the existing space scale bought nothing here.
- Public-API shape: the four font overrides mirror direction §13 exactly and felt right-sized — headings that share a role share an override. Keep "override per *role mapping*, not per element" as the stated rule.
- Input for deferred decision "is `@scope` required outside rich text": rich text needs it because it styles **unmarked semantic descendants** at arbitrary depth — there is no attribute to select on, so only a scoped donut can express "all prose until the next component". Components that style only their root and `data-part` children don't need `@scope` for correctness (parts are explicitly marked, and `[data-ui="x"] > [data-part="y"]`-style selection is already boundary-safe); for them `@scope` would be defense-in-depth against deep-descendant part selectors. Proposed rule: **`@scope` is mandatory wherever a component styles elements it does not mark; optional (and probably omitted) elsewhere.**
