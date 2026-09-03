"use client";

import { Box, Typography } from "@mui/material";
import Marquee from "react-fast-marquee";

type MarqueeBandProps = {
  items: string[];
  speed?: number;
  /** Gradient band for emphasis, or a quiet tinted band. */
  tone?: "brand" | "quiet";
};

/*
 * Full-bleed scrolling band. It has to reach both frame edges — in the wireframes the
 * tablet version was drawn 175 px short of the right edge and read as a broken band, so
 * the width here is driven by the viewport rather than by the content container.
 */
export default function MarqueeBand({
  items,
  speed = 40,
  tone = "brand",
}: MarqueeBandProps) {
  if (items.length === 0) return null;

  return (
    <Box
      sx={(theme) => ({
        width: "100vw",
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
        py: { xs: 2, md: 3 },
        overflow: "hidden",
        ...(tone === "brand"
          ? {
              backgroundImage: theme.palette.brandGradient,
              color: theme.palette.primary.contrastText,
            }
          : {
              backgroundColor: theme.palette.surfaces.tint,
              color: theme.palette.text.primary,
            }),
      })}
    >
      <Marquee speed={speed} gradient={false} autoFill>
        {items.map((item, index) => (
          <Box
            key={`${item}-${index}`}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              pr: 4,
              /* autoFill counts copies from the measured group width; a group that can
               * shrink asks for ever more copies. Same trap as ClientLogoSlider. */
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            <Typography variant="h5" component="span">
              {item}
            </Typography>

            <Box
              aria-hidden
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "currentColor",
                opacity: 0.6,
              }}
            />
          </Box>
        ))}
      </Marquee>
    </Box>
  );
}
