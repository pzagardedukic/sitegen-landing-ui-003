#!/usr/bin/env node
/*
 * Build the theme against the kind of data a customer actually produces, and check it.
 *
 * The theme is chosen in the wizard and every customer's `website.json` is different, so a
 * pass over the demo data proves very little. Every file in `fixtures/` is one patch onto
 * that data; each is built and put through the same checks, and the report says which
 * variant broke what.
 *
 * Usage:
 *   pnpm test:variants                       all fixtures
 *   pnpm test:variants brez-logotipa         only the named ones
 *   pnpm test:variants --widths 390,1440     narrower sweep
 *   pnpm test:variants --keep                keep each variant's export
 *   pnpm test:variants --all-routes          every route, not one per template
 */
import { execFileSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { basename, join } from "node:path";

import { applyPatch } from "./variants/merge.mjs";
import { serveExport } from "./variants/server.mjs";
import { launch } from "./variants/browser.mjs";
import {
  capturePageWithBoxes,
  findInvisibleText,
  inspectRoute,
} from "./variants/checks.mjs";

const ROOT = process.cwd();
const FIXTURES = join(ROOT, "fixtures");
const OUTPUT = join(FIXTURES, "shots");
const WEBSITE = join(ROOT, "website.json");
const PORT = 3211;
const DEBUG_PORT = 9711;

const argv = process.argv.slice(2);
const flag = (name) => {
  const index = argv.indexOf(`--${name}`);
  return index === -1 ? null : argv[index + 1];
};
const has = (name) => argv.includes(`--${name}`);

const widths = (flag("widths") ?? "390,768,1440").split(",").map(Number);
const named = argv.filter((entry) => !entry.startsWith("--") && entry !== flag("widths"));

/*
 * The data scripts read website.json from the working directory and nothing about that is
 * configurable, so a variant has to be written into place. That is only safe from a clean
 * tree: otherwise the restore at the end would take the author's own edits with it.
 */
const dirty = execFileSync("git", ["status", "--porcelain", "--", "website.json"], {
  encoding: "utf8",
}).trim();

if (dirty) {
  console.error(
    "website.json has uncommitted changes.\n" +
      "This script swaps that file and restores it afterwards, which would take your edits\n" +
      "with it. Commit or stash them first.\n\n" +
      dirty,
  );
  process.exit(1);
}

/*
 * A copy on disk, written before anything is swapped.
 *
 * The handlers below cover every signal that can be caught, and twice that was not enough:
 * the run was killed outright and left the repository holding a variant's data, which then
 * looks like an edit nobody made. A file survives a kill, so the next run puts it back.
 */
const JOURNAL = join(FIXTURES, ".website-json-backup");

if (existsSync(JOURNAL)) {
  writeFileSync(WEBSITE, readFileSync(JOURNAL, "utf8"));
  rmSync(JOURNAL, { force: true });
  try {
    execFileSync("git", ["checkout", "--", "src/data"], { stdio: "pipe" });
  } catch {
    /* nothing to put back */
  }
  console.log("Recovered website.json from an earlier run that was killed.\n");
}

const original = readFileSync(WEBSITE, "utf8");
writeFileSync(JOURNAL, original);
let restored = false;

/*
 * Only website.json is put back. The generated data under public/data carries a fresh
 * version in its filename on every build, so it is dirty after any `pnpm build` and always
 * has been — reverting it here would only leave `out/` pointing at files that no longer
 * exist. src/data is generated and content-stable, so that one can go back.
 */
const restore = () => {
  if (restored) return;
  restored = true;
  writeFileSync(WEBSITE, original);
  try {
    execFileSync("git", ["checkout", "--", "src/data"], { stdio: "pipe" });
  } catch {
    /* nothing generated yet */
  }
  rmSync(JOURNAL, { force: true });
};

/*
 * Every way out has to put website.json back. An earlier run was killed with SIGTERM,
 * which had no handler, and left the repository holding a variant's data.
 */
process.on("exit", restore);
for (const signal of ["SIGINT", "SIGTERM", "SIGHUP", "SIGBREAK"]) {
  process.on(signal, () => {
    restore();
    process.exit(130);
  });
}
process.on("uncaughtException", (error) => {
  restore();
  console.error(error);
  process.exit(1);
});

const fixtures = readdirSync(FIXTURES)
  .filter((file) => file.endsWith(".json") && file !== "report.json")
  .map((file) => basename(file, ".json"))
  .filter((name) => named.length === 0 || named.includes(name));

if (fixtures.length === 0) {
  console.error(`No fixtures matched. Available: ${readdirSync(FIXTURES).join(", ")}`);
  process.exit(1);
}

const routesOf = (exportDir) => {
  const found = [];
  const walk = (dir, prefix) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (entry.name === "_next") continue;
        walk(join(dir, entry.name), `${prefix}${entry.name}/`);
      } else if (entry.name === "index.html") {
        found.push(prefix);
      }
    }
  };
  walk(exportDir, "");
  return found.sort();
};

