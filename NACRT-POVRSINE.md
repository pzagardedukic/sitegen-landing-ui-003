# Načrt: površine v temni temi

Kartice so pretemne. Zapisano po meritvi, ne po občutku, in z enim samim vzrokom v ozadju.

## Kaj je izmerjeno

Vseh 14 glavnih poti pri 1440. Za vsak element, ki naj bi bral kot plošča (zaokrožen, dovolj velik, nosi vsebino), je izmerjena **svetlost njegove dejanske podlage** — skozi prosojnost do tistega, kar riše za njim — in odšteta svetlost strani.

Podlaga strani ima svetlost **17.9**.

| stopnja | kje |
|---|---|
| **0** | `#blog`, `#pricing`, `#schedule-tables`, `#events-list`, `#careers`, `#faq` |
| **9.5** | `#reviews`, `#contact`, `#kontakt`, `#why`, `#catalogues` |
| 11 | pas glave |
| 16 | ploščice logotipov partnerjev |
| 44.9 | sekcije s fotografijami (svetla je fotografija, ne kartica) |

Šest sekcij torej kartice sploh ne pobarva — vidi se samo lasasta obroba. Pet jih dvigne za 9.5, kar je natanko tisto, kar si opazila pri mnenjih in kontaktnem obrazcu.

## Vzrok

Kartice so pobarvane s **`surfaces.tint`**, in ta je `alpha(primary, 0.10)` — desetodstotni nadih znamke.

Na beli strani je nadih znamke odlična kartica: bela minus deset odstotkov vijolične je razločna ploskev. Na skoraj črni strani je deset odstotkov česarkoli skoraj nič — 17.9 se dvigne na 27.4 in oko tega ne prebere kot ploskev, ampak kot umazanijo.

`tint` je torej v temni temi opravljal delo, za katerega ni bil mišljen. Uporabljen je na trinajstih mestih: kartice mnenj, kontaktni obrazec, blog, cenik, urnik, katalogi, zaposlitev, pogosta vprašanja, izkušnje, pravno, pa tudi pas, značke in filtri, kjer je nadih **pravilna** izbira.

Ločeno: šest sekcij ne pobarva ničesar. Tam gre za komponente, ki ploskve nikoli niso imele — v svetli temi jih drži obroba na beli podlagi, kar zadošča.

## Predlog

### 1. Lestvica površin, ne en sam nadih

Uvedem tri imenovane stopnje in vsaka pove, čemu služi:

| ime | vloga | predlagana stopnja |
|---|---|---|
| `surfaces.card` | kartice, obrazci, plošče | **+16** |
| `surfaces.raised` | kar mora biti nad kartico: polje v obrazcu, glava tabele | **+26** |
| `surfaces.tint` | ostane nadih znamke za pasove, značke, filtre | nespremenjen |

Kartice preidejo s `tint` na `card`. To je sprememba **žetona in ne postavitve** — nobena komponenta ne dobi drugačne oblike, samo drugo ime barve.

### 2. Šest sekcij, ki ne pobarvajo nič

Te potrebujejo ploskev, ki je prej ni bilo: blog, cenik, urnik, dogodki, zaposlitev in pogosta vprašanja. Sprememba je majhna — `backgroundColor: surfaces.card` na kartico ali vrstico — a je v komponentah in zato **razlika proti `ui-002`**.

Predlagam, da gre ta ista sprememba **tudi v `ui-002`**, kjer `card` ustreza obstoječemu nadihu in se vizualno nič ne spremeni. Tako se temi ne razideta v nečem, kar ni barva.

### 3. To je namerno svetleje od Figme

Figmina temna lestvica je `#111114` → `#17171c` → `#191920`, torej stopnji približno **6** in **8**. Predlagane so dvakrat večje.

Figmo sem gledal na posnetku, ti gledaš stran na zaslonu, in pri tako majhnih razlikah zaslon odloča. Zapisano zato, da čez tri mesece ne bo videti kot pomota — odstop je zaveden in tvoja odločitev.

## Kaj rabim od tebe

Stopnji **+16** in **+26** sta moja predloga, ne dejstvo. Preden karkoli spremenim, izrišem **tri lestvice** — bolj zadržano, predlagano in bolj poudarjeno — na mnenjih in na kontaktnem obrazcu, ti pa izbereš s slike.

## Preverjanje

Po spremembi se požene ista meritev. Merilo: **nobena sekcija pod izbrano stopnjo**, in nič novega v preverbi nevidnega besedila — svetlejša kartica lahko požre besedilo, ki je bilo prej v redu.
