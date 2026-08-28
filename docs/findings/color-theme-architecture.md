# Colour, themes, and shared variants — discussion summary

> **Status:** Brainstorming note with provisional preferences  
> **Date:** 2026-08-28  
> **Scope:** Colour primitives, light/dark resolution, semantic tokens, shared variants, and interaction states.  
> **Not a final specification:** The preferences below narrow the direction but do not yet replace the current conventions.

## 1. Current DS-Starter implementation

DS-Starter is CSS-native and currently uses:

- One light-ordered 12-step ramp for each colour family.
- Semantic aliases containing `light-dark()`.
- `color-scheme: light dark` to follow the operating-system preference.
- `[data-theme="light"]` and `[data-theme="dark"]` only to set `color-scheme` explicitly.
- Components consuming semantic tokens rather than raw palette steps.
- Component-local variant channels.
- Hover and active colours derived with `color-mix()`.

Example of the current scheme resolution:

```css
:root {
  color-scheme: light dark;
  --ds-surface-1: light-dark(var(--ds-gray-1), var(--ds-gray-12));
}

[data-theme="light"] { color-scheme: light; }
[data-theme="dark"] { color-scheme: dark; }
```

The current ramp is reused in reverse for dark mode. This is the main part now being reconsidered.

## 2. Approaches compared

### Native `light-dark()` resolution

In this model, a semantic or active-scale token contains its light and dark answers. The inherited `color-scheme` selects the answer.

Characteristics:

- Compact CSS with little selector duplication.
- Automatic OS preference plus explicit subtree switching.
- Light/dark is treated as a binary environmental decision.
- Particularly natural for a web-only, CSS-native system.
- Less directly serializable to non-CSS targets.

### Semantic variables overridden by `[data-theme]`

In this model, light values are declared as defaults and a dark selector rebinds the semantic variables.

```css
:root {
  --ds-bg-canvas: var(--ds-gray-light-1);
}

[data-theme="dark"] {
  --ds-bg-canvas: var(--ds-gray-dark-1);
}
```

Characteristics:

- Theme is represented as an explicit token dimension.
- Every theme mapping is visible as a table of overrides.
- Extends beyond a binary light/dark decision more naturally.
- Supports separately art-directed themes.
- Introduces more cascade ordering, specificity, and nested-scope coordination.

Both approaches preserve the important component contract: components consume stable semantic names and do not know which theme is active.

## 3. Prior art reviewed

### Nuri Design System

Nuri uses explicit light and dark primitive values for every palette step. Its semantic source of truth contains theme-paired references for chrome roles and accent-dependent references for accent roles.

The generated web CSS rebinds semantic variables through `[data-theme]` and `[data-accent]`. Nuri also has a shared palette axis that resolves a complete surface recipe:

- Background
- Foreground
- Optional pressed background
- Optional border

This supports intentional asymmetry. A neutral solid may invert between light and dark while a brand solid can remain unchanged across themes.

Nuri's architecture is strongly influenced by its cross-platform requirement: TypeScript data generates both web and React Native projections. Its selector matrix also demonstrates the additional complexity of combining nested theme and accent scopes.

References:

