# Findings — T18 core perimeter

> Task: C0 physical core boundary, double entry, canonical content corpus, and perimeter options.
> Date: 2026-09-01
> Files touched: `ds/core.css`, `ds/index.css`, `fixtures/corpus/longform.html`, `fixtures/corpus/technical.html`, `fixtures/corpus/perimeter.html`, `fixtures/index.html`, `docs/findings/core-perimeter.md`

## 1. Entry split and regression proof

`ds/core.css` is now the sole owner of the canonical declaration
`@layer ds.reset, ds.tokens, ds.roles, ds.components, ds.exceptions;`. It imports, in order,
reset, scale, palette, semantic roles, typography roles, and rich text. `ds/index.css` contains only
the unlayered `@import "core.css";` composition edge followed by the existing recipes and five
optional component imports in their previous relative order. The import edge is unlayered; every
declaration reached through it remains inside the named layer assigned by `core.css`.

`tokens/recipes.css` is deliberately absent from core. Mechanical grep found zero `variant-` or
`tokens/recipes` references in `components/rich-text.css`; standalone computed checks also resolved
all rich-text declarations without recipe tokens.

### Regression battery identity

Before the split, a browser baseline captured 38 composition nodes × 20 computed properties plus
the body, and 13 consumer-override nodes × 8 computed properties. After the split, a cache-busted
pass compared the same matrices exactly in the host scheme; paired light/dark subtree specimens
then exercised scheme resolution across the component fixtures:

| Battery | Result |
|---|---|
| `fixtures/composition.html` through `index.css` | Exact computed-style identity; containment, rhythm, six component presentations, field/disclosure states, and stack gap unchanged |
| `fixtures/consumer-override.html` through `index.css` | Exact identity for all five cases; unlayered consumer CSS still wins |
| Component fixture spot checks | Button, card, field, rich text, stack, and disclosure each retained their defining computed presentation in light and dark |
| Frozen `ds/` payload | SHA-256 identity for reset, all token files, and all six component files; only the two entry files differ in `git diff` |

### Standalone-core battery

| Check | Result |
|---|---|
| Longform, technical, perimeter × light/dark | 6/6 cache-busted passes; `color-scheme`, canvas/text colours, body/headings/inline code and available table/blockquote styles all resolved correctly |
| Physical dependency | Each page has one stylesheet link, `../../ds/core.css`; one `[data-ui="rich-text"]`; no optional component identity; perimeter rendered all 157 token rows |
| Keyboard focus | A real Tab key event produced `:focus-visible` on a corpus link with a computed 2px solid focus outline and 2px offset |
| Narrow 375px | Long heading wrapped; `pre` scrolled internally; both corpus tables exposed the missing table-overflow owner without fixture patches |

The browser evidence was collected from a dedicated server on port 8060 with a fresh cache-busting
query before each computed-style pass. All corpus requests were 200/304 and every inspected console
was clean. The browser's first legacy composition load made one implicit `/favicon.ico` request
(404); no corpus page produced a 404. The server was stopped after the battery.

## 2. Full perimeter classification

Method: enumerate every root declaration in `scale.css`, `palette.css`, `semantic.css`, and
`roles.css` (157 total), then grep `var(--ds-…)` consumers in the core leaves (`reset.css` and
`rich-text.css`) versus module leaves (`recipes.css`, button, card, field, stack, disclosure).
Palette and scale dependencies are traced to their ultimate leaf consumer rather than counting their
own forwarding declaration as content use. Corpus chrome counts as content consumption for canvas,
primary text, and the body role. Brace/range notation below expands to every individual token; the
reconciliation is 23 scale + 72 primitive palette + 36 active palette + 20 semantic + 6 type roles
= **157**, with none omitted.

Classification meanings:

- **Core** — current content or canonical content chrome consumes it.
- **Dormant dowry** — no current content leaf consumes it; a module consumes it or it remains unused
  scale/ramp capacity carried at file granularity.
