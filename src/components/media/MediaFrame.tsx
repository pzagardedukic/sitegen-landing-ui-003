"use client";

import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

type MediaFrameProps = {
  src?: string | null;
  alt?: string;
  /** Aspect ratio as width / height, e.g. 16 / 9. Ignored when `height` is given. */
  ratio?: number;
  height?: number | string;
  /** Flat black overlay at 60 %. On by default — copy is meant to sit over the image. */
  scrim?: boolean;
  /** Sits on the image in a bottom band, never as grey text underneath it. */
  caption?: string | null;
  radius?: number;
  /** Content laid over the image, e.g. a title and a button. */
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
};

/*
 * The single image treatment for the whole theme: cover-cropped photograph, flat black
 * overlay at 60 %, white copy above it, caption in a band at the bottom of the image.
 * Where a photograph is missing, a neutral placeholder takes its place rather than a gap.
 */
export default function MediaFrame({
  src,
  alt = "",
  ratio,
  height,
  scrim = true,
  caption,
  radius = 25,
  children,
  sx,
}: MediaFrameProps) {
  return (
    <Box
      sx={[
        (theme) => ({
          position: "relative",
          overflow: "hidden",
          borderRadius: `${radius}px`,
          backgroundColor: theme.palette.surfaces.placeholder,
          ...(height
            ? { height }
            : { aspectRatio: String(ratio ?? 4 / 3) }),
          width: "100%",
          isolation: "isolate",
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {src && (
        <Box
          component="img"
          src={src}
          alt={alt}
          loading="lazy"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}

      {scrim && (
        <Box
          aria-hidden
          sx={(theme) => ({
            position: "absolute",
            inset: 0,
            backgroundColor: theme.palette.surfaces.scrim,
          })}
        />
      )}

      {children && (
        <Box
          sx={{
            position: "relative",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            color: "common.white",
          }}
        >
          {children}
        </Box>
      )}

      {caption && (
        <Typography
          variant="caption"
          sx={{
            position: "absolute",
            left: { xs: 20, sm: 24, md: 32 },
            right: { xs: 20, sm: 24, md: 32 },
            bottom: { xs: 16, md: 20 },
            color: "common.white",
          }}
        >
          {caption}
        </Typography>
      )}
    </Box>
  );
}
