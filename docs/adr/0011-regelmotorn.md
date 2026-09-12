# 0011: Regelmotorn

Status: föreslagen

## Kontext

`docs/doman/generatorregler.md` (godkänd K1) innehåller 89 regler som tillsammans är hela specifikationen för hur ett träningspass sätts ihop. `docs/doman/passuppbyggnad.md` (godkänd K1) beskriver samma sak för ledaren och innehåller de uträknade tidstabellerna. Den här ADR:n bestämmer hur reglerna byggs som kod: modulindelning, deterministisk slump, hur motorns utdata blir rader i databasen, vilken algoritm som uppfyller R-048 och R-049, vilka algoritmval R-072 lämnar öppna, och hur varje regel-ID blir spårbart i kod och test.

Följande ramar styr besluten:

| Ram | Källa |
|---|---|
| Ingen AI. Passen sätts ihop av en regelmotor | `CLAUDE.md` |
| `src/regelmotor/` får inte importera React, webbläsar-API:er eller Supabase, upprätthållet med `no-restricted-imports` | ADR 0001 |
| TypeScript i `strict`, Vitest för enhetstester, inga nya beroenden utan motivering | ADR 0001 |
| Varje regel-ID ska ha minst ett test och vara spårbart i koden | `.claude/agents/senior-systemutvecklare.md` |
| En regel som inte står i `generatorregler.md` får inte finnas i koden | `docs/doman/README.md` |
| Ett sparat pass är ett självbärande dokument med en ögonblicksbild per övning. `session_items.part`-värdena, pauserna och de fasta inslagen lämnades uttryckligen till del B | ADR 0003, punkt 4 och avsnittet *Sparade pass* |
| Övningens fält, typer och genererade kolumner | ADR 0010 |
| Passet ska gå att visa i planläget och skrivas ut utan fler hämtningar, även på dåligt nät | ADR 0003, ADR 0005 |
| Generatorn väljer bara ur den gemensamma banken med status `godkand`. Klubbens egna övningar kommer in bara genom ledarens eget byte | R-022, R-106 |

Två saker gör motorn svårare än ett vanligt filter. Den första är att R-048 och R-049 tillsammans definierar ett sökproblem: passet ska vara giltigt och inte kunna förbättras med en enda enkel ändring, men det behöver inte vara det bästa av alla möjliga pass. Den andra är att R-072 tillåter variation mellan körningar, men bara mellan pass som är lika bra. Avsnitt 5 och 6 handlar om just det, och avsnitt 4 pekar ut var R-072 säger mer än R-049 kan hålla.

**Namn.** Kod och identifierare skrivs på engelska (`CLAUDE.md`). Domännycklarna (`del-uppvarmning`, `niva-2`, `fas-10-12` och så vidare) är data och behåller sin svenska stavning, eftersom de är frysta i domänfilerna och i övningsfilerna. Sökvägarna `src/regelmotor/` (ADR 0001) och `src/regelmotor/schema/ovning.ts` (ADR 0010) behålls som de är beslutade.

## Beslut

### 1 Modulstruktur

Motorn är ett rent TypeScript-bibliotek utan sidoeffekter. Den läser inte databasen, känner inte till React och hämtar ingenting. Anroparen skickar in underlaget och de övningar motorn får välja bland, och får tillbaka ett vanligt serialiserbart objekt. Det är den enda anledningen till att varje regel kan testas för sig, och det är också vad ADR 0005 förutsätter, eftersom generatorn körs i klienten mot en bank som ligger i IndexedDB.

```
src/regelmotor/
  index.ts            publikt API, det enda som appen importerar
  types.ts            Input, Exercise, Session, Part, Block, Group, Row
  keys.ts             frysta nycklar och alla tabellvärden per fas
  schema/ovning.ts    Zod-schemat (ADR 0010)
  random/rng.ts       deterministisk PRNG och seedad sortering
  input/validate.ts   underlaget kontrolleras och normaliseras
  time/plan.ts        avslutning, pauser, aktiv tid, måltider
  time/breaks.ts      pausernas placering
  filter/base.ts      grundfiltret
  filter/safety.ts    säkerhet
  filter/area.ts      ytkontroll
  blocks/groups.ts    gruppindelning och udda antal
  blocks/stations.ts  stationer, rotation och ledarbehov
  blocks/candidates.ts bygger giltiga moment av kandidatövningar
  select/fill.ts      fyller en del
  select/assemble.ts  sätter ihop passet
  score/score.ts      poänglistan
  score/improve.ts    lokal förbättring till fixpunkt
  check/session.ts    kontroll av samtliga krav
  output/build.ts     tidslinjen som rader
  output/notices.ts   påminnelser och tips
  output/explain.ts   förklaring när en del saknar övning
  swap/options.ts     vilka övningar som kan ersätta en övning
  swap/apply.ts       byte och ny tid
  season/weeks.ts     ISO-veckor, veckans ålder och veckans fokus
```

**`keys.ts` är den enda platsen där domänens siffror finns.** Faser och åldersgränser, taket per ledare, pausintervall, tidsandelar, längsta tid per del, spelformernas ordning, ytornas mått och K/R-tabellen med 17 fokusområden × 5 faser skrivs där en gång, var och en med en kommentar som pekar ut källfilen och regel-ID:t. Ingen annan modul får ha en siffra ur domänen inbakad i logiken.

**Beroenden går åt ett håll.** `keys` och `types` längst ned, sedan `random`, `input`, `time`, `filter`, `blocks`, `select`, `score`, `check` och `output` överst. Ingen modul importerar uppåt, och `check/session.ts` importerar bara `keys` och `types`, så att kontrollen av kraven inte kan ärva ett fel från den kod den kontrollerar. Det är avsiktligt: kontrollen är en oberoende andra implementation av kraven och används som orakel i testerna (avsnitt 7).

#### Kedjan genom motorn

| Steg | Modul | Vad som händer | Regler |
|---|---|---|---|
| 1 Indata | `input/validate` | Underlaget kontrolleras och normaliseras. Fas, tak per ledare och pausintervall härleds ur åldern. Ogiltigt underlag ger en lista med fel och inget pass | R-010–R-021 |
| 2 Tidsfördelning | `time/plan` | Avslutning, antal pauser, aktiv tid och måltid per del räknas fram. Delar under 5 minuter tas bort | R-030–R-033 |
| 3 Filtrering | `filter/*` | Banken filtreras till en kandidatlista per del: grundfilter, rätt del, säkerhet och, om yta är vald, yta | R-022–R-029, R-080–R-085, R-090–R-094 |
| 4 Val per passdel | `blocks/*`, `select/*` | Kandidaterna byggs till giltiga moment med grupper, ledare, stationer och ett tillåtet tidsintervall. Delarna fylls i prioritetsordning | R-034–R-038, R-041, R-050–R-067, R-070 |
| 5 Kontroll av krav | `check/session` | Varje krav prövas mot det färdiga passet. Ett pass som inte klarar kontrollen lämnas aldrig ut | alla krav |
| 6 Utdata | `output/*` | Tidslinjen byggs som rader, pauserna placeras, påminnelser och förklaringar läggs till | R-037, R-039, R-084, R-085, R-100, R-103 |

