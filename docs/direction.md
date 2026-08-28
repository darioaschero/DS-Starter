---
title: CSS-Only Design System Starter

---

# CSS-Only Design System Starter  
## Exploration Principles

> **Status:** Direction document  
> **Revision:** 0.2  
> **Scope:** Web projects using hand-authored CSS, custom properties, semantic HTML, and finite configuration attributes.  
> **Purpose:** Record the current reasoning without prematurely turning prototype conventions into permanent architecture.

---

## 1. Context

We are exploring a reusable CSS-only design-system starter that can support different web projects without requiring:

- A TypeScript descriptor
- A CSS generator
- A framework-specific styling runtime
- A token transformation pipeline
- A component library implementation

A previous TypeScript-based system organized styling through component descriptors, anatomy, axes, defaults, and primitive namespaces such as typography, palette, box geometry, stack layout, and interaction.

That system is useful prior art, but it is **not the specification for this CSS starter**.

The following are not automatically inherited:

- The descriptor shape
- The primitive namespaces
- The anatomy model
- The slot model
- The component axes
- The axis values
- The default values
- The naming conventions
- The behavior metadata
- The web and native projection model
- The division between component and layout responsibilities

The objective is to preserve useful principles where they fit CSS naturally, not to recreate the TypeScript system in another syntax.

---

## 2. Decision status

This document distinguishes three levels of commitment.

### Working principle

A conclusion that currently appears fundamental to the direction.

Example:

> Component axes should compose through separate custom-property channels.

### Provisional prototype convention

A choice required to build the first prototype.

It is deliberately documented so that the prototype does not make architectural decisions silently.

Example:

> The first prototype uses `data-ui` to identify component roots.

A provisional convention should remain cheap to reverse.

### Deferred decision

A choice that should be informed by the prototype rather than decided abstractly.

Example:

> Whether all components should expose public override properties.

This document should not describe a required prototype choice as merely “open,” because the implementation will choose something regardless.

---

## 3. Source of truth

Hand-authored CSS can be the source of truth for:

- Token values
- Semantic aliases
- Typography roles
- Theme implementation
- Component styling
- Component defaults
- Variant implementation
- State presentation
- Public customization properties

CSS is less suitable as the source of truth for:

- Enumerating every legal axis value
- Rejecting invalid attribute values
- Describing component APIs to other platforms
- Generating native application styles
- Expressing component behavior
- Representing component slots as machine-readable application APIs

For a web-only starter, this is an acceptable trade-off.

A lightweight linter may eventually validate the vocabulary used in CSS and markup without becoming the producer of the styling.

---

## 4. Separate identity, semantics, configuration, and values

Different mechanisms should have different responsibilities.

### Semantic HTML

HTML should describe meaning, interaction, and document structure.

```html
<button>Continue</button>

<h2>Account activity</h2>

<blockquote>
  Important information.
</blockquote>
```

Native HTML should be preferred where it already expresses the required behavior.

### Component identity

A component needs a stable root identity.

The first prototype provisionally uses:

```html
<button data-ui="button">
  Continue
</button>
```

This is not yet a permanent naming decision.

`data-ui` is being tested because it can serve two purposes:

1. Identify the component recipe
2. Provide a generic boundary for selector scoping

The main alternative is:

```html
<button class="button" data-component>
  Continue
</button>
```

That separates styling identity from the generic component boundary, but requires two hooks.

The prototype should evaluate the trade-off rather than assuming either model is universally superior.

### Component anatomy

The first prototype provisionally uses `data-part` for named component parts:

```html
<button data-ui="button">
  <span data-part="label">Continue</span>
  <svg data-part="icon" aria-hidden="true"></svg>
</button>
```

A `data-part` value is meaningful only within its owning component boundary.

Part selectors must not accidentally reach into nested components.

### Finite component configuration

`data-*` attributes are useful for finite, single-valued choices:

```html
<button
  data-ui="button"
  data-variant="soft"
  data-size="sm"
>
  Continue
</button>
```

Potential axes include:

- `data-variant`
- `data-size`
- `data-tone`
- `data-density`
- `data-orientation`
- `data-fill`

These are examples, not a global vocabulary.

Each component owns:

- Which axes it supports
- Which values each axis accepts
- Which value is the default
- Which internal styling channels each axis may modify

