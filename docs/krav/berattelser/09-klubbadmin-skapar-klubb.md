Status: ändrad vid K2 (2026-09-12)

# 09. Klubbadmin skapar klubb

**Roll:** klubbadmin

**Som** klubbadmin **vill jag** skapa min klubb i appen, **så att** klubbens lag och ledare kan samlas under en gemensam klubb.

## Acceptanskriterier

1. **Givet** att en inloggad person ännu inte har skapat eller anslutit sig till en klubb, **när** personen skapar en klubb med ett namn, **då** finns klubben i appen, och personen är kopplad till den som klubbadmin.
2. **Givet** att en klubb med samma namn redan finns i appen, **när** en person försöker skapa en klubb med det namnet, **då** informeras personen om att kontrollera om klubben redan finns, i stället för att en andra, identisk klubb skapas av misstag.
3. **Givet** att flera klubbar finns i appen (datamodellen ska klara flera klubbar, se `CLAUDE.md`), **när** en klubbadmin arbetar i sin klubb, **då** ser klubbadmin bara sin egen klubbs lag, ledare och övningar – inte andra klubbars.
4. **Givet** att klubbadmin vill dela adminrollen med en annan person i klubben, **när** klubbadmin utser den personen till klubbadmin, **då** får den personen samma rättigheter som klubbadmin i klubben, utöver sina övriga roller (motsvarande hur en redaktör kan utse en till redaktör, se berättelse 18). En klubb kan alltså ha fler än en klubbadmin. Detta är en förutsättning för att den sista klubbadminen ska kunna utse en efterträdare innan hen raderar sitt konto (se berättelse 26, kriterium 3).

## Beroenden

- 08 (registrera konto och logga in).

## Utanför denna berättelse

- Att gå med i en befintlig klubb som en andra klubbadmin utan att bli utsedd (se kriterium 4 för att bli utsedd av en befintlig klubbadmin).
- Att en klubbadmin återkallar en annan klubbadmins behörighet – ligger i backloggen som Could, i linje med hur redaktörskapet återkallas i berättelse 18.
- Fakturering eller andra klubbuppgifter utöver namn och de lag/ledare som hör dit.
