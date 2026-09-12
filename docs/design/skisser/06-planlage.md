Status: godkänd (K2, 2026-09-12)

# Vy: Planläget (genomförande med timer)

**Uppfyller:** berättelse 19 (starta planläget), 20 (timer per övning), 21 (navigera mellan övningar), inbäddar 06 (planskiss för en övning).

**Läge:** GENOMFÖRANDELÄGET. Det här är den enda vyn i hela appen med egna, striktare regler: hög kontrast för sol, mycket stor text, träffytor betydligt större än miniminivån där det går, och skärmen får aldrig självslockna. Se `designsystem.md`, avsnittet "Planläget".

## Wireframe, 360 px – Övning pågår

```
┌────────────────────────────────┐
│ ✕ Avsluta      Öva  2 av 5      │  ← alltid synlig statusrad
│                                 │
│ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  │
│ ┃         04:12              ┃  │  ← TIMER, alltid synlig,
│ ┃      Station A              ┃  │    stor stil, hög kontrast
│ ┃  [Paus]      [+1 min]       ┃  │
│ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  │
│                                 │
│  PASSNING MED VÄNDNING          │
│                                 │
│  ┌───────────────────────────┐ │
│  │                           │ │
│  │      [Planskiss, stor]     │ │
│  │                           │ │
│  └───────────────────────────┘ │
│                                 │
│  Syfte: träna vändning under    │
│  press innan passning.          │
│                                 │
│  ▾ Visa fullständig beskrivning,│
│    coachningspunkter, varianter │
│                                 │
│ ┌──────────┬──────────────────┐│
│ │ ◀ Föreg. │   Nästa övning ▶ ││  ← 56 px höga knappar
│ └──────────┴──────────────────┘│
└────────────────────────────────┘
```

## Wireframe, 360 px – Tiden slut (signal)

```
┌────────────────────────────────┐
│ ✕ Avsluta      Öva  2 av 5      │
│                                 │
│ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  │
│ ┃      00:00  TIDEN ÄR       ┃  │  ← blinkande/kraftig
│ ┃           SLUT              ┃  │    färgändring + ev. ljud/
│ ┃  [Förläng 2 min]            ┃  │    vibration (20.2)
│ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  │
│  … (resten av vyn oförändrad,   │
│      Nästa övning-knappen       │
│      förstoras/lyfts fram)      │
└────────────────────────────────┘
```

## Wireframe, 360 px – Passet slut

```
┌────────────────────────────────┐
│ ✕ Avsluta                       │
│                                 │
│         ✔  Passet är slut       │
│                                 │
│  Bra jobbat! Ni har gått        │
│  igenom alla övningar.          │
│                                 │
│ ┌───────────────────────────┐  │
│ │   Till avslutningen        │  │
│ └───────────────────────────┘  │
│ ┌───────────────────────────┐  │
│ │   Avsluta planläget        │  │
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

## Beteende och tillstånd

- **Start (19.1):** från ett sparat/genererat pass trycker ledaren "Starta planläge". Första övningen (Uppvärmning) visas direkt, med planskiss och kort info synlig utan extra klick.
- **Fullständig info utan att lämna läget (19.2):** "Visa fullständig beskrivning …" fäller ut inom samma skärm (accordion), lämnar aldrig planläget eller startar om timern.
- **Stora, tydliga ytor (19.3):** navigeringsknapparna är 56 px höga (över minimikravet 48 px) eftersom de används med handskar/våta fingrar och ofta med en hand medan den andra håller en boll.
- **Timern (20.1):** startar inte automatiskt vid övningsbyte – ledaren trycker start själv (så att hon eller han hinner samla gruppen), men den nedräknande siffran och namnet på övningen är alltid synliga, oavsett om timern går eller inte.
- **Signal vid noll (20.2):** stor visuell förändring (till exempel bakgrundsfärg på timerrutan, se `designsystem.md`), plus ljud och/eller vibration om enheten och webbläsaren stödjer det. Ljudet är inte det enda sättet att märka det (viktigt i en bullrig miljö och för hörselskadade ledare).
- **Förläng/pausa (20.3):** "Paus" fryser nedräkningen, "+1 min" lägger till tid. Nästa övnings timer påverkas aldrig – varje övnings timer är oberoende och återställs till sin egen tid när ledaren går vidare.
- **Manuellt nästa (20.4):** trycker ledaren "Nästa övning" innan tiden är slut stoppas den pågående timern direkt, och nästa övning visas med sin timer i startläge (inte påslagen).
- **Navigering (21.1–21.3):** "◀ Föregående" och "Nästa övning ▶" flyttar en övning i taget. På sista övningen ersätts "Nästa övning" av vyn "Passet är slut" i stället för att visa en tom skärm (21.2). På första övningen är "◀ Föregående" antingen inaktiverad (gråtonad men fortfarande minst 48×48 px och med `aria-disabled`) eller trycket gör ingenting synligt (21.3) – valet görs av utvecklingsteamet vid bygge, se *Beslut som behövs*.
- **Skärmen släcks aldrig:** planläget håller skärmen vaken så länge vyn är öppen (tekniskt val vid K2, till exempel Wake Lock API, men kravet är ett designkrav och gäller oavsett teknik).
- **Avsluta (✕):** en bekräftelse ("Vill du avsluta planläget? Passets ordning och tider påverkas inte.") förhindrar att ett ofrivilligt tryck avbryter mitt i träningen.
- **Ordningen låst (21:Utanför):** ingen dra-och-släpp eller omordning här – ordningen kommer från passet som redan är satt i planeringsläget.

## Designprinciper specifika för den här vyn

- **En övning i taget**, aldrig en lista att skrolla i – minskar risken att ledaren tappar bort var i passet hon eller han är.
- **Timern överst och alltid synlig**, aldrig gömd bakom en flik eller ett scroll.
- **Hög kontrast för sol:** se separat färgpalett i `designsystem.md` (kontrastvärden ≥ 7:1 där möjligt, se AAA-nivå för den kritiska timertexten trots att AA är minimikravet).
- **Inga hover-beroende funktioner** – allt är tryckbaserat, eftersom vyn bara används på pekskärm utomhus.

## Tillgänglighet

- Timerns nedräkning uppdateras visuellt men aviseras inte kontinuerligt för skärmläsare (skulle bli outhärdligt); en `aria-live="polite"`-region meddelar bara vid start, paus, förlängning och "Tiden är slut".
- Statusraden ("Öva, 2 av 5") ger sammanhang även för den som inte ser planskissen.
- Knappen "✕ Avsluta" har alltid samma plats (övre vänstra hörnet) genom hela planläget, för förutsägbarhet under stress.
