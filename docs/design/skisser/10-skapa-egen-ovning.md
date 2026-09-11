Status: utkast

# Vy: Skapa egen övning

**Uppfyller:** berättelse 13 (skapa egen övning), inbäddar 06 (planskiss, här i redigerbar form som planskissutvecklaren äger).

**Läge:** Planeringsläget.

## Wireframe, 360 px

```
┌────────────────────────────────┐
│ ← Ny egen övning       [Spara] │
│                                 │
│ Namn *                         │
│ ┌───────────────────────────┐  │
│ │                           │  │
│ └───────────────────────────┘  │
│                                 │
│ Syfte *                        │
│ ┌───────────────────────────┐  │
│ │                           │  │
│ └───────────────────────────┘  │
│                                 │
│ Ålder (från–till) *            │
│ ┌───────┐    ┌───────┐         │
│ │ 10    │ –  │ 12    │         │
│ └───────┘    └───────┘         │
│                                 │
│ Spelform(er) *                 │
│ ☐ 5 mot 5 ☑ 7 mot 7 ☐ 9 mot 9  │
│                                 │
│ Nivå (en eller flera) *        │
│ ☑ Grund ☑ Fortsättning ☐ Förd. │
│                                 │
│ Fokusområden (1–3) *           │
│ (samma grupperade lista som     │
│  i underlaget, filtrerad efter  │
│  angiven ålder)                 │
│                                 │
│ Del av passet *                │
│ ☑ Uppvärmning ☐ Öva            │
│ ☐ Spelövning ☐ Spel            │
│                                 │
│ Ledarbehov per grupp *         │
│ ○ 0 – självgående               │
│ ● 1 – en ledare per grupp        │
│ ○ 2 – två ledare per grupp        │
│                                 │
│ Antal spelare (min–max) *      │
│ ┌───────┐    ┌───────┐         │
│ │ 4     │ –  │ 8     │         │
│ └───────┘    └───────┘         │
│                                 │
│ Grupptyp *                     │
│ ○ Fri ● Par ○ Två lag ○ Fast   │
│                                 │
│ Tid (kortast/rek./längst) *    │
│ ┌────┐ ┌────┐ ┌────┐            │
│ │ 5  │ │ 8  │ │ 12 │  minuter    │
│ └────┘ └────┘ └────┘            │
│                                 │
│ Beskrivning *                  │
│ ┌───────────────────────────┐  │
│ │ (flerradigt textfält)      │  │
│ └───────────────────────────┘  │
│                                 │
│ Organisation                   │
│ Coachningspunkter               │
│ Varianter (lättare/svårare)     │
│ Anpassning (fler/färre spelare, │
│ udda antal, fler/färre ledare)  │
│ Material                        │
│ (samtliga som utfällbara fält)  │
│                                 │
│ Planskiss                      │
│ ┌───────────────────────────┐  │
│ │  + Rita planskiss           │  │  ← öppnar planskiss-
│ │  (valfritt, kan läggas till │  │    modulens eget gränssnitt
│ │  senare)                    │  │
│ └───────────────────────────┘  │
│                                 │
│ ┌───────────────────────────┐  │
│ │        Spara övning        │  │  ← sticky
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

## Beteende och tillstånd

- **Fält märkta \* är de som R-001 till R-009 kräver** för att övningen ska kunna användas i ett pass (bytas in enligt R-106). Namn, syfte och beskrivning krävs alltid för att övningen ska visas begripligt (berättelse 02, kriterium 2 / R-106 punkt 2).
- **Spara med saknade fält (13.2):** "Spara övning" sparar alltid övningen med status `utkast`, oavsett om obligatoriska fält saknas. Saknas något visas i stället för en bekräftelse en ruta: "Övningen är sparad, men saknar: Antal spelare, Tid. Den kan inte användas i ett pass förrän de är ifyllda." med en genväg till att fortsätta fylla i.
- **Fokusområden filtreras efter angiven ålder**, precis som i underlaget (01.9), eftersom en övning bara får taggas med fokus som passar hela dess åldersspann (R-002).
- **Nickspel:** om ledaren själv väljer `nickspel` som fokusområde måste angiven lägsta ålder vara minst 13 (R-081); annars visas ett fel vid det fältet. Formuläret frågar inte rakt ut om övningen innehåller nickning (beslutat Could i backlogen) – ledaren märker själv med `nickspel`.
- **Planskiss (13.3):** "+ Rita planskiss" öppnar planskissmodulens egna gränssnitt (ägs av planskissutvecklaren). Väljer ledaren att inte rita en skiss sparas övningen ändå, och visas senare med markeringen "Planskiss saknas" (jämför 06.2).
- **Grupptyp "Två lag":** väljer ledaren "Spel" som del av passet tvingas grupptypen till "Två lag" (R-008), med en kort förklarande text.

## Tillgänglighet

- Varje fält har en synlig etikett och, där det behövs, en kort hjälptext under fältet (inte bara en tooltip som kräver hover).
- Obligatoriska fält märks med både asterisk och ordet "obligatoriskt" för skärmläsare (`aria-required`), inte bara en visuell asterisk.
- Grupperingar (till exempel Ålder, Tid) har en gemensam `fieldset`/`legend`-motsvarighet så att sambandet mellan de två talen framgår för skärmläsare.
