"use client";

import { Box } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { getServicesSection } from "@/core/runtime";
import { useLanguage } from "@/core/runtime";
import { getServicesTranslation } from "@/core/translations";
import DualColumnSection from "../common/DualColumnSection";
import GradientButton from "@/components/button/GradientButton";
import Services from "./Services";
import { getPageSlugByKeyWithBasePath } from "@/core/static";

export default function ServicesSection() {
  const { lang } = useLanguage();
  const servicesTranslation = getServicesTranslation(lang);

  const servicesSection = getServicesSection(lang);
  if (!servicesSection) {
    return null;
  }

  return (
    <DualColumnSection
      title={servicesTranslation.title}
      description={servicesSection.text}
      columns="560fr 80fr 560fr"
    >
      <Services maxCnt={6} />

      {/* The frame centres a single call to action under the grid. */}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <GradientButton
          href={getPageSlugByKeyWithBasePath("services")}
          endIcon={<ArrowOutwardIcon />}
        >
          {servicesTranslation.callToAction}
        </GradientButton>
      </Box>
    </DualColumnSection>
  );
}
