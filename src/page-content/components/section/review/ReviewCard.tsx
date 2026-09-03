"use client";

import { Avatar, Box, Typography } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";

type Review = {
  text: string;
  author: string;
  image?: string;
  url?: string;
};

type Props = {
  review: Review;
  minHeight?: number;
};

/*
 * A review card from the Figma frame (373 wide, 26 padding): the avatar and author on one
 * row, the review below it, and the optional source link at the bottom.
 *
 * The frame also has a caption line under the author, but review items carry only a title,
 * text, url and image — there is no role or company to put there.
 */
export default function ReviewCard({ review, minHeight }: Props) {
  const { text, author, image, url } = review;
  const isLink = Boolean(url);

  return (
    <Box
      {...(isLink
        ? { component: "a", href: url, target: "_blank", rel: "noopener noreferrer" }
        : {})}
      sx={(theme) => ({
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: "26px",
        minHeight,
        borderRadius: "25px",
        border: `1px solid ${theme.palette.surfaces.border}`,
        backgroundColor: theme.palette.surfaces.tint,
        textDecoration: "none",
        color: "inherit",
        transition: theme.transitions.create(["border-color", "transform"]),
        ...(isLink && {
          "&:hover": {
            borderColor: theme.palette.primary.main,
            transform: "translateY(-2px)",
          },
        }),
      })}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar src={image} alt="" sx={{ width: 44, height: 44 }} />

        <Typography variant="subtitle1" component="p">
          {author}
        </Typography>
      </Box>

      <Typography variant="body2" sx={{ opacity: 0.75, flex: 1 }}>
        {text}
      </Typography>

      {isLink && (
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
          <Typography variant="subtitle2" component="span" color="primary.main">
            {new URL(url!).hostname.replace(/^www\./, "")}
          </Typography>
          <ArrowOutwardIcon sx={{ fontSize: 15, color: "primary.main" }} />
        </Box>
      )}
    </Box>
  );
}
