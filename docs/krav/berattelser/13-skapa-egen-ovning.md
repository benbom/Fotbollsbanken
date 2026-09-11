Status: utkast

# 13. Skapa egen övning

**Roll:** ledare

**Som** ledare **vill jag** kunna skapa en egen övning med samma typ av information som övningarna i banken, **så att** jag kan använda och dela mina egna idéer även om de inte finns i den gemensamma banken.

## Acceptanskriterier

1. **Givet** att ledaren fyller i namn, syfte, beskrivning, ålder, spelform, nivå, antal spelare, tid och övriga fält som gäller för en övning (se `content/ovningar/README.md`), **när** ledaren sparar övningen, **då** skapas en egen övning med status `utkast` som tillhör ledarens klubb.
2. **Givet** att ett eller flera av de fält som krävs för att övningen senare ska kunna bytas in i ett pass saknas – ålder, spelform, nivå, fokusområden, passdelar, ledarbehov, antal spelare, grupptyp eller tid (R-001 till R-009, R-106) – **när** ledaren försöker spara, **då** visar appen vilka fält som saknas, men sparar ändå övningen med status `utkast`. En övning som saknar något av dessa fält kan alltså sparas och delas inom klubben, men kan inte bytas in i ett pass (se berättelse 04) förrän fälten är ifyllda.
3. **Givet** att ledaren vill lägga till en planskiss för sin egna övning, **när** ledaren skapar övningen, **då** kan ledaren lägga till en planskiss på det sätt planskissmodulen erbjuder (format beslutas vid K2), eller lämna den tom enligt berättelse 06.
4. **(Förslag, godkänns vid K1 – se kravspec.md, avsnittet "Beslut vid K1", förslag B.)** **Givet** att ledaren fyller i formuläret för en egen övning, **när** ledaren kommer till frågan om nickning, **då** frågar appen rakt ut om spelarna nickar bollen som en planerad del av övningen. **Givet** att ledaren svarar ja, **då** läggs `nickspel` automatiskt till bland övningens fokusområden (R-081), så att nickreglerna (R-080 till R-083) kan tillämpas även på egna övningar, som inte granskas av fotbollsexpert eller redaktör.

## Beroenden

- 08 (registrera konto och logga in). Använder samma fältstruktur som den gemensamma banken (`content/ovningar/README.md`).

## Utanför denna berättelse

- Att skicka in övningen till den gemensamma banken (se berättelse 15).
- Att generatorn automatiskt väljer klubbens egna övningar när ett pass genereras. Generatorn använder bara övningar med status `godkand` ur den gemensamma banken (R-022). Ledaren kan i stället själv byta in en av klubbens egna övningar i ett redan genererat pass, se berättelse 04.
