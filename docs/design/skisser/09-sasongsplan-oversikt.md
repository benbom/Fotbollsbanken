Status: godkänd (K2, 2026-09-12)

# Vy: Säsongsplan – översikt

**Uppfyller:** berättelse 25 (se översikt över säsongsplanen).

**Läge:** Planeringsläget.

## Wireframe, 360 px

```
┌────────────────────────────────┐
│ ← Säsongsplan P11 Blå           │
│   3 aug 2026 – 13 jun 2027      │
│                                 │
│ ┌─────────┬─────────┬────────┐ │
│ │ Höst 26 │ Vinter  │ Vår 27 │ │  ← perioder som flikar/
│ └─────────┴─────────┴────────┘ │    genvägar för snabb bläddring
│                                 │
│ Vecka 32 · 3–9 aug              │
│ ┌───────────────────────────┐  │
│ │ Inget pass planerat         │  │
│ └───────────────────────────┘  │
│                                 │
│ Vecka 33 · 10–16 aug            │
│ ┌───────────────────────────┐  │
│ │ 2 pass                      │  │
│ │ Fokus: Bollkänsla,           │  │
│ │ Koordination                 │  │
│ │              [Öppna vecka]  │  │
│ └───────────────────────────┘  │
│                                 │
│ Vecka 34 · 17–23 aug            │
│ ┌───────────────────────────┐  │
│ │ 1 pass                      │  │
│ │ Fokus: Dribbling             │  │
│ │              [Öppna vecka]  │  │
│ └───────────────────────────┘  │
│                                 │
│ … (skrollbar, en vecka i taget, │
│    grupperad under respektive   │
│    period)                      │
│                                 │
│ ┌───────────────────────────┐  │
│ │ ↑ Till idag / aktuell vecka│  │  ← flytande genväg
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

## Wireframe, 360 px – Öppna en vecka med flera pass

```
┌────────────────────────────────┐
│ ✕ Vecka 33 har 2 pass           │
│                                 │
│ ┌───────────────────────────┐  │
│ │ Mån 10 aug · Bollkänsla     │  │
│ └───────────────────────────┘  │
│ ┌───────────────────────────┐  │
│ │ Tor 13 aug · Koordination   │  │
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

## Beteende och tillstånd

- **Kronologisk lista (25.1):** alla veckor visas i ordning, grupperade under perioder (försäsong, vår, sommaruppehåll, höst, vinter enligt `docs/doman/sasongsprogression.md`) som flikar eller genvägslänkar, så att ledaren snabbt kan hoppa till rätt del av säsongen i stället för att skrolla igenom 40+ veckor manuellt (25.3).
- **Varje veckorad** visar antal pass och veckans fokus (utan dubletter, R-110), eller "Inget pass planerat" för tomma veckor.
- **Öppna en vecka (25.2):** har veckan bara ett pass öppnas det direkt. Har veckan flera pass visas ett litet urval (som i skissen ovan) innan ledaren kommer till själva passet.
- **Bläddring på mobil (25.3):** periodflikarna fungerar som ankarlänkar till rätt del av den skrollbara listan, plus en flytande genväg "Till idag" som hoppar till innevarande vecka – detta ersätter en tung kalendervy som skulle bli svår att använda på 360 px bredd.
- **Ingen redigering här:** översikten är läsläge för helheten. Ändringar (byta pass, lägga till) görs i veckovyn (`08-sasongsplan-vecka.md`).

## Tillgänglighet

- Periodflikarna är verkliga länkar/flikar med tangentbordsnavigering, inte bara klickbara `div`.
- Veckoradernas information (antal pass, fokus) läses i en begriplig ordning av skärmläsare innan "Öppna vecka"-knappen.
- Kontrast för "Inget pass planerat"-text uppfyller samma AA-krav som övrig text, även om den är avsiktligt mer diskret (se `designsystem.md`).
