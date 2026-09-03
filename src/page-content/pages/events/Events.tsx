"use client";

import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/section/Section";
import { getEventsSection } from "@/core/runtime";
import { useLanguage } from "@/core/runtime";
import Footer from "@/page-content/components/footer/Footer";
import Header from "@/page-content/components/header/Header";
import EventsSection from "@/page-content/components/section/events/EventsSection";
import HeaderSection from "@/page-content/components/section/header/HeaderSection";
import { getEventsTranslation } from "@/core/translations";

export default function EventsPage() {
  const { lang } = useLanguage();
  const eventsSection = getEventsSection(lang);
  const eventsTranslation = getEventsTranslation(lang);

  if (!eventsSection) {
    return null;
  }

  return (
    <PageLayout header={<Header />} footer={<Footer />}>
      <HeaderSection id="events" title={eventsTranslation.title} />

      <Section id="events-list">
        <EventsSection />
      </Section>
    </PageLayout>
  );
}
