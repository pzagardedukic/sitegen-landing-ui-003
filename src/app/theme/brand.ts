import { alpha, darken, decomposeColor, getLuminance, lighten } from "@mui/material/styles";

/*
 * Everything in this file is derived from the three colors a customer can actually
 * choose: primary, secondary and text.
 *
 * It exists because createPreviewTheme() has an early `if (!hasOverrides) return baseTheme`,
 * which means the theme is built along two different paths. Anything computed from the
 * brand colors has to be computed identically on both, or the site freezes on the
 * defaults while still looking correct locally. Both paths call the functions below,
 * so there is only one definition to keep right.
 */

export type BrandColors = {
  primary: string;
  secondary: string;
  text: string;
};

/** Perceptual-ish distance in 0..1. Good enough to tell "two brand colors" from "the same color twice". */
function colorDistance(a: string, b: string): number {
  try {
    const [ar, ag, ab] = decomposeColor(a).values;
    const [br, bg, bb] = decomposeColor(b).values;

    return (
      Math.sqrt((ar - br) ** 2 + (ag - bg) ** 2 + (ab - bb) ** 2) / (255 * Math.sqrt(3))
    );
  } catch {
    return 1;
  }
}

/**
 * The brand gradient used on CTAs and marquee bands.
 *
 * When a customer picks a primary and secondary that sit close together the gradient
 * would read as a flat block, so the end stop is derived from primary instead. Same
 * when secondary is nearly black or nearly white, which is common — the demo data
 * ships `secondary: "#171714"`, and a purple-to-black band is not a gradient anyone asked for.
 */
export function brandGradient(primary: string, secondary: string, angle = "135deg"): string {
  const distance = colorDistance(primary, secondary);
  const secondaryLuminance = getLuminance(secondary);
  const unusable = distance < 0.18 || secondaryLuminance < 0.02 || secondaryLuminance > 0.92;

  const end = unusable
    ? getLuminance(primary) > 0.4
      ? darken(primary, 0.32)
      : lighten(primary, 0.28)
    : secondary;

  return `linear-gradient(${angle}, ${primary} 0%, ${end} 100%)`;
}

/** Pull a colour towards its own grey. 1 lands on the grey, 0 leaves the colour alone. */
function desaturate(color: string, amount: number): string {
  try {
    const [red, green, blue] = decomposeColor(color).values;
    const grey = 0.299 * red + 0.587 * green + 0.114 * blue;
    const mix = (channel: number) => Math.round(channel + (grey - channel) * amount);

    return `rgb(${mix(red)}, ${mix(green)}, ${mix(blue)})`;
  } catch {
    return color;
  }
}

/**
 * Header chrome. `ui-001` hardcoded this to black and the theme editor could not reach
 * it (see ui-001#3); here it follows the customer. Secondary is used as the base because
 * that is the darker of the two brand colors in practice, and it is forced dark when it
 * is not, so header text stays legible whatever gets picked.
 *
 * Darkening alone kept the hue: a blue secondary gave a navy bar, which read as a second
 * brand colour competing with the logo rather than as chrome. The base is pulled most of
 * the way to its own grey, so the bar is near-neutral but still shifts with the customer's
 * colours instead of being a hardcoded black.
 */
export function headerPalette({ primary, secondary }: BrandColors) {
  const dark = getLuminance(secondary) > 0.16 ? darken(secondary, 0.74) : secondary;
  const base = desaturate(dark, 0.85);

  return {
    background: alpha(base, 0.92),
    /*
     * The same colour with nothing let through. The bar is deliberately translucent over
     * the hero, but the full-screen mobile menu used that value too and the page read
     * straight through it — headings and body copy of the page behind crossed the menu
     * labels.
     */
    solid: base,
    text: alpha("#ffffff", 0.82),
    hoverText: "#ffffff",
    selectedText: "#ffffff",
    hoverBg: alpha(primary, 0.9),
  };
}

/** Footer chrome, kept light and quiet: a wash of the brand rather than a slab of it. */
export function footerPalette({ secondary, text }: BrandColors) {
  const base = getLuminance(secondary) > 0.75 ? darken(secondary, 0.1) : secondary;

  return {
    background: lighten(base, 0.94),
    text: {
      primary: text,
      secondary: alpha(text, 0.62),
    },
  };
}

/** Tints used for section washes, card borders and image scrims. */
export function brandSurfaces({ primary, text }: BrandColors) {
  return {
    tint: alpha(primary, 0.06),
    border: alpha(text, 0.12),
    /** Design system: photographs carry a flat black overlay at 60 %, white copy above it. */
    scrim: alpha("#000000", 0.6),
    /** Neutral stand-in shown where a photograph is missing. */
    placeholder: "#A8A8B0",
  };
}
