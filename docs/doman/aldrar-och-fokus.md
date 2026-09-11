Status: godkänd (K1, 2026-09-11)

# Åldrar och fokus

**Ägare:** fotbollsexpert

Den här filen beskriver vad träningen bör betona i varje åldersfas och vad det betyder för hur ett pass läggs upp. Den är underlag för fokusområdena (`fokusomraden.md`), för passuppbyggnaden och för generatorreglerna.

## Källäge, läs detta först

Det här har jag kunnat kontrollera i källan (hämtat 2026-09-11):

- SvFF:s spelarutbildningsplan gäller spelare 6–19 år. Den bygger på SvFF:s riktlinjer *Fotbollens spela, lek och lär* (FSLL) och ska ge förutsättningar för långsiktig utveckling och ett livslångt fotbollsintresse. Källa: https://aktiva.svenskfotboll.se/tranare/spelarutbildning/spelarutbildningsplan/
- Spelarutbildningsplanen och spelformerna ska ta hänsyn till barns och ungdomars mognad, deras fysiska, psykiska och sociala förutsättningar och att de utvecklas i olika takt. De ska följa Riksidrottsförbundets idéprogram *Idrotten vill*, där idrott för barn ska vara lekfull och allsidig. Det övergripande syftet är att fler ska spela fotboll längre. Källa: https://aktiva.svenskfotboll.se/tranare/spelformer/bakrund-och-syfte/
- FSLL har fem riktlinjer: fotboll för alla, barns och ungdomars villkor, fokus på glädje, lärande och ansträngning, hållbart idrottande samt fair play. Källa: SvFF, *Planstorlekar för barn- och ungdomsfotboll* (2025), sista sidan. Se adressen i `spelformer.md`.
- Spelformernas regler, till exempel att 3 mot 3 saknar målvakt och att 5 mot 5 och 7 mot 7 har retreatlinje. Källa: spelformsbladen, se `spelformer.md`.

Det här har jag **inte** kunnat kontrollera: själva innehållet i spelarutbildningsplanen. Det finns som digitala böcker, en per spelform, på en extern tjänst (share.articulate.com) som inte går att läsa via hämtning.

Därför är beskrivningen av varje fas nedan **min bedömning som tränarutbildare**, byggd på principerna ovan och på etablerad kunskap om barns och ungdomars utveckling. Siffror om instruktionstid, koncentration och liknande är riktvärden från praktiken, inte hämtade från SvFF. De är markerade som bedömning där det har betydelse.

**Beslut 2026-09-11** (`docs/krav/kravspec.md`, *Beslut vid K1*, punkt 3): användaren godkände faserna som min bedömning för version 1. **Åldersfaserna ska kontrolleras mot SvFF:s spelarutbildningsplan (de digitala böckerna per spelform) före lansering, senast vid kontrollpunkt K5.** Uppgiften finns i `docs/krav/backlog.md` under *Innan lansering*. Om kontrollen visar skillnader ändras den här filen och K/R-tabellen i `fokusomraden.md`, och de regler i `generatorregler.md` som bygger på dem ses över.

Undantaget är avsnittet om nickning längst ned. Där är åldersgränsen hämtad från SvFF.

## Grundprinciper som gäller i alla åldrar

Det här är mina egna formuleringar av principerna ovan, omsatta till träning.

1. **Spelet lär ut spelet.** Den största delen av passet ska vara spel eller spelliknande övningar med motståndare, riktning och mål. Övningar utan motståndare används för att bygga upp det som sedan ska användas i spelet.
2. **Många bollkontakter, kort kö.** Varje spelare ska ha bollen ofta. Köer, långa genomgångar och övningar där bara ett fåtal är aktiva ska undvikas, särskilt för de yngsta.
3. **Alla får vara med.** Alla spelare deltar i alla delar av passet. Ingen sitter över för att den är sämre. Det gäller även match: SvFF kräver lika speltid i 3 mot 3 och 5 mot 5, minst två tredjedelar i 7 mot 7 och 9 mot 9 och minst halva matchtiden i 11 mot 11 (spelformsbladen).
4. **Olika utvecklingstakt.** Barn i samma ålder kan skilja flera år i kroppslig mognad. Den som är stor och snabb i dag är inte nödvändigtvis den som blir bäst. Spelare födda tidigt på året får lätt fördelar som inte har med talang att göra (den relativa ålderseffekten). Ledaren ska inte dra slutsatser om enskilda spelare utifrån hur de ser ut i dag.
5. **Glädje, lärande och ansträngning.** Ett bra pass är roligt, gör att spelarna lär sig något och får dem att anstränga sig. Alla tre behövs.
6. **Allsidighet.** Särskilt för barn är andra idrotter och fri lek en tillgång, inte en konkurrent. Fotbollsträningen ska innehålla varierad rörelse.
7. **Säkerhet.** Mål ska vara förankrade, ytorna ska ha fritt runt sig och belastningen ska passa kroppens utveckling (se varje fas).

