"use client";

import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/section/Section";
import { useLanguage } from "@/core/runtime";
import Footer from "@/page-content/components/footer/Footer";
import Header from "@/page-content/components/header/Header";
import ContactSection from "@/page-content/components/section/contact/ContactSection";
import HeaderSection from "@/page-content/components/section/header/HeaderSection";
import { getContactTranslation } from "@/core/translations";

export default function ContactPage() {
  const { lang } = useLanguage();
  const contactTranslation = getContactTranslation(lang);

  return (
    <PageLayout header={<Header />} footer={<Footer />}>
      <HeaderSection title={contactTranslation.title} />

      <Section id="contact">
        <ContactSection />
      </Section>
    </PageLayout>
  );
}
