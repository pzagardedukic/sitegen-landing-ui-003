"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { getInitialSeoSeed, resolvePageMeta, safeJson } from "@/core/seo-state";
import { createThemeFontBootstrapScript } from "@/core/font-startup";

/**
 * The seed in this document is refreshed with its primary-language snapshot.
 * Reading it before hydration keeps META HTML and React's first render aligned.
 * This layout stays mounted on client navigation; metadata comes from the same
 * seed's route map instead of Next's stale build-time metadata payload.
 */
export default function PrimarySeoHead() {
  const [seed] = useState(getInitialSeoSeed);
  const pathname = usePathname() || "/";
  const meta = resolvePageMeta(seed, pathname);
  const fontBootstrap = createThemeFontBootstrapScript(seed.fonts);
  return (
    <>
      <meta id="sitegen-head-start" name="sitegen:head" content="start" />
      <script
        id="sitegen-font-bootstrap"
        dangerouslySetInnerHTML={{ __html: fontBootstrap }}
      />
      <script
        id="sitegen-seo-data"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: safeJson(seed) }}
      />
      <title id="sitegen-title">{meta.title}</title>
      <meta
        id="sitegen-description"
        name="description"
        content={meta.description}
      />
      <meta
        id="sitegen-robots"
        name="robots"
        content={meta.noindex ? "noindex,nofollow" : "index,follow"}
      />
      {meta.canonical && (
        <link id="sitegen-canonical" rel="canonical" href={meta.canonical} />
      )}
      <meta id="sitegen-og-title" property="og:title" content={meta.title} />
      <meta
        id="sitegen-og-description"
        property="og:description"
        content={meta.description}
      />
      <meta
        id="sitegen-og-site"
        property="og:site_name"
        content={seed.siteName}
      />
      <meta id="sitegen-og-type" property="og:type" content="website" />
      {meta.canonical && (
        <meta id="sitegen-og-url" property="og:url" content={meta.canonical} />
      )}
      {meta.image && (
        <meta id="sitegen-og-image" property="og:image" content={meta.image} />
      )}
      <script
        id="sitegen-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJson(seed.organization) }}
      />
      <meta id="sitegen-head-end" name="sitegen:head" content="end" />
    </>
  );
}
