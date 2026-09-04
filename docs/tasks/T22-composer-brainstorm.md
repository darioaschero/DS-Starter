# T22 — Brainstorm: il composer (design system creati per composizione)

> **Session type: BRAINSTORMING / design conversation.** Nessun codice, nessuna modifica a `ds/` o alle fixture. Partecipanti: l'utente + una sessione LLM con questo handoff. Lingua libera (l'utente scrive in italiano).
> **Output atteso:** una nota in `docs/findings/composer-brainstorm.md` (struttura in §6) con verdetti espliciti. La sessione non committa; l'integrazione spetta al coordinator.
> **Regola costante:** la curation del design appartiene all'utente (conventions §11). Il brainstorm produce opzioni, modelli e verdetti condivisi — non decisioni prese dall'LLM da solo.

## 1. La visione dell'utente (2026-09-03 — da mettere a fuoco, non da riassumere via)

Più che uno starter personalizzabile, l'utente vuole **un tool per creare un DS da zero, per composizione**:

- **Moduli componibili a piacere** — set tipografici, palette, componenti — con **dipendenze tracciate**.
- **Visibilità delle dipendenze al punto di consumo**: esempio dell'utente — "se voglio fare il rich text serif, dal rich text vedo chi consuma lo stesso text style, e invece che modificarlo (se non ha senso) ne assegno un altro — che può essere creato da zero, importato da una library, o una copia rinominata del presente". La scelta modificare-vs-riassegnare è SEMPRE dell'utente. *(Nota coordinator: una precedente formulazione "fork-on-divergence automatico" era un'inferenza del coordinator, corretta dall'utente il 2026-09-03 — il tool fornisce visibilità e meccanica di assegnazione, non ristrutturazioni automatiche.)*
- **Fork di progetti e test di varianti**: forkare un DS tutto-sans, aggiungere un set serif, decidere a quali componenti assegnarlo.
- **Nessuna struttura rigida di variabili semantiche fisse**: il vocabolario semantico non è universale.
- **Anatomia della palette variabile**: un sistema brutalist può usare 2 colori e farseli bastare; un altro può avere shades per bordi, bg, hover, ecc.
- **Contesti come primitiva**: card colorate o header section a tinta piena/pastello sono contesti; testi e bottoni al loro interno usano la palette adeguata **senza cambi di API**. Regole composizionali: "se i bottoni stanno su card con image background, gli elementi che usano palette soft (button, alert, tab/segment control) potrebbero avere un gloss background".
- **UI + sistema collaborativo con LLM** per fare prove: "usiamo una scala sand"; "button di una sola dimensione; per secondary usiamo outline" — o in un altro sistema "soft".
- **Tutto per composizione** — esplicitamente NON "tonnellate di preset da modificare, ignorare o aggiungere a lato come succede in shadcn".

## 2. Cosa esiste già, e come si riposiziona sotto questa visione

Leggere prima: `CLAUDE.md` (stato completo), `docs/conventions.md` v7 (in particolare §12), `docs/findings/m3-synthesis.md`, `docs/findings/scale-rules.md`, `docs/reviews/api-review-2026-09.md`, `docs/findings/typestyle-landing.md`.

| Asset esistente | Ruolo nella visione composer |
|---|---|
| Protocollo CSS v7 (`data-ds-*`, layer, tuple, consumption-point, containment, state-reach) | **Linguaggio di uscita** che il composer emette |
| T21 (contract MUST/MUST-NOT + conformance suite, confermata, non ancora eseguita) | **Test del compilatore**: ogni sistema emesso deve passarla |
| Corpus di gates: matrice contrasti (M3 §4), delta relazionali, bande leading/rhythm, breakage corners (T17), densità step (T15/T16) | **Conoscenza di sicurezza** che vincola le proposte LLM: invarianti come *relazioni*, non come nomi |
| Engine palette ibrido (deciso, vendorizzato) + regole typestyle (§12: ratio per famiglia, griglia, rampa, tuple) | **Primi due moduli generativi** già formalizzati |
| Filo contesti (polarità dichiarata + ri-materializzazione provata + studio colour-context aperto) | La **primitiva contesto** — da generalizzare |
| Cicli di curation M4 (brief → specimen renderizzato → giudizio utente → registrazione) | **Prototipo manuale della UX del tool** (già praticato con successo) |
| Derivazioni M3 nei worktree (`lgc`, `editorial`) | Prototipo manuale del **fork** |
| Il core rifinito (typestyles atterrati, corpus) | Prima **istanza di riferimento** che il composer deve saper riprodurre |
| Commento registrato su PostCSS/@apply (transcript coordinator 2026-09-03, sintesi in §5) | Posizionamento del **livello di authoring** |

## 3. L'agenda — i nodi che la sessione deve sciogliere