- **Shared infrastructure** — scheme switching or the cross-system focus treatment consumes it.

### Root tokens and roles

| Token(s) | Class | Mechanical consumer evidence |
|---|---|---|
| `--ds-space-1` | Core | rich-text list-item rhythm; field also consumes it |
| `--ds-space-2` | Core | rich-text heading adjacency and table cells; button/card/field/stack also consume it |
| `--ds-space-3` | Core | rich-text definition rhythm and `pre` padding; components also consume it |
| `--ds-space-4` | Core | rich-text flow, blockquote, and embedded-boundary rhythm; modules also consume it |
| `--ds-space-5` | Core | rich-text list/definition indents and table cells; button/card also consume it |
| `--ds-space-6` | Core | rich-text section-opening rhythm; card/stack also consume it |
| `--ds-space-7`, `--ds-space-8` | Dormant dowry | no `ds/` leaf consumer; retained raw-scale capacity (fixtures use both as consumer CSS) |
| `--ds-font-size-1` | Dormant dowry | forwarded only into `--ds-type-label-sm` → button |
| `--ds-font-size-2` | Core | body role → prose/chrome; label-md also uses it |
| `--ds-font-size-3` | Core | heading-sm → prose; card also consumes the role |
| `--ds-font-size-4` | Core | heading-md → prose; large card also consumes the role |
| `--ds-font-size-5` | Core | heading-lg → prose |
| `--ds-font-size-6` | Dormant dowry | no `ds/` leaf consumer |
| `--ds-radius-sm`, `--ds-radius-md` | Core | inline-code and `pre` treatments; field also consumes md |
| `--ds-radius-lg`, `--ds-radius-full` | Dormant dowry | card and button only |
| `--ds-font-sans` | Core | body and heading roles; label roles also forward it |
| `--ds-font-mono` | Core | inline code and `pre` |
| `--ds-font-weight-normal` | Core | body role |
| `--ds-font-weight-medium` | Dormant dowry | label roles only → actions/field/disclosure modules; USER DECISION 2 controls the role ownership record |
| `--ds-font-weight-strong` | Core | headings, prose `strong`, and table headers; disclosure also consumes it |
| `--ds-neutral-light-{1,2,6,11,12}`, `--ds-neutral-dark-{1,2,6,11,12}` | Core | primitive → active step → canvas/subtle/border/muted/primary content roles |
| `--ds-neutral-light-{3,7}`, `--ds-neutral-dark-{3,7}` | Dormant dowry | primitive → active step → component background or outline-recipe border |
| `--ds-neutral-light-{4,5,8,9,10}`, `--ds-neutral-dark-{4,5,8,9,10}` | Dormant dowry | no current semantic or leaf consumer; retained 12-step family capacity |
| `--ds-accent-light-8`, `--ds-accent-dark-8` | Shared infrastructure | primitive → active step → focus treatment |
| `--ds-accent-light-11`, `--ds-accent-dark-11` | Core | primitive → active step → prose link; accent-text also aliases the step |
| `--ds-accent-light-{1–7,9–10,12}` except `8`, `--ds-accent-dark-{1–7,9–10,12}` except `8` | Dormant dowry | step 3/9 feed action recipes; the remaining steps have no leaf consumer |
| `--ds-danger-light-{1–12}`, `--ds-danger-dark-{1–12}` | Dormant dowry | steps 8/11 feed field validation; all others are retained family capacity; USER DECISION 3 controls the semantic-role ownership record |
| `--ds-neutral-{1,2,6,11,12}` | Core | canvas, subtle, border-subtle, muted, and primary content chains |
| `--ds-neutral-{3,7}` | Dormant dowry | disclosure component background and outline recipe only |
| `--ds-neutral-{4,5,8,9,10}` | Dormant dowry | no semantic or leaf consumer |
| `--ds-accent-8` | Shared infrastructure | `--ds-focus-color` |
| `--ds-accent-11` | Core | `--ds-link-color` (and dormant `--ds-accent-text`) |
| `--ds-accent-{1–7,9–10,12}` except `8` | Dormant dowry | steps 3/9 feed action semantics; remaining steps unconsumed |
| `--ds-danger-{1–12}` | Dormant dowry | steps 8/11 feed field validation; remaining steps unconsumed |
| `--ds-bg-canvas` | Core | canonical content canvas |
| `--ds-bg-subtle` | Core | inline code and `pre`; card also consumes it |
| `--ds-bg-component` | Dormant dowry | disclosure content only |
| `--ds-text-primary` | Core | canonical content chrome; field/disclosure/outline recipe also consume it |
| `--ds-text-muted` | Core | blockquote; field/disclosure also consume it |
| `--ds-border-subtle` | Core | blockquote, `hr`, and table rules; card/disclosure also consume it |
| `--ds-border-default` | Dormant dowry | outline recipe only |
| `--ds-link-color` | Core | prose anchors |
| `--ds-focus-color`, `--ds-focus-outline`, `--ds-focus-outline-offset` | Shared infrastructure | reset focus baseline; field relocates the same treatment |
| `--ds-accent-subtle`, `--ds-accent-text` | Dormant dowry | soft recipe only; USER DECISION 1 asks whether future content reserves them |
| `--ds-accent-solid`, `--ds-accent-on-solid` | Dormant dowry | solid recipe only |
| `--ds-text-danger`, `--ds-border-danger` | Dormant dowry | field validation only; USER DECISION 3 controls the future ownership record |
| `--ds-disabled-opacity` | Dormant dowry | button and field only |
| `--ds-state-hover-mix`, `--ds-state-active-mix` | Dormant dowry | component interaction states only |
| `--ds-type-body-md` | Core | prose body mapping and canonical chrome; components also consume it |
| `--ds-type-heading-sm`, `--ds-type-heading-md`, `--ds-type-heading-lg` | Core | prose h3–h6, h2, and h1 mappings; cards also consume sm/md |
| `--ds-type-label-sm`, `--ds-type-label-md` | Dormant dowry | button/field/disclosure only; USER DECISION 2 controls the future ownership record |

