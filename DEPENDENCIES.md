# Dependency baseline

This UI keeps the original theme's public application dependencies and replaces the direct shared-schema dependency with the exact tested core package:

```json
"@ptlabTadej/sitegen-landing-core": "1.0.0"
```

The UI does not import `@ptlabTadej/sitegen-v2-shared-types` directly. Raw schema knowledge stays behind `src/core/*` and the landing core package.

## Supplied source lock

The unmodified pre-split files are retained under `migration/`:

```text
migration/package.theme-v4.pre-split.json
migration/pnpm-lock.theme-v4.pre-split.yaml
```

The old lock is intentionally not named `pnpm-lock.yaml`, because:

1. it describes the old `theme_v4` importer;
2. it declares shared types directly;
3. it resolves shared types `0.1.46`, while the supplied package requests `^0.1.47`;
4. it has no resolution for the new core package.

After publishing core `1.0.0`, generate the UI's active lock with registry authentication enabled:

```bash
pnpm install --no-frozen-lockfile
pnpm verify
pnpm build
```

Commit the generated `pnpm-lock.yaml` together with the exact core dependency version.
