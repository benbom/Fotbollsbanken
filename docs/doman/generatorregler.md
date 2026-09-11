Status: utkast

# Generatorregler

**Ägare:** fotbollsexpert

Det här är specifikationen för regelmotorn som sätter ihop träningspass. Kod och tester ska hänvisa till regel-ID:n här. En regel som inte står här ska inte finnas i koden (`docs/doman/README.md`).

Reglerna bygger på de andra domänfilerna och använder deras nycklar:

| Vad | Nycklar | Fil |
|---|---|---|
| Spelformer | `3mot3`, `5mot5`, `7mot7`, `9mot9`, `11mot11` | `spelformer.md` |
| Åldersfaser | `fas-6-7`, `fas-8-9`, `fas-10-12`, `fas-13-14`, `fas-15-19` | `aldrar-och-fokus.md` |
| Nivåer | `niva-1`, `niva-2`, `niva-3` | `nivaer.md` |
| Fokusområden | 17 nycklar, till exempel `bollkansla`, `passning-mottagning` | `fokusomraden.md` |
| Passets delar | `del-uppvarmning`, `del-ovning`, `del-spelovning`, `del-spel`, `del-avslutning` | `passuppbyggnad.md` |
| Grupptyper | `fri`, `par`, `tva-lag`, `fast-storlek` | `passuppbyggnad.md` |
| Ytor (preliminärt) | `yta-hel`, `yta-halv`, `yta-kvart` | den här filen, R-090 |

## Så läser du reglerna

- **Krav** måste alltid vara uppfyllt. Ett pass som bryter mot ett krav är fel.
- **Prioritet** ska vara uppfyllt om det finns något giltigt pass som uppfyller den. Om prioriteter krockar gäller ordningen i R-048.
- **Preliminär** betyder att regeln väntar på användarens beslut. Den kan byggas, men ska vara lätt att ändra. Preliminära regler är märkta med *(preliminär)* i rubriken.
- **Min bedömning.** Siffrorna i reglerna är mina bedömningar som tränarutbildare, om inget annat står. Källorna finns i respektive domänfil.
- **Reserverade nummer.** Varje grupp har ett eget nummerintervall, till exempel R-030–R-039 för tid. Nummer som inte används är reserverade för nya regler i samma grupp. Ett ID återanvänds aldrig.

## Begrepp

| Begrepp | Betydelse |
|---|---|
| **Underlag** | Det ledaren anger: ålder, spelform, nivå, antal spelare (N), antal ledare (L), passlängd (P) och fokusområden, och preliminärt yta. |
| **Fas** | Åldersfasen som följer av åldern (R-012). |
| **Valt fokus** | De fokusområden ledaren har valt. |
| **Del** | En av passets fem delar. De fyra första fylls från banken, `del-avslutning` är ett fast inslag. |
| **Moment** | Innehållet i en del. En del har ett eller två moment. Ett moment är antingen ett **helgruppsmoment** (alla gör samma övning, i en eller flera grupper samtidigt) eller ett **stationsmoment** (olika övningar samtidigt, med rotation). |
| **Grupp** | De spelare som gör en övning tillsammans på en yta. Övningens fält `spelare` anger minsta och största antal i en grupp. |
| **Ledarbehov** | Hur många ledare varje grupp i övningen behöver: 0, 1 eller 2 (R-006). |
| **Taket per ledare** | Högsta antal spelare per ledare för fasen: 8 (`fas-6-7`), 10 (`fas-8-9`), 12 (`fas-10-12`), 14 (`fas-13-14`), 16 (`fas-15-19`). Se `passuppbyggnad.md`. |
| **Aktiv tid** | Passlängd minus avslutning minus vattenpauser (R-032). |
| **Måltid** | Den tid en del ska ha enligt R-032 och R-033. |
| **Träff** | En övning träffar valt fokus om minst ett av övningens fokusområden finns bland de valda. **Huvudträff** betyder att övningens första fokusområde (huvudfokus) finns bland de valda. |
| **Giltigt pass** | Ett pass som uppfyller alla krav. |

---

## Grupp 1: Övningens data som generatorn använder (R-001–R-009)

**Varför:** generatorn kan bara välja rätt om övningarna är märkta på ett sätt som går att lita på. Reglerna kan kontrolleras automatiskt när en övning sparas eller valideras. En övning som bryter mot någon av dem får inte användas av generatorn. Flera fält är nya eller ändrade jämfört med `content/ovningar/README.md`. Fältnamnen bestäms vid K2, men innehållet ska vara det som står här.

### R-001 Nivå är en lista
Krav. Fältet `niva` är en lista med minst en av `niva-1`, `niva-2` och `niva-3`, utan dubletter. Om listan innehåller både `niva-1` och `niva-3` måste den också innehålla `niva-2`.

### R-002 Fokusområden
Krav. Fältet `fokusomraden` innehåller 1–3 olika fokusnycklar. Den första är övningens huvudfokus. Varje fokusområde ska vara K eller R i tabellen i `fokusomraden.md` för **varje** fas som övningens åldersspann berör.

*Exempel:* en övning för 8–12 år berör `fas-8-9` och `fas-10-12` och får inte ha `fasta-situationer`, eftersom det är "–" för `fas-8-9`.

