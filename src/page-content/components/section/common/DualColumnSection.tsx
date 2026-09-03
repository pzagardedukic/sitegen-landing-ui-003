"use client";

import { Box, Typography } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import GradientButton from "@/components/button/GradientButton";

type DualColumnSectionProps = {
  title: string;
  children?: React.ReactNode;
  description: string;
  switchSides?: boolean;
  /**
   * Grid split of the intro row. Sections are drawn with different balances — about uses
   * 640/80/480, services 560/80/560 — so the ratio travels with the caller.
   */
  columns?: string;
  callToAction?: {
    label: string;
    href: string;
  };
};

/*
 * The section intro from the Figma frame: a large heading on the left (640 of a 1200 grid)
 * and the description with its call to action on the right (480, starting at 720). Content
 * passed as children — a carousel, a grid — sits full width underneath, not beside them.
 *
 * ui-001 placed children in the right column and centred nothing, which left the heading
 * competing with the media for the same half of the row.
 */
export default function DualColumnSection({
  title,
  children,
  description,
  switchSides = false,
  columns = "640fr 80fr 480fr",
  callToAction,
}: DualColumnSectionProps) {
  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: { xs: 5, md: 8 } }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: columns },
          alignItems: "start",
          gap: { xs: 3, md: 0 },
          ...(switchSides && { direction: "rtl" }),
        }}
      >
        <Typography
          variant="h2"
          component="h2"
          sx={{ gridColumn: { md: "1" }, direction: "ltr" }}
        >
          {title}
        </Typography>

        <Box
          sx={{
            gridColumn: { md: "3" },
            direction: "ltr",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 4,
          }}
        >
          {description && (
            /*
             * Inherit the colour and step it back with opacity rather than pinning
             * text.secondary. A section rendered over a photograph sets white on its
             * container, and a fixed grey turns unreadable there.
             */
            <Typography
              variant="body1"
              sx={{ color: "inherit", opacity: 0.72 }}
            >
              {description}
            </Typography>
          )}

          {callToAction && (
            <GradientButton
              href={callToAction.href}
              endIcon={<ArrowOutwardIcon />}
            >
              {callToAction.label}
            </GradientButton>
          )}
        </Box>
      </Box>

      {children}
    </Box>
  );
}
