# External API review — 2026-09 (recorded)

> **Provenance:** in-depth external review of the DS API direction (identity/anatomy/axes/values, tokens, cascade, states), supplied by the user in a side conversation on 2026-09-02. Recorded verbatim below by the former coordinator session (stale-context side channel — the live coordinator owns integration).
> **User decisions taken on it (2026-09-02, in that side conversation):**
> 1. **Namespace rename APPROVED**: `data-ui` / `data-part` / `data-<axis>` → `data-ds-ui` / `data-ds-part` / `data-ds-<axis>`. Rationale accepted: any `data-ui` has structural consequences (closes scope/ownership boundaries), so collision severity was underestimated in M2-O5; cost is at its historical minimum. **Execution NOT performed** — scheduling belongs to the live coordinator (C1 typestyles in flight; the rename sweeps `ds/`, all fixtures, corpus, and docs; suggested slot: its own mechanical task, after the typestyle landing).
> 2. **Roadmap item CONFIRMED**: a normative MUST/MUST-NOT contract page reorganizing containment into four separated concepts (cascade governance / selector ownership / value inheritance / state reach) plus an **executable conformance-fixture suite**, before any wizard/configurator. To be reconciled by the live coordinator with the M4 C-cycles (it is orthogonal to typographic curation; it formalizes and extends the existing batteries).

## Coordinator triage (former session, evidence-checked against M1–M3)

