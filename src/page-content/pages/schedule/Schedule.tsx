"use client";

import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/section/Section";
import { getScheduleSection } from "@/core/runtime";
import { useLanguage } from "@/core/runtime";
import Footer from "@/page-content/components/footer/Footer";
import Header from "@/page-content/components/header/Header";
import HeaderSection from "@/page-content/components/section/header/HeaderSection";
import ScheduleSection from "@/page-content/components/section/schedule/ScheduleSection";
import { getScheduleTranslation } from "@/core/translations";

export default function SchedulePage() {
  const { lang } = useLanguage();
  const scheduleSection = getScheduleSection(lang);
  const scheduleTranslation = getScheduleTranslation(lang);

  if (!scheduleSection) {
    return null;
  }

  return (
    <PageLayout header={<Header />} footer={<Footer />}>
      <HeaderSection
        id="schedule"
        title={scheduleSection.title.trim() || scheduleTranslation.title}
      />

      <Section id="schedule-tables">
        <ScheduleSection />
      </Section>
    </PageLayout>
  );
}
