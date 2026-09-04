# External composer comment — 2026-09 (recorded)

> **Provenance:** architectural comment on the composer vision, supplied by the user on 2026-09-03 from a side conversation. Written **without project context** (its author did not know protocol v7, the gates corpus, T21, the curation process, or the typestyle system). Recorded verbatim below; the coordinator triage governs how it enters T22.
> **Status:** INPUT for the T22 brainstorm — not adopted, not a decision.

## Coordinator triage (2026-09-03, checked against project state)

**Adopt as brainstorm input (convergent or additive):**
- Local contracts / ports (`ink/paint/border/material-effect`, provider→consumer) replacing any global semantic taxonomy; "contracts emerge from installed modules; the compiler generates only what is reachable" — formalizes the user's variable-anatomy requirement and the contexts thread.
- The five edge kinds (`alias/derive/overlay/bind/select`) and the principle "value equality ≠ dependency sharing; links are explicit" — the user's 2026-09-03 correction, formalized.
- **Anonymous property-level overlay** + the two-button inspector interaction ("Modifica la sorgente — N usi / Sovrascrivi solo qui — 1 uso") — realizes the user's "change rich-text without assigning it a new text style" as a fourth option beside modify / from-scratch / library / renamed-copy; likely a central product interaction.
- Materials + cross-cutting policies (secondary = public intention; outline/soft/glass = composition decisions; `image-surface × soft → glass` without touching components) — the user's gloss scenario formalized; its emitted-CSS sketch (contexts publish custom properties, materials consume) is compatible with the live-proven re-materialization mechanism.
- LLM as **author of validated graph patches**, never of direct CSS; impact preview before apply; operations as commentable/revertible commits.
- The MVP cut: three hard operations (partial overlay without duplication · two palette topologies · one cross-cutting contextual policy) — sharper than the earlier compose→emit→fork loop; adopted into T22 §3.7.
- Fork-as-patch (parent + operations), three-way structural merge, transitive impact reports, per-property provenance chains.
- Compiler pre-flight checks: cycles (css-variables-1 cycle behavior correctly cited), missing refs, type mismatches, unmet required ports, unreachable nodes, public-API change detection.

