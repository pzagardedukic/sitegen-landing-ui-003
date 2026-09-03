"use client";

import { Box, Typography } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { useBannerImage } from "@/app/theme/utils/UseBannerImage";
import { getHome } from "@/core/runtime";
import { useLanguage } from "@/core/runtime";
import { getButtonTranslation } from "@/core/translations";
import { getPageSlugByKey } from "@/core/static";
import GradientButton from "@/components/button/GradientButton";
import ScrollLink from "@/components/button/ScrollLink";
import HeroNotch from "./HeroNotch";

/*
 * Hero, laid out from the Figma frame (1440x900):
 *   - the photograph sits in a card inset 20px from the frame edge, radius 25;
 *   - copy is left-aligned on the page's own margin — 120px on desktop, which is 100px
 *     in from the card edge — and sits in the upper third, not centred;
 *   - a white notch in the card's top-left corner carries the site logo;
 *   - the scroll cue is centred at the bottom of the card.
 *
 * The card inset is the only place in the theme that uses one, per the design system.
 */
export default function HomeSection() {
  const resolvedHeaderImage = useBannerImage();

  const { lang } = useLanguage();
  const buttonTranslation = getButtonTranslation(lang);
  const home = getHome(lang);

  /*
   * The hero copy has to start on the same left edge as every section heading below it,
   * and a section is a Container: capped at lg, centred, with a 36/64/64/24 gutter.
   *
   * So the hero content is the same construction, only inside a card that is already inset
   * 12/24/20 from the page edge — the gutter here is that inset taken back off. Fixed
   * padding could not track it: at 1440 the h1 started 24px left of every h2 under it, and
   * the wider the screen the further apart they drifted.
   */
  const innerInset = { xs: "24px", sm: "40px", md: "44px", lg: "24px" };

  return (
    <Box
      id="home"
      sx={{
        position: "relative",
        p: { xs: "12px", sm: "24px", md: "20px" },
        height: "100dvh",
        minHeight: { xs: 560, md: 700 },
      }}
    >
      <Box
        sx={(theme) => ({
          position: "relative",
          height: "100%",
          overflow: "hidden",
          borderRadius: "25px",
          backgroundColor: theme.palette.surfaces.placeholder,
          backgroundImage: `url("${resolvedHeaderImage}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          flexDirection: "column",
        })}
      >
        {/* Design system: a flat black overlay at 60 %, no gradient and no filters. */}
        <Box
          aria-hidden
          sx={(theme) => ({
            position: "absolute",
            inset: 0,
            backgroundColor: theme.palette.surfaces.scrim,
            zIndex: 1,
          })}
        />

        <Box
          sx={{
            position: "relative",
            zIndex: 3,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxWidth: "lg",
            mx: "auto",
            width: "100%",
            px: innerInset,
            color: "common.white",
          }}
        >
          <Box sx={{ maxWidth: 900 }}>
            <Typography variant="h1" component="h1" sx={{ mb: { xs: 3, md: 4 } }}>
              {home.name}
            </Typography>

            {home.slogan && (
              <Typography
                variant="slogan"
                component="p"
                sx={{ maxWidth: 620, mb: { xs: 4, md: 5 }, opacity: 0.92 }}
              >
                {home.slogan}
              </Typography>
            )}

            <GradientButton
              href={`#${getPageSlugByKey("about")}`}
              endIcon={<ArrowOutwardIcon />}
            >
              {buttonTranslation.discoverNow}
            </GradientButton>
          </Box>
        </Box>

        <Box
          sx={{
            position: "absolute",
            zIndex: 3,
            bottom: { xs: 16, md: 24 },
            left: "50%",
            transform: "translateX(-50%)",
            display: { xs: "none", sm: "block" },
          }}
        >
          <ScrollLink
            href={`#${getPageSlugByKey("about")}`}
            textPosition="top"
            color="common.white"
            label={buttonTranslation.scrollDown}
          />
        </Box>
      </Box>

      <HeroNotch />
    </Box>
  );
}
