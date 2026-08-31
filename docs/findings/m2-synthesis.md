# M2 synthesis — full-surface integration checkpoint

> Scope: field (T7), disclosure (T8), stack (T9), and M2 integration (T10), with the entire M1 battery re-run.
> Date: 2026-08-31
> Evidence base: `docs/findings/{field,disclosure,stack,integration}.md`; `fixtures/composition.html` §1–6; `fixtures/consumer-override.html` cases 1–5; paired light/dark browser screenshots and computed-style checks.

## 1. Verdict table

Legend: **held** · **held\*** (held with caveat) · **failed** · **still-deferred**.

### M1-deferred direction §18 evaluation items

| Evaluation item | Verdict | Evidence |
|---|---|---|
| Native + ARIA state presentation | held\* | Native presentation is complete: composed field focus/invalid/disabled behavior and disclosure `[open]` presentation held; summary clicks changed the authoritative state and presentation in both schemes (`composition.html` §1; integration.md verification). ARIA-driven disclosure styling is still-deferred by doctrine because the prototype contains no JS controller with synchronized `aria-expanded`; inventing that hook would violate conventions §7. |
| Layout primitive under composition | held | The app-layout stack outside rich text contains two cards, two fields, four buttons, and one disclosure. Stack lg gap = 32px; each card gap = 12px; typography, paint, parts, and state remain component-owned (`composition.html` §5). |
| `:user-invalid` under composition | held | A native submit attempt inside rich-text → card → field produced `:user-invalid`, danger border, visible error, and focused-invalid precedence in both schemes while retaining the relocated focus ring (`composition.html` §1; integration.md verification). |

### Direction §18 fixture checks, re-run on the six-component surface

| Fixture check | Verdict | Evidence |
|---|---|---|
| Rich-text selectors do not style card headings | held | §1 and §3 card titles keep heading-sm while prose uses heading-md / the 600 19px discriminator. |
| Rich-text inline rules do not style nested component content | held | Button labels, field parts, disclosure parts, and card content keep intrinsic roles in §1/§3/§5. |
| Typography custom properties do not leak unexpectedly | held | The original §3 prose remains label-md; its card body, buttons, and field supporting copy stay intrinsic. A second heading-sm subprobe discriminates field label/description/error too. The intentional rich-text-to-rich-text h2 override still crosses by inheritance in §2.5. |
| Card channels do not collide with button channels | held | Card subtle surfaces and button soft/solid surfaces resolve independently through §1 and the deeper §5 tree. |
| Button sizes rebind typography and geometry independently | held | sm = 13px / 12px padding / 36px height; md = 16px / 24px / 44px in both schemes (§1). |
| Default axis behavior remains valid | held | Attribute-less cards retain md channels; unsupported/default behavior from M1 remains unchanged. Stack's md default and field's md default were already proven in T7/T9 and compose without rebinds here. |
| Disclosure responds to native open state | held | Styled open weight/hairline and component content surface reverted and restored under real summary clicks in §1. |
| Every interactive element receives visible focus | held\* | Inventory = DOM count = 20; 20/20 targets in each scheme matched `:focus-visible` and showed the shared/relocated 2px ring under Tab key injection. The pane suppressed Tab's default sequential traversal, so order was verified from DOM rather than observed focus movement (integration.md). |
| Unlayered consumer CSS overrides the starter cleanly | held | All five untouched consumer cases passed 9/9 assertions in both schemes, including specificity 0,0,0 and public-property state-chain behavior. |

### M2 additions to the full fixture

| Added check | Verdict | Evidence |
|---|---|---|
| Embedded-component rhythm | held\* | Direct rich-text component children = 16px; following paragraph = 16px; nested component = 0px. Heading-after-component keeps the existing `--ds-space-6` rule = 32px. The T10 brief's copied 24px number is stale against the frozen scale. (§1, §2.6) |
| Full six-component containment | held | Rich text, card, field, button, disclosure, and stack coexist; the discriminated field and deeper application tree preserve every ownership boundary (§1, §3, §5). |
| Same-surface inventory | held | §6 has one labeled specimen each for card/card, disclosure-content/card, and transparent-field/card. It supported the token decision and records the two deliberate non-consumers. |

