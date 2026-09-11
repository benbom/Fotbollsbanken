Status: utkast

# Backlog – Fotbollsbanken

Prioritering enligt MoSCoW (Must, Should, Could, Won't), grupperad efter de sju inkrementen i `CLAUDE.md`, i den ordningen. Varje rad länkar till sin användarberättelse i `berattelser/`.

## Inkrement 1 – Generatorn

| # | Berättelse | Prioritet |
|---|---|---|
| 01 | [Ange underlag och få spelform föreslagen](berattelser/01-ange-underlag-och-spelform.md) | Must |
| 02 | [Generera ett träningspass](berattelser/02-generera-traningspass.md) | Must |
| 03 | [Inget matchande resultat](berattelser/03-inget-matchande-resultat.md) | Must |
| 04 | [Byta ut en övning i passet](berattelser/04-byta-ovning-i-pass.md) | Must |
| 05 | [Spara ett pass](berattelser/05-spara-pass.md) | Must |
| – | Generatorn tar hänsyn till tillgänglig yta (t.ex. hel/halv plan) | Avvaktar beslut, se `kravspec.md` – öppna frågor, punkt 1. Rekommendation: Should. |
| – | Generatorn tar hänsyn till tillgängligt material (bollar, koner, mål) | Avvaktar beslut, se `kravspec.md` – öppna frågor, punkt 1. Rekommendation: Could. |
| – | Ändra ordningen på övningarna i ett genererat pass | Could |
| – | Appen förklarar varför en viss övning valdes ut | Could |

## Inkrement 2 – Planskisser

| # | Berättelse | Prioritet |
|---|---|---|
| 06 | [Visa planskiss för en övning](berattelser/06-visa-planskiss-for-ovning.md) | Must |
| 07 | [Visa planskisser för alla övningar i ett pass](berattelser/07-visa-planskisser-i-pass.md) | Must |

## Inkrement 3 – Konton med klubbar och lag

| # | Berättelse | Prioritet |
|---|---|---|
| 08 | [Registrera konto och logga in](berattelser/08-registrera-konto-och-logga-in.md) | Must |
| 09 | [Klubbadmin skapar klubb](berattelser/09-klubbadmin-skapar-klubb.md) | Must |
| 10 | [Klubbadmin hanterar lag](berattelser/10-klubbadmin-hanterar-lag.md) | Must |
| 11 | [Klubbadmin bjuder in ledare](berattelser/11-klubbadmin-bjuder-in-ledare.md) | Must |
| 12 | [Dela sparat pass inom laget](berattelser/12-dela-sparat-pass-inom-laget.md) | Must |
| – | Klubbadmin kan se en logg över vem som gjort vad i klubben | Could |
| – | En person kan vara medlem i flera klubbar samtidigt | Should (rimligt för ledare som tränar i flera klubbar, men inte grundflödet) |

## Inkrement 4 – Egna och inskickade övningar med redaktörskö

| # | Berättelse | Prioritet |
|---|---|---|
| 13 | [Skapa egen övning](berattelser/13-skapa-egen-ovning.md) | Must |
| 14 | [Hantera klubbens egna övningar](berattelser/14-hantera-egna-ovningar.md) | Must |
| 15 | [Skicka in en övning till den gemensamma banken](berattelser/15-skicka-in-ovning-till-banken.md) | Must |
| 16 | [Redaktören granskar en inskickad övning](berattelser/16-redaktor-granskar-inskickad-ovning.md) | Must |
| 17 | [Åtgärda och skicka in igen](berattelser/17-atgarda-och-skicka-in-igen.md) | Must |
| 18 | [Utse ytterligare redaktör](berattelser/18-utse-ytterligare-redaktor.md) | Should |
| – | Kommentera/diskutera en inskickad övning innan beslut | Could |
| – | Statistik över hur många övningar en klubb har fått godkända | Could |

## Inkrement 5 – Planläge med timer

| # | Berättelse | Prioritet |
|---|---|---|
| 19 | [Starta planläget](berattelser/19-starta-planlage.md) | Must |
| 20 | [Använda timer per övning](berattelser/20-anvanda-timer-per-ovning.md) | Must |
| 21 | [Navigera mellan övningar i planläget](berattelser/21-navigera-mellan-ovningar-i-planlage.md) | Must |
| – | Ljudsignal med anpassningsbar volym/typ | Could |
| – | Röststyrd navigering mellan övningar (händerna fulla på planen) | Could |

## Inkrement 6 – Utskrift/PDF

| # | Berättelse | Prioritet |
|---|---|---|
| 22 | [Skriva ut ett pass som PDF](berattelser/22-skriva-ut-pass-som-pdf.md) | Must |
| – | Klubbanpassad logga/sidhuvud på utskriften | Could |

## Inkrement 7 – Säsongsplanering

| # | Berättelse | Prioritet |
|---|---|---|
| 23 | [Skapa en säsongsplan](berattelser/23-skapa-sasongsplan.md) | Must |
| 24 | [Lägga pass i säsongsplanen med progression](berattelser/24-lagga-pass-i-sasongsplan-med-progression.md) | Must |
| 25 | [Se översikt över säsongsplanen](berattelser/25-se-oversikt-over-sasongsplan.md) | Must |
| – | Dela en säsongsplan mellan flera lag i samma årgång | Could |
| – | Varning om ett fokusområde inte förekommit på länge | Could |

## Won't – uttryckligen utanför version 1

Dessa är medvetet uteslutna, se `kravspec.md` – avgränsningar, och de fasta ramarna i `CLAUDE.md`.

- AI-genererat övningsinnehåll eller AI-genererade pass.
- Närvaroregistrering eller annan lagring av uppgifter om enskilda spelare.
- Publikt, inloggningsfritt läge för att bläddra i banken eller dela pass.
- Betalning eller prenumeration.
- Andra språk än svenska.
- Nativa mobilappar (endast PWA).
