# 0013: Godkännandet av en omgång sker genom att ägaren mergar

Status: förslag

## Kontext

ADR 0010 avsnitt 3 lägger det mänskliga godkännandet på en **godkännande granskning (Approve)** av omgångens pull request: arbetsflödet `godkann-omgang` startas av `pull_request_review` med `state: approved` från kodägaren, och skriver `status: godkand` i filerna på grenen. Den kedjan går inte att bygga i det här repot.

**GitHub tillåter inte att den som skapat en pull request godkänner den.** Repot har ett enda konto, `@benbom`. Agenterna kör med användarens git och lägger fram sina grenar som pull requests i samma konto. Den som skulle godkänna är alltså alltid samma konto som skapade pull requesten, och händelsen `pull_request_review` med `state: approved` från kodägaren kan därför aldrig inträffa. Följderna i dag:

- Grenskyddet står på **noll krävda godkännanden**, och kodägargranskning är avstängd. Annars vore `main` permanent blockerat, eftersom kravet skulle vara omöjligt att uppfylla.
- `CODEOWNERS` begär en granskning som ingen kan lämna. Filen pekar ut ägaren och syns i pull request-vyn, men den blockerar ingenting så länge kodägargranskning är av.
- Lager 3 i ADR 0010 kan aldrig köra, och lager 2:s undantag för commits av `github-actions[bot]` blir meningslöst. Undantaget var dessutom svagt i sig: `git commit --author` sätter vilket författarnamn som helst, så en lokal agent kan skriva `github-actions[bot]` i en commit.

Den mänskliga handling som återstår i ett repo med ett konto är att ägaren **mergar** omgångens pull request. Den här ADR:n bygger kedjan på den handlingen i stället, och skriver ut vad kedjan därmed garanterar tekniskt och vad som blir kvar som förtroende.

Följande ramar styr beslutet:

| Ram | Källa |
|---|---|
| En övning publiceras i banken först när en människa godkänt den. Ingen agent får sätta `godkand` | `CLAUDE.md`, berättelse 16 kriterium 4 |
| `main` är skyddad och tar bara emot pull requests. Aldrig force-push, aldrig omskriven historik | `CLAUDE.md`, *Git* |
| Repot görs publikt före fas 4, vilket gör grenskydd, `CODEOWNERS` och Actions gratis | ADR 0002, S-04 |
| Förvalt `GITHUB_TOKEN`-läge är read-only, varje arbetsflöde begär sina rättigheter per jobb, inget arbetsflöde utlöses av `pull_request_target`, inga hemligheter till arbetsflöden från forkar | ADR 0002 beslut 4, S-03, S-04 |
| Godkännandet ska gälla exakt den commit människan har läst, och arbetsflödet får aldrig köra kod från pull request-grenen | S-03 |
| Filens `status` skrivs bara av arbetsflödet `godkann-omgang`, och en pull request som sätter `godkand` på något annat sätt underkänns av kontrollen `godkannande` | `content/ovningar/README.md`, ADR 0010 avsnitt 3 |
| Importen läser bara filer med `godkand` och skriver aldrig status | ADR 0010 avsnitt 2 |
| Statusvärdena i filen är `utkast`, `granskad`, `atgarda` och `godkand` | ADR 0010 avsnitt 1 och 4 |

## Beslut

### 1 Vad som ersätts i ADR 0010

Den här ADR:n ersätter i **ADR 0010 avsnitt 3**:

