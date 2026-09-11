Status: godkänd (K1, 2026-09-11)

# 04. Byta ut en övning i passet

**Roll:** ledare

**Som** ledare **vill jag** kunna byta ut en enskild övning i ett genererat pass mot en annan som passar samma plats i passet, **så att** jag kan anpassa passet efter mina egna önskemål utan att bygga om allt.

## Acceptanskriterier

1. **Givet** att ett genererat pass visas, **när** ledaren väljer att byta ut en övning X, **då** visar appen som alternativ dels övningar ur den gemensamma banken, dels ledarens klubbs egna övningar, som var för sig uppfyller: de uppfyller grundfiltret för övningar (bland annat ålder, spelform och att nivålistan innehåller den valda nivån), säkerhetsreglerna och, om ledaren har angett en yta, ytreglerna; de är märkta med samma del som X ligger i; de träffar valt fokus om delen är `del-ovning` eller `del-spelovning`; de fungerar med momentets antal spelare och ledare (och, i ett stationsmoment, med stationens grupper, tid och ledare); och de finns inte redan någon annanstans i passet (R-104). Klubbens egna övningar behöver inte ha status `godkand` för att visas som alternativ vid byte, till skillnad från vid generering (R-022) – det är ledarens eget, aktiva val – men de måste i övrigt uppfylla samma villkor och dessutom ha alla uppgifter som krävs för att kunna kontrolleras (se berättelse 13, kriterium 2). En egen övning som saknar någon av dessa uppgifter, eller som inte klarar säkerhetsreglerna, visas inte som alternativ (R-106).
2. **Givet** att ledaren väljer en ersättningsövning, **när** bytet bekräftas, **då** ersätts övningen i passet, och den nya övningen får den tid inom sina egna gränser som ligger närmast den ursprungliga övningens tid (R-105).
3. **Givet** att det inte finns någon annan matchande övning för delen, varken i den gemensamma banken eller bland klubbens egna övningar, **när** ledaren försöker byta ut övningen, **då** informerar appen om att det saknas alternativ, och den ursprungliga övningen ligger kvar oförändrad (R-104).
4. **Givet** att ledaren har bytt ut en övning, **när** ledaren vill byta ut fler övningar i samma pass, **då** kan flera övningar bytas ut oberoende av varandra innan passet sparas.
5. **Givet** att ett byte ändrar passets totala tid, **när** bytet är gjort, **då** visar appen den uppdaterade totaltiden så att ledaren ser eventuell avvikelse från den ursprungligt begärda passlängden, på samma sätt som vid generering (se berättelse 02).

## Beroenden

- 02 (generera ett träningspass).
- 13 (skapa egen övning), för att klubbens egna övningar ska finnas att visa som alternativ. Utan inkrement 4 byggt visas bara alternativ ur den gemensamma banken.

## Utanför denna berättelse

- Att lägga till en extra övning utöver det generatorn föreslagit, eller att ta bort en övning utan att ersätta den (se backlog, Could).
- Att ändra ordningen på övningarna i passet (se backlog, Could).
- Att spara ändringarna permanent (se berättelse 05).
