"use client";

import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/section/Section";
import { useLanguage } from "@/core/runtime";
import Footer from "@/page-content/components/footer/Footer";
import Header from "@/page-content/components/header/Header";
import CareersSection from "@/page-content/components/section/careers/CareersSections";
import HeaderSection from "@/page-content/components/section/header/HeaderSection";
import { getCareersTranslation } from "@/core/translations";

export default function CareersPage() {
  const { lang } = useLanguage();
  const careersTranslation = getCareersTranslation(lang);

  return (
    <PageLayout header={<Header />} footer={<Footer />}>
      <HeaderSection title={careersTranslation.title} />

      <Section id="careers">
        <CareersSection />
      </Section>
    </PageLayout>
  );
}
