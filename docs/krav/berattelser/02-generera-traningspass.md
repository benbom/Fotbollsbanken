Status: utkast

# 02. Generera ett träningspass

**Roll:** ledare

**Som** ledare **vill jag** att appen sätter ihop ett komplett träningspass av övningar som passar mitt underlag, **så att** jag slipper leta och kombinera övningar själv.

## Acceptanskriterier

1. **Givet** att ledaren har fyllt i giltigt underlag (se berättelse 01) och det finns tillräckligt många godkända övningar som matchar, **när** ledaren begär att generera passet, **då** visar appen ett förslag på träningspass uppbyggt enligt delarna i `docs/doman/passuppbyggnad.md`, som fyller ut i princip hela den begärda passlängden.
2. **Givet** att passet genereras, **då** innehåller varje övning i passet minst namn, syfte, beskrivning och rekommenderad tid, och är märkt med vilket delmoment i passet den hör till.
3. **Givet** att ledaren har angett 1 ledare, **när** passet genereras, **då** innehåller passet bara övningar/delmoment som kan genomföras av en ledare i taget, utan uppdelning i samtidiga stationer.
4. **Givet** att ledaren har angett fler än 1 ledare, **när** passet genereras, **då** kan passet innehålla delmoment med flera samtidiga stationer enligt vad `docs/doman/passuppbyggnad.md` anger för det antalet ledare, och antalet samtidiga stationer överstiger aldrig antalet angivna ledare.
5. **Givet** att antalet angivna spelare är lägre än det minsta antal en övning kräver, **när** passet genereras, **då** väljs inte den övningen, och passet innehåller i stället övningar vars spelarintervall inkluderar det angivna antalet.
6. **Givet** att antalet angivna spelare är högre än det största antal en övning stödjer, **när** passet genereras, **då** väljs inte den övningen som den står, om inte spelarna kan delas upp på flera samtidiga grupper enligt `docs/doman/passuppbyggnad.md` och det antal ledare som angetts.
7. **Givet** att antalet spelare är udda och en övning normalt kräver jämnt antal (till exempel parvis), **när** appen sätter ihop grupperna för övningen, **då** används den anpassning som är beskriven för övningen (fältet `anpassning`, se `content/ovningar/README.md`) eller principen i `docs/doman/passuppbyggnad.md` i stället för att övningen väljs bort enbart på grund av det udda antalet. Om ingen sådan anpassning finns beskriven väljs övningen bort, på samma sätt som i kriterium 5 och 6.
8. **Givet** att summan av de valda övningarnas rekommenderade tider inte exakt motsvarar den begärda passlängden, **när** appen sätter ihop passet, **då** hamnar den totala tiden inom den marginal som `docs/doman/passuppbyggnad.md` anger, och appen visar passets faktiska totala tid så att ledaren kan se eventuell avvikelse från det begärda värdet.
9. **Givet** att ledaren har valt en nivå, **när** passet genereras, **då** innehåller passet bara övningar som är taggade för den nivån enligt `docs/doman/nivaer.md`.
10. **Givet** att ledaren har valt ett eller flera fokusområden, **när** passet genereras, **då** innehåller passet övningar taggade med minst ett av de valda fokusområdena enligt `docs/doman/fokusomraden.md`.
11. **Givet** att övningsbanken innehåller övningar med olika status, **när** passet genereras, **då** används bara övningar med status `godkand` (se `content/ovningar/README.md`).
12. **Givet** att inga övningar alls matchar underlaget, **då** hanteras det enligt berättelse 03, inte genom att visa ett tomt eller felaktigt pass.

## Beroenden

- 01 (ange underlag och spelform).
- Innehåll: kräver att det finns godkända övningar i banken som matchar olika kombinationer av ålder, spelform, nivå, spelarantal och fokusområde (se `content/ovningar/`).

## Utanför denna berättelse

- Att rendera planskisser grafiskt (kommer med inkrement 2, se berättelse 06–07). I inkrement 1 räcker det att passet visas med text.
- Att byta ut en enskild övning i efterhand (se berättelse 04).
- Att spara passet (se berättelse 05).
- Att förklara för ledaren varför just en viss övning valdes framför en annan (möjlig förbättring, se backlog).
- Att ge olika kombinationer av övningar vid upprepad generering med samma underlag (algoritmval, ägs av senior-systemutvecklare).
