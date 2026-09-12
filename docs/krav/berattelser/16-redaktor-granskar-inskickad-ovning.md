Status: ändrad vid K2 (2026-09-12)

# 16. Redaktören granskar en inskickad övning

**Roll:** redaktör

**Som** redaktör **vill jag** se en kö av inskickade övningar och kunna godkänna eller skicka tillbaka dem, **så att** bara granskat innehåll blir en del av den gemensamma banken.

> **Obs:** appens roller är ledare, klubbadmin och redaktör – det finns ingen egen apparoll för "fotbollsexpert" (den rollen finns i utvecklingsteamet, för att bygga upp banken i fas 3). Användaren beslutade vid K1 (2026-09-11, se `kravspec.md`) att redaktören i appen ensam avgör om en inskickad övning godkänns eller behöver åtgärdas.

## Acceptanskriterier

1. **Givet** att det finns inskickade övningar, **när** redaktören öppnar redaktörskön, **då** listas alla övningar som väntar på granskning, med den information som behövs för att bedöma dem (se `content/ovningar/README.md`).
2. **Givet** att redaktören anser att en övning håller måttet, **när** redaktören godkänner övningen, **då** får övningen status `godkand` och blir valbar för generatorn i alla klubbar.
3. **Givet** att redaktören anser att en övning behöver ändras, **när** redaktören sätter status `atgarda` och skriver en kommentar, **då** meddelas den ledare som skickade in övningen om att den behöver ändras, tillsammans med kommentaren.
4. **Givet** att ingen människa har godkänt en övning, **då** kan övningen aldrig få status `godkand` automatiskt, i linje med principen i `CLAUDE.md` att bara en människa sätter den statusen.
5. **Givet** att redaktören skriver en kommentar till den ledare som skickade in övningen, **när** redaktören skriver, **då** upplyser appen om att kommentaren inte ska innehålla namn på spelare (säkerhetsgranskning K2, fynd S-20).

## Beroenden

- 15 (skicka in en övning till banken).

## Utanför denna berättelse

- Att fler än en person granskar samma övning innan beslut (till exempel en separat fotbollsfacklig granskning i appen) – se beslutet ovan.
- Att redaktören redigerar övningens innehåll direkt i stället för att skicka tillbaka den (i version 1 skickas den tillbaka till ledaren för ändring).
