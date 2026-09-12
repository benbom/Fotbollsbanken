# 0001: Teknikstack

Status: föreslagen

## Kontext

Fotbollsbanken ska vara en installerbar webbapp (PWA) för ideella ungdomsledare. Följande krav och ramar styr valet av språk, ramverk och byggverktyg:

- **Mobil först och ingen nativ app** (`kravspec.md`, avgränsningar och icke-funktionella krav).
- **Fungerar på planen med svagt eller instabilt nät**, men fullständigt offlineläge krävs inte i version 1. Se ADR 0005.
- **WCAG 2.2 nivå AA** (`kravspec.md`).
- **Allt innehåll ligger bakom inloggning.** Publik, inloggningsfri åtkomst är uttryckligen Won't (`backlog.md`). Appen behöver alltså ingen sökmotoroptimering och ingen serverrendering för att synas utåt.
- **Regelmotorn** ska vara deterministisk och sakna AI. Varje regel-ID i `docs/doman/generatorregler.md` ska ha minst ett test och vara spårbart i koden. Därför behövs ren logik som kan testas isolerat från gränssnitt och databas.
- **Planskisser** ritas som SVG från skissdata (`CLAUDE.md`).
- **Utskrift/PDF** ska ske utan extra kostnad för ledaren (berättelse 22, kriterium 4).
- **Flera klubbar** med isolerad data, se ADR 0003.
- **Drift på gratisnivåer.** Appen drivs av en ideell förening, se ADR 0002.
- **Litet lag:** koden byggs och underhålls av en användare och ett agentlag. Det talar för få rörliga delar, välkänd teknik och starka typer.

Utgångsläget i `CLAUDE.md` är Next.js med TypeScript som PWA, Supabase, SVG-planskisser, Vitest och Playwright. Det utgångsläget har prövats mot kraven ovan.

## Beslut

Appen byggs som en **statisk single-page-app (SPA) med React och Vite**, och **Supabase** används som backend. Det finns ingen egen serverkörning. Next.js ersätts alltså av Vite, medan resten av utgångsläget behålls.

| Område | Val | Licens |
|---|---|---|
| Språk | TypeScript i `strict`-läge i all kod, även i skript. SQL för migrationer och åtkomstregler. | – |
| Gränssnitt | React | MIT |
| Bygge och utvecklingsserver | Vite | MIT |
| Routing | React Router i biblioteksläge (klientrouting, ingen serverdel) | MIT |
| PWA (service worker och manifest) | vite-plugin-pwa, som bygger på Workbox. Vad som cachas beslutas i ADR 0005. | MIT |
| Backend | Supabase: Postgres, Auth, åtkomstregler på radnivå (RLS) och Postgres-funktioner. Edge Functions används bara där hemliga nycklar krävs, till exempel för att skicka inbjudningar. Se ADR 0003 och 0004. | Klientbiblioteket supabase-js: MIT |
| Serverdata och cache | TanStack Query | MIT |
| Validering av indata | Zod för formulär och data som kommer in i klienten. Om övningsschemat ska uttryckas i Zod eller JSON Schema beslutas i del B (ADR 0010 och framåt). | MIT |
| Styling | Vanlig CSS med designtokens från `docs/design/designsystem.md` som CSS-variabler, och CSS Modules per komponent. Inget komponentbibliotek. Inbyggda HTML-element används i första hand, eftersom de ger tillgänglighet utan extra kod. | – |
| Planskisser | SVG som React-komponenter ritar från skissdata. Modulen ägs av planskissutvecklaren och formatet beslutas i del B. | – |
| Utskrift/PDF | Webbläsarens egen utskrift med en utskriftsvy och print-CSS. PDF skapas med ”Spara som PDF” i utskriftsdialogen. Ingen PDF-tjänst och inget PDF-bibliotek i version 1. Beslutet omprövas i inkrement 6 om det inte räcker på mobilen. | – |
| Enhetstester | Vitest och Testing Library | MIT |
| E2E-tester | Playwright med mobil viewport | Apache-2.0 |
| Tillgänglighetstester | @axe-core/playwright. Bara utvecklingsverktyg, det levereras aldrig i appen. | MPL-2.0 |
| Tester av åtkomstregler | pgTAP via Supabase CLI mot en lokal databas i Docker | PostgreSQL-licensen / MIT |
| Kodkvalitet | ESLint (typescript-eslint, eslint-plugin-jsx-a11y, eslint-plugin-react), Prettier och `tsc --noEmit`. Regeln `react/no-danger` sätts till `error` i hela projektet (S-07): innehåll från ledare ritas som planskisser, och `dangerouslySetInnerHTML` är den direkta vägen från sådan data till lagrad XSS. | MIT |
| Paket och körmiljö | npm med `package-lock.json`. Node.js i aktuell LTS-version (24), låst med `.nvmrc` och `engines`. Supabase CLI för lokal databas och migrationer. | MIT |
| Beroendeuppdateringar | Dependabot, som ingår i GitHub. `npm audit --audit-level=high` är ett steg som underkänner bygget från och med inkrement 1, och GitHub Secret Scanning med Push Protection slås på när repot blir publikt (S-25, ADR 0002). | – |

