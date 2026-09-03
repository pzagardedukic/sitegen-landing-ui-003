import type { MetadataRoute } from "next";
import {
  isSectionEnabled,
  getPageSlugByKey,
  getAllBlogSlugs,
  getAllPortfolioSlugs,
  getAllPricingSlugs,
  getAllEventSlugs,
  getAllCareerSlugs,
} from "@/core/static";
import { SITE_URL } from "@/core/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "/",
    `/${getPageSlugByKey("about")}`,
    `/${getPageSlugByKey("contact")}`,
  ];

  const sectionPages = (
    [
      "services",
      "portfolio",
      "gallery",
      "pricing",
      "blog",
      "videos",
      "catalogues",
      "careers",
      "faq",
      "schedule",
      "events",
    ] as const
  )
    .filter((key) => isSectionEnabled(key))
    .map((key) => `/${getPageSlugByKey(key)}`);

  const detailPages = [
    ...getAllPricingSlugs().map((s) => `/${getPageSlugByKey("pricing")}/${s}`),
    ...getAllBlogSlugs().map((s) => `/${getPageSlugByKey("blog")}/${s}`),
    ...getAllPortfolioSlugs().map(
      (s) => `/${getPageSlugByKey("portfolio")}/${s}`,
    ),
    ...getAllEventSlugs().map((s) => `/${getPageSlugByKey("events")}/${s}`),
    ...getAllCareerSlugs().map((s) => `/${getPageSlugByKey("careers")}/${s}`),
  ];

  return [...staticPages, ...sectionPages, ...detailPages].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));
}
