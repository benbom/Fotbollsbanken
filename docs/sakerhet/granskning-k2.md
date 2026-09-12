Status: granskning inför K2 (2026-09-12)

# Säkerhets- och dataskyddsgranskning inför K2

**Granskare:** agenten `sakerhet-integritet` · **Underlag:** docs/adr/0001–0005 och 0010, docs/krav/ och docs/design/ · **Ingen kod finns ännu**, så granskningen gäller besluten och datamodellen.

Rapporten är återgiven som agenten lämnade den. Huvudsessionen har sparat den i repot.

## 1 Sammanfattning

Arkitekturen är i grunden sund: RLS som enda behörighetsgräns, `club_id` på varje tabell, statusändringar bara via `security definer`-funktioner och ögonblicksbilder i sparade pass är rätt val för det här problemet, och ADR-författaren har själv pekat ut flera av de känsliga punkterna. De allvarligaste bristerna ligger inte i modellen utan i det som ännu inte är sagt: **UPDATE-reglerna på `exercises` saknar skydd för kolumnerna `scope`, `club_id` och `origin`**, vilket i dag skulle låta vilken ledare som helst publicera ogranskat innehåll i den gemensamma banken och därmed kringgå hela redaktörskedjan, och **vyn `club_exercises_v` blir en tvärklubbsläcka om den inte skapas med `security_invoker`**. Godkännandekedjan i fyra lager är väl tänkt, men lager 1 (grenskydd) existerar inte i dag på ett privat gratiskonto, och lager 3 har en TOCTOU-lucka: ett Approve gäller en viss commit, inte grenens huvud. Fritext och `planskiss` saknar helt storleks- och innehållsgränser, vilket är både en lagrad XSS-väg mellan klubbar och ett sätt att fylla 500 MB-gränsen. GDPR-grunden är god (inga spelaruppgifter, EU-region, minimal profil), men rättslig grund, lagringstid, kontoradering och integritetspolicy saknas helt, och säkerhetskopior som artefakter i GitHub Actions är den enda punkten där förslaget aktivt strider mot kravet att personuppgifter ska ligga i EU.

## 2 Fynd

Nio fynd måste lösas före K2 eftersom de ändrar besluten i ADR:erna. Övriga är genomförandekrav som hör hemma i fas 4 men bör skrivas in i ADR:erna nu.

### Kritisk

**S-01 · Kritisk · 0003, *Behörighet och isolering*, rad 273 och princip 3, rad 27 · Före K2**

Tabellen ger klubbens medlemmar `update` på `exercises` med `scope = club`. Princip 3 skyddar `status`, `is_admin` och redaktörstabellen, men nämner inte `scope`, `club_id`, `origin`, `approved_by` eller `source_id`.

*Scenario:* en ledare öppnar webbläsarens konsol och kör `update exercises set scope='bank' where id=<sin egen övning>`. Övningen syns omedelbart för alla klubbar och väljs av generatorn i hela appen, utan att någon redaktör sett den. Samma väg med `set club_id=<annan klubb>` flyttar eller planterar data i en främmande klubb.

*Åtgärd:* varje UPDATE-policy får både `using` och `with check`, och `with check` binder `scope`, `club_id` och `origin` till oförändrade värden. Komplettera med kolumnrättigheter (`revoke update (scope, club_id, origin, approved_by, source_id) on exercises from authenticated`) och en `check`-begränsning som kräver `origin = 'club'` när `scope = 'club'`. pgTAP-test som visar att alla fem kolumnerna nekas.

**S-02 · Kritisk · 0010, avsnitt 1, rad 93 (`club_exercises_v`) · Före K2**

En vy i Postgres körs med vyägarens rättigheter och går förbi RLS på de underliggande tabellerna om den inte skapas med `security_invoker = true`.

*Scenario:* `club_exercises_v` ägs av `postgres`. En ledare i klubb A gör `select * from club_exercises_v` och får tillbaka samtliga klubbars egna övningar, inklusive fritext. Ingen policy överträds, eftersom vyn aldrig utvärderar dem.

*Åtgärd:* alla vyer skapas med `with (security_invoker = true)`, och CI-kontrollen i 0003 princip 1 utökas till att underkänna varje vy i `public` som saknar flaggan, inte bara tabeller utan RLS.

### Hög

**S-03 · Hög · 0010, avsnitt 3, lager 2 och 3, rad 154–158 · Före K2**

Arbetsflödet `godkann-omgang` startas av `pull_request_review` med `state: approved`. Händelsen bär den commit som granskades (`review.commit_id`), men inget i beslutet säger att arbetsflödet stämmer av den mot grenens huvud, eller att lager 2 måste ha gått igenom innan lager 3 kör.

