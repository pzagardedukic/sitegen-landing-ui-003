"use client";

import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/section/Section";
import { getPricingSection } from "@/core/runtime";
import { useLanguage } from "@/core/runtime";
import Footer from "@/page-content/components/footer/Footer";
import Header from "@/page-content/components/header/Header";
import HeaderSection from "@/page-content/components/section/header/HeaderSection";
import PricingSection from "@/page-content/components/section/pricing/PricingSection";
import {
  getPricingTranslation_priceListWithImages,
  getPricingTranslation_priceListNoImages,
  getPricingTranslation_packagesNoImages,
} from "@/core/translations";

export default function PricingPage() {
  const { lang } = useLanguage();
  const pricingSection = getPricingSection(lang);
  if (!pricingSection) {
    return null;
  }

  const pricingTranslation_priceListWithImages =
    getPricingTranslation_priceListWithImages(lang);
  const pricingTranslation_priceListNoImages =
    getPricingTranslation_priceListNoImages(lang);
  const pricingTranslation_packagesNoImages =
    getPricingTranslation_packagesNoImages(lang);

  let title = pricingSection.sectionName?.trim();
  if (!title) {
    switch (pricingSection.type) {
      case "PRICING_STORE":
        title = pricingTranslation_priceListWithImages.title;
        break;
      case "PRICING_LIST":
        title = pricingTranslation_priceListNoImages.title;
        break;
      case "PRICING_PACKAGES":
        title = pricingTranslation_packagesNoImages.title;
        break;
      default:
        title = "Pricing";
    }
  }

  return (
    <PageLayout header={<Header />} footer={<Footer />}>
      <HeaderSection title={title} />

      <Section id="pricing">
        <PricingSection />
      </Section>
    </PageLayout>
  );
}
