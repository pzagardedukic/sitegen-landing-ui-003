"use client";

import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/section/Section";
import { getEventItems } from "@/core/runtime";
import { useLanguage } from "@/core/runtime";
import Footer from "@/page-content/components/footer/Footer";
import Header from "@/page-content/components/header/Header";
import EventItemSection from "@/page-content/components/section/events/EventItemSection";
import HeaderSection from "@/page-content/components/section/header/HeaderSection";

export default function EventPage({ slug }: { slug: string }) {
  const { lang } = useLanguage();

  const eventId = parseInt(slug, 10);
  const event = getEventItems(lang).find((item) => item.id === eventId);

  if (isNaN(eventId) || !event) {
    return null;
  }

  return (
    <PageLayout header={<Header />} footer={<Footer />}>
      <HeaderSection id="event" title={event.title} />

      <Section id="event-details">
        <EventItemSection id={event.id} />
      </Section>
    </PageLayout>
  );
}
