import { createTheme, ThemeOptions } from "@mui/material/styles";
import { fontConfig } from "@/app/theme/fonts";
import { brandDefaults, colorConfig } from "@/app/theme/colors";
import { brandGradient, brandSurfaces } from "@/app/theme/brand";

declare module "@mui/material/styles" {
  interface Palette {
    header: {
      background: string;
      solid: string;
      text: string;
      hoverText: string;
      selectedText: string;
      hoverBg: string;
    };
    footer: {
      background: string;
      text: {
        primary: string;
        secondary: string;
      };
    };
    /** CSS gradient built from primary -> secondary. Reserved for CTAs and marquee bands. */
    brandGradient: string;
    surfaces: {
      tint: string;
      border: string;
      scrim: string;
      placeholder: string;
    };
  }

  interface PaletteOptions {
    header?: {
      background?: string;
      solid?: string;
      text?: string;
      hoverText?: string;
      selectedText?: string;
      hoverBg?: string;
    };
    footer?: {
      background?: string;
      text?: {
        primary?: string;
        secondary?: string;
      };
    };
    brandGradient?: string;
    surfaces?: {
      tint?: string;
      border?: string;
      scrim?: string;
      placeholder?: string;
    };
  }

  interface TypographyVariants {
    navLink: React.CSSProperties;
    slogan: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    navLink?: React.CSSProperties;
    slogan?: React.CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    slogan: true;
  }
}

const bodyFont = fontConfig.body.style.fontFamily;
const headingFont = fontConfig.heading.style.fontFamily;
const sloganFont = fontConfig.slogan.style.fontFamily;

/*
 * Type scale from the Figma design system, read at the three drawn widths:
 * mobile 390 (xs), tablet 768 (sm), desktop 1440 (md and up).
 * Breakpoints are MUI defaults and deliberately not moved.
 */
const themeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    primary: colorConfig.primary,
    secondary: colorConfig.secondary,
    background: colorConfig.background,
    text: colorConfig.text,
    header: colorConfig.header,
    footer: colorConfig.footer,
    brandGradient: brandGradient(brandDefaults.primary, brandDefaults.secondary),
    surfaces: brandSurfaces(brandDefaults),
  },

  typography: {
    fontFamily: bodyFont,

    // Hero headline — 80/90 on desktop
    h1: {
      fontFamily: headingFont,
      fontWeight: 400,
      fontSize: "40px",
      lineHeight: 1.15,
      letterSpacing: "-0.5px",
      "@media (min-width:600px)": { fontSize: "56px" },
      "@media (min-width:900px)": { fontSize: "80px", lineHeight: 1.125 },
    },

    // Page headline — 60 on desktop
    h2: {
      fontFamily: headingFont,
      fontWeight: 400,
      fontSize: "32px",
      lineHeight: 1.2,
      letterSpacing: "-0.4px",
      "@media (min-width:600px)": { fontSize: "44px" },
      "@media (min-width:900px)": { fontSize: "60px" },
    },

    // Section title — 44 on desktop
    h3: {
      fontFamily: headingFont,
      fontWeight: 400,
      fontSize: "28px",
      lineHeight: 1.25,
      letterSpacing: "-0.3px",
      "@media (min-width:600px)": { fontSize: "34px" },
      "@media (min-width:900px)": { fontSize: "44px" },
    },

    // Card title — 20-24
    h4: {
      fontFamily: headingFont,
      fontWeight: 400,
      fontSize: "20px",
      lineHeight: 1.35,
      "@media (min-width:600px)": { fontSize: "22px" },
      "@media (min-width:900px)": { fontSize: "24px" },
    },

    h5: {
      fontFamily: headingFont,
      fontWeight: 400,
      fontSize: "18px",
      lineHeight: 1.4,
      "@media (min-width:900px)": { fontSize: "20px" },
    },

    h6: {
      fontFamily: headingFont,
      fontWeight: 500,
      fontSize: "16px",
      lineHeight: 1.4,
      "@media (min-width:900px)": { fontSize: "18px" },
    },

    // Body — 16 at 180%
    body1: {
      fontFamily: bodyFont,
      fontWeight: 400,
      fontSize: "16px",
      lineHeight: 1.8,
    },

    body2: {
      fontFamily: bodyFont,
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: 1.7,
    },

    button: {
      fontFamily: bodyFont,
      fontWeight: 500,
      fontSize: "14px",
      letterSpacing: "0.2px",
      textTransform: "none",
    },

    subtitle1: {
      fontFamily: bodyFont,
      fontWeight: 500,
      fontSize: "16px",
      lineHeight: 1.6,
    },

    subtitle2: {
      fontFamily: bodyFont,
      fontWeight: 500,
      fontSize: "14px",
      lineHeight: 1.6,
    },

    // Captions — 14
    caption: {
      fontFamily: bodyFont,
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: 1.5,
    },

    overline: {
      fontFamily: bodyFont,
      fontWeight: 500,
      fontSize: "12px",
      letterSpacing: "1.2px",
      textTransform: "uppercase",
    },

    // Navigation — bold 14
    navLink: {
      fontFamily: bodyFont,
      fontWeight: 700,
      fontSize: "14px",
      lineHeight: 1.4,
    },

    // Slogan — 16/30
    slogan: {
      fontFamily: sloganFont,
      fontWeight: 400,
      fontSize: "16px",
      lineHeight: 1.875,
    },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    /*
     * Content margins from the design system: 36 mobile, 64 tablet, 120 desktop.
     * At 1440 the lg container caps content at 1200, which leaves exactly 120 a side,
     * so the desktop margin comes from maxWidth rather than from padding.
     */
    MuiContainer: {
      styleOverrides: {
        root: ({ theme }) => ({
          paddingLeft: 36,
          paddingRight: 36,
          [theme.breakpoints.up("sm")]: {
            paddingLeft: 64,
            paddingRight: 64,
          },
          [theme.breakpoints.up("lg")]: {
            paddingLeft: 24,
            paddingRight: 24,
          },
        }),
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          boxShadow: "none",
        },
      },
    },

    MuiCssBaseline: {
      styleOverrides: {
        "html, body": {
          overflowX: "hidden",
        },
      },
    },
  },
};

const theme = createTheme(themeOptions);

export default theme;
