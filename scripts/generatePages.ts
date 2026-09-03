import fs from "fs";
import path from "path";
import { primaryLanguage, slugs } from "@/core/static";

/* ──────────────────────────────────────────────
   Paths
────────────────────────────────────────────── */
const root = process.cwd();

const TARGET_PATH = path.join(root, "src/app", "(pages)");
const SOURCE_PATH = path.join(root, "templates", "pages");

/* ──────────────────────────────────────────────
   Main
────────────────────────────────────────────── */
fs.rmSync(TARGET_PATH, { recursive: true, force: true });
fs.mkdirSync(TARGET_PATH, { recursive: true });

for (const [pageKey, translatedSlug] of Object.entries(
  slugs[primaryLanguage],
)) {
  const src = path.join(SOURCE_PATH, pageKey);
  const dest = path.join(TARGET_PATH, translatedSlug);

  fs.cpSync(src, dest, { recursive: true });
}

console.log("✅ Pages generated successfully");