### Every rule exposed by `core.css`

| File / selector or statement | Class | Why |
|---|---|---|
| `core.css` canonical `@layer` statement | Shared infrastructure | establishes one order for core and composed entry, including module placeholders |
| `core.css` six layered imports | Core | physical content perimeter |
| `reset.css`: `*, *::before, *::after` box sizing | Core | content geometry baseline |
| `reset.css`: `*` zero margin | Core | content rhythm is rebuilt explicitly |
| `reset.css`: `body` line-height | Core | readable inheritance before a role maps an element |
| `reset.css`: `img, picture, video, canvas, svg` | Core | responsive media baseline used by both corpus figures |
| `reset.css`: `input, button, textarea, select` | Core | native-content/form inheritance; the task-list inputs exercise the boundary, and modules reuse it |
| `reset.css`: `:where(:focus-visible)` | Shared infrastructure | cross-system keyboard focus baseline |
| `palette.css`: `:root` primitives, active steps, `color-scheme` | Mixed; token rows above + shared scheme infrastructure | keeps the invariant three-family physical file |
| `semantic.css`: `:root` semantic values | Mixed; token rows above | file-granularity core with module dowry |
| `semantic.css`: `[data-theme="light"]` | Shared infrastructure | supported subtree scheme switch |
| `semantic.css`: `[data-theme="dark"]` | Shared infrastructure | supported subtree scheme switch |
| `roles.css`: `:root` font shorthands | Mixed; role rows above | content roles plus label-role dowry |
| rich text `h1` | Core | heading-lg mapping |
| rich text `h2` | Core | heading-md mapping |
| rich text `h3, h4, h5, h6` | Core | heading-sm mapping |
| rich text `p, li, dd, dt, blockquote, td, th` | Core | body mapping |
| rich text `strong` | Core | contextual strong weight |
| rich text `em` | Core | contextual italic style |
| rich text `a` | Core | link colour and decoration treatment |
| rich text `:not(pre) > code` | Core | inline-code mono, tint, padding, and radius |
| rich text `* + p/ul/ol/dl/blockquote/pre/table/hr` | Core | normal prose flow rhythm |
| rich text `* + h1…h6` | Core | section-opening rhythm |
| rich text heading `+ p/ul/ol/dl/blockquote/pre/table` | Core | close heading adjacency |
| rich text `li + li` | Core | list-item rhythm |
| rich text `dd + dt` | Core | definition-group rhythm |
| rich text `ul, ol` | Core | list indent |
| rich text `dd` | Core | definition indent |
| rich text `blockquote` | Core | border, indent, muted text |
| rich text `pre` | Core | mono family, surface, padding, radius, horizontal overflow |
| rich text `pre > code` | Core | inherits `pre` font and neutralizes UA code font |
| rich text `hr` | Core | subtle logical rule |
| rich text `table` | Core | border collapse |
| rich text `th, td` | Core | cell spacing and row rules |
| rich text `th` | Core | strong weight and start alignment |
| `[data-ui="rich-text"] > :where(* + [data-ui])` | Dormant dowry | relationship for optional embedded components; no core-only corpus component consumes it |

