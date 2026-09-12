Status: utkast

# Vy: Klubbadmin – klubb, lag och inbjudningar

**Uppfyller:** berättelse 09 (skapa klubb), 10 (hantera lag), 11 (bjuda in ledare).

**Läge:** Planeringsläget.

## Wireframe, 360 px – Skapa klubb (ingen klubb än)

```
┌────────────────────────────────┐
│  Skapa din klubb                │
│                                 │
│  Klubbnamn                     │
│  ┌───────────────────────────┐ │
│  │ IK Exempel                │ │
│  └───────────────────────────┘ │
│  Använd klubbens riktiga namn,  │
│  inte ett lags. Skriv inga      │
│  namn på spelare någonstans i   │
│  appen.                         │
│                                 │
│ ┌───────────────────────────┐  │
│ │      Skapa klubb            │  │
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

## Wireframe, 360 px – Klubbnamn upptaget (09.2)

```
┌────────────────────────────────┐
│  Skapa din klubb                │
│                                 │
│  Klubbnamn                     │
│  ┌───────────────────────────┐ │
│  │ IK Exempel                │ │
│  └───────────────────────────┘ │
│  ⚠ Det finns redan en klubb med │
│  det namnet. Kontrollera om     │
│  din klubb redan är registrerad │
│  innan du skapar en ny.         │
│                                 │
│ ┌───────────────────────────┐  │
│ │      Skapa klubb ändå       │  │
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

## Wireframe, 360 px – Klubbens lag

```
┌────────────────────────────────┐
│ IK Exempel              [+ Lag]│
│                                 │
│ ┌───────────────────────────┐  │
│ │ P11 Blå                     │  │
│ │ 11 år · 7 mot 7 · 3 ledare  │  │
│ │        [Öppna]             │  │
│ └───────────────────────────┘  │
│ ┌───────────────────────────┐  │
│ │ F14 Vit                     │  │
│ │ 14 år · 9 mot 9 · 2 ledare  │  │
│ │        [Öppna]             │  │
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

## Wireframe, 360 px – Ett lag: ledare och inbjudan

```
┌────────────────────────────────┐
│ ← P11 Blå              [Redig.]│
│                                 │
│ Ålder: 11 år                    │
│ Spelform: 7 mot 7 (föreslagen)  │
│                                 │
│ Ledare i laget                  │
│ ┌───────────────────────────┐  │
│ │ Björn Enbom                 │  │
│ │        [Ta bort från lag]  │  │
│ └───────────────────────────┘  │
│ ┌───────────────────────────┐  │
│ │ Anna Larsson (inbjuden,     │  │
│ │ väntar på svar)              │  │
│ └───────────────────────────┘  │
│                                 │
│ Bjud in ledare via e-post       │
│ ┌───────────────────────────┐  │
│ │ e-post@exempel.se          │  │
│ └───────────────────────────┘  │
│ ┌───────────────────────────┐  │
│ │      Skicka inbjudan       │  │
│ └───────────────────────────┘  │
│                                 │
│ ┌───────────────────────────┐  │
│ │  Arkivera laget             │  │
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

## Wireframe, 360 px – Varning vid arkivering (10.3)

```
┌────────────────────────────────┐
│ ✕ Arkivera P11 Blå?              │
│                                 │
│ ⚠ Laget har 6 sparade pass och  │
│ en säsongsplan. De påverkas      │
│ inte, men laget tas bort från    │
│ de aktiva listorna och kan inte  │
│ längre väljas för nya pass.       │
│                                 │
│ ┌───────────────────────────┐  │
│ │  Arkivera ändå               │  │
│ └───────────────────────────┘  │
│ ┌───────────────────────────┐  │
│ │  Avbryt                     │  │
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

## Beteende och tillstånd

- **Skapa klubb (09.1):** personen kopplas automatiskt som klubbadmin till den nya klubben. Hjälptexten under Klubbnamn ("Skriv inga namn på spelare någonstans i appen") är den plats där en ny klubbadmin först möter regeln, eftersom hen ofta sätter tonen för hur laget/klubbens namn väljs (säkerhetsgranskningens fynd S-20).
- **Namnkrock (09.2):** varningen låter klubbadmin gå vidare ändå (appen kan inte veta om det verkligen är samma klubb), men gör det tydligt att kontrollera först. Ingen teknisk spärr, bara en tydlig varning.
- **En klubb ser bara sitt eget (09.3):** listor över lag, ledare och övningar innehåller aldrig data från andra klubbar – detta är i grunden en behörighetsfråga (se `docs/adr/`, beslutas vid K2 av senior-systemutvecklare/säkerhetsagenten), men gränssnittet visar aldrig ens en antydan om att andra klubbar finns.
- **Skapa lag (10.1):** namn och ålder krävs; spelform föreslås utifrån åldern precis som i generatorn (samma komponent som `01-underlag.md`), men går att ändra fritt här (laget begränsas inte till grannspelformer på samma sätt som ett enskilt pass, eftersom ett lag kan spela en annan spelform än den vanliga i sitt distrikt). Fältet Lagnamn har hjälptexten "Skriv inga namn på spelare", eftersom lagnamnet är det som syns för hela klubben och följer med i varje pass (säkerhetsgranskningens fynd S-20, som lyfter just lagnamnet som exempel).
- **Redigera lag (10.2):** ändringar (namn, ålder, spelform) gäller omedelbart för alla kopplade till laget.
- **Arkivera lag (10.3):** varningsdialogen visas alltid om laget har sparade pass eller en säsongsplan kopplad, med exakt antal, innan borttagningen bekräftas.
- **Bjuda in (11.1):** e-postadress räcker; personen får en länk till `14-inloggning.md` med förifylld inbjudan.
- **Väntande inbjudan** visas i listan över ledare med en tydlig etikett, skild från de som redan accepterat.
- **Begränsad åtkomst (11.2):** en inbjuden ledare får bara tillgång till det laget hon eller han bjöds in till, aldrig klubbens övriga lag automatiskt.
- **Ta bort åtkomst (11.3):** "Ta bort från lag" har en kort bekräftelse. Ledaren förlorar bara åtkomst till det laget, kontot och övrigt (t.ex. andra lag, egna sparade pass som inte är kopplade till just detta lag) påverkas inte.

## Tillgänglighet

- Varje lagkort och ledarrad har tillräcklig träffyta (48 × 48 px) runt sina åtgärdsknappar, viktigt eftersom klubbadmin ofta gör detta på en dator med mus men appen ska fungera lika bra på mobil.
- Varningsdialoger fångar tangentbordsfokus (fokusfälla) tills de stängs, och återger fokus till den knapp som öppnade dem.
