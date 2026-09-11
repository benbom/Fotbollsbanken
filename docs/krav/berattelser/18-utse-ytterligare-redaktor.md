Status: utkast

# 18. Utse ytterligare redaktör

**Roll:** redaktör

**Som** redaktör **vill jag** kunna utse en annan registrerad person till redaktör, **så att** fler kan hjälpa till att granska inskickade övningar när banken växer.

> **Obs:** det finns ingen apparoll motsvarande "systemägare" i version 1. Användaren beslutade vid K1 (2026-09-11, se `kravspec.md`) att en befintlig redaktör kan utse fler.

## Acceptanskriterier

1. **Givet** att en befintlig redaktör är inloggad, **när** redaktören utser en registrerad användare till redaktör, **då** får den personen redaktörens rättigheter (tillgång till redaktörskön, se berättelse 16) från och med då.
2. **Givet** att en person inte har något konto i appen, **när** en redaktör försöker utse personen, **då** går det inte att utse personen förrän personen har ett konto.
3. **Givet** att en redaktör vill återkalla någons redaktörsbehörighet, **när** redaktören gör det, **då** förlorar personen tillgång till redaktörskön, men behåller sina övriga roller, till exempel som ledare.

## Beroenden

- 08 (registrera konto och logga in), 16 (redaktören granskar en inskickad övning).

## Utanför denna berättelse

- Att begränsa redaktörskapet till vissa spelformer eller åldrar (alla redaktörer har samma rättigheter i version 1).
