import { createLandingStatic } from "@ptlabTadej/sitegen-landing-core/static";
import type { WebsiteSlimJson } from "@ptlabTadej/sitegen-landing-core/types";
import { getFileType } from "@ptlabTadej/sitegen-landing-core/utils";

import websiteJson from "@/data/website.json" with { type: "json" };
const landingStatic = createLandingStatic({
  website: websiteJson as unknown as WebsiteSlimJson,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
});

export const {
  BASE_PATH,
  slugs,
  FALLBACK_IMAGE,
  primaryLanguage,
  supportedLanguages,
  imgWithBasePath,
  withBasePath,
  normalizePath,
  isNavActive,
  isCurrentPath,
  getEnabledSections,
  isSectionEnabled,
  getHomeMeta,
  getAllBlogSlugs,
  getBlogSlugById,
  getAllPortfolioSlugs,
  getPortfolioSlugById,
  getAllPricingSlugs,
  getPricingSlugById,
  getAllCareerSlugs,
  getCareerSlugById,
  getAllEventSlugs,
  getEventSlugById,
  getPageSlugByKey,
  getPageSlugByKeyWithBasePath,
} = landingStatic;

export { getFileType };
export type { PageKey } from "@ptlabTadej/sitegen-landing-core/types";
