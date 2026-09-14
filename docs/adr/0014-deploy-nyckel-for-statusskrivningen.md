# 0014: Statusskrivningen pushar till main med en deploy-nyckel

Status: beslutad (K3, 2026-09-14)

## Kontext

ADR 0013 lade det mänskliga godkännandet på ägarens **merge** och lät arbetsflödet
`godkann-omgang` skriva `status: godkand` efteråt, med `GITHUB_TOKEN` och `contents: write`.
Hela kedjan vilade på en rad i ADR 0013 *Konsekvenser*: att `main` skulle ha ett **undantag från
kravet på pull request för `github-actions[bot]`**. Utan det, står det där, ”kan arbetsflödet inte
pusha, och ingen omgång blir någonsin godkänd”.

Den raden går inte att uppfylla. Användaren godkände ADR 0013 vid K3 och mergade kedjan, och
därefter visade det sig att `GITHUB_TOKEN` inte kan ges skrivrätt till en skyddad `main` i det här
repot. Fyra försök gjordes, i den här ordningen, och alla står nedan så utförligt att ingen behöver
göra om dem.

| # | Försök | Utfall |
|---|---|---|
| 1 | **Klassiskt grenskydd**, `bypass_pull_request_allowances` via API:t | Avvisades med *”Only organization repositories can have users and team restrictions”* medan repot ägdes av ett personkonto. Efter flytten till organisation togs samma anrop emot — men undantagslistan sparades **tom**, så inget undantag fanns |
| 2 | **Regeluppsättning på repo-nivå** med aktören `Integration` (GitHub Actions, id 15368) i `bypass_actors` | Avvisades med *”Actor GitHub Actions integration must be part of the ruleset source or owner organization”*. Både före och efter flytten till organisationen |
| 3 | **Regeluppsättning på organisationsnivå**, som skulle göra aktören giltig enligt felmeddelandet i försök 2 | Kräver behörigheten `admin:org`, som inte finns |
| 4 | **Gränssnittets undantagslista**, letad igenom för hand | **GitHub Actions fanns inte att välja** |

Under arbetet flyttades repot dessutom från personkontot till organisationen
**`liebertech/Fotbollsbanken`**, publikt. Flytten löste inte problemet, men den ändrade
förutsättningarna: klassiskt grenskydd byttes mot en regeluppsättning, och hemlighetsskanning och
pushskydd stängdes av i flytten och har återställts.

Användaren fick alternativen med för- och nackdelar och valde **deploy-nyckel**. Det är den enda
aktörstyp som gick att peka ut som undantag i regeluppsättningen.

**Så ser repot ut nu**, kontrollerat av huvudsessionen mot
`repos/liebertech/Fotbollsbanken/rules/branches/main`:

| Sak | Värde |
|---|---|
| Repo | `liebertech/Fotbollsbanken`, publikt, ägt av organisationen |
| Skydd av `main` | Regeluppsättningen **`Skydd av main`**, id 23264498. Inget klassiskt grenskydd |
| Regler i den | `deletion`, `non_fast_forward`, `pull_request` med noll krävda godkännanden, `required_status_checks` med `kontroll` och `godkannande` |
| Undantag i den | **`DeployKey`, `always`**. Enda aktörstypen som gick att peka ut |
| Nyckel | En ed25519-deploy-nyckel med skrivrätt, id 163226546, titel `godkann-omgang: skriver status efter merge (miljöhemlighet)`. Den första nyckeln, id 163224793, återkallades när hemligheten flyttades till miljön, eftersom en privat nyckel inte går att läsa ut ur en hemlighet och alltså inte kan flyttas |
| Hemlighet | Den privata nyckeln som **miljöhemligheten** `GODKANN_OMGANG_DEPLOY_KEY` på miljön `godkannande`. Repot har inga repohemligheter. Lokala kopior raderade |
| Miljö | `godkannande` med användaren som krävd granskare, självgranskning tillåten |
| Hemlighetsskanning och pushskydd | Återställda efter flytten |

Den här ADR:n beskriver vad som därmed faktiskt gäller. ADR 0013 ändras inte, varken i texten
eller i tabellen under *Konsekvenser*; beslut skrivs inte om i efterhand. Läsaren av ADR 0013
hänvisas hit.

