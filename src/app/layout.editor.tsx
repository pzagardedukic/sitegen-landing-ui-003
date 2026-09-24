import "./globals.css";
import AppProviders from "./AppProviders";
import { getHomeMeta } from "@/core/static";
import { manrope, sora } from "@/app/theme/fonts";
import PrimarySnapshot from "@/components/seo/PrimarySnapshot";
import PrimarySeoHead from "@/components/seo/PrimarySeoHead";
import { languageBootstrapScript } from "@/core/language-startup";

const homeMeta = getHomeMeta();

/*
 * Same document shell as `layout.default`: the post-build snapshot step runs for this
 * build too and refuses an export whose pages have no snapshot island, so the language
 * bootstrap, the SEO head and the island have to be here as well.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang={homeMeta.primaryLanguage.toLowerCase()}
      suppressHydrationWarning
    >
      <head>
        <script
          id="sitegen-language-bootstrap"
          dangerouslySetInnerHTML={{ __html: languageBootstrapScript }}
        />
        <PrimarySeoHead />
      </head>
      {/*
        Not preloaded in editor mode: the fonts that matter there arrive at runtime
        through loadGoogleFont, driven by whatever the editor sends. These stay only
        as the fallback the page starts from.
      */}
      <body className={`${sora.variable} ${manrope.variable}`}>
        <PrimarySnapshot />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
