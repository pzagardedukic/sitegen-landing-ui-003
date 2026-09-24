import fs from "node:fs";
import path from "node:path";
import nextEnv from "@next/env";
import {
  makeManifest,
  makeSeoSeed,
  safeJson,
  type SnapshotWebsite,
} from "../src/core/snapshot-model";

nextEnv.loadEnvConfig(process.cwd());
const site = JSON.parse(
  fs.readFileSync("website.json", "utf8"),
) as SnapshotWebsite;
const manifest = makeManifest(
  site,
  process.env.NEXT_PUBLIC_BASE_PATH,
  process.env.NEXT_PUBLIC_SITE_URL,
);
fs.mkdirSync(".sitegen-meta", { recursive: true });
fs.mkdirSync(path.join("src", "data"), { recursive: true });
fs.writeFileSync(
  ".sitegen-meta/manifest.json",
  JSON.stringify(manifest, null, 2),
);
fs.writeFileSync(
  "src/data/primary-seo.json",
  safeJson(makeSeoSeed(site, manifest)),
);
console.log(
  `Prepared ${manifest.routes.length} primary-language snapshot routes (one route tree).`,
);
