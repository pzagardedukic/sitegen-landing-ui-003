"use client";

import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/section/Section";
import { useLanguage } from "@/core/runtime";
import Footer from "@/page-content/components/footer/Footer";
import Header from "@/page-content/components/header/Header";
import FaqSection from "@/page-content/components/section/faq/FaqSection";
import HeaderSection from "@/page-content/components/section/header/HeaderSection";
import { getFaqTranslation } from "@/core/translations";

export default function FaqPage() {
  const { lang } = useLanguage();
  const faqTranslation = getFaqTranslation(lang);

  return (
    <PageLayout header={<Header />} footer={<Footer />}>
      <HeaderSection title={faqTranslation.title} />

      <Section id="faq">
        <FaqSection />
      </Section>
    </PageLayout>
  );
}
