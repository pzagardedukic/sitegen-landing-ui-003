import fs from "fs";
import path from "path";

import type {
  MultiLanguageText,
  SupportedLang,
  WebsiteJson,
  WebsiteSlimJson,
} from "@/core/types";
import { slugify } from "@/core/utils";

import { publishWebsiteData } from "./updateWebsiteData";

/* ──────────────────────────────────────────────
   Paths
────────────────────────────────────────────── */
const root = process.cwd();

const SOURCE_PATH = path.join(root, "website.json");
const STATIC_TARGET_PATH = path.join(root, "src/data/website.json");

/* ──────────────────────────────────────────────
   Helpers
────────────────────────────────────────────── */
const buildSlugs = (
  items: { title: MultiLanguageText }[],
  lang: SupportedLang,
): string[] =>
  items.map((item, index) => {
    const title = item.title?.[lang] ?? "";
    return `${index + 1}-${slugify(title)}`;
  });

/* ──────────────────────────────────────────────
   Main
────────────────────────────────────────────── */
const fullJson: WebsiteJson = JSON.parse(fs.readFileSync(SOURCE_PATH, "utf-8"));

const primaryLanguage = fullJson.general.primaryLanguage;

const slimJson: WebsiteSlimJson = {
  general: {
    primaryLanguage,
    supportedLanguages: fullJson.general.supportedLanguages,
  },
  home: {
    websiteName: fullJson.home.websiteName,
    slogan: fullJson.home.slogan,
    companyLogo: {
      text: fullJson.home.companyLogo.text,
      file: fullJson.home.companyLogo.image?.file as string,
    },
  },
  contactInfo: fullJson.contactInfo
    ? {
        company: fullJson.contactInfo.company,
        contact: fullJson.contactInfo.contact ?? [],
      }
    : undefined,
  optionalSections: fullJson.optionalSections,
  blog: fullJson.blog
    ? { slugs: buildSlugs(fullJson.blog.items, primaryLanguage) }
    : undefined,
  portfolio: fullJson.portfolio
    ? { slugs: buildSlugs(fullJson.portfolio.items, primaryLanguage) }
    : undefined,
  pricing: fullJson.pricing
    ? { slugs: buildSlugs(fullJson.pricing.items, primaryLanguage) }
    : undefined,
  careers: fullJson.careers
    ? { slugs: buildSlugs(fullJson.careers.items, primaryLanguage) }
    : undefined,
  events: fullJson.events
    ? { slugs: buildSlugs(fullJson.events.items, primaryLanguage) }
    : undefined,
};

/* ──────────────────────────────────────────────
   Write output
────────────────────────────────────────────── */

// Build-time slim JSON
fs.mkdirSync(path.dirname(STATIC_TARGET_PATH), { recursive: true });
fs.writeFileSync(STATIC_TARGET_PATH, JSON.stringify(slimJson, null, 2));

console.log("✅ Slim website.json generated successfully");

// Runtime data publishing (delegated)
publishWebsiteData();