Steg 2 ligger före steg 3 och 4 därför att tidsplanen bara beror på passlängden och fasen. Den är alltså känd innan en enda övning har valts, vilket är det som gör att måltiderna kan användas som ram när delarna fylls i stället för att kontrolleras i efterhand.

Steg 5 körs alltid, även i produktion. Kontrollen är billig jämfört med sökningen, och den är den sista spärren mot att ett pass som bryter mot ett krav når en ledare. Om den fäller ett pass är det en bugg: motorn loggar underlaget och fröet och lämnar samma svar som R-101, hellre än ett felaktigt pass.

#### Publikt API

```ts
validateInput(raw: unknown): InputResult
generateSession(input: Input, bank: Exercise[], seed: string): GenerationResult
swapOptions(session: Session, ref: ItemRef, bank: Exercise[], club: Exercise[]): Exercise[]
applySwap(session: Session, ref: ItemRef, chosen: Exercise): Session
weekAge(plan: SeasonPlan, weekStart: IsoDate): number
weekFocus(sessions: SessionSummary[]): FocusKey[]
```

`GenerationResult` är antingen `{ kind: 'session', session, notices }` eller `{ kind: 'none', reasons }` (R-101). Att `generateSession` bara tar `bank` medan `swapOptions` tar både `bank` och `club` gör R-022 till en egenskap hos typerna: klubbens egna övningar kan inte nå generatorn, eftersom det inte finns någon parameter att skicka in dem i. R-106 finns bara i bytesvägen, vilket är precis vad regeln säger.

### 2 Determinism och variation

`generateSession(input, bank, seed)` är en ren funktion. Samma tre argument ger alltid exakt samma pass, fält för fält, på vilken maskin och i vilken webbläsare som helst. Variationen ledaren ser när hon trycker *Generera igen* kommer bara av att appen skickar in ett nytt frö.

**Fröet** är en sträng. Motorn hashar den med cyrb128 och kör en `xoshiro128**`-generator, tillsammans ett femtontal rader heltalsaritmetik med `Math.imul` och `>>> 0`. Ingen ny dependency: en PRNG som ska ge samma tal överallt måste ändå vara låst i vår egen kod, eftersom ett paket kan byta algoritm i en patchversion och då tyst ändra alla pass.

**Fyra källor till slump utanför fröet är förbjudna i `src/regelmotor/`:**

| Förbjudet | Varför | Spärr |
|---|---|---|
| `Math.random` | Uppenbar | ESLint `no-restricted-properties` |
| `Date.now`, `new Date()` utan argument | Gör passet beroende av när det genereras | ESLint `no-restricted-properties`, `no-restricted-globals` |
| `crypto`, `performance` | Webbläsar-API:er, redan förbjudna | `no-restricted-imports` (ADR 0001) |
| Iterationsordning som kommer utifrån | Se nedan | Kodgranskning och ett test |

Den sista är den som faktiskt biter i praktiken. Banken kommer från Postgres eller från IndexedDB, och ingen av dem lovar någon radordning. Om motorn itererar över `bank` i den ordning den råkar komma, blir passet beroende av databasens humör och inte av fröet. Regeln är därför: **varje kandidatlista sorteras med en total ordning innan något val görs**, och sista utslagsgivare är alltid övningens `id`. ADR 0010 garanterar att `id` är en unik ASCII-slug, så en vanlig `<`-jämförelse räcker och är oberoende av språkinställning — `localeCompare` får inte användas, eftersom den sorterar olika i olika miljöer. Ett test blandar banken med fröet, kör om genereringen och kräver samma pass.

**Heltalsaritmetik.** Måltiderna i R-032 räknas som `Math.floor((active * pct) / 100)` med `pct` som heltal, aldrig via ett flyttal som `0.25`. Andelarna är exakta i tabellen, och avrundningen ska ske en gång, på det ställe regeln pekar ut.

**Datum.** `season/weeks.ts` använder `Date` enbart genom `Date.UTC` och `getUTC*`. Ett `date` i databasen är ett kalenderdatum utan tid, och en `new Date('2027-01-07')` som tolkas i lokal tidszon kan hamna på fel dygn och därmed fel ISO-vecka. Veckoräkningen i R-113 blir annars beroende av var telefonen står.

#### Fröets väg genom appen

| När | Vad som händer |
|---|---|
| Ledaren trycker *Skapa pass* | Appen skapar ett nytt frö och anropar motorn |
| Ledaren trycker *Generera igen* | Nytt frö, samma underlag. Ger ett annat pass bland de lika bra (R-072) |
| Ledaren sparar passet | Fröet och en fingeravtryckshash av banken sparas i `training_sessions.input` (ADR 0003) |
| Passet öppnas igen, skrivs ut eller körs i planläget | Passet läses ur sina ögonblicksbilder. **Det genereras aldrig om** (R-102, R-113 sista punkten) |

Fröet sparas alltså inte för att kunna återskapa passet — ögonblicksbilderna är originalet, och de gäller även när en bankövning senare ändras. Fröet och bankens fingeravtryck sparas för spårbarhet: med dem kan ett felrapporterat pass återskapas exakt i ett test, vilket annars är mycket svårt för en generator med den här sökrymden.

Samma frö med en **annan bank** kan ge ett annat pass. Det säger inte emot R-102, som handlar om att generatorn inte får ändra ledarens underlag, och det är ofrånkomligt: en ny omgång övningar ska kunna väljas. Fingeravtrycket gör skillnaden synlig i stället för förvånande.

**Vad determinismen inte lovar.** Två pass från olika frön är olika pass. R-072 kräver att de ändå är lika bra enligt R-048, och det kravet går längre än vad R-049 kan garantera. Se R-072 i regeltabellen och *Beslut som behövs* i rapporten.

### 3 Passdelar, pauser och ögonblicksbilder

ADR 0003 lämnade tre saker till del B: vilka värden `session_items.part` får, hur pauser och andra fasta inslag (R-031) lagras, och hur ett moment utan övning ser ut. Det bestäms här.

**Motorns utdata är en tidslinje av rader.** `Session.rows` är en ordnad lista där varje rad är en sak som händer på planen, i den ordning ledaren möter dem. `src/data/` skriver listan rakt av till `session_items` med `position` = index. Motorn skriver aldrig till databasen själv.

| `kind` | Vad raden är | Övning | `minutes` |
|---|---|---|---|
| `exercise` | Ett helgruppsmoment | ja | momentets tid |
| `period` | En period av samma moment, avdelad av en paus (R-037) | ja | periodens tid |
| `stations` | Blockraden för ett stationsmoment, bär hela momentets tid | nej | S × t + (S − 1) |
| `station` | En station inom närmast föregående blockrad | ja | – |
| `break` | Vattenpaus (R-031) | nej | 2 |
| `closing` | Avslutning (R-031) | nej | 3 eller 5 |
| `empty` | En del som saknar övning (R-100) | nej | delens måltid |

**Invariant:** summan av `minutes` över alla rader utom `station` är passets faktiska totaltid, den som R-036 begränsar och som passet visar. Det är en enda kontroll, den finns i `check/session.ts`, och den fångar hela klassen av tidsfel.

Två av radslagen behöver en motivering.