*Scenario:* huvudsessionen lägger fram omgången, användaren läser övningarna och trycker Approve. En agent pushar en sekund senare en ny commit till samma gren, med ändrad text i två övningar. Arbetsflödet checkar ut grenens huvud och stämplar `godkand` på innehåll som användaren aldrig läst. Samma händelse ger dessutom `contents: write` och tillgång till hemligheter: om arbetsflödet kör något från grenen — `npm ci` med ändrade `scripts`, eller `scripts/validera-ovningar.ts` — kör en agents kod med skrivrättighet till repot.

*Åtgärd:* (a) arbetsflödet checkar ut exakt `github.event.review.commit_id`, jämför med `pull_request.head.sha` och avbryter vid skillnad, (b) slå på ”Dismiss stale pull request approvals when new commits are pushed” i grenskyddet, (c) arbetsflödet kör bara betrodd kod från basgrenen och aldrig `npm ci` från PR-grenen, (d) lager 3 kräver att lager 2 har grönt för samma SHA, (e) verifiera att granskaren är kodägare, eftersom `pull_request_review` utlöses av vilken granskare som helst.

**S-04 · Hög · 0002, *Drift och risker*, rad 118, och 0010, *Konsekvenser*, rad 277 · Före K2**

Lager 1 i godkännandekedjan är grenskydd på `main`. ADR 0002 konstaterar att skyddade grenar i ett privat repo enligt uppgift kräver en betald GitHub-plan.

*Scenario:* i dag kan vem som helst med skrivrättighet — inklusive varje agent som kör med användarens git — pusha direkt till `main` med `status: godkand` i en fil och nästa import lägger in övningen i banken. Hela den mänskliga godkännandegarantin vilar då på arbetsflödet i `CLAUDE.md`, inte på teknik.

*Åtgärd:* besluta grenskyddet innan fas 3 mergas. Det är gratis om repot görs publikt, vilket är ett skäl till att göra det (se avsnitt 4). Kräv `CODEOWNERS`-granskning för `content/ovningar/**`, `.github/workflows/**` och `supabase/migrations/**`, förbjud force-push och sätt förvalt `GITHUB_TOKEN`-läge till read-only.

**S-05 · Hög · 0003 rad 283, och 0010 avsnitt 3, rad 156 och 168 · Före K2**

Servicenyckeln används i CI för importen. Två problem. För det första är sprängradien total: nyckeln går förbi RLS och läser och skriver allt, inklusive `auth.users`. För det andra är påståendet i 0010 rad 168–169 att ”servicenyckeln kan inte godkänna” inte tekniskt sant. `check`-begränsningen kräver bara att `approved_by` är satt, och den som har servicenyckeln kan sätta den till vilket uuid som helst och skriva in en bankövning med `origin = submission` utan att `approve_submission` någonsin körts.

*Scenario:* en agent lägger till ett arbetsflöde som skriver ut `secrets.SUPABASE_SERVICE_ROLE_KEY` i en logg, eller ändrar importskriptet till att skriva en extra rad. Resultatet är både full läsning av ledarnas e-postadresser och en förfalskad bankövning.

*Åtgärd:* ta bort servicenyckeln ur CI. Skapa en egen databasroll `importer` med `noinherit`, utan `bypassrls`, som bara får `execute` på en `security definer`-funktion `import_bank_exercises(jsonb)` som i sin tur bara kan skriva rader med `origin = 'repo'` och sätta `retired_at`. Lagra den rollens nyckel som miljöhemlighet knuten till en GitHub Environment med krav på godkännande. Formulera om påståendet i 0010 till att skyddet mot förfalskat godkännande är organisatoriskt så länge en nyckel med `bypassrls` finns i CI.

**S-06 · Hög · 0003, *Behörighet och isolering*, rad 254–261 och princip 3 · Före K2**

Funktioner i Postgres får som förval `execute` till `public`, och PostgREST exponerar allt i schemat `public` som RPC för både `anon` och `authenticated`.

*Scenario:* den publika nyckeln finns i klientbygget och är avsedd att vara publik. En utomstående anropar `POST /rest/v1/rpc/create_club` eller `appoint_editor` utan att vara inloggad. `appoint_editor` skyddas av `is_editor()`, men `is_editor()` med `auth.uid() = null` måste då bevisligen returnera falskt, och funktioner utan egen kontroll — till exempel dubblettkontrollen av klubbnamn i rad 189 — är öppna för anonym uppräkning av klubbnamn.

*Åtgärd:* skriv in som princip att varje funktion får `revoke execute from public, anon` och därefter uttrycklig `grant execute to authenticated`, att varje `security definer`-funktion börjar med en kontroll av att `auth.uid()` inte är null, och att `search_path` låses med `set search_path = ''` och helt kvalificerade tabellnamn. Ett pgTAP-test per funktion som visar att anonym åtkomst nekas.

**S-07 · Hög · 0010, avsnitt 1, rad 91 (`planskiss` reserverat) · Före K2**

