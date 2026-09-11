Status: utkast

# Passuppbyggnad

**Ägare:** fotbollsexpert

Den här filen beskriver hur ett träningspass byggs upp: vilka delar passet har, hur lång tid varje del får i olika åldrar, hur vila och vätska läggs in, hur antalet ledare påverkar upplägget och hur spelarna delas i grupper. Den är underlag för generatorn (berättelse 02–04) och för reglerna i `generatorregler.md`. Där det står ett regel-ID, till exempel R-040, är det regeln i `generatorregler.md` som gäller exakt.

Filen använder samma nycklar som de andra domänfilerna: spelformer (`3mot3` … `11mot11`) från `spelformer.md`, åldersfaser (`fas-6-7` … `fas-15-19`) från `aldrar-och-fokus.md`, nivåer (`niva-1` … `niva-3`) från `nivaer.md` och fokusområden från `fokusomraden.md`.

## Källäge

- Grundprinciperna (spelet lär ut spelet, många bollkontakter, alla får vara med, lek för de yngsta) kommer från SvFF:s riktlinjer *Fotbollens spela, lek och lär* och spelarutbildningsplanen. Se källorna i `aldrar-och-fokus.md`.
- SvFF rekommenderar skadeförebyggande program som en del av uppvärmningen. *FIFA 11+ Kids* är avsett för 7–14 år och FIFA 11+ för äldre. Båda ska användas minst två gånger i veckan för att ge effekt. *Knäkontroll* anges ta 10–15 minuter i uppvärmningen, två gånger i veckan. Källa: SvFF, Skadeförebyggande program, https://aktiva.svenskfotboll.se/spelare/halsa/skadeforebyggande-program/ (hämtad 2026-09-11).
- Allt annat i filen, alltså delarna, tidsandelarna, pausintervallen, gränserna för spelare per ledare och stationsreglerna, är **min bedömning som tränarutbildare**. SvFF anger så vitt jag vet inga sådana siffror. Siffrorna bygger på riktvärdena i `aldrar-och-fokus.md` och är valda så att en ideell ledare kan genomföra passet på en vanlig plan.

## Passets delar

Ett pass har fem delar i fast ordning. Nyckeln används i övningarnas nya fält `passdelar` (se nedan) och i generatorn.

| Ordning | Nyckel | Namn för ledaren | Fylls från banken | Vad som händer |
|---|---|---|---|---|
| 1 | `del-uppvarmning` | Uppvärmning | Ja | Kroppen och huvudet kommer igång. Lek, bollkänsla, rörelse och från 10 år skadeförebyggande moment. Alla är aktiva direkt, nästan ingen genomgång. |
| 2 | `del-ovning` | Öva | Ja | Dagens fokus övas med många upprepningar. Ingen eller begränsad motståndare, så att spelarna hinner lyckas. |
| 3 | `del-spelovning` | Spelövning | Ja | Samma fokus används i spel med motståndare, riktning och mål. Reglerna i spelet gör att fokuset händer ofta. |
| 4 | `del-spel` | Spel | Ja | Spel med två lag och mål, i dagens spelform eller mindre. Friare, med mycket speltid för alla. |
| 5 | `del-avslutning` | Avslutning | Nej, fast inslag | Lugn nedvarvning och samling: vad tränade vi på, vad gick bra. Kort och positivt. |

Tanken bakom ordningen är enkel: **värm upp, öva, använd det i spel och spela.** Delarna 2 och 3 är passets kärna och bär dagens fokusområde. Delarna 1 och 4 ska helst också träffa fokus, men får ha annat innehåll (R-044 till R-047).

### Övningens fält `passdelar`

En övning märks med en eller flera av de fyra delarna som fylls från banken, till exempel `[del-uppvarmning, del-spel]` för en lek som fungerar både i början och i slutet. `del-avslutning` används inte som märkning, eftersom avslutningen är ett fast inslag.

Riktlinjer till övningsförfattaren:

- `del-uppvarmning`: kommer igång snabbt, låg till medelhög intensitet i början, alla aktiva. Lekar, bollkänsla, rörelse, passningslekar, skadeförebyggande program.
- `del-ovning`: tydligt fokus, många upprepningar, ingen eller passiv motståndare, eller ett överläge som gör att spelarna lyckas (till exempel 2 mot 1).
- `del-spelovning`: motståndare, riktning och mål. Regler som gör att fokuset händer ofta (till exempel poäng för en passning till en kantspelare).
- `del-spel`: två lag, mål och riktning. Övningen ska ha grupptypen `tva-lag` (se nedan och R-008).