**Varför stationer är en blockrad plus stationsrader.** I ett stationsmoment kör alla S stationer samtidigt under hela momentet, medan grupperna roterar mellan dem (R-066). Ingen enskild station äger momentets tid, och de S − 1 bytesminuterna i R-065 hör till momentet, inte till någon station. Om varje station vore en egen tidslinjerad skulle summan bli fel. Blockraden äger tiden, stationsraderna äger innehållet och stationstiden t.

**Varför en paus kan dela ett moment i perioder.** R-037 tillåter en paus mitt i `del-spel`, mellan två perioder av samma spel, men aldrig inuti en övning i de andra delarna. Ett spelmoment på 18 minuter med en paus i mitten blir därför två `period`-rader med samma block, samma övning och samma ögonblicksbild, vars minuter summerar till momentets tid enligt R-034. Tidslinjen förblir en platt lista, och varken planläget eller utskriften behöver ett specialfall.

#### Nya kolumner i `session_items`

Utöver de kolumner ADR 0003 räknar upp:

| Kolumn | Typ | Betyder |
|---|---|---|
| `kind` | `text`, `check` mot listan ovan | radens slag |
| `part` | `text`, `check` mot de fem delnycklarna | null bara för `break`, som ligger mellan delar |
| `block` | `int` | momentets nummer i passet. Rader i samma moment delar värde |
| `station` | `int` null | stationens nummer inom momentet |
| `station_minutes` | `int` null | stationstiden t (R-065) |
| `layout` | `jsonb` null | gruppindelningen för momentet |

`layout` bär det R-051 till R-055 räknar fram och som passet måste visa: `{ groups, sizes, coachesPerGroup, oddSolution, oddText }`. `oddSolution` är `trio`, `joker` eller `null` enligt R-054, och `oddText` är övningens egen lösning ur `anpassning.udda_antal` när den finns, eftersom R-054 säger att den ska visas i stället för jokern.

Det här är en utökning av ADR 0003, inte en ändring av den: kolumnerna fyller just de luckor ADR 0003 pekade ut. Migrationen beskrivs under *Konsekvenser*.

#### Exempel

Exemplet i `passuppbyggnad.md`, sist i filen: 11 år, `7mot7`, `niva-2`, 14 spelare, 2 ledare, 60 minuter, fokus `passning-mottagning`.

| # | `kind` | `part` | `block` | `minutes` | Innehåll |
|---|---|---|---|---|---|
| 1 | `exercise` | `del-uppvarmning` | 1 | 10 | Passningslek, en grupp om 14 |
| 2 | `stations` | `del-ovning` | 2 | 11 | 2 stationer à 5 min, 1 min byte |
| 3 | `station` | `del-ovning` | 2 | – | Station A, `station_minutes` 5 |
| 4 | `station` | `del-ovning` | 2 | – | Station B, `station_minutes` 5 |
| 5 | `break` | – | – | 2 | |
| 6 | `exercise` | `del-spelovning` | 3 | 12 | 3 mot 3 med joker, 2 grupper om 7 |
| 7 | `break` | – | – | 2 | |
| 8 | `exercise` | `del-spel` | 4 | 18 | 7 mot 7 |
| 9 | `closing` | `del-avslutning` | – | 5 | |

Summan av alla rader utom stationsraderna är 60, och den längsta sträckan utan paus är 21 minuter. Båda stämmer med den godkända uträkningen i `passuppbyggnad.md`, vilket är skälet att just det exemplet blir ett test (avsnitt 7).

#### Ögonblicksbilder och det som räknas fram

`exercise_snapshot` är hela övningens `content` enligt ADR 0010, plus `id` och `schema`. Motorn kopierar den oförändrad; den plockar aldrig ut ett urval av fält. Skälet är att passet ska kunna visas och skrivas ut utan att banken finns (ADR 0003 punkt 4, ADR 0005), och tre regler läser fält som ett urval lätt hade tappat: `material` för R-084, `varianter` för R-029 och `anpassning` för R-054.

Påminnelserna och tipset lagras däremot **inte**. `output/notices.ts` räknar fram dem ur passet varje gång det visas:

| Notis | Räknas ur | Regel |
|---|---|---|
| Mål ska vara förankrade | `material` med typ `mal` i någon ögonblicksbild | R-084 |
| Benskydd | Alltid | R-085 |
| Ta hjälp av fler vuxna | N > L × taket per ledare | R-021 |

Det fungerar utan nät just därför att ögonblicksbilderna bär `material`, och det gör att en rättad regel slår igenom på gamla pass utan migrering. En del som togs bort enligt R-033 har inga rader alls, medan en del som saknar övning har en `empty`-rad. Skillnaden behöver inte lagras: R-033 beror bara på passlängd och fas och räknas fram ur `input` när passet öppnas.

### 4 Regeltabellen

Alla 89 regler, med den modul som äger regeln och därmed är den plats ett test ska peka på. Svaren är `ja`, `delvis` eller `nej`, och allt som inte är `ja` har en kommentar. `Bygg` betyder att regeln går att uttrycka i kod som den står, `Test` att det går att visa automatiskt att den följs.

#### Grupp 1: Övningens data (R-001–R-009)

Hela gruppen kontrolleras av Zod-schemat i ADR 0010, som körs av valideringsskriptet, av importen och av appens formulär. Motorn litar därför på att en bankövning redan är giltig; för klubbens egna övningar prövas samma schema om i `swap/options` (R-106).

| Regel | Modul | Bygg | Test | Kommentar |
|---|---|---|---|---|
| R-001 Nivå är en lista | `schema/ovning` | ja | ja | |
| R-002 Fokusområden | `schema/ovning`, `keys` | ja | ja | K/R-tabellen, 17 × 5, ligger i `keys.ts` |
| R-003 Ålder | `schema/ovning` | ja | ja | |
| R-004 Spelformer | `schema/ovning`, `keys` | ja | ja | |
| R-005 Passdelar | `schema/ovning` | ja | ja | |
| R-006 Ledarbehov per grupp | `schema/ovning` | ja | ja | |
| R-007 Antal spelare | `schema/ovning` | ja | ja | |
| R-008 Grupptyp | `schema/ovning` | ja | ja | |
| R-009 Tid | `schema/ovning` | ja | ja | |

#### Grupp 2: Underlaget (R-010–R-021)

| Regel | Modul | Bygg | Test | Kommentar |
|---|---|---|---|---|
| R-010 Hur åldern tolkas | `input/validate`, `season/weeks` | delvis | delvis | Regeln riktar sig till ledaren: vilken ålder som ska anges i en blandad grupp kan koden varken kontrollera eller motbevisa. Det som går att bygga är hjälptexten vid åldersfältet och användningen i R-113. Regeln behöver inte ändras |
| R-011 Giltig ålder | `input/validate` | ja | ja | |
| R-012 Fas från ålder | `keys` | ja | ja | |
| R-013 Föreslagen spelform | `keys` | ja | ja | |
| R-014 Tillåtna spelformer | `input/validate`, `keys` | ja | ja | |
| R-015 Fasen styrs av åldern | `input/validate` | ja | ja | Testas med en avvikande spelform: alla fasberoende värden ska följa åldern |
| R-016 Nivå | `input/validate` | ja | ja | |
| R-017 Antal spelare och ledare | `input/validate` | ja | ja | |
| R-018 Passlängd | `input/validate`, `keys` | ja | ja | |
| R-019 Val av fokusområden | `input/validate`, `keys` | ja | ja | |
| R-020 Komplett underlag | `input/validate` | ja | ja | |
| R-021 Många spelare per ledare | `output/notices` | ja | ja | Testfallen i regeln används som de står |

