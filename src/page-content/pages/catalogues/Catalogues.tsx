"use client";

import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/section/Section";
import { useLanguage } from "@/core/runtime";
import Footer from "@/page-content/components/footer/Footer";
import Header from "@/page-content/components/header/Header";
import CatalogueSection from "@/page-content/components/section/catalogue/CatalogueSection";
import HeaderSection from "@/page-content/components/section/header/HeaderSection";
import { getCataloguesTranslation } from "@/core/translations";

export default function CataloguesPage() {
  const { lang } = useLanguage();
  const cataloguesTranslation = getCataloguesTranslation(lang);

  return (
    <PageLayout header={<Header />} footer={<Footer />}>
      <HeaderSection title={cataloguesTranslation.title} />

      <Section id="catalogues">
        <CatalogueSection />
      </Section>
    </PageLayout>
  );
}
