Status: utkast

# Vy: Utskrift/PDF av ett pass (A4)

**Uppfyller:** berättelse 22 (skriva ut ett pass som PDF).

**Läge:** Planeringsläget. Det här är inte en skärmvy i vanlig mening utan en utskriftsanpassad version av passet, tänkt att fungera både som webbläsarens "Skriv ut" och som en nedladdningsbar PDF. Layouten är porträtt-A4 (210 × 297 mm), inte 360 px mobil.

## Skiss, A4 stående

```
┌──────────────────────────────────────────┐
│ Fotbollsbanken                Sida 1 av 2 │
│ 11 år · 7 mot 7 · Fortsättning · 60 min   │
│ Fokus: Passning och mottagning,           │
│ Spela tillsammans                          │
│ ──────────────────────────────────────── │
│                                            │
│ ⚠ Alla mål ska vara förankrade så de       │
│   inte kan välta.                          │
│ ⚠ Använd benskydd – spel innehåller alltid │
│   närkamper.                               │
│                                            │
│ 1. UPPVÄRMNING · 10 min                   │
│ ┌───────────┐ Passningslek i ruta         │
│ │ [Planskiss│ Syfte: komma igång, träna    │
│ │  svart/vit│ första touchen               │
│ │  linjer]  │ Coachning: • håll huvudet    │
│ └───────────┘ uppe • mjuk första touch     │
│                                            │
│ 2. ÖVA · 11 min                           │
│ Station A (5 min)      Station B (5 min)  │
│ ┌─────────┐            ┌─────────┐        │
│ │[Skiss A]│            │[Skiss B]│        │
│ └─────────┘            └─────────┘        │
│ Passning med vändning.  Passningsbana i    │
│ Syfte: …                par. Syfte: …      │
│                                            │
│ ──────────────────────────────────────── │
│                              Sida 1 av 2  │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ Fotbollsbanken                Sida 2 av 2 │
│                                            │
│ 3. SPELÖVNING · 12 min                    │
│ ┌───────────┐ 3 mot 3 med joker            │
│ │ [Planskiss]│ Syfte: …                    │
│ └───────────┘                              │
│                                            │
│ 4. SPEL · Övning saknas för den här delen  │
│                                            │
│ 5. AVSLUTNING · 5 min                     │
│ Samling: vad tränade vi på, vad gick bra? │
│                                            │
│ Skapat i Fotbollsbanken · 24 september    │
│ 2026                                       │
└──────────────────────────────────────────┘
```

## Beteende och tillstånd

- **Innehåll per övning (22.1):** namn, syfte, beskrivning, tid och planskiss för varje övning, i ordning, sida efter sida (inte allt hoptryckt på en sida om det inte får plats).
- **Saknad planskiss (22.2, 06.2):** rutan där skissen skulle varit ersätts med texten "Planskiss saknas" i en tunn ram – dokumentet fortsätter som vanligt, ingen lucka eller fel för resterande övningar.
- **Svartvitt (22.3):** hela layouten är designad för att fungera utan färg:
  - Varningar (⚠) markeras med fetstil och ram, inte bara gul färg.
  - Planskisser ritas i svart på vitt med tydliga linjer och mönster (se `designsystem.md` och planskissutvecklarens ansvar för själva ritningen) – inte enbart färgkodning för lag/roller.
  - Rubriker och delnamn särskiljs med typografi (storlek, fetstil, versaler) snarare än färg.
- **Sidbrytning:** en övning bryts aldrig mitt itu mellan planskiss och text – hela övningskortet flyttas till nästa sida om det inte får plats.
- **Tom del** (t.ex. Spel i exemplet) skrivs ut med sin rubrik och texten att övning saknas, i stället för att tyst hoppa över, i linje med hur den visas i appen (02.16).
- **Sidfot:** datum för utskrift/export och sidnummer, så att lösa papper på planen går att sortera.
- **Ingen extra kostnad (22.4):** funktionen kräver inget köp, konto-uppgradering eller extern tjänst som kostar per export.

## Tillgänglighet och teknik (designkrav, tekniklösning vid K2)

- Dokumentet ska gå att skapa både via webbläsarens vanliga utskriftsfunktion och som nedladdningsbar fil, så att en ledare utan skrivare hemma kan spara filen och skriva ut den på annat håll.
- Textstorlek i utskrift minst 10 pt för brödtext, rubriker tydligt större, så att det går att läsa ett papper som ligger på gräset i solljus.
- Planskissens minsta bredd i utskrift: se `designsystem.md`.
