# DS-Starter

A CSS-only design system starter. Hand-authored CSS is the source of truth: tokens, typography
roles, and component recipes live in named cascade layers (`ds.*`), with no build step, no npm,
and no external assets. Ordinary unlayered consumer CSS always wins over the starter.

## Structure

```text
ds/                     starter CSS (everything inside named layers)
  index.css             sole owner of cascade order (@layer + @imports)
  reset.css             minimal reset + shared :focus-visible baseline
  tokens/scale.css      raw scale tokens (space, type, radius, fonts, oklch palettes)
  tokens/semantic.css   semantic aliases via light-dark() + color-scheme
  tokens/roles.css      typography roles (complete `font` shorthand values)
  components/*.css      one file per component (currently stubs)
fixtures/               static HTML fixture pages (index.html = token sanity page)
docs/                   direction.md (rationale) · conventions.md (normative) · findings/
```

## Preview

No build. From the repo root:

```sh
python3 -m http.server 8020
```

then open <http://localhost:8020/fixtures/>.

## Docs

Read [docs/conventions.md](docs/conventions.md) (normative) before changing anything;
[docs/direction.md](docs/direction.md) has the full rationale. Every task leaves a note in
[docs/findings/](docs/findings/).

## Status

Milestone 1 in progress. Foundations are done: layer order, reset + focus baseline, raw scale,
semantic light/dark aliases, typography roles, fixture skeletons. Button, card, rich text, and
the composition fixture are next; all six component files exist as stubs. Field, disclosure, and
stack land in Milestone 2.
