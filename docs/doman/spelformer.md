Status: godkänd (K1, 2026-09-11)

# Spelformer

**Ägare:** fotbollsexpert

Den här filen beskriver SvFF:s nationella spelformer för barn- och ungdomsfotboll. Den ska användas när appen föreslår en spelform utifrån ålder (berättelse 01), när övningar taggas med spelformer och när planskisser ritar matchlika ytor. När filen har godkänts vid K1 ersätter den tabellen i `CLAUDE.md`.

Alla siffror är kontrollerade mot SvFF:s egna dokument. Texten är min egen sammanfattning, inte en kopia.

## Källor

| Källa | Adress | Hämtad |
|---|---|---|
| SvFF, Nationella spelformer 3 mot 3, 6–7 år (fil `3mot3-2025.pdf`) | https://aktiva.svenskfotboll.se/4916b5/globalassets/svff/dokumentdokumentblock/nationella-spelformer/3mot3-2025.pdf | 2026-09-11 |
| SvFF, Nationella spelformer 5 mot 5, 8–9 år (fil `5mot5-2025.pdf`) | https://aktiva.svenskfotboll.se/4916e2/globalassets/svff/dokumentdokumentblock/nationella-spelformer/5mot5-2025.pdf | 2026-09-11 |
| SvFF, Nationella spelformer 7 mot 7, 10–12 år (fil `7mot7-2025.pdf`) | https://aktiva.svenskfotboll.se/4916ed/globalassets/svff/dokumentdokumentblock/nationella-spelformer/7mot7-2025.pdf | 2026-09-11 |
| SvFF, Nationella spelformer 9 mot 9, 13–14 år (fil `9mot9-2025.pdf`) | https://aktiva.svenskfotboll.se/4916ff/globalassets/svff/dokumentdokumentblock/nationella-spelformer/9mot9-2025.pdf | 2026-09-11 |
| SvFF, Nationella spelformer 11 mot 11, 15+ år (fil `11mot11-2025.pdf`) | https://aktiva.svenskfotboll.se/491712/globalassets/svff/dokumentdokumentblock/nationella-spelformer/11mot11-2025.pdf | 2026-09-11 |
| SvFF, Planstorlekar för barn- och ungdomsfotboll (fil `planstorlekar_barn_och_ungdom_2025.pdf`) | https://aktiva.svenskfotboll.se/49175e/globalassets/svff/dokumentdokumentblock/nationella-spelformer/planstorlekar_barn_och_ungdom_2025.pdf | 2026-09-11 |
| SvFF, Fotbollens nationella spelformer (översiktssida med länkar till bladen ovan) | https://aktiva.svenskfotboll.se/tranare/spelformer/ | 2026-09-11 |

Bladen anger inget eget datum i texten. Att de är 2025 års versioner framgår bara av filnamnen.

## Spelformer i översikt

Nyckeln i första kolumnen är den som övningar och regelmotorn använder, till exempel i fältet `spelformer` i en övning.

| Nyckel | Spelform | Ålder | Spelare per lag på planen | Plan (m), min–max | Mål (m) | Boll | Matchtid |
|---|---|---|---|---|---|---|---|
| `3mot3` | 3 mot 3 | 6–7 | 3, ingen målvakt | 15 × 10–12 | högst 1,6 × 1,15 (1,5 × 1 rekommenderas) | storlek 3 | 4 × 3 min |
| `5mot5` | 5 mot 5 | 8–9 | 4 utespelare + målvakt | 30 × 15–20 | 3 × 1,5 | storlek 3 | 3 × 10 min vid sammandrag, 3 × 15 min vid enskild match |
| `7mot7` | 7 mot 7 | 10–12 | 6 utespelare + målvakt | 50–55 × 30–35 | högst 5 × 2 | storlek 4 | 3 × 15 min vid sammandrag, 3 × 20 min vid enskild match |
| `9mot9` | 9 mot 9 | 13–14 | 8 utespelare + målvakt | 65–72 × 50–55 | 6 × 2,2 | storlek 4 för 13 år, storlek 5 för 14 år | 3 × 25 min |
| `11mot11` | 11 mot 11 | 15–19 | 10 utespelare + målvakt | 100–110 × 60–68 | 7,32 × 2,44 | storlek 5 | 2 × 40 min för 15 år, 2 × 45 min från 16 år |

