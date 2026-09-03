"use client";

import { Box } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { getPortfolioSection } from "@/core/runtime";
import { useLanguage } from "@/core/runtime";
import { getPortfolioTranslation } from "@/core/translations";
import DualColumnSection from "../common/DualColumnSection";
import GradientButton from "@/components/button/GradientButton";
import Portfolio from "./Portfolio";
import { useIsMobileDevice } from "@/hooks/useIsMobileDevice";
import { getPageSlugByKeyWithBasePath } from "@/core/static";

export default function PortfolioPreviewSection() {
  const isMobile = useIsMobileDevice();
  const { lang } = useLanguage();
  const portfolioTranslation = getPortfolioTranslation(lang);

  const portfolioSection = getPortfolioSection(lang);
  if (!portfolioSection) {
    return null;
  }

  return (
    <DualColumnSection
      title={portfolioSection.name || portfolioTranslation.title}
      description={portfolioSection.text}
    >
      <Portfolio maxCnt={isMobile ? 3 : 6} />

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <GradientButton
          href={getPageSlugByKeyWithBasePath("portfolio")}
          endIcon={<ArrowOutwardIcon />}
        >
          {portfolioTranslation.callToAction}
        </GradientButton>
      </Box>
    </DualColumnSection>
  );
}