| Ersatt | Ersätts av |
|---|---|
| Principrutan ”… bara som svar på att användaren har godkänt en pull request med sitt eget GitHub-konto” | Avsnitt 2 nedan: merge i stället för Approve |
| Lager 2 i tabellen ”Fyra lager”, undantaget för commits av `github-actions[bot]` | Avsnitt 3, lager 3: ingen identitetsbaserad undantagsregel alls |
| Lager 3 i tabellen ”Fyra lager” och hela stycket *Lager 3 måste binda godkännandet till en commit* | Avsnitt 3 lager 4 och avsnitt 4: arbetsflödet utlöses av push till `main` efter merge |
| Stycket *För användaren*: ”trycka Approve” | Avsnitt 4: merga omgången, och släppa fram skrivningen i miljön `godkannande` |
| Punkt 4 i fas 3-flödet i avsnitt 2: ”Användaren godkänner den i pull requesten, och CI sätter `godkand`” före merge | Avsnitt 4: CI sätter `godkand` **efter** mergen |

Allt annat i ADR 0010 gäller oförändrat: schemat (avsnitt 1), flödet in i banken (avsnitt 2) utom ordningen i punkt 4–5, lager 1 (grenskydd) och lager 4 (importen), skydden i appen, ordbytet (avsnitt 4) och valideringen (avsnitt 5). ADR 0010 ändras inte i efterhand; den behåller sin status och sitt innehåll.

### 2 Den mänskliga signalen är ägarens merge

> **Ingen människa och ingen agent skriver `godkand` i en fil.** Värdet skrivs bara av arbetsflödet `godkann-omgang`, och bara efter att omgångens pull request har mergats till `main` av en människa med sitt eget GitHub-konto, och bara på de filer som stod i `granskad` i just den mergade commiten.

Varför en merge är minst lika bra som en Approve i ett repo med ett konto:

- **Den kan inträffa.** En Approve kan det inte, och en kontroll som aldrig kan uppfyllas är ingen kontroll utan en text.
- **Den kräver samma sak av angriparen.** Både Approve och merge är handlingar hos GitHub som kräver ett inloggat konto eller ett giltigt token. Ingen av dem kan utföras med enbart skrivrättighet till arbetskatalogen. Steget från Approve till merge sänker alltså inte tröskeln — se avsnitt 5 för vad tröskeln faktiskt är.
- **Den binder godkännandet till en commit utan extra konstruktion.** S-03 handlar om att ett Approve gäller en commit medan arbetsflödet kan checka ut en gren som hunnit ändras. Efter en merge finns bara ett träd: det som ligger på `main`. Arbetsflödet läser samma commit som mergades, och TOCTOU-luckan i ADR 0010 försvinner i stället för att behöva täppas till med `review.commit_id`, avvisade granskningar och kontroll av granskarens identitet.
- **Den är den handling som ändå avslutar varje inkrement** (`CLAUDE.md`, *Ett inkrements väg till main*), så kedjan lägger inget nytt moment på användaren utöver att släppa fram skrivningen.

Godkännandet skrivs in i filen som en rad i `granskning` med datum, det GitHub-konto som mergade (`pull_request.merged_by`) och pull requestens nummer. Kontonamnet är publikt och oproblematiskt enligt S-21.

### 3 Lagren, och vad var och ett faktiskt hindrar

