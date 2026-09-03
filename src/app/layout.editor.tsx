import "./globals.css";
import AppProviders from "./AppProviders";
import { getHomeMeta } from "@/core/static";
import { manrope, sora } from "@/app/theme/fonts";

const homeMeta = getHomeMeta();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={homeMeta.primaryLanguage}>
      {/*
        Not preloaded in editor mode: the fonts that matter there arrive at runtime
        through loadGoogleFont, driven by whatever the editor sends. These stay only
        as the fallback the page starts from.
      */}
      <body className={`${sora.variable} ${manrope.variable}`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
