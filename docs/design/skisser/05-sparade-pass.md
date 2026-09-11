Status: utkast

# Vy: Spara pass och Sparade pass

**Uppfyller:** berättelse 05 (spara ett pass), 12 (dela sparat pass inom laget).

**Läge:** Planeringsläget.

## Wireframe, 360 px – Namnge och spara (dialog/steg)

```
┌────────────────────────────────┐
│ ✕ Spara pass                   │
│                                 │
│ Namn på passet                 │
│ ┌───────────────────────────┐  │
│ │ 11 år · 7 mot 7 ·          │  │  ← förifyllt namnförslag,
│ │ Passning 24 sep            │  │    redigerbart
│ └───────────────────────────┘  │
│                                 │
│ Lag                            │
│ ┌───────────────────────────┐  │
│ │ P11 Blå ▾                  │  │  ← om ledaren har lag
│ └───────────────────────────┘  │
│ Delas med alla ledare i P11 Blå │
│                                 │
│ ┌───────────────────────────┐  │
│ │        Spara pass          │  │  ← 48 px
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

## Wireframe, 360 px – Sparade pass (lista)

```
┌────────────────────────────────┐
│ Sparade pass          [+ Nytt] │
│                                 │
│ ┌─────────┬──────────────────┐ │
│ │ Mina pass│ P11 Blå          │ │  ← flikar om kopplad till lag
│ └─────────┴──────────────────┘ │
│                                 │
│ ┌───────────────────────────┐  │
│ │ 11 år · 7 mot 7 ·          │  │
│ │ Passning 24 sep             │  │
│ │ 58 min · Sparat av dig      │  │
│ └───────────────────────────┘  │
│ ┌───────────────────────────┐  │
│ │ 11 år · 7 mot 7 · Avslut    │  │
│ │ 17 sep                      │  │
│ │ 60 min · Sparat av Björn    │  │
│ └───────────────────────────┘  │
│                                 │
│ (Skrollbar lista, senaste       │
│  överst)                        │
└────────────────────────────────┘
```

## Beteende och tillstånd

- **Namnförslag (05.3):** om ledaren inte skriver ett eget namn föreslås ett med datum, spelform och (huvud)fokus. Förslaget är redigerbart innan spara.
- **Lag-koppling (12.1, 12.2):** om ledaren tillhör ett eller flera lag visas ett val, förvalt till det senast använda laget. Väljer ledaren inget lag (till exempel innan hon eller han har ett), sparas passet privat, synligt bara för ledaren själv.
- **Fortsätt använda appen (05.4):** efter spara stängs dialogen och ledaren är kvar i passvyn (nu markerad "Sparat"), eller kan direkt trycka "+ Nytt" för att börja om.
- **Flikar Mina pass / lag (12.1, 12.3):** ett lags flik visar alla pass som är sparade för laget, oavsett vem som sparat dem. En ledare som lämnat laget ser inte längre den fliken eller de passen, men passen finns kvar för kvarvarande ledare (12.3).
- **Öppna ett sparat pass:** leder till samma passvy som `02-genererat-pass.md`, med möjlighet att byta övning, starta planläge, skriva ut eller koppla till en säsongsvecka.
- **Tom lista:** "Du har inga sparade pass än. Skapa ditt första pass." med en genväg till generatorn.

## Tillgänglighet

- Varje passkort är en enda länk/knapp med ett fullständigt tillgängligt namn (namn, datum, längd), inte flera separata klickbara delar i samma kort.
- Flikarna är riktiga flikar (`role="tablist"`/motsvarande) med tydligt tangentbordsstöd.
