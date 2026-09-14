# Arkitekturbeslut (ADR)

**Ägare:** senior-systemutvecklare

Varje tekniskt beslut som är svårt att ändra i efterhand dokumenteras här, ett beslut per fil: `NNNN-kort-titel.md`, till exempel `0001-val-av-ramverk.md`.

Ett beslut ändras aldrig i efterhand. Om det ersätts skrivs en ny ADR, och den gamla får status `Ersatt av NNNN`.

## Mall

```markdown
# NNNN: Titel

Status: föreslagen | beslutad (K2, ÅÅÅÅ-MM-DD) | delvis ersatt av NNNN | ersatt av NNNN

## Kontext
Vilket problem som ska lösas och vilka krav och begränsningar som gäller.

## Beslut
Vad som valdes.

## Alternativ
Vilka andra alternativ som övervägdes och varför de valdes bort.

## Konsekvenser
Vad beslutet leder till, både bra och dåligt: kostnader, risker och vad som blir svårare.
```