### Values

Custom properties should carry styling values:

```css
--ds-space-3
--ds-radius-full
--ds-surface-1
--ds-type-label-sm
--ds-button-bg
```

The general principle is:

> Attributes describe discrete choices.  
> Custom properties carry styling values.

Primitive styling decisions should not normally become markup attributes:

```html
<!-- Avoid exposing internal primitive composition -->
<button
  data-padding-x="large"
  data-radius="full"
  data-font-size="small"
>
  Continue
</button>
```

---

## 5. Token levels

A possible token structure contains three levels.

The exact names and number of levels remain open.

### Raw scale

Raw tokens provide reusable values without component meaning:

```css
:root {
  --ds-space-1: 0.25rem;
  --ds-space-2: 0.5rem;
  --ds-space-3: 0.75rem;

  --ds-font-size-1: 0.8125rem;
  --ds-font-size-2: 1rem;
  --ds-font-size-3: 1.25rem;

  --ds-radius-sm: 0.25rem;
  --ds-radius-md: 0.5rem;
  --ds-radius-full: 999rem;
}
```

### Font-size units

The shared font-size scale provisionally uses `rem`.

```css
:root {
  --ds-font-size-1: 0.8125rem;
  --ds-font-size-2: 1rem;
  --ds-font-size-3: 1.25rem;
}
```

The reason is predictability:

- A typography role remains stable when nested
- Component typography does not compound through parent font sizes
- A role produces the same scale across different component contexts

Using `em` is not intrinsically invalid.

It remains useful for intentionally relative adjustments:

```css
[data-ui="rich-text"] :where(code) {
  font-size: 0.9em;
}
```

The distinction is:

> Shared role scales should be stable by default.  
> Context-relative typography should be intentional.

Registered custom properties containing local font-relative lengths require additional care because their computed-value behavior differs from unregistered token streams.

### Semantic tokens

Semantic tokens express purpose rather than raw value:

```css
:root {
  color-scheme: light dark;

  --ds-surface-1:
    light-dark(var(--ds-gray-1), var(--ds-gray-12));

  --ds-text-1:
    light-dark(var(--ds-gray-12), var(--ds-gray-1));

  --ds-accent-surface:
    light-dark(var(--ds-blue-3), var(--ds-blue-10));
}
```

Components should normally depend on semantic tokens rather than raw palette values.

A subtree may provisionally select a scheme through context:

```css
[data-theme="light"] {
  color-scheme: light;
}

[data-theme="dark"] {
  color-scheme: dark;
}
```

The theme model remains part of the exploration.

### Roles

Roles bundle reusable design decisions:

```css
:root {
  --ds-type-label-sm:
    600 var(--ds-font-size-1) / 1.2 var(--ds-font-sans);

  --ds-type-label-md:
    600 var(--ds-font-size-2) / 1.2 var(--ds-font-sans);

  --ds-type-body-md:
    400 var(--ds-font-size-2) / 1.5 var(--ds-font-sans);
}
```

Roles know nothing about buttons, cards, fields, or Markdown.

Components decide which role they consume.

---

## 6. Typography-role invariant

The initial prototype treats a typography role as one reusable value for the native `font` shorthand.

```css
:root {
  --ds-type-label-sm:
    600 var(--ds-font-size-1) / 1.2 var(--ds-font-sans);

  --ds-type-label-md:
    600 var(--ds-font-size-2) / 1.2 var(--ds-font-sans);
}
```

A component references the role through one handle:

```css
[data-ui="button"] {
  font: var(--ds-type-label-md);
}
```

This avoids repeating:

```css
font-family: ...;
font-size: ...;
font-weight: ...;
line-height: ...;
```

throughout the component layer.

### Initial role boundary

In the first prototype, typography roles are **font-only**.

Properties outside the `font` shorthand are not implicitly part of the role:

- `letter-spacing`
- `text-transform`
- `text-decoration`
- `text-wrap`
- `font-feature-settings`
- Text color
- Truncation
- Line clamping

This avoids an incoherent model such as:

```css
font: var(--ds-type-label-md);
letter-spacing: var(--ds-type-label-tracking);
```

In that example, the font is keyed by a complete role instance while the tracking is keyed only by a role family. Rebinding one does not necessarily rebind the other.

