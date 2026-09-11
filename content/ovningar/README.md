# Övningsbanken

**Skrivs av:** ovningsforfattare · **Granskas av:** fotbollsexpert · **Godkänns av:** redaktör (en människa)

Här finns övningarna som regelmotorn sätter ihop till träningspass.

## Status

```
utkast ──► granskad ──► godkand
  ▲            │
  └─ atgarda ◄─┘
```

| Status | Sätts av | Betyder |
|---|---|---|
| `utkast` | ovningsforfattare | Ny eller åtgärdad övning som väntar på granskning |
| `atgarda` | fotbollsexpert eller redaktör | Behöver ändras. Kommentarerna står i `granskning` |
| `granskad` | fotbollsexpert | Fotbollsfackligt granskad och väntar på redaktören |
| `godkand` | **endast en människa** | Publicerad i banken och kan väljas av generatorn |

## Innehåll i en övning (preliminärt)

Filformatet och schemat beslutas vid K2. Fälten nedan är utgångsläget.

| Fält | Innehåll |
|---|---|
| `id` | Unikt och stabilt ID |
| `namn` | Kort namn som ledare känner igen |
| `syfte` | En mening om vad spelarna ska lära sig |
| `fokusomraden` | Taggar enligt `docs/doman/fokusomraden.md` |
| `alder` | Minsta och högsta ålder |
| `spelformer` | Spelformer som övningen passar för |
| `niva` | Nivå enligt `docs/doman/nivaer.md` |
| `spelare` | Minsta och största antal spelare |
| `ledare` | Minsta antal ledare och vad var och en gör |
| `tid` | Rekommenderad tid i minuter |
| `yta` | Ytans mått i meter |
| `material` | Bollar, koner, västar, mål |
| `beskrivning` | Hur övningen går till |
| `organisation` | Uppställning, grupper och rotation |
| `coachningspunkter` | Två till fyra punkter |
| `varianter` | En lättare och en svårare variant |
| `anpassning` | Fler spelare, udda antal och fler eller färre ledare |
| `planskiss` | Skissdata enligt formatet från planskissutvecklaren |
| `kalla` | Inspiration eller källa, om det finns någon |
| `status` | Se tabellen ovan |
| `granskning` | Kommentarer, vem som granskat och datum |

## Validering

Kommandot för schemavalidering läggs till här när valideringen finns, i fas 2.
