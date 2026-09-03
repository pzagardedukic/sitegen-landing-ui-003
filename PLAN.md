# sitegen-landing-ui-003 — temna različica teme

## Kontekst

`sitegen-landing-ui-002` je svetla izvedba dizajna iz Figme. Ta repozitorij je njena temna dvojnica: **ista tema, temna paleta**, kot svoj `theme.id` v čarovniku `ptlabTadej/sitegen_v2`. Logika ostaja v `@ptlabTadej/sitegen-landing-core`; tu je samo vizual in tanki adapterji.

Cilj: `ui-003` se od `ui-002` **ne razlikuje v ničemer razen v barvah**. Isti `website.json`, isti core major, isti pogoji prikaza sekcij, iste poti in sidra, isti SEO, isti razmiki in ista tipografija.

## Zakaj to ni prepis, ampak paleta

Pred začetkom sem preštel, koliko svetlosti je sploh zapisane v komponentah. Vsa gre skozi šest imenovanih vrednosti:

| vrednost | rab | kaj naredi dark |
|---|---|---|
| `surfaces.border` | 34 | svetla črta na temnem |
| `common.white` | 17 | belo besedilo na fotografijah — **ostane belo** |
| `surfaces.placeholder` | 14 | nadomestek manjkajoče slike |
| `surfaces.tint` | 13 | wash sekcije |
| `surfaces.scrim` | 11 | črn prekriv na fotografijah — **glej odločitev 3** |
| `background.default` | 7 | podlaga strani in beli izrez |

Trdo zapisanih barvnih vrednosti je v celotni vizualni plasti (110 datotek) **sedem**, in nobena ni tema: ena je maska `linear-gradient(#000 0 0)` v `SubscriptionCard`, ostalih šest je belih nad fotografijami (`SubscribeSection`, `TeamCard`) in tam belo tudi ostane.

Pravilo iz načrta za `ui-002` — „nikjer trdo zapisanih barv, vse prek palete" — je torej zdržalo. Delo je v `src/app/theme/colors.ts`, `src/app/theme/brand.ts` in `src/theme.ts`, ne po komponentah.

## Cena, ki jo je treba poznati

Ločen repozitorij pomeni **podvojenih 110 komponent, ki so identične**. Vsak popravek v `ui-002` od danes naprej je treba prenesti sem, sicer se temi razideta. Odločeno je zavestno, ker en repozitorij = ena tema drži postopek preprost za `sitegen_v2`; zapisano zato, da ni presenečenje čez tri mesece.

Predlog za omilitev: dokler traja delo na `ui-003`, se vsak popravek v `ui-002` prenese isti dan, in obratno. Ko se temi ustalita, se to preneha in razlike se sprejmejo.

---

## Faza 0 — načrt v repozitorij, potem stop

Ta datoteka, prvi commit, push. **Nič drugega**: brez kopiranja `ui-002`, brez namestitev, brez kode. Fazo 1 začnem, ko potrdiš načrt in odgovoriš na štiri odločitve spodaj.

## Štiri odločitve, ki jih dark zahteva

Te niso stvar izvedbe. Vsaka spremeni, kako stran izgleda, in nobene ne morem izbrati namesto tebe.

### 1. Beli izrez v glavi

Identiteta glave je **bel izrez**, izrezan iz hero fotografije, z logotipom na njem. V temni temi sta dve poti:

- **ostane svetel** — svetla ploščica na temni strani, logotip stranke se nanjo prilepi nespremenjen, kontrast je največji;
- **postane temen** — izrez se zlije s stranjo, a temen logotip stranke izgine. Filter `--logo-filter`, ki logotip ob drsenju že pobeli, bi moral delovati tudi nezdrsano.

Nagibam se k **svetlemu izrezu**: logotipi strank so pretežno temna umetnina in svetla ploščica je edino, kar deluje, ne da bi vedeli, kakšna je.

### 2. Barva besedila iz `website.json`

`theme.colors.text` je strankina barva; v demo podatkih `#111111`. Če jo temna tema vzame dobesedno, je stran nečitljiva — črno besedilo na skoraj črni podlagi, pri **vsaki** stranki.

