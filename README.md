# sitegen-landing-ui-002

The second visual implementation of the Sitegen landing-site contract.

It is a **redesign only**. Behaviour is deliberately identical to `sitegen-landing-ui-001`: the same `website.json`, the same core major, the same section order and enablement conditions, the same routes, anchors and SEO. What differs is the theme and the visual components.

The redesign plan, including the decisions taken and the theme-editor rules that constrain it, is in [`PLAN.md`](./PLAN.md).

## Core compatibility

This UI targets contract major `1` and pins the tested package exactly:

```json
"@ptlabTadej/sitegen-landing-core": "1.0.0"
```

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
- SEO models and metadata;
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
- `src/core/seo.ts` binds the root `website.json` for build-time SEO;
- `src/core/runtime.tsx` creates the runtime data and language instances.

The existing scripts still generate `src/data/website.json` and `public/data/website_<language>_<version>.json`.

## Commands

```bash
pnpm install
pnpm verify
pnpm build
```

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
