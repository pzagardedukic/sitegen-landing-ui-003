"use client";

import ImageCarousel from "./ImageCarousel";
import { getAboutItems, getAboutSection } from "@/core/runtime";
import { useLanguage } from "@/core/runtime";
import { getAboutTranslation } from "@/core/translations";
import DualColumnSection from "../common/DualColumnSection";
import EstablishedAndClients from "../common/EstablishedAndClients";
import { Box } from "@mui/material";

export default function AboutSection() {
  const { lang } = useLanguage();
  const aboutTranslation = getAboutTranslation(lang);

  const aboutSection = getAboutSection(lang);
  const AboutItems = getAboutItems(lang);

  return (
    <Box display="flex" flexDirection="column" gap={{ xs: 6, md: 10 }}>
      <DualColumnSection
        title={aboutTranslation.subtitle}
        description={aboutSection.text}
      >
        {AboutItems.length > 0 && <ImageCarousel items={AboutItems} />}
      </DualColumnSection>

      {/* Year + Happy Clients - full screen width */}
      <EstablishedAndClients />
    </Box>
  );
}
