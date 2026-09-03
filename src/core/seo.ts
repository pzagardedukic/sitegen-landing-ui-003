import { createSeoRuntime } from "@ptlabTadej/sitegen-landing-core/seo";
import fullWebsiteJson from "../../website.json" with { type: "json" };
import { imgWithBasePath, primaryLanguage } from "./static";

const seoRuntime = createSeoRuntime({
  website: fullWebsiteJson,
  primaryLanguage,
  imgWithBasePath,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
});

export const {
  SITE_URL,
  buildItemMetadata,
  getSeoPricingItem,
  getSeoBlogItem,
  getSeoPortfolioItem,
  getSeoEventItem,
  getSeoCareerItem,
  getSeoOrganization,
} = seoRuntime;
