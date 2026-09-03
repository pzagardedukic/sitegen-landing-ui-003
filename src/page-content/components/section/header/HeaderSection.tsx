"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { useBannerImage } from "@/app/theme/utils/UseBannerImage";
import HeroNotch from "../home/HeroNotch";

export type HeaderSectionProps = {
  title: string;
  /*
   * Anchor for the band, set on the photograph card. ui-001 wrapped this component in a
   * Section carrying the page anchor; here the band draws itself, so the pages that had an
   * anchor of their own pass it through and their fragment links keep working. The outer
   * element keeps `section-header`, which ui-001 also renders on every subpage.
   */
  id?: string;
};

/*
 * The title band that opens every subpage, from the Figma frame (1440x440): the same
 * construction as the hero but shorter — the photograph in a card inset 20px with a 25
 * radius, a flat black overlay at 60 %, the white notch carrying the site logo, and the page
 * title centred inside.
 *
 * It draws its own card rather than sitting inside a Section with a full-bleed background,
 * which is how ui-001 did it. That version ran the photograph edge to edge and butted it
 * against the section below with a hard horizontal seam.
 */
export default function HeaderSection({ title, id }: HeaderSectionProps) {
  const resolvedHeaderImage = useBannerImage();

  return (
    <Box
      component="section"
      id="section-header"
      sx={{ position: "relative", p: { xs: "12px", sm: "24px", md: "20px" } }}
    >
      <Box
        id={id}
        sx={(theme) => ({
          position: "relative",
          overflow: "hidden",
          borderRadius: "25px",
          minHeight: { xs: 240, sm: 320, md: 401 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.palette.surfaces.placeholder,
          backgroundImage: `url("${resolvedHeaderImage}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        })}
      >
        <Box
          aria-hidden
          sx={(theme) => ({
            position: "absolute",
            inset: 0,
            backgroundColor: theme.palette.surfaces.scrim,
            zIndex: 1,
          })}
        />

        <Box
          sx={{
            position: "relative",
            zIndex: 3,
            px: { xs: "24px", sm: "40px", md: "100px" },
            textAlign: "center",
            color: "common.white",
          }}
        >
          <Typography variant="h2" component="h1">
            {title}
          </Typography>
        </Box>
      </Box>

      <HeroNotch />
    </Box>
  );
}
