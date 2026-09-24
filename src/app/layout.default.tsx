import "./globals.css";
import AppProviders from "./AppProviders";
import { getHomeMeta } from "@/core/static";
import { manrope, sora } from "@/app/theme/fonts";
import PrimarySnapshot from "@/components/seo/PrimarySnapshot";
import PrimarySeoHead from "@/components/seo/PrimarySeoHead";
import { languageBootstrapScript } from "@/core/language-startup";

const homeMeta = getHomeMeta();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /*
     * The language code is lower-cased: `SL` is what the data calls it, `sl` is what the
     * document attribute wants, and the export check asserts the latter.
     *
     * `suppressHydrationWarning` belongs here because the language bootstrap below marks the
     * root element before React runs, so the server and client markup differ by design.
     */
    <html
      lang={homeMeta.primaryLanguage.toLowerCase()}
      suppressHydrationWarning
    >
      <head>
        {/*
          Runs before first paint: applies a saved language preference, so a visitor who
          chose a second language does not see the primary one flash first.
        */}
        <script
          id="sitegen-language-bootstrap"
          dangerouslySetInnerHTML={{ __html: languageBootstrapScript }}
        />
        <PrimarySeoHead />
      </head>
      {/*
        The two theme fonts are preloaded here so the first paint already has them.
        They are only the defaults — the site's theme settings and the theme editor
        can replace both, and components pick them up through typography variants,
        never by name.
      */}
      <body className={`${sora.variable} ${manrope.variable}`}>
        {/*
          The primary-language snapshot island. The post-build renderer fills it with real
          markup so a reader without JavaScript — a search engine, a link preview — gets the
          page content; it removes itself once the app signals that content is ready.
        */}
        <PrimarySnapshot />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
