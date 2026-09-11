Status: utkast

# 14. Hantera klubbens egna övningar

**Roll:** ledare

**Som** ledare **vill jag** kunna se, redigera och ta bort de övningar som jag och andra i min klubb har skapat, **så att** klubbens egna övningar hålls uppdaterade och relevanta.

## Acceptanskriterier

1. **Givet** att ledaren är inloggad, **när** ledaren öppnar klubbens egna övningar, **då** ser ledaren alla övningar som ledare i klubben har skapat, oavsett vem som skapade dem.
2. **Givet** att en egen övning inte längre stämmer, **när** en ledare i klubben redigerar övningen, **då** sparas ändringarna och syns för övriga i klubben.
3. **Givet** att en egen övning ska tas bort, **när** en ledare tar bort den, **då** försvinner den från klubbens lista och kan inte längre väljas i nya pass, men pass där den redan använts påverkas inte i onödan.
4. **Givet** att en egen övning redan är inskickad till den gemensamma banken och väntar på granskning (se berättelse 15), **när** en ledare försöker redigera eller ta bort den, **då** informeras ledaren om att övningen är under granskning innan ändringen genomförs.

## Beroenden

- 13 (skapa egen övning).

## Utanför denna berättelse

- Att klubbens egna, ej godkända övningar delas med andra klubbar (det sker först vid godkännande, se berättelse 16).
- Behörighetsnivåer för vem i klubben som får redigera vems övning – i version 1 kan alla ledare i klubben redigera klubbens egna övningar.
- Att generatorn automatiskt tar med klubbens egna övningar när ett pass genereras. Generatorn använder bara godkända övningar ur den gemensamma banken (R-022). Ledaren kan själv byta in en av klubbens egna övningar i ett genererat pass, se berättelse 04.