## Åldersfaserna

Faserna följer spelformerna, eftersom appen föreslår spelform utifrån åldern. Nyckeln används av regelmotorn.

| Nyckel | Ålder | Spelform | Kort om fasen |
|---|---|---|---|
| `fas-6-7` | 6–7 | `3mot3` | Lek med bollen och glädjen i att göra mål |
| `fas-8-9` | 8–9 | `5mot5` | Bollen som kompis, att börja spela ihop |
| `fas-10-12` | 10–12 | `7mot7` | Goda inlärningsår, teknik i spel och första rollerna |
| `fas-13-14` | 13–14 | `9mot9` | Större plan, puberteten och att spela som lag |
| `fas-15-19` | 15–19 | `11mot11` | Hela spelet, eget ansvar och olika ambitioner |

Fasen bestäms av den ålder ledaren anger, inte av vilken spelform ledaren väljer (R-012, R-015). En grupp 11-åringar som spelar 9 mot 9 hör alltså fortfarande till `fas-10-12` när övningar väljs.

Åldern är den ålder spelarna fyller under året. I en grupp med flera åldrar anger ledaren den ålder som flest har, och den lägre om två åldrar är lika vanliga (R-010, beslutat av användaren 2026-09-11).

---

### Fas 6–7 år (`fas-6-7`)

**I fokus:** leken, bollen och att göra mål. Barnen ska tycka att fotboll är roligt och vilja komma tillbaka.

- **Lek och bollkänsla:** mycket tid med egen boll. Driva, stoppa, vända och skjuta, med båda fötterna och med olika delar av foten. Lekar med fantasinamn och tydliga, enkla regler.
- **Spelförståelse:** åt vilket håll ska vi, hur gör jag mål och hur får jag tillbaka bollen. 1 mot 1 är grunden. Att passa en kompis kommer av sig självt när det finns en fri kompis, men är inte huvudsaken.
- **Fysiskt:** grundrörelser som att springa, hoppa, landa, stanna, vända och hålla balansen, helst med boll. Barnen jobbar i korta ryck och vilar när de behöver. Ingen konditions- eller styrketräning i egen form, eftersom lek och spel ger rätt belastning. Barn blir fortare varma och uttorkade än vuxna, så vattenpauser behövs ofta.
- **Mentalt:** barnen tänker mest på sig själva och sin boll. Det är normalt, inte egoism. De lär sig genom att göra och härma. Beröm för försök fungerar bättre än rättning av fel.
- **Socialt:** många leker bredvid varandra snarare än med varandra. De lär sig att turas om, vänta, vinna och förlora. Ledaren är en trygg vuxen som ser alla.
- **Målvakt:** 3 mot 3 har ingen målvakt. Alla spelar överallt. Den som vill kan prova att rädda i lekar med mjuk boll.

**Vad det betyder för träningen (min bedömning):**

| Område | Riktvärde |
|---|---|
| Bollar | En boll per barn i alla övningar där det går |
| Kö | Högst 2–3 barn per boll, mål eller station. Ingen ska stå still längre än en halv minut |
| Instruktion | Högst cirka 30 sekunder. En sak i taget. Visa i stället för att förklara |
| Koncentration | En övning i samma form håller ungefär 5–8 minuter. Byt eller ändra något därefter |
| Spel | 1 mot 1 till 3 mot 3. Flera små planer hellre än en stor |
| Coachning | Uppmuntran och korta tips i spelet. Stoppa inte spelet för att förklara |

---

### Fas 8–9 år (`fas-8-9`)

**I fokus:** att bli kompis med bollen och börja spela tillsammans. Målvakten kommer in i spelet.