### R-003 Ålder
Krav. `alder` har ett minsta och ett högsta värde, båda heltal, där 6 ≤ minsta ≤ högsta ≤ 19.

### R-004 Spelformer
Krav. `spelformer` innehåller minst en spelformsnyckel. Varje spelform i listan ska vara tillåten (R-014) för minst en ålder i övningens åldersspann.

### R-005 Passdelar
Krav. Det nya fältet `passdelar` innehåller minst en av `del-uppvarmning`, `del-ovning`, `del-spelovning` och `del-spel`. `del-avslutning` får inte förekomma.

### R-006 Ledarbehov per grupp
Krav. Övningen anger ledarbehov per grupp som ett heltal 0, 1 eller 2.
- 0 (självgående): en ledare i närheten räcker, och den kan ha uppsikt över flera grupper.
- 1 (ledarstyrd): varje grupp behöver en egen ledare hela tiden.
- 2: varje grupp behöver två egna ledare.

### R-007 Antal spelare
Krav. `spelare` har ett minsta och ett högsta antal per grupp, båda heltal, där 1 ≤ minsta ≤ högsta ≤ 40.

### R-008 Grupptyp
Krav. Övningen har exakt en grupptyp: `fri`, `par`, `tva-lag` eller `fast-storlek`.
- `par` och `tva-lag` kräver att minsta antal spelare är minst 2.
- `fast-storlek` kräver att minsta och högsta antal är lika (gruppens storlek, minst 2). Övningen anger dessutom ja eller nej för om den har en lösning för udda antal, till exempel att en spelare vilar och byter in.
- En övning som har `del-spel` i `passdelar` ska ha grupptypen `tva-lag`.

### R-009 Tid
Krav. Övningen har en kortaste, en rekommenderad och en längsta tid i hela minuter, där 5 ≤ kortaste ≤ rekommenderad ≤ längsta. Om övningen bara har en rekommenderad tid gäller den som både kortaste och längsta.

---

## Grupp 2: Underlaget (R-010–R-021)

**Varför:** underlaget bestämmer allt annat. Reglerna ser till att ledaren bara kan be om pass som går att genomföra säkert och meningsfullt, och att samma underlag alltid tolkas på samma sätt.

### R-010 Hur åldern tolkas *(preliminär)*
Den ålder ledaren anger är den ålder spelarna fyller under det aktuella kalenderåret. Om gruppen har flera åldrar anger ledaren den ålder som flest spelare har. Om två åldrar är lika vanliga anger ledaren den lägre. Appen ska säga detta vid åldersfältet.

*Väntar på användarens beslut från del 1. Regeln påverkar hjälptexten, inte beräkningarna.*

### R-011 Giltig ålder
Krav. Åldern är ett heltal från 6 till 19. Andra värden ger ett felmeddelande och inget pass (berättelse 01, kriterium 3).

### R-012 Fas från ålder
Krav. Fasen bestäms av åldern:

| Ålder | Fas |
|---|---|
| 6–7 | `fas-6-7` |
| 8–9 | `fas-8-9` |
| 10–12 | `fas-10-12` |
| 13–14 | `fas-13-14` |
| 15–19 | `fas-15-19` |

### R-013 Föreslagen spelform
Krav. Appen föreslår spelformen för åldern: 6–7 år `3mot3`, 8–9 år `5mot5`, 10–12 år `7mot7`, 13–14 år `9mot9`, 15–19 år `11mot11` (`spelformer.md`).

### R-014 Tillåtna spelformer
Krav. Spelformerna har ordningen `3mot3`, `5mot5`, `7mot7`, `9mot9`, `11mot11`. Ledaren får välja den föreslagna spelformen eller den som ligger närmast före eller efter i ordningen. Andra spelformer kan inte väljas.

*Exempel:* för 12 år är `5mot5`, `7mot7` och `9mot9` tillåtna. För 6 år är `3mot3` och `5mot5` tillåtna.

*Motivering:* en grupp som har spelare från två åldersfaser, eller som spelar i en annan spelform i sitt distrikt, behöver kunna välja grannspelformen. Att välja 11 mot 11 för 8-åringar är aldrig rimligt.

### R-015 Fasen styrs av åldern, inte av spelformen
Krav. När ledaren har valt en annan spelform än den föreslagna bestäms fasen fortfarande av åldern (R-012). Alla regler som använder fasen, till exempel säkerhetsregler, tider och taket per ledare, använder fasen från åldern. Spelformen används bara för att matcha övningarnas `spelformer` (R-024) och ytor (R-092).

### R-016 Nivå
Krav. Ledaren väljer exakt en nivå: `niva-1`, `niva-2` eller `niva-3`.

### R-017 Antal spelare och ledare
Krav. Antal spelare är ett heltal från 1 till 40. Antal ledare är ett heltal från 1 till 10. Andra värden ger ett felmeddelande och inget pass.

*Motivering för taken:* med fler än 40 spelare på ett pass behöver gruppen delas i två pass. Fler än 4 ledare ändrar inte vad generatorn kan göra (R-061), så 10 räcker gott.

### R-018 Passlängd
Krav. Passlängden är ett heltal i minuter, minst 30 och högst:

