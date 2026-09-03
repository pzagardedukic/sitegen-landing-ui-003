"use client";

import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

type TagTone = "brand" | "neutral" | "outline";

type TagProps = {
  label: string;
  tone?: TagTone;
  sx?: SxProps<Theme>;
};

/*
 * Small badges: "recommended", availability status, category labels. Every tone resolves
 * through the palette so a customer's colors reach them and a dark variant later needs
 * no change here.
 */
export default function Tag({ label, tone = "neutral", sx }: TagProps) {
  return (
    <Box
      sx={[
        (theme) => ({
          display: "inline-flex",
          alignItems: "center",
          borderRadius: 999,
          px: 1.5,
          py: 0.75,
          ...(tone === "brand" && {
            backgroundImage: theme.palette.brandGradient,
            color: theme.palette.primary.contrastText,
          }),
          ...(tone === "neutral" && {
            backgroundColor: theme.palette.surfaces.tint,
            color: theme.palette.text.primary,
          }),
          ...(tone === "outline" && {
            border: `1px solid ${theme.palette.surfaces.border}`,
            color: theme.palette.text.secondary,
          }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Typography variant="caption" sx={{ fontWeight: 500, lineHeight: 1 }}>
        {label}
      </Typography>
    </Box>
  );
}