### Possible future extension

If repeated use proves that non-`font` properties belong to a role, the system may introduce coordinated sidecars:

```css
--ds-type-label-sm-font
--ds-type-label-sm-tracking

--ds-type-label-md-font
--ds-type-label-md-tracking
```

The invariant would then be:

> Every selector that rebinds a typography role must rebind all of that role’s coordinated properties together.

That model is not required for the first prototype.

---

## 7. Components select their typography roles

When a typography role is intrinsic to a component, the component should select it in its own CSS.

```css
[data-ui="button"] {
  font:
    var(
      --ds-button-font,
      var(--ds-type-label-md)
    );
}
```

The role should not need to be repeated on every component instance:

```html
<!-- Not required for ordinary components -->
<button
  data-ui="button"
  data-text-style="label"
>
  Continue
</button>
```

The component stylesheet is the appropriate owner because:

- The relationship is declared once
- Templates remain smaller
- The role can be changed centrally
- The component owns its visual recipe
- Internal styling decisions do not become markup requirements

A dedicated text-style attribute may still be useful in a content context where the element has no component identity.

That is separate from a component selecting its intrinsic typography.

---

## 8. Component axes should compose independently

A component may expose independent axes such as size, variant, tone, orientation, or fill.

Each axis should modify only the internal values it owns.

```css
[data-ui="button"] {
  /* Variant default */
  --_ds-button-variant-bg:
    var(--ds-accent-surface);

  --_ds-button-variant-fg:
    var(--ds-accent-text);

  /* Size default */
  --_ds-button-size-font:
    var(--ds-type-label-md);

  --_ds-button-size-padding-x:
    var(--ds-space-5);

  --_ds-button-size-height:
    2.75rem;

  /* Public override resolution */
  background:
    var(
      --ds-button-bg,
      var(--_ds-button-variant-bg)
    );

  color:
    var(
      --ds-button-fg,
      var(--_ds-button-variant-fg)
    );

  font:
    var(
      --ds-button-font,
      var(--_ds-button-size-font)
    );

  padding-inline:
    var(
      --ds-button-padding-x,
      var(--_ds-button-size-padding-x)
    );

  min-block-size:
    var(
      --ds-button-height,
      var(--_ds-button-size-height)
    );

  &[data-variant="solid"] {
    --_ds-button-variant-bg:
      var(--ds-accent-strong);

    --_ds-button-variant-fg:
      var(--ds-accent-contrast);
  }

  &[data-size="sm"] {
    --_ds-button-size-font:
      var(--ds-type-label-sm);

    --_ds-button-size-padding-x:
      var(--ds-space-3);

    --_ds-button-size-height:
      2.25rem;
  }
}
```

This avoids a full combination matrix:

```css
/* Avoid making every combination its own recipe */
[data-ui="button"]
[data-variant="solid"]
[data-size="sm"] {
  /* Entire component implementation repeated */
}
```

The working principle is:

> Axes compose by rebinding separate custom-property channels.

The exact axes and channel names remain component-specific.

---

## 9. Defaults have one implementation

A component should render correctly without requiring every attribute.

```html
<button data-ui="button">
  Continue
</button>
```

The base rule is the canonical implementation of the default:

```css
[data-ui="button"] {
  --_ds-button-size-font:
    var(--ds-type-label-md);
}
```

This produces valid rendering when:

- The attribute is absent
- An unsupported attribute value appears
- The component is used before optional configuration is added

The linter should still report unsupported values. Graceful fallback is not validation.

### Avoid duplicated default implementations

This creates two sources for the same decision:

```css
[data-ui="button"] {
  --_ds-button-size-font:
    var(--ds-type-label-md);

  &[data-size="md"] {
    --_ds-button-size-font:
      var(--ds-type-label-md);
  }
}
```

The declarations can drift.

The preferred invariant is:

> The base rule owns the default implementation.

If the source needs to enumerate the named default for vocabulary validation, the prototype may use a source-level no-op marker:

```css
[data-ui="button"] {
  --_ds-button-size-font:
    var(--ds-type-label-md);

  &[data-size="sm"] {
    --_ds-button-size-font:
      var(--ds-type-label-sm);
  }

  &[data-size="md"] {
    /* Default vocabulary marker. No channel rebind. */
  }
}
```