Planmåtten skrivs som längd × bredd.

## Varje spelform i detalj

### 3 mot 3 (6–7 år), nyckel `3mot3`

- **Plan:** 15 × 10–12 m. SvFF rekommenderar sarg runt planen, så att bollen stannar i spel.
- **Mål:** högst 1,6 × 1,15 m. SvFF rekommenderar 1,5 × 1 m.
- **Boll:** storlek 3, 280–310 gram.
- **Spelare:** 3 per lag på planen, ingen målvakt. SvFF rekommenderar 3 avbytare per lag.
- **Matchtid:** 4 perioder à 3 minuter. Spelas som sammandrag med 2–4 matcher. Alla ska få lika mycket speltid.
- **Byten:** fria byten, helst i pauserna.
- **Fasta situationer:** alla börjar med att spelaren driver eller passar bollen längs marken. Man får inte göra mål direkt på en fast situation. Motståndarna ska stå minst 3 meter från bollen.
- **Kort:** inga gula eller röda kort. Tränaren byter ut en spelare som beter sig olämpligt eller spelar vårdslöst.
- **Linjering:** vit, enligt planstorleksdokumentet.

### 5 mot 5 (8–9 år), nyckel `5mot5`

- **Plan:** 30 × 15–20 m. Med 30 × 20 m ryms 8 planer på en fullstor plan.
- **Mål:** 3 × 1,5 m. Vissa distrikt tillåter 3 × 2 m om mindre mål saknas.
- **Boll:** storlek 3, 280–310 gram.
- **Spelare:** 4 utespelare och 1 målvakt per lag. SvFF rekommenderar 4 avbytare per lag.
- **Matchtid:** 3 × 10 minuter vid sammandrag (2–4 matcher), 3 × 15 minuter vid enskild match. Alla ska få lika mycket speltid.
- **Byten:** fria byten, helst i pauserna.
- **Fasta situationer:** börjar med att spelaren driver eller passar längs marken. Inget direkt mål. Motståndarna ska stå minst 5 meter från bollen.
- **Retreatlinje:** när målvakten kastar ut bollen, eller fångar den i spel, går motståndarna tillbaka till sin egen planhalva. De stannar där tills bollen har lämnat målvaktens händer.
- **Straffområde:** finns inte. Målvakten får ta bollen med händerna ungefär 5 meter ut från stolparna. Ingen straffspark.
- **Kort:** inga. Tränaren byter ut en spelare som beter sig olämpligt eller spelar vårdslöst.
- **Linjering:** röd.

### 7 mot 7 (10–12 år), nyckel `7mot7`

- **Plan:** 50–55 × 30–35 m. Med minsta mått ryms 4 planer på en fullstor plan, med största mått 2 planer.
- **Straffområde:** 19 × 7 m, med straffpunkt.
- **Retreatlinje:** en linje 7 meter från mittlinjen på vardera planhalva. Den markeras gärna streckad eller med koner utanför planen.
- **Mål:** högst 5 × 2 m.
- **Boll:** storlek 4, 350–390 gram.
- **Spelare:** 6 utespelare och 1 målvakt per lag. SvFF rekommenderar 3 avbytare per lag.
- **Matchtid:** 3 × 20 minuter vid enskild match, 3 × 15 minuter vid sammandrag. Alla ska spela minst två av tre perioder.
- **Byten:** fria byten, helst i pauserna.
- **Retreatlinjen i spel:** när målvakten kastar ut bollen, eller fångar den i spel, backar motståndarna till retreatlinjen och stannar där tills bollen har lämnat målvaktens händer. Målvakten får lägga ner bollen och passa ut den, men får inte sparka ut den ur händerna (inga utsparkar eller volleysparkar).
- **Frisparkar:** alla spelare ska vara minst 2 meter från motståndarnas målvakt.
- **Kort:** används vid avsiktligt vårdslöst eller farligt spel och vid olämpligt uppträdande. Om det inte var avsiktligt pratar domaren med spelaren i stället.
- **Linjering:** gul.

