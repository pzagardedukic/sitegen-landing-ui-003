"use client";

import { Button, type ButtonProps } from "@mui/material";
import type { ElementType } from "react";

/*
 * The brand gradient is reserved for calls to action and marquee bands — never as a card
 * background, except in the no-image fallback. The gradient itself comes from the palette,
 * so it follows the customer's primary and secondary rather than being written in here.
 *
 * Typed through on `component` so a download or an external link can be this button without
 * a second hand-styled copy of the gradient: `component="a"` then accepts href and target.
 */
export default function GradientButton<C extends ElementType = "button">({
  sx,
  ...props
}: ButtonProps<C, { component?: C }>) {
  return (
    <Button
      disableElevation
      {...props}
      sx={[
        (theme) => ({
          backgroundImage: theme.palette.brandGradient,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          borderRadius: 999,
          px: { xs: 3, md: 4 },
          py: { xs: 1.25, md: 1.5 },
          "&:hover": {
            backgroundImage: theme.palette.brandGradient,
            filter: "brightness(1.08)",
          },
          "&.Mui-disabled": {
            backgroundImage: "none",
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
}