#### Grupp 3: Vilka övningar som får väljas, och nivå (R-022–R-029)

| Regel | Modul | Bygg | Test | Kommentar |
|---|---|---|---|---|
| R-022 Bara godkända ur banken | `index`, `filter/base` | ja | ja | Följer av typerna: `generateSession` har ingen parameter för klubbens övningar (avsnitt 1) |
| R-023 Ålder | `filter/base` | ja | ja | |
| R-024 Spelform | `filter/base` | ja | ja | |
| R-025 Nivå | `filter/base` | ja | ja | |
| R-026 Inga angränsande nivåer | `filter/base` | ja | ja | Negativt test: en övning utanför nivån väljs inte ens när delen annars blir tom |
| R-027 Alla fokusområden passar fasen | `filter/base`, `keys` | ja | ja | |
| R-028 Rätt del | `filter/base` | ja | ja | |
| R-029 Varianterna visas alltid | `output/build` | ja | ja | Båda varianterna följer med i ögonblicksbilden och kan inte väljas bort |

#### Grupp 4: Passets delar och tid (R-030–R-039)

Tidsplanen beror bara på passlängd och fas och är därför den enklaste delen av motorn att testa uttömmande: alla fem faser gånger alla tillåtna passlängder är knappt 300 fall, och de fyra tabellerna i `passuppbyggnad.md` är facit.

| Regel | Modul | Bygg | Test | Kommentar |
|---|---|---|---|---|
| R-030 Delar och ordning | `time/plan`, `output/build` | ja | ja | |
| R-031 Fasta inslag | `time/plan`, `keys` | ja | ja | Exemplet i regeln, P = 60 för `fas-10-12`, ger 2 pauser |
| R-032 Måltider för delarna | `time/plan`, `keys` | ja | ja | Testfallet i regeln plus samtliga rader i tidstabellerna i `passuppbyggnad.md` |
| R-033 För korta delar tas bort | `time/plan` | ja | ja | Testfallet i regeln, `fas-13-14` med P = 30 |
| R-034 Tid för en övning | `blocks/candidates`, `keys` | ja | ja | |
| R-035 Varje del nära sin måltid | `select/assemble`, `check/session` | ja | ja | |
| R-036 Hela passets tid | `select/assemble`, `check/session` | ja | ja | Motsvarar tidslinjens invariant i avsnitt 3 |
| R-037 Var vattenpauserna ligger | `time/breaks` | ja | ja | Kravdelen, prioritetsdelen och undantaget vid tomt `del-spel` byggs var för sig. Testfallet 10, 11, 12, 18 minuter med 2 pauser ger 21 |
| R-038 Antal moment per del | `select/fill` | ja | ja | Kravdelen begränsar, prioritetsdelen är post 10 i R-048 |
| R-039 När en del saknas gäller inte tidsgränserna | `check/session` | ja | ja | |

#### Grupp 5: Fokusområden och vad som är ett bra pass (R-040–R-049)

| Regel | Modul | Bygg | Test | Kommentar |
|---|---|---|---|---|
| R-040 Träff och huvudträff | `score/score` | ja | ja | Definition, två rena predikat som resten av gruppen använder |
| R-041 Kärnan träffar alltid valt fokus | `blocks/candidates` | ja | ja | Krav, filtreras redan när momentet byggs. Gäller varje station för sig |
| R-042 Huvudträff i kärnan | `score/score` | ja | ja | Post 3 och 4, prövas per del |
| R-043 Röd tråd | `score/score` | ja | ja | Post 5 |
| R-044 Uppvärmningen förbereder kroppen | `score/score`, `keys` | ja | ja | Post 7. Listan per fas ligger i `keys.ts` |
| R-045 Uppvärmningen träffar valt fokus | `score/score` | ja | ja | Post 8 |
| R-046 Spelet träffar valt fokus | `score/score` | ja | ja | Post 9. Undantaget i andra meningen behöver ingen egen kod: posten är en prioritet, så ett spel utan träff är tillåtet när inget bättre finns |
| R-047 Alla valda fokus finns med | `score/score` | ja | ja | Post 6 |
| R-048 Hur två pass jämförs | `score/score` | ja | ja | Elva poster som en lexikografisk tupel. Post 1 är inte redundant mot post 2, se avsnitt 5 |
| R-049 Det här klarar ett genererat pass alltid | `score/improve`, `check/session` | ja | ja | Motorns dyraste regel. Byggs som lokal förbättring till fixpunkt och testas med den metod regeln själv anger. Se avsnitt 5 och 7 |

#### Grupp 6: Spelare, grupper och udda antal (R-050–R-056)

| Regel | Modul | Bygg | Test | Kommentar |
|---|---|---|---|---|
| R-050 Största grupp | `blocks/groups`, `keys` | ja | ja | Båda undantagen och minimivalet testas var för sig |
| R-051 Antal grupper | `blocks/groups` | ja | ja | Testfallen i regeln: N = 14 ger 7 och 7, N = 13 ger 7 och 6 |
| R-052 Ingen grupp för liten | `blocks/groups` | ja | ja | Testfallet i regeln |
| R-053 För få spelare | `blocks/groups` | ja | ja | |
| R-054 Udda antal | `blocks/groups`, `output/build` | ja | ja | Övningens egen lösning i `anpassning.udda_antal` visas i stället för jokern när den finns, se avsnitt 3 |
| R-055 Ledare för ett helgruppsmoment | `blocks/groups` | ja | ja | Testfallen i regeln, med ledarbehov 0 och 1 |
| R-056 Alla är med | `blocks/groups`, `check/session` | ja | ja | Kontrolleras som en invariant för varje moment |

#### Grupp 7: Ledare och stationer (R-060–R-067)

| Regel | Modul | Bygg | Test | Kommentar |
|---|---|---|---|---|
| R-060 När stationer får användas | `blocks/stations` | ja | ja | |
| R-061 Antal stationer | `blocks/stations` | ja | ja | |
| R-062 Stationernas övningar | `blocks/stations`, `filter/base` | ja | ja | |
| R-063 Grupper vid stationer | `blocks/stations`, `blocks/groups` | ja | ja | Gruppen prövas mot varje stationsövning för sig |
| R-064 Ledare vid stationer | `blocks/stations` | ja | ja | |
| R-065 Tid vid stationer | `blocks/stations` | ja | ja | Testfallen i regeln: S = 2 och t = 5 ger 11, S = 3 och t = 5 ger 17. Motsvarar blockraden i avsnitt 3 |
| R-066 Rotation | `blocks/stations` | ja | ja | |
| R-067 Val mellan stationer och helgrupp | `select/fill` | ja | ja | Algoritmval. Testet kräver att resultatet är ett av de tillåtna alternativen, inte ett bestämt. Se avsnitt 6 |

#### Grupp 8: Variation (R-070–R-072)