Det här är nytt jämfört med fältlistan i `content/ovningar/README.md`. Se rapporten.

## Passlängd

- **Kortaste pass:** 30 minuter för alla åldrar (R-018). Kortare än så hinner passet inte både värma upp och spela.
- **Längsta pass:** beror på åldern, eftersom koncentration och ork är mindre hos de yngsta (R-018).

| Fas | Kortast | Längst |
|---|---|---|
| `fas-6-7` | 30 min | 60 min |
| `fas-8-9` | 30 min | 75 min |
| `fas-10-12` | 30 min | 90 min |
| `fas-13-14` | 30 min | 90 min |
| `fas-15-19` | 30 min | 120 min |

Passlängden är ett heltal i minuter. Tabellerna nedan visar 45, 60, 75 och 90 minuter. Andra längder räknas fram med samma regler (R-030 till R-034).

## Så räknas tiden fram

Tiden fördelas i fyra steg. Stegen är skrivna så att samma passlängd alltid ger samma tidsplan.

1. **Avslutningen** får en fast tid: 3 minuter för `fas-6-7` och `fas-8-9`. För äldre 3 minuter om passet är kortare än 60 minuter, annars 5 minuter.
2. **Vattenpauserna** är 2 minuter var. Antalet beror på hur ofta åldern behöver en paus (pausintervallet):

   | Fas | Pausintervall |
   |---|---|
   | `fas-6-7` | 15 min |
   | `fas-8-9` | 15 min |
   | `fas-10-12` | 20 min |
   | `fas-13-14` | 20 min |
   | `fas-15-19` | 25 min |

   Antal pauser = passlängden delad med pausintervallet, avrundat uppåt, minus 1. Exempel: 60 minuter för 8–9 år ger 60 / 15 = 4, minus 1 = 3 pauser. Pausen räcker också till att byta övning och flytta sig till nästa yta.
3. **Den aktiva tiden** är det som blir kvar: passlängd minus avslutning minus vattenpauser.
4. **Den aktiva tiden fördelas** på de fyra delarna med andelarna nedan. Uppvärmning, Öva och Spelövning avrundas nedåt till hela minuter. Spel får resten. Det gör att avrundningen alltid gynnar spelet.

| Fas | `del-uppvarmning` | `del-ovning` | `del-spelovning` | `del-spel` |
|---|---|---|---|---|
| `fas-6-7` | 25 % | 25 % | 15 % | 35 % |
| `fas-8-9` | 20 % | 25 % | 20 % | 35 % |
| `fas-10-12` | 20 % | 20 % | 25 % | 35 % |
| `fas-13-14` | 25 % | 15 % | 25 % | 35 % |
| `fas-15-19` | 25 % | 15 % | 25 % | 35 % |

Varför andelarna ser ut så (min bedömning):

- **Spel är alltid den största delen**, eftersom spelet lär ut spelet. Spelövning och spel tillsammans är 50–60 procent av den aktiva tiden.
- **De yngsta har mer tid för att öva** med egen boll och mer uppvärmning med lek.
- **Från 13 år är uppvärmningen längre** så att det skadeförebyggande programmet ryms (SvFF anger 10–15 minuter för Knäkontroll).
- **Övning utan motståndare minskar med åldern** till förmån för spelövning.

Om Öva eller Spelövning får mindre än 5 minuter tas delen bort, och minuterna läggs på Spel (R-033). Det händer bara i korta pass, till exempel 30 minuter för 13–19 år.

### Tidsplaner per fas

Alla tider i minuter. "Vatten" är alla vattenpauser tillsammans.

**`fas-6-7`** (längst 60 minuter)

| Passlängd | Uppvärmning | Öva | Spelövning | Spel | Vatten | Avslutning | Summa |
|---|---|---|---|---|---|---|---|
| 45 | 9 | 9 | 5 | 15 | 4 (2 st) | 3 | 45 |
| 60 | 12 | 12 | 7 | 20 | 6 (3 st) | 3 | 60 |

