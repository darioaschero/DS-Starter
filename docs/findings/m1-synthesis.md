# M1 synthesis — vertical-slice verdict for the review checkpoint

> Scope: foundations (T1), button (T2), card (T3), rich text (T4), composition & consumer-override fixtures (T5).
> Date: 2026-08-28
> Evidence base: findings notes `foundations.md`, `button.md`, `card.md`, `rich-text.md`, `composition.md`; fixtures `composition.html` and `consumer-override.html` verified computationally and visually in both color schemes (Chromium, statically served). "comp §n" below = section n of `fixtures/composition.html`.

## 1. Verdict per direction §18 evaluation item

Legend: **held** · **held\*** (held with caveat) · **failed** · **deferred**.

| §18 evaluation item | Verdict | Evidence |
|---|---|---|
| Token readability | held | Three levels + documented ramp step roles survived four consuming tasks with no misuse; components consume semantic aliases only (foundations.md; every component header). |
| Typography-role reuse | held | Six font-only roles cover all three components and every fixture; single-handle `font:` rebinds proved out (button.md, rich-text.md; comp §3 uses roles as test discriminators). |
| Axis composition | held | Variant/size channels never interact (T2); comp §1 asserts sm vs md rebind font+padding+height together and independently (13px/12px/36px vs 16px/24px/44px). |
| Public override usefulness | held\* | Context override re-themes soft+solid with correct state shades (T2); comp §2.3/§2.5 and consumer case 5 all behave as documented. Caveat: overrides are *subtree* overrides by design — consumers must learn this (conventions §6); whether every component gets knobs is still open (see §3, row 10). |
| Default behavior | held | Attribute-less card === md under composition (24px padding / 12px gap / 19px title, comp §1); unsupported values fell back cleanly in T2/T3. |
| Component-boundary containment | held | The discriminated copy (comp §3): prose p moved to 500/19.2px while card body stayed 400/24px and sm label stayed 13px, both schemes — selector containment AND inheritance containment, discriminated from coincidence. |
| Part containment | held\* | Colliding `data-part="title"` in a button stayed button-inherited (serif probe, comp §2.2); wrapped part rendered UA-only (comp §2.1); dual-role element styled by the outer card as chosen (comp §2.4). Caveat: the wrapped-part failure is visually quiet → linter dependency (§3, row 7). |
| Custom-property inheritance | held\* | No unintended consumption anywhere. The two intended crossings verified: `--ds-card-bg` recolors nested card (comp §2.3); `--ds-rich-text-h2-font` reaches the inner article (comp §2.5, both h2 28px). Caveat: internal channels are *readable* throughout the subtree (card channel observed on the button, comp §1) — inertness rests on name qualification, not isolation. |
| Channel collisions | held | Zero collisions across button+card+rich-text sharing one inheritance path (comp §1–2; T2 cross-page check). Qualification prevents collision; it does not prevent reach (above). |
| Focus visibility | held | 10/10 keyboard stops on the composition page show the shared ring (2px accent-9 light / accent-8 dark, offset 2px) — links, both button sizes, serif probe, both summaries; zero per-component tuning in three components (comp §4 walk + screenshots). |
| Native + ARIA state presentation | held\* / deferred | Native: hover/active/disabled derivations (T2), `details` toggling open/closed natively with stub CSS (comp §1, asserted both directions, both schemes). Deferred to M2: `[open]`/`[aria-expanded]` styling (disclosure), `:user-invalid`/`:focus-within` (field). |
| Consumer override behavior | held | All five cases both schemes, incl. `:where(.quiet-card)` at (0,0,0) beating the starter's (0,1,0): layer order decides, not specificity. Precondition grep-verified: zero `!important` in `ds/`. |
| Linter feasibility | deferred | M3 by plan — but M1 accumulated the rule inventory: part-depth check, axis-owns-channel check, no-op default markers (visible in CSSOM), public-chain-bypass check, `data-ui`+axis vocabulary keys extractable from markup. Nothing observed blocks a source-AST linter. |

