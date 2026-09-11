Status: utkast

# Fokusområden

**Ägare:** fotbollsexpert

Fokusområden är det ledaren väljer när frågan är "vad ska vi träna i dag?" (berättelse 01). Samma lista används för att tagga övningar i fältet `fokusomraden` (`content/ovningar/README.md`). Generatorn väljer övningar efter de valda fokusområdena. Övningarna i passets kärna, Öva och Spelövning, har alltid minst ett av dem (berättelse 02, kriterium 10). Exakt hur det går till står i `generatorregler.md`, grupp 5 (R-040 till R-049).

Indelningen är mitt eget förslag. Den bygger på principerna i SvFF:s spelarutbildningsplan och FSLL, där lek, bollkänsla och spelförståelse ska anpassas efter ålder. Uppdelningen i anfall, försvar och omställningar är allmänt fotbollsspråk och är inte hämtad från någon SvFF-text. Åldrarnas betydelse beskrivs i `aldrar-och-fokus.md`, och där står också vad jag har kunnat verifiera i källorna och vad som är min bedömning.

## Hur listan är byggd

- **17 fokusområden i 5 grupper.** Grupperna gör listan lätt att överblicka på mobilen. Regelmotorn använder bara fokusområdenas nycklar, inte gruppernas.
- **Stabila nycklar.** Nycklarna består av små bokstäver utan å, ä och ö, med bindestreck mellan orden. De ändras aldrig. Namnet som visas för ledaren kan ändras.
- **Ett fokusområde beskriver innehåll, inte passdel.** Uppvärmning, Öva, Spelövning, Spel och Avslutning är delar av passet. De definieras i `passuppbyggnad.md` och ska inte användas som fokusområden. Undantaget är `lek`, som både är ett innehåll och ofta förekommer i uppvärmningen.
- **Mentala och sociala mål är inga egna fokusområden.** Glädje, samarbete, fair play och att alla får vara med ska finnas i alla pass. De styrs av hur ledaren leder övningen och av passuppbyggnaden, inte av ett val i listan.

## Fokusområdena

### Grupp: Bollen och tekniken (`grupp-teknik`)

| Nyckel | Namn | Beskrivning |
|---|---|---|
| `bollkansla` | Bollkänsla | Många bollkontakter med egen boll: driva, stoppa, dra, vända, jonglera, med båda fötterna och olika delar av foten. Målet är att bollen ska lyda. |
| `dribbling` | Dribbling och driva bollen | Föra bollen med kontroll i olika fart, finta, vända och ta sig förbi en motståndare eller in i en fri yta. |
| `passning-mottagning` | Passning och mottagning | Passa med rätt kraft och riktning och ta emot bollen så att nästa handling blir lätt (första touchen). Både korta och, i äldre åldrar, längre passningar. |
| `avslut` | Avslut | Skjuta och göra mål, från olika vinklar och avstånd, med båda fötterna. I äldre åldrar också avslut efter inlägg. |
| `nickspel` | Nickspel | Nicka bollen i anfall och försvar: teknik, tajming och att våga. Bara från 13 år och i begränsad mängd, se nedan. |

### Grupp: Spelet (`grupp-spel`)

| Nyckel | Namn | Beskrivning |
|---|---|---|
| `ett-mot-ett` | 1 mot 1 | Anfalla och försvara ensam mot en motståndare: utmana och ta sig förbi, eller ta bollen och stoppa en anfallare. Grunden i allt spel. |
| `spelbarhet` | Spela tillsammans | Samarbeta med bollen i små grupper: göra sig spelbar, spela väggspel, hålla bollen inom laget och sprida ut sig på bredden och djupet. |
| `speluppbyggnad` | Speluppbyggnad | Spela ut bollen från målvakten och egen planhalva och vidare framåt genom lagdelarna. Hänger ihop med retreatlinjen i 5 mot 5 och 7 mot 7. |
| `forsvarsspel` | Försvarsspel | Försvara tillsammans: pressa bollhållaren, täcka för varandra, stänga ytor och vinna bollen som lag. Försvar mot en enskild anfallare finns under `ett-mot-ett`. |
| `omstallning` | Omställning | Reagera direkt när bollen byter lag: anfalla snabbt när bollen vinns (kontring) och försvara direkt när den tappas. |
| `fasta-situationer` | Fasta situationer | Hörnor, frisparkar, inkast, inspark och avspark, i anfall och försvar. |

