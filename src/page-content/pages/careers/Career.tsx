"use client";

import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/section/Section";
import { getCareersItems } from "@/core/runtime";
import { useLanguage } from "@/core/runtime";
import Footer from "@/page-content/components/footer/Footer";
import Header from "@/page-content/components/header/Header";
import CareerItemSection from "@/page-content/components/section/careers/CareerItemSection";
import HeaderSection from "@/page-content/components/section/header/HeaderSection";

export default function CareerPage({ slug }: { slug: string }) {
  const { lang } = useLanguage();

  const careerId = parseInt(slug, 10);
  const career = getCareersItems(lang).find((item) => item.id === careerId);

  if (isNaN(careerId) || !career) {
    return null;
  }

  return (
    <PageLayout header={<Header />} footer={<Footer />}>
      <HeaderSection id="career" title={career.title} />

      <Section id="career-details">
        <CareerItemSection id={career.id} />
      </Section>
    </PageLayout>
  );
}