/*
 * One route per template by default. Ten pricing packages are ten renderings of the same
 * component with different words; checking all of them for every variant at every width
 * costs an hour and finds what the first one already found. --all-routes overrides it.
 */
const oneOfEachTemplate = (routes) => {
  const seen = new Set();
  return routes.filter((route) => {
    const parts = route.split("/").filter(Boolean);
    if (parts.length < 2) return true;
    const template = parts.slice(0, -1).join("/");
    if (seen.has(template)) return false;
    seen.add(template);
    return true;
  });
};

const report = {};
let failures = 0;

for (const name of fixtures) {
  const fixture = JSON.parse(readFileSync(join(FIXTURES, `${name}.json`), "utf8"));
  console.log(`\n=== ${name} — ${fixture.description}`);

  writeFileSync(
    WEBSITE,
    `${JSON.stringify(applyPatch(JSON.parse(original), fixture.patch), null, 2)}\n`,
  );

  const exportDir = join(FIXTURES, "out", name);
  rmSync(exportDir, { recursive: true, force: true });

  try {
    execFileSync("pnpm", ["build"], { stdio: "pipe", shell: true });
  } catch (error) {
    console.log("  build FAILED");
    report[name] = { description: fixture.description, buildFailed: true };
    failures += 1;
    continue;
  }

  mkdirSync(join(FIXTURES, "out"), { recursive: true });
  cpSync(join(ROOT, "out"), exportDir, { recursive: true });

  const allRoutes = routesOf(exportDir);
  const routes = has("all-routes") ? allRoutes : oneOfEachTemplate(allRoutes);
  const server = await serveExport(exportDir, PORT);
  const browser = await launch({
    port: DEBUG_PORT,
    profileDir: join(FIXTURES, "out", ".browser"),
  });

  await browser.send("Page.enable");
  await browser.send("Runtime.enable");
  await browser.send("Network.enable");

  const variantReport = {
    description: fixture.description,
    routes: routes.length,
    routesBuilt: allRoutes.length,
    problems: [],
  };

  for (const width of widths) {
    await browser.send("Emulation.setDeviceMetricsOverride", {
      width,
      height: 900,
      deviceScaleFactor: 1,
      mobile: width < 600,
    });

    for (const route of routes) {
      const url = `http://127.0.0.1:${PORT}/${route}`;
      /* The growth check needs a second reading seconds later; one width is enough. */
      const result = await inspectRoute(browser, url, { growth: width === widths[0] });
      const where = `${width} /${route}`;

      if (result.complaints.length) {
        variantReport.problems.push(`${where}: ${result.complaints.join(" | ")}`);
      }
      if (result.overflow > 1) {
        variantReport.problems.push(`${where}: overflows by ${result.overflow}px (${result.worstOverflow})`);
      }
      if (result.clipped.length) {
        variantReport.problems.push(`${where}: text clipped — ${result.clipped.join(" / ")}`);
      }
      if (result.brokenImages.length) {
        variantReport.problems.push(`${where}: images did not render — ${result.brokenImages.join(", ")}`);
      }
      if (result.growing) {
        variantReport.problems.push(`${where}: DOM still growing after it settled (${result.nodes} nodes)`);
      }
      if (result.headings === 0) {
        variantReport.problems.push(`${where}: no headings on the page`);
      }

      const shotDir = join(OUTPUT, name);
      mkdirSync(shotDir, { recursive: true });
      const shotPath = join(shotDir, `${(route || "home").replace(/\//g, "_")}-${width}.png`);
      const { boxes } = await capturePageWithBoxes(browser, shotPath, width);

      const invisible = findInvisibleText(shotPath, width, boxes, join(FIXTURES, "out"));
      if (invisible && invisible.length) {
        variantReport.problems.push(
          `${where}: text nobody can see — ${invisible.map((i) => `"${i.text}"`).join(", ")}`,
        );
      }
    }
    process.stdout.write(`  ${width} done\n`);
  }

  browser.close();
  server.close();

  if (!has("keep")) rmSync(exportDir, { recursive: true, force: true });

  report[name] = variantReport;
  if (variantReport.problems.length) failures += 1;
  console.log(
    variantReport.problems.length
      ? `  ${variantReport.problems.length} problem(s)`
      : "  clean",
  );
}

restore();
execFileSync("pnpm", ["build"], { stdio: "pipe", shell: true });

writeFileSync(join(FIXTURES, "report.json"), `${JSON.stringify(report, null, 2)}\n`);

console.log("\n─────────────────────────────────────────────");
for (const [name, entry] of Object.entries(report)) {
  const status = entry.buildFailed
    ? "BUILD FAILED"
    : entry.problems.length
      ? `${entry.problems.length} problem(s)`
      : "clean";
  console.log(`${name.padEnd(22)} ${status}`);
  (entry.problems ?? []).slice(0, 6).forEach((problem) => console.log(`    ${problem}`));
  if ((entry.problems ?? []).length > 6) {
    console.log(`    ... ${entry.problems.length - 6} more, see fixtures/report.json`);
  }
}
console.log(`\nScreenshots: ${OUTPUT}`);

process.exit(failures ? 1 : 0);