Fältet `planskiss` är avsiktligt ogenomskinligt för valideringen: ”Valideringen underkänner alltså aldrig en övning på grund av skissens innehåll.” Samtidigt får ledare skapa egna övningar med planskiss (berättelse 13.3) och skicka in dem, och skissdata ritas som SVG i klienten, i planläget och i utskriften.

*Scenario:* en ledare lägger godtycklig JSON i sin övnings `planskiss`, till exempel en textetikett med `<script>` eller ett attributvärde som `onload=`. Om ritmotorn någonstans bygger SVG som sträng, eller släpper igenom attribut den inte känner igen, blir det lagrad XSS. Övningen skickas in, redaktören ser en normal skiss, godkänner den, och ögonblicksbilden kopieras till banken och distribueras till samtliga klubbar och cachas i varje ledares IndexedDB. En XSS i det läget stjäl förnyelsetoken ur localStorage och ger varaktig åtkomst.

*Åtgärd:* skissdata för **ledarskapade** övningar måste valideras strikt av Zod redan vid `insert`, med en sluten lista av former och bara primitiva värden. Ritmotorn får bara skapa React-element, aldrig SVG-strängar, aldrig `dangerouslySetInnerHTML` och aldrig `foreignObject`. Skriv in i ADR 0010 att undantaget i rad 91 gäller repofiler, inte innehåll från appen, och lyft kravet till planskissutvecklarens ADR. Lägg till ESLint-regeln `react/no-danger` som fel.

**S-08 · Hög · 0003 rad 203 (`content` jsonb) och 0010 avsnitt 1 · Före K2**

Inget dokument anger någon storleksgräns för `content`, `planskiss`, passnamn eller redaktörens kommentar, och inget tak för antal rader per klubb. Schemat begränsar `namn` och `syfte`, men bara för filer som ska bli bankövningar; en egen övning får vara ofullständig och kontrolleras inte på samma sätt.

*Scenario:* en ledare med ett giltigt konto skriver ett skript som skapar 5 000 klubbövningar med 100 kB `content` var. Databasen slår i gratisnivåns 500 MB, Supabase gör databasen skrivskyddad, och appen slutar fungera för alla klubbar. Samma data laddas dessutom ned till varje klubbmedlems IndexedDB vid nästa synk. Detta är den enklaste vägen att sabotera driften för alla.

*Åtgärd:* `check`-begränsningar på textlängder (passnamn 100, kommentar 2 000, `beskrivning` 5 000) och `pg_column_size(content) < 100000`, samt tak per klubb och per användare (till exempel 1 000 övningar per klubb, 200 pass per ledare och dygn) som upprätthålls i databasen. Sätt även `max_rows` i PostgREST så att en enskild fråga inte kan hämta hela banken i ett svep.

**S-09 · Hög · 0002, beslut 6, rad 79, tillsammans med rad 111 (publikt repo) · Före K2**

En krypterad veckodump sparas som artefakt i GitHub Actions i 30 dagar.

*Scenario:* om repot görs publikt blir artefakter nedladdningsbara för utomstående. Krypteringen är då den enda kvarvarande spärren, och om krypteringsnyckeln ligger som hemlighet i samma repo kan varje agent som får igenom en arbetsflödesfil både hämta dumpen och nyckeln. Resultatet är samtliga ledares namn och e-postadresser i orätta händer. Dessutom lagras artefakter hos GitHub utanför EU, vilket krockar med kravet i 0002 rad 11.

*Åtgärd:* kryptera med publik nyckel, till exempel `age`, där **bara den publika nyckeln finns i repot och den privata nyckeln aldrig finns i GitHub**. Då kan CI skapa säkerhetskopian men aldrig läsa den, och en stulen CI-hemlighet ger inget. Behåll 30 dagars lagringstid, och ta upp den kvarvarande överföringen till GitHub under *Beslut som behövs*.

### Medel

**S-10 · Medel · 0003, *Konsekvenser*, rad 322 · Före K2 som modellbeslut, bygge i inkrement 3**

”Hur kontoradering går till beslutas i fas 5.” Det är för sent: rätten till radering enligt artikel 17 påverkar nycklar, `on delete`-beteende och om `created_by` får vara null. Ingen berättelse täcker radering, och det finns ingen funktion för det i listan i princip 3.

*Scenario:* en ledare slutar i klubben och begär radering. Utan en färdig väg måste användaren radera för hand i Supabase dashboard, missar `team_members` och personliga pass, och kan inte visa att begäran verkställts inom en månad.

*Åtgärd:* lägg till `delete_my_account` i princip 3 nu. Den ska i en transaktion ta bort profil, medlemskap, inbjudningar och pass med `team_id is null`, sätta `created_by`, `submitted_by` och `actor_id` till null på delat material, och sedan radera `auth.users`-raden via Edge Function. Definiera vad som händer när den sista klubbadminen raderar sig (blockera, eller kräv att en ny utses först). Begär en berättelse av produktägaren.

