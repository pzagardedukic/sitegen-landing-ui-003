"use client";

import { useBannerImage } from "@/app/theme/utils/UseBannerImage";
import CircleTextButton from "@/components/button/CircleTextButton";
import { useLanguage } from "@/core/runtime";
import { getCallToActionTranslation } from "@/core/translations";
import { Box, Typography } from "@mui/material";

type CallToActionProps = {
  href: string;
};

/*
 * The CTA band from the Figma frame (1440x560): the photograph in a card inset 20px with a
 * 25 radius, the headline on the left at the page margin, and the round call to action on
 * the right. Flat black overlay at 60 %, as everywhere else — ui-001 used a three-stop
 * gradient plus a fixed background attachment, which parallaxed on desktop and jittered
 * badly on iOS.
 */
export default function CallToAction({ href }: CallToActionProps) {
  const { lang } = useLanguage();
  const callToActionTranslation = getCallToActionTranslation(lang);

  const resolvedHeaderImage = useBannerImage();

  return (
    <Box sx={{ p: { xs: "12px", sm: "24px", md: "20px" } }}>
      <Box
        sx={(theme) => ({
          position: "relative",
          overflow: "hidden",
          borderRadius: "25px",
          minHeight: { xs: 320, md: 520 },
          display: "flex",
          alignItems: "center",
          backgroundColor: theme.palette.surfaces.placeholder,
          backgroundImage: `url('${resolvedHeaderImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        })}
      >
        <Box
          aria-hidden
          sx={(theme) => ({
            position: "absolute",
            inset: 0,
            backgroundColor: theme.palette.surfaces.scrim,
          })}
        />

        <Box
          sx={{
            position: "relative",
            width: "100%",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: { xs: 4, md: 6 },
            px: { xs: "24px", sm: "40px", md: "80px" },
            py: { xs: 6, md: 0 },
            color: "common.white",
          }}
        >
          <Typography
            variant="h2"
            component="p"
            sx={{
              maxWidth: 640,
              textAlign: { xs: "center", md: "left" },
            }}
          >
            {callToActionTranslation.title}
          </Typography>

          <CircleTextButton
            label={callToActionTranslation.contactButton}
            href={href}
          />
        </Box>
      </Box>
    </Box>
  );
}
