Status: utkast

# Vy: Klubbens egna övningar (lista, skicka in, åtgärda)

**Uppfyller:** berättelse 14 (hantera klubbens egna övningar), 15 (skicka in till banken), 17 (åtgärda och skicka in igen).

**Läge:** Planeringsläget.

## Wireframe, 360 px – Lista

```
┌────────────────────────────────┐
│ ← Klubbens egna övningar        │
│                      [+ Ny]    │
│                                 │
│ ┌───────────────────────────┐  │
│ │ Vår passningslek            │  │
│ │ Passning och mottagning ·    │  │
│ │ Skapad av Anna L.            │  │
│ │ Ofullständig                 │  │
│ │        [Öppna]              │  │
│ └───────────────────────────┘  │
│ ┌───────────────────────────┐  │
│ │ Kullek utan mål              │  │
│ │ Avslut · Skapad av Anna L.   │  │
│ │ Klar att använda             │  │
│ │        [Öppna] [Skicka in]  │  │
│ └───────────────────────────┘  │
│ ┌───────────────────────────┐  │
│ │ Kullek med mål               │  │
│ │ Avslut · Skapad av Björn E.  │  │
│ │ Status: Inskickad, väntar    │  │
│ │ på granskning                │  │
│ │        [Öppna]              │  │
│ └───────────────────────────┘  │
│ ┌───────────────────────────┐  │
│ │ 4 mot 4 med kantzoner        │  │
│ │ Spela tillsammans ·           │  │
│ │ Skapad av Anna L.            │  │
│ │ Status: Åtgärda ⚠            │  │
│ │        [Öppna]              │  │
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

## Wireframe, 360 px – Öppen övning, status "Åtgärda" (17)

```
┌────────────────────────────────┐
│ ← 4 mot 4 med kantzoner          │
│                                 │
│ ⚠ Redaktören vill att du         │
│   ändrar något innan övningen   │
│   kan godkännas:                │
│                                 │
│ "Beskrivningen saknar hur        │
│  kantzonerna ska markeras.       │
│  Lägg gärna till ett mått."      │
│  – Granskad 20 sep 2026          │
│                                 │
│ ▾ Tidigare kommentarer (1)      │
│   "Fokus stämmer inte med        │
│   syftet." – 10 sep 2026         │
│                                 │
│ ┌───────────────────────────┐  │
│ │      Redigera övning       │  │
│ └───────────────────────────┘  │
│                                 │
│ (formulär som i                 │
│  10-skapa-egen-ovning.md,       │
│  förifyllt)                     │
│                                 │
│ ┌───────────────────────────┐  │
│ │  Spara och skicka in igen  │  │
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

## Wireframe, 360 px – Ta bort/redigera medan under granskning (14.4)

```
┌────────────────────────────────┐
│ Kullek med mål                  │
│                                 │
│  Den här övningen är inskickad  │
│  och väntar på granskning i     │
│  den gemensamma banken. Du kan  │
│  inte ändra eller ta bort den    │
│  förrän granskningen är klar.    │
│                                 │
│ ┌───────────────────────────┐  │
│ │      Tillbaka               │  │
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

## Beteende och tillstånd

- **Alla klubbens övningar synliga för alla ledare (14.1):** listan visar övningar oavsett vem i klubben som skapat dem, med skapare angiven.
- **Redigera (14.2):** ändringar sparas och syns direkt för hela klubben, ingen godkännandeprocess internt.
- **Ta bort (14.3):** en bekräftelsedialog ("Ta bort 'Vår passningslek'? Pass som redan använder den påverkas inte.") följt av att övningen försvinner från listan och inte längre kan väljas vid byte av övning (04).
- **Under granskning (14.4):** "Redigera" och "Ta bort" är dolda/utbytta mot en förklarande text (se tredje skissen) i stället för att vara klickbara men ge ett fel efteråt.
- **Skicka in (15.1, 15.2):** knappen "Skicka in" visas bara på övningar med alla obligatoriska fält ifyllda. Saknas fält visas i stället en gråmarkerad knapp med texten "Komplettera för att skicka in" som leder till formuläret och visar vad som saknas.
- **Redan inskickad (15.4):** "Skicka in"-knappen ersätts av statusen "Inskickad, väntar på granskning" utan någon insändningsknapp kvar, så att en dubblett aldrig kan skapas av misstag.
- **Två skilda markeringar, inte en statuskedja (`docs/adr/0010-ovningsformat-och-lagring.md`, avsnitt 4):** en egen övning som inte är inskickad visar bara om den är **"Ofullständig"** eller **"Klar att använda"** – det är inget den granskas mot, bara ett härlett resultat av vilka fält som är ifyllda. Så fort övningen skickas in ersätts den markeringen av dess **status i redaktörskön**: "Inskickad, väntar på granskning", "Godkänd" eller "Åtgärda". En övning har alltså aldrig båda samtidigt.
- **Redan inskickad (15.4):** "Skicka in"-knappen ersätts av statusen "Inskickad, väntar på granskning" utan någon insändningsknapp kvar, så att en dubblett aldrig kan skapas av misstag.
- **Åtgärda-flödet (17.1–17.3):** kommentaren från senaste granskningen visas överst och kan inte missas. Tidigare kommentarer nås i en utfällbar historik, i kronologisk ordning. Efter "Spara och skicka in igen" återgår status till `inskickad` i redaktörskön.

## Tillgänglighet

- Statusar förmedlas med text, inte bara med färg eller en ensam ikon (⚠ har alltid ordet "Åtgärda" bredvid sig).
- "Komplettera för att skicka in"-knappen har `aria-disabled` snarare än att vara helt dold, med en förklarande text kopplad via `aria-describedby`.