**S-11 · Medel · 0004, punkt 5, rad 24, och *Konsekvenser*, rad 95 · Fas 4, inkrement 3**

Sessionen gäller tills ledaren loggar ut, och tidsbegränsade sessioner är enligt ADR:n en Pro-funktion. Förnyelsetoken ligger som förval i localStorage.

*Scenario:* en ledare tappar sin olåsta telefon på planen. Upphittaren öppnar den installerade appen och har full åtkomst till lagets pass, klubbens övningar och namnen på klubbens övriga ledare, utan tidsgräns. Ledaren har i dag inget sätt att avbryta det.

*Åtgärd:* risken är godtagbar för det här innehållet, men lägg till ”Logga ut på alla enheter” i version 1. `supabase.auth.signOut({ scope: 'global' })` återkallar alla förnyelsetoken och ingår i gratisnivån. Kombinera med S-17 (CSP), som är det verkliga skyddet för token i localStorage.

**S-12 · Medel · 0005, punkt 2 och 4, rad 37–43 · Fas 4, inkrement 3**

TanStack Query persistas till IndexedDB med `idb-keyval`. Beslutet säger att utloggning rensar cachen, men inte att cachen är åtskild per användare.

*Scenario:* två ledare i samma familj delar en surfplatta. Ledare A stänger appen utan att logga ut, och sessionen går ut. Ledare B loggar in, appen hydrerar cachen från disk innan den första hämtningen hinner klart, och B ser A:s lags pass och säsongsplan — data från ett lag B inte tillhör. Samma sak händer om utloggningen avbryts av att nätet försvinner.

*Åtgärd:* nyckla persistlagret på användarens `sub` och sätt `buster` till samma värde, så att en annan användares cache aldrig hydreras. Rensa på `onAuthStateChange` för både `SIGNED_OUT` och `USER_DELETED`, och rensa vid uppstart om lagrat `sub` inte matchar sessionens.

**S-13 · Medel · 0004, *Konsekvenser*, rad 93 · Fas 4, inkrement 3**

`shouldCreateUser: false` gör att svaret avslöjar om en e-postadress har ett konto.

*Scenario:* någon provar adresser till kända personer i föreningen och får veta vilka som är ledare i appen. Det är begränsat känsligt, men onödigt.

*Åtgärd:* svara alltid likadant och gå alltid vidare till kodsteget: ”Om adressen finns hos oss har vi skickat en kod.” Detta krockar inte med kriterium 08.3, som handlar om **fel kod**, inte om okänd adress; där ska felmeddelandet fortsatt vara tydligt. Undantaget är redaktörens uppslagning (18.2), som med nödvändighet röjer existens — se S-15.

**S-14 · Medel · 0004, inbjudningsflödet, rad 44 och 54 · Fas 4, inkrement 3**

Inbjudningstoken skickas som frågeparameter, `/inbjudan?token=...`.

*Scenario:* frågesträngen hamnar i webbläsarhistoriken, i delade skärmdumpar och i `Referer` mot varje extern resurs sidan laddar, till exempel Turnstiles skript hos Cloudflare. En token som läcker ger tillgång till laget för den som också kontrollerar den inbjudna adressen — begränsat, men i onödan.

*Åtgärd:* lägg token i URL-fragmentet (`/inbjudan#token=...`), som aldrig skickas till någon server, eller ta bort den ur adressfältet med `history.replaceState` direkt efter läsning. Sätt `Referrer-Policy: no-referrer`. Kräv minst 128 bitars slumpmässig token, lagra bara SHA-256, slå upp på hash och begränsa antalet misslyckade uppslagningar per IP.

**S-15 · Medel · 0003, rad 184 och 281 · Före K2 som rollbeslut**

Redaktör är en global roll. En redaktör kan utse och återkalla andra redaktörer, och kan slå upp konton på e-postadress. `revoke_editor` hindrar bara att den **sista** redaktören tas bort.

*Scenario:* användaren utser en hjälpredaktör inför säsongen. Den personen anropar `revoke_editor` på användarens eget konto och är därefter ensam redaktör med kontroll över hela den gemensamma banken. Ingen i appen kan ta tillbaka rollen — den första redaktören lades in med ett engångsskript. Uppslagningsfunktionen kan dessutom användas för att prova sig fram till vilka adresser som har konton.

*Åtgärd:* markera den ursprungliga redaktören som ägare i `editors` och tillåt inte att den raden återkallas av någon annan än sig själv. Alternativt: en redaktör får aldrig återkalla den som utsåg hen. Logga varje `appoint_editor` och `revoke_editor` i en spårningstabell. Låt uppslagningen kräva exakt fullständig adress, aldrig delsträng, och begränsa antalet sökningar per redaktör och dygn.

**S-16 · Medel · 0003, *Behörighet och isolering*, rad 265 mot rad 267 · Före K2**

Raderna säger emot varandra. `profiles` får läsas för ”personer som man delar lag **eller klubb** med”, medan `club_members` bara får läsas för ”sig själv och de som finns i samma lag”.

