"use client";

import { Box, Typography } from "@mui/material";
import { stripRichText, truncateWordSafe } from "@/core/utils";

type BlogPreviewCardProps = {
  href: string;
  image: string;
  title: string;
  text: string;
  author: string;
  date: string;
};

/*
 * A post is a wide row in the Figma frame (1200x256), not a card: the picture 320x220 inset
 * 18 on the left, then the date and author, the title, and one line of the piece.
 *
 * ui-001 stacked them as three tall cards a row. Rows give the title room to be read at a
 * glance, which is what a list of articles is for.
 */
export default function BlogPreviewCard({
  href,
  image,
  title,
  text,
  author,
  date,
}: BlogPreviewCardProps) {
  const truncatedText = stripRichText(truncateWordSafe(text, 180));

  return (
    <Box
      component="a"
      href={href}
      sx={(theme) => ({
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "320px 1fr" },
        gap: { xs: 2, sm: "40px" },
        alignItems: "center",
        p: "18px",
        borderRadius: "25px",
        border: `1px solid ${theme.palette.surfaces.border}`,
        textDecoration: "none",
        color: "inherit",
        transition: theme.transitions.create(["border-color", "background-color"]),
        "&:hover": {
          borderColor: theme.palette.primary.main,
          backgroundColor: theme.palette.surfaces.tint,
        },
        "&:hover img": { transform: "scale(1.04)" },
      })}
    >
      <Box
        sx={(theme) => ({
          height: { xs: 200, sm: 220 },
          borderRadius: "18px",
          overflow: "hidden",
          backgroundColor: theme.palette.surfaces.placeholder,
        })}
      >
        <Box
          component="img"
          src={image}
          alt=""
          loading="lazy"
          sx={(theme) => ({
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: theme.transitions.create("transform"),
          })}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, py: 1 }}>
        <Typography variant="caption" sx={{ opacity: 0.6 }}>
          {date} · {author}
        </Typography>

        <Typography variant="h4" component="h3">
          {title}
        </Typography>

        <Typography variant="body2" sx={{ opacity: 0.72 }}>
          {truncatedText}
        </Typography>
      </Box>
    </Box>
  );
}
