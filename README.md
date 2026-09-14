# Fotbollsbanken

Mobilanpassad webbapp (PWA) där ungdomsledare i fotboll genererar träningspass ur en granskad
övningsbank. Övningarna har syfte, beskrivning och planskiss, och passen anpassas efter ålder,
spelform, nivå, antal spelare och antal ledare.

Appen använder ingen AI. Passen sätts ihop av en regelmotor som följer de numrerade reglerna i
[`docs/doman/generatorregler.md`](docs/doman/generatorregler.md). En regel som är byggd i koden
prövas av ett test som bär regel-ID:t i sitt namn.

Projektet är i fas 4 och byggs i inkrement. I dag finns appskalet, övningsschemat och
valideringen av övningsbanken.

## Kom i gång

Node 24 krävs. Versionen är låst i [`.nvmrc`](.nvmrc) och i `engines`.

```sh
npm install                  # installera beroenden
npm run dev                  # utvecklingsserver
npm test                     # enhetstester med Vitest
npm run validera:ovningar    # validera övningsbanken i content/ovningar/
```

Valideringen kan också köras på en enskild fil medan man skriver:

```sh
npm run validera:ovningar -- content/ovningar/passa-och-folj.yaml
```

Övriga kommandon:

| Kommando | Gör |
|---|---|
| `npm run typecheck` | Typkontroll av `src/` och av `scripts/` var för sig |
| `npm run lint` | ESLint |
| `npm run format` / `npm run format:check` | Prettier, skriv respektive kontrollera |
| `npm run build` | Typkontroll och produktionsbygge |

Samma kontroller körs för varje pull request i [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

## Så ligger koden

```
src/app/          vyer och routing
src/regelmotor/   ren logik: övningsschemat och passgenereringen
src/planskiss/    SVG-ritmotorn (byggs i inkrement 2)
scripts/          valideringsskriptet
content/ovningar/ övningsbanken som YAML, en fil per övning
docs/             krav, domän, design, arkitekturbeslut och säkerhet
```

`src/regelmotor/` får inte importera React, Supabase, Node-API:er eller webbläsar-API:er. Det gör
att samma kod kan köras i klienten, i testerna och i skript, och det upprätthålls av ESLint och av
att `src/` och `scripts/` typkontrolleras med skilda `tsconfig`-filer (ADR 0001).

## Dokumentation

| Var | Innehåll |
|---|---|
| [`docs/krav/`](docs/krav/) | Kravspecifikation, backlog och användarberättelser |
| [`docs/doman/`](docs/doman/) | Fotbollsdomänen och generatorreglerna |
| [`docs/design/`](docs/design/) | Flöden, skisser, designsystem och gränssnittstexter |
| [`docs/adr/`](docs/adr/) | Arkitekturbeslut. Ett ändrat beslut skrivs som en ny ADR |
| [`docs/sakerhet/`](docs/sakerhet/) | Säkerhets- och GDPR-granskningar |
| [`content/ovningar/README.md`](content/ovningar/README.md) | Så skrivs en övning, med fälten och statusarna |

Övningsformatet, valideringen och vägen in i banken beslutas i
[ADR 0010](docs/adr/0010-ovningsformat-och-lagring.md).

## Att bidra

`main` är skyddad och tar bara emot pull requests. En övning publiceras i den gemensamma banken
först när en människa har godkänt den: statusen `godkand` skrivs bara av arbetsflödet
`godkann-omgang` som svar på ett godkännande i GitHub, aldrig för hand och aldrig av en agent
(ADR 0010, avsnitt 3).

Gränssnitt, dokumentation och commit-meddelanden skrivs på svenska. Kod och identifierare skrivs
på engelska, medan domänens nycklar och fältnamn behåller sin svenska stavning.

## Licenser

Projektet har två licenser:

- **Koden** licensieras under Apache-2.0. Se [`LICENSE`](LICENSE).
- **Övningsbanken i `content/`**, alltså övningarnas texter och deras skissdata, licensieras under
  CC BY-SA 4.0. Se [`content/LICENSE`](content/LICENSE).

Övningarna bygger på principerna i SvFF:s spelarutbildningsplan och nationella spelformer, men
innehåller inte SvFF:s texter. SvFF:s material omfattas inte av licenserna ovan.
