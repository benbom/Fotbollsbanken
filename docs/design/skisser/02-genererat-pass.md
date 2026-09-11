Status: utkast

# Vy: Genererat pass

**Uppfyller:** berättelse 02 (generera träningspass), 07 (planskisser i pass, inbäddat), delar av 03 (tomma delar), ingång till 04 (byta övning) och 05 (spara).

**Läge:** Planeringsläget.

## Wireframe, 360 px

```
┌────────────────────────────────┐
│ ← Ditt pass            [Spara] │
│                                 │
│ 7 mot 7 · Fortsättning · 60 min │
│ Faktisk tid: 58 min             │
│ Fokus: Passning och mottagning, │
│ Spela tillsammans                │
│                                 │
│ ⚠ Kom ihåg benskydd – spel      │
│   innehåller alltid närkamper.  │
│ ⚠ Se till att alla mål är       │
│   förankrade.                   │
│ 💡 Ni är fler än 8 spelare per  │
│   ledare – be gärna en förälder │
│   om hjälp.                     │
│                                 │
│ ──────────────────────────────  │
│ 1. UPPVÄRMNING · 10 min         │
│ ┌───────────────────────────┐  │
│ │ [Planskiss, liten]         │  │
│ │ Passningslek i ruta         │  │
│ │ Syfte: komma igång, träna   │  │
│ │ första touchen              │  │
│ │ [Byt övning]  [Visa mer ▾] │  │
│ └───────────────────────────┘  │
│                                 │
│ 2. ÖVA · 11 min · 2 stationer  │
│ ┌───────────────────────────┐  │
│ │ Station A: Passning med    │  │
│ │ vändning (5 min)            │  │
│ │ [Planskiss] [Byt] [Mer ▾]  │  │
│ ├───────────────────────────┤  │
│ │ Station B: Passningsbana   │  │
│ │ i par (5 min)               │  │
│ │ [Planskiss] [Byt] [Mer ▾]  │  │
│ └───────────────────────────┘  │
│                                 │
│ 💧 Vattenpaus · 2 min           │
│                                 │
│ 3. SPELÖVNING · 12 min          │
│ ┌───────────────────────────┐  │
│ │ [Planskiss]                │  │
│ │ 3 mot 3 med joker           │  │
│ │ [Byt övning]  [Visa mer ▾] │  │
│ └───────────────────────────┘  │
│                                 │
│ 4. SPEL · Övning saknas         │
│ ┌───────────────────────────┐  │
│ │ Vi kunde inte hitta en      │  │
│ │ övning som passade den här  │  │
│ │ delen. Måltid: 19 min.      │  │
│ │ Testa att ändra: nivå,      │  │
│ │ antal spelare eller yta.    │  │
│ └───────────────────────────┘  │
│                                 │
│ 5. AVSLUTNING · 5 min (fast)    │
│ Samling: vad tränade vi på,     │
│ vad gick bra?                   │
│                                 │
│ ┌───────────────────────────┐  │
│ │        Spara pass          │  │  ← sticky, 48 px
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

## Beteende och tillstånd

- **Delnamn och ordning (02.2, R-030):** delarna visas alltid i fast ordning: Uppvärmning, Öva, Spelövning, Spel, Avslutning, med sina fasta nycklar dolda för ledaren (bara namnen visas).
- **Varje övning visar minst** namn, syfte, tilldelad tid och planskiss (eller "Planskiss saknas") (02.2, 06.2). Full beskrivning, coachningspunkter och varianter (R-029) nås via "Visa mer" som fäller ut i samma kort, utan sidbyte.
- **Stationer (02.4):** när en del har ett stationsmoment visas varje station som en egen rad inom samma kort, tydligt numrerad A, B, C … med egen tid och egen "Byt"-knapp (byte gäller den stationens övning).
- **Tom del (02.16, 03.4, R-100):** visas med delens namn, måltid och texten "Vi kunde inte hitta en övning …". Om orsaken är ett enskilt val som skulle kunna lösa det (R-103) listas de valen. Om delen i sig går att fylla men inte ihop med resten av passet (R-100 andra punkten) visas i stället: "De övningar som annars skulle passa här gick inte att kombinera med resten av passet." (skiljer sig medvetet från meddelandet ovan, se `texter.md`).
- **Tips om många spelare per ledare (02.13, R-021):** visas som en gul infobox direkt under sammanfattningen, alltid synlig när tillämpligt, aldrig gömd bakom en klick.
- **Säkerhetspåminnelser (02.15):** benskydd visas alltid. Mål-påminnelsen visas bara när någon övning i passet har mål i sitt material.
- **Total tid (02.8):** "Faktisk tid" visas bredvid den begärda längden när de skiljer sig åt (aldrig längre, högst 5 minuter kortare).
- **Byt övning:** öppnar `04-byt-ovning.md` för just den övningen/stationen.
- **Spara pass:** öppnar namnge-steget, se `05-sparade-pass.md`.
- **Inget pass alls kunde skapas:** denna vy visas då inte över huvud taget – ledaren kommer i stället till `03-inget-matchande-resultat.md` direkt från underlagsvyn.

## Tillgänglighet

- Rubriknivåer: delnamnen är riktiga rubriker (h2/motsvarande) så att en skärmläsare kan navigera mellan delarna.
- "Visa mer ▾" är en riktig disclosure-knapp med `aria-expanded`.
- Varningar (⚠) och tips (💡) har text som förmedlar innebörden utan ikonen (ikonen är dekorativ, inte enda bäraren av information).
- Kontrast: se `designsystem.md` för varnings-/tipsfärger i ljust och mörkt läge.

## Utskrift och planläge

- Samma passdata återanvänds i `06-planlage.md` (en övning i taget) och `07-utskrift.md` (allt på en gång, i A4-format). Den här vyn är arbetsytan; de andra två är renodlade vyer för sina egna syften.