- **Lek och bollkänsla:** fortfarande mycket egen boll. Nu med högre fart, finter, vändningar och mottagning med olika delar av kroppen. Jonglering och bollkonster som barnen kan öva hemma.
- **Spelförståelse:** att passa till någon som är fri, att göra sig fri (spelbar) och att sprida ut sig på planen. Att försvara sitt mål och vinna tillbaka bollen tillsammans. Tack vare retreatlinjen i 5 mot 5 kan laget börja spela ut bollen från målvakten.
- **Fysiskt:** bra ålder för att lära in rörelser och koordination. Snabbhet och reaktion tränas bäst i korta lekar och tävlingar med boll. Fortfarande ingen konditionsträning i egen form. SvFF rekommenderar skadeförebyggande program från 7 år (FIFA 11+ Kids, källan finns i `passuppbyggnad.md`). I appen kommer det in från den här fasen, som lekfulla moment i uppvärmningen. För 6–7 år ger lek och koordination samma grund.
- **Mentalt:** barnen vill lära sig och bli bra, och de börjar jämföra sig med andra. De förstår enkla regler och tävlingar. Koncentrationen räcker lite längre än i fasen före, men fortfarande inte till långa genomgångar.
- **Socialt:** kompisar blir viktigare och en känsla för laget börjar växa fram. Fair play kan tränas på riktigt, till exempel att döma själv i smålagsspel.
- **Målvakt:** målvakten införs i 5 mot 5. *Min bedömning:* alla bör få prova att stå i mål, både på träning och i match. Grundteknik: grundställning, fånga, rulla och kasta ut, spela med fötterna.

**Vad det betyder för träningen (min bedömning):**

| Område | Riktvärde |
|---|---|
| Bollar | En boll per barn i teknik- och bollkänsleövningar |
| Kö | Högst 2–3 per boll, mål eller station |
| Instruktion | 30–60 sekunder, en till två punkter. Visa först |
| Koncentration | Ungefär 8–10 minuter i samma form |
| Spel | 1 mot 1 till 5 mot 5, gärna med målvakt i de större spelen |
| Coachning | Korta frågor och tips. Frys spelet sällan och kort |

---

### Fas 10–12 år (`fas-10-12`)

**I fokus:** tekniken ska fungera i spelet, i fart och med motståndare. Spelarna börjar förstå roller och positioner på planen.

- **Lek och bollkänsla:** tekniken förfinas: första touchen, passningar med rätt kraft och riktning, avslut med båda fötterna, dribbling i fart. Lek finns kvar, framför allt i uppvärmning och avslutning.
- **Spelförståelse:** spelbarhet, bredd och djup, spelvändning. Speluppbyggnad från målvakten, eftersom retreatlinjen i 7 mot 7 ger tid och målvakten inte får sparka ut bollen ur händerna. Försvar tillsammans: täcka, pressa och hjälpa varandra. Att snabbt byta från försvar till anfall och tvärtom (omställning). Fasta situationer blir en del av spelet.
- **Fysiskt:** *Min bedömning:* fortsatt goda år för att lära in teknik och koordination. Puberteten börjar för en del, oftast tidigare för flickor, och skillnaderna inom gruppen växer. Landningsteknik och kroppskontroll bör finnas med i uppvärmningen, som grund för skadeförebyggande träning senare. Uthållighet och styrka byggs fortfarande genom spel.
- **Mentalt:** spelarna kan förstå *varför*, inte bara *hur*. De tål utmaningar och tycker om att tävla. Självkänslan påverkas lätt av jämförelser, så ledaren bör berömma ansträngning och framsteg.
- **Socialt:** grupperna förändras och kompisgäng kan bli slutna. Ledaren bör blanda lagen i övningarna och ge spelarna ansvar, till exempel att sätta ut koner eller hålla i en lek.
- **Målvakt:** *Min bedömning:* fortsätt låta flera prova, men den som vill stå mer får göra det. Träna utkast och passningsspel med foten, fånga och falla på mjukt underlag.

**Vad det betyder för träningen (min bedömning):**