*Scenario:* den som skriver policyerna väljer den bredare tolkningen, och varje ledare i en stor klubb kan lista namnen på klubbens samtliga ledare trots att modellens princip är att ledaren bara ser sitt eget lag. Det är ingen tvärklubbsläcka, men det är mer än vad 11.2 utlovar och det finns ingen enskild sanning att testa mot.

*Åtgärd:* bestäm en av tolkningarna i ADR:n före K2. Rekommendation: samma lag, plus klubbadmin som ser hela klubben. Skriv om rad 265 så att den matchar rad 267.

**S-17 · Medel · 0002, beslut 1, rad 62 · Före K2 som beslut, bygge i inkrement 1**

Ingen ADR nämner säkerhetsheaders eller innehållspolicy. Cloudflare Pages levererar dem via en `_headers`-fil, vilket är gratis och görs en gång.

*Scenario:* en XSS via S-07 eller ett komprometterat npm-paket kan fritt anropa vilken domän som helst och skicka ledarens förnyelsetoken dit. Utan `frame-ancestors` kan appen dessutom ramas in för clickjacking mot till exempel ”Ta bort ledare ur laget”.

*Åtgärd:* skriv in i ADR 0002 att bygget levereras med `Content-Security-Policy` med `default-src 'self'`, `connect-src` begränsad till projektets Supabase-domän och Turnstile, `object-src 'none'`, `base-uri 'none'`, `frame-ancestors 'none'`, samt `Strict-Transport-Security`, `X-Content-Type-Options: nosniff` och `Referrer-Policy: no-referrer`. Verifiera i CI att headern finns i bygget.

**S-18 · Medel · 0004, punkt 3, rad 22 · Fas 4, inkrement 3**

De exakta gränserna för antal kodförsök och kodbeställningar lämnas till mig, men går inte att fastställa utan ett projekt att läsa inställningarna i. En sexsiffrig kod har 10^6 möjligheter och gäller i 10 minuter.

*Scenario:* om flera koder till samma adress är giltiga samtidigt och antalet verifieringsförsök inte är hårt begränsat, kan en angripare beställa många koder och gissa parallellt. Med en giltig kod tar angriparen över ett ledarkonto helt, eftersom det inte finns något lösenord som andra faktor.

*Åtgärd:* dokumentera som krav, och verifiera i inkrement 3 mot det faktiska projektet: högst 5 verifieringsförsök per kod varefter koden ogiltigförklaras, en ny kod ogiltigförklarar den föregående, minst 60 sekunders väntan mellan beställningar, kodlängd 8 om Supabase tillåter det, och Supabase Auths timgräns satt till 100 enligt ADR 0004. Turnstile framför beställningen är ett komplement, inte en ersättning.

**S-19 · Medel · 0003, princip 6, rad 37 · Före K2 som princip**

Mjuk borttagning används för lag, övningar och pass, och inget dokument anger någon lagringstid för något annat än inbjudningar (30 dagar).

*Scenario:* en ledare tar bort en egen övning som råkar innehålla ett spelarnamn i fritexten. Raden får `deleted_at` men ligger kvar för alltid, med `created_by` intakt, och följer med i varje veckodump. Personuppgiften är i praktiken oraderbar trots att användaren tror att den är borta.

*Åtgärd:* fastställ lagringstider i ADR 0003: mjukt borttagna rader rensas hårt av ett `pg_cron`-jobb efter 90 dagar, arkiverade lag och säsongsplaner efter en definierad tid, och konton utan inloggning på 24 månader varnas och raderas.

**S-20 · Medel · 0003, `TEAMS.name` rad 84, `TRAINING_SESSIONS.name` rad 146, `SUBMISSION_EVENTS.comment` rad 137 · Före K2 som princip, texter i fas 4**

ADR 0003 rad 320 konstaterar korrekt att spelarnamn kan smyga in i fritext och att det inte går att hindra tekniskt. Det starkaste exemplet är dock inte nämnt: **lagnamnet**. Ett lag som heter ”P2015 Kalles grupp” är exakt det scenario uppdraget varnar för, och lagnamnet visas för hela klubben och följer med i varje pass.

*Åtgärd:* behandla detta som ett krav på gränssnittet, inte som en restrisk. Kort hjälptext vid lagnamn, passnamn, egna övningars fritextfält och redaktörskommentar: ”Skriv inga namn på spelare.” Samma mening bör stå i integritetspolicyn och i den text klubbadmin ser när en klubb skapas. `texter.md` rad 36 har en början, men den sitter bara vid registreringen. Detta är UX-designerns område och behöver beställas.

### Låg

**S-21 · Låg · 0010, *Konsekvenser*, rad 279, och `content/ovningar/README.md` rad 66 · Före beslut om publikt repo**

`granskning.av` och `kalla` är fritext i filer som blir publika. ADR:n har redan identifierat frågan: den är hanterbar, men behöver en regel och en kontroll.

