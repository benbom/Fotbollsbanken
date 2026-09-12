# 0005: Dåligt nät och offline

Status: beslutad (K2, 2026-09-12)

## Kontext

- **Kravet:** appen ska fungera på planen vid svagt eller instabilt mobilnät. Fullständigt offlineläge krävs inte i version 1 (`kravspec.md`, avgränsningar och icke-funktionella krav).
- **Planläget** (berättelse 19–21, `docs/design/skisser/06-planlage.md`) används på planen:
  - en övning i taget, med planskiss och fullständig beskrivning
  - en timer per övning som kan pausas och förlängas
  - en signal när tiden är slut
  - skärmen får inte släckas
- **Utloggning** ska göra sparade pass och klubbens material otillgängliga tills personen loggar in igen (08.4). Data som cachas på enheten måste därför kunna rensas.
- **Flera ledare** delar lagets pass och säsongsplan (12, 23). Ändringar som görs utan nät och synkas senare skulle kunna krocka.
- **ADR 0001:** statisk SPA med vite-plugin-pwa (Workbox) och TanStack Query.
- **ADR 0003:** ett sparat pass är ett självbärande dokument med ögonblicksbilder av övningarna. Planskisser är skissdata som ritas som SVG, inte bildfiler.

## Beslut

### Det här fungerar utan nät

Det gäller efter att ledaren har öppnat appen med nät minst en gång på enheten och är inloggad.

| Funktion | Utan nät | Hur |
|---|---|---|
| Starta appen | Ja | Appskalet (HTML, JS, CSS, typsnitt, ikoner) förcachas av service workern. |
| Se listan över sparade pass | Ja, som den såg ut vid senaste synk | Ledarens egna pass och lagens pass, med alla moment, sparas i IndexedDB varje gång listan hämtas med nät. |
| Öppna ett sparat pass, med planskisser | Ja | Passet är självbärande (ADR 0003) och skisserna ritas från skissdata i klienten. |
| **Planläget med timer, navigering och fullständig beskrivning** | **Ja** | Allt körs lokalt. Planläget hämtar ingenting från nätet. |
| Skriva ut ett sparat pass | Ja | Utskriftsvyn byggs av samma lokala data (ADR 0001). |
| Generera och justera ett nytt pass | Ja, om banken har synkats | Banken sparas i IndexedDB (se nedan). Generatorn körs i klienten (del B). Det här är en följd av arkitekturen, inte ett krav. Om det håller testas i inkrement 1. |
| Spara ett pass, koppla pass till säsongsplanen, skapa eller ändra övningar, skicka in, granska, bjuda in, logga in | **Nej** | Kräver nät. Formulärets innehåll finns kvar, och appen säger tydligt att det inte finns någon anslutning och att ledaren kan försöka igen. |

### Så fungerar det

1. **Appskalet:** vite-plugin-pwa förcachar hela bygget. Det har koddelning, men alla delar förcachas, så planläget finns på enheten innan det behövs. En ny version installeras i bakgrunden, och ledaren får frågan ”Ny version finns, ladda om?” (`registerType: 'prompt'`). **Appen laddas aldrig om automatiskt**, och frågan visas inte i planläget.
2. **Data på enheten:** TanStack Query sparar sin cache i IndexedDB via `@tanstack/react-query-persist-client` och `@tanstack/query-async-storage-persister`, med `idb-keyval` som lagring. Det gäller:
   - **Sparade pass** som ledaren har tillgång till, hämtade som hela dokument i en fråga. Listan är begränsad till de senaste 100 passen.
   - **Den gemensamma banken och klubbens övningar.** Första gången hämtas allt, därefter bara det som ändrats sedan förra synken (`updated_at`). Uppskattningsvis 1–2 MB för några hundra övningar.
   - **Säsongsplanen** för ledarens lag.
   - **Det genererade passet som ännu inte har sparats**, så att det inte går förlorat om webbläsaren stängs.
3. **Inga API-svar i service workerns cache.** Data från Supabase cachas bara i IndexedDB via appen, aldrig i Cache Storage via service workern. Då finns all persondata och klubbdata på ett ställe som appen själv styr och kan rensa.
4. **Utloggning rensar allt lokalt:** IndexedDB-cachen och utkasten raderas vid utloggning (08.4). Appskalet innehåller ingen persondata och finns kvar.
   
   **Cachen är åtskild per användare** (S-12). Att bara rensa vid utloggning räcker inte: två ledare i samma familj kan dela en surfplatta, och om ledare A stänger appen utan att logga ut och sessionen går ut, hydrerar appen cachen från disk innan den första hämtningen hinner klart när ledare B loggar in. B skulle då se A:s lags pass och säsongsplan, från ett lag B inte tillhör. Samma sak händer om utloggningen avbryts av att nätet försvinner. Därför:
   - persistlagret nycklas på användarens `sub`, och `buster` sätts till samma värde, så att en annan användares cache aldrig kan hydreras
   - cachen rensas på `onAuthStateChange` för både `SIGNED_OUT` och `USER_DELETED`
   - vid uppstart rensas cachen om lagrat `sub` inte matchar sessionens
