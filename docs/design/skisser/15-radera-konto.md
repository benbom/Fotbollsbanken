Status: utkast

# Vy: Radera sitt konto

**Uppfyller:** berättelse 26 (produktägaren skriver acceptanskriterierna parallellt med detta underlag).

**Läge:** Planeringsläget.

**Bakgrund:** säkerhetsgranskningens fynd S-10 kräver en fungerande väg för radering i appen, inte bara i drift. Delat material (lagets pass, klubbens egna övningar, godkända bidrag till den gemensamma banken) finns kvar avidentifierat, eftersom andra ledare och lag är beroende av det.

## Wireframe, 360 px – Kontoinställningar

```
┌────────────────────────────────┐
│ ← Mitt konto                    │
│                                 │
│ Namn: Björn Enbom               │
│ E-post: bjorn@exempel.se        │
│                                 │
│ ┌───────────────────────────┐  │
│ │  Logga ut på alla enheter  │  │
│ └───────────────────────────┘  │
│                                 │
│ ┌───────────────────────────┐  │
│ │  Radera mitt konto         │  │  ← destruktiv, egen sektion
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

## Wireframe, 360 px – Radera konto, ensam klubbadmin (blockerad)

```
┌────────────────────────────────┐
│ ← Radera mitt konto             │
│                                 │
│ ⛔ Du är den enda klubbadminen  │
│ i IK Exempel. Utse en           │
│ efterträdare innan du kan       │
│ radera ditt konto.              │
│                                 │
│ ┌───────────────────────────┐  │
│ │  Utse en efterträdare       │  │  ← leder till 13-klubbadmin-lag.md
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

## Wireframe, 360 px – Radera konto, vad som händer

```
┌────────────────────────────────┐
│ ← Radera mitt konto             │
│                                 │
│ Det här raderas:                │
│  • Din profil (namn, e-post)    │
│  • Dina personliga pass som     │
│    inte är kopplade till ett lag│
│  • Dina medlemskap i lag och    │
│    klubbar                      │
│  • Väntande inbjudningar du     │
│    skickat                      │
│                                 │
│ Det här blir kvar, avidenti-    │
│ fierat:                         │
│  • Pass du sparat åt ett lag    │
│  • Övningar du skapat i klubben │
│  • Övningar du fått godkända    │
│    i den gemensamma banken      │
│  Skaparen visas då som          │
│  "Borttagen användare".         │
│                                 │
│ ⚠ Det går inte att ångra.       │
│                                 │
│ Skriv ditt namn för att         │
│ bekräfta                        │
│ ┌───────────────────────────┐  │
│ │                           │  │
│ └───────────────────────────┘  │
│                                 │
│ ┌───────────────────────────┐  │
│ │  Radera mitt konto          │  │  ← destruktiv, inaktiv tills
│ └───────────────────────────┘  │     namnet stämmer
│ ┌───────────────────────────┐  │
│ │  Avbryt                     │  │
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

## Beteende och tillstånd

- **Ensam klubbadmin blockeras (S-10):** appen kontrollerar om personen är den enda klubbadminen i minst en klubb. Är så fallet visas blockeringsvyn i stället för raderingsformuläret, med en genväg till att utse en efterträdare i `13-klubbadmin-lag.md`. Har personen flera klubbar kontrolleras alla, och alla måste ha en annan klubbadmin innan radering går att slutföra.
- **Tydlig lista, inte en enda mening:** vad som raderas och vad som blir kvar visas som två separata listor, aldrig gömda bakom en accordion, eftersom det är den viktigaste informationen i hela vyn.
- **Bekräftelse med textinmatning:** ledaren skriver sitt eget namn (inte bara ett klick i en dialogruta) innan "Radera mitt konto" går att trycka, för att en oavsiktlig radering på en delad enhet ska vara osannolik.
- **Ingen ångra:** varningstexten är alltid synlig, inte bara i en dialogruta som kan missas.
- **Efter radering:** personen loggas ut omedelbart, all lokal cache rensas (som vid vanlig utloggning, `docs/adr/0005-daligt-nat-och-offline.md`), och samma e-postadress kan senare skapa ett helt nytt konto men kopplas inte till det gamla kontots historik.
- **Nätkrav:** radering kräver nät, precis som andra ändringar (`docs/adr/0005-daligt-nat-och-offline.md`). Saknas nät visas samma offlinemarkering och text som i övriga vyer, se `designsystem.md` avsnitt 9 och `texter.md` avsnitt 15.

## Tillgänglighet

- De två listorna ("raderas" / "blir kvar avidentifierat") har varsin rubrik (`h2` eller motsvarande) så att en skärmläsare kan hoppa mellan dem.
- Bekräftelsefältet har en synlig etikett och ett tydligt felmeddelande om det skrivna namnet inte stämmer.
- "Radera mitt konto"-knappen har `aria-disabled` med en kopplad förklaring, i stället för att vara helt dold, tills bekräftelsen är korrekt ifylld.
- Träffyta minst 48 × 48 px, som i övriga vyer.

## Beroenden till andra vyer

- Blockeringsläget länkar till `13-klubbadmin-lag.md` för att utse en ny klubbadmin.
- Nås från en ny vy "Mitt konto", som också rymmer "Logga ut på alla enheter" (säkerhetsgranskningens fynd S-11). Var i navigeringen "Mitt konto" placeras avgörs när det övergripande navigeringsmönstret ritas i inkrement 3.