### The nine §18 composition-fixture checks

| §18 fixture check | Verdict | Evidence (comp §) |
|---|---|---|
| Rich-text selectors do not style card headings | held | Card title = 600 19px/24.7px (card channel), not prose h2 23px; unchanged under the §3 discriminator. |
| Rich-text inline rules do not style nested component content | held | Button labels 13px/16px label roles; serif probe followed the button, never prose/card rules (§2.2). |
| Typography custom properties do not leak unexpectedly | held | §3: card body and sm label unchanged under the body-font override; the crossings that *do* happen (§2.3/§2.5) are the documented context-override contract. |
| Card channels do not collide with button channels | held | Same-subtree coexistence asserted; reach-without-collision explicitly observed (§1). |
| Button sizes rebind typography and geometry independently | held | sm 13px/12px/36px vs md 16px/24px/44px (§1). |
| Default axis behavior remains valid | held | Attribute-less card === md under composition (§1). |
| Disclosure responds to native open state | held | `open` false→true→false via summary activation, two instances, both schemes, zero CSS (§1, §3). |
| Every interactive element receives a visible focus treatment | held | 10/10 walk, both schemes, with screenshots (§4). |
| Unlayered consumer CSS can override the starter cleanly | held | consumer-override cases 1–5, both schemes. |

**Bottom line: no §18 item failed.** Everything not held outright is either a documented caveat carried into §3 below, or genuinely M2/M3 scope.

## 2. Identity analysis: `data-ui` vs `class + data-component`

Direction §16 asks the prototype to evaluate the two identity models. No side-by-side build was made (coordinator decision); this argues from the accumulated evidence.

**The boundary argument (structural, strongest).** The rich-text containment model depends on one selector: `@scope ([data-ui="rich-text"]) to (:scope [data-ui])` (`ds/components/rich-text.css:31`) — "prose ends where *any* component begins". That lower boundary must be a **generic** marker, matchable without knowing which component it is. `data-ui` supplies identity and boundary in a single attribute. Class identity cannot: classes are an open consumer namespace (`.marketing`, `.quiet-card`, `.checkout-action` sit on component roots in the consumer fixture today), so "any class" cannot mean "any component" — a second, dedicated hook (`data-component`) becomes mandatory on **every** root. Measured cost: the M1 fixtures contain **84 component roots**; every one would carry `class="<name>" data-component` — two attributes where one suffices, with the second existing *only* to feed one selector. The deeper cost is failure shape: under class identity, omitting `data-component` on one root silently re-opens prose bleed into that component — a quiet failure of exactly the kind T3 taught us to fear (wrapped part). Under `data-ui`, the boundary is unforgeable by omission: an element cannot be a styled component *without* the attribute that is also the boundary.

**Specificity: moot.** `[data-ui="x"]` and `.x` are both (0,1,0); rich-text is `:where()`-wrapped to (0,0,0) throughout; and the layer contract makes consumer overrides win at *any* specificity (verified at (0,0,0) in consumer case 3). Neither model wins anything here.

**Linter implications favor `data-ui`.** The §15 vocabulary key (`component.axis.value`) extracts mechanically from markup: `data-ui` is single-valued and dedicated, so `data-ui="button" data-variant="soft"` → `button.variant.soft` with no heuristics. Class identity makes extraction ambiguous: `class` is a space-separated list shared with consumer utility classes, so the linter needs the `data-component` marker *plus* a registry or naming convention to decide which token is the component name. Keeping identity out of `class` also keeps the starter from ever competing with consumers for the most contested namespace in CSS — the consumer fixture demonstrates classes and identity coexisting on the same elements with zero interference.

