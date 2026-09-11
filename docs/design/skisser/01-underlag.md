Status: utkast

# Vy: Underlag för generatorn

**Uppfyller:** berättelse 01 (ange underlag och få spelform föreslagen), grunden för 02.

**Läge:** Planeringsläget.

**Princip:** ett fåtal steg, rimliga förval, senaste val sparas till nästa gång (se `.claude/agents/ux-designer.md`). Formuläret visas som en enda skrollbar sida på mobil, inte en flerstegs-wizard, så att ledaren ser hela underlaget och kan gå tillbaka och ändra utan att "backa" i flera steg.

## Wireframe, 360 px

```
┌────────────────────────────────┐
│ ← Nytt pass                    │
│                                 │
│ Ålder (den ålder flest fyller  │
│ i år)                    (i)   │
│ ┌───────────────────────────┐  │
│ │ 11                        │  │
│ └───────────────────────────┘  │
│                                 │
│ Spelform                       │
│ ┌─────────┬─────────┬───────┐  │
│ │ 5 mot 5 │ 7 mot 7●│ 9 mot 9│  │  ● = föreslagen/vald
│ └─────────┴─────────┴───────┘  │
│ Föreslagen utifrån åldern.      │
│                                 │
│ Nivå                    (i)    │
│ ┌───────────┬───────────┬────┐ │
│ │ Grund     │Fortsättn.●│Förd.│ │
│ └───────────┴───────────┴────┘ │
│                                 │
│ Antal spelare                  │
│ ┌───────────────────────────┐  │
│ │ 14                        │  │
│ └───────────────────────────┘  │
│                                 │
│ Antal ledare                   │
│ ┌───────────────────────────┐  │
│ │ 2                         │  │
│ └───────────────────────────┘  │
│                                 │
│ Passets längd (minuter)        │
│ ┌───────────────────────────┐  │
│ │ 60                        │  │
│ └───────────────────────────┘  │
│ Kortast 30, längst 90 min för   │
│ den här åldern.                 │
│                                 │
│ Fokusområden (välj 1–3)        │
│ ▾ Bollen och tekniken           │
│   ☐ Bollkänsla                 │
│   ☑ Passning och mottagning (K)│
│   ☐ Avslut (K)                 │
│ ▾ Spelet                       │
│   ☐ 1 mot 1                    │
│   ☑ Spela tillsammans (K)      │
│   ☐ Speluppbyggnad (K)         │
│   ☐ Försvarsspel (K)           │
│   ☐ Omställning (K)            │
│ ▸ Kropp och rörelse             │
│ ▸ Lek                          │
│                                 │
│ Yta (valfritt)          (i)    │
│ ┌───────┬────────┬───────────┐ │
│ │ Ingen●│Hel plan│Halv│Kvart │ │
│ └───────┴────────┴───────────┘ │
│                                 │
│ ┌───────────────────────────┐  │
│ │      Generera pass         │  │  ← 48 px, alltid synlig
│ └───────────────────────────┘  │  (sticky längst ner)
└────────────────────────────────┘
```

## Beteende och tillstånd

- **Spelform (01.1, 01.2):** när åldern anges/ändras väljs automatiskt den föreslagna spelformen om ledaren inte redan gjort ett eget val för samma ålder. Endast tre alternativ visas: föreslagen, samt närmast före/efter. Övriga spelformer visas inte alls (inte gråtonade – de finns inte som val).
- **Ogiltig ålder (01.3):** ålder utanför 6–19 ger felmeddelande direkt under fältet (se `texter.md`), och "Generera pass" är fortsatt klickbar men visar samma fel igen om ledaren försöker.
- **Blandad ålder (01.11):** infotexten `(i)` bredvid Ålder öppnar/visar alltid en kort rad: "Har gruppen flera åldrar? Ange den ålder som flest fyller i år." På mobil kan detta stå som statisk hjälptext direkt under fältet i stället för ett ikon-info, eftersom utrymmet finns.
- **Nivå (i):** infotext länkar till en kort beskrivning från `docs/doman/nivaer.md` (två av tre spelare-regeln), som en utfällbar textruta, inte en ny sida.
- **Fokusområden (01.9, 01.10):**
  - Listan grupperas som i `fokusomraden.md`, grupperna kan fällas ihop/ut. Kärnområden (K) märks med "(K)" efter namnet och ligger överst i sin grupp.
  - Bara fokusområden som är K eller R för den valda åldersfasen visas alls.
  - Kryssrutor låser sig vid tre valda: övriga blir inaktiva (men fortfarande lästa av skärmläsare som "inaktiverad, redan tre valda") tills ledaren avmarkerar en.
  - `nickspel` visas bara från 13 år. Väljer ledaren bara `nickspel` visas felet i `texter.md` när hon eller han försöker generera.
- **Yta (01.12, R-090):** tre val plus "Ingen" som förval. Att välja "Ingen" är alltid giltigt.
- **Obligatoriska fält saknas (01.5–01.8):** vid tryck på "Generera pass" märks varje ofullständigt/ogiltigt fält med röd ram och en textrad under fältet. Sidan skrollar automatiskt upp till det första felet. Ett samlat fel visas också ovanför knappen: "Några uppgifter saknas eller stämmer inte – se markeringarna ovan."
- **Senaste val sparas:** nästa gång ledaren öppnar "Nytt pass" är fälten förifyllda med senaste körningens värden (utom antal spelare, som ofta varierar per tillfälle – produktbeslut, se rapport).
- **Sticky knapp:** "Generera pass" ligger fast i nederkanten så att ledaren aldrig behöver skrolla för att hitta den, oavsett hur många fokusgrupper som är utfällda.

## Tillgänglighet

- Alla knappgrupper (spelform, nivå, yta) är riktiga knappgrupper (radiogrupp-semantik), inte bara färgade rutor – markerat val har både färg och en synlig bock/prick, aldrig färg som enda signal (WCAG 1.4.1).
- Kryssrutor för fokus har minst 48 × 48 px träffyta inklusive textetiketten (hela raden är klickbar).
- Kontrastkrav: se `designsystem.md`.

## Vad som INTE är med här

- Materialfilter, inomhushall, antal målvakter – utanför version 1 (se backlog).
- Koppling till lag – sker vid spara (se `05-sparade-pass.md`), inte här.
