"use client";

import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/section/Section";
import { getPortfolioSection } from "@/core/runtime";
import { useLanguage } from "@/core/runtime";
import Footer from "@/page-content/components/footer/Footer";
import Header from "@/page-content/components/header/Header";
import HeaderSection from "@/page-content/components/section/header/HeaderSection";
import PortfolioSection from "@/page-content/components/section/portfolio/PortfolioSection";
import { getPortfolioTranslation } from "@/core/translations";

export default function PortfolioPage() {
  const { lang } = useLanguage();
  const portfolioTranslation = getPortfolioTranslation(lang);
  const portfolioSection = getPortfolioSection(lang);
  if (!portfolioSection) {
    return null;
  }

  return (
    <PageLayout header={<Header />} footer={<Footer />}>
      <HeaderSection
        title={portfolioSection.name || portfolioTranslation.title}
      />

      <Section id="portfolio">
        <PortfolioSection />
      </Section>
    </PageLayout>
  );
}
