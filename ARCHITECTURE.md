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

Build-time SEO files may additionally import:

```text
@/core/seo
```

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
