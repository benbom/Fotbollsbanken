Status: utkast

# Vy: Skapa egen övning

**Uppfyller:** berättelse 13 (skapa egen övning).

**Planskiss i version 1:** det finns ingen ritredigerare. En egen övning saknar alltid planskiss och visas med "Planskiss saknas", precis som en bankövning utan skiss (jämför 06.2). Formuläret har därför inget fält för planskiss.

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
│ Skriv inga namn på spelare.     │
│                                 │
│ Organisation                   │
│ Coachningspunkter               │
│ Varianter (lättare/svårare)     │
│ Anpassning (fler/färre spelare, │
│ udda antal, fler/färre ledare)  │
│ Material                        │
│ (samtliga som utfällbara fält)  │
│                                 │
│ Planskiss saknas. Det går inte  │
│ att rita en planskiss för egna  │
│ övningar i den här versionen.   │
│                                 │
│ ┌───────────────────────────┐  │
│ │        Spara övning        │  │  ← sticky
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

## Beteende och tillstånd

- **Fält märkta \* är de som R-001 till R-009 kräver** för att övningen ska kunna användas i ett pass (bytas in enligt R-106). Namn, syfte och beskrivning krävs alltid för att övningen ska visas begripligt (berättelse 02, kriterium 2 / R-106 punkt 2).
- **Spara med saknade fält (13.2):** "Spara övning" sparar alltid övningen, med markeringen av vad som saknas, oavsett om obligatoriska fält saknas. En egen övning har ingen granskningsstatus (`docs/adr/0010-ovningsformat-och-lagring.md`, avsnitt 4) – den är antingen "Ofullständig" eller "Klar att använda". Saknas något visas i stället för en bekräftelse en ruta: "Övningen är sparad, men saknar: Antal spelare, Tid. Den kan inte användas i ett pass förrän de är ifyllda." med en genväg till att fortsätta fylla i.
- **Fokusområden filtreras efter angiven ålder**, precis som i underlaget (01.9), eftersom en övning bara får taggas med fokus som passar hela dess åldersspann (R-002).
- **Nickspel:** om ledaren själv väljer `nickspel` som fokusområde måste angiven lägsta ålder vara minst 13 (R-081); annars visas ett fel vid det fältet. Formuläret frågar inte rakt ut om övningen innehåller nickning (beslutat Could i backlogen) – ledaren märker själv med `nickspel`.
- **Planskiss (13.3):** finns inte i version 1. Övningen sparas och visas alltid med markeringen "Planskiss saknas" (jämför 06.2), oavsett hur komplett den i övrigt är.
- **Skriv inga namn på spelare:** hjälptexten under Beskrivning finns eftersom fritext är den plats där ett barns namn lättast smyger sig in (säkerhetsgranskningens fynd S-20). Samma hjälptext bör gälla var fritext förekommer i formuläret; Beskrivning är fältet flest fyller i och visas här som exempel.
- **Grupptyp "Två lag":** väljer ledaren "Spel" som del av passet tvingas grupptypen till "Två lag" (R-008), med en kort förklarande text.

## Tillgänglighet

- Varje fält har en synlig etikett och, där det behövs, en kort hjälptext under fältet (inte bara en tooltip som kräver hover).
- Obligatoriska fält märks med både asterisk och ordet "obligatoriskt" för skärmläsare (`aria-required`), inte bara en visuell asterisk.
- Grupperingar (till exempel Ålder, Tid) har en gemensam `fieldset`/`legend`-motsvarighet så att sambandet mellan de två talen framgår för skärmläsare.
