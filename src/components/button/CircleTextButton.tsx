"use client";

import { ButtonBase, Typography } from "@mui/material";

type Props = {
  label: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  circleSize?: number | string;
};

/*
 * The round call to action from the Figma CTA band: a filled disc, 190 across on desktop,
 * with the label set inside it over two lines.
 *
 * This shape belongs to the CTA band alone. ui-001 used a ring-outline version of it as the
 * button for every section, which is why the rest of the site kept looking like the old
 * theme — everywhere else the design calls for the pill (see GradientButton).
 */
export default function CircleTextButton({
  label,
  href,
  onClick,
  type = "button",
  disabled = false,
  circleSize,
}: Props) {
  const isLink = Boolean(href);

  return (
    <ButtonBase
      component={isLink ? "a" : "button"}
      {...(isLink ? { href } : { onClick, type })}
      disabled={disabled}
      sx={(theme) => ({
        width: circleSize ?? { xs: 132, sm: 160, md: 190 },
        height: circleSize ?? { xs: 132, sm: 160, md: 190 },
        borderRadius: "50%",
        flexShrink: 0,
        px: 2.5,
        textAlign: "center",
        backgroundImage: theme.palette.brandGradient,
        color: theme.palette.primary.contrastText,
        transition: theme.transitions.create(["filter", "transform"]),
        "&:hover": { filter: "brightness(1.08)", transform: "scale(1.02)" },
        "&.Mui-disabled": { opacity: 0.5, backgroundImage: "none" },
      })}
    >
      <Typography variant="h5" component="span">
        {label}
      </Typography>
    </ButtonBase>
  );
}