| Regel | Modul | Bygg | Test | Kommentar |
|---|---|---|---|---|
| R-070 Samma övning bara en gång i ett pass | `select/assemble`, `check/session` | ja | ja | Gäller även mellan stationer och över delgränser |
| R-071 Varianter är samma övning | `schema/ovning` | ja | ja | Uppfylls av datamodellen: varianter är fält på övningen, inte egna poster med eget `id` (ADR 0010). Testas som en egenskap hos schemat |
| R-072 Gränsen mellan fotbollsregler och algoritmval | `random/rng`, `select/*` | ja | **delvis** | Kravet i första stycket går längre än R-049 kan garantera. Se nedan |

**R-072 säger mer än R-049 kan hålla.** Första stycket är ett krav: ger algoritmen olika pass för samma underlag, får den bara välja bland pass som är *lika bra* enligt R-048. R-049 kräver däremot bara att passet inte kan förbättras med en **enda enkel ändring**, och säger uttryckligen att ett bättre pass som nås med flera ändringar samtidigt är tillåtet. Två frön kan därför landa i två olika lokala optima med olika poäng: båda uppfyller R-049, men tillsammans bryter de mot R-072. Att uppfylla R-072 bokstavligt innebär i praktiken att hitta det bästa av alla möjliga pass, vilket R-049 lika uttryckligen säger att generatorn inte behöver.

Motorn byggs så att slumpen bara används som sista utslag mellan alternativ som är lika bra i den jämförelse algoritmen gör vid det beslutet (avsnitt 6), vilket är den rimliga tolkningen. Testet blir ett egenskapstest: samma underlag genereras med många frön, och alla resultat ska ge samma poängtupel. Ett fel i det testet är ett äkta motexempel, men att det går igenom bevisar inte kravet — därför `delvis` på test. **Fotbollsexperten arbetar med en omformulering av R-072 parallellt med den här ADR:n.** Regeln ägs av `docs/doman/`, som jag inte ändrar. När den nya lydelsen är godkänd ska tabellraden för R-072 ovan och avsnitt 6 läsas om mot den: skärps kravet till ett globalt optimum enligt R-048 räcker inte girig konstruktion med lokal förbättring, och då blir beam search eller en constraint solver aktuell igen (se *Alternativ*). Det vore en ändring av den här ADR:n och kräver en ny eller uppdaterad ADR. Fram till dess gäller tolkningen ovan.

#### Grupp 9: Säkerhet (R-080–R-085)

| Regel | Modul | Bygg | Test | Kommentar |
|---|---|---|---|---|
| R-080 Ingen nickträning före 13 år | `filter/safety`, `input/validate` | ja | ja | Gäller både generatorns val och ledarens byte (R-104, R-106) |
| R-081 Nickövningar märks för rätt ålder | `schema/ovning`, `filter/safety` | delvis | delvis | Första stycket är en schemakontroll och finns i ADR 0010. Andra stycket, att en övning med planerad nickning verkligen märks med `nickspel`, kan enligt regeln själv inte kontrolleras automatiskt utan görs av fotbollsexpert och redaktör vid granskningen. Regeln behöver inte ändras |
| R-082 Begränsad mängd nickning | `filter/safety`, `check/session` | ja | ja | Testfallet i regeln, 8 + 5 > 10. I ett stationsmoment räknas stationstiden t per station, se avsnitt 3 |
| R-083 Nickspel väljs tillsammans med ett annat fokus | `input/validate` | ja | ja | |
| R-084 Påminnelse om mål | `output/notices` | ja | ja | Läser `material` med typ `mal`. En egen övning utan material ger alltid påminnelsen (R-106) |
| R-085 Påminnelse om benskydd | `output/notices` | ja | ja | |

#### Grupp 10: Tillgänglig yta (R-090–R-094)

| Regel | Modul | Bygg | Test | Kommentar |
|---|---|---|---|---|
| R-090 Ledaren kan ange yta | `input/validate` | ja | ja | |
| R-091 Ytornas mått | `keys` | ja | ja | |
| R-092 Momentet får plats | `filter/area` | ja | ja | Byggs exakt som regeln står. Testfallet med `yta-kvart` och två respektive tre grupper om 25 × 20 används som det är. Se anmärkningen nedan |
| R-093 Övning utan yta | `filter/area` | ja | ja | |
| R-094 Ytan gäller ett moment i taget | `filter/area` | ja | ja | |

**Anmärkning om R-092.** Regelns test för flera grupper är att varje grupp med marginal får plats i någon riktning *och* att summan av gruppernas ytor ryms i den valda ytan. Det är en areajämförelse, inte ett äkta packningstest, och den kan därför släppa igenom en uppställning som inte går att lägga ut i verkligheten. Två grupper om 30 × 20 m blir med marginal 33 × 23 m: var och en får plats på en kvarts plan (52 × 32), och 2 × 759 = 1 518 m² ryms i 1 664 m². Men två rektanglar på 33 × 23 går inte att placera på 52 × 32 åt något håll. Jag bygger regeln som den står, eftersom den är ett krav och felar åt det tillåtande hållet, och ledaren ser planen framför sig. Frågan lämnas till fotbollsexperten under *Beslut som behövs*, med rekommendationen att behålla regeln i version 1.

#### Grupp 11: När för få övningar matchar, och byte av övning (R-100–R-106)

| Regel | Modul | Bygg | Test | Kommentar |
|---|---|---|---|---|
| R-100 En del som saknar övning | `select/assemble`, `output/build` | ja | ja | Begreppet *delen kan fyllas* blir en egen funktion som prövas för delen för sig, precis som regeln föreskriver |
| R-101 När inget pass skapas | `select/assemble` | ja | ja | |
| R-102 Underlaget ändras aldrig av generatorn | `check/session` | ja | ja | Invariant: underlaget i svaret är identiskt med det inskickade |
| R-103 Vilka val som kan ändras | `output/explain` | ja | ja | Ett sjuttiotal alternativa värden prövas mot *delen kan fyllas*, men bara när en del faktiskt är tom. Se anmärkningen nedan |
| R-104 Vilka övningar som kan ersätta en övning | `swap/options` | ja | ja | Prioriteterna i R-048 används inte, ledaren väljer själv |
| R-105 Tid efter byte | `swap/apply` | ja | ja | Vid lika avstånd vinner den kortare tiden |
| R-106 Byte till en av klubbens egna övningar | `swap/options`, `schema/ovning` | ja | ja | Samma Zod-schema som för banken, med det enda undantaget att status inte prövas (ADR 0010) |

**Anmärkning om R-103.** Regeln prövar varje val för sig och visar vilket val som skulle kunna ge en övning, inte vilket värde. Eftersom antal spelare får vara 1–40 finns det nästan alltid något antal som gör att delen kan fyllas, så *antal spelare* kommer att visas i de flesta fall. Det följer av regeln som den står och är inte ett fel, men det gör tipset mindre användbart än det ser ut. Jag tar upp det under *Beslut som behövs* som en fråga för fotbollsexperten och UX-designern.

#### Grupp 12: Säsongsplan (R-110–R-113)