## Beslut

### 1 Vad som ersätts i ADR 0013

| Ersatt | Ersätts av |
|---|---|
| *Konsekvenser*, raden ”Undantag från kravet på pull request för `github-actions[bot]`: På” | Avsnitt 2 nedan: undantaget finns inte och går inte att skapa. Undantaget är i stället `DeployKey, always` |
| *Konsekvenser*, raderna om **klassiskt grenskydd** och obligatoriska statuskontroller | Avsnitt 3: samma villkor, men uttryckta i regeluppsättningen `Skydd av main` i stället för i grenskyddsdialogen. Tabellen i ADR 0013 är alltså inaktuell på formen, inte på innehållet, utom raden ovan som är inaktuell rakt av |
| *Vad kedjan inte skyddar mot*, punkten ”**Boten får pusha till `main`**” | Avsnitt 4: boten får det inte. Det gör deploy-nyckeln, och konsekvensen är en annan |
| *Vad kedjan inte skyddar mot*, påståendet att ägarens GitHub-konto är kedjans **enda** verkliga förtroendepunkt | Avsnitt 4: det finns nu två. Avsnittet är inte längre uttömmande |
| Jobbet `skriv` i `.github/workflows/godkann-omgang.yml`, `permissions: contents: write` och push med `GITHUB_TOKEN` | Avsnitt 2: `contents: read` och push över SSH |

Allt annat i ADR 0013 gäller oförändrat: den mänskliga signalen är fortfarande ägarens merge,
lagren 2–6, ordningen i avsnitt 4, och att `godkand` aldrig skrivs för hand.

### 2 Pushen sker med en deploy-nyckel över SSH

Jobbet `skriv` i `godkann-omgang` pushar statuscommiten till
`git@github.com:liebertech/Fotbollsbanken` med den privata nyckeln ur
`GODKANN_OMGANG_DEPLOY_KEY`. Formen är bestämd:

- **Ingen tredjepartsaction.** Nyckeln sätts upp i ett `run`-steg. Ett steg som hanterar en
  hemlighet med skrivrätt till `main` ska inte vara någon annans kod (ADR 0002 beslut 4 pinnar
  actions av samma skäl).
- **Nyckeln skrivs till fil med `umask 077` och `chmod 600`**, och pekas ut med
  `core.sshCommand` tillsammans med `IdentitiesOnly=yes`. Den skickas in som miljövariabel och
  echas aldrig.
- **Värdnyckeln förankras med `ssh-keyscan github.com`** i `known_hosts`, med
  `StrictHostKeyChecking=yes`. Att stänga av värdnyckelkontrollen vore att lämna en nyckel med
  skrivrätt till `main` åt vem som helst som kan svara på anslutningen.
- **Nyckelfilen tas bort i ett steg med `if: always()`**, så att den försvinner även när ett steg
  före har fallit.
- **`actions/checkout` kör med `persist-credentials: false`** i båda jobben, så att `GITHUB_TOKEN`
  inte ligger kvar i git-konfigurationen och kan råka användas.
- **Jobbets rättighet sänks från `contents: write` till `contents: read`.** Token behöver inte
  längre skriva. En rättighet som inte behövs ska inte begäras, och sänkningen gör det synligt i
  filen att skrivningen inte längre går genom token.

Jobbet `forbered` är oförändrat.

### 3 Regeluppsättning i stället för klassiskt grenskydd

Villkoren är desamma som ADR 0013 kräver, men de bor någon annanstans:

| ADR 0013 krävde | Motsvarighet i `Skydd av main` (id 23264498) |
|---|---|
| Kräv pull request, noll krävda godkännanden | Regeln `pull_request`, `required_approving_review_count: 0` |
| Obligatoriska statuskontroller `kontroll` och `godkannande` | Regeln `required_status_checks` med båda |
| Blockera force-push | Regeln `non_fast_forward` |
| Blockera radering av `main` | Regeln `deletion` |
| Undantag för `github-actions[bot]` | **Finns inte.** Undantaget är `DeployKey, always` |

