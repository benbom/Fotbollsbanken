Status: utkast

# Vy: Inget matchande resultat

**Uppfyller:** berättelse 03 (inget matchande resultat), R-100 till R-103.

**Läge:** Planeringsläget.

**Viktigt designval:** den här vyn visas bara när **inget pass alls** kunde skapas (R-101: ingen av Öva, Spelövning, Spel kunde fyllas). Om minst en av dem kunde fyllas visas i stället `02-genererat-pass.md` med de tomma delarna markerade där. De två vyerna delar samma förklarande komponent för "varför", se nedan.

## Wireframe, 360 px

```
┌────────────────────────────────┐
│ ← Nytt pass                    │
│                                 │
│         🔍  (ingen ikon med     │
│          bara färg som signal)  │
│                                 │
│  Vi kunde inte skapa ett pass   │
│  med de här uppgifterna.        │
│                                 │
│  Det finns för få övningar som  │
│  matchar allt du valt. Prova    │
│  att ändra ett av de här:       │
│                                 │
│  • Nivå                        │
│  • Fokusområden (Avslut)        │
│  • Antal spelare                │
│                                 │
│  Vi ändrar ingenting åt dig –   │
│  gå tillbaka och justera det    │
│  du vill testa.                 │
│                                 │
│ ┌───────────────────────────┐  │
│ │   Ändra uppgifter (←)      │  │  ← 48 px, tar tillbaka
│ └───────────────────────────┘  │     till ifyllt underlag
│                                 │
│  Ditt underlag just nu:         │
│  11 år · 7 mot 7 · Fortsättning │
│  · 14 spelare · 2 ledare ·      │
│  60 min · Passning och          │
│  mottagning, Avslut              │
└────────────────────────────────┘
```

## Beteende och tillstånd

- **Vilka val pekas ut (03.2, R-103):** listan visar bara *vilka fält* som skulle kunna lösa problemet var för sig ("Nivå", "Fokusområden", "Antal spelare" osv.), aldrig ett förslag på nytt värde. Om ett specifikt fokusområde är boven (till exempel att just `avslut` gör att inget går ihop) namnges det området, som i exemplet ovan, men fortfarande utan ett förslag på ersättning.
- **Kan inte kombineras, inte ett enskilt val (R-100 andra punkten):** om orsaken inte går att härleda till ett enskilt fält (till exempel att en övning skulle behövas i två delar samtidigt) visas i stället en annan text: "Det finns övningar som skulle kunna passa var för sig, men de går inte att kombinera till ett helt pass med dina val." Ingen lista med fält visas då. Se `texter.md` för exakt formulering av båda varianterna.
- **"Ändra uppgifter":** går tillbaka till `01-underlag.md` med alla värden kvar ifyllda (03.3). Ledaren ändrar själv, appen ändrar aldrig ett värde automatiskt.
- **Sammanfattningen längst ner** låter ledaren se exakt vad hon eller han bad om, utan att behöva bläddra tillbaka för att minnas det.
- Vyn har ingen "försök igen automatiskt"-knapp, eftersom det inte finns något nytt att generera förrän ledaren ändrat något.

## Tillgänglighet

- Rubriken "Vi kunde inte skapa ett pass …" är en riktig h1/h2 så att skärmläsare direkt hör vad som hänt.
- Listan med fält är en riktig lista (`ul`/`li`), inte fritext med punkter, för korrekt uppläsning.
- Färgen på ikonen bär ingen egen betydelse (samma gråtoner i ljust/mörkt läge, se `designsystem.md`) – all information finns i texten.