| Fas | Längst |
|---|---|
| `fas-6-7` | 60 |
| `fas-8-9` | 75 |
| `fas-10-12` | 90 |
| `fas-13-14` | 90 |
| `fas-15-19` | 120 |

Kortare pass ger felmeddelandet att passet är för kort (berättelse 01, kriterium 8). Längre pass ger ett felmeddelande som anger längsta passlängd för åldern.

### R-019 Val av fokusområden
Krav. Ledaren väljer 1–3 fokusområden. Bara fokusområden som är K eller R för fasen i `fokusomraden.md` kan väljas.

*Motivering:* med fler än tre fokus blir passet splittrat, och kärnan i passet (Öva och Spelövning) har bara plats för två till fyra övningar.

### R-020 Komplett underlag
Krav. Ett underlag är komplett när ålder, spelform, nivå, antal spelare, antal ledare, passlängd och minst ett fokusområde finns och uppfyller R-011 till R-019. Yta är valfri (R-090). Generatorn körs bara med ett komplett underlag.

### R-021 Många spelare per ledare *(preliminär)*
Om N är större än L gånger taket per ledare för fasen genereras passet ändå, men appen visar ett tips om att ta hjälp av fler vuxna.

*Exempel:* 20 spelare, 2 ledare, 7 år: 20 > 2 × 8 = 16, så tipset visas.

*Preliminär eftersom den lägger till ett nytt beteende som inte finns i kraven.*

---

## Grupp 3: Vilka övningar som får väljas, och nivå (R-022–R-029)

**Varför:** det här är grundfiltret. En övning som inte klarar det är aldrig aktuell, oavsett hur passet ser ut i övrigt. En övning kan bara läggas i ett moment om den dessutom klarar reglerna för grupper (grupp 6), ledare och stationer (grupp 7), säkerhet (grupp 9) och yta (grupp 10).

Nivåmatchningen är strikt. Det är ledaren som vet var gruppen står, och övningsförfattaren som vet vilka nivåer övningen passar för. Om generatorn själv tar en övning från en annan nivå går ledarens val förlorat, och det är just det berättelse 03 säger att appen inte ska göra. Att en övning passar två nivåer uttrycks i stället i övningens nivålista (R-001).

### R-022 Bara godkända övningar
Krav. Bara övningar med status `godkand` kan väljas (berättelse 02, kriterium 11).

### R-023 Ålder
Krav. Övningen kan väljas bara om underlagets ålder ligger inom övningens `alder`, med gränserna inräknade.

### R-024 Spelform
Krav. Övningen kan väljas bara om underlagets spelform finns i övningens `spelformer`.

### R-025 Nivå
Krav. Övningen kan väljas bara om underlagets nivå finns i övningens nivålista.

*Exempel:* en övning med `[niva-1, niva-2]` kan väljas för `niva-1` och `niva-2`, men inte för `niva-3`.

### R-026 Inga angränsande nivåer
Krav. Generatorn väljer aldrig en övning vars nivålista saknar underlagets nivå, inte ens när för få övningar matchar. Då gäller R-100 till R-103.

### R-027 Alla övningens fokusområden passar fasen
Krav. Övningen kan väljas bara om alla dess fokusområden är K eller R för fasen. Regeln är ett skydd om en övning är fel märkt eller om tabellen i `fokusomraden.md` ändras.

### R-028 Rätt del
Krav. En övning kan läggas i en del bara om delens nyckel finns i övningens `passdelar`. Varje övning i passet visas med nyckeln för den del den ligger i (berättelse 02, kriterium 2).

### R-029 Varianterna visas alltid
Krav. Generatorn väljer inte mellan övningens lättare och svårare variant. Passet visar övningen med båda varianterna, så att ledaren kan anpassa på plats (`nivaer.md`).

---

## Grupp 4: Passets delar och tid (R-030–R-039)

**Varför:** alla pass ska ha samma begripliga form (värm upp, öva, spelövning, spel, avslutning) och räcka precis så länge som ledaren har planen. Spelet ska alltid få mest tid. Vattenpauser och avslutning är fasta och kan inte offras för att få tiden att gå ihop. Tabeller med uträknade exempel finns i `passuppbyggnad.md`.

### R-030 Delar och ordning
Krav. Passet har delarna i den här ordningen: `del-uppvarmning`, `del-ovning`, `del-spelovning`, `del-spel`, `del-avslutning`. En del kan saknas bara enligt R-033 eller R-100.

### R-031 Fasta inslag
Krav.
- `del-avslutning` är sist och tar 3 minuter för `fas-6-7` och `fas-8-9`. För övriga faser tar den 3 minuter om P < 60, annars 5 minuter.
- Vattenpauser tar 2 minuter var. Antal pauser = ⌈P / pausintervall⌉ − 1, där pausintervallet är 15 minuter för `fas-6-7` och `fas-8-9`, 20 minuter för `fas-10-12` och `fas-13-14` och 25 minuter för `fas-15-19`.
- Generatorn tar aldrig bort eller kortar en vattenpaus eller avslutningen.

*Exempel:* P = 60 för `fas-10-12` ger ⌈60 / 20⌉ − 1 = 2 pauser, alltså 4 minuter.