## 3. USER DECISIONS — options only, not implemented

All options are rendered on `fixtures/corpus/perimeter.html`. No option changes a token or rule in
this task.

### USER DECISION 1 — accent beyond link and focus

- **A — reserve for content.** Keep `--ds-accent-subtle` / `--ds-accent-text` in the core vocabulary
  for future `mark`, selection tint, editorial callouts, or measured C4/C6 material.
- **B — actions-module dowry.** Record both as action vocabulary; content keeps link/focus accent
  roles until a corpus case proves another need.

Consequence: A makes quiet accent emphasis a named content affordance; B keeps the semantic content
surface tighter and may add the roles back later.

### USER DECISION 2 — label roles

- **A — keep in core.** Leave `--ds-type-label-sm|md` in `roles.css` as harmless general vocabulary.
- **B — actions-module dowry.** Record them for movement only when the actions module is physically
  extracted.

Consequence: no current visual difference; A favors a broader type vocabulary, B makes the eventual
module boundary semantically sharper.

### USER DECISION 3 — danger semantic roles

- **A — sleep in core.** Leave `--ds-text-danger` / `--ds-border-danger` available for future content
  warnings and destructive meaning.
- **B — field-module dowry.** Record them as validation vocabulary and move them with the future
  field module.

Consequence: A gives core prose immediate danger semantics; B avoids reserving a meaning not yet
demonstrated by content.

## 4. Canonical corpus gap inventory

Coverage was judged from cache-busted computed styles, not selector reading. “Covered” means the
element receives a deliberate core treatment beyond reset/inheritance; “partial” calls out a real
core behavior with an unresolved semantic or layout dimension.