Två skillnader är värda att känna till. En regeluppsättning kan ha flera regler för samma gren och
de läggs ihop, så ett skydd kan komma från mer än ett ställe; kontrollera därför alltid
`repos/liebertech/Fotbollsbanken/rules/branches/main`, som visar det sammanlagda utfallet, och inte
bara en enskild uppsättning. Och undantaget är en **aktörstyp**, inte en enskild nyckel: det gäller
varje deploy-nyckel med skrivrätt på repot. Se avsnitt 5.

### 4 Vad nyckeln kostar: kedjan har nu två förtroendepunkter

Det här avsnittet är beslutets pris, och det ska stå oförkortat.

> Deploy-nyckeln är en **ny, långlivad hemlighet som kan pusha till `main` förbi varje regel** i
> `Skydd av main`. Den går inte ut av sig själv. Den behöver ingen pull request, ingen grön
> kontroll och ingen merge. Den som har den privata nyckeln kan skriva vad som helst till `main`,
> inklusive `status: godkand` på en övning som ingen har läst.

Därmed gäller följande, och det är den viktigaste meningen i den här ADR:n:

**ADR 0013 avsnitt *Vad kedjan inte skyddar mot* är inte längre uttömmande.** Där står att
kedjans **enda** verkliga förtroendepunkt är att ägarens GitHub-konto används av ägaren. Det
stämmer inte längre. Kedjan har nu **två** förtroendepunkter, vid sidan av varandra:

1. **Ägarens GitHub-konto.** Den som kan logga in som ägaren kan merga, precis som förut.
2. **Deploy-nyckeln.** Den som kommer åt den privata nyckeln kan pusha rakt till `main`, utan att
   passera vare sig merge, kontroll eller miljögodkännande. Den behöver inte ägarens konto alls.

Skillnaden mot ADR 0013 är att den andra punkten är en **hemlighet** och inte en identitet. En
hemlighet kan kopieras utan spår, den syns inte i någon inloggningshistorik hos GitHub på samma
sätt som ett konto, och en push med den ser i historiken ut som vilken push som helst från
`github-actions[bot]`, eftersom arbetsflödet sätter det namnet på commiten. Att nyckeln bara finns
som miljöhemlighet minskar risken men tar inte bort den: den som kan ändra ett arbetsflöde på
`main` kan lägga till ett jobb med `environment: godkannande` och läsa ut hemligheten där. Skillnaden
mot en repohemlighet är att ett sådant jobb måste passera användarens andra klick först. Vägen står
redan beskriven i ADR 0013 under *En pull request kan skriva om sin egen domare*.

### 5 Vad som mildrar det

| Mildring | Varför den hjälper | Vad den inte gör |
|---|---|---|
| **Repot ska ha exakt en deploy-nyckel.** Undantaget gäller aktörstypen `DeployKey`, alltså varje deploy-nyckel med skrivrätt | Antalet nycklar som kan förbigå `Skydd av main` är lika med antalet deploy-nycklar. Med en nyckel är listan över vad som kan skriva till `main` en rad lång | Hindrar ingen från att lägga till en nyckel till. Antalet måste kontrolleras, inte antas. Se rutinen i avsnitt 7 |
| **Nyckeln kan återkallas på ett ställe** | Ett klick i repots inställningar tar bort skrivrätten omedelbart, utan att röra ägarens konto, andra hemligheter eller historiken | Återkallandet stoppar framtida pushar, inte en push som redan skett |
| **Kontrollen `godkannande` gäller oförändrat varje pull request** | Vägen in i `main` genom en pull request är precis lika stängd som i ADR 0013: `godkand` kan inte komma in den vägen, oavsett vem som skrev commiten | Kontrollen ser inte en push som går förbi den. En push med nyckeln passerar ingen kontroll alls |
| **Miljön `godkannande` kräver fortfarande användarens andra klick** innan jobbet `skriv` startar | Skrivningen är fortfarande en medveten mänsklig handling, inte en följd av mergen. Hemligheten lämnas dessutom inte ut till jobbet förrän miljön har släppt fram det | Skyddar bara det legitima arbetsflödet. Den som har nyckelns innehåll behöver ingen miljö |
| **Nyckeln är läs- och skrivbegränsad till ett repo** | Till skillnad från ett personligt åtkomsttoken når den ingenting annat som användaren äger | Inom repot är den obegränsad |

