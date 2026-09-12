Status: godkänd (K2, 2026-09-12)

# Vy: Säsongsplan – vecka och skapa plan

**Uppfyller:** berättelse 23 (skapa säsongsplan), 24 (lägga pass i säsongsplanen med progression, åldersvarning).

**Läge:** Planeringsläget.

## Wireframe, 360 px – Skapa säsongsplan (finns ingen plan än)

```
┌────────────────────────────────┐
│ ← Säsongsplan för P11 Blå       │
│                                 │
│  Ni har ingen säsongsplan än.   │
│                                 │
│  Startdatum                    │
│  ┌───────────────────────────┐ │
│  │ 2026-08-03                │ │
│  └───────────────────────────┘ │
│  Slutdatum                     │
│  ┌───────────────────────────┐ │
│  │ 2027-06-13                │ │
│  └───────────────────────────┘ │
│                                 │
│ ┌───────────────────────────┐  │
│ │   Skapa säsongsplan        │  │
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

## Wireframe, 360 px – Vecka med pass

```
┌────────────────────────────────┐
│ ← Vecka 39 · 21–27 sep          │
│                                 │
│ Ålder denna vecka: 11 år        │
│ (fas 10–12 år)                  │
│                                 │
│ Veckans fokus:                  │
│ Passning och mottagning,        │
│ Spela tillsammans                │
│                                 │
│ ┌───────────────────────────┐  │
│ │ Tis 22 sep · 60 min         │  │
│ │ "11 år · 7 mot 7 ·          │  │
│ │ Passning 24 sep"            │  │
│ │ Fokus: Passning och          │  │
│ │ mottagning                   │  │
│ │        [Öppna pass]         │  │
│ └───────────────────────────┘  │
│ ┌───────────────────────────┐  │
│ │ Tor 24 sep · 60 min         │  │
│ │ "11 år · 7 mot 7 · Avslut"  │  │
│ │ Fokus: Spela tillsammans      │  │
│ │        [Öppna pass]         │  │
│ └───────────────────────────┘  │
│                                 │
│ ┌───────────────────────────┐  │
│ │  + Lägg till pass på veckan│  │
│ └───────────────────────────┘  │
│                                 │
│ ⚠ Ett av veckans pass skapades  │
│   för 10 år. Kontrollera att    │
│   det fortfarande passar.       │
└────────────────────────────────┘
```

## Wireframe, 360 px – Tom vecka

```
┌────────────────────────────────┐
│ ← Vecka 40 · 28 sep–4 okt       │
│                                 │
│ Ålder denna vecka: 11 år        │
│                                 │
│  Inget pass planerat den här    │
│  veckan.                        │
│                                 │
│ ┌───────────────────────────┐  │
│ │  + Lägg till pass          │  │
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

## Wireframe, 360 px – Lägga till pass (välj källa)

```
┌────────────────────────────────┐
│ ✕ Lägg pass på vecka 40         │
│                                 │
│ ┌───────────────────────────┐  │
│ │  Välj bland sparade pass   │  │
│ └───────────────────────────┘  │
│ ┌───────────────────────────┐  │
│ │  Generera nytt pass för    │  │
│ │  den här veckan            │  │
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

## Beteende och tillstånd

- **Skapa plan (23.1):** anger start- och slutdatum. Appen delar automatiskt in i veckor (visas inte i denna skiss, men listan/kalendern nås via `09-sasongsplan-oversikt.md`).
- **Befintlig plan varnar (23.2):** finns redan en plan visas i stället: "P11 Blå har redan en säsongsplan (aug 2026–jun 2027). Vill du öppna den?" med länk – ingen möjlighet att råka skriva över.
- **Delad plan (23.3):** alla ledare i laget ser och kan ändra samma plan, utan separat behörighetsnivå (jämför berättelse 11: alla ledare i ett lag har samma rättigheter).
- **Flera pass per vecka (24.1):** varje pass listas som ett eget kort med datum. Ingen övre gräns i gränssnittet.
- **Veckans fokus (24.2, R-110):** listan av fokusområden räknas fram automatiskt från veckans pass, utan dubletter, i den ordning de först förekom i datumordning – ledaren väljer inget här, det är alltid ett resultat.
- **Byta pass på en vecka (24.3):** "Öppna pass" leder till passvyn där ledaren kan ta bort kopplingen eller byta till ett annat sparat pass; övriga veckor påverkas inte.
- **Ålder över årsskifte (24.3, R-113):** "Ålder denna vecka" visas alltid överst, uträknad enligt R-113, oavsett vilken ålder det kopplade passet skapades för.
- **Åldersvarning (24.5):** en gul varningsruta visas när ett kopplat pass' ålder skiljer sig från veckans ålder. Om passet dessutom innehåller en övning märkt `nickspel` och veckans ålder är under 13 år visas varningen alltid, med skärpt formulering (se `texter.md`).
- **Tom vecka (24.4):** visas tydligt som "Inget pass planerat", aldrig som ett fel eller en tom vit yta.
- **Lägg till pass:** ledaren väljer mellan att koppla ett redan sparat pass eller generera ett nytt direkt för veckan (vilket förifyller ålder i underlaget med veckans ålder, se R-113).

## Tillgänglighet

- Datumfält använder inbyggda datumväljare där plattformen har det, med tydlig textetikett och möjlighet att skriva datumet direkt (inte tvingad kalender-widget).
- Varningsrutan är kopplad till veckans innehåll med `aria-describedby` eller motsvarande, så att den läses upp tillsammans med passlistan.