**Collision/portability risk of the attribute name — the honest weakness.** `data-ui` is generic; an unrelated library could claim it, and two systems keying `data-ui` would interfere both in recipes and in scope boundaries. (Classes collide *more* in practice — `.button` is the most contested selector on the web — and `data-component` is exactly as generic, so the alternative does not remove the risk; it duplicates it across two hooks.) Mitigation if it ever bites: a prefixed attribute (`data-ds-ui`), paid in verbosity on every root. No collision has been observed at prototype scale; carried as an open risk (§3, row 12).

**Authoring ergonomics (T2–T5).** One grammar — `data-ui` / `data-part` / `data-<axis>` — reads uniformly across markup, CSS, and findings prose; adversarial cases (dual-role element `data-ui="probe" data-part="actions"`, comp §2.4) express naturally in it. Four tasks produced zero moments where class identity would have been easier.

**Recommendation: keep `data-ui`** as the identity mechanism, and record `data-component` as evaluated-and-rejected (two hooks, forgeable boundary, harder linting, same name-collision exposure). Evidence that would reopen the decision: (a) a real-world collision on the attribute name in a target project; (b) an adopting stack that requires class-keyed styling (making the second hook cost-free); (c) `@scope` leaving the containment model, which would remove the generic-boundary requirement that drives the whole argument.

## 3. Open decisions for the checkpoint

