# Validation record

## Redesign, 2 September 2026

Checks run against this repository after the visual layer was finished, with
`sitegen-landing-ui-001` at `fbf006b`-equivalent `main` as the reference.

### Build and boundary

- `pnpm verify` — the core/UI boundary scan passes and `tsc --noEmit` is clean.
- `pnpm build` — the static export succeeds: 48 prerendered pages, 46 of them
  `index.html` routes plus `robots.txt` and `sitemap.xml`.

### Equivalence with `ui-001`

`ui-001` was cloned to a scratch directory, given this repository's `website.json`,
and built with the same core package. Both exports were then served and read back
through headless Edge, because the exported HTML is only a shell — every page is a
client component, so the section markup exists after hydration and cannot be
grepped out of `out/**/index.html`.

- **Routes** — identical: the same 46 `out/**/index.html` paths, byte for byte in
  the sorted listing.
- **Anchors** — identical on all 46 routes once React-generated ids (`_r_*`) are
  excluded. Getting there needed one fix: the redesigned title band draws its own
  card instead of sitting inside a `Section`, and the page anchor went with the
  wrapper on five routes (`#events`, `#event`, `#legal`, `#schedule`, `#career`).
  `HeaderSection` now takes an optional `id`.
  Where `ui-001`'s wrapper carried the same id as the content section below it —
  `blog`, `cenik`, `projekti` and the rest — `ui-002` renders the id once. That
  duplicate is invalid HTML and was not reproduced.
- **Links** — the same set per route apart from three deliberate visual-layer
  changes: the catalogue page links its PDF, the video page links out to YouTube,
  and the about page links its certifications. Phone numbers are also normalised
  (`tel:+38615550125` rather than `tel:+386 1 555 01 25`).
- **Titles** — identical on every route.
- The events page swaps `ui-001`'s category `Select` for the Figma chip row
  (`CategorySelector`). Same `useListFilters` behaviour, different control.

### DOM stability

Every route was loaded at 390 and 1440 and its node count read twice, four seconds
apart. This caught a page-freezing bug: `/o-nas/` grew to 32 779 `<img>` elements
at 1440 and was still climbing, because the partner logo could shrink inside the
flex row `Marquee` builds and `autoFill` sizes its copies from the measured group
width. With `flexShrink: 0` restored the strip holds at 27 images, the same as
`ui-001`, and no route grows after it settles.

### Widths

No route overflows horizontally at 600 or 899 — the two edges of MUI's `sm`, which
is the band the 768 Figma frame has to survive. Checked as
`document.documentElement.scrollWidth` against the viewport on all 46 routes, with
the widest offending element reported when it happens; nothing did.

### English

All 46 routes were loaded again with the language runtime switched to `EN`
(`localStorage.site_language`). Every page renders, `<html lang>` follows, and no
route logs a console error or a failed request. Slugs stay Slovenian, which is core
behaviour and matches `ui-001`.

### Theme editor

Verified against a `NEXT_PUBLIC_THEME_EDITOR_ENABLED=true` export, driving the
real `THEME_EDITOR_UPDATE` message and reading computed styles back.

| | website.json theme | after override |
|---|---|---|
| brand gradient | `#8258C8 → #2C84C8` | `#C81E4A → #F0A500` |
| header, scrolled | `rgba(11, 34, 52, .92)` | `rgba(62, 42, 0, .92)` |
| footer | `rgb(242, 247, 251)` | `rgb(254, 249, 239)` |
| h1 / body font | Sora / Manrope | Playfair Display / Inter |
| body text | `#111111` | `#04303A` |

- The gradient and the header and footer palettes follow the customer's colors in
  both branches of `createPreviewTheme` — the base theme and the override branch
  (ui-001#3).
- A banner change still applies after the preview is reloaded, with the payload
  restored from `sessionStorage` (ui-001#2).
- A reset payload returns every value to the `website.json` theme.

### Renders

Full-page captures of 21 routes at 390, 768 and 1440 through headless Edge against
the production export — not the dev server — for the comparison with the Figma
frames.

## Core/UI split

Checks completed when the logic was moved into the core package:

- core/UI boundary scan;
- syntax transpilation of all 228 TypeScript and TSX inputs across the two repositories (27 core and 201 UI, including scripts, templates, and `next.config.ts`);
- UI integration-adapter and generation-script type-checking against the built core declarations;
- generated Slovenian and English website data loading through the core runtime;
- static routes, localization, SEO, translations, and shared utility smoke checks.
