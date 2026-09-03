import { footerPalette, headerPalette, type BrandColors } from "./brand";

/*
 * Defaults only — the site's theme settings override primary, secondary and text.
 * Everything else on the palette is derived from those three in ./brand.ts, so a
 * customer's colors reach the whole page and not just the buttons.
 *
 * The three defaults are the Figma design-system values.
 */
export const brandDefaults: BrandColors = {
  primary: "#8258C8",
  secondary: "#2C84C8",
  text: "#111111",
};

export const colorConfig = {
  primary: {
    main: brandDefaults.primary,
    contrastText: "#ffffff",
  },
  secondary: {
    main: brandDefaults.secondary,
    contrastText: "#ffffff",
  },
  background: {
    default: "#ffffff",
    paper: "#ffffff",
  },
  text: {
    primary: brandDefaults.text,
    secondary: "#5A5A66",
  },
  header: headerPalette(brandDefaults),
  footer: footerPalette(brandDefaults),
};