### 9 mot 9 (13–14 år), nyckel `9mot9`

- **Plan:** 65–72 × 50–55 m. Med minsta mått ryms 2 planer på en fullstor plan, med största mått 1.
- **Straffområde:** 24 × 9 m, med straffpunkt.
- **Mål:** 6 × 2,2 m. Vissa distrikt tillåter mål för 7 mot 7 eller 11 mot 11 om 9 mot 9-mål saknas.
- **Boll:** storlek 4 (350–390 gram) för 13-åringar och storlek 5 (410–450 gram) för 14-åringar.
- **Spelare:** 8 utespelare och 1 målvakt per lag. SvFF rekommenderar 4 avbytare per lag.
- **Matchtid:** 3 × 25 minuter. Alla ska spela minst två av tre perioder.
- **Byten:** fria byten. SvFF rekommenderar byten i pauserna.
- **Regler:** i stort sett samma som i 11 mot 11 för vuxna, utom planens storlek, antalet spelare och matchtiden.
- **Offside:** gäller från den här spelformen.
- **Inspark:** bollen ligger still någonstans i straffområdet och är i spel när den har sparkats och tydligt rört sig. Motståndarna står minst 9 meter bort.
- **Linjering:** blå.

### 11 mot 11 (15–19 år), nyckel `11mot11`

- **Plan:** 100–110 × 60–68 m. SvFF rekommenderar 105 × 65 m.
- **Straffområde:** 40,32 × 16,5 m.
- **Mål:** 7,32 × 2,44 m.
- **Boll:** storlek 5, 410–450 gram.
- **Spelare:** 10 utespelare och 1 målvakt per lag. SvFF rekommenderar 3–5 avbytare per lag.
- **Matchtid:** 2 × 40 minuter för 15-åringar, 2 × 45 minuter från 16 år. Alla ska spela minst halva matchtiden.
- **Byten:** fria byten. En utbytt spelare får komma in igen. Utespelare får bytas under pågående spel, målvakten bara vid avbrott.
- **Regler:** i stort sett samma som för vuxna, utom matchtiden för 15-åringar. Offside gäller.
- **Linjering:** vit.

## Gäller alla spelformer

- **Utrustning:** tröja, byxor, strumpor, skor och benskydd. Enhetliga matchkläder rekommenderas. *Min bedömning:* benskydd bör användas även på träning när övningen innehåller närkamper. Varje pass påminner om det (R-085).
- **Mål som kan välta:** alla mål, även flyttbara, ska vara säkert förankrade så att de inte välter, till exempel med tyngder. Det här är den viktigaste säkerhetsregeln i SvFF:s planstorleksdokument och gäller i högsta grad på träning, där små mål flyttas runt ofta. Ett pass med mål i någon övning påminner om det (R-084).
- **Säkerhetsavstånd runt planen:** SvFF rekommenderar 3 meter fritt från sid- och kortlinjer till fasta eller flyttbara föremål när nya planer byggs. *Min bedömning:* samma tanke bör gälla när ledaren lägger ut övningsytor bredvid varandra. Ytor ska inte gränsa direkt mot staket, mål eller andra gruppers ytor. Generatorn använder 3 meter mellan ytor när ledaren har valt yta (R-092).

## Spelform föreslagen utifrån ålder

Berättelse 01 kräver att appen föreslår en spelform utifrån åldern. Så här ser kopplingen ut enligt SvFF:

| Ålder | Föreslagen spelform |
|---|---|
| 6 eller 7 | `3mot3` |
| 8 eller 9 | `5mot5` |
| 10, 11 eller 12 | `7mot7` |
| 13 eller 14 | `9mot9` |
| 15–19 | `11mot11` |
| Under 6 eller över 19 | Stöds inte i appen (berättelse 01, kriterium 3) |

Reglerna som regelmotorn följer står i `generatorregler.md`: R-011 (giltig ålder), R-012 (fas från ålder), R-013 (föreslagen spelform), R-014 (vilka spelformer ledaren kan välja) och R-015 (fasen styrs av åldern, inte av spelformen).