### R-032 Måltider för delarna
Krav. Aktiv tid = P − avslutning − vattenpauser. Måltiden för `del-uppvarmning`, `del-ovning` och `del-spelovning` är andelen gånger aktiv tid, avrundad nedåt till hela minuter. `del-spel` får det som blir kvar av den aktiva tiden.

| Fas | `del-uppvarmning` | `del-ovning` | `del-spelovning` |
|---|---|---|---|
| `fas-6-7` | 25 % | 25 % | 15 % |
| `fas-8-9` | 20 % | 25 % | 20 % |
| `fas-10-12` | 20 % | 20 % | 25 % |
| `fas-13-14` | 25 % | 15 % | 25 % |
| `fas-15-19` | 25 % | 15 % | 25 % |

*Testfall:* `fas-8-9`, P = 60: avslutning 3, vatten 6, aktiv tid 51. Uppvärmning ⌊10,2⌋ = 10, Öva ⌊12,75⌋ = 12, Spelövning ⌊10,2⌋ = 10, Spel 51 − 32 = 19.

### R-033 För korta delar tas bort
Krav. Om måltiden för `del-ovning` eller `del-spelovning` enligt R-032 är mindre än 5 minuter tas delen bort ur passet, och dess minuter läggs till måltiden för `del-spel`. En del som tas bort på det här sättet räknas inte som att den saknar övning (R-100).

*Testfall:* `fas-13-14`, P = 30: avslutning 3, vatten 2, aktiv tid 25. Uppvärmning 6, Öva ⌊3,75⌋ = 3, som tas bort, Spelövning 6, Spel 25 − 15 + 3 = 13.

### R-034 Tid för en övning
Krav. En övnings tid i passet är ett heltal som
1. är minst 5 minuter,
2. ligger inom övningens kortaste och längsta tid (R-009),
3. är högst fasens längsta tid för delen:

| Fas | Uppvärmning, Öva, Spelövning | Spel |
|---|---|---|
| `fas-6-7` | 8 | 20 |
| `fas-8-9` | 10 | 25 |
| `fas-10-12` | 15 | 30 |
| `fas-13-14` | 20 | 35 |
| `fas-15-19` | 25 | 45 |

Alla grupper i samma helgruppsmoment har samma tid. För stationer gäller R-065.

### R-035 Varje del nära sin måltid
Krav. Summan av momentens tider i en del ligger inom måltiden ± 3 minuter.

### R-036 Hela passets tid
Krav. Passets totala tid, med vattenpauser och avslutning, är minst P − 5 och högst P minuter. Passet visar den faktiska totala tiden (berättelse 02, kriterium 8).

### R-037 Var vattenpauserna ligger
Krav. En vattenpaus ligger mellan två moment eller, i `del-spel`, mellan två perioder av samma spel. I övriga delar ligger den aldrig inuti en övning. Ingen paus ligger före första momentet eller efter sista momentet i `del-spel`.

Prioritet. Pauserna placeras så att den längsta sammanhängande aktiva tiden utan paus blir så kort som möjligt.

### R-038 Antal moment per del
Krav. Varje del som fylls från banken har ett eller två moment.

Prioritet. En del fylls med så få moment som möjligt. Varje byte kostar tid och koncentration.

### R-039 När en del saknas gäller inte tidsgränserna
Krav. Om en del saknar övning (R-100) gäller inte R-035 och R-036 för passet. Övriga delar får sina måltider som vanligt, och passet visar den faktiska totala tiden och hur mycket som saknas.

---

## Grupp 5: Fokusområden (R-040–R-048)

**Varför:** ledaren väljer fokus för att passet ska handla om något. Kärnan i passet, Öva och Spelövning, ska därför alltid träffa valt fokus. Uppvärmning och Spel ska helst också göra det, men har egna uppgifter: uppvärmningen ska förbereda kroppen, och spelet ska ge mycket fri speltid. Ett fritt spel är alltid meningsfullt, även när det inte är märkt med dagens fokus.

**Hur stor del av passet som träffar fokus:** minst Öva och Spelövning, alltså 40–45 procent av den aktiva tiden beroende på fas (R-032). Med prioriteterna R-045 och R-046 blir det oftast mer. I korta pass där Öva tas bort (R-033) kan andelen bli lägre. Därför finns ingen fast procentregel.

### R-040 Träff och huvudträff
Definition. En övning **träffar** valt fokus om minst ett av dess fokusområden finns bland de valda. Den har **huvudträff** om dess första fokusområde finns bland de valda.

### R-041 Kärnan träffar alltid valt fokus
Krav. Varje övning i `del-ovning` och `del-spelovning` träffar valt fokus. Det gäller också varje station i ett stationsmoment.

### R-042 Huvudträff i kärnan
Prioritet. Övningarna i `del-ovning` och `del-spelovning` har huvudträff.

### R-043 Röd tråd
Prioritet. Minst en övning i `del-spelovning` har ett valt fokusområde gemensamt med minst en övning i `del-ovning`. Det spelarna övar ska de sedan använda i spel.

### R-044 Uppvärmningen förbereder kroppen
Prioritet. Minst en övning i `del-uppvarmning` har något av dessa fokusområden:

| Fas | Fokusområden |
|---|---|
| `fas-6-7`, `fas-8-9` | `lek`, `bollkansla` eller `koordination` |
| `fas-10-12` | `skadeforebyggande` eller `koordination` |
| `fas-13-14`, `fas-15-19` | `skadeforebyggande` |

*Motivering:* SvFF rekommenderar skadeförebyggande program i uppvärmningen minst två gånger i veckan, FIFA 11+ Kids för 7–14 år och FIFA 11+ eller Knäkontroll för äldre (se källan i `passuppbyggnad.md`). För de yngsta sker samma sak genom lek och rörelse.

### R-045 Uppvärmningen träffar valt fokus
Prioritet. Minst en övning i `del-uppvarmning` träffar valt fokus.

### R-046 Spelet träffar valt fokus
Prioritet. Minst en övning i `del-spel` träffar valt fokus. Om ingen spelövning i banken träffar, väljs ett spel som uppfyller alla krav, utan hänsyn till fokus.

### R-047 Alla valda fokus finns med
Prioritet. Om ledaren har valt flera fokusområden träffas varje valt fokusområde av minst en övning i passet.

### R-048 Ordning mellan prioriteter
Krav. Generatorn väljer bland de giltiga passen. Pass jämförs med prioriteterna i den här ordningen, och ett pass som uppfyller en prioritet högre upp i listan är bättre än ett som inte gör det, oavsett de lägre:

1. R-042 Huvudträff i kärnan (först `del-ovning`, sedan `del-spelovning`)
2. R-043 Röd tråd
3. R-047 Alla valda fokus finns med
4. R-044 Uppvärmningen förbereder kroppen
5. R-045 Uppvärmningen träffar valt fokus
6. R-046 Spelet träffar valt fokus
7. R-038 Så få moment som möjligt
8. R-037 Pauserna placeras jämnt

Generatorn ska lämna ett pass som inget annat giltigt pass är bättre än. Om två delar konkurrerar om samma övning (R-070) har delen som står först i ordningen `del-ovning`, `del-spelovning`, `del-spel`, `del-uppvarmning` företräde. Hur sökningen går till är ett algoritmval (grupp 8), men den ska ge det här resultatet. Testerna görs med små testbanker där det är entydigt vilket pass som är bäst.

---

## Grupp 6: Spelare, grupper och udda antal (R-050–R-056)

**Varför:** alla spelare ska vara med i allt, och ingen ska stå i kö. När det är fler spelare än en övning rymmer delas de i flera grupper som gör samma sak sida vid sida. Udda antal ska nästan aldrig vara ett skäl att välja bort en övning, eftersom det finns enkla lösningar som alla ledare känner till: en trio i stället för ett par, eller en joker i ett spel. Principerna beskrivs för ledaren i `passuppbyggnad.md`.

### R-050 Största grupp
Definition. Övningens största grupp är dess högsta antal spelare (R-007), med två undantag:
- En övning med grupptypen `fast-storlek` och en lösning för udda antal (R-008) får ha grupper som är en spelare större än övningens storlek.
- Om övningens ledarbehov är 1 eller 2 får en grupp inte ha fler spelare än taket per ledare gånger ledarbehovet.

Den största gruppen är det minsta av de värden som gäller.

### R-051 Antal grupper
Krav. För ett helgruppsmoment med N spelare är antalet grupper k det minsta heltal där ⌈N / k⌉ ≤ största grupp (R-050). Spelarna fördelas så att grupperna skiljer sig med högst en spelare.

*Testfall:* N = 14 och största grupp 8 ger k = 2, alltså grupper om 7 och 7. N = 13 ger 7 och 6.

### R-052 Ingen grupp för liten
Krav. Om någon grupp enligt R-051 blir mindre än övningens minsta antal spelare kan övningen inte användas i momentet.

*Testfall:* minst 6, högst 8 och N = 9 ger k = 2 med grupper om 5 och 4. Övningen kan inte användas.

### R-053 För få spelare
Krav. Om N är mindre än övningens minsta antal spelare kan övningen inte användas (berättelse 02, kriterium 5).

### R-054 Udda antal
Krav. Så hanteras en grupp med udda antal, beroende på grupptyp:

| Grupptyp | Udda antal i en grupp |
|---|---|
| `fri` | Ingen åtgärd. |
| `par` | En trio i stället för ett par. Passet visar det. |
| `tva-lag` | En spelare blir joker. Passet visar det. Om övningens `anpassning` beskriver en annan lösning visas den i stället. |
| `fast-storlek` | Grupper som är en spelare större är tillåtna bara om övningen har en lösning för udda antal (R-050). Annars kan övningen inte användas om spelarna inte går jämnt upp i grupper av övningens storlek. |

Bara en övning med grupptypen `fast-storlek` kan alltså väljas bort på grund av udda antal (berättelse 02, kriterium 7).

### R-055 Ledare för ett helgruppsmoment
Krav. Ett helgruppsmoment med k grupper behöver k × ledarbehov ledare. Det får inte vara fler än L. En övning med ledarbehov 0 kan köras i hur många grupper som helst med en ledare.

*Testfall:* L = 1 och en ledarstyrd övning som måste köras i 2 grupper: övningen kan inte användas. Samma övning med ledarbehov 0: övningen kan användas.