**Hemligheten ligger på miljön, inte på repot.** En repohemlighet kan läsas av vilket jobb som
helst i vilket arbetsflöde som helst på `main`, också ett jobb utan miljö. Nyckeln lades därför om
till en **miljöhemlighet på `godkannande`**, så att bara ett jobb som passerat användarens andra
klick kommer åt den. Miljögodkännandet är därmed en spärr framför själva hemligheten och inte bara
framför jobbet. Arbetsflödet behövde ingen ändring: `secrets.GODKANN_OMGANG_DEPLOY_KEY` läses
likadant i ett jobb med `environment: godkannande`. Omläggningen krävde en ny nyckel, eftersom en
privat nyckel inte går att läsa ut ur en hemlighet för att flyttas.

Kvar står alltså: allt som ADR 0013 räknar upp som teknik gäller fortfarande för vägen genom en
pull request. Det som tillkommit är en väg vid sidan av, som bara hålls stängd av att hemligheten
förblir hemlig.

### 6 Vägen bort från nyckeln: en egen GitHub-app

Målbilden är att ersätta deploy-nyckeln med en **GitHub-app som ägs av organisationen
`liebertech`**, med den enda repobehörigheten `contents: write`, installerad bara på det här repot.

Varför det vore bättre:

- **Undantaget kan pekas ut på appen** i stället för på aktörstypen `DeployKey`. Försök 2 i
  *Kontext* föll på att GitHub Actions-integrationen inte tillhör organisationen; en app som
  organisationen själv äger uppfyller precis det villkor felmeddelandet ställer. Undantaget blir då
  en namngiven aktör i stället för en kategori som varje framtida nyckel hamnar i.
- **Den token arbetsflödet hanterar lever en timme.** En läckt körningslogg eller ett läckt
  jobbsteg ger ett tidsfönster, inte en permanent skrivrätt.
- **Pushen blir attribuerbar** till appen i stället för att se ut som vilken bot-commit som helst.

Vad som skulle krävas: att appen skapas och installeras i organisationen, att dess app-id och
privata nyckel läggs som hemligheter, att arbetsflödet växlar in en installationstoken i ett eget
steg, och att `Skydd av main` får appen som undantagsaktör i stället för `DeployKey`.

Varför den inte valdes nu: kedjan behövde fungera, och alla fyra försök att slippa en ny hemlighet
hade redan misslyckats. En app kräver dessutom rättigheter på organisationsnivå av samma slag som
saknades i försök 3, och den tar **inte** bort den långlivade hemligheten — appens privata nyckel är
också en sådan. Vinsten ligger i att undantaget blir smalt och att den token som faktiskt används i
körningen är kortlivad. Frågan lyfts under *Beslut som behövs*.

### 7 Rutin för att byta nyckeln, och vad som gäller om den läcker

**Byte.** Görs vid misstanke, när någon som kunnat se nyckeln lämnar, och annars minst en gång om
året. Ordningen är vald så att repot aldrig står utan en fungerande nyckel:

1. Skapa ett nytt ed25519-par utanför repot: `ssh-keygen -t ed25519 -N "" -C godkann-omgang -f <sökväg utanför arbetskatalogen>`.
2. Lägg upp den publika nyckeln som deploy-nyckel **med skrivrätt**, med titel och datum.
3. Byt värdet i miljöhemligheten `GODKANN_OMGANG_DEPLOY_KEY` på miljön `godkannande` mot den nya privata nyckeln (`gh secret set … --env godkannande`).
4. Kör en omgång och kontrollera att jobbet `skriv` pushar. Faller det: värdet i hemligheten är fel,
   inte nyckeln på repot.
5. **Ta bort den gamla deploy-nyckeln.** Under steg 2–5 har repot två nycklar som kan förbigå
   `Skydd av main`, vilket bryter mot avsnitt 5. Fönstret ska vara kort och avslutas alltid här.
6. Radera de lokala kopiorna av båda nycklarna.
7. Kontrollera att repots lista över deploy-nycklar innehåller **exakt en**.

**Om nyckeln läcker.** Läckt är den så snart den lämnat miljöhemligheten: i en logg, en fil, en
skärmdump eller en chatt.

