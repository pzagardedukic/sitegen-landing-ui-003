"use client";

import { withBasePath } from "@/core/static";
import { Box, Typography } from "@mui/material";
import { memo } from "react";

interface LogoTextProps {
  name: string;
}

/* Hung on the notch exactly as the artwork is — see LogoImage. */
function LogoText({ name }: LogoTextProps) {
  return (
    <Box
      component="a"
      href={withBasePath("/")}
      sx={(theme) => ({
        position: "fixed",
        left: "var(--logo-x, 16px)",
        top: "var(--logo-y, 36px)",
        transform: "translateY(-50%)",
        display: "flex",
        alignItems: "center",
        transition: theme.transitions.create(["top"], {
          duration: theme.transitions.duration.short,
        }),
      })}
    >
      <Typography
        variant="h4"
        sx={(theme) => ({
          letterSpacing: "-0.2px",
          /*
           * Dark on the white notch, white once the bar is a dark slab. Colour rather than
           * the artwork's filter: type can simply be given the right colour, and inheriting
           * the bar's own white left the name invisible against the notch.
           */
          color: "var(--logo-color)",
          transition: theme.transitions.create(["opacity", "color"], {
            duration: theme.transitions.duration.short,
          }),
          "&:hover": { opacity: 0.8 },
        })}
      >
        {name}
      </Typography>
    </Box>
  );
}

export default memo(LogoText);
