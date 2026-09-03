"use client";

import { Box, ThemeProvider, createTheme, useTheme } from "@mui/material";
import type { BoxProps } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useMemo } from "react";

type CardSurfaceProps = BoxProps & {
  /** One step brighter, for a card that is being pointed at or is the recommended one. */
  raised?: boolean;
  /*
   * Box is polymorphic at runtime but its types do not follow through a wrapper, so the
   * elements a card actually becomes are named here: a link for a preview card, a form for
   * the contact panel. Listing them beats pretending to be generic and beats .
   */
  component?: React.ElementType;
  href?: string;
  target?: string;
  rel?: string;
};

/*
 * A light card on a dark page — and everything inside it turned round to suit.
 *
 * This is what dark mode means here: the section is dark, the card is light, and the words
 * on the card are dark. Painting the card light is one line; the trouble is the contents.
 * A heading takes `text.primary`, a caption takes `text.secondary`, a divider takes
 * `surfaces.border`, and every one of those is near-white in this theme. Set only the
 * background and the card comes out light with white text on it — worse than before.
 *
 * Overriding them one by one would mean touching every component in every card and would
 * miss the next one somebody writes. So the card carries its own theme instead: the same
 * theme with the handful of colours that mean "on a surface" turned round. Anything placed
 * inside behaves without knowing it is on a light card, including components added later.
 *
 * The brand colours are deliberately left alone. A gradient button and a price in the
 * customer's purple read on white as well as they do on black, and they are the one thing
 * that should look the same wherever it lands.
 */
export default function CardSurface({
  raised = false,
  children,
  sx,
  ...rest
}: CardSurfaceProps) {
  const outer = useTheme();

  const cardTheme = useMemo(() => {
    const ground = raised
      ? outer.palette.surfaces.raised
      : outer.palette.surfaces.card;
    const ink = outer.palette.surfaces.onCard;

    return createTheme(outer, {
      palette: {
        background: { default: ground, paper: ground },
        text: { primary: ink, secondary: alpha(ink, 0.66) },
        divider: alpha(ink, 0.14),
        surfaces: {
          ...outer.palette.surfaces,
          /* Inside a light card, "the surface" is the card and "raised" is white. */
          card: ground,
          raised: "#ffffff",
          border: alpha(ink, 0.16),
          tint: alpha(outer.palette.primary.main, 0.08),
        },
      },
    });
  }, [outer, raised]);

  return (
    <ThemeProvider theme={cardTheme}>
      <Box
        sx={[
          {
            backgroundColor: cardTheme.palette.background.paper,
            color: cardTheme.palette.text.primary,
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...rest}
      >
        {children}
      </Box>
    </ThemeProvider>
  );
}
