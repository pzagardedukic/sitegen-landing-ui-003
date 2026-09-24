import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { publishRuntimeData } from "./snapshot/data";
import type { SnapshotWebsite } from "../src/core/snapshot-model";

/** Prebuild/dev publisher. No exported HTML exists at this stage yet. */
export function publishWebsiteData() {
  const site = JSON.parse(
    fs.readFileSync("website.json", "utf8"),
  ) as SnapshotWebsite;
  const version = publishRuntimeData(site, path.resolve("public/data"));
  console.log(`Published runtime JSON (${version}).`);
}

const isMainModule =
  process.argv[1] !== undefined &&
  path.resolve(process.argv[1]) ===
    path.resolve(fileURLToPath(import.meta.url));
if (isMainModule) {
  const renderer = path.resolve(".sitegen-meta/refresh.cjs");
  const args = process.argv.slice(2).filter((arg) => arg !== "--");
  const hasCustomOut = args.includes("--out");
  if (
    fs.existsSync(renderer) &&
    (hasCustomOut || fs.existsSync("out/index.html"))
  ) {
    const result = spawnSync(
      process.execPath,
      [renderer, "--out", "out", "--website", "website.json", ...args],
      { stdio: "inherit" },
    );
    if (result.error) throw result.error;
    process.exitCode = result.status ?? 1;
  } else if (hasCustomOut) {
    throw new Error("No META renderer is available. Run a FULL build first.");
  } else {
    publishWebsiteData();
    console.log(
      "Development JSON only; no export found. Run pnpm build to generate SEO HTML.",
    );
  }
}