No implementation check failed. The two held\* rows are explicit test-driver / stale-brief caveats, not CSS defects.

## 2. The `--ds-bg-component` decision

**Outcome: adopted.** `--ds-bg-component: var(--ds-neutral-3)` names Radix step 3's component-background role. Only disclosure content consumes it.

The decision procedure passed both criteria:

1. The integrated collapse inventory contains three distinct real pairings, exceeding the threshold of two: bg-subtle card inside bg-subtle card; bg-subtle disclosure content on a bg-subtle card before adoption; and a transparent field frame on a bg-subtle card.
2. Neutral step 3 restored visible disclosure depth in paired screenshots: light `rgb(240, 240, 243)` over card `rgb(249, 249, 251)` reads differentiated but not heavy; dark `rgb(33, 34, 37)` over `rgb(24, 25, 27)` restores the missing interior region. Actual content contrast passes comfortably: primary 14.41:1 light / 13.70:1 dark and muted 5.22:1 / 7.64:1.

Consumers and deliberate non-consumers:

- **Disclosure content — consumer.** T8 and the integrated fixture independently show its attached content region collapsing on cards; step 3 fixes the measured demand.
- **Card — non-consumer.** Card remains the subtle container. Card-in-card is delineated by its border, and changing every card would merely move the same-surface collision to a different step while implying a universal elevation promise.
- **Field / outline recipe — non-consumer.** Transparent resting paint is part of the backdrop-aware outline contract; border, focus, and invalid channels carry affordance. Making the shared outline recipe opaque would change every outline consumer without repeated demand.

New caveat: the existing light `--ds-link-color` is 4.19:1 on `bg-component` (versus 4.53:1 on `bg-subtle`). The adopted consumer sets primary text and is not a rich-text scope, so the decision still passes, but `bg-component` must not become a general prose surface without resolving that contrast gap.

## 3. Open decisions after M2

| ID | Decision | Evidence | Recommendation | Cost to reverse |
|---|---|---|---|---|
| M2-O1 | Curated solid hover/active channels | T6 measured light derived solid hover moving opposite Radix Blue 10 (ΔE 0.0553; active 0.0703), while dark derivation is close. Integration adds no contradictory state evidence. | Add curated solid hover + active as a complete optional recipe pair; retain derivation as the public-override fallback. | Low–medium: additive recipe channels plus button bindings and state tests. |
| M2-O2 | Control-height tokens | Button and field remain the only two independent consumers of 2.25rem / 2.75rem. Disclosure is unbounded and integration added instances, not a third component design. | Continue to wait for a third bounded control, then migrate button + field together. | Low: two mechanical substitutions plus new scale entries. |
| M2-O3 | `--ds-type-body-sm` | Field alone demands quieter supporting copy; integration repeats fields but does not add a second consuming component. | Do not promote from instance count. Revisit when a second component needs compact body copy. | Low: additive role and local mappings. |
| M2-O4 | Light link contrast headroom | Existing link-on-subtle is 4.53:1. The new component surface exposes a 4.19:1 link-on-component result; dark remains 7.57:1. | Treat 4.53 as too little substitution headroom. Before links are supported on `bg-component`, either curate a higher-contrast link semantic for component surfaces or retune the active accent text step. | Medium: color-policy and regression changes, semantically insulated from components. |
| M2-O5 | `data-ui` name portability | M1's generic-boundary advantage still holds across six components; no collision appeared. | Keep `data-ui`; prefix only on a real adopting-project collision. | Medium: mechanical markup/CSS/linter rename across the system. |
| M2-O6 | `bg-component` consumption boundary | Disclosure has two independent demand points; card and outline remain deliberately flat/transparent. | Freeze the current one-consumer boundary. Require another measured pairing before expanding it. | Low for an added consumer; medium if the semantic meaning changes. |
| M2-O7 | Brief numeric duplication | T9 and T10 prose copied 24px where the frozen `--ds-space-6` is 32px. | Task briefs should name the token first and include computed numbers only as generated evidence. | Trivial documentation correction. |
| M2-O8 | Focus-walk driver semantics | The pane establishes keyboard modality but suppresses default Tab traversal; per-target Tab checks pass 20/20. | Keep DOM-order inventory plus per-target key assertions; add true sequential traversal in a driver that exposes the default action. | Low test-harness cost; no system CSS change. |

