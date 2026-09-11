Status: utkast

# 13. Skapa egen övning

**Roll:** ledare

**Som** ledare **vill jag** kunna skapa en egen övning med samma typ av information som övningarna i banken, **så att** jag kan använda och dela mina egna idéer även om de inte finns i den gemensamma banken.

## Acceptanskriterier

1. **Givet** att ledaren fyller i namn, syfte, beskrivning, ålder, spelform, nivå, antal spelare, tid och övriga fält som gäller för en övning (se `content/ovningar/README.md`), **när** ledaren sparar övningen, **då** skapas en egen övning med status `utkast` som tillhör ledarens klubb.
2. **Givet** att de fält som krävs för att övningen ska kunna användas av generatorn saknas (till exempel ålder, spelform, antal spelare eller tid), **när** ledaren försöker spara, **då** visar appen vilka fält som saknas, och övningen sparas inte som klar att användas.
3. **Givet** att ledaren vill lägga till en planskiss för sin egna övning, **när** ledaren skapar övningen, **då** kan ledaren lägga till en planskiss på det sätt planskissmodulen erbjuder (format beslutas vid K2), eller lämna den tom enligt berättelse 06.

## Beroenden

- 08 (registrera konto och logga in). Använder samma fältstruktur som den gemensamma banken (`content/ovningar/README.md`).

## Utanför denna berättelse

- Att skicka in övningen till den gemensamma banken (se berättelse 15).
- Att generatorn automatiskt väljer klubbens egna övningar när ett pass genereras. Generatorn använder bara övningar med status `godkand` ur den gemensamma banken (R-022). Ledaren kan i stället själv byta in en av klubbens egna övningar i ett redan genererat pass, se berättelse 04.
