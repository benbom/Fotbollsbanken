Status: utkast

# Vy: Redaktörskö och granskning

**Uppfyller:** berättelse 16 (redaktören granskar en inskickad övning), 18 (utse ytterligare redaktör).

**Läge:** Planeringsläget. Fungerar på både mobil och dator (redaktörsarbete görs sannolikt oftare vid en dator, men ska inte kräva det).

## Wireframe, 360 px – Kön

```
┌────────────────────────────────┐
│ Redaktörskö (3 väntar)          │
│                                 │
│ ┌───────────────────────────┐  │
│ │ Kullek med mål               │  │
│ │ Inskickad av Björn E.,       │  │
│ │ IK Exempel · 18 sep 2026     │  │
│ │ Avslut · 6–7 år · 3 mot 3    │  │
│ │              [Granska]      │  │
│ └───────────────────────────┘  │
│ ┌───────────────────────────┐  │
│ │ Vändningsövning i par        │  │
│ │ Inskickad av Anna L.,        │  │
│ │ IK Exempel · 19 sep 2026     │  │
│ │ Dribbling · 10–12 år · 7mot7 │  │
│ │              [Granska]      │  │
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

## Wireframe, 360 px – Granska en övning

```
┌────────────────────────────────┐
│ ← Kullek med mål                 │
│                                 │
│ Syfte: träna avslut i lekform   │
│ Ålder: 6–7 år · Spelform: 3mot3 │
│ Nivå: Grund                     │
│ Fokus: Avslut                   │
│ Spelare: 4–12 · Ledare: 1        │
│ Tid: 5/8/10 min                 │
│ Grupptyp: Fri · Del: Uppvärmning│
│                                 │
│ [Planskiss]                     │
│                                 │
│ Beskrivning: …                  │
│ Organisation: …                 │
│ Coachningspunkter: …            │
│ Varianter: …                    │
│ Material: koner, 4 mål           │
│                                 │
│ ┌───────────────────────────┐  │
│ │       ✔ Godkänn            │  │
│ └───────────────────────────┘  │
│ ┌───────────────────────────┐  │
│ │       ✎ Skicka åtgärda      │  │
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

## Wireframe, 360 px – Skicka tillbaka med kommentar

```
┌────────────────────────────────┐
│ ✕ Skicka åtgärda: Kullek med    │
│   mål                           │
│                                 │
│ Kommentar till Björn E. *       │
│ ┌───────────────────────────┐  │
│ │ Beskrivningen saknar hur    │  │
│ │ kantzonerna ska markeras.   │  │
│ │ Lägg gärna till ett mått.   │  │
│ └───────────────────────────┘  │
│                                 │
│ ┌───────────────────────────┐  │
│ │  Skicka åtgärda-begäran     │  │
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

## Wireframe, 360 px – Utse redaktör (18)

```
┌────────────────────────────────┐
│ ← Redaktörer                    │
│                                 │
│ ┌───────────────────────────┐  │
│ │ Du (redaktör sedan start)  │  │
│ └───────────────────────────┘  │
│ ┌───────────────────────────┐  │
│ │ Anna Larsson                │  │
│ │        [Ta bort behörighet]│  │
│ └───────────────────────────┘  │
│                                 │
│ Utse ny redaktör                │
│ ┌───────────────────────────┐  │
│ │ Sök registrerad person…    │  │
│ └───────────────────────────┘  │
│ ┌───────────────────────────┐  │
│ │      Gör till redaktör     │  │
│ └───────────────────────────┘  │
│                                 │
│ Personen måste redan ha ett     │
│ konto i Fotbollsbanken.         │
└────────────────────────────────┘
```

## Beteende och tillstånd

- **Kön (16.1):** listar alla inskickade övningar (status `utkast` i redaktörskön, se `content/ovningar/README.md`) med den information redaktören behöver för att bedöma utan att öppna varje övning: namn, insändare, klubb, datum, ålder, spelform, huvudfokus.
- **Godkänn (16.2):** en enda tydlig knapp. Ingen bekräftelsedialog krävs, men en kort bekräftelse ("Godkänd – nu valbar för alla klubbar") visas efteråt, och övningen försvinner ur kön.
- **Skicka åtgärda (16.3):** kommentarfältet är obligatoriskt (kan inte skickas tomt) – en övning ska aldrig skickas tillbaka utan förklaring. Insändaren meddelas (kanal beslutas vid K2, till exempel e-post eller notis i appen).
- **Ingen automatisk godkännande (16.4):** det finns inget gränssnitt eller genväg någonstans i appen som sätter status `godkand` utan att en redaktör tryckt "Godkänn" i den här vyn.
- **Utse redaktör (18.1, 18.2):** sökfältet matchar bara mot redan registrerade konton. Hittas ingen träff visas "Personen har inget konto än. Be personen registrera sig först."
- **Återkalla behörighet (18.3):** "Ta bort behörighet" tar bort redaktörsrollen men rör inte personens övriga roller (ledare, klubbadmin).

## Tillgänglighet

- Kölistans kort är strukturerade så att en skärmläsare läser namn, insändare och nyckelfakta innan "Granska"-knappen.
- "Godkänn" och "Skicka åtgärda" har tydligt olika färg *och* form/ikon (inte bara grön/röd), för användare med färgseende-nedsättning.
- Kommentarfältet har en synlig felmarkering om redaktören försöker skicka utan text.