| Lager | Vad det gör | Vad det hindrar | Vad det inte hindrar |
|---|---|---|---|
| 1. Grenskydd på `main` | Inga direkta pushar, inga force-pushar, ändringar går via pull request, och de obligatoriska kontrollerna `kontroll` och `godkannande` måste vara gröna | Att en agent med skrivrättighet pushar en fil med `status: godkand` rakt till `main`, och att en omgång mergas medan kontrollen är röd | Att någon som har ägarens konto mergar. Krävda godkännanden är noll och kodägargranskning är av, annars låser sig repot (avsnitt *Kontext*) |
| 2. `CODEOWNERS` | Begär granskning av ägaren och visar i pull request-vyn vem som äger sökvägen, bland annat `content/ovningar/` och `.github/workflows/` | Inget i dag. Filen är märkning och rutin, inte en spärr | Att en pull request mergas utan den begärda granskningen. Lagret blir en spärr först med ett andra konto (avsnitt 6) |
| 3. Kontrollen `godkannande` | Obligatorisk statuskontroll på varje pull request. Underkänner **varje** pull request där en fil under `content/ovningar/` går från något annat till `status: godkand`, utan undantag för vem som skrev commiten, och varje pull request som ändrar övningsfiler tillsammans med filer utanför `content/` och `docs/` | Att `godkand` någonsin kommer in i `main` genom en pull request, och att en omgång i samma svep byter ut den kod som arbetsflödet sedan kör med `contents: write` (S-03) | Att en pull request skriver om kontrollens egen arbetsflödesfil (avsnitt 5) |
| 4. Arbetsflödet `godkann-omgang` | Utlöses av push till `main` under `content/ovningar/**`. Validerar först hela banken, slår upp den mergade pull requesten, väntar på miljön `godkannande` och sätter sedan `godkand` bara på de filer i omgången som står i `granskad`. Skriver bara `status` och en rad i `granskning`, aldrig text | Att en text som ingen granskat blir godkänd, att en fil i `utkast` eller `atgarda` lyfts, och att godkännandet gäller andra filer än de omgången innehöll | Att ägaren mergar utan att läsa (avsnitt 5) |
| 5. `GITHUB_TOKEN` read-only som förval | Ett arbetsflöde har inga skrivrättigheter om det inte begär dem, och de begärs per jobb. Bara det jobb som skriver har `contents: write` | Att ett nyskrivet eller ändrat arbetsflöde får skrivrättighet av misstag, och att ett läsande jobb kan skriva | Att en arbetsflödesfil uttryckligen begär `contents: write` — det är en rad i en fil som en pull request kan innehålla |
| 6. Importen | Oförändrad från ADR 0010 lager 4: läser bara filer med `godkand`, skriver aldrig status, och kör med importrollen som inte kan skapa ett godkännande i appen (S-05) | Att ett fel i repot blir ett förfalskat godkännande i databasen | – |

Det enda lager som är nytt jämfört med ADR 0010 är att lager 3 blivit **undantagslöst**. ADR 0010 lät kontrollen släppa igenom commits vars författare var `github-actions[bot]`. Ett författarnamn är inte en identitet: `git commit --author` sätter det fritt. Eftersom arbetsflödet nu skriver efter mergen, och alltså aldrig inuti en pull request, behöver kontrollen inte fråga vem som skrev något. Den frågar bara vad ändringen gör.

### 4 Så går en omgång till

1. Övningsförfattaren och fotbollsexperten arbetar som förut. Omgången läggs fram som en pull request med filer i `granskad`.
2. Kontrollerna `kontroll` och `godkannande` körs. `godkannande` kör **basgrenens** kod, aldrig pull requestens, och läser pull requestens innehåll som git-objekt (S-03).
3. Ägaren läser övningarna i diffen och mergar. Det är den mänskliga signalen.
4. Pushen till `main` utlöser `godkann-omgang`. Arbetsflödet är utlöst av `push`, inte av `pull_request`, eftersom ett `pull_request`-arbetsflöde körs från pull requestens egen version av filen: en gren skulle annars kunna skriva om `godkann-omgang.yml` och få `contents: write` när pull requesten stängs, även utan merge.
5. Jobb 1 validerar banken och skriver ut vad som skulle ändras. Jobb 2 kräver miljön `godkannande`, som väntar på ägarens andra klick, och skriver sedan `status: godkand` och granskningsraden samt pushar commiten till `main`. Hittar arbetsflödet ingen mergad pull request för commiten skrivs ingenting.
6. Filerna i omgången som står i `utkast` eller `atgarda` rörs inte, och en fil som redan är `godkand` rörs inte heller. Skrivningen är därför idempotent, och en omkörning gör ingen skada.

### 5 Vad kedjan inte skyddar mot

Det här avsnittet är avsiktligt utförligt. En kedja som beskrivs som starkare än den är blir farligare än ingen kedja alls.