1. **Ta bort deploy-nyckeln på repot omedelbart.** Det är den enda åtgärd som stoppar skrivningen.
   Att bara byta hemligheten räcker inte — den läckta nyckeln fortsätter att fungera så länge den
   publika halvan ligger kvar på repot.
2. Gå igenom `main` sedan nyckeln skapades. Varje direkt push till `main` ska höra ihop med en
   körning av `godkann-omgang`, som i sin tur ska höra ihop med en mergad pull request och ett
   miljögodkännande. En push som saknar körning är en push med nyckeln.
3. Kontrollera varje övning som står i `godkand` mot den omgång som lyfte den. Statusraden i
   `granskning` bär pull requestens nummer, så en `godkand` utan mergad omgång syns i filen.
4. Skapa en ny nyckel enligt bytesrutinen, från steg 1.
5. Anteckna händelsen och åtgärderna i `docs/sakerhet/`, och lyft för sakerhet-integritet.

### 8 Skrivningen går att köra om för hand

Arbetsflödet har också utlösaren `workflow_dispatch`, med indata för commiten före omgången,
commiten omgången kom in med och pull requestens nummer.

**Varför det behövs.** En `push`-utlöst körning hämtar arbetsflödesfilen ur den pushade commiten.
Ordningen mellan mergar spelar därför roll: mergas en omgång **före** en ändring av
`godkann-omgang.yml`, körs omgången med den gamla filen. Det inträffade när omgång 1 (pull
request 4) mergades före deploy-nyckeln (pull request 5): körningen fick versionen som pushade med
`GITHUB_TOKEN`, som inte har något undantag i `Skydd av main` och alltså hade avvisats. Att köra om
den körningen hjälper inte, eftersom en omkörning använder samma commit och därmed samma gamla fil.
Utan en dispatch finns ingen väg alls: `push`-utlösaren startar bara på nya ändringar under
`content/ovningar/**`, och en omgång som redan ligger på `main` ger ingen sådan push.

**Vilka spärrar som gäller också vid dispatch.**

| Spärr | Hur den gäller |
|---|---|
| Miljön `godkannande` | Jobbet `skriv` har `environment: godkannande` utan villkor. Det andra klicket krävs alltså även när körningen startats för hand, och deploy-nyckeln lämnas fortfarande inte ut förrän miljön släppt fram jobbet |
| Kontot i granskningsraden | Hämtas ur `merged_by` i API:t, aldrig ur indata. Den som startar körningen anger bara pull requestens nummer och kan alltså inte skriva vilket namn som helst i filen |
| Pull requesten måste vara mergad | Jobbet `forbered` faller om `merged_at` saknas, och om pull requestens `merge_commit_sha` inte är precis den angivna commiten. Ett nummer som inte hör till commiten skriver ingenting |
| Intervallet måste vara mergens | Commiten före omgången ska vara merge-commitens första förälder, alltså detsamma som `github.event.before` i en push. Annars kan en dispatch svepa in granskade övningar ur andra omgångar och stämpla dem med fel pull request |
| Bara `granskad` lyfts, bara `status` och `granskning` skrivs | Oförändrat: samma skript, samma torrkörning i `forbered` och samma validering av hela banken före och efter |
| Ingen omskriven historik | Jobbet `skriv` checkar vid dispatch ut grenens topp, inte merge-commiten, och pushar utan `--force`. Innehållet som stämplas kommer ändå ur den angivna commiten, eftersom skriptet läser filerna ur git. Har `content/ovningar` ändrats sedan dess avbryts körningen i stället för att skriva över ändringarna |

Ingenting i hanteringen av nyckeln ändrades, och `scripts/godkannande.ts` behövde ingen ändring:
det tar redan intervallet, kontot och pull requestens nummer som argument.

Dispatchvägen är **oprövad i en skarp körning**. Den kan inte köras lokalt, och den prövas första
gången när omgång 1 körs om.

## Alternativ