1. **Tesi di prodotto in un paragrafo.** Cos'è (composer di DS), per chi è nella prima incarnazione (l'utente stesso? designer? team LLM-driven?), cosa NON è (una pila di preset; un framework runtime).
2. **Il modello.** Cosa sono formalmente: modulo, dipendenza, stile-entità, contesto, sistema, **library** (fonte di entità importabili — nuova, dall'utente), fork di sistema. Semantica della **riassegnazione consapevole** (l'esempio rich-text/button-label come caso di test: vedere i consumer condivisi dal punto di consumo; modificare vs assegnare un altro stile — da zero / da library / copia rinominata). Schema minimo del grafo. **La domanda di tesi**: per i sistemi composti, la source of truth è il modello (CSS = artefatto deterministico, ispezionabile, committato) o resta la CSS con il tool come lente? Nota per la discussione: la correzione dell'utente ALLEGGERISCE il caso pro-modello — la *visibilità* di chi-consuma-cosa è derivabile analizzando la CSS stessa, e l'assegnazione è un edit; l'automatismo che avrebbe richiesto un modello proprietario non è richiesto. Confrontarsi comunque onestamente col rifiuto originario del descriptor TypeScript (direction §1): quello era styling runtime, questo è authoring — la distinzione regge?
3. **Anatomia variabile.** Se il vocabolario semantico non è fisso (brutalist a 2 colori vs sistema a shades), cosa DEVE comunque fornire ogni sistema? Ipotesi da lavorare: il meta-contratto è fatto di **relazioni** (coppie di contrasto text/surface, delta di stato percepibili, focus visibile, ecc. — i gates), non di nomi di token. Cosa significa per l'attuale §5a (struttura 3-famiglie × 12 step): resta come *anatomia di riferimento*, non come legge.
4. **Contesti come primitiva unica.** Unificare: palette di contesto (T18), polarità (decisa, "ok per ora"), trattamenti condizionali (gloss su image-card). Cosa può portare un contesto (binding di palette, correzioni tipografiche, trattamenti); come si dichiarano e ri-materializzano (meccanismo già provato); come si compongono e annidano senza accumulo.
5. **L'emettitore.** Target = protocollo v7, contratto consumer invariato (CSS-only, zero build, layer, override unlayered). Emissione guidata dalla conformance. Il livello di authoring: var-pair oggi, `@mixin/@apply` nativo quando interoperabile; pivot PostCSS sconsigliato dal coordinator (§5) ma discutibile come ramo, a costi dichiarati.
6. **Il loop UI + LLM.** Produttizzare il ciclo manuale: proposta → resa live su corpus/specimen → giudizio umano → registrazione con provenienza. Cosa resta SEMPRE umano (il gusto — §11). Che forma ha la prima UI (anche solo: chat + browser pane + file, come già oggi)?
7. **Taglio MVP.** Il loop chiuso più piccolo che prova la tesi. Candidato da discutere: modulo tipografico + modulo palette + contesti → componi → emetti → renderizza sul corpus → forka → confronta variante. CLI/file-based prima della UI?
8. **Rapporto con la roadmap in corso.** Cosa continua invariato (T21 diventa PIÙ centrale; C3 ritmo produce l'istanza di riferimento), cosa si riposiziona (C4–C6 come moduli/contesti del composer?), cosa si parcheggia.
9. **Prior art** — scan fresco e posizionamento, non imitazione: Style Dictionary / Tokens Studio (pipeline di token, senza composizione né contesti), Knapsack/Supernova (piattaforme docs/governance), Radix Themes (anatomia fissa), Panda/vanilla-extract (build-time, developer-facing), theme-ui (constraint-based, il più vicino nello spirito), shadcn (l'anti-modello dichiarato dall'utente). Cosa manca a tutti: composizione con grafo + contesti + LLM-in-the-loop con giudizio su resa + emissione zero-runtime.

## 4. Scenari di accettazione (dell'utente — il modello deve saperli esprimere)

1. "Usiamo una scala **sand**" → il sistema ricolora coerentemente, gates verdi.
2. Fork del DS sans → aggiunta set **serif** → assegnazione per-componente: dal rich-text l'utente VEDE che il body è condiviso con la button-label e SCEGLIE — modificare lo stile condiviso, o assegnarne un altro (creato da zero / importato da una library / copia rinominata).
3. "**Button di una sola dimensione**; secondary = outline" in un sistema; "secondary = soft" in un altro — stessa API.
4. Sistema **brutalist a 2 colori** che passa la conformance con un'anatomia minima.
5. **Card con image background** = contesto: gli elementi a palette soft (button, alert, segment) prendono un gloss background — senza cambi di API dei componenti.
6. Header section a tinta piena o pastello = contesto: testo e bottoni si adattano da soli (palette + polarità + correzioni).

## 5. Paletti già decisi (non ri-litigare, ma si può proporre di riaprirli con motivazione)

- Contratto consumer: **CSS standard, zero build, zero runtime** per chi adotta un sistema emesso; override unlayered vince.
- **La curation appartiene all'utente** (§11): l'LLM propone e renderizza, l'umano giudica.
- Conformance/contract prima del wizard (decisione della review 2026-09).
- Distinzione registrata: **generare valori ≠ compilare sintassi**; pivot PostCSS = sconsigliato (plugin @apply deprecato con la spec morta; mixin build-time nascondono la spalmata invece di creare un'entità runtime; i consumer perderebbero gli stili come API; il contesto richiede comunque l'indirezione delle var; il nativo `@mixin/@apply` è la strada al 100%).
- Polarità −20 "ok per ora"; typestyle set approvato; protocollo v7. Sono l'istanza di riferimento, non catene: il composer deve saperli *riprodurre*, poi generalizzare.

## 6. Output attesi (in `docs/findings/composer-brainstorm.md`)

1. **Verdetto**: costruire / non costruire / costruire-cosa (con la tesi in un paragrafo).
2. Schizzo del **modello** (entità, grafo, fork, contesti) + la decisione source-of-truth.
3. Il **meta-contratto** dell'anatomia variabile (le relazioni minime).
4. Il **taglio MVP** e la sua prima milestone verificabile.
5. **Delta di roadmap** su M4/M5/T21/C-cycles.
6. Rischi aperti e domande per il coordinator.

## Done means

Nota findings completa con i sei output · nessun file toccato fuori da essa · nessun commit · chiusura con: verdetto prima, poi modello, poi MVP.