| Regel | Modul | Bygg | Test | Kommentar |
|---|---|---|---|---|
| R-110 Veckans fokus | `season/weeks` | ja | ja | Utan dubletter, i den ordning de först förekommer, passen i datumordning |
| R-111 Upprepning är tillåten | `season/weeks` | ja | ja | Negativt test: ingen varning och ingen spärr |
| R-112 Fokus som inte har förekommit på länge | `season/weeks` | ja, men byggs inte i version 1 | ja | Preliminär, och Could i backloggen. Ingår inte i berättelse 24. Regeln går att bygga och testa som den står, men byggs först när produktägaren tar in funktionen |
| R-113 Åldern i en säsongsplan som passerar ett årsskifte | `season/weeks` | ja | ja | ISO-veckor räknas med egen aritmetik över `Date.UTC`, inget datumbibliotek. Testfallet i regeln används som det är, inklusive veckan 2026-12-28–2027-01-03 |

#### Sammanställning

| Utfall | Antal | Regler |
|---|---|---|
| Går att bygga och testa som de står, och ingår i version 1 | 85 | |
| Går att bygga och testa som den står, men byggs inte i version 1 | 1 | R-112, preliminär och Could |
| Delvis, därför att regeln själv lägger en del av bedömningen på en människa | 2 | R-010, R-081 |
| Går att bygga, men bara delvis att testa, och behöver förtydligas | 1 | R-072 |
| **Summa** | **89** | |

Bara en av de 89 reglerna, R-072, behöver alltså ändras. R-010 och R-081 innehåller båda ett stycke som uttryckligen riktar sig till en människa, och de fungerar som de står.

### 5 R-048 och R-049 i praktiken

R-048 ger en ordning mellan pass, R-049 säger vad det levererade passet måste klara. Tillsammans beskriver de ett sökproblem, men ett med en mild acceptansnivå: passet ska vara giltigt och inte kunna förbättras med **en enda enkel ändring**. Motorn byggs därför som en girig konstruktion följd av lokal förbättring till fixpunkt. Den giriga delen ger snabbt ett rimligt pass, och förbättringsloopen är det som faktiskt uppfyller R-049.

**Steg 1, kandidatmoment.** För varje del byggs alla giltiga moment av de kandidatövningar som klarade filtreringen. Ett kandidatmoment bär sina grupper, sina ledare och ett **tidsintervall**, inte en bestämd tid:

| Momenttyp | Tillåtna tider |
|---|---|
| Helgrupp | varje heltal i `[max(5, kortast), min(längst, fasens längsta tid för delen)]` (R-034) |
| Stationer, S stycken | `S × t + (S − 1)` för varje heltal t i `[max(5, största kortast), min(minsta längst, fasens längsta tid)]` (R-065) |

Att tiden lämnas som ett intervall är det som gör steg 3 exakt lösbart. För helgrupp och för två moment i följd är den möjliga delsumman ett sammanhängande heltalsintervall; för stationer är den en aritmetisk följd med steget S, vilket steg 3 måste ta hänsyn till.

**Steg 2, girig fyllning i prioritetsordning.** Delarna fylls i exakt den ordning post 2 i R-048 räknar upp dem: `del-ovning`, `del-spelovning`, `del-spel`, `del-uppvarmning`. Det är svaret på hur prioriteringsordningen följs. Post 1 och 2 handlar om *vilka delar som har innehåll* och slår alla lägre poster, så den del som väger tyngst ska få välja övning först och inte bli utan för att en lättare del redan har tagit den (R-070). Inom en del väljs den momentuppsättning som är bäst på de poster delen kan påverka, därefter färre moment (post 10), och sist avgör fröet mellan likvärdiga alternativ.

**Steg 3, tidstilldelning.** Delarnas tider väljs inte en och en utan tillsammans, som en liten uttömmande sökning:

1. Varje del har högst 7 tillåtna summor, måltiden ± 3 (R-035).
2. För varje del och varje summa avgörs om summan är möjlig med delens valda moment, enligt intervallen i steg 1.
3. Kombinationerna av en summa per del är som mest 7⁴ = 2 401 stycken. De räknas igenom, och de som ger en total inom `P − 5` till `P` behålls (R-036).
4. Bland dessa väljs den som ger kortast längsta sträcka utan paus (post 11), beräknad med steg 4.

Sökrymden är så liten att den kan gås igenom exakt. Det finns alltså ingen heuristik i tidsfördelningen, och inget fall där motorn missar en tid som hade gått ihop.

**Steg 4, pauserna.** Att placera pauser så att den längsta sammanhängande aktiva tiden blir så kort som möjligt är samma problem som att dela en talföljd i k delar och minimera den största delsumman. Det löses exakt med binärsökning på svaret och en girig kontroll av om ett givet tak går att hålla. R-037:s begränsningar är villkor i den kontrollen: aldrig före första momentet, aldrig efter det sista, aldrig inuti en övning utom mellan två perioder i `del-spel`, och undantaget som tillåter flera pauser efter varandra när `del-spel` saknar övning.

**Steg 5, kontroll.** `check/session.ts` prövar samtliga krav. Ett pass som inte klarar kontrollen lämnas aldrig ut.

**Steg 6, lokal förbättring.** De fyra enkla ändringarna i R-049 prövas i fast ordning: byta en övning (a), fylla en tom del (b), ersätta två moment med ett (c) och flytta en paus (d). Den första ändring som ger en strikt bättre poänglista tillämpas, och loopen börjar om. När ingen ändring längre förbättrar passet är R-049 uppfylld per definition.

**Loopen terminerar**, och det behövs ingen tidsgräns. Poängtupeln förbättras strikt vid varje varv i en lexikografisk ordning över ett ändligt värdemängd, och antalet möjliga pass är ändligt. Det är viktigt just därför att R-049 är ett krav: en generator som gav upp vid en tidsgräns skulle kunna lämna ifrån sig ett pass som bryter mot regeln.

Dyrast är ändring b, som prövar en eller två moment i en tom del. Antalet par är kvadratiskt i antalet kandidater, men kandidatlistan per del är redan filtrerad på ålder, spelform, nivå, fokus, del, grupper, ledare, säkerhet och yta, så den är i praktiken liten. Paren beskärs dessutom genom att kandidaterna sorteras på kortaste tid och söks igenom med två pekare mot delens tillåtna summor.

**Vad garantin är, och inte är.** Motorn lovar exakt det R-049 kräver: ett giltigt pass som inte kan förbättras med en enda enkel ändring. Den lovar inte det bästa av alla möjliga pass, och R-049 säger uttryckligen att den inte behöver göra det. Där R-072 kräver mer än så, se grupp 8 i regeltabellen.

#### Post 1 är inte redundant

Det ligger nära till hands att tro att post 1, antalet delar med moment, följer av post 2, vilka delar som har moment, och att den ena kan tas bort. Det stämmer inte. Post 2 prövas i ordningen `del-ovning`, `del-spelovning`, `del-spel`, `del-uppvarmning`, alltså som ett binärtal med `del-ovning` överst. Ett pass med bara `del-ovning` ger mönstret 1000, medan ett pass med de tre andra delarna ger 0111. Post 2 ensam skulle föredra det första, men post 1 räknar tre mot en och föredrar det andra, som också är det rimliga passet. Ordningen mellan posterna är alltså betydelsefull, och just det här paret blir ett eget test.

#### Hur det testas när flera pass är lika bra