*Åtgärd:* `av` ska innehålla roll och förnamn eller ett handtag, aldrig e-postadress. `kalla` ska hänvisa till publicerat material, aldrig till en privatperson. Lägg till i valideringsskriptet att fälten underkänns om de innehåller ett `@`-tecken eller ett mönster som liknar en e-postadress. Användarens eget GitHub-namn som CI skriver i `granskning` är redan publikt och oproblematiskt.

**S-22 · Låg · `.gitignore` rad 1–2 · Före beslut om publikt repo**

`.gitignore` ignorerar i dag bara `.claude/settings.local.json`. Ingen kod finns ännu, vilket gör det här till det billigaste tillfället att göra rätt.

*Åtgärd:* lägg till `.env`, `.env.*`, `!.env.example`, `supabase/.temp/`, `*.key`, `*.pem`, `.wrangler/` och `dist/` innan fas 4 börjar. Kör en historikskanning (gitleaks eller `trufflehog git file://.`) före publicering; historiken är i dag 73 filer utan kod, så den är rimligen ren, men det ska visas och inte antas.

**S-23 · Låg · 0002, beslut 1 och 2, rad 62 och 65 · Fas 4**

Varje gren får en gissningsbar förhandsadress som pekar på stagingprojektet.

*Scenario:* en förhandsversion med en halvfärdig RLS-policy ligger öppet på internet. Så länge staging bara innehåller testdata är skadan begränsad, men om någon en gång kopierar produktionsdata dit blir den publik.

*Åtgärd:* håll fast vid ”aldrig riktiga personuppgifter i staging” som en regel som testas, ge staging egna nycklar, och överväg Cloudflare Access framför förhandsversionerna (gratis upp till 50 användare).

**S-24 · Låg · 0002, gratisnivån inkluderar 1 GB fillagring · Fas 4**

Version 1 laddar inte upp några filer — planskisser är data, inte bilder — men Supabase Storage finns aktiverat i projektet.

*Åtgärd:* bekräfta att inga buckets skapas, och låt CI-kontrollen som verifierar RLS även underkänna bygget om `storage.buckets` innehåller rader. En bucket med öppen policy är en av de vanligaste läckorna i Supabase-projekt.

**S-25 · Låg · 0001, *Paket och körmiljö*, rad 44 · Fas 4, inkrement 1**

`npm audit` går inte att köra: det finns ingen `package.json` i repot. Licensbilden i ADR 0001 och 0005 är däremot i sin ordning — MIT, Apache-2.0, PostgreSQL och MPL-2.0 (bara utvecklingsverktyg) är alla förenliga med projektets Apache-2.0-licens, och `yaml` (MIT) i 0010 likaså.

*Åtgärd:* lägg in `npm audit --audit-level=high` som ett steg som underkänner bygget från och med inkrement 1, aktivera Dependabot enligt ADR 0001 och slå på GitHub Secret Scanning med Push Protection (gratis för publika repon).

## 3 GDPR

**Dataminimering.** Bra utgångsläge och medvetet byggt: inga spelaruppgifter, `profiles` innehåller bara visningsnamn, passets `input` bara antal. Den verkliga läckan är fritext, och lagnamnet är den mest sannolika bäraren av ett barns namn (S-20). Att spelarnamn kan hamna i övningsfilerna är redan förbjudet i `content/ovningar/README.md`, vilket är rätt nivå. Kvarstår före K5: vägledning i gränssnittet på fyra ställen och en mening i policyn.

**Rättslig grund.** Inte beslutad någonstans. Samtycke är fel grund här — en ledare som måste använda appen för att kunna leda sitt lag samtycker inte frivilligt, och samtycke kan återkallas när som helst. Rekommendation: **avtal eller berättigat intresse** för ledarnas konton, med en enkel intresseavvägning dokumenterad.

**Integritetspolicy.** Saknas. Måste finnas före K5, nåbar utan inloggning, och behöver täcka: vilka uppgifter (namn, e-post, klubb- och lagtillhörighet, IP hos Cloudflare), ändamål, rättslig grund, biträden (Supabase, Cloudflare, Brevo, GitHub om säkerhetskopiorna ligger kvar där), lagringstider, rättigheter och kontaktväg. Att redaktörer i andra klubbar ser inskickade övningar och vem som skickade in dem hör också hemma där.

**Radering av konto.** Ingen väg finns, och beslutet är uppskjutet till fas 5 (S-10). Det räcker inte: rätten är ovillkorlig och måste verkställas inom en månad. Modellen klarar det redan tack vare `created_by = null` på delat material — det som saknas är funktionen och en berättelse. Delat material (lagpass, klubbövningar, godkända bankövningar) får och bör finnas kvar avidentifierat; det är en rimlig avvägning, men det ska stå i policyn så att ledaren vet det i förväg.