| Område | Riktvärde |
|---|---|
| Bollar | En boll per spelare i teknikdelar. I spel räcker färre |
| Kö | Högst 3–4 per boll, mål eller station |
| Instruktion | Ungefär 1 minut, två punkter. Frågor fungerar bra ("var kan du stå för att bli spelbar?") |
| Koncentration | Ungefär 10–15 minuter i samma form, med små ändringar under tiden |
| Spel | 2 mot 2 till 7 mot 7 |
| Coachning | Frys spelet kort för att visa en situation. Låt spelarna själva komma med lösningar |

---

### Fas 13–14 år (`fas-13-14`)

**I fokus:** att spela som ett lag på en större plan, med offside, samtidigt som kroppen förändras.

- **Lek och bollkänsla:** tekniken ska hålla under högre tempo, med längre passningar och när spelaren är trött. Bollmottagning i luften kommer in på allvar. Nickspel förs in, med få och lätta nickar och en begränsad mängd per pass (se *Nickning* nedan). Lek kan fortfarande användas i uppvärmning.
- **Spelförståelse:** lagdelar (försvar, mittfält, anfall) och avståndet mellan dem. Offside, både att utnyttja den och att försvara med den. Spelvändningar och längre passningar. Försvarsspel som lag. Fasta situationer med inspark.
- **Fysiskt:** många är mitt i tillväxtspurten. Koordinationen kan tillfälligt bli sämre, och växtvärk i knän och hälar är vanligt. Belastningen behöver varieras. *Min bedömning:* skadeförebyggande uppvärmning (knä, fotled, bål) bör göras regelbundet från den här fasen. Skillnaderna i mognad kan vara flera år, och de som mognar sent får inte väljas bort på grund av det.
- **Mentalt:** självbilden är skör och humöret kan svänga. Spelarna kan tänka mer abstrakt och ta till sig taktik. De vill vara delaktiga och påverka.
- **Socialt:** kompisarna är ofta den viktigaste anledningen att fortsätta. Det är i de här åren många slutar. Gemenskap, inflytande och att känna sig behövd väger tungt.
- **Målvakt:** mer målvaktsspecifik träning: position, inspark, spel med fötterna, att styra försvaret. *Min bedömning:* målvakten behöver egna moment i passet, och det kan kräva en extra ledare.

**Vad det betyder för träningen (min bedömning):**

| Område | Riktvärde |
|---|---|
| Bollar | En boll per två spelare i passnings- och teknikdelar |
| Kö | Högst 3–4 per boll, mål eller station |
| Instruktion | 1–2 minuter, två till tre punkter |
| Koncentration | Ungefär 12–20 minuter i samma form |
| Spel | 3 mot 3 till 9 mot 9 |
| Coachning | Frys spelet och låt spelarna reflektera. Ge dem inflytande över regler och varianter |

---

### Fas 15–19 år (`fas-15-19`)

**I fokus:** hela spelet i 11 mot 11, positioner och roller, och att spelarna själva tar ansvar för sin utveckling.

- **Lek och bollkänsla:** teknik under press och i hög fart, anpassad efter spelarens position. Lekfulla inslag fungerar fortfarande bra i uppvärmning och avslutning.
- **Spelförståelse:** spelsystem och lagets spelidé, hur man anpassar sig efter motståndaren, roller per position, fasta situationer i detalj och snabba omställningar.
- **Fysiskt:** kroppen tål mer och styrka, snabbhet och uthållighet kan tränas mer målinriktat, gärna i fotbollsform. Återhämtning och belastning behöver planeras, särskilt för spelare som tränar mycket och samtidigt har skola. Skadeförebyggande träning är fortsatt viktig, särskilt mot knäskador.
- **Mentalt:** spelarna kan sätta egna mål, analysera sitt spel och ta mer komplex information. Motivationen blir mer individuell.
- **Socialt:** lagkulturen och ledarskap bland spelarna blir viktigt. Ambitionerna skiljer sig ofta mycket inom samma grupp, där vissa satsar och andra spelar för gemenskapen. Båda ska rymmas.
- **Målvakt:** specialiserad målvaktsträning, som ofta kräver egen ledare eller egen station.

**Vad det betyder för träningen (min bedömning):**

| Område | Riktvärde |
|---|---|
| Bollar | Efter övningens behov |
| Kö | Högst 3–4 per boll, mål eller station |
| Instruktion | 2–3 minuter, tre till fyra punkter. Kan förberedas före passet |
| Koncentration | Ungefär 15–25 minuter i samma form |
| Spel | Från små spel upp till 11 mot 11 |
| Coachning | Frys spelet, fråga, låt spelarna ta ansvar för delar av passet |

