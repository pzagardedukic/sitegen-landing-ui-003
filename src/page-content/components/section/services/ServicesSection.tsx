"use client";

import { getServicesSection } from "@/core/runtime";
import { useLanguage } from "@/core/runtime";
import { getServicesTranslation } from "@/core/translations";
import DualColumnSection from "../common/DualColumnSection";
import Services from "./Services";

/*
 * The services page shows the same card grid as the home-page block, with every item
 * rather than the first six. The Figma has one services treatment, so ui-001's alternating
 * left/right rows (ServiceRow) are gone — keeping two different looks for the same content
 * was what made the page read as a different site from the section that links to it.
 */
export default function ServicesSection() {
  const { lang } = useLanguage();
  const servicesTranslation = getServicesTranslation(lang);
  const servicesSection = getServicesSection(lang);

  return (
    <DualColumnSection
      title={servicesTranslation.title}
      description={servicesSection?.text ?? ""}
      columns="560fr 80fr 560fr"
    >
      <Services />
    </DualColumnSection>
  );
}
