import type { MetadataRoute } from "next";
import { getInitialSeoSeed } from "@/core/seo-state";

/*
 * The route list used to be assembled here a second time, by hand, from the enabled sections
 * and every slug helper. The seed already knows every route and its canonical address, and
 * knows which ones are noindex, so listing them twice could only ever disagree.
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(getInitialSeoSeed().pages)
    .filter((page) => page.canonical && !page.noindex)
    .map((page) => ({ url: page.canonical }));
}
