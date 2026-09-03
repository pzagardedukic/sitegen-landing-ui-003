"use client";

import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/section/Section";
import { getPortfolioItems } from "@/core/runtime";
import { useLanguage } from "@/core/runtime";
import Footer from "@/page-content/components/footer/Footer";
import Header from "@/page-content/components/header/Header";
import HeaderSection from "@/page-content/components/section/header/HeaderSection";
import PortfolioItemSection from "@/page-content/components/section/portfolio/PortfolioItemSection";

export default function PortfolioItemPage({ slug }: { slug: string }) {
  const { lang } = useLanguage();

  const portfolioId = parseInt(slug, 10);
  const portfolioItem = getPortfolioItems(lang).find(
    (item) => item.id === portfolioId
  );

  if (isNaN(portfolioId) || !portfolioItem) {
    return null;
  }

  return (
    <PageLayout header={<Header />} footer={<Footer />}>
      <HeaderSection title={portfolioItem.title} />

      <Section id="portfolio-item">
        <PortfolioItemSection id={portfolioItem.id} />
      </Section>
    </PageLayout>
  );
}