**Takes a position on questions the project holds OPEN (discuss, don't swallow):**
- "Typed immutable graph as source; CSS as artifact" is assumed, not argued. Note honestly: its best features (anonymous overlays, patch-forks, LLM patches) genuinely REQUIRE model-owned truth — the comment is de facto an argument for the model side of T22 §3.2. The recorded costs (hand-authoring epistemics; the project's origin in rejecting the TS descriptor) must be weighed, not skipped. "Immutable" is an implementation choice, not a given.
- Hashed private custom properties (`--ds-p-7f13a`): conflicts with conventions §4 (qualified readable internal names) and the project's inspectability values; the manifest mitigates; a real trade-off to decide.

**Blind spots (no fault — written without context; the useful move is MAPPING):**
- Its "configurable contrast/focus policies" already exist here as measured gates (T15–T17, M3 §4); its graph-generated test matrix is the linter inventory generalized; its emitted CSS must target THIS protocol (data-ds-*, v7 layers, consumption-point rule — it sketches classes and a different layer set).
- It underweights the human-judgment loop: three milestones of evidence say numeric gates do not catch ugly (T17 coherent-extreme failures; M3 "may calculate, must not impersonate taste"). The rendered-judgment checkpoint (§11: curation belongs to the user) stays the center of the loop and is the product's differentiator.
- Its typography example is generic; the real expressibility test is recorded as T22 acceptance scenario: the landed T20 typestyle system (tuples, ramp, em tracking, polarity, consumption-point) must be expressible as a module.
- Verify in-session before relying on it: exact DTCG 2025.10 capabilities (references to individual properties of composite tokens). css-color-5, @property, and css-variables-1 citations check out.

---

## The comment, verbatim

La forma giusta del prodotto
Quello che descrivi non è un altro token manager né una libreria di componenti configurabile. È un IDE/compilatore versionato per design system, nel quale:

```
moduli → dipendenze → composizione → fork → test → CSS compilato
```

Il design system sorgente sarebbe un grafo tipizzato e immutabile; il CSS sarebbe soltanto uno degli artefatti prodotti.
Questo permette di ottenere entrambe le cose:

* un editor collaborativo con UI, branch, diff e LLM;
* un pacchetto finale CSS-only, framework-agnostico, utilizzabile anche con HTML statico.

L'editor richiederà inevitabilmente logica applicativa e backend. Ma il design system consumato dai prodotti può essere composto da CSS, font, icone e un manifest, senza React, Vue, runtime JavaScript o component registry.

### 1. Non eliminare la semantica: renderla locale

Perché un bottone possa adattarsi automaticamente a una card, a una hero con immagine o a una sezione colorata, deve esistere almeno un piccolo contratto che comunichi:

* che cosa il componente consuma;
* che cosa il contesto mette a disposizione;
* come collegare le due cose.

Il problema dei design system tradizionali non è quindi la presenza della semantica. È la presenza di una tassonomia semantica globale, rigida e precompilata, come:

```
color.background.surface.subtle.hover
color.background.surface.subtle.active
color.border.control.secondary.default
color.border.control.secondary.hover
...
```

Nel tuo sistema la semantica dovrebbe essere spostata nei contratti locali tra moduli:

```
Button richiede:
  ink
  paint opzionale
  border opzionale
  material-effect opzionale

ImageSurface fornisce:
  ink
  paint
  border
  material-effect = glass

BrutalistSurface fornisce:
  ink
  paint
  border
```

La composizione collega provider e consumer. È una forma di dependency injection applicata al CSS.
Non esiste un catalogo universale di variabili semantiche. I contratti emergono dai moduli effettivamente installati, e il compilatore genera soltanto ciò che è raggiungibile nel grafo.

### 2. Il modello sorgente dovrebbe essere un grafo, non un file di token

Ogni elemento del sistema è un nodo con un'identità stabile:

```
type Node = {
  id: string
  kind:
    | "value"
    | "set"
    | "expression"
    | "record"
    | "component"
    | "contract"
    | "context"
    | "binding"
    | "policy"
    | "scenario"
  outputType: string
  inputs: Edge[]
  metadata: Record<string, unknown>
}
```

Le relazioni non dovrebbero essere tutte semplici alias. Servono almeno cinque tipi di arco:

```
alias      stesso valore e stessa identità
derive     valore calcolato da altri nodi
overlay    modifica parziale di un record
bind       collega una porta a un provider
select     sceglie un ramo in base a stato o contesto
```

Questa distinzione è fondamentale per capire l'impatto delle modifiche.
Due proprietà che oggi hanno entrambe valore `Inter` non devono necessariamente essere considerate collegate. Uguaglianza del valore e condivisione della dipendenza sono due cose diverse. Il collegamento deve essere esplicito.
Per importazione ed esportazione adotterei il formato DTCG 2025.10, pubblicato come specifica stabile. Supporta gruppi arbitrari, alias, token compositi e riferimenti a singole proprietà di un token composito. Ma lo userei come formato di interoperabilità, non come intero modello applicativo: componenti, contesti, policy, branch e scenari appartengono al tuo dominio interno. [designtokens.org](https://www.designtokens.org/TR/2025.10/format/)

### 3. Tipografia: condividere solo ciò che deve essere condiviso

Il caso del rich text e del button label mostra bene perché non basta avere "text styles".
La sorgente potrebbe essere:

```
families:
  sans:
    type: fontFamily
    value: "Inter Variable"

  serif:
    type: fontFamily
    value: "Newsreader Variable"

typography:
  body:
    family: ref(families.sans)
    size: 1rem
    lineHeight: 1.55
    weight: 400

  label-md:
    family: ref(families.sans)
    size: 0.875rem
    lineHeight: 1.2
    weight: 600

bindings:
  RichText.body: ref(typography.body)
  Button.label: ref(typography.label-md)
```

Nel fork serif non dovresti creare manualmente `body-serif`, duplicare lo stile o scollegare tutto. Dovresti poter applicare un overlay a una singola proprietà:

```
branch: serif-richtext

patch:
  RichText.body.family: ref(families.serif)
```

Il risultato concettuale diventa:

```
RichText.body
  family      → serif
  size        → typography.body.size
  lineHeight  → typography.body.lineHeight
  weight      → typography.body.weight

Button.label
  family      → sans
  size        → typography.label-md.size
  lineHeight  → typography.label-md.lineHeight
  weight      → typography.label-md.weight
```

Non è stato creato un nuovo text style visibile. È stato creato un overlay strutturale, che il compilatore può mantenere anonimo.
Nell'inspector la UI dovrebbe sempre offrire due operazioni distinte:

```
Modifica la sorgente
Interesserà 37 utilizzi

Sovrascrivi soltanto qui
Interesserà 1 utilizzo
```

Questa è probabilmente una delle interazioni centrali del prodotto.

### 4. Palette ad anatomia variabile

Una palette non dovrebbe essere obbligata ad avere una scala `50–950`, né ruoli come `surface`, `border-muted` o `interactive-hover`.
Un modulo brutalist potrebbe essere semplicemente:

```
palette:
  paper: "#f4f0e8"
  ink: "#111111"
```

E soddisfare molte richieste con gli stessi due valori:

```
context.paper:
  surface.paint: ref(palette.paper)
  content.ink: ref(palette.ink)

  control.secondary.ink: ref(palette.ink)
  control.secondary.paint: transparent
  control.secondary.border: ref(palette.ink)

  focus.ink: ref(palette.ink)
```

Un altro sistema potrebbe esportare:

```
palette:
  sand-1: ...
  sand-2: ...
  border-cool: ...
  pastel-blue: ...
  pastel-yellow: ...
  solid-red: ...
  translucent-white: ...
```

e offrire provider più granulari.
La differenza importante è questa:

```
palette = materiale disponibile
context = ambiente locale
component recipe = modo di utilizzare quel materiale
binding = decisione della composizione
```

Il componente non conosce l'anatomia della palette. Conosce solo le proprie porte. Un sistema a due colori può collegare dieci porte agli stessi due nodi; un sistema ricco può assegnare valori diversi. In seguito una singola porta può divergere senza rifare l'intera palette.
Anche hover e active possono essere opzionali. Se non vengono forniti:

* possono ereditare lo stato base;
* possono essere derivati da una policy;
* possono usare una trasformazione;
* possono rimanere deliberatamente identici, come in un sistema brutalist.

Per le derivazioni cromatiche il compilatore può produrre valori statici oppure conservare formule CSS come `color-mix()` e relative color syntax. Entrambe sono definite nel modulo CSS Color 5; userei comunque l'output statico come modalità deterministica predefinita e le formule runtime come opzione. [W3C](https://www.w3.org/TR/css-color-5/)

### 5. Contesti e materiali: solid, pastel, image, glass

"Secondary" dovrebbe essere un'intenzione pubblica. "Outline", "soft" o "glass" dovrebbero essere decisioni della composizione.
Per esempio:

```
Design system A
Button.secondary → material.outline

Design system B
Button.secondary → material.soft
```

L'API del componente non cambia:

```
<button class="Button" data-variant="secondary">
  Azione
</button>
```

Inoltre una policy trasversale potrebbe dire:

```
Quando:
  il contesto è una surface con image background
  e il componente usa material.soft

Allora:
  material.soft viene reso come glass
```

Button, alert, tab e segmented control non devono essere modificati uno per uno. Dichiarano tutti di consumare la capability `material.soft`; il contesto image fornisce l'implementazione glass.
Un possibile output compilato:

```
@layer ds.foundation, ds.contexts, ds.materials, ds.components, ds.overrides;

@layer ds.contexts {
  [data-ds-surface="pastel"] {
    --ds-context-ink: #181716;
    --ds-soft-paint: #eee8dd;
    --ds-soft-border: transparent;
    --ds-soft-filter: none;
    --ds-soft-shadow: none;
  }

  [data-ds-surface="image"] {
    --ds-context-ink: white;

    --ds-soft-paint:
      linear-gradient(
        180deg,
        rgb(255 255 255 / 24%),
        rgb(255 255 255 / 10%)
      );

    --ds-soft-border: rgb(255 255 255 / 36%);
    --ds-soft-filter: blur(14px) saturate(140%);
    --ds-soft-shadow: 0 8px 30px rgb(0 0 0 / 18%);
  }
}

@layer ds.materials {
  :where(
    .Button[data-variant="secondary"],
    .Alert[data-emphasis="quiet"],
    .Tabs,
    .Segmented
  ) {
    color: var(--ds-context-ink);
    background: var(--ds-soft-paint);
    border: 1px solid var(--ds-soft-border);
    box-shadow: var(--ds-soft-shadow);
    backdrop-filter: var(--ds-soft-filter);
  }
}
```

Quella lista di selettori non deve essere scritta manualmente. È generata guardando quali recipe, in quella specifica composizione, sono collegate a `material.soft`.
In un fork che trasforma il secondary in outline, il bottone esce automaticamente da quel gruppo, mentre alert e segmented possono continuare a usare soft.

### 6. Perché il runtime può essere CSS-only

Le custom properties sono proprietà CSS normali: partecipano a cascade e inheritance e possono quindi trasportare un contesto dall'elemento surface ai componenti discendenti. La specifica CSS definisce persino il loro grafo di dipendenze e il comportamento in presenza di cicli; il tuo compilatore dovrebbe intercettare quei cicli prima di generare il CSS. [W3C](https://www.w3.org/TR/css-variables-1/)
Le cascade layers permettono di mantenere un ordine prevedibile tra foundation, contesti, componenti, composizioni e override del consumatore. [W3C](https://www.w3.org/TR/css-cascade-5/)
Per alcune proprietà interne puoi usare `@property`, che consente di dichiarare tipo, valore iniziale e comportamento di inheritance direttamente nel CSS, senza registrazione JavaScript. [W3C](https://www.w3.org/TR/css-properties-values-api-1/)
Produrrei qualcosa del genere:

```
dist/
  foundation.css
  contexts.css
  materials.css
  components.css
  composition.css
  design-system.tokens.json
  design-system.manifest.json
  design-system.trace.json
```

Il manifest conserva:

* corrispondenza fra nodi e custom properties generate;
* contratti pubblici;
* dipendenze;
* provenance;
* warning;
* versione del build.

Le custom properties private possono avere nomi univoci o hashati:

```
--ds-p-7f13a
```

mentre l'inspector le presenta con nomi leggibili. Solo le proprietà deliberatamente pubbliche diventano API di override.

### 7. Fork e versionamento come patch, non copie

Un fork non dovrebbe duplicare il design system. Dovrebbe contenere:

```
parent commit
+ operazioni add/remove
+ rebind di archi
+ overlay di proprietà
+ aggiunta o sostituzione di policy
```

Operazioni possibili:

```
addNode
removeNode
setValue
patchRecord
rebindEdge
replaceRecipe
addScenario
```

In questo modo:

```
main
 ├─ serif-richtext
 ├─ secondary-outline
 ├─ secondary-soft
 └─ brutalist-two-colors
```

condivide quasi tutti i nodi.
Il merge può essere a tre vie e strutturale. Un conflitto esiste solo quando due branch cambiano lo stesso campo o lo stesso arco, non perché due grandi file JSON risultano diversi.
Il grafo permette anche un impact report preciso:

```
Modifica: families.sans

Impatto diretto:
  4 record tipografici

Impatto transitivo:
  18 componenti
  73 scenari
  2 applicazioni collegate
```

E per ogni proprietà renderizzata:

```
RichText > paragraph > font-family
← patch serif-richtext
← families.serif
← modulo editorial-type@1.2.0
```

### 8. LLM come autore di patch, non come generatore di CSS

L'LLM non dovrebbe modificare direttamente CSS o token JSON. Dovrebbe produrre operazioni validate sul grafo.
Una richiesta come:
Forka il sistema principale. Aggiungi un set serif, usalo solo nel rich text. Mantieni i label sans. Rendi il secondary outline. Sulle card con immagine trasforma tutti i materiali soft in glass.
diventa una proposta strutturata:

```
fork main → editorial-experiment

+ add module typography.serif
~ rebind RichText.body.family → typography.serif.family
~ bind Button.secondary → material.outline
+ policy image-surface × material.soft → material.glass
```

Prima dell'applicazione, la UI mostra:

```
1 nuovo modulo
2 dipendenze modificate
0 API pubbliche modificate
14 scenari visivi interessati
0 contratti irrisolti
```

Dopo l'applicazione, ogni operazione diventa un commit commentabile, annullabile e mergiabile.
Questo evita che il modello inventi variabili inutili, duplichi stili o aggiunga CSS "a lato" come spesso accade quando si personalizza una libreria basata su preset.

### 9. La UI ideale

L'interfaccia potrebbe avere quattro aree stabili:
Graph / Modules
Mostra moduli, provider, consumer e fan-out delle dipendenze. Di default presenta il grafo ad alto livello, non migliaia di token foglia.
Canvas / Scenarios
Mostra componenti in contesti diversi: neutral, solid, pastel, image, light, dark, compact. Permette il confronto affiancato tra branch.
Inspector / Provenance
Per ogni proprietà mostra valore calcolato, sorgente, overlay e percorso delle dipendenze. Qui compaiono "modifica la sorgente" e "sovrascrivi qui".
Changes / LLM
Prompt, patch proposta, diff strutturale, commenti, review e merge.
Quando aggiungi un componente, il tool non dovrebbe iniettare cinquanta token predefiniti. Dovrebbe invece comunicare:

```
Button richiede:
✓ typography.label
✓ focus treatment
? control material
? disabled policy
```

e permettere di collegare moduli già presenti, generarne uno nuovo o accettare un fallback.

### 10. Testare composizioni, non solamente componenti

La matrice di test dovrebbe essere generata dal grafo:

```
componenti × stati × contesti × viewport × branch
```

Oltre alle snapshot visive, il compilatore dovrebbe verificare:

* cicli;
* riferimenti mancanti;
* incompatibilità di tipo;
* porte obbligatorie non soddisfatte;
* nodi irraggiungibili;
* fan-out inattesi;
* cambiamenti dell'API pubblica;
* contrasto e focus secondo policy configurabili;
* dimensioni e densità;
* stabilità dei valori calcolati.

Per componenti come tabs e segmented controls bisogna distinguere stile e comportamento. Lo styling può rimanere CSS-only, ma un tab accessibile comporta gestione di focus, frecce, attivazione e attributi ARIA; quindi serve comportamento nativo dell'host oppure un piccolo adapter JavaScript, non necessariamente un framework. [W3C](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)

### 11. Un MVP realistico

Il primo prototipo non dovrebbe partire da trenta componenti. Dovrebbe dimostrare tre operazioni difficili:

1. override parziale senza duplicazione, come il serif solo nel rich text;
2. palette con topologie differenti, confrontando un sistema a due colori e uno con più gradazioni;
3. policy contestuale trasversale, come soft che diventa glass su image surfaces.

Basterebbero inizialmente:

```
Moduli:
  typography
  colors
  spacing
  borders
  effects/materials

Componenti:
  RichText
  Button
  Card
  Alert
  Segmented/Tabs

Contesti:
  plain
  solid
  pastel
  image

Funzioni:
  graph inspector
  fork
  structural diff
  scenario matrix
  CSS compiler
  LLM patch proposal
```

La tesi di prodotto può essere sintetizzata così:
Un design system non è una gerarchia di token da riempire. È una composizione versionata di moduli che dichiarano capacità, dipendenze e contratti.
Questa impostazione ti dà la libertà anatomica che cerchi senza perdere coerenza, tracciabilità o API stabili, e consente al risultato finale di restare puro CSS anziché diventare l'ennesimo framework di componenti da forcare e correggere.
