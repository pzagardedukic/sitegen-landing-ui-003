"use client";

import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/section/Section";
import { getAboutSection } from "@/core/runtime";
import Footer from "@/page-content/components/footer/Footer";
import Header from "@/page-content/components/header/Header";
import AboutSection from "@/page-content/components/section/about/AboutSection";
import HeaderSection from "@/page-content/components/section/header/HeaderSection";
import TeamSection from "@/page-content/components/section/team/TeamSection";
import WhyUsSection from "@/page-content/components/section/why-us/WhyUsSection";
import ClientsSection from "@/page-content/components/section/clients/ClientsSection";
import { useLanguage } from "@/core/runtime";
import { getAboutTranslation } from "@/core/translations";
import { isSectionEnabled } from "@/core/static";

export default function AboutPage() {
  const { lang } = useLanguage();
  const aboutTranslation = getAboutTranslation(lang);

  const aboutSection = getAboutSection(lang);

  return (
    <PageLayout header={<Header />} footer={<Footer />}>
      <HeaderSection
        title={aboutSection.sectionName || aboutTranslation.title}
      />

      <Section id="about">
        <AboutSection />
      </Section>

      {isSectionEnabled("experience") && (
        <Section id="why">
          <WhyUsSection />
        </Section>
      )}

      {isSectionEnabled("clients") && (
        <Section id="clients">
          <ClientsSection />
        </Section>
      )}

      {isSectionEnabled("team") && (
        <Section id="team">
          <TeamSection />
        </Section>
      )}
    </PageLayout>
  );
}
