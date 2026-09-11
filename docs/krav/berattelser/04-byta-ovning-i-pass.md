Status: utkast

# 04. Byta ut en övning i passet

**Roll:** ledare

**Som** ledare **vill jag** kunna byta ut en enskild övning i ett genererat pass mot en annan som passar samma plats i passet, **så att** jag kan anpassa passet efter mina egna önskemål utan att bygga om allt.

## Acceptanskriterier

1. **Givet** att ett genererat pass visas, **när** ledaren väljer att byta ut en övning, **då** visar appen andra godkända övningar som passar samma delmoment, ålder/spelform, nivå och antal spelare som den ursprungliga övningen.
2. **Givet** att ledaren väljer en ersättningsövning, **när** bytet bekräftas, **då** ersätts övningen i passet, och den nya övningens tid ersätter den gamlas i passets totala tidsberäkning.
3. **Givet** att det inte finns någon annan matchande övning för det delmomentet, **när** ledaren försöker byta ut övningen, **då** informerar appen om att det saknas alternativ, och den ursprungliga övningen ligger kvar oförändrad.
4. **Givet** att ledaren har bytt ut en övning, **när** ledaren vill byta ut fler övningar i samma pass, **då** kan flera övningar bytas ut oberoende av varandra innan passet sparas.
5. **Givet** att ett byte ändrar passets totala tid, **när** bytet är gjort, **då** visar appen den uppdaterade totaltiden så att ledaren ser eventuell avvikelse från den ursprungligt begärda passlängden, på samma sätt som vid generering (se berättelse 02).

## Beroenden

- 02 (generera ett träningspass).

## Utanför denna berättelse

- Att lägga till en extra övning utöver det generatorn föreslagit, eller att ta bort en övning utan att ersätta den (se backlog, Could).
- Att ändra ordningen på övningarna i passet (se backlog, Could).
- Att spara ändringarna permanent (se berättelse 05).