| # | Decision | Evidence | Recommendation | Cost to reverse |
|---|---|---|---|---|
| 1 | Resolved-channel pattern in §6 (precompute `public → axis` once) | T2: bg/fg chains restated verbatim 3× each across base+hover+active; a typo silently forks the override chain | Adopt: one derived channel per themed property, consumed by base and state rules; trivially lintable | Low — mechanical rewrite per component |
| 2 | State-mix semantic tokens | T2: 8%/12% literals live in button.css; the mix-toward-resolved-fg recipe proved self-correcting for overrides (re-verified in consumer case 5's resolved hover values) | Promote `--ds-state-hover-mix` / `--ds-state-active-mix` to semantic.css; do **not** add per-surface hover aliases (they fall outside the override chain) | Low |
| 3 | Control-height token | T2: bare literals 2.75rem/2.25rem fit neither space nor type scale | Wait for field (M2); if a third control repeats literals, add a control-height scale | Low |
| 4 | Surface-3 / nesting depth | T3: card-in-card reads by border only; T1: dark ramp is short on in-between steps; comp §2.3 controls confirm the flatness visibly | Decide with real M2 nesting (field-on-card, disclosure content); if surface-3 is added, budget for dark-ramp reshaping | Medium–high (ramp reshaping touches all palettes; semantic aliases insulate components) |
| 5 | Code/pre typography role | T4: `pre` is the only context-dependent typography (size/line-height inherit across the boundary); fine on canonical chrome, compounds in exotic font contexts | Add `--ds-type-code-md` + `--ds-rich-text-pre-font` in M2 only if a second code context appears | Low |
| 6 | Prose-rhythm maintenance surface | T4: a new block element must be added in up to three subject lists (role, rhythm, heading-adjacent) | Keep rhythm per-component; add a header-comment checklist naming the three lists | Low |
| 7 | Wrapped-part quiet failure → linter dependency | T3 + comp §2.1: UA h3 700/18.72px beside heading-sm 600/19px is nearly indistinguishable | Accept for the prototype; make part-depth the **first** linter rule in M3; do not switch card to @scope for this alone (the refined limit `to (:scope [data-ui] > *)` is the variant to test if wrapper tolerance is ever required) | Medium if reversed (pattern rewrite) |
| 8 | Scheme-neutral ramps long-term | T1's largest flagged risk; M1 composition surfaced no failure — dark state shades worked (soft 0.30→0.34 L), dark screenshots clean | Hold as-is; revisit with M2 dark-scheme nesting and hover-depth needs | Medium (rewiring confined to semantic.css) |
| 9 | Focus-baseline home in `ds.reset` | T1 conceptual concern; T2 + comp §4: zero re-tunes needed across three components and ten elements | Keep in reset; state in conventions that reset deliberately carries this one design decision | Trivial |
| 10 | Container components' public knobs | T2 (leaf: knobs earn their keep) vs T3 (container: box-level only, no per-part knobs) vs T4 (adapter: one knob per role mapping); consumer case 5 demonstrates when consumer CSS is the better tool | Adopt the three-tier rule: interactive leaf → obvious knobs; container → box-level only; semantic adapter → per role-mapping. Consumer CSS covers the rest by contract | Low (additive) |
| 11 | Embedded-component spacing in prose *(new, T5)* | comp §1: the §18 fixture's own card sits flush (`margin-block-start: 0`) between spaced paragraphs — rhythm subjects (`rich-text.css:82`) exclude unknown elements by design | Decide in M2 alongside the stack primitive: `* + [data-ui]` rhythm subject in rich-text, stack ownership, or explicit consumer duty — any is one rule; today's silence just needs to become a choice | Low |
| 12 | `data-ui` attribute-name portability *(new, T5)* | §2 above: single generic attribute name is the concentrated collision risk of the chosen identity model | Keep the name; monitor adopting projects; prefix (`data-ds-ui`) only on real collision | Medium (mechanical rename across markup+CSS+linter) |

## 4. Defects found under composition

**No implementation defects in `ds/*.css`.** Every battery assertion matched the documented intent of the component under test, in both schemes. What composition surfaced that isolated fixtures missed:

- `ds/components/rich-text.css:82` (rhythm subject list `* + p, * + ul, …`): embedded components receive no prose rhythm — the flush card in comp §1. Works as designed; the *design* leaves that spacing unowned. Escalated as decision row 11, not a defect.
- `ds/components/rich-text.css:39` + inline override on an ancestor (comp §2.5): outer `--ds-rich-text-*` values reach nested rich-text instances by inheritance. Matches conventions §6's context-override semantics; recorded here because T4 had flagged it as "worth a composition-fixture case" — now demonstrated as intended behavior, labeled in-fixture.
- Testing-method finding (fixture design, not CSS): a discriminator value that coincides with a nested component's own resolved value makes the "did not change" assertion vacuous — the md button label under the label-md discriminator. The sm label carried the proof. Recorded in composition.md so future batteries pick discriminators against every nested resolution.

## 5. M2 readiness

**What field, disclosure, and stack can now assume (proven, not hoped):**

- The §6 recipe shape verbatim — proven for an interactive leaf (button) and a container with parts (card), including no-op default markers, unsupported-value fallback, and axis independence under composition.
- The part contract: direct children, wrap-inside-never-around, dual-role elements addressable by the outer component; `@scope` only where a component styles elements it does not mark (conventions §9's distilled rule — rich text is the reference).
- The focus baseline is free: three components and ten interactive elements needed zero per-component tuning; a new component is "done" on focus by doing nothing.
- Public overrides are inherited context overrides; internal channels reach the whole subtree inert. Name qualification is the entire safety mechanism — keep it strict.
- The §11 canonical chrome is now uniform across all fixture pages (index reconciled in T5); new fixture pages copy it verbatim.
- The composition fixture is built to extend: both disclosure instances live in it as native-behavior baselines (open/close asserted with stub CSS), so the M2 disclosure task has a recorded before state, and stack has a real embedded-spacing problem waiting (decision row 11).
- Pending checkpoint decisions that M2 components should not pre-empt silently: rows 1–4 and 11 (resolved channels, mix tokens, control height, surface-3, embedded spacing).

**§18 checks that remain open for the full fixture:**

- ARIA state presentation (`[aria-expanded]`, `[open]` styling) — disclosure, M2.
- `:user-invalid` / `:focus-within` native state — field, M2.
- Layout primitive under composition (stack around cards/fields; owns or ends the embedded-spacing question) — M2.
- Linter feasibility — M3, rule inventory ready (§1, last row).
- Re-run of this battery once M2 lands: the composition page's probe sections and assertion IDs are stable for exactly that purpose.
