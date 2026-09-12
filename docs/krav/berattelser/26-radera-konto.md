Status: utkast

# 26. Radera sitt konto

**Roll:** ledare, klubbadmin, redaktör

**Som** inloggad person **vill jag** kunna radera mitt konto i appen, **så att** jag kan utöva min rätt att få mina personuppgifter borttagna när jag inte längre vill vara med.

## Acceptanskriterier

1. **Givet** att en inloggad person väljer att radera sitt konto och bekräftar det, **när** raderingen genomförs, **då** verkställs den direkt: personens profil och inloggningsuppgifter (namn, e-post) tas bort, och personen loggas ut och kan inte längre logga in med det kontot.
2. **Givet** att personen har material som delas med andra (till exempel lagets sparade pass, klubbens egna övningar eller en övning personen fått godkänd i den gemensamma banken), **när** kontot raderas, **då** finns materialet kvar för de som annars hade tillgång till det, men utan koppling till personen – personens namn visas inte längre som skapare.
3. **Givet** att personen är den enda klubbadminen i sin klubb, **när** personen försöker radera sitt konto, **då** hindras raderingen, och appen upplyser om att en till klubbadmin måste utses först (se berättelse 09, kriterium 4).
4. **Givet** att klubben redan har en till klubbadmin, eller att personen inte är klubbadmin alls, **när** personen raderar sitt konto, **då** genomförs raderingen utan att villkoret i kriterium 3 hindrar den.
5. **Givet** att radering inte går att ångra, **när** personen begär radering, **då** ber appen om en tydlig bekräftelse innan kontot faktiskt raderas.
6. **Givet** att personen ångrar sig innan bekräftelsen, **när** personen avbryter, **då** finns kontot kvar helt oförändrat.
7. **Givet** att ett konto har raderats, **när** samma e-postadress senare används för att registrera ett nytt konto, **då** behandlas det som ett helt nytt konto, utan koppling till det raderade kontots historik.

## Beroenden

- 08 (registrera konto och logga in).
- 09, kriterium 4 (klubbadmin kan utse ytterligare klubbadmin) – en förutsättning för kriterium 3 ovan.

## Utanför denna berättelse

- Att tillfälligt inaktivera eller pausa ett konto utan att radera det – inte ett krav i version 1.
- Att exportera sina egna uppgifter innan radering (dataportabilitet).
- Att en klubbadmin eller redaktör raderar en annan persons konto åt dem.
- Hur länge avidentifierat material eller krypterade säkerhetskopior kan innehålla spår av kontot efter radering – beskrivs i integritetspolicyn (se backlog, "Innan lansering"), inte här.
- Om den sista redaktören ska hindras från att radera sitt konto på samma sätt som den sista klubbadminen (kriterium 3) är inte avgjort. Se *Beslut som behövs*.