| Alternativ | Varför det valdes bort |
|---|---|
| **Klassiskt grenskydd med undantag för `github-actions[bot]`** (ADR 0013) | Går inte att skapa. Försök 1 i *Kontext*: avvisat på personkonto, och efter flytten till organisation sparades undantagslistan tom |
| **Regeluppsättning på repo-nivå med aktören `Integration`** (GitHub Actions, id 15368) | Försök 2: *”Actor GitHub Actions integration must be part of the ruleset source or owner organization”*. Integrationen ägs inte av organisationen |
| **Regeluppsättning på organisationsnivå** | Försök 3: kräver `admin:org`, som inte finns |
| **Personligt åtkomsttoken med `Repository admin` som undantagsaktör** | Skulle fungera, men gör undantaget till ägarens roll i stället för till en maskin: därmed kan varje push som görs med ägarens konto förbigå `Skydd av main`, också av misstag. Ett token är dessutom knutet till kontot och når allt kontot når, medan deploy-nyckeln bara når det här repot |
| **Egen GitHub-app för organisationen** | Bättre på sikt, se avsnitt 6. Kräver rättigheter av samma slag som saknades i försök 3, och tar inte bort den långlivade hemligheten. Lyfts under *Beslut som behövs* |
| **Låta arbetsflödet öppna en pull request med statusändringen** | Avvisades i ADR 0013 för att pushar med `GITHUB_TOKEN` inte startar kontroller. Med en deploy-nyckel gör de det, så invändningen faller — men en sådan pull request skulle underkännas av kontrollen `godkannande`, som avsiktligt underkänner varje pull request som sätter `godkand` (ADR 0013 lager 3). Vägen är stängd av ett skydd vi vill behålla |
| **Ta bort kravet på pull request på `main`** | Skulle göra hela ADR 0013 verkningslös. `main` ska bara ändras genom en merge (`CLAUDE.md`, *Git*) |
| **Låta huvudsessionen pusha statuscommiten med ägarens inloggning** | Då är det en agent som skriver `godkand`, vilket är precis det `CLAUDE.md` förbjuder |

## Konsekvenser

**Inställningar som beslutet kräver.** De ersätter, för de punkter det gäller, tabellen i ADR 0013
*Konsekvenser*. Ingen av dem syns i repot, och kedjan är aldrig starkare än de är. De bör
kontrolleras vid varje K4 med `repos/liebertech/Fotbollsbanken/rules/branches/main` och repots lista
över deploy-nycklar.

| Inställning | Värde | Utan den |
|---|---|---|
| Regeluppsättningen `Skydd av main` | Aktiv, med `pull_request` (noll krävda godkännanden), `required_status_checks` (`kontroll`, `godkannande`), `non_fast_forward` och `deletion` | Samma följder som i ADR 0013: antingen låser sig repot eller så är `main` oskyddad |
| Undantag i den | `DeployKey, always`, och inget annat | Arbetsflödet kan inte pusha, och ingen omgång blir godkänd |
| Antal deploy-nycklar med skrivrätt på repot | **Exakt en**, id 163226546 | Undantaget gäller aktörstypen, så varje ytterligare nyckel är ytterligare en väg förbi alla regler |
| Hemligheten `GODKANN_OMGANG_DEPLOY_KEY` | Den privata halvan av just den nyckeln. Ligger som miljöhemlighet på `godkannande` (avsnitt 5) | Jobbet `skriv` faller, men först efter att miljön har släppt fram det |
| Miljön `godkannande` | Användaren som krävd granskare | Skrivningen sker utan det andra klicket |
| Hemlighetsskanning och pushskydd | På | En läckt nyckel i en commit upptäcks inte |
| Förvalt `GITHUB_TOKEN`-läge | Read-only | ADR 0002 beslut 4 faller |

**Fördelar**

- Kedjan kan köra. Det kunde den inte med undantaget som ADR 0013 förutsatte.
- Ingen del av `GITHUB_TOKEN` behöver skrivrätt längre. Båda jobben kör med `contents: read`, och
  ingen framtida rad i en arbetsflödesfil kan ge sig själv skrivrätt till `main` genom token.
- Skrivrätten ligger på **ett** ställe som kan återkallas med ett klick, utan att röra ägarens konto.
- Undantaget är smalare än det ADR 0013 begärde: `github-actions[bot]` hade gällt varje arbetsflöde
  på `main` som begär `contents: write`, medan deploy-nyckeln bara kan användas av det jobb som får
  hemligheten, och först efter miljögodkännandet.

**Nackdelar och risker**