**Confirmed real gaps (adopt):**
- **State reach** is the headline: `ds/components/field.css` uses descendant `:has(input:user-invalid)` / `:has(input:focus-visible)` (lines ~111, ~145) — a nested component containing an input inside a field would drive the outer field's state. Never surfaced only because no fixture composes that case. The anatomical-path form (`:has(> [data-part="control"] > input:…)`) is strictly correct under the §3 direct-child contract. Same for focus relocation. Reserve `:focus-within` for components where any-descendant aggregation is genuinely wanted.
- Split "containment" into the four concepts (we distinguish only selector bleed vs inheritance bleed today; *state reach* is genuinely new).
- Cascade claim precision: "normal non-layered consumer declarations beat normal layered ones" — `!important` inverts layer order (our total ban keeps us safe; the documented claim must say it).
- `@property` prohibitions to record: never register optional public overrides with a concrete initial-value (kills the `var()` fallback); never register active steps as inheriting `<color>` (a registered `light-dark()` computes at the declaring element and nested theme scopes inherit the resolved colour). We register neither today — make it law + a nested-theme conformance fixture.
- Default markers = source-level enumerable metadata, not runtime behavior (minifiers may drop empty rules) — already our linter stance; formalize.
- Source-of-truth reformulation: consumer runtime/API/authoring = CSS; generated primitives = deterministic committed artifacts of algorithm+inputs.
- Terminology: **activation** (`:active`) vs **pressed** (`[aria-pressed]`).
- Explicit state-precedence matrix (disabled ≻ hover/activation; focus composes with invalid; …) instead of file-order-implied.
- Identity claim wording: "identity and boundary are co-located" (not "unforgeable").
- Root-element admissibility matrix per component + state-source table; `label` part becomes optional-with-justification (answers T2's open question). Optional `ds.diagnostics` layer/module for protocol-error outlines.

**Already satisfied by construction (normalize + fixture, don't build):**
- Private-channel re-initialization on every root (our base-rule-defaults pattern does this — why card-in-card/stack-in-stack passed; make it the stated invariant "every root initializes or invalidates every private channel it consumes" + a nested same-component conformance probe).
- DS reads but never writes public overrides (M1-verified; linter rule 19).

**Superseded / converging with live work:**
- The review's `font`-shorthand caveat (font-only roles need a separate tracking/features policy) is being answered *more strongly* by the C1 typestyle decision: style = tuple (size, lh, weight-class, tracking) with §6 coordinated sidecars — the font-only invariant is formally retired. The review's residual point that stands: treat the `font` shorthand's longhand resets (features, variant, optical-sizing) as **intentional**, with `font-optical-sizing` now governed by the opsz-auto decision.
- Recipes "share the model, not every resolved value" (action-solid vs status-solid) → module-phase design principle; layer restructure proposal (`ds.states`, `ds.diagnostics`, buckets per module) → decide at the core/module restructuring, alongside the existing `core.css`/`index.css` double entry.
- Support policy for `@scope` (Baseline-2026, no fallback) — conventions §10 already says evergreen-no-fallbacks; make the wording contractual.

**New linter-inventory candidates** (extend m2-synthesis §4 / m3 31–34): anatomical-path state selectors (no bare descendant `:has()` state hooks); root channel-initialization completeness; the two `@property` prohibitions; namespaced attributes (`data-ds-*` only, axis selectors always compound with identity); state-precedence order; root-element admissibility per component.

---

## The review, verbatim

La direzione è **molto solida**. Non la definirei più soltanto "design system vanilla CSS": stai costruendo un **protocollo dichiarativo di componenti basato sulla piattaforma**, con CSS come contratto pubblico.

Le scelte migliori sono:

- separazione netta tra identità, anatomia, configurazione e valori;
- stato letto dalla fonte autoritativa anziché duplicato;
- custom property usate come canali, non come attributi travestiti;
- default implementato una sola volta;
- token organizzati come grafo aciclico;
- priorità del consumatore ottenuta tramite cascade, non combattendo la specificity;
- verifica dell'espressività prima della parametrizzazione.

La approverei come direzione. Prima di congelare l'API, però, renderei più rigorosi alcuni punti.

### 1. Separerei quattro concetti oggi raccolti sotto "containment"

Il tuo confine tramite `data-ui` funziona molto bene per **l'ownership dei selettori**:

```css
[data-ui="button"] > [data-part="label"] {}
```

Qui un componente annidato non può essere raggiunto accidentalmente.

Non è però un confine generale del DOM. In particolare:

- le custom property continuano a ereditarsi;
- `:focus-within` considera qualunque discendente focalizzato, incluso un discendente in uno shadow tree;
- `:has()` può osservare discendenti di componenti annidati;
- `@scope` limita quali elementi possono essere il soggetto finale della regola, ma non necessariamente tutti gli elementi ispezionati dalle parti relazionali del selettore.

Questa regola, per esempio, è pericolosa:

```css
[data-ui="field"]:has(input:user-invalid) {
  /* può reagire a un input appartenente a un componente annidato */
}
```

Anche metterla dentro uno scope con lower boundary non rende automaticamente locale la ricerca di `:has()`.

La versione coerente con il tuo contratto anatomico è:

```css
[data-ui="field"]:has(> [data-part="control"]:user-invalid) {
  /* stato proveniente dalla parte autoritativa diretta */
}
```

Oppure, se l'anatomia richiede un frame:

```css
[data-ui="field"]:has(
  > [data-part="frame"]
  > [data-part="control"]:user-invalid
) {
  /* percorso anatomico esplicito */
}
```

Lo stesso vale per la ricollocazione del focus:

```css
[data-ui="field"]:has(> [data-part="control"]:focus-visible) {
  --_ds-focus-target: frame;
}
```

Userei `:focus-within` solo nei componenti in cui il focus aggregato di **qualsiasi discendente** è realmente il comportamento desiderato.

Nella documentazione separerei quindi:

1. **Cascade governance**: chi vince.
2. **Selector ownership**: quali nodi un componente può stilizzare.
3. **Value inheritance**: quali valori attraversano i componenti annidati.
4. **State reach**: quali discendenti possono attivare lo stato della radice.

Questo rende molto più preciso anche il claim sul confine. Non direi che è "non falsificabile per dimenticanza": anche `data-ui` può essere omesso. Direi invece:

> Identità e confine sono co-localizzati: un componente correttamente identificato non richiede un secondo marker di isolamento.

È un vantaggio reale e più difendibile.

### 2. Namespace: userei `data-ds-*`

`--ds-*` è namespaced; `data-ui`, `data-part`, `data-size` e `data-variant` no.

Questo è particolarmente rilevante perché, nel tuo sistema, **qualunque `data-ui` ha conseguenze strutturali**: chiude scope e ownership. Un attributo introdotto dall'applicazione, da una libreria terza o da un altro sistema potrebbe diventare accidentalmente un confine.

Preferirei:

```html
<button
  data-ds-ui="button"
  data-ds-variant="solid"
  data-ds-size="sm"
>
  <span data-ds-part="label">Continua</span>
</button>
```

Non è soltanto prevenzione delle collisioni. Comunica anche che questi attributi costituiscono un'API coordinata, non metadata generico.

Terrei inoltre come invariante:

```css
/* sì */
[data-ds-ui="button"][data-ds-size="sm"] {}
/* mai */
[data-ds-size="sm"] {}
```

Il vocabolario di ogni asse resta così davvero locale al componente.

### 3. I canali pubblici e privati devono avere regole asimmetriche

Le custom property non registrate ereditano normalmente. Di conseguenza un componente annidato può ricevere i canali privati del componente antenato se la propria radice non li inizializza esplicitamente.

Questo caso deve essere un test di conformità:

```html
<div data-ds-ui="card" data-ds-variant="strong">
  <div data-ds-ui="card">
    <!-- deve avere il default, non strong per ereditarietà accidentale -->
  </div>
</div>
```

La regola dovrebbe essere:

> Ogni radice inizializza o invalida ogni canale privato che consuma.

Per esempio:

```css
@layer ds.components {
  [data-ds-ui="button"] {
    /* Default completi: impediscono leakage da un button antenato. */
    --_ds-button-variant-bg: var(--ds-variant-solid-bg);
    --_ds-button-variant-fg: var(--ds-variant-solid-fg);
    --_ds-button-size-font: var(--ds-font-action-md);
    --_ds-button-size-pad-block: var(--ds-space-2);
    --_ds-button-size-pad-inline: var(--ds-space-3);
    /* Risoluzione finale. */
    --_ds-button-bg-resolved:
      var(--ds-button-bg, var(--_ds-button-variant-bg));
    --_ds-button-fg-resolved:
      var(--ds-button-fg, var(--_ds-button-variant-fg));
  }
}
```

La distinzione normativa che adotterei è:

| Categoria | Il DS la assegna? | Eredita? | Stabilità |
|---|---:|---:|---|
| Token semantico `--ds-bg-canvas` | sì | sì | pubblico |
| Override `--ds-button-bg` | **mai** | sì | pubblico |
| Canale `--_ds-button-variant-bg` | sì, a ogni root | tecnicamente sì | interno |
| Resolved channel `--_ds-button-bg-resolved` | sì, a ogni root | tecnicamente sì | interno |

Il punto importante è che il DS deve **leggere**, ma non impostare, un override pubblico opzionale:

```css
--_ds-button-bg-resolved:
  var(--ds-button-bg, var(--_ds-button-variant-bg));
```

Se il DS dichiarasse `--ds-button-bg` sulla radice, interromperebbe l'override ereditato da un antenato.

Non registrerei inoltre gli override opzionali con un `@property` dotato di valore iniziale concreto: una proprietà registrata e sempre valida possiede già quel valore, quindi il fallback di `var(--ds-button-bg, …)` non entra più in gioco. `@property` è più adatto ai token sempre definiti o ai canali che richiedono interpolazione controllata.

Il prefisso `--_ds-*` comunica bene l'intenzione, ma non produce vera privatezza. Lo formalizzerei come:

> I canali `--_ds-*` sono osservabili e tecnicamente sovrascrivibili, ma non appartengono all'API di compatibilità.

### 4. Correggerei "il consumatore vince sempre"

La proprietà utile delle cascade layers è più precisa:

> Le dichiarazioni normali non-layered del consumatore prevalgono sulle dichiarazioni normali layered del design system.

Con `!important`, l'ordine si inverte: le dichiarazioni importanti nei layer hanno precedenza su quelle importanti non-layered, e l'ordine dei layer importanti è inverso rispetto a quello normale.

Quindi eviterei `!important` nell'intero CSS dei componenti, compreso il focus system, salvo un'eventuale policy eccezionale estremamente esplicita.

Pre-dichiarerei inoltre una struttura stabile:

```css
@layer
  ds.reset,
  ds.foundations,
  ds.content,
  ds.recipes,
  ds.components,
  ds.states,
  ds.diagnostics;
```

Ogni modulo entra in uno di questi bucket, invece di creare il proprio ordinamento:

```css
/* actions.css */
@layer ds.components {
  [data-ds-ui="button"] {}
}
@layer ds.states {
  [data-ds-ui="button"]:hover {}
}
```

Con i layer annidati `ds.*` eviterei dichiarazioni direttamente nel parent `ds`: per le dichiarazioni normali, le regole poste direttamente nel parent hanno priorità sui suoi sublayer. Il parent dovrebbe essere soltanto un contenitore nominale.

Per i consumer che usano anch'essi i layer, documenterei un prelude esplicito:

```css
@layer ds, app;
```

e poi:

```css
@layer app {
  /* override del prodotto */
}
```

Infine, `@scope` è diventato Baseline 2026 nel marzo 2026, ma può mancare nei browser o dispositivi meno recenti. In un sistema senza transpilation o fallback automatici, la support policy deve essere parte del contratto, soprattutto perché il core di rich text dipende direttamente da questa primitiva.

Una formula possibile:

> DS-Starter supporta browser evergreen compatibili con Baseline 2026; l'assenza di `@scope` non è gestita tramite fallback.

È una scelta legittima. Basta che non resti implicita.

### 5. L'HTML semantico deve diventare un contratto verificabile

L'idea "la piattaforma fa il comportamento" è corretta, ma il selettore:

```css
[data-ds-ui="button"] {}
```

accetta indistintamente:

```html
<button data-ds-ui="button">
<a data-ds-ui="button">
<div role="button" data-ds-ui="button">
```

Questi elementi non hanno lo stesso comportamento, la stessa tastiera o gli stessi stati nativi. In forced-colors, inoltre, il browser sceglie parte dei colori di sistema in base alla semantica nativa dell'elemento, non semplicemente al ruolo ARIA dichiarato.

Ogni componente dovrebbe quindi dichiarare:

- elementi radice ammessi;
- parti richieste e opzionali;
- struttura diretta ammessa;
- fonte autoritativa di ogni stato;
- capability native richieste;
- condizioni nelle quali serve un controller.

Per esempio:

```text
button
root: button | a[href]
parts:
  icon-start?  opzionale
  label?       opzionale
  icon-end?    opzionale
state:
  disabled     :disabled per button
  current      aria-current per link
  toggled      aria-pressed, solo con controller
  activation   :active
```

Non renderei obbligatorio `data-part="label"` solo per simmetria. Un bottone con puro testo possiede già un nome accessibile e non dovrebbe richiedere uno `<span>` cerimoniale. La parte `label` è giustificata quando serve davvero per:

- truncation;
- layout indipendente;
- sostituzione con spinner;
- allineamento con icone;
- animazione o transizione.

Un modulo opzionale `diagnostics.css` sarebbe perfettamente coerente con il progetto:

```css
@layer ds.diagnostics {
  [data-ds-ui="button"]:not(:is(button, a[href])) {
    outline: 2px solid CanvasText;
    outline-offset: 2px;
  }
  [data-ds-ui="field"]:not(
    :has(> [data-ds-part="control"])
  ) {
    outline: 2px dashed CanvasText;
  }
}
```

Non sostituisce un validator HTML, ma rende osservabili gli errori specifici del protocollo senza introdurre runtime nel prodotto.

### 6. La gerarchia dei token è buona, con due caveat

#### `light-dark()` e proprietà registrate

Centralizzare lo schema attivo nel livello "active steps" è elegante:

```css
:root {
  color-scheme: light dark;
  --ds-blue-active-9:
    light-dark(var(--ds-blue-light-9), var(--ds-blue-dark-9));
}
[data-ds-theme="light"] {
  color-scheme: light;
}
[data-ds-theme="dark"] {
  color-scheme: dark;
}
```

`light-dark()` dipende dal valore di `color-scheme`; quest'ultimo influenza anche alcuni controlli nativi e altre superfici gestite dal browser.

Eviterei però di registrare gli active step come `<color>` ereditari:

```css
@property --ds-blue-active-9 {
  syntax: "<color>";
  inherits: true;
  initial-value: black;
}
```

Le proprietà registrate vengono parse e computate secondo la loro sintassi nel punto in cui sono dichiarate. Con un valore come `light-dark()`, ciò può fissare il colore secondo lo schema dell'elemento dichiarante e far ereditare ai sottoalberi il colore già risolto, invece dell'espressione capace di rivalutarsi nel loro `color-scheme`. È una conseguenza documentata del modello delle registered custom properties ed è stata anche oggetto di discussione nel CSSWG.

Quindi:

- active step non registrati, se vuoi temi annidati;
- oppure active step ridefiniti all'interno di ciascun theme scope;
- test obbligatorio con tema dark annidato in light e viceversa.

#### Ruoli `font`

Un singolo token destinato allo shorthand `font` è compatto:

```css
--ds-font-action-md: 600 0.875rem/1.25rem var(--ds-font-family-ui);
```

Ma `font` non imposta soltanto family, size, weight e line-height: resetta anche varie longhand, tra cui feature settings, kerning, optical sizing, variation settings e proprietà `font-variant`.

Puoi mantenerlo, ma ne farei un reset intenzionale:

```css
[data-ds-ui="button"] {
  font: var(--ds-font-action-md);
  font-optical-sizing: auto;
  letter-spacing: var(--ds-tracking-action);
}
```

In altre parole, "font-only role" va bene; non lo presenterei come ruolo tipografico completo. Tracking, feature e comportamento ottico devono avere una policy separata.

### 7. Le recipe condivise non devono diventare universalità artificiale

`solid`, `soft` e `outline` sono ottimi concetti condivisi finché rappresentano una **famiglia cromatica**. Non assumerei però che un `solid` interattivo, un `solid` informativo e una superficie `solid` abbiano necessariamente:

- gli stessi step;
- lo stesso contrasto;
- lo stesso bordo;
- gli stessi stati;
- la stessa gerarchia.

Potresti arrivare a qualcosa come:

```css
--ds-action-solid-bg:
--ds-action-solid-fg:
--ds-action-solid-border:
--ds-status-solid-bg:
--ds-status-solid-fg:
--ds-status-solid-border:
```

oppure avere una recipe generica che riceve semanticamente il dominio/accento, ma senza costringere componenti molto diversi a condividere un risultato visivo.

La regola utile è:

> Condividere il modello della recipe, non necessariamente ogni valore risolto.

Anche la derivazione di hover e activation tramite `color-mix()` è un buon fallback, ma "derivabile da qualsiasi override" non significa automaticamente "con contrasto sufficiente". I gate devono valutare le coppie risolte di ogni stato:

```text
base bg / base fg
hover bg / hover fg
activation bg / activation fg
focus indicator / colori adiacenti
link / canvas
link visited / canvas, se supportato
```

Gli override pubblici raw restano necessariamente escape hatch: il sistema può garantire la bontà dei preset, non quella di qualunque colore inserito dal consumer.

Userei inoltre una terminologia distinta:

- **activation** o **active** per `:active`;
- **pressed** per lo stato persistente `[aria-pressed="true"]`.

Altrimenti "pressed" può indicare due stati semanticamente diversi.

### 8. Default marker: utile, ma non farne metadata runtime

Questo pattern è buono:

```css
[data-ds-ui="button"] {
  /* implementazione md */
}
[data-ds-ui="button"][data-ds-size="md"] {
  /* marker intenzionalmente vuoto */
}
[data-ds-ui="button"][data-ds-size="sm"] {
  --_ds-button-size-font: var(--ds-font-action-sm);
}
```

Produce due proprietà preziose:

```html
<button data-ds-ui="button">
<button data-ds-ui="button" data-ds-size="md">
```

devono essere equivalenti, e un valore sconosciuto ricade naturalmente sul default:

```html
<button data-ds-ui="button" data-ds-size="enorme">
```

Il marker vuoto, però, può essere eliminato da minificatori o ottimizzatori downstream. Lo considererei quindi:

> metadata enumerabile nel sorgente canonico, non parte del comportamento runtime del CSS distribuito.

Il wizard può analizzare il sorgente non trasformato e produrre un manifest derivato. Non serve rendere il manifest una seconda source of truth.

### 9. Chiarirei la frase "CSS scritto a mano è la source of truth"

Qui vedo una piccola ambiguità di governance, non un problema tecnico.

Se le palette vengono generate da:

- parametri;
- algoritmo Radix vendorizzato;
- gate WCAG;
- regole di composizione;

allora, per i numeri primitivi, la fonte autoritativa è l'insieme **algoritmo + input**, mentre il CSS è un artefatto deterministico.

La descrizione potrebbe diventare:

> DS-Starter viene distribuito ed eseguito come CSS standard, senza build step per il consumatore. L'API pubblica, le recipe e i componenti sono CSS scritto a mano. Le sole scale numeriche primitive possono essere generate deterministicamente e vengono committate nel pacchetto.

Così distingui correttamente:

- **consumer runtime**: soltanto CSS;
- **public API**: CSS;
- **component authoring**: manuale;
- **maintainer tooling**: ammesso ma non richiesto al consumer;
- **primitive data generation**: riproducibile;
- **generated CSS**: committato e ispezionabile.

Non vedo alcuna ragione per introdurre TypeScript o un token descriptor intermedio solo per aderire a una convenzione di settore.

### 10. Non congelerei il sistema dopo il solo button

Il button verifica bene assi, recipe e stati interattivi, ma è il caso relativamente facile. Prima del wizard userei almeno quattro componenti-sonda:

| Sonda | Cosa deve dimostrare |
|---|---|
| `button` | assi, recipe, override, hover, activation, disabled, focus |
| `field` + `input` | anatomia, stato proveniente dalla parte, invalidità, readonly, disabled, autofill |
| `details`/disclosure | `[open]` nativo, summary, focus, componenti annidati |
| rich text dentro surface/card | `@scope`, lower boundary, ereditarietà, tema annidato, reset dei canali |

Le fixture di conformità più importanti sarebbero:

```text
default omesso === default esplicito
valore sconosciuto === default
ogni asse modifica soltanto i propri canali
un componente annidato non eredita canali privati dal genitore
focus in un componente annidato non attiva il frame esterno
invalidità annidata non attiva il field esterno
override pubblico su un antenato attraversa il sottoalbero
CSS normale non-layered del consumer prevale
tema dark annidato in light rivaluta gli active step
forced-colors mantiene struttura, stato e focus comprensibili
```

Aggiungerei anche una matrice esplicita di precedenza degli stati. Non lascerei che sia il semplice ordine dei file a decidere, per esempio:

```text
disabled domina hover e activation
focus si compone con invalid
pressed persistente si compone con focus
invalid non rimuove il focus indicator
```

La baseline del focus può essere una regola inviolabile **per il codice del DS**. Non può essere una garanzia assoluta sull'applicazione finale, perché il consumatore non-layered può comunque sovrascriverla.

### Giudizio complessivo

L'architettura è già più rigorosa di molti design system costruiti attorno a componenti React, perché esplicita cose che spesso restano accidentali:

- ownership del markup;
- sorgente dello stato;
- direzione delle dipendenze fra token;
- punti di override;
- comportamento della cascade;
- confine tra presentazione e controllo.

Non cambierei la tesi CSS-only. Prima della v0.1 renderei però non negoziabili questi punti:

1. namespace `data-ds-*`;
2. separazione tra selector boundary, state reach, inheritance e cascade;
3. reset completo dei canali privati su ogni root;
4. override pubblici soltanto letti, mai assegnati dal DS;
5. claim esatto sulle cascade layers e su `!important`;
6. support policy esplicita per `@scope`;
7. test sui temi annidati prima di registrare token colore;
8. distinzione fra CSS authoring source e generazione delle primitive;
9. matrice semantica degli elementi ammessi;
10. fixture eseguibili prima del wizard.

Il prossimo artefatto giusto non è ancora il configuratore: è una pagina normativa di **MUST/MUST NOT** accompagnata da fixture HTML che provino questi invarianti.
