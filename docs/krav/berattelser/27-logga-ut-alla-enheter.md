Status: godkänd (K2, 2026-09-12)

# 27. Logga ut på alla enheter

**Roll:** ledare, klubbadmin, redaktör

**Som** inloggad person **vill jag** kunna logga ut från alla enheter samtidigt, **så att** jag kan avbryta åtkomsten till mitt konto om en telefon eller annan enhet där jag varit inloggad blir borttappad, stulen eller hamnar i orätta händer.

> **Obs:** användaren beslutade vid K2 (2026-09-12) att flytta detta från backloggen till Must i version 1, efter att senior systemutvecklare och säkerhetsagenten invänt mot att lägga det i backloggen: utan funktionen har ledaren ingen väg alls att avbryta åtkomsten från en borttappad telefon, eftersom sessionen inte kan tidsbegränsas på gratisnivån och en vanlig utloggning bara rör den enhet den görs på. Se säkerhetsgranskning K2, fynd S-11 (`docs/sakerhet/granskning-k2.md`).

## Acceptanskriterier

1. **Givet** att en person är eller kan ha varit inloggad på fler än en enhet, **när** personen väljer att logga ut från alla enheter (till exempel från kontoinställningarna, på vilken enhet som helst där personen är inloggad), **då** avslutas omedelbart alla aktiva inloggningar för kontot, inklusive den enhet som används just nu.
2. **Givet** att alla enheter har loggats ut på detta sätt, **när** en tidigare inloggad enhet, till exempel den borttappade telefonen, nästa gång försöker använda appen, **då** avvisas den, och en ny inloggning (ny engångskod till e-post, se berättelse 08) krävs innan kontot går att använda igen där.
3. **Givet** att personen bara vill avsluta sin egen, aktuella session, **när** personen istället väljer en vanlig utloggning, **då** påverkas inte andra enheters inloggningar – detta skiljer den vanliga utloggningen från "logga ut på alla enheter".
4. **Givet** att personen har valt att logga ut från alla enheter, **när** åtgärden har genomförts, **då** bekräftar appen tydligt att alla enheter är utloggade.

## Beroenden

- 08 (registrera konto och logga in).

## Utanför denna berättelse

- Att se en lista över vilka enheter eller platser som är inloggade. Version 1 innehåller bara den samlade åtgärden "logga ut alla", ingen enhetsöversikt.
- Automatisk tidsbegränsning av sessioner – inte möjligt på gratisnivån (säkerhetsgranskning K2, fynd S-11). "Logga ut på alla enheter" är den funktion som ersätter det i version 1.
