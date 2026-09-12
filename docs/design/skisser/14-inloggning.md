Status: godkänd (K2, 2026-09-12)

# Vy: Inloggning och registrering – engångskod via e-post

**Uppfyller:** berättelse 08 (registrera konto och logga in), grunden för 11 (acceptera inbjudan).

**Läge:** Planeringsläget (vanlig kontrast, vanlig text).

**Bakgrund:** enligt `docs/adr/0004-inloggning.md` finns inget lösenord. Ledaren anger e-post, får en sexsiffrig kod och skriver in den. Samma kodsteg används vid inloggning och vid registrering.

## Wireframe, 360 px – Logga in (steg 1: e-post)

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
│  ┌───────────────────────────┐ │
│  │ ☑ Jag är inte en robot     │ │  ← Cloudflare Turnstile
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │        Skicka kod          │ │  ← 48 px hög knapp
│  └───────────────────────────┘ │
│                                 │
│  ──────────────────────────    │
│  Har du inget konto?           │
│  ┌───────────────────────────┐ │
│  │      Skapa konto           │ │
│  └───────────────────────────┘ │
└────────────────────────────────┘
```

## Wireframe, 360 px – Skapa konto (steg 1)

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
│  ┌───────────────────────────┐ │
│  │ ☑ Jag är inte en robot     │ │  ← Cloudflare Turnstile
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │        Skicka kod          │ │
│  └───────────────────────────┘ │
│                                 │
│  Vi sparar bara det som         │
│  behövs för ditt konto. Inga    │
│  uppgifter om spelare.          │
└────────────────────────────────┘
```

## Wireframe, 360 px – Skriv in koden (steg 2, gemensam)

```
┌────────────────────────────────┐
│  ← Skriv in koden               │
│                                 │
│  Vi har skickat en kod till     │
│  anna@exempel.se.               │
│                                 │
│  ⓘ Hittar du inget mejl om en   │
│  liten stund? Kolla även i      │
│  skräpposten.                   │
│                                 │
│  Kod (6 siffror)                │
│  ┌───────────────────────────┐ │
│  │                           │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │      Bekräfta kod           │ │
│  └───────────────────────────┘ │
│                                 │
│  Skicka ny kod (47 s)           │  ← inaktiv text under väntetiden
│                                 │
│  Fel e-postadress? Gå tillbaka  │
└────────────────────────────────┘
```

## Wireframe, 360 px – Fel kod

```
┌────────────────────────────────┐
│  ← Skriv in koden               │
│                                 │
│  ⛔ Koden stämmer inte.          │
│  Kontrollera siffrorna och      │
│  försök igen.                   │
│                                 │
│  Kod (6 siffror)                │
│  ┌───────────────────────────┐ │
│  │                           │ │
│  └───────────────────────────┘ │
│  ┌───────────────────────────┐ │
│  │      Bekräfta kod           │ │
│  └───────────────────────────┘ │
│  Skicka ny kod                  │  ← aktiv, väntetiden är slut
└────────────────────────────────┘
```

## Beteende och tillstånd

- **Steg 1 gäller lika för okänd och känd adress (S-13):** oavsett om adressen har ett konto eller inte visar appen samma bekräftelse och går vidare till kodsteget: "Om adressen finns hos oss har vi skickat en kod." Appen avslöjar aldrig om ett konto finns. Vid registrering skapas kontot först när koden bekräftas.
- **CAPTCHA före kodbeställning:** Turnstile-rutan måste vara godkänd innan "Skicka kod" fungerar. Rutan är i normalfallet osynlig/automatisk för de flesta besökare (icke-interaktiv), men visas som i skissen när Cloudflare behöver en bekräftelse. Turnstile ersätter aldrig gränserna för antal försök nedan.
- **Väntetid mellan kodbeställningar (S-18):** minst 60 sekunder mellan varje ny kod till samma adress. Under väntetiden visas nedräkningen som text, inte bara en gråtonad knapp, så att skärmläsare uppfattar varför knappen inte går att trycka.
- **Fel kod (08.3):** tydligt felmeddelande ovanför fältet, fältet töms, fokus läggs i fältet igen. Efter för många felaktiga försök (gräns sätts av senior-systemutvecklaren mot Supabases faktiska inställningar, se ADR 0004/S-18) ogiltigförklaras koden och appen visar att en ny kod krävs.
- **Koden har gått ut:** samma mönster som fel kod, med en egen text som gör klart att koden är för gammal, inte felskriven.
- **Skräppost, lugn ton:** texten är en upplysning, inte en varning – ingen ikon för fel eller varning, bara en informationsikon (ⓘ), eftersom det är normalt att mejlet dröjer när appen inte har en egen avsändardomän i version 1.
- **Inbjudan (11.1):** en person som klickar en inbjudningslänk i sin e-post kommer till steg 1 med en rad överst: "Du är inbjuden till [Lagnamn] i [Klubbnamn]." E-postfältet är förifyllt och låst till den inbjudna adressen. Efter att koden är bekräftad kopplas kontot automatiskt till laget.
- **Utloggning (08.4):** en meny (avatar/namn högst upp) innehåller "Logga ut". Efter utloggning visas steg 1; sparade pass och klubbmaterial är otillgängliga tills ny inloggning.
- **Tomt fält:** knapparna är alltid klickbara men visar fel om fält saknas, i stället för att vara inaktiverade (så att skärmläsare alltid kan nå dem och beskriva varför de inte går igenom).
- **Laddning:** knapparna visar en spinner och en text ("Skickar kod …", "Kontrollerar kod …") så att ett dubbelklick inte skickar formuläret två gånger.
- **Inget lösenord finns någonstans i flödet.** Det finns ingen länk "Glömt lösenord?".

## Tillgänglighet

- Fälten har synliga etiketter (inte bara platshållartext), kopplade med `label`/`for` eller motsvarande.
- Felmeddelanden är kopplade till respektive fält (aria-describedby eller motsvarande) och läses upp av skärmläsare.
- Kodfältet har `inputmode="numeric"` och `autocomplete="one-time-code"`, så att mobilens tangentbord och automatisk kodifyllning (SMS/mejl) fungerar.
- Nedräkningen för "Skicka ny kod" annonseras via `aria-live="polite"` med rimliga intervall, inte varje sekund.
- Träffyta på knappar minst 48 × 48 px.

## Beroenden till andra vyer

- Efter bekräftad kod: ledare → startsida "Mina pass", klubbadmin utan klubb → uppmaning att skapa klubb (`13-klubbadmin-lag.md`), redaktör → extra flik för redaktörskö (`12-redaktorsko.md`).
