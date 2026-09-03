"use client";

import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/section/Section";
import { useLanguage } from "@/core/runtime";
import Footer from "@/page-content/components/footer/Footer";
import Header from "@/page-content/components/header/Header";
import BlogSection from "@/page-content/components/section/blog/BlogSection";
import HeaderSection from "@/page-content/components/section/header/HeaderSection";
import { getBlogTranslation } from "@/core/translations";

export default function BlogPage() {
  const { lang } = useLanguage();
  const blogTranslation = getBlogTranslation(lang);
  
  return (
    <PageLayout header={<Header />} footer={<Footer />}>
      <HeaderSection title={blogTranslation.title} />

      <Section id="blog">
        <BlogSection />
      </Section>
    </PageLayout>
  );
}