Dark mora iz nje izpeljati čitljivo barvo: obdrži barvni ton, svetlost pa vsili. To je isti razred napake kot [ui-001#3](https://github.com/ptlabTadej/sitegen-landing-ui-001/issues/3) — vrednost, ki je urejevalnik ne doseže oziroma jo doseže napačno — zato mora biti rešeno v `brand.ts` in v obeh vejah `createPreviewTheme`.

**Vprašanje zate:** ali naj strankina barva besedila v temni temi sploh kaj naredi (ton), ali naj se preprosto ignorira in je besedilo vedno skoraj belo?

### 3. Prekriv čez fotografije

Zdaj je fotografija pod ravnim črnim prekrivom pri 60 %. Na beli strani to bere kot globina; na temni postane fotografija najsvetlejša stvar na strani in prekriv jo mora verjetno **potemniti bolj**, ne manj.

### 4. Demo fotografije

Sedanje so svetle notranjosti studia. Na temni strani bodo žarele. To ni vprašanje kode, ampak podatkov — ali za `ui-003` pripravimo temnejši nabor, ali sprejmemo, da so fotografije svetle točke.

---

## Faza 1 — postavitev repozitorija

1. Kopija `ui-002` brez git zgodovine; ohrani se ta `main` s `PLAN.md`.
2. Preimenovanja identitete: `package.json` (`name`, `description`, `sitegen.uiId: "003"`), `sitegen-ui.json` (`uiId: "003"`), `README.md`.
3. `pnpm install`, `pnpm verify`, `pnpm build` — **zabeleži, da se kopija zgradi, preden karkoli spremenim**. To je referenčno stanje.
4. Prvi commit = delujoča kopija svetle teme.

## Faza 2 — paleta

Vse delo v treh datotekah:

- **`src/app/theme/colors.ts`** — `background.default` in `paper`, `text.primary` in `secondary`, privzetki.
- **`src/app/theme/brand.ts`** — `brandSurfaces` (tint, border, scrim, placeholder), `headerPalette`, `footerPalette` in izpeljava čitljive barve besedila iz odločitve 2.
- **`src/theme.ts`** — če se kje skriva svetla predpostavka.

Pravila iz `ui-002` veljajo nespremenjena: vse izpeljanke v **obeh** vejah `createPreviewTheme`, nobene trdo zapisane barve v komponentah, nobene trdo zapisane pisave.

Ob koncu faze 2 se mora stran zgraditi in vse strani odpreti v temni paleti.

## Faza 3 — kar dark razkrije

Šele s temno podlago se vidi, kaj je bilo doslej belo po naključju. Pričakujem:

- robovi kartic, ki na belem niso bili vidni in na temnem zažarijo;
- sence, ki na temnem ne delajo ničesar;
- pas partnerjev, ki logotipe izriše sivo pri 65 % — na temnem bodo izginili;
- obrazci: polja, obrobe, mesta vpisa, sporočila o napaki;
- `SubscribeSection` in `TeamCard`, kjer je belo trdo zapisano nad fotografijo — preveriti, ali tam belo še vedno drži.

## Faza 4 — preverjanje

`ui-002` prinese s sabo `pnpm test:variants` in z njim **preverbo besedila, ki ga ni videti**. Ta je za temno temo bistveno bolj pomembna kot za svetlo: vsaka pozabljena vrednost se pokaže kot temno na temnem in preverba jo ujame na posnetku.

Poleg tega vse, kar je bilo narejeno na `ui-002`: enakost poti in sider z `ui-002`, uhajanje pri enajstih širinah, konzola in omrežje, ritem in robovi, urejevalnik teme.

Nabor v `fixtures/` se prenese; smiselno je dodati še varianto s **svetlo strankino barvo besedila**, ker je to najbolj verjeten način, da temna tema razpade.

## Kaj se NE spreminja

Isto kot v `ui-002`: `src/core/*`, `scripts/*`, `templates/pages/**`, `next.config.ts`, `tsconfig.json`, `website.json`, `src/data/`, `public/data/`, vrstni red sekcij in pogoji prikaza v `src/page-content/pages/*`, `src/app/layout.tsx` in `AppProviders`.

Razmiki, tipografija in postavitev prav tako ne. Če se pri delu pokaže, da je kaj od tega narobe, gre popravek **najprej v `ui-002`** in se od tam prenese sem — sicer se temi razideta v nečem, kar ni barva.
