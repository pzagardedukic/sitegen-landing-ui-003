# sitegen-landing-ui-003

The dark twin of `sitegen-landing-ui-002`: the same layout and the same behaviour, a dark palette derived from the customer's three colors.

It is a **redesign only**. Behaviour is deliberately identical to `sitegen-landing-ui-001`: the same `website.json`, the same core major, the same section order and enablement conditions, the same routes, anchors and SEO. What differs is the theme and the visual components.

The redesign plan, including the decisions taken and the theme-editor rules that constrain it, is in [`PLAN.md`](./PLAN.md). What the Figma dark frames say, and how the palette is derived from them, is in [`TEMA-DARK.md`](./TEMA-DARK.md) and [`NACRT-POVRSINE.md`](./NACRT-POVRSINE.md).

## Primary-language HTML (SEO snapshots)

The export used to be a shell: every page is a client component, so a reader without
JavaScript — a search engine, a link preview — got an empty document. Since the core
`1.1.0` upgrade the build renders the primary language into the HTML as well.

A build has four stages, chained in `pnpm build`:

1. `prepare:site` writes the slim site data, the route folders, `.sitegen-meta/manifest.json`
   and the SEO seed `src/data/primary-seo.json`;
2. `next build` exports the pages, each with an **empty** snapshot island and a managed head;
3. `buildSnapshotRenderer.ts` bundles `scripts/snapshot/` into the standalone
   `.sitegen-meta/refresh.cjs` — it carries its own dependencies, so a republish needs no
   `node_modules`;
4. `refresh.cjs` renders the real page components and splices them between
   `<!--sitegen-primary-html:start-->` and `<!--sitegen-primary-html:end-->`, replaces the
   managed head per route, and rewrites `sitemap.xml`, `robots.txt` and `data/meta.json`.

Two rules this depends on:

- **`markContentReady()` in `PageLayout` is the only thing that removes the island.** Without
  that call every page renders its content twice — invisible in the static HTML, because the
  island belongs there; only a browser shows it.
- **Both layouts carry the island.** The snapshot step refuses an export without it, so a
  theme-editor build (`layout.editor.tsx`) fails while the default build still succeeds.

Content metadata has a single source: the seed. `generateMetadata` and the root `metadata`
export are gone, and `robots.ts` and `sitemap.ts` read the same seed.

`.sitegen-meta/` and `src/data/primary-seo.json` are generated **and committed**, as in
`ui-001` and `ui-004`; the price is a large diff whenever the bundle changes.

A published build needs both `NEXT_PUBLIC_BASE_PATH` and `NEXT_PUBLIC_SITE_URL`, and the
site URL must carry the base path — `prepareSnapshots.ts` rejects a mismatch. Without the
site URL the sitemap is empty and no canonical links are written.

## Core compatibility

This UI targets contract major `1` and pins the tested package exactly:

```json
"@ptlabTadej/sitegen-landing-core": "1.1.0"
```

`1.1.0` renders no HTML by itself. It adds the `./language` entry point (the pre-paint
language bootstrap and the `sitegen:content-ready` event) and a synchronous
`initialWebsiteJson` seed for the standalone renderer; the snapshot mechanics live here.

Upgrade it only together with a successful build and visual regression check. The same compatibility data is available in `sitegen-ui.json` and the `sitegen` field in `package.json` for backend validation.

## Repository boundary

### Core-owned behavior

The UI consumes core behavior through `src/core/*`:

- localized website selectors;
- language state and language switching;
- section enablement;
- page and item slugs;
- path and base-path handling;
- translations;
- SEO models, and the language bootstrap the snapshot island depends on;
- pagination, filtering, previous-location, date, file, video, and public API utilities.

### UI-owned behavior

This repository owns:

- the Next.js app and route templates;
- the existing website-data generation scripts;
- MUI theme and theme-editor integration;
- page composition and section order;
- visual components, markup, spacing, animation, shape, typography, and responsive layout;
- public visual assets.

## `website.json` boundary

Visual files under `src/app`, `src/components`, and `src/page-content` do not import or interpret `website.json` or the shared schema package.

Raw data is connected only in the integration layer:

- `src/core/static.ts` binds generated slim build data and route slugs;
- `src/core/runtime.tsx` creates the runtime data and language instances;
- `src/core/snapshot-model.ts` derives the route manifest and the SEO seed from the root
  `website.json`, for the build scripts and the standalone renderer;
- `src/core/seo-state.ts` reads the seed — from the document when the export has been
  refreshed, otherwise from the generated `src/data/primary-seo.json`;
- `src/core/language-startup.ts` binds the language preference to the base path.

`src/core/seo.ts` is no longer read by anything: the seed owns titles, descriptions and
share images. It is kept as the core model it always was, not as a second source of truth.

The existing scripts still generate `src/data/website.json` and `public/data/website_<language>_<version>.json`.

## Commands

```bash
pnpm install
pnpm verify
pnpm build
pnpm test:export
```

`pnpm test:export` reads the built export and asserts, per route, that the island carries a
`<main>`, that the document opens in the primary language with the bootstrap in place, that
the embedded seed matches a freshly computed one and that the title comes from it.
`pnpm meta:update` re-renders an existing export without a Next build, for a content-only
change.

`pnpm verify` runs the core/UI boundary scan and the type check. The boundary scan fails if anything under `src/app`, `src/components` or `src/page-content` imports `website.json`, `@/data/`, the shared-types package or the core package directly — that guard is what keeps a redesign from drifting into core-owned behaviour.

Installing requires access to the private `@ptlabTadej` scope on GitHub Packages; see `.npmrc` and use a token with `read:packages`.

## Intentional differences from `ui-001`

Three defects in `ui-001` are fixed here, so the two UIs behave differently on these points. Each is tracked upstream:

- the header and footer palettes follow the customer's colors instead of staying hardcoded — [ui-001#3](https://github.com/ptlabTadej/sitegen-landing-ui-001/issues/3);
- theme-editor banner updates keep working after a preview reload — [ui-001#2](https://github.com/ptlabTadej/sitegen-landing-ui-001/issues/2);
- `Section` calls `useBannerImage()` unconditionally — [ui-001#1](https://github.com/ptlabTadej/sitegen-landing-ui-001/issues/1).

One more difference falls out of the redesign rather than from a fix. On every
subpage `ui-001` wraps the title band in a `Section` whose id repeats the id of the
content section below it, so the page renders the same id twice. Here the band draws
its own card and the id appears once. Where the wrapper carried an id of its own —
`#events`, `#event`, `#legal`, `#schedule`, `#career` — `HeaderSection` takes it as a
prop, so those anchors still resolve. `VALIDATION.md` records the route-by-route
comparison.
