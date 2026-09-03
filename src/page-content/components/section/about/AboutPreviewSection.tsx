"use client";

import ImageCarousel from "./ImageCarousel";
import { getAboutItems, getAboutSection } from "@/core/runtime";
import { useLanguage } from "@/core/runtime";
import {
  getAboutTranslation,
  getButtonTranslation,
} from "@/core/translations";
import DualColumnSection from "../common/DualColumnSection";
import EstablishedAndClients from "../common/EstablishedAndClients";
import { getPageSlugByKeyWithBasePath } from "@/core/static";

export default function AboutPreviewSection() {
  const { lang } = useLanguage();
  const aboutTranslation = getAboutTranslation(lang);
  const buttonTranslation = getButtonTranslation(lang);

  const aboutSection = getAboutSection(lang);
  const AboutItems = getAboutItems(lang);

  return (
    <>
      <DualColumnSection
        title={aboutSection.sectionName || aboutTranslation.title}
        description={aboutSection.text}
        callToAction={{
          label: buttonTranslation.learnMore,
          href: getPageSlugByKeyWithBasePath("about"),
        }}
      >
        {/* Same intro with or without photographs — only the carousel is conditional. */}
        {AboutItems.length > 0 && <ImageCarousel items={AboutItems} />}
      </DualColumnSection>

      {/* Year + Happy Clients - full screen width */}
      <EstablishedAndClients />
    </>
  );
}