*Min bedömning:* 15–16-åringar och 17–19-åringar skiljer sig i hur mycket belastning de tål och hur mycket de tränar. Passuppbyggnaden och generatorreglerna skiljer inte på dem i version 1. Om det behövs senare behåller `fas-15-19` sin betydelse, och nya nycklar läggs till.

---

## Sammanfattning för regelmotorn

Tabellen samlar riktvärdena ovan. Allt i tabellen är min bedömning. Riktvärdena styr hur övningar skrivs och granskas. Generatorn använder bara ett av dem direkt: den övre gränsen för hur länge en övning i samma form håller blir den längsta tiden för en övning i Uppvärmning, Öva och Spelövning (R-034). Den kortaste tiden för en övning är 5 minuter i alla faser (R-034), och Spel får vara längre (`passuppbyggnad.md`). Kö och storlek på spelen styrs genom övningarnas ålder och antal spelare, inte genom egna regler.

| Fas | Instruktion per gång | Hur länge en övning i samma form håller | Högst i kö per boll, mål eller station | Största spel i träning |
|---|---|---|---|---|
| `fas-6-7` | cirka 30 s | 5–8 min | 2–3 | 3 mot 3 |
| `fas-8-9` | 30–60 s | 8–10 min | 2–3 | 5 mot 5 |
| `fas-10-12` | cirka 1 min | 10–15 min | 3–4 | 7 mot 7 |
| `fas-13-14` | 1–2 min | 12–20 min | 3–4 | 9 mot 9 |
| `fas-15-19` | 2–3 min | 15–25 min | 3–4 | 11 mot 11 |

## Nickning

**Källa:** SvFF, *Får barn nicka?*, https://aktiva.svenskfotboll.se/nyheter/2023/05/nickning-for-barn/ (publicerad 2023-05-23, hämtad 2026-09-11).

Det här säger SvFF, med mina ord:

- Nickning förs in i spelarutbildningsplanen först i spelformen 9 mot 9, alltså från 13 år.
- Spelreglerna förbjuder inte nickning före 13 år. Men 3 mot 3, 5 mot 5 och 7 mot 7 är utformade så att bollen mest är på marken, till exempel med retreatlinjen som gör att målvakten spelar ut bollen i stället för att sparka långt.
- Skälet är att barn har svagare nackmuskler och har svårare att hålla huvudet stilla när de nickar.
- SvFF anger ingen mängd, alltså inte hur många minuter eller nickar som är lagom för 13–19 år.

**Beslut 2026-09-11** (`docs/krav/kravspec.md`, *Beslut vid K1*, punkt 2): appen följer SvFF. Ingen nickträning före 13 år. Taken för 13–19 år är mitt förslag, som användaren har beslutat.

| Ålder | Nickträning | Regel |
|---|---|---|
| 6–12 år | Ingen. `nickspel` kan inte väljas, och övningar med `nickspel` väljs inte och kan inte bytas in | R-080, R-081 |
| 13–14 år | Högst 10 minuter per pass | R-082 |
| 15–19 år | Högst 20 minuter per pass | R-082 |

`nickspel` väljs alltid tillsammans med ett annat fokusområde (R-083). Då kan kärnan i passet handla om det andra fokuset när nicktaket är nått.

En övning där spelarna nickar som en planerad del ska vara märkt med `nickspel`, även när nickning inte är huvudfokus (R-081). Annars fungerar varken åldersgränsen eller taket. Reglerna gäller också när ledaren byter in en av klubbens egna övningar (R-106).

Råd till ledaren och till övningsförfattaren (min bedömning):

- Börja med få och lätta nickar det första året, till exempel bollen kastad från nära håll, och öka gradvis.
- Använd rätt bollstorlek för åldern: storlek 4 för 13-åringar och storlek 5 från 14 år (`spelformer.md`).
- För 10–12 år ska övningar med `fasta-situationer` utformas så att bollen spelas längs marken eller tas emot, inte nickas. Det kontrollerar jag när jag granskar övningar.
- Reglerna gäller planerad nickträning. Att bollen någon gång träffar huvudet i ett spel går inte att förhindra helt.