### Grupp: Målvakt (`grupp-malvakt`)

| Nyckel | Namn | Beskrivning |
|---|---|---|
| `malvaktsspel` | Målvaktsspel | Grundställning, fånga, falla, positionering, utkast och spel med fötterna. Övningar med detta fokus är till för målvakter eller för att alla ska få prova på målvaktsrollen. |

### Grupp: Kropp och rörelse (`grupp-fysik`)

| Nyckel | Namn | Beskrivning |
|---|---|---|
| `koordination` | Rörelse och koordination | Springa, hoppa, landa, balansera, ändra riktning och samordna kroppen, gärna med boll. |
| `snabbhet` | Snabbhet | Reaktion, snabba starter, korta rusher och snabba riktningsändringar, helst med boll och med tävlingsmoment. |
| `uthallighet` | Uthållighet | Orka hålla högt tempo länge, tränat i fotbollsform med boll, till exempel i intensiva smålagsspel med vila emellan. |
| `skadeforebyggande` | Skadeförebyggande | Övningar för knä, fotled och bål som minskar skaderisken, oftast som en del av uppvärmningen. SvFF rekommenderar FIFA 11+ Kids för 7–14 år och FIFA 11+ och Knäkontroll för äldre (källan finns i `passuppbyggnad.md`). |

### Grupp: Lek (`grupp-lek`)

| Nyckel | Namn | Beskrivning |
|---|---|---|
| `lek` | Lek | Lekar med och utan boll där glädjen och rörelsen står i centrum. Används mest för de yngsta, men fungerar i alla åldrar som uppvärmning eller avslutning. |

## Vilka fokusområden som gäller för vilka åldrar

Kolumnerna är åldersfaserna från `aldrar-och-fokus.md`.

- **K** betyder kärnområde. Det är centralt för åldern och bör förekomma ofta.
- **R** betyder relevant. Det passar åldern och får väljas.
- **–** betyder inte aktuellt. Fokusområdet ska inte erbjudas för åldern, och övningar för åldern ska inte taggas med det.

| Nyckel | `fas-6-7` | `fas-8-9` | `fas-10-12` | `fas-13-14` | `fas-15-19` |
|---|---|---|---|---|---|
| `bollkansla` | K | K | R | R | R |
| `dribbling` | K | K | K | R | R |
| `passning-mottagning` | R | K | K | K | K |
| `avslut` | K | K | K | K | K |
| `nickspel` | – | – | – | R | R |
| `ett-mot-ett` | K | K | K | R | R |
| `spelbarhet` | R | K | K | K | K |
| `speluppbyggnad` | – | R | K | K | K |
| `forsvarsspel` | – | R | K | K | K |
| `omstallning` | – | R | K | K | K |
| `fasta-situationer` | – | – | R | K | K |
| `malvaktsspel` | – | R | R | R | R |
| `koordination` | K | K | K | R | R |
| `snabbhet` | R | R | R | R | R |
| `uthallighet` | – | – | – | R | R |
| `skadeforebyggande` | – | R | R | K | K |
| `lek` | K | K | R | R | R |

### Varför tabellen ser ut så här

Allt nedan är min bedömning, grundad i `aldrar-och-fokus.md` och i spelformernas regler i `spelformer.md`, utom raden för `nickspel`, som följer SvFF och användarens beslut.

