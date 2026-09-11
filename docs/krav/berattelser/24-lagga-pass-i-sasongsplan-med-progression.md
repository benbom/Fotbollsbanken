Status: utkast

# 24. Lägga pass i säsongsplanen med progression

**Roll:** ledare

**Som** ledare **vill jag** kunna lägga träningspass i säsongsplanens veckor och se hur tema och fokusområden utvecklas över tid, **så att** träningen bygger vidare från vecka till vecka i stället för att bli slumpmässig.

## Acceptanskriterier

1. **Givet** att en säsongsplan finns, **när** ledaren kopplar ett sparat eller nygenererat pass till en vecka, **då** visas passet på den veckan i planen. **Givet** att laget tränar mer än en gång i veckan, **när** ledaren kopplar flera pass till samma vecka, **då** visas alla veckans pass på veckan (`sasongsprogression.md` anger att flera pass i veckan är vanligt från `fas-10-12` och uppåt).
2. **Givet** att flera veckor har pass kopplade till sig, **när** ledaren tittar på säsongsplanen, **då** ser ledaren veckans fokus: alla fokusområden som ledaren valde för veckans pass, utan dubletter, i den ordning de först förekommer i datumordning, så att progressionen över perioden blir synlig (R-110, `docs/doman/sasongsprogression.md`).
3. **Givet** att ledaren vill byta vilket pass som ligger på en viss vecka, **när** ledaren gör det, **då** uppdateras veckans innehåll utan att andra veckor påverkas. **Givet** att säsongsplanen sträcker sig över ett årsskifte, **när** ledaren kopplar ett pass till en vecka som ligger i det nya kalenderåret, **då** räknas åldern för det passet som ett år högre än vid planens start, vilket kan ändra vilken åldersfas (och därmed till exempel spelform och tillåten passlängd) som gäller för det passet (R-113).
4. **Givet** att en vecka inte har något pass kopplat, **när** ledaren ser säsongsplanen, **då** visas veckan tydligt som tom, inte som ett fel.

## Beroenden

- 23 (skapa en säsongsplan), 02/05 (pass finns att koppla).

## Utanför denna berättelse

- Att appen automatiskt föreslår vilket pass som bör ligga på en viss vecka utifrån progressionen (skulle likna generering på säsongsnivå – möjlig framtida förbättring, se backlog).
- Att ledaren skriver in perioder (till exempel försäsong, vårsäsong) och teman för ett block, innan passen finns – se backlog, Could.
- Att appen varnar om ett kärnområde inte förekommit på länge (R-112) – se backlog, Could.