5. **Visa det som finns, uppdatera i bakgrunden:** cachad data visas direkt och uppdateras när det går. Läsningar har en tidsgräns (cirka 10 sekunder) och görs om med ökande väntetid. En diskret markering visar att appen saknar anslutning och när datan senast uppdaterades. Utformningen bestäms av UX-designern.
6. **Skrivningar som tål omförsök:** klienten skapar id:t (`uuid`) för nya pass, övningar och kopplingar. Om svaret försvinner på ett instabilt nät kan anropet göras igen utan att en dubblett skapas. Det finns ingen kö för skrivningar utan nät i version 1.
7. **Sessionen offline:** en utgången åtkomsttoken loggar inte ut ledaren. Cachad data visas, och sessionen förnyas när nätet kommer tillbaka. Supabase-js behåller sessionen vid nätverksfel och tar bara bort den när förnyelsetoken är ogiltig.
8. **Beständig lagring:** appen ber om `navigator.storage.persist()`, så att webbläsaren inte rensar cachen när utrymmet börjar ta slut. Safari rensar lagring för webbplatser som inte har använts på 7 dagar. Det gäller enligt WebKits dokumentation inte appar som har lagts till på hemskärmen. Uppgiften har inte verifierats i detta uppdrag. Ledare bör därför uppmanas att installera appen. Cachen är alltid bara en kopia, och servern är källan.

### Planläget på planen

- **Timern räknar mot en sluttid,** `Date.now()`, och räknar inte intervall. Då visar den rätt tid även om webbläsaren har strypt timers när skärmen varit släckt eller appen legat i bakgrunden. Planlägets tillstånd sparas lokalt vid varje ändring, så att ledaren kommer tillbaka till samma övning med samma timer om operativsystemet stänger fliken. Tillståndet är aktuell övning, sluttid eller återstående tid vid paus.
- **Skärmen hålls vaken** med Screen Wake Lock API (`navigator.wakeLock.request('screen')`). Låset begärs igen när vyn blir synlig igen (`visibilitychange`). Om API:et saknas visar appen ett tips om att ändra skärmsläckningen i telefonens inställningar. Stödet i installerade PWA:er på iPhone har varit ojämnt i äldre iOS-versioner och ska testas på riktiga enheter i inkrement 5.
- **Signalen vid noll** (20.2) är i första hand visuell. Ljud spelas med Web Audio. Ljudet låses upp när ledaren trycker på Start, eftersom webbläsare kräver en användarhandling. Vibration (`navigator.vibrate`) används där den finns. Safari på iPhone saknar enligt min kännedom Vibration API, och det har inte verifierats här. Designen säger redan att ljud inte får vara det enda sättet att märka signalen.

## Alternativ

**Fullständigt offlineläge med en kö för skrivningar och synkning** (till exempel PowerSync, RxDB eller en egen kö). Valdes bort för version 1, eftersom det inte krävs. Flera ledare som ändrar samma pass eller säsongsplan utan nät kräver regler för konflikter som varken kraven eller domänen har beskrivit. Synkmotorer är dessutom nya beroenden, och en del kostar pengar. Id:n från klienten (punkt 6) gör det lättare att ta in en kö senare.

**Cacha API-svar i service workern** (Workbox `NetworkFirst` mot Supabase). Enklare att sätta upp, men persondata och klubbdata hamnar i Cache Storage, där de är svårare att rensa säkert vid utloggning och att hålla isär mellan användare på en delad enhet. Valdes bort.

**Bara cacha appskalet, utan data på enheten.** Räcker inte. Planläget skulle kunna starta, men passet skulle inte gå att öppna utan nät, och det är just på planen som nätet är dåligt.

**Ett uttryckligt val ”Spara på telefonen” för varje pass.** Ett extra steg som ledaren lätt glömmer. Valdes bort. Alla pass som ledaren har tillgång till sparas i stället automatiskt, eftersom de är små. UX-designern kan ändå vilja visa vilka pass som finns på telefonen.

**Dexie som lagring.** Kraftfullare frågor mot IndexedDB, men större och inte nödvändigt när cachen är en nyckel–värde-lagring. Valdes bort till förmån för `idb-keyval`.

## Konsekvenser

- **Nya beroenden:**
  - `@tanstack/react-query-persist-client` och `@tanstack/query-async-storage-persister`, MIT, underhålls i TanStack Query-projektet
  - `idb-keyval`, Apache-2.0, litet och underhålls av Jake Archibald (Google Chrome-teamet)
  
  Båda licenserna är förenliga med projektets Apache-2.0-licens.
- **Första besöket kräver nät,** och en ledare som aldrig har öppnat ett pass med nät på enheten kan inte öppna det på planen. Gränssnittet och en kort guide bör uppmana ledaren att öppna appen hemma först. Det är en fråga för UX-designern.
- **Data på enheten är personuppgifter och klubbdata:** namn på lagets övriga ledare och passens innehåll. De ligger oskyddade i webbläsarens lagring tills ledaren loggar ut. Säkerhetsagenten har bedömt risken som godtagbar för det här innehållet (S-11, S-12). Den delade enheten hanteras av punkt 4 ovan. Den borttappade, olåsta telefonen hanteras av ”Logga ut på alla enheter” i ADR 0004, som ingår i version 1 efter användarens beslut 2026-09-12: anropet ger `SIGNED_OUT` på den egna enheten och punkt 4 rensar då cachen, medan de andra enheterna nekas förnyelse och rensas när de öppnas igen. Förnyelsetoken ligger dessutom som förval i localStorage, och det verkliga skyddet för den är innehållspolicyn i ADR 0002 (S-17), inte lagringsvalet.
- **Cachen kan vara inaktuell:** en ledare kan köra ett pass som en annan ledare har ändrat efter senaste synken. Eftersom varje sparande skapar ett nytt pass (05) ändras befintliga pass sällan, och risken är liten.
- **Testbarhet:** Playwright kan simulera att nätet saknas (`context.setOffline(true)`) och långsamt nät. E2E-tester för planläget och sparade pass utan nät läggs till i inkrement 5. Wake Lock, ljud och vibration kräver manuell provning på riktiga telefoner, åtminstone en iPhone och en Android.
- **Uppdateringar av appen** når ledaren först när hen godkänner omladdningen. En allvarlig säkerhetsrättelse kan därför dröja. Det får hanteras i driftrutinen i fas 5.
