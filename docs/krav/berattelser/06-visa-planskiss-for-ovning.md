Status: ändrad vid K2 (2026-09-12)

# 06. Visa planskiss för en övning

**Roll:** ledare

**Som** ledare **vill jag** se en tydlig planskiss för varje övning, **så att** jag snabbt förstår hur övningen ska ställas upp på planen utan att behöva läsa hela beskrivningen.

## Acceptanskriterier

1. **Givet** att en övning har skissdata, **när** ledaren öppnar övningen (till exempel i ett genererat eller sparat pass, eller i övningsbanken), **då** visas en planskiss tillsammans med övningens text.
2. **Givet** att en övning saknar skissdata, **när** ledaren öppnar övningen, **då** visas övningen ändå med sin text, med en tydlig markering om att planskiss saknas, i stället för ett fel eller en tom yta.
3. **Givet** att ledaren visar en planskiss på en mobil skärm, **då** är skissen läsbar och proportionerlig utan att ledaren behöver zooma för att se helheten.
4. **Givet** att planskissen visar en yta med mått, **då** motsvarar de visade måtten och uppställningen övningens skissdata och yta, anpassat efter den spelform övningen visas för.

## Beroenden

- Innehåll: kräver övningar med ifylld planskiss i `content/ovningar/`.
- Skissformatet beslutas av senior-systemutvecklare och planskissutvecklare vid K2.

## Utanför denna berättelse

- Att ledaren själv ritar eller redigerar en planskiss (endast läsning i denna berättelse). Beslutat vid K2 (2026-09-12): ingen ritredigerare i version 1, så en egen övning (berättelse 13) saknar planskiss och visas enligt kriterium 2 ovan. En ritredigerare för egna övningar ligger i backloggen som Could.
- Att visa flera övningars planskisser samlat för ett helt pass (se berättelse 07).
