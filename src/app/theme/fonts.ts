import { Manrope, Sora } from "next/font/google";

/*
 * Defaults only. The site's theme settings (fonts: heading / body / banner) override
 * these at runtime through createPreviewTheme, and the theme editor overrides them
 * again live. Components must never name a font family directly — always go through
 * a typography variant, or the override has no effect.
 *
 * Weights are limited to 300-700 on purpose: in theme-editor mode fonts are fetched
 * by loadGoogleFont, which requests exactly `wght@300;400;500;600;700`. A heavier
 * cut would silently fall back there while looking correct in the default build.
 */

export const sora = Sora({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sora",
});

export const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-manrope",
});

export const fontConfig = {
  body: manrope,
  heading: sora,
  slogan: manrope,
};
