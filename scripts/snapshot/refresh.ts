import fs from "node:fs";
import path from "node:path";
import { performance } from "node:perf_hooks";
import {
  assertMetaCompatible,
  makeSeoSeed,
  patchExportedHtml,
  escapeHtml,
  type SnapshotManifest,
  type SnapshotRoute,
  type SnapshotWebsite,
} from "../../src/core/snapshot-model";
import { renderPrimarySnapshot } from "./render";
import {
  prepareRuntimeData,
  atomicWrite,
  removeOldWebsiteJsonFiles,
} from "./data";

function argsOf(argv: string[]) {
  const result = {
    out: "out",
    website: "website.json",
    manifest: path.join(__dirname, "manifest.json"),
    dryRun: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    if (key === "--") continue;
    if (key === "--dry-run") {
      result.dryRun = true;
      continue;
    }
    if (
      !["--out", "--website", "--manifest"].includes(key) ||
      !argv[i + 1] ||
      argv[i + 1].startsWith("--")
    ) {
      throw new Error(
        `Unknown or missing argument: ${key}. Use --out DIR --website FILE [--manifest FILE] [--dry-run].`,
      );
    }
    result[key.slice(2) as "out" | "website" | "manifest"] = argv[++i];
  }
  return result;
}
function htmlFiles(directory: string, prefix = ""): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (["_next", "data", "images", "assets"].includes(entry.name)) return [];
    if (entry.isSymbolicLink())
      throw new Error(
        `Symlink inside route tree is not supported: ${entry.name}`,
      );
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      return htmlFiles(path.join(directory, entry.name), relative);
    }
    return entry.name.endsWith(".html") ? [relative] : [];
  });
}

export function refreshExport(argv = process.argv.slice(2)) {
  const started = performance.now();
  const options = argsOf(argv);
  const output = fs.realpathSync(path.resolve(options.out));
  const manifest = JSON.parse(
    fs.readFileSync(options.manifest, "utf8"),
  ) as SnapshotManifest;
  if (manifest.schema !== 1)
    throw new Error("Unknown META renderer manifest version");
  const site = JSON.parse(
    fs.readFileSync(options.website, "utf8"),
  ) as SnapshotWebsite;
  assertMetaCompatible(site, manifest);
  const seed = makeSeoSeed(site, manifest);
  const css = fs.readFileSync(path.join(__dirname, "refresh.css"), "utf8");
  const files = htmlFiles(output);
  for (const route of manifest.routes) {
    if (route.page !== "not-found" && !files.includes(route.file)) {
      throw new Error(
        `Missing expected exported page: ${route.file}. FULL build required.`,
      );
    }
  }
  // Validate and render ALL files before changing any output. Publish to a staged
  // release and switch your current symlink only after this command succeeds.
  const updates: { destination: string; content: string }[] = [];
  for (const file of files) {
    let route: SnapshotRoute = manifest.routes.find(
      (route) => route.file === file,
    ) ?? {
      path: "/404/",
      file,
      page: "not-found",
    };
    if (
      route.id &&
      (site[route.page] as { items?: { status?: string }[] })?.items?.[
        route.id - 1
      ]?.status === "DISABLED"
    ) {
      route = { ...route, page: "not-found", slug: undefined, id: undefined };
    }
    const markup = renderPrimarySnapshot(site, route, manifest.basePath);
    const snapshot = `<style data-sitegen-snapshot-css="true">${css.replace(/<\/style/gi, "<\\/style")}</style>${markup}`;
    const filename = path.resolve(output, file);
    const html = fs.readFileSync(filename, "utf8");
    // Preserve the canonical/meta entry of a disabled detail route; it is noindex.
    const metadataRoute =
      manifest.routes.find((route) => route.file === file) ?? route;
    updates.push({
      destination: filename,
      content: patchExportedHtml(html, snapshot, seed, metadataRoute),
    });
  }
  const data = prepareRuntimeData(site);
  for (const file of data.files)
    updates.push({
      destination: path.join(output, "data", file.file),
      content: file.content,
    });
  const urls = Object.values(seed.pages)
    .filter((meta) => !meta.noindex && meta.canonical)
    .map((meta) => meta.canonical);
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${escapeHtml(url)}</loc></url>`).join("")}</urlset>`;
  updates.push({
    destination: path.join(output, "sitemap.xml"),
    content: sitemap,
  });
  updates.push({
    destination: path.join(output, "robots.txt"),
    content: `User-agent: *\nAllow: /\n${manifest.siteOrigin ? `Sitemap: ${manifest.siteOrigin}${manifest.basePath}/sitemap.xml\n` : ""}`,
  });
  // meta.json is the last mutable pointer written. Each publish gets a new
  // versioned filename to force Cloudflare to fetch fresh content. Older
  // versioned JSON files are intentionally removed below; stale open tabs may
  // 404 until reload, which is an accepted tradeoff so new visitors always get
  // the newest content.
  updates.push({
    destination: path.join(output, "data/meta.json"),
    content: data.meta,
  });
  if (!options.dryRun) {
    removeOldWebsiteJsonFiles(path.join(output, "data"));
    for (const update of updates)
      atomicWrite(update.destination, update.content);
  }
  console.log(
    `${options.dryRun ? "Validated" : "Refreshed"} ${files.length} primary-language HTML files + runtime JSON in ${((performance.now() - started) / 1000).toFixed(2)}s; no Next build.`,
  );
  return { pageCount: files.length, version: data.version };
}

if (typeof require !== "undefined" && require.main === module) {
  try {
    refreshExport();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
