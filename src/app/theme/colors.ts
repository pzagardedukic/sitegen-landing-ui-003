import {
  footerPalette,
  headerPalette,
  pageColors,
  type BrandColors,
} from "./brand";

/*
 * Defaults only — the site's theme settings override primary, secondary and text.
 * Everything else on the palette is derived from those three in ./brand.ts, so a
 * customer's colors reach the whole page and not just the buttons.
 *
 * The three defaults are the Figma design-system values. `text` is the colour a customer
 * picks for a white page, and this theme has no white page: see `readable()` in ./brand.ts
 * for what becomes of it here.
 */
export const brandDefaults: BrandColors = {
  primary: "#8258C8",
  secondary: "#2C84C8",
  text: "#111111",
};

const page = pageColors(brandDefaults);

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
    default: page.background,
    paper: page.paper,
  },
  text: {
    primary: page.text,
    secondary: page.textSecondary,
  },
  header: headerPalette(brandDefaults),
  footer: footerPalette(brandDefaults),
};
