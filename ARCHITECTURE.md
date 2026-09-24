# Landing UI architecture

```text
website.json
    │
    ├── existing build scripts ──> generated slim/static and localized runtime files
    │
    └── src/core adapters
            │
            ▼
@ptlabTadej/sitegen-landing-core@1.x
            │
            ▼
src/components + src/page-content + src/app/theme
```

## Import rule

Visual code may import from these local facades:

```text
@/core/runtime
@/core/static
@/core/translations
@/core/react
@/core/utils
@/core/types
@/core/constants
```

The two SEO components in `src/components/seo` may additionally import:

```text
@/core/seo-state
@/core/font-startup
@/core/language-startup
```

Page metadata comes from the SEO seed those adapters read, not from Next's build-time
metadata payload: the snapshot renderer refreshes the exported HTML and the seed together,
per route. `@/core/seo` and `@/core/snapshot-model` are build-time and renderer-side only;
the seed import itself lives in `@/core/seo-state`, so visual code never reaches `@/data/`.

Visual code must not import:

```text
website.json
@/data/website
@/data/websiteStatic
@ptlabTadej/sitegen-v2-shared-types
```

The adapters are intentionally local. They bind one site repository to a generic core package while keeping raw data and package setup out of visual components.

## Compatibility rule

- `sitegen-landing-core@1.x` is the contract family for this UI.
- Patch and minor core upgrades must remain backward-compatible.
- A required selector rename, removed model field, changed runtime lifecycle, or changed route contract requires a new core major.
- A UI is upgraded by changing its exact dependency and `testedCoreVersion` only after build and visual verification.