Flera pass kan vara lika bra, så ett test som kräver en bestämd övning på en bestämd plats blir instabilt och går sönder varje gång testbanken ändras. Testerna riktas därför mot poängen och mot egenskaper, aldrig mot innehållet, med ett undantag:

| Testform | Vad som prövas |
|---|---|
| Poängtest | `score(session)` jämförs med en förväntad tupel. Bygger inte på vilka övningar som valdes |
| Unikt optimum | En liten handbyggd testbank där exakt ett pass klarar R-049. Där, och bara där, jämförs hela passet. Det är den kontroll R-049 själv föreskriver |
| Uttömmande R-049 | Alla enkla ändringar räknas igenom mot testbanken, och ingen får ge en bättre poänglista |
| Fröstabilitet | Samma frö ger ett identiskt pass. Olika frön ger pass med samma poängtupel (egenskapstestet för R-072) |
| Invarianter | `check/session` körs som orakel på varje genererat pass i alla tester |

### 6 Algoritmval enligt R-072

R-072 räknar upp sex saker som inte är fotbollsregler utan mina att bestämma, så länge alla krav och R-048 följs. Här är besluten.

| Val enligt R-072 | Beslut | Varför |
|---|---|---|
| Hur generatorn söker, och i vilken ordning delarna fylls | Girig fyllning i den ordning post 2 i R-048 räknar upp delarna, följt av lokal förbättring till fixpunkt | Ordningen är redan prioritetsordningen, och fixpunkten är exakt det R-049 kräver. Se avsnitt 5 |
| Hur den väljer bland lika bra pass, och om upprepad generering ger olika pass | Seedad PRNG. Nytt frö vid varje *Generera igen*. Slumpen används bara som sista utslag mellan alternativ som är lika bra i den jämförelse algoritmen gör vid det beslutet | Ledaren ska kunna be om ett annat förslag (berättelse 02, *Utanför*), och fröet gör passet återskapbart i en felrapport. Se avsnitt 2 |
| Vilken tid en övning får inom sina gränser | Övningens rekommenderade tid är utgångspunkt. När delens valda summa kräver en avvikelse fördelas skillnaden deterministiskt, med minsta avvikelse från de rekommenderade tiderna först | R-009 låter övningsförfattaren ange en rekommenderad tid. Den är en bedömning som ska väga tyngst när inget annat tvingar fram en ändring |
| Stationer eller helgrupp när båda är lika bra (R-067) | Fröet avgör likformigt mellan de två | En fast regel till helgruppens fördel skulle göra att stationer aldrig dyker upp när ett helgruppsalternativ finns, trots att berättelse 02, kriterium 3 och 4, förutsätter att de förekommer. Vill ledaren slippa stationer trycker hon *Generera igen* |
| Var pauserna hamnar när flera placeringar är lika bra (R-037) | Deterministiskt: den placering som ligger tidigast i passet | Två skäl. Pauserna ska inte flytta sig mellan två visningar av samma pass, och en deterministisk utslagsgivare gör *strikt bättre* entydigt i förbättringsloopen. Med ett slumpat utslag skulle ändring d kunna växla fram och tillbaka mellan två likvärdiga placeringar och loopen aldrig nå en fixpunkt |
| Om generatorn tar hänsyn till tidigare pass | Nej i version 1 | R-072 kräver en ny fotbollsregel innan det byggs. `generateSession` har därför medvetet ingen parameter för tidigare pass: möjligheten finns inte att råka använda |

Den sista raden är värd att stanna vid. R-072 säger att det inte finns någon begränsning mellan pass: samma övning och samma fokus får återkomma i nästa pass och i följande veckor i en säsongsplan. Motorn behöver alltså ingen historik, och genom att inte ta emot någon kan den inte heller börja använda en i smyg. Skulle regeln ändras är det en ny parameter och en ny ADR.

Alla sex valen märks i koden med en hänvisning till R-072, så att en läsare ser att de är val och inte regler. Ett val som ändras kräver ingen ny fotbollsregel, men det ändrar vilka pass ledaren får, och därför ska ändringen synas i en commit som säger det.

### 7 Testning

Kravet är att varje regel-ID har minst ett test och är spårbart i koden. Det löses med en namnkonvention och en kontroll som gör spårbarheten mekanisk i stället för en fråga om disciplin.

**I koden.** Funktionen som äger en regel märks med en JSDoc-rad `@regel R-051`. En regel kan ha flera ställen, och ett ställe kan bära flera regler.

**I testerna.** Varje test som täcker en regel inleder sitt namn med regel-ID:t:

```ts
describe('R-051 Antal grupper', () => {
  it('R-051 delar 14 spelare i 2 grupper om 7 när största grupp är 8', ...)
  it('R-051 delar 13 spelare i 7 och 6', ...)
})
```

**Kontrollen.** `npm run regler:tackning` läser regel-ID:n ur rubrikerna i `docs/doman/generatorregler.md`, samlar in `@regel`-taggar och testnamn, och skriver ut en matris med en rad per regel. Skriptet avslutar med kod 1 om någon regel saknar test, och det körs i CI. Det ger kvalitetssäkraren ett svar som går att visa upp i stället för att läsas fram. Skriptet känner till de fyra undantagen i sammanställningen i avsnitt 4 genom en uttrycklig lista med motivering per rad, så att ett undantag måste skrivas in medvetet och syns i en diff.

Att listan över regler läses ur domänfilen och inte ur en kopia är avsiktligt. Lägger fotbollsexperten till en regel misslyckas kontrollen tills den har ett test, vilket är precis den signal som behövs.

#### Testnivåer

| Nivå | Vad den täcker | Var |
|---|---|---|
| Schema | R-001–R-009, R-081 och R-092, minst ett godkänt och ett underkänt fall per regel | `schema/ovning.test.ts` (ADR 0010) |
| Enhet | En regel i taget mot sin modul. De flesta av de 89 | Bredvid varje modul |
| Tidsplan | Alla fem faser gånger alla tillåtna passlängder, knappt 300 fall, mot tabellerna i `passuppbyggnad.md` | `time/plan.test.ts` |
| Hela motorn | Genererade pass mot `check/session` som orakel, över ett rutnät av underlag och frön | `generate.test.ts` |
| Prestanda | Värsta fallet: 40 spelare, 10 ledare, 3 fokus, full bank. Mäter tiden och underkänner över budget | `generate.bench.test.ts` |

**Testfallen som står i reglerna används ordagrant.** R-021, R-032, R-033, R-037, R-048, R-051, R-052, R-055, R-065, R-082, R-092 och R-113 innehåller var för sig ett eller flera uträknade exempel. De skrivs av som tester med regel-ID i namnet. De är godkända vid K1 och är därför det närmaste ett facit motorn kan få, och de fångar dessutom om jag har missförstått en regel, vilket ett test jag hittar på själv inte gör.

**Testbanken.** Motorns tester behöver övningar med bestämda egenskaper, till exempel en övning som bara passar en nivå eller ett stationsmoment som nätt och jämnt får plats. De ligger som fixturer i `src/regelmotor/__testdata__/`, **inte** i `content/ovningar/`. Bankens riktiga övningar är innehåll som importeras till produktionen (ADR 0010), och en påhittad testövning får aldrig kunna hamna där. Fixturerna byggs med en hjälpfunktion som fyller i giltiga standardvärden, så att ett test bara behöver ange det som är intressant för just den regeln.

