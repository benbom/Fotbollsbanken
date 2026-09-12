Status: ändrad vid K2 (2026-09-12)

# 08. Registrera konto och logga in

**Roll:** ledare, klubbadmin

**Som** ledare eller klubbadmin **vill jag** kunna skapa ett konto och logga in, **så att** mina sparade pass och min klubbs/lags material är knutna till mig.

## Acceptanskriterier

1. **Givet** att en person inte har något konto, **när** personen registrerar sig med sin e-post, **då** skapas ett konto knutet till den e-postadressen.
2. **Givet** att en person har ett konto, **när** personen loggar in med rätt uppgifter, **då** får personen tillgång till sina sparade pass och sin klubbs och sina lags material.
3. **Givet** att fel inloggningsuppgifter anges, **när** personen försöker logga in, **då** visas ett tydligt felmeddelande, och personen loggas inte in.
4. **Givet** att en person är inloggad, **när** personen loggar ut, **då** krävs inloggning igen innan personen kan se sina sparade pass eller sin klubbs material.
5. **Givet** att ett nytt konto skapas, **då** lagras bara de personuppgifter som krävs för kontot (till exempel namn och e-post för ledaren själv), och inga uppgifter om spelare samlas in vid registreringen.
6. **Givet** att appen skickar en inloggningskod till den angivna e-postadressen, **när** koden är skickad, **då** upplyser appen om att koden kan hamna i skräpposten, eftersom mejlen skickas från en delad avsändaradress (ingen egen domän i version 1, se backlog).

## Beroenden

Inga. Detta är grunden för resten av inkrement 3.

## Utanför denna berättelse

- Exakt inloggningsmetod (lösenord, magisk länk, e-post med kod eller liknande) – tekniskt val, ägs av senior-systemutvecklare.
- Att koppla kontot till en klubb eller ett lag (se berättelse 09–11).
- Lösenordsåterställning i detalj – ska finnas men beskrivs inte här som eget krav utöver att inloggning måste kunna misslyckas och lyckas på ett begripligt sätt.
