"use client";

import FooterSocials from "@/components/button/FooterSocials";
import ScrollLink from "@/components/button/ScrollLink";
import { BUILD_YEAR } from "@/core/runtime";
import { useLanguage } from "@/core/runtime";
import {
  getButtonTranslation,
  getFooterTranslation,
} from "@/core/translations";
import { Box, Link, Stack, Typography } from "@mui/material";

export default function Footer() {
  const { lang } = useLanguage();
  const footerTranslation = getFooterTranslation(lang);
  const buttonTranslation = getButtonTranslation(lang);

  return (
    <Stack spacing={4} alignItems="center" textAlign="center">
      {/*
        Back to top sits in the flow rather than floating above the footer edge. The old
        absolute placement depended on a fixed 300px footer height and drifted the moment
        the content changed.
      */}
      <ScrollLink
        href="#main"
        textPosition="bottom"
        color="footer.text.secondary"
        label={buttonTranslation.backToTop}
      />

      <Box
        aria-hidden
        sx={(theme) => ({
          width: 64,
          height: 2,
          borderRadius: 999,
          backgroundImage: theme.palette.brandGradient,
        })}
      />

      <FooterSocials
        color="footer.text.secondary"
        size={28}
        gap={1.5}
        direction="row"
      />

      <Stack spacing={0.5} alignItems="center">
        <Typography
          component={Link}
          href="https://onas.si"
          target="_blank"
          rel="noopener noreferrer"
          variant="body2"
          color="footer.text.primary"
          underline="hover"
        >
          &copy; {footerTranslation.production} {BUILD_YEAR}.
        </Typography>

        <Typography variant="caption" color="footer.text.secondary">
          {footerTranslation.slogan}
        </Typography>
      </Stack>
    </Stack>
  );
}