- [Semantic colour documentation](https://nuri-com.github.io/nuri-design-system/generated/foundations/colour-semantic.html)
- [Palette-axis documentation](https://nuri-com.github.io/nuri-design-system/generated/axes/palette.html)
- [Colour source of truth](https://github.com/nuri-com/nuri-design-system/blob/main/packages/spec/tokens/colours.ts)
- [Palette-surface source of truth](https://github.com/nuri-com/nuri-design-system/blob/main/packages/spec/axes/palette-surface.ts)
- [Generated semantic CSS](https://github.com/nuri-com/nuri-design-system/blob/main/packages/prototype/generated/styles/tokens-semantic.css)

### LGC

LGC is closer to DS-Starter:

- A single neutral OKLCH ramp.
- Semantic colours resolved with `light-dark()`.
- `[data-mode]` only changes `color-scheme`.
- Other axes, such as typography choices, rebind custom properties with `data-*` selectors.
- Accent and style are planned as independent axes.

LGC is useful evidence that each axis does not need to use the same switching mechanism. Binary mode can use native scheme selection while accent, style, and typography use explicit custom-property rebinding.

References:

- [LGC repository](https://github.com/darioaschero/LGC)
- [LGC colour primitives](https://github.com/darioaschero/LGC/blob/main/tokens/primitives.css)
- [LGC semantic tokens](https://github.com/darioaschero/LGC/blob/main/tokens/semantic.css)

## 4. Provisional preferences from the discussion

The discussion established the following preferences:

1. **Light and dark are a binary decision.**
   Native `color-scheme` and `light-dark()` remain appropriate for resolving the active mode.

2. **Light and dark should probably have separate Radix-like ramps.**
   The same step number should carry the same intended role in both ramps instead of reversing one shared ramp.

3. **CSS remains the source of truth.**
   No TypeScript descriptor, generator, or cross-platform token pipeline is currently desired.

4. **Variants such as `solid`, `soft`, and `outline` are system concepts.**
   Their visual meaning should be shared across components.

5. **A component owns the subset of variants it supports.**
   A component may also add a justified component-specific variant without expanding the vocabulary of every other component.

6. **Hover and pressed strategy remains open.**
   The architecture should permit both curated state tokens and colours derived with `color-mix()`.

## 5. Emerging layered model

The preferences suggest this CSS-native layering:

```text
theme-specific primitive ramps
            ↓
active palette steps selected by light-dark()
            ↓
semantic colour roles
            ↓
shared variant recipes
            ↓
component-specific subsets and extensions
```

### Theme-specific primitives

```css
:root {
  --ds-gray-light-1: /* … */;
  --ds-gray-light-12: /* … */;
  --ds-gray-dark-1: /* … */;
  --ds-gray-dark-12: /* … */;
}
```

### Active palette steps

```css
:root {
  color-scheme: light dark;

  --ds-gray-1:
    light-dark(var(--ds-gray-light-1), var(--ds-gray-dark-1));
  --ds-gray-12:
    light-dark(var(--ds-gray-light-12), var(--ds-gray-dark-12));
}
```

This makes step `1` the first surface step and step `12` the strongest text step in both modes.

### Semantic roles

```css
:root {
  --ds-bg-canvas: var(--ds-gray-1);
  --ds-bg-subtle: var(--ds-gray-2);
  --ds-text-primary: var(--ds-gray-12);
  --ds-text-muted: var(--ds-gray-11);
  --ds-border-subtle: var(--ds-gray-6);
}
```

Semantic roles no longer need to reverse primitive indices themselves because the active palette step already resolves the scheme.

### Shared variant recipes

Shared recipe tokens could define consistent visual meaning without automatically enabling every variant on every component:

```css
:root {
  --ds-variant-solid-bg: var(--ds-accent-solid);
  --ds-variant-solid-fg: var(--ds-accent-on-solid);

  --ds-variant-soft-bg: var(--ds-accent-subtle);
  --ds-variant-soft-fg: var(--ds-accent-text);

  --ds-variant-outline-bg: transparent;
  --ds-variant-outline-fg: var(--ds-text-muted);
  --ds-variant-outline-border: var(--ds-border-default);
}
```

Components would map only their supported `data-variant` values to these recipes. Component-specific variants remain local to that component.

## 6. Keeping interaction states open

A nested fallback can support all three levels without committing immediately:

```css
background: var(
  --ds-button-hover-bg,
  var(
    --ds-variant-solid-hover-bg,
    color-mix(
      in oklch,
      var(--ds-variant-solid-bg),
      var(--ds-variant-solid-fg) 8%
    )
  )
);
```

Resolution order:

1. Component-specific curated state.
2. Shared variant state, if one is later defined.
3. Derived `color-mix()` fallback.

This is an architectural possibility, not yet an agreed token API.

## 7. Decisions still open

- The final semantic colour vocabulary: whether to retain numbered roles such as `surface-1` or adopt purpose names such as `bg-canvas`, `bg-subtle`, and `text-primary`.
- The initial system variant set beyond `solid`, `soft`, and `outline`.
- The exact channels that form a complete shared recipe.
- Whether shared recipes should include hover and pressed channels immediately or add them only when derived states prove insufficient.
- How a future accent axis should be scoped and named.
- Whether theme-specific primitive names should use `gray-light-1` or another ordering convention.

## 8. Current conclusion

The emerging direction is not a wholesale adoption of either LGC or Nuri. It combines:

- DS-Starter/LGC's browser-native binary scheme resolution.
- Radix-style independently tuned light and dark ramps.
- Nuri's idea of shared, coordinated surface recipes.
- Component ownership of supported variants and extensions.
- A deliberately unresolved choice between curated and derived interaction states.

Implementation should wait until the remaining vocabulary and recipe-contract questions are promoted from brainstorming to provisional conventions.
