Status: godkänd (K2, 2026-09-12)

# Vy: Byta övning

**Uppfyller:** berättelse 04 (byta ut en övning i passet), R-104 till R-106.

**Läge:** Planeringsläget. Nås från genererat pass, sparat pass eller inför planläget (inte under pågående planläge, se `06-planlage.md`).

## Wireframe, 360 px

```
┌────────────────────────────────┐
│ ← Byt övning: Öva               │
│                                 │
│ Byter ut: "Passningar med       │
│ vändning" (Station A, 5 min)    │
│                                 │
│ ┌───────────────────────────┐  │
│ │ 🔍 Sök bland alternativen  │  │
│ └───────────────────────────┘  │
│                                 │
│ FRÅN DEN GEMENSAMMA BANKEN      │
│ ┌───────────────────────────┐  │
│ │ [Skiss] Passning i par     │  │
│ │ Passning och mottagning     │  │
│ │ 5–15 min · 4–12 spelare     │  │
│ │              [Välj denna]  │  │
│ ├───────────────────────────┤  │
│ │ [Skiss] Trekantspassning   │  │
│ │ Passning och mottagning     │  │
│ │ 5–10 min · 6–12 spelare     │  │
│ │              [Välj denna]  │  │
│ └───────────────────────────┘  │
│                                 │
│ KLUBBENS EGNA ÖVNINGAR          │
│ ┌───────────────────────────┐  │
│ │ [Skiss] Vår passningslek   │  │
│ │ Passning och mottagning     │  │
│ │ Skapad av Anna L.           │  │
│ │              [Välj denna]  │  │
│ └───────────────────────────┘  │
│                                 │
│ Ingen av era egna övningar med  │
│ ofullständiga uppgifter visas   │
│ här – de kan inte användas i    │
│ ett pass förrän de är           │
│ kompletta.                      │
└────────────────────────────────┘
```

## Alternativt tillstånd: inga alternativ finns

```
┌────────────────────────────────┐
│ ← Byt övning: Öva               │
│                                 │
│ Byter ut: "Passningar med       │
│ vändning" (Station A, 5 min)    │
│                                 │
│  Vi hittade ingen övning, varken│
│  i banken eller bland era egna, │
│  som passar precis här.         │
│                                 │
│  Övningen ligger kvar som den   │
│  är.                            │
│                                 │
│ ┌───────────────────────────┐  │
│ │      Tillbaka till passet  │  │
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

## Beteende och tillstånd

- **Två tydligt skilda grupper (04.1):** "Från den gemensamma banken" och "Klubbens egna övningar" visas som egna rubriker/sektioner, aldrig blandade i en lista, så att ledaren alltid vet varifrån en övning kommer (kvalitetssäkrad kontra egen).
- **Filtrering sker innan visning:** listan visar bara övningar som redan uppfyller alla villkor (samma del, säkerhetsregler, plats för momentets spelare/ledare/station, inte redan i passet). Ledaren behöver aldrig filtrera bort olämpliga förslag själv.
- **Klubbens ofullständiga övningar (04.1, R-106):** visas aldrig i listan. Texten längst ner förklarar varför, så att ledaren inte tror att appen "glömt" en övning hon eller han vet finns i klubben.
- **Sök** filtrerar listan på namn/fokus i realtid, men ändrar inte vilka övningar som är tillåtna.
- **Välja en övning (04.2):** en bekräftelsedialog är inte nödvändig – trycket på "Välj denna" byter direkt och för tillbaka till passet med en kort bekräftelse ("Bytt till: Passning i par") och den uppdaterade tiden synlig.
- **Inget alternativ (04.3):** se det alternativa tillståndet ovan. Originalövningen är oförändrad.
- **Flera byten (04.4):** efter ett byte är ledaren tillbaka i passet och kan trycka "Byt övning" på valfri annan rad.
- **Uppdaterad totaltid (04.5):** visas i passvyn direkt efter återgång, som i `02-genererat-pass.md`.

## Tillgänglighet

- Varje övningskort är en enda logisk enhet för skärmläsare: namn, fokus, tid, antal spelare läses i den ordningen innan knappen "Välj denna" nås.
- "Välj denna"-knappen är minst 48 × 48 px och har ett unikt tillgängligt namn per kort (till exempel "Välj Passning i par"), inte bara "Välj denna" upprepat utan sammanhang.
- Sökfältet har en synlig etikett, inte bara en förstorningsglas-ikon.