A linter would consume the hand-authored source before minification.

This convention is provisional and should be tested for usefulness.

---

## 10. Public overrides and internal channels

A component may expose public customization properties:

```css
--ds-button-bg
--ds-button-fg
--ds-button-font
--ds-button-padding-x
```

Internal implementation channels should be qualified by:

- System
- Component
- Owning axis or concern

```css
--_ds-button-variant-bg
--_ds-button-variant-fg
--_ds-button-size-font
--_ds-button-size-padding-x
```

Generic internal names should be avoided:

```css
/* Too easy to inherit or collide */
--_bg
--_fg
--_type
--_gap
```

Custom properties inherit by default, and the underscore does not provide real privacy.

### Preserve the public override chain

Axis selectors should modify axis channels:

```css
[data-ui="button"][data-variant="solid"] {
  --_ds-button-variant-bg:
    var(--ds-accent-strong);
}
```

They should not overwrite the resolved public channel:

```css
/* Avoid: bypasses --ds-button-bg */
[data-ui="button"][data-variant="solid"] {
  --_ds-button-bg:
    var(--ds-accent-strong);
}
```

The intended resolution order is:

```text
Public instance or context override
                ↓
Axis-selected component value
                ↓
Semantic system token
```

---

## 11. Registered custom properties

Property registrations exist in a document-wide namespace.

A distributed starter must therefore use a system-specific prefix for every registered property:

```css
@property --ds-progress-value {
  syntax: "<number>";
  inherits: false;
  initial-value: 0;
}
```

Avoid generic registered names:

```css
@property --progress {
  /* Too collision-prone */
}
```

The literal prefix remains a project decision.

The requirement is that the name is sufficiently unique for distribution across unrelated applications and libraries.

Registration should be reserved for cases where it provides a real benefit:

- Typed interpolation
- Explicit non-inheritance
- A guaranteed initial value
- Validation of a stable public value contract

Not every token needs registration.

Context-responsive semantic aliases should be tested carefully before registration because registration changes when and how their values compute and inherit.

---

## 12. Native state, ARIA state, and focus

The starter should prefer browser-native state where possible:

```css
[data-ui="button"]:disabled {
  opacity: var(--ds-disabled-opacity);
}

[data-ui="field"]:focus-within {
  border-color: var(--ds-focus-color);
}

[data-ui="field"]:has(input:user-invalid) {
  border-color: var(--ds-danger-color);
}

[data-ui="disclosure"][open] {
  /* Expanded presentation */
}
```

CSS styles state but does not create component behavior.

### ARIA as a state hook

ARIA may be used as a styling hook when it represents real component state:

```css
[data-ui="disclosure-trigger"]
[aria-expanded="true"] {
  /* Expanded visual treatment */
}
```

This coupling is useful because the visual state and the state exposed to assistive technology cannot silently diverge.

ARIA must not be introduced or repurposed as a visual configuration API.

The distinction is:

```text
ARIA
    legitimate for real accessible state

data-*
    appropriate for visual or structural configuration
```

Native HTML remains preferable where it already provides the correct semantics and behavior.

### Shared focus baseline

The starter must provide a visible focus treatment before individual components are designed.

```css
:root {
  --ds-focus-outline:
    2px solid var(--ds-focus-color);

  --ds-focus-outline-offset:
    2px;
}

:where(:focus-visible) {
  outline: var(--ds-focus-outline);
  outline-offset: var(--ds-focus-outline-offset);
}
```

Components may configure the shared values when their geometry requires it:

```css
[data-ui="button"] {
  --ds-focus-outline-offset: 3px;
}
```

Components must not silently remove focus indication.

The working principle is:

> Focus visibility is a system responsibility, not an optional per-component enhancement.

---

## 13. Rich text and Markdown

Markdown should contain content structure rather than design-system styling.

```md
# Main heading

A paragraph with **strong text** and an [inline link](https://example.com).

## Another section

- First item
- Second item
```

The renderer produces semantic HTML:

```html
<article data-ui="rich-text">
  <h1>Main heading</h1>

  <p>
    A paragraph with <strong>strong text</strong>
    and an <a href="#">inline link</a>.
  </p>

  <h2>Another section</h2>

  <ul>
    <li>First item</li>
    <li>Second item</li>
  </ul>
</article>
```

