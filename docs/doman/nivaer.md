Status: godkänd (K1, 2026-09-11)

# Nivåer

**Ägare:** fotbollsexpert

Ledaren väljer en nivå när ett pass genereras (berättelse 01), och generatorn väljer bara övningar som är taggade för den nivån (berättelse 02, kriterium 9). Den här filen föreslår nivåerna och beskriver hur ledaren känner igen dem.

Indelningen är mitt förslag som tränarutbildare. SvFF:s nationella spelformer och spelarutbildningsplanen utgår från ålder och innehåller, så vitt jag har kunnat se, ingen nivåindelning av träningsgrupper som appen kan ta över. Användaren beslutade 2026-09-11 att använda de tre nivåerna nedan, med strikt nivåmatchning (`docs/krav/kravspec.md`, *Beslut vid K1*, punkt 5, och R-025, R-026).

## Tre nivåer

| Nyckel | Namn | Kort beskrivning |
|---|---|---|
| `niva-1` | Grund | Gruppen behöver enkla övningar och tid med bollen för att få grunderna att sitta |
| `niva-2` | Fortsättning | Gruppen klarar grunderna och är redo att använda dem i spel med motståndare |
| `niva-3` | Fördjupning | Gruppen klarar grunderna under press och behöver mer tempo, fler val och svårare uppgifter |

Nycklarna `niva-1`, `niva-2` och `niva-3` är stabila och används av regelmotorn och i övningarnas fält för nivå. Namnen visas för ledaren och kan ändras utan att nycklarna ändras.

Tre nivåer räcker. Med fler nivåer blir skillnaderna för små för att en ledare ska kunna välja säkert, och övningsbanken behöver fler övningar för att täcka varje kombination av ålder, nivå och fokusområde. Finjustering sker i stället med övningens lättare och svårare variant (fältet `varianter` i `content/ovningar/README.md`).

## Nivån är relativ till åldern

Samma nivå betyder olika saker i olika åldrar. En 7-åring på `niva-3` gör inte samma saker som en 16-åring på `niva-3`. Nivån beskriver hur gruppen klarar det som är rimligt att kräva **i den ålder och spelform de spelar**. Därför fungerar kriterierna nedan i alla åldrar: de beskriver vad ledaren ser när gruppen spelar sin egen spelform, inte fasta färdigheter.

Konsekvensen för banken är att en övning taggas med både ålder och nivå. Åldern avgör vad som alls är lämpligt, och nivån avgör hur svårt det ska vara inom åldern.

## Så känner du igen nivån

Titta på gruppen när den spelar match eller smålagsspel i sin spelform. Välj den nivå som stämmer för ungefär två av tre spelare.

### Nivå 1, Grund (`niva-1`)

Du känner igen gruppen på att:

- **Bollen:** många tappar bollen när de försöker ta emot eller stoppa den. Bollen studsar iväg vid första touchen.
- **Passningar:** passningarna hamnar ofta fel eller blir för hårda eller för lösa. Få passningar går fram i följd.
- **Spelet:** spelarna samlas runt bollen. Få söker sig till en fri yta av sig själva.
- **Övningar:** gruppen behöver se övningen visas, ofta mer än en gång, innan den kommer igång. Övningar med flera moment i följd blir röriga.
- **Motståndare:** när en motståndare kommer nära blir det svårt att behålla bollen eller göra något med den.

Typiska grupper: nybörjare i alla åldrar, en grupp som just gått upp i en ny spelform, ett nystartat lag eller ett lag med många nya spelare.

### Nivå 2, Fortsättning (`niva-2`)

Du känner igen gruppen på att:

- **Bollen:** de flesta kan ta emot och föra bollen med kontroll när de har lite tid på sig.
- **Passningar:** korta passningar går oftast fram. Några passningar i följd inom laget är vanligt.
- **Spelet:** spelarna vet åt vilket håll de ska och försöker sprida ut sig, men glömmer det ofta när det går fort.
- **Övningar:** gruppen kommer igång efter en kort förklaring och en visning och klarar två eller tre moment i följd.
- **Motståndare:** med en motståndare nära lyckas det ibland och misslyckas ibland. Spelarna blir bättre av att öva just det.

Typiska grupper: de flesta lag som har tränat tillsammans en säsong eller mer i sin spelform.

### Nivå 3, Fördjupning (`niva-3`)

Du känner igen gruppen på att:

- **Bollen:** de flesta behåller bollen även när en motståndare pressar, och kan vända och ta sig loss.
- **Passningar:** laget kan hålla bollen över flera passningar i matchtempo och byta sida i spelet.
- **Spelet:** spelarna gör sig spelbara utan att bli påminda och förstår sin roll på planen.
- **Övningar:** gruppen förstår nya övningar snabbt, kan organisera sig själv och blir uttråkad om det går för lätt.
- **Motståndare:** vanliga övningar blir för enkla. Gruppen behöver mindre ytor, färre touchar, fler motspelare eller svårare regler för att utmanas.

Typiska grupper: lag som har tränat länge tillsammans och klarar sin spelform bra, eller en grupp som är på väg upp mot nästa spelform.

## När gruppen är blandad

Nästan alla grupper är blandade. Så här gör ledaren (min rekommendation):

1. **Välj efter majoriteten.** Nivån ska stämma för ungefär två av tre spelare.
2. **Är du osäker, välj den lägre nivån.** Det är lättare att göra en övning svårare på plats än att rädda en övning som är för svår.
3. **Använd varianterna.** Varje övning har en lättare och en svårare variant, och passet visar alltid båda (R-029). Spelare som behöver mer utmaning, eller mer tid, får varianten inom samma övning.
4. **Nivån gäller dagens pass.** Samma grupp kan vara `niva-2` i passningsspel och `niva-1` i 1 mot 1. Ledaren väljer nivån för det som ska tränas i dag.

## Vad nivån inte är

- **Inte ett omdöme om enskilda spelare.** Appen lagrar inga uppgifter om spelare, bara antal. Nivån beskriver gruppen och det aktuella passet.
- **Inte ett sätt att dela upp barn i fasta A- och B-grupper.** SvFF:s riktlinjer (FSLL) utgår från fotboll för alla och barns villkor. *Min bedömning:* om ledaren delar gruppen efter nivå under ett pass bör indelningen vara tillfällig och ändras ofta, särskilt upp till 12 år.

## Hur nivån används i övningsbanken

Till övningsförfattaren och till datamodellen, som beslutas vid K2:

- En övning kan passa flera nivåer, till exempel `niva-1` och `niva-2`, där den lättare varianten gör den användbar på `niva-1`. Fältet `niva` är därför en **lista med en eller flera nivånycklar**, inte ett enda värde (R-001). Fältnamnet bestäms vid K2.
- Övningar för `niva-1` bör ha enkel organisation, som går att visa på under en minut, och få moment.
- Övningar för `niva-3` bör ha press från motståndare, begränsad tid eller yta, eller flera val för spelaren.

Matchningen är strikt: generatorn väljer bara övningar vars nivålista innehåller ledarens nivå, och tar aldrig en övning från en angränsande nivå, inte ens när för få övningar matchar (R-025, R-026). En övning för `niva-2` används alltså inte på `niva-3`, även om den har en svårare variant. Om övningen passar båda nivåerna ska det stå i nivålistan.
