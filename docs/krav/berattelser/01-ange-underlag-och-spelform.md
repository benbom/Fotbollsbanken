Status: godkänd (K1, 2026-09-11)

# 01. Ange underlag och få spelform föreslagen

**Roll:** ledare

**Som** ledare **vill jag** ange ålder, nivå, antal spelare, antal ledare, passets längd och fokusområde, och få en spelform föreslagen utifrån åldern, **så att** jag snabbt kan komma igång med att generera ett träningspass utan att själv behöva kunna spelformsreglerna utantill.

## Acceptanskriterier

1. **Givet** att ledaren öppnar generatorn, **när** ledaren anger en ålder inom det spann som stöds enligt `docs/doman/spelformer.md`, **då** föreslår appen automatiskt den spelform som gäller för den åldern (R-012, R-013).
2. **Givet** att appen har föreslagit en spelform utifrån åldern, **när** ledaren i stället väljer en annan spelform, **då** kan ledaren bara välja den föreslagna spelformen eller den som ligger närmast före eller efter den i ordningen `3mot3`, `5mot5`, `7mot7`, `9mot9`, `11mot11`. Andra spelformer visas inte som valbara (R-014). Fasen som styr säkerhetsregler, tider och taket per ledare bestäms alltid av åldern, inte av den valda spelformen (R-015).
3. **Givet** att ledaren anger en ålder utanför det spann som stöds, **när** ledaren försöker gå vidare, **då** visar appen ett tydligt felmeddelande och tillåter inte generering förrän ett giltigt värde har angetts (R-011).
4. **Givet** att ledaren är på underlagssteget, **när** ledaren har angett ålder (och, om ledaren vill, en annan tillåten spelform), nivå enligt `docs/doman/nivaer.md`, antal spelare, antal ledare, passets längd i minuter och 1–3 fokusområden enligt `docs/doman/fokusomraden.md` varav minst ett är valt, **då** kan ledaren gå vidare till att generera passet. Yta är valfri och krävs inte för att gå vidare (R-020, R-090).
5. **Givet** att ett obligatoriskt fält saknas (ålder/spelform, nivå, antal spelare, antal ledare, passlängd eller fokusområde), **när** ledaren försöker generera passet, **då** visar appen vilka fält som saknas och genererar inget pass (R-020).
6. **Givet** att ledaren anger antal spelare som 0, ett negativt tal eller mer än 40, **när** ledaren försöker gå vidare, **då** visar appen ett felmeddelande om att antalet spelare måste vara mellan 1 och 40 (R-017).
7. **Givet** att ledaren anger antal ledare som 0, ett negativt tal eller mer än 10, **när** ledaren försöker gå vidare, **då** visar appen ett felmeddelande om att antalet ledare måste vara mellan 1 och 10 (R-017).
8. **Givet** att ledaren anger en passlängd som är kortare än 30 minuter, **när** ledaren försöker gå vidare, **då** visar appen ett felmeddelande om att passet är för kort. **Givet** att ledaren anger en passlängd som är längre än vad som är tillåtet för åldersfasen enligt `docs/doman/passuppbyggnad.md` (60/75/90/90/120 minuter beroende på fas), **när** ledaren försöker gå vidare, **då** visar appen ett felmeddelande som anger den längsta tillåtna passlängden för åldern (R-018).
9. **Givet** att ledaren väljer fokusområde, **när** ledaren tittar i listan, **då** visas bara de fokusområden som är kärnområde (K) eller relevanta (R) för den åldersfas som följer av den angivna åldern, enligt tabellen i `docs/doman/fokusomraden.md`. Ledaren väljer mellan ett och tre av dem (R-019).
10. **Givet** att ledaren väljer fokusområdet `nickspel`, **när** ledaren är under 13 år, **då** visas `nickspel` inte som valbart alls. **Givet** att ledaren är 13 år eller äldre och väljer `nickspel`, **när** ledaren försöker gå vidare med bara `nickspel` valt, **då** visar appen att ytterligare ett fokusområde måste väljas (R-080, R-083).
11. **Givet** att gruppen har spelare i flera åldrar, **då** informerar appen om att ledaren ska ange den ålder spelarna fyller i år som flest i gruppen har, enligt `docs/doman/generatorregler.md` (R-010).
12. **Givet** att ledaren är på underlagssteget, **när** ledaren väljer att ange yta, **då** kan ledaren välja en av hel, halv eller kvarts plan enligt `docs/doman/generatorregler.md` (R-090, R-091). Yta är valfri; om ledaren inte väljer någon yta används inget ytfilter vid generering (se berättelse 02).

## Beroenden

Inga. Detta är det första steget i generatorn.

## Utanför denna berättelse

- Att spara favoritinställningar för framtida generering (kan bli en förbättring senare, se backlog).
- Informationstexter som förklarar spelformerna för ledaren (ux-designerns ansvar).
- Att koppla underlaget till ett specifikt lag eller konto (kommer med inkrement 3, se berättelse 12).
- Ett materialfilter (till exempel antal bollar, koner eller mål) – ingår inte i version 1 (se backlog).
- Inomhushall som yta – kommer i en senare version (se backlog).
- Antal målvakter som ett eget fält i underlaget – ingår inte i version 1 (se backlog).
