Status: ändrad vid K2 (2026-09-12)

# 13. Skapa egen övning

**Roll:** ledare

**Som** ledare **vill jag** kunna skapa en egen övning med samma typ av information som övningarna i banken, **så att** jag kan använda och dela mina egna idéer även om de inte finns i den gemensamma banken.

## Acceptanskriterier

1. **Givet** att ledaren fyller i namn, syfte, beskrivning, ålder, spelform, nivå, antal spelare, tid och övriga fält som gäller för en övning (se `content/ovningar/README.md`), **när** ledaren sparar övningen, **då** skapas en egen övning som tillhör ledarens klubb. Övningen har ingen granskningsstatus – den är antingen komplett eller inte, se kriterium 2.
2. **Givet** att ett eller flera av de fält som krävs för att övningen senare ska kunna bytas in i ett pass saknas – ålder, spelform, nivå, fokusområden, passdelar, ledarbehov, antal spelare, grupptyp eller tid (R-001 till R-009, R-106) – **när** ledaren försöker spara, **då** visar appen vilka fält som saknas och sparar övningen märkt som **Ofullständig**. När alla dessa fält är ifyllda visar appen i stället övningen som **Klar att använda**. En ofullständig övning kan sparas och delas inom klubben, men kan inte bytas in i ett pass (se berättelse 04) förrän den är komplett.
3. **Givet** att ledaren skriver i övningens fritextfält (till exempel syfte, beskrivning eller organisation), **när** ledaren skriver, **då** upplyser appen om att fälten inte ska innehålla namn på spelare (säkerhetsgranskning K2, fynd S-20).

## Beroenden

- 08 (registrera konto och logga in). Använder samma fältstruktur som den gemensamma banken (`content/ovningar/README.md`).

## Utanför denna berättelse

- Att skicka in övningen till den gemensamma banken (se berättelse 15).
- Att formuläret frågar rakt ut om övningen innehåller nickning. Det är Could i backloggen (beslut vid K1, punkt 13). I version 1 märker ledaren själv övningen med fokusområdet `nickspel` (R-081).
- Att generatorn automatiskt väljer klubbens egna övningar när ett pass genereras. Generatorn använder bara övningar med status `godkand` ur den gemensamma banken (R-022). Ledaren kan i stället själv byta in en av klubbens egna övningar i ett redan genererat pass, se berättelse 04.
- **Planskiss för egna övningar.** Beslutat vid K2 (2026-09-12): ingen ritredigerare i version 1. En egen övning saknar därför planskiss i version 1 (se berättelse 06, kriterium 2, om övningar utan planskiss). En ritredigerare för egna övningar ligger i backloggen som Could.
