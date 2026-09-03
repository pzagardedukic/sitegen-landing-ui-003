"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBackRounded";
import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

type BackButtonProps = {
  label: string;
  onClick: () => void;
  sx?: SxProps<Theme>;
};

/*
 * The pill that returns from a detail page to its list — project, post, price item, job,
 * event. Every detail page in the Figma frames draws the same one, so it lives here once:
 * five hand-copied versions drift the moment the border or the radius changes.
 *
 * A plain button element rather than MUI's, because the outlined variant carries a hover
 * fill that the design does not have; only the border reacts.
 */
export default function BackButton({ label, onClick, sx }: BackButtonProps) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={[
        (theme) => ({
          alignSelf: "flex-start",
          display: "inline-flex",
          alignItems: "center",
          gap: 1,
          px: 2.5,
          py: 1.5,
          borderRadius: 999,
          border: `1px solid ${theme.palette.surfaces.border}`,
          background: "none",
          cursor: "pointer",
          color: "inherit",
          transition: theme.transitions.create(["border-color"]),
          "&:hover": { borderColor: theme.palette.primary.main },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <ArrowBackIcon sx={{ fontSize: 18 }} />
      <Typography variant="button" component="span">
        {label}
      </Typography>
    </Box>
  );
}