**`fas-8-9`** (längst 75 minuter)

| Passlängd | Uppvärmning | Öva | Spelövning | Spel | Vatten | Avslutning | Summa |
|---|---|---|---|---|---|---|---|
| 45 | 7 | 9 | 7 | 15 | 4 (2 st) | 3 | 45 |
| 60 | 10 | 12 | 10 | 19 | 6 (3 st) | 3 | 60 |
| 75 | 12 | 16 | 12 | 24 | 8 (4 st) | 3 | 75 |

**`fas-10-12`** (längst 90 minuter)

| Passlängd | Uppvärmning | Öva | Spelövning | Spel | Vatten | Avslutning | Summa |
|---|---|---|---|---|---|---|---|
| 45 | 7 | 7 | 9 | 15 | 4 (2 st) | 3 | 45 |
| 60 | 10 | 10 | 12 | 19 | 4 (2 st) | 5 | 60 |
| 75 | 12 | 12 | 16 | 24 | 6 (3 st) | 5 | 75 |
| 90 | 15 | 15 | 19 | 28 | 8 (4 st) | 5 | 90 |

**`fas-13-14`** (längst 90 minuter)

| Passlängd | Uppvärmning | Öva | Spelövning | Spel | Vatten | Avslutning | Summa |
|---|---|---|---|---|---|---|---|
| 45 | 9 | 5 | 9 | 15 | 4 (2 st) | 3 | 45 |
| 60 | 12 | 7 | 12 | 20 | 4 (2 st) | 5 | 60 |
| 75 | 16 | 9 | 16 | 23 | 6 (3 st) | 5 | 75 |
| 90 | 19 | 11 | 19 | 28 | 8 (4 st) | 5 | 90 |

**`fas-15-19`** (längst 120 minuter)

| Passlängd | Uppvärmning | Öva | Spelövning | Spel | Vatten | Avslutning | Summa |
|---|---|---|---|---|---|---|---|
| 45 | 10 | 6 | 10 | 14 | 2 (1 st) | 3 | 45 |
| 60 | 12 | 7 | 12 | 20 | 4 (2 st) | 5 | 60 |
| 75 | 16 | 9 | 16 | 25 | 4 (2 st) | 5 | 75 |
| 90 | 19 | 11 | 19 | 30 | 6 (3 st) | 5 | 90 |

Tiderna i tabellerna är **måltider**. Generatorn får avvika lite när den fyller delarna med övningar, se nästa avsnitt.

## Hur mycket passet får avvika från den begärda längden

Övningar har en tid som bara kan ändras inom vissa gränser, så delarna blir sällan exakt lika långa som måltiden. Det här är acceptabelt (berättelse 02, kriterium 8):

- **Hela passet:** högst 5 minuter kortare än den begärda längden och aldrig längre (R-036). Ett pass som blir några minuter kortare går alltid att använda, eftersom det nästan alltid tar lite extra tid att samla gruppen. Ett pass som drar över tiden kan krocka med nästa lag på planen.
- **Varje del:** högst 3 minuter från måltiden, uppåt eller nedåt (R-035).
- **Vattenpauser och avslutning** får aldrig kortas för att få tiden att gå ihop.

## Hur lång tid en övning får ta

En övning ska inte hålla på längre än gruppen orkar koncentrera sig på samma sak. Gränserna följer riktvärdena i `aldrar-och-fokus.md` (R-034).

| Fas | Kortast, alla delar | Längst i Uppvärmning, Öva och Spelövning | Längst i Spel |
|---|---|---|---|
| `fas-6-7` | 5 min | 8 min | 20 min |
| `fas-8-9` | 5 min | 10 min | 25 min |
| `fas-10-12` | 5 min | 15 min | 30 min |
| `fas-13-14` | 5 min | 20 min | 35 min |
| `fas-15-19` | 5 min | 25 min | 45 min |

Spel får vara längre än övningar, eftersom barn orkar spela länge när spelet byter motståndare eller spelas i korta perioder med paus emellan. En del kan innehålla en eller två övningar (R-038). Om en del är längre än den längsta tiden för en övning blir det två övningar.

