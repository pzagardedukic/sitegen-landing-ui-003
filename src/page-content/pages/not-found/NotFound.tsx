"use client";

import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/section/Section";
import { useLanguage } from "@/core/runtime";
import Footer from "@/page-content/components/footer/Footer";
import Header from "@/page-content/components/header/Header";
import HeaderSection from "@/page-content/components/section/header/HeaderSection";
import { getNotFoundTranslation } from "@/core/translations";
import NotFoundSection from "@/page-content/components/section/not-found/NotFoundSection";

export default function NotFoundPage() {
  const { lang } = useLanguage();
  const translation = getNotFoundTranslation(lang);

  return (
    <PageLayout header={<Header />} footer={<Footer />}>
      <HeaderSection title={translation.title} />

      <Section id="404">
        <NotFoundSection />
      </Section>
    </PageLayout>
  );
}