**Lagringstid.** Bara inbjudningar har en tid (30 dagar, bra och genomtänkt). Allt annat saknar gräns, och mjuk borttagning gör personuppgifter i praktiken permanenta (S-19).

**Säkerhetskopior.** Se S-09 och avsnitt 4. En kopia är en behandling som ska stå i policyn, ha en lagringstid och omfattas av raderingsrutinen: om en ledare raderas finns hen kvar i dumpar i upp till 30 dagar, vilket är godtagbart men ska vara dokumenterat.

**Lagring inom EU.** Supabase i `eu-north-1` eller `eu-central-1` är rätt val, och DPA:n stöder det uttryckligen. Två avvikelser: Cloudflare lokaliserar inte till EU utan tillägget Data Localization Suite (betalt) och behandlar besökarnas IP-adresser globalt, och GitHub Actions-artefakter ligger utanför EU. Båda hanteras med standardavtalsklausuler, men de ska erkännas i stället för att antas bort.

**Personuppgiftsbiträdesavtal.** Kontrollerat 2026-09-12:

- **Supabase** — DPA finns på `supabase.com/legal/dpa` och gäller genom avtalet: ”acceptance of the Agreement shall have the same effect as signing the SCCs”. Regionsval respekteras: ”Where Customer directs Supabase to Process Covered Data in a specific geographical region, Supabase shall ensure that such Covered Data is stored and primarily Processed in that region.” Underbiträdeslista publiceras med 30 dagars varsel. Ordet ”primarily” betyder att stödprocesser kan ske utanför EU. **Godtagbart.** Kvar före K5: läs underbiträdeslistan.
- **Cloudflare** — DPA finns på `cloudflare.com/cloudflare-customer-dpa/` med EU-SCC inbyggda, generellt förhandsgodkännande av underbiträden och tio dagars invändningsrätt. Ingen EU-lokalisering som förval. Dokumentet anger inte uttryckligen att det omfattar gratisplaner. **Godtagbart för statiska filer och IP-adresser**, men gratisplanens täckning bör bekräftas före K5.
- **Brevo** — **inte verifierat.** Tre olika adresser gav 404 eller tomt innehåll. Brevo är ett franskt bolag och det är sannolikt att data ligger i EU, men det får inte antas, särskilt eftersom **samtliga ledares e-postadresser passerar Brevo**. Kvar före K5: bekräfta DPA, serverplacering och hur länge Brevo sparar sändningsloggar. Om det inte går att bekräfta är detta ett skäl att ompröva leverantören.
- **GitHub** — blir biträde först om säkerhetskopiorna sparas där.

**Barnperspektivet.** Värt att notera som en styrka: eftersom inga spelaruppgifter behandlas finns inga barns personuppgifter i systemet, och därmed ingen fråga om åldersgräns eller vårdnadshavares samtycke. Hela det skyddet vilar på att fritextfälten hålls rena — vilket gör S-20 viktigare än dess allvarlighetsgrad antyder.

## 4 Besked om säkerhetsförslagen

**CAPTCHA med Cloudflare Turnstile: ja, tillstyrks.** Utan skydd kan vem som helst tömma e-postkvoten och därmed stänga ute alla nya inloggningar för dygnet. Turnstile behandlar enligt Cloudflares egen integritetsbilaga (läst 2026-09-12) ”client IP address, TLS Fingerprint, User-Agent Header and Sitekey and associated origin”, och Cloudflare skriver uttryckligen att ”The purpose of collecting these Signals is not to identify, profile or target any individuals but solely to detect and block bots”. Tre skäl till att det är rätt val här: Cloudflare är redan biträde genom Pages och ser redan dessa uppgifter som CDN; Turnstile är i normalfallet icke-interaktivt och därmed betydligt bättre för WCAG 2.2 AA än bildbaserade alternativ; och det är gratis. Villkor: nämn det i integritetspolicyn, ta med Turnstile i CSP:n (S-17), och låt det aldrig ersätta gränserna i S-18.

**Säkerhetskopior som krypterad dump i GitHub Actions: ja, men bara med publik nyckel.** Behovet är verkligt — Supabase Free har inga säkerhetskopior alls. Förslaget som det står har dock två svagheter: om krypteringsnyckeln är en hemlighet i samma repo skyddar krypteringen inte mot det troligaste hotet, och artefakter blir världsläsbara om repot görs publikt. Ändra till kryptering med **publik nyckel** (`age` eller `gpg`), där den publika nyckeln checkas in och den privata nyckeln bara finns hos användaren, utanför GitHub. Då kan CI skapa kopian men aldrig läsa den. Behåll 30 dagars lagringstid. Testa dessutom en återläsning en gång; en säkerhetskopia som aldrig återlästs är en förhoppning, inte en kopia.