### R-056 Alla är med
Krav. I varje moment är summan av spelarna i alla grupper lika med N. Ingen spelare står utanför ett moment.

---

## Grupp 7: Ledare och stationer (R-060–R-067)

**Varför:** fler ledare ger mindre grupper och mer aktivitet. Stationer är ett bra sätt att använda flera ledare, men de tar tid att ställa i ordning och att rotera, och de kräver en vuxen per station för att fungera. Därför begränsas både antalet och var i passet de får förekomma.

### R-060 När stationer får användas
Krav. Ett stationsmoment får bara finnas om L ≥ 2, och bara i `del-ovning` eller `del-spelovning`. Med L = 1 har passet inga stationer (berättelse 02, kriterium 3).

### R-061 Antal stationer
Krav. Ett stationsmoment har S stationer, där 2 ≤ S ≤ 4 och S ≤ L (berättelse 02, kriterium 4).

### R-062 Stationernas övningar
Krav. Varje station har en egen övning. Alla S övningar är olika, uppfyller grundfiltret (grupp 3) och säkerhetsreglerna (grupp 9), är märkta med den del momentet ligger i (R-028) och uppfyller R-041.

### R-063 Grupper vid stationer
Krav. Spelarna delas i S grupper som skiljer sig med högst en spelare. Varje grupp ska för varje stationsövning vara minst övningens minsta antal och högst övningens största grupp (R-050). Ingen grupp får vara större än taket per ledare. Udda antal hanteras enligt R-054.

### R-064 Ledare vid stationer
Krav. Varje station har minst en egen ledare. Stationen behöver det största av 1 och övningens ledarbehov. Summan för alla stationer får inte vara större än L.

### R-065 Tid vid stationer
Krav. Alla grupper har samma tid t på varje station. t är ett heltal som är minst 5, högst fasens längsta tid för delen (R-034) och ligger inom varje stationsövnings kortaste och längsta tid. Momentets tid är S × t + (S − 1) minuter, eftersom varje byte tar 1 minut.

*Testfall:* S = 2 och t = 5 ger 11 minuter. S = 3 och t = 5 ger 17 minuter.

### R-066 Rotation
Krav. Varje grupp går igenom varje station exakt en gång. Alla spelare får alltså samma innehåll.

### R-067 Val mellan stationer och helgrupp
Algoritmval. När både ett stationsmoment och ett helgruppsmoment är giltiga och lika bra enligt R-048 får algoritmen välja vilket som används.

---

## Grupp 8: Variation (R-070–R-072)

**Varför:** inom ett pass ska varje övning ge något nytt. Mellan pass är det tvärtom. Barn och ungdomar lär sig genom att göra samma sak flera gånger, och en övning som gruppen redan kan kommer igång snabbare och ger mer aktiv tid. Därför finns ingen fotbollsfacklig regel som hindrar att samma övning återkommer i nästa pass.

### R-070 Samma övning bara en gång i ett pass
Krav. En övning (samma `id`) förekommer högst en gång i ett pass, i ett moment och en del. Att samma övning körs i flera grupper sida vid sida i ett moment räknas som en gång.

### R-071 Varianter är samma övning
Krav. Övningens lättare och svårare variant är inte egna övningar. R-070 gäller därför också för dem.

### R-072 Gränsen mellan fotbollsregler och algoritmval
Krav. Om algoritmen ger olika pass när samma underlag genereras flera gånger får den bara välja bland giltiga pass som är lika bra enligt R-048. Variation får aldrig ge ett sämre pass enligt R-048.

Mellan olika pass finns ingen begränsning. Samma övning och samma fokus får återkomma i pass efter varandra och i på varandra följande veckor i en säsongsplan (se `sasongsprogression.md`).

### Algoritmval som senior-systemutvecklare äger

Följande är inte fotbollsregler. Det avgörs av senior-systemutvecklare, så länge alla krav och R-048 följs:

- hur generatorn söker efter passet, och i vilken ordning delarna fylls
- hur generatorn väljer bland lika bra pass, till exempel slumpmässigt, och om upprepad generering ger olika pass (berättelse 02, *Utanför*)
- vilken tid en övning får inom sina gränser (R-034), så länge R-035 och R-036 följs
- om ett stationsmoment eller ett helgruppsmoment används när båda är lika bra (R-067)
- var vattenpauserna hamnar när flera placeringar är lika bra enligt R-037
- om generatorn i en framtida version tar hänsyn till tidigare pass. Det förutsätter en ny fotbollsregel här innan det byggs.

---

## Grupp 9: Säkerhet (R-080–R-085)

**Varför:** säkerhetsreglerna gäller alltid, även när det gör att färre övningar matchar. Nickreglerna följer SvFF, som skriver att nickning förs in i spelarutbildningsplanen först i spelformen 9 mot 9, från 13 år. Före det är spelformerna utformade så att bollen ska vara på marken. Källa: SvFF, *Får barn nicka?*, https://aktiva.svenskfotboll.se/nyheter/2023/05/nickning-for-barn/ (publicerad 2023-05-23, hämtad 2026-09-11). Det är strängare än mitt förslag i `aldrar-och-fokus.md`, där jag föreslog begränsad nickning för 10–12 år. Hur mycket nickning 13–19-åringar ska ha anger SvFF inte. Den mängden är min bedömning.

