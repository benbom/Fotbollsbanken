Status: utkast

# Vy: Inloggning och registrering

**Uppfyller:** berättelse 08 (registrera konto och logga in), grunden för 11 (acceptera inbjudan).

**Läge:** Planeringsläget (vanlig kontrast, vanlig text).

## Wireframe, 360 px – Logga in

```
┌────────────────────────────────┐
│  ⚽ Fotbollsbanken              │
│                                 │
│  Logga in                      │
│                                 │
│  E-post                        │
│  ┌───────────────────────────┐ │
│  │                           │ │
│  └───────────────────────────┘ │
│                                 │
│  Lösenord                      │
│  ┌───────────────────────────┐ │
│  │                           │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │        Logga in           │ │  ← 48 px hög knapp
│  └───────────────────────────┘ │
│                                 │
│  Glömt lösenord?               │
│                                 │
│  ──────────────────────────    │
│  Har du inget konto?           │
│  ┌───────────────────────────┐ │
│  │      Skapa konto           │ │
│  └───────────────────────────┘ │
└────────────────────────────────┘
```

## Wireframe, 360 px – Skapa konto

```
┌────────────────────────────────┐
│  ← Skapa konto                 │
│                                 │
│  Namn                          │
│  ┌───────────────────────────┐ │
│  └───────────────────────────┘ │
│  Visas för andra ledare i      │
│  dina lag.                     │
│                                 │
│  E-post                        │
│  ┌───────────────────────────┐ │
│  └───────────────────────────┘ │
│                                 │
│  Lösenord                      │
│  ┌───────────────────────────┐ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │      Skapa konto           │ │
│  └───────────────────────────┘ │
│                                 │
│  Vi sparar bara det som         │
│  behövs för ditt konto. Inga    │
│  uppgifter om spelare.          │
└────────────────────────────────┘
```

## Beteende och tillstånd

- **Fel inloggning (08.3):** felmeddelande visas direkt ovanför fälten, fälten töms inte, fokus flyttas till e-postfältet. Se `texter.md`.
- **Inbjudan (11.1):** en person som klickar en inbjudningslänk i sin e-post kommer till samma vy men med en rad överst: "Du är inbjuden till [Lagnamn] i [Klubbnamn]." E-postfältet är förifyllt och låst till den inbjudna adressen. Efter registrering/inloggning kopplas kontot automatiskt till laget.
- **Utloggning (08.4):** en meny (avatar/namn högst upp) innehåller "Logga ut". Efter utloggning visas denna vy; sparade pass och klubbmaterial är otillgängliga tills ny inloggning.
- **Tomt fält:** "Logga in"-knappen är alltid klickbar men visar fel om fält saknas, i stället för att vara inaktiverad (så att skärmläsare alltid kan nå den och beskriva varför den inte går igenom).
- **Laddning:** knappen visar en spinner och texten "Loggar in …" så att ett dubbelklick inte skickar formuläret två gånger.

## Tillgänglighet

- Fälten har synliga etiketter (inte bara platshållartext), kopplade med `label`/`for` eller motsvarande.
- Felmeddelanden är kopplade till respektive fält (aria-describedby eller motsvarande) och läses upp av skärmläsare.
- Träffyta på knappar minst 48 × 48 px.

## Beroenden till andra vyer

- Efter lyckad inloggning: ledare → startsida "Mina pass", klubbadmin utan klubb → uppmaning att skapa klubb (`13-klubbadmin-lag.md`), redaktör → extra flik för redaktörskö (`12-redaktorsko.md`).