The ownership model is:

```text
Markdown
    owns content and hierarchy

Semantic HTML
    expresses document structure

Typography roles
    own reusable font decisions

Rich-text CSS
    maps semantic elements to those roles
```

Heading levels should reflect document hierarchy rather than desired visual size.

### Rich text is a semantic adapter

The rich-text component maps semantic HTML elements to shared roles:

```css
@scope ([data-ui="rich-text"])
  to (:scope [data-ui]) {

  :where(p, li, dd, dt, blockquote, td, th) {
    font:
      var(
        --ds-rich-text-body-font,
        var(--ds-type-body-md)
      );
  }

  :where(h1) {
    font:
      var(
        --ds-rich-text-h1-font,
        var(--ds-type-heading-lg)
      );
  }

  :where(h2) {
    font:
      var(
        --ds-rich-text-h2-font,
        var(--ds-type-heading-md)
      );
  }

  :where(h3, h4, h5, h6) {
    font:
      var(
        --ds-rich-text-heading-font,
        var(--ds-type-heading-sm)
      );
  }
}
```

The exact heading-role mapping remains configurable.

### Containment problem

A plain descendant selector leaks into embedded components:

```css
/* Unsafe by itself */
[data-ui="rich-text"] :where(h2) {
  font: var(--ds-type-heading-md);
}
```

It would also match:

```html
<div data-ui="rich-text">
  <article data-ui="card">
    <h2 data-part="title">
      Card title
    </h2>
  </article>
</div>
```

The first prototype therefore provisionally uses `@scope` with a nested-component boundary:

```css
@scope ([data-ui="rich-text"])
  to (:scope [data-ui]) {
  /* Prose selectors */
}
```

This is one reason `data-ui` is being tested as component identity: any nested `[data-ui]` becomes a generic lower scope boundary.

The alternative is class identity plus a separate component-root marker.

### Scope does not stop inheritance

`@scope` limits which elements scoped selectors can match.

It does not create Shadow DOM-style inheritance isolation.

For that reason, the rich-text component should avoid placing unnecessary typography channels on its root:

```css
/* Potentially leaks through normal inheritance */
[data-ui="rich-text"] {
  font: var(--ds-type-body-md);
}
```

The prototype instead maps roles to semantic content elements within the scope.

Nested components that require their own typography must establish it at their component boundary.

The composition fixture must test both:

- Selector bleed
- Ordinary inherited-value bleed

### Block roles and inline modifiers

Block elements may select complete font roles:

```css
@scope ([data-ui="rich-text"])
  to (:scope [data-ui]) {

  :where(h2) {
    font: var(--ds-type-heading-md);
  }

  :where(p) {
    font: var(--ds-type-body-md);
  }
}
```

Inline semantic elements should normally modify the current context:

```css
@scope ([data-ui="rich-text"])
  to (:scope [data-ui]) {

  :where(strong) {
    font-weight: var(--ds-font-weight-strong);
  }

  :where(em) {
    font-style: italic;
  }

  :where(a) {
    color: var(--ds-link-color);
    text-decoration-thickness: 0.08em;
    text-underline-offset: 0.15em;
  }

  :where(code) {
    font-family: var(--ds-font-mono);
    font-size: 0.9em;
  }
}
```

A complete body font role should not be applied to `<strong>` because it may appear inside a heading and reset the heading’s size and line height.

Text wrapping, truncation, and line clamping remain text-layout behavior rather than part of the typography role.

---

## 14. Cascade organization

One entry stylesheet should own the ordering of the starter.

```css
@layer
  ds.reset,
  ds.tokens,
  ds.roles,
  ds.components,
  ds.exceptions;

@import "reset.css"
  layer(ds.reset);

@import "tokens/scale.css"
  layer(ds.tokens);

@import "tokens/semantic.css"
  layer(ds.tokens);

@import "tokens/roles.css"
  layer(ds.roles);

@import "components/button.css"
  layer(ds.components);

@import "components/rich-text.css"
  layer(ds.components);
```

Individual files should not need to decide their own place in the cascade.

The exact layer names remain provisional.

The underlying principle is:

> Cascade order should be explicit and centralized.

### Consumer override contract

Everything shipped by the starter should live inside named layers.

Ordinary application CSS may remain unlayered:

```css
/* Starter, inside a named layer */
[data-ui="button"] {
  border-radius: var(--ds-radius-full);
}
```

```css
/* Consumer application, unlayered */
.checkout-action {
  border-radius: var(--checkout-radius);
}
```

Normal unlayered consumer declarations should win without:

- Specificity escalation
- Knowledge of the starter’s internal layers
- Repeating the component selector
- Resorting to `!important`

This is a central portability promise of the starter.

If a consuming project chooses to layer its own CSS, it must establish the application-layer order intentionally.

The starter should avoid `!important` because important declarations reverse normal layer precedence and undermine this contract.

---

## 15. Validation without generation

CSS cannot reject invalid component vocabulary by itself.

A future linter should validate combinations using a component-aware key:

```text
component identity
    +
axis name
    +
axis value
```

Example vocabulary:

```text
button.variant.soft
button.variant.solid

button.size.sm
button.size.md

card.size.sm
card.size.md
card.size.lg
```

A global list of `data-size` values is insufficient because a value supported by one component may be invalid for another.

### Possible checks

The linter may check that:

1. Markup does not use an unsupported axis value for a component.

2. An axis selector modifies only its own internal channels.

```css
/* Invalid: variant modifies a size channel */
[data-ui="button"][data-variant="solid"] {
  --_ds-button-size-font:
    var(--ds-type-label-sm);
}
```

3. An axis selector does not overwrite the resolved public channel.

```css
/* Invalid: bypasses the public override chain */
[data-ui="button"][data-variant="solid"] {
  --_ds-button-bg:
    var(--ds-accent-strong);
}
```

4. Internal custom properties are qualified by system and component.

5. A named default axis value agrees with the base default.

The preferred implementation is for the named default selector to be a no-op marker rather than a repeated declaration.

6. Every nested `var()` fallback branch would produce a valid value for the consuming property if that branch were selected.

```css
font:
  var(
    --ds-button-font,
    var(--ds-type-label-md)
  );
```

An unused fallback does not automatically invalidate a declaration. The requirement is that every reachable fallback remains semantically valid when selected.

7. Dynamic template values that cannot be statically resolved are reported separately rather than silently accepted.

8. A registered property uses the required system prefix.

9. A component part selector cannot escape its intended component boundary.

### Unused CSS vocabulary

A CSS value exposed by a reusable starter is not necessarily dead because the current application does not use it.

The useful default policy is:

```text
Markup value not implemented by CSS
    error

CSS vocabulary not used by the application
    optional coverage warning
```

The reverse direction may become strict for:

- Documentation fixtures
- Component matrices
- Visual regression pages
- Explicit API coverage tests

The linter should operate on source ASTs rather than regular expressions, especially if native nesting and `@scope` are used.

---

## 16. Provisional prototype conventions

The first prototype needs concrete conventions.

These are not yet permanent architecture.

### Component root

Use:

```html
data-ui="<component>"
```

Reason:

- Identifies the component
- Provides a generic nested-component boundary
- Can participate in `@scope` limits

Alternative to evaluate:

```html
class="<component>" data-component
```

### Component anatomy

Use:

```html
data-part="<part>"
```

Part meaning is local to the nearest owning component.

### Typography roles

Use font-only roles:

```css
--ds-type-label-sm
--ds-type-label-md
--ds-type-body-md
--ds-type-heading-md
```

### Shared font scale

Use `rem` for role font sizes.

Use `em` only for intentionally context-relative adjustments.

### Rich text containment

Use `@scope` with nested `[data-ui]` boundaries.

Do not assume this prevents inherited values from crossing the boundary.

### Defaults

Implement defaults only in the base component rule.

A named default selector may exist as a no-op vocabulary marker.

### Layers

Place all starter CSS in named layers.

Leave ordinary consumer CSS unlayered by default.

### Focus

Provide one shared `:focus-visible` baseline before component styling is considered complete.

These conventions should be evaluated through composition, not only through isolated component examples.

---

## 17. Deferred decisions

The following should be informed by the prototype:

- Exact system prefix
- Final component identity mechanism
- Whether class identity requires a generic component marker
- Exact layer names
- Exact typography-role names
- Number of typography roles
- Whether typography sidecars are necessary
- Exact component axes
- Whether axis names should be shared across components
- Which components require named parts
- Whether every component exposes public override properties
- Whether layout primitives use components, attributes, or both
- Whether primitive namespaces resemble the previous TypeScript system
- Whether `@scope` is required outside rich text and complex anatomy
- Whether the linter ships with the starter
- How dynamic template values are validated
- Whether CSS remains the source of truth if native-platform export becomes necessary

These decisions should not be frozen from the previous TypeScript system.

---

## 18. Prototype test surface

The first prototype should remain small:

- Button
- Field
- Card
- Rich text
- One layout primitive
- One stateful disclosure

The prototype should evaluate:

- Token readability
- Typography-role reuse
- Axis composition
- Public override usefulness
- Default behavior
- Component-boundary containment
- Part containment
- Custom-property inheritance
- Channel collisions
- Focus visibility
- Native and ARIA state presentation
- Consumer override behavior
- Linter feasibility

### Required composition fixture

The prototype must include a nested fixture rather than testing every component only in isolation.

```html
<article data-ui="rich-text">
  <h2>Rich-text heading</h2>

  <p>
    Introductory Markdown content.
  </p>

  <section data-ui="card">
    <h3 data-part="title">
      Card title
    </h3>

    <p data-part="body">
      Card content that must not receive rich-text
      component styling accidentally.
    </p>

    <div data-part="actions">
      <button
        data-ui="button"
        data-size="sm"
        data-variant="soft"
      >
        <span data-part="label">
          Secondary action
        </span>
      </button>

      <button
        data-ui="button"
        data-size="md"
        data-variant="solid"
      >
        <span data-part="label">
          Primary action
        </span>
      </button>
    </div>

    <details data-ui="disclosure">
      <summary data-part="trigger">
        More information
      </summary>

      <div data-part="content">
        Disclosure content.
      </div>
    </details>
  </section>
</article>
```

This fixture should test:

- Rich-text selectors do not style card headings
- Rich-text inline rules do not style nested component content
- Typography custom properties do not leak unexpectedly
- Card channels do not collide with button channels
- Button sizes rebind typography and geometry independently
- Default axis behavior remains valid
- The disclosure responds to native open state
- Every interactive element receives a visible focus treatment
- Unlayered consumer CSS can override the starter cleanly

The architecture should be judged by how it behaves under composition.

Isolated component demos alone are not sufficient.

---

## 19. Current working principles

The exploration currently points toward the following principles:

1. Use hand-authored CSS as the source of truth for web token values and component recipes.

2. Do not inherit the previous TypeScript descriptor architecture automatically.

3. Keep semantic content and internal styling composition out of application markup.

4. Use component identity, component anatomy, finite axes, and styling values as distinct concepts.

5. Use custom properties for tokens, roles, axis channels, and public overrides.

6. Treat typography roles as one-handle `font` values in the first prototype.

7. Let each component select its own typography roles.

8. Let independent component axes compose through independent internal channels.

9. Keep the base rule as the single implementation of every default.

10. Preserve public override chains when variants rebind internal values.

11. Qualify internal custom-property names by system and component.

12. Prefix every registered custom property because registrations are document-global.

13. Prefer native HTML state and real ARIA state over duplicated presentation state.

14. Use ARIA as a hook for synchronized accessible state, never as a visual configuration API.

15. Ship a shared visible `:focus-visible` baseline.

16. Style Markdown through semantic rich-text CSS rather than embedding design-system choices in Markdown.

17. Treat selector containment and value inheritance as separate composition problems.

18. Centralize cascade-layer order in one entry stylesheet.

19. Keep all starter CSS layered so ordinary unlayered consumer CSS wins by default.

20. Add validation only where CSS cannot express the contract itself.

21. Validate component vocabulary per component rather than globally.

22. Test the architecture through nested composition before standardizing it.

---

## 20. Direction

The first prototype should answer practical questions rather than confirm a predetermined architecture.

The objective is not to prove that the previous TypeScript model can be recreated in CSS.

The objective is to discover the smallest CSS-native contract that remains:

- Reusable
- Readable
- Composable
- Themeable
- Accessible
- Overridable
- Resistant to silent inheritance and selector leaks
- Easy to adopt across unrelated web projects

The prototype should inform the architecture.

The architecture should not be frozen before the prototype exposes its real constraints.