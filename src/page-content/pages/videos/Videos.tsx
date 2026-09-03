"use client";

import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/section/Section";
import { useLanguage } from "@/core/runtime";
import Footer from "@/page-content/components/footer/Footer";
import Header from "@/page-content/components/header/Header";
import HeaderSection from "@/page-content/components/section/header/HeaderSection";
import VideoSection from "@/page-content/components/section/video/VideoSection";
import { getVideosTranslation } from "@/core/translations";

export default function VideosPage() {
  const { lang } = useLanguage();
  const videosTranslation = getVideosTranslation(lang);

  return (
    <PageLayout header={<Header />} footer={<Footer />}>
      <HeaderSection title={videosTranslation.title} />

      <Section id="videos">
        <VideoSection />
      </Section>
    </PageLayout>
  );
}
