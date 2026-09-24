import type { MetadataRoute } from "next";
import { getInitialSeoSeed } from "@/core/seo-state";

/*
 * Read from the same seed the pages use, so the address here cannot drift from the one in
 * their canonical links. The snapshot renderer writes this file again after the build; both
 * paths must agree, which they do only by sharing a source.
 */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const home = getInitialSeoSeed().pages["/"].canonical;
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(home ? { sitemap: `${home}sitemap.xml` } : {}),
  };
}
