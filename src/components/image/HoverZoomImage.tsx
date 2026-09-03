"use client";

import React, { forwardRef } from "react";
import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { FALLBACK_IMAGE } from "@/core/static";

export interface HoverZoomImageProps {
  src: string | undefined;
  fallbackSrc?: string;
  alt?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement | HTMLImageElement>;
  width?: number | string;
  sx?: SxProps<Theme>;
  imgSx?: SxProps<Theme>;
  loading?: "lazy" | "eager";
  zoomOnParentHover?: boolean;
  className?: string;
}

const HoverZoomImage = forwardRef<HTMLImageElement, HoverZoomImageProps>(
  (
    {
      src,
      fallbackSrc = FALLBACK_IMAGE,
      alt,
      onClick,
      width = 300,
      sx,
      imgSx,
      loading = "lazy",
      zoomOnParentHover = false,
      className = "hover-zoom-image",
    },
    ref
  ) => {
    return (
      <Box
        onClick={onClick}
        className={className}
        sx={{
          width,
          overflow: "hidden",
          cursor: "pointer",
          display: "inline-block",
          position: "relative",

          "& img": {
            width: "100%",
            height: "100%",
            objectFit: "cover", // ensures cropping on zoom
            transition: "transform 0.3s ease, opacity 0.3s ease",
          },

          ...(zoomOnParentHover
            ? {
                ".zoom-image-parent:hover & img": {
                  transform: "scale(1.1)",
                },
              }
            : {
                "&:hover img": {
                  transform: "scale(1.1)",
                },
              }),

          ...sx,
        }}
      >
        <Box
          component="img"
          ref={ref}
          src={src || fallbackSrc}
          alt={alt}
          loading={loading}
          sx={imgSx}
          onError={(e: { currentTarget: { src: string } }) => {
            e.currentTarget.src = fallbackSrc;
          }}
        />
      </Box>
    );
  }
);

HoverZoomImage.displayName = "HoverZoomImage";

export default HoverZoomImage;