- **Ett konto är ett konto.** Ägaren och agenterna delar samma GitHub-identitet. Kan en agent nå ett giltigt token för kontot — till exempel ett inloggat `gh` i samma terminal — kan den merga precis som ägaren, och ingenting i händelsen skiljer de två åt. Detsamma gällde ordagrant för Approve i ADR 0010, vars påstående att en Approve ”kräver användarens inloggning hos GitHub, inte skrivrättighet till arbetskatalogen” bara håller så länge agenterna saknar ett sådant token. **Det här är kedjans enda verkliga förtroendepunkt**, och den flyttades inte av det här beslutet — den blev bara synlig. Se *Beslut som behövs*.
- **Ägaren kan merga utan att läsa.** Ingen teknik kontrollerar att en människa har läst en text. Kedjan garanterar bara att det som stämplas `godkand` är exakt den text som fanns i den mergade commiten, att den redan var märkt `granskad`, och att inga andra filer följde med.
- **En pull request kan skriva om sin egen domare.** Arbetsflöden som utlöses av `pull_request` körs från pull requestens merge-commit. En gren som ändrar `.github/workflows/godkannande.yml` byter alltså ut kontrollen som ska bedöma den. Kvar står att `.github/` syns i diffen, att `CODEOWNERS` pekar ut sökvägen, och att en **borttagen** kontroll aldrig rapporterar och därför blockerar mergen — det är omskrivningen, inte borttagningen, som är den farliga varianten.
- **Boten får pusha till `main`.** Skrivningen kräver att `github-actions[bot]` får förbigå kravet på pull request i grenskyddet. Det betyder att varje arbetsflöde som ligger på `main` och begär `contents: write` kan skriva till `main`. Arbetsflöden på `main` ändras bara genom en merge, så risken faller tillbaka på föregående punkt.
- **`granskad` är inte heller ett mänskligt bevis.** Fotbollsexperten är en agent. Att en fil står i `granskad` betyder att en agent har skrivit det i en pull request som en människa har mergat. Godkännandet ärver alltså sitt värde från samma merge, inte från två oberoende steg.
- **Vad som återstår som teknik:** att `godkand` inte kan komma in i `main` genom en pull request, att värdet bara kan skrivas av ett arbetsflöde på `main`, att bara filer i `granskad` lyfts, att bara `status` och `granskning` ändras, att omgången inte kan ändra kod i samma svep, och att importen bara läser `godkand`. **Vad som återstår som förtroende:** att ägarens GitHub-konto används av ägaren, och att den som mergar har läst.

### 6 Den dag repot har fler redaktörer

Ingenting i skriptet eller i arbetsflödet behöver då ändras. Det är hela poängen med att lägga signalen på mergen: fler granskare skärper villkoren för att en merge ska kunna ske, inte hur godkännandet skrivs.

| Steg | Ändring |
|---|---|
| Krävda godkännanden på `main` höjs till 1, och kodägargranskning slås på | `CODEOWNERS` blir lager 2 en verklig spärr: en annan människa än författaren måste godkänna innan mergen kan ske. Approve återinförs alltså som villkor **för mergen**, utan att arbetsflödet behöver känna till granskningen |
| ”Dismiss stale pull request approvals” slås på | Ett godkännande överlever inte en ny commit (S-03). Kravet var nödvändigt i ADR 0010 och är en förbättring även här |
| Miljön `godkannande` pekas om till redaktörsgruppen, och ”prevent self-review” slås på | Den som mergade kan då inte själv släppa fram skrivningen |
| Agenterna flyttas till ett eget maskinkonto | Först då blir skillnaden mellan agent och människa teknisk i stället för organisatorisk. Se *Alternativ* och *Beslut som behövs* |

## Alternativ

