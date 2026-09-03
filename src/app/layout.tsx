import type { Metadata } from "next";
import { getHomeMeta } from "@/core/static";
import { SITE_URL } from "@/core/seo";

const RootLayout =
  process.env.NEXT_PUBLIC_THEME_EDITOR_ENABLED === "true"
    ? require("./layout.editor").default
    : require("./layout.default").default;

const homeMeta = getHomeMeta();

export const metadata: Metadata = {
  ...(SITE_URL
    ? { metadataBase: new URL(SITE_URL), alternates: { canonical: "/" } }
    : {}),
  title: {
    default: homeMeta.name,
    template: `%s | ${homeMeta.name}`,
  },
  description: homeMeta.slogan || undefined,
  openGraph: {
    title: homeMeta.name,
    description: homeMeta.slogan || undefined,
    siteName: homeMeta.name,
    ...(SITE_URL ? { url: "/" } : {}),
    type: "website",
  },
};

export default RootLayout;
