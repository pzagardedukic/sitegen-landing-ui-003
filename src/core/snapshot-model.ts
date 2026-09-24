/** Shared, framework-free metadata and route model for FULL + META publishing. */
import { landingPageSlugs } from "@ptlabTadej/sitegen-landing-core/static";
import {
  slugify,
  stripRichText,
  truncateWordSafe,
} from "@ptlabTadej/sitegen-landing-core/utils";
import {
  getLegalTranslation,
  getNavigationTranslation,
  getNotFoundTranslation,
} from "./translations";
import type { SupportedLang } from "@ptlabTadej/sitegen-landing-core/types";
import {
  createThemeFontBootstrapScript,
  type ThemeFontSettings,
} from "./font-startup";

type Text = string | Record<string, string> | undefined;
type Resource = { file?: string | null };
export type ContentItem = {
  title?: Text;
  text?: Text;
  description?: Text;
  status?: string;
  image?: Resource;
  images?: Resource[];
};
export type ContentSection = {
  title?: Text;
  sectionName?: Text;
  name?: Text;
  text?: Text;
  items?: ContentItem[];
};
export type SnapshotWebsite = {
  general: {
    primaryLanguage: SupportedLang;
    supportedLanguages: SupportedLang[];
  };
  home: {
    websiteName: Text;
    slogan: Text;
    companyLogo: { text?: string; image?: Resource };
  };
  optionalSections: Record<string, boolean>;
  theme?: { fonts?: ThemeFontSettings };
  contactInfo?: {
    company?: {
      name?: string;
      address?: string;
      postalCode?: string;
      postalOffice?: string;
      country?: string;
    };
    contact?: { type: string; value: string }[];
  };
  [key: string]: unknown;
};
export type SnapshotRoute = {
  path: string;
  file: string;
  page: string;
  slug?: string;
  id?: number;
};
export type SnapshotManifest = {
  schema: 1;
  basePath: string;
  siteOrigin: string;
  primaryLanguage: SupportedLang;
  supportedLanguages: SupportedLang[];
  structure: string;
  routes: SnapshotRoute[];
};
export type PrimaryPageMeta = {
  title: string;
  description: string;
  canonical: string;
  image: string;
  noindex: boolean;
};
export type PrimarySeoSeed = {
  schema: 1;
  basePath: string;
  primaryLanguage: SupportedLang;
  siteName: string;
  organization: Record<string, unknown>;
  fonts: ThemeFontSettings;
  pages: Record<string, PrimaryPageMeta>;
};

export const detailSections = [
  "portfolio",
  "blog",
  "pricing",
  "careers",
  "events",
] as const;
export const sectionOf = (
  site: SnapshotWebsite,
  key: string,
): ContentSection | undefined => site[key] as ContentSection | undefined;
export const localText = (value: Text, primary: string): string =>
  typeof value === "string" ? value : (value?.[primary] ?? "");
export const safeJson = (value: unknown): string =>
  JSON.stringify(value).replace(/</g, "\\u003c");
