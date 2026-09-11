Status: utkast

# 03. Inget matchande resultat

**Roll:** ledare

**Som** ledare **vill jag** få tydlig information när ingen övning matchar mina val, **så att** jag inte fastnar utan att förstå varför eller vad jag kan göra åt det.

## Acceptanskriterier

1. **Givet** att ledarens underlag inte matchar några godkända övningar i banken, **när** ledaren begär att generera passet, **då** visar appen ett tydligt meddelande om att inget pass kunde skapas, i stället för ett tomt eller felaktigt pass.
2. **Givet** att inget pass kunde skapas, **då** föreslår appen att ledaren justerar ett eller flera av sina val (till exempel nivå, antal spelare eller fokusområde) för att öka chansen att hitta matchande övningar.
3. **Givet** att inget pass kunde skapas, **när** ledaren ändrar ett av sina val och begär generering igen, **då** försöker appen på nytt utan att ledaren behöver fylla i hela underlaget från början.
4. **Givet** att det finns matchande övningar för bara en del av passets delar enligt `docs/doman/passuppbyggnad.md` (till exempel finns uppvärmning men inget huvudmoment), **när** passet genereras, **då** visar appen tydligt vilka delar av passet som saknar övning, i stället för att tyst hoppa över dem eller visa ett ofullständigt pass utan förklaring.

## Beroenden

- 02 (generera ett träningspass).

## Utanför denna berättelse

- Att appen automatiskt luckrar upp ledarens kriterier utan att ledaren själv gör ändringen (systemet ska inte tyst byta ledarens val).
- Att föreslå exakt vilket värde som skulle lösa problemet (till exempel "sänk antal spelare till 12") – appen pekar ut vilka fält som kan justeras, inte ett facit.