| Alternativ | Varför det valdes bort |
|---|---|
| **Behålla Approve enligt ADR 0010** | Kan inte inträffa med ett konto. Antingen står grenskyddet på ett krävt godkännande och `main` är permanent blockerat, eller så står det på noll och kedjan är en text utan verkan |
| **Ett maskinkonto för agenterna**, så att ägaren kan godkänna deras pull requests | Det starkaste alternativet på sikt, och det enda som gör skillnaden mellan agent och människa teknisk. Valdes bort nu eftersom det kräver ett andra konto med skrivrättighet till repot, en omläggning av hur varje agent autentiserar sig, och eftersom båda tokens ändå skulle ligga på samma dator. Lyfts under *Beslut som behövs* |
| **Låta kontrollen känna igen arbetsflödets commits på författarnamnet** `github-actions[bot]` (ADR 0010 lager 2) | Författarnamnet sätts fritt med `git commit --author`. En identitet som kan skrivas av den som ska hindras är ingen kontroll. Signaturverifiering vore möjlig men kräver API-anrop och en betrodd nyckelring inne i kontrollen; den undantagslösa regeln behöver ingen identitet alls |
| **Låta arbetsflödet öppna en pull request med statusändringen** i stället för att pusha till `main` | Skulle bevara att `main` bara ändras genom en merge. Faller på att händelser som skapas med `GITHUB_TOKEN` inte startar nya arbetsflödeskörningar: de obligatoriska kontrollerna skulle stå kvar som väntande och pull requesten aldrig gå att merga utan att ägaren förbigår skyddet. Dessutom två klick per omgång i stället för ett |
| **Utlösa arbetsflödet på `pull_request` med `types: [closed]`** | Enklare härkomst, eftersom `merged_by` finns i nyttolasten. Men arbetsflödesfilen hämtas då från pull requestens merge-commit: en gren kan skriva om filen och få `contents: write` när pull requesten stängs, även utan merge. Avvisas av samma skäl som `pull_request_target` |
| **Låta huvudsessionen skriva `godkand` i filen efter kontrollpunkten** | Då är det enda som skiljer en agent från användaren vem som påstår sig ha skrivit raden. Samma skäl som i ADR 0010 |
| **Låta importen räkna ut vilka övningar som är godkända ur git-historiken** | Statusen försvinner ur filen och ur diffen, och banken går inte längre att läsa utan verktyg (ADR 0010 avsnitt 1) |

## Konsekvenser

**Inställningar som beslutet kräver.** Ingen av dem syns eller sätts i repot: de görs av ägaren i GitHubs gränssnitt, och kedjan är aldrig starkare än de är. De bör kontrolleras vid K4.

| Inställning | Värde | Utan den |
|---|---|---|
| Grenskydd på `main`: kräv pull request | På, noll krävda godkännanden, kodägargranskning av | Antingen låser sig repot, eller så kan vem som helst med skrivrättighet pusha `godkand` direkt (S-04) |
| Obligatoriska statuskontroller | `kontroll` och `godkannande` | En röd kontroll hindrar ingen merge, och lager 3 blir rådgivande |
| Blockera force-push och radering av `main` | På | Historiken kan skrivas om, och en godkänd omgång kan bytas ut i efterhand |
| Undantag från kravet på pull request för `github-actions[bot]` | På | Arbetsflödet kan inte pusha, och ingen omgång blir någonsin godkänd |
| Miljön `godkannande` med ägaren som krävd granskare, ”prevent self-review” av | På | Skrivningen sker utan det andra klicket. En miljö som inte finns skapas dessutom automatiskt utan skyddsregler, alltså tyst utan spärr |
| Förvalt `GITHUB_TOKEN`-läge | Read-only | ADR 0002 beslut 4 faller |

**Fördelar**