**Förslag till datamodellen (beslutas vid K2):** i dag har en övning en rekommenderad tid. Generatorn behöver också veta hur kort och hur lång övningen kan göras, till exempel "10 minuter, går att köra 6–15". Jag föreslår att `tid` får tre värden: kortast, rekommenderad och längst. Om en övning bara har ett värde gäller det som både kortast och längst.

## Vila och vätska

Barn blir varma och uttorkade fortare än vuxna. Därför är vattenpauserna ett fast inslag i varje pass, inte något som ledaren förväntas komma ihåg själv.

- **Pauserna räknas in i passets tid** och tas aldrig bort av generatorn (R-031).
- **Pausen läggs mellan två övningar** eller, i Spel, mellan två perioder av spelet. Aldrig mitt i en övning i de andra delarna (R-037).
- **Pauserna sprids ut** så att den längsta tiden utan paus blir så kort som möjligt (R-037).
- **Varje spelare har egen vattenflaska.** Det är ett råd till ledaren som appen kan visa. Det är inte en regel för generatorn.
- **Vid värme** bör ledaren lägga in fler pauser och sänka intensiteten. Appen vet inte hur vädret är, så det är ledarens bedömning. Samma sak gäller vid kyla, där korta genomgångar och snabb start är viktigast.
- **Vila inom övningen:** för de yngsta sker vilan naturligt, eftersom de springer i korta ryck. I intensiva spel för 13–19 år, till exempel spel för `uthallighet`, ska övningen själv beskriva arbete och vila (till exempel 3 minuter spel, 1 minut vila). Det kontrollerar jag när jag granskar övningen.

## Hur spelarna delas i grupper

Varje övning anger hur många spelare **en grupp** kan ha: minst och högst (fältet `spelare`). En grupp är de spelare som gör övningen tillsammans på en yta med en uppsättning material. Om det finns fler spelare än en grupp rymmer, körs övningen i flera grupper samtidigt, sida vid sida (R-051).

### Grupptyper

För att generatorn ska kunna dela gruppen och hantera udda antal behöver varje övning en grupptyp. Det är ett nytt fält, se rapporten.

| Nyckel | Betyder | Exempel | Udda antal |
|---|---|---|---|
| `fri` | Alla i samma yta, antalet behöver inte gå jämnt ut | Bollkänsla med egen boll, kull med boll | Inga problem |
| `par` | Spelarna jobbar två och två | Passningar i par | En grupp blir tre och passar i triangel |
| `tva-lag` | Två lag mot varandra | 3 mot 3, 4 mot 4 med jokrar | En spelare blir joker och är alltid med laget som har bollen. För 6–9 år fungerar det också att ena laget har en spelare mer |
| `fast-storlek` | Grupper med ett bestämt antal | Tre spelare där en anfaller mot två försvarare som roterar | Bara om övningen själv beskriver en lösning, till exempel att en spelare vilar och byter in |

Så gör generatorn (R-051 till R-056):

1. **Så få grupper som möjligt.** Generatorn väljer det minsta antal grupper där ingen grupp blir större än övningens högsta antal.
2. **Jämnt fördelat.** Grupperna skiljer sig med högst en spelare.
3. **Ingen grupp för liten.** Om någon grupp blir mindre än övningens minsta antal kan övningen inte användas med det antalet spelare.
4. **Udda antal** hanteras enligt tabellen ovan. Bara övningar med grupptypen `fast-storlek` kan väljas bort på grund av udda antal (berättelse 02, kriterium 7).
5. **För få spelare:** om det totala antalet spelare är mindre än övningens minsta antal väljs övningen inte (berättelse 02, kriterium 5).

*Min bedömning:* ledaren kan ofta vara med och spela för att få jämnt, men generatorn räknar aldrig med det. Ledaren ska kunna leda och se alla.

## Hur antalet ledare påverkar passet

### Två sätt att köra en del

En del i passet består av ett eller två **moment**. Ett moment körs på ett av två sätt:

- **Hela gruppen gör samma övning**, i en eller flera grupper sida vid sida. Det är det vanliga sättet.
- **Stationer**: spelarna delas i grupper som gör olika övningar samtidigt och byter station efter en bestämd tid. Alla grupper går igenom alla stationer.

### Självgående eller ledarstyrd

Varje övning anger hur många ledare **varje grupp** behöver (R-006). Jag föreslår att fältet `ledare` i övningen tolkas så här:

- **0, självgående:** spelarna kan köra övningen själva när den väl är igång, till exempel ett smålagsspel. En ledare kan ha uppsikt över flera sådana grupper som ligger bredvid varandra.
- **1, ledarstyrd:** en ledare måste vara med hela tiden, till exempel för att passa in bollar, skjuta på en målvakt eller hålla ordning på en övning där det annars blir farligt eller kö.
- **2:** används sällan, till exempel när två ledare servar bollar från var sin sida.

En station kräver alltid minst en egen ledare. Det följer av berättelse 02, kriterium 4: det får aldrig finnas fler stationer än ledare.

### Hur många spelare en ledare kan ha

Det här är det högsta antal spelare som en ledare rimligen kan ha hand om i en ledarstyrd grupp eller en station, och samtidigt se till att alla är aktiva och säkra (min bedömning):

| Fas | Högst antal spelare per ledare |
|---|---|
| `fas-6-7` | 8 |
| `fas-8-9` | 10 |
| `fas-10-12` | 12 |
| `fas-13-14` | 14 |
| `fas-15-19` | 16 |

Samma tal används för att varna ledaren när det är många spelare per ledare i hela passet (R-021). Passet genereras ändå, men ledaren får ett tips om att be en förälder eller äldre spelare om hjälp.

### Vad antalet ledare gör möjligt

| Antal ledare | Vad passet kan innehålla |
|---|---|
| 1 | Hela gruppen gör samma övning. Flera grupper samtidigt går bara om övningen är självgående, eller om det bara blir en grupp. Inga stationer (berättelse 02, kriterium 3). |
| 2 | Som ovan, men två ledarstyrda grupper samtidigt är möjligt. Upp till 2 stationer i Öva och Spelövning. |
| 3 | Upp till 3 stationer. |
| 4 eller fler | Upp till 4 stationer. Fler än 4 stationer används inte, eftersom det tar för lång tid att ställa i ordning och rotera. Extra ledare kan i stället vara med i en station eller ta hand om målvakterna. |

Regler för stationer (R-060 till R-066):

- **Bara i Öva och Spelövning.** Uppvärmningen görs tillsammans för att samla gruppen. Spelet görs lag mot lag.
- **Alla grupper går igenom alla stationer**, så att alla spelare får samma innehåll.
- **Lika lång tid på varje station**, minst 5 minuter och högst den längsta tiden för en övning i fasen. Bytet mellan stationer tar 1 minut.
- **Stationerna får plats i delens tid.** Två stationer kräver minst 11 minuter, tre stationer minst 17 minuter och fyra stationer minst 23 minuter. I korta pass blir det därför sällan stationer.
- **Varje station är en egen övning** som uppfyller alla krav, också kravet på fokusområde.

## Exempel

Underlag: 11 år (`fas-10-12`, `7mot7`), `niva-2`, 14 spelare, 2 ledare, 60 minuter, fokus `passning-mottagning`.

| Tid | Del | Innehåll | Grupper och ledare |
|---|---|---|---|
| 0–10 | Uppvärmning | En passningslek där alla rör sig i en ruta, med landningshopp inlagda (taggad `passning-mottagning` och `koordination`) | En grupp, typ `fri`, 1 ledare räcker |
| 10–21 | Öva | Två stationer à 5 minuter med 1 minuts byte: A är passningar med vändning (ledarstyrd), B är passningsbana i par | 2 grupper om 7, en ledare per station. I B blir en grupp tre |
| 21–23 | Vatten | Paus och flytt till nästa yta | |
| 23–35 | Spelövning | 3 mot 3 med joker, poäng för tre passningar i följd | 2 grupper om 7 sida vid sida, typ `tva-lag`, självgående |
| 35–37 | Vatten | Paus | |
| 37–55 | Spel | 7 mot 7 | En grupp om 14, typ `tva-lag` |
| 55–60 | Avslutning | Nedvarvning och samling | |

Delarnas tider jämfört med måltiden: Uppvärmning 10 (mål 10), Öva 11 (mål 10), Spelövning 12 (mål 12), Spel 18 (mål 19). Alla ligger inom 3 minuter. Summan blir 60 minuter. Pauserna ligger där den längsta tiden utan paus blir kortast, 21 minuter.