Alla licenser är förenliga med projektets Apache-2.0-licens. Exakta versioner låses i `package-lock.json` när bygget börjar i fas 4.

### Kodstruktur

Ett repo och ett npm-paket:

```
src/
  app/          vyer, routing, planeringsläge och planläge
  regelmotor/   ren logik för passgenerering, detaljeras i del B
  planskiss/    SVG-ritmotorn, ägs av planskissutvecklaren
  data/         Supabase-klient, frågor och genererade databastyper
supabase/
  migrations/   SQL-migrationer, den enda vägen att ändra databasen
  tests/        pgTAP-tester för åtkomstregler och statusflöden
content/
  ovningar/     övningsbanken, formatet beslutas i del B
e2e/            Playwright-tester
```

`src/regelmotor/` får inte importera React, webbläsar-API:er eller Supabase. Det upprätthålls med ESLint-regeln `no-restricted-imports`. Då kan samma kod köras i klienten, i Vitest och i skript, och varje regel kan testas utan gränssnitt eller databas.

## Alternativ

**Next.js (App Router) med Supabase, som var utgångsläget.** Next.js har ett stort ekosystem, serverrendering och API-routes. Det valdes bort av fyra skäl:
- Serverrendering och serverkomponenter ger lite när allt ligger bakom inloggning och ingen del ska indexeras.
- En serverdel är ytterligare en körmiljö att driva och säkra. Behörighet skulle också kunna kontrolleras på två ställen, i serverkoden och i databasens RLS, och det gör granskningen svårare.
- Next.js har inget inbyggt stöd för service worker. Det kräver ett tredjepartspaket som Serwist, och det är krångligare att cacha serverrenderade sidor för dåligt nät än att cacha ett statiskt appskal.
- Next.js är enklast att köra på Vercel, men Vercels gratisnivå gäller bara privat, icke-kommersiellt bruk (se ADR 0002). Hos andra leverantörer krävs adaptrar som OpenNext. Next.js kan byggas som statisk export, men då försvinner det mesta av det ramverket tillför, och kvar blir mest overhead.

**SvelteKit med statisk adapter.** Ger mindre JavaScript-paket och har bra PWA-stöd. Det valdes bort eftersom React har bredare stöd för tillgänglighetstester, testbibliotek och datahämtning, och är mer känt för dem som ska underhålla koden. Med koddelning är skillnaden i paketstorlek inte avgörande.

**React Router i ramverksläge (tidigare Remix).** Samma avvägning som för Next.js, eftersom ramverksläget bygger på serverrendering. Biblioteksläget ger routingen utan serverdelen.

**Firebase eller en egen backend.** Firestore är en dokumentdatabas. Relationerna klubb, lag och ledare och isoleringen mellan klubbar blir då svårare att uttrycka och granska än med Postgres och RLS. En egen backend, till exempel Node eller PocketBase, kräver en server som alltid är igång, och sådana finns inte på gratisnivåer utan att tjänsten somnar.

**Tailwind eller ett komponentbibliotek (till exempel MUI).** Det valdes bort i utgångsläget. CSS-variabler räcker för designsystemets tokens, och inbyggda HTML-element ger bäst tillgänglighet med minst kod. UX-designern kan pröva valet.

**PDF-bibliotek (jsPDF, pdf-lib, react-pdf).** Det valdes bort i version 1. Ett sådant bibliotek gör JavaScript-paketet större, och layouten måste byggas en gång till. Utskrift med print-CSS återanvänder samma vy och samma SVG-skisser.

## Konsekvenser

**Fördelar**
- Ett statiskt bygge kan lagras hos vilken statisk webbhotellstjänst som helst på gratisnivå. Det finns ingen server att patcha, och hela appskalet kan cachas för dåligt nät.
- Behörighet kontrolleras på ett ställe, databasens RLS (ADR 0003). Det gör det lättare för säkerhetsagenten att granska.
- Regelmotorn är isolerad från gränssnitt och databas och kan testas regel för regel.
- Utskrift kräver ingen extra tjänst eller kostnad.

**Nackdelar och risker**
- Klienten går att manipulera. Allt som måste gå att lita på ska därför upprätthållas i databasen med RLS, begränsningar och Postgres-funktioner, till exempel övningarnas statusövergångar och att ingen annan än en redaktör kan sätta `godkand`. Det kräver mer SQL, och pgTAP-tester för åtkomstreglerna blir obligatoriska.
- En SPA måste ladda ner JavaScript innan något visas. Första besöket på dåligt nät blir därför långsammare än med serverrendering. Det motverkas med koddelning, precachning (ADR 0005) och en storleksbudget för JavaScript som kontrolleras i CI. Budgetens nivå sätts i inkrement 1.
- Supabase-bindning: åtkomstreglerna använder Supabase-funktioner som `auth.uid()`, och inloggningen är Supabase Auth. Datan är vanlig Postgres och kan flyttas, men inloggningen och delar av reglerna måste då göras om.
- ”Spara som PDF” via utskriftsdialogen ser olika ut i olika mobilwebbläsare. Om ledare inte hittar funktionen i inkrement 6 behövs ett nytt beslut, se *Kvarstår* i rapporten.
- Ändringen från Next.js till Vite påverkar inga befintliga filer, eftersom ingen kod finns än.
