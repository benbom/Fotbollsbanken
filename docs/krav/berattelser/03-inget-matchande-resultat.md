Status: utkast

# 03. Inget matchande resultat

**Roll:** ledare

**Som** ledare **vill jag** få tydlig information när ingen övning matchar mina val, **så att** jag inte fastnar utan att förstå varför eller vad jag kan göra åt det.

## Acceptanskriterier

1. **Givet** att ingen av delarna `del-ovning`, `del-spelovning` och `del-spel` kan fyllas med en giltig övning (bland de delar som finns kvar efter att för korta delar tagits bort, se `docs/doman/passuppbyggnad.md`), **när** ledaren begär att generera passet, **då** skapas inget pass, och appen visar ett tydligt meddelande om att inget pass kunde skapas, i stället för ett tomt eller felaktigt pass (R-101). Ett pass där bara `del-spel` kunnat fyllas visas däremot, se kriterium 4.
2. **Givet** att inget pass kunde skapas, eller att en del saknar övning, **då** pekar appen ut vilka av ledarens val (nivå, ett eller flera fokusområden, antal spelare, antal ledare, spelform och, om det är valt, yta) som var för sig skulle kunna ge ett giltigt pass eller en giltig del, utan att ange vilket nytt värde som skulle lösa det (R-103).
3. **Givet** att inget pass kunde skapas, **när** ledaren ändrar ett av sina val och begär generering igen, **då** försöker appen på nytt utan att ledaren behöver fylla i hela underlaget från början. Appen ändrar aldrig ledarens val själv (R-102).
4. **Givet** att det finns giltiga övningar för minst en av delarna `del-ovning`, `del-spelovning` och `del-spel`, men inte för alla delar som ska fyllas från banken enligt `docs/doman/passuppbyggnad.md`, **när** passet genereras, **då** visar appen passet med de delar som kunde fyllas, och varje del som saknar övning visas med sitt namn, sin måltid och texten att övning saknas, i stället för att tyst hoppa över delen (R-100).

## Beroenden

- 02 (generera ett träningspass).

## Utanför denna berättelse

- Att appen automatiskt luckrar upp ledarens kriterier utan att ledaren själv gör ändringen (systemet ska inte tyst byta ledarens val).
- Att föreslå exakt vilket värde som skulle lösa problemet (till exempel "sänk antal spelare till 12") – appen pekar ut vilka fält som kan justeras, inte ett facit.
