"use client";

import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { Box } from "@mui/material";
import { getExperienceItems } from "@/core/runtime";

/*
 * Certifications as four tiles across the 1200 grid, 277 wide and 190 tall with a 30 gutter.
 * Each is the awarding body's mark on a quiet tinted card; where the item carries a link, a
 * small icon sits in the top-right corner.
 */
export default function ExperienceItems() {
  const items = getExperienceItems();

  if (items.length === 0) return null;

  return (
    <Box
      sx={{
        display: "grid",
        gap: "30px",
        gridTemplateColumns: {
          xs: "repeat(2, 1fr)",
          md: "repeat(4, 1fr)",
        },
      }}
    >
      {items.map((item, index) => {
        const isLink = Boolean(item.url);

        return (
          <Box
            key={index}
            {...(isLink
              ? {
                  component: "a",
                  href: item.url,
                  target: "_blank",
                  rel: "noopener noreferrer",
                }
              : {})}
            sx={(theme) => ({
              position: "relative",
              height: { xs: 140, md: 190 },
              borderRadius: "25px",
              border: `1px solid ${theme.palette.surfaces.border}`,
              backgroundColor: theme.palette.surfaces.tint,
              display: "grid",
              placeItems: "center",
              p: 3,
              textDecoration: "none",
              transition: theme.transitions.create(["border-color"]),
              ...(isLink && {
                "&:hover": { borderColor: theme.palette.primary.main },
              }),
            })}
          >
            <Box
              component="img"
              src={item.image}
              alt=""
              loading="lazy"
              sx={{ maxWidth: "80%", maxHeight: "60%", objectFit: "contain" }}
            />

            {isLink && (
              <ArrowOutwardIcon
                sx={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  fontSize: 16,
                  color: "primary.main",
                }}
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
}
