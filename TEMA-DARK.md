# Kaj povedo temni okvirji v Figmi

Zbrano iz dvanajstih klicev MCP na *Petrin projekt* (`l2KawTxFf741MrlE8rZOAt`), ki ima **69 temnih okvirjev**. Račun ima dvajset klicev na mesec, zato je vse, kar je bilo odčitano, zapisano tu — da se ne plača dvakrat.

Barvnih spremenljivk datoteka nima; barve so surove vrednosti na elementih.

## Lestvica podlag

| vloga | Figma | kje |
|---|---|---|
| podlaga strani | `#111114` | vsi okvirji |
| kartica | `#17171c` | storitve |
| plošča, obrazec, postavka cenika | `#191920` | kontakt, cenik, urnik |
| ploščica logotipa partnerja, slika postavke | `#20202a` / `#22222c` | stranke, cenik |
| blok, kjer bi bil zemljevid | `#22222c` | kontakt |
| fotografija, ki je ni | `#3a3a46` | cta pas, novice |

## Besedilo

| vloga | Figma |
|---|---|
| naslovi | `#ffffff` |
| telo v kartici | `#d5d5d6` |
| oznake, sekundarno | `#ababb8` |
| opombe, nadomestno besedilo | `#8e8e9a` |
| besedilo na čipu | `#c6c6d0` |

## Ponavljajoče se vrednosti

- **Obroba: `rgba(255,255,255,0.22)`.** Ista povsod — obrazci, čipi, ploščice logotipov, kartice cenika, tabele. Vsebinske kartice (storitve, projekti) obrobe **nimajo**; loči jih to, da so stopnjo svetlejše od strani.
- **Prekriv čez fotografije: 60 %**, enako kot v svetli temi. Ne globlje.
- **Prelivanje znamke: `#8258c8 → #2c84c8`**, enako kot v svetli.

## Posebnosti, ki jih svetla tema nima

- **Logotipi partnerjev** dobijo vsak svojo ploščico `#20202a` z obrobo 0.22 in radijem 14. Brez tega bi razbarvan logotip pri 65 % na temni podlagi izginil.
- **Polje novičnika** je polno (`#191920`) z obrobo `0.45`, ne wash bele.
- **Čipi filtrov**: aktiven je bel s temnim besedilom (`#111114`), neaktiven ima obrobo 0.22 in besedilo `#c6c6d0`.
- **Tabela urnika**: glava `#221f2e`, vrstice se izmenjujejo `#1b1b23` / `#191920`.

## Značke cenika

| stanje | ozadje | besedilo |
|---|---|---|
| priporočeno | `#8258c8` (primarna) | belo |
| AVAILABLE | `#12301f` | `#1f7a4d` |
| COMING_SOON | `#332512` | `#9a6412` |
| DISABLED, UNAVAILABLE | `#242430` | `#9a9aa5` |

Naš `Tag` teh pomenskih barv nima — pozna `brand`, `neutral` in `outline`. Sprememba bi bila smiselna, a **ne sodi sem prva**: tona sta stvar obeh tem in bi morala iti najprej v `ui-002`, sicer se temi razideta v nečem, kar ni barva.

## Kaj v Figmi ni prenesljivo

- **Tabela urnika ima obrobo `#e4e4ec`** — skoraj belo črto okoli temne tabele. Vse ostalo v datoteki uporablja `rgba(255,255,255,0.22)`, zato je videti kot ostanek svetle teme in ne kot namera. Ni prevzeto.
- **Dekorativni odsevi in vzorci pik** (SVG) so v temnih okvirjih na več sekcijah: vijoličen odsev levo zgoraj, moder desno, mreža pik. Naša tema jih nima. To ni barva, ampak nov element, in bi bilo treba odločiti posebej.

## Česar Figma ne pove

- **Noge ni med temnimi okvirji.** Njena barva je zato presoja: pas, ki se za odtenek dvigne od strani, namesto svetlega bloka na dnu temne strani.
- **Cenik v Figmi je izrisan kot `PRICING_LIST`** (vrstice), naš demo pa uporablja `PRICING_PACKAGES` (kartice). Razlike med njima — poln gumb samo pri priporočeni postavki, cena v belem namesto v barvi znamke — so razlike med postavitvama in ne med svetlo in temno; naša cena je v barvi znamke tudi v svetli temi.

## Poraba

Dvanajst klicev: dva za strukturo, eden za spremenljivke (samo tipografija), dva za posnetka, sedem za kontekst. **Kontekst je vreden bistveno več od posnetka** — vrne barve kot vrednosti in ne kot piksle, ki jih je treba vzorčiti, in pokrije cel okvir naenkrat.