| Corpus element / concern | Covered by core today — computed evidence | Proposed owner |
|---|---|---|
| h1–h4 | Yes — 28/23/19/19px role mapping, 600 weight, explicit leading; section rhythm computes 32px | C1–C3 curation of existing roles/rhythm |
| paragraphs and list/definition text | Yes — 16px/24px/400 body role | C1–C3 curation |
| strong / em | Yes — contextual 600 weight / italic without replacing the surrounding role | C1 typographic voice |
| flow links | Yes — active accent colour plus 0.08em thickness and 0.15em offset; keyboard outline visible | C4 treatment review |
| inline code | Yes — 14.4px context-relative mono, subtle background, padding, sm radius | C1 typographic voice |
| ul / ol / nested lists | Partial — 24px indent and 4px between adjacent items; UA marker shape/colour remains | C6 list markers and finishing |
| dl / dt / dd | Partial — body role and 24px dd indent; no semantic distinction between term and definition | C5 extended coverage |
| blockquote | Partial — body role, muted colour, 3px border, 16px indent; nested `cite` only adds the UA italic default | C5 citation treatment; C3 rhythm review |
| `pre` box | Partial — mono family, subtle surface, 12px padding, 8px radius, internal horizontal scroll; size/leading inherit 16px/24px | C1 stable code/pre font role |
| simple table | Yes at baseline — collapsed borders, cell spacing, row rules, strong start-aligned headers | C5 extended table coverage |
| wide table overflow | No — at ~375px the table makes the document wider; it has no scroll owner | C5 table containment/overflow decision |
| table `caption` | No — UA table-caption display, centered alignment, inherited 16/24 body font, and zero margins; no deliberate role or spacing | C5 semantics; C6 final alignment |
| `figure` | Partial — reset makes media block/responsive, but figure receives zero rhythm or grouping treatment | C5 extended coverage |
| `figcaption` | No — inherits 16px/24px body presentation with no muted/small role or separation | C5 extended coverage |
| `kbd` | No — browser-default `monospace` at inherited 16/24 only | C5 extended coverage |
| `mark` | No — browser-default yellow/black treatment; no semantic role | C4 role availability decision, C5 element treatment |
| sub / sup | No — browser-default reduced size and vertical alignment | C5 extended coverage |
| del / ins | No — browser-default decoration; `ins` does not gain a distinct core treatment | C5 extended coverage |
| GitHub-style task-list checkboxes | No — native disabled checkboxes remain in normal list flow; no marker suppression/alignment/gap | C5 extended coverage |
| footnote reference + `hr` + `ol` pattern | Partial — sup, link, rule, and list behaviors compose, but no footnote sizing/return-link/rhythm pattern exists | C5 extended coverage |
| horizontal rule | Yes — zero UA border plus a 1px subtle logical rule and 16px flow spacing | C3 rhythm review |
| body/prose measure ownership | No core rule — only fixture chrome supplies `max-inline-size: 48rem` | C2; decide consumer frame versus a non-inheritable rich-text-root box rule |
| heading/body `text-wrap` | No — computed `wrap`; long heading uses ordinary line breaking | C6 finishing |
| hyphenation + `lang` | No — computed `hyphens: manual`; Italian long words overflow/break only where the browser permits | C6 finishing, with `lang`-aware tests |
| `::selection` | No authored rule; browser default | C6 finishing, informed by USER DECISION 1/C4 |
| list markers | No authored `::marker` treatment in prose | C6 finishing |
| table caption/alignment | Partial — `th` start alignment is deliberate; caption and numeric-column alignment are absent | C5 semantics, C6 final alignment |

At the narrow viewport, `pre` behaved as intended (327px client width, 1296px scroll width, internal
`overflow-x: auto`). Tables did not: even longform's simple table reached 397px, and technical's
wide table reached 582px, expanding 375px documents to 421px and 606px respectively. This is
recorded evidence for C5, not patched fixture CSS.

## 5. Proposed conventions wording for the coordinator

### §1 repository-layout rewrite

```text
ds/
  core.css              content-only entry; sole owner of cascade-layer order
  index.css             full-system composition: core + optional in-tree modules
  reset.css             minimal reset + shared focus baseline              → ds.reset
  tokens/scale.css      raw non-colour scales                              → ds.tokens
  tokens/palette.css    colour primitives + active scheme steps            → ds.tokens
  tokens/semantic.css   content roles + dormant module dowry               → ds.tokens
  tokens/roles.css      typography roles + dormant label-role dowry        → ds.roles
  tokens/recipes.css    optional component recipes; not part of core       → ds.roles
  components/rich-text.css  core semantic content adapter                  → ds.components
  components/*.css      optional in-tree component modules                 → ds.components
fixtures/corpus/        canonical core-only longform, technical, and perimeter bench
```

### §2 cascade-layer rewrite

- Layer order is declared exactly once, at the top of `ds/core.css`:
  `@layer ds.reset, ds.tokens, ds.roles, ds.components, ds.exceptions;`.
