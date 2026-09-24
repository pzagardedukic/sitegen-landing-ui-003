"use client";

import { Box, Typography } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { useLanguage } from "@/core/runtime";
import { getNotFoundTranslation } from "@/core/translations";
import GradientButton from "@/components/button/GradientButton";
import { withBasePath } from "@/core/static";

/*
 * Figma frame 1440x760: a 130 icon, the headline, one line of explanation and the button,
 * all centred in a 700-wide column.
 */
export default function NotFoundSection() {
  const { lang } = useLanguage();
  const translation = getNotFoundTranslation(lang);

  return (
    <Box
      sx={{
        maxWidth: 700,
        mx: "auto",
        py: { xs: 6, md: 10 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: { xs: 3, md: 4 },
      }}
    >
      <Box
        sx={(theme) => ({
          width: { xs: 96, md: 130 },
          height: { xs: 96, md: 130 },
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          border: `1px solid ${theme.palette.surfaces.border}`,
          color: theme.palette.primary.main,
        })}
      >
        <SearchOffIcon sx={{ fontSize: { xs: 44, md: 60 } }} />
      </Box>

      {/*
        The title band above is this page's h1 and carries the same words. This repeat
        is a visual echo, not a second page title, so it stays a level below.
      */}
      <Typography variant="h2" component="h2">
        {translation.title}
      </Typography>

      <Typography variant="body1" sx={{ opacity: 0.72 }}>
        {translation.text}
      </Typography>

      <GradientButton href={withBasePath("/")} endIcon={<ArrowOutwardIcon />}>
        {translation.backToHome}
      </GradientButton>
    </Box>
  );
}