export const escapeHtml = (value: unknown): string =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
export const normalizedBasePath = (value = ""): string => {
  const path = value.trim().replace(/^\/+|\/+$/g, "");
  if (
    path &&
    (/[?#\\]/.test(path) ||
      path.split("/").some((p) => p === "." || p === ".."))
  ) {
    throw new Error("Invalid deployment basePath");
  }
  return path ? `/${path}` : "";
};
export function normalizeRoute(pathname: string, basePath: string): string {
  let path = pathname.split(/[?#]/, 1)[0] || "/";
  if (basePath && (path === basePath || path.startsWith(`${basePath}/`))) {
    path = path.slice(basePath.length) || "/";
  }
  return `/${path.replace(/^\/+|\/+$/g, "")}/`.replace(/^\/\/$/, "/");
}

export function validateWebsite(site: SnapshotWebsite) {
  if (!site?.general || !site.home || !site.optionalSections)
    throw new Error("Invalid website.json");
  const { primaryLanguage, supportedLanguages } = site.general;
  if (
    !Object.hasOwn(landingPageSlugs, primaryLanguage) ||
    !Array.isArray(supportedLanguages) ||
    supportedLanguages.some((code) => !Object.hasOwn(landingPageSlugs, code))
  ) {
    throw new Error("Unsupported or missing language configuration");
  }
}

/** Build-sensitive fields only. Titles can change without renaming built URLs. */
export function structureOf(site: SnapshotWebsite): string {
  validateWebsite(site);
  return JSON.stringify({
    primaryLanguage: site.general.primaryLanguage,
    languages: [
      ...new Set([
        site.general.primaryLanguage,
        ...site.general.supportedLanguages,
      ]),
    ].sort(),
    optionalSections: Object.fromEntries(
      Object.entries(site.optionalSections).sort(([a], [b]) =>
        a.localeCompare(b),
      ),
    ),
    counts: Object.fromEntries(
      detailSections.map((key) => [
        key,
        sectionOf(site, key)?.items?.length ?? 0,
      ]),
    ),
  });
}

export function makeManifest(
  site: SnapshotWebsite,
  basePath = "",
  siteUrl = "",
): SnapshotManifest {
  validateWebsite(site);
  const base = normalizedBasePath(basePath);
  let siteOrigin = "";
  if (siteUrl.trim()) {
    const url = new URL(siteUrl);
    if (!/^https?:$/.test(url.protocol) || url.search || url.hash)
      throw new Error("SITE_URL must be an HTTP(S) URL");
    const suppliedPath = url.pathname.replace(/\/+$/, "");
    if (suppliedPath && suppliedPath !== base)
      throw new Error("SITE_URL path must match NEXT_PUBLIC_BASE_PATH");
    siteOrigin = url.origin;
  }
  const primaryLanguage = site.general.primaryLanguage;
  const slugs = landingPageSlugs[primaryLanguage];
  const routes: SnapshotRoute[] = [
    { path: "/", file: "index.html", page: "home" },
  ];
  for (const [page, slug] of Object.entries(slugs)) {
    if (
      !["about", "contact", "legal"].includes(page) &&
      !site.optionalSections[page]
    )
      continue;
    routes.push({ path: `/${slug}/`, file: `${slug}/index.html`, page });
    if (!detailSections.includes(page as (typeof detailSections)[number]))
      continue;
    for (const [index, item] of (
      sectionOf(site, page)?.items ?? []
    ).entries()) {
      const itemSlug = `${index + 1}-${slugify(localText(item.title, primaryLanguage))}`;
      routes.push({
        path: `/${slug}/${itemSlug}/`,
        file: `${slug}/${itemSlug}/index.html`,
        page,
        slug: itemSlug,
        id: index + 1,
      });
    }
  }
  routes.push({ path: "/404/", file: "404.html", page: "not-found" });
  return {
    schema: 1,
    basePath: base,
    siteOrigin,
    primaryLanguage,
    supportedLanguages: [
      ...new Set([primaryLanguage, ...site.general.supportedLanguages]),
    ],
    structure: structureOf(site),
    routes,
  };
}

export function assertMetaCompatible(
  site: SnapshotWebsite,
  manifest: SnapshotManifest,
) {
  if (structureOf(site) !== manifest.structure) {
    throw new Error(
      "FULL build required: languages, enabled sections, or detail-page counts changed. No files were changed.",
    );
  }
}

export function makeSeoSeed(
  site: SnapshotWebsite,
  manifest: SnapshotManifest,
): PrimarySeoSeed {
  assertMetaCompatible(site, manifest);
  const primary = manifest.primaryLanguage;
  const text = (value: Text) => localText(value, primary);
  const clean = (value: string) => stripRichText(value).trim();
  const siteName = clean(text(site.home.websiteName));
  const nav = getNavigationTranslation(primary) as unknown as Record<
    string,
    string
  >;
  // Pages with no section and no menu entry: named the way their own h1 names them.
  const ownTitles: Record<string, string> = {
    legal: getLegalTranslation(primary).title,
    "not-found": getNotFoundTranslation(primary).title,
  };
  const absolute = (resource?: string | null): string => {
    if (!resource) return "";
    if (/^https?:\/\//i.test(resource)) return resource;
    if (/^[a-z][a-z\d+.-]*:/i.test(resource) || resource.startsWith("//"))
      return "";
    const path = resource.startsWith("/") ? resource : `/${resource}`;
    const prefixed =
      manifest.basePath &&
      !(path === manifest.basePath || path.startsWith(`${manifest.basePath}/`))
        ? `${manifest.basePath}${path}`
        : path;
    return `${manifest.siteOrigin}${prefixed}`;
  };
  const pages: Record<string, PrimaryPageMeta> = {};
  for (const route of manifest.routes) {
    const section = sectionOf(site, route.page);
    const item = route.id ? section?.items?.[route.id - 1] : undefined;
    let title = siteName;
    let description = clean(text(site.home.slogan));
    if (route.id) {
      title = `${clean(text(item?.title))} | ${siteName}`;
      description = clean(text(item?.description ?? item?.text));
    } else if (route.page !== "home") {
      const label =
        clean(text(section?.sectionName ?? section?.title ?? section?.name)) ||
        nav[route.page] ||
        ownTitles[route.page];
      title = label ? `${label} | ${siteName}` : siteName;
      description = clean(text(section?.text)) || description;
    }
    const noindex = route.page === "not-found" || item?.status === "DISABLED";
    pages[route.path] = {
      title,
      description: truncateWordSafe(description, 160),
      canonical: manifest.siteOrigin
        ? `${manifest.siteOrigin}${manifest.basePath}${route.path}`
        : "",
      image: absolute(
        item?.image?.file ??
          item?.images?.[0]?.file ??
          site.home.companyLogo.image?.file,
      ),
      noindex,
    };
  }
  const contacts = site.contactInfo?.contact ?? [];
  const company = site.contactInfo?.company;
  const email = contacts.find((c) => c.type === "EMAIL")?.value;
  const phone = contacts.find((c) => c.type === "PHONE")?.value;
  const sameAs = contacts
    .filter((c) =>
      [
        "LINKEDIN",
        "INSTAGRAM",
        "FACEBOOK",
        "TWITTER",
        "TIKTOK",
        "WEBSITE",
      ].includes(c.type),
    )
    .map((c) => c.value)
    .filter((url) => /^https?:\/\//i.test(url));
  const logo = absolute(site.home.companyLogo.image?.file);
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    ...(manifest.siteOrigin
      ? { url: `${manifest.siteOrigin}${manifest.basePath}/` }
      : {}),
    ...(logo ? { logo } : {}),
    description: clean(text(site.home.slogan)),
    ...(email ? { email } : {}),
    ...(phone ? { telephone: phone } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    ...(company?.address
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: company.address,
            postalCode: company.postalCode,
            addressLocality: company.postalOffice,
            addressCountry: company.country,
          },
        }
      : {}),
  };
  return {
    schema: 1,
    basePath: manifest.basePath,
    primaryLanguage: primary,
    siteName,
    organization,
    fonts: {
      heading: site.theme?.fonts?.heading ?? null,
      body: site.theme?.fonts?.body ?? null,
      banner: site.theme?.fonts?.banner ?? null,
    },
    pages,
  };
}

export function resolvePageMeta(
  seed: PrimarySeoSeed,
  pathname: string,
): PrimaryPageMeta {
  return (
    seed.pages[normalizeRoute(pathname, seed.basePath)] ??
    seed.pages["/404/"] ??
    seed.pages["/"]
  );
}

/** Same tags as PrimarySeoHead. IDs delimit ONLY metadata owned by this feature. */
export function renderSeoHead(seed: PrimarySeoSeed, pathname: string): string {
  const meta = resolvePageMeta(seed, pathname);
  const attr = escapeHtml;
  const fontBootstrap = createThemeFontBootstrapScript(seed.fonts).replace(
    /<\/script/gi,
    "<\\/script",
  );
  return (
    `<meta id="sitegen-head-start" name="sitegen:head" content="start"/>` +
    `<script id="sitegen-font-bootstrap">${fontBootstrap}</script>` +
    `<script id="sitegen-seo-data" type="application/json">${safeJson(seed)}</script>` +
    `<title id="sitegen-title">${attr(meta.title)}</title>` +
    `<meta id="sitegen-description" name="description" content="${attr(meta.description)}"/>` +
    `<meta id="sitegen-robots" name="robots" content="${meta.noindex ? "noindex,nofollow" : "index,follow"}"/>` +
    (meta.canonical
      ? `<link id="sitegen-canonical" rel="canonical" href="${attr(meta.canonical)}"/>`
      : "") +
    `<meta id="sitegen-og-title" property="og:title" content="${attr(meta.title)}"/>` +
    `<meta id="sitegen-og-description" property="og:description" content="${attr(meta.description)}"/>` +
    `<meta id="sitegen-og-site" property="og:site_name" content="${attr(seed.siteName)}"/>` +
    `<meta id="sitegen-og-type" property="og:type" content="website"/>` +
    (meta.canonical
      ? `<meta id="sitegen-og-url" property="og:url" content="${attr(meta.canonical)}"/>`
      : "") +
    (meta.image
      ? `<meta id="sitegen-og-image" property="og:image" content="${attr(meta.image)}"/>`
      : "") +
    `<script id="sitegen-organization" type="application/ld+json">${safeJson(seed.organization)}</script>` +
    `<meta id="sitegen-head-end" name="sitegen:head" content="end"/>`
  );
}

export function patchExportedHtml(
  html: string,
  snapshot: string,
  seed: PrimarySeoSeed,
  route: SnapshotRoute,
): string {
  const start = "<!--sitegen-primary-html:start-->";
  const end = "<!--sitegen-primary-html:end-->";
  const left = html.indexOf(start);
  const right = html.indexOf(end, left + start.length);
  if (
    left < 0 ||
    right < 0 ||
    html.indexOf(start, left + start.length) !== -1
  ) {
    throw new Error(
      `Missing or duplicate snapshot island in ${route.file}. Run the updated FULL build first.`,
    );
  }
  let output =
    html.slice(0, left + start.length) + snapshot + html.slice(right);
  // React 19 can hoist/reorder metadata. Never assume a contiguous head block.
  if (!/<meta\b[^>]*\bid="sitegen-head-start"/.test(output)) {
    throw new Error(`Missing managed SEO head in ${route.file}`);
  }
  output = output
    .replace(
      /<script\b[^>]*\bid="sitegen-(?:font-bootstrap|seo-data|organization)"[^>]*>[\s\S]*?<\/script>/g,
      "",
    )
    .replace(/<title\b[^>]*\bid="sitegen-title"[^>]*>[\s\S]*?<\/title>/g, "")
    .replace(
      /<(?:meta|link)\b[^>]*\bid="sitegen-(?:head-start|head-end|description|robots|canonical|og-title|og-description|og-site|og-type|og-url|og-image)"[^>]*\/?>/g,
      "",
    );
  if (!output.includes("</head>"))
    throw new Error(`Missing head in ${route.file}`);
  return output.replace(
    "</head>",
    () => `${renderSeoHead(seed, route.path)}</head>`,
  );
}