### R-080 Ingen nickträning före 13 år *(preliminär)*
Krav. Om åldern är under 13 kan `nickspel` inte väljas som fokus, och ingen övning som har `nickspel` bland sina fokusområden väljs.

### R-081 Nickövningar märks för rätt ålder *(preliminär)*
Krav. En övning som har `nickspel` bland sina fokusområden ska ha en minsta ålder på minst 13 (R-003).

### R-082 Begränsad mängd nickning *(preliminär)*
Krav. Sammanlagd tid för övningar som har `nickspel` bland sina fokusområden är högst 10 minuter per pass för `fas-13-14` och högst 20 minuter per pass för `fas-15-19`.

### R-083 Nickspel väljs tillsammans med ett annat fokus *(preliminär)*
Krav. `nickspel` kan bara väljas som fokus om ledaren också väljer minst ett annat fokusområde.

*Motivering:* utan den regeln kan R-041 och R-082 inte uppfyllas samtidigt, eftersom Öva och Spelövning tillsammans ofta är längre än nicktaket.

### R-084 Påminnelse om mål
Krav. Om någon övning i passet har mål i sitt `material` visar passet en påminnelse om att alla mål, även små, ska vara förankrade så att de inte kan välta (`spelformer.md`).

### R-085 Påminnelse om benskydd
Krav. Varje pass visar en påminnelse om benskydd, eftersom `del-spel` alltid innehåller närkamper (`spelformer.md`).

---

## Grupp 10: Tillgänglig yta *(preliminär)* (R-090–R-094)

**Varför:** ytan avgör i praktiken vilka övningar som går att genomföra. Många lag delar planen med andra och har en halv eller en kvarts plan. Ett spel 9 mot 9 får inte plats på en kvarts plan, och fyra smålagsspel sida vid sida kräver mer yta än ett. Om generatorn inte vet det kan den föreslå pass som inte går att genomföra. Min bedömning av frågan finns i rapporten till K1. Hela gruppen väntar på användarens beslut.

### R-090 Ledaren kan ange yta *(preliminär)*
Ledaren kan välja en av `yta-hel`, `yta-halv` och `yta-kvart`, eller låta bli. Om ledaren inte väljer någon yta används inget ytfilter.

### R-091 Ytornas mått *(preliminär)*
Krav. Ytorna har de här måtten, längd × bredd i meter:

| Nyckel | Namn | Mått |
|---|---|---|
| `yta-hel` | Hel plan för 11 mot 11 | 105 × 65 |
| `yta-halv` | Halv plan | 65 × 52 |
| `yta-kvart` | Kvarts plan | 52 × 32 |

105 × 65 är SvFF:s rekommenderade mått för 11 mot 11 (`spelformer.md`). Halv och kvarts plan är min avrundning nedåt. Med dessa mått får planen för 7 mot 7 (minst 50 × 30) plats på en kvarts plan och planen för 9 mot 9 (minst 65 × 50) på en halv plan.

### R-092 Momentet får plats *(preliminär)*
Krav. När en yta är vald kan ett moment bara användas om det får plats. Övningens yta per grupp är l × b meter för den valda spelformen. Ytan har måtten A × B.
- **En grupp:** gruppens yta får plats i någon riktning, alltså l ≤ A och b ≤ B, eller l ≤ B och b ≤ A.
- **Flera grupper eller stationer samtidigt:** varje grupp får 3 meters marginal, alltså (l + 3) × (b + 3). Varje grupp med marginal får plats i någon riktning, och summan av alla gruppers ytor med marginal är högst A × B.

Marginalen följer säkerhetsavståndet i `spelformer.md`.

*Testfall:* `yta-kvart` (52 × 32 = 1 664 m²) och två grupper med ytan 25 × 20 m: (28 × 23) × 2 = 1 288 m², och 28 × 23 får plats. Momentet kan användas. Tre grupper: 1 932 m². Momentet kan inte användas.

### R-093 Övning utan yta *(preliminär)*
Krav. När en yta är vald kan en övning som saknar yta inte användas.

### R-094 Ytan gäller ett moment i taget *(preliminär)*
Krav. Ytkontrollen görs för varje moment för sig, eftersom momenten görs efter varandra och kan använda samma yta.

---

## Grupp 11: När för få övningar matchar, och byte av övning (R-100–R-105)

**Varför:** ledaren ska alltid förstå vad som hände och själv bestämma vad som ska ändras (berättelse 03). Generatorn byter aldrig ledarens val i tysthet och fyller inte ut en tom del med något som inte passar. Vid byte av övning (berättelse 04) ska den nya övningen passa lika bra på samma plats som den gamla.

### R-100 En del som saknar övning
Krav. En del som fylls från banken, och som inte har tagits bort enligt R-033, saknar övning om inget giltigt pass har ett moment i den delen. En sådan del visas i passet med sitt namn, sin måltid och texten att övning saknas. Delens tid läggs inte på andra delar (R-039).

### R-101 När inget pass skapas
Krav. Om ingen av delarna `del-ovning`, `del-spelovning` och `del-spel` kan fyllas, bland dem som finns kvar efter R-033, skapas inget pass. Appen visar i stället att inget pass kunde skapas (berättelse 03, kriterium 1).

