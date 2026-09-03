import "./globals.css";
import AppProviders from "./AppProviders";
import { getHomeMeta } from "@/core/static";
import { manrope, sora } from "@/app/theme/fonts";
import OrganizationJsonLd from "@/components/seo/OrganizationJsonLd";

const homeMeta = getHomeMeta();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={homeMeta.primaryLanguage}>
      {/*
        The two theme fonts are preloaded here so the first paint already has them.
        They are only the defaults — the site's theme settings and the theme editor
        can replace both, and components pick them up through typography variants,
        never by name.
      */}
      <body className={`${sora.variable} ${manrope.variable}`}>
        <OrganizationJsonLd />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
