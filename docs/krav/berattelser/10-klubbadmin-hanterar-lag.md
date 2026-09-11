Status: godkänd (K1, 2026-09-11)

# 10. Klubbadmin hanterar lag

**Roll:** klubbadmin

**Som** klubbadmin **vill jag** skapa och redigera lag inom min klubb, **så att** ledare kan kopplas till rätt lag utifrån ålder och spelform.

## Acceptanskriterier

1. **Givet** att klubbadmin är inne i sin klubb, **när** klubbadmin skapar ett lag med namn och ålder (och vid behov spelform, som annars föreslås enligt `docs/doman/spelformer.md`), **då** finns laget listat under klubben.
2. **Givet** att ett lag finns, **när** klubbadmin redigerar lagets uppgifter, **då** uppdateras uppgifterna för alla som är kopplade till laget.
3. **Givet** att ett lag inte längre används, **när** klubbadmin tar bort eller arkiverar laget, **då** tas det bort från de aktiva listorna, och klubbadmin varnas i förväg om att laget har sparade pass kopplade till sig innan borttagningen bekräftas.

## Beroenden

- 09 (klubbadmin skapar klubb).

## Utanför denna berättelse

- Att flytta ett lag mellan klubbar.
- Detaljerad historik/logg över ändringar i lagets uppgifter (se backlog, Could).
