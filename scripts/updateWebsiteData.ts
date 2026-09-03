import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT_DIR = process.cwd();
const PUBLIC_DATA_DIR = path.join(ROOT_DIR, "public", "data");
const SOURCE_WEBSITE_JSON = path.join(ROOT_DIR, "website.json");
const META_PATH = path.join(PUBLIC_DATA_DIR, "meta.json");

type LanguageCode = string;

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getUnixTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

function removeOldWebsiteJsonFiles(dir: string) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    if (/^website(_[a-zA-Z]+)?_\d+\.json$/.test(file)) {
      fs.unlinkSync(path.join(dir, file));
    }
  }
}

function isLanguageObject(value: unknown, languages: LanguageCode[]) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const keys = Object.keys(value);

  return keys.length > 0 && keys.every((key) => languages.includes(key));
}

function localizeValue(
  value: unknown,
  lang: LanguageCode,
  languages: LanguageCode[],
): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => localizeValue(item, lang, languages));
  }

  if (isLanguageObject(value, languages)) {
    const localized = (value as Record<string, unknown>)[lang];

    return localized ?? "";
  }

  if (value && typeof value === "object") {
    const result: Record<string, unknown> = {};

    for (const [key, childValue] of Object.entries(value)) {
      result[key] = localizeValue(childValue, lang, languages);
    }

    return result;
  }

  return value;
}

function getAllLanguages(websiteJson: any): LanguageCode[] {
  const primaryLanguage = websiteJson.general?.primaryLanguage;
  const additionalLanguages = websiteJson.general?.supportedLanguages ?? [];

  return [primaryLanguage, ...additionalLanguages].filter(Boolean);
}

/** exported */
export function publishWebsiteData() {
  ensureDir(PUBLIC_DATA_DIR);

  const version = getUnixTimestamp();
  const sourceJson = JSON.parse(fs.readFileSync(SOURCE_WEBSITE_JSON, "utf-8"));

  const languages = getAllLanguages(sourceJson);

  removeOldWebsiteJsonFiles(PUBLIC_DATA_DIR);

  for (const lang of languages) {
    const localizedJson = localizeValue(sourceJson, lang, languages);

    fs.writeFileSync(
      path.join(
        PUBLIC_DATA_DIR,
        `website_${lang.toLowerCase()}_${version}.json`,
      ),
      JSON.stringify(localizedJson, null, 2),
    );
  }

  fs.writeFileSync(
    META_PATH,
    JSON.stringify(
      {
        version,
      },
      null,
      2,
    ),
  );

  console.log(`✅ Runtime website data published (v${version})`);
  console.log(`✅ Generated language files: ${languages.join(", ")}`);
}

const isMainModule =
  process.argv[1] !== undefined &&
  path.resolve(process.argv[1]) ===
    path.resolve(fileURLToPath(import.meta.url));

if (isMainModule) {
  publishWebsiteData();
}