## 4. Linter rule inventory for M3

1. **Single cascade authority:** only `ds/index.css` may declare `@layer` order or assign imports to layers; every starter file must enter a named `ds.*` layer. Sources: foundations.md; conventions §2.
2. **No priority escape:** reject `!important` anywhere in starter CSS. Source: conventions §2; composition.md consumer battery.
3. **Canvas ownership:** reject starter rules that paint/base-type `body`; those declarations belong to unlayered consumers. Sources: foundations.md; conventions §2.
4. **Prefix discipline:** public tokens/APIs use `--ds-`; internal channels use `--_ds-<component>-<axis-or-concern>-<property>`. Reject generic or cross-component internal names. Sources: button.md; conventions §4.
5. **Color-tier dependency graph:** primitives → active steps → semantics → recipes → component channels only; components may not reference primitives or active steps, and semantics/recipes may not skip upward tiers. Fixture consumer demos are explicit exemptions. Sources: color-architecture.md; conventions §5a.
6. **`light-dark()` single site:** allow it only in `tokens/palette.css`, except a commented, justified semantic asymmetry. Sources: color-architecture.md; conventions §5a.
7. **Retired/purpose vocabulary:** reject numbered semantic aliases and retired surface/accent names; semantic keys follow `--ds-<concern>-<qualifier>`. Source: color-architecture.md.
8. **Shared recipe binding:** where a supported component variant has a shared recipe, its axis channels must bind `--ds-variant-<name>-*`, not semantic/active values directly. Sources: color-architecture.md; conventions §6.
9. **Font-role invariant:** typography roles contain one complete `font` value only; component role mappings use `font:`. Reject sidecar role properties and unsanctioned `em` role sizes. Sources: foundations.md; rich-text.md; conventions §5b.
10. **Component identity and vocabulary keys:** extract `component.axis.value` from `data-ui` + `data-<axis>`; report unknown components, axes, and values even though CSS fallback renders. Sources: m1-synthesis.md §1/§2; conventions §3/§6.
11. **Part depth:** every `data-part` must be a direct child of its owning `data-ui` root unless that component explicitly declares another contract; part selectors must use the matching direct-child shape. Sources: card.md; composition.md; conventions §3.
12. **Boundary-safe selectors:** fixed anatomy may address only root/direct marked parts; components styling arbitrary unmarked descendants must use a bounded `@scope … to (:scope [data-ui])`. Sources: card.md; rich-text.md; conventions §3/§9.
13. **Zero-specificity rich-text subjects:** scoped semantic subjects use `:where()` and must not target the rich-text root. Source: rich-text.md; conventions §9.
14. **Finite geometry-axis distinction:** axis values must be component modes such as `sm|md|lg`, never raw lengths, token keys (`space-4`), physical-property names, or primitive composition. Arbitrary values belong in public custom properties. Sources: stack.md; conventions §3.
15. **Axis owns channels:** an axis selector may rebind only its declared component-qualified axis channels; reject writes to another axis/concern. Sources: button.md; conventions §6.
16. **No combination matrix by default:** reject multi-axis recipe selectors unless a documented real cross-axis interaction grants an exception. Source: conventions §6.
17. **Base-only defaults:** default implementation lives only in the base rule; the named default selector must exist as an empty/no-op vocabulary marker. Sources: button.md; card.md; conventions §6.
18. **Explicit completeness:** every non-default axis value must rebind every channel owned by that axis, including values equal to the base default. Sources: card.md; conventions §6.
19. **Public-chain bypass:** axis and state selectors must never write public `--ds-<component>-*` properties; rendered declarations resolve public override before internal channels. Sources: button.md; field.md; conventions §6.
20. **Resolved-channel restatement:** an override chain consumed more than once must be precomputed once as a qualified resolved channel; base/state declarations consume that channel and may not restate the fallback expression. A chain consumed once needs no resolved alias. Sources: button.md; stack.md; conventions §6.
21. **State-channel ownership and order:** native-state selectors rebind only qualified state/frame channels; overlapping equal-specificity states must appear in documented precedence order (field invalid after focus). Sources: field.md; conventions §6–7.
22. **Public-over-state precedence:** a public base override remains first in the resolved chain. If a state must be consumer-configurable, require an explicit state public property rather than silently reversing precedence. Sources: field.md; conventions §6.
23. **Authoritative behavioral state:** use `[open]` for native details and synchronized `[aria-expanded]` only for JS controllers; reject mirrored `data-state` and visual-only ARIA. Sources: disclosure.md; conventions §3/§7.
24. **Derived-state grammar:** interaction derivation mixes resolved bg toward resolved fg using shared hover/active strengths; reject per-surface hover aliases that bypass the chain. Curated recipe channels are permitted only as documented fallbacks above derivation. Sources: button.md; color-architecture.md; conventions §7.
25. **Transparent-state review marker:** a transparent resolved bg is permitted, but its component must document/review supported backdrops instead of replacing it with per-surface state aliases. Sources: disclosure.md; conventions §7.
26. **Focus cannot disappear:** interactive components inherit or re-tune the shared focus values. Descendant outline suppression is valid only with a matching `:focus-visible` relocation to the visual frame using the same shared treatment. Sources: field.md; conventions §8.
27. **Relationship-rule placement:** rules styling the relationship around an excluded scope boundary must live outside the bounded `@scope`, target direct component children, and not reach nested instances. Sources: stack.md; integration.md; conventions §9.
28. **Layout-boundary doctrine:** reject prose elements directly wrapped by component-identity stack in starter fixtures/examples; stack is application layout and rich text owns embedded rhythm. Sources: stack.md; conventions §3.
29. **Public override inheritance contract:** flag `@property` registration with `inherits: false` for component context APIs unless a documented exception exists. Sources: card.md; conventions §6.
30. **Fixture hygiene:** canonical fixtures have one chrome `<style>`, no second presentation block, and valid unique IDs/references; consumer CSS and primitive demonstrations remain visibly marked exemptions. Sources: foundations.md; composition.md; conventions §11.

## 5. M3 readiness

The linter spike can assume conventions v4 as its grammar: six registered `data-ui` components; direct-child part anatomy; component-local finite axes; qualified public/internal properties; the five-level color graph; base/default/non-default channel rules; bounded rich-text scope plus outside relationship rules; and fixtures as a markup corpus. No architecture decision from M2 must be reopened before parsing begins.

Only the spike can answer:

- whether the chosen CSS parser preserves native nesting, `@scope` preludes, empty default-marker rules, comments, and layer-qualified imports accurately enough for source diagnostics;
- how reliably channel ownership and explicit-completeness sets can be inferred from header declarations versus a small registry;
- whether cross-file custom-property dependency graphs can distinguish starter tiers from fixture/consumer exemptions without noisy false positives;
- how part-depth and vocabulary checks generalize from static HTML to framework templates and conditional markup;
- whether relationship-placement, transparent-backdrop review, and documented-exception rules should be hard errors, warnings, or registry annotations;
- what source locations and autofixes remain stable after nested-CSS parsing.

M3 should start with rules 1, 4, 10, 11, 15, 17–20, and 27: they are the highest-confidence structural invariants and have adversarial fixtures already proving their failure shapes.
