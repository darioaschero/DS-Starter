# Findings — T10 M2 integration

> Task: close Milestone 2 by integrating embedded rhythm, the full direction §18 surface, native composed state, stack composition, and the component-surface decision.
> Date: 2026-08-31
> Files touched: `ds/components/rich-text.css`, `ds/tokens/semantic.css`, `ds/components/disclosure.css`, `fixtures/composition.html`, `fixtures/index.html`, `docs/findings/integration.md`, `docs/findings/m2-synthesis.md`

## What was built

- Added the conventions §9 embedded-component relationship rule outside rich text's bounded `@scope`. Direct component children now receive `--ds-space-4` leading rhythm; nested components remain untouched.
- Extended `fixtures/composition.html` without removing or renaming an M1 probe. The §18 card now contains a native required field, actions, and an open styled disclosure. A discriminated field probe, a direct-child rhythm probe, a two-card application stack, and a complete same-surface inventory cover the M2 additions.
- The full page contains all six prototype components. Its focus inventory contains 20 links, inputs, buttons, and summaries in DOM tab order. The application stack is outside rich text, as required by the layout doctrine.
- Adopted `--ds-bg-component: var(--ds-neutral-3)` after the prescribed paired-scheme evaluation, and bound only disclosure content to it. Card and the outline/field frame remain deliberate non-consumers.
- Updated the fixture index status labels: field, disclosure, and stack are M2 built; composition covers M1 + M2.

## Verification results

- Composition computed styles: 54/54 assertions passed in dark and 54/54 in light (the unchanged light surface was re-used after the final discriminator-only markup adjustment, then its 11 affected/count assertions were re-run). This covered wrapped-part containment, colliding part names, nested context overrides, the dual-role part, nested rich text, both discriminated typography probes, button axes/defaults, disclosure `[open]`, and every M2 addition.
- Native disclosure: real summary clicks produced `open → closed → open`; trigger weight and bottom hairline changed `600/1px → 500/0px → 600/1px` in both schemes.
- Native validation: a real submit attempt focused the required input and produced `:user-invalid`. Invalid beat focus while both matched: danger border `rgb(181, 69, 72)` dark / `rgb(235, 142, 144)` light, error visible, and the relocated 2px/2px focus ring remained present.
- Focus v2: the fixture inventory and DOM both contain 20 stops in the same order. Tab/Shift+Tab key injection was used on every target; 20/20 targets matched `:focus-visible` and showed the shared ring (or the field's relocated ring) in each scheme. The current pane established keyboard modality but suppressed Tab's native default traversal, so sequential traversal itself was checked against DOM order rather than observed as focus movement.
- Consumer override fixture: the untouched five cases passed 9/9 assertions in each scheme, including the zero-specificity card override and the two override mechanisms in case 5.
- Surface spot checks on neutral step 3: primary text is 14.41:1 light / 13.70:1 dark; muted text is 5.22:1 light / 7.64:1 dark. The existing accent link role would be only 4.19:1 on the new light surface, so `bg-component` is not yet a universal prose surface; this is carried as a new open decision in the synthesis.
- Static battery: zero `!important` in `ds/`; zero local `@layer`; `light-dark()` only in `tokens/palette.css`; zero retired names; zero primitive/active-step references from components; component internal properties retain the qualified prefix; one composition `<style>` and no `<script>`; 115 unique IDs, no broken label/description references; `git diff --check` clean. Browser console: zero warnings or errors on both verification pages.

## Conventions that held

- The scope limit excludes component roots exactly as conventions §9 says. The outside direct-child rule gives both §18 cards 16px while the nested negative probe stays at 0px; trailing paragraphs keep 16px through the existing subject list.
- Deeper composition preserved every containment guarantee. The original label-md M1 discriminator stays intact, and an added 600/19px subprobe proves field label/description/error typography remains intrinsic; card and button channels stayed independent; stack's 32px lg gap and card's 12px internal gap did not interact.
- Native state rebinding and precedence scaled under composition. Field invalid presentation survived card/rich-text ancestry, and the relocated focus treatment remained visible alongside the danger border.
- The surface-depth role earned one measured consumer without becoming a general elevation system. Disclosure content now separates from subtle cards in both schemes; card borders and the transparent outline recipe still express their original contracts.

## Friction / surprises

- Two numeric expectations in the T10 prose say headings/stack lg should be 24px, but both frozen implementations map their relevant contract to `--ds-space-6`, which is 32px. The integration preserved the token contract and documented the live 32px value; changing it would have exceeded the authorized rich-text edit and contradicted T9's explicit 8/16/32 mapping.
- The cache warning was reproducible: ordinary reload initially kept the old imported semantic and disclosure CSS. Running the required `fetch(url, { cache: "reload" })` pass for index, every token sheet, and every component sheet before reloading exposed the new token correctly.
- Injected Tab/Shift+Tab changed the browser's `:focus-visible` modality but did not execute its default focus traversal in this pane. Per-target real key presses still verified every ring; DOM order supplied the traversal-order assertion. Summary activation was verified by real click, per the brief's known Enter limitation.
- Neutral step 3 is visually restrained in light rather than heavy, but the 4.19:1 accent-link result is new evidence that surface roles and content roles cannot be combined without contrast checks.

## Open questions raised

- Does `--ds-link-color` need a higher-contrast resolution on `--ds-bg-component`, or should disclosure content formally exclude rich prose/link semantics until a second link-on-component use case appears?
- Should verification guidance distinguish “key modality + per-target focus presentation” from sequential focus traversal when the pane suppresses the Tab default action?
- The T9/T10 stale 24px prose should be corrected by the coordinator so briefs describe token values rather than duplicated numbers.

## Suggested convention changes (if any)

- No v4 architecture change is required. Add the link-on-component contrast measurement to the next color-policy review, and prefer token names over copied pixel values in task briefs.
