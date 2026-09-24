import fs from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import type { SnapshotWebsite } from "../../src/core/snapshot-model";

const languageCodes = new Set(["SL", "EN", "DE", "IT", "HR"]);
export function localizeValue(
  value: unknown,
  language: string,
  primary: string,
): unknown {
  if (Array.isArray(value))
    return value.map((v) => localizeValue(v, language, primary));
  if (!value || typeof value !== "object") return value;
  const object = value as Record<string, unknown>;
  const keys = Object.keys(object);
  if (keys.length && keys.every((key) => languageCodes.has(key))) {
    return object[language] ?? object[primary] ?? "";
  }
  return Object.fromEntries(
    Object.entries(object).map(([key, child]) => [
      key,
      localizeValue(child, language, primary),
    ]),
  );
}
export function atomicWrite(destination: string, content: string) {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  const temporary = `${destination}.${process.pid}.${randomBytes(6).toString("hex")}.tmp`;
  try {
    fs.writeFileSync(temporary, content, "utf8");
    fs.renameSync(temporary, destination);
  } finally {
    fs.rmSync(temporary, { force: true });
  }
}
export function prepareRuntimeData(site: SnapshotWebsite) {
  const primary = site.general.primaryLanguage;
  const languages = [...new Set([primary, ...site.general.supportedLanguages])];
  const version = `${Date.now()}_${randomBytes(6).toString("hex")}`;
  const files = languages.map((language) => ({
    file: `website_${language.toLowerCase()}_${version}.json`,
    content: JSON.stringify(localizeValue(site, language, primary)),
  }));
  return { version, files, meta: JSON.stringify({ version }) };
}
/**
 * Deliberately remove every previously published versioned website JSON file.
 *
 * Do NOT change this to retain old versions. The versioned filename is used to
 * bust Cloudflare caching: each publish must expose a brand-new URL so new
 * visitors cannot receive stale content from cache. We intentionally prefer
 * this over supporting already-open tabs that still reference an old version;
 * those tabs may get a 404 until the browser is reloaded, and that tradeoff is
 * accepted.
 */
export function removeOldWebsiteJsonFiles(directory: string) {
  if (!fs.existsSync(directory)) return;
  for (const file of fs.readdirSync(directory)) {
    if (/^website(?:_[a-zA-Z]+)?_\d+(?:_[a-f0-9]+)?\.json$/i.test(file)) {
      fs.unlinkSync(path.join(directory, file));
    }
  }
}
export function publishRuntimeData(site: SnapshotWebsite, directory: string) {
  const data = prepareRuntimeData(site);
  removeOldWebsiteJsonFiles(directory);
  for (const file of data.files)
    atomicWrite(path.join(directory, file.file), file.content);
  atomicWrite(path.join(directory, "meta.json"), data.meta);
  return data.version;
}
