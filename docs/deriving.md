# Deriving a system from DS-Starter

Use this checklist to give DS-Starter a new identity without coupling that identity to component CSS. The [LGC-like derivation](findings/derivation-lgc.md) is the worked custom-ramp example; the [warm-editorial derivation](findings/derivation-editorial.md) is the worked Radix-family example.

## The contract

Your working surface is:

- `ds/tokens/palette.css` — three light/dark colour families and active steps
- `ds/tokens/semantic.css` — purpose roles such as link, focus, and on-solid
- `ds/tokens/scale.css` — font stacks, type sizes, spacing, and radii
- `ds/tokens/roles.css` — six complete font-shorthand roles
- `ds/tokens/recipes.css` — optional; change only when the identity truly changes shared solid/soft/outline emphasis

Do not change `ds/index.css`, `ds/reset.css`, `ds/components/*`, or fixtures to make a derivation pass. Do not rewrite the 36 active palette declarations or move `light-dark()` out of `palette.css`.

If you believe you need anything outside the token surface, stop. Record the exact edit, why the existing surface cannot express it, and whether the system is broken or merely less faithful. Continue without the edit when the issue is cosmetic. Make a frozen-surface edit only when rendering actually breaks, and label it `LEAK`.

## Ordered checklist

### 1. Neutral family

Choose one path:

- **Radix path:** copy the official sRGB light and dark sets verbatim—12 values per scheme, 24 total—and update the source/version attribution.
- **Custom path:** map the source onto the starter's fixed role table:

| Step | Intended role |
|---:|---|
| 1 | app background |
| 2 | subtle background |
| 3–5 | component background / hover / active |
| 6–8 | subtle / default / strong borders and focus |
| 9–10 | solid / solid hover |
| 11–12 | muted / primary text |

Sparse source ramps need human redistribution. Check **light steps 3–5** and **dark steps 3–6** especially: the LGC source did not contain enough samples there, so those slots were interpolated to preserve distinct component and border states. Preserve role meaning and ordering before preserving the source's original intervals.

### 2. Accent family and on-solid

Fill all 12 light + 12 dark accent slots. Copy a complete published family mechanically; if the source family is sparse or missing, stop for a designer-supplied ramp.

Then set `--ds-accent-on-solid` in `semantic.css`. Do not assume it is white. Radix Amber 9 required its prescribed dark foreground: white measured 1.58:1, while `#21201c` measured 10.33:1. Require at least **4.5:1** against accent step 9 in both schemes.

### 3. Danger family

Fill all 12 light + 12 dark danger slots from a complete source or a designer-supplied family. Preview danger text, invalid borders, the visible error message, and the focused-invalid field in both schemes.

### 4. Semantic colour gates

Choose link, accent-text, and focus steps in `semantic.css`; do not inherit the old step numbers blindly.

- Link on canvas: at least **4.5:1**, light and dark.
- Link on subtle: at least **4.5:1**, light and dark.
- Focus indicator on canvas: at least **3:1**, light and dark.
- On-solid on solid: at least **4.5:1**, light and dark.

Test both link surfaces. Amber 11 passed on light Sand canvas at 4.53:1 but failed on Sand subtle at 4.38:1; moving link and accent text to Amber 12 fixed the pair.

### 5. Type voice

In `scale.css`, define only stacks you can ship. `--ds-font-serif` and `--ds-font-display` are valid derivation extension slots; they do not authorize external assets. Licensed or unavailable faces need an explicit fallback and remain a fidelity limit.

Map source size anchors onto `--ds-font-size-1..6` only when the reference demands it. In `roles.css`, keep each of the six roles a single complete `font` shorthand:

- `--ds-type-label-sm`, `--ds-type-label-md`
- `--ds-type-body-md`
- `--ds-type-heading-sm`, `--ds-type-heading-md`, `--ds-type-heading-lg`

Choose role families, weights, and leading as a set, then preview. Preserve relational state cues: disclosure uses the strong weight while open, so a 600 base label collapses its weight transition. The LGC path retained label 500 and verified **closed 500 → open 600**.

### 6. Radii and geometry

Map the source's sharpness or softness onto `--ds-radius-sm|md|lg`; keep the full/pill token. Inspect cards, buttons, fields, disclosure, and nested composition rather than judging isolated swatches.

### 7. Prefer these non-actions

- **Keep spacing unchanged by default.** Both derivations retained the 4–64px scale. A global spacing change cannot independently tune prose measure and compact controls.
- **Keep recipes unchanged by default.** The warm-editorial path changed no recipe: semantics carried the family swap. Rebind a recipe only for an explicit system-level choice, such as the LGC-like neutral soft treatment.
- **Keep components and active-step structure untouched.** If a desired treatment needs prose measure, heading margins, tracking, small caps, special numerals, drop caps, link-decoration tuning, or separate prose/control density, record the fidelity boundary instead of hiding it in a component edit.

## Verify

Serve the repository root statically, open the fixtures on that origin, and force every imported sheet fresh before trusting computed values:

```js
const urls = [
  "/ds/index.css",
  "/ds/reset.css",
  "/ds/tokens/scale.css",
  "/ds/tokens/palette.css",
  "/ds/tokens/semantic.css",
  "/ds/tokens/roles.css",
  "/ds/tokens/recipes.css",
  "/ds/components/button.css",
  "/ds/components/card.css",
  "/ds/components/field.css",
  "/ds/components/rich-text.css",
  "/ds/components/stack.css",
  "/ds/components/disclosure.css",
];
await Promise.all(urls.map((url) => fetch(url, { cache: "reload" })));
location.reload();
```

If the browser driver does not expose page `fetch()`, use a real hard reload on every assertion page or a fresh origin/port, then confirm computed styles reflect the new tokens.

Run these pages in **light and dark**:

1. `fixtures/composition.html` — the complete six-component battery: containment, axes, nested overrides, embedded rhythm, disclosure open/closed, native invalid/focused-invalid, and the 20-target focus inventory.
2. `fixtures/consumer-override.html` — all five override cases, including real pointer hover and public-property state derivation.
3. `fixtures/index.html` — visual pass for palette, semantic roles, recipes, type, and geometry.

Fill the table from browser-computed colours:

| Pair | Minimum | Light | Dark |
|---|---:|---:|---:|
| Primary text / canvas | 4.5:1 | — | — |
| Primary text / subtle | 4.5:1 | — | — |
| Primary text / component | 4.5:1 | — | — |
| Link / canvas | 4.5:1 | — | — |
| Link / subtle | 4.5:1 | — | — |
| Accent-on-solid / solid | 4.5:1 | — | — |
| Focus indicator / canvas | 3:1 | — | — |

Finish with static checks: every family has 12 light + 12 dark primitives; all 36 active steps remain; `light-dark()` appears only in `palette.css`; starter CSS contains no `!important`; components reference semantics/recipes, never primitives or active steps; and the diff contains only the permitted token files plus your findings.

Expect fixture-copy drift. Family names in `fixtures/index.html` and numeric role descriptions in `fixtures/composition.html` describe the base profile and may become false while the computed specimen remains correct. Under a frozen derivation, record that drift; do not “fix” it by breaching the contract.