### Hur åldern räknas

Frågan är avgjord. Användaren beslutade 2026-09-11 hur åldern räknas (`docs/krav/kravspec.md`, *Beslut vid K1*, punkt 6). Regeln är R-010 i `generatorregler.md`.

1. **Vilken ålder avses?** Den ålder spelarna fyller under det aktuella kalenderåret. Det stämmer med hur svensk barn- och ungdomsfotboll i praktiken delar in lagen, efter födelseår. De spelformsblad jag har läst säger inte uttryckligen hur åldern räknas, så den kopplingen är min bedömning och inte hämtad ur källan. Beslutet gäller oavsett.
2. **Grupper med flera åldrar.** Ledaren anger den ålder som flest i gruppen har. Om två åldrar är lika vanliga anger ledaren den lägre (R-010). Övningarna väljs efter den åldern. Om gruppen spelar match i en annan spelform kan ledaren välja den, men bara spelformen närmast före eller efter den föreslagna (R-014, berättelse 01, kriterium 2).
3. **Över ett årsskifte.** I en säsongsplan som passerar ett årsskifte blir åldern ett år högre för veckorna i det nya året (R-113).
4. **11 mot 11 uppåt.** Spelformsbladet för 11 mot 11 skriver "15+ år", medan planstorleksdokumentet skriver "15–19 år". För appen, som slutar vid 19 år, spelar skillnaden ingen roll.

## Vad spelformen betyder på träning

Spelformen styr matchen. På träningen styr den tre saker i appen:

1. **Matchlika ytor och mål.** När en övning är ett spel som liknar matchen ska planmåttet och målstorleken utgå från spelformen i tabellen ovan. Planskisserna ska rita efter samma mått.
2. **Vad som är matchlikt.** Det finns regler som bara gäller i vissa spelformer, och de bör finnas med i träningen när laget spelar den spelformen:
   - `3mot3` och `5mot5`: fasta situationer börjar med driv eller pass längs marken, inte med skott.
   - `5mot5` och `7mot7`: retreatlinjen ger målvakten och laget tid att spela ut bollen. Därför är speluppbyggnad från målvakten ett naturligt träningsinnehåll.
   - `7mot7`: målvakten får inte sparka ut bollen ur händerna, utan lägger ner den och passar.
   - `9mot9` och `11mot11`: offside och inspark gäller.
3. **Mindre spel är ofta bättre.** *Min bedömning:* matchens spelform är inte den enda formen på träningen. Spel med färre spelare, som 1 mot 1 upp till 4 mot 4, ger fler bollkontakter och fler beslut per spelare i alla åldrar. En övning kan därför passa flera spelformer. Fältet `spelformer` i en övning anger vilka spelformer övningen är relevant för, inte att övningen måste spelas med spelformens antal spelare.

*Min bedömning om planmått:* i början av säsongen, eller när laget är nytt i spelformen, fungerar de mindre planmåtten bäst. De större måtten passar när laget har vant sig. Det ger en naturlig progression inom varje spelform.

## Avvikelser mot tabellen i CLAUDE.md

Kontrollen gjordes 2026-09-11 mot spelformsbladen och planstorleksdokumentet ovan.

- **Inga avvikelser i sak.** Ålder, planmått, antal spelare och målstorlek i `CLAUDE.md` stämmer med källorna.
- **7 mot 7, mål:** `CLAUDE.md` och spelformsbladet skriver "max 5 × 2 m". Planstorleksdokumentet skriver "5 × 2 m" utan "max". Det är en liten skillnad mellan två SvFF-dokument, inte ett fel i `CLAUDE.md`. Den här filen följer spelformsbladet.
- **11 mot 11, ålder:** se punkt 4 under *Hur åldern räknas*. `CLAUDE.md` följer planstorleksdokumentet.
- **Tillägg som saknas i CLAUDE.md:** matchtid, boll, retreatlinje, straffområden, rekommenderade målstorlekar och de undantag som vissa distrikt tillåter. De finns nu i den här filen.
