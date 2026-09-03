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

/*
 * The page a customer's colours land on is dark here, and that changes what one of those
 * colours can mean.
 *
 * `theme.colors.text` is picked for a white page — the demo ships `#111111`. Taken at face
 * value on a dark ground it is black on near-black, and every customer's site would be
 * unreadable. So the choice is kept as a hue and the lightness is supplied: `readable()`
 * returns the customer's colour carried up to something that can be read here.
 *
 * A grey choice, which most are, has no hue to keep and simply comes back near-white.
 */
function readable(color: string, target = 0.93): string {
  try {
    const [red, green, blue] = decomposeColor(color).values;
    const maximum = Math.max(red, green, blue);

    if (maximum < 8) return `rgb(238, 238, 240)`;

    const scale = (target * 255) / maximum;
    const lift = (channel: number) => Math.min(255, Math.round(channel * scale));

    /* Hue survives, but only a whisper of it: strong colour as body text is exhausting. */
    const grey = 0.299 * red + 0.587 * green + 0.114 * blue;
    const mixed = (channel: number) => Math.round(channel + (grey - channel) * 0.7);

    return `rgb(${lift(mixed(red))}, ${lift(mixed(green))}, ${lift(mixed(blue))})`;
  } catch {
    return "rgb(238, 238, 240)";
  }
}

/**
 * The page itself: a near-black that still belongs to the customer.
 *
 * Derived from secondary and pulled almost all the way to its own grey, the same way the
 * header bar is, so a blue brand does not turn the whole site navy. It is not pure black —
 * a photograph on pure black reads as a hole, and the cards need somewhere to sit.
 */
function pageBase({ secondary }: BrandColors): string {
  const veryDark = darken(getLuminance(secondary) > 0.02 ? secondary : "#202020", 0.9);
  return desaturate(veryDark, 0.9);
}

/**
 * The ground of the page and the type on it.
 *
 * `paper` is a step above the page rather than a step below, which is the opposite of the
 * light theme: on a dark ground a card has to come towards the reader to read as a card.
 */
export function pageColors(brand: BrandColors) {
  const base = pageBase(brand);
  const readableText = readable(brand.text);

  return {
    background: base,
    paper: lighten(base, 0.07),
    text: readableText,
    textSecondary: alpha(readableText, 0.66),
  };
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
export function headerPalette(brand: BrandColors) {
  const { primary, secondary } = brand;
  const dark = getLuminance(secondary) > 0.16 ? darken(secondary, 0.74) : secondary;
  /*
   * On a dark page the bar cannot be the same near-black as the page behind it, or the
   * scrolled state is invisible: it has to sit slightly above the page, not below it.
   */
  const base = lighten(desaturate(dark, 0.85), 0.06);

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

/**
 * Footer chrome. In the light theme this is a pale wash of the brand; here it is the one
 * band that lifts slightly off the page instead, so the foot of the site still reads as a
 * separate place without a bright slab at the bottom of a dark page.
 */
export function footerPalette(brand: BrandColors) {
  const readableText = readable(brand.text);

  return {
    background: lighten(pageBase(brand), 0.05),
    text: {
      primary: readableText,
      secondary: alpha(readableText, 0.62),
    },
  };
}

/** Tints used for section washes, card borders and image scrims. */
export function brandSurfaces(brand: BrandColors) {
  const readableText = readable(brand.text);

  return {
    /* 0.06 of the brand is invisible on a dark ground; a wash has to be worth seeing. */
    tint: alpha(brand.primary, 0.14),
    /* Same reasoning: a line at 0.12 of near-white disappears, at 0.18 it is a line. */
    border: alpha(readableText, 0.18),
    /*
     * Design system: photographs carry a flat black overlay, white copy above it. On a
     * white page 60 % gave depth; on a dark one an unchanged photograph becomes the
     * brightest thing on the screen and pulls the eye off the words, so it goes deeper.
     */
    scrim: alpha("#000000", 0.72),
    /* Neutral stand-in shown where a photograph is missing — dark, or it flashes. */
    placeholder: "#33363B",
    /*
     * The light plate the logo sits on: the notch cut out of the hero, and the fillets that
     * carry it back into the card edge.
     *
     * It stays light in the dark theme. A customer's logo is artwork of unknown colour and
     * is usually dark, and a light plate is the one background that shows any of them. The
     * light theme has the same value, where it is simply the page colour.
     */
    plate: "#FFFFFF",
    /* What can be read on that plate — the site name when a customer has no logo file. */
    onPlate: "#111111",
  };
}
