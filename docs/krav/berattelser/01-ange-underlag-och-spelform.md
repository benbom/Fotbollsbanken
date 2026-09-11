Status: utkast

# 01. Ange underlag och få spelform föreslagen

**Roll:** ledare

**Som** ledare **vill jag** ange ålder, nivå, antal spelare, antal ledare, passets längd och fokusområde, och få en spelform föreslagen utifrån åldern, **så att** jag snabbt kan komma igång med att generera ett träningspass utan att själv behöva kunna spelformsreglerna utantill.

## Acceptanskriterier

1. **Givet** att ledaren öppnar generatorn, **när** ledaren anger en ålder inom det spann som stöds enligt `docs/doman/spelformer.md`, **då** föreslår appen automatiskt den spelform som gäller för den åldern.
2. **Givet** att appen har föreslagit en spelform utifrån åldern, **när** ledaren i stället väljer en annan spelform i listan, **då** används den valda spelformen, med de planmått och det spelarantal som gäller för den enligt `docs/doman/spelformer.md`.
3. **Givet** att ledaren anger en ålder utanför det spann som stöds, **när** ledaren försöker gå vidare, **då** visar appen ett tydligt felmeddelande och tillåter inte generering förrän ett giltigt värde har angetts.
4. **Givet** att ledaren är på underlagssteget, **när** ledaren har angett ålder (eller valt spelform), nivå enligt `docs/doman/nivaer.md`, antal spelare, antal ledare, passets längd i minuter och minst ett fokusområde enligt `docs/doman/fokusomraden.md`, **då** kan ledaren gå vidare till att generera passet.
5. **Givet** att ett obligatoriskt fält saknas (ålder/spelform, nivå, antal spelare, antal ledare eller passlängd), **när** ledaren försöker generera passet, **då** visar appen vilka fält som saknas och genererar inget pass.
6. **Givet** att ledaren anger antal spelare som 0 eller ett negativt tal, **när** ledaren försöker gå vidare, **då** visar appen ett felmeddelande om att antalet spelare måste vara minst 1.
7. **Givet** att ledaren anger antal ledare som 0 eller ett negativt tal, **när** ledaren försöker gå vidare, **då** visar appen ett felmeddelande om att antalet ledare måste vara minst 1.
8. **Givet** att ledaren anger en passlängd som är kortare än vad som krävs för ett meningsfullt pass enligt `docs/doman/passuppbyggnad.md`, **när** ledaren försöker gå vidare, **då** visar appen ett felmeddelande om att passet är för kort.
9. **Givet** att ledaren väljer fokusområde, **när** ledaren tittar i listan, **då** visas de fokusområden som är definierade i `docs/doman/fokusomraden.md`, och ledaren kan välja ett eller flera.

## Beroenden

Inga. Detta är det första steget i generatorn.

## Utanför denna berättelse

- Att spara favoritinställningar för framtida generering (kan bli en förbättring senare, se backlog).
- Informationstexter som förklarar spelformerna för ledaren (ux-designerns ansvar).
- Att koppla underlaget till ett specifikt lag eller konto (kommer med inkrement 3, se berättelse 12).