- `core.css` imports the reset, core token files, typography roles, and rich text into their named
  layers. It must render standalone.
- `index.css` is composition only: first `@import "core.css";` (the import edge is unlayered so the
  nested statement establishes order), then recipe and optional component imports assigned to
  `ds.roles` / `ds.components`. `index.css` never declares layer order.
- Every starter declaration remains layered. Ordinary unlayered consumer CSS retains precedence
  over both entrypoints without layer knowledge, specificity escalation, or `!important`.

Add to §11: the three pages in `fixtures/corpus/` are permanent core-only batteries. They load
`../../ds/core.css`, use canonical one-block fixture chrome, and may not import optional component
CSS. (The task brief's literal `../ds/core.css` cannot resolve from the nested `fixtures/corpus/`
directory; `../../ds/core.css` is the working relative path.)

## 6. Conventions that held

- File granularity made the split mechanical: no token or component value moved.
- The existing layer contract survived the unlayered composition edge exactly as §12 predicted.
- Rich text has no recipe dependency, so it is independently loadable without a compatibility shim.
- Canonical fixture chrome was sufficient to expose both polished and deliberately raw elements;
  fixture-level CSS was not needed to make the corpus legible.
- The styleless rich-text root preserves inheritance containment. It also makes measure ownership a
  genuine C2 decision rather than an accidental default.

## 7. Friction / observations for C1 and C2

- The nested corpus directory necessarily changes the stylesheet relative path to
  `../../ds/core.css`; the brief's `../ds/core.css` idiom describes top-level fixtures.
- Current role observations only: body is 16/24 at weight 400; headings are 19/24.7, 23/28.75,
  and 28/33.6 at weight 600; inline code is 0.9em. The h3/h4 equality is intentional in the current
  three-heading-role surface, but the longform bench makes the limited hierarchy visible for C1/C2.
- `pre` inherits the body size/leading even though it sets mono family. C1 should settle whether a
  stable code role is part of typographic voice before C2 tunes the type scale.
- The 48rem measure is fixture chrome, not core. C2 must explicitly choose whether measure remains a
  consumer/page-frame responsibility or introduces the first non-inheritable box rule on the
  rich-text root. Either choice must retain the scope-containment doctrine.
- Reset-zeroed margins make unsupported figure/caption/mark/task-list patterns look intentionally
  unfinished. That is useful: later cycles have a stable before-state and cannot confuse UA margin
  luck with system coverage.

## 8. Open questions raised

- The three perimeter calls above await the user checkpoint; this task records no preference.
- Should C5 solve table overflow with a wrapper contract, an overflow rule on `table`, or a documented
  consumer container? The technical corpus proves the problem but does not authorize new markup/CSS.
- If C2 gives rich text a measure rule, should embedded full-bleed media/table exceptions exist, or
  should those remain consumer compositions until M5 expressiveness testing?

## 9. Suggested convention changes (if any)

Adopt the §1/§2/§11 wording in §5 after coordinator review. Record the three user decisions only
after the checkpoint; until then the physical files remain exactly as delivered here.

## 10. Coordinator amendment — 2026-09-01 review

Two lab-instrument defects were found and fixed in `perimeter.html` during coordinator review
(zero impact on `ds/` or on any battery result):

1. **Disconnected resolution.** `resolvedValue()` ran `getComputedStyle` on specimens before their
   section joined the document, leaving 155/157 value cells empty. Sections now connect before the
   token loop; re-verified 0 empty cells, console clean.
2. **Space-bar floor.** The reset's `box-sizing: border-box` plus the specimen's own padding/border
   floored computed inline-size at 18px, so `--ds-space-1..4` all printed "18px". Space bars now
   drop padding/border; the sheet reads 4/8/12/16/24/32/48/64px, type 13/16/19/23/28/34px, and
   radius 4/8/12px exactly — the fitted instance, verified live.
