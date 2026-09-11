Status: utkast

# Kravspecifikation – Fotbollsbanken

## Vision

Fotbollsbanken ska göra det snabbt och enkelt för en ideell ungdomsledare att gå från "jag behöver ett träningspass" till ett färdigt, anpassat pass med planskisser – på mobilen, kvällen innan eller på väg till planen. Passen sätts ihop av en regelmotor ur en övningsbank som är kvalitetssäkrad av människor, inte av AI.

## Vilka appen är till för

| Roll | Vem | Vad rollen gör i appen |
|---|---|---|
| **Ledare** | Ideell ungdomsledare, ofta förälder, med ont om tid. Planerar på mobilen. | Genererar och justerar träningspass, sparar dem, använder planläge på planen, skapar och delar egna övningar, kan skicka in övningar till den gemensamma banken. |
| **Klubbadmin** | Hanterar klubbens lag och ledare. | Skapar klubben och dess lag, bjuder in ledare, hanterar vem som hör till vilket lag. |
| **Redaktör** | Godkänner övningar till den gemensamma banken. | Granskar inskickade övningar och sätter status `godkand` eller skickar tillbaka dem med kommentar. |

Användaren (beställaren) är redaktör från start. Fler redaktörer kan utses i appen senare, se berättelse 18.

En och samma person kan ha flera roller (till exempel vara klubbadmin och ledare i samma klubb).

## Mål med version 1

- En ledare ska kunna gå från tomt underlag till ett komplett, anpassat träningspass på under ett par minuter.
- Passen ska bygga på en granskad övningsbank, aldrig på AI-genererat innehåll.
- Klubbar ska kunna organisera sina lag och ledare, och dela pass och övningar inom klubben.
- Ledare ska kunna bidra med egna övningar till den gemensamma banken, kvalitetssäkrat av en redaktör.
- Ett pass ska gå att använda direkt på planen (planläge med timer) och att ta med på papper (utskrift/PDF).
- En säsongs träning ska kunna planeras med progression över tid, inte bara pass för pass.

## Vad ingår i version 1

Version 1 byggs i sju inkrement, i den ordning som anges i `CLAUDE.md`:

1. **Generatorn** – ledaren anger ålder, nivå, antal spelare, antal ledare, passets längd och fokusområde (spelform föreslås utifrån åldern) och får ett träningspass, som kan justeras (byta ut en övning) och sparas.
2. **Planskisser** – övningar och pass visas med planskisser ritade som SVG från skissdata.
3. **Konton med klubbar och lag** – ledare och klubbadmin har konton, klubbadmin skapar klubb och lag och bjuder in ledare, sparade pass delas inom laget.
4. **Egna och inskickade övningar med redaktörskö** – ledare skapar egna övningar som delas inom klubben, kan skicka in dem till den gemensamma banken och redaktören granskar dem.
5. **Planläge med timer** – ett pass körs på planen, en övning i taget, med timer.
6. **Utskrift/PDF** – ett pass kan skrivas ut eller exporteras med planskisser.
7. **Säsongsplanering** – pass planeras över veckor och perioder med progression i tema och fokusområden.

## Avgränsningar – vad ingår inte i version 1

- Ingen AI i appen. Inget innehåll genereras automatiskt av en språkmodell; allt övningsinnehåll är skrivet och granskat av människor.
- Inga uppgifter om enskilda spelare lagras – bara antal. Ingen närvaroregistrering, ingen individuell statistik eller utveckling per spelare.
- Ingen publik, öppen delning av pass eller övningar utanför inloggade konton. Den gemensamma övningsbanken delas mellan klubbar, men klubbens egna pass och egna (icke godkända) övningar delas bara inom klubben.
- Ingen betalfunktion eller prenumeration. Drift ska hålla sig inom gratisnivåer (se `CLAUDE.md`).
- Inget annat språk än svenska i gränssnittet.
- Ingen nativ app – Fotbollsbanken är en mobilanpassad webbapp (PWA).
- Fullständigt offlineläge är inte ett krav för version 1 (tekniskt beslut vid K2, men grundbehovet "fungerar på planen med dåligt mobilnät" gäller, se icke-funktionella krav).

## Icke-funktionella krav (behovsnivå)

Dessa beskriver behov, inte lösningar. Hur de uppfylls tekniskt avgörs vid K2.

- **Mobil först:** appen ska vara fullt användbar på en mobiltelefon. Skrivbordsvy är inte prioriterad i version 1.
- **Används utomhus, på planen:** gränssnittet ska vara läsbart i starkt solljus, ha tillräckligt stora tryckytor för att användas med en hand (till exempel i planläget), och fungera även vid svagt eller instabilt mobilnät.
- **Tillgänglighet:** appen ska uppfylla WCAG 2.2 nivå AA.
- **Flera klubbar:** datamodellen ska hantera flera klubbar från start, även om appen byggs och används av den egna klubben först. En klubbs data ska inte vara synlig för en annan klubb.
- **Inga spelaruppgifter:** inga personuppgifter om spelare får samlas in eller lagras, bara antal. Personuppgifter förekommer bara för ledarnas och klubbadminens konton.
- **Kostnad:** drift ska rymmas inom gratisnivåer. Nya kostnader kräver användarens beslut.
- **Språk:** gränssnitt och innehåll är på svenska.

## Öppna frågor till K1

Dessa frågor kan inte avgöras av produktägaren och läggs fram för beställaren, se även *Beslut som behövs* i produktägarens rapport till K1.

1. **Yta och material i generatorn:** ska generatorn ta hänsyn till tillgänglig yta (till exempel hel/halv plan) och material (antal bollar, koner, mål) när den väljer övningar? Se rekommendation i produktägarens rapport.
2. **Granskning av ledares inskickade övningar:** appen har bara rollerna ledare, klubbadmin och redaktör – ingen egen apparoll för "fotbollsexpert". Berättelse 16 föreslår att redaktören ensam avgör om en inskickad övning godkänns eller behöver åtgärdas i appen. Se rekommendation i produktägarens rapport.
3. **Vem får utse fler redaktörer:** berättelse 18 föreslår att en befintlig redaktör kan utse fler. Se rekommendation i produktägarens rapport.

## Källor

Fotbollsfakta (spelformer, åldersfaser, nivåer, fokusområden, passuppbyggnad, generatorregler, säsongsprogression) ägs av fotbollsexperten och beskrivs i `docs/doman/`. Detta dokument hänvisar dit i stället för att upprepa eller själv besluta fotbollsregler.
