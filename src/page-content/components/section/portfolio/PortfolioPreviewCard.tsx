"use client";

import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { Box, Typography } from "@mui/material";
import Tag from "@/components/common/Tag";
import { stripRichText, truncateWordSafe } from "@/core/utils";

type PortfolioPreviewCardProps = {
  image: string;
  title: string;
  text: string;
  href: string;
  category?: string;
  client?: string;
  openLabel: string;
};

/*
 * A project card from the Figma frame (373x420): the photograph with a scrim at the top so
 * the category badge and client line stay readable, and a second scrim at the bottom under
 * the title.
 *
 * The frame draws two states. At rest only the title shows; the active card also reveals the
 * description and an open link, and its bottom scrim grows from 170 to 250 to carry them.
 * That is a hover state on a pointer device — on touch there is nothing to hover, so the
 * expanded state is simply the default below the desktop breakpoint.
 */
export default function PortfolioPreviewCard({
  image,
  title,
  text,
  href,
  category,
  client,
  openLabel,
}: PortfolioPreviewCardProps) {
  const truncated = stripRichText(truncateWordSafe(text, 90));

  return (
    <Box
      component="a"
      href={href}
      sx={(theme) => ({
        position: "relative",
        display: "block",
        height: { xs: 380, md: 420 },
        borderRadius: "25px",
        overflow: "hidden",
        textDecoration: "none",
        color: theme.palette.common.white,
        backgroundColor: theme.palette.surfaces.placeholder,

        "&:hover .card-img": { transform: "scale(1.04)" },
        [theme.breakpoints.up("md")]: {
          "& .card-reveal": {
            opacity: 0,
            maxHeight: 0,
            transform: "translateY(6px)",
            transition: theme.transitions.create([
              "opacity",
              "max-height",
              "transform",
            ]),
          },
          "&:hover .card-reveal, &:focus-visible .card-reveal": {
            opacity: 1,
            maxHeight: 120,
            transform: "none",
          },
        },
      })}
    >
      <Box
        component="img"
        src={image}
        alt=""
        loading="lazy"
        className="card-img"
        sx={(theme) => ({
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: theme.transitions.create("transform"),
        })}
      />

      {/* Top scrim — carries the category badge and the client line. */}
      <Box
        aria-hidden
        sx={(theme) => ({
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 130,
          background: `linear-gradient(to bottom, ${theme.palette.surfaces.scrim}, transparent)`,
        })}
      />

      {/* Bottom scrim — carries the title and, when revealed, the rest. */}
      <Box
        aria-hidden
        sx={(theme) => ({
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "62%",
          background: `linear-gradient(to top, ${theme.palette.surfaces.scrim}, transparent)`,
        })}
      />

      <Box
        sx={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          p: "24px",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, alignItems: "flex-start" }}>
          {category && <Tag label={category} tone="brand" />}

          {client && (
            <Typography variant="caption" sx={{ opacity: 0.85 }}>
              {client}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="h4" component="h3">
            {title}
          </Typography>

          <Box className="card-reveal" sx={{ overflow: "hidden" }}>
            {truncated && (
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 1.5 }}>
                {truncated}
              </Typography>
            )}

            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
              }}
            >
              <Typography variant="subtitle2" component="span">
                {openLabel}
              </Typography>
              <ArrowOutwardIcon sx={{ fontSize: 16 }} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
