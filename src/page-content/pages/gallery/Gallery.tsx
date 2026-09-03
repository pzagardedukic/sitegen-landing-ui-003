"use client";

import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/section/Section";
import { useLanguage } from "@/core/runtime";
import Footer from "@/page-content/components/footer/Footer";
import Header from "@/page-content/components/header/Header";
import GallerySection from "@/page-content/components/section/gallery/GallerySection";
import HeaderSection from "@/page-content/components/section/header/HeaderSection";
import { getGalleryTranslation } from "@/core/translations";

export default function GalleryPage() {
  const { lang } = useLanguage();
  const galleryTranslation = getGalleryTranslation(lang);

  return (
    <PageLayout header={<Header />} footer={<Footer />}>
      <HeaderSection title={galleryTranslation.title} />

      <Section id="gallery">
        <GallerySection />
      </Section>
    </PageLayout>
  );
}