*Motivering:* ett pass med bara uppvärmning är inget träningspass. Ett pass där bara spelet finns går däremot att använda.

### R-102 Underlaget ändras aldrig av generatorn
Krav. Generatorn ändrar aldrig ålder, spelform, nivå, fokus, antal spelare, antal ledare, passlängd eller yta för att hitta fler övningar. Det gäller också R-026.

### R-103 Vilka val som kan ändras
Krav. För varje del som saknar övning visar appen vilka av ledarens val som, var för sig, skulle kunna ge en övning i delen. Ett val visas om det finns ett annat tillåtet värde för just det valet, med alla andra val oförändrade, som gör att det finns minst ett giltigt moment för delen. Valen som prövas är nivå, fokusområden, antal spelare, antal ledare, spelform och, om det är valt, yta. För fokusområden prövas varje enskilt fokusområde som är tillåtet för fasen. Appen visar vilka val det gäller, inte vilka värden (berättelse 03, *Utanför*).

### R-104 Vilka övningar som kan ersätta en övning
Krav. En övning X i ett moment kan ersättas med en övning Y om
1. Y uppfyller grundfiltret (grupp 3), säkerhetsreglerna (grupp 9) och, om yta är vald, ytreglerna (grupp 10),
2. Y är märkt med samma del som X ligger i,
3. Y uppfyller R-041 om delen är `del-ovning` eller `del-spelovning`,
4. Y kan användas med momentets spelare och ledare enligt grupp 6. I ett stationsmoment ska Y dessutom passa stationens grupper (R-063), stationstiden t (R-065) och ledarna (R-064),
5. Y inte redan finns någon annanstans i passet (R-070).

Prioriteterna i R-048 används inte vid byte. Ledaren väljer själv bland alla övningar som uppfyller villkoren. Om ingen övning uppfyller dem ligger X kvar (berättelse 04, kriterium 3).

### R-105 Tid efter byte
Krav. Y får den tid inom sina gränser (R-034) som ligger närmast X:s tid. Om två tider ligger lika nära väljs den kortare. I ett stationsmoment får Y stationstiden t. R-035 och R-036 kontrolleras inte efter ett byte, men passet visar den nya totala tiden (berättelse 04, kriterium 5).

---

## Grupp 12: Säsongsplan (R-110–R-113)

**Varför:** säsongsplanen ska visa hur träningen byggs upp över tid (berättelse 23–25). Principerna för progressionen finns i `sasongsprogression.md`. I version 1 föreslår appen inte vilka pass som ska ligga på vilken vecka (berättelse 24, *Utanför*). Reglerna här gäller därför bara hur planen visas och kontrolleras.

### R-110 Veckans fokus
Krav. En veckas fokus är alla fokusområden som ledaren valde för de pass som ligger på veckan, utan dubletter, i den ordning de först förekommer. Passen räknas i datumordning. Veckans fokus visas i planen och i översikten (berättelse 24, kriterium 2, och 25, kriterium 1).

### R-111 Upprepning är tillåten
Krav. Appen varnar inte och hindrar inte att samma pass, övning eller fokus förekommer i flera veckor. Se R-072.

### R-112 Fokus som inte har förekommit på länge *(preliminär)*
Ett kärnområde (K) för lagets fas räknas som att det inte har förekommit på länge om det inte finns bland veckans fokus (R-110) under någon av de 8 senaste veckorna som har minst ett pass. Veckor utan pass räknas inte. Appen kan då visa ett tips.

*Preliminär eftersom funktionen är Could i backlogen. Talet 8 är min bedömning: det motsvarar ungefär två block om 3–4 veckor.*

### R-113 Åldern i en säsongsplan som passerar ett årsskifte *(preliminär)*
Krav. Om säsongsplanen sträcker sig över ett årsskifte räknas åldern för veckor i det nya kalenderåret som ett år högre. Fasen kan då ändras, och pass som genereras för de veckorna använder den nya åldern.

*Preliminär eftersom den bygger på R-010.*

---

## Sammanställning

| Grupp | Regler | Antal | Varav preliminära |
|---|---|---|---|
| 1 Övningens data | R-001–R-009 | 9 | 0 |
| 2 Underlaget | R-010–R-021 | 12 | 2 (R-010, R-021) |
| 3 Vilka övningar, nivå | R-022–R-029 | 8 | 0 |
| 4 Delar och tid | R-030–R-039 | 10 | 0 |
| 5 Fokusområden | R-040–R-048 | 9 | 0 |
| 6 Grupper och udda antal | R-050–R-056 | 7 | 0 |
| 7 Ledare och stationer | R-060–R-067 | 8 | 0 |
| 8 Variation | R-070–R-072 | 3 | 0 |
| 9 Säkerhet | R-080–R-085 | 6 | 4 (R-080–R-083) |
| 10 Yta | R-090–R-094 | 5 | 5 |
| 11 Inget matchande, byte | R-100–R-105 | 6 | 0 |
| 12 Säsongsplan | R-110–R-113 | 4 | 2 (R-112, R-113) |
| **Summa** | | **87** | **13** |