- **6–7 år:** 3 mot 3 har ingen målvakt och alla fasta situationer börjar med driv eller pass längs marken. Därför är `malvaktsspel` och `fasta-situationer` inte aktuella. Försvar handlar om att själv ta tillbaka bollen, vilket ryms i `ett-mot-ett`. Lagförsvar, speluppbyggnad och omställning är för abstrakt för åldern. `skadeforebyggande` är inte aktuellt som eget fokus, eftersom fasen också har 6-åringar och SvFF:s program för barn (FIFA 11+ Kids) är avsett från 7 år. Samma grund byggs med `lek` och `koordination`.
- **8–9 år:** målvakten och retreatlinjen införs i 5 mot 5. Därför blir `malvaktsspel` och `speluppbyggnad` relevanta, i enkel form. Fasta situationer är fortfarande bara driv eller pass längs marken och behöver inte egen träning. `skadeforebyggande` är relevant, eftersom SvFF rekommenderar FIFA 11+ Kids från 7 år. För den här åldern ska det göras lekfullt i uppvärmningen.
- **10–12 år:** 7 mot 7 har straffområde, frisparkar och retreatlinje, och målvakten får inte sparka ut bollen ur händerna. Spelförståelsen i grupp blir kärnan. `skadeforebyggande` fortsätter som förberedelse, främst landningsteknik och kroppskontroll.
- **13–19 år:** offside, inspark och den större planen gör lagspel och fasta situationer centrala. `uthallighet` får tränas i fotbollsform. `skadeforebyggande` blir kärnområde under och efter tillväxtspurten.
- **`snabbhet`** är relevant i alla åldrar, men för barn bara i lek- och tävlingsform med boll.
- **`nickspel`** följer SvFF: nickning förs in först i 9 mot 9, från 13 år. Därför är det "–" till och med 12 år, alltså för `fas-6-7`, `fas-8-9` och `fas-10-12`. Från 13 år gäller ett tak för hur många minuter per pass som får vara nickträning: 10 minuter för 13–14 år och 20 minuter för 15–19 år. Användaren beslutade detta 2026-09-11 (`docs/krav/kravspec.md`, *Beslut vid K1*, punkt 2, och R-080 till R-083). Källan finns i avsnittet *Nickning* i `aldrar-och-fokus.md`.

## Hur övningar taggas

Reglerna med ID står i `generatorregler.md` (R-002 och R-027).

1. En övning har **ett till tre** fokusområden. Det första i listan är övningens huvudfokus.
2. En övning får bara taggas med fokusområden som är **K eller R för hela övningens åldersspann**. En övning för 8–12 år får alltså inte taggas med `fasta-situationer`, eftersom det är "–" för 8–9 år. Det betyder också att en övning med `nickspel` måste ha 13 år som lägsta ålder (R-081). Omvänt ska en övning där spelarna nickar som en planerad del alltid taggas med `nickspel`, även om nickning inte är huvudfokus (R-081).
3. Taggen ska beskriva vad spelarna **faktiskt övar mest** i övningen, inte allt som kan hända i den. Ett smålagsspel 4 mot 4 med kantzoner taggas `spelbarhet`, inte `avslut`, även om det görs mål. Undantaget är planerad nickning, som alltid taggas av säkerhetsskäl (punkt 2).
4. Övningens `syfte` ska tydligt höra ihop med huvudfokus. Det kontrollerar jag när jag granskar övningar.

## Hur listan visas för ledaren

Regeln är R-019: ledaren kan bara välja fokusområden som är K eller R för fasen. Förslag till produktägaren och UX-designern:

- Visa bara fokusområden som är K eller R för den ålder ledaren har angett. Ett fokusområde som är "–" för åldern kan inte ge några övningar (se punkt 2 ovan) och skulle bara leda till "inget matchande resultat" (berättelse 03).
- Kärnområdena kan lyftas fram, till exempel överst i varje grupp, så att en ovan ledare får hjälp att välja.
- Visa grupperna som rubriker, så att listan med 17 områden blir lätt att överblicka.

Berättelse 01, kriterium 9, följer R-019: listan visar bara fokusområden som är K eller R för åldern (beslut 2026-09-11, `docs/krav/kravspec.md`, *Beslut vid K1*, punkt 7).