- Kedjan går att bygga, och den kan faktiskt köra. Det som stod i ADR 0010 kunde inte det.
- Lager 3 blir undantagslöst och behöver ingen identitet: kontrollen frågar vad en ändring gör, inte vem som gjorde den.
- TOCTOU-luckan i S-03 försvinner utan extra konstruktion. Det som stämplas är det som mergats.
- Logiken ligger i ett testat TypeScript-skript med enhetstester, och kan köras lokalt som torrkörning innan den körs skarpt.
- En omgång kan inte ändra kod i samma svep som den ändrar övningar, vilket stänger vägen där en merge byter ut den kod arbetsflödet sedan kör.

**Nackdelar och risker**

- **Ett klick till per omgång.** Miljögodkännandet är det som gör skrivningen till en medveten handling och inte en följd av mergen. Väljer användaren bort det vilar allt på mergen.
- **Statuscommiten landar direkt på `main` utan granskning.** Innehållet begränsas av skriptet, som bara rör `status` och `granskning`, och jobbet före validerar hela banken. Men en bugg i skriptet skriver till `main` utan mellanhand.
- **Pushar med `GITHUB_TOKEN` startar inga nya körningar.** Två följder. Den fullständiga körningen på `main` körs inte om för statuscommiten, och därför kör arbetsflödet valideringen själv innan det skriver. Viktigare: **`importera-banken` (ADR 0010 avsnitt 2) kan inte förlita sig på sin push-utlösare för statuscommiten.** Importen måste anropas från `godkann-omgang`, som ett efterföljande jobb eller ett återanvändbart arbetsflöde. Annars når omgången aldrig databasen. Det är ett krav på den som bygger importen i ett senare inkrement.
- **Fönstret mellan merge och skrivning.** Fram till miljögodkännandet ligger omgången på `main` med `granskad`. Ingenting får importeras i det fönstret, vilket är samma krav som punkten ovan.
- **Kontrollen kör basgrenens beroenden.** `npm ci` sker från basgrenens låsfil (S-03), så en pull request som lägger till ett beroende får det inte installerat i just det jobbet. Kontrollen behöver bara `yaml` och Node, men börjar skriptet bero på något nytt måste beroendet mergas först.
- **ADR 0010 avsnitt 3 står kvar oförändrad** och beskriver en kedja som aldrig byggdes. Läsaren måste följa hänvisningen hit. Det är priset för att beslut inte skrivs om i efterhand.
- **`content/ovningar/README.md` säger fortfarande** att värdet skrivs ”när användaren har godkänt omgångens pull request”. Meningen behöver bytas mot att omgången har *mergats*. Filen ligger i den mapp fotbollsexperten granskar just nu och har inte ändrats här.

## Beslut som behövs

Två frågor som den här ADR:n inte kan avgöra själv. Avsnitt 5 och 6 hänvisar hit.

| Fråga | Rekommendation |
|---|---|
| **Ska agenterna flyttas till ett eget maskinkonto?** I dag delar ägaren och agenterna GitHub-identitet. Först med ett andra konto blir skillnaden mellan agent och människa teknisk, och först då blir `CODEOWNERS` och krävda godkännanden verkliga spärrar (avsnitt 6) | Inte nu. Kedjan fungerar utan det, och båda tokens skulle ändå ligga på samma dator, vilket ger mindre än det ser ut. Ta upp frågan igen om repot får fler skribenter, eller om agenterna någon gång ska köra utan att ägaren sitter vid tangentbordet |
| **Ska ett inloggat `gh` i samma terminal som agenterna räknas som en godtagbar risk?** Kedjans enda verkliga förtroendepunkt är att ägarens konto används av ägaren. Ett inloggat `gh` i agenternas miljö gör mergen till något en agent kan utföra, och ingenting i händelsen skiljer de två åt (avsnitt 5) | Nej. Rekommendationen är att ägaren mergar i webbläsaren och att agenternas miljö inte har ett `gh` som är inloggat mot repot med skrivrättighet. Det är en arbetsvana, inte en inställning i repot, och den bör skrivas in i `CLAUDE.md` om användaren väljer den |