**Publikt repo: ja, tillstyrks, och det är bättre att göra det nu än senare — men först efter sju åtgärder.** Fördelarna är konkreta och löser andra fynd: Actions blir gratis, grenskydd blir gratis och därmed blir lager 1 i godkännandekedjan verkligt (S-04), och Secret Scanning med Push Protection ingår. Historiken är just nu 73 filer utan en rad kod, vilket är det billigaste tillfälle som någonsin kommer att finnas. Krav före publicering:

1. Historikskanning efter hemligheter, redovisad (S-22).
2. `.gitignore` kompletterad innan någon kod skrivs (S-22).
3. Grenskydd, `CODEOWNERS` och read-only som förval för `GITHUB_TOKEN`, aktiverat samtidigt.
4. Inga arbetsflöden som utlöses av `pull_request_target`, och inga hemligheter till arbetsflöden som utlöses av PR från forkar.
5. Säkerhetskopior enligt punkten ovan, med publik nyckel, innan repot blir publikt.
6. Regel och CI-kontroll för `granskning.av` och `kalla` (S-21).
7. Klargör att Supabases publika nyckel **är avsedd att ligga i klientbygget och därför inte är en hemlighet**. Servicenyckeln är motsatsen och ska efter S-05 inte finnas i CI över huvud taget. Att RLS-policyerna blir läsbara för utomstående sänker inte säkerheten om de är riktiga, men det höjer kravet på att S-01, S-02 och S-06 är lösta och testade först.

## 5 Beslut som behövs

1. **Rättslig grund för ledarnas konton.** Rekommendation: avtal, i andra hand berättigat intresse — inte samtycke, eftersom en ledare i praktiken inte kan avstå och ett återkallat samtycke skulle tvinga fram radering mitt i säsongen.
2. **Vem är personuppgiftsansvarig när fler klubbar ansluter?** Rekommendation: föreningen är ensam ansvarig och klubbarna är organisatoriska enheter i tjänsten. Alternativet, gemensamt ansvar med varje klubb, kräver ett avtal per klubb enligt artikel 26 och är orimligt tungt för en ideell drift.
3. **Var ska säkerhetskopiorna ligga?** Rekommendation: behåll dem i GitHub Actions men med publik nyckel-kryptering, och godta överföringen till USA som en dokumenterad behandling med standardavtalsklausuler, eftersom uppgifterna är krypterade och GitHub saknar nyckeln. Alternativet, en krypterad dump i Supabase Storage i EU-projektet, håller allt inom EU men innebär att en angripare med servicenyckeln når både databasen och kopian.
4. **Lagringstider.** Rekommendation: mjukt borttagna rader rensas hårt efter 90 dagar, konton utan inloggning på 24 månader raderas efter en påminnelse, arkiverade lag och säsongsplaner rensas efter 24 månader, säkerhetskopior efter 30 dagar.
5. **Görs repot publikt, och när?** Rekommendation: ja, innan fas 4 börjar, förutsatt att de sju punkterna i avsnitt 4 är avklarade. Notera att det också gör övningsbanken fritt kopierbar av andra — en fråga om innehållslicens snarare än säkerhet. Användaren bör ta ställning till om `content/` ska ha en egen licens skild från kodens Apache-2.0.
6. **Ska ”Logga ut på alla enheter” med i version 1?** Rekommendation: ja. Det är några rader kod, ingår i gratisnivån och är det enda svaret en ledare har på en borttappad telefon (S-11).
7. **Om Brevos avtal inte går att bekräfta före K5 — ska leverantören bytas?** Rekommendation: sätt det som ett villkor. Samtliga ledares e-postadresser passerar tjänsten, och ett obekräftat biträdesförhållande är inte förenligt med artikel 28.

## 6 Granskarens egna noteringar

**Verifierat:** ADR 0001–0005 och 0010 lästa i sin helhet, liksom kravspecen, berättelserna 11, 13, 16 och 18, `content/ovningar/README.md`, `CLAUDE.md` och `.gitignore`. `git ls-files` visar 73 spårade filer utan källkod, ingen `package.json` och inga `.github/`- eller `supabase/`-kataloger, varför `npm audit` inte gick att köra. Grep efter `dangerouslySetInnerHTML`, `innerHTML` och `Markdown` gav inga träffar i något dokument som beskriver rendering av fritext, vilket är grunden för S-07. Leverantörskontroller gjordes 2026-09-12 mot Supabase, Cloudflare och Turnstile med lyckat resultat, och mot Brevo utan.

**Inte verifierat:** Supabases faktiska gränser för engångskoder och sessioner (kräver ett projekt), att grenskydd verkligen kräver betald plan för privata repon, Supabases underbiträdeslista och Brevos serverplacering.

**Kvarstår:** S-01, S-02 och S-06 är påståenden om policyer som ännu inte är skrivna och ska granskas igen mot faktiska migrationer i inkrement 3, tillsammans med pgTAP-testerna. Planskissformatet är inte beslutat, så S-07 kan inte stängas här utan följer med som krav till planskissutvecklarens ADR.
