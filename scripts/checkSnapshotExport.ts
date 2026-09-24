import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import {
  makeSeoSeed,
  escapeHtml,
  type SnapshotManifest,
  type SnapshotWebsite,
} from "../src/core/snapshot-model";

const output = path.resolve(process.argv[2] || "out");
const manifest = JSON.parse(
  fs.readFileSync(".sitegen-meta/manifest.json", "utf8"),
) as SnapshotManifest;
const site = JSON.parse(
  fs.readFileSync("website.json", "utf8"),
) as SnapshotWebsite;
const seed = makeSeoSeed(site, manifest);
let count = 0;
for (const route of manifest.routes) {
  const filename = path.join(output, route.file);
  if (route.page === "not-found" && !fs.existsSync(filename)) continue;
  const html = fs.readFileSync(filename, "utf8");
  const snapshot = html
    .split("<!--sitegen-primary-html:start-->")[1]
    ?.split("<!--sitegen-primary-html:end-->")[0];
  assert(
    snapshot?.includes("<main"),
    `${route.path}: missing primary body content`,
  );
  assert(
    html.includes(`lang="${manifest.primaryLanguage.toLowerCase()}"`),
    `${route.path}: wrong initial language`,
  );
  assert(
    html.includes('id="sitegen-language-bootstrap"'),
    `${route.path}: missing early preference bootstrap`,
  );
  const match =
    /<script\b[^>]*id="sitegen-seo-data"[^>]*>([\s\S]*?)<\/script>/.exec(html);
  assert(match, `${route.path}: missing fresh SEO seed`);
  assert.deepEqual(JSON.parse(match[1]), seed, `${route.path}: stale SEO seed`);
  const title = /<title\b[^>]*id="sitegen-title"[^>]*>([\s\S]*?)<\/title>/.exec(
    html,
  )?.[1];
  assert.equal(title, escapeHtml(seed.pages[route.path].title));
  const meta = JSON.parse(
    fs.readFileSync(path.join(output, "data/meta.json"), "utf8"),
  ) as { version: string };
  for (const lang of manifest.supportedLanguages) {
    assert(
      fs.existsSync(
        path.join(
          output,
          `data/website_${lang.toLowerCase()}_${meta.version}.json`,
        ),
      ),
    );
  }
  count++;
}
console.log(
  `Verified ${count} exported primary-language snapshots, SEO seeds, and versioned language files.`,
);