- **En andra förtroendepunkt.** Avsnitt 4. Det är beslutets pris, och det går inte att mildra bort.
- **Nyckeln går inte ut.** Den lever tills någon tar bort den, och skyddet vilar därför på en rutin
  (avsnitt 7) i stället för på en teknisk livslängd. Rutiner glöms.
- **Undantaget är en aktörstyp, inte en nyckel.** En andra deploy-nyckel med skrivrätt får samma
  förbigående utan att någon inställning ändras. Antalet måste kontrolleras.
- **Pushar med en deploy-nyckel startar nya arbetsflödeskörningar**, till skillnad från pushar med
  `GITHUB_TOKEN`. Två följder, båda **oprövade tills flödet kört skarpt**:
  - Statuscommiten utlöser `Kontroll` på `main` och `godkann-omgang` en gång till. Den andra
    körningen bör hitta ingen mergad pull request för statuscommiten och avsluta utan att skriva.
    Skulle den ändå hitta en, står inga filer kvar i `granskad` efter skrivningen, så `skriv`
    hoppas över. Skrivningen är idempotent (ADR 0013 avsnitt 4 punkt 6), och `concurrency`-gruppen
    hindrar två körningar från att skriva samtidigt. Ingen loop är alltså väntad — men det är en
    slutsats ur koden, inte en observation.
  - **ADR 0013:s nackdel att `importera-banken` inte kan förlita sig på sin push-utlösare gäller
    troligen inte längre.** Den som bygger importen ska kontrollera det mot en verklig körning
    innan hen förlitar sig på utlösaren, och inte läsa den här meningen som ett besked.
- **Ett fel i nyckeluppsättningen upptäcks sent.** Saknas hemligheten, eller är den fel, faller
  jobbet först efter att användaren släppt fram det i miljön. Steget säger uttryckligen vad som
  saknas i stället för att falla på ett `Permission denied` från git.
- **Värdnyckeln hämtas vid varje körning** med `ssh-keyscan`. Det är bättre än
  `StrictHostKeyChecking=no`, men det är förtroende vid första kontakten: körningen litar på det
  svar den får. Att i stället lägga GitHubs fingeravtryck i filen vore starkare och skulle behöva
  underhållas när GitHub byter nyckel. Valt: `ssh-keyscan`, eftersom körningen ändå hämtar all annan
  kod över samma nät.
- **ADR 0013 står kvar oförändrad** och beskriver en inställning som inte finns. Läsaren måste följa
  hänvisningen hit. Det är priset för att beslut inte skrivs om i efterhand, och samma pris som
  ADR 0013 själv betalar mot ADR 0010.
- **Repot har bytt ägare.** Länkar och API-anrop som pekar på det gamla personkontot fungerar via
  GitHubs omdirigering men bör rättas när de dyker upp. `CODEOWNERS` pekar på användarens konto och
  påverkas inte.

## Beslut som behövs

| Fråga | Rekommendation |
|---|---|
| **Ska en egen GitHub-app för organisationen byggas nu i stället för deploy-nyckeln?** Den ger ett smalt, namngivet undantag och en token som lever en timme (avsnitt 6) | Inte nu. Deploy-nyckeln räcker för att kedjan ska fungera, och appens privata nyckel är också en långlivad hemlighet. Ta upp frågan igen innan repot får fler skribenter, eller innan agenterna någon gång kör utan att ägaren sitter vid tangentbordet. Den bör byggas före lansering (K5) |
| **Ska rutinen i avsnitt 7 skrivas in någon annanstans än i den här ADR:n?** En rutin som bara står i ett arkitekturbeslut läses en gång | Ja. En kort rad i `docs/sakerhet/` som hänvisar hit, och en punkt på K4-checklistan om att räkna deploy-nycklarna. Beslutet är användarens eftersom det rör arbetsvanor, inte kod |
| **Ska ADR 0013 få en statusrad som pekar hit?** `docs/adr/README.md` säger att en ersatt ADR får status `Ersatt av NNNN`, men ADR 0013 ersätts bara delvis, och uppdraget var att inte röra den | Uppdraget följs: ADR 0013 är orörd. Om konventionen ska hållas är det minsta ingreppet att statusraden i ADR 0013 vid nästa kontrollpunkt blir `Delvis ersatt av 0014`, utan att brödtexten ändras. Det är användarens val |
