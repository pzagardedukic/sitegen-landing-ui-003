"use client";

import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/section/Section";
import { useLanguage } from "@/core/runtime";
import Footer from "@/page-content/components/footer/Footer";
import Header from "@/page-content/components/header/Header";
import HeaderSection from "@/page-content/components/section/header/HeaderSection";
import LegalSection from "@/page-content/components/section/legal/LegalSection";
import { getLegalTranslation } from "@/core/translations";

export default function LegalPage() {
  const { lang } = useLanguage();
  const legalTranslation = getLegalTranslation(lang);

  return (
    <PageLayout header={<Header />} footer={<Footer />}>
      <HeaderSection id="legal" title={legalTranslation.title} />

      <Section id="legal-documents">
        <LegalSection />
      </Section>
    </PageLayout>
  );
}