**Egenskapstester utan nytt beroende.** Ett bibliotek som fast-check hade gett slumpade indata, men motorn ska vara deterministisk och testerna ska ge samma svar varje körning. I stället körs ett bestämt rutnät av underlag, ålder gånger nivå gånger antal spelare gånger antal ledare gånger passlängd, med ett bestämt antal frön per kombination. Rutnätet är stort nog att hitta fel och litet nog att köra på varje push, och det ger samma resultat i CI som lokalt.

**Ägarskap.** Testerna ägs av kvalitetssäkraren (`CLAUDE.md`). Jag skriver tester medan jag bygger, men slutgranskningen och täckningen är hens, och `regler:tackning` är underlaget hen granskar mot.

## Alternativ

| Alternativ | Varför det valdes bort |
|---|---|
| **Uttömmande sökning efter det bästa passet enligt R-048** | Sökrymden är produkten av kandidaterna per del och växer exponentiellt med bankens storlek. R-048 och R-049 kräver det uttryckligen inte, och flera pass kan vara lika bra, vilket gör ett test mot "det bästa passet" instabilt. R-049 är skriven just för att slippa det här |
| **Ett generiskt regelramverk**, till exempel json-rules-engine | Reglerna är av minst fyra olika slag: typkontroller, filter, en sökning och en poängsättning. Ett regelramverk uttrycker filtren väl och de tre andra sämre. Spårbarheten per regel-ID blir sämre än med en modul per regelgrupp, och det är ett nytt beroende utan vinst |
| **En constraint solver eller heltalsprogrammering** | Skulle lösa val och tider i ett svep och ge ett bevisat optimum. Bortvald: tungt beroende, ofta som wasm, svårt att förklara för ledaren varför en del blev tom (R-103), och en modell är svårare att spåra till ett regel-ID än en funktion med `@regel` |
| **Generering i databasen som en Postgres-funktion** | Motorn måste kunna köras i klienten utan nät (ADR 0005), och SQL är sämre att testa regel för regel |
| **Slumpen i gränssnittet i stället för ett frö in i motorn** | Motorn slutar vara en ren funktion, och ett pass som en ledare rapporterar fel på går inte att återskapa i ett test |
| **Ett datumbibliotek för ISO-veckor**, till exempel date-fns eller Luxon | R-113 behöver veckans måndag och veckans torsdag, ett tjugotal rader aritmetik över `Date.UTC`. Ett nytt beroende i en modul som annars är beroendefri är inte motiverat |
| **En färdig PRNG från npm** | En patchversion som byter algoritm skulle tyst ändra alla pass. Se avsnitt 2 |
| **Pauser och avslutning utanför `session_items`** | Tidslinjen skulle finnas på två ställen, och passets totaltid skulle gå att räkna fram på två sätt som kan säga emot varandra |
| **En rad per station utan blockrad** | Bytesminuterna i R-065 hör till momentet och inte till någon station, och tidssumman skulle inte gå ihop. Se avsnitt 3 |
| **Beam search eller simulated annealing** i stället för girig konstruktion med lokal förbättring | Ger inte mer än R-049 kräver, kostar mer tid på en mobil och gör resultatet svårare att förklara. Blir aktuellt först om R-072 skärps till att kräva ett globalt optimum |

## Konsekvenser

**Fördelar**

- Varje regel har en modul, en `@regel`-tagg och minst ett test, och `regler:tackning` gör täckningen till något som går att visa upp i stället för att påstå.
- Motorn är en ren funktion utan beroenden. Den kan köras i klienten utan nät (ADR 0005), i Vitest och i ett skript, och varje regel kan testas utan gränssnitt eller databas.
- Determinismen gör ett felrapporterat pass återskapbart: underlag och frö räcker för att få tillbaka exakt samma pass i ett test.
- Tidsfördelningen och pausplaceringen löses exakt, inte heuristiskt, så det finns inga fall där motorn missar en tidsplan som hade gått ihop.
- Tidslinjens invariant, att summan av radernas minuter är passets tid, fångar hela klassen av tidsfel i en enda kontroll.

**Nackdelar och risker**

- **Databasen ändras.** `session_items` får kolumnerna `kind`, `block`, `station`, `station_minutes` och `layout`, och `part` får en fast värdelista. Det är en migration som måste ligga före inkrement 1, och den fyller de luckor ADR 0003 uttryckligen lämnade till del B. Den säger alltså inte emot ADR 0003 och kräver ingen ny version av den, men ADR 0003:s beskrivning av `session_items` bör läsas tillsammans med avsnitt 3 här.
- **R-049 är dyr, och den är ett krav.** Förbättringsloopen är motorns tyngsta del, och ändring b är kvadratisk i antalet kandidater per del. Loopen terminerar utan tidsgräns, men jag vet ännu inte hur lång tid värsta fallet tar på en äldre mobil. Prestandatestet i avsnitt 7 sätter en budget i inkrement 1. Håller den inte är nästa steg att flytta genereringen till en web worker; motorn påverkas inte, eftersom omslaget då ligger i `src/app/` och motorn förblir ren.
- **R-072 kan inte garanteras som den står.** Egenskapstestet över många frön hittar motexempel men bevisar inte kravet. Tills regeln har förtydligats är detta en känd lucka mellan specifikation och kod, och den är den enda i de 89 reglerna.
- **`keys.ts` dubblerar domänfilernas siffror.** K/R-tabellen, taken per ledare, pausintervallen, tidsandelarna och ytmåtten finns både i `docs/doman/` och i koden. Ändrar fotbollsexperten en siffra utan att koden ändras säger de två källorna emot varandra, och inget test upptäcker det, eftersom testerna också läser `keys.ts`. Motverkas av att varje tabell i `keys.ts` har en hänvisning till källfil och regel-ID, och av att `docs/doman/**` bör ligga i `CODEOWNERS` så att en ändring där alltid granskas. Att generera `keys.ts` ur markdown-tabellerna vore skörare än det löser.
- **Testbanken är påhittad.** Motorn testas mot fixturer, inte mot riktiga övningar. Att den fungerar på den verkliga banken visar sig först i fas 3 och 4, när det finns tillräckligt många godkända övningar. Ett tomt eller tunt bankläge är därför ett eget testfall: R-100, R-101 och R-103 är just de regler som styr vad ledaren ser då, och de kommer att träffas ofta i början.
- **Ytkontrollen är tillåtande.** R-092 kan släppa igenom en uppställning som inte går att lägga ut i verkligheten, se anmärkningen i grupp 10.
- **Inga personuppgifter.** Motorn tar emot antal spelare och antal ledare, aldrig något om en spelare, och den har inget att logga som skulle kunna innehålla persondata. Fritext ur ledarens egna övningar passerar motorn i ögonblicksbilder men tolkas inte. Det gör den ointressant för säkerhetsgranskningen, vilket är avsikten.
- **Ingen ny dependency.** PRNG:n, ISO-veckoräkningen och poängsättningen är egen kod, sammanlagt några hundra rader. Det är medvetet: allt tre är sådant där ett paketbyte tyst skulle ändra vilka pass ledarna får.
